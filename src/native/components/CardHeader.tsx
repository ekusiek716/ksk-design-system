import React from "react"
import { View, Text as RNText, type ViewProps } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo, type TypoVariant } from "../typography"

export interface CardHeaderProps extends ViewProps {
  eyebrow?: string
  title: string
  /** 既定 heading.xl */
  titleVariant?: TypoVariant
  description?: string
  trailing?: React.ReactNode
}

/** カード冒頭の eyebrow+見出し+説明。余白（4px/4px）を内蔵し利用側の mt-* 手書きを不要にする。 */
export function CardHeader({
  eyebrow,
  title,
  titleVariant = "heading.xl",
  description,
  trailing,
  style,
  ...rest
}: CardHeaderProps) {
  const { theme, scales } = useTheme()

  return (
    <View
      style={[
        { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: scales.spacing.scale[2] },
        style,
      ]}
      {...rest}
    >
      <View style={{ flex: 1 }}>
        {eyebrow && (
          <RNText
            style={[
              resolveTypo("label.sm"),
              { color: theme.text["accent-primary"], marginBottom: scales.spacing.scale[1] },
            ]}
          >
            {eyebrow}
          </RNText>
        )}
        <RNText style={[resolveTypo(titleVariant), { color: theme.text["high-emphasis"] }]}>{title}</RNText>
        {description && (
          <RNText
            style={[
              resolveTypo("body.md"),
              { color: theme.text["medium-emphasis"], marginTop: scales.spacing.scale[1] },
            ]}
          >
            {description}
          </RNText>
        )}
      </View>
      {trailing}
    </View>
  )
}
