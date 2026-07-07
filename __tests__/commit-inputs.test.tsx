/**
 * Commit 系入力（CommitInput / CommitTextarea / CommitAutoGrowTextarea）
 *
 * IME(日本語変換)を壊さない「確定時コミット」入力の回帰防止。
 * 心臓部は composition ガードの判定（変換中は commit しない）なので、
 * フックから切り出した純関数 shouldCommitOnChange を単体テストで固定する。
 * さらに 3 コンポーネントが SSR で例外なくレンダリングできることを確認する。
 *
 * 実行: npm run test
 *
 * SSR 不使用: jsdom 不要・react-dom/server だけで検証できる範囲に絞る。
 * composition イベント発火を伴うインタラクティブ動作は Storybook 実ブラウザで確認する。
 */
import { describe, it, expect } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import * as React from "react"

import { CommitInput } from "../src/components/ui/commit-input"
import { CommitTextarea } from "../src/components/ui/commit-textarea"
import { CommitAutoGrowTextarea } from "../src/components/ui/commit-auto-grow-textarea"
import { shouldCommitOnChange } from "../src/components/ui/use-commit-draft"
import * as PublicApi from "../src/index"

describe("shouldCommitOnChange（composition ガードの純関数）", () => {
  it("非変換 & ヒントなし → commit する", () => {
    expect(shouldCommitOnChange(false, false)).toBe(true)
    expect(shouldCommitOnChange(false, undefined)).toBe(true)
  })

  it("内部 ref が変換中 → commit しない", () => {
    expect(shouldCommitOnChange(true, false)).toBe(false)
    expect(shouldCommitOnChange(true, undefined)).toBe(false)
  })

  it("isComposing ヒントが立つ → commit しない（ref が立たないブラウザ対策）", () => {
    expect(shouldCommitOnChange(false, true)).toBe(false)
  })

  it("両方変換中 → commit しない", () => {
    expect(shouldCommitOnChange(true, true)).toBe(false)
  })
})

describe("Commit 系入力の SSR レンダリング", () => {
  it("CommitInput が value を初期 draft として描画する", () => {
    const html = renderToStaticMarkup(
      <CommitInput value="こんにちは" onCommit={() => {}} placeholder="名前" />,
    )
    expect(html).toContain('value="こんにちは"')
    expect(html).toContain('placeholder="名前"')
    expect(html).toContain("<input")
  })

  it("CommitTextarea が value を初期 draft として描画する", () => {
    const html = renderToStaticMarkup(
      <CommitTextarea value="メモ本文" onCommit={() => {}} placeholder="メモ" />,
    )
    expect(html).toContain("メモ本文")
    expect(html).toContain("<textarea")
  })

  it("CommitAutoGrowTextarea が value を初期 draft として描画する", () => {
    const html = renderToStaticMarkup(
      <CommitAutoGrowTextarea value="自動伸縮" onCommit={() => {}} minRows={2} />,
    )
    expect(html).toContain("自動伸縮")
    expect(html).toContain("<textarea")
  })

  it("空 value でも例外なく SSR できる", () => {
    expect(() =>
      renderToStaticMarkup(
        <>
          <CommitInput value="" onCommit={() => {}} />
          <CommitTextarea value="" onCommit={() => {}} />
          <CommitAutoGrowTextarea value="" onCommit={() => {}} />
        </>,
      ),
    ).not.toThrow()
  })
})

describe("Public API エクスポート", () => {
  it("3 コンポーネント + フックが index からエクスポートされている", () => {
    expect(PublicApi.CommitInput).toBe(CommitInput)
    expect(PublicApi.CommitTextarea).toBe(CommitTextarea)
    expect(PublicApi.CommitAutoGrowTextarea).toBe(CommitAutoGrowTextarea)
    expect(typeof PublicApi.useCommitDraft).toBe("function")
  })
})
