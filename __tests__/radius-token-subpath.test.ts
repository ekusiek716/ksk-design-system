import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { describe, expect, it } from "vitest"

/**
 * Radius トークンの配布経路の不変条件。issue #553。
 *
 * `--Radius-*` は preset.css 本体に直書きされていたため、`./preset` ではなく
 * 個別 subpath（tokens/primitive + themes/* + tokens/semantic +
 * tokens/product-theme + glass）だけを import する consumer では未定義になり、
 * Sheet / Dialog / Card の角丸が静かに 0px になっていた。
 *
 * 「ビルドは通るのに見た目だけ壊れる」型なので、import グラフを辿って
 * 「どの公開 subpath 構成でも safelist が参照する Radius 系が定義される」
 * ことをここで固定する。
 */

const pkg = JSON.parse(readFileSync("package.json", "utf8")) as {
  exports: Record<string, { default?: string } | string>
}

/** CSS の相対 @import を再帰的に展開して1本の文字列にする */
function resolveCss(path: string, seen = new Set<string>()): string {
  if (seen.has(path)) return ""
  seen.add(path)
  // コメント内の @import（使い方の例示）を実 import と誤認しないよう先に落とす
  const source = readFileSync(path, "utf8").replace(/\/\*[\s\S]*?\*\//g, "")
  const dir = dirname(path)
  return source.replace(/@import\s+"(\.[^"]+)"\s*;/g, (_match, relative: string) =>
    resolveCss(join(dir, relative), seen),
  )
}

function fileForSubpath(subpath: string): string {
  const entry = pkg.exports[subpath]
  expect(entry, `exports に ${subpath} がありません`).toBeTruthy()
  const file = typeof entry === "string" ? entry : entry.default
  expect(file, `${subpath} の default が解決できません`).toBeTruthy()
  return (file as string).replace(/^\.\//, "")
}

function resolveSubpaths(subpaths: string[]): string {
  return subpaths.map((subpath) => resolveCss(fileForSubpath(subpath))).join("\n")
}

/** 最後に定義された値（CSS の後勝ち）を返す */
function definedValue(css: string, name: string): string | null {
  const matches = [...css.matchAll(new RegExp(`${name}:\\s*([^;]+);`, "g"))]
  if (matches.length === 0) return null
  return matches[matches.length - 1][1].trim()
}

const EXPECTED: Record<string, string> = {
  "--Radius-Surface": "0.875rem",
  "--Radius-Modal": "1.5rem",
  "--Radius-Sheet": "2rem",
}

/** issue #553 の再現構成（yokoku.app の globals.css 相当） */
const INDIVIDUAL_SUBPATHS = [
  "./tokens/primitive",
  "./themes/violet",
  "./tokens/semantic",
  "./tokens/product-theme",
  "./glass",
]

describe("Radius トークンの配布経路（issue #553）", () => {
  it("個別 subpath 構成でも 3 トークンが解決される", () => {
    const css = resolveSubpaths(INDIVIDUAL_SUBPATHS)
    for (const [name, value] of Object.entries(EXPECTED)) {
      expect(definedValue(css, name), `${name} が未定義`).toBe(value)
    }
  })

  it("./preset 構成の値が従来どおり（回帰なし）", () => {
    const css = resolveCss(fileForSubpath("./preset"))
    for (const [name, value] of Object.entries(EXPECTED)) {
      expect(definedValue(css, name)).toBe(value)
    }
  })

  it("./tokens/radius は Radius 3 トークンだけを配る", () => {
    const file = fileForSubpath("./tokens/radius")
    expect(file).toBe("src/styles/radius.css")
    const css = resolveCss(file)
    for (const [name, value] of Object.entries(EXPECTED)) {
      expect(definedValue(css, name)).toBe(value)
    }
    const declared = [...css.matchAll(/^\s*(--[\w-]+):/gm)].map((m) => m[1])
    expect(new Set(declared)).toEqual(new Set(Object.keys(EXPECTED)))
  })

  it("定義元は radius.css の1箇所（preset.css に直書きを戻さない）", () => {
    const preset = readFileSync("src/preset.css", "utf8") + readFileSync("src/preset-core.css", "utf8")
    for (const name of Object.keys(EXPECTED)) {
      expect(preset.includes(`${name}:`)).toBe(false)
    }
  })

  it("safelist が参照する Radius 系変数が、preset / 個別 subpath の両方で定義される", () => {
    const safelist = readFileSync("src/styles/source-safelist.css", "utf8")
    const referenced = new Set(
      [...safelist.matchAll(/var\((--[\w-]*Radius[\w-]*)\)/g)].map((m) => m[1]),
    )
    expect(referenced.size).toBeGreaterThan(0)

    const presetCss = resolveCss(fileForSubpath("./preset"))
    const subpathCss = resolveSubpaths(INDIVIDUAL_SUBPATHS)
    for (const name of referenced) {
      expect(definedValue(presetCss, name), `${name} が preset で未定義`).toBeTruthy()
      expect(definedValue(subpathCss, name), `${name} が個別 subpath 構成で未定義`).toBeTruthy()
    }
  })
})
