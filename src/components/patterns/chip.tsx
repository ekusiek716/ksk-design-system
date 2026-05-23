import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const chipVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer typo-label-sm",
  {
    variants: {
      variant: {
        filled: "bg-[var(--Surface-Secondary)] text-[var(--Text-High-Emphasis)] hover:bg-[var(--Surface-Tertiary)]",
        accent: "bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)] hover:bg-[var(--Hover-Secondary-Button)]",
        outline: "border border-[var(--Border-Medium-Emphasis)] text-[var(--Text-High-Emphasis)] hover:bg-[var(--Surface-Secondary)]",
      },
      size: {
        sm: "h-7 px-2.5 typo-label-xs",
        md: "h-8 px-3 typo-label-sm",
        lg: "h-9 px-4 typo-label-sm",
      },
      shape: {
        pill: "rounded-full",
        square: "rounded-sm",
      },
    },
    defaultVariants: {
      variant: "filled",
      size: "md",
      shape: "pill",
    },
  }
)

interface ChipProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof chipVariants> {
  selected?: boolean
  removable?: boolean
  onRemove?: () => void
}

function Chip({
  className,
  variant,
  size,
  shape,
  selected,
  removable,
  onRemove,
  children,
  ...props
}: ChipProps) {
  return (
    <button
      data-slot="chip"
      data-selected={selected || undefined}
      className={cn(
        chipVariants({ variant, size, shape }),
        // 選択状態は Brand-Primary 背景 + 白文字 + bold で強調。
        // 他 CTA / PillRow と一貫した「選択 = ピンク + 白文字」表現に揃える。
        // hover 時は Active-Primary-Button (Brand-800) まで踏み込んで
        // 「選択中だが押せる」感を明示。Brand-700 では未選択 chip との
        // 区別がつきにくいケースがあった。
        selected && "!bg-[var(--Brand-Primary)] !text-[var(--Text-on-Inverse)] hover:!bg-[var(--Active-Primary-Button)] active:!bg-[var(--Active-Primary-Button)] !border-[var(--Brand-Primary)] font-bold shadow-sm hover:shadow",
        className
      )}
      {...props}
    >
      {children}
      {removable && (
        <span
          role="button"
          aria-label="削除"
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.()
          }}
          className="ml-0.5 hover:text-[var(--Text-Caution)]"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M4 4L10 10M10 4L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      )}
    </button>
  )
}

export { Chip, chipVariants }
