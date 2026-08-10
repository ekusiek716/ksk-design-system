import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { View } from "react-native"
import { ThemeProvider } from "./theme/ThemeProvider"
import { ActionTile, QuickActionGrid } from "./components/QuickActionGrid"
import { CheckboxGroup } from "./components/CheckboxGroup"
import { RadioGroup } from "./components/RadioGroup"
import { StatusActionBadge } from "./components/StatusActionBadge"

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
        <StatusActionBadge asStatus compact label="同期済み" state="success" />
      </View>
      <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
        <StatusActionBadge label="押せる（36pt 維持）" state="idle" onPress={() => {}} />
        <StatusActionBadge compact label="押せる compact" state="syncing" onPress={() => {}} />
      </View>
    </View>
  ),
}
