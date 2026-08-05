import type { Meta, StoryObj } from "@storybook/react"
import { Add, Heart, NoteText } from "iconsax-reactjs"
import { ActionTile, QuickActionGrid } from "./quick-action-grid"

const meta: Meta<typeof QuickActionGrid> = {
  title: "Components/QuickActionGrid",
  component: QuickActionGrid,
}
export default meta

type Story = StoryObj<typeof QuickActionGrid>

export const EmojiOnly: Story = {
  render: () => (
    <QuickActionGrid className="max-w-md" columns={4} gap="sm">
      <ActionTile emoji="😀" label="元気" selected />
      <ActionTile emoji="😌" label="普通" />
      <ActionTile emoji="😵" label="疲れ" />
      <ActionTile emoji="😭" label="つらい" />
    </QuickActionGrid>
  ),
}

export const IconAndLabel: Story = {
  render: () => (
    <QuickActionGrid className="max-w-md" columns={3}>
      <ActionTile icon={<Add size={20} />} label="記録" description="今日のログ" variant="info" />
      <ActionTile icon={<Heart size={20} />} label="体調" description="気分を残す" variant="success" />
      <ActionTile icon={<NoteText size={20} />} label="メモ" description="あとで確認" />
    </QuickActionGrid>
  ),
}

export const WithMeta: Story = {
  render: () => (
    <QuickActionGrid className="max-w-md" columns={2}>
      <ActionTile label="キック" description="胎動カウント" meta="12" selected />
      <ActionTile label="水分" description="今日の目標" meta="80%" />
      <ActionTile label="薬" description="服薬チェック" meta="未" variant="caution" />
      <ActionTile label="同期" description="クラウド保存" loading />
    </QuickActionGrid>
  ),
}

/** issue #293: 狭いタイルで長い meta と 2 行 description を併用しても description が潰れない */
export const NarrowWithLongMeta: Story = {
  render: () => (
    <QuickActionGrid className="max-w-sm" columns={2}>
      <ActionTile
        label="丸テーブル"
        description="親族・友人をバランスよく配置できる定番レイアウト"
        meta="登録ゲスト数におすすめ"
        selected
      />
      <ActionTile
        label="長テーブル"
        description="カジュアルな少人数パーティー向け"
        meta="〜30名"
      />
    </QuickActionGrid>
  ),
}
