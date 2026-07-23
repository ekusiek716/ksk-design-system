import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionNavItem {
  /** activeKey と照合する安定キー。 */
  key: string
  /** リンクの可視ラベル。 */
  label: string
  /** ページ内アンカー。`#section-id` 形式を使う。 */
  href: string
}

interface SectionNavProps extends React.ComponentProps<"nav"> {
  items: SectionNavItem[]
  /** 現在表示中のセクション。IntersectionObserver 等は利用側で制御する。 */
  activeKey?: string
  /** vertical=目次、horizontal=横スクロールのアンダーバー。 */
  orientation?: "vertical" | "horizontal"
  /** アンカーの既定動作を維持したままクリックを通知する。 */
  onItemClick?: (
    key: string,
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => void
}

/**
 * 同一ページ内のセクションへ移動する本物のアンカーナビ。
 *
 * SubNav は button/tab によるビュー状態の切替、SectionNav は href を持つ
 * 現在地ナビであり相互に代用しない。sticky は内蔵しないため、必要なら nav の
 * className に `sticky top-*`、移動先に `scroll-mt-*` を指定する。
 */
function SectionNav({
  items,
  activeKey,
  orientation = "vertical",
  onItemClick,
  className,
  "aria-label": ariaLabel = "ページ内セクション",
  ...props
}: SectionNavProps) {
  const horizontal = orientation === "horizontal"

  return (
    <nav
      {...props}
      data-slot="section-nav"
      data-orientation={orientation}
      aria-label={ariaLabel}
      className={cn(
        "w-full",
        horizontal && "overflow-x-auto overscroll-x-contain scrollbar-hide",
        className,
      )}
    >
      <ul
        className={cn(
          horizontal
            ? "flex min-w-max items-stretch border-b border-[var(--Border-Low-Emphasis)]"
            : "flex flex-col gap-1 py-1",
        )}
      >
        {items.map((item) => {
          const active = item.key === activeKey

          return (
            <li key={item.key} className={cn(horizontal && "shrink-0")}>
              <a
                href={item.href}
                aria-current={active ? "location" : undefined}
                onClick={(event) => onItemClick?.(item.key, event)}
                className={cn(
                  "flex min-h-11 items-center transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
                  horizontal
                    ? "border-b-2 border-transparent px-4 py-3 typo-label-md whitespace-nowrap"
                    : "border-l-2 border-transparent px-3 py-2 typo-body-md",
                  active
                    ? horizontal
                      ? "border-[var(--Brand-Primary)] text-[var(--Text-High-Emphasis)]"
                      : "border-[var(--Brand-Primary)] bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)]"
                    : horizontal
                      ? "text-[var(--Text-Low-Emphasis)] hover:text-[var(--Text-High-Emphasis)]"
                      : "text-[var(--Text-Medium-Emphasis)] hover:bg-[var(--Surface-Secondary)] hover:text-[var(--Text-High-Emphasis)]",
                )}
              >
                {item.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export { SectionNav }
export type { SectionNavItem, SectionNavProps }
