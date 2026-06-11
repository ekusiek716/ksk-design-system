import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * `required` の見た目をどう出すか。
 * - "asterisk"（既定）: `*` 1 文字。コンパクト・国際標準。
 * - "pill"   : 「必須」/「任意」のバッジ。日本語フォーム慣習。
 *              required=false でも「任意」を明示するため、optional 側の表示も
 *              この prop が制御する。
 * - "none"   : 何も出さない。required 単独で aria 属性のみ意味を持つ。
 */
type RequiredStyle = "asterisk" | "pill" | "none"

interface FormFieldProps extends React.ComponentProps<"div"> {
  label: string
  htmlFor?: string
  required?: boolean
  error?: string
  description?: string
  /**
   * required の表示形式。詳細は RequiredStyle の JSDoc。
   * 既定: "asterisk"。
   */
  requiredStyle?: RequiredStyle
  /**
   * ラベル右側に置くメタ情報（バッジ / 文字数カウンタ / ヘルプアイコン等）。
   * 「タイトル + 字数 12/200」「タイトル + 種別バッジ」のような用途。
   */
  endLabel?: React.ReactNode
}

function FormField({
  className,
  label,
  htmlFor,
  required,
  error,
  description,
  requiredStyle = "asterisk",
  endLabel,
  children,
  ...props
}: FormFieldProps) {
  const hasLabelRow = endLabel != null

  // error / description を子フィールドへ aria で紐付ける。
  const reactId = React.useId()
  const descId = `${reactId}-desc`
  const errId = `${reactId}-err`
  const showDesc = description != null && !error
  const describedBy =
    [error ? errId : null, showDesc ? descId : null].filter(Boolean).join(" ") || undefined

  // 単一の要素 children のときだけ aria を注入（複数 / テキストはそのまま）。
  const field = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        "aria-invalid": error
          ? true
          : (children as React.ReactElement<Record<string, unknown>>).props["aria-invalid"],
        "aria-describedby":
          [
            (children as React.ReactElement<Record<string, unknown>>).props["aria-describedby"],
            describedBy,
          ]
            .filter(Boolean)
            .join(" ") || undefined,
      })
    : children

  return (
    <div
      data-slot="form-field"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    >
      <div
        className={cn(
          // endLabel が無いときは <label> 単体（既存の見た目を維持）。
          // 在るときだけ row 化して right に寄せる。
          hasLabelRow && "flex items-center justify-between gap-2"
        )}
      >
        <label
          htmlFor={htmlFor}
          className="typo-label-md text-[var(--Text-High-Emphasis)] inline-flex items-center gap-1.5"
        >
          {label}
          {requiredStyle === "asterisk" && required && (
            // required の * は Brand 色を使う。
            // Caution は「誤入力アラート」と視覚的に紛らわしく
            // フォームの「目立たせポイント」としては強すぎるため、
            // Brand 色で「ここは記入必須」と促す方が読みやすい。
            <span className="text-[var(--Brand-Primary)]" aria-hidden="true">
              *
            </span>
          )}
          {requiredStyle === "pill" && (
            <span
              className={cn(
                "typo-label-xs px-1.5 py-0.5 rounded",
                required
                  ? "bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Brand-Primary)]"
                  : "bg-[var(--Surface-Tertiary)] text-[var(--Text-Medium-Emphasis)]"
              )}
              aria-hidden="true"
            >
              {required ? "必須" : "任意"}
            </span>
          )}
        </label>
        {endLabel && (
          <div
            data-slot="form-field-end-label"
            className="typo-body-sm text-[var(--Text-Medium-Emphasis)] flex items-center"
          >
            {endLabel}
          </div>
        )}
      </div>
      {field}
      {description && !error && (
        <p id={descId} className="typo-body-sm text-[var(--Text-Low-Emphasis)]">
          {description}
        </p>
      )}
      {error && (
        <p
          id={errId}
          className="typo-body-sm text-[var(--Text-Caution)] flex items-center gap-1"
          role="alert"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7 4V7.5M7 9.5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

export { FormField }
export type { FormFieldProps, RequiredStyle }
