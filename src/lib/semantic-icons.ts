/** Meaning first: Check is a checkbook; InfoCircle in iconsax is an exclamation mark. */
export const SEMANTIC_ICONS = {
  selected: { label: "選択済み", glyph: "tick", use: "選択対象が外枠を持つタイルや項目" },
  selectedSquare: { label: "選択済み（四角）", glyph: "TickSquare", use: "独立した選択状態の表示" },
  success: { label: "完了", glyph: "TickCircle", use: "処理の完了・成功" },
  close: { label: "閉じる", glyph: "Add rotated 45°", use: "閉じる・選択解除（操作名はボタンへ指定）" },
  info: { label: "情報", glyph: "InfoCircleIcon", use: "補足情報。警告とは区別する" },
  warning: { label: "警告", glyph: "Danger", use: "注意が必要な状態。説明文を併記する" },
} as const

export type SemanticIconName = keyof typeof SEMANTIC_ICONS
