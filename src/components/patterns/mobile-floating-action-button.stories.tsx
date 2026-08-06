import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Add } from "iconsax-reactjs"
import { BottomTabBar } from "./commerce/bottom-tab-bar"
import { MobileFloatingActionButton } from "./mobile-floating-action-button"

const meta: Meta<typeof MobileFloatingActionButton> = {
  title: "Components/MobileFloatingActionButton",
  component: MobileFloatingActionButton,
}
export default meta

type Story = StoryObj<typeof MobileFloatingActionButton>

const HomeIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 10.5 12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H4.5A1.5 1.5 0 0 1 3 19.5v-9Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
)

const ListIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const NAV_ITEMS = [
  { label: "ホーム", icon: HomeIcon, isActive: true },
  { label: "一覧", icon: ListIcon },
]

export const WithBottomNavOffset: Story = {
  render: () => (
    <div className="relative min-h-80 rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Secondary)]">
      <MobileFloatingActionButton
        label="追加する"
        icon={<Add size={22} />}
        mobileOnly={false}
        bottomOffset="bottom-nav"
      />
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="relative min-h-80 rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Secondary)]">
      <MobileFloatingActionButton
        label="タスクを追加"
        showLabel
        mobileOnly={false}
        placement="center"
        bottomOffset="none"
      />
    </div>
  ),
}

/**
 * glass variant は背後のコンテンツが透けるのが要点なので、暗い写真風の背景と
 * その上を通るテキストに重ねて、ぼかしとブランドティントが効いているか見る。
 * FAB は position:fixed なので、背景も viewport 全面（layout: fullscreen）にする。
 *
 * ksk-ds-allow-custom-ui: 背景は「消費側の写真コンテンツ」の代役。DS の面ではないため
 * semantic token ではなく写真相当の生グラデーションで置く。
 */
const PhotoBackdrop = ({ children }: { children: ReactNode }) => (
  <div className="relative min-h-screen overflow-hidden bg-[var(--Surface-Inverse)]">
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        backgroundImage:
          "radial-gradient(120% 90% at 15% 10%, #f59e0b 0%, transparent 55%), radial-gradient(110% 80% at 85% 30%, #0ea5e9 0%, transparent 60%), linear-gradient(160deg, #1f2937 0%, #0f172a 100%)",
      }}
    />
    <div className="relative mx-auto flex min-h-screen max-w-[430px] flex-col justify-end gap-2 px-6 pb-8">
      {["読みかけの本を追加", "京都旅行のしおり", "来週の買い出しリスト", "写真の上でも FAB の輪郭が読める"].map((line) => (
        <p key={line} className="typo-body-md text-[var(--Text-on-Inverse)]">
          {line}
        </p>
      ))}
    </div>
    {children}
  </div>
)

export const Glass: Story = {
  name: "Glass (Liquid Glass)",
  parameters: { layout: "fullscreen" },
  render: () => (
    <PhotoBackdrop>
      <MobileFloatingActionButton
        label="追加する"
        icon={<Add size={22} />}
        variant="glass"
        mobileOnly={false}
        bottomOffset="none"
      />
    </PhotoBackdrop>
  ),
}

export const GlassWithLabel: Story = {
  name: "Glass (with label)",
  parameters: { layout: "fullscreen" },
  render: () => (
    <PhotoBackdrop>
      <MobileFloatingActionButton
        label="タスクを追加"
        icon={<Add size={22} />}
        variant="glass"
        showLabel
        mobileOnly={false}
        placement="center"
        bottomOffset="none"
      />
    </PhotoBackdrop>
  ),
}

export const WithPillBottomNavInline: Story = {
  name: "With pill BottomTabBar inline",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="relative min-h-screen bg-[var(--Surface-Secondary)]">
      <div className="mx-auto flex min-h-screen max-w-[430px] flex-col px-6 py-10">
        <div className="space-y-3 rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-4">
          <div className="h-3 w-28 rounded-full bg-[var(--Surface-Tertiary)]" />
          <div className="h-3 w-full rounded-full bg-[var(--Surface-Tertiary)]" />
          <div className="h-3 w-2/3 rounded-full bg-[var(--Surface-Tertiary)]" />
        </div>
      </div>
      <BottomTabBar variant="pill" items={NAV_ITEMS} className="lg:flex" />
      <MobileFloatingActionButton
        label="追加する"
        icon={<Add size={22} />}
        mobileOnly={false}
        bottomOffset="bottom-nav-pill-inline"
      />
    </div>
  ),
}
