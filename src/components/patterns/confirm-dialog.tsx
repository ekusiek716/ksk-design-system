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
import { useKskLabels } from "../ui/ksk-labels"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  /** 確認ボタンの文言。省略時は KskLabelsProvider の `confirmDialogConfirm`（Provider 無しは "確認"。locale="en" で "Confirm"） */
  confirmLabel?: string
  /** キャンセルボタンの文言。省略時は KskLabelsProvider の `confirmDialogCancel`（Provider 無しは "キャンセル"。locale="en" で "Cancel"） */
  cancelLabel?: string
  /**
   * 処理中に表示するラベル。
   * 省略時は KskLabelsProvider の `confirmDialogLoading`（Provider 無しは "処理中…"。locale="en" で "Processing…"）。
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
 * 処理中（非同期 `onConfirm` の実行中、または `loading={true}`）はキャンセルボタンを
 * 無効にし、Esc でも閉じない（`onOpenChange(false)` を呼ばない。issue #818）。
 * 処理が完了すると `onOpenChange(false)` を 1 回だけ呼んで閉じる。
 *
 * タスク用の中央モーダル（絞り込み等）が要るときは `Dialog` / `Sheet` /
 * `ResponsiveDialog` を使う。
 */
function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel: confirmLabelProp,
  cancelLabel: cancelLabelProp,
  loadingLabel: loadingLabelProp,
  variant = "default",
  onConfirm,
  loading = false,
  onCloseAutoFocus,
}: ConfirmDialogProps) {
  const defaultLabels = useKskLabels()
  const confirmLabel = confirmLabelProp ?? defaultLabels.confirmDialogConfirm
  const cancelLabel = cancelLabelProp ?? defaultLabels.confirmDialogCancel
  const loadingLabel = loadingLabelProp ?? defaultLabels.confirmDialogLoading
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

  // 処理中（pending || loading）は Esc など Radix 経由の「閉じる」要求を握りつぶす（issue #818）。
  // キャンセルボタンを disabled にしても Esc が抜け道になり、裏で onConfirm が続くまま
  // ダイアログだけ消えて「取り消せた」と誤解させていた。完了後の自動クローズは
  // handleConfirm が包む前の onOpenChange を直接呼ぶので、ここでは塞がれない。
  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!next && isLoading) return
      onOpenChange(next)
    },
    [isLoading, onOpenChange]
  )

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent onCloseAutoFocus={onCloseAutoFocus}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* Cancel は Radix 管理（Esc → キャンセル / 自動クローズ）。見た目は従来踏襲で secondary。
              処理中（pending || loading）はボタンも Esc も効かない（Esc は handleOpenChange で塞ぐ。#818）。 */}
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

/**
 * 閉じた後に戻す先として使えるフォーカス要素か。body / 未取得 / 確認ダイアログの中
 * （閉じると消える）は使えない。
 */
function isUsefulReturnFocus(el: HTMLElement | null): el is HTMLElement {
  if (!el || el === el.ownerDocument.body) return false
  return !el.closest('[data-slot="alert-dialog-content"]')
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
  // unmount 後に confirm() が呼ばれた場合（保持していた関数を遷移後に呼ぶ等）、
  // ダイアログを出せず resolve もされない Promise が残るので、即 false で返すために持つ。
  const mountedRef = React.useRef(false)

  const confirm = React.useCallback<ConfirmFn>(
    (options) =>
      new Promise<boolean>((resolve) => {
        if (!mountedRef.current) {
          resolve(false)
          return
        }
        const focused = typeof document !== "undefined" ? document.activeElement : null
        const request: ConfirmRequest = {
          id: nextConfirmId++,
          options,
          resolve,
          returnFocus: focused instanceof HTMLElement ? focused : null,
        }
        pendingRef.current.add(request)
        setState((prev) => {
          // 直前の要求（表示中 / 閉じるアニメーション中）がある間に呼ばれた場合、その時点の
          // フォーカスはダイアログ内（閉じた後には消える要素）か body にある。戻り先として
          // 役に立たないので、直前の要求の戻り先（＝元の呼び出し元）を引き継ぐ。
          // 閉じ中の要求は下で active を差し替えると key 変更で即 unmount し、自分の
          // onCloseAutoFocus を走らせないため、ここで引き継がないとフォーカスが迷子になる
          // （同じ値の代入なので StrictMode の二重実行でも結果は変わらない）。
          if (prev.active && !isUsefulReturnFocus(request.returnFocus)) {
            request.returnFocus = prev.active.returnFocus
          }
          if (!(prev.active && prev.open)) return { active: request, open: true, queue: prev.queue }
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
    mountedRef.current = true
    const pending = pendingRef.current
    return () => {
      mountedRef.current = false
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
