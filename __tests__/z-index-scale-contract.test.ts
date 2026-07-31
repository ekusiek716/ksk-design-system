import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

/**
 * z-index スケール（src/preset.css の --Z-*）の不変条件。
 *
 * Portal に載る要素は DOM の親子関係を失うため、重なり順は z-index だけが頼りになる。
 * ここが崩れると「Dialog の上に Toast が出ない」「Sheet を開くと Tooltip が隠れる」
 * のように、実機で開いてみるまで気づけない壊れ方をする。issue #263。
 */

const preset = readFileSync("src/preset.css", "utf8")
const sheet = readFileSync("src/components/ui/sheet.tsx", "utf8")

function z(name: string): number {
  const m = preset.match(new RegExp(`--Z-${name}:\\s*(-?\\d+);`))
  if (!m) throw new Error(`--Z-${name} が preset.css に無い`)
  return Number(m[1])
}

function sheetConst(name: string): number {
  const m = sheet.match(new RegExp(`const ${name} = (-?\\d+)`))
  if (!m) throw new Error(`${name} が sheet.tsx に無い`)
  return Number(m[1])
}

describe("z-index スケール contract", () => {
  it("下から上への順序が守られている", () => {
    const order = ["Base", "Raised", "Sticky", "Nav", "Floating", "Overlay", "Modal", "Alert-Overlay", "Alert", "Coachmark-Overlay", "Coachmark", "Popover", "Toast", "Tooltip", "SkipLink"]
    const values = order.map(z)
    expect(values).toEqual([...values].sort((a, b) => a - b))
    // 同値の段があると Portal のマウント順で勝敗が決まってしまう
    expect(new Set(values).size).toBe(values.length)
  })

  it("Floating（FAB / 一括操作バー）は Nav より上", () => {
    // AppShell は <main> の後にボトムナビを描画するので、同じ段だと後勝ちで隠れる
    expect(z("Floating")).toBeGreaterThan(z("Nav"))
    expect(z("Floating")).toBeLessThan(z("Overlay"))
  })

  it("Modal は自分の scrim(Overlay) より上", () => {
    expect(z("Modal")).toBeGreaterThan(z("Overlay"))
  })

  it("AlertDialog は自分の scrim ごと Modal より上（親 Dialog / Sheet を暗転させる）", () => {
    // Alert と同じ段だと自分の scrim が親コンテンツの下に潜り、
    // 親が暗転しないまま確認だけが浮く。
    expect(z("Alert-Overlay")).toBeGreaterThan(z("Modal"))
    expect(z("Alert")).toBeGreaterThan(z("Alert-Overlay"))
  })

  it("CoachMark は scrim ごと Modal より上（暗転していないモーダルの上に説明だけ浮かせない）", () => {
    expect(z("Coachmark-Overlay")).toBeGreaterThan(z("Modal"))
    expect(z("Coachmark")).toBeGreaterThan(z("Coachmark-Overlay"))
  })

  it("Popover / Toast は Modal より上（モーダル内から開く・モーダル上で読ませる）", () => {
    expect(z("Popover")).toBeGreaterThan(z("Coachmark"))
    expect(z("Toast")).toBeGreaterThan(z("Modal"))
    expect(z("Toast")).toBeGreaterThan(z("Popover"))
  })

  it("Tooltip / SkipLink が最上位", () => {
    expect(z("Tooltip")).toBeGreaterThan(z("Toast"))
    expect(z("SkipLink")).toBeGreaterThan(z("Tooltip"))
  })

  it("sheet.tsx のネスト用 z 定数が preset.css の --Z-Overlay / --Z-Modal と一致する", () => {
    // インラインの数値 z-index を算術で積むため sheet.tsx は数値で持っている。
    // 片方だけ動かすと多段 Sheet の暗転が壊れる（issue #158）。
    expect(sheetConst("SHEET_OVERLAY_BASE_Z")).toBe(z("Overlay"))
    expect(sheetConst("SHEET_CONTENT_BASE_Z")).toBe(z("Modal"))
  })

  it("多段 Sheet を現実的な段数まで積んでも Alert 層を突き抜けない", () => {
    const step = sheetConst("SHEET_STACK_STEP")
    const MAX_REALISTIC_NESTING = 8
    const topmost = z("Modal") + MAX_REALISTIC_NESTING * step
    expect(topmost).toBeLessThan(z("Alert-Overlay"))
  })

  it("AlertDialog / Dialog / Sheet が正しいトークンを参照している", () => {
    const alert = readFileSync("src/components/ui/alert-dialog.tsx", "utf8")
    expect(alert).toContain("z-[var(--Z-Alert-Overlay)]")
    expect(alert).toContain("z-[var(--Z-Alert)]")
    // controlled openでもpaint前に既存Popoverを閉じ、1フレームのstale layerを出さない。
    expect(alert).toContain("useIsomorphicLayoutEffect(() =>")
    const dialog = readFileSync("src/components/ui/dialog.tsx", "utf8")
    expect(dialog).toContain("z-[var(--Z-Overlay)]")
    expect(dialog).toContain("z-[var(--Z-Modal)]")
    // CoachMark は scrim（fallback overlay と boxShadow スポットライトの両方）と
    // 吹き出しが対で Modal より上に居る必要がある
    const coachOverlay = readFileSync("src/components/patterns/coach-mark-overlay.tsx", "utf8")
    expect(coachOverlay).toContain("z-[var(--Z-Coachmark-Overlay)]")
    expect(coachOverlay).not.toMatch(/zIndex:\s*\d+/)
    const coachMark = readFileSync("src/components/ui/coach-mark.tsx", "utf8")
    expect(coachMark).toContain("z-[var(--Z-Coachmark)]")
  })
})
