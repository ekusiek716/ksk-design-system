// =============================================================
// KSK Design System — Prototype Host（localhost プレビュー）
//
// `npm run dev`（http://localhost:5173）で開く。ハッシュルーティングで
//   #/            → プロトタイプ一覧
//   #/<slug>      → 単一プロトタイプ（SP/PC フレーム切替つき）
// react-router は使わず location.hash のみで完結（依存を増やさない）。
// =============================================================
import { type ComponentType, useEffect, useLayoutEffect, useRef, useState } from "react"
import { ArrowLeft2, Mobile, Monitor, DocumentText, Element4, RowVertical, ExportSquare, HamburgerMenu } from "iconsax-reactjs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import {
  DataTable, DataTableTable, DataTableHeader, DataTableBody, DataTableRow,
  DataTableHead, DataTableCell,
} from "@/components/patterns/admin/data-table"
import { listPrototypes, findPrototype, findGroupSiblings, groupVariantCount, type PrototypeEntry } from "./_registry"
import { Markdown } from "./_markdown"

type Frame = "SP" | "PC"
type ListView = "card" | "table"

/**
 * MockThumb — プロトタイプを縮小描画する「ライブサムネ」。
 * 画像ファイルを貯めず、常に最新の見た目を出す。390px 幅でレンダーし、
 * 親要素の実幅に合わせて transform: scale する。transform は position:fixed の
 * 含みブロックになるため、モック内の固定バー等もサムネ内に収まる。
 * 親は position:relative + サイズ（aspect-[4/3] や size-12）を与えること。
 */
const THUMB_BASE = 390

function MockThumb({ Component }: { Component: ComponentType }) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setScale(el.clientWidth / THUMB_BASE)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <div ref={ref} aria-hidden className="absolute inset-0 overflow-hidden bg-[var(--Surface-Secondary)]">
      {scale > 0 && (
        <div
          className="pointer-events-none origin-top-left select-none"
          style={{ width: THUMB_BASE, transform: `scale(${scale})` }}
          inert
        >
          <Component />
        </div>
      )}
    </div>
  )
}

function useHashSlug(): string {
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const on = () => setHash(window.location.hash)
    window.addEventListener("hashchange", on)
    return () => window.removeEventListener("hashchange", on)
  }, [])
  return hash.replace(/^#\/?/, "")
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h2 className="typo-heading-lg text-[var(--Text-High-Emphasis)]">モックがまだありません</h2>
      <p className="typo-body-md text-[var(--Text-Medium-Emphasis)] mt-3">
        Claude に Notion の仕様リンクを貼って <code className="typo-label-sm bg-[var(--Surface-Tertiary)] px-1.5 py-0.5 rounded-sm">/mock &lt;Notion URL&gt;</code> を実行すると、
        ここに DS 準拠のモックが生成されます。
      </p>
    </div>
  )
}

/** デバイスを "/" で分割して個別のタグで表示（"SP/PC" → [SP][PC]） */
function DeviceTags({ device }: { device?: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      {(device ?? "SP").split("/").map((d) => (
        <Badge key={d} variant="subtle">{d}</Badge>
      ))}
    </span>
  )
}

function CardGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 @md:grid-cols-2 lg:grid-cols-3">
      {listPrototypes.map((p) => {
        const variants = groupVariantCount(p.slug)
        return (
        <a
          key={p.slug}
          href={`#/${p.slug}`}
          className="block overflow-hidden rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow-md)]"
        >
          {/* 4:3 プレビュー */}
          <div className="relative aspect-[4/3] w-full border-b border-[var(--Border-Low-Emphasis)]">
            <MockThumb Component={p.Component} />
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2">
              <DeviceTags device={p.meta.device} />
              {variants > 1 && (
                <Badge variant="secondary">{variants} バリアント</Badge>
              )}
              {p.meta.createdAt && (
                <span className="typo-label-xs text-[var(--Text-Low-Emphasis)]">{p.meta.createdAt}</span>
              )}
            </div>
            <h3 className="typo-heading-sm text-[var(--Text-High-Emphasis)] mt-3">{p.meta.title}</h3>
            {p.meta.description && (
              <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)] mt-1 line-clamp-2">
                {p.meta.description}
              </p>
            )}
          </div>
        </a>
        )
      })}
    </div>
  )
}

function TableList() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]">
      <DataTable>
        <DataTableTable>
          <DataTableHeader>
            <tr>
              <DataTableHead />
              <DataTableHead>タイトル</DataTableHead>
              <DataTableHead>デバイス</DataTableHead>
              <DataTableHead>作成日</DataTableHead>
              <DataTableHead>説明</DataTableHead>
            </tr>
          </DataTableHeader>
          <DataTableBody>
            {listPrototypes.map((p) => {
              const variants = groupVariantCount(p.slug)
              return (
              <DataTableRow
                key={p.slug}
                className="cursor-pointer"
                onClick={() => (window.location.hash = `#/${p.slug}`)}
              >
                <DataTableCell className="w-[64px]">
                  <div className="relative size-12 overflow-hidden rounded-md border border-[var(--Border-Low-Emphasis)]">
                    <MockThumb Component={p.Component} />
                  </div>
                </DataTableCell>
                <DataTableCell>
                  <span className="inline-flex items-center gap-2">
                    <span className="typo-label-sm text-[var(--Text-High-Emphasis)]">{p.meta.title}</span>
                    {variants > 1 && (
                      <Badge variant="secondary">{variants} バリアント</Badge>
                    )}
                  </span>
                </DataTableCell>
                <DataTableCell>
                  <DeviceTags device={p.meta.device} />
                </DataTableCell>
                <DataTableCell>
                  <span className="typo-body-sm text-[var(--Text-Low-Emphasis)]">{p.meta.createdAt ?? "—"}</span>
                </DataTableCell>
                <DataTableCell>
                  <span className="typo-body-sm text-[var(--Text-Medium-Emphasis)] line-clamp-1">
                    {p.meta.description ?? ""}
                  </span>
                </DataTableCell>
              </DataTableRow>
              )
            })}
          </DataTableBody>
        </DataTableTable>
      </DataTable>
    </div>
  )
}

function IndexView() {
  const [view, setView] = useState<ListView>(() => {
    const v = typeof localStorage !== "undefined" ? localStorage.getItem("mock-list-view") : null
    return v === "table" ? "table" : "card"
  })
  const changeView = (v: ListView) => {
    setView(v)
    try {
      localStorage.setItem("mock-list-view", v)
    } catch {
      /* localStorage 不可環境は無視 */
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="typo-heading-xl text-[var(--Text-High-Emphasis)]">モックプレビュー</h1>
          <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)] mt-1">
            KSK Design System — Notion 仕様から生成したモック一覧
          </p>
        </div>
        {listPrototypes.length > 0 && (
          <div className="flex shrink-0 items-center gap-1 rounded-full border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-1">
            <Button
              variant={view === "card" ? "secondary" : "ghost"}
              size="icon-sm"
              aria-label="カード表示"
              aria-pressed={view === "card"}
              onClick={() => changeView("card")}
            >
              <Element4 size={18} />
            </Button>
            <Button
              variant={view === "table" ? "secondary" : "ghost"}
              size="icon-sm"
              aria-label="テーブル表示"
              aria-pressed={view === "table"}
              onClick={() => changeView("table")}
            >
              <RowVertical size={18} />
            </Button>
          </div>
        )}
      </div>

      {listPrototypes.length === 0 ? <EmptyState /> : view === "card" ? <CardGrid /> : <TableList />}
    </div>
  )
}

/**
 * DetailSidebar — 詳細画面の左カラム。
 * meta の情報・Notion 仕様リンク・spec.md 全文・同 group の関連モック導線をまとめる。
 */
function DetailSidebar({ entry, siblings }: { entry: PrototypeEntry; siblings: PrototypeEntry[] }) {
  const { meta, specSource } = entry
  return (
    <aside className="flex flex-col gap-6 border-r border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-5">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <DeviceTags device={meta.device} />
          {meta.createdAt && (
            <span className="typo-label-xs text-[var(--Text-Low-Emphasis)]">{meta.createdAt}</span>
          )}
        </div>
        <h2 className="typo-heading-md text-[var(--Text-High-Emphasis)] mt-3">{meta.title}</h2>
        {meta.variantLabel && (
          <p className="typo-label-sm text-[var(--Text-Accent-Primary)] mt-1">{meta.variantLabel}</p>
        )}
        {meta.description && (
          <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)] mt-2">{meta.description}</p>
        )}
      </div>

      {meta.notionUrl && (
        <Button
          variant="secondary"
          className="w-full justify-center gap-2"
          onClick={() => window.open(meta.notionUrl, "_blank", "noreferrer")}
        >
          <DocumentText size={16} />
          Notion 仕様を開く
          <ExportSquare size={14} />
        </Button>
      )}

      {siblings.length > 0 && (
        <section>
          <h3 className="typo-label-md text-[var(--Text-High-Emphasis)] mb-2">関連モック</h3>
          <p className="typo-label-xs text-[var(--Text-Low-Emphasis)] mb-3">
            同じグループの分岐パターン
          </p>
          <ul className="flex flex-col gap-2">
            {siblings.map((s) => (
              <li key={s.slug}>
                <a
                  href={`#/${s.slug}`}
                  className="flex items-center gap-3 rounded-lg border border-[var(--Border-Low-Emphasis)] p-2 transition-colors hover:bg-[var(--Surface-Secondary)]"
                >
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-md border border-[var(--Border-Low-Emphasis)]">
                    <MockThumb Component={s.Component} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="typo-label-sm text-[var(--Text-High-Emphasis)] truncate">
                      {s.meta.variantLabel ?? s.meta.title}
                    </p>
                    {s.meta.description && (
                      <p className="typo-label-xs text-[var(--Text-Medium-Emphasis)] line-clamp-1">
                        {s.meta.description}
                      </p>
                    )}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {specSource && (
        <section>
          <h3 className="typo-label-md text-[var(--Text-High-Emphasis)] mb-2">仕様メモ</h3>
          <p className="typo-label-xs text-[var(--Text-Low-Emphasis)] mb-3">
            <code className="typo-label-xs">{entry.slug}.spec.md</code> の内容
          </p>
          <Markdown source={specSource} />
        </section>
      )}
    </aside>
  )
}

function DetailView({ slug }: { slug: string }) {
  const entry = findPrototype(slug)
  const [frame, setFrame] = useState<Frame>(
    entry?.meta.device === "PC" ? "PC" : "SP",
  )
  const [sheetOpen, setSheetOpen] = useState(false)
  const changeFrame = (f: Frame) => {
    setFrame(f)
    if (f === "PC") setSheetOpen(false)
  }

  if (!entry) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h2 className="typo-heading-lg text-[var(--Text-High-Emphasis)]">見つかりません</h2>
        <p className="typo-body-md text-[var(--Text-Medium-Emphasis)] mt-3">
          <code className="typo-label-sm">{slug}</code> というモックはありません。
        </p>
        <Button variant="secondary" className="mt-6" onClick={() => (window.location.hash = "#/")}>
          一覧へ戻る
        </Button>
      </div>
    )
  }

  const { Component, meta } = entry
  const siblings = findGroupSiblings(slug)
  const hasSidebar = Boolean(meta.notionUrl || entry.specSource || siblings.length > 0 || meta.description)
  // SP プレビューのときはサイドバーを Sheet に隠してモックを全画面で見せる。
  // PC プレビューのときは従来通り左に固定サイドバーを置く（広幅で grid 分割）。
  const showInlineSidebar = hasSidebar && frame === "PC"
  const showSheetTrigger = hasSidebar && frame === "SP"

  return (
    <div className="min-h-dvh">
      {/* ツールバー（プレビュー用クローム。モックの「サービスのヘッダー」と
          誤読されないよう、ダークな dev バー + PREVIEW ラベルで明確に区別する） */}
      <div className="sticky top-0 z-50 flex items-center gap-3 bg-[var(--Surface-Inverse)] px-4 py-2.5">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="一覧へ戻る"
          className="text-[var(--Text-on-Inverse)]"
          onClick={() => (window.location.hash = "#/")}
        >
          <ArrowLeft2 size={20} />
        </Button>
        {showSheetTrigger && (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="モック情報を開く"
            className="text-[var(--Text-on-Inverse)]"
            onClick={() => setSheetOpen(true)}
          >
            <HamburgerMenu size={20} />
          </Button>
        )}
        <span className="typo-label-xs shrink-0 rounded bg-[var(--Brand-Primary)] px-1.5 py-0.5 text-[var(--Text-on-Inverse)]">
          PREVIEW
        </span>
        <div className="min-w-0 flex-1">
          <p className="typo-label-md text-[var(--Text-on-Inverse)] truncate">{meta.title}</p>
        </div>
        {meta.notionUrl && frame === "PC" && (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="元の仕様を開く"
            className="text-[var(--Text-on-Inverse)]"
            onClick={() => window.open(meta.notionUrl, "_blank", "noreferrer")}
          >
            <DocumentText size={18} />
          </Button>
        )}
        <div className="flex items-center gap-1 rounded-full bg-[var(--Surface-Primary)] p-1">
          <Button
            variant={frame === "SP" ? "secondary" : "ghost"}
            size="icon-sm"
            aria-label="SP 表示"
            aria-pressed={frame === "SP"}
            onClick={() => changeFrame("SP")}
          >
            <Mobile size={18} />
          </Button>
          <Button
            variant={frame === "PC" ? "secondary" : "ghost"}
            size="icon-sm"
            aria-label="PC 表示"
            aria-pressed={frame === "PC"}
            onClick={() => changeFrame("PC")}
          >
            <Monitor size={18} />
          </Button>
        </div>
      </div>

      {/* 本体: PC 表示のときだけ左に固定サイドバー、SP 表示のときは全幅でモックを中央寄せ。 */}
      <div className={showInlineSidebar ? "@container" : ""}>
        <div className={showInlineSidebar ? "@4xl:grid @4xl:grid-cols-[320px_1fr]" : ""}>
          {showInlineSidebar && <DetailSidebar entry={entry} siblings={siblings} />}

          {/* プレビュー領域 */}
          <div className="bg-[var(--Surface-Secondary)] p-4 @container">
            {frame === "SP" ? (
              <div className="mx-auto w-full max-w-[390px] overflow-hidden rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] shadow-[var(--shadow-lg)]">
                <Component />
              </div>
            ) : (
              <div className="mx-auto w-full overflow-hidden rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] shadow-[var(--shadow-md)]">
                <Component />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SP 表示時に hamburger から開く情報シート。サイドバーと同じ内容を中で表示。 */}
      {hasSidebar && (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent side="left" className="w-[320px] max-w-[88vw] p-0">
            <SheetTitle className="sr-only">モック情報</SheetTitle>
            <div className="h-full overflow-y-auto">
              <DetailSidebar entry={entry} siblings={siblings} />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}

export function PrototypeHost() {
  const slug = useHashSlug()
  return (
    <div className="min-h-dvh bg-[var(--Surface-Secondary)]">
      {slug ? <DetailView slug={slug} /> : <IndexView />}
    </div>
  )
}
