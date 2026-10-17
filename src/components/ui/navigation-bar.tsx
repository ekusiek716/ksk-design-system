import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { useKskLabels } from "./ksk-labels"
import { IconClose } from "../icons/close"

// ─── Inline icons (pure SVG, no external dep) ────────────────────────────────

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

type NavigationActionButtonProps = Omit<React.ComponentProps<typeof Button>, "variant" | "size" | "onClick" | "children"> & {
  [key: `data-${string}`]: string | number | boolean | undefined
}

export interface NavigationBarProps extends Omit<React.ComponentProps<"header">, "title"> {
  /** 左ボタンへの属性・ref。クリックは onLeft が担当する。 */
  leftButtonProps?: NavigationActionButtonProps
  /** シェアボタンへの属性・ref。クリックは onShare が担当する。 */
  shareButtonProps?: NavigationActionButtonProps
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
  /** 左ボタンのアクセシビリティラベル（自動補完: "戻る" / "閉じる"）。leftLabelVisible のときは画面にも出す */
  leftLabel?: string
  /**
   * 左ボタンに leftLabel の文字も表示する（「＜ メニューに戻る」・issue #729）。既定 false（アイコンだけ）。
   * 高さ 44px・アイコン + 文字のボタンになる。title が無いときは幅の上限なし（右の要素を押し出さず、
   * 残り幅で省略する）、title があるときは 176px（max-w-44・日本語 8 文字が文字幅の差を含めて収まる）まで、超えた分は省略する。
   * title があるときは左・中央・右の 3 列 grid にし、左右の列は同じ幅（広い方に合わせる）なので、
   * 短い文言（「戻る」）ならタイトルが広く残り、重ならず中央のまま。文字付きの戻るボタンを Button で自作しない
   */
  leftLabelVisible?: boolean
  /**
   * 右スロット。rightSlot が優先、未指定かつ onShare があればシェアボタンを表示。
   */
  rightSlot?: React.ReactNode
  /** シェアボタンを右に表示してそのハンドラを登録する簡便 prop */
  onShare?: () => void
  /** シェアボタンのアクセシビリティラベル。既定は KskLabelsProvider の share（無ければ「シェア」） */
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
  leftLabelVisible = false,
  rightSlot,
  onShare,
  shareLabel: shareLabelProp,
  glass = false,
  transparent = false,
  className,
  leftButtonProps,
  shareButtonProps,
  ...props
}: NavigationBarProps) {
  const resolveLeftIcon = () => {
    if (leftIcon === "back")  return <IconBack />
    if (leftIcon === "close") return <IconClose />
    return leftIcon
  }

  // 既定文言は KskLabelsProvider（無ければ「戻る」「閉じる」「シェア」。issue #723）
  const defaultLabels = useKskLabels()
  const defaultLeftLabel = leftIcon === "close" ? defaultLabels.close : defaultLabels.back
  const shareLabel = shareLabelProp ?? defaultLabels.share
  const btnVariant = glass ? "glass" : "secondary"
  const hasTitle = Boolean(title)
  // title + 文字付きの左ボタン: 左 | 中央 | 右 の 3 列 grid（左右は同じ幅）。タイトルの余白を固定値にせず実幅に合わせる（issue #732）
  const gridMode = Boolean(onLeft) && leftLabelVisible && hasTitle

  return (
    <header
      {...props}
      data-slot="navigation-bar"
      className={cn(
        "items-center h-[60px] px-3",
        gridMode ? "grid grid-cols-[1fr_minmax(0,auto)_1fr]" : "relative flex",
        !transparent && "bg-[var(--Surface-Primary)]",
        className
      )}
    >
      {/* Left button — Button コンポーネントを利用 */}
      {onLeft && !leftLabelVisible && (
        <Button
          variant={btnVariant}
          size="icon-xl"
          aria-label={leftLabel ?? defaultLeftLabel}
          {...leftButtonProps}
          onClick={onLeft}
        >
          {resolveLeftIcon()}
        </Button>
      )}
      {onLeft && leftLabelVisible && (
        // #729: 文字付き。高さは icon-xl と同じ 44px（size="default" の 40px から上げる）。
        // 名前は見える文字から取る（aria-label を付けない）
        <Button
          variant={btnVariant}
          size="default"
          data-label-visible=""
          className={cn("h-11 min-w-0 shrink gap-1 pl-2 pr-3", hasTitle ? "max-w-44" : "max-w-full", gridMode && "justify-self-start")}
          {...leftButtonProps}
          onClick={onLeft}
        >
          {resolveLeftIcon()}
          {/* 省略されても全文が分かるよう title を付ける */}
          <span className="min-w-0 truncate" title={leftLabel ?? defaultLeftLabel}>
            {leftLabel ?? defaultLeftLabel}
          </span>
        </Button>
      )}

      {/* Center title — absolute, always visually centered */}
      {hasTitle && (
        <div
          className={cn(
            "flex justify-center items-center pointer-events-none",
            // grid のときは中央の列（左右は同じ幅なので重ならず中央のまま）。それ以外は従来どおり絶対配置
            gridMode ? "min-w-0 px-2" : "absolute inset-0 px-16"
          )}
        >
          <span className="typo-heading-sm text-[var(--Text-High-Emphasis)] min-w-0 truncate">
            {title}
          </span>
        </div>
      )}

      {/* Right slot — Button コンポーネントを利用 */}
      <div className={cn("ml-auto shrink-0", gridMode && "justify-self-end")}>
        {rightSlot ?? (
          onShare ? (
            <Button
              variant={btnVariant}
              size="icon-xl"
              aria-label={shareLabel}
              {...shareButtonProps}
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
