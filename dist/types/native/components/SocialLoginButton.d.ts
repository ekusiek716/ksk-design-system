export type SocialProvider = "google" | "apple" | "line" | "amazon" | "github" | "x";
export interface SocialLoginButtonProps {
    provider: SocialProvider;
    label?: string;
    onPress?: () => void;
    disabled?: boolean;
}
export declare function SocialLoginButton({ provider, label, onPress, disabled, }: SocialLoginButtonProps): import("react/jsx-runtime").JSX.Element;
