import { describe, expect, it } from "vitest"
import { existsSync, readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { spawnSync } from "node:child_process"

// ドキュメントが案内する CLI サブコマンドが bin/init.js に実装されていることを固定する。
// 背景: MIGRATION.md / RELEASE.md / scripts/codemod/README.md が
// `npx ksk-design-system codemod …` を 3 箇所で案内していたのに dispatch が無く、
// 破壊的変更の直後、consumer が MIGRATION.md どおり進めると Step 2 で詰まる状態だった。

const ROOT = process.cwd()

/** CLI の案内が載りうるドキュメント */
const DOC_FILES = [
  "MIGRATION.md",
  "RELEASE.md",
  "PUBLISHING.md",
  "UPDATING.md",
  "README.md",
  "CLAUDE.md",
  "AGENTS.md",
  "scripts/codemod/README.md",
  "templates/CLAUDE.md",
  "templates/AGENTS.md",
].filter((f) => existsSync(join(ROOT, f)))

/** `npx ksk-design-system <sub>` / `npx ksk-ds <sub>` の <sub> を拾う */
const INVOCATION_RE = /npx\s+(?:ksk-design-system|ksk-ds)\s+([A-Za-z][A-Za-z0-9:-]*)/g

function docInvocations() {
  const found = new Map<string, string[]>()
  for (const file of DOC_FILES) {
    const text = readFileSync(join(ROOT, file), "utf8")
    for (const m of text.matchAll(INVOCATION_RE)) {
      const sub = m[1]
      found.set(sub, [...(found.get(sub) ?? []), file])
    }
  }
  return found
}

/** bin/init.js が dispatch しているサブコマンド */
function implementedSubcommands() {
  const source = readFileSync(join(ROOT, "bin/init.js"), "utf8")
  const subs = new Set<string>()
  // `cmd === "x"` の分岐に加え、既定コマンドの許可リスト `cmd !== "init" && cmd !== "postinstall"` も拾う
  for (const m of source.matchAll(/cmd\s*[!=]==\s*"([^"]+)"/g)) subs.add(m[1])
  return subs
}

describe("ドキュメントが案内する CLI サブコマンド", () => {
  it("は bin/init.js に dispatch がある", () => {
    const implemented = implementedSubcommands()
    const missing: string[] = []
    for (const [sub, files] of docInvocations()) {
      if (!implemented.has(sub)) missing.push(`${sub}（${files.join(", ")}）`)
    }
    expect(missing).toEqual([])
  })

  it("には codemod が含まれる（回帰の起点になった不足）", () => {
    expect(docInvocations().has("codemod")).toBe(true)
    expect(implementedSubcommands().has("codemod")).toBe(true)
  })
})

describe("ksk-ds codemod", () => {
  const run = (args: string[]) =>
    spawnSync("node", [join(ROOT, "bin/init.js"), "codemod", ...args], {
      cwd: ROOT,
      encoding: "utf8",
    })

  it("名前なしなら使い方と一覧を出して exit 1", () => {
    const result = run([])
    expect(result.status).toBe(1)
    expect(result.stderr).toContain("codemod <name>")
  })

  it("存在しない codemod は exit 1（黙って成功しない）", () => {
    const result = run(["no-such-codemod", "./src", "--dry"])
    expect(result.status).toBe(1)
    expect(result.stderr).toContain("codemod が見つかりません")
  })

  it("雛形 / 読み取り専用スキャナは codemod として実行できない", () => {
    for (const name of ["template", "check-migration"]) {
      const result = run([name, "./src", "--dry"])
      expect(result.status).toBe(1)
      expect(result.stderr).toContain("codemod 名が不正です")
    }
  })

  it("パッケージ外へ抜ける名前を拒否する", () => {
    const result = run(["../../etc/passwd"])
    expect(result.status).toBe(1)
    expect(result.stderr).toContain("codemod 名が不正です")
  })

  it("ドキュメントが名指しする codemod は実体が存在する", () => {
    // <name> / vX-to-vY のようなプレースホルダは対象外
    const placeholders = /^(<name>|vX-to-vY|name)$/
    const named = new Set<string>()
    for (const file of DOC_FILES) {
      const text = readFileSync(join(ROOT, file), "utf8")
      for (const m of text.matchAll(
        /npx\s+(?:ksk-design-system|ksk-ds)\s+codemod\s+([A-Za-z0-9._<>-]+)/g,
      )) {
        if (!placeholders.test(m[1])) named.add(m[1])
      }
    }
    const available = readdirSync(join(ROOT, "scripts/codemod"))
      .filter((f) => f.endsWith(".mjs"))
      .map((f) => f.replace(/\.mjs$/, ""))
    expect([...named].filter((n) => !available.includes(n))).toEqual([])
  })
})
