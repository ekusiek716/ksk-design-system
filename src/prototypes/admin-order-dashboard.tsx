// 受注管理ダッシュボード（管理画面）。
// シェル骨格は @container で内製（AdminShell は viewport+h-screen 依存=枠非追従, issue #40）。
// 中身は実 DS: StatCard / StatusTabs / DataTable / BulkActions / Badge / Input。
import { useMemo, useState } from "react"
import { Element3, ShoppingCart, Box, Profile2User, Setting2, SearchNormal1, Wallet3, ReceiptText, TruckFast } from "iconsax-reactjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/patterns/stat-card"
import { StatusTabs } from "@/components/patterns/admin/status-tabs"
import { BulkActions } from "@/components/patterns/admin/bulk-actions"
import {
  DataTable, DataTableTable, DataTableHeader, DataTableBody, DataTableRow,
  DataTableHead, DataTableCell, DataTableCheckboxCell, DataTableActionCell,
} from "@/components/patterns/admin/data-table"

export const meta = {
  title: "受注管理ダッシュボード",
  device: "PC" as const,
  createdAt: "2026/06/16",
  description: "管理画面。KPI カード + ステータスタブ + 注文テーブル（選択・フィルタ・一括操作）。",
}

const nav = [
  { icon: Element3, label: "ダッシュボード", active: true },
  { icon: ShoppingCart, label: "受注管理", active: false },
  { icon: Box, label: "商品管理", active: false },
  { icon: Profile2User, label: "顧客管理", active: false },
  { icon: Setting2, label: "設定", active: false },
]

type Status = "未処理" | "出荷済み" | "キャンセル"
const statusVariant: Record<Status, "warning" | "success" | "secondary"> = {
  未処理: "warning",
  出荷済み: "success",
  キャンセル: "secondary",
}

interface Order { id: string; customer: string; amount: number; status: Status; date: string }
const orders: Order[] = [
  { id: "#10293", customer: "佐藤 美咲", amount: 12800, status: "未処理", date: "06/16 09:12" },
  { id: "#10292", customer: "鈴木 一郎", amount: 4980, status: "未処理", date: "06/16 08:40" },
  { id: "#10291", customer: "高橋 結衣", amount: 23400, status: "出荷済み", date: "06/15 19:03" },
  { id: "#10290", customer: "田中 健太", amount: 7600, status: "出荷済み", date: "06/15 15:22" },
  { id: "#10289", customer: "渡辺 さくら", amount: 3200, status: "キャンセル", date: "06/15 11:48" },
  { id: "#10288", customer: "伊藤 大輔", amount: 18900, status: "未処理", date: "06/15 10:05" },
]

const tabs: Array<{ label: string; value: Status | "all" }> = [
  { label: "すべて", value: "all" },
  { label: "未処理", value: "未処理" },
  { label: "出荷済み", value: "出荷済み" },
  { label: "キャンセル", value: "キャンセル" },
]

const yen = (n: number) => "¥" + n.toLocaleString("ja-JP")

export default function AdminOrderDashboard() {
  const [tabIndex, setTabIndex] = useState(0)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [query, setQuery] = useState("")

  const activeStatus = tabs[tabIndex].value
  const tabItems = useMemo(
    () => tabs.map((t) => ({
      label: t.label,
      count: t.value === "all" ? orders.length : orders.filter((o) => o.status === t.value).length,
    })),
    [],
  )

  const rows = useMemo(() => orders.filter((o) => {
    const byTab = activeStatus === "all" || o.status === activeStatus
    const byQuery = !query || o.customer.includes(query) || o.id.includes(query)
    return byTab && byQuery
  }), [activeStatus, query])

  const allChecked = rows.length > 0 && rows.every((o) => selected.has(o.id))
  const toggleAll = () =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (allChecked) rows.forEach((o) => next.delete(o.id))
      else rows.forEach((o) => next.add(o.id))
      return next
    })
  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  return (
    <div className="@container min-h-dvh bg-[var(--Surface-Secondary)]">
      {/* シェル骨格: PC は左サイドバー + メイン、狭い枠ではサイドバーを畳む */}
      <div className="@3xl:grid @3xl:grid-cols-[220px_1fr]">
        {/* サイドバー */}
        <aside className="hidden @3xl:flex h-dvh sticky top-0 flex-col border-r border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-3">
          <div className="px-3 py-2 flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)] typo-label-sm">管</span>
            <span className="typo-label-md text-[var(--Text-High-Emphasis)]">Admin Console</span>
          </div>
          <nav className="mt-3 flex flex-col gap-1">
            {nav.map(({ icon: Icon, label, active }) => (
              <Button
                key={label}
                variant={active ? "secondary-switch" : "ghost"}
                size="default"
                className="w-full justify-start gap-3"
              >
                <Icon size={18} variant={active ? "Bold" : "Linear"} />
                {label}
              </Button>
            ))}
          </nav>
        </aside>

        {/* メイン */}
        <div className="min-w-0">
          {/* ヘッダー */}
          <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] px-5 py-3">
            <h1 className="typo-heading-sm text-[var(--Text-High-Emphasis)] flex-1">受注管理</h1>
            <div className="hidden @xl:block w-64">
              <Input
                startAdornment={<SearchNormal1 size={16} className="text-[var(--Text-Low-Emphasis)]" />}
                placeholder="注文番号・顧客名で検索"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <span className="flex size-8 items-center justify-center rounded-full bg-[var(--Surface-Accent-Primary-Light)] typo-label-sm text-[var(--Text-Accent-Primary)]">奥</span>
          </header>

          <main className="p-5">
            {/* KPI カード */}
            <div className="grid grid-cols-1 gap-3 @xl:grid-cols-2 @4xl:grid-cols-4">
              <StatCard variant="accent" label="本日の売上" value="¥284,300" trend={{ value: 12.5, label: "前日比" }} icon={<Wallet3 size={20} />} />
              <StatCard variant="caution" label="未処理の注文" value={3} unit="件" trend={{ value: 8.0, label: "前日比" }} icon={<ReceiptText size={20} />} />
              <StatCard variant="info" label="出荷待ち" value={5} unit="件" icon={<TruckFast size={20} />} />
              <StatCard label="返品リクエスト" value={1} unit="件" trend={{ value: -25.0, label: "前日比" }} icon={<Box size={20} />} />
            </div>

            {/* 注文一覧パネル */}
            <section className="mt-5 rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-4">
              <div className="flex flex-col gap-3 @2xl:flex-row @2xl:items-center @2xl:justify-between">
                <StatusTabs items={tabItems} activeIndex={tabIndex} onSelect={setTabIndex} />
                <div className="@xl:hidden">
                  <Input
                    startAdornment={<SearchNormal1 size={16} className="text-[var(--Text-Low-Emphasis)]" />}
                    placeholder="検索"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-4">
                <DataTable>
                  <DataTableTable>
                    <DataTableHeader>
                      <tr>
                        <DataTableCheckboxCell
                          as="th"
                          checked={allChecked}
                          indeterminate={!allChecked && rows.some((o) => selected.has(o.id))}
                          onCheckedChange={toggleAll}
                        />
                        <DataTableHead>注文番号</DataTableHead>
                        <DataTableHead>顧客</DataTableHead>
                        <DataTableHead align="right">金額</DataTableHead>
                        <DataTableHead>ステータス</DataTableHead>
                        <DataTableHead>日時</DataTableHead>
                        <DataTableHead />
                      </tr>
                    </DataTableHeader>
                    <DataTableBody>
                      {rows.map((o) => (
                        <DataTableRow key={o.id} selected={selected.has(o.id)}>
                          <DataTableCheckboxCell
                            checked={selected.has(o.id)}
                            onCheckedChange={() => toggleOne(o.id)}
                          />
                          <DataTableCell>
                            <span className="typo-label-sm text-[var(--Text-High-Emphasis)]">{o.id}</span>
                          </DataTableCell>
                          <DataTableCell>{o.customer}</DataTableCell>
                          <DataTableCell align="right">{yen(o.amount)}</DataTableCell>
                          <DataTableCell>
                            <Badge variant={statusVariant[o.status]}>{o.status}</Badge>
                          </DataTableCell>
                          <DataTableCell>
                            <span className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">{o.date}</span>
                          </DataTableCell>
                          <DataTableActionCell
                            items={[
                              { label: "詳細を見る", onClick: () => {} },
                              { label: "出荷登録", onClick: () => {} },
                              { label: "キャンセル", destructive: true, onClick: () => {} },
                            ]}
                          />
                        </DataTableRow>
                      ))}
                    </DataTableBody>
                  </DataTableTable>
                </DataTable>

                {rows.length === 0 && (
                  <p className="py-10 text-center typo-body-sm text-[var(--Text-Low-Emphasis)]">
                    該当する注文がありません
                  </p>
                )}
              </div>

              <div className="mt-3">
                <BulkActions selectedCount={selected.size} onClear={() => setSelected(new Set())}>
                  <Button variant="ghost-inverse" size="sm" className="rounded-full">一括出荷</Button>
                  <Button variant="ghost-inverse" size="sm" className="rounded-full">エクスポート</Button>
                </BulkActions>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}
