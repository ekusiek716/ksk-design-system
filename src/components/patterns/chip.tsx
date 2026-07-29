import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const chipVariants = cva(
  // justify-center をベースに含める：tile サイズ等の固定幅で text が左寄せになる問題を防ぐ。
  // padding 付きサイズ (sm/md/lg) でも flex の justify-center は副作用なし。
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer touch-manipulation [-webkit-tap-highlight-color:transparent] [@media(hover:hover)]:transition-colors typo-label-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--Focus-High-Emphasis)]",
  {
    variants: {
      variant: {
        filled: "bg-[var(--Surface-Secondary)] text-[var(--Text-High-Emphasis)] hover:bg-[var(--Surface-Tertiary)] disabled:text-[var(--Text-Disable)] disabled:hover:bg-[var(--Surface-Secondary)]",
        accent: "bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)] hover:bg-[var(--Hover-Secondary-Button)] disabled:bg-[var(--Surface-Secondary)] disabled:text-[var(--Text-Disable)] disabled:hover:bg-[var(--Surface-Secondary)]",
        outline: "border border-[var(--Border-Medium-Emphasis)] text-[var(--Text-High-Emphasis)] hover:bg-[var(--Surface-Secondary)] disabled:text-[var(--Text-Disable)]",
      },
      // Chip は常にインタラクティブ（button / a）なので、44px のタッチターゲットを
      // 縦横とも満たす必要がある。縦横で手法を変えているのは意図的:
      //
      // - 縦: 透明な before 擬似要素で 44px に広げ、**同じ高さぶんの縦 margin で
      //   場所も予約する**（my-2/my-1.5/my-1 で margin box をちょうど 44px にする）。
      //   height(28/32/36px)は触らないので見た目のピルは変わらないが、
      //   flex-wrap で折り返したときに隣の行の当たり判定と重ならない。
      //   margin を付けずに擬似要素だけ広げると、`flex-wrap gap-2` の md チップは
      //   行間 40px に対し当たり判定 44px となり 4px 重なって誤タップになる。
      //   横 margin は付けない（付けるとチップ同士の見た目の間隔まで広がるため）。
      // - 横: 擬似要素ではなく本体に min-w-11 を効かせる。横は gap-2(8px) しか
      //   間隔が無く、擬似要素で広げると隣のチップの当たり判定と重なって
      //   誤タップになる（WCAG 2.5.8 のターゲット非重複にも反する）。
      //   本体を広げれば隣は押し出されるだけなので重ならない。
      //   ラベルが長いチップでは min-w は効かないので実質「1〜3 文字のチップだけ
      //   少し横に広がる」挙動になる。
      //
      // tile(48px) は縦横とも 44px を超えているので両方とも不要。
      //
      // ⚠️ 置き場所の制約: 擬似要素はチップの外側へはみ出すため、**親が 44px 以上の
      // 高さを持っていないとクリップされて当たり判定が元に戻る**。特に
      // `overflow-x-auto` の横スクロール行は要注意で、CSS 仕様上 overflow-y も
      // auto に落ちる（visible にできない）ため確実にクリップされる。
      // 横スクロール行に置くときは行側に `min-h-11 items-center` を付けること
      // （ChipFilterBar / TabsList はそうしている）。
      size: {
        // my-* は「44px - 本体の高さ」の半分。28+8*2 / 32+6*2 / 36+4*2 = いずれも 44px。
        // sm/md/lg に tile のような shrink-0 は不要。min-width は flex-shrink の
        // 下限として効くので、min-w-11 だけで 44px は割られない。tile が #280 で
        // shrink-0 を必要としたのは size-12 が width であって min-width ではないため。
        sm: "h-7 my-2 min-w-11 px-2.5 typo-label-xs before:absolute before:inset-x-0 before:top-1/2 before:-translate-y-1/2 before:min-h-11 before:content-['']",
        md: "h-8 my-1.5 min-w-11 px-3 typo-label-sm before:absolute before:inset-x-0 before:top-1/2 before:-translate-y-1/2 before:min-h-11 before:content-['']",
        lg: "h-9 my-1 min-w-11 px-4 typo-label-sm before:absolute before:inset-x-0 before:top-1/2 before:-translate-y-1/2 before:min-h-11 before:content-['']",
        // shrink-0: flex row 内で min-content 幅まで潰れて 48px タッチターゲットが崩れるのを防ぐ
        tile: "size-12 shrink-0 typo-body-md",
      },
      shape: {
        pill: "rounded-full",
        square: "rounded-sm",
      },
    },
    defaultVariants: {
      variant: "filled",
      size: "md",
      shape: "pill",
    },
  }
)

interface ChipProps
  extends Omit<React.ComponentProps<"button">, "children">,
    VariantProps<typeof chipVariants> {
  /** リンクとして使う場合の URL。指定時は `<a>` でレンダリング */
  href?: string
  /** 選択状態。true で Brand 色 + 白文字へ強調 */
  selected?: boolean
  /** 売り切れ状態（斜線オーバーレイ + disabled） */
  soldOut?: boolean
  /** 削除可能（× ボタン表示） */
  removable?: boolean
  /** 削除時のコールバック */
  onRemove?: () => void
  /** 件数バッジ（例: フィルタ件数） */
  count?: number
  children?: React.ReactNode
}

/**
 * Chip — クリック可能なキーワード・フィルタチップ。
 *
 * Tag（表示専用ラベル）との違い：
 * - Chip はインタラクティブ（クリック・選択・削除可）
 * - Chip は pill（rounded-full）/ square / tile を持つ
 * - Chip は count バッジ・売り切れ状態・removable を持てる
 *
 * ### AI 向け使用ルール
 * - キーワード: `<Chip>キーワード</Chip>`
 * - フィルタ選択: `<Chip selected>選択済み</Chip>`
 * - 削除可能タグ: `<Chip removable onRemove={fn}>タグ</Chip>`
 * - サイズタイル: `<Chip shape="square" size="tile" selected={isSelected}>M</Chip>`
 * - 売り切れタイル: `<Chip shape="square" size="tile" soldOut>L</Chip>`
 * - カウント付き: `<Chip selected count={156}>すべて</Chip>`
 * - リンク化: `<Chip href="/search?q=foo">foo</Chip>`
 */
function Chip({
  className,
  id,
  style,
  title,
  variant = "filled",
  size,
  shape,
  href,
  selected,
  soldOut = false,
  removable,
  onRemove,
  count,
  children,
  disabled: disabledProp,
  ...props
}: ChipProps) {
  const isSoldOut = soldOut && !selected
  const disabled = isSoldOut || disabledProp
  const actualSize = size ?? "md"
  const actualShape = shape ?? "pill"
  const removeLabel =
    typeof children === "string" || typeof children === "number"
      ? `削除: ${children}`
      : "削除"

  const countBadge = count !== undefined && (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-1.5 min-w-[1.25rem] typo-label-xs [@media(hover:hover)]:transition-colors",
        selected
          ? "bg-[var(--Surface-Primary)] text-[var(--Text-Accent-Primary)]"
          : "bg-[var(--Surface-Tertiary)] text-[var(--Text-Medium-Emphasis)]"
      )}
    >
      {count}
    </span>
  )

  const removeIcon = (
    <span
      aria-hidden="true"
      className="inline-flex size-5 items-center justify-center rounded-full"
    >
      <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M4 4L10 10M10 4L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </span>
  )

  const soldOutOverlay = isSoldOut && (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <span className="block h-[140%] w-px origin-center rotate-45 bg-[var(--Text-Disable)]" />
    </span>
  )

  const content = (
    <>
      {children}
      {countBadge}
      {soldOutOverlay}
    </>
  )

  // 選択時は Brand-Primary を強調表示 (CTA / PillRow と一貫)
  const selectedStyles = selected &&
    "bg-[var(--Brand-Primary)]! text-[var(--Text-on-Inverse)]! hover:bg-[var(--Active-Primary-Button)]! active:bg-[var(--Active-Primary-Button)]! border-[var(--Brand-Primary)]! shadow-sm hover:shadow"

  const soldOutStyles = isSoldOut &&
    "border border-[var(--Text-Disable)] bg-[var(--Surface-Secondary)]! text-[var(--Text-Disable)]! cursor-not-allowed"

  // × は本体ラベルに寄せる（独立した w-8 の正方形セルにしない）。tile のみ従来の固定幅。
  // × も独立したタップ対象なので、縦は本体と同じく透明 before 擬似要素で 44px に拡張する。
  // 横は本体のように min-w-11 を効かせない: × は本体ラベルに寄せた副次アクションで、
  // 44px 幅にするとチップの大半が × になり主アクション（チップ本体）が押しにくくなる。
  // 現状 32px 幅 × 44px の当たり判定で、WCAG 2.5.8 (AA) の 24px 最小サイズは満たす。
  const removeTouchTarget =
    "before:absolute before:inset-x-0 before:top-1/2 before:-translate-y-1/2 before:min-h-11 before:content-['']"
  const removeButtonSize = {
    sm: `h-7 pl-0.5 pr-2 ${removeTouchTarget}`,
    md: `h-8 pl-0.5 pr-2.5 ${removeTouchTarget}`,
    lg: `h-9 pl-1 pr-3 ${removeTouchTarget}`,
    tile: "h-12 w-8",
  }[actualSize]

  const removeButtonShape =
    actualShape === "square" || actualSize === "tile" ? "rounded-r-sm" : "rounded-r-full"

  if (removable) {
    const actionClassName = cn(
      "relative",
      chipVariants({ variant, size, shape }),
      "rounded-r-none",
      // × を本体ラベル直後に寄せるため右パディングを詰める
      actualSize !== "tile" && "pr-1.5",
      variant === "outline" && "border-r-0",
      selectedStyles,
      soldOutStyles,
    )

    return (
      <span
        id={id}
        style={style}
        title={title}
        data-slot="chip"
        data-variant={variant}
        data-selected={selected || undefined}
        data-sold-out={isSoldOut || undefined}
        className={cn("inline-flex items-center [-webkit-tap-highlight-color:transparent]", className)}
      >
        {href && !isSoldOut ? (
          <a href={href} className={actionClassName}>
            {content}
          </a>
        ) : (
          <button
            type="button"
            disabled={disabled}
            className={actionClassName}
            {...props}
          >
            {content}
          </button>
        )}
        <button
          type="button"
          data-slot="chip-remove"
          aria-label={removeLabel}
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.()
          }}
          className={cn(
            "relative inline-flex shrink-0 items-center justify-center touch-manipulation [-webkit-tap-highlight-color:transparent] [@media(hover:hover)]:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--Focus-High-Emphasis)] disabled:pointer-events-none disabled:opacity-50",
            // 仕切り線なし・本体と同じ面色を継ぎ目なく延長。ホバー時のみ × 側を強調。
            !selected && variant === "filled" && "bg-[var(--Surface-Secondary)] text-[var(--Text-Medium-Emphasis)] hover:bg-[var(--Surface-Tertiary)] hover:text-[var(--Text-High-Emphasis)]",
            !selected && variant === "accent" && "bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)] hover:bg-[var(--Hover-Secondary-Button)]",
            !selected && variant === "outline" && "border border-l-0 border-[var(--Border-Medium-Emphasis)] bg-transparent text-[var(--Text-Medium-Emphasis)] hover:bg-[var(--Surface-Secondary)] hover:text-[var(--Text-High-Emphasis)]",
            selected && "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)] hover:bg-[var(--Active-Primary-Button)] hover:text-[var(--Text-on-Inverse)]",
            removeButtonSize,
            removeButtonShape,
          )}
        >
          {removeIcon}
        </button>
      </span>
    )
  }

  if (href && !isSoldOut) {
    return (
      <a
        href={href}
        id={id}
        style={style}
        title={title}
        data-slot="chip"
        data-variant={variant}
        data-selected={selected || undefined}
        className={cn(
          "relative",
          chipVariants({ variant, size, shape }),
          selectedStyles,
          className,
        )}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type="button"
      id={id}
      style={style}
      title={title}
      data-slot="chip"
      data-variant={variant}
      data-selected={selected || undefined}
      data-sold-out={isSoldOut || undefined}
      // selected が制御されている場合はトグル状態を SR に通知
      aria-pressed={selected !== undefined ? selected : undefined}
      disabled={disabled}
      className={cn(
        "relative",
        chipVariants({ variant, size, shape }),
        selectedStyles,
        soldOutStyles,
        className,
      )}
      {...props}
    >
      {content}
    </button>
  )
}

export { Chip, chipVariants }
export type { ChipProps }
