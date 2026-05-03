import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
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
