import { loadComponents, loadRules, loadPrimitiveTokens, loadSemanticTokens, } from "../utils/loader.js";
/**
 * Search across all data sources by query string.
 * Supports Japanese and English keywords.
 */
export function search(query) {
    const results = [];
    const q = query.toLowerCase();
    // Search components (all groups)
    const components = loadComponents();
    const groups = [
        { key: "ui", items: components.ui },
        { key: "patterns", items: components.patterns },
        { key: "commerce", items: components.commerce },
        { key: "admin", items: components.admin },
        { key: "shells", items: components.shells },
    ];
    for (const { key, items } of groups) {
        for (const comp of items) {
            const searchable = [
                comp.name,
                comp.path,
                comp.description ?? "",
                ...(comp.variants ?? []),
                ...(comp.sizes ?? []),
                ...(comp.subComponents ?? []),
                ...(comp.rules ?? []),
            ]
                .join(" ")
                .toLowerCase();
            if (searchable.includes(q)) {
                results.push({
                    type: "component",
                    id: comp.path,
                    name: comp.name,
                    data: { group: key, importPath: "ksk-design-system", ...comp },
                });
            }
        }
    }
    // Search tokens (semantic + primitive)
    const allTokens = [...loadSemanticTokens(), ...loadPrimitiveTokens()];
    for (const token of allTokens) {
        if (token.name.toLowerCase().includes(q) ||
            token.value.toLowerCase().includes(q)) {
            results.push({ type: "token", name: token.name, data: token });
        }
    }
    // Search prohibited rules
    const { prohibited, aiPatterns } = loadRules();
    for (const rule of prohibited) {
        const searchable = [rule.id, rule.pattern, rule.message, rule.fix, rule.category]
            .join(" ")
            .toLowerCase();
        if (searchable.includes(q)) {
            results.push({ type: "rule", id: rule.id, name: rule.pattern, data: rule });
        }
    }
    // Search AI anti-patterns
    for (const ap of aiPatterns.patterns) {
        const searchable = [ap.id, ap.name, ap.pattern, ap.description, ap.fix]
            .join(" ")
            .toLowerCase();
        if (searchable.includes(q)) {
            results.push({ type: "ai-pattern", id: ap.id, name: ap.name, data: ap });
        }
    }
    return results;
}
