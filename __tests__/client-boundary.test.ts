/**
 * Client Component 境界（"use client" の付き忘れ回帰ガード / issue #360）
 *
 * stract-ui は同じ機能を入れたとき、Portal 系10ファイルの `"use client"` が
 * 抜けたまま main に入り、Next.js App Router の Server Component から import
 * すると `React.createContext is not a function` でビルドが落ちた（stract-ui #104）。
 *
 * KSK DS はファイル単位の directive を使わず、**ビルド時のバナー**で境界を作る
 * （`vite.config.lib.ts` の rollupOptions.output.banner）。
 *   - index チャンク            → `"use client"` を付ける
 *   - class-names / server-variants → React 非依存なのでバナー無し（RSC から import 可）
 *   - native / native/ui        → React Native 向け。RSC の対象外
 *
 * したがって KSK での事故の形は「directive の付け忘れ」ではなく
 * **「フック / createContext を使うモジュールが、バナー無しの web エントリの
 * モジュールグラフへ紛れ込む」**こと。ここではその2点を固定する:
 *
 *   1. banner の分岐が index に `"use client"` を付け続けている
 *   2. banner 無しの web エントリ（class-names / server-variants）から到達する
 *      モジュールが、フックや createContext を一切使っていない
 *
 * usePortalContainer（React.createContext + useContext）を含む portal-container.tsx が
 * うっかり class-names 側へ再 export されると、2 が落ちる。
 */
import { describe, it, expect } from "vitest"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const SRC = path.join(ROOT, "src")

/** バナー無しで配布する web エントリ（RSC から直接 import される想定）。 */
const RSC_SAFE_ENTRIES = [
  path.join(SRC, "class-names.ts"),
  ...fs
    .readdirSync(path.join(SRC, "lib", "server-variants"))
    .filter((f) => /\.tsx?$/.test(f))
    .map((f) => path.join(SRC, "lib", "server-variants", f)),
]

const EXTS = [".ts", ".tsx", "/index.ts", "/index.tsx"]

function resolveImport(spec: string, fromFile: string): string | null {
  let base: string
  if (spec.startsWith("@/")) base = path.join(SRC, spec.slice(2))
  else if (spec.startsWith(".")) base = path.resolve(path.dirname(fromFile), spec)
  else return null // 外部パッケージは対象外
  if (fs.existsSync(base) && fs.statSync(base).isFile()) return base
  for (const ext of EXTS) {
    const candidate = base + ext
    if (fs.existsSync(candidate)) return candidate
  }
  return null
}

/** コメントを除去する。説明文中のフック名を誤検知しないため。 */
function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "")
}

function collectGraph(entries: string[]): string[] {
  const seen = new Set<string>()
  const queue = [...entries]
  while (queue.length > 0) {
    const file = queue.pop()!
    if (seen.has(file)) continue
    seen.add(file)
    const source = stripComments(fs.readFileSync(file, "utf8"))
    const specs = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1])
    for (const spec of specs) {
      const resolved = resolveImport(spec, file)
      if (resolved) queue.push(resolved)
    }
  }
  return [...seen]
}

describe("Client Component 境界", () => {
  it("vite.config.lib.ts の banner が index チャンクに 'use client' を付ける", () => {
    const config = fs.readFileSync(path.join(ROOT, "vite.config.lib.ts"), "utf8")
    expect(config).toContain("banner:")
    expect(config).toContain('\'"use client";\'')
    // バナー除外は React 非依存の web エントリと native のみ。ここに UI コンポーネントの
    // チャンク名が増えたら、そのチャンクは RSC から import すると壊れる。
    for (const excluded of ["class-names", "server-variants", "native", "native/ui"]) {
      expect(config).toContain(`chunk.name === "${excluded}"`)
    }
  })

  it("banner 無しの web エントリからフック / createContext へ到達しない", () => {
    // React の命名規約（フックは use から始まる）に合わせ、任意の use◯◯() を広く見る。
    // 列挙型だと usePortalContainer のような自作フックを取りこぼす（stract-ui #104 の実障害）。
    const hookOrContext = /\buse[A-Z]\w*\(|createContext/
    const graph = collectGraph(RSC_SAFE_ENTRIES)
    const offenders = graph.filter((file) => hookOrContext.test(stripComments(fs.readFileSync(file, "utf8"))))
    expect(
      offenders.map((f) => path.relative(ROOT, f)),
      "banner 無しエントリから到達するモジュールはフック / createContext を使えない"
    ).toEqual([])
  })

  it("portal-container は banner 無しエントリのグラフに含まれない", () => {
    const graph = collectGraph(RSC_SAFE_ENTRIES)
    expect(graph.some((f) => f.endsWith("portal-container.tsx"))).toBe(false)
  })
})
