import * as React from "react";
interface ErrorBoundaryLabels {
    /** ヒーロー絵文字 / アイコン代わり。既定 "😢" */
    emoji?: string;
    /** タイトル。既定 "Something went wrong" */
    title?: string;
    /** 説明文。既定 "Your data is safe. Use the buttons below to recover." */
    description?: string;
    /** リロードボタン。既定 "Reload" */
    reloadLabel?: string;
    /** リセット (再試行) ボタン。onReset 指定時のみ表示。既定 "Try again" */
    resetLabel?: string;
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
     * 指定すると fallback に "再試行" ボタンが出る。クリックで catch 状態
     * (hasError) をリセットし、子をもう一度マウントする。
     * 未指定なら reload ボタンのみ。
     */
    onReset?: () => void;
    /** 完全カスタム fallback を渡したい場合 (labels より優先) */
    fallback?: React.ReactNode | ((error: Error | null, reset: () => void) => React.ReactNode);
    /** fallback 外枠の追加 className */
    className?: string;
}
interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
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
export declare class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps);
    static getDerivedStateFromError(error: Error): ErrorBoundaryState;
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void;
    handleReset: () => void;
    handleReload: () => void;
    render(): string | number | bigint | boolean | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode>> | import("react/jsx-runtime").JSX.Element;
}
export {};
