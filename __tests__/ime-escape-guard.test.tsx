/** @vitest-environment jsdom */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { beforeEach, afterEach, describe, it, expect, vi } from "vitest"
import { guardEscapeDuringIme } from "../src/lib/ime"
import { Dialog, DialogContent, DialogTitle } from "../src/components/ui/dialog"
import { Sheet, SheetContent, SheetTitle } from "../src/components/ui/sheet"
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel } from "../src/components/ui/alert-dialog"
import { Popover, PopoverContent, PopoverTrigger } from "../src/components/ui/popover"
import { DataTable, type DataTableColumn } from "../src/components/patterns/admin/data-table"

/**
 * #809: 日本語 IME の変換中に Esc（変換の取り消し）を押しても、外側の Dialog / Sheet /
 * AlertDialog / Popover が閉じない・DataTable の編集が取り消されないこと。
 * 変換中でない Esc・closeOnEsc={false}・consumer の onEscapeKeyDown は従来どおり働くこと。
 */

let root: Root | undefined
beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal("CSS", { escape: (value: string) => value })
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  window.matchMedia = vi.fn().mockReturnValue({ matches: false, addEventListener() {}, removeEventListener() {} })
})
afterEach(() => {
  act(() => root?.unmount())
  act(() => vi.runOnlyPendingTimers())
  root = undefined
  document.body.innerHTML = ""
  vi.useRealTimers()
  vi.unstubAllGlobals()
})
function flush() { act(() => vi.advanceTimersByTime(100)) }
function mount(node: React.ReactNode) {
  const container = document.createElement("div")
  document.body.append(container)
  root = createRoot(container)
  act(() => root!.render(node))
  flush()
}

type EscKind = "composing" | "keyCode229" | "plain"
function escape(kind: EscKind): KeyboardEvent {
  const event = new KeyboardEvent("keydown", {
    key: "Escape",
    bubbles: true,
    cancelable: true,
    isComposing: kind === "composing",
  })
  if (kind === "keyCode229") Object.defineProperty(event, "keyCode", { value: 229 })
  return event
}
function pressEscape(kind: EscKind) {
  const target = document.querySelector<HTMLInputElement>("input[data-ime]") ?? document.body
  act(() => { target.dispatchEvent(escape(kind)) })
}

describe("guardEscapeDuringIme (#809)", () => {
  it("prevents and reports Escape while composing", () => {
    const composing = escape("composing")
    expect(guardEscapeDuringIme(composing)).toBe(true)
    expect(composing.defaultPrevented).toBe(true)
    const legacy = escape("keyCode229")
    expect(guardEscapeDuringIme(legacy)).toBe(true)
    expect(legacy.defaultPrevented).toBe(true)
  })
  it("leaves a plain Escape alone", () => {
    const plain = escape("plain")
    expect(guardEscapeDuringIme(plain)).toBe(false)
    expect(plain.defaultPrevented).toBe(false)
  })
})

type OverlayKind = "dialog" | "sheet" | "sheet-snap" | "sheet-swipe-bottom" | "sheet-swipe-side" | "alert-dialog" | "popover"
const overlayKinds: OverlayKind[] = ["dialog", "sheet", "sheet-snap", "sheet-swipe-bottom", "sheet-swipe-side", "alert-dialog", "popover"]
type OverlayOptions = {
  onOpenChange: (open: boolean) => void
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  closeOnEsc?: boolean
}
function overlay(kind: OverlayKind, { onOpenChange, onEscapeKeyDown, closeOnEsc }: OverlayOptions) {
  const field = <input data-ime aria-label="入力" />
  switch (kind) {
    case "dialog":
      return <Dialog open onOpenChange={onOpenChange}><DialogContent onEscapeKeyDown={onEscapeKeyDown} closeOnEsc={closeOnEsc}><DialogTitle>編集</DialogTitle>{field}</DialogContent></Dialog>
    case "sheet":
      return <Sheet open onOpenChange={onOpenChange}><SheetContent onEscapeKeyDown={onEscapeKeyDown} closeOnEsc={closeOnEsc}><SheetTitle>編集</SheetTitle>{field}</SheetContent></Sheet>
    case "sheet-snap":
      return <Sheet open onOpenChange={onOpenChange} snapPoints={[0.5, 1]}><SheetContent side="bottom" onEscapeKeyDown={onEscapeKeyDown} closeOnEsc={closeOnEsc}><SheetTitle>編集</SheetTitle>{field}</SheetContent></Sheet>
    case "sheet-swipe-bottom":
      return <Sheet open onOpenChange={onOpenChange}><SheetContent side="bottom" swipeToClose onEscapeKeyDown={onEscapeKeyDown} closeOnEsc={closeOnEsc}><SheetTitle>編集</SheetTitle>{field}</SheetContent></Sheet>
    case "sheet-swipe-side":
      return <Sheet open onOpenChange={onOpenChange}><SheetContent side="right" swipeToClose onEscapeKeyDown={onEscapeKeyDown} closeOnEsc={closeOnEsc}><SheetTitle>編集</SheetTitle>{field}</SheetContent></Sheet>
    case "alert-dialog":
      return <AlertDialog open onOpenChange={onOpenChange}><AlertDialogContent onEscapeKeyDown={onEscapeKeyDown}><AlertDialogTitle>確認</AlertDialogTitle><AlertDialogDescription>説明</AlertDialogDescription>{field}<AlertDialogCancel>キャンセル</AlertDialogCancel></AlertDialogContent></AlertDialog>
    case "popover":
      return <Popover open onOpenChange={onOpenChange}><PopoverTrigger>開く</PopoverTrigger><PopoverContent onEscapeKeyDown={onEscapeKeyDown}>{field}</PopoverContent></Popover>
  }
}

describe("overlays ignore Escape while an IME is composing (#809)", () => {
  it.each(overlayKinds)("%s: stays open on Escape with isComposing", (kind) => {
    const onOpenChange = vi.fn()
    mount(overlay(kind, { onOpenChange }))
    pressEscape("composing")
    expect(onOpenChange).not.toHaveBeenCalled()
  })
  it.each(overlayKinds)("%s: stays open on Escape with keyCode 229", (kind) => {
    const onOpenChange = vi.fn()
    mount(overlay(kind, { onOpenChange }))
    pressEscape("keyCode229")
    expect(onOpenChange).not.toHaveBeenCalled()
  })
  it.each(overlayKinds)("%s: still closes on a plain Escape", (kind) => {
    const onOpenChange = vi.fn()
    mount(overlay(kind, { onOpenChange }))
    pressEscape("plain")
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
  it.each(overlayKinds)("%s: still calls the consumer onEscapeKeyDown first", (kind) => {
    const onOpenChange = vi.fn()
    const onEscapeKeyDown = vi.fn()
    mount(overlay(kind, { onOpenChange, onEscapeKeyDown }))
    pressEscape("composing")
    expect(onEscapeKeyDown).toHaveBeenCalledTimes(1)
    pressEscape("plain")
    expect(onEscapeKeyDown).toHaveBeenCalledTimes(2)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
  it.each(overlayKinds)("%s: a consumer preventDefault still keeps it open", (kind) => {
    const onOpenChange = vi.fn()
    mount(overlay(kind, { onOpenChange, onEscapeKeyDown: (event) => event.preventDefault() }))
    pressEscape("plain")
    expect(onOpenChange).not.toHaveBeenCalled()
  })
  it.each(["dialog", "sheet", "sheet-snap", "sheet-swipe-bottom", "sheet-swipe-side"] as const)(
    "%s: closeOnEsc={false} still keeps it open",
    (kind) => {
      const onOpenChange = vi.fn()
      mount(overlay(kind, { onOpenChange, closeOnEsc: false }))
      pressEscape("plain")
      expect(onOpenChange).not.toHaveBeenCalled()
    }
  )
})

describe("DataTable edit cell ignores Escape while an IME is composing (#809)", () => {
  type Row = { id: number; name: string }
  function renderTable(onEditCancel: () => void) {
    const columns: DataTableColumn<Row>[] = [
      {
        key: "name",
        header: "名前",
        cell: ({ row }) => row.name,
        editCell: ({ row }) => <input data-ime aria-label="名前" defaultValue={row.name} />,
        onEditCancel,
      },
    ]
    mount(<DataTable rows={[{ id: 1, name: "a" }]} columns={columns} getRowId={(row) => row.id} />)
    const cell = Array.from(document.querySelectorAll("td")).find((td) => td.textContent === "a")!
    act(() => { cell.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true })) })
    expect(document.querySelector("input[data-ime]")).not.toBeNull()
  }
  it.each(["composing", "keyCode229"] as const)("does not cancel the edit on Escape (%s)", (kind) => {
    const onEditCancel = vi.fn()
    renderTable(onEditCancel)
    pressEscape(kind)
    expect(onEditCancel).not.toHaveBeenCalled()
    expect(document.querySelector("input[data-ime]")).not.toBeNull()
  })
  it("cancels the edit on a plain Escape", () => {
    const onEditCancel = vi.fn()
    renderTable(onEditCancel)
    pressEscape("plain")
    expect(onEditCancel).toHaveBeenCalledTimes(1)
    expect(document.querySelector("input[data-ime]")).toBeNull()
  })
})
