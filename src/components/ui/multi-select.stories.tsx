import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { FormField } from "../patterns/form-field"
import { MultiSelect } from "./multi-select"

const meta: Meta<typeof MultiSelect> = {
  title: "Components/MultiSelect",
  component: MultiSelect,
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof MultiSelect>

const skills = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue.js" },
  { value: "angular", label: "Angular" },
  { value: "ts", label: "TypeScript" },
  { value: "node", label: "Node.js" },
  { value: "python", label: "Python" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
]

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState<string[]>(["react", "ts"])
    return (
      <div className="w-80">
        <MultiSelect options={skills} value={value} onChange={setValue} placeholder="スキルを選択" />
        <p className="mt-2 typo-body-sm text-[var(--Text-Medium-Emphasis)]">選択: {value.join(", ") || "なし"}</p>
      </div>
    )
  },
}

/** issue #426: 可視ラベルを置けない文脈（テーブルセル等）向けに triggerLabel で SR 向けラベルを渡す */
export const WithTriggerLabel: Story = {
  render: () => {
    const [value, setValue] = React.useState<string[]>([])
    return (
      <div className="w-80">
        <MultiSelect
          options={skills}
          value={value}
          onChange={setValue}
          placeholder="スキルを選択"
          triggerLabel="得意なスキル"
        />
        <p className="mt-2 typo-body-sm text-[var(--Text-Medium-Emphasis)]">選択: {value.join(", ") || "なし"}</p>
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
    <div className="w-80">
      <FormField label="スキル" error="1つ以上選択してください">
        <MultiSelect options={skills} placeholder="スキルを選択" />
      </FormField>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", { name: "スキルを選択" })
    await expect(trigger).toHaveAttribute("aria-invalid", "true")
    await expect(trigger.getAttribute("aria-describedby")).toBeTruthy()
    await expect(getComputedStyle(trigger).borderTopColor).toBe(cautionBorderColor())
  },
}

/**
 * クリアボタンは選択が空になると消える。押した直後にフォーカスが body に落ちず、
 * トリガーへ戻ること（キーボード操作で位置を見失わない）。
 */
export const FocusReturnsToTriggerAfterClear: Story = {
  tags: ["interaction", "!autodocs"],
  render: () => {
    const [value, setValue] = React.useState<string[]>(["react", "ts"])
    return (
      <div className="w-80">
        <MultiSelect options={skills} value={value} onChange={setValue} placeholder="スキルを選択" />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const clear = canvas.getByRole("button", { name: "選択をクリア" })
    await userEvent.click(clear)
    await waitFor(() => expect(canvas.queryByRole("button", { name: "選択をクリア" })).not.toBeInTheDocument())
    const trigger = canvasElement.querySelector<HTMLButtonElement>('[data-slot="multi-select-trigger"]')!
    await expect(trigger).toHaveFocus()
  },
}
