type ShareProvider = "line" | "x" | "facebook" | "copy";
type ShareLayout = "circle" | "inline";
interface ShareButtonsProps {
    url: string;
    title?: string;
    providers?: ShareProvider[];
    layout?: ShareLayout;
    className?: string;
    onCopy?: () => void;
}
declare function ShareButtons({ url, title, providers, layout, className, onCopy, }: ShareButtonsProps): import("react/jsx-runtime").JSX.Element;
export { ShareButtons };
export type { ShareButtonsProps, ShareProvider, ShareLayout };
