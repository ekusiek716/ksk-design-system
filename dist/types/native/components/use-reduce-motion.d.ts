/**
 * OS の「視差効果を減らす（Reduce Motion）」設定を購読する内部フック。
 * web 側の usePrefersReducedMotion（celebration.tsx）に相当。
 * 初期値は false（設定取得は非同期のため、取得完了後に反映される）。
 */
export declare function useReduceMotion(): boolean;
