import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta = {
  title: "Foundation/Categorical",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
}
export default meta
type Story = StoryObj

// 分離度の高い順（CVD配慮）。hue は素の色相名、cat は belle-todo の対応カテゴリ（例示）。
const SCALE = [
  { n: 1, hue: "red", cat: "gift" },
  { n: 2, hue: "sky", cat: "guest" },
  { n: 3, hue: "teal", cat: "meeting" },
  { n: 4, hue: "slate", cat: "official" },
  { n: 5, hue: "yellow", cat: "budget" },
  { n: 6, hue: "indigo", cat: "photo" },
  { n: 7, hue: "orange", cat: "venue" },
  { n: 8, hue: "cyan", cat: "family" },
  { n: 9, hue: "pink", cat: "dress" },
  { n: 10, hue: "rose", cat: "invitation" },
  { n: 11, hue: "blue", cat: "schedule" },
  { n: 12, hue: "lime", cat: "paper" },
  { n: 13, hue: "amber", cat: "entertainment" },
  { n: 14, hue: "fuchsia", cat: "beauty" },
  { n: 15, hue: "purple", cat: "bgm" },
  { n: 16, hue: "violet", cat: "ring" },
]

// ─── Scale: 全16色 × 3階層 ───────────────────────────────────────────────────

export const Scale: Story = {
  name: "Categorical Scale（16色 × base/Subtle/Bold）",
  render: () => (
    <div>
      <p className="typo-body-md text-[var(--Text-Medium-Emphasis)] mb-2">
        カテゴリ識別専用の質的パレット。Brand に連動しない固定値で、テーマを差し替えても色は変わらない。
        分離度の高い順に並んでいるので、N 色だけ必要なら <code className="font-mono">1..N</code> を順に使う。
      </p>
      <p className="typo-body-sm text-[var(--Text-Low-Emphasis)] mb-6">
        文字には <b>Bold</b>（白背景 ≥4.9:1 / Subtle 上 ≥4.5:1）。ドット/アイコンは base。
        色だけに依存せずアイコン・ラベルを併記すること（CVD 配慮）。
      </p>
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
        {SCALE.map(({ n, hue, cat }) => (
          <div
            key={n}
            className="rounded-xl border border-[var(--Border-Low-Emphasis)] p-3"
            style={{ background: `var(--Categorical-${n}-Subtle)` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="inline-block h-3 w-3 rounded-full shrink-0"
                style={{ background: `var(--Categorical-${n})` }}
              />
              <span className="typo-label-sm font-semibold" style={{ color: `var(--Categorical-${n}-Bold)` }}>
                {n}. {cat}
              </span>
            </div>
            <div className="flex gap-1.5">
              <Cell v={`--Categorical-${n}`} label="base" />
              <Cell v={`--Categorical-${n}-Subtle`} label="Subtle" border />
              <Cell v={`--Categorical-${n}-Bold`} label="Bold" />
            </div>
            <p className="typo-body-xs text-[var(--Text-Low-Emphasis)] font-mono mt-2">{hue}</p>
          </div>
        ))}
      </div>
    </div>
  ),
}

function Cell({ v, label, border = false }: { v: string; label: string; border?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`h-8 w-12 rounded-md ${border ? "border border-[var(--Border-Medium-Emphasis)]" : ""}`}
        style={{ background: `var(${v})` }}
      />
      <span className="typo-body-xs text-[var(--Text-Low-Emphasis)]">{label}</span>
    </div>
  )
}

// ─── Usage: 実運用パターン ───────────────────────────────────────────────────

export const Usage: Story = {
  name: "Usage（チップ / 予定ドット / ティント行）",
  render: () => (
    <div className="flex flex-col gap-8 max-w-xl">
      {/* Chips */}
      <section>
        <h3 className="typo-heading-sm text-[var(--Text-High-Emphasis)] mb-3">カテゴリ Chip（Subtle 背景 ＋ Bold 文字）</h3>
        <div className="flex flex-wrap gap-2">
          {SCALE.map(({ n, cat }) => (
            <span
              key={n}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 typo-label-sm font-medium"
              style={{ background: `var(--Categorical-${n}-Subtle)`, color: `var(--Categorical-${n}-Bold)` }}
            >
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: `var(--Categorical-${n})` }} />
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* Calendar dots */}
      <section>
        <h3 className="typo-heading-sm text-[var(--Text-High-Emphasis)] mb-3">カレンダー予定ドット（base）</h3>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {SCALE.slice(0, 8).map(({ n, cat }) => (
            <span key={n} className="inline-flex items-center gap-1.5 typo-body-sm text-[var(--Text-Medium-Emphasis)]">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: `var(--Categorical-${n})` }} />
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* Agenda tint rows */}
      <section>
        <h3 className="typo-heading-sm text-[var(--Text-High-Emphasis)] mb-3">アジェンダ行（Subtle ティント背景）</h3>
        <div className="flex flex-col gap-1.5">
          {SCALE.slice(0, 5).map(({ n, cat }) => (
            <div
              key={n}
              className="flex items-center gap-2 rounded-lg px-3 py-2"
              style={{ background: `var(--Categorical-${n}-Subtle)` }}
            >
              <span className="typo-label-sm font-semibold" style={{ color: `var(--Categorical-${n}-Bold)` }}>{cat}</span>
              <span className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">の打ち合わせ 14:00</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
}
