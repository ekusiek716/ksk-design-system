type Granularity = "hour" | "day" | "week" | "month";
type Period = "7d" | "30d" | "90d" | "1y" | "custom";
interface ChartControlsProps {
    granularity?: Granularity;
    onGranularityChange?: (value: Granularity) => void;
    period?: Period;
    onPeriodChange?: (value: Period) => void;
    showComparison?: boolean;
    onComparisonChange?: (value: boolean) => void;
    /** カスタム期間ボタンクリック */
    onCustomPeriod?: () => void;
    className?: string;
}
declare function ChartControls({ granularity, onGranularityChange, period, onPeriodChange, showComparison, onComparisonChange, onCustomPeriod, className, }: ChartControlsProps): import("react/jsx-runtime").JSX.Element;
export { ChartControls };
export type { ChartControlsProps, Granularity, Period };
