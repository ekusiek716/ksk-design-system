/**
 * useCommitDraft (native) — IME (日本語変換) を壊さない「確定時コミット」入力のための共通フック。
 *
 * 正本: src/components/ui/use-commit-draft.ts（Web 版）。
 * ロジック（draft state + composing フラグ + shouldCommitOnChange 判定）はプラットフォーム
 * 非依存だが、src/native から src/components/ui への import は許されない構成
 * （native は react-native 依存、web 側は DOM 依存で相互に import しない設計。
 * 実際 src/native 配下から "@/components" を import している既存コードは無い）。
 * そのためロジックをこちらに複製する。**Web 版を変更したら本ファイルも同期すること。**
 *
 * Web 版との差分（プラットフォーム都合）:
 *  - RN の TextInput には DOM の compositionstart/compositionend に相当するイベントが無い。
 *    ネイティブ実機（iOS/Android）では IME 変換は OS のキーボードが担い、React 側に
 *    「変換中の中間状態」は down してこないため、composition ガード自体が不要
 *    （blur / submit 確定のみで壊れない）。
 *  - react-native-web (RNW) 環境では実体が DOM <input>/<textarea> なので、compositionstart/end
 *    が発生し得る。RNW 上で store 直結すると Web 版と同じ理由で変換が壊れるため、
 *    Platform.OS === 'web' のときだけ composition ガードを効かせる。
 *  - RN の TextInput は compositionstart/end を props として持たないので、CommitInput 側で
 *    web 実行時のみ ref 経由の DOM addEventListener で拾う（see CommitInput.tsx）。
 */
export interface UseCommitDraftResult {
    /** 表示・入力に使う draft 値。value そのものではなくこちらを TextInput に渡す。 */
    draft: string;
    /**
     * 入力値変更を処理する。draft を更新し、変換中でなければ onCommit する。
     * @param next 新しい値
     * @param isComposingHint DOM 由来の追加ヒント（RNW 限定。ネイティブでは常に undefined）。
     */
    handleChange: (next: string, isComposingHint?: boolean) => void;
    /** compositionstart 相当のハンドラ（RNW 限定）。変換開始を記録する。 */
    handleCompositionStart: () => void;
    /**
     * compositionend 相当のハンドラ（RNW 限定）。変換終了を記録し、確定値を commit する。
     * @param next 変換確定後の値
     */
    handleCompositionEnd: (next: string) => void;
}
/**
 * composition ガードの純粋な判定関数。onChange 時に onCommit すべきか返す。
 * Web 版 (src/components/ui/use-commit-draft.ts) の shouldCommitOnChange と同一ロジック。
 */
export declare function shouldCommitOnChange(composing: boolean, isComposingHint?: boolean): boolean;
export declare function useCommitDraft(value: string, onCommit: (value: string) => void): UseCommitDraftResult;
