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
interface ToastContextValue {
    toast: (props: Omit<Toast, "id">) => void;
}
declare function useToast(): ToastContextValue;
declare function Toaster({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export { Toaster, useToast, toastVariants };
export type { Toast, ToastVariant };
