import type { Meta, StoryObj } from "@storybook/react"
import { Add } from "iconsax-reactjs"
import { MobileFloatingActionButton } from "./mobile-floating-action-button"

const meta: Meta<typeof MobileFloatingActionButton> = {
  title: "Components/MobileFloatingActionButton",
  component: MobileFloatingActionButton,
}
export default meta

type Story = StoryObj<typeof MobileFloatingActionButton>

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
