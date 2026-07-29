/**
 * @file Textarea のストーリー
 * @description 複数行テキスト入力コンポーネント。デフォルト、プレースホルダー、無効、エラー状態を網羅
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Textarea } from "./textarea"

const meta: Meta<typeof Textarea> = {
  title: "Components/Textarea",
  component: Textarea,
}
export default meta

type Story = StoryObj<typeof Textarea>

// placeholder/label 無しの素の Textarea には axe: label 対策で aria-label を明示する。
export const Default: Story = {
  args: { defaultValue: "テキストエリアの内容です。\n複数行のテキストを入力できます。", "aria-label": "サンプル" },
}

export const WithPlaceholder: Story = {
  args: { placeholder: "お問い合わせ内容を入力してください" },
}

export const Disabled: Story = {
  args: { placeholder: "入力できません", disabled: true },
}

export const Error: Story = {
  args: {
    defaultValue: "エラーのある入力",
    "aria-invalid": true,
    "aria-label": "サンプル",
  },
}

export const AutoGrow: Story = {
  args: {
    autoGrow: true,
    placeholder: "入力すると自動で伸びます…",
    rows: 1,
  },
}
