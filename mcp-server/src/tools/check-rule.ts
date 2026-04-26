import { loadRules } from "../utils/loader.js";

export interface Violation {
  class: string;
  ruleId: string;
  level: "error" | "warn";
  category: string;
  message: string;
  fix: string;
}

/**
 * Check Tailwind classes against KSK DS prohibition rules.
 * Returns an array of violations found.
 */
export function checkRule(classes: string): Violation[] {
  const { rules } = loadRules();
  const violations: Violation[] = [];
  const classList = classes.split(/\s+/).filter(Boolean);

  for (const cls of classList) {
    for (const rule of rules) {
      // Pattern can be a regex string (e.g. "font-bold|font-semibold")
      try {
        const regex = new RegExp(rule.pattern);
        if (regex.test(cls)) {
          violations.push({
            class: cls,
            ruleId: rule.id,
            level: rule.level,
            category: rule.category,
            message: rule.message,
            fix: rule.fix,
          });
        }
      } catch {
        // Fallback to plain string includes if regex is invalid
        if (cls.includes(rule.pattern) || rule.pattern.includes(cls)) {
          violations.push({
            class: cls,
            ruleId: rule.id,
            level: rule.level,
            category: rule.category,
            message: rule.message,
            fix: rule.fix,
          });
        }
      }
    }
  }

  return violations;
}
