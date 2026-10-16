import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const containerVariants = cva("mx-auto w-full", {
  variants: {
    size: {
      narrow: "max-w-3xl",
      page: "max-w-6xl",
      wide: "max-w-7xl",
      fluid: "max-w-none",
    },
    gutter: {
      none: "",
      tight: "px-4",
      default: "px-6",
      spacious: "px-6 lg:px-16",
      // 画面幅で伸び縮みする余白（issue #711）。既定 clamp(1rem, 4vw, 1.75rem) = 16〜28px。
      // 値は product theme の公開変数 --Container-Gutter-Fluid で上書きできる。
      // ChipFilterBar gutter="fluid" も同じ変数を読むので左端がそろう。product-theme.css を読み込まない
      // 構成でも余白が 0 にならないよう、既定値と同じ clamp をフォールバックに持つ。
      fluid: "px-[var(--Container-Gutter-Fluid,clamp(1rem,4vw,1.75rem))]",
    },
  },
  defaultVariants: {
    size: "page",
    gutter: "default",
  },
})

interface ContainerProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof containerVariants> {}

/**
 * ページ内容の最大幅・中央寄せ・左右 gutter を一元管理する。
 * 縦方向の余白や背景帯は Section に委ねる。
 *
 * gutter: none / tight(16px) / default(24px) / spacious(24px、lg 以上 64px) /
 * fluid（画面幅で 16〜28px。`--Container-Gutter-Fluid` で上書き可。issue #711）。
 */
function Container({ className, size, gutter, ...props }: ContainerProps) {
  return (
    <div
      data-slot="container"
      data-size={size ?? "page"}
      data-gutter={gutter ?? "default"}
      className={cn(containerVariants({ size, gutter }), className)}
      {...props}
    />
  )
}

export { Container, containerVariants }
export type { ContainerProps }
