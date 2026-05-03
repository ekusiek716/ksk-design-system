import * as React from "react";
interface ErrorStateProps extends React.ComponentProps<"div"> {
    icon?: React.ReactNode;
    title?: string;
    description?: string;
    onRetry?: () => void;
    retryLabel?: string;
}
declare function ErrorState({ className, icon, title, description, onRetry, retryLabel, ...props }: ErrorStateProps): import("react/jsx-runtime").JSX.Element;
export { ErrorState };
