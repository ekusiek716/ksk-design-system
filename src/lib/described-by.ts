import * as React from "react"

// ============================================================================
// 子に置いた Description の aria-describedby 自動紐付け（#485）
// ----------------------------------------------------------------------------
// DialogContent / SheetContent は `description` prop を渡さないとき
// `aria-describedby={undefined}` を明示している。Radix は Content に
// `aria-describedby` が付いているのに、その id を持つ要素が DOM に無いと
// "Missing Description" を警告するため、属性ごと消して警告を抑える意図だった。
//
// ところがこの抑制は「可視の説明は子として <DialogDescription> を直接置く」と
// いう JSDoc の案内まで巻き添えにしていた。Radix の Description は Root の
// context id を自分の id として持つので、Content 側の属性さえ消さなければ
// 紐付いていたのに、undefined の明示がそれを打ち消し、スクリーンリーダーに
// 説明文が届かない（#485 で consumer が実測。回避に useId +
// aria-describedby の手動指定が必要だった）。
//
// 代替案として「undefined の明示をやめて Radix の既定に戻す」も検討したが、
// Description を置かないダイアログでは Content の aria-describedby が実在
// しない id を指したまま残る（宙ぶらりんの参照 + Radix の警告）。DS には
// 説明が概念上不要なダイアログ（確認・クイック追加等）が多く、そちらを
// 壊す方が損失が大きいので採らなかった。
//
// ここでは「Content の中に Description 要素が実在するときだけ属性を復元する」
// 後付けの紐付けにする。実在する要素の id を指すので Radix の警告条件
// （属性はあるが参照先が無い）には当たらず、Description を置いていない
// ダイアログでは属性が無いまま＝従来どおり警告も出ない。
//
// 実装が「render ではなく DOM 副作用」なのは、Description が children の任意の
// 深さ（DialogHeader の中など）に置かれうるため、render 時には存在を判定
// できないから。タイミングは 2 系統:
//   1. Content のコールバック ref（`setContentNode`）— ノードが DOM に現れた
//      その瞬間に同期で紐付ける。子の DOM は親の ref が付く時点で既に挿入
//      済みなので Description は見つかる。Radix の FocusScope による初期
//      フォーカスより前に属性が確定するので、スクリーンリーダーが「開いた
//      瞬間」に説明を読み上げられる（passive effect だと 1 フレーム遅れる）。
//   2. MutationObserver（`DescribedByLinker`）— 開いたあとに consumer 側の
//      state で Description が出入りするケースを拾う。子孫が自分の state で
//      切り替えた場合は Content 自体が再レンダーされないので、React の
//      再レンダーを当てにできない。
// ============================================================================

interface DescribedByLink {
  /** Content の `ref` に渡すコールバック ref。渡した `contentRef` にも書き込む。 */
  setContentNode: (node: HTMLElement | null) => void
  /** 現在の DOM から紐付けをやり直す（コールバック ref を自前で書く呼び出し側用）。 */
  applyDescribedBy: () => void
}

/**
 * 子に置かれた Description 要素を Content の `aria-describedby` へ紐付ける
 * （#485）。`*Primitive.Content` の `ref` に `setContentNode` を渡し、子として
 * {@link DescribedByLinker} を置いて使う。
 *
 * - `contentRef`: Content 要素を保持する ref（既存の用途と共用する）
 * - `slot`: Description の `data-slot`（例 `"dialog-description"`）
 * - `enabled`: false のときは何もしない。`description` prop 経由で内部生成した
 *   Description がある場合や、呼び出し側が `aria-describedby` を明示した場合は
 *   そちらが正なので無効化する。
 *
 * 複数の Description を子に置いた場合は最初の 1 つだけを紐付ける（aria-describedby
 * は複数 id を許容するが、DS のパターンでは説明は 1 つが前提）。
 *
 * Exported for unit testing only — not part of the public package API.
 */
export function useDescribedByLink(
  contentRef: React.RefObject<HTMLElement | null>,
  slot: string,
  enabled: boolean
): DescribedByLink {
  const fallbackId = React.useId()
  // 自分が付けた属性かどうか。呼び出し側や Radix が付けた値を消さないため。
  const appliedRef = React.useRef(false)

  const applyDescribedBy = React.useCallback(() => {
    const node = contentRef.current
    if (!node) return
    if (!enabled) {
      if (appliedRef.current) {
        node.removeAttribute("aria-describedby")
        appliedRef.current = false
      }
      return
    }
    const description = node.querySelector<HTMLElement>(`[data-slot="${slot}"]`)
    if (!description) {
      if (appliedRef.current) {
        node.removeAttribute("aria-describedby")
        appliedRef.current = false
      }
      return
    }
    // Radix の Description は Root context の id を必ず持つ。持たない実装で
    // 差し替えられている場合だけ採番する。
    if (!description.id) description.id = fallbackId
    if (node.getAttribute("aria-describedby") !== description.id) {
      node.setAttribute("aria-describedby", description.id)
    }
    appliedRef.current = true
  }, [contentRef, slot, enabled, fallbackId])

  const setContentNode = React.useCallback(
    (node: HTMLElement | null) => {
      ;(contentRef as React.MutableRefObject<HTMLElement | null>).current = node
      if (!node) {
        appliedRef.current = false
        return
      }
      applyDescribedBy()
    },
    [contentRef, applyDescribedBy]
  )

  return { setContentNode, applyDescribedBy }
}

/**
 * 開いている間だけ Description の出入りを監視する極小コンポーネント（#485）。
 * `*Primitive.Content` の子として置く（Content は Radix の Presence が開いて
 * いる間しかマウントされないので、監視も開いている間だけになる）。
 *
 * Exported for unit testing only — not part of the public package API.
 */
export function DescribedByLinker({
  contentRef,
  applyDescribedBy,
}: {
  contentRef: React.RefObject<HTMLElement | null>
  applyDescribedBy: () => void
}) {
  React.useEffect(() => {
    const node = contentRef.current
    if (!node) return
    // マウント時点の状態にも追随する（コールバック ref 経由で済んでいる場合は
    // 冪等な no-op）。
    applyDescribedBy()
    if (typeof MutationObserver === "undefined") return
    // childList/subtree のみ監視する。属性は監視しないので、この関数自身が
    // 書き込む aria-describedby / id で再発火するループにはならない。
    const observer = new MutationObserver(() => applyDescribedBy())
    observer.observe(node, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [contentRef, applyDescribedBy])
  return null
}
