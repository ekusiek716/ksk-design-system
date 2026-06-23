import type { Meta, StoryObj } from "@storybook/react"
import { More } from "iconsax-reactjs"
import { Button } from "@/components/ui/button"
import { StatusActionBadge } from "@/components/ui/status-action-badge"
import { MobileAppHeader } from "./mobile-app-header"

const meta: Meta<typeof MobileAppHeader> = {
  title: "Components/MobileAppHeader",
  component: MobileAppHeader,
}
export default meta

type Story = StoryObj<typeof MobileAppHeader>

export const WithStatusSlot: Story = {
  render: () => (
    <MobileAppHeader
      sticky={false}
      brand={<span className="typo-heading-md truncate">Prehanavi</span>}
      status={<StatusActionBadge state="offline" label="オフラインで編集中" asStatus />}
      compactStatus={<StatusActionBadge state="offline" label="オフラインで編集中" compact asStatus />}
      actions={
        <Button size="icon" variant="ghost" aria-label="メニュー">
          <More size={18} />
        </Button>
      }
    />
  ),
}

export const WithPendingCount: Story = {
  render: () => (
    <MobileAppHeader
      sticky={false}
      brand={<span className="typo-heading-md truncate">Project Logo</span>}
      status={<StatusActionBadge state="pending" label="未同期" count={12} />}
      compactStatus={<StatusActionBadge state="pending" label="未同期" count={12} compact />}
    />
  ),
}
