import { describe, expect, it } from "vitest"
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import {
  checkMigration,
  collectFiles,
  runCheckMigrationCli,
} from "../scripts/codemod/check-migration.mjs"
import { DEPRECATED } from "../eslint/deprecated.js"

function makeProject(files: Record<string, string>) {
  const dir = mkdtempSync(join(tmpdir(), "ksk-ds-check-migration-"))
  for (const [relPath, content] of Object.entries(files)) {
    const full = join(dir, relPath)
    mkdirSync(join(full, ".."), { recursive: true })
    writeFileSync(full, content)
  }
  return dir
}

describe("checkMigration", () => {
  it("reports zero findings against the current (empty) DEPRECATED list", () => {
    const dir = makeProject({
      "src/App.tsx": `import { Button } from "ksk-design-system"\nexport const App = () => <Button />\n`,
    })
    const result = checkMigration(dir, DEPRECATED)
    expect(result.total).toBe(0)
    expect(result.byIdentifier).toEqual([])
  })

  it("exits 0 via the CLI for any directory while DEPRECATED is empty", () => {
    const dir = makeProject({
      "src/App.tsx": `import { Button } from "ksk-design-system"\n`,
    })
    const status = runCheckMigrationCli([dir])
    expect(status).toBe(0)
  })

  it("skips files that do not reference ksk-design-system", () => {
    const dir = makeProject({
      "src/Unrelated.tsx": `export const Legacy = () => <div>Legacy</div>\n`,
    })
    const fakeDeprecated = [{ identifier: "Legacy", replacement: "Modern", removeIn: "2.0.0" }]
    const result = checkMigration(dir, fakeDeprecated)
    expect(result.total).toBe(0)
    expect(result.filesScanned).toBe(0)
  })

  it("detects a deprecated identifier in DS-referencing files and counts occurrences", () => {
    const dir = makeProject({
      "src/A.tsx": [
        `import { Banner, Button } from "ksk-design-system"`,
        `export const A = () => (<><Banner /><Banner /></>)`,
      ].join("\n"),
      "src/B.tsx": `import { Alert } from "ksk-design-system"\nexport const B = () => <Alert />\n`,
    })
    const fakeDeprecated = [
      { identifier: "Banner", kind: "import", replacement: "Alert", removeIn: "2.0.0" },
    ]
    const result = checkMigration(dir, fakeDeprecated)
    // import { Banner, ... } + 2x <Banner /> in A.tsx = 3 occurrences
    expect(result.total).toBe(3)
    expect(result.filesScanned).toBe(2)
    expect(result.byIdentifier).toEqual([{ identifier: "Banner", count: 3 }])
  })

  it("returns a non-zero CLI exit code and a byIdentifier breakdown when matches are found", () => {
    const dir = makeProject({
      "src/A.tsx": `import { Banner } from "ksk-design-system"\nexport const A = () => <Banner />\n`,
    })
    const fakeDeprecated = [
      { identifier: "Banner", kind: "import", replacement: "Alert", removeIn: "2.0.0" },
    ]
    const status = runCheckMigrationCli([dir], { deprecated: fakeDeprecated })
    expect(status).toBe(1)
  })

  it("excludes node_modules, dist, and hidden directories when collecting files", () => {
    const dir = makeProject({
      "src/App.tsx": `import { Button } from "ksk-design-system"\n`,
      "node_modules/pkg/index.ts": `import { Banner } from "ksk-design-system"\n`,
      "dist/bundle.js": `import { Banner } from "ksk-design-system"\n`,
      ".cache/tmp.ts": `import { Banner } from "ksk-design-system"\n`,
    })
    const files = collectFiles(dir)
    expect(files.some((f: string) => f.includes("node_modules"))).toBe(false)
    expect(files.some((f: string) => f.includes("/dist/"))).toBe(false)
    expect(files.some((f: string) => f.includes(".cache"))).toBe(false)
    expect(files.some((f: string) => f.endsWith("App.tsx"))).toBe(true)
  })

  it("ignores non-JS/TS extensions", () => {
    const dir = makeProject({
      "src/App.tsx": `import { Button } from "ksk-design-system"\n`,
      "src/notes.md": `ksk-design-system Banner reference in prose\n`,
    })
    const files = collectFiles(dir)
    expect(files.some((f: string) => f.endsWith(".md"))).toBe(false)
  })
})
