import { getActiveElement } from "@/lib/active-element"
import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"
import { warnOnceInDev } from "@/lib/dev-warn"
import { usePortalContainer } from "./portal-container"
import { DescribedByLinker, useDescribedByLink } from "@/lib/described-by"
import { useComposedRef } from "@/lib/compose-ref"
import { Button } from "./button"
import { SemanticIcon } from "./semantic-icon"
import { useKskLabels } from "./ksk-labels"
import {
  ModalStackRegistrar,
  ModalityProvider,
  modalContentZ,
  modalOverlayZ,
  useModality,
} from "@/lib/modal-stack"
import {
  OverlayTitleSlotProvider,
  TitleSurfaceScaleProvider,
  useTitleTypoClass,
  type TitleLevel,
} from "../../lib/title-level"

type LayerAutoFocusTarget = "first-input" | "title" | React.RefObject<HTMLElement | null> | false

function getFocusableTarget(container: HTMLElement, target: LayerAutoFocusTarget, titleSlot: string) {
  if (target === false) return null
  if (target === "title") {
    return container.querySelector<HTMLElement>(`[data-slot="${titleSlot}"]`)
  }
  if (target === "first-input") {
    return container.querySelector<HTMLElement>(
      [
        "input:not([disabled])",
        "textarea:not([disabled])",
        "select:not([disabled])",
        "button:not([disabled])",
        "[href]",
        "[tabindex]:not([tabindex='-1'])",
      ].join(", ")
    )
  }
  return target.current
}

function focusLayerTarget(container: HTMLElement | null, target: LayerAutoFocusTarget | undefined, titleSlot: string) {
  if (!container || target == null) return
  const el = getFocusableTarget(container, target, titleSlot)
  if (!el) return
  if (el.tabIndex < 0 && target === "title") {
    el.tabIndex = -1
  }
  el.focus()
}

function captureRestoreFocus(ref: React.RefObject<HTMLElement | null>) {
  if (ref.current != null || typeof document === "undefined") return
  ref.current = getActiveElement() as HTMLElement | null
}

function Dialog({ modal = true, ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  // #505: modal かどうかを子孫（Content）へ伝える。Radix は内部 context に
  // 持っているが公開していないため、DS 側で同じ値をもう 1 本流す。
  return (
    <ModalityProvider value={modal}>
      <DialogPrimitive.Root data-slot="dialog" modal={modal} {...props} />
    </ModalityProvider>
  )
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ container, ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  // 明示 container > PortalContainerProvider > document.body（#360）
  const resolvedContainer = usePortalContainer(container)
  return <DialogPrimitive.Portal data-slot="dialog-portal" container={resolvedContainer} {...props} />
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

interface DialogOverlayProps
  extends React.ComponentProps<typeof DialogPrimitive.Overlay> {
  /**
   * #340: グローバル open-modal スタックでの深度（0 = 最初に開いたモーダル）。
   * 指定時は z-index を `--Z-Overlay + 段数*20` で上書きする。未指定時は
   * --Z-Overlay 固定（従来挙動）。
   */
  stackLevel?: number
}

function DialogOverlay({ className, style, stackLevel, ...props }: DialogOverlayProps) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        // stackLevel 指定時は下のインライン style が per-instance で上書きする
        // （同一 specificity のユーティリティのままだと DOM 順が勝敗を決める）。
        "fixed inset-0 z-[var(--Z-Overlay)] bg-[var(--Overlay-Dark)]",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        className
      )}
      style={{
        ...style,
        ...(stackLevel != null ? { zIndex: modalOverlayZ(stackLevel) } : null),
      }}
      {...props}
    />
  )
}

/**
 * 幅の段（`position` が "center" / "top" のときの 480px キャップを置き換える）。
 * 既定 `md` = 従来の `sm:max-w-[480px]`。狭い画面では段に関係なく
 * `max-w-[calc(100%_-_3rem)]`（左右 24px）が効く。クラスは完全な文字列で持つ
 * （動的合成だと safelist が静的抽出できない）。
 */
const dialogSizeClasses = {
  sm: "sm:max-w-[400px]",
  md: "sm:max-w-[480px]",
  lg: "sm:max-w-[640px]",
  xl: "sm:max-w-[800px]",
  "2xl": "sm:max-w-[1024px]",
} as const

type DialogSize = keyof typeof dialogSizeClasses

/** `position="fullscreen"` を中央表示へ切り替える幅（issue #713）。Tailwind の sm / md / lg と同じ */
type DialogCenterFrom = "sm" | "md" | "lg"

/**
 * `position="fullscreen"` + `centerFrom` の、境界以上で効く中央モーダルのクラス（issue #713）。
 * 全画面のクラス（inset-0 / h-full / max-w-none / rounded-none）を境界以上で打ち消し、
 * center と同じ位置・角丸・影にする。overflow-hidden（子側でスクロールする全画面の約束）は保つ。
 * クラスは完全な文字列で持つ（safelist の静的抽出のため）。
 */
const fullscreenCenterFromClasses: Record<DialogCenterFrom, string> = {
  sm: "sm:inset-auto sm:left-[50%] sm:top-[50%] sm:w-full sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-[var(--Radius-Modal)] sm:shadow-[var(--shadow-dialog)]",
  md: "md:inset-auto md:left-[50%] md:top-[50%] md:w-full md:translate-x-[-50%] md:translate-y-[-50%] md:rounded-[var(--Radius-Modal)] md:shadow-[var(--shadow-dialog)]",
  lg: "lg:inset-auto lg:left-[50%] lg:top-[50%] lg:w-full lg:translate-x-[-50%] lg:translate-y-[-50%] lg:rounded-[var(--Radius-Modal)] lg:shadow-[var(--shadow-dialog)]",
}

/** centerFrom の中央表示の幅。左右 24px を残す幅と size のキャップの小さい方（1 クラスに畳む: 同じ接頭辞の max-w-* は twMerge が後勝ちで消すため） */
const fullscreenCenterFromSizeClasses: Record<DialogCenterFrom, Record<DialogSize, string>> = {
  sm: {
    sm: "sm:max-w-[min(400px,calc(100%_-_3rem))]",
    md: "sm:max-w-[min(480px,calc(100%_-_3rem))]",
    lg: "sm:max-w-[min(640px,calc(100%_-_3rem))]",
    xl: "sm:max-w-[min(800px,calc(100%_-_3rem))]",
    "2xl": "sm:max-w-[min(1024px,calc(100%_-_3rem))]",
  },
  md: {
    sm: "md:max-w-[min(400px,calc(100%_-_3rem))]",
    md: "md:max-w-[min(480px,calc(100%_-_3rem))]",
    lg: "md:max-w-[min(640px,calc(100%_-_3rem))]",
    xl: "md:max-w-[min(800px,calc(100%_-_3rem))]",
    "2xl": "md:max-w-[min(1024px,calc(100%_-_3rem))]",
  },
  lg: {
    sm: "lg:max-w-[min(400px,calc(100%_-_3rem))]",
    md: "lg:max-w-[min(480px,calc(100%_-_3rem))]",
    lg: "lg:max-w-[min(640px,calc(100%_-_3rem))]",
    xl: "lg:max-w-[min(800px,calc(100%_-_3rem))]",
    "2xl": "lg:max-w-[min(1024px,calc(100%_-_3rem))]",
  },
}

/** centerFrom の中央表示の高さ。auto は中身なり（上限 画面 - 4rem）、fill は画面 - 4rem に固定 */
const fullscreenCenterFromHeightClasses: Record<DialogCenterFrom, Record<"auto" | "fill", string>> = {
  sm: { auto: "sm:h-auto sm:max-h-[calc(100dvh_-_4rem)]", fill: "sm:h-[calc(100dvh_-_4rem)]" },
  md: { auto: "md:h-auto md:max-h-[calc(100dvh_-_4rem)]", fill: "md:h-[calc(100dvh_-_4rem)]" },
  lg: { auto: "lg:h-auto lg:max-h-[calc(100dvh_-_4rem)]", fill: "lg:h-[calc(100dvh_-_4rem)]" },
}

/**
 * centerFrom の中央表示の内側余白。全画面の safe-area 込みの padding を境界以上で
 * 中央モーダルの値へ戻す（方向別に書く: ショートハンドと方向指定の混在は勝敗が生成順に依存するため）。
 */
const fullscreenCenterFromPaddingClasses: Record<DialogCenterFrom, Record<"padded" | "bare", string>> = {
  sm: { padded: "sm:pl-6 sm:pr-6 sm:pt-6 sm:pb-6", bare: "sm:pl-0 sm:pr-0 sm:pt-0 sm:pb-0" },
  md: { padded: "md:pl-6 md:pr-6 md:pt-6 md:pb-6", bare: "md:pl-0 md:pr-0 md:pt-0 md:pb-0" },
  lg: { padded: "lg:pl-6 lg:pr-6 lg:pt-6 lg:pb-6", bare: "lg:pl-0 lg:pr-0 lg:pt-0 lg:pb-0" },
}

/** centerFrom の中央表示の入退場。下からのスライドを止め、center と同じ zoom にする */
const fullscreenCenterFromMotionClasses: Record<DialogCenterFrom, string> = {
  sm: "sm:data-[state=open]:slide-in-from-bottom-0 sm:data-[state=open]:zoom-in-95 sm:data-[state=closed]:slide-out-to-bottom-0 sm:data-[state=closed]:zoom-out-95",
  md: "md:data-[state=open]:slide-in-from-bottom-0 md:data-[state=open]:zoom-in-95 md:data-[state=closed]:slide-out-to-bottom-0 md:data-[state=closed]:zoom-out-95",
  lg: "lg:data-[state=open]:slide-in-from-bottom-0 lg:data-[state=open]:zoom-in-95 lg:data-[state=closed]:slide-out-to-bottom-0 lg:data-[state=closed]:zoom-out-95",
}

interface DialogContentProps
  extends Omit<React.ComponentProps<typeof DialogPrimitive.Content>, "autoFocus"> {
  /**
   * デフォルトの内側余白とセクション間レイアウトを制御。
   * - true（既定）: p-6 + `flex flex-col gap-4` を付与。ヘッダ/本文/フッタが
   *                 16px 間隔で縦に並ぶ（AlertDialog と同じ挙動）。本文セクションを
   *                 持たない確認ダイアログでも、ヘッダとフッタが詰まらない。
   * - false       : 余白・レイアウトを一切付与しない（素の要素）。タブ/スクロール
   *                 本体/固定フッタの3段構成など、内側を自前でレイアウトする
   *                 複雑モーダル向け。
   */
  padding?: boolean
  /**
   * Optional screen-reader description for the dialog.
   * - string / ReactNode: 自動で sr-only な <DialogDescription> を
   *   レンダリングし、`aria-describedby` に紐付ける
   * - undefined（既定）: `aria-describedby={undefined}` を明示して
   *   Radix の "Missing Description" 警告を抑制。description が
   *   概念上不要なダイアログ用。
   * 可視の description を出したい場合は、この prop を使わず子要素として
   * `<DialogDescription>` を直接置く（#485 以降、子に置いた Description は
   * 自動で `aria-describedby` に紐付く。id の手当ては不要）。
   */
  description?: React.ReactNode
  /**
   * 縦位置。
   * - "center" (既定): 画面中央
   * - "top": 上部寄せ (safe-area-inset-top + 2rem 下) — モバイルで縦長
   *   コンテンツ (チェックリスト等) を出すときに、コンテンツが
   *   スクロールしやすく操作しやすい
   * - "fullscreen": 全画面 (inset-0)。モバイルのウィザード/エディタ等、
   *   Dialog をページ代わりに使う場面向け。四辺とも safe-area を確保する
   *   （`safeArea` prop で無効化可能）。配下の DialogTitle は既定で
   *   画面タイトル相当（typo-heading-2xl）になる（#341）
   */
  position?: "center" | "top" | "fullscreen"
  /**
   * safe-area（ノッチ・ステータスバー・ホームインジケータ）の回避を
   * 有効にするか。既定 true。
   * - "top": 上端に `max(env(safe-area-inset-top), 2rem)` を確保（従来挙動）
   * - "fullscreen": 四辺すべてに env(safe-area-inset-*) を確保（横向きの
   *   iPhone ではノッチが左右に来るため上下だけでは足りない）
   * - "center": 効果なし
   * false にすると回避を無効化する（consumer が自前で safe-area を管理する
   * 場合のオプトアウト。安全側の既定を壊さないよう既定は true）。
   *
   * なお `data-safe-area` 属性は position に関わらず常に出力される
   * （値はこの prop そのもの）。効果があるのは "top" / "fullscreen" だけ。
   */
  safeArea?: boolean
  /**
   * 幅の段。`position="fullscreen"` では無視する（全画面は幅を持たない）。
   * - "sm": 400px（確認だけの短い文面）
   * - "md"（既定）: 480px（従来の幅）
   * - "lg": 640px（フォーム 2 カラム・簡易な表）
   * - "xl": 800px（表・プレビューを内蔵する広いダイアログ）
   * - "2xl": 1024px（見取り図・大きな表など、PC で画面の大半を使う作業面。issue #713）
   * 狭い画面では左右 24px を残す幅が優先される。size の段は
   * `sm:` 付きなので、上書きするときは `className` に `sm:max-w-*` を渡す
   * （接頭辞なしの `max-w-*` は size に勝たない。twMerge は同じ接頭辞同士で後勝ち）。SheetContent の `size`
   * と段の名前を揃えている。
   */
  size?: DialogSize
  /**
   * `position="fullscreen"` を、この幅以上で中央のモーダルへ切り替える（issue #713）。
   * スマホは全画面、PC は中央の大きなモーダル、という作業面向け。
   * - 未指定（既定）: どの幅でも全画面（従来）
   * - "sm" / "md" / "lg": その幅（640 / 768 / 1024px）以上で center と同じ位置・角丸・影・`size` の幅になり、
   *   高さは `height` に従う（既定は中身なりで上限 画面 - 4rem）。内側余白は safe-area を足さない p-6（padding=false なら 0）
   *
   * 中央表示でも全画面と同じく面は overflow-hidden のまま（中身のスクロールは子側に置く）。
   * 配下の DialogTitle の既定は全画面と同じ画面タイトル相当（typo-heading-2xl）。
   * `position` が "fullscreen" 以外のときは無視する。
   */
  centerFrom?: DialogCenterFrom
  /**
   * 中央表示の高さ（issue #713）。`position="center"` と、`position="fullscreen"` + `centerFrom` の中央表示で効く
   * （"top" と全画面の間は効かない）。
   * - "auto"（既定）: 中身なり（従来）
   * - "fill": 画面の高さ - 4rem に固定する。見取り図・表など、中身の量で枠の高さが変わると困る作業面向け
   * position="top" と、centerFrom の無い fullscreen では効かない（開発ビルドで警告）
   */
  height?: "auto" | "fill"
  /**
   * open 時の初期フォーカス。未指定時は Radix の既定挙動。
   * - "first-input": 最初の入力/操作可能要素
   * - "title": DialogTitle
   * - ref: 任意要素
   * - false: 自動フォーカスを抑制
   */
  autoFocus?: LayerAutoFocusTarget
  /** close 後に open 前の要素へ focus を戻す。既定 true。 */
  restoreFocusOnClose?: boolean
  /** Esc キーで閉じる。既定 true。 */
  closeOnEsc?: boolean
  /**
   * Dialog 表示中に body scroll を抑止する。既定 true。
   * 実際の抑止は modal Dialog（Radix）標準の scroll lock が「開いている間だけ」
   * 行うため、この prop は後方互換のために受けるのみ（DOM へは流さない）。
   * 背景スクロールを許可したい場合は非 modal な Dialog を使う。
   */
  bodyScrollLock?: boolean
  /**
   * #340: 多段モーダルの z-index escape hatch。
   * 未指定時は開いているモーダルの順序（グローバルスタック）から自動算出
   * （overlay = 50 + 段数*20 / content = 60 + 段数*20）されるため通常は不要。
   */
  zIndex?: number
}

function DialogContent({
  className,
  children,
  padding = true,
  description,
  position = "center",
  safeArea = true,
  size = "md",
  centerFrom,
  height = "auto",
  autoFocus,
  restoreFocusOnClose = true,
  closeOnEsc = true,
  bodyScrollLock: _bodyScrollLock = true,
  zIndex,
  style,
  ref,
  ...props
}: DialogContentProps) {
  const autoDescId = React.useId()
  // #713: centerFrom は全画面のときだけ効く
  const centeredFrom = position === "fullscreen" ? centerFrom : undefined
  // #713 レビュー: height="fill" は中央表示（center / centerFrom の境界以上）でだけ効く。効かない組み合わせは
  // 開発ビルドで知らせる（top は max-h で伸びる・全画面は常に画面いっぱい）
  React.useEffect(() => {
    if (height !== "fill") return
    if (position === "top") {
      warnOnceInDev(
        "dialog-height-fill-top",
        'DialogContent: height="fill" は position="top" では効きません（top は画面の残りを上限に中身なりで伸びます）。'
      )
    } else if (position === "fullscreen" && !centerFrom) {
      warnOnceInDev(
        "dialog-height-fill-fullscreen",
        'DialogContent: height="fill" は position="fullscreen" では centerFrom を指定したときの中央表示でだけ効きます（全画面は常に画面いっぱいです）。'
      )
    }
  }, [height, position, centerFrom])
  // #505: modal な層だけ aria-modal="true" を出し、公開判定（useHasOpenModal）
  // でも modal な層としてだけ数える。`modal={false}` の Dialog は背面が生きて
  // いるので、どちらも false 側に倒す。
  const isModal = useModality()
  // #340: Sheet(#158) と同じグローバル open-modal スタックに参加する。
  // DialogContent 自体は開閉に関係なく毎回レンダリングされるので、枠の確保は
  // Radix の Presence が開いている間だけマウントする <ModalStackRegistrar> に
  // 任せる（詳細は lib/modal-stack.ts）。
  const [stackLevel, setStackLevel] = React.useState(0)
  const resolvedContentZ = zIndex ?? modalContentZ(stackLevel)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const restoreFocusRef = React.useRef<HTMLElement | null>(null)
  // body scroll lock は Radix (modal Dialog) の react-remove-scroll が
  // 「開いている間だけ」担うため、ここでは何もしない。bodyScrollLock prop は
  // API 互換のため残し、DOM へ流さないよう分割代入で受けるだけにしている。
  // （以前ここにあった手動ロックは DialogContent が閉じていても実行され、
  //   body の overflow:hidden を出しっぱなしにしてページ全体のスクロールを
  //   殺していた。#storybook でコンテンツがスクロールできない原因。）
  const hasInternalDesc = description != null && description !== false
  // - description 渡しあり → 生成した sr-only Description の id
  // - description なし → 呼び出し側の aria-describedby（無ければ undefined を明示）
  //   undefined を明示することで Radix の "Missing Description" 警告が消える。
  //   子に <DialogDescription> が置かれている場合は <DescribedByLinker> が
  //   マウント後にその id を復元する（#485）。
  const ariaDescribedBy = hasInternalDesc ? autoDescId : props["aria-describedby"]
  const autoLinkDescription = !hasInternalDesc && props["aria-describedby"] == null
  const { setContentNode, applyDescribedBy } = useDescribedByLink(
    contentRef,
    "dialog-description",
    autoLinkDescription
  )

  // 内側の contentRef（autoFocus / フォーカス復帰 / aria-describedby の紐付け）を
  // 保ったまま、呼び出し側の ref にも同じ要素を渡す（#487: ResponsiveOverlayFrame が
  // 実効 max-height を実測するのに面の DOM を要る）。
  const mergedRef = useComposedRef(setContentNode, ref)
  const handleOpenAutoFocus = (event: Event) => {
    captureRestoreFocus(restoreFocusRef)
    props.onOpenAutoFocus?.(event)
    if (event.defaultPrevented || autoFocus == null) return
    event.preventDefault()
    if (autoFocus === false) return
    window.requestAnimationFrame(() => {
      focusLayerTarget(contentRef.current, autoFocus, "dialog-title")
    })
  }
  const handleCloseAutoFocus = (event: Event) => {
    props.onCloseAutoFocus?.(event)
    if (event.defaultPrevented) return
    if (!restoreFocusOnClose) {
      event.preventDefault()
      return
    }
    if (restoreFocusRef.current) {
      event.preventDefault()
      restoreFocusRef.current.focus()
    }
  }
  const handleEscapeKeyDown = (event: KeyboardEvent) => {
    props.onEscapeKeyDown?.(event)
    if (!closeOnEsc) event.preventDefault()
  }
  return (
    <DialogPortal>
      <DialogOverlay stackLevel={stackLevel} />
      <DialogPrimitive.Content
        ref={mergedRef}
        data-slot="dialog-content"
        data-position={position}
        data-center-from={centeredFrom}
        data-height={height === "fill" ? "fill" : undefined}
        data-safe-area={safeArea}
        className={cn(
          "fixed z-[var(--Z-Modal)]",
          // 横位置・縦位置・サイズ。position ごとに完結した1つの塊として選ぶ
          // （left-[50%]/inset-0 のような別グループのクラスを同時に混ぜると
          // twMerge が競合を検出できず、CSS 生成順に結果が左右されるため）。
          position === "fullscreen"
            ? // 全画面: inset-0 で画面いっぱいに広げる。角丸・影なし
              //（全画面では影は不可視で、角丸は端が切れて見えるだけ）。
              // 内側にヘッダー/フッターを固定するレイアウトが典型なので、
              // ルートは overflow-hidden にして子側でスクロールさせる
              // （ルートも auto にするとスクロールコンテナが二重になる）。
              [
                "inset-0 w-full h-full max-w-none overflow-hidden rounded-none",
                // centerFrom の中央表示も center と同じ連続曲率の角（角丸 0 の全画面では効かない）
                centeredFrom && "ksk-squircle",
                // centerFrom（#713）: 境界以上で中央のモーダルへ
                centeredFrom && fullscreenCenterFromClasses[centeredFrom],
                centeredFrom && fullscreenCenterFromSizeClasses[centeredFrom][size],
                centeredFrom && fullscreenCenterFromHeightClasses[centeredFrom][height],
              ]
            : [
                // 横位置: left-[50%] + translate-x-[-50%] のみ。
                // inset-x-* と組み合わせると left/right と transform が競合して
                // SP サイズで左に大きくズレるため使わない。
                // 幅は w-full + max-w-[calc(100%_-_3rem)] (左右 24px) + size ごとのキャップ
                // （既定 md = 480px）。
                "left-[50%] w-full max-w-[calc(100%_-_3rem)]",
                dialogSizeClasses[size],
                "translate-x-[-50%]",
                // 縦位置
                position === "top"
                  ? safeArea
                    ? "top-[max(var(--Safe-Area-Inset-Top,env(safe-area-inset-top,0px)),2rem)] max-h-[calc(100dvh_-_max(var(--Safe-Area-Inset-Top,env(safe-area-inset-top,0px)),2rem)_-_2rem)] overflow-y-auto"
                    : "top-8 max-h-[calc(100dvh_-_4rem)] overflow-y-auto"
                  : height === "fill"
                    ? "top-[50%] translate-y-[-50%] h-[calc(100dvh_-_4rem)]"
                    : "top-[50%] translate-y-[-50%]",
                "rounded-[var(--Radius-Modal)] ksk-squircle",
              ].join(" "),
          "bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)]",
          position !== "fullscreen" && "shadow-[var(--shadow-dialog)]",
          // 内側余白。fullscreen + safeArea では四辺すべてに safe-area 分を
          // 上乗せする（横向きの iPhone ではノッチが左右に来るため、上下だけ
          // では足りない）。ショートハンドの padding と方向指定の padding を
          // 同時に渡すと twMerge が別グループと見なして両方残し、勝敗が CSS
          // 生成順に左右されるため、必ず1つの完結したクラス集合を選ぶ。
          padding &&
            (position === "fullscreen" && safeArea
              ? "flex flex-col gap-4 pl-[max(1.5rem,env(safe-area-inset-left,0px))] pr-[max(1.5rem,env(safe-area-inset-right,0px))] pt-[calc(1.5rem_+_var(--Safe-Area-Inset-Top,env(safe-area-inset-top,0px)))] pb-[calc(1.5rem_+_env(safe-area-inset-bottom,0px))]"
              : "flex flex-col gap-4 p-6"),
          !padding &&
            position === "fullscreen" &&
            safeArea &&
            "pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)] pt-[var(--Safe-Area-Inset-Top,env(safe-area-inset-top,0px))] pb-[env(safe-area-inset-bottom,0px)]",
          // centerFrom（#713）: 中央表示では safe-area を足さない（center と同じ p-6 / 0）
          centeredFrom &&
            safeArea &&
            fullscreenCenterFromPaddingClasses[centeredFrom][padding ? "padded" : "bare"],
          // 入場/退場: 全画面は iOS の全画面モーダル慣習に合わせて下からの
          // スライド。zoom-95 だと全画面サーフェスが縮んで四辺からオーバーレイが
          // 覗くため使わない。
          position === "fullscreen"
            ? [
                "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom",
                centeredFrom && fullscreenCenterFromMotionClasses[centeredFrom],
              ]
            : "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          className
        )}
        aria-modal={isModal ? true : undefined}
        {...props}
        style={{ ...style, zIndex: resolvedContentZ }}
        aria-describedby={ariaDescribedBy}
        onOpenAutoFocus={handleOpenAutoFocus}
        onCloseAutoFocus={handleCloseAutoFocus}
        onEscapeKeyDown={handleEscapeKeyDown}
      >
        <ModalStackRegistrar onLevelChange={setStackLevel} modal={isModal} />
        <DescribedByLinker contentRef={contentRef} applyDescribedBy={applyDescribedBy} />
        {hasInternalDesc && (
          <DialogPrimitive.Description id={autoDescId} className="sr-only">
            {description}
          </DialogPrimitive.Description>
        )}
        {/*
          #341: 全画面 Dialog は「ページ」なので、配下の DialogTitle の既定を
          画面タイトル（H1）相当へ切り替える。それ以外は "dialog" を明示的に
          流し、全画面 Dialog の中に開いた中央ダイアログが文脈を引き継いで
          しまわないようにする。
        */}
        <TitleSurfaceScaleProvider scale={position === "fullscreen" ? "page" : "dialog"}>
          {/* #727: 配下の DetailSheetHeader が文字列の title を DialogTitle として描けるようにする */}
          <OverlayTitleSlotProvider slot="dialog">{children}</OverlayTitleSlotProvider>
        </TitleSurfaceScaleProvider>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

interface DialogHeaderProps extends React.ComponentProps<"div"> {
  /**
   * 見出しの形（issue #713）。
   * - "stack"（既定）: タイトルと説明を縦に積む（従来）
   * - "bar": 下線付きの帯。左にタイトル・説明（children）、右に `trailing`（閉じるボタン等）を横に並べる。
   *   全画面ダイアログ（`padding={false}`）の上端に置き、下の本文だけをスクロールさせる作業面向け。
   *   帯は縮まない（shrink-0）・左右 24px・上下 12px
   */
  variant?: "stack" | "bar"
  /**
   * `variant="bar"` の右端に置く要素（`<DialogClose asChild><Button size="icon-lg" aria-label="閉じる" …/></DialogClose>` 等）。
   * **bar では trailing か onClose のどちらかが必須**（全画面ダイアログで閉じる手段が見えなくなるため。
   * どちらも無いと開発ビルドで警告）。stack では無視する
   */
  trailing?: React.ReactNode
  /**
   * `variant="bar"` の右端に閉じるボタンを出す（issue #722）。押したときの処理（`onOpenChange(false)` 等）を渡す。
   * trailing の後ろに `Button variant="ghost" size="icon-lg"`（48px）+ 閉じるアイコン 20px を置く。
   * DialogClose + Button を自作しない。stack では無視する（stack の閉じる手段は DialogFooter 等）
   */
  onClose?: () => void
  /** 閉じるボタンの読み上げ名。既定は KskLabelsProvider の close（無ければ「閉じる」） */
  closeLabel?: string
}

function DialogHeader({
  className,
  variant = "stack",
  trailing,
  onClose,
  closeLabel,
  children,
  ...props
}: DialogHeaderProps) {
  const defaultLabels = useKskLabels()
  const missingTrailing = variant === "bar" && trailing == null && onClose == null
  React.useEffect(() => {
    if (!missingTrailing) return
    warnOnceInDev(
      "dialog-header-bar-trailing",
      'DialogHeader variant="bar" には onClose か trailing（閉じるボタン等）を渡してください。全画面ダイアログで閉じる手段が見えなくなります。'
    )
  }, [missingTrailing])
  if (variant === "bar") {
    return (
      <div
        data-slot="dialog-header"
        data-variant="bar"
        className={cn(
          "flex shrink-0 flex-row items-start justify-between gap-3 border-b border-[var(--Border-Low-Emphasis)] px-6 py-3",
          className
        )}
        {...props}
      >
        <div data-slot="dialog-header-text" className="flex min-w-0 flex-1 flex-col gap-1">
          {children}
        </div>
        {(trailing != null || onClose != null) && (
          <div data-slot="dialog-header-trailing" className="flex shrink-0 items-center gap-2">
            {trailing}
            {onClose != null && (
              <Button
                type="button"
                variant="ghost"
                size="icon-lg"
                data-slot="dialog-header-close"
                aria-label={closeLabel ?? defaultLabels.close}
                onClick={onClose}
              >
                <SemanticIcon name="close" size={20} />
              </Button>
            )}
          </div>
        )}
      </div>
    )
  }
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      {children}
    </div>
  )
}

function DialogFooter({
  className,
  orientation = "split",
  ...props
}: React.ComponentProps<"div"> & {
  /**
   * アクションボタンの並べ方。
   * - "split"（既定）: 均等幅で横並び（各ボタン flex-1）。2 ボタンを 50/50 で
   *   並べる iOS 風レイアウト。モバイルでも横並びのまま。
   * - "stacked": 旧挙動。モバイルは縦積み、sm 以上で右寄せ横並び（hug 幅）。
   *   3 つ以上のアクションや、右寄せにしたいフォーム系ダイアログで使う。
   */
  orientation?: "split" | "stacked"
}) {
  return (
    <div
      data-slot="dialog-footer"
      data-orientation={orientation}
      // pt-4: フッターを本文から離し、アクション領域として独立させる
      // （DialogContent の gap-4 と合わせて本文とボタンの間に十分な余白を作る）。
      className={cn(
        "pt-4",
        orientation === "stacked"
          ? "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
          : "flex flex-row gap-3 [&>*]:flex-1 [&>*]:basis-0",
        className
      )}
      {...props}
    />
  )
}

interface DialogTitleProps
  extends React.ComponentProps<typeof DialogPrimitive.Title> {
  /**
   * 見出しの役割（#341）。`contracts/composition.json` の `textHierarchy.tree`
   * と 1 対 1 で対応する:
   * - "page":    画面タイトル / H1 → `typo-heading-2xl`
   * - "section": セクション見出し / H2 → `typo-heading-xl`
   * - "card":    カード見出し / H3 → `typo-heading-md`
   *
   * 未指定時はサーフェスの文脈から決まる。`DialogContent position="fullscreen"`
   * の配下では "page" 相当（`typo-heading-2xl`）、それ以外の中央/上寄せ
   * ダイアログでは従来どおり `typo-heading-lg`。明示した level は常に文脈より
   * 優先される。
   */
  level?: TitleLevel
}

function DialogTitle({ className, level, ...props }: DialogTitleProps) {
  const typoClass = useTitleTypoClass(level)
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      data-level={level}
      className={cn(typoClass, "text-[var(--Text-High-Emphasis)]", className)}
      {...props}
    />
  )
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("typo-body-md text-[var(--Text-Medium-Emphasis)]", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
export type { DialogCenterFrom, DialogContentProps, DialogHeaderProps, DialogOverlayProps, DialogTitleProps, DialogSize }
