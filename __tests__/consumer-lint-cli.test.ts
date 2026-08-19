import { describe, expect, it } from "vitest"
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { spawnSync } from "node:child_process"

function runKskLint(source: string, extraArgs: string[] = []) {
  const dir = mkdtempSync(join(tmpdir(), "ksk-ds-consumer-lint-"))
  const srcDir = join(dir, "src")
  mkdirSync(srcDir)
  const file = join(srcDir, "Example.tsx")
  writeFileSync(file, source)
  return spawnSync(process.execPath, ["bin/init.js", "lint", file, ...extraArgs], {
    cwd: process.cwd(),
    encoding: "utf8",
  })
}

describe("consumer lint CLI", () => {
  // issue #374: P032 の否定先読みは「マッチ位置より後ろ」しか見ないため、
  // `border-[var(...)]` の `border` 部分自身にマッチして色指定そのものを違反に
  // 数えていた。ルールの fix が案内する形（色併記 / transparent + 状態クラス）が
  // どちらも消えず、ninshin-todo で 161 件中 148 件が誤検知だった。
  it("P032: 色をトークンで併記した border は違反にしない（自己マッチの回帰）", () => {
    const result = runKskLint(`
      export function Probe() {
        return (
          <>
            <div className="border rounded-lg p-3">A</div>
            <div className="border border-[var(--Border-Low-Emphasis)] rounded-lg p-3">B</div>
            <div className="border border-transparent data-[state=active]:border-[var(--Brand-Primary)]">C</div>
            <div className="border-b border-[var(--Border-Low-Emphasis)]">D</div>
            <div className="border-[var(--Border-Low-Emphasis)] p-2">E</div>
          </>
        )
      }
    `, ["--format", "json"])
    const payload = JSON.parse(result.stdout)
    const p032 = payload.results.filter((f: { ruleId: string; line: number }) => f.ruleId === "P032")
    // 本物の違反は A（5行目）だけ。B〜E は fix が案内する形なので検出しない
    expect(p032.map((f: { line: number }) => f.line)).toEqual([5])
  })


  it("reports contract-backed DS violations with file and fix", () => {
    const result = runKskLint(`
      export function Example() {
        return <button className="text-blue-500">保存</button>
      }
    `)
    expect(result.status).toBe(1)
    expect(result.stdout).toContain("P001")
    expect(result.stdout).toContain("Example.tsx")
    expect(result.stdout).toContain("<Button")
  })

  it("supports JSON output for CI", () => {
    const result = runKskLint(`
      export function Example() {
        return <input type="file" />
      }
    `, ["--format", "json"])
    expect(result.status).toBe(1)
    const payload = JSON.parse(result.stdout)
    expect(payload.results.some((finding: { ruleId: string }) => finding.ruleId === "P039")).toBe(true)
    expect(payload.summary.errors).toBeGreaterThan(0)
  })

  it("requires a reason for custom UI escape hatches", () => {
    const result = runKskLint(`
      // ksk-ds-allow-custom-ui
      export function Example() {
        return <button>特殊</button>
      }
    `)
    expect(result.status).toBe(1)
    expect(result.stdout).toContain("ESCAPE001")
  })

  it("skips a file when a reasoned escape hatch is present", () => {
    const result = runKskLint(`
      // ksk-ds-allow-custom-ui: domain-specific chart brush
      export function Example() {
        return <button>特殊</button>
      }
    `)
    expect(result.status).toBe(0)
  })

  it("does not flag P047 for a motion-related time mention inside a comment", () => {
    const result = runKskLint(`
      // Recomputing per request is ~300-500ms on the current working set,
      // so we memoize it instead.
      export function Example() {
        return <div>キャッシュ</div>
      }
    `)
    expect(result.stdout).not.toContain("P047")
  })

  it("flags P047 for a raw motion value in real code", () => {
    const result = runKskLint(`
      export function Example() {
        return <div style={{ transition: "all 300ms" }}>アニメーション</div>
      }
    `)
    expect(result.stdout).toContain("P047")
  })
})
