/**
 * @vitest-environment jsdom
 *
 * modal な層の aria-modal と、開いているモーダルの公開判定（issue #505）
 *
 * - `DialogContent` / `SheetContent` / `AlertDialogContent` は modal のとき
 *   `aria-modal="true"` を出す（`modal={false}` では出さない）。
 * - `useHasOpenModal()` / `useOpenModalCount()` が「いま開いている modal な層」を
 *   返す。消費側が `[role="dialog"][data-state="open"]` のような DS 内部実装への
 *   DOM 直参照を書かずに横断判定できるようにするのが目的。
 */
import { describe, it, expect, afterEach } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import * as React from "react"

import { Sheet, SheetContent, SheetTitle } from "../src/components/ui/sheet"
import { Dialog, DialogContent, DialogTitle } from "../src/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
} from "../src/components/ui/alert-dialog"
import {
  useHasOpenModal,
  useOpenModalCount,
  getOpenModalCount,
} from "../src/lib/modal-stack"

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

function rerender(ui: React.ReactElement) {
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

function ariaModalOf(selector: string): string | null {
  const el = document.querySelector<HTMLElement>(selector)
  expect(el, `${selector} が見つからない`).not.toBeNull()
  return el!.getAttribute("aria-modal")
}

describe("aria-modal の出力（#505）", () => {
  it("modal な Dialog / Sheet / AlertDialog の content に aria-modal=true が出る", () => {
    mount(
      <>
        <Sheet open>
          <SheetContent side="bottom">
            <SheetTitle>シート</SheetTitle>
          </SheetContent>
        </Sheet>
        <Dialog open>
          <DialogContent description="説明">
            <DialogTitle>ダイアログ</DialogTitle>
          </DialogContent>
        </Dialog>
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogTitle>確認</AlertDialogTitle>
            <AlertDialogDescription>取り消せません</AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
    expect(ariaModalOf('[data-slot="sheet-content"]')).toBe("true")
    expect(ariaModalOf('[data-slot="dialog-content"]')).toBe("true")
    expect(ariaModalOf('[data-slot="alert-dialog-content"]')).toBe("true")
  })

  it("modal={false} の Dialog / Sheet では aria-modal を出さない", () => {
    mount(
      <>
        <Sheet open modal={false}>
          <SheetContent side="bottom">
            <SheetTitle>非モーダルなシート</SheetTitle>
          </SheetContent>
        </Sheet>
        <Dialog open modal={false}>
          <DialogContent description="説明">
            <DialogTitle>非モーダルなダイアログ</DialogTitle>
          </DialogContent>
        </Dialog>
      </>
    )
    expect(ariaModalOf('[data-slot="sheet-content"]')).toBeNull()
    expect(ariaModalOf('[data-slot="dialog-content"]')).toBeNull()
  })
})

describe("開いているモーダルの公開判定（#505）", () => {
  function Probe({ onRender }: { onRender: (v: { has: boolean; count: number }) => void }) {
    const has = useHasOpenModal()
    const count = useOpenModalCount()
    onRender({ has, count })
    return null
  }

  it("開閉に追随して深さを返し、閉じると 0 に戻る", () => {
    let latest = { has: false, count: 0 }
    const onRender = (v: { has: boolean; count: number }) => {
      latest = v
    }

    function Scene({ sheetOpen, dialogOpen }: { sheetOpen: boolean; dialogOpen: boolean }) {
      return (
        <>
          <Probe onRender={onRender} />
          <Sheet open={sheetOpen}>
            <SheetContent side="bottom">
              <SheetTitle>シート</SheetTitle>
            </SheetContent>
          </Sheet>
          <Dialog open={dialogOpen}>
            <DialogContent description="説明">
              <DialogTitle>ダイアログ</DialogTitle>
            </DialogContent>
          </Dialog>
        </>
      )
    }

    mount(<Scene sheetOpen={false} dialogOpen={false} />)
    expect(latest).toEqual({ has: false, count: 0 })
    expect(getOpenModalCount()).toBe(0)

    rerender(<Scene sheetOpen dialogOpen={false} />)
    expect(latest.has).toBe(true)
    expect(latest.count).toBe(1)

    rerender(<Scene sheetOpen dialogOpen />)
    expect(latest.count).toBe(2)
    expect(getOpenModalCount()).toBe(2)

    rerender(<Scene sheetOpen={false} dialogOpen={false} />)
    expect(latest).toEqual({ has: false, count: 0 })
    expect(getOpenModalCount()).toBe(0)
  })

  it("modal={false} の層は数えない（背面が生きているため）", () => {
    let latest = { has: false, count: 0 }
    const onRender = (v: { has: boolean; count: number }) => {
      latest = v
    }
    mount(
      <>
        <Probe onRender={onRender} />
        <Sheet open modal={false}>
          <SheetContent side="bottom">
            <SheetTitle>非モーダルなシート</SheetTitle>
          </SheetContent>
        </Sheet>
      </>
    )
    expect(latest).toEqual({ has: false, count: 0 })
    expect(getOpenModalCount()).toBe(0)
  })
})
