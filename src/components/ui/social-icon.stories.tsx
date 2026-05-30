import type { Meta, StoryObj } from "@storybook/react"
import { SocialIcon, SOCIAL_ICON_PLATFORMS } from "./social-icon"

const meta: Meta<typeof SocialIcon> = {
  title: "Components/SocialIcon",
  component: SocialIcon,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
}
export default meta
type Story = StoryObj<typeof SocialIcon>

export const Default: Story = {
  args: { platform: "github", size: 40 },
}

/** 収録済みの全プラットフォーム（既定 shape=original / tone=brand）。 */
export const AllPlatforms: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {SOCIAL_ICON_PLATFORMS.map((p) => (
        <div key={p} className="flex flex-col items-center gap-1 w-20">
          <SocialIcon platform={p} size={36} />
          <span className="typo-body-xs text-[var(--Text-Medium-Emphasis)]">{p}</span>
        </div>
      ))}
    </div>
  ),
}

/** tone: brand / mono(currentColor) / gray の比較（github）。 */
export const Tones: Story = {
  render: () => (
    <div className="flex items-center gap-6 text-[var(--Brand-Primary)]">
      <SocialIcon platform="github" tone="brand" size={36} />
      <SocialIcon platform="github" tone="mono" size={36} />
      <SocialIcon platform="github" tone="gray" size={36} />
    </div>
  ),
}

/** shape: original / square / rounded-square（spotify）。 */
export const Shapes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <SocialIcon platform="spotify" shape="original" size={40} />
      <SocialIcon platform="spotify" shape="square" size={40} />
      <SocialIcon platform="spotify" shape="rounded-square" size={40} />
    </div>
  ),
}
