/**
 * @vitest-environment jsdom
 *
 * BottomTabBar / MobileTabBar 公開カスタマイズ契約の回帰テスト（issue #471）
 *
 * 消費側（belle-todo）は 5 アイテム + 大きめ中央アクションを作るために
 * `[data-slot="bottom-nav-pill"] > :is(a, button)` や `span:first-child` /
 * `span:last-child`、`[data-global-nav-add-icon]` といった**内部マークアップ**を
 * `!important` で叩いていた。v1.43.0 で中央アクションのラッパー構造を変えた
 * ときに実際に壊れている。
 *
 * ここで固定するのは「公開契約」だけ:
 *   1. 安定 data-slot が DOM に存在する
 *   2. 寸法が --Nav-* を参照している（固定 Tailwind クラスに戻っていない）
 *   3. 44px のタップ領域下限が max() で守られている
 *   4. 面（背景・境界・影）の宣言が bottom-nav.css に var(--Nav-*, DS既定) の
 *      形であり、既定は .glass-accent の内部変数へ委譲している
 *
 * **内部ラッパーの入れ子・タグ・子要素の順序は一切検査しない。**
 * DS がそこを変えても消費側が壊れないことがこの契約の目的なので、
 * DOM を見るテストは子孫順に依存しない書き方にしてある。
 *
 * 一方で「寸法が --Nav-* を参照しているか」は、jsdom が Tailwind クラスを
 * 解決しないため**ソース文字列**で見ている（AdminShell / Tabs の配線を
 * product-theme-defaults.test.ts が同じやり方で固定しているのと揃えた）。
 * これは配線が固定クラスへ差し戻る退行を防ぐのが目的で、参照の**手段**
 * （arbitrary value か style か）を縛る意図はない。実装手段を変えるときは
 * ここの期待値も一緒に更新してよい。既定値が旧固定クラスと同一実寸である
 * ことの機械的な証明は product-theme-defaults.test.ts が Tailwind の
 * 生成 CSS で行う。
 *
 * 実行: npm run test
 */
import { describe, it, expect, afterEach } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import * as React from "react"
import { readFileSync } from "node:fs"
import { join } from "node:path"

import { MobileTabBar } from "../src/components/patterns/commerce/mobile-tab-bar"

const ROOT = process.cwd()
const NAV_CSS = readFileSync(join(ROOT, "src/styles/bottom-nav.css"), "utf8")
const GLASS_CSS = readFileSync(join(ROOT, "src/styles/glass.css"), "utf8")
const PRODUCT_THEME_CSS = readFileSync(join(ROOT, "src/styles/product-theme.css"), "utf8")
const SOURCE = readFileSync(
  join(ROOT, "src/components/patterns/commerce/bottom-tab-bar.tsx"),
  "utf8",
)

const TABS = [
  { key: "home" as const, label: "ホーム", Icon: () => null },
  { key: "search" as const, label: "検索", Icon: () => null },
  { key: "board" as const, label: "ボード", Icon: () => null },
  { key: "inbox" as const, label: "受信", Icon: () => null },
  { key: "me" as const, label: "マイページ", Icon: () => null },
]

let container: HTMLDivElement | null = null
let root: Root | null = null

function renderNav() {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => {
    root!.render(
      <MobileTabBar
        tabs={TABS}
        activeTab="home"
        onSelect={() => {}}
        addAction={{ label: "作成", onClick: () => {} }}
      />,
    )
  })
  return container
}

afterEach(() => {
  if (root) act(() => root!.unmount())
  container?.remove()
  root = null
  container = null
})

describe("安定 data-slot（DOM を狙う唯一の公開アンカー）", () => {
  it("5 アイテム + 中央アクションのナビが公開 slot をすべて出す", () => {
    const el = renderNav()

    expect(el.querySelector('[data-slot="bottom-nav-pill"]')).not.toBeNull()
    expect(el.querySelectorAll('[data-slot="bottom-nav-item"]')).toHaveLength(5)
    expect(el.querySelectorAll('[data-slot="bottom-nav-item-icon"]')).toHaveLength(5)
    expect(el.querySelectorAll('[data-slot="bottom-nav-item-label"]')).toHaveLength(5)
    expect(el.querySelectorAll('[data-slot="bottom-nav-center-action"]')).toHaveLength(1)
    expect(el.querySelectorAll('[data-slot="bottom-nav-center-action-icon"]')).toHaveLength(1)
  })

  it("tone は pill の data-tone で読める（選択プラッターの出し分けに使う）", () => {
    const el = renderNav()
    expect(el.querySelector('[data-slot="bottom-nav-pill"]')?.getAttribute("data-tone")).toBe(
      "default",
    )
  })

  it("中央アクションはタブ（bottom-nav-item）と混ざらない", () => {
    // 消費側が「タブだけ」「中央アクションだけ」を子孫順ではなく slot で
    // 選び分けられること。span:first-child / :nth-child 依存の代替。
    const el = renderNav()
    const center = el.querySelector('[data-slot="bottom-nav-center-action"]')!
    expect(center.getAttribute("data-slot")).not.toBe("bottom-nav-item")
    expect(
      [...el.querySelectorAll('[data-slot="bottom-nav-item"]')].includes(center as Element),
    ).toBe(false)
  })

  it("中央アクションはラベル無しでも aria-label を自分で持つ（a11y 既定）", () => {
    const el = renderNav()
    const center = el.querySelector('[data-slot="bottom-nav-center-action"]')!
    expect(center.getAttribute("aria-label")).toBe("作成")
    expect(center.tagName).toBe("BUTTON")
  })

  it("アクティブなタブが aria-current='page' を持つ", () => {
    const el = renderNav()
    const active = el.querySelector('[data-slot="bottom-nav-item"][aria-current="page"]')
    expect(active).not.toBeNull()
    expect(active!.textContent).toContain("ホーム")
  })
})

describe("寸法は --Nav-* 参照（固定クラスに戻っていない）", () => {
  it("pill の prominent レイアウトが --Nav-Pill-* を参照する", () => {
    expect(SOURCE).toContain("min-h-[var(--Nav-Pill-Min-Height)]")
    expect(SOURCE).toContain("gap-[var(--Nav-Pill-Gap)]")
    expect(SOURCE).toContain("px-[var(--Nav-Pill-Padding-X)]")
    expect(SOURCE).toContain("py-[var(--Nav-Pill-Padding-Y)]")
    // 旧実装の固定値が残っていない
    expect(SOURCE).not.toContain("min-h-[66px]")
  })

  it("タブが --Nav-Item-* を参照する", () => {
    expect(SOURCE).toContain("min-h-[max(2.75rem,var(--Nav-Item-Min-Height))]")
    expect(SOURCE).toContain("gap-[var(--Nav-Item-Gap)]")
  })

  it("中央アクションが --Nav-Center-Action-Size / -Radius を参照する", () => {
    expect(SOURCE).toContain("size-[max(2.75rem,var(--Nav-Center-Action-Size))]")
    expect(SOURCE).toContain("h-[max(2.75rem,var(--Nav-Center-Action-Size))]")
    expect(SOURCE).toContain("rounded-[var(--Nav-Center-Action-Radius)]")
    expect(SOURCE).not.toContain('"size-12"')
  })

  it("44px（HIG のタップ領域下限）は product theme で縮められない", () => {
    // max(44px, var(...)) なので、消費側が 0 を入れても実寸は 44px。
    for (const decl of [
      "min-h-[max(2.75rem,var(--Nav-Item-Min-Height))]",
      "size-[max(2.75rem,var(--Nav-Center-Action-Size))]",
      "h-[max(2.75rem,var(--Nav-Center-Action-Size))]",
    ]) {
      expect(SOURCE).toContain(decl)
    }
  })

  it("--Nav-* の寸法既定値が product-theme.css で旧固定値と一致する", () => {
    const defaults = new Map(
      [...PRODUCT_THEME_CSS.matchAll(/^\s*(--Nav-[A-Za-z-]+)\s*:\s*([^;]+);/gm)].map((m) => [
        m[1],
        m[2].trim(),
      ]),
    )
    expect(defaults.get("--Nav-Pill-Min-Height")).toBe("4.125rem") // 66px
    expect(defaults.get("--Nav-Pill-Padding-X")).toBe("0.5rem") // px-2
    expect(defaults.get("--Nav-Pill-Padding-Y")).toBe("0.5rem") // py-2
    expect(defaults.get("--Nav-Pill-Gap")).toBe("0.25rem") // gap-1
    expect(defaults.get("--Nav-Item-Min-Height")).toBe("2.75rem") // min-h-11
    expect(defaults.get("--Nav-Item-Gap")).toBe("0.125rem") // gap-0.5
    expect(defaults.get("--Nav-Center-Action-Size")).toBe("3rem") // size-12
    expect(defaults.get("--Nav-Center-Action-Radius")).toBe("9999px") // rounded-full
  })
})

describe("面の上書きは var(--Nav-*, DS既定) で、未宣言なら見た目が変わらない", () => {
  it("中央アクションの background / border / box-shadow が .glass-accent の内部変数へ委譲する", () => {
    expect(NAV_CSS).toContain(
      "background: var(--Nav-Center-Action-Surface, var(--ksk-glass-accent-bg));",
    )
    expect(NAV_CSS).toContain(
      "border: var(--Nav-Center-Action-Border, var(--ksk-glass-accent-border));",
    )
    expect(NAV_CSS).toContain(
      "box-shadow: var(--Nav-Center-Action-Shadow, var(--ksk-glass-accent-shadow));",
    )
  })

  it("フォールバック先の内部変数を .glass-accent が light / dark 双方で定義している", () => {
    for (const name of [
      "--ksk-glass-accent-bg",
      "--ksk-glass-accent-border",
      "--ksk-glass-accent-shadow",
    ]) {
      // .glass-accent と .dark .glass-accent の 2 箇所（宣言 + 参照 = 3 出現以上）
      expect(GLASS_CSS.split(`${name}:`).length - 1).toBe(2)
      expect(GLASS_CSS).toContain(`var(${name})`)
    }
  })

  it("選択プラッターの面が --Nav-Selected-* を受け、tone='inverse' の既定を持つ", () => {
    expect(NAV_CSS).toContain("--Nav-Selected-Surface,")
    expect(NAV_CSS).toContain("--Nav-Selected-Shadow,")
    expect(NAV_CSS).toContain('[data-tone="inverse"] [data-nav-platter]')
  })

  it("面の白リテラルが className に戻っていない（bottom-nav.css が唯一の宣言箇所）", () => {
    expect(SOURCE).not.toContain("bg-[rgba(255,255,255,0.20)]")
    expect(SOURCE).not.toContain("[background:color-mix(in_srgb,var(--Surface-Primary)_70%,transparent)]")
  })

  it("preset.css が bottom-nav.css を glass.css の後に読み込む（詳細度同点の順序勝ち）", () => {
    const preset = readFileSync(join(ROOT, "src/preset.css"), "utf8")
    expect(preset).toContain(`@import "./styles/bottom-nav.css";`)
    expect(preset.indexOf(`@import "./styles/bottom-nav.css";`)).toBeGreaterThan(
      preset.indexOf(`@import "./styles/glass.css";`),
    )
  })
})

describe("契約が contracts に載っている", () => {
  const contract = JSON.parse(
    readFileSync(join(ROOT, "contracts/product-theme-overrides.json"), "utf8"),
  ) as {
    allowedVariables: Record<string, string[]>
    dsVariableNamespaces: string[]
    wiredComponents: Record<string, string[]>
  }

  it("--Nav-* が許可リストと namespace に載っている", () => {
    expect(contract.dsVariableNamespaces).toContain("--Nav-")
    const nav = contract.allowedVariables.nav
    for (const name of [
      "--Nav-Pill-Min-Height",
      "--Nav-Pill-Padding-X",
      "--Nav-Pill-Padding-Y",
      "--Nav-Pill-Gap",
      "--Nav-Item-Min-Height",
      "--Nav-Item-Gap",
      "--Nav-Center-Action-Size",
      "--Nav-Center-Action-Radius",
      "--Nav-Center-Action-Surface",
      "--Nav-Center-Action-Border",
      "--Nav-Center-Action-Shadow",
      "--Nav-Selected-Surface",
      "--Nav-Selected-Shadow",
    ]) {
      expect(nav).toContain(name)
    }
  })

  it("BottomTabBar / MobileTabBar が wiredComponents に載っている", () => {
    expect(contract.wiredComponents.BottomTabBar).toBeDefined()
    expect(contract.wiredComponents.MobileTabBar).toBeDefined()
  })
})

describe("pill 本体の面の公開変数（issue #486）", () => {
  it("背景・backdrop・境界・影が var(--Nav-Pill-*, DS既定) で宣言されている", () => {
    const rule = NAV_CSS.slice(
      NAV_CSS.indexOf('[data-slot="bottom-nav-pill"] {'),
      NAV_CSS.indexOf('[data-slot="bottom-nav-pill"][data-tone="inverse"]'),
    )
    expect(rule).toContain("background: var(--Nav-Pill-Surface, var(--glass-bg))")
    expect(rule).toContain("backdrop-filter: var(--Nav-Pill-Backdrop, var(--glass-blur))")
    expect(rule).toContain("border: var(--Nav-Pill-Border, 0.5px solid var(--glass-border))")
    expect(rule).toContain("box-shadow: var(--Nav-Pill-Shadow,")
  })

  it("既定値は .glass 自身の宣言と同じ内部変数を指す（未宣言なら見た目が変わらない）", () => {
    const glass = GLASS_CSS.slice(GLASS_CSS.indexOf(".glass {"), GLASS_CSS.indexOf(".glass {") + 260)
    // .glass が使う内部変数を、そのままフォールバックに使っていること
    for (const v of ["--glass-bg", "--glass-blur", "--glass-border"]) {
      expect(glass).toContain(`var(${v})`)
      expect(NAV_CSS).toContain(`var(${v})`)
    }
    expect(glass).toContain("var(--glass-highlight), var(--glass-shadow)")
    expect(NAV_CSS).toContain("var(--Nav-Pill-Shadow, var(--glass-highlight), var(--glass-shadow))")
  })

  it("tone=\"inverse\" は .glass-dark の既定へ委譲する", () => {
    const rule = NAV_CSS.slice(NAV_CSS.indexOf('[data-slot="bottom-nav-pill"][data-tone="inverse"]'))
    expect(rule).toContain("var(--Nav-Pill-Surface, var(--glass-bg-dark))")
    expect(rule).toContain("var(--Nav-Pill-Backdrop, var(--glass-blur-media-dark))")
    expect(rule).toContain("var(--Nav-Pill-Border, 0.5px solid var(--glass-border-dark))")
  })

  it("ダーク / 暗背景区画でも --Nav-Pill-Backdrop が勝つ（issue #486 の実測バグ）", () => {
    // glass.css の @supports が `.dark .glass` (0,2,0) で backdrop-filter を
    // 上書きするため、(0,1,0) の [data-slot] だけでは宣言順に関係なく負ける。
    // v2.1.0 では実際にダークでだけ --Nav-Pill-Backdrop が無視されていた。
    expect(NAV_CSS).toContain('.dark [data-slot="bottom-nav-pill"]')
    expect(NAV_CSS).toContain('[data-glass-backdrop="dark"] [data-slot="bottom-nav-pill"]')
    const darkRule = NAV_CSS.slice(NAV_CSS.indexOf('.dark [data-slot="bottom-nav-pill"]'))
    expect(darkRule).toContain(
      "backdrop-filter: var(--Nav-Pill-Backdrop, var(--glass-blur) var(--glass-refract-dark))",
    )
  })

  it("glass.css のダーク上書きセレクタと対になっている（片方だけ増やさない）", () => {
    // glass.css 側が .dark / [data-glass-backdrop="dark"] の2系統で上書きしている限り、
    // bottom-nav.css も同じ2系統を持っていないと片方の環境で取りこぼす。
    for (const sel of ['.dark .glass', '[data-glass-backdrop="dark"] .glass']) {
      expect(GLASS_CSS).toContain(sel)
    }
    expect(NAV_CSS).toContain('.dark [data-slot="bottom-nav-pill"]')
    expect(NAV_CSS).toContain('[data-glass-backdrop="dark"] [data-slot="bottom-nav-pill"]')
  })

  it("スペキュラ / 屈折リムは content 経由で切れる（既定は空文字＝生成される）", () => {
    expect(NAV_CSS).toContain('content: var(--Nav-Pill-Specular, "")')
  })

  it("-webkit- を先・標準形を後に書いている（消費側 minifier の dedupe 対策）", () => {
    const rule = NAV_CSS.slice(
      NAV_CSS.indexOf('[data-slot="bottom-nav-pill"] {'),
      NAV_CSS.indexOf('[data-slot="bottom-nav-pill"][data-tone="inverse"]'),
    )
    expect(rule.indexOf("-webkit-backdrop-filter")).toBeLessThan(rule.indexOf("\n  backdrop-filter"))
  })

  it("公開変数は product-theme-overrides.json の許可リストに載っている", () => {
    const contract = JSON.parse(
      readFileSync(join(ROOT, "contracts/product-theme-overrides.json"), "utf8"),
    ) as { allowedVariables: { nav: string[] } }
    for (const v of [
      "--Nav-Pill-Surface",
      "--Nav-Pill-Backdrop",
      "--Nav-Pill-Border",
      "--Nav-Pill-Shadow",
      "--Nav-Pill-Specular",
    ]) {
      expect(contract.allowedVariables.nav).toContain(v)
    }
  })

  it("既定値を :root に置いていない（宣言したときだけ効く）", () => {
    // product-theme.css に既定値を置くと、消費側が未宣言でも DS 既定が上書きされる
    expect(PRODUCT_THEME_CSS).not.toContain("--Nav-Pill-Surface")
    expect(PRODUCT_THEME_CSS).not.toContain("--Nav-Pill-Backdrop")
    expect(PRODUCT_THEME_CSS).not.toContain("--Nav-Pill-Specular")
  })
})

describe("デスクトップ幅での表示切り替え（issue #486）", () => {
  const SOURCES = {
    bar: SOURCE,
    mobile: readFileSync(
      join(ROOT, "src/components/patterns/commerce/mobile-tab-bar.tsx"),
      "utf8",
    ),
  }

  it("既定は従来どおり lg:hidden（モバイル専用）", () => {
    // 既定値を落とすと全消費側のデスクトップ表示が無言で変わる
    expect(SOURCES.bar).toContain("showOnDesktop = false")
    const occurrences = SOURCES.bar.match(/showOnDesktop \? "lg:(block|flex)" : "lg:hidden"/g) ?? []
    // default variant の nav / pill の scroll edge 帯 / pill 本体の 3 箇所
    expect(occurrences).toHaveLength(3)
  })

  it("表示側のクラスは各要素の既定 display に合わせる（display の回帰を防ぐ）", () => {
    // pill 本体は flex、display 指定を持たない nav と装飾帯は block。
    // 一律 lg:flex にすると 1024px 以上でだけ display が変わる。
    expect(SOURCES.bar).toContain('showOnDesktop ? "lg:flex" : "lg:hidden"')
    expect(SOURCES.bar.match(/showOnDesktop \? "lg:block" : "lg:hidden"/g) ?? []).toHaveLength(2)
    expect(SOURCES.bar.match(/showOnDesktop \? "lg:flex" : "lg:hidden"/g) ?? []).toHaveLength(1)
  })

  it("クラス名は完全な文字列で書く（動的合成しない）", () => {
    expect(SOURCES.bar).not.toMatch(/`lg:\$\{/)
    expect(SOURCES.mobile).not.toMatch(/`lg:\$\{/)
  })

  it("MobileTabBar は showOnDesktop をパススルーし、自前の lg:hidden を落とす", () => {
    expect(SOURCES.mobile).toContain("showOnDesktop = false")
    expect(SOURCES.mobile).toContain("showOnDesktop={showOnDesktop}")
    // showOnDesktop のときはベタ書きの lg:hidden を付けない
    expect(SOURCES.mobile).toMatch(/showOnDesktop\s*\?\s*className/)
  })

  it("BottomTabBar / MobileTabBar の両方が prop を公開している", () => {
    expect(SOURCES.bar).toMatch(/showOnDesktop\?: boolean/)
    expect(SOURCES.mobile).toMatch(/showOnDesktop\?: boolean/)
  })
})
