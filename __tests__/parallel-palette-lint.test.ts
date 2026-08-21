/**
 * P050 — DS を参照しない並行パレットの検出（issue #393）
 *
 * P049 は「DS の名前空間に触れている CSS」しか見ないため、DS を一切使わない
 * 独自パレット（aikoibito/apps/web の --bg / --accent / --surface 等）を持つ
 * consumer には無言だった。P050 がそれを拾えることと、DS 自身の CSS・
 * DS トークンへの委譲・少数の例外変数を誤検知しないことを固定する。
 */
import { describe, expect, it } from "vitest"
import { mkdtempSync, writeFileSync, readFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { spawnSync } from "node:child_process"

import { inspectParallelPaletteCandidates, loadProductThemeContract } from "../bin/product-theme-override.js"

const ROOT = process.cwd()
const contractJson = JSON.parse(
  readFileSync(join(ROOT, "contracts/product-theme-overrides.json"), "utf8"),
) as { dsVariableNamespaces: string[] }
const contract = loadProductThemeContract(contractJson, { pkgRoot: ROOT })

function runLint(css: string) {
  const dir = mkdtempSync(join(tmpdir(), "ksk-ds-p050-"))
  const file = join(dir, "globals.css")
  writeFileSync(file, css)
  return spawnSync("node", [join(ROOT, "bin/init.js"), "lint", file], {
    cwd: dir,
    encoding: "utf8",
  })
}

describe("P050 の判定ロジック", () => {
  it("issue の aikoibito 例相当（10変数の独立パレット）を検出する", () => {
    const css = `:root {
      --bg: #0f0d14;
      --surface: #1a1620;
      --accent: #b46cf0;
      --accent-2: #ff5fa2;
      --border: #2c2733;
      --text: #f5f3f7;
      --text-muted: #a89fb3;
      --danger: #ff4d6d;
      --success: #34d399;
      --warning: #fbbf24;
    }`
    const candidates = inspectParallelPaletteCandidates(css, { namespaces: contract.namespaces })
    expect(candidates.length).toBe(10)
    expect(candidates.map((c) => c.name)).toContain("--bg")
    expect(candidates.map((c) => c.name)).toContain("--accent")
  })

  it("DS トークンを参照しているだけの値はカウントしない", () => {
    const css = `:root {
      --bg: var(--Primitive-Gray-50);
      --surface: var(--Surface-Secondary);
      --accent: var(--Brand-Primary);
      --accent-2: var(--Primitive-Brand-600);
      --border: var(--Border-Low-Emphasis);
      --text: var(--Text-High-Emphasis);
    }`
    const candidates = inspectParallelPaletteCandidates(css, { namespaces: contract.namespaces })
    expect(candidates).toEqual([])
  })

  it("4個以下の例外変数は検出対象にしない（閾値未満）", () => {
    const css = `:root {
      --bg: #0f0d14;
      --accent: #b46cf0;
      --border: #2c2733;
      --brand-logo: #06c755;
    }`
    const candidates = inspectParallelPaletteCandidates(css, { namespaces: contract.namespaces })
    expect(candidates.length).toBe(4)
  })

  it("DS 名前空間に属する変数はカウントしない", () => {
    const css = `:root {
      --Primitive-Brand-500: #3b82f6;
      --Surface-Primary: #ffffff;
      --Text-High-Emphasis: #111111;
      --Border-Low-Emphasis: #e5e7eb;
      --Brand-Primary: #3b82f6;
    }`
    const candidates = inspectParallelPaletteCandidates(css, { namespaces: contract.namespaces })
    expect(candidates).toEqual([])
  })

  it("色値でない値（サイズ・文字列）はカウントしない", () => {
    const css = `:root {
      --header-height: 64px;
      --radius: 8px;
      --font-family: "Inter", sans-serif;
      --z-modal: 100;
      --duration: 200ms;
    }`
    const candidates = inspectParallelPaletteCandidates(css, { namespaces: contract.namespaces })
    expect(candidates).toEqual([])
  })
})

describe("公開 CLI（ksk-ds lint）", () => {
  it("独立パレット（10変数）を warning P050 として報告する", () => {
    const result = runLint(`:root {
      --bg: #0f0d14;
      --surface: #1a1620;
      --accent: #b46cf0;
      --accent-2: #ff5fa2;
      --border: #2c2733;
      --text: #f5f3f7;
      --text-muted: #a89fb3;
      --danger: #ff4d6d;
      --success: #34d399;
      --warning: #fbbf24;
    }`)
    expect(result.stdout).toContain("warning P050")
    expect(result.stdout).toContain("--bg")
  })

  it("DS トークン参照だけの CSS は検出しない", () => {
    const result = runLint(`:root {
      --bg: var(--Primitive-Gray-50);
      --surface: var(--Surface-Secondary);
      --accent: var(--Brand-Primary);
      --accent-2: var(--Primitive-Brand-600);
      --border: var(--Border-Low-Emphasis);
      --text: var(--Text-High-Emphasis);
    }`)
    expect(result.stdout).not.toContain("P050")
    expect(result.status).toBe(0)
  })

  it("4個以下の独自変数は検出しない", () => {
    const result = runLint(`:root {
      --bg: #0f0d14;
      --accent: #b46cf0;
      --border: #2c2733;
      --brand-logo: #06c755;
    }`)
    expect(result.stdout).not.toContain("P050")
    expect(result.status).toBe(0)
  })

  it("DS 自身のトークン定義 CSS は検出しない（issue #407 と同じ判定を再利用）", () => {
    const dsCss = readFileSync(join(ROOT, "src/styles/primitive.css"), "utf8")
    const result = runLint(dsCss)
    expect(result.stdout).not.toContain("P050")
  })

  it("ksk-ds-lint-ignore P050 で抑制できる", () => {
    const result = runLint(`:root {
      /* ksk-ds-lint-ignore P050 -- LINE 風チャット画面の意図的な独立パレット */
      --bg: #0f0d14;
      --surface: #1a1620;
      --accent: #b46cf0;
      --accent-2: #ff5fa2;
      --border: #2c2733;
      --text: #f5f3f7;
    }`)
    expect(result.stdout).not.toContain("P050")
    expect(result.status).toBe(0)
  })

  it("ksk-ds-lint-ignore-file P050 でファイル全体を抑制できる", () => {
    const result = runLint(`/* ksk-ds-lint-ignore-file P050 -- 意図的な独立パレット */
    :root {
      --bg: #0f0d14;
      --surface: #1a1620;
      --accent: #b46cf0;
      --accent-2: #ff5fa2;
      --border: #2c2733;
      --text: #f5f3f7;
    }`)
    expect(result.stdout).not.toContain("P050")
    expect(result.status).toBe(0)
  })
})
