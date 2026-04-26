import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "../..");
const projectRoot = resolve(root, "..");

// --- Types ---

export interface ComponentEntry {
  name: string;
  path: string;
  category: string;
  description: string;
  variants?: string[];
  sizes?: string[];
  subComponents?: string[];
}

export interface ComponentsData {
  components: {
    ui: ComponentEntry[];
    patterns: ComponentEntry[];
  };
}

export interface ProhibitionRule {
  id: string;
  category: string;
  level: "error" | "warn";
  pattern: string;
  message: string;
  fix: string;
}

export interface RulesData {
  rules: ProhibitionRule[];
}

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
      readFileSync(resolve(root, "data/components.json"), "utf-8")
    );
  }
  return componentsCache!;
}

export function loadRules(): RulesData {
  if (!rulesCache) {
    rulesCache = JSON.parse(
      readFileSync(resolve(root, "data/rules.json"), "utf-8")
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
