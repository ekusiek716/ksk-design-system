/**
 * @file Tag のストーリー
 * @description 表示専用ラベルコンポーネント。6つのバリアント（default / brand / caution / success / warning / info）を網羅
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Tag } from "./tag"

const meta: Meta<typeof Tag> = {
  title: "Patterns/Tag",
  component: Tag,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "brand", "caution", "success", "warning", "info"],
    },
  },
}
export default meta

type Story = StoryObj<typeof Tag>

export const Default: Story = {
  args: { children: "Default", variant: "default" },
}

export const Brand: Story = {
  args: { children: "Brand", variant: "brand" },
}

export const Caution: Story = {
  args: { children: "Caution", variant: "caution" },
}

export const Success: Story = {
  args: { children: "Success", variant: "success" },
}

export const Warning: Story = {
  args: { children: "Warning", variant: "warning" },
}

export const Info: Story = {
  args: { children: "Info", variant: "info" },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tag variant="default">Default</Tag>
      <Tag variant="brand">Brand</Tag>
      <Tag variant="caution">Caution</Tag>
      <Tag variant="success">Success</Tag>
      <Tag variant="warning">Warning</Tag>
      <Tag variant="info">Info</Tag>
    </div>
  ),
}
