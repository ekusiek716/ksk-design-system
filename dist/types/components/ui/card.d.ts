import * as React from "react";
import { type VariantProps } from "class-variance-authority";
declare const cardVariants: (props?: {
    variant?: "default" | "media";
} & import("class-variance-authority/types").ClassProp) => string;
interface CardProps extends React.ComponentProps<"div">, VariantProps<typeof cardVariants> {
}
declare function Card({ className, variant, ...props }: CardProps): import("react/jsx-runtime").JSX.Element;
declare function CardHeader({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function CardTitle({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function CardDescription({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function CardAction({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function CardContent({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function CardFooter({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
export { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter, cardVariants };
export type { CardProps };
