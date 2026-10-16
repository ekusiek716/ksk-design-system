import type { Meta, StoryObj } from "@storybook/react"
import { ArrowLeft } from "iconsax-reactjs"
import { Button } from "@/components/ui/button"
import { PhotoHero } from "./photo-hero"
import { Screen } from "./screen"

const meta = {
  title: "Components/Screen",
  component: Screen,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Screen>

export default meta
type Story = StoryObj

const rows = [
  "会場候補を確認する",
  "招待したい人を並べる",
  "日取りの希望を出し合う",
  "衣装のイメージを保存する",
  "予算の上限を決める",
  "写真の雰囲気を選ぶ",
  "移動手段を確認する",
  "宿泊が必要な人を整理する",
  "手作りしたいものを決める",
  "当日の役割を相談する",
  "持ち込み条件を確認する",
  "見積もりの差分を比べる",
]

export const ScrollableWithFooter: Story = {
  parameters: {
    // Screen の <main> は tabIndex={-1} + id 付きのスキップリンク遷移先という
    // 意図的な設計（WAI-ARIA APG のスキップリンクパターン）。Tab キーでの
    // 到達を増やさないため常時 focusable（tabIndex=0）にはしない。
    // このストーリーの中身（チェックリスト表示）自体に focusable な要素が
    // 無いため axe の scrollable-region-focusable が誤検知するが、実際の
    // 画面ではリスト行がボタン/リンク等の focusable 要素になるのが通常で、
    // その場合はこの警告は出ない。個別ストーリーの誤検知として無効化する。
    a11y: { config: { rules: [{ id: "scrollable-region-focusable", enabled: false }] } },
  },
  render: () => (
    <Screen
      footer={<Button className="w-full" size="xl">準備をはじめる</Button>}
    >
      <div className="flex flex-col gap-3">
        <div>
          <p className="typo-label-sm text-[var(--Text-Medium-Emphasis)]">チェックリスト</p>
          <h1 className="mt-2 typo-heading-2xl text-[var(--Text-High-Emphasis)]">もう済んだことは？</h1>
        </div>
        {rows.map((row, index) => (
          <div
            key={row}
            className="flex min-h-12 items-center gap-3 rounded-xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] px-4 py-3"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--Surface-Secondary)] typo-label-xs text-[var(--Text-Medium-Emphasis)]">
              {index + 1}
            </span>
            <span className="typo-body-md text-[var(--Text-High-Emphasis)]">{row}</span>
          </div>
        ))}
      </div>
    </Screen>
  ),
}

export const WithHeader: Story = {
  render: () => (
    <Screen
      header={
        <div className="flex h-14 items-center gap-3 border-b border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] px-4">
          <Button variant="ghost" size="icon" aria-label="戻る">
            <ArrowLeft size={20} />
          </Button>
          <span className="typo-heading-sm text-[var(--Text-High-Emphasis)]">オンボーディング</span>
        </div>
      }
      footer={<Button className="w-full">保存する</Button>}
    >
      <div className="flex flex-col gap-4">
        <h1 className="typo-heading-2xl text-[var(--Text-High-Emphasis)]">今日の確認事項</h1>
        <p className="typo-body-md text-[var(--Text-Medium-Emphasis)]">
          今日の確認事項をまとめて、最後に保存します。
        </p>
        {rows.slice(0, 8).map((row) => (
          <div
            key={row}
            className="rounded-xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-4 typo-body-md text-[var(--Text-High-Emphasis)]"
          >
            {row}
          </div>
        ))}
      </div>
    </Screen>
  ),
}

export const FixedPhotoHero: Story = {
  render: () => (
    <Screen scroll={false} padding="none">
      <PhotoHero
        src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80"
        overlay="dark"
      >
        <PhotoHero.Eyebrow>さあ、始めよう</PhotoHero.Eyebrow>
        <PhotoHero.Title>ふたりの準備、ここから。</PhotoHero.Title>
        <PhotoHero.Body>大切な予定や思いついたことを、同じ場所に集めていきましょう。</PhotoHero.Body>
        <PhotoHero.Actions>
          <Button variant="glass-inverse" size="xl" className="w-full">サンプルデータで試す</Button>
          <Button variant="ghost-inverse" size="xl" className="w-full">ログインする</Button>
        </PhotoHero.Actions>
      </PhotoHero>
    </Screen>
  ),
}

/**
 * オンボーディング等の 1 画面フロー（issue #701）。
 *
 * - `safeAreaTop`: header の上にステータスバー / ダイナミックアイランド分の余白
 * - `height="svh"`: アドレスバーの出入りで高さが揺れない
 * - `desktopLayout="card"`: PC（lg 以上）では背景の中央に枠・角丸のカードとして置く
 *   （既定 最大幅 30rem・高さ 47.5rem。`cardMaxWidth` / `cardMaxHeight` で変える）
 */
export const OnboardingCard: Story = {
  render: () => (
    <Screen
      safeAreaTop
      height="svh"
      desktopLayout="card"
      header={
        <div className="flex h-14 items-center gap-3 px-4">
          <Button variant="ghost" size="icon" aria-label="戻る">
            <ArrowLeft size={20} />
          </Button>
          <span className="typo-label-md text-[var(--Text-Medium-Emphasis)]">2 / 5</span>
        </div>
      }
      footer={<Button className="w-full" size="xl">次へ</Button>}
    >
      <div className="flex flex-col gap-4">
        <h1 className="typo-heading-2xl text-[var(--Text-High-Emphasis)]">挙式の予定日は？</h1>
        <p className="typo-body-md text-[var(--Text-Medium-Emphasis)]">
          あとから変えられます。決まっていなければ、おおよその月で大丈夫です。
        </p>
        {rows.slice(0, 6).map((row) => (
          <Button key={row} variant="secondary" className="w-full justify-start">
            {row}
          </Button>
        ))}
      </div>
    </Screen>
  ),
}

/**
 * アプリのシェル（`<main>` を持つ）の中に置く場合（issue #701）。
 * `landmark="none"` で本文を div にし、main の二重化・id の重複・スキップリンクの重複を避ける。
 * 高さは親に合わせる `height="fill"`。
 */
export const NestedInAppMain: Story = {
  render: () => (
    <main id="app-main" className="h-[100dvh] bg-[var(--Surface-Secondary)] p-4">
      <Screen landmark="none" height="fill" className="rounded-2xl border border-[var(--Border-Low-Emphasis)]">
        <div className="flex flex-col gap-3">
          <h1 className="typo-heading-xl text-[var(--Text-High-Emphasis)]">シェルの中の 1 画面</h1>
          {rows.slice(0, 10).map((row) => (
            <p key={row} className="typo-body-md text-[var(--Text-High-Emphasis)]">{row}</p>
          ))}
          <Button variant="secondary">続きを読む</Button>
        </div>
      </Screen>
    </main>
  ),
}
