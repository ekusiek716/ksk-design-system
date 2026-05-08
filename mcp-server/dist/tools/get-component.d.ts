import type { ComponentEntry } from "../utils/loader.js";
interface ComponentResult extends ComponentEntry {
    importPath: string;
    group: string;
}
/**
 * Get component metadata by name or path fragment.
 * Searches all groups: ui, patterns, commerce, admin, shells.
 */
export declare function getComponent(id: string): ComponentResult | null;
export {};
