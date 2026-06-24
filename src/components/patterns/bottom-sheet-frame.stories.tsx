import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { BottomSheetFrame } from "./bottom-sheet-frame"
import { DetailSheetHeader, DetailSheetScaffold } from "./detail-sheet-scaffold"
import { KeyboardAwareSheetFooter } from "./keyboard-aware-sheet-footer"

const meta: Meta<typeof BottomSheetFrame> = {
  title: "Components/BottomSheetFrame",
  component: BottomSheetFrame,
}
export default meta

type Story = StoryObj<typeof BottomSheetFrame>

function FrameExample({ preset }: { preset: "mobile-full" | "mobile-form" | "desktop-floating" }) {
  const [open, setOpen] = React.useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>{preset} を開く</Button>
      </SheetTrigger>
      <BottomSheetFrame preset={preset}>
        <DetailSheetScaffold
          header={<DetailSheetHeader title="予定を編集" description="BottomSheetFrame の preset で外枠を固定します。" />}
          footer={
            <KeyboardAwareSheetFooter>
              <Button variant="secondary">キャンセル</Button>
              <Button>保存する</Button>
            </KeyboardAwareSheetFooter>
          }
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${preset}-title`}>タイトル</Label>
              <Input id={`${preset}-title`} defaultValue="検診" />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${preset}-memo`}>メモ</Label>
              <Input id={`${preset}-memo`} defaultValue="持ち物を確認" />
            </div>
          </div>
        </DetailSheetScaffold>
      </BottomSheetFrame>
    </Sheet>
  )
}

export const MobileFull: Story = {
  render: () => <FrameExample preset="mobile-full" />,
}

export const MobileForm: Story = {
  render: () => <FrameExample preset="mobile-form" />,
}

export const DesktopFloating: Story = {
  render: () => <FrameExample preset="desktop-floating" />,
}
