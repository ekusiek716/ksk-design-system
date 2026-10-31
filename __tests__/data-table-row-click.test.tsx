/**
 * @vitest-environment jsdom
 *
 * DataTable の行クリック（onRowClick）と、セル内の操作の切り分け（issue #793）。
 *
 * 行クリックで詳細を開く表に、選択セル・日付セル・クリック編集の列を置くと、
 * 値を選ぶ・編集を始めるたびに onRowClick まで呼ばれていた。原因は 2 つ:
 *
 *   1. Select / DatePicker のポップアップは body へ Portal されるため DOM 上は行の
 *      子孫でないが、React の合成イベントは Portal を越えて tr まで届く。行側の除外判定は
 *      `closest()` だけだったので、選択肢の Enter・タップ・見出しのクリックを拾っていた
 *   2. クリック編集の td は除外対象に当たらず、編集開始のクリックがそのまま行クリックになった
 *
 * ここでは次を固定する:
 *   - Select の選択肢を Enter / タッチ相当で選んでも onRowClick は呼ばれない
 *   - DatePicker のポップアップ内（見出し・日付ボタン）の操作で onRowClick は呼ばれない
 *   - createDataTable*Column のクリック編集のセルを押しても onRowClick は呼ばれない
 *   - 表示専用のセル・行の余白を押したときは、これまでどおり onRowClick が呼ばれる
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent } from "@testing-library/dom"

import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableDateCell,
  DataTableRow,
  DataTableSelectCell,
  DataTableTable,
  createDataTableDateColumn,
  createDataTableSelectColumn,
  type DataTableColumn,
} from "../src/components/patterns/admin/data-table"

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined
}

// Radix の Select / Popover は要素サイズの購読とポインタキャプチャ・スクロールを使う。
// jsdom に無い API を最小実装で補う（レイアウトは見ないので値は空でよい）。
if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
}
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false
  Element.prototype.releasePointerCapture = () => {}
  Element.prototype.setPointerCapture = () => {}
}
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {}
}

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
})

function render(ui: React.ReactElement) {
  act(() => root.render(ui))
}

function fire(run: () => void) {
  act(() => {
    run()
  })
}

const options = [
  { label: "A", value: "a" },
  { label: "B", value: "b" },
]

function SelectRow({ onRowClick }: { onRowClick: () => void }) {
  const [value, setValue] = React.useState("a")
  return (
    <DataTableTable>
      <DataTableBody>
        <DataTableRow clickable onRowClick={onRowClick}>
          <DataTableCell data-testid="plain-cell">名前</DataTableCell>
          <DataTableSelectCell
            aria-label="担当"
            value={value}
            onValueChange={setValue}
            options={options}
          />
        </DataTableRow>
      </DataTableBody>
    </DataTableTable>
  )
}

function openSelect() {
  const trigger = container.querySelector<HTMLElement>('[role="combobox"]')!
  fire(() => {
    trigger.focus()
    fireEvent.keyDown(trigger, { key: "ArrowDown" })
  })
  const option = [...document.querySelectorAll<HTMLElement>('[role="option"]')].find(
    (el) => el.textContent === "B"
  )
  expect(option).toBeDefined()
  return option!
}

describe("DataTableRow: Portal 越しのイベントを行クリックにしない (#793)", () => {
  it("Select の選択肢を Enter で確定しても onRowClick は呼ばれない", () => {
    const onRowClick = vi.fn()
    render(<SelectRow onRowClick={onRowClick} />)

    const option = openSelect()
    fire(() => {
      option.focus()
      fireEvent.keyDown(option, { key: "Enter" })
    })

    expect(container.querySelector('[role="combobox"]')!.textContent).toBe("B")
    expect(onRowClick).not.toHaveBeenCalled()
  })

  it("Select の選択肢をタッチ相当（pointerdown / pointerup / click）で選んでも onRowClick は呼ばれない", () => {
    const onRowClick = vi.fn()
    render(<SelectRow onRowClick={onRowClick} />)

    const option = openSelect()
    fire(() => {
      fireEvent.pointerDown(option, { pointerType: "touch" })
      fireEvent.pointerUp(option, { pointerType: "touch" })
      fireEvent.click(option)
    })

    expect(container.querySelector('[role="combobox"]')!.textContent).toBe("B")
    expect(onRowClick).not.toHaveBeenCalled()
  })

  it("DatePicker のポップアップ内の見出し・日付ボタンを押しても onRowClick は呼ばれない", () => {
    const onRowClick = vi.fn()
    const onValueChange = vi.fn()
    render(
      <DataTableTable>
        <DataTableBody>
          <DataTableRow clickable onRowClick={onRowClick}>
            <DataTableDateCell
              value={new Date(2026, 5, 10)}
              onValueChange={onValueChange}
            />
          </DataTableRow>
        </DataTableBody>
      </DataTableTable>
    )

    fire(() => {
      fireEvent.click(container.querySelector<HTMLElement>('[data-slot="data-table-date-cell"] button')!)
    })
    const popover = document.querySelector<HTMLElement>('[data-slot="popover-content"]')
    expect(popover).not.toBeNull()
    expect(container.contains(popover)).toBe(false)

    // 見出し（例: 「2026年6月」）は button ではないので、従来は closest() で除外できなかった
    const caption = [...popover!.querySelectorAll<HTMLElement>("span, div")].find((el) =>
      /2026/.test(el.textContent ?? "") && el.children.length === 0
    )
    expect(caption).toBeDefined()
    fire(() => {
      fireEvent.click(caption!)
    })
    // ポップアップの余白
    fire(() => {
      fireEvent.click(popover!)
    })
    const dayButton = [...popover!.querySelectorAll<HTMLButtonElement>("button")].find((el) =>
      el.getAttribute("aria-label")?.includes("15")
    )
    expect(dayButton).toBeDefined()
    fire(() => {
      fireEvent.click(dayButton!)
    })

    expect(onValueChange).toHaveBeenCalled()
    expect(onRowClick).not.toHaveBeenCalled()
  })

  it("通常のセルを押したときは、これまでどおり onRowClick が呼ばれる", () => {
    const onRowClick = vi.fn()
    render(<SelectRow onRowClick={onRowClick} />)

    fire(() => {
      fireEvent.click(container.querySelector<HTMLElement>('[data-testid="plain-cell"]')!)
    })
    expect(onRowClick).toHaveBeenCalledTimes(1)

    // 行そのもの（セルの外の余白）でも呼ばれる
    fire(() => {
      fireEvent.click(container.querySelector<HTMLElement>('[data-slot="data-table-row"]')!)
    })
    expect(onRowClick).toHaveBeenCalledTimes(2)
  })

  it("表ごと role=\"dialog\" の中に置いても、通常のセルのクリックは onRowClick になる", () => {
    const onRowClick = vi.fn()
    render(
      <div role="dialog" aria-label="一覧">
        <SelectRow onRowClick={onRowClick} />
      </div>
    )

    fire(() => {
      fireEvent.click(container.querySelector<HTMLElement>('[data-testid="plain-cell"]')!)
    })
    expect(onRowClick).toHaveBeenCalledTimes(1)
  })
})

type Task = { id: number; title: string; status: "todo" | "done"; due?: Date }

const statusOptions = [
  { label: "未着手", value: "todo" as const },
  { label: "完了", value: "done" as const },
]

function TaskTable({
  onRowClick,
  onStatusCommit,
}: {
  onRowClick: () => void
  onStatusCommit?: (value: string) => void
}) {
  const columns = React.useMemo<DataTableColumn<Task>[]>(
    () => [
      { key: "title", header: "タスク", cell: ({ row }) => row.title },
      createDataTableDateColumn<Task>({
        key: "due",
        header: "期限",
        value: (task) => task.due,
      }),
      createDataTableSelectColumn<Task, Task["status"]>({
        key: "status",
        header: "状態",
        value: (task) => task.status,
        options: statusOptions,
        onCommit: (_task, value) => onStatusCommit?.(value),
      }),
    ],
    [onStatusCommit]
  )
  return (
    <DataTable
      rows={[{ id: 1, title: "見積もり", status: "todo" }]}
      columns={columns}
      onRowClick={onRowClick}
    />
  )
}

function cellOf(columnIndex: number) {
  return container.querySelectorAll<HTMLElement>(
    '[data-slot="data-table-body"] [data-slot="data-table-cell"]'
  )[columnIndex]
}

describe("DataTable: クリック編集のセルを行クリックにしない (#793)", () => {
  it("createDataTableSelectColumn のセルを押して編集を始めても onRowClick は呼ばれない", () => {
    const onRowClick = vi.fn()
    const onStatusCommit = vi.fn()
    render(<TaskTable onRowClick={onRowClick} onStatusCommit={onStatusCommit} />)

    fire(() => {
      fireEvent.click(cellOf(2).querySelector("span") ?? cellOf(2))
    })
    expect(cellOf(2).querySelector('[role="combobox"]')).not.toBeNull()
    expect(onRowClick).not.toHaveBeenCalled()

    // 開いた選択肢を Enter で確定しても行クリックにならない
    openSelect2()
    expect(onStatusCommit).toHaveBeenCalledWith("done")
    expect(onRowClick).not.toHaveBeenCalled()
  })

  it("createDataTableSelectColumn の選択肢をタッチ相当で選ぶと、編集が閉じて onRowClick も呼ばれない", () => {
    // 選択肢の click は Portal を越えて td まで届く。td の onClick（trigger="click"）が
    // それを拾うと、確定した直後に編集を始め直してセルが開いたままになっていた。
    const onRowClick = vi.fn()
    const onStatusCommit = vi.fn()
    render(<TaskTable onRowClick={onRowClick} onStatusCommit={onStatusCommit} />)

    fire(() => {
      fireEvent.click(cellOf(2).querySelector("span") ?? cellOf(2))
    })
    expect(cellOf(2).querySelector('[role="combobox"]')).not.toBeNull()

    const option = openSelect2Option()
    fire(() => {
      fireEvent.pointerDown(option, { pointerType: "touch" })
      fireEvent.pointerUp(option, { pointerType: "touch" })
      fireEvent.click(option)
    })

    expect(onStatusCommit).toHaveBeenCalledWith("done")
    expect(cellOf(2).querySelector('[role="combobox"]')).toBeNull()
    expect(onRowClick).not.toHaveBeenCalled()
  })

  it("createDataTableDateColumn のセル（td 自体）を押しても onRowClick は呼ばれない", () => {
    const onRowClick = vi.fn()
    render(<TaskTable onRowClick={onRowClick} />)

    fire(() => {
      fireEvent.click(cellOf(1))
    })
    expect(cellOf(1).querySelector("button")).not.toBeNull()
    expect(onRowClick).not.toHaveBeenCalled()
  })

  it("表示専用の cell 列を押したときは onRowClick が呼ばれる", () => {
    const onRowClick = vi.fn()
    render(<TaskTable onRowClick={onRowClick} />)

    fire(() => {
      fireEvent.click(cellOf(0))
    })
    expect(onRowClick).toHaveBeenCalledTimes(1)
  })
})

function openSelect2Option() {
  const trigger = container.querySelector<HTMLElement>('[role="combobox"]')!
  fire(() => {
    trigger.focus()
    fireEvent.keyDown(trigger, { key: "ArrowDown" })
  })
  const option = [...document.querySelectorAll<HTMLElement>('[role="option"]')].find(
    (el) => el.textContent === "完了"
  )
  expect(option).toBeDefined()
  return option!
}

function openSelect2() {
  const option = openSelect2Option()
  fire(() => {
    option.focus()
    fireEvent.keyDown(option, { key: "Enter" })
  })
}
