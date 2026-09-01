/**
 * @vitest-environment jsdom
 *
 * issue #487: 幅 1024px 以上のタッチ端末（iPad 横向き = 1024 / 1194 / 1366px）で
 * ResponsiveOverlayFrame が中央モーダルとして描画されたまま、ソフトキーボードに
 * 入力欄が隠れる問題の回帰テスト。
 *
 * 固定する契約は 3 つ:
 *  1. 補正は max-height だけ（`bottom` lift は絶対に当てない）。
 *     DialogContent は top:50% + translate-y:-50% で位置決めしているため、
 *     bottom を当てると両拘束になり高さが縦一杯へ引き伸ばされる。
 *  2. 中央寄せのキャップは `100dvh - 2*kb`（`- kb` では下端が潜り込む）。
 *  3. side="bottom"（preset / plain）/ float / float-glass の 3 経路すべてで
 *     デスクトップ分岐が対象属性（data-frame / data-side / data-position）を出す。
 *
 * CSS 側の踏み潰しは className を見るテストでは落とせないため、CSS 契約
 * （__tests__/sheet-keyboard-float.test.ts が前例）も併せて検証する。
 */
import { readFileSync } from "node:fs"
import { join } from "node:path"
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ResponsiveDialog } from "../src/components/ui/responsive-dialog"
import {
  ResponsiveOverlayFrame,
  resolveDesktopOverlayKeyboardStyle,
  resolveOverlayKeyboardInset,
} from "../src/components/patterns/responsive-overlay-frame"

/**
 * 期待される inline max-height。JS 検知（px）と CSS フォールバック
 * （--kb-h）の 2 つのキャップを、既定キャップと一緒に min() で畳む。
 */
function expectedMaxHeight(
  base: string | undefined,
  kb: number,
  position: "center" | "top" | "fullscreen" = "center",
  safeArea = true
) {
  const capFor = (inset: string, doubled: string) =>
    position === "fullscreen"
      ? `max(0px, calc(100dvh - ${inset}))`
      : position === "top"
        ? `max(0px, calc(100dvh - ${inset} - ${
            safeArea ? "max(env(safe-area-inset-top, 0px), 2rem)" : "2rem"
          } - 2rem))`
        : `max(0px, calc(100dvh - ${doubled}))`
  const caps = [
    capFor(`${kb}px`, `${kb * 2}px`),
    capFor("var(--kb-h-active, 0px)", "2 * var(--kb-h-active, 0px)"),
  ]
  return `min(${(base ? [base, ...caps] : caps).join(", ")})`
}

/** preset="mobile-form" の既定キャップ（desktopPresetClasses と同値）。 */
const BASE = "min(85dvh, 40rem)"

describe("resolveDesktopOverlayKeyboardStyle — 中央モーダルのキーボード補正", () => {
  it("キーボード非表示ではスタイルを返さない", () => {
    expect(resolveDesktopOverlayKeyboardStyle(0, "center", BASE, true)).toBeUndefined()
  })

  it("中央寄せはキーボード高さの 2 倍を引く（両側に均等に食われるため）", () => {
    expect(resolveDesktopOverlayKeyboardStyle(300, "center", BASE, true)).toEqual({
      maxHeight: expectedMaxHeight(BASE, 300),
    })
  })

  it("lift（bottom）は絶対に返さない — top/bottom 両拘束で高さが飛ぶため", () => {
    for (const position of ["center", "top", "fullscreen"] as const) {
      const style = resolveDesktopOverlayKeyboardStyle(300, position)
      expect(style == null || !("bottom" in style)).toBe(true)
    }
  })

  it("position=\"top\" は上端固定なので 1 回分 + 上下オフセットを引く", () => {
    expect(resolveDesktopOverlayKeyboardStyle(300, "top", BASE, true)).toEqual({
      maxHeight: expectedMaxHeight(BASE, 300, "top"),
    })
  })

  // fullscreen は inset-0 h-full の上端固定。h-full は max-height に負けるので、
  // キーボード 1 回分を引けば面が可視領域へ縮み、内側のスクロール領域は残る。
  it("position=\"fullscreen\" はキーボード 1 回分を引く", () => {
    expect(resolveDesktopOverlayKeyboardStyle(300, "fullscreen", BASE, true)).toEqual({
      maxHeight: expectedMaxHeight(BASE, 300, "fullscreen"),
    })
  })

  it("キャップは 0 で下限を切る（max(0px, …) を必ず含む）", () => {
    expect(resolveDesktopOverlayKeyboardStyle(9999, "center", BASE, true)?.maxHeight).toContain(
      "max(0px,"
    )
  })
})

describe("resolveDesktopOverlayKeyboardStyle — safeArea の opt-out", () => {
  // safeArea={false} のとき DialogContent は top-8 固定になるので、
  // キャップ側も env() を足さない（明示的な opt-out を無視して縮めない）。
  it("position=\"top\" + safeArea={false} は 2rem 固定で引く", () => {
    expect(
      resolveDesktopOverlayKeyboardStyle(300, "top", BASE, false)?.maxHeight
    ).toBe(expectedMaxHeight(BASE, 300, "top", false))
    expect(
      resolveDesktopOverlayKeyboardStyle(300, "top", BASE, false)?.maxHeight
    ).not.toMatch(/env\(safe-area-inset-top/)
  })

  it("safeArea 既定（true）では env() を含む", () => {
    expect(
      resolveDesktopOverlayKeyboardStyle(300, "top", BASE, true)?.maxHeight
    ).toMatch(/env\(safe-area-inset-top/)
  })
})

describe("resolveOverlayKeyboardInset — ズームとキーボードの切り分け", () => {
  it("等倍・キーボードなしでは 0", () => {
    expect(resolveOverlayKeyboardInset(768, 768, 0, 1)).toBe(0)
  })

  it("等倍ではレイアウト高との差がそのままキーボード高さ", () => {
    expect(resolveOverlayKeyboardInset(768, 468, 0, 1)).toBe(300)
  })

  // 200% ズームだけなら可視高さは半分になるが、キーボードは出ていない。
  it("ズームだけなら 0（ズーム分は倍率で打ち消す）", () => {
    expect(resolveOverlayKeyboardInset(768, 384, 0, 2)).toBe(0)
  })

  // ズームしたまま入力欄にフォーカスしてキーボードが出たケース。
  // 可視高さ (768 - 300) / 2 = 234 から、キーボード分の 300 だけを取り出す。
  it("ズーム中でもキーボード分だけを取り出す", () => {
    expect(resolveOverlayKeyboardInset(768, 234, 0, 2)).toBe(300)
  })

  it("ズームしてスクロールした分（offsetTop）も倍率で戻す", () => {
    expect(resolveOverlayKeyboardInset(768, 234, 50, 2)).toBe(200)
  })

  it("1px 未満のゆらぎは 0 に丸める", () => {
    expect(resolveOverlayKeyboardInset(768, 767.6, 0, 1)).toBe(0)
  })

  it("scale が壊れていても等倍として扱う", () => {
    expect(resolveOverlayKeyboardInset(768, 468, 0, Number.NaN)).toBe(300)
  })
})

describe("sheet-keyboard.css — dialog-content フォールバック契約", () => {
  const css = readFileSync(
    join(__dirname, "..", "src/styles/sheet-keyboard.css"),
    "utf8"
  )

  /**
   * `html[data-kb-open]` 配下で dialog-content の高さを決めているルール。
   * カスタムプロパティだけを置くルール（--kb-h-active）は対象外。
   */
  const dialogRules = [
    ...css.matchAll(
      /html\[data-kb-open\]\s*\n?\s*\[data-slot="dialog-content"\][^{]*\{([^}]*)\}/g
    ),
  ].filter(([, body]) => body.includes("max-height"))

  it("dialog-content 向けのキーボードルールが存在する", () => {
    expect(dialogRules.length).toBeGreaterThan(0)
  })

  it("ResponsiveOverlayFrame の面だけをスコープする", () => {
    expect(css).toMatch(
      /\[data-slot="dialog-content"\]\[data-frame="responsive-overlay-frame"\]/
    )
  })

  it("宣言は max-height だけ（bottom / top / inset は書かない）", () => {
    for (const [, body] of dialogRules) {
      expect(body).toMatch(/max-height:/)
      expect(body).not.toMatch(/(^|[\s;])(bottom|top|inset[a-z-]*)\s*:/)
    }
  })

  it("中央寄せは 2 * var(--kb-h) を引く", () => {
    expect(css).toMatch(
      /\[data-position="center"\]:not\(\[data-kb-measuring\]\)\s*\{\s*max-height:\s*min\(\s*var\(--Overlay-Desktop-Base-Max-Height,\s*100dvh\),\s*max\(0px,\s*calc\(100dvh\s*-\s*2\s*\*\s*var\(--kb-h,\s*0px\)\)\)/
    )
  })

  // --kb-h の意味を明文化しておく（レイアウトが縮む環境で覆い高さを書くと
  // 100dvh から二重に引いて面が潰れる）。契約が消えたら気づけるようにする。
  // inline style は祖先の属性を見られないので、data-kb-open で開閉する
  // 別変数（--kb-h-active）を CSS 側で用意している必要がある。
  // safeArea={false} は top-8 固定なので、フォールバック側も env() を足さない。
  it("safeArea={false} 用の top ルールがある", () => {
    expect(css).toMatch(
      /\[data-position="top"\]\[data-safe-area="false"\]:not\(\[data-kb-measuring\]\)/
    )
    const rule = css.match(
      /\[data-position="top"\]\[data-safe-area="false"\][^{]*\{([^}]*)\}/
    )?.[1]
    expect(rule).toBeDefined()
    expect(rule).not.toMatch(/env\(safe-area-inset-top/)
  })

  it("--kb-h-active を data-kb-open で開閉している", () => {
    expect(css).toMatch(
      /\[data-slot="dialog-content"\]\[data-frame="responsive-overlay-frame"\]\s*\{\s*--kb-h-active:\s*0px/
    )
    expect(css).toMatch(
      /html\[data-kb-open\][\s\S]{0,120}--kb-h-active:\s*var\(--kb-h,\s*0px\)/
    )
  })

  it("--kb-h が「覆っている高さ」であることを明記している", () => {
    expect(css).toMatch(/覆っている高さ/)
    expect(css).toMatch(/resizes-content/)
  })

  it("実測中（data-kb-measuring）は自分を除外する", () => {
    for (const [, body] of dialogRules) {
      void body
    }
    const matches = css.match(/\[data-position="[a-z]+"\]:not\(\[data-kb-measuring\]\)/g)
    expect(matches?.length).toBe(3)
  })

  it("position=\"top\" / \"fullscreen\" のルールもある", () => {
    expect(css).toMatch(/\[data-position="top"\]/)
    expect(css).toMatch(
      /\[data-position="fullscreen"\]:not\(\[data-kb-measuring\]\)\s*\{\s*max-height:\s*min\(\s*var\(--Overlay-Desktop-Base-Max-Height,\s*100dvh\),\s*max\(0px,\s*calc\(100dvh\s*-\s*var\(--kb-h,\s*0px\)\)\)/
    )
  })
})

/** viewport 幅を px で与え、matchMedia を `(min-width: Npx)` に応答させる。 */
function stubViewport(width: number) {
  vi.stubGlobal("matchMedia", (query: string) => {
    const match = /min-width:\s*(\d+(?:\.\d+)?)px/.exec(query)
    const min = match ? Number(match[1]) : Number.POSITIVE_INFINITY
    return {
      matches: width >= min,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }
  })
}

/**
 * iPad 横向き相当（1024px 幅・タッチ）の visualViewport を作る。
 *
 * `viewportDelta` は **可視高さの縮み分（CSS px）** で、キーボード高さそのもの
 * ではない。ズーム中は `visualViewport.height` がズーム後のページ CSS px に
 * なるため、たとえば 200% ズーム + キーボード 300px の可視高さは
 * `(768 - 300) / 2 = 234` で、delta は `768 - 234` になる。
 */
function stubKeyboard(layoutHeight: number, viewportDelta: number, scale = 1) {
  vi.stubGlobal("innerHeight", layoutHeight)
  vi.stubGlobal("visualViewport", {
    height: layoutHeight - viewportDelta,
    offsetTop: 0,
    scale,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })
}

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.unstubAllGlobals()
})

type FrameProps = React.ComponentProps<typeof ResponsiveOverlayFrame>

function renderFrame(frameProps: Partial<FrameProps>, focusInput = true) {
  act(() =>
    root.render(
      <ResponsiveDialog open onOpenChange={() => {}} breakpoint="lg">
        {/* 判別ユニオンなので呼び出し側でだけ緩める。 */}
        <ResponsiveOverlayFrame
          description="テスト"
          {...(frameProps as FrameProps)}
        >
          <input data-testid="field" />
        </ResponsiveOverlayFrame>
      </ResponsiveDialog>
    )
  )
  const el = document.querySelector<HTMLElement>('[data-slot="dialog-content"]')
  if (!el) throw new Error("中央モーダル（dialog-content）が描画されていない")
  // ソフトキーボードは編集可能な要素へのフォーカス無しには出ない。
  // 実装もそれを AND 条件にしているので、テストでも実際にフォーカスさせる。
  if (focusInput) {
    const input = el.querySelector<HTMLInputElement>('[data-testid="field"]')
    act(() => input?.focus())
  }
  return el
}

/**
 * フォーカス判定は次のタスクへ逃がしてある（Radix の FocusScope が commit 中に
 * 同期 focus() を呼ぶため）ので、1 tick 進めて反映を待つ。
 */
async function flushFocus() {
  await act(async () => {
    await new Promise((r) => setTimeout(r, 0))
  })
}

describe("ResponsiveOverlayFrame — iPad 横向き（1024px + キーボード）", () => {
  // preset / plain / float / float-glass の 4 経路（issue の受け入れ条件は
  // bottom(preset) / float / plain の 3 経路 + float-glass も同じ扱い）。
  // [表示名, props, 既定キャップ（className の max-h-[...] と同値）]
  const routes: Array<[string, Partial<FrameProps>, string]> = [
    ["preset（side=\"bottom\"）", { preset: "mobile-form" }, "min(85dvh, 40rem)"],
    ["plain", { preset: "plain" }, "min(90dvh, 46rem)"],
    ["float", { side: "float" }, "min(85dvh, 46rem)"],
    ["float-glass", { side: "float-glass" }, "min(85dvh, 46rem)"],
  ]

  for (const [name, props, base] of routes) {
    it(`${name}: 1024px でキーボードが出ると max-height だけが縮む`, async () => {
      stubViewport(1024)
      stubKeyboard(768, 300)
      const el = renderFrame(props)
      await flushFocus()

      // 補正は既定キャップを緩めない（min で畳む / #487）。
      expect(el.style.maxHeight).toBe(expectedMaxHeight(base, 300))
      // lift は当てない（当てると top/bottom 両拘束で高さが飛ぶ）。
      expect(el.style.bottom).toBe("")
      expect(el.style.top).toBe("")
    })

    it(`${name}: 補正の対象を絞る属性が揃っている`, () => {
      stubViewport(1024)
      const el = renderFrame(props)

      expect(el.getAttribute("data-frame")).toBe("responsive-overlay-frame")
      expect(el.getAttribute("data-position")).toBe("center")
      expect(el.getAttribute("data-side")).toBe(
        props.side ?? "bottom"
      )
    })
  }

  it("desktopPosition=\"fullscreen\" も可視領域へ縮む（内側のスクロールは残る）", async () => {
    stubViewport(1024)
    stubKeyboard(768, 300)
    const el = renderFrame({
      preset: "mobile-full",
      desktopPosition: "fullscreen",
    } as Partial<FrameProps>)
    await flushFocus()

    expect(el.getAttribute("data-position")).toBe("fullscreen")
    expect(el.style.maxHeight).toBe(
      expectedMaxHeight("min(90dvh, 44rem)", 300, "fullscreen")
    )
    expect(el.style.bottom).toBe("")
  })

  // visualViewport はピンチズームでも縮む。iPad 横向きはズームを使う端末なので、
  // 編集可能な要素へのフォーカスが無い縮みは補正しない（Codex レビュー指摘）。
  it("ピンチズーム相当（入力欄にフォーカスが無い）では補正しない", async () => {
    stubViewport(1024)
    stubKeyboard(768, 300)
    const el = renderFrame({ preset: "mobile-form" }, false)
    // Dialog の autoFocus が入力欄へ入るので、ズームだけの状態を作るために外す。
    // focusout の再判定は次のタスクで走るため、1 tick 進めてから確認する。
    await act(async () => {
      ;(document.activeElement as HTMLElement | null)?.blur()
      await new Promise((r) => setTimeout(r, 0))
    })
    expect(document.activeElement).not.toBe(
      el.querySelector('[data-testid="field"]')
    )
    expect(el.style.maxHeight).toBe("")
  })

  // 入力欄にフォーカスしたままのピンチズームは focus ゲートを素通りするので、
  // 倍率で打ち消す側（resolveOverlayKeyboardInset）が効いている必要がある。
  it("ズームだけ（キーボード無し）では補正しない", () => {
    stubViewport(1024)
    // 200% ズーム: 可視高さは 768 / 2 = 384（delta 384）。キーボードは出ていない。
    stubKeyboard(768, 768 - 384, 2)
    const el = renderFrame({ preset: "mobile-form" })
    expect(document.activeElement).toBe(
      el.querySelector('[data-testid="field"]')
    )
    expect(el.style.maxHeight).toBe("")
  })

  // 逆に「ズームしたままキーボードが出た」を丸ごと落としてはいけない。
  it("ズーム中にキーボードが出たらキーボード分だけ補正する", async () => {
    stubViewport(1024)
    // 200% ズーム + キーボード 300px: 可視高さは (768 - 300) / 2 = 234。
    stubKeyboard(768, 768 - 234, 2)
    const el = renderFrame({ preset: "mobile-form" })
    await flushFocus()
    expect(el.style.maxHeight).toBe(expectedMaxHeight(BASE, 300))
    expect(el.style.bottom).toBe("")
  })

  // contenteditable は "true" だけでなく値なし / "plaintext-only" も編集可能。
  // これを取りこぼすと、リッチテキスト欄を持つ面で補正が効かない。
  it.each([["", "値なし"], ["plaintext-only", "plaintext-only"], ["true", "true"]])(
    'contenteditable="%s"（%s）にフォーカスしていても補正する',
    async (value) => {
      stubViewport(1024)
      stubKeyboard(768, 300)
      const el = renderFrame({ preset: "mobile-form" }, false)
      const editor = document.createElement("div")
      editor.setAttribute("contenteditable", value)
      editor.tabIndex = 0
      el.appendChild(editor)
      // 先に input のフォーカスを外し、「editor へのフォーカスだけ」で
      // 補正が入ることを見る（初期状態からの変化を確実にする）。
      act(() => (document.activeElement as HTMLElement | null)?.blur())
      act(() => editor.focus())
      await flushFocus()

      expect(el.style.maxHeight).toBe(expectedMaxHeight(BASE, 300))
    }
  )

  it('contenteditable="false" は編集可能とみなさない', async () => {
    stubViewport(1024)
    stubKeyboard(768, 300)
    const el = renderFrame({ preset: "mobile-form" }, false)
    const editor = document.createElement("div")
    editor.setAttribute("contenteditable", "false")
    editor.tabIndex = 0
    el.appendChild(editor)
    act(() => editor.focus())
    await flushFocus()

    expect(el.style.maxHeight).toBe("")
  })

  it("キーボードが出ていなければ inline の max-height は付かない", () => {
    stubViewport(1024)
    const el = renderFrame({ preset: "mobile-form" })
    expect(el.style.maxHeight).toBe("")
  })

  // zIndex は DialogContent がモーダルスタックの値で上書きするため、
  // 素通しされる別プロパティで「style を丸ごと落としていない」ことを見る。
  it("consumer の style は落とさずに残す", async () => {
    stubViewport(1024)
    stubKeyboard(768, 300)
    const el = renderFrame({
      preset: "mobile-form",
      style: { outlineOffset: "3px" },
    } as Partial<FrameProps>)
    await flushFocus()
    expect(el.style.outlineOffset).toBe("3px")
    expect(el.style.maxHeight).toBe(expectedMaxHeight(BASE, 300))
  })

  // React は数値の maxHeight を px として解釈する。min() へそのまま埋めると
  // "min(640, …)" になり長さとして不正なので、宣言ごと無視されてしまう。
  it.each([
    [640, "640px"],
    ["30rem", "30rem"],
  ])("consumer の maxHeight (%s) を既定キャップとして畳む", async (value, expected) => {
    stubViewport(1024)
    stubKeyboard(768, 300)
    const el = renderFrame({
      preset: "mobile-form",
      style: { maxHeight: value },
    } as Partial<FrameProps>)
    await flushFocus()

    expect(el.style.getPropertyValue("--Overlay-Desktop-Base-Max-Height")).toBe(
      expected
    )
    expect(el.style.maxHeight).toBe(expectedMaxHeight(expected, 300))
  })

  // モバイル（Sheet）分岐では ref が素通しなので、デスクトップ分岐だけ
  // 計測用の ref で握り潰すと、境界を跨いだ瞬間に consumer の ref が空になる。
  it("consumer の ref にも面の DOM が渡る（object / callback 両方）", () => {
    stubViewport(1024)
    const objectRef = React.createRef<HTMLDivElement>()
    const seen: Array<HTMLElement | null> = []

    const el = renderFrame({
      preset: "mobile-form",
      ref: objectRef,
    } as Partial<FrameProps>)
    expect(objectRef.current).toBe(el)

    act(() => root.unmount())
    root = createRoot(container)
    const el2 = renderFrame({
      preset: "mobile-form",
      ref: (node: HTMLDivElement | null) => seen.push(node),
    } as Partial<FrameProps>)
    expect(seen).toContain(el2)
  })

  // React 18 のコールバック ref は戻り値を許さない（"Unexpected return value
  // from a callback ref" の警告）ので、cleanup を返すのは consumer が
  // cleanup を返したときだけ。返さない場合は React が ref(null) を呼ぶ。
  it("cleanup を返さない consumer ref にはアンマウントで null が渡る", () => {
    stubViewport(1024)
    const seen: Array<HTMLElement | null> = []
    renderFrame({
      preset: "mobile-form",
      ref: (node: HTMLDivElement | null) => {
        seen.push(node)
      },
    } as Partial<FrameProps>)
    expect(seen.filter(Boolean)).toHaveLength(1)

    act(() => root.unmount())
    root = createRoot(container)
    expect(seen).toContain(null)
  })

  it("cleanup を返す consumer ref はアンマウントで cleanup が呼ばれる", () => {
    stubViewport(1024)
    const cleanup = vi.fn()
    renderFrame({
      preset: "mobile-form",
      ref: () => cleanup,
    } as unknown as Partial<FrameProps>)
    expect(cleanup).not.toHaveBeenCalled()

    act(() => root.unmount())
    root = createRoot(container)
    expect(cleanup).toHaveBeenCalledTimes(1)
  })

  // 既定キャップは desktopClassName でも締められる。実測（computed）を
  // 基準にしているので、className 由来の締めも緩めない。
  it("desktopClassName の高さ上書きも既定キャップとして畳む", async () => {
    stubViewport(1024)
    stubKeyboard(768, 300)
    // jsdom は Tailwind の任意値クラスを解決しないので、computed 値を直接与える。
    const spy = vi
      .spyOn(window, "getComputedStyle")
      .mockImplementation(
        () => ({ maxHeight: "60vh" }) as unknown as CSSStyleDeclaration
      )
    try {
      const el = renderFrame({
        preset: "mobile-form",
        // 既に safelist にあるクラスを使う（テスト専用の任意値を書くと
        // 生成器が製品の @source inline に拾ってしまう）。
        desktopClassName: "max-h-[60vh]",
      } as Partial<FrameProps>)
      await flushFocus()

      // 経路の既定（40rem）ではなく実測の 60vh が基準になる。
      expect(el.style.maxHeight).toBe(expectedMaxHeight("60vh", 300))
      expect(
        el.style.getPropertyValue("--Overlay-Desktop-Base-Max-Height")
      ).toBe("60vh")
    } finally {
      spy.mockRestore()
    }
  })

  // Sheet → Dialog へ切り替わった直後にすでにキーボードが出ている
  // （iPad を境界跨ぎで回転した等）と、面の初回マウント時点で補正が有効。
  // ここで実測を諦めると className 由来のキャップを緩めてしまう。
  it("マウント時点でキーボードが出ていても className の上書きを実測する", async () => {
    stubViewport(1024)
    stubKeyboard(768, 300)
    const spy = vi
      .spyOn(window, "getComputedStyle")
      .mockImplementation(
        () => ({ maxHeight: "60vh" }) as unknown as CSSStyleDeclaration
      )
    try {
      // フォーカスは autoFocus で最初から入る = 初回マウントから補正が有効。
      const el = renderFrame({
        preset: "mobile-form",
        desktopClassName: "max-h-[60vh]",
      } as Partial<FrameProps>)
      await flushFocus()

      expect(el.style.maxHeight).toBe(expectedMaxHeight("60vh", 300))
    } finally {
      spy.mockRestore()
    }
  })

  // 実測のために inline を外すとき、空にすると consumer が締めたキャップまで
  // 消えて preset の緩い値を測ってしまう。consumer の宣言へ戻して測ること。
  it("実測のあいだ consumer の inline maxHeight を保つ", async () => {
    stubViewport(1024)
    stubKeyboard(768, 300)
    const seen: string[] = []
    const spy = vi
      .spyOn(window, "getComputedStyle")
      .mockImplementation((node) => {
        seen.push((node as HTMLElement).style?.maxHeight ?? "")
        return { maxHeight: "30rem" } as unknown as CSSStyleDeclaration
      })
    try {
      const el = renderFrame({
        preset: "mobile-form",
        style: { maxHeight: "30rem" },
      } as Partial<FrameProps>)
      await flushFocus()

      // 補正が当たっている間の測定でも、面の inline は consumer の宣言
      // （空ではない）に戻されている。
      expect(seen.some((v) => v === "30rem")).toBe(true)
      expect(el.style.maxHeight).toBe(expectedMaxHeight("30rem", 300))
    } finally {
      spy.mockRestore()
    }
  })

  // className が途中で締まる（多段フォーム等）ときに測り直さないと、
  // 古い基準の inline 値が新しい class を押しのけ続ける。
  it("className が変わったら実効キャップを測り直す", async () => {
    stubViewport(1024)
    stubKeyboard(768, 300)
    let computedMaxHeight = "40rem"
    const spy = vi
      .spyOn(window, "getComputedStyle")
      .mockImplementation(
        () => ({ maxHeight: computedMaxHeight }) as unknown as CSSStyleDeclaration
      )
    try {
      const render = (desktopClassName: string) =>
        act(() =>
          root.render(
            <ResponsiveDialog open onOpenChange={() => {}} breakpoint="lg">
              <ResponsiveOverlayFrame
                preset="mobile-form"
                description="テスト"
                desktopClassName={desktopClassName}
              >
                <input data-testid="field" />
              </ResponsiveOverlayFrame>
            </ResponsiveDialog>
          )
        )
      render("max-h-[60vh]")
      await flushFocus()
      const el = document.querySelector<HTMLElement>(
        '[data-slot="dialog-content"]'
      )!
      expect(el.style.maxHeight).toBe(expectedMaxHeight("40rem", 300))

      // consumer がキャップを締める → 実測し直して新しい値で畳む。
      computedMaxHeight = "20rem"
      render("max-h-[40vh]")
      await flushFocus()
      expect(el.style.maxHeight).toBe(expectedMaxHeight("20rem", 300))
    } finally {
      spy.mockRestore()
    }
  })

  // preset / side / desktopPosition は recipe（= class の max-h）を決めるので、
  // これらが変わったときも測り直す必要がある。
  it("preset が変わったら実効キャップを測り直す", async () => {
    stubViewport(1024)
    stubKeyboard(768, 300)
    let computedMaxHeight = "44rem"
    const spy = vi
      .spyOn(window, "getComputedStyle")
      .mockImplementation(
        () => ({ maxHeight: computedMaxHeight }) as unknown as CSSStyleDeclaration
      )
    try {
      const render = (preset: "mobile-full" | "mobile-form") =>
        act(() =>
          root.render(
            <ResponsiveDialog open onOpenChange={() => {}} breakpoint="lg">
              <ResponsiveOverlayFrame preset={preset} description="テスト">
                <input data-testid="field" />
              </ResponsiveOverlayFrame>
            </ResponsiveDialog>
          )
        )
      render("mobile-full")
      await flushFocus()
      const el = document.querySelector<HTMLElement>(
        '[data-slot="dialog-content"]'
      )!
      expect(el.style.maxHeight).toBe(expectedMaxHeight("44rem", 300))

      computedMaxHeight = "40rem"
      render("mobile-form")
      await flushFocus()
      expect(el.style.maxHeight).toBe(expectedMaxHeight("40rem", 300))
    } finally {
      spy.mockRestore()
    }
  })

  // max-height としては妥当でも min() の被演算子にできない値がある。
  // min(none, …) のような宣言はまるごと捨てられ、補正が消えてしまう。
  it.each([["none"], ["fit-content"], ["fit-content(20rem)"], ["auto"]])(
    'consumer の maxHeight が "%s" なら畳まずキーボード由来だけを当てる',
    async (value) => {
      stubViewport(1024)
      stubKeyboard(768, 300)
      const el = renderFrame({
        preset: "mobile-form",
        style: { maxHeight: value },
      } as Partial<FrameProps>)
      await flushFocus()

      expect(el.style.maxHeight).toBe(expectedMaxHeight(undefined, 300))
      expect(
        el.style.getPropertyValue("--Overlay-Desktop-Base-Max-Height")
      ).toBe("")
    }
  )

  it("パーセントは計算に使えるのでそのまま畳む", async () => {
    stubViewport(1024)
    stubKeyboard(768, 300)
    const el = renderFrame({
      preset: "mobile-form",
      style: { maxHeight: "50%" },
    } as Partial<FrameProps>)
    await flushFocus()

    expect(el.style.maxHeight).toBe(expectedMaxHeight("50%", 300))
  })

  it("モバイル幅ではデスクトップ補正は関与しない（シートのまま）", () => {
    stubViewport(390)
    stubKeyboard(768, 300)
    act(() =>
      root.render(
        <ResponsiveDialog open onOpenChange={() => {}} breakpoint="lg">
          <ResponsiveOverlayFrame preset="mobile-form" description="テスト">
            <div>本文</div>
          </ResponsiveOverlayFrame>
        </ResponsiveDialog>
      )
    )
    expect(document.querySelector('[data-slot="dialog-content"]')).toBeNull()
    expect(document.querySelector('[data-slot="sheet-content"]')).not.toBeNull()
  })
})
