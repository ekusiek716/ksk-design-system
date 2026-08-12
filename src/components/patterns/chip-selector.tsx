import * as React from "react"
import { cn } from "@/lib/utils"
import { Chip } from "@/components/patterns/chip"

interface ChipSelectorOption<T extends string = string> {
  label: string
  value: T
  icon?: React.ReactNode
}

/**
 * 選択の意味論（issue #352）。`QuickActionGrid` / `ActionTile`（issue #318）と同じ語彙。
 * - `"single"`: 排他選択。グループが `role="radiogroup"`、チップが `role="radio"` + `aria-checked`
 * - `"multiple"`: 複数選択。チップは `aria-pressed`（トグルボタン）
 */
type ChipSelectorSelectionMode = "single" | "multiple"

/**
 * 開発ビルド判定。DS は node の型を持たないので globalThis 経由で参照する。
 * `proc` の存在を先に必須にする（quick-action-grid と同じ形）。省略して
 * `proc?.env?.NODE_ENV !== "production"` と書くと、process 自体が無い環境
 * （バンドラが NODE_ENV を静的置換しない素のブラウザ配布など）で undefined
 * との比較が true になり、本番でも警告が出続ける。
 */
const isDev = () => {
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
  return Boolean(proc) && proc!.env?.NODE_ENV !== "production"
}

/**
 * セレクタ直下に限らない（consumer がラップしても拾う）チップ収集。
 * ただし**入れ子の ChipSelector の中は拾わない** — 内側のチップは内側の
 * セレクタが管理するもので、外側の roving tabindex に混ぜると Tab の
 * 止まり方が壊れる（#318 の collectTiles と同じ理由）。
 */
function collectChips(container: HTMLElement): HTMLButtonElement[] {
  return Array.from(
    container.querySelectorAll<HTMLButtonElement>('button[data-slot="chip"]')
  ).filter((chip) => chip.closest('[data-slot="chip-selector"]') === container)
}

interface ChipSelectorProps<T extends string = string> {
  options: ChipSelectorOption<T>[]
  value: T[]
  onChange: (value: T[]) => void
  /**
   * 複数選択を許可するか。
   *
   * @deprecated issue #352。`selectionMode` を使うこと
   * （`multiple={false}` は `selectionMode="single"`、`multiple` は `selectionMode="multiple"`）。
   * 後方互換のため型からは消していないが、既定が `true`（複数選択）で
   * 「渡し忘れると静かに壊れる側」に倒れているため、新規実装では使わない。
   *
   * @default true
   */
  multiple?: boolean
  /**
   * 選択の意味論（issue #352）。`QuickActionGrid` / `ActionTile` と同じ語彙。
   * - `"single"`: 排他選択。グループが `role="radiogroup"`、チップが `role="radio"` + `aria-checked`。
   *   roving tabindex と矢印キー移動が有効になる
   * - `"multiple"`: 複数選択。チップは `aria-pressed`（トグルボタン）
   *
   * 未指定のときは後方互換のため従来どおり `multiple`（既定 `true`）から導出する。
   * 指定した場合は `multiple` より優先される。
   */
  selectionMode?: ChipSelectorSelectionMode
  /** 最大選択数（複数選択時のみ有効） */
  max?: number
  size?: "sm" | "md" | "lg"
  className?: string
}

function ChipSelector<T extends string = string>({
  options,
  value,
  onChange,
  multiple = true,
  selectionMode,
  max,
  size = "md",
  className,
}: ChipSelectorProps<T>) {
  // selectionMode が指定されていればそれが正本。未指定なら従来の multiple から導出するので、
  // 既存の呼び出しは 1 行も変えずに同じ DOM / 同じ挙動になる（issue #352）。
  const isMultiple = selectionMode ? selectionMode === "multiple" : multiple
  const isSingle = !isMultiple
  const containerRef = React.useRef<HTMLDivElement | null>(null)

  const toggle = React.useCallback((v: T) => {
    if (isMultiple) {
      if (value.includes(v)) {
        onChange(value.filter((x) => x !== v))
      } else {
        if (max && value.length >= max) return
        onChange([...value, v])
      }
    } else {
      onChange(value.includes(v) ? [] : [v])
    }
  }, [value, onChange, isMultiple, max])

  // roving tabindex: 選択中のチップだけ tabIndex=0（未選択なら先頭の有効チップ）。
  // 依存配列を持たせず毎レンダー同期する（#318 と同じ）。
  React.useEffect(() => {
    const container = containerRef.current
    if (!isSingle || !container) return
    const chips = collectChips(container)
    const selectedIndex = chips.findIndex((c) => c.getAttribute("aria-checked") === "true")
    const activeIndex = selectedIndex >= 0 ? selectedIndex : chips.findIndex((c) => !c.disabled)
    chips.forEach((chip, index) => {
      chip.tabIndex = index === activeIndex ? 0 : -1
    })
    if (isDev() && value.length > 1) {
      // #39 の footgun（単一選択のつもりで既定の複数選択を使い、value[0] を読む実装が
      // 静かに壊れる）を開発時に見えるようにする（issue #352）
      console.warn(
        `[ksk-ds] ChipSelector: selectionMode="single" は排他選択ですが、選択中の値が ${value.length} 個あります。value を 1 つに絞るか selectionMode="multiple" を使ってください。`
      )
    }
  })

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isSingle || event.defaultPrevented) return
    const delta =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0
    if (delta === 0) return
    const container = containerRef.current
    if (!container) return
    const chips = collectChips(container).filter((chip) => !chip.disabled)
    const current = (event.target as HTMLElement | null)?.closest<HTMLButtonElement>(
      'button[data-slot="chip"]'
    )
    const currentIndex = current ? chips.indexOf(current) : -1
    if (currentIndex < 0 || chips.length === 0) return
    event.preventDefault()
    // radiogroup は端で折り返す（WAI-ARIA APG の radio group パターン）
    const next = chips[(currentIndex + delta + chips.length) % chips.length]
    chips.forEach((chip) => {
      chip.tabIndex = chip === next ? 0 : -1
    })
    next.focus()
    // 移動先を選択する（radio group では移動と選択が一体）。
    // ただし ChipSelector の単一選択は「選択済みを再タップすると解除」なので、
    // 既に選択済みのチップへ移動したときに click すると選択が消える。移動だけにする。
    if (next.getAttribute("aria-checked") !== "true") next.click()
  }

  return (
    <div
      data-slot="chip-selector"
      ref={containerRef}
      // 単一選択は radiogroup。未指定 + multiple 既定なら従来どおり group（非破壊）
      role={isSingle ? "radiogroup" : "group"}
      onKeyDown={handleKeyDown}
      className={cn("flex flex-wrap gap-2", className)}
    >
      {options.map((opt) => {
        const selected = value.includes(opt.value)
        const disabled = !selected && !!max && value.length >= max
        return (
          <Chip
            key={opt.value}
            size={size}
            variant={selected ? "accent" : "outline"}
            selected={selected}
            disabled={disabled}
            removable={selected && isMultiple}
            onRemove={() => onChange(value.filter((x) => x !== opt.value))}
            onClick={() => toggle(opt.value)}
            role={isSingle ? "radio" : undefined}
            aria-checked={isSingle ? selected : undefined}
            // radio に aria-pressed を併記すると意味論が二重になるので排他にする。
            // undefined を明示的に渡すことで Chip 側の既定（aria-pressed={selected}）も打ち消す。
            aria-pressed={isSingle ? undefined : selected}
          >
            {opt.icon && <span className="shrink-0">{opt.icon}</span>}
            {opt.label}
          </Chip>
        )
      })}
    </div>
  )
}

export { ChipSelector }
export type { ChipSelectorProps, ChipSelectorOption, ChipSelectorSelectionMode }
