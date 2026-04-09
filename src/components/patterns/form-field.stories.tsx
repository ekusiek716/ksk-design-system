/**
 * @file FormField のストーリー
 * @description フォームフィールドコンポーネント。Input との組み合わせ、必須表示、エラー状態、説明テキストを網羅
 */
import type { Meta, StoryObj } from "@storybook/react"
import { FormField } from "./form-field"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

const meta: Meta<typeof FormField> = {
  title: "Patterns/FormField",
  component: FormField,
}
export default meta

type Story = StoryObj<typeof FormField>

export const WithInput: Story = {
  render: () => (
    <FormField label="メールアドレス" htmlFor="ff-email">
      <Input id="ff-email" type="email" placeholder="example@mail.com" />
    </FormField>
  ),
}

export const Required: Story = {
  render: () => (
    <FormField label="氏名" htmlFor="ff-name" required>
      <Input id="ff-name" placeholder="山田太郎" />
    </FormField>
  ),
}

export const WithError: Story = {
  render: () => (
    <FormField label="メールアドレス" htmlFor="ff-email-err" required error="正しいメールアドレスを入力してください">
      <Input id="ff-email-err" type="email" defaultValue="invalid" aria-invalid />
    </FormField>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <FormField label="パスワード" htmlFor="ff-password" description="8文字以上で、英数字と記号を含めてください">
      <Input id="ff-password" type="password" placeholder="パスワードを入力" />
    </FormField>
  ),
}

export const WithTextarea: Story = {
  render: () => (
    <FormField label="備考" htmlFor="ff-note" description="任意入力です">
      <Textarea id="ff-note" placeholder="備考を入力してください" />
    </FormField>
  ),
}

export const WithSelect: Story = {
  render: () => (
    <FormField label="カテゴリ" required>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="選択してください" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tech">テクノロジー</SelectItem>
          <SelectItem value="design">デザイン</SelectItem>
          <SelectItem value="business">ビジネス</SelectItem>
        </SelectContent>
      </Select>
    </FormField>
  ),
}

export const CompleteForm: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <FormField label="氏名" htmlFor="cf-name" required>
        <Input id="cf-name" placeholder="山田太郎" />
      </FormField>
      <FormField label="メールアドレス" htmlFor="cf-email" required error="正しいメールアドレスを入力してください">
        <Input id="cf-email" type="email" defaultValue="invalid" aria-invalid />
      </FormField>
      <FormField label="お問い合わせ内容" htmlFor="cf-message" required description="1000文字以内で入力してください">
        <Textarea id="cf-message" placeholder="お問い合わせ内容を入力" />
      </FormField>
    </div>
  ),
}
