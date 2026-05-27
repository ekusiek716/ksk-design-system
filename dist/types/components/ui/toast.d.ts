import * as React from "react";
import { type VariantProps } from "class-variance-authority";
declare const toastVariants: (props?: {
    variant?: "default" | "success" | "info" | "warning" | "caution";
} & import("class-variance-authority/types").ClassProp) => string;
type ToastVariant = VariantProps<typeof toastVariants>["variant"];
interface ToastAction {
    /** ボタンに表示するラベル */
    label: string;
    /** クリック時のコールバック。toast は自動で dismiss されない（必要なら自前で toast.dismiss(id) を呼ぶ）。 */
    onClick: () => void;
}
interface Toast {
    id: string;
    title: string;
    description?: string;
    variant?: ToastVariant;
    duration?: number;
    action?: ToastAction;
}
interface ToastOptions {
    description?: string;
    variant?: ToastVariant;
    duration?: number;
    /**
     * オプショナルなアクションボタン。指定時は toast 右側に表示。
     * 「元に戻す」「再試行」「詳細」などの即時アクション用途。
     */
    action?: ToastAction;
}
interface ToastContextValue {
    toast: (props: Omit<Toast, "id">) => void;
}
declare function useToast(): ToastContextValue;
declare function Toaster({ children }: {
    children?: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
interface ToastFn {
    (title: string, options?: ToastOptions): string;
    success: (title: string, options?: ToastOptions) => string;
    error: (title: string, options?: ToastOptions) => string;
    info: (title: string, options?: ToastOptions) => string;
    warning: (title: string, options?: ToastOptions) => string;
    caution: (title: string, options?: ToastOptions) => string;
    dismiss: (id: string) => void;
}
declare const toast: ToastFn;
export { Toaster, useToast, toast, toastVariants };
export type { Toast, ToastVariant, ToastOptions, ToastFn, ToastAction };
