/**
 * @file Badge のストーリー
 * @description 9つのバリアント（default / secondary / outline / destructive / success / warning / info / subtle / ghost）を持つバッジコンポーネント
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Badge } from "./badge"

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "outline", "destructive", "success", "warning", "info", "subtle", "ghost"],
    },
  },
}
export default meta

type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: { children: "Default" },
}

export const Secondary: Story = {
  args: { children: "Secondary", variant: "secondary" },
}

export const Outline: Story = {
  args: { children: "Outline", variant: "outline" },
}

export const Destructive: Story = {
  args: { children: "Destructive", variant: "destructive" },
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

export const Subtle: Story = {
  args: { children: "Subtle", variant: "subtle" },
}

export const Ghost: Story = {
  args: { children: "Ghost", variant: "ghost" },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="subtle">Subtle</Badge>
      <Badge variant="ghost">Ghost</Badge>
    </div>
  ),
}
