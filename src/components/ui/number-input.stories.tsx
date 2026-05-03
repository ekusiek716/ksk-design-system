import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { NumberInput } from "./number-input"

const meta: Meta<typeof NumberInput> = {
  title: "Components/NumberInput",
  component: NumberInput,
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof NumberInput>

function Demo(props: Partial<React.ComponentProps<typeof NumberInput>>) {
  const [v, setV] = React.useState(props.value ?? 0)
  return <div className="w-48"><NumberInput {...props} value={v} onChange={setV} /></div>
}

export const Default: Story = { render: () => <Demo value={0} /> }

export const WithMinMax: Story = {
  render: () => <Demo value={5} min={0} max={10} />,
}

export const WithStep: Story = {
  render: () => <Demo value={100} step={100} min={0} max={10000} />,
}

export const CurrencyFormat: Story = {
  render: () => (
    <Demo
      value={1000}
      step={100}
      min={0}
      format={(v) => `¥${v.toLocaleString("ja-JP")}`}
    />
  ),
}

export const Disabled: Story = { render: () => <Demo value={5} disabled /> }
