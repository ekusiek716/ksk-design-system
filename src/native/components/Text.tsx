import React from "react"
import { Text as RNText, type TextProps as RNTextProps } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo, type TypoVariant } from "../typography"

export interface TextProps extends RNTextProps {
  variant?: TypoVariant
  color?: string
  children: React.ReactNode
}

/** typo トークンを適用する DS テキスト。色は未指定なら text.high-emphasis。 */
export function Text({ variant = "body.md", color, style, children, ...rest }: TextProps) {
  const { theme } = useTheme()
  return (
    <RNText style={[resolveTypo(variant), { color: color ?? theme.text["high-emphasis"] }, style]} {...rest}>
      {children}
    </RNText>
  )
}
