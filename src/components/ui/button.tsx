import * as React from "react"
import { type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
// 純粋な variants 定義は React に依存しない別ファイルに切り出し。
// 同じ buttonVariants を `@ksk/design-system/class-names` から Server Component
// 経由でも参照できるようにするため。詳細は server-variants/button-variants.ts。
import { buttonVariants } from "@/lib/server-variants/button-variants"

/** navigator.vibrate のパターン (ms) */
const HAPTIC_PATTERNS: Record<string, number | number[]> = {
  light:   10,
  medium:  25,
  heavy:   50,
  warning: [30, 50, 30],
}

type HapticType = keyof typeof HAPTIC_PATTERNS

interface ButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  /** モバイルでの触覚フィードバック。navigator.vibrate() を使用。未対応環境では無視される。 */
  haptic?: HapticType
}

function Button({ className, variant, size, layout, haptic, onClick, ...props }: ButtonProps) {
  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (haptic && typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(HAPTIC_PATTERNS[haptic])
      }
      onClick?.(e)
    },
    [haptic, onClick]
  )

  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size, layout, className }))}
      onClick={handleClick}
      {...props}
    />
  )
}

export { Button, buttonVariants }
export type { ButtonProps, HapticType }
