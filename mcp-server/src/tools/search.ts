import {
  loadComponents,
  loadRules,
  loadPrimitiveTokens,
  loadSemanticTokens,
} from "../utils/loader.js";

interface SearchResult {
  type: "component" | "token" | "rule";
  id?: string;
  name?: string;
  data: unknown;
}

/**
 * Search across all data sources by query string.
 * Supports Japanese and English keywords.
 */
export function search(query: string): SearchResult[] {
  const results: SearchResult[] = [];
  const q = query.toLowerCase();

  // Search components (ui + patterns)
  const components = loadComponents();
  const allComponents = [
    ...components.components.ui,
    ...components.components.patterns,
  ];

  for (const comp of allComponents) {
    const searchable = [
      comp.name,
      comp.path,
      comp.category,
      comp.description,
      ...(comp.variants ?? []),
      ...(comp.sizes ?? []),
      ...(comp.subComponents ?? []),
    ]
      .join(" ")
      .toLowerCase();

    if (searchable.includes(q)) {
      results.push({
        type: "component",
        id: comp.path,
        name: comp.name,
        data: {
          name: comp.name,
          path: comp.path,
          category: comp.category,
          description: comp.description,
          variants: comp.variants,
          sizes: comp.sizes,
          subComponents: comp.subComponents,
          importPath: "@ksk/design-system",
        },
      });
    }
  }

  // Search tokens (primitive + semantic)
  const allTokens = [...loadSemanticTokens(), ...loadPrimitiveTokens()];
  for (const token of allTokens) {
    if (
      token.name.toLowerCase().includes(q) ||
      token.value.toLowerCase().includes(q)
    ) {
      results.push({
        type: "token",
        name: token.name,
        data: token,
      });
    }
  }

  // Search rules
  const { rules } = loadRules();
  for (const rule of rules) {
    const searchable = [
      rule.id,
      rule.pattern,
      rule.message,
      rule.fix,
      rule.category,
      rule.level,
    ]
      .join(" ")
      .toLowerCase();

    if (searchable.includes(q)) {
      results.push({
        type: "rule",
        id: rule.id,
        name: rule.pattern,
        data: rule,
      });
    }
  }

  return results;
}
