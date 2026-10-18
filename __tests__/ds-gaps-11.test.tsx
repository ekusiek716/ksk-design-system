/** @vitest-environment jsdom */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { SettingsListRow } from "../src/components/patterns/settings-section"
import { Switch } from "../src/components/ui/switch"
import { resetDevWarnings } from "../src/lib/dev-warn"

const host = (ui: React.ReactElement) => {
  const el = document.createElement("div")
  el.innerHTML = renderToStaticMarkup(ui)
  return el
}

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

describe("SettingsListRow の操作部品との結び付け (#759)", () => {
  it("controlId なし・rightSlot が要素なら従来どおり title / description は <p> で label を出さない", () => {
    const el = host(
      <SettingsListRow title="通知" description="毎日のリマインダー" rightSlot={<Switch aria-label="通知" />} />
    )
    expect(el.querySelector("label")).toBeNull()
    const ps = el.querySelectorAll('[data-slot="settings-list-row-body"] > p')
    expect(ps).toHaveLength(2)
    expect(ps[0].className).toContain("typo-label-md")
    expect(ps[1].hasAttribute("id")).toBe(false)
  })

  it("controlId を渡すと title を label[for] に、description に id を振る（書体は同じ）", () => {
    const el = host(
      <SettingsListRow
        title="通知"
        description="毎日のリマインダー"
        controlId="notify"
        rightSlot={<Switch id="notify" aria-describedby="notify-description" />}
      />
    )
    const label = el.querySelector<HTMLLabelElement>('[data-slot="settings-list-row-label"]')!
    expect(label.tagName).toBe("LABEL")
    expect(label.htmlFor).toBe("notify")
    expect(label.className).toContain("typo-label-md")
    expect(label.className).toContain("truncate")
    expect(label.className).toContain("block")
    expect(el.querySelector("#notify-description")?.textContent).toBe("毎日のリマインダー")
  })

  it("rightSlot に関数を渡すと id / aria-describedby を受け取り、名前と説明が結ばれる", () => {
    mount(
      <SettingsListRow
        title="通知"
        description="毎日のリマインダー"
        rightSlot={(control) => <Switch {...control} />}
      />
    )
    const sw = container.querySelector<HTMLButtonElement>('[role="switch"]')!
    expect(sw.id).toBeTruthy()
    expect(sw.hasAttribute("aria-label")).toBe(false)
    expect(sw.labels?.[0]?.textContent).toBe("通知")
    const describedby = sw.getAttribute("aria-describedby")!
    expect(container.querySelector(`[id="${describedby}"]`)?.textContent).toBe("毎日のリマインダー")
  })

  it("controlId と関数の rightSlot を併用すると controlId を使う", () => {
    mount(<SettingsListRow title="通知" controlId="notify" rightSlot={(control) => <Switch {...control} />} />)
    const sw = container.querySelector<HTMLButtonElement>('[role="switch"]')!
    expect(sw.id).toBe("notify")
    // description が無いときは aria-describedby を付けない
    expect(sw.hasAttribute("aria-describedby")).toBe(false)
  })

  it("description が要素でも id を振る", () => {
    const el = host(
      <SettingsListRow
        title="通知"
        description={<span>毎日 <strong>9 時</strong></span>}
        controlId="notify"
        rightSlot={<Switch id="notify" />}
      />
    )
    expect(el.querySelector("#notify-description")?.textContent).toBe("毎日 9 時")
  })

  it("title が要素でも label[for] で包む", () => {
    const el = host(
      <SettingsListRow title={<span className="typo-label-md">通知</span>} controlId="notify" rightSlot={<Switch id="notify" />} />
    )
    const label = el.querySelector<HTMLLabelElement>("label")!
    expect(label.htmlFor).toBe("notify")
    expect(label.querySelector("span")?.textContent).toBe("通知")
  })

  it("ラベルのクリックで Switch が 1 回だけ切り替わる（二重発火しない）", () => {
    const onCheckedChange = vi.fn()
    mount(
      <SettingsListRow title="通知" rightSlot={(control) => <Switch {...control} onCheckedChange={onCheckedChange} />} />
    )
    const label = container.querySelector<HTMLLabelElement>("label")!
    act(() => {
      label.click()
    })
    expect(onCheckedChange).toHaveBeenCalledTimes(1)
    expect(onCheckedChange).toHaveBeenLastCalledWith(true)
    const sw = container.querySelector<HTMLButtonElement>('[role="switch"]')!
    act(() => {
      sw.click()
    })
    expect(onCheckedChange).toHaveBeenCalledTimes(2)
  })

  it("interactive / onClick の行（button）では label を出さず、開発ビルドで警告する", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const el = host(<SettingsListRow title="プロフィール" controlId="x" onClick={() => {}} />)
    expect(el.querySelector("label")).toBeNull()
    expect(el.querySelector("button p")?.textContent).toBe("プロフィール")
    expect(warn).toHaveBeenCalledTimes(1)
    expect(String(warn.mock.calls[0][0])).toContain("SettingsListRow")
  })

  it("controlId なしの既定では警告を出さない", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    host(<SettingsListRow title="プロフィール" onClick={() => {}} />)
    host(<SettingsListRow title="通知" rightSlot={<Switch aria-label="通知" />} />)
    expect(warn).not.toHaveBeenCalled()
  })

  it("関数の rightSlot を 2 行に使っても id が衝突しない", () => {
    mount(
      <>
        <SettingsListRow title="通知" rightSlot={(c) => <Switch {...c} />} />
        <SettingsListRow title="メール" rightSlot={(c) => <Switch {...c} />} />
      </>
    )
    const ids = [...container.querySelectorAll('[role="switch"]')].map((s) => s.id)
    expect(new Set(ids).size).toBe(2)
    const labels = [...container.querySelectorAll<HTMLButtonElement>('[role="switch"]')].map((s) => s.labels?.[0]?.textContent)
    expect(labels).toEqual(["通知", "メール"])
  })
})
