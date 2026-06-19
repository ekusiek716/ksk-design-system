import type { Meta, StoryObj } from "@storybook/react"
import { Celebration } from "./celebration"

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
