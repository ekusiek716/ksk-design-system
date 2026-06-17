// 請求書発行 — 「下書き保存済み」状態。バリデーション通過 + 一時保存バナーつき。
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/patterns/form-field"
import { DatePicker } from "@/components/ui/date-picker"
import { AutoGrowTextarea } from "@/components/ui/auto-grow-textarea"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  DataTable, DataTableTable, DataTableHeader, DataTableBody, DataTableRow,
  DataTableCell, DataTableAddRow,
} from "@/components/patterns/admin/data-table"
import { Trash } from "iconsax-reactjs"
import { InvoiceShell, AddressCard, InvoiceMetaCard, TotalsSummary } from "./_invoice-shell"

export const meta = {
  title: "請求書発行 — 下書き保存済み",
  device: "PC" as const,
  createdAt: "2026/06/17",
  description: "一時保存バナー + 取引先選択済みで宛先情報が出ている、エラーなしの清書状態。",
  group: "invoice-create",
  variantLabel: "下書き保存済み",
}

const ROW_HEAD = "px-3 py-2.5 typo-label-sm text-[var(--Text-Medium-Emphasis)]"

export default function InvoiceCreateSavedDraft() {
  return (
    <InvoiceShell>
      <div className="mb-4">
        <Alert variant="info">
          <AlertTitle>下書きを保存しました（2 分前）</AlertTitle>
          <AlertDescription>
            この内容は自動的に保存されます。発行前にプレビューで最終確認できます。
          </AlertDescription>
        </Alert>
      </div>

      <div className="mb-3 flex items-center gap-2">
        <Badge variant="subtle">下書き</Badge>
        <span className="typo-label-xs text-[var(--Text-Low-Emphasis)]">最終更新 2026/06/17 14:32</span>
      </div>

      <div className="grid grid-cols-1 gap-4 @2xl:grid-cols-2">
        <AddressCard>
          <FormField label="取引先" required>
            <Select defaultValue="c1">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="取引先を選択">株式会社サンライズ商会</SelectValue>
              </SelectTrigger>
            </Select>
          </FormField>
          <div className="mt-3 rounded-lg bg-[var(--Surface-Secondary)] p-3">
            <div className="flex flex-col gap-0.5">
              <p className="typo-label-sm text-[var(--Text-High-Emphasis)]">株式会社サンライズ商会</p>
              <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">営業部 高橋 様</p>
              <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">東京都渋谷区神南1-2-3 サンライズビル7F</p>
            </div>
          </div>
        </AddressCard>

        <InvoiceMetaCard>
          <FormField label="発行日" required>
            <DatePicker value={new Date(2026, 5, 17)} placeholder="日付を選択" />
          </FormField>
          <FormField label="支払期限" required>
            <DatePicker value={new Date(2026, 6, 31)} placeholder="日付を選択" />
          </FormField>
        </InvoiceMetaCard>
      </div>

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
              <DataTableRow>
                <DataTableCell><Input defaultValue="Webサイト保守費（月額）" /></DataTableCell>
                <DataTableCell className="w-[100px]"><Input defaultValue="1" inputMode="numeric" /></DataTableCell>
                <DataTableCell className="w-[140px]"><Input defaultValue="80000" inputMode="numeric" startAdornment="¥" /></DataTableCell>
                <DataTableCell align="right" className="w-[140px]">
                  <span className="typo-label-sm text-[var(--Text-High-Emphasis)]">¥80,000</span>
                </DataTableCell>
                <DataTableCell className="w-[52px]">
                  <Button variant="ghost" size="icon-sm" aria-label="行を削除">
                    <Trash size={16} className="text-[var(--Text-Caution)]" />
                  </Button>
                </DataTableCell>
              </DataTableRow>
              <DataTableRow>
                <DataTableCell><Input defaultValue="サーバー利用料" /></DataTableCell>
                <DataTableCell className="w-[100px]"><Input defaultValue="1" inputMode="numeric" /></DataTableCell>
                <DataTableCell className="w-[140px]"><Input defaultValue="12000" inputMode="numeric" startAdornment="¥" /></DataTableCell>
                <DataTableCell align="right" className="w-[140px]">
                  <span className="typo-label-sm text-[var(--Text-High-Emphasis)]">¥12,000</span>
                </DataTableCell>
                <DataTableCell className="w-[52px]">
                  <Button variant="ghost" size="icon-sm" aria-label="行を削除">
                    <Trash size={16} className="text-[var(--Text-Caution)]" />
                  </Button>
                </DataTableCell>
              </DataTableRow>
              <DataTableAddRow label="行を追加" colSpan={5} />
            </DataTableBody>
          </DataTableTable>
        </DataTable>
        <TotalsSummary subtotal={92000} tax={9200} total={101200} />
      </section>

      <section className="mt-4 rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-5">
        <h2 className="typo-label-md text-[var(--Text-High-Emphasis)] mb-2">備考</h2>
        <AutoGrowTextarea
          value="お振込手数料は貴社にてご負担をお願いいたします。"
          onChange={() => {}}
          placeholder="振込先・支払い条件などを記載"
          maxLength={300}
        />
      </section>

      <div className="mt-5 flex flex-col gap-3 border-t border-[var(--Border-Low-Emphasis)] pt-4 @md:flex-row @md:items-center @md:justify-end">
        <Button variant="secondary" className="@md:w-auto">下書き保存</Button>
        <Button variant="tertiary" className="@md:w-auto">プレビュー</Button>
        <Button variant="default" className="@md:w-auto">請求書を発行</Button>
      </div>
    </InvoiceShell>
  )
}
