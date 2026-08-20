import * as React from "react"
import { Chip } from "@/components/patterns/chip"

interface CollapsibleChipFieldProps<K extends string> {
  /** leading アイコン。label 未指定時に w-6 の枠内で表示 */
  icon?: React.ReactNode
  /**
   * アイコン代わりにテキストラベルを表示。他のフィールド行と幅 w-20 を揃えて
   * レイアウトを統一する用途。
   */
  label?: string
  options: K[]
  /** undefined / "" は未選択扱い（全 chip 展開） */
  selected: K | undefined | ""
  onSelect: (key: K) => void
  /** 選択中の chip を再タップしたとき呼ぶ。指定がない場合は再選択用に展開のみ。 */
  onClear?: () => void
  getLabel: (key: K) => string
  getIcon?: (key: K) => string
  /** 候補数が少なく、選択後も比較対象を見せたいフィールド用。常に全展開。 */
  alwaysExpanded?: boolean
  /**
   * 展開時の選択グループ（`role="radiogroup"`）のアクセシブル名（issue #419）。
   *
   * 未指定なら `label` を使う。`icon` だけで `label` を持たない行
   * （タスク詳細シートのようなアイコン先頭の行）では名前が無くなるので、
   * **その場合は必ず指定すること**（「カテゴリ」「担当者」など）。
   */
  ariaLabel?: string
}

/**
 * CollapsibleChipField — 折りたたみ式選択フィールド。
 *
 * UX:
 * - 未選択 → 全 chip をグレーで展開表示
 * - 選択あり → 選択した 1 chip だけ表示（折りたたみ）
 * - 選択中の chip を再タップ → 解除（onClear）して全展開に戻る。
 *   onClear 未指定の場合は再選択用に展開のみ（required field 対応）
 *
 * leading（icon/label）は w-20 固定幅、行は min-h-[36px] で高さ固定。
 * 内部で DS の Chip（selected/onClick 制御）を使用。
 *
 * ### アクセシビリティ（issue #419）
 * - 折りたたみ中の 1 チップは disclosure（開閉トリガ）として `aria-expanded={false}` を持つ
 * - 展開中は行が `role="radiogroup"`（名前は `ariaLabel` / `label`）、各チップが
 *   `role="radio"` + `aria-checked`。矢印キーで移動でき、roving tabindex が効く
 * - 展開すると選択中のチップへフォーカスが移り、**Escape で畳んで**元のチップへ戻る
 * - 常時展開（`alwaysExpanded`）と未選択時は開閉トリガが存在しないので `aria-expanded` は付けない
 *
 * 折りたたまずに全選択肢を並べたいだけなら `ChipSelector`（`selectionMode="single"`）を使う。
 */
function CollapsibleChipField<K extends string>({
  icon,
  label,
  options,
  selected,
  onSelect,
  onClear,
  getLabel,
  getIcon,
  alwaysExpanded = false,
  ariaLabel,
}: CollapsibleChipFieldProps<K>) {
  const hasSelection = selected !== undefined && selected !== null && selected !== ""
  const [expansion, setExpansion] = React.useState({ selected, forced: false })
  if (expansion.selected !== selected) {
    setExpansion({ selected, forced: false })
  }
  const forcedExpand = expansion.selected === selected && expansion.forced
  // selected が options に含まれない場合（外部データとの不整合等）は、
  // 折りたたむと chip が 1 つも表示されない手詰まりになるため展開扱いにする
  const selectionInOptions = hasSelection && options.includes(selected as K)
  const expanded = alwaysExpanded || !selectionInOptions || forcedExpand
  const visible = expanded ? options : options.filter((k) => k === selected)
  // 開閉トリガが存在する（＝畳める）状態か。常時展開・未選択のときは畳む先が無いので
  // disclosure ではなくただの選択グループとして扱い、aria-expanded / Escape を付けない。
  const collapsible = !alwaysExpanded && selectionInOptions
  const groupLabel = ariaLabel ?? label

  // 折りたたみ/展開で chip の折り返し行数が変わると行エリアの高さが一瞬でガクッと
  // 変わって見える。展開状態が切り替わった直後に前後の実測高さを取り、
  // height を --Motion-Duration-Base + --Motion-Easing-Standard（DS の入場モーション基準）でアニメーションさせる。
  // prefers-reduced-motion 時はアニメーションしない。
  const rowRef = React.useRef<HTMLDivElement>(null)
  const prevHeightRef = React.useRef<number | null>(null)
  React.useLayoutEffect(() => {
    const el = rowRef.current
    if (!el) return
    const prev = prevHeightRef.current
    const next = el.offsetHeight
    prevHeightRef.current = next
    if (prev === null || prev === next) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    el.style.height = `${prev}px`
    el.style.overflow = "hidden"
    void el.offsetHeight // reflow を挟んで transition を効かせる
    el.style.transition = "height var(--Motion-Duration-Base) var(--Motion-Easing-Standard)"
    el.style.height = `${next}px`
    const done = () => {
      el.style.height = ""
      el.style.overflow = ""
      el.style.transition = ""
      el.removeEventListener("transitionend", done)
    }
    el.addEventListener("transitionend", done)
    return () => {
      el.removeEventListener("transitionend", done)
      done()
    }
  }, [expanded, visible.length])

  // フォーカス管理（issue #419）。展開したら選択中のチップへ、畳んだら
  // 折りたたみ後の 1 チップへフォーカスを戻す。マウント直後にフォーカスを
  // 奪わないよう、ユーザー操作でだけ立つフラグを見てから移動する。
  const moveFocusRef = React.useRef(false)
  const focusChip = React.useCallback((key: string) => {
    rowRef.current
      ?.querySelector<HTMLButtonElement>(
        `button[data-slot="chip"][data-value="${CSS.escape(key)}"]`
      )
      ?.focus()
  }, [])
  React.useEffect(() => {
    if (!moveFocusRef.current) return
    moveFocusRef.current = false
    // 展開時は選択中のチップ、折りたたみ時は唯一表示されているチップ（＝選択中）。
    // どちらも「選択中の key」を指すので同じ処理でよい。
    if (hasSelection) focusChip(selected as K)
  }, [forcedExpand, hasSelection, selected, focusChip])

  const collapse = React.useCallback(() => {
    moveFocusRef.current = true
    setExpansion({ selected, forced: false })
  }, [selected])

  // Escape での折りたたみは window の capture リスナーで処理する（issue #419）。
  // Radix の Dialog/Sheet は document capture で Escape を拾って即 onDismiss するため、
  // React の onKeyDown（bubble）で preventDefault しても間に合わず、Dialog 内で使うと
  // 「畳む」と「Dialog が閉じる」が同時に起きる。window capture は document capture より
  // 先に発火するので、ここで preventDefault すれば Radix 側（defaultPrevented を尊重する）
  // が dismiss をスキップする。
  React.useEffect(() => {
    if (!(collapsible && forcedExpand)) return
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return
      const root = rowRef.current
      if (!root || !root.contains(document.activeElement)) return
      event.preventDefault()
      event.stopPropagation()
      collapse()
    }
    window.addEventListener("keydown", onEscape, { capture: true })
    return () => window.removeEventListener("keydown", onEscape, { capture: true })
  }, [collapsible, forcedExpand, collapse])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.defaultPrevented) return
    if (!expanded) return
    // radiogroup の矢印キー移動（WAI-ARIA APG。端で折り返す）
    const delta =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0
    if (delta === 0) return
    const chips = [
      ...(rowRef.current?.querySelectorAll<HTMLButtonElement>('button[data-slot="chip"]') ?? []),
    ].filter((chip) => !chip.disabled)
    const current = (event.target as HTMLElement | null)?.closest<HTMLButtonElement>(
      'button[data-slot="chip"]'
    )
    const currentIndex = current ? chips.indexOf(current) : -1
    if (currentIndex < 0 || chips.length === 0) return
    event.preventDefault()
    chips[(currentIndex + delta + chips.length) % chips.length].focus()
  }

  // 「label は 1 行目の chip と縦センター」。展開して多数の chip が折り返しても
  // label は最上行 chip と垂直中央が合うように、leading-[44px]（chip 行の
  // min-h=44px）で label の line-height を行高に合わせ、親 flex は items-start にする。
  // 44px は Chip(md) の margin box の高さ。Chip は見た目 32px のピルの上下に
  // my-1.5 を持ち 44px のタッチターゲットを予約するので、行高もそれに揃える
  // （36px のままだと label が chip より 4px 上にずれる）。
  const leading = label ? (
    <span
      className="typo-label-sm text-[var(--Text-Medium-Emphasis)] flex-shrink-0 w-20 whitespace-nowrap leading-[44px]"
    >
      {label}
    </span>
  ) : (
    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center" style={{ height: 44 }}>
      {icon}
    </div>
  )

  return (
    <div data-slot="collapsible-chip-field" className="flex items-start gap-4 py-3">
      {leading}
      <div
        ref={rowRef}
        onKeyDown={handleKeyDown}
        // 全選択肢が見えている状態だけが選択グループ。折りたたみ中は
        // 「開閉トリガが 1 つあるだけ」なので radiogroup を名乗らない
        // （選択肢 1 件の radiogroup は SR に選択肢が 1 つしか無いと伝えてしまう）。
        role={expanded ? "radiogroup" : undefined}
        aria-label={expanded ? groupLabel : undefined}
        className="flex gap-2 flex-1 flex-wrap min-h-11 items-center"
      >
        {visible.map((key, index) => (
          <Chip
            key={key}
            size="md"
            data-value={key}
            // 強制展開中は前回選択も含めて全部グレー（再選択モード感を出す）
            selected={!forcedExpand && selected === key}
            role={expanded ? "radio" : undefined}
            aria-checked={expanded ? selected === key : undefined}
            // radio / disclosure に aria-pressed を併記すると意味論が二重になる。
            // undefined を明示的に渡して Chip 側の既定（aria-pressed={selected}）を打ち消す。
            aria-pressed={undefined}
            // 開閉トリガにだけ aria-expanded を付ける。折りたたみ中は表示中の 1 チップ、
            // 強制展開中は「そこから開いた」選択中チップが同じトリガにあたる。
            aria-expanded={collapsible ? (selected === key ? forcedExpand : undefined) : undefined}
            // roving tabindex: 展開中の radiogroup は Tab で 1 回だけ止まる
            tabIndex={
              expanded ? (hasSelection ? (selected === key ? 0 : -1) : index === 0 ? 0 : -1) : undefined
            }
            onClick={() => {
              if (forcedExpand) {
                // 展開中: タップした chip を選択して折りたたみ
                onSelect(key)
                moveFocusRef.current = true
                setExpansion({ selected: key, forced: false })
              } else if (selected === key) {
                // 選択中 chip を再タップ:
                // - clearable: 解除
                // - 非 clearable かつ折りたたみ表示: 強制展開（再選択モードへ）
                // - 非 clearable かつ alwaysExpanded: 何もしない
                //   （全 chip が見えているので再選択モードは不要。forcedExpand を立てると
                //     値は選択されたままなのに選択表示だけ消える視覚不整合になる）
                if (onClear) onClear()
                else if (!alwaysExpanded) {
                  moveFocusRef.current = true
                  setExpansion({ selected, forced: true })
                }
              } else {
                // 折りたたみ中だが visible は selected 1 件のみなので通常ここには来ない
                onSelect(key)
              }
            }}
          >
            {getIcon ? `${getIcon(key)} ` : ""}
            {getLabel(key)}
          </Chip>
        ))}
      </div>
    </div>
  )
}

export { CollapsibleChipField }
export type { CollapsibleChipFieldProps }
