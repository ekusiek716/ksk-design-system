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
    include: ["__tests__/**/*.test.{ts,tsx}"],
    exclude: ["node_modules", "dist", "storybook-static", "**/*.stories.tsx"],
  },
})
