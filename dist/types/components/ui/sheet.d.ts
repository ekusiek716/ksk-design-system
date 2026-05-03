import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { type VariantProps } from "class-variance-authority";
declare function Sheet({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>): import("react/jsx-runtime").JSX.Element;
declare function SheetTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>): import("react/jsx-runtime").JSX.Element;
declare function SheetClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>): import("react/jsx-runtime").JSX.Element;
/** ドラッグインジケーター（Apple HIG: 36×5pt, gray, centered） */
declare function SheetDragIndicator(): import("react/jsx-runtime").JSX.Element;
declare const sheetVariants: (props?: {
    side?: "left" | "right" | "top" | "bottom" | "float" | "float-glass" | "bottom-glass";
} & import("class-variance-authority/types").ClassProp) => string;
interface SheetContentProps extends React.ComponentProps<typeof DialogPrimitive.Content>, VariantProps<typeof sheetVariants> {
    /** オーバーレイをガラス調にする（glass系 side では自動で true） */
    glassOverlay?: boolean;
}
declare function SheetContent({ className, children, side, glassOverlay, ...props }: SheetContentProps): import("react/jsx-runtime").JSX.Element;
declare function SheetHeader({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function SheetFooter({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function SheetTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>): import("react/jsx-runtime").JSX.Element;
declare function SheetDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>): import("react/jsx-runtime").JSX.Element;
export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription, SheetDragIndicator, };
