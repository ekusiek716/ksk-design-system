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
  AutoGrowTextarea,
  Badge,
  BottomTabBar,
  Card,
  Celebration,
  CelebrationDialog,
  Chip,
  ChipFilterBar,
  CollapsibleChipField,
  CountdownHero,
  DataTable,
  DateField,
  DetailSheetHeader,
  DetailSheetScaffold,
  EmptyState,
  KebabMenu,
  KeyboardAwareSheetFooter,
  MobileAppHeader,
  MobileFloatingActionButton,
  MobileTabBar,
  MultiSelect,
  PresenceIndicator,
  ShareButtons,
  StatusActionBadge,
  SubNav,
  toast,
  weddingCategories,
  projectCategories,
  getCategoricalColor,
  getCategoricalSubtle,
  getCategoricalBold,
} from "../src/index"
import type { DataTableColumn, CategoryPresetItem } from "../src/index"

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

  it("touch device 向けの tap highlight 抑制を含む", () => {
    const out = html(<Chip selected count={1}>すべて</Chip>)
    expect(out).toContain("webkit-tap-highlight-color")
    expect(out).toContain("@media(hover:hover)")
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

  it("Celebration: duration / colors / driftRange 指定でも既存デフォルト挙動を壊さずレンダリング可能", () => {
    const out = html(
      <Celebration
        title="カスタム confetti"
        duration={1200}
        driftRange={40}
        colors={["var(--Categorical-1-Bold)", "var(--Categorical-5-Bold)"]}
      />
    )
    expect(out).toContain('data-slot="celebration"')
    expect(out).toContain("var(--Categorical-1-Bold)")
  })

  it("Celebration: emojiAnimation が既定 pop のままレンダリング可能", () => {
    const out = html(<Celebration trigger="emoji" emoji="🎉" title="ポップ" />)
    expect(out).toContain('data-slot="celebration"')
    expect(out).toContain("🎉")
  })

  it("Celebration: emojiAnimation=bounce で celebration-emoji-pop を適用してレンダリング可能", () => {
    const out = html(
      <Celebration trigger="emoji" emoji="🎊" emojiAnimation="bounce" title="弾む" />
    )
    expect(out).toContain('data-slot="celebration"')
    expect(out).toContain("celebration-emoji-pop")
  })

  it("Celebration: effect=\"burst\" で celebration-confetti-burst を適用してレンダリング可能（既定の fall は維持）", () => {
    const out = html(
      <Celebration trigger="confetti" effect="burst" title="弾けました" />
    )
    expect(out).toContain('data-slot="celebration"')
    expect(out).toContain("celebration-confetti-burst")

    const fallOut = html(<Celebration trigger="confetti" title="降ります" />)
    expect(fallOut).toContain("celebration-confetti-fall")
    expect(fallOut).not.toContain("celebration-confetti-burst")
  })
})

describe("CollapsibleChipField — backwards-compat", () => {
  type Category = "work" | "family" | "health"
  const LABELS: Record<Category, string> = { work: "仕事", family: "家族", health: "健康" }

  it("未選択時は全 chip が展開表示される", () => {
    const out = html(
      <CollapsibleChipField<Category>
        label="カテゴリ"
        options={["work", "family", "health"]}
        selected=""
        onSelect={() => undefined}
        getLabel={(k) => LABELS[k]}
      />
    )
    expect(out).toContain('data-slot="collapsible-chip-field"')
    expect(out).toContain("仕事")
    expect(out).toContain("家族")
    expect(out).toContain("健康")
  })

  it("選択済みの場合は選択中の chip のみ表示される", () => {
    const out = html(
      <CollapsibleChipField<Category>
        icon={<span aria-hidden="true">*</span>}
        options={["work", "family", "health"]}
        selected="family"
        onSelect={() => undefined}
        onClear={() => undefined}
        getLabel={(k) => LABELS[k]}
      />
    )
    expect(out).toContain("家族")
    expect(out).not.toContain("仕事")
    expect(out).not.toContain("健康")
  })

  it("alwaysExpanded 指定時は選択済みでも全 chip 表示される", () => {
    const out = html(
      <CollapsibleChipField<Category>
        label="比較"
        options={["work", "family", "health"]}
        selected="work"
        onSelect={() => undefined}
        getLabel={(k) => LABELS[k]}
        alwaysExpanded
      />
    )
    expect(out).toContain("仕事")
    expect(out).toContain("家族")
    expect(out).toContain("健康")
  })
})

describe("ChipFilterBar — backwards-compat", () => {
  it("children と結果件数（デフォルトラベル）がレンダリング可能", () => {
    const out = html(
      <ChipFilterBar resultCount={42}>
        <Chip>すべて</Chip>
      </ChipFilterBar>
    )
    expect(out).toContain('data-slot="chip-filter-bar"')
    expect(out).toContain("すべて")
    expect(out).toContain("42件")
  })

  it("resultCountLabel でカスタム件数表示に差し替えられる", () => {
    const out = html(
      <ChipFilterBar resultCount={7} resultCountLabel={(n) => `${n} results`}>
        <Chip>フィルタ</Chip>
      </ChipFilterBar>
    )
    expect(out).toContain("7 results")
    expect(out).not.toContain("7件")
  })

  it("sticky + stickyOffset が top インラインスタイルに反映される", () => {
    const out = html(
      <ChipFilterBar sticky stickyOffset={56}>
        <Chip>絞り込み</Chip>
      </ChipFilterBar>
    )
    expect(out).toContain("sticky")
    expect(out).toContain("top:56px")
  })

  it("bare=true では children のみレンダリングされる（ラッパーなし）", () => {
    const out = html(
      <ChipFilterBar bare>
        <Chip>bare</Chip>
      </ChipFilterBar>
    )
    expect(out).not.toContain('data-slot="chip-filter-bar"')
    expect(out).toContain("bare")
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

  it("MobileFloatingActionButton は pill nav 横並び offset を明示できる", () => {
    const out = html(
      <MobileFloatingActionButton
        label="追加する"
        bottomOffset="bottom-nav-pill-inline"
      />
    )
    expect(out).toContain('data-bottom-offset="bottom-nav-pill-inline"')
    expect(out).toContain("[--ksk-fab-bottom-offset:1rem]")
  })

  it("BottomTabBar は keyboardBehavior を DOM contract に出す", () => {
    const out = html(
      <BottomTabBar
        keyboardBehavior="hide"
        items={[{ label: "ホーム", icon: <span aria-hidden="true">H</span>, isActive: true }]}
      />
    )
    expect(out).toContain('data-slot="bottom-tab-bar"')
    expect(out).toContain('data-keyboard-behavior="hide"')
  })

  it("BottomTabBar pill は lift 用 CSS variable を持つ", () => {
    const out = html(
      <BottomTabBar
        variant="pill"
        keyboardBehavior="lift"
        items={[{ label: "ホーム", icon: <span aria-hidden="true">H</span>, isActive: true }]}
      />
    )
    expect(out).toContain('data-slot="bottom-nav-pill"')
    expect(out).toContain('data-keyboard-behavior="lift"')
    expect(out).toContain("--ksk-bottom-tab-bar-keyboard-inset:0px")
  })

  it("BottomTabBar pill は floatingPosition 未指定で従来どおり中央フロートする（後方互換）", () => {
    const out = html(
      <BottomTabBar
        variant="pill"
        items={[{ label: "ホーム", icon: <span aria-hidden="true">H</span>, isActive: true }]}
      />
    )
    expect(out).toContain("left-1/2")
    expect(out).toContain("-translate-x-1/2")
  })

  it("BottomTabBar pill は floatingPosition='left' で左寄せ + FAB スペースを確保する", () => {
    const out = html(
      <BottomTabBar
        variant="pill"
        floatingPosition="left"
        items={[{ label: "ホーム", icon: <span aria-hidden="true">H</span>, isActive: true }]}
      />
    )
    expect(out).toContain("left-3")
    expect(out).toContain("right-20")
    expect(out).not.toContain("left-1/2")
  })

  it("MobileTabBar は tabs/activeTab から BottomTabBar pill をレンダリングする", () => {
    const DummyIcon = ({ size }: { size?: number; variant?: string; color?: string }) => (
      <span aria-hidden="true" style={{ width: size, height: size }} />
    )
    const out = html(
      <MobileTabBar
        tabs={[
          { key: "home", label: "ホーム", Icon: DummyIcon },
          { key: "settings", label: "設定", Icon: DummyIcon },
        ]}
        activeTab="home"
        onSelect={() => undefined}
      />
    )
    expect(out).toContain('data-slot="bottom-nav-pill"')
    expect(out).toContain("ホーム")
    expect(out).toContain("設定")
  })

  it("MobileTabBar は addAction 指定時に中央 CTA を描画する", () => {
    const DummyIcon = ({ size }: { size?: number; variant?: string; color?: string }) => (
      <span aria-hidden="true" style={{ width: size, height: size }} />
    )
    const out = html(
      <MobileTabBar
        tabs={[{ key: "home", label: "ホーム", Icon: DummyIcon }]}
        activeTab="home"
        onSelect={() => undefined}
        addAction={{ label: "作成", onClick: () => undefined }}
      />
    )
    expect(out).toContain("data-global-nav-add-icon")
  })

  it("AutoGrowTextarea compact は density contract と min-height override を出す", () => {
    const out = html(
      <AutoGrowTextarea
        aria-label="タイトル"
        value="短いタイトル"
        onChange={() => undefined}
        minRows={1}
        density="compact"
      />
    )
    expect(out).toContain('data-slot="auto-grow-textarea"')
    expect(out).toContain('data-density="compact"')
    expect(out).toContain("min-h-0!")
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

describe("CelebrationDialog — backwards-compat", () => {
  it("open=false では SSR エラーなくレンダリング可能（Dialog 非表示状態）", () => {
    const out = html(
      <CelebrationDialog
        open={false}
        onOpenChange={() => undefined}
        emoji="🎉"
        title="達成しました"
        description="お疲れさまでした"
      />
    )
    expect(typeof out).toBe("string")
  })

  it("open=true で Celebration confetti オーバーレイがレンダリングされる（DialogContent は Radix Portal のため SSR 出力対象外）", () => {
    const out = html(
      <CelebrationDialog
        open
        onOpenChange={() => undefined}
        emoji="🎊"
        emojiAnimation="bounce"
        title="全タスク完了！"
        description="次の目標に進みましょう"
        actions={<button type="button">閉じる</button>}
      />
    )
    expect(out).toContain('data-slot="celebration"')
    expect(out).toContain('data-trigger="confetti"')
  })

  it("effect 未指定時は既定で burst confetti（celebration-confetti-burst）がレンダリングされる", () => {
    const out = html(
      <CelebrationDialog
        open
        onOpenChange={() => undefined}
        emoji="🎉"
        title="達成しました"
      />
    )
    expect(out).toContain("celebration-confetti-burst")
  })

  it("effect=\"fall\" を明示すると fall confetti（celebration-confetti-fall）にフォールバックできる", () => {
    const out = html(
      <CelebrationDialog
        open
        onOpenChange={() => undefined}
        emoji="🎉"
        title="達成しました"
        effect="fall"
      />
    )
    expect(out).toContain("celebration-confetti-fall")
    expect(out).not.toContain("celebration-confetti-burst")
  })
})

describe("CountdownHero — backwards-compat", () => {
  it("Date targetDate でレンダリング可能", () => {
    const future = new Date()
    future.setDate(future.getDate() + 42)
    const out = html(<CountdownHero targetDate={future} />)
    expect(out).toContain('data-slot="countdown-hero"')
    expect(out).toContain("42")
  })

  it("ISO 文字列 targetDate でもレンダリング可能", () => {
    const out = html(<CountdownHero targetDate="2099-12-31" label="年内残り" />)
    expect(out).toContain('data-slot="countdown-hero"')
    expect(out).toContain("年内残り")
  })

  it("illustration スロットを描画できる", () => {
    const future = new Date()
    future.setDate(future.getDate() + 10)
    const out = html(
      <CountdownHero
        targetDate={future}
        illustration={<span data-testid="illustration-slot">🖼️</span>}
      />
    )
    expect(out).toContain("illustration-slot")
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

describe("category-presets — backwards-compat", () => {
  const allItems: CategoryPresetItem[] = [...weddingCategories, ...projectCategories]

  it("weddingCategories は19要素", () => {
    expect(weddingCategories).toHaveLength(19)
  })

  it("projectCategories は8要素", () => {
    expect(projectCategories).toHaveLength(8)
  })

  it("各アイテムの categoricalIndex が 1..16 に収まる", () => {
    for (const item of allItems) {
      expect(item.categoricalIndex).toBeGreaterThanOrEqual(1)
      expect(item.categoricalIndex).toBeLessThanOrEqual(16)
      expect(Number.isInteger(item.categoricalIndex)).toBe(true)
    }
  })

  it("各アイテムが key/label/icon を持つ", () => {
    for (const item of allItems) {
      expect(typeof item.key).toBe("string")
      expect(item.key.length).toBeGreaterThan(0)
      expect(typeof item.label).toBe("string")
      expect(item.label.length).toBeGreaterThan(0)
      expect(typeof item.icon).toBe("string")
      expect(item.icon.length).toBeGreaterThan(0)
    }
  })

  it("weddingCategories 内で key が一意", () => {
    const keys = weddingCategories.map((c) => c.key)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it("projectCategories 内で key が一意", () => {
    const keys = projectCategories.map((c) => c.key)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it("getCategoricalColor/-Subtle/-Bold が CSS var 文字列を返す", () => {
    expect(getCategoricalColor(1)).toBe("var(--Categorical-1)")
    expect(getCategoricalSubtle(7)).toBe("var(--Categorical-7-Subtle)")
    expect(getCategoricalBold(16)).toBe("var(--Categorical-16-Bold)")
  })
})

describe("DateField — backwards-compat", () => {
  it("未選択（value=\"\"）でレンダリング可能", () => {
    const out = html(<DateField value="" onChange={() => undefined} placeholder="日付を選択" />)
    expect(out).toContain('data-slot="date-field"')
    expect(out).toContain("日付を選択")
  })

  it("value=\"YYYY-MM-DD\" を表示に反映する（ローカルタイムで解釈、TZずれなし）", () => {
    const out = html(<DateField value="2026-12-25" onChange={() => undefined} />)
    expect(out).toContain('data-slot="date-field"')
    expect(out).toContain("2026/12/25")
  })

  it("disabled が DatePicker に伝播する", () => {
    const out = html(<DateField value="" onChange={() => undefined} disabled />)
    expect(out).toContain("disabled")
  })

  it("dateFormat が反映される", () => {
    const out = html(<DateField value="2026-07-02" onChange={() => undefined} dateFormat="yyyy年MM月dd日" />)
    expect(out).toContain("2026年07月02日")
  })

  it("繰り上がる範囲外日付（2026-02-31 等）は不正値として未選択扱いにする", () => {
    const out = html(<DateField value="2026-02-31" onChange={() => undefined} placeholder="日付を選択" />)
    expect(out).toContain("日付を選択")
    expect(out).not.toContain("2026/03/03")
  })
})

describe("PresenceIndicator — backwards-compat", () => {
  it("name のみでレンダリング可能（statusText/badgeLabel は任意）", () => {
    const out = html(<PresenceIndicator name="田中" />)
    expect(out).toContain('data-slot="presence-indicator"')
    expect(out).toContain("田")
  })

  it("statusText と badgeLabel を表示する", () => {
    const out = html(<PresenceIndicator name="佐藤" statusText="編集中" badgeLabel="オンライン" />)
    expect(out).toContain("編集中")
    expect(out).toContain("オンライン")
    expect(out).toContain('data-variant="success"')
  })

  it("online=false で中立色ドットになる（--Object-Success を含まない）", () => {
    const out = html(<PresenceIndicator name="鈴木" online={false} />)
    expect(out).not.toContain("--Object-Success")
    expect(out).toContain("--Object-Low-Emphasis")
  })

  it("online 省略時は既定で --Object-Success", () => {
    const out = html(<PresenceIndicator name="山田" />)
    expect(out).toContain("--Object-Success")
  })

  it("className を透過する", () => {
    const out = html(<PresenceIndicator name="高橋" className="hidden min-[420px]:flex" />)
    expect(out).toContain("min-[420px]:flex")
  })
})
