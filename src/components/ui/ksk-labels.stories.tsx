/**
 * @file KskLabelsProvider のストーリー
 * @description DS 部品の既定文言（スキップリンク・必須/任意・閉じる等）を一括で切り替える
 * Provider（issue #723）。英語のアプリはルートに `<KskLabelsProvider locale="en">` を 1 回置く。
 */
import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { KskLabelsProvider } from "./ksk-labels"
import { Input } from "./input"
import { FormField } from "../patterns/form-field"

const meta: Meta<typeof KskLabelsProvider> = {
  title: "Components/KskLabelsProvider",
  component: KskLabelsProvider,
}
export default meta

type Story = StoryObj<typeof KskLabelsProvider>

const Fields = () => (
  <div className="flex max-w-sm flex-col gap-4 p-4">
    <FormField label="Name" htmlFor="ksk-labels-name" requiredStyle="pill" required>
      <Input id="ksk-labels-name" />
    </FormField>
    <FormField label="Nickname" htmlFor="ksk-labels-nick" requiredStyle="pill">
      <Input id="ksk-labels-nick" />
    </FormField>
  </div>
)

/** Provider 無し: 従来どおり日本語（必須 / 任意） */
export const Default: Story = {
  render: () => <Fields />,
}

/** `locale="en"`: 部品ごとに文言を渡さなくても英語（Required / Optional） */
export const English: Story = {
  tags: ["interaction"],
  render: () => (
    <KskLabelsProvider locale="en">
      <Fields />
    </KskLabelsProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Required")).toBeInTheDocument()
    await expect(canvas.getByText("Optional")).toBeInTheDocument()
  },
}

/** `labels` で i18n の文言に個別に差し替える（locale の既定より優先） */
export const CustomLabels: Story = {
  render: () => (
    <KskLabelsProvider locale="en" labels={{ required: "Must", optional: "May" }}>
      <Fields />
    </KskLabelsProvider>
  ),
}
