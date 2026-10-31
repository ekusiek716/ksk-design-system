import type { AccessibilityRole, AccessibilityState } from "react-native"

/**
 * react-native-web（0.21）は `accessibilityState` を `aria-*` に変換しない（issue #808）。
 * そのため Web ビルド（Expo web・Storybook）では、スイッチやチェックが常に「オフ」、
 * 選択中のチップ・タブが「どれが選択中か不明」と読み上げられる。
 *
 * この関数は、部品が実際に使う role と（呼び出し側の上書きを merge 済みの）state から、
 * Web で効く `aria-*` を組み立てる。iOS / Android では RN が未知の props として無視するため
 * native の挙動は変わらない（native は従来どおり `accessibilityState` を読む）。
 *
 * 対応表（Web 版 DS の部品と同じ意味論）:
 * - `checked`: role が checkbox / radio / switch のとき `aria-checked`（これらの role の必須属性なので
 *   state に無ければ `selected`、それも無ければ false で補う）。
 *   role が button 系なら `aria-pressed` にする（role=button に aria-checked は不適切）。
 * - `selected`: role が tab のとき `aria-selected`。role が button 系のときは `aria-pressed`
 *   （Web の Chip / Card / MediaActionCluster と同じ）。`selectedAs: "current"` を渡すと
 *   `aria-current="page"`（Web の Pagination / BottomTabBar と同じ。ナビゲーションの現在位置）。
 * - `expanded` → `aria-expanded` / `busy` → `aria-busy`（true のときだけ）/ `disabled` → `aria-disabled`（true のときだけ）
 *
 * 呼び出し側が明示した `aria-*` を優先させるため、部品では `{...webAriaFromState(...)}` を
 * 呼び出し側の props（`...rest`）より前に置く。
 */
export interface WebAriaProps {
  "aria-checked"?: boolean | "mixed"
  "aria-pressed"?: boolean | "mixed"
  "aria-selected"?: boolean
  "aria-current"?: "page"
  "aria-expanded"?: boolean
  "aria-busy"?: boolean
  "aria-disabled"?: boolean
}

export interface WebAriaOptions {
  /**
   * `selected` を何として出すか。既定は role から決める（tab → aria-selected、button 系 → aria-pressed）。
   * ナビゲーションの現在位置（ページ送り・下タブ）は "current" で `aria-current="page"` にする。
   */
  selectedAs?: "auto" | "current"
}

const CHECKABLE_ROLES = new Set<string>(["checkbox", "radio", "switch"])
const BUTTON_ROLES = new Set<string>(["button", "togglebutton", "imagebutton"])
const SELECTABLE_ROLES = new Set<string>(["tab"])

export function webAriaFromState(
  role: AccessibilityRole | string | undefined,
  state: AccessibilityState | undefined,
  options: WebAriaOptions = {},
): WebAriaProps {
  const aria: WebAriaProps = {}
  const s = state ?? {}
  const r = role ?? ""

  if (CHECKABLE_ROLES.has(r)) {
    aria["aria-checked"] = s.checked ?? s.selected ?? false
  } else if (BUTTON_ROLES.has(r) && s.checked !== undefined) {
    aria["aria-pressed"] = s.checked
  }

  if (s.selected !== undefined && !CHECKABLE_ROLES.has(r)) {
    if (options.selectedAs === "current") {
      if (s.selected) aria["aria-current"] = "page"
    } else if (SELECTABLE_ROLES.has(r)) {
      aria["aria-selected"] = s.selected
    } else if (BUTTON_ROLES.has(r) && aria["aria-pressed"] === undefined) {
      aria["aria-pressed"] = s.selected
    }
  }

  if (s.expanded !== undefined) aria["aria-expanded"] = s.expanded
  if (s.busy) aria["aria-busy"] = true
  if (s.disabled) aria["aria-disabled"] = true
  return aria
}
