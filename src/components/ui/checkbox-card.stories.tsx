import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"
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

/**
 * 読み上げ名はラベル（+ バッジ）だけにし、説明・展開内容は説明（description）に分ける。
 * カード全体のテキストが名前になると「ライトプラン 月額 ¥500」のように長くなり、
 * 展開内容は選択の前後で名前が変わってしまう。
 */
export const AccessibleNameIsLabelOnly: Story = {
  tags: ["interaction", "!autodocs"],
  render: () => (
    <CheckboxCardGroup className="max-w-sm">
      <CheckboxCardItem
        description="クレジットカード、コンビニ払い"
        expandedContent={<p>VISA / Mastercard / JCB対応</p>}
      >
        オンライン決済
      </CheckboxCardItem>
      <CheckboxCardItem description="月額 ¥1,000" badge={<span>人気</span>}>
        スタンダードプラン
      </CheckboxCardItem>
    </CheckboxCardGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const online = canvas.getByRole("checkbox", { name: "オンライン決済" })
    await expect(online).toHaveAccessibleDescription("クレジットカード、コンビニ払い")
    await userEvent.click(online)
    // 選択して展開内容が見えても名前は変わらず、展開内容は説明に加わる
    await expect(canvas.getByRole("checkbox", { name: "オンライン決済" })).toBeChecked()
    await expect(online).toHaveAccessibleDescription(
      "クレジットカード、コンビニ払い VISA / Mastercard / JCB対応"
    )

    // バッジは名前に含まれ、説明は含まれない
    const standard = canvas.getByRole("checkbox", { name: "スタンダードプラン 人気" })
    await expect(standard).toHaveAccessibleDescription("月額 ¥1,000")
  },
}
