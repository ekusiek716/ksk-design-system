import * as React from "react";
import { Slider as SliderPrimitive } from "radix-ui";
/**
 * Slider — 数値スライダー
 *
 * Radix UI Slider ラッパー。範囲スライダー（2ハンドル）にも対応。
 *
 * ### 使用例
 * ```tsx
 * <Slider defaultValue={[50]} min={0} max={100} step={1} />
 * ```
 */
declare function Slider({ className, defaultValue, value, min, max, ...props }: React.ComponentProps<typeof SliderPrimitive.Root>): React.JSX.Element;
export { Slider };
