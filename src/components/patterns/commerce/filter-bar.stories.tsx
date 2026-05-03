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
        { label: "お届け日" },
        { label: "価格", value: "¥3,000〜¥5,000", isActive: true },
        { label: "カテゴリ" },
        { label: "評価" },
      ]}
      resultCount={689}
      sortLabel="おすすめ順"
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
          label: "価格",
          selectedValue: price ?? undefined,
          isActive: !!price,
          options: [
            { label: "〜¥1,000", value: "0-1000" },
            { label: "¥1,000〜¥3,000", value: "1000-3000" },
            { label: "¥3,000〜¥5,000", value: "3000-5000" },
            { label: "¥5,000〜¥10,000", value: "5000-10000" },
            { label: "¥10,000〜", value: "10000-" },
          ],
          onSelect: (v) => setPrice(v),
        },
        {
          label: "カテゴリ",
          selectedValue: category ?? undefined,
          isActive: !!category,
          options: [
            { label: "ケーキ", value: "cake" },
            { label: "焼き菓子", value: "baked" },
            { label: "チョコレート", value: "chocolate" },
            { label: "アイス", value: "ice" },
          ],
          onSelect: (v) => setCategory(v),
        },
        {
          label: "評価",
          selectedValue: rating ?? undefined,
          isActive: !!rating,
          options: [
            { label: "4.5以上", value: "4.5" },
            { label: "4.0以上", value: "4.0" },
            { label: "3.5以上", value: "3.5" },
          ],
          onSelect: (v) => setRating(v),
        },
        { label: "お届け日", onClick: () => {} },
      ]}
      resultCount={689}
      sortOptions={[
        { label: "おすすめ順", value: "recommend" },
        { label: "価格が安い順", value: "price-asc" },
        { label: "価格が高い順", value: "price-desc" },
        { label: "レビューが多い順", value: "review" },
        { label: "新着順", value: "new" },
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
