import type { Meta, StoryObj } from "@storybook/react"
import { Alert, AlertTitle, AlertDescription } from "./alert"

const meta = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "error", "warning", "inline-info", "inline-caution", "inline-warning"],
    },
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Info: Story = {
  args: { variant: "info" },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>お知らせ</AlertTitle>
      <AlertDescription>新しいバージョンが利用可能です。</AlertDescription>
    </Alert>
  ),
}

export const Success: Story = {
  args: { variant: "success" },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>送信完了</AlertTitle>
      <AlertDescription>フォームが正常に送信されました。</AlertDescription>
    </Alert>
  ),
}

export const Error: Story = {
  args: { variant: "error" },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>エラーが発生しました</AlertTitle>
      <AlertDescription>入力内容を確認してもう一度お試しください。</AlertDescription>
    </Alert>
  ),
}

export const Warning: Story = {
  args: { variant: "warning" },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>注意が必要です</AlertTitle>
      <AlertDescription>この操作は元に戻せません。</AlertDescription>
    </Alert>
  ),
}

export const InlineInfo: Story = {
  args: { variant: "inline-info" },
  render: (args) => (
    <Alert {...args}>
      <AlertDescription>送料無料の条件：3,000円以上のご注文</AlertDescription>
    </Alert>
  ),
}

export const InlineCaution: Story = {
  args: { variant: "inline-caution" },
  render: (args) => (
    <Alert {...args}>
      <AlertDescription>在庫が残りわずかです。お早めにお求めください。</AlertDescription>
    </Alert>
  ),
}

export const InlineWarning: Story = {
  args: { variant: "inline-warning" },
  render: (args) => (
    <Alert {...args}>
      <AlertDescription>クーポンは本日23:59まで有効です。</AlertDescription>
    </Alert>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-md">
      <Alert variant="success">
        <AlertTitle>成功</AlertTitle>
        <AlertDescription>操作が正常に完了しました。</AlertDescription>
      </Alert>
      <Alert variant="info">
        <AlertTitle>情報</AlertTitle>
        <AlertDescription>新しい機能が追加されました。</AlertDescription>
      </Alert>
      <Alert variant="error">
        <AlertTitle>エラー</AlertTitle>
        <AlertDescription>処理に失敗しました。再試行してください。</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <AlertTitle>警告</AlertTitle>
        <AlertDescription>この操作は取り消せません。</AlertDescription>
      </Alert>
      <Alert variant="inline-info">
        <AlertDescription>インライン情報メッセージ</AlertDescription>
      </Alert>
      <Alert variant="inline-caution">
        <AlertDescription>インライン注意メッセージ</AlertDescription>
      </Alert>
      <Alert variant="inline-warning">
        <AlertDescription>インライン警告メッセージ</AlertDescription>
      </Alert>
    </div>
  ),
}
