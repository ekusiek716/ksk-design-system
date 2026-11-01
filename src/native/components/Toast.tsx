import React, { createContext, useCallback, useContext, useEffect, useState } from "react"
import { Animated, Modal, Platform, View, Text as RNText, Pressable } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { useAnyModalVisible } from "../modal-presence"

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
 * - `"auto"`（既定）: DS の native Modal 系（Sheet / Dialog / AlertDialog / ConfirmDialog / Popover /
 *   BottomSheetForm / CoachMarkOverlay / CelebrationDialog など、src/native 配下で RN の `<Modal>` を描く部品）が
 *   1 つ以上開いている間だけ `"modal"`、それ以外は `"inline"` と同じ描き方にする。通知の表示中に Sheet が
 *   開閉したら、通知を消さずに描き先だけ切り替える。Modal 系を開いていない普段の画面では下のタッチを一切奪わない。
 * - `"modal"`: iOS / Android では、表示中の通知があるあいだ常に透明な RN `<Modal>` の中に描く（issue #820）。
 *   **consumer が自前で RN の `<Modal>` を描く場合**は、DS からはその開閉が見えないので `"modal"` を指定する。
 * - `"inline"`: children の兄弟の absolute View に描く（#820 以前の描き方）。下の画面のタッチを一切奪わないが、
 *   RN の `<Modal>` を開いている間はその下に隠れる。
 *
 * Web（react-native-web）はどれを指定しても `"inline"` と同じ描き方にする。react-native-web の Modal は
 * 開くと一番上の Modal にフォーカスを移して閉じ込め、Esc もそちらへ回すため、通知を出すたびに
 * 下の Sheet の入力欄からフォーカスを奪ってしまう。Web アプリは Web 版の `<Toaster>` を使う前提。
 */
export type ToastPresentation = "auto" | "modal" | "inline"

export interface ToastProviderProps {
  children: React.ReactNode
  /**
   * 通知の描き方。既定は `"auto"`（DS の Sheet / Dialog などを開いている間だけ Modal に描いて前面に出す）。
   * 自前の RN `<Modal>` の上にも通知を出したいなら `"modal"`。詳細と制約は {@link ToastProvider} を参照。
   */
  presentation?: ToastPresentation
}

/** iOS の Modal は既定で縦向きしか許さず、横向きの端末で開くと画面を縦へ回してしまう。通知で回転させないよう全向きを許す。 */
const ALL_ORIENTATIONS = [
  "portrait",
  "portrait-upside-down",
  "landscape",
  "landscape-left",
  "landscape-right",
] as const

/**
 * 通知の Provider。アプリのルートに 1 つ置く。
 *
 * ## Modal との前後関係（issue #820）
 * native の Sheet / Dialog / Popover は RN の `<Modal>`（iOS は別の view controller、Android は別のウィンドウ）で、
 * アプリ本体の View に `zIndex` を付けても前に出られない。そのため既定（`presentation="auto"`）では、
 * DS の Modal 系が開いていて、かつ表示中の通知があるあいだだけ、透明な `<Modal transparent animationType="none">`
 * を重ねてその中に通知を描く。通知が 0 件、または Modal 系が 1 つも開いていなければ Modal を描かないので、
 * 下の画面のタッチを奪わない。`"modal"` は Modal 系の開閉を見ずに、通知があるあいだ常に Modal に描く。
 *
 * ## 通知を Modal に描いているあいだの制約（iOS / Android）
 * - **下の画面・下の Sheet のタッチは届かない。** RN の `<Modal>` は常に画面全体を覆い、通知の大きさだけに
 *   縮められず、`pointerEvents="box-none"` でも下の view controller / ウィンドウへタッチを通さない。
 *   そのため通知以外の場所に触れると、その時点の通知をすべて閉じて Modal を外す（下へ届かなかった 1 回の
 *   タッチが無駄にならないよう、次のタッチから下の画面へ届く）。「元に戻す」付きの通知も閉じる。
 * - **Android の戻るボタン**は一番上のウィンドウ＝通知の Modal に届く。何もしないと下の Sheet が閉じられず
 *   （`duration: 0` の通知なら閉じるまでずっと）戻る操作を握りつぶすため、通知をすべて閉じる。
 *   下の Sheet は次の戻る操作で閉じる（1 回で両方は閉じない）。
 * - iOS の VoiceOver は Modal の中だけを読む状態になり、通知を表示しているあいだは下の画面へ移れない。
 * - 通知の `action`（「再試行」など）と閉じるボタンは Modal の中にあるので、Sheet を開いたままでも押せる。
 *
 * 自前の RN `<Modal>` を描く consumer は、その上に通知を出すなら `presentation="modal"` を指定する
 * （`"auto"` は DS 部品の Modal しか数えないため、自前の Modal の下に隠れる）。
 */
export function ToastProvider({ children, presentation = "auto" }: ToastProviderProps) {
  const { scales } = useTheme()
  const anyModalVisible = useAnyModalVisible()
  const [items, setItems] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const dismissAll = useCallback(() => setItems([]), [])

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

  const stack = (
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

  const renderInModal =
    Platform.OS !== "web" &&
    (presentation === "modal" || (presentation === "auto" && anyModalVisible))

  return (
    <ToastContext.Provider value={{ show, dismiss }}>
      {children}
      {!renderInModal ? (
        stack
      ) : items.length > 0 ? (
        <Modal
          visible
          transparent
          animationType="none"
          statusBarTranslucent
          supportedOrientations={[...ALL_ORIENTATIONS]}
          onRequestClose={dismissAll}
        >
          <View pointerEvents="box-none" style={{ flex: 1 }}>
            {/*
              通知以外の場所。RN の Modal は下へタッチを通さないため、触れたら通知を閉じて Modal を外し、
              次のタッチから下の画面へ届くようにする。読み上げの対象にはしない（通知と閉じるボタンだけを読ませる）。
            */}
            <Pressable
              testID="ksk-toast-outside"
              onPressIn={dismissAll}
              accessible={false}
              importantForAccessibility="no"
              style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
            />
            {stack}
          </View>
        </Modal>
      ) : null}
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
