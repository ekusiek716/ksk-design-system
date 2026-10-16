/**
 * @file SelectableTile のストーリー
 * @description 押すと選べて、編集中はドラッグ・矢印キーで動かせるタイル（issue #703）
 */
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { expect, fn, userEvent } from "storybook/test"
import { SelectableTile, type SelectableTileMoveDirection } from "./selectable-tile"
import { Switch } from "../ui/switch"
import { Label } from "../ui/label"

const meta: Meta<typeof SelectableTile> = {
  title: "Components/SelectableTile",
  component: SelectableTile,
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof SelectableTile>

/** 選択（aria-pressed）。角丸と円形 */
export const Shapes: Story = {
  render: function Render() {
    const [selected, setSelected] = React.useState<string | null>("A")
    return (
      <div className="flex flex-wrap items-center gap-4">
        {["A", "B"].map((name) => (
          <SelectableTile
            key={name}
            className="h-24 w-32 flex-col gap-1"
            selected={selected === name}
            onClick={() => setSelected(name)}
          >
            <span className="typo-label-md">卓 {name}</span>
            <span className="typo-body-xs text-[var(--Text-Medium-Emphasis)]">6 / 8 席</span>
          </SelectableTile>
        ))}
        {[1, 2, 3].map((seat) => (
          <SelectableTile
            key={seat}
            shape="circle"
            className="size-12 typo-label-sm"
            aria-label={`座席 ${seat}`}
            selected={selected === `seat-${seat}`}
            onClick={() => setSelected(`seat-${seat}`)}
          >
            {seat}
          </SelectableTile>
        ))}
      </div>
    )
  },
}

const DIRECTION: Record<SelectableTileMoveDirection, [number, number]> = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
}

/**
 * 配置の編集（movable）。矢印キーで `onMove`、操作説明は aria-describedby で読み上げる。
 * ドラッグ（pointer capture・落とし先の判定）は consumer が onPointerDown 等で実装し、
 * `dragging` で見た目だけ渡す。
 */
export const MovableGrid: Story = {
  render: function Render() {
    const [editing, setEditing] = React.useState(true)
    const [pos, setPos] = React.useState({ x: 1, y: 0 })
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Switch id="layout-edit" checked={editing} onCheckedChange={setEditing} />
          <Label htmlFor="layout-edit">配置を編集</Label>
        </div>
        <div className="grid grid-cols-3 grid-rows-2 gap-2 w-80">
          {Array.from({ length: 6 }, (_, i) => {
            const x = i % 3
            const y = Math.floor(i / 3)
            const here = pos.x === x && pos.y === y
            return (
              <div key={i} className="flex h-20 items-center justify-center rounded-lg border border-dashed border-[var(--Border-Low-Emphasis)]">
                {here && (
                  <SelectableTile
                    className="h-16 w-24"
                    movable={editing}
                    moveInstructions="矢印キーで卓を移動できます"
                    onMove={(direction) => {
                      const [dx, dy] = DIRECTION[direction]
                      setPos((p) => ({ x: Math.min(2, Math.max(0, p.x + dx)), y: Math.min(1, Math.max(0, p.y + dy)) }))
                    }}
                  >
                    卓 A
                  </SelectableTile>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  },
}

/** 押せる面そのものが 1 つの button で、consumer のハンドラと aria-describedby が同じ要素に付く */
export const KeyboardMove: Story = {
  tags: ["interaction"],
  args: { onMove: fn(), onClick: fn() },
  render: (args) => (
    <>
      <p id="tile-hint">編集中です</p>
      <SelectableTile
        {...args}
        className="h-16 w-24"
        movable
        aria-describedby="tile-hint"
        moveInstructions="矢印キーで移動"
      >
        卓 A
      </SelectableTile>
    </>
  ),
  play: async ({ args, canvasElement }) => {
    const tile = canvasElement.querySelector<HTMLButtonElement>('[data-slot="selectable-tile"]')!
    // consumer の aria-describedby と操作説明の両方へ結ぶ
    const ids = (tile.getAttribute("aria-describedby") ?? "").split(" ")
    await expect(ids[0]).toBe("tile-hint")
    const instructions = canvasElement.ownerDocument.getElementById(ids[1])!
    await expect(instructions.textContent).toBe("矢印キーで移動")
    await expect(instructions.hidden).toBe(true)
    tile.focus()
    await userEvent.keyboard("{ArrowRight}")
    await expect(args.onMove).toHaveBeenCalledWith("right", expect.anything())
    await userEvent.keyboard("{ArrowUp}")
    await expect(args.onMove).toHaveBeenCalledWith("up", expect.anything())
    await userEvent.keyboard("{Enter}")
    await expect(args.onClick).toHaveBeenCalledTimes(1)
  },
}
