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
  Celebration,
  Chip,
  DataTable,
  DetailSheetHeader,
  DetailSheetScaffold,
  EmptyState,
  KebabMenu,
  KeyboardAwareSheetFooter,
  MobileAppHeader,
  MobileFloatingActionButton,
  MultiSelect,
  ShareButtons,
  StatusActionBadge,
  SubNav,
  toast,
} from "../src/index"
import type { DataTableColumn } from "../src/index"

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

  it("新規 variant: inverse / ghost-inverse / glass-inverse がレンダリング可能", () => {
    expect(html(<Button variant="inverse">x</Button>)).toContain('data-variant="inverse"')
    expect(html(<Button variant="ghost-inverse">x</Button>)).toContain('data-variant="ghost-inverse"')
    const glassInverse = html(<Button variant="glass-inverse">x</Button>)
    expect(glassInverse).toContain('data-variant="glass-inverse"')
    expect(glassInverse).toContain("glass-specular")
    expect(glassInverse).toContain("glass-inverse")
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
    expect(out).toContain('data-slot="chip-remove"')
    expect(out).not.toContain('role="button"')
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

describe("MultiSelect — accessibility structure", () => {
  it("clear action は trigger button の外側に独立した button として出る", () => {
    const out = html(
      <MultiSelect
        options={[{ value: "tokyo", label: "東京" }]}
        value={["tokyo"]}
        onChange={() => {}}
      />
    )
    expect(out).toContain('data-slot="multi-select-trigger"')
    expect(out).toContain('data-slot="multi-select-clear"')
    expect(out).not.toContain('role="button"')
  })
})

describe("ShareButtons / KebabMenu / Celebration — backwards-compat", () => {
  it("ShareButtons の既存 default と拡張 providers がレンダリング可能", () => {
    expect(html(<ShareButtons url="https://example.com" />)).toContain("Facebook")
    const out = html(
      <ShareButtons
        url="https://example.com"
        providers={["instagram", "email", "whatsapp", "telegram", "copy"]}
        layout="inline"
      />
    )
    expect(out).toContain("Instagram")
    expect(out).toContain("メール")
    expect(out).toContain("WhatsApp")
    expect(out).toContain("Telegram")
  })

  it("KebabMenu の拡張 item 型が既存 trigger と共存する", () => {
    const out = html(
      <KebabMenu
        items={[
          { label: "編集", description: "説明", shortcut: "E", disabled: true },
          { type: "separator" },
          { label: "削除", destructive: true },
        ]}
      />
    )
    expect(out).toContain('data-slot="kebab-menu"')
    expect(out).toContain("メニュー")
  })

  it("Celebration が overlay としてレンダリング可能", () => {
    const out = html(<Celebration title="達成しました" description="完了です" />)
    expect(out).toContain('data-slot="celebration"')
    expect(out).toContain("達成しました")
    expect(out).toContain("完了です")
  })
})

describe("SubNav / EmptyState / DataTable — improvement APIs", () => {
  it("SubNav item description/title が title と aria-describedby に反映される", () => {
    const out = html(
      <SubNav
        value="list"
        onChange={() => undefined}
        items={[
          { label: "一覧", value: "list", description: "未完了を含む一覧" },
          { label: "完了", value: "done", title: "完了済みだけを表示" },
        ]}
      />
    )
    expect(out).toContain('title="未完了を含む一覧"')
    expect(out).toContain("aria-describedby=")
    expect(out).toContain("完了済みだけを表示")
  })

  it("EmptyState size が compact / inline でレンダリング可能", () => {
    expect(html(<EmptyState size="compact" title="空です" description="説明" />)).toContain(
      'data-size="compact"'
    )
    expect(html(<EmptyState size="inline" title="空です" description="説明" />)).toContain(
      'data-size="inline"'
    )
  })

  it("EmptyState actionLabel/actionLayout が画面別 Button className なしで CTA を出せる", () => {
    const out = html(
      <EmptyState
        title="まだありません"
        description="最初の項目を追加できます。"
        actionLabel="追加する"
        actionLayout="content"
      />
    )
    expect(out).toContain('data-action-layout="content"')
    expect(out).toContain('data-slot="empty-state-action"')
    expect(out).toContain("追加する")
  })

  it("DataTable rows/columns API が既存ラッパー API と共存する", () => {
    interface Row {
      id: string
      name: string
      score: number
    }
    const columns: DataTableColumn<Row>[] = [
      { key: "name", header: "名前", sortable: true },
      { key: "score", header: "点数", align: "right", sortable: true },
    ]
    const out = html(
      <DataTable
        rows={[
          { id: "a", name: "佐藤", score: 10 },
          { id: "b", name: "田中", score: 20 },
        ]}
        columns={columns}
        getRowId={(row) => row.id}
        selection={{ mode: "multi", selectedRowIds: ["a"] }}
        defaultSort={{ key: "score", direction: "desc" }}
      />
    )
    expect(out).toContain('data-slot="data-table"')
    expect(out).toContain('data-slot="data-table-table"')
    expect(out).toContain("佐藤")
    expect(out).toContain("田中")
    expect(out).toContain('data-selected="true"')
  })
})

describe("Mobile DS recipes — render contracts", () => {
  it("DetailSheetScaffold + DetailSheetHeader が KebabMenu trailing を保持する", () => {
    const out = html(
      <DetailSheetScaffold
        header={
          <DetailSheetHeader
            title="詳細"
            trailing={<KebabMenu items={[{ label: "編集" }]} />}
          />
        }
        footer={<KeyboardAwareSheetFooter><Button>保存する</Button></KeyboardAwareSheetFooter>}
      >
        body
      </DetailSheetScaffold>
    )
    expect(out).toContain('data-slot="detail-sheet-scaffold"')
    expect(out).toContain('data-slot="detail-sheet-header-trailing"')
    expect(out).toContain('data-slot="keyboard-aware-sheet-footer"')
  })

  it("MobileFloatingActionButton は label を aria-label にする", () => {
    const out = html(<MobileFloatingActionButton label="追加する" />)
    expect(out).toContain('data-slot="mobile-floating-action-button"')
    expect(out).toContain('aria-label="追加する"')
  })

  it("MobileFloatingActionButton は JS 側から variant/size が渡っても recipe 固定値を維持する", () => {
    const UnsafeMobileFab = MobileFloatingActionButton as React.ComponentType<Record<string, unknown>>
    const out = html(<UnsafeMobileFab label="追加する" variant="destructive" size="xl" />)
    expect(out).toContain('data-variant="default"')
    expect(out).toContain('data-size="icon-lg"')
  })

  it("MobileAppHeader は brand と compact status を分離して描画する", () => {
    const out = html(
      <MobileAppHeader
        sticky={false}
        brand={<span>Brand</span>}
        compactStatus={<StatusActionBadge state="pending" label="未同期" compact count={3} />}
      />
    )
    expect(out).toContain('data-slot="mobile-app-header-brand"')
    expect(out).toContain('data-slot="status-action-badge"')
  })

  it("StatusActionBadge は onClick ありなら button として描画する", () => {
    const out = html(<StatusActionBadge state="pending" label="同期する" onClick={() => undefined} />)
    expect(out).toMatch(/^<button /)
    expect(out).toContain('data-slot="status-action-badge"')
  })

  it("StatusActionBadge は passive status のとき button 専用 props を DOM に漏らさない", () => {
    const UnsafeStatusBadge = StatusActionBadge as React.ComponentType<Record<string, unknown>>
    const out = html(<UnsafeStatusBadge label="同期済み" form="todo-form" name="sync" value="1" />)
    expect(out).toMatch(/^<span /)
    expect(out).not.toContain("form=")
    expect(out).not.toContain("name=")
    expect(out).not.toContain("value=")
  })

  it("toast transient helper は SSR で no-op id を返す", () => {
    expect(toast.connectionRestored()).toBe("")
    expect(toast.saveComplete()).toBe("")
    expect(toast.retryStarted()).toBe("")
    expect(toast.retryFailed()).toBe("")
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
