import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { Animated, View, Text as RNText, Pressable } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { createToastOutletId, useToastOutletRegistration, useTopToastOutlet } from "../toast-outlet-stack"

/**
 * Toast (native) — 正本: src/components/ui/toast.tsx（Web 版）。
 *
 * Web 版との対応:
 *  - Web の `variant`（default/success/caution/warning/info）に native の `tone` を対応させる。
 *    既存 native tone は info/success/warning/caution の4種だったため、本追加で `default` を足し
 *    Web と同じ5種に揃えた。
 *  - Web の fire-and-forget `toast()` / `toast.success()` 等の module-level API に対応する native
 *    版として `toast` を追加。Provider（`ToastProvider`）は引き続き必須の設計を維持しつつ、
 *    Provider がマウントされていない状態で `toast()` 系が呼ばれても throw させず、
 *    no-op + console.warn に倒す（アプリ側の実装漏れでクラッシュしないようにするため）。
 *  - Web の `action`（label + onClick）に対応する `action`（label + onPress）を ToastItem/
 *    ToastOptions に追加。
 *
 * 後方互換: 既存の `useToast()` / `ToastProvider` / `ToastItem` の props はそのまま動作する
 * （tone に "default" を渡せるようになった以外、破壊的変更なし）。
 */
export type ToastTone = "default" | "info" | "success" | "warning" | "caution"

export interface ToastAction {
  /** ボタンに表示するラベル */
  label: string
  /** 押下時のコールバック。toast は自動で dismiss されない（必要なら自前で dismiss(id) を呼ぶ）。 */
  onPress: () => void
}

export interface ToastItem {
  id: string
  title?: string
  description?: string
  tone?: ToastTone
  duration?: number
  /** オプショナルなアクションボタン。「元に戻す」「再試行」等の即時アクション用途。 */
  action?: ToastAction
}

interface ToastContextValue {
  show: (toast: Omit<ToastItem, "id">) => string
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast は ToastProvider の内側で使ってください")
  return ctx
}

let counter = 0
function nextId() {
  counter += 1
  return `toast-${counter}`
}

// =============================================================
// Provider 不在でも安全に呼べる fire-and-forget API 用の singleton store
// -------------------------------------------------------------
// Web 版は DOM に自前で portal をマウントできるが、native には相当する
// グローバルマウントポイントが無い。そのため `<ToastProvider>` は
// 引き続き必須（実際の描画は Provider が担う）。
// `toast()` は Provider が自己登録した show/dismiss 関数へ委譲し、
// Provider がまだマウントされていなければ throw せず
// no-op + console.warn（開発者のミス早期発見用）に倒す。
// =============================================================
interface RegisteredProvider {
  show: (toast: Omit<ToastItem, "id">) => string
  dismiss: (id: string) => void
}

let registeredProvider: RegisteredProvider | null = null

function registerProvider(p: RegisteredProvider | null) {
  registeredProvider = p
}

function showViaSingleton(title: string, options: ToastOptions = {}, tone?: ToastTone): string {
  if (!registeredProvider) {
    console.warn(
      "[ksk-ds native toast()] ToastProvider がマウントされていないため通知は表示されません。" +
        "アプリのルートに <ToastProvider> を配置してください。",
    )
    return ""
  }
  return registeredProvider.show({
    title,
    description: options.description,
    tone: tone ?? options.tone,
    duration: options.duration,
    action: options.action,
  })
}

export interface ToastOptions {
  description?: string
  tone?: ToastTone
  duration?: number
  action?: ToastAction
}

export interface ToastFn {
  (title: string, options?: ToastOptions): string
  success: (title: string, options?: ToastOptions) => string
  error: (title: string, options?: ToastOptions) => string
  info: (title: string, options?: ToastOptions) => string
  warning: (title: string, options?: ToastOptions) => string
  caution: (title: string, options?: ToastOptions) => string
  dismiss: (id: string) => void
}

/**
 * fire-and-forget API（native 版）。`<ToastProvider>` がマウント済みなら即座に表示する。
 * 未マウント時は throw せず no-op + console.warn（Web 版 toast() との対応）。
 *
 * @example
 * toast("保存しました")
 * toast.success("保存しました")
 * toast.caution("エラーが発生しました", { action: { label: "再試行", onPress: retry } })
 */
const toast = ((title: string, options?: ToastOptions) =>
  showViaSingleton(title, options)) as ToastFn
toast.success = (title, options) => showViaSingleton(title, options, "success")
toast.error = (title, options) => showViaSingleton(title, options, "caution")
toast.info = (title, options) => showViaSingleton(title, options, "info")
toast.warning = (title, options) => showViaSingleton(title, options, "warning")
toast.caution = (title, options) => showViaSingleton(title, options, "caution")
toast.dismiss = (id: string) => registeredProvider?.dismiss(id)

export { toast }

/**
 * 通知の描き方。
 * - `"auto"`（既定）: 開いている `ToastOutlet`（通知の出口）があれば、一番最後に開いた出口にだけ描く。
 *   出口が無ければ children の兄弟の absolute View（Provider 直下）に描く。
 * - `"inline"`: 出口を無視して、常に Provider 直下に描く（#820 以前の描き方）。RN の `<Modal>` を開いている間は
 *   その下に隠れる。Sheet の上に通知を重ねたくない画面向けの逃げ道。
 */
export type ToastPresentation = "auto" | "inline"

export interface ToastProviderProps {
  children: React.ReactNode
  /** 通知の描き方。既定は `"auto"`。詳細は {@link ToastProvider} を参照。 */
  presentation?: ToastPresentation
}

/** 出口と Provider 直下の描画に渡す、表示中の通知と閉じる関数（内部用）。 */
interface ToastRenderContextValue {
  items: ToastItem[]
  dismiss: (id: string) => void
  presentation: ToastPresentation
}

const ToastRenderContext = createContext<ToastRenderContextValue | null>(null)

/**
 * 通知の Provider。アプリのルートに 1 つ置く。
 *
 * ## Modal との前後関係（issue #820）
 * native の Sheet / Dialog / Popover は RN の `<Modal>`（iOS は別の view controller、Android は別のウィンドウ）で、
 * アプリ本体の View に `zIndex` を付けても前に出られない。また iOS の RN は、すでに Sheet を present している
 * 画面の上に、ルート直下の兄弟の `<Modal>` をもう 1 枚 present できない（UIKit が拒否して何も出ない）。
 *
 * そこで通知用の Modal は作らず、DS の Modal 系部品（Sheet / Dialog / AlertDialog / ConfirmDialog / Popover /
 * BottomSheetForm / ResponsiveDialog / CoachMarkOverlay / CelebrationDialog / Celebration の overlay /
 * ImageGallery のビューア）が、自分の `<Modal>` の中身の最前面に {@link ToastOutlet} を置いている。
 * 既定（`presentation="auto"`）では、開いている出口があれば一番最後に開いた出口にだけ通知を描き、
 * Provider 直下には描かない。出口が無ければ Provider 直下に描く。
 *
 * - 出口は `pointerEvents="box-none"` なので、通知以外の場所のタッチは下の Sheet / Dialog にそのまま届く。
 * - Android の戻るボタンは、これまでどおり一番上の Sheet / Dialog の `onRequestClose` に届く。
 * - 通知の表示中に Sheet が閉じたら、通知は消えずに Provider 直下（または 1 つ下の出口）へ移る。
 *   表示時間のタイマーと `action` は Provider が持つので、描き先が変わっても途切れない
 *   （描き先が変わると入場アニメはもう一度流れる）。
 * - 通知の `action`（「再試行」など）と閉じるボタンは出口の中にあるので、Sheet を開いたままでも押せる。
 *
 * consumer が自前で RN の `<Modal>` を描く場合は、その中身の最後に `<ToastOutlet />` を置くと、
 * 開いている間の通知がその Modal の前面に出る。
 */
export function ToastProvider({ children, presentation = "auto" }: ToastProviderProps) {
  const [items, setItems] = useState<ToastItem[]>([])
  const topOutlet = useTopToastOutlet()

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const show = useCallback(
    (toastItem: Omit<ToastItem, "id">) => {
      const id = nextId()
      setItems((prev) => [...prev, { ...toastItem, id }])
      const duration = toastItem.duration ?? 3000
      if (duration > 0) setTimeout(() => dismiss(id), duration)
      return id
    },
    [dismiss],
  )

  // fire-and-forget API (`toast()`) が委譲できるよう、マウント中のみ自己登録する。
  useEffect(() => {
    registerProvider({ show, dismiss })
    return () => registerProvider(null)
  }, [show, dismiss])

  const api = useMemo(() => ({ show, dismiss }), [show, dismiss])
  const renderValue = useMemo(() => ({ items, dismiss, presentation }), [items, dismiss, presentation])
  const renderInline = presentation === "inline" || topOutlet === null

  return (
    <ToastContext.Provider value={api}>
      <ToastRenderContext.Provider value={renderValue}>
        {children}
        {renderInline ? <ToastStack items={items} dismiss={dismiss} /> : null}
      </ToastRenderContext.Provider>
    </ToastContext.Provider>
  )
}

export interface ToastOutletProps {
  /**
   * この出口を使うか。置き場所の Modal の `visible` と同じ値を渡す（既定 true）。
   * RN の Modal は閉じるアニメの間など `visible=false` でも中身を描き続けることがあり、
   * その間に通知を閉じかけの Modal へ描かないようにするため。
   */
  active?: boolean
}

/**
 * 通知の出口。RN の `<Modal>` の中身の**最後**（最前面）に置くと、その Modal を開いている間の通知が
 * Modal の前面に描かれる（issue #820）。DS の Sheet / Dialog / Popover などは内部で置いているので、
 * consumer が置く必要があるのは自前で描く RN `<Modal>` の中だけ。
 *
 * - 画面全体を覆う absolute の View だが `pointerEvents="box-none"` で、通知以外の場所のタッチは下へ届く。
 * - 出口が複数マウントされていれば、一番最後に開いた出口にだけ描く（入れ子の Modal の一番上）。
 * - 表示中の通知が無いとき・`ToastProvider` の外に置いたとき・Provider が `presentation="inline"` のときは何も描かない。
 *
 * @example
 * <Modal visible={open} transparent onRequestClose={close}>
 *   <MyPanel />
 *   <ToastOutlet active={open} />
 * </Modal>
 */
export function ToastOutlet({ active = true }: ToastOutletProps = {}) {
  const ctx = useContext(ToastRenderContext)
  const [id] = useState(createToastOutletId)
  const enabled = active && ctx !== null && ctx.presentation === "auto"
  useToastOutletRegistration(id, enabled)
  const topOutlet = useTopToastOutlet()
  if (!ctx || !enabled || topOutlet !== id || ctx.items.length === 0) return null
  return (
    <View
      pointerEvents="box-none"
      style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
    >
      <ToastStack items={ctx.items} dismiss={ctx.dismiss} />
    </View>
  )
}

function ToastStack({ items, dismiss }: { items: ToastItem[]; dismiss: (id: string) => void }) {
  const { scales } = useTheme()
  if (items.length === 0) return null
  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        top: scales.spacing.scale[10],
        left: 0,
        right: 0,
        alignItems: "center",
        gap: scales.spacing.scale[2],
        zIndex: 9999,
      }}
    >
      {items.map((t) => (
        <ToastView key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
      ))}
    </View>
  )
}

function ToastView({ toast: item, onDismiss }: { toast: ToastItem; onDismiss: () => void }) {
  const { theme, scales } = useTheme()
  // render 中の ref 読み取りを避けるため useState の lazy initializer で一度だけ生成
  const [opacity] = useState(() => new Animated.Value(0))
  const [translate] = useState(() => new Animated.Value(-20))

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.timing(translate, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start()
  }, [opacity, translate])

  const palette = {
    default: { bg: theme.surface.primary, fg: theme.text["high-emphasis"] },
    info: { bg: theme.surface.info, fg: theme.text.info },
    success: { bg: theme.surface.success, fg: theme.text.success },
    warning: { bg: theme.surface.warning, fg: theme.text.warning },
    caution: { bg: theme.surface.caution, fg: theme.text.caution },
  }[item.tone ?? "default"]

  return (
    <Animated.View
      accessibilityRole="alert"
      style={{
        opacity,
        transform: [{ translateY: translate }],
        backgroundColor: palette.bg,
        borderRadius: scales.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.border["low-emphasis"],
        paddingHorizontal: scales.spacing.scale[4],
        paddingVertical: scales.spacing.scale[3],
        marginHorizontal: scales.spacing.scale[4],
        shadowColor: theme.overlay.dark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 6,
        flexDirection: "row",
        alignItems: "center",
        gap: scales.spacing.scale[3],
        maxWidth: 480,
      }}
    >
      <View style={{ flex: 1 }}>
        {item.title && (
          <RNText style={[resolveTypo("label.md"), { color: palette.fg }]}>{item.title}</RNText>
        )}
        {item.description && (
          <RNText style={[resolveTypo("body.sm"), { color: palette.fg }]}>
            {item.description}
          </RNText>
        )}
      </View>
      {item.action && (
        <Pressable onPress={item.action.onPress} hitSlop={8} accessibilityRole="button">
          <RNText style={[resolveTypo("label.sm"), { color: palette.fg, textDecorationLine: "underline" }]}>
            {item.action.label}
          </RNText>
        </Pressable>
      )}
      <Pressable onPress={onDismiss} hitSlop={8} accessibilityLabel="閉じる" accessibilityRole="button">
        <RNText style={[resolveTypo("label.sm"), { color: palette.fg }]}>×</RNText>
      </Pressable>
    </Animated.View>
  )
}
