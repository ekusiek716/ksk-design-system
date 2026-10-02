import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { ResponsiveDialog } from "../src/native/components/ResponsiveDialog"
import { ThemeProvider } from "../src/native/theme/ThemeProvider"
import { scales } from "../src/tokens/native"

// RN hosts are replaced with plain elements so the markup shows the real
// nesting and the gap each View receives (issue #604).
const hosts = vi.hoisted(() => ({ width: 402 }))
vi.mock("react-native", () => ({
  Dimensions: { get: () => ({ width: hosts.width, height: 874 }) },
  Modal: ({ children }: { children: React.ReactNode }) => children,
  Pressable: ({ children }: { children: React.ReactNode }) => children,
  View: ({ children, style }: { children: React.ReactNode; style?: { gap?: number } }) => (
    <div data-gap={style?.gap}>{children}</div>
  ),
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}))
vi.mock("../src/native/components/Sheet", () => ({
  Sheet: ({ title, children }: { title?: string; children: React.ReactNode }) => (
    <section data-sheet>
      <h2>{title}</h2>
      {children}
    </section>
  ),
}))

beforeEach(() => {
  hosts.width = 402
})

function render() {
  return renderToStaticMarkup(
    <ThemeProvider>
      <ResponsiveDialog
        open
        onClose={() => {}}
        title="カメラ端末に切り替えますか？"
        description="この端末は見守り側として使えなくなります。"
        footer={
          <>
            <button>キャンセル</button>
            <button>切り替える</button>
          </>
        }
      >
        <p>本文</p>
      </ResponsiveDialog>
    </ThemeProvider>,
  )
}

describe("native ResponsiveDialog — Sheet 分岐 (#604)", () => {
  it("description を表示し、本文とフッターの間・フッター内に余白を取る", () => {
    const html = render()
    expect(html).toContain("data-sheet")
    expect(html).toContain("この端末は見守り側として使えなくなります。")
    const body = scales.spacing.scale[3]
    const footer = scales.spacing.scale[2]
    expect(html).toContain(
      `<div data-gap="${body}"><span>この端末は見守り側として使えなくなります。</span><p>本文</p>` +
        `<div data-gap="${footer}"><button>キャンセル</button><button>切り替える</button></div></div>`,
    )
  })

  it("description / footer が無ければ空の要素を出さない", () => {
    const html = renderToStaticMarkup(
      <ThemeProvider>
        <ResponsiveDialog open onClose={() => {}} title="t">
          <p>本文</p>
        </ResponsiveDialog>
      </ThemeProvider>,
    )
    expect(html).toContain(`<div data-gap="${scales.spacing.scale[3]}"><p>本文</p></div>`)
    expect(html).not.toContain("<span>")
  })

  it("breakpoint を超える幅では Dialog を使う", () => {
    hosts.width = 800
    const html = render()
    expect(html).not.toContain("data-sheet")
    expect(html).toContain("この端末は見守り側として使えなくなります。")
  })
})
