/**
 * contracts/screen-patterns.json / contracts/composition.json の整合性検査
 *
 * 実体の整合ロジックは scripts/check-screen-contracts.mjs（dsComponents の実在チェック・
 * decisionTree の到達可能性/閉路検出・crudMatrix・ctaHierarchy）に集約されている。
 * このテストは (1) 両ファイルが JSON として parse 可能であること、
 * (2) decisionTree の基本整合（各 step の yes/no が pattern-id か step 番号）、
 * (3) スクリプトが実リポジトリに対して exit 0 で完走することを検証する。
 *
 * 実行: npm run test
 */
import { describe, expect, it } from "vitest"
import { readFileSync } from "node:fs"
import { spawnSync } from "node:child_process"

function readJson(relPath: string) {
  return JSON.parse(readFileSync(relPath, "utf8"))
}

function runScreenContractsCheck() {
  return spawnSync(process.execPath, ["scripts/check-screen-contracts.mjs"], {
    cwd: process.cwd(),
    encoding: "utf8",
  })
}

describe("contracts/screen-patterns.json", () => {
  it("is valid JSON with the expected top-level shape", () => {
    const doc = readJson("contracts/screen-patterns.json")
    expect(doc.meta).toBeDefined()
    expect(doc.meta.version).toBe("0.1.0")
    expect(Array.isArray(doc.patterns)).toBe(true)
    expect(doc.patterns.length).toBeGreaterThanOrEqual(5)
    expect(Array.isArray(doc.crudMatrix)).toBe(true)
    expect(Array.isArray(doc.decisionTree)).toBe(true)
    expect(doc.editUiSelection).toBeDefined()
  })

  it("every pattern has a kebab-case id and required fields", () => {
    const doc = readJson("contracts/screen-patterns.json")
    const kebab = /^[a-z0-9]+(-[a-z0-9]+)*$/
    for (const pattern of doc.patterns) {
      expect(pattern.id).toMatch(kebab)
      expect(pattern.name).toBeTruthy()
      expect(pattern.purpose).toBeTruthy()
      expect(Array.isArray(pattern.dsComponents)).toBe(true)
      expect(pattern.dsComponents.length).toBeGreaterThan(0)
      expect(Array.isArray(pattern.whenToUse)).toBe(true)
      expect(Array.isArray(pattern.whenNotToUse)).toBe(true)
      expect(pattern.navigation).toBeDefined()
      expect(typeof pattern.navigation.globalNav).toBe("boolean")
    }
  })

  it("decisionTree nodes only reference real pattern-ids or step numbers", () => {
    const doc = readJson("contracts/screen-patterns.json")
    const patternIds = new Set(doc.patterns.map((p: { id: string }) => p.id))
    const stepNumbers = new Set(doc.decisionTree.map((n: { step: number }) => n.step))

    for (const node of doc.decisionTree) {
      for (const target of [node.yes, node.no]) {
        if (typeof target === "number") {
          expect(stepNumbers.has(target)).toBe(true)
        } else {
          expect(patternIds.has(target)).toBe(true)
        }
      }
    }
  })

  it("crudMatrix rows reference real pattern-ids", () => {
    const doc = readJson("contracts/screen-patterns.json")
    const patternIds = new Set(doc.patterns.map((p: { id: string }) => p.id))
    for (const row of doc.crudMatrix) {
      expect(patternIds.has(row.pattern)).toBe(true)
    }
  })
})

describe("contracts/composition.json", () => {
  it("is valid JSON with the expected top-level shape", () => {
    const doc = readJson("contracts/composition.json")
    expect(doc.meta).toBeDefined()
    expect(doc.pageSkeletons.mobile).toBeDefined()
    expect(doc.pageSkeletons.desktop).toBeDefined()
    expect(doc.pageSkeletons.admin).toBeDefined()
    expect(doc.pageSkeletons.marketing).toBeDefined()
    expect(Array.isArray(doc.spacingRhythm.levels)).toBe(true)
    expect(Array.isArray(doc.cardHierarchy.layers)).toBe(true)
    expect(Array.isArray(doc.textHierarchy.tree)).toBe(true)
    expect(Array.isArray(doc.ctaHierarchy.priority)).toBe(true)
  })

  it("cardHierarchy does not embed raw hex values", () => {
    const doc = readJson("contracts/composition.json")
    const serialized = JSON.stringify(doc.cardHierarchy)
    expect(serialized).not.toMatch(/#[0-9a-fA-F]{3,8}\b/)
  })
})

describe("scripts/check-screen-contracts.mjs", () => {
  it("exits 0 against the checked-in contracts", () => {
    const result = runScreenContractsCheck()
    expect(result.status).toBe(0)
    expect(result.stdout).toContain("画面パターン契約は整合")
  })
})
