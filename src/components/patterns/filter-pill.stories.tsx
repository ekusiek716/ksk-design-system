/**
 * @file FilterPill のストーリー
 * @description 任意コンテンツの Popover を開くフィルタピル。適用中はピル内にクリアボタンを持つ。
 */
import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within, screen } from "storybook/test"
import { FilterPill } from "./filter-pill"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const meta: Meta<typeof FilterPill> = {
  title: "Patterns/FilterPill",
  component: FilterPill,
  tags: ["autodocs"],
}
export default meta

type Story = StoryObj<typeof FilterPill>

const AREAS = ["渋谷", "新宿", "池袋"]

function AreaFilter({ size }: { size?: "sm" | "md" }) {
  const [selected, setSelected] = React.useState<string[]>([])
  const value =
    selected.length === 0
      ? undefined
      : selected.length === 1
        ? selected[0]
        : `${selected[0]} 他${selected.length - 1}件`

  return (
    <FilterPill
      label="エリア"
      size={size}
      value={value}
      onClear={() => setSelected([])}
    >
      <div className="flex flex-col gap-3">
        {AREAS.map((area) => (
          <div key={area} className="flex items-center gap-2">
            <Checkbox
              id={`area-${area}`}
              checked={selected.includes(area)}
              onCheckedChange={(checked) =>
                setSelected((current) =>
                  checked ? [...current, area] : current.filter((a) => a !== area),
                )
              }
            />
            <Label htmlFor={`area-${area}`}>{area}</Label>
          </div>
        ))}
      </div>
    </FilterPill>
  )
}

/** 未適用（value 未指定）。ラベルのみ・中立配色。 */
export const Default: Story = {
  render: () => <AreaFilter />,
}

/** 適用中。`ラベル: 値` 表示 + クリアボタン。 */
export const Active: Story = {
  args: {
    label: "エリア",
    value: "渋谷",
    onClear: () => {},
    children: <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">フィルタ内容</p>,
  },
}

/** onClear を渡さない場合はクリアボタンが出ない（値の解除はパネル内で行う想定）。 */
export const ActiveWithoutClear: Story = {
  args: {
    label: "価格帯",
    value: "〜5,000円",
    children: <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">フィルタ内容</p>,
  },
}

/** フィルタバーとして横に並べる。 */
export const Bar: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <AreaFilter />
      <AreaFilter size="sm" />
    </div>
  ),
}

// ─────────────────────────────────────────────────────────────
// interaction 回帰テスト（issue #256 / `npm run test:interaction`）
// ─────────────────────────────────────────────────────────────

/** トリガーで Popover が開き、クリアは Popover を開かずに値だけ消す（nested button なし）。 */
export const OpensPanelAndClears: Story = {
  tags: ["interaction", "!autodocs"],
  render: () => <AreaFilter />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const trigger = canvas.getByRole("button", { name: /エリア/ })
    await expect(trigger).toHaveAttribute("aria-expanded", "false")

    // ピル内に button が入れ子になっていない（不正な HTML の回帰防止）
    await expect(trigger.querySelector("button")).toBeNull()

    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute("aria-expanded", "true")

    // Popover は Portal 先に描画されるため screen で拾う
    await userEvent.click(await screen.findByLabelText("渋谷"))
    await expect(canvas.getByRole("button", { name: /エリア: 渋谷/ })).toBeInTheDocument()

    await userEvent.keyboard("{Escape}")

    const clear = canvas.getByRole("button", { name: "エリアをクリア" })
    await userEvent.click(clear)
    await expect(canvas.getByRole("button", { name: "エリア" })).toHaveAttribute(
      "aria-expanded",
      "false",
    )
    await expect(canvas.queryByRole("button", { name: "エリアをクリア" })).toBeNull()
  },
}
