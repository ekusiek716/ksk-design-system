import type { Meta, StoryObj } from "@storybook/react"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "./hover-card"
import { Button } from "./button"
import { Avatar, AvatarFallback } from "./avatar"

const meta = {
  title: "Components/HoverCard",
  component: HoverCard,
  tags: ["autodocs"],
} satisfies Meta<typeof HoverCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="flex justify-center p-16">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link">@ksk_designsystem</Button>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="flex gap-3">
            <Avatar>
              <AvatarFallback>KS</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <p className="typo-label-md">KSK Design System</p>
              <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">
                React + Tailwind CSS v4 のデザインシステム
              </p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
}
