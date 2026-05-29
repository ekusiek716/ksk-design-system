import type { Meta, StoryObj } from "@storybook/react"
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

const ITEMS = [
  { label: "ホーム", icon: HomeIcon, activeIcon: HomeActive, isActive: true },
  { label: "検索", icon: SearchIcon },
  { label: "お気に入り", icon: HeartIcon, badgeCount: 3 },
  { label: "カート", icon: CartIcon, badgeCount: 2 },
  { label: "マイページ", icon: UserIcon },
]

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
      <p className="text-white typo-heading-xl opacity-80">背景コンテンツ</p>
      <p className="text-white typo-body-md opacity-50 mt-2">ピルナビゲーション</p>
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
