import * as React from "react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from "./dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose, SheetTrigger } from "./sheet"

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false)
  React.useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }, [query])
  return matches
}

interface ResponsiveDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

function ResponsiveDialog({ children, ...props }: ResponsiveDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  if (isDesktop) return <Dialog {...props}>{children}</Dialog>
  return <Sheet {...props}>{children}</Sheet>
}

function ResponsiveDialogTrigger({ children, ...props }: React.ComponentProps<typeof DialogTrigger>) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  if (isDesktop) return <DialogTrigger {...props}>{children}</DialogTrigger>
  return <SheetTrigger {...props}>{children}</SheetTrigger>
}

function ResponsiveDialogContent({
  children,
  className,
  swipeToClose,
  ...props
}: React.ComponentProps<typeof DialogContent> & {
  /**
   * SP（Sheet）側で下スワイプ閉じ（全面 scroll-aware）を有効化。
   * PC（Dialog）は中央モーダルなので無視される。絞り込みモーダル等で
   * 「SP は下スワイプで閉じたい」ときに付ける。
   */
  swipeToClose?: boolean
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  if (isDesktop) return <DialogContent className={className} {...props}>{children}</DialogContent>
  return <SheetContent side="bottom" swipeToClose={swipeToClose} className={className}>{children}</SheetContent>
}

function ResponsiveDialogHeader({ children, ...props }: React.ComponentProps<"div">) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  if (isDesktop) return <DialogHeader {...props}>{children}</DialogHeader>
  return <SheetHeader {...props}>{children}</SheetHeader>
}

function ResponsiveDialogTitle({ children, ...props }: React.ComponentProps<typeof DialogTitle>) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  if (isDesktop) return <DialogTitle {...props}>{children}</DialogTitle>
  return <SheetTitle {...props}>{children}</SheetTitle>
}

function ResponsiveDialogDescription({ children, ...props }: React.ComponentProps<typeof DialogDescription>) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  if (isDesktop) return <DialogDescription {...props}>{children}</DialogDescription>
  return <SheetDescription {...props}>{children}</SheetDescription>
}

function ResponsiveDialogFooter({
  children,
  className,
  orientation = "split",
  ...props
}: React.ComponentProps<"div"> & {
  /**
   * アクションボタンの並べ方。
   * - "split"（既定）: 均等幅で横並び（各ボタン flex-1）。iOS のボトムシート風。
   * - "stacked": 旧挙動。デスクトップは右寄せ横並び、モバイルは縦積み。
   */
  orientation?: "split" | "stacked"
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  if (isDesktop)
    return (
      <DialogFooter className={className} orientation={orientation} {...props}>
        {children}
      </DialogFooter>
    )
  return (
    <div
      data-slot="sheet-footer"
      data-orientation={orientation}
      className={cn(
        orientation === "stacked"
          ? "flex flex-col gap-2 mt-auto"
          : "flex flex-row gap-3 [&>*]:flex-1 [&>*]:basis-0 mt-auto",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function ResponsiveDialogClose({ children, ...props }: React.ComponentProps<typeof DialogClose>) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  if (isDesktop) return <DialogClose {...props}>{children}</DialogClose>
  return <SheetClose {...props}>{children}</SheetClose>
}

export {
  ResponsiveDialog, ResponsiveDialogTrigger, ResponsiveDialogContent,
  ResponsiveDialogHeader, ResponsiveDialogTitle, ResponsiveDialogDescription,
  ResponsiveDialogFooter, ResponsiveDialogClose, useMediaQuery,
}
