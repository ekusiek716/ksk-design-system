/**
 * @file DatePicker / DateRangePicker のストーリー
 * @description 日付選択コンポーネント。Popover + Calendar の組み合わせ。
 */
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { FormField } from "../patterns/form-field"
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

/**
 * clearable を付けると、値があるときトリガーの右側に日付のクリアボタンが出る（issue #803）。
 * カレンダーで選択中の日をもう一度押しても値は外れないので、任意項目で値を消させたい画面はこれを使う。
 */
export const Clearable: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 9, 15))
    return (
      <div className="w-72">
        <DatePicker value={date} onChange={setDate} clearable />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const clear = canvas.getByRole("button", { name: "日付をクリア" })
    await expect(clear).toBeVisible()
    await userEvent.click(clear)
    await waitFor(() => expect(canvas.queryByRole("button", { name: "日付をクリア" })).toBeNull())
    await expect(canvas.getByText("日付を選択")).toBeVisible()
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

// --Border-Caution の解決後の色（FormField の error で出るエラー枠の期待色）
const cautionBorderColor = () => {
  const probe = document.createElement("div")
  probe.style.cssText = "border: 1px solid var(--Border-Caution); position: absolute;"
  document.body.appendChild(probe)
  const color = getComputedStyle(probe).borderTopColor
  probe.remove()
  return color
}

/** FormField の error がトリガーに届き、エラー枠（赤枠）になる。 */
export const InvalidInFormField: Story = {
  tags: ["interaction", "!autodocs"],
  render: () => (
    <div className="w-72">
      <FormField label="日付を" error="入力してください">
        <DatePicker />
      </FormField>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", { name: "日付を選択" })
    await expect(trigger).toHaveAttribute("aria-invalid", "true")
    await expect(trigger.getAttribute("aria-describedby")).toBeTruthy()
    await expect(getComputedStyle(trigger).borderTopColor).toBe(cautionBorderColor())
  },
}
