/**
 * @file Avatar のストーリー
 * @description ユーザー画像コンポーネント。画像表示、フォールバック文字、異なるサイズを網羅
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Avatar, AvatarImage, AvatarFallback } from "./avatar"

const meta: Meta<typeof Avatar> = {
  title: "UI/Avatar",
  component: Avatar,
}
export default meta

type Story = StoryObj<typeof Avatar>

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://api.dicebear.com/9.x/shapes/svg?seed=ksk" alt="ユーザー画像" />
      <AvatarFallback>KS</AvatarFallback>
    </Avatar>
  ),
}

export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="/broken-image.jpg" alt="ユーザー画像" />
      <AvatarFallback>KS</AvatarFallback>
    </Avatar>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar className="size-8">
        <AvatarFallback>S</AvatarFallback>
      </Avatar>
      <Avatar className="size-10">
        <AvatarFallback>M</AvatarFallback>
      </Avatar>
      <Avatar className="size-12">
        <AvatarFallback>L</AvatarFallback>
      </Avatar>
      <Avatar className="size-16">
        <AvatarFallback>XL</AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const Group: Story = {
  render: () => (
    <div className="flex -space-x-2">
      <Avatar className="border-2 border-[var(--Surface-Primary)]">
        <AvatarFallback>A</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-[var(--Surface-Primary)]">
        <AvatarFallback>B</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-[var(--Surface-Primary)]">
        <AvatarFallback>C</AvatarFallback>
      </Avatar>
    </div>
  ),
}
