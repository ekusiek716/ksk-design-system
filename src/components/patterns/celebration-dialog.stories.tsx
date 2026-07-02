import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { MedalStar } from "iconsax-reactjs"
import { CelebrationDialog } from "./celebration-dialog"
import { Button } from "../ui/button"

const meta: Meta<typeof CelebrationDialog> = {
  title: "Components/CelebrationDialog",
  component: CelebrationDialog,
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof CelebrationDialog>

export const Basic: Story = {
  render: function BasicStory() {
    const [open, setOpen] = React.useState(false)
    return (
      <div className="p-8">
        <Button onClick={() => setOpen(true)}>マイルストーンを達成する</Button>
        <CelebrationDialog
          open={open}
          onOpenChange={setOpen}
          emoji="🎉"
          title="はじめてのタスク完了！"
          description="この調子で次のタスクも進めましょう。"
          actions={
            <Button size="sm" onClick={() => setOpen(false)}>
              閉じる
            </Button>
          }
        />
      </div>
    )
  },
}

export const BounceEmojiWithAutoDismiss: Story = {
  name: "Bounce Emoji / Auto Dismiss",
  render: function AutoDismissStory() {
    const [open, setOpen] = React.useState(false)
    return (
      <div className="p-8">
        <Button onClick={() => setOpen(true)}>全タスク達成！</Button>
        <CelebrationDialog
          open={open}
          onOpenChange={setOpen}
          emoji="🎊"
          emojiAnimation="bounce"
          title="全タスク完了！"
          description="お疲れさまでした。4 秒後に自動で閉じます。"
          autoDismissMs={4000}
        />
      </div>
    )
  },
}

export const IconsaxBadge: Story = {
  name: "Iconsax Badge（emoji の代わり）",
  render: function IconsaxBadgeStory() {
    const [open, setOpen] = React.useState(false)
    return (
      <div className="p-8">
        <Button onClick={() => setOpen(true)}>実績を解除する</Button>
        <CelebrationDialog
          open={open}
          onOpenChange={setOpen}
          icon={<MedalStar size={44} variant="Bulk" color="var(--Brand-Primary)" />}
          emojiAnimation="bounce"
          title="実績を解除しました"
          description="emoji ではなく iconsax（Bulk variant）をバッジに載せる例。"
          actions={
            <Button size="sm" onClick={() => setOpen(false)}>
              閉じる
            </Button>
          }
        />
      </div>
    )
  },
}

export const CustomConfettiColors: Story = {
  name: "Custom Confetti Colors",
  render: function CustomColorsStory() {
    const [open, setOpen] = React.useState(false)
    return (
      <div className="p-8">
        <Button onClick={() => setOpen(true)}>目標達成</Button>
        <CelebrationDialog
          open={open}
          onOpenChange={setOpen}
          emoji="🏆"
          title="目標を達成しました"
          colors={[
            "var(--Categorical-1-Bold)",
            "var(--Categorical-6-Bold)",
            "var(--Categorical-11-Bold)",
          ]}
          driftRange={60}
          actions={
            <>
              <Button size="sm" onClick={() => setOpen(false)}>
                次へ
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>
                閉じる
              </Button>
            </>
          }
        />
      </div>
    )
  },
}
