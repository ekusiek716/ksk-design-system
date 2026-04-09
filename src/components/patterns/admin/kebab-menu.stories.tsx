import type { Meta, StoryObj } from "@storybook/react"
import { KebabMenu } from "./kebab-menu"

const meta: Meta<typeof KebabMenu> = { title: "Admin/KebabMenu", component: KebabMenu }
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
