import { cn } from "@/lib/utils"
import { useVisualViewportKeyboardInset } from "@/lib/use-visual-viewport-keyboard-inset"
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
 * 「キーボード + 上オフセット + 下マージン」を引く。`position="fullscreen"` は
 * 面そのものが可視領域ではなくビューポートに合わせる指定なので対象外。
 *
 * 高さは 0 で下限を切る（負値だと「上端が抜ける」不具合を「中身が高さ 0 で
 * 消える」不具合にすり替えるだけになる — float 系と同じ判断 / #337）。
 */
function resolveDesktopOverlayKeyboardStyle(
  keyboardInset: number,
  position: "center" | "top" | "fullscreen"
): { maxHeight: string } | undefined {
  if (keyboardInset <= 0) return undefined
  if (position === "fullscreen") return undefined
  if (position === "top") {
    return {
      maxHeight: `max(0px, calc(100dvh - ${keyboardInset}px - max(env(safe-area-inset-top, 0px), 2rem) - 2rem))`,
    }
  }
  return { maxHeight: `max(0px, calc(100dvh - ${keyboardInset * 2}px))` }
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
  // #487: デスクトップ幅のタッチ端末でもソフトキーボードは出る。中央モーダルの
  // 高さだけを可視領域に収める（lift は当てない — 上の JSDoc 参照）。
  const { keyboardInset } = useVisualViewportKeyboardInset()
  const desktopKeyboardStyle = isDesktop
    ? resolveDesktopOverlayKeyboardStyle(keyboardInset, desktopPosition)
    : undefined
  // preset="plain" は BottomSheetFrame を通さず素の SheetContent を出す（#486）。
  const isPlain = !isFloat && preset === "plain"

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
        data-frame="responsive-overlay-frame"
        data-side={side}
        data-surface={surface}
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
        style={{ ...dialogProps.style, ...desktopKeyboardStyle }}
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
        style={{ ...dialogProps.style, ...desktopKeyboardStyle }}
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
        data-frame="responsive-overlay-frame"
        // #487: preset 経路のデスクトップ分岐だけ data-side が無く、DS からも
        // consumer からもキーボード補正のセレクタを絞れなかった。float / plain
        // と揃えて出す（補正の実体は下の sheet-keyboard.css と style 属性）。
        data-side="bottom"
        data-preset={framePreset}
        data-surface={surface}
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
        style={{ ...dialogProps.style, ...desktopKeyboardStyle }}
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

export { ResponsiveOverlayFrame, ResponsiveOverlayFooter, resolveDesktopOverlayKeyboardStyle }
export type { ResponsiveOverlayFrameProps, ResponsiveOverlaySide }
/** ResponsiveOverlayFooter の props（KeyboardAwareSheetFooter と同型）。 */
export type { KeyboardAwareSheetFooterProps as ResponsiveOverlayFooterProps }
