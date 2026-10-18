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

  it("interactive / onClick の行では関数の rightSlot を {} で呼び、描画はするが結ばない", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {})
    const calls: unknown[] = []
    mount(
      <SettingsListRow
        title="ログイン方法"
        description="メール"
        onClick={() => {}}
        rightSlot={(control) => {
          calls.push(control)
          return <span data-testid="right" id={control.id}>メール</span>
        }}
      />
    )
    expect(calls).toEqual([{}])
    const right = container.querySelector('[data-testid="right"]')!
    expect(right.textContent).toBe("メール")
    expect(right.hasAttribute("id")).toBe(false)
    expect(container.querySelector("label")).toBeNull()
    expect(container.querySelector("[id$='-description']")).toBeNull()
  })

  it("controlId だけ渡して rightSlot の要素にその id が無いと、開発ビルドで描画後に警告する", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    mount(<SettingsListRow title="通知" controlId="missing-id" rightSlot={<Switch aria-label="通知" />} />)
    expect(warn).toHaveBeenCalledTimes(1)
    expect(String(warn.mock.calls[0][0])).toContain('controlId="missing-id"')
  })

  it("controlId と同じ id の操作部品があれば警告しない", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    mount(<SettingsListRow title="通知" controlId="present-id" rightSlot={<Switch id="present-id" />} />)
    expect(warn).not.toHaveBeenCalled()
  })

  it("disabled の行は label に cursor-pointer を付けず、関数の rightSlot に disabled を渡してラベルを押しても切り替わらない", () => {
    const onCheckedChange = vi.fn()
    const calls: unknown[] = []
    mount(
      <SettingsListRow
        title="通知"
        disabled
        rightSlot={(control) => {
          calls.push(control)
          return <Switch {...control} onCheckedChange={onCheckedChange} />
        }}
      />
    )
    const label = container.querySelector<HTMLLabelElement>("label")!
    expect(label.className).not.toContain("cursor-pointer")
    expect(calls.at(-1)).toMatchObject({ disabled: true })
    act(() => {
      label.click()
    })
    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  it("disabled でない行の label には cursor-pointer が付き、disabled は渡さない", () => {
    const calls: unknown[] = []
    mount(
      <SettingsListRow
        title="通知"
        rightSlot={(control) => {
          calls.push(control)
          return <Switch {...control} />
        }}
      />
    )
    expect(container.querySelector("label")!.className).toContain("cursor-pointer")
    expect(calls.at(-1)).not.toHaveProperty("disabled")
  })

  it("関数の rightSlot が null を返したら結ばない（title は <p>、description に id を振らない）", () => {
    const el = host(<SettingsListRow title="通知" description="説明" rightSlot={() => null} />)
    expect(el.querySelector("label")).toBeNull()
    expect(el.querySelector('[data-slot="settings-list-row-body"] > p')?.textContent).toBe("通知")
    expect(el.querySelector("[id]")).toBeNull()
    expect(el.querySelector('[data-slot="settings-list-row-right"]')).toBeNull()
  })

  it("自動採番の id は id に使える文字だけで組み立てる", () => {
    mount(<SettingsListRow title="通知" rightSlot={(c) => <Switch {...c} />} />)
    const id = container.querySelector('[role="switch"]')!.id
    expect(id).toMatch(/^settings-row-[a-zA-Z0-9_-]+-control$/)
  })

  it("controlId を渡しても rightSlot の要素が null / false なら結ばない", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    for (const slot of [null, false, undefined]) {
      const el = host(<SettingsListRow title="通知" description="説明" controlId="cond" rightSlot={slot} />)
      expect(el.querySelector("label")).toBeNull()
      expect(el.querySelector("[id]")).toBeNull()
    }
    mount(<SettingsListRow title="通知" controlId="cond2" rightSlot={false} />)
    expect(warn).not.toHaveBeenCalled()
  })
})
