import React from "react"
import { View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { Button } from "./Button"

export interface CoachMarkProps {
  title?: string
  description: string
  step?: number
  total?: number
  onNext?: () => void
  onSkip?: () => void
  nextLabel?: string
  skipLabel?: string
}

/** Tooltip 風の説明バルーン。CoachMarkOverlay と組み合わせて使う前提。 */
export function CoachMark({
  title,
  description,
  step,
  total,
  onNext,
  onSkip,
  nextLabel = "次へ",
  skipLabel = "スキップ",
}: CoachMarkProps) {
  const { theme, scales } = useTheme()
  return (
    <View
      style={{
        backgroundColor: theme.surface.inverse,
        borderRadius: scales.borderRadius.lg,
        padding: scales.spacing.scale[4],
        gap: scales.spacing.scale[2],
        maxWidth: 320,
        shadowColor: theme.overlay.dark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 6,
      }}
    >
      {title && (
        <RNText style={[resolveTypo("label.lg"), { color: theme.text["on-inverse"] }]}>
          {title}
        </RNText>
      )}
      <RNText style={[resolveTypo("body.sm"), { color: theme.text["on-inverse-secondary"] }]}>
        {description}
      </RNText>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: scales.spacing.scale[2],
        }}
      >
        {step !== undefined && total !== undefined ? (
          <RNText style={[resolveTypo("label.xs"), { color: theme.text["on-inverse-secondary"] }]}>
            {step}/{total}
          </RNText>
        ) : (
          <View />
        )}
        <View style={{ flexDirection: "row", gap: scales.spacing.scale[2] }}>
          {onSkip && (
            <View style={{ minWidth: 80 }}>
              <Button variant="tertiary" onPress={onSkip}>
                {skipLabel}
              </Button>
            </View>
          )}
          {onNext && (
            <View style={{ minWidth: 80 }}>
              <Button variant="primary" onPress={onNext}>
                {nextLabel}
              </Button>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}
