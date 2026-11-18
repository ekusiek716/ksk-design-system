import React from "react"
import { Platform, Pressable, View, Text as RNText, useWindowDimensions, type ViewStyle } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { webAriaFromState } from "../web-aria"
import { resolveTypo } from "../typography"
import { PILL_TOGGLE_ITEM_MIN_HEIGHT, shouldStackPillToggle } from "../pill-toggle-layout"

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
   * Web の `fullWidth` と同じ意味（issue #500）。枠に収まらないラベルは省略せず折り返し、
   * 項目の高さを伸ばす（issue #861。Web は省略記号で畳む）。
   */
  fullWidth?: boolean
}

/**
 * Web 版（`src/components/ui/pill-toggle.tsx`、`Tabs variant="pill"` 基盤）に
 * 見た目・a11y を揃える（issue #608）。コンテナは切り替え専用の面 `surface["pill-track"]`、
 * 選択中の項目だけ `surface["pill-selected"]` + shadow-sm で浮かせる（dark で選んだ側が外枠より
 * 暗くならないよう専用の面を使う。issue #863）。各項目は `accessibilityRole="button"`
 * と選択/無効状態を既定で持つ（呼び出し側の明示値があればそちらを優先する —
 * 「インタラクティブな部品は a11y 既定値を自分で持つ」方針。CLAUDE.md 参照）。
 *
 * ### 文字の大きさ（issue #861）
 * 項目の高さは 36 を下限に、文字に合わせて伸びる（ラベルは省略せず折り返す）。
 * OS の文字の倍率で 1 行が 36 を超える大きさ（label.sm の行の高さ 18 × 倍率 > 36。
 * iOS ならアクセシビリティの「大」以上）では、横に並べず縦に積む形へ自動で切り替える。
 */
export function PillToggle({
  options,
  value,
  onChange,
  disabled = false,
  fullWidth = false,
}: PillToggleProps) {
  const { theme, scales } = useTheme()
  // 倍率は OS の設定（useWindowDimensions）で見る。ラベルは allowFontScaling 既定（true）・上限なしで描くので、
  // アプリ全体で Text の拡大を止めている consumer では、文字は大きくならずに縦に積むだけになる
  const { fontScale } = useWindowDimensions()
  const labelTypo = resolveTypo("label.sm")
  // 縦に積む形: 横並びのまま文字だけ大きくすると、項目が潰れて 1〜2 文字ごとに折り返すか重なる
  const stacked = shouldStackPillToggle(fontScale, labelTypo.lineHeight ?? 18)
  // 縦に積むと項目が横長の大きな面になるので、全丸（full）だと角の文字が欠けて見える。
  // コンテナは xl、項目はその内側（padding 4 ぶん小さい lg）で同心の角丸にする
  const containerRadius = stacked ? scales.borderRadius.xl : scales.borderRadius.full
  const itemRadius = stacked ? scales.borderRadius.lg : scales.borderRadius.full

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

  // 項目の幅の決め方。縦: 横幅いっぱい / fullWidth: 等幅 / それ以外: ラベル幅（行より長いときは
  // 行の幅まで縮めて折り返す。RN の flexShrink 既定は 0 なので明示しないと横にはみ出す。
  // flexWrap の行ごとに Yoga が縮めるので、% の maxWidth は要らない）
  const itemSizing: ViewStyle = stacked
    ? { alignSelf: "stretch" }
    : fullWidth
    ? { flex: 1, minWidth: 0 }
    : { flexShrink: 1 }

  return (
    <View
      style={{
        flexDirection: stacked ? "column" : "row",
        flexWrap: stacked || fullWidth ? "nowrap" : "wrap",
        alignSelf: stacked || fullWidth ? "stretch" : "flex-start",
        gap: scales.spacing.scale[1],
        padding: scales.spacing.scale[1],
        borderRadius: containerRadius,
        backgroundColor: theme.surface["pill-track"],
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
            // react-native-web は accessibilityState を aria-* に変換しないため併記する（issue #808）
            {...webAriaFromState("button", { selected, disabled })}
            // 見た目 36 + 上下 4 で当たり判定 44。縦に積む大きさでは項目自体が 44 を超えるので、
            // 隣の項目の当たり判定と重ならないよう広げない
            hitSlop={stacked ? undefined : { top: scales.spacing.scale[1], bottom: scales.spacing.scale[1] }}
            style={({ pressed }) => [
              {
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                ...itemSizing,
                gap: scales.spacing.scale[1],
                paddingHorizontal: scales.spacing.scale[3],
                // 高さは固定しない。文字が大きいときは上下の余白を保ったまま伸びる（issue #861）
                paddingVertical: scales.spacing.scale[1],
                minHeight: PILL_TOGGLE_ITEM_MIN_HEIGHT,
                borderRadius: itemRadius,
                backgroundColor: selected
                  ? theme.surface["pill-selected"]
                  : pressed
                  ? theme.active["secondary-button"]
                  : "transparent",
                opacity: disabled ? 0.5 : 1,
              },
              selected ? selectedShadow : null,
            ]}
          >
            <RNText
              // 省略しない（旧: fullWidth で numberOfLines=1 + 末尾の省略記号にしていたため、
              // 大きな文字で「ぴっ…」のように何の選択肢か読めなくなった。issue #861）。
              // flexShrink で項目の幅に収め、収まらない分は折り返す
              style={[
                labelTypo,
                {
                  flexShrink: 1,
                  textAlign: "center",
                  color: selected ? theme.text["high-emphasis"] : theme.text["medium-emphasis"],
                  fontWeight: selected ? "700" : "500",
                },
              ]}
            >
              {o.label}
            </RNText>
            {o.count !== undefined && (
              // 選択中は項目面が pill-selected になるため、バッジは surface.secondary で
              // 一段差をつける。非選択は項目が transparent でコンテナの pill-track が
              // そのまま見えるため、バッジは surface.primary で浮かせる（常に項目面と
              // 別の面を使うことで、どちらの状態でも埋没しないようにする）。
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
