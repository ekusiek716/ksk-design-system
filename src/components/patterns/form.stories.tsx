/**
 * @file Form のストーリー
 * @description FormRoot, FormSection, FormActions を組み合わせたフォームパターン
 */
import type { Meta, StoryObj } from "@storybook/react"
import { FormRoot, FormSection, FormActions } from "./form"
import { FormField } from "./form-field"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

const meta: Meta<typeof FormRoot> = {
  title: "Patterns/Form",
  component: FormRoot,
}
export default meta

type Story = StoryObj<typeof FormRoot>

export const Default: Story = {
  render: () => (
    <FormRoot onSubmit={() => alert("送信されました")} className="max-w-lg">
      <FormSection title="基本情報" description="ユーザーの基本的な情報を入力してください">
        <FormField label="氏名" htmlFor="form-name" required>
          <Input id="form-name" placeholder="山田太郎" />
        </FormField>
        <FormField label="メールアドレス" htmlFor="form-email" required>
          <Input id="form-email" type="email" placeholder="example@mail.com" />
        </FormField>
      </FormSection>

      <FormSection title="詳細設定" description="必要に応じて追加情報を設定できます">
        <FormField label="表示名" htmlFor="form-display" description="公開プロフィールに表示されます">
          <Input id="form-display" placeholder="表示名を入力" />
        </FormField>
        <FormField label="所属組織" htmlFor="form-org">
          <Input id="form-org" placeholder="株式会社〇〇" />
        </FormField>
      </FormSection>

      <FormActions>
        <Button variant="secondary" type="button">キャンセル</Button>
        <Button type="submit">保存する</Button>
      </FormActions>
    </FormRoot>
  ),
}
