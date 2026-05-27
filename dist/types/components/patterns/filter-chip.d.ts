export interface FilterChipProps {
    /** チップに表示するラベル */
    label: string;
    /** active 時に "ラベル: 値" 形式で併記する値 (任意) */
    value?: string;
    /** 絞り込み中（強調表示）か */
    isActive?: boolean;
    /** クリック時のコールバック。active なときも呼ばれる（再タップで off にしたい場合は外側で判断）。 */
    onClick: () => void;
    className?: string;
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
 * 内部で key を active 状態に紐付けて強制再マウントするため、
 * isActive=false に戻したときに Chip の selected キャッシュが残らない。
 */
export declare function FilterChip({ label, value, isActive, onClick, className }: FilterChipProps): import("react/jsx-runtime").JSX.Element;
