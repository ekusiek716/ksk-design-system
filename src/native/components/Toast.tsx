import React, { createContext, useCallback, useContext, useEffect, useState } from "react"
import { Animated, View, Text as RNText, Pressable } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

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

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { scales } = useTheme()
  const [items, setItems] = useState<ToastItem[]>([])

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

  return (
    <ToastContext.Provider value={{ show, dismiss }}>
      {children}
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
    </ToastContext.Provider>
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
