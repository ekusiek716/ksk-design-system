import React from "react"
import { Pressable, View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface PaginationProps {
  page: number
  total: number
  onChange?: (page: number) => void
  windowSize?: number
  /** 「‹」ボタンの読み上げ名。既定「前のページ」（issue #800） */
  previousLabel?: string
  /** 「›」ボタンの読み上げ名。既定「次のページ」（issue #800） */
  nextLabel?: string
  /** 省略記号「…」の読み上げ名。既定「その他のページ」（issue #800） */
  ellipsisLabel?: string
}

function range(from: number, to: number) {
  const r = []
  for (let i = from; i <= to; i++) r.push(i)
  return r
}

/**
 * ページ送り。各ボタンは役割 `button` を既定で持ち、現在ページに `selected`、
 * 押せないボタン（先頭での「‹」・末尾での「›」・「…」）に `disabled` を立てる。
 * 読み上げ名はページ番号、前後と「…」は `previousLabel` / `nextLabel` / `ellipsisLabel`（issue #800）。
 */
export function Pagination({
  page,
  total,
  onChange,
  windowSize = 5,
  previousLabel = "前のページ",
  nextLabel = "次のページ",
  ellipsisLabel = "その他のページ",
}: PaginationProps) {
  const { theme, scales } = useTheme()
  const half = Math.floor(windowSize / 2)
  let start = Math.max(1, page - half)
  const end = Math.min(total, start + windowSize - 1)
  if (end - start + 1 < windowSize) {
    start = Math.max(1, end - windowSize + 1)
  }
  const items = range(start, end)

  const renderBtn = (
    label: string,
    pageTarget: number | null,
    disabled = false,
    active = false,
    accessibilityLabel: string = label,
  ) => (
    <Pressable
      key={label}
      onPress={() => pageTarget && !disabled && onChange?.(pageTarget)}
      disabled={disabled || !pageTarget}
      accessibilityRole="button"
      accessibilityState={{ selected: active, disabled: disabled || !pageTarget }}
      accessibilityLabel={accessibilityLabel}
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
      {renderBtn("‹", page > 1 ? page - 1 : null, page <= 1, false, previousLabel)}
      {start > 1 && renderBtn("1", 1)}
      {start > 2 && renderBtn("…", null, true, false, ellipsisLabel)}
      {items.map((p) => renderBtn(String(p), p, false, p === page))}
      {end < total - 1 && renderBtn("…", null, true, false, ellipsisLabel)}
      {end < total && renderBtn(String(total), total)}
      {renderBtn("›", page < total ? page + 1 : null, page >= total, false, nextLabel)}
    </View>
  )
}
