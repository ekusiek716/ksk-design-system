/**
 * @file EmptyState のストーリー
 * @description 空状態コンポーネント。アイコン、タイトル、説明、アクションボタン付き
 */
import type { Meta, StoryObj } from "@storybook/react"
import { EmptyState } from "./empty-state"
import { Button } from "../ui/button"

const meta: Meta<typeof EmptyState> = {
  title: "Components/EmptyState",
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

/**
 * 主アクション + 副アクションの 2 ボタン横並びパターン。
 *
 * ガイドライン:
 * - action は **最大 2 つまで**。3 つ以上は EmptyState の意図 (空状態からの
 *   起点を 1 つ示す) に反するため使わない。
 * - **より重要なものを左**、補助的なものを右に配置する。
 *   日本のモバイル UI では「左=メイン」が一般的。
 * - 2 ボタンは同サイズ (size 揃え)。主は `default` バリアント、副は
 *   `secondary` または `ghost` で階層差を付ける。
 * - 「キャンセル」「閉じる」のような後ろ向きアクションを副に置かない
 *   (EmptyState は何もない状態に対する案内なので「閉じる」は意味を成さない)。
 */
export const WithDualAction: Story = {
  name: "With dual action (recommended layout)",
  args: {
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M24 8L29.5 19l12 1.5-9 8 2.5 12L24 34.5 13 40.5l2.5-12-9-8L18.5 19 24 8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
    ),
    title: "お気に入りがありません",
    description: "気になる商品を保存して、後でまとめて確認できます。",
    action: (
      <div className="flex gap-2 justify-center">
        <Button>商品を探す</Button>
        <Button variant="secondary">使い方を見る</Button>
      </div>
    ),
  },
}

export const Compact: Story = {
  args: {
    title: "まだタスクがありません",
    description: "条件を変えるか、新しいタスクを追加してください。",
    size: "compact",
    action: <Button size="sm">タスクを追加</Button>,
  },
}

export const Inline: Story = {
  args: {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" /><path d="M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
    ),
    title: "この条件の項目はありません",
    description: "リスト内に置ける省スペース表示です。",
    size: "inline",
  },
}
