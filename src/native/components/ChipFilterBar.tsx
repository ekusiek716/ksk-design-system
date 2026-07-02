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
export function ChipFilterBar({ children, resultCount, resultCountLabel = defaultResultCountLabel }: ChipFilterBarProps) {
  const { theme, scales } = useTheme()
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: scales.spacing.scale[2] }}
      >
        {children}
      </ScrollView>
      {resultCount !== undefined && (
        <RNText
          style={[
            resolveTypo("label.xs"),
            { color: theme.text["low-emphasis"], marginTop: scales.spacing.scale[2] },
          ]}
        >
          {resultCountLabel(resultCount)}
        </RNText>
      )}
    </View>
  )
}
