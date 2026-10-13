import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { expect, userEvent, within } from "storybook/test"
import { Slider } from "./slider"

const meta = {
  title: "Components/Slider",
  component: Slider,
  tags: ["autodocs"],
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  tags: ["vrt"],
  render: () => (
    <div className="w-64">
      <Slider defaultValue={[50]} min={0} max={100} step={1} />
    </div>
  ),
}

export const Range: Story = {
  render: () => (
    <div className="w-64">
      <Slider defaultValue={[20, 80]} min={0} max={100} step={1} />
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-64">
      <div className="flex justify-between">
        <span className="typo-label-sm text-[var(--Text-High-Emphasis)]">価格帯</span>
        <span className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">¥1,000〜¥5,000</span>
      </div>
      {/* 2ハンドル（range）は aria-label を渡すと「価格帯（開始）」「価格帯（終了）」
          のように thumb ごとに区別できるアクセシブルネームになる。 */}
      <Slider defaultValue={[1000, 5000]} min={0} max={10000} step={100} aria-label="価格帯" />
    </div>
  ),
}

/**
 * range スライダーで最小値/最大値それぞれに専用の可視ラベルがある場合、
 * `aria-labelledby` に id を1つの string で渡すと両方の thumb に同じ id が
 * 付いてしまい区別できない。id の配列（`[開始のid, 終了のid]`）を渡すと
 * thumb ごとに異なるラベルを紐付けられる。
 */
export const RangeWithSeparateLabels: Story = {
  name: "Range — 最小値/最大値を別々にラベル付け",
  render: () => (
    <div className="flex flex-col gap-2 w-64">
      <div className="flex justify-between">
        <span id="price-min-label" className="typo-label-sm text-[var(--Text-High-Emphasis)]">
          最小価格
        </span>
        <span id="price-max-label" className="typo-label-sm text-[var(--Text-High-Emphasis)]">
          最大価格
        </span>
      </div>
      <Slider
        defaultValue={[1000, 5000]}
        min={0}
        max={10000}
        step={100}
        aria-labelledby={["price-min-label", "price-max-label"]}
      />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="w-64">
      <Slider defaultValue={[30]} min={0} max={100} step={1} disabled />
    </div>
  ),
}

/**
 * 範囲スライダーの Home / End は、フォーカス中のつまみをそのつまみが動ける範囲の端
 * （隣のつまみ、無ければ min / max）へ動かす（WAI-ARIA APG の Multi-Thumb Slider）。
 * 先頭・末尾のつまみを動かしてしまうと、キーボード操作で意図しないつまみが動く。
 */
export const RangeHomeEndMovesFocusedThumb: Story = {
  tags: ["interaction", "!autodocs"],
  render: () => (
    <div className="w-64">
      <Slider defaultValue={[20, 80]} min={0} max={100} step={1} aria-label="価格" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const start = canvas.getByRole("slider", { name: "価格（開始）" })
    const end = canvas.getByRole("slider", { name: "価格（終了）" })

    // 終了つまみで Home: 開始つまみ（20）の位置まで。開始つまみは動かない
    end.focus()
    await userEvent.keyboard("{Home}")
    await expect(end).toHaveAttribute("aria-valuenow", "20")
    await expect(start).toHaveAttribute("aria-valuenow", "20")
    await expect(end).toHaveFocus()

    // 開始つまみで End: 終了つまみ（20）の位置まで
    start.focus()
    await userEvent.keyboard("{End}")
    await expect(start).toHaveAttribute("aria-valuenow", "20")

    // 開始つまみで Home: min まで
    await userEvent.keyboard("{Home}")
    await expect(start).toHaveAttribute("aria-valuenow", "0")
    await expect(end).toHaveAttribute("aria-valuenow", "20")

    // 終了つまみで End: max まで
    end.focus()
    await userEvent.keyboard("{End}")
    await expect(end).toHaveAttribute("aria-valuenow", "100")
    await expect(start).toHaveAttribute("aria-valuenow", "0")
  },
}

/** defaultValue / value が無い <Slider /> は単一つまみのまま（範囲スライダーにならない）。 */
export const NoValueStaysSingleThumb: Story = {
  tags: ["interaction", "!autodocs"],
  render: () => {
    const [last, setLast] = React.useState("")
    return (
      <div className="w-64">
        <Slider aria-label="音量" onValueChange={(v) => setLast(JSON.stringify(v))} />
        <p data-testid="last">{last}</p>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const thumb = within(canvasElement).getAllByRole("slider")[0]
    thumb.focus()
    // 範囲スライダー用の Home/End 横取り（隣のつまみ基準）が入らず、Radix 既定の単一つまみとして min/max へ動く
    await userEvent.keyboard("{End}")
    await expect(thumb).toHaveAttribute("aria-valuenow", "100")
    // 値は 1 要素の配列（2 要素になっていれば範囲スライダー化している）
    await expect(within(canvasElement).getByTestId("last")).toHaveTextContent("[100]")
    await userEvent.keyboard("{Home}")
    await expect(thumb).toHaveAttribute("aria-valuenow", "0")
  },
}
