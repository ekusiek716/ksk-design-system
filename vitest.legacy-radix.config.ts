import { existsSync } from "node:fs"
import path from "node:path"
import { defineConfig } from "vitest/config"

import { LEGACY_FIXTURE_DIR } from "./scripts/radix-ref-churn.mjs"

/**
 * 旧 Radix 固定の Vitest 設定（issue #516 の残課題 / 案Y）。
 *
 * `npm test`（vitest.config.ts）は DS 自身の node_modules を掴むため、
 * ref churn 修正済みの Radix しか通らず #516 の回帰を再現できない。この設定は
 * `scripts/test-legacy-radix.mjs` が用意した「belle-todo が実際に解決していた
 * 旧 Radix」を alias で掴ませ、DS のオーバーレイ面が旧 Radix でも収束することを
 * 検証する。
 *
 * 直接起動はしない（fixture が無いと失敗する）。`npm run test:legacy-radix` から
 * 実行すること。
 */
const fixtureModules = path.resolve(__dirname, LEGACY_FIXTURE_DIR, "node_modules")

if (!existsSync(fixtureModules)) {
  throw new Error(
    `旧 Radix fixture (${LEGACY_FIXTURE_DIR}) がありません。\`npm run test:legacy-radix\` から実行してください。`,
  )
}

export default defineConfig({
  resolve: {
    // fixture 側に React は入れていないが、旧 Radix から上へ辿った解決が
    // 本体以外の React を掴まないよう明示的に単一化する（issue #334 と同じ理由）。
    dedupe: ["react", "react-dom"],
    alias: [
      // DS のソースが import する Radix のエントリポイントだけを差し替える。
      // メタパッケージ内部の `@radix-ui/react-*` 参照は fixture の
      // node_modules から解決されるので、focus-scope / presence / dismissable-layer も
      // 自動的に旧版になる。
      { find: /^radix-ui$/, replacement: path.join(fixtureModules, "radix-ui") },
      {
        find: /^@radix-ui\/react-slot$/,
        replacement: path.join(fixtureModules, "@radix-ui/react-slot"),
      },
      { find: /^@\//, replacement: `${path.resolve(__dirname, "src")}/` },
    ],
  },
  test: {
    name: "legacy-radix",
    include: ["test/legacy-radix/**/*.test.tsx"],
    environment: "jsdom",
    testTimeout: 30_000,
  },
})
