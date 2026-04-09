/**
 * @file Select のストーリー
 * @description ドロップダウン選択コンポーネント。アイテム、グループ、プレースホルダーを網羅
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./select"

const meta: Meta<typeof Select> = {
  title: "UI/Select",
  component: Select,
}
export default meta

type Story = StoryObj<typeof Select>

export const WithPlaceholder: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[240px]">
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
      <SelectTrigger className="w-[240px]">
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
      <SelectTrigger className="w-[240px]">
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
      <SelectTrigger className="w-[240px]">
        <SelectValue placeholder="選択できません" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">アイテム</SelectItem>
      </SelectContent>
    </Select>
  ),
}
