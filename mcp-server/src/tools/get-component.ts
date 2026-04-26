import { loadComponents } from "../utils/loader.js";
import type { ComponentEntry } from "../utils/loader.js";

/**
 * Get component metadata by name or ID.
 * Searches both ui/ and patterns/ categories.
 */
export function getComponent(id: string): (ComponentEntry & { importPath: string }) | null {
  const data = loadComponents();
  const normalized = id.toLowerCase().replace(/\s+/g, "-");

  const allComponents = [
    ...data.components.ui.map((c) => ({ ...c, importPath: `@ksk/design-system` })),
    ...data.components.patterns.map((c) => ({ ...c, importPath: `@ksk/design-system` })),
  ];

  // Exact match by name (case-insensitive)
  const exact = allComponents.find(
    (c) => c.name.toLowerCase() === normalized || c.path.toLowerCase().endsWith(normalized)
  );
  if (exact) return exact;

  // Partial match
  const partial = allComponents.find(
    (c) =>
      c.name.toLowerCase().includes(normalized) ||
      c.path.toLowerCase().includes(normalized) ||
      c.description.toLowerCase().includes(normalized)
  );
  return partial ?? null;
}
