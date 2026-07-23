import * as React from "react"
import { cn } from "@/lib/utils"

interface SkipLinkProps extends Omit<React.ComponentProps<"a">, "href"> {
  targetId: string
  label?: string
}

function SkipLink({
  targetId,
  label = "コンテンツへ移動",
  className,
  onClick,
  ...props
}: SkipLinkProps) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (event.defaultPrevented) return

    const target = document.getElementById(targetId)
    if (!target) return

    event.preventDefault()
    target.focus({ preventScroll: true })
    target.scrollIntoView({ block: "start" })
    window.history.replaceState(null, "", `#${encodeURIComponent(targetId)}`)
  }

  return (
    <a
      {...props}
      href={`#${targetId}`}
      data-slot="skip-link"
      onClick={handleClick}
      className={cn(
        "fixed left-4 top-4 z-50 flex min-h-11 -translate-y-24 items-center rounded-lg border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] px-4 py-2 typo-label-md text-[var(--Text-High-Emphasis)] shadow-[var(--shadow-lg)] transition-transform",
        "focus:translate-y-0 focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
        className,
      )}
    >
      {label}
    </a>
  )
}

export { SkipLink }
export type { SkipLinkProps }
