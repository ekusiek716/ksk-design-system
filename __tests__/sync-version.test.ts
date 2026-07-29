import { describe, expect, it, afterEach } from "vitest"
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, copyFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"

// issue #259: version bump のたびに手動更新していた
// contracts/components.json の meta.version / contracts/token-hex-cache.json を
// scripts/sync-version.mjs が package.json の version に自動追従させることを検証する。
//
// sync-version.mjs は自分自身の場所（import.meta.url）を ROOT として解決するため、
// フィクスチャは「本物の scripts/sync-version.mjs・generate-token-hex-cache.mjs・
// lib/resolve-token-color.mjs をコピーしたミニリポジトリ」として構成する
// （ロジックのコピーではなく実ファイルをコピーするので、実装が変わればテストも追従する）。

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const directories: string[] = []

function makeFixture(componentsVersion: string, packageVersion: string) {
  const root = mkdtempSync(join(tmpdir(), "ksk-ds-sync-version-"))
  directories.push(root)

  mkdirSync(join(root, "contracts"), { recursive: true })
  mkdirSync(join(root, "src", "styles"), { recursive: true })
  mkdirSync(join(root, "scripts", "lib"), { recursive: true })

  writeFileSync(
    join(root, "package.json"),
    `${JSON.stringify({ name: "fixture", version: packageVersion }, null, 2)}\n`,
  )

  writeFileSync(
    join(root, "contracts", "components.json"),
    `${JSON.stringify(
      { meta: { version: componentsVersion, counts: { total: 1 } }, components: [] },
      null,
      2,
    )}\n`,
  )

  writeFileSync(
    join(root, "src", "styles", "primitive.css"),
    [
      "@theme {",
      "  --Primitive-Brand-500: #3B82F6;",
      "  --Primitive-Brand-900: #1E3A8A;",
      "  --Primitive-Gray-900: #111827;",
      "}",
      "",
    ].join("\n"),
  )

  writeFileSync(
    join(root, "tokens.json"),
    `${JSON.stringify(
      {
        colors: {
          primitive: {
            gray: { 900: "#111827" },
            brand: { 500: "#3B82F6", 900: "#1E3A8A" },
          },
          semantic: {
            Text: { "High-Emphasis": "var(--Primitive-Gray-900)" },
            Brand: { Primary: "var(--Primitive-Brand-500)" },
          },
          semanticDark: {
            Text: { "High-Emphasis": "var(--Primitive-Gray-900)" },
          },
        },
      },
      null,
      2,
    )}\n`,
  )

  // 実ファイルをコピー（ロジックの二重管理を避ける）
  copyFileSync(join(REPO_ROOT, "scripts", "sync-version.mjs"), join(root, "scripts", "sync-version.mjs"))
  copyFileSync(
    join(REPO_ROOT, "scripts", "generate-token-hex-cache.mjs"),
    join(root, "scripts", "generate-token-hex-cache.mjs"),
  )
  copyFileSync(
    join(REPO_ROOT, "scripts", "lib", "resolve-token-color.mjs"),
    join(root, "scripts", "lib", "resolve-token-color.mjs"),
  )

  // sync-version.mjs は最後に `git add` する。フィクスチャを git リポジトリ化しておく。
  spawnSync("git", ["init", "-q"], { cwd: root })
  spawnSync("git", ["config", "user.email", "test@example.com"], { cwd: root })
  spawnSync("git", ["config", "user.name", "test"], { cwd: root })

  return root
}

function run(cwd: string) {
  return spawnSync(process.execPath, [join(cwd, "scripts", "sync-version.mjs")], {
    cwd,
    encoding: "utf8",
  })
}

afterEach(() => {
  for (const directory of directories.splice(0)) {
    rmSync(directory, { recursive: true, force: true })
  }
})

describe("scripts/sync-version.mjs", () => {
  it("package.json の version と異なるとき、meta.version を追従させる", () => {
    const root = makeFixture("1.0.0", "1.1.0")

    const result = run(root)

    expect(result.status).toBe(0)
    const components = JSON.parse(readFileSync(join(root, "contracts", "components.json"), "utf8"))
    expect(components.meta.version).toBe("1.1.0")
  })

  it("token-hex-cache.json を生成し meta.version を同期する", () => {
    const root = makeFixture("1.0.0", "1.1.0")

    const result = run(root)

    expect(result.status).toBe(0)
    const cache = JSON.parse(readFileSync(join(root, "contracts", "token-hex-cache.json"), "utf8"))
    expect(cache.meta.version).toBe("1.1.0")
    expect(cache.semantic["Text.High-Emphasis"]).toBe("#111827")
  })

  it("変更したファイルを git add する", () => {
    const root = makeFixture("1.0.0", "1.1.0")

    run(root)

    const status = spawnSync("git", ["diff", "--cached", "--name-only"], {
      cwd: root,
      encoding: "utf8",
    }).stdout
    expect(status).toContain("contracts/components.json")
    expect(status).toContain("contracts/token-hex-cache.json")
  })

  it("既に同期済みなら components.json を書き換えない（再実行の冪等性）", () => {
    const root = makeFixture("1.1.0", "1.1.0")

    const before = readFileSync(join(root, "contracts", "components.json"), "utf8")
    const result = run(root)
    const after = readFileSync(join(root, "contracts", "components.json"), "utf8")

    expect(result.status).toBe(0)
    expect(after).toBe(before)
  })
})
