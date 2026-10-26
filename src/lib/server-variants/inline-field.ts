/**
 * 入力欄の inline variant（issue #675）。枠・背景を持たず、本文 / 見出しと同じ見た目のまま
 * その場で編集する欄（詳細シートのタイトル・メモ等）の見た目。Input / Textarea が共有する。
 *
 * - 既定は透明。hover で Surface-Secondary の面を出して「押せば編集できる」ことを示す
 * - focus-visible は他の入力欄と同じ Focus リング（outline-hidden + ring。forced-colors では OS の枠）
 * - aria-invalid は Caution のリング
 *
 * このファイルは React に依存しない（server-variants の約束。unstyled.ts と同じ）。
 */
const INLINE_FIELD_BASE =
  "w-full min-w-0 rounded-sm border-0 bg-transparent px-1 py-0.5 text-[var(--Text-High-Emphasis)] transition-colors placeholder:text-[var(--Text-Low-Emphasis)] hover:bg-[var(--Surface-Secondary)] focus-visible:bg-transparent focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent aria-invalid:ring-2 aria-invalid:ring-[var(--Border-Caution)]"

/** 入力欄の見た目の種類。default は従来の枠付き */
type FieldVariant = "default" | "inline" | "inline-title"

const INLINE_FIELD_TYPO: Record<Exclude<FieldVariant, "default">, string> = {
  inline: "typo-body-md",
  "inline-title": "typo-heading-xl",
}

/**
 * inline 系の当たり判定の段（issue #712）。
 * - "compact"（既定）: 従来の px-1 py-0.5（本文の行に溶け込む高さ）
 * - "comfortable": 最小 44px（min-h-11）+ py-2。ラベル左置きの項目行など、押せる範囲を
 *   外側の余白（py-2 等）で稼がずに 44px を確保する。typo-body-md（16px × 1.75 = 28px）+ 上下 8px で 44px
 */
type FieldTargetSize = "compact" | "comfortable"

const INLINE_FIELD_TARGET_SIZE: Record<FieldTargetSize, string> = {
  compact: "",
  comfortable: "min-h-11 py-2",
}

export { INLINE_FIELD_BASE, INLINE_FIELD_TARGET_SIZE, INLINE_FIELD_TYPO }
export type { FieldTargetSize, FieldVariant }
