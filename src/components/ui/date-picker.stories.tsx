/**
 * @file DatePicker / DateRangePicker のストーリー
 * @description 日付選択コンポーネント。Popover + Calendar の組み合わせ。
 */
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { DatePicker, DateRangePicker } from "./date-picker"
import { Calendar } from "./calendar"
import { type DateRange } from "react-day-picker"

const meta: Meta<typeof DatePicker> = {
  title: "Components/DatePicker",
  component: DatePicker,
}
export default meta

type Story = StoryObj<typeof DatePicker>

function DatePickerDemo() {
  const [date, setDate] = React.useState<Date | undefined>()
  return (
    <div className="w-72">
      <DatePicker value={date} onChange={setDate} />
    </div>
  )
}

function DateRangePickerDemo() {
  const [range, setRange] = React.useState<{ from?: Date; to?: Date } | undefined>()
  return (
    <div className="w-96">
      <DateRangePicker value={range} onChange={setRange} />
    </div>
  )
}

export const Default: Story = {
  render: () => <DatePickerDemo />,
}

export const WithInitialValue: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 11, 25))
    return (
      <div className="w-72">
        <DatePicker value={date} onChange={setDate} />
      </div>
    )
  },
}

/**
 * value が未来の月でも、開くとその選択月（ここでは2028年6月）が表示される。
 * defaultMonth 未指定でも value の月にフォールバックする挙動の確認用（issue #160）。
 */
export const FutureValueOpensSelectedMonth: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date(2028, 5, 15))
    return (
      <div className="w-72">
        <DatePicker value={date} onChange={setDate} />
      </div>
    )
  },
}

/**
 * defaultMonth を明示指定すると、value が無くても開いた月をその月（2030年1月）にできる。
 * 優先順は defaultMonth > value > 今月。
 */
export const WithDefaultMonth: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>()
    return (
      <div className="w-72">
        <DatePicker value={date} onChange={setDate} defaultMonth={new Date(2030, 0, 1)} />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="w-72">
      <DatePicker disabled placeholder="選択不可" />
    </div>
  ),
}

export const RangePicker: Story = {
  render: () => <DateRangePickerDemo />,
}

export const CalendarOnly: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    return <Calendar mode="single" selected={date} onSelect={setDate} />
  },
}

export const CalendarRange: Story = {
  render: () => {
    const [range, setRange] = React.useState<DateRange | undefined>({
      from: new Date(2026, 3, 5),
      to: new Date(2026, 3, 15),
    })
    return <Calendar mode="range" selected={range} onSelect={setRange as (r: unknown) => void} />
  },
}
