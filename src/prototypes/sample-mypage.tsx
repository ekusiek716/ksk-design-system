// サンプルモック（動作確認用 / 削除可）。
// `/mock <Notion URL>` で生成されるファイルの形を示す参考実装。
import { Crown, Ticket, Location, Heart, Setting2, ArrowRight2, Gift } from "iconsax-reactjs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const meta = {
  title: "サンプル：マイページ",
  device: "SP" as const,
  createdAt: "2026/06/13",
  description: "Notion 仕様から生成したモックの参考例。DS コンポーネントのみで構成。",
}

const menu = [
  { icon: Ticket, label: "クーポン", count: "3枚" },
  { icon: Location, label: "お届け先", count: "2件" },
  { icon: Heart, label: "お気に入り", count: "12件" },
  { icon: Gift, label: "ギフト履歴", count: "" },
  { icon: Setting2, label: "アカウント設定", count: "" },
]

export default function SampleMypage() {
  return (
    <div className="min-h-dvh bg-[var(--Surface-Secondary)] pb-8">
      {/* ヘッダー */}
      <header data-slot="prototype-header" className="bg-[var(--Surface-Primary)] px-5 pt-6 pb-5">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-[var(--Surface-Accent-Primary-Light)]">
            <span className="typo-heading-md text-[var(--Text-Accent-Primary)]">奥</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="typo-heading-sm text-[var(--Text-High-Emphasis)] truncate">奥野 圭祐</p>
              <Badge variant="warning">
                <Crown size={12} />
                ゴールド
              </Badge>
            </div>
            <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)] mt-0.5">ekusiek716@gmail.com</p>
          </div>
        </div>
      </header>

      {/* ポイント残高 */}
      <section className="mx-4 mt-4 rounded-2xl bg-[var(--Surface-Primary)] p-5 shadow-[var(--shadow-sm)]">
        <p className="typo-label-sm text-[var(--Text-Medium-Emphasis)]">保有ポイント</p>
        <div className="mt-1 flex items-end gap-1">
          <span className="typo-heading-2xl text-[var(--Text-High-Emphasis)]">2,480</span>
          <span className="typo-label-md text-[var(--Text-Medium-Emphasis)] pb-1">pt</span>
        </div>
        <Button variant="secondary" size="sm" layout="horizontal" className="mt-3 w-full">
          ポイント履歴を見る
        </Button>
      </section>

      {/* メニュー */}
      <section className="mx-4 mt-4 overflow-hidden rounded-2xl bg-[var(--Surface-Primary)] shadow-[var(--shadow-sm)]">
        {menu.map(({ icon: Icon, label, count }, i) => (
          <div
            key={label}
            className={`flex items-center gap-3 px-5 py-4 ${
              i !== menu.length - 1 ? "border-b border-[var(--Border-Low-Emphasis)]" : ""
            }`}
          >
            <Icon size={20} className="text-[var(--Text-Medium-Emphasis)]" />
            <span className="typo-label-md text-[var(--Text-High-Emphasis)] flex-1">{label}</span>
            {count && <span className="typo-body-sm text-[var(--Text-Low-Emphasis)]">{count}</span>}
            <ArrowRight2 size={18} className="text-[var(--Text-Low-Emphasis)]" />
          </div>
        ))}
      </section>
    </div>
  )
}
