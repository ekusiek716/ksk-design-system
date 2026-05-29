/**
 * @file BulkActions のストーリー
 * @description テーブル行選択時に画面下部に浮き上がるフローティング操作バー
 */
import type { Meta, StoryObj } from "@storybook/react"
import { BulkActions } from "./bulk-actions"
import { Button } from "@/components/ui/button"

const meta: Meta<typeof BulkActions> = {
  title: "Components/Admin/BulkActions",
  component: BulkActions,
}
export default meta
type Story = StoryObj<typeof BulkActions>

export const Default: Story = {
  render: () => (
    <div className="relative h-64">
      <p className="typo-body-md text-[var(--Text-Medium-Emphasis)] p-4">
        テーブル行を選択すると下部にバーが表示されます
      </p>
      <BulkActions selectedCount={3} onClear={() => {}}>
        <Button variant="ghost-inverse" size="sm" className="rounded-full">
          削除する
        </Button>
        <Button variant="ghost-inverse" size="sm" className="rounded-full">
          エクスポート
        </Button>
      </BulkActions>
    </div>
  ),
}

export const ManySelected: Story = {
  render: () => (
    <div className="relative h-64">
      <BulkActions selectedCount={128} onClear={() => {}}>
        <Button variant="ghost-inverse" size="sm" className="rounded-full">
          一括ステータス変更
        </Button>
        <Button variant="ghost-inverse" size="sm" className="rounded-full text-[var(--Text-Caution)]">
          一括削除
        </Button>
      </BulkActions>
    </div>
  ),
}
