import * as React from "react";
type StatCardVariant = "default" | "success" | "caution" | "info" | "accent";
interface StatCardProps extends React.ComponentProps<"div"> {
    label: string;
    value: string | number;
    unit?: string;
    trend?: {
        value: number;
        label?: string;
    };
    icon?: React.ReactNode;
    /**
     * カードのカラーバリアント。
     * - "default"  : 標準（白背景・低強調ボーダー）
     * - "success"  : 緑系（成功・達成指標）
     * - "caution"  : 赤系（注意・危険指標）
     * - "info"     : 青系（情報・参考指標）
     * - "accent"   : ブランド色（主要KPI）
     * @default "default"
     */
    variant?: StatCardVariant;
}
declare function StatCard({ className, label, value, unit, trend, icon, variant, ...props }: StatCardProps): import("react/jsx-runtime").JSX.Element;
export { StatCard };
export type { StatCardProps, StatCardVariant };
