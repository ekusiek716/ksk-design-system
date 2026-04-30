import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { PillToggle } from "./pill-toggle"

const meta: Meta<typeof PillToggle> = {
  title: "UI/PillToggle",
  component: PillToggle,
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof PillToggle>

export const Default: Story = {
  render: () => {
    const [v, setV] = React.useState("all")
    return (
      <PillToggle
        options={[
          { label: "すべて", value: "all" },
          { label: "進行中", value: "active" },
          { label: "完了", value: "done" },
        ]}
        value={v}
        onChange={setV}
      />
    )
  },
}

export const TwoState: Story = {
  render: () => {
    const [v, setV] = React.useState("income")
    return (
      <PillToggle
        options={[
          { label: "収入", value: "income" },
          { label: "支出", value: "expense" },
        ]}
        value={v}
        onChange={setV}
      />
    )
  },
}

export const Small: Story = {
  render: () => {
    const [v, setV] = React.useState("week")
    return (
      <PillToggle
        size="sm"
        options={[
          { label: "週", value: "week" },
          { label: "月", value: "month" },
          { label: "年", value: "year" },
        ]}
        value={v}
        onChange={setV}
      />
    )
  },
}
