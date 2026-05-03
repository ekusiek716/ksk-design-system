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
