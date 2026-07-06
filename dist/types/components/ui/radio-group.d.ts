import * as React from "react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
declare function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>): React.JSX.Element;
/**
 * RadioGroupItem — ラジオ 1 項目
 *
 * 2 つの使い方:
 * 1. **素のラジオ** — `children` を渡さない場合は円のみ描画。外側で
 *    `<Label>` と組み合わせる従来の使い方（後方互換）。
 * 2. **ラベル内包** — `children`（＋任意の `description`）を渡すと、
 *    CheckboxGroupItem と同じ「ラジオ + ラベル」の行型レイアウトで描画。
 *    ```tsx
 *    <RadioGroup defaultValue="s">
 *      <RadioGroupItem value="s">Small</RadioGroupItem>
 *      <RadioGroupItem value="m" description="標準サイズ">Medium</RadioGroupItem>
 *    </RadioGroup>
 *    ```
 */
declare function RadioGroupItem({ className, children, description, id, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item> & {
    description?: React.ReactNode;
}): React.JSX.Element;
export { RadioGroup, RadioGroupItem };
