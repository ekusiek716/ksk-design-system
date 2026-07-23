import * as React from "react";
interface UseCarouselControllerOptions {
    total: number;
    autoPlay: number;
    paused?: boolean;
}
declare function useCarouselController({ total, autoPlay, paused, }: UseCarouselControllerOptions): {
    active: number;
    goTo: (index: number) => void;
    next: () => void;
    previous: () => void;
    scrollRef: React.RefObject<HTMLDivElement>;
};
interface CarouselControlsProps {
    active: number;
    total: number;
    showArrows: boolean;
    showDots: boolean;
    onPrevious: () => void;
    onNext: () => void;
    onGoTo: (index: number) => void;
}
declare function carouselControls({ active, total, showArrows, showDots, onPrevious, onNext, onGoTo, }: CarouselControlsProps): React.JSX.Element;
export { carouselControls, useCarouselController };
