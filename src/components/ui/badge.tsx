import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 typo-label-sm w-fit whitespace-nowrap shrink-0 transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)]",
        secondary: "border-transparent bg-[var(--Surface-Secondary)] text-[var(--Text-High-Emphasis)]",
        outline: "border-[var(--Border-Medium-Emphasis)] text-[var(--Text-High-Emphasis)]",
        destructive: "border-transparent bg-[var(--Caution-Base)] text-[var(--Text-on-Inverse)]",
        success: "border-transparent bg-[var(--Success-Base)] text-[var(--Text-on-Inverse)]",
        warning: "border-transparent bg-[var(--Warning-Base)] text-[var(--Text-on-Inverse)]",
        info: "border-transparent bg-[var(--Info-Base)] text-[var(--Text-on-Inverse)]",
        subtle: "border-transparent bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)]",
        ghost: "border-transparent text-[var(--Text-High-Emphasis)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Badge — ステータス / 件数表示。
 *
 * 使い分け:
 * - **Badge**: 数値・ステータス（クリック不可）— `<Badge>NEW</Badge>`
 * - **Tag**: 表示専用ラベル — `<Tag variant="brand">特集</Tag>`
 * - **Chip**: フィルタ・キーワード（クリック可） — `<Chip selected>適用中</Chip>`
 *
 * variant: default(brand) / secondary / outline / destructive / success /
 *   warning / info / subtle(brand-light) / ghost
 */
function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      data-variant={variant ?? "default"}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
