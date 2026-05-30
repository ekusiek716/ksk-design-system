import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { SwipeRow } from "./swipe-row"

const meta: Meta<typeof SwipeRow> = {
  title: "Components/SwipeRow",
  component: SwipeRow,
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof SwipeRow>

const TrashIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M3 5h14M8 9v6M12 9v6M4 5l1 11h10l1-11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 5V3h4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)
const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M13 4l3 3-9 9H4v-3l9-9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function TodoItem({ title, desc, done }: { title: string; desc: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 bg-[var(--Surface-Primary)]">
      <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${done ? "bg-[var(--Brand-Primary)] border-[var(--Brand-Primary)]" : "border-[var(--Border-Medium-Emphasis)]"}`}>
        {done && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`typo-label-md truncate ${done ? "line-through text-[var(--Text-Low-Emphasis)]" : "text-[var(--Text-High-Emphasis)]"}`}>{title}</p>
        <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)] truncate">{desc}</p>
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => {
    const [items, setItems] = React.useState([
      { id: 1, title: "キックオフMTGの予約", desc: "2026/05/15 14:00", done: false },
      { id: 2, title: "請求書の送付", desc: "2026/06/01 までに", done: false },
      { id: 3, title: "見積書の作成", desc: "2026/07/01 までに", done: true },
    ])

    const remove = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id))

    return (
      <div className="w-80 bg-[var(--Surface-Primary)] rounded-xl border border-[var(--Border-Low-Emphasis)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--Border-Low-Emphasis)] flex items-center justify-between">
          <span className="typo-label-md text-[var(--Text-High-Emphasis)]">タスク</span>
          <span className="typo-label-xs text-[var(--Text-Low-Emphasis)]">← 左にスワイプして操作</span>
        </div>
        {items.map((item, i) => (
          <React.Fragment key={item.id}>
            {i > 0 && <div className="h-px bg-[var(--Border-Low-Emphasis)]" />}
            <SwipeRow
              actions={[
                { label: "編集", icon: <EditIcon />, onClick: () => alert(`編集: ${item.title}`) },
                { label: "削除", icon: <TrashIcon />, onClick: () => remove(item.id), variant: "destructive" },
              ]}
            >
              <TodoItem title={item.title} desc={item.desc} done={item.done} />
            </SwipeRow>
          </React.Fragment>
        ))}
      </div>
    )
  },
}

export const SingleAction: Story = {
  render: () => (
    <div className="w-80 rounded-xl border border-[var(--Border-Low-Emphasis)] overflow-hidden">
      <SwipeRow actions={[{ label: "削除", icon: <TrashIcon />, onClick: () => {}, variant: "destructive" }]}>
        <TodoItem title="左にスワイプして削除" desc="スワイプまたはドラッグで操作できます" />
      </SwipeRow>
    </div>
  ),
}
