import { describe, expect, it, afterEach } from "vitest"
import { createRoot, type Root } from "react-dom/client"
import { act } from "react"
import { cdp } from "vitest/browser"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { NumberInput } from "@/components/ui/number-input"
import { CheckboxCardItem } from "@/components/ui/checkbox-card"
import { SearchBar } from "@/components/patterns/search-bar"
import { TagInput } from "@/components/patterns/tag-input"
import "@/index.css"

/**
 * issue #636: 入力欄・チェックボックス・ラジオの枠（--Border-Control）とスイッチ（オフ）の地
 * （--Surface-Switch-Off）は、既定では WCAG 1.4.11 の 3:1 に届かない淡い色のまま据え置き、
 * OS の「コントラストを上げる」（prefers-contrast: more）か root の data-contrast="more"
 * のときだけ 3:1 以上の色へ切り替える。計算後の色を chromium 実機で確かめる。
 *
 * - 設定なし: 部品の枠は従来の Border-Medium-Emphasis と同じ計算後の色（既定の見た目は不変）
 * - 設定あり: light は Gray-500 (#71717A)、dark は White-Alpha-500
 * - 設定なしでも data-contrast="more" を付ければ同じ値（opt-in）
 */

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const GRAY_500 = "rgb(113, 113, 122)"
const WHITE_ALPHA_500 = "rgba(255, 255, 255, 0.36)"

// 入力・選択の操作部品（枠が操作の手がかりになるもの）。既定は Medium と同じ、設定ありで Control の値
const EXTRA_CONTROLS = ["numberInputButton", "searchBar", "tagInput", "checkboxCard", "checkboxCardIcon"] as const

let root: Root | undefined
let container: HTMLDivElement | undefined

afterEach(async () => {
  await cdp().send("Emulation.setEmulatedMedia", { features: [] })
  if (root) {
    act(() => root!.unmount())
    root = undefined
  }
  container?.remove()
  container = undefined
  noTransition?.remove()
  noTransition = undefined
  document.documentElement.removeAttribute("data-contrast")
  document.documentElement.classList.remove("dark")
})

async function setContrast(value: "more" | "no-preference") {
  await cdp().send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-contrast", value }],
  })
  // メディア特性の反映は非同期なので、スタイル再計算が済むまで待つ
  await new Promise((resolve) => setTimeout(resolve, 100))
}

// transition-colors の途中値を読まないよう、検証中はトランジションを止める
let noTransition: HTMLStyleElement | undefined

function mount() {
  noTransition = document.createElement("style")
  noTransition.textContent = "*, *::before, *::after { transition: none !important; }"
  document.head.appendChild(noTransition)
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => {
    root!.render(
      <div>
        <Input aria-label="入力欄" />
        <Checkbox aria-label="チェック" />
        <RadioGroup>
          <RadioGroupItem value="a" aria-label="ラジオ" />
        </RadioGroup>
        <Switch aria-label="スイッチ" />
        <NumberInput value={1} />
        <SearchBar aria-label="検索" />
        <TagInput value={["a"]} />
        <CheckboxCardItem value="x" label="カード" />
        {/* 比較用: 面の区切りに使う Medium は入力系の切り替えに巻き込まれない */}
        <div data-testid="divider" className="border border-[var(--Border-Medium-Emphasis)]" />
        <div data-testid="medium-probe" style={{ borderTop: "1px solid var(--Border-Medium-Emphasis)" }} />
        <div data-testid="quaternary-probe" style={{ backgroundColor: "var(--Surface-Quaternary)" }} />
      </div>,
    )
  })
}

function colors() {
  const q = (selector: string) => container!.querySelector(selector) as HTMLElement
  const border = (el: HTMLElement) => getComputedStyle(el).borderTopColor
  return {
    input: border(q("input")),
    checkbox: border(q('[data-slot="checkbox"]')),
    radio: border(q('[data-slot="radio-group-item"]')),
    numberInputButton: border(q('[data-slot="number-input"] button')),
    searchBar: border(q('[data-slot="search-bar"] input')),
    tagInput: border(q('[data-slot="tag-input"]')),
    checkboxCard: border(q('[data-slot="checkbox-card-item"]')),
    checkboxCardIcon: border(q('[data-slot="checkbox-card-icon"]')),
    switchOff: getComputedStyle(q('[data-slot="switch"]')).backgroundColor,
    divider: border(q('[data-testid="divider"]')),
    mediumProbe: border(q('[data-testid="medium-probe"]')),
    quaternaryProbe: getComputedStyle(q('[data-testid="quaternary-probe"]')).backgroundColor,
  }
}

describe("prefers-contrast: more で入力系の枠とスイッチの地だけ濃くなる (issue #636)", () => {
  it("設定なし（light）: 入力系の枠は従来の Border-Medium-Emphasis、スイッチ地は Surface-Quaternary のまま", async () => {
    await setContrast("no-preference")
    mount()
    const c = colors()
    expect(c.input).toBe(c.mediumProbe)
    expect(c.checkbox).toBe(c.mediumProbe)
    expect(c.radio).toBe(c.mediumProbe)
    expect(c.switchOff).toBe(c.quaternaryProbe)
    for (const key of EXTRA_CONTROLS) expect(c[key]).toBe(c.mediumProbe)
    expect(c.input).not.toBe(GRAY_500)
  })

  it("設定あり（light）: 枠とスイッチ地が Gray-500 になり、面の区切り（Medium）は変わらない", async () => {
    await setContrast("no-preference")
    mount()
    const before = colors()
    await setContrast("more")
    const after = colors()
    expect(after.input).toBe(GRAY_500)
    expect(after.checkbox).toBe(GRAY_500)
    expect(after.radio).toBe(GRAY_500)
    expect(after.switchOff).toBe(GRAY_500)
    for (const key of EXTRA_CONTROLS) expect(after[key]).toBe(GRAY_500)
    expect(after.divider).toBe(before.divider)
    expect(after.mediumProbe).toBe(before.mediumProbe)
  })

  it("設定あり（dark）: 枠は White-Alpha-500、スイッチ地は Gray-500。設定なし（dark）は従来どおり", async () => {
    document.documentElement.classList.add("dark")
    await setContrast("no-preference")
    mount()
    const base = colors()
    expect(base.input).toBe(base.mediumProbe)
    expect(base.switchOff).toBe(base.quaternaryProbe)

    await setContrast("more")
    const more = colors()
    expect(more.input).toBe(WHITE_ALPHA_500)
    expect(more.checkbox).toBe(WHITE_ALPHA_500)
    expect(more.radio).toBe(WHITE_ALPHA_500)
    expect(more.switchOff).toBe(GRAY_500)
    for (const key of EXTRA_CONTROLS) expect(more[key]).toBe(WHITE_ALPHA_500)
    expect(more.mediumProbe).toBe(base.mediumProbe)
  })

  it('opt-in: 設定なしでも root に data-contrast="more" を付けると同じ値になる（light / dark）', async () => {
    await setContrast("no-preference")
    document.documentElement.setAttribute("data-contrast", "more")
    mount()
    const light = colors()
    expect(light.input).toBe(GRAY_500)
    expect(light.switchOff).toBe(GRAY_500)

    document.documentElement.classList.add("dark")
    const dark = colors()
    expect(dark.input).toBe(WHITE_ALPHA_500)
    expect(dark.checkbox).toBe(WHITE_ALPHA_500)
    expect(dark.radio).toBe(WHITE_ALPHA_500)
    expect(dark.switchOff).toBe(GRAY_500)
  })
})
