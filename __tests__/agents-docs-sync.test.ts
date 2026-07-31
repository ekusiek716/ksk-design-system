import { execFileSync } from "node:child_process"
import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { afterEach, describe, expect, it } from "vitest"

const ROOT = process.cwd()
const tempRoots: string[] = []

function createFixture(templateAgentH1: string) {
  const fixtureRoot = mkdtempSync(join(tmpdir(), "ksk-docs-sync-"))
  tempRoots.push(fixtureRoot)

  const files = {
    "CLAUDE.md": "# Root\n\n## Shared\n\n同じ本文\n",
    "AGENTS.md": "# Root\n\n## Shared\n\n同じ本文\n",
    "templates/CLAUDE.md": "# Template\n\n共有本文\n",
    "templates/AGENTS.md": `# ${templateAgentH1}\n\n共有本文\n`,
  }
  for (const [relativePath, content] of Object.entries(files)) {
    const target = join(fixtureRoot, relativePath)
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, content)
  }

  const scriptTarget = join(fixtureRoot, "scripts/check-agents-docs-sync.mjs")
  mkdirSync(dirname(scriptTarget), { recursive: true })
  cpSync(join(ROOT, "scripts/check-agents-docs-sync.mjs"), scriptTarget)
  return { fixtureRoot, scriptTarget }
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true })
  }
})

describe("CLAUDE.md / AGENTS.md 同期検査", () => {
  it("templates の H1 が一致していれば成功する", () => {
    const { fixtureRoot, scriptTarget } = createFixture("Template")
    expect(() =>
      execFileSync(process.execPath, [scriptTarget], {
        cwd: fixtureRoot,
        stdio: "pipe",
      }),
    ).not.toThrow()
  })

  it("templates の H1 だけが異なる場合も drift として失敗する（issue #279）", () => {
    const { fixtureRoot, scriptTarget } = createFixture("別タイトル")
    let output = ""

    try {
      execFileSync(process.execPath, [scriptTarget], {
        cwd: fixtureRoot,
        stdio: "pipe",
      })
    } catch (error) {
      const failed = error as { stdout?: Buffer; stderr?: Buffer }
      output = `${failed.stdout?.toString() ?? ""}${failed.stderr?.toString() ?? ""}`
    }

    expect(output).toContain("templates/CLAUDE.md と templates/AGENTS.md の内容が一致しません")
    expect(output).toContain("# Template")
    expect(output).toContain("# 別タイトル")
  })

  it("テスト対象スクリプトは作業ツリーの最新版を使う", () => {
    expect(readFileSync(join(ROOT, "scripts/check-agents-docs-sync.mjs"), "utf8")).toContain(
      "const normalizeWhole = (t) => stripIgnoredLines(t).trim()",
    )
  })
})
