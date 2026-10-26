/**
 * pill 型セグメント（TabsList / TabsTrigger の variant="pill" と PillToggle semantics="radio"）が
 * 共有する class（内部用・public export しない。issue #741）。
 * 選択状態の属性だけが違う（Tabs: data-state=active / inactive、radio: data-state=checked / unchecked）ので、
 * 選択中・hover の class はそれぞれの部品側に置く。Tailwind が拾えるよう文字列はすべてリテラルで書く。
 */

/** トラック（Surface-Tertiary の面）の共通部分。高さ・角丸は variant ごとに足す */
export const SEGMENT_LIST_BASE =
  "inline-flex w-fit max-w-full overflow-x-auto items-center gap-1 bg-[var(--Surface-Tertiary)] p-1 text-[var(--Text-Medium-Emphasis)]"

/**
 * pill のトラックの高さ・角丸。
 * 高さ・角丸は product theme の公開変数を参照する（issue #364 追補）。
 * pill(44px)は Control スケール（40/48px）のどちらとも一致しないため
 * Chip の縦タッチターゲットと同じ理由（WCAG 2.5.5 相当の当たり判定）で
 * 固定値のまま据え置き、角丸だけ Button と同じ --Control-Radius を共有する。
 */
export const PILL_LIST_SHAPE = "h-11 rounded-[var(--Control-Radius)]"

/** 項目の共通部分（並び・文字・遷移） */
export const SEGMENT_ITEM_BASE = "inline-flex items-center justify-center whitespace-nowrap typo-label-sm transition-all"

/** pill の項目の角丸・余白（product theme の公開変数を参照。issue #364 追補） */
export const PILL_ITEM_SHAPE = "relative rounded-[var(--Control-Radius)] px-[var(--Control-Padding-X-Md)] py-1.5 gap-1.5"

/**
 * pill は見た目の高さ(h-9/h-8)を維持したまま、当たり判定だけをトラック全高(44px)まで
 * 透明な before 擬似要素で拡張する。本体の height は変更しない（belle-todo 事例の再発防止）。
 */
export const PILL_ITEM_HIT_AREA =
  "before:absolute before:inset-x-0 before:top-1/2 before:-translate-y-1/2 before:min-h-11 before:content-['']"

/** フォーカスリングと無効時 */
export const SEGMENT_ITEM_FOCUS_DISABLED =
  "focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)] disabled:pointer-events-none disabled:opacity-50"
