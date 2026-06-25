import * as React from "react"
import { cn } from "@/lib/utils"

interface FooterLinkGroup {
  title: string
  links: { label: string; href?: string; onClick?: () => void }[]
}

interface FooterProps {
  logo?: React.ReactNode
  linkGroups?: FooterLinkGroup[]
  paymentIcons?: string[]
  socialLinks?: { label: string; href?: string; icon: React.ReactNode }[]
  copyright?: string
  className?: string
}

const DEFAULT_PAYMENTS = ["VISA", "Master", "JCB", "AmEx", "PayPay", "LINE Pay"]

function Footer({
  logo,
  linkGroups = [],
  paymentIcons = DEFAULT_PAYMENTS,
  socialLinks = [],
  copyright,
  className,
}: FooterProps) {
  return (
    <footer
      data-slot="footer"
      className={cn(
        "bg-[var(--Surface-Inverse)] text-[var(--Text-on-Inverse)] w-full",
        className
      )}
    >
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Logo */}
        {logo && <div className="mb-8">{logo}</div>}

        {/* Link groups */}
        {linkGroups.length > 0 && (
          <div
            className="grid gap-8 mb-8"
            style={{ gridTemplateColumns: `repeat(${Math.min(linkGroups.length, 4)}, minmax(0, 1fr))` }}
          >
            {linkGroups.map((group, i) => (
              <div key={i}>
                <h4 className="typo-label-xs font-bold uppercase tracking-wider text-[var(--Text-on-Inverse)]/50 mb-3">
                  {group.title}
                </h4>
                <ul className="flex flex-col gap-2">
                  {group.links.map((link, j) => {
                    const Tag = link.href ? "a" : "button"
                    return (
                      <li key={j}>
                        <Tag
                          href={link.href}
                          onClick={link.onClick}
                          className="typo-body-sm text-[var(--Text-on-Inverse)]/70 hover:text-[var(--Text-on-Inverse)] transition-colors"
                        >
                          {link.label}
                        </Tag>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Social links */}
        {socialLinks.length > 0 && (
          <div className="flex gap-3 mb-6">
            {socialLinks.map((s, i) => {
              const Tag = s.href ? "a" : "button"
              return (
                <Tag
                  key={i}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-[var(--Object-on-Inverse)]/10 hover:bg-[var(--Object-on-Inverse)]/20 flex items-center justify-center transition-colors"
                >
                  {s.icon}
                </Tag>
              )
            })}
          </div>
        )}

        {/* Payment icons */}
        {paymentIcons.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {paymentIcons.map((p, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded bg-[var(--Object-on-Inverse)]/10 text-[var(--Text-on-Inverse)]/60 typo-label-xs"
              >
                {p}
              </span>
            ))}
          </div>
        )}

        {/* Copyright */}
        {copyright && (
          <p className="typo-body-xs text-[var(--Text-on-Inverse)]/30 border-t border-[var(--Object-on-Inverse)]/10 pt-4">
            {copyright}
          </p>
        )}
      </div>
    </footer>
  )
}

export { Footer }
export type { FooterProps, FooterLinkGroup }
