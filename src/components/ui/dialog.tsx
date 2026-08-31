import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"
import { usePortalContainer } from "./portal-container"
import { DescribedByLinker, useDescribedByLink } from "@/lib/described-by"
import {
  ModalStackRegistrar,
  modalContentZ,
  modalOverlayZ,
} from "@/lib/modal-stack"
import {
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
  ref.current = document.activeElement as HTMLElement | null
}

function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
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
  autoFocus,
  restoreFocusOnClose = true,
  closeOnEsc = true,
  bodyScrollLock: _bodyScrollLock = true,
  zIndex,
  style,
  ...props
}: DialogContentProps) {
  const autoDescId = React.useId()
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
        ref={setContentNode}
        data-slot="dialog-content"
        data-position={position}
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
              "inset-0 w-full h-full max-w-none overflow-hidden rounded-none"
            : [
                // 横位置: left-[50%] + translate-x-[-50%] のみ。
                // inset-x-* と組み合わせると left/right と transform が競合して
                // SP サイズで左に大きくズレるため使わない。
                // 幅は w-full + max-w-[calc(100%_-_3rem)] (左右 24px) + 480px キャップ。
                "left-[50%] w-full max-w-[calc(100%_-_3rem)] sm:max-w-[480px] translate-x-[-50%]",
                // 縦位置
                position === "top"
                  ? safeArea
                    ? "top-[max(env(safe-area-inset-top),2rem)] max-h-[calc(100dvh_-_max(env(safe-area-inset-top),2rem)_-_2rem)] overflow-y-auto"
                    : "top-8 max-h-[calc(100dvh_-_4rem)] overflow-y-auto"
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
              ? "flex flex-col gap-4 pl-[max(1.5rem,env(safe-area-inset-left,0px))] pr-[max(1.5rem,env(safe-area-inset-right,0px))] pt-[calc(1.5rem_+_env(safe-area-inset-top,0px))] pb-[calc(1.5rem_+_env(safe-area-inset-bottom,0px))]"
              : "flex flex-col gap-4 p-6"),
          !padding &&
            position === "fullscreen" &&
            safeArea &&
            "pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)] pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]",
          // 入場/退場: 全画面は iOS の全画面モーダル慣習に合わせて下からの
          // スライド。zoom-95 だと全画面サーフェスが縮んで四辺からオーバーレイが
          // 覗くため使わない。
          position === "fullscreen"
            ? "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom"
            : "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          className
        )}
        {...props}
        style={{ ...style, zIndex: resolvedContentZ }}
        aria-describedby={ariaDescribedBy}
        onOpenAutoFocus={handleOpenAutoFocus}
        onCloseAutoFocus={handleCloseAutoFocus}
        onEscapeKeyDown={handleEscapeKeyDown}
      >
        <ModalStackRegistrar onLevelChange={setStackLevel} />
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
          {children}
        </TitleSurfaceScaleProvider>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
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
export type { DialogContentProps, DialogOverlayProps, DialogTitleProps }
