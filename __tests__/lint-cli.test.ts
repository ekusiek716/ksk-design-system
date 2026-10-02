import { describe, expect, it } from "vitest"
import { mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { spawnSync } from "node:child_process"

function runPublicLint(source: string) {
  const dir = mkdtempSync(join(tmpdir(), "ksk-ds-public-lint-"))
  const file = join(dir, "Example.tsx")
  writeFileSync(file, source)
  return spawnSync("node", [join(process.cwd(), "bin/init.js"), "lint", file], {
    cwd: dir,
    encoding: "utf8",
  })
}

describe("ksk-ds lint", () => {
  it("default Card の direct child spacing を P046 として警告する", () => {
    const result = runPublicLint(`
      import { Card } from "ksk-design-system"
      export function Example() {
        return <Card><div className="mt-4">本文</div></Card>
      }
    `)
    expect(result.status).toBe(0)
    expect(result.stdout).toContain("warning P046")
  })

  it("CardContent 内部の spacing を direct child として誤検知しない", () => {
    const result = runPublicLint(`
      import { Card, CardContent } from "ksk-design-system"
      export function Example() {
        return <Card><CardContent><div className="mt-4">本文</div></CardContent></Card>
      }
    `)
    expect(result.status).toBe(0)
    expect(result.stdout).not.toContain("P046")
  })

  it("先頭ではない direct child の spacing も警告する", () => {
    const result = runPublicLint(`
      import { Card, CardHeader, CardContent } from "ksk-design-system"
      export function Example() {
        return (
          <Card>
            <CardHeader>見出し</CardHeader>
            <CardContent className="mb-4">本文</CardContent>
          </Card>
        )
      }
    `)
    expect(result.status).toBe(0)
    expect(result.stdout).toContain("warning P046")
  })

  it("media Card の spacing は警告しない", () => {
    const result = runPublicLint(`
      import { Card } from "ksk-design-system"
      export function Example() {
        return <Card variant="media"><div className="my-4">本文</div></Card>
      }
    `)
    expect(result.status).toBe(0)
    expect(result.stdout).not.toContain("P046")
  })

  it("plain / float の ResponsiveOverlayFrame + Footer で padding={false} が無いと P051 を警告する（issue #619）", () => {
    const result = runPublicLint(`
      import { Button, ResponsiveOverlayFrame, ResponsiveOverlayFooter } from "ksk-design-system"
      export function Example() {
        return (
          <ResponsiveOverlayFrame side="float" description="確認">
            <ResponsiveOverlayFooter><Button>OK</Button></ResponsiveOverlayFooter>
          </ResponsiveOverlayFrame>
        )
      }
    `)
    expect(result.status).toBe(0)
    expect(result.stdout).toContain("warning P051")
  })

  it("focus-visible:outline-none + ring でも P023 を警告する（issue #620 フォローアップ）", () => {
    // 以前は excludeLines: ["focus-visible"] で、まさにこの「outline-none + ring」
    // パターンの行を丸ごと素通りさせていた。forced-colors モードでは ring
    // （box-shadow）も outline-none も効かず枠が完全に消えるため、ring と
    // ペアでも警告する必要がある。
    const result = runPublicLint(`
      export function Example() {
        return <div className="focus-visible:outline-none focus-visible:ring-2">x</div>
      }
    `)
    expect(result.status).toBe(0)
    expect(result.stdout).toContain("warning P023")
  })

  it("前置バリアント付きの outline-none も P023 を検出する（md: / data-[...] / group-focus-visible: / !）", () => {
    const result = runPublicLint(`
      export function Example() {
        return (
          <>
            <div className="md:focus-visible:outline-none">a</div>
            <div className="data-[state=open]:focus-visible:outline-none">b</div>
            <div className="group-focus-visible:outline-none">c</div>
            <div className="!outline-none">d</div>
            <div className="focus:outline-none">e</div>
          </>
        )
      }
    `)
    expect(result.status).toBe(0)
    const matches = result.stdout.match(/warning P023/g) ?? []
    expect(matches).toHaveLength(5)
  })

  it("outline-hidden は P023 を警告しない（forced-colors 対応の正しい指定）", () => {
    const result = runPublicLint(`
      export function Example() {
        return <div className="focus-visible:outline-hidden focus-visible:ring-2">x</div>
      }
    `)
    expect(result.status).toBe(0)
    expect(result.stdout).not.toContain("P023")
  })

  it("padding={false} / 式 / spread props では P051 を出さない（issue #619）", () => {
    const result = runPublicLint(`
      import { Button, ResponsiveOverlayFrame, ResponsiveOverlayFooter } from "ksk-design-system"
      export function Example(props: { cond: boolean }) {
        return (
          <>
            <ResponsiveOverlayFrame side="float" padding={false}>
              <ResponsiveOverlayFooter><Button>OK</Button></ResponsiveOverlayFooter>
            </ResponsiveOverlayFrame>
            <ResponsiveOverlayFrame preset="plain" padding={props.cond}>
              <ResponsiveOverlayFooter><Button>OK</Button></ResponsiveOverlayFooter>
            </ResponsiveOverlayFrame>
            <ResponsiveOverlayFrame side="float-glass" {...props}>
              <ResponsiveOverlayFooter><Button>OK</Button></ResponsiveOverlayFooter>
            </ResponsiveOverlayFrame>
          </>
        )
      }
    `)
    expect(result.status).toBe(0)
    expect(result.stdout).not.toContain("P051")
  })
})
