import * as React from "react"
import { Textarea } from "./textarea"
import { cn } from "@/lib/utils"

/**
 * AutoGrowTextarea — Textarea ラッパー。入力に合わせて自動高さ調整。
 *
 * - 入力ごとに `scrollHeight` を計算して `style.height` を更新
 * - `minRows` で最小行数を確保（既定 density ではカーソル下に常に 1 行分の余白を残す）
 * - `density="compact"` で 1 行タイトル編集などの余白なし auto-grow に切り替え
 * - `showCount` + `maxLength` で右下に「現在 / 上限」カウンタを表示
 *   - 70% 超で warning 色、上限到達で caution 色
 *   - 後方互換のため showCount 未指定時は従来どおり maxLength 指定で自動表示
 * - 内部 ref で `<textarea>` を握り、外部からの value 同期にも追従
 *
 * もとは belle-todo + ninshin-todo の共通実装（プロダクションで TaskDetailSheet /
 * FeedbackSheet / Notes / Venues 等で使用）。DS に昇格。
 *
 * ### 使用例
 * ```tsx
 * <AutoGrowTextarea
 *   value={memo}
 *   onChange={setMemo}
 *   placeholder="メモを入力..."
 *   minRows={3}
 *   maxLength={500}
 * />
 * ```
 *
 * @example
 * // 最小用途（カウンタなし）
 * <AutoGrowTextarea value={v} onChange={setV} placeholder="..." />
 */
export type AutoGrowTextareaDensity = "default" | "compact"

export interface AutoGrowTextareaProps
  extends Omit<React.ComponentProps<typeof Textarea>, "ref" | "value" | "onChange" | "placeholder" | "rows" | "maxLength" | "className"> {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  /** 最小行数。これより小さい高さにはならない（既定 3） */
  minRows?: number
  /** compact は詳細シートのタイトルなど、1行分の余白を追加しない用途向け。 */
  density?: AutoGrowTextareaDensity
  /** 指定すると右下に「現在 / 上限」カウンタを表示。70% 超で warning 色、上限到達で caution 色。 */
  maxLength?: number
  /** 文字数カウンタの表示。false で maxLength 指定時の従来カウンタも非表示にできる。 */
  showCount?: boolean
  className?: string
}

export function AutoGrowTextarea({
  value,
  onChange,
  placeholder,
  minRows = 3,
  density = "default",
  maxLength,
  showCount,
  className,
  ...textareaProps
}: AutoGrowTextareaProps) {
  const ref = React.useRef<HTMLTextAreaElement | null>(null)

  const resize = React.useCallback(() => {
    const t = ref.current
    if (!t) return
    t.style.height = "auto"
    const cs = window.getComputedStyle(t)
    const lh = parseFloat(cs.lineHeight) || 20
    const minH = lh * minRows + (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0)
    const extraLineHeight = density === "compact" ? 0 : lh
    const next = Math.max(t.scrollHeight + extraLineHeight, minH)
    t.style.height = next + "px"
  }, [density, minRows])

  React.useEffect(() => {
    resize()
  }, [value, resize])

  React.useEffect(() => {
    const onResize = () => resize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [resize])

  const ratio = maxLength != null && maxLength > 0 ? value.length / maxLength : 0
  const counterColor =
    maxLength != null
      ? value.length >= maxLength
        ? "text-[var(--Text-Caution)]"
        : ratio >= 0.7
          ? "text-[var(--Text-Warning)]"
          : "text-[var(--Text-Low-Emphasis)]"
      : ""
  const hasCounter = showCount === undefined ? maxLength != null : showCount

  return (
    <div
      data-slot="auto-grow-textarea"
      data-density={density}
      data-has-counter={hasCounter || undefined}
      className="relative"
    >
      <Textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={minRows}
        maxLength={maxLength}
        className={cn(
          "w-full resize-none overflow-hidden",
          density === "compact" && "min-h-0!",
          hasCounter && "pr-16",
          className,
        )}
        {...textareaProps}
      />
      {hasCounter && (
        <span
          aria-hidden="true"
          data-slot="auto-grow-textarea-counter"
          className={cn(
            "absolute right-2 bottom-2 typo-body-xs tabular-nums pointer-events-none select-none",
            counterColor,
          )}
        >
          {value.length}
          {maxLength != null ? ` / ${maxLength}` : ""}
        </span>
      )}
    </div>
  )
}
