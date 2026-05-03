/**
 * @file BulkActionBar のストーリー
 * @description テーブル行選択時に画面下部に浮き上がるフローティング操作バー
 */
import type { Meta, StoryObj } from "@storybook/react"
import { BulkActions } from "./bulk-actions"

const meta: Meta<typeof BulkActionBar> = {
  title: "Components/Admin/BulkActions",
  component: BulkActions,
}
export default meta
type Story = StoryObj<typeof BulkActionBar>

export const Default: Story = {
  render: () => (
    <div className="relative h-64">
      <p className="typo-body-md text-[var(--Text-Medium-Emphasis)] p-4">
        テーブル行を選択すると下部にバーが表示されます
      </p>
      <BulkActions selectedCount={3} onClear={() => {}}>
        <button className="h-8 px-3 rounded-full typo-label-sm text-[var(--Text-on-Inverse)] hover:bg-[var(--Text-on-Inverse)]/10 transition-colors cursor-pointer">
          削除する
        </button>
        <button className="h-8 px-3 rounded-full typo-label-sm text-[var(--Text-on-Inverse)] hover:bg-[var(--Text-on-Inverse)]/10 transition-colors cursor-pointer">
          エクスポート
        </button>
      </BulkActions>
    </div>
  ),
}

export const ManySelected: Story = {
  render: () => (
    <div className="relative h-64">
      <BulkActions selectedCount={128} onClear={() => {}}>
        <button className="h-8 px-3 rounded-full typo-label-sm text-[var(--Text-on-Inverse)] hover:bg-[var(--Text-on-Inverse)]/10 transition-colors cursor-pointer">
          一括ステータス変更
        </button>
        <button className="h-8 px-3 rounded-full typo-label-sm text-[var(--Text-Caution)] hover:bg-[var(--Text-on-Inverse)]/10 transition-colors cursor-pointer">
          一括削除
        </button>
      </BulkActions>
    </div>
  ),
}
