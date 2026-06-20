import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Types ───────────────────────────────────────────────────────────────────

interface BottomTabBarItem {
  label: string
  ariaLabel?: string
  icon: React.ReactNode
  activeIcon?: React.ReactNode
  href?: string
  onClick?: () => void
  badgeCount?: number
  isActive?: boolean
}

type BottomTabBarTone = "default" | "inverse"

interface BottomTabBarAction extends BottomTabBarItem {
  badgeCount?: never
  isActive?: never
}

interface BottomTabBarProps extends React.ComponentProps<"nav"> {
  items: BottomTabBarItem[]
  /**
   * Liquid Glass の中央に置く主要アクション。
   * 例: 「＋ 作成」「投稿」「カートへ」など、実アプリのグロナビ CTA 用。
   */
  centerAction?: BottomTabBarAction
  /**
   * pill variant でアイコン下のラベルを表示する。
   * centerAction 指定時は未指定でも true として扱う。
   */
  showLabels?: boolean
  /**
   * dark/photo/gradient 背景上では "inverse" を指定して白文字にする。
   */
  tone?: BottomTabBarTone
  /**
   * pill variant の最大幅。mobile web shell に合わせる時に指定する。
   */
  maxWidth?: React.CSSProperties["maxWidth"]
  /**
   * "default" : 従来の全幅バー（ボーダー付き）
   * "pill"    : iOS 26 スタイル — Liquid Glass フローティングピル
   */
  variant?: "default" | "pill"
  /**
   * pill variant の配置モード（デフォルト "fixed"）
   * - "fixed"    : ビューポートに固定（実アプリ用）
   * - "absolute" : 親要素内に配置（Storybook 等のデモ用）
   */
  pillPosition?: "fixed" | "absolute"
}

// ─── BottomNav ────────────────────────────────────────────────────────────────

function BottomTabBar({
  className,
  items,
  centerAction,
  showLabels,
  tone = "default",
  maxWidth,
  variant = "default",
  pillPosition = "fixed",
  ...props
}: BottomTabBarProps) {
  if (variant === "pill") {
    return (
      <BottomTabBarPill
        className={className}
        items={items}
        centerAction={centerAction}
        showLabels={showLabels}
        tone={tone}
        maxWidth={maxWidth}
        pillPosition={pillPosition}
        {...props}
      />
    )
  }
  return <BottomTabBarDefault className={className} items={items} {...props} />
}

// ─── Default variant (従来型) ─────────────────────────────────────────────────

function BottomTabBarDefault({ className, items, ...props }: Omit<BottomTabBarProps, "variant">) {
  return (
    <nav
      data-slot="bottom-tab-bar"
      aria-label="メインナビゲーション"
      className={cn(
        "fixed inset-x-0 bottom-0 z-50",
        "border-t border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]",
        "pb-[env(safe-area-inset-bottom)] lg:hidden",
        className
      )}
      {...props}
    >
      <div className="flex h-14 items-center justify-around px-1">
        {items.map((item) => <NavItem key={item.label} item={item} compact={false} />)}
      </div>
    </nav>
  )
}

// ─── Pill variant (iOS 26 Liquid Glass) ──────────────────────────────────────

function BottomTabBarPill({
  className,
  items,
  centerAction,
  showLabels,
  tone = "default",
  maxWidth = 430,
  pillPosition = "fixed",
  style,
  ...props
}: Omit<BottomTabBarProps, "variant">) {
  const hasProminentLayout = Boolean(centerAction) || showLabels === true
  const shouldShowLabels = showLabels ?? Boolean(centerAction)
  const splitIndex = centerAction ? Math.ceil(items.length / 2) : items.length
  const leadingItems = items.slice(0, splitIndex)
  const trailingItems = items.slice(splitIndex)
  const pillStyle: React.CSSProperties = {
    ...(hasProminentLayout ? { width: "calc(100vw - 24px)", maxWidth } : {}),
    ...style,
  }

  return (
    <nav
      data-slot="bottom-nav-pill"
      aria-label="メインナビゲーション"
      className={cn(
        "z-50 lg:hidden",
        pillPosition === "fixed" ? "fixed" : "absolute",
        // 位置: 画面下部に余白を持ってフロート
        "bottom-[calc(env(safe-area-inset-bottom)+12px)] left-1/2 -translate-x-1/2",
        // ピル形状 + Liquid Glass
        "flex items-center rounded-full glass glass-specular",
        hasProminentLayout ? "min-h-[66px] gap-1 px-2 py-2" : "h-[58px] gap-0 px-3",
        className
      )}
      style={pillStyle}
      {...props}
    >
      {leadingItems.map((item, index) => (
        <NavItem key={`${item.href ?? item.label}-${index}`} item={item} compact showLabel={shouldShowLabels} tone={tone} />
      ))}
      {centerAction ? <CenterActionItem item={centerAction} /> : null}
      {trailingItems.map((item, index) => (
        <NavItem
          key={`${item.href ?? item.label}-${index + splitIndex}`}
          item={item}
          compact
          showLabel={shouldShowLabels}
          tone={tone}
        />
      ))}
    </nav>
  )
}

// ─── Shared NavItem ───────────────────────────────────────────────────────────

function NavItem({
  item,
  compact,
  showLabel,
  tone = "default",
}: {
  item: BottomTabBarItem
  compact: boolean
  showLabel?: boolean
  tone?: BottomTabBarTone
}) {
  const Tag = item.href ? "a" : "button"
  const tagProps = item.href
    ? { href: item.href }
    : { type: "button" as const, onClick: item.onClick }
  const isLabelVisible = showLabel ?? !compact

  return (
    <Tag
      className={cn(
        "relative flex min-h-11 flex-col items-center justify-center gap-0.5 transition-opacity active:opacity-60",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--Focus-High-Emphasis)] rounded-full",
        compact ? (isLabelVisible ? "h-full min-w-0 flex-1 px-1" : "h-full w-14") : "min-w-0 flex-1 pb-1 pt-1",
        item.isActive
          ? tone === "inverse"
            ? "text-[var(--Text-on-Inverse)]"
            : "text-[var(--Text-Accent-Primary)]"
          : tone === "inverse"
            ? "text-[var(--Text-on-Inverse)] opacity-75"
            : "text-[var(--Text-High-Emphasis)] opacity-60"
      )}
      aria-label={isLabelVisible ? item.ariaLabel : item.ariaLabel ?? item.label}
      aria-current={item.isActive ? "page" : undefined}
      {...tagProps}
    >
      {/* アクティブ状態のピル背景 */}
      <span
        className={cn(
          "relative flex items-center justify-center rounded-full transition-colors",
          compact ? (isLabelVisible ? "h-8 w-11" : "h-8 w-12") : "h-7 w-14",
          item.isActive && (
            compact
              ? "[background:color-mix(in_srgb,var(--Surface-Primary)_42%,transparent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_1px_4px_rgba(0,0,0,0.08)]"
              : "bg-[var(--Surface-Accent-Primary-Light)]"
          )
        )}
      >
        {item.isActive && item.activeIcon ? item.activeIcon : item.icon}
        {/* バッジカウント */}
        {item.badgeCount != null && item.badgeCount > 0 && (
          <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-[var(--Caution-Base)] typo-label-xs text-[var(--Text-on-Inverse)]">
            {item.badgeCount > 99 ? "99+" : item.badgeCount}
          </span>
        )}
      </span>
      {isLabelVisible && (
        <span className={cn("max-w-full truncate px-0.5 text-center", item.isActive ? "typo-label-xs" : "typo-body-xs")}>
          {item.label}
        </span>
      )}
    </Tag>
  )
}

function CenterActionItem({ item }: { item: BottomTabBarAction }) {
  const Tag = item.href ? "a" : "button"
  const tagProps = item.href
    ? { href: item.href }
    : { type: "button" as const, onClick: item.onClick }

  return (
    <Tag
      className={cn(
        "relative flex h-12 min-w-[78px] shrink-0 items-center justify-center gap-1.5 rounded-full px-3",
        "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)] shadow-[0_8px_24px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.28)]",
        "typo-label-sm transition-transform active:scale-[0.96]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--Focus-High-Emphasis)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      )}
      aria-label={item.ariaLabel ?? item.label}
      {...tagProps}
    >
      <span className="flex size-5 items-center justify-center" aria-hidden="true">
        {item.icon}
      </span>
      <span className="max-w-[5rem] truncate">{item.label}</span>
    </Tag>
  )
}

export { BottomTabBar }
export type { BottomTabBarAction, BottomTabBarItem, BottomTabBarProps }
