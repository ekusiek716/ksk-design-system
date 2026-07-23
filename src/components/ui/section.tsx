import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const sectionVariants = cva("w-full", {
  variants: {
    spacing: {
      sm: "py-8",
      md: "py-12",
      lg: "py-16",
      xl: "py-24",
    },
    background: {
      none: "bg-transparent",
      subtle: "bg-[var(--Surface-Secondary)]",
      "accent-subtle": "bg-[var(--Surface-Accent-Primary-Light)]",
    },
  },
  defaultVariants: {
    spacing: "md",
    background: "none",
  },
})

interface SectionProps
  extends React.ComponentProps<"section">,
    VariantProps<typeof sectionVariants> {}

/**
 * 全幅の背景帯とセクション間の縦リズムを管理する。
 * 最大幅・中央寄せ・左右 gutter は内側の Container に委ねる。
 */
function Section({ className, spacing, background, ...props }: SectionProps) {
  return (
    <section
      data-slot="section"
      data-spacing={spacing ?? "md"}
      data-background={background ?? "none"}
      className={cn(sectionVariants({ spacing, background }), className)}
      {...props}
    />
  )
}

export { Section, sectionVariants }
export type { SectionProps }
