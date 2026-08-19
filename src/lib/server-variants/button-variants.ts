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
 *
 * 内寸（高さ・横 padding・gap・角丸）は固定の Tailwind クラスではなく
 * product theme の公開変数（`--Control-*`）を arbitrary value で参照する。
 * 既定値は src/styles/product-theme.css にあり、従来の h-10 / px-4 等と同値
 * （issue #364）。消費プロダクトはこの変数を上書きするだけで、className を
 * 何十箇所も書き換えずにボタンの寸法を自分の製品に合わせられる。
 * 許可リストの正本は contracts/product-theme-overrides.json。
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-[var(--Control-Gap)] whitespace-nowrap typo-label-md transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50 disabled:pointer-events-none disabled:opacity-50 aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)] hover:bg-[var(--Hover-Primary-Button)] active:bg-[var(--Active-Primary-Button)] rounded-[var(--Control-Radius)]",
        secondary: "bg-[var(--Surface-Secondary)] text-[var(--Text-High-Emphasis)] border border-[var(--Border-Medium-Emphasis)] hover:bg-[var(--Hover-Secondary-Button)] rounded-[var(--Control-Radius)]",
        "secondary-switch": "bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)] border border-[var(--Border-Accent-Primary)] hover:bg-[var(--Hover-Secondary-Button)] rounded-[var(--Control-Radius)]",
        tertiary: "bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)] border border-[var(--Border-Medium-Emphasis)] hover:bg-[var(--Hover-Tertiary-Button)] rounded-[var(--Control-Radius)]",
        ghost: "text-[var(--Text-Accent-Primary)] hover:bg-[var(--Hover-Ghost-Button)] rounded-[var(--Control-Radius)]",
        destructive: "bg-[var(--Caution-Base)] text-[var(--Text-on-Inverse)] hover:bg-[var(--Hover-Destructive-Button)] active:bg-[var(--Active-Destructive-Button)] rounded-[var(--Control-Radius)]",
        link: "text-[var(--Text-Accent-Primary)] underline-offset-4 hover:underline",
        // glass の押下は不透明度を落とさず「わずかに縮んで増光」させる
        // （iOS の Liquid Glass はタップでガラスがハイライトする挙動）。
        // リリース時はオーバーシュートする bezier で液体的に弾ませる。
        glass: "glass glass-specular text-[var(--Text-High-Emphasis)] transition-all duration-[var(--Motion-Duration-Slow)] ease-[var(--Motion-Easing-Bounce)] hover:brightness-[1.06] active:scale-[0.96] active:brightness-110 rounded-[var(--Control-Radius)]",
        "glass-inverse": "glass glass-specular glass-inverse text-[var(--glass-button-text)] transition-all duration-[var(--Motion-Duration-Slow)] ease-[var(--Motion-Easing-Bounce)] hover:brightness-[1.06] active:scale-[0.96] active:brightness-110 rounded-[var(--Control-Radius)]",
        // glass-accent — ブランドカラーをティントした glass。FAB（円形アイコンボタン）等の
        // 主要アクションを、中立色の glass より一段強い存在感で目立たせたい時に使う。
        "glass-accent": "glass glass-specular glass-accent text-[var(--Text-on-Inverse)] transition-all duration-[var(--Motion-Duration-Slow)] ease-[var(--Motion-Easing-Bounce)] hover:brightness-[1.06] active:scale-[0.96] active:brightness-110 rounded-[var(--Control-Radius)]",
        accent: "bg-gradient-to-r from-[var(--Brand-Primary)] to-[var(--Brand-Action)] text-[var(--Text-on-Inverse)] border border-transparent hover:opacity-90 rounded-[var(--Control-Radius)]",
        // inverse — 暗背景・ヒーローセクション上に乗せる primary CTA。
        // 白背景 + アクセント文字（Brand-Primary）。
        inverse:
          "bg-[var(--Surface-Primary)] text-[var(--Brand-Primary)] hover:bg-[var(--Primitive-White-Alpha-900)] active:bg-[var(--Primitive-White-Alpha-800)] disabled:bg-[var(--Primitive-White-Alpha-300)] disabled:text-[var(--Text-Disable)] rounded-[var(--Control-Radius)]",
        // ghost-inverse — 暗背景・ヒーローセクション上の secondary CTA。
        // 透過背景 + 白文字 + 白枠。
        "ghost-inverse":
          "border border-[var(--Primitive-White-Alpha-300)] bg-transparent text-[var(--Text-on-Inverse)] hover:bg-[var(--Primitive-White-Alpha-200)] hover:border-[var(--Primitive-White-Alpha-900)] active:bg-[var(--Primitive-White-Alpha-300)] disabled:border-[var(--Primitive-White-Alpha-200)] disabled:text-[var(--Primitive-White-Alpha-300)] rounded-[var(--Control-Radius)]",
      },
      size: {
        xs: "h-[var(--Control-Height-Xs)] px-[var(--Control-Padding-X-Xs)] typo-label-xs",
        sm: "h-[var(--Control-Height-Sm)] px-[var(--Control-Padding-X-Sm)] typo-label-sm",
        default: "h-[var(--Control-Height-Md)] px-[var(--Control-Padding-X-Md)] typo-label-md",
        lg: "h-[var(--Control-Height-Lg)] px-[var(--Control-Padding-X-Lg)] typo-label-md",
        xl: "h-[var(--Control-Height-Xl)] px-[var(--Control-Padding-X-Xl)] typo-label-lg",
        // hero — トップページの hero / final-CTA 専用のピル型特大 CTA。
        // Xl 相当の min-height + Control-Radius + typo-label-lg。xl とは異なり常に丸い。
        hero: "min-h-[var(--Control-Height-Xl)] rounded-[var(--Control-Radius)] px-[var(--Control-Padding-X-Lg)] typo-label-lg",
        icon: "size-[var(--Control-Height-Md)]",
        "icon-sm": "size-[var(--Control-Height-Sm)]",
        "icon-lg": "size-[var(--Control-Height-Lg)]",
        // icon-xl（44px）は HIG の最小タップ領域そのもの。product theme で縮められると
        // a11y 要件を割るため、意図的に Control スケールから外して固定値のままにする。
        "icon-xl": "size-11",
        // icon-fab — BottomTabBar の pill（h-[58px]）と並べて浮かせる FAB 用。
        // 同じ bottom オフセットで高さがピルと揃うよう 58px 固定にしている。
        "icon-fab": "size-[58px]",
        match: "h-[var(--Control-Height-Lg)] px-[var(--Control-Padding-X-Md)] typo-label-md",
      },
      layout: {
        horizontal: "",
        vertical: "flex-col gap-1 h-[var(--Control-Height-Xl)] rounded-2xl py-2 typo-label-sm",
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
