import type { ComponentEntry } from "../utils/loader.js";
/** 問い合わせ名がエントリのどのフィールドに当たったか。 */
export type MatchKind = "name" | "exportedAs" | "subcomponent" | "deprecatedAlias" | "path";
export interface ComponentResult extends ComponentEntry {
    importPath: string;
    group: string;
    /** 実際にヒットした名前（問い合わせ名の正規表記）。 */
    matchedName: string;
    matchedBy: MatchKind;
    /** `import { matchedName } from "ksk-design-system"` がそのまま書けるか。 */
    importable: boolean;
    /** このエントリで実際に import できる named export の一覧（新規実装で使う名前）。 */
    importableNames: string[];
    /**
     * `PhotoHero.Title` のような複合コンポーネントのメンバー。
     * named export ではなくルートオブジェクトのプロパティなので import はできない。
     */
    compoundMembers?: string[];
    /** `matchedName` が非推奨エイリアスか（import はできるが新規利用は禁止）。 */
    deprecated?: boolean;
    /** import できない / 非推奨のときの注意書き。 */
    note?: string;
}
/**
 * コンポーネントのメタデータを名前 / パス断片から取得する。
 *
 * 解決対象は `name` だけでなく `exportedAs` / `subcomponents` / `deprecatedAliases` も含む。
 * これがないと、exported:false のエントリ（Toast, CheckboxCard, patterns/Form 等）の
 * 実 export 名（`CheckboxCardGroup` 等）で引いたときに null が返り、
 * MCP 経由ではそのコンポーネントのルールを一切引けなくなる。
 *
 * 解決順は「完全一致（大小区別あり）→ 完全一致（区別なし）→ 部分一致」で、
 * 各段を全グループ横断で走査する。
 * （グループごとに「完全一致 → 部分一致」を回すと ui の部分一致が
 * 他グループの完全一致に勝ってしまう）
 */
export declare function getComponent(id: string): ComponentResult | null;
