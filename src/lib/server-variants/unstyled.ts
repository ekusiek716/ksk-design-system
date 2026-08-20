/**
 * unstyled モード（issue #420）で唯一残す視覚クラス。
 *
 * 既存の手書き CSS 画面を DS へ段階移行するとき、Button / Input / Textarea の
 * base + variant が持つ寸法・装飾（h-* / min-h-* / typo-* / whitespace-nowrap /
 * justify-center / rounded / bg）が、手書きクラスが宣言していないプロパティへ
 * 流入して視覚回帰する。`unstyled` はそれらを一切出さず、挙動と a11y だけを
 * 提供するためのモード。
 *
 * ただし **focus-visible の ring だけは既定で残す**。キーボード操作時に
 * フォーカス位置が見えなくなるのは a11y の後退であり、「見た目を変えない」
 * という段階移行の目的とも衝突しないため（手書き CSS は :focus-visible の
 * ring を持たないことが多い）。消したい場合は className 側で
 * `focus-visible:ring-0` 等を渡せば cn() の後勝ちで上書きできる。
 *
 * このファイルは **React に依存しない**。src/lib/server-variants/ 配下は
 * RSC から import 可能な banner 無しチャンクとしてビルドされるため、
 * フック・createContext を持ち込まないこと（__tests__/client-boundary.test.ts）。
 */
const UNSTYLED_FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50"

export { UNSTYLED_FOCUS_RING }
