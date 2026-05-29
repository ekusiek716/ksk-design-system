import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta = {
  title: "Foundation/Spacing",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
}
export default meta
type Story = StoryObj

const SPACING = [
  { token: "0.5", px: "2px" },
  { token: "1",   px: "4px" },
  { token: "1.5", px: "6px" },
  { token: "2",   px: "8px" },
  { token: "2.5", px: "10px" },
  { token: "3",   px: "12px" },
  { token: "4",   px: "16px" },
  { token: "5",   px: "20px" },
  { token: "6",   px: "24px" },
  { token: "8",   px: "32px" },
  { token: "10",  px: "40px" },
  { token: "12",  px: "48px" },
  { token: "14",  px: "56px" },
  { token: "16",  px: "64px" },
]

const SHADOWS = [
  { name: "--shadow-sm",     label: "shadow-sm",     desc: "微細な浮き（カード境界等）" },
  { name: "--shadow-md",     label: "shadow-md",     desc: "標準の浮き（ドロップダウン等）" },
  { name: "--shadow-lg",     label: "shadow-lg",     desc: "大きな浮き（サイドパネル等）" },
  { name: "--shadow-dialog", label: "shadow-dialog", desc: "モーダル・シート用" },
  { name: "--shadow-tooltip",label: "shadow-tooltip",desc: "ツールチップ用" },
]

export const SpacingScale: Story = {
  name: "Spacing Scale",
  render: () => (
    <div className="space-y-2">
      <p className="typo-body-md text-[var(--Text-Medium-Emphasis)] mb-4">
        Tailwind の標準スペーシングスケール（1 = 4px）を使用。非トークン値（margin: 17px 等）は禁止。
      </p>
      {SPACING.map(({ token, px }) => (
        <div key={token} className="flex items-center gap-4">
          <code className="typo-body-xs text-[var(--Text-Accent-Primary)] font-mono w-10">{token}</code>
          <div
            className="bg-[var(--Brand-Primary)] h-5 rounded"
            style={{ width: px }}
          />
          <span className="typo-body-xs text-[var(--Text-Low-Emphasis)]">{px}</span>
          <span className="typo-body-xs text-[var(--Text-Disable)]">p-{token} / m-{token} / gap-{token}</span>
        </div>
      ))}
    </div>
  ),
}

export const BorderRadius: Story = {
  name: "Border Radius",
  render: () => (
    <div className="space-y-4">
      <p className="typo-body-md text-[var(--Text-Medium-Emphasis)] mb-4">
        使用可能な角丸は5種類のみ。rounded-md / rounded-xl 等の中間値は禁止。
      </p>
      {[
        { cls: "rounded-none", label: "none", desc: "テーブル・区切り" },
        { cls: "rounded-sm",   label: "sm (2px)", desc: "バッジ・タグの微小丸" },
        { cls: "rounded-lg",   label: "lg (8px)", desc: "カード・入力フィールド" },
        { cls: "rounded-2xl",  label: "2xl (16px)", desc: "シート・モーダル・大カード" },
        { cls: "rounded-full", label: "full", desc: "ボタン・ピル・アバター" },
      ].map(({ cls, label, desc }) => (
        <div key={cls} className="flex items-center gap-4">
          <div className={`${cls} w-16 h-10 bg-[var(--Brand-Primary)] flex-shrink-0`} />
          <div>
            <code className="typo-label-sm text-[var(--Text-Accent-Primary)]">.{cls}</code>
            <span className="typo-body-xs text-[var(--Text-Low-Emphasis)] ml-2">({label})</span>
            <p className="typo-body-xs text-[var(--Text-Medium-Emphasis)]">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  ),
}

export const Shadows: Story = {
  name: "Shadow Tokens",
  render: () => (
    <div className="space-y-6">
      {SHADOWS.map(({ name, desc }) => (
        <div key={name} className="flex items-center gap-6">
          <div
            className="w-24 h-16 rounded-2xl bg-[var(--Surface-Primary)] flex-shrink-0"
            style={{ boxShadow: `var(${name})` }}
          />
          <div>
            <code className="typo-label-sm text-[var(--Text-Accent-Primary)]">var({name})</code>
            <p className="typo-body-xs text-[var(--Text-Low-Emphasis)] mt-0.5">shadow-[var({name})]</p>
            <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  ),
}
