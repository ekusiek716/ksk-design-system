/**
 * @file FilterChip のストーリー
 * @description FilterBar 内で使う絞り込みトグルチップ。非 active=outline、active=filled。
 */
import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { FilterChip } from "./filter-chip"

const meta: Meta<typeof FilterChip> = {
  title: "Patterns/FilterChip",
  component: FilterChip,
  tags: ["autodocs"],
}
export default meta

type Story = StoryObj<typeof FilterChip>

export const Inactive: Story = {
  args: {
    label: "エリア",
    isActive: false,
    onClick: () => {},
  },
}

export const ActiveWithValue: Story = {
  args: {
    label: "エリア",
    value: "渋谷",
    isActive: true,
    onClick: () => {},
  },
}

export const Toggle: Story = {
  render: () => {
    const [active, setActive] = React.useState(false)
    return (
      <FilterChip
        label="価格帯"
        value="〜5,000円"
        isActive={active}
        onClick={() => setActive((a) => !a)}
      />
    )
  },
}

export const Group: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<string | null>("area")
    const items = [
      { key: "area", label: "エリア", value: "渋谷" },
      { key: "price", label: "価格帯", value: "〜5,000円" },
      { key: "brand", label: "ブランド" },
    ]
    return (
      <div className="flex gap-2 flex-wrap">
        {items.map((item) => (
          <FilterChip
            key={item.key}
            label={item.label}
            value={item.value}
            isActive={selected === item.key}
            onClick={() => setSelected((s) => (s === item.key ? null : item.key))}
          />
        ))}
      </div>
    )
  },
}
