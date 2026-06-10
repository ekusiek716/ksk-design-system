/**
 * @file 全コンポーネント・ギャラリー
 * @description src/components 配下の全ストーリーを import.meta.glob で自動収集し、
 *   各コンポーネントの代表ストーリーを実物プレビューとしてタイル表示する。
 *   新しいコンポーネント／ストーリーを追加すれば自動的にここへ並ぶ（手動メンテ不要）。
 */
import type { Meta, StoryObj } from "@storybook/react"
import { composeStories } from "@storybook/react"
import * as React from "react"

// src/components 配下の全ストーリーモジュールを収集（このファイル自身は src/stories なので含まれない）
const modules = import.meta.glob("../components/**/*.stories.@(ts|tsx)", {
  eager: true,
}) as Record<string, Record<string, unknown>>

/** Storybook の story id 生成に合わせた sanitize */
function sanitize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/** 代表ストーリーとして優先的に選ぶ export 名 */
const PREFERRED = ["Default", "Basic", "Playground", "Primary", "Overview", "Showcase"]

type Item = {
  /** "Components/Button" 等のフルタイトル */
  title: string
  /** トップカテゴリ（Components / Shells など） */
  group: string
  /** 表示名（タイトル末尾セグメント） */
  label: string
  /** Storybook の story id（リンク用） */
  id: string
  Comp: React.ComponentType
}

const items: Item[] = []
for (const path in modules) {
  const mod = modules[path]
  const meta = mod.default as { title?: string } | undefined
  if (!meta?.title) continue

  let composed: Record<string, React.ComponentType & { id?: string }>
  try {
    composed = composeStories(mod as never) as never
  } catch {
    continue
  }

  const keys = Object.keys(composed)
  if (keys.length === 0) continue

  const key = PREFERRED.find((p) => keys.includes(p)) ?? keys[0]
  const Comp = composed[key]
  const segments = meta.title.split("/")

  // 遷移先 id は composeStories が持つ実 id を最優先。無ければ
  // export 名（表示名ではない）を sanitize して Storybook の toId 仕様に合わせる
  const id = Comp.id ?? `${sanitize(meta.title)}--${sanitize(key)}`

  items.push({
    title: meta.title,
    group: segments[0],
    label: segments[segments.length - 1],
    id,
    Comp,
  })
}

items.sort((a, b) => a.title.localeCompare(b.title, "en"))

// グループ順（既知カテゴリを先頭に、残りはアルファベット順）
const GROUP_ORDER = ["Components", "Shells", "Patterns"]
const groups = Array.from(new Set(items.map((i) => i.group))).sort((a, b) => {
  const ia = GROUP_ORDER.indexOf(a)
  const ib = GROUP_ORDER.indexOf(b)
  if (ia !== -1 && ib !== -1) return ia - ib
  if (ia !== -1) return -1
  if (ib !== -1) return 1
  return a.localeCompare(b, "en")
})

/** 1 コンポーネントが壊れても他を巻き込まないための境界 */
class TileBoundary extends React.Component<
  { children: React.ReactNode },
  { errored: boolean }
> {
  state = { errored: false }
  static getDerivedStateFromError() {
    return { errored: true }
  }
  render() {
    if (this.state.errored) {
      return (
        <span style={{ color: "var(--Text-Low-Emphasis, #9ca3af)", fontSize: 12 }}>
          プレビュー不可
        </span>
      )
    }
    return this.props.children
  }
}

/** プレビューの論理幅。w-full 系が潰れて折り返さないよう十分な幅で組んでから縮小する */
const PREVIEW_WIDTH = 400
const PREVIEW_HEIGHT = 200

function Tile({ item }: { item: Item }) {
  const { Comp } = item
  const boxRef = React.useRef<HTMLDivElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [scale, setScale] = React.useState(1)

  // 実寸で組んだ中身を、タイル枠に収まるよう縮小フィットさせる
  React.useLayoutEffect(() => {
    const box = boxRef.current
    const content = contentRef.current
    if (!box || !content) return
    const fit = () => {
      const availW = box.clientWidth - 24
      const availH = box.clientHeight - 24
      const w = content.offsetWidth
      const h = content.offsetHeight
      if (!w || !h) return
      setScale(Math.min(1, availW / w, availH / h))
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(box)
    ro.observe(content)
    return () => ro.disconnect()
  }, [])

  // 中のコンポーネントが <a> を持つことがあるため、外側はあえて <a> にせず
  // div + onClick で親フレーム（Storybook マネージャ）を遷移させる
  const open = () => {
    const target = window.top ?? window
    target.location.href = `/?path=/story/${item.id}`
  }
  return (
    <div
      role="link"
      tabIndex={0}
      data-story-id={item.id}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          open()
        }
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        color: "inherit",
        border: "1px solid var(--Border-Primary, #e5e7eb)",
        borderRadius: 12,
        overflow: "hidden",
        background: "var(--Surface-Primary, #fff)",
      }}
    >
      <div
        ref={boxRef}
        style={{
          position: "relative",
          height: PREVIEW_HEIGHT,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // position:fixed な子（bottom-tab-bar 等）をタイル内に閉じ込めるため
          // transform で containing block を作る
          transform: "translateZ(0)",
        }}
      >
        <div style={{ transform: `scale(${scale})`, transformOrigin: "center" }}>
          {/* 実寸で組んでから scale。中身は装飾なので操作不可に */}
          <div ref={contentRef} style={{ width: PREVIEW_WIDTH, pointerEvents: "none" }}>
            <TileBoundary>
              <Comp />
            </TileBoundary>
          </div>
        </div>
      </div>
      <div
        style={{
          padding: "10px 14px",
          borderTop: "1px solid var(--Border-Primary, #e5e7eb)",
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        {item.label}
        <span
          style={{
            display: "block",
            fontSize: 11,
            fontWeight: 400,
            color: "var(--Text-Low-Emphasis, #9ca3af)",
            marginTop: 2,
          }}
        >
          {item.title}
        </span>
      </div>
    </div>
  )
}

function Gallery() {
  return (
    <div style={{ padding: 24, fontFamily: "var(--font-sans, system-ui, sans-serif)" }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>全コンポーネント一覧</h1>
        <p style={{ color: "var(--Text-Medium-Emphasis, #6b7280)", margin: "6px 0 0" }}>
          {items.length} コンポーネント。カードをクリックすると各ストーリーへ移動します。
        </p>
      </header>

      {groups.map((group) => {
        const groupItems = items.filter((i) => i.group === group)
        return (
          <section key={group} style={{ marginBottom: 36 }}>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 700,
                margin: "0 0 14px",
                paddingBottom: 8,
                borderBottom: "2px solid var(--Border-Primary, #e5e7eb)",
              }}
            >
              {group}
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 400,
                  color: "var(--Text-Low-Emphasis, #9ca3af)",
                  marginLeft: 8,
                }}
              >
                {groupItems.length}
              </span>
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 16,
              }}
            >
              {groupItems.map((item, i) => (
                <Tile key={`${item.title}-${item.id}-${i}`} item={item} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

const meta: Meta = {
  title: "Foundation/Gallery",
  parameters: {
    layout: "fullscreen",
    // ギャラリー自体は Docs 自動生成・Controls 不要
    options: { showPanel: false },
  },
  tags: ["!autodocs"],
}
export default meta

export const AllComponents: StoryObj = {
  name: "全コンポーネント",
  render: () => <Gallery />,
}
