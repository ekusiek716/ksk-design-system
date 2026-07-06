/**
 * カテゴリプリセット 1 件の形状。
 * `categoricalIndex` は `--Categorical-{1..16}` のインデックス（1 始まり）。
 * CSS var 文字列ではなくインデックスで持つことで、native（tokens 経由で解決）
 * からも同じデータを利用できる。
 */
export interface CategoryPresetItem {
    /** ドメイン内で一意なキー */
    key: string;
    /** 表示ラベル（日本語） */
    label: string;
    /** 絵文字アイコン */
    icon: string;
    /** `--Categorical-{1..16}` のインデックス（1..16） */
    categoricalIndex: number;
}
/** `--Categorical-{index}` を返す（ドット・アイコン・小さな塗り用）。 */
export declare function getCategoricalColor(index: number): string;
/** `--Categorical-{index}-Subtle` を返す（背景ティント用）。 */
export declare function getCategoricalSubtle(index: number): string;
/** `--Categorical-{index}-Bold` を返す（文字・ラベル用。必ず -Bold を使うこと）。 */
export declare function getCategoricalBold(index: number): string;
/**
 * 結婚式準備カテゴリプリセット（belle-todo 移植）。
 *
 * 並び順はタイムライン順（1年前〜半年前の大物決定 → 半年前〜3ヶ月前の衣装・準備
 * → 3ヶ月前〜1ヶ月前の演出・実装 → 1ヶ月前〜直前の公的手続き・打合せ → 当日 → 挙式後 → その他）。
 * ラベルは「達成すべきゴール」（動詞終わり）で統一。
 *
 * HEX → Categorical インデックスのマッピング（RGB ユークリッド距離で最近傍探索。
 * 19 色 > 16 インデックスのため、一部は最近傍色を再利用している）:
 *
 * | key           | 元 dotColor (belle-todo) | categoricalIndex | Categorical HEX |
 * |---------------|---------------------------|-------------------|-------------------|
 * | family        | #06B6D4 (cyan)            | 8                 | #06B6D4 (完全一致) |
 * | venue         | #F97316 (orange)          | 7                 | #F97316 (完全一致) |
 * | budget        | #EAB308 (yellow)          | 5                 | #EAB308 (完全一致) |
 * | ring          | #8B5CF6 (violet)          | 16                | #8B5CF6 (完全一致) |
 * | guest         | #0EA5E9 (sky)             | 2                 | #0EA5E9 (完全一致) |
 * | dress         | #EC4899 (pink)            | 9                 | #EC4899 (完全一致) |
 * | beauty        | #D946EF (fuchsia)         | 14                | #D946EF (完全一致) |
 * | invitation    | #F43F5E (rose)            | 10                | #F43F5E (完全一致) |
 * | entertainment | #F59E0B (amber)           | 13                | #F59E0B (完全一致) |
 * | bgm           | #A855F7 (purple)          | 15                | #A855F7 (完全一致) |
 * | photo         | #6366F1 (indigo)          | 6                 | #6366F1 (完全一致) |
 * | paper         | #84CC16 (lime)            | 12                | #84CC16 (完全一致) |
 * | gift          | #EF4444 (red)             | 1                 | #EF4444 (完全一致) |
 * | official      | #64748B (slate)           | 4                 | #64748B (完全一致) |
 * | meeting       | #14B8A6 (teal)            | 3                 | #14B8A6 (完全一致) |
 * | schedule      | #3B82F6 (blue)            | 11                | #3B82F6 (完全一致) |
 * | items         | #10B981 (emerald)         | 3                 | #14B8A6 (最近傍: teal) |
 * | newlife       | #22C55E (green)           | 12                | #84CC16 (最近傍: lime、paper と共用) |
 * | other         | #9CA3AF (gray)            | 4                 | #64748B (最近傍: slate、official と共用) |
 *
 * emerald/green/gray は Categorical パレットに存在しないため、
 * items/newlife/other のみ最近傍の既存インデックスに丸めている
 * （3 件ともタイムライン上で隣接せず、重複による識別性低下は実害が小さいと判断）。
 */
export declare const weddingCategories: CategoryPresetItem[];
/**
 * プロジェクト管理向けカテゴリプリセット。
 * ソフトウェア/一般プロジェクトの標準的な工程フェーズを想定した新規プリセット。
 */
export declare const projectCategories: CategoryPresetItem[];
