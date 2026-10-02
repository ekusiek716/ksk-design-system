import { describe, expect, it } from "vitest"
import { inspectOverlayFooterPadding } from "../bin/overlay-footer-padding.js"

// P051（issue #619）: ResponsiveOverlayFrame（plain / float 系）の中に
// ResponsiveOverlayFooter があるのに padding={false} が無いケースの検出。
function lint(jsx: string) {
  return inspectOverlayFooterPadding(
    `
import { ResponsiveOverlayFrame, ResponsiveOverlayFooter, Button } from "ksk-design-system"
export function Example(props: any) {
  const cond = props.cond
  return (
${jsx}
  )
}
`,
    "Example.tsx",
  )
}

describe("P051 overlay-footer-padding: 検出する", () => {
  it.each([
    ['side="float"', `<ResponsiveOverlayFrame side="float" description="d"><div>本文</div><ResponsiveOverlayFooter><Button>OK</Button></ResponsiveOverlayFooter></ResponsiveOverlayFrame>`],
    ['side="float-glass"', `<ResponsiveOverlayFrame side="float-glass"><ResponsiveOverlayFooter><Button>OK</Button></ResponsiveOverlayFooter></ResponsiveOverlayFrame>`],
    ['side={"float"}', `<ResponsiveOverlayFrame side={"float"}><ResponsiveOverlayFooter><Button>OK</Button></ResponsiveOverlayFooter></ResponsiveOverlayFrame>`],
    ['preset="plain"', `<ResponsiveOverlayFrame preset="plain"><ResponsiveOverlayFooter><Button>OK</Button></ResponsiveOverlayFooter></ResponsiveOverlayFrame>`],
    ['side="bottom" preset="plain"', `<ResponsiveOverlayFrame side="bottom" preset="plain"><ResponsiveOverlayFooter><Button>OK</Button></ResponsiveOverlayFooter></ResponsiveOverlayFrame>`],
    ["padding={true}", `<ResponsiveOverlayFrame side="float" padding={true}><ResponsiveOverlayFooter><Button>OK</Button></ResponsiveOverlayFooter></ResponsiveOverlayFrame>`],
    ["値なしの padding", `<ResponsiveOverlayFrame side="float" padding><ResponsiveOverlayFooter><Button>OK</Button></ResponsiveOverlayFooter></ResponsiveOverlayFrame>`],
    ["深い子孫（条件分岐の中）", `<ResponsiveOverlayFrame side="float"><div><section>{cond && <ResponsiveOverlayFooter><Button>OK</Button></ResponsiveOverlayFooter>}</section></div></ResponsiveOverlayFrame>`],
    ["子孫の属性値（DetailSheetScaffold の footer）", `<ResponsiveOverlayFrame preset="plain"><DetailSheetScaffold footer={<ResponsiveOverlayFooter><Button>OK</Button></ResponsiveOverlayFooter>}>本文</DetailSheetScaffold></ResponsiveOverlayFrame>`],
    ["名前空間 import（DS.ResponsiveOverlayFrame）", `<DS.ResponsiveOverlayFrame side="float"><DS.ResponsiveOverlayFooter><Button>OK</Button></DS.ResponsiveOverlayFooter></DS.ResponsiveOverlayFrame>`],
  ])("%s", (_label, jsx) => {
    const findings = lint(jsx)
    expect(findings).toHaveLength(1)
    expect(findings[0]?.tag).toBe("ResponsiveOverlayFrame")
  })

  it("Frame の開始タグの行を報告する", () => {
    const findings = inspectOverlayFooterPadding(
      [
        "export const A = () => (",
        '  <ResponsiveOverlayFrame side="float">',
        "    <ResponsiveOverlayFooter>OK</ResponsiveOverlayFooter>",
        "  </ResponsiveOverlayFrame>",
        ")",
      ].join("\n"),
    )
    expect(findings).toEqual([{ line: 2, tag: "ResponsiveOverlayFrame" }])
  })
})

describe("P051 overlay-footer-padding: 誤検知しない", () => {
  it.each([
    ["padding={false}", `<ResponsiveOverlayFrame side="float" padding={false}><ResponsiveOverlayFooter><Button>OK</Button></ResponsiveOverlayFooter></ResponsiveOverlayFrame>`],
    ["preset=plain + padding={false}", `<ResponsiveOverlayFrame preset="plain" padding={false}><ResponsiveOverlayFooter><Button>OK</Button></ResponsiveOverlayFooter></ResponsiveOverlayFrame>`],
    ["padding={cond}（式）", `<ResponsiveOverlayFrame side="float" padding={cond}><ResponsiveOverlayFooter><Button>OK</Button></ResponsiveOverlayFooter></ResponsiveOverlayFrame>`],
    ["spread props（padding が来うる）", `<ResponsiveOverlayFrame side="float" {...props}><ResponsiveOverlayFooter><Button>OK</Button></ResponsiveOverlayFooter></ResponsiveOverlayFrame>`],
    ["Footer を別コンポーネントに切り出し", `<ResponsiveOverlayFrame side="float"><MyFooter /></ResponsiveOverlayFrame>`],
    ["Footer が無い float", `<ResponsiveOverlayFrame side="float"><div>本文</div></ResponsiveOverlayFrame>`],
    ["preset 経路（mobile-form・BottomSheetFrame 経由）", `<ResponsiveOverlayFrame preset="mobile-form"><ResponsiveOverlayFooter><Button>OK</Button></ResponsiveOverlayFooter></ResponsiveOverlayFrame>`],
    ["preset 省略（既定 mobile-form）", `<ResponsiveOverlayFrame description="d"><ResponsiveOverlayFooter><Button>OK</Button></ResponsiveOverlayFooter></ResponsiveOverlayFrame>`],
    ["side が式", `<ResponsiveOverlayFrame side={cond ? "float" : "bottom"}><ResponsiveOverlayFooter><Button>OK</Button></ResponsiveOverlayFooter></ResponsiveOverlayFrame>`],
    ["preset が式", `<ResponsiveOverlayFrame preset={props.preset}><ResponsiveOverlayFooter><Button>OK</Button></ResponsiveOverlayFooter></ResponsiveOverlayFrame>`],
    ["Footer が Frame の外", `<><ResponsiveOverlayFrame side="float"><div>本文</div></ResponsiveOverlayFrame><ResponsiveOverlayFooter>OK</ResponsiveOverlayFooter></>`],
  ])("%s", (_label, jsx) => {
    expect(lint(jsx)).toEqual([])
  })

  it("入れ子の Frame の Footer は外側の Frame に数えない", () => {
    const findings = lint(
      `<ResponsiveOverlayFrame side="float"><div>外側</div><ResponsiveOverlayFrame preset="mobile-form"><ResponsiveOverlayFooter>OK</ResponsiveOverlayFooter></ResponsiveOverlayFrame></ResponsiveOverlayFrame>`,
    )
    expect(findings).toEqual([])
  })

  it("コメントや文字列の中の JSX 風テキストは対象外", () => {
    const findings = inspectOverlayFooterPadding(`
// <ResponsiveOverlayFrame side="float"><ResponsiveOverlayFooter /></ResponsiveOverlayFrame>
export const doc = '<ResponsiveOverlayFrame side="float"><ResponsiveOverlayFooter /></ResponsiveOverlayFrame>'
`)
    expect(findings).toEqual([])
  })
})
