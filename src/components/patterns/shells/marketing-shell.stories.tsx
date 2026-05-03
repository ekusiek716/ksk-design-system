import type { Meta, StoryObj } from "@storybook/react"
import { MarketingShell } from "./marketing-shell"

const meta: Meta<typeof MarketingShell> = {
  title: "Shells/MarketingShell",
  component: MarketingShell,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
}
export default meta
type Story = StoryObj<typeof MarketingShell>

export const Default: Story = {
  args: {
    header: (
      <>
        <span className="typo-heading-md text-[var(--Text-High-Emphasis)]">ブランド名</span>
        <nav className="flex gap-6">
          {["製品", "料金", "会社概要", "お問い合わせ"].map((item) => (
            <a key={item} className="typo-body-sm text-[var(--Text-Medium-Emphasis)] hover:text-[var(--Text-High-Emphasis)]">{item}</a>
          ))}
        </nav>
      </>
    ),
    children: (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center px-6">
        <h1 className="typo-heading-3xl text-[var(--Text-High-Emphasis)]">ヒーローセクション</h1>
        <p className="typo-body-lg text-[var(--Text-Medium-Emphasis)] max-w-lg">マーケティングページのメインコンテンツエリアです。</p>
      </div>
    ),
    footer: (
      <p className="typo-body-sm text-[var(--Text-Low-Emphasis)]">© 2025 ブランド名</p>
    ),
  },
}
