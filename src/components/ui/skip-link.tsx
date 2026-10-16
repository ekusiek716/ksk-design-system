import * as React from "react"
import { cn } from "@/lib/utils"
import { useKskLabels } from "./ksk-labels"

interface SkipLinkProps extends Omit<React.ComponentProps<"a">, "href"> {
  targetId: string
  label?: string
}

function SkipLink({
  targetId,
  label,
  className,
  onClick,
  ...props
}: SkipLinkProps) {
  // 既定文言は KskLabelsProvider（無ければ「コンテンツへ移動」。issue #723）
  const defaultLabels = useKskLabels()
  const resolvedLabel = label ?? defaultLabels.skipLink
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
        // 隠すときは「自分の高さ + top の 16px + 影の広がり 40px」以上を上へ逃がす（4rem = 64px）。
        // 固定の -translate-y-24（96px）だと、ラベルが 3 行に折り返す幅 390px の画面で
        // 下端が画面の上端から 1px 覗き、影も帯のように見えていた。表示時（focus）は変わらない。
        "fixed left-4 top-4 z-[var(--Z-SkipLink)] flex min-h-11 -translate-y-[calc(100%_+_4rem)] items-center rounded-lg border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] px-4 py-2 typo-label-md text-[var(--Text-High-Emphasis)] shadow-[var(--shadow-lg)] transition-transform",
        "focus:translate-y-0 focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
        className,
      )}
    >
      {resolvedLabel}
    </a>
  )
}

export { SkipLink }
export type { SkipLinkProps }
