import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

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
          { cls: "glass-clear glass-specular", label: ".glass-clear", desc: "Clear（写真・動画上）" },
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

export const GlassLensingWithSpecular: Story = {
  name: "Lensing × Specular 併用（回帰ガード）",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div
      className="min-h-screen p-8"
      style={{ background: "linear-gradient(160deg, #a8c8f8 0%, #3b82f6 60%, #1e40af 100%)" }}
    >
      <h2 className="typo-heading-lg text-white mb-2">Lensing × Specular</h2>
      <p className="typo-body-sm text-white/70 mb-8">
        .glass 単体と .glass.glass-specular 併用でエッジ屈折（lensing, #163）が両方効くことを検証（issue #168 回帰ガード）。
      </p>
      <div className="grid grid-cols-2 gap-4 max-w-lg">
        <div data-testid="glass-plain" className="glass rounded-2xl p-4">
          <p className="typo-label-sm text-white font-mono">.glass</p>
          <p className="typo-body-xs text-white/70 mt-0.5">素材のみ（lensing あり）</p>
        </div>
        <div data-testid="glass-specular" className="glass glass-specular rounded-2xl p-4">
          <p className="typo-label-sm text-white font-mono">.glass.glass-specular</p>
          <p className="typo-body-xs text-white/70 mt-0.5">specular 併用（lensing 保持）</p>
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    // lensing は @supports (-webkit-app-region: none) ゲート（Chromium のみ true）
    // 内でのみ適用される。非対応環境では assert をスキップして落とさない。
    if (!CSS.supports("-webkit-app-region", "none")) return

    const plain = canvasElement.querySelector('[data-testid="glass-plain"]')!
    const specular = canvasElement.querySelector('[data-testid="glass-specular"]')!

    const plainFilter = getComputedStyle(plain).backdropFilter
    const specularFilter = getComputedStyle(specular).backdropFilter

    // .glass 単体で lensing（url(#glass-refract) 合成）が効いていること
    expect(plainFilter).toContain("url(")
    // .glass.glass-specular 併用でも lensing が保持されること（issue #168 の意図）
    expect(specularFilter).toContain("url(")
  },
}

export const AdaptiveMaterial: Story = {
  name: "Adaptive Material（宣言的適応）",
  parameters: { layout: "fullscreen" },
  render: () => {
    // 左右で「まったく同じ glass カードの markup」を、背後の明暗を宣言する
    // ラッパー（data-glass-backdrop）だけ変えて並べる。material と .glass-fg
    // 前景がコンテキストに応じて自動で切り替わることを示す。
    const Card = () => (
      <div className="glass glass-specular ksk-squircle rounded-2xl p-5">
        <p className="glass-fg typo-label-md font-mono">.glass + .glass-fg</p>
        <p className="glass-fg typo-body-sm mt-1 opacity-80">
          markup は左右で同一。背景宣言だけで material と前景が追従する。
        </p>
      </div>
    )
    return (
      <div className="grid min-h-screen grid-cols-2">
        {/* 明背景の宣言。前景は濃色のまま */}
        <section
          data-glass-backdrop="light"
          data-testid="ctx-light"
          className="flex flex-col items-center justify-center gap-4 p-8"
          style={{ background: "linear-gradient(160deg, #eef2f7 0%, #dbe4f0 100%)" }}
        >
          <p className="typo-label-sm text-[var(--Text-Medium-Emphasis)] font-mono">data-glass-backdrop=&quot;light&quot;</p>
          <div className="w-full max-w-xs" data-testid="card-light"><Card /></div>
        </section>
        {/* 暗背景の宣言。material が暗メディア用へ、前景は白系＋影へ */}
        <section
          data-glass-backdrop="dark"
          data-testid="ctx-dark"
          className="flex flex-col items-center justify-center gap-4 p-8"
          style={{ background: "linear-gradient(160deg, #1e293b 0%, #0b1220 100%)" }}
        >
          <p className="typo-label-sm text-white/70 font-mono">data-glass-backdrop=&quot;dark&quot;</p>
          <div className="w-full max-w-xs" data-testid="card-dark"><Card /></div>
        </section>
      </div>
    )
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    // 同一 markup が、背景宣言だけで前景色と material 背景を変えること（回帰ガード）。
    const fgLight = canvasElement.querySelector('[data-testid="card-light"] .glass-fg')!
    const fgDark = canvasElement.querySelector('[data-testid="card-dark"] .glass-fg')!
    const bgLight = canvasElement.querySelector('[data-testid="card-light"] .glass')!
    const bgDark = canvasElement.querySelector('[data-testid="card-dark"] .glass')!

    // 前景色: light は濃色 / dark は白系 → 異なる
    expect(getComputedStyle(fgLight).color).not.toBe(getComputedStyle(fgDark).color)

    // material 背景: light は白ベース / dark は暗ベース → 異なる
    expect(getComputedStyle(bgLight).backgroundColor).not.toBe(getComputedStyle(bgDark).backgroundColor)

    // 暗コンテキストの前景は可読性のため text-shadow が付く
    expect(getComputedStyle(fgDark).textShadow).not.toBe("none")
  },
}
