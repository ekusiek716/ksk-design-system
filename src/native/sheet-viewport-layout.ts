/**
 * Receives the actual Modal working area after iOS keyboard avoidance or
 * Android adjustResize. Never subtract keyboard height again here.
 */
export function resolveSheetViewportLayout(
  fullHeight: number,
  panelHeight: number,
  measuredHeight: number | null,
  keyboardOpen: boolean,
) {
  const availableHeight = measuredHeight === null || measuredHeight <= 0 ? fullHeight : measuredHeight
  return {
    availableHeight,
    panelHeight: Math.min(panelHeight, availableHeight),
    // Small subpixel layout differences must not turn a half sheet into full.
    expandToViewport: keyboardOpen && availableHeight < fullHeight - 1,
  }
}
