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
 * - contenteditable（"false" 以外。値なし・"plaintext-only" も編集可能）
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
  // jsdom は isContentEditable を実装しないため属性でも判定する
  if (element.isContentEditable) return true
  return element.closest('[contenteditable]:not([contenteditable="false"])') !== null
}

const COARSE_POINTER_QUERY = "(pointer: coarse)"

/**
 * タッチ主体の端末で、ソフトキーボードを出す入力要素にフォーカスがある間 true を返す（issue #700）。
 *
 * `useVisualViewportKeyboardInset()` は visualViewport の縮みと `html[data-kb-open]` で
 * キーボードを検知するが、iOS Safari のフォーカス直後（縮む前）や、ソフトキーボードが
 * ビューポートを縮めない端末（Android の一部）では検知できない。ソフトキーボードは
 * 編集可能な要素にフォーカスが無ければ出ないので、フォーカスを「出ている」の代わりに見る。
 *
 * マウス主体の PC（`(pointer: coarse)` に一致しない）では常に false。PC でフォーカスしただけで
 * ナビを隠すと、入力のたびに画面下の要素が消えて見えるため。
 *
 * `enabled=false` の間はリスナーを付けず false を返す。SSR では false。
 */
function useSoftKeyboardFocus(enabled = true): boolean {
  const [focused, setFocused] = React.useState(false)

  React.useEffect(() => {
    if (!enabled || typeof document === "undefined") return
    const query = typeof window.matchMedia === "function" ? window.matchMedia(COARSE_POINTER_QUERY) : null
    const evaluate = (target: Element | null) => {
      setFocused(Boolean(query?.matches) && isSoftKeyboardTarget(target))
    }
    // focusin の target はフォーカスを得た要素。shadow DOM 内は getActiveElement で辿る
    const onFocusIn = () => evaluate(getActiveElement())
    // focusout の時点では activeElement はまだ移っていない（body になる）ので、
    // 移り先の relatedTarget で判定する（null = どこにもフォーカスが無い）
    const onFocusOut = (event: FocusEvent) => evaluate(event.relatedTarget as Element | null)
    const onPointerTypeChange = () => evaluate(getActiveElement())

    evaluate(getActiveElement())
    document.addEventListener("focusin", onFocusIn)
    document.addEventListener("focusout", onFocusOut)
    query?.addEventListener?.("change", onPointerTypeChange)
    return () => {
      document.removeEventListener("focusin", onFocusIn)
      document.removeEventListener("focusout", onFocusOut)
      query?.removeEventListener?.("change", onPointerTypeChange)
      setFocused(false)
    }
  }, [enabled])

  return enabled && focused
}

export { isSoftKeyboardTarget, useSoftKeyboardFocus }
