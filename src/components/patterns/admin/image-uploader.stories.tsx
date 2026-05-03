import type { Meta, StoryObj } from "@storybook/react"
import { ImageUploader } from "./image-uploader"

const meta: Meta<typeof ImageUploader> = { title: "Components/Admin/ImageUploader", component: ImageUploader }
export default meta
type Story = StoryObj<typeof ImageUploader>

export const Default: Story = {
  render: () => (
    <ImageUploader
      images={[
        { src: "https://picsum.photos/seed/up1/400/400", alt: "商品画像1" },
        { src: "https://picsum.photos/seed/up2/400/400", alt: "商品画像2" },
        { src: "https://picsum.photos/seed/up3/400/400", alt: "商品画像3" },
      ]}
      onAdd={() => {}}
      onRemove={() => {}}
    />
  ),
}

export const Empty: Story = {
  render: () => <ImageUploader onAdd={() => {}} />,
}
