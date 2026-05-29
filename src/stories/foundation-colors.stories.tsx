import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta = {
  title: "Foundation/Colors",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
}
export default meta
type Story = StoryObj

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Swatch({ cssVar, label, dark = false }: { cssVar: string; label: string; dark?: boolean }) {
  return (
    <div className="flex flex-col gap-1 min-w-[80px]">
      <div
        className="h-12 w-full rounded-lg border border-[var(--Border-Low-Emphasis)]"
        style={{ background: `var(${cssVar})` }}
      />
      <p className={`typo-label-xs truncate ${dark ? "text-white" : "text-[var(--Text-High-Emphasis)]"}`}>{label}</p>
      <p className={`typo-body-xs truncate font-mono ${dark ? "text-white/60" : "text-[var(--Text-Low-Emphasis)]"}`}>{cssVar}</p>
    </div>
  )
}

function SwatchRow({ title, vars }: { title: string; vars: { cssVar: string; label: string }[] }) {
  return (
    <div className="mb-8">
      <h3 className="typo-heading-sm text-[var(--Text-High-Emphasis)] mb-3">{title}</h3>
      <div className="flex flex-wrap gap-3">
        {vars.map(v => <Swatch key={v.cssVar} {...v} />)}
      </div>
    </div>
  )
}

function SemanticRow({ title, items }: { title: string; items: { cssVar: string; label: string }[] }) {
  return (
    <div className="mb-8">
      <h3 className="typo-heading-sm text-[var(--Text-High-Emphasis)] mb-3">{title}</h3>
      <div className="flex flex-wrap gap-3">
        {items.map(item => <Swatch key={item.cssVar} cssVar={item.cssVar} label={item.label} />)}
      </div>
    </div>
  )
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export const SemanticTokens: Story = {
  name: "Semantic Tokens（推奨）",
  render: () => (
    <div>
      <p className="typo-body-md text-[var(--Text-Medium-Emphasis)] mb-6">
        コンポーネント内では必ずセマンティックトークンを使用。Primitive を直接参照しない。
      </p>
      <SemanticRow title="Surface（背景）" items={[
        { cssVar: "--Surface-Primary", label: "Primary" },
        { cssVar: "--Surface-Secondary", label: "Secondary" },
        { cssVar: "--Surface-Tertiary", label: "Tertiary" },
        { cssVar: "--Surface-Quaternary", label: "Quaternary" },
        { cssVar: "--Surface-Inverse", label: "Inverse" },
        { cssVar: "--Surface-Accent-Primary", label: "Accent" },
        { cssVar: "--Surface-Accent-Primary-Light", label: "Accent Light" },
        { cssVar: "--Surface-Caution", label: "Caution" },
        { cssVar: "--Surface-Success", label: "Success" },
        { cssVar: "--Surface-Warning", label: "Warning" },
        { cssVar: "--Surface-Info", label: "Info" },
      ]} />
      <SemanticRow title="Text（テキスト）" items={[
        { cssVar: "--Text-High-Emphasis", label: "High" },
        { cssVar: "--Text-Medium-Emphasis", label: "Medium" },
        { cssVar: "--Text-Low-Emphasis", label: "Low" },
        { cssVar: "--Text-Disable", label: "Disable" },
        { cssVar: "--Text-Accent-Primary", label: "Accent" },
        { cssVar: "--Text-Caution", label: "Caution" },
        { cssVar: "--Text-Success", label: "Success" },
        { cssVar: "--Text-Warning", label: "Warning" },
        { cssVar: "--Text-Info", label: "Info" },
      ]} />
      <SemanticRow title="Border（罫線）" items={[
        { cssVar: "--Border-High-Emphasis", label: "High" },
        { cssVar: "--Border-Medium-Emphasis", label: "Medium" },
        { cssVar: "--Border-Low-Emphasis", label: "Low" },
        { cssVar: "--Border-Accent-Primary", label: "Accent" },
        { cssVar: "--Border-Caution", label: "Caution" },
        { cssVar: "--Border-Success", label: "Success" },
        { cssVar: "--Border-Info", label: "Info" },
      ]} />
      <SemanticRow title="Brand" items={[
        { cssVar: "--Brand-Primary", label: "Primary" },
        { cssVar: "--Brand-Action", label: "Action" },
        { cssVar: "--Brand-Light", label: "Light" },
        { cssVar: "--Brand-Ultra-Light", label: "Ultra Light" },
      ]} />
      <SemanticRow title="Overlay" items={[
        { cssVar: "--Overlay-Dark", label: "Dark" },
        { cssVar: "--Overlay-Medium", label: "Medium" },
        { cssVar: "--Overlay-Light", label: "Light" },
      ]} />
    </div>
  ),
}

export const BrandPalette: Story = {
  name: "Brand Palette（テーマ差し替え対象）",
  render: () => (
    <div>
      <p className="typo-body-md text-[var(--Text-Medium-Emphasis)] mb-6">
        Brand-* はテーマファイルで10行差し替えるだけで全コンポーネントの色が変わる。
      </p>
      <SwatchRow title="Brand" vars={[
        { cssVar: "--Primitive-Brand-50", label: "50" },
        { cssVar: "--Primitive-Brand-100", label: "100" },
        { cssVar: "--Primitive-Brand-200", label: "200" },
        { cssVar: "--Primitive-Brand-300", label: "300" },
        { cssVar: "--Primitive-Brand-400", label: "400" },
        { cssVar: "--Primitive-Brand-500", label: "500" },
        { cssVar: "--Primitive-Brand-600", label: "600" },
        { cssVar: "--Primitive-Brand-700", label: "700" },
        { cssVar: "--Primitive-Brand-800", label: "800" },
        { cssVar: "--Primitive-Brand-900", label: "900" },
      ]} />
      <SwatchRow title="Gray" vars={[50,100,200,300,400,500,600,700,800,900].map(n => ({
        cssVar: `--Primitive-Gray-${n}`, label: `${n}`,
      }))} />
      <SwatchRow title="Red（Caution）" vars={[50,100,200,300,400,500,600,700,800,900].map(n => ({
        cssVar: `--Primitive-Red-${n}`, label: `${n}`,
      }))} />
      <SwatchRow title="Green（Success）" vars={[50,100,200,300,400,500,600,700,800,900].map(n => ({
        cssVar: `--Primitive-Green-${n}`, label: `${n}`,
      }))} />
      <SwatchRow title="Blue（Info）" vars={[50,100,200,300,400,500,600,700,800,900].map(n => ({
        cssVar: `--Primitive-Blue-${n}`, label: `${n}`,
      }))} />
    </div>
  ),
}

export const GlassTokens: Story = {
  name: "Liquid Glass Tokens（iOS 26）",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div
      className="min-h-screen p-8"
      style={{ background: "linear-gradient(160deg, #a8c8f8 0%, #3b82f6 60%, #1e40af 100%)" }}
    >
      <h2 className="typo-heading-lg text-white mb-2">Liquid Glass Material</h2>
      <p className="typo-body-sm text-white/70 mb-8">iOS 26 / macOS 26 スタイルのガラス素材。背景コンテンツに重ねて使用。</p>
      <div className="grid grid-cols-2 gap-4 max-w-lg">
        {[
          { cls: "glass-subtle", label: ".glass-subtle", desc: "薄いガラス" },
          { cls: "glass", label: ".glass", desc: "標準ガラス" },
          { cls: "glass-medium", label: ".glass-medium", desc: "中程度" },
          { cls: "glass-strong", label: ".glass-strong", desc: "濃いガラス" },
          { cls: "glass-dark", label: ".glass-dark", desc: "ダーク用" },
          { cls: "glass-overlay", label: ".glass-overlay", desc: "オーバーレイ" },
        ].map(({ cls, label, desc }) => (
          <div key={cls} className={`${cls} rounded-2xl p-4`}>
            <p className="typo-label-sm text-white font-mono">{label}</p>
            <p className="typo-body-xs text-white/70 mt-0.5">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  ),
}
