/**
 * @file Chip のストーリー
 * @description フィルター / キーワード用チップコンポーネント。全バリアント、サイズ、選択状態、削除可能を網羅
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Chip } from "./chip"

const meta: Meta<typeof Chip> = {
  title: "Components/Chip",
  component: Chip,
  argTypes: {
    variant: {
      control: "select",
      options: ["filled", "accent", "outline"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    shape: {
      control: "select",
      options: ["pill", "square"],
    },
    selected: { control: "boolean" },
    removable: { control: "boolean" },
  },
}
export default meta

type Story = StoryObj<typeof Chip>

export const Filled: Story = {
  args: { children: "Filled", variant: "filled" },
}

export const Accent: Story = {
  args: { children: "Accent", variant: "accent" },
}

export const Outline: Story = {
  args: { children: "Outline", variant: "outline" },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip variant="filled">Filled</Chip>
      <Chip variant="accent">Accent</Chip>
      <Chip variant="outline">Outline</Chip>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Chip size="sm">Small</Chip>
      <Chip size="md">Medium</Chip>
      <Chip size="lg">Large</Chip>
    </div>
  ),
}

export const Selected: Story = {
  render: () => (
    <div className="flex gap-2">
      <Chip selected>選択済み</Chip>
      <Chip>未選択</Chip>
      <Chip>未選択</Chip>
    </div>
  ),
}

export const Removable: Story = {
  render: () => (
    <div className="flex gap-2">
      <Chip removable onRemove={() => alert("削除: React")}>React</Chip>
      <Chip removable onRemove={() => alert("削除: TypeScript")}>TypeScript</Chip>
      <Chip removable onRemove={() => alert("削除: Tailwind")}>Tailwind</Chip>
    </div>
  ),
}

export const SquareShape: Story = {
  render: () => (
    <div className="flex gap-2">
      <Chip shape="square" variant="filled">Filled</Chip>
      <Chip shape="square" variant="accent">Accent</Chip>
      <Chip shape="square" variant="outline">Outline</Chip>
    </div>
  ),
}
