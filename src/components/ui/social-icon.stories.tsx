import type { Meta, StoryObj } from "@storybook/react"
import {
  SocialIcon,
  SOCIAL_ICON_PLATFORMS,
  SOCIAL_ICON_LABELS,
} from "./social-icon"

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

/** 収録済みの全プラットフォーム（ブランドカラー）。 */
export const AllPlatforms: Story = {
  render: () => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-4">
      {SOCIAL_ICON_PLATFORMS.map((p) => (
        <div
          key={p}
          className="flex flex-col items-center gap-2 rounded-lg border border-[var(--Border-Low-Emphasis)] p-3 text-center"
        >
          <SocialIcon platform={p} size={32} />
          <span className="typo-body-xs text-[var(--Text-Medium-Emphasis)] leading-tight">
            {SOCIAL_ICON_LABELS[p]}
          </span>
        </div>
      ))}
    </div>
  ),
}

/** 全プラットフォームの mono（単色 / currentColor）表示。テキスト色に追従する。 */
export const AllMono: Story = {
  render: () => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-4 text-[var(--Text-High-Emphasis)]">
      {SOCIAL_ICON_PLATFORMS.map((p) => (
        <div
          key={p}
          className="flex flex-col items-center gap-2 rounded-lg border border-[var(--Border-Low-Emphasis)] p-3 text-center"
        >
          <SocialIcon platform={p} tone="mono" size={32} />
          <span className="typo-body-xs text-[var(--Text-Medium-Emphasis)] leading-tight">
            {SOCIAL_ICON_LABELS[p]}
          </span>
        </div>
      ))}
    </div>
  ),
}

/** tone: brand / mono(currentColor) の比較（github）。 */
export const Tones: Story = {
  render: () => (
    <div className="flex items-center gap-6 text-[var(--Brand-Primary)]">
      <SocialIcon platform="github" tone="brand" size={36} />
      <SocialIcon platform="github" tone="mono" size={36} />
    </div>
  ),
}
