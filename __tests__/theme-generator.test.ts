import { describe, expect, it } from "vitest"
import { mkdtempSync, readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { spawnSync } from "node:child_process"
import {
  SHADES,
  checkThemeCss,
  clampChroma,
  contrastRatio,
  generateTheme,
  hexToOklch,
  linearRgbToOklab,
  loadThemeContext,
  normalizeHex,
  oklabToLinearRgb,
  oklchToHex,
  parseBrandRampFromCss,
  renderThemeCss,
} from "../bin/theme.js"

// `npx ksk-ds theme`（bin/theme.js）: ブランド色 1 色から Brand ランプを生成して検査する。

const ROOT = process.cwd()
const ctx = loadThemeContext(ROOT)

function runCli(args: string[]) {
  return spawnSync(process.execPath, [join(ROOT, "bin/init.js"), "theme", ...args], {
    cwd: ROOT,
    encoding: "utf8",
  })
}

describe("色変換", () => {
  it("検査の前提は semantic.css から読めている（フォールバックではない）", () => {
    expect(ctx.source).toBe("semantic.css")
    expect(ctx.lightSurface).toBe("#FFFFFF")
    expect(ctx.darkSurface).toBe("#18181B")
  })

  it("OKLab の往復誤差が小さい（linear sRGB → OKLab → linear sRGB）", () => {
    for (const rgb of [
      [0, 0, 0],
      [1, 1, 1],
      [0.2, 0.5, 0.9],
      [0.9, 0.1, 0.05],
      [0.03, 0.8, 0.3],
    ] as [number, number, number][]) {
      const back = oklabToLinearRgb(linearRgbToOklab(rgb))
      back.forEach((v, i) => expect(Math.abs(v - rgb[i])).toBeLessThan(1e-6))
    }
  })

  it("hex → OKLCH → hex の往復で元の色に戻る（色域内の色）", () => {
    for (const hex of ["#3B82F6", "#16A34A", "#7C3AED", "#FACC15", "#0EA5E9", "#E04B00", "#808080", "#FFFFFF", "#000000"]) {
      const { l, c, h } = hexToOklch(hex)
      expect(oklchToHex(l, c, h)).toBe(hex)
    }
  })

  it("既知の値: 白は L=1 / 黒は L=0 / 無彩色は C≒0", () => {
    expect(hexToOklch("#FFFFFF").l).toBeCloseTo(1, 3)
    expect(hexToOklch("#000000").l).toBeCloseTo(0, 3)
    expect(hexToOklch("#808080").c).toBeLessThan(1e-3)
  })

  it("色域外の彩度は縮められ、色相と明度は保たれる", () => {
    const { l, h } = hexToOklch("#3B82F6")
    const clamped = clampChroma(l, 0.6, h)
    expect(clamped).toBeLessThan(0.6)
    const hex = oklchToHex(l, 0.6, h)
    expect(hexToOklch(hex).l).toBeCloseTo(l, 1)
    expect(Math.abs(hexToOklch(hex).h - h)).toBeLessThan(6)
  })

  it("WCAG コントラスト比: 黒白は 21、同色は 1", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 5)
    expect(contrastRatio("#3B82F6", "#3B82F6")).toBeCloseTo(1, 5)
  })

  it("hex の正規化（3 桁・# 無し・小文字・不正）", () => {
    expect(normalizeHex("#abc")).toBe("#AABBCC")
    expect(normalizeHex("0ea5e9")).toBe("#0EA5E9")
    expect(normalizeHex("#12345")).toBeNull()
    expect(normalizeHex("blue")).toBeNull()
  })
})

describe("generateTheme", () => {
  const inputs = ["#3B82F6", "#16A34A", "#7C3AED", "#0EA5E9", "#E04B00", "#1E3A8A", "#EF4444"]

  it.each(inputs)("%s: Brand-500 が入力と一致し、50〜900 の 10 段が揃う", (hex) => {
    const result = generateTheme(hex, { ctx })
    expect(result.ramp[500]).toBe(hex)
    expect(Object.keys(result.ramp).map(Number)).toEqual(SHADES)
    for (const shade of SHADES) expect(result.ramp[shade]).toMatch(/^#[0-9A-F]{6}$/)
  })

  it.each(inputs)("%s: 明度が 50 → 900 で単調に下がる", (hex) => {
    const result = generateTheme(hex, { ctx })
    const lightness = SHADES.map((shade) => hexToOklch(result.ramp[shade]).l)
    for (let i = 1; i < lightness.length; i++) expect(lightness[i]).toBeLessThan(lightness[i - 1])
    expect(result.warnings.filter((w) => w.includes("明度が下がっていません"))).toEqual([])
  })

  it.each(inputs)("%s: 色相がブランド色から大きくずれない（彩度のあるシェードのみ）", (hex) => {
    const result = generateTheme(hex, { ctx })
    const base = hexToOklch(hex).h
    for (const shade of [200, 300, 400, 600, 700, 800]) {
      const { c, h } = hexToOklch(result.ramp[shade])
      if (c < 0.03) continue
      const diff = Math.min(Math.abs(h - base), 360 - Math.abs(h - base))
      expect(diff).toBeLessThan(12)
    }
  })

  it.each(inputs)("%s: 必須ペアは全て通過し、ライトの 600 は白文字 AA を満たす", (hex) => {
    const result = generateTheme(hex, { ctx })
    expect(result.ok).toBe(true)
    expect(contrastRatio("#FFFFFF", result.ramp[600])).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(result.ramp[400], ctx.darkSurface)).toBeGreaterThanOrEqual(4.5)
    for (const c of result.checks.filter((x: { level: string }) => x.level === "error")) expect(c.pass).toBe(true)
  })

  it("明るい黄色 #FACC15: 600 が自動補正されて AA を満たし、警告が出る", () => {
    const result = generateTheme("#FACC15", { ctx })
    expect(result.ramp[500]).toBe("#FACC15")
    const fix = result.corrections.find((c: { shade: number; reason: string }) => c.shade === 600 && c.reason === "contrast")
    expect(fix).toBeDefined()
    expect(contrastRatio("#FFFFFF", fix.from)).toBeLessThan(4.5)
    expect(contrastRatio("#FFFFFF", result.ramp[600])).toBeGreaterThanOrEqual(4.5)
    expect(result.warnings.some((w: string) => w.includes("Brand-600 を"))).toBe(true)
    // 700〜900 は連動して 600 より暗いまま
    const lightness = SHADES.map((shade) => hexToOklch(result.ramp[shade]).l)
    expect(lightness[6]).toBeGreaterThan(lightness[7])
    expect(lightness[7]).toBeGreaterThan(lightness[8])
    expect(lightness[8]).toBeGreaterThan(lightness[9])
    expect(result.ok).toBe(true)
  })

  it("500 が明るい色ではフォーカスリング 3:1 は注意表示になり、必須ペアには含まれない", () => {
    const result = generateTheme("#FACC15", { ctx })
    const focus = result.checks.find((c: { id: string }) => c.id === "light-focus-400")
    expect(focus.level).toBe("advisory")
    expect(focus.pass).toBe(false)
  })

  it("暗めの色では 400 がダークとフォーカスを両立する明度へ補正される", () => {
    const result = generateTheme("#3B82F6", { ctx })
    const focus = result.checks.find((c: { id: string }) => c.id === "light-focus-400")
    expect(focus.pass).toBe(true)
    expect(result.corrections.some((c: { shade: number }) => c.shade === 400)).toBe(true)
  })

  it("暗い入力（#1E3A8A）でも 400 が 500 より明るく、600〜900 は 500 より暗い", () => {
    const result = generateTheme("#1E3A8A", { ctx })
    const lightness = Object.fromEntries(SHADES.map((s) => [s, hexToOklch(result.ramp[s]).l]))
    expect(lightness[400]).toBeGreaterThan(lightness[500])
    expect(lightness[600]).toBeLessThan(lightness[500])
  })

  it("不正な hex は例外", () => {
    expect(() => generateTheme("nope", { ctx })).toThrow(/色の形式が不正/)
  })

  it("生成 CSS は @theme に 10 行並び、parseBrandRampFromCss で読み戻せる", () => {
    const result = generateTheme("#0EA5E9", { ctx })
    const css = renderThemeCss(result, { name: "sky", command: 'npx ksk-ds theme "#0EA5E9" --name sky' })
    expect(css).toContain("@theme {")
    expect(css).toContain('生成元: #0EA5E9')
    expect(css).toContain('npx ksk-ds theme "#0EA5E9" --name sky')
    expect(css).toContain('@import "./themes/sky.css";')
    // 先頭コメントの途中に `*/` が混ざっていない（コメントを壊さない）
    expect(css.split("*/").length).toBe(2)
    expect(parseBrandRampFromCss(css)).toEqual(Object.fromEntries(SHADES.map((s) => [String(s), result.ramp[s]])))
  })
})

describe("--check（checkThemeCss）", () => {
  it("リポジトリ内の green.css を解析できる", () => {
    const css = readFileSync(join(ROOT, "src/themes/green.css"), "utf8")
    const result = checkThemeCss(css, ctx)
    expect(result.error).toBeUndefined()
    expect(result.ramp[500]).toBe("#16A34A")
    expect(result.checks.length).toBeGreaterThan(5)
  })

  it("リポジトリ内の全テーマ（default は primitive.css）で必須ペアが通る", () => {
    const files = readdirSync(join(ROOT, "src/themes"))
      .filter((f: string) => f.endsWith(".css") && f !== "default.css")
      .map((f: string) => join(ROOT, "src/themes", f))
    files.push(join(ROOT, "src/styles/primitive.css"))
    expect(files.length).toBeGreaterThanOrEqual(6)
    for (const file of files) {
      const result = checkThemeCss(readFileSync(file, "utf8"), ctx)
      expect(result.error, file).toBeUndefined()
      const failing = result.checks.filter((c: { level: string; pass: boolean }) => c.level === "error" && !c.pass)
      expect(failing.map((c: { label: string }) => c.label), file).toEqual([])
    }
  })

  it("10 段が揃っていない CSS はエラーを返す", () => {
    expect(checkThemeCss("@theme { --Primitive-Brand-500: #3B82F6; }", ctx).error).toMatch(/見つかりません/)
  })

  it("600 が白文字 AA 未満のテーマは必須ペア未達になる", () => {
    const css = readFileSync(join(ROOT, "src/themes/green.css"), "utf8").replace(/(--Primitive-Brand-600:\s*)#[0-9A-Fa-f]{6}/, "$1#FACC15")
    const result = checkThemeCss(css, ctx)
    expect(result.ok).toBe(false)
  })
})

describe("CLI（子プロセス）", () => {
  it("theme <hex> は CSS を stdout に出して exit 0", () => {
    const r = runCli(["#0EA5E9", "--name", "sky"])
    expect(r.status).toBe(0)
    expect(r.stdout).toContain("@theme {")
    expect(r.stdout).toContain("--Primitive-Brand-500: #0EA5E9;")
    expect(r.stdout).toContain("Sky Theme")
  })

  it("# 無しの hex も受け付ける", () => {
    const r = runCli(["0ea5e9"])
    expect(r.status).toBe(0)
    expect(r.stdout).toContain("--Primitive-Brand-500: #0EA5E9;")
  })

  it("--json はランプ・補正・コントラスト結果を JSON で出す", () => {
    const r = runCli(["#FACC15", "--json"])
    expect(r.status).toBe(0)
    const json = JSON.parse(r.stdout)
    expect(json.ok).toBe(true)
    expect(json.ramp["500"]).toBe("#FACC15")
    expect(json.corrections.some((c: { shade: number }) => c.shade === 600)).toBe(true)
    expect(json.warnings.length).toBeGreaterThan(0)
    expect(json.checks.every((c: { ratio: number }) => typeof c.ratio === "number")).toBe(true)
  })

  it("補正が入ると警告を stderr に出し、stdout は CSS のまま", () => {
    const r = runCli(["#FACC15"])
    expect(r.status).toBe(0)
    expect(r.stderr).toContain("Brand-600 を")
    expect(r.stdout.startsWith("/*")).toBe(true)
  })

  it("--out はファイルへ書き出す", () => {
    const dir = mkdtempSync(join(tmpdir(), "ksk-theme-"))
    const out = join(dir, "nested", "my-client.css")
    const r = runCli(["#16A34A", "--out", out])
    expect(r.status).toBe(0)
    expect(existsSync(out)).toBe(true)
    const css = readFileSync(out, "utf8")
    expect(css).toContain("My Client Theme")
    expect(css).toContain("--Primitive-Brand-500: #16A34A;")
  })

  it("--check は green.css を検査して exit 0", () => {
    const r = runCli(["--check", "src/themes/green.css"])
    expect(r.status).toBe(0)
    expect(r.stdout).toContain("必須ペアは全て通過")
  })

  it("--check は 600 が AA 未満の CSS で exit 1", () => {
    const dir = mkdtempSync(join(tmpdir(), "ksk-theme-check-"))
    const file = join(dir, "bad.css")
    const css = readFileSync(join(ROOT, "src/themes/green.css"), "utf8").replace(/(--Primitive-Brand-600:\s*)#[0-9A-Fa-f]{6}/, "$1#FACC15")
    writeFileSync(file, css)
    const r = runCli(["--check", file])
    expect(r.status).toBe(1)
    expect(r.stdout).toContain("[NG  ]")
  })

  it("不正な hex・引数なし・未知のオプション・ファイル不在は exit 2", () => {
    expect(runCli(["notacolor"]).status).toBe(2)
    expect(runCli([]).status).toBe(2)
    expect(runCli(["#3B82F6", "--bogus"]).status).toBe(2)
    expect(runCli(["--check", "no-such-file.css"]).status).toBe(2)
    expect(runCli(["#3B82F6", "--name", "bad name!"]).status).toBe(2)
  })

  it("--help は使い方を出して exit 0", () => {
    const r = runCli(["--help"])
    expect(r.status).toBe(0)
    expect(r.stdout).toContain("npx ksk-ds theme")
  })

  it("ksk-ds help に theme が載っている", () => {
    const r = spawnSync(process.execPath, [join(ROOT, "bin/init.js"), "help"], { cwd: ROOT, encoding: "utf8" })
    expect(r.stdout).toContain("ksk-ds theme")
  })
})
