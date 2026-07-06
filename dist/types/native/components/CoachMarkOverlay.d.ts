import React from "react";
export interface CoachMarkOverlayProps {
    open: boolean;
    onClose: () => void;
    /** ハイライト対象の画面座標。指定するとそのエリアだけ暗くしない */
    highlight?: {
        x: number;
        y: number;
        width: number;
        height: number;
        radius?: number;
    };
    children: React.ReactNode;
}
/**
 * 背景を暗くしてフォーカスしたい領域だけ残す簡易オーバーレイ。
 * ハイライト穴は4枚の View でスポットを囲う形（Mask 非依存）。
 */
export declare function CoachMarkOverlay({ open, onClose, highlight, children }: CoachMarkOverlayProps): React.JSX.Element;
