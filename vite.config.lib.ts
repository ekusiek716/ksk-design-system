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
      },
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    cssFileName: "styles",
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "iconsax-reactjs",
        "lucide-react",
        "class-variance-authority",
        "clsx",
        "tailwind-merge",
        "radix-ui",
        "@radix-ui/react-accordion",
        "@radix-ui/react-avatar",
        "@radix-ui/react-checkbox",
        "@radix-ui/react-dialog",
        "@radix-ui/react-label",
        "@radix-ui/react-popover",
        "@radix-ui/react-progress",
        "@radix-ui/react-radio-group",
        "@radix-ui/react-scroll-area",
        "@radix-ui/react-select",
        "@radix-ui/react-separator",
        "@radix-ui/react-slot",
        "@radix-ui/react-switch",
        "@radix-ui/react-tabs",
        "@radix-ui/react-toast",
        "@radix-ui/react-tooltip",
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
          if (chunk.name === "class-names" || chunk.name === "server-variants") {
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
