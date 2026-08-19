/**
 * product theme override API（issue #364）の**非破壊性**を固定する。
 *
 * Button / Input / Textarea / SelectTrigger / Card の内寸を固定 Tailwind クラス
 * （`h-10` / `px-4` / `rounded-lg` …）から公開 CSS 変数（`--Control-*` /
 * `--Field-*` / `--Product-Card-*`）参照へ移した。変数を上書きしない限り
 * **1px も変わってはいけない**のがこの変更の絶対条件なので、
 *
 *   1. origin/main（v1.57.0）が出していた固定クラスの実寸
 *   2. src/styles/product-theme.css が宣言する既定値
 *
 * を Tailwind v4 に実際にコンパイルさせて突き合わせる。クラス名の目視ではなく
 * **生成 CSS の数値**で比較するので、`--spacing` スケールの解釈違いや
 * arbitrary value の記法ミスもここで落ちる。
 *
 * 併せて、各コンポーネントが実際にトークン参照クラスを出力していること
 * （＝配線が外れていないこと）も固定する。
 */
import { describe, expect, it, beforeAll } from "vitest"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { createRequire } from "node:module"

const ROOT = process.cwd()
const PX_PER_REM = 16

/** src/styles/product-theme.css が :root に宣言する既定値（変数名 → 値の文字列） */
function productThemeDefaults(): Map<string, string> {
  const css = readFileSync(join(ROOT, "src/styles/product-theme.css"), "utf8")
  const map = new Map<string, string>()
  for (const match of css.matchAll(/^\s*(--[A-Za-z0-9-]+)\s*:\s*([^;]+);/gm)) {
    map.set(match[1], match[2].trim())
  }
  return map
}

let build: (candidates: string[]) => string

beforeAll(async () => {
  const { compile } = await import("tailwindcss")
  const compiled = await compile(`@import "tailwindcss";`, {
    base: ROOT,
    loadStylesheet: async (id: string, base: string) => {
      const require = createRequire(`${base}/`)
      const path = require.resolve(id === "tailwindcss" ? "tailwindcss/index.css" : id)
      return { path, base, content: readFileSync(path, "utf8") }
    },
  })
  build = (candidates) => compiled.build(candidates)
})

/**
 * 1 クラスをコンパイルし、指定プロパティの宣言値を取り出す。
 *
 * Tailwind の compiler は build() の候補を**累積**するため、CSS 全体から
 * 最初の宣言を拾うと過去の候補にヒットする。セレクタを厳密に一致させること。
 */
/** 候補名 → Tailwind が出力するセレクタ文字列（`px-2.5` → `px-2\.5`） */
function cssSelector(candidate: string): string {
  return candidate.replace(/[[\]().,:/*#%!]/g, (char) => `\\${char}`)
}

/** 任意の文字列を正規表現リテラルとして扱えるようにする */
function escapeRegExp(source: string): string {
  return source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function declaration(candidate: string, property: string): string {
  const css = build([candidate])
  const rule = css.match(
    new RegExp(`\\.${escapeRegExp(cssSelector(candidate))}\\s*\\{([^{}]*)\\}`),
  )
  if (!rule) throw new Error(`${candidate} のルールが生成されませんでした:\n${css}`)
  const decl = rule[1].match(new RegExp(`(?:^|;|\\s)${property}:\\s*([^;]+);`))
  if (!decl) throw new Error(`${candidate} に ${property} 宣言がありません: ${rule[1]}`)
  return decl[1].trim()
}

const defaults = productThemeDefaults()

/**
 * 宣言値を px に解決する。
 * - `calc(var(--spacing) * N)` … Tailwind v4 の既定 --spacing = 0.25rem
 * - `var(--Token)` … product-theme.css の既定値
 * - `var(--radius-lg)` … Tailwind v4 の既定 0.5rem
 * - `calc(infinity * 1px)` … ピル（実質無限大）
 */
function toPx(value: string): number {
  const trimmed = value.trim()

  if (/^calc\(\s*infinity\s*\*\s*1px\s*\)$/.test(trimmed)) return Number.POSITIVE_INFINITY

  const spacing = trimmed.match(/^calc\(\s*var\(--spacing\)\s*\*\s*([\d.]+)\s*\)$/)
  if (spacing) return Number(spacing[1]) * 0.25 * PX_PER_REM

  if (trimmed === "var(--radius-lg)") return 0.5 * PX_PER_REM

  const token = trimmed.match(/^var\((--[A-Za-z0-9-]+)\)$/)
  if (token) {
    const resolved = defaults.get(token[1])
    if (!resolved) throw new Error(`${token[1]} が product-theme.css に宣言されていません`)
    return toPx(resolved)
  }

  const rem = trimmed.match(/^(-?[\d.]+)rem$/)
  if (rem) return Number(rem[1]) * PX_PER_REM

  const px = trimmed.match(/^(-?[\d.]+)px$/)
  if (px) return Number(px[1])

  throw new Error(`px に解決できない値です: ${value}`)
}

/**
 * origin/main（v1.57.0）の固定クラス → 現行のトークン参照クラス。
 * 左右が同じ実寸を出すことが「product theme を上書きしなければ見た目が変わらない」
 * の機械的な証明になる。
 */
const EQUIVALENTS: Array<[baseline: string, tokenized: string, property: string]> = [
  // ─── Button: 高さ ───
  ["h-6", "h-[var(--Control-Height-Xs)]", "height"],
  ["h-8", "h-[var(--Control-Height-Sm)]", "height"],
  ["h-10", "h-[var(--Control-Height-Md)]", "height"],
  ["h-12", "h-[var(--Control-Height-Lg)]", "height"],
  ["h-14", "h-[var(--Control-Height-Xl)]", "height"],
  ["min-h-14", "min-h-[var(--Control-Height-Xl)]", "min-height"],
  // ─── Button: 横 padding ───
  ["px-2", "px-[var(--Control-Padding-X-Xs)]", "padding-inline"],
  ["px-3", "px-[var(--Control-Padding-X-Sm)]", "padding-inline"],
  ["px-4", "px-[var(--Control-Padding-X-Md)]", "padding-inline"],
  ["px-6", "px-[var(--Control-Padding-X-Lg)]", "padding-inline"],
  ["px-8", "px-[var(--Control-Padding-X-Xl)]", "padding-inline"],
  // ─── Button: gap / icon サイズ ───
  ["gap-2", "gap-[var(--Control-Gap)]", "gap"],
  ["size-8", "size-[var(--Control-Height-Sm)]", "height"],
  ["size-10", "size-[var(--Control-Height-Md)]", "height"],
  ["size-12", "size-[var(--Control-Height-Lg)]", "height"],
  ["size-8", "size-[var(--Control-Height-Sm)]", "width"],
  // ─── Field: 高さ ───
  ["h-9", "h-[var(--Field-Height-Sm)]", "height"],
  ["h-12", "h-[var(--Field-Height-Md)]", "height"],
  ["h-14", "h-[var(--Field-Height-Lg)]", "height"],
  ["min-h-[80px]", "min-h-[var(--Field-Min-Height)]", "min-height"],
  // ─── Field: padding ───
  ["px-2.5", "px-[var(--Field-Padding-X-Sm)]", "padding-inline"],
  ["px-3", "px-[var(--Field-Padding-X-Md)]", "padding-inline"],
  ["px-4", "px-[var(--Field-Padding-X-Lg)]", "padding-inline"],
  ["py-2", "py-[var(--Field-Padding-Y)]", "padding-block"],
  // ─── Field: 角丸 ───
  ["rounded-lg", "rounded-[var(--Field-Radius)]", "border-radius"],
  // ─── Card ───
  ["p-6", "p-[var(--Product-Card-Padding)]", "padding"],
  ["gap-6", "gap-[var(--Product-Card-Gap)]", "gap"],
]

describe("product theme の既定値は origin/main の固定クラスと同一実寸 (issue #364)", () => {
  it.each(EQUIVALENTS)("%s と %s の %s が一致する", (baseline, tokenized, property) => {
    expect(toPx(declaration(tokenized, property))).toBe(toPx(declaration(baseline, property)))
  })

  it("Button の角丸はピルのまま（rounded-full と --Control-Radius はどちらも実質無限大）", () => {
    // `calc(infinity * 1px)` と `9999px` は数値としては別だが、どの Control 高さ
    // （最大 56px）でも border-radius は高さの半分にクランプされるため描画は同一。
    expect(toPx(declaration("rounded-full", "border-radius"))).toBeGreaterThanOrEqual(9999)
    expect(toPx(declaration("rounded-[var(--Control-Radius)]", "border-radius"))).toBeGreaterThanOrEqual(
      9999,
    )
  })
})

describe("公開変数の配線", () => {
  it("Button の size バリアントが Control 変数を参照する", async () => {
    const { buttonVariants } = await import("../src/lib/server-variants/button-variants")
    expect(buttonVariants({ size: "default" })).toContain("h-[var(--Control-Height-Md)]")
    expect(buttonVariants({ size: "default" })).toContain("px-[var(--Control-Padding-X-Md)]")
    expect(buttonVariants({ size: "icon" })).toContain("size-[var(--Control-Height-Md)]")
    expect(buttonVariants({})).toContain("gap-[var(--Control-Gap)]")
    expect(buttonVariants({ variant: "default" })).toContain("rounded-[var(--Control-Radius)]")
  })

  it("固定タップ領域（icon-xl = 44px）は product theme から外してある", async () => {
    const { buttonVariants } = await import("../src/lib/server-variants/button-variants")
    // HIG の最小タップ領域なので、product theme で縮められては困る
    expect(buttonVariants({ size: "icon-xl" })).toContain("size-11")
  })

  it("product-theme.css の全変数が contracts の許可リストに載っている", async () => {
    const contract = JSON.parse(
      readFileSync(join(ROOT, "contracts/product-theme-overrides.json"), "utf8"),
    ) as { allowedVariables: Record<string, string[]> }
    const allowed = new Set(Object.values(contract.allowedVariables).flat())
    const missing = [...defaults.keys()].filter((name) => !allowed.has(name))
    expect(missing).toEqual([])
  })

  it("許可リストの Control / Field / Product 変数はすべて既定値を持つ", async () => {
    const contract = JSON.parse(
      readFileSync(join(ROOT, "contracts/product-theme-overrides.json"), "utf8"),
    ) as { allowedVariables: Record<string, string[]> }
    const owned = [
      ...contract.allowedVariables.controlSize,
      ...contract.allowedVariables.fieldSize,
      ...contract.allowedVariables.productSpacing.filter((n) => n.startsWith("--Product-")),
      "--Control-Radius",
      "--Field-Radius",
    ]
    const missing = owned.filter((name) => !defaults.has(name))
    expect(missing).toEqual([])
  })

  it("preset.css が product-theme.css を読み込む（消費側の追加設定なしで既定値が効く）", () => {
    const preset = readFileSync(join(ROOT, "src/preset.css"), "utf8")
    expect(preset).toContain(`@import "./styles/product-theme.css";`)
  })
})
