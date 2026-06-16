import type { Meta, StoryObj } from "@storybook/react"
import { CheckboxField } from "./checkbox-field"

const meta: Meta<typeof CheckboxField> = {
  title: "Components/CheckboxField",
  component: CheckboxField,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof CheckboxField>

export const Default: Story = {
  render: () => (
    <CheckboxField label="利用規約・キャンセルポリシーに同意します" className="max-w-sm" />
  ),
}

export const WithDescription: Story = {
  render: () => (
    <CheckboxField
      label="メールマガジンを受け取る"
      description="新着情報やキャンペーンのお知らせが届きます。"
      className="max-w-sm"
    />
  ),
}

export const WithError: Story = {
  render: () => (
    <CheckboxField
      label="利用規約・キャンセルポリシーに同意します"
      error="利用規約への同意が必要です"
      className="max-w-sm"
    />
  ),
}

export const LongLabelWrap: Story = {
  render: () => (
    <CheckboxField
      label="本サービスの利用にあたり、利用規約・プライバシーポリシー・キャンセルポリシーのすべてに同意します"
      className="max-w-xs"
    />
  ),
}

export const Disabled: Story = {
  render: () => (
    <CheckboxField label="この操作は現在利用できません" disabled className="max-w-sm" />
  ),
}
