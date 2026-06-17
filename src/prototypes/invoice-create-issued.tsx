// 請求書発行 — 「発行完了」状態。success 画面。次アクション（送付・PDF・複製）が並ぶ。
import { TickCircle, DocumentDownload, Send2, Copy } from "iconsax-reactjs"
import { Button } from "@/components/ui/button"
import { InvoiceShell } from "./_invoice-shell"

export const meta = {
  title: "請求書発行 — 発行完了",
  device: "PC" as const,
  createdAt: "2026/06/17",
  description: "発行完了の success 画面。発行番号と次アクション（PDF / 送付 / 複製）を提示。",
  group: "invoice-create",
  variantLabel: "発行完了",
}

export default function InvoiceCreateIssued() {
  return (
    <InvoiceShell>
      <div className="mx-auto flex max-w-md flex-col items-center py-10 text-center">
        <TickCircle size={56} variant="Bold" className="text-[var(--Object-Success)]" />
        <h1 className="typo-heading-md text-[var(--Text-High-Emphasis)] mt-4">請求書を発行しました</h1>
        <p className="typo-body-md text-[var(--Text-Medium-Emphasis)] mt-2">
          株式会社サンライズ商会 宛に ¥101,200（税込）の請求書を発行しました。
        </p>

        <dl className="mt-6 w-full rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-4 text-left">
          <div className="flex items-center justify-between py-1.5">
            <dt className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">請求番号</dt>
            <dd className="typo-label-sm text-[var(--Text-High-Emphasis)]">INV-2026-0142</dd>
          </div>
          <div className="flex items-center justify-between py-1.5 border-t border-[var(--Border-Low-Emphasis)]">
            <dt className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">発行日</dt>
            <dd className="typo-label-sm text-[var(--Text-High-Emphasis)]">2026/06/17</dd>
          </div>
          <div className="flex items-center justify-between py-1.5 border-t border-[var(--Border-Low-Emphasis)]">
            <dt className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">支払期限</dt>
            <dd className="typo-label-sm text-[var(--Text-High-Emphasis)]">2026/07/31</dd>
          </div>
        </dl>

        <div className="mt-6 flex w-full flex-col gap-2">
          <Button variant="default" className="gap-2"><Send2 size={16} />メールで送付</Button>
          <Button variant="secondary" className="gap-2"><DocumentDownload size={16} />PDF をダウンロード</Button>
          <Button variant="tertiary" className="gap-2"><Copy size={16} />複製して新規作成</Button>
        </div>

        <Button
          variant="link"
          className="mt-6"
          onClick={() => (window.location.hash = "#/invoice-create")}
        >
          編集に戻る
        </Button>
      </div>
    </InvoiceShell>
  )
}
