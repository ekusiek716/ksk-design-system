// =============================================================
// ksk-design-system/native/ui — RN/Expo 向け公開エントリ
//   - 解決済みトークン（themes / scales / primitives / getTheme ...）を再エクスポート
//   - ThemeProvider / useTheme（テーマ×モードの Context）
//   - DS コンポーネント（Text / Button / Card / Badge / Stack）
// 純データだけ欲しい場合は "ksk-design-system/native"（React/RN 非依存）を使う。
// =============================================================

export * from "../tokens/native"
export { ThemeProvider, useTheme, type ThemeContextValue } from "./theme/ThemeProvider"
export {
  SafeAreaInsetsProvider,
  useSafeAreaInsets,
  type SafeAreaInsetsProviderProps,
} from "./theme/SafeAreaInsetsProvider"
export {
  APP_HEADER_IOS_FALLBACK_PADDING_TOP,
  hasInsetEdge,
  resolveAppHeaderPaddingTop,
  resolveBottomSheetTopInset,
  resolveFullscreenDialogPadding,
  resolveInsetEdge,
  resolveTopSheetPaddingTop,
  type EdgePadding,
  type SafeAreaEdge,
  type SafeAreaInsets,
} from "./safe-area"
export { resolveTypo, type TypoVariant, type TypoStyle } from "./typography"
export * from "./components"
