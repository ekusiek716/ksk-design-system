import { type SwitchProps as RNSwitchProps } from "react-native";
export interface SwitchProps extends Omit<RNSwitchProps, "trackColor" | "thumbColor"> {
}
export declare function Switch(props: SwitchProps): import("react/jsx-runtime").JSX.Element;
