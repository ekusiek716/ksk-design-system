/**
 * @file ListItem のストーリー
 * @description 汎用リストアイテムコンポーネント。スロット配置とインタラクティブ状態を網羅
 */
import type { Meta, StoryObj } from "@storybook/react"
import { ListItem } from "./list-item"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Progress } from "../ui/progress"
import { Setting2, Profile2User, LogoutCurve, Trash } from "iconsax-reactjs"
import { Button } from "../ui/button"

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

/**
 * `align="center"`: アイコン + ラベルを行の中央に寄せた full-width の CTA 行。
 * 本文列を `flex-1` で伸ばさないため、アイコンとラベルがひとかたまりで中央に来る。
 */
export const AlignCenter: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-80">
      <ListItem
        title="設定"
        align="center"
        onClick={() => alert("設定")}
        className="rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]"
        leftSlot={<Setting2 size={18} className="text-[var(--Text-Medium-Emphasis)]" />}
      />
      <ListItem
        title="ゲストを編集"
        align="center"
        onClick={() => alert("ゲスト")}
        className="rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]"
        leftSlot={<Profile2User size={18} className="text-[var(--Text-Medium-Emphasis)]" />}
      />
      <ListItem
        title="ログアウト"
        align="center"
        variant="destructive"
        onClick={() => alert("ログアウト")}
        className="rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]"
        leftSlot={<LogoutCurve size={18} className="text-[var(--Caution-Base)]" />}
      />
    </div>
  ),
}

/**
 * `density="compact"`: カード内に高密度で行を積むとき用。
 * 区切り線は density の責務ではないので `className="border-b-0"` で消す。
 */
export const DensityCompact: Story = {
  render: () => (
    <div className="w-80 rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-4">
      <p className="typo-label-md text-[var(--Text-High-Emphasis)] mb-2">要対応</p>
      <div className="flex flex-col gap-0.5">
        <ListItem
          title="山田家"
          density="compact"
          className="border-b-0"
          onClick={() => alert("山田家")}
          rightSlot={<Badge variant="warning">期限間近</Badge>}
        />
        <ListItem
          title="佐藤家"
          density="compact"
          className="border-b-0"
          onClick={() => alert("佐藤家")}
          rightSlot={<Badge variant="info">未着手</Badge>}
        />
        <ListItem
          title="田中家"
          density="compact"
          className="border-b-0"
          onClick={() => alert("田中家")}
          rightSlot={<Badge variant="success">順調</Badge>}
        />
      </div>
    </div>
  ),
}

/**
 * `footerSlot`: 行（leftSlot / 本文 / rightSlot）の**外側**・全幅に置くスロット。
 * `bottomSlot`（title 列の内側 = leftSlot の幅ぶんインデントされる）との違いを並べて確認できる。
 */
export const WithFooterSlot: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-80">
      <ListItem
        title="山田家"
        description="2026-10-12 · あと 60 日"
        className="rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]"
        leftSlot={
          <Avatar className="size-9">
            <AvatarFallback>山</AvatarFallback>
          </Avatar>
        }
        rightSlot={<Badge variant="success">順調</Badge>}
        footerSlot={
          <div className="flex items-center gap-2">
            <Progress value={62} className="flex-1" />
            <span className="typo-body-xs tabular-nums text-[var(--Text-Medium-Emphasis)] w-9 text-right">
              62%
            </span>
          </div>
        }
      />
      <ListItem
        title="bottomSlot だと leftSlot 幅ぶんインデントされる"
        className="rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]"
        leftSlot={
          <Avatar className="size-9">
            <AvatarFallback>比</AvatarFallback>
          </Avatar>
        }
        bottomSlot={<Progress value={62} />}
      />
    </div>
  ),
}

/**
 * `secondaryAction` — 押せる行の中に「行とは別の操作」を置く。
 * 行は div + 行全体を覆う不可視 button（stretched link）になるため、
 * button の入れ子（不正な HTML）にならない。
 */
export const WithSecondaryAction: Story = {
  render: () => (
    <div className="flex flex-col rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] overflow-hidden">
      <ListItem
        title="佐藤花子"
        description="タップで詳細、右のボタンで削除"
        onClick={() => {}}
        leftSlot={
          <Avatar className="size-9">
            <AvatarFallback>佐</AvatarFallback>
          </Avatar>
        }
        secondaryAction={
          <Button variant="ghost" size="icon-sm" aria-label="佐藤花子 を削除">
            <Trash size={18} />
          </Button>
        }
      />
      <ListItem
        title="リンク行 + 副アクション"
        description="href の行でも入れ子にならない"
        href="#"
        secondaryAction={
          <Button variant="ghost" size="icon-sm" aria-label="リンク行 を削除">
            <Trash size={18} />
          </Button>
        }
      />
    </div>
  ),
}
