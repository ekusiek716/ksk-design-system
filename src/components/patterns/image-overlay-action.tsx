import * as React from "react"
import { cn } from "@/lib/utils"

/** オーバーレイの配置。`none` は自分で配置する場合（Flex 内に並べる等）。 */
type ImageOverlayActionPlacement =
  | "none"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "center-left"
  | "center-right"

/** 見えている円の大きさ。**タップ領域は size によらず常に 44px 以上**を確保する。 */
type ImageOverlayActionSize = "sm" | "md"

/**
 * 面の見え方。
 * - `surface`（既定）: 半透明の Surface + blur。写真の明暗によらず読める。
 * - `scrim`         : 暗いスクリム + 白抜きアイコン。明るい写真の上の矢印向け。
 */
type ImageOverlayActionTone = "surface" | "scrim"

interface ImageOverlayActionProps
  extends Omit<React.ComponentPropsWithoutRef<"button">, "aria-label" | "type" | "children"> {
  /**
   * スクリーンリーダー向けの操作名（必須）。アイコンのみの操作子なので
   * 省略を型エラーにしている。トグルの場合は現在の状態ではなく
   * **押したときに起きること**を書く（例: "お気に入りに追加" / "お気に入りから削除"）。
   */
  "aria-label": string
  /** 表示するアイコン。サイズは呼び出し側で指定する（例: `<Heart size={20} />`）。 */
  icon: React.ReactNode
  /**
   * トグル操作のときの押下状態。指定すると `aria-pressed` が出る。
   * 単発操作（次へ / 共有など）では渡さない。
   */
  pressed?: boolean
  placement?: ImageOverlayActionPlacement
  size?: ImageOverlayActionSize
  tone?: ImageOverlayActionTone
  /**
   * 親が stretched-link（カード全体クリック）のとき、クリックを親に伝播させない。
   * 既定 true。オーバーレイ操作は「カードを開く」とは別の操作であるため。
   */
  stopPropagation?: boolean
}

const PLACEMENT_CLASS: Record<ImageOverlayActionPlacement, string> = {
  none: "",
  "top-left": "absolute left-1 top-1",
  "top-right": "absolute right-1 top-1",
  "bottom-left": "absolute bottom-1 left-1",
  "bottom-right": "absolute bottom-1 right-1",
  "center-left": "absolute left-1 top-1/2 -translate-y-1/2",
  "center-right": "absolute right-1 top-1/2 -translate-y-1/2",
}

const VISUAL_SIZE_CLASS: Record<ImageOverlayActionSize, string> = {
  sm: "size-8",
  md: "size-10",
}

const TONE_CLASS: Record<ImageOverlayActionTone, string> = {
  surface:
    "border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]/80 text-[var(--Object-High-Emphasis)] backdrop-blur-sm",
  // VideoOverlay / Text-on-Media はテーマ非依存（常に黒地・白抜き）。
  // 写真の上の面はライト/ダークで反転させたくないためこちらを使う。
  scrim: "bg-[var(--Surface-VideoOverlay-Medium)] text-[var(--Text-on-Media)] backdrop-blur-sm",
}

/**
 * ImageOverlayAction — 画像の上に重ねる単一のアクションボタン。
 * お気に入りトグル、カルーセルの前後矢印、削除・拡大などに使う。
 *
 * 設計:
 * - **押せる面を必ず持つ**: 半透明サーフェス（or スクリム）+ 円形。
 *   写真の上に素のアイコンだけを置くと、明るい写真で消える・押せると分からない。
 * - **タップ領域は常に 44px 以上**: 外側の `<button>` が `size-11`、
 *   内側の見た目の円が `size` 分（sm=32px / md=40px）。見た目を小さくしても
 *   ヒットエリアは縮まない。
 * - **aria-label は必須**（型で強制）。トグルは `pressed` を渡すと `aria-pressed` が出る。
 *
 * 親要素には `relative` が必要（`placement="none"` 以外）。
 *
 * 使い分け（vs `MediaActionCluster`）:
 * - **ImageOverlayAction**: 静止画の上の**単発**操作（お気に入り・矢印・削除）。
 *   アイコンのみ + aria-label 必須、常時表示。
 * - **MediaActionCluster**: 動画プレイヤー向けの**ラベル付きボタン群**
 *   （items[].label 必須・アンカー配置・自動フェード）。複数操作をまとめて出すならこちら。
 *
 * @example カルーセル矢印
 * <ImageOverlayAction placement="center-left" tone="scrim" aria-label="前の写真" icon={<ArrowLeft2 size={20} />} onClick={prev} />
 *
 * @example お気に入りトグル（カード全体クリックの上に重ねる）
 * <ImageOverlayAction placement="top-right" pressed={fav} aria-label={fav ? "お気に入りから削除" : "お気に入りに追加"} icon={<Heart size={20} variant={fav ? "Bold" : "Linear"} />} onClick={toggle} />
 */
function ImageOverlayAction({
  icon,
  pressed,
  placement = "top-right",
  size = "md",
  tone = "surface",
  stopPropagation = true,
  className,
  onClick,
  disabled,
  ...props
}: ImageOverlayActionProps) {
  return (
    <button
      {...props}
      type="button"
      data-slot="image-overlay-action"
      data-tone={tone}
      data-placement={placement}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={(event) => {
        if (stopPropagation) {
          event.preventDefault()
          event.stopPropagation()
        }
        onClick?.(event)
      }}
      className={cn(
        "z-[var(--Z-Nav)] flex size-11 cursor-pointer items-center justify-center rounded-full",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
        "disabled:pointer-events-none disabled:opacity-50",
        PLACEMENT_CLASS[placement],
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex items-center justify-center rounded-full",
          "transition-transform duration-[var(--Motion-Duration-Fast)] ease-[var(--Motion-Easing-Standard)] active:scale-[0.94]",
          VISUAL_SIZE_CLASS[size],
          TONE_CLASS[tone],
        )}
      >
        {icon}
      </span>
    </button>
  )
}

export { ImageOverlayAction }
export type {
  ImageOverlayActionPlacement,
  ImageOverlayActionProps,
  ImageOverlayActionSize,
  ImageOverlayActionTone,
}
