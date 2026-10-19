/** @vitest-environment jsdom */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { computeAccessibleDescription, computeAccessibleName } from "dom-accessibility-api"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { SettingsListRow } from "../src/components/patterns/settings-section"
import { ChipSelector } from "../src/components/patterns/chip-selector"
import { QuickActionGrid, ActionTile } from "../src/components/patterns/quick-action-grid"
import { PillToggle } from "../src/components/ui/pill-toggle"
import { StarRating } from "../src/components/ui/star-rating"
import { Switch } from "../src/components/ui/switch"
import { resetDevWarnings } from "../src/lib/dev-warn"

let container: HTMLElement
let root: Root

beforeEach(() => {
  ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => {
    root.unmount()
  })
  container.remove()
  resetDevWarnings()
  vi.restoreAllMocks()
})

function mount(ui: React.ReactElement) {
  act(() => {
    root.render(ui)
  })
}

const THEMES = [
  { value: "light", label: "ライト" },
  { value: "dark", label: "ダーク" },
]

describe("SettingsListRow の関数 rightSlot が title を指す aria-labelledby を渡す (#763)", () => {
  it("ChipSelector 単一選択を置くと radiogroup の名前が title、説明が description になる", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    mount(
      <SettingsListRow
        title="テーマ"
        description="画面の明るさ"
        rightSlot={(control) => (
          <ChipSelector {...control} selectionMode="single" options={THEMES} value="light" onChange={() => {}} />
        )}
      />
    )
    const group = container.querySelector<HTMLElement>('[role="radiogroup"]')!
    expect(group.hasAttribute("aria-label")).toBe(false)
    const labelledby = group.getAttribute("aria-labelledby")!
    const label = container.querySelector<HTMLLabelElement>('[data-slot="settings-list-row-label"]')!
    expect(labelledby).toBe(label.id)
    expect(label.id).toBe(`${group.id}-label`)
    expect(computeAccessibleName(group)).toBe("テーマ")
    expect(computeAccessibleDescription(group)).toBe("画面の明るさ")
    // 名前があるので「radiogroup に名前が無い」警告は出ない
    expect(warn).not.toHaveBeenCalled()
  })

  it("controlId を渡すと title の id は `${controlId}-label`", () => {
    mount(
      <SettingsListRow
        title="テーマ"
        controlId="theme"
        rightSlot={(control) => (
          <ChipSelector {...control} selectionMode="single" options={THEMES} value="light" onChange={() => {}} />
        )}
      />
    )
    expect(container.querySelector("label")!.id).toBe("theme-label")
    expect(container.querySelector('[role="radiogroup"]')!.getAttribute("aria-labelledby")).toBe("theme-label")
  })

  it("PillToggle radio / QuickActionGrid 単一選択 / StarRating も aria-labelledby で title が名前になる", () => {
    mount(
      <>
        <SettingsListRow
          title="言語"
          rightSlot={(control) => (
            <PillToggle
              aria-labelledby={control["aria-labelledby"]}
              semantics="radio"
              options={[
                { value: "ja", label: "日本語" },
                { value: "en", label: "English" },
              ]}
              value="ja"
              onChange={() => {}}
            />
          )}
        />
        <SettingsListRow
          title="開始画面"
          rightSlot={(control) => (
            <QuickActionGrid aria-labelledby={control["aria-labelledby"]} selectionMode="single" columns={2}>
              <ActionTile label="ホーム" selected />
              <ActionTile label="予定" />
            </QuickActionGrid>
          )}
        />
        <SettingsListRow
          title="満足度"
          rightSlot={(control) => (
            <StarRating aria-labelledby={control["aria-labelledby"]} value={3} onChange={() => {}} />
          )}
        />
      </>
    )
    const names = Array.from(container.querySelectorAll<HTMLElement>('[role="radiogroup"]')).map((g) =>
      computeAccessibleName(g)
    )
    expect(names).toEqual(["言語", "開始画面", "満足度"])
  })

  it("Switch の名前は title のまま（aria-labelledby と label[for] が同じ title を指し、二重にならない）", () => {
    mount(
      <SettingsListRow
        title="通知"
        description="毎日のリマインダー"
        rightSlot={(control) => <Switch {...control} />}
      />
    )
    const sw = container.querySelector<HTMLButtonElement>('[role="switch"]')!
    const label = container.querySelector<HTMLLabelElement>("label")!
    expect(sw.getAttribute("aria-labelledby")).toBe(label.id)
    expect(sw.labels?.[0]).toBe(label)
    expect(computeAccessibleName(sw)).toBe("通知")
    expect(computeAccessibleDescription(sw)).toBe("毎日のリマインダー")
  })

  it("{...control} と別名の aria-label を併用すると、aria-labelledby が優先されて title で読まれる", () => {
    mount(<SettingsListRow title="通知" rightSlot={(control) => <Switch {...control} aria-label="別名" />} />)
    const sw = container.querySelector<HTMLButtonElement>('[role="switch"]')!
    expect(sw.getAttribute("aria-label")).toBe("別名")
    expect(computeAccessibleName(sw)).toBe("通知")
  })

  it("{...control} の後ろに aria-labelledby={undefined} を置くと aria-label の名前に戻る", () => {
    mount(
      <SettingsListRow
        title="通知"
        rightSlot={(control) => <Switch {...control} aria-label="別名" aria-labelledby={undefined} />}
      />
    )
    const sw = container.querySelector<HTMLButtonElement>('[role="switch"]')!
    expect(sw.hasAttribute("aria-labelledby")).toBe(false)
    expect(computeAccessibleName(sw)).toBe("別名")
  })

  it("同じ画面に行を 2 つ並べると label の id は別になり、それぞれの title で読まれる", () => {
    mount(
      <>
        <SettingsListRow
          title="テーマ"
          rightSlot={(control) => (
            <ChipSelector {...control} selectionMode="single" options={THEMES} value="light" onChange={() => {}} />
          )}
        />
        <SettingsListRow
          title="文字の大きさ"
          rightSlot={(control) => (
            <ChipSelector {...control} selectionMode="single" options={THEMES} value="dark" onChange={() => {}} />
          )}
        />
      </>
    )
    const labels = Array.from(container.querySelectorAll<HTMLLabelElement>("label"))
    expect(labels).toHaveLength(2)
    expect(labels[0].id).not.toBe(labels[1].id)
    const groups = Array.from(container.querySelectorAll<HTMLElement>('[role="radiogroup"]'))
    expect(groups.map((g) => g.getAttribute("aria-labelledby"))).toEqual(labels.map((l) => l.id))
    expect(groups.map((g) => computeAccessibleName(g))).toEqual(["テーマ", "文字の大きさ"])
  })

  it("interactive / onClick の行では従来どおり {} で呼ばれ、aria-labelledby も渡さない", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {})
    const calls: unknown[] = []
    mount(
      <SettingsListRow
        title="ログイン方法"
        onClick={() => {}}
        rightSlot={(control) => {
          calls.push(control)
          return <span>メール</span>
        }}
      />
    )
    expect(calls).toEqual([{}])
    expect(container.querySelector("[id$='-label']")).toBeNull()
  })

  it("disabled の行でも aria-labelledby を渡す（disabled: true と並ぶ）", () => {
    const calls: Array<Record<string, unknown>> = []
    mount(
      <SettingsListRow
        title="テーマ"
        disabled
        rightSlot={(control) => {
          calls.push(control as Record<string, unknown>)
          return <Switch {...control} />
        }}
      />
    )
    const label = container.querySelector("label")!
    expect(calls.at(-1)).toMatchObject({ disabled: true, "aria-labelledby": label.id })
  })

  it("関数が null を返した行は label を出さず、id の宙づりも無い", () => {
    mount(<SettingsListRow title="テーマ" description="説明" rightSlot={() => null} />)
    expect(container.querySelector("label")).toBeNull()
    expect(container.querySelector("[id]")).toBeNull()
  })
})
