import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
/**
 * CheckboxGroup / CheckboxGroupItem — チェックボックスグループ
 *
 * 複数のチェックボックスをグリッドレイアウト + ラベル + エラー表示付きでまとめるラッパー。
 *
 * ### 使用例
 * ```tsx
 * <CheckboxGroup label="配送方法" required columns={2}>
 *   <CheckboxGroupItem value="standard">通常配送</CheckboxGroupItem>
 *   <CheckboxGroupItem value="express" description="翌日届く">
 *     速達配送
 *   </CheckboxGroupItem>
 * </CheckboxGroup>
 * ```
 */
export interface CheckboxGroupProps {
    label: string;
    required?: boolean;
    helpText?: string;
    error?: string;
    /** グリッドカラム数（デフォルト: 2） */
    columns?: number;
    children: React.ReactNode;
    className?: string;
}
declare function CheckboxGroup({ label, required, helpText, error, columns, children, className, }: CheckboxGroupProps): React.JSX.Element;
declare function CheckboxGroupItem({ className, children, description, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
    children: React.ReactNode;
    description?: React.ReactNode;
}): React.JSX.Element;
export { CheckboxGroup, CheckboxGroupItem };
