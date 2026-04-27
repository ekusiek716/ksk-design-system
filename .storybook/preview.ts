import type { Preview } from "@storybook/react-vite"
import "../src/index.css"

// テーマごとの --Primitive-Brand-* 変数定義
const THEMES: Record<string, Record<string, string>> = {
  default: {
    "--Primitive-Brand-50":  "#EFF6FF",
    "--Primitive-Brand-100": "#DBEAFE",
    "--Primitive-Brand-200": "#BFDBFE",
    "--Primitive-Brand-300": "#93C5FD",
    "--Primitive-Brand-400": "#60A5FA",
    "--Primitive-Brand-500": "#3B82F6",
    "--Primitive-Brand-600": "#2563EB",
    "--Primitive-Brand-700": "#1D4ED8",
    "--Primitive-Brand-800": "#1E40AF",
    "--Primitive-Brand-900": "#1E3A8A",
  },
  blue: {
    "--Primitive-Brand-50":  "#EFF6FF",
    "--Primitive-Brand-100": "#DBEAFE",
    "--Primitive-Brand-200": "#BFDBFE",
    "--Primitive-Brand-300": "#93C5FD",
    "--Primitive-Brand-400": "#60A5FA",
    "--Primitive-Brand-500": "#3B82F6",
    "--Primitive-Brand-600": "#2563EB",
    "--Primitive-Brand-700": "#1D4ED8",
    "--Primitive-Brand-800": "#1E40AF",
    "--Primitive-Brand-900": "#1E3A8A",
  },
  orange: {
    "--Primitive-Brand-50":  "#FFF7ED",
    "--Primitive-Brand-100": "#FFEDD5",
    "--Primitive-Brand-200": "#FED7AA",
    "--Primitive-Brand-300": "#FDBA74",
    "--Primitive-Brand-400": "#FB923C",
    "--Primitive-Brand-500": "#E04B00",
    "--Primitive-Brand-600": "#EA580C",
    "--Primitive-Brand-700": "#C2410C",
    "--Primitive-Brand-800": "#9A3412",
    "--Primitive-Brand-900": "#7C2D12",
  },
  green: {
    "--Primitive-Brand-50":  "#F0FDF4",
    "--Primitive-Brand-100": "#DCFCE7",
    "--Primitive-Brand-200": "#BBF7D0",
    "--Primitive-Brand-300": "#86EFAC",
    "--Primitive-Brand-400": "#4ADE80",
    "--Primitive-Brand-500": "#16A34A",
    "--Primitive-Brand-600": "#15803D",
    "--Primitive-Brand-700": "#166534",
    "--Primitive-Brand-800": "#14532D",
    "--Primitive-Brand-900": "#052E16",
  },
  violet: {
    "--Primitive-Brand-50":  "#F5F3FF",
    "--Primitive-Brand-100": "#EDE9FE",
    "--Primitive-Brand-200": "#DDD6FE",
    "--Primitive-Brand-300": "#C4B5FD",
    "--Primitive-Brand-400": "#A78BFA",
    "--Primitive-Brand-500": "#7C3AED",
    "--Primitive-Brand-600": "#6D28D9",
    "--Primitive-Brand-700": "#5B21B6",
    "--Primitive-Brand-800": "#4C1D95",
    "--Primitive-Brand-900": "#3B0764",
  },
}

function applyTheme(theme: string) {
  const vars = THEMES[theme] ?? THEMES["default"]
  const root = document.documentElement
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value)
  }
}

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ["UI", "Patterns", "Pages"],
      },
    },
  },
  globalTypes: {
    kskTheme: {
      description: "KSK DS テーマ切替",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "default", title: "Default (Blue / 汎用・SaaS)", icon: "circlehollow" },
          { value: "blue",    title: "Blue (BtoB・リクルート)",      icon: "circle" },
          { value: "orange",  title: "Orange (EC・フード)",           icon: "circle" },
          { value: "green",   title: "Green (ヘルスケア・金融)",      icon: "circle" },
          { value: "violet",  title: "Violet (プレミアム・教育)",     icon: "circle" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    kskTheme: "default",
  },
  decorators: [
    (Story, context) => {
      const theme = (context.globals.kskTheme as string) || "default"
      applyTheme(theme)
      return Story()
    },
  ],
}

export default preview
