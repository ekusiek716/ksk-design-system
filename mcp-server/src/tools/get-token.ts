import {
  loadPrimitiveTokens,
  loadSemanticTokens,
} from "../utils/loader.js";
import type { TokenEntry } from "../utils/loader.js";

interface TokenResult {
  category: string;
  tokens: TokenEntry[];
  count: number;
}

const typographyTokens: TokenEntry[] = [
  { name: "typo-heading-3xl", value: "28px / bold / 1.5 / 0.04em — ページタイトル" },
  { name: "typo-heading-2xl", value: "24px / bold / 1.5 / 0.04em — 主要セクション" },
  { name: "typo-heading-xl", value: "21px / bold / 1.5 / 0.04em — サブセクション" },
  { name: "typo-heading-lg", value: "18px / bold / 1.5 / 0.04em — グループ見出し" },
  { name: "typo-heading-md", value: "16px / bold / 1.5 / 0.04em — 小見出し" },
  { name: "typo-heading-sm", value: "14px / bold / 1.5 / 0.04em — ラベル的見出し" },
  { name: "typo-body-lg", value: "16px / normal / 1.75 — 本文テキスト（大）" },
  { name: "typo-body-md", value: "14px / normal / 1.75 — 本文テキスト（標準）" },
  { name: "typo-body-sm", value: "12px / normal / 1.5 — 補足テキスト" },
  { name: "typo-body-xs", value: "10px / normal / 1.5 — 最小テキスト" },
  { name: "typo-label-lg", value: "16px / bold / 1.5 / 0.04em — ボタン大, CTA" },
  { name: "typo-label-md", value: "14px / bold / 1.5 / 0.04em — ボタン標準, ナビ" },
  { name: "typo-label-sm", value: "12px / medium / 1.5 — タグ, バッジ, メタ情報" },
  { name: "typo-label-xs", value: "10px / medium / 1.5 — 小タグ" },
  { name: "typo-mono-md", value: "14px / normal / 1.5 — コード, 数値" },
  { name: "typo-mono-sm", value: "12px / normal / 1.5 — 小コード" },
  { name: "typo-caption", value: "11px / normal / 1.5 — キャプション" },
];

const spacingTokens: TokenEntry[] = [
  { name: "gap-0.5 / p-0.5", value: "2px — 密接した要素間" },
  { name: "gap-1 / p-1", value: "4px — アイコンとラベル間" },
  { name: "gap-1.5 / p-1.5", value: "6px — チップ間, タグ間" },
  { name: "gap-2 / p-2", value: "8px — 標準要素間" },
  { name: "gap-3 / p-3", value: "12px — セクション内要素間" },
  { name: "gap-4 / p-4", value: "16px — セクション間" },
  { name: "gap-6 / p-6", value: "24px — カード・ダイアログ内パディング" },
  { name: "px-4", value: "16px — ページ左右マージン（SP）" },
  { name: "px-6", value: "24px — ページ左右マージン（PC）" },
];

const radiusTokens: TokenEntry[] = [
  { name: "rounded-none", value: "0px — 角丸なし" },
  { name: "rounded-sm", value: "4px — タグ, 入力フィールド" },
  { name: "rounded-lg", value: "8px — カード（標準）, ダイアログ" },
  { name: "rounded-2xl", value: "16px — モーダル" },
  { name: "rounded-full", value: "50% — ボタン丸型, アバター, バッジ" },
];

const shadowTokens: TokenEntry[] = [
  { name: "--shadow-sm", value: "小さいシャドウ。リスト項目ホバー等" },
  { name: "--shadow-md", value: "標準シャドウ。カード等に使用" },
  { name: "--shadow-dialog", value: "モーダル・ダイアログ用シャドウ" },
];

const sizeTokens: TokenEntry[] = [
  { name: "max-w-screen-xl", value: "PCメインコンテンツ最大幅" },
  { name: "button-xs", value: "24px — 極小ボタン" },
  { name: "button-sm", value: "32px — コンパクトUI" },
  { name: "button-default", value: "40px — 標準ボタン" },
  { name: "button-lg", value: "48px — 強調CTA" },
  { name: "button-xl", value: "56px — フルワイドCTA" },
];

/**
 * Get design tokens by category.
 */
export function getToken(category: string): TokenResult {
  const cat = category.toLowerCase();

  switch (cat) {
    case "color":
    case "colors":
    case "colour": {
      const primitive = loadPrimitiveTokens();
      const semantic = loadSemanticTokens();
      return {
        category: "color",
        tokens: [...semantic, ...primitive],
        count: semantic.length + primitive.length,
      };
    }

    case "primitive":
    case "primitive-color": {
      const tokens = loadPrimitiveTokens();
      return { category: "primitive", tokens, count: tokens.length };
    }

    case "semantic":
    case "semantic-color": {
      const tokens = loadSemanticTokens();
      return { category: "semantic", tokens, count: tokens.length };
    }

    case "typography":
    case "typo":
    case "font":
    case "text":
      return { category: "typography", tokens: typographyTokens, count: typographyTokens.length };

    case "spacing":
    case "space":
    case "gap":
    case "margin":
    case "padding":
      return { category: "spacing", tokens: spacingTokens, count: spacingTokens.length };

    case "radius":
    case "rounded":
    case "corner":
    case "角丸":
      return { category: "radius", tokens: radiusTokens, count: radiusTokens.length };

    case "shadow":
    case "elevation":
      return { category: "shadow", tokens: shadowTokens, count: shadowTokens.length };

    case "size":
    case "sizes":
    case "dimension":
      return { category: "size", tokens: sizeTokens, count: sizeTokens.length };

    default: {
      const allTokens = [
        ...loadSemanticTokens(),
        ...loadPrimitiveTokens(),
        ...typographyTokens,
        ...spacingTokens,
        ...radiusTokens,
        ...shadowTokens,
        ...sizeTokens,
      ];
      const filtered = allTokens.filter(
        (t) =>
          t.name.toLowerCase().includes(cat) ||
          t.value.toLowerCase().includes(cat)
      );
      return {
        category: `search: ${category}`,
        tokens: filtered,
        count: filtered.length,
      };
    }
  }
}
