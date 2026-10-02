import React from "react"
import { View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export type AlertTone = "info" | "success" | "warning" | "caution"

export type AlertVariant = "inline-info" | "inline-warning" | "inline-caution"

export interface AlertProps {
  /**
   * Borderless inline presentation, matching the Web Alert variants. Overrides tone.
   * tone だけを指定した場合も、対応する inline variant と同じ帯なし表示になる
   * （info→inline-info / warning→inline-warning / caution→inline-caution）。
   * 対応する inline variant が無い success は、同じ tone の色付き背景（帯なし・枠なし）で描く。
   */
  variant?: AlertVariant
  /**
   * tone だけ指定したときの見た目は、常に対応する inline variant と同一（左端の色帯・枠線は出ない）。
   * - info → inline-info と同じ Surface-Tertiary 背景 + High/Medium-Emphasis テキスト
   * - warning → inline-warning と同じ Surface-Warning 背景 + Text-Warning
   * - caution → inline-caution と同じ Surface-Caution 背景 + Text-Caution
   * - success → 対応する inline variant が無いため、Surface-Success 背景 + Text-Success（帯・枠なし）
   */
  tone?: AlertTone
  title?: string
  description?: string
  children?: React.ReactNode
}

export function Alert({ tone = "info", variant, title, description, children }: AlertProps) {
  const { theme, scales } = useTheme()
  const effectiveTone = variant ? variant.replace("inline-", "") as AlertTone : tone
  const palette = {
    info: { bg: theme.surface.info, fg: theme.text.info },
    success: { bg: theme.surface.success, fg: theme.text.success },
    warning: { bg: theme.surface.warning, fg: theme.text.warning },
    caution: { bg: theme.surface.caution, fg: theme.text.caution },
  }[effectiveTone]
  // info は Web の inline-info と同じ Surface-Tertiary 背景 + High/Medium-Emphasis テキストで描く。
  // success はこれに相当する inline variant が無いため、tone の色付き背景のまま帯・枠だけを外す。
  const isInfo = effectiveTone === "info"

  return (
    <View
      style={{
        backgroundColor: isInfo ? theme.surface.tertiary : palette.bg,
        borderRadius: scales.borderRadius.sm,
        paddingHorizontal: scales.spacing.scale[3],
        paddingVertical: scales.spacing.scale[2],
        gap: scales.spacing.scale[1],
      }}
    >
      {title && (
        <RNText style={[resolveTypo("label.md"), { color: isInfo ? theme.text["high-emphasis"] : palette.fg }]}>{title}</RNText>
      )}
      {description && (
        <RNText style={[resolveTypo("body.sm"), { color: isInfo ? theme.text["medium-emphasis"] : palette.fg }]}>
          {description}
        </RNText>
      )}
      {children}
    </View>
  )
}
