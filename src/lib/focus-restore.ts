import { getActiveElement } from "./active-element"

/**
 * オーバーレイ（Dialog / Sheet / AlertDialog）を閉じたときに、開く直前に操作していた
 * 要素（opener）へフォーカスを戻すための共通処理。
 *
 * - 記録は「開くたびに上書き」する。DialogContent / SheetContent は open に関係なく
 *   マウントされ続けるため、「ref が空のときだけ記録」にすると、一覧の行ごとの
 *   ボタンから 1 つの Dialog / Sheet を開く構成で、2 回目以降も初回の opener へ
 *   戻ってしまう（issue #789。AlertDialog は #657 で同じ形に直済み）。
 * - 閉じるときは ref から取り出して null に戻す（開閉をまたいで古い opener を残さない）。
 *   ただし Sheet は Content の変種の付け替え（開いたまま）でも onCloseAutoFocus が発火する
 *   ため、Sheet 側は「実際に閉じた」ときだけ取り出す（sheet.tsx の handleSheetCloseAutoFocus）。
 * - opener が DOM から消えている・disabled・inert の中にある・body そのもの
 *   （Safari / iOS ではクリックでボタンにフォーカスが乗らず body が記録される）の
 *   ときは強制復帰しない。preventDefault せず Radix の既定（Trigger への復帰）に任せる。
 * - 戻すときは `preventScroll: true`。画面外の行へ一覧がスクロールで飛ばないようにする。
 */

type OpenerRef = { current: HTMLElement | null } | null | undefined

/**
 * 開くときに呼ぶ。今フォーカスがある要素で ref を毎回上書きする。
 *
 * 例外として、戻せる opener を既に記録していて、今のフォーカスが body / html（どこにも
 * 無い）のときは上書きしない。Sheet は開いたまま Content の変種（snap / swipe / 通常）が
 * 切り替わると Content が付け替わり、新しい側の onOpenAutoFocus が「古い Content が消えて
 * body に落ちた」瞬間に呼ばれる。ここで上書きすると本来の opener を失う（#789 レビュー指摘）。
 * 通常の開閉では閉じるときに ref を null に戻すため、この例外は付け替え時にしか効かない。
 */
export function captureOpener(ref: OpenerRef): void {
  if (!ref || typeof document === "undefined") return
  const active = getActiveElement() as HTMLElement | null
  const doc = document
  const activeIsNowhere = active == null || active === doc.body || active === doc.documentElement
  if (activeIsNowhere && canRestoreFocusTo(ref.current)) return
  ref.current = active
}

/** 閉じるときに呼ぶ。記録していた opener を取り出し、ref を null に戻す。 */
export function takeOpener(ref: OpenerRef): HTMLElement | null {
  if (!ref) return null
  const opener = ref.current
  ref.current = null
  return opener
}

/** opener へ戻してよいか（DOM 上にあり、disabled / inert ではなく、body / html でない）。 */
export function canRestoreFocusTo(opener: HTMLElement | null): opener is HTMLElement {
  if (!opener?.isConnected) return false
  const doc = opener.ownerDocument
  if (opener === doc.body || opener === doc.documentElement) return false
  return !opener.matches(":disabled, [inert], [inert] *")
}

/**
 * onCloseAutoFocus の中で呼ぶ。opener へ戻せるときだけ既定の復帰を止めて
 * `focus({ preventScroll: true })` する。戻せないときは何もしない（Radix 既定に任せる）。
 */
export function restoreOpenerFocus(event: Event, opener: HTMLElement | null): void {
  if (!canRestoreFocusTo(opener)) return
  event.preventDefault()
  opener.focus({ preventScroll: true })
}
