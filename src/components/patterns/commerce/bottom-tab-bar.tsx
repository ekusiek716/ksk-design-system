import * as React from "react"
import { cn } from "@/lib/utils"
import { useVisualViewportKeyboardInset } from "@/lib/use-visual-viewport-keyboard-inset"

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
  /**
   * タブを一意に識別する安定 DOM アンカー。指定時は button/a に
   * `data-tab-key` として出力される（E2E テスト・計測用のセレクタ安定化）。
   * 中央 CTA（centerAction）には付与しない。
   */
  tabKey?: string
}

type BottomTabBarTone = "default" | "inverse"
type BottomTabBarKeyboardBehavior = "hide" | "lift" | "stay"
type BottomTabBarFloatingPosition = "left" | "center" | "right"

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
  /**
   * pill variant の水平フロート位置（デフォルト "center"、variant="pill" 時のみ有効）。
   * - "center" : 画面中央にフロート（従来どおりの挙動。後方互換）
   * - "left"   : 画面左側にフロート。右側に併置する FAB 用のスペース（80px）を確保する
   * - "right"  : 画面右側にフロート。左側に併置する FAB 用のスペース（80px）を確保する
   */
  floatingPosition?: BottomTabBarFloatingPosition
  /**
   * ソフトキーボード表示中の挙動。
   * - "stay" : 従来通り下部に固定
   * - "hide" : 入力中は非表示
   * - "lift" : keyboard inset 分だけ上へ逃がす
   */
  keyboardBehavior?: BottomTabBarKeyboardBehavior
}

interface BottomTabBarKeyboardState {
  keyboardBehavior: BottomTabBarKeyboardBehavior
  isKeyboardOpen: boolean
  shouldHide: boolean
  liftInset: number
}

function useBottomTabBarKeyboardState(keyboardBehavior: BottomTabBarKeyboardBehavior): BottomTabBarKeyboardState {
  const { keyboardInset, isKeyboardOpen } = useVisualViewportKeyboardInset()

  return {
    keyboardBehavior,
    isKeyboardOpen,
    shouldHide: keyboardBehavior === "hide" && isKeyboardOpen,
    liftInset: keyboardBehavior === "lift" ? keyboardInset : 0,
  }
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
  floatingPosition = "center",
  keyboardBehavior = "stay",
  ...props
}: BottomTabBarProps) {
  const keyboardState = useBottomTabBarKeyboardState(keyboardBehavior)

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
        floatingPosition={floatingPosition}
        keyboardState={keyboardState}
        {...props}
      />
    )
  }
  return <BottomTabBarDefault className={className} items={items} keyboardState={keyboardState} {...props} />
}

// ─── Default variant (従来型) ─────────────────────────────────────────────────

function BottomTabBarDefault({
  className,
  items,
  keyboardState,
  style,
  ...props
}: Omit<BottomTabBarProps, "variant" | "keyboardBehavior"> & { keyboardState: BottomTabBarKeyboardState }) {
  return (
    <nav
      data-slot="bottom-tab-bar"
      data-keyboard-behavior={keyboardState.keyboardBehavior}
      data-keyboard-open={keyboardState.isKeyboardOpen || undefined}
      aria-label="メインナビゲーション"
      className={cn(
        "fixed inset-x-0 z-50 transition-all duration-200",
        keyboardState.keyboardBehavior === "lift"
          ? "bottom-[var(--ksk-bottom-tab-bar-keyboard-inset)]"
          : "bottom-0",
        "border-t border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]",
        "pb-[env(safe-area-inset-bottom)] lg:hidden",
        keyboardState.shouldHide && "translate-y-2 opacity-0 pointer-events-none invisible",
        className
      )}
      style={{
        "--ksk-bottom-tab-bar-keyboard-inset": `${keyboardState.liftInset}px`,
        ...style,
      } as React.CSSProperties}
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
  floatingPosition = "center",
  keyboardState,
  style,
  ...props
}: Omit<BottomTabBarProps, "variant" | "keyboardBehavior"> & { keyboardState: BottomTabBarKeyboardState }) {
  const hasProminentLayout = Boolean(centerAction) || showLabels === true
  const shouldShowLabels = showLabels ?? Boolean(centerAction)
  const splitIndex = centerAction ? Math.ceil(items.length / 2) : items.length
  const leadingItems = items.slice(0, splitIndex)
  const trailingItems = items.slice(splitIndex)
  // left/right フロート時は反対側に併置される FAB のスペース（80px）を
  // safe-area 込みで確保する（belle-todo `.floating-bottom` を参考）。
  const isSideFloating = floatingPosition === "left" || floatingPosition === "right"
  const pillStyle = {
    "--ksk-bottom-tab-bar-keyboard-inset": `${keyboardState.liftInset}px`,
    ...(hasProminentLayout && !isSideFloating ? { width: "calc(100vw - 24px)", maxWidth } : {}),
    ...(isSideFloating ? { maxWidth: "calc(100vw - 92px)" } : {}),
    ...style,
  } as React.CSSProperties

  return (
    <nav
      data-slot="bottom-nav-pill"
      data-keyboard-behavior={keyboardState.keyboardBehavior}
      data-keyboard-open={keyboardState.isKeyboardOpen || undefined}
      aria-label="メインナビゲーション"
      className={cn(
        "z-50 lg:hidden transition-all duration-200",
        pillPosition === "fixed" ? "fixed" : "absolute",
        // 位置: 画面下部に余白を持ってフロート
        keyboardState.keyboardBehavior === "lift"
          ? "bottom-[calc(env(safe-area-inset-bottom)+12px+var(--ksk-bottom-tab-bar-keyboard-inset))]"
          : "bottom-[calc(env(safe-area-inset-bottom)+12px)]",
        // 水平位置: center は従来どおり中央フロート。left/right は反対側に
        // FAB スペース（80px）を確保して片側へ寄せる。
        floatingPosition === "left" && "left-3 right-20",
        floatingPosition === "right" && "right-3 left-20",
        floatingPosition === "center" && "left-1/2 -translate-x-1/2",
        // ピル形状 + Liquid Glass
        "flex items-center rounded-full glass glass-specular",
        hasProminentLayout ? "min-h-[66px] gap-1 px-2 py-2" : "h-[58px] gap-0 px-3",
        keyboardState.shouldHide && "translate-y-2 opacity-0 pointer-events-none invisible",
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
      data-tab-key={item.tabKey}
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
              // 影は上端のインセットハイライト 1 枚のみ。外側ドロップシャドウを足すと
              // ピル本体（.glass）の影と二重になり煩く見える
              ? "[background:color-mix(in_srgb,var(--Surface-Primary)_42%,transparent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]"
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
  // label 無しはアイコンのみの正円 FAB として描画する
  //（ラベル前提の幅広ピルに空ラベルを入れると間延びした見た目になるため）
  const hasLabel = Boolean(item.label)

  return (
    <Tag
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full",
        hasLabel ? "h-12 min-w-[78px] gap-1.5 px-3" : "size-12",
        "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)] shadow-[0_8px_24px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.28)]",
        "typo-label-sm transition-transform active:scale-[0.96]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--Focus-High-Emphasis)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      )}
      aria-label={item.ariaLabel ?? item.label}
      {...tagProps}
    >
      <span
        className={cn("flex items-center justify-center", hasLabel && "size-5")}
        aria-hidden="true"
      >
        {item.icon}
      </span>
      {hasLabel && <span className="max-w-[5rem] truncate">{item.label}</span>}
    </Tag>
  )
}

export { BottomTabBar }
export type {
  BottomTabBarAction,
  BottomTabBarFloatingPosition,
  BottomTabBarItem,
  BottomTabBarKeyboardBehavior,
  BottomTabBarProps,
}
