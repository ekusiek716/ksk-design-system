export interface Violation {
    class: string;
    ruleId: string;
    severity: "error" | "warn";
    category: string;
    message: string;
    fix: string;
}
export interface AiPatternMatch {
    class: string;
    patternId: string;
    name: string;
    description: string;
    fix: string;
}
export interface CheckResult {
    violations: Violation[];
    aiPatternMatches: AiPatternMatch[];
}
/**
 * Check Tailwind classes against KSK DS prohibition rules and AI anti-patterns.
 */
export declare function checkRule(classes: string): CheckResult;
