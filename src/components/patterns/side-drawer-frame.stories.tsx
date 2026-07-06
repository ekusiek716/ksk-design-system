import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { SideDrawerFrame } from "./side-drawer-frame"
import { DetailSheetHeader, DetailSheetScaffold } from "./detail-sheet-scaffold"

const meta: Meta<typeof SideDrawerFrame> = {
  title: "Components/SideDrawerFrame",
  component: SideDrawerFrame,
}
export default meta

type Story = StoryObj<typeof SideDrawerFrame>

function DrawerExample({
  side,
  swipeToClose,
}: {
  side: "left" | "right"
  swipeToClose?: boolean
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>{side === "right" ? "右" : "左"}詳細ドロワーを開く</Button>
      </SheetTrigger>
      <SideDrawerFrame side={side} swipeToClose={swipeToClose}>
        <DetailSheetScaffold
          header={
            <DetailSheetHeader
              title="タスク詳細"
              description={
                swipeToClose
                  ? `${side === "right" ? "右" : "左"}方向のドラッグで閉じます。`
                  : "SideDrawerFrame で全高・padding無し・flex縦の外枠を固定します。"
              }
            />
          }
          footer={
            <SheetFooter className="border-t border-[var(--Border-Low-Emphasis)] p-4">
              <SheetClose asChild>
                <Button variant="secondary">キャンセル</Button>
              </SheetClose>
              <SheetClose asChild>
                <Button>保存する</Button>
              </SheetClose>
            </SheetFooter>
          }
        >
          <div className="space-y-3">
            {Array.from({ length: 24 }, (_, i) => (
              <p key={i} className="typo-body-md text-[var(--Text-Medium-Emphasis)]">
                詳細行 {i + 1} — 本文は flex-1 overflow-y-auto でスクロールし、フッタは固定されます。
              </p>
            ))}
          </div>
        </DetailSheetScaffold>
      </SideDrawerFrame>
    </Sheet>
  )
}

export const RightDrawer: Story = {
  render: () => <DrawerExample side="right" />,
}

export const LeftDrawer: Story = {
  render: () => <DrawerExample side="left" />,
}

// swipeToClose: side に追従した方向で閉じる（右ドロワー=右ドラッグ）。
export const RightDrawerSwipeToClose: Story = {
  name: "RightDrawer — swipeToClose",
  render: () => <DrawerExample side="right" swipeToClose />,
}

export const LeftDrawerSwipeToClose: Story = {
  name: "LeftDrawer — swipeToClose",
  render: () => <DrawerExample side="left" swipeToClose />,
}
