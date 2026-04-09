/**
 * @file EmptyState のストーリー
 * @description 空状態コンポーネント。アイコン、タイトル、説明、アクションボタン付き
 */
import type { Meta, StoryObj } from "@storybook/react"
import { EmptyState } from "./empty-state"
import { Button } from "../ui/button"

const meta: Meta<typeof EmptyState> = {
  title: "Patterns/EmptyState",
  component: EmptyState,
}
export default meta

type Story = StoryObj<typeof EmptyState>

export const WithAction: Story = {
  args: {
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="8" y="12" width="32" height="24" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M8 18H40" stroke="currentColor" strokeWidth="2" /><circle cx="14" cy="15" r="1.5" fill="currentColor" /><circle cx="19" cy="15" r="1.5" fill="currentColor" /><circle cx="24" cy="15" r="1.5" fill="currentColor" /></svg>
    ),
    title: "プロジェクトがありません",
    description: "最初のプロジェクトを作成して始めましょう。",
    action: <Button>プロジェクトを作成</Button>,
  },
}

export const Minimal: Story = {
  args: {
    title: "データがありません",
    description: "検索条件を変更してお試しください。",
  },
}

export const WithIconOnly: Story = {
  args: {
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="20" r="8" stroke="currentColor" strokeWidth="2" /><path d="M12 40C12 33.4 17.4 28 24 28C30.6 28 36 33.4 36 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
    ),
    title: "メンバーがいません",
    description: "チームにメンバーを招待してください。",
    action: <Button variant="secondary">メンバーを招待</Button>,
  },
}
