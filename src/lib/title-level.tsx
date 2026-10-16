import * as React from "react"
import { errorOnceInDev } from "./dev-warn"

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

/**
 * どのオーバーレイの Content の中か（issue #727）。DialogContent は "dialog"、SheetContent は "sheet"、
 * AlertDialogContent は null（Radix の AlertDialog は別スコープの context なので、素の Dialog の
 * Title を置けない）を流す。null（既定）はオーバーレイの外。
 * DetailSheetHeader が文字列の title を Radix の Title（= シート / ダイアログの名前）として描くかの判定に使う。
 */
type OverlayTitleSlot = "dialog" | "sheet" | null

interface OverlayTitleSlotValue {
  slot: OverlayTitleSlot
  /**
   * Content の Title（SheetTitle / DialogTitle / DetailSheetHeader の文字列 title）を登録する。
   * 戻り値で登録を外す。同じ Content に 2 つ以上登録されると Radix の titleId が重複するため、
   * 開発ビルドで console.error を出す（issue #727）。
   */
  register: () => () => void
}

const NOOP_REGISTER = () => () => {}
const OverlayTitleSlotContext = React.createContext<OverlayTitleSlotValue>({ slot: null, register: NOOP_REGISTER })

function OverlayTitleSlotProvider({ slot, children }: { slot: OverlayTitleSlot; children?: React.ReactNode }) {
  const countRef = React.useRef(0)
  const value = React.useMemo<OverlayTitleSlotValue>(
    () => ({
      slot,
      register:
        slot == null
          ? NOOP_REGISTER
          : () => {
              countRef.current += 1
              if (countRef.current > 1) {
                errorOnceInDev(
                  "overlay-duplicate-title",
                  "同じ Sheet / Dialog に Title が 2 つ以上あります（SheetTitle / DialogTitle / DetailSheetHeader の文字列 title）。" +
                    "読み上げ名の id が重複するため 1 つにしてください。DetailSheetHeader の文字列 title はそのままシート / ダイアログの名前になるので、" +
                    "sr-only の SheetTitle / DialogTitle を消すか、DetailSheetHeader に overlayTitle={false} を渡してください（issue #727）。"
                )
              }
              return () => {
                countRef.current -= 1
              }
            },
    }),
    [slot]
  )
  return <OverlayTitleSlotContext.Provider value={value}>{children}</OverlayTitleSlotContext.Provider>
}

function useOverlayTitleSlot(): OverlayTitleSlot {
  return React.useContext(OverlayTitleSlotContext).slot
}

/** Title が配下の Content に自分を登録する（重複検出用・issue #727）。enabled=false の間は登録しない */
function useRegisterOverlayTitle(enabled = true): void {
  const { register } = React.useContext(OverlayTitleSlotContext)
  React.useEffect(() => (enabled ? register() : undefined), [register, enabled])
}

export {
  OverlayTitleSlotProvider,
  useOverlayTitleSlot,
  useRegisterOverlayTitle,
  TITLE_LEVEL_TYPO,
  TITLE_LEVEL_COMPOSITION_ROLE,
  DIALOG_TITLE_DEFAULT_TYPO,
  TitleSurfaceScaleProvider,
  useTitleTypoClass,
}
export type { OverlayTitleSlot, TitleLevel, TitleSurfaceScale }
