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

function FrameExample({ preset }: { preset: "mobile-full" | "mobile-form" | "mobile-page" | "desktop-floating" }) {
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

/**
 * iOS ページシート風 preset（#159）。App Store の詳細画面のように、上端に
 * 常時 ~2rem のギャップを残し、背後の暗転と上角丸がわずかに覗く。
 * ノッチ端末では safe-area-inset-top も合算されるため、上のギャップは
 * 「2rem + ノッチ分」になる。
 */
export const MobilePage: Story = {
  render: () => <FrameExample preset="mobile-page" />,
}

/**
 * KeyboardAwareSheetFooter behavior="hide" の CSS フォールバック検証（#149）。
 *
 * シート内テキスト入力に :focus がある間、DS 同梱 CSS（sheet-keyboard.css の
 * :has(:focus) フォールバック、モバイル幅のみ）で footer[data-behavior="hide"]
 * が display:none になる。visualViewport 検知に依存しないため、実キーボードの
 * ない Storybook でもフォーカスするだけで隠れる（≤767px 幅で確認）。
 */
export const KeyboardHideFallback: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button>hide フォールバックを開く</Button>
        </SheetTrigger>
        <BottomSheetFrame preset="mobile-form">
          <DetailSheetScaffold
            header={<DetailSheetHeader title="サブタスクを追加" description="入力にフォーカスすると hide フッターが隠れます。" />}
            footer={
              <KeyboardAwareSheetFooter behavior="hide" data-testid="hide-footer">
                <Button className="w-full">完了する</Button>
              </KeyboardAwareSheetFooter>
            }
          >
            <div className="space-y-2">
              <Label htmlFor="hide-fallback-title">タイトル</Label>
              <Input id="hide-fallback-title" defaultValue="牛乳を買う" />
            </div>
          </DetailSheetScaffold>
        </BottomSheetFrame>
      </Sheet>
    )
  },
}

/**
 * #164 回帰確認: swipeToClose + BottomSheetFrame + DetailSheetScaffold。
 *
 * DetailSheetScaffold は本文に `flex max-h-[inherit] min-h-0 flex-col` を
 * 使う（consumer が独自に `min-h-full flex flex-col` を書くケースの DS 版）。
 * 修正前は swipeToClose 版の SheetContent が display:block だったため、
 * この子の max-height 制約が効かず本文が伸びて footer（保存する ボタン）が
 * 画面外に押し出された。修正後は SheetContent 自体が flex 化されているため、
 * 本文を大量に入れても footer は常に画面内に留まり、本文だけがスクロールする。
 */
export const SwipeToCloseWithScaffold: Story = {
  name: "swipeToClose + DetailSheetScaffold (#164)",
  render: () => {
    const [open, setOpen] = React.useState(false)
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button>swipeToClose 版を開く</Button>
        </SheetTrigger>
        <BottomSheetFrame preset="mobile-full" swipeToClose>
          <DetailSheetScaffold
            header={<DetailSheetHeader title="長い本文でも footer が画面内に残るか" description="下にスクロールしても「保存する」ボタンが常に見えていれば OK。" />}
            footer={
              <KeyboardAwareSheetFooter>
                <Button variant="secondary">キャンセル</Button>
                <Button>保存する</Button>
              </KeyboardAwareSheetFooter>
            }
          >
            <div className="flex flex-col gap-3">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Secondary)] p-3 typo-body-md text-[var(--Text-High-Emphasis)]"
                >
                  行 {i + 1}
                </div>
              ))}
            </div>
          </DetailSheetScaffold>
        </BottomSheetFrame>
      </Sheet>
    )
  },
}
