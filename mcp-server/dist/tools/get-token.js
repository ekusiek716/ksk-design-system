import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "../../..");
let tokensJsonCache = null;
function loadTokensJson() {
    if (!tokensJsonCache) {
        tokensJsonCache = JSON.parse(readFileSync(resolve(projectRoot, "tokens.json"), "utf-8"));
    }
    return tokensJsonCache;
}
// --- Converters ---
function flattenColors(obj, prefix) {
    const result = [];
    for (const [group, values] of Object.entries(obj)) {
        for (const [shade, value] of Object.entries(values)) {
            result.push({ name: `--${prefix}-${group}-${shade}`, value });
        }
    }
    return result;
}
function flattenSemanticColors(semantic) {
    const result = [];
    const categoryMap = {
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
function typographyTokens(tokens) {
    const result = [];
    for (const [variant, sizes] of Object.entries(tokens.typography)) {
        for (const [size, props] of Object.entries(sizes)) {
            const desc = Object.entries(props)
                .map(([k, v]) => `${k}: ${v}`)
                .join(", ");
            result.push({ name: `typo-${variant}-${size}`, value: desc });
        }
    }
    return result;
}
function spacingTokens(tokens) {
    return tokens.spacing.scale.map((px) => ({
        name: `gap-${px / 4} / p-${px / 4}`,
        value: `${px}px`,
    }));
}
function radiusTokens(tokens) {
    return Object.entries(tokens.borderRadius).map(([key, value]) => ({
        name: `rounded-${key}`,
        value,
    }));
}
function shadowTokens(tokens) {
    return Object.entries(tokens.shadows).map(([key, value]) => ({
        name: `shadow-[var(--shadow-${key})]`,
        value,
    }));
}
// --- Public API ---
export function getToken(category) {
    const cat = category.toLowerCase();
    const tokens = loadTokensJson();
    switch (cat) {
        case "color":
        case "colors":
        case "colour": {
            const semantic = flattenSemanticColors(tokens.colors.semantic);
            const primitive = flattenColors(tokens.colors.primitive, "Primitive");
            return { category: "color", tokens: [...semantic, ...primitive], count: semantic.length + primitive.length };
        }
        case "semantic":
        case "semantic-color": {
            const t = flattenSemanticColors(tokens.colors.semantic);
            return { category: "semantic", tokens: t, count: t.length };
        }
        case "primitive":
        case "primitive-color": {
            const t = flattenColors(tokens.colors.primitive, "Primitive");
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
            const t = Object.entries(tokens.touchTargets).map(([k, v]) => ({
                name: k,
                value: JSON.stringify(v),
            }));
            return { category: "touchTargets", tokens: t, count: t.length };
        }
        default: {
            const allTokens = [
                ...flattenSemanticColors(tokens.colors.semantic),
                ...flattenColors(tokens.colors.primitive, "Primitive"),
                ...typographyTokens(tokens),
                ...spacingTokens(tokens),
                ...radiusTokens(tokens),
                ...shadowTokens(tokens),
            ];
            const filtered = allTokens.filter((t) => t.name.toLowerCase().includes(cat) ||
                t.value.toLowerCase().includes(cat));
            return { category: `search: ${category}`, tokens: filtered, count: filtered.length };
        }
    }
}
