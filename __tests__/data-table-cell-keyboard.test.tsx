/**
 * @vitest-environment jsdom
 *
 * DataTable の rows/columns API で、セルのキーボード操作を固定する（issue #814）。
 *
 * 編集開始用の td の onKeyDown が、押されたキーの発生元を見ずに Enter を
 * preventDefault していたため、セル内の <button> / <a href> が Enter で押せなかった。
 * また click / doubleClick の編集列の td はフォーカスを受けられず、キーボードだけでは
 * 編集を始められなかった。ここでは次を固定する:
 *
 *   1. 編集列のセル内のボタン・リンクの Enter は取り消されず、編集も始まらない
 *   2. editCell も edit 指定も無い表示専用の cell 列は、Enter で編集状態にならない
 *   3. 列ヘルパーの列は Tab で td に止まり、Enter で editCell が出る。確定・取り消しの後は
 *      フォーカスが同じ td に戻る
 *   4. 押せる行の td で Enter を押しても onRowClick は呼ばれない（二重発火しない）
 *
 * jsdom はキー入力からボタンの click を合成しないため、1 は「keydown が
 * preventDefault されていない」ことで確かめる（ブラウザは keydown の既定動作で click する）。
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent } from "@testing-library/dom"

import {
  DataTable,
  createDataTableChipColumn,
  createDataTableDateColumn,
  createDataTableSelectColumn,
  type DataTableColumn,
} from "../src/components/patterns/admin/data-table"

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined
}

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

/** keydown を送り、既定動作が取り消されなかったら true を返す。 */
function keyDown(element: Element, key: string) {
  let notPrevented = true
  act(() => {
    notPrevented = fireEvent.keyDown(element, { key })
  })
  return notPrevented
}

function focus(element: HTMLElement) {
  act(() => {
    element.focus()
  })
}

function bodyCells() {
  return [
    ...container.querySelectorAll<HTMLElement>(
      '[data-slot="data-table-body"] [data-slot="data-table-cell"]'
    ),
  ]
}

type Row = {
  id: number
  title: string
  due?: Date
  tags: string[]
  status: "todo" | "done"
}

const rows: Row[] = [{ id: 1, title: "見積もり", tags: [], status: "todo" }]

describe("セル内のボタン・リンクの Enter (#814)", () => {
  it("edit 未指定の cell 列のボタンは Enter が取り消されない", () => {
    const onClick = vi.fn()
    const columns: DataTableColumn<Row>[] = [
      {
        key: "actions",
        header: "操作",
        cell: () => (
          <button type="button" onClick={onClick}>
            詳細
          </button>
        ),
      },
    ]
    render(<DataTable rows={rows} columns={columns} />)

    const button = container.querySelector("button")!
    focus(button)
    expect(keyDown(button, "Enter")).toBe(true)
  })

  it("editCell を持つ列でも、セル内のボタン・リンクの Enter は取り消されず編集も始まらない", () => {
    const columns: DataTableColumn<Row>[] = [
      {
        key: "title",
        header: "タスク",
        cell: ({ row }) => (
          <span>
            <button type="button">詳細</button>
            <a href="/tasks/1">開く</a>
            {row.title}
          </span>
        ),
        editCell: () => <input aria-label="タスク名" />,
      },
    ]
    render(<DataTable rows={rows} columns={columns} />)

    const button = container.querySelector("button")!
    focus(button)
    expect(keyDown(button, "Enter")).toBe(true)
    const link = container.querySelector("a")!
    focus(link)
    expect(keyDown(link, "Enter")).toBe(true)
    expect(container.querySelector('input[aria-label="タスク名"]')).toBeNull()
  })
})

describe("表示専用の cell 列 (#814)", () => {
  it("editCell も edit も無い列は Enter で編集状態にならず、td はフォーカスを受けない", () => {
    const columns: DataTableColumn<Row>[] = [
      {
        key: "title",
        header: "タスク",
        cell: ({ row, isEditing }) => (isEditing ? "編集中" : row.title),
      },
    ]
    render(<DataTable rows={rows} columns={columns} />)

    const cell = bodyCells()[0]
    expect(cell.hasAttribute("tabindex")).toBe(false)
    expect(keyDown(cell, "Enter")).toBe(true)
    expect(cell.textContent).toBe("見積もり")
  })
})

function HelperTable({
  onRowClick,
  onDueCommit,
  onStatusCommit,
}: {
  onRowClick?: () => void
  onDueCommit?: (value: Date | undefined) => void
  onStatusCommit?: (value: string) => void
}) {
  const columns = React.useMemo<DataTableColumn<Row>[]>(
    () => [
      createDataTableDateColumn<Row>({
        key: "due",
        header: "期限",
        value: (row) => row.due,
        onCommit: (_row, value) => onDueCommit?.(value),
      }),
      createDataTableChipColumn<Row>({
        key: "tags",
        header: "タグ",
        multiple: true,
        value: (row) => row.tags,
        options: [
          { label: "急ぎ", value: "urgent" },
          { label: "確認", value: "review" },
        ],
      }),
      createDataTableSelectColumn<Row, Row["status"]>({
        key: "status",
        header: "状態",
        value: (row) => row.status,
        options: [
          { label: "未着手", value: "todo" },
          { label: "完了", value: "done" },
        ],
        onCommit: (_row, value) => onStatusCommit?.(value),
      }),
    ],
    [onDueCommit, onStatusCommit]
  )
  return <DataTable rows={rows} columns={columns} onRowClick={onRowClick} />
}

describe("trigger=\"focus\" の列 (#814)", () => {
  it("Escape で td にフォーカスを戻しても、編集は再開しない", () => {
    const columns: DataTableColumn<Row>[] = [
      {
        key: "title",
        header: "タスク",
        edit: { trigger: "focus" },
        cell: ({ row }) => row.title,
        editCell: ({ row }) => <input aria-label="タスク名" defaultValue={row.title} />,
      },
    ]
    render(<DataTable rows={rows} columns={columns} />)

    focus(bodyCells()[0])
    const input = container.querySelector<HTMLInputElement>('input[aria-label="タスク名"]')
    expect(input).not.toBeNull()
    expect(document.activeElement).toBe(input)

    keyDown(input!, "Escape")
    const cell = bodyCells()[0]
    expect(container.querySelector('input[aria-label="タスク名"]')).toBeNull()
    expect(document.activeElement).toBe(cell)
  })
})

describe("列ヘルパーの列のキーボード編集 (#814)", () => {
  it("日付・チップ・選択の列の td は Tab 順に入る（tabIndex=0）", () => {
    render(<HelperTable />)
    const [due, tags, status] = bodyCells()
    expect(due.tabIndex).toBe(0)
    expect(tags.tabIndex).toBe(0)
    expect(status.tabIndex).toBe(0)
  })

  it("Enter で editCell が出てフォーカスが中へ移り、Escape で同じ td にフォーカスが戻る", () => {
    render(<HelperTable />)

    // 日付列
    let due = bodyCells()[0]
    focus(due)
    expect(keyDown(due, "Enter")).toBe(false)
    due = bodyCells()[0]
    const picker = due.querySelector("button")
    expect(picker).not.toBeNull()
    expect(document.activeElement).toBe(picker)
    // 編集中の td は Tab 順から外れる
    expect(due.tabIndex).toBe(-1)
    keyDown(picker!, "Escape")
    due = bodyCells()[0]
    expect(due.querySelector("button")).toBeNull()
    expect(document.activeElement).toBe(due)
    expect(due.tabIndex).toBe(0)

    // チップ列（複数選択は選んでも閉じないので Escape で抜ける）
    let tags = bodyCells()[1]
    focus(tags)
    keyDown(tags, "Enter")
    tags = bodyCells()[1]
    const chip = tags.querySelector("button")
    expect(chip).not.toBeNull()
    expect(document.activeElement).toBe(chip)
    keyDown(chip!, "Escape")
    tags = bodyCells()[1]
    expect(tags.querySelector("button")).toBeNull()
    expect(document.activeElement).toBe(tags)
  })

  it("選択の列は Enter で編集を始め、選択肢の確定後に同じ td へフォーカスが戻る", () => {
    const onStatusCommit = vi.fn()
    render(<HelperTable onStatusCommit={onStatusCommit} />)

    let status = bodyCells()[2]
    focus(status)
    keyDown(status, "Enter")
    status = bodyCells()[2]
    const trigger = status.querySelector<HTMLElement>('[role="combobox"]')
    expect(trigger).not.toBeNull()
    expect(document.activeElement).toBe(trigger)

    keyDown(trigger!, "ArrowDown")
    const option = [...document.querySelectorAll<HTMLElement>('[role="option"]')].find(
      (el) => el.textContent === "完了"
    )
    expect(option).toBeDefined()
    focus(option!)
    keyDown(option!, "Enter")

    expect(onStatusCommit).toHaveBeenCalledWith("done")
    status = bodyCells()[2]
    expect(status.querySelector('[role="combobox"]')).toBeNull()
    expect(document.activeElement).toBe(status)
  })

  it("押せる行の td で Enter を押しても onRowClick は呼ばれず、編集だけが始まる", () => {
    const onRowClick = vi.fn()
    render(<HelperTable onRowClick={onRowClick} />)

    const due = bodyCells()[0]
    focus(due)
    keyDown(due, "Enter")
    expect(bodyCells()[0].querySelector("button")).not.toBeNull()
    expect(onRowClick).not.toHaveBeenCalled()

    // 行そのものの Enter は従来どおり onRowClick
    const row = container.querySelector<HTMLElement>('[data-slot="data-table-row"]')!
    focus(row)
    keyDown(row, "Enter")
    expect(onRowClick).toHaveBeenCalledTimes(1)
  })
})
