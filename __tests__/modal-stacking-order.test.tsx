/**
 * @vitest-environment jsdom
 *
 * 多段モーダルの重なり順（issue #340）
 *
 * Sheet だけがグローバルの open-modal スタックに参加していたため、
 *   - Sheet(60) と Dialog(60) が並ぶと勝敗が DOM のマウント順という運任せ
 *   - 多段 Sheet（content = 60 + 段数*20）の上に Dialog(60) を開くと必ず隠れる
 * という穴があった。ここでは「後から開いたモーダルの z が必ず前面」であることを
 * portal 済みの実 DOM のインライン z-index で検査する。
 *
 * jsdom は実際の重なり計算をしないので、見るのは要素の z-index 値そのもの。
 * DOM レベルの実操作（クリック到達性）は Storybook の interaction テスト
 * （*.stories.tsx の tags: ["interaction"]）側で押さえる。
 */
import { describe, it, expect, afterEach } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import * as React from "react"

import { Sheet, SheetContent, SheetTitle } from "../src/components/ui/sheet"
import { Dialog, DialogContent, DialogTitle } from "../src/components/ui/dialog"
import { ConfirmDialog } from "../src/components/patterns/confirm-dialog"

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

function zOf(selector: string): number {
  const el = document.querySelector<HTMLElement>(selector)
  expect(el, `${selector} が見つからない`).not.toBeNull()
  const raw = el!.style.zIndex
  expect(raw, `${selector} にインライン z-index が無い`).not.toBe("")
  return Number(raw)
}

describe("Sheet の上に開いた Dialog（#340）", () => {
  it("後から開いた Dialog が Sheet より前面（scrim も Sheet 本体より上）", () => {
    function Scene({ dialogOpen }: { dialogOpen: boolean }) {
      return (
        <>
          <Sheet open>
            <SheetContent side="bottom">
              <SheetTitle>下地のシート</SheetTitle>
            </SheetContent>
          </Sheet>
          <Dialog open={dialogOpen}>
            <DialogContent description="確認">
              <DialogTitle>あとから開くダイアログ</DialogTitle>
            </DialogContent>
          </Dialog>
        </>
      )
    }
    mount(<Scene dialogOpen={false} />)
    const sheetZ = zOf('[data-slot="sheet-content"]')

    rerender(<Scene dialogOpen />)
    const dialogZ = zOf('[data-slot="dialog-content"]')
    const dialogOverlayZ = zOf('[data-slot="dialog-overlay"]')

    expect(dialogZ).toBeGreaterThan(sheetZ)
    // 下のシートがちゃんと暗転する（scrim がシート本体より上）
    expect(dialogOverlayZ).toBeGreaterThan(sheetZ)
    expect(dialogZ).toBeGreaterThan(dialogOverlayZ)
  })

  it("多段 Sheet（段 1）の上でも Dialog が前面", () => {
    function Scene({ dialogOpen }: { dialogOpen: boolean }) {
      return (
        <>
          <Sheet open>
            <SheetContent side="bottom" data-testid="sheet-1">
              <SheetTitle>1 枚目</SheetTitle>
            </SheetContent>
          </Sheet>
          <Sheet open>
            <SheetContent side="bottom" data-testid="sheet-2">
              <SheetTitle>2 枚目</SheetTitle>
            </SheetContent>
          </Sheet>
          <Dialog open={dialogOpen}>
            <DialogContent description="確認">
              <DialogTitle>あとから開くダイアログ</DialogTitle>
            </DialogContent>
          </Dialog>
        </>
      )
    }
    mount(<Scene dialogOpen={false} />)
    const sheet1 = zOf('[data-testid="sheet-1"]')
    const sheet2 = zOf('[data-testid="sheet-2"]')
    expect(sheet2).toBeGreaterThan(sheet1)

    rerender(<Scene dialogOpen />)
    expect(zOf('[data-slot="dialog-content"]')).toBeGreaterThan(sheet2)
  })
})

describe("Sheet の上に開いた ConfirmDialog（#340 の元症状）", () => {
  it("ConfirmDialog は多段 Sheet の上でも常に前面", () => {
    mount(
      <>
        <Sheet open>
          <SheetContent side="bottom" data-testid="sheet-1">
            <SheetTitle>1 枚目</SheetTitle>
          </SheetContent>
        </Sheet>
        <Sheet open>
          <SheetContent side="bottom" data-testid="sheet-2">
            <SheetTitle>2 枚目</SheetTitle>
          </SheetContent>
        </Sheet>
        <ConfirmDialog
          open
          onOpenChange={() => {}}
          title="削除しますか"
          onConfirm={() => {}}
        />
      </>
    )
    const sheet2 = zOf('[data-testid="sheet-2"]')
    const alertZ = zOf('[data-slot="alert-dialog-content"]')
    const alertOverlay = zOf('[data-slot="alert-dialog-overlay"]')

    expect(alertOverlay).toBeGreaterThan(sheet2)
    expect(alertZ).toBeGreaterThan(alertOverlay)
  })
})
