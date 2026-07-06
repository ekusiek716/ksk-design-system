import * as React from "react";
import { HoverCard as HoverCardPrimitive } from "radix-ui";
/**
 * HoverCard — ホバー情報カード
 *
 * トリガー要素にホバーしたとき詳細情報をポップアップ表示する。
 * ユーザープロフィールのプレビューや補足説明に使用。
 *
 * ### 使用例
 * ```tsx
 * <HoverCard>
 *   <HoverCardTrigger asChild>
 *     <Button variant="link">@username</Button>
 *   </HoverCardTrigger>
 *   <HoverCardContent>
 *     <p>プロフィール詳細...</p>
 *   </HoverCardContent>
 * </HoverCard>
 * ```
 */
declare function HoverCard({ openDelay, closeDelay, ...props }: React.ComponentProps<typeof HoverCardPrimitive.Root>): React.JSX.Element;
declare function HoverCardTrigger({ ...props }: React.ComponentProps<typeof HoverCardPrimitive.Trigger>): React.JSX.Element;
declare function HoverCardContent({ className, align, sideOffset, ...props }: React.ComponentProps<typeof HoverCardPrimitive.Content>): React.JSX.Element;
export { HoverCard, HoverCardTrigger, HoverCardContent };
