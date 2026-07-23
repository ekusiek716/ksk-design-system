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

interface ListItemCommonProps {
  leftSlot?: React.ReactNode
  rightSlot?: React.ReactNode
  bottomSlot?: React.ReactNode
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
  bottomSlot,
  title,
  description,
  interactive = false,
  disabled = false,
  variant = "default",
  children,
  href,
  onClick,
  ...props
}: ListItemProps) {
  const isDestructive = variant === "destructive"
  const actionable = Boolean(href || onClick)
  const visuallyInteractive = actionable || interactive
  const rootClassName = cn(
    "flex w-full items-start gap-3 border-b border-[var(--Border-Low-Emphasis)] px-4 py-3 text-left",
    visuallyInteractive && (
      isDestructive
        ? "cursor-pointer transition-colors hover:bg-[var(--Surface-Caution-Subtle)]"
        : "cursor-pointer transition-colors hover:bg-[var(--Surface-Secondary)]"
    ),
    actionable && "min-h-11 focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
    disabled && "cursor-not-allowed opacity-50",
    className,
  )

  const content = (
    <>
      {leftSlot && <div className="shrink-0">{leftSlot}</div>}
      <div className="flex-1 min-w-0">
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
      {rightSlot && <div className="shrink-0">{rightSlot}</div>}
    </>
  )

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
export type { ListItemProps, ListItemVariant }
