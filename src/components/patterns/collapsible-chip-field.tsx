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

  // 折りたたみ/展開で chip の折り返し行数が変わると行エリアの高さが一瞬でガクッと
  // 変わって見える。展開状態が切り替わった直後に前後の実測高さを取り、
  // height を 200ms ease-out（DS の入場モーション基準）でアニメーションさせる。
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
    el.style.transition = "height 200ms ease-out"
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

  // 「label は 1 行目の chip と縦センター」。展開して多数の chip が折り返しても
  // label は最上行 chip と垂直中央が合うように、leading-[36px]（chip 行の
  // min-h=36px）で label の line-height を行高に合わせ、親 flex は items-start にする。
  const leading = label ? (
    <span
      className="typo-label-sm text-[var(--Text-Medium-Emphasis)] flex-shrink-0 w-20 whitespace-nowrap leading-[36px]"
    >
      {label}
    </span>
  ) : (
    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center" style={{ height: 36 }}>
      {icon}
    </div>
  )

  return (
    <div data-slot="collapsible-chip-field" className="flex items-start gap-4 py-3">
      {leading}
      <div ref={rowRef} className="flex gap-2 flex-1 flex-wrap min-h-[36px] items-center">
        {visible.map((key) => (
          <Chip
            key={key}
            size="md"
            // 強制展開中は前回選択も含めて全部グレー（再選択モード感を出す）
            selected={!forcedExpand && selected === key}
            onClick={() => {
              if (forcedExpand) {
                // 展開中: タップした chip を選択して折りたたみ
                onSelect(key)
                setExpansion({ selected: key, forced: false })
              } else if (selected === key) {
                // 選択中 chip を再タップ:
                // - clearable: 解除
                // - 非 clearable かつ折りたたみ表示: 強制展開（再選択モードへ）
                // - 非 clearable かつ alwaysExpanded: 何もしない
                //   （全 chip が見えているので再選択モードは不要。forcedExpand を立てると
                //     値は選択されたままなのに選択表示だけ消える視覚不整合になる）
                if (onClear) onClear()
                else if (!alwaysExpanded) setExpansion({ selected, forced: true })
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
