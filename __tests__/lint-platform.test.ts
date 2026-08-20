/**
 * appliesTo / プラットフォーム判定（issue #391）
 *
 * DS は native/ui にもコンポーネントを出荷しているが、contracts/rules.json の
 * ルールの多くは Tailwind / Web DOM 前提で書かれている。`appliesTo` は定義済み
 * だったのに bin/lint.js が一度も参照しておらず、RN consumer（aikoibito mobile）で
 * P032 が 76 件すべて誤検知していた（`borderColor: colors.border,` の `.border` に
 * 反応する。RN に Tailwind クラスは存在しない）。
 *
 * ここでは (a) native 判定で web 専用ルールが飛ぶこと (b) StyleSheet.create も
 * シグナルになること (c) --platform で上書きできること (d) appliesTo 未指定は
 * 両方に当たること (e) 既存の ["*.css"] の挙動が変わらないこと を固定する。
 */
import { describe, expect, it, vi } from "vitest"
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { spawnSync } from "node:child_process"

import { detectPlatform, ruleAppliesTo } from "../bin/lint.js"

// CLI を子プロセスで起動するテストが多く、1 件あたり数秒かかる（P049 の契約読み込みで
// DS の CSS を全部読むため）。既定の 5s では 2 回起動するケースが落ちる。
vi.setConfig({ testTimeout: 60_000 })

type Finding = { ruleId: string; file: string; line: number; fix: string }

/** tmpdir に 1 ファイル置いて公開 CLI を JSON で回す */
function runLint(fileName: string, source: string, extraArgs: string[] = []): Finding[] {
  const dir = mkdtempSync(join(tmpdir(), "ksk-ds-platform-"))
  const srcDir = join(dir, "src")
  mkdirSync(srcDir)
  const file = join(srcDir, fileName)
  writeFileSync(file, source)
  const result = spawnSync(
    process.execPath,
    ["bin/init.js", "lint", file, "--format", "json", ...extraArgs],
    { cwd: process.cwd(), encoding: "utf8" },
  )
  return JSON.parse(result.stdout).results as Finding[]
}

const ruleIds = (findings: Finding[]) => new Set(findings.map((f) => f.ruleId))

/** RN の実コード。aikoibito mobile で P032 が 76 件出ていた形をそのまま持つ */
const NATIVE_SOURCE = `
import { StyleSheet, View } from "react-native"

const colors = { border: "#E5E7EB", surface: "#FFFFFF" }

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#F3F4F6",
  },
})

export function Card() {
  return <View style={styles.card} />
}
`

describe("プラットフォーム判定（detectPlatform）", () => {
  it("*.native.tsx は native", () => {
    expect(detectPlatform("src/Card.native.tsx", "export const a = 1")).toBe("native")
    expect(detectPlatform("src/Card.native.ts", "")).toBe("native")
  })

  it("react-native / ksk-design-system/native の import は native", () => {
    expect(detectPlatform("src/Card.tsx", `import { View } from "react-native"`)).toBe("native")
    expect(detectPlatform("src/Card.tsx", `import { View } from 'react-native'`)).toBe("native")
    expect(detectPlatform("src/Card.tsx", `import { Button } from "ksk-design-system/native"`)).toBe("native")
  })

  it("StyleSheet.create の使用も native シグナル", () => {
    expect(detectPlatform("src/Card.tsx", "const s = StyleSheet.create({})")).toBe("native")
  })

  it("シグナルが無ければ web にフォールバックする（後方互換）", () => {
    expect(detectPlatform("src/Card.tsx", `import { Button } from "ksk-design-system"`)).toBe("web")
  })

  it("--platform の上書きはファイル判定より優先される", () => {
    expect(detectPlatform("src/Card.native.tsx", NATIVE_SOURCE, "web")).toBe("web")
    expect(detectPlatform("src/Card.tsx", "export const a = 1", "native")).toBe("native")
  })
})

describe("appliesTo の解釈（ruleAppliesTo）", () => {
  it("未指定は全プラットフォーム対象", () => {
    for (const platform of ["web", "native"]) {
      expect(ruleAppliesTo({}, { platform, filePath: "src/a.tsx" })).toBe(true)
      expect(ruleAppliesTo({ appliesTo: [] }, { platform, filePath: "src/a.tsx" })).toBe(true)
    }
  })

  it("プラットフォーム識別子で絞り込む", () => {
    const rule = { appliesTo: ["web"] }
    expect(ruleAppliesTo(rule, { platform: "web", filePath: "src/a.tsx" })).toBe(true)
    expect(ruleAppliesTo(rule, { platform: "native", filePath: "src/a.tsx" })).toBe(false)
  })

  it("グロブはパス全体と basename の両方に当てる", () => {
    const rule = { appliesTo: ["*.css"] }
    expect(ruleAppliesTo(rule, { platform: "web", filePath: "src/styles/theme.css" })).toBe(true)
    expect(ruleAppliesTo(rule, { platform: "native", filePath: "theme.css" })).toBe(true)
    expect(ruleAppliesTo(rule, { platform: "web", filePath: "src/a.tsx" })).toBe(false)
  })

  it("識別子とグロブの混在は OR で評価する", () => {
    const rule = { appliesTo: ["native", "*.css"] }
    expect(ruleAppliesTo(rule, { platform: "native", filePath: "src/a.tsx" })).toBe(true)
    expect(ruleAppliesTo(rule, { platform: "web", filePath: "src/a.css" })).toBe(true)
    expect(ruleAppliesTo(rule, { platform: "web", filePath: "src/a.tsx" })).toBe(false)
  })
})

describe("lint CLI のプラットフォーム分岐", () => {
  // (a) .native.tsx が web 専用ルールをスキップする
  it("*.native.tsx では web 専用ルール（P032 / P001）を報告しない", () => {
    const findings = runLint(
      "Card.native.tsx",
      `${NATIVE_SOURCE}\nexport const raw = <button className="text-blue-500 border" />\n`,
    )
    const ids = ruleIds(findings)
    expect(ids.has("P032")).toBe(false)
    expect(ids.has("P001")).toBe(false)
    expect(ids.has("P009")).toBe(false)
  })

  // (b) StyleSheet.create を含む素の .tsx も native 判定
  it("StyleSheet.create を含む .tsx も native 扱いで P032 を出さない", () => {
    const findings = runLint("Card.tsx", NATIVE_SOURCE)
    expect(ruleIds(findings).has("P032")).toBe(false)
  })

  it("同じソースでも web ファイルなら P032 は従来どおり検出する（対照）", () => {
    const findings = runLint(
      "Card.tsx",
      `export const Card = () => <div className="border rounded-lg p-3">A</div>\n`,
    )
    expect(ruleIds(findings).has("P032")).toBe(true)
  })

  // (c) --platform web で強制上書き
  it("--platform web は .native.tsx でも web ルールを適用する", () => {
    const findings = runLint(
      "Card.native.tsx",
      `export const Card = () => <div className="border rounded-lg p-3">A</div>\n`,
      ["--platform", "web"],
    )
    expect(ruleIds(findings).has("P032")).toBe(true)
  })

  it("--platform native は web ファイルでも web ルールを外す", () => {
    const findings = runLint(
      "Card.tsx",
      `export const Card = () => <div className="border rounded-lg p-3">A</div>\n`,
      ["--platform=native"],
    )
    expect(ruleIds(findings).has("P032")).toBe(false)
  })

  it("--platform に未知の値を渡したらエラーにする", () => {
    const dir = mkdtempSync(join(tmpdir(), "ksk-ds-platform-"))
    writeFileSync(join(dir, "Card.tsx"), "export const a = 1\n")
    const result = spawnSync(
      process.execPath,
      ["bin/init.js", "lint", dir, "--platform", "ios"],
      { cwd: process.cwd(), encoding: "utf8" },
    )
    expect(result.status).toBe(1)
    expect(result.stderr).toContain("--platform")
  })

  // (d) appliesTo 未指定のルールは両プラットフォームに適用される
  it("appliesTo 未指定の P008（HEX 直書き）は web でも native でも検出する", () => {
    const web = runLint("Card.tsx", `export const c = "#3B82F6"\n`)
    const native = runLint("Card.native.tsx", `export const c = "#3B82F6"\n`)
    expect(ruleIds(web).has("P008")).toBe(true)
    expect(ruleIds(native).has("P008")).toBe(true)
  })

  it("native では P008 の fix 文言が fixNative に差し替わる", () => {
    const web = runLint("Card.tsx", `export const c = "#3B82F6"\n`)
    const native = runLint("Card.native.tsx", `export const c = "#3B82F6"\n`)
    expect(web.find((f) => f.ruleId === "P008")?.fix).toContain("var(--...)")
    expect(native.find((f) => f.ruleId === "P008")?.fix).toContain("ksk-design-system/native")
    expect(native.find((f) => f.ruleId === "P008")?.fix).not.toContain("var(--...)")
  })

  // (e) 既存の ["*.css"]（P049）の挙動は不変
  it("P049 は .css に当たり続ける（--platform native でも変わらない）", () => {
    const bundled = ":root{--Hover-Primary-Button:#123456}"
    for (const args of [[], ["--platform", "native"]]) {
      const findings = runLint("theme.css", bundled, args)
      expect(ruleIds(findings).has("P049")).toBe(true)
    }
  })

  it("P049 は .tsx には当たらない", () => {
    const findings = runLint("Card.tsx", `export const s = "--Hover-Primary-Button: #123456"\n`)
    expect(ruleIds(findings).has("P049")).toBe(false)
  })
})
