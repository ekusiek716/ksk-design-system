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
      entry: path.resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      fileName: "index",
    },
    cssFileName: "styles",
    rollupOptions: {
      external: [
        "react",
        "react-dom",
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
        // Mark the entire DS bundle as a Client Module so it can be imported
        // from Next.js App Router Server Components without triggering
        // `React.createContext is not a function` (the bundle pulls in Radix
        // primitives that call createContext at module load).
        banner: '"use client";',
      },
    },
    outDir: "dist",
    emptyOutDir: true,
    copyPublicDir: false,
  },
})
