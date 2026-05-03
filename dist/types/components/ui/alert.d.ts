import * as React from "react";
import { type VariantProps } from "class-variance-authority";
/**
 * Alert
 *
 * - bordered (success / info / error / warning): 白背景 + カラー枠線 + 外側リング
 * - inline (inline-info / inline-caution / inline-warning): 色付き背景、コンパクト
 *
 * ### 使用例
 * ```tsx
 * <Alert variant="success">
 *   <AlertTitle>送信しました</AlertTitle>
 *   <AlertDescription>内容を確認してください。</AlertDescription>
 * </Alert>
 * ```
 */
declare const alertVariants: (props?: {
    variant?: "success" | "info" | "error" | "warning" | "inline-info" | "inline-caution" | "inline-warning";
} & import("class-variance-authority/types").ClassProp) => string;
type AlertVariant = VariantProps<typeof alertVariants>["variant"];
declare function Alert({ className, variant, children, ...props }: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>): import("react/jsx-runtime").JSX.Element;
declare function AlertTitle({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function AlertDescription({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
export { Alert, AlertTitle, AlertDescription };
export type { AlertVariant };
