import * as React from "react";
interface BulkActionsProps extends React.ComponentProps<"div"> {
    /** 選択件数 */
    selectedCount: number;
    /** 選択解除ボタンクリック時 */
    onClear?: () => void;
}
/**
 * 一括操作バー（FAB型）
 *
 * テーブル行を1件以上選択すると画面下部に浮き上がるフローティングバー。
 * 選択件数 + アクションボタン群を横並びで表示。
 * selectedCount が 0 のとき自動で非表示になる。
 */
declare function BulkActions({ selectedCount, onClear, children, className, ...props }: BulkActionsProps): React.JSX.Element;
export { BulkActions };
export type { BulkActionsProps };
