/**
 * Radix の「ref churn」に関する正本データ（issue #516 の残課題）。
 *
 * ## 何が問題か
 *
 * `@radix-ui/react-compose-refs` の `useComposedRefs(...refs)` は
 * `React.useCallback(composeRefs(...refs), refs)`。つまり **渡された ref の
 * identity が毎 render 変わると、合成 ref の identity も毎 render 変わる**。
 * React はコールバック ref の identity が変わった commit で detach(null) →
 * attach(node) をやり直すので、その先に「node を state に持つ」DS 側の
 * setter がぶら下がっていると、render のたびに state 更新が起きて発散する
 * （#516: `Maximum update depth exceeded`）。
 *
 * 呼び出し側が安定した setter を渡すよう修正された版は以下:
 *
 * | package                            | churn する最後の版 | 修正版  | 修正内容 |
 * | ---------------------------------- | ------------------ | ------- | -------- |
 * | `@radix-ui/react-focus-scope`      | 1.1.10             | 1.1.11  | `useComposedRefs(forwardedRef, (node) => setContainer(node))` → `setContainer` |
 * | `@radix-ui/react-dismissable-layer`| 1.1.13             | 1.1.14  | 同上（`(node) => setNode(node)` → `setNode`） |
 * | `@radix-ui/react-presence`         | 1.1.5              | 1.1.6   | `useComposedRefs` → identity 固定の `useStableComposedRefs` |
 * | `@radix-ui/react-slot`             | 1.2.3              | 1.2.5   | render 内 `composeRefs(...)` 直呼び → `useComposedRefs(forwardedRef, 安定 ref)` |
 *
 * `radix-ui` メタパッケージは全サブパッケージを **完全一致（exact）** で
 * 依存に持つため、メタパッケージの版が決まればサブパッケージの版も一意に
 * 決まる。上の 4 つを同時に満たす最初のメタパッケージ版が **1.6.1**
 * （1.6.0 は focus-scope 1.1.10 / dismissable-layer 1.1.13 で未修正）。
 *
 * ## DS がこれをどう防ぐか
 *
 * 1. `package.json` の下限を安全版へ引き上げる（案X）。consumer の npm は
 *    DS の依存として下限以上を解決するので、belle-todo が踏んだ
 *    「consumer の lockfile が古い Radix を保持している」構図が起きない。
 *    下限は {@link SAFE_FLOORS} を正本に `scripts/check-radix-floor.mjs` が検査する。
 * 2. それでも overrides / 他パッケージマネージャで古い Radix を掴ませることは
 *    できるので、{@link LEGACY_PINS} を実際に install した専用 vitest project
 *    （`npm run test:legacy-radix`）で「旧 Radix でも収束すること」を回す（案Y）。
 */

/**
 * これ以上でなければならない Radix の版（DS が解決させたい下限）。
 *
 * `radix-ui` / `@radix-ui/react-slot` は DS が直接 dependencies に書いている
 * ので宣言レンジも検査対象。残り 3 つは `radix-ui` 経由の推移依存なので、
 * 実際にインストールされた版だけを検査する。
 */
import semver from "semver"
export const SAFE_FLOORS = {
  "radix-ui": "1.6.1",
  // 挙動上の下限は 1.2.5。ただし `package.json` の宣言は `^1.3.0` にしてある
  // ——`radix-ui@1.6.1` が slot を exact 1.3.0 で掴むので、下限を揃えておけば
  // consumer のツリーで slot が二重にならない。
  "@radix-ui/react-slot": "1.2.5",
  "@radix-ui/react-focus-scope": "1.1.11",
  "@radix-ui/react-dismissable-layer": "1.1.14",
  "@radix-ui/react-presence": "1.1.6",
}

/** `SAFE_FLOORS` のうち、DS が直接 dependencies に書いているもの（宣言レンジも検査する）。 */
export const DIRECT_DEPENDENCIES = ["radix-ui", "@radix-ui/react-slot"]

/**
 * belle-todo（#516 の被害者）が実際に解決していた旧 Radix の版。
 * `npm run test:legacy-radix` はこの組み合わせを固定インストールして回す。
 */
export const LEGACY_PINS = {
  "radix-ui": "1.4.3",
  "@radix-ui/react-slot": "1.2.3",
}

/**
 * 旧 Radix fixture を入れる場所（リポジトリ相対）。
 *
 * `node_modules/` 配下に置くのは意図的:
 * - すでに gitignore 済みで作業ツリーを汚さない
 * - `npm ci` で一緒に消えるため stale が残らない
 * - Node の解決がここから上へ辿ると本体の `node_modules/react` に当たるので、
 *   fixture 側に React を入れずに済む（React 二重ロード回避 / issue #334）
 */
export const LEGACY_FIXTURE_DIR = "node_modules/.ksk-legacy-radix"

/** `1.2.3` 形式のバージョンを比較する（-rc 等の prerelease は扱わない）。 */
export function compareVersions(a, b) {
  const pa = a.split(".").map(Number)
  const pb = b.split(".").map(Number)
  for (let i = 0; i < 3; i += 1) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0)
    if (diff !== 0) return diff < 0 ? -1 : 1
  }
  return 0
}

/**
 * レンジが許容する真の最小バージョンを semver で計算する。
 *
 * 先頭の数字 3 つを拾うだけの実装だと `^1.6.1 || ^1.0.0` や `<=1.6.1` の
 * ような合法レンジで実際の下限より高い値を返し、検査が偽の緑になる
 * （PR #520 の Codex レビュー指摘）。semver.minVersion はレンジ全体
 * （|| の合併・比較演算子込み）を解釈して最小許容版を返す。
 * 解釈できないレンジは null（呼び出し側で違反扱い）。
 */
export function rangeFloor(range) {
  try {
    const min = semver.minVersion(range)
    return min ? min.version : null
  } catch {
    return null
  }
}
