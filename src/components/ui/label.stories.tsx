/**
 * @file Label のストーリー
 * @description フォームラベルコンポーネント。デフォルトと必須マーカー付きを網羅
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Label } from "./label"

const meta: Meta<typeof Label> = {
  title: "UI/Label",
  component: Label,
}
export default meta

type Story = StoryObj<typeof Label>

export const Default: Story = {
  args: { children: "メールアドレス" },
}

export const WithRequiredMarker: Story = {
  render: () => (
    <Label>
      メールアドレス
      <span className="text-[var(--Text-Caution)] ml-1" aria-hidden="true">*</span>
    </Label>
  ),
}

export const DisabledState: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="disabled-input" className="opacity-50 cursor-not-allowed">
        無効なフィールド
      </Label>
    </div>
  ),
}
