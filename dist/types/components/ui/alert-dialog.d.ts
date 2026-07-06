import * as React from "react";
import { AlertDialog as AlertDialogPrimitive } from "radix-ui";
import type { ButtonProps } from "@/components/ui/button";
/**
 * AlertDialog — 確認ダイアログ（破壊的アクションの二段階確認に使用）
 *
 * ### 使用例
 * ```tsx
 * <AlertDialog>
 *   <AlertDialogTrigger asChild>
 *     <Button variant="destructive">削除</Button>
 *   </AlertDialogTrigger>
 *   <AlertDialogContent>
 *     <AlertDialogHeader>
 *       <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
 *       <AlertDialogDescription>この操作は取り消せません。</AlertDialogDescription>
 *     </AlertDialogHeader>
 *     <AlertDialogFooter>
 *       <AlertDialogCancel>キャンセル</AlertDialogCancel>
 *       <AlertDialogAction>削除する</AlertDialogAction>
 *     </AlertDialogFooter>
 *   </AlertDialogContent>
 * </AlertDialog>
 * ```
 */
declare function AlertDialog({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Root>): React.JSX.Element;
declare function AlertDialogTrigger({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>): React.JSX.Element;
declare function AlertDialogPortal({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Portal>): React.JSX.Element;
declare function AlertDialogOverlay({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>): React.JSX.Element;
declare function AlertDialogContent({ className, size, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
    size?: "default" | "sm";
}): React.JSX.Element;
declare function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare function AlertDialogFooter({ className, orientation, ...props }: React.ComponentProps<"div"> & {
    /**
     * アクションボタンの並べ方。
     * - "split"（既定）: 均等幅で横並び（各ボタン flex-1）。
     * - "stacked": 旧挙動。モバイルは縦積み、sm 以上で右寄せ横並び
     *   （size="sm" のときは 2 カラム grid）。
     */
    orientation?: "split" | "stacked";
}): React.JSX.Element;
declare function AlertDialogTitle({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Title>): React.JSX.Element;
declare function AlertDialogDescription({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Description>): React.JSX.Element;
declare function AlertDialogAction({ className, variant, size, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Action> & Pick<ButtonProps, "variant" | "size">): React.JSX.Element;
declare function AlertDialogCancel({ className, variant, size, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Cancel> & Pick<ButtonProps, "variant" | "size">): React.JSX.Element;
export { AlertDialog, AlertDialogTrigger, AlertDialogPortal, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel, };
