/**
 * Chip の選択切り替えのちらつき対策（issue #725）。
 * 色のアニメーションはマウス操作の端末（hover:hover かつ pointer:fine）だけにし、
 * 本体・× ボタン・中の要素のタップのハイライトを透明にする。
 */
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { Chip } from "../src/components/patterns/chip"

const FINE = "[@media(hover:hover)_and_(pointer:fine)]:transition-colors"
const DESC = "[&amp;_*]:[-webkit-tap-highlight-color:transparent]"

describe("Chip tap flicker (#725)", () => {
  it("色のアニメーションは pointer:fine のときだけ（hover:hover 単独の transition を持たない）", () => {
    for (const html of [
      renderToStaticMarkup(<Chip selected>a</Chip>),
      renderToStaticMarkup(<Chip count={3}>a</Chip>),
      renderToStaticMarkup(<Chip removable onRemove={() => {}}>a</Chip>),
      renderToStaticMarkup(<Chip href="/x">a</Chip>),
    ]) {
      expect(html).toContain(FINE)
      expect(html).not.toContain("[@media(hover:hover)]:transition-colors")
    }
  })

  it("本体・× ボタン・removable の外枠の中の要素もタップのハイライトを透明にする", () => {
    expect(renderToStaticMarkup(<Chip>a</Chip>)).toContain(DESC)
    const removable = renderToStaticMarkup(<Chip removable onRemove={() => {}}>a</Chip>)
    expect(removable.split(DESC).length - 1).toBeGreaterThanOrEqual(3)
  })
})
