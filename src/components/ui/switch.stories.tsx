/**
 * @file Switch のストーリー
 * @description トグルスイッチコンポーネント。デフォルト、チェック済み、無効状態、ラベル付きを網羅
 */
import type { Meta, StoryObj } from "@storybook/react"
import { Switch } from "./switch"
import { Label } from "./label"

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
}
export default meta

type Story = StoryObj<typeof Switch>

// このコンポーネント単体のショーケースにはラベルテキストが無いため、
// axe: button-name 対策で aria-label を明示する（実利用では Label 併記が前提）。
export const Default: Story = {
  args: { "aria-label": "サンプル" },
}

export const Checked: Story = {
  args: { defaultChecked: true, "aria-label": "サンプル" },
}

export const Disabled: Story = {
  args: { disabled: true, "aria-label": "サンプル" },
}

export const DisabledChecked: Story = {
  args: { disabled: true, defaultChecked: true, "aria-label": "サンプル" },
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
