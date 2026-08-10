import type { StorybookConfig } from "@storybook/react-vite"

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(ts|tsx)",
  ],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    // play 関数の実行結果を Storybook UI の Interactions パネルに出す。
    // CI では vitest.storybook.config.ts 経由でヘッドレス実行する。
    "@storybook/addon-vitest",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  // native コンポーネント（src/native/**）を Storybook で描画するための alias。
  // react-native をブラウザで動く react-native-web に差し替える。
  // **Storybook 専用**で、ライブラリビルド（vite.config.lib.ts）には一切影響しない
  // ＝ 配布物に react-native-web が混ざることはない（devDependency のまま）。
  //
  // 注意: react-native-web は実機と完全に同じではない。余白・色・レイアウトの確認には
  // 使えるが、Modal の出入り・ぼかし・影・ネイティブのジェスチャは差異が出るため、
  // それらは従来どおり実機で確認する。
  viteFinal: async (config) => {
    config.resolve = config.resolve ?? {}
    // React 二重ロード防止（issue #334）。node_modules が上位ディレクトリにも
    // 存在する環境（git worktree 等）で react-native-web が別の react を
    // 掴むのを防ぐ。理由は vitest.a11y.config.ts のコメント参照。
    config.resolve.dedupe = [
      ...new Set([...(config.resolve.dedupe ?? []), "react", "react-dom", "react-native-web"]),
    ]
    config.resolve.alias = {
      ...(config.resolve.alias as Record<string, string>),
      "react-native": "react-native-web",
    }
    return config
  },
}

export default config
