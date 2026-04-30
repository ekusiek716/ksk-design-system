import type { Meta, StoryObj } from "@storybook/react"
import { AppHeader } from "./app-header"
import { Button } from "@/components/ui/button"
import { NotificationBadge } from "./notification-badge"

const meta: Meta<typeof AppHeader> = {
  title: "Patterns/AppHeader",
  component: AppHeader,
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof AppHeader>

const BackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M15 15l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)
const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 2a6 6 0 00-6 6v3l-1.5 2.5h15L16 11V8a6 6 0 00-6-6zM8.5 17a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export const Default: Story = {
  render: () => (
    <AppHeader
      title="マイページ"
      trailing={
        <Button variant="ghost" size="icon-sm"><SearchIcon /></Button>
      }
    />
  ),
}

export const WithBack: Story = {
  render: () => (
    <AppHeader
      leading={<Button variant="ghost" size="icon-sm"><BackIcon /></Button>}
      title="タスク詳細"
    />
  ),
}

export const WithSubtitle: Story = {
  render: () => (
    <AppHeader
      leading={<Button variant="ghost" size="icon-sm"><BackIcon /></Button>}
      title="Wedding Todo"
      subtitle="2026年12月25日まで 241日"
      trailing={
        <div className="flex items-center gap-1">
          <NotificationBadge count={3}>
            <Button variant="ghost" size="icon-sm"><BellIcon /></Button>
          </NotificationBadge>
          <Button variant="ghost" size="icon-sm"><SearchIcon /></Button>
        </div>
      }
    />
  ),
}

export const WithMenu: Story = {
  render: () => (
    <AppHeader
      leading={<Button variant="ghost" size="icon-sm"><MenuIcon /></Button>}
      title="ダッシュボード"
      trailing={
        <Button size="sm">新規作成</Button>
      }
    />
  ),
}

export const Sticky: Story = {
  render: () => (
    <div className="h-96 overflow-auto bg-[var(--Surface-Secondary)] rounded-lg">
      <AppHeader sticky title="スクロールしてください" subtitle="Sticky ヘッダー" />
      <div className="p-4 space-y-4">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="h-12 bg-[var(--Surface-Primary)] rounded-lg flex items-center px-4">
            <span className="typo-body-md text-[var(--Text-High-Emphasis)]">コンテンツ {i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  ),
}
