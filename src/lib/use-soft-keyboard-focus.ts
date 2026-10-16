import * as React from "react"
import { getActiveElement } from "./active-element"

/**
 * ソフトキーボードを出す input の type（issue #700）。
 * type 無し（= text）も含む。checkbox / radio / range / date 系 / color / file 等は
 * 文字キーボードを出さないので含めない（date 系は OS のピッカーが出る）。
 */
const SOFT_KEYBOARD_INPUT_TYPES = new Set(["", "text", "search", "email", "tel", "url", "password", "number"])

/**
 * その要素へのフォーカスでソフトキーボードが出るか。
 *
 * - テキスト系 input / textarea（読み取り専用・無効は除く）
 * - contenteditable（true / 値なし / plaintext-only と、その編集可能性を継承する子要素）
 * - `inputmode="none"` はキーボードを出さない合図なので除く
 */
function isSoftKeyboardTarget(element: Element | null | undefined): boolean {
  if (!element || typeof HTMLElement === "undefined" || !(element instanceof HTMLElement)) return false
  if (element.getAttribute("inputmode") === "none") return false
  if (element instanceof HTMLTextAreaElement) return !element.readOnly && !element.disabled
  if (element instanceof HTMLInputElement) {
    if (element.readOnly || element.disabled) return false
    return SOFT_KEYBOARD_INPUT_TYPES.has((element.getAttribute("type") ?? "").trim().toLowerCase())
  }
  // ブラウザの判定は false も尊重する。jsdom の未実装時だけ属性継承を辿る。
  if (typeof element.isContentEditable === "boolean") return element.isContentEditable
  let editable = element.closest("[contenteditable]")
  while (editable) {
    const value = editable.getAttribute("contenteditable")?.toLowerCase()
    if (value === "false") return false
    if (value === "" || value === "true" || value === "plaintext-only") return true
    // 未知の値は HTML の継承状態。false の境界を飛び越えない。
    editable = editable.parentElement?.closest("[contenteditable]") ?? null
  }
  return false
}

/**
 * ソフトキーボードが出る端末の目安: 主ポインタが指（coarse）で、hover できない。
 * pointer / hover は入力機器の能力であり、物理キーボード接続やソフトキーボードの有無は判別できない。
 */
const SOFT_KEYBOARD_DEVICE_QUERY = "(pointer: coarse) and (hover: none)"

/**
 * タッチ主体の端末で、ソフトキーボードを出す入力要素にフォーカスがある間 true を返す（issue #700）。
 *
 * `useVisualViewportKeyboardInset()` は visualViewport の縮みと `html[data-kb-open]` で
 * キーボードを検知するが、iOS Safari のフォーカス直後（縮む前）や、ソフトキーボードが
 * ビューポートを縮めない端末（Android の一部）では検知できない。ソフトキーボードは
 * 編集可能な要素にフォーカスが無ければ出ないので、フォーカスを「出ている」の代わりに見る。
 *
 * `(pointer: coarse) and (hover: none)` に一致しない端末では常に false。
 * 一致する端末でも物理キーボードのみを使う場合があるため、呼び出し側で enabled=false にできる。
 *
 * `enabled=false` の間はリスナーを付けず false を返す。SSR では false。
 */
function useSoftKeyboardFocus(enabled = true): boolean {
  const [focused, setFocused] = React.useState(false)

  React.useEffect(() => {
    if (!enabled || typeof document === "undefined") return
    const query = typeof window.matchMedia === "function" ? window.matchMedia(SOFT_KEYBOARD_DEVICE_QUERY) : null
    const evaluate = (target: Element | null) => {
      setFocused(Boolean(query?.matches) && isSoftKeyboardTarget(target))
    }
    // focusout の relatedTarget が null（ウィンドウ外・iframe・shadow DOM・別の要素へ
    // プログラムで移す途中など）でも、すぐ false にせず次のフレームで実際のフォーカス先を見る。
    // 入力欄 → 入力欄の移動でナビが一瞬出てまた消える（ちらつく）のも防ぐ
    let frame: number | null = null
    const schedule = (cb: () => void) => {
      if (frame !== null) cancel(frame)
      frame = typeof requestAnimationFrame === "function"
        ? requestAnimationFrame(cb)
        : (setTimeout(cb, 0) as unknown as number)
    }
    const cancel = (id: number) => {
      if (typeof cancelAnimationFrame === "function") cancelAnimationFrame(id)
      clearTimeout(id)
    }
    const onFocusIn = () => {
      if (frame !== null) {
        cancel(frame)
        frame = null
      }
      evaluate(getActiveElement())
    }
    const onFocusOut = (event: FocusEvent) => {
      const next = event.relatedTarget as Element | null
      if (next) {
        evaluate(next)
        return
      }
      schedule(() => {
        frame = null
        evaluate(getActiveElement())
      })
    }
    const onDeviceChange = () => evaluate(getActiveElement())

    evaluate(getActiveElement())
    document.addEventListener("focusin", onFocusIn)
    document.addEventListener("focusout", onFocusOut)
    query?.addEventListener?.("change", onDeviceChange)
    return () => {
      document.removeEventListener("focusin", onFocusIn)
      document.removeEventListener("focusout", onFocusOut)
      query?.removeEventListener?.("change", onDeviceChange)
      if (frame !== null) cancel(frame)
      setFocused(false)
    }
  }, [enabled])

  return enabled && focused
}

export { SOFT_KEYBOARD_DEVICE_QUERY, isSoftKeyboardTarget, useSoftKeyboardFocus }
