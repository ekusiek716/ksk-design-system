import * as React from "react";
export declare const AUTO_PROMPT_SUPPRESSION_EVENT = "ksk:auto-prompt-suppression";
export type PromptSlotStatus = "idle" | "queued" | "active";
export interface PromptSlotOptions {
    priority?: number;
}
export interface PromptSlot {
    status: PromptSlotStatus;
    active: boolean;
    request: () => void;
    release: () => void;
    cancel: () => void;
}
export interface PromptCoordinatorSnapshot {
    activeId: string | null;
    queuedIds: string[];
    suppressed: boolean;
    suppress: (reason?: string) => () => void;
}
export interface PromptCoordinatorProviderProps {
    children: React.ReactNode;
    gapMs?: number;
}
export interface AutoPromptRenderProps {
    open: boolean;
    status: PromptSlotStatus;
    close: () => void;
}
export interface AutoPromptProps extends PromptSlotOptions {
    id: string;
    when: boolean;
    children: (props: AutoPromptRenderProps) => React.ReactNode;
}
interface PromptCoordinatorContextValue extends PromptCoordinatorSnapshot {
    request: (id: string, priority: number) => void;
    release: (id: string) => void;
    cancel: (id: string) => void;
    statusOf: (id: string) => PromptSlotStatus;
}
export declare function isAutoPromptSuppressed(): boolean;
export declare function suppressAutoPrompts(reason?: string): () => void;
export declare function PromptCoordinatorProvider({ children, gapMs, }: PromptCoordinatorProviderProps): React.FunctionComponentElement<React.ProviderProps<PromptCoordinatorContextValue>>;
export declare function usePromptSlot(id: string, { priority }?: PromptSlotOptions): PromptSlot;
export declare function usePromptCoordinator(): PromptCoordinatorSnapshot;
export declare function AutoPrompt({ id, priority, when, children, }: AutoPromptProps): React.ReactNode;
export {};
