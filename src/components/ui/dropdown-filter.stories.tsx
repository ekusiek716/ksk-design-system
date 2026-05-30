import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { RowVertical, Element3, Calendar } from "iconsax-reactjs"
import { DropdownFilter } from "./dropdown-filter"

const meta: Meta<typeof DropdownFilter> = {
  title: "Components/DropdownFilter",
  component: DropdownFilter,
  parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof DropdownFilter>

const options = [
  { key: "attending", label: "出席" },
  { key: "declined", label: "欠席" },
  { key: "undecided", label: "未定" },
  { key: "no_reply", label: "未回答" },
]

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<string | "all">("all")
    return (
      <DropdownFilter
        label="出欠"
        value={value}
        options={options}
        onSelect={setValue}
      />
    )
  },
}

export const ActiveFilter: Story = {
  render: () => {
    const [value, setValue] = useState<string | "all">("attending")
    return (
      <DropdownFilter
        label="出欠"
        value={value}
        options={options}
        onSelect={setValue}
      />
    )
  },
}

export const WithIcons: Story = {
  name: "WithIcons（ビュー切替・アイコン付き）",
  render: () => {
    const [view, setView] = useState<string | "all">("list")
    return (
      <DropdownFilter
        label="表示"
        value={view}
        options={[
          { key: "list", label: "リスト", icon: <RowVertical size={16} /> },
          { key: "board", label: "ボード", icon: <Element3 size={16} /> },
          { key: "calendar", label: "カレンダー", icon: <Calendar size={16} /> },
        ]}
        onSelect={setView}
        hideAll
        valueOnly
      />
    )
  },
}

export const MultipleFilters: Story = {
  render: () => {
    const [attendance, setAttendance] = useState<string | "all">("all")
    const [side, setSide] = useState<string | "all">("groom")
    return (
      <div className="flex gap-2">
        <DropdownFilter
          label="新郎/新婦"
          value={side}
          options={[
            { key: "groom", label: "新郎側" },
            { key: "bride", label: "新婦側" },
            { key: "both", label: "共通" },
          ]}
          onSelect={setSide}
        />
        <DropdownFilter
          label="出欠"
          value={attendance}
          options={options}
          onSelect={setAttendance}
        />
      </div>
    )
  },
}
