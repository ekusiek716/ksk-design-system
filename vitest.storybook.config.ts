import { defineConfig } from "vitest/config"
import path from "node:path"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { playwright } from "@vitest/browser-playwright"
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin"

/**
 * interaction テスト（Storybook play 関数）専用の Vitest 設定。
 *
 * 単体テスト（vitest.config.ts / `npm test`）とは意図的に分離している:
 * - 単体テストは node 環境で高速に回す（react-dom/server による SSR 検証）
 * - interaction テストは playwright chromium の実ブラウザで回す
 *   （レイアウト・pointer-events・フォーカスなど実描画が要るため）
 *
 * .storybook/preview.ts のデコレータ・CSS import は
 * @storybook/addon-vitest が自動適用する（Storybook 10.3+）。
 *
 * 実行: `npm run test:interaction`
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    // `--config` 指定時は vite.config.ts が読まれないため、Storybook 本体と
    // 同じ react / tailwind プラグインをここで明示的に積む。
    // これが無いと Tailwind ユーティリティが 1 つも生成されず、
    // 見た目・レイアウトを検証する play 関数が偽陽性になる。
    react(),
    tailwindcss(),
    storybookTest({
      configDir: path.join(__dirname, ".storybook"),
      // play 関数を持つ回帰テスト用ストーリーだけを対象にする。
      // 148 ストーリー全件のスモークテストは CI 時間を食うため採らない。
      tags: { include: ["interaction"] },
    }),
  ],
  test: {
    name: "storybook",
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
    },
  },
})
