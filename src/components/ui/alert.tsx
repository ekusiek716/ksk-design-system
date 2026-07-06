import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Warning2, InfoCircle, TickCircle, CloseCircle } from "iconsax-reactjs"
import { cn } from "@/lib/utils"

/**
 * Alert
 *
 * - bordered (success / info / error / warning): 白背景 + カラー枠線 + 外側リング
 * - inline (inline-info / inline-caution / inline-warning): 色付き背景、コンパクト
 *
 * ### 2 つの使い方
 *
 * 1. **prop ベース**（推奨・bordered variant のみ）— アイコンは variant から自動
 *    ```tsx
 *    <Alert variant="success" title="送信しました" description="内容を確認してください。" />
 *    ```
 *
 * 2. **composable**（旧来 / 自由度高い）
 *    ```tsx
 *    <Alert variant="success">
 *      <AlertTitle>送信しました</AlertTitle>
 *      <AlertDescription>内容を確認してください。</AlertDescription>
 *    </Alert>
 *    ```
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
        "bg-[var(--Surface-Caution)]",
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
  "flex w-full gap-2 items-start p-4 rounded-lg border border-[var(--Border-Medium-Emphasis)]",
  {
    variants: {
      variant: {
        success: "border-[var(--Focus-High-Emphasis)]",
        info: "border-[var(--Border-Medium-Emphasis)]",
        error: "border-[var(--Border-Caution)]",
        warning: "border-[var(--Border-Warning)]",
        "inline-info": "border-0",
        "inline-caution": "border-0",
        "inline-warning": "border-0",
      },
    },
    defaultVariants: { variant: "info" },
  }
)

type AlertVariant = VariantProps<typeof alertVariants>["variant"]

const AlertVariantContext = React.createContext<AlertVariant>("info")

const isBorderedVariant = (
  v: AlertVariant,
): v is "success" | "info" | "error" | "warning" =>
  v === "success" || v === "info" || v === "error" || v === "warning"

// bordered variant 用の自動アイコン・色マップ
// (prop-based API で title / description を渡したときに使う)
const borderedIconMap = {
  success: { Icon: TickCircle, color: "text-[var(--Text-Success)]" },
  info: { Icon: InfoCircle, color: "text-[var(--Text-Medium-Emphasis)]" },
  error: { Icon: CloseCircle, color: "text-[var(--Text-Caution)]" },
  warning: { Icon: Warning2, color: "text-[var(--Text-Warning)]" },
} as const

type AlertProps = React.ComponentProps<"div"> &
  VariantProps<typeof alertVariants> & {
    /**
     * prop-based API のタイトル。children と排他（children 優先）。
     * bordered variant でのみ有効。
     */
    title?: React.ReactNode
    /** prop-based API の説明テキスト */
    description?: React.ReactNode
    /** カスタムアイコン（未指定時は variant に応じて自動選択） */
    icon?: React.ReactNode
    /** 右側アクション（Button など） */
    action?: React.ReactNode
  }

function Alert({
  className,
  variant = "info",
  children,
  title,
  description,
  icon,
  action,
  ...props
}: AlertProps) {
  const bordered = isBorderedVariant(variant)
  const usePropBased = bordered && !children && (title || description)

  // bordered variant かつ children なし → prop-based レンダリング
  if (usePropBased) {
    const { Icon, color: iconColor } = borderedIconMap[variant]
    const titleColor = alertTitleVariants[variant] ?? ""
    const iconNode = icon ?? <Icon size={24} className={cn("shrink-0", iconColor)} />

    return (
      <AlertVariantContext.Provider value={variant}>
        <div
          data-slot="alert"
          data-variant={variant}
          role="alert"
          className={cn(alertVariants({ variant }), className)}
          {...props}
        >
          <div className={alertInnerVariants({ variant })}>
            {iconNode}
            <div className="flex-1 min-w-0">
              {title && <div className={cn("typo-label-md", titleColor)}>{title}</div>}
              {description && (
                <div className="typo-body-sm text-[var(--Text-Medium-Emphasis)] mt-1">
                  {description}
                </div>
              )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        </div>
      </AlertVariantContext.Provider>
    )
  }

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
  success: "text-[var(--Text-Success)]",
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
