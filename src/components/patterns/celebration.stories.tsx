import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Celebration } from "./celebration"
import { Button } from "../ui/button"

const meta: Meta<typeof Celebration> = {
  title: "Components/Celebration",
  component: Celebration,
  parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof Celebration>

export const Confetti: Story = {
  args: {
    active: true,
    trigger: "confetti",
    title: "マイルストーンを達成しました",
    description: "次の目標に向けて進められます。",
  },
}

export const InlineEmoji: Story = {
  args: {
    active: true,
    trigger: "emoji",
    placement: "inline",
    title: "保存しました",
    description: "変更内容が反映されています。",
  },
  render: (args) => (
    <div className="flex min-h-screen items-center justify-center bg-[var(--Surface-Secondary)] p-8">
      <Celebration {...args} />
    </div>
  ),
}

export const WithActions: Story = {
  name: "Actions Slot / Interactive",
  render: function WithActionsStory() {
    const [active, setActive] = React.useState(true)

    return (
      <div className="min-h-screen bg-[var(--Surface-Secondary)] p-8">
        <Button onClick={() => setActive(true)}>もう一度表示</Button>
        <Celebration
          active={active}
          trigger="both"
          title="マイルストーンを達成しました"
          description="次のアクションを選べます。"
          interactive
          onDone={() => setActive(false)}
          actions={
            <>
              <Button size="sm" onClick={() => setActive(false)}>
                次へ進む
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setActive(false)}>
                閉じる
              </Button>
            </>
          }
        />
      </div>
    )
  },
}

export const CustomConfetti: Story = {
  name: "Custom Duration / Colors / DriftRange",
  args: {
    active: true,
    trigger: "confetti",
    title: "カスタム confetti",
    description: "duration / colors / driftRange を指定した例。",
    duration: 1400,
    driftRange: 40,
    colors: [
      "var(--Categorical-1-Bold)",
      "var(--Categorical-5-Bold)",
      "var(--Categorical-9-Bold)",
      "var(--Categorical-13-Bold)",
    ],
  },
}

export const CardlessTapDismiss: Story = {
  name: "Cardless / Tap Dismiss",
  render: function CardlessTapDismissStory() {
    const [active, setActive] = React.useState(true)

    return (
      <div className="min-h-screen bg-[var(--Surface-Secondary)] p-8">
        <Button onClick={() => setActive(true)}>再生</Button>
        <Celebration
          active={active}
          trigger="confetti"
          cardless
          title="保存しました"
          autoDismissMs={4200}
          onTapDismiss={() => setActive(false)}
          onDone={() => setActive(false)}
        />
      </div>
    )
  },
}
