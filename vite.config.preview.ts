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
