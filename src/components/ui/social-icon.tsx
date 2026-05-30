import * as React from "react"
import { cn } from "@/lib/utils"
import {
  SOCIAL_ICON_DATA,
  SOCIAL_ICON_PLATFORMS,
  type SocialIconShape,
  type SocialIconTone,
} from "./social-icon-data"

export interface SocialIconProps
  extends Omit<React.ComponentProps<"svg">, "children"> {
  /** プラットフォーム名（小文字）。例: "github" / "spotify" / "tiktok" */
  platform: string
  /**
   * アイコンの形。
   * - "original"（既定）: ロゴそのまま
   * - "square" / "rounded-square": 角丸四角の地に乗せた版
   * - "rounded": 円形地（一部ブランドのみ）
   */
  shape?: SocialIconShape
  /**
   * 配色。
   * - "brand"（既定）: ブランドカラー
   * - "mono": 単色（currentColor — テキスト色に追従）
   * - "gray": グレー固定
   */
  tone?: SocialIconTone
  /** 一辺のサイズ(px) @default 24 */
  size?: number
}

// 指定が無い／存在しないときに探す順序。最も「素直なロゴ」へ寄せる。
const SHAPE_ORDER: SocialIconShape[] = ["original", "rounded-square", "square", "rounded"]
const TONE_ORDER: SocialIconTone[] = ["brand", "mono", "gray"]

function resolveEntry(platform: string, shape: SocialIconShape, tone: SocialIconTone) {
  const p = SOCIAL_ICON_DATA[platform]
  if (!p) return null
  // 要求された shape/tone を最優先し、無ければ定義順でフォールバック。
  const shapes = [shape, ...SHAPE_ORDER.filter((s) => s !== shape)]
  const tones = [tone, ...TONE_ORDER.filter((t) => t !== tone)]
  for (const s of shapes) {
    const byShape = p[s]
    if (!byShape) continue
    for (const t of tones) {
      const entry = byShape[t]
      if (entry) return entry
    }
  }
  return null
}

/**
 * SocialIcon — SNS / 外部サービスのブランドアイコン
 *
 * `socialicon/` 配下の SVG を `scripts/generate-social-icons.mjs` で取り込んだ
 * 安定データ（`social-icon-data.tsx`）を描画する。`platform` はファイル名では
 * なく正規化済みキーで指定するため、元アセットの命名揺れに依存しない。
 *
 * ```tsx
 * <SocialIcon platform="github" />
 * <SocialIcon platform="spotify" tone="mono" />
 * <SocialIcon platform="tiktok" shape="rounded-square" size={32} />
 * ```
 *
 * 利用可能な platform は {@link SOCIAL_ICON_PLATFORMS}。未収録の指定は何も
 * 描画しない（null）。
 */
function SocialIcon({
  platform,
  shape = "original",
  tone = "brand",
  size = 24,
  className,
  ...props
}: SocialIconProps) {
  const entry = resolveEntry(platform, shape, tone)
  if (!entry) return null

  return (
    <svg
      data-slot="social-icon"
      data-platform={platform}
      width={size}
      height={size}
      viewBox={entry.viewBox}
      fill="none"
      role="img"
      className={cn("inline-block shrink-0", className)}
      {...props}
    >
      {entry.body}
    </svg>
  )
}

export { SocialIcon, SOCIAL_ICON_PLATFORMS }
export type { SocialIconShape, SocialIconTone }
