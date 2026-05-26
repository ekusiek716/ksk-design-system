import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import reactHooks from "eslint-plugin-react-hooks"
import kskDeprecated from "./eslint/deprecated.js"

export default tseslint.config(
  { ignores: ["dist", "storybook-static", "mcp-server/dist"] },
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
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // 段階廃止フロー: warn → error → 削除。
      // 利用側にもこのルールを提供する想定（@ksk/design-system/eslint/deprecated）。
      "ksk-deprecated/no-deprecated": "warn",
    },
  }
)
