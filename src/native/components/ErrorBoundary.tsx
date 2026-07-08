import React from "react"
import { View } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { Text } from "./Text"
import { Button } from "./Button"

/**
 * ErrorBoundary (native) — React の componentDidCatch をラップした汎用フォールバック。
 * 正本: src/components/ui/error-boundary.tsx（Web 版。API はこちらと対応）。
 *
 * Web 版との差分:
 *  - fallback UI は div/Button(Web) ではなく View/Text/Button(native) で再構成。
 *  - `window.location.reload()` は native に存在しないため、`onRetry` prop
 *    （state リセット + 呼び出し側コールバック）に置換した。呼び出し側は
 *    onRetry で「画面の再取得・再フェッチ」等、アプリごとの復旧処理を渡す。
 *    Web 版の reload ボタンに相当するのが本コンポーネントの `onRetry` ボタン。
 */
interface ErrorBoundaryLabels {
  /** ヒーロー絵文字。既定 "😢" */
  emoji?: string
  /** タイトル。既定 "問題が発生しました" */
  title?: string
  /** 説明文。既定 "データは保持されています。下のボタンで復旧してください。" */
  description?: string
  /** 再試行ボタンラベル。onRetry 指定時のみ表示。既定 "再試行" */
  retryLabel?: string
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
   * 再試行ボタン押下時のコールバック。呼ばれるとまず内部の hasError を
   * リセットして子を再マウントし、その後にこのコールバックを呼ぶ
   * （画面の再フェッチ等、アプリ固有の復旧処理はここで行う）。
   * 未指定の場合は再試行ボタン自体を表示しない。
   */
  onRetry?: () => void
  /** 完全カスタム fallback を渡したい場合 (labels より優先) */
  fallback?: React.ReactNode | ((error: Error | null, reset: () => void) => React.ReactNode)
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

const DEFAULT_LABELS: Required<ErrorBoundaryLabels> = {
  emoji: "😢",
  title: "問題が発生しました",
  description: "データは保持されています。下のボタンで復旧してください。",
  retryLabel: "再試行",
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    if (proc && proc.env?.NODE_ENV !== "production") {
      // dev 環境では常にログ
      console.error("[ksk-ds native ErrorBoundary]", error, errorInfo)
    }
    this.props.onError?.(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
    this.props.onRetry?.()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    const { fallback, labels, onRetry } = this.props
    const merged = { ...DEFAULT_LABELS, ...labels }

    if (fallback) {
      return typeof fallback === "function" ? fallback(this.state.error, this.handleRetry) : fallback
    }

    return <ErrorBoundaryFallback merged={merged} onRetry={onRetry} handleRetry={this.handleRetry} />
  }
}

function ErrorBoundaryFallback({
  merged,
  onRetry,
  handleRetry,
}: {
  merged: Required<ErrorBoundaryLabels>
  onRetry?: () => void
  handleRetry: () => void
}) {
  const { theme, scales } = useTheme()
  return (
    <View
      accessibilityRole="alert"
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: scales.spacing.scale[8],
        gap: scales.spacing.scale[2],
        backgroundColor: theme.surface.primary,
      }}
    >
      <Text style={{ fontSize: 48, textAlign: "center" }} accessibilityElementsHidden importantForAccessibility="no">
        {merged.emoji}
      </Text>
      <Text variant="heading.lg" style={{ textAlign: "center" }}>
        {merged.title}
      </Text>
      <Text
        variant="body.sm"
        color={theme.text["medium-emphasis"]}
        style={{ textAlign: "center", marginBottom: scales.spacing.scale[4] }}
      >
        {merged.description}
      </Text>
      {onRetry && (
        <Button variant="secondary" onPress={handleRetry}>
          {merged.retryLabel}
        </Button>
      )}
    </View>
  )
}
