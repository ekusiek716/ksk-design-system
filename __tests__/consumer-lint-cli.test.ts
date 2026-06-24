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
})
