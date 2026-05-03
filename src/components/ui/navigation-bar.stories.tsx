import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { NavigationBar } from "./navigation-bar"

const meta: Meta<typeof NavigationBar> = {
  title: "Components/NavigationBar",
  component: NavigationBar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
}
export default meta
type Story = StoryObj<typeof NavigationBar>

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <div className="bg-[var(--Surface-Primary)]">
      <NavigationBar
        title="Aircraft Stats"
        leftIcon="back"
        onLeft={() => {}}
        onShare={() => {}}
      />
    </div>
  ),
}

export const WithCloseButton: Story = {
  render: () => (
    <div className="bg-[var(--Surface-Primary)]">
      <NavigationBar
        title="シート"
        leftIcon="close"
        onLeft={() => {}}
        onShare={() => {}}
      />
    </div>
  ),
}

export const TitleOnly: Story = {
  render: () => (
    <div className="bg-[var(--Surface-Primary)]">
      <NavigationBar
        title="設定"
        leftIcon="back"
        onLeft={() => {}}
      />
    </div>
  ),
}

export const CustomRightSlot: Story = {
  render: () => (
    <div className="bg-[var(--Surface-Primary)]">
      <NavigationBar
        title="ゲスト一覧"
        leftIcon="back"
        onLeft={() => {}}
        rightSlot={
          <button type="button" className="typo-label-md text-[var(--Text-Accent-Primary)] px-2 h-10">
            完了
          </button>
        }
      />
    </div>
  ),
}

// ─── Liquid Glass (iOS 26 over gradient) ─────────────────────────────────────

export const Glass: Story = {
  name: "Liquid Glass — over gradient",
  render: () => (
    <div
      className="relative h-[320px] rounded-2xl overflow-hidden"
      style={{ background: "linear-gradient(160deg, #a8c8f8 0%, #3b82f6 60%, #1e40af 100%)" }}
    >
      <NavigationBar
        title="Aircraft Stats"
        leftIcon="close"
        onLeft={() => {}}
        onShare={() => {}}
        glass
        transparent
      />
      <div className="px-5 pt-3 text-white">
        <p className="typo-label-sm opacity-70">Total Aircraft</p>
        <p className="typo-heading-xl">1</p>
        <p className="typo-body-sm opacity-60 mt-1">B787-9 · 14 hours</p>
      </div>
    </div>
  ),
}

export const GlassOverPhoto: Story = {
  name: "Liquid Glass — over photo tone",
  render: () => (
    <div
      className="relative h-[320px] rounded-2xl overflow-hidden"
      style={{ background: "linear-gradient(160deg, #fde68a 0%, #f59e0b 40%, #b45309 100%)" }}
    >
      <NavigationBar
        title="式場詳細"
        leftIcon="back"
        onLeft={() => {}}
        onShare={() => {}}
        glass
        transparent
      />
      <div className="px-5 pt-3 text-white">
        <p className="typo-heading-xl">グランドホテル</p>
        <p className="typo-body-sm opacity-70 mt-1">東京都渋谷区</p>
      </div>
    </div>
  ),
}
