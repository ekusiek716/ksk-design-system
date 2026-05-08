import type { TokenEntry } from "../utils/loader.js";
interface TokenResult {
    category: string;
    tokens: TokenEntry[];
    count: number;
}
export declare function getToken(category: string): TokenResult;
export {};
