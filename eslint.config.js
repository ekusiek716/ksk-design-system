import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import reactHooks from "eslint-plugin-react-hooks"
import kskDeprecated from "./eslint/deprecated.js"
import kskNoColorlessBorder from "./eslint/no-colorless-border.js"

export default tseslint.config(
  // examples/* は独自の package.json / tsconfig を持つ独立サブプロジェクト（RN/RNW）。
  { ignores: ["dist", "storybook-static", "mcp-server/dist", "examples"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "ksk-deprecated": kskDeprecated,
      "ksk-border": kskNoColorlessBorder,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // 段階廃止フロー: warn → error → 削除。
      // 利用側にもこのルールを提供する想定（ksk-design-system/eslint/deprecated）。
      "ksk-deprecated/no-deprecated": "warn",
      // 色指定のないボーダー幅クラス検出（P032）。Tailwind v4 の currentColor 既定対策。
      // 要素単位で CVA base+variant / cn()/三項を統合してからクラス集合で判定する。
      "ksk-border/no-colorless-border": "warn",
      // prop 型を `interface XProps extends React.ComponentProps<"tag"> {}` で
      // 命名する DS の慣習を許可。
      "@typescript-eslint/no-empty-object-type": ["error", { allowInterfaces: "with-single-extends" }],
      // `_` 接頭辞は意図的な未使用。`{ omit, ...rest }` での除外も許可。
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true },
      ],
    },
  },
  {
    // Storybook CSF の `render: () => { const [x] = useState() }` は正当なパターン。
    // render 関数はコンポーネントではないため rules-of-hooks が誤検知する。
    files: ["**/*.stories.tsx"],
    rules: {
      "react-hooks/rules-of-hooks": "off",
    },
  }
)
