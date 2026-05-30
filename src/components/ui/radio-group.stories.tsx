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
      <RadioGroupItem value="option-1">メール通知</RadioGroupItem>
      <RadioGroupItem value="option-2">SMS通知</RadioGroupItem>
      <RadioGroupItem value="option-3">通知なし</RadioGroupItem>
    </RadioGroup>
  ),
}

export const WithDisabled: Story = {
  render: () => (
    <RadioGroup defaultValue="small">
      <RadioGroupItem value="small">Small</RadioGroupItem>
      <RadioGroupItem value="medium">Medium</RadioGroupItem>
      <RadioGroupItem value="large" disabled>
        Large（選択不可）
      </RadioGroupItem>
    </RadioGroup>
  ),
}

/**
 * `description` を渡すと、ラベルの下に補足テキストを表示する。
 */
export const WithDescription: Story = {
  render: () => (
    <RadioGroup defaultValue="standard">
      <RadioGroupItem value="standard" description="3〜5 営業日でお届け">
        通常配送
      </RadioGroupItem>
      <RadioGroupItem value="express" description="翌営業日にお届け（+500円）">
        速達配送
      </RadioGroupItem>
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
