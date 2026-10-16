import * as React from "react"
import { Avatar as AvatarPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

/**
 * Avatar の寸法プリセット（issue #688）。native Avatar と同じ語彙・同じ値:
 * xs=24 / sm=32 / md=40（既定・従来の size-10）/ lg=56 / xl=80。
 */
export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl"

const avatarSizeClass: Record<AvatarSize, string> = {
  xs: "size-6",
  sm: "size-8",
  md: "size-10",
  lg: "size-14",
  xl: "size-20",
}

/** AvatarFallback（イニシャル等）の文字サイズ。枠の大きさに追随させる。 */
const fallbackTypoClass: Record<AvatarSize, string> = {
  xs: "typo-label-xs",
  sm: "typo-label-xs",
  md: "typo-label-sm",
  lg: "typo-label-lg",
  xl: "typo-heading-lg",
}

const AvatarSizeContext = React.createContext<AvatarSize>("md")

export interface AvatarProps extends React.ComponentProps<typeof AvatarPrimitive.Root> {
  /**
   * 寸法。xs=24 / sm=32 / md=40（既定）/ lg=56 / xl=80（px）。
   * AvatarFallback の文字サイズも追随する。`className` で `size-*` を上書きするより優先して使う。
   */
  size?: AvatarSize
}

function Avatar({ className, size = "md", ...props }: AvatarProps) {
  return (
    <AvatarSizeContext.Provider value={size}>
      <AvatarPrimitive.Root
        data-slot="avatar"
        data-size={size}
        className={cn("relative flex shrink-0 overflow-hidden rounded-full", avatarSizeClass[size], className)}
        {...props}
      />
    </AvatarSizeContext.Provider>
  )
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

function AvatarFallback({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  const size = React.useContext(AvatarSizeContext)
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-[var(--Surface-Tertiary)] text-[var(--Text-Medium-Emphasis)]",
        fallbackTypoClass[size],
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
