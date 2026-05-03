/**
 * @file Checkbox のストーリー
 * @description チェックボックスコンポーネント。デフォルト、チェック済み、無効状態、ラベル付きを網羅
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Checkbox } from "./checkbox"
import { Label } from "./label"

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
}
export default meta

type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  args: {},
}

export const Checked: Story = {
  args: { defaultChecked: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const DisabledChecked: Story = {
  args: { disabled: true, defaultChecked: true },
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">利用規約に同意する</Label>
    </div>
  ),
}

export const MultipleOptions: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id="opt1" defaultChecked />
        <Label htmlFor="opt1">メール通知を受け取る</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="opt2" />
        <Label htmlFor="opt2">SMS通知を受け取る</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="opt3" disabled />
        <Label htmlFor="opt3">プッシュ通知を受け取る（準備中）</Label>
      </div>
    </div>
  ),
}
