import { loadComponents } from "../utils/loader.js";
import type { ComponentEntry } from "../utils/loader.js";

interface ComponentResult extends ComponentEntry {
  importPath: string;
  group: string;
}

/**
 * Get component metadata by name or path fragment.
 * Searches all groups: ui, patterns, commerce, admin, shells.
 */
export function getComponent(id: string): ComponentResult | null {
  const data = loadComponents();
  const normalized = id.toLowerCase().replace(/\s+/g, "-");

  const groups = [
    { key: "ui", items: data.ui },
    { key: "patterns", items: data.patterns },
    { key: "commerce", items: data.commerce },
    { key: "admin", items: data.admin },
    { key: "shells", items: data.shells },
  ] as const;

  for (const { key, items } of groups) {
    // Exact name match
    const exact = items.find((c) => c.name.toLowerCase() === normalized);
    if (exact) return { ...exact, importPath: "ksk-design-system", group: key };

    // Path or partial name match
    const partial = items.find(
      (c) =>
        c.path.toLowerCase().endsWith(normalized) ||
        c.name.toLowerCase().includes(normalized) ||
        c.path.toLowerCase().includes(normalized)
    );
    if (partial) return { ...partial, importPath: "ksk-design-system", group: key };
  }

  return null;
}
