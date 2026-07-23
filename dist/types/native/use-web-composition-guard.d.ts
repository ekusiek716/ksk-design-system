import * as React from "react";
import { type TextInput } from "react-native";
export declare function useWebCompositionGuard(ref: React.RefObject<TextInput | null>, onStart: () => void, onEnd: (value: string) => void): void;
