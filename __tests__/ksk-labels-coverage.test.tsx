/**
 * @vitest-environment jsdom
 *
 * KskLabelsProvider の網羅（issue #723 の続き）。
 *
 * 1. 代表部品で「Provider 無し=従来の日本語 / locale="en" で英語 / prop が最優先」を固定する
 * 2. `src/components/**` を走査し、日本語の文言を直書きした既定値が**新たに増えたら落とす**
 *    （英語アプリで部品ごとに prop を渡すしかない状態を増やさない）。検出するのは次の 3 種類:
 *    A. 引数デフォルト  `xxxLabel = "日本語"` / `xxxPlaceholder = "日本語"` / `xxxUnit = "日"` / `"aria-label": x = "日本語"` /
 *       `xxxLabel = (n) => \`…日本語…\``
 *    B. Label 名の const  `const defaultXxxLabel = "日本語"`（モジュール直下も関数本体も）
 *    C. 本体内のフォールバック  `x ?? "日本語"`（次の行に折り返した三項演算子の中も）
 *    E. 日本語を含む文字列リテラル全般（オブジェクトのプロパティ値・三項演算子・配列・テンプレート）と JSX の文章
 *       （開発者向けの console.warn / warnOnceInDev / throw new Error の中は除く）。A〜D で拾えない形の保険
 *    D. JSX 属性の直書き  `placeholder="日本語"` / `aria-label="日本語"` / `title="日本語"` / `alt="日本語"`（`xxx={…}` の式は A / C で見る）
 *
 * 2 は ratchet 方式。まだ Provider に乗っていない箇所は UNMIGRATED に理由付きで残してあり、
 * 移行したら（=直書きが消えたら）エントリを消さないと落ちる。正当な例外は理由付きで UNMIGRATED に足せる。
 *
 * placeholder（選択してください・検索...・日付を選択）と単位（日/時間/分/秒）も A で検出する。
 *
 * 検出の対象外（検出もしない・理由は下の「例外」に）:
 * - オブジェクト形の DEFAULT_LABELS を持つ ErrorBoundary / CookieConsent（既定が英語。下記）
 * - `console.warn` / `throw new Error` の開発者向けメッセージ（利用者に表示・読み上げされない）
 * - 日付の書式トークン・曜日（DatePicker の `dateFormat` 等。文言ではなく書式）
 */
import * as React from "react"
import { act } from "react"
import { createRoot } from "react-dom/client"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { KSK_DEFAULT_LABELS, KskLabelsProvider } from "../src/components/ui/ksk-labels"
import {
  Pagination,
  PaginationEllipsis,
  PaginationNext,
  PaginationPrevious,
} from "../src/components/ui/pagination"
import { Spinner } from "../src/components/ui/spinner"
import { Breadcrumb } from "../src/components/ui/breadcrumb"
import { NumberInput } from "../src/components/ui/number-input"
import { ImageGallery } from "../src/components/ui/image-gallery"
import { SectionNav } from "../src/components/ui/section-nav"
import { SyncStatusBadge } from "../src/components/ui/sync-status-badge"
import { CountdownTimer } from "../src/components/ui/countdown-timer"
import { MultiSelect } from "../src/components/ui/multi-select"
import { DropdownFilter } from "../src/components/ui/dropdown-filter"
import { ShareButtons } from "../src/components/patterns/share-buttons"
import { SimplePagination } from "../src/components/patterns/simple-pagination"
import { CodeDisplay } from "../src/components/patterns/code-display"
import { ErrorState } from "../src/components/patterns/error-state"
import { CountdownHero } from "../src/components/patterns/countdown-hero"
import { CoachMark } from "../src/components/ui/coach-mark"
import { Combobox } from "../src/components/ui/combobox"
import { BottomSheetForm } from "../src/components/patterns/bottom-sheet-form"
import { ImageCarousel } from "../src/components/patterns/commerce/image-carousel"
import { ContentCarousel } from "../src/components/patterns/content-carousel"
import { BannerCarousel } from "../src/components/patterns/banner-carousel"
import { ProductCarousel } from "../src/components/patterns/commerce/product-carousel"
import { BulkActions } from "../src/components/patterns/admin/bulk-actions"
import { ImageUploader } from "../src/components/patterns/admin/image-uploader"
import {
  DataTable,
  DataTableActionCell,
  DataTableAddRow,
  DataTableBulkActions,
  DataTableEmptyState,
  DataTableInputCell,
  DataTableSelectCell,
} from "../src/components/patterns/admin/data-table"
import { FilterBar } from "../src/components/patterns/commerce/filter-bar"
import { BottomTabBar } from "../src/components/patterns/commerce/bottom-tab-bar"
import { OrderSummary } from "../src/components/patterns/commerce/order-summary"
import { ProductCard } from "../src/components/patterns/commerce/product-card"
import { QuantitySelector } from "../src/components/patterns/commerce/quantity-selector"
import { Chip } from "../src/components/patterns/chip"
import { ChipFilterBar } from "../src/components/patterns/chip-filter-bar"
import { CompactFilePicker, ImageAttachmentPicker } from "../src/components/patterns/compact-file-picker"
import { ConfirmDialog } from "../src/components/patterns/confirm-dialog"
import { FeatureComparisonTable } from "../src/components/patterns/feature-comparison-table"
import { FileUpload } from "../src/components/patterns/file-upload"
import { FilterPill } from "../src/components/patterns/filter-pill"
import { KanbanColumn } from "../src/components/patterns/kanban-column"
import { MediaActionCluster } from "../src/components/patterns/media-action-cluster"
import { SidebarNav } from "../src/components/patterns/sidebar-nav"
import { SwipeRow } from "../src/components/patterns/swipe-row"
import { ReviewOverlay } from "../src/components/patterns/review-overlay"
import { TagInput } from "../src/components/patterns/tag-input"
import { Celebration } from "../src/components/patterns/celebration"
import { CoachMarkOverlay } from "../src/components/patterns/coach-mark-overlay"
import { CodeInput } from "../src/components/ui/code-input"
import { Progress } from "../src/components/ui/progress"
import { ProgressRing } from "../src/components/ui/progress-ring"
import { DatePicker, DateRangePicker } from "../src/components/ui/date-picker"
import { TimePicker } from "../src/components/ui/time-picker"
import { DateTimePicker } from "../src/components/ui/date-time-picker"
import { BreadcrumbEllipsis } from "../src/components/ui/breadcrumb"
import { Toaster, configureToast, toast } from "../src/components/ui/toast"
import { Slider } from "../src/components/ui/slider"
import { SocialLoginButton } from "../src/components/ui/social-login-button"
import { CheckboxGroup } from "../src/components/ui/checkbox-group"
import { ProgressSteps } from "../src/components/patterns/progress-steps"
import { DocumentPage } from "../src/components/patterns/document-page"
import { RatingDisplay } from "../src/components/patterns/commerce/rating-display"
import { PriceDisplay } from "../src/components/patterns/commerce/price-display"
import { ReviewSummary } from "../src/components/patterns/commerce/review-summary"
import { ReviewCard } from "../src/components/patterns/commerce/review-card"
import { NotificationList } from "../src/components/patterns/admin/notification-list"
import { SearchPanel } from "../src/components/patterns/admin/search-panel"
import { ChartControls } from "../src/components/patterns/admin/chart-controls"
import { ActionTile } from "../src/components/patterns/quick-action-grid"
import { CategoryScroll } from "../src/components/patterns/category-scroll"
import { MenuDrawer } from "../src/components/patterns/menu-drawer"
import { formatKskLabelNodes } from "../src/components/ui/ksk-labels"

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
// Radix（Popover / Tooltip / Dialog）が jsdom に無い ResizeObserver を使う
;(globalThis as { ResizeObserver?: unknown }).ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const en = (node: React.ReactElement) =>
  renderToStaticMarkup(<KskLabelsProvider locale="en">{node}</KskLabelsProvider>)
const ja = (node: React.ReactElement) => renderToStaticMarkup(node)

const PAST = new Date(2000, 0, 1)
const FUTURE_DAYS = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)

describe("KskLabelsProvider の網羅: Provider 無しは日本語 / en で英語 / prop が最優先", () => {
  it("Pagination 系", () => {
    const node = (
      <Pagination>
        <PaginationPrevious href="#" />
        <PaginationEllipsis />
        <PaginationNext href="#" />
      </Pagination>
    )
    const j = ja(node)
    expect(j).toContain('aria-label="ページネーション"')
    expect(j).toContain('aria-label="前へ"')
    expect(j).toContain('aria-label="次へ"')
    expect(j).toContain(">その他のページ<")
    const e = en(node)
    expect(e).toContain('aria-label="Pagination"')
    expect(e).toContain('aria-label="Previous"')
    expect(e).toContain('aria-label="Next"')
    expect(e).toContain(">More pages<")
    const p = en(
      <Pagination navLabel="PAGES">
        <PaginationPrevious href="#" label="BACK" />
      </Pagination>
    )
    expect(p).toContain('aria-label="PAGES"')
    expect(p).toContain('aria-label="BACK"')
  })

  it("Provider の labels は locale の既定より優先される", () => {
    const html = renderToStaticMarkup(
      <KskLabelsProvider locale="en" labels={{ spinnerLoading: "Please wait" }}>
        <Spinner />
      </KskLabelsProvider>
    )
    expect(html).toContain('aria-label="Please wait"')
  })

  it("Spinner / Breadcrumb / SectionNav", () => {
    expect(ja(<Spinner />)).toContain('aria-label="読み込み中"')
    expect(en(<Spinner />)).toContain('aria-label="Loading"')
    expect(en(<Spinner label="x" />)).toContain('aria-label="x"')
    expect(ja(<Breadcrumb />)).toContain('aria-label="パンくずリスト"')
    expect(en(<Breadcrumb />)).toContain('aria-label="Breadcrumb"')
    expect(en(<Breadcrumb label="x" />)).toContain('aria-label="x"')
    const items = [{ key: "a", label: "A", href: "#a" }]
    expect(ja(<SectionNav items={items} />)).toContain('aria-label="ページ内セクション"')
    expect(en(<SectionNav items={items} />)).toContain('aria-label="On this page"')
    expect(en(<SectionNav items={items} aria-label="x" />)).toContain('aria-label="x"')
  })

  it("NumberInput / ImageGallery", () => {
    expect(ja(<NumberInput />)).toContain('aria-label="減らす"')
    expect(ja(<NumberInput />)).toContain('aria-label="増やす"')
    expect(en(<NumberInput />)).toContain('aria-label="Decrease"')
    expect(en(<NumberInput />)).toContain('aria-label="Increase"')
    expect(en(<NumberInput decrementLabel="-" incrementLabel="+" />)).toContain('aria-label="-"')
    const images = [{ src: "a.png" }, { src: "b.png" }]
    expect(ja(<ImageGallery images={images} />)).toContain('aria-label="前の画像"')
    expect(ja(<ImageGallery images={images} />)).toContain('aria-label="次の画像"')
    expect(en(<ImageGallery images={images} />)).toContain('aria-label="Previous image"')
    expect(en(<ImageGallery images={images} />)).toContain('aria-label="Next image"')
    expect(en(<ImageGallery images={images} prevLabel="P" nextLabel="N" />)).toContain('aria-label="P"')
    expect(ja(<ImageGallery images={images} />)).toContain('aria-label="画像 1"')
    expect(en(<ImageGallery images={images} />)).toContain('aria-label="Image 1"')
    expect(en(<ImageGallery images={images} imageLabel={(i) => `Pic ${i}`} />)).toContain('aria-label="Pic 0"')
  })

  it("SyncStatusBadge（件数入りの error も）", () => {
    expect(ja(<SyncStatusBadge state="syncing" />)).toContain("同期中")
    expect(en(<SyncStatusBadge state="syncing" />)).toContain("Syncing")
    expect(ja(<SyncStatusBadge state="success" />)).toContain("保存済み")
    expect(en(<SyncStatusBadge state="success" />)).toContain("Saved")
    expect(ja(<SyncStatusBadge state="offline" />)).toContain("オフライン")
    expect(en(<SyncStatusBadge state="offline" />)).toContain("Offline")
    const err = <SyncStatusBadge state="error" errorCount={3} onRetry={() => {}} />
    expect(ja(err)).toContain("3件のエラー")
    expect(ja(err)).toContain(">再試行<")
    expect(en(err)).toContain("3 errors")
    expect(en(err)).toContain(">Retry<")
    expect(en(<SyncStatusBadge state="syncing" syncingLabel="Uploading" />)).toContain("Uploading")
    expect(en(<SyncStatusBadge state="error" errorCount={2} errorLabel={(n) => `E${n}`} />)).toContain("E2")
  })

  it("CountdownTimer / CountdownHero（label の空文字は「非表示」のまま）", () => {
    const day = <CountdownTimer targetDate={FUTURE_DAYS} granularity="day" />
    expect(ja(day)).toContain("残り 5日")
    expect(en(day)).toContain("Time left 5 day(s)")
    expect(ja(<CountdownTimer targetDate={PAST} granularity="day" />)).toContain("受付終了")
    expect(en(<CountdownTimer targetDate={PAST} granularity="day" />)).toContain("Closed")
    expect(ja(<CountdownTimer targetDate={PAST} />)).toContain("受付終了")
    expect(en(<CountdownTimer targetDate={PAST} />)).toContain("Closed")
    expect(en(<CountdownTimer targetDate={PAST} endedLabel="Over" />)).toContain("Over")
    expect(en(<CountdownTimer targetDate={FUTURE_DAYS} granularity="day" label="" />)).not.toContain("Time left")
    const today = new Date()
    expect(ja(<CountdownTimer targetDate={today} granularity="day" />)).toContain("本日")
    expect(en(<CountdownTimer targetDate={today} granularity="day" />)).toContain("Today")
    expect(ja(<CountdownHero targetDate={FUTURE_DAYS} />)).toContain(">残り<")
    expect(en(<CountdownHero targetDate={FUTURE_DAYS} />)).toContain(">Time left<")
    expect(ja(<CountdownHero targetDate={PAST} />)).toContain(">経過<")
    expect(en(<CountdownHero targetDate={PAST} />)).toContain(">Elapsed<")
    expect(en(<CountdownHero targetDate={PAST} pastLabel="Ago" />)).toContain(">Ago<")
  })

  it("MultiSelect / DropdownFilter / SimplePagination", () => {
    const ms = <MultiSelect options={[{ value: "a", label: "A" }]} value={["a"]} />
    expect(ja(ms)).toContain('aria-label="選択をクリア"')
    expect(en(ms)).toContain('aria-label="Clear selection"')
    expect(en(<MultiSelect options={[]} value={["a"]} clearLabel="x" />)).toContain('aria-label="x"')
    const df = (
      <DropdownFilter label="L" value="all" options={[{ key: "a", label: "A" }]} onSelect={() => {}} />
    )
    // 開く前は「すべて」「閉じる」は DOM に出ない。ここでは例外なく描画できることだけ確認する
    expect(ja(df)).toContain("L")
    expect(en(df)).toContain("L")
    const sp = <SimplePagination page={2} totalPages={5} onPageChange={() => {}} />
    expect(ja(sp)).toContain('aria-label="ページネーション"')
    expect(ja(sp)).toContain('aria-label="前へ"')
    expect(en(sp)).toContain('aria-label="Pagination"')
    expect(en(sp)).toContain('aria-label="Previous"')
    expect(en(sp)).toContain('aria-label="Next"')
    expect(en(<SimplePagination page={2} totalPages={5} onPageChange={() => {}} nextLabel="Go" />)).toContain(
      'aria-label="Go"'
    )
  })

  it("ShareButtons / CodeDisplay / ErrorState", () => {
    const sb = <ShareButtons url="https://example.com" providers={["email", "copy"]} />
    expect(ja(sb)).toContain('aria-label="シェア"')
    expect(ja(sb)).toContain("メール")
    expect(ja(sb)).toContain("リンク")
    expect(en(sb)).toContain('aria-label="Share"')
    expect(en(sb)).toContain("Email")
    expect(en(sb)).toContain("Link")
    expect(en(<ShareButtons url="u" providers={["copy"]} groupLabel="G" labels={{ copy: "Copy URL" }} />)).toContain(
      "Copy URL"
    )
    expect(ja(<CodeDisplay code="ABC" />)).toContain("コピー")
    expect(en(<CodeDisplay code="ABC" />)).toContain("Copy")
    expect(en(<CodeDisplay code="ABC" copyLabel="Duplicate" />)).toContain("Duplicate")
    const es = <ErrorState onRetry={() => {}} />
    expect(ja(es)).toContain("再試行")
    expect(en(es)).toContain("Retry")
    expect(en(<ErrorState onRetry={() => {}} retryLabel="Again" />)).toContain("Again")
  })

  it("開いて初めて出る文言（DropdownFilter / CoachMark / Combobox / BottomSheetForm）", async () => {
    const mount = async (node: React.ReactElement, locale?: "en") => {
      const el = document.createElement("div")
      document.body.appendChild(el)
      const root = createRoot(el)
      await act(async () => {
        root.render(locale ? <KskLabelsProvider locale={locale}>{node}</KskLabelsProvider> : node)
      })
      return {
        el,
        done: async () => {
          await act(async () => root.unmount())
          el.remove()
        },
      }
    }
    const text = () => document.body.textContent ?? ""
    const html = () => document.body.innerHTML

    // DropdownFilter: ボタンを押すと「すべて」と閉じる用の不可視ボタンが出る
    const df = <DropdownFilter label="L" value="all" options={[{ key: "a", label: "A" }]} onSelect={() => {}} />
    for (const [loc, all, close] of [
      [undefined, "すべて", "閉じる"],
      ["en", "All", "Close"],
    ] as const) {
      const m = await mount(df, loc)
      await act(async () => {
        m.el.querySelector("button")!.click()
      })
      expect(text(), `DropdownFilter ${loc}`).toContain(all)
      expect(html()).toContain(`aria-label="${close}"`)
      await m.done()
    }

    // CoachMark: 次へ / スキップ（オンボーディング）
    const cm = (
      <CoachMark open content="説明" step={1} totalSteps={3} onNext={() => {}} showClose onClose={() => {}}>
        <button>t</button>
      </CoachMark>
    )
    const cmJa = await mount(cm)
    expect(text()).toContain("次へ →")
    expect(text()).toContain("スキップ")
    await cmJa.done()
    const cmEn = await mount(cm, "en")
    expect(text()).toContain("Next →")
    expect(text()).toContain("Skip")
    await cmEn.done()

    // Combobox: 候補 0 件
    const cb = <Combobox options={[]} />
    for (const [loc, empty] of [
      [undefined, "該当なし"],
      ["en", "No results"],
    ] as const) {
      const m = await mount(cb, loc)
      await act(async () => {
        m.el.querySelector("button")!.click()
      })
      expect(text(), `Combobox ${loc}`).toContain(empty)
      await m.done()
    }

    // BottomSheetForm: 保存 / キャンセル
    const bsf = (
      <BottomSheetForm open onOpenChange={() => {}} title="T" onSubmit={() => {}}>
        <input />
      </BottomSheetForm>
    )
    const bJa = await mount(bsf)
    expect(text()).toContain("保存")
    expect(text()).toContain("キャンセル")
    await bJa.done()
    const bEn = await mount(bsf, "en")
    expect(text()).toContain("Save")
    expect(text()).toContain("Cancel")
    await bEn.done()
  })

  it("新しいキーは ja / en の両方に値がある", () => {
    for (const key of Object.keys(KSK_DEFAULT_LABELS.ja) as (keyof typeof KSK_DEFAULT_LABELS.ja)[]) {
      // 読み上げの区切り（countdownSpokenSeparator）は ja が意図して空文字
      if (key === "countdownSpokenSeparator") continue
      expect(KSK_DEFAULT_LABELS.ja[key], `ja.${key}`).toBeTruthy()
      expect(KSK_DEFAULT_LABELS.en[key], `en.${key}`).toBeTruthy()
    }
    expect(Object.keys(KSK_DEFAULT_LABELS.en).sort()).toEqual(Object.keys(KSK_DEFAULT_LABELS.ja).sort())
  })
})

// ─── 続き（#723）: 残りの部品も Provider 無し=日本語 / en=英語 / prop 最優先 ──────────────

type Case = readonly [name: string, node: React.ReactElement, ja: readonly string[], en: readonly string[]]

const IMAGES = [
  { src: "a.png", alt: "A" },
  { src: "b.png", alt: "B" },
]

const STATIC_CASES: readonly Case[] = [
  [
    "ImageCarousel（領域・前へ・次へ・ドット）",
    <ImageCarousel images={IMAGES} />,
    ['aria-label="画像カルーセル"', 'aria-label="前へ"', 'aria-label="次へ"', 'aria-label="スライド 2"'],
    ['aria-label="Image carousel"', 'aria-label="Previous"', 'aria-label="Next"', 'aria-label="Slide 2"'],
  ],
  [
    "ContentCarousel",
    <ContentCarousel slides={[<div key="a">a</div>, <div key="b">b</div>]} />,
    ['aria-label="コンテンツカルーセル"', 'aria-label="前へ"'],
    ['aria-label="Content carousel"', 'aria-label="Previous"'],
  ],
  [
    "BannerCarousel / ProductCarousel（もっと見る）",
    <div>
      <BannerCarousel items={[{ id: "1", image: "a.png", alt: "A" } as never]} onMore={() => {}} />
      <ProductCarousel title="T" products={[]} onMoreClick={() => {}} />
    </div>,
    ['aria-label="バナー一覧"', "もっと見る"],
    ['aria-label="Banners"', "See more"],
  ],
  [
    "BulkActions",
    <BulkActions selectedCount={3} onClear={() => {}} />,
    ["3件を選択中", 'aria-label="選択を解除"'],
    ["3 selected", 'aria-label="Clear selection"'],
  ],
  [
    "ImageUploader",
    <ImageUploader images={[{ src: "a.png", alt: "猫" }]} />,
    ['aria-label="画像を追加"', ">追加<", 'aria-label="猫を削除"'],
    ['aria-label="Add image"', ">Add<", 'aria-label="Remove 猫"'],
  ],
  [
    "DataTable の部品（空・追加・行メニュー・入力・選択）",
    <table>
      <tbody>
        <DataTableEmptyState colSpan={2} />
        <DataTableAddRow colSpan={2} />
        <tr>
          <DataTableActionCell items={[{ label: "x" }]} />
          <DataTableInputCell value="" />
          <DataTableSelectCell options={[]} />
        </tr>
      </tbody>
    </table>,
    ["データがありません", "追加する", 'aria-label="行メニュー"', 'aria-label="入力"', 'aria-label="選択"'],
    ["No data", "Add", 'aria-label="Row menu"', 'aria-label="Input"', 'aria-label="Select"'],
  ],
  [
    "DataTable（選択列・すべて選択・行選択）",
    <DataTable
      rows={[{ id: "r1" }]}
      columns={[{ key: "id", header: "ID" }]}
      getRowId={(r: { id: string }) => r.id}
      selection={{ mode: "multi" }}
    />,
    ['aria-label="行選択"', 'aria-label="すべて選択"', 'aria-label="r1 を選択"'],
    ['aria-label="Selection"', 'aria-label="Select all"', 'aria-label="Select r1"'],
  ],
  [
    "DataTableBulkActions（bulkActionsCount を共有）",
    <DataTableBulkActions selectedCount={2} />,
    ["2件を選択中"],
    ["2 selected"],
  ],
  [
    "FilterBar（件数・並べ替え・絞り込み・nav）",
    <FilterBar filters={[]} resultCount={1234} sortOptions={[{ label: "新着", value: "new" }]} onMoreFilters={() => {}} />,
    ['aria-label="フィルター"', 'aria-label="絞り込み"', "対象商品: <strong", "</strong> 件", "並べ替え"],
    ['aria-label="Filters"', 'aria-label="Filter"', "Results: <strong", "</strong> items", "Sort"],
  ],
  [
    "BottomTabBar の nav",
    <BottomTabBar items={[{ label: "ホーム", icon: <i />, href: "#" }]} />,
    ['aria-label="メインナビゲーション"'],
    ['aria-label="Main navigation"'],
  ],
  [
    "OrderSummary / ProductCard / QuantitySelector",
    <div>
      <OrderSummary totalValue="¥1" ctaLabel="c" />
      <ProductCard name="N" imageUrl="a.png" price={100} showCartButton onFavoriteToggle={() => {}} />
      <QuantitySelector value={1} showTrash />
    </div>,
    ["合計（税込）", "カートに追加", 'aria-label="お気に入りに追加"', 'aria-label="数量選択"', 'aria-label="数量を増やす"', 'aria-label="削除"'],
    ["Total (incl. tax)", "Add to cart", 'aria-label="Add to favorites"', 'aria-label="Quantity"', 'aria-label="Increase quantity"', 'aria-label="Remove"'],
  ],
  [
    "Chip（削除）/ ChipFilterBar（件数は桁区切り）",
    <div>
      <Chip removable onRemove={() => {}}>
        タグ
      </Chip>
      <ChipFilterBar resultCount={1234}>
        <Chip>x</Chip>
      </ChipFilterBar>
    </div>,
    ['aria-label="削除: タグ"', "1,234件"],
    ['aria-label="Remove: タグ"', "1,234 results"],
  ],
  [
    "CompactFilePicker / ImageAttachmentPicker",
    <div>
      <CompactFilePicker />
      <CompactFilePicker loading />
      <ImageAttachmentPicker images={[{ id: "1", src: "a.png" }]} onRemove={() => {}} previewVariant="list" />
    </div>,
    [">ファイル<", ">選択する<", ">処理中<", ">画像を追加<", ">画像<", 'aria-label="画像を削除"'],
    [">File<", ">Choose<", ">Processing<", ">Add image<", ">Image<", 'aria-label="Remove Image"'],
  ],
  [
    "ErrorState（error / notFound）",
    <div>
      <ErrorState />
      <ErrorState kind="notFound" />
    </div>,
    ["エラーが発生しました", "しばらくしてからもう一度お試しください", "ページが見つかりません", "お探しのページは移動または削除された可能性があります。"],
    ["Something went wrong", "Please try again in a few moments", "Page not found", "The page you are looking for may have been moved or deleted."],
  ],
  [
    "FeatureComparisonTable",
    <FeatureComparisonTable
      columns={[{ key: "a", label: "Free" }]}
      rows={[
        { label: "x", values: { a: true } },
        { label: "y", values: { a: false } },
      ]}
    />,
    [">機能<", ">利用できる<", ">利用できない<"],
    [">Feature<", ">Available<", ">Not available<"],
  ],
  [
    "FilterPill",
    <FilterPill label="エリア" value="渋谷" onClear={() => {}}>
      x
    </FilterPill>,
    ['aria-label="エリアをクリア"'],
    ['aria-label="Clear エリア"'],
  ],
  [
    "KanbanColumn / SidebarNav / SwipeRow / MediaActionCluster",
    <div>
      <KanbanColumn title="T" count={4} />
      <SidebarNav items={[{ label: "a", icon: <i />, href: "#" } as never]} />
      <SwipeRow actions={[{ label: "x", onClick: () => {} }]}>c</SwipeRow>
      <MediaActionCluster items={[{ label: "x", icon: <i />, onClick: () => {} } as never]} />
    </div>,
    ["（4件）", 'aria-label="サイドナビゲーション"', 'aria-label="行の操作"', 'aria-label="メディアアクション"'],
    ["（4 items）", 'aria-label="Sidebar navigation"', 'aria-label="Row actions"', 'aria-label="Media actions"'],
  ],
  [
    "TagInput（名前・削除）",
    <TagInput value={["a"]} />,
    ['aria-label="タグ入力"', 'aria-label="a を削除"'],
    ['aria-label="Tag input"', 'aria-label="Remove a"'],
  ],
  [
    "TagInput（0 件のときのプレースホルダー）",
    <TagInput />,
    ['placeholder="タグを入力して Enter"'],
    ['placeholder="Type a tag and press Enter"'],
  ],
  [
    "CodeInput（セルの読み上げ名）",
    <CodeInput length={4} aria-label="コード" />,
    ['aria-label="1桁目（全4桁）"'],
    ['aria-label="Digit 1 of 4"'],
  ],
  [
    "Progress / ProgressRing（名前の無いとき）",
    <div>
      <Progress value={10} />
      <ProgressRing value={10} />
    </div>,
    ['aria-label="進捗"'],
    ['aria-label="Progress"'],
  ],
  [
    "ReviewOverlay のピン",
    <ReviewOverlay active pins={[{ id: "1", x: 0.1, y: 0.1 }]} />,
    ['aria-label="レビューピン"'],
    ['aria-label="Review pin"'],
  ],
  [
    "Celebration（title 無しの読み上げ文）",
    <Celebration active trigger="emoji" emoji="🎉" description="d" />,
    ["達成しました d"],
    ["Achieved d"],
  ],
  [
    "Combobox / MultiSelect / DatePicker / DateRangePicker / TimePicker の placeholder",
    <div>
      <Combobox options={[]} />
      <MultiSelect options={[]} />
      <DatePicker />
      <DateRangePicker />
      <TimePicker />
      <DateTimePicker />
    </div>,
    ["選択してください", "日付を選択", "期間を選択", "時刻を選択"],
    ["Select", "Select date", "Select date range", "Select time"],
  ],
  [
    "CountdownTimer の単位（時間・分・秒）",
    <CountdownTimer targetDate={new Date(Date.now() + (3600 + 125) * 1000 + 500)} granularity="second" />,
    ["時間", "分", "秒"],
    [">h<", ">m<", ">s<"],
  ],
  ["BreadcrumbEllipsis", <BreadcrumbEllipsis />, [">その他<"], [">More<"]],
  [
    "SimplePagination（中央の件数・ページ表示）",
    <div>
      <SimplePagination page={1} pageSize={10} total={100} onPageChange={() => {}} />
      <SimplePagination page={1} pageSize={10} total={0} onPageChange={() => {}} />
      <SimplePagination page={2} totalPages={5} onPageChange={() => {}} />
    </div>,
    [" / 全 ", " 件<", "0 件", " ページ<"],
    [" of ", " items<", "0 items", "Page "],
  ],
  [
    "Slider（範囲のつまみ）/ SocialLoginButton / CheckboxGroup の必須",
    <div>
      <Slider defaultValue={[20, 80]} />
      <SocialLoginButton provider="line" />
      <SocialLoginButton provider="google" />
      <SocialLoginButton provider="apple" />
      <SocialLoginButton provider="amazon" />
      <CheckboxGroup label="L" required>
        x
      </CheckboxGroup>
    </div>,
    ['aria-label="スライダー（開始）"', 'aria-label="スライダー（終了）"', "LINEでログイン", "Googleでログイン", "Appleでログイン", "Amazonでログイン", ">必須<"],
    ['aria-label="Slider (Start)"', 'aria-label="Slider (End)"', "Log in with LINE", "Log in with Google", "Log in with Apple", "Log in with Amazon", ">Required<"],
  ],
  [
    "ProgressSteps / DocumentPage / CategoryScroll / ActionTile(loading)",
    <div>
      <ProgressSteps steps={["a", "b"]} currentStep={0} />
      <DocumentPage title="T" lastUpdated="2026年1月1日">
        x
      </DocumentPage>
      <CategoryScroll title="C" moreHref="/m" items={[]} />
      <ActionTile label="x" loading />
    </div>,
    ['aria-label="ステップ 1 / 2: a"', "最終更新日：2026年1月1日", "もっと見る", 'aria-label="処理中"'],
    ['aria-label="Step 1 of 2: a"', "Last updated: 2026年1月1日", "See more", 'aria-label="Processing"'],
  ],
  [
    "RatingDisplay / PriceDisplay / ReviewSummary / ReviewCard",
    <div>
      <RatingDisplay rating={4.5} reviewCount={12} />
      <PriceDisplay price={1000} />
      <ReviewSummary averageRating={4.2} totalCount={1234} distribution={[1, 2, 3, 4, 5]} />
      <ReviewCard reviewer="R" rating={4} body="b" date="d" helpfulCount={3} onHelpful={() => {}} />
    </div>,
    ['aria-label="評価 4.5 / 5 (12件)"', 'aria-label="¥1,000 税込"', ">税込<", "1,234件の口コミ", 'aria-label="4点 / 5点"', "参考になった (3)"],
    ['aria-label="Rated 4.5 out of 5 (12 reviews)"', 'aria-label="¥1,000 Tax incl."', ">Tax incl.<", "1,234 reviews", 'aria-label="4 out of 5"', "Helpful (3)"],
  ],
  [
    "NotificationList（空）/ SearchPanel",
    <div>
      <NotificationList notifications={[]} />
      <SearchPanel onReset={() => {}} onSearch={() => {}} />
    </div>,
    ["新着のお知らせはありません", "リセット", "検索"],
    ["No new notifications", "Reset", "Search"],
  ],
  [
    "ChartControls",
    <ChartControls onGranularityChange={() => {}} onPeriodChange={() => {}} onComparisonChange={() => {}} />,
    [">粒度<", ">期間<", ">比較<", ">時間<", ">7日<", ">カスタム<", "前期比を表示"],
    [">Granularity<", ">Period<", ">Compare<", ">Hour<", ">7 days<", ">Custom<", "Show vs. previous period"],
  ],
]

describe('残りの部品: Provider 無し=従来の日本語 / locale="en" で英語', () => {
  for (const [name, node, jaWords, enWords] of STATIC_CASES) {
    it(name, () => {
      const j = ja(node)
      for (const w of jaWords) expect(j, `ja: ${w}`).toContain(w)
      const e = en(node)
      for (const w of enWords) expect(e, `en: ${w}`).toContain(w)
    })
  }

  it("prop が最優先（Provider の en より prop）", () => {
    const ic = en(<ImageCarousel images={IMAGES} regionLabel="R" previousLabel="P" nextLabel="N" />)
    expect(ic).toContain('aria-label="R"')
    expect(ic).toContain('aria-label="P"')
    expect(ic).toContain('aria-label="N"')
    expect(en(<BulkActions selectedCount={3} countLabel={(n) => `C${n}`} clearLabel="K" onClear={() => {}} />)).toContain(
      'aria-label="C3"'
    )
    expect(en(<QuantitySelector value={1} groupLabel="G" />)).toContain('aria-label="G"')
    expect(en(<ErrorState title="T" description="D" />)).toContain(">T<")
    expect(en(<TagInput placeholder="P" inputLabel="L" />)).toContain('placeholder="P"')
    expect(en(<CodeInput length={2} aria-label="c" cellLabel={(i) => `X${i}`} />)).toContain('aria-label="X0"')
    expect(en(<Progress value={1} aria-label="mine" />)).toContain('aria-label="mine"')
    expect(en(<DatePicker placeholder="pick" />)).toContain("pick")
    expect(en(<TimePicker placeholder="t" />)).toContain(">t<")
    expect(en(<BreadcrumbEllipsis label="more!" />)).toContain(">more!<")
    expect(en(<CountdownTimer targetDate={new Date(Date.now() + 90_000)} minuteUnit="min" />)).toContain("min")
  })

  it("Provider の labels は locale の既定より優先される（新キー）", () => {
    const html = renderToStaticMarkup(
      <KskLabelsProvider locale="en" labels={{ progress: "Working" }}>
        <Progress value={1} />
      </KskLabelsProvider>
    )
    expect(html).toContain('aria-label="Working"')
  })

  it("日付の表示（曜日・期間の区切り・DateTimePicker の書式）は Provider の locale に従う", () => {
    const d = new Date(2026, 9, 26) // 月曜
    const e = new Date(2026, 9, 28)
    expect(ja(<DatePicker value={d} dateFormat="EEE" />)).toContain(">月<")
    expect(en(<DatePicker value={d} dateFormat="EEE" />)).toContain(">Mon<")
    expect(en(<DatePicker value={d} dateFormat="EEEE" />)).toContain(">Monday<")
    expect(ja(<DateRangePicker value={{ from: d, to: e }} />)).toContain("2026/10/26 〜 2026/10/28")
    expect(en(<DateRangePicker value={{ from: d, to: e }} />)).toContain("2026/10/26 – 2026/10/28")
    expect(ja(<DateTimePicker value={d} />)).toContain("10月26日（月）")
    expect(en(<DateTimePicker value={d} />)).toContain("Mon, 10/26")
  })

  it("CountdownTimer の読み上げは単語で読む（表示の単位は変えない）。ja は従来どおり", () => {
    const sec = <CountdownTimer targetDate={new Date(Date.now() + (3600 + 5 * 60 + 30) * 1000 + 500)} granularity="second" />
    const aria = (html: string) => /aria-label="([^"]*)"/.exec(html)?.[1]
    expect(aria(ja(sec))).toMatch(/^残り 1時間5分(29|30)秒$/)
    expect(aria(en(sec))).toMatch(/^Time left 1 hour\(s\) 5 minute\(s\) (29|30) second\(s\)$/)
    // 表示の単位（d / h / m / s）はそのまま
    expect(en(sec)).toContain(">h<")
    // 単位 prop を渡したら読み上げにもそれを使う（単複は呼び出し側で）
    const custom = (
      <CountdownTimer targetDate={new Date(Date.now() + 3 * 3600 * 1000 + 500)} hourUnit=" hours" minuteUnit=" min" secondUnit=" s" />
    )
    expect(aria(en(custom))).toMatch(/^Time left 2 hours 59 min \d+ s$|^Time left 3 hours 0 min 0 s$/)
    expect(aria(en(<CountdownTimer targetDate={FUTURE_DAYS} granularity="day" dayUnit=" days" />))).toBe("Time left 5 days")
  })

  it("formatKskLabelNodes: 差し込み口が無い・複数ある・値が無いときも壊れない", () => {
    const html = (n: React.ReactNode) => renderToStaticMarkup(<>{n}</>)
    expect(html(formatKskLabelNodes("a {count} b", { count: <b>1</b> }))).toBe("a <b>1</b> b")
    expect(html(formatKskLabelNodes("no slot", { count: <b>1</b> }))).toBe("no slot")
    expect(html(formatKskLabelNodes("{count}+{count}", { count: "x" }))).toBe("x+x")
    expect(html(formatKskLabelNodes("{missing} / {toString}", {}))).toBe("{missing} / {toString}")
    // FilterBar の件数は、{count} の無い訳でも壊れない
    const e = renderToStaticMarkup(
      <KskLabelsProvider locale="en" labels={{ filterBarResultCount: "No placeholder" }}>
        <FilterBar filters={[]} resultCount={5} />
      </KskLabelsProvider>
    )
    expect(e).toContain("No placeholder")
  })

  it("configureToast({ messages }) でプリセット通知の文言を差し替えられる（未指定は従来の日本語）", async () => {
    const el = document.createElement("div")
    document.body.appendChild(el)
    const root = createRoot(el)
    await act(async () => {
      root.render(<Toaster />)
    })
    await act(async () => {
      toast.saveComplete()
    })
    expect(document.body.textContent).toContain("保存しました")
    configureToast({ messages: { saveComplete: "Saved!" } })
    await act(async () => {
      toast.saveComplete()
    })
    expect(document.body.textContent).toContain("Saved!")
    configureToast({ messages: { saveComplete: "保存しました" } })
    await act(async () => root.unmount())
    el.remove()
  })

  it("FileUpload（ドラッグ文言・上限）", () => {
    const f = <FileUpload multiple maxSize={5 * 1024 * 1024} />
    const j = ja(f)
    expect(j).toContain("ここにファイルをドロップ")
    expect(j).toContain(">または<")
    expect(j).toContain(">ファイルを選択<")
    expect(j).toContain("最大 5.0 MB まで")
    expect(j).toContain("最大 10 ファイルまで")
    const e = en(f)
    expect(e).toContain("Drop files here")
    expect(e).toContain(">or<")
    expect(e).toContain(">Choose files<")
    expect(e).toContain("Up to 5.0 MB")
    expect(e).toContain("Up to 10 files")
  })

  it("開いて初めて出る文言（ConfirmDialog / CoachMarkOverlay / Toaster）", async () => {
    const mount = async (node: React.ReactElement, locale?: "en") => {
      const el = document.createElement("div")
      document.body.appendChild(el)
      const root = createRoot(el)
      await act(async () => {
        root.render(locale ? <KskLabelsProvider locale={locale}>{node}</KskLabelsProvider> : node)
      })
      return {
        el,
        done: async () => {
          await act(async () => root.unmount())
          el.remove()
        },
      }
    }
    const text = () => document.body.textContent ?? ""
    const html = () => document.body.innerHTML

    const cd = <ConfirmDialog open onOpenChange={() => {}} title="T" onConfirm={() => {}} />
    const cdJa = await mount(cd)
    expect(text()).toContain("確認")
    expect(text()).toContain("キャンセル")
    await cdJa.done()
    const cdEn = await mount(cd, "en")
    expect(text()).toContain("Confirm")
    expect(text()).toContain("Cancel")
    await cdEn.done()
    const cdLoading = await mount(<ConfirmDialog open onOpenChange={() => {}} title="T" onConfirm={() => {}} loading />, "en")
    expect(text()).toContain("Processing…")
    await cdLoading.done()

    // CoachMarkOverlay: Provider 無しは従来どおり（スキップは日本語・aria-label は英語）
    const steps = [
      { selector: "#none", title: "A", desc: "a" },
      { selector: "#none2", title: "B", desc: "b" },
    ]
    const cm = <CoachMarkOverlay steps={steps} open onComplete={() => {}} onSkip={() => {}} />
    const cmJa = await mount(cm)
    expect(html()).toContain('aria-label="Onboarding coach mark"')
    expect(text()).toContain("スキップ")
    await cmJa.done()
    const cmEn = await mount(cm, "en")
    expect(text()).toContain("Skip")
    expect(html()).toContain('aria-label="Onboarding coach mark"')
    await cmEn.done()
    const cmProp = await mount(
      <CoachMarkOverlay steps={steps} open onComplete={() => {}} onSkip={() => {}} labels={{ skip: "Pass", ariaLabel: "Tour" }} />,
      "en"
    )
    expect(text()).toContain("Pass")
    expect(html()).toContain('aria-label="Tour"')
    await cmProp.done()

    // MenuDrawer のシート見出し
    const md = <MenuDrawer open onClose={() => {}} sections={[]} />
    const mdJa = await mount(md)
    expect(text()).toContain("メニュー")
    await mdJa.done()
    const mdEn = await mount(md, "en")
    expect(text()).toContain("Menu")
    expect(text()).not.toContain("メニュー")
    await mdEn.done()

    // Toaster（通知 viewport）
    const tj = await mount(<Toaster />)
    await act(async () => {})
    expect(html()).toContain('aria-label="通知"')
    await tj.done()
    const te = await mount(<Toaster />, "en")
    await act(async () => {})
    expect(html()).toContain('aria-label="Notifications"')
    await te.done()
    const tp = await mount(<Toaster regionLabel="Alerts" />, "en")
    await act(async () => {})
    expect(html()).toContain('aria-label="Alerts"')
    await tp.done()
  })
})

// ─── 日本語の直書きの既定値を増やさない（ratchet） ──────────────────────────────

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const COMPONENTS = path.join(ROOT, "src", "components")
// ひらがな・カタカナ（長音「ー」・「ヴ」を含む）・半角カナ・漢字・々
const JP = "[ぁ-んァ-ヶーヴ｡-ﾟ一-龥々]"
/** 日本語を含む文字列（"…" / `…`）が 1 つでもあるか。テンプレートの `${…}` の中の "…" も拾う。 */
const HAS_JP_STRING = new RegExp(`"[^"\\n]*${JP}[^"\\n]*"|\`[^\`\\n]*${JP}[^\`\\n]*\``)

/** 検出の種類。UNMIGRATED のキーは種類ごとに接頭辞を付ける（A は接頭辞なし）。 */
// A: 引数デフォルト  `xxxLabel = "日本語"` / `"aria-label": x = "日本語"` / `xxxLabel = (n) => \`…日本語…\``（関数の中の " も含む）
// B: *Label 名の const への代入  `const defaultXxxLabel = "日本語"` / `= (n) => \`…件\``（モジュール直下・関数本体の両方）
// C: 本体内のフォールバック  `x ?? "日本語"`（`??` の次の行に続く三項演算子の中も見る）
const ARG_DEFAULT = /(?:^|[^\w.$])("aria-label"|\w*[lL]abel|\w*[pP]laceholder|\w*Unit)\s=\s/g
/** 1 行に既定が並ぶ書き方（`a = "x", b = "y"`）で、次の既定より後ろを見ないための区切り */
const NEXT_DEFAULT = /,\s*(?:"aria-label"|\w+)\s=\s/
const LABEL_CONST = /^\s*(?:export\s+)?const\s+(\w*[lL]abel\w*)\b[^=\n]*=\s*(.*)$/
const NULLISH = /(\w+)\s*\?\?\s*(.*)$/
/** JSX 属性に日本語の文字列を直接書いたもの（`placeholder="…"` は代入の空白が無い JSX の形だけ） */
const JSX_ATTR = new RegExp(`(?:^|[\\s<])(placeholder|aria-label|title|alt)="[^"\\n]*${JP}[^"\\n]*"`, "g")

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) return walk(p)
    return /\.tsx$/.test(e.name) && !/\.(stories|test)\.tsx$/.test(e.name) ? [p] : []
  })
}

function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " ")).replace(/(^|[^:])\/\/.*$/gm, "$1")
}

/** 行の続き。式が次の行に折り返しているとき（行末が `=` / `??` / `=>` 等）は数行ぶん足す。 */
function withContinuation(lines: string[], i: number, rest: string): string {
  if (!/(=|\?\?|=>|\?|:|\()\s*$/.test(rest.trimEnd()) && rest.trim() !== "") return rest
  return [rest, ...lines.slice(i + 1, i + 5)].join(" ")
}

/** ソース 1 ファイルぶんの直書きを `A: id` 相当の id で返す（A は接頭辞なし / B は `const:` / C は `??:`）。 */
function scanSource(source: string): string[] {
  const found = new Set<string>()
  const lines = stripComments(source).split("\n")
  lines.forEach((line, i) => {
    const isDecl = /^\s*(?:export\s+)?(?:const|let|var)\s/.test(line)
    // A: 引数デフォルト（const / let / var で始まる行は変数宣言なので B で見る）
    if (!isDecl) {
      // 1 行に既定が複数あるとき（`a = "x", b = "y"`）は 1 つずつ、次の既定の手前までを見る
      for (const m of line.matchAll(ARG_DEFAULT)) {
        const after = line.slice((m.index ?? 0) + m[0].length)
        const own = after.split(NEXT_DEFAULT)[0]
        if (HAS_JP_STRING.test(withContinuation(lines, i, own))) found.add(m[1])
      }
    }
    // B: *Label 名の const
    const c = LABEL_CONST.exec(line)
    if (c && HAS_JP_STRING.test(withContinuation(lines, i, c[2]))) found.add(`const:${c[1]}`)
    // D: JSX 属性の直書き（`attr:` 接頭辞）
    for (const m of line.matchAll(JSX_ATTR)) found.add(`attr:${m[1]}`)
    // C: `?? "日本語"`（1 行に複数あるときは全部見る）
    for (const m of line.matchAll(new RegExp(NULLISH.source, "g"))) {
      const rest = line.slice((m.index ?? 0) + m[0].indexOf("??") + 2)
      if (HAS_JP_STRING.test(withContinuation(lines, i, rest))) found.add(`??:${m[1]}`)
    }
  })
  return [...found].sort()
}

/** 開発者向けメッセージの呼び出し（console.warn( … ) / warnOnceInDev( … ) / throw new Error( … )）を空白に潰す。 */
function blankDevMessages(src: string): string {
  const starts = /(?:console\.(?:warn|error|info)|warnOnceInDev|throw\s+new\s+Error|new\s+Error)\s*\(/g
  let out = src
  for (const m of [...src.matchAll(starts)].reverse()) {
    const from = m.index ?? 0
    let i = from + m[0].length
    let depth = 1
    while (i < src.length && depth > 0) {
      if (src[i] === "(") depth++
      else if (src[i] === ")") depth--
      i++
    }
    out = out.slice(0, from) + out.slice(from, i).replace(/[^\n]/g, " ") + out.slice(i)
  }
  return out
}

/** E: 日本語を含む文字列リテラル（`str:`）と JSX の文章（`jsx:`）。id は先頭 20 文字。 */
function scanLiterals(source: string): string[] {
  const found = new Set<string>()
  const lines = blankDevMessages(stripComments(source)).split("\n")
  const STR = new RegExp(`"[^"\\n]*${JP}[^"\\n]*"|'[^'\\n]*${JP}[^'\\n]*'|\`[^\`\\n]*${JP}[^\`\\n]*\``, "g")
  const ANY_STR = /"[^"\n]*"|'[^'\n]*'|`[^`\n]*`/g
  for (const line of lines) {
    for (const m of line.matchAll(STR)) found.add(`str:${m[0].slice(1, -1).slice(0, 20)}`)
    // 文字列を除いても日本語が残る行 = JSX の文章
    const rest = line.replace(ANY_STR, " ").trim()
    if (new RegExp(JP).test(rest)) found.add(`jsx:${rest.slice(0, 20)}`)
  }
  return [...found].sort()
}

function findHardcoded(): Record<string, string[]> {
  const out: Record<string, string[]> = {}
  for (const file of walk(COMPONENTS)) {
    const rel = path.relative(ROOT, file).split(path.sep).join("/")
    // ksk-labels.tsx は辞書そのもの（日本語の正本）
    if (rel === "src/components/ui/ksk-labels.tsx") continue
    const text = fs.readFileSync(file, "utf8")
    const ids = [...new Set([...scanSource(text), ...scanLiterals(text)])].sort()
    if (ids.length) out[rel] = ids
  }
  return out
}

/**
 * まだ Provider に乗っていない直書き（ratchet）。移行したらここから消す（消し忘れも落ちる）。
 * 新しい直書きを足したくなったら、まず `useKskLabels()` のキーにできないか考える。
 * 本当に移せない理由があるときだけ、理由付きでここに足す（理由なしは不可）。
 *
 * 検出の対象外（理由）:
 * - ErrorBoundary / CookieConsent の `DEFAULT_LABELS`: 既定が英語（"Something went wrong" / "Cookies" 等）で、
 *   Provider 無し = ja の文言を変えずに Provider へ移すと ja が英語になってしまう。`labels` prop で
 *   アプリ側が翻訳して渡す設計（#477）のまま残す
 * - 開発者向けの `console.warn` / `throw`、日付の書式トークン・曜日
 */
type Unmigrated = readonly [file: string, ids: readonly string[], reason: string]
const R_LOCALE =
  "コンポーネント自身の `locale` prop（ja / en。既定は Provider の locale）で、日付・曜日の語順（「10月26日（月）」/ \"Mon, Oct 26\"）と" +
  "件数の文（「予定2件」/ \"2 events\"）を組み立てている。Provider の locale=\"en\" なら既に英語になる。" +
  "ラベルのキーに移すと、`locale` prop だけ渡す使い方（Provider 無し）で日本語に戻ってしまうため、locale 駆動のまま残す"
const R_FORMAT =
  "日付の書式トークン（EEE / EEEE）の曜日名で、文言ではなく書式。Provider の locale=\"en\" なら Intl の英語名になる（日本語は Provider 無しの従来表記）"
const R_TOAST =
  "`toast.saveComplete()` などのプリセット通知は React の外（module 関数）で出すので Provider が届かない。" +
  "英語化は `configureToast({ messages })`、または `toast.success(t(...))` で文言を渡す（未指定は従来の日本語）"
const UNMIGRATED: readonly Unmigrated[] = [
  [
    "src/components/patterns/agenda-list.tsx",
    ["??:emptyDayLabel", "const:headingLabel", "const:noEventsLabel", "str:${formatDayLabel(key", "str:予定なし"],
    R_LOCALE,
  ],
  [
    "src/components/patterns/month-calendar.tsx",
    [
      "??:ariaLabel",
      "??:moreLabel",
      "const:gridLabel",
      "str:${displayedMonthStar",
      "str:${start.getFullYear(",
      "str:+${n}件",
      "str:、予定${dayEvents.lengt",
      "str:、今日",
    ],
    R_LOCALE,
  ],
  ["src/components/ui/date-picker.tsx", ["str:${JA_WEEKDAYS[weekda", "str:日月火水木金土"], R_FORMAT],
  [
    "src/components/ui/toast.tsx",
    ["??:connectionRestored", "??:retryFailed", "??:retryStarted", "??:saveComplete", "str:保存しました", "str:再試行できませんでした", "str:再試行を開始しました", "str:接続が復旧しました"],
    R_TOAST,
  ],
]

// 同じファイルに複数の理由があるので、ファイル単位に畳む
const UNMIGRATED_MAP = new Map<string, Set<string>>()
for (const [file, ids] of UNMIGRATED) {
  UNMIGRATED_MAP.set(file, new Set([...(UNMIGRATED_MAP.get(file) ?? []), ...ids]))
}

describe("日本語の直書きの既定値（ratchet）", () => {
  const found = findHardcoded()

  it("新しい直書きが増えていない（Provider のキーを使う）", () => {
    const added: string[] = []
    for (const [file, ids] of Object.entries(found)) {
      for (const id of ids) {
        if (!UNMIGRATED_MAP.get(file)?.has(id)) added.push(`${file}: ${id}`)
      }
    }
    expect(
      added,
      "日本語を直書きした既定値がある（A=引数デフォルト / const:=Label 名の const / ??:=フォールバック）。" +
        "`label ?? useKskLabels().xxx` の形にして ksk-labels.tsx にキーを足す。" +
        "移行できない理由があるときだけ UNMIGRATED に理由付きで足す"
    ).toEqual([])
  })

  it("UNMIGRATED に移行済み・存在しない項目が残っていない", () => {
    const stale: string[] = []
    for (const [file, ids] of UNMIGRATED) {
      for (const id of ids) {
        if (!found[file]?.includes(id)) stale.push(`${file}: ${id}`)
      }
    }
    expect(stale, "移行済みの項目を UNMIGRATED から消す").toEqual([])
  })

  it("UNMIGRATED の各エントリに理由がある", () => {
    for (const [file, , reason] of UNMIGRATED) {
      expect(reason.trim().length, file).toBeGreaterThan(10)
    }
  })

  it("検出器が動いている（引数デフォルト・関数既定の中の \" / モジュール直下の const / `??` / JSX 属性）", () => {
    expect(scanSource("  removeLabel = (image) => `${image.name ?? \"画像\"}を削除`,")).toContain("removeLabel")
    expect(scanSource("  copyLabel = \"コピー\",")).toEqual(["copyLabel"])
    // 1 行に既定が並んでいても 1 つずつ見る（前の既定が英語なら巻き込まない）
    expect(scanSource("function F({ aLabel = \"x\", bLabel = \"数量\", cLabel = \"y\" }) {}")).toEqual(["bLabel"])
    expect(scanSource("const defaultResultCountLabel = (n: number) => `${n}件`")).toContain("const:defaultResultCountLabel")
    expect(scanSource("  const resolvedTitle =\n    title ??\n    (notFound ? \"見つかりません\" : \"エラー\")")).toContain(
      "??:title"
    )
    // placeholder・単位・JSX 属性の直書き（D）も見る
    expect(scanSource('  placeholder = "日付を選択",')).toEqual(["placeholder"])
    expect(scanSource('  searchPlaceholder = "検索...",')).toEqual(["searchPlaceholder"])
    expect(scanSource('  dayUnit = "日",')).toEqual(["dayUnit"])
    expect(scanSource('  <input placeholder="入力してください" />')).toEqual(["attr:placeholder"])
    expect(scanSource('  <button aria-label="閉じる" title="閉じる">')).toEqual(["attr:aria-label", "attr:title"])
    expect(scanSource('  <input placeholder={placeholder ?? labels.x} />')).toEqual([])
    expect(scanSource('  dayUnit = "d",')).toEqual([])
    // E: 文字列リテラル全般・JSX の文章（開発者向けメッセージは対象外）
    expect(scanLiterals('  const x = cond ? "はい" : "いいえ"')).toEqual(["str:いいえ", "str:はい"])
    expect(scanLiterals("  return { label: `${n}件` }")).toEqual(["str:${n}件"])
    expect(scanLiterals("  <p>最終更新日：{date}</p>")).toEqual(["jsx:<p>最終更新日：{date}</p>"])
    expect(scanLiterals('  console.warn(\n    "開発者向け"\n  )')).toEqual([])
    expect(scanLiterals('  warnOnceInDev("k", "開発者向け")')).toEqual([])
    expect(scanLiterals('  throw new Error("開発者向け")')).toEqual([])
    expect(scanLiterals('  const y = "English only"')).toEqual([])
    // 日本語の無い既定・Provider 経由・文字列の外の日本語は対象外
    expect(scanSource("  const x = labelProp ?? defaultLabels.close")).toEqual([])
    expect(scanSource("  const label = \"Close\"")).toEqual([])
    expect(scanSource("  const y = a ?? \"b\"} 日本語")).toEqual([])
    expect(scanSource("  // copyLabel = \"コピー\"")).toEqual([])
  })
})
