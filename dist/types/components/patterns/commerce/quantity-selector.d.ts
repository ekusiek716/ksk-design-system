import * as React from "react";
interface QuantitySelectorProps extends Omit<React.ComponentProps<"div">, "onChange"> {
    /** 現在の数量 */
    value: number;
    /** 最小値 */
    min?: number;
    /** 最大値 */
    max?: number;
    /** 数量変更時のコールバック */
    onChange?: (value: number) => void;
    /** 無効状態 */
    disabled?: boolean;
    /** 表示サイズ: sm（カート用コンパクトピル）/ md（詳細ページ用丸ボタン） */
    size?: "sm" | "md";
    /** 最小値以下でゴミ箱アイコンを表示するか */
    showTrash?: boolean;
    /** 削除時のコールバック */
    onDelete?: () => void;
}
declare function QuantitySelector({ className, value, min, max, onChange, disabled, size, showTrash, onDelete, ...props }: QuantitySelectorProps): React.JSX.Element;
export { QuantitySelector };
