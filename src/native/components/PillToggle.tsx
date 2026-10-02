import React from "react"
import { Platform, Pressable, View, Text as RNText, type ViewStyle } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface PillToggleOption {
  value: string
  label: string
  count?: number
}

export interface PillToggleProps {
  options: PillToggleOption[]
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  /**
   * 横幅いっぱいに広げ、各項目を等幅にする（既定 false = ラベル幅のまま）。
   * Web の `fullWidth` と同じ意味（issue #500）。有効時は折り返さず 1 行に収める。
   */
  fullWidth?: boolean
}

/**
 * Web 版（`src/components/ui/pill-toggle.tsx`、`Tabs variant="pill"` 基盤）に
 * 見た目・a11y を揃える（issue #608）。コンテナは Surface-Tertiary の面、選択中の
 * 項目だけ Surface-Primary + shadow-sm で浮かせる。各項目は `accessibilityRole="button"`
 * と選択/無効状態を既定で持つ（呼び出し側の明示値があればそちらを優先する —
 * 「インタラクティブな部品は a11y 既定値を自分で持つ」方針。CLAUDE.md 参照）。
 */
export function PillToggle({
  options,
  value,
  onChange,
  disabled = false,
  fullWidth = false,
}: PillToggleProps) {
  const { theme, scales } = useTheme()

  // Web の shadow-sm 相当（Card.tsx の getIosShadow と同じ値を踏襲）。
  const selectedShadow = Platform.select<ViewStyle>({
    web: { boxShadow: scales.shadows.sm.boxShadow },
    ios: {
      shadowColor: theme.overlay.dark,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    default: { elevation: scales.shadows.sm.elevation },
  })

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: fullWidth ? "nowrap" : "wrap",
        alignSelf: fullWidth ? "stretch" : "flex-start",
        gap: scales.spacing.scale[1],
        padding: scales.spacing.scale[1],
        borderRadius: scales.borderRadius.full,
        backgroundColor: theme.surface.tertiary,
      }}
    >
      {options.map((o) => {
        const selected = value === o.value
        return (
          <Pressable
            key={o.value}
            onPress={() => !disabled && onChange?.(o.value)}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityState={{ selected, disabled }}
            hitSlop={{ top: scales.spacing.scale[1], bottom: scales.spacing.scale[1] }}
            style={({ pressed }) => [
              {
                flexDirection: "row",
                alignItems: "center",
                ...(fullWidth ? { flex: 1, justifyContent: "center" as const, minWidth: 0 } : null),
                gap: scales.spacing.scale[1],
                paddingHorizontal: scales.spacing.scale[3],
                height: 36,
                borderRadius: scales.borderRadius.full,
                backgroundColor: selected
                  ? theme.surface.primary
                  : pressed
                  ? theme.active["secondary-button"]
                  : "transparent",
                opacity: disabled ? 0.5 : 1,
              },
              selected ? selectedShadow : null,
            ]}
          >
            <RNText
              // fullWidth では枠幅がラベル長で決まらないため、1行に固定して省略記号で畳む
              numberOfLines={fullWidth ? 1 : undefined}
              ellipsizeMode={fullWidth ? "tail" : undefined}
              style={[
                resolveTypo("label.sm"),
                {
                  color: selected ? theme.text["high-emphasis"] : theme.text["medium-emphasis"],
                  fontWeight: selected ? "700" : "500",
                },
              ]}
            >
              {o.label}
            </RNText>
            {o.count !== undefined && (
              // 選択中は項目面が surface.primary になるため、バッジは surface.secondary で
              // 一段差をつける。非選択は項目が transparent でコンテナの surface.tertiary が
              // そのまま見えるため、バッジは surface.primary で浮かせる（常に項目面の
              // 反対側の面を使うことで、どちらの状態でも埋没しないようにする）。
              <View
                style={{
                  paddingHorizontal: 6,
                  borderRadius: 999,
                  backgroundColor: selected ? theme.surface.secondary : theme.surface.primary,
                  minWidth: 20,
                  alignItems: "center",
                }}
              >
                <RNText
                  style={[
                    resolveTypo("label.xs"),
                    { color: selected ? theme.text["high-emphasis"] : theme.text["medium-emphasis"] },
                  ]}
                >
                  {o.count}
                </RNText>
              </View>
            )}
          </Pressable>
        )
      })}
    </View>
  )
}
