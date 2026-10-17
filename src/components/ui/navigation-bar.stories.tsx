import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"
import { NavigationBar } from "./navigation-bar"

const meta: Meta<typeof NavigationBar> = {
  title: "Components/NavigationBar",
  component: NavigationBar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
}
export default meta
type Story = StoryObj<typeof NavigationBar>

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <div className="bg-[var(--Surface-Primary)]">
      <NavigationBar
        title="Aircraft Stats"
        leftIcon="back"
        onLeft={() => {}}
        onShare={() => {}}
      />
    </div>
  ),
}

export const WithCloseButton: Story = {
  render: () => (
    <div className="bg-[var(--Surface-Primary)]">
      <NavigationBar
        title="シート"
        leftIcon="close"
        onLeft={() => {}}
        onShare={() => {}}
      />
    </div>
  ),
}

export const TitleOnly: Story = {
  render: () => (
    <div className="bg-[var(--Surface-Primary)]">
      <NavigationBar
        title="設定"
        leftIcon="back"
        onLeft={() => {}}
      />
    </div>
  ),
}

export const CustomRightSlot: Story = {
  render: () => (
    <div className="bg-[var(--Surface-Primary)]">
      <NavigationBar
        title="ゲスト一覧"
        leftIcon="back"
        onLeft={() => {}}
        rightSlot={
          <button type="button" className="typo-label-md text-[var(--Text-Accent-Primary)] px-2 h-10">
            完了
          </button>
        }
      />
    </div>
  ),
}

// ─── Liquid Glass (iOS 26 over gradient) ─────────────────────────────────────

export const Glass: Story = {
  name: "Liquid Glass — over gradient",
  render: () => (
    <div
      className="relative h-[320px] rounded-2xl overflow-hidden"
      style={{ background: "linear-gradient(160deg, #a8c8f8 0%, #3b82f6 60%, #1e40af 100%)" }}
    >
      <NavigationBar
        title="Aircraft Stats"
        leftIcon="close"
        onLeft={() => {}}
        onShare={() => {}}
        glass
        transparent
      />
      <div className="px-5 pt-3 text-white">
        <p className="typo-label-sm opacity-70">Total Aircraft</p>
        <p className="typo-heading-xl">1</p>
        <p className="typo-body-sm opacity-60 mt-1">B787-9 · 14 hours</p>
      </div>
    </div>
  ),
}

export const GlassOverPhoto: Story = {
  name: "Liquid Glass — over photo tone",
  render: () => (
    <div
      className="relative h-[320px] rounded-2xl overflow-hidden"
      style={{ background: "linear-gradient(160deg, #fde68a 0%, #f59e0b 40%, #b45309 100%)" }}
    >
      <NavigationBar
        title="式場詳細"
        leftIcon="back"
        onLeft={() => {}}
        onShare={() => {}}
        glass
        transparent
      />
      <div className="px-5 pt-3 text-white">
        <p className="typo-heading-xl">グランドホテル</p>
        <p className="typo-body-sm opacity-70 mt-1">東京都渋谷区</p>
      </div>
    </div>
  ),
}

/**
 * 文字付きの戻るボタン（issue #729）。`leftLabelVisible` で leftLabel を画面にも出す。
 * 高さ 44px・文字は title なしなら無制限・title ありなら 160px で省略。中央タイトルは左右を同じだけ空けて中央のまま。Button で自作しない。
 */
export const LabeledBack: Story = {
  tags: ["interaction"],
  render: () => (
    <div className="bg-[var(--Surface-Primary)]">
      <NavigationBar title="設定" leftIcon="back" leftLabel="メニューに戻る" leftLabelVisible onLeft={() => {}} onShare={() => {}} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const back = within(canvasElement).getByRole("button", { name: "メニューに戻る" })
    await expect(back.hasAttribute("aria-label")).toBe(false)
    await expect(Math.round(back.getBoundingClientRect().height)).toBe(44)
    const title = within(canvasElement).getByText("設定").getBoundingClientRect()
    await expect(title.left).toBeGreaterThanOrEqual(back.getBoundingClientRect().right)
  },
}

const LONG_BACK = "メニューに戻る一覧へ" // 日本語 10 文字

/** 長い戻る文言・タイトルなし: 上限なしで省略されない（issue #732） */
export const LabeledBackLongNoTitle: Story = {
  tags: ["interaction"],
  render: () => (
    <div className="w-[480px] bg-[var(--Surface-Primary)]">
      <NavigationBar leftIcon="back" leftLabel={LONG_BACK} leftLabelVisible onLeft={() => {}} onShare={() => {}} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const back = within(canvasElement).getByRole("button", { name: LONG_BACK })
    const label = within(back).getByText(LONG_BACK)
    await expect(label.scrollWidth).toBeLessThanOrEqual(label.clientWidth)
    await expect(back.getBoundingClientRect().width).toBeGreaterThan(160)
  },
}

/** 長い戻る文言・タイトルあり: 8 文字は収まり、タイトルと重ならず中央のまま（issue #732） */
export const LabeledBackLongWithTitle: Story = {
  tags: ["interaction"],
  render: () => (
    <div className="w-[480px] bg-[var(--Surface-Primary)]">
      <NavigationBar title="設定" leftIcon="back" leftLabel="メニューに戻るよ" leftLabelVisible onLeft={() => {}} onShare={() => {}} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const back = within(canvasElement).getByRole("button", { name: "メニューに戻るよ" })
    const label = within(back).getByText("メニューに戻るよ")
    await expect(label.scrollWidth).toBeLessThanOrEqual(label.clientWidth)
    await expect(back.getBoundingClientRect().width).toBeLessThanOrEqual(160)
    const title = within(canvasElement).getByText("設定").getBoundingClientRect()
    await expect(title.left).toBeGreaterThanOrEqual(back.getBoundingClientRect().right)
    const bar = canvasElement.querySelector("header")!.getBoundingClientRect()
    await expect(Math.abs((title.left + title.right) / 2 - (bar.left + bar.right) / 2)).toBeLessThan(2)
  },
}

/** 10 文字超はタイトルありなら省略（重なり回避を優先） */
export const LabeledBackOverflowWithTitle: Story = {
  tags: ["interaction"],
  render: () => (
    <div className="w-[480px] bg-[var(--Surface-Primary)]">
      <NavigationBar title="設定" leftIcon="back" leftLabel={LONG_BACK + "に戻る"} leftLabelVisible onLeft={() => {}} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const back = within(canvasElement).getByRole("button")
    const title = within(canvasElement).getByText("設定").getBoundingClientRect()
    await expect(title.left).toBeGreaterThanOrEqual(back.getBoundingClientRect().right)
  },
}

/** title あり + 短い文言（「戻る」）: 左右の実幅に合わせるので 375px でもタイトルが十分見える（issue #732） */
export const LabeledBackShortNarrow: Story = {
  tags: ["interaction"],
  render: () => (
    <div className="w-[375px] bg-[var(--Surface-Primary)]">
      <NavigationBar title="ゲスト一覧の編集画面です" leftIcon="back" leftLabel="戻る" leftLabelVisible onLeft={() => {}} onShare={() => {}} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const back = within(canvasElement).getByRole("button", { name: "戻る" })
    const titleEl = within(canvasElement).getByText("ゲスト一覧の編集画面です")
    const title = titleEl.getBoundingClientRect()
    await expect(titleEl.scrollWidth).toBeLessThanOrEqual(titleEl.clientWidth)
    await expect(title.width).toBeGreaterThan(150)
    await expect(title.left).toBeGreaterThanOrEqual(back.getBoundingClientRect().right)
    const bar = canvasElement.querySelector("header")!.getBoundingClientRect()
    await expect(Math.abs((title.left + title.right) / 2 - (bar.left + bar.right) / 2)).toBeLessThan(2)
  },
}

/** title なし + 長い文言 + 右の要素: 左ラベルが残り幅で省略され、右のシェアボタンを押し出さない（issue #732） */
export const LabeledBackLongNoTitleNarrow: Story = {
  tags: ["interaction"],
  render: () => (
    <div className="w-[200px] bg-[var(--Surface-Primary)]">
      <NavigationBar leftIcon="back" leftLabel={LONG_BACK} leftLabelVisible onLeft={() => {}} onShare={() => {}} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const back = within(canvasElement).getByRole("button", { name: LONG_BACK }).getBoundingClientRect()
    const share = within(canvasElement).getByRole("button", { name: "シェア" }).getBoundingClientRect()
    const bar = canvasElement.querySelector("header")!.getBoundingClientRect()
    await expect(share.right).toBeLessThanOrEqual(bar.right)
    await expect(share.width).toBeGreaterThanOrEqual(43)
    await expect(back.right).toBeLessThanOrEqual(share.left)
  },
}
