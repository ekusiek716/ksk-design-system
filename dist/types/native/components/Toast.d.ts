import React from "react";
export type ToastTone = "info" | "success" | "warning" | "caution";
export interface ToastItem {
    id: string;
    title?: string;
    description?: string;
    tone?: ToastTone;
    duration?: number;
}
interface ToastContextValue {
    show: (toast: Omit<ToastItem, "id">) => string;
    dismiss: (id: string) => void;
}
export declare function useToast(): ToastContextValue;
export declare function ToastProvider({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export {};
