/**
 * 後方互換テスト
 *
 * 既存 API（旧 prop / 旧 export）が新版でも崩れていないかを検証する。
 * 新機能追加で既存利用者が壊れるとリリースが事故になるため、
 * 重要な変更を入れたらここに追加する。
 *
 * 実行: npm run test
 *
 * SSR 不使用: jsdom 不要・react-dom/server だけで検証できる範囲に絞る。
 * インタラクティブ動作は Storybook の interactions addon で確認すること。
 */
import { describe, it, expect } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import * as React from "react"

import {
  Button,
  Checkbox,
  Alert,
  AlertTitle,
  AlertDescription,
  Badge,
  Card,
  Chip,
} from "../src/index"

const html = (el: React.ReactElement) => renderToStaticMarkup(el)

describe("Button — backwards-compat", () => {
  it("既存 variant が引き続きレンダリング可能", () => {
    for (const variant of [
      "default", "secondary", "secondary-switch", "tertiary",
      "ghost", "link", "destructive", "glass", "accent",
    ] as const) {
      const out = html(<Button variant={variant}>x</Button>)
      expect(out).toContain('data-slot="button"')
      expect(out).toContain(`data-variant="${variant}"`)
    }
  })

  it("既存 size が引き続きレンダリング可能", () => {
    for (const size of [
      "xs", "sm", "default", "lg", "xl", "icon",
      "icon-sm", "icon-lg", "icon-xl", "match",
    ] as const) {
      const out = html(<Button size={size}>x</Button>)
      expect(out).toContain('data-slot="button"')
      expect(out).toContain(`data-size="${size}"`)
    }
  })

  it("新規 variant: inverse / ghost-inverse がレンダリング可能", () => {
    expect(html(<Button variant="inverse">x</Button>)).toContain('data-variant="inverse"')
    expect(html(<Button variant="ghost-inverse">x</Button>)).toContain('data-variant="ghost-inverse"')
  })

  it("新規 size: hero がレンダリング可能", () => {
    const out = html(<Button size="hero">CTA</Button>)
    expect(out).toContain('data-size="hero"')
    expect(out).toContain("rounded-full")
    expect(out).toContain("min-h-14")
  })
})

describe("Checkbox — backwards-compat", () => {
  it("label なし: 素のチェックボックスのまま", () => {
    const out = html(<Checkbox />)
    expect(out).toContain('data-slot="checkbox"')
    expect(out).not.toContain('data-slot="checkbox-row"')
  })

  it("label あり: 行レイアウトに切替", () => {
    const out = html(<Checkbox label="正社員" />)
    expect(out).toContain('data-slot="checkbox-row"')
    expect(out).toContain("正社員")
  })

  it("count を渡すと数字がフォーマットされて表示", () => {
    const out = html(<Checkbox label="正社員" count={1234} />)
    expect(out).toContain("1,234")
  })

  it("description を渡すとサブテキストが表示", () => {
    const out = html(<Checkbox label="主要ラベル" description="サブテキスト" />)
    expect(out).toContain("主要ラベル")
    expect(out).toContain("サブテキスト")
  })
})

describe("Alert — backwards-compat", () => {
  it("既存 composable API がそのまま動く", () => {
    const out = html(
      <Alert variant="success">
        <AlertTitle>完了</AlertTitle>
        <AlertDescription>送信しました</AlertDescription>
      </Alert>
    )
    expect(out).toContain('data-slot="alert"')
    expect(out).toContain('data-variant="success"')
    expect(out).toContain('data-slot="alert-title"')
    expect(out).toContain("完了")
    expect(out).toContain("送信しました")
  })

  it("新規 prop ベース API: title だけで自動アイコン表示", () => {
    const out = html(<Alert variant="warning" title="注意" description="メンテ予定" />)
    expect(out).toContain('data-slot="alert"')
    expect(out).toContain('data-variant="warning"')
    expect(out).toContain("注意")
    expect(out).toContain("メンテ予定")
    // 自動アイコンが入る（svg がレンダリングされる）
    expect(out).toContain("<svg")
  })

  it("prop ベースは bordered variant のみ。inline は composable のみ", () => {
    // inline + prop だけ渡しても child がないので空 div になる（icon マップを参照しない）
    const out = html(<Alert variant="inline-info" title="x" />)
    expect(out).toContain('data-variant="inline-info"')
    // bordered icon マップを参照していない（iconsax の svg は入らない想定）
  })
})

describe("Chip — backwards-compat", () => {
  it("既存 variant / removable がそのまま動く", () => {
    const out = html(<Chip variant="filled" removable>tag</Chip>)
    expect(out).toContain('data-slot="chip"')
    expect(out).toContain('data-variant="filled"')
    expect(out).toContain("tag")
  })

  it("新規 count: バッジが表示", () => {
    const out = html(<Chip selected count={156}>すべて</Chip>)
    expect(out).toContain("156")
    expect(out).toMatch(/data-selected="(true|)"/)
  })

  it("新規 soldOut: button が disabled + 斜線オーバーレイ", () => {
    const out = html(<Chip soldOut shape="square" size="tile">5号</Chip>)
    expect(out).toMatch(/data-sold-out="(true|)"/)
    expect(out).toContain("disabled")
    expect(out).toContain("rotate-45")
  })

  it("新規 href: <a> でレンダリング", () => {
    const out = html(<Chip href="/q/foo">foo</Chip>)
    expect(out).toMatch(/^<a /)
    expect(out).toContain('href="/q/foo"')
  })

  it("soldOut + href は href を無視して button + disabled", () => {
    const out = html(<Chip soldOut href="/q/foo">5号</Chip>)
    expect(out).toMatch(/^<button /)
  })
})

describe("Badge / Card — data-variant 出力", () => {
  it("Badge に data-variant", () => {
    expect(html(<Badge variant="success">x</Badge>)).toContain('data-variant="success"')
    expect(html(<Badge>x</Badge>)).toContain('data-variant="default"')
  })

  it("Card に data-variant", () => {
    expect(html(<Card variant="media">x</Card>)).toContain('data-variant="media"')
    expect(html(<Card>x</Card>)).toContain('data-variant="default"')
  })
})
