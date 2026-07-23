import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import {
  ErrorState,
  NotFoundIllustration,
} from "../src/components/patterns/error-state"
import * as PublicApi from "../src/index"

describe("ErrorState", () => {
  it("既定の error 表示と既存 retry markup を維持する", () => {
    const output = renderToStaticMarkup(<ErrorState onRetry={() => {}} />)

    expect(output).toContain('data-kind="error"')
    expect(output).toContain("エラーが発生しました")
    expect(output).toContain("しばらくしてからもう一度お試しください")
    expect(output).toContain('data-slot="button"')
    expect(output).toContain("再試行")
    expect(output).not.toContain('data-slot="not-found-illustration"')
  })

  it("kind=notFound と action だけで標準 404 表示が成立する", () => {
    const output = renderToStaticMarkup(
      <ErrorState
        kind="notFound"
        action={<a href="/">トップへ戻る</a>}
      />,
    )

    expect(output).toContain('data-kind="notFound"')
    expect(output).toContain("ページが見つかりません")
    expect(output).toContain("お探しのページは移動または削除された可能性があります。")
    expect(output).toContain('data-slot="not-found-illustration"')
    expect(output).toContain('href="/"')
    expect(output).not.toContain("再試行")
  })

  it("notFound の文言・イラストは上書きできる", () => {
    const output = renderToStaticMarkup(
      <ErrorState
        kind="notFound"
        title="記事がありません"
        description=""
        icon={<span>custom</span>}
      />,
    )

    expect(output).toContain("記事がありません")
    expect(output).toContain("custom")
    expect(output).not.toContain("お探しのページ")
    expect(output).not.toContain("<svg")
  })

  it("NotFoundIllustration は semantic token のみで着色して公開する", () => {
    const output = renderToStaticMarkup(<NotFoundIllustration />)

    expect(output).not.toMatch(/#[0-9a-f]{3,8}/i)
    expect(output).toMatch(/(?:var\(--[A-Za-z0-9-]+\)|currentColor)/)
    expect(output).toContain('aria-hidden="true"')
    expect(PublicApi.NotFoundIllustration).toBe(NotFoundIllustration)
  })
})
