import type { Meta, StoryObj } from "@storybook/react"
import { StatusTabs } from "./status-tabs"

const meta: Meta<typeof StatusTabs> = { title: "Components/StatusTabs", component: StatusTabs }
export default meta
type Story = StoryObj<typeof StatusTabs>

export const Default: Story = {
  render: () => (
    <StatusTabs items={[
      { label: "すべて", count: 156 },
      { label: "未処理", count: 23 },
      { label: "処理中", count: 8 },
      { label: "完了", count: 120 },
      { label: "キャンセル", count: 5 },
    ]} />
  ),
}
