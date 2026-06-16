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
}

export interface PrototypeEntry {
  slug: string
  meta: PrototypeMeta
  Component: ComponentType
}

const modules = import.meta.glob("./*.tsx", { eager: true }) as Record<
  string,
  { default?: ComponentType; meta?: PrototypeMeta }
>

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
