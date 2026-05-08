import * as React from "react"
import { cn } from "@/lib/utils"

interface TextareaProps extends React.ComponentProps<"textarea"> {
  /** 入力内容に合わせて高さを自動伸縮する */
  autoGrow?: boolean
}

function Textarea({ className, autoGrow, onChange, ...props }: TextareaProps) {
  const ref = React.useRef<HTMLTextAreaElement>(null)

  const grow = React.useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }, [])

  React.useEffect(() => {
    if (autoGrow) grow()
  }, [autoGrow, grow, props.value, props.defaultValue])

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (autoGrow) grow()
      onChange?.(e)
    },
    [autoGrow, grow, onChange]
  )

  return (
    <textarea
      ref={ref}
      data-slot="textarea"
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
      {...props}
    />
  )
}

export { Textarea }
export type { TextareaProps }
