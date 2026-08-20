import { defineConfig } from "vitest/config"
import path from "node:path"

/**
 * Vitest 設定（単体テスト用）。
 *
 * 後方互換 API テスト・ロジック単位テスト用の最小構成。
 * jsdom は使わず、react-dom/server で SSR レンダリングして検証する。
 * UI のインタラクティブテストは Storybook の interactionsAddon に
 * 任せる方針。
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    // mcp-server/ は独立パッケージだが、参照する contracts/ は本体と同じ正本なので
    // 契約ズレを同じ `npm run test` で検出できるようにここに含める。
    include: ["__tests__/**/*.test.{ts,tsx}", "mcp-server/__tests__/**/*.test.ts"],
    exclude: ["node_modules", "dist", "storybook-static", "**/*.stories.tsx"],
    // 既定の 5s だと、bin/init.js / lint-scratch.sh 等の CLI を spawnSync する
    // テスト（consumer-lint-cli / lint-scratch / check-migration / lint-cli を含む
    // 14 ファイルが該当）が高負荷・並列実行時に数秒かかりタイムアウトする
    // （単独実行では常に緑）。CLI spawn 系だけ per-file 設定に分けるより、
    // 対象ファイルが今後も増える前提で全体を底上げする方が保守コストが低いと
    // 判断し、testTimeout を一律で引き上げる。単体テスト側はこの上限に
    // 近づくことがなく実害はない（本当にハングした場合の CI 失敗検知が
    // 5s→30s に遅くなるだけ）。
    testTimeout: 30_000,
  },
})
