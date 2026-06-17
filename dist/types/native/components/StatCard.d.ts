export interface StatCardProps {
    label: string;
    value: string | number;
    delta?: string;
    trend?: "up" | "down" | "neutral";
}
export declare function StatCard({ label, value, delta, trend }: StatCardProps): import("react/jsx-runtime").JSX.Element;
