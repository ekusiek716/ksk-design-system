import * as React from "react"
import { cn } from "@/lib/utils"
import { useValueLength } from "@/lib/use-value-length"

interface TextareaProps extends React.ComponentProps<"textarea"> {
  /** 入力内容に合わせて高さを自動伸縮する */
  autoGrow?: boolean
  /**
   * 文字数カウンタを表示する。maxLength とセットで使うと
   * 右下に「現在/max」を表示し、上限到達時は caution 色になる。
   */
  showCount?: boolean
}

function Textarea({
  className,
  autoGrow,
  showCount,
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
      value={value}
      defaultValue={defaultValue}
      maxLength={maxLength}
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] px-3 py-2 typo-body-md text-[var(--Text-High-Emphasis)] transition-colors",
        "placeholder:text-[var(--Text-Low-Emphasis)]",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50 focus-visible:border-[var(--Border-Accent-Primary)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-[var(--Border-Caution)]",
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
    <div data-slot="textarea-with-count" className="w-full">
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
