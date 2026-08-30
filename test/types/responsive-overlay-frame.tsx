import { ResponsiveOverlayFrame } from "../../src/components/patterns/responsive-overlay-frame"

// side="bottom"（既定）は preset / surface / desktopPosition を持つ
const bottomDefault = <ResponsiveOverlayFrame preset="mobile-page">本文</ResponsiveOverlayFrame>
const bottomExplicit = (
  <ResponsiveOverlayFrame side="bottom" preset="mobile-full" surface="glass" desktopPosition="fullscreen">
    本文
  </ResponsiveOverlayFrame>
)

// float 系は padding を持つ
const float = <ResponsiveOverlayFrame side="float">本文</ResponsiveOverlayFrame>
const floatNoPadding = (
  <ResponsiveOverlayFrame side="float" padding={false}>
    本文
  </ResponsiveOverlayFrame>
)
const floatGlass = <ResponsiveOverlayFrame side="float-glass">本文</ResponsiveOverlayFrame>

// @ts-expect-error side="bottom" は preset が余白を持つため padding を受け付けない
const bottomWithPadding = <ResponsiveOverlayFrame padding={false}>本文</ResponsiveOverlayFrame>

// @ts-expect-error float 系は配置を side が決めるため preset を受け付けない
const floatWithPreset = <ResponsiveOverlayFrame side="float" preset="mobile-form">本文</ResponsiveOverlayFrame>

// @ts-expect-error float-glass の素材は side 自身が決めるため surface と併用できない（ガラスの二重適用防止）
const floatGlassWithSurface = <ResponsiveOverlayFrame side="float-glass" surface="glass">本文</ResponsiveOverlayFrame>

// @ts-expect-error float 系は常に中央なので desktopPosition を受け付けない
const floatFullscreen = <ResponsiveOverlayFrame side="float" desktopPosition="fullscreen">本文</ResponsiveOverlayFrame>

void [
  bottomDefault, bottomExplicit, float, floatNoPadding, floatGlass,
  bottomWithPadding, floatWithPreset, floatGlassWithSurface, floatFullscreen,
]
