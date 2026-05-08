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
    meta: {
        name: string;
        version: string;
        description: string;
        counts: Record<string, number>;
    };
    ui: ComponentEntry[];
    patterns: ComponentEntry[];
    commerce: ComponentEntry[];
    admin: ComponentEntry[];
    shells: ComponentEntry[];
}
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
    aiPatterns: {
        description: string;
        patterns: AiPattern[];
    };
    accessibility: unknown[];
}
export interface TokenEntry {
    name: string;
    value: string;
}
export declare function loadComponents(): ComponentsData;
export declare function loadRules(): RulesData;
export declare function loadPrimitiveTokens(): TokenEntry[];
export declare function loadSemanticTokens(): TokenEntry[];
