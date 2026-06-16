import { themes } from './themes';
export { themes } from './themes';
export { scales } from './scales';
export { primitives } from './primitives';
export type ThemeName = keyof typeof themes;
export type ColorMode = 'light' | 'dark';
export type ResolvedTheme = (typeof themes)[ThemeName][ColorMode];
/**
 * 指定テーマ×モードの解決済みカラートークンを返す。
 * 例: getTheme('orange', 'dark').surface.primary
 */
export declare function getTheme(name: ThemeName, mode?: ColorMode): ResolvedTheme;
export declare const themeNames: ThemeName[];
