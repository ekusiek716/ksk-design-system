import React from "react";
import { type ViewProps } from "react-native";
/**
 * FormRoot / FormSection / FormActions (native) — フォーム構造化レイアウト。
 * 正本: src/components/patterns/form.tsx（Web 版。<form>/<fieldset> ベース）。
 *
 * native には <form> 要素が無いため View ベースで組む。送信は各 FormActions 内の
 * Button の onPress に委ねる（Web 版の onSubmit/preventDefault に相当する挙動は
 * native に存在しないため FormRoot 自体は送信イベントを持たない、素のレイアウト
 * コンテナになる）。
 */
export interface FormRootProps extends ViewProps {
    children: React.ReactNode;
}
export declare function FormRoot({ style, children, ...rest }: FormRootProps): React.JSX.Element;
export interface FormSectionProps extends ViewProps {
    title?: string;
    description?: string;
    children: React.ReactNode;
}
export declare function FormSection({ title, description, style, children, ...rest }: FormSectionProps): React.JSX.Element;
export interface FormActionsProps extends ViewProps {
    children: React.ReactNode;
}
export declare function FormActions({ style, children, ...rest }: FormActionsProps): React.JSX.Element;
