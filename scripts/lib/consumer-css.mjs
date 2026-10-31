/**
 * consumer と同じ入口（README の例: `@import "tailwindcss"; @import "ksk-design-system/preset";`）で
 * DS の CSS を Tailwind v4 にコンパイルするためのヘルパー（issue #827）。
 *
 * Storybook / 開発用の入口 `src/index.css` は consumer が読まない CSS を足せてしまうため、
 * 「Storybook では効くのに consumer では CSS が作られない」差が生まれる
 * （#827: tw-animate-css が index.css にだけあり、開閉アニメが本番で出なかった）。
 * ここでは preset.css だけを入口にし、bare な @import は consumer のバンドラと同じく
 * パッケージの `exports["."].style` → `style` → `main` の順で解決する。
 */
import { existsSync, readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { __unstable__loadDesignSystem, compile } from "tailwindcss"

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..")

/** consumer が README どおりに書く CSS（テーマ・@source を除いた DS 部分） */
export const CONSUMER_ENTRY = `@import "tailwindcss";\n@import "./preset.css";\n`

const packageNameOf = (id) => (id.startsWith("@") ? id.split("/").slice(0, 2).join("/") : id.split("/")[0])

/** bare specifier を node_modules から CSS ファイルへ解決する（style 条件を優先） */
function resolvePackageStylesheet(id, base) {
  const name = packageNameOf(id)
  const subpath = id.slice(name.length) // "" or "/xxx"
  for (let dir = base; ; dir = dirname(dir)) {
    const pkgDir = join(dir, "node_modules", name)
    const pkgJsonPath = join(pkgDir, "package.json")
    if (existsSync(pkgJsonPath)) {
      const pkg = JSON.parse(readFileSync(pkgJsonPath, "utf8"))
      const exportKey = subpath ? `.${subpath}` : "."
      const entry = pkg.exports?.[exportKey]
      const target =
        (typeof entry === "string" ? entry : entry?.style ?? entry?.import ?? entry?.default) ??
        (subpath ? `.${subpath}` : pkg.style ?? pkg.main)
      if (!target) throw new Error(`consumer-css: ${id} の CSS エントリを解決できません`)
      return join(pkgDir, target)
    }
    if (dirname(dir) === dir) throw new Error(`consumer-css: ${id} が node_modules に見つかりません（base: ${base}）`)
  }
}

/**
 * Tailwind の loadStylesheet 実装。tailwindcss 本体だけは index.css を明示する
 * （exports の style 条件が index.css を指すが、サブパスも同じ規則で解決できる）。
 * @param {(path: string) => string} [read] 読み込みの差し替え（生成中ファイルを空扱いにする等）
 */
export function consumerLoadStylesheet(read = (p) => readFileSync(p, "utf8")) {
  return async (id, base) => {
    const path = id.startsWith(".") || id.startsWith("/") ? resolve(base, id) : resolvePackageStylesheet(id, base)
    return { path, base: dirname(path), content: read(path) }
  }
}

const SRC = join(ROOT, "src")

/** consumer 入口で読み込んだ design system（candidatesToCss で候補ごとの CSS 有無を見られる） */
export function loadConsumerDesignSystem({ read } = {}) {
  return __unstable__loadDesignSystem(CONSUMER_ENTRY, { base: SRC, loadStylesheet: consumerLoadStylesheet(read) })
}

/** consumer 入口でコンパイルし、候補から CSS を生成する */
export async function buildConsumerCss(candidates, { read } = {}) {
  const compiled = await compile(CONSUMER_ENTRY, { base: SRC, loadStylesheet: consumerLoadStylesheet(read) })
  return compiled.build(candidates)
}

/** src/styles/source-safelist.css から `@source inline("…")` の候補を取り出す */
export function readSafelistCandidates(path = join(SRC, "styles/source-safelist.css")) {
  const css = readFileSync(path, "utf8")
  // 引用符は formatInlineSource（scripts/lib/source-safelist-format.mjs）と同じ規則:
  // 候補に `"` を含むときだけ `'` で囲み、エスケープはしない。
  return [...css.matchAll(/^@source inline\((["'])(.*)\1\);$/gm)].map((m) => m[2])
}
