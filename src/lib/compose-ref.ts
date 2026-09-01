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
 * **返すコールバック ref の identity は固定する**（issue #516）。React は
 * コールバック ref の identity が render 間で変わると detach → re-attach を
 * 行うため、`internal` / `external` を依存にして毎 render 作り直すと、
 * consumer が毎 render 新しい関数を渡す呼び出し面（Radix の composeRefs が
 * 生成する合成関数など）で ref chain 全体の付け外しが増える。identity を
 * 固定し、差し替えは insertion effect で node を付け替えることで吸収する。
 *
 * @param internal 内部側の setter。attach 時に node、detach 時に null で呼ばれる
 * @param external consumer から渡された ref（未指定可）
 */
export function useComposedRef<T>(
  internal: (node: T | null) => void,
  external: React.Ref<T> | undefined
): (node: T | null) => () => void {
  const internalRef = React.useRef(internal)
  const externalRef = React.useRef(external)
  const nodeRef = React.useRef<T | null>(null)
  // いま node を渡してある internal setter（detach 時に null を渡す相手）。
  const attachedInternalRef = React.useRef<((node: T | null) => void) | null>(null)
  // いま external へ渡してある ref と、その attach が返した cleanup。
  const attachedRef = React.useRef<{
    ref: React.Ref<T> | undefined
    cleanup: (() => void) | undefined
  } | null>(null)

  const detachExternal = React.useCallback(() => {
    const attached = attachedRef.current
    if (!attached) return
    attachedRef.current = null
    if (attached.cleanup) attached.cleanup()
    else assignRef(attached.ref, null)
  }, [])

  const attachExternal = React.useCallback((ref: React.Ref<T> | undefined, node: T) => {
    attachedRef.current = { ref, cleanup: assignRef(ref, node) }
  }, [])

  // insertion effect は commit の mutation フェーズで走る＝ host の ref が
  // attach される layout フェーズより前なので、同じ commit で attach される
  // node にも最新の internal / external が使われる。
  React.useInsertionEffect(() => {
    internalRef.current = internal
    externalRef.current = external
    // すでに掴んでいる node があり、internal / external が差し替わったなら
    // 付け替える（identity を固定した以上、React は ref を呼び直してくれない）。
    // internal も旧 setter へ null → 新 setter へ node を渡す。渡さないと
    // 旧 setter 側の状態（DialogContent の setContentNode が積んだ
    // appliedRef 等）が stale なまま残る（PR #517 の Codex レビュー指摘）。
    const node = nodeRef.current
    if (node == null) return
    if (attachedInternalRef.current !== internal) {
      const prev = attachedInternalRef.current
      attachedInternalRef.current = internal
      prev?.(null)
      internal(node)
    }
    if (attachedRef.current?.ref === external) return
    detachExternal()
    attachExternal(external, node)
  })

  return React.useCallback(
    (node: T | null) => {
      nodeRef.current = node
      attachedInternalRef.current = node == null ? null : internalRef.current
      internalRef.current(node)
      detachExternal()
      if (node != null) attachExternal(externalRef.current, node)
      return () => {
        nodeRef.current = null
        const attachedInternal = attachedInternalRef.current
        attachedInternalRef.current = null
        attachedInternal?.(null)
        detachExternal()
      }
    },
    [attachExternal, detachExternal]
  )
}
