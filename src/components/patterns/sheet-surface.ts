type SheetSurface = "default" | "glass"

const sheetSurfaceClasses: Record<SheetSurface, string | undefined> = {
  default: undefined,
  glass: "glass-strong",
}

export { sheetSurfaceClasses }
export type { SheetSurface }
