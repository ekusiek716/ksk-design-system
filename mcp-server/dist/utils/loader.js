import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));
// mcp-server/ -> project root
const projectRoot = resolve(__dirname, "../../..");
// --- Caches ---
let componentsCache = null;
let rulesCache = null;
let primitiveTokensCache = null;
let semanticTokensCache = null;
// --- Loaders ---
export function loadComponents() {
    if (!componentsCache) {
        componentsCache = JSON.parse(readFileSync(resolve(projectRoot, "contracts/components.json"), "utf-8"));
    }
    return componentsCache;
}
export function loadRules() {
    if (!rulesCache) {
        rulesCache = JSON.parse(readFileSync(resolve(projectRoot, "contracts/rules.json"), "utf-8"));
    }
    return rulesCache;
}
function parseCssVariables(content) {
    const tokens = [];
    const regex = /--([\w-]+)\s*:\s*([^;]+);/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        tokens.push({
            name: `--${match[1]}`,
            value: match[2].trim(),
        });
    }
    return tokens;
}
export function loadPrimitiveTokens() {
    if (!primitiveTokensCache) {
        try {
            const content = readFileSync(resolve(projectRoot, "src/styles/primitive.css"), "utf-8");
            primitiveTokensCache = parseCssVariables(content);
        }
        catch {
            primitiveTokensCache = [];
        }
    }
    return primitiveTokensCache;
}
export function loadSemanticTokens() {
    if (!semanticTokensCache) {
        try {
            const content = readFileSync(resolve(projectRoot, "src/styles/semantic.css"), "utf-8");
            semanticTokensCache = parseCssVariables(content);
        }
        catch {
            semanticTokensCache = [];
        }
    }
    return semanticTokensCache;
}
