import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

type CheckboxRootProps = React.ComponentProps<typeof CheckboxPrimitive.Root>

export interface CheckboxProps extends CheckboxRootProps {
  /**
   * 文字列または ReactNode を渡すと、Checkbox を `<label>` でラップして
   * 行型レイアウトに切り替える。filter sidebar / 設定画面で典型的な
   * 「行全体クリッカブル」パターン。未指定なら従来通り素のチェックボックス
   * （外側で Label と組み合わせる使い方も継続可能）。
   */
  label?: React.ReactNode
  /** サブテキスト（label 指定時のみ有効） */
  description?: React.ReactNode
  /** 右端に表示する件数バッジ（label 指定時のみ有効） */
  count?: number
  /** label モード時の行コンテナに付けるクラス */
  containerClassName?: string
}

function CheckboxRoot({ className, ...props }: CheckboxRootProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-5 shrink-0 rounded-[5px] border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)]",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-[var(--Brand-Primary)] data-[state=checked]:text-[var(--Text-on-Inverse)] data-[state=checked]:border-[var(--Brand-Primary)]",
        "data-[state=indeterminate]:bg-[var(--Brand-Primary)] data-[state=indeterminate]:text-[var(--Text-on-Inverse)] data-[state=indeterminate]:border-[var(--Brand-Primary)]",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current"
      >
        {props.checked === "indeterminate" ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

/**
 * Checkbox — チェックボックス
 *
 * 2 つの使い方:
 *
 * 1. **素の Checkbox** — `label` を渡さない場合
 *    ```tsx
 *    <Checkbox checked={...} onCheckedChange={...} />
 *    ```
 *    外側で `<Label>` や `<FormField>` と組み合わせて使う。
 *
 * 2. **行型レイアウト** — `label` を渡すと自動で `<label>` ラップ + 行全体 hover
 *    ```tsx
 *    <Checkbox
 *      label="正社員"
 *      count={1234}
 *      checked={...}
 *      onCheckedChange={...}
 *    />
 *    ```
 *    filter sidebar / 設定画面の典型パターン。行全体クリッカブル、hover で背景強調。
 *
 * カード型の選択肢には `CheckboxCard` を使用。
 */
function Checkbox({
  label,
  description,
  count,
  containerClassName,
  className,
  id,
  ...props
}: CheckboxProps) {
  const generatedId = React.useId()
  const checkboxId = id ?? generatedId

  if (label === undefined) {
    return <CheckboxRoot id={checkboxId} className={className} {...props} />
  }

  return (
    <label
      htmlFor={checkboxId}
      data-slot="checkbox-row"
      data-disabled={props.disabled || undefined}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 transition-colors cursor-pointer",
        "hover:bg-[var(--Surface-Tertiary)]",
        "has-[:focus-visible]:bg-[var(--Surface-Tertiary)]",
        props.disabled && "cursor-not-allowed opacity-60 hover:bg-transparent has-[:focus-visible]:bg-transparent",
        containerClassName,
      )}
    >
      <CheckboxRoot id={checkboxId} className={className} {...props} />
      <div className="flex-1 min-w-0">
        <span className="typo-body-md text-[var(--Text-High-Emphasis)]">{label}</span>
        {description && (
          <span className="block typo-body-sm text-[var(--Text-Medium-Emphasis)] mt-0.5">
            {description}
          </span>
        )}
      </div>
      {count !== undefined && (
        <span className="shrink-0 typo-label-sm text-[var(--Text-Medium-Emphasis)] tabular-nums">
          {count.toLocaleString()}
        </span>
      )}
    </label>
  )
}

export { Checkbox }
