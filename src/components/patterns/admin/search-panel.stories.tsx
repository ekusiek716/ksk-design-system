import type { Meta, StoryObj } from "@storybook/react"
import { SearchPanel } from "./search-panel"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"

const meta: Meta<typeof SearchPanel> = { title: "Components/Admin/SearchPanel", component: SearchPanel }
export default meta
type Story = StoryObj<typeof SearchPanel>

export const Default: Story = {
  render: () => (
    <SearchPanel onSearch={() => {}} onReset={() => {}}>
      <div>
        <label className="typo-label-sm text-[var(--Text-Medium-Emphasis)]">注文番号</label>
        <Input className="mt-1" placeholder="ORD-" />
      </div>
      <div>
        <label className="typo-label-sm text-[var(--Text-Medium-Emphasis)]">顧客名</label>
        <Input className="mt-1" placeholder="氏名で検索" />
      </div>
      <div>
        <label className="typo-label-sm text-[var(--Text-Medium-Emphasis)]">ステータス</label>
        <Select>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="すべて" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="pending">未処理</SelectItem>
            <SelectItem value="done">完了</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="typo-label-sm text-[var(--Text-Medium-Emphasis)]">期間</label>
        <div className="mt-1">
          <DatePicker placeholder="日付を選択" />
        </div>
      </div>
    </SearchPanel>
  ),
}
