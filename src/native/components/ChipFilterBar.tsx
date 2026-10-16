import React from "react"
import { ScrollView, View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface ChipFilterBarProps {
  children: React.ReactNode
  /** 検索結果件数。指定すると children の下に件数テキストを表示する */
  resultCount?: number
  /**
   * 件数テキストのフォーマッタ。未指定時は `"{n}件"` を表示する。
   */
  resultCountLabel?: (n: number) => string
  /**
   * チップ列と件数テキストの左右余白（issue #667・Web の同名 prop と同じ語彙）。
   * `tight` = 16 / `default` = 24。ScrollView の contentContainer に付くので、横スクロールの
   * 始点・終点も余白ぶん内側になり、親の背景は全幅のまま。
   * @default "none"
   */
  gutter?: "none" | "tight" | "default"
}

const defaultResultCountLabel = (n: number) => `${n.toLocaleString()}件`

/**
 * ChipFilterBar (native) — Chip を横スクロール表示するフィルターバーパターン。
 * Web 版 (`src/components/patterns/chip-filter-bar.tsx`) と同じ役割。
 *
 * native の `sticky` / `bare` は Web の CSS position 概念に対応するものがなく、
 * ScrollView の親レイアウト側（例: 固定 header の下に配置する等）で吸収する想定のため、
 * ここでは持たない。
 */
export function ChipFilterBar({
  children,
  resultCount,
  resultCountLabel = defaultResultCountLabel,
  gutter = "none",
}: ChipFilterBarProps) {
  const { theme, scales } = useTheme()
  const paddingHorizontal = gutter === "tight" ? scales.spacing.scale[4] : gutter === "default" ? scales.spacing.scale[6] : 0
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: scales.spacing.scale[2], paddingHorizontal }}
      >
        {children}
      </ScrollView>
      {resultCount !== undefined && (
        <RNText
          style={[
            resolveTypo("label.xs"),
            { color: theme.text["low-emphasis"], marginTop: scales.spacing.scale[2], paddingHorizontal },
          ]}
        >
          {resultCountLabel(resultCount)}
        </RNText>
      )}
    </View>
  )
}
