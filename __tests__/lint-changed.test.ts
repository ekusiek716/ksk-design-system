import { describe, expect, it } from "vitest"
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { spawnSync } from "node:child_process"

/**
 * `ksk-ds lint --changed` の検査対象（issue #831）。
 *
 * 修正前は `git diff --name-only` の出力を実行ディレクトリ基準で解決していたため、
 * 次のケースで対象が 0 件になり、黙って「違反は見つかりませんでした」exit 0 になっていた。
 * - まだ git add していない新規ファイル
 * - リポジトリ直下以外のディレクトリ（モノレポのサブパッケージ等）から実行
 * - 日本語など非 ASCII 名のファイル（core.quotePath で引用符付き 8 進エスケープになる）
 * - `lint src --changed` の `src`（無視されていた）
 * - origin/main が無い clone（1 本目の diff が黙って失敗）
 *
 * 使い捨ての git リポジトリを tmpdir に作り、bin/init.js を子プロセスで実行して固定する。
 */

const INIT = join(process.cwd(), "bin/init.js")
const CLEAN = `export function Example() {\n  return null\n}\n`
const VIOLATION = `export function Example() {\n  return <button>x</button>\n}\n`

function git(cwd: string, args: string[]) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" })
  if (result.status !== 0) throw new Error(`git ${args.join(" ")} failed: ${result.stderr}`)
  return result.stdout
}

function write(root: string, rel: string, content: string) {
  const abs = join(root, rel)
  mkdirSync(join(abs, ".."), { recursive: true })
  writeFileSync(abs, content)
}

/**
 * 追跡済み: apps/web/src/a.tsx・apps/web/src/日本語.tsx・other/b.tsx（いずれも作業ツリーで違反を足す）
 * 未追跡: apps/web/src/new.tsx（違反あり）
 * withBase のとき、初回コミットを refs/remotes/origin/main として置く。
 */
function makeRepo({ withBase = true, dirty = true } = {}) {
  const root = mkdtempSync(join(tmpdir(), "ksk-ds-lint-changed-"))
  git(root, ["init", "-q", "-b", "main"])
  git(root, ["config", "user.name", "test"])
  git(root, ["config", "user.email", "test@example.com"])
  git(root, ["config", "commit.gpgsign", "false"])
  // 利用者の global 設定に左右されないよう、既定（引用符付きエスケープ）を明示する
  git(root, ["config", "core.quotePath", "true"])
  write(root, "apps/web/src/a.tsx", CLEAN)
  write(root, "apps/web/src/日本語.tsx", CLEAN)
  write(root, "other/b.tsx", CLEAN)
  git(root, ["add", "-A"])
  git(root, ["commit", "-q", "-m", "init"])
  if (withBase) git(root, ["update-ref", "refs/remotes/origin/main", "HEAD"])
  if (dirty) {
    write(root, "apps/web/src/a.tsx", VIOLATION)
    write(root, "apps/web/src/日本語.tsx", VIOLATION)
    write(root, "other/b.tsx", VIOLATION)
    write(root, "apps/web/src/new.tsx", VIOLATION)
  }
  return root
}

function lint(cwd: string, args: string[]) {
  return spawnSync("node", [INIT, "lint", ...args], { cwd, encoding: "utf8" })
}

function filesOf(stdout: string) {
  const results = JSON.parse(stdout).results as { file: string; ruleId: string }[]
  return [...new Set(results.filter((r) => r.ruleId === "P001").map((r) => r.file))].sort()
}

describe("ksk-ds lint --changed（issue #831）", () => {
  it("リポジトリ直下: 未追跡の新規ファイル・日本語名を含む変更ファイルをすべて検査する", () => {
    const root = makeRepo()
    const result = lint(root, ["--changed", "--format", "json"])
    expect(filesOf(result.stdout)).toEqual(
      ["apps/web/src/a.tsx", "apps/web/src/new.tsx", "apps/web/src/日本語.tsx", "other/b.tsx"].sort(),
    )
    expect(result.status).toBe(1)
  })

  it("サブディレクトリから実行すると、その配下の変更ファイルを検査する", () => {
    const root = makeRepo()
    const result = lint(join(root, "apps/web"), ["--changed", "--format", "json"])
    expect(filesOf(result.stdout)).toEqual(["src/a.tsx", "src/new.tsx", "src/日本語.tsx"].sort())
    expect(result.status).toBe(1)
  })

  it("target を指定すると、その配下の変更ファイルだけに絞る", () => {
    const root = makeRepo()
    const result = lint(root, ["apps/web/src", "--changed", "--format", "json"])
    expect(filesOf(result.stdout)).toEqual(
      ["apps/web/src/a.tsx", "apps/web/src/new.tsx", "apps/web/src/日本語.tsx"].sort(),
    )
    const other = lint(root, ["other", "--changed", "--format", "json"])
    expect(filesOf(other.stdout)).toEqual(["other/b.tsx"])
  })

  it("コミット済みの変更も origin/main との差分として検査する", () => {
    const root = makeRepo({ dirty: false })
    write(root, "apps/web/src/a.tsx", VIOLATION)
    git(root, ["commit", "-q", "-am", "change"])
    const result = lint(root, ["--changed", "--format", "json"])
    expect(filesOf(result.stdout)).toEqual(["apps/web/src/a.tsx"])
    expect(result.stderr).not.toContain("origin/main")
  })

  it("origin/main が無いときは stderr に警告し、作業ツリーの差分と未追跡は検査する", () => {
    const root = makeRepo({ withBase: false })
    const result = lint(root, ["--changed", "--format", "json"])
    expect(result.stderr).toContain("[ksk-ds lint] ベース ref（origin/main）が取れないため")
    expect(filesOf(result.stdout)).toEqual(
      ["apps/web/src/a.tsx", "apps/web/src/new.tsx", "apps/web/src/日本語.tsx", "other/b.tsx"].sort(),
    )
  })

  it("対象 0 件のときは「違反なし」ではなく 0 件であることを明示する（exit 0）", () => {
    const root = makeRepo({ dirty: false })
    const result = lint(root, ["--changed"])
    expect(result.stdout).toContain("検査対象の変更ファイルが 0 件")
    expect(result.stdout).not.toContain("違反は見つかりませんでした")
    expect(result.status).toBe(0)
  })

  it("Git リポジトリの外では警告して 0 件として扱う", () => {
    const dir = mkdtempSync(join(tmpdir(), "ksk-ds-lint-changed-nogit-"))
    write(dir, "a.tsx", VIOLATION)
    const result = lint(dir, ["--changed"])
    expect(result.stderr).toContain("[ksk-ds lint] Git リポジトリではないため")
    expect(result.stdout).toContain("検査対象の変更ファイルが 0 件")
    expect(result.status).toBe(0)
  })
})
