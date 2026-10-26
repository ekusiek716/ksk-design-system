import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { ScrollArea } from "./scroll-area"
import { cn } from "@/lib/utils"
import { useKskLabels } from "./ksk-labels"

export interface MultiSelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface MultiSelectProps {
  options: MultiSelectOption[]
  value?: string[]
  onChange?: (values: string[]) => void
  /** トリガーのプレースホルダー。省略時は KskLabelsProvider の `multiSelectPlaceholder`（Provider 無しは "選択してください"。locale="en" で "Select"） */
  placeholder?: string
  /** 検索欄のプレースホルダー。省略時は KskLabelsProvider の `multiSelectSearchPlaceholder`（Provider 無しは "検索..."。locale="en" で "Search..."） */
  searchPlaceholder?: string
  /** 候補が 0 件のときの表示。省略時は KskLabelsProvider の `multiSelectEmpty`（Provider 無しは "該当なし"。locale="en" で "No results"） */
  emptyLabel?: string
  disabled?: boolean
  className?: string
  /** 選択済みチップの最大表示数（超えると "+N" で省略） @default 3 */
  maxDisplay?: number
  /** 選択済みをクリアするボタンを表示 @default true */
  clearable?: boolean
  /** クリアボタンの aria-label。省略時は KskLabelsProvider の `multiSelectClear`（Provider 無しは "選択をクリア"。locale="en" で "Clear selection"） */
  clearLabel?: string
  /**
   * trigger のスクリーンリーダー向けラベル（issue #426）。
   * 未指定時は未選択なら placeholder、選択済みならチップの表示テキストがそのまま読み上げられる。
   */
  triggerLabel?: string
  /** トリガーボタンの id。FormField の htmlFor と合わせるとラベル押下でフォーカスできる。 */
  id?: string
  /** true でトリガーにエラー枠（Border-Caution）を出す。FormField の error から自動で渡される。 */
  "aria-invalid"?: React.AriaAttributes["aria-invalid"]
  /** エラー文・説明文の id。FormField から自動で渡される。 */
  "aria-describedby"?: string
}

function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder: placeholderProp,
  searchPlaceholder: searchPlaceholderProp,
  emptyLabel: emptyLabelProp,
  disabled = false,
  className,
  maxDisplay = 3,
  clearable = true,
  clearLabel: clearLabelProp,
  triggerLabel,
  id,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: MultiSelectProps) {
  const defaultLabels = useKskLabels()
  const emptyLabel = emptyLabelProp ?? defaultLabels.multiSelectEmpty
  const clearLabel = clearLabelProp ?? defaultLabels.multiSelectClear
  const placeholder = placeholderProp ?? defaultLabels.multiSelectPlaceholder
  const searchPlaceholder = searchPlaceholderProp ?? defaultLabels.multiSelectSearchPlaceholder
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  const filtered = query.trim()
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options

  const toggle = (v: string) => {
    if (value.includes(v)) {
      onChange?.(value.filter((x) => x !== v))
    } else {
      onChange?.([...value, v])
    }
  }

  const selectedLabels = value
    .map((v) => options.find((o) => o.value === v)?.label)
    .filter(Boolean) as string[]

  const displayChips = selectedLabels.slice(0, maxDisplay)
  const overflowCount = selectedLabels.length - displayChips.length
  const showClearButton = clearable && value.length > 0 && !disabled

  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) setQuery("") }}>
      <div className="relative w-full">
        <PopoverTrigger asChild>
          <button
            ref={triggerRef}
            id={id}
            type="button"
            data-slot="multi-select-trigger"
            disabled={disabled}
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-label={triggerLabel ?? (value.length === 0 ? placeholder : undefined)}
            aria-describedby={ariaDescribedBy}
            aria-invalid={ariaInvalid}
            className={cn(
              "relative flex min-h-12 w-full flex-wrap items-center gap-1.5 rounded-lg border border-[var(--Border-Control,var(--Border-Medium-Emphasis))] bg-[var(--Surface-Primary)] px-3 py-2 pr-10 typo-body-md transition-colors focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)] text-left",
              showClearButton && "pr-16",
              open
                ? "border-[var(--Border-Accent-Primary)] ring-[3px] ring-[var(--Focus-High-Emphasis)]"
                : "border-[var(--Border-Control,var(--Border-Medium-Emphasis))] hover:border-[var(--Border-High-Emphasis)]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "aria-invalid:border-[var(--Border-Caution)] aria-invalid:ring-[var(--Caution-Base)] aria-invalid:focus-visible:ring-[var(--Caution-Base)]",
              className
            )}
          >
            {value.length === 0 ? (
              <span className="text-[var(--Text-Low-Emphasis)] flex-1">{placeholder}</span>
            ) : (
              <>
                {displayChips.map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1 h-6 px-2 rounded-full bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)] typo-label-xs"
                  >
                    {label}
                  </span>
                ))}
                {overflowCount > 0 && (
                  <span className="inline-flex items-center h-6 px-2 rounded-full bg-[var(--Surface-Tertiary)] text-[var(--Text-Medium-Emphasis)] typo-label-xs">
                    +{overflowCount}
                  </span>
                )}
                <span className="flex-1" />
              </>
            )}
            <span className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center">
              <svg
                width="16" height="16" viewBox="0 0 16 16" fill="none"
                className={cn("text-[var(--Object-Medium-Emphasis)] transition-transform", open && "rotate-180")}
                aria-hidden
              >
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </PopoverTrigger>
        {showClearButton && (
          <button
            type="button"
            data-slot="multi-select-clear"
            aria-label={clearLabel}
            onClick={() => {
              onChange?.([])
              // クリアボタンは選択が空になると消える（showClearButton が false になる）。
              // フォーカスが body に落ちないよう、押した直後にトリガーへ戻す。
              triggerRef.current?.focus()
            }}
            className="absolute right-9 top-1/2 z-[1] flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-[var(--Object-Low-Emphasis)] transition-colors hover:bg-[var(--Surface-Secondary)] hover:text-[var(--Object-High-Emphasis)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--Focus-High-Emphasis)]"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
              <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
        onOpenAutoFocus={(e) => { e.preventDefault(); inputRef.current?.focus() }}
      >
        {/* Search */}
        <div className="flex items-center border-b border-[var(--Border-Low-Emphasis)] px-3 gap-2">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-[var(--Object-Low-Emphasis)] shrink-0" aria-hidden>
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="flex h-10 flex-1 bg-transparent focus-visible:outline-hidden typo-body-md text-[var(--Text-High-Emphasis)] placeholder:text-[var(--Text-Low-Emphasis)]"
          />
        </div>
        {/* List — 常時表示のスクロールバー付き（type="always"） */}
        <ScrollArea type="always" className="max-h-60">
        <div role="listbox" aria-multiselectable="true" className="p-1">
          {filtered.length === 0 ? (
            <div className="py-6 text-center typo-body-sm text-[var(--Text-Low-Emphasis)]">{emptyLabel}</div>
          ) : (
            filtered.map((opt) => {
              const checked = value.includes(opt.value)
              return (
                <button
                  key={opt.value}
                  role="option"
                  aria-selected={checked}
                  disabled={opt.disabled}
                  onClick={() => toggle(opt.value)}
                  className={cn(
                    "relative flex w-full cursor-default items-center gap-3 rounded-sm py-2 px-3 typo-body-md focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)] transition-colors text-left",
                    "hover:bg-[var(--Surface-Secondary)] focus:bg-[var(--Surface-Secondary)]",
                    "disabled:pointer-events-none disabled:opacity-50"
                  )}
                >
                  <span className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded border border-[var(--Border-Control,var(--Border-Medium-Emphasis))] transition-colors",
                    checked
                      ? "bg-[var(--Brand-Primary)] border-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)]"
                      : "border-[var(--Border-Control,var(--Border-Medium-Emphasis))]"
                  )}>
                    {checked && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M8.5 2L4 7L1.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  {opt.label}
                </button>
              )
            })
          )}
        </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

export { MultiSelect }
