import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  Text as RNText,
  View,
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

const SNAP_DUR = 260
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, H])

  // PanResponder（ハンドル＋上部行）
  const startTYRef = useRef(0)
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 2,
      onPanResponderGrant: () => {
        startTYRef.current = (translateY as unknown as { _value: number })._value
      },
      onPanResponderMove: (_, g) => {
        // translateY を直接更新（0 = フル, panelH = 閉）
        const next = clamp(startTYRef.current + g.dy, 0, panelH)
        translateY.setValue(next)
      },
      onPanResponderRelease: (_, g) => {
        const next = clamp(startTYRef.current + g.dy, 0, panelH)
        // active ratio へ逆算
        const releasedActive = maxSnap - next / H
        // 下に大きく引いたら close
        if (releasedActive < minSnap * 0.5) {
          Animated.timing(translateY, {
            toValue: panelH,
            duration: SNAP_DUR,
            useNativeDriver: true,
          }).start(() => onClose())
          return
        }
        // 最近接 snap にスナップ
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
        pointerEvents="box-none"
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
        {/* ドラッグハンドル＋タイトル行：PanResponder の hot zone */}
        <View {...pan.panHandlers} style={{ paddingHorizontal: scales.spacing.scale[4], paddingTop: scales.spacing.scale[3] }}>
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
        <View style={{ flex: 1, paddingHorizontal: scales.spacing.scale[4], paddingBottom: scales.spacing.scale[4] }}>
          {children}
        </View>
      </Animated.View>
    </Modal>
  )
}
