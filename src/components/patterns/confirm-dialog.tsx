import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  /**
   * 処理中に表示するラベル。
   * i18n 対応: 英語では "Processing…" など任意文字列を渡す。
   * @default "処理中…"
   */
  loadingLabel?: string
  /** destructive にすると確認ボタンが赤くなる */
  variant?: "default" | "destructive"
  onConfirm: () => void | Promise<void>
  loading?: boolean
  /**
   * 閉じた後のフォーカス移動を差し替える（AlertDialogContent の onCloseAutoFocus へ渡す）。
   * ConfirmDialog は Trigger を持たないため、既定では閉じた後のフォーカスが body へ落ちる。
   * 開く前の要素へ戻したいときに `event.preventDefault()` して自前で focus する。
   * `ConfirmDialogProvider`（useConfirm）はこれで呼び出し元へフォーカスを戻している。
   */
  onCloseAutoFocus?: (event: Event) => void
}

/**
 * ConfirmDialog — 「アクションを止める」割り込み確認（破壊操作の二段階確認）。
 *
 * `role="alertdialog"`（AlertDialog 基盤）。タスク面の絞り込み・フォーム等とは
 * 別カテゴリで、支援技術には緊急の確認として通知され、**オーバーレイの外側クリックでは
 * 閉じない**（明示的に確認/キャンセルを選ばせる）。PC/SP とも中央表示の
 * アラート（iOS/Android の確認アラート慣習に準拠）。
 *
 * タスク用の中央モーダル（絞り込み等）が要るときは `Dialog` / `Sheet` /
 * `ResponsiveDialog` を使う。
 */
function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "確認",
  cancelLabel = "キャンセル",
  loadingLabel = "処理中…",
  variant = "default",
  onConfirm,
  loading = false,
  onCloseAutoFocus,
}: ConfirmDialogProps) {
  const [pending, setPending] = React.useState(false)
  const isLoading = loading || pending

  const handleConfirm = React.useCallback(async () => {
    setPending(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } finally {
      setPending(false)
    }
  }, [onConfirm, onOpenChange])

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent onCloseAutoFocus={onCloseAutoFocus}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* Cancel は Radix 管理（Esc → キャンセル / 自動クローズ）。見た目は従来踏襲で secondary。 */}
          <AlertDialogCancel variant="secondary" disabled={isLoading}>
            {cancelLabel}
          </AlertDialogCancel>
          {/* 確認は非同期/ローディングを自前管理するため、AlertDialogAction の
              即時自動クローズは使わず Button。onConfirm 完了後に閉じる。 */}
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? loadingLabel : confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

/** useConfirm() の confirm に渡す内容。ConfirmDialog の表示系 props と同じ名前・既定値。 */
type ConfirmOptions = Pick<
  ConfirmDialogProps,
  "title" | "description" | "confirmLabel" | "cancelLabel" | "loadingLabel" | "variant"
>

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>

interface ConfirmRequest {
  id: number
  options: ConfirmOptions
  resolve: (value: boolean) => void
  /** confirm() を呼んだ時点でフォーカスがあった要素（閉じた後に戻す先）。 */
  returnFocus: HTMLElement | null
}

interface ConfirmQueueState {
  /** 表示中（または閉じるアニメーション中）の要求。 */
  active: ConfirmRequest | null
  open: boolean
  /** 表示待ちの要求。先頭から順に表示する。 */
  queue: ConfirmRequest[]
}

const ConfirmContext = React.createContext<ConfirmFn | null>(null)

let nextConfirmId = 0

interface ConfirmDialogProviderProps {
  children?: React.ReactNode
}

/**
 * ConfirmDialogProvider — `useConfirm()` を使えるようにする Provider。アプリのルートに 1 つ置く。
 *
 * - `confirm(options)` が呼ばれると ConfirmDialog を開き、確認で true、
 *   キャンセル / Esc で false に resolve する。
 * - 同時に複数呼ばれたら順番待ちにして 1 件ずつ表示する。
 * - Provider が unmount されたとき、未解決の confirm は false で resolve する
 *   （画面遷移で await が宙に浮いたままにならないようにする）。
 * - 閉じた後は confirm() を呼んだ時点でフォーカスがあった要素へフォーカスを戻す。
 */
function ConfirmDialogProvider({ children }: ConfirmDialogProviderProps) {
  const [state, setState] = React.useState<ConfirmQueueState>({ active: null, open: false, queue: [] })
  // settle / unmount は setState の更新関数の外で resolve する（更新関数の中で resolve すると
  // StrictMode の二重実行で副作用が重複する）。そのため表示中・未解決の要求を ref でも持つ。
  const activeRef = React.useRef<ConfirmRequest | null>(null)
  // render 中に ref を書かない（react-hooks/refs）。commit 直後に同期する。
  React.useLayoutEffect(() => {
    activeRef.current = state.open ? state.active : null
  }, [state.open, state.active])
  const pendingRef = React.useRef(new Set<ConfirmRequest>())

  const confirm = React.useCallback<ConfirmFn>(
    (options) =>
      new Promise<boolean>((resolve) => {
        const focused = typeof document !== "undefined" ? document.activeElement : null
        const request: ConfirmRequest = {
          id: nextConfirmId++,
          options,
          resolve,
          returnFocus: focused instanceof HTMLElement ? focused : null,
        }
        pendingRef.current.add(request)
        setState((prev) => {
          if (!(prev.active && prev.open)) return { active: request, open: true, queue: prev.queue }
          // 表示中のダイアログから呼ばれた場合、その時点のフォーカスはダイアログ内にあり
          // 閉じた後には存在しない。最初の呼び出し元へ戻すため戻り先を引き継ぐ
          // （同じ値の代入なので StrictMode の二重実行でも結果は変わらない）。
          request.returnFocus = prev.active.returnFocus
          return { ...prev, queue: [...prev.queue, request] }
        })
      }),
    []
  )

  // id で対象を固定する。確認ボタンの後に ConfirmDialog が onOpenChange(false) を
  // 非同期に続けて呼ぶため、その間に次の要求へ切り替わっていても誤って false で
  // resolve しないようにする。
  const settle = React.useCallback((id: number, value: boolean) => {
    const request = activeRef.current
    if (!request || request.id !== id) return
    activeRef.current = null
    pendingRef.current.delete(request)
    request.resolve(value)
    // 待ちがあれば続けて表示し、無ければ閉じる（閉じるアニメーションは AlertDialog に任せる）。
    setState((prev) => {
      const [next, ...rest] = prev.queue
      return next ? { active: next, open: true, queue: rest } : { ...prev, open: false }
    })
  }, [])

  React.useEffect(() => {
    const pending = pendingRef.current
    return () => {
      for (const request of pending) request.resolve(false)
      pending.clear()
    }
  }, [])

  const active = state.active
  const handleCloseAutoFocus = React.useCallback(
    (event: Event) => {
      // Trigger が無いので Radix 既定のままだと body へ落ちる。呼び出し元へ戻す。
      const target = active?.returnFocus
      if (target?.isConnected) {
        event.preventDefault()
        target.focus()
      }
    },
    [active]
  )

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {active ? (
        <ConfirmDialog
          key={active.id}
          {...active.options}
          open={state.open}
          // 確認ボタン → onConfirm（true）→ ConfirmDialog が onOpenChange(false) を続けて呼ぶが、
          // settle 済みなので 2 回目は何もしない。キャンセル / Esc は onOpenChange(false) だけ来る。
          onConfirm={() => settle(active.id, true)}
          onOpenChange={(next) => {
            if (!next) settle(active.id, false)
          }}
          onCloseAutoFocus={handleCloseAutoFocus}
        />
      ) : null}
    </ConfirmContext.Provider>
  )
}

/**
 * useConfirm — `window.confirm()` の置き換え。
 *
 * ```tsx
 * const confirm = useConfirm()
 * if (await confirm({ title: "削除しますか？", variant: "destructive", confirmLabel: "削除する" })) {
 *   await remove()
 * }
 * ```
 *
 * `<ConfirmDialogProvider>` の内側でだけ使える（外側で呼ぶと例外）。
 * 確認ボタンを押した時点で true に resolve してダイアログを閉じる。処理中表示を
 * ダイアログ内に出したい（閉じるのを処理完了まで待ちたい）場合は、ConfirmDialog を
 * 直接置いて非同期の onConfirm を渡す。
 */
function useConfirm(): ConfirmFn {
  const confirm = React.useContext(ConfirmContext)
  if (!confirm) {
    throw new Error("useConfirm は <ConfirmDialogProvider> の内側で使ってください。")
  }
  return confirm
}

export { ConfirmDialog, ConfirmDialogProvider, useConfirm }
export type { ConfirmDialogProps, ConfirmDialogProviderProps, ConfirmOptions, ConfirmFn }
