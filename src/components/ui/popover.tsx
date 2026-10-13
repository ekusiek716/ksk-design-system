import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"
import { usePortalContainer } from "./portal-container"
import { subscribeToAlertDialogOpening } from "@/lib/layer-coordination"

function Popover({
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  const controlled = open !== undefined
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false)
  const actualOpen = controlled ? open : internalOpen

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!controlled) setInternalOpen(nextOpen)
      onOpenChange?.(nextOpen)
    },
    [controlled, onOpenChange]
  )

  React.useEffect(
    () =>
      subscribeToAlertDialogOpening(() => {
        if (actualOpen) handleOpenChange(false)
      }),
    [actualOpen, handleOpenChange]
  )

  return (
    <PopoverPrimitive.Root
      data-slot="popover"
      open={actualOpen}
      onOpenChange={handleOpenChange}
      {...props}
    />
  )
}

function PopoverTrigger({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({ className, align = "center", sideOffset = 4, ...props }: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  // PortalContainerProvider があればそのスコープ内へ、無ければ document.body（#360）
  const container = usePortalContainer()
  return (
    <PopoverPrimitive.Portal container={container}>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          // max-w は画面内に使える幅まで。className で w-[480px] などを渡しても、
          // 幅 390px の画面で右へはみ出さない（既定の w-72 = 288px には効かない）。
          "z-[var(--Z-Popover)] w-72 max-w-(--radix-popover-content-available-width) rounded-[var(--Radius-Surface)] border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)] p-4 shadow-[var(--shadow-lg)] focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

function PopoverAnchor({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
