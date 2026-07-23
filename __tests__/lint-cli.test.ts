import { describe, expect, it } from "vitest"
import { mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { spawnSync } from "node:child_process"

function runPublicLint(source: string) {
  const dir = mkdtempSync(join(tmpdir(), "ksk-ds-public-lint-"))
  const file = join(dir, "Example.tsx")
  writeFileSync(file, source)
  return spawnSync("node", [join(process.cwd(), "bin/init.js"), "lint", file], {
    cwd: dir,
    encoding: "utf8",
  })
}

describe("ksk-ds lint", () => {
  it("default Card の direct child spacing を P046 として警告する", () => {
    const result = runPublicLint(`
      import { Card } from "ksk-design-system"
      export function Example() {
        return <Card><div className="mt-4">本文</div></Card>
      }
    `)
    expect(result.status).toBe(0)
    expect(result.stdout).toContain("warn P046")
  })

  it("CardContent 内部の spacing を direct child として誤検知しない", () => {
    const result = runPublicLint(`
      import { Card, CardContent } from "ksk-design-system"
      export function Example() {
        return <Card><CardContent><div className="mt-4">本文</div></CardContent></Card>
      }
    `)
    expect(result.status).toBe(0)
    expect(result.stdout).not.toContain("P046")
  })

  it("media Card の spacing は警告しない", () => {
    const result = runPublicLint(`
      import { Card } from "ksk-design-system"
      export function Example() {
        return <Card variant="media"><div className="my-4">本文</div></Card>
      }
    `)
    expect(result.status).toBe(0)
    expect(result.stdout).not.toContain("P046")
  })
})
