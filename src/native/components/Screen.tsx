import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Keyboard,
  Platform,
  ScrollView,
  TextInput,
  View,
  type HostInstance,
  type StyleProp,
  type ViewStyle,
} from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveFocusedInputScrollDelta, resolveKeyboardOverlap } from "../screen-keyboard"

export type ScreenPadding = "none" | "page"

export interface ScreenProps {
  children: React.ReactNode
  footer?: React.ReactNode
  header?: React.ReactNode
  scroll?: boolean
  padding?: ScreenPadding
  style?: StyleProp<ViewStyle>
  bodyStyle?: StyleProp<ViewStyle>
  headerStyle?: StyleProp<ViewStyle>
  footerStyle?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
  /**
   * scroll=true のとき、入力中の欄をソフトキーボード（と、その上に出る「完了」「次へ」の帯）に
   * 隠れない位置まで本文を送る。既定 true。scroll=false では何もしない（本文がスクロールしないため）。
   *
   * - iOS: 本文の ScrollView に `automaticallyAdjustKeyboardInsets` を付け、キーボードの高さぶん下の余白を足して
   *   カーソル位置まで送る。そのうえで、欄の下端がキーボード（帯を含む）の上端から spacing 24 以上離れるよう足りない分を送る。
   * - Android: edge-to-edge（RN 0.81+ / targetSdk 35+ で既定）ではキーボードで画面が縮まないため、
   *   本文とキーボードが重なる高さぶん本文の下に余白を足し、同じ位置まで送る。画面が縮む環境では重なりが 0 になり、足さない。
   * - 入力中の欄がこの Screen の本文の外（Sheet・Dialog・別画面）にあるときは送らない。
   *
   * 画面を KeyboardAvoidingView などで包み、アプリの側でキーボードを避けているときだけ false にする
   * （二重に送られて、キーボードの上に空白が出るのを防ぐ）。false にすると従来どおり何もしない。
   */
  avoidKeyboard?: boolean
}

function bodyPadding(padding: ScreenPadding, spacing: ReturnType<typeof useTheme>["scales"]["spacing"]) {
  if (padding === "none") return undefined
  return {
    paddingHorizontal: spacing.scale[6],
    paddingVertical: spacing.scale[6],
  }
}

// RN の ScrollView は getInnerViewRef（中身の View）を実装しているが、型定義に載っていない
type ScrollViewWithInnerView = ScrollView & { getInnerViewRef?: () => HostInstance | null }
// Keyboard の endCoordinates / metrics() のうち使う分（RN は KeyboardMetrics 型を export していない）
type KeyboardFrame = { screenY: number; height: number }

/**
 * 本文の ScrollView で、入力中の欄をキーボードの上へ送る（avoidKeyboard の中身）。
 * 計算は ../screen-keyboard（純関数）。ここではイベントの購読と測定・スクロールだけを行う。
 */
function useScreenKeyboardAvoidance(
  scrollRef: React.RefObject<ScrollView | null>,
  enabled: boolean,
  gap: number,
) {
  const active = enabled && (Platform.OS === "ios" || Platform.OS === "android")
  const isAndroid = Platform.OS === "android"
  // キーボード（上の帯を含む）の上端。出ていない・位置が分からないときは null
  const [keyboardTop, setKeyboardTop] = useState<number | null>(null)
  const keyboardTopRef = useRef<number | null>(null)
  // Android: 本文の下端がキーボードに潜っている高さ（iOS は automaticallyAdjustKeyboardInsets が持つので使わない）
  const [overlap, setOverlap] = useState(0)
  const frameRef = useRef<number | null>(null)

  const measureOverlap = useCallback(() => {
    const top = keyboardTopRef.current
    const host = scrollRef.current?.getNativeScrollRef?.()
    if (!isAndroid || top == null || !host) return
    host.measureInWindow((_x, y, _width, height) => {
      if (keyboardTopRef.current !== top) return
      setOverlap(resolveKeyboardOverlap({ y, height }, top))
    })
  }, [isAndroid, scrollRef])

  const reveal = useCallback(() => {
    const top = keyboardTopRef.current
    const scroll = scrollRef.current as ScrollViewWithInnerView | null
    const input = TextInput.State.currentlyFocusedInput?.()
    const host = scroll?.getNativeScrollRef?.()
    const inner = scroll?.getInnerViewRef?.()
    if (top == null || !scroll || !input || !host || !inner) return
    // 中身の View からの相対位置が取れない = 欄がこの本文の外（Sheet・Dialog・別画面）。その場合は送らない
    input.measureLayout(
      inner,
      (_x, contentY, _width, inputHeight) => {
        inner.measureInWindow((_ix, innerY) => {
          host.measureInWindow((_sx, scrollY, _sw, scrollHeight) => {
            if (keyboardTopRef.current !== top || scrollRef.current !== scroll) return
            if (TextInput.State.currentlyFocusedInput?.() !== input) return
            const delta = resolveFocusedInputScrollDelta({
              scroll: { y: scrollY, height: scrollHeight },
              input: { y: innerY + contentY, height: inputHeight },
              keyboardTop: top,
              gap,
              tallInput: isAndroid ? "align-top" : "leave",
            })
            if (Math.abs(delta) < 1) return
            // いまのスクロール位置 = 本文の上端と中身の上端の差
            scroll.scrollTo({ y: Math.max(0, scrollY - innerY + delta), animated: true })
          })
        })
      },
      () => {},
    )
  }, [gap, isAndroid, scrollRef])

  // 測定は描画が反映された後に行う（Android は余白を足した後でないと送り先まで届かない）
  const scheduleReveal = useCallback(() => {
    if (frameRef.current != null) cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null
      reveal()
    })
  }, [reveal])

  useEffect(() => {
    if (!active) return
    const show = (metrics: KeyboardFrame | undefined) => {
      // iOS の「クロスフェードのトランジションを優先」では高さ 0・位置 0 で届く。位置が分からないので何もしない
      const next = metrics && metrics.height > 0 && metrics.screenY > 0 ? metrics.screenY : null
      keyboardTopRef.current = next
      setKeyboardTop(next)
    }
    const hide = () => {
      keyboardTopRef.current = null
      setKeyboardTop(null)
    }
    // keyboardDidShow は iOS ではキーボードが出きった後（RN の自動調整が終わった後）に届く。
    // Android は出る・高さが変わる（絵文字の切り替え等）たびに届く
    const subscriptions = [
      Keyboard.addListener("keyboardDidShow", (event) => show(event.endCoordinates)),
      Keyboard.addListener("keyboardDidHide", hide),
    ]
    // キーボードが出たまま画面に入ってきたとき
    if (Keyboard.isVisible?.()) show(Keyboard.metrics?.())
    return () => {
      subscriptions.forEach((subscription) => subscription.remove())
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current)
      frameRef.current = null
      keyboardTopRef.current = null
      setKeyboardTop(null)
    }
  }, [active])

  useEffect(() => {
    if (keyboardTop == null) return
    measureOverlap()
    scheduleReveal()
  }, [keyboardTop, measureOverlap, scheduleReveal])

  const scrollHandlers = useMemo(
    () => ({
      // TextInput の focus は親へ伝わる（bubbling）。キーボードが出たまま別の欄へ移ったとき
      // （Android は同じキーボードのままだと keyboardDidShow が来ない）に送り直す
      onFocus: () => {
        if (keyboardTopRef.current != null) scheduleReveal()
      },
      // 余白を足した・入力で中身の高さが変わった後に送り直す
      onContentSizeChange: () => {
        if (keyboardTopRef.current != null) scheduleReveal()
      },
      // 画面が縮む環境（adjustResize）では、キーボードが出た後に本文の高さが変わる。重なりを測り直す
      onLayout: () => {
        if (keyboardTopRef.current == null) return
        measureOverlap()
        scheduleReveal()
      },
    }),
    [measureOverlap, scheduleReveal],
  )

  if (!active) return { automaticallyAdjustKeyboardInsets: false, spacerHeight: 0, scrollHandlers: undefined }
  // 最後の欄も「キーボードの上端から gap 上」まで送れるよう、キーボードが出ている間だけ本文の末尾に足す
  const spacerHeight = keyboardTop != null ? (isAndroid ? overlap : 0) + gap : 0
  return { automaticallyAdjustKeyboardInsets: Platform.OS === "ios", spacerHeight, scrollHandlers }
}

export function Screen({
  children,
  footer,
  header,
  scroll = true,
  padding = "page",
  style,
  bodyStyle,
  headerStyle,
  footerStyle,
  contentContainerStyle,
  avoidKeyboard = true,
}: ScreenProps) {
  const { theme, scales } = useTheme()
  const scrollRef = useRef<ScrollView>(null)
  const keyboard = useScreenKeyboardAvoidance(scrollRef, scroll && avoidKeyboard, scales.spacing.scale[6])
  const baseBodyStyle = [
    {
      flex: 1,
      minHeight: 0,
      backgroundColor: theme.surface.primary,
    },
    bodyStyle,
  ]
  const paddedContentStyle = [
    bodyPadding(padding, scales.spacing),
    contentContainerStyle,
  ]

  return (
    <View
      style={[
        {
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          backgroundColor: theme.surface.primary,
        },
        style,
      ]}
    >
      {header && <View style={[{ flexShrink: 0 }, headerStyle]}>{header}</View>}
      {scroll ? (
        <ScrollView
          ref={scrollRef}
          style={baseBodyStyle}
          contentContainerStyle={paddedContentStyle}
          keyboardShouldPersistTaps="handled"
          // 無効（avoidKeyboard=false・web）のときは渡さず、従来と同じ props にする
          automaticallyAdjustKeyboardInsets={keyboard.automaticallyAdjustKeyboardInsets || undefined}
          {...keyboard.scrollHandlers}
        >
          {children}
          {keyboard.spacerHeight > 0 && <View style={{ height: keyboard.spacerHeight }} />}
        </ScrollView>
      ) : (
        <View style={[baseBodyStyle, bodyPadding(padding, scales.spacing), contentContainerStyle]}>
          {children}
        </View>
      )}
      {footer && (
        <View
          style={[
            {
              flexShrink: 0,
              backgroundColor: theme.surface.primary,
              paddingHorizontal: scales.spacing.scale[6],
              paddingTop: scales.spacing.scale[3],
              paddingBottom: scales.spacing.scale[4],
            },
            footerStyle,
          ]}
        >
          {footer}
        </View>
      )}
    </View>
  )
}
