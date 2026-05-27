"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ErrorBoundaryLabels {
  /** ヒーロー絵文字 / アイコン代わり。既定 "😢" */
  emoji?: string
  /** タイトル。既定 "Something went wrong" */
  title?: string
  /** 説明文。既定 "Your data is safe. Use the buttons below to recover." */
  description?: string
  /** リロードボタン。既定 "Reload" */
  reloadLabel?: string
  /** リセット (再試行) ボタン。onReset 指定時のみ表示。既定 "Try again" */
  resetLabel?: string
}

export interface ErrorBoundaryProps {
  children: React.ReactNode
  /** fallback 内で使う文言。i18n はアプリ側で解決して string を渡す。 */
  labels?: ErrorBoundaryLabels
  /**
   * onError コールバック。logger / error tracking 連携用。
   * dev では console.error が常に呼ばれる (NODE_ENV !== "production")。
   */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  /**
   * 指定すると fallback に "再試行" ボタンが出る。クリックで catch 状態
   * (hasError) をリセットし、子をもう一度マウントする。
   * 未指定なら reload ボタンのみ。
   */
  onReset?: () => void
  /** 完全カスタム fallback を渡したい場合 (labels より優先) */
  fallback?: React.ReactNode | ((error: Error | null, reset: () => void) => React.ReactNode)
  /** fallback 外枠の追加 className */
  className?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

const DEFAULT_LABELS: Required<ErrorBoundaryLabels> = {
  emoji: "😢",
  title: "Something went wrong",
  description: "Your data is safe. Use the buttons below to recover.",
  reloadLabel: "Reload",
  resetLabel: "Try again",
}

/**
 * ErrorBoundary — React の componentDidCatch をラップした汎用フォールバック。
 *
 * - labels prop で i18n 上書き
 * - onError で logger / Sentry 等への連携
 * - onReset 指定で「再試行」ボタンを表示 (hasError をリセットして再マウント)
 * - fallback prop で完全カスタムレンダリングも可
 *
 * @example
 * <ErrorBoundary
 *   labels={{
 *     title: t("errors.generic_title"),
 *     description: t("errors.unexpected_reload"),
 *     reloadLabel: t("errors.reload"),
 *   }}
 *   onError={(e, info) => reportToSentry(e, info)}
 * >
 *   <App />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
      // dev 環境では常にログ
      // eslint-disable-next-line no-console
      console.error("[ksk-ds ErrorBoundary]", error, errorInfo)
    }
    this.props.onError?.(error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    this.props.onReset?.()
  }

  handleReload = () => {
    if (typeof window !== "undefined") window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    const { fallback, labels, onReset, className } = this.props
    const merged = { ...DEFAULT_LABELS, ...labels }

    if (fallback) {
      return typeof fallback === "function" ? fallback(this.state.error, this.handleReset) : fallback
    }

    return (
      <div
        data-slot="error-boundary-fallback"
        role="alert"
        className={cn(
          "flex flex-col items-center justify-center min-h-screen p-8 text-center bg-[var(--Surface-Primary)]",
          className,
        )}
      >
        <div className="max-w-md w-full">
          <p className="text-5xl mb-4" aria-hidden="true">{merged.emoji}</p>
          <h2 className="typo-heading-lg text-[var(--Text-High-Emphasis)] mb-2">{merged.title}</h2>
          <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)] mb-6 whitespace-pre-line">
            {merged.description}
          </p>
          <div className="flex flex-col gap-2 items-stretch sm:flex-row sm:justify-center">
            {onReset && (
              <Button variant="secondary" size="lg" onClick={this.handleReset}>
                {merged.resetLabel}
              </Button>
            )}
            <Button size="lg" onClick={this.handleReload}>
              {merged.reloadLabel}
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
