/**
 * 正本ファイルの読み込みで例外が出ても、get_contract は isError 付きの結果を、
 * resources/read は理由付きの MCP エラー応答を返し、サーバーを落とさないことを固定する。
 * node:fs をモックして deprecations.json の読み込みだけ失敗させる。
 */
import { describe, expect, it, vi } from "vitest"
import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js"

vi.mock("node:fs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:fs")>()
  return {
    ...actual,
    readFileSync: ((path: unknown, ...rest: unknown[]) => {
      if (typeof path === "string" && path.endsWith("contracts/deprecations.json")) {
        throw new Error("boom: simulated read failure")
      }
      return (actual.readFileSync as (...a: unknown[]) => unknown)(path, ...rest)
    }) as typeof actual.readFileSync,
  }
})

const { createServer } = await import("../src/server.js")

async function connect(): Promise<Client> {
  const server = createServer()
  const client = new Client({ name: "test-client", version: "0.0.0" })
  const [c, s] = InMemoryTransport.createLinkedPair()
  await Promise.all([server.connect(s), client.connect(c)])
  return client
}

describe("読み込み失敗時のエラー応答", () => {
  it("get_contract は例外を isError の結果にする", async () => {
    const client = await connect()
    const res = await client.callTool({ name: "get_contract", arguments: { name: "deprecations" } })
    expect(res.isError).toBe(true)
    expect(String((res.content as { text: string }[])[0]?.text)).toContain("boom")
    await client.close()
  })

  it("resources/read は理由付きのエラーで拒否し、他の resource は読める", async () => {
    const client = await connect()
    await expect(client.readResource({ uri: "ksk-ds://contracts/deprecations" })).rejects.toThrow(/boom/)
    const ok = await client.readResource({ uri: "ksk-ds://contracts/rules" })
    expect(ok.contents[0]?.text).toBeTruthy()
    await client.close()
  })
})
