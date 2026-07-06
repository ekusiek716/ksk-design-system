import * as React from "react";
export interface ReviewPin {
    id: string;
    x: number;
    y: number;
    comment?: string;
}
export interface ReviewOverlayProps {
    /** オーバーレイを表示するか */
    active: boolean;
    /** ピン作成時のコールバック（ページ相対座標 0–1） */
    onPinCreate?: (pin: Omit<ReviewPin, "id">) => void;
    /** 既存ピン一覧 */
    pins?: ReviewPin[];
    /** ピンクリック時のコールバック */
    onPinClick?: (pin: ReviewPin) => void;
    /** 長押し認識時間 (ms) */
    holdDuration?: number;
    /** ハプティックフィードバック（Capacitor Haptics 等のコールバックを渡す） */
    onHaptic?: () => void;
    className?: string;
    children?: React.ReactNode;
}
declare function ReviewOverlay({ active, onPinCreate, pins, onPinClick, holdDuration, onHaptic, className, children, }: ReviewOverlayProps): React.JSX.Element;
export { ReviewOverlay };
