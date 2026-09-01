/**
 * P049 — product theme の許可リスト外の DS 変数上書きを検出する lint（issue #364）
 *
 * 公開 CLI（`npx ksk-ds lint`）が消費プロダクトの CSS を検査できることと、
 * 許可リスト・namespace 定義が DS の実 CSS からドリフトしていないことを固定する。
 */
import { describe, expect, it } from "vitest"
import { mkdtempSync, writeFileSync, readFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { spawnSync } from "node:child_process"

import {
  collectDsDeclaredVariables,
  inspectProductThemeOverrides,
  loadProductThemeContract,
} from "../bin/product-theme-override.js"

const ROOT = process.cwd()
const contractJson = JSON.parse(
  readFileSync(join(ROOT, "contracts/product-theme-overrides.json"), "utf8"),
) as {
  allowedVariables: Record<string, string[]>
  dsVariableNamespaces: string[]
}
/** CLI と同じ条件（DS の CSS を読み、実在する変数だけを違反にする / issue #377） */
const contract = loadProductThemeContract(contractJson, { pkgRoot: ROOT })
/** DS の CSS が読めない環境のフォールバック（接頭辞一致だけで判定する） */
const prefixOnlyContract = loadProductThemeContract(contractJson)

function runLint(css: string) {
  const dir = mkdtempSync(join(tmpdir(), "ksk-ds-p049-"))
  const file = join(dir, "product-theme.css")
  writeFileSync(file, css)
  return spawnSync("node", [join(ROOT, "bin/init.js"), "lint", file], {
    cwd: dir,
    encoding: "utf8",
  })
}

describe("P049 の判定ロジック", () => {
  it("許可された変数の上書きは違反にしない", () => {
    const findings = inspectProductThemeOverrides(
      `:root { --Control-Height-Md: 3rem; --Brand-Primary: #123456; }`,
      contract,
    )
    expect(findings).toEqual([])
  })

  it("許可リスト外の DS 内部変数の上書きを検出する", () => {
    const findings = inspectProductThemeOverrides(
      `:root { --Hover-Primary-Button: red; --Z-Modal: 1; --glass-blur: 2px; }`,
      contract,
    )
    expect(findings.map((f) => f.name)).toEqual([
      "--Hover-Primary-Button",
      "--Z-Modal",
      "--glass-blur",
    ])
  })

  it("消費側アプリ自前の変数は対象外（DS の namespace に該当しない）", () => {
    const findings = inspectProductThemeOverrides(
      `:root { --my-app-header-height: 64px; --primary: #fff; }`,
      contract,
    )
    expect(findings).toEqual([])
  })

  it("var() での参照は宣言ではないので違反にしない", () => {
    const findings = inspectProductThemeOverrides(
      `.a { color: var(--Hover-Primary-Button); background: var(--Z-Modal, 1); }`,
      contract,
    )
    expect(findings).toEqual([])
  })

  it("コメント内の記述を誤検知しない", () => {
    const findings = inspectProductThemeOverrides(
      `/* かつては --Hover-Primary-Button: red; と書いていた */\n:root { color: red; }`,
      contract,
    )
    expect(findings).toEqual([])
  })

  it("Neutral パレット（Gray 10段 + White / Black）の差し替えは違反にしない", () => {
    // Brand 10 行と並ぶ「アイデンティティのパレット層」（issue #377）。
    const css = [
      "--Primitive-Gray-50",
      "--Primitive-Gray-100",
      "--Primitive-Gray-200",
      "--Primitive-Gray-300",
      "--Primitive-Gray-400",
      "--Primitive-Gray-500",
      "--Primitive-Gray-600",
      "--Primitive-Gray-700",
      "--Primitive-Gray-800",
      "--Primitive-Gray-900",
      "--Primitive-White",
      "--Primitive-Black",
    ]
      .map((name) => `  ${name}: #FBF9F8;`)
      .join("\n")
    expect(inspectProductThemeOverrides(`:root {\n${css}\n}`, contract)).toEqual([])
  })

  it("Status の semantic トークンの上書きは違反にしない", () => {
    const css = [
      "--Surface-Caution",
      "--Surface-Caution-Subtle",
      "--Surface-Caution-Strong",
      "--Surface-Success",
      "--Surface-Success-Subtle",
      "--Surface-Warning",
      "--Surface-Info",
      "--Surface-Info-Subtle",
      "--Text-Caution",
      "--Text-Success",
      "--Text-Warning",
      "--Text-Info",
      "--Border-Caution",
      "--Border-Success",
      "--Border-Warning",
      "--Border-Info",
      "--Caution-Base",
      "--Success-Base",
      "--Warning-Base",
      "--Info-Base",
      "--Surface-Inverse",
      "--Text-on-Inverse-Secondary",
      "--Object-on-Inverse",
    ]
      .map((name) => `  ${name}: #3A2F2C;`)
      .join("\n")
    expect(inspectProductThemeOverrides(`:root {\n${css}\n}`, contract)).toEqual([])
  })

  it("statusPalette に載っていない status の primitive は違反（色調整は semantic 層で行う契約）", () => {
    // 方針: primitive を無条件に上書きしてよいのは Brand と Neutral の2パレットだけ。
    // Red-400 は dark の --Text-Caution / --Object-Caution / --Border-Caution を、
    // Orange-700 は light の --Text-Warning / --Warning-Base を駆動するため開けていない。
    const findings = inspectProductThemeOverrides(
      `:root {\n  --Primitive-Red-400: #3A2020;\n  --Primitive-Orange-700: #2F6B4A;\n}`,
      contract,
    )
    expect(findings.map((f) => f.name)).toEqual(["--Primitive-Red-400", "--Primitive-Orange-700"])
  })

  it("statusPalette に載っている段は許可（issue #384）", () => {
    const css = contractJson.allowedVariables.statusPalette
      .map((name: string) => `  ${name}: #123456;`)
      .join("\n")
    expect(inspectProductThemeOverrides(`.dark {\n${css}\n}`, contract)).toEqual([])
  })

  it("DS に存在しない変数は namespace が一致しても違反にしない", () => {
    // --Surface-Inverse-Hover は消費側（belle）が DS の命名に寄せて作った独自変数で、
    // DS には存在しない。上書きではないので P049 の対象外（issue #377）。
    const css = `:root { --Surface-Inverse-Hover: #333; --Text-Brandish-Foo: #444; }`
    expect(inspectProductThemeOverrides(css, contract)).toEqual([])
    // DS の CSS を読めない環境では従来どおり接頭辞一致だけで判定する（フォールバック）
    expect(inspectProductThemeOverrides(css, prefixOnlyContract).map((f) => f.name)).toEqual([
      "--Surface-Inverse-Hover",
      "--Text-Brandish-Foo",
    ])
  })

  it("行番号を正しく返す（コメントで行がずれない）", () => {
    const findings = inspectProductThemeOverrides(
      `/* 1行目\n2行目 */\n:root {\n  --Z-Toast: 5;\n}`,
      contract,
    )
    expect(findings).toEqual([{ line: 4, name: "--Z-Toast" }])
  })
})

describe("公開 CLI（ksk-ds lint）", () => {
  it("消費側 CSS の内部変数上書きを P049 のエラーとして報告する", () => {
    const result = runLint(`:root[data-product="acme"] {\n  --Hover-Primary-Button: #f00;\n}`)
    expect(result.stdout).toContain("error P049")
    expect(result.stdout).toContain("--Hover-Primary-Button")
    expect(result.status).toBe(1)
  })

  it("許可リスト内だけの上書きは通す", () => {
    const result = runLint(
      `:root {\n  --Control-Height-Md: 3rem;\n  --Field-Radius: 0;\n  --Product-Card-Padding: 1rem;\n}`,
    )
    expect(result.stdout).not.toContain("P049")
    expect(result.status).toBe(0)
  })

  it("Neutral パレットと Status semantic の上書きを通す", () => {
    const result = runLint(
      `:root {\n  --Primitive-Gray-50: #FBF9F8;\n  --Primitive-Gray-900: #1C1A1A;\n  --Primitive-White: #FFFDFC;\n  --Surface-Caution: #3A2020;\n  --Surface-Inverse-Hover: #333;\n}`,
    )
    expect(result.stdout).not.toContain("P049")
    expect(result.status).toBe(0)
  })

  it("statusPalette 外の status primitive 上書きは P049 のエラーとして報告する", () => {
    const result = runLint(`:root {\n  --Primitive-Red-400: #3A2020;\n}`)
    expect(result.stdout).toContain("error P049")
    expect(result.stdout).toContain("--Primitive-Red-400")
    expect(result.status).toBe(1)
  })

  it("CSS には TSX 向けの正規表現ルールを当てない（誤検知しない）", () => {
    // P008（HEX 直書き）は .tsx 向け。CSS に色を書くのは当然なので流してはいけない。
    const result = runLint(`:root {\n  --my-app-accent: #3B82F6;\n}`)
    expect(result.stdout).toContain("違反は見つかりませんでした")
    expect(result.status).toBe(0)
  })
})

describe("契約のドリフト検査", () => {
  /** DS が実際に宣言している CSS 変数名（lint 本体と同じ収集器を使う） */
  function declaredVariables(): string[] {
    const names = collectDsDeclaredVariables(ROOT)
    expect(names, "DS の CSS 変数を収集できませんでした").not.toBeNull()
    return [...names!]
  }

  it("primitive の公開は Brand / Neutral の2パレットと statusPalette の個別段だけ", () => {
    // 方針（issue #377）: status 系の色調整は原則 semantic 層で行う。primitive を開けると
    // 上書き箇所が増え、DS 側が primitive の割り当てを変えたときに壊れる。
    // 例外（issue #384）: 消費側が DS の primitive を自分の Tailwind alias（@theme inline）の
    // 実体として使っている場合、生成ユーティリティに var(--Primitive-*) が直接展開されるため
    // semantic 経由の経路が無い。その用途に限り statusPalette として1段ずつ開ける。
    // パレット全段は開けない（accent 段は dark の DS semantic も駆動するため）。
    const primitives = [...contract.allowed].filter((name) => name.startsWith("--Primitive-"))
    const unexpected = primitives.filter(
      (name) => !/^--Primitive-(Brand-\d+|Gray-\d+|White|Black)$/.test(name),
    )
    expect([...unexpected].sort()).toEqual([...contractJson.allowedVariables.statusPalette].sort())
    expect(contractJson.allowedVariables.neutralPalette).toHaveLength(12)
  })

  it("statusPalette の tint 段（-50）は DS の .dark ブロックが参照していない", () => {
    // -50 を dark で上書きしても DS コンポーネントに影響しない、という公開の前提条件。
    // dark の Surface-Caution/Success/Warning/Info は -900 と実値で組んであるので、
    // ここが崩れたら（dark が -50 を参照し始めたら）公開の根拠が消える。
    const css = readFileSync(join(ROOT, "src/styles/semantic.css"), "utf8")
    const darkAt = css.indexOf(".dark {")
    expect(darkAt, ".dark ブロックが見つかりません").toBeGreaterThan(-1)
    const darkBlock = css.slice(darkAt)
    const tintSteps = contractJson.allowedVariables.statusPalette.filter((n) => n.endsWith("-50"))
    expect(tintSteps.length).toBeGreaterThan(0)
    const referenced = tintSteps.filter((name) => darkBlock.includes(`var(${name})`))
    expect(referenced).toEqual([])
  })

  it("PascalCase の DS 変数はすべて dsVariableNamespaces のどれかに属する", () => {
    // ここが漏れると、その namespace の変数は消費側が自由に上書きしても P049 が黙る。
    const orphans = declaredVariables()
      .filter((name) => /^--[A-Z]/.test(name))
      .filter((name) => !contractJson.dsVariableNamespaces.some((p) => name.startsWith(p)))
    expect(orphans).toEqual([])
  })

  it("許可リストの変数はすべて DS が実際に宣言している（存在しない変数を公開しない）", () => {
    const declared = new Set(declaredVariables())
    // 「宣言されていたら効く」シームは既定宣言を持たない。
    // --card-surface は card.tsx 側で参照。--Nav-*-Surface / -Border / -Shadow は
    // DS 既定が tone / dark で出し分ける素材のため単一の :root 値に畳めず、
    // src/styles/bottom-nav.css が var(--Nav-*, <DS 既定>) の形で受ける（issue #471）。
    // --Nav-Pill-Surface / -Backdrop / -Border / -Shadow / -Specular も同じ理由
    // （既定は .glass / tone="inverse" は .glass-dark、issue #486）。
    const seams = new Set([
      "--card-surface",
      "--Nav-Center-Action-Surface",
      "--Nav-Center-Action-Border",
      "--Nav-Center-Action-Shadow",
      "--Nav-Selected-Surface",
      "--Nav-Selected-Shadow",
      "--Nav-Pill-Surface",
      "--Nav-Pill-Backdrop",
      "--Nav-Pill-Border",
      "--Nav-Pill-Shadow",
      "--Nav-Pill-Specular",
    ])
    const missing = [...contract.allowed].filter((name) => !declared.has(name) && !seams.has(name))
    expect(missing).toEqual([])
  })
})
