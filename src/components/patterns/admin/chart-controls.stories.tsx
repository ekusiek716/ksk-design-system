import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { ChartControls } from "./chart-controls"

const meta: Meta<typeof ChartControls> = {
  title: "Components/Admin/ChartControls",
  component: ChartControls,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
}
export default meta
type Story = StoryObj<typeof ChartControls>

export const Default: Story = {
  render: () => {
    const [granularity, setGranularity] = React.useState<"hour"|"day"|"week"|"month">("day")
    const [period, setPeriod] = React.useState<"7d"|"30d"|"90d"|"1y"|"custom">("7d")
    const [comparison, setComparison] = React.useState(false)

    return (
      <div className="p-4 bg-[var(--Surface-Primary)] rounded-xl border border-[var(--Border-Low-Emphasis)] inline-block">
        <ChartControls
          granularity={granularity}
          onGranularityChange={setGranularity}
          period={period}
          onPeriodChange={setPeriod}
          showComparison={comparison}
          onComparisonChange={setComparison}
          onCustomPeriod={() => alert("カスタム期間ピッカーを開く")}
        />
      </div>
    )
  },
}

export const PeriodOnly: Story = {
  render: () => {
    const [period, setPeriod] = React.useState<"7d"|"30d"|"90d"|"1y"|"custom">("30d")
    return (
      <div className="p-4 bg-[var(--Surface-Primary)] rounded-xl border border-[var(--Border-Low-Emphasis)] inline-block">
        <ChartControls
          period={period}
          onPeriodChange={setPeriod}
        />
      </div>
    )
  },
}
