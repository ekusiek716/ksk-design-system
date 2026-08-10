import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { Text as RNText, View } from "react-native"
import { ThemeProvider, useTheme } from "./theme/ThemeProvider"
import { ActionTile, QuickActionGrid } from "./components/QuickActionGrid"
import { CheckboxGroup } from "./components/CheckboxGroup"
import { RadioGroup } from "./components/RadioGroup"
import { StatusActionBadge } from "./components/StatusActionBadge"
import { CardHeader } from "./components/CardHeader"
import { GradientSurface } from "./components/GradientSurface"

/**
 * native コンポーネント（`src/native/**`）を react-native-web 経由でブラウザ描画する。
 * alias は `.storybook/main.ts` の viteFinal で Storybook 専用に効かせており、
 * ライブラリビルドには influence しない。
 *
 * **実機と同一ではない**: 余白・色・レイアウト・タップ領域の確認には使えるが、
 * Modal の出入り・ぼかし・影・ネイティブのジェスチャは差異が出る。そこは実機で見る。
 */
const meta: Meta = {
  title: "Native/Components",
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <ThemeProvider>
        {/* 実機の 375pt 幅を再現する。native の崩れは幅依存で出ることが多い */}
        <View style={{ width: 375, gap: 24 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
}
export default meta

type Story = StoryObj

/**
 * issue #309: 選択タイルは既定でラベル行の右端にチェックを出す（色だけで伝えない）。
 * `indicator` で差し替え可能、`loading` が最優先。
 */
export const ActionTileSelection: Story = {
  render: () => (
    <QuickActionGrid columns={2}>
      <ActionTile label="選択中" selected />
      <ActionTile label="未選択" />
      <ActionTile label="説明つき" description="下段に説明" selected />
      <ActionTile label="meta と併用" meta="要確認" selected />
      <ActionTile label="文字列 indicator" selected indicator="★" />
      <ActionTile label="読み込み中" selected loading />
    </QuickActionGrid>
  ),
}

/**
 * issue #315: 1 行ラベルの選択肢が並んだときの行間。
 * 行は touchTargets.buttonCTA.min（44）を満たしつつ、gap は scale[1]（4）まで詰める。
 * description が無い行は行内で中央揃えになる。
 */
export const ChoiceGroupSpacing: Story = {
  render: function Render() {
    const [values, setValues] = React.useState<string[]>([])
    const [radio, setRadio] = React.useState<string>("a")
    return (
      <View style={{ gap: 32 }}>
        <CheckboxGroup
          values={values}
          onChange={setValues}
          options={[
            { value: "a", label: "解説が間違っている・わかりにくい" },
            { value: "b", label: "問題文に誤りがある" },
            { value: "c", label: "選択肢に誤りがある" },
            { value: "d", label: "その他" },
          ]}
        />
        <RadioGroup
          value={radio}
          onChange={setRadio}
          options={[
            { value: "a", label: "昇進・資格手当につなげたい" },
            { value: "b", label: "転職・就職を有利にしたい" },
            { value: "c", label: "説明つき", description: "この行だけ頭揃えになる" },
          ]}
        />
      </View>
    )
  },
}

/**
 * issue #316: 非対話（`asStatus`）はタップ最小寸法を適用せず内容にフィットする。
 * compact の非対話は水平パディングを垂直と同値にして正円を保つ。
 */
export const StatusBadgeSizing: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
        <StatusActionBadge asStatus label="Lv.1" state="success" />
        <StatusActionBadge asStatus label="連続0日" state="idle" />
        {/* compact はラベルを隠すので、icon を渡さないとドットだけになり視覚的な意味が無くなる */}
        <StatusActionBadge
          asStatus
          compact
          label="同期済み"
          state="success"
          icon={<RNText style={{ fontSize: 10 }}>✔︎</RNText>}
        />
      </View>
      <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
        <StatusActionBadge label="押せる（36pt 維持）" state="idle" onPress={() => {}} />
        <StatusActionBadge compact label="押せる compact" state="syncing" onPress={() => {}} />
      </View>
    </View>
  ),
}

/**
 * issue #330: tone="on-primary" は画像/グラデーション等の media 上に載せる場合の配色
 * （eyebrow/title = text.on-media、description = text.on-media-secondary）。
 * 既定 tone="default" は白背景カード想定の配色のまま。
 *
 * on-primary は「AA を満たす濃さの media」の上で使うこと。GradientSurface の
 * 既定 stops（Brand 400→500→600）では Brand-500 上の白系テキストが 4.5:1 に
 * 届かないため、ここでは brand.action → active.primary-button（Brand 700→800
 * 相当）の濃いグラデを明示している（白 6.7:1 / 0.8白 4.9:1 で AA 通過）。
 */
function CardHeaderToneDemo() {
  const { theme } = useTheme()
  return (
    <View style={{ gap: 16 }}>
      <View style={{ padding: 16 }}>
        <CardHeader
          eyebrow="今週のおすすめ"
          title="デフォルトの見出し"
          description="白背景カード上での配色（既定）"
        />
      </View>
      <GradientSurface
        stops={[
          { offset: 0, color: theme.brand.action },
          { offset: 1, color: theme.active["primary-button"] },
        ]}
        style={{ padding: 16, borderRadius: 12, minHeight: 120 }}
      >
        <CardHeader
          tone="on-primary"
          eyebrow="今週のおすすめ"
          title="グラデーション上の見出し"
          description="media 上でも視認できる配色"
        />
      </GradientSurface>
    </View>
  )
}

export const CardHeaderTone: Story = {
  render: () => <CardHeaderToneDemo />,
}

function CardHeaderTitleLeadingDemo() {
  return (
    <View style={{ padding: 16 }}>
      <CardHeader
        eyebrow="タスク"
        titleLeading={<RNText>✅</RNText>}
        title="完了したタスク"
        description="見出し先頭に装飾アイコンを添える例"
      />
    </View>
  )
}

export const CardHeaderTitleLeading: Story = {
  render: () => <CardHeaderTitleLeadingDemo />,
}
