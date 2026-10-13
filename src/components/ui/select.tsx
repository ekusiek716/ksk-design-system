import * as React from "react"
import { Select as SelectPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { usePortalContainer } from "./portal-container"

/**
 * SelectTrigger のサイズ規格。Button/Input と揃えて 3 段階を用意。
 * 既定は default (h-12) — 既存挙動と完全互換。
 *
 * 高さ・横 padding・角丸は product theme の公開変数（`--Field-*`）を参照する。
 * 既定値は従来の固定クラスと同値（issue #364）。
 */
const selectTriggerVariants = cva(
  "flex w-full items-center justify-between rounded-[var(--Field-Radius)] border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)] placeholder:text-[var(--Text-Low-Emphasis)] focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[var(--Border-Caution)] aria-invalid:ring-[var(--Caution-Base)]/20 [&>span]:line-clamp-1",
  {
    variants: {
      size: {
        sm:      "h-[var(--Field-Height-Sm)] px-[var(--Field-Padding-X-Sm)] typo-body-sm",
        default: "h-[var(--Field-Height-Md)] px-[var(--Field-Padding-X-Md)] typo-body-md",
        lg:      "h-[var(--Field-Height-Lg)] px-[var(--Field-Padding-X-Lg)] typo-body-md",
      },
    },
    defaultVariants: { size: "default" },
  }
)

/**
 * Select（Root）が受けた aria-invalid / aria-describedby を SelectTrigger へ届けるための context。
 * Radix の Root は DOM 要素を描かないため、FormField が子（Select）へ注入した aria 属性は
 * そのままでは実際のボタン（SelectTrigger）に届かない。
 */
const SelectAriaContext = React.createContext<{
  "aria-invalid"?: React.AriaAttributes["aria-invalid"]
  "aria-describedby"?: string
}>({})

type SelectRootProps = React.ComponentProps<typeof SelectPrimitive.Root> & {
  /** true でトリガーにエラー枠（Border-Caution）を出す。FormField の error から自動で渡される。 */
  "aria-invalid"?: React.AriaAttributes["aria-invalid"]
  /** エラー文・説明文の id。トリガーへ転送される。 */
  "aria-describedby"?: string
}

function Select({ "aria-invalid": ariaInvalid, "aria-describedby": ariaDescribedBy, ...props }: SelectRootProps) {
  const ariaValue = React.useMemo(
    () => ({ "aria-invalid": ariaInvalid, "aria-describedby": ariaDescribedBy }),
    [ariaInvalid, ariaDescribedBy]
  )
  return (
    <SelectAriaContext.Provider value={ariaValue}>
      <SelectPrimitive.Root data-slot="select" {...props} />
    </SelectAriaContext.Provider>
  )
}

function SelectGroup({ ...props }: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

interface SelectTriggerProps
  extends React.ComponentProps<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectTriggerVariants> {
  children?: React.ReactNode
  className?: string
  id?: string
}

function SelectTrigger({ className, children, size, ...props }: SelectTriggerProps) {
  const ariaFromRoot = React.useContext(SelectAriaContext)
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      aria-invalid={ariaFromRoot["aria-invalid"]}
      className={cn(selectTriggerVariants({ size }), className)}
      {...props}
      // Root（FormField）由来の id と、トリガー自身の aria-describedby は両方残す
      aria-describedby={
        [ariaFromRoot["aria-describedby"], props["aria-describedby"]].filter(Boolean).join(" ") || undefined
      }
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-50">
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({ className, children, position = "popper", ...props }: React.ComponentProps<typeof SelectPrimitive.Content>) {
  // PortalContainerProvider があればそのスコープ内へ、無ければ document.body（#360）
  const container = usePortalContainer()
  return (
    <SelectPrimitive.Portal container={container}>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "relative z-[var(--Z-Popover)] max-h-96 min-w-[8rem] overflow-hidden rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)] shadow-[var(--shadow-lg)]",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        {...props}
      >
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-2 pl-8 pr-2 typo-body-md focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
        "focus:bg-[var(--Surface-Secondary)] focus:text-[var(--Text-High-Emphasis)]",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return <SelectPrimitive.Separator data-slot="select-separator" className={cn("-mx-1 my-1 h-px bg-[var(--Border-Low-Emphasis)]", className)} {...props} />
}

function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return <SelectPrimitive.Label data-slot="select-label" className={cn("py-1.5 pl-8 pr-2 typo-label-sm text-[var(--Text-Medium-Emphasis)]", className)} {...props} />
}

export {
  Select, SelectContent, SelectGroup, SelectItem,
  SelectLabel, SelectSeparator, SelectTrigger, SelectValue,
  selectTriggerVariants,
}
export type { SelectRootProps, SelectTriggerProps }
