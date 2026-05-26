import * as React from "react"
import { cn } from "@/lib/utils"

interface AppHeaderNavItem {
  label: string
  href?: string
  onClick?: () => void
  isActive?: boolean
}

interface AppHeaderProps {
  /**
   * レイアウト:
   * - `default`（既定）: `leading` + `title` + `trailing` の 3 カラム
   * - `logo`: 左にロゴ、右に actions（top page 想定）
   * - `logo-center`: ロゴ中央（checkout / minimal flow 想定）
   * - `back`: 左に戻るボタン、中央タイトル、右 actions（sub page）
   * - `back-search`: 左に戻るボタン、中央に検索 slot、右 actions
   */
  layout?: "default" | "logo" | "logo-center" | "back" | "back-search"
  /** 左端スロット（戻るボタン、ハンバーガー等） */
  leading?: React.ReactNode
  /** ロゴ要素（layout="logo" / "logo-center" で使用） */
  logo?: React.ReactNode
  /** 中央タイトル（layout="default" / "back" で使用） */
  title?: React.ReactNode
  /** サブタイトル（タイトルの下に表示） */
  subtitle?: React.ReactNode
  /** 中央スロット（layout="back-search" で使用） */
  centerSlot?: React.ReactNode
  /** 右端スロット（アクションボタン群） */
  trailing?: React.ReactNode
  /** 旧 prop 名（trailing と等価）。互換用 */
  rightSlot?: React.ReactNode
  /**
   * PC 用インラインナビ。`@[768px]` 以上で表示される。
   * SP では非表示（ハンバーガー → MenuDrawer 経由を想定）。
   */
  nav?: AppHeaderNavItem[]
  /** ヘッダー下部に追加で出すスロット（タブ・ブレッドクラム等） */
  bottomSlot?: React.ReactNode
  /** 固定ヘッダー（スクロールに追従しない） */
  sticky?: boolean
  /** 下線ボーダー */
  bordered?: boolean
  /**
   * 外観バリアント:
   * - "default"     : 通常（Surface-Primary 背景 + ボーダー）
   * - "glass"       : Liquid Glass（コンテンツに重ねる半透明）
   * - "transparent" : 完全透明（スクロール連動で背景を切り替えるときの初期状態）
   */
  variant?: "default" | "glass" | "transparent"
  className?: string
}

/**
 * AppHeader — アプリ汎用ヘッダー。
 *
 * 5 つの layout モード × 3 つの visual variant の組み合わせで、
 * SP / PC で別実装が必要だったヘッダーを 1 コンポーネントに統合する。
 *
 * @container クエリで SP/PC を切り替えるため、利用側で `@container` を
 * 宣言した親要素の中に置く必要がある（通常 layout shell が宣言）。
 *
 * @example
 * // サブページ（戻る + タイトル）
 * <AppHeader layout="back" leading={<BackButton />} title="設定" />
 *
 * @example
 * // トップ（ロゴ + PC 用 inline nav）
 * <AppHeader
 *   layout="logo"
 *   logo={<Logo />}
 *   nav={[{label: "求人", href: "/jobs"}, {label: "企業", href: "/companies"}]}
 *   trailing={<UserMenu />}
 * />
 */
function AppHeader({
  layout = "default",
  leading,
  logo,
  title,
  subtitle,
  centerSlot,
  trailing,
  rightSlot,
  nav,
  bottomSlot,
  sticky = false,
  bordered = true,
  variant = "default",
  className,
}: AppHeaderProps) {
  const isGlass = variant === "glass"
  const isTransparent = variant === "transparent"
  const right = trailing ?? rightSlot

  const renderCenter = () => {
    if (layout === "back-search" && centerSlot) {
      return <div className="flex-1 min-w-0">{centerSlot}</div>
    }
    if (layout === "logo-center") {
      return (
        <div className="flex-1 flex justify-center min-w-0">
          {logo}
        </div>
      )
    }
    if (layout === "logo") {
      return (
        <>
          <div className="shrink-0">{logo}</div>
          {/* PC: inline ナビを並べる */}
          {nav && nav.length > 0 && (
            <nav className="hidden @[768px]:flex items-center gap-4 ml-6">
              {nav.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={item.onClick}
                  data-active={item.isActive || undefined}
                  className={cn(
                    "typo-label-md text-[var(--Text-Medium-Emphasis)] hover:text-[var(--Text-High-Emphasis)] transition-colors",
                    item.isActive && "text-[var(--Brand-Primary)] font-bold"
                  )}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}
          <div className="flex-1" />
        </>
      )
    }
    // default / back: 中央にタイトル
    return (
      <div className="flex-1 flex flex-col justify-center min-w-0">
        {title && (
          typeof title === "string"
            ? <span className="typo-heading-sm text-[var(--Text-High-Emphasis)] truncate">{title}</span>
            : title
        )}
        {subtitle && (
          typeof subtitle === "string"
            ? <span className="typo-body-xs text-[var(--Text-Medium-Emphasis)] truncate">{subtitle}</span>
            : subtitle
        )}
      </div>
    )
  }

  return (
    <header
      data-slot="app-header"
      data-variant={variant}
      data-layout={layout}
      className={cn(
        "@container",
        // Sticky
        sticky && "sticky top-0 z-40",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 h-14 px-4",
          isGlass && "glass",
          !isGlass && !isTransparent && "bg-[var(--Surface-Primary)]",
          bordered && !isGlass && !isTransparent && "border-b border-[var(--Border-Low-Emphasis)]",
          bordered && isGlass && "border-b border-[rgba(255,255,255,0.25)]",
        )}
      >
        {leading && (
          <div className="flex items-center shrink-0">{leading}</div>
        )}
        {renderCenter()}
        {right && (
          <div className="flex items-center gap-1 shrink-0">{right}</div>
        )}
      </div>
      {bottomSlot && (
        <div
          className={cn(
            !isGlass && !isTransparent && "bg-[var(--Surface-Primary)]",
            bordered && "border-b border-[var(--Border-Low-Emphasis)]",
          )}
        >
          {bottomSlot}
        </div>
      )}
    </header>
  )
}

export { AppHeader }
export type { AppHeaderProps, AppHeaderNavItem }
