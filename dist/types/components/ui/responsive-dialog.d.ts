import * as React from "react";
import { DialogContent, DialogTitle, DialogDescription, DialogClose, DialogTrigger } from "./dialog";
declare function useMediaQuery(query: string): boolean;
interface ResponsiveDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
}
declare function ResponsiveDialog({ children, ...props }: ResponsiveDialogProps): import("react/jsx-runtime").JSX.Element;
declare function ResponsiveDialogTrigger({ children, ...props }: React.ComponentProps<typeof DialogTrigger>): import("react/jsx-runtime").JSX.Element;
declare function ResponsiveDialogContent({ children, className, ...props }: React.ComponentProps<typeof DialogContent>): import("react/jsx-runtime").JSX.Element;
declare function ResponsiveDialogHeader({ children, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function ResponsiveDialogTitle({ children, ...props }: React.ComponentProps<typeof DialogTitle>): import("react/jsx-runtime").JSX.Element;
declare function ResponsiveDialogDescription({ children, ...props }: React.ComponentProps<typeof DialogDescription>): import("react/jsx-runtime").JSX.Element;
declare function ResponsiveDialogFooter({ children, className, orientation, ...props }: React.ComponentProps<"div"> & {
    /**
     * アクションボタンの並べ方。
     * - "split"（既定）: 均等幅で横並び（各ボタン flex-1）。iOS のボトムシート風。
     * - "stacked": 旧挙動。デスクトップは右寄せ横並び、モバイルは縦積み。
     */
    orientation?: "split" | "stacked";
}): import("react/jsx-runtime").JSX.Element;
declare function ResponsiveDialogClose({ children, ...props }: React.ComponentProps<typeof DialogClose>): import("react/jsx-runtime").JSX.Element;
export { ResponsiveDialog, ResponsiveDialogTrigger, ResponsiveDialogContent, ResponsiveDialogHeader, ResponsiveDialogTitle, ResponsiveDialogDescription, ResponsiveDialogFooter, ResponsiveDialogClose, useMediaQuery, };
