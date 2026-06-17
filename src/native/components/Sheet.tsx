import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  Animated,
  Dimensions,
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

  // 画面高は open 中だけ計測。RN-web の Modal portal 初期描画では
  // Dimensions が 0 を返す瞬間があるため、ResizeEvent でも更新する。
  const [H, setH] = useState(() => Dimensions.get("window").height || 700)
  useEffect(() => {
    const sub = Dimensions.addEventListener("change", ({ window }) => {
      if (window.height > 0) setH(window.height)
    })
    return () => sub.remove()
  }, [])
  const panelH = Math.round(H * maxSnap)
  // ラバーバンド上限（フル状態で上方向に引いた時の許容オーバーシュート）
  const RUBBER_MAX = 4
  // close 判定：HALF 状態から下に panelH × 0.18 以上引いたら close
  const CLOSE_DRAG_RATIO = 0.18

  // active snap ratio（0..1）。初期は initialSnap or minSnap。
  const initialActive = clamp(initialSnap ?? minSnap, minSnap, maxSnap)
  const activeRef = useRef(initialActive)
  // translateY: (maxSnap - active) * H px。0 = フル、上限 = panelH（閉）。
  const translateY = useRef(new Animated.Value(panelH)).current

  // open / close、active 切替時のターゲット位置を再計算
  const moveTo = (targetActive: number, duration = SNAP_DUR) => {
    activeRef.current = targetActive
    Animated.timing(translateY, {
      toValue: (maxSnap - targetActive) * H,
      duration,
      useNativeDriver: true,
    }).start()
  }

  useEffect(() => {
    if (open) {
      // open: 初期 snap へスライドイン
      translateY.setValue(panelH) // 閉位置にセットしてから
      moveTo(initialActive, SNAP_DUR)
    } else {
      // close: 完全に押し下げて非表示
      Animated.timing(translateY, {
        toValue: panelH,
        duration: SNAP_DUR,
        useNativeDriver: true,
      }).start()
    }
    // H の変動（端末回転）でアニメをリセットするとカクつくため、依存は open のみ。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // PanResponder：シート全面。ただし FULL でコンテンツに余地がある場合は
  // ScrollView へ譲る（FULL + 上スワイプ or FULL + scrollTop>0 の下スワイプ）。
  const startTYRef = useRef(0)
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
          // FULL: 下スワイプは scrollTop=0 のときだけシート操作。上は常に
          // ScrollView 側に任せる（rubber-band 風の挙動はブラウザ任せ）。
          if (dy > 0 && atTop) return true
          return false
        }
        // FULL 未満（HALF）: 縦方向は常にシート操作。
        return true
      },
      onPanResponderGrant: () => {
        startTYRef.current = (translateY as unknown as { _value: number })._value
        startActiveRef.current = activeRef.current
      },
      onPanResponderMove: (_, g) => {
        let next = startTYRef.current + g.dy
        // 上端（フル超え）はラバーバンドで重く・最大 RUBBER_MAX のみ越える
        if (next < 0) next = Math.max(-RUBBER_MAX, next / 4)
        // 下端は閉状態を超えない
        if (next > panelH) next = panelH
        translateY.setValue(next)
      },
      onPanResponderRelease: (_, g) => {
        const released = clamp(startTYRef.current + g.dy, 0, panelH)
        const dy = g.dy
        const startActive = startActiveRef.current

        // 1) FULL 状態でさらに上にスワイプ → ラバーバンドで戻す
        if (startActive === maxSnap && dy < 0) {
          moveTo(maxSnap)
          return
        }

        // 2) 上方向スワイプ → 1段階上の snap へ
        if (dy < -20) {
          const idx = points.indexOf(startActive)
          const nextSnap = idx >= 0 && idx < points.length - 1 ? points[idx + 1] : maxSnap
          moveTo(nextSnap)
          return
        }

        // 3) 下方向スワイプ：距離で close vs ハーフ戻り を判定
        if (dy > 0) {
          // HALF 状態から閾値以上引いたら close
          if (startActive === minSnap && dy > panelH * CLOSE_DRAG_RATIO) {
            Animated.timing(translateY, {
              toValue: panelH,
              duration: SNAP_DUR,
              useNativeDriver: true,
            }).start(() => onClose())
            return
          }
          // FULL 状態からは：軽く引けば HALF、深く引けば close
          if (startActive === maxSnap) {
            const halfPosY = (maxSnap - minSnap) * H
            if (dy > halfPosY + panelH * CLOSE_DRAG_RATIO) {
              Animated.timing(translateY, {
                toValue: panelH,
                duration: SNAP_DUR,
                useNativeDriver: true,
              }).start(() => onClose())
              return
            }
            // ハーフへ戻る
            if (dy > 40) {
              moveTo(minSnap)
              return
            }
          }
        }

        // 4) その他は元の snap に戻す（最近接判定）
        const releasedActive = maxSnap - released / H
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

  // overlay opacity：active 比率に追従（min で 0、max でフル）
  const overlayOpacity = translateY.interpolate({
    inputRange: [0, (maxSnap - minSnap) * H, panelH],
    outputRange: [1, 0.4, 0],
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

      {/* panel：bottom anchor + 高さ固定 + transform で snap 位置 */}
      <Animated.View
        {...pan.panHandlers}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: panelH,
          backgroundColor: theme.surface.primary,
          borderTopLeftRadius: scales.borderRadius["2xl"],
          borderTopRightRadius: scales.borderRadius["2xl"],
          transform: [{ translateY }],
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
      </Animated.View>
    </Modal>
  )
}
