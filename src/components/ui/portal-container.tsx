import * as React from "react"

/**
 * Portal の描画先。`null` は「既定（document.body）」を意味する。
 * Radix の `PortalProps["container"]` に合わせて `Element | DocumentFragment | null`。
 */
export type PortalContainer = Element | DocumentFragment | null

/**
 * 未指定を表すため `undefined` を初期値にする。
 * Provider が無い ＝ `undefined` ＝ 各 Portal の既定先（document.body）。
 */
const PortalContainerContext = React.createContext<PortalContainer | undefined>(
  undefined
)

export interface PortalContainerProviderProps {
  /**
   * 配下の Dialog / Sheet / Select 等の Portal を追加する要素。
   * ref がまだ解決していない初回描画では `null` になり、その間は
   * 各 Portal の既定先（document.body）が使われる。
   */
  container: PortalContainer
  children: React.ReactNode
}

/**
 * 配下の KSK DS が使う Portal の描画先をまとめて指定する。
 *
 * 既存アプリの一部サブツリーにだけテーマ（`.ksk-theme` 等）を当てる段階導入では、
 * Portal が `document.body` 直下へ出てしまいテーマスコープの CSS 変数を継承できない。
 * そのスコープ要素を `container` に渡すと、Portal がスコープ内へ描画される。
 *
 * 注意:
 * - `container` に渡す要素（とその祖先）は `transform` / `filter` / `backdrop-filter` /
 *   `contain` / `will-change` 等でスタッキングコンテキストや包含ブロックを作らない
 *   プレーンな要素にする。作ると `fixed` のオーバーレイがその矩形に閉じ込められる。
 * - ref は `useState` の setter か `useCallback` で安定させる。インラインのアロー関数だと
 *   毎レンダーで container が付け外しされ、開いている Dialog が unmount/remount される。
 *
 * @example
 * const [scope, setScope] = React.useState<HTMLDivElement | null>(null)
 * return (
 *   <div ref={setScope} className="ksk-theme">
 *     <PortalContainerProvider container={scope}>{children}</PortalContainerProvider>
 *   </div>
 * )
 */
function PortalContainerProvider({
  container,
  children,
}: PortalContainerProviderProps) {
  return (
    <PortalContainerContext.Provider value={container}>
      {children}
    </PortalContainerContext.Provider>
  )
}
PortalContainerProvider.displayName = "PortalContainerProvider"

/**
 * Portal の描画先を「明示 > Provider > 既定（document.body）」の順で解決する。
 *
 * 呼び出し側が `container` prop を渡していない（＝ `undefined`）ときだけ context を
 * 参照する。`null` を明示した場合は「既定先を使う」という明示指定として扱い、
 * context より優先する。
 */
function usePortalContainer(
  explicitContainer?: PortalContainer
): PortalContainer | undefined {
  const inheritedContainer = React.useContext(PortalContainerContext)
  return explicitContainer === undefined
    ? inheritedContainer
    : explicitContainer
}

export { PortalContainerProvider, usePortalContainer }
