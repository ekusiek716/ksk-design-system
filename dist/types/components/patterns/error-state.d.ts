import * as React from "react";
type ErrorStateKind = "error" | "notFound";
type NotFoundIllustrationProps = React.ComponentProps<"svg">;
declare function NotFoundIllustration({ className, "aria-hidden": ariaHidden, ...props }: NotFoundIllustrationProps): React.JSX.Element;
interface ErrorStateProps extends React.ComponentProps<"div"> {
    kind?: ErrorStateKind;
    icon?: React.ReactNode;
    title?: string;
    description?: string;
    action?: React.ReactNode;
    onRetry?: () => void;
    retryLabel?: string;
}
declare function ErrorState({ className, kind, icon, title, description, action, onRetry, retryLabel, ...props }: ErrorStateProps): React.JSX.Element;
export { ErrorState, NotFoundIllustration };
export type { ErrorStateKind, ErrorStateProps, NotFoundIllustrationProps, };
