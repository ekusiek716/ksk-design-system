import type { Meta, StoryObj } from "@storybook/react"
import { ImageGallery } from "./image-gallery"

const meta: Meta<typeof ImageGallery> = {
  title: "Components/ImageGallery",
  component: ImageGallery,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof ImageGallery>

// プレースホルダー画像（picsum: seed 固定で安定・中立な汎用写真）
const IMAGES = [
  { src: "https://picsum.photos/seed/gallery-1/400/300", alt: "ギャラリー画像 1" },
  { src: "https://picsum.photos/seed/gallery-2/400/300", alt: "ギャラリー画像 2" },
  { src: "https://picsum.photos/seed/gallery-3/400/300", alt: "ギャラリー画像 3" },
  { src: "https://picsum.photos/seed/gallery-4/400/300", alt: "ギャラリー画像 4" },
]

export const Thumbnail: Story = {
  render: () => (
    <div className="w-72">
      <ImageGallery images={IMAGES} indicatorType="thumbnail" />
    </div>
  ),
}

export const Dot: Story = {
  render: () => (
    <div className="w-72">
      <ImageGallery images={IMAGES} indicatorType="dot" />
    </div>
  ),
}

export const Square: Story = {
  render: () => (
    <div className="w-64">
      <ImageGallery images={IMAGES} indicatorType="dot" aspectRatio="square" />
    </div>
  ),
}

export const Single: Story = {
  render: () => (
    <div className="w-72">
      <ImageGallery images={[IMAGES[0]]} />
    </div>
  ),
}
