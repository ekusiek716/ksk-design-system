import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

/**
 * publish.yml の権限分離を固定する（issue #801）。
 *
 * 公開権限（id-token: write = npm Trusted Publishing の OIDC）とリポジトリへの
 * 書き込み権限（contents: write）を持つ job で、依存のインストールやビルド
 * （= 外部ライブラリのコード）を動かさない。依存のコードが OIDC トークンや
 * contents: write のトークンに触れられないようにするため。tarball の中身の完全性
 * （build job で動く依存による dist の改ざん）はこの分離の範囲外。
 *
 * - install / build / pack は読み取り権限だけの build job で行い、tarball を artifact に上げる
 * - 権限を持つ publish job は、その tarball を `npm publish <tgz> --ignore-scripts` で公開するだけ
 *   （checkout せず、リポジトリ内のスクリプトも動かさない）
 * - 「Re-run failed jobs」で publish job だけ再実行されても、公開済みなら Download / Publish を
 *   飛ばして Verify と Release 作成へ進む（#269 の復旧経路を保つ）
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

/** job の steps（6 スペースインデントの `- ` で始まる塊）を行の配列で返す */
function steps(body: string[]): string[][] {
  const result: string[][] = []
  for (const line of body) {
    if (/^ {6}- /.test(line)) result.push([line])
    else if (result.length > 0) result[result.length - 1].push(line)
  }
  return result
}

/** `- name: <name>` の step を返す */
function stepNamed(body: string[], name: string): string[] | undefined {
  return steps(body).find((step) => step.some((line) => line.trim() === `- name: ${name}` || line.trim() === `name: ${name}`))
}

/** step の `if:` 条件（無ければ空文字） */
function stepIf(step: string[]): string {
  const line = step.find((l) => /^ {8}if:/.test(l))
  return line ? line.replace(/^ {8}if:\s*/, "").trim() : ""
}

const PRIVILEGED = /^(id-token|contents):\s*write\b/
const RUNS_DEPENDENCY_CODE = /\bnpm (ci|install|i|run|exec|rebuild)\b|\bnpx\b|\bnpm pack(?![^\n]*ksk-design-system@)/
/** リポジトリ内のスクリプト（scripts/・bin/・./ 始まり）の実行。checkout しない job では本来ありえない */
const RUNS_REPO_CODE = /\b(node|bash|sh|zsh|bun|deno)\s+(\.\/)?(scripts|bin)\/|(^|[\s;&|(])\.\/[\w.-]/

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
      expect(code(body).filter((line) => RUNS_REPO_CODE.test(line)), `${name} がリポジトリ内のスクリプトを動かしている`).toEqual([])
    }
  })

  it("公開権限を持つ job はリポジトリを checkout しない", () => {
    const privileged = [...allJobs].filter(([, body]) => jobPermissions(body).some((line) => PRIVILEGED.test(line)))
    expect(privileged.length).toBeGreaterThan(0)
    for (const [name, body] of privileged) {
      expect(code(body).filter((line) => /uses:\s*actions\/checkout@/.test(line)), `${name} が checkout している`).toEqual([])
    }
  })

  it("リポジトリ内スクリプトの検出が効く（検出式の自己テスト）", () => {
    for (const sample of ["node scripts/foo.mjs", "bash scripts/x.sh", "sh ./scripts/x.sh", "./bin/run", "node bin/init.js"]) {
      expect(RUNS_REPO_CODE.test(sample), sample).toBe(true)
    }
    for (const sample of [`node -e 'console.log(1)'`, `tar -tzf "$TARBALL"`, `npm view "ksk-design-system@$VERSION" version`]) {
      expect(RUNS_REPO_CODE.test(sample), sample).toBe(false)
    }
  })

  it("Re-run failed jobs で publish job だけ再実行しても、公開済みなら Download / Publish を飛ばす（#269 の復旧を保つ）", () => {
    const publish = allJobs.get("publish") ?? []
    const registry = stepNamed(publish, "Check registry")
    expect(registry, "publish job に npm 上の有無を確かめる step がある").toBeDefined()
    expect(registry!.some((line) => /^ {8}id:\s*registry\s*$/.test(line))).toBe(true)
    expect(code(registry!).some((line) => /\bnpm view "?ksk-design-system@\$VERSION"?/.test(line))).toBe(true)

    const order = steps(publish).map((step) => step.find((line) => /name:/.test(line))?.replace(/^.*name:\s*/, "").trim())
    const download = stepNamed(publish, "Download tarball")
    const tarball = stepNamed(publish, "Publish tarball")
    for (const [label, step] of [["Download tarball", download], ["Publish tarball", tarball]] as const) {
      expect(step, label).toBeDefined()
      expect(order.indexOf("Check registry"), `${label} より前に Check registry`).toBeLessThan(order.indexOf(label))
      expect(stepIf(step!), `${label} は公開済みなら飛ばす`).toMatch(/steps\.registry\.outputs\.published != 'true'/)
    }

    // Verify と Release 作成は、公開済みで飛ばした再実行でも走る
    for (const label of ["Verify registry metadata and tarball", "Create git tag + GitHub Release"]) {
      const step = stepNamed(publish, label)
      expect(step, label).toBeDefined()
      expect(stepIf(step!), label).not.toMatch(/steps\.registry/)
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
