import React from "react"
import { Pressable, View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface PaginationProps {
  page: number
  total: number
  onChange?: (page: number) => void
  windowSize?: number
}

function range(from: number, to: number) {
  const r = []
  for (let i = from; i <= to; i++) r.push(i)
  return r
}

export function Pagination({ page, total, onChange, windowSize = 5 }: PaginationProps) {
  const { theme, scales } = useTheme()
  const half = Math.floor(windowSize / 2)
  let start = Math.max(1, page - half)
  let end = Math.min(total, start + windowSize - 1)
  if (end - start + 1 < windowSize) {
    start = Math.max(1, end - windowSize + 1)
  }
  const items = range(start, end)

  const renderBtn = (
    label: string,
    pageTarget: number | null,
    disabled = false,
    active = false,
  ) => (
    <Pressable
      key={label}
      onPress={() => pageTarget && !disabled && onChange?.(pageTarget)}
      disabled={disabled || !pageTarget}
      style={({ pressed }) => ({
        minWidth: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: scales.borderRadius.md,
        backgroundColor: active
          ? theme.brand.primary
          : pressed
          ? theme.active["tertiary-button"]
          : theme.surface.primary,
        borderWidth: active ? 0 : 1,
        borderColor: theme.border["low-emphasis"],
        opacity: disabled ? 0.4 : 1,
        paddingHorizontal: scales.spacing.scale[2],
      })}
    >
      <RNText
        style={[
          resolveTypo("label.sm"),
          { color: active ? theme.text["on-inverse"] : theme.text["high-emphasis"] },
        ]}
      >
        {label}
      </RNText>
    </Pressable>
  )

  return (
    <View style={{ flexDirection: "row", gap: scales.spacing.scale[1], alignSelf: "center" }}>
      {renderBtn("‹", page > 1 ? page - 1 : null, page <= 1)}
      {start > 1 && renderBtn("1", 1)}
      {start > 2 && renderBtn("…", null, true)}
      {items.map((p) => renderBtn(String(p), p, false, p === page))}
      {end < total - 1 && renderBtn("…", null, true)}
      {end < total && renderBtn(String(total), total)}
      {renderBtn("›", page < total ? page + 1 : null, page >= total)}
    </View>
  )
}
