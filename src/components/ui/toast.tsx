import * as React from "react"
import { usePortalContainer, type PortalContainer } from "./portal-container"
import { createPortal } from "react-dom"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useKskLabels } from "./ksk-labels"

const toastVariants = cva(
  "relative flex w-full items-center gap-3 overflow-hidden rounded-lg border border-[var(--Border-Low-Emphasis)] p-4 shadow-[var(--shadow-lg)] transition-all animate-fade-in-up",
  {
    variants: {
      variant: {
        default: "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)]",
        success: "border-[var(--Border-Success)] bg-[var(--Surface-Success)] text-[var(--Text-Success)]",
        caution: "border-[var(--Border-Caution)] bg-[var(--Surface-Caution)] text-[var(--Text-Caution)]",
        warning: "border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Warning)] text-[var(--Text-Warning)]",
        info: "border-[var(--Border-Info)] bg-[var(--Surface-Info)] text-[var(--Text-Info)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

type ToastVariant = VariantProps<typeof toastVariants>["variant"]

interface ToastAction {
  /** ボタンに表示するラベル */
  label: string
  /** クリック時のコールバック。toast は自動で dismiss されない（必要なら自前で toast.dismiss(id) を呼ぶ）。 */
  onClick: () => void
}

interface Toast {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
  action?: ToastAction
}

interface ToastOptions {
  description?: string
  variant?: ToastVariant
  /**
   * 自動で消えるまでの時間（ms）。既定 5000。0 は自動で消えない。
   * ポインタ（マウス・ペン）がトースト上にある間・トースト内にキーボードフォーカス
   * （:focus-visible）がある間は止まり、両方が外れると残り時間から再開する
   * （issue #798。WCAG 2.2.1）。タップ・クリックで action を押しただけでは止まらない。
   */
  duration?: number
  /**
   * オプショナルなアクションボタン。指定時は toast 右側に表示。
   * 「元に戻す」「再試行」「詳細」などの即時アクション用途。
   */
  action?: ToastAction
}

// =============================================================
// Singleton toast store
// -------------------------------------------------------------
// Both `<Toaster />` (Provider モード) と モジュールレベルの `toast()`
// (fire-and-forget API) は同じこの store を共有する。
//
// - SSR セーフ: ストアそのものは pure な JS object なので、
//   サーバー側で import されても何も起きない。実際の DOM 操作は
//   `toast()` を呼んだ瞬間（クライアント側）に発生する。
// - `<Toaster />` が既にマウントされている場合は、auto-mounted viewport
//   は自分で何も描画しない（hasMountedToaster フラグで切り替え）。
// =============================================================

/** 自動消去を止めている理由（issue #798）。両方が外れるまで再開しない */
type ToastHoldReason = "hover" | "focus"

/** 自動消去タイマーの状態（issue #798）。duration: 0 のトーストは登録しない */
interface ToastTimer {
  timeoutId: number | undefined
  /** 残り時間（ms）。一時停止のたびに経過分を差し引く */
  remaining: number
  /** 現在のタイマーを張った時刻 */
  startedAt: number
  holds: Set<ToastHoldReason>
}

interface ToastStore {
  toasts: Toast[]
  listeners: Set<() => void>
  timers: Map<string, ToastTimer>
  add: (props: Omit<Toast, "id">) => string
  dismiss: (id: string) => void
  /** 自動消去を一時停止する（ポインタが乗った・フォーカスが入った）。issue #798 */
  hold: (id: string, reason: ToastHoldReason) => void
  /** 一時停止を解く。理由がすべて外れたら残り時間から再開する。issue #798 */
  release: (id: string, reason: ToastHoldReason) => void
  subscribe: (listener: () => void) => () => void
}

let toastIdCounter = 0
function nextToastId(): string {
  toastIdCounter += 1
  return `t${Date.now().toString(36)}-${toastIdCounter.toString(36)}`
}

/**
 * フォーカスがキーボード由来か（issue #798）。`:focus-visible` はマウス・タップで
 * ボタンを押したときは偽、Tab 移動やキーボード操作後の focus() では真になる。
 * セレクタ未対応の環境では、止める側（従来の挙動）に倒す。
 */
function isKeyboardFocus(target: EventTarget): boolean {
  if (!(target instanceof Element)) return true
  try {
    return target.matches(":focus-visible")
  } catch {
    return true
  }
}

function startToastTimer(id: string, timer: ToastTimer) {
  timer.startedAt = Date.now()
  timer.timeoutId = window.setTimeout(() => toastStore.dismiss(id), timer.remaining)
}

const toastStore: ToastStore = {
  toasts: [],
  listeners: new Set(),
  timers: new Map(),
  add(props) {
    const id = nextToastId()
    const next: Toast = { id, ...props }
    toastStore.toasts = [...toastStore.toasts, next]
    toastStore.listeners.forEach((l) => l())
    const duration = props.duration ?? 5000
    if (duration > 0 && typeof window !== "undefined") {
      const timer: ToastTimer = { timeoutId: undefined, remaining: duration, startedAt: 0, holds: new Set() }
      toastStore.timers.set(id, timer)
      startToastTimer(id, timer)
    }
    return id
  },
  hold(id, reason) {
    const timer = toastStore.timers.get(id)
    if (!timer) return
    const wasRunning = timer.holds.size === 0
    timer.holds.add(reason)
    if (!wasRunning) return
    window.clearTimeout(timer.timeoutId)
    timer.timeoutId = undefined
    timer.remaining = Math.max(0, timer.remaining - (Date.now() - timer.startedAt))
  },
  release(id, reason) {
    const timer = toastStore.timers.get(id)
    if (!timer || !timer.holds.delete(reason) || timer.holds.size > 0) return
    startToastTimer(id, timer)
  },
  dismiss(id) {
    const timer = toastStore.timers.get(id)
    if (timer) {
      window.clearTimeout(timer.timeoutId)
      toastStore.timers.delete(id)
    }
    const before = toastStore.toasts.length
    toastStore.toasts = toastStore.toasts.filter((t) => t.id !== id)
    if (toastStore.toasts.length !== before) {
      toastStore.listeners.forEach((l) => l())
    }
  },
  subscribe(listener) {
    toastStore.listeners.add(listener)
    return () => {
      toastStore.listeners.delete(listener)
    }
  },
}

/**
 * `toast.connectionRestored()` などプリセット通知の文言。React の外（module 関数）で出すので
 * KskLabelsProvider は届かない。英語化は `configureToast({ messages })` で渡す（未指定は日本語）。
 */
interface ToastPresetMessages {
  connectionRestored?: string
  saveComplete?: string
  retryStarted?: string
  retryFailed?: string
}

/**
 * fire-and-forget（auto-mount）経路の viewport 読み上げラベル。
 * `configureToast()` で上書きできるモジュールスコープの既定値（後勝ち・
 * リクエスト間で共有されるため SSR では呼ばないこと）。
 * `<Toaster>` 経由の描画は props（regionLabel / closeLabel）が直接
 * viewport に渡るため、region / close / position はこの値に依存しない。
 * `messages`（プリセット通知の文言）だけは `<Toaster>` を使っていてもここ（configureToast）でしか差し替えられない。
 * region / close は `configureToast()` で指定したときだけ値を持ち、未指定なら KskLabelsProvider の
 * `toastRegion` / `close`（Provider 無しは現行の日本語 "通知" / "閉じる"。後方互換）を使う。
 */
const toastLabels: {
  region: string | undefined
  close: string | undefined
  position: ToastViewportPosition
  messages: ToastPresetMessages
} = {
  region: undefined,
  close: undefined,
  position: "bottom-end",
  messages: {},
}

/**
 * viewport の水平位置（issue #691）。
 * - "bottom-end"（既定・従来どおり）: スマホは左右 `--Toast-Viewport-Offset-X` の全幅、sm 以上は右下に最大幅で寄せる
 * - "bottom-center": どの幅でも左右 `--Toast-Viewport-Offset-X` の内側で中央寄せ、最大幅 `--Toast-Viewport-Max-Width`
 */
type ToastViewportPosition = "bottom-end" | "bottom-center"

/**
 * fire-and-forget API（auto-mount viewport）用のラベル設定。
 * regionLabel / closeLabel / position は、`<Toaster>` を使う場合は props で渡せばよく、呼ぶ必要はない。
 * ただし `messages`（プリセット通知の文言）は `<Toaster>` を使っていても `configureToast` でしか差し替えられない。
 */
function configureToast(options: { regionLabel?: string; closeLabel?: string; position?: ToastViewportPosition; messages?: ToastPresetMessages }): void {
  if (options.regionLabel !== undefined) toastLabels.region = options.regionLabel
  if (options.closeLabel !== undefined) toastLabels.close = options.closeLabel
  if (options.position !== undefined) toastLabels.position = options.position
  if (options.messages !== undefined) toastLabels.messages = { ...toastLabels.messages, ...options.messages }
}

/**
 * `<Toaster />` がマウントされているかどうかを追跡するフラグ。
 * fire-and-forget な `toast()` が自動マウントする viewport は、
 * このフラグが立っている時は描画をスキップする
 * （= 既存の `<Toaster />` がレンダリングを担当する）。
 */
let mountedToasterCount = 0
const mountedToasterListeners = new Set<() => void>()
function setToasterMounted(delta: 1 | -1) {
  mountedToasterCount += delta
  mountedToasterListeners.forEach((l) => l())
  // StrictMode の effect 二重実行（+1 → -1 → +1）は同期で終わるので、microtask に回して
  // 最終的な数だけで判断する（一瞬 0 になっても auto-root を作らない）。
  queueMicrotask(syncAutoRoot)
}
function subscribeToasterMounted(listener: () => void) {
  mountedToasterListeners.add(listener)
  return () => {
    mountedToasterListeners.delete(listener)
  }
}

// =============================================================
// React hooks
// =============================================================

/**
 * server snapshot は「毎回同じ参照」でなければならない。`() => []` は呼ばれる
 * たびに別インスタンスを返すため、React が
 * 「The result of getServerSnapshot should be cached to avoid an infinite loop」
 * を警告する（issue #489）。モジュール定数で参照を固定する。
 * freeze は「この配列は共有物なので書き換えない」ことを型の外側でも示すため。
 */
const EMPTY_TOASTS: readonly Toast[] = Object.freeze([]) as readonly Toast[]

function useToastStoreSnapshot(): readonly Toast[] {
  const subscribe = React.useCallback((cb: () => void) => toastStore.subscribe(cb), [])
  const getSnapshot = React.useCallback(() => toastStore.toasts, [])
  const getServerSnapshot = React.useCallback(() => EMPTY_TOASTS, [])
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/**
 * hydration が済んだ後にだけ true を返す。SSR/SSG された HTML への hydration では
 * 「サーバー出力とクライアント初回 render が一致すること」が React の契約なので、
 * portal のような client-only な出力は初回 render では出さず、hydration 後に出す。
 * `typeof document === "undefined"` を render 中に分岐すると初回 render から
 * portal が出てしまい、必ず hydration mismatch になる（issue #489）。
 *
 * useSyncExternalStore の getServerSnapshot は **hydration 中のクライアント初回
 * render でも使われる**ので、hydration では false → 完了後 true になる。
 * 一方 hydration を伴わない純 CSR（`toast()` の auto-mount は createRoot 経由）では
 * getSnapshot が使われるため初回から true で、遅延は発生しない。
 * useState + useEffect でも同じ結果になるが、effect 内 setState は
 * react-hooks/set-state-in-effect に触れるうえ CSR 経路にも 1 render 余計に要る。
 */
const subscribeToNothing = () => () => {}
const getHydratedSnapshot = () => true
const getHydratingSnapshot = () => false

function useIsHydrated(): boolean {
  return React.useSyncExternalStore(
    subscribeToNothing,
    getHydratedSnapshot,
    getHydratingSnapshot
  )
}

function useIsToasterMounted() {
  const subscribe = React.useCallback((cb: () => void) => subscribeToasterMounted(cb), [])
  const getSnapshot = React.useCallback(() => mountedToasterCount > 0, [])
  const getServerSnapshot = React.useCallback(() => false, [])
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

interface ToastContextValue {
  toast: (props: Omit<Toast, "id">) => void
}

// 後方互換のため Context は残すが、null でも動くようにする。
// 旧コード: `<Toaster>...<useToast()>...</Toaster>` はそのまま動く。
// 新コード: Provider 不在でも `useToast()` は singleton 経由で動く。
const ToastContext = React.createContext<ToastContextValue | null>(null)

function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext)
  return ctx ?? { toast: (props) => toastStore.add(props) }
}

// =============================================================
// Viewport (shared between Toaster と auto-mounted root)
// =============================================================

/**
 * トーストの表示が外れたとき（Toaster の unmount・container の切り替え・auto-mount viewport から
 * 明示 Toaster への引き継ぎ）に、その表示が掛けていた一時停止を解く。表示ごと消えると
 * pointerleave / blur が届かず、store に停止が残って二度と消えなくなるため（issue #798）。
 */
function ReleaseToastHoldsOnUnmount({ id }: { id: string }) {
  React.useEffect(
    () => () => {
      toastStore.release(id, "hover")
      toastStore.release(id, "focus")
    },
    [id]
  )
  return null
}

function ToastViewport({ regionLabel, closeLabel, container, position }: { regionLabel?: string; closeLabel?: string; container?: PortalContainer; position?: ToastViewportPosition } = {}) {
  const defaultLabels = useKskLabels()
  const resolvedPosition = position ?? toastLabels.position
  const portalContainer = usePortalContainer(container)
  const toasts = useToastStoreSnapshot()
  const hydrated = useIsHydrated()
  // 初回 render はサーバー出力（= 何も出さない）と一致させる。
  if (!hydrated || typeof document === "undefined") return null
  return createPortal(
    <div
      data-slot="toast-viewport"
      role="region"
      aria-label={regionLabel ?? toastLabels.region ?? defaultLabels.toastRegion}
      // 常設コンテナを live region にする（トースト要素自身への role="status" 付与は
      // 挿入時に読み上げられない SR があるため、追加を polite で通知する構成）
      aria-live="polite"
      // 下端 offset は product theme の公開変数（issue #503）。既定 1rem は
      // 従来の bottom-4 と同値で、上書きしない限り 1px も変わらない。下部タブバーや
      // FAB を fixed で置くプロダクトは :root で持ち上げる（fire-and-forget の
      // auto-mount viewport にも同じく効く）。
      // 左右の余白・最大幅も product theme の公開変数（issue #691）。既定 1rem / 24rem は従来の
      // left-4 right-4 / sm:max-w-sm と同値。
      data-position={resolvedPosition}
      className={cn(
        "fixed bottom-[var(--Toast-Viewport-Offset-Bottom)] right-[var(--Toast-Viewport-Offset-X)] left-[var(--Toast-Viewport-Offset-X)] z-[var(--Z-Toast)] flex flex-col items-stretch gap-2",
        resolvedPosition === "bottom-center"
          ? "mx-auto max-w-[var(--Toast-Viewport-Max-Width)]"
          : "sm:left-auto sm:w-full sm:max-w-[var(--Toast-Viewport-Max-Width)]"
      )}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          data-slot="toast"
          data-variant={t.variant ?? "default"}
          // caution は割り込みで即時通知
          role={t.variant === "caution" ? "alert" : undefined}
          className={cn(toastVariants({ variant: t.variant }))}
          // ポインタが乗っている間・中にキーボードフォーカスがある間は自動消去を止め、
          // 離れたら残り時間から再開する（issue #798。WCAG 2.2.1）。
          // タッチは対象外: タップでも pointerenter は届くが、pointerleave は別の場所を
          // 触るまで来ないため、止めると押した後に消えなくなる。
          onPointerEnter={(e) => {
            if (e.pointerType !== "touch") toastStore.hold(t.id, "hover")
          }}
          onPointerLeave={() => toastStore.release(t.id, "hover")}
          // フォーカスはキーボード由来（:focus-visible）のときだけ止める。マウス・タップで
          // action を押すとブラウザがボタンへフォーカスを移すが、押した後はポインタが離れれば
          // 消えてほしい（フォーカスで止めると、別の場所を押すまで残り続ける）。
          onFocus={(e) => {
            if (isKeyboardFocus(e.target)) toastStore.hold(t.id, "focus")
            else toastStore.release(t.id, "focus")
          }}
          onBlur={(e) => {
            // トースト内の移動（action → 閉じるボタン等）では再開しない
            if (e.currentTarget.contains(e.relatedTarget as Node | null)) return
            toastStore.release(t.id, "focus")
          }}
        >
          <ReleaseToastHoldsOnUnmount id={t.id} />
          <div className="flex-1 min-w-0">
            <p className="typo-label-md">{t.title}</p>
            {t.description && (
              <p className="typo-body-sm mt-0.5 opacity-80">{t.description}</p>
            )}
          </div>
          {t.action && (
            <button
              data-slot="toast-action"
              onClick={() => t.action!.onClick()}
              className="shrink-0 typo-label-sm underline underline-offset-2 hover:no-underline cursor-pointer"
            >
              {t.action.label}
            </button>
          )}
          <button
            data-slot="button"
            onClick={() => toastStore.dismiss(t.id)}
            className="shrink-0 text-[var(--Object-Medium-Emphasis)] hover:text-[var(--Object-High-Emphasis)] cursor-pointer"
            aria-label={closeLabel ?? toastLabels.close ?? defaultLabels.close}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ))}
    </div>,
    portalContainer ?? document.body
  )
}

// =============================================================
// <Toaster /> — Provider モード（既存 API、後方互換）
// =============================================================

interface ToasterProps {
  /** 描画先。未指定は Provider、null は document.body。Shadow DOM では Toaster を明示配置する。 */
  container?: PortalContainer
  children?: React.ReactNode
  /** viewport (role="region") の aria-label。省略時は `configureToast` の値 > KskLabelsProvider の `toastRegion`（Provider 無しは "通知"。locale="en" で "Notifications"） */
  regionLabel?: string
  /** 各トーストの閉じるボタンの aria-label。省略時は `configureToast` の値 > KskLabelsProvider の `close`（Provider 無しは "閉じる"。locale="en" で "Close"） */
  closeLabel?: string
  /**
   * viewport の水平位置（issue #691）。"bottom-end"（既定・従来どおり右下）/ "bottom-center"（中央）。
   * 左右の余白と最大幅は product theme 変数 `--Toast-Viewport-Offset-X` / `--Toast-Viewport-Max-Width`。
   * `<Toaster>` を置かない fire-and-forget 経路は `configureToast({ position })` で指定する。
   */
  position?: ToastViewportPosition
}

function Toaster({ children, regionLabel, closeLabel, container, position }: ToasterProps) {
  // 自動マウントされた viewport との二重描画を避けるため、
  // マウント中フラグを立てる。
  React.useEffect(() => {
    setToasterMounted(1)
    return () => setToasterMounted(-1)
  }, [])

  const toast = React.useCallback<ToastContextValue["toast"]>((props) => {
    toastStore.add(props)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastViewport regionLabel={regionLabel} closeLabel={closeLabel} container={container} position={position} />
    </ToastContext.Provider>
  )
}

// =============================================================
// AutoToastViewport — fire-and-forget API 用の自動マウント viewport
// -------------------------------------------------------------
// `<Toaster />` が無く、表示中のトーストがあるときだけ `document.body` 直下に
// `<div data-ksk-toast-auto-root>` を作り、その中で react-dom の
// createRoot で render する。0 件になる・Toaster がマウントされると外す（#771）。
// Toaster がある間は何も作らない（= 既存 viewport がそのまま表示する）。
// =============================================================

function AutoToastViewport() {
  const isToasterMounted = useIsToasterMounted()
  if (isToasterMounted) return null
  return <ToastViewport />
}

interface AutoRoot {
  container: HTMLElement
  /** createRoot の完了前に破棄されたら true（完了後に root を作らず container だけ外す） */
  disposed: boolean
  root: { render: (node: React.ReactNode) => void; unmount: () => void } | null
}

let autoRoot: AutoRoot | null = null
let autoRootRetryScheduled = false

/**
 * auto-root が要る状態か。`<Toaster>` が 1 つも無く、かつ表示中のトーストがあるときだけ。
 * 退場アニメーションは無く store から消えた時点で表示も消えるため、0 件判定は store の件数で足りる。
 */
function isAutoRootWanted(): boolean {
  return mountedToasterCount === 0 && toastStore.toasts.length > 0
}

function mountAutoRoot(): void {
  // body が存在しない（<head> 内で実行された等）場合は次の tick で再試行
  if (!document.body) {
    if (autoRootRetryScheduled) return
    autoRootRetryScheduled = true
    window.setTimeout(() => {
      autoRootRetryScheduled = false
      syncAutoRoot()
    }, 0)
    return
  }
  // 別モジュールインスタンス（HMR 等）が作った auto-root が残っていれば何もしない
  if (document.querySelector("[data-ksk-toast-auto-root]")) return

  const container = document.createElement("div")
  container.setAttribute("data-ksk-toast-auto-root", "")
  document.body.appendChild(container)
  const handle: AutoRoot = { container, disposed: false, root: null }
  autoRoot = handle

  // react-dom/client は client-only。動的 import で SSR バンドル時の
  // 解決を遅延させる（ただし当パッケージ自体が "use client" バナー付き
  // なのでサーバー側でこのコードパスに来ることはないはず）。
  void import("react-dom/client").then(({ createRoot }) => {
    if (handle.disposed) {
      container.remove()
      return
    }
    handle.root = createRoot(container)
    handle.root.render(<AutoToastViewport />)
  })
}

function unmountAutoRoot(): void {
  const handle = autoRoot
  if (!handle) return
  autoRoot = null
  handle.disposed = true
  // 呼び出し元は React のイベントハンドラ / effect の中のことがあるので、unmount は次の microtask へ逃がす
  queueMicrotask(() => {
    handle.root?.unmount()
    handle.container.remove()
  })
}

/**
 * auto-root（`document.body` 直下の fallback viewport）の有無を「今要るか」に合わせる。
 * `<Toaster>` がある間と、トーストが 0 件のときは作らず、残さない。
 */
function syncAutoRoot(): void {
  if (typeof window === "undefined" || typeof document === "undefined") return
  const wanted = isAutoRootWanted()
  if (wanted && !autoRoot) mountAutoRoot()
  else if (!wanted && autoRoot) unmountAutoRoot()
}

// store の増減で追従する。モジュール読み込み時の副作用は購読の登録だけ（DOM には触れない）。
toastStore.subscribe(syncAutoRoot)

// =============================================================
// Fire-and-forget API
// =============================================================

interface ToastFn {
  (title: string, options?: ToastOptions): string
  success: (title: string, options?: ToastOptions) => string
  error: (title: string, options?: ToastOptions) => string
  info: (title: string, options?: ToastOptions) => string
  warning: (title: string, options?: ToastOptions) => string
  caution: (title: string, options?: ToastOptions) => string
  connectionRestored: (options?: ToastOptions) => string
  saveComplete: (options?: ToastOptions) => string
  retryStarted: (options?: ToastOptions) => string
  retryFailed: (options?: ToastOptions) => string
  dismiss: (id: string) => void
}

function showToast(title: string, options: ToastOptions = {}, variant?: ToastVariant): string {
  // SSR ガード: サーバー側で呼ばれた場合は no-op（dummy id を返す）。
  // Next.js App Router で Server Action 内から呼ばれても落ちないように。
  if (typeof window === "undefined") return ""
  return toastStore.add({
    title,
    description: options.description,
    variant: variant ?? options.variant,
    duration: options.duration,
    action: options.action,
  })
}

const toast = ((title: string, options?: ToastOptions) =>
  showToast(title, options)) as ToastFn
toast.success = (title, options) => showToast(title, options, "success")
toast.error = (title, options) => showToast(title, options, "caution")
toast.info = (title, options) => showToast(title, options, "info")
toast.warning = (title, options) => showToast(title, options, "warning")
toast.caution = (title, options) => showToast(title, options, "caution")
toast.connectionRestored = (options) =>
  showToast(toastLabels.messages.connectionRestored ?? "接続が復旧しました", options, "success")
toast.saveComplete = (options) =>
  showToast(toastLabels.messages.saveComplete ?? "保存しました", options, "success")
toast.retryStarted = (options) =>
  showToast(toastLabels.messages.retryStarted ?? "再試行を開始しました", options, "info")
toast.retryFailed = (options) =>
  showToast(toastLabels.messages.retryFailed ?? "再試行できませんでした", options, "caution")
toast.dismiss = (id: string) => toastStore.dismiss(id)

export { Toaster, useToast, toast, toastVariants, configureToast }
export type { ToastPresetMessages, Toast, ToastVariant, ToastOptions, ToastFn, ToastAction, ToastViewportPosition, ToasterProps }
