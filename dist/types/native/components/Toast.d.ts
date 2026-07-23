import React from "react";
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
export type ToastTone = "default" | "info" | "success" | "warning" | "caution";
export interface ToastAction {
    /** ボタンに表示するラベル */
    label: string;
    /** 押下時のコールバック。toast は自動で dismiss されない（必要なら自前で dismiss(id) を呼ぶ）。 */
    onPress: () => void;
}
export interface ToastItem {
    id: string;
    title?: string;
    description?: string;
    tone?: ToastTone;
    duration?: number;
    /** オプショナルなアクションボタン。「元に戻す」「再試行」等の即時アクション用途。 */
    action?: ToastAction;
}
interface ToastContextValue {
    show: (toast: Omit<ToastItem, "id">) => string;
    dismiss: (id: string) => void;
}
export declare function useToast(): ToastContextValue;
export interface ToastOptions {
    description?: string;
    tone?: ToastTone;
    duration?: number;
    action?: ToastAction;
}
export interface ToastFn {
    (title: string, options?: ToastOptions): string;
    success: (title: string, options?: ToastOptions) => string;
    error: (title: string, options?: ToastOptions) => string;
    info: (title: string, options?: ToastOptions) => string;
    warning: (title: string, options?: ToastOptions) => string;
    caution: (title: string, options?: ToastOptions) => string;
    dismiss: (id: string) => void;
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
declare const toast: ToastFn;
export { toast };
export declare function ToastProvider({ children }: {
    children: React.ReactNode;
}): React.JSX.Element;
