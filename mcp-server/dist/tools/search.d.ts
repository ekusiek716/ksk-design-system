interface SearchResult {
    type: "component" | "token" | "rule" | "ai-pattern";
    id?: string;
    name?: string;
    data: unknown;
}
/**
 * Search across all data sources by query string.
 * Supports Japanese and English keywords.
 */
export declare function search(query: string): SearchResult[];
export {};
