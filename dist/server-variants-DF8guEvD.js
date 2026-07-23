import { cva as e } from "class-variance-authority";
//#region src/lib/server-variants/button-variants.ts
var t = e("inline-flex items-center justify-center gap-2 whitespace-nowrap typo-label-md transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50 disabled:pointer-events-none disabled:opacity-50 aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer", {
	variants: {
		variant: {
			default: "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)] hover:bg-[var(--Hover-Primary-Button)] active:bg-[var(--Active-Primary-Button)] rounded-full",
			secondary: "bg-[var(--Surface-Secondary)] text-[var(--Text-High-Emphasis)] border border-[var(--Border-Medium-Emphasis)] hover:bg-[var(--Hover-Secondary-Button)] rounded-full",
			"secondary-switch": "bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)] border border-[var(--Border-Accent-Primary)] hover:bg-[var(--Hover-Secondary-Button)] rounded-full",
			tertiary: "bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)] border border-[var(--Border-Medium-Emphasis)] hover:bg-[var(--Hover-Tertiary-Button)] rounded-full",
			ghost: "text-[var(--Text-Accent-Primary)] hover:bg-[var(--Hover-Ghost-Button)] rounded-full",
			destructive: "bg-[var(--Caution-Base)] text-[var(--Text-on-Inverse)] hover:bg-[var(--Hover-Destructive-Button)] active:bg-[var(--Active-Destructive-Button)] rounded-full",
			link: "text-[var(--Text-Accent-Primary)] underline-offset-4 hover:underline",
			glass: "glass glass-specular text-[var(--Text-High-Emphasis)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:brightness-[1.06] active:scale-[0.96] active:brightness-110 rounded-full",
			"glass-inverse": "glass glass-specular glass-inverse text-[var(--glass-button-text)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:brightness-[1.06] active:scale-[0.96] active:brightness-110 rounded-full",
			"glass-accent": "glass glass-specular glass-accent text-[var(--Text-on-Inverse)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:brightness-[1.06] active:scale-[0.96] active:brightness-110 rounded-full",
			accent: "bg-gradient-to-r from-[var(--Brand-Primary)] to-[var(--Brand-Action)] text-[var(--Text-on-Inverse)] border border-transparent hover:opacity-90 rounded-full",
			inverse: "bg-[var(--Surface-Primary)] text-[var(--Brand-Primary)] hover:bg-[var(--Primitive-White-Alpha-900)] active:bg-[var(--Primitive-White-Alpha-800)] disabled:bg-[var(--Primitive-White-Alpha-300)] disabled:text-[var(--Text-Disable)] rounded-full",
			"ghost-inverse": "border border-[var(--Primitive-White-Alpha-300)] bg-transparent text-[var(--Text-on-Inverse)] hover:bg-[var(--Primitive-White-Alpha-200)] hover:border-[var(--Primitive-White-Alpha-900)] active:bg-[var(--Primitive-White-Alpha-300)] disabled:border-[var(--Primitive-White-Alpha-200)] disabled:text-[var(--Primitive-White-Alpha-300)] rounded-full"
		},
		size: {
			xs: "h-6 px-2 typo-label-xs",
			sm: "h-8 px-3 typo-label-sm",
			default: "h-10 px-4 typo-label-md",
			lg: "h-12 px-6 typo-label-md",
			xl: "h-14 px-8 typo-label-lg",
			hero: "min-h-14 rounded-full px-6 typo-label-lg",
			icon: "size-10",
			"icon-sm": "size-8",
			"icon-lg": "size-12",
			"icon-xl": "size-11",
			"icon-fab": "size-[58px]",
			match: "h-12 px-4 typo-label-md"
		},
		layout: {
			horizontal: "",
			vertical: "flex-col gap-1 h-14 rounded-2xl py-2 typo-label-sm"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default",
		layout: "horizontal"
	}
});
//#endregion
export { t };
