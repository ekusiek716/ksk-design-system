// =============================================================
// 通常版 Sheet（snapPoints なし）の中に置く選択肢一覧の最大高さ（issue #816）
//
// 通常版 Sheet は下寄せのパネルに中身をそのまま積むだけで、高さの上限もスクロールも
// 持たない。選択肢が画面に収まらない数（47 都道府県など）になると、パネルが画面の上へ
// はみ出して見出しと先頭の選択肢が押せなくなる。Select / DropdownFilter は一覧を
// ScrollView で包み、この値を maxHeight に付ける。
//
// 選択肢が少ないときは maxHeight が上限になるだけで、パネルの高さは内容に合ったまま。
// React にも react-native にも依存しない純関数にして、数値の振る舞いを単体テストで固定する。
// =============================================================

import { resolveInsetEdge, type SafeAreaInsets } from "./safe-area"

/** 画面高に対する一覧の最大高さの割合。残りに見出し・ハンドル・余白と、背景の見える部分を残す。 */
export const SHEET_LIST_MAX_HEIGHT_RATIO = 0.6

/**
 * 一覧の最大高さの下限（pt）。極端に小さい画面や、RN-web の Modal を最初に描く瞬間に
 * 画面高が 0 と報告されるときでも、数行は見えるようにする。
 */
export const SHEET_LIST_MIN_HEIGHT = 200

/**
 * 通常版 Sheet 内の選択肢一覧に付ける maxHeight（pt）。
 * 画面高 × 0.6 から safe-area の上下 inset を引き、下限 200 を下回らないようにする。
 * inset が未供給（SafeAreaInsetsProvider なし）なら 0 として扱う。
 */
export function resolveSheetListMaxHeight(
  windowHeight: number,
  insets: SafeAreaInsets | null | undefined,
): number {
  const height = Number.isFinite(windowHeight) && windowHeight > 0 ? windowHeight : 0
  const vertical = resolveInsetEdge(insets, "top") + resolveInsetEdge(insets, "bottom")
  return Math.max(SHEET_LIST_MIN_HEIGHT, Math.floor(height * SHEET_LIST_MAX_HEIGHT_RATIO - vertical))
}
