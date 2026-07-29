import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { Combobox } from "./combobox"

const meta: Meta<typeof Combobox> = {
  title: "Components/Combobox",
  component: Combobox,
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof Combobox>

const prefectures = [
  { value: "tokyo", label: "東京都" },
  { value: "osaka", label: "大阪府" },
  { value: "kanagawa", label: "神奈川県" },
  { value: "aichi", label: "愛知県" },
  { value: "saitama", label: "埼玉県" },
  { value: "chiba", label: "千葉県" },
  { value: "hyogo", label: "兵庫県" },
  { value: "hokkaido", label: "北海道" },
  { value: "fukuoka", label: "福岡県" },
  { value: "shizuoka", label: "静岡県" },
]

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState("")
    return (
      <div className="w-64">
        <Combobox
          options={prefectures}
          value={value}
          onChange={setValue}
          placeholder="都道府県を選択"
          searchPlaceholder="検索..."
        />
        {value && <p className="mt-2 typo-body-sm text-[var(--Text-Medium-Emphasis)]">選択: {value}</p>}
      </div>
    )
  },
}

// ─────────────────────────────────────────────────────────────
// interaction 回帰テスト（issue #256 / `npm run test:interaction`）
// ─────────────────────────────────────────────────────────────

/** 開いて検索で絞り込み、選択すると値が反映されてポップオーバーが閉じる。 */
export const FiltersAndSelects: Story = {
  tags: ["interaction", "!autodocs"],
  render: () => {
    const [value, setValue] = React.useState("")
    return (
      <div className="w-64 p-6">
        <Combobox
          options={prefectures}
          value={value}
          onChange={setValue}
          placeholder="都道府県を選択"
          searchPlaceholder="検索..."
        />
        <p data-testid="value">{value}</p>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)

    const trigger = canvas.getByRole("button", { name: "都道府県を選択" })
    await expect(trigger).toHaveAttribute("aria-expanded", "false")

    await userEvent.click(trigger)
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "true"))

    // 開くと検索 input にフォーカスが移る
    const search = await body.findByPlaceholderText("検索...")
    await waitFor(() => expect(search).toHaveFocus())

    // 絞り込み
    await userEvent.type(search, "大阪")
    await waitFor(async () => {
      const options = await body.findAllByRole("option")
      await expect(options).toHaveLength(1)
    })

    await userEvent.click(body.getByRole("option", { name: /大阪府/ }))

    await waitFor(() => expect(canvas.getByTestId("value")).toHaveTextContent("osaka"))
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
  },
}

export const WithDisabledOption: Story = {
  render: () => {
    const [value, setValue] = React.useState("")
    return (
      <div className="w-64">
        <Combobox
          options={[
            { value: "a", label: "選択肢 A" },
            { value: "b", label: "選択肢 B（無効）", disabled: true },
            { value: "c", label: "選択肢 C" },
          ]}
          value={value}
          onChange={setValue}
        />
      </div>
    )
  },
}
