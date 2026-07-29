/**
 * @file Select のストーリー
 * @description ドロップダウン選択コンポーネント。アイテム、グループ、プレースホルダーを網羅
 */
import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./select"

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
}
export default meta

type Story = StoryObj<typeof Select>

export const WithPlaceholder: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[240px]" aria-label="カテゴリを選択">
        <SelectValue placeholder="カテゴリを選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="design">デザイン</SelectItem>
        <SelectItem value="development">開発</SelectItem>
        <SelectItem value="marketing">マーケティング</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[240px]" aria-label="フルーツを選択">
        <SelectValue placeholder="フルーツを選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>柑橘類</SelectLabel>
          <SelectItem value="orange">オレンジ</SelectItem>
          <SelectItem value="lemon">レモン</SelectItem>
          <SelectItem value="grapefruit">グレープフルーツ</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>ベリー類</SelectLabel>
          <SelectItem value="strawberry">いちご</SelectItem>
          <SelectItem value="blueberry">ブルーベリー</SelectItem>
          <SelectItem value="raspberry">ラズベリー</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

export const WithDisabledItem: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[240px]" aria-label="プランを選択">
        <SelectValue placeholder="プランを選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="free">フリープラン</SelectItem>
        <SelectItem value="pro">プロプラン</SelectItem>
        <SelectItem value="enterprise" disabled>エンタープライズ（準備中）</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const DisabledSelect: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-[240px]" aria-label="選択できません">
        <SelectValue placeholder="選択できません" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">アイテム</SelectItem>
      </SelectContent>
    </Select>
  ),
}

// ─────────────────────────────────────────────────────────────
// interaction 回帰テスト（issue #256 / `npm run test:interaction`）
// ─────────────────────────────────────────────────────────────

/** 開いて選択でき、選んだ値がトリガーに反映される。 */
export const OpensAndSelectsOption: Story = {
  tags: ["interaction", "!autodocs"],
  parameters: {
    // play 関数実行後、axe が Radix のクローズアニメーション途中の過渡的な
    // DOM（閉じかけの aria-hidden ラッパーに残るフォーカス可能要素の残骸、
    // まだアンマウントされていない listbox 等）を検査してしまい誤検知になる。
    // 開閉の正しさ自体は上の play 関数のアサーションで担保済みのため、
    // このストーリーでは a11y テストを無効化する。
    a11y: { test: "off" },
  },
  render: () => (
    <Select>
      <SelectTrigger className="w-[240px]" data-testid="trigger" aria-label="カテゴリを選択">
        <SelectValue placeholder="カテゴリを選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="design">デザイン</SelectItem>
        <SelectItem value="development">開発</SelectItem>
        <SelectItem value="marketing">マーケティング</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    const trigger = canvas.getByTestId("trigger")

    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    await userEvent.click(trigger)
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "true"))

    // ポップオーバーは portal に出るので document 全体から探す
    const option = await body.findByRole("option", { name: "開発" })
    await userEvent.click(option)

    await waitFor(() => expect(trigger).toHaveTextContent("開発"))
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
  },
}

/** キーボードだけで開いて選択できる。 */
export const SelectsWithKeyboard: Story = {
  tags: ["interaction", "!autodocs"],
  parameters: {
    // OpensAndSelectsOption と同じ理由（Radix クローズアニメーション途中の
    // 過渡的 DOM を axe が誤検知するため）で a11y テストを無効化する。
    a11y: { test: "off" },
  },
  render: () => (
    <Select>
      <SelectTrigger className="w-[240px]" data-testid="trigger" aria-label="カテゴリを選択">
        <SelectValue placeholder="カテゴリを選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="design">デザイン</SelectItem>
        <SelectItem value="development">開発</SelectItem>
        <SelectItem value="marketing">マーケティング</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByTestId("trigger")

    trigger.focus()
    await expect(trigger).toHaveFocus()

    await userEvent.keyboard("{Enter}")
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "true"))

    await userEvent.keyboard("{ArrowDown}")
    await userEvent.keyboard("{Enter}")

    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "false"))
    await expect(trigger.textContent).not.toBe("カテゴリを選択")
  },
}
