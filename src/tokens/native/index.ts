// =============================================================
// このファイルは scripts/generate-platform-tokens.mjs により自動生成されています。
// 直接編集しないでください。tokens.json / src/themes/*.css を変更し、
// `npm run generate:tokens` を実行してください。
// source: tokens.json v2.0.0 (2026-05-31)
// =============================================================

import { themes } from './themes';
import { scales } from './scales';
import { primitives } from './primitives';

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
export function getTheme(name: ThemeName, mode: ColorMode = 'light'): ResolvedTheme {
  return themes[name][mode];
}

export const themeNames = Object.keys(themes) as ThemeName[];

// scales / primitives は再エクスポート済み。利用側の参照保持のため明示。
void scales;
void primitives;
