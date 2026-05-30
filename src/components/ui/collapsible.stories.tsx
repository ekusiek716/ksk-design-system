import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./collapsible"
import { Button } from "./button"

const meta = {
  title: "Components/Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
} satisfies Meta<typeof Collapsible>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <Collapsible open={open} onOpenChange={setOpen} className="max-w-sm">
        <div className="flex items-center justify-between">
          <span className="typo-label-md">詳細情報</span>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {open ? "閉じる" : "開く"}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="mt-2">
          <div className="rounded-lg border border-[var(--Border-Low-Emphasis)] p-4">
            <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">
              折りたたまれたコンテンツです。詳細情報やオプション設定などに使用します。
              アコーディオンと異なり単独の折りたたみに対応しています。
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    )
  },
}

export const FAQ: Story = {
  render: () => {
    const items = [
      { q: "返品はできますか？", a: "商品到着後7日以内であれば返品を承ります。" },
      { q: "送料はかかりますか？", a: "3,000円以上のご注文で送料無料となります。" },
      { q: "のし対応はできますか？", a: "はい、熨斗のご要望はご注文時にお知らせください。" },
    ]
    return (
      <div className="flex flex-col gap-2 max-w-sm">
        {items.map((item) => (
          <Collapsible key={item.q}>
            <div className="rounded-lg border border-[var(--Border-Low-Emphasis)]">
              {/* トリガーを行全体に広げ、見出し全体をクリック可能にする */}
              <CollapsibleTrigger className="group flex w-full items-center justify-between gap-2 px-4 py-3 text-left cursor-pointer rounded-lg transition-colors hover:bg-[var(--Surface-Secondary)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50">
                <span className="typo-body-md text-[var(--Text-High-Emphasis)]">{item.q}</span>
                <span className="text-lg leading-none text-[var(--Text-Accent-Primary)] transition-transform group-data-[state=open]:rotate-45">
                  +
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <p className="px-4 pb-3 typo-body-sm text-[var(--Text-Medium-Emphasis)]">{item.a}</p>
              </CollapsibleContent>
            </div>
          </Collapsible>
        ))}
      </div>
    )
  },
}
