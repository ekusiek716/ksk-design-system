/** Resolve focus inside open shadow roots, or a supplied closed shadow root. */
export function getActiveElement(from?: Node | null): Element | null {
  const owner = from?.ownerDocument ?? (typeof document === "undefined" ? null : document)
  if (!owner) return null
  const root = from?.getRootNode()
  let active = root && "activeElement" in root
    ? (root as Document | ShadowRoot).activeElement
    : owner.activeElement
  // The document points at the host. Follow each open root to the actual control.
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement
  return active
}
