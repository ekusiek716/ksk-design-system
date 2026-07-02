/**
 * @file DateField のストーリー
 * @description DatePicker を "YYYY-MM-DD" ISO 文字列 API でラップした adapter
 */
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { DateField } from "./date-field"

const meta: Meta<typeof DateField> = {
  title: "Components/DateField",
  component: DateField,
  tags: ["autodocs"],
}
export default meta

type Story = StoryObj<typeof DateField>

function DateFieldDemo(props: Partial<React.ComponentProps<typeof DateField>>) {
  const [value, setValue] = React.useState(props.value ?? "")
  return (
    <div className="w-72">
      <DateField {...props} value={value} onChange={setValue} />
      <p className="typo-body-sm text-[var(--Text-Low-Emphasis)] mt-2">value: {value || "(empty)"}</p>
    </div>
  )
}

export const Default: Story = {
  render: () => <DateFieldDemo />,
}

export const WithInitialValue: Story = {
  render: () => <DateFieldDemo value="2026-12-25" />,
}

export const CustomPlaceholder: Story = {
  render: () => <DateFieldDemo placeholder="挙式日を選択" />,
}

export const Disabled: Story = {
  render: () => <DateFieldDemo value="2026-01-01" disabled />,
}

export const CustomFormat: Story = {
  render: () => <DateFieldDemo value="2026-07-02" dateFormat="yyyy年MM月dd日" />,
}
