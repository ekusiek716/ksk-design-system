import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import { FormField } from "@/components/patterns/form-field"
import { DateTimePicker } from "./date-time-picker"

const meta: Meta<typeof DateTimePicker> = {
  title: "Components/DateTimePicker",
  component: DateTimePicker,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof DateTimePicker>

function Demo() {
  const [value, setValue] = React.useState<Date | undefined>(
    new Date(2026, 6, 23, 9, 30),
  )
  return (
    <div className="w-full max-w-md">
      <FormField
        label="公開日時"
        htmlFor="publish-at"
        description="日付を選んだあと、時刻を指定してください。"
      >
        <DateTimePicker
          id="publish-at"
          value={value}
          onChange={setValue}
        />
      </FormField>
    </div>
  )
}

export const Default: Story = {
  render: () => <Demo />,
}

export const Empty: Story = {
  render: () => {
    const [value, setValue] = React.useState<Date | undefined>()
    return (
      <div className="w-full max-w-md">
        <DateTimePicker value={value} onChange={setValue} />
      </div>
    )
  },
}

export const Bounded: Story = {
  args: {
    value: new Date(2026, 6, 23, 9, 30),
    min: new Date(2026, 6, 23, 9, 0),
    max: new Date(2026, 6, 31, 18, 0),
    minuteStep: 15,
  },
}
