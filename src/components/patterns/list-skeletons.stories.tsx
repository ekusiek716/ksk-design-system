/**
 * @file ListSkeleton / GridSkeleton のストーリー
 * @description データ取得中の「画面構造は読めるが読み込み中」プレースホルダ。
 */
import type { Meta, StoryObj } from "@storybook/react"
import { ListSkeleton, GridSkeleton } from "./list-skeletons"

const meta: Meta<typeof ListSkeleton> = {
  title: "Patterns/ListSkeleton",
  component: ListSkeleton,
  tags: ["autodocs"],
}
export default meta

type Story = StoryObj<typeof ListSkeleton>

export const Default: Story = {
  args: {
    rows: 5,
    hasFilter: true,
  },
}

export const WithoutFilter: Story = {
  args: {
    rows: 4,
    hasFilter: false,
  },
}

export const FewRows: Story = {
  args: {
    rows: 2,
    hasFilter: true,
    rowHeight: 72,
  },
}

/** GridSkeleton — グリッド型サブタブ用。同ファイルに同居しているため併記する。 */
export const Grid: StoryObj<typeof GridSkeleton> = {
  render: () => <GridSkeleton rows={2} columns={2} />,
}

export const GridThreeColumns: StoryObj<typeof GridSkeleton> = {
  render: () => <GridSkeleton rows={2} columns={3} cardHeight={100} />,
}
