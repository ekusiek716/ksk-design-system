/**
 * @vitest-environment jsdom
 *
 * KskLabelsProvider の網羅（issue #723 の続き）。
 *
 * 1. 代表部品で「Provider 無し=従来の日本語 / locale="en" で英語 / prop が最優先」を固定する
 * 2. `src/components/**` を走査し、日本語の文言を直書きした既定値が**新たに増えたら落とす**
 *    （英語アプリで部品ごとに prop を渡すしかない状態を増やさない）。検出するのは次の 3 種類:
 *    A. 引数デフォルト  `xxxLabel = "日本語"` / `"aria-label": x = "日本語"` / `xxxLabel = (n) => \`…日本語…\``
 *    B. Label 名の const  `const defaultXxxLabel = "日本語"`（モジュール直下も関数本体も）
 *    C. 本体内のフォールバック  `x ?? "日本語"`（次の行に折り返した三項演算子の中も）
 *
 * 2 は ratchet 方式。まだ Provider に乗っていない箇所は UNMIGRATED に理由付きで残してあり、
 * 移行したら（=直書きが消えたら）エントリを消さないと落ちる。正当な例外は理由付きで UNMIGRATED に足せる。
 *
 * 今回の対象外（検出もしない）: placeholder（選択してください・検索...・日付を選択）、
 * 単位（日/時間/分/秒）、オブジェクト形の DEFAULT_LABELS（ErrorBoundary / CoachMarkOverlay / CookieConsent）。
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
    expect(en(day)).toContain("Time left 5日")
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
      expect(KSK_DEFAULT_LABELS.ja[key], `ja.${key}`).toBeTruthy()
      expect(KSK_DEFAULT_LABELS.en[key], `en.${key}`).toBeTruthy()
    }
    expect(Object.keys(KSK_DEFAULT_LABELS.en).sort()).toEqual(Object.keys(KSK_DEFAULT_LABELS.ja).sort())
  })
})

// ─── 日本語の直書きの既定値を増やさない（ratchet） ──────────────────────────────

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const COMPONENTS = path.join(ROOT, "src", "components")
const JP = "[ぁ-んァ-ン一-龥]"
/** 日本語を含む文字列（"…" / `…`）が 1 つでもあるか。テンプレートの `${…}` の中の "…" も拾う。 */
const HAS_JP_STRING = new RegExp(`"[^"\\n]*${JP}[^"\\n]*"|\`[^\`\\n]*${JP}[^\`\\n]*\``)

/** 検出の種類。UNMIGRATED のキーは種類ごとに接頭辞を付ける（A は接頭辞なし）。 */
// A: 引数デフォルト  `xxxLabel = "日本語"` / `"aria-label": x = "日本語"` / `xxxLabel = (n) => \`…日本語…\``（関数の中の " も含む）
// B: *Label 名の const への代入  `const defaultXxxLabel = "日本語"` / `= (n) => \`…件\``（モジュール直下・関数本体の両方）
// C: 本体内のフォールバック  `x ?? "日本語"`（`??` の次の行に続く三項演算子の中も見る）
const ARG_DEFAULT = /(?:^|[^\w.$])("aria-label"|\w*[lL]abel)\s=\s/g
/** 1 行に既定が並ぶ書き方（`a = "x", b = "y"`）で、次の既定より後ろを見ないための区切り */
const NEXT_DEFAULT = /,\s*(?:"aria-label"|\w+)\s=\s/
const LABEL_CONST = /^\s*(?:export\s+)?const\s+(\w*[lL]abel\w*)\b[^=\n]*=\s*(.*)$/
const NULLISH = /(\w+)\s*\?\?\s*(.*)$/

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
    // C: `?? "日本語"`（1 行に複数あるときは全部見る）
    for (const m of line.matchAll(new RegExp(NULLISH.source, "g"))) {
      const rest = line.slice((m.index ?? 0) + m[0].indexOf("??") + 2)
      if (HAS_JP_STRING.test(withContinuation(lines, i, rest))) found.add(`??:${m[1]}`)
    }
  })
  return [...found].sort()
}

function findHardcoded(): Record<string, string[]> {
  const out: Record<string, string[]> = {}
  for (const file of walk(COMPONENTS)) {
    const rel = path.relative(ROOT, file).split(path.sep).join("/")
    const ids = scanSource(fs.readFileSync(file, "utf8"))
    if (ids.length) out[rel] = ids
  }
  return out
}

/**
 * まだ Provider に乗っていない直書き（ratchet）。移行したらここから消す（消し忘れも落ちる）。
 * 新しい直書きを足したくなったら、まず `useKskLabels()` のキーにできないか考える。
 * 本当に移せない理由があるときだけ、理由付きでここに足す（理由なしは不可）。
 *
 * 検出対象外（今回の網羅の対象外。後続で扱う）:
 * - placeholder（「選択してください」「検索...」「日付を選択」等）
 * - 単位（CountdownTimer の 日/時間/分/秒 等）
 * - オブジェクト形の既定文言（ErrorBoundary / CoachMarkOverlay / CookieConsent の DEFAULT_LABELS、Toaster の toastLabels）
 */
type Unmigrated = readonly [file: string, ids: readonly string[], reason: string]
const R_LATER = "未移行（#723 の続き。Provider のキーを足して順次移行する）"
const R_FN = "件数・名前を差し込む関数形の既定。Provider の `{count}` / `{index}` 差し込みで移行できるが別 PR（#723 の続き）"
const R_FALLBACK = "他の prop が無いときの最終フォールバック（読み上げ補助）。Provider のキーを足して別 PR で移行（#723 の続き）"
const R_LOCALE = "`locale` prop（ja / en）で出し分け済み。Provider 未対応だが英語でも崩れない（#723 の続き）"
const UNMIGRATED: readonly Unmigrated[] = [
  ["src/components/patterns/_internal/carousel-primitives.tsx", ["nextLabel", "previousLabel"], R_LATER],
  ["src/components/patterns/admin/bulk-actions.tsx", ["countLabel"], R_FN],
  ["src/components/patterns/admin/bulk-actions.tsx", ["clearLabel"], R_LATER],
  ["src/components/patterns/admin/data-table.tsx", ["??:ariaLabel"], R_FALLBACK],
  ["src/components/patterns/admin/data-table.tsx", ["countLabel"], R_FN],
  ["src/components/patterns/admin/data-table.tsx", ["emptyLabel", "label", "menuLabel", "selectAllLabel", "selectionColumnLabel"], R_LATER],
  ["src/components/patterns/admin/image-uploader.tsx", ["addLabel"], R_LATER],
  ["src/components/patterns/agenda-list.tsx", ["??:emptyDayLabel", "const:headingLabel", "const:noEventsLabel"], R_LOCALE],
  ["src/components/patterns/banner-carousel.tsx", ["moreLabel", "regionLabel"], R_LATER],
  ["src/components/patterns/celebration.tsx", ["??:title"], R_FALLBACK],
  ["src/components/patterns/chip-filter-bar.tsx", ["const:defaultResultCountLabel"], R_FN],
  ["src/components/patterns/chip.tsx", ["const:removeLabel"], R_FN],
  ["src/components/patterns/commerce/bottom-tab-bar.tsx", ["navLabel"], R_LATER],
  ["src/components/patterns/commerce/filter-bar.tsx", ["??:label", "??:sortLabel"], R_FALLBACK],
  ["src/components/patterns/commerce/filter-bar.tsx", ["moreFiltersLabel", "navLabel"], R_LATER],
  ["src/components/patterns/commerce/image-carousel.tsx", ["nextLabel", "previousLabel", "regionLabel"], R_LATER],
  ["src/components/patterns/commerce/order-summary.tsx", ["totalLabel"], R_LATER],
  ["src/components/patterns/commerce/product-card.tsx", ["cartButtonLabel"], R_LATER],
  ["src/components/patterns/commerce/product-carousel.tsx", ["moreLabel"], R_LATER],
  ["src/components/patterns/commerce/quantity-selector.tsx", ["decreaseLabel", "deleteLabel", "groupLabel", "increaseLabel"], R_LATER],
  ["src/components/patterns/compact-file-picker.tsx", ["??:name", "removeLabel"], R_FN],
  ["src/components/patterns/compact-file-picker.tsx", ["label", "loadingLabel", "triggerLabel"], R_LATER],
  ["src/components/patterns/confirm-dialog.tsx", ["cancelLabel", "confirmLabel", "loadingLabel"], R_LATER],
  ["src/components/patterns/content-carousel.tsx", ["ariaLabel"], R_LATER],
  ["src/components/patterns/error-state.tsx", ["??:description", "??:title"], R_FALLBACK],
  ["src/components/patterns/feature-comparison-table.tsx", ["availableLabel", "featureLabel", "unavailableLabel"], R_LATER],
  ["src/components/patterns/file-upload.tsx", ["browseLabel", "dragLabel", "maxFilesLabel", "maxSizeLabel", "orLabel", "removeLabel"], R_LATER],
  ["src/components/patterns/filter-pill.tsx", ["??:clearLabel", "??:panelLabel"], R_FALLBACK],
  ["src/components/patterns/kanban-column.tsx", ["??:countLabel", "const:label"], R_FN],
  ["src/components/patterns/media-action-cluster.tsx", ["ariaLabel"], R_LATER],
  ["src/components/patterns/month-calendar.tsx", ["??:ariaLabel", "??:moreLabel", "const:gridLabel"], R_LOCALE],
  ["src/components/patterns/review-overlay.tsx", ["??:comment"], R_FALLBACK],
  ["src/components/patterns/sidebar-nav.tsx", ["navLabel"], R_LATER],
  ["src/components/patterns/swipe-row.tsx", ["actionsLabel"], R_LATER],
  ["src/components/patterns/tag-input.tsx", ["??:inputLabel", "const:resolvedInputLabel"], R_FALLBACK],
  ["src/components/ui/code-input.tsx", ["const:defaultCellLabel"], R_FN],
  ["src/components/ui/progress-ring.tsx", ["??:ariaLabel"], R_FALLBACK],
  ["src/components/ui/progress.tsx", ["??:ariaLabel"], R_FALLBACK],
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

  it("検出器が 3 種類とも動いている（関数既定の中の \" / モジュール直下の const / `??`）", () => {
    expect(scanSource("  removeLabel = (image) => `${image.name ?? \"画像\"}を削除`,")).toContain("removeLabel")
    expect(scanSource("  copyLabel = \"コピー\",")).toEqual(["copyLabel"])
    // 1 行に既定が並んでいても 1 つずつ見る（前の既定が英語なら巻き込まない）
    expect(scanSource("function F({ aLabel = \"x\", bLabel = \"数量\", cLabel = \"y\" }) {}")).toEqual(["bLabel"])
    expect(scanSource("const defaultResultCountLabel = (n: number) => `${n}件`")).toContain("const:defaultResultCountLabel")
    expect(scanSource("  const resolvedTitle =\n    title ??\n    (notFound ? \"見つかりません\" : \"エラー\")")).toContain(
      "??:title"
    )
    // 日本語の無い既定・Provider 経由・文字列の外の日本語は対象外
    expect(scanSource("  const x = labelProp ?? defaultLabels.close")).toEqual([])
    expect(scanSource("  const label = \"Close\"")).toEqual([])
    expect(scanSource("  const y = a ?? \"b\"} 日本語")).toEqual([])
    expect(scanSource("  // copyLabel = \"コピー\"")).toEqual([])
  })
})
