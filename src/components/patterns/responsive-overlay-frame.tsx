import * as React from "react"
import { cn } from "@/lib/utils"
import { DialogContent } from "../ui/dialog"
import { SheetContent } from "../ui/sheet"
import { TitleSurfaceScaleProvider } from "../../lib/title-level"
import { useResponsiveOverlayIsDesktop } from "../ui/responsive-dialog"
import type { SheetContentProps } from "../ui/sheet"
import { BottomSheetFrame, type BottomSheetFramePreset } from "./bottom-sheet-frame"
import { KeyboardAwareSheetFooter, type KeyboardAwareSheetFooterProps } from "./keyboard-aware-sheet-footer"
import { sheetSurfaceClasses, type SheetSurface } from "./sheet-surface"

/**
 * デスクトップ（Dialog）側の面の作り方（issue #472）。
 * BottomSheetFrame の preset ごとに「モバイルの見え方をそのまま中央モーダルへ
 * 移した」寸法を持つ。consumer 側の global CSS で position / transform /
 * width / max-height / radius を `!important` で上書きする必要をなくすのが目的。
 *
 * 幅は DialogContent 既定（sm:max-w-[480px]）を twMerge で置き換える。
 * padding は BottomSheetFrame と同じく持たず（`padding={false}`）、内側の
 * DetailSheetScaffold / ResponsiveOverlayFooter が余白を持つ。
 */
const desktopPresetClasses: Record<BottomSheetFramePreset, string> = {
  // 全画面級。デスクトップでは「背の高い中央モーダル」に落とす。
  "mobile-full": "sm:max-w-xl max-h-[min(90dvh,44rem)] flex flex-col overflow-hidden",
  "mobile-page": "sm:max-w-xl max-h-[min(90dvh,44rem)] flex flex-col overflow-hidden",
  // フォーム。モバイルの sm:max-w-lg をそのまま踏襲する。
  "mobile-form": "sm:max-w-lg max-h-[min(85dvh,40rem)] flex flex-col overflow-hidden",
  // 元からデスクトップ想定の floating。中央モーダルとしての寸法は同じ。
  "desktop-floating": "sm:max-w-xl max-h-[min(86dvh,42rem)] flex flex-col overflow-hidden",
}

/**
 * 全画面級 preset（#341 / BottomSheetFrame の pageScalePresets と同じ集合）。
 * デスクトップ（中央モーダル）でも同じ preset を選んだ以上タイトル階層は
 * 揃えるべきなので、DialogContent が内側に置く "dialog" 文脈をここで
 * 上書きし直す（issue #472）。
 */
const pageScalePresets = new Set<BottomSheetFramePreset>(["mobile-full", "mobile-page"])

/**
 * 面の置き方（issue #479）。
 * - "bottom"（既定）: 画面下端に貼り付くボトムシート。`preset` が効く。
 * - "float": 左右・下に余白を持つカード型（Sheet の side="float" と同じ）。
 * - "float-glass": float の Liquid Glass 版（Sheet の side="float-glass" と同じ）。
 *
 * `surface="glass"`（= glass-strong）とは素材が別物なので畳んでいない。
 * float 系では `preset` は効かず、代わりに `padding` が効く。
 */
type ResponsiveOverlaySide = "bottom" | "float" | "float-glass"

const floatSides = new Set<ResponsiveOverlaySide>(["float", "float-glass"])

/**
 * float 系のデスクトップ recipe。モバイルの float
 * （`inset-x-3 bottom-3 max-w-lg mx-auto rounded-[var(--Radius-Sheet)]`）を
 * そのまま中央へ移した寸法。幅 32rem・高さ min(85dvh, 46rem) は、消費側が
 * global CSS の `!important` で当てていた値と 1px も違わない（issue #479）。
 */
const desktopFloatClasses = "sm:max-w-lg max-h-[min(85dvh,46rem)] flex flex-col overflow-y-auto"

/**
 * `preset="plain"`（preset 無しの素の bottom シート）のデスクトップ recipe。
 * モバイルは Sheet の bottom バリアント（`inset-x-0 bottom-0` / `max-h-[90dvh]` /
 * `p-6`）そのままなので、それを中央へ移した寸法にする。
 * 高さは 46rem でキャップする（画面が高いときに間延びさせない）。
 *
 * 幅の 32rem は `sm:`（640px 以上）で効く。`ResponsiveDialog` の breakpoint を
 * 640px 未満に解決する設定（`breakpointQuery` の生指定 / `product-theme` に
 * 小さい値）では DialogContent 既定の `max-w-[calc(100%_-_3rem)]` が残り、
 * ほぼ全幅の中央ボックスになる。`breakpoint="md"` / `"lg"` 運用なら影響しない。
 */
// モバイルの素の SheetContent（bottom バリアント）は flex ではなく block なので、
// ここでも flex 化しない（子の幅・マージン・flex-1 の解釈を揃えるため）。
const desktopPlainClasses = "sm:max-w-lg max-h-[min(90dvh,46rem)] overflow-y-auto"

/**
 * ソフトキーボードが実際に出ている状態かを、編集可能な要素へのフォーカスで
 * 追加判定する（issue #487 の Codex レビュー指摘）。
 *
 * `visualViewport.height` はピンチズームでも縮むため、
 * `useVisualViewportKeyboardInset()` だけを見るとズームで消えた分を
 * `keyboardInset` として拾ってしまう。iPad 横向きはまさにピンチズームを
 * 使う端末なので、デスクトップ分岐ではフォーカスも条件に足す。
 * ソフトキーボードは編集可能な要素にフォーカスが無ければ出ないため、
 * 「キーボードが出ている」の必要条件として過不足がない。
 *
 * ズーム由来の縮みは `resolveOverlayKeyboardInset()` が倍率で打ち消すので、
 * こちらは「そもそもキーボードが出ない状況」を落とすためのゲート。
 *
 * ⚠️ CSS フォールバック（`html[data-kb-open]` + `--kb-h`）は consumer が
 * 明示的に立てる合図なのでこのゲートの対象外 — あちらは誤検知しない。
 */
// contenteditable は "true" だけでなく値なし（contenteditable=""）や
// "plaintext-only" も編集可能。"false" 以外を拾う（#487 の Codex レビュー指摘）。
const editableSelector =
  'input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable]:not([contenteditable="false"])'

/**
 * デスクトップ分岐の既定の高さキャップ（`desktopPresetClasses` /
 * `desktopFloatClasses` / `desktopPlainClasses` の `max-h-[...]` と同値）。
 *
 * キーボード補正は「縮める」だけであるべきなので、補正値でキャップを
 * 置き換えず `min(既定, キーボード由来)` にする（issue #487 の Codex レビュー
 * 指摘。インセットが小さいとき、mobile-form の min(85dvh,40rem)=640px が
 * 800px へ *広がって* しまっていた）。
 *
 * 実体は CSS 変数 `--Overlay-Desktop-Base-Max-Height` として面に出す。
 * こうすると JS の inline style と CSS フォールバックが同じ既定値を参照でき、
 * consumer が `style={{ maxHeight }}` を渡した場合もそれが既定側に入る。
 */
const OVERLAY_BASE_MAX_HEIGHT_VAR = "--Overlay-Desktop-Base-Max-Height"

const desktopPresetMaxHeights: Record<BottomSheetFramePreset, string> = {
  "mobile-full": "min(90dvh, 44rem)",
  "mobile-page": "min(90dvh, 44rem)",
  "mobile-form": "min(85dvh, 40rem)",
  "desktop-floating": "min(86dvh, 42rem)",
}

/**
 * `max-height` としては妥当だが `min()` の被演算子にできない値
 * （issue #487 の Codex レビュー指摘）。`min(none, …)` のような宣言は
 * まるごと捨てられるので、これらは畳まずキーボード由来のキャップだけを当てる。
 */
const nonCalculableMaxHeights = new Set([
  "none",
  "auto",
  "fit-content",
  "max-content",
  "min-content",
  "inherit",
  "initial",
  "revert",
  "revert-layer",
  "unset",
])

function toCalculableMaxHeight(value: string | number): string | undefined {
  // React は数値の maxHeight を px として解釈するので、min() へ埋めるときも
  // px を補う（"min(640, …)" は長さとして不正）。
  if (typeof value === "number") return `${value}px`
  const normalized = value.trim().toLowerCase()
  if (nonCalculableMaxHeights.has(normalized)) return undefined
  // fit-content(20rem) のような関数形も被演算子にできない。
  if (normalized.startsWith("fit-content(")) return undefined
  return value
}

const desktopFloatMaxHeight = "min(85dvh, 46rem)"
const desktopPlainMaxHeight = "min(90dvh, 46rem)"

/**
 * 面に実際に効いている `max-height`（実測値）。
 *
 * 既定キャップは className でも上書きできる（desktopClassName の max-h ユーティリティ）。
 * inline style は className より強いので、経路の既定値だけを見て畳むと
 * consumer が締めたキャップを緩めてしまう（#487 の Codex レビュー指摘）。
 * 補正が当たっていない間の computed 値を読めば、className / inline style /
 * 経路の既定のどれで決まっていても「いま効いているキャップ」が取れる。
 *
 * 補正が当たっている間は自分の inline 値を読み返してしまうので、その間だけ
 * inline の max-height を外して測り、すぐ戻す（layout effect の中なので
 * 塗り替えは挟まらない）。「Sheet からの切り替え直後にすでにキーボードが
 * 出ている」（iPad を境界跨ぎで回転した等）ケースでも初回から実測できる
 * ようにするため、active を理由に測定を諦めない（#487 の Codex レビュー指摘）。
 */
function useEffectiveMaxHeight(
  active: boolean,
  consumerInlineMaxHeight: string,
  classSignature: string
): {
  setElement: (node: HTMLDivElement | null) => void
  measured: string | undefined
} {
  // 面の DOM は ref で持つ。測定のあいだだけ inline style を差し替えるので、
  // props や useState の値だと react-hooks/immutability に引っかかる
  // （ref は React が認めている可変の逃げ道）。ただし ref だけだと
  // マウントで effect が再実行されないため、世代カウンタを state に持つ。
  const elRef = React.useRef<HTMLDivElement | null>(null)
  const [mountVersion, setMountVersion] = React.useState(0)
  const setElement = React.useCallback((node: HTMLDivElement | null) => {
    elRef.current = node
    setMountVersion((v) => v + 1)
  }, [])
  const [measured, setMeasured] = React.useState<string | undefined>()
  React.useLayoutEffect(() => {
    const el = elRef.current
    if (!el || typeof window === "undefined") return
    const measure = () => {
      // 補正中は自分が書いた inline 値が computed に出るので、その間だけ外す。
      // 空にするのではなく consumer の宣言へ戻す — 補正値は consumer の
      // style.maxHeight を置き換えているので、空にすると consumer が締めた
      // キャップまで消えて preset の緩い値を実測してしまう
      // （#487 の Codex レビュー指摘）。
      const ownInline = active ? el.style.maxHeight : ""
      // CSS フォールバック（html[data-kb-open]）も同じ理由で外す。inline を
      // 剥がした瞬間に sheet-keyboard.css の補正値が出てきて、それを基準として
      // 記録してしまうと、キーボードが小さくなっても縮んだ基準のまま残る。
      // 規則側は :not([data-kb-measuring]) で自分を除外している。
      el.setAttribute("data-kb-measuring", "")
      if (ownInline) el.style.maxHeight = consumerInlineMaxHeight
      const value = window.getComputedStyle(el).maxHeight
      if (ownInline) el.style.maxHeight = ownInline
      el.removeAttribute("data-kb-measuring")
      setMeasured((prev) => (prev === value ? prev : value))
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [mountVersion, active, consumerInlineMaxHeight, classSignature])
  return { setElement, measured }
}

/**
 * ズームを打ち消したソフトキーボード高さ（レイアウト px / issue #487）。
 *
 * `visualViewport.height` はソフトキーボードでもピンチズームでも縮むため、
 * `innerHeight - height` だけを見ると 2 つを取り違える。倍率 s でズーム中の
 * 可視高さは「(レイアウト高 - キーボード高) / s」なので、CSS px で返ってくる
 * `height` / `offsetTop` を s 倍してレイアウト px へ戻せば、キーボード分だけを
 * 取り出せる:
 *
 *   kb = layoutHeight - (visualHeight + visualOffsetTop) * scale
 *
 * ズームだけなら kb ≈ 0、等倍なら従来式と一致し、「ズームしたまま入力欄に
 * フォーカスしてキーボードが出た」場合もキーボード分だけが残る。
 * scale で分岐するゲートだと後者を丸ごと落としてしまう（Codex レビュー指摘）。
 *
 * 端数は 1px 未満を 0 とみなす（倍率のゆらぎで微小値が出続けるため）。
 */
function resolveOverlayKeyboardInset(
  layoutHeight: number,
  visualHeight: number,
  visualOffsetTop: number,
  scale: number
): number {
  const usableScale = Number.isFinite(scale) && scale > 0 ? scale : 1
  const inset = layoutHeight - (visualHeight + visualOffsetTop) * usableScale
  return inset < 1 ? 0 : inset
}

/** `resolveOverlayKeyboardInset` を visualViewport の更新に追従させる。 */
function useOverlayKeyboardInset(): number {
  const [inset, setInset] = React.useState(0)
  React.useEffect(() => {
    if (typeof window === "undefined") return
    const viewport = window.visualViewport
    if (!viewport) return
    const update = () =>
      setInset(
        resolveOverlayKeyboardInset(
          window.innerHeight,
          viewport.height,
          viewport.offsetTop,
          viewport.scale ?? 1
        )
      )
    update()
    viewport.addEventListener("resize", update)
    viewport.addEventListener("scroll", update)
    return () => {
      viewport.removeEventListener("resize", update)
      viewport.removeEventListener("scroll", update)
    }
  }, [])
  return inset
}

function useEditableElementFocused(): boolean {
  const [focused, setFocused] = React.useState(false)
  React.useEffect(() => {
    if (typeof document === "undefined") return
    const check = () => {
      const el = document.activeElement
      setFocused(
        el instanceof Element &&
          // isContentEditable は継承された編集可能性まで拾うが、jsdom など
          // 未実装の環境があるのでセレクタと OR にする。
          ((el instanceof HTMLElement && el.isContentEditable) ||
            el.matches(editableSelector))
      )
    }
    // 判定は必ず次のタスクへ逃がす。理由は 2 つ:
    //   1. focusout は次のフォーカスが確定する前に飛ぶため、その場で読むと
    //      activeElement が一瞬 body になり取りこぼす。
    //   2. Radix の FocusScope は commit の中で同期的に focus() を呼ぶので、
    //      focusin ハンドラでそのまま setState すると React が
    //      "Should not already be working." で落ちる（#487 で実際に踏んだ）。
    const checkLater = () => window.setTimeout(check, 0)
    check()
    document.addEventListener("focusin", checkLater)
    document.addEventListener("focusout", checkLater)
    return () => {
      document.removeEventListener("focusin", checkLater)
      document.removeEventListener("focusout", checkLater)
    }
  }, [])
  return focused
}

/**
 * デスクトップ（中央モーダル）分岐のソフトキーボード補正（issue #487）。
 *
 * 幅 1024px 以上のタッチ端末（iPad 横向き = 1024 / 1194 / 1366px）は
 * 「デスクトップ幅なのにソフトキーボードが出る」ため、中央モーダルとして
 * 描画されたまま入力欄がキーボードに隠れる。
 *
 * ⚠️ 中央モーダルに当ててよいのは **max-height だけ**。`DialogContent` は
 * `top:50% + translate-y:-50%` で位置決めしているので、シート系と同じ
 * `bottom` lift を当てると top/bottom の両拘束になり高さが縦一杯へ
 * 引き伸ばされる（消費側 belle-todo で実際に起きた事故）。
 *
 * 幾何: 中央寄せの面は高さ H なら `[dvh/2 - H/2, dvh/2 + H/2]` を占める。
 * 可視領域は `[0, dvh - kb]` なので `dvh/2 + H/2 <= dvh - kb`、つまり
 * **H <= dvh - 2*kb**。キーボード分の 2 倍を引くのが中央寄せの正解で、
 * `dvh - kb` では下端がキーボードへ潜り込む。
 *
 * `position="top"` は上端固定（`top-8` / safe-area）なので二重に引く必要はなく、
 * 「キーボード + 上オフセット + 下マージン」を引く。上オフセットは
 * `safeArea` の指定に合わせる（`safeArea={false}` なら `top-8` 固定なので 2rem）。`position="fullscreen"` は
 * `inset-0 h-full` の上端固定なのでキーボード 1 回分だけを引く（`h-full` は
 * max-height に負けるため、面が可視領域の高さへ縮み内側のスクロール領域が残る）。
 *
 * 高さは 0 で下限を切る（負値だと「上端が抜ける」不具合を「中身が高さ 0 で
 * 消える」不具合にすり替えるだけになる — float 系と同じ判断 / #337）。
 *
 * 返す値は `min(baseMaxHeight, キーボード由来のキャップ)`。inline style は
 * className の `max-h-[...]` を置き換えてしまうため、そのまま返すと
 * インセットが小さいときに既定のキャップより *広がる*（issue #487 の
 * Codex レビュー指摘）。補正は必ず縮める方向にだけ効かせる。
 */
function resolveDesktopOverlayKeyboardStyle(
  keyboardInset: number,
  position: "center" | "top" | "fullscreen",
  baseMaxHeight: string | undefined,
  safeArea: boolean
): { maxHeight: string } | undefined {
  if (keyboardInset <= 0) return undefined
  // JS 検知（px）と CSS フォールバック（--kb-h）の 2 つの合図をそれぞれ
  // キャップにして畳む。inline style は sheet-keyboard.css より強いので、
  // var の項をここへ入れておかないと「visualViewport が inset を出せず
  // consumer が html[data-kb-open] を立てている」環境で補正が消える
  // （#487 の Codex レビュー指摘）。
  const capFor = (inset: string, doubled: string) =>
    position === "fullscreen"
      ? `max(0px, calc(100dvh - ${inset}))`
      : position === "top"
        ? // safeArea={false} のときは DialogContent 自身も top-8 固定になるので、
          // ここも env() を足さない（明示的な opt-out を無視して余計に縮めない
          // / #487 の Codex レビュー指摘）。
          `max(0px, calc(100dvh - ${inset} - ${
            safeArea ? "max(env(safe-area-inset-top, 0px), 2rem)" : "2rem"
          } - 2rem))`
        : `max(0px, calc(100dvh - ${doubled}))`
  const caps = [
    capFor(`${keyboardInset}px`, `${keyboardInset * 2}px`),
    // --kb-h ではなく --kb-h-active を見る。後者は sheet-keyboard.css が
    // html[data-kb-open] の間だけ値を持たせる変数で、consumer が属性を
    // 外したのに --kb-h を残していても古い値を引かずに済む（#487）。
    capFor("var(--kb-h-active, 0px)", "2 * var(--kb-h-active, 0px)"),
  ]
  // min() で畳むので、この補正は既定のキャップを緩めることが無い。
  // 既定が計算に使えない値（none / fit-content 等）のときは畳まず、
  // キーボード由来のキャップだけを当てる（min(none, …) は宣言ごと捨てられる）。
  const operands = baseMaxHeight ? [baseMaxHeight, ...caps] : caps
  return { maxHeight: `min(${operands.join(", ")})` }
}

interface ResponsiveOverlayFrameBaseProps
  extends Omit<SheetContentProps, "side" | "padding"> {
  /** モバイル（シート）側にだけ足す className。 */
  mobileClassName?: string
  /** デスクトップ（DialogContent）側にだけ足す className。 */
  desktopClassName?: string
}

/**
 * `side` ごとに効く prop が違うので判別ユニオンにしてある（issue #479）。
 * 効かない prop を渡すとコンパイルエラーになる — 黙って無視されて
 * 「なぜ効かないのか」を追う羽目にならないようにするため。
 */
type ResponsiveOverlayFrameProps =
  | (ResponsiveOverlayFrameBaseProps & {
      side?: "bottom"
      /**
       * モバイル側の BottomSheetFrame preset。デスクトップでも対応する
       * 中央モーダルの寸法へ写像される。既定 "mobile-form"。
       */
      preset?: BottomSheetFramePreset
      /** 面の素材。モバイル / デスクトップの両方に効く。既定 "default"。 */
      surface?: SheetSurface
      /**
       * デスクトップ側の縦位置。既定 "center"。
       * preset の寸法をそのまま全画面へ広げたい場合のみ "fullscreen" を使う。
       */
      desktopPosition?: "center" | "top" | "fullscreen"
      /** preset が余白を持つため指定できない（`preset="plain"` なら指定できる）。 */
      padding?: never
    })
  | (ResponsiveOverlayFrameBaseProps & {
      side?: "bottom"
      /**
       * preset を使わない素の bottom シート（issue #486）。
       * モバイルは `<SheetContent side="bottom">` そのまま（全幅・下端固定・
       * `p-6`・`max-h-[90dvh]`）で、デスクトップだけ中央モーダルになる。
       *
       * preset は `sm:` でフロートカード化し padding も落とすため、
       * 「タブレット幅でも全幅の下部シートのまま」でよい面には強すぎる。
       * 既存の素の SheetContent をデスクトップ対応させたいときはこれを使う。
       */
      preset: "plain"
      /** 内側の既定 padding（`p-6`）。既定 true。 */
      padding?: boolean
      /** 面の素材。モバイル / デスクトップの両方に効く。既定 "default"。 */
      surface?: SheetSurface
      /**
       * デスクトップ側の縦位置。既定 "center"。
       * "fullscreen" は DialogContent の `max-w-none` と plain の `sm:max-w-lg` が
       * 別 modifier で共存し「幅だけ 32rem に縛られた全画面」になるため受け付けない。
       */
      desktopPosition?: "center" | "top"
    })
  | (ResponsiveOverlayFrameBaseProps & {
      side: "float" | "float-glass"
      /** float 系は preset を持たない（配置は side が決める）。 */
      preset?: never
      /**
       * 内側の既定 padding（`p-6`）。既定 true。
       * float 系だけが持つ（side="bottom" は preset が余白を持つ）。
       */
      padding?: boolean
      /**
       * float 系の素材は `side` 自身が決める（"float" = 不透明 /
       * "float-glass" = Liquid Glass）ため、`surface` とは併用できない。
       * 二重にガラスを重ねると glass.css の記述順でしか勝敗が決まらないため、
       * 型で禁止している。
       */
      surface?: never
      /**
       * float 系は常に中央。"fullscreen" は float の寸法指定と噛み合わず
       * 「幅だけ 32rem に縛られた全画面」になるため受け付けない。
       */
      desktopPosition?: never
    })

/**
 * BottomSheetFrame の preset をモバイルで保ったまま、デスクトップでは
 * DialogContent（中央モーダル）として出すレスポンシブ overlay frame（issue #472）。
 *
 * 切り替え境界は親の `<ResponsiveDialog breakpoint="md" | "lg" | "product-theme">`
 * が決める。`<ResponsiveDialog snapPoints={...}>` の snap シートは境界を越えても
 * シートのまま（snap は「掴んで高さを変える」操作そのものが機能のため）。
 *
 * `description` / `autoFocus` / `restoreFocusOnClose` / `closeOnEsc` /
 * `bodyScrollLock` / `zIndex` は両分岐へそのまま渡る（DialogContent と
 * SheetContent が同名・同義の prop を持つ）。`container` / `overlayClassName` /
 * `glassOverlay` / `swipeToClose` はシート固有なのでデスクトップでは無視される。
 *
 * @example
 * <ResponsiveDialog open={open} onOpenChange={setOpen} breakpoint="md">
 *   <ResponsiveOverlayFrame preset="mobile-form" description="タスクを編集します">
 *     <DetailSheetScaffold
 *       header={<DetailSheetHeader title="タスクを編集" />}
 *       footer={<ResponsiveOverlayFooter><Button>保存</Button></ResponsiveOverlayFooter>}
 *     >
 *       …fields…
 *     </DetailSheetScaffold>
 *   </ResponsiveOverlayFrame>
 * </ResponsiveDialog>
 */
function ResponsiveOverlayFrame(allProps: ResponsiveOverlayFrameProps) {
  const {
    side = "bottom",
    preset = "mobile-form",
    surface = "default",
    padding = true,
    className,
    mobileClassName,
    desktopClassName,
    desktopPosition = "center",
    children,
    ...props
  } = allProps as ResponsiveOverlayFrameBaseProps & {
    side?: ResponsiveOverlaySide
    preset?: BottomSheetFramePreset | "plain"
    surface?: SheetSurface
    padding?: boolean
    desktopPosition?: "center" | "top" | "fullscreen"
  }
  const isDesktop = useResponsiveOverlayIsDesktop()
  const isFloat = floatSides.has(side)
  // preset="plain" は BottomSheetFrame を通さず素の SheetContent を出す（#486）。
  const isPlain = !isFloat && preset === "plain"

  // #487: デスクトップ幅のタッチ端末でもソフトキーボードは出る。中央モーダルの
  // 高さだけを可視領域に収める（lift は当てない — 上の JSDoc 参照）。
  // ズーム分を打ち消したキーボード高さ（resolveOverlayKeyboardInset の JSDoc）と、
  // 「編集可能な要素にフォーカスがある」ゲートの AND で発火させる。
  const keyboardInset = useOverlayKeyboardInset()
  const editableFocused = useEditableElementFocused()
  // 経路ごとの既定キャップ。consumer が style.maxHeight を渡していればそれを
  // 既定とみなす（補正で握り潰さない / #487）。
  const consumerMaxHeight = (allProps as { style?: React.CSSProperties }).style
    ?.maxHeight
  // DialogContent と同じ既定（true）。position="top" の上オフセット計算に使う。
  const safeArea = (allProps as { safeArea?: boolean }).safeArea ?? true
  const declaredMaxHeight =
    consumerMaxHeight != null
      ? toCalculableMaxHeight(consumerMaxHeight)
      : isFloat
        ? desktopFloatMaxHeight
        : isPlain
          ? desktopPlainMaxHeight
          : desktopPresetMaxHeights[preset as BottomSheetFramePreset]
  const keyboardActive = isDesktop && editableFocused && keyboardInset > 0
  // className（desktopClassName の max-h-[...] 等）で締められたキャップも
  // 拾うため、補正が当たっていない間の computed 値を優先する。
  const { setElement, measured: measuredMaxHeight } = useEffectiveMaxHeight(
    keyboardActive,
    // 実測のあいだ戻す値（consumer が inline で締めていればその値）。
    consumerMaxHeight == null
      ? ""
      : typeof consumerMaxHeight === "number"
        ? `${consumerMaxHeight}px`
        : `${consumerMaxHeight}`,
    // キャップを決める入力が変わったら測り直す。consumer の className だけで
    // なく、recipe を決める preset / side / desktopPosition も含める
    // （mobile-full → mobile-form で 44rem → 40rem に変わる等 / #487）。
    `${className ?? ""} ${desktopClassName ?? ""} ${side} ${preset} ${desktopPosition}`
  )

  // consumer の ref を握り潰さない（#487 の Codex レビュー指摘）。
  // モバイル（Sheet）分岐では素通しなのに、デスクトップ分岐だけ計測用の
  // ref で上書きすると、境界を跨いだ瞬間に consumer の ref が空になる。
  const consumerRef = (allProps as { ref?: React.Ref<HTMLDivElement> }).ref
  // React 19 のコールバック ref は cleanup を返せるので、consumer が返した
  // cleanup を握り潰さずに伝播させる（返すと React は ref(null) を呼ばない）。
  const setContentRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      setElement(node)
      const consumerCleanup =
        typeof consumerRef === "function"
          ? consumerRef(node)
          : consumerRef
            ? (((consumerRef as React.RefObject<HTMLDivElement | null>).current =
                node),
              undefined)
            : undefined
      // React 18 のコールバック ref は戻り値を許さない（"Unexpected return
      // value from a callback ref" の警告になる）。cleanup を返すのは
      // consumer が cleanup を返したときだけにする。返さない経路では
      // React が ref(null) を呼ぶので、この関数の本体側で解除される。
      if (typeof consumerCleanup !== "function") return
      return () => {
        setElement(null)
        consumerCleanup()
      }
    },
    [setElement, consumerRef]
  )

  // RefObject だと layout effect の時点で null のまま再実行されない。
  // コールバック ref を state にして、マウントで確実に測り直す。

  // 実測が取れたらそれが唯一の正（"none" のように計算に使えない実測は
  // 「キャップ無し」なので、宣言側へフォールバックしない）。
  const baseMaxHeight =
    measuredMaxHeight != null && measuredMaxHeight !== ""
      ? toCalculableMaxHeight(measuredMaxHeight)
      : declaredMaxHeight
  const desktopKeyboardStyle = keyboardActive
    ? resolveDesktopOverlayKeyboardStyle(
        keyboardInset,
        desktopPosition,
        baseMaxHeight,
        safeArea
      )
    : undefined
  // CSS フォールバック（html[data-kb-open] + --kb-h）にも同じ既定値を渡す。
  const desktopBaseMaxHeightStyle =
    isDesktop && baseMaxHeight
      ? ({ [OVERLAY_BASE_MAX_HEIGHT_VAR]: baseMaxHeight } as React.CSSProperties)
      : undefined

  if (isDesktop && isFloat) {
    // float 系はシート固有の prop を落として中央モーダルへ。
    const {
      container: _container,
      overlayClassName: _overlayClassName,
      glassOverlay: _glassOverlay,
      swipeToClose: _swipeToClose,
      ...dialogProps
    } = props
    return (
      <DialogContent
        position={desktopPosition}
        // DialogContent 既定の padding は `flex flex-col gap-4 p-6` で、float の
        // SheetContent（`p-6` のみ）と段間が変わる。モバイルと同じ見え方に
        // するため既定を切り、ここで p-6 だけを足す。
        padding={false}
        className={cn(
          desktopFloatClasses,
          padding && "p-6",
          // float-glass はシート側の素材（glass + glass-specular）を持ち込む。
          // DialogContent 既定の不透明な面は twMerge で確実に外す。
          // 実スクロールは sheet-keyboard.css の
          // :is(sheet-content, dialog-content)[data-side="float-glass"] が担う
          // （.glass-specular の overflow:hidden が非レイヤー CSS で
          //   overflow-y-auto を踏み潰すため / #337・#479）。
          side === "float-glass" && "bg-transparent glass glass-specular",
          className,
          desktopClassName
        )}
        {...dialogProps}
        // #487: キーボード補正は max-height だけ。style は spread より後ろに
        // 置き、consumer の style は展開して残す（丸ごと落とさない）。
        ref={setContentRef}
        style={{
          ...desktopBaseMaxHeightStyle,
          ...dialogProps.style,
          ...desktopKeyboardStyle,
        }}
        // data-* は spread より後ろに置く（#339: consumer が上書きすると
        // DS / 消費側の CSS セレクタが丸ごと外れる。#487 のキーボード補正も
        // data-frame / data-side を見ているので同じ扱いにする）。
        data-frame="responsive-overlay-frame"
        data-side={side}
        data-surface={surface}
      >
        <TitleSurfaceScaleProvider scale="dialog">{children}</TitleSurfaceScaleProvider>
      </DialogContent>
    )
  }

  if (isDesktop && isPlain) {
    const {
      container: _container,
      overlayClassName: _overlayClassName,
      glassOverlay: _glassOverlay,
      swipeToClose: _swipeToClose,
      ...dialogProps
    } = props
    return (
      <DialogContent
        position={desktopPosition}
        // DialogContent 既定の padding は `flex flex-col gap-4 p-6` で、素の
        // SheetContent（`p-6` のみ）と段間が変わる。モバイルと同じ見え方に
        // するため既定を切り、ここで p-6 だけを足す。
        padding={false}
        className={cn(
          desktopPlainClasses,
          padding && "p-6",
          sheetSurfaceClasses[surface],
          className,
          desktopClassName
        )}
        {...dialogProps}
        // #487: キーボード補正は max-height だけ。style は spread より後ろに
        // 置き、consumer の style は展開して残す（丸ごと落とさない）。
        ref={setContentRef}
        style={{
          ...desktopBaseMaxHeightStyle,
          ...dialogProps.style,
          ...desktopKeyboardStyle,
        }}
        // data-* は spread より後ろに置く（#339: consumer が上書きすると
        // DS / 消費側の CSS セレクタが丸ごと外れる）。
        data-frame="responsive-overlay-frame"
        data-side="bottom"
        data-preset="plain"
        data-surface={surface}
      >
        <TitleSurfaceScaleProvider scale="dialog">{children}</TitleSurfaceScaleProvider>
      </DialogContent>
    )
  }

  if (isPlain) {
    return (
      <SheetContent
        side="bottom"
        padding={padding}
        className={cn(sheetSurfaceClasses[surface], className, mobileClassName)}
        {...props}
        data-frame="responsive-overlay-frame"
        data-preset="plain"
      >
        {/* SheetContent 自身が children を scale="dialog" で包む（#341）。 */}
        {children}
      </SheetContent>
    )
  }

  if (isFloat) {
    return (
      <SheetContent
        data-frame="responsive-overlay-frame"
        side={side}
        padding={padding}
        className={cn(className, mobileClassName)}
        {...props}
      >
        {/* SheetContent 自身が children を scale="dialog" で包むため、
            ここで包み直す必要はない（#341）。 */}
        {children}
      </SheetContent>
    )
  }

  // ここから先は preset 経路（float / plain は上で return 済み）。
  const framePreset = preset as BottomSheetFramePreset

  if (isDesktop) {
    // シート固有の prop はデスクトップ（中央モーダル）に意味が無いので落とす。
    const {
      container: _container,
      overlayClassName: _overlayClassName,
      glassOverlay: _glassOverlay,
      swipeToClose: _swipeToClose,
      ...dialogProps
    } = props
    return (
      <DialogContent
        position={desktopPosition}
        padding={false}
        className={cn(
          desktopPresetClasses[framePreset],
          sheetSurfaceClasses[surface],
          className,
          desktopClassName
        )}
        {...dialogProps}
        // #487: キーボード補正は max-height だけ。style は spread より後ろに
        // 置き、consumer の style は展開して残す（丸ごと落とさない）。
        ref={setContentRef}
        style={{
          ...desktopBaseMaxHeightStyle,
          ...dialogProps.style,
          ...desktopKeyboardStyle,
        }}
        // data-* は spread より後ろに置く（#339 / #487）。
        // #487: preset 経路のデスクトップ分岐だけ data-side が無く、DS からも
        // consumer からもキーボード補正のセレクタを絞れなかったので足した。
        data-frame="responsive-overlay-frame"
        data-side="bottom"
        data-preset={framePreset}
        data-surface={surface}
      >
        {/*
          DialogContent は children を "dialog" 文脈で包むため、全画面級 preset は
          その内側で "page" 文脈に包み直してモバイル側と見出し階層を揃える。
          desktopPosition="fullscreen" は DialogContent 自身が "page" にするので
          結果は同じ（明示しても害はない）。
        */}
        <TitleSurfaceScaleProvider scale={pageScalePresets.has(framePreset) ? "page" : "dialog"}>
          {children}
        </TitleSurfaceScaleProvider>
      </DialogContent>
    )
  }

  return (
    <BottomSheetFrame
      preset={framePreset}
      surface={surface}
      className={cn(className, mobileClassName)}
      {...props}
    >
      {children}
    </BottomSheetFrame>
  )
}

/**
 * ResponsiveOverlayFrame 用のフッタ。モバイルでは KeyboardAwareSheetFooter
 * （ソフトキーボード追従 + home indicator の safe-area）、デスクトップでは
 * 同じ見た目の静的フッタになる（デスクトップにはソフトキーボードが無いため、
 * sticky と visualViewport 追従を外す）。
 */
function ResponsiveOverlayFooter({
  behavior = "fixed",
  surface = "default",
  hideWhenInputFocused,
  className,
  children,
  ...props
}: KeyboardAwareSheetFooterProps) {
  const isDesktop = useResponsiveOverlayIsDesktop()

  if (isDesktop) {
    return (
      <div
        data-slot="keyboard-aware-sheet-footer"
        data-behavior={behavior}
        data-surface={surface}
        className={cn(
          "shrink-0 bg-[var(--Surface-Primary)] px-5 pt-3 pb-4",
          "border-t border-[var(--Border-Low-Emphasis)]",
          sheetSurfaceClasses[surface],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }

  return (
    <KeyboardAwareSheetFooter
      behavior={behavior}
      surface={surface}
      hideWhenInputFocused={hideWhenInputFocused}
      className={className}
      {...props}
    >
      {children}
    </KeyboardAwareSheetFooter>
  )
}

export {
  ResponsiveOverlayFrame,
  ResponsiveOverlayFooter,
  resolveDesktopOverlayKeyboardStyle,
  resolveOverlayKeyboardInset,
}
export type { ResponsiveOverlayFrameProps, ResponsiveOverlaySide }
/** ResponsiveOverlayFooter の props（KeyboardAwareSheetFooter と同型）。 */
export type { KeyboardAwareSheetFooterProps as ResponsiveOverlayFooterProps }
