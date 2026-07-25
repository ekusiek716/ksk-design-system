import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { spawnSync } from "node:child_process"
import { afterEach, describe, expect, it } from "vitest"

const directories: string[] = []

function createConsumer(files: Record<string, string>) {
  const root = mkdtempSync(join(tmpdir(), "ksk-ds-duplicates-"))
  directories.push(root)
  for (const [path, source] of Object.entries(files)) {
    const fullPath = join(root, path)
    mkdirSync(resolve(fullPath, ".."), { recursive: true })
    writeFileSync(fullPath, source)
  }
  return root
}

function run(cwd: string, ...args: string[]) {
  return spawnSync(
    process.execPath,
    [resolve("bin/init.js"), "check-duplicates", ...args],
    { cwd, encoding: "utf8" },
  )
}

afterEach(() => {
  for (const directory of directories.splice(0)) {
    rmSync(directory, { recursive: true, force: true })
  }
})

describe("ksk-ds check-duplicates", () => {
  it("既定の advice mode は重複を報告して exit 0", () => {
    const cwd = createConsumer({
      "src/button.tsx": "export function Button() { return null }\n",
      "src/domain-widget.tsx": "export const DomainWidget = () => null\n",
    })

    const result = run(cwd)

    expect(result.status).toBe(0)
    expect(result.stdout).toContain("src/button.tsx:1 Button")
    expect(result.stdout).toContain("DS: ui / src/components/ui/button.tsx")
    expect(result.stdout).toContain("advice mode")
    expect(result.stdout).not.toContain("DomainWidget")
  })

  it("--strict は重複検出時に exit 1", () => {
    const cwd = createConsumer({
      "app/list-item.ts": "export const ListItem = () => null\n",
    })

    const result = run(cwd, "app", "--strict")

    expect(result.status).toBe(1)
    expect(result.stdout).toContain("app/list-item.ts:1 ListItem")
    expect(result.stdout).toContain("DS: patterns / src/components/patterns/list-item.tsx")
    expect(result.stdout).toContain("strict mode")
  })

  it("重複がなければ --strict でも exit 0", () => {
    const cwd = createConsumer({
      "src/domain-widget.tsx": "export function DomainWidget() { return null }\n",
    })

    const result = run(cwd, "--strict")

    expect(result.status).toBe(0)
    expect(result.stdout).toContain("重複候補はありません")
  })

  it("export default function も検査する", () => {
    const cwd = createConsumer({
      "src/card.tsx": "export default function Card() { return null }\n",
    })

    const result = run(cwd, "--strict")

    expect(result.status).toBe(1)
    expect(result.stdout).toContain("src/card.tsx:1 Card")
  })
})

describe("contracts の exported:false を尊重する", () => {
  // contracts の name は「import できる名前」とは限らない。
  // `CheckboxCard` は実装ファイル名で、実 export は CheckboxCardGroup / CheckboxCardItem。
  // ここを登録してしまうと、consumer のローカル実装を「DS にある」と誤検知し、
  // 存在しない export を import しろと案内してしまう。
  it("import できない名前（exported:false）は重複として報告しない", () => {
    const consumer = createConsumer({
      "src/CheckboxCard.tsx": "export function CheckboxCard() { return null }\n",
    })
    const result = run(consumer, "./src", "--strict")
    expect(result.status).toBe(0)
    expect(result.stdout).not.toContain("CheckboxCard")
  })

  it("実際に import できる subcomponents は重複として報告する", () => {
    const consumer = createConsumer({
      "src/CheckboxCardGroup.tsx": "export function CheckboxCardGroup() { return null }\n",
    })
    const result = run(consumer, "./src", "--strict")
    expect(result.status).toBe(1)
    expect(result.stdout).toContain("CheckboxCardGroup")
  })
})
