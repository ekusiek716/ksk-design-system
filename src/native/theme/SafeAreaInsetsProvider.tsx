import React, { createContext, useContext, useMemo } from "react"
import type { SafeAreaInsets } from "../safe-area"

/**
 * safe-area inset の供給口（issue #351）。
 *
 * DS は `react-native-safe-area-context` に依存しない（peerDependency を増やすと
 * 消費側20リポ全部に影響するため）。代わりに消費側がアプリのルートで実測値を
 * 流し込み、Sheet / Dialog / AppHeader がそれを読む。
 *
 * ```tsx
 * import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context"
 * import { SafeAreaInsetsProvider, ThemeProvider } from "ksk-design-system/native/ui"
 *
 * function DsInsets({ children }: { children: React.ReactNode }) {
 *   const insets = useSafeAreaInsets()
 *   return <SafeAreaInsetsProvider insets={insets}>{children}</SafeAreaInsetsProvider>
 * }
 *
 * export function App() {
 *   return (
 *     <SafeAreaProvider>
 *       <ThemeProvider>
 *         <DsInsets>{/* ... *\/}</DsInsets>
 *       </ThemeProvider>
 *     </SafeAreaProvider>
 *   )
 * }
 * ```
 *
 * ThemeProvider の拡張ではなく独立の Provider にしてある。inset は端末回転で
 * 変わる実行時の値で、テーマ（色・スケール）とは更新頻度も供給元も違うため、
 * 同じ Context に載せると inset 更新のたびにテーマ利用側まで再描画される。
 * 分けておけば消費側は ThemeProvider の内外どちらにでも置ける。
 */
const SafeAreaInsetsContext = createContext<SafeAreaInsets | null>(null)

export interface SafeAreaInsetsProviderProps {
  children: React.ReactNode
  /**
   * 実測 inset（pt）。`react-native-safe-area-context` の `useSafeAreaInsets()`
   * の戻り値をそのまま渡せる。省略した辺は「不明」として扱われ、各コンポーネント
   * が従来のフォールバックへ落ちる。
   */
  insets?: SafeAreaInsets | null
}

export function SafeAreaInsetsProvider({ children, insets }: SafeAreaInsetsProviderProps) {
  const { top, bottom, left, right } = insets ?? {}
  const supplied = insets != null
  // 消費側が毎レンダー新しいオブジェクトを渡しても、値が同じなら再描画しない
  const value = useMemo<SafeAreaInsets | null>(
    () => (supplied ? { top, bottom, left, right } : null),
    [supplied, top, bottom, left, right],
  )
  return <SafeAreaInsetsContext.Provider value={value}>{children}</SafeAreaInsetsContext.Provider>
}

/**
 * 供給された safe-area inset を返す。Provider が無い（＝消費側が流し込んでいない）
 * 場合は `null` で、各コンポーネントは従来どおりの決め打ちにフォールバックする。
 * ThemeProvider と違い、Provider の外で呼んでも例外を投げない。
 */
export function useSafeAreaInsets(): SafeAreaInsets | null {
  return useContext(SafeAreaInsetsContext)
}
