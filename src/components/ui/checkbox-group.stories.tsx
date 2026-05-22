import type { Meta, StoryObj } from "@storybook/react"
import { CheckboxGroup, CheckboxGroupItem } from "./checkbox-group"

const meta = {
  title: "Components/CheckboxGroup",
  component: CheckboxGroup,
  tags: ["autodocs"],
} satisfies Meta<typeof CheckboxGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <CheckboxGroup label="配送方法" className="max-w-sm">
      <CheckboxGroupItem defaultChecked>通常配送</CheckboxGroupItem>
      <CheckboxGroupItem>速達配送</CheckboxGroupItem>
      <CheckboxGroupItem>コンビニ受け取り</CheckboxGroupItem>
      <CheckboxGroupItem>置き配</CheckboxGroupItem>
    </CheckboxGroup>
  ),
}

export const Required: Story = {
  render: () => (
    <CheckboxGroup label="興味のあるトピック" required helpText="複数選択可" className="max-w-sm">
      <CheckboxGroupItem>テクノロジー</CheckboxGroupItem>
      <CheckboxGroupItem>ビジネス</CheckboxGroupItem>
      <CheckboxGroupItem>デザイン</CheckboxGroupItem>
      <CheckboxGroupItem>マーケティング</CheckboxGroupItem>
    </CheckboxGroup>
  ),
}

export const WithError: Story = {
  render: () => (
    <CheckboxGroup
      label="利用規約"
      required
      error="少なくとも1つ選択してください"
      className="max-w-sm"
    >
      <CheckboxGroupItem description="個人情報の取り扱いについて">
        プライバシーポリシー
      </CheckboxGroupItem>
      <CheckboxGroupItem description="サービス利用条件">利用規約</CheckboxGroupItem>
    </CheckboxGroup>
  ),
}

export const SingleColumn: Story = {
  render: () => (
    <CheckboxGroup label="通知設定" columns={1} className="max-w-sm">
      <CheckboxGroupItem description="注文確定時にメール通知">注文確認メール</CheckboxGroupItem>
      <CheckboxGroupItem description="発送時にSMS通知" defaultChecked>
        発送通知SMS
      </CheckboxGroupItem>
      <CheckboxGroupItem description="お得なセール情報">プロモーション通知</CheckboxGroupItem>
    </CheckboxGroup>
  ),
}
