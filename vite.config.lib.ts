import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      // Multi-entry build:
      //   index       → 全コンポーネント（"use client" 付きの Client Module）
      //   class-names → Server-safe な cva variants 集（バナーなし、RSC から import 可）
      entry: {
        index: path.resolve(__dirname, "src/index.ts"),
        "class-names": path.resolve(__dirname, "src/class-names.ts"),
        // native → RN/Expo 向け解決済みトークン（React/DOM 非依存の純データ）。
        native: path.resolve(__dirname, "src/tokens/native/index.ts"),
        // native/ui → RN コンポーネント + ThemeProvider（react / react-native は external）。
        "native/ui": path.resolve(__dirname, "src/native/index.ts"),
      },
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    cssFileName: "styles",
    rollupOptions: {
      // external: ソース内で実際に直接 import している peer のみを列挙。
      // 個別 @radix-ui/react-* パッケージは radix-ui namespace package 経由で
      // 参照する方針に統一済み（v1.37.4 以降）。例外は @radix-ui/react-slot
      // のみで、これは webpack の静的解析が radix-ui の `export * as Slot`
      // 名前空間 re-export を辿れない既知問題を回避するため direct import
      // を維持している（src/components/ui/form.tsx）。
      external: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react-native",
        "iconsax-reactjs",
        "lucide-react",
        "class-variance-authority",
        "clsx",
        "tailwind-merge",
        "radix-ui",
        "@radix-ui/react-slot",
      ],
      output: {
        // src/lib/server-variants/* に置いた pure cva 定義を独立チャンクに
        // 切り出す。class-names エントリと index エントリの両方から参照される
        // 共通モジュールとして、deterministic な名前で chunk 化することで
        // banner 制御を予測可能にする。
        manualChunks: (id) => {
          if (id.includes("/src/lib/server-variants/")) {
            return "server-variants"
          }
          return undefined
        },
        // Mark the main bundle as a Client Module so it can be imported
        // from Next.js App Router Server Components without triggering
        // `React.createContext is not a function` (the bundle pulls in Radix
        // primitives that call createContext at module load).
        // class-names / server-variants は React に依存しないので banner を
        // 付けず、RSC から import 可能にする。
        banner: (chunk) => {
          if (
            chunk.name === "class-names" ||
            chunk.name === "server-variants" ||
            chunk.name === "native" ||
            chunk.name === "native/ui"
          ) {
            return ""
          }
          return '"use client";'
        },
      },
    },
    outDir: "dist",
    emptyOutDir: true,
    copyPublicDir: false,
  },
})
