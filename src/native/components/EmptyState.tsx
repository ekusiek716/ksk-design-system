import React from "react"
import { View, Text as RNText, type AccessibilityProps } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

/**
 * `AccessibilityProps` を継承しているため `accessibilityLabel` /
 * `accessibilityHint` をそのまま渡せる（issue #298①）。`accessibilityLabel`
 * を渡すと icon/title/description が1つの読み上げ要素にまとまる。
 * `action` はグルーピングの外に置くため、ボタンは個別にフォーカスできる。
 */
export interface EmptyStateProps extends AccessibilityProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  accessibilityLabel,
  accessibilityHint,
  ...accessibilityProps
}: EmptyStateProps) {
  const { theme, scales } = useTheme()
  // hint だけ渡された場合も読み上げ対象にする（accessible が付かないと
  // hint はスクリーンリーダーに届かない）。
  const grouped = accessibilityLabel !== undefined || accessibilityHint !== undefined
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: scales.spacing.scale[8],
        gap: scales.spacing.scale[3],
      }}
    >
      <View
        accessible={grouped ? true : undefined}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        {...accessibilityProps}
        style={{ alignItems: "center", gap: scales.spacing.scale[3] }}
      >
        {icon ?? (
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: theme.surface.secondary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <RNText style={{ fontSize: 28, color: theme.text["low-emphasis"] }}>📭</RNText>
          </View>
        )}
        <RNText
          style={[resolveTypo("heading.md"), { color: theme.text["high-emphasis"], textAlign: "center" }]}
        >
          {title}
        </RNText>
        {description && (
          <RNText
            style={[resolveTypo("body.md"), { color: theme.text["medium-emphasis"], textAlign: "center" }]}
          >
            {description}
          </RNText>
        )}
      </View>
      {action}
    </View>
  )
}
