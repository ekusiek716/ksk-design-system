/**
 * @vitest-environment jsdom
 *
 * PortalContainerProvider（issue #360）
 *
 * 段階導入で「テーマを当てたサブツリー」の中にだけ DS を置くと、Portal 系は
 * document.body 直下へ出るためスコープの CSS 変数を継承できない。Provider は
 * その描画先をまとめて指定するための口。ここで固定するのは次の3点:
 *
 *   1. Provider が無ければ従来どおり document.body（完全後方互換）
 *   2. Provider があれば配下の Portal はそのスコープ内へ描画される
 *   3. 明示 container（SheetContent.container 等）は Provider より優先される
 *
 * jsdom はレイアウトも var() のカスケードも解決しないので、ここで見るのは
 * 「どこに描画されたか」という DOM の位置だけ。実際の色の継承は Storybook の
 * interaction ストーリー（portal-container.stories.tsx）が押さえる。
 */
import { describe, it, expect, afterEach } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import * as React from "react"

import { PortalContainerProvider, usePortalContainer } from "../src/components/ui/portal-container"
import { Dialog, DialogContent, DialogTitle } from "../src/components/ui/dialog"
import { AlertDialog, AlertDialogContent, AlertDialogTitle } from "../src/components/ui/alert-dialog"
import { Sheet, SheetContent, SheetTitle } from "../src/components/ui/sheet"
import { Popover, PopoverContent, PopoverTrigger } from "../src/components/ui/popover"
import { Tooltip, TooltipContent, TooltipTrigger } from "../src/components/ui/tooltip"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../src/components/ui/hover-card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../src/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger } from "../src/components/ui/select"

let host: HTMLElement | null = null
let root: Root | null = null

function render(ui: React.ReactElement) {
  host = document.createElement("div")
  document.body.appendChild(host)
  root = createRoot(host)
  act(() => {
    root!.render(ui)
  })
}

afterEach(() => {
  act(() => {
    root?.unmount()
  })
  root = null
  host?.remove()
  host = null
})

/** data-slot の要素が「どの要素の配下に描画されたか」を返す。 */
function portalHostOf(slot: string): HTMLElement | null {
  const el = document.querySelector<HTMLElement>(`[data-slot="${slot}"]`)
  if (!el) return null
  // Radix Portal は container 直下に <div> を1枚挟む。
  let node: HTMLElement | null = el
  while (node?.parentElement && node.parentElement !== document.body) {
    node = node.parentElement
    if (node.dataset.portalScope !== undefined) return node
  }
  return document.body
}

function Scope({ children }: { children: React.ReactNode }) {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null)
  return (
    <div ref={setContainer} data-portal-scope="">
      <PortalContainerProvider container={container}>{children}</PortalContainerProvider>
    </div>
  )
}

const openPortals: Array<[string, string, React.ReactElement]> = [
  [
    "Dialog",
    "dialog-content",
    <Dialog defaultOpen>
      <DialogContent>
        <DialogTitle>タイトル</DialogTitle>
      </DialogContent>
    </Dialog>,
  ],
  [
    "AlertDialog",
    "alert-dialog-content",
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogTitle>タイトル</AlertDialogTitle>
      </AlertDialogContent>
    </AlertDialog>,
  ],
  [
    "Sheet",
    "sheet-content",
    <Sheet defaultOpen>
      <SheetContent>
        <SheetTitle>タイトル</SheetTitle>
      </SheetContent>
    </Sheet>,
  ],
  [
    "Popover",
    "popover-content",
    <Popover defaultOpen>
      <PopoverTrigger>開く</PopoverTrigger>
      <PopoverContent>内容</PopoverContent>
    </Popover>,
  ],
  [
    "Tooltip",
    "tooltip-content",
    <Tooltip defaultOpen>
      <TooltipTrigger>開く</TooltipTrigger>
      <TooltipContent>内容</TooltipContent>
    </Tooltip>,
  ],
  [
    "HoverCard",
    "hover-card-content",
    <HoverCard defaultOpen>
      <HoverCardTrigger>開く</HoverCardTrigger>
      <HoverCardContent>内容</HoverCardContent>
    </HoverCard>,
  ],
  [
    "DropdownMenu",
    "dropdown-menu-content",
    <DropdownMenu defaultOpen modal={false}>
      <DropdownMenuTrigger>開く</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>項目</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>,
  ],
  [
    "Select",
    "select-content",
    <Select defaultOpen defaultValue="a">
      <SelectTrigger aria-label="選択" />
      <SelectContent>
        <SelectItem value="a">A</SelectItem>
      </SelectContent>
    </Select>,
  ],
]

describe("Provider 無し — 従来どおり document.body（後方互換）", () => {
  it.each(openPortals)("%s は document.body へ描画される", (_name, slot, ui) => {
    render(ui)
    expect(document.querySelector(`[data-slot="${slot}"]`)).not.toBeNull()
    expect(portalHostOf(slot)).toBe(document.body)
  })
})

describe("Provider あり — スコープ内へ描画される", () => {
  it.each(openPortals)("%s はスコープ配下へ描画される", (_name, slot, ui) => {
    render(<Scope>{ui}</Scope>)
    const scope = document.querySelector<HTMLElement>("[data-portal-scope]")
    const content = document.querySelector<HTMLElement>(`[data-slot="${slot}"]`)
    expect(scope).not.toBeNull()
    expect(content).not.toBeNull()
    expect(scope!.contains(content!)).toBe(true)
  })
})

describe("明示 container の優先", () => {
  it("SheetContent.container は Provider より優先される（既存挙動は不変）", () => {
    const explicit = document.createElement("div")
    explicit.setAttribute("data-explicit-container", "")
    document.body.appendChild(explicit)

    render(
      <Scope>
        <Sheet defaultOpen>
          <SheetContent container={explicit}>
            <SheetTitle>タイトル</SheetTitle>
          </SheetContent>
        </Sheet>
      </Scope>
    )

    const content = document.querySelector<HTMLElement>('[data-slot="sheet-content"]')
    const scope = document.querySelector<HTMLElement>("[data-portal-scope]")
    expect(content).not.toBeNull()
    expect(explicit.contains(content!)).toBe(true)
    expect(scope!.contains(content!)).toBe(false)

    explicit.remove()
  })
})

describe("usePortalContainer の解決順", () => {
  function Probe({ explicit, onResolve }: { explicit?: Element | null; onResolve: (v: unknown) => void }) {
    onResolve(usePortalContainer(explicit))
    return null
  }

  it("明示 undefined のときだけ context を参照する", () => {
    const scope = document.createElement("div")
    const values: unknown[] = []
    render(
      <PortalContainerProvider container={scope}>
        <Probe onResolve={(v) => values.push(v)} />
      </PortalContainerProvider>
    )
    expect(values[0]).toBe(scope)
  })

  it("明示 null は「既定先を使う」指定として context より優先される", () => {
    const scope = document.createElement("div")
    const values: unknown[] = []
    render(
      <PortalContainerProvider container={scope}>
        <Probe explicit={null} onResolve={(v) => values.push(v)} />
      </PortalContainerProvider>
    )
    expect(values[0]).toBeNull()
  })

  it("Provider が無ければ undefined（＝各 Portal の既定先）", () => {
    const values: unknown[] = []
    render(<Probe onResolve={(v) => values.push(v)} />)
    expect(values[0]).toBeUndefined()
  })
})
