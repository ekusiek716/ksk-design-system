import * as React from "react";
interface SkipLinkProps extends Omit<React.ComponentProps<"a">, "href"> {
    targetId: string;
    label?: string;
}
declare function SkipLink({ targetId, label, className, onClick, ...props }: SkipLinkProps): React.JSX.Element;
export { SkipLink };
export type { SkipLinkProps };
