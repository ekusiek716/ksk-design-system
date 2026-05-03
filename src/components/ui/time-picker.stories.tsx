import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { TimePicker } from "./time-picker"

const meta: Meta<typeof TimePicker> = {
  title: "Components/TimePicker",
  component: TimePicker,
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof TimePicker>

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState("09:00")
    return (
      <div className="w-48">
        <TimePicker value={value} onChange={setValue} />
        <p className="mt-2 typo-body-sm text-[var(--Text-Medium-Emphasis)]">選択: {value}</p>
      </div>
    )
  },
}

export const Step15min: Story = {
  name: "15分刻み",
  render: () => {
    const [value, setValue] = React.useState("10:00")
    return (
      <div className="w-48">
        <TimePicker value={value} onChange={setValue} minuteStep={15} />
      </div>
    )
  },
}
