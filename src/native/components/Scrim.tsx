import React from "react"
import { View, Pressable, type StyleProp, type ViewStyle } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import {
  resolveScrimAlignment,
  resolveScrimContentStyle,
  type ScrimAlign,
} from "../scrim-layout"

export type { ScrimAlign }

export interface ScrimProps {
  /**
   * 背景タップで呼ばれる。未指定なら押下面を描かない
   * （背面へのタッチは塞いだまま＝閉じられないスクリム）。
   */
  onPress?: () => void
  /** 押下面の読み上げ名。既定「閉じる」。 */
  accessibilityLabel?: string
  /** スクリムの上に置くパネル。背景・padding・maxWidth は一切強制しない。 */
  children?: React.ReactNode
  /**
   * 子の寄せ方。既定 "center"（Dialog と同じ中央寄せ）。
   * "stretch" は子を全面へ伸ばす。細かいレイアウトは利用側が子の中で行う。
   */
  align?: ScrimAlign
  style?: StyleProp<ViewStyle>
  /** root に付く。押下面には `${testID}-backdrop` が付く。 */
  testID?: string
}

const ABSOLUTE_FILL = {
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
} as const satisfies ViewStyle

/**
 * RN Modal を生成しない単体のスクリム（issue #555）。
 *
 * 親の中で `absolute` 全面に敷く。Modal を作らないため、別の RN Modal の内側や
 * 画面内オーバーレイ（FeedbackOverlay 等）にそのまま重ねられる。
 * 濃さは Dialog の背景と同じ `theme.overlay.dark` トークンを使う。
 *
 * 構造は「root（素の View・背景と寄せだけ）＋ 押下面 Pressable ＋ children」の
 * **兄弟**並び。root を accessible にしないので、VoiceOver はパネル内の
 * ボタン・入力欄へ個別にフォーカスできる。children は押下面より後ろの兄弟＝
 * 前面に描かれるため、パネル上のタップは押下面へ届かない（吸収用の
 * ダミー Pressable は不要）。
 *
 * 背面を触らせたい（タッチを素通しさせたい）用途はこの部品の対象外。
 * スクリムは常に背面へのタッチを塞ぐ。
 */
export function Scrim({
  onPress,
  accessibilityLabel,
  children,
  align = "center",
  style,
  testID,
}: ScrimProps) {
  const { theme } = useTheme()
  const alignment = resolveScrimAlignment(align)
  const contentStyle = resolveScrimContentStyle(align)

  return (
    <View
      style={[
        {
          ...ABSOLUTE_FILL,
          // 背景色は root だけが持つ（押下面と二重に塗らない）
          backgroundColor: theme.overlay.dark,
          ...alignment,
        },
        style,
      ]}
      testID={testID}
    >
      {onPress ? (
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel ?? "閉じる"}
          style={ABSOLUTE_FILL}
          testID={testID ? `${testID}-backdrop` : undefined}
        />
      ) : null}
      {children ? (
        // パネル外側の余白のタップは押下面へ届かせる
        <View style={contentStyle} pointerEvents="box-none">
          {children}
        </View>
      ) : null}
    </View>
  )
}
