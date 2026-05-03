import * as React from "react";
type SocialProvider = "line" | "google" | "apple" | "amazon";
interface SocialLoginButtonProps extends React.ComponentProps<"button"> {
    provider: SocialProvider;
    loading?: boolean;
    fullWidth?: boolean;
}
declare function SocialLoginButton({ provider, loading, fullWidth, className, disabled, children, ...props }: SocialLoginButtonProps): import("react/jsx-runtime").JSX.Element;
export { SocialLoginButton };
export type { SocialLoginButtonProps, SocialProvider };
