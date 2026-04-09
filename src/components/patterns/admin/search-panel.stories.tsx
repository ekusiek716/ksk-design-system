import type { Meta, StoryObj } from "@storybook/react"
import { SearchPanel } from "./search-panel"

const meta: Meta<typeof SearchPanel> = { title: "Admin/SearchPanel", component: SearchPanel }
export default meta
type Story = StoryObj<typeof SearchPanel>

export const Default: Story = {
  render: () => (
    <SearchPanel onSearch={() => {}} onReset={() => {}}>
      <div><label className="typo-label-sm text-[var(--Text-Medium-Emphasis)]">注文番号</label><input className="mt-1 h-10 w-full rounded-lg border border-[var(--Border-Medium-Emphasis)] px-3 typo-body-md" placeholder="ORD-" /></div>
      <div><label className="typo-label-sm text-[var(--Text-Medium-Emphasis)]">顧客名</label><input className="mt-1 h-10 w-full rounded-lg border border-[var(--Border-Medium-Emphasis)] px-3 typo-body-md" placeholder="氏名で検索" /></div>
      <div><label className="typo-label-sm text-[var(--Text-Medium-Emphasis)]">ステータス</label><select className="mt-1 h-10 w-full rounded-lg border border-[var(--Border-Medium-Emphasis)] px-3 typo-body-md"><option>すべて</option><option>未処理</option><option>完了</option></select></div>
      <div><label className="typo-label-sm text-[var(--Text-Medium-Emphasis)]">期間</label><input type="date" className="mt-1 h-10 w-full rounded-lg border border-[var(--Border-Medium-Emphasis)] px-3 typo-body-md" /></div>
    </SearchPanel>
  ),
}
