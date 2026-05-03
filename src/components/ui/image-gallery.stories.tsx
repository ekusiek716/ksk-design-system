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

// Unsplash placeholder images (cake/pastry themed colors)
const IMAGES = [
  { src: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop", alt: "ウェディングケーキ 1" },
  { src: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop", alt: "ウェディングケーキ 2" },
  { src: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop", alt: "ウェディングケーキ 3" },
  { src: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop", alt: "ウェディングケーキ 4" },
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
