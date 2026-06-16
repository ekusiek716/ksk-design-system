# mock

Notion の仕様ページ（または自然言語の仕様）から KSK Design System 準拠のモックを生成し、
`npm run dev`（http://localhost:5173）で確認できるようにする。

`$ARGUMENTS` に Notion の URL / ページID、または仕様テキストを指定。

このコマンドは `/skill mock $ARGUMENTS` に委譲する。本体は `.claude/skills/mock/SKILL.md` を参照。
