import type { Meta, StoryObj } from "@storybook/react"
import { CheckboxCardGroup, CheckboxCardItem } from "./checkbox-card"
import { Badge } from "./badge"

const meta = {
  title: "Components/CheckboxCard",
  component: CheckboxCardItem,
  tags: ["autodocs"],
} satisfies Meta<typeof CheckboxCardItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <CheckboxCardGroup className="max-w-sm">
      <CheckboxCardItem>通常配送（3〜5日）</CheckboxCardItem>
      <CheckboxCardItem defaultChecked>速達配送（翌日）</CheckboxCardItem>
    </CheckboxCardGroup>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <CheckboxCardGroup className="max-w-sm">
      <CheckboxCardItem description="月額 ¥500">ライトプラン</CheckboxCardItem>
      <CheckboxCardItem description="月額 ¥1,000" badge={<Badge>人気</Badge>} defaultChecked>
        スタンダードプラン
      </CheckboxCardItem>
      <CheckboxCardItem description="月額 ¥2,000">プレミアムプラン</CheckboxCardItem>
    </CheckboxCardGroup>
  ),
}

export const WithExpandedContent: Story = {
  render: () => (
    <CheckboxCardGroup className="max-w-sm">
      <CheckboxCardItem
        description="クレジットカード、コンビニ払い"
        expandedContent={
          <div className="flex flex-col gap-1">
            <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">
              VISA / Mastercard / JCB対応
            </p>
          </div>
        }
      >
        オンライン決済
      </CheckboxCardItem>
      <CheckboxCardItem description="受け取り時にお支払い">代金引換</CheckboxCardItem>
    </CheckboxCardGroup>
  ),
}

export const Disabled: Story = {
  render: () => (
    <CheckboxCardGroup className="max-w-sm">
      <CheckboxCardItem>利用可能なオプション</CheckboxCardItem>
      <CheckboxCardItem disabled description="現在ご利用いただけません">
        準備中のオプション
      </CheckboxCardItem>
    </CheckboxCardGroup>
  ),
}
