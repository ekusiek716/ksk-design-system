import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { FormField } from "../patterns/form-field"
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

const stations = [
  { value: "ichigaya", label: "市ケ谷", keywords: ["いちがや"] },
  { value: "kasumigaseki", label: "霞ケ関", keywords: ["かすみがせき"] },
  { value: "shibuya", label: "渋谷", keywords: ["しぶや"] },
  { value: "shinjuku", label: "新宿", keywords: ["しんじゅく"] },
  { value: "ikebukuro", label: "池袋（休止中）", keywords: ["いけぶくろ"], disabled: true },
]

/**
 * 検索用の別名（keywords）と表記ゆれ。読み（しぶや）や「市ヶ谷」「霞が関」でも当たる。
 * triggerLabel は読み上げ用の補足で、選んだ値と合わせて「駅を選ぶ 渋谷」と読まれる（issue #783）。
 */
export const WithKeywords: Story = {
  render: () => {
    const [value, setValue] = React.useState("")
    return (
      <div className="w-64">
        <Combobox
          options={stations}
          value={value}
          onChange={setValue}
          placeholder="駅を選択"
          searchPlaceholder="駅名・読みで検索"
          triggerLabel="駅を選ぶ"
        />
      </div>
    )
  },
}

/** 検索欄で読みを打ち、矢印キーと Enter だけで選べる。選んだ値がトリガーの読み上げ名に入る。 */
export const KeyboardSelect: Story = {
  tags: ["interaction", "!autodocs"],
  render: () => {
    const [value, setValue] = React.useState("")
    return (
      <div className="w-64 p-6">
        <Combobox
          options={stations}
          value={value}
          onChange={setValue}
          placeholder="駅を選択"
          searchPlaceholder="駅名・読みで検索"
          triggerLabel="駅を選ぶ"
        />
        <p data-testid="value">{value}</p>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)

    const trigger = canvas.getByRole("button", { name: "駅を選ぶ" })
    await userEvent.click(trigger)
    const search = await body.findByRole("combobox")
    await waitFor(() => expect(search).toHaveFocus())

    // 表記ゆれ: 「霞が関」で「霞ケ関」が当たり、先頭がアクティブになる
    await userEvent.type(search, "霞が関")
    await waitFor(async () => {
      await expect(body.getAllByRole("option").map((o) => o.textContent)).toEqual(["霞ケ関"])
    })
    await userEvent.clear(search)

    // 読み + 矢印 + Enter
    await userEvent.type(search, "し")
    await waitFor(() => expect(body.getAllByRole("option")).toHaveLength(2))
    await userEvent.keyboard("{ArrowDown}")
    const activeId = search.getAttribute("aria-activedescendant")
    await expect(activeId).toBeTruthy()
    await expect(document.getElementById(activeId!)).toHaveTextContent("新宿")
    await userEvent.keyboard("{Enter}")

    await waitFor(() => expect(canvas.getByTestId("value")).toHaveTextContent("shinjuku"))
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    await expect(canvas.getByRole("button", { name: "駅を選ぶ 新宿" })).toBe(trigger)
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

// --Border-Caution の解決後の色（FormField の error で出るエラー枠の期待色）
const cautionBorderColor = () => {
  const probe = document.createElement("div")
  probe.style.cssText = "border: 1px solid var(--Border-Caution); position: absolute;"
  document.body.appendChild(probe)
  const color = getComputedStyle(probe).borderTopColor
  probe.remove()
  return color
}

/** FormField の error がトリガーに届き、エラー枠（赤枠）になる。 */
export const InvalidInFormField: Story = {
  tags: ["interaction", "!autodocs"],
  render: () => (
    <div className="w-64">
      <FormField label="都道府県" error="都道府県を選択してください">
        <Combobox options={prefectures} placeholder="都道府県を選択" />
      </FormField>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", { name: "都道府県を選択" })
    await expect(trigger).toHaveAttribute("aria-invalid", "true")
    await expect(trigger.getAttribute("aria-describedby")).toBeTruthy()
    await expect(getComputedStyle(trigger).borderTopColor).toBe(cautionBorderColor())
  },
}
