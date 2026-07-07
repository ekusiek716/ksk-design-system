import React from "react"
import { Text as RNText, type TextProps as RNTextProps } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo, type TypoVariant } from "../typography"

export interface TextProps extends RNTextProps {
  variant?: TypoVariant
  color?: string
  children: React.ReactNode
}

const CAPTION_VARIANTS = new Set<TypoVariant>(["caption", "caption-strong"])

/**
 * typo トークンを適用する DS テキスト。
 * 色は未指定なら text.high-emphasis。ただし variant が caption 系（出典・補足・注釈）の
 * ときは既定で text.low-emphasis（hint 相当）にする — 各consumerが `text-hint` を
 * 手書きしていた箇所を variant だけで賄えるようにするため。
 */
export function Text({ variant = "body.md", color, style, children, ...rest }: TextProps) {
  const { theme } = useTheme()
  const defaultColor = CAPTION_VARIANTS.has(variant) ? theme.text["low-emphasis"] : theme.text["high-emphasis"]
  return (
    <RNText style={[resolveTypo(variant), { color: color ?? defaultColor }, style]} {...rest}>
      {children}
    </RNText>
  )
}
