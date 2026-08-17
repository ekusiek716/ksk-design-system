/**
 * bin/check-migration.js（`npx ksk-ds check-migration ./src`）の検出仕様を固定する。
 *
 * 要点:
 *   - contracts/deprecations.json が正本
 *   - TypeScript の AST で識別子ベースに検出する（コメント・文字列は誤検出しない）
 *   - import だけでなく re-export も残件として数える
 *     （移行期に consumer が置く互換バレル越しの使用を取りこぼさないため）
 *   - 残件 0 で exit 0、1 件以上で exit 1
 */
import { afterAll, describe, expect, it } from "vitest"
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import {
  checkMigration,
  collectSourceFiles,
  loadDeprecations,
  runCheckMigrationCli,
} from "../bin/check-migration.js"

const ROOT = process.cwd()

const PROP_ENTRY = {
  id: "ListItem.interactive",
  kind: "prop",
  component: "ListItem",
  prop: "interactive",
  since: "1.46.0",
  replacement: "href / onClick",
  removeIn: "2.0.0",
  sources: ["src/components/patterns/list-item.tsx"],
}

const EXPORT_ENTRY = {
  id: "Banner",
  kind: "export",
  identifier: "Banner",
  since: "1.0.0",
  replacement: "Alert",
  removeIn: "2.0.0",
  sources: ["src/components/ui/banner.tsx"],
}

const dirs: string[] = []

function makeProject(files: Record<string, string>) {
  const dir = mkdtempSync(join(tmpdir(), "ksk-ds-check-migration-"))
  dirs.push(dir)
  for (const [rel, content] of Object.entries(files)) {
    const full = join(dir, rel)
    mkdirSync(join(full, ".."), { recursive: true })
    writeFileSync(full, content)
  }
  return dir
}

afterAll(() => {
  for (const dir of dirs) rmSync(dir, { recursive: true, force: true })
})

describe("contracts/deprecations.json", () => {
  it("は読み込めて、必須フィールドが揃っている", () => {
    const entries = loadDeprecations(ROOT)
    expect(entries.length).toBeGreaterThan(0)
    for (const entry of entries) {
      expect(entry.id).toBeTypeOf("string")
      expect(["prop", "export"]).toContain(entry.kind)
      expect(entry.replacement).toBeTypeOf("string")
      expect(entry.removeIn).toBeTypeOf("string")
      expect(Array.isArray(entry.sources)).toBe(true)
    }
  })
})

describe("kind=prop の検出", () => {
  it("DS から import したコンポーネントの JSX 属性を数える", () => {
    const dir = makeProject({
      "src/A.tsx": [
        `import { ListItem } from "ksk-design-system"`,
        `export const A = () => (`,
        `  <>`,
        `    <ListItem interactive title="a" />`,
        `    <ListItem title="b" />`,
        `  </>`,
        `)`,
      ].join("\n"),
    })
    const result = checkMigration(dir, [PROP_ENTRY], { cwd: dir })
    expect(result.total).toBe(1)
    expect(result.byIdentifier).toEqual([
      {
        id: "ListItem.interactive",
        count: 1,
        replacement: "href / onClick",
        removeIn: "2.0.0",
      },
    ])
    expect(result.findings[0].usage).toBe("prop")
  })

  it("import の別名（as）越しでも数える", () => {
    const dir = makeProject({
      "src/A.tsx": [
        `import { ListItem as Row } from "ksk-design-system"`,
        `export const A = () => <Row interactive />`,
      ].join("\n"),
    })
    expect(checkMigration(dir, [PROP_ENTRY], { cwd: dir }).total).toBe(1)
  })

  it("namespace import（<DS.ListItem interactive />）でも数える", () => {
    const dir = makeProject({
      "src/A.tsx": [
        `import * as DS from "ksk-design-system"`,
        `export const A = () => <DS.ListItem interactive />`,
      ].join("\n"),
    })
    expect(checkMigration(dir, [PROP_ENTRY], { cwd: dir }).total).toBe(1)
  })

  it("consumer 自前の同名コンポーネントは数えない（DS 由来の束縛だけを見る）", () => {
    const dir = makeProject({
      "src/local/list-item.tsx": `export const ListItem = (p: { interactive?: boolean }) => null`,
      "src/A.tsx": [
        `import { ListItem } from "./local/list-item"`,
        `export const A = () => <ListItem interactive />`,
      ].join("\n"),
    })
    expect(checkMigration(dir, [PROP_ENTRY], { cwd: dir }).total).toBe(0)
  })

  it("相対 import の互換バレルが DS を re-export していれば数える", () => {
    const dir = makeProject({
      "src/ui/index.ts": `export { ListItem } from "ksk-design-system"`,
      "src/A.tsx": [
        `import { ListItem } from "./ui"`,
        `export const A = () => <ListItem interactive />`,
      ].join("\n"),
    })
    expect(checkMigration(dir, [PROP_ENTRY], { cwd: dir }).total).toBe(1)
  })

  it("バレルが export * from DS でも数える", () => {
    const dir = makeProject({
      "src/ui/index.ts": `export * from "ksk-design-system"`,
      "src/A.tsx": [
        `import { ListItem } from "./ui"`,
        `export const A = () => <ListItem interactive />`,
      ].join("\n"),
    })
    expect(checkMigration(dir, [PROP_ENTRY], { cwd: dir }).total).toBe(1)
  })

  it("コメント・文字列リテラル中の同名は誤検出しない", () => {
    const dir = makeProject({
      "src/A.tsx": [
        `import { ListItem } from "ksk-design-system"`,
        `// <ListItem interactive /> は非推奨`,
        `/* interactive を使わないこと */`,
        `const doc = "<ListItem interactive />"`,
        `export const A = () => <ListItem title={doc} />`,
      ].join("\n"),
    })
    expect(checkMigration(dir, [PROP_ENTRY], { cwd: dir }).total).toBe(0)
  })

  it("同名の prop でも別コンポーネントなら数えない", () => {
    const dir = makeProject({
      "src/A.tsx": [
        `import { Card } from "ksk-design-system"`,
        `export const A = () => <Card interactive />`,
      ].join("\n"),
    })
    expect(checkMigration(dir, [PROP_ENTRY], { cwd: dir }).total).toBe(0)
  })
})

describe("kind=export の検出", () => {
  it("DS からの import を数える", () => {
    const dir = makeProject({
      "src/A.tsx": `import { Banner } from "ksk-design-system"\nexport const A = () => <Banner />\n`,
    })
    const result = checkMigration(dir, [EXPORT_ENTRY], { cwd: dir })
    expect(result.total).toBe(1)
    expect(result.findings[0].usage).toBe("import")
  })

  it("DS からの re-export も残件として数える", () => {
    const dir = makeProject({
      "src/ui/index.ts": `export { Banner } from "ksk-design-system"\n`,
    })
    const result = checkMigration(dir, [EXPORT_ENTRY], { cwd: dir })
    expect(result.total).toBe(1)
    expect(result.findings[0].usage).toBe("re-export")
  })

  it("import してから export { X } する形の re-export も数える", () => {
    const dir = makeProject({
      "src/ui/index.ts": `import { Banner } from "ksk-design-system"\nexport { Banner }\n`,
    })
    // import 1 件 + re-export 1 件
    expect(checkMigration(dir, [EXPORT_ENTRY], { cwd: dir }).total).toBe(2)
  })

  it("同名でも DS 由来でなければ数えない", () => {
    const dir = makeProject({
      "src/local.ts": `export const Banner = () => null\n`,
      "src/A.ts": `import { Banner } from "./local"\nexport { Banner }\n`,
    })
    expect(checkMigration(dir, [EXPORT_ENTRY], { cwd: dir }).total).toBe(0)
  })

  it("コメント・文字列中の同名は誤検出しない", () => {
    const dir = makeProject({
      "src/A.ts": [
        `// import { Banner } from "ksk-design-system"`,
        `const name = "Banner"`,
        `export const A = () => name`,
      ].join("\n"),
    })
    expect(checkMigration(dir, [EXPORT_ENTRY], { cwd: dir }).total).toBe(0)
  })
})

describe("collectSourceFiles", () => {
  it("node_modules / dist / 隠しディレクトリを除外する", () => {
    const dir = makeProject({
      "src/App.tsx": `export const App = () => null\n`,
      "node_modules/pkg/index.ts": `export const X = 1\n`,
      "dist/bundle.js": `export const X = 1\n`,
      ".cache/tmp.ts": `export const X = 1\n`,
    })
    const files = collectSourceFiles(dir)
    expect(files.some((f: string) => f.includes("node_modules"))).toBe(false)
    expect(files.some((f: string) => f.includes("/dist/"))).toBe(false)
    expect(files.some((f: string) => f.includes(".cache"))).toBe(false)
    expect(files.some((f: string) => f.endsWith("App.tsx"))).toBe(true)
  })

  it("JS/TS 以外の拡張子は対象外", () => {
    const dir = makeProject({
      "src/App.tsx": `export const App = () => null\n`,
      "src/notes.md": `ListItem interactive の話\n`,
    })
    expect(collectSourceFiles(dir).some((f: string) => f.endsWith(".md"))).toBe(false)
  })
})

describe("CLI の終了コード", () => {
  it("残件 0 なら 0", () => {
    const dir = makeProject({
      "src/A.tsx": `import { ListItem } from "ksk-design-system"\nexport const A = () => <ListItem />\n`,
    })
    expect(
      runCheckMigrationCli([dir], { cwd: dir, pkgRoot: ROOT, deprecations: [PROP_ENTRY] }),
    ).toBe(0)
  })

  it("残件があれば 1", () => {
    const dir = makeProject({
      "src/A.tsx": `import { ListItem } from "ksk-design-system"\nexport const A = () => <ListItem interactive />\n`,
    })
    expect(
      runCheckMigrationCli([dir], { cwd: dir, pkgRoot: ROOT, deprecations: [PROP_ENTRY] }),
    ).toBe(1)
  })

  it("--format=json でも残件があれば 1", () => {
    const dir = makeProject({
      "src/A.tsx": `import { ListItem } from "ksk-design-system"\nexport const A = () => <ListItem interactive />\n`,
    })
    expect(
      runCheckMigrationCli([dir, "--format=json"], {
        cwd: dir,
        pkgRoot: ROOT,
        deprecations: [PROP_ENTRY],
      }),
    ).toBe(1)
  })

  it("存在しないディレクトリは 1", () => {
    expect(
      runCheckMigrationCli([join(tmpdir(), "ksk-ds-does-not-exist")], {
        cwd: ROOT,
        pkgRoot: ROOT,
        deprecations: [PROP_ENTRY],
      }),
    ).toBe(1)
  })

  it("--help は 0（検査せず使い方だけ出す）", () => {
    expect(runCheckMigrationCli(["--help"], { cwd: ROOT, pkgRoot: ROOT })).toBe(0)
  })

  it("DS 自身のソースに対しては台帳どおり 0 件（実装側は @deprecated 宣言のみ）", () => {
    // DS のリポジトリ自身は非推奨 prop を「定義」しているだけで「使用」していない。
    const result = checkMigration(join(ROOT, "src"), loadDeprecations(ROOT), { cwd: ROOT })
    expect(result.total).toBe(0)
  })
})
