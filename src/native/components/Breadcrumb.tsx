import React from "react"
import { Pressable, View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface BreadcrumbProps {
  title: string
  onBack?: () => void
  backLabel?: string
  rightSlot?: React.ReactNode
}

/**
 * Webの Breadcrumb を RN の BackHeader 風に意味変換。
 * モバイルでは多段ナビパンくずは無いので「← 戻る・タイトル」の最小形に。
 */
export function Breadcrumb({ title, onBack, backLabel = "戻る", rightSlot }: BreadcrumbProps) {
  const { theme, scales } = useTheme()
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: scales.spacing.scale[2],
        paddingHorizontal: scales.spacing.scale[3],
        paddingVertical: scales.spacing.scale[2],
        backgroundColor: theme.surface.primary,
        borderBottomWidth: 1,
        borderBottomColor: theme.border["low-emphasis"],
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: scales.spacing.scale[2], flex: 1 }}>
        {onBack && (
          <Pressable
            onPress={onBack}
            hitSlop={8}
            style={({ pressed }) => ({
              padding: scales.spacing.scale[1],
              borderRadius: scales.borderRadius.md,
              backgroundColor: pressed ? theme.surface.secondary : "transparent",
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            })}
          >
            <RNText style={[resolveTypo("label.md"), { color: theme.text["accent-primary"] }]}>‹</RNText>
            <RNText style={[resolveTypo("label.sm"), { color: theme.text["accent-primary"] }]}>
              {backLabel}
            </RNText>
          </Pressable>
        )}
        <RNText
          numberOfLines={1}
          style={[resolveTypo("heading.md"), { color: theme.text["high-emphasis"], flex: 1 }]}
        >
          {title}
        </RNText>
      </View>
      {rightSlot}
    </View>
  )
}
