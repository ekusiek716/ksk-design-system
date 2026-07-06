import * as React from "react";
/** 注文サマリーの明細行 */
interface OrderSummaryLineItem {
    /** ラベル（例: 小計、送料） */
    label: string;
    /** 値（文字列またはReactノード） */
    value: React.ReactNode;
}
interface OrderSummaryProps extends React.ComponentProps<"div"> {
    /** 明細行の配列 */
    lineItems?: OrderSummaryLineItem[];
    /** 合計ラベル */
    totalLabel?: string;
    /** 合計金額の表示文字列 */
    totalValue: string;
    /** CTAボタンのラベル */
    ctaLabel: string;
    /** CTAボタンクリック時のコールバック */
    onCTAClick?: () => void;
    /** CTAボタンの無効状態 */
    ctaDisabled?: boolean;
    /** 画面下部に固定表示するか */
    fixed?: boolean;
}
declare function OrderSummary({ className, lineItems, totalLabel, totalValue, ctaLabel, onCTAClick, ctaDisabled, fixed, ...props }: OrderSummaryProps): React.JSX.Element;
export { OrderSummary };
