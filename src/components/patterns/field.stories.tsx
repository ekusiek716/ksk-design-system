import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"
import { Chip } from "./chip"
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

/**
 * 絞り込みシートの選択肢グループ（issue #714）。`FieldSet gap="sm"` + `FieldLegend size="sm"`。
 * gap を指定すると legend の下にも同じ間隔が付く（legend は flex の並びに入らないため gap だけでは 0px）。
 */
export const CompactFilterGroups: Story = {
  tags: ["interaction"],
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      {[
        { legend: "期限", options: ["すべて", "今日", "今週", "期限切れ"] },
        { legend: "状態", options: ["未完了", "すべて", "完了"] },
      ].map((group) => (
        <FieldSet key={group.legend} gap="sm">
          <FieldLegend size="sm">{group.legend}</FieldLegend>
          <div className="flex flex-wrap gap-2">
            {group.options.map((label, i) => (
              <Chip key={label} selected={i === 0}>{label}</Chip>
            ))}
          </div>
        </FieldSet>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const legend = canvasElement.querySelector<HTMLElement>('[data-slot="field-legend"]')!
    const row = legend.nextElementSibling as HTMLElement
    await expect(Math.round(row.getBoundingClientRect().top - legend.getBoundingClientRect().bottom)).toBe(8)
    await expect(getComputedStyle(legend).fontSize).toBe("14px")
  },
}

/**
 * gap を省いた既定でも legend の下に子の間隔と同じ 24px が付く（issue #747）。
 * 詰めたい画面は `<FieldLegend className="mb-0">`（legend の余白は詳細度 0 なので className が勝つ）。
 */
export const LegendSpacing: Story = {
  tags: ["interaction"],
  render: () => (
    <div className="flex w-80 flex-col gap-8">
      <FieldSet data-testid="default">
        <FieldLegend>既定</FieldLegend>
        <FormField label="氏名" htmlFor="legend-spacing-name">
          <Input id="legend-spacing-name" />
        </FormField>
        <FormField label="メールアドレス" htmlFor="legend-spacing-email">
          <Input id="legend-spacing-email" type="email" />
        </FormField>
      </FieldSet>
      <FieldSet data-testid="tight">
        <FieldLegend className="mb-0">詰めた legend</FieldLegend>
        <FormField label="電話番号" htmlFor="legend-spacing-tel">
          <Input id="legend-spacing-tel" type="tel" />
        </FormField>
      </FieldSet>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const measure = (testId: string) => {
      const set = canvasElement.querySelector<HTMLElement>(`[data-testid="${testId}"]`)!
      const legend = set.querySelector<HTMLElement>('[data-slot="field-legend"]')!
      const first = legend.nextElementSibling as HTMLElement
      const second = first.nextElementSibling as HTMLElement | null
      return {
        legendGap: first.getBoundingClientRect().top - legend.getBoundingClientRect().bottom,
        childGap: second ? second.getBoundingClientRect().top - first.getBoundingClientRect().bottom : undefined,
      }
    }
    const def = measure("default")
    // 既定: legend の下の間隔は子どうしの間隔と同じ（0 ではない）
    await expect(def.legendGap).toBeGreaterThan(0)
    await expect(Math.abs(def.legendGap - def.childGap!)).toBeLessThanOrEqual(1)
    // className="mb-0" は既定の余白より勝つ
    const tight = measure("tight")
    await expect(tight.legendGap).toBeLessThan(def.legendGap)
    await expect(Math.abs(tight.legendGap)).toBeLessThanOrEqual(1)
  },
}
