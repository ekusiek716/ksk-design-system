import { type NavigationBarItem } from "./NavigationBar";
export interface BottomTabBarProps {
    items: NavigationBarItem[];
    value?: string;
    onChange?: (key: string) => void;
}
/** commerce 系の TabBar。中身は NavigationBar とほぼ同じ。 */
export declare function BottomTabBar(props: BottomTabBarProps): import("react/jsx-runtime").JSX.Element;
