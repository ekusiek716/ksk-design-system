/**
 * P049 — product theme の許可リスト外の DS 変数上書きを検出する lint（issue #364）
 *
 * 公開 CLI（`npx ksk-ds lint`）が消費プロダクトの CSS を検査できることと、
 * 許可リスト・namespace 定義が DS の実 CSS からドリフトしていないことを固定する。
 */
import { describe, expect, it } from "vitest"
import { mkdtempSync, writeFileSync, readFileSync, readdirSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { spawnSync } from "node:child_process"

import { inspectProductThemeOverrides, loadProductThemeContract } from "../bin/product-theme-override.js"

const ROOT = process.cwd()
const contractJson = JSON.parse(
  readFileSync(join(ROOT, "contracts/product-theme-overrides.json"), "utf8"),
) as {
  allowedVariables: Record<string, string[]>
  dsVariableNamespaces: string[]
}
const contract = loadProductThemeContract(contractJson)

function runLint(css: string) {
  const dir = mkdtempSync(join(tmpdir(), "ksk-ds-p049-"))
  const file = join(dir, "product-theme.css")
  writeFileSync(file, css)
  return spawnSync("node", [join(ROOT, "bin/init.js"), "lint", file], {
    cwd: dir,
    encoding: "utf8",
  })
}

describe("P049 の判定ロジック", () => {
  it("許可された変数の上書きは違反にしない", () => {
    const findings = inspectProductThemeOverrides(
      `:root { --Control-Height-Md: 3rem; --Brand-Primary: #123456; }`,
      contract,
    )
    expect(findings).toEqual([])
  })

  it("許可リスト外の DS 内部変数の上書きを検出する", () => {
    const findings = inspectProductThemeOverrides(
      `:root { --Hover-Primary-Button: red; --Z-Modal: 1; --glass-blur: 2px; }`,
      contract,
    )
    expect(findings.map((f) => f.name)).toEqual([
      "--Hover-Primary-Button",
      "--Z-Modal",
      "--glass-blur",
    ])
  })

  it("消費側アプリ自前の変数は対象外（DS の namespace に該当しない）", () => {
    const findings = inspectProductThemeOverrides(
      `:root { --my-app-header-height: 64px; --primary: #fff; }`,
      contract,
    )
    expect(findings).toEqual([])
  })

  it("var() での参照は宣言ではないので違反にしない", () => {
    const findings = inspectProductThemeOverrides(
      `.a { color: var(--Hover-Primary-Button); background: var(--Z-Modal, 1); }`,
      contract,
    )
    expect(findings).toEqual([])
  })

  it("コメント内の記述を誤検知しない", () => {
    const findings = inspectProductThemeOverrides(
      `/* かつては --Hover-Primary-Button: red; と書いていた */\n:root { color: red; }`,
      contract,
    )
    expect(findings).toEqual([])
  })

  it("行番号を正しく返す（コメントで行がずれない）", () => {
    const findings = inspectProductThemeOverrides(
      `/* 1行目\n2行目 */\n:root {\n  --Z-Toast: 5;\n}`,
      contract,
    )
    expect(findings).toEqual([{ line: 4, name: "--Z-Toast" }])
  })
})

describe("公開 CLI（ksk-ds lint）", () => {
  it("消費側 CSS の内部変数上書きを P049 のエラーとして報告する", () => {
    const result = runLint(`:root[data-product="acme"] {\n  --Hover-Primary-Button: #f00;\n}`)
    expect(result.stdout).toContain("error P049")
    expect(result.stdout).toContain("--Hover-Primary-Button")
    expect(result.status).toBe(1)
  })

  it("許可リスト内だけの上書きは通す", () => {
    const result = runLint(
      `:root {\n  --Control-Height-Md: 3rem;\n  --Field-Radius: 0;\n  --Product-Card-Padding: 1rem;\n}`,
    )
    expect(result.stdout).not.toContain("P049")
    expect(result.status).toBe(0)
  })

  it("CSS には TSX 向けの正規表現ルールを当てない（誤検知しない）", () => {
    // P008（HEX 直書き）は .tsx 向け。CSS に色を書くのは当然なので流してはいけない。
    const result = runLint(`:root {\n  --my-app-accent: #3B82F6;\n}`)
    expect(result.stdout).toContain("違反は見つかりませんでした")
    expect(result.status).toBe(0)
  })
})

describe("契約のドリフト検査", () => {
  /** DS が実際に宣言している CSS 変数名 */
  function declaredVariables(): string[] {
    const dirs = ["src/styles", "src/themes"]
    const files = dirs.flatMap((dir) =>
      readdirSync(join(ROOT, dir))
        .filter((name) => name.endsWith(".css"))
        .map((name) => join(ROOT, dir, name)),
    )
    files.push(join(ROOT, "src/preset.css"))

    const names = new Set<string>()
    for (const file of files) {
      const css = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "")
      for (const match of css.matchAll(/^\s*(--[A-Za-z0-9_-]+)\s*:/gm)) names.add(match[1])
    }
    return [...names]
  }

  it("PascalCase の DS 変数はすべて dsVariableNamespaces のどれかに属する", () => {
    // ここが漏れると、その namespace の変数は消費側が自由に上書きしても P049 が黙る。
    const orphans = declaredVariables()
      .filter((name) => /^--[A-Z]/.test(name))
      .filter((name) => !contractJson.dsVariableNamespaces.some((p) => name.startsWith(p)))
    expect(orphans).toEqual([])
  })

  it("許可リストの変数はすべて DS が実際に宣言している（存在しない変数を公開しない）", () => {
    const declared = new Set(declaredVariables())
    // --card-surface は「宣言されていたら効く」シームなので既定宣言を持たない（card.tsx 側で参照）
    const seams = new Set(["--card-surface"])
    const missing = [...contract.allowed].filter((name) => !declared.has(name) && !seams.has(name))
    expect(missing).toEqual([])
  })
})
