import type { Meta, StoryObj } from "@storybook/react"
import { NotificationList } from "./notification-list"

const meta: Meta<typeof NotificationList> = { title: "Admin/NotificationList", component: NotificationList }
export default meta
type Story = StoryObj<typeof NotificationList>

const notifications = [
  { id: "1", message: "新しい注文が入りました", date: "2026/4/7", isUnread: true, href: "#" },
  { id: "2", message: "在庫が残り5個になりました", date: "2026/4/6", isUnread: true, href: "#" },
  { id: "3", message: "レビューが投稿されました", date: "2026/4/5", href: "#" },
  { id: "4", message: "出荷完了しました", date: "2026/4/4", href: "#" },
]

export const Vertical: Story = { render: () => <NotificationList notifications={notifications} /> }
export const Horizontal: Story = { render: () => <NotificationList notifications={notifications} variant="horizontal" /> }
export const Empty: Story = { render: () => <NotificationList notifications={[]} /> }
