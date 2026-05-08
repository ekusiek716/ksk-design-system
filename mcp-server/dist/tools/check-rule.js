import { loadRules } from "../utils/loader.js";
/**
 * Check Tailwind classes against KSK DS prohibition rules and AI anti-patterns.
 */
export function checkRule(classes) {
    const { prohibited, aiPatterns } = loadRules();
    const violations = [];
    const aiPatternMatches = [];
    const classList = classes.split(/\s+/).filter(Boolean);
    for (const cls of classList) {
        // Check prohibited rules
        for (const rule of prohibited) {
            try {
                if (new RegExp(rule.pattern).test(cls)) {
                    violations.push({
                        class: cls,
                        ruleId: rule.id,
                        severity: rule.severity,
                        category: rule.category,
                        message: rule.message,
                        fix: rule.fix,
                    });
                }
            }
            catch {
                if (cls.includes(rule.pattern)) {
                    violations.push({
                        class: cls,
                        ruleId: rule.id,
                        severity: rule.severity,
                        category: rule.category,
                        message: rule.message,
                        fix: rule.fix,
                    });
                }
            }
        }
        // Check AI anti-patterns
        for (const ap of aiPatterns.patterns) {
            try {
                if (new RegExp(ap.pattern).test(cls)) {
                    aiPatternMatches.push({
                        class: cls,
                        patternId: ap.id,
                        name: ap.name,
                        description: ap.description,
                        fix: ap.fix,
                    });
                }
            }
            catch {
                if (cls.includes(ap.pattern)) {
                    aiPatternMatches.push({
                        class: cls,
                        patternId: ap.id,
                        name: ap.name,
                        description: ap.description,
                        fix: ap.fix,
                    });
                }
            }
        }
    }
    return { violations, aiPatternMatches };
}
