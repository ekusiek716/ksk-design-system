/**
 * @file ScrollArea のストーリー
 * @description スクロールエリアコンポーネント。長いコンテンツをスクロール可能な領域に表示
 */
import type { Meta, StoryObj } from "@storybook/react"
import { ScrollArea } from "./scroll-area"
import { Separator } from "./separator"

const meta: Meta<typeof ScrollArea> = {
  title: "Components/ScrollArea",
  component: ScrollArea,
}
export default meta

type Story = StoryObj<typeof ScrollArea>

const items = Array.from({ length: 30 }, (_, i) => `アイテム ${i + 1}`)

export const VerticalScroll: Story = {
  render: () => (
    <ScrollArea className="h-[300px] w-[300px] rounded-lg border border-[var(--Border-Low-Emphasis)] p-4">
      <div className="flex flex-col">
        <h4 className="typo-label-md text-[var(--Text-High-Emphasis)] mb-4">アイテム一覧</h4>
        {items.map((item, i) => (
          <div key={i}>
            <div className="py-2 typo-body-sm text-[var(--Text-High-Emphasis)]">{item}</div>
            {i < items.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
}

export const LongText: Story = {
  render: () => (
    <ScrollArea className="h-[200px] w-full rounded-lg border border-[var(--Border-Low-Emphasis)] p-4">
      <div className="flex flex-col gap-4">
        <h4 className="typo-label-md text-[var(--Text-High-Emphasis)]">利用規約</h4>
        {Array.from({ length: 10 }, (_, i) => (
          <p key={i} className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">
            これはダミーテキストです。スクロールエリアの動作を確認するために、長い文章を表示しています。このコンポーネントはRadix UIのScrollAreaプリミティブをベースにしており、カスタムスクロールバーを提供します。
          </p>
        ))}
      </div>
    </ScrollArea>
  ),
}
