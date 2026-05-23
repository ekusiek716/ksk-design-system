/**
 * @file SimplePagination のストーリー
 * @description 最小ページネーション。「前 / 次 / 現在 / 総数」のみのコンパクトな構成
 */
import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { SimplePagination } from "./simple-pagination"

const meta: Meta<typeof SimplePagination> = {
  title: "Patterns/SimplePagination",
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
