/**
 * raised ボタン（Duolingo 型 3D ボタン）の押下スタイル。
 *
 * 押下で `borderBottomWidth` を 0 にすると、`minHeight` で高さが決まっている
 * ボタンでは高さが縮まない一方で補填用の `marginBottom` だけが効き、行の高さが
 * 増えてレイアウト全体が下にずれる。exam-kit の PrimaryButton と同じく
 * 「下辺の太さは常に維持し、押下時は色だけ透明にする」方式にして、
 * レイアウト寸法（height / margin）を押下前後で完全に固定する。
 */
export interface RaisedElevationInput {
    pressed: boolean;
    disabled: boolean;
    /** scales.elevation[elevation].bottomBorderWidth */
    bottomBorderWidth: number;
    /** scales.elevation[elevation].offset */
    offset: number;
    /** variant の active-button トークン由来の下辺色 */
    bottomBorderColor: string;
}
export interface RaisedElevationStyle {
    borderBottomWidth: number;
    borderBottomColor: string;
    transform: [{
        translateY: number;
    }];
}
export declare function resolveRaisedElevationStyle({ pressed, disabled, bottomBorderWidth, offset, bottomBorderColor, }: RaisedElevationInput): RaisedElevationStyle;
