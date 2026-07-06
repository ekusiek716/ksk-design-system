import * as React from "react";
interface ErrorStateProps extends React.ComponentProps<"div"> {
    icon?: React.ReactNode;
    title?: string;
    description?: string;
    onRetry?: () => void;
    retryLabel?: string;
}
declare function ErrorState({ className, icon, title, description, onRetry, retryLabel, ...props }: ErrorStateProps): React.JSX.Element;
export { ErrorState };
