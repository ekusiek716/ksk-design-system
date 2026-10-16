import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const iconBadgeVariants = cva(
  "inline-flex shrink-0 items-center justify-center",
  {
    variants: {
      size: {
        md: "size-11",
        ml: "size-12",
        lg: "size-18",
      },
      appearance: {
        accent: "rounded-full",
        plain: "",
      },
      /**
       * 色の意味（issue #684）。accent（既定・従来どおり）/ info / success / warning / caution。
       * アイコン色は Object-*（success / warning は 3:1 のため Text-*）、`appearance="accent"` の面は対応する Surface-* の淡色面。
       */
      tone: {
        accent: "text-[var(--Object-Accent-Primary)]",
        info: "text-[var(--Object-Info)]",
        // success / warning の Object-*（Green-500 / Orange-500）は淡い面で非テキスト 3:1 を割るため Text-* を使う
        success: "text-[var(--Text-Success)]",
        warning: "text-[var(--Text-Warning)]",
        caution: "text-[var(--Object-Caution)]",
      },
    },
    compoundVariants: [
      { appearance: "accent", tone: "accent", className: "bg-[var(--Surface-Accent-Primary-Light)]" },
      { appearance: "accent", tone: "info", className: "bg-[var(--Surface-Info)]" },
      { appearance: "accent", tone: "success", className: "bg-[var(--Surface-Success)]" },
      { appearance: "accent", tone: "warning", className: "bg-[var(--Surface-Warning)]" },
      { appearance: "accent", tone: "caution", className: "bg-[var(--Surface-Caution)]" },
      {
        appearance: "accent",
        size: "md",
        className: "[&_svg]:size-5",
      },
      {
        appearance: "accent",
        size: "ml",
        className: "[&_svg]:size-6",
      },
      {
        appearance: "accent",
        size: "lg",
        className: "[&_svg]:size-[2.375rem]",
      },
      {
        appearance: "plain",
        size: ["md", "ml", "lg"],
        className: "size-auto",
      },
    ],
    defaultVariants: {
      size: "md",
      appearance: "accent",
      tone: "accent",
    },
  },
)

interface IconBadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof iconBadgeVariants> {}

/**
 * 淡いアクセント面に装飾アイコンを収める、外側余白を持たないバッジ。
 *
 * `tone` で情報・成功・注意・警告の色にできる（面とアイコン色が対で変わる）。
 * 色だけで意味を伝えないこと: 隣の見出し・本文で状態を言葉でも示す。
 *
 * `appearance="plain"` は既存パターン内のアイコン枠を同じ DOM 責務へ
 * 集約するための互換モード。寸法・色・余白は利用側の className が担当する。
 */
function IconBadge({
  className,
  size,
  appearance,
  tone,
  "aria-label": ariaLabel,
  ...props
}: IconBadgeProps) {
  return (
    <span
      data-slot="icon-badge"
      data-size={size ?? "md"}
      data-appearance={appearance ?? "accent"}
      data-tone={tone ?? "accent"}
      role={ariaLabel ? "img" : undefined}
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      className={cn(iconBadgeVariants({ size, appearance, tone }), className)}
      {...props}
    />
  )
}

export { IconBadge, iconBadgeVariants }
export type { IconBadgeProps }
