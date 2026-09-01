/**
 * 旧 Radix（belle-todo が実際に解決していた版）での回帰テスト（issue #516）。
 *
 * `npm test` が掴む Radix は ref churn 修正済みなので、#516 の
 * `Maximum update depth exceeded` は DS 側のテストでは原理的に再現しない。
 * この project だけは `vitest.legacy-radix.config.ts` の alias で
 * radix-ui@1.4.3（focus-scope@1.1.7 / compose-refs@1.1.2 / presence@1.1.5 /
 * dismissable-layer@1.1.11）を掴み、当時の consumer と同じ条件で
 * PC 幅（lg≥1024px）の中央モーダルを描画する。
 *
 * 実行: `npm run test:legacy-radix`（fixture の install ごと面倒を見る）
 */
import { readFileSync } from "node:fs"
import { join } from "node:path"

import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { Dialog as RadixDialog } from "radix-ui"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../../src/components/ui/dialog"
import { ResponsiveDialog } from "../../src/components/ui/responsive-dialog"
import { ResponsiveOverlayFrame } from "../../src/components/patterns/responsive-overlay-frame"
import { LEGACY_FIXTURE_DIR, LEGACY_PINS } from "../../scripts/radix-ref-churn.mjs"

/** 旧 Radix が churn する条件を満たしていた版（この組み合わせで #516 が出た）。 */
const EXPECTED_LEGACY_SUBPACKAGES = {
  "@radix-ui/react-focus-scope": "1.1.7",
  "@radix-ui/react-dismissable-layer": "1.1.11",
  "@radix-ui/react-presence": "1.1.5",
  "@radix-ui/react-compose-refs": "1.1.2",
}

const fixtureVersion = (name: string) =>
  JSON.parse(
    readFileSync(join(process.cwd(), LEGACY_FIXTURE_DIR, "node_modules", name, "package.json"), "utf8"),
  ).version as string

/** viewport 幅を px で与え、matchMedia を `(min-width: Npx)` に応答させる。 */
function stubViewport(width: number) {
  vi.stubGlobal("matchMedia", (query: string) => {
    const match = /min-width:\s*(\d+(?:\.\d+)?)px/.exec(query)
    const min = match ? Number(match[1]) : Number.POSITIVE_INFINITY
    return {
      matches: width >= min,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }
  })
}

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.unstubAllGlobals()
})

describe("旧 Radix fixture の前提", () => {
  // ここが緑でないと、以下のテストは「修正済み Radix で回った」だけの
  // 無意味な緑になる。install の取り違えをここで落とす。
  it.each(Object.entries(LEGACY_PINS))("%s は %s である", (name, version) => {
    expect(fixtureVersion(name)).toBe(version)
  })

  it.each(Object.entries(EXPECTED_LEGACY_SUBPACKAGES))(
    "%s は churn する %s である",
    (name, version) => {
      expect(fixtureVersion(name)).toBe(version)
    },
  )

  it("実際に読み込まれた Radix が ref chain を毎 render 付け替える", () => {
    // ディスク上の版だけでは「alias が効いていて、その旧 Radix が本当に
    // 読み込まれた」ことを保証できない。安定した ref を Radix の
    // `Dialog.Content` に直接渡し、再 render で attach し直されるかを見る。
    // 修正済み Radix なら attach は 1 回きり（＝この期待値が外れたら
    // alias が効いていない）。
    let attachCount = 0

    function AttachProbe() {
      const [, setTick] = React.useState(0)
      const stableRef = React.useCallback((node: HTMLDivElement | null) => {
        if (node) attachCount += 1
      }, [])
      React.useEffect(() => {
        setTick(1)
      }, [])
      return (
        <RadixDialog.Root open>
          <RadixDialog.Portal>
            <RadixDialog.Content ref={stableRef} aria-describedby={undefined}>
              <RadixDialog.Title>タイトル</RadixDialog.Title>
            </RadixDialog.Content>
          </RadixDialog.Portal>
        </RadixDialog.Root>
      )
    }

    act(() => root.render(<AttachProbe />))
    expect(attachCount).toBeGreaterThan(1)
  })
})

describe("ResponsiveOverlayFrame — 旧 Radix の PC 幅描画（#516）", () => {
  it("中央モーダルが無限ループせずに描画される", () => {
    stubViewport(1024)
    // 修正前（#492 の世代カウンタ）はここで
    // "Maximum update depth exceeded" になる。
    expect(() =>
      act(() =>
        root.render(
          <ResponsiveDialog open onOpenChange={() => {}} breakpoint="lg">
            <ResponsiveOverlayFrame description="テスト" preset="mobile-form">
              <input data-testid="field" />
            </ResponsiveOverlayFrame>
          </ResponsiveDialog>,
        ),
      ),
    ).not.toThrow()

    const el = document.querySelector<HTMLElement>('[data-slot="dialog-content"]')
    expect(el).not.toBeNull()
    expect(el?.querySelector('[data-testid="field"]')).not.toBeNull()
  })

  it("consumer の ref が毎 render 変わっても収束する", () => {
    stubViewport(1024)
    function ChurningConsumer() {
      const [, setTick] = React.useState(0)
      React.useEffect(() => {
        // マウント直後に 1 回だけ再 render させ、identity 変化を必ず起こす。
        setTick(1)
      }, [])
      return (
        <ResponsiveDialog open onOpenChange={() => {}} breakpoint="lg">
          <ResponsiveOverlayFrame
            description="テスト"
            preset="mobile-form"
            // 毎 render 新しい関数（安定化してはいけない）。
            ref={(node: HTMLDivElement | null) => void node}
          >
            <input data-testid="field" />
          </ResponsiveOverlayFrame>
        </ResponsiveDialog>
      )
    }

    expect(() => act(() => root.render(<ChurningConsumer />))).not.toThrow()
    expect(document.querySelector('[data-slot="dialog-content"]')).not.toBeNull()
  })

  it("モバイル幅（Sheet 経路）も描画できる", () => {
    stubViewport(390)
    expect(() =>
      act(() =>
        root.render(
          <ResponsiveDialog open onOpenChange={() => {}} breakpoint="lg">
            <ResponsiveOverlayFrame description="テスト" preset="mobile-form">
              <input data-testid="field" />
            </ResponsiveOverlayFrame>
          </ResponsiveDialog>,
        ),
      ),
    ).not.toThrow()
    expect(document.querySelector('[data-testid="field"]')).not.toBeNull()
  })
})

describe("DialogContent — 旧 Radix の描画（#516）", () => {
  it("consumer の object ref が面の DOM を掴む", () => {
    const consumerRef = React.createRef<HTMLDivElement>()
    expect(() =>
      act(() =>
        root.render(
          <Dialog open onOpenChange={() => {}}>
            <DialogContent ref={consumerRef}>
              <DialogTitle>タイトル</DialogTitle>
              <DialogDescription>説明</DialogDescription>
            </DialogContent>
          </Dialog>,
        ),
      ),
    ).not.toThrow()

    expect(consumerRef.current).toBe(document.querySelector('[data-slot="dialog-content"]'))
  })
})
