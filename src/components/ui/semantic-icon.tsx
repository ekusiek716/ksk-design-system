import * as React from "react"
import { Add, Danger, TickCircle, TickSquare } from "iconsax-reactjs"
import { cn } from "@/lib/utils"
import { InfoCircleIcon } from "../icons/info-circle"

import { type SemanticIconName } from "../../lib/semantic-icons"
export { SEMANTIC_ICONS, type SemanticIconName } from "../../lib/semantic-icons"

export interface SemanticIconProps extends React.ComponentProps<"svg"> {
  name: SemanticIconName
  color?: string
  style?: React.CSSProperties
  /** Cross-platform alias for aria-label; aria-label wins when both are supplied. */
  accessibilityLabel?: string
  size?: number | string
}

/**
 * 意味から選ぶ装飾アイコン。選択状態や操作名は親のコントロールで伝える。
 * 単独の情報画像として使う場合は aria-label を指定する。
 */
export function SemanticIcon({ name, size = 24, className, accessibilityLabel, color, style, ...props }: SemanticIconProps) {
  const label = props["aria-label"] ?? accessibilityLabel
  const common = {
    ...props,
    size,
    style: { color, ...style },
    "aria-label": label,
    className: cn("shrink-0 text-[var(--Text-High-Emphasis)]", className),
    "aria-hidden": label ? undefined : true as const,
    role: label ? "img" : undefined,
  }
  switch (name) {
    case "selected":
      // ksk-ds-allow-custom-ui: Existing Checkbox / ActionTile tick geometry, without an extra frame.
      return <svg {...common} width={size} height={size} viewBox="0 0 12 12" fill="none"><path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case "selectedSquare": return <TickSquare {...common} variant="Linear" />
    case "success": return <TickCircle {...common} variant="Linear" />
    case "close": return <Add {...common} className={cn(common.className, "rotate-45")} variant="Linear" />
    case "info": return <InfoCircleIcon {...common} />
    case "warning": return <Danger {...common} variant="Linear" />
  }
}
