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

/**
 * props はユニオンで宣言する（`Base & (A | B)` の交差型にしない）。
 * `PillToggle` と同じ理由で、`scripts/check-native-parity.mjs` の正規表現ベースの
 * props 抽出が交差型だと最初の `{` しか own-props body として読まないため。
 *
 * `selectionMode="single"` はメンバーが 2 つある（issue #418）:
 * - **スカラー版（推奨）**: `value: T | null`・`onChange: (v: T | null) => void`
 * - **配列版（非推奨・後方互換）**: `value: T[]`・`onChange: (v: T[]) => void`。
 *   #352 で `selectionMode="single"` を導入したとき value は `T[]` 固定だったので、
 *   既にそれを使っている呼び出しをコンパイルエラーにしないために残してある。
 *   スカラー版に一本化すると型エラーになるだけでなく、`useState<T[]>` の setter に
 *   スカラーが流れて実行時にも静かに壊れるため、value の形を見て onChange の形を合わせる。
 */
type ChipSelectorProps<T extends string = string> =
  | {
      options: ChipSelectorOption<T>[]
      /**
       * 選択の意味論（issue #352）。`QuickActionGrid` / `ActionTile` と同じ語彙。
       * `"single"` は排他選択で、グループが `role="radiogroup"`、チップが
       * `role="radio"` + `aria-checked` になり、roving tabindex と矢印キー移動が有効。
       */
      selectionMode: "single"
      /** 選択中の値。単一選択なので**スカラー**（未選択は `null` / `undefined`） */
      value: T | null | undefined
      /**
       * 選択が変わったときに呼ばれる。選択中のチップを再タップして解除したときは `null`。
       */
      onChange: (value: T | null) => void
      size?: "sm" | "md" | "lg"
      className?: string
      /** 単一選択では無効（複数選択時のみ有効） */
      max?: never
      /** @deprecated `selectionMode` を使うこと。単一選択では指定できない */
      multiple?: never
    }
  | {
      options: ChipSelectorOption<T>[]
      selectionMode: "single"
      /**
       * 非推奨（issue #418）。単一選択ではスカラー（`T | null`）を渡すこと。
       * 配列は v1.61 以前との後方互換で受け付けているだけで、開発ビルドで警告が出る。
       *
       * `@deprecated` タグを付けていないのは意図的で、`value` / `onChange` という
       * 名前そのものは現役の API だから。台帳（contracts/deprecations.json）へ
       * 載せると check-migration が消費側の全 `value` 属性を残件として数えてしまう。
       */
      value: T[]
      /** 非推奨（issue #418）。スカラー版の `value` / `onChange` を使うこと */
      onChange: (value: T[]) => void
      size?: "sm" | "md" | "lg"
      className?: string
      max?: never
      multiple?: never
    }
  | {
      options: ChipSelectorOption<T>[]
      /**
       * 選択の意味論（issue #352）。`"multiple"` は複数選択で、チップは
       * `aria-pressed`（トグルボタン）になる。
       *
       * 未指定のときは後方互換のため従来どおり `multiple`（既定 `true`）から導出する。
       * 指定した場合は `multiple` より優先される。
       */
      selectionMode?: "multiple"
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
      /** 最大選択数（複数選択時のみ有効） */
      max?: number
      size?: "sm" | "md" | "lg"
      className?: string
    }

/**
 * ChipSelector — チップ列の選択部品。`flex-wrap` で**折り返す**ので選択肢数の上限が無い。
 *
 * ### 単一選択（issue #418）
 * ```tsx
 * const [category, setCategory] = React.useState<Category | null>(null)
 * <ChipSelector selectionMode="single" options={CATEGORIES} value={category} onChange={setCategory} />
 * ```
 * `PillToggle` は 1 行固定の segmented control で 2〜4 択専用。**5 択以上・折り返しが
 * 要る単一選択はこの `selectionMode="single"` を使う**（支出カテゴリのような 9 択など）。
 *
 * ### 複数選択（既定）
 * ```tsx
 * <ChipSelector selectionMode="multiple" options={TAGS} value={tags} onChange={setTags} max={3} />
 * ```
 *
 * 「選択中の 1 つだけ表示して、タップで候補を開く」折りたたみ型が要る場合は
 * `CollapsibleChipField` を使う（issue #419）。
 */
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

  // 単一選択は value がスカラーでも配列でも受ける（issue #418）。
  // 内部は常に配列で扱い、onChange だけ「受け取った形」に合わせて返す。
  // こうしないと v1.61 で `selectionMode="single"` + `T[]` を採用済みの
  // 呼び出しが、スカラーを渡されて静かに壊れる（setState<T[]> に string が入る）。
  const isLegacyArrayValue = Array.isArray(value)
  const selectedValues: T[] = React.useMemo(
    () => (isLegacyArrayValue ? (value as T[]) : value == null ? [] : [value as T]),
    [isLegacyArrayValue, value]
  )

  const emit = React.useCallback(
    (next: T[]) => {
      if (isSingle && !isLegacyArrayValue) {
        // スカラー API: 選択なしは null
        ;(onChange as (v: T | null) => void)(next[0] ?? null)
        return
      }
      ;(onChange as (v: T[]) => void)(next)
    },
    [onChange, isSingle, isLegacyArrayValue]
  )

  const toggle = React.useCallback((v: T) => {
    if (isMultiple) {
      if (selectedValues.includes(v)) {
        emit(selectedValues.filter((x) => x !== v))
      } else {
        if (max && selectedValues.length >= max) return
        emit([...selectedValues, v])
      }
    } else {
      emit(selectedValues.includes(v) ? [] : [v])
    }
  }, [selectedValues, emit, isMultiple, max])

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
    if (isDev() && selectedValues.length > 1) {
      // #39 の footgun（単一選択のつもりで既定の複数選択を使い、value[0] を読む実装が
      // 静かに壊れる）を開発時に見えるようにする（issue #352）
      console.warn(
        `[ksk-ds] ChipSelector: selectionMode="single" は排他選択ですが、選択中の値が ${selectedValues.length} 個あります。value を 1 つに絞るか selectionMode="multiple" を使ってください。`
      )
    }
    if (isDev() && isLegacyArrayValue) {
      // issue #418: 単一選択の value は配列でなくスカラー（`T | null`）が正。
      // 配列も後方互換で動くが、新規実装で使われ続けないよう開発ビルドで知らせる。
      console.warn(
        '[ksk-ds] ChipSelector: selectionMode="single" に配列の value を渡しています。スカラー（value={v} / onChange={(v) => ...}、未選択は null）へ移行してください（issue #418。配列は後方互換で動作します）。'
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
        const selected = selectedValues.includes(opt.value)
        const disabled = !selected && !!max && selectedValues.length >= max
        return (
          <Chip
            key={opt.value}
            size={size}
            variant={selected ? "accent" : "outline"}
            selected={selected}
            disabled={disabled}
            removable={selected && isMultiple}
            onRemove={() => emit(selectedValues.filter((x) => x !== opt.value))}
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
