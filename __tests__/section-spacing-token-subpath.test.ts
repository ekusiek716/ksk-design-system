import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { describe, expect, it } from "vitest"

/**
 * Section Spacing / Z-Index / Shadow トークンの配布経路の不変条件。
 * issue #560（#553 と同型）・issue #563（#553 / #560 と同型・最後の20件）。
 *
 * `--Space-Section-*` / `--Z-*` / `--shadow-*` は preset.css 本体に直書き
 * されていたため、`./preset` ではなく個別 subpath（tokens/primitive +
 * themes/* + tokens/semantic + tokens/product-theme + glass）だけを import
 * する consumer では未定義になり、セクション間の余白が静かに 0px になったり、
 * モーダルが他要素の下に隠れたり、影が消えたりしていた。
 *
 * 「ビルドは通るのに見た目だけ壊れる」型なので、import グラフを辿って
 * 「どの公開 subpath 構成でも safelist が参照する Space-Section / Z-Index /
 * Shadow 系が定義される」ことをここで固定する。ファイル名は #560 当時のまま
 * だが、#563 で Z-Index / Shadow の検査も同じファイルへ追加した
 * （検査の仕組み・resolveCss 等のヘルパーを共有するため、リネームはしない）。
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
  "--Space-Section-xs": "32px",
  "--Space-Section-sm": "40px",
  "--Space-Section-md": "48px",
  "--Space-Section-lg": "56px",
  "--Space-Section-xl": "64px",
  "--Space-Section-2xl": "80px",
}

/** issue #553 / #560 / #563 の再現構成（yokoku.app の globals.css 相当） */
const INDIVIDUAL_SUBPATHS = [
  "./tokens/primitive",
  "./themes/violet",
  "./tokens/semantic",
  "./tokens/product-theme",
  "./glass",
]

const Z_INDEX_EXPECTED: Record<string, string> = {
  "--Z-Modal": "60",
}

const SHADOW_EXPECTED: Record<string, string> = {
  "--shadow-md": "0 0 8px rgba(20, 20, 20, 0.08)",
}

describe("Section Spacing トークンの配布経路（issue #560）", () => {
  it("個別 subpath 構成でも 6 トークンが解決される", () => {
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

  it("./tokens/section-spacing は Section Spacing 6トークンだけを配る", () => {
    const file = fileForSubpath("./tokens/section-spacing")
    expect(file).toBe("src/styles/section-spacing.css")
    const css = resolveCss(file)
    for (const [name, value] of Object.entries(EXPECTED)) {
      expect(definedValue(css, name)).toBe(value)
    }
    const declared = [...css.matchAll(/^\s*(--[\w-]+):/gm)].map((m) => m[1])
    expect(new Set(declared)).toEqual(new Set(Object.keys(EXPECTED)))
  })

  it("定義元は section-spacing.css の1箇所（preset.css に直書きを戻さない）", () => {
    const preset = readFileSync("src/preset.css", "utf8")
    for (const name of Object.keys(EXPECTED)) {
      expect(preset.includes(`${name}:`)).toBe(false)
    }
  })

  it("safelist が参照する Space-Section 系変数が、preset / 個別 subpath の両方で定義される", () => {
    const safelist = readFileSync("src/styles/source-safelist.css", "utf8")
    const referenced = new Set(
      [...safelist.matchAll(/var\((--Space-Section[\w-]*)\)/g)].map((m) => m[1]),
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

describe("Z-Index トークンの配布経路（issue #563）", () => {
  it("個別 subpath 構成でも --Z-Modal が解決される", () => {
    const css = resolveSubpaths(INDIVIDUAL_SUBPATHS)
    for (const [name, value] of Object.entries(Z_INDEX_EXPECTED)) {
      expect(definedValue(css, name), `${name} が未定義`).toBe(value)
    }
  })

  it("./preset 構成の値が従来どおり（回帰なし）", () => {
    const css = resolveCss(fileForSubpath("./preset"))
    for (const [name, value] of Object.entries(Z_INDEX_EXPECTED)) {
      expect(definedValue(css, name)).toBe(value)
    }
  })

  it("定義元は z-index.css の1箇所（preset.css に直書きを戻さない）", () => {
    const preset = readFileSync("src/preset.css", "utf8")
    expect(preset.includes("--Z-Modal:")).toBe(false)
  })
})

describe("Shadow トークンの配布経路（issue #563）", () => {
  it("個別 subpath 構成でも --shadow-md が解決される", () => {
    const css = resolveSubpaths(INDIVIDUAL_SUBPATHS)
    for (const [name, value] of Object.entries(SHADOW_EXPECTED)) {
      expect(definedValue(css, name), `${name} が未定義`).toBe(value)
    }
  })

  it("./preset 構成の値が従来どおり（回帰なし）", () => {
    const css = resolveCss(fileForSubpath("./preset"))
    for (const [name, value] of Object.entries(SHADOW_EXPECTED)) {
      expect(definedValue(css, name)).toBe(value)
    }
  })

  it("定義元は shadow.css の1箇所（preset.css に直書きを戻さない）", () => {
    const preset = readFileSync("src/preset.css", "utf8")
    expect(preset.includes("--shadow-md:")).toBe(false)
  })
})

/** `./preset` を除く、CSS ファイルを指す exports subpath を package.json から
 *  実際に読んで列挙する（ワイルドカードではなく個別に定義されている構成な
 *  ので、themes/* は6テーマ全部を読む）。「どの subpath からも取得できない
 *  変数＝本当の穴」を判定するための、最も網羅的な構成。 */
function allCssSubpaths(): string[] {
  return Object.entries(pkg.exports)
    .filter(([subpath, entry]) => {
      if (subpath === "./preset") return false
      const file = typeof entry === "string" ? entry : entry.default
      return typeof file === "string" && file.endsWith(".css") && file !== "./src/preset.css"
    })
    .map(([subpath]) => subpath)
}

/**
 * safelist が参照する**全ての** CSS 変数について、preset 構成では定義される
 * のに「exports の CSS subpath を全て読んだ構成」でも未定義になるものが
 * 他に無いかを洗い出す（issue #560 の完了条件4）。個別 subpath 構成
 * （INDIVIDUAL_SUBPATHS）だけを見ると「そのサブセットを選んだ consumer では
 * 未定義」というだけの誤検知が混ざるため、判定にはこちらの全 subpath 構成を
 * 使う。ここに載っている名前は「既に確認済みで問題ない」ものだけで、新たな
 * 取りこぼしが見つかったら CI が落ちる。
 *
 * 見つかったものは今回のスコープでは直さず、issue 報告のみとする。
 */
describe("safelist 変数の subpath 網羅性（issue #560 完了条件4）", () => {
  it("preset で定義されるのに、どの CSS subpath からも取得できない変数が既知の一覧と一致する", () => {
    const safelist = readFileSync("src/styles/source-safelist.css", "utf8")
    const allReferenced = new Set(
      [...safelist.matchAll(/var\((--[\w-]+)\)/g)].map((m) => m[1]),
    )

    const presetCss = resolveCss(fileForSubpath("./preset"))
    const allSubpathCss = resolveSubpaths(allCssSubpaths())

    const missingEverywhere = [...allReferenced]
      .filter((name) => definedValue(presetCss, name) && !definedValue(allSubpathCss, name))
      .sort()

    // Z-Index スケールと shadow トークンの計20件は issue #563 で
    // styles/z-index.css / styles/shadow.css へ切り出し、preset.css /
    // product-theme.css の両方から @import するようにした（#553 / #560 と
    // 同方式）。現時点で取りこぼしはゼロ。
    //
    // Categorical（./tokens/categorical）と Motion（./tokens/motion）は
    // 専用 subpath から取得できるため「穴」ではない（個別 subpath の
    // "再現構成"だけを見た前回の判定は誤りだった）。
    const KNOWN_EXCEPTIONS: string[] = []

    // `--ksk-fab-bottom-offset` はトークンの穴ではなく、
    // MobileFloatingActionButton（src/components/ui/mobile-floating-action-button.tsx
    // 93〜96行付近）がインラインスタイルで自前設定するコンポーネント内部
    // 変数。トークン CSS には元々どこにも定義されておらず、safelist の
    // 正規表現がコンポーネント内部変数まで拾ってしまっているだけなので、
    // Z-Index / shadow とは別の例外リストで区別する。
    const COMPONENT_LOCAL_VARS: string[] = ["--ksk-fab-bottom-offset"]

    expect(missingEverywhere).toEqual(
      [...KNOWN_EXCEPTIONS, ...COMPONENT_LOCAL_VARS].sort(),
    )
  })
})
