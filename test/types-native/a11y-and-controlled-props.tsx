// issue #298 で追加した native の prop 契約を型レベルで固定する。
// `npm run check:native`（tsc -p tsconfig.native.json）で検証される。
import {
  ActionTile,
  Accordion,
  Calendar,
  Collapsible,
  EmptyState,
  ErrorState,
  IconButton,
  ListItem,
} from "../../src/native/components"

// ── ①合成読み上げラベルを受け取れる ──
const listItem = (
  <ListItem
    title="模試2"
    accessibilityLabel="模試2（要解放）"
    accessibilityHint="タップで解放画面へ移動します"
    onPress={() => {}}
  />
)
const actionTile = <ActionTile label="復習" accessibilityLabel="復習 3件の未消化" />
const emptyState = <EmptyState title="まだありません" accessibilityLabel="復習キューは空です" />
const errorState = <ErrorState accessibilityLabel="読み込みに失敗しました" />

// ── ②制御 Collapsible / Accordion ──
const controlledCollapsible = (
  <Collapsible
    title="他の選択肢はなぜ違う？"
    open={true}
    onOpenChange={(open: boolean) => void open}
    trailing={(open) => (open ? "閉じる" : "表示する")}
  >
    <ListItem title="選択肢A" />
  </Collapsible>
)
const controlledAccordion = (
  <Accordion
    type="multiple"
    openKeys={["a"]}
    onOpenChange={(keys: string[]) => void keys}
    items={[{ key: "a", title: "分野別", content: null, trailing: "表示する" }]}
  />
)

// ── ③IconButton は accessibilityLabel 必須 ──
const iconButton = (
  <IconButton
    accessibilityLabel="設定"
    variant="tertiary"
    size="sm"
    icon={({ color, size }: { color: string; size: number }) => (
      <ListItem title={`${color}/${size}`} />
    )}
    onPress={() => {}}
  />
)

// @ts-expect-error アイコンのみのボタンは accessibilityLabel が無いと読み上げ不能なので必須
const iconButtonWithoutLabel = <IconButton icon={null} />

// ── ④Calendar の表現力 ──
const calendar = (
  <Calendar
    weekendTone
    todayEmphasis="dot"
    disablePast
    dayAccessibilityLabel={(info) =>
      `${info.date.getDate()}日を受験日に設定${info.disabled ? "（選択不可）" : ""}`
    }
    renderDay={(info) => <ListItem title={String(info.date.getDate())} />}
    onMonthChange={(month: Date) => void month}
  />
)

void [
  listItem,
  actionTile,
  emptyState,
  errorState,
  controlledCollapsible,
  controlledAccordion,
  iconButton,
  iconButtonWithoutLabel,
  calendar,
]
