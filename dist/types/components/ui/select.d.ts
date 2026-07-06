import * as React from "react";
import { Select as SelectPrimitive } from "radix-ui";
import { type VariantProps } from "class-variance-authority";
/**
 * SelectTrigger のサイズ規格。Button/Input と揃えて 3 段階を用意。
 * 既定は default (h-12) — 既存挙動と完全互換。
 */
declare const selectTriggerVariants: (props?: {
    size?: "default" | "sm" | "lg";
} & import("class-variance-authority/types").ClassProp) => string;
declare function Select({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>): React.JSX.Element;
declare function SelectGroup({ ...props }: React.ComponentProps<typeof SelectPrimitive.Group>): React.JSX.Element;
declare function SelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>): React.JSX.Element;
interface SelectTriggerProps extends React.ComponentProps<typeof SelectPrimitive.Trigger>, VariantProps<typeof selectTriggerVariants> {
    children?: React.ReactNode;
    className?: string;
    id?: string;
}
declare function SelectTrigger({ className, children, size, ...props }: SelectTriggerProps): React.JSX.Element;
declare function SelectContent({ className, children, position, ...props }: React.ComponentProps<typeof SelectPrimitive.Content>): React.JSX.Element;
declare function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>): React.JSX.Element;
declare function SelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>): React.JSX.Element;
declare function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>): React.JSX.Element;
export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue, selectTriggerVariants, };
export type { SelectTriggerProps };
