/** @vitest-environment jsdom */
import * as React from "react"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { FieldLegend, FieldSet } from "../src/components/patterns/field"
import { FormField } from "../src/components/patterns/form-field"
import { KskLabelsProvider, KSK_DEFAULT_LABELS, formatKskLabel } from "../src/components/ui/ksk-labels"
import { StarRating } from "../src/components/ui/star-rating"

const host = (ui: React.ReactElement) => {
  const el = document.createElement("div")
  el.innerHTML = renderToStaticMarkup(ui)
  return el
}
const noop = () => {}

describe("StarRating の名前と既定文言 (#746)", () => {
  const group = (el: HTMLElement) => el.querySelector('[role="radiogroup"]')!

  it("FormField as=group の中で名前未指定なら、外側のラベルを aria-labelledby で結ぶ", () => {
    const el = host(
      <FormField as="group" label="満足度">
        <StarRating value={2} onChange={noop} />
      </FormField>
    )
    const labelledby = group(el).getAttribute("aria-labelledby")
    expect(labelledby).toBeTruthy()
    expect(el.querySelector(`[id="${labelledby}"]`)?.textContent).toContain("満足度")
    // 外側のラベルで名付けるので「評価」の aria-label は付けない
    expect(group(el).hasAttribute("aria-label")).toBe(false)
  })

  it("label / aria-label / aria-labelledby の明示は group 内でも優先する", () => {
    const withLabel = host(
      <FormField as="group" label="満足度">
        <StarRating value={2} onChange={noop} label="総合評価" />
      </FormField>
    )
    expect(group(withLabel).getAttribute("aria-label")).toBe("総合評価")
    expect(group(withLabel).hasAttribute("aria-labelledby")).toBe(false)

    const withAria = host(
      <FormField as="group" label="満足度">
        <StarRating value={2} onChange={noop} label="使われない" aria-label="総合評価" />
      </FormField>
    )
    expect(group(withAria).getAttribute("aria-label")).toBe("総合評価")

    const withLabelledby = host(
      <FormField as="group" label="満足度">
        <StarRating value={2} onChange={noop} aria-labelledby="heading-x" />
      </FormField>
    )
    expect(group(withLabelledby).getAttribute("aria-labelledby")).toBe("heading-x")
    expect(group(withLabelledby).hasAttribute("aria-label")).toBe(false)
  })

  it("label と aria-labelledby を併用したら aria-labelledby が名前になる（group の内外とも）", () => {
    // accname 1.2 の手順 2B: aria-labelledby は aria-label より先に評価されるので、参照先の見出しが名前になる
    const nameOf = (el: HTMLElement) => {
      const g = group(el)
      const ids = g.getAttribute("aria-labelledby")
      if (ids) return ids.split(/\s+/).map((id) => el.querySelector(`[id="${id}"]`)?.textContent ?? "").join(" ")
      return g.getAttribute("aria-label")
    }
    const outside = host(
      <div>
        <h3 id="rating-heading">総合満足度</h3>
        <StarRating value={2} onChange={noop} label="使われない" aria-labelledby="rating-heading" />
      </div>
    )
    expect(group(outside).getAttribute("aria-labelledby")).toBe("rating-heading")
    expect(nameOf(outside)).toBe("総合満足度")

    const inside = host(
      <FormField as="group" label="満足度">
        <h3 id="rating-heading-2">総合満足度</h3>
        <StarRating value={2} onChange={noop} label="使われない" aria-labelledby="rating-heading-2" />
      </FormField>
    )
    // group のラベル id ではなく、明示した aria-labelledby を使う
    expect(group(inside).getAttribute("aria-labelledby")).toBe("rating-heading-2")
    expect(nameOf(inside)).toBe("総合満足度")
  })

  it("group の外では従来どおり「評価」・各星は「n点」（Provider 無しの既定は 1 文字も変えない）", () => {
    const el = host(<StarRating value={2} onChange={noop} />)
    expect(group(el).getAttribute("aria-label")).toBe("評価")
    expect(group(el).hasAttribute("aria-labelledby")).toBe(false)
    const radios = el.querySelectorAll('[role="radio"]')
    expect(radios[0].getAttribute("aria-label")).toBe("1点")
    expect(radios[4].getAttribute("aria-label")).toBe("5点")
    expect(host(<StarRating value={3.5} />).querySelector('[role="img"]')!.getAttribute("aria-label")).toBe("3.5/5点")
  })

  it("表示専用（role=img）は group 内でも値の要約を名前にする（ラベルを結ばない）", () => {
    const img = host(
      <FormField as="group" label="満足度">
        <StarRating value={4} />
      </FormField>
    ).querySelector('[role="img"]')!
    expect(img.getAttribute("aria-label")).toBe("4/5点")
    expect(img.hasAttribute("aria-labelledby")).toBe(false)
  })

  it("KskLabelsProvider の locale / labels に従い、prop の関数が勝つ", () => {
    const en = host(
      <KskLabelsProvider locale="en">
        <StarRating value={2} onChange={noop} max={4} />
        <StarRating value={3} />
      </KskLabelsProvider>
    )
    expect(group(en).getAttribute("aria-label")).toBe("Rating")
    expect(en.querySelector('[role="radio"]')!.getAttribute("aria-label")).toBe("1 of 4")
    expect(en.querySelector('[role="img"]')!.getAttribute("aria-label")).toBe("Rated 3 of 5")

    const custom = host(
      <KskLabelsProvider labels={{ ratingGroup: "おすすめ度", ratingStar: "星{value}つ", ratingValue: "{max}中{value}" }}>
        <StarRating value={2} onChange={noop} />
        <StarRating value={2} onChange={noop} label="明示" starLabel={(v) => `★${v}`} />
        <StarRating value={3} />
        <StarRating value={3} valueLabel={(v, m) => `${v} / ${m}`} />
      </KskLabelsProvider>
    )
    const groups = custom.querySelectorAll('[role="radiogroup"]')
    expect(groups[0].getAttribute("aria-label")).toBe("おすすめ度")
    expect(groups[0].querySelector('[role="radio"]')!.getAttribute("aria-label")).toBe("星1つ")
    expect(groups[1].getAttribute("aria-label")).toBe("明示")
    expect(groups[1].querySelector('[role="radio"]')!.getAttribute("aria-label")).toBe("★1")
    const imgs = custom.querySelectorAll('[role="img"]')
    expect(imgs[0].getAttribute("aria-label")).toBe("5中3")
    expect(imgs[1].getAttribute("aria-label")).toBe("3 / 5")
  })

  it("ja / en の既定文言を持ち、差し込み口は値で置き換える", () => {
    expect(KSK_DEFAULT_LABELS.ja).toMatchObject({ ratingGroup: "評価", ratingValue: "{value}/{max}点", ratingStar: "{value}点" })
    expect(KSK_DEFAULT_LABELS.en).toMatchObject({ ratingGroup: "Rating" })
    expect(formatKskLabel("{value}/{max}", { value: 1, max: 5 })).toBe("1/5")
    // 値の無い差し込み口は残す
    expect(formatKskLabel("{value}/{unknown}", { value: 1 })).toBe("1/{unknown}")
  })
})

describe("FieldSet 既定の legend の下の間隔 (#747)", () => {
  const cls = (ui: React.ReactElement) => host(ui).querySelector("fieldset")!.className

  it("gap 未指定でも子の間隔（gap-6）と同じ legend の下の余白（mb-6）を付ける", () => {
    const c = cls(<FieldSet><FieldLegend>x</FieldLegend></FieldSet>)
    expect(c).toContain("gap-6")
    expect(c).toContain("[:where(&)>:where([data-slot=field-legend])]:mb-6")
  })

  it("各 gap は子の間隔と legend の下を同じ段にそろえる", () => {
    for (const [gap, n] of [["sm", 2], ["md", 4], ["lg", 6]] as const) {
      const c = cls(<FieldSet gap={gap}><FieldLegend>x</FieldLegend></FieldSet>)
      expect(c).toContain(`gap-${n}`)
      expect(c).toContain(`[:where(&)>:where([data-slot=field-legend])]:mb-${n}`)
      // 既定の段と二重にならない
      expect(c.match(/:mb-\d/g)).toHaveLength(1)
    }
  })

  it("legend の余白は詳細度 0（:where）で付ける（FieldLegend の className が勝つ）", () => {
    const c = cls(<FieldSet><FieldLegend className="mb-0">x</FieldLegend></FieldSet>)
    for (const token of c.split(/\s+/).filter((t) => t.includes("field-legend"))) {
      expect(token.startsWith("[:where(&)>:where(")).toBe(true)
    }
  })
})

describe("contracts: StarRating sizes (#748)", () => {
  it("実装の size の型と contracts の sizes が一致する", () => {
    const contracts = JSON.parse(readFileSync(join(__dirname, "../contracts/components.json"), "utf8"))
    const list: Array<{ name: string; sizes?: string[] }> = contracts.ui
    const entry = list.find((c) => c.name === "StarRating")!
    const source = readFileSync(join(__dirname, "../src/components/ui/star-rating.tsx"), "utf8")
    const union = source.match(/size\?:\s*([^\n]+)/)![1]
    const sizes = [...union.matchAll(/"(\w+)"/g)].map((m) => m[1])
    expect(entry.sizes).toEqual(sizes)
    expect(entry.sizes).toContain("xl")
  })
})
