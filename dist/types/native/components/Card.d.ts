import React from "react";
import { type ViewProps } from "react-native";
export interface CardProps extends ViewProps {
    /** spacing.scale のインデックス。既定 4 = 16px */
    padding?: number;
    /** shadow トークン名。web は boxShadow、iOS は shadow*、Android は elevation を適用 */
    elevation?: "sm" | "md" | "lg";
    children: React.ReactNode;
}
/** surface.primary 面 + border.low-emphasis の標準カード。 */
export declare function Card({ padding, elevation, style, children, ...rest }: CardProps): React.JSX.Element;
