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
  /**
   * scrim タップや下方向スワイプで閉じれるか。default true。
   * false の場合、スワイプダウンは最小 snap まで戻る（rubber-band）。
   */
  dismissible?: boolean
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
  // useRef(new Animated.Value()).current は render 中の ref 読み取りになるため
  // useState の lazy initializer で一度だけ生成する（react-hooks/refs）
  const [anim] = useState(() => new Animated.Value(0))

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
  dismissible = true,
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
  const panelH = Math.round(H * maxSnap)
  // ラバーバンド上限
  const RUBBER_MAX = 4
  // close 判定：minSnap から CLOSE_DRAG_RATIO × panelH 以上引いたら閉じる
  const CLOSE_DRAG_RATIO = 0.18

  // footer の実測高。onLayout で取得し ScrollView の paddingBottom に反映する。
  const [footerH, setFooterH] = useState(0)
  // footer 下に取る追加マージン（コンテンツ末尾と footer の物理的距離）
  const FOOTER_GAP = 60

  // active snap ratio
  const initialActive = clamp(initialSnap ?? minSnap, minSnap, maxSnap)
  const activeRef = useRef(initialActive)
  // translateY: 0=フル、(maxSnap-active)*H で snap 位置、panelH で完全閉
  // useNativeDriver: true でカクつき無し。
  const translateY = useRef(new Animated.Value(panelH)).current

  const moveTo = (targetActive: number, duration = SNAP_DUR) => {
    activeRef.current = targetActive
    Animated.timing(translateY, {
      toValue: (maxSnap - targetActive) * H,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start()
  }

  useEffect(() => {
    if (open) {
      translateY.setValue(panelH)
      moveTo(initialActive, SNAP_DUR)
    } else {
      Animated.timing(translateY, {
        toValue: panelH,
        duration: SNAP_DUR,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

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
          if (dy > 0 && atTop) return true
          return false
        }
        return true
      },
      onPanResponderGrant: () => {
        startTYRef.current = (translateY as unknown as { _value: number })._value
        startActiveRef.current = activeRef.current
      },
      onPanResponderMove: (_, g) => {
        let next = startTYRef.current + g.dy
        // フル超え（上方向overshoot）はラバーバンド
        if (next < 0) next = Math.max(-RUBBER_MAX, next / 4)
        // 非 dismissible は minSnap より下にスワイプさせない（rubber-band）
        const minTY = dismissible ? panelH : (maxSnap - minSnap) * H
        if (next > minTY) {
          const over = next - minTY
          next = minTY + Math.min(RUBBER_MAX, over / 4)
        }
        translateY.setValue(next)
      },
      onPanResponderRelease: (_, g) => {
        const released = clamp(startTYRef.current + g.dy, 0, panelH)
        const dy = g.dy
        const startActive = startActiveRef.current

        // 1) FULL からさらに上 → ラバーバンドで戻る
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

        // 3) 下方向：dismissible 時のみ close 判定
        if (dy > 0) {
          if (dismissible && startActive === minSnap && dy > panelH * CLOSE_DRAG_RATIO) {
            Animated.timing(translateY, {
              toValue: panelH,
              duration: SNAP_DUR,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }).start(() => onClose())
            return
          }
          if (startActive === maxSnap) {
            const collapseDelta = (maxSnap - minSnap) * H
            if (dismissible && dy > collapseDelta + panelH * CLOSE_DRAG_RATIO) {
              Animated.timing(translateY, {
                toValue: panelH,
                duration: SNAP_DUR,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
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

  // overlay opacity：translateY に追従（フル=濃く、閉=透明）
  const overlayOpacity = translateY.interpolate({
    inputRange: [0, panelH],
    outputRange: [0.4, 0],
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
        <Pressable onPress={dismissible ? onClose : () => {}} style={{ flex: 1 }} />
      </Animated.View>

      {/* panel：bottom anchor + 高さ固定 + transform で snap 位置。
          footer は外側にレイヤしてパネル translation の影響を受けない */}
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
          contentContainerStyle={{
            paddingHorizontal: scales.spacing.scale[4],
            // footer 実測高 + 60px の余白を空け、コンテンツ末尾が footer に
            // 重ならない・ぶつからないようにする。
            paddingBottom: footer ? footerH + FOOTER_GAP : scales.spacing.scale[4],
          }}
          onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
            scrollTopRef.current = e.nativeEvent.contentOffset.y
          }}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </Animated.View>

      {/* footer：パネルの translation 影響を受けない独立レイヤ。
          常に viewport 下端に固定。高さを onLayout で測って ScrollView に伝える */}
      {footer && (
        <View
          pointerEvents="box-none"
          onLayout={(e) => setFooterH(e.nativeEvent.layout.height)}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
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
    </Modal>
  )
}
