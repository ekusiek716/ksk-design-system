import { describe, expect, it } from "vitest"
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { spawnSync } from "node:child_process"

// issue #388 / #389 / #390 の誤検知バグ修正の回帰テスト。
// 既存の __tests__/consumer-lint-cli.test.ts と同じ「tmpdir にファイルを書いて
// spawnSync で bin/init.js lint を実行する」パターンを踏襲する。
function runKskLint(source: string, extraArgs: string[] = ["--format", "json"]) {
  const dir = mkdtempSync(join(tmpdir(), "ksk-ds-false-positive-lint-"))
  const srcDir = join(dir, "src")
  mkdirSync(srcDir)
  const file = join(srcDir, "Example.tsx")
  writeFileSync(file, source)
  const result = spawnSync(process.execPath, ["bin/init.js", "lint", file, ...extraArgs], {
    cwd: process.cwd(),
    encoding: "utf8",
  })
  return { result, file }
}

function findingsOf(stdout: string) {
  return (JSON.parse(stdout).results as { ruleId: string; line: number; file: string }[])
}

describe("issue #390: コメント除去を全ルールへ拡張", () => {
  it("行コメントの説明文はどのルールにも該当しない", () => {
    const { result } = runKskLint(`
      export function Example() {
        // 各カードに <img> を後から挿し込む
        return null
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P025")).toHaveLength(0)
    expect(findings).toHaveLength(0)
  })

  it("JSX の単一行コメント {/* ... */} 内の要素名も誤検知しない", () => {
    const { result } = runKskLint(`
      export function Example() {
        return (
          <div>
            {/* <img src="x" /> を後で差し込む */}
          </div>
        )
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P025")).toHaveLength(0)
  })
})

describe("issue #388: P026 の同一行 aria-label / aria-labelledby / id 判定", () => {
  it("直前行の <Label htmlFor> と対応する id を持つ Input は違反にしない", () => {
    const { result } = runKskLint(`
      export function Example() {
        return (
          <>
            <Label htmlFor="x">名前</Label>
            <Input id="x" placeholder="例" />
          </>
        )
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P026")).toHaveLength(0)
  })

  it("aria-label を持つ Input は違反にしない", () => {
    const { result } = runKskLint(`
      export function Example() {
        return <Input aria-label="名前" placeholder="例" />
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P026")).toHaveLength(0)
  })

  it("id も aria-* も無い placeholder のみの input は違反にする", () => {
    const { result } = runKskLint(`
      export function Example() {
        return <input placeholder="例" />
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P026")).toHaveLength(1)
  })

  it("props が複数行に割れていても、タグ内の id を認識して違反にしない", () => {
    const { result } = runKskLint(`
      export function Example({ name, onName }) {
        return (
          <>
            <Label htmlFor="create-name">名前</Label>
            <input
              id="create-name"
              className="text-input"
              value={name}
              onChange={(e) => onName(e.target.value)}
              maxLength={24}
              placeholder="例：ゆい"
            />
          </>
        )
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P026")).toHaveLength(0)
  })

  it("props が複数行に割れた id 無しの textarea は違反にする", () => {
    const { result } = runKskLint(`
      export function Example({ text, onText }) {
        return (
          <textarea
            className="text-input area"
            value={text}
            onChange={(e) => onText(e.target.value)}
            rows={3}
            placeholder="例"
          />
        )
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P026")).toHaveLength(1)
  })
})

describe("issue #396: P026 のタグ語彙拡張（DatePicker / Combobox 等）", () => {
  it("aria-label の無い DatePicker の placeholder は検出する", () => {
    const { result } = runKskLint(`
      export function Example() {
        return <DatePicker placeholder="日付を選択" />
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P026")).toHaveLength(1)
  })

  it("aria-label を持つ DatePicker は違反にしない", () => {
    const { result } = runKskLint(`
      export function Example() {
        return <DatePicker aria-label="日付を選択" placeholder="日付を選択" />
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P026")).toHaveLength(0)
  })

  it("大文字 A の TextArea（AutoGrowTextarea 等ではない素の TextArea）も検出する", () => {
    const { result } = runKskLint(`
      export function Example() {
        return <TextArea placeholder="ご意見をお聞かせください" />
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P026")).toHaveLength(1)
  })

  it("SelectValue の placeholder は意図的に対象外のまま（親 Select/FormField 側がラベルを担う合成コンポーネント）", () => {
    const { result } = runKskLint(`
      export function Example() {
        return (
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="取引先を選択" />
            </SelectTrigger>
          </Select>
        )
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P026")).toHaveLength(0)
  })
})

describe("issue #389: P037 / P040 の上限付与と matchAll 化", () => {
  it("P040: ファイル先頭のデータ配列の emoji と数百行離れた aria-pressed は無関係なので誤検知しない", () => {
    const filler = Array.from({ length: 40 }, (_, i) => `  // padding comment number ${i} adds unrelated distance in this source file`).join("\n")
    const { result } = runKskLint(`
      const TAGS = [{ id: 'sweet', label: 'スイート', emoji: '🥰' }]

${filler}

      export function GenderPicker({ gender, setGender }) {
        return (
          <>
            {['male', 'female'].map((g) => (
              <Button key={g} aria-pressed={gender === g} onClick={() => setGender(g)}>
                {g}
              </Button>
            ))}
          </>
        )
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P040")).toHaveLength(0)
  })

  it("P040: ActionTile のローカル定義は引き続き検出する", () => {
    const { result } = runKskLint(`
      const ActionTile = ({ label }) => <div>{label}</div>
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P040")).toHaveLength(1)
  })

  it("P037: SheetHeader と KebabMenu が近接していれば検出する", () => {
    const { result } = runKskLint(`
      export function Example() {
        return (
          <div>
            <SheetHeader />
            <KebabMenu />
          </div>
        )
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P037")).toHaveLength(1)
  })

  it("P037: SheetHeader と KebabMenu が数百文字以上離れていれば無関係とみなし検出しない", () => {
    const filler = Array.from({ length: 40 }, (_, i) => `  // padding comment number ${i} adds unrelated distance in this source file`).join("\n")
    const { result } = runKskLint(`
      export function Example() {
        return (
          <div>
            <SheetHeader />
${filler}
            <KebabMenu />
          </div>
        )
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P037")).toHaveLength(0)
  })

  it("全ファイル走査ルールは同一ファイル内の複数件をすべて報告する（matchAll 化）", () => {
    // 2つの SheetHeader+KebabMenu ペアそれぞれは窓内（近接）だが、ペア同士は
    // 窓を超えて離れているため、貪欲マッチが2ペアをまたいで1件に融合しない。
    const filler = Array.from({ length: 40 }, (_, i) => `  // padding comment number ${i} adds unrelated distance in this source file`).join("\n")
    const { result } = runKskLint(`
      export function A() {
        return (
          <div>
            <SheetHeader />
            <KebabMenu />
          </div>
        )
      }

${filler}

      export function B() {
        return (
          <div>
            <SheetHeader />
            <KebabMenu />
          </div>
        )
      }
    `)
    const findings = findingsOf(result.stdout)
    const p037 = findings.filter((f) => f.ruleId === "P037")
    expect(p037).toHaveLength(2)
    expect(p037[0].line).not.toBe(p037[1].line)
  })
})

// issue #390 フォローアップ: 独立レビューで確定した🔴3件（stripLineComment が
// indexOf("//") で文字列リテラルの中身ごと切り落としていたため、URL を含む行で
// alt 以降が消え P025 が誤検知したり、HEX 色や pravatar.cc の禁止ドメインが
// 逆に検出できなくなっていた）の回帰テスト。文字列を絶対にマスクしない
// maskComments への置き換えで解消したことを確認する。
describe("issue #390 フォローアップ: 文字列リテラルを壊さないコメントマスキング", () => {
  it("URL を含む属性値があっても alt 付き <img> は P025 を誤検知しない", () => {
    const { result } = runKskLint(`
      export function Example() {
        return <img src="https://cdn.example.com/a.png" alt="ユーザーのアバター" className="rounded-full" />
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P025")).toHaveLength(0)
  })

  it("URL を含む文字列内の HEX カラーは引き続き P008 で検出する", () => {
    const { result } = runKskLint(`
      export function Example() {
        return <div style={{backgroundImage:'url("https://x/a.png")', color:'#ff0000'}} />
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P008")).toHaveLength(1)
  })

  it("pravatar.cc の禁止ドメインは引き続き P014 で検出する", () => {
    const { result } = runKskLint(`
      export function Example() {
        return <img alt="a" src="https://i.pravatar.cc/150" />
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P014")).toHaveLength(1)
  })

  it("生の <a href> とフォントサイズ直書きは同一行でも両方検出する", () => {
    const { result } = runKskLint(`
      export function Example() {
        return <a href="https://x.com" className="text-[14px]">link</a>
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.some((f) => f.ruleId === "P006")).toBe(true)
    expect(findings.some((f) => f.ruleId === "P011")).toBe(true)
  })

  it("複数行ブロックコメント内の HEX 色と <img> は検出しない", () => {
    const { result } = runKskLint(`
      export function Example() {
        /*
         * 説明用のサンプル: color: #ff0000 の <img src="x" /> をここに置く想定
         */
        return null
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P008")).toHaveLength(0)
    expect(findings.filter((f) => f.ruleId === "P025")).toHaveLength(0)
  })

  it("全ファイル走査ルールも JSX 単一行コメント内の placeholder は検出しない", () => {
    const { result } = runKskLint(`
      export function Example() {
        return (
          <div>
            {/* <input placeholder="例" /> をここに置く */}
          </div>
        )
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P026")).toHaveLength(0)
  })

  it("全ファイル走査ルールも行コメント内の SheetHeader/KebabMenu 言及は検出しない", () => {
    const { result } = runKskLint(`
      export function Example() {
        // SheetHeader と KebabMenu を手で並べるのは禁止
        return null
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P037")).toHaveLength(0)
  })

  it("テンプレートリテラル内の HEX 色は文字列なのでマスクせず検出する", () => {
    const { result } = runKskLint(`
      export function Example() {
        const css = \`* { color: #ff0000 }\`
        return css
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P008")).toHaveLength(1)
  })
})

describe("issue #455: P006 は Button asChild / Slot 経由の <a href> を誤検出しない", () => {
  it("<Button asChild><a href> 構成は検出しない", () => {
    const { result } = runKskLint(`
      export function Example() {
        return (
          <Button asChild variant="link">
            <a href="https://example.com" target="_blank">
              サービスへ
            </a>
          </Button>
        )
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P006")).toHaveLength(0)
  })

  it("<Slot> 経由の <a href> も検出しない", () => {
    const { result } = runKskLint(`
      export function Example() {
        return (
          <Slot>
            <a href="https://example.com">リンク</a>
          </Slot>
        )
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P006")).toHaveLength(0)
  })

  it("asChild の無い生の <a href> は引き続き検出する", () => {
    const { result } = runKskLint(`
      export function Example() {
        return <a href="https://example.com">リンク</a>
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P006")).toHaveLength(1)
  })

  it("遠く離れた（300 文字より前の）asChild は近傍とみなさず検出する", () => {
    const padding = "x".repeat(400)
    const { result } = runKskLint(`
      export function Example() {
        return (
          <Button asChild variant="link">
            <span>{"${padding}"}</span>
          </Button>
        )
      }
      export function Unrelated() {
        return <a href="https://example.com">リンク</a>
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P006")).toHaveLength(1)
  })
})

describe("issue #459: P024 は同一行の子要素 onClick を div/span 自身の onClick と誤検出しない", () => {
  it("同一行の <div><Button onClick /></div> は検出しない", () => {
    const { result } = runKskLint(`
      export function Example() {
        return <div className="flex"><Button onClick={() => {}}>送信</Button></div>
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P024")).toHaveLength(0)
  })

  it("<div onClick> は引き続き検出する", () => {
    const { result } = runKskLint(`
      export function Example() {
        return <div onClick={() => {}}>クリック</div>
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P024")).toHaveLength(1)
  })

  it("TodoRow 相当の <span onClick> は引き続き検出する", () => {
    const { result } = runKskLint(`
      export function TodoRow() {
        return (
          <div className="flex items-center">
            <span onClick={(e) => e.stopPropagation()}>担当者</span>
          </div>
        )
      }
    `)
    const findings = findingsOf(result.stdout)
    expect(findings.filter((f) => f.ruleId === "P024")).toHaveLength(1)
  })
})
