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

  // #260/#266 フォローアップ: ui/form の FormField は patterns/form-field の FormField と
  // 同名衝突を避けるため index.ts では RhfFormField として export される。
  // contracts 上は aliases: ["RhfFormField"] として ui/Form エントリに登録されており、
  // consumer が自前で RhfFormField を再実装したら重複として検出できる必要がある。
  it("aliases に登録された別名 export（RhfFormField）も重複として報告する", () => {
    const consumer = createConsumer({
      "src/RhfFormField.tsx": "export function RhfFormField() { return null }\n",
    })
    const result = run(consumer, "./src", "--strict")
    expect(result.status).toBe(1)
    expect(result.stdout).toContain("RhfFormField")
    expect(result.stdout).toContain("DS: ui / src/components/ui/form.tsx")
  })
})

// issue #392 第1弾: DS を委譲するだけの薄いラッパー（段階移行の型）まで
// 「DS と同名」というだけで重複として誤検知していた問題の回帰テスト。
// 実測（aikoibito/apps/mobile）: EmptyState / Card はこのパターンで誤検知されていた。
describe("DS ラッパー除外", () => {
  it("DS を import しないローカル同名宣言は引き続き検出する", () => {
    const consumer = createConsumer({
      "src/Card.tsx": "export function Card() { return null }\n",
    })
    const result = run(consumer, "./src", "--strict")
    expect(result.status).toBe(1)
    expect(result.stdout).toContain("src/Card.tsx:1 Card")
    expect(result.stdout).not.toContain("ラッパー")
  })

  it("`as DS〜` エイリアス import + ローカル同名 export はラッパーとして除外し info 行で報告する（strict でも exit 0）", () => {
    const consumer = createConsumer({
      "src/EmptyState.tsx": [
        "import { EmptyState as DSEmptyState } from 'ksk-design-system/native/ui'",
        "",
        "export function EmptyState() {",
        "  return DSEmptyState",
        "}",
        "",
      ].join("\n"),
    })
    const result = run(consumer, "./src", "--strict")
    expect(result.status).toBe(0)
    expect(result.stdout).not.toContain("src/EmptyState.tsx:")
    expect(result.stdout).toContain("重複候補はありません")
    expect(result.stdout).toContain("ℹ ラッパー（DS 委譲済み）として除外: 1 件")
    expect(result.stdout).toContain("ℹ ラッパー（DS 委譲済み）として除外: EmptyState (src/EmptyState.tsx)")
  })

  it("`as Ksk〜` エイリアス import も同様にラッパーとして除外する", () => {
    const consumer = createConsumer({
      "src/Card.tsx": [
        "import { Card as KskCard } from 'ksk-design-system/native/ui'",
        "",
        "export function Card({ children }: { children: unknown }) {",
        "  return KskCard",
        "}",
        "",
      ].join("\n"),
    })
    const result = run(consumer, "./src", "--strict")
    expect(result.status).toBe(0)
    expect(result.stdout).toContain("ℹ ラッパー（DS 委譲済み）として除外: Card (src/Card.tsx)")
  })

  it("re-export 形式（export { X as Y } from ksk-design-system）もラッパーとして除外する", () => {
    // FormField は ui/form モジュールの export 名。RhfFormField は contracts 上の
    // 登録済み alias（#260/#266）。DS 自身の実装を right-through で再輸出しているだけなので
    // ラッパー扱いにする。
    const consumer = createConsumer({
      "src/rhf-form-field.ts": "export { FormField as RhfFormField } from 'ksk-design-system/ui/form'\n",
    })
    const result = run(consumer, "./src", "--strict")
    expect(result.status).toBe(0)
    expect(result.stdout).toContain("重複候補はありません")
    expect(result.stdout).toContain("ℹ ラッパー（DS 委譲済み）として除外: 1 件")
    expect(result.stdout).toContain("RhfFormField (src/rhf-form-field.ts)")
  })

  it("DS を import していても別名のローカル宣言はこの機能の影響を受けない", () => {
    const consumer = createConsumer({
      "src/my-widget.tsx": [
        "import { EmptyState as DSEmptyState } from 'ksk-design-system/native/ui'",
        "",
        "export function MyCustomWidget() {",
        "  return DSEmptyState",
        "}",
        "",
      ].join("\n"),
    })
    const result = run(consumer, "./src", "--strict")
    expect(result.status).toBe(0)
    expect(result.stdout).toContain("重複候補はありません")
    expect(result.stdout).not.toContain("ラッパー")
  })

  it("JSDoc コメント内の使用例 import はラッパー判定に使わない（コメントは除外して走査する）", () => {
    const consumer = createConsumer({
      "src/EmptyState.tsx": [
        "/**",
        " * 使用例:",
        " * import { EmptyState } from \"ksk-design-system\"",
        " */",
        "export function EmptyState() { return null }",
        "",
      ].join("\n"),
    })
    const result = run(consumer, "./src", "--strict")
    expect(result.status).toBe(1)
    expect(result.stdout).toContain("src/EmptyState.tsx:5 EmptyState")
    expect(result.stdout).not.toContain("ラッパー")
  })
})
