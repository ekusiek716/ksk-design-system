import * as React from "react"
import { Collapsible as CollapsiblePrimitive } from "radix-ui"

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

function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  )
}

function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
