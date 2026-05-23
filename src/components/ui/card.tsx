import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)] flex flex-col rounded-lg border border-[var(--Border-Low-Emphasis)] shadow-[var(--shadow-md)] @container",
  {
    variants: {
      variant: {
        /** 既定: 内側に p-6 と gap-6（情報を持つカード向け）。 */
        default: "gap-6 p-6",
        /** メディアカード: padding/gap なし。サムネ等を端まで広げる用途。
         *  オーバーレイで title/badge を絶対配置するときに p-6 が邪魔だったケースに。 */
        media: "gap-0 p-0 overflow-hidden",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

interface CardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {}

function Card({ className, variant, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex flex-col gap-1.5 @sm:flex-row @sm:items-center",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("typo-heading-lg", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("typo-body-sm text-[var(--Text-Medium-Emphasis)]", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("@sm:ml-auto", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-content" className={cn("", className)} {...props} />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter, cardVariants }
export type { CardProps }
