/**
 * @file Label のストーリー
 * @description フォームラベルコンポーネント。デフォルトと必須マーカー付きを網羅
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Label } from "./label"
import { Input } from "./input"

const meta: Meta<typeof Label> = {
  title: "Components/Label",
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
  // 無効状態の見た目デモ。disabled な Input と htmlFor で関連付けており、
  // ラベルは inactive UI component の一部＝WCAG 1.4.3 のコントラスト要件対象外。
  // ただし axe は「disabled コントロールのラベル」を exemption 扱いしないため除外する。
  parameters: {
    a11y: { config: { rules: [{ id: "color-contrast", enabled: false }] } },
  },
  render: () => (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="disabled-input" className="opacity-50 cursor-not-allowed">
        無効なフィールド
      </Label>
      <Input id="disabled-input" disabled placeholder="入力できません" />
    </div>
  ),
}
