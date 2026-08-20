import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * リンク項目を消費側のルーターコンポーネントで描画するためのレンダースロット。
 *
 * 渡された props（`href` / `className` / `children` / `aria-label`）を
 * **そのまま**転送すること。className を落とすとフッターの配色・hover が失われる。
 * Button の `asChild` と同じ思想で、DS 側は見た目、消費側は遷移方法を担う。
 *
 * @example
 * render: (p) => <Link href={p.href!} className={p.className}>{p.children}</Link>
 */
type FooterLinkRender = (props: {
  href?: string
  className?: string
  children: React.ReactNode
  "aria-label"?: string
}) => React.ReactElement

interface FooterLink {
  label: string
  href?: string
  onClick?: () => void
  /** next/link 等で描画したいときのレンダースロット。@see FooterLinkRender */
  render?: FooterLinkRender
}

interface FooterSocialLink {
  label: string
  href?: string
  icon: React.ReactNode
  /** next/link 等で描画したいときのレンダースロット。@see FooterLinkRender */
  render?: FooterLinkRender
}

interface FooterLinkGroup {
  title: string
  links: FooterLink[]
}

interface FooterProps {
  logo?: React.ReactNode
  linkGroups?: FooterLinkGroup[]
  /**
   * 決済ブランドのバッジ文字列。**既定は空**（v1.62.0 で `[]` に変更）。
   * 表示したい場合のみ明示的に渡す: `paymentIcons={["VISA", "Master", "JCB"]}`
   */
  paymentIcons?: string[]
  socialLinks?: FooterSocialLink[]
  /**
   * リンク以外の短い案内文・補足を置く枠。
   * linkGroups の**下**・socialLinks の**上**、フッター本文幅いっぱいに描画される。
   *
   * 想定する中身: 事業者表記・特商法などの短い注記、ニュースレター登録の 1 行、
   * アプリバッジなどの小さな画像。
   * 置かないもの: ナビゲーションリンク（`linkGroups`）、SNS アイコン（`socialLinks`）、
   * 著作権表記（`copyright`）。縦に長いブロックを入れるとフッターの重心が崩れる。
   */
  extra?: React.ReactNode
  copyright?: string
  className?: string
}

function renderFooterLink(
  link: { href?: string; onClick?: () => void; render?: FooterLinkRender },
  options: { className: string; children: React.ReactNode; ariaLabel?: string }
) {
  if (link.render) {
    return link.render({
      href: link.href,
      className: options.className,
      children: options.children,
      "aria-label": options.ariaLabel,
    })
  }
  if (link.href) {
    return (
      <a
        href={link.href}
        onClick={link.onClick}
        aria-label={options.ariaLabel}
        className={options.className}
      >
        {options.children}
      </a>
    )
  }
  return (
    <button
      type="button"
      onClick={link.onClick}
      aria-label={options.ariaLabel}
      className={options.className}
    >
      {options.children}
    </button>
  )
}

function Footer({
  logo,
  linkGroups = [],
  paymentIcons = [],
  socialLinks = [],
  extra,
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
                  {group.links.map((link, j) => (
                    <li key={j}>
                      {renderFooterLink(link, {
                        className:
                          "typo-body-sm text-[var(--Text-on-Inverse)]/70 hover:text-[var(--Text-on-Inverse)] transition-colors",
                        children: link.label,
                      })}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Extra slot（リンク以外の短い案内文・補足） */}
        {extra && (
          <div className="mb-6 typo-body-sm text-[var(--Text-on-Inverse)]/70">
            {extra}
          </div>
        )}

        {/* Social links */}
        {socialLinks.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6">
            {socialLinks.map((s, i) => (
              <React.Fragment key={i}>
                {renderFooterLink(s, {
                  className:
                    "size-9 shrink-0 rounded-full bg-[var(--Object-on-Inverse)]/10 hover:bg-[var(--Object-on-Inverse)]/20 flex items-center justify-center transition-colors",
                  children: s.icon,
                  ariaLabel: s.label,
                })}
              </React.Fragment>
            ))}
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
          <p className="typo-body-xs text-[var(--Text-on-Inverse)]/60 border-t border-[var(--Object-on-Inverse)]/10 pt-4">
            {copyright}
          </p>
        )}
      </div>
    </footer>
  )
}

export { Footer }
export type { FooterProps, FooterLinkGroup, FooterLink, FooterSocialLink, FooterLinkRender }
