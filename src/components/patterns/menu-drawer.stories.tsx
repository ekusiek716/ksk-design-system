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

const CakeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 10h12v4H2zM4 10V7a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M8 3V1M6 3c0-1.1.9-2 2-2s2 .9 2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)
const GiftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="6" width="14" height="9" rx="1" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M8 6v9M1 9h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M5 6c-1.1 0-2-.9-2-2s.9-2 2-2c1.5 0 2.5 1.5 3 4-1.5 0-2.5-.5-3-2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M11 6c1.1 0 2-.9 2-2s-.9-2-2-2c-1.5 0-2.5 1.5-3 4 1.5 0 2.5-.5 3-2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
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
      { label: "ウェディングケーキ", icon: <CakeIcon /> },
      { label: "ギフト・プレゼント", icon: <GiftIcon />, badge: 3 },
      { label: "記念日ケーキ", icon: <CakeIcon /> },
    ],
  },
  {
    title: "アカウント",
    items: [
      { label: "マイページ", icon: <UserIcon /> },
      { label: "注文履歴", icon: <BoxIcon /> },
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
            <div className="rounded-xl p-3 text-white text-sm font-bold" style={{ background: "linear-gradient(135deg,#E8426B,#F9AABF)" }}>
              春の早割キャンペーン開催中！
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
