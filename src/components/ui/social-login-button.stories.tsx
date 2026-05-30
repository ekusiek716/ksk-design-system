import type { Meta, StoryObj } from "@storybook/react"
import { SocialLoginButton } from "./social-login-button"
import { LINE_OFFICIAL_LOGO_DATA_URI } from "./line-logo-asset"

const meta: Meta<typeof SocialLoginButton> = {
  title: "Components/SocialLoginButton",
  component: SocialLoginButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof SocialLoginButton>

export const Line: Story = { args: { provider: "line" } }
export const Google: Story = { args: { provider: "google" } }
export const Apple: Story = { args: { provider: "apple" } }
export const Amazon: Story = { args: { provider: "amazon" } }

export const AllProviders: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      <SocialLoginButton provider="line" fullWidth />
      <SocialLoginButton provider="google" fullWidth />
      <SocialLoginButton provider="apple" fullWidth />
      <SocialLoginButton provider="amazon" fullWidth />
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      <SocialLoginButton provider="line" loading fullWidth />
      <SocialLoginButton provider="google" loading fullWidth />
    </div>
  ),
}
