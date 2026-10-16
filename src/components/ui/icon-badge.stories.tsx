import type { Meta, StoryObj } from "@storybook/react"
import { Gift, Heart, Star1 } from "iconsax-reactjs"

import { IconBadge } from "./icon-badge"

const meta: Meta<typeof IconBadge> = {
  title: "Components/IconBadge",
  component: IconBadge,
  tags: ["autodocs"],
  args: {
    children: <Gift />,
  },
}

export default meta

type Story = StoryObj<typeof IconBadge>

export const Medium: Story = {}

export const MediumLarge: Story = {
  args: {
    size: "ml",
    children: <Heart />,
  },
}

export const Large: Story = {
  args: {
    size: "lg",
    children: <Star1 />,
  },
}

/** tone: 情報・成功・注意・警告の円アイコン（面とアイコン色が対で変わる）。 */
export const Tones: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <IconBadge tone="accent"><Gift /></IconBadge>
      <IconBadge tone="info"><Heart /></IconBadge>
      <IconBadge tone="success"><Star1 /></IconBadge>
      <IconBadge tone="warning"><Gift /></IconBadge>
      <IconBadge tone="caution"><Heart /></IconBadge>
    </div>
  ),
}

export const InCardFlow: Story = {
  render: () => (
    <div className="flex max-w-xs flex-col gap-4 rounded-xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-6">
      <IconBadge size="ml">
        <Gift />
      </IconBadge>
      <div>
        <h3 className="typo-heading-md text-[var(--Text-High-Emphasis)]">
          会員限定特典
        </h3>
        <p className="mt-1 typo-body-sm text-[var(--Text-Medium-Emphasis)]">
          外側余白を持たないため、Card の gap だけで縦リズムを管理できます。
        </p>
      </div>
    </div>
  ),
}
