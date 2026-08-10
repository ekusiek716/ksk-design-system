import { defineConfig } from "vitest/config"
import path from "node:path"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { playwright } from "@vitest/browser-playwright"
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin"

/**
 * a11y 機械検証（axe-core）専用の Vitest 設定（issue #261）。
 *
 * vitest.storybook.config.ts（interaction テスト）とは意図的に分離している:
 * - interaction テストは `tags: ["interaction"]` を付けた一部のストーリーだけを
 *   対象にする（play 関数の回帰確認が目的で、148 ストーリー全件は CI 時間を
 *   食うため採らない設計 — 同ファイルのコメント参照）。
 * - a11y 検査は axe-core によるコントラスト・aria-label・ラベル関連付け等の
 *   静的な DOM 検査で、ストーリーごとのコストが低い。rules.json A005〜A012 の
 *   うち機械検証できる項目を「全ストーリー」に対して回すのがこの設定の目的。
 *
 * .storybook/preview.ts の `parameters.a11y.test = "error"` により、
 * @storybook/addon-a11y が公開する afterEach フックがストーリー描画のたびに
 * axe-core を実行し、違反があればテストを fail させる。
 *
 * 実行: `npm run test:a11y`
 */
export default defineConfig({
  resolve: {
    // react / react-dom / react-native-web は必ずこのプロジェクト直下の
    // node_modules から解決する（issue #334）。git worktree のように
    // node_modules が上位ディレクトリにも存在しうる環境では、
    // react-native-web だけが上位の node_modules から解決され、その
    // react-native-web が上位の react を掴むことで React が二重ロードされ、
    // `Invalid hook call` / `Cannot read properties of null (reading 'useContext')`
    // で全ストーリーが落ちる。dedupe で単一インスタンスを保証する。
    dedupe: ["react", "react-dom", "react-native-web"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    // `--config` 指定時は vite.config.ts が読まれないため、Storybook 本体と
    // 同じ react / tailwind プラグインをここで明示的に積む
    // （vitest.storybook.config.ts と同じ理由）。
    react(),
    tailwindcss(),
    storybookTest({
      configDir: path.join(__dirname, ".storybook"),
      // tags フィルタなし = 全ストーリーが対象。
    }),
  ],
  test: {
    name: "storybook-a11y",
    // 全 612 テストをヘッドレス chromium で回すため、マシン負荷が高いと
    // 描画待ちでタイムアウトしてフレークする（2026-07-29 に 5 件観測 → 再実行で全緑）。
    // axe 検査は決定的なので、retry は負荷起因の偽陽性だけを吸収する。
    retry: 2,
    testTimeout: 30_000,
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
    },
  },
})
