/**
 * @vitest-environment jsdom
 *
 * SelectContent の高さ上限（issue #826）。popper（既定）のときは一覧の高さを
 * 「24rem と画面の使える高さ（--radix-select-content-available-height）の小さいほう」にし、
 * 狭い画面でも一覧が画面外にはみ出さないようにする。item-aligned は Radix 側が高さを決めるので
 * 従来どおり max-h-96 のまま変えない。
 *
 * jsdom はレイアウトを解決しないので、ここで見るのはクラスだけ。実際の高さは
 * select.stories.tsx の FitsShortViewport / KeepsMaxHeightOnTallScreen（`npm run test:interaction`）が押さえる。
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, describe, expect, it } from "vitest"

import { Select, SelectContent, SelectItem, SelectTrigger } from "../src/components/ui/select"

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const AVAILABLE = "max-h-[min(24rem,var(--radix-select-content-available-height))]"

let host: HTMLElement | null = null
let root: Root | null = null

afterEach(() => {
  act(() => root?.unmount())
  host?.remove()
  host = null
  root = null
  document.body.innerHTML = ""
})

function renderOpen(content: React.ReactElement) {
  host = document.createElement("div")
  document.body.appendChild(host)
  root = createRoot(host)
  act(() => {
    root!.render(
      <Select defaultOpen defaultValue="a">
        <SelectTrigger aria-label="選択" />
        {content}
      </Select>
    )
  })
  return document.querySelector<HTMLElement>('[data-slot="select-content"]')!
}

const classes = (el: HTMLElement) => el.className.split(/\s+/)

describe("SelectContent の高さ上限（#826）", () => {
  it("popper（既定）は使える高さまでに縮み、24rem の上限も保つ", () => {
    const content = renderOpen(
      <SelectContent>
        <SelectItem value="a">A</SelectItem>
      </SelectContent>
    )
    expect(classes(content)).toContain(AVAILABLE)
    expect(classes(content)).not.toContain("max-h-96")
  })

  it("item-aligned は従来どおり max-h-96 のまま", () => {
    const content = renderOpen(
      <SelectContent position="item-aligned">
        <SelectItem value="a">A</SelectItem>
      </SelectContent>
    )
    expect(classes(content)).toContain("max-h-96")
    expect(content.className).not.toContain("available-height")
  })

  it("className の max-h は従来どおり上書きできる", () => {
    const content = renderOpen(
      <SelectContent className="max-h-60">
        <SelectItem value="a">A</SelectItem>
      </SelectContent>
    )
    expect(classes(content)).toContain("max-h-60")
    expect(content.className).not.toContain("available-height")
  })
})
