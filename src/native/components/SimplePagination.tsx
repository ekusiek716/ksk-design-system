import React from "react"
import { Pressable, View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface SimplePaginationProps {
  page: number
  total: number
  onChange?: (page: number) => void
}

/** モバイル向けの「‹ 3/10 ›」型ページャ。 */
export function SimplePagination({ page, total, onChange }: SimplePaginationProps) {
  const { theme, scales } = useTheme()

  const renderBtn = (label: string, target: number, disabled: boolean) => (
    <Pressable
      onPress={() => !disabled && onChange?.(target)}
      disabled={disabled}
      style={({ pressed }) => ({
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: scales.borderRadius.full,
        backgroundColor: pressed ? theme.active["tertiary-button"] : theme.surface.secondary,
        opacity: disabled ? 0.4 : 1,
      })}
    >
      <RNText style={[resolveTypo("label.md"), { color: theme.text["high-emphasis"] }]}>{label}</RNText>
    </Pressable>
  )

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: scales.spacing.scale[3],
        alignSelf: "center",
      }}
    >
      {renderBtn("‹", page - 1, page <= 1)}
      <RNText style={[resolveTypo("label.md"), { color: theme.text["medium-emphasis"] }]}>
        {page} / {total}
      </RNText>
      {renderBtn("›", page + 1, page >= total)}
    </View>
  )
}
