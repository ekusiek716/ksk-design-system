/**
 * @vitest-environment jsdom
 */
/**
 * CompactFilePicker / ImageAttachmentPicker の loading 文言 i18n（issue #539）。
 *
 * loading 時のボタン文言「処理中」がコンポーネント内に直書きされていて、
 * 多言語対応アプリ（belle-todo 等）の英語 UI にも日本語が漏れ出ていた。
 * ConfirmDialog の loadingLabel と同じ形で差し替え口を追加し、あわせて
 * consumer 側が文言に依存せず状態判定できるよう aria-busy を付与する。
 *
 * CompactFilePicker は Portal やクライアント専用フックに依存しないため、
 * content-carousel.test.tsx と同じ renderToStaticMarkup + DOM 解析方式で検証する。
 */
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import {
  CompactFilePicker,
  ImageAttachmentPicker,
} from "../src/components/patterns/compact-file-picker"
import * as PublicApi from "../src/index"

function parse(markup: string) {
  const container = document.createElement("div")
  container.innerHTML = markup
  return container
}

function getTriggerButton(markup: string) {
  return parse(markup).querySelector('[data-slot="button"]')
}

describe("CompactFilePicker loadingLabel (#539)", () => {
  it("loadingLabel 未指定時は既定の「処理中」を表示する（後方互換）", () => {
    const button = getTriggerButton(
      renderToStaticMarkup(<CompactFilePicker loading />),
    )

    expect(button?.textContent).toBe("処理中")
  })

  it("loadingLabel を渡すとボタン文言が差し替わる", () => {
    const button = getTriggerButton(
      renderToStaticMarkup(
        <CompactFilePicker loading loadingLabel="Uploading…" />,
      ),
    )

    expect(button?.textContent).toBe("Uploading…")
    expect(button?.textContent).not.toBe("処理中")
  })

  it("loading=false のときは loadingLabel でなく triggerLabel を表示する", () => {
    const button = getTriggerButton(
      renderToStaticMarkup(
        <CompactFilePicker
          triggerLabel="選択する"
          loadingLabel="Uploading…"
        />,
      ),
    )

    expect(button?.textContent).toBe("選択する")
  })

  it("loading=true のとき aria-busy=\"true\" を持つ", () => {
    const button = getTriggerButton(
      renderToStaticMarkup(<CompactFilePicker loading />),
    )

    expect(button?.getAttribute("aria-busy")).toBe("true")
  })

  it("loading=false（既定）のとき aria-busy 属性を持たない", () => {
    const button = getTriggerButton(renderToStaticMarkup(<CompactFilePicker />))

    expect(button?.hasAttribute("aria-busy")).toBe(false)
  })
})

describe("ImageAttachmentPicker への loadingLabel 伝播（#539）", () => {
  it("ImageAttachmentPickerProps は accept/icon だけを除外し loadingLabel を継承する", () => {
    const button = getTriggerButton(
      renderToStaticMarkup(
        <ImageAttachmentPicker loading loadingLabel="アップロード中…" />,
      ),
    )

    expect(button?.textContent).toBe("アップロード中…")
    expect(button?.getAttribute("aria-busy")).toBe("true")
  })

  it("package root から CompactFilePicker / ImageAttachmentPicker を公開する", () => {
    expect(PublicApi.CompactFilePicker).toBe(CompactFilePicker)
    expect(PublicApi.ImageAttachmentPicker).toBe(ImageAttachmentPicker)
  })
})
