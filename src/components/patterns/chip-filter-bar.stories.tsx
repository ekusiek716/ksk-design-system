import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { ChipFilterBar } from "./chip-filter-bar"
import { Chip } from "./chip"

const meta: Meta<typeof ChipFilterBar> = {
  title: "Components/ChipFilterBar",
  component: ChipFilterBar,
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof ChipFilterBar>

function Demo({ resultCount, resultCountLabel }: { resultCount?: number; resultCountLabel?: (n: number) => string }) {
  const [selected, setSelected] = React.useState("all")
  const options = [
    { value: "all", label: "すべて" },
    { value: "work", label: "仕事" },
    { value: "family", label: "家族" },
    { value: "health", label: "健康" },
    { value: "hobby", label: "趣味" },
  ]
  return (
    <ChipFilterBar resultCount={resultCount} resultCountLabel={resultCountLabel}>
      {options.map((o) => (
        <Chip key={o.value} selected={selected === o.value} onClick={() => setSelected(o.value)}>
          {o.label}
        </Chip>
      ))}
    </ChipFilterBar>
  )
}

export const Default: Story = {
  render: () => (
    <div className="max-w-md">
      <Demo resultCount={42} />
    </div>
  ),
}

export const CustomResultCountLabel: Story = {
  render: () => (
    <div className="max-w-md">
      <Demo resultCount={42} resultCountLabel={(n) => `${n} results found`} />
    </div>
  ),
}

export const Sticky: Story = {
  render: () => (
    <div className="max-w-md h-64 overflow-y-auto border border-[var(--Border-Low-Emphasis)]">
      <div className="h-24 bg-[var(--Surface-Secondary)] flex items-center justify-center typo-label-sm text-[var(--Text-Medium-Emphasis)]">
        ヘッダー相当（この下にチップ行が sticky で貼り付く）
      </div>
      <ChipFilterBar sticky stickyOffset={0} resultCount={12}>
        {["すべて", "未着手", "進行中", "完了"].map((label) => (
          <Chip key={label}>{label}</Chip>
        ))}
      </ChipFilterBar>
      <div className="h-96 px-4 py-2 typo-body-md text-[var(--Text-High-Emphasis)]">
        スクロールするとチップ行が上部に固定表示される。
      </div>
    </div>
  ),
}

export const Bare: Story = {
  render: () => (
    <div className="max-w-md flex gap-2 overflow-x-auto scrollbar-hide px-2 py-2 bg-[var(--Surface-Secondary)]">
      <ChipFilterBar bare>
        {["A", "B", "C"].map((label) => (
          <Chip key={label}>{label}</Chip>
        ))}
      </ChipFilterBar>
    </div>
  ),
}
