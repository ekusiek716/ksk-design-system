/** @vitest-environment jsdom */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, afterEach, describe, it, expect, vi } from "vitest"
import { getActiveElement } from "../src/lib/active-element"
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "../src/components/ui/alert-dialog"
import { CompactFilePicker } from "../src/components/patterns/compact-file-picker"
import { Dialog, DialogContent, DialogTitle } from "../src/components/ui/dialog"
import { Sheet, SheetContent, SheetTitle } from "../src/components/ui/sheet"
import { CollapsibleChipField } from "../src/components/patterns/collapsible-chip-field"
import { Tabs, TabsContent } from "../src/components/ui/tabs"

let root: Root | undefined
beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal("CSS", { escape: (value: string) => value })
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
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
function content(open: boolean, props: React.ComponentProps<typeof AlertDialogContent> = {}) {
  return <AlertDialog open={open}><AlertDialogContent {...props}><AlertDialogTitle>確認</AlertDialogTitle><AlertDialogDescription>削除の確認</AlertDialogDescription><AlertDialogAction>削除</AlertDialogAction><AlertDialogCancel>キャンセル</AlertDialogCancel></AlertDialogContent></AlertDialog>
}
function setup() {
  const opener = document.createElement("button")
  document.body.append(opener)
  opener.focus()
  const container = document.createElement("div")
  document.body.append(container)
  root = createRoot(container)
  return opener
}

describe("focus corrections (#652, #653, #657, #658, #659)", () => {
  it("resolves nested open shadow roots and supplied closed roots", () => {
    const host = document.createElement("div")
    document.body.append(host)
    const shadow = host.attachShadow({ mode: "open" })
    const nested = document.createElement("div")
    shadow.append(nested)
    const closed = nested.attachShadow({ mode: "closed" })
    const input = document.createElement("input")
    closed.append(input)
    input.focus()
    expect(document.activeElement).toBe(host)
    expect(getActiveElement()).toBe(nested)
    expect(getActiveElement(input)).toBe(input)
    const second = document.createElement("input")
    shadow.append(second)
    second.focus()
    expect(getActiveElement()).toBe(second)
  })
  it.each(["dialog", "sheet"])("restores a shadow-root opener for %s", (kind) => {
    const host = document.createElement("div")
    document.body.append(host)
    const shadow = host.attachShadow({ mode: "open" })
    const opener = document.createElement("button")
    shadow.append(opener)
    opener.focus()
    const container = document.createElement("div")
    shadow.append(container)
    root = createRoot(container)
    const ui = (open: boolean) => kind === "dialog"
      ? <Dialog open={open}><DialogContent><DialogTitle>作業</DialogTitle></DialogContent></Dialog>
      : <Sheet open={open}><SheetContent><SheetTitle>作業</SheetTitle></SheetContent></Sheet>
    act(() => root!.render(ui(true)))
    flush()
    act(() => root!.render(ui(false)))
    flush()
    expect(shadow.activeElement).toBe(opener)
  })
  it("collapses chips when Escape is isolated inside a shadow root", () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true })
    const host = document.createElement("div")
    document.body.append(host)
    const shadow = host.attachShadow({ mode: "open" })
    const container = document.createElement("div")
    shadow.append(container)
    root = createRoot(container)
    act(() => root!.render(<CollapsibleChipField label="分類" options={["a", "b"]} selected="a" getLabel={(key) => key} onSelect={() => {}} />))
    const chip = () => container.querySelector<HTMLButtonElement>('[data-value="a"]')!
    act(() => chip().click())
    expect(container.querySelectorAll('[data-slot="chip"]')).toHaveLength(2)
    act(() => chip().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true, composed: false })))
    expect(container.querySelectorAll('[data-slot="chip"]')).toHaveLength(1)
  })
  it("focuses Cancel and restores the opener without an AlertDialogTrigger", () => {
    const opener = setup()
    act(() => root!.render(content(true)))
    flush()
    expect(document.activeElement?.textContent).toBe("キャンセル")
    act(() => root!.render(content(false)))
    flush()
    expect(document.activeElement).toBe(opener)
  })
  it("honors consumer autofocus and close focus overrides", () => {
    setup()
    const fallback = document.createElement("button")
    document.body.append(fallback)
    const props = {
      onOpenAutoFocus(event: Event) { event.preventDefault(); document.querySelector<HTMLElement>('[data-slot="alert-dialog-action"]')!.focus() },
      onCloseAutoFocus(event: Event) { event.preventDefault(); fallback.focus() },
    }
    act(() => root!.render(content(true, props)))
    flush()
    expect(document.activeElement?.textContent).toBe("削除")
    act(() => root!.render(content(false, props)))
    flush()
    expect(document.activeElement).toBe(fallback)
  })
  it("can opt out of opener restoration", () => {
    const opener = setup()
    act(() => root!.render(content(true, { restoreFocusOnClose: false })))
    flush()
    act(() => root!.render(content(false, { restoreFocusOnClose: false })))
    flush()
    expect(document.activeElement).not.toBe(opener)
  })
  it("does not restore a disconnected opener", () => {
    const opener = setup()
    act(() => root!.render(content(true)))
    flush()
    opener.remove()
    const focus = vi.spyOn(opener, "focus")
    act(() => root!.render(content(false)))
    flush()
    expect(focus).not.toHaveBeenCalled()
  })
  it("keeps the hidden input outside Tab order with an explicit override available", () => {
    const container = document.createElement("div")
    container.innerHTML = renderToStaticMarkup(<CompactFilePicker id="file" />)
    expect(container.querySelector("input")?.tabIndex).toBe(-1)
    expect(container.querySelector("label")?.htmlFor).toBe("file")
    expect(container.querySelector("button")?.tabIndex).toBe(0)
    container.innerHTML = renderToStaticMarkup(<CompactFilePicker tabIndex={0} />)
    expect(container.querySelector("input")?.tabIndex).toBe(0)
  })
  it("gives the keyboard-focusable tab panel a semantic visible ring", () => {
    const container = document.createElement("div")
    container.innerHTML = renderToStaticMarkup(<Tabs defaultValue="a"><TabsContent value="a">本文</TabsContent></Tabs>)
    const panel = container.querySelector<HTMLElement>('[role="tabpanel"]')!
    expect(panel.tabIndex).toBe(0)
    expect(panel.className).toContain("focus-visible:ring-[3px]")
    expect(panel.className).toContain("focus-visible:ring-[var(--Focus-High-Emphasis)]")
    expect(panel.className).toContain("focus-visible:outline-hidden")
  })
})

// #789: 常時マウントの DialogContent / SheetContent（全変種）を、一覧の行ごとの
// opener から開き直すケース。2 回目以降も「その回の opener」へ戻ること、
// 戻り先が消えていたら強制復帰しないこと、preventScroll で戻すことを固定する。
type SharedOverlayKind = "dialog" | "sheet" | "sheet-snap" | "sheet-swipe-bottom" | "sheet-swipe-side"
const sharedOverlayKinds: SharedOverlayKind[] = ["dialog", "sheet", "sheet-snap", "sheet-swipe-bottom", "sheet-swipe-side"]
function sharedOverlay(kind: SharedOverlayKind, open: boolean) {
  switch (kind) {
    case "dialog":
      return <Dialog open={open}><DialogContent><DialogTitle>編集</DialogTitle></DialogContent></Dialog>
    case "sheet":
      return <Sheet open={open}><SheetContent><SheetTitle>編集</SheetTitle></SheetContent></Sheet>
    case "sheet-snap":
      return <Sheet open={open} snapPoints={[0.5, 1]}><SheetContent side="bottom"><SheetTitle>編集</SheetTitle></SheetContent></Sheet>
    case "sheet-swipe-bottom":
      return <Sheet open={open}><SheetContent side="bottom" swipeToClose><SheetTitle>編集</SheetTitle></SheetContent></Sheet>
    case "sheet-swipe-side":
      return <Sheet open={open}><SheetContent side="right" swipeToClose><SheetTitle>編集</SheetTitle></SheetContent></Sheet>
  }
}
function setupRows() {
  const rowA = document.createElement("button")
  rowA.textContent = "行 A"
  const rowB = document.createElement("button")
  rowB.textContent = "行 B"
  document.body.append(rowA, rowB)
  const container = document.createElement("div")
  document.body.append(container)
  root = createRoot(container)
  return { rowA, rowB }
}
function openAndClose(kind: SharedOverlayKind) {
  act(() => root!.render(sharedOverlay(kind, true)))
  flush()
  act(() => root!.render(sharedOverlay(kind, false)))
  flush()
}

describe("shared Dialog / Sheet restore the opener of each open (#789)", () => {
  beforeEach(() => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false, addEventListener() {}, removeEventListener() {} })
  })
  it.each(sharedOverlayKinds)("%s: reopening from row B returns focus to row B", (kind) => {
    const { rowA, rowB } = setupRows()
    act(() => root!.render(sharedOverlay(kind, false)))
    rowA.focus()
    openAndClose(kind)
    expect(document.activeElement).toBe(rowA)
    rowB.focus()
    openAndClose(kind)
    expect(document.activeElement).toBe(rowB)
  })
  it.each(sharedOverlayKinds)("%s: a removed earlier opener does not drop focus to body", (kind) => {
    const { rowA, rowB } = setupRows()
    act(() => root!.render(sharedOverlay(kind, false)))
    rowA.focus()
    openAndClose(kind)
    rowA.remove()
    rowB.focus()
    openAndClose(kind)
    expect(document.activeElement).toBe(rowB)
  })
  it.each(sharedOverlayKinds)("%s: does not force focus onto a disconnected opener", (kind) => {
    const { rowA } = setupRows()
    act(() => root!.render(sharedOverlay(kind, false)))
    rowA.focus()
    act(() => root!.render(sharedOverlay(kind, true)))
    flush()
    rowA.remove()
    const focus = vi.spyOn(rowA, "focus")
    act(() => root!.render(sharedOverlay(kind, false)))
    flush()
    expect(focus).not.toHaveBeenCalled()
  })
  it.each(sharedOverlayKinds)("%s: does not force focus onto an opener disabled while open", (kind) => {
    const { rowA } = setupRows()
    act(() => root!.render(sharedOverlay(kind, false)))
    rowA.focus()
    act(() => root!.render(sharedOverlay(kind, true)))
    flush()
    rowA.disabled = true
    const focus = vi.spyOn(rowA, "focus")
    act(() => root!.render(sharedOverlay(kind, false)))
    flush()
    expect(focus).not.toHaveBeenCalled()
  })
  it.each(sharedOverlayKinds)("%s: restores with preventScroll so the list does not jump", (kind) => {
    const { rowA } = setupRows()
    act(() => root!.render(sharedOverlay(kind, false)))
    rowA.focus()
    act(() => root!.render(sharedOverlay(kind, true)))
    flush()
    const focus = vi.spyOn(rowA, "focus")
    act(() => root!.render(sharedOverlay(kind, false)))
    flush()
    expect(focus).toHaveBeenCalledWith({ preventScroll: true })
  })
  // #789 レビュー指摘: SheetContent は side / swipeToClose / snapPoints の組み合わせで
  // 別コンポーネントへ分岐する。開いたまま分岐が変わると古い側の FocusScope が破棄されて
  // onCloseAutoFocus が発火するが、Sheet は閉じていないので opener の記録を失ってはいけない。
  it.each([
    ["swipe side → swipe bottom", { side: "right" as const }, { side: "bottom" as const }],
    ["swipe bottom → plain right", { side: "bottom" as const }, { side: "right" as const, swipeToClose: false }],
  ])("sheet: switching the content variant while open keeps the opener (%s)", (_label, before, after) => {
    const { rowA } = setupRows()
    const render = (open: boolean, variant: React.ComponentProps<typeof SheetContent>) =>
      act(() => root!.render(<Sheet open={open}><SheetContent swipeToClose {...variant}><SheetTitle>編集</SheetTitle></SheetContent></Sheet>))
    render(false, before)
    rowA.focus()
    render(true, before)
    flush()
    render(true, after)
    flush()
    expect(document.activeElement).not.toBe(rowA)
    render(false, after)
    flush()
    expect(document.activeElement).toBe(rowA)
  })
})
