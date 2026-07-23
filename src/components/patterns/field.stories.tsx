import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormActions, FormRoot } from "./form"
import { FormField } from "./form-field"
import {
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "./field"

const meta: Meta<typeof FieldSet> = {
  title: "Components/Field",
  component: FieldSet,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
}
export default meta

type Story = StoryObj<typeof FieldSet>

export const LongForm: Story = {
  name: "3セクションの長いフォーム",
  render: () => (
    <FormRoot className="w-full max-w-xl">
      <FieldSet>
        <FieldLegend>基本情報</FieldLegend>
        <FieldDescription>
          プロフィールに表示する基本情報を入力してください。
        </FieldDescription>
        <FieldGroup aria-label="基本情報の入力項目">
          <FormField label="氏名" htmlFor="field-name" required>
            <Input id="field-name" placeholder="山田 太郎" />
          </FormField>
          <FormField label="メールアドレス" htmlFor="field-email" required>
            <Input id="field-email" type="email" placeholder="example@mail.com" />
          </FormField>
        </FieldGroup>
      </FieldSet>

      <FieldSeparator />

      <FieldSet>
        <FieldLegend>所属情報</FieldLegend>
        <FieldDescription>
          チーム内で使う所属・役割を設定します。
        </FieldDescription>
        <FieldGroup aria-label="所属情報の入力項目">
          <FormField label="会社・組織名" htmlFor="field-company">
            <Input id="field-company" placeholder="株式会社〇〇" />
          </FormField>
          <FormField label="役割" htmlFor="field-role">
            <Input id="field-role" placeholder="デザイナー" />
          </FormField>
        </FieldGroup>
      </FieldSet>

      <FieldSeparator>任意設定</FieldSeparator>

      <FieldSet>
        <FieldLegend>プロフィール</FieldLegend>
        <FieldDescription>
          公開プロフィールに表示する紹介文を入力してください。
        </FieldDescription>
        <FieldGroup aria-label="プロフィールの入力項目">
          <FormField
            label="自己紹介"
            htmlFor="field-bio"
            error="自己紹介を確認してください"
          >
            <Textarea
              id="field-bio"
              defaultValue="プロダクトデザインとフロントエンドを担当しています。"
              maxLength={200}
              showCount
            />
          </FormField>
        </FieldGroup>
        <FieldError>入力内容に 1 件のエラーがあります。</FieldError>
      </FieldSet>

      <FormActions>
        <Button type="button" variant="secondary">
          キャンセル
        </Button>
        <Button type="submit">保存する</Button>
      </FormActions>
    </FormRoot>
  ),
}

export const SeparatorWithLabel: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <FieldGroup aria-label="連絡方法">
        <FormField label="メールアドレス" htmlFor="field-separator-email">
          <Input
            id="field-separator-email"
            type="email"
            placeholder="mail@example.com"
          />
        </FormField>
        <FieldSeparator>または</FieldSeparator>
        <FormField label="電話番号" htmlFor="field-separator-tel">
          <Input id="field-separator-tel" type="tel" placeholder="090-1234-5678" />
        </FormField>
      </FieldGroup>
    </div>
  ),
}
