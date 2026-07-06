import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
type CheckboxRootProps = React.ComponentProps<typeof CheckboxPrimitive.Root>;
export interface CheckboxProps extends CheckboxRootProps {
    /**
     * 文字列または ReactNode を渡すと、Checkbox を `<label>` でラップして
     * 行型レイアウトに切り替える。filter sidebar / 設定画面で典型的な
     * 「行全体クリッカブル」パターン。未指定なら従来通り素のチェックボックス
     * （外側で Label と組み合わせる使い方も継続可能）。
     */
    label?: React.ReactNode;
    /** サブテキスト（label 指定時のみ有効） */
    description?: React.ReactNode;
    /** 右端に表示する件数バッジ（label 指定時のみ有効） */
    count?: number;
    /** label モード時の行コンテナに付けるクラス */
    containerClassName?: string;
}
/**
 * Checkbox — チェックボックス
 *
 * 2 つの使い方:
 *
 * 1. **素の Checkbox** — `label` を渡さない場合
 *    ```tsx
 *    <Checkbox checked={...} onCheckedChange={...} />
 *    ```
 *    外側で `<Label>` や `<FormField>` と組み合わせて使う。
 *
 * 2. **行型レイアウト** — `label` を渡すと自動で `<label>` ラップ + 行全体 hover
 *    ```tsx
 *    <Checkbox
 *      label="正社員"
 *      count={1234}
 *      checked={...}
 *      onCheckedChange={...}
 *    />
 *    ```
 *    filter sidebar / 設定画面の典型パターン。行全体クリッカブル、hover で背景強調。
 *
 * カード型の選択肢には `CheckboxCard` を使用。
 */
declare function Checkbox({ label, description, count, containerClassName, className, id, ...props }: CheckboxProps): React.JSX.Element;
export { Checkbox };
