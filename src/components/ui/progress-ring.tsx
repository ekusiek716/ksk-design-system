import * as React from "react"
import { cn } from "@/lib/utils"

const SIZE_MAP = {
  sm: { size: 32, stroke: 3 },
  md: { size: 48, stroke: 4 },
  lg: { size: 64, stroke: 5 },
  xl: { size: 96, stroke: 6 },
}

type ProgressRingSize = keyof typeof SIZE_MAP

/**
 * ProgressRing の色 prop が受け付ける値。
 *
 * semantic トークンの `var(--...)` 文字列だけを型で許可する。
 * 生 hex / rgb() / Tailwind 標準色はコンパイルエラーになり、
 * `--Primitive-*` もテーマ切替が壊れる（rules.json P015）ため型から外してある。
 */
type ProgressRingColorToken =
  | `var(--Brand-${string})`
  | `var(--Surface-${string})`
  | `var(--Text-${string})`
  | `var(--Border-${string})`
  | `var(--Object-${string})`
  | `var(--Categorical-${string})`
  | `var(--Caution-${string})`
  | `var(--Success-${string})`
  | `var(--Warning-${string})`
  | `var(--Info-${string})`

/**
 * 開発ビルド判定。DS は node の型を持たないので globalThis 経由で参照する
 * （chip-selector / quick-action-grid と同じ形）。`proc` の存在を先に必須に
 * しないと、process が無い環境で本番でも警告が出続ける。
 */
const isDev = () => {
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
  return Boolean(proc) && proc!.env?.NODE_ENV !== "production"
}

/** プリセット表を線形補間して、任意の径に対する既定ストローク幅を求める。 */
function defaultStrokeForPx(px: number): number {
  const table = Object.values(SIZE_MAP).sort((a, b) => a.size - b.size)
  const first = table[0]
  const last = table[table.length - 1]
  if (px <= first.size) return first.stroke
  if (px >= last.size) return last.stroke
  for (let i = 0; i < table.length - 1; i++) {
    const lo = table[i]
    const hi = table[i + 1]
    if (px <= hi.size) {
      const t = (px - lo.size) / (hi.size - lo.size)
      return lo.stroke + t * (hi.stroke - lo.stroke)
    }
  }
  return last.stroke
}

/** 径に応じた中央ラベルの typo クラス。プリセットの見え方を変えないよう px で判定する。 */
function labelTypoForPx(px: number): string {
  if (px < 40) return "typo-label-xs"
  if (px < 56) return "typo-label-sm"
  return "typo-label-md"
}

interface ProgressRingProps {
  /** 0〜100 */
  value: number
  /**
   * 径。プリセット（sm=32 / md=48 / lg=64 / xl=96px）で足りる場合はプリセットを使う。
   * 既存デザインの実寸に合わせる必要があるときだけ px の数値を渡す（例: `size={88}`）。
   * 数値を渡した場合、`strokeWidth` 未指定ならプリセット表を線形補間した幅になる。
   */
  size?: ProgressRingSize | number
  /**
   * 線の太さ（px）。省略時は `size` から決まる既定値。
   * 径の半分以上は円が潰れるため、`size / 2` 未満に丸めて描画する。
   */
  strokeWidth?: number
  /** 進捗円弧の色。既定 `var(--Brand-Primary)` */
  color?: ProgressRingColorToken
  /** 背面トラックの色。既定 `var(--Border-Low-Emphasis)` */
  trackColor?: ProgressRingColorToken
  /** 中央テキスト（省略時は % 表示）。"✓" のような記号や ReactNode も許容 */
  label?: React.ReactNode
  showLabel?: boolean
  className?: string
  /**
   * progressbar のアクセシブルネーム。
   * 省略時は `label` が文字列ならそれを使うが、"✓" のような記号や絵文字は
   * スクリーンリーダーで意味が通らないため、その場合は明示的に指定すること
   * （例: "アップロード進捗 完了"）。`label` が ReactNode（非文字列）のときの
   * 既定値は「進捗」。
   */
  "aria-label"?: string
}

function ProgressRing({
  value,
  size = "md",
  strokeWidth,
  color = "var(--Brand-Primary)",
  trackColor = "var(--Border-Low-Emphasis)",
  label,
  showLabel = true,
  className,
  "aria-label": ariaLabel,
}: ProgressRingProps) {
  // 計算途中に NaN / 負値が混ざると <circle r="NaN"> になり、無警告で何も描画されない。
  // 壊れた値は握り潰さず既定プリセットへ落とし、開発時だけ理由を警告する。
  const rawPx = typeof size === "number" ? size : SIZE_MAP[size].size
  const pxIsValid = Number.isFinite(rawPx) && rawPx > 0
  const px = pxIsValid ? rawPx : SIZE_MAP.md.size

  const rawStroke =
    strokeWidth ?? (pxIsValid ? defaultStrokeForPx(px) : SIZE_MAP.md.stroke)
  const strokeIsValid = Number.isFinite(rawStroke) && rawStroke >= 0
  // 径の半分以上のストロークは radius が 0 以下になり何も描画されなくなるため、
  // 指定を握り潰さず「描ける最大」へ丸める（間違えて使っても壊れない側に倒す）。
  // 0.5 は radius を必ず正に保つための余白（px/2 ちょうどだと radius が 0 になる）。
  const stroke = Math.min(strokeIsValid ? rawStroke : SIZE_MAP.md.stroke, px / 2 - 0.5)

  if (isDev()) {
    if (!pxIsValid) {
      console.warn(
        `[ProgressRing] size に描画できない値（${String(rawPx)}）が渡されました。正の px か "sm"|"md"|"lg"|"xl" を指定してください。既定の md(48px) で描画します。`
      )
    }
    if (!strokeIsValid) {
      console.warn(
        `[ProgressRing] strokeWidth に描画できない値（${String(rawStroke)}）が渡されました。0 以上の有限な数値を指定してください。`
      )
    }
    for (const [name, token] of [["color", color], ["trackColor", trackColor]] as const) {
      // `var(--Brand-Primary, #ff0000)` のようにフォールバックへ生値を書くと
      // 型は通るがテーマ切替から外れる（rules.json P015 と同じ問題）。
      if (/#|\brgba?\(|\bhsla?\(|\boklch\(/.test(token) || token.includes("--Primitive-")) {
        console.warn(
          `[ProgressRing] ${name} に生の色値または --Primitive-* が含まれています（${token}）。テーマ切替が効かなくなるため semantic トークンのみを指定してください。`
        )
      }
    }
  }

  const radius = (px - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(100, Math.max(0, value))
  const dashOffset = circumference * (1 - clamped / 100)

  return (
    <div
      data-slot="progress-ring"
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: px, height: px }}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel ?? (typeof label === "string" ? label : "進捗")}
    >
      <svg width={px} height={px} className="-rotate-90">
        {/* Track */}
        <circle
          cx={px / 2}
          cy={px / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={stroke}
        />
        {/* Progress */}
        <circle
          cx={px / 2}
          cy={px / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          // 元の `0.4s ease` を値そのままトークン化。Default は CSS の ease キーワードと
          // 同一曲線（Standard=ease-out に寄せると加速の付き方が変わる）。
          style={{
            transition: "stroke-dashoffset var(--Motion-Duration-Ring) var(--Motion-Easing-Standard)",
          }}
        />
      </svg>
      {showLabel && (
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            labelTypoForPx(px),
            "text-[var(--Text-High-Emphasis)]"
          )}
        >
          {label ?? `${Math.round(clamped)}%`}
        </span>
      )}
    </div>
  )
}

export { ProgressRing }
export type { ProgressRingProps, ProgressRingSize, ProgressRingColorToken }
