import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Types ───────────────────────────────────────────────────────────────────

/**
 * 項目を消費側のルーターコンポーネント（next/link 等）で描画するためのレンダースロット。
 *
 * 渡された props を**そのまま**転送すること。className を落とすと選択中の面・
 * 文字色・行高が失われ、`aria-current` / `data-*` を落とすと現在地の表示と
 * E2E・計測のアンカーが外れる。Footer・AppHeader の `render` と同じ形で、
 * DS 側は見た目、消費側は遷移方法を担う。
 *
 * @example
 * render: (p) => <Link {...p} href={p.href!} />
 */
type SidebarNavItemRender = (props: {
  href?: string
  className: string
  children: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  "aria-current"?: "page"
  "aria-label"?: string
  title?: string
  "data-slot": string
  "data-active"?: true
  "data-tab-key"?: string
}) => React.ReactElement

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
  /**
   * next/link 等で描画したいときのレンダースロット。指定時は `<a>` / `<button>` の
   * 代わりにこの関数の戻り値を描画する（`href` は props 経由で渡る）。
   * @see SidebarNavItemRender
   */
  render?: SidebarNavItemRender
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
  /**
   * 置く面の明暗（issue #680）。
   * - "default"（既定）: 明るい面（Surface-Primary）。選択中は Surface-Accent-Primary-Light + Text-Accent-Primary
   * - "inverse": 暗い面（Surface-Inverse。`AdminShell sidebarTone="inverse"` 等）。文字は
   *   Text-on-Inverse-Secondary、hover / 選択中は Object-on-Inverse の淡い面 + Text-on-Inverse
   *
   * 面そのもの（サイドバーの背景）は置く側が持つ。SidebarNav は行の色だけを切り替える。
   */
  tone?: "default" | "inverse"
}

// ─── Item ────────────────────────────────────────────────────────────────────

function SidebarNavRow({ item, collapsed, tone }: { item: SidebarNavItem; collapsed: boolean; tone: "default" | "inverse" }) {
  const badgeCount = item.badgeCount ?? 0
  const hasBadge = badgeCount > 0
  const badgeText = badgeCount > 99 ? "99+" : String(badgeCount)
  const icon = item.isActive && item.activeIcon ? item.activeIcon : item.icon

  const rowChildren = (
    <>
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
    </>
  )

  // <a> / <button> / render スロットで共通の属性。render へはこれをそのまま渡す。
  const rowProps = {
    "data-slot": "sidebar-nav-item",
    "data-active": item.isActive ? (true as const) : undefined,
    "data-tab-key": item.tabKey,
    "aria-current": item.isActive ? ("page" as const) : undefined,
    // collapsed ではバッジがドットだけになるため、件数をアクセシブルネームへ含める
    "aria-label": collapsed
      ? `${item.ariaLabel ?? item.label}${hasBadge ? `（${badgeText}）` : ""}`
      : item.ariaLabel,
    title: collapsed ? item.label : undefined,
    className: cn(
      // 行高 44px は DS のタッチターゲット方針（AdminShell の合成規範 #7 と同じ）
      "relative flex min-h-11 items-center rounded-lg typo-label-md",
      "transition-colors duration-[var(--Motion-Duration-Fast)] ease-[var(--Motion-Easing-Standard)]",
      "focus-visible:outline-hidden focus-visible:ring-[3px]",
      // inverse の面（暗い Surface-Inverse）では、不透明にしても Focus-High-Emphasis が 3:1 を割るテーマがある
      // （ライトの cobalt 2.57 / violet 2.49、ダークは面が白で green 1.74 など）ため、Object-on-Inverse の不透明リング
      // （対 Surface-Inverse 17.72:1。check-contrast.mjs が検査。Button inverse / ghost-inverse も同じ）
      tone === "inverse"
        ? "focus-visible:ring-[var(--Object-on-Inverse)]"
        : "focus-visible:ring-[var(--Focus-High-Emphasis)]",
      collapsed ? "size-11 justify-center" : "w-full gap-3 px-3 text-left",
      tone === "inverse"
        ? item.isActive
          ? "bg-[var(--Object-on-Inverse)]/15 text-[var(--Text-on-Inverse)]"
          : "bg-transparent text-[var(--Text-on-Inverse-Secondary)] hover:bg-[var(--Object-on-Inverse)]/10 hover:text-[var(--Text-on-Inverse)]"
        : item.isActive
          ? "bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)]"
          : "bg-[var(--Surface-Primary)] text-[var(--Text-Medium-Emphasis)] hover:bg-[var(--Surface-Secondary)] hover:text-[var(--Text-High-Emphasis)]"
    ),
  }

  if (item.render) {
    return item.render({
      ...rowProps,
      href: item.href,
      onClick: item.onClick,
      children: rowChildren,
    })
  }
  if (item.href) {
    return (
      <a {...rowProps} href={item.href} onClick={item.onClick}>
        {rowChildren}
      </a>
    )
  }
  return (
    <button {...rowProps} type="button" onClick={item.onClick}>
      {rowChildren}
    </button>
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
  tone = "default",
  className,
  ...props
}: SidebarNavProps) {
  return (
    <nav
      data-slot="sidebar-nav"
      data-collapsed={collapsed || undefined}
      data-tone={tone}
      aria-label={navLabel}
      className={cn("w-full", className)}
      {...props}
    >
      <ul className={cn("flex flex-col gap-1", collapsed && "items-center")}>
        {items.map((item, index) => (
          <li key={item.tabKey ?? `${item.label}-${index}`} className={cn(!collapsed && "w-full")}>
            <SidebarNavRow item={item} collapsed={collapsed} tone={tone} />
          </li>
        ))}
      </ul>
    </nav>
  )
}

export { SidebarNav }
export type { SidebarNavItem, SidebarNavItemRender, SidebarNavProps }
