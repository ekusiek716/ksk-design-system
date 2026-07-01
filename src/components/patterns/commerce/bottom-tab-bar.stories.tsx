import type { Meta, StoryObj } from "@storybook/react"
import { Add } from "iconsax-reactjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BottomTabBar } from "./bottom-tab-bar"

const meta: Meta<typeof BottomTabBar> = {
  title: "Components/Commerce/BottomTabBar",
  component: BottomTabBar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
}
export default meta
type Story = StoryObj<typeof BottomTabBar>

// ─── Icons ────────────────────────────────────────────────────────────────────

const HomeIcon    = <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
const HomeActive  = <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
const SearchIcon  = <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" /><path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
const CartIcon    = <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="21" r="1" stroke="currentColor" strokeWidth="2" /><circle cx="20" cy="21" r="1" stroke="currentColor" strokeWidth="2" /><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
const UserIcon    = <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" /><path d="M20 21c0-3.3-3.6-6-8-6s-8 2.7-8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
const HeartIcon   = <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="2" /></svg>
const PlusIcon    = <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
const TalkIcon    = <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 6.5A3.5 3.5 0 017.5 3h9A3.5 3.5 0 0120 6.5v6a3.5 3.5 0 01-3.5 3.5h-4.2L7 21v-5H7.5A3.5 3.5 0 014 12.5v-6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
const GalleryIcon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="2" /><path d="M7 16l3.2-3.2a1.2 1.2 0 011.7 0L15 16l1.2-1.2a1.2 1.2 0 011.7 0L21 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" /></svg>

const ITEMS = [
  { label: "ホーム", icon: HomeIcon, activeIcon: HomeActive, isActive: true },
  { label: "検索", icon: SearchIcon },
  { label: "お気に入り", icon: HeartIcon, badgeCount: 3 },
  { label: "カート", icon: CartIcon, badgeCount: 2 },
  { label: "マイページ", icon: UserIcon },
]

const COMPACT_ITEMS = [
  { label: "トーク", icon: TalkIcon, isActive: true },
  { label: "ギャラリー", icon: GalleryIcon },
]

const CENTER_ACTION = { label: "作成", ariaLabel: "作成する", icon: PlusIcon }

// ─── Default (全幅バー) ───────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <div className="relative h-24 bg-[var(--Surface-Secondary)]">
      <BottomTabBar items={ITEMS} />
    </div>
  ),
}

// ─── Pill (iOS 26 Liquid Glass) ───────────────────────────────────────────────

export const Pill: Story = {
  name: "Pill — iOS 26 Liquid Glass",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-center"
      style={{ background: "linear-gradient(160deg, #a8c8f8 0%, #3b82f6 50%, #1e3a8a 100%)" }}
    >
      <p className="text-[var(--Text-on-Inverse)] typo-heading-xl opacity-80">背景コンテンツ</p>
      <p className="text-[var(--Text-on-Inverse)] typo-body-md opacity-50 mt-2">ピルナビゲーション</p>
      <BottomTabBar variant="pill" pillPosition="absolute" items={ITEMS} />
    </div>
  ),
}

export const PillOnLight: Story = {
  name: "Pill — on light background",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center bg-[var(--Surface-Secondary)]">
      <p className="text-[var(--Text-High-Emphasis)] typo-heading-xl">背景コンテンツ</p>
      <p className="text-[var(--Text-Low-Emphasis)] typo-body-md mt-2">ライト背景上のピルナビ</p>
      <BottomTabBar variant="pill" pillPosition="absolute" items={ITEMS} />
    </div>
  ),
}

export const LiquidGlassCenterAction: Story = {
  name: "Liquid Glass — center action",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center bg-[var(--Surface-Secondary)]">
      <p className="text-[var(--Text-High-Emphasis)] typo-heading-xl">メッセージ</p>
      <p className="text-[var(--Text-Low-Emphasis)] typo-body-md mt-2">中央 CTA 付きグローバルナビ</p>
      <BottomTabBar
        variant="pill"
        pillPosition="absolute"
        items={COMPACT_ITEMS}
        centerAction={CENTER_ACTION}
      />
    </div>
  ),
}

export const LiquidGlassLabelsVisible: Story = {
  name: "Liquid Glass — labels visible",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center bg-[var(--Surface-Secondary)]">
      <p className="text-[var(--Text-High-Emphasis)] typo-heading-xl">タブを判別しやすい構成</p>
      <p className="text-[var(--Text-Low-Emphasis)] typo-body-md mt-2">Liquid Glass + ラベル表示</p>
      <BottomTabBar variant="pill" pillPosition="absolute" items={ITEMS.slice(0, 3)} showLabels />
    </div>
  ),
}

export const LiquidGlassFiveItems: Story = {
  name: "Liquid Glass — 5 items",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center bg-[var(--Surface-Secondary)]">
      <p className="text-[var(--Text-High-Emphasis)] typo-heading-xl">5 タブ構成</p>
      <p className="text-[var(--Text-Low-Emphasis)] typo-body-md mt-2">幅制約ありのラベル表示</p>
      <BottomTabBar variant="pill" pillPosition="absolute" items={ITEMS} showLabels />
    </div>
  ),
}

export const LiquidGlassOverDarkPhotoGradient: Story = {
  name: "Liquid Glass — over dark photo/gradient",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, rgba(10,10,18,0.96) 0%, rgba(18,22,42,0.86) 44%, rgba(60,35,95,0.88) 100%), radial-gradient(circle at 30% 20%, rgba(255,255,255,0.22), transparent 28%)",
      }}
    >
      <div className="absolute inset-x-0 top-0 h-1/2 opacity-40" style={{ background: "linear-gradient(120deg, rgba(255,255,255,0.18), transparent)" }} />
      <p className="text-[var(--Text-on-Inverse)] typo-heading-xl opacity-90">暗いメディア背景</p>
      <p className="text-[var(--Text-on-Inverse)] typo-body-md opacity-65 mt-2">tone="inverse" で白文字を維持</p>
      <BottomTabBar
        variant="pill"
        pillPosition="absolute"
        items={COMPACT_ITEMS}
        centerAction={CENTER_ACTION}
        tone="inverse"
      />
    </div>
  ),
}

export const LiquidGlassLightFallback: Story = {
  name: "Liquid Glass — light fallback",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center bg-[var(--Surface-Primary)]">
      <p className="text-[var(--Text-High-Emphasis)] typo-heading-xl">ライト背景</p>
      <p className="text-[var(--Text-Low-Emphasis)] typo-body-md mt-2">デフォルト tone のまま読みやすい fallback</p>
      <BottomTabBar
        variant="pill"
        pillPosition="absolute"
        items={COMPACT_ITEMS}
        centerAction={CENTER_ACTION}
      />
    </div>
  ),
}

// ─── Floating position (left/right + FAB) ────────────────────────────────────

export const FloatingPositionLeftWithFab: Story = {
  name: "Floating position — left + FAB",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center bg-[var(--Surface-Secondary)]">
      <p className="text-[var(--Text-High-Emphasis)] typo-heading-xl">左寄せフロート</p>
      <p className="text-[var(--Text-Low-Emphasis)] typo-body-md mt-2">floatingPosition="left" — 右側に FAB スペースを確保</p>
      <BottomTabBar variant="pill" pillPosition="absolute" floatingPosition="left" items={COMPACT_ITEMS} />
      <Button
        variant="glass-accent"
        size="icon-xl"
        aria-label="新規作成"
        className="absolute bottom-[calc(env(safe-area-inset-bottom)+12px)] right-3"
      >
        <Add size={24} variant="Linear" color="currentColor" />
      </Button>
    </div>
  ),
}

export const FloatingPositionRightWithFab: Story = {
  name: "Floating position — right + FAB",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center bg-[var(--Surface-Secondary)]">
      <p className="text-[var(--Text-High-Emphasis)] typo-heading-xl">右寄せフロート</p>
      <p className="text-[var(--Text-Low-Emphasis)] typo-body-md mt-2">floatingPosition="right" — 左側に FAB スペースを確保</p>
      <BottomTabBar variant="pill" pillPosition="absolute" floatingPosition="right" items={COMPACT_ITEMS} />
      <Button
        variant="glass-accent"
        size="icon-xl"
        aria-label="新規作成"
        className="absolute bottom-[calc(env(safe-area-inset-bottom)+12px)] left-3"
      >
        <Add size={24} variant="Linear" color="currentColor" />
      </Button>
    </div>
  ),
}

export const KeyboardHideWithInput: Story = {
  name: "Keyboard behavior — hide",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="relative min-h-screen bg-[var(--Surface-Secondary)] px-6 py-10">
      <div className="mx-auto flex min-h-screen max-w-[430px] flex-col justify-end pb-28">
        <div className="space-y-2 rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-4">
          <Label htmlFor="bottom-tab-keyboard-title">タイトル</Label>
          <Input id="bottom-tab-keyboard-title" placeholder="入力中は下部ナビを隠す" />
        </div>
      </div>
      <BottomTabBar
        variant="pill"
        keyboardBehavior="hide"
        items={COMPACT_ITEMS}
        centerAction={CENTER_ACTION}
        className="lg:flex"
      />
    </div>
  ),
}
