/**
 * @file Select のストーリー
 * @description ドロップダウン選択コンポーネント。アイテム、グループ、プレースホルダーを網羅
 */
import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { FormField } from "../patterns/form-field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./select"

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
}
export default meta

type Story = StoryObj<typeof Select>

export const WithPlaceholder: Story = {
  tags: ["vrt"],
  render: () => (
    <Select>
      <SelectTrigger className="w-[240px]" aria-label="カテゴリを選択">
        <SelectValue placeholder="カテゴリを選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="design">デザイン</SelectItem>
        <SelectItem value="development">開発</SelectItem>
        <SelectItem value="marketing">マーケティング</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[240px]" aria-label="フルーツを選択">
        <SelectValue placeholder="フルーツを選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>柑橘類</SelectLabel>
          <SelectItem value="orange">オレンジ</SelectItem>
          <SelectItem value="lemon">レモン</SelectItem>
          <SelectItem value="grapefruit">グレープフルーツ</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>ベリー類</SelectLabel>
          <SelectItem value="strawberry">いちご</SelectItem>
          <SelectItem value="blueberry">ブルーベリー</SelectItem>
          <SelectItem value="raspberry">ラズベリー</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

export const WithDisabledItem: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[240px]" aria-label="プランを選択">
        <SelectValue placeholder="プランを選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="free">フリープラン</SelectItem>
        <SelectItem value="pro">プロプラン</SelectItem>
        <SelectItem value="enterprise" disabled>エンタープライズ（準備中）</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const DisabledSelect: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-[240px]" aria-label="選択できません">
        <SelectValue placeholder="選択できません" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">アイテム</SelectItem>
      </SelectContent>
    </Select>
  ),
}

// ─────────────────────────────────────────────────────────────
// interaction 回帰テスト（issue #256 / `npm run test:interaction`）
// ─────────────────────────────────────────────────────────────

/** 開いて選択でき、選んだ値がトリガーに反映される。 */
export const OpensAndSelectsOption: Story = {
  tags: ["interaction", "!autodocs"],
  render: () => (
    <Select>
      <SelectTrigger className="w-[240px]" data-testid="trigger" aria-label="カテゴリを選択">
        <SelectValue placeholder="カテゴリを選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="design">デザイン</SelectItem>
        <SelectItem value="development">開発</SelectItem>
        <SelectItem value="marketing">マーケティング</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    const trigger = canvas.getByTestId("trigger")

    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    await userEvent.click(trigger)
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "true"))

    // ポップオーバーは portal に出るので document 全体から探す
    const option = await body.findByRole("option", { name: "開発" })
    await userEvent.click(option)

    await waitFor(() => expect(trigger).toHaveTextContent("開発"))
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    await waitFor(() => expect(body.queryByRole("listbox")).not.toBeInTheDocument())
  },
}

/** キーボードだけで開いて選択できる。 */
export const SelectsWithKeyboard: Story = {
  tags: ["interaction", "!autodocs"],
  render: () => (
    <Select>
      <SelectTrigger className="w-[240px]" data-testid="trigger" aria-label="カテゴリを選択">
        <SelectValue placeholder="カテゴリを選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="design">デザイン</SelectItem>
        <SelectItem value="development">開発</SelectItem>
        <SelectItem value="marketing">マーケティング</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    const trigger = canvas.getByTestId("trigger")

    trigger.focus()
    await expect(trigger).toHaveFocus()

    await userEvent.keyboard("{Enter}")
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "true"))

    await userEvent.keyboard("{ArrowDown}")
    await userEvent.keyboard("{Enter}")

    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "false"))
    await expect(trigger.textContent).not.toBe("カテゴリを選択")
    await waitFor(() => expect(body.queryByRole("listbox")).not.toBeInTheDocument())
  },
}

const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県", "茨城県",
  "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県", "新潟県",
]

function ManyItemsSelect({ boundary }: { boundary?: HTMLElement | null }) {
  return (
    <Select>
      <SelectTrigger className="w-[240px]" data-testid="trigger" aria-label="都道府県を選択">
        <SelectValue placeholder="都道府県を選択" />
      </SelectTrigger>
      <SelectContent collisionBoundary={boundary ?? undefined}>
        {PREFECTURES.map((p) => (
          <SelectItem key={p} value={p}>{p}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/**
 * 低い画面の縦中央に、選択肢の多い Select を置く（issue #826）。一覧の高さが「使える高さ」
 * （--radix-select-content-available-height）を超えず、画面外へはみ出さない。
 * 高さ 548px の画面（iPhone SE の Safari 相当）を、collisionBoundary を高さ 548px の枠にして再現する
 * （Radix は枠と画面の重なりを「使える範囲」として高さを計算するので、画面を縮めたのと同じ計算になる）。
 */
export const FitsShortViewport: Story = {
  tags: ["interaction", "!autodocs"],
  render: function Render() {
    const [boundary, setBoundary] = React.useState<HTMLDivElement | null>(null)
    return (
      <div
        ref={setBoundary}
        data-testid="boundary"
        className="flex h-[548px] w-[375px] items-center justify-center border border-[var(--Border-Low-Emphasis)]"
      >
        {boundary && <ManyItemsSelect boundary={boundary} />}
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = await canvas.findByTestId("trigger")
    await userEvent.click(trigger)
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "true"))
    const content = await waitFor(() => {
      const el = document.querySelector<HTMLElement>('[data-slot="select-content"]')
      if (!el) throw new Error("select-content が出ていない")
      return el
    })
    // 開くアニメーション（zoom-in-95）の拡大率に左右されないよう、レイアウト上の高さ（offsetHeight）で比べる
    await waitFor(() => {
      const available = parseFloat(getComputedStyle(content).getPropertyValue("--radix-select-content-available-height"))
      expect(available).toBeGreaterThan(0)
      expect(available).toBeLessThan(384)
      expect(content.offsetHeight).toBeLessThanOrEqual(Math.ceil(available))
    })
    // 一覧は枠（＝低い画面）の中に収まる
    const box = canvas.getByTestId("boundary").getBoundingClientRect()
    await waitFor(() => {
      const rect = content.getBoundingClientRect()
      expect(rect.top).toBeGreaterThanOrEqual(box.top - 1)
      expect(rect.bottom).toBeLessThanOrEqual(box.bottom + 1)
    })
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "false"))
    await waitFor(() => expect(within(document.body).queryByRole("listbox")).not.toBeInTheDocument())
  },
}

/** 画面が十分に高いときは、従来どおり一覧の高さの上限は 384px（24rem）のまま（issue #826）。 */
export const KeepsMaxHeightOnTallScreen: Story = {
  tags: ["interaction", "!autodocs"],
  render: () => <ManyItemsSelect />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByTestId("trigger")
    await userEvent.click(trigger)
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "true"))
    const content = await waitFor(() => {
      const el = document.querySelector<HTMLElement>('[data-slot="select-content"]')
      if (!el) throw new Error("select-content が出ていない")
      return el
    })
    await waitFor(() => {
      const available = parseFloat(getComputedStyle(content).getPropertyValue("--radix-select-content-available-height"))
      expect(available).toBeGreaterThan(384)
      expect(content.offsetHeight).toBe(384)
    })
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "false"))
    await waitFor(() => expect(within(document.body).queryByRole("listbox")).not.toBeInTheDocument())
  },
}

// --Border-Caution の解決後の色（FormField の error で出るエラー枠の期待色）
const cautionBorderColor = () => {
  const probe = document.createElement("div")
  probe.style.cssText = "border: 1px solid var(--Border-Caution); position: absolute;"
  document.body.appendChild(probe)
  const color = getComputedStyle(probe).borderTopColor
  probe.remove()
  return color
}

/** FormField の error が Select（Root）経由でトリガーに届き、エラー枠（赤枠）になる。 */
export const InvalidInFormField: Story = {
  tags: ["interaction", "!autodocs"],
  render: () => (
    <div className="w-[260px]">
      <FormField label="カテゴリ" error="カテゴリを選択してください">
        <Select>
          <SelectTrigger data-testid="trigger" aria-label="カテゴリ">
            <SelectValue placeholder="カテゴリを選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="design">デザイン</SelectItem>
            <SelectItem value="development">開発</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByTestId("trigger")
    await expect(trigger).toHaveAttribute("aria-invalid", "true")
    await expect(trigger.getAttribute("aria-describedby")).toBeTruthy()
    await expect(getComputedStyle(trigger).borderTopColor).toBe(cautionBorderColor())
  },
}

/** トリガー自身の aria-describedby と FormField のエラー文の id が両方残る。 */
export const KeepsOwnDescribedByInFormField: Story = {
  tags: ["interaction", "!autodocs"],
  render: () => (
    <div className="w-[260px]">
      <FormField label="カテゴリ" error="カテゴリを選択してください">
        <Select>
          <SelectTrigger data-testid="trigger" aria-label="カテゴリ" aria-describedby="own-hint">
            <SelectValue placeholder="カテゴリを選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="design">デザイン</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
      <p id="own-hint">独自のヒント</p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByTestId("trigger")
    await expect(trigger).toHaveAccessibleDescription(/独自のヒント/)
    await expect(trigger).toHaveAccessibleDescription(/カテゴリを選択してください/)
  },
}
