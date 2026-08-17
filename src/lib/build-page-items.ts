/** buildPageItems が返す1要素。数値はページ番号、"ellipsis" は畳んだ区間を表す。 */
export type PaginationPageItem = number | "ellipsis"

/**
 * 現在ページ・総ページ数から「ページ番号 + 省略記号」の並びを組み立てる（issue #357）。
 * ページ番号を並べるコンポーネント（`Pagination` 等）が個別に手書きしがちな畳み込みロジックを
 * DS 非依存の純粋関数として1つに決める。
 *
 * 規則:
 *   - 先頭ページと末尾ページは常に表示する（現在地の把握と端への移動のため）
 *   - 現在ページの前後を `siblingCount` 個ずつ表示する（既定 1）
 *   - 表示区間と端の間に **2ページ以上**の隙間があるときだけ "ellipsis" を挟む。
 *     隙間が1ページだけなら省略記号と同じ幅を食うので、そのページ番号自体を表示する
 *     （`1 … 3 4 5` ではなく `1 2 3 4 5`）
 *   - 返す並びは常に昇順で、番号の重複を含まない
 *
 * 入力が範囲外でも落とさず、描画できる並びへ丸める（`pageCount` が 0 以下なら空配列、
 * `page` は 1..pageCount にクランプ）。ページ番号はサーバー由来の値で渡されることが多く、
 * 端数の食い違いで画面を壊さないため。
 */
export function buildPageItems(
  page: number,
  pageCount: number,
  { siblingCount = 1 }: { siblingCount?: number } = {}
): PaginationPageItem[] {
  const total = Math.floor(pageCount)
  if (!Number.isFinite(total) || total <= 0) return []

  const siblings = Math.max(0, Math.floor(siblingCount))
  const current = Math.min(Math.max(Math.floor(page) || 1, 1), total)

  const windowStart = Math.max(2, current - siblings)
  const windowEnd = Math.min(total - 1, current + siblings)

  const items: PaginationPageItem[] = [1]

  // 先頭との隙間が1ページだけなら、省略記号ではなくそのページ番号を見せる
  if (windowStart > 3) items.push("ellipsis")
  else if (windowStart === 3) items.push(2)

  for (let p = windowStart; p <= windowEnd; p += 1) items.push(p)

  if (windowEnd < total - 2) items.push("ellipsis")
  else if (windowEnd === total - 2) items.push(total - 1)

  if (total > 1) items.push(total)

  return items
}
