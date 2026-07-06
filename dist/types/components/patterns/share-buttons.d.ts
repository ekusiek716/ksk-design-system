import * as React from "react";
type ShareProvider = "line" | "x" | "facebook" | "copy" | "instagram" | "email" | "whatsapp" | "telegram";
type ShareLayout = "circle" | "inline";
type ShareRegion = "global" | "jp" | "us";
interface ShareButtonsProps {
    url: string;
    title?: string;
    providers?: ShareProvider[];
    region?: ShareRegion;
    layout?: ShareLayout;
    className?: string;
    onShare?: (provider: ShareProvider) => void;
    onCopy?: () => void;
}
declare function ShareButtons({ url, title, providers, region, layout, className, onShare, onCopy, }: ShareButtonsProps): React.JSX.Element;
export { ShareButtons };
export type { ShareButtonsProps, ShareProvider, ShareLayout, ShareRegion };
