import React from "react"
import { View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface StepItem {
  key: string
  label: string
}

export interface ProgressStepsProps {
  steps: StepItem[]
  current: number
}

export function ProgressSteps({ steps, current }: ProgressStepsProps) {
  const { theme } = useTheme()
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 0 }}>
      {steps.map((s, i) => {
        const done = i < current
        const isCurrent = i === current
        const active = done || isCurrent
        return (
          <React.Fragment key={s.key}>
            <View style={{ alignItems: "center", flex: 1 }}>
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: active ? theme.brand.primary : theme.surface.tertiary,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 2,
                  borderColor: isCurrent ? theme.border["accent-primary"] : "transparent",
                }}
              >
                <RNText
                  style={[
                    resolveTypo("label.xs"),
                    { color: active ? theme.text["on-inverse"] : theme.text["medium-emphasis"], fontWeight: "700" },
                  ]}
                >
                  {done ? "✓" : i + 1}
                </RNText>
              </View>
              <RNText
                style={[
                  resolveTypo("label.xs"),
                  {
                    color: active ? theme.text["accent-primary"] : theme.text["medium-emphasis"],
                    marginTop: 4,
                    textAlign: "center",
                  },
                ]}
              >
                {s.label}
              </RNText>
            </View>
            {i < steps.length - 1 && (
              <View
                style={{
                  flex: 0.5,
                  height: 2,
                  backgroundColor: done ? theme.brand.primary : theme.border["low-emphasis"],
                  marginTop: 13,
                }}
              />
            )}
          </React.Fragment>
        )
      })}
    </View>
  )
}
