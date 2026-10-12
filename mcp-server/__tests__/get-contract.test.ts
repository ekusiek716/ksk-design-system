/**
 * MCP の resources / list_contracts / get_contract が、正本ファイルを
 * 壊れずに配信できていることを固定する。
 *
 * - 配信対象はすべて npm パッケージ（package.json の "files"）に同梱されるファイル
 * - contracts/*.json の登録漏れ（新しい契約を足したのに配信されない）を検出する
 * - 実際の MCP クライアント（SDK の Client + InMemoryTransport）で list / read / callTool を叩く
 *
 * 実行: npm run test（vitest.config.ts の include で mcp-server/__tests__ も対象）。
 * MCP SDK は mcp-server/node_modules にあるので、先に `npm ci --prefix mcp-server` が要る。
 */
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"
import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js"
import { createServer } from "../src/server.js"
import {
  CONTRACT_DEFINITIONS,
  UNSERVED_CONTRACT_FILES,
  extractHeadings,
  extractSections,
  findContract,
  getContract,
  resolvePath,
} from "../src/tools/get-contract.js"
import { projectRoot } from "../src/utils/loader.js"

const pkg = JSON.parse(readFileSync(resolve(projectRoot, "package.json"), "utf-8")) as { files: string[] }

function isPackaged(file: string): boolean {
  return pkg.files.some((entry) => file === entry || file.startsWith(`${entry}/`))
}

async function connect(): Promise<Client> {
  const server = createServer()
  const client = new Client({ name: "test-client", version: "0.0.0" })
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)])
  return client
}

describe("配信対象の定義", () => {
  it("projectRoot が本体リポジトリのルートを指す", () => {
    expect(existsSync(resolve(projectRoot, "package.json"))).toBe(true)
    expect(existsSync(resolve(projectRoot, "contracts/components.json"))).toBe(true)
  })

  it("全ファイルが存在し、npm パッケージの files に同梱される", () => {
    for (const d of CONTRACT_DEFINITIONS) {
      expect(existsSync(resolve(projectRoot, d.file)), `${d.file} が存在しない`).toBe(true)
      expect(isPackaged(d.file), `${d.file} は package.json の files に含まれない（配信しても配布物で読めない）`).toBe(true)
    }
  })

  it("name と uri が重複しない", () => {
    expect(new Set(CONTRACT_DEFINITIONS.map((d) => d.name)).size).toBe(CONTRACT_DEFINITIONS.length)
    expect(new Set(CONTRACT_DEFINITIONS.map((d) => d.uri)).size).toBe(CONTRACT_DEFINITIONS.length)
  })

  it("contracts/*.json はすべて配信対象か、理由付きの除外リストにある", () => {
    const served = new Set(CONTRACT_DEFINITIONS.map((d) => d.file))
    for (const entry of readdirSync(resolve(projectRoot, "contracts"))) {
      if (!entry.endsWith(".json")) continue
      const file = `contracts/${entry}`
      expect(
        served.has(file) || file in UNSERVED_CONTRACT_FILES,
        `${file} が配信対象にも UNSERVED_CONTRACT_FILES にも無い（mcp-server/src/tools/get-contract.ts に追加する）`
      ).toBe(true)
    }
  })

  it("JSON 契約はパースでき、Markdown 契約は空でない", () => {
    for (const d of CONTRACT_DEFINITIONS) {
      const text = readFileSync(resolve(projectRoot, d.file), "utf-8")
      if (d.kind === "json") expect(() => JSON.parse(text)).not.toThrow()
      else expect(text.length).toBeGreaterThan(0)
    }
  })
})

describe("getContract", () => {
  it("表記ゆれ（DESIGN.md / rules.json / 大文字）を同じ契約に寄せる", () => {
    expect(findContract("DESIGN.md")?.name).toBe("design")
    expect(findContract("rules.json")?.name).toBe("rules")
    expect(findContract("COMPONENTS")?.name).toBe("components")
    expect(findContract("COMPONENT_LOOKUP.md")?.name).toBe("component-lookup")
    expect(findContract("nope")).toBeUndefined()
  })

  it("小さい JSON 契約は全文を返す", () => {
    const result = getContract("deprecations")
    expect(result.ok).toBe(true)
    if (result.ok) expect(() => JSON.parse(result.text)).not.toThrow()
  })

  it("大きい JSON 契約は目次を返し、full:true で全文を返す", () => {
    const outline = getContract("components")
    expect(outline.ok && outline.text).toContain("目次のみ")
    const full = getContract("components", { full: true })
    expect(full.ok && JSON.parse(full.text).meta).toBeDefined()
  })

  it("path で部分取得でき、辿れない path は候補キー付きのエラーになる", () => {
    const part = getContract("components", { path: "meta.counts" })
    expect(part.ok).toBe(true)
    const bad = getContract("components", { path: "meta.nope" })
    expect(bad.ok).toBe(false)
    if (!bad.ok) expect(bad.error).toContain("counts")
  })

  it("section で Markdown の節を取得でき、無い節は見出し一覧付きのエラーになる", () => {
    const headings = extractHeadings(readFileSync(resolve(projectRoot, "DESIGN.md"), "utf-8"))
    const target = headings.find((h) => h.level >= 2)
    expect(target).toBeDefined()
    const result = getContract("design", { section: target!.heading })
    expect(result.ok && result.text).toContain(target!.heading)
    const bad = getContract("design", { section: "存在しない見出し__zzz" })
    expect(bad.ok).toBe(false)
  })

  it("未知の契約名は使える契約名を返す", () => {
    const result = getContract("nope")
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toContain("components")
  })
})

describe("Markdown / path ヘルパー", () => {
  it("コードフェンス内の # は見出しに数えない", () => {
    const md = "# A\n\n```sh\n# comment\n```\n\n## B\n"
    expect(extractHeadings(md).map((h) => h.heading)).toEqual(["A", "B"])
  })

  it("```` の中の ``` で閉じたと誤判定しない", () => {
    const md = "# A\n\n````md\n```\n# not heading\n```\n````\n\n## B\n"
    expect(extractHeadings(md).map((h) => h.heading)).toEqual(["A", "B"])
  })

  it("節は次の同階層以上の見出しの手前までで、配下の重複一致は返さない", () => {
    const md = "# T\n\n## Colors\nx\n### Colors detail\ny\n## Other\nz\n"
    const sections = extractSections(md, "colors")
    expect(sections).toHaveLength(1)
    expect(sections[0]).toContain("Colors detail")
    expect(sections[0]).not.toContain("Other")
  })

  it("キーに . を含む path も辿れる", () => {
    const result = resolvePath({ a: { "0.5": { b: 1 } } }, "a.0.5.b")
    expect(result).toEqual({ found: true, value: 1 })
  })
})

describe("MCP クライアント経由", () => {
  it("resources/list が全契約を返す", async () => {
    const client = await connect()
    const { resources } = await client.listResources()
    expect(resources.map((r) => r.name).sort()).toEqual(CONTRACT_DEFINITIONS.map((d) => d.name).sort())
    for (const r of resources) {
      expect(r.uri).toMatch(/^ksk-ds:\/\//)
      expect(r.mimeType).toMatch(/^(application\/json|text\/markdown)$/)
    }
    await client.close()
  })

  it("resources/read が JSON と Markdown の本文を返す", async () => {
    const client = await connect()
    const rules = await client.readResource({ uri: "ksk-ds://contracts/rules" })
    const first = rules.contents[0]
    expect(first?.mimeType).toBe("application/json")
    expect(JSON.parse(String(first?.text)).prohibited).toBeDefined()
    const design = await client.readResource({ uri: "ksk-ds://docs/design" })
    expect(design.contents[0]?.mimeType).toBe("text/markdown")
    expect(String(design.contents[0]?.text).length).toBeGreaterThan(100)
    await client.close()
  })

  it("未知の URI は読めない", async () => {
    const client = await connect()
    await expect(client.readResource({ uri: "ksk-ds://contracts/nope" })).rejects.toThrow()
    await client.close()
  })

  it("tools/list に list_contracts と get_contract があり、既存ツールも残る", async () => {
    const client = await connect()
    const { tools } = await client.listTools()
    const names = tools.map((t) => t.name)
    expect(names).toEqual(expect.arrayContaining(["get_component", "get_token", "check_rule", "search", "list_contracts", "get_contract"]))
    await client.close()
  })

  it("get_contract が名前で契約を返し、未知の名前は isError になる", async () => {
    const client = await connect()
    const ok = await client.callTool({ name: "get_contract", arguments: { name: "rules", path: "prohibited.0" } })
    const content = ok.content as { type: string; text: string }[]
    expect(ok.isError).toBeFalsy()
    expect(JSON.parse(content[0]!.text).id).toBeDefined()
    const bad = await client.callTool({ name: "get_contract", arguments: { name: "nope" } })
    expect(bad.isError).toBe(true)
    const list = await client.callTool({ name: "list_contracts", arguments: {} })
    const listed = JSON.parse((list.content as { text: string }[])[0]!.text) as { name: string }[]
    expect(listed.map((l) => l.name)).toContain("design")
    await client.close()
  })
})
