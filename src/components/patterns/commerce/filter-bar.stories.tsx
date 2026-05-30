/**
 * @file FilterBar のストーリー
 * @description フィルターチップの選択挙動 + 並べ替えドロップダウンをインタラクティブに確認
 */
import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { FilterBar } from "./filter-bar"

const meta: Meta<typeof FilterBar> = {
  title: "Components/FilterBar",
  component: FilterBar,
}
export default meta
type Story = StoryObj<typeof FilterBar>

export const Default: Story = {
  render: () => (
    <FilterBar
      filters={[
        { label: "ステータス" },
        { label: "担当者", value: "山田 太郎", isActive: true },
        { label: "種別" },
        { label: "優先度" },
      ]}
      resultCount={128}
      sortLabel="更新日順"
      onSortClick={() => {}}
      onMoreFilters={() => {}}
      activeFilterCount={1}
    />
  ),
}

function InteractiveDemo() {
  const [price, setPrice] = React.useState<string | null>(null)
  const [category, setCategory] = React.useState<string | null>(null)
  const [rating, setRating] = React.useState<string | null>(null)
  const [sort, setSort] = React.useState("recommend")

  const activeCount = [price, category, rating].filter(Boolean).length

  return (
    <FilterBar
      filters={[
        {
          label: "ステータス",
          selectedValue: price ?? undefined,
          isActive: !!price,
          options: [
            { label: "未着手", value: "todo" },
            { label: "進行中", value: "in-progress" },
            { label: "レビュー中", value: "review" },
            { label: "完了", value: "done" },
            { label: "保留", value: "on-hold" },
          ],
          onSelect: (v) => setPrice(v),
        },
        {
          label: "種別",
          selectedValue: category ?? undefined,
          isActive: !!category,
          options: [
            { label: "バグ", value: "bug" },
            { label: "機能要望", value: "feature" },
            { label: "改善", value: "improvement" },
            { label: "質問", value: "question" },
          ],
          onSelect: (v) => setCategory(v),
        },
        {
          label: "優先度",
          selectedValue: rating ?? undefined,
          isActive: !!rating,
          options: [
            { label: "高", value: "high" },
            { label: "中", value: "medium" },
            { label: "低", value: "low" },
          ],
          onSelect: (v) => setRating(v),
        },
        { label: "担当者", onClick: () => {} },
      ]}
      resultCount={128}
      sortOptions={[
        { label: "更新日順", value: "recommend" },
        { label: "作成日が新しい順", value: "price-asc" },
        { label: "作成日が古い順", value: "price-desc" },
        { label: "優先度が高い順", value: "review" },
        { label: "名前順", value: "new" },
      ]}
      selectedSort={sort}
      onSortSelect={setSort}
      onMoreFilters={() => {}}
      activeFilterCount={activeCount}
    />
  )
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
}
