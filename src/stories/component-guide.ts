import components from "../../contracts/components.json"
import screens from "../../contracts/screen-patterns.json"

export interface ComponentGuide { name: string; description: string; rules?: string[]; variants?: string[]; path: string; subcomponents?: string[] }
export const componentGuides = Object.entries(components).flatMap(([key, value]) => key === "meta" ? [] : value as ComponentGuide[])
export const screenPatterns = screens.patterns
export const decisionTree = screens.decisionTree
export function findGuide(name: string) {
  return componentGuides.find((entry) => entry.name.split(/[, /]+/).includes(name) || entry.subcomponents?.includes(name))
}
