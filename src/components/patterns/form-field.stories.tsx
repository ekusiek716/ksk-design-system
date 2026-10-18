/**
 * @file FormField のストーリー
 * @description フォームフィールドコンポーネント。Input との組み合わせ、必須表示、エラー状態、説明テキストを網羅
 */
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { expect, userEvent, within } from "storybook/test"
import { FormField } from "./form-field"
import { FieldGroup, FieldSeparator } from "./field"
import { Chip } from "./chip"
import { ChipSelector } from "./chip-selector"
import { CollapsibleChipField } from "./collapsible-chip-field"
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

/**
 * 選択肢のまとまりを置く項目行（`as="group"`）と区切り線の一覧（`FieldGroup variant="rows"`）（issue #720）。
 * ラベルは `<span id>`、右の列は `role="group"` + `aria-labelledby`。行の上下 12px と区切り線は FieldGroup が持つので、
 * FormField に `className="py-3"` を足さない。CollapsibleChipField の行と左端・上下がそろう。
 */
export const GroupRows: Story = {
  tags: ["interaction"],
  render: function Render() {
    const [roles, setRoles] = useState<string[]>(["受付"])
    const [attendance, setAttendance] = useState<"attending" | "declined" | undefined>("attending")
    const toggle = (r: string) => setRoles((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]))
    return (
      <FieldGroup variant="rows" aria-label="ゲストの情報" className="w-[360px]">
        <CollapsibleChipField<"attending" | "declined">
          label="出欠"
          options={["attending", "declined"]}
          selected={attendance}
          onSelect={setAttendance}
          getLabel={(k) => (k === "attending" ? "出席" : "欠席")}
        />
        <FormField orientation="horizontal" label="肩書き" htmlFor="ffg-title">
          <Input id="ffg-title" variant="inline" targetSize="comfortable" placeholder="新郎の友人" />
        </FormField>
        <FormField orientation="horizontal" labelAlign="start" as="group" label="役割" description="複数選べます">
          <div className="flex flex-wrap gap-2">
            {["受付", "余興", "スピーチ"].map((r) => (
              <Chip key={r} selected={roles.includes(r)} onClick={() => toggle(r)}>
                {r}
              </Chip>
            ))}
          </div>
        </FormField>
      </FieldGroup>
    )
  },
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector<HTMLElement>('[data-slot="form-field-control"][role="group"]')!
    const labelEl = canvasElement.querySelector<HTMLElement>(`#${CSS.escape(group.getAttribute("aria-labelledby")!)}`)!
    await expect(labelEl.tagName).toBe("SPAN")
    await expect(labelEl.textContent).toBe("役割")
    await expect(group.getAttribute("aria-describedby")).toBeTruthy()
    // 行の上下 12px は FieldGroup が持つ
    const rows = canvasElement.querySelectorAll<HTMLElement>('[data-slot="field-group"] > *')
    await expect(getComputedStyle(rows[1]).paddingTop).toBe("12px")
    await expect(getComputedStyle(rows[0]).paddingTop).toBe("12px")
    // CollapsibleChipField の選択肢の列と、FormField の右の列の左端がそろう
    const chipLeft = rows[0].querySelector<HTMLElement>('[data-slot="chip"]')!.getBoundingClientRect().left
    const controlLeft = group.getBoundingClientRect().left
    await expect(Math.abs(chipLeft - controlLeft)).toBeLessThanOrEqual(1)
    await userEvent.click(group.querySelectorAll("button")[1])
    await expect(group.querySelectorAll("button")[1].getAttribute("aria-pressed")).toBe("true")
  },
}

/**
 * as="group" の中の ChipSelector（single）は、aria-labelledby を省くとグループのラベルを radiogroup の名前にも使う（issue #734 / #741）。
 * FieldGroup variant="rows" は FormField 以外の直下の行（ここでは div）にも py-3 を付ける（issue #733）。
 */
export const GroupChipSelectorAutoName: Story = {
  tags: ["interaction"],
  render: () => {
    const [kind, setKind] = useState<string | null>("a")
    return (
      <div className="w-full max-w-md">
        <FieldGroup variant="rows">
          <FormField as="group" orientation="horizontal" label="種別">
            <ChipSelector
              selectionMode="single"
              options={[{ value: "a", label: "親族" }, { value: "b", label: "友人" }]}
              value={kind}
              onChange={setKind}
            />
          </FormField>
          <div data-testid="plain-row">FormField ではない行</div>
          <div data-testid="own-py-row" className="py-0">自分で py-0 を指定した行</div>
          <FieldSeparator />
        </FieldGroup>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    // 外側の group と内側の radiogroup の両方が「種別」で名前を持つ（radiogroup は名前必須。issue #741）
    await expect(within(canvasElement).getByRole("group", { name: "種別" })).toBeTruthy()
    await expect(within(canvasElement).getByRole("radiogroup", { name: "種別" })).toBeTruthy()
    const row = within(canvasElement).getByTestId("plain-row")
    await expect(getComputedStyle(row).paddingTop).toBe("12px")
    await expect(getComputedStyle(row).paddingBottom).toBe("12px")
    // 子の className の py-* が勝つ（詳細度 0）
    const own = within(canvasElement).getByTestId("own-py-row")
    await expect(getComputedStyle(own).paddingTop).toBe("0px")
    // Separator / Legend 等には付けない
    const sep = canvasElement.querySelector<HTMLElement>('[data-slot="field-separator"]')!
    await expect(getComputedStyle(sep).paddingTop).toBe("8px")
  },
}
