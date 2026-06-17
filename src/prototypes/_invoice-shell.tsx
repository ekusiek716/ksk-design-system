// =============================================================
// InvoiceShell — 請求書発行画面のバリアント群（invoice-create-* ）で
// 共通の左ナビ + ヘッダー + メイン領域を提供する。`_` で始まるため
// registry には拾われない（一覧には出ない）。
// =============================================================
import type { ReactNode } from "react"
import { Element3, ReceiptText, Profile2User, Setting2 } from "iconsax-reactjs"
import { Button } from "@/components/ui/button"

const nav = [
  { icon: Element3, label: "ダッシュボード", active: false },
  { icon: ReceiptText, label: "請求書", active: true },
  { icon: Profile2User, label: "取引先", active: false },
  { icon: Setting2, label: "設定", active: false },
]

export function InvoiceShell({ children }: { children: ReactNode }) {
  return (
    <div className="@container min-h-dvh bg-[var(--Surface-Secondary)]">
      <div className="@3xl:grid @3xl:grid-cols-[220px_1fr]">
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

        <div className="min-w-0">
          <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] px-5 py-3">
            <h1 className="typo-heading-sm text-[var(--Text-High-Emphasis)] flex-1">請求書の作成</h1>
            <span className="flex size-8 items-center justify-center rounded-full bg-[var(--Surface-Accent-Primary-Light)] typo-label-sm text-[var(--Text-Accent-Primary)]">奥</span>
          </header>
          <main className="mx-auto max-w-4xl p-5">{children}</main>
        </div>
      </div>
    </div>
  )
}

/** 宛先カード（共通の枠 + 子要素を流す） */
export function AddressCard({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-5">
      <h2 className="typo-label-md text-[var(--Text-High-Emphasis)] mb-3">宛先</h2>
      {children}
    </section>
  )
}

/** 請求情報カード（請求番号 + 発行/期限日のスロット） */
export function InvoiceMetaCard({
  invoiceNo = "INV-2026-0142",
  children,
}: {
  invoiceNo?: string
  children: ReactNode
}) {
  return (
    <section className="rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-5">
      <h2 className="typo-label-md text-[var(--Text-High-Emphasis)] mb-3">請求情報</h2>
      <div className="flex items-center justify-between rounded-lg bg-[var(--Surface-Secondary)] px-3 py-2">
        <span className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">請求番号</span>
        <span className="typo-label-sm text-[var(--Text-High-Emphasis)]">{invoiceNo}</span>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 @md:grid-cols-2">{children}</div>
    </section>
  )
}

/** 合計サマリー（小計 / 税 / 合計） */
export function TotalsSummary({ subtotal, tax, total }: { subtotal: number; tax: number; total: number }) {
  const yen = (n: number) => "¥" + Math.round(n).toLocaleString("ja-JP")
  return (
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
  )
}
