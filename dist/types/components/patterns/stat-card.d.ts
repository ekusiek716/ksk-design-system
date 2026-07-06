import * as React from "react";
type StatCardVariant = "default" | "success" | "caution" | "info" | "accent";
interface StatCardProps extends Omit<React.ComponentProps<"div">, "onClick"> {
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
    /**
     * Interactive モード: true にすると card が button のように振る舞う。
     * - `role=button` / `tabIndex=0` / focus-visible ring / active:scale を自動付与
     * - onClick / onKeyDown (Enter/Space) を有効化
     * - hover で軽い陰り、cursor-pointer
     *
     * onClick だけ渡しても interactive=true 扱いする。
     */
    interactive?: boolean;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}
/**
 * StatCard — KPI / メトリクス表示用の小さなカード。
 *
 * - `label` + `value` (+ optional `unit`, `trend`, `icon`) でデータ部を表現
 * - `variant` で色 (default / success / caution / info / accent)
 * - `interactive` (または `onClick`) でボタン化 — タップでナビゲートする
 *   ホーム画面のメトリクスタイル等に最適
 */
declare function StatCard({ className, label, value, unit, trend, icon, variant, interactive, onClick, ...props }: StatCardProps): React.JSX.Element;
export { StatCard };
export type { StatCardProps, StatCardVariant };
