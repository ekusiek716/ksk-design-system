/**
 * detect-visual-changes.mjs の境界ケース（CSS 変数の定義行・語の境界・削除ファイル・RN の余白・
 * コメント判定・merge-base）の回帰テスト。基本ケースは detect-visual-changes.test.ts。
 */
import { execFileSync } from "node:child_process"
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterAll, describe, expect, it } from "vitest"
import {
  isCommentOnly,
  scanDiffLines,
  // @ts-expect-error — .mjs の純関数（型定義なし）
} from "../scripts/detect-visual-changes.mjs"

function added(file: string, text: string, line = 1) {
  return [`--- a/${file}`, `+++ b/${file}`, `@@ -${line},0 +${line},1 @@`, `+${text}`].join("\n")
}
const cats = (file: string, text: string) =>
  scanDiffLines(added(file, text)).map((h: { category: string }) => h.category)

describe("CSS 変数の定義行", () => {
  it("値の変更だけでも検出する（参照 var() が無くても）", () => {
    expect(cats("src/styles/semantic.css", "  --shadow-md: 0 4px 8px #0002;")).toContain("shadow")
    expect(cats("src/styles/radius.css", "  --Radius-Surface: 1rem;")).toContain("radius")
    expect(cats("src/styles/semantic.css", "  --Focus-High-Emphasis: var(--Primitive-Brand-300);")).toContain("focus-ring")
    expect(cats("src/styles/semantic.css", "  --Border-Low-Emphasis: var(--Primitive-Gray-300);")).toContain("border")
    expect(cats("src/styles/semantic.css", "  --Surface-Primary: #fff;")).toContain("color")
    expect(cats("src/styles/product-theme.css", "  --Space-Section-md: 3rem;")).toContain("spacing")
    expect(cats("src/styles/product-theme.css", "  --Product-Card-Padding: 2rem;")).toContain("spacing")
  })
  it("無関係な変数の定義は拾わない", () => {
    expect(cats("src/styles/motion.css", "  --Motion-Duration-Fast: 150ms;")).toEqual([])
  })
})

describe("語の境界", () => {
  it("別語に含まれる outline / border / shadow / ring は拾わない", () => {
    expect(cats("src/components/ui/x.tsx", `const bordered = true`)).toEqual([])
    expect(cats("src/components/ui/x.tsx", `const root = el.shadowRoot`)).toEqual([])
    expect(cats("src/components/ui/x.tsx", `const ringBuffer = []`)).toEqual([])
    expect(cats("src/components/ui/x.tsx", `const outlined = 1`)).toEqual([])
  })
  it("variant 名としての outline は拾わず、クラスとしての outline は拾う", () => {
    expect(cats("src/components/ui/x.tsx", `variant="outline"`)).toEqual([])
    expect(cats("src/components/ui/x.tsx", `outline: "text-sm",`)).toEqual([])
    expect(cats("src/components/ui/x.tsx", `"outline outline-2"`)).toContain("focus-ring")
    expect(cats("src/styles/x.css", "  outline: 2px solid red;")).toContain("focus-ring")
  })
  it("値込みの選択肢（p-[10px]）は語境界で落ちない", () => {
    expect(cats("src/components/ui/x.tsx", `"p-[10px] gap-3"`)).toContain("spacing")
  })
  it("RN の borderRadius は radius だけに分類する", () => {
    expect(cats("src/native/components/X.tsx", "  borderRadius: 8,")).toEqual(["radius"])
    expect(cats("src/native/components/X.tsx", "  borderTopLeftRadius: 8,")).toEqual(["radius"])
    expect(cats("src/native/components/X.tsx", "  borderColor: theme.border,")).toEqual(["border"])
  })
})

describe("削除されたファイル", () => {
  it("+++ /dev/null でも旧パスで判定する", () => {
    const diff = ["--- a/src/components/ui/old.tsx", "+++ /dev/null", "@@ -1,2 +0,0 @@", `-"shadow-md rounded-xl"`, `-"border"`].join("\n")
    const hits = scanDiffLines(diff)
    expect(hits.map((h: { category: string }) => h.category).sort()).toEqual(["border", "radius", "shadow"])
    expect(hits[0].file).toBe("src/components/ui/old.tsx")
    expect(hits[0].sign).toBe("-")
  })
})

describe("RN の余白", () => {
  it("padding* / margin* / gap の数値を spacing として検出する", () => {
    expect(cats("src/native/components/X.tsx", "  paddingHorizontal: 16,")).toContain("spacing")
    expect(cats("src/native/components/X.tsx", "  marginTop: -4,")).toContain("spacing")
    expect(cats("src/native/components/X.tsx", "  gap: 12,")).toContain("spacing")
    expect(cats("src/native/components/X.tsx", "  rowGap: 8,")).toContain("spacing")
  })
  it("数値でない指定は拾わない", () => {
    expect(cats("src/native/components/X.tsx", "  padding: theme.space,")).toEqual([])
  })
})

describe("コメント判定", () => {
  it("行コメント・ブロックコメント・JSX の1行コメントは除外する", () => {
    expect(isCommentOnly("// border")).toBe(true)
    expect(isCommentOnly("/* shadow-md */")).toBe(true)
    expect(isCommentOnly(" * 影は5段のみ")).toBe(true)
    expect(isCommentOnly(" */")).toBe(true)
    expect(isCommentOnly("{/* border-2 を足す */}")).toBe(true)
  })
  it("* で始まる CSS のセレクタはコメントにしない", () => {
    expect(isCommentOnly("*, ::before, ::after {")).toBe(false)
    expect(isCommentOnly("* { border: 0 }")).toBe(false)
    expect(cats("src/styles/base.css", "*, ::before { border-color: red; }")).toContain("border")
  })
})

describe("tokens.json の比較起点は merge-base", () => {
  const dir = mkdtempSync(join(tmpdir(), "detect-visual-"))
  afterAll(() => rmSync(dir, { recursive: true, force: true }))
  const git = (...args: string[]) => execFileSync("git", args, { cwd: dir, encoding: "utf8" }).trim()
  const writeTokens = (radius: string, metaVersion = "1") =>
    writeFileSync(join(dir, "tokens.json"), JSON.stringify({ meta: { version: metaVersion }, borderRadius: { md: radius } }))

  it("base 側だけが進んだ tokens.json の変更を PR の変更と誤認しない", () => {
    mkdirSync(join(dir, "scripts"))
    mkdirSync(join(dir, "src"))
    copyFileSync(join(__dirname, "../scripts/detect-visual-changes.mjs"), join(dir, "scripts/detect-visual-changes.mjs"))
    writeFileSync(join(dir, "src/a.ts"), "export const a = 1\n")
    git("init", "-q", "-b", "main")
    git("config", "user.email", "t@example.com")
    git("config", "user.name", "t")
    writeTokens("6px")
    git("add", "-A")
    git("commit", "-q", "-m", "base")
    git("checkout", "-q", "-b", "feature")
    writeFileSync(join(dir, "src/a.ts"), "export const a = 2\n")
    writeTokens("6px", "2") // PR 自身は tokens.json の meta だけを変える（見た目に無関係）
    git("commit", "-q", "-am", "feature: 見た目に無関係")
    git("checkout", "-q", "main")
    writeTokens("12px") // main 側で角丸が変わった（PR のせいではない）
    git("commit", "-q", "-am", "main: tokens 変更")
    git("checkout", "-q", "feature")
    const out = execFileSync("node", ["scripts/detect-visual-changes.mjs", "main", "feature"], { cwd: dir, encoding: "utf8" }).trim()
    expect(out).toBe("false")
  })
})
