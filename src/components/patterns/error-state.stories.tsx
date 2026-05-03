/**
 * @file ErrorState のストーリー
 * @description エラー状態コンポーネント。デフォルトの再試行ボタン付き
 */
import type { Meta, StoryObj } from "@storybook/react"
import { ErrorState } from "./error-state"

const meta: Meta<typeof ErrorState> = {
  title: "Components/ErrorState",
  component: ErrorState,
}
export default meta

type Story = StoryObj<typeof ErrorState>

export const DefaultWithRetry: Story = {
  args: {
    onRetry: () => alert("再試行"),
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" /><path d="M24 14V26M24 32V33" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
    ),
  },
}

export const CustomMessages: Story = {
  args: {
    title: "ネットワークエラー",
    description: "インターネット接続を確認してください。",
    onRetry: () => alert("再試行"),
    retryLabel: "再接続する",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M8 24C8 15.2 15.2 8 24 8C32.8 8 40 15.2 40 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M40 24C40 32.8 32.8 40 24 40C15.2 40 8 32.8 8 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" /></svg>
    ),
  },
}

export const WithoutRetry: Story = {
  args: {
    title: "権限がありません",
    description: "このページを閲覧する権限がありません。管理者にお問い合わせください。",
  },
}
