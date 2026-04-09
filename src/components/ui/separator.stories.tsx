/**
 * @file Separator のストーリー
 * @description 区切り線コンポーネント。水平・垂直方向を網羅
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Separator } from "./separator"

const meta: Meta<typeof Separator> = {
  title: "UI/Separator",
  component: Separator,
}
export default meta

type Story = StoryObj<typeof Separator>

export const Horizontal: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="typo-body-md text-[var(--Text-High-Emphasis)]">セクション A</p>
      <Separator />
      <p className="typo-body-md text-[var(--Text-High-Emphasis)]">セクション B</p>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex items-center gap-4 h-8">
      <span className="typo-body-md text-[var(--Text-High-Emphasis)]">ホーム</span>
      <Separator orientation="vertical" />
      <span className="typo-body-md text-[var(--Text-High-Emphasis)]">設定</span>
      <Separator orientation="vertical" />
      <span className="typo-body-md text-[var(--Text-High-Emphasis)]">ヘルプ</span>
    </div>
  ),
}
