/**
 * @file ListItem のストーリー
 * @description 汎用リストアイテムコンポーネント。スロット配置とインタラクティブ状態を網羅
 */
import type { Meta, StoryObj } from "@storybook/react"
import { ListItem } from "./list-item"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Badge } from "../ui/badge"

const meta: Meta<typeof ListItem> = {
  title: "Components/ListItem",
  component: ListItem,
}
export default meta

type Story = StoryObj<typeof ListItem>

export const WithSlots: Story = {
  render: () => (
    <div className="border border-[var(--Border-Low-Emphasis)] rounded-lg overflow-hidden">
      <ListItem
        title="山田太郎"
        description="フロントエンドエンジニア"
        leftSlot={
          <Avatar className="size-10">
            <AvatarFallback>YT</AvatarFallback>
          </Avatar>
        }
        rightSlot={<Badge variant="success">オンライン</Badge>}
      />
      <ListItem
        title="佐藤花子"
        description="デザイナー"
        leftSlot={
          <Avatar className="size-10">
            <AvatarFallback>SH</AvatarFallback>
          </Avatar>
        }
        rightSlot={<Badge variant="secondary">オフライン</Badge>}
      />
      <ListItem
        title="田中次郎"
        description="バックエンドエンジニア"
        leftSlot={
          <Avatar className="size-10">
            <AvatarFallback>TJ</AvatarFallback>
          </Avatar>
        }
        rightSlot={<Badge variant="warning">離席中</Badge>}
      />
    </div>
  ),
}

export const Interactive: Story = {
  render: () => (
    <div className="border border-[var(--Border-Low-Emphasis)] rounded-lg overflow-hidden">
      <ListItem
        title="プロジェクト設定を更新"
        description="2分前"
        onClick={() => alert("クリック")}
      />
      <ListItem
        title="新しいメンバーを招待"
        description="15分前"
        href="#invite"
      />
      <ListItem
        title="デプロイが完了しました"
        description="1時間前"
        onClick={() => alert("クリック")}
      />
    </div>
  ),
}

export const WithBottomSlot: Story = {
  args: {
    title: "デザインレビュー",
    description: "UIコンポーネントの見直し",
    bottomSlot: (
      <div className="flex gap-1.5">
        <Badge variant="subtle">デザイン</Badge>
        <Badge variant="outline">進行中</Badge>
      </div>
    ),
  },
}
