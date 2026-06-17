// 請求書発行 — 「未入力」状態。新規作成直後で何も埋まっていない見た目。
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/patterns/form-field"
import { DatePicker } from "@/components/ui/date-picker"
import { AutoGrowTextarea } from "@/components/ui/auto-grow-textarea"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  DataTable, DataTableTable, DataTableHeader, DataTableBody, DataTableRow,
  DataTableCell, DataTableAddRow,
} from "@/components/patterns/admin/data-table"
import { Trash } from "iconsax-reactjs"
import { InvoiceShell, AddressCard, InvoiceMetaCard, TotalsSummary } from "./_invoice-shell"

export const meta = {
  title: "請求書発行 — 未入力",
  device: "PC" as const,
  createdAt: "2026/06/17",
  description: "新規作成直後。取引先・明細が空で、まだ「発行」を押していない初期状態。",
  group: "invoice-create",
  variantLabel: "未入力",
}

const ROW_HEAD = "px-3 py-2.5 typo-label-sm text-[var(--Text-Medium-Emphasis)]"

export default function InvoiceCreateEmpty() {
  return (
    <InvoiceShell>
      <div className="grid grid-cols-1 gap-4 @2xl:grid-cols-2">
        <AddressCard>
          <FormField label="取引先" required>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="取引先を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="c1">株式会社サンライズ商会</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <div className="mt-3 rounded-lg bg-[var(--Surface-Secondary)] p-3">
            <p className="typo-body-sm text-[var(--Text-Low-Emphasis)]">
              取引先を選択すると住所・担当者が表示されます
            </p>
          </div>
        </AddressCard>

        <InvoiceMetaCard>
          <FormField label="発行日" required>
            <DatePicker placeholder="日付を選択" />
          </FormField>
          <FormField label="支払期限" required>
            <DatePicker placeholder="日付を選択" />
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
                <DataTableCell><Input placeholder="品目名" /></DataTableCell>
                <DataTableCell className="w-[100px]"><Input placeholder="0" inputMode="numeric" /></DataTableCell>
                <DataTableCell className="w-[140px]"><Input placeholder="0" inputMode="numeric" startAdornment="¥" /></DataTableCell>
                <DataTableCell align="right" className="w-[140px]">
                  <span className="typo-label-sm text-[var(--Text-High-Emphasis)]">¥0</span>
                </DataTableCell>
                <DataTableCell className="w-[52px]">
                  <Button variant="ghost" size="icon-sm" aria-label="行を削除" disabled>
                    <Trash size={16} className="text-[var(--Text-Caution)]" />
                  </Button>
                </DataTableCell>
              </DataTableRow>
              <DataTableAddRow label="行を追加" colSpan={5} />
            </DataTableBody>
          </DataTableTable>
        </DataTable>
        <TotalsSummary subtotal={0} tax={0} total={0} />
      </section>

      <section className="mt-4 rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-5">
        <h2 className="typo-label-md text-[var(--Text-High-Emphasis)] mb-2">備考</h2>
        <AutoGrowTextarea value="" onChange={() => {}} placeholder="振込先・支払い条件などを記載" maxLength={300} />
      </section>

      <div className="mt-5 flex flex-col gap-3 border-t border-[var(--Border-Low-Emphasis)] pt-4 @md:flex-row @md:items-center @md:justify-end">
        <p className="typo-body-sm text-[var(--Text-Caution)] @md:mr-auto">合計が 0 円のため発行できません</p>
        <Button variant="secondary" className="@md:w-auto">下書き保存</Button>
        <Button variant="tertiary" className="@md:w-auto">プレビュー</Button>
        <Button variant="default" className="@md:w-auto" disabled>請求書を発行</Button>
      </div>
    </InvoiceShell>
  )
}
