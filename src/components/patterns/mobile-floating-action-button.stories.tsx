import type { Meta, StoryObj } from "@storybook/react"
import { Add } from "iconsax-reactjs"
import { BottomTabBar } from "./commerce/bottom-tab-bar"
import { MobileFloatingActionButton } from "./mobile-floating-action-button"

const meta: Meta<typeof MobileFloatingActionButton> = {
  title: "Components/MobileFloatingActionButton",
  component: MobileFloatingActionButton,
}
export default meta

type Story = StoryObj<typeof MobileFloatingActionButton>

const HomeIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 10.5 12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H4.5A1.5 1.5 0 0 1 3 19.5v-9Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
)

const ListIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const NAV_ITEMS = [
  { label: "ホーム", icon: HomeIcon, isActive: true },
  { label: "一覧", icon: ListIcon },
]

export const WithBottomNavOffset: Story = {
  render: () => (
    <div className="relative min-h-80 rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Secondary)]">
      <MobileFloatingActionButton
        label="追加する"
        icon={<Add size={22} />}
        mobileOnly={false}
        bottomOffset="bottom-nav"
      />
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="relative min-h-80 rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Secondary)]">
      <MobileFloatingActionButton
        label="タスクを追加"
        showLabel
        mobileOnly={false}
        placement="center"
        bottomOffset="none"
      />
    </div>
  ),
}

export const WithPillBottomNavInline: Story = {
  name: "With pill BottomTabBar inline",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="relative min-h-screen bg-[var(--Surface-Secondary)]">
      <div className="mx-auto flex min-h-screen max-w-[430px] flex-col px-6 py-10">
        <div className="space-y-3 rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-4">
          <div className="h-3 w-28 rounded-full bg-[var(--Surface-Tertiary)]" />
          <div className="h-3 w-full rounded-full bg-[var(--Surface-Tertiary)]" />
          <div className="h-3 w-2/3 rounded-full bg-[var(--Surface-Tertiary)]" />
        </div>
      </div>
      <BottomTabBar variant="pill" items={NAV_ITEMS} className="lg:flex" />
      <MobileFloatingActionButton
        label="追加する"
        icon={<Add size={22} />}
        mobileOnly={false}
        bottomOffset="bottom-nav-pill-inline"
      />
    </div>
  ),
}
