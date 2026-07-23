import { cva, type VariantProps } from "class-variance-authority"

/**
 * Button の className 生成器（pure cva）。
 *
 * このファイルは **React に依存しない**。Button コンポーネント (button.tsx)
 * と、Server Component 向けの再エクスポート (src/class-names.ts) の両方から
 * 参照される。React フックを含むファイルから export すると "use client" 境界に
 * 巻き込まれて Server Component から import できなくなるため、純粋な variants
 * 定義はここに集約する。
 *
 * 変更時は button.tsx の Button コンポーネントの見た目に直接影響する。
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap typo-label-md transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)] hover:bg-[var(--Hover-Primary-Button)] active:bg-[var(--Active-Primary-Button)] rounded-full",
        secondary: "bg-[var(--Surface-Secondary)] text-[var(--Text-High-Emphasis)] border border-[var(--Border-Medium-Emphasis)] hover:bg-[var(--Hover-Secondary-Button)] rounded-full",
        "secondary-switch": "bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)] border border-[var(--Border-Accent-Primary)] hover:bg-[var(--Hover-Secondary-Button)] rounded-full",
        tertiary: "bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)] border border-[var(--Border-Medium-Emphasis)] hover:bg-[var(--Hover-Tertiary-Button)] rounded-full",
        ghost: "text-[var(--Text-Accent-Primary)] hover:bg-[var(--Hover-Ghost-Button)] rounded-full",
        destructive: "bg-[var(--Caution-Base)] text-[var(--Text-on-Inverse)] hover:bg-[var(--Hover-Destructive-Button)] active:bg-[var(--Active-Destructive-Button)] rounded-full",
        link: "text-[var(--Text-Accent-Primary)] underline-offset-4 hover:underline",
        // glass の押下は不透明度を落とさず「わずかに縮んで増光」させる
        // （iOS の Liquid Glass はタップでガラスがハイライトする挙動）。
        // リリース時はオーバーシュートする bezier で液体的に弾ませる。
        glass: "glass glass-specular text-[var(--Text-High-Emphasis)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:brightness-[1.06] active:scale-[0.96] active:brightness-110 rounded-full",
        "glass-inverse": "glass glass-specular glass-inverse text-[var(--glass-button-text)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:brightness-[1.06] active:scale-[0.96] active:brightness-110 rounded-full",
        // glass-accent — ブランドカラーをティントした glass。FAB（円形アイコンボタン）等の
        // 主要アクションを、中立色の glass より一段強い存在感で目立たせたい時に使う。
        "glass-accent": "glass glass-specular glass-accent text-[var(--Text-on-Inverse)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:brightness-[1.06] active:scale-[0.96] active:brightness-110 rounded-full",
        accent: "bg-gradient-to-r from-[var(--Brand-Primary)] to-[var(--Brand-Action)] text-[var(--Text-on-Inverse)] border border-transparent hover:opacity-90 rounded-full",
        // inverse — 暗背景・ヒーローセクション上に乗せる primary CTA。
        // 白背景 + アクセント文字（Brand-Primary）。
        inverse:
          "bg-[var(--Surface-Primary)] text-[var(--Brand-Primary)] hover:bg-[var(--Primitive-White-Alpha-900)] active:bg-[var(--Primitive-White-Alpha-800)] disabled:bg-[var(--Primitive-White-Alpha-300)] disabled:text-[var(--Text-Disable)] rounded-full",
        // ghost-inverse — 暗背景・ヒーローセクション上の secondary CTA。
        // 透過背景 + 白文字 + 白枠。
        "ghost-inverse":
          "border border-[var(--Primitive-White-Alpha-300)] bg-transparent text-[var(--Text-on-Inverse)] hover:bg-[var(--Primitive-White-Alpha-200)] hover:border-[var(--Primitive-White-Alpha-900)] active:bg-[var(--Primitive-White-Alpha-300)] disabled:border-[var(--Primitive-White-Alpha-200)] disabled:text-[var(--Primitive-White-Alpha-300)] rounded-full",
      },
      size: {
        xs: "h-6 px-2 typo-label-xs",
        sm: "h-8 px-3 typo-label-sm",
        default: "h-10 px-4 typo-label-md",
        lg: "h-12 px-6 typo-label-md",
        xl: "h-14 px-8 typo-label-lg",
        // hero — トップページの hero / final-CTA 専用のピル型特大 CTA。
        // min-h-14 + rounded-full + typo-label-lg。xl とは異なり常に丸い。
        hero: "min-h-14 rounded-full px-6 typo-label-lg",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
        "icon-xl": "size-11",
        // icon-fab — BottomTabBar の pill（h-[58px]）と並べて浮かせる FAB 用。
        // 同じ bottom オフセットで高さがピルと揃うよう 58px 固定にしている。
        "icon-fab": "size-[58px]",
        match: "h-12 px-4 typo-label-md",
      },
      layout: {
        horizontal: "",
        vertical: "flex-col gap-1 h-14 rounded-2xl py-2 typo-label-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      layout: "horizontal",
    },
  }
)

type ButtonVariantsProps = VariantProps<typeof buttonVariants>

export { buttonVariants }
export type { ButtonVariantsProps }
