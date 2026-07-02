import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { CollapsibleChipField } from "./collapsible-chip-field"

const meta: Meta<typeof CollapsibleChipField> = {
  title: "Components/CollapsibleChipField",
  component: CollapsibleChipField,
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof CollapsibleChipField>

type Category = "work" | "family" | "health" | "hobby" | "shopping" | "other"

const LABELS: Record<Category, string> = {
  work: "仕事",
  family: "家族",
  health: "健康",
  hobby: "趣味",
  shopping: "買い物",
  other: "その他",
}

const ICONS: Record<Category, string> = {
  work: "\u{1F4BC}",
  family: "\u{1F46A}",
  health: "\u{1F3E5}",
  hobby: "\u{1F3A8}",
  shopping: "\u{1F6CD}",
  other: "\u{1F4CC}",
}

const OPTIONS: Category[] = ["work", "family", "health", "hobby", "shopping", "other"]

export const WithLabel: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<Category | "">("")
    return (
      <div className="p-4 max-w-md">
        <CollapsibleChipField<Category>
          label="カテゴリ"
          options={OPTIONS}
          selected={selected}
          onSelect={setSelected}
          onClear={() => setSelected("")}
          getLabel={(k) => LABELS[k]}
        />
      </div>
    )
  },
}

export const WithIcon: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<Category | "">("work")
    return (
      <div className="p-4 max-w-md">
        <CollapsibleChipField<Category>
          icon={<span aria-hidden="true">{ICONS.work}</span>}
          options={OPTIONS}
          selected={selected}
          onSelect={setSelected}
          onClear={() => setSelected("")}
          getLabel={(k) => LABELS[k]}
          getIcon={(k) => ICONS[k]}
        />
      </div>
    )
  },
}

export const RequiredNoClear: Story = {
  render: () => {
    // onClear 未指定: 選択済み chip を再タップすると再選択用に全展開するのみ（解除不可）
    const [selected, setSelected] = React.useState<Category | "">("family")
    return (
      <div className="p-4 max-w-md">
        <CollapsibleChipField<Category>
          label="必須項目"
          options={OPTIONS}
          selected={selected}
          onSelect={setSelected}
          getLabel={(k) => LABELS[k]}
        />
      </div>
    )
  },
}

export const AlwaysExpanded: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<Category | "">("hobby")
    return (
      <div className="p-4 max-w-md">
        <CollapsibleChipField<Category>
          label="比較表示"
          options={OPTIONS}
          selected={selected}
          onSelect={setSelected}
          onClear={() => setSelected("")}
          getLabel={(k) => LABELS[k]}
          alwaysExpanded
        />
      </div>
    )
  },
}
