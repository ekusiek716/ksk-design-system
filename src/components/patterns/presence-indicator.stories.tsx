/**
 * @file PresenceIndicator のストーリー
 * @description 「誰かが今いる/見ている」ことを示す汎用インジケーター（Avatar + ステータスドット + Badge）
 */
import type { Meta, StoryObj } from "@storybook/react"
import { PresenceIndicator } from "./presence-indicator"

const meta: Meta<typeof PresenceIndicator> = {
  title: "Components/PresenceIndicator",
  component: PresenceIndicator,
  tags: ["autodocs"],
  argTypes: {
    online: { control: "boolean" },
  },
}
export default meta

type Story = StoryObj<typeof PresenceIndicator>

export const Default: Story = {
  args: {
    name: "田中",
    statusText: "閲覧中",
  },
}

export const WithBadge: Story = {
  args: {
    name: "佐藤",
    statusText: "編集中",
    badgeLabel: "オンライン",
  },
}

export const Offline: Story = {
  args: {
    name: "鈴木",
    statusText: "最終閲覧: 3分前",
    online: false,
  },
}

export const NameOnly: Story = {
  args: {
    name: "山田",
  },
}

/**
 * DS 側はデフォルトで常時表示（レスポンシブ非表示は呼び出し側の責務）。
 * 狭幅で隠したい場合は className でユーティリティを渡す。
 */
export const HiddenBelowBreakpoint: Story = {
  name: "狭幅で非表示にする例（className）",
  args: {
    name: "高橋",
    statusText: "閲覧中",
    badgeLabel: "オンライン",
    className: "hidden min-[420px]:flex",
  },
}
