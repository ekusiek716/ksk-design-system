import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
import * as React from "react"
import { Calendar } from "./calendar"

const meta: Meta<typeof Calendar> = {
  title: "Components/Calendar",
  component: Calendar,
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof Calendar>

export const Single: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    return <Calendar mode="single" selected={date} onSelect={setDate} />
  },
}

/**
 * 前月 / 次月ボタンのクリックで月キャプションが変わることを検証する。
 *
 * issue #132 / PR #134 の回帰（nav の pointer-events オーバーレイ廃止後、
 * 実クリックで月移動できること）を interaction test で担保する。
 * jsdom を使わない単体テスト側では拾えないクリック貫通の受け皿。
 */
export const NavigatesMonths: Story = {
  name: "NavigatesMonths",
  render: () => {
    // 2026年7月固定でスタート（実行日に依存させない）
    const [month, setMonth] = React.useState<Date>(new Date(2026, 6, 1))
    return (
      <Calendar mode="single" month={month} onMonthChange={setMonth} />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // 初期キャプション
    await expect(canvas.getByText("2026年7月")).toBeInTheDocument()

    // 次の月へ → 2026年8月
    await userEvent.click(canvas.getByRole("button", { name: "次の月へ" }))
    await expect(canvas.getByText("2026年8月")).toBeInTheDocument()

    // 前の月へ 2 回 → 2026年6月
    const prev = canvas.getByRole("button", { name: "前の月へ" })
    await userEvent.click(prev)
    await userEvent.click(prev)
    await expect(canvas.getByText("2026年6月")).toBeInTheDocument()
  },
}

export const Range: Story = {
  render: () => {
    const [range, setRange] = React.useState<{ from?: Date; to?: Date }>({})
    return (
      <Calendar
        mode="range"
        selected={range.from ? { from: range.from, to: range.to } : undefined}
        onSelect={(r) => setRange(r ?? {})}
        numberOfMonths={2}
      />
    )
  },
}
