import type { Meta, StoryObj } from "@storybook/react"
import tokens from "../../tokens.json"

const meta: Meta = {
  title: "StyleGuide/Breakpoints",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
}
export default meta

type Story = StoryObj

const viewportBreakpoints = Object.entries(tokens.breakpoints.viewport)
const containerBreakpoints = Object.entries(tokens.breakpoints.container).filter(
  ([name]) => name !== "_doc",
) as [string, { value: string; tailwindPrefix: string }][]

export const RolesAndValues: Story = {
  name: "切替段・上限段・Container Query",
  render: () => (
    <div className="flex max-w-4xl flex-col gap-10">
      <header>
        <h1 className="typo-heading-2xl text-[var(--Text-High-Emphasis)]">
          Responsive Breakpoints
        </h1>
        <p className="mt-2 typo-body-md text-[var(--Text-Medium-Emphasis)]">
          値の正本は tokens.json。viewport と @container は同名でも別スケールです。
        </p>
      </header>

      <section>
        <h2 className="mb-4 typo-heading-lg text-[var(--Text-High-Emphasis)]">
          Viewport
        </h2>
        <div className="overflow-hidden rounded-lg border border-[var(--Border-Low-Emphasis)]">
          {viewportBreakpoints.map(([name, breakpoint]) => (
            <div
              key={name}
              className="grid grid-cols-[80px_100px_120px_1fr] gap-4 border-b border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] px-4 py-3 last:border-b-0"
            >
              <code className="typo-label-md text-[var(--Text-Accent-Primary)]">
                {name}
              </code>
              <span className="typo-label-sm text-[var(--Text-High-Emphasis)]">
                {breakpoint.value}
              </span>
              <span className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">
                {breakpoint.role === "switch" ? "切替段" : "上限段"}
              </span>
              <span className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">
                {breakpoint.meaning}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 rounded-lg bg-[var(--Surface-Warning)] p-4 typo-body-sm text-[var(--Text-Warning)]">
          xl は 1280px のコンテンツ上限です。ここで新しいレイアウト変形を増やしません。
        </p>
      </section>

      <section>
        <h2 className="mb-2 typo-heading-lg text-[var(--Text-High-Emphasis)]">
          Container Query
        </h2>
        <p className="mb-4 typo-body-sm text-[var(--Text-Medium-Emphasis)]">
          @ prefix の段は親 container の幅で判定します。viewport の md / xl とは一致しません。
        </p>
        <div className="grid grid-cols-2 gap-3">
          {containerBreakpoints.map(([name, breakpoint]) => (
            <div
              key={name}
              className="rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Secondary)] p-4"
            >
              <code className="typo-label-md text-[var(--Text-Accent-Primary)]">
                {breakpoint.tailwindPrefix}
              </code>
              <p className="mt-1 typo-body-sm text-[var(--Text-High-Emphasis)]">
                {breakpoint.value}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
}
