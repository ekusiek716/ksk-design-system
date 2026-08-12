/**
 * @vitest-environment jsdom
 *
 * DialogTitle / SheetTitle の `level`（Issue #341）
 *
 * 1. マッピング契約: TITLE_LEVEL_TYPO が contracts/composition.json の
 *    textHierarchy.tree と一致すること。typo 値はここにハードコードせず、
 *    JSON を実際に読んで突き合わせる（二重管理を避けるため）。
 * 2. 既定の解決: 全画面級サーフェス配下だけ画面タイトル相当に上がり、
 *    それ以外は従来どおり typo-heading-lg のままであること（非破壊）。
 * 3. 明示 level が常に文脈より優先されること。
 *
 * 実行: npm run test
 */
import { describe, it, expect, afterEach } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import * as React from "react"
import { readFileSync } from "node:fs"

import { Dialog, DialogContent, DialogTitle } from "../src/components/ui/dialog"
import { Sheet, SheetContent, SheetTitle } from "../src/components/ui/sheet"
import { BottomSheetFrame } from "../src/components/patterns/bottom-sheet-frame"
import {
  TITLE_LEVEL_TYPO,
  TITLE_LEVEL_COMPOSITION_ROLE,
  DIALOG_TITLE_DEFAULT_TYPO,
  type TitleLevel,
} from "../src/lib/title-level"

// 他の contract テスト（screen-contracts.test.ts）と同じくリポジトリルート相対で読む。
const composition = JSON.parse(
  readFileSync("contracts/composition.json", "utf8")
) as {
  textHierarchy: { tree: { role: string; typo: string }[] }
}

let container: HTMLElement | null = null
let root: Root | null = null

function mount(ui: React.ReactElement) {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => {
    root!.render(ui)
  })
}

afterEach(() => {
  if (root) {
    act(() => {
      root!.unmount()
    })
    root = null
  }
  if (container) {
    container.remove()
    container = null
  }
  document.body.innerHTML = ""
})

function titleClass(slot: "dialog-title" | "sheet-title"): string {
  const el = document.querySelector<HTMLElement>(`[data-slot="${slot}"]`)
  expect(el).not.toBeNull()
  return el!.className
}

describe("TitleLevel ↔ contracts/composition.json（#341）", () => {
  const levels = Object.keys(TITLE_LEVEL_TYPO) as TitleLevel[]

  it.each(levels)("level=%s の typo が composition.json の規定と一致する", (level) => {
    const role = TITLE_LEVEL_COMPOSITION_ROLE[level]
    const entry = composition.textHierarchy.tree.find((e) => e.role === role)
    expect(entry, `composition.json に role "${role}" が見つからない`).toBeDefined()
    expect(TITLE_LEVEL_TYPO[level]).toBe(entry!.typo)
  })

  it("composition.json の見出し3役（H1/H2/H3）をすべて覆っている", () => {
    const mappedRoles = Object.values(TITLE_LEVEL_COMPOSITION_ROLE)
    const headingRoles = composition.textHierarchy.tree
      .map((e) => e.role)
      .filter((role) => /H[123]$/.test(role))
    expect([...headingRoles].sort()).toEqual([...mappedRoles].sort())
  })
})

describe("DialogTitle の既定サイズ（#341）", () => {
  it("position=\"fullscreen\" 配下では画面タイトル（H1）相当になる", () => {
    mount(
      <Dialog open>
        <DialogContent position="fullscreen" description="desc">
          <DialogTitle>タイトル</DialogTitle>
        </DialogContent>
      </Dialog>
    )
    expect(titleClass("dialog-title")).toContain(TITLE_LEVEL_TYPO.page)
  })

  it("中央ダイアログ（既定）では従来の見た目を保つ（非破壊）", () => {
    mount(
      <Dialog open>
        <DialogContent description="desc">
          <DialogTitle>タイトル</DialogTitle>
        </DialogContent>
      </Dialog>
    )
    const className = titleClass("dialog-title")
    expect(className).toContain(DIALOG_TITLE_DEFAULT_TYPO)
    expect(className).not.toContain(TITLE_LEVEL_TYPO.page)
  })

  it("明示した level は文脈より優先される", () => {
    mount(
      <Dialog open>
        <DialogContent position="fullscreen" description="desc">
          <DialogTitle level="card">タイトル</DialogTitle>
        </DialogContent>
      </Dialog>
    )
    const className = titleClass("dialog-title")
    expect(className).toContain(TITLE_LEVEL_TYPO.card)
    expect(className).not.toContain(TITLE_LEVEL_TYPO.page)
  })

  it("全画面 Dialog の中に開いた中央ダイアログは文脈を引き継がない", () => {
    mount(
      <Dialog open>
        <DialogContent position="fullscreen" description="outer">
          <Dialog open>
            <DialogContent description="inner">
              <DialogTitle>内側</DialogTitle>
            </DialogContent>
          </Dialog>
        </DialogContent>
      </Dialog>
    )
    const inner = Array.from(
      document.querySelectorAll<HTMLElement>('[data-slot="dialog-title"]')
    )
    expect(inner).toHaveLength(1)
    expect(inner[0].className).toContain(DIALOG_TITLE_DEFAULT_TYPO)
  })
})

describe("SheetTitle の既定サイズ（#341）", () => {
  it("部分表示シート（既定）では従来の見た目を保つ（非破壊）", () => {
    mount(
      <Sheet open>
        <SheetContent side="bottom" description="desc">
          <SheetTitle>タイトル</SheetTitle>
        </SheetContent>
      </Sheet>
    )
    const className = titleClass("sheet-title")
    expect(className).toContain(DIALOG_TITLE_DEFAULT_TYPO)
    expect(className).not.toContain(TITLE_LEVEL_TYPO.page)
  })

  it.each(["mobile-full", "mobile-page"] as const)(
    "BottomSheetFrame preset=%s 配下では画面タイトル（H1）相当になる",
    (preset) => {
      mount(
        <Sheet open>
          <BottomSheetFrame preset={preset} description="desc">
            <SheetTitle>タイトル</SheetTitle>
          </BottomSheetFrame>
        </Sheet>
      )
      expect(titleClass("sheet-title")).toContain(TITLE_LEVEL_TYPO.page)
    }
  )

  it.each(["mobile-form", "desktop-floating"] as const)(
    "BottomSheetFrame preset=%s は部分表示なので既定を変えない",
    (preset) => {
      mount(
        <Sheet open>
          <BottomSheetFrame preset={preset} description="desc">
            <SheetTitle>タイトル</SheetTitle>
          </BottomSheetFrame>
        </Sheet>
      )
      expect(titleClass("sheet-title")).toContain(DIALOG_TITLE_DEFAULT_TYPO)
    }
  )

  it("明示した level は文脈より優先される", () => {
    mount(
      <Sheet open>
        <BottomSheetFrame preset="mobile-full" description="desc">
          <SheetTitle level="section">タイトル</SheetTitle>
        </BottomSheetFrame>
      </Sheet>
    )
    const className = titleClass("sheet-title")
    expect(className).toContain(TITLE_LEVEL_TYPO.section)
    expect(className).not.toContain(TITLE_LEVEL_TYPO.page)
  })
})
