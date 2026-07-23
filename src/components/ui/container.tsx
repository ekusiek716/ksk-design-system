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
