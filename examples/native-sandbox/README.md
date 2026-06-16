# KSK DS — Native Sandbox

DS のトークン（`src/tokens/native/`、`generate:tokens` で生成）と RN コンポーネント（`src/native/`）を **ThemeProvider 方式**で消費する検証用サンドボックス。

## これは何

- `App.tsx` は **素の React Native primitives**（`View` / `Text` / `Pressable` / `ScrollView`）＋ DS の `src/native` コンポーネントで書かれている。
- 色・余白・タイポは `useTheme()` が返す**解決済みトークン**から取る（CSS var / Tailwind 非依存）。
- レンダリングは **react-native-web** で行う（= Expo Web の中身）。`expo start --web` を待たずに Vite で即起動でき、Chrome で色テーマを切り替えながら整えられる。
- **App コードは実 Expo プロジェクトにそのまま移植できる**（`react-native-web` エイリアスを外せば本物の RN で動く）。

## 起動

```bash
cd examples/native-sandbox
npm install
npm run dev
# → http://localhost:5191 を Chrome で開く
```

## トークンを変えたら

DS ルートで `npm run generate:tokens` を実行 → `src/tokens/native/` が再生成 → Vite が HMR で反映。

## 実 Expo に持っていくとき

- DS を `ksk-design-system/native`（トークン）/ `ksk-design-system/native/ui`（コンポーネント）から import する。
- shadow は web では `boxShadow`、native では `shadow*` / `elevation`（`scales.shadows.*.elevation`）に出し分ける。
