import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent shadow-sm transition-colors cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-[var(--Brand-Primary)] data-[state=unchecked]:bg-[var(--Surface-Quaternary)]",
        // hover: off は溝を一段濃く、on は Brand を一段濃く（誤反応防止に
        // disabled は据え置き）。checkbox/radio の hover 方針に合わせる。
        "hover:data-[state=unchecked]:bg-[var(--Object-Disable)]",
        "hover:data-[state=checked]:bg-[var(--Hover-Primary-Button)]",
        "disabled:hover:data-[state=unchecked]:bg-[var(--Surface-Quaternary)] disabled:hover:data-[state=checked]:bg-[var(--Brand-Primary)]",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-5 rounded-full bg-[var(--Surface-Primary)] shadow-lg ring-0 transition-transform",
          "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
