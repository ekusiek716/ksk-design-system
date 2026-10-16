import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * ListItem の意味づけ。
 * - "default"     : 通常のリスト項目（既定）。
 * - "destructive" : 削除・ログアウトなど取り返しのつかない操作。
 *                   title を Caution 色にし、interactive=true の場合は
 *                   hover を薄い caution 背景に切り替える。
 *                   leftSlot のアイコンは呼び出し側で色付けする想定
 *                   （currentColor を継承させたい場合は className で調整）。
 */
type ListItemVariant = "default" | "destructive"

/**
 * 行の中での配置。
 * - "start"  : 既定。本文列が `flex-1` で伸び、左寄せ・上揃え。
 * - "center" : 本文列を伸ばさず、leftSlot / 本文 / rightSlot のかたまりを
 *              行の水平中央に寄せ、垂直方向も中央で揃える。テキストも中央寄せ。
 *              アイコン + ラベルだけの full-width な CTA 行に使う。
 */
type ListItemAlign = "start" | "center"

/**
 * 行の密度。
 * - "comfortable" : 既定。`px-4 py-3`、操作可能な行は最低 44px の高さを確保する。
 * - "compact"     : `px-3 py-1`。カード内に多数行を積む高密度リスト用。
 *                   **44px のタップ領域保証が外れる**ため、タップ可能な行に
 *                   使う場合は行そのものが十分なタップ領域を持つか確認すること
 *                   （静的な情報行での利用を推奨）。
 *
 * 区切り線は density の責務に含めない。線を消したい場合は
 * `className="border-b-0"` を渡す。
 */
type ListItemDensity = "comfortable" | "compact"

/**
 * rightSlot ラッパーの幅の上限（issue #668）。
 * - "auto"   : 既定。上限なし（従来どおり中身の幅）。
 * - "narrow" : 行幅の 1/3 まで。
 * - "wide"   : 行幅の 1/2 まで。
 * 上限を超える中身は折り返す（金額・件数のような長い値で title 列が 0 幅まで潰れるのを防ぐ）。
 */
type ListItemSlotWidth = "auto" | "narrow" | "wide"

const RIGHT_SLOT_WIDTH_CLASS: Record<ListItemSlotWidth, string | undefined> = {
  auto: undefined,
  narrow: "max-w-[33%] min-w-0",
  wide: "max-w-[50%] min-w-0",
}

interface ListItemCommonProps {
  leftSlot?: React.ReactNode
  rightSlot?: React.ReactNode
  /**
   * leftSlot を包むラッパー div の className（issue #668）。既定の `shrink-0` に追加される。
   * DS 内部の DOM 構造に依存する子孫セレクタ（`[&>div:first-child]` 等）の代わりに使う。
   */
  leftSlotClassName?: string
  /**
   * rightSlot を包むラッパー div の className（issue #668）。既定の `shrink-0` に追加される。
   * 幅の上限だけなら `rightSlotWidth` を使い、それ以外の調整（`max-w-[45%]` 等の任意値）に使う。
   * `[&>div:last-child]:max-w-*` のような子孫セレクタで DS 内部の DOM に依存しない。
   */
  rightSlotClassName?: string
  /**
   * rightSlot ラッパーの幅の上限（issue #668）。`"narrow"`（1/3）/ `"wide"`（1/2）を指定すると、
   * 長い値は上限内で折り返し、title 列の幅が残る。中身の文字列には `break-all` / `text-right`
   * 等を呼び出し側で付ける。
   * @default "auto"
   */
  rightSlotWidth?: ListItemSlotWidth
  /**
   * title / description と同じ列（leftSlot の右側）に置く下段スロット。
   * leftSlot がある場合はその幅ぶんインデントされる。
   * 行全幅で敷きたいもの（進捗バー等）は `footerSlot` を使う。
   */
  bottomSlot?: React.ReactNode
  /**
   * leftSlot / 本文 / rightSlot の行の**外側**・全幅に置く下段スロット。
   * leftSlot の幅にインデントされないため、進捗バーやメーターなど
   * 行いっぱいに敷きたい要素に使う。
   */
  footerSlot?: React.ReactNode
  /**
   * 行の右端に置く「行そのものとは別の操作」（削除ボタン・トグル・メニュー等）。
   *
   * 行を押せる状態（`href` / `onClick`）で行内にボタンを置くと button の入れ子で
   * 不正な HTML になるため、このスロットを使うと行の実装が
   * `<div>` + 行全体を覆う不可視の a/button（stretched link）+ 副アクションの
   * 兄弟配置に切り替わる。副アクションは行のクリック領域の**上**に載るので、
   * 押しても行の onClick は発火しない。
   *
   * ここに置くもの: それ自体が独立した操作である要素（IconButton / Switch / メニュー）。
   * 置かないもの: 単なる表示（バッジ・日時・シェブロン）は `rightSlot` を使う。
   *
   * a11y: overlay の accessible name は `aria-label` → `title` → `description`（文字列時）
   * の順で決まる。いずれも無い（children だけの）行では `aria-label` を必ず渡すこと。
   */
  secondaryAction?: React.ReactNode
  title?: string
  description?: string
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  /**
   * @deprecated `href` または `onClick` を ListItem 自体へ渡してください。
   * 外側の Link / button でラップする既存コードの視覚互換用に残しています。
   */
  interactive?: boolean
  variant?: ListItemVariant
  align?: ListItemAlign
  density?: ListItemDensity
}

type ListItemLinkProps = ListItemCommonProps &
  Omit<React.ComponentPropsWithoutRef<"a">, keyof ListItemCommonProps | "href" | "onClick"> & {
    href: string
    onClick?: React.MouseEventHandler<HTMLAnchorElement>
  }

type ListItemButtonProps = ListItemCommonProps &
  Omit<React.ComponentPropsWithoutRef<"button">, keyof ListItemCommonProps | "href" | "onClick" | "type"> & {
    href?: never
    onClick: React.MouseEventHandler<HTMLButtonElement>
  }

type ListItemStaticProps = ListItemCommonProps &
  Omit<React.ComponentPropsWithoutRef<"div">, keyof ListItemCommonProps | "href" | "onClick"> & {
    href?: never
    onClick?: never
  }

type ListItemProps = ListItemLinkProps | ListItemButtonProps | ListItemStaticProps

function ListItem({
  className,
  leftSlot,
  rightSlot,
  leftSlotClassName,
  rightSlotClassName,
  rightSlotWidth = "auto",
  bottomSlot,
  footerSlot,
  secondaryAction,
  title,
  description,
  interactive = false,
  disabled = false,
  variant = "default",
  align = "start",
  density = "comfortable",
  children,
  href,
  onClick,
  ...props
}: ListItemProps) {
  const isDestructive = variant === "destructive"
  const actionable = Boolean(href || onClick)
  const visuallyInteractive = actionable || interactive
  const isCentered = align === "center"
  const isCompact = density === "compact"
  const hasFooter = Boolean(footerSlot)
  // 既定値（align="start" / density="comfortable" / footerSlot なし）のときは
  // 従来と 1 クラスも変わらない文字列になるよう、断片の順序を保つこと。
  // 回帰テスト: __tests__/list-item-layout.test.tsx
  const rootClassName = cn(
    "flex w-full",
    hasFooter ? "flex-col" : isCentered ? "items-center" : "items-start",
    !hasFooter && "gap-3",
    "border-b border-[var(--Border-Low-Emphasis)]",
    isCompact ? "px-3 py-1" : "px-4 py-3",
    isCentered ? "justify-center text-center" : "text-left",
    visuallyInteractive && (
      isDestructive
        ? "cursor-pointer transition-colors hover:bg-[var(--Surface-Caution-Subtle)]"
        : "cursor-pointer transition-colors hover:bg-[var(--Surface-Secondary)]"
    ),
    actionable && (
      isCompact
        ? "focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50"
        : "min-h-11 focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50"
    ),
    disabled && "cursor-not-allowed opacity-50",
    className,
  )

  const row = (
    <>
      {leftSlot && <div className={cn("shrink-0", leftSlotClassName)}>{leftSlot}</div>}
      <div className={isCentered ? "min-w-0" : "flex-1 min-w-0"}>
        {title && (
          <p
            className={cn(
              "typo-label-md truncate",
              isDestructive
                ? "text-[var(--Caution-Base)]"
                : "text-[var(--Text-High-Emphasis)]"
            )}
          >
            {title}
          </p>
        )}
        {description && (
          <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)] mt-0.5">
            {description}
          </p>
        )}
        {children}
        {bottomSlot && <div className="mt-2">{bottomSlot}</div>}
      </div>
      {rightSlot && (
        <div className={cn("shrink-0", RIGHT_SLOT_WIDTH_CLASS[rightSlotWidth], rightSlotClassName)}>
          {rightSlot}
        </div>
      )}
      {secondaryAction && (
        // stretched link（行全体を覆う a/button）より前面に置き、
        // 副アクションのクリックが行の遷移・onClick に吸われないようにする。
        <div className="relative z-10 shrink-0">{secondaryAction}</div>
      )}
    </>
  )

  // footerSlot 未指定のときはラッパ要素を一切増やさない（既存 DOM 構造を維持）。
  const content = hasFooter ? (
    <>
      <div
        className={cn(
          "flex w-full",
          isCentered ? "items-center justify-center" : "items-start",
          "gap-3",
        )}
      >
        {row}
      </div>
      <div className="mt-2 w-full">{footerSlot}</div>
    </>
  ) : (
    row
  )

  // secondaryAction がある行を押せるようにすると、a/button の中に別の button を
  // 入れることになり不正な HTML になる。行を <div> にして、行全体を覆う不可視の
  // a/button（stretched link）を兄弟として置く構造に切り替える。
  if (secondaryAction && actionable) {
    // restProps（target / rel / onKeyDown / data-* 等）は外側の div ではなく、
    // 実際に操作可能な overlay の a/button に乗せる（secondaryAction 無しの分岐と同じ挙動）。
    const restProps = props as Record<string, unknown>
    const overlayLabel =
      (restProps["aria-label"] as string | undefined) ??
      title ??
      (typeof description === "string" ? description : undefined)
    const overlayClassName = cn(
      "absolute inset-0",
      "focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
      disabled && "cursor-not-allowed",
    )
    return (
      <div
        data-slot="list-item"
        data-variant={variant}
        className={cn(rootClassName, "relative")}
      >
        {content}
        {href ? (
          <a
            {...(restProps as Omit<React.ComponentPropsWithoutRef<"a">, "href" | "onClick">)}
            href={href}
            aria-label={overlayLabel}
            aria-disabled={disabled || undefined}
            className={overlayClassName}
            onClick={(event) => {
              if (disabled) {
                event.preventDefault()
                return
              }
              ;(onClick as React.MouseEventHandler<HTMLAnchorElement> | undefined)?.(event)
            }}
          />
        ) : (
          <button
            {...(restProps as Omit<React.ComponentPropsWithoutRef<"button">, "onClick">)}
            type="button"
            aria-label={overlayLabel}
            disabled={disabled}
            className={overlayClassName}
            onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
          />
        )}
      </div>
    )
  }

  if (href) {
    const anchorProps = props as Omit<React.ComponentPropsWithoutRef<"a">, "href" | "onClick">
    return (
      <a
        {...anchorProps}
        href={href}
        data-slot="list-item"
        data-variant={variant}
        aria-disabled={disabled || undefined}
        className={rootClassName}
        onClick={(event) => {
          if (disabled) {
            event.preventDefault()
            return
          }
          ;(onClick as React.MouseEventHandler<HTMLAnchorElement> | undefined)?.(event)
        }}
      >
        {content}
      </a>
    )
  }

  if (onClick) {
    const buttonProps = props as Omit<React.ComponentPropsWithoutRef<"button">, "onClick" | "type">
    return (
      <button
        {...buttonProps}
        type="button"
        data-slot="list-item"
        data-variant={variant}
        disabled={disabled}
        className={rootClassName}
        onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      >
        {content}
      </button>
    )
  }

  return (
    <div
      {...(props as React.ComponentPropsWithoutRef<"div">)}
      data-slot="list-item"
      data-variant={variant}
      className={rootClassName}
    >
      {content}
    </div>
  )
}

export { ListItem }
export type { ListItemProps, ListItemVariant, ListItemAlign, ListItemDensity, ListItemSlotWidth }
