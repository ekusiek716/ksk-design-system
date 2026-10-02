/**
 * P053 — @layer 外のグローバル CSS が DS 部品の形を変える
 *
 * layer 外の宣言は @layer utilities の DS / Tailwind クラスに詳細度と無関係に勝つ。
 * belle-todo（2026-10-01）で [role="radio"] の min-height・:focus-visible の border-radius・
 * nav の safe-area padding が DS 部品を壊した件の再発防止。layer の中や DS を明示的に
 * 外したセレクタを誤検知しないことも固定する。
 */
import { describe, expect, it } from "vitest"
import { mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { spawnSync } from "node:child_process"

import { inspectUnlayeredGlobalOverrides, splitSelectors } from "../bin/unlayered-global-override.js"

describe("P053 unlayered-global-override: 検出する", () => {
  it.each([
    ["role セレクタの min-height", `[role="radio"] { min-height: 44px; }`, "min-height"],
    [":focus-visible の outline", `:focus-visible { outline: 2px solid red; }`, "outline"],
    ["タグ + 疑似クラスの border-radius", `input:focus-visible { border-radius: 16px; }`, "border-radius"],
    ["タグの padding-bottom", `nav { padding-bottom: env(safe-area-inset-bottom); }`, "padding-bottom"],
    ["@media / @supports の中（layer ではない）", `@supports (padding: 0) { nav { padding: 0; } }`, "padding"],
  ])("%s", (_label, css, property) => {
    const findings = inspectUnlayeredGlobalOverrides(css)
    expect(findings).toHaveLength(1)
    expect(findings[0].property).toBe(property)
  })

  it("行番号はセレクタの行（コメントを挟んでも保つ）", () => {
    const [finding] = inspectUnlayeredGlobalOverrides(`/* a\n   b */\n\na {\n  min-height: 44px;\n}\n`)
    expect(finding.line).toBe(4)
  })
})

describe("P053 unlayered-global-override: 検出しない", () => {
  it.each([
    ["@layer base の中", `@layer base { :focus-visible { outline: 2px solid red; } }`],
    ["@layer の中の @media の中", `@layer base { @media (hover: hover) { button { padding: 0; } } }`],
    ["@theme の中", `@theme { --radius-lg: 12px; }`],
    [":not([data-slot]) で DS を外す", `a:not([data-slot]) { min-height: 44px; }`],
    ["data-slot を明示的に狙う", `[data-slot="bottom-nav-item"] { height: 48px; }`],
    [":is() の中のカンマ + data-slot", `[data-slot="bottom-tab-bar"] :is(a, button):focus-visible { outline: none; }`],
    ["クラス起点（消費側の独自クラス）", `.fluid-px { padding-left: 1rem; }`],
    ["html / body / :root / *", `html { font-size: 16px; } body { line-height: 1.5; } :root { --x: 1; } * { outline: none; }`],
    ["keyframes", `@keyframes k { from { height: 0; } to { height: 10px; } }`],
    ["形に関係ないプロパティ", `button { user-select: none; cursor: pointer; }`],
    ["カスタムプロパティの名前に padding を含む", `a { --padding-x: 4px; }`],
  ])("%s", (_label, css) => {
    expect(inspectUnlayeredGlobalOverrides(css)).toEqual([])
  })

  it("splitSelectors は括弧内のカンマで分けない", () => {
    expect(splitSelectors(`a, [x="1,2"], :is(b, c) d`)).toEqual(["a", `[x="1,2"]`, ":is(b, c) d"])
  })
})

describe("P053 公開 CLI", () => {
  function runLint(css: string) {
    const dir = mkdtempSync(join(tmpdir(), "ksk-ds-p053-"))
    const file = join(dir, "globals.css")
    writeFileSync(file, css)
    return spawnSync("node", [join(process.cwd(), "bin/init.js"), "lint", file], { cwd: dir, encoding: "utf8" })
  }

  it("warning P053 としてセレクタとプロパティを添えて報告する", () => {
    const result = runLint(`[role="radio"] { min-height: 44px; }\n`)
    expect(result.status).toBe(0)
    expect(result.stdout).toContain("warning P053")
    expect(result.stdout).toContain(`[role="radio"] { min-height }`)
  })

  it("ksk-ds-lint-ignore P053 -- 理由 で外せる", () => {
    const result = runLint(`/* ksk-ds-lint-ignore P053 -- 印刷用にタグ単位で余白を消す */\nbutton { padding: 0; }\n`)
    expect(result.status).toBe(0)
    expect(result.stdout).not.toContain("P053")
  })
})
