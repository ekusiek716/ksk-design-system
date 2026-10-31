import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

/**
 * publish.yml の権限分離を固定する（issue #801）。
 *
 * 公開権限（id-token: write = npm Trusted Publishing の OIDC）とリポジトリへの
 * 書き込み権限（contents: write）を持つ job で、依存のインストールやビルド
 * （= 外部ライブラリのコード）を動かさない。依存が 1 つ乗っ取られただけで
 * 正規の経路から不正な版を公開されるのを防ぐため。
 *
 * - install / build / pack は読み取り権限だけの build job で行い、tarball を artifact に上げる
 * - 権限を持つ publish job は、その tarball を `npm publish <tgz> --ignore-scripts` で公開するだけ
 * - checkout は認証情報を .git/config に残さない（persist-credentials: false）
 * - npm ci は install スクリプトを動かさない（--ignore-scripts）
 *
 * YAML パーサは直接の依存に無いので、この workflow の書式（2 スペースインデント）を前提に
 * 行ベースで job を切り出す。
 */

const WORKFLOW_PATH = join(process.cwd(), ".github/workflows/publish.yml")
const source = readFileSync(WORKFLOW_PATH, "utf8")
const lines = source.split("\n")

/** `key:` で始まるトップレベルのブロック（次のインデント無し行まで）を返す */
function topLevelBlock(key: string): string[] {
  const start = lines.findIndex((line) => line === `${key}:` || line.startsWith(`${key}: `))
  if (start === -1) return []
  const block: string[] = [lines[start]]
  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i]
    if (line.trim() !== "" && !line.startsWith(" ") && !line.startsWith("#")) break
    block.push(line)
  }
  return block
}

/** jobs: 直下の各 job（2 スペースインデントのキー）を名前 → 行の配列で返す */
function jobs(): Map<string, string[]> {
  const result = new Map<string, string[]>()
  let current: string | null = null
  for (const line of topLevelBlock("jobs").slice(1)) {
    const header = /^ {2}([\w-]+):\s*$/.exec(line)
    if (header) {
      current = header[1]
      result.set(current, [])
      continue
    }
    if (current) result.get(current)!.push(line)
  }
  return result
}

/** job の `permissions:` ブロック（4 スペースインデント）の中身 */
function jobPermissions(body: string[]): string[] {
  const start = body.findIndex((line) => /^ {4}permissions:/.test(line))
  if (start === -1) return []
  const block: string[] = []
  for (let i = start + 1; i < body.length; i += 1) {
    if (!/^ {6}/.test(body[i])) break
    block.push(body[i].trim())
  }
  return block
}

/** コメントを除いた実行コード部分だけ（コメント中の説明文で誤判定しない） */
function code(body: string[]): string[] {
  return body.map((line) => line.replace(/(^|\s)#.*$/, "")).filter((line) => line.trim() !== "")
}

/** `uses: actions/checkout` ごとに、その step の行（次の step の `- ` まで） */
function checkoutSteps(body: string[]): string[][] {
  const steps: string[][] = []
  body.forEach((line, index) => {
    if (!/uses: actions\/checkout@/.test(line)) return
    // `- uses:` ならその "-" の位置、`- name:` の下の `uses:` なら 2 つ左が step の "-" の位置
    const indent = line.search(/\S/)
    const stepIndent = line.trimStart().startsWith("- ") ? indent : indent - 2
    const step: string[] = [line]
    for (let i = index + 1; i < body.length; i += 1) {
      const next = body[i]
      if (next.trim() === "") continue
      if (next.search(/\S/) <= stepIndent) break
      step.push(next)
    }
    steps.push(step)
  })
  return steps
}

const PRIVILEGED = /^(id-token|contents):\s*write\b/
const RUNS_DEPENDENCY_CODE = /\bnpm (ci|install|i|run|exec|rebuild)\b|\bnpx\b|\bnpm pack(?![^\n]*ksk-design-system@)/

describe("publish.yml の権限分離（issue #801）", () => {
  const allJobs = jobs()

  it("workflow 直下の permissions は読み取りだけ（書き込み権限は job 単位で必要な job にだけ付ける）", () => {
    const block = topLevelBlock("permissions").slice(1).map((line) => line.trim()).filter(Boolean)
    expect(block.length).toBeGreaterThan(0)
    expect(block.filter((line) => /:\s*write\b/.test(line))).toEqual([])
  })

  it("依存のインストール・ビルドをする job は id-token: write / contents: write を持たない", () => {
    const installing = [...allJobs].filter(([, body]) => code(body).some((line) => RUNS_DEPENDENCY_CODE.test(line)))
    expect(installing.map(([name]) => name)).toContain("build")
    for (const [name, body] of installing) {
      const permissions = jobPermissions(body)
      expect(permissions, `${name} は permissions を job 単位で明示する`).not.toEqual([])
      expect(permissions.filter((line) => PRIVILEGED.test(line)), `${name} が書き込み権限を持っている`).toEqual([])
    }
  })

  it("公開権限を持つ job は依存のインストール・ビルドのコードを実行しない", () => {
    const privileged = [...allJobs].filter(([, body]) => jobPermissions(body).some((line) => PRIVILEGED.test(line)))
    expect(privileged.map(([name]) => name)).toEqual(["publish"])
    for (const [name, body] of privileged) {
      expect(code(body).filter((line) => RUNS_DEPENDENCY_CODE.test(line)), `${name} が依存のコードを動かしている`).toEqual([])
    }
  })

  it("publish job は build job が作った tarball を --ignore-scripts で公開する", () => {
    const publish = allJobs.get("publish")
    expect(publish).toBeDefined()
    const body = code(publish!)
    expect(body.some((line) => /^ {4}needs:\s*(\[\s*)?build\b/.test(line))).toBe(true)
    expect(body.some((line) => /uses: actions\/download-artifact@[0-9a-f]{40}\b/.test(line))).toBe(true)
    const publishCommands = body.filter((line) => /\bnpm publish\b/.test(line))
    expect(publishCommands.length).toBe(1)
    expect(publishCommands[0]).toMatch(/\.tgz/)
    expect(publishCommands[0]).toMatch(/--ignore-scripts/)
  })

  it("build job は tarball を作って artifact に上げる（prepack に頼らず build:lib を明示する）", () => {
    const build = allJobs.get("build")
    expect(build).toBeDefined()
    const body = code(build!)
    expect(body.some((line) => /\bnpm run build:lib\b/.test(line))).toBe(true)
    expect(body.some((line) => /\bnpm pack\b.*--ignore-scripts/.test(line))).toBe(true)
    expect(body.some((line) => /uses: actions\/upload-artifact@[0-9a-f]{40}\b/.test(line))).toBe(true)
  })

  it("npm ci はすべて --ignore-scripts 付き", () => {
    const installs = code(lines).filter((line) => /\bnpm ci\b/.test(line))
    expect(installs.length).toBeGreaterThan(0)
    for (const line of installs) expect(line).toMatch(/--ignore-scripts/)
  })

  it("checkout はすべて persist-credentials: false（認証情報を .git/config に残さない）", () => {
    for (const [name, body] of allJobs) {
      for (const step of checkoutSteps(body)) {
        expect(step.some((line) => /persist-credentials:\s*false\b/.test(line)), `${name} の checkout`).toBe(true)
      }
    }
  })

  it("Release 作成は publish job に残り、publish 済みでタグだけ無い再実行でも走る（#269 の冪等性）", () => {
    const publish = code(allJobs.get("publish") ?? [])
    const releaseIndex = publish.findIndex((line) => /gh release create\b/.test(line))
    expect(releaseIndex).toBeGreaterThan(-1)
    // job 自体を publish=true で絞ると「npm には既にある → スキップ」でタグが永久に作られなくなる
    expect(publish.some((line) => /^ {4}if:/.test(line))).toBe(false)
  })
})
