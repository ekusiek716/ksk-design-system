import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  KeyboardAvoidingView,
  Keyboard,
  TextInput,
  Platform,
  PanResponder,
  Pressable,
  ScrollView,
  Text as RNText,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { useSafeAreaInsets } from "../theme/SafeAreaInsetsProvider"
import { resolveBottomSheetTopInset, resolveTopSheetPaddingTop } from "../safe-area"
import { resolveTypo } from "../typography"
import { resolveSheetViewportLayout } from "../sheet-viewport-layout"
import { createRevealLifecycle } from "../modal-reveal-lifecycle"
import {
  resolveDragTranslateY,
  resolveRelease,
  shouldCaptureDrag,
  type SnapGestureConfig,
} from "../sheet-snap-gesture"

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
   * ソフトキーボード表示中はその上に固定し、本文を一時拡張する。
   * キーボード回避は Sheet が所有するため footer に追加 inset は不要。
   */
  footer?: React.ReactNode
  /**
   * scrim タップや下方向スワイプで閉じれるか。default true。
   * false の場合、スワイプダウンは最小 snap まで戻る（rubber-band）。
   */
  dismissible?: boolean
  /**
   * safe-area（ステータスバー・ノッチ・ダイナミックアイランド）の回避を
   * 有効にするか。既定 true。実測 inset は `SafeAreaInsetsProvider` から供給する
   * （未供給なら回避量 0＝従来どおりの見た目）。
   * - `side="top"`: 上端に inset 分の内側余白を確保
   * - `side="bottom"`: パネル上端が safe-area に食い込む分だけ内容を退避
   *   （ハーフシート等、上端が届かない場合は何もしない）
   * - `side="left"` / `"right"`: 効果を持たない
   */
  safeArea?: boolean
  /**
   * パネル（および snap モードの footer）の面色。既定は `theme.surface.primary`
   * （従来どおり）。テーマ tint を持つプロダクトが、シートだけ自前の面色に
   * 寄せられるようにするための口（issue #448）。
   * scrim の色は変えない。
   */
  surfaceColor?: string
}

/**
 * Modal の onShow が届かなかった場合に最終状態へ復旧するまでの猶予。
 * iOS の Modal presentation は数百 ms かかるため十分に長く取る。ここが早すぎると
 * 入口アニメーションが省略され、遅すぎると不可視 Modal が操作を遮断する時間が伸びる。
 */
const REVEAL_SHOW_FALLBACK_DELAY = 800

export function Sheet(props: SheetProps) {
  const { side = "bottom", snapPoints } = props
  if (snapPoints && snapPoints.length > 0 && side === "bottom") {
    return <SnapBottomSheet {...props} />
  }
  return <PlainSheet {...props} />
}

/* ───────────────────────────────────────────── plain sheet (既存挙動) */

const PLAIN_DUR = 220
const PLAIN_ANIMATION_FALLBACK_DELAY = PLAIN_DUR + 120

function PlainSheet({
  open,
  onClose,
  side = "bottom",
  title,
  children,
  safeArea = true,
  surfaceColor,
}: SheetProps) {
  const { theme, scales } = useTheme()
  const insets = useSafeAreaInsets()
  // useRef(new Animated.Value()).current は render 中の ref 読み取りになるため
  // useState の lazy initializer で一度だけ生成する（react-hooks/refs）
  const [anim] = useState(() => new Animated.Value(0))
  const openRef = useRef(open)
  // snap mode と同様、Modal 表示前にアニメーションを走らせると iOS で
  // パネルが画面外（anim=0）に残るため onShow を起点にする（#248 / #250）
  const [revealLifecycle] = useState(() =>
    createRevealLifecycle({
      animationFallbackDelay: PLAIN_ANIMATION_FALLBACK_DELAY,
      showFallbackDelay: REVEAL_SHOW_FALLBACK_DELAY,
    }),
  )

  const revealOpened = useCallback(() => {
    if (!openRef.current) return
    anim.stopAnimation()
    anim.setValue(1)
  }, [anim])

  useEffect(() => {
    openRef.current = open
    revealLifecycle.cancel()
    anim.stopAnimation()
    anim.setValue(0)
    if (open) revealLifecycle.onOpen(revealOpened)
  }, [open, anim, revealLifecycle, revealOpened])

  useEffect(() => () => revealLifecycle.cancel(), [revealLifecycle])

  const handleModalShow = () => {
    revealLifecycle.onModalShow((complete) => {
      anim.stopAnimation()
      anim.setValue(0)
      Animated.timing(anim, {
        toValue: 1,
        duration: PLAIN_DUR,
        useNativeDriver: true,
      }).start(({ finished }) => complete(finished))
    }, revealOpened)
  }

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
    <Modal
      visible={open}
      transparent
      animationType="none"
      onShow={handleModalShow}
      onRequestClose={onClose}
    >
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
            backgroundColor: surfaceColor ?? theme.surface.primary,
            ...(side === "bottom" || side === "top"
              ? { width: "100%", borderTopLeftRadius: scales.borderRadius["2xl"], borderTopRightRadius: scales.borderRadius["2xl"] }
              : { height: "100%", width: "85%" }),
            padding: scales.spacing.scale[4],
            // side="top" のパネルは画面上端に貼り付くため、ステータスバー／
            // ダイナミックアイランド分を上端余白に足す（inset 未供給なら加算 0）。
            ...(side === "top"
              ? {
                  paddingTop: resolveTopSheetPaddingTop(
                    scales.spacing.scale[4],
                    insets,
                    safeArea,
                  ),
                }
              : null),
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
const REVEAL_ANIMATION_FALLBACK_DELAY = SNAP_DUR + 120
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
  safeArea = true,
  surfaceColor,
}: SheetProps) {
  const { theme, scales } = useTheme()
  const insets = useSafeAreaInsets()
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
  const [H] = useState(() => dimsH > 0 ? dimsH : winH && winH > 0 ? winH : 700)
  const panelH = Math.round(H * maxSnap)
  const [viewportHeight, setViewportHeight] = useState<number | null>(null)
  const [fullViewportHeight, setFullViewportHeight] = useState<number | null>(null)
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const scrollRef = useRef<ScrollView>(null)
  const scrollTopRef = useRef(0)
  useEffect(() => {
    const show = Keyboard.addListener(Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow", () => setKeyboardOpen(true))
    const hide = Keyboard.addListener(Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide", () => setKeyboardOpen(false))
    return () => { show.remove(); hide.remove() }
  }, [])
  const {
    availableHeight,
    panelHeight: visiblePanelHeight,
    expandToViewport: keyboardReducedViewport,
  } = resolveSheetViewportLayout(fullViewportHeight ?? H, panelH, viewportHeight, keyboardOpen)
  // Keep the user's snap translation intact while the keyboard temporarily
  // expands the panel. Restoring the viewport restores the previous snap.
  const safeAreaTopInset = resolveBottomSheetTopInset(
    insets, safeArea, availableHeight, visiblePanelHeight,
  )

  // footer の実測高。onLayout で取得し ScrollView の paddingBottom に反映する。
  const [footerH, setFooterH] = useState(0)
  // Measure the actual visible body, not screen keyboard coordinates: the
  // Modal has already been resized and its header/footer occupy part of it.
  const revealFocusedInput = useCallback(() => {
    const input = TextInput.State.currentlyFocusedInput?.()
    const scroll = scrollRef.current
    if (!input || !scroll || !keyboardOpen) return
    scroll.getNativeScrollRef()?.measureInWindow((_x, bodyTop, _width, bodyHeight) => {
      input.measureInWindow((_inputX, inputTop, _inputWidth, inputHeight) => {
        if (TextInput.State.currentlyFocusedInput?.() !== input || scrollRef.current !== scroll) return
        const visibleBottom = bodyTop + bodyHeight - footerH - scales.spacing.scale[4]
        const delta = inputTop < bodyTop
          ? inputTop - bodyTop
          : Math.max(0, inputTop + inputHeight - visibleBottom)
        if (delta !== 0) scroll.scrollTo({ y: Math.max(0, scrollTopRef.current + delta), animated: true })
      })
    })
  }, [keyboardOpen, footerH, scales.spacing.scale])
  useEffect(() => {
    if (!keyboardOpen) return
    const frame = requestAnimationFrame(revealFocusedInput)
    return () => cancelAnimationFrame(frame)
  }, [keyboardOpen, viewportHeight, revealFocusedInput])
  // footer 下に取る追加マージン（コンテンツ末尾と footer の物理的距離）
  const FOOTER_GAP = 60

  // active snap ratio
  const initialActive = clamp(initialSnap ?? minSnap, minSnap, maxSnap)
  const initialTranslateY = (maxSnap - initialActive) * H
  const activeRef = useRef(initialActive)
  // translateY: 0=フル、(maxSnap-active)*H で snap 位置、panelH で完全閉
  // useNativeDriver: true でカクつき無し。
  const [translateY] = useState(() => new Animated.Value(panelH))
  // translateY の JS 側ミラー。native driver 実行中は Animated.Value の内部値が
  // 更新されない（RN は終了時にだけ JS へ同期する）ため、gesture の開始位置は
  // 内部値ではなくこの ref を正本にする。
  const translateYRef = useRef(panelH)
  // snap アニメーション実行中フラグ。実行中は gesture を受け取らない。
  const animatingRef = useRef(false)
  const openRef = useRef(open)
  const keyboardReducedViewportRef = useRef(false)
  useEffect(() => {
    keyboardReducedViewportRef.current = keyboardReducedViewport
  }, [keyboardReducedViewport])
  // PanResponder / onShow のクロージャは生成時の props を掴み続けるため、
  // 可変値はこの ref 経由で読む（dismissible の後からの切り替え・onClose の
  // 最新参照が gesture に反映されないのを防ぐ）。
  const configRef = useRef<SnapGestureConfig & { onClose: () => void }>({
    points,
    minSnap,
    maxSnap,
    panelH,
    H,
    dismissible,
    onClose,
  })
  const [revealLifecycle] = useState(() =>
    createRevealLifecycle({
      animationFallbackDelay: REVEAL_ANIMATION_FALLBACK_DELAY,
      showFallbackDelay: REVEAL_SHOW_FALLBACK_DELAY,
    }),
  )

  useEffect(() => {
    configRef.current = { points, minSnap, maxSnap, panelH, H, dismissible, onClose }
  }, [points, minSnap, maxSnap, panelH, H, dismissible, onClose])

  const setTranslateY = useCallback(
    (value: number) => {
      translateYRef.current = value
      translateY.setValue(value)
    },
    [translateY],
  )

  useEffect(() => {
    if (!keyboardReducedViewport) return
    // A keyboard can appear in the middle of a drag. Discard the transient
    // gesture offset so dismissal restores an actual snap, not a half-drag.
    translateY.stopAnimation()
    animatingRef.current = false
    setTranslateY((maxSnap - activeRef.current) * H)
  }, [keyboardReducedViewport, translateY, setTranslateY, maxSnap, H])

  const animateTo = useCallback(
    (
      toValue: number,
      duration: number,
      onComplete?: (finished: boolean) => void,
    ) => {
      animatingRef.current = true
      Animated.timing(translateY, {
        toValue,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        animatingRef.current = false
        // 中断時は setValue 側で ref を更新済み
        if (finished) translateYRef.current = toValue
        onComplete?.(finished)
      })
    },
    [translateY],
  )

  const moveTo = useCallback(
    (
      targetActive: number,
      duration = SNAP_DUR,
      onComplete?: (finished: boolean) => void,
    ) => {
      const { maxSnap: max, H: height } = configRef.current
      activeRef.current = targetActive
      animateTo((max - targetActive) * height, duration, onComplete)
    },
    [animateTo],
  )

  // 入口アニメーションが走れなかった時の復旧先（初期 snap 位置で即表示）。
  // ref 経由にして「open の遷移以外で再実行されない」効果を保つ。
  const revealAtInitialSnapRef = useRef<() => void>(() => {})
  useEffect(() => {
    revealAtInitialSnapRef.current = () => {
      if (!openRef.current) return
      translateY.stopAnimation()
      animatingRef.current = false
      activeRef.current = initialActive
      setTranslateY(initialTranslateY)
    }
  }, [initialActive, initialTranslateY, translateY, setTranslateY])

  useEffect(() => {
    openRef.current = open
    revealLifecycle.cancel()
    translateY.stopAnimation()
    animatingRef.current = false
    setTranslateY(configRef.current.panelH)
    if (open) {
      // Modal は非表示時に children を unmount するため、再 open 時の
      // ScrollView は先頭に戻る。スクロール位置の記憶も一緒に捨てる。
      scrollTopRef.current = 0
      revealLifecycle.onOpen(() => revealAtInitialSnapRef.current())
    }
  }, [open, revealLifecycle, translateY, setTranslateY])

  useEffect(() => () => revealLifecycle.cancel(), [revealLifecycle])

  const handleModalShow = () => {
    revealLifecycle.onModalShow(
      (complete) => {
        translateY.stopAnimation()
        setTranslateY(configRef.current.panelH)
        moveTo(initialActive, SNAP_DUR, complete)
      },
      () => revealAtInitialSnapRef.current(),
    )
  }

  const startTYRef = useRef(0)
  const startActiveRef = useRef(initialActive)
  // PanResponder invokes these closures only from gesture events. The hooks
  // rule cannot see that boundary and otherwise treats passing the callbacks
  // to React Native as a render-time ref read.
  // eslint-disable-next-line react-hooks/refs
  const [pan] = useState(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, g) =>
        !keyboardReducedViewportRef.current && shouldCaptureDrag(g.dy, {
          active: activeRef.current,
          maxSnap: configRef.current.maxSnap,
          scrollTop: scrollTopRef.current,
          animating: animatingRef.current,
        }),
      onPanResponderGrant: () => {
        if (keyboardReducedViewportRef.current) return
        startTYRef.current = translateYRef.current
        startActiveRef.current = activeRef.current
      },
      onPanResponderMove: (_, g) => {
        if (keyboardReducedViewportRef.current) return
        setTranslateY(resolveDragTranslateY(startTYRef.current, g.dy, configRef.current))
      },
      onPanResponderRelease: (_, g) => {
        if (keyboardReducedViewportRef.current) return
        const config = configRef.current
        const action = resolveRelease(
          startTYRef.current,
          g.dy,
          startActiveRef.current,
          config,
        )
        if (action.kind === "close") {
          animateTo(config.panelH, SNAP_DUR, () => {
            // finished を条件にすると、アニメーション中断時（バックグラウンド化等）に
            // 閉じ通知が失われ、不可視 panel + 透明 Modal が残って操作不能になる。
            // 二重通知だけを防ぎたいので「まだ open のときだけ通知」で判定する。
            if (!openRef.current) return
            config.onClose()
          })
          return
        }
        moveTo(action.snap)
      },
    }),
  )

  // overlay opacity：translateY に追従（フル=濃く、閉=透明）
  const overlayOpacity = translateY.interpolate({
    inputRange: [0, panelH],
    outputRange: [0.4, 0],
    extrapolate: "clamp",
  })

  return (
    <Modal
      visible={open}
      transparent
      animationType="none"
      onShow={handleModalShow}
      onRequestClose={onClose}
    >
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

      {/* iOS overlays the keyboard; Android Modal already uses adjustResize.
          This is the sole keyboard inset owner: footer must not add it again. */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "height" : undefined}
        enabled={Platform.OS === "ios"}
        pointerEvents="box-none"
        style={{ flex: 1 }}
      >
        <View
          pointerEvents="box-none"
          style={{ flex: 1 }}
          onLayout={(event) => {
            const height = event.nativeEvent.layout.height
            if (height <= 0) return
            setViewportHeight(height)
            if (!keyboardOpen) setFullViewportHeight((previous) => Math.max(previous ?? 0, height))
          }}
        >
          {/* panel：bottom anchor + 高さ固定 + transform で snap 位置。
              footer は外側にレイヤしてパネル translation の影響を受けない */}
          <Animated.View
            {...pan.panHandlers}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: visiblePanelHeight,
              backgroundColor: surfaceColor ?? theme.surface.primary,
              borderTopLeftRadius: scales.borderRadius["2xl"],
              borderTopRightRadius: scales.borderRadius["2xl"],
              transform: [{ translateY: keyboardReducedViewport ? 0 : translateY }],
            }}
          >
            <View
              style={{
                paddingHorizontal: scales.spacing.scale[4],
                // 最大 snap が画面いっぱいに近いとき、パネル上端が safe-area に
                // 食い込む分だけハンドル／タイトルを下げる（届かないときは 0）。
                paddingTop: scales.spacing.scale[3] + safeAreaTopInset,
              }}
            >
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
              ref={scrollRef}
              onFocus={revealFocusedInput}
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
              automaticallyAdjustKeyboardInsets={false}
            >
              {children}
            </ScrollView>
          </Animated.View>

          {/* footer：パネルの translation 影響を受けない独立レイヤ。
              keyboard 回避済みの作業領域下端に固定。高さを onLayout で測って ScrollView に伝える */}
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
                backgroundColor: surfaceColor ?? theme.surface.primary,
              }}
            >
              {footer}
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}
