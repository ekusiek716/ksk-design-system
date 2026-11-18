import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  type HostInstance,
  type StyleProp,
  type ViewStyle,
} from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import {
  isInsideScrollContent,
  resolveFocusedInputScrollDelta,
  resolveKeyboardOverlap,
  resolveKeyboardPaddingBottom,
} from "../screen-keyboard"

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
   *   本文とキーボードが重なる高さぶん本文の下の余白（paddingBottom）を足し、同じ位置まで送る。画面が縮む環境では重なりが 0 になり、足さない。
   * - キーボードが出たまま別の欄へ移ったとき（「次へ」・別の欄に触れる）も送り直す。指で本文を動かした後は、中身の高さが変わっても引き戻さない。
   * - 入力中の欄がこの Screen の本文の外（Sheet・Dialog・別画面。children の中に置いた Sheet も含む）にあるときは、
   *   送らず余白も足さない（それらの部品が自分で避ける）。ただし iOS では、RN の ScrollView がキーボードの高さぶんの
   *   contentInset を外の欄でも付ける（RN 本体の仕様。見た目はほぼ変わらない）。
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

/** 本文の中身の下の余白（数値で指定されていなければ 0 とみなす）。Yoga と同じく paddingBottom > paddingVertical > padding */
function resolveBasePaddingBottom(style: StyleProp<ViewStyle>): number {
  const flat = StyleSheet.flatten(style) as ViewStyle | undefined
  const value = flat?.paddingBottom ?? flat?.paddingVertical ?? flat?.padding
  return typeof value === "number" ? value : 0
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
  // 入力中の欄がこの本文の中にあるか（測って確かめた結果）。外の欄のためには余白を足さない
  const [ownsFocus, setOwnsFocus] = useState(false)
  // 中身の高さが変わったときに送り直してよいか。キーボードが出た・欄に入ったときに立て、指で動かしたら下ろす
  const followRef = useRef(false)
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
    if (top == null || !scroll || !input || !host || !inner) {
      setOwnsFocus(false)
      return
    }
    const stale = () =>
      keyboardTopRef.current !== top ||
      scrollRef.current !== scroll ||
      TextInput.State.currentlyFocusedInput?.() !== input
    input.measureLayout(
      inner,
      (_x, contentY, _width, inputHeight) => {
        input.measureInWindow((_wx, inputWindowY) => {
          inner.measureInWindow((_ix, innerY) => {
            host.measureInWindow((_sx, scrollY, _sw, scrollHeight) => {
              if (stale()) return
              // 本文の外（children の中の Sheet・Dialog 等の Modal を含む）の欄は送らない
              if (!isInsideScrollContent(inputWindowY, innerY, contentY)) {
                setOwnsFocus(false)
                return
              }
              setOwnsFocus(true)
              const delta = resolveFocusedInputScrollDelta({
                scroll: { y: scrollY, height: scrollHeight },
                input: { y: inputWindowY, height: inputHeight },
                keyboardTop: top,
                gap,
                tallInput: isAndroid ? "align-top" : "leave",
              })
              if (Math.abs(delta) < 1) return
              // いまのスクロール位置 = 本文の上端と中身の上端の差
              scroll.scrollTo({ y: Math.max(0, scrollY - innerY + delta), animated: true })
            })
          })
        })
      },
      // 別の画面など、中身の View の子孫でない欄
      () => {
        if (!stale()) setOwnsFocus(false)
      },
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
      followRef.current = next != null
      setKeyboardTop(next)
    }
    const hide = () => {
      keyboardTopRef.current = null
      followRef.current = false
      setKeyboardTop(null)
      setOwnsFocus(false)
      setOverlap(0)
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
      hide()
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
        if (keyboardTopRef.current == null) return
        followRef.current = true
        scheduleReveal()
      },
      // 本文の欄が外れた（blur も親へ伝わる）。キーボードが出たまま本文の外の欄（Sheet 等）へ移ったときに
      // 余白を外せるよう、次の描画で入力中の欄を測り直す（本文の別の欄へ移ったときは onFocus と同じく送る）
      onBlur: () => {
        if (keyboardTopRef.current != null) scheduleReveal()
      },
      // 余白を足した後（Android は足した後でないと送り先まで届かない）・入力で中身の高さが変わった後に送り直す
      onContentSizeChange: () => {
        if (keyboardTopRef.current != null && followRef.current) scheduleReveal()
      },
      // 指で本文を動かしたら、中身の高さが変わっても入力中の欄へ引き戻さない
      onScrollBeginDrag: () => {
        followRef.current = false
      },
      // 画面が縮む環境（adjustResize）では、キーボードが出た後に本文の高さが変わる。重なりを測り直す
      onLayout: () => {
        if (keyboardTopRef.current == null) return
        measureOverlap()
        if (followRef.current) scheduleReveal()
      },
    }),
    [measureOverlap, scheduleReveal],
  )

  if (!active) return { automaticallyAdjustKeyboardInsets: false, keyboardOverlap: null, scrollHandlers: undefined }
  return {
    automaticallyAdjustKeyboardInsets: Platform.OS === "ios",
    // キーボードが出ていて、入力中の欄がこの本文の中にあるときだけ、下の余白を広げる（null は広げない）
    keyboardOverlap: keyboardTop != null && ownsFocus ? (isAndroid ? overlap : 0) : null,
    scrollHandlers,
  }
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
  const keyboardGap = scales.spacing.scale[6]
  const keyboard = useScreenKeyboardAvoidance(scrollRef, scroll && avoidKeyboard, keyboardGap)
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
  let keyboardPadding: ViewStyle | null = null
  if (keyboard.keyboardOverlap != null) {
    const base = resolveBasePaddingBottom(paddedContentStyle)
    const paddingBottom = resolveKeyboardPaddingBottom(base, keyboardGap, keyboard.keyboardOverlap)
    if (paddingBottom !== base) keyboardPadding = { paddingBottom }
  }

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
          contentContainerStyle={keyboardPadding ? [paddedContentStyle, keyboardPadding] : paddedContentStyle}
          keyboardShouldPersistTaps="handled"
          // 無効（avoidKeyboard=false・web）のときは渡さず、従来と同じ props にする
          automaticallyAdjustKeyboardInsets={keyboard.automaticallyAdjustKeyboardInsets || undefined}
          {...keyboard.scrollHandlers}
        >
          {children}
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
