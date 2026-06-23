import React from "react"
import { View, Text as RNText, type StyleProp, type ViewStyle } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface DetailSheetScaffoldProps {
  header?: React.ReactNode
  footer?: React.ReactNode
  children?: React.ReactNode
  style?: StyleProp<ViewStyle>
}

export interface DetailSheetHeaderProps {
  title?: React.ReactNode
  titleEditor?: React.ReactNode
  description?: React.ReactNode
  leading?: React.ReactNode
  trailing?: React.ReactNode
  children?: React.ReactNode
  style?: StyleProp<ViewStyle>
}

export interface DetailSheetBodyProps {
  children?: React.ReactNode
  style?: StyleProp<ViewStyle>
}

export function DetailSheetScaffold({ header, footer, children, style }: DetailSheetScaffoldProps) {
  const { theme } = useTheme()
  return (
    <View style={[{ backgroundColor: theme.surface.primary, flex: 1 }, style]}>
      {header}
      <DetailSheetBody>{children}</DetailSheetBody>
      {footer}
    </View>
  )
}

export function DetailSheetHeader({
  title,
  titleEditor,
  description,
  leading,
  trailing,
  children,
  style,
}: DetailSheetHeaderProps) {
  const { theme, scales } = useTheme()
  const titleContent = titleEditor ?? title
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "flex-start",
          gap: scales.spacing.scale[3],
          paddingHorizontal: scales.spacing.scale[5],
          paddingTop: scales.spacing.scale[5],
          paddingBottom: scales.spacing.scale[4],
          borderBottomWidth: 1,
          borderBottomColor: theme.border["low-emphasis"],
        },
        style,
      ]}
    >
      <View style={{ minHeight: 40, justifyContent: "center" }}>{leading}</View>
      <View style={{ flex: 1, minWidth: 0 }}>
        {typeof titleContent === "string" ? (
          <RNText style={[resolveTypo("heading.lg"), { color: theme.text["high-emphasis"] }]}>
            {titleContent}
          </RNText>
        ) : (
          titleContent
        )}
        {typeof description === "string" ? (
          <RNText style={[resolveTypo("body.sm"), { color: theme.text["medium-emphasis"], marginTop: scales.spacing.scale[1] }]}>
            {description}
          </RNText>
        ) : (
          description
        )}
        {children}
      </View>
      <View style={{ minHeight: 40, justifyContent: "center", alignItems: "flex-end" }}>
        {trailing}
      </View>
    </View>
  )
}

export function DetailSheetBody({ children, style }: DetailSheetBodyProps) {
  const { scales } = useTheme()
  return (
    <View style={[{ flex: 1, paddingHorizontal: scales.spacing.scale[5], paddingVertical: scales.spacing.scale[4] }, style]}>
      {children}
    </View>
  )
}
