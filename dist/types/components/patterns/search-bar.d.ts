import * as React from "react";
interface SearchBarProps extends Omit<React.ComponentProps<"input">, "type"> {
    onSearch?: (value: string) => void;
}
declare function SearchBar({ className, onSearch, ...props }: SearchBarProps): React.JSX.Element;
export { SearchBar };
