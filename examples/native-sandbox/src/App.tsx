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
} from '@ksk-native';

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
      <Showcase />
    </ThemeProvider>
  );
}
