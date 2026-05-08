import type { Meta, StoryObj } from "@storybook/react"
import { SyncStatusBadge } from "./sync-status-badge"

const meta: Meta<typeof SyncStatusBadge> = {
  title: "Components/SyncStatusBadge",
  component: SyncStatusBadge,
  parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof SyncStatusBadge>

export const Syncing: Story = { args: { state: "syncing" } }
export const Success: Story = { args: { state: "success" } }
export const Error: Story = {
  args: { state: "error", errorCount: 3, onRetry: () => alert("再試行") },
}
export const Offline: Story = { args: { state: "offline" } }
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-3 items-start">
      <SyncStatusBadge state="syncing" />
      <SyncStatusBadge state="success" />
      <SyncStatusBadge state="error" errorCount={2} onRetry={() => {}} />
      <SyncStatusBadge state="offline" />
    </div>
  ),
}
