#!/usr/bin/env node
/**
 * プラットフォーム横断トークン生成スクリプト（Web 以外＝RN/Expo・将来の native 向け）
 *
 * 目的:
 *   tokens.json（機械可読の単一の真実）＋ CSS テーマ（per-theme Brand ランプの正本）から、
 *   CSS var() / color-mix() に依存しない「完全解決済み」のトークンを生成する。
 *   Web は CSS（preset.css / themes/*.css）を消費し続け、RN/Expo はこの生成物を消費する
 *   ＝ 値の出どころを 1 つ（tokens.json + CSS テーマ）に保ったままマルチプラットフォーム化する。
 *
 * 設計メモ:
 * - per-theme の Brand ランプは tokens.json に無く CSS が正本（例: orange-600=#C2410C は
 *   primitive orange-700 で、単純な orange ランプではない）。よって Brand は
 *   default → src/styles/primitive.css、その他 → src/themes/<name>.css を正規表現で読む。
 * - semantic / semanticDark の値は `var(--Primitive-...)` 参照と
 *   `color-mix(in srgb, <inner> N%, transparent)`（＝ inner を不透明度 N% にするだけ）と
 *   生の rgba/#hex の 3 種。前 2 つを解決し、テーマ×モードごとに resolved な値にする。
 * - categorical / brandExternal はテーマ・モード非依存の固定値なので scales 側に 1 度だけ出す。
 * - typography は RN 仕様に変換（lineHeight は絶対px、letterSpacing は em→px、weight は文字列）。
 * - 黙って壊れた出力を出さない: 解決できない var を踏んだら throw（fail-loud）。
 *
 * Usage:
 *   node scripts/generate-platform-tokens.mjs           # 生成
 *   node scripts/generate-platform-tokens.mjs --check    # 生成せず既存と比較。差分があれば exit 1（CI 用）
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'src', 'tokens', 'native');
const CHECK = process.argv.includes('--check');

const tokens = JSON.parse(readFileSync(join(ROOT, 'tokens.json'), 'utf8'));
const THEMES = Object.keys(tokens.themes); // default, blue, orange, green, violet

/* ---------- color utils ---------- */

function hexToRgb(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

/** 色（#hex / rgba / rgb）に不透明度を掛けて rgba 文字列にする（color-mix(..., transparent) の解決用） */
function applyAlpha(color, alpha) {
  if (color.startsWith('#')) {
    const { r, g, b } = hexToRgb(color);
    return `rgba(${r}, ${g}, ${b}, ${round2(alpha)})`;
  }
  const m = color.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const parts = m[1].split(',').map((s) => s.trim());
    const [r, g, b] = parts;
    const a = parts[3] != null ? parseFloat(parts[3]) : 1;
    return `rgba(${r}, ${g}, ${b}, ${round2(a * alpha)})`;
  }
  return color;
}

/* ---------- primitive 辞書（テーマ非依存） ---------- */

function pascalDash(key) {
  return key
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('-');
}

// 'Gray-500' -> '#6B7280', 'White' -> '#FFFFFF', 'Gray-Alpha-800' -> 'rgba(...)'
const primitiveDict = {};
for (const [fam, val] of Object.entries(tokens.colors.primitive)) {
  const Fam = pascalDash(fam);
  if (typeof val === 'string') {
    primitiveDict[Fam] = val;
  } else {
    for (const [shade, v] of Object.entries(val)) primitiveDict[`${Fam}-${shade}`] = v;
  }
}

/* ---------- per-theme Brand ランプ（CSS が正本） ---------- */

function parseBrandRamp(cssPath) {
  const css = readFileSync(cssPath, 'utf8');
  const ramp = {};
  const re = /--Primitive-Brand-(\d+):\s*(#[0-9A-Fa-f]+)/g;
  let m;
  while ((m = re.exec(css))) ramp[`Brand-${m[1]}`] = m[2].toUpperCase();
  return ramp;
}

function brandDictFor(theme) {
  const cssPath =
    theme === 'default'
      ? join(ROOT, 'src', 'styles', 'primitive.css')
      : join(ROOT, 'src', 'themes', `${theme}.css`);
  const ramp = parseBrandRamp(cssPath);
  if (Object.keys(ramp).length === 0) {
    throw new Error(`Brand ramp not found for theme "${theme}" in ${cssPath}`);
  }
  return ramp;
}

/* ---------- 値の解決 ---------- */

function resolveColor(value, brandDict, ctx) {
  if (typeof value !== 'string') return value;
  const v = value.trim();

  const varMatch = v.match(/^var\(--Primitive-(.+?)\)$/);
  if (varMatch) {
    const key = varMatch[1]; // 'Brand-500' / 'Gray-900' / 'White-Alpha-1000' / 'White'
    const resolved = brandDict[key] ?? primitiveDict[key];
    if (resolved == null) throw new Error(`Unresolved primitive var: ${value} (at ${ctx})`);
    return resolved;
  }

  const mixMatch = v.match(/^color-mix\(in srgb,\s*(.+?)\s+(\d+(?:\.\d+)?)%,\s*transparent\)$/);
  if (mixMatch) {
    const inner = resolveColor(mixMatch[1].trim(), brandDict, ctx);
    const pct = parseFloat(mixMatch[2]) / 100;
    return applyAlpha(inner, pct);
  }

  // 生の #hex / rgba / その他はそのまま
  return v;
}

/** semantic グループ（surface/text/... のネスト）を resolved な値に変換 */
function resolveGroups(source, brandDict, modeLabel) {
  const out = {};
  for (const [group, entries] of Object.entries(source)) {
    if (group === '_doc') continue;
    if (group === 'categorical' || group === 'brandExternal') continue; // テーマ非依存 → scales へ
    out[group] = {};
    for (const [role, value] of Object.entries(entries)) {
      if (role === '_doc') continue;
      out[group][role] = resolveColor(value, brandDict, `${modeLabel}.${group}.${role}`);
    }
  }
  return out;
}

const themes = {};
for (const theme of THEMES) {
  const brandDict = brandDictFor(theme);
  themes[theme] = {
    light: resolveGroups(tokens.colors.semantic, brandDict, `${theme}.light`),
    dark: resolveGroups(tokens.colors.semanticDark, brandDict, `${theme}.dark`),
  };
}

/* ---------- scales（テーマ・モード非依存） ---------- */

function pxNum(v) {
  return typeof v === 'string' ? parseFloat(v) : v;
}

function convertTypeStyle(style) {
  const size = pxNum(style.size);
  const out = { fontSize: size, fontWeight: String(style.weight) };
  if (style.lineHeight != null) out.lineHeight = Math.round(size * style.lineHeight);
  if (style.letterSpacing != null) out.letterSpacing = round2(parseFloat(style.letterSpacing) * size);
  return out;
}

function convertTypography(node) {
  // 'size' を持てば葉スタイル、なければネスト
  if (node && typeof node === 'object' && 'size' in node) return convertTypeStyle(node);
  const out = {};
  for (const [k, v] of Object.entries(node)) {
    if (k === '_doc' || k === 'restriction') continue;
    out[k] = convertTypography(v);
  }
  return out;
}

const SHADOW_ELEVATION = { sm: 1, md: 3, lg: 8, dialog: 12, tooltip: 6 };
function convertShadows(src) {
  const out = {};
  for (const [k, v] of Object.entries(src)) {
    if (k === '_doc') continue;
    // boxShadow 文字列は RN 0.76+（New Arch）と Web で利用可。elevation は Android フォールバック。
    out[k] = { boxShadow: v, elevation: SHADOW_ELEVATION[k] ?? 2 };
  }
  return out;
}

function convertTouchTargets(src) {
  const out = {};
  for (const [k, v] of Object.entries(src)) {
    if (k === '_doc') continue;
    const t = {};
    if (v.min != null) t.min = pxNum(v.min);
    if (v.recommended != null) t.recommended = pxNum(v.recommended);
    if (v.hitSlop != null) t.hitSlop = v.hitSlop; // 注記文字列（実効44px確保のヒント）
    out[k] = t;
  }
  return out;
}

function convertBreakpoints(src) {
  const out = {};
  for (const [group, entries] of Object.entries(src ?? {})) {
    if (group === '_doc') continue;
    out[group] = {};
    for (const [name, breakpoint] of Object.entries(entries)) {
      if (name === '_doc') continue;
      out[group][name] = {
        ...breakpoint,
        value: pxNum(breakpoint.value),
      };
    }
  }
  return out;
}

function convertCategorical(src) {
  const out = {};
  for (const [k, v] of Object.entries(src)) {
    if (k === '_doc') continue;
    out[k] = { hue: v.hue, base: v.base, subtle: v.subtle, bold: v.bold };
  }
  return out;
}

const scales = {
  spacing: {
    unit: pxNum(tokens.spacing.unit),
    scale: tokens.spacing.scale.slice(),
    section: Object.fromEntries(
      Object.entries(tokens.spacing.section ?? {}).map(([key, value]) => [
        key,
        pxNum(value),
      ])
    ),
  },
  breakpoints: convertBreakpoints(tokens.breakpoints),
  borderRadius: Object.fromEntries(
    Object.entries(tokens.borderRadius)
      .filter(([k]) => k !== '_doc')
      .map(([k, v]) => [k, pxNum(v)])
  ),
  typography: convertTypography(tokens.typography),
  shadows: convertShadows(tokens.shadows),
  touchTargets: convertTouchTargets(tokens.touchTargets),
  // elevation: Button などに触感を持たせる立体感トークン（offset / bottomBorderWidth）
  elevation: tokens.elevation
    ? Object.fromEntries(
        Object.entries(tokens.elevation)
          .filter(([k]) => k !== '_doc')
          .map(([k, v]) => [
            k,
            {
              offset: pxNum(v.offset),
              bottomBorderWidth: pxNum(v.bottomBorderWidth),
            },
          ])
      )
    : {},
  categorical: convertCategorical(tokens.colors.semantic.categorical),
  brandExternal: { ...tokens.colors.semantic.brandExternal },
};

/* ---------- 出力ファイル生成 ---------- */

const BANNER = `// =============================================================
// このファイルは scripts/generate-platform-tokens.mjs により自動生成されています。
// 直接編集しないでください。tokens.json / src/themes/*.css を変更し、
// \`npm run generate:tokens\` を実行してください。
// source: tokens.json v${tokens.meta.version} (${tokens.meta.lastUpdated})
// =============================================================
`;

function tsConst(name, value) {
  return `${BANNER}\nexport const ${name} = ${JSON.stringify(value, null, 2)} as const;\n`;
}

const filePrimitives = tsConst('primitives', primitiveDict);
const fileThemes = tsConst('themes', themes);
const fileScales = tsConst('scales', scales);

const fileIndex = `${BANNER}
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
`;

const fileJson = JSON.stringify(
  { meta: tokens.meta, themeNames: THEMES, primitives: primitiveDict, themes, scales },
  null,
  2
) + '\n';

const outputs = {
  'primitives.ts': filePrimitives,
  'themes.ts': fileThemes,
  'scales.ts': fileScales,
  'index.ts': fileIndex,
  'tokens.native.json': fileJson,
};

/* ---------- write / check ---------- */

if (CHECK) {
  const stale = [];
  for (const [name, content] of Object.entries(outputs)) {
    const p = join(OUT_DIR, name);
    if (!existsSync(p) || readFileSync(p, 'utf8') !== content) stale.push(name);
  }
  if (stale.length > 0) {
    console.error(
      `✗ platform tokens が古いです（${stale.join(', ')}）。\n  \`npm run generate:tokens\` を実行してください。`
    );
    process.exit(1);
  }
  console.log('✓ platform tokens は最新です');
} else {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const [name, content] of Object.entries(outputs)) {
    writeFileSync(join(OUT_DIR, name), content);
  }
  console.log(
    `✓ platform tokens を生成しました → src/tokens/native/ (${THEMES.length} themes × light/dark, ${Object.keys(scales).length} scale groups)`
  );
}
