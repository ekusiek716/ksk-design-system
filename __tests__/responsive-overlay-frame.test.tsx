/**
 * @vitest-environment jsdom
 *
 * issue #472: ResponsiveOverlayFrame が
 * 「モバイル = BottomSheetFrame の preset / デスクトップ = 中央モーダル」を
 * 1つの API で出し分けること、snap sheet は変換されないこと、境界が
 * breakpoint / breakpointQuery / product theme 変数で差し替わることを固定する。
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ResponsiveDialog } from "../src/components/ui/responsive-dialog"
import { DialogTitle } from "../src/components/ui/dialog"
import { SheetTitle } from "../src/components/ui/sheet"
import {
  ResponsiveOverlayFooter,
  ResponsiveOverlayFrame,
} from "../src/components/patterns/responsive-overlay-frame"

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
  document.documentElement.style.removeProperty("--Overlay-Desktop-Breakpoint")
  vi.unstubAllGlobals()
})

interface RenderFrameOptions {
  breakpoint?: React.ComponentProps<typeof ResponsiveDialog>["breakpoint"]
  breakpointQuery?: string
  snapPoints?: React.ComponentProps<typeof ResponsiveDialog>["snapPoints"]
  preset?: React.ComponentProps<typeof ResponsiveOverlayFrame>["preset"]
}

function renderFrame(props: RenderFrameOptions = {}) {
  act(() =>
    root.render(
      <ResponsiveDialog
        open
        onOpenChange={() => {}}
        breakpoint={props.breakpoint}
        breakpointQuery={props.breakpointQuery}
        snapPoints={props.snapPoints}
      >
        <ResponsiveOverlayFrame preset={props.preset} description="テスト">
          <ResponsiveOverlayFooter data-testid="footer">保存</ResponsiveOverlayFooter>
        </ResponsiveOverlayFrame>
      </ResponsiveDialog>
    )
  )
}

/** Sheet / Dialog は portal で body 直下に出るので document から探す。 */
const findFrame = () =>
  document.querySelector<HTMLElement>('[data-frame="responsive-overlay-frame"]')
const findSheetFrame = () =>
  document.querySelector<HTMLElement>('[data-frame="bottom-sheet-frame"]')

describe("ResponsiveOverlayFrame", () => {
  it("モバイル幅では BottomSheetFrame の preset をそのまま使う", () => {
    stubViewport(390)
    renderFrame({ preset: "mobile-form" })

    const sheet = findSheetFrame()
    expect(sheet).not.toBeNull()
    expect(sheet?.dataset.preset).toBe("mobile-form")
    expect(sheet?.dataset.slot).toBe("sheet-content")
    expect(findFrame()).toBeNull()
  })

  it("デスクトップ幅では中央モーダル（dialog-content）になり preset の寸法を持つ", () => {
    stubViewport(1200)
    renderFrame({ preset: "mobile-form" })

    const frame = findFrame()
    expect(frame).not.toBeNull()
    expect(frame?.dataset.slot).toBe("dialog-content")
    expect(frame?.dataset.preset).toBe("mobile-form")
    // consumer の !important 上書きなしで幅・高さ・角丸が決まること
    expect(frame?.className).toContain("sm:max-w-lg")
    expect(frame?.className).toContain("max-h-[min(85dvh,40rem)]")
    expect(frame?.className).toContain("rounded-[var(--Radius-Modal)]")
    expect(findSheetFrame()).toBeNull()
  })

  it("snapPoints 付きのシートはデスクトップ幅でもシートのまま", () => {
    stubViewport(1200)
    renderFrame({ snapPoints: [0.5, 0.9], preset: "mobile-full" })

    expect(findSheetFrame()).not.toBeNull()
    expect(findFrame()).toBeNull()
  })

  it("breakpoint=lg では 768〜1023px はまだシート", () => {
    stubViewport(900)
    renderFrame({ breakpoint: "lg" })
    expect(findSheetFrame()).not.toBeNull()

    act(() => root.unmount())
    root = createRoot(container)
    stubViewport(1100)
    renderFrame({ breakpoint: "lg" })
    expect(findFrame()).not.toBeNull()
  })

  it("breakpointQuery で生のメディアクエリを指定できる", () => {
    stubViewport(950)
    renderFrame({ breakpointQuery: "(min-width: 900px)" })
    expect(findFrame()).not.toBeNull()
  })

  it("breakpoint=product-theme は --Overlay-Desktop-Breakpoint を読む", () => {
    document.documentElement.style.setProperty("--Overlay-Desktop-Breakpoint", "1280px")
    // 1100px < 1280px なのでまだシート（既定の md=768px を使っていたら dialog になる）
    stubViewport(1100)
    renderFrame({ breakpoint: "product-theme" })
    expect(findSheetFrame()).not.toBeNull()
    expect(findFrame()).toBeNull()

    // 1300px >= 1280px なら中央モーダルへ切り替わる
    act(() => root.unmount())
    root = createRoot(container)
    stubViewport(1300)
    renderFrame({ breakpoint: "product-theme" })
    expect(findFrame()).not.toBeNull()
    expect(findSheetFrame()).toBeNull()
  })

  it("シート固有の prop がデスクトップの DOM へ漏れない", () => {
    stubViewport(1200)
    act(() =>
      root.render(
        <ResponsiveDialog open onOpenChange={() => {}}>
          <ResponsiveOverlayFrame preset="mobile-form" swipeToClose overlayClassName="x">
            <div>本文</div>
          </ResponsiveOverlayFrame>
        </ResponsiveDialog>
      )
    )
    const frame = findFrame()
    expect(frame).not.toBeNull()
    for (const attr of ["swipetoclose", "overlayclassname", "glassoverlay", "container"]) {
      expect(frame?.hasAttribute(attr)).toBe(false)
    }
  })

  it("全画面級 preset は両分岐で見出し階層（page スケール）が揃う", () => {
    const pageTypo = "typo-heading-2xl"

    stubViewport(390)
    act(() =>
      root.render(
        <ResponsiveDialog open onOpenChange={() => {}}>
          <ResponsiveOverlayFrame preset="mobile-page">
            <SheetTitle>申込内容</SheetTitle>
          </ResponsiveOverlayFrame>
        </ResponsiveDialog>
      )
    )
    const mobileTitle = document.querySelector<HTMLElement>('[data-slot="sheet-title"]')
    expect(mobileTitle?.className).toContain(pageTypo)

    act(() => root.unmount())
    root = createRoot(container)
    stubViewport(1200)
    act(() =>
      root.render(
        <ResponsiveDialog open onOpenChange={() => {}}>
          <ResponsiveOverlayFrame preset="mobile-page">
            <DialogTitle>申込内容</DialogTitle>
          </ResponsiveOverlayFrame>
        </ResponsiveDialog>
      )
    )
    const desktopTitle = document.querySelector<HTMLElement>('[data-slot="dialog-title"]')
    expect(desktopTitle?.className).toContain(pageTypo)
  })

  it("フッタはモバイルでキーボード追従、デスクトップでは静的になる", () => {
    stubViewport(390)
    renderFrame()
    const mobileFooter = document.querySelector<HTMLElement>(
      '[data-slot="keyboard-aware-sheet-footer"]'
    )
    expect(mobileFooter?.className).toContain("sticky")

    act(() => root.unmount())
    root = createRoot(container)
    stubViewport(1200)
    renderFrame()
    const desktopFooter = document.querySelector<HTMLElement>(
      '[data-slot="keyboard-aware-sheet-footer"]'
    )
    expect(desktopFooter?.className).not.toContain("sticky")
    expect(desktopFooter?.className).toContain("border-t")
  })
})
