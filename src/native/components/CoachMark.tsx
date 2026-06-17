import React from "react"
import { View, Pressable, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

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

/**
 * Tooltip 風の説明バルーン（Radix Popover の TourGuide パターン参考）。
 * CoachMarkOverlay と組み合わせて使う前提。
 * - ステップは dot indicator（1/3 等の表記より視覚的）
 * - アクションは小さめの pill ボタンを内製（DS Button は CTA 用で大きすぎるため）
 */
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
        borderRadius: scales.borderRadius.xl,
        paddingVertical: scales.spacing.scale[4],
        paddingHorizontal: scales.spacing.scale[5],
        maxWidth: 320,
        shadowColor: theme.overlay.dark,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.24,
        shadowRadius: 16,
        elevation: 8,
      }}
    >
      {title && (
        <RNText
          style={[
            resolveTypo("label.lg"),
            {
              color: theme.text["on-inverse"],
              marginBottom: scales.spacing.scale[1],
            },
          ]}
        >
          {title}
        </RNText>
      )}
      <RNText
        style={[
          resolveTypo("body.md"),
          {
            color: theme.text["on-inverse-secondary"],
            marginBottom: scales.spacing.scale[4],
          },
        ]}
      >
        {description}
      </RNText>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: scales.spacing.scale[3],
        }}
      >
        {/* ステップ表示は dot indicator（アクティブが伸びる pill） */}
        {step !== undefined && total !== undefined ? (
          <View style={{ flexDirection: "row", gap: scales.spacing.scale[1], alignItems: "center" }}>
            {Array.from({ length: total }).map((_, i) => {
              const active = i + 1 === step
              return (
                <View
                  key={i}
                  style={{
                    width: active ? 18 : 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: active
                      ? theme.brand.primary
                      : theme.text["on-inverse-secondary"],
                    opacity: active ? 1 : 0.4,
                  }}
                />
              )
            })}
          </View>
        ) : (
          <View />
        )}
        <View style={{ flexDirection: "row", gap: scales.spacing.scale[1], alignItems: "center" }}>
          {onSkip && (
            <Pressable
              onPress={onSkip}
              hitSlop={6}
              style={({ pressed }) => ({
                paddingVertical: scales.spacing.scale[2],
                paddingHorizontal: scales.spacing.scale[3],
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <RNText
                style={[
                  resolveTypo("label.md"),
                  { color: theme.text["on-inverse-secondary"] },
                ]}
              >
                {skipLabel}
              </RNText>
            </Pressable>
          )}
          {onNext && (
            <Pressable
              onPress={onNext}
              style={({ pressed }) => ({
                paddingVertical: scales.spacing.scale[2],
                paddingHorizontal: scales.spacing.scale[4],
                borderRadius: scales.borderRadius.full,
                backgroundColor: pressed ? theme.active["primary-button"] : theme.brand.primary,
              })}
            >
              <RNText
                style={[
                  resolveTypo("label.md"),
                  { color: theme.text["on-inverse"] },
                ]}
              >
                {nextLabel}
              </RNText>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  )
}
