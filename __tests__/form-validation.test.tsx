/**
 * FormField — バリデーション表示ロジックの回帰防止
 *
 * form.tsx の FormControl / FormLabel / FormMessage は、
 * react-hook-form のフィールドエラー状態から aria 属性とエラーテキストを導出する。
 * この導出が壊れるとアクセシビリティ（SR がエラーを読めない）と
 * 視覚フィードバックが同時に失われるため、SSR 出力で契約を固定する。
 *
 * エラー状態は useForm({ errors }) で注入する（DOM 操作なしに SSR で再現できる）。
 *
 * 実行: npm run test
 *
 * SSR 不使用: jsdom 不要・react-dom/server だけで検証できる範囲に絞る。
 */
import { describe, it, expect } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import * as React from "react"
import { useForm, type FieldErrors } from "react-hook-form"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "../src/components/ui/form"
import { Input } from "../src/components/ui/input"

const ERROR_MESSAGE = "メールアドレスを入力してください"

function Harness({ errors }: { errors?: FieldErrors<{ email: string }> }) {
  const form = useForm<{ email: string }>({
    defaultValues: { email: "" },
    errors,
  })
  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>メールアドレス</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>注文確認メールを送信します</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

const withError = () =>
  renderToStaticMarkup(
    <Harness errors={{ email: { type: "required", message: ERROR_MESSAGE } }} />
  )
const withoutError = () => renderToStaticMarkup(<Harness />)

describe("FormField — エラー時の表示ロジック", () => {
  it("エラー時は FormControl に aria-invalid=true が付く", () => {
    const out = withError()
    expect(out).toContain('aria-invalid="true"')
  })

  it("エラー時は FormMessage にエラーテキストが出る", () => {
    const out = withError()
    expect(out).toContain('data-slot="form-message"')
    expect(out).toContain(ERROR_MESSAGE)
  })

  it("エラー時は aria-describedby に description と message の両 id を含む", () => {
    const out = withError()
    // aria-describedby="...-description ...-message"（両方を SR に紐付ける）
    expect(out).toMatch(/aria-describedby="[^"]*-description [^"]*-message"/)
  })

  it("エラー時は FormLabel に data-error=true が付く（Caution 色トリガ）", () => {
    const out = withError()
    expect(out).toContain('data-slot="form-label"')
    expect(out).toContain('data-error="true"')
    // 誤色ではなく semantic の Caution トークンにひもづく
    expect(out).toContain("data-[error=true]:text-[var(--Text-Caution)]")
  })
})

describe("FormField — 非エラー時の表示ロジック", () => {
  it("非エラー時は aria-invalid=false で FormMessage の p が出ない", () => {
    const out = withoutError()
    expect(out).toContain('aria-invalid="false"')
    expect(out).not.toContain('data-slot="form-message"')
    expect(out).not.toContain(ERROR_MESSAGE)
  })

  it("非エラー時の aria-describedby は description の id のみ", () => {
    const out = withoutError()
    expect(out).toMatch(/aria-describedby="[^"]*-description"/)
    expect(out).not.toContain("-message")
  })

  it("非エラー時は FormLabel の data-error=false", () => {
    const out = withoutError()
    expect(out).toContain('data-error="false"')
  })
})

describe("FormField — 常時の構造契約", () => {
  it("required で FormLabel にアスタリスク（aria-hidden）が付く", () => {
    const out = withoutError()
    expect(out).toMatch(/<span aria-hidden="true"[^>]*>\*<\/span>/)
  })

  it("FormControl の id と FormMessage の id が同じ item から導出される", () => {
    const out = withError()
    // 同一 FormItem 内なので prefix が一致する（form-item / form-item-message）
    const controlId = out.match(/id="([^"]*-form-item)"/)?.[1]
    expect(controlId).toBeTruthy()
    const prefix = controlId!.replace(/-form-item$/, "")
    expect(out).toContain(`id="${prefix}-form-item-message"`)
  })
})
