/**
 * @vitest-environment jsdom
 *
 * Sheet（snapPoints・制御版）を下へスワイプして閉じたとき、ドラッグ中に親へ
 * 流れた途中の比率（例 0.15）が親の activeSnapPoint に残り、次に開くと
 * snapPoints に無い位置（ほぼ画面外）に出ていた（Issue #821）。
 *
 * 固定する契約:
 *  - スワイプで閉じたあと、親の activeSnapPoint は snapPoints のどれか（最下段）
 *  - 再オープン後に ↑/↓ キーで段を切り替えられる
 *  - 閉じるボタン・Esc で閉じた場合は親の snap を変えない（従来どおり）
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, describe, expect, it } from "vitest"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  type SnapPoint,
} from "../src/components/ui/sheet"

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const SNAPS: SnapPoint[] = [0.4, 0.9]

let container: HTMLDivElement | null = null
let root: Root | null = null
let latest: { open: boolean; snap: SnapPoint | null } = { open: true, snap: 0.4 }
let reopen: (() => void) | null = null

function Harness({ initialSnap = 0.4 }: { initialSnap?: SnapPoint }) {
  const [open, setOpen] = React.useState(true)
  const [snap, setSnap] = React.useState<SnapPoint | null>(initialSnap)
  // テストから親の状態を読む / 再オープンするための口（commit 後に更新する）。
  React.useEffect(() => {
    latest = { open, snap }
    reopen = () => setOpen(true)
  })
  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
      snapPoints={SNAPS}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
    >
      <SheetContent side="bottom">
        <SheetTitle>2段階シート</SheetTitle>
        <SheetClose data-testid="close">閉じる</SheetClose>
      </SheetContent>
    </Sheet>
  )
}

function mount(ui: React.ReactElement) {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => root!.render(ui))
}

function content() {
  return document.querySelector<HTMLElement>('[data-slot="sheet-content"]')
}

function pointer(target: Element, type: string, y: number) {
  const ev = new MouseEvent(type, { bubbles: true, cancelable: true, clientX: 100, clientY: y, button: 0, buttons: 1 })
  Object.defineProperty(ev, "pointerType", { value: "touch" })
  Object.defineProperty(ev, "pointerId", { value: 1 })
  act(() => {
    target.dispatchEvent(ev)
  })
}

/** ハンドル行を下へ dy px ドラッグして離す（jsdom の innerHeight は 768）。 */
function dragHandleDown(dy: number) {
  const handle = content()!.querySelector<HTMLElement>(".cursor-grab")!
  pointer(handle, "pointerdown", 300)
  for (let i = 1; i <= 4; i++) pointer(handle, "pointermove", 300 + (dy * i) / 4)
  pointer(handle, "pointerup", 300 + dy)
}

function key(target: Element, k: string) {
  act(() => {
    target.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true }))
  })
}

afterEach(() => {
  if (root) act(() => root!.unmount())
  root = null
  container?.remove()
  container = null
  document.body.innerHTML = ""
  reopen = null
})

describe("Sheet snapPoints（制御版）のスワイプ dismiss（Issue #821）", () => {
  it("下へスワイプして閉じると、親の activeSnapPoint は snapPoints の値（最下段）に戻る", () => {
    mount(<Harness />)
    // 0.4 - 200/768 ≈ 0.14 < minSnap*0.5 (0.2) → 閉じる
    dragHandleDown(200)
    expect(latest.open).toBe(false)
    expect(SNAPS).toContain(latest.snap)
    expect(latest.snap).toBe(0.4)
  })

  it("再オープン後はスナップ点に出て、↑/↓ キーで段を切り替えられる", () => {
    mount(<Harness />)
    dragHandleDown(200)
    act(() => reopen!())
    const el = content()!
    expect(el.getAttribute("data-snap-active")).toBe("0.4")
    key(el, "ArrowUp")
    expect(latest.snap).toBe(0.9)
    key(content()!, "ArrowDown")
    expect(latest.snap).toBe(0.4)
  })

  it("閉じるボタンで閉じた場合は親の snap を変えない（最後の段を覚えておける）", () => {
    mount(<Harness initialSnap={0.9} />)
    act(() => {
      document.querySelector<HTMLElement>('[data-testid="close"]')!.click()
    })
    expect(latest.open).toBe(false)
    expect(latest.snap).toBe(0.9)
  })

  it("Esc で閉じた場合も親の snap を変えない", () => {
    mount(<Harness initialSnap={0.9} />)
    key(content()!, "Escape")
    expect(latest.open).toBe(false)
    expect(latest.snap).toBe(0.9)
  })

  it("閾値より手前で離したときは従来どおり近い段へ戻り、閉じない", () => {
    mount(<Harness initialSnap={0.9} />)
    // 0.9 - 100/768 ≈ 0.77 → 0.9 に戻る
    dragHandleDown(100)
    expect(latest.open).toBe(true)
    expect(latest.snap).toBe(0.9)
  })
})
