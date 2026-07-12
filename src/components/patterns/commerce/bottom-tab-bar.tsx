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
  /**
   * iOS 26 の scroll edge effect（variant="pill" 時のみ有効）。
   * バーの背後をコンテンツがスクロールする帯に progressive blur を敷き、
   * バー付近でコンテンツが徐々にぼけて溶けるようにする。
   * コンテンツがバーの下を通過するレイアウト（全画面リスト等）で指定する。
   */
  scrollEdge?: boolean
}

// 選択プラッター（水滴カプセル）の面。色は「背後のメディア」に相対する
// テーマ非依存のガラス素材なので、.glass 系素材と同じく白リテラルを使う
// （このファイル既存の color-mix / inset ハイライトと同じ扱い。
//   Brand テーマ切替の対象外）。
// ライトはガラス面自体が白いためプラッターが沈みやすい。白 70% + ごく浅い
// 外影 1 枚で「持ち上がった水滴」の輪郭を出す（強い外影はピル本体の影と
// 二重になるため 3px/8% に留める）
function platterSurfaceClass(tone: BottomTabBarTone) {
  return tone === "inverse"
    ? "bg-[rgba(255,255,255,0.20)] shadow-[inset_0_1px_0_rgba(255,255,255,0.30)]"
    : "[background:color-mix(in_srgb,var(--Surface-Primary)_70%,transparent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.60),0_1px_3px_rgba(0,0,0,0.08)]"
}

// SSR（react-dom/server）では useLayoutEffect が警告を出すため、
// サーバでは useEffect に落とす定番パターン（どちらもサーバでは走らない）
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect

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
  scrollEdge = false,
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
        scrollEdge={scrollEdge}
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

interface PlatterRect {
  x: number
  y: number
  w: number
  h: number
}

function BottomTabBarPill({
  className,
  items,
  centerAction,
  showLabels,
  tone = "default",
  maxWidth = 430,
  pillPosition = "fixed",
  floatingPosition = "center",
  scrollEdge = false,
  keyboardState,
  style,
  ...props
}: Omit<BottomTabBarProps, "variant" | "keyboardBehavior"> & { keyboardState: BottomTabBarKeyboardState }) {
  const hasProminentLayout = Boolean(centerAction) || showLabels === true
  const shouldShowLabels = showLabels ?? Boolean(centerAction)
  const splitIndex = centerAction ? Math.ceil(items.length / 2) : items.length
  const leadingItems = items.slice(0, splitIndex)
  const trailingItems = items.slice(splitIndex)

  // ── Sliding selection platter（iOS 26 の droplet morph）──
  // アクティブタブの選択カプセルを per-item の静的背景ではなく、nav 内に
  // 1 枚だけ置いた overlay とし、アクティブ位置へ transform/width で滑らせる。
  // 計測は NavItem 側が付ける [data-platter-anchor]（ラベル表示時は Tag、
  // アイコンのみ時はアイコン領域）を getBoundingClientRect で拾う。
  // SSR / 計測前は overlay を出さず NavItem の静的プラッターで描画する
  // （hydration 後に同位置の overlay へ引き継ぐため見た目は変わらない）。
  const navRef = React.useRef<HTMLElement>(null)
  const [platterRect, setPlatterRect] = React.useState<PlatterRect | null>(null)
  // 初回配置はアニメーションさせない（原点から飛んでくるちらつき防止）。
  // 最初の rect 確定の次フレームで transition を有効化する
  const [platterAnimated, setPlatterAnimated] = React.useState(false)
  const measurePlatter = React.useCallback(() => {
    const nav = navRef.current
    if (!nav) return
    const anchor = nav.querySelector<HTMLElement>("[data-platter-anchor]")
    if (!anchor) {
      setPlatterRect(null)
      return
    }
    const navBox = nav.getBoundingClientRect()
    const box = anchor.getBoundingClientRect()
    setPlatterRect((prev) => {
      const next = {
        x: box.left - navBox.left,
        y: box.top - navBox.top,
        w: box.width,
        h: box.height,
      }
      // サブピクセル差の再セットで無限再レンダーしないようガード
      if (
        prev &&
        Math.abs(prev.x - next.x) < 0.5 &&
        Math.abs(prev.y - next.y) < 0.5 &&
        Math.abs(prev.w - next.w) < 0.5 &&
        Math.abs(prev.h - next.h) < 0.5
      ) {
        return prev
      }
      return next
    })
  }, [])
  // items（isActive 含む）が変わるたびに描画前へ再計測。ガード付きなのでループしない
  useIsomorphicLayoutEffect(measurePlatter)
  React.useEffect(() => {
    if (platterRect && !platterAnimated) {
      const raf = requestAnimationFrame(() => setPlatterAnimated(true))
      return () => cancelAnimationFrame(raf)
    }
  }, [platterRect, platterAnimated])
  React.useEffect(() => {
    const nav = navRef.current
    if (!nav || typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(measurePlatter)
    observer.observe(nav)
    return () => observer.disconnect()
  }, [measurePlatter])
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
    <>
      {/* Scroll edge effect（iOS 26）: バー背後の帯に progressive blur を敷き、
          下を通過するコンテンツがバー付近で徐々にぼけて溶けるようにする。
          バー本体(z-50)の下・コンテンツの上に挟む装飾層 */}
      {scrollEdge && (
        <div
          aria-hidden="true"
          className={cn(
            "inset-x-0 bottom-0 z-40 h-28 lg:hidden",
            "glass-scroll-edge-bottom",
            "transition-opacity duration-200",
            pillPosition === "fixed" ? "fixed" : "absolute",
            keyboardState.shouldHide && "opacity-0"
          )}
        />
      )}
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
        // ピル形状 + Liquid Glass。iOS 26 の適応挙動に合わせ、暗いメディア上
        //（tone="inverse"）では白ベースの .glass ではなく暗い素材 .glass-dark を
        // 使う（白ガラスは暗い写真上で milky に浮き、白ラベルのコントラストも
        // 素材頼みになる）。
        "flex items-center rounded-full glass-specular",
        tone === "inverse" ? "glass-dark" : "glass",
        hasProminentLayout ? "min-h-[66px] gap-1 px-2 py-2" : "h-[58px] gap-0 px-3",
        keyboardState.shouldHide && "translate-y-2 opacity-0 pointer-events-none invisible",
        className
      )}
      style={pillStyle}
      {...props}
      // ref は {...props} の後に置く。BottomTabBarProps は ComponentProps<"nav">
      // を継承するため consumer が ref を渡し得るが、スライド platter の実測に
      // 内部 navRef が必須。spread の後に置くことで内部 ref を常に優先する
      // （consumer ref より platter の動作を優先）。
      ref={navRef}
    >
      {/* Sliding selection platter（droplet）。DOM 先頭 = アイテムの背後。
          Tailwind `absolute` を持つ子は .glass-specular の z-lift 対象外なので、
          z-1 のアイテムより下・::before(z0) より上に自然に収まる */}
      {platterRect && (
        <span
          aria-hidden="true"
          className={cn(
            "absolute left-0 top-0 rounded-full pointer-events-none",
            platterAnimated &&
              "transition-[transform,width,height] duration-200 ease-out motion-reduce:transition-none",
            platterSurfaceClass(tone)
          )}
          style={{
            width: platterRect.w,
            height: platterRect.h,
            transform: `translate3d(${platterRect.x}px, ${platterRect.y}px, 0)`,
          }}
        />
      )}
      {leadingItems.map((item, index) => (
        <NavItem
          key={`${item.href ?? item.label}-${index}`}
          item={item}
          compact
          showLabel={shouldShowLabels}
          tone={tone}
          suppressPlatter={platterRect !== null}
        />
      ))}
      {centerAction ? <CenterActionItem item={centerAction} /> : null}
      {trailingItems.map((item, index) => (
        <NavItem
          key={`${item.href ?? item.label}-${index + splitIndex}`}
          item={item}
          compact
          showLabel={shouldShowLabels}
          tone={tone}
          suppressPlatter={platterRect !== null}
        />
      ))}
      </nav>
    </>
  )
}

// ─── Shared NavItem ───────────────────────────────────────────────────────────

function NavItem({
  item,
  compact,
  showLabel,
  tone = "default",
  suppressPlatter = false,
}: {
  item: BottomTabBarItem
  compact: boolean
  showLabel?: boolean
  tone?: BottomTabBarTone
  /**
   * 親（pill）がスライド式プラッター overlay を描画中は true。
   * 静的プラッターを二重に敷かないよう抑止する（計測アンカーは出し続ける）。
   */
  suppressPlatter?: boolean
}) {
  const Tag = item.href ? "a" : "button"
  const tagProps = item.href
    ? { href: item.href }
    : { type: "button" as const, onClick: item.onClick }
  const isLabelVisible = showLabel ?? !compact
  // iOS 26 のタブ選択プラッターは「アイコン+ラベルを 1 カプセルで包む」。
  // pill（compact）でラベル表示時は Tag 自体にプラッターを敷き、
  // アイコンのみ（ラベル非表示）時は従来どおりアイコン周りに敷く。
  // default variant（非 compact・M3 スタイル）は従来のアイコンピルを維持。
  // SSR / 計測前の静的描画。hydration 後は親のスライド overlay に引き継ぐ
  const platterOnTag = compact && isLabelVisible && item.isActive && !suppressPlatter
  const platterOnIcon =
    item.isActive && (!compact || (!isLabelVisible && !suppressPlatter))
  // スライド overlay の計測アンカー（プラッターが包むべき矩形）
  const isPlatterAnchorTag = compact && isLabelVisible && item.isActive
  const isPlatterAnchorIcon = compact && !isLabelVisible && item.isActive
  const platterSurface = platterSurfaceClass(tone)

  return (
    <Tag
      data-tab-key={item.tabKey}
      data-platter-anchor={isPlatterAnchorTag || undefined}
      className={cn(
        "relative flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-full",
        // iOS 26 のガラスは押下で沈む（ゲル感）。opacity だけでなく scale も入れる
        "transition-[transform,opacity] duration-150 active:scale-95 active:opacity-80",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--Focus-High-Emphasis)]",
        compact ? (isLabelVisible ? "h-full min-w-0 flex-1 px-2 py-1" : "h-full w-14") : "min-w-0 flex-1 pb-1 pt-1",
        // 影は上端のインセットハイライト 1 枚のみ。外側ドロップシャドウを足すと
        // ピル本体（.glass）の影と二重になり煩く見える
        platterOnTag && platterSurface,
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
      {/* アイコン領域（アイコンのみ表示時・default variant ではプラッターを兼ねる） */}
      <span
        data-platter-anchor={isPlatterAnchorIcon || undefined}
        className={cn(
          "relative flex items-center justify-center rounded-full transition-colors",
          compact ? (isLabelVisible ? "h-7 min-w-7" : "h-8 w-12") : "h-7 w-14",
          platterOnIcon && (
            compact
              ? platterSurface
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
        // typo クラスはアクティブ状態で変えない（weight ジャンプでラベルが揺れる）。
        // 状態差は色・opacity のみで表現する（iOS 26 と同じ）
        <span className="max-w-full truncate px-0.5 text-center typo-label-xs">
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
        hasLabel ? "h-12 min-w-[78px] gap-1 px-3" : "size-12",
        // iOS 26 の主要アクションはフラット塗りではなく brand ティントの
        // Liquid Glass（.glass-accent = lensing + 3層 inset の質感、
        // .glass-specular = エッジの屈折リム）。テーマ・reduced-transparency
        // フォールバックは glass.css 側で面倒を見る
        "glass-accent glass-specular text-[var(--Text-on-Inverse)]",
        "typo-label-sm transition-transform duration-150 active:scale-[0.96]",
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
