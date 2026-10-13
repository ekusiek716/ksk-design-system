import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
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
  | (PaginationLinkOwnProps & {
      as?: "a"
      /**
       * true のとき `<a>` を描画せず、子要素へ className・aria 属性を委譲する
       * （Radix Slot。Button の `asChild` と同じ方式）。next/link 等のルーターの
       * Link をそのまま子に渡すための口で、子は単一の要素にすること。
       * 子が要素でない（文字列だけ等）ときは asChild を無視して通常の `<a>` を描画し、
       * 開発時は console.warn で知らせる。
       * `disabled` のときは href を外せない代わりに aria-disabled / tabIndex=-1 /
       * pointer-events-none を付け、クリックも止める（子の onClick も呼ばない）。
       * 子が自前の tabIndex を持っていても disabled の -1 が優先される。
       * `as="button"` には無い。
       */
      asChild?: boolean
    } & React.ComponentProps<"a">)
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

const isDevBuild = () => {
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
  return Boolean(proc) && proc!.env?.NODE_ENV !== "production"
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

  const { href, tabIndex, asChild: asChildRequested = false, onClick, children, ...rest } = props as React.ComponentProps<"a"> & { asChild?: boolean }
  const childIsElement = React.isValidElement<{ tabIndex?: number }>(children)
  if (asChildRequested && !childIsElement && isDevBuild()) {
    console.warn("[PaginationLink] asChild には単一の React 要素を子に渡してください。asChild を無視して <a> を描画します。")
  }
  if (asChildRequested && childIsElement) {
    // href は子（ルーターの Link 等）自身が持つ。Slot 越しには外せないので、disabled は
    // aria-disabled + tabIndex=-1 + pointer-events-none + クリック抑止で表現する。
    const blockWhenDisabled = (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault()
      e.stopPropagation()
    }
    // Slot は子の props を優先するため、子が自前の tabIndex を持つと disabled の -1 が
    // 負ける。disabled のときだけ子へ直接 -1 を入れて優先させる。
    const slotChild = disabled ? React.cloneElement(children, { tabIndex: -1 }) : children
    return (
      <Slot
        tabIndex={disabled ? -1 : tabIndex}
        aria-current={isActive ? "page" : undefined}
        aria-disabled={disabled || undefined}
        data-slot="pagination-link"
        className={cn(linkClassName, disabled && "pointer-events-none opacity-50")}
        onClick={disabled ? undefined : onClick}
        onClickCapture={disabled ? blockWhenDisabled : undefined}
        {...rest}
      >
        {slotChild}
      </Slot>
    )
  }
  return (
    <a
      href={disabled ? undefined : href}
      tabIndex={disabled ? -1 : tabIndex}
      aria-current={isActive ? "page" : undefined}
      aria-disabled={disabled || undefined}
      data-slot="pagination-link"
      className={cn(linkClassName, disabled && "pointer-events-none opacity-50")}
      onClick={onClick}
      {...rest}
    >
      {children}
    </a>
  )
}

type PaginationPreviousProps = React.ComponentProps<typeof PaginationLink> & {
  /** aria-label とボタンテキスト。i18n 対応: 英語では "Previous" を渡す。@default "前へ" */
  label?: string
}

const PREV_ICON = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
)
const NEXT_ICON = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
)

/**
 * 前へ / 次への中身を組み立てる。`asChild` のときは子（ルーターの Link 等）の
 * children をラベルとして使い、アイコンと一緒に子の中へ入れ直す
 * （Slot は単一の子を要求するため、アイコン + ラベルを兄弟で渡せない）。
 */
function renderStepContent(
  props: { asChild?: boolean; children?: React.ReactNode },
  label: string,
  position: "start" | "end"
): React.ReactNode {
  const icon = position === "start" ? PREV_ICON : NEXT_ICON
  const labelEl = (text: React.ReactNode) => <span>{text}</span>
  if (props.asChild && React.isValidElement<{ children?: React.ReactNode }>(props.children)) {
    const child = props.children
    const text = child.props.children ?? label
    return React.cloneElement(
      child,
      undefined,
      position === "start" ? <>{icon}{labelEl(text)}</> : <>{labelEl(text)}{icon}</>
    )
  }
  return position === "start" ? <>{icon}{labelEl(label)}</> : <>{labelEl(label)}{icon}</>
}

/** asChild が指定され、かつ子が単一の要素のときだけ true（そうでなければ通常描画に戻す）。 */
function isSlottableChild(props: object, children: React.ReactNode): boolean {
  return Boolean((props as { asChild?: boolean }).asChild) && React.isValidElement(children)
}

function PaginationPrevious({ className, label = "前へ", ...props }: PaginationPreviousProps) {
  const { children, ...rest } = props as typeof props & { children?: React.ReactNode }
  const asChild = isSlottableChild(rest, children)
  return (
    <PaginationLink
      // asChild では子の文字が見えるラベルなので aria-label を付けない（見える文字と読み上げ名を一致させる, WCAG 2.5.3）
      aria-label={asChild ? undefined : label}
      size="default"
      className={cn("gap-1 pl-2.5", className)}
      {...(rest as PaginationLinkProps)}
      {...(asChild ? {} : { asChild: false })}
    >
      {renderStepContent({ asChild, children }, label, "start")}
    </PaginationLink>
  )
}

type PaginationNextProps = React.ComponentProps<typeof PaginationLink> & {
  /** aria-label とボタンテキスト。i18n 対応: 英語では "Next" を渡す。@default "次へ" */
  label?: string
}

function PaginationNext({ className, label = "次へ", ...props }: PaginationNextProps) {
  const { children, ...rest } = props as typeof props & { children?: React.ReactNode }
  const asChild = isSlottableChild(rest, children)
  return (
    <PaginationLink
      aria-label={asChild ? undefined : label}
      size="default"
      className={cn("gap-1 pr-2.5", className)}
      {...(rest as PaginationLinkProps)}
      {...(asChild ? {} : { asChild: false })}
    >
      {renderStepContent({ asChild, children }, label, "end")}
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
