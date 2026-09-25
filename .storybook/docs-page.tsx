import * as React from "react"
import { Title, Subtitle, Description, Primary, Controls, Stories, DocsContext } from "@storybook/addon-docs/blocks"
import guidance from "../contracts/component-docs-guidance.json"
import { findGuide, screenPatterns } from "../src/stories/component-guide"
import { Button } from "../src/components/ui/button"

/** Guidance is read from the same contracts used by implementation checks. */
export function ComponentDocsPage() {
  const context = React.useContext(DocsContext)
  const name = context.componentStories()[0]?.title.split("/").slice(-1)[0] ?? ""
  const native = context.componentStories()[0]?.title.startsWith("Native/")
  const guide = findGuide(name)
  const comparison = guidance.groups.find((group) => group.names.includes(name))
  const patterns = screenPatterns.filter((pattern) => pattern.dsComponents.some((component) => component === name))
  return <>
    <Title /><Subtitle /><Description />
    {native && <><p>React Native版です。以下の用途は共通ですが、propsは各Native部品のソースとNative対応表を参照してください。ブラウザはreact-native-webによる確認で、実OSのキーボード・ジェスチャ・文字拡大は実機検証が必要です。</p><Button variant="link" asChild><a href="./?path=/docs/guides-web-native-support--docs" target="_top">Web / Native 対応表と検証状況を見る</a></Button></>}
    {guide && <section aria-label="使い方ガイド" className="text-[var(--Text-High-Emphasis)] bg-[var(--Surface-Primary)]">
      <h2 className="typo-heading-md text-[var(--Text-High-Emphasis)]">用途</h2>
      <p className="typo-body-md text-[var(--Text-High-Emphasis)]">{guide.description}</p>
      <h2 className="typo-heading-md text-[var(--Text-High-Emphasis)]">{comparison || patterns.length ? "使わない場面・選択時の注意" : "利用上のルール"}</h2>
      <ul>{(comparison ? [comparison.avoid] : patterns.length ? patterns.flatMap((pattern) => pattern.whenNotToUse) : guide.rules?.slice(0, 3) ?? ["画面全体の骨格は「Guides / 用途から選ぶ」で確認してください。"]).map((rule, index) => <li key={index}>{rule}</li>)}</ul>
      <h2 className="typo-heading-md text-[var(--Text-High-Emphasis)]">{comparison || patterns.length ? "似た部品との違い" : "関連する構成の選び方"}</h2>
      {comparison ? <p>{comparison.difference}</p> : patterns.length ? patterns.map((pattern) => <p key={pattern.id}>{pattern.name}: {pattern.dsComponentsNote}</p>) : <Button variant="link" asChild><a href="./?path=/story/guides-用途から選ぶ--decision-guide" target="_top">用途から画面の構成を選ぶ</a></Button>}
    </section>}
    <h2>推奨例</h2><Primary /><Controls />
    <h2>バリエーション・状態検証</h2><Stories includePrimary={false} />
  </>
}
