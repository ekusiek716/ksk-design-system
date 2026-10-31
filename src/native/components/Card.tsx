import React from "react"
import { Pressable, View, Platform, type ViewProps, type ViewStyle } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { webAriaFromState } from "../web-aria"

export interface CardProps extends ViewProps {
  /** spacing.scale のインデックス。既定 4 = 16px */
  padding?: number
  /**
   * shadow トークン名。web は boxShadow、iOS は shadow*、Android は elevation を適用。
   * 未指定・"none" は影なし（Web Card と同じ語彙。issue #689）。
   */
  elevation?: "none" | "sm" | "md" | "lg"
  /**
   * scales.borderRadius のキー。既定 "lg"（8px、web版 Card の rounded-[var(--Radius-Surface)] と同値）。
   * 既定を変えると全 consumer のカードの見た目が一斉に変わるため、既定は "lg" のまま据え置き、
   * 16px 等が欲しい呼び出し側は明示的に指定する（issue #332）。
   */
  radius?: "lg" | "xl" | "2xl"
  /**
   * 指定するとカード全体が押せるボタンになる（issue #665・Web の onClick / href と対）。
   * accessibilityRole="button"、押下中は surface.secondary の面 + 0.98 の縮小を DS が持つ。
   * 読み上げ名は accessibilityLabel（未指定なら子の Text を RN が連結して読む）。
   */
  onPress?: () => void
  /** 押せるときに操作を止める */
  disabled?: boolean
  /**
   * 選択中（issue #677・Web Card の selected と対）。surface.accent-primary-light の面 +
   * border.accent-primary の 2pt 枠。onPress のときは accessibilityState.selected を出す。
   */
  selected?: boolean
  children: React.ReactNode
}

const iosShadowMetrics: Record<Exclude<NonNullable<CardProps["elevation"]>, "none">, Omit<ViewStyle, "shadowColor">> = {
  sm: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  md: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  lg: {
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
  },
}

function getIosShadow(elevation: Exclude<NonNullable<CardProps["elevation"]>, "none">, shadowColor: string): ViewStyle {
  return {
    shadowColor,
    ...iosShadowMetrics[elevation],
  }
}

/** surface.primary 面 + border.low-emphasis の標準カード。 */
export function Card({ padding = 4, elevation, radius = "lg", style, children, onPress, disabled = false, selected, ...rest }: CardProps) {
  const { theme, scales } = useTheme()

  const shadow: ViewStyle | undefined = elevation && elevation !== "none"
    ? (Platform.select({
        web: { boxShadow: scales.shadows[elevation].boxShadow },
        ios: getIosShadow(elevation, theme.overlay.dark),
        default: { elevation: scales.shadows[elevation].elevation },
      }) as ViewStyle)
    : undefined

  const base: ViewStyle = {
    backgroundColor: theme.surface.primary,
    borderColor: theme.border["low-emphasis"],
    borderWidth: 1,
    borderRadius: scales.borderRadius[radius],
    padding: scales.spacing.scale[padding],
    gap: scales.spacing.scale[3],
  }
  const selectedStyle: ViewStyle | null = selected
    ? { backgroundColor: theme.surface["accent-primary-light"], borderColor: theme.border["accent-primary"], borderWidth: 2 }
    : null

  if (onPress) {
    const pressState = { disabled, ...(selected !== undefined ? { selected } : {}) }
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={pressState}
        // react-native-web は accessibilityState を aria-* に変換しないため併記する（issue #808）。
        // Web の Card と同じく、押せる Card の selected は aria-pressed。
        // 後ろの {...rest} が accessibilityRole / accessibilityState を上書きしうるため、
        // aria-* も実際に効く方（上書き後）の role / state から作る（role=radio なら aria-checked）。
        {...webAriaFromState(rest.accessibilityRole ?? "button", rest.accessibilityState ?? pressState)}
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          base,
          shadow,
          selectedStyle,
          pressed && !disabled && !selected ? { backgroundColor: theme.surface.secondary, transform: [{ scale: 0.98 }] } : null,
          disabled ? { opacity: 0.5 } : null,
          style,
        ]}
        {...rest}
      >
        {children}
      </Pressable>
    )
  }

  return (
    <View
      style={[
        {
          backgroundColor: theme.surface.primary,
          borderColor: theme.border["low-emphasis"],
          borderWidth: 1,
          borderRadius: scales.borderRadius[radius],
          padding: scales.spacing.scale[padding],
          gap: scales.spacing.scale[3],
        },
        shadow,
        selectedStyle,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  )
}
