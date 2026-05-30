import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
declare function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>): import("react/jsx-runtime").JSX.Element;
declare function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>): import("react/jsx-runtime").JSX.Element;
declare function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>): import("react/jsx-runtime").JSX.Element;
declare function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>): import("react/jsx-runtime").JSX.Element;
declare function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>): import("react/jsx-runtime").JSX.Element;
interface DialogContentProps extends React.ComponentProps<typeof DialogPrimitive.Content> {
    /**
     * デフォルトの内側余白とセクション間レイアウトを制御。
     * - true（既定）: p-6 + `flex flex-col gap-4` を付与。ヘッダ/本文/フッタが
     *                 16px 間隔で縦に並ぶ（AlertDialog と同じ挙動）。本文セクションを
     *                 持たない確認ダイアログでも、ヘッダとフッタが詰まらない。
     * - false       : 余白・レイアウトを一切付与しない（素の要素）。タブ/スクロール
     *                 本体/固定フッタの3段構成など、内側を自前でレイアウトする
     *                 複雑モーダル向け。
     */
    padding?: boolean;
    /**
     * Optional screen-reader description for the dialog.
     * - string / ReactNode: 自動で sr-only な <DialogDescription> を
     *   レンダリングし、`aria-describedby` に紐付ける
     * - undefined（既定）: `aria-describedby={undefined}` を明示して
     *   Radix の "Missing Description" 警告を抑制。description が
     *   概念上不要なダイアログ用。
     * 可視の description を出したい場合は、この prop を使わず子要素として
     * `<DialogDescription>` を直接置く。
     */
    description?: React.ReactNode;
    /**
     * 縦位置。
     * - "center" (既定): 画面中央
     * - "top": 上部寄せ (safe-area-inset-top + 2rem 下) — モバイルで縦長
     *   コンテンツ (チェックリスト等) を出すときに、コンテンツが
     *   スクロールしやすく操作しやすい
     */
    position?: "center" | "top";
}
declare function DialogContent({ className, children, padding, description, position, ...props }: DialogContentProps): import("react/jsx-runtime").JSX.Element;
declare function DialogHeader({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function DialogFooter({ className, orientation, ...props }: React.ComponentProps<"div"> & {
    /**
     * アクションボタンの並べ方。
     * - "split"（既定）: 均等幅で横並び（各ボタン flex-1）。2 ボタンを 50/50 で
     *   並べる iOS 風レイアウト。モバイルでも横並びのまま。
     * - "stacked": 旧挙動。モバイルは縦積み、sm 以上で右寄せ横並び（hug 幅）。
     *   3 つ以上のアクションや、右寄せにしたいフォーム系ダイアログで使う。
     */
    orientation?: "split" | "stacked";
}): import("react/jsx-runtime").JSX.Element;
declare function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>): import("react/jsx-runtime").JSX.Element;
declare function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>): import("react/jsx-runtime").JSX.Element;
export { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, };
export type { DialogContentProps };
