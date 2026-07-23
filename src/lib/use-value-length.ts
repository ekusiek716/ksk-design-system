import * as React from "react"

type CountableElement = HTMLInputElement | HTMLTextAreaElement
type CountableValue = string | number | readonly string[] | undefined

function assignRef<T>(ref: React.Ref<T> | undefined, node: T | null) {
  if (typeof ref === "function") {
    ref(node)
  } else if (ref && typeof ref === "object") {
    ;(ref as React.RefObject<T | null>).current = node
  }
}

/**
 * showCount 用の内部フック。
 *
 * controlled value は props、uncontrolled value は実 DOM を正本にする。
 * 後者により react-hook-form の reset() など、ref 経由で直接 value が
 * 書き換わるケースにも追従する。IME composition 中は表示値を固定し、
 * compositionend で確定後の DOM 値へ同期する。
 */
export function useValueLength<T extends CountableElement>({
  enabled,
  value,
  defaultValue,
  forwardedRef,
}: {
  enabled: boolean
  value: CountableValue
  defaultValue: CountableValue
  forwardedRef: React.Ref<T> | undefined
}) {
  const isControlled = value !== undefined
  const initialLength = defaultValue != null ? String(defaultValue).length : 0
  const elementRef = React.useRef<T | null>(null)
  const composingRef = React.useRef(false)
  const [domLength, setDomLength] = React.useState(initialLength)
  const [isComposing, setIsComposing] = React.useState(false)
  const [frozenLength, setFrozenLength] = React.useState(initialLength)

  const ref = React.useCallback(
    (node: T | null) => {
      elementRef.current = node
      assignRef(forwardedRef, node)
    },
    [forwardedRef],
  )

  const syncFromDom = React.useCallback(() => {
    if (composingRef.current) return
    const node = elementRef.current
    if (!node) return
    setDomLength(node.value.length)
  }, [])

  const beginComposition = React.useCallback(() => {
    setFrozenLength(
      elementRef.current?.value.length ??
        (isControlled ? String(value ?? "").length : domLength),
    )
    composingRef.current = true
    setIsComposing(true)
  }, [domLength, isControlled, value])

  const endComposition = React.useCallback(() => {
    composingRef.current = false
    setIsComposing(false)
    const node = elementRef.current
    if (!node) return
    setDomLength(node.value.length)
  }, [])

  const getElement = React.useCallback(() => elementRef.current, [])

  // RHF の reset()/setValue() は DOM property を直接更新して再 render する。
  // MutationObserver では property 更新を拾えないため、render 後に実値を照合する。
  React.useLayoutEffect(() => {
    if (!enabled || isControlled || composingRef.current) return
    syncFromDom()
  })

  const currentLength = isControlled ? String(value ?? "").length : domLength

  return {
    ref,
    getElement,
    length: isComposing ? frozenLength : currentLength,
    syncFromDom,
    beginComposition,
    endComposition,
  }
}
