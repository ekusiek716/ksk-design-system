export interface OrderSummaryLine {
    label: string;
    value: number;
    emphasis?: "normal" | "discount" | "total";
}
export interface OrderSummaryProps {
    lines: OrderSummaryLine[];
    currency?: string;
}
export declare function OrderSummary({ lines, currency }: OrderSummaryProps): import("react/jsx-runtime").JSX.Element;
