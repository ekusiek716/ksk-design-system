import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { TokenEntry } from "../utils/loader.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "../../..");

interface TokenResult {
  category: string;
  tokens: TokenEntry[];
  count: number;
}

// --- tokens.json loader (cached) ---

interface TokensJson {
  colors: {
    primitive: Record<string, Record<string, string>>;
    /** テーマ差し替え対象の alias レイヤー（default=Blue 参照）。CSS では --Primitive-Brand-* スロット。 */
    brand?: Record<string, string>;
    semantic: Record<string, Record<string, string>>;
  };
  typography: {
    heading: Record<string, { size: string; weight: number; lineHeight: number; letterSpacing?: string }>;
    body: Record<string, { size: string; weight: number | string; lineHeight: number }>;
    label: Record<string, { size: string; weight: number | string; lineHeight: number; letterSpacing?: string }>;
    display?: Record<string, unknown>;
  };
  spacing: { unit: string; scale: number[] };
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  touchTargets: Record<string, unknown>;
}

let tokensJsonCache: TokensJson | null = null;

function loadTokensJson(): TokensJson {
  if (!tokensJsonCache) {
    tokensJsonCache = JSON.parse(
      readFileSync(resolve(projectRoot, "tokens.json"), "utf-8")
    );
  }
  return tokensJsonCache!;
}

// --- Converters ---

function flattenColors(obj: Record<string, Record<string, string>>, prefix: string): TokenEntry[] {
  const result: TokenEntry[] = [];
  for (const [group, values] of Object.entries(obj)) {
    if (group.startsWith("_")) continue;
    for (const [shade, value] of Object.entries(values)) {
      if (shade.startsWith("_")) continue;
      result.push({ name: `--${prefix}-${group}-${shade}`, value });
    }
  }
  return result;
}

// brand は primitive ではなく alias レイヤー（colors.brand）。CSS 上のスロット名は
// --Primitive-Brand-* なので、その名前で出力して従来の一覧と互換を保つ。
function flattenBrandAlias(brand?: Record<string, string>): TokenEntry[] {
  if (!brand) return [];
  return Object.entries(brand)
    .filter(([shade]) => !shade.startsWith("_"))
    .map(([shade, value]) => ({ name: `--Primitive-Brand-${shade}`, value }));
}

function flattenSemanticColors(semantic: Record<string, Record<string, string>>): TokenEntry[] {
  const result: TokenEntry[] = [];
  const categoryMap: Record<string, string> = {
    surface: "Surface",
    text: "Text",
    brand: "Brand",
    focus: "Focus",
    border: "Border",
    status: "Status",
  };
  for (const [group, values] of Object.entries(semantic)) {
    const prefix = categoryMap[group] ?? group;
    for (const [role, value] of Object.entries(values)) {
      const rolePascal = role.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("-");
      result.push({ name: `var(--${prefix}-${rolePascal})`, value });
    }
  }
  return result;
}

function typographyTokens(tokens: TokensJson): TokenEntry[] {
  const result: TokenEntry[] = [];
  for (const [variant, sizes] of Object.entries(tokens.typography)) {
    for (const [size, props] of Object.entries(sizes as Record<string, Record<string, unknown>>)) {
      const desc = Object.entries(props)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
      result.push({ name: `typo-${variant}-${size}`, value: desc });
    }
  }
  return result;
}

function spacingTokens(tokens: TokensJson): TokenEntry[] {
  return tokens.spacing.scale.map((px) => ({
    name: `gap-${px / 4} / p-${px / 4}`,
    value: `${px}px`,
  }));
}

function radiusTokens(tokens: TokensJson): TokenEntry[] {
  return Object.entries(tokens.borderRadius)
    .filter(([key]) => !key.startsWith("_"))
    .map(([key, value]) => ({
      name: `rounded-${key}`,
      value,
    }));
}

function shadowTokens(tokens: TokensJson): TokenEntry[] {
  return Object.entries(tokens.shadows)
    .filter(([key]) => !key.startsWith("_"))
    .map(([key, value]) => ({
      name: `shadow-[var(--shadow-${key})]`,
      value,
    }));
}

// --- Public API ---

export function getToken(category: string): TokenResult {
  const cat = category.toLowerCase();
  const tokens = loadTokensJson();

  switch (cat) {
    case "color":
    case "colors":
    case "colour": {
      const semantic = flattenSemanticColors(tokens.colors.semantic);
      const primitive = [
        ...flattenColors(tokens.colors.primitive, "Primitive"),
        ...flattenBrandAlias(tokens.colors.brand),
      ];
      return { category: "color", tokens: [...semantic, ...primitive], count: semantic.length + primitive.length };
    }

    case "semantic":
    case "semantic-color": {
      const t = flattenSemanticColors(tokens.colors.semantic);
      return { category: "semantic", tokens: t, count: t.length };
    }

    case "primitive":
    case "primitive-color": {
      const t = [
        ...flattenColors(tokens.colors.primitive, "Primitive"),
        ...flattenBrandAlias(tokens.colors.brand),
      ];
      return { category: "primitive", tokens: t, count: t.length };
    }

    case "typography":
    case "typo":
    case "font":
    case "text": {
      const t = typographyTokens(tokens);
      return { category: "typography", tokens: t, count: t.length };
    }

    case "spacing":
    case "space":
    case "gap":
    case "margin":
    case "padding": {
      const t = spacingTokens(tokens);
      return { category: "spacing", tokens: t, count: t.length };
    }

    case "radius":
    case "rounded":
    case "corner":
    case "角丸": {
      const t = radiusTokens(tokens);
      return { category: "radius", tokens: t, count: t.length };
    }

    case "shadow":
    case "elevation": {
      const t = shadowTokens(tokens);
      return { category: "shadow", tokens: t, count: t.length };
    }

    case "size":
    case "touch":
    case "target": {
      const t = Object.entries(tokens.touchTargets)
        .filter(([k]) => !k.startsWith("_"))
        .map(([k, v]) => ({
          name: k,
          value: JSON.stringify(v),
        }));
      return { category: "touchTargets", tokens: t, count: t.length };
    }

    default: {
      const allTokens = [
        ...flattenSemanticColors(tokens.colors.semantic),
        ...flattenColors(tokens.colors.primitive, "Primitive"),
        ...flattenBrandAlias(tokens.colors.brand),
        ...typographyTokens(tokens),
        ...spacingTokens(tokens),
        ...radiusTokens(tokens),
        ...shadowTokens(tokens),
      ];
      const filtered = allTokens.filter(
        (t) =>
          t.name.toLowerCase().includes(cat) ||
          t.value.toLowerCase().includes(cat)
      );
      return { category: `search: ${category}`, tokens: filtered, count: filtered.length };
    }
  }
}
