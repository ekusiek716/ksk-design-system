import { describe, expect, it, vi } from "vitest"
import { mkdtempSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, relative, resolve } from "node:path"
import { runLintCli } from "../bin/lint.js"

/**
 * P054: フォーカスリングを半透明で使わない。
 *
 * Focus-High-Emphasis を /50 で重ねたリングは、ライトで 1.3〜1.7:1・ダークでも 2.4〜3.4:1 しか
 * 取れず WCAG 1.4.11（非テキスト 3:1）を割る。consumer アプリが旧 fix 文字列（/50 付き）を
 * コピーしていたため、lint で拾う。DS 自身にも同じ書き方を増やさない（下の走査テスト）。
 */

const PKG_ROOT = resolve(process.cwd())

type Finding = { file: string; line: number; ruleId: string; severity: string }

async function lint(source: string) {
  const cwd = mkdtempSync(join(tmpdir(), "ksk-ds-lint-p054-"))
  writeFileSync(join(cwd, "Example.tsx"), source)
  const stdout: string[] = []
  const logSpy = vi.spyOn(console, "log").mockImplementation((...a) => void stdout.push(a.join(" ")))
  const errSpy = vi.spyOn(console, "error").mockImplementation(() => {})
  try {
    await runLintCli([cwd, "--format", "json"], { cwd, pkgRoot: PKG_ROOT })
    const raw = stdout.join("\n")
    return raw ? (JSON.parse(raw).results as Finding[]) : []
  } finally {
    logSpy.mockRestore()
    errSpy.mockRestore()
  }
}

const p054 = (results: Finding[]) => results.filter((f) => f.ruleId === "P054")

describe("P054 フォーカスリングの半透明", () => {
  it("ring-[var(--Focus-High-Emphasis)]/50 を警告（warning）として検出する", async () => {
    const results = await lint(
      `export const A = () => <Button className="focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50">a</Button>\n`,
    )
    expect(p054(results)).toHaveLength(1)
    expect(p054(results)[0].severity).toBe("warning")
  })

  it("/50 以外の数値・任意値の不透明度、focus-within / 常時 ring でも検出する", async () => {
    const results = await lint(
      [
        `export const A = () => <div className="focus-within:ring-2 focus-within:ring-[var(--Focus-High-Emphasis)]/30" />`,
        `export const B = () => <div className="ring-[3px] ring-[var(--Focus-High-Emphasis)]/[0.4]" />`,
        `export const C = () => <div className="focus-visible:ring-[var(--Focus-High-Emphasis)]/100" />`,
      ].join("\n") + "\n",
    )
    expect(p054(results)).toHaveLength(3)
  })

  it("不透明のリングは検出しない", async () => {
    const results = await lint(
      `export const A = () => <Button className="focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]">a</Button>\n`,
    )
    expect(p054(results)).toHaveLength(0)
  })

  it("別トークンの半透明リング（Caution の aria-invalid 等）は対象外", async () => {
    const results = await lint(
      `export const A = () => <input className="aria-invalid:ring-[var(--Caution-Base)]/20" />\n`,
    )
    expect(p054(results)).toHaveLength(0)
  })

  it("rules.json の fix 文字列自体が半透明を含まない（自分の警告を自分で出さない）", () => {
    const rules = JSON.parse(readFileSync(join(PKG_ROOT, "contracts/rules.json"), "utf8"))
    const re = /ring-\[var\(--Focus-High-Emphasis\)\]\/(?:\d+|\[[^\]]*\])/
    const rule = rules.prohibited.find((r: { id: string }) => r.id === "P054")
    expect(new RegExp(rule.pattern).source).toBeTruthy()
    for (const r of rules.prohibited) if (typeof r.fix === "string") expect(r.fix, r.id).not.toMatch(re)
    for (const r of rules.accessibility.requirements) expect(r.rule, r.id).not.toMatch(re)
  })
})

describe("DS 内部に半透明のフォーカスリングを増やさない", () => {
  const RE = /ring-\[var\(--Focus-High-Emphasis\)\]\/(?:\d+|\[[^\]]*\])/

  function walk(dir: string, out: string[] = []): string[] {
    for (const name of readdirSync(dir)) {
      const abs = join(dir, name)
      if (statSync(abs).isDirectory()) walk(abs, out)
      else if (/\.(tsx?|css)$/.test(name)) out.push(abs)
    }
    return out
  }

  it("src/ 配下（ソース・生成 safelist を含む）に ring-[var(--Focus-High-Emphasis)]/<不透明度> が無い", () => {
    const offenders = walk(join(PKG_ROOT, "src")).filter((f) => RE.test(readFileSync(f, "utf8")))
    expect(offenders.map((f) => relative(PKG_ROOT, f))).toEqual([])
  })
})
