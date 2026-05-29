import type { Meta, StoryObj } from "@storybook/react"
import { StickyActionBar } from "./sticky-action-bar"
import { Button } from "@/components/ui/button"

const meta = {
  title: "Components/StickyActionBar",
  component: StickyActionBar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof StickyActionBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="relative min-h-[400px] bg-[var(--Surface-Secondary)]">
      <div className="p-4">
        <p className="typo-body-md text-[var(--Text-Medium-Emphasis)]">
          商品詳細ページのコンテンツが入ります。下部にCTAボタンが固定表示されます。
        </p>
      </div>
      <StickyActionBar>
        <Button className="w-full" size="xl">カートに追加</Button>
      </StickyActionBar>
    </div>
  ),
}

export const TwoButtons: Story = {
  render: () => (
    <div className="relative min-h-[400px] bg-[var(--Surface-Secondary)]">
      <div className="p-4">
        <p className="typo-body-md text-[var(--Text-Medium-Emphasis)]">
          2つのアクションボタンを並べる場合。
        </p>
      </div>
      <StickyActionBar>
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1">お気に入り</Button>
          <Button className="flex-1">カートに追加</Button>
        </div>
      </StickyActionBar>
    </div>
  ),
}

export const NoBorder: Story = {
  render: () => (
    <div className="relative min-h-[400px]">
      <StickyActionBar bordered={false}>
        <Button className="w-full" size="xl">購入する</Button>
      </StickyActionBar>
    </div>
  ),
}
