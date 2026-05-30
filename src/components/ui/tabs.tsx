import * as React from "react"
import { Tabs as TabsPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

type TabsVariant = "default" | "pill"

// TabsList が variant を子の TabsTrigger に配るための context。
// （PillToggle は variant="pill" の Tabs として実装される）
const TabsVariantContext = React.createContext<TabsVariant>("default")

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn("flex flex-col gap-2", className)} {...props} />
}

function TabsList({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & {
  /**
   * - "default": 角丸 lg のセグメント（パネル切替タブ）
   * - "pill": 完全な丸。フィルタ/トグル的なセグメントコントロール。
   *   PillToggle はこの variant を内部利用する。
   */
  variant?: TabsVariant
}) {
  return (
    <TabsVariantContext.Provider value={variant}>
      <TabsPrimitive.List
        data-slot="tabs-list"
        data-variant={variant}
        className={cn(
          "inline-flex w-fit items-center gap-1 bg-[var(--Surface-Tertiary)] p-1 text-[var(--Text-Medium-Emphasis)]",
          variant === "pill" ? "h-11 rounded-full" : "h-10 rounded-lg",
          className
        )}
        {...props}
      />
    </TabsVariantContext.Provider>
  )
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const variant = React.useContext(TabsVariantContext)
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      data-variant={variant}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap typo-label-sm transition-all",
        variant === "pill" ? "rounded-full px-4 py-1.5 gap-1.5" : "rounded-lg px-3 py-1.5",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-[state=active]:bg-[var(--Surface-Primary)] data-[state=active]:text-[var(--Text-High-Emphasis)] data-[state=active]:shadow-sm",
        variant === "default" && "hover:text-[var(--Text-High-Emphasis)]",
        variant === "pill" && "data-[state=inactive]:hover:text-[var(--Text-High-Emphasis)]",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("mt-2 focus-visible:outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
