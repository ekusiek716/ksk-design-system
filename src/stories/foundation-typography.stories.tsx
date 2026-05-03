import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const meta: Meta = {
  title: "Foundation/Typography",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
}
export default meta
type Story = StoryObj

const TYPO_CLASSES = [
  { cls: "typo-display-xl",  label: "Display XL",  size: "48px", weight: "700" },
  { cls: "typo-display-lg",  label: "Display LG",  size: "36px", weight: "700" },
  { cls: "typo-heading-3xl", label: "Heading 3XL", size: "28px", weight: "700" },
  { cls: "typo-heading-2xl", label: "Heading 2XL", size: "24px", weight: "700" },
  { cls: "typo-heading-xl",  label: "Heading XL",  size: "21px", weight: "700" },
  { cls: "typo-heading-lg",  label: "Heading LG",  size: "18px", weight: "700" },
  { cls: "typo-heading-md",  label: "Heading MD",  size: "16px", weight: "700" },
  { cls: "typo-heading-sm",  label: "Heading SM",  size: "14px", weight: "700" },
  { cls: "typo-body-lg",     label: "Body LG",     size: "16px", weight: "400" },
  { cls: "typo-body-md",     label: "Body MD",     size: "14px", weight: "400" },
  { cls: "typo-body-sm",     label: "Body SM",     size: "12px", weight: "400" },
  { cls: "typo-body-xs",     label: "Body XS",     size: "10px", weight: "400" },
  { cls: "typo-label-lg",    label: "Label LG",    size: "16px", weight: "700" },
  { cls: "typo-label-md",    label: "Label MD",    size: "14px", weight: "700" },
  { cls: "typo-label-sm",    label: "Label SM",    size: "12px", weight: "500" },
  { cls: "typo-label-xs",    label: "Label XS",    size: "10px", weight: "500" },
  { cls: "typo-caption",     label: "Caption",     size: "11px", weight: "400" },
]

export const AllStyles: Story = {
  name: "全スタイル一覧",
  render: () => (
    <div className="space-y-1">
      <div className="grid grid-cols-[200px_1fr_60px_60px] gap-4 pb-2 border-b border-[var(--Border-Low-Emphasis)] mb-4">
        <span className="typo-label-xs text-[var(--Text-Low-Emphasis)]">クラス名</span>
        <span className="typo-label-xs text-[var(--Text-Low-Emphasis)]">サンプル</span>
        <span className="typo-label-xs text-[var(--Text-Low-Emphasis)]">Size</span>
        <span className="typo-label-xs text-[var(--Text-Low-Emphasis)]">Weight</span>
      </div>
      {TYPO_CLASSES.map(({ cls, label, size, weight }) => (
        <div key={cls} className="grid grid-cols-[200px_1fr_60px_60px] gap-4 items-baseline py-2 border-b border-[var(--Border-Low-Emphasis)]">
          <code className="typo-body-xs text-[var(--Text-Accent-Primary)] font-mono">.{cls}</code>
          <span className={`${cls} text-[var(--Text-High-Emphasis)]`}>{label}</span>
          <span className="typo-body-xs text-[var(--Text-Low-Emphasis)]">{size}</span>
          <span className="typo-body-xs text-[var(--Text-Low-Emphasis)]">{weight}</span>
        </div>
      ))}
    </div>
  ),
}

export const UsageRules: Story = {
  name: "使用ルール",
  render: () => (
    <div className="max-w-xl space-y-6">
      <div className="p-4 bg-[var(--Surface-Success)] rounded-2xl border border-[var(--Border-Success)]">
        <p className="typo-label-sm text-[var(--Text-Success)] mb-2">✅ 正しい使い方</p>
        <code className="typo-body-sm text-[var(--Text-High-Emphasis)] block">
          {"<p className=\"typo-body-md text-[var(--Text-High-Emphasis)]\">"}<br />
          {"  本文テキスト"}<br />
          {"</p>"}
        </code>
      </div>
      <div className="p-4 bg-[var(--Surface-Caution)] rounded-2xl border border-[var(--Border-Caution)]">
        <p className="typo-label-sm text-[var(--Text-Caution)] mb-2">❌ 禁止パターン</p>
        <code className="typo-body-sm text-[var(--Text-High-Emphasis)] block">
          {"<p className=\"text-sm font-bold leading-6\">"}<br />
          {"  // text-* font-* は使わない"}<br />
          {"</p>"}
        </code>
      </div>
      <ul className="space-y-2">
        {[
          "必ず typo-* クラスを使う",
          "typo-* と text-size / font-* / leading-* を混在させない",
          "カラーは別途 text-[var(--Text-*)] で指定",
          "レスポンシブ対応可: md:typo-heading-xl",
          "CVA 内でも typo-* を使用する",
        ].map((rule, i) => (
          <li key={i} className="flex items-start gap-2 typo-body-md text-[var(--Text-High-Emphasis)]">
            <span className="text-[var(--Text-Accent-Primary)] flex-shrink-0">{i + 1}.</span>
            {rule}
          </li>
        ))}
      </ul>
    </div>
  ),
}
