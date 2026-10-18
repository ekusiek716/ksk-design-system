import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { KskLabelsProvider } from "../../ui/ksk-labels"
import { KebabMenu } from "./kebab-menu"

const meta: Meta<typeof KebabMenu> = { title: "Components/KebabMenu", component: KebabMenu }
export default meta
type Story = StoryObj<typeof KebabMenu>

export const Default: Story = {
  render: () => (
    <div className="flex justify-end p-8">
      <KebabMenu items={[
        { label: "編集" },
        { label: "複製" },
        { label: "削除", destructive: true },
      ]} />
    </div>
  ),
}

export const WithMetadata: Story = {
  render: () => (
    <div className="flex justify-end p-8">
      <KebabMenu items={[
        { label: "編集", description: "詳細を開いて内容を変更", shortcut: "E" },
        { label: "複製", shortcut: "D" },
        { type: "separator" },
        { label: "アーカイブ", description: "一覧から非表示にする", disabled: true },
        { label: "削除", destructive: true, shortcut: "Del" },
      ]} />
    </div>
  ),
}

/**
 * 読み上げ名は KskLabels の `menu`（issue #752）。Provider 無しは「メニュー」、`locale="en"` は「Menu」、
 * `menuLabel` を渡すとそれが最優先。見た目は 32px のまま、透明な before で押せる範囲を 44px に広げる。
 */
export const LabelsAndHitArea: Story = {
  tags: ["interaction"],
  render: () => (
    <div className="flex items-center justify-end gap-6 p-8">
      <KebabMenu items={[{ label: "編集" }]} />
      <KskLabelsProvider locale="en">
        <KebabMenu items={[{ label: "Edit" }]} />
      </KskLabelsProvider>
      <KebabMenu items={[{ label: "編集" }]} menuLabel="行の操作" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const ja = canvas.getByRole("button", { name: "メニュー" })
    await expect(canvas.getByRole("button", { name: "Menu" })).toBeInTheDocument()
    await expect(canvas.getByRole("button", { name: "行の操作" })).toBeInTheDocument()
    // 押せる範囲（before）は見た目の箱より大きく、44px 以上
    const rect = ja.getBoundingClientRect()
    const hit = getComputedStyle(ja, "::before")
    await expect(parseFloat(hit.width)).toBeGreaterThan(rect.width)
    await expect(parseFloat(hit.height)).toBeGreaterThan(rect.height)
    await expect(parseFloat(hit.width)).toBeGreaterThanOrEqual(44)
    await expect(parseFloat(hit.height)).toBeGreaterThanOrEqual(44)
    await userEvent.click(ja)
    await expect(await within(document.body).findByRole("menuitem", { name: "編集" })).toBeInTheDocument()
    await userEvent.keyboard("{Escape}")
    // 閉じ終わる（背景の aria-hidden が外れる）まで待ってから a11y 検査へ渡す
    await waitFor(() => expect(within(document.body).queryByRole("menu")).toBeNull())
    await waitFor(() => expect(document.querySelector("[data-aria-hidden]")).toBeNull())
    await expect(ja).toHaveFocus()
  },
}
