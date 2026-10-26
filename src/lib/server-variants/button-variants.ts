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
/**
 * 見た目より小さいボタン（xs / sm / icon-sm）の当たり判定を 44×44px まで広げる
 * 透明な before 擬似要素（issue #601。Chip と同じ方式）。
 *
 * - 見た目の寸法・レイアウトは変えない（ボタンの中心から上下左右に 44px 四方へ
 *   はみ出すだけ）。Chip のように縦 margin で行の高さを予約する方式は、既存
 *   consumer の全レイアウトが動くので採らない。
 * - 隣のボタンと当たり判定を重ねたくない場合は、見た目の端同士を
 *   「44px − 見た目の寸法」以上空ける（sm / icon-sm: 12px = gap-3、xs: 20px = gap-5）。
 *   それより詰めると、間の帯は DOM で後ろのボタンが取る。間隔が拡張量の半分
 *   （sm / icon-sm: 6px、xs: 10px）未満だと隣の見た目の端まで取るので避ける
 *   （TouchTargetsDoNotOverlap ストーリーで固定）。
 * - glass 系（glass / glass-inverse / glass-accent）には付けない。`.glass-specular` が
 *   非レイヤー CSS で ::before（スペキュラ）/ ::after（縁の光）を使い、さらに
 *   `overflow: hidden` を持つため、拡張しても切り取られるうえ、min-h / translate が
 *   スペキュラ層に効いてハイライトがずれる。glass で小さい操作子が要る場合は
 *   icon / icon-lg / icon-xl を使う。
 * - consumer が `overflow-hidden` を足すと拡張部分が切られて効かなくなる。
 */
const TOUCH_TARGET_EXTENSION =
  "relative before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:size-full before:min-h-11 before:min-w-11 before:content-['']"

/** 当たり判定拡張を付ける variant（glass 系を除く全部）。 */
const TOUCH_TARGET_VARIANTS = [
  "default",
  "secondary",
  "secondary-switch",
  "tertiary",
  "ghost",
  "ghost-neutral",
  "ghost-destructive",
  "ghost-success",
  "destructive",
  "info",
  "warning",
  "success",
  "link",
  "accent",
  "inverse",
  "ghost-inverse",
] as const

/**
 * 塗りつぶし variant（default / destructive / info / warning / success / accent）は、
 * フォーカスリングを面から離す 2px のすき間（focus-visible:ring-offset-2、Surface-Primary 色）を各 variant に持つ。
 * クラス名は完全な文字列で書く必要があるため定数にまとめず、各行へ直書きしている。
 *
 * ライトの Focus-High-Emphasis は Brand-600 で、default / accent の面（Brand-Primary = 600）と
 * 同色になる。すき間が無いとリングが面に溶けて「少し大きくなっただけ」に見える。
 * destructive / info / warning / success も、リングが隣り合う面と色相違いで明度が近く、
 * 3px のリングだけだと境目が曖昧になるため同じ扱いにする。
 *
 * 付けない variant:
 * - secondary / tertiary / ghost 系 / link: 面が淡色か無く、リングが面と同色にならない。
 * - inverse: 面が Surface-Primary（白）なので、白のすき間は面が広がって見えるだけで効果が無い。
 * - glass 系: 面が半透明のガラスで、不透明なすき間がガラス表現を壊す。また .glass は非レイヤー CSS で
 *   box-shadow を宣言しており（glass.css）、レイヤー内の ring 系ユーティリティより優先されるため、
 *   下の base の `focus-visible:ring-*` は glass 系では描かれない（死んだクラス）。glass 系のフォーカス
 *   リングは glass.css が :focus-visible のときに box-shadow の先頭へ重ねる二重リング
 *   （--glass-focus-ring。写真・ブラー面の上でも溶けない白 + 濃色）が担う。
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-[var(--Control-Gap)] whitespace-nowrap typo-label-md transition-colors focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)] disabled:pointer-events-none disabled:opacity-50 aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)] hover:bg-[var(--Hover-Primary-Button)] active:bg-[var(--Active-Primary-Button)] rounded-[var(--Control-Radius)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--Surface-Primary)]",
        secondary: "bg-[var(--Surface-Secondary)] text-[var(--Text-High-Emphasis)] border border-[var(--Border-Medium-Emphasis)] hover:bg-[var(--Hover-Secondary-Button)] rounded-[var(--Control-Radius)]",
        "secondary-switch": "bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)] border border-[var(--Border-Accent-Primary)] hover:bg-[var(--Hover-Secondary-Button)] rounded-[var(--Control-Radius)]",
        tertiary: "bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)] border border-[var(--Border-Medium-Emphasis)] hover:bg-[var(--Hover-Tertiary-Button)] rounded-[var(--Control-Radius)]",
        ghost: "text-[var(--Text-Accent-Primary)] hover:bg-[var(--Hover-Ghost-Button)] rounded-[var(--Control-Radius)]",
        // ghost-neutral — 背景も枠も無い灰色の文字ボタン（issue #664）。
        // スキップ・あとで・閉じる・解約手続きなど、押してほしくない補助・離脱の操作に使う。
        // 文字は Text-Medium-Emphasis（light / dark とも AA。scripts/check-contrast.mjs で検査）。
        "ghost-neutral": "text-[var(--Text-Medium-Emphasis)] hover:bg-[var(--Hover-Ghost-Button)] rounded-[var(--Control-Radius)]",
        // ghost-destructive / ghost-success — 文字だけの弱い意味色ボタン（issue #671）。
        // 確認を挟む削除の 1 段目・取り消し（ghost-destructive）や「解決」（ghost-success）に使う。
        // 確認する側の最終ボタンは塗りの destructive を使う。hover の面は淡い単色の Surface-Caution /
        // Surface-Success（半透明の *-Subtle だと light の ghost-success が AA を割るため）。
        "ghost-destructive": "text-[var(--Text-Caution)] hover:bg-[var(--Surface-Caution)] rounded-[var(--Control-Radius)]",
        "ghost-success": "text-[var(--Text-Success)] hover:bg-[var(--Surface-Success)] rounded-[var(--Control-Radius)]",
        destructive: "bg-[var(--Caution-Base)] text-[var(--Text-on-Inverse)] hover:bg-[var(--Hover-Destructive-Button)] active:bg-[var(--Active-Destructive-Button)] rounded-[var(--Control-Radius)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--Surface-Primary)]",
        // info / warning / success — 状態色で意味を伝えるボタン（issue #598）。
        // ブランドに連動しない固定の状態色。文字は --Text-on-Inverse で、light / dark とも
        // 背景・hover・active の全段で WCAG AA（scripts/check-contrast.mjs で検査）。
        // 取り消せない操作は destructive を使う（warning は「注意を促す」用途）。
        info: "bg-[var(--Info-Base)] text-[var(--Text-on-Inverse)] hover:bg-[var(--Hover-Info-Button)] active:bg-[var(--Active-Info-Button)] rounded-[var(--Control-Radius)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--Surface-Primary)]",
        warning: "bg-[var(--Warning-Base)] text-[var(--Text-on-Inverse)] hover:bg-[var(--Hover-Warning-Button)] active:bg-[var(--Active-Warning-Button)] rounded-[var(--Control-Radius)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--Surface-Primary)]",
        success: "bg-[var(--Success-Base)] text-[var(--Text-on-Inverse)] hover:bg-[var(--Hover-Success-Button)] active:bg-[var(--Active-Success-Button)] rounded-[var(--Control-Radius)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--Surface-Primary)]",
        link: "text-[var(--Text-Accent-Primary)] underline-offset-4 hover:underline",
        // glass の押下は不透明度を落とさず「わずかに縮んで増光」させる
        // （iOS の Liquid Glass はタップでガラスがハイライトする挙動）。
        // リリース時はオーバーシュートする bezier で液体的に弾ませる。
        glass: "glass glass-specular text-[var(--Text-High-Emphasis)] transition-all duration-[var(--Motion-Duration-Slow)] ease-[var(--Motion-Easing-Bounce)] hover:brightness-[1.06] active:scale-[0.96] active:brightness-110 rounded-[var(--Control-Radius)]",
        "glass-inverse": "glass glass-specular glass-inverse text-[var(--glass-button-text)] transition-all duration-[var(--Motion-Duration-Slow)] ease-[var(--Motion-Easing-Bounce)] hover:brightness-[1.06] active:scale-[0.96] active:brightness-110 rounded-[var(--Control-Radius)]",
        // glass-accent — ブランドカラーをティントした glass。FAB（円形アイコンボタン）等の
        // 主要アクションを、中立色の glass より一段強い存在感で目立たせたい時に使う。
        "glass-accent": "glass glass-specular glass-accent text-[var(--Text-on-Inverse)] transition-all duration-[var(--Motion-Duration-Slow)] ease-[var(--Motion-Easing-Bounce)] hover:brightness-[1.06] active:scale-[0.96] active:brightness-110 rounded-[var(--Control-Radius)]",
        accent: "bg-gradient-to-r from-[var(--Brand-Primary)] to-[var(--Brand-Action)] text-[var(--Text-on-Inverse)] border border-transparent hover:opacity-90 rounded-[var(--Control-Radius)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--Surface-Primary)]",
        // inverse — 暗背景・ヒーローセクション上に乗せる primary CTA。
        // 白背景 + アクセント文字（Brand-Primary）。
        // フォーカスリングは暗い面（Surface-Inverse）に置く前提で、SidebarNav inverse と同じ
        // Object-on-Inverse の不透明リング。Focus-High-Emphasis は Surface-Inverse 上で 3:1 を割る
        // （ライト Gray-900 面で cobalt 2.57 / violet 2.49、ダークは面が白で green 1.74 / orange 2.26 など。実測）。
        // Object-on-Inverse / Surface-Inverse は light / dark とも 17.72:1（check-contrast.mjs が検査）。
        // base の focus-visible:ring-[var(--Focus-High-Emphasis)] は Button では cn()（twMerge）が後勝ちで置き換える。
        inverse:
          "bg-[var(--Surface-Primary)] text-[var(--Brand-Primary)] hover:bg-[var(--Primitive-White-Alpha-900)] active:bg-[var(--Primitive-White-Alpha-800)] disabled:bg-[var(--Primitive-White-Alpha-300)] disabled:text-[var(--Text-Disable)] rounded-[var(--Control-Radius)] focus-visible:ring-[var(--Object-on-Inverse)]",
        // ghost-inverse — 暗背景・ヒーローセクション上の secondary CTA。
        // 透過背景 + 白文字 + 白枠。フォーカスリングは inverse と同じ Object-on-Inverse。
        "ghost-inverse":
          "border border-[var(--Primitive-White-Alpha-300)] bg-transparent text-[var(--Text-on-Inverse)] hover:bg-[var(--Primitive-White-Alpha-200)] hover:border-[var(--Primitive-White-Alpha-900)] active:bg-[var(--Primitive-White-Alpha-300)] disabled:border-[var(--Primitive-White-Alpha-200)] disabled:text-[var(--Primitive-White-Alpha-300)] rounded-[var(--Control-Radius)] focus-visible:ring-[var(--Object-on-Inverse)]",
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
    compoundVariants: [
      {
        variant: [...TOUCH_TARGET_VARIANTS],
        size: ["xs", "sm", "icon-sm"],
        className: TOUCH_TARGET_EXTENSION,
      },
    ],
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
