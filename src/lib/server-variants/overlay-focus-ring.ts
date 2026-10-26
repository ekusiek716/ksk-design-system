/**
 * 写真・ガラス・任意色の面に乗る操作子のフォーカスリング（背景に依存しない二重リング）。
 *
 * 通常のフォーカスリング（Focus-High-Emphasis = ライトは Brand-600）は Surface-Primary /
 * Surface-Secondary の上で 3:1 以上になるよう設計されている。写真・動画・ブラー面・任意の
 * グラデーションの上では下地の色が分からず、その単色リングは下地と同系色になると溶ける。
 *
 * そこで内側 2px を白、外側 2px を濃色（Primitive-Gray-900 = #18181B）にした二重リングにする。
 * 任意の下地 c について、c と白の比と c と濃色の比の積は約 17.7 で、どちらか一方は必ず
 * 4.2:1 以上になる（最悪は相対輝度 0.199 の中間グレーで 4.21:1）。白と濃色どうしは 17.7:1。
 * sRGB 全域の走査による検査は scripts/check-contrast.mjs、実ブラウザでの描画は
 * __tests__/browser/overlay-focus-ring.test.tsx が固定する。
 *
 * 白 / 濃色は下地が写真であることを前提にした固定色なので、ライト / ダークで切り替えない
 * （Surface-Inverse 等の反転するトークンは使わない）。
 *
 * - OVERLAY_FOCUS_RING: 要素の外側に描く。ring-2 + ring-offset-2（すき間の 2px を白で塗る）。
 *   ほとんどの操作子はこちら。
 * - OVERLAY_FOCUS_RING_INSET: 要素の内側に描く。親が overflow:hidden で外側のリングが
 *   切られる場合（BottomTabBar の pill の中のタブ等）や、操作子が面全体を覆う場合に使う。
 *
 * .glass 系の素材クラスを持つ要素は、非レイヤー CSS の box-shadow が Tailwind の ring を打ち消す
 * ため、このクラスでは描けない。glass.css が同じ二重リング（--glass-focus-ring）を
 * :focus-visible のときに自動で重ねる。
 *
 * クラス名は完全な文字列で書く（Tailwind の静的抽出のため。動的合成しない）。
 * `focus-visible:outline-hidden` は強制配色モードでは box-shadow が描かれないため、
 * outline で枠を残す保険（#620）。
 *
 * このファイルは **React に依存しない**。src/lib/server-variants/ 配下は RSC から import できる
 * banner 無しチャンクとしてビルドされるため、フック・createContext を持ち込まないこと。
 */
const OVERLAY_FOCUS_RING =
  "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--Primitive-Gray-900)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--Primitive-White)]"

const OVERLAY_FOCUS_RING_INSET =
  "focus-visible:outline-hidden focus-visible:shadow-[inset_0_0_0_2px_var(--Primitive-Gray-900),inset_0_0_0_4px_var(--Primitive-White)]"

/**
 * OVERLAY_FOCUS_RING_INSET の「子が面を覆う」版。操作子の中に画像などの子（absolute inset-0）があると、
 * 要素自身の inset box-shadow は子の下に描かれて隠れる。そこで ::after の覆い（pointer-events-none・
 * 親の角丸を継承・子より前面の z-20）に同じ内側の二重リングを描く。
 * 使う側は要素を `relative`（位置決めの基準）にすること。
 * 例: 画像・グラデーション背景のバナー項目（BannerCarousel）。
 */
const OVERLAY_FOCUS_RING_INSET_OVER =
  "focus-visible:outline-hidden after:pointer-events-none after:absolute after:inset-0 after:z-20 after:rounded-[inherit] after:content-[''] focus-visible:after:shadow-[inset_0_0_0_2px_var(--Primitive-Gray-900),inset_0_0_0_4px_var(--Primitive-White)]"

/**
 * 親（`group` を付けた操作子）の :focus-visible で内側の二重リングを出す、独立した覆い要素（span）用。
 * `.glass-specular` を持つ操作子は ::before（スペキュラ。白 最大 0.36 のグラデーション）と ::after（縁のリム）を
 * 使い、要素自身の inset box-shadow は ::before の下に描かれる。実測（BottomTabBar の中央アクション、
 * 上端中央）で、Gray-900 の帯が約 rgb(118) まで白で持ち上げられ、下地が中間グレーのとき
 * 帯と下地の比が 1.8:1 まで落ちた。::before / ::after は使えないので、`aria-hidden` の子 span を
 * 絶対配置で全面に敷き（z-[3] は ::after の z-index:2 より上）、そこに描く。
 * 親は `relative`（または positioned）にし、`group` クラスを付けること。
 */
const OVERLAY_FOCUS_RING_COVER =
  "pointer-events-none absolute inset-0 z-[3] rounded-[inherit] group-focus-visible:shadow-[inset_0_0_0_2px_var(--Primitive-Gray-900),inset_0_0_0_4px_var(--Primitive-White)]"

export {
  OVERLAY_FOCUS_RING,
  OVERLAY_FOCUS_RING_INSET,
  OVERLAY_FOCUS_RING_INSET_OVER,
  OVERLAY_FOCUS_RING_COVER,
}
