/**
 * @file RadioGroup のストーリー
 * @description ラジオボタングループコンポーネント。3つの選択肢を表示
 */
import type { Meta, StoryObj } from "@storybook/react"
import { RadioGroup, RadioGroupItem } from "./radio-group"
import { Label } from "./label"

const meta: Meta<typeof RadioGroup> = {
  title: "Components/RadioGroup",
  component: RadioGroup,
}
export default meta

type Story = StoryObj<typeof RadioGroup>

export const ThreeOptions: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-1" id="r1" />
        <Label htmlFor="r1">メール通知</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-2" id="r2" />
        <Label htmlFor="r2">SMS通知</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-3" id="r3" />
        <Label htmlFor="r3">通知なし</Label>
      </div>
    </RadioGroup>
  ),
}

export const WithDisabled: Story = {
  render: () => (
    <RadioGroup defaultValue="small">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="small" id="s1" />
        <Label htmlFor="s1">Small</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="medium" id="s2" />
        <Label htmlFor="s2">Medium</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="large" id="s3" disabled />
        <Label htmlFor="s3">Large（選択不可）</Label>
      </div>
    </RadioGroup>
  ),
}

/**
 * 未チェックの項目にホバーすると枠線がアクセント色に変わる（クリック可能の
 * アフォーダンス）。チェック済み・disabled の項目はホバーしても変化しない。
 * 各項目にカーソルを合わせて確認してください。
 */
export const HoverState: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-1" id="h1" />
        <Label htmlFor="h1">選択中（ホバーしても変化なし）</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-2" id="h2" />
        <Label htmlFor="h2">未選択（ホバーで枠線がアクセント色に）</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-3" id="h3" disabled />
        <Label htmlFor="h3">無効（ホバーしても変化なし）</Label>
      </div>
    </RadioGroup>
  ),
}
