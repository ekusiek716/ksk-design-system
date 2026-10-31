import React from "react"
import {
  ActivityIndicator,
  Pressable,
  Text as RNText,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { resolveRaisedElevationStyle } from "../button-elevation"
import { GlassView } from "./GlassView"
import { glassInnerNeedsGrow, resolveGlassHitSlop, splitGlassContainerStyle } from "../button-glass-style"

/**
 * - `ghost-neutral`: 背景も枠も無い灰色（text.medium-emphasis）の文字ボタン。スキップ・あとで・
 *   閉じるなど、押してほしくない補助・離脱の操作（issue #664・Web の同名 variant と対）。
 * - `ghost-destructive` / `ghost-success`: 文字だけの弱い赤 / 緑ボタン（issue #671）。確認を挟む
 *   削除の 1 段目・取り消しは ghost-destructive、確認側の最終ボタンは destructive。
 */
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "destructive"
  | "ghost-neutral"
  | "ghost-destructive"
  | "ghost-success"
  | "glass"

/**
 * elevation トークン（scales.elevation）:
 *   - flat   : 標準（border なし、押下時 transform なし）
 *   - raised : 下辺に濃い border + 押下で translateY して沈む 3D 風（Duolingo / Material You で一般的）
 *
 * 下辺色は variant の active-button トークンを自動で使う（ハードコード無し）。
 */
export type ButtonElevation = "flat" | "raised"

export interface ButtonProps extends Omit<PressableProps, "children" | "style"> {
  variant?: ButtonVariant
  /** 立体感。default 'flat'。トークン scales.elevation で量を管理 */
  elevation?: ButtonElevation
  /**
   * コンテナの style を上書きするポイント（DS の標準を保持しつつ微調整したい時）。
   *
   * `variant="glass"` では外側（押せる範囲・角丸のクリップ）と内側（ぼかし面）に振り分けて反映する
   * （issue #754）: padding 系は内側の余白、それ以外（width / height / minHeight / margin 等）は外側、
   * borderRadius は両方。`height` だけ渡したときは既定の最小高さ 44 を外すので、丸く小さい補助ボタンは
   * `{ width: 40, height: 40, paddingHorizontal: 0, borderRadius: 20 }` で作れる。見た目が 44 未満の
   * 数値 width / height / minWidth / minHeight には、実タップ領域が 44 以上になるよう `hitSlop` を自動で足す
   * （`hitSlop` を渡せばそちらが優先）。
   * 注意: `padding: 0` だけでは既定の左右余白（paddingHorizontal: 20）は消えない。消すなら `paddingHorizontal` も指定する。
   */
  containerStyle?: StyleProp<ViewStyle>
  /** 押下時の style を上書きするポイント（glass では containerStyle と同じ振り分け・押下中かつ非 disabled のとき） */
  pressedContainerStyle?: StyleProp<ViewStyle>
  /** 内部 Text の style を上書きするポイント */
  textStyle?: StyleProp<TextStyle>
  /** leading icon slot. children は text または ReactNode のどちらでも可 */
  leadingIcon?: React.ReactNode
  /** trailing icon slot. children は text または ReactNode のどちらでも可 */
  trailingIcon?: React.ReactNode
  /** loading=true で spinner を表示し、button を busy/disabled として扱う */
  loading?: boolean
  /** loading 中も読み上げ/表示したい label。未指定なら spinner のみ */
  loadingLabel?: string
  /**
   * loading 中の ActivityIndicator の色。未指定時は既定どおり variant の
   * 文字色（palette[variant].fg / glass の fg）を使う（挙動不変・issue #450）。
   * variant 背景色そのものでスピナーを塗りたい等、稀なケース向けの明示上書き口。
   */
  spinnerColor?: string
  children?: React.ReactNode
}

/** variant を semantic トークン（brand / active / caution / border）で表現するボタン。 */
export function Button({
  variant = "primary",
  elevation = "flat",
  containerStyle,
  pressedContainerStyle,
  textStyle,
  leadingIcon,
  trailingIcon,
  loading = false,
  loadingLabel,
  spinnerColor,
  children,
  disabled,
  accessibilityRole,
  accessibilityState,
  ...rest
}: ButtonProps) {
  const { theme, scales, mode } = useTheme()
  const effectiveDisabled = disabled || loading

  const palette: Record<
    Exclude<ButtonVariant, "glass">,
    { bg: string; bgActive: string; fg: string; border: string; bottomBorder: string }
  > = {
    primary: {
      bg: theme.brand.primary,
      bgActive: theme.active["primary-button"],
      fg: theme.text["on-inverse"],
      border: theme.brand.primary,
      bottomBorder: theme.active["primary-button"],
    },
    secondary: {
      bg: theme.surface["accent-primary-light"],
      bgActive: theme.active["secondary-button"],
      // Dark accent text fails 4.5:1 on the secondary surface/pressed fill (#537).
      fg: mode === "dark" ? theme.text["high-emphasis"] : theme.text["accent-primary"],
      border: theme.border["accent-primary"],
      bottomBorder: theme.active["secondary-button"],
    },
    tertiary: {
      bg: theme.surface.secondary,
      bgActive: theme.active["tertiary-button"],
      fg: theme.text["high-emphasis"],
      border: theme.border["low-emphasis"],
      bottomBorder: theme.active["tertiary-button"],
    },
    destructive: {
      bg: theme.caution.base,
      bgActive: theme.caution.action,
      fg: theme.text["on-inverse"],
      border: theme.caution.base,
      bottomBorder: theme.caution.action,
    },
    // 文字だけの弱いボタン（issue #664 / #671）。面と枠は透明で、押下中だけ淡い面を出す
    // （Web の hover と同じトークン）。文字色は light / dark とも AA（scripts/check-contrast.mjs）。
    "ghost-neutral": {
      bg: "transparent",
      bgActive: theme.hover["ghost-button"],
      fg: theme.text["medium-emphasis"],
      border: "transparent",
      bottomBorder: "transparent",
    },
    "ghost-destructive": {
      bg: "transparent",
      bgActive: theme.surface.caution,
      fg: theme.text.caution,
      border: "transparent",
      bottomBorder: "transparent",
    },
    "ghost-success": {
      bg: "transparent",
      bgActive: theme.surface.success,
      fg: theme.text.success,
      border: "transparent",
      bottomBorder: "transparent",
    },
  }

  // ── glass variant ──
  // iOS 26 Liquid Glass を消費する装飾系ボタン。背景が暗い画像/ヒーロー上で使う想定。
  if (variant === "glass") {
    const fg = mode === "dark" ? theme.text["high-emphasis"] : theme.text["high-emphasis"]
    const minTarget = scales.touchTargets.buttonCTA.min
    // containerStyle / pressedContainerStyle は外側 Pressable と内側 GlassView に振り分ける（issue #754・
    // 振り分けの規則は button-glass-style.ts）。非 glass と同じく pressed 側は押下中かつ非 disabled のときだけ当てる。
    const resolveGlassStyles = (pressed: boolean) => {
      const base = splitGlassContainerStyle(containerStyle)
      const press = pressed && !effectiveDisabled ? splitGlassContainerStyle(pressedContainerStyle) : { outer: {}, inner: {} }
      const outer: ViewStyle = { ...base.outer, ...press.outer }
      const inner: ViewStyle = { ...base.inner, ...press.inner }
      // height だけ渡された（例: 40×40 の丸）ときに既定 minHeight 44 が height を押し上げないよう、
      // minHeight は consumer が minHeight か height を指定したときだけ既定を外す
      const minHeight = outer.minHeight ?? (outer.height === undefined ? minTarget : undefined)
      const radius = typeof outer.borderRadius === "number" ? outer.borderRadius : scales.borderRadius.full
      return { outer, inner, minHeight, radius }
    }
    const resting = resolveGlassStyles(false)
    const hitSlop = resolveGlassHitSlop({ ...resting.outer, minHeight: resting.minHeight }, minTarget)
    return (
      <Pressable
        disabled={effectiveDisabled}
        // 役割は部品が既定で持ち、呼び出し側の明示が優先（issue #800・IconButton / Chip と同じ）
        accessibilityRole={accessibilityRole ?? "button"}
        accessibilityState={{ ...accessibilityState, disabled: effectiveDisabled, busy: loading || undefined }}
        hitSlop={hitSlop}
        style={({ pressed }) => {
          const r = resolveGlassStyles(pressed)
          return {
            borderRadius: scales.borderRadius.full,
            overflow: "hidden",
            opacity: effectiveDisabled ? 0.56 : 1,
            ...r.outer,
            minHeight: r.minHeight,
          }
        }}
        {...rest}
      >
        {({ pressed }) => {
          const r = resolveGlassStyles(pressed)
          return (
            <GlassView
              intensity="regular"
              borderRadius={r.radius}
              style={{
                minHeight: r.minHeight,
                paddingHorizontal: scales.spacing.scale[5],
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                gap: scales.spacing.scale[2],
                // 外側の寸法を containerStyle が決めているときだけ、内側のぼかし面も埋める
                // （常に付けると、横並び + stretch の親で既定の glass が行の高さまで伸びる）
                ...(glassInnerNeedsGrow(r.outer) ? { flexGrow: 1 } : null),
                ...r.inner,
                transform: [{ scale: pressed ? 0.96 : 1 }],
              }}
            >
              <ButtonContent
                color={fg}
                textStyle={textStyle}
                loading={loading}
                loadingLabel={loadingLabel}
                spinnerColor={spinnerColor}
                leadingIcon={leadingIcon}
                trailingIcon={trailingIcon}
                gap={scales.spacing.scale[2]}
              >
                {children}
              </ButtonContent>
            </GlassView>
          )
        }}
      </Pressable>
    )
  }

  const p = palette[variant]
  const elev = scales.elevation[elevation]

  return (
    <Pressable
      disabled={effectiveDisabled}
      accessibilityRole={accessibilityRole ?? "button"}
      accessibilityState={{ ...accessibilityState, disabled: effectiveDisabled, busy: loading || undefined }}
      style={({ pressed }) => [
        {
          minHeight: scales.touchTargets.buttonCTA.min,
          paddingHorizontal: scales.spacing.scale[5],
          justifyContent: "center",
          alignItems: "center",
          borderRadius: scales.borderRadius.lg,
          borderWidth: 1,
          backgroundColor: pressed && !effectiveDisabled ? p.bgActive : p.bg,
          borderColor: p.border,
          opacity: effectiveDisabled ? 0.56 : 1,
        },
        // raised: 下辺に厚みのある border を載せ、押下時は translateY で沈める。
        // 下辺の太さは押下前後で不変（詳細は button-elevation.ts）。
        elevation === "raised" &&
          resolveRaisedElevationStyle({
            pressed,
            disabled: effectiveDisabled,
            bottomBorderWidth: elev.bottomBorderWidth,
            offset: elev.offset,
            bottomBorderColor: p.bottomBorder,
          }),
        containerStyle,
        pressed && !effectiveDisabled && pressedContainerStyle,
      ]}
      {...rest}
    >
      <ButtonContent
        color={p.fg}
        textStyle={textStyle}
        loading={loading}
        loadingLabel={loadingLabel}
        spinnerColor={spinnerColor}
        leadingIcon={leadingIcon}
        trailingIcon={trailingIcon}
        gap={scales.spacing.scale[2]}
      >
        {children}
      </ButtonContent>
    </Pressable>
  )
}

function ButtonContent({
  color,
  textStyle,
  loading,
  loadingLabel,
  spinnerColor,
  leadingIcon,
  trailingIcon,
  gap,
  children,
}: {
  color: string
  textStyle?: StyleProp<TextStyle>
  loading: boolean
  loadingLabel?: string
  spinnerColor?: string
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
  gap: number
  children?: React.ReactNode
}) {
  const labelStyle = [resolveTypo("label.md"), { color }, textStyle]

  if (loading) {
    return (
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap }}>
        <ActivityIndicator size="small" color={spinnerColor ?? color} />
        {loadingLabel ? <RNText style={labelStyle}>{loadingLabel}</RNText> : null}
      </View>
    )
  }

  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap }}>
      {leadingIcon}
      {renderButtonChildren(children, labelStyle)}
      {trailingIcon}
    </View>
  )
}

function renderButtonChildren(children: React.ReactNode, labelStyle: StyleProp<TextStyle>) {
  return React.Children.map(children, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      return <RNText style={labelStyle}>{child}</RNText>
    }
    return child
  })
}
