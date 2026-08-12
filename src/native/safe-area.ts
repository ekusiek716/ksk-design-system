// =============================================================
// native safe-area（issue #351 / web #339 の native 追随）
//
// RN には env(safe-area-inset-*) に相当する CSS が無く、実 inset を取るには
// react-native-safe-area-context が要る。しかしこれを peerDependency に足すと
// 消費側20リポ全部へ依存追加を強いるため、DS 側は「inset を受け取る口」だけを
// 持ち、実測値は消費側が SafeAreaInsetsProvider 経由で流し込む（issue の案A）。
//
// ここに置くのは供給値の解決（フォールバック含む）だけの純関数で、React にも
// react-native にも依存しない。RN のレンダリングテスト基盤がリポジトリに無いため、
// 数値の振る舞いはこの純関数のユニットテストで固定する。
// =============================================================

/** 供給される safe-area inset（pt）。未指定の辺は「不明」を意味する。 */
export interface SafeAreaInsets {
  top?: number
  bottom?: number
  left?: number
  right?: number
}

export type SafeAreaEdge = "top" | "bottom" | "left" | "right"

/**
 * AppHeader が inset 未供給・iOS のときに使ってきた決め打ち値。
 * 実機の inset は 44 / 47 / 59 / 62pt と機種で異なりどれとも一致しないが、
 * **既存 consumer の見た目を変えないための後方互換値**なので生の数値のまま残す。
 * inset が供給されればそちらが優先される。
 */
export const APP_HEADER_IOS_FALLBACK_PADDING_TOP = 48

/**
 * 指定辺の inset を数値で解決する。
 * 未供給・非有限・負値は「不明（0）」として扱い、`enabled=false`（safeArea
 * オプトアウト）でも 0 を返す。
 */
export function resolveInsetEdge(
  insets: SafeAreaInsets | null | undefined,
  edge: SafeAreaEdge,
  enabled = true,
): number {
  if (!enabled || !insets) return 0
  const value = insets[edge]
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return 0
  return value
}

/** 供給値として使える top inset があるか（フォールバック判定用）。 */
export function hasInsetEdge(
  insets: SafeAreaInsets | null | undefined,
  edge: SafeAreaEdge,
): boolean {
  if (!insets) return false
  const value = insets[edge]
  return typeof value === "number" && Number.isFinite(value) && value >= 0
}

export interface AppHeaderPaddingTopInput {
  insets: SafeAreaInsets | null | undefined
  /** safeArea prop（既定 true）。false で回避をオプトアウト。 */
  safeArea: boolean
  /** Platform.OS === "ios" */
  isIOS: boolean
  /** 回避しないときの通常余白（scales.spacing.scale[3]）。 */
  fallbackSpacing: number
}

/**
 * AppHeader の paddingTop。
 * - `safeArea=false`: 回避しない（通常余白のみ）
 * - top inset が供給されている: その値。ただし通常余白を下回らない
 *   （inset 0 の端末で内容が画面端に貼り付くのを防ぐ）
 * - 未供給: 現行の決め打ち（iOS 48 / それ以外は通常余白）にフォールバック
 */
export function resolveAppHeaderPaddingTop({
  insets,
  safeArea,
  isIOS,
  fallbackSpacing,
}: AppHeaderPaddingTopInput): number {
  if (!safeArea) return fallbackSpacing
  if (hasInsetEdge(insets, "top")) {
    return Math.max(resolveInsetEdge(insets, "top"), fallbackSpacing)
  }
  return isIOS ? APP_HEADER_IOS_FALLBACK_PADDING_TOP : fallbackSpacing
}

/**
 * `side="top"` の Sheet の paddingTop。基準余白に上端 inset を足す
 * （ステータスバー／ダイナミックアイランドにパネル内容が潜るのを防ぐ）。
 */
export function resolveTopSheetPaddingTop(
  base: number,
  insets: SafeAreaInsets | null | undefined,
  safeArea: boolean,
): number {
  return base + resolveInsetEdge(insets, "top", safeArea)
}

/**
 * bottom sheet が画面いっぱいに近いときだけ必要になる上端退避量。
 * パネル上端（viewportHeight - panelHeight）が safe-area に食い込む分だけ返す。
 * ハーフシート等、上端が safe-area に届かない場合は 0。
 */
export function resolveBottomSheetTopInset(
  insets: SafeAreaInsets | null | undefined,
  safeArea: boolean,
  viewportHeight: number,
  panelHeight: number,
): number {
  const top = resolveInsetEdge(insets, "top", safeArea)
  if (top <= 0) return 0
  if (!Number.isFinite(viewportHeight) || !Number.isFinite(panelHeight)) return 0
  const panelTop = viewportHeight - panelHeight
  return Math.max(0, top - Math.max(0, panelTop))
}

export interface EdgePadding {
  paddingTop: number
  paddingBottom: number
  paddingLeft: number
  paddingRight: number
}

/**
 * 全画面 Dialog の内側余白。四辺すべてに inset を加算する
 * （横向きのノッチ・ホームインジケータを避ける）。
 */
export function resolveFullscreenDialogPadding(
  base: number,
  insets: SafeAreaInsets | null | undefined,
  safeArea: boolean,
): EdgePadding {
  return {
    paddingTop: base + resolveInsetEdge(insets, "top", safeArea),
    paddingBottom: base + resolveInsetEdge(insets, "bottom", safeArea),
    paddingLeft: base + resolveInsetEdge(insets, "left", safeArea),
    paddingRight: base + resolveInsetEdge(insets, "right", safeArea),
  }
}
