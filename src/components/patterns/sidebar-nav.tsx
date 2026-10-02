import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Types ───────────────────────────────────────────────────────────────────

/**
 * SidebarNav の 1 項目。
 *
 * フィールドは `BottomTabBarItem` と同じ名前にしてあり、モバイルの BottomTabBar に
 * 渡している `items` 配列をそのまま渡せる（issue #611）。互換は BottomTabBar →
 * SidebarNav の向き（`icon` はこちらでは省略可）。
 *
 * `href` と `onClick` を両方持つ項目では、SidebarNav はリンク遷移に加えて
 * `onClick` も呼ぶ（計測・ドロワーを閉じる等のため）。SPA ルーターで遷移を
 * 自前で行う場合は `onClick` 側で `preventDefault` するか `href` を渡さない。
 */
interface SidebarNavItem {
  /** 行の可視ラベル。`collapsed` 時はアクセシブルネームと tooltip（title）になる。 */
  label: string
  /** 可視ラベルと別の読み上げ名が要るときだけ指定する。 */
  ariaLabel?: string
  /** 行頭アイコン（iconsax 推奨。20px に揃える）。 */
  icon?: React.ReactNode
  /** 選択中だけ差し替えるアイコン（Bold 版など）。 */
  activeIcon?: React.ReactNode
  /** 指定時は `<a href>` として描画する。省略時は `<button>`。 */
  href?: string
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  /** 1 以上で件数バッジを出す。100 以上は「99+」。 */
  badgeCount?: number
  /** 現在地。`aria-current="page"` と選択中の面・文字色を DS が付ける。 */
  isActive?: boolean
  /** 安定 DOM アンカー。指定時は `data-tab-key` として出力する（E2E・計測用）。 */
  tabKey?: string
}

interface SidebarNavProps extends React.ComponentProps<"nav"> {
  items: SidebarNavItem[]
  /**
   * アイコンだけのレール表示（44×44 の正方形行）。ラベルは aria-label と
   * title に移る。サイドバー幅の切り替えは呼び出し側（AdminShell の
   * `sidebarWidth` 等）で行う。
   * @default false
   */
  collapsed?: boolean
  /** nav 要素の aria-label。@default "サイドナビゲーション" */
  navLabel?: string
}

// ─── Item ────────────────────────────────────────────────────────────────────

function SidebarNavRow({ item, collapsed }: { item: SidebarNavItem; collapsed: boolean }) {
  const Tag = item.href ? "a" : "button"
  const tagProps = item.href
    ? { href: item.href, onClick: item.onClick }
    : { type: "button" as const, onClick: item.onClick }
  const badgeCount = item.badgeCount ?? 0
  const hasBadge = badgeCount > 0
  const badgeText = badgeCount > 99 ? "99+" : String(badgeCount)
  const icon = item.isActive && item.activeIcon ? item.activeIcon : item.icon

  return (
    <Tag
      data-slot="sidebar-nav-item"
      data-active={item.isActive || undefined}
      data-tab-key={item.tabKey}
      aria-current={item.isActive ? "page" : undefined}
      // collapsed ではバッジがドットだけになるため、件数をアクセシブルネームへ含める
      aria-label={
        collapsed
          ? `${item.ariaLabel ?? item.label}${hasBadge ? `（${badgeText}）` : ""}`
          : item.ariaLabel
      }
      title={collapsed ? item.label : undefined}
      className={cn(
        // 行高 44px は DS のタッチターゲット方針（AdminShell の合成規範 #7 と同じ）
        "relative flex min-h-11 items-center rounded-lg typo-label-md",
        "transition-colors duration-[var(--Motion-Duration-Fast)] ease-[var(--Motion-Easing-Standard)]",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
        collapsed ? "size-11 justify-center" : "w-full gap-3 px-3 text-left",
        item.isActive
          ? "bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)]"
          : "bg-[var(--Surface-Primary)] text-[var(--Text-Medium-Emphasis)] hover:bg-[var(--Surface-Secondary)] hover:text-[var(--Text-High-Emphasis)]"
      )}
      {...tagProps}
    >
      {icon != null && (
        <span
          data-slot="sidebar-nav-item-icon"
          aria-hidden="true"
          className="relative flex size-5 shrink-0 items-center justify-center [&_svg]:size-5"
        >
          {icon}
          {collapsed && hasBadge && (
            <span className="absolute -top-1 -right-1 size-2 rounded-full bg-[var(--Caution-Base)]" />
          )}
        </span>
      )}
      {!collapsed && (
        <span data-slot="sidebar-nav-item-label" className="min-w-0 flex-1 truncate">
          {item.label}
        </span>
      )}
      {!collapsed && hasBadge && (
        <span
          data-slot="sidebar-nav-item-badge"
          className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[var(--Caution-Base)] px-1.5 typo-label-xs text-[var(--Text-on-Inverse)]"
        >
          {badgeText}
        </span>
      )}
    </Tag>
  )
}

// ─── SidebarNav ──────────────────────────────────────────────────────────────

/**
 * SidebarNav — PC 表示の左サイドバーに縦に並べるナビ項目（issue #611）
 *
 * `MobileAppShell` の `desktopSidebar` / `AdminShell` の `sidebar` slot に置く。
 * 行の高さ（44px）・角丸・選択中の面と文字色・アイコン位置・`aria-current="page"`
 * は部品が持つので、呼び出し側で Button を行の形へ上書きしない。
 *
 * - `items` は `BottomTabBarItem[]` と同じ形。モバイルの BottomTabBar と同じ配列を渡せる
 * - 現在地は `isActive`。`role="tab"` / `aria-selected` は使わない（ページ遷移のナビであり
 *   タブ切替ではない）
 * - ページ内アンカーの目次は SectionNav、ビュー状態の切替は SubNav を使う
 * - ロゴ行・フッター等はこの部品に含めない。slot 側で並べる
 */
function SidebarNav({
  items,
  collapsed = false,
  navLabel = "サイドナビゲーション",
  className,
  ...props
}: SidebarNavProps) {
  return (
    <nav
      data-slot="sidebar-nav"
      data-collapsed={collapsed || undefined}
      aria-label={navLabel}
      className={cn("w-full", className)}
      {...props}
    >
      <ul className={cn("flex flex-col gap-1", collapsed && "items-center")}>
        {items.map((item, index) => (
          <li key={item.tabKey ?? `${item.label}-${index}`} className={cn(!collapsed && "w-full")}>
            <SidebarNavRow item={item} collapsed={collapsed} />
          </li>
        ))}
      </ul>
    </nav>
  )
}

export { SidebarNav }
export type { SidebarNavItem, SidebarNavProps }
