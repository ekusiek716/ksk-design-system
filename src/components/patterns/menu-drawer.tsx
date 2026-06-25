import * as React from "react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface MenuDrawerItem {
  label: string
  icon?: React.ReactNode
  href?: string
  onClick?: () => void
  badge?: number
}

interface MenuDrawerSection {
  title?: string
  items: MenuDrawerItem[]
}

interface MenuDrawerProps {
  open: boolean
  onClose: () => void
  /** ドロワー上部バナー（プロモーション等） */
  banner?: React.ReactNode
  sections: MenuDrawerSection[]
  /** フッターリンク群 */
  footerLinks?: MenuDrawerItem[]
  /** ドロワー幅（px） */
  width?: number
  className?: string
}

function MenuDrawer({
  open,
  onClose,
  banner,
  sections,
  footerLinks,
  width = 280,
  className,
}: MenuDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="left"
        className={cn("p-0 flex flex-col", className)}
        style={{ width }}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>メニュー</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {/* Banner */}
          {banner && (
            <div className="mx-3 mt-4 mb-2">{banner}</div>
          )}

          {/* Sections */}
          {sections.map((section, si) => (
            <div key={si} className={si > 0 ? "border-t border-[var(--Border-Low-Emphasis)] mt-2 pt-2" : "mt-2"}>
              {section.title && (
                <p className="px-4 py-1.5 typo-label-xs text-[var(--Text-Low-Emphasis)] uppercase">
                  {section.title}
                </p>
              )}
              {section.items.map((item, ii) => {
                const Tag = item.href ? "a" : "button"
                return (
                  <Tag
                    key={ii}
                    href={item.href}
                    onClick={() => { item.onClick?.(); onClose() }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 typo-label-sm text-[var(--Text-High-Emphasis)] hover:bg-[var(--Surface-Secondary)] transition-colors text-left"
                  >
                    {item.icon && (
                      <span className="w-5 h-5 flex items-center justify-center text-[var(--Text-Low-Emphasis)] shrink-0">
                        {item.icon}
                      </span>
                    )}
                    <span className="flex-1">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)] typo-label-xs flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="text-[var(--Text-Low-Emphasis)]">
                      <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Tag>
                )
              })}
            </div>
          ))}
        </div>

        {/* Footer links */}
        {footerLinks && footerLinks.length > 0 && (
          <div className="border-t border-[var(--Border-Low-Emphasis)] py-3 px-4 flex flex-wrap gap-x-4 gap-y-1">
            {footerLinks.map((link, i) => {
              const Tag = link.href ? "a" : "button"
              return (
                <Tag
                  key={i}
                  href={link.href}
                  onClick={() => { link.onClick?.(); onClose() }}
                  className="typo-body-xs text-[var(--Text-Low-Emphasis)] hover:text-[var(--Text-High-Emphasis)] transition-colors"
                >
                  {link.label}
                </Tag>
              )
            })}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

export { MenuDrawer }
export type { MenuDrawerProps, MenuDrawerSection, MenuDrawerItem }
