/**
 * @file Button のストーリー
 * @description Button variants and sizes.
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Add } from "iconsax-reactjs"
import { Button } from "./button"

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "secondary-switch",
        "tertiary",
        "ghost",
        "destructive",
        "link",
        "glass",
        "glass-inverse",
        "glass-accent",
        "accent",
        "inverse",
        "ghost-inverse",
      ],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg", "xl", "icon", "icon-sm", "icon-lg", "icon-xl"],
    },
    disabled: { control: "boolean" },
  },
}
export default meta

type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: { children: "ボタン", variant: "default", size: "default" },
}

export const Secondary: Story = {
  args: { children: "ボタン", variant: "secondary" },
}

export const SecondarySwitch: Story = {
  args: { children: "ボタン", variant: "secondary-switch" },
}

export const Tertiary: Story = {
  args: { children: "ボタン", variant: "tertiary" },
}

export const Ghost: Story = {
  args: { children: "ボタン", variant: "ghost" },
}

export const Destructive: Story = {
  args: { children: "削除する", variant: "destructive" },
}

export const Link: Story = {
  args: { children: "リンクボタン", variant: "link" },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="secondary-switch">Sec-Switch</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">XS</Button>
      <Button size="sm">SM</Button>
      <Button size="default">Default</Button>
      <Button size="lg">LG</Button>
      <Button size="xl">XL</Button>
      <Button size="hero">Hero CTA</Button>
    </div>
  ),
}

/** hero: pill 型 56px の特大 CTA。トップページの主要動線・final-CTA 専用。 */
export const Hero: Story = {
  args: { children: "今すぐ始める", size: "hero" },
}

/**
 * inverse / ghost-inverse: 暗背景・ヒーローセクション上に乗せる CTA。
 * 通常背景では他バリアントを使う。
 */
export const InverseOnDark: Story = {
  name: "Inverse on Dark Background",
  render: () => (
    <div className="p-8 rounded-2xl bg-[var(--Surface-Inverse,#111)] flex flex-wrap items-center gap-3">
      <Button variant="inverse">Inverse</Button>
      <Button variant="ghost-inverse">Ghost Inverse</Button>
      <Button variant="inverse" size="hero">Hero (Inverse)</Button>
    </div>
  ),
  globals: {
    backgrounds: {
      value: "dark"
    }
  },
}

/** リアル UI ：ヒーローセクション上の CTA ペア */
export const RealHeroCTAs: Story = {
  name: "Real UI — Hero Section CTAs",
  render: () => (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--Brand-Primary)] to-[var(--Primitive-Brand-700,#1D4ED8)] p-12 text-center">
      <h2 className="typo-heading-2xl text-[var(--Text-on-Inverse)] mb-3">
        フリーランス案件、最短即日マッチ。
      </h2>
      <p className="typo-body-md text-[var(--Text-on-Inverse)]/90 mb-8">
        登録 60 秒。スカウト多数。
      </p>
      <div className="flex items-center justify-center gap-3">
        <Button variant="inverse" size="hero">無料で始める</Button>
        <Button variant="ghost-inverse" size="hero">資料請求</Button>
      </div>
    </div>
  ),
}

export const Disabled: Story = {
  args: { children: "無効", disabled: true },
}

export const DisabledAllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default" disabled>Default</Button>
      <Button variant="secondary" disabled>Secondary</Button>
      <Button variant="tertiary" disabled>Tertiary</Button>
      <Button variant="ghost" disabled>Ghost</Button>
      <Button variant="destructive" disabled>Destructive</Button>
      <Button variant="link" disabled>Link</Button>
    </div>
  ),
}

export const IconButton: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="icon-sm" variant="ghost" aria-label="設定">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" /><path d="M8 1V3M8 13V15M1 8H3M13 8H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
      </Button>
      <Button size="icon" variant="secondary" aria-label="編集">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M11.5 2.5L13.5 4.5L5 13H3V11L11.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
      </Button>
      <Button size="icon-lg" variant="default" aria-label="追加">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      </Button>
    </div>
  ),
}

// ─── Liquid Glass ─────────────────────────────────────────────────────────────

const ShareIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 3v12M8 7l4-4 4 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 11H5a2 2 0 00-2 2v6a2 2 0 002 2h14a2 2 0 002-2v-6a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
)
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const Glass: Story = {
  name: "Glass — Liquid Glass (iOS 26)",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div
      className="flex flex-col items-center justify-center gap-8 min-h-screen p-8"
      style={{ background: "linear-gradient(160deg, #a8c8f8 0%, #3b82f6 60%, #1e40af 100%)" }}
    >
      <p className="text-white typo-label-sm opacity-60">variant="glass" — グラデーション・写真背景上で使用</p>
      {/* アイコンボタン */}
      <div className="flex items-center gap-4">
        <Button variant="glass" size="icon-xl" aria-label="閉じる"><CloseIcon /></Button>
        <Button variant="glass" size="icon-xl" aria-label="シェア"><ShareIcon /></Button>
        <Button variant="glass" size="icon-lg" aria-label="シェア"><ShareIcon /></Button>
        <Button variant="glass" size="icon" aria-label="シェア"><ShareIcon /></Button>
      </div>
      {/* テキストボタン */}
      <div className="flex items-center gap-3">
        <Button variant="glass" size="sm">キャンセル</Button>
        <Button variant="glass" size="default">アクション</Button>
        <Button variant="glass" size="lg">実行する</Button>
      </div>
    </div>
  ),
}

export const GlassInverseOnDark: Story = {
  name: "Glass Inverse on Dark Background",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--Surface-Inverse)] p-8">
      <div className="absolute inset-0 bg-[var(--Surface-VideoOverlay-Strong)]" />
      <div className="absolute inset-0 bg-[var(--Overlay-Dark)]" />
      <div className="relative flex flex-wrap items-center justify-center gap-3">
        <Button variant="glass-inverse" size="sm">キャンセル</Button>
        <Button variant="glass-inverse" size="default">サンプルデータで試す</Button>
        <Button variant="glass-inverse" size="lg">今すぐ始める</Button>
        <Button variant="glass-inverse" size="icon-xl" aria-label="シェア"><ShareIcon /></Button>
      </div>
    </div>
  ),
}

export const GlassAccentFab: Story = {
  name: "Glass Accent — FAB (Floating Action Button)",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden p-8"
      style={{ background: "linear-gradient(160deg, #dbeafe 0%, #93c5fd 60%, #3b82f6 100%)" }}
    >
      <p className="absolute top-8 left-1/2 -translate-x-1/2 text-[var(--Text-High-Emphasis)] typo-label-sm opacity-70">
        variant="glass-accent" — ブランドカラーをティントした glass。FAB 等の主要アクションに
      </p>
      <Button variant="glass-accent" size="icon-xl" aria-label="新規作成" className="size-16">
        <Add size={28} variant="Linear" color="currentColor" />
      </Button>
    </div>
  ),
}

export const GlassBlurDemo: Story = {
  name: "Glass — ボケ感デモ（動くコンテンツ上）",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="relative min-h-screen w-full overflow-hidden bg-[var(--Surface-Inverse)]">
      <style>{`@keyframes glass-blur-demo-scroll { from { transform: translateY(0); } to { transform: translateY(-45%); } }`}</style>
      {/* glass の backdrop blur / saturate はコンテンツが下を通過して初めて分かるため、
          カラフルなカード列を自動スクロールさせてボタンの下をくぐらせる */}
      <div
        className="absolute inset-x-0 top-0 flex flex-col gap-4 p-6"
        style={{ animation: "glass-blur-demo-scroll 16s linear infinite alternate" }}
        aria-hidden="true"
      >
        {Array.from({ length: 14 }, (_, i) => (
          <div
            key={i}
            className="flex h-32 items-center justify-between rounded-2xl px-6"
            style={{
              background: `linear-gradient(120deg, var(--Categorical-${(i % 8) + 1}), var(--Categorical-${((i + 3) % 8) + 1}-Subtle))`,
            }}
          >
            <span className="typo-heading-xl text-[var(--Text-on-Inverse)] opacity-90">Aa あア 09</span>
            <span className="size-16 rounded-full" style={{ background: `var(--Categorical-${((i + 5) % 8) + 1}-Bold)` }} />
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-20 flex items-center justify-center gap-3">
        <Button variant="glass" size="lg">キャンセル</Button>
        <Button variant="glass-accent" size="icon-fab" aria-label="新規作成">
          <Add size={26} variant="Linear" color="currentColor" />
        </Button>
        <Button variant="glass-inverse" size="lg">実行する</Button>
      </div>
      <p className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-[var(--Surface-VideoOverlay-Strong,rgba(0,0,0,0.6))] px-4 py-1.5 typo-label-sm text-[var(--Text-on-Inverse)]">
        下のコンテンツが動くと blur / saturate の質感が見える
      </p>
    </div>
  ),
}

// ─── Glass — カーソル追従スペキュラ（#3: interactive light response）──────────
// スペキュラのハイライト中心（--glass-hl-x / --glass-hl-y）を pointer 位置に
// 追従させ、"生きたガラス" の光応答を出す。CSS 変数の受け皿は glass.css 側に
// あり、ここでは onPointerMove で % を書き込むだけ。押下時は .glass-interactive
// が軽く縮む（ゲル）。
export const GlassPointerLensing: Story = {
  name: "Glass — カーソル追従スペキュラ",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="relative min-h-screen w-full overflow-hidden bg-[var(--Surface-Inverse)]">
      <div className="absolute inset-0 grid grid-cols-3 gap-4 p-6" aria-hidden="true">
        {Array.from({ length: 9 }, (_, i) => (
          <div
            key={i}
            className="rounded-2xl"
            style={{ background: `linear-gradient(140deg, var(--Categorical-${(i % 8) + 1}), var(--Categorical-${((i + 4) % 8) + 1}-Bold))` }}
          />
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="glass-strong glass-specular glass-interactive ksk-squircle flex h-56 w-80 flex-col items-center justify-center gap-2 rounded-[var(--Radius-Sheet)] p-6 text-[var(--Text-High-Emphasis)]"
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect()
            e.currentTarget.style.setProperty("--glass-hl-x", `${((e.clientX - r.left) / r.width) * 100}%`)
            e.currentTarget.style.setProperty("--glass-hl-y", `${((e.clientY - r.top) / r.height) * 100}%`)
          }}
          onPointerLeave={(e) => {
            e.currentTarget.style.removeProperty("--glass-hl-x")
            e.currentTarget.style.removeProperty("--glass-hl-y")
          }}
        >
          <span className="typo-heading-md">カーソルを重ねて動かす</span>
          <span className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">ハイライトがカーソルに追従・押下で軽く縮む</span>
        </div>
      </div>
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        追加する
      </Button>
      <Button variant="destructive">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 5H13M5 5V13H11V5M7 7V11M9 7V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        削除する
      </Button>
    </div>
  ),
}
