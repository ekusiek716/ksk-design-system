import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { CompactFilePicker, ImageAttachmentPicker, type ImageAttachment } from "./compact-file-picker"

const meta: Meta<typeof CompactFilePicker> = {
  title: "Components/CompactFilePicker",
  component: CompactFilePicker,
}
export default meta

type Story = StoryObj<typeof CompactFilePicker>

const initialImages: ImageAttachment[] = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=240&h=240&fit=crop",
    alt: "山の写真",
    name: "cover.jpg",
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=240&h=240&fit=crop",
    alt: "湖の写真",
    name: "memo.jpg",
  },
]

export const SingleImageReplacement: Story = {
  render: () => (
    <div className="max-w-md rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-4">
      <CompactFilePicker
        accept="image/*"
        label="プロフィール画像"
        description="1枚だけ差し替えます"
        triggerLabel="画像を選択"
      />
    </div>
  ),
}

export const MultiImageAttachments: Story = {
  render: () => {
    const [images, setImages] = React.useState(initialImages)
    return (
      <div className="max-w-md rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-4">
        <ImageAttachmentPicker
          multiple
          images={images}
          onRemove={(id) => setImages((current) => current.filter((image) => image.id !== id))}
        />
      </div>
    )
  },
}

export const ListPreview: Story = {
  render: () => (
    <div className="max-w-md rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-4">
      <ImageAttachmentPicker
        images={initialImages}
        previewVariant="list"
        onRemove={() => undefined}
      />
    </div>
  ),
}
