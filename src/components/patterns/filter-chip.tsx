import { Chip } from "@/components/patterns/chip"
import { cn } from "@/lib/utils"

export interface FilterChipProps {
  /** チップに表示するラベル */
  label: string
  /** active 時に "ラベル: 値" 形式で併記する値 (任意) */
  value?: string
  /** 絞り込み中（強調表示）か */
  isActive?: boolean
  /** クリック時のコールバック。active なときも呼ばれる（再タップで off にしたい場合は外側で判断）。 */
  onClick: () => void
  className?: string
}

/**
 * FilterChip — FilterBar の中で使う「絞り込み中かどうか」をトグルするチップ。
 *
 * - 非 active: outline スタイル、label のみ
 * - active: filled (Brand 色)、`value` 指定時は "ラベル: 値"
 * - 再タップ時は親が onClick で off に戻す想定（onRemove は廃止 — `◯` と `×` が
 *   視覚的に混乱するためフィードバックを受け統一）
 *
 * @example
 * <FilterChip label="エリア" value="渋谷" isActive onClick={clearAreaFilter} />
 *
 * isActive を切り替えても同じ `<button>` を保つ（key を isActive に紐付けない）。
 * そのためキーボードで押した直後もフォーカスが残り、aria-pressed の変化が
 * そのまま支援技術に伝わる。Chip は selected を props から毎回描くだけで
 * 状態を持たないので、作り直さなくても見た目は正しく切り替わる（issue #784）。
 */
export function FilterChip({ label, value, isActive, onClick, className }: FilterChipProps) {
  return (
    <Chip
      size="lg"
      selected={!!isActive}
      variant={isActive ? "filled" : "outline"}
      onClick={onClick}
      className={cn("flex-shrink-0", className)}
    >
      {isActive && value ? `${label}: ${value}` : label}
    </Chip>
  )
}
