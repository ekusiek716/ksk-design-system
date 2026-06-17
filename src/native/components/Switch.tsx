import React from "react"
import { Pressable, View } from "react-native"
import { useTheme } from "../theme/ThemeProvider"

export interface SwitchProps {
  value?: boolean
  onValueChange?: (value: boolean) => void
  disabled?: boolean
}

/**
 * DS トークン駆動の Switch。
 *
 * react-native-web の標準 Switch は thumbColor が無視されて Material Teal が
 * 出てしまうため、Pressable + View で自前実装。Web / iOS / Android で完全に
 * 同じ見た目（テーマカラー連動）になる。
 *
 * 役割は標準 Switch と同等: value / onValueChange / disabled。
 */
export function Switch({ value = false, onValueChange, disabled = false }: SwitchProps) {
  const { theme } = useTheme()

  const W = 50
  const H = 30
  const PADDING = 2
  const THUMB = H - PADDING * 2

  return (
    <Pressable
      onPress={() => !disabled && onValueChange?.(!value)}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      style={{
        width: W,
        height: H,
        borderRadius: H / 2,
        padding: PADDING,
        backgroundColor: value ? theme.brand.primary : theme.surface.tertiary,
        opacity: disabled ? 0.5 : 1,
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: THUMB,
          height: THUMB,
          borderRadius: THUMB / 2,
          backgroundColor: theme.surface.primary,
          alignSelf: value ? "flex-end" : "flex-start",
          shadowColor: theme.overlay.dark,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 1.5,
          elevation: 2,
        }}
      />
    </Pressable>
  )
}
