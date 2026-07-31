/**
 * @vitest-environment jsdom
 *
 * BottomSheetFrame / SideDrawerFrame — data-slot 上書き回帰テスト（Issue #139）
 *
 * 以前は両フレームが `<SheetContent data-slot="...-frame">` と渡していたが、
 * SheetContent 実装は自前で `data-slot="sheet-content"` を書いた後に
 * `{...props}` を spread するため、フレーム側の data-slot が上書きされて消える
 * のではなく、逆に data-slot="sheet-content" が消えていた（consumer が
 * `[data-slot="sheet-content"]` 前提で書いた CSS / closest() が
 * フレーム製シートにマッチしなくなる実害）。
 *
 * 修正: フレームは data-slot を渡さず、識別用に data-frame を付ける。
 * 結果として DOM には SheetContent 由来の data-slot="sheet-content" が残り、
 * かつフレーム識別用の data-frame も併存する。
 *
 * Sheet/SheetContent は Radix Dialog ベースで content は portal 経由で
 * document.body 配下に出るため、open 状態で実レンダリングして document 全体を
 * 検査する（SSR では portal 内容が観測できないため jsdom + 実 render）。
 *
 * 実行: npm run test
 */
import { describe, it, expect, afterEach } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import * as React from "react"

import { Sheet } from "../src/components/ui/sheet"
import { BottomSheetFrame } from "../src/components/patterns/bottom-sheet-frame"
import { SideDrawerFrame } from "../src/components/patterns/side-drawer-frame"
import { KeyboardAwareSheetFooter } from "../src/components/patterns/keyboard-aware-sheet-footer"

let container: HTMLElement | null = null
let root: Root | null = null

function mount(ui: React.ReactElement) {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => {
    root!.render(ui)
  })
}

afterEach(() => {
  if (root) {
    act(() => {
      root!.unmount()
    })
    root = null
  }
  if (container) {
    container.remove()
    container = null
  }
  document.body.innerHTML = ""
})

describe("BottomSheetFrame — data-slot / data-frame（Issue #139）", () => {
  it("open 時に portal 内容へ data-slot=sheet-content が残り、data-frame が付く", () => {
    mount(
      <Sheet open>
        <BottomSheetFrame>content</BottomSheetFrame>
      </Sheet>
    )

    const el = document.querySelector<HTMLElement>('[data-slot="sheet-content"]')
    expect(el).not.toBeNull()
    expect(el!.getAttribute("data-frame")).toBe("bottom-sheet-frame")
    // preset 属性も併存する（既存挙動）
    expect(el!.getAttribute("data-preset")).toBe("mobile-full")
    // フレームが data-slot を上書きしていないこと（誤って frame 名が入らない）
    expect(el!.getAttribute("data-slot")).toBe("sheet-content")
  })
})

describe("SideDrawerFrame — data-slot / data-frame（Issue #139）", () => {
  it("open 時に portal 内容へ data-slot=sheet-content が残り、data-frame が付く", () => {
    mount(
      <Sheet open>
        <SideDrawerFrame>content</SideDrawerFrame>
      </Sheet>
    )

    const el = document.querySelector<HTMLElement>('[data-slot="sheet-content"]')
    expect(el).not.toBeNull()
    expect(el!.getAttribute("data-frame")).toBe("side-drawer-frame")
    expect(el!.getAttribute("data-slot")).toBe("sheet-content")
  })
})

describe("Sheet frame surface（Issue #284）", () => {
  it("BottomSheetFrame surface=glass は snap modeを維持してglass素材を付ける", () => {
    mount(
      <Sheet open snapPoints={[0.4, 0.9]}>
        <BottomSheetFrame surface="glass">content</BottomSheetFrame>
      </Sheet>
    )

    const el = document.querySelector<HTMLElement>('[data-slot="sheet-content"]')
    expect(el?.hasAttribute("data-snap-active")).toBe(true)
    expect(el?.getAttribute("data-surface")).toBe("glass")
    expect(el?.classList.contains("glass-strong")).toBe(true)
  })

  it("SideDrawerFrame surface=glass はglass素材を付ける", () => {
    mount(
      <Sheet open>
        <SideDrawerFrame surface="glass">content</SideDrawerFrame>
      </Sheet>
    )

    const el = document.querySelector<HTMLElement>('[data-slot="sheet-content"]')
    expect(el?.getAttribute("data-surface")).toBe("glass")
    expect(el?.classList.contains("glass-strong")).toBe(true)
  })

  it("既定surfaceは従来の不透明surfaceを維持する", () => {
    mount(
      <Sheet open>
        <BottomSheetFrame>content</BottomSheetFrame>
      </Sheet>
    )

    const el = document.querySelector<HTMLElement>('[data-slot="sheet-content"]')
    expect(el?.getAttribute("data-surface")).toBe("default")
    expect(el?.classList.contains("glass-strong")).toBe(false)
  })

  it("KeyboardAwareSheetFooter はsafe-area recipeを保ったままglass化する", () => {
    mount(
      <KeyboardAwareSheetFooter surface="glass">actions</KeyboardAwareSheetFooter>
    )

    const el = document.querySelector<HTMLElement>(
      '[data-slot="keyboard-aware-sheet-footer"]'
    )
    expect(el?.getAttribute("data-surface")).toBe("glass")
    expect(el?.classList.contains("glass-strong")).toBe(true)
    expect(el?.className).toContain("safe-area-inset-bottom")
  })
})
