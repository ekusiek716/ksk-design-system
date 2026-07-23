import type { Meta, StoryObj } from "@storybook/react"
import { Container } from "./container"
import { Section } from "./section"

const meta: Meta<typeof Section> = {
  title: "Components/Layout/Section",
  component: Section,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof Section>

export const FullBleedBandWithContainedContent: Story = {
  render: () => (
    <>
      <Section spacing="lg" background="subtle">
        <Container size="page">
          <h2 className="typo-heading-2xl text-[var(--Text-High-Emphasis)]">
            背景は画面端まで、内容は中央寄せ
          </h2>
          <p className="mt-3 typo-body-md text-[var(--Text-Medium-Emphasis)]">
            Section は縦余白と背景、Container は最大幅と左右 gutter を担当します。
          </p>
        </Container>
      </Section>
      <Section spacing="md" background="accent-subtle">
        <Container size="narrow">
          <p className="typo-body-md text-[var(--Text-High-Emphasis)]">
            責務を分けることで左右 padding の二重がけを防ぎます。
          </p>
        </Container>
      </Section>
    </>
  ),
}
