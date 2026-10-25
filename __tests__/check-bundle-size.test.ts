import { describe, expect, it } from "vitest"
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import {
  buildCaseEntrySource,
  checkEntriesCoverage,
  collectStaticGraph,
  computeBudget,
  exportedJsEntries,
  judge,
  validateBudget,
} from "../scripts/lib/bundle-size.mjs"

/**
 * 配布物サイズ予算（contracts/bundle-size-budget.json）の契約。
 * 実ビルドを伴う測定は scripts/check-bundle-size.mjs（CI の build:lib 直後）が担い、
 * ここでは「予算 JSON の形式」「判定ロジック」「exports との対応」だけを単体で確かめる。
 */
const root = resolve(__dirname, "..")
const realBudget = JSON.parse(readFileSync(join(root, "contracts/bundle-size-budget.json"), "utf8"))
const realPkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"))

const validBudget = () => ({
  meta: { updatedAt: "2026-10-26", metric: "gzip", budgetPolicy: "+10%", externalPolicy: "bare は external" },
  entries: [{ id: "index", specifier: "pkg", file: "dist/index.js", description: "全部", baselineBytes: 1000, budgetBytes: 1100 }],
  treeShaking: [
    {
      id: "button-only",
      description: "Button だけ",
      source: 'import { Button } from "pkg"',
      imports: [{ from: "pkg", names: ["Button"] }],
      baselineBytes: 500,
      budgetBytes: 550,
    },
  ],
})

describe("予算 JSON（実ファイル）", () => {
  it("形式が正しい", () => {
    expect(validateBudget(realBudget)).toEqual([])
  })

  it("全ケースで budgetBytes が baselineBytes 以上（現状値で既に超過していない）", () => {
    for (const item of [...realBudget.entries, ...realBudget.treeShaking]) {
      expect(item.budgetBytes, item.id).toBeGreaterThanOrEqual(item.baselineBytes)
    }
  })

  it("package.json exports が指す dist の JS はすべて entries に予算がある", () => {
    expect(checkEntriesCoverage(realPkg, realBudget)).toEqual([])
  })

  it("tree-shaking ケースは Button / Card / Dialog / cn を含む", () => {
    const names = realBudget.treeShaking.flatMap((c: { imports: { names: string[] }[] }) => c.imports.flatMap((i) => i.names))
    for (const name of ["Button", "Card", "Dialog", "cn"]) expect(names).toContain(name)
  })
})

describe("validateBudget", () => {
  it("最小の正しい予算は通す", () => {
    expect(validateBudget(validBudget())).toEqual([])
  })

  it("budgetBytes が baselineBytes を下回ると落とす", () => {
    const budget = validBudget()
    budget.treeShaking[0].budgetBytes = 499
    expect(validateBudget(budget).join("\n")).toMatch(/budgetBytes\(499\).*baselineBytes\(500\)/)
  })

  it("meta の根拠・測定方法が無いと落とす", () => {
    const budget = validBudget() as Record<string, unknown>
    budget.meta = { updatedAt: "2026-10-26" }
    const errors = validateBudget(budget).join("\n")
    expect(errors).toMatch(/meta\.metric/)
    expect(errors).toMatch(/meta\.budgetPolicy/)
    expect(errors).toMatch(/meta\.externalPolicy/)
  })

  it("実在しない日付・数値でない予算・id 重複・不正な imports を落とす", () => {
    const budget = validBudget()
    budget.meta.updatedAt = "2026-02-31"
    budget.entries.push({ ...budget.entries[0] })
    ;(budget.treeShaking[0] as Record<string, unknown>).budgetBytes = "550"
    ;(budget.treeShaking[0] as Record<string, unknown>).imports = [{ from: "pkg", names: [] }]
    const errors = validateBudget(budget).join("\n")
    expect(errors).toMatch(/updatedAt/)
    expect(errors).toMatch(/id が重複/)
    expect(errors).toMatch(/budgetBytes は 1 以上の整数/)
    expect(errors).toMatch(/imports\[0\]/)
  })

  it("entries / treeShaking が空だと落とす", () => {
    const budget = validBudget() as Record<string, unknown>
    budget.entries = []
    delete budget.treeShaking
    const errors = validateBudget(budget).join("\n")
    expect(errors).toMatch(/entries/)
    expect(errors).toMatch(/treeShaking/)
  })
})

describe("judge（超過・余裕・締め直し注意）", () => {
  it("予算ちょうどまでは超過にしない", () => {
    expect(judge(1000, 1000).status).toBe("ok")
    expect(judge(1001, 1000)).toMatchObject({ status: "over", diff: 1 })
  })

  it("予算の 80% を超えて使っていれば ok、80% 以下なら締め直し注意", () => {
    expect(judge(801, 1000).status).toBe("ok")
    expect(judge(800, 1000).status).toBe("tighten")
    expect(judge(100, 1000).status).toBe("tighten")
  })

  it("締め直し注意は失敗扱いの over ではない", () => {
    expect(judge(1, 1000).status).not.toBe("over")
  })

  it("使用率を返す", () => {
    expect(judge(500, 1000).usage).toBeCloseTo(0.5)
  })

  it("締め直しの閾値を差し替えられる", () => {
    expect(judge(900, 1000, 0.05).status).toBe("tighten")
    expect(judge(900, 1000, 0.2).status).toBe("ok")
  })
})

describe("computeBudget（実測 +10% を 100 バイト単位で切り上げ）", () => {
  it("実測の 1.1 倍以上で、100 バイトの倍数になる", () => {
    for (const baseline of [1, 99, 1296, 18942, 230712]) {
      const budget = computeBudget(baseline)
      expect(budget).toBeGreaterThanOrEqual(baseline * 1.1)
      expect(budget % 100).toBe(0)
      expect(budget).toBeLessThan(baseline * 1.1 + 100)
    }
  })

  it("算出した予算は実測値を余裕を持って許容する", () => {
    expect(judge(1000, computeBudget(1000)).status).toBe("ok")
  })
})

describe("exportedJsEntries / checkEntriesCoverage", () => {
  const pkg = {
    exports: {
      ".": { import: "./dist/index.js", default: "./dist/index.js" },
      "./native/ui": { import: "./dist/native/ui.js" },
      "./preset": { import: "./src/preset.css" },
      "./eslint/x": { import: "./eslint/x.js" },
      "./package.json": "./package.json",
    },
  }

  it("dist/ の JS だけを対象にする（CSS・ソース配布の JS・JSON は除く）", () => {
    expect(exportedJsEntries(pkg)).toEqual([
      { subpath: ".", file: "dist/index.js" },
      { subpath: "./native/ui", file: "dist/native/ui.js" },
    ])
  })

  it("予算の無い公開エントリと、exports に無い予算を検出する", () => {
    const budget = { entries: [{ file: "dist/index.js" }, { file: "dist/gone.js", id: "gone" }] }
    const errors = checkEntriesCoverage(pkg, budget).join("\n")
    expect(errors).toMatch(/native\/ui/)
    expect(errors).toMatch(/gone/)
  })

  it("対応が取れていれば空", () => {
    const budget = { entries: [{ file: "dist/index.js" }, { file: "dist/native/ui.js" }] }
    expect(checkEntriesCoverage(pkg, budget)).toEqual([])
  })
})

describe("collectStaticGraph", () => {
  it("静的 import / re-export の相対チャンクだけを辿る（動的 import・bare は除く・循環でも止まる）", async () => {
    const dir = mkdtempSync(join(tmpdir(), "bundle-size-"))
    mkdirSync(join(dir, "sub"))
    writeFileSync(join(dir, "entry.js"), 'import { a } from "./a-1.js"\nimport "react"\nexport { b } from "./sub/b.js"\nexport const lazy = () => import("./lazy.js")\n')
    writeFileSync(join(dir, "a-1.js"), 'import { b } from "./sub/b.js"\nexport const a = b\n')
    writeFileSync(join(dir, "sub", "b.js"), 'import { a } from "../a-1.js"\nexport const b = 1\nexport const c = a\n')
    writeFileSync(join(dir, "lazy.js"), "export const x = 1\n")
    const files = await collectStaticGraph(join(dir, "entry.js"))
    expect(files.map((f) => f.replace(`${dir}/`, "")).sort()).toEqual(["a-1.js", "entry.js", "sub/b.js"])
  })

  it("実在しない import 先は例外にする", async () => {
    const dir = mkdtempSync(join(tmpdir(), "bundle-size-"))
    writeFileSync(join(dir, "entry.js"), 'import "./missing.js"\n')
    await expect(collectStaticGraph(join(dir, "entry.js"))).rejects.toThrow(/missing\.js/)
  })
})

describe("buildCaseEntrySource", () => {
  it("使った名前を console.log に渡して tree-shaking で消えないようにする", () => {
    const source = buildCaseEntrySource([
      { from: "ksk-design-system", names: ["Button", "cn"] },
      { from: "ksk-design-system/class-names", names: ["buttonVariants"] },
    ])
    expect(source).toBe(
      [
        'import { Button as __ksk_0_0, cn as __ksk_0_1 } from "ksk-design-system"',
        'import { buttonVariants as __ksk_1_0 } from "ksk-design-system/class-names"',
        "console.log(__ksk_0_0, __ksk_0_1, __ksk_1_0)",
      ].join("\n"),
    )
  })
})
