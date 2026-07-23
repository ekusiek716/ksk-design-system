import * as React from "react"
import { cn } from "@/lib/utils"
import { Container } from "../../ui/container"
import { Section } from "../../ui/section"
import { SkipLink } from "../../ui/skip-link"

interface MarketingShellProps extends React.ComponentProps<"div"> {
  header?: React.ReactNode
  footer?: React.ReactNode
  mainId?: string
  skipLink?: boolean
  skipLinkLabel?: string | null
}

function MarketingShell({
  className,
  header,
  footer,
  mainId = "main-content",
  skipLink = true,
  skipLinkLabel = "コンテンツへ移動",
  children,
  ...props
}: MarketingShellProps) {
  return (
    <div
      data-slot="marketing-shell"
      className={cn("flex flex-col min-h-screen bg-[var(--Surface-Primary)]", className)}
      {...props}
    >
      {skipLink && skipLinkLabel && <SkipLink targetId={mainId} label={skipLinkLabel} />}
      {header && (
        <header
          data-slot="marketing-header"
          className="sticky top-0 z-40 h-16 shrink-0 border-b border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]/95 backdrop-blur"
        >
          <Container
            size="fluid"
            gutter="spacious"
            className="flex h-full items-center justify-between"
          >
            {header}
          </Container>
        </header>
      )}
      <main id={mainId} tabIndex={-1} data-slot="marketing-main" className="flex-1">
        {children}
      </main>
      {footer && (
        <Section
          as="footer"
          spacing="md"
          background="subtle"
          data-slot="marketing-footer"
          className="border-t border-[var(--Border-Low-Emphasis)]"
        >
          <Container size="fluid" gutter="spacious">
            {footer}
          </Container>
        </Section>
      )}
    </div>
  )
}

export { MarketingShell }
export type { MarketingShellProps }
