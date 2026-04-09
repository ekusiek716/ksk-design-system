import * as React from "react"
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

function ResponsiveDialogContent({ children, className, ...props }: React.ComponentProps<typeof DialogContent>) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  if (isDesktop) return <DialogContent className={className} {...props}>{children}</DialogContent>
  return <SheetContent side="bottom" className={className}>{children}</SheetContent>
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

function ResponsiveDialogFooter({ children, ...props }: React.ComponentProps<"div">) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  if (isDesktop) return <DialogFooter {...props}>{children}</DialogFooter>
  return <div data-slot="sheet-footer" className="flex flex-col gap-2 mt-auto" {...props}>{children}</div>
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
