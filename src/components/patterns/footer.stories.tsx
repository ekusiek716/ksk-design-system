import type { Meta, StoryObj } from "@storybook/react"
import { Footer } from "./footer"

const meta: Meta<typeof Footer> = {
  title: "Components/Footer",
  component: Footer,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
}
export default meta
type Story = StoryObj<typeof Footer>

const LINK_GROUPS = [
  {
    title: "プロダクト",
    links: [
      { label: "機能一覧" },
      { label: "料金プラン" },
      { label: "導入事例" },
      { label: "アップデート情報" },
    ],
  },
  {
    title: "サポート",
    links: [
      { label: "ヘルプセンター" },
      { label: "お問い合わせ" },
      { label: "利用ガイド" },
      { label: "稼働ステータス" },
    ],
  },
  {
    title: "会社",
    links: [
      { label: "会社概要" },
      { label: "採用情報" },
      { label: "お知らせ" },
    ],
  },
  {
    title: "ポリシー",
    links: [
      { label: "プライバシーポリシー" },
      { label: "利用規約" },
      { label: "特定商取引法" },
    ],
  },
]

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 18 18" fill="white">
    <path d="M14.2 1h2.5L10.8 7.8 17.5 17h-5.3l-3.9-5.1L4 17H1.5l6.3-7.2L1 1h5.4l3.5 4.6L14.2 1z"/>
  </svg>
)
const IGIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none"/>
  </svg>
)

export const Default: Story = {
  args: {
    logo: <span style={{ fontSize: 20, fontWeight: 800, color: "#F9AABF" }}>● ksk</span>,
    linkGroups: LINK_GROUPS,
    socialLinks: [
      { label: "X (Twitter)", href: "#", icon: <XIcon /> },
      { label: "Instagram", href: "#", icon: <IGIcon /> },
    ],
    copyright: "© 2026 KSK Inc. All rights reserved.",
  },
}

export const Minimal: Story = {
  args: {
    copyright: "© 2026 KSK Inc.",
    paymentIcons: ["VISA", "Master", "PayPay"],
  },
}
