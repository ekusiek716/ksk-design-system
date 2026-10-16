import type { Meta, StoryObj } from "@storybook/react"
import { Container } from "./container"

const meta: Meta<typeof Container> = {
  title: "Components/Layout/Container",
  component: Container,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof Container>

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 py-8">
      {(["narrow", "page", "wide", "fluid"] as const).map((size) => (
        <Container key={size} size={size}>
          <div className="rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-6">
            <p className="typo-label-md text-[var(--Text-High-Emphasis)]">{size}</p>
          </div>
        </Container>
      ))}
    </div>
  ),
}

/**
 * gutter="fluid"（issue #711）: 画面幅で 16〜28px に伸び縮みする左右余白。
 * `--Container-Gutter-Fluid`（既定 clamp(1rem, 4vw, 1.75rem)）で上書きできる。
 * ChipFilterBar gutter="fluid" と同じ変数を読むので、絞り込みバーと本文の左端がそろう。
 */
export const FluidGutter: Story = {
  render: () => (
    <div className="flex flex-col gap-4 py-8">
      {(["tight", "fluid", "default"] as const).map((gutter) => (
        <Container key={gutter} size="fluid" gutter={gutter}>
          <div className="rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-4">
            <p className="typo-label-md text-[var(--Text-High-Emphasis)]">gutter=&quot;{gutter}&quot;</p>
          </div>
        </Container>
      ))}
    </div>
  ),
}
