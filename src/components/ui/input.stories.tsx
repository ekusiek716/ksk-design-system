/**
 * @file Input のストーリー
 * @description テキスト入力コンポーネント。プレースホルダー、無効状態、エラー状態、ラベル付きを網羅
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Input } from "./input"
import { Label } from "./label"

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
}
export default meta

type Story = StoryObj<typeof Input>

// placeholder/label 無しの素の Input には axe: label 対策で aria-label を明示する
// （実利用では WithLabel のように <Label> 併記が前提）。
export const Default: Story = {
  args: { defaultValue: "テキスト入力", "aria-label": "サンプル" },
}

export const WithPlaceholder: Story = {
  args: { placeholder: "メールアドレスを入力" },
}

export const Disabled: Story = {
  args: { placeholder: "入力できません", disabled: true },
}

export const Error: Story = {
  args: {
    defaultValue: "invalid@",
    "aria-invalid": true,
    "aria-label": "サンプル",
  },
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="email">メールアドレス</Label>
      <Input id="email" type="email" placeholder="example@mail.com" />
    </div>
  ),
}

export const FileInput: Story = {
  args: { type: "file", "aria-label": "ファイルを選択" },
}
