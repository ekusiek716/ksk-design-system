import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, waitFor } from "storybook/test"
import * as React from "react"
import { CollapsibleChipField } from "./collapsible-chip-field"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

const meta: Meta<typeof CollapsibleChipField> = {
  title: "Components/CollapsibleChipField",
  component: CollapsibleChipField,
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof CollapsibleChipField>

type Category = "work" | "family" | "health" | "hobby" | "shopping" | "other"

const LABELS: Record<Category, string> = {
  work: "仕事",
  family: "家族",
  health: "健康",
  hobby: "趣味",
  shopping: "買い物",
  other: "その他",
}

const ICONS: Record<Category, string> = {
  work: "\u{1F4BC}",
  family: "\u{1F46A}",
  health: "\u{1F3E5}",
  hobby: "\u{1F3A8}",
  shopping: "\u{1F6CD}",
  other: "\u{1F4CC}",
}

const OPTIONS: Category[] = ["work", "family", "health", "hobby", "shopping", "other"]

export const WithLabel: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<Category | "">("")
    return (
      <div className="p-4 max-w-md">
        <CollapsibleChipField<Category>
          label="カテゴリ"
          options={OPTIONS}
          selected={selected}
          onSelect={setSelected}
          onClear={() => setSelected("")}
          getLabel={(k) => LABELS[k]}
        />
      </div>
    )
  },
}

export const WithIcon: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<Category | "">("work")
    return (
      <div className="p-4 max-w-md">
        <CollapsibleChipField<Category>
          icon={<span aria-hidden="true">{ICONS.work}</span>}
          options={OPTIONS}
          selected={selected}
          onSelect={setSelected}
          onClear={() => setSelected("")}
          getLabel={(k) => LABELS[k]}
          getIcon={(k) => ICONS[k]}
        />
      </div>
    )
  },
}

export const RequiredNoClear: Story = {
  render: () => {
    // onClear 未指定: 選択済み chip を再タップすると再選択用に全展開するのみ（解除不可）
    const [selected, setSelected] = React.useState<Category | "">("family")
    return (
      <div className="p-4 max-w-md">
        <CollapsibleChipField<Category>
          label="必須項目"
          options={OPTIONS}
          selected={selected}
          onSelect={setSelected}
          getLabel={(k) => LABELS[k]}
        />
      </div>
    )
  },
}

/**
 * **アイコン付き・折りたたみ型の単一選択行**（issue #419。trip-todo の InlineChipPicker 相当）。
 *
 * 左端にアイコン、選択中の 1 チップだけを表示し、タップで候補を展開して選び直す。
 * 折りたたみ中のチップは `aria-expanded={false}` の開閉トリガ、展開中は
 * `role="radiogroup"` + `role="radio"`。展開すると選択中チップへフォーカスが移り、
 * **Escape で畳んで**元のチップへ戻る。
 *
 * `label` を持たないアイコン先頭の行では、グループ名が無くなるので `ariaLabel` を必ず渡す。
 */
export const CollapsedDisclosure: Story = {
  tags: ["interaction"],
  render: () => {
    const [selected, setSelected] = React.useState<Category | "">("work")
    return (
      <div className="p-4 max-w-md">
        <CollapsibleChipField<Category>
          icon={<span aria-hidden="true">{"\u{1F3F7}"}</span>}
          ariaLabel="カテゴリ"
          options={OPTIONS}
          selected={selected}
          onSelect={setSelected}
          getLabel={(k) => LABELS[k]}
        />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const row = () => canvasElement.querySelector('[data-slot="collapsible-chip-field"] > div:last-child')!
    const chips = () => [
      ...canvasElement.querySelectorAll<HTMLButtonElement>('button[data-slot="chip"]'),
    ]

    // 折りたたみ中: 選択中の 1 チップだけ。開閉トリガなので aria-expanded=false、
    // radiogroup は名乗らない（選択肢 1 件の radiogroup になってしまうため）
    await expect(chips().length).toBe(1)
    await expect(chips()[0].getAttribute("aria-expanded")).toBe("false")
    await expect(chips()[0].hasAttribute("aria-pressed")).toBe(false)
    await expect(row().hasAttribute("role")).toBe(false)

    // タップで展開 → 全候補が radiogroup として出る。フォーカスは選択中チップへ
    await userEvent.click(chips()[0])
    await waitFor(async () => {
      await expect(chips().length).toBe(OPTIONS.length)
    })
    await expect(row().getAttribute("role")).toBe("radiogroup")
    await expect(row().getAttribute("aria-label")).toBe("カテゴリ")
    await expect(chips()[0].getAttribute("role")).toBe("radio")
    await expect(chips()[0].getAttribute("aria-checked")).toBe("true")
    await expect(chips()[0].getAttribute("aria-expanded")).toBe("true")
    await expect(document.activeElement).toBe(chips()[0])
    // roving tabindex: Tab で 1 回だけ止まる
    await expect(chips().filter((c) => c.tabIndex === 0).length).toBe(1)

    // Escape で畳んで、フォーカスは折りたたみ後のチップへ戻る
    await userEvent.keyboard("{Escape}")
    await waitFor(async () => {
      await expect(chips().length).toBe(1)
    })
    await expect(chips()[0].getAttribute("aria-expanded")).toBe("false")
    await expect(document.activeElement).toBe(chips()[0])

    // 展開して別のチップを選ぶと、その選択で畳まれる
    await userEvent.click(chips()[0])
    await waitFor(async () => {
      await expect(chips().length).toBe(OPTIONS.length)
    })
    await userEvent.click(chips()[2])
    await waitFor(async () => {
      await expect(chips().length).toBe(1)
    })
    await expect(chips()[0].textContent).toContain(LABELS[OPTIONS[2]])
  },
}

export const AlwaysExpanded: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<Category | "">("hobby")
    return (
      <div className="p-4 max-w-md">
        <CollapsibleChipField<Category>
          label="比較表示"
          options={OPTIONS}
          selected={selected}
          onSelect={setSelected}
          onClear={() => setSelected("")}
          getLabel={(k) => LABELS[k]}
          alwaysExpanded
        />
      </div>
    )
  },
}

/**
 * Dialog 内での Escape（issue #419 レビュー指摘の回帰テスト）。
 * Radix Dialog は document capture で Escape を拾うため、対策無しだと
 * 「チップ行を畳む」と「Dialog が閉じる」が同時に起きる。展開中の Escape は
 * 行を畳むだけで Dialog は開いたまま、もう一度 Escape で Dialog が閉じる。
 */
export const EscapeInsideDialog: Story = {
  tags: ["interaction"],
  render: () => {
    const [selected, setSelected] = React.useState<Category | "">("work")
    return (
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>カテゴリを選択</DialogTitle>
          <CollapsibleChipField<Category>
            icon={<span aria-hidden="true">{"\u{1F3F7}"}</span>}
            ariaLabel="カテゴリ"
            options={OPTIONS}
            selected={selected}
            onSelect={setSelected}
            getLabel={(k) => LABELS[k]}
          />
        </DialogContent>
      </Dialog>
    )
  },
  play: async () => {
    const dialog = () => document.querySelector('[role="dialog"]')
    const chips = () => [
      ...document.querySelectorAll<HTMLButtonElement>('button[data-slot="chip"]'),
    ]
    await waitFor(async () => {
      await expect(dialog()).not.toBeNull()
    })

    // 展開してから Escape → 行が畳まれるだけで Dialog は開いたまま
    await userEvent.click(chips()[0])
    await waitFor(async () => {
      await expect(chips().length).toBe(OPTIONS.length)
    })
    await userEvent.keyboard("{Escape}")
    await waitFor(async () => {
      await expect(chips().length).toBe(1)
    })
    await expect(dialog()).not.toBeNull()

    // 畳まれた状態でもう一度 Escape → 今度は Dialog が閉じる
    await userEvent.keyboard("{Escape}")
    await waitFor(async () => {
      await expect(dialog()).toBeNull()
    })
  },
}
