import { defineConfig } from "vitest/config"
import path from "node:path"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { playwright } from "@vitest/browser-playwright"

/**
 * 強制配色（forced-colors / Windows ハイコントラスト等）モードでの
 * フォーカス表示を実ブラウザで検証する Vitest 設定（issue #620）。
 *
 * interaction / a11y の既存 browser mode 設定（vitest.storybook.config.ts /
 * vitest.a11y.config.ts）は `@storybook/addon-vitest` の storybookTest プラグインで
 * ストーリーからテストを自動生成する専用設定のため、任意の `.test.tsx` を
 * 直接書けない。本設定は Storybook を介さず、CDP (`cdp()`) で
 * `Emulation.setEmulatedMedia` を叩いて forced-colors を有効化し、
 * 実際の computed style（outline）を検証する軽量な browser mode 設定として分離した。
 *
 * 実行: `npm run test:forced-colors`
 */
export default defineConfig({
  resolve: {
    dedupe: ["react", "react-dom", "react-native-web"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [react(), tailwindcss()],
  test: {
    name: "forced-colors",
    include: ["__tests__/browser/**/*.test.tsx"],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
    },
  },
})
