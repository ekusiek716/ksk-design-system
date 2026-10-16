/**
 * @file EmojiIcon のストーリー
 * @description 絵文字をアイコンと同じ寸法の箱に収めて描く装飾（issue #676）
 */
import type { Meta, StoryObj } from "@storybook/react"
import { EmojiIcon } from "./emoji-icon"
import { EmptyState } from "../patterns/empty-state"
import { Alert } from "./alert"
import { ListItem } from "../patterns/list-item"

const meta: Meta<typeof EmojiIcon> = {
  title: "Components/EmojiIcon",
  component: EmojiIcon,
  tags: ["autodocs"],
  args: { emoji: "🎉", size: "md" },
}
export default meta
type Story = StoryObj<typeof EmojiIcon>

export const Default: Story = {}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <EmojiIcon emoji="💐" size="sm" />
      <EmojiIcon emoji="💐" size="md" />
      <EmojiIcon emoji="💐" size="lg" />
      <EmojiIcon emoji="💐" size="xl" />
    </div>
  ),
}

/** アイコンを受けるスロットに渡す。text-* の生サイズで拡大しない。 */
export const InSlots: Story = {
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-4">
      <EmptyState size="compact" icon={<EmojiIcon emoji="🎉" size="xl" />} title="すべて完了しました" />
      <Alert variant="inline-info" icon={<EmojiIcon emoji="💡" size="sm" />} description="長押しで並び替えできます" />
      <ListItem title="前撮りの予約" leftSlot={<EmojiIcon emoji="📷" size="md" />} />
    </div>
  ),
}
