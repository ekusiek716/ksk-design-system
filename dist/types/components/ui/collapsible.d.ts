import * as React from "react";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
/**
 * Collapsible — 折りたたみパネル
 *
 * トリガーでコンテンツを表示/非表示に切り替える低レベルプリミティブ。
 * アコーディオンと異なり単独の折りたたみに使用。
 *
 * ### 使用例
 * ```tsx
 * <Collapsible>
 *   <CollapsibleTrigger asChild>
 *     <Button variant="ghost">詳細を表示</Button>
 *   </CollapsibleTrigger>
 *   <CollapsibleContent>
 *     <p>折りたたまれたコンテンツ</p>
 *   </CollapsibleContent>
 * </Collapsible>
 * ```
 */
declare function Collapsible({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.Root>): React.JSX.Element;
declare function CollapsibleTrigger({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>): React.JSX.Element;
declare function CollapsibleContent({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>): React.JSX.Element;
export { Collapsible, CollapsibleTrigger, CollapsibleContent };
