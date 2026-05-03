import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Alert
 *
 * - bordered (success / info / error / warning): 白背景 + カラー枠線 + 外側リング
 * - inline (inline-info / inline-caution / inline-warning): 色付き背景、コンパクト
 *
 * ### 使用例
 * ```tsx
 * <Alert variant="success">
 *   <AlertTitle>送信しました</AlertTitle>
 *   <AlertDescription>内容を確認してください。</AlertDescription>
 * </Alert>
 * ```
 */

const alertVariants = cva("relative w-full", {
  variants: {
    variant: {
      success: [
        "flex flex-col items-start overflow-clip rounded-lg",
        "bg-[var(--Surface-Primary)]",
        "shadow-[0_0_0_5px_rgba(31,204,132,0.2)]",
      ].join(" "),
      info: [
        "flex flex-col items-start overflow-clip rounded-lg",
        "bg-[var(--Surface-Primary)]",
        "shadow-[0_0_0_5px_rgba(216,216,219,0.3)]",
      ].join(" "),
      error: [
        "flex flex-col items-start overflow-clip rounded-lg",
        "bg-[var(--Surface-Primary)]",
        "shadow-[0_0_0_5px_rgba(236,0,0,0.15)]",
      ].join(" "),
      warning: [
        "flex flex-col items-start overflow-clip rounded-lg",
        "bg-[var(--Surface-Primary)]",
        "shadow-[0_0_0_5px_rgba(193,104,0,0.2)]",
      ].join(" "),
      "inline-info": [
        "flex gap-1 items-start rounded-sm",
        "bg-[var(--Surface-Tertiary)]",
        "px-3 py-2",
      ].join(" "),
      "inline-caution": [
        "flex gap-1 items-start rounded-sm",
        "bg-[var(--Surface-Caution-Light)]",
        "px-3 py-2",
      ].join(" "),
      "inline-warning": [
        "flex gap-1 items-start rounded-sm",
        "bg-[var(--Surface-Warning)]",
        "px-3 py-2",
      ].join(" "),
    },
  },
  defaultVariants: { variant: "info" },
})

const alertInnerVariants = cva(
  "flex w-full gap-2 items-start p-4 rounded-lg border",
  {
    variants: {
      variant: {
        success: "border-[var(--Focus-High-Emphasis)]",
        info: "border-[var(--Border-Medium-Emphasis)]",
        error: "border-[var(--Border-Caution)]",
        warning: "border-[var(--Primitive-Wood-800)]",
        "inline-info": "",
        "inline-caution": "",
        "inline-warning": "",
      },
    },
    defaultVariants: { variant: "info" },
  }
)

type AlertVariant = VariantProps<typeof alertVariants>["variant"]

const AlertVariantContext = React.createContext<AlertVariant>("info")

const isBorderedVariant = (v: AlertVariant) =>
  v === "success" || v === "info" || v === "error" || v === "warning"

function Alert({
  className,
  variant = "info",
  children,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  const bordered = isBorderedVariant(variant)
  return (
    <AlertVariantContext.Provider value={variant}>
      <div
        data-slot="alert"
        data-variant={variant}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {bordered ? (
          <div className={alertInnerVariants({ variant })}>{children}</div>
        ) : (
          children
        )}
      </div>
    </AlertVariantContext.Provider>
  )
}

const alertTitleVariants: Record<string, string> = {
  success: "text-[var(--Primitive-Forest-800)]",
  info: "text-[var(--Text-High-Emphasis)]",
  error: "text-[var(--Text-Caution)]",
  warning: "text-[var(--Text-Warning)]",
  "inline-info": "text-[var(--Text-High-Emphasis)]",
  "inline-caution": "text-[var(--Text-Caution)]",
  "inline-warning": "text-[var(--Text-Warning)]",
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  const variant = React.useContext(AlertVariantContext)
  const variantColor = alertTitleVariants[variant ?? "info"] ?? ""
  return (
    <div
      data-slot="alert-title"
      className={cn("typo-label-md", variantColor, className)}
      {...props}
    />
  )
}

const alertDescriptionVariants: Record<string, string> = {
  error: "text-[var(--Text-Caution)]",
  "inline-caution": "text-[var(--Text-Caution)]",
  "inline-warning": "text-[var(--Text-Warning)]",
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const variant = React.useContext(AlertVariantContext)
  const variantColor = alertDescriptionVariants[variant ?? ""] ?? ""
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "typo-body-sm",
        variantColor || "text-[var(--Text-Medium-Emphasis)]",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
export type { AlertVariant }
