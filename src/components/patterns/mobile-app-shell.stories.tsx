import type { Meta, StoryObj } from "@storybook/react"
import { Add, Home2, Setting2, TaskSquare, User } from "iconsax-reactjs"
import { BottomTabBar } from "./commerce/bottom-tab-bar"
import { MobileFloatingActionButton } from "./mobile-floating-action-button"
import { MobileAppHeader } from "./mobile-app-header"
import { MobileAppShell } from "./mobile-app-shell"

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
        <div className="space-y-2 p-4">
          {tabItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2 rounded-lg px-3 py-2 typo-label-md text-[var(--Text-High-Emphasis)]">
              {item.icon}
              {item.label}
            </div>
          ))}
        </div>
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
