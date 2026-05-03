import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { SubNav } from "./sub-nav"

const meta: Meta<typeof NavigationRibbon> = {
  title: "Components/SubNav",
  component: SubNav,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
}
export default meta
type Story = StoryObj<typeof NavigationRibbon>

const categories = [
  { label: "すべて", value: "all" },
  { label: "ウェディングケーキ", value: "wedding" },
  { label: "誕生日ケーキ", value: "birthday" },
  { label: "記念日", value: "anniversary" },
  { label: "バースデー", value: "bday" },
  { label: "ギフト", value: "gift" },
]

export const Underline: Story = {
  render: () => {
    const [value, setValue] = React.useState("all")
    return (
      <div className="w-80 border border-[var(--Border-Low-Emphasis)] rounded-xl overflow-hidden">
        <SubNav items={categories} value={value} onChange={setValue} variant="underline" />
        <div className="p-4 typo-body-sm text-[var(--Text-Medium-Emphasis)]">選択中: {value}</div>
      </div>
    )
  },
}

export const Chip: Story = {
  render: () => {
    const [value, setValue] = React.useState("all")
    return (
      <div className="w-80">
        <SubNav items={categories} value={value} onChange={setValue} variant="chip" />
        <div className="px-2 typo-body-sm text-[var(--Text-Medium-Emphasis)]">選択中: {value}</div>
      </div>
    )
  },
}

export const WithBadge: Story = {
  render: () => {
    const [value, setValue] = React.useState("all")
    const items = [
      { label: "すべて", value: "all", badge: 24 },
      { label: "未読", value: "unread", badge: 3 },
      { label: "処理中", value: "processing", badge: 7 },
      { label: "完了", value: "done" },
    ]
    return (
      <div className="w-80">
        <SubNav items={items} value={value} onChange={setValue} variant="underline" />
      </div>
    )
  },
}
