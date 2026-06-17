// 請求書発行 — 「バリデーションエラー」状態。発行を押した直後で複数のエラー表示が出ている。
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/patterns/form-field"
import { DatePicker } from "@/components/ui/date-picker"
import { AutoGrowTextarea } from "@/components/ui/auto-grow-textarea"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
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
  title: "請求書発行 — バリデーションエラー",
  device: "PC" as const,
  createdAt: "2026/06/17",
  description: "「発行」を押した直後。必須未入力 / 日付逆転 / 行エラーが一通り出ている検証用。",
  group: "invoice-create",
  variantLabel: "バリデーションエラー",
}

const ROW_HEAD = "px-3 py-2.5 typo-label-sm text-[var(--Text-Medium-Emphasis)]"

export default function InvoiceCreateValidationError() {
  return (
    <InvoiceShell>
      <div className="mb-4">
        <Alert variant="error">
          <AlertTitle>5件の入力エラーがあります</AlertTitle>
          <AlertDescription>赤くハイライトされた項目を修正してください。</AlertDescription>
        </Alert>
      </div>

      <div className="grid grid-cols-1 gap-4 @2xl:grid-cols-2">
        <AddressCard>
          <FormField label="取引先" required error="取引先を選択してください">
            <Select>
              <SelectTrigger aria-invalid className="w-full">
                <SelectValue placeholder="取引先を選択" />
              </SelectTrigger>
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
            <DatePicker value={new Date(2026, 5, 17)} placeholder="日付を選択" />
          </FormField>
          <FormField label="支払期限" required error="支払期限は発行日以降にしてください">
            <DatePicker value={new Date(2026, 5, 10)} placeholder="日付を選択" />
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
              <DataTableRow className="bg-[var(--Surface-Caution-Subtle)]">
                <DataTableCell><Input defaultValue="サーバー利用料" /></DataTableCell>
                <DataTableCell className="w-[100px]"><Input aria-invalid placeholder="0" inputMode="numeric" /></DataTableCell>
                <DataTableCell className="w-[140px]"><Input defaultValue="12000" inputMode="numeric" startAdornment="¥" /></DataTableCell>
                <DataTableCell align="right" className="w-[140px]">
                  <span className="typo-label-sm text-[var(--Text-High-Emphasis)]">¥0</span>
                </DataTableCell>
                <DataTableCell className="w-[52px]">
                  <Button variant="ghost" size="icon-sm" aria-label="行を削除">
                    <Trash size={16} className="text-[var(--Text-Caution)]" />
                  </Button>
                </DataTableCell>
              </DataTableRow>
              <DataTableRow className="bg-[var(--Surface-Caution-Subtle)]">
                <DataTableCell>
                  <Input aria-invalid defaultValue="追加開発：問い合わせフォームのスパム対策と自動返信メールの文面調整、および管理画面の権限まわりの見直し対応一式" />
                </DataTableCell>
                <DataTableCell className="w-[100px]"><Input defaultValue="2" inputMode="numeric" /></DataTableCell>
                <DataTableCell className="w-[140px]"><Input aria-invalid defaultValue="0" inputMode="numeric" startAdornment="¥" /></DataTableCell>
                <DataTableCell align="right" className="w-[140px]">
                  <span className="typo-label-sm text-[var(--Text-High-Emphasis)]">¥0</span>
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

        <div className="mt-3 flex flex-col gap-1">
          <p className="typo-body-sm text-[var(--Text-Caution)]">2行目: 数量を入力してください</p>
          <p className="typo-body-sm text-[var(--Text-Caution)]">3行目: 品目は40文字以内で入力してください / 単価を入力してください</p>
        </div>

        <TotalsSummary subtotal={80000} tax={8000} total={88000} />
      </section>

      <section className="mt-4 rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-5">
        <h2 className="typo-label-md text-[var(--Text-High-Emphasis)] mb-2">備考</h2>
        <AutoGrowTextarea value="" onChange={() => {}} placeholder="振込先・支払い条件などを記載" maxLength={300} />
      </section>

      <div className="mt-5 flex flex-col gap-3 border-t border-[var(--Border-Low-Emphasis)] pt-4 @md:flex-row @md:items-center @md:justify-end">
        <Button variant="secondary" className="@md:w-auto">下書き保存</Button>
        <Button variant="tertiary" className="@md:w-auto">プレビュー</Button>
        <Button variant="default" className="@md:w-auto">請求書を発行</Button>
      </div>
    </InvoiceShell>
  )
}
