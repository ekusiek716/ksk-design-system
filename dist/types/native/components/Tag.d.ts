import React from "react";
export type TagTone = "neutral" | "accent" | "success" | "caution" | "warning" | "info";
export type TagVariant = "filled" | "outline";
export interface TagProps {
    tone?: TagTone;
    variant?: TagVariant;
    children: React.ReactNode;
}
/** 表示専用ラベル。Chip と違いインタラクション無し。 */
export declare function Tag({ tone, variant, children }: TagProps): import("react/jsx-runtime").JSX.Element;
