/**
 * @file NotificationBadge のストーリー
 * @description 件数バッジコンポーネント。さまざまなカウント値と最大値オーバーフローを網羅
 */
import type { Meta, StoryObj } from "@storybook/react"
import { NotificationBadge } from "./notification-badge"
import { Button } from "@/components/ui/button"

const meta: Meta<typeof NotificationBadge> = {
  title: "Components/NotificationBadge",
  component: NotificationBadge,
  argTypes: {
    count: { control: { type: "number", min: 0, max: 200 } },
    max: { control: { type: "number", min: 1, max: 999 } },
  },
}
export default meta

type Story = StoryObj<typeof NotificationBadge>

export const SingleDigit: Story = {
  args: { count: 3 },
}

export const DoubleDigit: Story = {
  args: { count: 42 },
}

export const MaxOverflow: Story = {
  args: { count: 150, max: 99 },
}

export const CustomMax: Story = {
  args: { count: 1000, max: 999 },
}

export const Zero: Story = {
  args: { count: 0 },
}

export const VariousCounts: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">1件:</span>
        <NotificationBadge count={1} />
      </div>
      <div className="flex items-center gap-2">
        <span className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">9件:</span>
        <NotificationBadge count={9} />
      </div>
      <div className="flex items-center gap-2">
        <span className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">99件:</span>
        <NotificationBadge count={99} />
      </div>
      <div className="flex items-center gap-2">
        <span className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">100件:</span>
        <NotificationBadge count={100} />
      </div>
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <div className="relative inline-flex">
      <Button variant="ghost" size="icon" aria-label="通知">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 1 0 6 8c0 7-3 9-3 9h18s-3-2-3-9ZM13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </Button>
      <span className="absolute -top-1 -right-1">
        <NotificationBadge count={5} />
      </span>
    </div>
  ),
}
