import React from 'react';
import { View, Pressable, Text as RNText, ScrollView } from 'react-native';
import {
  ThemeProvider,
  useTheme,
  themeNames,
  type ThemeName,
  Text,
  Button,
  Card,
  Badge,
  Stack,
  GlassView,
  // Phase 1
  Avatar,
  Chip,
  Tag,
  Spinner,
  Separator,
  Skeleton,
  Progress,
  ProgressRing,
  StarRating,
  NotificationBadge,
  StatCard,
  SyncStatusBadge,
  // Phase 2
  Input,
  Textarea,
  Switch,
  Checkbox,
  RadioGroup,
  Slider,
  NumberInput,
  FormField,
  // Phase 3
  Alert,
  // Phase 4
  Select,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  PillToggle,
  // Phase 6
  SearchBar,
  ListItem,
  EmptyState,
  SectionHeader,
  ProgressSteps,
  // Phase 7
  PriceDisplay,
  RatingDisplay,
  // 追加: Phase 1
  CountdownTimer,
  SkeletonText,
  // 追加: Phase 2
  AutoGrowTextarea,
  Label,
  CheckboxField,
  CheckboxCard,
  CheckboxGroup,
  // 追加: Phase 3
  Dialog,
  AlertDialog,
  Sheet,
  ResponsiveDialog,
  Popover,
  DropdownMenu,
  ToastProvider,
  useToast,
  MenuDrawer,
  ConfirmDialog,
  BottomSheetForm,
  ReviewOverlay,
  CoachMark,
  CoachMarkOverlay,
  // 追加: Phase 4
  Combobox,
  MultiSelect,
  DropdownFilter,
  Calendar,
  DatePicker,
  TimePicker,
  Accordion,
  Collapsible,
  ScrollArea,
  Pagination,
  SimplePagination,
  // Phase 5
  NavigationBar,
  SubNav,
  Breadcrumb,
  // 追加: Phase 6
  AppHeader,
  Banner,
  BannerCarousel,
  StickyActionBar,
  SwipeRow,
  Footer,
  FileUpload,
  ChipSelector,
  CategoryNav,
  CategoryScroll,
  TagInput,
  ShareButtons,
  FilterChip,
  SocialLoginButton,
  SocialIcon,
  ListSkeletons,
  // 追加: Phase 7
  BottomTabBar,
  FilterBar,
  QuantitySelector,
  ProductCard,
  OrderSummary,
  ReviewCard,
  ReviewSummary,
} from '@ksk-native';

/* ---------- Liquid Glass デモ ---------- */
// グラデーション背景上に GlassView と Button variant="glass" を載せて
// 「背景が透けてぼやける」のを目視確認する。
function GlassDemoSection() {
  const { theme, scales } = useTheme();
  return (
    <View
      style={{
        marginTop: scales.spacing.scale[3],
        borderRadius: scales.borderRadius.lg,
        overflow: 'hidden',
        height: 220,
        // Web only: ガラスの効果を見せるためのカラフルな背景
        backgroundColor: theme.brand.primary,
        backgroundImage:
          'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 35%, #6366F1 70%, #F59E0B 100%)' as any,
      }}
    >
      {/* グラデを上書きするための emoji 風点描 */}
      <View
        style={{
          position: 'absolute',
          top: 30,
          left: 40,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: '#FFFFFF66',
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          right: 60,
          width: 90,
          height: 90,
          borderRadius: 45,
          backgroundColor: '#00000033',
        }}
      />
      <View
        style={{
          position: 'absolute',
          inset: 0,
          padding: scales.spacing.scale[4],
          gap: scales.spacing.scale[3],
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <GlassView intensity="regular" style={{ padding: scales.spacing.scale[4], minWidth: 280 }}>
          <Text variant="label.lg" color="#FFFFFF">
            GlassView intensity=regular
          </Text>
          <Text variant="body.sm" color="rgba(255,255,255,0.85)">
            iOS実機 + expo-blur で UIVisualEffectView (Liquid Glass)
          </Text>
        </GlassView>
        <Stack direction="row" gap={2}>
          <Button variant="glass">glass ボタン</Button>
          <Button variant="glass">もう一つ</Button>
        </Stack>
      </View>
    </View>
  );
}

/* ---------- セクション見出し付きカード ---------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <Card style={{ marginBottom: 16 }}>
      <Text variant="label.lg" color={theme.text['medium-emphasis']}>
        {title}
      </Text>
      {children}
    </Card>
  );
}

/* ---------- ヘッダー（テーマ / モード切替） ---------- */

function Switcher() {
  const { name, mode, setName, toggleMode, theme, scales } = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.surface.primary,
        borderColor: theme.border['low-emphasis'],
        borderBottomWidth: 1,
        padding: scales.spacing.scale[4],
        gap: scales.spacing.scale[3],
      }}
    >
      <Text variant="heading.lg">KSK DS — Native Sandbox</Text>
      <Text variant="body.sm" color={theme.text['low-emphasis']}>
        getTheme() の解決済みトークンを ThemeProvider で配り、DS コンポーネント（Button/Card/Badge/Text/Stack）に流し込んでいる。テーマ／モードで全要素が連動する。
      </Text>
      <Stack direction="row" wrap gap={2} align="center">
        {themeNames.map((tn: ThemeName) => {
          const active = tn === name;
          return (
            <Pressable
              key={tn}
              onPress={() => setName(tn)}
              style={{
                paddingHorizontal: scales.spacing.scale[3],
                minHeight: scales.touchTargets.chip.min,
                justifyContent: 'center',
                borderRadius: scales.borderRadius.full,
                borderWidth: 1,
                backgroundColor: active ? theme.brand.primary : theme.surface.secondary,
                borderColor: active ? theme.brand.primary : theme.border['low-emphasis'],
              }}
            >
              <RNText
                style={[
                  (scales.typography as any).label.sm,
                  { color: active ? theme.text['on-inverse'] : theme.text['medium-emphasis'] },
                ]}
              >
                {tn}
              </RNText>
            </Pressable>
          );
        })}
        <Pressable
          onPress={toggleMode}
          style={{
            paddingHorizontal: scales.spacing.scale[3],
            minHeight: scales.touchTargets.chip.min,
            justifyContent: 'center',
            borderRadius: scales.borderRadius.full,
            borderWidth: 1,
            backgroundColor: theme.surface.inverse,
            borderColor: theme.surface.inverse,
          }}
        >
          <RNText style={[(scales.typography as any).label.sm, { color: theme.text['on-inverse'] }]}>
            {mode === 'light' ? '☾ dark へ' : '☀ light へ'}
          </RNText>
        </Pressable>
      </Stack>
    </View>
  );
}

/* ---------- 色スウォッチ（デモ専用） ---------- */

function Swatch({ label, color, fg }: { label: string; color: string; fg?: string }) {
  const { theme, scales } = useTheme();
  return (
    <View
      style={{
        backgroundColor: color,
        borderColor: theme.border['low-emphasis'],
        borderWidth: 1,
        borderRadius: scales.borderRadius.sm,
        paddingVertical: scales.spacing.scale[3],
        paddingHorizontal: scales.spacing.scale[3],
        minWidth: 116,
      }}
    >
      <Text variant="label.sm" color={fg ?? theme.text['high-emphasis']}>
        {label}
      </Text>
    </View>
  );
}

/* ---------- 新規コンポーネントのデモ ---------- */

function NewComponentsShowcase() {
  const { theme, scales } = useTheme();
  const [tab, setTab] = React.useState('overview');
  const [pill, setPill] = React.useState('all');
  const [select, setSelect] = React.useState<string | undefined>(undefined);
  const [check, setCheck] = React.useState(false);
  const [switchOn, setSwitchOn] = React.useState(true);
  const [slider, setSlider] = React.useState(40);
  const [qty, setQty] = React.useState(1);
  const [search, setSearch] = React.useState('');

  return (
    <View style={{ gap: scales.spacing.scale[3] }}>
      <Section title="Display: Avatar / Chip / Tag / Spinner">
        <Stack direction="row" wrap gap={3} align="center">
          <Avatar fallback="K" />
          <Avatar fallback="A" size="lg" />
          <Chip selected onPress={() => {}}>選択中</Chip>
          <Chip variant="outline" onPress={() => {}}>未選択</Chip>
          <Tag tone="success">完了</Tag>
          <Tag tone="caution" variant="outline">エラー</Tag>
          <Spinner />
        </Stack>
      </Section>

      <Section title="Progress / ProgressRing / StarRating">
        <Stack direction="row" wrap gap={4} align="center">
          <View style={{ flex: 1, minWidth: 180 }}>
            <Progress value={65} />
          </View>
          <ProgressRing value={65} />
          <StarRating value={3.5} readOnly />
        </Stack>
      </Section>

      <Section title="StatCard / SyncStatusBadge / NotificationBadge">
        <Stack direction="row" wrap gap={3} align="flex-start">
          <View style={{ flex: 1, minWidth: 140 }}>
            <StatCard label="売上" value="¥120,400" delta="+12%" trend="up" />
          </View>
          <View style={{ gap: scales.spacing.scale[2] }}>
            <SyncStatusBadge status="synced" />
            <SyncStatusBadge status="syncing" />
            <NotificationBadge count={3}>
              <Avatar fallback="N" />
            </NotificationBadge>
          </View>
        </Stack>
      </Section>

      <Section title="Skeleton">
        <Skeleton height={16} />
        <View style={{ height: 8 }} />
        <Skeleton height={14} width="60%" />
      </Section>

      <Section title="Form: Input / Textarea / Switch / Checkbox / Radio / Slider / NumberInput">
        <FormField label="名前" required description="フルネームで入力">
          <Input placeholder="山田太郎" />
        </FormField>
        <View style={{ height: scales.spacing.scale[2] }} />
        <FormField label="メモ">
          <Textarea placeholder="ここに入力" />
        </FormField>
        <View style={{ height: scales.spacing.scale[3] }} />
        <Stack direction="row" gap={3} align="center">
          <Switch value={switchOn} onValueChange={setSwitchOn} />
          <Checkbox checked={check} onChange={setCheck} />
          <NumberInput value={qty} onChange={setQty} />
        </Stack>
        <View style={{ height: scales.spacing.scale[3] }} />
        <RadioGroup
          value="b"
          options={[
            { value: 'a', label: 'プランA' },
            { value: 'b', label: 'プランB', description: 'おすすめ' },
            { value: 'c', label: 'プランC' },
          ]}
        />
        <View style={{ height: scales.spacing.scale[3] }} />
        <Slider value={slider} onChange={setSlider} />
        <Text variant="label.sm" color={theme.text['low-emphasis']}>
          slider: {slider}
        </Text>
      </Section>

      <Section title="Overlay: Alert">
        <Alert tone="info" title="お知らせ" description="アップデートが利用可能です。" />
        <View style={{ height: scales.spacing.scale[2] }} />
        <Alert tone="caution" title="注意" description="この操作は取り消せません。" />
      </Section>

      <Section title="Select / PillToggle / Tabs">
        <Select
          options={[
            { value: 'tokyo', label: '東京' },
            { value: 'osaka', label: '大阪' },
            { value: 'fukuoka', label: '福岡' },
          ]}
          value={select}
          onChange={setSelect}
          placeholder="都市を選択"
        />
        <View style={{ height: scales.spacing.scale[3] }} />
        <PillToggle
          value={pill}
          onChange={setPill}
          options={[
            { value: 'all', label: 'すべて', count: 24 },
            { value: 'active', label: '進行中', count: 4 },
            { value: 'done', label: '完了', count: 12 },
          ]}
        />
        <View style={{ height: scales.spacing.scale[3] }} />
        <Tabs value={tab} onChange={setTab}>
          <TabsList>
            <TabsTrigger value="overview">概要</TabsTrigger>
            <TabsTrigger value="details">詳細</TabsTrigger>
            <TabsTrigger value="reviews">レビュー</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Text variant="body.md">overview コンテンツ</Text>
          </TabsContent>
          <TabsContent value="details">
            <Text variant="body.md">details コンテンツ</Text>
          </TabsContent>
          <TabsContent value="reviews">
            <Text variant="body.md">reviews コンテンツ</Text>
          </TabsContent>
        </Tabs>
      </Section>

      <Section title="Patterns: SearchBar / ListItem / EmptyState / ProgressSteps">
        <SearchBar value={search} onChange={setSearch} />
        <View style={{ height: scales.spacing.scale[3] }} />
        <SectionHeader title="お気に入り" action={{ label: 'もっと見る', onPress: () => {} }} />
        <ListItem
          title="サンプル商品"
          description="¥1,980 / 在庫あり"
          leading={<Avatar fallback="S" size="sm" />}
          showChevron
          onPress={() => {}}
        />
        <Separator />
        <ListItem
          title="特集記事"
          description="2026/06/16 公開"
          leading={<Avatar fallback="F" size="sm" />}
          showChevron
          onPress={() => {}}
        />
        <View style={{ height: scales.spacing.scale[3] }} />
        <ProgressSteps
          steps={[
            { key: 'cart', label: 'カート' },
            { key: 'address', label: '住所' },
            { key: 'pay', label: '支払い' },
            { key: 'done', label: '完了' },
          ]}
          current={2}
        />
        <View style={{ height: scales.spacing.scale[3] }} />
        <EmptyState title="まだ何もありません" description="新しい記事が公開されると表示されます。" />
      </Section>

      <Section title="Commerce: PriceDisplay / RatingDisplay">
        <Stack direction="row" wrap gap={4} align="flex-start">
          <PriceDisplay price={2980} originalPrice={4980} />
          <RatingDisplay rating={4.3} count={128} />
        </Stack>
      </Section>

      <AllRestShowcase />
    </View>
  );
}

/* ---------- 残りコンポーネント全部のショーケース ---------- */

function AllRestShowcase() {
  const { theme, scales } = useTheme();
  const toast = useToast();

  // 状態
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [responsiveOpen, setResponsiveOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [bottomFormOpen, setBottomFormOpen] = React.useState(false);
  const [reviewOpen, setReviewOpen] = React.useState(false);
  const [coachOpen, setCoachOpen] = React.useState(false);
  const [combo, setCombo] = React.useState<string | undefined>(undefined);
  const [multi, setMulti] = React.useState<string[]>(['ramen']);
  const [dropFilter, setDropFilter] = React.useState<string | undefined>(undefined);
  const [calDate, setCalDate] = React.useState<Date | undefined>(new Date(2026, 5, 17));
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [time, setTime] = React.useState<{ hour: number; minute: number } | undefined>(undefined);
  const [page, setPage] = React.useState(2);
  const [sPage, setSPage] = React.useState(3);
  const [navKey, setNavKey] = React.useState('home');
  const [subKey, setSubKey] = React.useState('all');
  const [catKey, setCatKey] = React.useState('food');
  const [scrollKey, setScrollKey] = React.useState('new');
  const [chipSel, setChipSel] = React.useState<string[]>(['a']);
  const [tags, setTags] = React.useState<string[]>(['React', 'TypeScript']);
  const [check2, setCheck2] = React.useState(false);
  const [checkCard, setCheckCard] = React.useState(true);
  const [checkGroup, setCheckGroup] = React.useState<string[]>(['email']);
  const [agTxt, setAgTxt] = React.useState('');
  const [qty, setQty] = React.useState(1);

  const target = React.useMemo(() => new Date(Date.now() + 1000 * 60 * 60 * 2.5), []);

  return (
    <View style={{ gap: scales.spacing.scale[3] }}>
      <Section title="Phase 1 追加: CountdownTimer / SkeletonText">
        <CountdownTimer target={target} tone="accent" />
        <View style={{ height: scales.spacing.scale[3] }} />
        <SkeletonText lines={3} />
      </Section>

      <Section title="Phase 2 追加: Label / AutoGrowTextarea / CheckboxField / CheckboxCard / CheckboxGroup">
        <Label required>名前ラベル</Label>
        <View style={{ height: scales.spacing.scale[2] }} />
        <AutoGrowTextarea value={agTxt} onChangeText={setAgTxt} placeholder="高さが伸びるテキストエリア" />
        <View style={{ height: scales.spacing.scale[3] }} />
        <CheckboxField
          label="利用規約に同意する"
          description="必要事項を確認してください"
          checked={check2}
          onChange={setCheck2}
        />
        <View style={{ height: scales.spacing.scale[2] }} />
        <CheckboxCard
          title="おすすめプラン"
          description="月額¥980 / 1か月無料"
          checked={checkCard}
          onChange={setCheckCard}
        />
        <View style={{ height: scales.spacing.scale[3] }} />
        <CheckboxGroup
          options={[
            { value: 'email', label: 'メール', description: 'お知らせをメールで受け取る' },
            { value: 'push', label: 'プッシュ通知' },
            { value: 'sms', label: 'SMS' },
          ]}
          values={checkGroup}
          onChange={setCheckGroup}
        />
      </Section>

      <Section title="Phase 3: Overlay 全部（タップで開く）">
        <Stack direction="row" wrap gap={2}>
          <Button onPress={() => setDialogOpen(true)}>Dialog</Button>
          <Button variant="secondary" onPress={() => setAlertDialogOpen(true)}>AlertDialog</Button>
          <Button variant="secondary" onPress={() => setSheetOpen(true)}>Sheet</Button>
          <Button variant="secondary" onPress={() => setResponsiveOpen(true)}>ResponsiveDialog</Button>
          <Button variant="secondary" onPress={() => setDrawerOpen(true)}>MenuDrawer</Button>
          <Button variant="secondary" onPress={() => setConfirmOpen(true)}>ConfirmDialog</Button>
          <Button variant="secondary" onPress={() => setBottomFormOpen(true)}>BottomSheetForm</Button>
          <Button variant="secondary" onPress={() => setReviewOpen(true)}>ReviewOverlay</Button>
          <Button variant="secondary" onPress={() => setCoachOpen(true)}>CoachMark</Button>
          <Button
            variant="tertiary"
            onPress={() => toast.show({ title: 'トースト', description: '保存しました', tone: 'success' })}
          >
            Toast 表示
          </Button>
        </Stack>

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title="ダイアログ"
          description="これは Dialog コンポーネント。バックドロップタップで閉じる。"
          footer={
            <>
              <View style={{ minWidth: 80 }}>
                <Button variant="tertiary" onPress={() => setDialogOpen(false)}>閉じる</Button>
              </View>
              <View style={{ minWidth: 80 }}>
                <Button onPress={() => setDialogOpen(false)}>OK</Button>
              </View>
            </>
          }
        />
        <AlertDialog
          open={alertDialogOpen}
          onClose={() => setAlertDialogOpen(false)}
          title="本当に削除しますか?"
          description="この操作は取り消せません。"
          destructive
          confirmLabel="削除する"
        />
        <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} side="bottom" title="ボトムシート">
          <Text variant="body.md">サイドは bottom / top / left / right の4種類。</Text>
          <View style={{ height: scales.spacing.scale[3] }} />
          <Button onPress={() => setSheetOpen(false)}>閉じる</Button>
        </Sheet>
        <ResponsiveDialog
          open={responsiveOpen}
          onClose={() => setResponsiveOpen(false)}
          title="レスポンシブダイアログ"
          description="幅 ≤ 600 なら Sheet、それ以上は Dialog"
        >
          <View style={{ height: scales.spacing.scale[2] }} />
          <Button onPress={() => setResponsiveOpen(false)}>閉じる</Button>
        </ResponsiveDialog>
        <MenuDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          side="left"
          header={<Text variant="heading.md">メニュー</Text>}
          sections={[
            {
              title: 'メイン',
              items: [
                { key: 'home', label: 'ホーム', active: true },
                { key: 'fav', label: 'お気に入り' },
                { key: 'settings', label: '設定' },
              ],
            },
            {
              title: 'その他',
              items: [
                { key: 'help', label: 'ヘルプ' },
                { key: 'logout', label: 'ログアウト' },
              ],
            },
          ]}
        />
        <ConfirmDialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          title="送信しますか?"
          description="フォームを送信します"
        />
        <BottomSheetForm
          open={bottomFormOpen}
          onClose={() => setBottomFormOpen(false)}
          title="フィードバック"
          description="ご意見をお聞かせください"
          footer={
            <>
              <View style={{ minWidth: 80 }}>
                <Button variant="tertiary" onPress={() => setBottomFormOpen(false)}>キャンセル</Button>
              </View>
              <View style={{ minWidth: 80 }}>
                <Button onPress={() => setBottomFormOpen(false)}>送信</Button>
              </View>
            </>
          }
        >
          <FormField label="お名前"><Input placeholder="山田" /></FormField>
          <FormField label="本文"><Textarea placeholder="ご意見" /></FormField>
        </BottomSheetForm>
        <ReviewOverlay open={reviewOpen} onClose={() => setReviewOpen(false)} />
        <CoachMarkOverlay open={coachOpen} onClose={() => setCoachOpen(false)}>
          <CoachMark
            title="ようこそ"
            description="このボタンで新しい予定を追加できます"
            step={1}
            total={3}
            onNext={() => setCoachOpen(false)}
            onSkip={() => setCoachOpen(false)}
          />
        </CoachMarkOverlay>
      </Section>

      <Section title="Phase 3: Popover / DropdownMenu">
        <PopoverDemo />
      </Section>

      <Section title="Phase 4 追加: Combobox / MultiSelect / DropdownFilter">
        <Combobox
          options={[
            { value: 'apple', label: 'りんご' },
            { value: 'banana', label: 'バナナ' },
            { value: 'cherry', label: 'チェリー' },
            { value: 'grape', label: 'ぶどう' },
          ]}
          value={combo}
          onChange={setCombo}
          placeholder="検索付きで選択"
        />
        <View style={{ height: scales.spacing.scale[3] }} />
        <MultiSelect
          options={[
            { value: 'ramen', label: 'ラーメン' },
            { value: 'sushi', label: '寿司' },
            { value: 'curry', label: 'カレー' },
            { value: 'pizza', label: 'ピザ' },
          ]}
          values={multi}
          onChange={setMulti}
          placeholder="好きな食べ物"
        />
        <View style={{ height: scales.spacing.scale[3] }} />
        <View style={{ flexDirection: 'row', gap: scales.spacing.scale[2], flexWrap: 'wrap' }}>
          <DropdownFilter
            label="価格帯"
            value={dropFilter}
            onChange={setDropFilter}
            options={[
              { value: 'low', label: '〜1000円', count: 24 },
              { value: 'mid', label: '〜3000円', count: 56 },
              { value: 'high', label: '3000円〜', count: 12 },
            ]}
          />
        </View>
      </Section>

      <Section title="Phase 4 追加: Calendar / DatePicker / TimePicker">
        <Calendar value={calDate} onChange={setCalDate} />
        <View style={{ height: scales.spacing.scale[3] }} />
        <Stack direction="row" wrap gap={2}>
          <View style={{ flex: 1, minWidth: 140 }}>
            <DatePicker value={date} onChange={setDate} />
          </View>
          <View style={{ flex: 1, minWidth: 140 }}>
            <TimePicker value={time} onChange={setTime} />
          </View>
        </Stack>
      </Section>

      <Section title="Phase 4 追加: Accordion / Collapsible / ScrollArea / Pagination">
        <Accordion
          items={[
            { key: 'q1', title: 'よくある質問 1', content: <Text variant="body.md">回答 1。</Text> },
            { key: 'q2', title: 'よくある質問 2', content: <Text variant="body.md">回答 2。</Text> },
            { key: 'q3', title: 'よくある質問 3', content: <Text variant="body.md">回答 3。</Text> },
          ]}
        />
        <View style={{ height: scales.spacing.scale[3] }} />
        <Collapsible title="詳細を見る">
          <Text variant="body.md">折りたたみ可能なエリア</Text>
        </Collapsible>
        <View style={{ height: scales.spacing.scale[3] }} />
        <ScrollArea maxHeight={100} bordered>
          {Array.from({ length: 12 }).map((_, i) => (
            <View key={i} style={{ paddingVertical: 6, paddingHorizontal: 12 }}>
              <Text variant="body.md">行 {i + 1}</Text>
            </View>
          ))}
        </ScrollArea>
        <View style={{ height: scales.spacing.scale[3] }} />
        <Pagination page={page} total={20} onChange={setPage} />
        <View style={{ height: scales.spacing.scale[2] }} />
        <SimplePagination page={sPage} total={10} onChange={setSPage} />
      </Section>

      <Section title="Phase 5: NavigationBar / SubNav / Breadcrumb（意味変換）">
        <Breadcrumb title="商品詳細" onBack={() => {}} />
        <View style={{ height: scales.spacing.scale[2] }} />
        <SubNav
          items={[
            { key: 'all', label: 'すべて', count: 124 },
            { key: 'new', label: '新着', count: 8 },
            { key: 'sale', label: 'セール', count: 32 },
            { key: 'fav', label: 'お気に入り' },
          ]}
          value={subKey}
          onChange={setSubKey}
        />
        <View style={{ height: scales.spacing.scale[3] }} />
        <NavigationBar
          items={[
            { key: 'home', label: 'ホーム' },
            { key: 'search', label: '検索' },
            { key: 'cart', label: 'カート', badge: 3 },
            { key: 'me', label: 'マイページ' },
          ]}
          value={navKey}
          onChange={setNavKey}
        />
      </Section>

      <Section title="Phase 6 追加: AppHeader / Banner / BannerCarousel">
        <AppHeader title="マイページ" subtitle="設定" onBack={() => {}} />
        <View style={{ height: scales.spacing.scale[3] }} />
        <Banner title="春の新作キャンペーン" description="期間中ポイント10倍" tone="accent" />
        <View style={{ height: scales.spacing.scale[3] }} />
        <BannerCarousel
          banners={[
            { title: 'バナー1', description: '説明1', tone: 'accent' },
            { title: 'バナー2', description: '説明2', tone: 'success' },
            { title: 'バナー3', description: '説明3', tone: 'warning' },
          ]}
          height={120}
        />
      </Section>

      <Section title="Phase 6 追加: ChipSelector / TagInput / FilterChip / ShareButtons">
        <ChipSelector
          options={[
            { value: 'a', label: 'カテゴリA' },
            { value: 'b', label: 'カテゴリB' },
            { value: 'c', label: 'カテゴリC' },
          ]}
          values={chipSel}
          onChange={setChipSel}
        />
        <View style={{ height: scales.spacing.scale[3] }} />
        <TagInput value={tags} onChange={setTags} placeholder="タグを追加" />
        <View style={{ height: scales.spacing.scale[3] }} />
        <Stack direction="row" wrap gap={2}>
          <FilterChip selected onPress={() => {}}>適用中</FilterChip>
          <FilterChip count={12} onPress={() => {}}>未読</FilterChip>
        </Stack>
        <View style={{ height: scales.spacing.scale[3] }} />
        <ShareButtons message="サンプル投稿" url="https://example.com" />
      </Section>

      <Section title="Phase 6 追加: CategoryNav / CategoryScroll">
        <CategoryNav
          items={[
            { key: 'food', label: 'グルメ' },
            { key: 'shop', label: 'ショッピング' },
            { key: 'beauty', label: '美容' },
            { key: 'travel', label: '旅行' },
          ]}
          value={catKey}
          onChange={setCatKey}
        />
        <View style={{ height: scales.spacing.scale[2] }} />
        <CategoryScroll
          items={[
            { key: 'new', label: '新着', count: 12 },
            { key: 'pop', label: '人気', count: 56 },
            { key: 'rec', label: 'おすすめ' },
            { key: 'sale', label: 'セール', count: 8 },
          ]}
          value={scrollKey}
          onChange={setScrollKey}
        />
      </Section>

      <Section title="Phase 6 追加: FileUpload / SocialLoginButton / SocialIcon / ListSkeletons">
        <FileUpload />
        <View style={{ height: scales.spacing.scale[3] }} />
        <Stack direction="column" gap={2}>
          <SocialLoginButton provider="google" />
          <SocialLoginButton provider="apple" />
          <SocialLoginButton provider="line" />
        </Stack>
        <View style={{ height: scales.spacing.scale[3] }} />
        <Stack direction="row" gap={2} align="center">
          <SocialIcon brand="x" />
          <SocialIcon brand="instagram" />
          <SocialIcon brand="youtube" />
          <SocialIcon brand="line" />
          <SocialIcon brand="facebook" />
        </Stack>
        <View style={{ height: scales.spacing.scale[3] }} />
        <ListSkeletons count={2} variant="row" />
      </Section>

      <Section title="Phase 6 追加: SwipeRow">
        <SwipeRow
          rightActions={[
            { label: '削除', onPress: () => toast.show({ title: '削除しました', tone: 'caution' }) },
          ]}
        >
          <View style={{ padding: scales.spacing.scale[3], backgroundColor: theme.surface.primary }}>
            <Text variant="body.md">左へスワイプ →</Text>
          </View>
        </SwipeRow>
      </Section>

      <Section title="Phase 7 追加: BottomTabBar / FilterBar / QuantitySelector">
        <BottomTabBar
          items={[
            { key: 'home', label: 'ホーム' },
            { key: 'shop', label: 'ストア' },
            { key: 'cart', label: 'カート', badge: 2 },
            { key: 'me', label: 'マイ' },
          ]}
          value="home"
        />
        <View style={{ height: scales.spacing.scale[3] }} />
        <FilterBar
          filters={[
            { key: 'price', label: '価格' },
            { key: 'brand', label: 'ブランド', value: 'Apple', active: true },
            { key: 'color', label: '色' },
          ]}
        />
        <View style={{ height: scales.spacing.scale[3] }} />
        <QuantitySelector value={qty} onChange={setQty} />
      </Section>

      <Section title="Phase 7 追加: ProductCard / OrderSummary / ReviewCard / ReviewSummary">
        <View style={{ width: 180 }}>
          <ProductCard
            title="サンプル商品 サマー Tシャツ"
            price={1980}
            originalPrice={2980}
            rating={4.2}
            reviewCount={36}
            badge="SALE"
            onPress={() => {}}
          />
        </View>
        <View style={{ height: scales.spacing.scale[3] }} />
        <OrderSummary
          lines={[
            { label: '小計', value: 5980 },
            { label: 'クーポン', value: 500, emphasis: 'discount' },
            { label: '配送料', value: 0 },
            { label: '合計', value: 5480, emphasis: 'total' },
          ]}
        />
        <View style={{ height: scales.spacing.scale[3] }} />
        <ReviewCard
          authorName="山田太郎"
          rating={5}
          date="2026/06/01"
          title="期待以上でした"
          comment="商品の品質も配送も完璧。"
          helpfulCount={12}
        />
        <View style={{ height: scales.spacing.scale[3] }} />
        <ReviewSummary
          average={4.3}
          total={172}
          distribution={{ 5: 100, 4: 40, 3: 20, 2: 8, 1: 4 }}
        />
      </Section>
    </View>
  );
}

function PopoverDemo() {
  const { theme, scales } = useTheme();
  const [popOpen, setPopOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const anchor = { x: 20, y: 60, width: 0, height: 0 };
  return (
    <Stack direction="row" wrap gap={2}>
      <Button variant="tertiary" onPress={() => setPopOpen(true)}>Popover を開く</Button>
      <Button variant="tertiary" onPress={() => setMenuOpen(true)}>DropdownMenu を開く</Button>
      <Popover open={popOpen} onClose={() => setPopOpen(false)} anchor={anchor}>
        <View style={{ padding: scales.spacing.scale[2] }}>
          <Text variant="body.md">これはポップオーバーの中身</Text>
        </View>
      </Popover>
      <DropdownMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        anchor={anchor}
        items={[
          { key: 'edit', label: '編集', onSelect: () => {} },
          { key: 'dup', label: '複製', onSelect: () => {} },
          { key: 'del', label: '削除', destructive: true, onSelect: () => {} },
        ]}
      />
    </Stack>
  );
}

/* ---------- ショーケース本体 ---------- */

function Showcase() {
  const { theme, scales } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface.secondary }}>
      <Switcher />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: scales.spacing.scale[4], maxWidth: 880, width: '100%', alignSelf: 'center' }}
      >
        <Section title="Buttons（DSコンポーネント）">
          <Stack direction="row" wrap gap={3} align="center">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="tertiary">Tertiary</Button>
            <Button variant="destructive">Delete</Button>
          </Stack>
          <Text variant="caption" color={theme.text['low-emphasis']}>
            ↓ elevation="raised"（3D 風・押下で沈む）。下辺色は variant の active-* トークンから自動取得。
          </Text>
          <Stack direction="row" wrap gap={3} align="center">
            <Button variant="primary" elevation="raised">Primary</Button>
            <Button variant="secondary" elevation="raised">Secondary</Button>
            <Button variant="tertiary" elevation="raised">Tertiary</Button>
            <Button variant="destructive" elevation="raised">Delete</Button>
          </Stack>
          <GlassDemoSection />
          <Text variant="caption" color={theme.text['low-emphasis']}>
            ※ glass variant: iOS 26 Liquid Glass。RN実機+expo-blurで本物 / Webはbackdrop-filter / Androidは半透明フォールバック
          </Text>
          <Text variant="caption" color={theme.text['low-emphasis']}>
            ※ 押下色は active.*-button トークン。タップで色が変わる。
          </Text>
        </Section>

        <Section title="Badges">
          <Stack direction="row" wrap gap={2} align="center">
            <Badge tone="neutral">neutral</Badge>
            <Badge tone="accent">accent</Badge>
            <Badge tone="success">success</Badge>
            <Badge tone="caution">caution</Badge>
            <Badge tone="warning">warning</Badge>
            <Badge tone="info">info</Badge>
          </Stack>
        </Section>

        <Section title="Cards（elevation）">
          <Stack direction="row" wrap gap={3}>
            {(['sm', 'md', 'lg'] as const).map((e) => (
              <Card key={e} elevation={e} padding={5} style={{ minWidth: 150 }}>
                <Text variant="label.md">elevation {e}</Text>
                <Text variant="body.sm" color={theme.text['medium-emphasis']}>
                  shadow {e}
                </Text>
              </Card>
            ))}
          </Stack>
        </Section>

        <Section title="Surfaces">
          <Stack direction="row" wrap gap={3} align="center">
            <Swatch label="primary" color={theme.surface.primary} />
            <Swatch label="secondary" color={theme.surface.secondary} />
            <Swatch label="tertiary" color={theme.surface.tertiary} />
            <Swatch label="inverse" color={theme.surface.inverse} fg={theme.text['on-inverse']} />
            <Swatch label="accent" color={theme.surface['accent-primary']} fg={theme.text['on-inverse']} />
          </Stack>
        </Section>

        <Section title="Text emphasis">
          <Text variant="body.lg" color={theme.text['high-emphasis']}>High emphasis — 見出し・本文の主役</Text>
          <Text variant="body.lg" color={theme.text['medium-emphasis']}>Medium emphasis — 補助テキスト</Text>
          <Text variant="body.lg" color={theme.text['low-emphasis']}>Low emphasis — メタ情報</Text>
          <Text variant="body.lg" color={theme.text['accent-primary']}>Accent primary — リンク/強調</Text>
        </Section>

        <Section title="Typography scale">
          <Text variant="display.lg">Display lg</Text>
          <Text variant="heading.2xl">Heading 2xl</Text>
          <Text variant="heading.md">Heading md</Text>
          <Text variant="body.md">Body md — 日本語のサンプルテキスト。あいうえお漢字 ABC 123</Text>
          <Text variant="label.md" color={theme.text['medium-emphasis']}>Label md</Text>
          <Text variant="caption" color={theme.text['low-emphasis']}>Caption — 注釈・法的表記用</Text>
        </Section>

        <NewComponentsShowcase />

        <Section title="Categorical (1–8)">
          <Stack direction="row" wrap gap={2} align="center">
            {['1', '2', '3', '4', '5', '6', '7', '8'].map((k) => {
              const c: any = (scales.categorical as any)[k];
              return (
                <View
                  key={k}
                  style={{
                    backgroundColor: c.subtle,
                    borderRadius: scales.borderRadius.full,
                    paddingVertical: scales.spacing.scale[1],
                    paddingHorizontal: scales.spacing.scale[3],
                  }}
                >
                  <Text variant="label.sm" color={c.bold}>{c.hue}</Text>
                </View>
              );
            })}
          </Stack>
        </Section>
      </ScrollView>
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider initialName="default" initialMode="light">
      <ToastProvider>
        <Showcase />
      </ToastProvider>
    </ThemeProvider>
  );
}
