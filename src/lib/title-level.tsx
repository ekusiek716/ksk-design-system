import * as React from "react"

/**
 * 見出しの「役割」（#341）。
 *
 * 値は `contracts/composition.json` の `textHierarchy.tree` の role と 1 対 1 で
 * 対応する。typo クラスは {@link TITLE_LEVEL_TYPO} の 1 箇所だけで解決し、
 * 各コンポーネントへハードコードで散らさない。
 * （対応の機械検査: `__tests__/title-level-composition.test.tsx`）
 */
type TitleLevel = "page" | "section" | "card"

/**
 * TitleLevel → `contracts/composition.json` の `textHierarchy.tree[].role`。
 * テスト側はこの対応表を使って composition.json を実際に読み、
 * {@link TITLE_LEVEL_TYPO} とのズレを検出する（値の二重管理を避けるため、
 * typo 値はテストにハードコードしない）。
 */
const TITLE_LEVEL_COMPOSITION_ROLE: Record<TitleLevel, string> = {
  page: "画面タイトル / H1",
  section: "セクション見出し / H2",
  card: "カード見出し / H3",
}

/**
 * TitleLevel → typo ユーティリティクラス。
 * 正本は `contracts/composition.json` の `textHierarchy.tree`。
 *
 * クラス名は必ず完全な文字列で書く（`typo-heading-${level}` のような動的合成は
 * `scripts/generate-source-safelist.mjs` の静的抽出が効かず、消費側で CSS が
 * 生成されなくなる）。
 */
const TITLE_LEVEL_TYPO: Record<TitleLevel, string> = {
  page: "typo-heading-2xl",
  section: "typo-heading-xl",
  card: "typo-heading-md",
}

/**
 * level 未指定・かつ全画面級サーフェス配下でもないときの既定 typo。
 *
 * composition.json の「画面タイトル」規定（typo-heading-2xl）へ全面的に寄せると、
 * 既存 consumer の中央ダイアログ・小シートの見出しが一斉に 24px へ跳ね上がる。
 * それは #341 が求めた「全画面のタイトルが小さい」問題の対価として大きすぎるため、
 * 既定の見た目を変えるのは全画面級サーフェスの配下だけに限定し、それ以外は
 * 従来の 18px を維持する（明示 `level` はいつでも優先される）。
 */
const DIALOG_TITLE_DEFAULT_TYPO = "typo-heading-lg"

/**
 * サーフェスの「画面としての大きさ」。
 * - "page": 全画面級（`DialogContent position="fullscreen"` /
 *   `BottomSheetFrame preset="mobile-full" | "mobile-page"`）。配下の
 *   タイトル既定が画面タイトル（H1）相当になる。
 * - "dialog": それ以外（中央ダイアログ・部分シート）。従来の既定を維持する。
 */
type TitleSurfaceScale = "page" | "dialog"

const TitleSurfaceScaleContext = React.createContext<TitleSurfaceScale>("dialog")

/**
 * 配下のタイトル既定サイズを決める文脈を与える。全画面級サーフェスは "page"、
 * それ以外は "dialog" を渡す。ネストしたモーダルが外側の文脈を引き継がないよう、
 * Dialog / Sheet はどちらの場合も必ず Provider を置くこと。
 */
function TitleSurfaceScaleProvider({
  scale,
  children,
}: {
  scale: TitleSurfaceScale
  children?: React.ReactNode
}) {
  return (
    <TitleSurfaceScaleContext.Provider value={scale}>
      {children}
    </TitleSurfaceScaleContext.Provider>
  )
}

/**
 * タイトルへ当てる typo クラスを解決する。
 * 呼び出し側の明示 `level` が常に文脈より優先される。
 */
function useTitleTypoClass(level?: TitleLevel): string {
  const scale = React.useContext(TitleSurfaceScaleContext)
  if (level) return TITLE_LEVEL_TYPO[level]
  return scale === "page" ? TITLE_LEVEL_TYPO.page : DIALOG_TITLE_DEFAULT_TYPO
}

export {
  TITLE_LEVEL_TYPO,
  TITLE_LEVEL_COMPOSITION_ROLE,
  DIALOG_TITLE_DEFAULT_TYPO,
  TitleSurfaceScaleProvider,
  useTitleTypoClass,
}
export type { TitleLevel, TitleSurfaceScale }
