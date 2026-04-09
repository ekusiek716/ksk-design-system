import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const chipVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer typo-label-sm",
  {
    variants: {
      variant: {
        filled: "bg-[var(--Surface-Secondary)] text-[var(--Text-High-Emphasis)] hover:bg-[var(--Surface-Tertiary)]",
        accent: "bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)] hover:bg-[var(--Surface-Accent-Primary)]",
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
        chipVariants({ variant: selected ? "accent" : variant, size, shape }),
        selected && "border-[var(--Border-Accent-Primary)]",
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
