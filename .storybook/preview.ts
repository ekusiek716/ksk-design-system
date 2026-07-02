import * as React from "react"
import type { Preview } from "@storybook/react-vite"
import "../src/index.css"
import "./preview.css"

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
  cobalt: {
    "--Primitive-Brand-50":  "#EEF3FF",
    "--Primitive-Brand-100": "#D9E5FE",
    "--Primitive-Brand-200": "#B3CBFD",
    "--Primitive-Brand-300": "#7FAAFB",
    "--Primitive-Brand-400": "#4398F8",
    "--Primitive-Brand-500": "#2053F5",
    "--Primitive-Brand-600": "#163FF4",
    "--Primitive-Brand-700": "#1234EE",
    "--Primitive-Brand-800": "#0B25A4",
    "--Primitive-Brand-900": "#03155A",
  },
}

function applyTheme(theme: string) {
  const vars = THEMES[theme] ?? THEMES["default"]
  const root = document.documentElement
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value)
  }
}

// ─── Hostile Context（敵対的コンテキスト）───
// DS コンポーネントを「消費側が変な文字色 / 背景を敷いた親」の中に置いて、
// context-independence（文脈非依存）の漏れを炙り出すための診断デコレータ。
// - ink:  実際の消費側を再現（濃い文字色 #1C1A1A）。border は base layer の保険で
//         守られるが、自前で text 色を固定し忘れたコンポーネントは文字/アイコンが黒に化ける。
// - loud: 診断用に毒々しい色。継承漏れがあれば文字/アイコン/枠が即マゼンタ化し、
//         透明な面（bg 未指定のサーフェス）は背景パターンが透けて一目で分かる。
// 漏れていなければ、どのモードでもコンポーネントの見た目は変わらない＝合格。
const HOSTILE: Record<string, React.CSSProperties> = {
  off: {},
  ink: { color: "#1C1A1A" },
  loud: {
    color: "#E5007A",
    background:
      "repeating-linear-gradient(45deg, #FEF9C3, #FEF9C3 12px, #FBCFE8 12px, #FBCFE8 24px)",
  },
}

const preview: Preview = {
  // 全ストーリーで Docs タブを自動生成。
  // 個別ストーリーで opt-out したい場合は story 側で `tags: ['!autodocs']` を指定する。
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#FFFFFF" },
        { name: "gray",  value: "#F7F7F8" },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ["Foundation", ["Guidelines", "Showcase", "Gallery", "*"], "Components", "Shells", "*"],
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
          { value: "cobalt",  title: "Cobalt (音楽・エンタメ)",       icon: "circle" },
        ],
        dynamicTitle: true,
      },
    },
    kskHostile: {
      description: "敵対的コンテキスト（文脈非依存の漏れ検出）",
      toolbar: {
        title: "Hostile ctx",
        icon: "alert",
        items: [
          { value: "off",  title: "Off（通常）",                     icon: "circlehollow" },
          { value: "ink",  title: "Ink（濃色テキスト #1C1A1A・実消費側再現）", icon: "contrast" },
          { value: "loud", title: "Loud（毒色＋背景パターン・診断用）",  icon: "flag" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    kskTheme: "default",
    kskHostile: "off",
  },
  decorators: [
    // 敵対的コンテキストでラップ（off のときは素通し）
    (Story, context) => {
      const mode = (context.globals.kskHostile as string) || "off"
      if (mode === "off") return Story()
      const style = HOSTILE[mode] ?? HOSTILE.off
      return React.createElement(
        "div",
        { style: { ...style, padding: 24 }, "data-ksk-hostile": mode },
        React.createElement(
          "div",
          { style: { marginBottom: 12, font: "12px/1.4 system-ui, sans-serif", opacity: 0.75 } },
          `⚠ hostile-context: ${mode} — この親の文字色/背景を継承して崩れる要素は context-independence 違反（漏れ）`
        ),
        Story()
      )
    },
    (Story, context) => {
      const theme = (context.globals.kskTheme as string) || "default"
      applyTheme(theme)
      return Story()
    },
  ],
}

export default preview
