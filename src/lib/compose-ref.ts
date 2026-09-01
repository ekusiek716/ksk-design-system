import * as React from "react"

/**
 * ref に node を書き込み、コールバック ref が cleanup を返したらそれを返す。
 *
 * React 19 のコールバック ref は cleanup を返せる（返した場合 React は
 * ref(null) を呼ばず cleanup を呼ぶ）。DS の peer は react ^19.0.0 に
 * 固定されているため（#502）、その挙動を前提にしてよい。
 */
export function assignRef<T>(
  ref: React.Ref<T> | undefined,
  node: T | null
): (() => void) | undefined {
  if (typeof ref === "function") {
    const cleanup = ref(node)
    return typeof cleanup === "function" ? cleanup : undefined
  }
  if (ref && typeof ref === "object") {
    ;(ref as React.RefObject<T | null>).current = node
  }
  return undefined
}

/**
 * 内部で要素を掴みたいコンポーネントが、consumer の `ref` も殺さずに
 * 同じ node を渡すための合成 ref。
 *
 * 必ず cleanup を返すので、React は detach 時に `ref(null)` ではなく
 * cleanup を呼ぶ。そのため consumer 側の解除もこの中で行う:
 *
 * - consumer が cleanup を返していれば、それを呼ぶ
 * - 返していなければ（object ref / 旧来のコールバック ref）`null` を書き戻す
 *
 * @param internal 内部側の setter。attach 時に node、detach 時に null で呼ばれる
 * @param external consumer から渡された ref（未指定可）
 */
export function useComposedRef<T>(
  internal: (node: T | null) => void,
  external: React.Ref<T> | undefined
): (node: T | null) => () => void {
  return React.useCallback(
    (node: T | null) => {
      internal(node)
      const consumerCleanup = assignRef(external, node)
      return () => {
        internal(null)
        if (consumerCleanup) consumerCleanup()
        else assignRef(external, null)
      }
    },
    [internal, external]
  )
}
