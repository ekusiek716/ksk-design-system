import * as React from "react";
import { type VariantProps } from "class-variance-authority";
declare const badgeVariants: (props?: {
    variant?: "success" | "info" | "warning" | "default" | "secondary" | "ghost" | "destructive" | "outline" | "subtle";
} & import("class-variance-authority/types").ClassProp) => string;
/**
 * Badge — ステータス / 件数表示。
 *
 * 使い分け:
 * - **Badge**: 数値・ステータス（クリック不可）— `<Badge>NEW</Badge>`
 * - **Tag**: 表示専用ラベル — `<Tag variant="brand">特集</Tag>`
 * - **Chip**: フィルタ・キーワード（クリック可） — `<Chip selected>適用中</Chip>`
 *
 * variant: default(brand) / secondary / outline / destructive / success /
 *   warning / info / subtle(brand-light) / ghost
 */
declare function Badge({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>): React.JSX.Element;
export { Badge, badgeVariants };
