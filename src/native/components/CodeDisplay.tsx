import React from "react"
import { Platform, Text as RNText, View, type StyleProp, type ViewStyle } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { Button } from "./Button"

/** Web CodeDisplay と同じ語彙（issue #686） */
export type CodeDisplaySize = "md" | "lg"
export type CodeDisplayTone = "neutral" | "accent"

export interface CodeDisplayProps {
  /** 表示するコード */
  code: string
  /** コードの上に出す見出し（「招待コード」等） */
  label?: string
  /** md=heading.lg（既定）/ lg=heading.2xl */
  size?: CodeDisplaySize
  tone?: CodeDisplayTone
  /**
   * コピー処理（expo-clipboard 等）。RN コアにクリップボード API が無いため consumer が持つ。
   * 渡したときだけコピーボタンを出す。成功時は true を返す（または resolve する）と「コピーしました」を出す。
   */
  onCopy?: (code: string) => boolean | void | Promise<boolean | void>
  /** @default "コピー" */
  copyLabel?: string
  /** @default "コピーしました" */
  copiedLabel?: string
  /** 成功表示を戻すまでの ms。@default 2000 */
  feedbackDuration?: number
  style?: StyleProp<ViewStyle>
}

/** CodeDisplay — 英数字のコードを等幅・広めの字間で見せ、コピーする（issue #686・Web と対） */
export function CodeDisplay({
  code,
  label,
  size = "md",
  tone = "neutral",
  onCopy,
  copyLabel = "コピー",
  copiedLabel = "コピーしました",
  feedbackDuration = 2000,
  style,
}: CodeDisplayProps) {
  const { theme, scales } = useTheme()
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  const handleCopy = async () => {
    const ok = await onCopy?.(code)
    if (ok === false) return
    setCopied(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), feedbackDuration)
  }

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          gap: scales.spacing.scale[3],
          borderWidth: 1,
          borderRadius: scales.borderRadius.lg,
          paddingHorizontal: scales.spacing.scale[4],
          paddingVertical: scales.spacing.scale[3],
          borderColor: tone === "accent" ? theme.border["accent-primary"] : theme.border["low-emphasis"],
          backgroundColor: tone === "accent" ? theme.surface["accent-primary-light"] : theme.surface.secondary,
        },
        style,
      ]}
    >
      <View style={{ flex: 1, minWidth: 0 }}>
        {label ? (
          <RNText style={[resolveTypo("label.sm"), { color: theme.text["medium-emphasis"] }]}>{label}</RNText>
        ) : null}
        <RNText
          selectable
          accessibilityLabel={label ? `${label} ${code}` : code}
          style={[
            resolveTypo(size === "lg" ? "heading.2xl" : "heading.lg"),
            {
              color: theme.text["high-emphasis"],
              letterSpacing: 2,
              fontFamily: Platform.select({ ios: "Menlo", android: "monospace", default: "monospace" }),
            },
          ]}
        >
          {code}
        </RNText>
      </View>
      {onCopy ? (
        <Button variant="secondary" onPress={() => void handleCopy()} accessibilityLiveRegion="polite">
          {copied ? copiedLabel : copyLabel}
        </Button>
      ) : null}
    </View>
  )
}
