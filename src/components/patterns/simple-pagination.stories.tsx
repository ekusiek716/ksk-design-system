/**
 * @file SimplePagination のストーリー
 * @description 前/次ボタン + 件数カウンタ型のページネーション（`3 / 10 ページ`,
 *   `21-40 / 689 件`）。`format` 推論・`compact`・`renderLabel` 等のラベル制御を
 *   props で完結できる高レベルコンポーネント。
 *
 *   ページ番号を一覧で並べて直接ジャンプさせたい「番号リスト型」が欲しい場合は
 *   **Pagination**（Components）を使う。
 */
import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { SimplePagination } from "./simple-pagination"

const meta: Meta<typeof SimplePagination> = {
  title: "Components/SimplePagination",
  component: SimplePagination,
}
export default meta

type Story = StoryObj<typeof SimplePagination>

export const Items: Story = {
  name: "アイテム数指定 (items)",
  render: function ItemsStory() {
    const [page, setPage] = React.useState(1)
    return (
      <div className="mx-auto w-full max-w-md p-6">
        <SimplePagination
          page={page}
          pageSize={20}
          total={235}
          onPageChange={setPage}
        />
      </div>
    )
  },
}

export const Pages: Story = {
  name: "ページ数指定 (pages)",
  render: function PagesStory() {
    const [page, setPage] = React.useState(3)
    return (
      <div className="mx-auto w-full max-w-md p-6">
        <SimplePagination page={page} totalPages={10} onPageChange={setPage} />
      </div>
    )
  },
}

export const Compact: Story = {
  name: "compact (モバイル省略表示)",
  render: function CompactStory() {
    const [page, setPage] = React.useState(2)
    return (
      <div className="mx-auto w-full max-w-xs p-6">
        <SimplePagination
          page={page}
          totalPages={10}
          onPageChange={setPage}
          compact
        />
      </div>
    )
  },
}

export const DisabledAtBoundaries: Story = {
  name: "境界での disabled",
  render: () => (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 p-6">
      <SimplePagination page={1} totalPages={5} onPageChange={() => {}} />
      <SimplePagination page={5} totalPages={5} onPageChange={() => {}} />
    </div>
  ),
}

export const Empty: Story = {
  name: "0 件",
  render: () => (
    <div className="mx-auto w-full max-w-md p-6">
      <SimplePagination
        page={1}
        pageSize={20}
        total={0}
        onPageChange={() => {}}
      />
    </div>
  ),
}
