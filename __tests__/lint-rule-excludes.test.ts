import { describe, expect, it } from "vitest"
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { spawnSync } from "node:child_process"

// issue #404 の回帰テスト。
// excludes が「パス」と「行内容」を同じ配列に混ぜて OR で判定していたため、
//  (1) 行内にパス文字列が出るだけでルールが黙る
//  (2) consumer が src/components/ui/ に部品を置くと中核ルールが丸ごと無効になる
// という 2 つの穴があった。excludePaths / excludeDsPaths / excludeLines への分離を検証する。

function runKskLint(relPath: string, source: string) {
  const dir = mkdtempSync(join(tmpdir(), "ksk-ds-rule-excludes-"))
  const file = join(dir, relPath)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, source)
  const result = spawnSync(process.execPath, ["bin/init.js", "lint", file, "--format", "json"], {
    cwd: process.cwd(),
    encoding: "utf8",
  })
  return (JSON.parse(result.stdout).results as { ruleId: string; line: number }[]).map(
    (finding) => finding.ruleId,
  )
}

const RAW_TAGS = `export function Thing() {
  return (
    <div>
      <button onClick={() => {}}>押す</button>
      <input type="text" />
      <img src="/a.png" />
    </div>
  )
}
`

describe("issue #404: excludes のパス / 行内容の分離", () => {
  it("consumer の src/app/ 配下では従来どおり生タグを検出する", () => {
    const ids = runKskLint("src/app/page.tsx", RAW_TAGS)
    expect(ids).toEqual(expect.arrayContaining(["P001", "P002", "P025"]))
  })

  it("consumer の src/components/ui/ でも中核ルールが無効化されない（excludeDsPaths は DS パッケージ内限定）", () => {
    const ids = runKskLint("src/components/ui/my-thing.tsx", RAW_TAGS)
    expect(ids).toEqual(expect.arrayContaining(["P001", "P002", "P025"]))
  })

  it("行内にパス文字列（components/ui/）が出てもルールは黙らない", () => {
    const ids = runKskLint(
      "src/app/docs.tsx",
      `export function Docs() {
        return <button title="components/ui/ に置く">押す</button>
      }
      `,
    )
    expect(ids).toContain("P001")
  })

  it("行内容の除外（data-slot）は従来どおり効く", () => {
    const ids = runKskLint(
      "src/app/slot.tsx",
      `export function Slot() {
        return <button data-slot="trigger">押す</button>
      }
      `,
    )
    expect(ids).not.toContain("P001")
  })

  it("パス除外（.stories.）はリポジトリを問わず効く", () => {
    const ids = runKskLint("src/app/thing.stories.tsx", RAW_TAGS)
    expect(ids).not.toContain("P001")
    expect(ids).not.toContain("P002")
  })

  it("DS パッケージ自身の src/components/ui/ では excludeDsPaths が効く", () => {
    // DS リポジトリ内の実ファイル（生の <button> を持つ ui コンポーネント）を lint しても
    // P001 が出ないこと＝ excludeDsPaths が DS 側では従来どおり機能していること。
    const result = spawnSync(
      process.execPath,
      ["bin/init.js", "lint", "src/components/ui", "--format", "json"],
      { cwd: process.cwd(), encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
    )
    const ids = (JSON.parse(result.stdout).results as { ruleId: string }[]).map((f) => f.ruleId)
    expect(ids).not.toContain("P001")
    expect(ids).not.toContain("P002")
  })
})
