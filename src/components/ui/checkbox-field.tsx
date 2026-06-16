import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface CheckboxFieldProps
  extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
  /** インラインラベル（同意文・確認文など）。リンク等の ReactNode 可。 */
  label: React.ReactNode
  /** ラベル下の補足説明。 */
  description?: React.ReactNode
  /** エラーメッセージ。指定時は aria-invalid + Caution 色で表示。 */
  error?: string
  /** 外側コンテナのクラス（チェックボックス本体の整列スタイルは固定）。 */
  className?: string
}

/**
 * CheckboxField — フォーム内の単体チェックボックス（同意 / 確認用）。
 *
 * filter・設定行用の `<Checkbox label>`（hover 背景・行 padding・件数バッジ付き）とは
 * 役割が別。フォームフィールドとして「チェック + インラインラベル + 任意の説明 / エラー」を
 * DS 正準の縦整列（typo-body-md の行高 24.5px に 20px チェックを mt-0.5 で中央化）で出す。
 * ラベルが折り返しても items-start で先頭行に整列する。
 *
 * 目的: checkbox と label を画面側で手組みして mt / 行高がズレるのを防ぐ正準コンポーネント。
 */
function CheckboxField({
  label,
  description,
  error,
  className,
  id,
  ...props
}: CheckboxFieldProps) {
  const generatedId = React.useId()
  const fieldId = id ?? generatedId
  const errorId = error ? `${fieldId}-error` : undefined

  return (
    <div data-slot="checkbox-field" className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-start gap-2">
        <Checkbox
          id={fieldId}
          className="mt-0.5"
          aria-invalid={!!error || undefined}
          aria-describedby={errorId}
          {...props}
        />
        <div className={cn("flex flex-col gap-0.5", props.disabled && "opacity-60")}>
          <Label
            htmlFor={fieldId}
            className="typo-body-md text-[var(--Text-High-Emphasis)] cursor-pointer"
          >
            {label}
          </Label>
          {description && (
            <span className="typo-body-xs text-[var(--Text-Medium-Emphasis)]">
              {description}
            </span>
          )}
        </div>
      </div>
      {error && (
        <p id={errorId} className="typo-body-xs text-[var(--Text-Caution)]">
          {error}
        </p>
      )}
    </div>
  )
}

export { CheckboxField }
