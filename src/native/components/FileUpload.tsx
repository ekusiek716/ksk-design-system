import React from "react"
import { Pressable, View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface FileUploadProps {
  title?: string
  description?: string
  /** ファイル選択を起動するコールバック（Expo: expo-image-picker / DocumentPicker を呼び出す等） */
  onPress?: () => void
  disabled?: boolean
}

/**
 * ファイルピッカーをトリガするタッチ領域。実際の選択は consumer 側で
 * expo-image-picker / expo-document-picker を起動して使う。
 */
export function FileUpload({
  title = "ファイルを選択",
  description = "タップしてアップロード",
  onPress,
  disabled = false,
}: FileUploadProps) {
  const { theme, scales } = useTheme()
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => ({
        borderWidth: 2,
        borderStyle: "dashed",
        borderColor: pressed ? theme.brand.primary : theme.border["medium-emphasis"],
        borderRadius: scales.borderRadius.lg,
        padding: scales.spacing.scale[6],
        alignItems: "center",
        justifyContent: "center",
        gap: scales.spacing.scale[1],
        backgroundColor: pressed ? theme.surface.secondary : theme.surface.primary,
        opacity: disabled ? 0.5 : 1,
      })}
    >
      <RNText style={{ fontSize: 28, color: theme.text["low-emphasis"] }}>📤</RNText>
      <RNText style={[resolveTypo("label.md"), { color: theme.text["high-emphasis"] }]}>{title}</RNText>
      <RNText style={[resolveTypo("body.sm"), { color: theme.text["medium-emphasis"] }]}>
        {description}
      </RNText>
    </Pressable>
  )
}
