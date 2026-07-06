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
    /** leading icon slot. children は text または ReactNode のどちらでも可 */
    leadingIcon?: React.ReactNode;
    /** trailing icon slot. children は text または ReactNode のどちらでも可 */
    trailingIcon?: React.ReactNode;
    /** loading=true で spinner を表示し、button を busy/disabled として扱う */
    loading?: boolean;
    /** loading 中も読み上げ/表示したい label。未指定なら spinner のみ */
    loadingLabel?: string;
    children?: React.ReactNode;
}
/** variant を semantic トークン（brand / active / caution / border）で表現するボタン。 */
export declare function Button({ variant, elevation, containerStyle, pressedContainerStyle, textStyle, leadingIcon, trailingIcon, loading, loadingLabel, children, disabled, accessibilityState, ...rest }: ButtonProps): React.JSX.Element;
