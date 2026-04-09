import * as React from "react"
import { cn } from "@/lib/utils"

// ナビゲーションアイテムの定義
interface BottomNavItem {
  label: string
  icon: React.ReactNode
  activeIcon?: React.ReactNode
  href?: string
  onClick?: () => void
  badgeCount?: number
  isActive?: boolean
}

// ボトムナビゲーションのプロパティ定義
interface BottomNavProps extends React.ComponentProps<"nav"> {
  items: BottomNavItem[]
}

// 汎用モバイルボトムナビゲーションコンポーネント
function BottomNav({ className, items, ...props }: BottomNavProps) {
  return (
    <nav
      data-slot="bottom-nav"
      aria-label="メインナビゲーション"
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] pb-[env(safe-area-inset-bottom)] lg:hidden",
        className
      )}
      {...props}
    >
      <div className="flex h-14 items-center justify-around px-1">
        {items.map((item) => {
          // リンクまたはボタンとしてレンダリング
          const Tag = item.href ? "a" : "button"
          const tagProps = item.href
            ? { href: item.href }
            : { type: "button" as const, onClick: item.onClick }
          return (
            <Tag
              key={item.label}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-0.5 pt-1 pb-1 min-w-0",
                item.isActive
                  ? "text-[var(--Text-Accent-Primary)]"
                  : "text-[var(--Text-High-Emphasis)]"
              )}
              aria-current={item.isActive ? "page" : undefined}
              {...tagProps}
            >
              {/* アイコン表示エリア */}
              <span
                className={cn(
                  "relative flex h-7 w-14 items-center justify-center rounded-full transition-colors",
                  item.isActive &&
                    "bg-[var(--Surface-Accent-Primary-Light)]"
                )}
              >
                {item.isActive && item.activeIcon
                  ? item.activeIcon
                  : item.icon}
                {/* バッジカウント */}
                {item.badgeCount != null && item.badgeCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-[var(--Caution-Base)] typo-label-xs text-[var(--Text-on-Inverse)]">
                    {item.badgeCount > 99 ? "99+" : item.badgeCount}
                  </span>
                )}
              </span>
              {/* ラベル */}
              <span
                className={cn(
                  "truncate max-w-full px-0.5 text-center",
                  item.isActive ? "typo-label-xs" : "typo-body-xs"
                )}
              >
                {item.label}
              </span>
            </Tag>
          )
        })}
      </div>
    </nav>
  )
}

export { BottomNav }
