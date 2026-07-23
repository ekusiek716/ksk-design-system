import React from "react";
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
    emoji?: string;
    /** タイトル。既定 "問題が発生しました" */
    title?: string;
    /** 説明文。既定 "データは保持されています。下のボタンで復旧してください。" */
    description?: string;
    /** 再試行ボタンラベル。ボタンは onRetry の有無に関わらず常に表示。既定 "再試行" */
    retryLabel?: string;
}
export interface ErrorBoundaryProps {
    children: React.ReactNode;
    /** fallback 内で使う文言。i18n はアプリ側で解決して string を渡す。 */
    labels?: ErrorBoundaryLabels;
    /**
     * onError コールバック。logger / error tracking 連携用。
     * dev では console.error が常に呼ばれる (NODE_ENV !== "production")。
     */
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
    /**
     * 再試行ボタン押下時のコールバック。ボタンは onRetry の有無に関わらず常に
     * 表示され、押すとまず内部の hasError をリセットして子を再マウントし、
     * その後にこのコールバックを呼ぶ（画面の再フェッチ等、アプリ固有の復旧処理は
     * ここで行う）。未指定でも state リセットによる再試行自体は機能する。
     */
    onRetry?: () => void;
    /** 完全カスタム fallback を渡したい場合 (labels より優先) */
    fallback?: React.ReactNode | ((error: Error | null, reset: () => void) => React.ReactNode);
}
interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}
export declare class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps);
    static getDerivedStateFromError(error: Error): ErrorBoundaryState;
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void;
    handleRetry: () => void;
    render(): string | number | bigint | boolean | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode>> | React.JSX.Element;
}
export {};
