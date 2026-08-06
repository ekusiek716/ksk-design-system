// react-native に依存しない開閉状態（Collapsible / Accordion）の純粋ロジック。
// vitest から react-native をロードせずに直接テストできるよう分離している（issue #298②）。

/**
 * 制御 / 非制御の解決。
 * `controlled` が undefined でない間は常に制御モードとして扱い、内部 state を無視する。
 */
export function resolveOpenState(
  controlled: boolean | undefined,
  internal: boolean,
): boolean {
  return controlled === undefined ? internal : controlled
}

/** 制御モードかどうか（`open` prop が渡されているか）。 */
export function isControlledOpen(controlled: boolean | undefined): boolean {
  return controlled !== undefined
}

export type AccordionType = "single" | "multiple"

/**
 * Accordion の開閉キー集合を1回のトグルで進める純粋関数。
 * - `single`: 開いているものは常に1つまで（同じキーを押すと閉じる）
 * - `multiple`: 複数同時に開ける
 *
 * 入力配列の順序に依存せず、結果は「元の並び順を保った配列」で返す。
 */
export function nextAccordionKeys(
  openKeys: readonly string[],
  key: string,
  type: AccordionType,
): string[] {
  const isOpen = openKeys.includes(key)
  if (type === "single") return isOpen ? [] : [key]
  return isOpen ? openKeys.filter((k) => k !== key) : [...openKeys, key]
}

/**
 * `single` に切り替わったときなど、type の制約に反する開閉キー集合を丸める。
 * `single` では先頭1件だけを残す。
 */
export function normalizeAccordionKeys(
  openKeys: readonly string[],
  type: AccordionType,
): string[] {
  const deduped = [...new Set(openKeys)]
  return type === "single" ? deduped.slice(0, 1) : deduped
}
