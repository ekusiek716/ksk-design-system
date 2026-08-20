/**
 * appliesTo の capability 判定（issue #391）
 *
 * DS は native/ui にもコンポーネントを出荷しているが、contracts/rules.json の
 * ルールの多くは Tailwind / Web DOM 前提で書かれている。`appliesTo` は定義済み
 * だったのに bin/lint.js が一度も参照しておらず、StyleSheet 系の RN consumer
 * （aikoibito mobile）で P032 が 76 件すべて誤検知していた
 * （`borderColor: colors.border,` の `.border` に反応する）。
 *
 * 一方で consumer の多く（exam-kit 系 11 アプリ）は **NativeWind** を使い、RN でも
 * className に Tailwind クラスを書く。「RN だから Tailwind 系は全部外す」と
 * 一括で倒すと、そちらの lint がほぼ無効化される（ap-app で 858 件 → 66 件）。
 *
 * そのため appliesTo はプラットフォーム二値ではなく **capability タグ**
 * （dom / tailwind / web / native）で表し、ファイル側の capability と
 * 交差させて適用可否を決める。
 */
import { describe, expect, it, vi } from "vitest"
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { spawnSync } from "node:child_process"

import { detectCapabilities, detectPlatform, ruleAppliesTo, runLintCli } from "../bin/lint.js"

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
const caps = (filePath: string, source: string, override?: "web" | "native") =>
  [...detectCapabilities(filePath, source, override ?? null)].sort()

/** StyleSheet 系の RN。aikoibito mobile で P032 が 76 件出ていた形をそのまま持つ */
const STYLESHEET_SOURCE = `
import { StyleSheet, View } from "react-native"

const colors = { border: "#E5E7EB" }

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderColor: colors.border },
})

export function Card() {
  return <View style={styles.card} />
}
`

/** NativeWind 系の RN。exam-kit 系 11 アプリがこの書き方 */
const NATIVEWIND_SOURCE = `
import { Text, View } from "react-native"

export function Card() {
  return (
    <View className="border rounded-lg p-3">
      <Text className="text-[14px] font-bold">見出し</Text>
    </View>
  )
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
    expect(detectPlatform("src/Card.tsx", `import { Button } from "ksk-design-system/native/ui"`)).toBe("native")
    // 複数行 import も跨ぐ
    expect(detectPlatform("src/Card.tsx", `import {\n  View,\n  Text,\n} from "react-native"`)).toBe("native")
  })

  it("StyleSheet.create の使用も native シグナル", () => {
    expect(detectPlatform("src/Card.tsx", "const s = StyleSheet.create({})")).toBe("native")
  })

  it("シグナルが無ければ web にフォールバックする（後方互換）", () => {
    expect(detectPlatform("src/Card.tsx", `import { Button } from "ksk-design-system"`)).toBe("web")
  })

  // レビュー指摘 🟡: 以前は \bfrom\s*["']react-native["'] だけで見ていたため、
  // 文字列の中に import 文の見本を持つファイルが native 判定になっていた。
  it("文字列 / テンプレートリテラル内の react-native では native にしない", () => {
    expect(detectPlatform("src/Docs.tsx", `const s = "import { View } from 'react-native'"`)).toBe("web")
    expect(detectPlatform("src/Docs.tsx", `const s = \`使い方: import { View } from "react-native"\``)).toBe("web")
    expect(detectPlatform("src/Docs.tsx", `const url = "https://reactnative.dev/react-native"`)).toBe("web")
    expect(detectPlatform("src/Docs.tsx", `const pkg = "react-native"`)).toBe("web")
  })

  it("--platform の上書きはファイル判定より優先される", () => {
    expect(detectPlatform("src/Card.native.tsx", STYLESHEET_SOURCE, "web")).toBe("web")
    expect(detectPlatform("src/Card.tsx", "export const a = 1", "native")).toBe("native")
  })
})

describe("capability 判定（detectCapabilities）", () => {
  it("web ファイルは dom / tailwind / web を持つ", () => {
    expect(caps("src/Card.tsx", `export const a = <div className="p-2" />`)).toEqual([
      "dom", "tailwind", "web",
    ])
  })

  it("NativeWind の RN は native + tailwind（dom / web は持たない）", () => {
    expect(caps("src/Card.tsx", NATIVEWIND_SOURCE)).toEqual(["native", "tailwind"])
  })

  it("StyleSheet の RN は native だけ", () => {
    expect(caps("src/Card.tsx", STYLESHEET_SOURCE)).toEqual(["native"])
  })

  it("--platform native でも className があれば tailwind は残る", () => {
    // NativeWind の consumer が --platform native を付けた瞬間に
    // Tailwind 系ルールを失う、という事故を避ける
    expect(caps("src/Card.tsx", NATIVEWIND_SOURCE, "native")).toEqual(["native", "tailwind"])
    expect(caps("src/Card.tsx", STYLESHEET_SOURCE, "native")).toEqual(["native"])
  })

  it("--platform web は常に dom / tailwind / web", () => {
    expect(caps("src/Card.native.tsx", STYLESHEET_SOURCE, "web")).toEqual(["dom", "tailwind", "web"])
  })
})

describe("appliesTo の解釈（ruleAppliesTo）", () => {
  const web = new Set(["dom", "tailwind", "web"])
  const nativewind = new Set(["native", "tailwind"])
  const stylesheet = new Set(["native"])

  it("未指定は全ファイル対象", () => {
    for (const capabilities of [web, nativewind, stylesheet]) {
      expect(ruleAppliesTo({}, { capabilities, filePath: "src/a.tsx" })).toBe(true)
      expect(ruleAppliesTo({ appliesTo: [] }, { capabilities, filePath: "src/a.tsx" })).toBe(true)
    }
  })

  it("dom は web ファイルだけ", () => {
    const rule = { appliesTo: ["dom"] }
    expect(ruleAppliesTo(rule, { capabilities: web, filePath: "a.tsx" })).toBe(true)
    expect(ruleAppliesTo(rule, { capabilities: nativewind, filePath: "a.tsx" })).toBe(false)
    expect(ruleAppliesTo(rule, { capabilities: stylesheet, filePath: "a.tsx" })).toBe(false)
  })

  it("tailwind は web と NativeWind に当たり、StyleSheet には当たらない", () => {
    const rule = { appliesTo: ["tailwind"] }
    expect(ruleAppliesTo(rule, { capabilities: web, filePath: "a.tsx" })).toBe(true)
    expect(ruleAppliesTo(rule, { capabilities: nativewind, filePath: "a.tsx" })).toBe(true)
    expect(ruleAppliesTo(rule, { capabilities: stylesheet, filePath: "a.tsx" })).toBe(false)
  })

  it("旧語彙 web / native も引き続き解釈する（後方互換）", () => {
    expect(ruleAppliesTo({ appliesTo: ["web"] }, { capabilities: web, filePath: "a.tsx" })).toBe(true)
    expect(ruleAppliesTo({ appliesTo: ["web"] }, { capabilities: nativewind, filePath: "a.tsx" })).toBe(false)
    expect(ruleAppliesTo({ appliesTo: ["native"] }, { capabilities: nativewind, filePath: "a.tsx" })).toBe(true)
    expect(ruleAppliesTo({ appliesTo: ["native"] }, { capabilities: web, filePath: "a.tsx" })).toBe(false)
  })

  it("グロブはパス全体と basename の両方に当てる", () => {
    const rule = { appliesTo: ["*.css"] }
    expect(ruleAppliesTo(rule, { capabilities: web, filePath: "src/styles/theme.css" })).toBe(true)
    expect(ruleAppliesTo(rule, { capabilities: stylesheet, filePath: "theme.css" })).toBe(true)
    expect(ruleAppliesTo(rule, { capabilities: web, filePath: "src/a.tsx" })).toBe(false)
  })

  it("タグとグロブの混在は OR で評価する", () => {
    const rule = { appliesTo: ["native", "*.css"] }
    expect(ruleAppliesTo(rule, { capabilities: stylesheet, filePath: "src/a.tsx" })).toBe(true)
    expect(ruleAppliesTo(rule, { capabilities: web, filePath: "src/a.css" })).toBe(true)
    expect(ruleAppliesTo(rule, { capabilities: web, filePath: "src/a.tsx" })).toBe(false)
  })
})

describe("lint CLI の capability 分岐", () => {
  // 🔴1 の回帰: NativeWind の RN では Tailwind 系ルールが従来どおり発火すること
  it("NativeWind の RN では tailwind 系ルール（P032 / P011 / P016）が発火する", () => {
    const findings = runLint("Card.tsx", NATIVEWIND_SOURCE)
    const ids = ruleIds(findings)
    expect(ids.has("P032")).toBe(true)
    expect(ids.has("P011")).toBe(true)
    expect(ids.has("P016")).toBe(true)
  })

  it("NativeWind の RN でも dom 系ルール（P001）は当てない", () => {
    const findings = runLint(
      "Card.tsx",
      `${NATIVEWIND_SOURCE}\nexport const raw = "<button>これは文字列</button>"\n`,
    )
    expect(ruleIds(findings).has("P001")).toBe(false)
  })

  // StyleSheet 系 RN では tailwind 系を外す（P032 の 76 件誤検知の本題）
  it("StyleSheet の RN では tailwind 系ルールをスキップする", () => {
    const findings = runLint("Card.tsx", STYLESHEET_SOURCE)
    const ids = ruleIds(findings)
    expect(ids.has("P032")).toBe(false)
    expect(ids.has("P028")).toBe(false)
  })

  it("*.native.tsx（StyleSheet）でも同様にスキップする", () => {
    const findings = runLint("Card.native.tsx", STYLESHEET_SOURCE)
    expect(ruleIds(findings).has("P032")).toBe(false)
  })

  it("web ファイルなら P032 は従来どおり検出する（対照）", () => {
    const findings = runLint(
      "Card.tsx",
      `export const Card = () => <div className="border rounded-lg p-3">A</div>\n`,
    )
    expect(ruleIds(findings).has("P032")).toBe(true)
  })

  it("--platform web は .native.tsx でも web ルールを適用する", () => {
    const findings = runLint(
      "Card.native.tsx",
      `export const Card = () => <div className="border rounded-lg p-3">A</div>\n`,
      ["--platform", "web"],
    )
    const ids = ruleIds(findings)
    expect(ids.has("P032")).toBe(true)
  })

  it("--platform native でも className があれば tailwind 系は残る", () => {
    const findings = runLint("Card.tsx", NATIVEWIND_SOURCE, ["--platform=native"])
    expect(ruleIds(findings).has("P032")).toBe(true)
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

// 🔴2: RN の正規 a11y 属性を認識していなかった
describe("P026 と React Native の accessibilityLabel", () => {
  it("accessibilityLabel があれば違反にしない", () => {
    const findings = runLint(
      "Form.tsx",
      `import { TextInput } from "react-native"
export const Form = () => (
  <TextInput placeholder="メールアドレス" accessibilityLabel="メールアドレス" />
)
`,
    )
    expect(ruleIds(findings).has("P026")).toBe(false)
  })

  it("accessibilityLabelledBy があれば違反にしない", () => {
    const findings = runLint(
      "Form.tsx",
      `import { TextInput } from "react-native"
export const Form = () => (
  <TextInput placeholder="メールアドレス" accessibilityLabelledBy="email-label" />
)
`,
    )
    expect(ruleIds(findings).has("P026")).toBe(false)
  })

  it("placeholder だけなら従来どおり違反にする", () => {
    const findings = runLint(
      "Form.tsx",
      `import { TextInput } from "react-native"
export const Form = () => <TextInput placeholder="メールアドレス" />
`,
    )
    expect(ruleIds(findings).has("P026")).toBe(true)
  })

  it("web 側の aria-label / id も従来どおり通す", () => {
    const labelled = runLint("Form.tsx", `export const F = () => <input placeholder="p" aria-label="l" />\n`)
    const bare = runLint("Form.tsx", `export const F = () => <input placeholder="p" />\n`)
    expect(ruleIds(labelled).has("P026")).toBe(false)
    expect(ruleIds(bare).has("P026")).toBe(true)
  })
})

// 追レビューの再現ケース: capability 判定が「コメントはマスクするが文字列は
// マスクしていない」生ソースに対して走っていたため、文字列の中身で判定が壊れていた。
describe("capability 判定が文字列リテラルに騙されない", () => {
  // 🔴 再現1: StyleSheet 系 native に WebView の HTML 文字列を足すだけで
  // tailwind capability が付き、P032 の 76 件誤検知が復活していた
  const WEBVIEW_SOURCE = `
import { StyleSheet, View } from "react-native"
import { WebView } from "react-native-webview"

const colors = { border: "#E5E7EB" }

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderColor: colors.border },
})

export function Chart() {
  return (
    <View style={styles.card}>
      <WebView source={{ html: '<div className="legend-item">chart</div>' }} />
    </View>
  )
}
`

  it("文字列の中の className= では tailwind capability が付かない", () => {
    expect([...detectCapabilities("src/Chart.tsx", WEBVIEW_SOURCE)].sort()).toEqual(["native"])
  })

  it("WebView の HTML 文字列を持つ StyleSheet ファイルで P032 = 0", () => {
    const findings = runLint("Chart.tsx", WEBVIEW_SOURCE)
    expect(findings.filter((f) => f.ruleId === "P032")).toHaveLength(0)
  })

  // 🟡 再現2: 実コード行の行頭が export なので行頭アンカーを素通りし、
  // テンプレートリテラルの中身で純 web ファイルが native 判定になっていた
  const SNIPPET_SOURCE = `
export const snippet = \`import { View } from "react-native"\`;

export function Page() {
  return <button className="border">保存</button>
}
`

  it("テンプレートリテラル内の import 文で web ファイルが native 化しない", () => {
    expect(detectPlatform("src/Docs.tsx", SNIPPET_SOURCE)).toBe("web")
  })

  it("同ファイルで dom 系ルール（P001）が従来どおり 1 件出る", () => {
    const findings = runLint("Docs.tsx", SNIPPET_SOURCE)
    expect(findings.filter((f) => f.ruleId === "P001")).toHaveLength(1)
  })

  // 実 NativeWind（JSX 属性の className=）は文字列の外側なので検出が続くこと
  it("実 NativeWind ファイルでは tailwind 系の発火が維持される（回帰確認）", () => {
    expect([...detectCapabilities("src/Card.tsx", NATIVEWIND_SOURCE)].sort()).toEqual([
      "native", "tailwind",
    ])
    const ids = ruleIds(runLint("Card.tsx", NATIVEWIND_SOURCE))
    expect(ids.has("P032")).toBe(true)
    expect(ids.has("P011")).toBe(true)
    expect(ids.has("P016")).toBe(true)
  })
})

// 🟢 appliesTo の typo が「黙って誰にも当たらない」状態にならないこと
describe("appliesTo の未知の値は fail-open（全ファイル対象）", () => {
  function runWithRules(rule: Record<string, unknown>, fileName: string, source: string) {
    const pkgRoot = mkdtempSync(join(tmpdir(), "ksk-ds-pkgroot-"))
    mkdirSync(join(pkgRoot, "contracts"))
    writeFileSync(
      join(pkgRoot, "contracts/rules.json"),
      JSON.stringify({ prohibited: [rule] }),
    )
    const cwd = mkdtempSync(join(tmpdir(), "ksk-ds-cwd-"))
    writeFileSync(join(cwd, fileName), source)

    const stdout: string[] = []
    const stderr: string[] = []
    const logSpy = vi.spyOn(console, "log").mockImplementation((...a) => void stdout.push(a.join(" ")))
    const errSpy = vi.spyOn(console, "error").mockImplementation((...a) => void stderr.push(a.join(" ")))
    try {
      return runLintCli([cwd, "--format", "json"], { cwd, pkgRoot }).then((status) => ({
        status,
        stderr: stderr.join("\n"),
        results: JSON.parse(stdout.join("\n")).results as Finding[],
      }))
    } finally {
      logSpy.mockRestore()
      errSpy.mockRestore()
    }
  }

  const TYPO_RULE = {
    id: "PTEST",
    severity: "warn",
    category: "test",
    appliesTo: ["tailwnd"],
    pattern: "NEEDLE",
    message: "typo テスト",
    fix: "",
  }

  it("typo したルールは全ファイルに適用される（StyleSheet native でも当たる）", async () => {
    const { results } = await runWithRules(
      TYPO_RULE,
      "Card.tsx",
      `import { StyleSheet } from "react-native"\nconst s = StyleSheet.create({})\nconst x = "NEEDLE"\n`,
    )
    expect(results.filter((f) => f.ruleId === "PTEST")).toHaveLength(1)
  })

  it("typo は stderr に警告として出る", async () => {
    const { stderr } = await runWithRules(TYPO_RULE, "Card.tsx", `const x = "NEEDLE"\n`)
    expect(stderr).toContain("PTEST")
    expect(stderr).toContain("appliesTo")
    expect(stderr).toContain("tailwnd")
  })

  it("正しい capability 値なら従来どおり絞り込む（対照）", async () => {
    const { results } = await runWithRules(
      { ...TYPO_RULE, appliesTo: ["tailwind"] },
      "Card.tsx",
      `import { StyleSheet } from "react-native"\nconst s = StyleSheet.create({})\nconst x = "NEEDLE"\n`,
    )
    expect(results.filter((f) => f.ruleId === "PTEST")).toHaveLength(0)
  })
})
