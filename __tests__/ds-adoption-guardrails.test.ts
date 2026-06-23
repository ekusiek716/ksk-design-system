import { describe, expect, it } from "vitest"
import { mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { spawnSync } from "node:child_process"

function runLint(source: string) {
  const dir = mkdtempSync(join(tmpdir(), "ksk-ds-lint-"))
  const file = join(dir, "Example.tsx")
  writeFileSync(file, source)
  return spawnSync("bash", ["scripts/lint-scratch.sh", file], {
    cwd: process.cwd(),
    encoding: "utf8",
  })
}

describe("DS adoption guardrails", () => {
  it("Button toggle の手組みを PillToggle に誘導する", () => {
    const result = runLint(`
      import { Button } from "ksk-design-system"
      export function Example() {
        return <Button aria-pressed={true}>支出</Button>
      }
    `)
    expect(result.status).toBe(1)
    expect(result.stdout).toContain("Button toggle")
  })

  it("transient success Banner を Toast に誘導する", () => {
    const result = runLint(`
      import { Banner } from "ksk-design-system"
      export function Example() {
        return <Banner variant="success" title="接続が復旧しました" />
      }
    `)
    expect(result.status).toBe(1)
    expect(result.stdout).toContain("transient notice")
  })

  it("明示的な escape コメントがあれば guardrail を回避できる", () => {
    const result = runLint(`
      // ksk-ds-allow-custom-ui: domain-specific toggle control
      import { Button } from "ksk-design-system"
      export function Example() {
        return <Button aria-pressed={true}>特殊</Button>
      }
    `)
    expect(result.status).toBe(0)
  })
})
