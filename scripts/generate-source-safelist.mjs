#!/usr/bin/env node
/**
 * DS 内部ユーティリティの safelist 生成スクリプト（issue #258）
 *
 * 背景:
 *   DS は minified な dist を配布し、消費側 Tailwind v4 は
 *   `@source "../node_modules/ksk-design-system/dist"` で dist を走査して
 *   ユーティリティ CSS を生成する。この @source が無い / パスがずれている /
 *   スキャナが dist を辿れない（symlink・monorepo・別バンドラ等）と、
 *   DS 内部でしか出現しないクラス（`pointer-events-auto` 等）の CSS が
 *   消費側で生成されず、開発環境（Storybook）では正常なのに消費側でだけ壊れる。
 *   #132/#134 → #138 → #143 と3回、個別コンポーネントの書き換えで対症療法した。
 *
 * 対策:
 *   DS が実際に使うユーティリティを build 時に抽出し、
 *   `@source inline("…")` 形式の safelist として src/styles/source-safelist.css に
 *   生成して preset.css から読み込む。消費側は preset を @import するだけなので
 *   **消費側の設定変更なしに** DS 内部クラスの生成が保証される。
 *
 * 追加のガード:
 *   `bg-${x}` のような動的クラス名合成は静的抽出では原理的に拾えないため、
 *   safelist に載らない。DS の実ユーティリティ接頭辞を使った動的合成を検出して
 *   エラーにする（--check / 生成の両方で検査）。
 *
 * Usage:
 *   node scripts/generate-source-safelist.mjs          # 生成
 *   node scripts/generate-source-safelist.mjs --check  # 差分があれば exit 1（CI 用）
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs"
import { dirname, join, relative } from "node:path"
import { fileURLToPath } from "node:url"
import { Scanner } from "@tailwindcss/oxide"
import { __unstable__loadDesignSystem } from "tailwindcss"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const OUT_PATH = join(ROOT, "src/styles/source-safelist.css")
const CHECK = process.argv.includes("--check")

/**
 * 走査対象 = dist に同梱される Web 側ソース。
 * .stories.tsx / src/native（RN。Tailwind を使わない）/ prototypes は除外する。
 */
const SOURCES = [
  { base: join(ROOT, "src/components"), pattern: "**/*.{ts,tsx}", negated: false },
  { base: join(ROOT, "src/components"), pattern: "**/*.stories.tsx", negated: true },
  { base: join(ROOT, "src/lib"), pattern: "**/*.ts", negated: false },
  { base: join(ROOT, "src"), pattern: "class-names.ts", negated: false },
  { base: join(ROOT, "src"), pattern: "index.ts", negated: false },
]

/** `@source inline()` に安全に書けない候補（波括弧はブレース展開、二重引用符は区切り） */
const UNSAFE = /[{}"]/

async function loadDesignSystem() {
  const css = readFileSync(join(ROOT, "src/index.css"), "utf8")
  return __unstable__loadDesignSystem(css, {
    base: join(ROOT, "src"),
    loadStylesheet: async (id, base) => {
      const resolve = (p) => ({ path: p, base: dirname(p), content: readFileSync(p, "utf8") })
      if (id === "tailwindcss") return resolve(join(ROOT, "node_modules/tailwindcss/index.css"))
      if (id === "tw-animate-css") return resolve(join(ROOT, "node_modules/tw-animate-css/dist/tw-animate.css"))
      if (id.startsWith("tailwindcss/")) return resolve(join(ROOT, "node_modules", id))
      return resolve(join(base, id))
    },
    loadModule: async () => {
      throw new Error(`source-safelist: @plugin / @config は未対応です`)
    },
  })
}

/** 実際に CSS を生成する候補だけに絞り込む（識別子・コメント文言などを落とす） */
function filterValid(designSystem, candidates) {
  const compiled = designSystem.candidatesToCss(candidates)
  return candidates.filter((_, i) => compiled[i] != null)
}

/* ─── 動的クラス名合成の検出 ───────────────────────────────
   DS が実際に使うユーティリティの「接頭辞」（`pointer-events-` / `bg-` 等）で
   始まるテンプレートリテラル補間だけを違反とする。`key={`separator-${i}`}` の
   ような非ユーティリティ文字列は接頭辞集合に無いので誤検出しない。 */
function utilityPrefixes(utilities) {
  const prefixes = new Set()
  for (const u of utilities) {
    // variant（`hover:` 等）と arbitrary は落とし、素の `foo-bar-` 部分だけ拾う
    const bare = u.split(":").pop()
    if (!/^-?[a-z][a-z0-9-]*$/.test(bare)) continue
    const parts = bare.split("-")
    for (let i = 1; i < parts.length; i++) {
      prefixes.add(`${parts.slice(0, i).join("-")}-`)
    }
  }
  return prefixes
}

function collectFiles(dir, filter) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...collectFiles(full, filter))
    else if (filter(entry)) out.push(full)
  }
  return out
}

function findDynamicClassComposition(prefixes) {
  const files = collectFiles(join(ROOT, "src/components"), (n) => /\.tsx?$/.test(n) && !n.endsWith(".stories.tsx"))
  const violations = []
  for (const file of files) {
    const lines = readFileSync(file, "utf8").split("\n")
    lines.forEach((line, i) => {
      if (line.trimStart().startsWith("//") || line.trimStart().startsWith("*")) return
      for (const match of line.matchAll(/`[^`]*?([a-z][a-z0-9-]*-)\$\{/g)) {
        if (prefixes.has(match[1])) {
          violations.push(`${relative(ROOT, file)}:${i + 1}  \`…${match[1]}\${…}\``)
        }
      }
    })
  }
  return violations
}

/* ─── 生成 ─────────────────────────────────────────────── */
const designSystem = await loadDesignSystem()
const scanned = new Scanner({ sources: SOURCES }).scan()
const utilities = filterValid(designSystem, scanned)

const safe = utilities.filter((u) => !UNSAFE.test(u)).sort()
const skipped = utilities.filter((u) => UNSAFE.test(u)).sort()

const dynamic = findDynamicClassComposition(utilityPrefixes(safe))
if (dynamic.length > 0) {
  console.error("✗ 動的なクラス名合成を検出しました（静的抽出できず消費側で CSS が生成されません）")
  for (const v of dynamic) console.error(`  ${v}`)
  console.error("  クラス名は完全な文字列で書き、分岐は三項演算子・cva の variant で表現してください")
  process.exit(1)
}

const header = `/* =============================================================
   KSK Design System — @source safelist（自動生成 / 手で編集しない）

   生成: node scripts/generate-source-safelist.mjs
   検証: node scripts/generate-source-safelist.mjs --check

   DS 内部でしか出現しないユーティリティを消費側の @source スキャンに
   依存せず生成させるための safelist（issue #258）。
   preset.css から読み込まれるため、消費側は追加設定なしで恩恵を受ける。
   ============================================================= */
`

const body = safe.map((u) => `@source inline("${u}");`).join("\n")
const note =
  skipped.length > 0
    ? `\n\n/* @source inline() に安全に書けないため除外（${skipped.length} 件・波括弧/二重引用符を含む）:\n${skipped
        .map((u) => `     ${u}`)
        .join("\n")}\n   これらは消費側の @source によるスキャンに依存する。 */\n`
    : "\n"

const output = `${header}\n${body}\n${note}`

if (CHECK) {
  let existing
  try {
    existing = readFileSync(OUT_PATH, "utf8")
  } catch {
    console.error(`✗ ${relative(ROOT, OUT_PATH)} が存在しません。node scripts/generate-source-safelist.mjs を実行してください`)
    process.exit(1)
  }
  if (existing !== output) {
    console.error("✗ src/styles/source-safelist.css が src の実装と一致していません（差分あり）")
    console.error("  node scripts/generate-source-safelist.mjs を実行して再生成してください")
    const a = existing.split("\n")
    const b = output.split("\n")
    let shown = 0
    for (let i = 0; i < Math.max(a.length, b.length) && shown < 20; i++) {
      if (a[i] !== b[i]) {
        console.error(`  L${i + 1}: - ${a[i] ?? "(なし)"}`)
        console.error(`  L${i + 1}: + ${b[i] ?? "(なし)"}`)
        shown++
      }
    }
    process.exit(1)
  }
  console.log(`✓ src/styles/source-safelist.css は最新です（safelist: ${safe.length} 件 / 除外: ${skipped.length} 件）`)
  process.exit(0)
}

writeFileSync(OUT_PATH, output)
console.log(`✓ src/styles/source-safelist.css を生成しました（safelist: ${safe.length} 件 / 除外: ${skipped.length} 件）`)
