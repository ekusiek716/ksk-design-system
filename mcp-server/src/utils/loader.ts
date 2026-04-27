import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
// mcp-server/ -> project root
const projectRoot = resolve(__dirname, "../../..");

// --- Types (contracts/components.json) ---

export interface ComponentEntry {
  name: string;
  path: string;
  variants?: string[];
  sizes?: string[];
  accessibility?: string[];
  rules?: string[];
  subComponents?: string[];
  description?: string;
}

export interface ComponentsData {
  meta: { name: string; version: string; description: string; counts: Record<string, number> };
  ui: ComponentEntry[];
  patterns: ComponentEntry[];
  commerce: ComponentEntry[];
  admin: ComponentEntry[];
  shells: ComponentEntry[];
}

// --- Types (contracts/rules.json) ---

export interface ProhibitionRule {
  id: string;
  severity: "error" | "warn";
  category: string;
  pattern: string;
  excludes?: string[];
  message: string;
  fix: string;
}

export interface AiPattern {
  id: string;
  name: string;
  pattern: string;
  description: string;
  fix: string;
}

export interface RulesData {
  prohibited: ProhibitionRule[];
  aiPatterns: { description: string; patterns: AiPattern[] };
  accessibility: unknown[];
}

// --- Token type ---

export interface TokenEntry {
  name: string;
  value: string;
}

// --- Caches ---

let componentsCache: ComponentsData | null = null;
let rulesCache: RulesData | null = null;
let primitiveTokensCache: TokenEntry[] | null = null;
let semanticTokensCache: TokenEntry[] | null = null;

// --- Loaders ---

export function loadComponents(): ComponentsData {
  if (!componentsCache) {
    componentsCache = JSON.parse(
      readFileSync(resolve(projectRoot, "contracts/components.json"), "utf-8")
    );
  }
  return componentsCache!;
}

export function loadRules(): RulesData {
  if (!rulesCache) {
    rulesCache = JSON.parse(
      readFileSync(resolve(projectRoot, "contracts/rules.json"), "utf-8")
    );
  }
  return rulesCache!;
}

function parseCssVariables(content: string): TokenEntry[] {
  const tokens: TokenEntry[] = [];
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

export function loadPrimitiveTokens(): TokenEntry[] {
  if (!primitiveTokensCache) {
    try {
      const content = readFileSync(
        resolve(projectRoot, "src/styles/primitive.css"),
        "utf-8"
      );
      primitiveTokensCache = parseCssVariables(content);
    } catch {
      primitiveTokensCache = [];
    }
  }
  return primitiveTokensCache;
}

export function loadSemanticTokens(): TokenEntry[] {
  if (!semanticTokensCache) {
    try {
      const content = readFileSync(
        resolve(projectRoot, "src/styles/semantic.css"),
        "utf-8"
      );
      semanticTokensCache = parseCssVariables(content);
    } catch {
      semanticTokensCache = [];
    }
  }
  return semanticTokensCache;
}
