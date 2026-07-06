import React from "react";
import { scales, type ThemeName, type ColorMode, type ResolvedTheme } from "../../tokens/native";
type Scales = typeof scales;
export interface ThemeContextValue {
    name: ThemeName;
    mode: ColorMode;
    /** 解決済みカラートークン（surface/text/border/brand ...） */
    theme: ResolvedTheme;
    /** spacing / borderRadius / typography / shadows / categorical ... */
    scales: Scales;
    setName: (n: ThemeName) => void;
    setMode: (m: ColorMode) => void;
    toggleMode: () => void;
}
export declare function ThemeProvider({ children, initialName, initialMode, }: {
    children: React.ReactNode;
    initialName?: ThemeName;
    initialMode?: ColorMode;
}): React.JSX.Element;
export declare function useTheme(): ThemeContextValue;
export {};
