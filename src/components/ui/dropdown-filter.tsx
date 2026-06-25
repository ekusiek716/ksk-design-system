import * as React from "react"
import { cn } from "@/lib/utils"

export interface DropdownFilterOption<K extends string = string> {
  key: K
  label: string
  /**
   * label の左に表示する任意アイコン（iconsax 等）。色は currentColor を継承するため
   * チップ active 時は自動で白抜きになる。サイズは要素側で指定すること（例: `<Element3 size={16} />`）。
   * チップ（選択中 option）と選択肢リストの両方に表示される。未指定ならテキストのみ＝従来挙動。
   */
  icon?: React.ReactNode
}

export interface DropdownFilterProps<K extends string = string> {
  label: string
  value: K | "all"
  options: DropdownFilterOption<K>[]
  onSelect: (key: K | "all") => void
  /** "すべて" オプションを非表示にする */
  hideAll?: boolean
  allLabel?: string
  /**
   * 選択 key を表示用テキストに変換する (例: enum key → 日本語ラベル)。
   * 未指定なら options から label を引く。
   */
  getDisplayLabel?: (key: K) => string
  /** 選択中は値のみ表示 (例: "カテゴリ別")。プレフィックス "ラベル: " を省略。 */
  valueOnly?: boolean
  /**
   * この値と一致するときは「未絞り込み」扱いとし、active 色を当てずラベルだけ表示する。
   * 例: "追加順" を pristine とすれば、追加順のときは「並び替え」と表示し pristine 配色に。
   */
  pristineValue?: K
  className?: string
}

function DropdownFilter<K extends string = string>({
  label,
  value,
  options,
  onSelect,
  hideAll = false,
  allLabel = "すべて",
  getDisplayLabel,
  valueOnly = false,
  pristineValue,
  className,
}: DropdownFilterProps<K>) {
  const [open, setOpen] = React.useState(false)
  const btnRef = React.useRef<HTMLButtonElement>(null)
  const [pos, setPos] = React.useState({ top: 0, left: 0 })

  // pristineValue が指定されている場合は、その値も "active 扱いしない"
  const isActive = value !== "all" && value !== pristineValue
  const selectedOption = options.find((o) => o.key === value)
  const resolveLabel = (k: K): string => (getDisplayLabel ? getDisplayLabel(k) : (selectedOption?.label ?? String(k)))
  const displayLabel = isActive
    ? (valueOnly ? resolveLabel(value as K) : `${label}: ${resolveLabel(value as K)}`)
    : label

  const handleOpen = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setPos({ top: rect.bottom + 4, left: rect.left })
    }
    setOpen((v) => !v)
  }

  const handleSelect = (key: K | "all") => {
    onSelect(key)
    setOpen(false)
  }

  return (
    <div data-slot="dropdown-filter" data-active={isActive || undefined} className={cn("flex-shrink-0", className)}>
      <button
        ref={btnRef}
        type="button"
        onClick={handleOpen}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          "h-9 rounded-full px-4 typo-label-sm flex items-center gap-1.5 transition-all duration-200",
          isActive
            ? "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)]"
            : "bg-[var(--Surface-Primary)] border border-[var(--Border-Low-Emphasis)] text-[var(--Text-Medium-Emphasis)]"
        )}
      >
        {isActive && selectedOption?.icon && (
          <span className="shrink-0 flex items-center">{selectedOption.icon}</span>
        )}
        {displayLabel}
        <svg
          aria-hidden
          className={cn("w-3 h-3 transition-transform duration-200", open && "rotate-180")}
          viewBox="0 0 12 12"
          fill="none"
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="閉じる"
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <ul
            role="listbox"
            className="fixed z-50 bg-[var(--Surface-Primary)] border border-[var(--Border-Low-Emphasis)] rounded-2xl shadow-[var(--shadow-lg)] py-1 max-h-[60vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-150"
            style={{ top: pos.top, left: Math.min(pos.left, (typeof window !== "undefined" ? window.innerWidth : 375) - 200), width: 200 }}
          >
            {!hideAll && (
              <li>
                <button
                  type="button"
                  role="option"
                  aria-selected={value === "all"}
                  onClick={() => handleSelect("all" as K | "all")}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2.5 typo-body-sm transition-colors hover:bg-[var(--Surface-Secondary)]",
                    value === "all" ? "text-[var(--Brand-Primary)]" : "text-[var(--Text-High-Emphasis)]"
                  )}
                >
                  <span>{allLabel}</span>
                  {value === "all" && <span aria-hidden className="text-[var(--Brand-Primary)]">✓</span>}
                </button>
              </li>
            )}
            {options.map((opt) => (
              <li key={opt.key}>
                <button
                  type="button"
                  role="option"
                  aria-selected={value === opt.key}
                  onClick={() => handleSelect(opt.key)}
                  className={cn(
                    "w-full flex items-center justify-between gap-2 px-4 py-2.5 typo-body-sm transition-colors hover:bg-[var(--Surface-Secondary)]",
                    value === opt.key ? "text-[var(--Brand-Primary)]" : "text-[var(--Text-High-Emphasis)]"
                  )}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    {opt.icon && <span className="shrink-0 flex items-center">{opt.icon}</span>}
                    <span className="truncate">{opt.label}</span>
                  </span>
                  {value === opt.key && <span aria-hidden className="text-[var(--Brand-Primary)] flex-shrink-0">✓</span>}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export { DropdownFilter }
