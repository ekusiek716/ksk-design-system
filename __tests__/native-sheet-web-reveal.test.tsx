/**
 * @vitest-environment jsdom
 *
 * issue #753: react-native-web 上で native の Sheet / ResponsiveDialog が
 * 約 0.8 秒止まってから一気に出た（Celebration の overlay カードも同じ仕組み）。
 *
 * react-native-web の Modal（animationType="none"）は、visible が true になった
 * commit の中で、子の useEffect から onShow を呼ぶ。React は子の effect を親より先に
 * 実行するため、部品側の open 処理（入口アニメーションの巻き戻しと onShow 不達の保険）が
 * onShow の後に走り、始まったばかりの入口アニメーションを止めていた。結果、
 * onShow 不達の保険（800ms）が切れるまでパネルは画面外に残り、最後に最終位置へ跳んだ。
 *
 * ここでは react-native を react-native-web に差し替えて実物の Modal / Animated で描き、
 * open の直後から毎フレーム動き始め、保険を待たずに出きることを確かめる。
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from "vitest"

vi.hoisted(() => {
  // react-native-web は NODE_ENV=test のとき Animated を「即座に最終値へ飛ぶ」代用品
  // （AnimatedMock）に差し替える。実物の JS driver で毎フレーム動かすため、
  // react-native-web を読み込む前に test 以外へ切り替える（React は開発版のまま）。
  vi.stubEnv("NODE_ENV", "development")
  // jsdom はレイアウトを持たず、react-native-web の Dimensions が読む
  // documentElement の寸法が 0 になる。スマホ幅の画面として 375×812 を与える
  // （Dimensions はモジュール読み込み時に寸法を取るため、import より前に置く）。
  Object.defineProperty(document.documentElement, "clientWidth", { configurable: true, get: () => 375 })
  Object.defineProperty(document.documentElement, "clientHeight", { configurable: true, get: () => 812 })
  // jsdom には matchMedia が無く、react-native-web の AccessibilityInfo が
  // 「視差効果を減らす」の購読を返さない（実ブラウザには常にある）。設定オフとして与える。
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
})
vi.mock("react-native", async () => await vi.importActual("react-native-web"))

import { Celebration } from "../src/native/components/Celebration"
import { ResponsiveDialog } from "../src/native/components/ResponsiveDialog"
import { Sheet } from "../src/native/components/Sheet"
import { ThemeProvider } from "../src/native/theme/ThemeProvider"

const TITLE = "この分野で学ぶこと"
const SCREEN_HEIGHT = 812
/** Sheet / Celebration の onShow 不達の保険（REVEAL_SHOW_FALLBACK_DELAY 等） */
const SHOW_FALLBACK_DELAY = 800

let container: HTMLElement
let root: Root
let warn: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
  // Web には native driver が無く JS driver へ落ちる旨の警告（想定どおり）だけ黙らせる
  const original = console.warn
  warn = vi.spyOn(console, "warn").mockImplementation((...args: unknown[]) => {
    if (String(args[0]).includes("useNativeDriver")) return
    original(...args)
  })
  vi.useFakeTimers()
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => {
    root.unmount()
  })
  container.remove()
  vi.useRealTimers()
  warn.mockRestore()
})

afterAll(() => {
  vi.unstubAllEnvs()
})

function render(node: React.ReactElement | null) {
  act(() => {
    root.render(<ThemeProvider>{node}</ThemeProvider>)
  })
}

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms)
  })
}

/** タイトルの文字を含む要素から、inline style に `prop` を持つ最も近い祖先を返す。 */
function closestStyled(prop: "transform" | "opacity"): HTMLElement {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  let node: Node | null
  while ((node = walker.nextNode())) {
    if (node.nodeValue?.includes(TITLE)) break
  }
  let el = node?.parentElement ?? null
  while (el && !el.style[prop]) el = el.parentElement
  if (!el) throw new Error(`タイトルの祖先に ${prop} が見つからない`)
  return el
}

function panelTranslateY(): number {
  const match = /translateY\((-?[\d.e]+)px\)/.exec(closestStyled("transform").style.transform)
  if (!match) throw new Error("パネルの translateY が見つからない")
  return Number(match[1])
}

const sheets = {
  // exam-kit の分野プレビューと同じ経路（スマホ幅では plain の下からの Sheet）
  "ResponsiveDialog（plain の Sheet）": {
    view: (open: boolean) => <ResponsiveDialog open={open} onClose={() => {}} title={TITLE} description="説明" />,
    closed: SCREEN_HEIGHT,
    settled: 0,
  },
  "Sheet（snap mode）": {
    view: (open: boolean) => (
      <Sheet open={open} onClose={() => {}} title={TITLE} snapPoints={[0.5, 0.9]}>
        {null}
      </Sheet>
    ),
    // パネル高（最大 snap）だけ下に隠れた位置から、初期 snap（0.5）の位置まで上がる
    closed: Math.round(SCREEN_HEIGHT * 0.9),
    settled: (0.9 - 0.5) * SCREEN_HEIGHT,
  },
}

/** open にした直後から入口アニメーションが動き、onShow 不達の保険を待たずに出きることを確かめる。 */
function expectRevealWithoutFallback(closed: number, settled: number) {
  expect(panelTranslateY()).toBeCloseTo(closed)

  // 数フレーム後には画面外から動き始め、まだ途中にいる（一気に跳んでいない）
  advance(100)
  const moving = panelTranslateY()
  expect(moving).toBeLessThan(closed)
  expect(moving).toBeGreaterThan(settled)

  // 入口アニメーション（≤ 220ms）を待てば最終位置に着いている
  advance(300)
  expect(panelTranslateY()).toBeCloseTo(settled)

  // 保険の時刻を過ぎても位置は変わらない
  advance(SHOW_FALLBACK_DELAY)
  expect(panelTranslateY()).toBeCloseTo(settled)
}

describe("native Sheet / ResponsiveDialog on react-native-web (#753)", () => {
  for (const [name, { view, closed, settled }] of Object.entries(sheets)) {
    it(`${name}: open 直後から入口アニメーションが動き、onShow 不達の保険を待たずに出きる`, () => {
      render(view(false))
      render(view(true))
      expectRevealWithoutFallback(closed, settled)
    })

    // exam-kit の分野プレビューは、初回はデータと open を同じ更新で渡すため、開いた状態で mount する
    it(`${name}: 開いた状態で mount しても直後から動く`, () => {
      render(null)
      render(view(true))
      expectRevealWithoutFallback(closed, settled)
    })

    it(`${name}: 閉じてから開き直しても直後から動く`, () => {
      render(view(true))
      advance(1_000)
      render(view(false))
      advance(1_000)
      render(view(true))
      expectRevealWithoutFallback(closed, settled)
    })
  }

  // snap mode の open 処理と onShow は configRef を読む。configRef の更新が open 処理より
  // 後（passive effect）だと、snapPoints を同じ更新で変えたとき古い snap で動き、
  // パネルが画面外に止まる。
  it("Sheet（snap mode）: snapPoints と open を同じ更新で変えても新しい snap の位置に出る", () => {
    const snap = (open: boolean, snapPoints: number[]) => (
      <Sheet open={open} onClose={() => {}} title={TITLE} snapPoints={snapPoints}>
        {null}
      </Sheet>
    )
    render(snap(false, [0.5, 0.9]))
    render(snap(true, [0.3, 0.6]))
    expectRevealWithoutFallback(Math.round(SCREEN_HEIGHT * 0.6), (0.6 - 0.3) * SCREEN_HEIGHT)
  })
})

describe("native Celebration（overlay）on react-native-web (#753)", () => {
  it("表示の直後からカードが現れ始め、保険を待たずに出きる", async () => {
    render(null)
    // 「視差効果を減らす」の初回取得（Promise）の state 更新も act の中で済ませる
    await act(async () => {
      root.render(
        <ThemeProvider>
          <Celebration active trigger="emoji" title={TITLE} />
        </ThemeProvider>,
      )
    })
    const card = () => Number(closestStyled("opacity").style.opacity)
    expect(card()).toBe(0)

    // カードの入場（opacity 160ms）は数フレームで動き始める
    advance(100)
    expect(card()).toBeGreaterThan(0)

    advance(300)
    expect(card()).toBe(1)
  })
})
