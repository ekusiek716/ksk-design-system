import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { SubNav } from "./sub-nav"

const meta: Meta<typeof SubNav> = {
  title: "Components/SubNav",
  component: SubNav,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
}
export default meta
type Story = StoryObj<typeof SubNav>

const categories = [
  { label: "すべて", value: "all" },
  { label: "概要", value: "overview" },
  { label: "アクティビティ", value: "activity" },
  { label: "メンバー", value: "members" },
  { label: "設定", value: "settings" },
  { label: "請求", value: "billing" },
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

export const WithDescriptions: Story = {
  render: () => {
    const [value, setValue] = React.useState("list")
    const items = [
      { label: "リスト", value: "list", description: "期限順にタスクを一覧表示します" },
      { label: "タイムライン", value: "timeline", description: "日付ごとの流れで確認します" },
      { label: "ボード", value: "board", description: "ステータスごとにカードを並べます" },
      { label: "カレンダー", value: "calendar", description: "予定日を月表示で確認します" },
    ]
    return (
      <div className="w-96">
        <SubNav items={items} value={value} onChange={setValue} variant="chip" />
        <div className="px-2 typo-body-sm text-[var(--Text-Medium-Emphasis)]">選択中: {value}</div>
      </div>
    )
  },
}
