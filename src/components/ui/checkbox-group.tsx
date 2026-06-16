import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

/**
 * CheckboxGroup / CheckboxGroupItem — チェックボックスグループ
 *
 * 複数のチェックボックスをグリッドレイアウト + ラベル + エラー表示付きでまとめるラッパー。
 *
 * ### 使用例
 * ```tsx
 * <CheckboxGroup label="配送方法" required columns={2}>
 *   <CheckboxGroupItem value="standard">通常配送</CheckboxGroupItem>
 *   <CheckboxGroupItem value="express" description="翌日届く">
 *     速達配送
 *   </CheckboxGroupItem>
 * </CheckboxGroup>
 * ```
 */

export interface CheckboxGroupProps {
  label: string
  required?: boolean
  helpText?: string
  error?: string
  /** グリッドカラム数（デフォルト: 2） */
  columns?: number
  children: React.ReactNode
  className?: string
}

function CheckboxGroup({
  label,
  required,
  helpText,
  error,
  columns = 2,
  children,
  className,
}: CheckboxGroupProps) {
  const gridCols =
    columns === 1 ? "grid-cols-1" : columns === 3 ? "grid-cols-3" : "grid-cols-2"

  return (
    <fieldset
      data-slot="checkbox-group"
      className={cn("flex flex-col gap-3", className)}
      aria-invalid={!!error || undefined}
    >
      <legend className="flex items-center gap-2">
        <span className="typo-label-md text-[var(--Text-High-Emphasis)]">{label}</span>
        {required && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[var(--Surface-Accent-Primary-Light)] typo-label-xs text-[var(--Brand-Primary)]">
            必須
          </span>
        )}
      </legend>

      <div className={cn("grid gap-2", gridCols)}>{children}</div>

      {helpText && !error && (
        <p className="typo-body-xs text-[var(--Text-Low-Emphasis)]">{helpText}</p>
      )}
      {error && (
        <p className="typo-body-xs text-[var(--Text-Caution)]" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  )
}

function CheckboxGroupItem({
  className,
  children,
  description,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  children: React.ReactNode
  description?: React.ReactNode
}) {
  const id = React.useId()

  return (
    <div
      data-slot="checkbox-group-item"
      className={cn("flex items-start gap-2", className)}
    >
      {/* DS の Checkbox（素モード）を利用し、塗りつぶしチェックの見た目を
          他のチェックボックス（ui/checkbox・MultiSelect 等）と統一する。
          ラベルの横並び + description レイアウトはこのコンポーネント側で維持。 */}
      <Checkbox id={id} className="mt-0.5" {...props} />
      <div className="flex flex-col gap-0.5">
        <Label
          htmlFor={id}
          className={cn(
            "typo-body-md cursor-pointer",
            "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"
          )}
        >
          {children}
        </Label>
        {description && (
          <span className="typo-body-xs text-[var(--Text-Medium-Emphasis)]">
            {description}
          </span>
        )}
      </div>
    </div>
  )
}

export { CheckboxGroup, CheckboxGroupItem }
