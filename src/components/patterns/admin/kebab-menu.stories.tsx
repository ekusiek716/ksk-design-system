import type { Meta, StoryObj } from "@storybook/react"
import { KebabMenu } from "./kebab-menu"

const meta: Meta<typeof KebabMenu> = { title: "Components/KebabMenu", component: KebabMenu }
export default meta
type Story = StoryObj<typeof KebabMenu>

export const Default: Story = {
  render: () => (
    <div className="flex justify-end p-8">
      <KebabMenu items={[
        { label: "編集" },
        { label: "複製" },
        { label: "削除", destructive: true },
      ]} />
    </div>
  ),
}

export const WithMetadata: Story = {
  render: () => (
    <div className="flex justify-end p-8">
      <KebabMenu items={[
        { label: "編集", description: "詳細を開いて内容を変更", shortcut: "E" },
        { label: "複製", shortcut: "D" },
        { type: "separator" },
        { label: "アーカイブ", description: "一覧から非表示にする", disabled: true },
        { label: "削除", destructive: true, shortcut: "Del" },
      ]} />
    </div>
  ),
}
