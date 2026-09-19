/**
 * native ProgressRing の `tone`（意味名の色指定）と `label`（中央スロット）を固定する（issue #559）。
 *
 * 背景: 消費側（exam-kit の「今回の結果」カード）は同一画面に brand 色と success 色の
 * リングを並べ、中央に 2 行テキストやアイコンを置く必要があり、色固定・中央スロット無しの
 * 旧 API では共通部品で作れず react-native-svg で自前描画していた。
 *
 * 色の解決は react-native に依存しない純関数へ切り出してあるので、ここで全 tone を固定する。
 * 描画側（SVG 分岐 / View フォールバック分岐）の結線は、RN のレンダリングテスト基盤が
 * リポジトリに無いため native-progress-ring-stroke-width と同じソーススキャン方式で固定する。
 */
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import {
  getProgressRingGeometry,
  resolveProgressRingFill,
  shouldDrawProgressArc,
  type ProgressRingTone,
  type ProgressRingToneTheme,
} from "../src/native/progress-ring-geometry"

const nativeSource = readFileSync(
  join(__dirname, "..", "src/native/components/ProgressRing.tsx"),
  "utf8",
)

/** 解決先が取り違えられていないか分かるよう、役割ごとに別の値を入れた偽テーマ。 */
const theme: ProgressRingToneTheme = {
  brand: { primary: "#brand" },
  success: { base: "#success" },
  caution: { base: "#caution" },
  warning: { base: "#warning" },
  info: { base: "#info" },
}

describe("native ProgressRing の tone（#559）", () => {
  it("全 tone が theme の対応する役割へ解決される", () => {
    const expected: Record<ProgressRingTone, string> = {
      accent: "#brand",
      success: "#success",
      caution: "#caution",
      warning: "#warning",
      info: "#info",
    }
    for (const [tone, color] of Object.entries(expected)) {
      expect(resolveProgressRingFill(tone as ProgressRingTone, theme)).toBe(color)
    }
  })

  it("未指定（既定）は従来どおり brand.primary で、見た目が変わらない", () => {
    expect(resolveProgressRingFill(undefined, theme)).toBe("#brand")
    expect(resolveProgressRingFill("accent", theme)).toBe(resolveProgressRingFill(undefined, theme))
  })

  it("色の入口は意味名の tone で、単独の生色文字列 prop は生やさない", () => {
    expect(nativeSource).toMatch(/tone\?: ProgressRingTone/)
    // 生色は Calendar#304 / Sheet#448 と同じ `colors` 注入点だけに閉じる。
    expect(nativeSource).not.toMatch(/^\s*color\?: string/m)
    expect(nativeSource).toMatch(/colors\?: \{/)
  })

  it("colors.fill / colors.track は tone・既定トラックより優先される（consumer の brand palette 用）", () => {
    expect(nativeSource).toContain("colors?.fill ?? resolveProgressRingFill(tone, theme)")
    expect(nativeSource).toContain("colors?.track ?? theme.surface.tertiary")
  })

  it("SVG 分岐と View フォールバック分岐が同じ解決済み色を見る", () => {
    // 片方だけ theme.brand.primary を直読みしていると、tone が SVG 無し環境で効かない。
    expect(nativeSource).toContain("resolveProgressRingFill(tone, theme)")
    const body = nativeSource.slice(nativeSource.indexOf("const fillColor"))
    expect(body).not.toContain("theme.brand.primary")
    // 塗りの参照はどちらの分岐も fillColor 経由（SVG の stroke と View の backgroundColor）。
    expect(body).toContain("stroke={fillColor}")
    expect(body).toContain("backgroundColor: fillColor")
  })

  it("トラック（未塗り部分）の色は tone では変わらない", () => {
    // trackColor の既定は surface.tertiary のままで、tone は fillColor 側にしか効かない。
    expect(nativeSource).toContain("const trackColor = colors?.track ?? theme.surface.tertiary")
    const trackLine = nativeSource
      .split("\n")
      .find((l) => l.includes("const trackColor ="))!
    expect(trackLine).not.toContain("tone")
  })
})

describe("native ProgressRing の label（#559）", () => {
  it("Web と同じ名前・同じ意味の label を ReactNode で受ける", () => {
    const webSource = readFileSync(
      join(__dirname, "..", "src/components/ui/progress-ring.tsx"),
      "utf8",
    )
    expect(nativeSource).toMatch(/label\?: React\.ReactNode/)
    expect(webSource).toMatch(/label\?: React\.ReactNode/)
  })

  it("label 指定時は既定のパーセントラベルより優先される", () => {
    // 既定ラベルは label === undefined のときだけ描く。
    expect(nativeSource).toContain("label === undefined ?")
    expect(nativeSource).toContain("{Math.round(pct)}%")
  })

  it("文字列・数値の label は RN の <Text> で包む（素のテキストは描けない）", () => {
    expect(nativeSource).toContain('typeof label === "string" || typeof label === "number"')
  })

  it("showLabel={false} は既定ラベルも label も出さない（Web と同じ）", () => {
    expect(nativeSource).toContain("{showLabel &&")
  })

  it("中央の領域はリング内径のままで、はみ出しを切る指定を持たない", () => {
    const inner = nativeSource.slice(nativeSource.lastIndexOf("size - resolvedStrokeWidth * 2"))
    expect(inner).not.toContain('overflow: "hidden"')
  })
})

describe("native ProgressRing の中央の塗り（#559）", () => {
  it("SVG 分岐では中央に背景色つき View を描かない（面の色が透ける）", () => {
    // 円弧を stroke で描く以上、中央の円板は不要。surface.primary 以外の面へ
    // 置いたときに円板が浮いて見えるため、SVG 環境では背景を付けない。
    expect(nativeSource).toContain("const centerBackground = svg ? undefined :")
    expect(nativeSource).toContain("backgroundColor: centerBackground,")
    // 旧実装の直書きが残っていない（残っていると SVG 環境でも円板が出る）。
    expect(nativeSource).not.toContain("backgroundColor: theme.surface.primary")
  })

  it("フォールバック分岐は colors.center が効き、未指定なら theme.surface.primary", () => {
    expect(nativeSource).toContain("colors?.center ?? theme.surface.primary")
    expect(nativeSource).toMatch(/center\?: string/)
  })

  it("中央コンテナのサイズ・中央寄せは円板の有無に関わらず同じ", () => {
    expect(nativeSource).toContain("size - resolvedStrokeWidth * 2")
    const inner = nativeSource.slice(nativeSource.indexOf("backgroundColor: centerBackground,"))
    expect(inner).toContain('alignItems: "center"')
    expect(inner).toContain('justifyContent: "center"')
  })
})

describe("native ProgressRing の lineCap（#559）", () => {
  it("既定は butt（従来の見た目のまま）で、SVG の strokeLinecap に渡る", () => {
    expect(nativeSource).toContain('lineCap = "butt"')
    expect(nativeSource).toContain("strokeLinecap={lineCap}")
  })

  it("0% では進捗円弧そのものを描かない（round の線端が点として残らない）", () => {
    expect(shouldDrawProgressArc(0, 10)).toBe(false)
    expect(shouldDrawProgressArc(0, 0)).toBe(false)
    expect(nativeSource).toContain("shouldDrawProgressArc(value, max) && (")
  })

  it("0% より大きければ描く。100% は dashOffset 0 で円が閉じ、線端が重ならない", () => {
    expect(shouldDrawProgressArc(0.1, 10)).toBe(true)
    expect(shouldDrawProgressArc(10, 10)).toBe(true)
    const full = getProgressRingGeometry(10, 10, 64, 6)
    expect(full.dashOffset).toBe(0)
    // 閉じた円では線端どうしが同じ点で接するため、round でも重なりが見えない。
    expect(full.dashArray).toBeCloseTo(full.circumference, 10)
  })

  it("フォールバック描画は線端を表現できないので lineCap を読まない", () => {
    const fallback = nativeSource.slice(
      nativeSource.indexOf("const renderMaskedHalf"),
      nativeSource.indexOf("return ("),
    )
    expect(fallback).not.toContain("lineCap")
  })
})

describe("native ProgressRing の accessibility 受け渡し（#559）", () => {
  it("読み上げ系 props はルート View へ明示的に渡す（...rest の素通しにしない）", () => {
    for (const prop of [
      "accessible",
      "accessibilityLabel",
      "accessibilityRole",
      "accessibilityValue",
      "accessibilityElementsHidden",
      "importantForAccessibility",
      "testID",
    ]) {
      expect(nativeSource).toContain(`${prop}={${prop}}`)
    }
    // JSX での無差別なスプレッド（`{...rest}` / `{...props}`）は使わない。
    expect(nativeSource).not.toMatch(/\{\.\.\.\w+\}/)
  })

  it("既定値を持たない＝未指定なら undefined のままルートに属性が付かない", () => {
    // 既定値を与えると常に属性が付き、従来の読み上げが変わってしまう。
    const signature = nativeSource.slice(
      nativeSource.indexOf("export function ProgressRing({"),
      nativeSource.indexOf("}: ProgressRingProps)"),
    )
    for (const prop of ["accessible", "accessibilityLabel", "accessibilityRole", "testID"]) {
      expect(signature).not.toMatch(new RegExp(`${prop}\\s*=`))
    }
  })
})
