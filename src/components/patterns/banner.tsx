import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { IconClose } from "../icons/close"
import { useKskLabels } from "../ui/ksk-labels"

const bannerVariants = cva(
  "flex items-start border border-[var(--Border-Info)]",
  {
    variants: {
      /** 余白の詰め具合（issue #683）。compact は狭い場所・積み重ねるお知らせ向け */
      density: {
        default: "gap-3 p-4",
        compact: "gap-2 px-3 py-2",
      },
      /**
       * 形（issue #683）。card は角丸の囲み（既定・従来どおり）。bar は画面上端などに敷く全幅の帯で、
       * 角丸なし・上と左右の枠なし・下線のみ。
       */
      layout: {
        card: "rounded-lg",
        bar: "w-full rounded-none border-x-0 border-t-0",
      },
      variant: {
        info: "border-[var(--Border-Info)] bg-[var(--Surface-Info)] text-[var(--Text-Info)]",
        success: "border-[var(--Border-Success)] bg-[var(--Surface-Success)] text-[var(--Text-Success)]",
        warning: "border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Warning)] text-[var(--Text-Warning)]",
        caution: "border-[var(--Border-Caution)] bg-[var(--Surface-Caution)] text-[var(--Text-Caution)]",
      },
    },
    defaultVariants: {
      variant: "info",
      density: "default",
      layout: "card",
    },
  }
)

interface BannerProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof bannerVariants> {
  icon?: React.ReactNode
  title?: string
  description?: string
  action?: React.ReactNode
  /** 閉じるボタンを右端に出す（issue #735）。渡さなければ出さない。閉じる処理（非表示にする）は consumer が持つ */
  onDismiss?: () => void
  /** 閉じるボタンの読み上げ名。既定は KskLabelsProvider の close（無ければ「閉じる」） */
  dismissLabel?: string
}

function Banner({
  className,
  variant,
  density,
  layout,
  icon,
  title,
  description,
  action,
  onDismiss,
  dismissLabel,
  children,
  ...props
}: BannerProps) {
  const labels = useKskLabels()
  return (
    <div
      data-slot="banner"
      role="alert"
      data-density={density ?? "default"}
      data-layout={layout ?? "card"}
      className={cn(bannerVariants({ variant, density, layout }), className)}
      {...props}
    >
      {icon && <div className="shrink-0 mt-0.5">{icon}</div>}
      <div className="flex-1 min-w-0">
        {title && (
          <p className="typo-label-md text-[var(--Text-High-Emphasis)]">{title}</p>
        )}
        {description && (
          <p className={cn("typo-body-sm", density === "compact" ? title && "mt-0.5" : "mt-1")}>{description}</p>
        )}
        {children}
      </div>
      {action && <div className="shrink-0">{action}</div>}
      {onDismiss && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          data-slot="banner-dismiss"
          aria-label={dismissLabel ?? labels.close}
          onClick={onDismiss}
          className="shrink-0 -my-1 -mr-1"
        >
          <IconClose size={16} />
        </Button>
      )}
    </div>
  )
}

export { Banner, bannerVariants }
