import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { Home2, Notification, Setting2, TaskSquare, User } from "iconsax-reactjs"
import { MobileTabBar } from "./mobile-tab-bar"

const meta: Meta<typeof MobileTabBar> = {
  title: "Components/MobileTabBar",
  component: MobileTabBar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
}
export default meta
type Story = StoryObj<typeof MobileTabBar>

type TabKey = "home" | "tasks" | "notifications" | "profile" | "settings"

const TABS = [
  { key: "home" as const, label: "ホーム", Icon: Home2 },
  { key: "tasks" as const, label: "タスク", Icon: TaskSquare },
  { key: "notifications" as const, label: "通知", Icon: Notification },
  { key: "profile" as const, label: "プロフィール", Icon: User },
  { key: "settings" as const, label: "設定", Icon: Setting2 },
]

// ─── 基本形（addAction なし） ─────────────────────────────────────────────────

export const Default: Story = {
  render: () => {
    const [active, setActive] = React.useState<TabKey>("home")
    return (
      <div className="relative w-full min-h-screen flex flex-col items-center justify-center bg-[var(--Surface-Secondary)]">
        <p className="text-[var(--Text-High-Emphasis)] typo-heading-xl">現在のタブ: {active}</p>
        <p className="text-[var(--Text-Low-Emphasis)] typo-body-md mt-2">iconsax Linear / Bulk が選択状態に応じて自動切替</p>
        <MobileTabBar tabs={TABS.slice(0, 4)} activeTab={active} onSelect={setActive} />
      </div>
    )
  },
}

// ─── addAction 付き（中央 CTA） ────────────────────────────────────────────────

export const WithAddAction: Story = {
  name: "With addAction (center CTA)",
  render: () => {
    const [active, setActive] = React.useState<TabKey>("tasks")
    const [count, setCount] = React.useState(0)
    return (
      <div className="relative w-full min-h-screen flex flex-col items-center justify-center bg-[var(--Surface-Secondary)]">
        <p className="text-[var(--Text-High-Emphasis)] typo-heading-xl">現在のタブ: {active}</p>
        <p className="text-[var(--Text-Low-Emphasis)] typo-body-md mt-2">作成タップ回数: {count}</p>
        <MobileTabBar
          tabs={[TABS[0], TABS[1], TABS[3], TABS[4]]}
          activeTab={active}
          onSelect={setActive}
          addAction={{ label: "作成", ariaLabel: "新規作成", onClick: () => setCount((c) => c + 1) }}
        />
      </div>
    )
  },
}

// ─── floatingPosition 併用（左寄せ + FAB は別コンポーネントで併置） ───────────────

export const FloatingPositionLeft: Story = {
  name: "floatingPosition='left' passthrough",
  render: () => {
    const [active, setActive] = React.useState<TabKey>("home")
    return (
      <div className="relative w-full min-h-screen flex flex-col items-center justify-center bg-[var(--Surface-Secondary)]">
        <p className="text-[var(--Text-High-Emphasis)] typo-heading-xl">左寄せフロート</p>
        <p className="text-[var(--Text-Low-Emphasis)] typo-body-md mt-2">
          floatingPosition は BottomTabBar へパススルーされる
        </p>
        <MobileTabBar
          tabs={TABS.slice(0, 3)}
          activeTab={active}
          onSelect={setActive}
          floatingPosition="left"
        />
      </div>
    )
  },
}
