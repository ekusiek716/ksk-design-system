// =============================================================
// モックプレビュー（src/prototypes 一覧）を Vercel に独立デプロイするための
// ビルド設定。配布用ライブラリの `dist/`（vite.config.lib.ts の出力）と
// 衝突しないよう、出力先は `dist-preview/` に分ける。
// =============================================================
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "path"

export default defineConfig({
  // Storybook と同一 Vercel プロジェクトのサブパスで配信するため `/preview/` を base に。
  // Storybook = `/`、モック一覧 = `/preview/` で並列公開する設計（vercel.json の build:vercel が
  // dist-preview/ を storybook-static/preview/ にコピーして出力を統合する）。
  base: "/preview/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist-preview",
    emptyOutDir: true,
  },
})
