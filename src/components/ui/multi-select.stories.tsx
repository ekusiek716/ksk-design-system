import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
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
