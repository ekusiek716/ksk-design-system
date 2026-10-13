// =============================================================
// KSK Design System — 画像比較（VRT）の撮影場面の正本
//
// 撮影場面は 2 系統:
//   1. test/visual/scenarios.json の固定場面（狭幅/広幅・hostile・dialog など、
//      条件を作り込んだ検証用 fixture）
//   2. ストーリーに `tags: ["vrt"]` を付けた opt-in 場面（主要部品の代表
//      ストーリー × light / dark）。Storybook の index.json から導出する。
//
// 全ストーリー（約 780 件）× 2 モードは CI 時間に見合わないため 2 は opt-in。
// scripts/check-visual.mjs（撮影・比較）と test/visual/orphans.test.mjs
// （使われなくなった基準画像の検出）が同じ関数を使う。片方だけ命名を
// 変えると、全基準画像が「孤児」か「欠落」になるため一本化している。
// =============================================================

export const VRT_TAG = 'vrt'
export const VRT_MODES = ['light', 'dark']
// 代表ストーリーは部品単体の表示なので、広めの固定幅 + 全高で撮る。
// 高さは最小値で、内容が長ければ fullPage で伸びる。
export const VRT_VIEWPORT = { width: 800, height: 400 }

/**
 * Storybook index.json の entries から `vrt` タグ付きストーリーの撮影場面を作る。
 * @param {Record<string, { id: string, type: string, tags?: string[] }>} entries
 */
export function taggedScenarios(entries) {
  return Object.values(entries ?? {})
    .filter(entry => entry.type === 'story' && entry.tags?.includes(VRT_TAG))
    .map(entry => entry.id)
    .sort()
    .flatMap(id => VRT_MODES.map(mode => ({ name: `${id}--${mode}`, story: id, ...VRT_VIEWPORT, mode, fullPage: true })))
}

/**
 * 固定場面とタグ由来の場面を結合する。名前の重複（＝基準画像の上書き）は失敗にする。
 * @param {Array<{ name: string }>} fixed
 * @param {Record<string, unknown>} entries
 */
export function allScenarios(fixed, entries) {
  const scenarios = [...fixed, ...taggedScenarios(entries)]
  const seen = new Set()
  for (const scenario of scenarios) {
    if (seen.has(scenario.name)) throw new Error(`撮影場面の名前が重複しています: ${scenario.name}`)
    seen.add(scenario.name)
  }
  return scenarios
}

/** 場面 → 基準画像のファイル名 */
export const baselineFileName = scenario => `${scenario.name}.png`

/**
 * 基準画像ディレクトリのファイル一覧から、どの場面にも対応しない PNG（孤児）を返す。
 * story の削除・改名・`vrt` タグ外しの残骸を検出する。
 * @param {string[]} files
 * @param {Array<{ name: string }>} scenarios
 */
export function findOrphanBaselines(files, scenarios) {
  const expected = new Set(scenarios.map(baselineFileName))
  return files.filter(file => file.endsWith('.png') && !expected.has(file)).sort()
}
