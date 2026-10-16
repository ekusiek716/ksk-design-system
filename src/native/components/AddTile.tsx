import React from "react"
import { Pressable, Text as RNText, View, type StyleProp, type ViewStyle } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

/** Web AddTile と同じ語彙（issue #678）: sm=44pt / md=64pt */
export type AddTileSize = "sm" | "md"

export interface AddTileProps {
  /** 可視ラベル（「タスクを追加」等）。読み上げ名にもなる */
  label: string
  /** 先頭のアイコン。既定は「+」 */
  icon?: React.ReactNode
  /** 高さ。sm=44pt / md=64pt（既定） */
  size?: AddTileSize
  /** 親幅いっぱいに広げる（既定 true） */
  fullWidth?: boolean
  onPress?: () => void
  disabled?: boolean
  style?: StyleProp<ViewStyle>
}

/**
 * AddTile — 一覧の末尾・空のカラム・グリッドの空き枠に置く「＋追加」の点線タイル（issue #678・Web と対）。
 * accessibilityRole="button"・disabled 状態を部品が持つ。押下中は accent の枠・面・文字。
 */
export function AddTile({ label, icon, size = "md", fullWidth = true, onPress, disabled = false, style }: AddTileProps) {
  const { theme, scales } = useTheme()
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => {
        const active = pressed && !disabled
        return [
          {
            minHeight: size === "sm" ? 44 : 64,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: scales.spacing.scale[2],
            paddingHorizontal: scales.spacing.scale[4],
            borderWidth: 1,
            borderStyle: "dashed",
            borderRadius: scales.borderRadius.lg,
            borderColor: active ? theme.border["accent-primary"] : theme.border["medium-emphasis"],
            backgroundColor: active ? theme.surface["accent-primary-light"] : "transparent",
            opacity: disabled ? 0.5 : 1,
            alignSelf: fullWidth ? "stretch" : "flex-start",
          } satisfies ViewStyle,
          style,
        ]
      }}
    >
      {({ pressed }) => {
        const color = pressed && !disabled ? theme.text["accent-primary"] : theme.text["medium-emphasis"]
        return (
          <>
            <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              {icon ?? <RNText style={[resolveTypo("heading.md"), { color }]}>+</RNText>}
            </View>
            <RNText numberOfLines={1} style={[resolveTypo("label.md"), { color, flexShrink: 1 }]}>
              {label}
            </RNText>
          </>
        )
      }}
    </Pressable>
  )
}
