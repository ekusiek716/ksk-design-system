import React from "react"
import { View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface NotificationBadgeProps {
  count?: number
  max?: number
  dot?: boolean
  children?: React.ReactNode
}

/** 子要素の右上に未読カウントを重ねるバッジ。 */
export function NotificationBadge({ count = 0, max = 99, dot = false, children }: NotificationBadgeProps) {
  const { theme, scales } = useTheme()
  if (!children) {
    if (dot) {
      return (
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: theme.caution.base,
          }}
        />
      )
    }
    return (
      <View
        style={{
          minWidth: 18,
          paddingHorizontal: 6,
          height: 18,
          borderRadius: scales.borderRadius.full,
          backgroundColor: theme.caution.base,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <RNText style={[resolveTypo("label.xs"), { color: theme.text["on-inverse"] }]}>
          {count > max ? `${max}+` : count}
        </RNText>
      </View>
    )
  }

  return (
    <View style={{ position: "relative" }}>
      {children}
      {(dot || count > 0) && (
        <View
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            ...(dot
              ? { width: 8, height: 8, borderRadius: 4 }
              : {
                  minWidth: 18,
                  paddingHorizontal: 6,
                  height: 18,
                  borderRadius: scales.borderRadius.full,
                  alignItems: "center",
                  justifyContent: "center",
                }),
            backgroundColor: theme.caution.base,
            borderWidth: 2,
            borderColor: theme.surface.primary,
          }}
        >
          {!dot && (
            <RNText style={[resolveTypo("label.xs"), { color: theme.text["on-inverse"] }]}>
              {count > max ? `${max}+` : count}
            </RNText>
          )}
        </View>
      )}
    </View>
  )
}
