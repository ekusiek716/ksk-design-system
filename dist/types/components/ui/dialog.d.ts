import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
declare function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>): import("react/jsx-runtime").JSX.Element;
declare function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>): import("react/jsx-runtime").JSX.Element;
declare function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>): import("react/jsx-runtime").JSX.Element;
declare function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>): import("react/jsx-runtime").JSX.Element;
declare function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>): import("react/jsx-runtime").JSX.Element;
interface DialogContentProps extends React.ComponentProps<typeof DialogPrimitive.Content> {
    /**
     * デフォルトの内側余白（p-6）を制御。
     * - true（既定）: p-6 を付与（従来通り）
     * - false       : p-0。タブ/スクロール本体/フッタの3段構成など、
     *                 ヘッダ/本文/フッタを個別に padding 制御したい
     *                 複雑モーダル向け。`className="p-0 gap-0"` で打ち消す
     *                 既存実装の正規版。
     */
    padding?: boolean;
}
declare function DialogContent({ className, children, padding, ...props }: DialogContentProps): import("react/jsx-runtime").JSX.Element;
declare function DialogHeader({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function DialogFooter({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>): import("react/jsx-runtime").JSX.Element;
declare function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>): import("react/jsx-runtime").JSX.Element;
export { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, };
export type { DialogContentProps };
