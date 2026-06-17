export interface SwitchProps {
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    disabled?: boolean;
}
/**
 * DS トークン駆動の Switch。
 *
 * react-native-web の標準 Switch は thumbColor が無視されて Material Teal が
 * 出てしまうため、Pressable + View で自前実装。Web / iOS / Android で完全に
 * 同じ見た目（テーマカラー連動）になる。
 *
 * 役割は標準 Switch と同等: value / onValueChange / disabled。
 */
export declare function Switch({ value, onValueChange, disabled }: SwitchProps): import("react/jsx-runtime").JSX.Element;
