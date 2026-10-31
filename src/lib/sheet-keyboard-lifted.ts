import * as React from "react"

// ============================================================================
// 「シート自身がキーボードの上へ持ち上がっている」を子孫へ伝える（#788）
// ----------------------------------------------------------------------------
// bottom / bottom-glass / float 系 / snap のシートは、キーボード表示中に
// 自分の `bottom` をキーボード高さ分持ち上げる（sheet.tsx の
// resolveBottomSheetKeyboardStyle / resolveFloatSheetKeyboardStyle）。
// その中に置いた KeyboardAwareSheetFooter が同じ高さを sticky の bottom に
// 入れると補正が二重にかかり、フッターがシート下端から浮いて本文や見出しに
// 被る。持ち上げ済みのシートの中ではフッター側の補正を 0 に戻すため、
// SheetContent がこの context を true で流す。
//
// sheet.tsx と patterns（keyboard-aware-sheet-footer）の循環 import を
// 避けるため、別ファイルに置く。src/index.ts からは出さない内部 API。
// ============================================================================

const SheetKeyboardLiftedContext = React.createContext(false)

/** 祖先のシートがキーボードの上へ持ち上がっている間だけ true。 */
function useSheetKeyboardLifted(): boolean {
  return React.useContext(SheetKeyboardLiftedContext)
}

export { SheetKeyboardLiftedContext, useSheetKeyboardLifted }
