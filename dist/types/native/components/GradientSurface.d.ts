import React from "react";
import { type StyleProp, type ViewStyle } from "react-native";
export interface GradientSurfaceStop {
    /** 0〜1 */
    offset: number;
    color: string;
}
export interface GradientSurfaceProps {
    /** グラデ方向。既定 "vertical"（上→下） */
    direction?: "vertical" | "horizontal";
    /**
     * 明示 stops。省略時は現在テーマの Brand ランプから
     * 400（明）→ 500（コア）→ 600（深）を縦に流すヒーロー用グラデになる。
     */
    stops?: GradientSurfaceStop[];
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
}
/**
 * ヒーロー画面向けのフルブリード・ブランドグラデーション面。
 *
 * - 色は semantic トークンのみ（既定 stops はテーマの Brand ランプ由来）。
 *   テーマを差し替えるとグラデも追従する。
 * - react-native-svg は optional peerDependency。未導入環境では
 *   コア色（中間 stop）の単色フィルにフォールバックする。
 */
export declare function GradientSurface({ direction, stops, style, children, }: GradientSurfaceProps): React.JSX.Element;
