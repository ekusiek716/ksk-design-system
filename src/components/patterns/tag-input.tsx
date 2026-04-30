import * as React from "react"
import { cn } from "@/lib/utils"

interface TagInputProps {
  value?: string[]
  onChange?: (tags: string[]) => void
  placeholder?: string
  disabled?: boolean
  /** 最大タグ数 */
  max?: number
  /** 重複タグを許可するか */
  allowDuplicates?: boolean
  className?: string
}

function TagInput({
  value = [],
  onChange,
  placeholder = "タグを入力して Enter",
  disabled = false,
  max,
  allowDuplicates = false,
  className,
}: TagInputProps) {
  const [input, setInput] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const addTag = React.useCallback(
    (raw: string) => {
      const tag = raw.trim()
      if (!tag) return
      if (!allowDuplicates && value.includes(tag)) return
      if (max !== undefined && value.length >= max) return
      onChange?.([...value, tag])
      setInput("")
    },
    [value, onChange, allowDuplicates, max]
  )

  const removeTag = React.useCallback(
    (index: number) => {
      onChange?.(value.filter((_, i) => i !== index))
    },
    [value, onChange]
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag(input)
    }
    if (e.key === "Backspace" && input === "" && value.length > 0) {
      removeTag(value.length - 1)
    }
    if (e.key === ",") {
      e.preventDefault()
      addTag(input)
    }
  }

  return (
    <div
      data-slot="tag-input"
      className={cn(
        "flex flex-wrap gap-1.5 min-h-12 w-full rounded-lg border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] px-3 py-2 transition-colors",
        "focus-within:ring-[3px] focus-within:ring-[var(--Focus-High-Emphasis)]/50 focus-within:border-[var(--Border-Accent-Primary)]",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full bg-[var(--Brand-Ultra-Light)] text-[var(--Text-Accent-Primary)] typo-label-sm"
        >
          {tag}
          {!disabled && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(i) }}
              className="flex items-center justify-center w-3.5 h-3.5 rounded-full hover:bg-[var(--Brand-Light)] transition-colors"
              aria-label={`${tag} を削除`}
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </span>
      ))}
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => { if (input.trim()) addTag(input) }}
        disabled={disabled || (max !== undefined && value.length >= max)}
        placeholder={value.length === 0 ? placeholder : ""}
        className="flex-1 min-w-24 bg-transparent outline-none typo-body-md text-[var(--Text-High-Emphasis)] placeholder:text-[var(--Text-Low-Emphasis)] disabled:cursor-not-allowed"
        aria-label="タグ入力"
      />
    </div>
  )
}

export { TagInput }
export type { TagInputProps }
