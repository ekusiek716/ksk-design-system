import React from "react";
import { type PressableProps, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
export type ButtonVariant = "primary" | "secondary" | "tertiary" | "destructive" | "glass";
/**
 * elevation トークン（scales.elevation）:
 *   - flat   : 標準（border なし、押下時 transform なし）
 *   - raised : 下辺に濃い border + 押下で translateY して沈む 3D 風（Duolingo / Material You で一般的）
 *
 * 下辺色は variant の active-button トークンを自動で使う（ハードコード無し）。
 */
export type ButtonElevation = "flat" | "raised";
export interface ButtonProps extends Omit<PressableProps, "children" | "style"> {
    variant?: ButtonVariant;
    /** 立体感。default 'flat'。トークン scales.elevation で量を管理 */
    elevation?: ButtonElevation;
    /** コンテナの style を上書きするポイント（DS の標準を保持しつつ微調整したい時） */
    containerStyle?: StyleProp<ViewStyle>;
    /** 押下時の style を上書きするポイント */
    pressedContainerStyle?: StyleProp<ViewStyle>;
    /** 内部 Text の style を上書きするポイント */
    textStyle?: StyleProp<TextStyle>;
    children: React.ReactNode;
}
/** variant を semantic トークン（brand / active / caution / border）で表現するボタン。 */
export declare function Button({ variant, elevation, containerStyle, pressedContainerStyle, textStyle, children, ...rest }: ButtonProps): import("react/jsx-runtime").JSX.Element;
