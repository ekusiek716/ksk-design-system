import * as React from "react";
import { type VariantProps } from "class-variance-authority";
/**
 * Alert
 *
 * - bordered (success / info / error / warning): 白背景 + カラー枠線 + 外側リング
 * - inline (inline-info / inline-caution / inline-warning): 色付き背景、コンパクト
 *
 * ### 2 つの使い方
 *
 * 1. **prop ベース**（推奨・bordered variant のみ）— アイコンは variant から自動
 *    ```tsx
 *    <Alert variant="success" title="送信しました" description="内容を確認してください。" />
 *    ```
 *
 * 2. **composable**（旧来 / 自由度高い）
 *    ```tsx
 *    <Alert variant="success">
 *      <AlertTitle>送信しました</AlertTitle>
 *      <AlertDescription>内容を確認してください。</AlertDescription>
 *    </Alert>
 *    ```
 */
declare const alertVariants: (props?: {
    variant?: "success" | "info" | "error" | "warning" | "inline-info" | "inline-caution" | "inline-warning";
} & import("class-variance-authority/types").ClassProp) => string;
type AlertVariant = VariantProps<typeof alertVariants>["variant"];
type AlertProps = React.ComponentProps<"div"> & VariantProps<typeof alertVariants> & {
    /**
     * prop-based API のタイトル。children と排他（children 優先）。
     * bordered variant でのみ有効。
     */
    title?: React.ReactNode;
    /** prop-based API の説明テキスト */
    description?: React.ReactNode;
    /** カスタムアイコン（未指定時は variant に応じて自動選択） */
    icon?: React.ReactNode;
    /** 右側アクション（Button など） */
    action?: React.ReactNode;
};
declare function Alert({ className, variant, children, title, description, icon, action, ...props }: AlertProps): import("react/jsx-runtime").JSX.Element;
declare function AlertTitle({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function AlertDescription({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
export { Alert, AlertTitle, AlertDescription };
export type { AlertVariant };
