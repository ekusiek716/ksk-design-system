import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

// ─── Inline icons (pure SVG, no external dep) ────────────────────────────────

function IconClose({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconBack({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** iOS 26 スタイルのシェアアイコン（上向き矢印 + トレイ） */
function IconShareIos({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3v12M8 7l4-4 4 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 11H5a2 2 0 00-2 2v6a2 2 0 002 2h14a2 2 0 002-2v-6a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

// ─── NavigationBar ────────────────────────────────────────────────────────────

export interface NavigationBarProps {
  /** 中央タイトル（絶対配置で常に視覚的中央） */
  title?: React.ReactNode
  /**
   * 左ボタンのアイコン:
   * - "back"  : ← 戻る（デフォルト）
   * - "close" : × 閉じる（iOS 26 モーダル）
   * - ReactNode : カスタム
   */
  leftIcon?: "back" | "close" | React.ReactNode
  /** 左ボタンクリックハンドラ */
  onLeft?: () => void
  /** 左ボタンのアクセシビリティラベル（自動補完: "戻る" / "閉じる"） */
  leftLabel?: string
  /**
   * 右スロット。rightSlot が優先、未指定かつ onShare があればシェアボタンを表示。
   */
  rightSlot?: React.ReactNode
  /** シェアボタンを右に表示してそのハンドラを登録する簡便 prop */
  onShare?: () => void
  /** シェアボタンのアクセシビリティラベル */
  shareLabel?: string
  /**
   * true : Liquid Glass ボタン（グラデーション・写真背景の上に重ねるとき）
   * false: 通常ボタン（secondary variant）
   */
  glass?: boolean
  /** ヘッダー自体の背景を透明にする（コンテンツに重ねるとき） */
  transparent?: boolean
  className?: string
}

/**
 * iOS 26 スタイルのナビゲーションバー。
 *
 * - leading  : `Button size="icon-xl"` (glass or secondary variant)
 * - center   : 絶対配置タイトル（常に視覚的中央）
 * - trailing : `Button size="icon-xl"` (glass or secondary variant)
 *
 * @example
 * // 通常（白背景ページ）
 * <NavigationBar title="設定" leftIcon="back" onLeft={back} onShare={share} />
 *
 * // iOS 26 ガラス（グラデーション上に重ねる）
 * <NavigationBar title="Aircraft Stats" leftIcon="close" onLeft={close} onShare={share} glass transparent />
 */
function NavigationBar({
  title,
  leftIcon = "back",
  onLeft,
  leftLabel,
  rightSlot,
  onShare,
  shareLabel = "シェア",
  glass = false,
  transparent = false,
  className,
}: NavigationBarProps) {
  const resolveLeftIcon = () => {
    if (leftIcon === "back")  return <IconBack />
    if (leftIcon === "close") return <IconClose />
    return leftIcon
  }

  const defaultLeftLabel = leftIcon === "close" ? "閉じる" : "戻る"
  const btnVariant = glass ? "glass" : "secondary"

  return (
    <header
      data-slot="navigation-bar"
      className={cn(
        "relative flex items-center h-[60px] px-3",
        !transparent && "bg-[var(--Surface-Primary)]",
        className
      )}
    >
      {/* Left button — Button コンポーネントを利用 */}
      {onLeft && (
        <Button
          variant={btnVariant}
          size="icon-xl"
          aria-label={leftLabel ?? defaultLeftLabel}
          onClick={onLeft}
        >
          {resolveLeftIcon()}
        </Button>
      )}

      {/* Center title — absolute, always visually centered */}
      {title && (
        <div className="absolute inset-x-0 flex justify-center items-center pointer-events-none">
          <span className="typo-heading-sm text-[var(--Text-High-Emphasis)] px-16 truncate">
            {title}
          </span>
        </div>
      )}

      {/* Right slot — Button コンポーネントを利用 */}
      <div className="ml-auto">
        {rightSlot ?? (
          onShare ? (
            <Button
              variant={btnVariant}
              size="icon-xl"
              aria-label={shareLabel}
              onClick={onShare}
            >
              <IconShareIos />
            </Button>
          ) : null
        )}
      </div>
    </header>
  )
}

export { NavigationBar, IconClose, IconBack, IconShareIos }
