import React from "react";
export type SheetSide = "bottom" | "top" | "left" | "right";
export interface SheetProps {
    open: boolean;
    onClose: () => void;
    side?: SheetSide;
    title?: string;
    children?: React.ReactNode;
    /**
     * Bottom-sheet snap points (0..1 of viewport height).
     * Provide e.g. `[0.55, 0.92]` to enable snap mode:
     * シートはドラッグハンドル経由でハーフ／フル相当に切替可能、
     * 下方向に minSnap × 0.5 を下回ると close する。
     * `side="bottom"` でのみ有効。未指定なら従来の単純スライドアニメ。
     */
    snapPoints?: number[];
    /** Initial snap (must match one of `snapPoints`). Default = first entry. */
    initialSnap?: number;
    /**
     * シート下端に固定で表示する要素（例：「つづける」ボタン）。
     * children の ScrollView と分離されるためコンテンツのスクロールに
     * 追従しない。snap mode（bottom + snapPoints）でのみ有効。
     */
    footer?: React.ReactNode;
}
export declare function Sheet(props: SheetProps): import("react/jsx-runtime").JSX.Element;
