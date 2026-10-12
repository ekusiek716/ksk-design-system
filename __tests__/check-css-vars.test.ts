import { describe, expect, it } from "vitest"
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { spawnSync } from "node:child_process"

/**
 * scripts/check-css-vars.mjs の contract。
 *
 * `bg-[var(--Border-Mediun-Emphasis)]` のようなタイプミスは Tailwind の任意値では
 * ビルドも型検査も通り、宣言が黙って無効になるだけで気付けない。
 * 一時ディレクトリに src/ を作り、検査が未定義参照を落とすこと・定義元を認識することを固定する。
 */
function run(files: Record<string, string>) {
  const root = mkdtempSync(join(tmpdir(), "ksk-ds-css-vars-"))
  for (const [rel, body] of Object.entries(files)) {
    const file = join(root, rel)
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, body)
  }
  return spawnSync("node", ["scripts/check-css-vars.mjs", root], {
    cwd: process.cwd(),
    encoding: "utf8",
  })
}

const outputOf = (r: ReturnType<typeof run>) => `${r.stdout}\n${r.stderr}`

const DEFS = `:root { --Border-Medium-Emphasis: #ccc; }`

describe("check-css-vars.mjs", () => {
  it("実リポジトリの src/ が通る（許可リスト以外の未定義参照が無い）", () => {
    const r = spawnSync("node", ["scripts/check-css-vars.mjs"], { cwd: process.cwd(), encoding: "utf8" })
    expect(outputOf(r)).toContain("CSS 変数参照チェック OK")
    expect(r.status).toBe(0)
  })

  it("tsx の任意値のタイプミスを file:line 付きで落とす", () => {
    const r = run({
      "src/styles/semantic.css": DEFS,
      "src/components/a.tsx": `export const A = () => (\n  <div className="border border-[var(--Border-Mediun-Emphasis)]" />\n)\n`,
    })
    expect(r.status).toBe(1)
    expect(outputOf(r)).toContain("src/components/a.tsx:2")
    expect(outputOf(r)).toContain("--Border-Mediun-Emphasis")
  })

  it("CSS 内のタイプミスを落とし、フォールバック付きでも見逃さない", () => {
    const r = run({
      "src/styles/semantic.css": DEFS,
      "src/styles/x.css": `.x { border-color: var(--Border-Medium-Empahsis, red); }`,
    })
    expect(r.status).toBe(1)
    expect(outputOf(r)).toContain("--Border-Medium-Empahsis")
    expect(outputOf(r)).toContain("フォールバック付き")
  })

  it("定義済みの変数は通る", () => {
    const r = run({
      "src/styles/semantic.css": DEFS,
      "src/components/a.tsx": `export const A = () => <div className="border-[var(--Border-Medium-Emphasis)]" />`,
    })
    expect(r.status).toBe(0)
  })

  it("TSX 内で自分が宣言する局所変数（style の --X / 定数経由 / setProperty）は定義済みとみなす", () => {
    const r = run({
      "src/components/a.tsx": [
        `const K = "--Local-Const"`,
        `export const A = () => (`,
        `  <div style={{ "--Local-Style": "1px" }} className="w-[var(--Local-Style)] h-[var(--Local-Const)] p-[var(--Local-Set)]" ref={(el) => el?.style.setProperty("--Local-Set", "1px")} />`,
        `)`,
      ].join("\n"),
    })
    expect(r.status).toBe(0)
  })

  it("コメント内の記述例と、名前が確定しない動的合成は対象外", () => {
    const r = run({
      "src/components/a.tsx": [
        `// 例: var(--Not-Real-Comment)`,
        `export const A = (t: string) => <div className={\`border-[var(--Border-\${t})]\`} />`,
      ].join("\n"),
      "src/styles/x.css": `/* var(--Not-Real-Css) */ .x { color: red; }`,
    })
    expect(r.status).toBe(0)
  })

  it(".stories.tsx と source-safelist.css は対象外", () => {
    const r = run({
      "src/components/a.stories.tsx": `export const S = () => <div className="w-[var(--Only-In-Story)]" />`,
      "src/styles/source-safelist.css": `@source inline("w-[var(--Categorical-N)]");`,
    })
    expect(r.status).toBe(0)
  })

  it("Radix が注入する --radix-* は許可リストで通る", () => {
    const r = run({
      "src/components/a.tsx": `export const A = () => <div className="w-[var(--radix-popover-trigger-width)]" />`,
    })
    expect(r.status).toBe(0)
  })
})
