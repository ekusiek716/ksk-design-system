import * as React from "react"
import { Accordion as AccordionPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

type AccordionSize = "default" | "lg"

/**
 * issue #600: Accordion の size は Root で指定し、Item/Trigger/Content へ
 * context 経由で伝える（第一候補）。Trigger/Content の個別 size prop での
 * 上書きも許可する — LP の FAQ の中で一部の項目だけ強調したい、といった
 * 部分的な混在を禁止する理由が無く、他の DS コンポーネント（Button 等）も
 * 個別指定を妨げないため。既定値は "default" で、指定しなければ見た目は
 * 変わらない。
 */
const AccordionSizeContext = React.createContext<AccordionSize>("default")

function useAccordionSize(sizeProp: AccordionSize | undefined): AccordionSize {
  const contextSize = React.useContext(AccordionSizeContext)
  return sizeProp ?? contextSize
}

function Accordion({
  size = "default",
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root> & { size?: AccordionSize }) {
  return (
    <AccordionSizeContext.Provider value={size}>
      <AccordionPrimitive.Root data-slot="accordion" {...props} />
    </AccordionSizeContext.Provider>
  )
}

function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b border-[var(--Border-Low-Emphasis)]", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  size,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & { size?: AccordionSize }) {
  const resolvedSize = useAccordionSize(size)
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        data-size={resolvedSize}
        className={cn(
          "flex flex-1 items-center justify-between text-[var(--Text-High-Emphasis)] transition-all cursor-pointer",
          resolvedSize === "lg" ? "py-6 typo-label-lg" : "py-4 typo-label-md",
          "hover:underline [&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 transition-transform duration-[var(--Motion-Duration-Base)]">
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  size,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content> & { size?: AccordionSize }) {
  const resolvedSize = useAccordionSize(size)
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      data-size={resolvedSize}
      className={cn(
        "overflow-hidden text-[var(--Text-High-Emphasis)] data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up",
        resolvedSize === "lg" ? "typo-body-lg" : "typo-body-md"
      )}
      {...props}
    >
      <div className={cn("pb-4 pt-0", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
export type { AccordionSize }
