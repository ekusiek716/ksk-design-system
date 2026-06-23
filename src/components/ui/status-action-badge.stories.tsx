import type { Meta, StoryObj } from "@storybook/react"
import { StatusActionBadge } from "./status-action-badge"

const meta: Meta<typeof StatusActionBadge> = {
  title: "Components/StatusActionBadge",
  component: StatusActionBadge,
}
export default meta

type Story = StoryObj<typeof StatusActionBadge>

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <StatusActionBadge state="syncing" label="同期中" />
      <StatusActionBadge state="success" label="保存済み" />
      <StatusActionBadge state="pending" label="未同期" count={3} />
      <StatusActionBadge state="offline" label="オフライン" />
      <StatusActionBadge state="error" label="同期エラー" count={2} />
    </div>
  ),
}

export const Actionable: Story = {
  render: () => (
    <StatusActionBadge
      state="pending"
      label="未同期を同期"
      count={4}
      onClick={() => {}}
    />
  ),
}

export const Compact: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <StatusActionBadge state="syncing" label="同期中" compact />
      <StatusActionBadge state="pending" label="未同期" count={8} compact />
      <StatusActionBadge state="error" label="同期エラー" count={2} compact />
    </div>
  ),
}
