/**
 * @vitest-environment jsdom
 *
 * DetailSheetHeader の文字列 title をシート / ダイアログの名前にする（issue #727）。
 * - Sheet / Dialog の中: h2 を Radix の Title として描き、Content の aria-labelledby がそれを指す
 * - overlayTitle={false}・オーバーレイの外・AlertDialog の中・titleEditor: 従来どおり素の h2
 * - 別の SheetTitle と併用すると開発ビルドで警告する
 */
import { afterEach, describe, expect, it, vi } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { renderToStaticMarkup } from "react-dom/server"
import * as React from "react"

import { Sheet, SheetContent, SheetTitle } from "../src/components/ui/sheet"
import { Dialog, DialogContent } from "../src/components/ui/dialog"
import { AlertDialog, AlertDialogContent, AlertDialogTitle } from "../src/components/ui/alert-dialog"
import { DetailSheetHeader } from "../src/components/patterns/detail-sheet-scaffold"
import { resetDevWarnings } from "../src/lib/dev-warn"

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

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
  if (root) act(() => root!.unmount())
  root = null
  container?.remove()
  container = null
  document.body.innerHTML = ""
  vi.restoreAllMocks()
  resetDevWarnings()
})

const labelOf = (dialog: Element) => document.getElementById(dialog.getAttribute("aria-labelledby") ?? "")

describe("DetailSheetHeader overlay title", () => {
  it("Sheet の中では文字列 title がシートの名前（sheet-title）になる", () => {
    mount(
      <Sheet open>
        <SheetContent side="bottom" description="説明">
          <DetailSheetHeader title="ゲスト詳細" />
        </SheetContent>
      </Sheet>
    )
    const dialog = document.querySelector('[role="dialog"]')!
    const label = labelOf(dialog)
    expect(label?.textContent).toBe("ゲスト詳細")
    expect(label?.tagName).toBe("H2")
    expect(label?.getAttribute("data-slot")).toBe("sheet-title")
    expect(label?.className).toContain("typo-heading-lg")
  })

  it("Dialog の中では dialog-title になる", () => {
    mount(
      <Dialog open>
        <DialogContent description="説明">
          <DetailSheetHeader title="配席" />
        </DialogContent>
      </Dialog>
    )
    const label = labelOf(document.querySelector('[role="dialog"]')!)
    expect(label?.textContent).toBe("配席")
    expect(label?.getAttribute("data-slot")).toBe("dialog-title")
  })

  it("overlayTitle={false} は従来どおり素の h2（名前にならない）", () => {
    mount(
      <Sheet open>
        <SheetContent side="bottom" description="説明">
          <SheetTitle className="sr-only">別名</SheetTitle>
          <DetailSheetHeader title="ゲスト詳細" overlayTitle={false} />
        </SheetContent>
      </Sheet>
    )
    expect(labelOf(document.querySelector('[role="dialog"]')!)?.textContent).toBe("別名")
    const h2 = [...document.querySelectorAll("h2")].find((el) => el.textContent === "ゲスト詳細")!
    expect(h2.id).toBe("")
    expect(h2.hasAttribute("data-slot")).toBe(false)
  })

  it("AlertDialog の中では素の h2（外側の Sheet の名前を奪わない）", () => {
    mount(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogTitle>確認</AlertDialogTitle>
          <DetailSheetHeader title="中の見出し" />
        </AlertDialogContent>
      </AlertDialog>
    )
    const h2 = [...document.querySelectorAll("h2")].find((el) => el.textContent === "中の見出し")!
    expect(h2.hasAttribute("data-slot")).toBe(false)
  })

  it("オーバーレイの外・ReactNode の title・titleEditor は従来の DOM", () => {
    expect(renderToStaticMarkup(<DetailSheetHeader title="外" />)).toContain(
      '<h2 class="typo-heading-lg text-[var(--Text-High-Emphasis)] break-words">外</h2>'
    )
    mount(
      <Sheet open>
        <SheetContent side="bottom" description="説明">
          <SheetTitle className="sr-only">名前</SheetTitle>
          <DetailSheetHeader title={<span>節点</span>} />
          <DetailSheetHeader title="無視" titleEditor={<input aria-label="タイトル" />} />
        </SheetContent>
      </Sheet>
    )
    expect(labelOf(document.querySelector('[role="dialog"]')!)?.textContent).toBe("名前")
    expect(document.querySelectorAll('[data-slot="sheet-title"]').length).toBe(1)
  })

  it("別の SheetTitle と併用すると開発ビルドで警告する", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    mount(
      <Sheet open>
        <SheetContent side="bottom" description="説明">
          <SheetTitle className="sr-only">ゲスト詳細</SheetTitle>
          <DetailSheetHeader title="ゲスト詳細" />
        </SheetContent>
      </Sheet>
    )
    expect(warn.mock.calls.some(([m]) => String(m).includes("overlayTitle={false}"))).toBe(true)
  })
})
