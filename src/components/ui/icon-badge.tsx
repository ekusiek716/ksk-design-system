import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const iconBadgeVariants = cva(
  "inline-flex shrink-0 items-center justify-center text-[var(--Object-Accent-Primary)]",
  {
    variants: {
      size: {
        md: "size-11",
        ml: "size-12",
        lg: "size-18",
      },
      appearance: {
        accent: "rounded-full bg-[var(--Surface-Accent-Primary-Light)]",
        plain: "",
      },
    },
    compoundVariants: [
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
    },
  },
)

interface IconBadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof iconBadgeVariants> {}

/**
 * 淡いアクセント面に装飾アイコンを収める、外側余白を持たないバッジ。
 *
 * `appearance="plain"` は既存パターン内のアイコン枠を同じ DOM 責務へ
 * 集約するための互換モード。寸法・色・余白は利用側の className が担当する。
 */
function IconBadge({
  className,
  size,
  appearance,
  "aria-label": ariaLabel,
  ...props
}: IconBadgeProps) {
  return (
    <span
      data-slot="icon-badge"
      data-size={size ?? "md"}
      data-appearance={appearance ?? "accent"}
      role={ariaLabel ? "img" : undefined}
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      className={cn(iconBadgeVariants({ size, appearance }), className)}
      {...props}
    />
  )
}

export { IconBadge, iconBadgeVariants }
export type { IconBadgeProps }
