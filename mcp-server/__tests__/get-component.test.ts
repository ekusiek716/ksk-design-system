/**
 * MCP の get_component が contracts の export メタデータを理解しているかを固定する。
 *
 * 背景: contracts/components.json は `exported` / `exportedAs` / `subcomponents` /
 * `deprecatedAliases` を持つ（__tests__/contracts-export-integrity.test.ts が
 * src/index.ts の実 export と突き合わせて固定している）。
 * MCP 側が `name` と `path` しか見ていないと、`CheckboxCardGroup` のような
 * 「実際に import する名前」で引いたときに null が返り、
 * MCP 経由ではそのコンポーネントのルールを一切取得できない。
 *
 * 実行: npm run test
 */
import { describe, expect, it, vi } from "vitest"
import { getComponent } from "../src/tools/get-component.js"
import contracts from "../../contracts/components.json"

type Entry = {
  name: string
  path: string
  exported?: boolean
  subcomponents?: string[]
}

const GROUPS = ["ui", "patterns", "commerce", "admin", "shells"] as const
const all = contracts as unknown as Record<string, Entry[]>
const entries = GROUPS.flatMap((g) => all[g])

describe("getComponent — 従来の解決", () => {
  it("name の完全一致で引ける", () => {
    const result = getComponent("Button")
    expect(result?.name).toBe("Button")
    expect(result?.group).toBe("ui")
    expect(result?.matchedBy).toBe("name")
    expect(result?.importable).toBe(true)
    expect(result?.importPath).toBe("ksk-design-system")
  })

  it("大文字小文字を問わない / パス断片でも引ける", () => {
    expect(getComponent("button")?.name).toBe("Button")
    expect(getComponent("src/components/ui/button.tsx")?.name).toBe("Button")
  })

  it("未知の名前は null", () => {
    expect(getComponent("NotAComponentAtAll")).toBeNull()
    expect(getComponent("")).toBeNull()
  })
})

describe("getComponent — subcomponents による解決", () => {
  it("subcomponent 名（CheckboxCardGroup）で親エントリを引ける", () => {
    const result = getComponent("CheckboxCardGroup")
    expect(result).not.toBeNull()
    expect(result?.name).toBe("CheckboxCard")
    expect(result?.matchedName).toBe("CheckboxCardGroup")
    expect(result?.matchedBy).toBe("subcomponent")
    // 引いた名前自体は実 export なので import できる
    expect(result?.importable).toBe(true)
    expect(result?.importableNames).toContain("CheckboxCardGroup")
    // 親エントリ名が import できないことは note で伝える
    expect(result?.note).toContain("CheckboxCard")
  })

  it("exported:false のエントリの全 subcomponent が引ける", () => {
    const hidden = entries.filter((e) => e.exported === false)
    expect(hidden.length).toBeGreaterThan(0)

    for (const entry of hidden) {
      for (const sub of entry.subcomponents ?? []) {
        const result = getComponent(sub)
        expect(result, `getComponent("${sub}") が null`).not.toBeNull()
        expect(result?.matchedName).toBe(sub)
        // `Root.Member` 形式は named export ではないので別扱い（下の describe で検証）
        if (sub.includes(".")) continue
        expect(result?.importable, sub).toBe(true)
        expect(result?.importableNames, sub).toContain(sub)
      }
    }
  })

  it("exported な親の subcomponent（CardHeader）も引ける", () => {
    const result = getComponent("CardHeader")
    expect(result?.matchedName).toBe("CardHeader")
    expect(result?.importableNames).toContain("CardHeader")
    expect(result?.importable).toBe(true)
  })
})

describe("getComponent — exported:false の明示", () => {
  it("エントリ名で引くと importable:false と import 可能名を返す", () => {
    const result = getComponent("Toast")
    expect(result?.name).toBe("Toast")
    expect(result?.exported).toBe(false)
    expect(result?.matchedBy).toBe("name")
    expect(result?.importable).toBe(false)
    expect(result?.importableNames).toEqual(
      expect.arrayContaining(["Toaster", "useToast", "toast"]),
    )
    expect(result?.note).toContain("import できない")
  })

  it("グループ名エントリ（ListSkeleton / GridSkeleton）も importable:false", () => {
    const result = getComponent("ListSkeleton / GridSkeleton")
    expect(result?.importable).toBe(false)
    expect(result?.importableNames).toEqual(["ListSkeleton", "GridSkeleton"])
  })

  it("exported:false のエントリ名は importableNames に含めない", () => {
    const checked: string[] = []
    for (const entry of entries.filter((e) => e.exported === false)) {
      const result = getComponent(entry.name)
      // `Form` は ui/form.tsx にも同名エントリがある。その場合は import 可能な
      // ui 側が引かれるのが正しいので、同一エントリに解決できたものだけ検証する。
      if (result?.path !== entry.path) continue
      expect(result?.importableNames, `${entry.name}`).not.toContain(entry.name)
      expect(result?.importable, `${entry.name}`).toBe(false)
      checked.push(entry.name)
    }
    expect(checked.length).toBeGreaterThan(0)
  })

  it("import 可能な名前で引いたときは note なしで importable:true", () => {
    const result = getComponent("Input")
    expect(result?.importable).toBe(true)
    expect(result?.note).toBeUndefined()
  })
})

describe("getComponent — 複合コンポーネントのメンバー", () => {
  it("PhotoHero.Title は import できず、ルートの import を案内する", () => {
    const result = getComponent("PhotoHero.Title")
    expect(result?.name).toBe("PhotoHero")
    expect(result?.matchedName).toBe("PhotoHero.Title")
    expect(result?.matchedBy).toBe("subcomponent")
    // `import { PhotoHero.Title }` は書けない。PhotoHero のプロパティ。
    expect(result?.importable).toBe(false)
    expect(result?.importableNames).toContain("PhotoHero")
    expect(result?.importableNames).not.toContain("PhotoHero.Title")
    expect(result?.compoundMembers).toContain("PhotoHero.Title")
    expect(result?.note).toContain("import { PhotoHero }")
  })

  it("importableNames にドット付きの名前を混ぜない", () => {
    const withCompound = entries.filter((e) =>
      (e.subcomponents ?? []).some((s) => s.includes(".")),
    )
    expect(withCompound.length).toBeGreaterThan(0)

    for (const entry of withCompound) {
      const result = getComponent(entry.name)
      for (const name of result?.importableNames ?? []) {
        expect(name, `${entry.name} の importableNames`).not.toContain(".")
      }
    }
  })
})

describe("getComponent — 非推奨エイリアス", () => {
  // contracts 側の deprecatedAliases は現在空（eslint/deprecated.js の DEPRECATED と同期）。
  // 実データでは検証できないので loader を差し替えて挙動を固定する。
  it("互換のため import は通る（importable:true）が deprecated として印を付ける", async () => {
    vi.resetModules()
    vi.doMock("../src/utils/loader.js", () => ({
      loadComponents: () => ({
        meta: {},
        ui: [
          {
            name: "NewThing",
            path: "src/components/ui/new-thing.tsx",
            deprecatedAliases: ["OldThing"],
          },
        ],
        patterns: [],
        commerce: [],
        admin: [],
        shells: [],
      }),
    }))

    const { getComponent: withStub } = await import("../src/tools/get-component.js")
    const result = withStub("OldThing")

    expect(result?.matchedName).toBe("OldThing")
    expect(result?.matchedBy).toBe("deprecatedAlias")
    // contracts-export-integrity が「旧名は実 export のままであること」を固定している。
    // import が通る以上 importable:false は事実に反する。
    expect(result?.importable).toBe(true)
    expect(result?.deprecated).toBe(true)
    expect(result?.note).toContain("非推奨")
    expect(result?.note).toContain("NewThing")
    // 推奨名の一覧に旧名は載せない
    expect(result?.importableNames).toEqual(["NewThing"])

    vi.doUnmock("../src/utils/loader.js")
    vi.resetModules()
  })

  it("非推奨でない名前には deprecated を付けない", () => {
    expect(getComponent("Button")?.deprecated).toBeUndefined()
  })
})

describe("getComponent — 解決順", () => {
  it("大文字小文字を区別する完全一致が先に当たる（Toast は型 / toast は値）", () => {
    // 同じエントリに name "Toast"（型のみ export = import 不可）と
    // subcomponent "toast"（値 export = import 可）が同居している。
    // 大小を区別せずに引くと両者を取り違える。
    const value = getComponent("toast")
    expect(value?.matchedName).toBe("toast")
    expect(value?.matchedBy).toBe("subcomponent")
    expect(value?.importable).toBe(true)

    const type = getComponent("Toast")
    expect(type?.matchedName).toBe("Toast")
    expect(type?.matchedBy).toBe("name")
    expect(type?.importable).toBe(false)
  })

  it("同名エントリがある場合は import できる側を返す", () => {
    // `Form` は ui/form.tsx（実 export）と patterns/form.tsx（exported:false）の両方にある。
    const result = getComponent("Form")
    expect(result?.path).toBe("src/components/ui/form.tsx")
    expect(result?.importable).toBe(true)
  })

  it("aliases 経由で別名 export された同名コンポーネントを解決できる（#260, #266フォローアップ）", () => {
    // ui/form の FormField は patterns/form-field の FormField と同名衝突を避けるため
    // index.ts で RhfFormField として export される。contracts 上は aliases: ["RhfFormField"]
    // として Form エントリに紐付いており、その名前で検索・解決できる必要がある。
    const result = getComponent("RhfFormField")
    expect(result?.path).toBe("src/components/ui/form.tsx")
    expect(result?.matchedName).toBe("RhfFormField")
    expect(result?.matchedBy).toBe("alias")
    expect(result?.importable).toBe(true)
  })
})
