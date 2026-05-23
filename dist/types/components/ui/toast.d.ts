import * as React from "react";
import { type VariantProps } from "class-variance-authority";
declare const toastVariants: (props?: {
    variant?: "default" | "success" | "info" | "warning" | "caution";
} & import("class-variance-authority/types").ClassProp) => string;
type ToastVariant = VariantProps<typeof toastVariants>["variant"];
interface Toast {
    id: string;
    title: string;
    description?: string;
    variant?: ToastVariant;
    duration?: number;
}
interface ToastOptions {
    description?: string;
    variant?: ToastVariant;
    duration?: number;
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
export type { Toast, ToastVariant, ToastOptions, ToastFn };
