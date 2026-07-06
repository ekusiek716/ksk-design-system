import * as React from "react";
import { Textarea } from "./textarea";
/**
 * AutoGrowTextarea — Textarea ラッパー。入力に合わせて自動高さ調整。
 *
 * - 入力ごとに `scrollHeight` を計算して `style.height` を更新
 * - `minRows` で最小行数を確保（既定 density ではカーソル下に常に 1 行分の余白を残す）
 * - `density="compact"` で 1 行タイトル編集などの余白なし auto-grow に切り替え
 * - `maxLength` 指定で右下に「現在 / 上限」カウンタを表示
 *   - 70% 超で warning 色、上限到達で caution 色
 * - 内部 ref で `<textarea>` を握り、外部からの value 同期にも追従
 *
 * もとは belle-todo + ninshin-todo の共通実装（プロダクションで TaskDetailSheet /
 * FeedbackSheet / Notes / Venues 等で使用）。DS に昇格。
 *
 * ### 使用例
 * ```tsx
 * <AutoGrowTextarea
 *   value={memo}
 *   onChange={setMemo}
 *   placeholder="メモを入力..."
 *   minRows={3}
 *   maxLength={500}
 * />
 * ```
 *
 * @example
 * // 最小用途（カウンタなし）
 * <AutoGrowTextarea value={v} onChange={setV} placeholder="..." />
 */
export type AutoGrowTextareaDensity = "default" | "compact";
export interface AutoGrowTextareaProps extends Omit<React.ComponentProps<typeof Textarea>, "ref" | "value" | "onChange" | "placeholder" | "rows" | "maxLength" | "className"> {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    /** 最小行数。これより小さい高さにはならない（既定 3） */
    minRows?: number;
    /** compact は詳細シートのタイトルなど、1行分の余白を追加しない用途向け。 */
    density?: AutoGrowTextareaDensity;
    /** 指定すると右下に「現在 / 上限」カウンタを表示。70% 超で warning 色、上限到達で caution 色。 */
    maxLength?: number;
    className?: string;
}
export declare function AutoGrowTextarea({ value, onChange, placeholder, minRows, density, maxLength, className, ...textareaProps }: AutoGrowTextareaProps): React.JSX.Element;
