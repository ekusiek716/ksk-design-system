// =============================================================
// vitest.a11y.config.ts の globalSetup。
//
// axe 検査（npm run test:a11y）を回す前に、ストーリー側の axe ルール無効化が
// すべて test/known-exceptions.json の a11y 区分に期限付きで登録されているかを
// 確かめる。未登録の無効化・期限切れ・使われていない登録があれば、ストーリー
// 描画を始める前に失敗させる（台帳を通らない例外で axe を黙らせない）。
// =============================================================
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { LEDGER_PATH, checkA11yLedger } from "./lib/known-exceptions.mjs"

export default function setup() {
  const errors = checkA11yLedger(join(dirname(fileURLToPath(import.meta.url)), ".."))
  if (errors.length) throw new Error(`${LEDGER_PATH} の a11y 区分に問題があります:\n${errors.map((e) => `  - ${e}`).join("\n")}`)
}
