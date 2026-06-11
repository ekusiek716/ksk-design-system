import * as React from "react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "./button"
import type { VariantProps } from "class-variance-authority"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return <nav role="navigation" aria-label="ページネーション" data-slot="pagination" className={cn("mx-auto flex w-full justify-center", className)} {...props} />
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="pagination-content" className={cn("flex flex-row items-center gap-1", className)} {...props} />
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<VariantProps<typeof buttonVariants>, "size"> &
  React.ComponentProps<"a">

function PaginationLink({ className, isActive, size = "icon", ...props }: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      className={cn(
        buttonVariants({
          variant: isActive ? "default" : "ghost",
          size,
        }),
        className
      )}
      {...props}
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
