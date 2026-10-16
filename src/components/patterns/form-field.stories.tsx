/**
 * @file FormField のストーリー
 * @description フォームフィールドコンポーネント。Input との組み合わせ、必須表示、エラー状態、説明テキストを網羅
 */
import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"
import { FormField } from "./form-field"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

const meta: Meta<typeof FormField> = {
  title: "Components/FormField",
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

export const WithCharacterCountAndError: Story = {
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-6">
      <FormField
        label="タイトル"
        htmlFor="ff-title-count"
        error="タイトルを確認してください"
      >
        <Input
          id="ff-title-count"
          defaultValue="入力中のタイトル"
          maxLength={40}
          showCount
        />
      </FormField>
      <FormField
        label="説明"
        htmlFor="ff-description-count"
        error="説明を確認してください"
      >
        <Textarea
          id="ff-description-count"
          defaultValue="カウンタの下にエラー文が重ならず表示されます。"
          maxLength={120}
          showCount
        />
      </FormField>
    </div>
  ),
}

export const WithSelect: Story = {
  render: () => (
    <FormField label="カテゴリ" required>
      {/* FormField の label は htmlFor 未指定だと Radix トリガーに紐付かないため、
          aria-label で直接アクセシブルネームを補う（axe: button-name）。 */}
      <Select>
        <SelectTrigger aria-label="カテゴリ">
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

/**
 * ラベル左置きの項目行（issue #712）。`orientation="horizontal"` + `labelWidth` で左のラベル列をそろえ、
 * 枠の無い入力欄は `targetSize="comfortable"` で外側に余白を足さずに 44px の当たり判定を持つ。
 * 行の区切り線は呼び出し側の divide-y。エラーは入力欄の下（右の列）に出て、ラベルは動かない。
 */
export const HorizontalRows: Story = {
  tags: ["interaction"],
  render: () => (
    <div className="w-[360px] divide-y divide-[var(--Border-Low-Emphasis)]">
      <FormField orientation="horizontal" label="かな" htmlFor="ffh-kana" className="py-2">
        <Input id="ffh-kana" variant="inline" targetSize="comfortable" placeholder="やまだ たろう" />
      </FormField>
      <FormField orientation="horizontal" label="肩書き" htmlFor="ffh-title" className="py-2" error="20 文字以内で入力してください">
        <Input id="ffh-title" variant="inline" targetSize="comfortable" defaultValue="新郎の大学時代のゼミの先輩でとても長い肩書き" />
      </FormField>
      <FormField orientation="horizontal" labelAlign="start" label="住所" htmlFor="ffh-address" className="py-2">
        <Textarea id="ffh-address" variant="inline" targetSize="comfortable" rows={2} placeholder="東京都千代田区…" />
      </FormField>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const kana = canvasElement.querySelector<HTMLInputElement>("#ffh-kana")!
    await expect(kana.getBoundingClientRect().height).toBeGreaterThanOrEqual(44)
    const rows = canvasElement.querySelectorAll<HTMLElement>('[data-slot="form-field"]')
    // ラベル列の幅は既定 5rem（80px）。1 行目と 2 行目で入力欄の左端がそろう
    const left0 = rows[0].querySelector<HTMLElement>('[data-slot="form-field-control"]')!.getBoundingClientRect().left
    const left1 = rows[1].querySelector<HTMLElement>('[data-slot="form-field-control"]')!.getBoundingClientRect().left
    await expect(Math.round(left0)).toBe(Math.round(left1))
    // エラーは入力欄と同じ列に出る
    const err = rows[1].querySelector<HTMLElement>('[role="alert"]')!
    await expect(Math.round(err.getBoundingClientRect().left)).toBe(Math.round(left1))
    // エラーが出ても、ラベルは入力欄の行の中央にそろったまま
    const label = rows[1].querySelector("label")!.getBoundingClientRect()
    const input = rows[1].querySelector("input")!.getBoundingClientRect()
    await expect(Math.abs(label.top + label.height / 2 - (input.top + input.height / 2))).toBeLessThanOrEqual(1)
    await expect(rows[1].querySelector("input")!.getAttribute("aria-describedby")).toBe(err.id)
  },
}
