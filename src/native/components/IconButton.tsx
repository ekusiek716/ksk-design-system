import React from "react"
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native"

import { useTheme } from "../theme/ThemeProvider"
import { resolveIconButtonMetrics, type IconButtonSize } from "../icon-button-metrics"

/**
 * 見た目のバリアント。名前は DS の Button 語彙に合わせている
 * （`primary` / `tertiary` は native `Button` の同名 variant と同じ見た目、
 * `ghost` は Web `Button` の同名 variant に対応）。
 * - `ghost`     : 背景・境界なし（既定）。カード右上の「×」やヘッダの戻る等、地の上に置く場合。
 * - `tertiary`  : 薄いサーフェス背景。ヘッダの設定ギア等、地と分離したい場合。
 * - `outline`   : 背景なし + 境界線。境界色は tone に従う。
 * - `primary`   : ブランド色の塗り。円形の主要アクション（FAB 相当ではない小型のもの）。
 */
export type IconButtonVariant = "ghost" | "tertiary" | "outline" | "primary"

/** アイコン・境界の色味。`primary`（塗り）では常に on-inverse なので無視される。 */
export type IconButtonTone = "neutral" | "accent" | "caution"

/**
 * 視覚サイズ。実タップ領域は hitSlop で常に 44pt 以上を確保する
 * （WCAG 2.5.5 / Apple HIG。tokens.json の touchTargets.iconButton）。
 * 寸法の解決は `src/native/icon-button-metrics.ts` が正本。
 */
export type { IconButtonSize }

export type IconButtonShape = "circle" | "square"

export interface IconButtonRenderProps {
  color: string
  size: number
}

export interface IconButtonProps
  extends Omit<PressableProps, "children" | "style" | "accessibilityLabel"> {
  /**
   * 読み上げラベル。アイコンのみのボタンはテキストを持たないため必須。
   * （Web 側の `<Button size="icon">` が aria-label 必須なのと同じ規約）
   */
  accessibilityLabel: string
  /**
   * アイコン。関数を渡すと variant/tone/size から解決した色とサイズを受け取れるので、
   * consumer 側で色をハードコードしなくて済む。
   */
  icon: React.ReactNode | ((props: IconButtonRenderProps) => React.ReactNode)
  variant?: IconButtonVariant
  tone?: IconButtonTone
  size?: IconButtonSize
  shape?: IconButtonShape
  /** true で spinner を表示し、busy かつ disabled として扱う。 */
  loading?: boolean
  /** コンテナ style の上書きポイント（DS の標準を保ちつつ微調整したい時）。 */
  containerStyle?: StyleProp<ViewStyle>
  /** 押下時 style の上書きポイント。 */
  pressedContainerStyle?: StyleProp<ViewStyle>
}

/**
 * IconButton — タップ可能な円形/角丸のアイコンボタン（issue #298③）。
 *
 * `IconBadge` は装飾専用（非タップ）なので、押せるアイコンにはこちらを使う。
 * Web 側の相当物は `<Button size="icon" variant="...">`。
 *
 * ```tsx
 * <IconButton
 *   accessibilityLabel="設定"
 *   variant="tertiary"
 *   size="sm"
 *   icon={({ color, size }) => <Setting color={color} size={size} />}
 *   onPress={openSettings}
 * />
 * ```
 */
export function IconButton({
  accessibilityLabel,
  icon,
  variant = "ghost",
  tone = "neutral",
  size = "md",
  shape = "circle",
  loading = false,
  containerStyle,
  pressedContainerStyle,
  disabled,
  accessibilityRole,
  accessibilityState,
  hitSlop,
  ...rest
}: IconButtonProps) {
  const { theme, scales } = useTheme()
  const effectiveDisabled = disabled || loading
  const {
    box,
    icon: iconSize,
    hitSlop: fallbackHitSlop,
  } = resolveIconButtonMetrics(size, scales.touchTargets.iconButton.min)

  const toneColor =
    tone === "accent"
      ? theme.text["accent-primary"]
      : tone === "caution"
        ? theme.text.caution
        : theme.text["medium-emphasis"]

  const surface: {
    backgroundColor: string
    pressedBackgroundColor: string
    borderColor: string
    borderWidth: number
    foreground: string
  } =
    variant === "primary"
      ? {
          backgroundColor: theme.brand.primary,
          pressedBackgroundColor: theme.active["primary-button"],
          borderColor: theme.brand.primary,
          borderWidth: 1,
          foreground: theme.text["on-inverse"],
        }
      : variant === "tertiary"
        ? {
            backgroundColor: theme.surface.secondary,
            pressedBackgroundColor: theme.active["tertiary-button"],
            borderColor: "transparent",
            borderWidth: 0,
            foreground: toneColor,
          }
        : variant === "outline"
          ? {
              backgroundColor: theme.surface.primary,
              pressedBackgroundColor: theme.surface.secondary,
              borderColor:
                tone === "accent"
                  ? theme.border["accent-primary"]
                  : tone === "caution"
                    ? theme.border.caution
                    : theme.border["low-emphasis"],
              borderWidth: 1,
              foreground: toneColor,
            }
          : {
              backgroundColor: "transparent",
              pressedBackgroundColor: theme.surface.secondary,
              borderColor: "transparent",
              borderWidth: 0,
              foreground: toneColor,
            }

  return (
    <Pressable
      disabled={effectiveDisabled}
      accessibilityRole={accessibilityRole ?? "button"}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{
        disabled: Boolean(effectiveDisabled),
        busy: loading || undefined,
        ...accessibilityState,
      }}
      hitSlop={hitSlop ?? fallbackHitSlop}
      style={({ pressed }) => [
        {
          width: box,
          height: box,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: shape === "circle" ? box / 2 : scales.borderRadius.lg,
          borderWidth: surface.borderWidth,
          borderColor: surface.borderColor,
          backgroundColor:
            pressed && !effectiveDisabled
              ? surface.pressedBackgroundColor
              : surface.backgroundColor,
          opacity: effectiveDisabled ? 0.56 : 1,
        },
        containerStyle,
        pressed && !effectiveDisabled && pressedContainerStyle,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={surface.foreground} />
      ) : typeof icon === "function" ? (
        icon({ color: surface.foreground, size: iconSize })
      ) : (
        icon
      )}
    </Pressable>
  )
}
