import * as React from "react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "./button"
import type { VariantProps } from "class-variance-authority"

type PaginationLinkOwnProps = {
  isActive?: boolean
  /**
   * 押せない状態（先頭ページで「前へ」等）。button 描画では素の disabled、
   * a 描画では href を外した上で tabIndex=-1 + pointer-events-none にする
   * （aria-disabled だけでは実際には押せてしまうため）。
   */
  disabled?: boolean
} & Pick<VariantProps<typeof buttonVariants>, "size">

/**
 * 描画する要素。既定は `a`（ページ遷移リンク）。
 * SPA でページ状態だけを切り替える用途（`href="#"` + preventDefault のごまかしが
 * 要らない）では `as="button"` を渡す（issue #357）。
 */
type PaginationLinkProps =
  | (PaginationLinkOwnProps & { as?: "a" } & React.ComponentProps<"a">)
  | (PaginationLinkOwnProps & { as: "button" } & React.ComponentProps<"button">)

type PaginationProps = React.ComponentProps<"nav"> & {
  /** nav 要素の aria-label。@default "ページネーション"（SimplePagination.navLabel と同名） */
  navLabel?: string
}

function Pagination({ className, navLabel = "ページネーション", ...props }: PaginationProps) {
  return <nav role="navigation" aria-label={navLabel} data-slot="pagination" className={cn("mx-auto flex w-full justify-center", className)} {...props} />
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="pagination-content" className={cn("flex flex-row flex-wrap items-center justify-center gap-1", className)} {...props} />
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

function PaginationLink({
  className,
  isActive,
  disabled,
  size = "icon",
  as = "a",
  ...props
}: PaginationLinkProps) {
  const linkClassName = cn(
    buttonVariants({
      variant: isActive ? "default" : "ghost",
      size,
    }),
    className
  )

  if (as === "button") {
    const { type = "button", ...rest } = props as React.ComponentProps<"button">
    return (
      <button
        type={type}
        disabled={disabled}
        aria-current={isActive ? "page" : undefined}
        data-slot="pagination-link"
        className={linkClassName}
        {...rest}
      />
    )
  }

  const { href, tabIndex, ...rest } = props as React.ComponentProps<"a">
  return (
    <a
      href={disabled ? undefined : href}
      tabIndex={disabled ? -1 : tabIndex}
      aria-current={isActive ? "page" : undefined}
      aria-disabled={disabled || undefined}
      data-slot="pagination-link"
      className={cn(linkClassName, disabled && "pointer-events-none opacity-50")}
      {...rest}
    />
  )
}

type PaginationPreviousProps = React.ComponentProps<typeof PaginationLink> & {
  /** aria-label とボタンテキスト。i18n 対応: 英語では "Previous" を渡す。@default "前へ" */
  label?: string
}

function PaginationPrevious({ className, label = "前へ", ...props }: PaginationPreviousProps) {
  return (
    <PaginationLink
      aria-label={label}
      size="default"
      className={cn("gap-1 pl-2.5", className)}
      {...props}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <span>{label}</span>
    </PaginationLink>
  )
}

type PaginationNextProps = React.ComponentProps<typeof PaginationLink> & {
  /** aria-label とボタンテキスト。i18n 対応: 英語では "Next" を渡す。@default "次へ" */
  label?: string
}

function PaginationNext({ className, label = "次へ", ...props }: PaginationNextProps) {
  return (
    <PaginationLink
      aria-label={label}
      size="default"
      className={cn("gap-1 pr-2.5", className)}
      {...props}
    >
      <span>{label}</span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </PaginationLink>
  )
}

type PaginationEllipsisProps = React.ComponentProps<"span"> & {
  /** スクリーンリーダー向けラベル。@default "その他のページ" */
  label?: string
}

function PaginationEllipsis({ className, label = "その他のページ", ...props }: PaginationEllipsisProps) {
  return (
    <span aria-hidden data-slot="pagination-ellipsis" className={cn("flex size-10 items-center justify-center text-[var(--Text-Medium-Emphasis)]", className)} {...props}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="3" cy="8" r="1" fill="currentColor" /><circle cx="8" cy="8" r="1" fill="currentColor" /><circle cx="13" cy="8" r="1" fill="currentColor" /></svg>
      <span className="sr-only">{label}</span>
    </span>
  )
}

export { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis }
export type { PaginationLinkProps }
