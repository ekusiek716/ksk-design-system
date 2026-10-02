/**
 * P052 — DS 部品の className での「形」（角丸・高さ・左右 padding）の上書き
 *
 * belle-todo（2026-10-01）で Button / 入力欄に部品単位で rounded-* / h-* / px-* を被せ、
 * 同じ画面で形が揃わなくなっていた件の再発防止。誤検知を出さない方を優先する
 * （DS から import した部品・className の文字列リテラル・unstyled 以外）ことも固定する。
 */
import { describe, expect, it } from "vitest"
import { mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { spawnSync } from "node:child_process"

import { inspectDsShapeOverrides } from "../bin/ds-shape-override.js"

function lint(jsx: string, imports = `import { Button, Input, Textarea, Skeleton, DateField, Chip, SelectTrigger } from "ksk-design-system"`) {
  return inspectDsShapeOverrides(
    `
${imports}
const cn = (...a: unknown[]) => a.filter(Boolean).join(" ")
export function Example(props: { open: boolean; cls: string }) {
  return (
    <div>
${jsx}
    </div>
  )
}
`,
    "Example.tsx",
  )
}

describe("P052 ds-shape-override: 検出する", () => {
  it.each([
    ["Button の角丸", `<Button className="w-full rounded-2xl">保存</Button>`, "rounded-2xl"],
    ["Button の角丸（cn() の条件付きリテラル）", `<Button className={cn("w-full", props.open && "rounded-lg")}>保存</Button>`, "rounded-lg"],
    ["Button の角丸（テンプレートの固定部分）", "<Button className={`mt-2 rounded-lg ${props.cls}`}>保存</Button>", "rounded-lg"],
    ["Button の高さ", `<Button size="icon" className="h-12 w-12">+</Button>`, "h-12"],
    ["Input の高さ・角丸・左右 padding", `<Input className="w-full h-12 rounded-2xl px-4" />`, "h-12 rounded-2xl px-4"],
    ["Input の片側 padding", `<Input className="pl-8" />`, "pl-8"],
    ["Textarea の角丸", `<Textarea className="rounded-2xl" />`, "rounded-2xl"],
    ["DateField の子セレクタ経由の角丸", `<DateField value="" onChange={() => {}} className="[&>button]:rounded-2xl" />`, "[&>button]:rounded-2xl"],
    ["SelectTrigger の右 padding", `<SelectTrigger className="pr-2" />`, "pr-2"],
    ["Chip の角丸（バリアント接頭辞付き）", `<Chip className="md:rounded-lg">a</Chip>`, "md:rounded-lg"],
    ["Skeleton の角丸", `<Skeleton className="h-16 w-full rounded-lg" />`, "rounded-lg"],
  ])("%s", (_label, jsx, classes) => {
    const findings = lint(jsx)
    expect(findings).toHaveLength(1)
    expect(findings[0].classes.join(" ")).toBe(classes)
  })

  it("Skeleton は rounded prop を案内する", () => {
    const [finding] = lint(`<Skeleton className="rounded-lg" />`)
    expect(finding.detail).toContain("rounded prop")
  })

  it("別名 import（Button as Btn）とサブパス import も追う", () => {
    const findings = lint(`<Btn className="rounded-lg" />`, `import { Button as Btn } from "ksk-design-system/ui"`)
    expect(findings).toHaveLength(1)
    expect(findings[0].tag).toBe("Button")
  })

  it("複数行のタグでも行番号は開きタグの位置", () => {
    const [finding] = lint(`      <Button\n        size="lg"\n        className="rounded-2xl"\n      >保存</Button>`)
    // テンプレートの 7 行目が開きタグ（1 行目は空行）
    expect(finding.line).toBe(7)
  })
})

describe("P052 ds-shape-override: 検出しない", () => {
  it.each([
    ["unstyled の Button（タイル等の素のボタン）", `<Button unstyled className="rounded-lg p-4">x</Button>`],
    ["unstyled の Input（枠なしインライン編集）", `<Input unstyled className="min-h-[40px] px-0" />`],
    ["unstyled={cond}（判定できない式）", `<Input unstyled={props.open} className="h-10" />`],
    ["レイアウト用の高さ", `<Textarea className="h-auto min-h-0 w-full" />`],
    ["形以外のクラス（余白・色・幅）", `<Button className="mt-2 w-full gap-2 text-[var(--Brand-Primary)]">x</Button>`],
    ["縦の padding（px 以外）", `<Input className="py-2" />`],
    ["変数経由のクラス（追えない）", `<Button className={props.cls}>x</Button>`],
    ["DS 以外から import した同名部品", `<Button className="rounded-2xl">x</Button>`],
  ])("%s", (label, jsx) => {
    const imports =
      label === "DS 以外から import した同名部品"
        ? `import { Button } from "./my-button"`
        : undefined
    expect(lint(jsx, imports)).toEqual([])
  })

  it("DS の import が無いファイルは何もしない", () => {
    expect(inspectDsShapeOverrides(`export const X = () => <div className="rounded-2xl" />`, "X.tsx")).toEqual([])
  })
})

describe("P052 公開 CLI", () => {
  function runPublicLint(source: string) {
    const dir = mkdtempSync(join(tmpdir(), "ksk-ds-p052-"))
    const file = join(dir, "Example.tsx")
    writeFileSync(file, source)
    return spawnSync("node", [join(process.cwd(), "bin/init.js"), "lint", file], { cwd: dir, encoding: "utf8" })
  }

  it("warning P052 として部品名とクラスを添えて報告する", () => {
    const result = runPublicLint(`
      import { Button } from "ksk-design-system"
      export function Example() {
        return <Button className="w-full rounded-2xl">保存</Button>
      }
    `)
    expect(result.status).toBe(0)
    expect(result.stdout).toContain("warning P052")
    expect(result.stdout).toContain("<Button> rounded-2xl")
  })

  it("ksk-ds-lint-ignore P052 -- 理由 で外せる", () => {
    const result = runPublicLint(`
      import { Button } from "ksk-design-system"
      export function Example() {
        return (
          // ksk-ds-lint-ignore P052 -- ボタンではなく押せるカードとして使っている
          <Button className="min-h-24 rounded-lg">x</Button>
        )
      }
    `)
    expect(result.status).toBe(0)
    expect(result.stdout).not.toContain("P052")
  })
})
