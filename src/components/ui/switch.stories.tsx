/**
 * @file Switch のストーリー
 * @description トグルスイッチコンポーネント。デフォルト、チェック済み、無効状態、ラベル付きを網羅
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Switch } from "./switch"
import { Label } from "./label"

const meta: Meta<typeof Switch> = {
  title: "UI/Switch",
  component: Switch,
}
export default meta

type Story = StoryObj<typeof Switch>

export const Default: Story = {
  args: {},
}

export const Checked: Story = {
  args: { defaultChecked: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const DisabledChecked: Story = {
  args: { disabled: true, defaultChecked: true },
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="airplane" />
      <Label htmlFor="airplane">機内モード</Label>
    </div>
  ),
}

export const SettingsList: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="wifi">Wi-Fi</Label>
        <Switch id="wifi" defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="bluetooth">Bluetooth</Label>
        <Switch id="bluetooth" />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="nfc">NFC</Label>
        <Switch id="nfc" disabled />
      </div>
    </div>
  ),
}
