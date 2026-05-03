import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
/**
 * CheckboxCardGroup / CheckboxCardItem — カード型チェックボックス
 *
 * 複数選択のカード型 UI に使用。単一選択には RadioGroup を使用。
 *
 * ### 使用例
 * ```tsx
 * <CheckboxCardGroup>
 *   <CheckboxCardItem description="月500円">ライトプラン</CheckboxCardItem>
 *   <CheckboxCardItem description="月1,000円" badge={<Badge>人気</Badge>}>
 *     スタンダードプラン
 *   </CheckboxCardItem>
 * </CheckboxCardGroup>
 * ```
 */
declare function CheckboxCardGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
declare function CheckboxCardItem({ className, children, description, expandedContent, badge, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
    /** ラベルテキスト */
    children?: React.ReactNode;
    /** 補足説明テキスト */
    description?: React.ReactNode;
    /** 選択時に展開表示するコンテンツ */
    expandedContent?: React.ReactNode;
    /** タグバッジ（例: "20%OFF"） */
    badge?: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export { CheckboxCardGroup, CheckboxCardItem };
