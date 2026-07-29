/**
 * @source safelist の同梱契約（issue #258）
 *
 * DS 内部でしか出現しないユーティリティは、消費側 Tailwind v4 の
 * `@source ".../ksk-design-system/dist"` が無い / パスがずれている / スキャナが
 * dist を辿れない場合に CSS が生成されず、消費側でだけ壊れる（#132/#134/#138/#143）。
 *
 * 対策として scripts/generate-source-safelist.mjs が
 * src/styles/source-safelist.css に `@source inline("…")` を生成し、
 * preset.css から読み込む。ここではその配線と最低限の内容を固定する。
 * （src の実装との一致は `node scripts/generate-source-safelist.mjs --check` が担当）
 */
import { describe, it, expect } from "vitest"
import { execFileSync } from "node:child_process"
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import {
  formatInlineSource,
  UNSUPPORTED_BRACE,
  UNSUPPORTED_BOTH_QUOTES,
  UNSUPPORTED_HELP,
  // @ts-expect-error — .mjs の純関数モジュール（型定義なし）
} from "../scripts/lib/source-safelist-format.mjs"

const ROOT = process.cwd()
const read = (rel: string) => readFileSync(join(ROOT, rel), "utf8")

const SAFELIST_PATH = "src/styles/source-safelist.css"
const safelist = read(SAFELIST_PATH)
const preset = read("src/preset.css")
const pkg = JSON.parse(read("package.json")) as {
  files: string[]
  scripts: Record<string, string>
}

const entries = [...safelist.matchAll(/@source inline\("([^"]+)"\);/g)].map((m) => m[1])

describe("@source safelist の同梱（issue #258）", () => {
  it("preset.css が safelist を読み込む（消費側は preset の @import だけで済む）", () => {
    expect(preset).toContain('@import "./styles/source-safelist.css";')
  })

  it("safelist は配布物に含まれる（package.json files の src/styles 経由）", () => {
    expect(pkg.files).toContain("src/styles")
  })

  it("npm run check がドリフト検査を含む", () => {
    expect(pkg.scripts.check).toContain("scripts/generate-source-safelist.mjs --check")
  })

  it("十分な件数のユーティリティを safelist している", () => {
    expect(entries.length).toBeGreaterThan(500)
  })

  it("過去に消費側で壊れた pointer-events ペアを含む", () => {
    expect(entries).toContain("pointer-events-none")
    expect(entries).toContain("pointer-events-auto")
  })

  it("`@source inline()` を壊す文字（波括弧）を含む候補が無い", () => {
    expect(entries.filter((e) => /[{}]/.test(e))).toEqual([])
  })

  it("動的クラス検出の走査対象が Scanner の走査対象と一致している（src/lib・index.ts も見る）", () => {
    const script = read("scripts/generate-source-safelist.mjs")
    // SOURCE_SPECS 1 箇所から Scanner sources と検査対象ファイルの両方を導出している
    expect(script).toContain("SCANNER_SOURCES")
    expect(script).toContain("SOURCE_SPECS.flatMap")
    expect(script).toContain("const files = sourceFiles()")
    expect(script).not.toContain('collectFiles(join(ROOT, "src/components")')
  })
})

/**
 * `@source inline()` に表現できない候補を黙って捨てると、safelist から漏れて
 * #258 と同型の欠落（消費側でだけ CSS が生成されない）が静かに再発する。
 * 現在の src には該当クラスが無いため、fixture で分類ロジックを直接検証する。
 */
describe("safelist に載せられない候補の扱い（fixture）", () => {
  it("通常のユーティリティは二重引用符で囲む", () => {
    expect(formatInlineSource("pointer-events-auto")).toEqual({
      ok: true,
      line: '@source inline("pointer-events-auto");',
    })
  })

  it("二重引用符を含む候補は単一引用符で囲んで載せる（黙殺しない）", () => {
    // Tailwind の CSS パーサは単一引用符の文字列も受け付ける（実測確認済み）
    expect(formatInlineSource(`content-["x"]`)).toEqual({
      ok: true,
      line: `@source inline('content-["x"]');`,
    })
  })

  it("単一引用符を含む候補は二重引用符で囲んで載せる", () => {
    expect(formatInlineSource(`content-['x']`)).toEqual({
      ok: true,
      line: `@source inline("content-['x']");`,
    })
  })

  it("波括弧を含む候補は表現不能として報告する（ブレース展開で解釈されるため）", () => {
    const result = formatInlineSource(`content-['{']`)
    expect(result.ok).toBe(false)
    expect(result).toMatchObject({ reason: UNSUPPORTED_BRACE })
    expect(UNSUPPORTED_HELP[UNSUPPORTED_BRACE]).toBeTruthy()
  })

  it("両方の引用符を含む候補は表現不能として報告する", () => {
    const result = formatInlineSource(`content-['a"b']`)
    expect(result.ok).toBe(false)
    expect(result).toMatchObject({ reason: UNSUPPORTED_BOTH_QUOTES })
    expect(UNSUPPORTED_HELP[UNSUPPORTED_BOTH_QUOTES]).toBeTruthy()
  })

  it("表現不能な候補があると生成スクリプトは exit 1 になる（黙って除外しない）", () => {
    const script = read("scripts/generate-source-safelist.mjs")
    expect(script).toContain("unsupported.length > 0")
    expect(script).toContain("UNSUPPORTED_HELP[reason]")
  })

  it("生成物が存在しない状態からブートストラップできる（自己参照で throw しない）", () => {
    // preset.css は生成物を @import しているため、CSS ローダーが素直に読むと
    // 初回生成時（ファイル未作成）に readFileSync が throw して生成に到達できない。
    // 生成対象ファイル自身を読み込み対象から外していることの回帰テスト。
    const absolute = join(ROOT, SAFELIST_PATH)
    const backup = readFileSync(absolute, "utf8")
    try {
      rmSync(absolute)
      expect(existsSync(absolute)).toBe(false)
      execFileSync(process.execPath, ["scripts/generate-source-safelist.mjs"], {
        cwd: ROOT,
        stdio: "pipe",
      })
      expect(existsSync(absolute)).toBe(true)
      // 前回の生成結果が入力に混ざらない = 生成は src の実装だけに依存する
      expect(readFileSync(absolute, "utf8")).toBe(backup)
    } finally {
      writeFileSync(absolute, backup)
    }
  }, 60_000)

  it("生成物は手書き禁止であることを明示している", () => {
    expect(safelist).toContain("自動生成")
    expect(safelist).toContain("scripts/generate-source-safelist.mjs")
  })
})
