import type { Meta, StoryObj } from "@storybook/react"
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
