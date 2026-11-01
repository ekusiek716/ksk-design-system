import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Label } from "./label"
import { cn } from "@/lib/utils"
import { formatKskLabel, useKskLabels } from "./ksk-labels"

export interface ComboboxOption {
  value: string
  label: string
  disabled?: boolean
  /**
   * 検索で当てたい別名（読み・表記ゆれ・略称など）。画面には出ない。
   * 例: `{ value: "shibuya", label: "渋谷", keywords: ["しぶや", "shibuya"] }`。
   * 既定の絞り込みは label と keywords のどれかに部分一致すれば当てる（issue #783）。
   */
  keywords?: string[]
}

export interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onChange?: (value: string) => void
  /** トリガーのプレースホルダー。省略時は KskLabelsProvider の `comboboxPlaceholder`（Provider 無しは "選択してください"。locale="en" で "Select"） */
  placeholder?: string
  /** 検索欄のプレースホルダー。省略時は KskLabelsProvider の `comboboxSearchPlaceholder`（Provider 無しは "検索..."。locale="en" で "Search..."） */
  searchPlaceholder?: string
  /** 候補が 0 件のときの表示。省略時は KskLabelsProvider の `comboboxEmpty`（Provider 無しは "該当なし"。locale="en" で "No results"） */
  emptyLabel?: string
  disabled?: boolean
  className?: string
  /**
   * トリガーの読み上げ用の補足（例: "駅を選ぶ"）。画面には出ない。
   * 読み上げ名は「外部の `<label htmlFor={id}>` → triggerLabel → 選択中の値」の順に並ぶ
   * （例: 「駅を選ぶ 渋谷」）。未選択のときは、外部ラベルも triggerLabel も無い場合だけ placeholder を名前にする。
   */
  triggerLabel?: string
  /** トリガーボタンの id。FormField の htmlFor と合わせるとラベル押下でフォーカスでき、ラベルが読み上げ名の先頭に入る。 */
  id?: string
  /**
   * 絞り込みを差し替える。`query` は前後の空白を除いた入力そのまま（正規化しない）。
   * 省略時は label と keywords の部分一致。大文字小文字・全角半角（NFKC）・ひらがな/カタカナを区別せず、
   * 漢字に挟まれた「ヶ / ケ / ヵ / が」（市ヶ谷 / 市ケ谷・霞が関 / 霞ケ関）を同一視する。
   */
  filter?: (option: ComboboxOption, query: string) => boolean
  /** true でトリガーにエラー枠（Border-Caution）を出す。FormField の error から自動で渡される。 */
  "aria-invalid"?: React.AriaAttributes["aria-invalid"]
  /** エラー文・説明文の id。FormField から自動で渡される。 */
  "aria-describedby"?: string
}

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect

const HAN = /\p{Script=Han}/u
// 文言ではなく文字コードの表なので、コードポイントで持つ（日本語直書きの検査対象外）。
const KATAKANA_FIRST = 0x30a1 // ァ
const KATAKANA_LAST = 0x30f6 // ヶ
const KATAKANA_TO_HIRAGANA = 0x60
// カタカナ→ひらがな変換後の「ヶ / ケ / ヵ / が」（ゖ U+3096 / け U+3051 / ゕ U+3095 / が U+304C）。
const KE_CANONICAL = String.fromCharCode(0x3096)
const KE_VARIANTS = new Set([0x3096, 0x3051, 0x3095, 0x304c].map((c) => String.fromCharCode(c)))

/** 文脈に依らない正規化: 大文字小文字・全角半角（NFKC）・カタカナ→ひらがな。 */
function normalizeBase(text: string): string {
  return Array.from(text.normalize("NFKC").toLowerCase(), (c) => {
    const code = c.charCodeAt(0)
    return code >= KATAKANA_FIRST && code <= KATAKANA_LAST ? String.fromCharCode(code - KATAKANA_TO_HIRAGANA) : c
  }).join("")
}

/**
 * 表記ゆれ用の正規化。normalizeBase に加えて、漢字に挟まれた「ヶ/ケ/ヵ/が」を同じ字にする
 * （ノ/の・長音等は広げすぎになるため扱わない）。直後が文字列の終わりでも同一視する
 * （「市ヶ」まで打った途中でも当たるように）。`isQuery` のときは先頭の直前を漢字とみなす
 * （「ヶ谷」「が関」と打っても候補側の「漢字 + ケ」に当たるように）。
 */
function normalizeKeVariants(base: string, isQuery: boolean): string {
  const chars = Array.from(base)
  return chars
    .map((c, i) => {
      if (!KE_VARIANTS.has(c)) return c
      const prev = chars[i - 1]
      const next = chars[i + 1]
      const prevIsHan = prev == null ? isQuery : HAN.test(prev)
      const nextIsHanOrEnd = next == null || HAN.test(next)
      return prevIsHan && nextIsHanOrEnd ? KE_CANONICAL : c
    })
    .join("")
}

/**
 * 既定の絞り込み。表記ゆれの同一視は「追加で当てる」だけにし、素の部分一致は失わない:
 * 文脈に依らない正規化での部分一致、または「ヶ/ケ/ヵ/が」もそろえた正規化での部分一致のどちらかで当てる。
 */
function defaultFilter(option: ComboboxOption, query: string): boolean {
  const qBase = normalizeBase(query)
  const qKe = normalizeKeVariants(qBase, true)
  return [option.label, ...(option.keywords ?? [])].some((s) => {
    const sBase = normalizeBase(s)
    return sBase.includes(qBase) || normalizeKeVariants(sBase, false).includes(qKe)
  })
}

function Combobox({
  options,
  value,
  onChange,
  placeholder: placeholderProp,
  searchPlaceholder: searchPlaceholderProp,
  emptyLabel: emptyLabelProp,
  disabled = false,
  className,
  triggerLabel,
  id,
  filter,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: ComboboxProps) {
  const defaultLabels = useKskLabels()
  const emptyLabel = emptyLabelProp ?? defaultLabels.comboboxEmpty
  const placeholder = placeholderProp ?? defaultLabels.comboboxPlaceholder
  const searchPlaceholder = searchPlaceholderProp ?? defaultLabels.comboboxSearchPlaceholder
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  // キーボードで選んでいる候補（aria-activedescendant）。index でなく value で持ち、
  // 絞り込みで並びが変わっても取り違えないようにする。
  const [activeValue, setActiveValue] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const baseId = React.useId()
  const searchInputId = `${baseId}-search`
  const listboxId = `${baseId}-listbox`
  const valueId = `${baseId}-value`
  const hintId = `${baseId}-hint`
  const optionId = (index: number) => `${baseId}-option-${index}`

  const selected = options.find((o) => o.value === value)

  const trimmedQuery = query.trim()
  const match = filter ?? defaultFilter
  const filtered = trimmedQuery ? options.filter((o) => match(o, trimmedQuery)) : options
  const activeIndex = activeValue == null ? -1 : filtered.findIndex((o) => o.value === activeValue && !o.disabled)

  // 外部の <label htmlFor={id}>。aria-labelledby を使うと native label が名前計算から外れるため、
  // その id を aria-labelledby の先頭に入れ直す（id が無い label には付与する）。
  const [externalLabelIds, setExternalLabelIds] = React.useState("")
  useIsomorphicLayoutEffect(() => {
    const labels = triggerRef.current?.labels
    const ids = labels
      ? Array.from(labels).map((label, i) => {
          if (!label.id) label.id = `${baseId}-label-${i}`
          return label.id
        })
      : []
    const next = ids.join(" ")
    setExternalLabelIds((prev) => (prev === next ? prev : next))
  })

  const hasNameSource = externalLabelIds !== "" || triggerLabel != null
  const triggerLabelledBy =
    [externalLabelIds || null, triggerLabel != null ? hintId : null, selected || !hasNameSource ? valueId : null]
      .filter(Boolean)
      .join(" ")

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    setQuery("")
    setActiveValue(next && selected && !selected.disabled ? selected.value : null)
  }

  const handleSelect = (opt: ComboboxOption) => {
    if (opt.disabled) return
    onChange?.(opt.value)
    setOpen(false)
    setQuery("")
    setActiveValue(null)
  }

  const handleQueryChange = (next: string) => {
    setQuery(next)
    // 絞り込んだら先頭の選べる候補をアクティブにし、そのまま Enter で確定できるようにする。
    const nextTrimmed = next.trim()
    if (nextTrimmed) {
      const first = options.find((o) => !o.disabled && match(o, nextTrimmed))
      setActiveValue(first ? first.value : null)
    } else {
      setActiveValue(selected && !selected.disabled ? selected.value : null)
    }
  }

  const moveActive = (direction: 1 | -1) => {
    const enabled = filtered.filter((o) => !o.disabled)
    if (enabled.length === 0) return
    const current = enabled.findIndex((o) => o.value === activeValue)
    const nextIndex =
      current === -1
        ? direction === 1
          ? 0
          : enabled.length - 1
        : (current + direction + enabled.length) % enabled.length
    setActiveValue(enabled[nextIndex].value)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 日本語入力の変換中の Enter / 矢印は IME に任せる。
    if (e.nativeEvent.isComposing || e.keyCode === 229) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      moveActive(1)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      moveActive(-1)
    } else if (e.key === "Enter") {
      const opt = activeIndex >= 0 ? filtered[activeIndex] : undefined
      if (!opt) return
      e.preventDefault()
      handleSelect(opt)
      triggerRef.current?.focus()
    }
  }

  // アクティブな候補をスクロール領域内に入れる。
  React.useEffect(() => {
    if (!open || activeIndex < 0) return
    const el = document.getElementById(`${baseId}-option-${activeIndex}`)
    el?.scrollIntoView?.({ block: "nearest" })
  }, [open, activeIndex, baseId])

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          ref={triggerRef}
          id={id}
          type="button"
          data-slot="combobox-trigger"
          disabled={disabled}
          aria-expanded={open}
          aria-labelledby={triggerLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-invalid={ariaInvalid}
          className={cn(
            "flex h-[var(--Field-Height-Md)] w-full items-center justify-between rounded-[var(--Field-Radius)] border border-[var(--Border-Control,var(--Border-Medium-Emphasis))] bg-[var(--Surface-Primary)] px-[var(--Field-Padding-X-Md)] typo-body-md transition-colors focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]",
            open
              ? "border-[var(--Border-Accent-Primary)] ring-[3px] ring-[var(--Focus-High-Emphasis)]"
              : "border-[var(--Border-Control,var(--Border-Medium-Emphasis))] hover:border-[var(--Border-High-Emphasis)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "aria-invalid:border-[var(--Border-Caution)] aria-invalid:ring-[var(--Caution-Base)] aria-invalid:focus-visible:ring-[var(--Caution-Base)]",
            selected ? "text-[var(--Text-High-Emphasis)]" : "text-[var(--Text-Low-Emphasis)]",
            className
          )}
        >
          {triggerLabel != null && (
            <span id={hintId} className="sr-only">
              {triggerLabel}
            </span>
          )}
          <span id={valueId}>{selected ? selected.label : placeholder}</span>
          <svg
            width="16" height="16" viewBox="0 0 16 16" fill="none"
            className={cn("shrink-0 text-[var(--Object-Medium-Emphasis)] transition-transform", open && "rotate-180")}
            aria-hidden
          >
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
        onOpenAutoFocus={(e) => { e.preventDefault(); inputRef.current?.focus() }}
        // Popover の中身は role="dialog" を持つが accessible name が無いと
        // 検出されない（axe: aria-dialog-name）。
        aria-label={triggerLabel ?? placeholder}
      >
        {/* Search */}
        <div className="flex items-center border-b border-[var(--Border-Low-Emphasis)] px-3 gap-2">
          <Label htmlFor={searchInputId} className="sr-only">
            {searchPlaceholder}
          </Label>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-[var(--Object-Low-Emphasis)] shrink-0" aria-hidden>
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            id={searchInputId}
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
            autoComplete="off"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder={searchPlaceholder}
            className="flex h-10 flex-1 bg-transparent focus-visible:outline-hidden typo-body-md text-[var(--Text-High-Emphasis)] placeholder:text-[var(--Text-Low-Emphasis)]"
          />
        </div>
        {/* List */}
        <div
          id={listboxId}
          role="listbox"
          aria-label={formatKskLabel(defaultLabels.comboboxOptions, { label: triggerLabel ?? placeholder })}
          className="max-h-60 overflow-y-auto p-1"
        >
          {filtered.length === 0 ? (
            <div className="py-6 text-center typo-body-sm text-[var(--Text-Low-Emphasis)]">{emptyLabel}</div>
          ) : (
            filtered.map((opt, index) => (
              <button
                key={opt.value}
                id={optionId(index)}
                type="button"
                role="option"
                aria-selected={opt.value === value}
                aria-disabled={opt.disabled || undefined}
                data-active={index === activeIndex ? "" : undefined}
                disabled={opt.disabled}
                onClick={() => handleSelect(opt)}
                className={cn(
                  "relative flex w-full cursor-default items-center rounded-sm py-2 pl-8 pr-2 typo-body-md focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)] transition-colors text-left text-[var(--Text-High-Emphasis)]",
                  "hover:bg-[var(--Surface-Secondary)] focus:bg-[var(--Surface-Secondary)] data-[active]:bg-[var(--Surface-Secondary)]",
                  "disabled:pointer-events-none disabled:opacity-50",
                  opt.value === value && "text-[var(--Text-Accent-Primary)]"
                )}
              >
                {opt.value === value && (
                  <span className="absolute left-2 flex size-4 items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                      <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
                {opt.label}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { Combobox }
