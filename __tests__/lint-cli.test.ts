import { describe, expect, it } from "vitest"
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs"
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

/**
 * 存在しない検査対象の扱い（issue #833）。
 * 打ち間違い・改名で対象が消えても「違反なし」exit 0 にしない。
 * - 全 target が不在: stderr に警告し exit 1（--strict の有無に関係なく）
 * - 存在と不在の混在: 警告だけ（exit は従来どおり）。--strict のときは exit 1
 * - --format json でも同じ警告（stderr）と終了コード。stdout の JSON に missingTargets
 */
describe("ksk-ds lint — 存在しないパス（issue #833）", () => {
  const CLEAN = `export function Example() {\n  return null\n}\n`

  function runLintIn(args: string[]) {
    const dir = mkdtempSync(join(tmpdir(), "ksk-ds-lint-missing-"))
    mkdirSync(join(dir, "src"))
    writeFileSync(join(dir, "src", "Example.tsx"), CLEAN)
    return spawnSync("node", [join(process.cwd(), "bin/init.js"), "lint", ...args], {
      cwd: dir,
      encoding: "utf8",
    })
  }

  it("存在しないパスを 1 つだけ指定すると stderr に警告して exit 1", () => {
    const result = runLintIn(["srcc"])
    expect(result.stderr).toContain("[ksk-ds lint] 検査対象が見つかりません: srcc")
    expect(result.stdout).not.toContain("違反は見つかりませんでした")
    expect(result.status).toBe(1)
  })

  it("存在しないパスだけなら --strict 付きでも exit 1", () => {
    const result = runLintIn(["srcc", "--strict"])
    expect(result.stderr).toContain("検査対象が見つかりません: srcc")
    expect(result.status).toBe(1)
  })

  it("存在するパスと混在すると警告は出るが exit 0（従来どおり検査は行う）", () => {
    const result = runLintIn(["src", "libb"])
    expect(result.stderr).toContain("[ksk-ds lint] 検査対象が見つかりません: libb")
    expect(result.stderr).not.toContain("見つかりません: src\n")
    expect(result.stdout).toContain("違反は見つかりませんでした")
    expect(result.status).toBe(0)
  })

  it("混在でも --strict なら exit 1", () => {
    const result = runLintIn(["src", "libb", "--strict"])
    expect(result.stderr).toContain("検査対象が見つかりません: libb")
    expect(result.status).toBe(1)
  })

  it("--format json でも警告は stderr、終了コードは同じ、JSON に missingTargets が入る", () => {
    const all = runLintIn(["srcc", "--format", "json"])
    expect(all.stderr).toContain("検査対象が見つかりません: srcc")
    expect(all.status).toBe(1)
    expect(JSON.parse(all.stdout).missingTargets).toEqual(["srcc"])

    const mixed = runLintIn(["src", "libb", "--format", "json"])
    expect(mixed.stderr).toContain("検査対象が見つかりません: libb")
    expect(mixed.status).toBe(0)
    const parsed = JSON.parse(mixed.stdout)
    expect(parsed.missingTargets).toEqual(["libb"])
    expect(parsed.summary.errors).toBe(0)
  })

  it("存在するパスだけ・既定 target（.）は従来どおり exit 0 で警告なし", () => {
    for (const args of [["src"], [], ["src", "--strict"]]) {
      const result = runLintIn(args)
      expect(result.stderr).not.toContain("検査対象が見つかりません")
      expect(result.stdout).toContain("違反は見つかりませんでした")
      expect(result.status).toBe(0)
    }
  })
})
