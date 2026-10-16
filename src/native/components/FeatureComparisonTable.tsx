import React from "react"
import { Text as RNText, View, type StyleProp, type ViewStyle } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

/** Web FeatureComparisonTable と同じ形（issue #687） */
export interface FeatureComparisonColumn {
  key: string
  label: string
  highlight?: boolean
}
export type FeatureComparisonValue = boolean | string
export interface FeatureComparisonRow {
  label: string
  values: Record<string, FeatureComparisonValue>
}

export interface FeatureComparisonTableProps {
  columns: FeatureComparisonColumn[]
  rows: FeatureComparisonRow[]
  /** 表の名前（読み上げ用） */
  caption?: string
  /** @default "機能" */
  featureLabel?: string
  /** @default "利用できる" */
  availableLabel?: string
  /** @default "利用できない" */
  unavailableLabel?: string
  style?: StyleProp<ViewStyle>
}

/**
 * FeatureComparisonTable — プランの機能比較表（issue #687・Web と対）。
 * RN に表のセマンティクスが無いため、各行を 1 つの読み上げ要素にまとめ
 * 「機能名、Free 利用できない、Plus 利用できる」のように読む。
 */
export function FeatureComparisonTable({
  columns,
  rows,
  caption,
  featureLabel = "機能",
  availableLabel = "利用できる",
  unavailableLabel = "利用できない",
  style,
}: FeatureComparisonTableProps) {
  const { theme, scales } = useTheme()
  const cellBg = (c: FeatureComparisonColumn) => (c.highlight ? theme.surface["accent-primary-light"] : undefined)
  const spoken = (v: FeatureComparisonValue | undefined) =>
    v === true ? availableLabel : v === false || v == null ? unavailableLabel : v
  const cellWidth = 80

  return (
    <View accessibilityLabel={caption} style={style}>
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{ flexDirection: "row", borderBottomWidth: 1, borderBottomColor: theme.border["low-emphasis"] }}
      >
        <RNText style={[resolveTypo("label.sm"), { flex: 1, paddingVertical: scales.spacing.scale[2], color: theme.text["medium-emphasis"] }]}>
          {featureLabel}
        </RNText>
        {columns.map((c) => (
          <RNText
            key={c.key}
            style={[
              resolveTypo("label.md"),
              {
                width: cellWidth,
                textAlign: "center",
                paddingVertical: scales.spacing.scale[2],
                color: c.highlight ? theme.text["accent-primary"] : theme.text["high-emphasis"],
                backgroundColor: cellBg(c),
              },
            ]}
          >
            {c.label}
          </RNText>
        ))}
      </View>
      {rows.map((row, i) => (
        <View
          key={i}
          accessible
          accessibilityLabel={[row.label, ...columns.map((c) => `${c.label} ${spoken(row.values[c.key])}`)].join("、")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderBottomWidth: i === rows.length - 1 ? 0 : 1,
            borderBottomColor: theme.border["low-emphasis"],
          }}
        >
          <RNText style={[resolveTypo("body.sm"), { flex: 1, paddingVertical: scales.spacing.scale[3], color: theme.text["high-emphasis"] }]}>
            {row.label}
          </RNText>
          {columns.map((c) => {
            const v = row.values[c.key]
            return (
              <View key={c.key} style={{ width: cellWidth, alignSelf: "stretch", justifyContent: "center", backgroundColor: cellBg(c) }}>
                <RNText
                  style={[
                    resolveTypo("body.sm"),
                    {
                      textAlign: "center",
                      color: v === true ? theme.object.success : v === false || v == null ? theme.text["medium-emphasis"] : theme.text["high-emphasis"],
                    },
                  ]}
                >
                  {v === true ? "✓" : v === false || v == null ? "—" : v}
                </RNText>
              </View>
            )
          })}
        </View>
      ))}
    </View>
  )
}
