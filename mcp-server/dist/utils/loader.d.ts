export interface ComponentEntry {
    name: string;
    path: string;
    variants?: string[];
    sizes?: string[];
    accessibility?: string[];
    rules?: string[];
    /**
     * このエントリ配下で実際に import できる export 名。
     * exported:false のエントリでは「唯一 import できる名前」の列挙でもある。
     * キー名は contracts/components.json に合わせて全部小文字（`subComponents` ではない）。
     */
    subcomponents?: string[];
    /** 既定 true。false のとき `name` は実装ファイル名 / グループ名で import できない。 */
    exported?: boolean;
    /** `name` と別名で export される場合の実 export 名。 */
    exportedAs?: string;
    /**
     * `name` / `exportedAs` とは別に、同じエントリを引ける追加の実 export 名。
     * 同名衝突を避けるために別名 export された名前（例: `RhfFormField`）を
     * 検索・解決対象にするために使う。deprecatedAliases と違い非推奨ではない。
     */
    aliases?: string[];
    /** 互換のために残している旧 export 名。新規利用は禁止。 */
    deprecatedAliases?: string[];
    description?: string;
}
export interface ComponentsData {
    meta: {
        name: string;
        version: string;
        description: string;
        counts: Record<string, number>;
    };
    ui: ComponentEntry[];
    patterns: ComponentEntry[];
    commerce: ComponentEntry[];
    admin: ComponentEntry[];
    shells: ComponentEntry[];
}
export interface ProhibitionRule {
    id: string;
    severity: "error" | "warn";
    category: string;
    pattern: string;
    excludes?: string[];
    message: string;
    fix: string;
}
export interface AiPattern {
    id: string;
    name: string;
    pattern: string;
    description: string;
    fix: string;
}
export interface RulesData {
    prohibited: ProhibitionRule[];
    aiPatterns: {
        description: string;
        patterns: AiPattern[];
    };
    accessibility: unknown[];
}
export interface TokenEntry {
    name: string;
    value: string;
}
export declare function loadComponents(): ComponentsData;
export declare function loadRules(): RulesData;
export declare function loadPrimitiveTokens(): TokenEntry[];
export declare function loadSemanticTokens(): TokenEntry[];
