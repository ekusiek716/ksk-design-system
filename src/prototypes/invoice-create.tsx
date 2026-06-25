// BtoB 会計ツールの請求書発行画面（管理画面）。
// バリデーション/エラー表示が主眼。シェル骨格は @container で内製（issue #40）。
// 明細行は memo 化（編集のたびに全行再レンダーさせない / 落とし穴ルール）。
import { memo, useCallback, useMemo, useState } from "react"
import { Element3, ReceiptText, Profile2User, Setting2, Trash, TickCircle } from "iconsax-reactjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/patterns/form-field"
import { DatePicker } from "@/components/ui/date-picker"
import { AutoGrowTextarea } from "@/components/ui/auto-grow-textarea"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  DataTable, DataTableTable, DataTableHeader, DataTableBody, DataTableRow,
  DataTableCell, DataTableAddRow,
} from "@/components/patterns/admin/data-table"

export const meta = {
  title: "請求書発行",
  device: "PC" as const,
  createdAt: "2026/06/17",
  description: "BtoB 会計。明細編集 + 自動計算 + 発行時バリデーション（必須/日付整合/行エラー/文字数）。",
  group: "invoice-create",
  variantLabel: "通常（インタラクティブ）",
}

const nav = [
  { icon: Element3, label: "ダッシュボード", active: false },
  { icon: ReceiptText, label: "請求書", active: true },
  { icon: Profile2User, label: "取引先", active: false },
  { icon: Setting2, label: "設定", active: false },
]

interface Client { id: string; name: string; contact: string; address: string }
const clients: Client[] = [
  { id: "c1", name: "株式会社サンライズ商会", contact: "営業部 高橋 様", address: "東京都渋谷区神南1-2-3 サンライズビル7F" },
  { id: "c2", name: "みどり物産株式会社", contact: "総務部 渡辺 様", address: "大阪府大阪市北区梅田4-5-6" },
  { id: "c3", name: "株式会社ノースフィールド", contact: "購買課 佐藤 様", address: "北海道札幌市中央区大通西8-1-1" },
]

interface LineItem { id: string; name: string; qty: string; price: string }
const num = (s: string) => {
  const n = Number(s)
  return Number.isFinite(n) ? n : 0
}
const yen = (n: number) => "¥" + Math.round(n).toLocaleString("ja-JP")
const lineAmount = (it: LineItem) => num(it.qty) * num(it.price)

// 初期データはわざと一部不正にして、発行を押すと各エラーが一通り見える状態にする
const seedItems: LineItem[] = [
  { id: "l1", name: "Webサイト保守費（月額）", qty: "1", price: "80000" }, // 正常
  { id: "l2", name: "サーバー利用料", qty: "", price: "12000" }, // 数量エラー
  { id: "l3", name: "追加開発：問い合わせフォームのスパム対策と自動返信メールの文面調整、および管理画面の権限まわりの見直し対応一式", qty: "2", price: "0" }, // 品目40字超 + 単価エラー
]

const ROW_HEAD = "px-3 py-2.5 typo-label-sm text-[var(--Text-Medium-Emphasis)]"

interface RowErr { name: string; qty: string; price: string }

const InvoiceLineRow = memo(function InvoiceLineRow({
  item,
  err,
  onChange,
  onRemove,
  canRemove,
}: {
  item: LineItem
  err: RowErr
  onChange: (id: string, field: keyof LineItem, value: string) => void
  onRemove: (id: string) => void
  canRemove: boolean
}) {
  const invalid = !!(err.name || err.qty || err.price)
  return (
    <DataTableRow className={invalid ? "bg-[var(--Surface-Caution-Subtle)]" : undefined}>
      <DataTableCell>
        <Input
          value={item.name}
          onChange={(e) => onChange(item.id, "name", e.target.value)}
          aria-invalid={!!err.name || undefined}
          placeholder="品目名"
        />
      </DataTableCell>
      <DataTableCell className="w-[100px]">
        <Input
          value={item.qty}
          onChange={(e) => onChange(item.id, "qty", e.target.value)}
          aria-invalid={!!err.qty || undefined}
          inputMode="numeric"
          placeholder="0"
        />
      </DataTableCell>
      <DataTableCell className="w-[140px]">
        <Input
          value={item.price}
          onChange={(e) => onChange(item.id, "price", e.target.value)}
          aria-invalid={!!err.price || undefined}
          inputMode="numeric"
          startAdornment="¥"
          placeholder="0"
        />
      </DataTableCell>
      <DataTableCell align="right" className="w-[140px]">
        <span className="typo-label-sm text-[var(--Text-High-Emphasis)]">{yen(lineAmount(item))}</span>
      </DataTableCell>
      <DataTableCell className="w-[52px]">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="行を削除"
          disabled={!canRemove}
          onClick={() => onRemove(item.id)}
        >
          <Trash size={16} className="text-[var(--Text-Caution)]" />
        </Button>
      </DataTableCell>
    </DataTableRow>
  )
})

export default function InvoiceCreate() {
  const [clientId, setClientId] = useState("")
  const [issueDate, setIssueDate] = useState<Date | undefined>(new Date(2026, 5, 17))
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date(2026, 5, 10)) // わざと発行日より前
  const [items, setItems] = useState<LineItem[]>(seedItems)
  const [note, setNote] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [done, setDone] = useState(false)

  const client = clients.find((c) => c.id === clientId)
  const subtotal = items.reduce((s, it) => s + lineAmount(it), 0)
  const tax = Math.round(subtotal * 0.1)
  const total = subtotal + tax

  const updateItem = useCallback((id: string, field: keyof LineItem, value: string) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)))
  }, [])
  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }, [])
  const addItem = () =>
    setItems((prev) => [...prev, { id: `l${Date.now()}`, name: "", qty: "", price: "" }])

  // バリデーション
  const rowError = (it: LineItem): RowErr => ({
    name: !it.name.trim() ? "品目を入力してください" : it.name.length > 40 ? "品目は40文字以内で入力してください" : "",
    qty: num(it.qty) <= 0 ? "数量を入力してください" : "",
    price: num(it.price) <= 0 ? "単価を入力してください" : "",
  })
  const errors = useMemo(() => {
    const rows = items.map(rowError)
    return {
      client: !clientId ? "取引先を選択してください" : "",
      issueDate: !issueDate ? "発行日を選択してください" : "",
      dueDate: !dueDate
        ? "支払期限を選択してください"
        : issueDate && dueDate < issueDate
          ? "支払期限は発行日以降にしてください"
          : "",
      table: items.length === 0 ? "明細を1行以上追加してください" : "",
      rows,
    }
  }, [clientId, issueDate, dueDate, items])

  const errorCount =
    [errors.client, errors.issueDate, errors.dueDate, errors.table].filter(Boolean).length +
    errors.rows.reduce((s, r) => s + [r.name, r.qty, r.price].filter(Boolean).length, 0)
  const hasErrors = errorCount > 0

  const show = (msg: string) => (submitted ? msg : "")

  const handleSubmit = () => {
    setSubmitted(true)
    if (!hasErrors && total > 0) setDone(true)
  }

  if (done) {
    return (
      <div className="@container min-h-dvh bg-[var(--Surface-Secondary)]">
        <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 text-center">
          <TickCircle size={56} variant="Bold" className="text-[var(--Object-Success)]" />
          <h1 className="typo-heading-md text-[var(--Text-High-Emphasis)] mt-4">請求書を発行しました</h1>
          <p className="typo-body-md text-[var(--Text-Medium-Emphasis)] mt-2">
            {client?.name} 宛に {yen(total)}（税込）の請求書を発行しました。
          </p>
          <Button variant="tertiary" className="mt-6" onClick={() => { setDone(false); setSubmitted(false) }}>
            編集に戻る
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="@container min-h-dvh bg-[var(--Surface-Secondary)]">
      <div className="@3xl:grid @3xl:grid-cols-[220px_1fr]">
        {/* サイドバー */}
        <aside className="hidden @3xl:flex h-dvh sticky top-0 flex-col border-r border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-3">
          <div className="px-3 py-2 flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)] typo-label-sm">経</span>
            <span className="typo-label-md text-[var(--Text-High-Emphasis)]">会計コンソール</span>
          </div>
          <nav className="mt-3 flex flex-col gap-1">
            {nav.map(({ icon: Icon, label, active }) => (
              <Button key={label} variant={active ? "secondary-switch" : "ghost"} className="w-full justify-start gap-3">
                <Icon size={18} variant={active ? "Bold" : "Linear"} />
                {label}
              </Button>
            ))}
          </nav>
        </aside>

        {/* メイン */}
        <div className="min-w-0">
          <header data-slot="prototype-header" className="sticky top-0 z-10 flex items-center gap-4 border-b border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] px-5 py-3">
            <h1 className="typo-heading-sm text-[var(--Text-High-Emphasis)] flex-1">請求書の作成</h1>
            <span className="flex size-8 items-center justify-center rounded-full bg-[var(--Surface-Accent-Primary-Light)] typo-label-sm text-[var(--Text-Accent-Primary)]">奥</span>
          </header>

          <main className="mx-auto max-w-4xl p-5">
            {/* エラーサマリー */}
            {submitted && hasErrors && (
              <div className="mb-4">
                <Alert variant="error">
                  <AlertTitle>{errorCount}件の入力エラーがあります</AlertTitle>
                  <AlertDescription>赤くハイライトされた項目を修正してください。</AlertDescription>
                </Alert>
              </div>
            )}

            {/* 宛先 + 請求情報 */}
            <div className="grid grid-cols-1 gap-4 @2xl:grid-cols-2">
              <section className="rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-5">
                <h2 className="typo-label-md text-[var(--Text-High-Emphasis)] mb-3">宛先</h2>
                <FormField label="取引先" required error={show(errors.client)}>
                  <Select value={clientId} onValueChange={setClientId}>
                    <SelectTrigger aria-invalid={!!show(errors.client) || undefined} className="w-full">
                      <SelectValue placeholder="取引先を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                <div className="mt-3 rounded-lg bg-[var(--Surface-Secondary)] p-3">
                  {client ? (
                    <div className="flex flex-col gap-0.5">
                      <p className="typo-label-sm text-[var(--Text-High-Emphasis)]">{client.name}</p>
                      <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">{client.contact}</p>
                      <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">{client.address}</p>
                    </div>
                  ) : (
                    <p className="typo-body-sm text-[var(--Text-Low-Emphasis)]">取引先を選択すると住所・担当者が表示されます</p>
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-5">
                <h2 className="typo-label-md text-[var(--Text-High-Emphasis)] mb-3">請求情報</h2>
                <div className="flex items-center justify-between rounded-lg bg-[var(--Surface-Secondary)] px-3 py-2">
                  <span className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">請求番号</span>
                  <span className="typo-label-sm text-[var(--Text-High-Emphasis)]">INV-2026-0142</span>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 @md:grid-cols-2">
                  <FormField label="発行日" required error={show(errors.issueDate)}>
                    <DatePicker value={issueDate} onChange={setIssueDate} placeholder="日付を選択" />
                  </FormField>
                  <FormField label="支払期限" required error={show(errors.dueDate)}>
                    <DatePicker value={dueDate} onChange={setDueDate} placeholder="日付を選択" />
                  </FormField>
                </div>
              </section>
            </div>

            {/* 明細 */}
            <section className="mt-4 rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-5">
              <h2 className="typo-label-md text-[var(--Text-High-Emphasis)] mb-3">明細</h2>
              <DataTable>
                <DataTableTable>
                  <DataTableHeader>
                    <tr>
                      <th className={`${ROW_HEAD} text-left`}>品目</th>
                      <th className={`${ROW_HEAD} text-left`}>数量</th>
                      <th className={`${ROW_HEAD} text-left`}>単価</th>
                      <th className={`${ROW_HEAD} text-right`}>金額</th>
                      <th className={ROW_HEAD} />
                    </tr>
                  </DataTableHeader>
                  <DataTableBody>
                    {items.map((it, i) => (
                      <InvoiceLineRow
                        key={it.id}
                        item={it}
                        err={submitted ? errors.rows[i] : { name: "", qty: "", price: "" }}
                        onChange={updateItem}
                        onRemove={removeItem}
                        canRemove={items.length > 1}
                      />
                    ))}
                    <DataTableAddRow label="行を追加" colSpan={5} onClick={addItem} />
                  </DataTableBody>
                </DataTableTable>
              </DataTable>

              {/* 行レベルのエラー一覧 */}
              {submitted && (errors.table || errors.rows.some((r) => r.name || r.qty || r.price)) && (
                <div className="mt-3 flex flex-col gap-1">
                  {errors.table && (
                    <p className="typo-body-sm text-[var(--Text-Caution)]">{errors.table}</p>
                  )}
                  {errors.rows.map((r, i) => {
                    const msgs = [r.name, r.qty, r.price].filter(Boolean)
                    if (msgs.length === 0) return null
                    return (
                      <p key={items[i].id} className="typo-body-sm text-[var(--Text-Caution)]">
                        {i + 1}行目: {msgs.join(" / ")}
                      </p>
                    )
                  })}
                </div>
              )}

              {/* サマリー（右寄せ） */}
              <div className="mt-4 flex justify-end">
                <div className="w-full max-w-xs flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">小計</span>
                    <span className="typo-body-md text-[var(--Text-High-Emphasis)]">{yen(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">消費税（10%）</span>
                    <span className="typo-body-md text-[var(--Text-High-Emphasis)]">{yen(tax)}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between border-t border-[var(--Border-Low-Emphasis)] pt-2">
                    <span className="typo-label-md text-[var(--Text-High-Emphasis)]">合計</span>
                    <span className="typo-heading-sm text-[var(--Text-High-Emphasis)]">{yen(total)}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 備考 */}
            <section className="mt-4 rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-5">
              <h2 className="typo-label-md text-[var(--Text-High-Emphasis)] mb-2">備考</h2>
              <AutoGrowTextarea value={note} onChange={setNote} placeholder="振込先・支払い条件などを記載" maxLength={300} />
            </section>

            {/* アクション */}
            <div className="mt-5 flex flex-col gap-3 border-t border-[var(--Border-Low-Emphasis)] pt-4 @md:flex-row @md:items-center @md:justify-end">
              {total === 0 && (
                <p className="typo-body-sm text-[var(--Text-Caution)] @md:mr-auto">合計が 0 円のため発行できません</p>
              )}
              <Button variant="secondary" className="@md:w-auto">下書き保存</Button>
              <Button variant="tertiary" className="@md:w-auto">プレビュー</Button>
              <Button variant="default" className="@md:w-auto" disabled={total === 0} onClick={handleSubmit}>
                請求書を発行
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
