import type { Meta, StoryObj } from "@storybook/react"
import { ImageCarousel } from "./image-carousel"

const meta: Meta<typeof ImageCarousel> = { title: "Components/ImageCarousel", component: ImageCarousel }
export default meta
type Story = StoryObj<typeof ImageCarousel>

const images = Array.from({ length: 5 }, (_, i) => ({
  src: `https://picsum.photos/seed/banner${i}/800/400`,
  alt: `バナー ${i + 1}`,
}))

export const Banner: Story = { render: () => <ImageCarousel images={images} /> }
export const Square: Story = { render: () => <ImageCarousel images={images} aspectRatio="square" /> }
export const Video: Story = { render: () => <ImageCarousel images={images} aspectRatio="video" /> }
export const AutoPlay: Story = { render: () => <ImageCarousel images={images} autoPlay={3000} /> }
