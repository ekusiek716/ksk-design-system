import * as React from "react"
import { cn } from "@/lib/utils"
import {
  SOCIAL_ICON_DATA,
  SOCIAL_ICON_LABELS,
  SOCIAL_ICON_PLATFORMS,
  type SocialIconTone,
} from "./social-icon-data"

export interface SocialIconProps
  extends Omit<React.ComponentProps<"svg">, "children"> {
  /** プラットフォーム slug（小文字）。例: "github" / "spotify" / "apple-music" */
  platform: string
  /**
   * 配色。
   * - "brand"（既定）: ブランドカラー（元アセットの固有色。DS テーマには連動しない）
   * - "mono": 単色（currentColor — テキスト色に追従）
   */
  tone?: SocialIconTone
  /** 一辺のサイズ(px) @default 24 */
  size?: number
}

const TONE_ORDER: SocialIconTone[] = ["brand", "mono"]

function resolveEntry(platform: string, tone: SocialIconTone) {
  const p = SOCIAL_ICON_DATA[platform]
  if (!p) return null
  // 要求された tone を最優先し、無ければもう一方にフォールバック。
  for (const t of [tone, ...TONE_ORDER.filter((x) => x !== tone)]) {
    if (p[t]) return p[t]
  }
  return null
}

/**
 * SocialIcon — SNS / 外部サービスのブランドアイコン
 *
 * `socialicon/` 配下の `Name=BRAND, Colors=Neutral|Original.svg` を
 * `scripts/generate-social-icons.mjs` で取り込んだ安定データ
 * （`social-icon-data.tsx`）を描画する。`platform` はファイル名ではなく
 * 正規化済み slug で指定するため、元アセットの命名・表示名に依存しない。
 *
 * ```tsx
 * <SocialIcon platform="github" />
 * <SocialIcon platform="spotify" tone="mono" className="text-[var(--Text-High-Emphasis)]" />
 * <SocialIcon platform="apple-music" size={32} />
 * ```
 *
 * 配色は元アセット由来のブランド色固定（tone="brand"）か、テキスト色追従の
 * 単色（tone="mono" → currentColor）。DS のテーマカラーには連動しない
 * （ブランドロゴは正式色を保つのが正しいため）。
 *
 * 利用可能な platform は {@link SOCIAL_ICON_PLATFORMS}、表示名は
 * {@link SOCIAL_ICON_LABELS}。未収録の指定は何も描画しない（null）。
 */
function SocialIcon({
  platform,
  tone = "brand",
  size = 24,
  className,
  ...props
}: SocialIconProps) {
  const entry = resolveEntry(platform, tone)
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

export { SocialIcon, SOCIAL_ICON_PLATFORMS, SOCIAL_ICON_LABELS }
export type { SocialIconTone }
