import type { Meta, StoryObj } from "@storybook/react"
import { AppShell } from "./app-shell"

const meta: Meta<typeof AppShell> = {
  title: "Shells/AppShell",
  component: AppShell,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
}
export default meta
type Story = StoryObj<typeof AppShell>

export const Default: Story = {
  args: {
    topBar: (
      <div className="flex items-center justify-between w-full">
        <span className="typo-heading-md text-[var(--Text-High-Emphasis)]">アプリ名</span>
      </div>
    ),
    children: (
      <div className="p-4 typo-body-md text-[var(--Text-Medium-Emphasis)]">コンテンツエリア</div>
    ),
  },
}
