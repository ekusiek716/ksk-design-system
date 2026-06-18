// =============================================================
// KSK Design System — Prototype Registry
//
// `src/prototypes/*.tsx` を import.meta.glob で自動収集する。
// ファイルを置くだけで `npm run dev`（localhost）の一覧に反映される。
// `_` で始まるファイル（_host / _registry 等のインフラ）は除外。
//
// 各プロトタイプの形式:
//   export const meta = { title, device?, notionUrl?, createdAt?, description? }
//   export default function Component() { ... }
// =============================================================
import type { ComponentType } from "react"

export interface PrototypeMeta {
  /** 一覧・ヘッダーに出すタイトル（必須） */
  title: string
  /** 主対象デバイス。フレーム初期値に使う */
  device?: "SP" | "PC" | "SP/PC"
  /** 元仕様の Notion / Asana 等の URL（任意） */
  notionUrl?: string
  /** 生成日 YYYY/MM/DD（一覧の並び順に使う） */
  createdAt?: string
  /** 一覧カードに出す一行説明 */
  description?: string
  /**
   * 同じモックの分岐をまとめるキー。同じ group の他プロトタイプは
   * 詳細画面の左カラムに「関連モック」として並ぶ（例: "admin-order"）。
   */
  group?: string
  /** 詳細画面の左カラムでバリアントを区別するためのラベル（例: "通常" / "未処理だけ"） */
  variantLabel?: string
}

export interface PrototypeEntry {
  slug: string
  meta: PrototypeMeta
  Component: ComponentType
  /** `<slug>.spec.md` の中身（任意。Markdown としてレンダーされる） */
  specSource?: string
}

const modules = import.meta.glob("./*.tsx", { eager: true }) as Record<
  string,
  { default?: ComponentType; meta?: PrototypeMeta }
>

const specs = import.meta.glob("./*.spec.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>

const specBySlug: Record<string, string> = Object.fromEntries(
  Object.entries(specs).map(([path, source]) => [
    path.replace(/^\.\//, "").replace(/\.spec\.md$/, ""),
    source,
  ]),
)

export const prototypes: PrototypeEntry[] = Object.entries(modules)
  .filter(([path]) => {
    const name = path.split("/").pop() ?? ""
    return !name.startsWith("_")
  })
  .map(([path, mod]) => {
    const slug = path.replace(/^\.\//, "").replace(/\.tsx$/, "")
    return {
      slug,
      meta: mod.meta ?? { title: slug },
      Component: mod.default ?? (() => null),
      specSource: specBySlug[slug],
    }
  })
  .filter((e) => typeof e.Component === "function")
  .sort((a, b) => {
    if (a.meta.createdAt && b.meta.createdAt && a.meta.createdAt !== b.meta.createdAt) {
      return b.meta.createdAt.localeCompare(a.meta.createdAt)
    }
    return a.slug.localeCompare(b.slug)
  })

export function findPrototype(slug: string): PrototypeEntry | undefined {
  return prototypes.find((p) => p.slug === slug)
}

/**
 * 一覧表示用のリスト。同じ `group` のバリアントは **代表 1 件に集約** する
 * （代表は `slug === group` を優先、無ければソート順の先頭）。残りのバリアントは
 * 詳細画面の「関連モック」に出るので、トップの一覧が分岐で埋まらない。
 * group を持たないプロトタイプはそのまま全件表示。
 */
export const listPrototypes: PrototypeEntry[] = (() => {
  const seen = new Set<string>()
  const result: PrototypeEntry[] = []
  for (const p of prototypes) {
    const g = p.meta.group
    if (!g) {
      result.push(p)
      continue
    }
    if (seen.has(g)) continue
    seen.add(g)
    const rep =
      prototypes.find((x) => x.meta.group === g && x.slug === g) ?? p
    result.push(rep)
  }
  return result
})()

/** 同じ group のバリアント数（代表自身を含む）。1 ならバリアントなし。 */
export function groupVariantCount(slug: string): number {
  const me = findPrototype(slug)
  if (!me?.meta.group) return 1
  return prototypes.filter((p) => p.meta.group === me.meta.group).length
}

/** 同じ group に属する他のプロトタイプを返す（自分自身は除外） */
export function findGroupSiblings(slug: string): PrototypeEntry[] {
  const me = findPrototype(slug)
  if (!me?.meta.group) return []
  return prototypes.filter((p) => p.slug !== slug && p.meta.group === me.meta.group)
}
