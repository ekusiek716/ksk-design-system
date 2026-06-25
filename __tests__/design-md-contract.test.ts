import { describe, expect, it } from "vitest"
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { spawnSync } from "node:child_process"

function runDesignCheck(extraArgs: string[] = []) {
  return spawnSync(process.execPath, ["scripts/check-design-md.mjs", ...extraArgs], {
    cwd: process.cwd(),
    encoding: "utf8",
  })
}

function tempDesign(source: string) {
  const dir = mkdtempSync(join(tmpdir(), "ksk-ds-design-md-"))
  const file = join(dir, "DESIGN.md")
  writeFileSync(file, source)
  return file
}

describe("DESIGN.md contract", () => {
  it("passes for the checked-in DESIGN.md", () => {
    const result = runDesignCheck()
    expect(result.status).toBe(0)
    expect(result.stdout).toContain("DESIGN.md は正本と同期")
  })

  it("reports token drift against tokens.json / CSS", () => {
    const source = readFileSync("DESIGN.md", "utf8").replace('primary: "#2563EB"', 'primary: "#000000"')
    const result = runDesignCheck(["--design", tempDesign(source), "--format", "json"])

    expect(result.status).toBe(1)
    const payload = JSON.parse(result.stdout)
    expect(payload.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          severity: "error",
          path: "frontMatter.colors.primary",
        }),
      ])
    )
  })

  it("reports unresolved front matter token references", () => {
    const source = readFileSync("DESIGN.md", "utf8").replace(
      'background: "{colors.primary}"',
      'background: "{colors.missing}"'
    )
    const result = runDesignCheck(["--design", tempDesign(source)])

    expect(result.status).toBe(1)
    expect(result.stdout).toContain("colors.missing")
  })
})
