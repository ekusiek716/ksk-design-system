export interface VisualViewportKeyboardState {
    keyboardInset: number;
    visibleHeight: number | null;
    isKeyboardOpen: boolean;
}
declare function computeVisualViewportKeyboardState(layoutHeight: number, visualHeight: number, visualOffsetTop: number): VisualViewportKeyboardState;
declare function useVisualViewportKeyboardInset(): VisualViewportKeyboardState;
export { computeVisualViewportKeyboardState, useVisualViewportKeyboardInset };
