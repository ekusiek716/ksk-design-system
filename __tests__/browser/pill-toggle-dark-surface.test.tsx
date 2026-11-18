import { afterEach, describe, expect, it } from "vitest"
import { createRoot, type Root } from "react-dom/client"
import { act } from "react"
import { PillToggle } from "@/components/ui/pill-toggle"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import "@/index.css"

/**
 * issue #863: PillToggle（tabs の形・radio の形）と Tabs variant="pill" の選んだ側は、
 * dark で外枠より暗くなっていた（外枠 Surface-Tertiary Gray-700 の上に Surface-Primary Gray-900、1.70:1）。
 * 切り替え専用の面（--Surface-Pill-Track / --Surface-Pill-Selected）に替え、dark だけ選んだ側を明るくする。
 * light は従来と同じ色。Chromium の計算後の色で確かめる。
 */

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const GRAY_100 = "rgb(244, 244, 245)"
const WHITE = "rgb(255, 255, 255)"
const GRAY_800 = "rgb(39, 39, 42)"
const GRAY_500 = "rgb(113, 113, 122)"
const GRAY_700 = "rgb(63, 63, 70)"
const GRAY_900 = "rgb(24, 24, 27)"

const OPTIONS = [
  { value: "list", label: "一覧" },
  { value: "pair", label: "組み合わせ" },
]

let root: Root | undefined
let container: HTMLDivElement | undefined
let noTransition: HTMLStyleElement | undefined

afterEach(() => {
  if (root) {
    act(() => root!.unmount())
    root = undefined
  }
  container?.remove()
  container = undefined
  noTransition?.remove()
  noTransition = undefined
  document.documentElement.classList.remove("dark")
})

function mount(node: React.ReactNode) {
  // transition-all の途中値を読まないよう、検証中はトランジションを止める
  noTransition = document.createElement("style")
  noTransition.textContent = "*, *::before, *::after { transition: none !important; }"
  document.head.appendChild(noTransition)
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => root!.render(node))
}

function luminance(rgb: string): number {
  const [r, g, b] = rgb.match(/\d+/g)!.slice(0, 3).map((v) => {
    const c = Number(v) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

type Shape = "tabs" | "radio" | "tabs-pill-direct"
const SHAPES: Shape[] = ["tabs", "radio", "tabs-pill-direct"]

function render(shape: Shape) {
  if (shape === "tabs-pill-direct") {
    mount(
      <Tabs value="list">
        <TabsList variant="pill" aria-label="結果の見せ方">
          <TabsTrigger value="list">一覧</TabsTrigger>
          <TabsTrigger value="pair">組み合わせ</TabsTrigger>
        </TabsList>
      </Tabs>,
    )
  } else {
    mount(
      <PillToggle
        aria-label="結果の見せ方"
        semantics={shape === "radio" ? "radio" : "tabs"}
        options={OPTIONS}
        value="list"
        onChange={() => {}}
      />,
    )
  }
  const track = container!.querySelector<HTMLElement>('[role="tablist"], [role="radiogroup"]')!
  const items = [...container!.querySelectorAll<HTMLElement>('[role="tab"], [role="radio"]')]
  const paint = (el: HTMLElement) => {
    const s = getComputedStyle(el)
    return { background: s.backgroundColor, color: s.color, weight: Number(s.fontWeight) }
  }
  return { track: paint(track), selected: paint(items[0]), unselected: paint(items[1]) }
}

describe("切り替えの選んだ側の面（#863）", () => {
  for (const shape of SHAPES) {
    it(`${shape}: light は従来どおり Gray-100 の上に白（色を変えない）`, () => {
      const { track, selected, unselected } = render(shape)
      expect(track.background).toBe(GRAY_100)
      expect(selected.background).toBe(WHITE)
      expect(unselected.background).toBe("rgba(0, 0, 0, 0)")
    })

    it(`${shape}: dark は外枠 Gray-800 の上に Gray-500 で、選んだ側を外枠より明るくする（3:1 以上）`, () => {
      document.documentElement.classList.add("dark")
      const { track, selected } = render(shape)
      expect(track.background).toBe(GRAY_800)
      expect(selected.background).toBe(GRAY_500)
      // 旧値（外枠 Gray-700 / 選んだ側 Gray-900）に戻っていない
      expect(track.background).not.toBe(GRAY_700)
      expect(selected.background).not.toBe(GRAY_900)
      expect(luminance(selected.background)).toBeGreaterThan(luminance(track.background))
      expect(contrast(selected.background, track.background)).toBeGreaterThanOrEqual(3)
      // 選んだ側の文字（Text-High = 白）は 4.5:1 以上
      expect(contrast(selected.color, selected.background)).toBeGreaterThanOrEqual(4.5)
    })

    it(`${shape}: 選んだ側の文字だけ太い（色だけに頼らない。native の 700 / 500 と同じ）`, () => {
      const { selected, unselected } = render(shape)
      expect(selected.weight).toBe(700)
      expect(unselected.weight).toBe(500)
    })
  }

  it("Tabs の既定の形（variant=default）は従来の Surface-Tertiary / Surface-Primary のまま・太字にしない", () => {
    document.documentElement.classList.add("dark")
    mount(
      <Tabs value="a">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
      </Tabs>,
    )
    const list = container!.querySelector<HTMLElement>('[role="tablist"]')!
    const [active, inactive] = [...container!.querySelectorAll<HTMLElement>('[role="tab"]')]
    expect(getComputedStyle(list).backgroundColor).toBe(GRAY_700)
    expect(getComputedStyle(active).backgroundColor).toBe(GRAY_900)
    expect(getComputedStyle(active).fontWeight).toBe(getComputedStyle(inactive).fontWeight)
  })
})
