import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
type TabsVariant = "default" | "pill";
declare function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>): React.JSX.Element;
declare function TabsList({ className, variant, ...props }: React.ComponentProps<typeof TabsPrimitive.List> & {
    /**
     * - "default": 角丸 lg のセグメント（パネル切替タブ）
     * - "pill": 完全な丸。フィルタ/トグル的なセグメントコントロール。
     *   PillToggle はこの variant を内部利用する。
     */
    variant?: TabsVariant;
}): React.JSX.Element;
declare function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>): React.JSX.Element;
declare function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>): React.JSX.Element;
export { Tabs, TabsList, TabsTrigger, TabsContent };
