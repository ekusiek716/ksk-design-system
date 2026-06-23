import React from "react"
import { Platform, View, type StyleProp, type ViewStyle } from "react-native"
import { useTheme } from "../theme/ThemeProvider"

export interface MobileAppHeaderProps {
  brand: React.ReactNode
  leading?: React.ReactNode
  status?: React.ReactNode
  compactStatus?: React.ReactNode
  actions?: React.ReactNode
  children?: React.ReactNode
  bordered?: boolean
  style?: StyleProp<ViewStyle>
}

export function MobileAppHeader({
  brand,
  leading,
  status,
  compactStatus,
  actions,
  children,
  bordered = true,
  style,
}: MobileAppHeaderProps) {
  const { theme, scales } = useTheme()
  return (
    <View
      style={[
        {
          backgroundColor: theme.surface.primary,
          borderBottomWidth: bordered ? 1 : 0,
          borderBottomColor: theme.border["low-emphasis"],
          paddingTop: Platform.OS === "ios" ? 48 : scales.spacing.scale[3],
        },
        style,
      ]}
    >
      <View
        style={{
          minHeight: 56,
          paddingHorizontal: scales.spacing.scale[4],
          flexDirection: "row",
          alignItems: "center",
          gap: scales.spacing.scale[2],
        }}
      >
        {leading}
        <View style={{ flexShrink: 0, maxWidth: "58%" }}>{brand}</View>
        <View
          style={{
            flex: 1,
            minWidth: 0,
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: scales.spacing.scale[2],
          }}
        >
          {compactStatus ?? status}
          {actions}
        </View>
      </View>
      {children}
    </View>
  )
}
