import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { useKskLabels } from "./ksk-labels"

interface BreadcrumbProps extends React.ComponentProps<"nav"> {
  /**
   * nav 要素の aria-label。省略時は KskLabelsProvider の `breadcrumbNav`
   * （Provider 無しは "パンくずリスト"。locale="en" で "Breadcrumb"）。
   */
  label?: string
}

function Breadcrumb({ label, ...props }: BreadcrumbProps) {
  const defaultLabels = useKskLabels()
  return <nav aria-label={label ?? defaultLabels.breadcrumbNav} data-slot="breadcrumb" {...props} />
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

/**
 * 注意: 親の span が `aria-hidden="true"`（従来どおり）なので、中の sr-only のテキストは実際には
 * 読み上げられない。文言は将来 aria-hidden を外したときのためのもので、今の挙動は変えていない。
 *
 * @param label 読み上げ名（sr-only）。省略時は KskLabelsProvider の `breadcrumbEllipsis`（Provider 無しは "その他"。locale="en" で "More"）
 */
function BreadcrumbEllipsis({ className, label, ...props }: React.ComponentProps<"span"> & { label?: string }) {
  const defaultLabels = useKskLabels()
  return (
    <span role="presentation" aria-hidden="true" data-slot="breadcrumb-ellipsis" className={cn("flex size-9 items-center justify-center", className)} {...props}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="3" cy="8" r="1" fill="currentColor" /><circle cx="8" cy="8" r="1" fill="currentColor" /><circle cx="13" cy="8" r="1" fill="currentColor" /></svg>
      <span className="sr-only">{label ?? defaultLabels.breadcrumbEllipsis}</span>
    </span>
  )
}

export type { BreadcrumbLinkProps }
export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis }
