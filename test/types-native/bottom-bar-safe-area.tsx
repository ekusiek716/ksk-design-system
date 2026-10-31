// issue #804 で追加した下端バーの safeArea の prop 契約を型レベルで固定する。
// `npm run check:native`（tsc -p tsconfig.native.json）で検証される。
// BottomTabBar は中で NavigationBar に `...props` で渡すだけなので、型に safeArea が無いと
// 実行時は動くのに TypeScript の利用者だけ `safeArea={false}` を書けなくなる。
import { BottomTabBar, NavigationBar, StickyActionBar } from "../../src/native/components"

const items = [{ key: "home", label: "ホーム" }]

const bottomTabBarOptOut = <BottomTabBar items={items} value="home" safeArea={false} />
const bottomTabBarDefault = <BottomTabBar items={items} value="home" />
const navigationBarOptOut = <NavigationBar items={items} value="home" safeArea={false} />
const stickyActionBarOptOut = <StickyActionBar safeArea={false}>{null}</StickyActionBar>

// @ts-expect-error safeArea は boolean だけを受ける
const bottomTabBarInvalid = <BottomTabBar items={items} safeArea="bottom" />

void [
  bottomTabBarOptOut,
  bottomTabBarDefault,
  navigationBarOptOut,
  stickyActionBarOptOut,
  bottomTabBarInvalid,
]
