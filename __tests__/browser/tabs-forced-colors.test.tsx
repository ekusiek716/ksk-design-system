import { describe, expect, it, afterEach } from "vitest"
import { createRoot, type Root } from "react-dom/client"
import { act } from "react"
import { cdp } from "vitest/browser"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import "@/index.css"

/**
 * 強制配色（forced-colors / Windows ハイコントラスト）モードでも、Tabs の選択中が分かること。
 *
 * 通常表示の選択中は「白地（Surface-Primary）+ shadow-sm」で表すが、forced-colors では
 * 背景色が Canvas に置き換わり box-shadow も描画されないため、選択中と非選択が区別できなくなる。
 * 選択中だけ OS の選択色（Highlight / HighlightText）で反転させ、通常表示は変えない。
 *
 * 実ブラウザ（chromium）で CDP (`Emulation.setEmulatedMedia`) から forced-colors を有効化し、
 * computed style で選択中と非選択の背景色・文字色が異なることを確認する。
 */

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let root: Root | undefined
let container: HTMLDivElement | undefined

afterEach(async () => {
  await cdp().send("Emulation.setEmulatedMedia", { features: [] })
  if (root) {
    act(() => root!.unmount())
    root = undefined
  }
  if (container) {
    container.remove()
    container = undefined
  }
})

function mountTabs(variant: "default" | "pill") {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => {
    root!.render(
      <Tabs defaultValue="a">
        <TabsList variant={variant}>
          <TabsTrigger value="a">概要</TabsTrigger>
          <TabsTrigger value="b">詳細</TabsTrigger>
        </TabsList>
        <TabsContent value="a">本文</TabsContent>
      </Tabs>,
    )
  })
  const active = container.querySelector<HTMLElement>('[role="tab"][data-state="active"]')!
  const inactive = container.querySelector<HTMLElement>('[role="tab"][data-state="inactive"]')!
  return { active, inactive }
}

/** 実際に描画される色（Highlight 等のシステム色も rgb に解決された値）を取り出す。 */
function paint(el: HTMLElement) {
  const style = getComputedStyle(el)
  return { background: style.backgroundColor, color: style.color }
}

describe("Tabs の forced-colors 表示", () => {
  it("tabpanel のキーボードフォーカスは通常表示でリングを持つ (#659)", () => {
    mountTabs("default")
    const panel = container!.querySelector<HTMLElement>('[role="tabpanel"]')!
    panel.focus()
    expect(panel.matches(":focus-visible")).toBe(true)
    expect(getComputedStyle(panel).boxShadow).not.toBe("none")
  })

  for (const variant of ["default", "pill"] as const) {
    it(`${variant}: forced-colors では選択中だけ背景・文字色が変わる`, async () => {
      await cdp().send("Emulation.setEmulatedMedia", {
        features: [{ name: "forced-colors", value: "active" }],
      })
      const { active, inactive } = mountTabs(variant)

      const a = paint(active)
      const i = paint(inactive)
      // 選択中は Highlight / HighlightText（非選択は Canvas / CanvasText）で、背景も文字も別の色になる
      expect(a.background).not.toBe(i.background)
      expect(a.color).not.toBe(i.color)
    })

    it(`${variant}: 通常表示では Highlight にならない（見た目を変えない）`, async () => {
      const { active, inactive } = mountTabs(variant)

      // 通常表示の選択中は Surface-Primary の白地。forced-colors 用の反転は当たらない
      const probe = document.createElement("div")
      probe.style.backgroundColor = "Highlight"
      document.body.appendChild(probe)
      const highlight = getComputedStyle(probe).backgroundColor
      probe.remove()

      expect(paint(active).background).not.toBe(highlight)
      expect(paint(inactive).background).not.toBe(highlight)
    })
  }
})
