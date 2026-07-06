import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
declare function Popover({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Root>): React.JSX.Element;
declare function PopoverTrigger({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Trigger>): React.JSX.Element;
declare function PopoverContent({ className, align, sideOffset, ...props }: React.ComponentProps<typeof PopoverPrimitive.Content>): React.JSX.Element;
declare function PopoverAnchor({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Anchor>): React.JSX.Element;
export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
