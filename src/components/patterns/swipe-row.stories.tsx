import type { Meta, StoryObj } from "@storybook/react"
import { SwipeRow } from "./swipe-row"

const meta: Meta<typeof SwipeRow> = {
  title: "Patterns/SwipeRow",
  component: SwipeRow,
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof SwipeRow>

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M3 5h12M8 8v5M10 8v5M4 5l1 10h8l1-10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 5V3h4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)
const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M12 3l3 3-9 9H3v-3l9-9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ListItem = ({ title, desc }: { title: string; desc: string }) => (
  <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--Border-Low-Emphasis)]">
    <div className="flex-1 min-w-0">
      <p className="typo-label-md text-[var(--Text-High-Emphasis)] truncate">{title}</p>
      <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)] truncate">{desc}</p>
    </div>
  </div>
)

export const Default: Story = {
  render: () => (
    <div className="w-80 rounded-lg overflow-hidden border border-[var(--Border-Low-Emphasis)]">
      <p className="px-4 py-2 typo-body-xs text-[var(--Text-Low-Emphasis)]">← 左にスワイプ</p>
      <SwipeRow
        actions={[
          { label: "削除", icon: <TrashIcon />, onClick: () => alert("削除"), variant: "destructive" },
        ]}
      >
        <ListItem title="結婚式場の見学予約" desc="2026/05/15 14:00" />
      </SwipeRow>
      <SwipeRow
        actions={[
          { label: "編集", icon: <EditIcon />, onClick: () => alert("編集") },
          { label: "削除", icon: <TrashIcon />, onClick: () => alert("削除"), variant: "destructive" },
        ]}
      >
        <ListItem title="招待状の発送" desc="2026/06/01 までに" />
      </SwipeRow>
      <SwipeRow
        actions={[
          { label: "削除", icon: <TrashIcon />, onClick: () => alert("削除"), variant: "destructive" },
        ]}
      >
        <ListItem title="引き出物の選定" desc="2026/07/01 までに" />
      </SwipeRow>
    </div>
  ),
}
