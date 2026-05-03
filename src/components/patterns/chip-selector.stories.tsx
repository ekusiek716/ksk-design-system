import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { ChipSelector } from "./chip-selector"

const meta: Meta<typeof ChipSelector> = {
  title: "Components/ChipSelector",
  component: ChipSelector,
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof ChipSelector>

const CATEGORIES = [
  { label: "仕事", value: "work" },
  { label: "家族", value: "family" },
  { label: "健康", value: "health" },
  { label: "趣味", value: "hobby" },
  { label: "買い物", value: "shopping" },
  { label: "その他", value: "other" },
]

export const MultiSelect: Story = {
  render: () => {
    const [v, setV] = React.useState<string[]>(["work"])
    return (
      <div className="p-4 space-y-3">
        <ChipSelector options={CATEGORIES} value={v} onChange={setV} />
        <p className="typo-label-xs text-[var(--Text-Low-Emphasis)]">選択: {v.join(", ") || "なし"}</p>
      </div>
    )
  },
}

export const SingleSelect: Story = {
  render: () => {
    const [v, setV] = React.useState<string[]>([])
    return (
      <div className="p-4 space-y-3">
        <ChipSelector options={CATEGORIES} value={v} onChange={setV} multiple={false} />
        <p className="typo-label-xs text-[var(--Text-Low-Emphasis)]">選択: {v[0] ?? "なし"}</p>
      </div>
    )
  },
}

export const WithMax: Story = {
  render: () => {
    const [v, setV] = React.useState<string[]>([])
    return (
      <div className="p-4 space-y-3">
        <p className="typo-label-sm text-[var(--Text-High-Emphasis)]">最大3つまで選択</p>
        <ChipSelector options={CATEGORIES} value={v} onChange={setV} max={3} />
        <p className="typo-label-xs text-[var(--Text-Low-Emphasis)]">{v.length}/3 選択中</p>
      </div>
    )
  },
}
