import * as React from "react";
interface DetailSheetScaffoldProps extends React.ComponentProps<"div"> {
    header?: React.ReactNode;
    footer?: React.ReactNode;
}
interface DetailSheetHeaderProps extends Omit<React.ComponentProps<"div">, "title"> {
    title?: React.ReactNode;
    titleEditor?: React.ReactNode;
    description?: React.ReactNode;
    leading?: React.ReactNode;
    trailing?: React.ReactNode;
}
declare function DetailSheetScaffold({ className, header, footer, children, ...props }: DetailSheetScaffoldProps): React.JSX.Element;
declare function DetailSheetHeader({ className, title, titleEditor, description, leading, trailing, children, ...props }: DetailSheetHeaderProps): React.JSX.Element;
declare function DetailSheetBody({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
export { DetailSheetScaffold, DetailSheetHeader, DetailSheetBody };
export type { DetailSheetScaffoldProps, DetailSheetHeaderProps };
