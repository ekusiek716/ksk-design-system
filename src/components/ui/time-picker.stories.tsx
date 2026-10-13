import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { expect, within } from "storybook/test"
import { FormField } from "../patterns/form-field"
import { TimePicker } from "./time-picker"

const meta: Meta<typeof TimePicker> = {
  title: "Components/TimePicker",
  component: TimePicker,
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof TimePicker>

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState("09:00")
    return (
      <div className="w-48">
        <TimePicker value={value} onChange={setValue} />
        <p className="mt-2 typo-body-sm text-[var(--Text-Medium-Emphasis)]">選択: {value}</p>
      </div>
    )
  },
}

export const Step15min: Story = {
  name: "15分刻み",
  render: () => {
    const [value, setValue] = React.useState("10:00")
    return (
      <div className="w-48">
        <TimePicker value={value} onChange={setValue} minuteStep={15} />
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
    <div className="w-72">
      <FormField label="時刻を" error="入力してください">
        <TimePicker />
      </FormField>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", { name: "時刻を選択" })
    await expect(trigger).toHaveAttribute("aria-invalid", "true")
    await expect(trigger.getAttribute("aria-describedby")).toBeTruthy()
    await expect(getComputedStyle(trigger).borderTopColor).toBe(cautionBorderColor())
  },
}
