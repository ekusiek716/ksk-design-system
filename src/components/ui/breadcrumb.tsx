import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

interface BreadcrumbProps extends React.ComponentProps<"nav"> {
  /**
   * nav 要素の aria-label。i18n 対応: 英語では "Breadcrumb" を渡す。
   * @default "パンくずリスト"
   */
  label?: string
}

function Breadcrumb({ label = "パンくずリスト", ...props }: BreadcrumbProps) {
  return <nav aria-label={label} data-slot="breadcrumb" {...props} />
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "flex flex-wrap items-center gap-1.5 break-words typo-body-sm text-[var(--Text-Medium-Emphasis)]",
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="breadcrumb-item" className={cn("inline-flex items-center gap-1.5", className)} {...props} />
}

type BreadcrumbLinkProps = React.ComponentProps<"a"> & {
  /**
   * true のとき `<a>` を描画せず、子要素へ className 等の属性を委譲する
   * （Radix Slot。Button の `asChild` と同じ方式）。next/link 等のルーターの
   * Link をそのまま子に渡すための口で、子は単一の要素にすること。
   * 既定 false（従来どおり `<a>` を描画）。
   */
  asChild?: boolean
}

function BreadcrumbLink({ asChild = false, className, ...props }: BreadcrumbLinkProps) {
  const Comp = asChild ? Slot : "a"
  return <Comp data-slot="breadcrumb-link" className={cn("hover:text-[var(--Text-High-Emphasis)] transition-colors", className)} {...props} />
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="breadcrumb-page" role="link" aria-disabled="true" aria-current="page" className={cn("text-[var(--Text-High-Emphasis)] typo-label-sm", className)} {...props} />
}

function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<"li">) {
  return (
    <li role="presentation" aria-hidden="true" data-slot="breadcrumb-separator" className={cn("[&>svg]:size-3.5", className)} {...props}>
      {children ?? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      )}
    </li>
  )
}

function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span role="presentation" aria-hidden="true" data-slot="breadcrumb-ellipsis" className={cn("flex size-9 items-center justify-center", className)} {...props}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="3" cy="8" r="1" fill="currentColor" /><circle cx="8" cy="8" r="1" fill="currentColor" /><circle cx="13" cy="8" r="1" fill="currentColor" /></svg>
      <span className="sr-only">その他</span>
    </span>
  )
}

export type { BreadcrumbLinkProps }
export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis }
