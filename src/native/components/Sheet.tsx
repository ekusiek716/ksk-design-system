import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  Text as RNText,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export type SheetSide = "bottom" | "top" | "left" | "right"

export interface SheetProps {
  open: boolean
  onClose: () => void
  side?: SheetSide
  title?: string
  children?: React.ReactNode
  /**
   * Bottom-sheet snap points (0..1 of viewport height).
   * Provide e.g. `[0.55, 0.92]` to enable snap mode:
   * シートはドラッグハンドル経由でハーフ／フル相当に切替可能、
   * 下方向に minSnap × 0.5 を下回ると close する。
   * `side="bottom"` でのみ有効。未指定なら従来の単純スライドアニメ。
   */
  snapPoints?: number[]
  /** Initial snap (must match one of `snapPoints`). Default = first entry. */
  initialSnap?: number
  /**
   * シート下端に固定で表示する要素（例：「つづける」ボタン）。
   * children の ScrollView と分離されるためコンテンツのスクロールに
   * 追従しない。snap mode（bottom + snapPoints）でのみ有効。
   */
  footer?: React.ReactNode
}

export function Sheet(props: SheetProps) {
  const { side = "bottom", snapPoints } = props
  if (snapPoints && snapPoints.length > 0 && side === "bottom") {
    return <SnapBottomSheet {...props} />
  }
  return <PlainSheet {...props} />
}

/* ───────────────────────────────────────────── plain sheet (既存挙動) */

function PlainSheet({ open, onClose, side = "bottom", title, children }: SheetProps) {
  const { theme, scales } = useTheme()
  const anim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(anim, {
      toValue: open ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start()
  }, [open, anim])

  const { width: W, height: H } = Dimensions.get("window")
  const offset: Record<SheetSide, { translateX?: Animated.AnimatedInterpolation<number>; translateY?: Animated.AnimatedInterpolation<number> }> = {
    bottom: { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [H, 0] }) },
    top: { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-H, 0] }) },
    left: { translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [-W, 0] }) },
    right: { translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [W, 0] }) },
  }

  const align: Record<SheetSide, { alignItems?: "flex-start" | "center" | "flex-end" | "stretch"; justifyContent?: "flex-start" | "center" | "flex-end" }> = {
    bottom: { justifyContent: "flex-end" },
    top: { justifyContent: "flex-start" },
    left: { alignItems: "flex-start" },
    right: { alignItems: "flex-end" },
  }

  return (
    <Modal visible={open} transparent animationType="none" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: theme.overlay.dark, ...align[side] }}
      >
        <Animated.View
          style={{
            transform: [
              offset[side].translateX ? { translateX: offset[side].translateX } : { translateX: 0 },
              offset[side].translateY ? { translateY: offset[side].translateY } : { translateY: 0 },
            ],
            backgroundColor: theme.surface.primary,
            ...(side === "bottom" || side === "top"
              ? { width: "100%", borderTopLeftRadius: scales.borderRadius["2xl"], borderTopRightRadius: scales.borderRadius["2xl"] }
              : { height: "100%", width: "85%" }),
            padding: scales.spacing.scale[4],
            gap: scales.spacing.scale[3],
          }}
        >
          <Pressable onPress={() => {}}>
            {side === "bottom" && (
              <View
                style={{
                  width: 40,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: theme.border["medium-emphasis"],
                  alignSelf: "center",
                  marginBottom: scales.spacing.scale[2],
                }}
              />
            )}
            {title && (
              <RNText style={[resolveTypo("heading.md"), { color: theme.text["high-emphasis"] }]}>
                {title}
              </RNText>
            )}
            <View style={{ marginTop: scales.spacing.scale[2] }}>{children}</View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  )
}

/* ───────────────────────────────────────────── snap mode（web版踏襲） */

const SNAP_DUR = 180
function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}

function SnapBottomSheet({
  open,
  onClose,
  title,
  children,
  snapPoints,
  initialSnap,
  footer,
}: SheetProps) {
  const { theme, scales } = useTheme()
  const points = useMemo(() => {
    const sorted = [...(snapPoints ?? [0.55, 0.92])]
      .map((p) => clamp(p, 0.1, 0.99))
      .sort((a, b) => a - b)
    return sorted.length > 0 ? sorted : [0.55, 0.92]
  }, [snapPoints])
  const minSnap = points[0]
  const maxSnap = points[points.length - 1]

  // 画面高。RN-web の Modal portal 初期描画では Dimensions が 0 を返す瞬間が
  // あるため window.innerHeight にフォールバック。回転には未対応（初期値固定）。
  const dimsH = Dimensions.get("window").height
  const winH =
    typeof globalThis !== "undefined" &&
    (globalThis as unknown as { window?: { innerHeight?: number } }).window
      ?.innerHeight
  const H = dimsH > 0 ? dimsH : winH && winH > 0 ? winH : 700
  const fullH = Math.round(H * maxSnap)
  const minH = Math.round(H * minSnap)
  // ラバーバンド上限（フル状態で上に引いた時の許容オーバーシュート）
  const RUBBER_MAX = 4
  // close 判定：HALF から CLOSE_DRAG_RATIO × minH 引いたら閉じる
  const CLOSE_DRAG_RATIO = 0.32

  // active snap ratio
  const initialActive = clamp(initialSnap ?? minSnap, minSnap, maxSnap)
  const activeRef = useRef(initialActive)
  // sheetH：panel の高さ（0=閉、minH=ハーフ、fullH=フル）。
  // 高さを直接アニメするため useNativeDriver は false。
  const sheetH = useRef(new Animated.Value(0)).current

  const moveTo = (targetActive: number, duration = SNAP_DUR) => {
    activeRef.current = targetActive
    Animated.timing(sheetH, {
      toValue: Math.round(targetActive * H),
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start()
  }

  useEffect(() => {
    if (open) {
      sheetH.setValue(0)
      moveTo(initialActive, SNAP_DUR)
    } else {
      Animated.timing(sheetH, {
        toValue: 0,
        duration: SNAP_DUR,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // PanResponder：FULL + scrollTop=0 で下スワイプ、HALF で全方向、を受ける
  const startHRef = useRef(0)
  const startActiveRef = useRef(initialActive)
  const scrollTopRef = useRef(0)
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, g) => {
        if (Math.abs(g.dy) < 6) return false
        const dy = g.dy
        const atFull = activeRef.current === maxSnap
        const atTop = scrollTopRef.current <= 0
        if (atFull) {
          if (dy > 0 && atTop) return true
          return false
        }
        return true
      },
      onPanResponderGrant: () => {
        startHRef.current = (sheetH as unknown as { _value: number })._value
        startActiveRef.current = activeRef.current
      },
      onPanResponderMove: (_, g) => {
        // drag up（dy<0）で高さ増、drag down（dy>0）で高さ減。
        let next = startHRef.current - g.dy
        // フル超えは RUBBER_MAX だけ伸ばす（重く）
        if (next > fullH) {
          const over = next - fullH
          next = fullH + Math.min(RUBBER_MAX, over / 4)
        }
        if (next < 0) next = 0
        sheetH.setValue(next)
      },
      onPanResponderRelease: (_, g) => {
        const released = clamp(startHRef.current - g.dy, 0, fullH + RUBBER_MAX)
        const dy = g.dy
        const startActive = startActiveRef.current

        // 1) FULL からさらに上方向 → ラバーバンドで戻る
        if (startActive === maxSnap && dy < 0) {
          moveTo(maxSnap)
          return
        }

        // 2) 上方向 → 1段階上の snap
        if (dy < -20) {
          const idx = points.indexOf(startActive)
          const nextSnap = idx >= 0 && idx < points.length - 1 ? points[idx + 1] : maxSnap
          moveTo(nextSnap)
          return
        }

        // 3) 下方向：close vs HALF 戻り を距離別に判定
        if (dy > 0) {
          if (startActive === minSnap && dy > minH * CLOSE_DRAG_RATIO) {
            Animated.timing(sheetH, {
              toValue: 0,
              duration: SNAP_DUR,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: false,
            }).start(() => onClose())
            return
          }
          if (startActive === maxSnap) {
            const collapseDelta = (maxSnap - minSnap) * H
            if (dy > collapseDelta + minH * CLOSE_DRAG_RATIO) {
              Animated.timing(sheetH, {
                toValue: 0,
                duration: SNAP_DUR,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: false,
              }).start(() => onClose())
              return
            }
            if (dy > 40) {
              moveTo(minSnap)
              return
            }
          }
        }

        // 4) その他は最近接 snap に戻す
        const releasedActive = released / H
        let best = points[0]
        let bestD = Math.abs(points[0] - releasedActive)
        for (let i = 1; i < points.length; i++) {
          const d = Math.abs(points[i] - releasedActive)
          if (d < bestD) {
            bestD = d
            best = points[i]
          }
        }
        moveTo(best)
      },
    }),
  ).current

  // overlay opacity：高さに追従（0=透明、minH 以上でフル）
  const overlayOpacity = sheetH.interpolate({
    inputRange: [0, minH],
    outputRange: [0, 0.4],
    extrapolate: "clamp",
  })

  return (
    <Modal visible={open} transparent animationType="none" onRequestClose={onClose}>
      {/* scrim */}
      <Animated.View
        pointerEvents={open ? "auto" : "none"}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: theme.overlay.dark,
          opacity: overlayOpacity,
        }}
      >
        <Pressable onPress={onClose} style={{ flex: 1 }} />
      </Animated.View>

      {/* panel：bottom anchor + height アニメ。footer はパネル下端＝viewport 下端 */}
      <Animated.View
        {...pan.panHandlers}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: sheetH,
          backgroundColor: theme.surface.primary,
          borderTopLeftRadius: scales.borderRadius["2xl"],
          borderTopRightRadius: scales.borderRadius["2xl"],
          overflow: "hidden",
        }}
      >
        {/* ドラッグハンドル＋タイトル */}
        <View style={{ paddingHorizontal: scales.spacing.scale[4], paddingTop: scales.spacing.scale[3] }}>
          <View
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: theme.border["medium-emphasis"],
              alignSelf: "center",
              marginBottom: scales.spacing.scale[2],
            }}
          />
          {title && (
            <RNText
              style={[
                resolveTypo("heading.md"),
                { color: theme.text["high-emphasis"], marginBottom: scales.spacing.scale[2] },
              ]}
            >
              {title}
            </RNText>
          )}
        </View>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: scales.spacing.scale[4], paddingBottom: scales.spacing.scale[4] }}
          onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
            scrollTopRef.current = e.nativeEvent.contentOffset.y
          }}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
        {footer && (
          <View
            style={{
              paddingHorizontal: scales.spacing.scale[4],
              paddingTop: scales.spacing.scale[3],
              paddingBottom: scales.spacing.scale[4],
              borderTopWidth: 1,
              borderTopColor: theme.border["low-emphasis"],
              backgroundColor: theme.surface.primary,
            }}
          >
            {footer}
          </View>
        )}
      </Animated.View>
    </Modal>
  )
}
