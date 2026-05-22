import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { MenuDrawer } from "./menu-drawer"
import { Button } from "@/components/ui/button"

const meta: Meta<typeof MenuDrawer> = {
  title: "Components/MenuDrawer",
  component: MenuDrawer,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
}
export default meta
type Story = StoryObj<typeof MenuDrawer>

const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 7l6-5 6 5v6a1 1 0 01-1 1H3a1 1 0 01-1-1V7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M6 14V9h4v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)
const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 7a4 4 0 018 0c0 3 1 4 1 4H3s1-1 1-4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M6.5 13a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)
const FolderIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 4a1 1 0 011-1h3l1.5 2H13a1 1 0 011 1v6a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
  </svg>
)
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)
const BoxIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 5l6-3 6 3v6l-6 3-6-3V5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M8 2v12M2 5l6 3 6-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)

const SECTIONS = [
  {
    title: "メニュー",
    items: [
      { label: "ダッシュボード", icon: <HomeIcon /> },
      { label: "お知らせ", icon: <BellIcon />, badge: 3 },
      { label: "プロジェクト", icon: <FolderIcon /> },
    ],
  },
  {
    title: "アカウント",
    items: [
      { label: "マイページ", icon: <UserIcon /> },
      { label: "アクティビティ", icon: <BoxIcon /> },
    ],
  },
]

const FOOTER = [
  { label: "利用規約" },
  { label: "プライバシー" },
  { label: "お問い合わせ" },
]

export const Default: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    return (
      <div className="p-4">
        <Button onClick={() => setOpen(true)}>メニューを開く</Button>
        <MenuDrawer
          open={open}
          onClose={() => setOpen(false)}
          banner={
            <div className="rounded-xl p-3 text-white text-sm font-bold" style={{ background: "linear-gradient(135deg,#3B82F6,#60A5FA)" }}>
              新機能が利用可能になりました
            </div>
          }
          sections={SECTIONS}
          footerLinks={FOOTER}
        />
      </div>
    )
  },
}

export const NoBanner: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    return (
      <div className="p-4">
        <Button onClick={() => setOpen(true)}>メニューを開く</Button>
        <MenuDrawer open={open} onClose={() => setOpen(false)} sections={SECTIONS} />
      </div>
    )
  },
}
