/**
 * @file KanbanColumn のストーリー
 * @description カンバンの列の入れ物（issue #679）
 */
import type { Meta, StoryObj } from "@storybook/react"
import { KanbanColumn } from "./kanban-column"
import { Card, CardTitle, CardDescription } from "../ui/card"
import { AddTile } from "./add-tile"

const meta: Meta<typeof KanbanColumn> = {
  title: "Components/KanbanColumn",
  component: KanbanColumn,
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof KanbanColumn>

export const Board: Story = {
  render: () => (
    <div className="flex gap-4 overflow-x-auto">
      <KanbanColumn title="未着手" count={2} tone="neutral" footer={<AddTile size="sm" label="タスクを追加" />}>
        <Card elevation="none" onClick={() => {}}><CardTitle>招待状のデザイン</CardTitle><CardDescription>10/20</CardDescription></Card>
        <Card elevation="none" onClick={() => {}}><CardTitle>席次表</CardTitle></Card>
      </KanbanColumn>
      <KanbanColumn title="進行中" count={1} tone="info">
        <Card elevation="none" onClick={() => {}}><CardTitle>衣装合わせ</CardTitle></Card>
      </KanbanColumn>
      <KanbanColumn title="完了" count={0} tone="success" />
    </div>
  ),
}

/**
 * 分類別のボード（issue #702）。見出しのドットを分類の識別色（`--Categorical-*`）で塗る。
 * 状態（意味）の色は `tone`、分類の色は `accentColor` を使い分ける。
 * 色だけで分類を伝えない（見出しの言葉が正）。
 */
export const CategoryBoard: Story = {
  render: () => (
    <div className="flex gap-4 overflow-x-auto">
      <KanbanColumn title="会場" count={1} accentColor="var(--Categorical-1)">
        <Card elevation="none" onClick={() => {}}><CardTitle>会場見学の予約</CardTitle></Card>
      </KanbanColumn>
      <KanbanColumn title="衣装" count={1} accentColor="var(--Categorical-5)">
        <Card elevation="none" onClick={() => {}}><CardTitle>試着の日程</CardTitle></Card>
      </KanbanColumn>
      <KanbanColumn title="写真" count={0} accentColor="var(--Categorical-9)" />
    </div>
  ),
}
