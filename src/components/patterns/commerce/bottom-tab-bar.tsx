import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Types ───────────────────────────────────────────────────────────────────

interface BottomTabBarItem {
  label: string
  icon: React.ReactNode
  activeIcon?: React.ReactNode
  href?: string
  onClick?: () => void
  badgeCount?: number
  isActive?: boolean
}

interface BottomTabBarProps extends React.ComponentProps<"nav"> {
  items: BottomTabBarItem[]
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

function BottomTabBar({ className, items, variant = "default", pillPosition = "fixed", ...props }: BottomTabBarProps) {
  if (variant === "pill") {
    return <BottomTabBarPill className={className} items={items} pillPosition={pillPosition} {...props} />
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

function BottomTabBarPill({ className, items, pillPosition = "fixed", ...props }: Omit<BottomTabBarProps, "variant">) {
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
        "px-3 h-[58px] gap-0",
        className
      )}
      {...props}
    >
      {items.map((item) => <NavItem key={item.label} item={item} compact={true} />)}
    </nav>
  )
}

// ─── Shared NavItem ───────────────────────────────────────────────────────────

function NavItem({ item, compact }: { item: BottomTabBarItem; compact: boolean }) {
  const Tag = item.href ? "a" : "button"
  const tagProps = item.href
    ? { href: item.href }
    : { type: "button" as const, onClick: item.onClick }

  return (
    <Tag
      className={cn(
        "relative flex flex-col items-center justify-center gap-0.5 transition-opacity active:opacity-60",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--Focus-High-Emphasis)] rounded-full",
        compact ? "w-14 h-full" : "flex-1 pt-1 pb-1 min-w-0",
        item.isActive
          ? "text-[var(--Text-Accent-Primary)]"
          : "text-[var(--Text-High-Emphasis)] opacity-60"
      )}
      aria-current={item.isActive ? "page" : undefined}
      {...tagProps}
    >
      {/* アクティブ状態のピル背景 */}
      <span
        className={cn(
          "relative flex items-center justify-center rounded-full transition-colors",
          compact ? "w-12 h-8" : "h-7 w-14",
          item.isActive && (
            compact
              ? "bg-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_1px_4px_rgba(0,0,0,0.08)]"
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
      {/* ラベル（pill mode では非表示） */}
      {!compact && (
        <span className={cn("truncate max-w-full px-0.5 text-center", item.isActive ? "typo-label-xs" : "typo-body-xs")}>
          {item.label}
        </span>
      )}
    </Tag>
  )
}

export { BottomTabBar }
export type { BottomTabBarItem, BottomTabBarProps }
