import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"
import { Add, Home2, Setting2, TaskSquare, User } from "iconsax-reactjs"
import { Button } from "@/components/ui/button"
import { BottomTabBar } from "./commerce/bottom-tab-bar"
import { MobileFloatingActionButton } from "./mobile-floating-action-button"
import { MobileAppHeader } from "./mobile-app-header"
import { MobileAppShell } from "./mobile-app-shell"
import { SidebarNav } from "./sidebar-nav"

const meta: Meta<typeof MobileAppShell> = {
  title: "Components/MobileAppShell",
  component: MobileAppShell,
  parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof MobileAppShell>

const tabItems = [
  { label: "ホーム", icon: <Home2 size={22} />, isActive: true },
  { label: "タスク", icon: <TaskSquare size={22} /> },
  { label: "プロフィール", icon: <User size={22} /> },
  { label: "設定", icon: <Setting2 size={22} /> },
]

export const FourTabPwaShell: Story = {
  render: () => (
    <MobileAppShell
      header={
        <MobileAppHeader
          brand={
            <div>
              <p className="typo-heading-md text-[var(--Text-High-Emphasis)]">Belle</p>
              <p className="typo-body-xs text-[var(--Text-Medium-Emphasis)]">今日のタスク</p>
            </div>
          }
        />
      }
      bottomNavMode="fixed"
      bottomNav={
        <div className="relative h-20">
          <BottomTabBar variant="pill" pillPosition="absolute" items={tabItems} showLabels />
        </div>
      }
      fab={
        <MobileFloatingActionButton
          label="追加"
          icon={<Add size={22} />}
          mobileOnly={false}
          bottomOffset="bottom-nav-pill"
        />
      }
      contentClassName="space-y-3 p-4"
    >
      <div className="rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-4">
        <p className="typo-heading-md text-[var(--Text-High-Emphasis)]">今日</p>
        <p className="typo-body-sm mt-1 text-[var(--Text-Medium-Emphasis)]">次のアクションを確認できます。</p>
      </div>
      <div className="rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-4">
        <p className="typo-heading-md text-[var(--Text-High-Emphasis)]">進行中</p>
        <p className="typo-body-sm mt-1 text-[var(--Text-Medium-Emphasis)]">カードは shell の padding と重なりません。</p>
      </div>
    </MobileAppShell>
  ),
}

export const DesktopSidebarHandoff: Story = {
  render: () => (
    <MobileAppShell
      maxWidth="100%"
      desktopSidebar={
        // モバイルの BottomTabBar と同じ items 配列をそのまま渡す（issue #611）
        <SidebarNav items={tabItems} className="p-3" />
      }
      header={<MobileAppHeader brand={<p className="typo-heading-md text-[var(--Text-High-Emphasis)]">Settings</p>} />}
      bottomNavMode="inline"
      bottomNav={<BottomTabBar items={tabItems} className="lg:hidden" />}
      contentClassName="p-4"
    >
      <div className="rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-4">
        <p className="typo-heading-md text-[var(--Text-High-Emphasis)]">Desktop sidebar handoff</p>
        <p className="typo-body-sm mt-1 text-[var(--Text-Medium-Emphasis)]">モバイルは bottom nav、desktop は sidebar に移行します。</p>
      </div>
    </MobileAppShell>
  ),
}

/**
 * アプリ型の高さ固定の画面（issue #715）。`viewport="fixed"` でルートを画面の高さに固定し、main だけがスクロールする。
 * `safeAreaTop` で header がノッチの裏まで伸び、`safeAreaBottom` で本文の末尾がタブバー + ホームインジケータに隠れない。
 * ネイティブの殻がタブバーを描く構成は `bottomPadding="native-tab-bar"`（`--Native-Tab-Bar-Height` を読む）。
 * 広告バナー等の常設要素は `bottomPaddingExtra` に高さの変数を渡す。page 側に padding の計算式を書かない。
 */
export const FixedViewportApp: Story = {
  tags: ["interaction"],
  render: () => (
    <MobileAppShell
      viewport="fixed"
      safeAreaTop
      safeAreaBottom
      centeredPreview={false}
      header={
        <MobileAppHeader
          brand={<p className="typo-heading-md text-[var(--Text-High-Emphasis)]">Belle</p>}
        />
      }
      bottomNavMode="fixed"
      bottomNav={
        <div className="relative h-20">
          <BottomTabBar variant="pill" pillPosition="absolute" items={tabItems} showLabels />
        </div>
      }
      contentClassName="space-y-3 p-4"
    >
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} className="rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-4">
          <p className="typo-heading-md text-[var(--Text-High-Emphasis)]">タスク {i + 1}</p>
          <p className="typo-body-sm mt-1 text-[var(--Text-Medium-Emphasis)]">本文だけがスクロールし、ヘッダーは常に見える。</p>
          <Button variant="secondary" size="sm" className="mt-2">開く</Button>
        </div>
      ))}
    </MobileAppShell>
  ),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector<HTMLElement>('[data-slot="mobile-app-shell"]')!
    const main = canvasElement.querySelector<HTMLElement>('[data-slot="mobile-app-shell-main"]')!
    await expect(Math.round(root.getBoundingClientRect().height)).toBeLessThanOrEqual(window.innerHeight)
    // 本文の量が画面より多いと main だけがスクロールする
    await expect(main.scrollHeight).toBeGreaterThan(main.clientHeight)
    await expect(getComputedStyle(main).overflowY).toBe("auto")
    // スクロール領域は Tab で止まる（中に操作できる要素が無くてもキーボードでスクロールできる）
    await expect(main.tabIndex).toBe(0)
    // 下余白は 5rem（bottom-nav）+ 下端の safe-area（テスト環境では 0）
    await expect(getComputedStyle(main).paddingBottom).toBe("80px")
  },
}
