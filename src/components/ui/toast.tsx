import * as React from "react"
import { createPortal } from "react-dom"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toastVariants = cva(
  "pointer-events-auto relative flex w-full items-center gap-3 overflow-hidden rounded-lg border p-4 shadow-[var(--shadow-lg)] transition-all animate-fade-in-up",
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

interface Toast {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

interface ToastOptions {
  description?: string
  variant?: ToastVariant
  duration?: number
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

interface ToastStore {
  toasts: Toast[]
  listeners: Set<() => void>
  add: (props: Omit<Toast, "id">) => string
  dismiss: (id: string) => void
  subscribe: (listener: () => void) => () => void
}

let toastIdCounter = 0
function nextToastId(): string {
  toastIdCounter += 1
  return `t${Date.now().toString(36)}-${toastIdCounter.toString(36)}`
}

const toastStore: ToastStore = {
  toasts: [],
  listeners: new Set(),
  add(props) {
    const id = nextToastId()
    const next: Toast = { id, ...props }
    toastStore.toasts = [...toastStore.toasts, next]
    toastStore.listeners.forEach((l) => l())
    const duration = props.duration ?? 5000
    if (duration > 0 && typeof window !== "undefined") {
      window.setTimeout(() => toastStore.dismiss(id), duration)
    }
    return id
  },
  dismiss(id) {
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

function useToastStoreSnapshot() {
  const subscribe = React.useCallback((cb: () => void) => toastStore.subscribe(cb), [])
  const getSnapshot = React.useCallback(() => toastStore.toasts, [])
  const getServerSnapshot = React.useCallback(() => [] as Toast[], [])
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
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

function ToastViewport() {
  const toasts = useToastStoreSnapshot()
  if (typeof document === "undefined") return null
  return createPortal(
    <div
      data-slot="toast-viewport"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none"
    >
      {toasts.map((t) => (
        <div key={t.id} className={cn(toastVariants({ variant: t.variant }))}>
          <div className="flex-1 min-w-0">
            <p className="typo-label-md">{t.title}</p>
            {t.description && (
              <p className="typo-body-sm mt-0.5 opacity-80">{t.description}</p>
            )}
          </div>
          <button
            data-slot="button"
            onClick={() => toastStore.dismiss(t.id)}
            className="shrink-0 text-[var(--Object-Medium-Emphasis)] hover:text-[var(--Object-High-Emphasis)] cursor-pointer"
            aria-label="閉じる"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ))}
    </div>,
    document.body
  )
}

// =============================================================
// <Toaster /> — Provider モード（既存 API、後方互換）
// =============================================================

function Toaster({ children }: { children?: React.ReactNode }) {
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
      <ToastViewport />
    </ToastContext.Provider>
  )
}

// =============================================================
// AutoToastViewport — fire-and-forget API 用の自動マウント viewport
// -------------------------------------------------------------
// `toast()` が初回呼び出しされたとき、`document.body` 直下に
// `<div data-slot="toast-auto-root">` を作成し、その中で react-dom の
// createRoot で render する。`<Toaster />` が既にあれば自分は何も
// 描画しない（= 既存 viewport がそのまま表示する）。
// =============================================================

function AutoToastViewport() {
  const isToasterMounted = useIsToasterMounted()
  if (isToasterMounted) return null
  return <ToastViewport />
}

let autoMountPromise: Promise<void> | null = null

function ensureAutoMounted(): void {
  if (typeof window === "undefined" || typeof document === "undefined") return
  if (autoMountPromise) return
  // body が存在しない（<head> 内で実行された等）場合は次の tick で再試行
  if (!document.body) {
    autoMountPromise = new Promise<void>((resolve) => {
      const tryMount = () => {
        if (document.body) {
          autoMountPromise = null
          ensureAutoMounted()
          resolve()
        } else {
          window.setTimeout(tryMount, 0)
        }
      }
      tryMount()
    })
    return
  }

  // 既に他の場所で auto-root が作られていれば（HMR 等）何もしない
  if (document.querySelector("[data-ksk-toast-auto-root]")) return

  const container = document.createElement("div")
  container.setAttribute("data-ksk-toast-auto-root", "")
  document.body.appendChild(container)

  // react-dom/client は client-only。動的 import で SSR バンドル時の
  // 解決を遅延させる（ただし当パッケージ自体が "use client" バナー付き
  // なのでサーバー側でこのコードパスに来ることはないはず）。
  autoMountPromise = import("react-dom/client").then(({ createRoot }) => {
    const root = createRoot(container)
    root.render(<AutoToastViewport />)
  })
}

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
  dismiss: (id: string) => void
}

function showToast(title: string, options: ToastOptions = {}, variant?: ToastVariant): string {
  // SSR ガード: サーバー側で呼ばれた場合は no-op（dummy id を返す）。
  // Next.js App Router で Server Action 内から呼ばれても落ちないように。
  if (typeof window === "undefined") return ""
  ensureAutoMounted()
  return toastStore.add({
    title,
    description: options.description,
    variant: variant ?? options.variant,
    duration: options.duration,
  })
}

const toast = ((title: string, options?: ToastOptions) =>
  showToast(title, options)) as ToastFn
toast.success = (title, options) => showToast(title, options, "success")
toast.error = (title, options) => showToast(title, options, "caution")
toast.info = (title, options) => showToast(title, options, "info")
toast.warning = (title, options) => showToast(title, options, "warning")
toast.caution = (title, options) => showToast(title, options, "caution")
toast.dismiss = (id: string) => toastStore.dismiss(id)

export { Toaster, useToast, toast, toastVariants }
export type { Toast, ToastVariant, ToastOptions, ToastFn }
