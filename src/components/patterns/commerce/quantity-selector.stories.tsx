import type { Meta, StoryObj } from "@storybook/react"
import { QuantitySelector } from "./quantity-selector"
import * as React from "react"

const meta: Meta<typeof QuantitySelector> = { title: "Components/QuantitySelector", component: QuantitySelector }
export default meta
type Story = StoryObj<typeof QuantitySelector>

function Demo({ initVal = 1, ...props }: { initVal?: number } & Partial<React.ComponentProps<typeof QuantitySelector>>) {
  const [v, setV] = React.useState(initVal)
  return <QuantitySelector value={v} onChange={setV} {...props} />
}

export const Medium: Story = { render: () => <Demo /> }
export const Small: Story = { render: () => <Demo size="sm" /> }
export const WithTrash: Story = { render: () => <Demo showTrash onDelete={() => alert("削除")} /> }
export const Disabled: Story = { render: () => <QuantitySelector value={3} disabled /> }
