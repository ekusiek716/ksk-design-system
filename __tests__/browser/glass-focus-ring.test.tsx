import { describe, expect, it, afterEach, vi } from "vitest"
import { createRoot, type Root } from "react-dom/client"
import { act } from "react"
import { userEvent } from "vitest/browser"
import { Button } from "@/components/ui/button"
import { BottomTabBar } from "@/components/patterns/commerce/bottom-tab-bar"
import "@/index.css"

/**
 * .glass 系の素材クラスは非レイヤー CSS で box-shadow を宣言するため、レイヤー内の
 * Tailwind `focus-visible:ring-*`（box-shadow で描く）に詳細度と無関係に勝ち、
 * Button の glass / glass-inverse / glass-accent はキーボードフォーカスしても
 * リングが一切出なかった（本テストの前身の実機プローブで確認）。
 *
 * glass.css は素材クラスの box-shadow の先頭に --ksk-glass-focus-ring を置き、
 * 操作子が :focus-visible のときだけ二重リング（内側 2px 白 + 外側 2px Gray-900）を入れる。
 * ガラスの影（highlight / shadow）は消さずに残す。
 *
 * computed style の box-shadow を見て検証する（クラス名の有無ではなく、実際に描かれるか）。
 * 色の比較は `rgb(...)` 文字列の部分一致。ring の色は Primitive の白 / Gray-900 固定。
 */

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let root: Root | undefined
let container: HTMLDivElement | undefined

afterEach(() => {
  if (root) {
    act(() => root!.unmount())
    root = undefined
  }
  container?.remove()
  container = undefined
})

function mount(node: React.ReactElement) {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => {
    root!.render(node)
  })
}

/** 外側リング: 内側 2px 白 + 外側 2px（合計 4px）の Gray-900 */
const OUTER_WHITE = "rgb(255, 255, 255) 0px 0px 0px 2px"
const OUTER_DARK = "rgb(24, 24, 27) 0px 0px 0px 4px"
/** 内側リング: 外側 2px Gray-900 + 内側 4px まで白 */
const INSET_DARK = "rgb(24, 24, 27) 0px 0px 0px 2px inset"
const INSET_WHITE = "rgb(255, 255, 255) 0px 0px 0px 4px inset"

describe("glass 系 Button のフォーカスリング", () => {
  const GLASS_VARIANTS = ["glass", "glass-inverse", "glass-accent"] as const

  for (const variant of GLASS_VARIANTS) {
    it(`${variant}: キーボードフォーカスで二重リングが出て、ガラスの影も残る`, async () => {
      mount(<Button variant={variant}>送信</Button>)
      const button = container!.querySelector("button")!

      // フォーカス前: リングは無く、ガラスの影だけ（回帰の対比）
      const before = getComputedStyle(button).boxShadow
      expect(before).not.toContain(OUTER_DARK)
      expect(before).toContain("rgba(0, 0, 0, 0.16) 0px 14px 40px -10px")

      await userEvent.tab()
      expect(document.activeElement).toBe(button)

      const after = getComputedStyle(button).boxShadow
      expect(after).toContain(OUTER_WHITE)
      expect(after).toContain(OUTER_DARK)
      // リングを足しただけでガラスの影（glass-shadow の 3 枚）は消えない
      expect(after).toContain("rgba(0, 0, 0, 0.16) 0px 14px 40px -10px")
      expect(after).toContain("rgba(0, 0, 0, 0.1) 0px 4px 12px -4px")
      // リングは影より前（= 手前）に描かれる
      expect(after.indexOf(OUTER_DARK)).toBeLessThan(after.indexOf("rgba(0, 0, 0, 0.16)"))
    })
  }

  it("対照: glass ではない Button（default）は従来どおり Tailwind の ring で描かれる", async () => {
    mount(<Button>送信</Button>)
    const button = container!.querySelector("button")!
    await userEvent.tab()
    expect(document.activeElement).toBe(button)
    // default は面と同色になるため ring-offset-2（Surface-Primary のすき間）を持つ
    expect(getComputedStyle(button).boxShadow).toContain("rgb(255, 255, 255) 0px 0px 0px 2px")
  })

  it("素材クラスだけの非操作要素（div）は、フォーカスされてもリングを出さない", async () => {
    mount(
      <div className="glass" tabIndex={0}>
        面
      </div>,
    )
    const surface = container!.querySelector("div")!
    await userEvent.tab()
    expect(document.activeElement).toBe(surface)
    expect(getComputedStyle(surface).boxShadow).not.toContain(OUTER_DARK)
  })

  it("入れ子のガラスは、フォーカス中の親のリングを引き継がない", async () => {
    mount(
      <button className="glass" type="button">
        <span className="glass" data-testid="inner">
          内側
        </span>
      </button>,
    )
    const button = container!.querySelector("button")!
    const inner = container!.querySelector("span")!
    await userEvent.tab()
    expect(document.activeElement).toBe(button)
    expect(getComputedStyle(button).boxShadow).toContain(OUTER_DARK)
    expect(getComputedStyle(inner).boxShadow).not.toContain(OUTER_DARK)
  })

  it("消費側は --glass-focus-ring を上書きしてリングを変えられる", async () => {
    mount(
      <div style={{ "--glass-focus-ring": "0 0 0 6px rgb(255, 0, 0)" } as React.CSSProperties}>
        <Button variant="glass">送信</Button>
      </div>,
    )
    await userEvent.tab()
    const button = container!.querySelector("button")!
    // glass 系 Button は transition-all。リングの層の形が同じ置き換えは補間されるため、
    // 遷移が終わるまで待ってから computed を見る
    await vi.waitFor(() => {
      expect(getComputedStyle(button).boxShadow).toContain("rgb(255, 0, 0) 0px 0px 0px 6px")
    })
  })
})

describe("BottomTabBar（pill の中は overflow:hidden）のフォーカスリング", () => {
  it("中央アクションは内側の二重リングで、glass-accent の影も残る", async () => {
    mount(
      <BottomTabBar
        variant="pill"
        pillPosition="absolute"
        items={[
          { label: "ホーム", icon: <span />, isActive: true, onClick: () => {} },
          { label: "検索", icon: <span />, onClick: () => {} },
        ]}
        centerAction={{ label: "作成", icon: <span />, onClick: () => {} }}
      />,
    )
    const center = container!.querySelector<HTMLElement>('[data-slot="bottom-nav-center-action"]')!
    expect(center).not.toBeNull()
    center.focus()
    // programmatic focus は :focus-visible にならないことがあるため Tab で到達させる
    center.blur()
    for (let i = 0; i < 5 && document.activeElement !== center; i++) {
      await userEvent.tab()
    }
    expect(document.activeElement).toBe(center)

    const shadow = getComputedStyle(center).boxShadow
    // pill の中なので外側リングは切られる → 内側リング
    expect(shadow).toContain(INSET_DARK)
    expect(shadow).toContain(INSET_WHITE)
    expect(shadow).not.toContain(OUTER_DARK)
    // .glass-accent の影（外側ドロップシャドウ）は残る
    expect(shadow).toContain("rgba(0, 0, 0, 0.16) 0px 14px 40px -10px")
  })
})
