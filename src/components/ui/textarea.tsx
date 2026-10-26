import * as React from "react"
import { cn } from "@/lib/utils"
import { useValueLength } from "@/lib/use-value-length"
import { UNSTYLED_FOCUS_RING } from "@/lib/server-variants/unstyled"
import {
  INLINE_FIELD_BASE,
  INLINE_FIELD_TARGET_SIZE,
  INLINE_FIELD_TYPO,
  type FieldTargetSize,
  type FieldVariant,
} from "../../lib/server-variants/inline-field"

interface TextareaProps extends React.ComponentProps<"textarea"> {
  /** 入力内容に合わせて高さを自動伸縮する */
  autoGrow?: boolean
  /**
   * 文字数カウンタを表示する。maxLength とセットで使うと
   * 右下に「現在/max」を表示し、上限到達時は caution 色になる。
   */
  showCount?: boolean
  /**
   * 視覚クラスを一切出さず、挙動と a11y だけを提供する（issue #420）。
   *
   * `min-h-* / w-full / border-* / bg-* / px-* / py-* / typo-* / placeholder:*` などの
   * 寸法・枠・背景・タイポ系クラスを出力しない。維持されるのは autoGrow の
   * 高さ自動伸縮（`resize-none overflow-hidden` は autoGrow の機能そのもの）、
   * showCount の文字数カウント、そして a11y のための focus-visible ring。
   *
   * aikoibito のチャット入力欄が `--Field-Min-Height: 5rem` の流入で
   * 43px → 80px になった事例（issue #420）が想定ユースケース。
   */
  unstyled?: boolean
  /**
   * 見た目の種類（issue #675）。Input の variant と同じ。"inline" は枠・背景なしで本文と同じ見た目、
   * "inline-title" は見出し（typo-heading-xl）。メモ・説明のその場編集に使う（resize なし・最小高さなし）。
   * AutoGrowTextarea / CommitTextarea / CommitAutoGrowTextarea にもそのまま渡せる。
   */
  variant?: FieldVariant
  /**
   * inline 系 variant の当たり判定（issue #712）。
   * - "compact"（既定）: 従来の高さ
   * - "comfortable": 最小 44px（min-h-11 + py-2）。ラベル左置きの項目行（FormField orientation="horizontal"）で、
   *   外側に py-2 を足さずに押せる範囲を 44px にする
   *
   * `variant="default"`（枠付き。既に 48px）と `unstyled` では効かない。HTML の `size` 属性と衝突するため
   * `size` ではなく `targetSize` という名前にしている。
   */
  targetSize?: FieldTargetSize
}

function Textarea({
  className,
  autoGrow,
  showCount,
  unstyled = false,
  variant = "default",
  targetSize = "compact",
  maxLength,
  value,
  defaultValue,
  onChange,
  onCompositionStart,
  onCompositionEnd,
  ref,
  ...props
}: TextareaProps) {
  const {
    ref: countRef,
    getElement,
    length,
    syncFromDom,
    beginComposition,
    endComposition,
  } = useValueLength<HTMLTextAreaElement>({
    enabled: showCount === true,
    value,
    defaultValue,
    forwardedRef: ref,
  })

  const grow = React.useCallback(() => {
    const el = getElement()
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }, [getElement])

  React.useEffect(() => {
    if (autoGrow) grow()
  }, [autoGrow, grow, value, defaultValue])

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (autoGrow) grow()
      if (showCount) syncFromDom()
      onChange?.(e)
    },
    [autoGrow, grow, onChange, showCount, syncFromDom],
  )

  const textarea = (
    <textarea
      ref={countRef}
      data-slot="textarea"
      data-variant={variant === "default" ? undefined : variant}
      data-target-size={!unstyled && variant !== "default" && targetSize === "comfortable" ? "comfortable" : undefined}
      value={value}
      defaultValue={defaultValue}
      maxLength={maxLength}
      className={cn(
        unstyled
          ? UNSTYLED_FOCUS_RING
          : variant !== "default"
            ? [INLINE_FIELD_BASE, INLINE_FIELD_TYPO[variant], "min-h-0 resize-none", INLINE_FIELD_TARGET_SIZE[targetSize]]
            : [
              // 最小高さ・padding・角丸は product theme の公開変数（`--Field-*`）を参照する。
              // 既定値は従来の min-h-[80px] / px-3 / py-2 / rounded-lg と同値（issue #364）。
              "flex min-h-[var(--Field-Min-Height)] w-full rounded-[var(--Field-Radius)] border border-[var(--Border-Control,var(--Border-Medium-Emphasis))] bg-[var(--Surface-Primary)] px-[var(--Field-Padding-X-Md)] py-[var(--Field-Padding-Y)] typo-body-md text-[var(--Text-High-Emphasis)] transition-colors",
              "placeholder:text-[var(--Text-Low-Emphasis)]",
              "focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)] focus-visible:border-[var(--Border-Accent-Primary)]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "aria-invalid:border-[var(--Border-Caution)]",
            ],
        autoGrow && "resize-none overflow-hidden",
        className
      )}
      onChange={handleChange}
      onCompositionStart={(event) => {
        beginComposition()
        onCompositionStart?.(event)
      }}
      onCompositionEnd={(event) => {
        endComposition()
        onCompositionEnd?.(event)
      }}
      {...props}
    />
  )

  if (!showCount) return textarea

  const atLimit = maxLength != null && length >= maxLength

  return (
    <div data-slot="textarea-with-count" className={unstyled ? undefined : "w-full"}>
      {textarea}
      <div className="mt-1 flex justify-end">
        <span
          data-slot="textarea-count"
          className={cn(
            "typo-caption tabular-nums",
            atLimit
              ? "text-[var(--Text-Caution)]"
              : "text-[var(--Text-Low-Emphasis)]",
          )}
        >
          {length}
          {maxLength != null ? `/${maxLength}` : ""}
        </span>
      </div>
    </div>
  )
}

export { Textarea }
export type { TextareaProps }
