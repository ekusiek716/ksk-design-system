import type { Meta, StoryObj } from "@storybook/react"
import { SectionNav } from "./section-nav"

const items = [
  { key: "overview", label: "概要", href: "#section-nav-overview" },
  { key: "usage", label: "使い方", href: "#section-nav-usage" },
  { key: "accessibility", label: "アクセシビリティ", href: "#section-nav-a11y" },
]

const meta: Meta<typeof SectionNav> = {
  title: "Components/SectionNav",
  component: SectionNav,
  tags: ["autodocs"],
  args: {
    items,
    activeKey: "usage",
  },
}
export default meta

type Story = StoryObj<typeof SectionNav>

export const Vertical: Story = {
  render: (args) => (
    <div className="w-64">
      <SectionNav {...args} />
    </div>
  ),
}

export const Horizontal: Story = {
  args: { orientation: "horizontal" },
}

export const StickyGuide: Story = {
  render: (args) => (
    <div className="h-[420px] w-full max-w-2xl overflow-y-auto rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]">
      <SectionNav
        {...args}
        orientation="horizontal"
        className="sticky top-0 z-10 bg-[var(--Surface-Primary)]"
      />
      <div className="flex flex-col gap-10 p-6">
        <section id="section-nav-overview" className="scroll-mt-16">
          <h2 className="typo-heading-md text-[var(--Text-High-Emphasis)]">概要</h2>
          <p className="mt-2 typo-body-md text-[var(--Text-Medium-Emphasis)]">
            SectionNav は同じページ内の現在地と移動先を示します。
          </p>
        </section>
        <section id="section-nav-usage" className="scroll-mt-16">
          <h2 className="typo-heading-md text-[var(--Text-High-Emphasis)]">使い方</h2>
          <p className="mt-2 typo-body-md text-[var(--Text-Medium-Emphasis)]">
            sticky は利用側、移動先の scroll margin は各 section が担当します。
          </p>
        </section>
        <section id="section-nav-a11y" className="scroll-mt-16">
          <h2 className="typo-heading-md text-[var(--Text-High-Emphasis)]">
            アクセシビリティ
          </h2>
          <p className="mt-2 typo-body-md text-[var(--Text-Medium-Emphasis)]">
            現在地には aria-current=&quot;location&quot; が付きます。
          </p>
        </section>
      </div>
    </div>
  ),
}
