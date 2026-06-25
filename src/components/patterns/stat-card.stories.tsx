/**
 * @file StatCard のストーリー
 * @description 統計値カードコンポーネント。トレンド上昇・下降・なしのパターンを網羅
 */
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { StatCard } from "./stat-card"

const meta: Meta<typeof StatCard> = {
  title: "Components/StatCard",
  component: StatCard,
}
export default meta

type Story = StoryObj<typeof StatCard>

export const TrendUp: Story = {
  args: {
    label: "月間売上",
    value: "¥1,234,567",
    trend: { value: 12.5, label: "前月比" },
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 17L8 12L12 14L17 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    ),
  },
}

export const TrendDown: Story = {
  args: {
    label: "解約率",
    value: "3.2",
    unit: "%",
    trend: { value: -0.8, label: "前月比" },
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 3L8 8L12 6L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    ),
  },
}

export const NoTrend: Story = {
  args: {
    label: "アクティブユーザー",
    value: "8,420",
    unit: "人",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" /><path d="M3 18C3 14.1 6.1 11 10 11C13.9 11 17 14.1 17 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
    ),
  },
}

export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 max-w-xl">
      <StatCard label="標準" value="1,234" variant="default" trend={{ value: 5, label: "前月比" }} />
      <StatCard label="成功" value="98.5" unit="%" variant="success" trend={{ value: 2.1, label: "前月比" }} />
      <StatCard label="注意" value="3.2" unit="%" variant="caution" trend={{ value: -0.8, label: "前月比" }} />
      <StatCard label="情報" value="8,420" unit="人" variant="info" />
      <StatCard label="ブランド" value="¥1.2M" variant="accent" trend={{ value: 8.3, label: "前月比" }} />
    </div>
  ),
}

export const Interactive: Story = {
  render: function InteractiveStory() {
    const [active, setActive] = React.useState("売上")
    return (
      <div className="flex max-w-xl flex-col gap-3">
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            label="売上"
            value="¥1.2M"
            trend={{ value: 8.3, label: "前月比" }}
            interactive
            onClick={() => setActive("売上")}
          />
          <StatCard
            label="注文数"
            value="342"
            unit="件"
            variant="accent"
            onClick={() => setActive("注文数")}
          />
        </div>
        <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">選択中: {active}</p>
      </div>
    )
  },
}

export const MultipleCards: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <StatCard label="売上" value="¥1.2M" trend={{ value: 8.3, label: "前月比" }} />
      <StatCard label="注文数" value="342" unit="件" trend={{ value: -2.1, label: "前月比" }} />
      <StatCard label="顧客数" value="1,204" unit="人" />
    </div>
  ),
}
