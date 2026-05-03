import type { Meta, StoryObj } from "@storybook/react"
import { FileUpload } from "./file-upload"

const meta: Meta<typeof FileUpload> = {
  title: "Patterns/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof FileUpload>

export const Default: Story = {
  args: {
    accept: "image/*,.pdf",
    maxSize: 5 * 1024 * 1024,
  },
}

export const Multiple: Story = {
  args: {
    multiple: true,
    maxFiles: 5,
    accept: ".pdf,.doc,.docx",
    maxSize: 10 * 1024 * 1024,
  },
}
