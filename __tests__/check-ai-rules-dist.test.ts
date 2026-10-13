/**
 * consumer へ配る AI 向けルールの配布漏れ検査（scripts/check-ai-rules-dist.mjs）の回帰テスト。
 * 純関数は fixture で「配布漏れを検出できる」ことを、実リポジトリでは「今は違反が無い」ことを固定する。
 */
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import {
  checkAiRulesDist,
  expandBraces,
  extractInitTemplates,
  extractRootReadList,
  extractTemplateRefs,
  isShipped,
  // @ts-expect-error — .mjs の純関数（型定義なし）
} from "../scripts/check-ai-rules-dist.mjs"

const ROOT = join(__dirname, "..")
const read = (rel: string) => readFileSync(join(ROOT, rel), "utf8")

describe("isShipped", () => {
  const files = ["dist", "contracts", "tokens.json", "src/styles", "eslint/*.js"]
  it("ファイル・ディレクトリ配下・簡易 glob に一致する", () => {
    expect(isShipped("tokens.json", files)).toBe(true)
    expect(isShipped("contracts/rules.json", files)).toBe(true)
    expect(isShipped("src/styles/motion.css", files)).toBe(true)
    expect(isShipped("eslint/deprecated.js", files)).toBe(true)
  })
  it("前方一致だけの別名は配布扱いにしない", () => {
    expect(isShipped("contracts-extra/a.json", files)).toBe(false)
    expect(isShipped("src/stylesheet.css", files)).toBe(false)
    expect(isShipped(".claude/skills/x/SKILL.md", files)).toBe(false)
  })
  it("package.json / README / LICENSE は files に無くても配布される", () => {
    expect(isShipped("package.json", [])).toBe(true)
    expect(isShipped("README.md", [])).toBe(true)
    expect(isShipped("LICENSE", [])).toBe(true)
  })
})

describe("抽出", () => {
  it("brace を展開する", () => {
    expect(expandBraces("{AGENTS.md,CLAUDE.md}")).toEqual(["AGENTS.md", "CLAUDE.md"])
    expect(expandBraces("contracts/rules.json")).toEqual(["contracts/rules.json"])
  })
  it("テンプレートの node_modules 参照をパッケージ内パスで返す（句読点は落とす）", () => {
    const text = [
      "| `node_modules/ksk-design-system/contracts/rules.json` | 禁止 |",
      "読む: node_modules/ksk-design-system/{AGENTS.md,CLAUDE.md}, node_modules/ksk-design-system/tokens.json.",
      '@source "../../node_modules/ksk-design-system/dist"',
    ].join("\n")
    expect(extractTemplateRefs(text).sort()).toEqual(["AGENTS.md", "CLAUDE.md", "contracts/rules.json", "dist", "tokens.json"])
  })
  it("ルート文書の必読リストはコードブロックの各行の先頭トークンを返す", () => {
    const md = ["## 必須: セッション開始時に読み込むファイル", "", "```", "contracts/rules.json  # 禁止", "tokens.json", "```"].join("\n")
    expect(extractRootReadList(md)).toEqual(["contracts/rules.json", "tokens.json"])
    expect(extractRootReadList("# 見出し無し")).toBeNull()
  })
  it("init が配るテンプレートを取り出す", () => {
    expect(extractInitTemplates(`{ src: "templates/AGENTS.md", dest: "AGENTS.md" }, { src: "templates/CLAUDE.md" }`)).toEqual([
      "templates/AGENTS.md",
      "templates/CLAUDE.md",
    ])
  })
})

describe("checkAiRulesDist（fixture）", () => {
  const initSource = `const files = [{ src: "templates/CLAUDE.md", dest: "CLAUDE.md" }]\nconst force = args.includes("--force")`
  const base = {
    files: ["templates", "contracts"],
    initSource,
    templates: { "templates/CLAUDE.md": "`node_modules/ksk-design-system/contracts/rules.json` を読む。最新化は npx ksk-ds init --force" },
    rootDocs: { "CLAUDE.md": "## 必須: セッション開始時に読み込むファイル\n\n```\ncontracts/rules.json\n```\n" },
    exists: () => true,
  }
  const kinds = (input: object) => checkAiRulesDist({ ...base, ...input }).map((p: { kind: string }) => p.kind)

  it("問題が無ければ空", () => {
    expect(kinds({})).toEqual([])
  })
  it("テンプレートの参照先が files に入っていなければ NOT-SHIPPED", () => {
    expect(kinds({ files: ["templates"] })).toContain("NOT-SHIPPED")
  })
  it("参照先が存在しなければ MISSING", () => {
    expect(kinds({ exists: (r: string) => r !== "contracts/rules.json" })).toContain("MISSING")
  })
  it("init が配るテンプレートが files に無ければ NOT-SHIPPED", () => {
    expect(kinds({ files: ["contracts"] })).toContain("NOT-SHIPPED")
  })
  it("--force を案内しているのに init が受け付けなければ COMMAND", () => {
    expect(kinds({ initSource: `const files = [{ src: "templates/CLAUDE.md" }]` })).toContain("COMMAND")
  })
  it("必読リストの節が無ければ STRUCTURE（見出し変更で検査が素通りしない）", () => {
    expect(kinds({ rootDocs: { "CLAUDE.md": "# 見出し無し" } })).toContain("STRUCTURE")
  })
  it("必読リストの未配布パスは検出する（.claude/skills も files に無ければ漏れ）", () => {
    const root = (p: string) => ({ "CLAUDE.md": `## 必須: セッション開始時に読み込むファイル\n\n\`\`\`\n${p}\n\`\`\`\n` })
    expect(kinds({ rootDocs: root(".claude/skills/ksk-design-system/SKILL.md") })).toContain("NOT-SHIPPED")
    expect(kinds({ rootDocs: root(".claude/skills/ksk-design-system/SKILL.md"), files: [...base.files, ".claude/skills/ksk-design-system"], exists: () => true })).toEqual([])
    expect(kinds({ rootDocs: root("scripts/lint-scratch.sh") })).toContain("NOT-SHIPPED")
  })
  describe("角丸の許可セットを rules.json と突き合わせる", () => {
    const rules = { aiPatterns: { patterns: [{ id: "AI3", fix: "rounded-none / rounded-sm / rounded-md の3値のみ" }] } }
    const tpl = (set: string) => ({ "templates/CLAUDE.md": `| カスタム角丸（\`rounded-3xl\` 等） | \`${set}\` のみ使用可 |\n` })
    it("一致すれば空", () => {
      expect(kinds({ templates: tpl("rounded-none/sm/md"), rules })).toEqual([])
    })
    it("欠け（md が無い）も余り（xl がある）も検出する", () => {
      expect(kinds({ templates: tpl("rounded-none/sm"), rules })).toContain("RULES")
      expect(kinds({ templates: tpl("rounded-none/sm/md/xl"), rules })).toContain("RULES")
    })
    it("行や正本が見つからなければ RULES", () => {
      expect(kinds({ templates: { "templates/CLAUDE.md": "角丸の行なし" }, rules })).toContain("RULES")
      expect(kinds({ templates: tpl("rounded-none/sm/md"), rules: { aiPatterns: { patterns: [] } } })).toContain("RULES")
    })
  })
})

describe("実リポジトリ", () => {
  it("配布漏れ・不整合が無い", () => {
    const pkg = JSON.parse(read("package.json"))
    const problems = checkAiRulesDist({
      files: pkg.files,
      initSource: read("bin/init.js"),
      templates: { "templates/CLAUDE.md": read("templates/CLAUDE.md"), "templates/AGENTS.md": read("templates/AGENTS.md") },
      rootDocs: { "CLAUDE.md": read("CLAUDE.md"), "AGENTS.md": read("AGENTS.md") },
      rules: JSON.parse(read("contracts/rules.json")),
      skillDocs: Object.fromEntries(
        [".claude/skills/ksk-design-system/SKILL.md", ...readdirSync(join(ROOT, ".claude/skills/ksk-design-system/references")).map((f) => `.claude/skills/ksk-design-system/references/${f}`)].map((r) => [r, read(r)]),
      ),
      cssSources: Object.fromEntries(readdirSync(join(ROOT, "src/styles")).filter((f) => f.endsWith(".css")).map((f) => [f, read(`src/styles/${f}`)])),
      exists: (ref: string) => ref === "dist" || ref.startsWith("dist/") || ref.includes("*") || existsSync(join(ROOT, ref)),
    })
    expect(problems).toEqual([])
  })
})
