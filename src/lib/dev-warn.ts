/**
 * 開発ビルドだけで 1 回だけ出す警告（Alert / Card と同じ isDev 判定）。
 * process が無い環境（バンドラが置換しない素の ESM 等）では本番扱いで何もしない。
 * 同じ key は 1 回だけ出す（render のたびに console を埋めないため）。
 */
const warned = new Set<string>()

export function isDevBuild(): boolean {
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
  return Boolean(proc) && proc!.env?.NODE_ENV !== "production"
}

export function warnOnceInDev(key: string, message: string): void {
  if (!isDevBuild() || warned.has(key)) return
  warned.add(key)
  console.warn(`[ksk-design-system] ${message}`)
}

/** テスト用: 出した警告の記録を消す */
export function resetDevWarnings(): void {
  warned.clear()
}
