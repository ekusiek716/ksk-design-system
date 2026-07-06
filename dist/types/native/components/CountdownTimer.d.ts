import React from "react";
export interface CountdownTimerProps {
    /** UNIX ミリ秒 or Date */
    target: number | Date;
    onComplete?: () => void;
    tone?: "neutral" | "accent" | "caution";
}
export declare function CountdownTimer({ target, onComplete, tone }: CountdownTimerProps): React.JSX.Element;
