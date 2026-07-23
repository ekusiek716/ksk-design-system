import { n as e, r as t, t as n } from "../rolldown-runtime-Df-vAQej.js";
import { a as r, i, n as a, r as o, t as s } from "../native-BYLnbCN-.js";
import * as c from "react";
import l, { createContext as u, useCallback as d, useContext as f, useEffect as p, useId as m, useMemo as h, useRef as g, useState as _ } from "react";
import { Fragment as v, jsx as y, jsxs as b } from "react/jsx-runtime";
import { AccessibilityInfo as x, ActivityIndicator as S, Animated as C, Dimensions as w, Easing as T, FlatList as E, Image as D, ImageBackground as O, Keyboard as k, Linking as A, Modal as j, PanResponder as M, Platform as N, Pressable as P, ScrollView as F, Share as I, Text as L, TextInput as R, View as z } from "react-native";
//#region src/native/theme/ThemeProvider.tsx
var B = u(null);
function V({ children: e, initialName: t = "default", initialMode: n = "light" }) {
	let [a, o] = _(t), [s, c] = _(n), l = h(() => ({
		name: a,
		mode: s,
		theme: r[a][s],
		scales: i,
		setName: o,
		setMode: c,
		toggleMode: () => c((e) => e === "light" ? "dark" : "light")
	}), [a, s]);
	return /* @__PURE__ */ y(B.Provider, {
		value: l,
		children: e
	});
}
function H() {
	let e = f(B);
	if (!e) throw Error("useTheme は ThemeProvider の内側で使ってください");
	return e;
}
//#endregion
//#region src/native/typography.ts
function U(e) {
	if (e === "caption") return { ...i.typography.caption };
	if (e === "caption-strong") return { ...i.typography["caption-strong"] };
	if (e === "prose-meta") return { ...i.typography["prose-meta"] };
	let [t, n] = e.split(".");
	return { ...i.typography[t][n] };
}
//#endregion
//#region src/native/components/Text.tsx
var ee = /* @__PURE__ */ new Set(["caption", "caption-strong"]);
function W({ variant: e = "body.md", color: t, style: n, children: r, ...i }) {
	let { theme: a } = H(), o = ee.has(e) ? a.text["low-emphasis"] : a.text["high-emphasis"];
	return /* @__PURE__ */ y(L, {
		style: [
			U(e),
			{ color: t ?? o },
			n
		],
		...i,
		children: r
	});
}
//#endregion
//#region __vite-optional-peer-dep:expo-blur:ksk-design-system
var te = /* @__PURE__ */ e({ default: () => G }), G, ne = n((() => {
	throw G = {}, Error("Could not resolve \"expo-blur\" imported by \"ksk-design-system\". Is it installed?");
})), re = /* @__PURE__ */ e({ default: () => ie }), ie, ae = n((() => {
	throw ie = {}, Error("Could not resolve \"expo-glass-effect\" imported by \"ksk-design-system\". Is it installed?");
})), oe = {
	subtle: {
		blur: 14,
		opacity: .1
	},
	regular: {
		blur: 28,
		opacity: .18
	},
	thick: {
		blur: 56,
		opacity: .28
	}
}, se = {
	subtle: "clear",
	regular: "regular",
	thick: "regular"
};
function ce({ intensity: e = "regular", tint: t = "system", nativeGlass: n = !0, fallback: r = "blur", glassEffectStyle: i, interactive: a = !1, tintColor: o, backgroundFill: s, rimColor: c, highlightColor: l, showRim: u = !0, showHighlight: d = !0, borderRadius: f, absoluteFill: p = !1, style: m, children: h, ...g }) {
	let { scales: _, mode: v } = H(), x = f ?? _.borderRadius.lg, S = oe[e], C = t === "system" ? v === "dark" ? "dark" : "light" : t, w = s ?? (C === "light" ? `rgba(255, 255, 255, ${S.opacity})` : `rgba(20, 20, 30, ${S.opacity})`), T = c ?? (C === "light" ? "rgba(255, 255, 255, 0.42)" : "rgba(255, 255, 255, 0.15)"), E = l ?? (C === "light" ? "rgba(255, 255, 255, 0.72)" : "rgba(255, 255, 255, 0.22)"), D = {
		...p ? le : {},
		borderRadius: x,
		overflow: "hidden",
		backgroundColor: w,
		borderWidth: +!!u,
		borderColor: T
	};
	return n && ge && ve() ? /* @__PURE__ */ b(ge, {
		colorScheme: C,
		glassEffectStyle: i ?? se[e],
		isInteractive: a,
		tintColor: o,
		style: [
			D,
			{ backgroundColor: "transparent" },
			m
		],
		...g,
		children: [
			u && /* @__PURE__ */ y(ue, {
				borderRadius: x,
				borderColor: T
			}),
			d && /* @__PURE__ */ y(de, {
				borderRadius: x,
				color: E
			}),
			h
		]
	}) : r === "blur" && _e && N.OS !== "web" ? /* @__PURE__ */ b(_e, {
		intensity: S.blur * 2.5,
		tint: C === "dark" ? "dark" : "light",
		experimentalBlurMethod: N.OS === "android" ? "dimezisBlurView" : void 0,
		style: [
			D,
			{ backgroundColor: "transparent" },
			m
		],
		...g,
		children: [
			u && /* @__PURE__ */ y(ue, {
				borderRadius: x,
				borderColor: T
			}),
			d && /* @__PURE__ */ y(de, {
				borderRadius: x,
				color: E
			}),
			h
		]
	}) : N.OS === "web" ? /* @__PURE__ */ b(z, {
		style: [{
			...D,
			WebkitBackdropFilter: `blur(${S.blur}px) saturate(1.9) brightness(1.06)`,
			backdropFilter: `blur(${S.blur}px) saturate(1.9) brightness(1.06)`
		}, m],
		...g,
		children: [d && /* @__PURE__ */ y(de, {
			borderRadius: x,
			color: E
		}), h]
	}) : /* @__PURE__ */ b(z, {
		style: [D, m],
		...g,
		children: [d && /* @__PURE__ */ y(de, {
			borderRadius: x,
			color: E
		}), h]
	});
}
var le = {
	position: "absolute",
	top: 0,
	left: 0,
	right: 0,
	bottom: 0
};
function ue({ borderRadius: e, borderColor: t }) {
	return /* @__PURE__ */ y(z, {
		pointerEvents: "none",
		style: {
			...le,
			borderRadius: e,
			borderWidth: 1,
			borderColor: t
		}
	});
}
function de({ borderRadius: e, color: t }) {
	return /* @__PURE__ */ y(z, {
		pointerEvents: "none",
		style: {
			position: "absolute",
			top: 0,
			left: 1,
			right: 1,
			height: 1,
			borderTopLeftRadius: e,
			borderTopRightRadius: e,
			backgroundColor: t
		}
	});
}
var fe = void 0;
function pe() {
	if (fe !== void 0) return fe;
	try {
		fe = (ne(), t(te)).BlurView ?? null;
	} catch {
		fe = null;
	}
	return fe;
}
var K = void 0;
function me() {
	if (K !== void 0) return K;
	try {
		K = (ae(), t(re));
	} catch {
		K = null;
	}
	return K;
}
function he() {
	return me()?.GlassView ?? null;
}
var ge = he(), _e = pe();
function ve() {
	if (N.OS !== "ios") return !1;
	let e = me();
	if (!e?.GlassView) return !1;
	let t = e.isLiquidGlassAvailable?.() ?? !0, n = e.isGlassEffectAPIAvailable?.() ?? !0;
	return t && n;
}
//#endregion
//#region src/native/components/Button.tsx
function q({ variant: e = "primary", elevation: t = "flat", containerStyle: n, pressedContainerStyle: r, textStyle: i, leadingIcon: a, trailingIcon: o, loading: s = !1, loadingLabel: c, children: l, disabled: u, accessibilityState: d, ...f }) {
	let { theme: p, scales: m, mode: h } = H(), g = u || s, _ = {
		primary: {
			bg: p.brand.primary,
			bgActive: p.active["primary-button"],
			fg: p.text["on-inverse"],
			border: p.brand.primary,
			bottomBorder: p.active["primary-button"]
		},
		secondary: {
			bg: p.surface["accent-primary-light"],
			bgActive: p.active["secondary-button"],
			fg: p.text["accent-primary"],
			border: p.border["accent-primary"],
			bottomBorder: p.active["secondary-button"]
		},
		tertiary: {
			bg: p.surface.secondary,
			bgActive: p.active["tertiary-button"],
			fg: p.text["high-emphasis"],
			border: p.border["low-emphasis"],
			bottomBorder: p.active["tertiary-button"]
		},
		destructive: {
			bg: p.caution.base,
			bgActive: p.caution.action,
			fg: p.text["on-inverse"],
			border: p.caution.base,
			bottomBorder: p.caution.action
		}
	};
	if (e === "glass") {
		let e = p.text["high-emphasis"];
		return /* @__PURE__ */ y(P, {
			disabled: g,
			accessibilityState: {
				...d,
				disabled: g,
				busy: s || void 0
			},
			style: {
				minHeight: m.touchTargets.buttonCTA.min,
				borderRadius: m.borderRadius.full,
				overflow: "hidden",
				opacity: g ? .56 : 1
			},
			...f,
			children: ({ pressed: t }) => /* @__PURE__ */ y(ce, {
				intensity: "regular",
				borderRadius: m.borderRadius.full,
				style: {
					minHeight: m.touchTargets.buttonCTA.min,
					paddingHorizontal: m.spacing.scale[5],
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "row",
					gap: m.spacing.scale[2],
					transform: [{ scale: t ? .96 : 1 }]
				},
				children: /* @__PURE__ */ y(ye, {
					color: e,
					textStyle: i,
					loading: s,
					loadingLabel: c,
					leadingIcon: a,
					trailingIcon: o,
					gap: m.spacing.scale[2],
					children: l
				})
			})
		});
	}
	let v = _[e], b = m.elevation[t];
	return /* @__PURE__ */ y(P, {
		disabled: g,
		accessibilityState: {
			...d,
			disabled: g,
			busy: s || void 0
		},
		style: ({ pressed: e }) => [
			{
				minHeight: m.touchTargets.buttonCTA.min,
				paddingHorizontal: m.spacing.scale[5],
				justifyContent: "center",
				alignItems: "center",
				borderRadius: m.borderRadius.lg,
				borderWidth: 1,
				backgroundColor: e && !g ? v.bgActive : v.bg,
				borderColor: v.border,
				opacity: g ? .56 : 1
			},
			t === "raised" && {
				borderBottomWidth: e && !g ? 0 : b.bottomBorderWidth,
				borderBottomColor: v.bottomBorder,
				transform: [{ translateY: e && !g ? b.offset : 0 }],
				marginBottom: e && !g ? b.bottomBorderWidth : 0
			},
			n,
			e && !g && r
		],
		...f,
		children: /* @__PURE__ */ y(ye, {
			color: v.fg,
			textStyle: i,
			loading: s,
			loadingLabel: c,
			leadingIcon: a,
			trailingIcon: o,
			gap: m.spacing.scale[2],
			children: l
		})
	});
}
function ye({ color: e, textStyle: t, loading: n, loadingLabel: r, leadingIcon: i, trailingIcon: a, gap: o, children: s }) {
	let c = [
		U("label.md"),
		{ color: e },
		t
	];
	return n ? /* @__PURE__ */ b(z, {
		style: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			gap: o
		},
		children: [/* @__PURE__ */ y(S, {
			size: "small",
			color: e
		}), r ? /* @__PURE__ */ y(L, {
			style: c,
			children: r
		}) : null]
	}) : /* @__PURE__ */ b(z, {
		style: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			gap: o
		},
		children: [
			i,
			be(s, c),
			a
		]
	});
}
function be(e, t) {
	return l.Children.map(e, (e) => typeof e == "string" || typeof e == "number" ? /* @__PURE__ */ y(L, {
		style: t,
		children: e
	}) : e);
}
//#endregion
//#region src/native/components/Card.tsx
var xe = {
	sm: {
		shadowOffset: {
			width: 0,
			height: 1
		},
		shadowOpacity: .05,
		shadowRadius: 2
	},
	md: {
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: .08,
		shadowRadius: 8
	},
	lg: {
		shadowOffset: {
			width: 0,
			height: 12
		},
		shadowOpacity: .12,
		shadowRadius: 24
	}
};
function Se(e, t) {
	return {
		shadowColor: t,
		...xe[e]
	};
}
function Ce({ padding: e = 4, elevation: t, style: n, children: r, ...i }) {
	let { theme: a, scales: o } = H(), s = t ? N.select({
		web: { boxShadow: o.shadows[t].boxShadow },
		ios: Se(t, a.overlay.dark),
		default: { elevation: o.shadows[t].elevation }
	}) : void 0;
	return /* @__PURE__ */ y(z, {
		style: [
			{
				backgroundColor: a.surface.primary,
				borderColor: a.border["low-emphasis"],
				borderWidth: 1,
				borderRadius: o.borderRadius.lg,
				padding: o.spacing.scale[e],
				gap: o.spacing.scale[3]
			},
			s,
			n
		],
		...i,
		children: r
	});
}
//#endregion
//#region src/native/components/Badge.tsx
function we({ tone: e = "neutral", children: t }) {
	let { theme: n, scales: r } = H(), i = {
		neutral: {
			bg: n.surface.tertiary,
			fg: n.text["medium-emphasis"]
		},
		accent: {
			bg: n.surface["accent-primary-light"],
			fg: n.text["accent-primary"]
		},
		success: {
			bg: n.surface.success,
			fg: n.text.success
		},
		caution: {
			bg: n.surface.caution,
			fg: n.text.caution
		},
		warning: {
			bg: n.surface.warning,
			fg: n.text.warning
		},
		info: {
			bg: n.surface.info,
			fg: n.text.info
		}
	}[e];
	return /* @__PURE__ */ y(z, {
		style: {
			backgroundColor: i.bg,
			borderRadius: r.borderRadius.full,
			paddingVertical: r.spacing.scale[1],
			paddingHorizontal: r.spacing.scale[3],
			alignSelf: "flex-start"
		},
		children: /* @__PURE__ */ y(L, {
			style: [U("label.sm"), { color: i.fg }],
			children: t
		})
	});
}
//#endregion
//#region src/native/components/Stack.tsx
function Te({ gap: e = 3, direction: t = "column", align: n, justify: r, wrap: i = !1, style: a, children: o, ...s }) {
	let { scales: c } = H();
	return /* @__PURE__ */ y(z, {
		style: [{
			flexDirection: t,
			gap: c.spacing.scale[e],
			alignItems: n,
			justifyContent: r,
			flexWrap: i ? "wrap" : "nowrap"
		}, a],
		...s,
		children: o
	});
}
//#endregion
//#region __vite-optional-peer-dep:react-native-svg:ksk-design-system
var Ee = /* @__PURE__ */ e({ default: () => De }), De, Oe = n((() => {
	throw De = {}, Error("Could not resolve \"react-native-svg\" imported by \"ksk-design-system\". Is it installed?");
}));
//#endregion
//#region src/native/components/GradientSurface.tsx
function ke({ direction: e = "vertical", stops: t, style: n, children: i }) {
	let { name: a } = H(), o = m().replace(/[^a-zA-Z0-9_-]/g, ""), s = r[a], c = t && t.length >= 2 ? t : [
		{
			offset: 0,
			color: s.dark.brand.primary
		},
		{
			offset: .55,
			color: s.dark.surface["accent-primary"]
		},
		{
			offset: 1,
			color: s.light.brand.primary
		}
	], l = c[Math.floor(c.length / 2)], u = je();
	return /* @__PURE__ */ b(z, {
		style: [{
			flex: 1,
			backgroundColor: l.color,
			overflow: "hidden"
		}, n],
		children: [u ? /* @__PURE__ */ b(u.Svg, {
			style: {
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0
			},
			preserveAspectRatio: "xMidYMid slice",
			children: [/* @__PURE__ */ y(u.Defs, { children: /* @__PURE__ */ y(u.LinearGradient, {
				id: o,
				x1: "0",
				y1: "0",
				x2: e === "horizontal" ? "1" : "0",
				y2: e === "horizontal" ? "0" : "1",
				children: c.map((e) => /* @__PURE__ */ y(u.Stop, {
					offset: String(e.offset),
					stopColor: e.color
				}, e.offset))
			}) }), /* @__PURE__ */ y(u.Rect, {
				x: "0",
				y: "0",
				width: "100%",
				height: "100%",
				fill: `url(#${o})`
			})]
		}) : null, i]
	});
}
var Ae = void 0;
function je() {
	if (Ae !== void 0) return Ae;
	try {
		let e = (Oe(), t(Ee));
		Ae = e.Defs && e.LinearGradient && e.Stop && e.Rect && (e.Svg ?? e.default) ? {
			Svg: e.Svg ?? e.default,
			Defs: e.Defs,
			LinearGradient: e.LinearGradient,
			Stop: e.Stop,
			Rect: e.Rect
		} : null;
	} catch {
		Ae = null;
	}
	return Ae;
}
//#endregion
//#region src/native/components/FloatingTabBar.tsx
function Me({ items: e, activeKey: t, onSelect: n, tone: i = "surface", style: a, labelStyle: o }) {
	let { name: s, theme: c, scales: l } = H(), u = r[s], d = i === "hero" ? {
		pillBg: u.light.brand["ultra-light"],
		itemActiveBg: u.light.brand.light,
		label: u.dark.brand.light,
		labelActive: u.dark.brand.light,
		pressedBg: u.dark.brand.action
	} : {
		pillBg: c.surface.secondary,
		itemActiveBg: c.surface["accent-primary-light"],
		label: c.text["medium-emphasis"],
		labelActive: c.text["accent-primary"],
		pressedBg: c.active["tertiary-button"]
	};
	return /* @__PURE__ */ y(z, {
		accessibilityRole: "tablist",
		style: [{
			flexDirection: "row",
			backgroundColor: d.pillBg,
			borderRadius: l.borderRadius.full,
			padding: l.spacing.scale[1]
		}, a],
		children: e.map((e) => {
			let r = e.key === t;
			return /* @__PURE__ */ b(P, {
				accessibilityRole: "tab",
				accessibilityState: { selected: r },
				accessibilityLabel: e.label,
				onPress: () => n(e.key),
				style: ({ pressed: e }) => ({
					flex: 1,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					gap: l.spacing.scale[1],
					minHeight: l.touchTargets.buttonCTA.min,
					borderRadius: l.borderRadius.full,
					backgroundColor: e ? d.pressedBg : r ? d.itemActiveBg : "transparent"
				}),
				children: [e.icon, /* @__PURE__ */ y(L, {
					style: [
						U("label.md"),
						{ color: r ? d.labelActive : d.label },
						o
					],
					children: e.label
				})]
			}, e.key);
		})
	});
}
//#endregion
//#region src/native/components/Avatar.tsx
var Ne = {
	sm: 32,
	md: 40,
	lg: 56,
	xl: 80
};
function Pe({ source: e, fallback: t, size: n = "md" }) {
	let { theme: r } = H(), i = Ne[n];
	return e ? /* @__PURE__ */ y(D, {
		source: e,
		style: {
			width: i,
			height: i,
			borderRadius: i / 2,
			backgroundColor: r.surface.tertiary
		}
	}) : /* @__PURE__ */ y(z, {
		style: {
			width: i,
			height: i,
			borderRadius: i / 2,
			backgroundColor: r.surface.tertiary,
			alignItems: "center",
			justifyContent: "center"
		},
		children: /* @__PURE__ */ y(L, {
			style: [U("label.sm"), { color: r.text["medium-emphasis"] }],
			children: t ?? "?"
		})
	});
}
//#endregion
//#region src/native/components/Chip.tsx
var Fe = {
	sm: 28,
	md: 32,
	lg: 36
}, Ie = {
	sm: 10,
	md: 12,
	lg: 16
};
function Le({ variant: e = "filled", size: t = "md", shape: n = "pill", selected: r = !1, disabled: i = !1, count: a, removable: o = !1, onRemove: s, children: c, ...l }) {
	let { theme: u, scales: d } = H(), f = {
		filled: {
			bg: u.surface.secondary,
			fg: u.text["high-emphasis"],
			border: "transparent"
		},
		accent: {
			bg: u.surface["accent-primary-light"],
			fg: u.text["accent-primary"],
			border: "transparent"
		},
		outline: {
			bg: "transparent",
			fg: u.text["high-emphasis"],
			border: u.border["medium-emphasis"]
		}
	}[e], p = r ? u.brand.primary : f.bg, m = r ? u.text["on-inverse"] : i ? u.text.disable : f.fg, h = r ? u.brand.primary : f.border;
	return /* @__PURE__ */ b(z, {
		style: {
			flexDirection: "row",
			alignSelf: "flex-start"
		},
		children: [/* @__PURE__ */ b(P, {
			disabled: i,
			style: ({ pressed: a }) => [{
				height: Fe[t],
				paddingHorizontal: Ie[t],
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "center",
				gap: d.spacing.scale[1],
				borderRadius: n === "pill" ? d.borderRadius.full : d.borderRadius.sm,
				borderWidth: e === "outline" || r ? 1 : 0,
				borderColor: h,
				backgroundColor: a && !i ? u.active["secondary-button"] : p,
				opacity: i ? .6 : 1
			}, o && {
				borderTopRightRadius: 0,
				borderBottomRightRadius: 0
			}],
			...l,
			children: [/* @__PURE__ */ y(L, {
				style: [U("label.sm"), { color: m }],
				children: c
			}), a !== void 0 && /* @__PURE__ */ y(z, {
				style: {
					minWidth: 20,
					paddingHorizontal: 6,
					borderRadius: d.borderRadius.full,
					backgroundColor: r ? u.surface.primary : u.surface.tertiary,
					alignItems: "center",
					justifyContent: "center"
				},
				children: /* @__PURE__ */ y(L, {
					style: [U("label.xs"), { color: r ? u.text["accent-primary"] : u.text["medium-emphasis"] }],
					children: a
				})
			})]
		}), o && /* @__PURE__ */ y(P, {
			onPress: s,
			disabled: i,
			style: ({ pressed: a }) => ({
				height: Fe[t],
				paddingHorizontal: 10,
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: a ? u.active["tertiary-button"] : p,
				borderTopRightRadius: n === "pill" ? d.borderRadius.full : d.borderRadius.sm,
				borderBottomRightRadius: n === "pill" ? d.borderRadius.full : d.borderRadius.sm,
				borderWidth: e === "outline" || r ? 1 : 0,
				borderLeftWidth: 0,
				borderColor: h,
				opacity: i ? .6 : 1
			}),
			children: /* @__PURE__ */ y(L, {
				style: [U("label.md"), {
					color: m,
					lineHeight: 14
				}],
				children: "×"
			})
		})]
	});
}
//#endregion
//#region src/native/components/Tag.tsx
function Re({ tone: e = "neutral", variant: t = "filled", children: n }) {
	let { theme: r, scales: i } = H(), a = {
		neutral: {
			bg: r.surface.tertiary,
			fg: r.text["medium-emphasis"]
		},
		accent: {
			bg: r.surface["accent-primary-light"],
			fg: r.text["accent-primary"]
		},
		success: {
			bg: r.surface.success,
			fg: r.text.success
		},
		caution: {
			bg: r.surface.caution,
			fg: r.text.caution
		},
		warning: {
			bg: r.surface.warning,
			fg: r.text.warning
		},
		info: {
			bg: r.surface.info,
			fg: r.text.info
		}
	}, o = {
		neutral: {
			fg: r.text["medium-emphasis"],
			border: r.border["medium-emphasis"]
		},
		accent: {
			fg: r.text["accent-primary"],
			border: r.border["accent-primary"]
		},
		success: {
			fg: r.text.success,
			border: r.border.success
		},
		caution: {
			fg: r.text.caution,
			border: r.border.caution
		},
		warning: {
			fg: r.text.warning,
			border: r.border.warning
		},
		info: {
			fg: r.text.info,
			border: r.border.info
		}
	}, s = t === "filled" ? a[e] : null, c = t === "outline" ? o[e] : null;
	return /* @__PURE__ */ y(z, {
		style: {
			backgroundColor: s?.bg ?? "transparent",
			borderColor: c?.border,
			borderWidth: +(t === "outline"),
			borderRadius: i.borderRadius.sm,
			paddingVertical: i.spacing.scale[1],
			paddingHorizontal: i.spacing.scale[2],
			alignSelf: "flex-start"
		},
		children: /* @__PURE__ */ y(L, {
			style: [U("label.xs"), { color: s?.fg ?? c?.fg ?? r.text["medium-emphasis"] }],
			children: n
		})
	});
}
//#endregion
//#region src/native/components/Spinner.tsx
function ze({ size: e = "md", color: t }) {
	let { theme: n } = H();
	return /* @__PURE__ */ y(S, {
		size: e === "sm" ? "small" : "large",
		color: t ?? n.brand.primary
	});
}
//#endregion
//#region src/native/components/Separator.tsx
function J({ orientation: e = "horizontal", emphasis: t = "low" }) {
	let { theme: n } = H(), r = t === "low" ? n.border["low-emphasis"] : n.border["medium-emphasis"];
	return e === "vertical" ? /* @__PURE__ */ y(z, { style: {
		width: 1,
		alignSelf: "stretch",
		backgroundColor: r
	} }) : /* @__PURE__ */ y(z, { style: {
		height: 1,
		alignSelf: "stretch",
		backgroundColor: r
	} });
}
//#endregion
//#region src/native/components/Skeleton.tsx
function Y({ width: e = "100%", height: t = 16, radius: n, style: r }) {
	let { theme: i, scales: a } = H(), [o] = _(() => new C.Value(.4));
	return p(() => {
		let e = C.loop(C.sequence([C.timing(o, {
			toValue: 1,
			duration: 800,
			useNativeDriver: !0
		}), C.timing(o, {
			toValue: .4,
			duration: 800,
			useNativeDriver: !0
		})]));
		return e.start(), () => e.stop();
	}, [o]), /* @__PURE__ */ y(C.View, { style: [{
		width: e,
		height: t,
		backgroundColor: i.surface.tertiary,
		borderRadius: n ?? a.borderRadius.md,
		opacity: o
	}, r] });
}
function Be({ lines: e = 3 }) {
	return /* @__PURE__ */ y(z, {
		style: { gap: 8 },
		children: Array.from({ length: e }).map((t, n) => /* @__PURE__ */ y(Y, {
			height: 12,
			width: n === e - 1 ? "60%" : "100%"
		}, n))
	});
}
var Ve = {
	warningFrom: 80,
	cautionFrom: 100
};
function He(e, t, n) {
	return n ? 45 : t === 0 ? 0 : Math.min(100, Math.max(0, e / t * 100));
}
function Ue(e) {
	return e === "accent" ? "default" : e;
}
function We(e, t, n) {
	if (!n) return t;
	let r = n === !0 ? Ve : {
		...Ve,
		...n
	};
	return r.successBelow != null && e < r.successBelow ? "success" : r.cautionFrom != null && e >= r.cautionFrom ? "caution" : r.warningFrom != null && e >= r.warningFrom || r.warningBelow != null && e < r.warningBelow ? "warning" : t;
}
function Ge(e, t, n, r, i) {
	let a = n ?? Ue(t);
	return i ? a : We(e, a, r);
}
//#endregion
//#region src/native/components/Progress.tsx
function Ke({ value: e, max: t = 100, height: n = 8, tone: r = "accent", variant: i, autoColor: a, masked: o }) {
	let { theme: s, scales: c } = H(), l = He(e, t, o), u = Ge(l, r, i, a, o), d = {
		default: s.brand.primary,
		success: s.success.base,
		warning: s.warning.base,
		caution: s.caution.base
	}[u];
	return /* @__PURE__ */ y(z, {
		style: {
			width: "100%",
			height: n,
			borderRadius: c.borderRadius.full,
			backgroundColor: s.surface.tertiary,
			overflow: "hidden"
		},
		children: /* @__PURE__ */ y(z, { style: {
			width: `${l}%`,
			height: "100%",
			backgroundColor: d,
			borderRadius: c.borderRadius.full
		} })
	});
}
//#endregion
//#region src/native/components/ProgressRing.tsx
function qe({ value: e, max: t = 100, size: n = 64, thickness: r = 6, showLabel: i = !0 }) {
	let { theme: a } = H(), o = Math.min(100, Math.max(0, e / t * 100)), s = o / 100 * 360, c = a.surface.tertiary, l = a.brand.primary, u = n / 2, d = (e) => /* @__PURE__ */ y(z, {
		style: {
			position: "absolute",
			width: n,
			height: n,
			transform: [{ rotate: `${e}deg` }]
		},
		children: /* @__PURE__ */ y(z, { style: {
			position: "absolute",
			width: u,
			height: n,
			backgroundColor: l,
			borderTopLeftRadius: u,
			borderBottomLeftRadius: u
		} })
	});
	return /* @__PURE__ */ b(z, {
		style: {
			width: n,
			height: n,
			alignItems: "center",
			justifyContent: "center"
		},
		children: [
			/* @__PURE__ */ y(z, { style: {
				position: "absolute",
				width: n,
				height: n,
				borderRadius: n / 2,
				backgroundColor: c
			} }),
			s > 0 && d(0),
			s > 180 && d(180),
			s > 0 && s < 180 && /* @__PURE__ */ y(z, {
				style: {
					position: "absolute",
					width: n,
					height: n,
					transform: [{ rotate: `${s - 180}deg` }]
				},
				children: /* @__PURE__ */ y(z, { style: {
					position: "absolute",
					right: 0,
					width: u,
					height: n,
					backgroundColor: c,
					borderTopRightRadius: u,
					borderBottomRightRadius: u
				} })
			}),
			s >= 180 && s < 360 && /* @__PURE__ */ y(z, {
				style: {
					position: "absolute",
					width: n,
					height: n,
					transform: [{ rotate: `${s}deg` }]
				},
				children: /* @__PURE__ */ y(z, { style: {
					position: "absolute",
					right: 0,
					width: u,
					height: n,
					backgroundColor: c,
					borderTopRightRadius: u,
					borderBottomRightRadius: u
				} })
			}),
			/* @__PURE__ */ y(z, {
				style: {
					width: n - r * 2,
					height: n - r * 2,
					borderRadius: (n - r * 2) / 2,
					backgroundColor: a.surface.primary,
					alignItems: "center",
					justifyContent: "center"
				},
				children: i && /* @__PURE__ */ b(L, {
					style: [U("label.sm"), { color: a.text["high-emphasis"] }],
					children: [Math.round(o), "%"]
				})
			})
		]
	});
}
//#endregion
//#region src/native/components/StarRating.tsx
function Je({ value: e, max: t = 5, size: n = 20, onChange: r, readOnly: i = !1 }) {
	let { theme: a } = H(), o = a.object.rating, s = a.object["low-emphasis"], c = Math.max(0, Math.min(t, e));
	return /* @__PURE__ */ y(z, {
		style: {
			flexDirection: "row",
			gap: 2
		},
		children: Array.from({ length: t }).map((e, t) => {
			let a = t + 1 <= c, l = !a && t + .5 <= c, u = /* @__PURE__ */ y(L, {
				style: {
					fontSize: n,
					color: a || l ? o : s,
					opacity: l ? .5 : 1
				},
				children: l || a ? "★" : "☆"
			});
			return i || !r ? /* @__PURE__ */ y(z, { children: u }, t) : /* @__PURE__ */ y(P, {
				onPress: () => r(t + 1),
				hitSlop: 8,
				children: u
			}, t);
		})
	});
}
//#endregion
//#region src/native/components/NotificationBadge.tsx
function Ye({ count: e = 0, max: t = 99, dot: n = !1, children: r }) {
	let { theme: i, scales: a } = H();
	return r ? /* @__PURE__ */ b(z, {
		style: { position: "relative" },
		children: [r, (n || e > 0) && /* @__PURE__ */ y(z, {
			style: {
				position: "absolute",
				top: -4,
				right: -4,
				...n ? {
					width: 8,
					height: 8,
					borderRadius: 4
				} : {
					minWidth: 18,
					paddingHorizontal: 6,
					height: 18,
					borderRadius: a.borderRadius.full,
					alignItems: "center",
					justifyContent: "center"
				},
				backgroundColor: i.caution.base,
				borderWidth: 2,
				borderColor: i.surface.primary
			},
			children: !n && /* @__PURE__ */ y(L, {
				style: [U("label.xs"), { color: i.text["on-inverse"] }],
				children: e > t ? `${t}+` : e
			})
		})]
	}) : n ? /* @__PURE__ */ y(z, { style: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: i.caution.base
	} }) : /* @__PURE__ */ y(z, {
		style: {
			minWidth: 18,
			paddingHorizontal: 6,
			height: 18,
			borderRadius: a.borderRadius.full,
			backgroundColor: i.caution.base,
			alignItems: "center",
			justifyContent: "center"
		},
		children: /* @__PURE__ */ y(L, {
			style: [U("label.xs"), { color: i.text["on-inverse"] }],
			children: e > t ? `${t}+` : e
		})
	});
}
//#endregion
//#region src/native/components/StatCard.tsx
function Xe({ label: e, value: t, delta: n, trend: r = "neutral" }) {
	let { theme: i, scales: a } = H(), o = r === "up" ? i.text.success : r === "down" ? i.text.caution : i.text["low-emphasis"];
	return /* @__PURE__ */ b(z, {
		style: {
			backgroundColor: i.surface.primary,
			borderColor: i.border["low-emphasis"],
			borderWidth: 1,
			borderRadius: a.borderRadius.lg,
			padding: a.spacing.scale[4],
			gap: a.spacing.scale[1]
		},
		children: [
			/* @__PURE__ */ y(L, {
				style: [U("label.sm"), { color: i.text["low-emphasis"] }],
				children: e
			}),
			/* @__PURE__ */ y(L, {
				style: [U("heading.2xl"), { color: i.text["high-emphasis"] }],
				children: t
			}),
			n && /* @__PURE__ */ b(L, {
				style: [U("label.sm"), { color: o }],
				children: [
					r === "up" ? "▲" : r === "down" ? "▼" : "■",
					" ",
					n
				]
			})
		]
	});
}
//#endregion
//#region src/native/components/SyncStatusBadge.tsx
function Ze({ status: e, label: t }) {
	let { theme: n, scales: r } = H(), i = {
		synced: {
			bg: n.surface.success,
			fg: n.text.success,
			dot: n.success.base,
			def: "同期済み"
		},
		syncing: {
			bg: n.surface.info,
			fg: n.text.info,
			dot: n.info.base,
			def: "同期中"
		},
		offline: {
			bg: n.surface.tertiary,
			fg: n.text["medium-emphasis"],
			dot: n.text["low-emphasis"],
			def: "オフライン"
		},
		error: {
			bg: n.surface.caution,
			fg: n.text.caution,
			dot: n.caution.base,
			def: "エラー"
		}
	}[e];
	return /* @__PURE__ */ b(z, {
		style: {
			flexDirection: "row",
			alignItems: "center",
			gap: r.spacing.scale[1],
			backgroundColor: i.bg,
			borderRadius: r.borderRadius.full,
			paddingHorizontal: r.spacing.scale[2],
			paddingVertical: r.spacing.scale[1],
			alignSelf: "flex-start"
		},
		children: [e === "syncing" ? /* @__PURE__ */ y(S, {
			size: "small",
			color: i.fg
		}) : /* @__PURE__ */ y(z, { style: {
			width: 6,
			height: 6,
			borderRadius: 3,
			backgroundColor: i.dot
		} }), /* @__PURE__ */ y(L, {
			style: [U("label.xs"), { color: i.fg }],
			children: t ?? i.def
		})]
	});
}
//#endregion
//#region src/native/components/CountdownTimer.tsx
function Qe(e) {
	return e.toString().padStart(2, "0");
}
function $e({ target: e, onComplete: t, tone: n = "neutral" }) {
	let { theme: r, scales: i } = H(), a = e instanceof Date ? e.getTime() : e, [o, s] = _(() => Date.now());
	p(() => {
		let e = setInterval(() => {
			let n = Date.now();
			s(n), n >= a && (clearInterval(e), t?.());
		}, 1e3);
		return () => clearInterval(e);
	}, [a, t]);
	let c = Math.max(0, a - o), l = Math.floor(c / 1e3), u = Math.floor(l / 86400), d = Math.floor(l % 86400 / 3600), f = Math.floor(l % 3600 / 60), m = l % 60, h = n === "accent" ? r.text["accent-primary"] : n === "caution" ? r.text.caution : r.text["high-emphasis"], g = (e, t) => /* @__PURE__ */ b(z, {
		style: {
			alignItems: "center",
			minWidth: 48
		},
		children: [/* @__PURE__ */ y(z, {
			style: {
				backgroundColor: r.surface.secondary,
				paddingVertical: i.spacing.scale[1],
				paddingHorizontal: i.spacing.scale[2],
				borderRadius: i.borderRadius.md
			},
			children: /* @__PURE__ */ y(L, {
				style: [U("heading.md"), { color: h }],
				children: Qe(e)
			})
		}), /* @__PURE__ */ y(L, {
			style: [U("label.xs"), {
				color: r.text["low-emphasis"],
				marginTop: 2
			}],
			children: t
		})]
	});
	return /* @__PURE__ */ b(z, {
		style: {
			flexDirection: "row",
			gap: i.spacing.scale[2]
		},
		children: [
			u > 0 && g(u, "日"),
			g(d, "時間"),
			g(f, "分"),
			g(m, "秒")
		]
	});
}
//#endregion
//#region src/native/components/use-reduce-motion.ts
function et() {
	let [e, t] = _(!1);
	return p(() => {
		let e = !0;
		x.isReduceMotionEnabled().then((n) => {
			e && t(n);
		});
		let n = x.addEventListener("reduceMotionChanged", t);
		return () => {
			e = !1, n.remove();
		};
	}, []), e;
}
//#endregion
//#region src/native/components/Celebration.tsx
var tt = [
	"brand",
	"success",
	"warning",
	"caution",
	"info"
], nt = tt;
function X(e) {
	let t = Math.sin(e * 999) * 1e4;
	return t - Math.floor(t);
}
function rt(e) {
	let [t] = _(() => new C.Value(e));
	return t;
}
var it = 1150, at = 0, ot = 360, st = 120, ct = 280, lt = 12, ut = 28;
function dt({ active: e = !0, trigger: t = "confetti", placement: n = "overlay", effect: r = "fall", emoji: i = "🎉", title: a, description: o, actions: s, interactive: c = !1, cardless: l = !1, particleCount: u = 36, durationMs: d = 2600, duration: f, colors: m, driftRange: g = 160, emojiAnimation: _ = "pop", autoDismissMs: v, onTapDismiss: x, onDone: S, style: w, cardStyle: E, testID: D }) {
	let { theme: O, scales: k } = H(), A = et(), M = v ?? d, N = r === "burst", F = f ?? (N ? it : M), I = m && m.length > 0 ? m : tt, R = t === "confetti" || t === "both", B = !l && (t === "confetti" || t === "emoji" || t === "both"), V = !!(x || c), ee = n === "overlay", W = rt(.94), te = rt(0), G = rt(0), ne = h(() => Array.from({ length: u }, (e, t) => {
		let n = {
			id: t,
			delay: Math.round(N ? X(t + 11) * 80 : X(t + 11) * 420),
			duration: Math.round(F * (.78 + X(t + 21) * .44)),
			rotate: Math.round(X(t + 41) * 720),
			size: 6 + Math.round(X(t + 51) * 6),
			color: I[t % I.length]
		};
		if (N) {
			let e = (at + X(t + 61) * (ot - at)) * Math.PI / 180, r = (X(t + 31) - .5) * g, i = Math.max(40, st + X(t + 71) * (ct - st) + r), a = lt + X(t + 81) * (ut - lt), o = Math.round(Math.cos(e) * i), s = Math.round(Math.sin(e) * i + a);
			return {
				...n,
				left: 0,
				drift: 0,
				finalX: o,
				finalY: s
			};
		}
		return {
			...n,
			left: Math.round(X(t + 1) * 100),
			drift: Math.round((X(t + 31) - .5) * g),
			finalX: 0,
			finalY: 0
		};
	}), [
		u,
		F,
		g,
		I,
		N
	]);
	if (p(() => {
		e && (W.setValue(.94), te.setValue(0), C.parallel([C.timing(te, {
			toValue: 1,
			duration: 160,
			easing: T.out(T.quad),
			useNativeDriver: !0
		}), C.spring(W, {
			toValue: 1,
			friction: 7,
			tension: 110,
			useNativeDriver: !0
		})]).start());
	}, [
		e,
		te,
		W
	]), p(() => {
		if (!e || _ !== "bounce") return;
		if (A) {
			G.setValue(1);
			return;
		}
		G.setValue(0);
		let t = C.sequence([
			C.delay(200),
			C.timing(G, {
				toValue: 1.4,
				duration: 300,
				easing: T.out(T.quad),
				useNativeDriver: !0
			}),
			C.timing(G, {
				toValue: .9,
				duration: 120,
				easing: T.out(T.quad),
				useNativeDriver: !0
			}),
			C.timing(G, {
				toValue: 1,
				duration: 180,
				easing: T.out(T.quad),
				useNativeDriver: !0
			})
		]);
		return t.start(), () => t.stop();
	}, [
		e,
		_,
		G,
		A
	]), p(() => {
		if (!e || !S) return;
		let t = setTimeout(S, M);
		return () => clearTimeout(t);
	}, [
		e,
		S,
		M
	]), !e || t === "none") return null;
	let re = () => {
		if (x) {
			x();
			return;
		}
		c && S?.();
	}, ie = /* @__PURE__ */ b(z, {
		pointerEvents: "box-none",
		testID: D,
		accessibilityRole: "alert",
		accessibilityLiveRegion: "polite",
		style: [ee ? {
			flex: 1,
			alignItems: "center",
			justifyContent: "center"
		} : {
			position: "relative",
			minHeight: B ? 180 : 80,
			alignItems: "center",
			justifyContent: "center",
			overflow: "hidden"
		}, w],
		children: [
			R && /* @__PURE__ */ y(z, {
				pointerEvents: "none",
				style: {
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					overflow: "hidden"
				},
				children: ne.map((e) => N ? /* @__PURE__ */ y(mt, {
					color: ft(O, e.color),
					delay: e.delay,
					duration: e.duration,
					finalX: e.finalX,
					finalY: e.finalY,
					rotate: e.rotate,
					size: e.size
				}, e.id) : /* @__PURE__ */ y(pt, {
					color: ft(O, e.color),
					delay: e.delay,
					duration: e.duration,
					drift: e.drift,
					left: `${e.left}%`,
					rotate: e.rotate,
					size: e.size
				}, e.id))
			}),
			V && /* @__PURE__ */ y(P, {
				accessibilityLabel: "閉じる",
				onPress: re,
				style: {
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0
				}
			}),
			B && /* @__PURE__ */ y(C.View, {
				style: {
					opacity: te,
					transform: [{ scale: W }]
				},
				children: /* @__PURE__ */ b(P, {
					onPress: V ? re : void 0,
					style: [{
						width: "100%",
						maxWidth: 360,
						marginHorizontal: k.spacing.scale[4],
						alignItems: "center",
						borderRadius: k.borderRadius["2xl"],
						borderWidth: 1,
						borderColor: O.border["low-emphasis"],
						backgroundColor: O.surface.primary,
						paddingHorizontal: k.spacing.scale[6],
						paddingVertical: k.spacing.scale[5],
						shadowColor: O.overlay.dark,
						shadowOffset: {
							width: 0,
							height: 12
						},
						shadowOpacity: .14,
						shadowRadius: 24,
						elevation: 10
					}, E],
					children: [
						i && /* @__PURE__ */ y(C.Text, {
							style: [
								U("display.lg"),
								{ marginBottom: k.spacing.scale[3] },
								_ === "bounce" ? { transform: [{ scale: G }] } : null
							],
							children: i
						}),
						a && /* @__PURE__ */ y(L, {
							style: [U("heading.md"), {
								color: O.text["high-emphasis"],
								textAlign: "center"
							}],
							children: a
						}),
						o && /* @__PURE__ */ y(L, {
							style: [U("body.sm"), {
								color: O.text["medium-emphasis"],
								marginTop: k.spacing.scale[1],
								textAlign: "center"
							}],
							children: o
						}),
						s && /* @__PURE__ */ y(P, {
							onPress: () => {},
							style: {
								marginTop: k.spacing.scale[4],
								width: "100%"
							},
							children: s
						})
					]
				})
			})
		]
	});
	return ee ? /* @__PURE__ */ y(j, {
		visible: !0,
		transparent: !0,
		animationType: "none",
		onRequestClose: re,
		children: /* @__PURE__ */ y(z, {
			style: {
				flex: 1,
				backgroundColor: "transparent"
			},
			children: ie
		})
	}) : ie;
}
function ft(e, t) {
	return t === "brand" ? e.brand.primary : t === "success" ? e.success.base : t === "warning" ? e.warning.base : t === "caution" ? e.caution.base : t === "info" || nt.includes(t) ? e.info.base : t;
}
function pt({ color: e, delay: t, duration: n, drift: r, left: i, rotate: a, size: o }) {
	let s = rt(0);
	return p(() => {
		s.setValue(0);
		let e = C.timing(s, {
			toValue: 1,
			duration: n,
			delay: t,
			easing: T.in(T.quad),
			useNativeDriver: !0
		});
		return e.start(), () => e.stop();
	}, [
		t,
		n,
		s
	]), /* @__PURE__ */ y(C.View, { style: {
		position: "absolute",
		top: -12,
		left: i,
		width: o,
		height: Math.max(4, o - 2),
		borderRadius: 2,
		backgroundColor: e,
		opacity: s.interpolate({
			inputRange: [
				0,
				.08,
				.92,
				1
			],
			outputRange: [
				0,
				1,
				1,
				0
			]
		}),
		transform: [
			{ translateY: s.interpolate({
				inputRange: [0, 1],
				outputRange: [0, 760]
			}) },
			{ translateX: s.interpolate({
				inputRange: [0, 1],
				outputRange: [0, r]
			}) },
			{ rotate: s.interpolate({
				inputRange: [0, 1],
				outputRange: ["0deg", `${a}deg`]
			}) }
		]
	} });
}
function mt({ color: e, delay: t, duration: n, finalX: r, finalY: i, rotate: a, size: o }) {
	let s = rt(0), c = Math.round(r * .85), l = Math.round(i * .85 - i * .02);
	return p(() => {
		s.setValue(0);
		let e = C.timing(s, {
			toValue: 1,
			duration: n,
			delay: t,
			easing: T.out(T.cubic),
			useNativeDriver: !0
		});
		return e.start(), () => e.stop();
	}, [
		t,
		n,
		s
	]), /* @__PURE__ */ y(C.View, { style: {
		position: "absolute",
		top: "50%",
		left: "50%",
		width: o,
		height: Math.max(4, o - 2),
		borderRadius: 2,
		backgroundColor: e,
		opacity: s.interpolate({
			inputRange: [
				0,
				.08,
				.6,
				.8,
				1
			],
			outputRange: [
				0,
				1,
				1,
				.9,
				0
			]
		}),
		transform: [
			{ translateX: s.interpolate({
				inputRange: [
					0,
					.6,
					1
				],
				outputRange: [
					0,
					c,
					r
				]
			}) },
			{ translateY: s.interpolate({
				inputRange: [
					0,
					.6,
					1
				],
				outputRange: [
					0,
					l,
					i
				]
			}) },
			{ scale: s.interpolate({
				inputRange: [
					0,
					.6,
					1
				],
				outputRange: [
					.7,
					1,
					1
				]
			}) },
			{ rotate: s.interpolate({
				inputRange: [0, 1],
				outputRange: ["0deg", `${a}deg`]
			}) }
		]
	} });
}
//#endregion
//#region src/native/components/CelebrationDialog.tsx
function ht(e) {
	let [t] = _(() => new C.Value(e));
	return t;
}
function gt({ open: e, onOpenChange: t, icon: n, emoji: r, title: i, description: a, actions: o, autoDismissMs: s, emojiAnimation: c = "pop", effect: l = "burst", particleCount: u, duration: d, colors: f, driftRange: m, testID: h }) {
	let { theme: g, scales: _ } = H(), v = et(), x = ht(0);
	return p(() => {
		if (!e || !s) return;
		let n = setTimeout(() => t(!1), s);
		return () => clearTimeout(n);
	}, [
		e,
		s,
		t
	]), p(() => {
		if (!e || c !== "bounce") return;
		if (v) {
			x.setValue(1);
			return;
		}
		x.setValue(0);
		let t = C.sequence([
			C.delay(200),
			C.timing(x, {
				toValue: 1.4,
				duration: 300,
				easing: T.out(T.quad),
				useNativeDriver: !0
			}),
			C.timing(x, {
				toValue: .9,
				duration: 120,
				easing: T.out(T.quad),
				useNativeDriver: !0
			}),
			C.timing(x, {
				toValue: 1,
				duration: 180,
				easing: T.out(T.quad),
				useNativeDriver: !0
			})
		]);
		return t.start(), () => t.stop();
	}, [
		e,
		c,
		x,
		v
	]), e ? /* @__PURE__ */ y(j, {
		visible: e,
		transparent: !0,
		animationType: "fade",
		onRequestClose: () => t(!1),
		children: /* @__PURE__ */ b(P, {
			testID: h,
			onPress: () => t(!1),
			style: {
				flex: 1,
				backgroundColor: g.overlay.dark,
				alignItems: "center",
				justifyContent: "center",
				padding: _.spacing.scale[4]
			},
			children: [/* @__PURE__ */ y(z, {
				pointerEvents: "none",
				style: {
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0
				},
				children: /* @__PURE__ */ y(dt, {
					active: !0,
					trigger: "confetti",
					placement: "overlay",
					cardless: !0,
					effect: l,
					particleCount: u ?? (l === "burst" ? 40 : 36),
					duration: d,
					colors: f,
					driftRange: m
				})
			}), /* @__PURE__ */ b(P, {
				onPress: () => {},
				style: {
					width: "100%",
					maxWidth: 360,
					alignItems: "center",
					backgroundColor: g.surface.primary,
					borderRadius: _.borderRadius["2xl"],
					paddingHorizontal: _.spacing.scale[6],
					paddingVertical: _.spacing.scale[5]
				},
				children: [
					(n || r) && /* @__PURE__ */ b(z, {
						style: {
							width: 80,
							height: 80,
							marginBottom: _.spacing.scale[4],
							alignItems: "center",
							justifyContent: "center"
						},
						children: [
							/* @__PURE__ */ y(z, { style: {
								position: "absolute",
								top: -12,
								left: -12,
								right: -12,
								bottom: -12,
								borderRadius: 999,
								backgroundColor: g.surface["accent-primary-subtle"],
								opacity: .5
							} }),
							/* @__PURE__ */ y(z, { style: {
								position: "absolute",
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								borderRadius: 999,
								backgroundColor: g.surface["accent-primary-light"],
								borderWidth: 1,
								borderColor: g.surface["accent-primary-subtle"]
							} }),
							n ? /* @__PURE__ */ y(C.View, {
								style: c === "bounce" ? { transform: [{ scale: x }] } : void 0,
								children: n
							}) : /* @__PURE__ */ y(C.Text, {
								style: [U("display.lg"), c === "bounce" ? { transform: [{ scale: x }] } : null],
								children: r
							})
						]
					}),
					/* @__PURE__ */ y(L, {
						style: [U("heading.xl"), {
							color: g.text["high-emphasis"],
							textAlign: "center"
						}],
						children: i
					}),
					a && /* @__PURE__ */ y(L, {
						style: [U("body.sm"), {
							color: g.text["medium-emphasis"],
							marginTop: _.spacing.scale[1],
							textAlign: "center"
						}],
						children: a
					}),
					o && /* @__PURE__ */ y(z, {
						style: {
							marginTop: _.spacing.scale[4],
							width: "100%"
						},
						children: o
					})
				]
			})]
		})
	}) : null;
}
//#endregion
//#region src/native/components/CountdownHero.tsx
function _t(e) {
	if (e instanceof Date) return e;
	let t = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e);
	return t ? new Date(Number(t[1]), Number(t[2]) - 1, Number(t[3])) : new Date(e);
}
function vt(e) {
	let t = new Date(e);
	return t.setHours(0, 0, 0, 0), t;
}
function yt(e) {
	let t = vt(/* @__PURE__ */ new Date()), n = vt(e);
	return Math.round((n.getTime() - t.getTime()) / (1440 * 60 * 1e3));
}
function bt({ targetDate: e, label: t = "残り", todayLabel: n = "本日", pastLabel: r = "経過", unit: i = "days", illustration: a, style: o, testID: s }) {
	let { theme: c, scales: l } = H(), u = yt(h(() => _t(e), [e])), d = u === 0, f = u < 0, p = Math.abs(u), m = d ? n : f ? r : t, g = d ? "0" : String(p);
	return /* @__PURE__ */ b(z, {
		testID: s,
		style: [{ position: "relative" }, o],
		children: [a && /* @__PURE__ */ y(z, {
			pointerEvents: "none",
			style: {
				position: "absolute",
				top: 0,
				right: 0
			},
			children: a
		}), /* @__PURE__ */ b(z, { children: [/* @__PURE__ */ y(L, {
			style: {
				fontSize: 12,
				lineHeight: 14,
				color: c.text["low-emphasis"]
			},
			children: m
		}), /* @__PURE__ */ b(z, {
			style: {
				flexDirection: "row",
				alignItems: "baseline",
				gap: l.spacing.scale[1]
			},
			children: [/* @__PURE__ */ y(L, {
				style: {
					fontFamily: "serif",
					fontWeight: "400",
					fontSize: p >= 100 ? 64 : 88,
					lineHeight: p >= 100 ? 68 : 92,
					color: c.text["accent-primary"]
				},
				children: g
			}), !d && /* @__PURE__ */ y(L, {
				style: {
					fontFamily: "serif",
					fontWeight: "400",
					fontSize: 22,
					lineHeight: 24,
					color: c.text["accent-primary"]
				},
				children: i
			})]
		})] })]
	});
}
//#endregion
//#region src/native/components/Label.tsx
function xt({ required: e, children: t, style: n, ...r }) {
	let { theme: i, scales: a } = H();
	return /* @__PURE__ */ b(z, {
		style: [{
			flexDirection: "row",
			alignItems: "center",
			gap: a.spacing.scale[1]
		}, n],
		...r,
		children: [/* @__PURE__ */ y(L, {
			style: [U("label.md"), { color: i.text["high-emphasis"] }],
			children: t
		}), e && /* @__PURE__ */ y(L, {
			style: [U("label.sm"), { color: i.caution.base }],
			children: "*"
		})]
	});
}
//#endregion
//#region src/native/components/Input.tsx
var St = N.OS === "web" ? { outlineStyle: "none" } : null, Ct = l.forwardRef(function({ invalid: e, disabled: t, leading: n, trailing: r, ...i }, a) {
	let { theme: o, scales: s } = H(), [c, l] = _(!1), u = e ? o.border.caution : c ? o.border["accent-primary"] : o.border["medium-emphasis"];
	return /* @__PURE__ */ b(z, {
		style: {
			flexDirection: "row",
			alignItems: "center",
			gap: s.spacing.scale[2],
			minHeight: s.touchTargets.textInput.min,
			paddingHorizontal: s.spacing.scale[3],
			borderRadius: s.borderRadius.md,
			borderWidth: 1,
			borderColor: u,
			backgroundColor: t ? o.surface.disable : o.surface.primary,
			opacity: t ? .6 : 1
		},
		children: [
			n,
			/* @__PURE__ */ y(R, {
				ref: a,
				editable: !t,
				onFocus: (e) => {
					l(!0), i.onFocus?.(e);
				},
				onBlur: (e) => {
					l(!1), i.onBlur?.(e);
				},
				placeholderTextColor: o.text["low-emphasis"],
				style: [
					U("body.md"),
					{
						flex: 1,
						color: o.text["high-emphasis"],
						paddingVertical: 0
					},
					St
				],
				...i
			}),
			r
		]
	});
}), wt = N.OS === "web" ? { outlineStyle: "none" } : null, Tt = l.forwardRef(function({ invalid: e, disabled: t, minHeight: n = 96, ...r }, i) {
	let { theme: a, scales: o } = H(), [s, c] = _(!1), l = e ? a.border.caution : s ? a.border["accent-primary"] : a.border["medium-emphasis"];
	return /* @__PURE__ */ y(R, {
		ref: i,
		editable: !t,
		multiline: !0,
		textAlignVertical: "top",
		onFocus: (e) => {
			c(!0), r.onFocus?.(e);
		},
		onBlur: (e) => {
			c(!1), r.onBlur?.(e);
		},
		placeholderTextColor: a.text["low-emphasis"],
		style: [
			U("body.md"),
			{
				minHeight: n,
				padding: o.spacing.scale[3],
				borderRadius: o.borderRadius.md,
				borderWidth: 1,
				borderColor: l,
				backgroundColor: t ? a.surface.disable : a.surface.primary,
				color: a.text["high-emphasis"],
				opacity: t ? .6 : 1
			},
			wt
		],
		...r
	});
}), Et = N.OS === "web" ? { outlineStyle: "none" } : null, Dt = l.forwardRef(function({ invalid: e, disabled: t, minHeight: n = 44, maxHeight: r = 200, density: i = "default", ...a }, o) {
	let { theme: s, scales: c } = H(), [l, u] = _(!1), [d, f] = _(n), p = e ? s.border.caution : l ? s.border["accent-primary"] : s.border["medium-emphasis"];
	return /* @__PURE__ */ y(R, {
		ref: o,
		editable: !t,
		multiline: !0,
		textAlignVertical: "top",
		onContentSizeChange: (e) => {
			let t = i === "compact" ? 0 : 16, a = Math.min(r, Math.max(n, e.nativeEvent.contentSize.height + t));
			f(a);
		},
		onFocus: (e) => {
			u(!0), a.onFocus?.(e);
		},
		onBlur: (e) => {
			u(!1), a.onBlur?.(e);
		},
		placeholderTextColor: s.text["low-emphasis"],
		style: [
			U("body.md"),
			{
				height: d,
				padding: i === "compact" ? c.spacing.scale[2] : c.spacing.scale[3],
				borderRadius: c.borderRadius.md,
				borderWidth: 1,
				borderColor: p,
				backgroundColor: t ? s.surface.disable : s.surface.primary,
				color: s.text["high-emphasis"],
				opacity: t ? .6 : 1
			},
			Et
		],
		...a
	});
});
//#endregion
//#region src/native/use-commit-draft.ts
function Ot(e, t) {
	return !e && !t;
}
function kt(e, t) {
	let [n, r] = c.useState(e), i = c.useRef(!1), a = c.useRef(null);
	return c.useEffect(() => {
		i.current || r(e);
	}, [e]), {
		draft: n,
		handleChange: c.useCallback((e, n) => {
			if (r(e), Ot(i.current, n)) {
				if (a.current === e) {
					a.current = null;
					return;
				}
				a.current = null, t(e);
			}
		}, [t]),
		handleCompositionStart: c.useCallback(() => {
			i.current = !0;
		}, []),
		handleCompositionEnd: c.useCallback((e) => {
			i.current = !1, r(e), a.current = e, t(e);
		}, [t])
	};
}
//#endregion
//#region src/native/use-web-composition-guard.ts
function At(e, t, n) {
	c.useEffect(() => {
		if (N.OS !== "web") return;
		let r = e.current;
		if (!r || typeof r.addEventListener != "function") return;
		let i = () => t(), a = (e) => {
			n(e.target?.value ?? r.value);
		};
		return r.addEventListener("compositionstart", i), r.addEventListener("compositionend", a), () => {
			r.removeEventListener("compositionstart", i), r.removeEventListener("compositionend", a);
		};
	}, [
		e,
		t,
		n
	]);
}
//#endregion
//#region src/native/components/CommitInput.tsx
function jt({ value: e, onCommit: t, ...n }) {
	let { draft: r, handleChange: i, handleCompositionStart: a, handleCompositionEnd: o } = kt(e, t), s = c.useRef(null);
	return At(s, a, o), /* @__PURE__ */ y(Ct, {
		...n,
		ref: s,
		value: r,
		onChangeText: (e) => i(e)
	});
}
//#endregion
//#region src/native/components/CommitTextarea.tsx
function Mt({ value: e, onCommit: t, ...n }) {
	let { draft: r, handleChange: i, handleCompositionStart: a, handleCompositionEnd: o } = kt(e, t), s = c.useRef(null);
	return At(s, a, o), /* @__PURE__ */ y(Tt, {
		...n,
		ref: s,
		value: r,
		onChangeText: (e) => i(e)
	});
}
//#endregion
//#region src/native/components/CommitAutoGrowTextarea.tsx
function Nt({ value: e, onCommit: t, ...n }) {
	let { draft: r, handleChange: i, handleCompositionStart: a, handleCompositionEnd: o } = kt(e, t), s = c.useRef(null);
	return At(s, a, o), /* @__PURE__ */ y(Dt, {
		...n,
		ref: s,
		value: r,
		onChangeText: (e) => i(e)
	});
}
//#endregion
//#region src/native/components/Switch.tsx
function Pt({ value: e = !1, onValueChange: t, disabled: n = !1, accessibilityLabel: r, accessibilityHint: i }) {
	let { theme: a } = H();
	return /* @__PURE__ */ y(P, {
		onPress: () => !n && t?.(!e),
		disabled: n,
		accessibilityRole: "switch",
		accessibilityState: {
			checked: e,
			disabled: n
		},
		accessibilityLabel: r,
		accessibilityHint: i,
		hitSlop: {
			top: 7,
			bottom: 7,
			left: 0,
			right: 0
		},
		style: {
			width: 50,
			height: 30,
			borderRadius: 30 / 2,
			padding: 2,
			backgroundColor: e ? a.brand.primary : a.surface.tertiary,
			opacity: n ? .5 : 1,
			justifyContent: "center"
		},
		children: /* @__PURE__ */ y(z, { style: {
			width: 26,
			height: 26,
			borderRadius: 26 / 2,
			backgroundColor: a.surface.primary,
			alignSelf: e ? "flex-end" : "flex-start",
			shadowColor: a.overlay.dark,
			shadowOffset: {
				width: 0,
				height: 1
			},
			shadowOpacity: .2,
			shadowRadius: 1.5,
			elevation: 2
		} })
	});
}
//#endregion
//#region src/native/components/Checkbox.tsx
function Ft({ checked: e = !1, onChange: t, disabled: n = !1, size: r = 20 }) {
	let { theme: i, scales: a } = H();
	return /* @__PURE__ */ y(P, {
		onPress: () => !n && t?.(!e),
		disabled: n,
		hitSlop: 8,
		accessibilityRole: "checkbox",
		accessibilityState: {
			checked: e,
			disabled: n
		},
		style: {
			width: r,
			height: r,
			borderRadius: a.borderRadius.sm,
			borderWidth: 2,
			borderColor: e ? i.brand.primary : i.border["medium-emphasis"],
			backgroundColor: e ? i.brand.primary : "transparent",
			alignItems: "center",
			justifyContent: "center",
			opacity: n ? .4 : 1
		},
		children: e && /* @__PURE__ */ y(z, { style: {
			width: r * .5,
			height: r * .25,
			borderLeftWidth: 2,
			borderBottomWidth: 2,
			borderColor: i.text["on-inverse"],
			transform: [{ rotate: "-45deg" }, { translateY: -1 }]
		} })
	});
}
//#endregion
//#region src/native/components/CheckboxField.tsx
function It({ checked: e = !1, onChange: t, disabled: n = !1, label: r, description: i, accessibilityLabel: a, accessibilityHint: o }) {
	let { theme: s, scales: c } = H();
	return /* @__PURE__ */ b(P, {
		onPress: () => !n && t?.(!e),
		disabled: n,
		accessible: !0,
		accessibilityRole: "checkbox",
		accessibilityState: {
			checked: e,
			disabled: n
		},
		accessibilityLabel: a ?? r,
		accessibilityHint: o ?? i,
		style: {
			flexDirection: "row",
			gap: c.spacing.scale[2],
			alignItems: "flex-start",
			minHeight: c.touchTargets.buttonCTA.min,
			opacity: n ? .6 : 1
		},
		children: [/* @__PURE__ */ y(z, {
			pointerEvents: "none",
			accessibilityElementsHidden: !0,
			importantForAccessibility: "no-hide-descendants",
			style: { paddingTop: 2 },
			children: /* @__PURE__ */ y(Ft, {
				checked: e,
				disabled: n
			})
		}), /* @__PURE__ */ b(z, {
			style: {
				flex: 1,
				gap: 2
			},
			children: [/* @__PURE__ */ y(L, {
				style: [U("body.md"), { color: s.text["high-emphasis"] }],
				children: r
			}), i && /* @__PURE__ */ y(L, {
				style: [U("body.sm"), { color: s.text["medium-emphasis"] }],
				children: i
			})]
		})]
	});
}
//#endregion
//#region src/native/components/CheckboxCard.tsx
function Lt({ checked: e = !1, onChange: t, disabled: n = !1, title: r, description: i }) {
	let { theme: a, scales: o } = H();
	return /* @__PURE__ */ b(P, {
		onPress: () => !n && t?.(!e),
		disabled: n,
		style: {
			flexDirection: "row",
			gap: o.spacing.scale[3],
			alignItems: "flex-start",
			padding: o.spacing.scale[4],
			borderRadius: o.borderRadius.lg,
			borderWidth: 1,
			borderColor: e ? a.border["accent-primary"] : a.border["low-emphasis"],
			backgroundColor: e ? a.surface["accent-primary-light"] : a.surface.primary,
			opacity: n ? .6 : 1
		},
		children: [/* @__PURE__ */ y(z, {
			style: { paddingTop: 2 },
			children: /* @__PURE__ */ y(Ft, {
				checked: e,
				disabled: n,
				onChange: t
			})
		}), /* @__PURE__ */ b(z, {
			style: {
				flex: 1,
				gap: 2
			},
			children: [/* @__PURE__ */ y(L, {
				style: [U("label.md"), { color: a.text["high-emphasis"] }],
				children: r
			}), i && /* @__PURE__ */ y(L, {
				style: [U("body.sm"), { color: a.text["medium-emphasis"] }],
				children: i
			})]
		})]
	});
}
//#endregion
//#region src/native/components/CheckboxGroup.tsx
function Rt({ options: e, values: t = [], onChange: n, disabled: r = !1 }) {
	let { scales: i } = H(), a = (e) => {
		t.includes(e) ? n?.(t.filter((t) => t !== e)) : n?.([...t, e]);
	};
	return /* @__PURE__ */ y(z, {
		style: { gap: i.spacing.scale[3] },
		children: e.map((e) => /* @__PURE__ */ y(It, {
			label: e.label,
			description: e.description,
			checked: t.includes(e.value),
			disabled: r,
			onChange: () => a(e.value)
		}, e.value))
	});
}
//#endregion
//#region src/native/components/RadioGroup.tsx
function zt({ options: e, value: t, onChange: n, disabled: r = !1 }) {
	let { theme: i, scales: a } = H();
	return /* @__PURE__ */ y(z, {
		style: { gap: a.spacing.scale[3] },
		children: e.map((e) => {
			let o = t === e.value, s = r || e.disabled;
			return /* @__PURE__ */ b(P, {
				onPress: () => !s && n?.(e.value),
				disabled: s,
				style: {
					flexDirection: "row",
					gap: a.spacing.scale[2],
					alignItems: "flex-start",
					opacity: s ? .5 : 1
				},
				accessibilityRole: "radio",
				accessibilityState: { selected: o },
				children: [/* @__PURE__ */ y(z, {
					style: {
						width: 20,
						height: 20,
						borderRadius: 10,
						borderWidth: 2,
						borderColor: o ? i.brand.primary : i.border["medium-emphasis"],
						alignItems: "center",
						justifyContent: "center",
						marginTop: 2
					},
					children: o && /* @__PURE__ */ y(z, { style: {
						width: 10,
						height: 10,
						borderRadius: 5,
						backgroundColor: i.brand.primary
					} })
				}), /* @__PURE__ */ b(z, {
					style: {
						flex: 1,
						gap: 2
					},
					children: [/* @__PURE__ */ y(L, {
						style: [U("body.md"), { color: i.text["high-emphasis"] }],
						children: e.label
					}), e.description && /* @__PURE__ */ y(L, {
						style: [U("body.sm"), { color: i.text["medium-emphasis"] }],
						children: e.description
					})]
				})]
			}, e.value);
		})
	});
}
//#endregion
//#region src/native/components/Slider.tsx
function Bt({ value: e, onChange: t, min: n = 0, max: r = 100, step: i = 1, disabled: a = !1 }) {
	let { theme: o, scales: s } = H(), [c, l] = _(0), u = (e) => Math.max(n, Math.min(r, e)), d = (e) => i ? Math.round(e / i) * i : e, f = (e) => {
		if (!c) return;
		let i = Math.max(0, Math.min(1, e / c)), a = u(d(n + (r - n) * i));
		t?.(a);
	}, p = (u(e) - n) / (r - n);
	return /* @__PURE__ */ b(z, {
		onLayout: (e) => {
			l(e.nativeEvent.layout.width);
		},
		onStartShouldSetResponder: () => !a,
		onMoveShouldSetResponder: () => !a,
		onResponderGrant: (e) => f(e.nativeEvent.locationX),
		onResponderMove: (e) => f(e.nativeEvent.locationX),
		style: {
			height: 32,
			justifyContent: "center",
			opacity: a ? .5 : 1
		},
		children: [
			/* @__PURE__ */ y(z, { style: {
				height: 6,
				borderRadius: s.borderRadius.full,
				backgroundColor: o.surface.tertiary
			} }),
			/* @__PURE__ */ y(z, { style: {
				position: "absolute",
				left: 0,
				height: 6,
				width: c * p,
				borderRadius: s.borderRadius.full,
				backgroundColor: o.brand.primary
			} }),
			/* @__PURE__ */ y(z, { style: {
				position: "absolute",
				left: c * p - 10,
				width: 20,
				height: 20,
				borderRadius: 10,
				backgroundColor: o.brand.primary,
				borderWidth: 2,
				borderColor: o.surface.primary
			} })
		]
	});
}
//#endregion
//#region src/native/components/NumberInput.tsx
function Vt({ value: e, onChange: t, min: n = 0, max: r = 99, step: i = 1, disabled: a = !1 }) {
	let { theme: o, scales: s } = H(), c = (e) => Math.max(n, Math.min(r, e));
	return /* @__PURE__ */ b(z, {
		style: {
			flexDirection: "row",
			alignItems: "center",
			borderWidth: 1,
			borderColor: o.border["medium-emphasis"],
			borderRadius: s.borderRadius.md,
			backgroundColor: o.surface.primary,
			overflow: "hidden",
			alignSelf: "flex-start",
			opacity: a ? .5 : 1
		},
		children: [
			/* @__PURE__ */ y(P, {
				onPress: () => !a && t?.(c(e - i)),
				disabled: a || e <= n,
				style: ({ pressed: e }) => ({
					width: 40,
					height: 44,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: e ? o.active["tertiary-button"] : "transparent"
				}),
				children: /* @__PURE__ */ y(L, {
					style: [U("heading.md"), { color: o.text["high-emphasis"] }],
					children: "−"
				})
			}),
			/* @__PURE__ */ y(R, {
				value: String(e),
				onChangeText: (e) => {
					let n = Number(e.replace(/[^0-9-]/g, ""));
					Number.isNaN(n) || t?.(c(n));
				},
				keyboardType: "number-pad",
				editable: !a,
				style: [U("body.md"), {
					width: 56,
					textAlign: "center",
					color: o.text["high-emphasis"],
					paddingVertical: 0,
					borderLeftWidth: 1,
					borderRightWidth: 1,
					borderColor: o.border["low-emphasis"]
				}]
			}),
			/* @__PURE__ */ y(P, {
				onPress: () => !a && t?.(c(e + i)),
				disabled: a || e >= r,
				style: ({ pressed: e }) => ({
					width: 40,
					height: 44,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: e ? o.active["tertiary-button"] : "transparent"
				}),
				children: /* @__PURE__ */ y(L, {
					style: [U("heading.md"), { color: o.text["high-emphasis"] }],
					children: "＋"
				})
			})
		]
	});
}
//#endregion
//#region src/native/components/FormField.tsx
function Ht({ label: e, required: t, description: n, error: r, children: i }) {
	let { theme: a, scales: o } = H();
	return /* @__PURE__ */ b(z, {
		style: { gap: o.spacing.scale[2] },
		children: [
			e && /* @__PURE__ */ y(xt, {
				required: t,
				children: e
			}),
			n && !r && /* @__PURE__ */ y(L, {
				style: [U("body.sm"), { color: a.text["medium-emphasis"] }],
				children: n
			}),
			i,
			r && /* @__PURE__ */ y(L, {
				style: [U("body.sm"), { color: a.text.caution }],
				children: r
			})
		]
	});
}
//#endregion
//#region src/native/components/Form.tsx
function Ut({ style: e, children: t, ...n }) {
	let { scales: r } = H();
	return /* @__PURE__ */ y(z, {
		style: [{ gap: r.spacing.scale[6] }, e],
		...n,
		children: t
	});
}
function Wt({ title: e, description: t, style: n, children: r, ...i }) {
	let { theme: a, scales: o } = H();
	return /* @__PURE__ */ b(z, {
		style: [{ gap: o.spacing.scale[4] }, n],
		...i,
		children: [(e || t) && /* @__PURE__ */ b(z, {
			style: { gap: o.spacing.scale[1] },
			children: [e && /* @__PURE__ */ y(W, {
				variant: "heading.md",
				children: e
			}), t && /* @__PURE__ */ y(W, {
				variant: "body.sm",
				color: a.text["medium-emphasis"],
				children: t
			})]
		}), r]
	});
}
function Gt({ style: e, children: t, ...n }) {
	let { scales: r } = H();
	return /* @__PURE__ */ y(Te, {
		direction: "row",
		gap: 3,
		justify: "flex-end",
		wrap: !0,
		style: [{ paddingTop: r.spacing.scale[4] }, e],
		...n,
		children: t
	});
}
//#endregion
//#region src/native/components/Alert.tsx
function Kt({ tone: e = "info", title: t, description: n, children: r }) {
	let { theme: i, scales: a } = H(), o = {
		info: {
			bg: i.surface.info,
			fg: i.text.info,
			border: i.border.info
		},
		success: {
			bg: i.surface.success,
			fg: i.text.success,
			border: i.border.success
		},
		warning: {
			bg: i.surface.warning,
			fg: i.text.warning,
			border: i.border.warning
		},
		caution: {
			bg: i.surface.caution,
			fg: i.text.caution,
			border: i.border.caution
		}
	}[e];
	return /* @__PURE__ */ b(z, {
		style: {
			backgroundColor: o.bg,
			borderColor: o.border,
			borderLeftWidth: 4,
			borderRadius: a.borderRadius.md,
			padding: a.spacing.scale[3],
			gap: a.spacing.scale[1]
		},
		children: [
			t && /* @__PURE__ */ y(L, {
				style: [U("label.md"), { color: o.fg }],
				children: t
			}),
			n && /* @__PURE__ */ y(L, {
				style: [U("body.sm"), { color: i.text["high-emphasis"] }],
				children: n
			}),
			r
		]
	});
}
//#endregion
//#region src/native/components/Dialog.tsx
function qt({ open: e, onClose: t, title: n, description: r, footer: i, children: a, dismissOnBackdrop: o = !0 }) {
	let { theme: s, scales: c } = H();
	return /* @__PURE__ */ y(j, {
		visible: e,
		transparent: !0,
		animationType: "fade",
		onRequestClose: t,
		children: /* @__PURE__ */ y(P, {
			onPress: () => o && t(),
			style: {
				flex: 1,
				backgroundColor: s.overlay.dark,
				alignItems: "center",
				justifyContent: "center",
				padding: c.spacing.scale[4]
			},
			children: /* @__PURE__ */ b(P, {
				onPress: () => {},
				style: {
					width: "100%",
					maxWidth: 480,
					backgroundColor: s.surface.primary,
					borderRadius: c.borderRadius["2xl"],
					padding: c.spacing.scale[5],
					gap: c.spacing.scale[3]
				},
				children: [
					n && /* @__PURE__ */ y(L, {
						style: [U("heading.lg"), { color: s.text["high-emphasis"] }],
						children: n
					}),
					r && /* @__PURE__ */ y(L, {
						style: [U("body.md"), { color: s.text["medium-emphasis"] }],
						children: r
					}),
					a,
					i && /* @__PURE__ */ y(z, {
						style: {
							flexDirection: "row",
							justifyContent: "flex-end",
							gap: c.spacing.scale[2]
						},
						children: i
					})
				]
			})
		})
	});
}
//#endregion
//#region src/native/components/AlertDialog.tsx
function Jt({ open: e, onClose: t, title: n, description: r, confirmLabel: i = "OK", cancelLabel: a = "キャンセル", onConfirm: o, destructive: s = !1 }) {
	return /* @__PURE__ */ y(qt, {
		open: e,
		onClose: t,
		title: n,
		description: r,
		dismissOnBackdrop: !1,
		footer: /* @__PURE__ */ b(v, { children: [/* @__PURE__ */ y(z, {
			style: { minWidth: 100 },
			children: /* @__PURE__ */ y(q, {
				variant: "tertiary",
				onPress: t,
				children: a
			})
		}), /* @__PURE__ */ y(z, {
			style: { minWidth: 100 },
			children: /* @__PURE__ */ y(q, {
				variant: s ? "destructive" : "primary",
				onPress: () => {
					o?.(), t();
				},
				children: i
			})
		})] })
	});
}
//#endregion
//#region src/native/components/Sheet.tsx
function Z(e) {
	let { side: t = "bottom", snapPoints: n } = e;
	return n && n.length > 0 && t === "bottom" ? /* @__PURE__ */ y(Qt, { ...e }) : /* @__PURE__ */ y(Yt, { ...e });
}
function Yt({ open: e, onClose: t, side: n = "bottom", title: r, children: i }) {
	let { theme: a, scales: o } = H(), [s] = _(() => new C.Value(0));
	p(() => {
		C.timing(s, {
			toValue: +!!e,
			duration: 220,
			useNativeDriver: !0
		}).start();
	}, [e, s]);
	let { width: c, height: l } = w.get("window"), u = {
		bottom: { translateY: s.interpolate({
			inputRange: [0, 1],
			outputRange: [l, 0]
		}) },
		top: { translateY: s.interpolate({
			inputRange: [0, 1],
			outputRange: [-l, 0]
		}) },
		left: { translateX: s.interpolate({
			inputRange: [0, 1],
			outputRange: [-c, 0]
		}) },
		right: { translateX: s.interpolate({
			inputRange: [0, 1],
			outputRange: [c, 0]
		}) }
	};
	return /* @__PURE__ */ y(j, {
		visible: e,
		transparent: !0,
		animationType: "none",
		onRequestClose: t,
		children: /* @__PURE__ */ y(P, {
			onPress: t,
			style: {
				flex: 1,
				backgroundColor: a.overlay.dark,
				...{
					bottom: { justifyContent: "flex-end" },
					top: { justifyContent: "flex-start" },
					left: { alignItems: "flex-start" },
					right: { alignItems: "flex-end" }
				}[n]
			},
			children: /* @__PURE__ */ y(C.View, {
				style: {
					transform: [u[n].translateX ? { translateX: u[n].translateX } : { translateX: 0 }, u[n].translateY ? { translateY: u[n].translateY } : { translateY: 0 }],
					backgroundColor: a.surface.primary,
					...n === "bottom" || n === "top" ? {
						width: "100%",
						borderTopLeftRadius: o.borderRadius["2xl"],
						borderTopRightRadius: o.borderRadius["2xl"]
					} : {
						height: "100%",
						width: "85%"
					},
					padding: o.spacing.scale[4],
					gap: o.spacing.scale[3]
				},
				children: /* @__PURE__ */ b(P, {
					onPress: () => {},
					children: [
						n === "bottom" && /* @__PURE__ */ y(z, { style: {
							width: 40,
							height: 4,
							borderRadius: 2,
							backgroundColor: a.border["medium-emphasis"],
							alignSelf: "center",
							marginBottom: o.spacing.scale[2]
						} }),
						r && /* @__PURE__ */ y(L, {
							style: [U("heading.md"), { color: a.text["high-emphasis"] }],
							children: r
						}),
						/* @__PURE__ */ y(z, {
							style: { marginTop: o.spacing.scale[2] },
							children: i
						})
					]
				})
			})
		})
	});
}
var Xt = 180;
function Zt(e, t, n) {
	return Math.max(t, Math.min(n, e));
}
function Qt({ open: e, onClose: t, title: n, children: r, snapPoints: i, initialSnap: a, footer: o, dismissible: s = !0 }) {
	let { theme: c, scales: l } = H(), u = h(() => {
		let e = [...i ?? [.55, .92]].map((e) => Zt(e, .1, .99)).sort((e, t) => e - t);
		return e.length > 0 ? e : [.55, .92];
	}, [i]), d = u[0], f = u[u.length - 1], m = w.get("window").height, v = typeof globalThis < "u" && globalThis.window?.innerHeight, x = m > 0 ? m : v && v > 0 ? v : 700, S = Math.round(x * f), E = .18, [D, O] = _(0), k = Zt(a ?? d, d, f), A = g(k), N = g(new C.Value(S)).current, I = (e, t = Xt) => {
		A.current = e, C.timing(N, {
			toValue: (f - e) * x,
			duration: t,
			easing: T.out(T.cubic),
			useNativeDriver: !0
		}).start();
	};
	p(() => {
		e ? (N.setValue(S), I(k, Xt)) : C.timing(N, {
			toValue: S,
			duration: Xt,
			easing: T.out(T.cubic),
			useNativeDriver: !0
		}).start();
	}, [e]);
	let R = g(0), B = g(k), V = g(0), ee = g(M.create({
		onStartShouldSetPanResponder: () => !1,
		onMoveShouldSetPanResponder: (e, t) => {
			if (Math.abs(t.dy) < 6) return !1;
			let n = t.dy, r = A.current === f, i = V.current <= 0;
			return r ? !!(n > 0 && i) : !0;
		},
		onPanResponderGrant: () => {
			R.current = N._value, B.current = A.current;
		},
		onPanResponderMove: (e, t) => {
			let n = R.current + t.dy;
			n < 0 && (n = Math.max(-4, n / 4));
			let r = s ? S : (f - d) * x;
			if (n > r) {
				let e = n - r;
				n = r + Math.min(4, e / 4);
			}
			N.setValue(n);
		},
		onPanResponderRelease: (e, n) => {
			let r = Zt(R.current + n.dy, 0, S), i = n.dy, a = B.current;
			if (a === f && i < 0) {
				I(f);
				return;
			}
			if (i < -20) {
				let e = u.indexOf(a), t = e >= 0 && e < u.length - 1 ? u[e + 1] : f;
				I(t);
				return;
			}
			if (i > 0) {
				if (s && a === d && i > S * E) {
					C.timing(N, {
						toValue: S,
						duration: Xt,
						easing: T.out(T.cubic),
						useNativeDriver: !0
					}).start(() => t());
					return;
				}
				if (a === f) {
					let e = (f - d) * x;
					if (s && i > e + S * E) {
						C.timing(N, {
							toValue: S,
							duration: Xt,
							easing: T.out(T.cubic),
							useNativeDriver: !0
						}).start(() => t());
						return;
					}
					if (i > 40) {
						I(d);
						return;
					}
				}
			}
			let o = f - r / x, c = u[0], l = Math.abs(u[0] - o);
			for (let e = 1; e < u.length; e++) {
				let t = Math.abs(u[e] - o);
				t < l && (l = t, c = u[e]);
			}
			I(c);
		}
	})).current, W = N.interpolate({
		inputRange: [0, S],
		outputRange: [.4, 0],
		extrapolate: "clamp"
	});
	return /* @__PURE__ */ b(j, {
		visible: e,
		transparent: !0,
		animationType: "none",
		onRequestClose: t,
		children: [
			/* @__PURE__ */ y(C.View, {
				pointerEvents: e ? "auto" : "none",
				style: {
					position: "absolute",
					left: 0,
					right: 0,
					top: 0,
					bottom: 0,
					backgroundColor: c.overlay.dark,
					opacity: W
				},
				children: /* @__PURE__ */ y(P, {
					onPress: s ? t : () => {},
					style: { flex: 1 }
				})
			}),
			/* @__PURE__ */ b(C.View, {
				...ee.panHandlers,
				style: {
					position: "absolute",
					left: 0,
					right: 0,
					bottom: 0,
					height: S,
					backgroundColor: c.surface.primary,
					borderTopLeftRadius: l.borderRadius["2xl"],
					borderTopRightRadius: l.borderRadius["2xl"],
					transform: [{ translateY: N }]
				},
				children: [/* @__PURE__ */ b(z, {
					style: {
						paddingHorizontal: l.spacing.scale[4],
						paddingTop: l.spacing.scale[3]
					},
					children: [/* @__PURE__ */ y(z, { style: {
						width: 40,
						height: 4,
						borderRadius: 2,
						backgroundColor: c.border["medium-emphasis"],
						alignSelf: "center",
						marginBottom: l.spacing.scale[2]
					} }), n && /* @__PURE__ */ y(L, {
						style: [U("heading.md"), {
							color: c.text["high-emphasis"],
							marginBottom: l.spacing.scale[2]
						}],
						children: n
					})]
				}), /* @__PURE__ */ y(F, {
					style: { flex: 1 },
					contentContainerStyle: {
						paddingHorizontal: l.spacing.scale[4],
						paddingBottom: o ? D + 60 : l.spacing.scale[4]
					},
					onScroll: (e) => {
						V.current = e.nativeEvent.contentOffset.y;
					},
					scrollEventThrottle: 16,
					keyboardShouldPersistTaps: "handled",
					children: r
				})]
			}),
			o && /* @__PURE__ */ y(z, {
				pointerEvents: "box-none",
				onLayout: (e) => O(e.nativeEvent.layout.height),
				style: {
					position: "absolute",
					left: 0,
					right: 0,
					bottom: 0,
					paddingHorizontal: l.spacing.scale[4],
					paddingTop: l.spacing.scale[3],
					paddingBottom: l.spacing.scale[4],
					borderTopWidth: 1,
					borderTopColor: c.border["low-emphasis"],
					backgroundColor: c.surface.primary
				},
				children: o
			})
		]
	});
}
//#endregion
//#region src/native/components/DetailSheetScaffold.tsx
function $t({ header: e, footer: t, children: n, style: r }) {
	let { theme: i } = H();
	return /* @__PURE__ */ b(z, {
		style: [{
			backgroundColor: i.surface.primary,
			flex: 1
		}, r],
		children: [
			e,
			/* @__PURE__ */ y(tn, { children: n }),
			t
		]
	});
}
function en({ title: e, titleEditor: t, description: n, leading: r, trailing: i, children: a, style: o }) {
	let { theme: s, scales: c } = H(), l = t ?? e;
	return /* @__PURE__ */ b(z, {
		style: [{
			flexDirection: "row",
			alignItems: "flex-start",
			gap: c.spacing.scale[3],
			paddingHorizontal: c.spacing.scale[5],
			paddingTop: c.spacing.scale[5],
			paddingBottom: c.spacing.scale[4],
			borderBottomWidth: 1,
			borderBottomColor: s.border["low-emphasis"]
		}, o],
		children: [
			/* @__PURE__ */ y(z, {
				style: {
					minHeight: 40,
					justifyContent: "center"
				},
				children: r
			}),
			/* @__PURE__ */ b(z, {
				style: {
					flex: 1,
					minWidth: 0
				},
				children: [
					typeof l == "string" ? /* @__PURE__ */ y(L, {
						style: [U("heading.lg"), { color: s.text["high-emphasis"] }],
						children: l
					}) : l,
					typeof n == "string" ? /* @__PURE__ */ y(L, {
						style: [U("body.sm"), {
							color: s.text["medium-emphasis"],
							marginTop: c.spacing.scale[1]
						}],
						children: n
					}) : n,
					a
				]
			}),
			/* @__PURE__ */ y(z, {
				style: {
					minHeight: 40,
					justifyContent: "center",
					alignItems: "flex-end"
				},
				children: i
			})
		]
	});
}
function tn({ children: e, style: t }) {
	let { scales: n } = H();
	return /* @__PURE__ */ y(z, {
		style: [{
			flex: 1,
			paddingHorizontal: n.spacing.scale[5],
			paddingVertical: n.spacing.scale[4]
		}, t],
		children: e
	});
}
//#endregion
//#region src/native/components/KeyboardAwareSheetFooter.tsx
function nn({ behavior: e = "fixed", hideWhenInputFocused: t = e === "hide", children: n, style: r }) {
	let { theme: i, scales: a } = H(), [o, s] = _(!1);
	return p(() => {
		let e = k.addListener("keyboardDidShow", () => s(!0)), t = k.addListener("keyboardDidHide", () => s(!1));
		return () => {
			e.remove(), t.remove();
		};
	}, []), t && o ? null : /* @__PURE__ */ y(z, {
		style: [{
			flexDirection: "row",
			gap: a.spacing.scale[3],
			paddingHorizontal: a.spacing.scale[5],
			paddingTop: a.spacing.scale[3],
			paddingBottom: N.OS === "ios" ? 28 : a.spacing.scale[4],
			backgroundColor: i.surface.primary,
			borderTopWidth: e === "scroll" ? 0 : 1,
			borderTopColor: i.border["low-emphasis"]
		}, r],
		children: n
	});
}
//#endregion
//#region src/native/components/ResponsiveDialog.tsx
function rn({ breakpoint: e = 600, ...t }) {
	let { width: n } = w.get("window");
	return n <= e ? /* @__PURE__ */ b(Z, {
		open: t.open,
		onClose: t.onClose,
		side: "bottom",
		title: t.title,
		children: [t.children, t.footer]
	}) : /* @__PURE__ */ y(qt, { ...t });
}
//#endregion
//#region src/native/components/Popover.tsx
function an({ open: e, onClose: t, anchor: n, children: r }) {
	let { theme: i, scales: a } = H(), o = n ? n.y + (n.height ?? 0) + 4 : 100, s = n ? n.x : 0;
	return /* @__PURE__ */ y(j, {
		visible: e,
		transparent: !0,
		animationType: "fade",
		onRequestClose: t,
		children: /* @__PURE__ */ y(P, {
			onPress: t,
			style: { flex: 1 },
			children: /* @__PURE__ */ y(z, {
				style: {
					position: "absolute",
					top: o,
					left: Math.max(8, s),
					minWidth: 160,
					backgroundColor: i.surface.primary,
					borderRadius: a.borderRadius.lg,
					borderWidth: 1,
					borderColor: i.border["low-emphasis"],
					padding: a.spacing.scale[2],
					shadowColor: i.overlay.dark,
					shadowOffset: {
						width: 0,
						height: 4
					},
					shadowOpacity: .2,
					shadowRadius: 12,
					elevation: 6
				},
				children: /* @__PURE__ */ y(P, {
					onPress: () => {},
					children: r
				})
			})
		})
	});
}
//#endregion
//#region src/native/components/DropdownMenu.tsx
function on({ open: e, onClose: t, anchor: n, items: r }) {
	let { theme: i, scales: a } = H();
	return /* @__PURE__ */ y(an, {
		open: e,
		onClose: t,
		anchor: n,
		children: /* @__PURE__ */ y(z, {
			style: { minWidth: 180 },
			children: r.map((e, n) => /* @__PURE__ */ b(l.Fragment, { children: [/* @__PURE__ */ y(P, {
				onPress: () => {
					e.disabled || (e.onSelect?.(), t());
				},
				disabled: e.disabled,
				style: ({ pressed: t }) => ({
					paddingVertical: a.spacing.scale[2],
					paddingHorizontal: a.spacing.scale[3],
					borderRadius: a.borderRadius.sm,
					backgroundColor: t ? i.surface.secondary : "transparent",
					opacity: e.disabled ? .4 : 1
				}),
				children: /* @__PURE__ */ y(L, {
					style: [U("body.md"), { color: e.destructive ? i.text.caution : i.text["high-emphasis"] }],
					children: e.label
				})
			}), n < r.length - 1 && /* @__PURE__ */ y(J, {})] }, e.key))
		})
	});
}
//#endregion
//#region src/native/components/Toast.tsx
var sn = u(null);
function cn() {
	let e = f(sn);
	if (!e) throw Error("useToast は ToastProvider の内側で使ってください");
	return e;
}
var ln = 0;
function un() {
	return ln += 1, `toast-${ln}`;
}
var dn = null;
function fn(e) {
	dn = e;
}
function Q(e, t = {}, n) {
	return dn ? dn.show({
		title: e,
		description: t.description,
		tone: n ?? t.tone,
		duration: t.duration,
		action: t.action
	}) : (console.warn("[ksk-ds native toast()] ToastProvider がマウントされていないため通知は表示されません。アプリのルートに <ToastProvider> を配置してください。"), "");
}
var $ = ((e, t) => Q(e, t));
$.success = (e, t) => Q(e, t, "success"), $.error = (e, t) => Q(e, t, "caution"), $.info = (e, t) => Q(e, t, "info"), $.warning = (e, t) => Q(e, t, "warning"), $.caution = (e, t) => Q(e, t, "caution"), $.dismiss = (e) => dn?.dismiss(e);
function pn({ children: e }) {
	let { scales: t } = H(), [n, r] = _([]), i = d((e) => {
		r((t) => t.filter((t) => t.id !== e));
	}, []), a = d((e) => {
		let t = un();
		r((n) => [...n, {
			...e,
			id: t
		}]);
		let n = e.duration ?? 3e3;
		return n > 0 && setTimeout(() => i(t), n), t;
	}, [i]);
	return p(() => (fn({
		show: a,
		dismiss: i
	}), () => fn(null)), [a, i]), /* @__PURE__ */ b(sn.Provider, {
		value: {
			show: a,
			dismiss: i
		},
		children: [e, /* @__PURE__ */ y(z, {
			pointerEvents: "box-none",
			style: {
				position: "absolute",
				top: t.spacing.scale[10],
				left: 0,
				right: 0,
				alignItems: "center",
				gap: t.spacing.scale[2],
				zIndex: 9999
			},
			children: n.map((e) => /* @__PURE__ */ y(mn, {
				toast: e,
				onDismiss: () => i(e.id)
			}, e.id))
		})]
	});
}
function mn({ toast: e, onDismiss: t }) {
	let { theme: n, scales: r } = H(), [i] = _(() => new C.Value(0)), [a] = _(() => new C.Value(-20));
	p(() => {
		C.parallel([C.timing(i, {
			toValue: 1,
			duration: 180,
			useNativeDriver: !0
		}), C.timing(a, {
			toValue: 0,
			duration: 180,
			useNativeDriver: !0
		})]).start();
	}, [i, a]);
	let o = {
		default: {
			bg: n.surface.primary,
			fg: n.text["high-emphasis"]
		},
		info: {
			bg: n.surface.info,
			fg: n.text.info
		},
		success: {
			bg: n.surface.success,
			fg: n.text.success
		},
		warning: {
			bg: n.surface.warning,
			fg: n.text.warning
		},
		caution: {
			bg: n.surface.caution,
			fg: n.text.caution
		}
	}[e.tone ?? "default"];
	return /* @__PURE__ */ b(C.View, {
		accessibilityRole: "alert",
		style: {
			opacity: i,
			transform: [{ translateY: a }],
			backgroundColor: o.bg,
			borderRadius: r.borderRadius.lg,
			borderWidth: 1,
			borderColor: n.border["low-emphasis"],
			paddingHorizontal: r.spacing.scale[4],
			paddingVertical: r.spacing.scale[3],
			marginHorizontal: r.spacing.scale[4],
			shadowColor: n.overlay.dark,
			shadowOffset: {
				width: 0,
				height: 4
			},
			shadowOpacity: .18,
			shadowRadius: 12,
			elevation: 6,
			flexDirection: "row",
			alignItems: "center",
			gap: r.spacing.scale[3],
			maxWidth: 480
		},
		children: [
			/* @__PURE__ */ b(z, {
				style: { flex: 1 },
				children: [e.title && /* @__PURE__ */ y(L, {
					style: [U("label.md"), { color: o.fg }],
					children: e.title
				}), e.description && /* @__PURE__ */ y(L, {
					style: [U("body.sm"), { color: o.fg }],
					children: e.description
				})]
			}),
			e.action && /* @__PURE__ */ y(P, {
				onPress: e.action.onPress,
				hitSlop: 8,
				accessibilityRole: "button",
				children: /* @__PURE__ */ y(L, {
					style: [U("label.sm"), {
						color: o.fg,
						textDecorationLine: "underline"
					}],
					children: e.action.label
				})
			}),
			/* @__PURE__ */ y(P, {
				onPress: t,
				hitSlop: 8,
				accessibilityLabel: "閉じる",
				accessibilityRole: "button",
				children: /* @__PURE__ */ y(L, {
					style: [U("label.sm"), { color: o.fg }],
					children: "×"
				})
			})
		]
	});
}
//#endregion
//#region src/native/components/ErrorBoundary.tsx
var hn = {
	emoji: "😢",
	title: "問題が発生しました",
	description: "データは保持されています。下のボタンで復旧してください。",
	retryLabel: "再試行"
}, gn = class extends l.Component {
	constructor(e) {
		super(e), this.state = {
			hasError: !1,
			error: null
		};
	}
	static getDerivedStateFromError(e) {
		return {
			hasError: !0,
			error: e
		};
	}
	componentDidCatch(e, t) {
		let n = globalThis.process;
		n && n.env?.NODE_ENV !== "production" && console.error("[ksk-ds native ErrorBoundary]", e, t), this.props.onError?.(e, t);
	}
	handleRetry = () => {
		this.setState({
			hasError: !1,
			error: null
		}), this.props.onRetry?.();
	};
	render() {
		if (!this.state.hasError) return this.props.children;
		let { fallback: e, labels: t } = this.props, n = {
			...hn,
			...t
		};
		return e ? typeof e == "function" ? e(this.state.error, this.handleRetry) : e : /* @__PURE__ */ y(_n, {
			merged: n,
			handleRetry: this.handleRetry
		});
	}
};
function _n({ merged: e, handleRetry: t }) {
	let { theme: n, scales: r } = H();
	return /* @__PURE__ */ b(z, {
		accessibilityRole: "alert",
		style: {
			flex: 1,
			alignItems: "center",
			justifyContent: "center",
			padding: r.spacing.scale[8],
			gap: r.spacing.scale[2],
			backgroundColor: n.surface.primary
		},
		children: [
			/* @__PURE__ */ y(W, {
				style: {
					fontSize: 48,
					textAlign: "center"
				},
				accessibilityElementsHidden: !0,
				importantForAccessibility: "no",
				children: e.emoji
			}),
			/* @__PURE__ */ y(W, {
				variant: "heading.lg",
				style: { textAlign: "center" },
				children: e.title
			}),
			/* @__PURE__ */ y(W, {
				variant: "body.sm",
				color: n.text["medium-emphasis"],
				style: {
					textAlign: "center",
					marginBottom: r.spacing.scale[4]
				},
				children: e.description
			}),
			/* @__PURE__ */ y(q, {
				variant: "secondary",
				onPress: t,
				children: e.retryLabel
			})
		]
	});
}
//#endregion
//#region src/native/components/MenuDrawer.tsx
function vn({ open: e, onClose: t, side: n = "left", header: r, sections: i, footer: a }) {
	let { theme: o, scales: s } = H();
	return /* @__PURE__ */ b(Z, {
		open: e,
		onClose: t,
		side: n,
		children: [
			r && /* @__PURE__ */ y(z, {
				style: { marginBottom: s.spacing.scale[3] },
				children: r
			}),
			/* @__PURE__ */ y(F, {
				style: { maxHeight: 480 },
				children: i.map((e, n) => /* @__PURE__ */ b(z, {
					style: { marginBottom: s.spacing.scale[3] },
					children: [e.title && /* @__PURE__ */ y(L, {
						style: [U("label.xs"), {
							color: o.text["low-emphasis"],
							paddingHorizontal: s.spacing.scale[2],
							marginBottom: s.spacing.scale[1]
						}],
						children: e.title
					}), e.items.map((n, r) => /* @__PURE__ */ b(l.Fragment, { children: [/* @__PURE__ */ b(P, {
						onPress: () => {
							n.onPress?.(), t();
						},
						style: ({ pressed: e }) => ({
							flexDirection: "row",
							alignItems: "center",
							gap: s.spacing.scale[3],
							paddingHorizontal: s.spacing.scale[3],
							paddingVertical: s.spacing.scale[3],
							borderRadius: s.borderRadius.md,
							backgroundColor: n.active ? o.surface["accent-primary-light"] : e ? o.surface.secondary : "transparent"
						}),
						children: [n.icon, /* @__PURE__ */ y(L, {
							style: [U("body.md"), { color: n.active ? o.text["accent-primary"] : o.text["high-emphasis"] }],
							children: n.label
						})]
					}), r < e.items.length - 1 && /* @__PURE__ */ y(J, {})] }, n.key))]
				}, n))
			}),
			a && /* @__PURE__ */ y(z, {
				style: { marginTop: s.spacing.scale[3] },
				children: a
			})
		]
	});
}
//#endregion
//#region src/native/components/ConfirmDialog.tsx
function yn(e) {
	return /* @__PURE__ */ y(Jt, { ...e });
}
//#endregion
//#region src/native/components/BottomSheetForm.tsx
function bn({ open: e, onClose: t, title: n, description: r, footer: i, children: a }) {
	let { theme: o, scales: s } = H();
	return /* @__PURE__ */ b(Z, {
		open: e,
		onClose: t,
		side: "bottom",
		title: n,
		children: [
			r && /* @__PURE__ */ y(L, {
				style: [U("body.sm"), { color: o.text["medium-emphasis"] }],
				children: r
			}),
			/* @__PURE__ */ y(F, {
				style: { maxHeight: 420 },
				children: /* @__PURE__ */ y(z, {
					style: {
						gap: s.spacing.scale[3],
						paddingVertical: s.spacing.scale[2]
					},
					children: a
				})
			}),
			i && /* @__PURE__ */ y(z, {
				style: {
					flexDirection: "row",
					justifyContent: "flex-end",
					gap: s.spacing.scale[2],
					marginTop: s.spacing.scale[3]
				},
				children: i
			})
		]
	});
}
//#endregion
//#region src/native/components/BottomSheetFrame.tsx
function xn({ preset: e = "mobile-full", header: t, footer: n, scrollable: r = !0, children: i, style: a, bodyStyle: o }) {
	let { theme: s, scales: c } = H(), l = e === "mobile-form" ? 520 : e === "desktop-floating" ? 620 : 720, u = y(r ? F : z, {
		style: [{ flex: 1 }, o],
		children: i
	});
	return /* @__PURE__ */ b(z, {
		style: [{
			maxHeight: l,
			minHeight: e === "mobile-full" ? 360 : void 0,
			overflow: "hidden",
			borderRadius: e === "mobile-full" ? c.borderRadius["2xl"] : c.borderRadius.xl,
			backgroundColor: s.surface.primary
		}, a],
		children: [
			t,
			u,
			n
		]
	});
}
//#endregion
//#region src/native/components/ReviewOverlay.tsx
function Sn({ open: e, onClose: t, title: n = "レビューを投稿", onSubmit: r }) {
	let { scales: i } = H(), [a, o] = _(0), [s, c] = _("");
	return /* @__PURE__ */ b(Z, {
		open: e,
		onClose: t,
		side: "bottom",
		title: n,
		children: [
			/* @__PURE__ */ y(z, {
				style: {
					alignItems: "center",
					marginVertical: i.spacing.scale[3]
				},
				children: /* @__PURE__ */ y(Je, {
					value: a,
					onChange: o,
					size: 32
				})
			}),
			/* @__PURE__ */ y(Tt, {
				value: s,
				onChangeText: c,
				placeholder: "コメントを入力",
				minHeight: 120
			}),
			/* @__PURE__ */ b(z, {
				style: {
					flexDirection: "row",
					gap: i.spacing.scale[2],
					marginTop: i.spacing.scale[3]
				},
				children: [/* @__PURE__ */ y(z, {
					style: { flex: 1 },
					children: /* @__PURE__ */ y(q, {
						variant: "tertiary",
						onPress: t,
						children: "キャンセル"
					})
				}), /* @__PURE__ */ y(z, {
					style: { flex: 1 },
					children: /* @__PURE__ */ y(q, {
						variant: "primary",
						disabled: a === 0,
						onPress: () => {
							r?.(a, s), t();
						},
						children: "送信"
					})
				})]
			})
		]
	});
}
//#endregion
//#region src/native/components/CoachMark.tsx
function Cn({ title: e, description: t, step: n, total: r, onNext: i, onSkip: a, nextLabel: o = "次へ", skipLabel: s = "スキップ" }) {
	let { theme: c, scales: l } = H();
	return /* @__PURE__ */ b(z, {
		style: {
			backgroundColor: c.surface.inverse,
			borderRadius: l.borderRadius.xl,
			paddingVertical: l.spacing.scale[4],
			paddingHorizontal: l.spacing.scale[5],
			maxWidth: 320,
			shadowColor: c.overlay.dark,
			shadowOffset: {
				width: 0,
				height: 8
			},
			shadowOpacity: .24,
			shadowRadius: 16,
			elevation: 8
		},
		children: [
			e && /* @__PURE__ */ y(L, {
				style: [U("label.lg"), {
					color: c.text["on-inverse"],
					marginBottom: l.spacing.scale[1]
				}],
				children: e
			}),
			/* @__PURE__ */ y(L, {
				style: [U("body.md"), {
					color: c.text["on-inverse-secondary"],
					marginBottom: l.spacing.scale[4]
				}],
				children: t
			}),
			/* @__PURE__ */ b(z, {
				style: {
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					gap: l.spacing.scale[3]
				},
				children: [n !== void 0 && r !== void 0 ? /* @__PURE__ */ y(z, {
					style: {
						flexDirection: "row",
						gap: l.spacing.scale[1],
						alignItems: "center"
					},
					children: Array.from({ length: r }).map((e, t) => {
						let r = t + 1 === n;
						return /* @__PURE__ */ y(z, { style: {
							width: r ? 18 : 6,
							height: 6,
							borderRadius: 3,
							backgroundColor: r ? c.brand.primary : c.text["on-inverse-secondary"],
							opacity: r ? 1 : .4
						} }, t);
					})
				}) : /* @__PURE__ */ y(z, {}), /* @__PURE__ */ b(z, {
					style: {
						flexDirection: "row",
						gap: l.spacing.scale[1],
						alignItems: "center"
					},
					children: [a && /* @__PURE__ */ y(P, {
						onPress: a,
						hitSlop: 6,
						style: ({ pressed: e }) => ({
							paddingVertical: l.spacing.scale[2],
							paddingHorizontal: l.spacing.scale[3],
							opacity: e ? .5 : 1
						}),
						children: /* @__PURE__ */ y(L, {
							style: [U("label.md"), { color: c.text["on-inverse-secondary"] }],
							children: s
						})
					}), i && /* @__PURE__ */ y(P, {
						onPress: i,
						style: ({ pressed: e }) => ({
							paddingVertical: l.spacing.scale[2],
							paddingHorizontal: l.spacing.scale[4],
							borderRadius: l.borderRadius.full,
							backgroundColor: e ? c.active["primary-button"] : c.brand.primary
						}),
						children: /* @__PURE__ */ y(L, {
							style: [U("label.md"), { color: c.text["on-inverse"] }],
							children: o
						})
					})]
				})]
			})
		]
	});
}
//#endregion
//#region src/native/components/CoachMarkOverlay.tsx
function wn({ open: e, onClose: t, highlight: n, children: r }) {
	let { theme: i } = H(), a = i.overlay.dark;
	return /* @__PURE__ */ y(j, {
		visible: e,
		transparent: !0,
		animationType: "fade",
		onRequestClose: t,
		children: /* @__PURE__ */ b(P, {
			onPress: t,
			style: { flex: 1 },
			children: [n ? /* @__PURE__ */ b(v, { children: [
				/* @__PURE__ */ y(z, { style: {
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: n.y,
					backgroundColor: a
				} }),
				/* @__PURE__ */ y(z, { style: {
					position: "absolute",
					top: n.y,
					left: 0,
					width: n.x,
					height: n.height,
					backgroundColor: a
				} }),
				/* @__PURE__ */ y(z, { style: {
					position: "absolute",
					top: n.y,
					left: n.x + n.width,
					right: 0,
					height: n.height,
					backgroundColor: a
				} }),
				/* @__PURE__ */ y(z, { style: {
					position: "absolute",
					top: n.y + n.height,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: a
				} }),
				/* @__PURE__ */ y(z, { style: {
					position: "absolute",
					top: n.y,
					left: n.x,
					width: n.width,
					height: n.height,
					borderRadius: n.radius ?? 12,
					borderWidth: 2,
					borderColor: i.brand.primary
				} })
			] }) : /* @__PURE__ */ y(z, { style: {
				flex: 1,
				backgroundColor: a
			} }), /* @__PURE__ */ y(z, {
				style: {
					position: "absolute",
					left: 0,
					right: 0,
					bottom: 80,
					alignItems: "center"
				},
				children: /* @__PURE__ */ y(P, {
					onPress: () => {},
					children: r
				})
			})]
		})
	});
}
//#endregion
//#region src/native/components/Select.tsx
function Tn({ options: e, value: t, onChange: n, placeholder: r = "選択", disabled: i = !1, title: a = "選択" }) {
	let { theme: o, scales: s } = H(), [c, u] = _(!1), d = e.find((e) => e.value === t);
	return /* @__PURE__ */ b(v, { children: [/* @__PURE__ */ b(P, {
		onPress: () => !i && u(!0),
		disabled: i,
		style: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			minHeight: s.touchTargets.textInput.min,
			paddingHorizontal: s.spacing.scale[3],
			borderRadius: s.borderRadius.md,
			borderWidth: 1,
			borderColor: o.border["medium-emphasis"],
			backgroundColor: i ? o.surface.disable : o.surface.primary,
			opacity: i ? .6 : 1
		},
		children: [/* @__PURE__ */ y(L, {
			style: [U("body.md"), { color: d ? o.text["high-emphasis"] : o.text["low-emphasis"] }],
			children: d ? d.label : r
		}), /* @__PURE__ */ y(L, {
			style: [U("label.sm"), { color: o.text["low-emphasis"] }],
			children: "▾"
		})]
	}), /* @__PURE__ */ y(Z, {
		open: c,
		onClose: () => u(!1),
		side: "bottom",
		title: a,
		children: /* @__PURE__ */ y(z, { children: e.map((r, i) => /* @__PURE__ */ b(l.Fragment, { children: [/* @__PURE__ */ b(P, {
			onPress: () => {
				r.disabled || (n?.(r.value), u(!1));
			},
			disabled: r.disabled,
			style: ({ pressed: e }) => ({
				paddingVertical: s.spacing.scale[3],
				paddingHorizontal: s.spacing.scale[2],
				backgroundColor: e ? o.surface.secondary : "transparent",
				opacity: r.disabled ? .4 : 1,
				flexDirection: "row",
				justifyContent: "space-between",
				alignItems: "center"
			}),
			children: [/* @__PURE__ */ y(L, {
				style: [U("body.md"), { color: o.text["high-emphasis"] }],
				children: r.label
			}), t === r.value && /* @__PURE__ */ y(L, {
				style: [U("label.md"), { color: o.text["accent-primary"] }],
				children: "✓"
			})]
		}), i < e.length - 1 && /* @__PURE__ */ y(J, {})] }, r.value)) })
	})] });
}
//#endregion
//#region src/native/components/Combobox.tsx
function En({ options: e, value: t, onChange: n, placeholder: r = "選択", searchPlaceholder: i = "検索", emptyMessage: a = "該当なし", disabled: o = !1 }) {
	let { theme: s, scales: c } = H(), [l, u] = _(!1), [d, f] = _(""), p = e.find((e) => e.value === t), m = h(() => {
		if (!d) return e;
		let t = d.toLowerCase();
		return e.filter((e) => e.label.toLowerCase().includes(t));
	}, [e, d]);
	return /* @__PURE__ */ b(v, { children: [/* @__PURE__ */ b(P, {
		onPress: () => !o && u(!0),
		disabled: o,
		style: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			minHeight: c.touchTargets.textInput.min,
			paddingHorizontal: c.spacing.scale[3],
			borderRadius: c.borderRadius.md,
			borderWidth: 1,
			borderColor: s.border["medium-emphasis"],
			backgroundColor: o ? s.surface.disable : s.surface.primary,
			opacity: o ? .6 : 1
		},
		children: [/* @__PURE__ */ y(L, {
			style: [U("body.md"), { color: p ? s.text["high-emphasis"] : s.text["low-emphasis"] }],
			children: p ? p.label : r
		}), /* @__PURE__ */ y(L, {
			style: [U("label.sm"), { color: s.text["low-emphasis"] }],
			children: "▾"
		})]
	}), /* @__PURE__ */ b(Z, {
		open: l,
		onClose: () => u(!1),
		side: "bottom",
		title: "選択",
		children: [/* @__PURE__ */ y(Ct, {
			value: d,
			onChangeText: f,
			placeholder: i
		}), /* @__PURE__ */ y(z, {
			style: {
				height: 360,
				marginTop: c.spacing.scale[2]
			},
			children: m.length === 0 ? /* @__PURE__ */ y(L, {
				style: [U("body.md"), {
					color: s.text["low-emphasis"],
					textAlign: "center",
					paddingVertical: c.spacing.scale[6]
				}],
				children: a
			}) : /* @__PURE__ */ y(E, {
				data: m,
				keyExtractor: (e) => e.value,
				renderItem: ({ item: e }) => /* @__PURE__ */ b(P, {
					onPress: () => {
						n?.(e.value), f(""), u(!1);
					},
					style: ({ pressed: e }) => ({
						paddingVertical: c.spacing.scale[3],
						paddingHorizontal: c.spacing.scale[2],
						backgroundColor: e ? s.surface.secondary : "transparent",
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center"
					}),
					children: [/* @__PURE__ */ y(L, {
						style: [U("body.md"), { color: s.text["high-emphasis"] }],
						children: e.label
					}), t === e.value && /* @__PURE__ */ y(L, {
						style: [U("label.md"), { color: s.text["accent-primary"] }],
						children: "✓"
					})]
				})
			})
		})]
	})] });
}
//#endregion
//#region src/native/components/MultiSelect.tsx
function Dn({ options: e, values: t = [], onChange: n, placeholder: r = "選択", searchPlaceholder: i = "検索", disabled: a = !1 }) {
	let { theme: o, scales: s } = H(), [c, l] = _(!1), [u, d] = _(""), [f, p] = _(t), m = h(() => {
		if (!u) return e;
		let t = u.toLowerCase();
		return e.filter((e) => e.label.toLowerCase().includes(t));
	}, [e, u]), g = t.length === 0 ? r : t.length === 1 ? e.find((e) => e.value === t[0])?.label ?? r : `${t.length}件選択中`;
	return /* @__PURE__ */ b(v, { children: [/* @__PURE__ */ b(P, {
		onPress: () => {
			a || (p(t), l(!0));
		},
		disabled: a,
		style: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			minHeight: s.touchTargets.textInput.min,
			paddingHorizontal: s.spacing.scale[3],
			borderRadius: s.borderRadius.md,
			borderWidth: 1,
			borderColor: o.border["medium-emphasis"],
			backgroundColor: a ? o.surface.disable : o.surface.primary,
			opacity: a ? .6 : 1
		},
		children: [/* @__PURE__ */ y(L, {
			style: [U("body.md"), { color: t.length > 0 ? o.text["high-emphasis"] : o.text["low-emphasis"] }],
			children: g
		}), /* @__PURE__ */ y(L, {
			style: [U("label.sm"), { color: o.text["low-emphasis"] }],
			children: "▾"
		})]
	}), /* @__PURE__ */ b(Z, {
		open: c,
		onClose: () => l(!1),
		side: "bottom",
		title: "複数選択",
		children: [
			/* @__PURE__ */ y(Ct, {
				value: u,
				onChangeText: d,
				placeholder: i
			}),
			/* @__PURE__ */ y(z, {
				style: {
					height: 320,
					marginTop: s.spacing.scale[2]
				},
				children: /* @__PURE__ */ y(E, {
					data: m,
					keyExtractor: (e) => e.value,
					renderItem: ({ item: e }) => {
						let t = f.includes(e.value);
						return /* @__PURE__ */ b(P, {
							onPress: () => {
								p((t) => t.includes(e.value) ? t.filter((t) => t !== e.value) : [...t, e.value]);
							},
							style: {
								flexDirection: "row",
								alignItems: "center",
								gap: s.spacing.scale[2],
								paddingVertical: s.spacing.scale[3]
							},
							children: [/* @__PURE__ */ y(Ft, { checked: t }), /* @__PURE__ */ y(L, {
								style: [U("body.md"), {
									color: o.text["high-emphasis"],
									flex: 1
								}],
								children: e.label
							})]
						});
					}
				})
			}),
			/* @__PURE__ */ b(z, {
				style: {
					flexDirection: "row",
					gap: s.spacing.scale[2],
					marginTop: s.spacing.scale[3]
				},
				children: [/* @__PURE__ */ y(z, {
					style: { flex: 1 },
					children: /* @__PURE__ */ y(q, {
						variant: "tertiary",
						onPress: () => l(!1),
						children: "キャンセル"
					})
				}), /* @__PURE__ */ y(z, {
					style: { flex: 1 },
					children: /* @__PURE__ */ y(q, {
						variant: "primary",
						onPress: () => {
							n?.(f), l(!1);
						},
						children: "適用"
					})
				})]
			})
		]
	})] });
}
//#endregion
//#region src/native/components/DropdownFilter.tsx
function On({ label: e, options: t, value: n, onChange: r }) {
	let { theme: i, scales: a } = H(), [o, s] = _(!1), c = t.find((e) => e.value === n), u = !!c;
	return /* @__PURE__ */ b(v, { children: [/* @__PURE__ */ b(P, {
		onPress: () => s(!0),
		style: ({ pressed: e }) => ({
			flexDirection: "row",
			alignItems: "center",
			gap: a.spacing.scale[1],
			paddingVertical: a.spacing.scale[2],
			paddingHorizontal: a.spacing.scale[3],
			borderRadius: a.borderRadius.full,
			borderWidth: 1,
			borderColor: u ? i.border["accent-primary"] : i.border["medium-emphasis"],
			backgroundColor: u ? i.surface["accent-primary-light"] : e ? i.surface.secondary : i.surface.primary
		}),
		children: [/* @__PURE__ */ b(L, {
			style: [U("label.sm"), { color: u ? i.text["accent-primary"] : i.text["high-emphasis"] }],
			children: [e, c ? `: ${c.label}` : ""]
		}), /* @__PURE__ */ y(L, {
			style: [U("label.xs"), { color: u ? i.text["accent-primary"] : i.text["low-emphasis"] }],
			children: "▾"
		})]
	}), /* @__PURE__ */ y(Z, {
		open: o,
		onClose: () => s(!1),
		side: "bottom",
		title: e,
		children: /* @__PURE__ */ b(z, { children: [
			/* @__PURE__ */ y(P, {
				onPress: () => {
					r?.(void 0), s(!1);
				},
				style: ({ pressed: e }) => ({
					paddingVertical: a.spacing.scale[3],
					backgroundColor: e ? i.surface.secondary : "transparent"
				}),
				children: /* @__PURE__ */ y(L, {
					style: [U("body.md"), { color: i.text["medium-emphasis"] }],
					children: "すべて"
				})
			}),
			/* @__PURE__ */ y(J, {}),
			t.map((e, o) => /* @__PURE__ */ b(l.Fragment, { children: [/* @__PURE__ */ b(P, {
				onPress: () => {
					r?.(e.value), s(!1);
				},
				style: ({ pressed: e }) => ({
					paddingVertical: a.spacing.scale[3],
					flexDirection: "row",
					justifyContent: "space-between",
					backgroundColor: e ? i.surface.secondary : "transparent"
				}),
				children: [/* @__PURE__ */ y(L, {
					style: [U("body.md"), { color: i.text["high-emphasis"] }],
					children: e.label
				}), /* @__PURE__ */ b(z, {
					style: {
						flexDirection: "row",
						alignItems: "center",
						gap: 8
					},
					children: [e.count !== void 0 && /* @__PURE__ */ y(L, {
						style: [U("label.sm"), { color: i.text["low-emphasis"] }],
						children: e.count
					}), n === e.value && /* @__PURE__ */ y(L, {
						style: [U("label.md"), { color: i.text["accent-primary"] }],
						children: "✓"
					})]
				})]
			}), o < t.length - 1 && /* @__PURE__ */ y(J, {})] }, e.value))
		] })
	})] });
}
//#endregion
//#region src/native/components/PillToggle.tsx
function kn({ options: e, value: t, onChange: n, disabled: r = !1 }) {
	let { theme: i, scales: a } = H();
	return /* @__PURE__ */ y(z, {
		style: {
			flexDirection: "row",
			flexWrap: "wrap",
			gap: a.spacing.scale[2]
		},
		children: e.map((e) => {
			let o = t === e.value;
			return /* @__PURE__ */ b(P, {
				onPress: () => !r && n?.(e.value),
				disabled: r,
				style: ({ pressed: e }) => ({
					flexDirection: "row",
					alignItems: "center",
					gap: a.spacing.scale[1],
					paddingHorizontal: a.spacing.scale[3],
					height: 36,
					borderRadius: a.borderRadius.full,
					backgroundColor: o ? i.brand.primary : e ? i.active["secondary-button"] : i.surface.secondary,
					opacity: r ? .5 : 1
				}),
				children: [/* @__PURE__ */ y(L, {
					style: [U("label.sm"), {
						color: o ? i.text["on-inverse"] : i.text["high-emphasis"],
						fontWeight: o ? "700" : "500"
					}],
					children: e.label
				}), e.count !== void 0 && /* @__PURE__ */ y(z, {
					style: {
						paddingHorizontal: 6,
						borderRadius: 999,
						backgroundColor: o ? i.surface.primary : i.surface.tertiary,
						minWidth: 20,
						alignItems: "center"
					},
					children: /* @__PURE__ */ y(L, {
						style: [U("label.xs"), { color: o ? i.text["accent-primary"] : i.text["medium-emphasis"] }],
						children: e.count
					})
				})]
			}, e.value);
		})
	});
}
//#endregion
//#region src/native/components/Tabs.tsx
var An = u(null);
function jn() {
	let e = f(An);
	if (!e) throw Error("Tabs の内側で使ってください");
	return e;
}
function Mn({ value: e, onChange: t, children: n }) {
	return /* @__PURE__ */ y(An.Provider, {
		value: {
			value: e,
			onChange: t
		},
		children: n
	});
}
function Nn({ scrollable: e = !1, children: t }) {
	let { theme: n, scales: r } = H(), i = /* @__PURE__ */ y(z, {
		style: {
			flexDirection: "row",
			borderBottomWidth: 1,
			borderBottomColor: n.border["low-emphasis"],
			gap: r.spacing.scale[1]
		},
		children: t
	});
	return e ? /* @__PURE__ */ y(F, {
		horizontal: !0,
		showsHorizontalScrollIndicator: !1,
		children: i
	}) : i;
}
function Pn({ value: e, children: t, disabled: n }) {
	let { theme: r, scales: i } = H(), a = jn(), o = a.value === e;
	return /* @__PURE__ */ y(P, {
		onPress: () => !n && a.onChange(e),
		disabled: n,
		style: {
			paddingVertical: i.spacing.scale[2],
			paddingHorizontal: i.spacing.scale[3],
			borderBottomWidth: 2,
			borderBottomColor: o ? r.brand.primary : "transparent",
			opacity: n ? .4 : 1
		},
		children: /* @__PURE__ */ y(L, {
			style: [U("label.md"), {
				color: o ? r.text["accent-primary"] : r.text["medium-emphasis"],
				fontWeight: o ? "700" : "500"
			}],
			children: t
		})
	});
}
function Fn({ value: e, children: t }) {
	return jn().value === e ? /* @__PURE__ */ y(z, { children: t }) : null;
}
//#endregion
//#region src/native/components/Calendar.tsx
var In = [
	"日",
	"月",
	"火",
	"水",
	"木",
	"金",
	"土"
], Ln = [
	"S",
	"M",
	"T",
	"W",
	"T",
	"F",
	"S"
], Rn = [
	"1月",
	"2月",
	"3月",
	"4月",
	"5月",
	"6月",
	"7月",
	"8月",
	"9月",
	"10月",
	"11月",
	"12月"
];
function zn(e) {
	return new Date(e.getFullYear(), e.getMonth(), 1);
}
function Bn(e) {
	return new Date(e.getFullYear(), e.getMonth() + 1, 0).getDate();
}
function Vn(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
function Hn({ value: e, onChange: t, minDate: n, maxDate: r, locale: i = "ja" }) {
	let { theme: a, scales: o } = H(), [s, c] = _(e ?? /* @__PURE__ */ new Date()), l = i === "ja" ? In : Ln, u = h(() => {
		let e = zn(s).getDay(), t = Bn(s), n = [];
		for (let t = 0; t < e; t++) n.push(null);
		for (let e = 1; e <= t; e++) n.push(new Date(s.getFullYear(), s.getMonth(), e));
		for (; n.length % 7 != 0;) n.push(null);
		return n;
	}, [s]), d = i === "ja" ? `${s.getFullYear()}年 ${Rn[s.getMonth()]}` : `${s.getFullYear()}-${String(s.getMonth() + 1).padStart(2, "0")}`;
	return /* @__PURE__ */ b(z, {
		style: {
			backgroundColor: a.surface.primary,
			borderRadius: o.borderRadius.lg,
			borderWidth: 1,
			borderColor: a.border["low-emphasis"],
			padding: o.spacing.scale[3],
			gap: o.spacing.scale[2]
		},
		children: [
			/* @__PURE__ */ b(z, {
				style: {
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center"
				},
				children: [
					/* @__PURE__ */ y(P, {
						onPress: () => c((e) => new Date(e.getFullYear(), e.getMonth() - 1, 1)),
						hitSlop: 8,
						children: /* @__PURE__ */ y(L, {
							style: [U("label.lg"), { color: a.text["medium-emphasis"] }],
							children: "‹"
						})
					}),
					/* @__PURE__ */ y(L, {
						style: [U("label.md"), { color: a.text["high-emphasis"] }],
						children: d
					}),
					/* @__PURE__ */ y(P, {
						onPress: () => c((e) => new Date(e.getFullYear(), e.getMonth() + 1, 1)),
						hitSlop: 8,
						children: /* @__PURE__ */ y(L, {
							style: [U("label.lg"), { color: a.text["medium-emphasis"] }],
							children: "›"
						})
					})
				]
			}),
			/* @__PURE__ */ y(z, {
				style: { flexDirection: "row" },
				children: l.map((e, t) => /* @__PURE__ */ y(z, {
					style: {
						flex: 1,
						alignItems: "center"
					},
					children: /* @__PURE__ */ y(L, {
						style: [U("label.xs"), { color: a.text["low-emphasis"] }],
						children: e
					})
				}, t))
			}),
			/* @__PURE__ */ y(z, {
				style: {
					flexDirection: "row",
					flexWrap: "wrap"
				},
				children: u.map((i, s) => {
					if (!i) return /* @__PURE__ */ y(z, { style: {
						width: `${100 / 7}%`,
						aspectRatio: 1
					} }, s);
					let c = n && i < new Date(n.getFullYear(), n.getMonth(), n.getDate()) || r && i > new Date(r.getFullYear(), r.getMonth(), r.getDate()), l = e && Vn(i, e), u = Vn(i, /* @__PURE__ */ new Date());
					return /* @__PURE__ */ y(z, {
						style: {
							width: `${100 / 7}%`,
							aspectRatio: 1,
							padding: 2
						},
						children: /* @__PURE__ */ y(P, {
							onPress: () => !c && t?.(i),
							disabled: !!c,
							style: {
								flex: 1,
								alignItems: "center",
								justifyContent: "center",
								borderRadius: o.borderRadius.full,
								backgroundColor: l ? a.brand.primary : "transparent",
								borderWidth: u && !l ? 1 : 0,
								borderColor: a.border["accent-primary"],
								opacity: c ? .3 : 1
							},
							children: /* @__PURE__ */ y(L, {
								style: [U("body.sm"), {
									color: l ? a.text["on-inverse"] : a.text["high-emphasis"],
									fontWeight: l || u ? "700" : "400"
								}],
								children: i.getDate()
							})
						})
					}, s);
				})
			})
		]
	});
}
//#endregion
//#region src/native/components/DatePicker.tsx
function Un(e) {
	return `${e.getFullYear()}/${String(e.getMonth() + 1).padStart(2, "0")}/${String(e.getDate()).padStart(2, "0")}`;
}
function Wn({ value: e, onChange: t, placeholder: n = "日付を選択", minDate: r, maxDate: i, disabled: a = !1, formatter: o = Un }) {
	let { theme: s, scales: c } = H(), [l, u] = _(!1), [d, f] = _(e);
	return /* @__PURE__ */ b(v, { children: [/* @__PURE__ */ b(P, {
		onPress: () => {
			a || (f(e), u(!0));
		},
		disabled: a,
		style: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			minHeight: c.touchTargets.textInput.min,
			paddingHorizontal: c.spacing.scale[3],
			borderRadius: c.borderRadius.md,
			borderWidth: 1,
			borderColor: s.border["medium-emphasis"],
			backgroundColor: a ? s.surface.disable : s.surface.primary,
			opacity: a ? .6 : 1
		},
		children: [/* @__PURE__ */ y(L, {
			style: [U("body.md"), { color: e ? s.text["high-emphasis"] : s.text["low-emphasis"] }],
			children: e ? o(e) : n
		}), /* @__PURE__ */ y(L, {
			style: [U("label.sm"), { color: s.text["low-emphasis"] }],
			children: "📅"
		})]
	}), /* @__PURE__ */ b(Z, {
		open: l,
		onClose: () => u(!1),
		side: "bottom",
		title: "日付を選択",
		children: [/* @__PURE__ */ y(Hn, {
			value: d,
			onChange: f,
			minDate: r,
			maxDate: i
		}), /* @__PURE__ */ b(z, {
			style: {
				flexDirection: "row",
				gap: c.spacing.scale[2],
				marginTop: c.spacing.scale[3]
			},
			children: [/* @__PURE__ */ y(z, {
				style: { flex: 1 },
				children: /* @__PURE__ */ y(q, {
					variant: "tertiary",
					onPress: () => u(!1),
					children: "キャンセル"
				})
			}), /* @__PURE__ */ y(z, {
				style: { flex: 1 },
				children: /* @__PURE__ */ y(q, {
					variant: "primary",
					disabled: !d,
					onPress: () => {
						d && t?.(d), u(!1);
					},
					children: "決定"
				})
			})]
		})]
	})] });
}
//#endregion
//#region src/native/components/DateField.tsx
function Gn(e) {
	if (!e) return;
	let t = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e);
	if (!t) return;
	let n = Number(t[1]), r = Number(t[2]), i = Number(t[3]), a = new Date(n, r - 1, i);
	if (!(a.getFullYear() !== n || a.getMonth() !== r - 1 || a.getDate() !== i)) return a;
}
function Kn(e) {
	return !e || isNaN(e.getTime()) ? "" : `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
}
function qn({ value: e, onChange: t, placeholder: n, disabled: r, formatter: i }) {
	return /* @__PURE__ */ y(Wn, {
		value: Gn(e),
		onChange: (e) => t(Kn(e)),
		placeholder: n,
		disabled: r,
		formatter: i
	});
}
//#endregion
//#region src/native/components/TimePicker.tsx
function Jn(e) {
	return e.toString().padStart(2, "0");
}
function Yn({ value: e, onChange: t, placeholder: n = "時刻を選択", minuteStep: r = 5, disabled: i = !1 }) {
	let { theme: a, scales: o } = H(), [s, c] = _(!1), [l, u] = _(e?.hour ?? 9), [d, f] = _(e?.minute ?? 0), p = Array.from({ length: 24 }, (e, t) => t), m = Array.from({ length: 60 / r }, (e, t) => t * r);
	return /* @__PURE__ */ b(v, { children: [/* @__PURE__ */ b(P, {
		onPress: () => {
			i || (u(e?.hour ?? 9), f(e?.minute ?? 0), c(!0));
		},
		disabled: i,
		style: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			minHeight: o.touchTargets.textInput.min,
			paddingHorizontal: o.spacing.scale[3],
			borderRadius: o.borderRadius.md,
			borderWidth: 1,
			borderColor: a.border["medium-emphasis"],
			backgroundColor: i ? a.surface.disable : a.surface.primary,
			opacity: i ? .6 : 1
		},
		children: [/* @__PURE__ */ y(L, {
			style: [U("body.md"), { color: e ? a.text["high-emphasis"] : a.text["low-emphasis"] }],
			children: e ? `${Jn(e.hour)}:${Jn(e.minute)}` : n
		}), /* @__PURE__ */ y(L, {
			style: [U("label.sm"), { color: a.text["low-emphasis"] }],
			children: "🕐"
		})]
	}), /* @__PURE__ */ b(Z, {
		open: s,
		onClose: () => c(!1),
		side: "bottom",
		title: "時刻を選択",
		children: [/* @__PURE__ */ b(z, {
			style: {
				flexDirection: "row",
				height: 220,
				gap: o.spacing.scale[3]
			},
			children: [/* @__PURE__ */ y(F, {
				style: { flex: 1 },
				showsVerticalScrollIndicator: !1,
				children: p.map((e) => /* @__PURE__ */ y(P, {
					onPress: () => u(e),
					style: {
						paddingVertical: o.spacing.scale[2],
						alignItems: "center",
						backgroundColor: l === e ? a.surface["accent-primary-light"] : "transparent",
						borderRadius: o.borderRadius.sm
					},
					children: /* @__PURE__ */ y(L, {
						style: [U("body.lg"), {
							color: l === e ? a.text["accent-primary"] : a.text["high-emphasis"],
							fontWeight: l === e ? "700" : "400"
						}],
						children: Jn(e)
					})
				}, e))
			}), /* @__PURE__ */ y(F, {
				style: { flex: 1 },
				showsVerticalScrollIndicator: !1,
				children: m.map((e) => /* @__PURE__ */ y(P, {
					onPress: () => f(e),
					style: {
						paddingVertical: o.spacing.scale[2],
						alignItems: "center",
						backgroundColor: d === e ? a.surface["accent-primary-light"] : "transparent",
						borderRadius: o.borderRadius.sm
					},
					children: /* @__PURE__ */ y(L, {
						style: [U("body.lg"), {
							color: d === e ? a.text["accent-primary"] : a.text["high-emphasis"],
							fontWeight: d === e ? "700" : "400"
						}],
						children: Jn(e)
					})
				}, e))
			})]
		}), /* @__PURE__ */ b(z, {
			style: {
				flexDirection: "row",
				gap: o.spacing.scale[2],
				marginTop: o.spacing.scale[3]
			},
			children: [/* @__PURE__ */ y(z, {
				style: { flex: 1 },
				children: /* @__PURE__ */ y(q, {
					variant: "tertiary",
					onPress: () => c(!1),
					children: "キャンセル"
				})
			}), /* @__PURE__ */ y(z, {
				style: { flex: 1 },
				children: /* @__PURE__ */ y(q, {
					variant: "primary",
					onPress: () => {
						t?.({
							hour: l,
							minute: d
						}), c(!1);
					},
					children: "決定"
				})
			})]
		})]
	})] });
}
//#endregion
//#region src/native/components/DateTimePicker.tsx
function Xn(e, t, n) {
	return t && e < t ? new Date(t) : n && e > n ? new Date(n) : e;
}
function Zn({ value: e, onChange: t, minuteStep: n = 5, minDate: r, maxDate: i, disabled: a = !1, style: o }) {
	let { scales: s } = H(), c = e ? {
		hour: e.getHours(),
		minute: e.getMinutes()
	} : void 0;
	return /* @__PURE__ */ b(z, {
		style: [{ gap: s.spacing.scale[2] }, o],
		children: [/* @__PURE__ */ y(Wn, {
			value: e,
			onChange: (n) => {
				let a = new Date(n);
				a.setHours(e?.getHours() ?? 0, e?.getMinutes() ?? 0, e?.getSeconds() ?? 0, e?.getMilliseconds() ?? 0), t?.(Xn(a, r, i));
			},
			minDate: r,
			maxDate: i,
			formatter: (e) => `${e.getMonth() + 1}月${e.getDate()}日（${[
				"日",
				"月",
				"火",
				"水",
				"木",
				"金",
				"土"
			][e.getDay()]}）`,
			disabled: a
		}), /* @__PURE__ */ y(Yn, {
			value: c,
			onChange: (n) => {
				if (!e) return;
				let a = new Date(e);
				a.setHours(n.hour, n.minute, e.getSeconds(), e.getMilliseconds()), t?.(Xn(a, r, i));
			},
			minuteStep: n,
			disabled: a || !e
		})]
	});
}
//#endregion
//#region src/native/components/Accordion.tsx
function Qn({ items: e, type: t = "single", defaultOpenKeys: n = [] }) {
	let { theme: r, scales: i } = H(), [a, o] = _(new Set(n)), s = (e) => {
		o((n) => {
			let r = new Set(t === "multiple" ? n : []);
			return n.has(e) ? r.delete(e) : r.add(e), r;
		});
	};
	return /* @__PURE__ */ y(z, {
		style: {
			borderRadius: i.borderRadius.lg,
			borderWidth: 1,
			borderColor: r.border["low-emphasis"],
			backgroundColor: r.surface.primary,
			overflow: "hidden"
		},
		children: e.map((e, t) => {
			let n = a.has(e.key);
			return /* @__PURE__ */ b(z, {
				style: {
					borderTopWidth: t === 0 ? 0 : 1,
					borderTopColor: r.border["low-emphasis"]
				},
				children: [/* @__PURE__ */ b(P, {
					onPress: () => s(e.key),
					style: ({ pressed: e }) => ({
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						padding: i.spacing.scale[4],
						backgroundColor: e ? r.surface.secondary : "transparent"
					}),
					children: [/* @__PURE__ */ y(L, {
						style: [U("label.md"), {
							color: r.text["high-emphasis"],
							flex: 1
						}],
						children: e.title
					}), /* @__PURE__ */ y(L, {
						style: [U("label.sm"), { color: r.text["low-emphasis"] }],
						children: n ? "▾" : "▸"
					})]
				}), n && /* @__PURE__ */ y(z, {
					style: {
						paddingHorizontal: i.spacing.scale[4],
						paddingBottom: i.spacing.scale[4]
					},
					children: e.content
				})]
			}, e.key);
		})
	});
}
//#endregion
//#region src/native/components/Collapsible.tsx
function $n({ title: e, defaultOpen: t = !1, children: n }) {
	let { theme: r, scales: i } = H(), [a, o] = _(t);
	return /* @__PURE__ */ b(z, { children: [/* @__PURE__ */ b(P, {
		onPress: () => o((e) => !e),
		style: {
			flexDirection: "row",
			alignItems: "center",
			gap: i.spacing.scale[1]
		},
		children: [/* @__PURE__ */ y(L, {
			style: [U("label.sm"), { color: r.text["accent-primary"] }],
			children: a ? "▾" : "▸"
		}), /* @__PURE__ */ y(L, {
			style: [U("label.md"), { color: r.text["accent-primary"] }],
			children: e
		})]
	}), a && /* @__PURE__ */ y(z, {
		style: { marginTop: i.spacing.scale[2] },
		children: n
	})] });
}
//#endregion
//#region src/native/components/ScrollArea.tsx
function er({ maxHeight: e, bordered: t, children: n, ...r }) {
	let { theme: i, scales: a } = H();
	return /* @__PURE__ */ y(z, {
		style: {
			maxHeight: e,
			borderWidth: +!!t,
			borderColor: i.border["low-emphasis"],
			borderRadius: t ? a.borderRadius.lg : 0,
			overflow: "hidden"
		},
		children: /* @__PURE__ */ y(F, {
			...r,
			children: n
		})
	});
}
//#endregion
//#region src/native/components/Pagination.tsx
function tr(e, t) {
	let n = [];
	for (let r = e; r <= t; r++) n.push(r);
	return n;
}
function nr({ page: e, total: t, onChange: n, windowSize: r = 5 }) {
	let { theme: i, scales: a } = H(), o = Math.floor(r / 2), s = Math.max(1, e - o), c = Math.min(t, s + r - 1);
	c - s + 1 < r && (s = Math.max(1, c - r + 1));
	let l = tr(s, c), u = (e, t, r = !1, o = !1) => /* @__PURE__ */ y(P, {
		onPress: () => t && !r && n?.(t),
		disabled: r || !t,
		style: ({ pressed: e }) => ({
			minWidth: 36,
			height: 36,
			alignItems: "center",
			justifyContent: "center",
			borderRadius: a.borderRadius.md,
			backgroundColor: o ? i.brand.primary : e ? i.active["tertiary-button"] : i.surface.primary,
			borderWidth: +!o,
			borderColor: i.border["low-emphasis"],
			opacity: r ? .4 : 1,
			paddingHorizontal: a.spacing.scale[2]
		}),
		children: /* @__PURE__ */ y(L, {
			style: [U("label.sm"), { color: o ? i.text["on-inverse"] : i.text["high-emphasis"] }],
			children: e
		})
	}, e);
	return /* @__PURE__ */ b(z, {
		style: {
			flexDirection: "row",
			gap: a.spacing.scale[1],
			alignSelf: "center"
		},
		children: [
			u("‹", e > 1 ? e - 1 : null, e <= 1),
			s > 1 && u("1", 1),
			s > 2 && u("…", null, !0),
			l.map((t) => u(String(t), t, !1, t === e)),
			c < t - 1 && u("…", null, !0),
			c < t && u(String(t), t),
			u("›", e < t ? e + 1 : null, e >= t)
		]
	});
}
//#endregion
//#region src/native/components/SimplePagination.tsx
function rr({ page: e, total: t, onChange: n }) {
	let { theme: r, scales: i } = H(), a = (e, t, a) => /* @__PURE__ */ y(P, {
		onPress: () => !a && n?.(t),
		disabled: a,
		style: ({ pressed: e }) => ({
			width: 40,
			height: 40,
			alignItems: "center",
			justifyContent: "center",
			borderRadius: i.borderRadius.full,
			backgroundColor: e ? r.active["tertiary-button"] : r.surface.secondary,
			opacity: a ? .4 : 1
		}),
		children: /* @__PURE__ */ y(L, {
			style: [U("label.md"), { color: r.text["high-emphasis"] }],
			children: e
		})
	});
	return /* @__PURE__ */ b(z, {
		style: {
			flexDirection: "row",
			alignItems: "center",
			gap: i.spacing.scale[3],
			alignSelf: "center"
		},
		children: [
			a("‹", e - 1, e <= 1),
			/* @__PURE__ */ b(L, {
				style: [U("label.md"), { color: r.text["medium-emphasis"] }],
				children: [
					e,
					" / ",
					t
				]
			}),
			a("›", e + 1, e >= t)
		]
	});
}
//#endregion
//#region src/native/components/NavigationBar.tsx
function ir({ items: e, value: t, onChange: n }) {
	let { theme: r, scales: i } = H();
	return /* @__PURE__ */ y(z, {
		style: {
			flexDirection: "row",
			backgroundColor: r.surface.primary,
			borderTopWidth: 1,
			borderTopColor: r.border["low-emphasis"],
			paddingBottom: N.OS === "ios" ? 24 : 0
		},
		children: e.map((e) => {
			let a = t === e.key;
			return /* @__PURE__ */ b(P, {
				onPress: () => {
					e.onPress?.(), n?.(e.key);
				},
				style: ({ pressed: e }) => ({
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					paddingVertical: i.spacing.scale[2],
					backgroundColor: e ? r.surface.secondary : "transparent",
					gap: 2,
					minHeight: i.touchTargets.navItem.min
				}),
				children: [/* @__PURE__ */ b(z, {
					style: { position: "relative" },
					children: [e.icon, e.badge !== void 0 && e.badge > 0 && /* @__PURE__ */ y(z, {
						style: {
							position: "absolute",
							top: -4,
							right: -8,
							minWidth: 16,
							paddingHorizontal: 4,
							height: 16,
							borderRadius: 8,
							backgroundColor: r.caution.base,
							alignItems: "center",
							justifyContent: "center"
						},
						children: /* @__PURE__ */ y(L, {
							style: [U("label.xs"), { color: r.text["on-inverse"] }],
							children: e.badge > 99 ? "99+" : e.badge
						})
					})]
				}), /* @__PURE__ */ y(L, {
					style: [U("label.xs"), { color: a ? r.text["accent-primary"] : r.text["medium-emphasis"] }],
					children: e.label
				})]
			}, e.key);
		})
	});
}
//#endregion
//#region src/native/components/SubNav.tsx
function ar({ items: e, value: t, onChange: n }) {
	let { theme: r, scales: i } = H();
	return /* @__PURE__ */ y(F, {
		horizontal: !0,
		showsHorizontalScrollIndicator: !1,
		contentContainerStyle: {
			paddingHorizontal: i.spacing.scale[3],
			gap: i.spacing.scale[2]
		},
		style: {
			backgroundColor: r.surface.primary,
			borderBottomWidth: 1,
			borderBottomColor: r.border["low-emphasis"]
		},
		children: e.map((e) => {
			let a = t === e.key;
			return /* @__PURE__ */ b(P, {
				onPress: () => n?.(e.key),
				style: {
					flexDirection: "row",
					alignItems: "center",
					gap: i.spacing.scale[1],
					paddingVertical: i.spacing.scale[3],
					borderBottomWidth: 2,
					borderBottomColor: a ? r.brand.primary : "transparent"
				},
				children: [/* @__PURE__ */ y(L, {
					style: [U("label.md"), {
						color: a ? r.text["accent-primary"] : r.text["medium-emphasis"],
						fontWeight: a ? "700" : "500"
					}],
					children: e.label
				}), e.count !== void 0 && /* @__PURE__ */ y(z, {
					style: {
						paddingHorizontal: 6,
						borderRadius: 999,
						backgroundColor: a ? r.surface["accent-primary-light"] : r.surface.tertiary,
						minWidth: 20,
						alignItems: "center"
					},
					children: /* @__PURE__ */ y(L, {
						style: [U("label.xs"), { color: a ? r.text["accent-primary"] : r.text["medium-emphasis"] }],
						children: e.count
					})
				})]
			}, e.key);
		})
	});
}
//#endregion
//#region src/native/components/Breadcrumb.tsx
function or({ title: e, onBack: t, backLabel: n = "戻る", rightSlot: r }) {
	let { theme: i, scales: a } = H();
	return /* @__PURE__ */ b(z, {
		style: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			gap: a.spacing.scale[2],
			paddingHorizontal: a.spacing.scale[3],
			paddingVertical: a.spacing.scale[2],
			backgroundColor: i.surface.primary,
			borderBottomWidth: 1,
			borderBottomColor: i.border["low-emphasis"]
		},
		children: [/* @__PURE__ */ b(z, {
			style: {
				flexDirection: "row",
				alignItems: "center",
				gap: a.spacing.scale[2],
				flex: 1
			},
			children: [t && /* @__PURE__ */ b(P, {
				onPress: t,
				hitSlop: 8,
				style: ({ pressed: e }) => ({
					padding: a.spacing.scale[1],
					borderRadius: a.borderRadius.md,
					backgroundColor: e ? i.surface.secondary : "transparent",
					flexDirection: "row",
					alignItems: "center",
					gap: 4
				}),
				children: [/* @__PURE__ */ y(L, {
					style: [U("label.md"), { color: i.text["accent-primary"] }],
					children: "‹"
				}), /* @__PURE__ */ y(L, {
					style: [U("label.sm"), { color: i.text["accent-primary"] }],
					children: n
				})]
			}), /* @__PURE__ */ y(L, {
				numberOfLines: 1,
				style: [U("heading.md"), {
					color: i.text["high-emphasis"],
					flex: 1
				}],
				children: e
			})]
		}), r]
	});
}
//#endregion
//#region src/native/components/AppHeader.tsx
function sr({ title: e, subtitle: t, leading: n, trailing: r, onBack: i, centered: a = !0 }) {
	let { theme: o, scales: s } = H(), c = n ?? (i ? /* @__PURE__ */ y(P, {
		onPress: i,
		hitSlop: 8,
		style: ({ pressed: e }) => ({
			padding: s.spacing.scale[1],
			borderRadius: s.borderRadius.md,
			backgroundColor: e ? o.surface.secondary : "transparent"
		}),
		children: /* @__PURE__ */ y(L, {
			style: [U("heading.lg"), { color: o.text["high-emphasis"] }],
			children: "‹"
		})
	}) : null);
	return /* @__PURE__ */ b(z, {
		style: {
			flexDirection: "row",
			alignItems: "center",
			gap: s.spacing.scale[2],
			paddingHorizontal: s.spacing.scale[3],
			paddingTop: N.OS === "ios" ? 48 : s.spacing.scale[3],
			paddingBottom: s.spacing.scale[3],
			backgroundColor: o.surface.primary,
			borderBottomWidth: 1,
			borderBottomColor: o.border["low-emphasis"]
		},
		children: [
			/* @__PURE__ */ y(z, {
				style: {
					width: 44,
					alignItems: "flex-start"
				},
				children: c
			}),
			/* @__PURE__ */ b(z, {
				style: {
					flex: 1,
					alignItems: a ? "center" : "flex-start"
				},
				children: [e && /* @__PURE__ */ y(L, {
					numberOfLines: 1,
					style: [U("heading.md"), { color: o.text["high-emphasis"] }],
					children: e
				}), t && /* @__PURE__ */ y(L, {
					numberOfLines: 1,
					style: [U("body.sm"), { color: o.text["medium-emphasis"] }],
					children: t
				})]
			}),
			/* @__PURE__ */ y(z, {
				style: {
					minWidth: 44,
					alignItems: "flex-end"
				},
				children: r
			})
		]
	});
}
//#endregion
//#region src/native/components/MobileAppHeader.tsx
function cr({ brand: e, leading: t, status: n, compactStatus: r, actions: i, children: a, bordered: o = !0, style: s }) {
	let { theme: c, scales: l } = H();
	return /* @__PURE__ */ b(z, {
		style: [{
			backgroundColor: c.surface.primary,
			borderBottomWidth: +!!o,
			borderBottomColor: c.border["low-emphasis"],
			paddingTop: N.OS === "ios" ? 48 : l.spacing.scale[3]
		}, s],
		children: [/* @__PURE__ */ b(z, {
			style: {
				minHeight: 56,
				paddingHorizontal: l.spacing.scale[4],
				flexDirection: "row",
				alignItems: "center",
				gap: l.spacing.scale[2]
			},
			children: [
				t,
				/* @__PURE__ */ y(z, {
					style: {
						flexShrink: 0,
						maxWidth: "58%"
					},
					children: e
				}),
				/* @__PURE__ */ b(z, {
					style: {
						flex: 1,
						minWidth: 0,
						flexDirection: "row",
						justifyContent: "flex-end",
						alignItems: "center",
						gap: l.spacing.scale[2]
					},
					children: [r ?? n, i]
				})
			]
		}), a]
	});
}
//#endregion
//#region src/native/components/MobileAppShell.tsx
function lr({ header: e, bottomNav: t, fab: n, desktopSidebar: r, scrollable: i = !0, bottomPadding: a = n ? "bottom-nav-fab" : t ? "bottom-nav" : "none", children: o, style: s, contentStyle: c }) {
	let { theme: l, scales: u } = H(), d = a === "bottom-nav-fab" ? u.spacing.scale[15] : a === "bottom-nav" ? u.spacing.scale[12] : 0, f = [{
		flex: 1,
		backgroundColor: l.surface.secondary,
		paddingBottom: d
	}, c], p = y(i ? F : z, {
		style: f,
		children: o
	});
	return /* @__PURE__ */ b(z, {
		style: [{
			flex: 1,
			flexDirection: "row",
			backgroundColor: l.surface.primary
		}, s],
		children: [r, /* @__PURE__ */ b(z, {
			style: {
				flex: 1,
				minWidth: 0,
				backgroundColor: l.surface.primary
			},
			children: [
				e,
				p,
				t,
				n
			]
		})]
	});
}
//#endregion
//#region src/native/components/MobileFloatingActionButton.tsx
function ur({ label: e, icon: t, showLabel: n = !1, placement: r = "end", bottomOffset: i = "bottom-nav", keyboardBehavior: a = "hide", style: o, ...s }) {
	let { theme: c, scales: l } = H(), [u, d] = _(!1);
	if (p(() => {
		let e = k.addListener("keyboardDidShow", () => d(!0)), t = k.addListener("keyboardDidHide", () => d(!1));
		return () => {
			e.remove(), t.remove();
		};
	}, []), a === "hide" && u) return null;
	let f = {
		none: l.spacing.scale[4],
		"bottom-nav-pill-inline": l.spacing.scale[4],
		"bottom-nav": 80,
		"bottom-nav-pill": 96
	}, m = r === "center" ? { alignSelf: "center" } : r === "start" ? { left: l.spacing.scale[4] } : { right: l.spacing.scale[4] };
	return /* @__PURE__ */ b(P, {
		accessibilityRole: "button",
		accessibilityLabel: e,
		style: ({ pressed: e }) => [{
			position: "absolute",
			bottom: f[i] + (a === "lift" && u ? 160 : 0),
			minHeight: 48,
			minWidth: n ? 112 : 48,
			paddingHorizontal: n ? l.spacing.scale[4] : 0,
			borderRadius: l.borderRadius.full,
			backgroundColor: c.brand.primary,
			alignItems: "center",
			justifyContent: "center",
			flexDirection: "row",
			gap: l.spacing.scale[2],
			opacity: e ? .85 : 1,
			...m
		}, o],
		...s,
		children: [/* @__PURE__ */ y(z, { children: t ?? /* @__PURE__ */ y(L, {
			style: [U("heading.lg"), { color: c.text["on-inverse"] }],
			children: "+"
		}) }), n && /* @__PURE__ */ y(L, {
			style: [U("label.md"), { color: c.text["on-inverse"] }],
			children: e
		})]
	});
}
//#endregion
//#region src/native/components/StatusActionBadge.tsx
function dr({ state: e = "idle", label: t, count: n, compact: r = !1, loading: i = !1, icon: a, asStatus: o = !1, style: s, onPress: c, ...l }) {
	let { theme: u, scales: d } = H(), f = {
		idle: {
			bg: u.surface.secondary,
			fg: u.text["medium-emphasis"],
			border: u.border["low-emphasis"]
		},
		pending: {
			bg: u.surface.warning,
			fg: u.text.warning,
			border: u.border.warning
		},
		syncing: {
			bg: u.surface.info,
			fg: u.text.info,
			border: u.border.info
		},
		success: {
			bg: u.surface.success,
			fg: u.text.success,
			border: u.border.success
		},
		warning: {
			bg: u.surface.warning,
			fg: u.text.warning,
			border: u.border.warning
		},
		error: {
			bg: u.surface.caution,
			fg: u.text.caution,
			border: u.border.caution
		},
		offline: {
			bg: u.surface.secondary,
			fg: u.text["low-emphasis"],
			border: u.border["low-emphasis"]
		}
	}[e], p = /* @__PURE__ */ b(v, { children: [
		a ?? (i || e === "syncing" ? /* @__PURE__ */ y(S, {
			size: "small",
			color: f.fg
		}) : /* @__PURE__ */ y(z, { style: {
			width: 6,
			height: 6,
			borderRadius: 3,
			backgroundColor: f.fg
		} })),
		!r && /* @__PURE__ */ y(L, {
			numberOfLines: 1,
			style: [U("label.xs"), { color: f.fg }],
			children: t
		}),
		n != null && n > 0 && /* @__PURE__ */ y(L, {
			style: [U("label.xs"), { color: u.text["high-emphasis"] }],
			children: n > 99 ? "99+" : n
		})
	] }), m = [{
		minHeight: 36,
		minWidth: r ? 36 : void 0,
		paddingHorizontal: d.spacing.scale[2],
		paddingVertical: d.spacing.scale[1],
		borderRadius: d.borderRadius.full,
		borderWidth: 1,
		borderColor: f.border,
		backgroundColor: f.bg,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: d.spacing.scale[1],
		maxWidth: "100%"
	}, s];
	return o || !c ? /* @__PURE__ */ y(z, {
		accessibilityRole: "text",
		accessibilityLabel: t,
		style: m,
		children: p
	}) : /* @__PURE__ */ y(P, {
		accessibilityRole: "button",
		accessibilityLabel: t,
		accessibilityState: { busy: i || e === "syncing" },
		onPress: c,
		style: ({ pressed: e }) => [m, e && { opacity: .82 }],
		...l,
		children: p
	});
}
var fr = dr;
//#endregion
//#region src/native/components/Banner.tsx
function pr({ title: e, description: t, image: n, onPress: r, tone: i = "neutral", height: a = 140 }) {
	let { theme: o, scales: s } = H(), c = {
		neutral: {
			bg: o.surface.secondary,
			fg: o.text["high-emphasis"]
		},
		accent: {
			bg: o.surface["accent-primary-light"],
			fg: o.text["accent-primary"]
		},
		success: {
			bg: o.surface.success,
			fg: o.text.success
		},
		warning: {
			bg: o.surface.warning,
			fg: o.text.warning
		},
		caution: {
			bg: o.surface.caution,
			fg: o.text.caution
		}
	}[i], l = /* @__PURE__ */ b(z, {
		style: {
			height: a,
			borderRadius: s.borderRadius.lg,
			backgroundColor: c.bg,
			overflow: "hidden"
		},
		children: [n && /* @__PURE__ */ y(D, {
			source: n,
			resizeMode: "cover",
			style: {
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0
			}
		}), /* @__PURE__ */ b(z, {
			style: {
				flex: 1,
				padding: s.spacing.scale[4],
				justifyContent: "flex-end",
				backgroundColor: n ? o.surface["videoOverlay-light"] : "transparent"
			},
			children: [e && /* @__PURE__ */ y(L, {
				style: [U("heading.lg"), { color: n ? o.text["on-inverse"] : c.fg }],
				children: e
			}), t && /* @__PURE__ */ y(L, {
				style: [U("body.sm"), { color: n ? o.text["on-inverse-secondary"] : o.text["medium-emphasis"] }],
				children: t
			})]
		})]
	});
	return r ? /* @__PURE__ */ y(P, {
		onPress: r,
		children: l
	}) : l;
}
//#endregion
//#region src/native/components/BannerCarousel.tsx
function mr({ banners: e, itemWidth: t, height: n = 160, showIndicator: r = !0 }) {
	let { theme: i, scales: a } = H(), [o, s] = _(0), c = t ?? w.get("window").width - 32, l = g(null);
	return /* @__PURE__ */ b(z, {
		style: { gap: a.spacing.scale[2] },
		children: [/* @__PURE__ */ y(E, {
			ref: l,
			data: e,
			horizontal: !0,
			showsHorizontalScrollIndicator: !1,
			snapToInterval: c + a.spacing.scale[2],
			decelerationRate: "fast",
			onScroll: (e) => {
				let t = e.nativeEvent.contentOffset.x, n = Math.round(t / (c + a.spacing.scale[2]));
				n !== o && s(n);
			},
			scrollEventThrottle: 16,
			keyExtractor: (e, t) => String(t),
			contentContainerStyle: {
				paddingHorizontal: a.spacing.scale[4],
				gap: a.spacing.scale[2]
			},
			renderItem: ({ item: e }) => /* @__PURE__ */ y(z, {
				style: {
					width: c,
					height: n
				},
				children: /* @__PURE__ */ y(pr, {
					...e,
					height: n
				})
			})
		}), r && e.length > 1 && /* @__PURE__ */ y(z, {
			style: {
				flexDirection: "row",
				gap: 6,
				alignSelf: "center"
			},
			children: e.map((e, t) => /* @__PURE__ */ y(z, { style: {
				width: t === o ? 16 : 6,
				height: 6,
				borderRadius: 3,
				backgroundColor: t === o ? i.brand.primary : i.surface.tertiary
			} }, t))
		})]
	});
}
//#endregion
//#region src/native/components/SearchBar.tsx
function hr({ value: e, onChange: t, placeholder: n = "検索", onSubmit: r, onClear: i, autoFocus: a }) {
	let { theme: o, scales: s } = H();
	return /* @__PURE__ */ b(z, {
		style: {
			flexDirection: "row",
			alignItems: "center",
			gap: s.spacing.scale[2],
			paddingHorizontal: s.spacing.scale[3],
			height: 44,
			backgroundColor: o.surface.secondary,
			borderRadius: s.borderRadius.full
		},
		children: [
			/* @__PURE__ */ y(L, {
				style: [U("label.md"), { color: o.text["low-emphasis"] }],
				children: "🔍"
			}),
			/* @__PURE__ */ y(R, {
				value: e,
				onChangeText: t,
				onSubmitEditing: r,
				placeholder: n,
				placeholderTextColor: o.text["low-emphasis"],
				returnKeyType: "search",
				autoFocus: a,
				style: [U("body.md"), {
					flex: 1,
					color: o.text["high-emphasis"],
					paddingVertical: 0
				}]
			}),
			e.length > 0 && /* @__PURE__ */ y(P, {
				onPress: () => {
					t(""), i?.();
				},
				hitSlop: 8,
				children: /* @__PURE__ */ y(z, {
					style: {
						width: 20,
						height: 20,
						borderRadius: 10,
						backgroundColor: o.surface.tertiary,
						alignItems: "center",
						justifyContent: "center"
					},
					children: /* @__PURE__ */ y(L, {
						style: [U("label.xs"), { color: o.text["medium-emphasis"] }],
						children: "×"
					})
				})
			})
		]
	});
}
//#endregion
//#region src/native/components/ListItem.tsx
function gr({ leading: e, title: t, description: n, trailing: r, showChevron: i, onPress: a, disabled: o }) {
	let { theme: s, scales: c } = H(), l = (a = !1) => /* @__PURE__ */ b(z, {
		style: {
			flexDirection: "row",
			alignItems: "center",
			gap: c.spacing.scale[3],
			paddingHorizontal: c.spacing.scale[4],
			paddingVertical: c.spacing.scale[3],
			backgroundColor: a ? s.surface.secondary : s.surface.primary,
			opacity: o ? .5 : 1
		},
		children: [
			e,
			/* @__PURE__ */ b(z, {
				style: {
					flex: 1,
					gap: 2
				},
				children: [typeof t == "string" ? /* @__PURE__ */ y(L, {
					style: [U("body.md"), { color: s.text["high-emphasis"] }],
					children: t
				}) : t, n && typeof n == "string" ? /* @__PURE__ */ y(L, {
					style: [U("body.sm"), { color: s.text["medium-emphasis"] }],
					children: n
				}) : n]
			}),
			r,
			i && /* @__PURE__ */ y(L, {
				style: [U("label.md"), { color: s.text["low-emphasis"] }],
				children: "›"
			})
		]
	});
	return a ? /* @__PURE__ */ y(P, {
		disabled: o,
		onPress: a,
		children: ({ pressed: e }) => l(e)
	}) : l(!1);
}
//#endregion
//#region src/native/components/SettingsSection.tsx
function _r({ title: e, description: t, action: n, variant: r = "group", children: i, style: a, contentStyle: o }) {
	let { theme: s, scales: c } = H(), l = r === "card" || r === "danger";
	return /* @__PURE__ */ b(z, {
		style: [{ gap: c.spacing.scale[3] }, a],
		children: [(e || t || n) && /* @__PURE__ */ b(z, {
			style: {
				flexDirection: "row",
				alignItems: "flex-start",
				justifyContent: "space-between",
				gap: c.spacing.scale[3],
				paddingHorizontal: c.spacing.scale[1]
			},
			children: [/* @__PURE__ */ b(z, {
				style: {
					flex: 1,
					minWidth: 0
				},
				children: [typeof e == "string" ? /* @__PURE__ */ y(L, {
					style: [U("heading.sm"), { color: r === "danger" ? s.text.caution : s.text["high-emphasis"] }],
					children: e
				}) : e, t && (typeof t == "string" ? /* @__PURE__ */ y(L, {
					style: [U("body.sm"), {
						color: s.text["medium-emphasis"],
						marginTop: c.spacing.scale[1]
					}],
					children: t
				}) : t)]
			}), n]
		}), /* @__PURE__ */ y(z, {
			style: [l ? {
				overflow: "hidden",
				borderWidth: 1,
				borderColor: r === "danger" ? s.border.caution : s.border["low-emphasis"],
				borderRadius: c.borderRadius["2xl"],
				backgroundColor: s.surface.primary
			} : { gap: c.spacing.scale[2] }, o],
			children: i
		})]
	});
}
function vr({ title: e, description: t, leading: n, rightSlot: r, children: i, onPress: a, disabled: o = !1, destructive: s = !1, style: c }) {
	let { theme: l, scales: u } = H(), d = (a = !1) => /* @__PURE__ */ b(z, {
		style: [{
			minHeight: 56,
			flexDirection: "row",
			alignItems: "center",
			gap: u.spacing.scale[3],
			paddingHorizontal: u.spacing.scale[4],
			paddingVertical: u.spacing.scale[3],
			borderBottomWidth: 1,
			borderBottomColor: l.border["low-emphasis"],
			backgroundColor: a ? l.surface.secondary : l.surface.primary,
			opacity: o ? .5 : 1
		}, c],
		children: [
			n && /* @__PURE__ */ y(z, {
				style: {
					width: 40,
					minHeight: 40,
					alignItems: "center",
					justifyContent: "center"
				},
				children: n
			}),
			/* @__PURE__ */ b(z, {
				style: {
					flex: 1,
					minWidth: 0
				},
				children: [
					typeof e == "string" ? /* @__PURE__ */ y(L, {
						numberOfLines: 1,
						style: [U("label.md"), { color: s ? l.text.caution : l.text["high-emphasis"] }],
						children: e
					}) : e,
					t && (typeof t == "string" ? /* @__PURE__ */ y(L, {
						style: [U("body.sm"), {
							color: l.text["medium-emphasis"],
							marginTop: 2
						}],
						children: t
					}) : t),
					i
				]
			}),
			r
		]
	});
	return a ? /* @__PURE__ */ y(P, {
		disabled: o,
		onPress: a,
		accessibilityRole: "button",
		accessibilityState: { disabled: o },
		children: ({ pressed: e }) => d(e)
	}) : d(!1);
}
//#endregion
//#region src/native/components/EmptyState.tsx
function yr({ title: e, description: t, icon: n, action: r }) {
	let { theme: i, scales: a } = H();
	return /* @__PURE__ */ b(z, {
		style: {
			alignItems: "center",
			justifyContent: "center",
			padding: a.spacing.scale[8],
			gap: a.spacing.scale[3]
		},
		children: [
			n ?? /* @__PURE__ */ y(z, {
				style: {
					width: 64,
					height: 64,
					borderRadius: 32,
					backgroundColor: i.surface.secondary,
					alignItems: "center",
					justifyContent: "center"
				},
				children: /* @__PURE__ */ y(L, {
					style: {
						fontSize: 28,
						color: i.text["low-emphasis"]
					},
					children: "📭"
				})
			}),
			/* @__PURE__ */ y(L, {
				style: [U("heading.md"), {
					color: i.text["high-emphasis"],
					textAlign: "center"
				}],
				children: e
			}),
			t && /* @__PURE__ */ y(L, {
				style: [U("body.md"), {
					color: i.text["medium-emphasis"],
					textAlign: "center"
				}],
				children: t
			}),
			r
		]
	});
}
//#endregion
//#region src/native/components/ErrorState.tsx
function br({ title: e = "エラーが発生しました", description: t = "時間をおいて再度お試しください。", icon: n, action: r }) {
	let { theme: i, scales: a } = H();
	return /* @__PURE__ */ b(z, {
		style: {
			alignItems: "center",
			justifyContent: "center",
			padding: a.spacing.scale[8],
			gap: a.spacing.scale[3]
		},
		children: [
			n ?? /* @__PURE__ */ y(z, {
				style: {
					width: 64,
					height: 64,
					borderRadius: 32,
					backgroundColor: i.surface.caution,
					alignItems: "center",
					justifyContent: "center"
				},
				children: /* @__PURE__ */ y(L, {
					style: {
						fontSize: 28,
						color: i.text.caution
					},
					children: "!"
				})
			}),
			/* @__PURE__ */ y(L, {
				style: [U("heading.md"), {
					color: i.text["high-emphasis"],
					textAlign: "center"
				}],
				children: e
			}),
			/* @__PURE__ */ y(L, {
				style: [U("body.md"), {
					color: i.text["medium-emphasis"],
					textAlign: "center"
				}],
				children: t
			}),
			r
		]
	});
}
//#endregion
//#region src/native/components/IconBadge.tsx
var xr = {
	md: {
		color: "",
		size: 20
	},
	ml: {
		color: "",
		size: 24
	},
	lg: {
		color: "",
		size: 38
	}
}, Sr = {
	md: 44,
	ml: 48,
	lg: 72
};
function Cr({ size: e = "md", children: t, style: n, accessibilityLabel: r, ...i }) {
	let { theme: a } = H(), o = Sr[e], s = {
		...xr[e],
		color: a.object["accent-primary"]
	};
	return /* @__PURE__ */ y(z, {
		accessibilityElementsHidden: !r,
		importantForAccessibility: r ? "yes" : "no-hide-descendants",
		accessible: !!r,
		accessibilityLabel: r,
		style: [{
			width: o,
			height: o,
			borderRadius: o / 2,
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: a.surface["accent-primary-light"]
		}, n],
		...i,
		children: typeof t == "function" ? t(s) : t
	});
}
//#endregion
//#region src/native/components/SectionHeader.tsx
function wr({ title: e, description: t, action: n, variant: r = "default" }) {
	let { theme: i, scales: a } = H();
	return /* @__PURE__ */ b(z, {
		style: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			paddingHorizontal: a.spacing.scale[4],
			paddingVertical: a.spacing.scale[2],
			gap: a.spacing.scale[2]
		},
		children: [/* @__PURE__ */ b(z, {
			style: { flex: 1 },
			children: [/* @__PURE__ */ y(L, {
				style: [U(r === "subtle" ? "label.md" : "heading.md"), { color: i.text["high-emphasis"] }],
				children: e
			}), t && /* @__PURE__ */ y(L, {
				style: [U("body.sm"), {
					color: i.text["medium-emphasis"],
					marginTop: 2
				}],
				children: t
			})]
		}), n && /* @__PURE__ */ y(P, {
			onPress: n.onPress,
			hitSlop: 8,
			style: ({ pressed: e }) => ({
				paddingVertical: a.spacing.scale[1],
				paddingHorizontal: a.spacing.scale[2],
				borderRadius: a.borderRadius.md,
				opacity: e ? .6 : 1
			}),
			children: /* @__PURE__ */ b(L, {
				style: [U("label.md"), { color: i.text["accent-primary"] }],
				children: [n.label, " ›"]
			})
		})]
	});
}
//#endregion
//#region src/native/components/StickyActionBar.tsx
function Tr({ children: e }) {
	let { theme: t, scales: n } = H();
	return /* @__PURE__ */ y(z, {
		style: {
			flexDirection: "row",
			gap: n.spacing.scale[2],
			padding: n.spacing.scale[4],
			paddingBottom: N.OS === "ios" ? 32 : n.spacing.scale[4],
			backgroundColor: t.surface.primary,
			borderTopWidth: 1,
			borderTopColor: t.border["low-emphasis"]
		},
		children: e
	});
}
//#endregion
//#region src/native/components/SwipeRow.tsx
function Er({ rightActions: e = [], actionWidth: t = 80, children: n }) {
	let { theme: r } = H(), [i] = _(() => new C.Value(0)), a = e.length * t, [o] = _(() => M.create({
		onMoveShouldSetPanResponder: (e, t) => Math.abs(t.dx) > 8,
		onPanResponderMove: (e, t) => {
			let n = Math.min(0, Math.max(-a, t.dx));
			i.setValue(n);
		},
		onPanResponderRelease: (e, t) => {
			let n = t.dx < -a / 2;
			C.spring(i, {
				toValue: n ? -a : 0,
				useNativeDriver: !0
			}).start();
		}
	}));
	return /* @__PURE__ */ b(z, {
		style: {
			position: "relative",
			overflow: "hidden"
		},
		children: [/* @__PURE__ */ y(z, {
			style: {
				position: "absolute",
				top: 0,
				right: 0,
				bottom: 0,
				flexDirection: "row"
			},
			children: e.map((e, n) => /* @__PURE__ */ y(P, {
				onPress: () => {
					C.spring(i, {
						toValue: 0,
						useNativeDriver: !0
					}).start(), e.onPress();
				},
				style: {
					width: t,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: e.color ?? r.caution.base
				},
				children: /* @__PURE__ */ y(L, {
					style: [U("label.md"), { color: e.textColor ?? r.text["on-inverse"] }],
					children: e.label
				})
			}, n))
		}), /* @__PURE__ */ y(C.View, {
			style: {
				transform: [{ translateX: i }],
				backgroundColor: r.surface.primary
			},
			...o.panHandlers,
			children: n
		})]
	});
}
//#endregion
//#region src/native/components/Footer.tsx
function Dr({ copyright: e, links: t = [] }) {
	let { theme: n, scales: r } = H();
	return /* @__PURE__ */ b(z, {
		style: {
			backgroundColor: n.surface.secondary,
			padding: r.spacing.scale[4],
			gap: r.spacing.scale[2]
		},
		children: [/* @__PURE__ */ y(z, {
			style: {
				flexDirection: "row",
				flexWrap: "wrap",
				gap: r.spacing.scale[3]
			},
			children: t.map((e, t) => /* @__PURE__ */ y(P, {
				onPress: e.onPress,
				children: /* @__PURE__ */ y(L, {
					style: [U("label.sm"), { color: n.text["medium-emphasis"] }],
					children: e.label
				})
			}, t))
		}), e && /* @__PURE__ */ y(L, {
			style: [U("body.sm"), { color: n.text["low-emphasis"] }],
			children: e
		})]
	});
}
//#endregion
//#region src/native/components/FileUpload.tsx
function Or({ title: e = "ファイルを選択", description: t = "タップしてアップロード", onPress: n, disabled: r = !1 }) {
	let { theme: i, scales: a } = H();
	return /* @__PURE__ */ b(P, {
		onPress: n,
		disabled: r,
		style: ({ pressed: e }) => ({
			borderWidth: 2,
			borderStyle: "dashed",
			borderColor: e ? i.brand.primary : i.border["medium-emphasis"],
			borderRadius: a.borderRadius.lg,
			padding: a.spacing.scale[6],
			alignItems: "center",
			justifyContent: "center",
			gap: a.spacing.scale[1],
			backgroundColor: e ? i.surface.secondary : i.surface.primary,
			opacity: r ? .5 : 1
		}),
		children: [
			/* @__PURE__ */ y(L, {
				style: {
					fontSize: 28,
					color: i.text["low-emphasis"]
				},
				children: "📤"
			}),
			/* @__PURE__ */ y(L, {
				style: [U("label.md"), { color: i.text["high-emphasis"] }],
				children: e
			}),
			/* @__PURE__ */ y(L, {
				style: [U("body.sm"), { color: i.text["medium-emphasis"] }],
				children: t
			})
		]
	});
}
//#endregion
//#region src/native/components/Screen.tsx
function kr(e, t) {
	if (e !== "none") return {
		paddingHorizontal: t.scale[6],
		paddingVertical: t.scale[6]
	};
}
function Ar({ children: e, footer: t, header: n, scroll: r = !0, padding: i = "page", style: a, bodyStyle: o, headerStyle: s, footerStyle: c, contentContainerStyle: l }) {
	let { theme: u, scales: d } = H(), f = [{
		flex: 1,
		minHeight: 0,
		backgroundColor: u.surface.primary
	}, o], p = [kr(i, d.spacing), l];
	return /* @__PURE__ */ b(z, {
		style: [{
			flex: 1,
			minHeight: 0,
			overflow: "hidden",
			backgroundColor: u.surface.primary
		}, a],
		children: [
			n && /* @__PURE__ */ y(z, {
				style: [{ flexShrink: 0 }, s],
				children: n
			}),
			r ? /* @__PURE__ */ y(F, {
				style: f,
				contentContainerStyle: p,
				keyboardShouldPersistTaps: "handled",
				children: e
			}) : /* @__PURE__ */ y(z, {
				style: [
					f,
					kr(i, d.spacing),
					l
				],
				children: e
			}),
			t && /* @__PURE__ */ y(z, {
				style: [{
					flexShrink: 0,
					backgroundColor: u.surface.primary,
					paddingHorizontal: d.spacing.scale[6],
					paddingTop: d.spacing.scale[3],
					paddingBottom: d.spacing.scale[4]
				}, c],
				children: t
			})
		]
	});
}
//#endregion
//#region src/native/components/Prose.tsx
function jr({ sections: e }) {
	let { theme: t, scales: n } = H();
	return /* @__PURE__ */ y(z, {
		style: { gap: n.spacing.scale[6] },
		children: e.map((e, r) => /* @__PURE__ */ b(z, {
			style: { gap: n.spacing.scale[2] },
			children: [/* @__PURE__ */ y(L, {
				style: [U("heading.md"), { color: t.text["high-emphasis"] }],
				children: e.title
			}), e.body.map((e, n) => /* @__PURE__ */ y(L, {
				style: [U("body.md"), { color: t.text["medium-emphasis"] }],
				children: e
			}, n))]
		}, r))
	});
}
//#endregion
//#region src/native/components/DocumentScreen.tsx
function Mr({ title: e, lastUpdated: t, onBack: n, children: r }) {
	let { theme: i, scales: a } = H();
	return /* @__PURE__ */ b(Ar, {
		header: n ? /* @__PURE__ */ y(sr, {
			onBack: n,
			centered: !1
		}) : void 0,
		children: [/* @__PURE__ */ b(z, {
			style: { gap: a.spacing.scale[1] },
			children: [/* @__PURE__ */ y(L, {
				style: [U("heading.2xl"), { color: i.text["high-emphasis"] }],
				children: e
			}), t && /* @__PURE__ */ b(L, {
				style: [U("prose-meta"), { color: i.text["low-emphasis"] }],
				children: ["最終更新日：", t]
			})]
		}), /* @__PURE__ */ y(z, {
			style: { marginTop: a.spacing.scale[6] },
			children: r
		})]
	});
}
//#endregion
//#region src/native/components/PhotoHero.tsx
function Nr(e) {
	return typeof e == "string" ? { uri: e } : e;
}
function Pr(e, t) {
	return e === "none" ? "transparent" : e === "dark" ? t.surface["videoOverlay-strong"] : t.surface["videoOverlay-medium"];
}
function Fr({ src: e, alt: t = "", overlay: n = "medium", align: r = "bottom", children: i, style: a, imageStyle: o, contentStyle: s }) {
	let { theme: c, scales: l } = H(), u = r === "center" ? "center" : "flex-end";
	return /* @__PURE__ */ b(O, {
		source: Nr(e),
		accessibilityIgnoresInvertColors: !0,
		accessibilityLabel: t || void 0,
		style: [{
			flex: 1,
			minHeight: "100%",
			backgroundColor: c.surface.inverse,
			overflow: "hidden"
		}, a],
		imageStyle: o,
		resizeMode: "cover",
		children: [/* @__PURE__ */ y(z, {
			pointerEvents: "none",
			style: {
				position: "absolute",
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
				backgroundColor: Pr(n, c)
			}
		}), /* @__PURE__ */ y(z, {
			style: [{
				flex: 1,
				justifyContent: u,
				paddingHorizontal: l.spacing.scale[6],
				paddingTop: l.spacing.scale[15],
				paddingBottom: l.spacing.scale[15]
			}, s],
			children: /* @__PURE__ */ y(z, {
				style: { gap: l.spacing.scale[4] },
				children: i
			})
		})]
	});
}
function Ir({ children: e, style: t, numberOfLines: n }) {
	let { theme: r } = H();
	return /* @__PURE__ */ y(L, {
		numberOfLines: n,
		style: [
			U("label.sm"),
			{ color: r.text["on-media-secondary"] },
			t
		],
		children: e
	});
}
function Lr({ children: e, style: t, numberOfLines: n }) {
	let { theme: r } = H();
	return /* @__PURE__ */ y(L, {
		numberOfLines: n,
		style: [
			U("heading.2xl"),
			{ color: r.text["on-media"] },
			t
		],
		children: e
	});
}
function Rr({ children: e, style: t, numberOfLines: n }) {
	let { theme: r } = H();
	return /* @__PURE__ */ y(L, {
		numberOfLines: n,
		style: [
			U("body.md"),
			{ color: r.text["on-media-secondary"] },
			t
		],
		children: e
	});
}
function zr({ children: e, style: t }) {
	let { scales: n } = H();
	return /* @__PURE__ */ y(z, {
		style: [{
			gap: n.spacing.scale[3],
			marginTop: n.spacing.scale[2]
		}, t],
		children: e
	});
}
var Br = Object.assign(Fr, {
	Eyebrow: Ir,
	Title: Lr,
	Body: Rr,
	Actions: zr
}), Vr = {
	"top-left": {
		top: 16,
		left: 16
	},
	"top-right": {
		top: 16,
		right: 16
	},
	"bottom-left": {
		bottom: 16,
		left: 16
	},
	"bottom-right": {
		bottom: 16,
		right: 16
	},
	"center-left": {
		top: "50%",
		left: 16,
		transform: [{ translateY: -48 }]
	},
	"center-right": {
		top: "50%",
		right: 16,
		transform: [{ translateY: -48 }]
	}
};
function Hr(e) {
	return typeof e == "number" && e > 99 ? "99+" : e;
}
function Ur(e, t) {
	let n = e === "horizontal" ? "row" : "column";
	return t === "side" ? {
		clusterDirection: n,
		itemDirection: "row"
	} : t === "below" ? {
		clusterDirection: n,
		itemDirection: "column"
	} : {
		clusterDirection: n,
		itemDirection: e === "horizontal" ? "row" : "column"
	};
}
function Wr({ items: e, orientation: t = "vertical", anchor: n = "bottom-right", position: r = "absolute", labelPosition: i = "auto", autoHideMs: a = 5e3, defaultVisible: o = !0, onVisibleChange: s, accessibilityLabel: c = "メディアアクション", style: u }) {
	let { scales: d } = H(), [f, p] = l.useState(o), m = l.useRef(null), h = a != null && a > 0, { clusterDirection: g, itemDirection: _ } = Ur(t, i), v = l.useCallback(() => {
		m.current && clearTimeout(m.current), m.current = null;
	}, []), b = l.useCallback((e) => {
		p((t) => (t !== e && s?.(e), e));
	}, [s]), x = l.useCallback(() => {
		v(), h && (m.current = setTimeout(() => b(!1), a));
	}, [
		h,
		a,
		v,
		b
	]), S = l.useCallback(() => {
		b(!0), x();
	}, [x, b]);
	return l.useEffect(() => {
		if (!h) {
			v(), b(!0);
			return;
		}
		return x(), v;
	}, [
		h,
		v,
		x,
		b
	]), /* @__PURE__ */ y(z, {
		accessibilityRole: "toolbar",
		accessibilityLabel: c,
		style: [
			r === "relative" ? void 0 : {
				position: "absolute",
				zIndex: 40,
				...Vr[n]
			},
			{
				flexDirection: g,
				alignItems: "center",
				gap: d.spacing.scale[3],
				opacity: f ? 1 : .4
			},
			u
		],
		children: e.map((e, t) => /* @__PURE__ */ y(Gr, {
			item: e,
			itemDirection: _,
			onReveal: S
		}, e.id ?? `${e.label}-${t}`))
	});
}
function Gr({ item: e, itemDirection: t, onReveal: n }) {
	let { theme: r, scales: i } = H();
	return /* @__PURE__ */ b(P, {
		disabled: e.disabled,
		onPress: () => {
			n(), !e.disabled && (e.onPress?.(), e.onClick?.(), e.href && A.openURL(e.href));
		},
		accessibilityRole: "button",
		accessibilityLabel: e.accessibilityLabel ?? e.ariaLabel ?? e.label,
		accessibilityState: {
			disabled: e.disabled,
			selected: e.active
		},
		style: ({ pressed: n }) => ({
			minWidth: i.touchTargets.iconButton.min,
			minHeight: i.touchTargets.iconButton.min,
			flexDirection: t,
			alignItems: "center",
			justifyContent: "center",
			gap: i.spacing.scale[1],
			opacity: e.disabled ? .5 : 1,
			transform: [{ scale: n && !e.disabled ? .96 : 1 }]
		}),
		children: [/* @__PURE__ */ b(ce, {
			tint: "dark",
			intensity: "regular",
			borderRadius: i.borderRadius.full,
			style: {
				width: 48,
				height: 48,
				alignItems: "center",
				justifyContent: "center",
				borderWidth: e.active ? 2 : 1,
				borderColor: e.active ? r.border["accent-primary"] : r.text["on-media-secondary"]
			},
			children: [e.icon, e.badge != null && /* @__PURE__ */ y(z, {
				style: {
					position: "absolute",
					top: -4,
					right: -4,
					minWidth: 20,
					height: 20,
					borderRadius: 10,
					paddingHorizontal: 4,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: r.surface["caution-strong"]
				},
				children: /* @__PURE__ */ y(L, {
					style: [U("label.xs"), { color: r.text["on-media"] }],
					children: Hr(e.badge)
				})
			})]
		}), /* @__PURE__ */ y(L, {
			numberOfLines: 1,
			style: [U("label.xs"), {
				maxWidth: 96,
				color: r.text["on-media"],
				textAlign: "center"
			}],
			children: e.label
		})]
	});
}
//#endregion
//#region src/native/components/CompactFilePicker.tsx
function Kr({ label: e = "ファイル", description: t, triggerLabel: n = "選択する", icon: r, loading: i = !1, disabled: a = !1, onPress: o, style: s }) {
	let { theme: c, scales: l } = H(), u = a || i;
	return /* @__PURE__ */ b(P, {
		disabled: u,
		onPress: o,
		accessibilityRole: "button",
		accessibilityState: {
			disabled: u,
			busy: i
		},
		style: [{
			minHeight: 56,
			flexDirection: "row",
			alignItems: "center",
			gap: l.spacing.scale[3],
			opacity: u ? .5 : 1
		}, s],
		children: [
			/* @__PURE__ */ y(z, {
				style: {
					width: 40,
					height: 40,
					alignItems: "center",
					justifyContent: "center",
					borderRadius: l.borderRadius.lg,
					backgroundColor: c.surface.secondary
				},
				children: r ?? /* @__PURE__ */ y(L, {
					style: [U("heading.md"), { color: c.text["medium-emphasis"] }],
					children: "＋"
				})
			}),
			/* @__PURE__ */ b(z, {
				style: {
					flex: 1,
					minWidth: 0
				},
				children: [typeof e == "string" ? /* @__PURE__ */ y(L, {
					numberOfLines: 1,
					style: [U("label.md"), { color: c.text["high-emphasis"] }],
					children: e
				}) : e, t && (typeof t == "string" ? /* @__PURE__ */ y(L, {
					style: [U("body.sm"), {
						color: c.text["medium-emphasis"],
						marginTop: 2
					}],
					children: t
				}) : t)]
			}),
			/* @__PURE__ */ y(q, {
				variant: "secondary",
				disabled: u,
				loading: i,
				onPress: o,
				children: n
			})
		]
	});
}
function qr({ images: e = [], onRemove: t, removeLabel: n = (e) => `${e.name ?? "画像"}を削除`, previewVariant: r = "grid", label: i = "画像", description: a = "JPG / PNG / WebP", triggerLabel: o = "画像を追加", ...s }) {
	let { theme: c, scales: l } = H();
	return /* @__PURE__ */ b(z, {
		style: { gap: l.spacing.scale[3] },
		children: [/* @__PURE__ */ y(Kr, {
			...s,
			label: i,
			description: a,
			triggerLabel: o
		}), e.length > 0 && /* @__PURE__ */ y(z, {
			style: {
				flexDirection: r === "grid" ? "row" : "column",
				flexWrap: r === "grid" ? "wrap" : "nowrap",
				gap: l.spacing.scale[2]
			},
			children: e.map((e) => /* @__PURE__ */ b(z, {
				style: {
					width: r === "grid" ? "31%" : "100%",
					flexDirection: r === "list" ? "row" : "column",
					alignItems: r === "list" ? "center" : "stretch",
					gap: l.spacing.scale[2],
					padding: r === "list" ? l.spacing.scale[2] : 0,
					borderWidth: 1,
					borderColor: c.border["low-emphasis"],
					borderRadius: l.borderRadius.xl,
					overflow: "hidden",
					backgroundColor: c.surface.primary
				},
				children: [
					/* @__PURE__ */ y(D, {
						source: e.source ?? { uri: e.uri ?? "" },
						accessibilityLabel: e.alt ?? e.name,
						style: {
							width: r === "list" ? 56 : "100%",
							aspectRatio: 1,
							borderRadius: r === "list" ? l.borderRadius.lg : 0
						}
					}),
					r === "list" && /* @__PURE__ */ y(L, {
						numberOfLines: 1,
						style: [U("label.sm"), {
							color: c.text["high-emphasis"],
							flex: 1
						}],
						children: e.name ?? e.alt ?? "画像"
					}),
					t && /* @__PURE__ */ y(q, {
						variant: "tertiary",
						disabled: s.disabled,
						accessibilityLabel: n(e),
						onPress: () => t(e.id),
						children: "削除"
					})
				]
			}, e.id))
		})]
	});
}
//#endregion
//#region src/native/components/QuickActionGrid.tsx
function Jr(e, t) {
	switch (e) {
		case "selected": return {
			borderColor: t.brand.primary,
			backgroundColor: t.surface["accent-primary-light"]
		};
		case "success": return {
			borderColor: t.border.success,
			backgroundColor: t.surface["success-subtle"]
		};
		case "info": return {
			borderColor: t.border.info,
			backgroundColor: t.surface["info-subtle"]
		};
		case "caution": return {
			borderColor: t.border.caution,
			backgroundColor: t.surface["caution-subtle"]
		};
		default: return {
			borderColor: t.border["low-emphasis"],
			backgroundColor: t.surface.primary
		};
	}
}
function Yr({ icon: e, emoji: t, label: n, description: r, meta: i, selected: a = !1, loading: o = !1, disabled: s = !1, variant: c = a ? "selected" : "neutral", onPress: l, style: u }) {
	let { theme: d, scales: f } = H(), p = s || o, m = Jr(c, d);
	return /* @__PURE__ */ b(P, {
		onPress: l,
		disabled: p,
		accessibilityRole: "button",
		accessibilityState: {
			disabled: p,
			selected: a,
			busy: o
		},
		style: ({ pressed: e }) => [{
			minHeight: 96,
			borderWidth: 1,
			borderRadius: f.borderRadius.xl,
			padding: f.spacing.scale[3],
			gap: f.spacing.scale[3],
			justifyContent: "space-between",
			opacity: p ? .5 : 1,
			...m,
			backgroundColor: e ? d.surface.secondary : m.backgroundColor
		}, u],
		children: [/* @__PURE__ */ b(z, {
			style: {
				flexDirection: "row",
				alignItems: "flex-start",
				justifyContent: "space-between",
				gap: f.spacing.scale[2]
			},
			children: [/* @__PURE__ */ b(z, {
				style: {
					flex: 1,
					minWidth: 0,
					flexDirection: "row",
					alignItems: "center",
					gap: f.spacing.scale[2]
				},
				children: [
					t && /* @__PURE__ */ y(L, {
						style: U("heading.md"),
						children: t
					}),
					e,
					typeof n == "string" ? /* @__PURE__ */ y(L, {
						numberOfLines: 1,
						style: [U("label.md"), {
							color: d.text["high-emphasis"],
							flex: 1
						}],
						children: n
					}) : n
				]
			}), o && /* @__PURE__ */ y(ze, { size: "sm" })]
		}), (r || i) && /* @__PURE__ */ b(z, {
			style: {
				flexDirection: "row",
				alignItems: "flex-end",
				justifyContent: "space-between",
				gap: f.spacing.scale[2]
			},
			children: [typeof r == "string" ? /* @__PURE__ */ y(L, {
				style: [U("body.sm"), {
					color: d.text["medium-emphasis"],
					flex: 1
				}],
				children: r
			}) : r, typeof i == "string" ? /* @__PURE__ */ y(L, {
				style: [U("label.sm"), { color: d.text["low-emphasis"] }],
				children: i
			}) : i]
		})]
	});
}
function Xr({ columns: e = 3, gap: t = 12, children: n, style: r }) {
	return /* @__PURE__ */ y(z, {
		style: [{
			flexDirection: "row",
			flexWrap: "wrap",
			gap: t
		}, r],
		children: l.Children.map(n, (n) => /* @__PURE__ */ y(z, {
			style: {
				width: `${100 / e}%`,
				paddingRight: t
			},
			children: n
		}))
	});
}
//#endregion
//#region src/native/components/ChipSelector.tsx
function Zr({ options: e, values: t = [], onChange: n, multiple: r = !0 }) {
	let { scales: i } = H(), a = (e) => {
		r ? n?.(t.includes(e) ? t.filter((t) => t !== e) : [...t, e]) : n?.(t.includes(e) ? [] : [e]);
	};
	return /* @__PURE__ */ y(z, {
		style: {
			flexDirection: "row",
			flexWrap: "wrap",
			gap: i.spacing.scale[2]
		},
		children: e.map((e) => /* @__PURE__ */ y(Le, {
			selected: t.includes(e.value),
			disabled: e.disabled,
			count: e.count,
			onPress: () => a(e.value),
			children: e.label
		}, e.value))
	});
}
//#endregion
//#region src/native/components/CollapsibleChipField.tsx
var Qr = 80, $r = 36;
function ei({ icon: e, label: t, options: n, selected: r, onSelect: i, onClear: a, getLabel: o, getIcon: s, alwaysExpanded: c = !1 }) {
	let { theme: u, scales: d } = H(), f = r != null && r !== "", [p, m] = l.useState(!1);
	l.useEffect(() => {
		m(!1);
	}, [r]);
	let h = f && n.includes(r), g = c || !h || p ? n : n.filter((e) => e === r), _ = t ? /* @__PURE__ */ y(L, {
		style: [U("label.sm"), {
			color: u.text["medium-emphasis"],
			width: Qr,
			lineHeight: $r
		}],
		numberOfLines: 1,
		children: t
	}) : /* @__PURE__ */ y(z, {
		style: {
			width: 24,
			height: $r,
			alignItems: "center",
			justifyContent: "center"
		},
		children: e
	});
	return /* @__PURE__ */ b(z, {
		style: {
			flexDirection: "row",
			alignItems: "flex-start",
			gap: d.spacing.scale[4],
			paddingVertical: d.spacing.scale[3]
		},
		children: [_, /* @__PURE__ */ y(z, {
			style: {
				flex: 1,
				flexDirection: "row",
				flexWrap: "wrap",
				gap: d.spacing.scale[2],
				minHeight: $r,
				alignItems: "center"
			},
			children: g.map((e) => /* @__PURE__ */ b(Le, {
				size: "md",
				selected: !p && r === e,
				onPress: () => {
					p ? (i(e), m(!1)) : r === e ? a ? a() : c || m(!0) : i(e);
				},
				children: [s ? `${s(e)} ` : "", o(e)]
			}, e))
		})]
	});
}
//#endregion
//#region src/native/components/ChipFilterBar.tsx
var ti = (e) => `${e.toLocaleString()}件`;
function ni({ children: e, resultCount: t, resultCountLabel: n = ti }) {
	let { theme: r, scales: i } = H();
	return /* @__PURE__ */ b(z, { children: [/* @__PURE__ */ y(F, {
		horizontal: !0,
		showsHorizontalScrollIndicator: !1,
		contentContainerStyle: { gap: i.spacing.scale[2] },
		children: e
	}), t !== void 0 && /* @__PURE__ */ y(L, {
		style: [U("label.xs"), {
			color: r.text["low-emphasis"],
			marginTop: i.spacing.scale[2]
		}],
		children: n(t)
	})] });
}
//#endregion
//#region src/native/components/CategoryNav.tsx
function ri({ items: e, value: t, onChange: n }) {
	let { theme: r, scales: i } = H();
	return /* @__PURE__ */ y(F, {
		horizontal: !0,
		showsHorizontalScrollIndicator: !1,
		contentContainerStyle: {
			gap: i.spacing.scale[3],
			paddingHorizontal: i.spacing.scale[4],
			paddingVertical: i.spacing.scale[2]
		},
		children: e.map((e) => {
			let a = t === e.key;
			return /* @__PURE__ */ b(P, {
				onPress: () => n?.(e.key),
				style: {
					alignItems: "center",
					gap: i.spacing.scale[1],
					width: 64
				},
				children: [/* @__PURE__ */ y(z, {
					style: {
						width: 56,
						height: 56,
						borderRadius: 28,
						backgroundColor: a ? r.brand.primary : r.surface.secondary,
						alignItems: "center",
						justifyContent: "center"
					},
					children: e.icon
				}), /* @__PURE__ */ y(L, {
					numberOfLines: 1,
					style: [U("label.xs"), { color: a ? r.text["accent-primary"] : r.text["medium-emphasis"] }],
					children: e.label
				})]
			}, e.key);
		})
	});
}
//#endregion
//#region src/native/components/CategoryScroll.tsx
function ii({ items: e, value: t, onChange: n }) {
	let { theme: r, scales: i } = H();
	return /* @__PURE__ */ y(F, {
		horizontal: !0,
		showsHorizontalScrollIndicator: !1,
		contentContainerStyle: {
			gap: i.spacing.scale[2],
			paddingHorizontal: i.spacing.scale[4],
			paddingVertical: i.spacing.scale[2]
		},
		children: e.map((e) => {
			let a = t === e.key;
			return /* @__PURE__ */ b(P, {
				onPress: () => n?.(e.key),
				style: ({ pressed: e }) => ({
					flexDirection: "row",
					alignItems: "center",
					gap: 4,
					paddingHorizontal: i.spacing.scale[3],
					height: 36,
					borderRadius: i.borderRadius.full,
					backgroundColor: a ? r.brand.primary : e ? r.surface.tertiary : r.surface.secondary
				}),
				children: [/* @__PURE__ */ y(L, {
					style: [U("label.sm"), {
						color: a ? r.text["on-inverse"] : r.text["high-emphasis"],
						fontWeight: a ? "700" : "500"
					}],
					children: e.label
				}), e.count !== void 0 && /* @__PURE__ */ y(z, {
					style: {
						paddingHorizontal: 6,
						borderRadius: 999,
						backgroundColor: a ? r.surface.primary : r.surface.tertiary,
						minWidth: 20,
						alignItems: "center"
					},
					children: /* @__PURE__ */ y(L, {
						style: [U("label.xs"), { color: a ? r.text["accent-primary"] : r.text["medium-emphasis"] }],
						children: e.count
					})
				})]
			}, e.key);
		})
	});
}
//#endregion
//#region src/native/components/ProgressSteps.tsx
function ai({ steps: e, current: t }) {
	let { theme: n } = H();
	return /* @__PURE__ */ y(z, {
		style: {
			flexDirection: "row",
			alignItems: "flex-start",
			gap: 0
		},
		children: e.map((r, i) => {
			let a = i < t, o = i === t, s = a || o;
			return /* @__PURE__ */ b(l.Fragment, { children: [/* @__PURE__ */ b(z, {
				style: {
					alignItems: "center",
					flex: 1
				},
				children: [/* @__PURE__ */ y(z, {
					style: {
						width: 28,
						height: 28,
						borderRadius: 14,
						backgroundColor: s ? n.brand.primary : n.surface.tertiary,
						alignItems: "center",
						justifyContent: "center",
						borderWidth: 2,
						borderColor: o ? n.border["accent-primary"] : "transparent"
					},
					children: /* @__PURE__ */ y(L, {
						style: [U("label.xs"), {
							color: s ? n.text["on-inverse"] : n.text["medium-emphasis"],
							fontWeight: "700"
						}],
						children: a ? "✓" : i + 1
					})
				}), /* @__PURE__ */ y(L, {
					style: [U("label.xs"), {
						color: s ? n.text["accent-primary"] : n.text["medium-emphasis"],
						marginTop: 4,
						textAlign: "center"
					}],
					children: r.label
				})]
			}), i < e.length - 1 && /* @__PURE__ */ y(z, { style: {
				flex: .5,
				height: 2,
				backgroundColor: a ? n.brand.primary : n.border["low-emphasis"],
				marginTop: 13
			} })] }, r.key);
		})
	});
}
//#endregion
//#region src/native/components/TagInput.tsx
function oi({ value: e = [], onChange: t, placeholder: n = "タグを入力", maxTags: r = 10 }) {
	let { theme: i, scales: a } = H(), [o, s] = _(""), c = () => {
		let n = o.trim();
		if (n) {
			if (e.includes(n)) {
				s("");
				return;
			}
			e.length >= r || (t?.([...e, n]), s(""));
		}
	}, l = (n) => {
		t?.(e.filter((e) => e !== n));
	};
	return /* @__PURE__ */ b(z, {
		style: {
			flexDirection: "row",
			flexWrap: "wrap",
			gap: a.spacing.scale[1],
			padding: a.spacing.scale[2],
			borderRadius: a.borderRadius.md,
			borderWidth: 1,
			borderColor: i.border["medium-emphasis"],
			backgroundColor: i.surface.primary
		},
		children: [e.map((e) => /* @__PURE__ */ b(z, {
			style: {
				flexDirection: "row",
				alignItems: "center",
				gap: 4,
				paddingLeft: a.spacing.scale[2],
				paddingRight: 4,
				height: 28,
				borderRadius: a.borderRadius.full,
				backgroundColor: i.surface["accent-primary-light"]
			},
			children: [/* @__PURE__ */ y(L, {
				style: [U("label.sm"), { color: i.text["accent-primary"] }],
				children: e
			}), /* @__PURE__ */ y(P, {
				onPress: () => l(e),
				hitSlop: 6,
				children: /* @__PURE__ */ y(L, {
					style: [U("label.sm"), { color: i.text["accent-primary"] }],
					children: "×"
				})
			})]
		}, e)), /* @__PURE__ */ y(R, {
			value: o,
			onChangeText: s,
			onSubmitEditing: c,
			onBlur: c,
			placeholder: e.length === 0 ? n : "",
			placeholderTextColor: i.text["low-emphasis"],
			returnKeyType: "done",
			style: [U("body.md"), {
				minWidth: 100,
				flex: 1,
				color: i.text["high-emphasis"],
				paddingVertical: 4,
				paddingHorizontal: 4
			}]
		})]
	});
}
//#endregion
//#region src/native/components/ShareButtons.tsx
function si({ message: e, url: t, title: n, extra: r = [] }) {
	let { theme: i, scales: a } = H(), o = [{
		label: "共有",
		onPress: async () => {
			try {
				await I.share({
					message: [e, t].filter(Boolean).join(" "),
					title: n,
					url: t
				});
			} catch {}
		}
	}, ...r];
	return /* @__PURE__ */ y(z, {
		style: {
			flexDirection: "row",
			flexWrap: "wrap",
			gap: a.spacing.scale[2]
		},
		children: o.map((e, t) => /* @__PURE__ */ y(P, {
			onPress: e.onPress,
			style: ({ pressed: e }) => ({
				flexDirection: "row",
				alignItems: "center",
				gap: a.spacing.scale[1],
				paddingHorizontal: a.spacing.scale[3],
				height: 40,
				borderRadius: a.borderRadius.full,
				backgroundColor: e ? i.active["secondary-button"] : i.surface["accent-primary-light"]
			}),
			children: /* @__PURE__ */ y(L, {
				style: [U("label.sm"), { color: i.text["accent-primary"] }],
				children: e.label
			})
		}, t))
	});
}
//#endregion
//#region src/native/components/FilterChip.tsx
function ci(e) {
	return /* @__PURE__ */ y(Le, {
		...e,
		shape: "pill",
		variant: "filled"
	});
}
//#endregion
//#region src/native/components/PresenceIndicator.tsx
function li(e) {
	let t = e.trim();
	return t ? t.slice(0, 1).toUpperCase() : "?";
}
function ui({ name: e, statusText: t, badgeLabel: n, online: r = !0 }) {
	let { theme: i, scales: a } = H();
	return /* @__PURE__ */ b(z, {
		accessibilityRole: "text",
		accessibilityLabel: t ? `${e}: ${t}` : e,
		style: {
			flexDirection: "row",
			alignItems: "center",
			gap: a.spacing.scale[1],
			borderRadius: a.borderRadius.full,
			borderWidth: 1,
			borderColor: i.border["low-emphasis"],
			backgroundColor: i.surface.primary,
			paddingVertical: a.spacing.scale[1],
			paddingHorizontal: a.spacing.scale[2]
		},
		children: [
			/* @__PURE__ */ b(z, { children: [/* @__PURE__ */ y(Pe, {
				fallback: li(e),
				size: "sm"
			}), /* @__PURE__ */ y(z, { style: {
				position: "absolute",
				right: -1,
				bottom: -1,
				width: 8,
				height: 8,
				borderRadius: 4,
				borderWidth: 1,
				borderColor: i.surface.primary,
				backgroundColor: r ? i.object.success : i.object["low-emphasis"]
			} })] }),
			t ? /* @__PURE__ */ y(L, {
				style: [U("caption"), { color: i.text["medium-emphasis"] }],
				numberOfLines: 1,
				children: t
			}) : null,
			n ? /* @__PURE__ */ y(we, {
				tone: "success",
				children: n
			}) : null
		]
	});
}
//#endregion
//#region src/native/components/ImageGallery.tsx
function di({ images: e, initialIndex: t = 0, thumbnailSize: n = 80 }) {
	let { theme: r, scales: i } = H(), [a, o] = _({
		open: !1,
		index: t
	}), s = w.get("window").width;
	return /* @__PURE__ */ b(v, { children: [/* @__PURE__ */ y(E, {
		data: e,
		horizontal: !0,
		showsHorizontalScrollIndicator: !1,
		contentContainerStyle: { gap: i.spacing.scale[2] },
		keyExtractor: (e, t) => String(t),
		renderItem: ({ item: e, index: t }) => /* @__PURE__ */ y(P, {
			onPress: () => o({
				open: !0,
				index: t
			}),
			children: /* @__PURE__ */ y(D, {
				source: e,
				style: {
					width: n,
					height: n,
					borderRadius: i.borderRadius.md,
					backgroundColor: r.surface.tertiary
				}
			})
		})
	}), /* @__PURE__ */ y(j, {
		visible: a.open,
		transparent: !0,
		animationType: "fade",
		onRequestClose: () => o({
			...a,
			open: !1
		}),
		children: /* @__PURE__ */ b(z, {
			style: {
				flex: 1,
				backgroundColor: r.surface.inverse
			},
			children: [
				/* @__PURE__ */ y(P, {
					onPress: () => o({
						...a,
						open: !1
					}),
					style: {
						position: "absolute",
						top: 48,
						right: 16,
						zIndex: 1,
						padding: 8
					},
					children: /* @__PURE__ */ y(L, {
						style: [U("heading.lg"), { color: r.text["on-inverse"] }],
						children: "×"
					})
				}),
				/* @__PURE__ */ y(E, {
					data: e,
					horizontal: !0,
					pagingEnabled: !0,
					initialScrollIndex: a.index,
					getItemLayout: (e, t) => ({
						length: s,
						offset: s * t,
						index: t
					}),
					keyExtractor: (e, t) => String(t),
					onScroll: (e) => {
						let t = Math.round(e.nativeEvent.contentOffset.x / s);
						t !== a.index && o((e) => ({
							...e,
							index: t
						}));
					},
					scrollEventThrottle: 32,
					renderItem: ({ item: e }) => /* @__PURE__ */ y(z, {
						style: {
							width: s,
							alignItems: "center",
							justifyContent: "center"
						},
						children: /* @__PURE__ */ y(D, {
							source: e,
							resizeMode: "contain",
							style: {
								width: s,
								height: "100%"
							}
						})
					})
				}),
				/* @__PURE__ */ y(z, {
					style: {
						position: "absolute",
						bottom: 32,
						left: 0,
						right: 0,
						alignItems: "center"
					},
					children: /* @__PURE__ */ b(L, {
						style: [U("label.md"), { color: r.text["on-inverse"] }],
						children: [
							a.index + 1,
							" / ",
							e.length
						]
					})
				})
			]
		})
	})] });
}
//#endregion
//#region src/native/components/SocialLoginButton.tsx
var fi = {
	google: "Google でログイン",
	apple: "Apple でログイン",
	line: "LINE でログイン",
	amazon: "Amazon でログイン",
	github: "GitHub でログイン",
	x: "X でログイン"
};
function pi({ provider: e, label: t, onPress: n, disabled: r = !1 }) {
	let { theme: i, scales: a } = H(), o = a.brandExternal, s = {
		google: {
			bg: i.surface.primary,
			fg: i.text["high-emphasis"],
			border: o.googleBorder
		},
		apple: {
			bg: o.apple,
			fg: i.text["on-inverse"],
			border: o.apple
		},
		line: {
			bg: o.line,
			fg: i.text["on-inverse"],
			border: o.line
		},
		amazon: {
			bg: o.amazon,
			fg: i.text["on-inverse"],
			border: o.amazon
		},
		github: {
			bg: i.surface.inverse,
			fg: i.text["on-inverse"],
			border: i.surface.inverse
		},
		x: {
			bg: i.surface.inverse,
			fg: i.text["on-inverse"],
			border: i.surface.inverse
		}
	}[e];
	return /* @__PURE__ */ y(P, {
		onPress: n,
		disabled: r,
		style: ({ pressed: e }) => ({
			minHeight: a.touchTargets.buttonCTA.min,
			paddingHorizontal: a.spacing.scale[5],
			alignItems: "center",
			justifyContent: "center",
			borderRadius: a.borderRadius.lg,
			borderWidth: 1,
			backgroundColor: s.bg,
			borderColor: s.border,
			opacity: r ? .5 : e ? .85 : 1
		}),
		children: /* @__PURE__ */ y(z, {
			style: {
				flexDirection: "row",
				alignItems: "center",
				gap: a.spacing.scale[2]
			},
			children: /* @__PURE__ */ y(L, {
				style: [U("label.md"), { color: s.fg }],
				children: t ?? fi[e]
			})
		})
	});
}
//#endregion
//#region src/native/components/social-icon-data.ts
var mi = {
	x: {
		color: "#000000",
		letter: "X"
	},
	instagram: {
		color: "#E4405F",
		letter: "IG"
	},
	youtube: {
		color: "#FF0000",
		letter: "YT"
	},
	tiktok: {
		color: "#000000",
		letter: "TT"
	},
	facebook: {
		color: "#1877F2",
		letter: "f"
	},
	line: {
		color: "#06C755",
		letter: "L"
	}
};
//#endregion
//#region src/native/components/SocialIcon.tsx
function hi({ brand: e, size: t = 24 }) {
	let { theme: n } = H(), r = mi[e];
	return /* @__PURE__ */ y(z, {
		style: {
			width: t,
			height: t,
			borderRadius: t / 2,
			backgroundColor: r.color,
			alignItems: "center",
			justifyContent: "center"
		},
		children: /* @__PURE__ */ y(L, {
			style: {
				color: n.text["on-inverse"],
				fontSize: t * .5,
				fontWeight: "700"
			},
			children: r.letter
		})
	});
}
//#endregion
//#region src/native/components/ListSkeletons.tsx
function gi({ count: e = 3, variant: t = "row" }) {
	let { scales: n } = H();
	return /* @__PURE__ */ y(z, {
		style: { gap: n.spacing.scale[3] },
		children: Array.from({ length: e }).map((e, r) => t === "card" ? /* @__PURE__ */ b(z, {
			style: { gap: n.spacing.scale[2] },
			children: [
				/* @__PURE__ */ y(Y, {
					height: 140,
					radius: n.borderRadius.lg
				}),
				/* @__PURE__ */ y(Y, {
					height: 14,
					width: "60%"
				}),
				/* @__PURE__ */ y(Y, {
					height: 12,
					width: "40%"
				})
			]
		}, r) : t === "list" ? /* @__PURE__ */ b(z, {
			style: { gap: 8 },
			children: [/* @__PURE__ */ y(Y, {
				height: 14,
				width: "80%"
			}), /* @__PURE__ */ y(Y, {
				height: 12,
				width: "50%"
			})]
		}, r) : /* @__PURE__ */ b(z, {
			style: {
				flexDirection: "row",
				gap: n.spacing.scale[3],
				alignItems: "center"
			},
			children: [/* @__PURE__ */ y(Y, {
				width: 48,
				height: 48,
				radius: 24
			}), /* @__PURE__ */ b(z, {
				style: {
					flex: 1,
					gap: 6
				},
				children: [/* @__PURE__ */ y(Y, {
					height: 14,
					width: "70%"
				}), /* @__PURE__ */ y(Y, {
					height: 12,
					width: "50%"
				})]
			})]
		}, r))
	});
}
function _i({ rows: e = 5, hasFilter: t = !0, rowHeight: n = 56 }) {
	let { scales: r } = H();
	return /* @__PURE__ */ b(z, {
		style: { gap: r.spacing.scale[2] },
		children: [t && /* @__PURE__ */ b(z, {
			style: {
				flexDirection: "row",
				gap: r.spacing.scale[2],
				marginBottom: r.spacing.scale[1]
			},
			children: [
				/* @__PURE__ */ y(Y, {
					width: 80,
					height: 36,
					radius: r.borderRadius.full
				}),
				/* @__PURE__ */ y(Y, {
					width: 80,
					height: 36,
					radius: r.borderRadius.full
				}),
				/* @__PURE__ */ y(Y, {
					width: 80,
					height: 36,
					radius: r.borderRadius.full
				})
			]
		}), Array.from({ length: e }).map((e, t) => /* @__PURE__ */ y(Y, {
			width: "100%",
			height: n,
			radius: r.borderRadius["2xl"]
		}, t))]
	});
}
function vi({ rows: e = 3, columns: t = 2, cardHeight: n = 140 }) {
	let { scales: r } = H(), i = Math.max(1, Math.min(t, 4)), a = Math.max(0, e) * i, o = r.spacing.scale[3];
	return /* @__PURE__ */ y(z, {
		style: {
			flexDirection: "row",
			flexWrap: "wrap",
			marginHorizontal: -o / 2
		},
		children: Array.from({ length: a }).map((e, t) => /* @__PURE__ */ y(z, {
			style: {
				width: `${100 / i}%`,
				paddingHorizontal: o / 2,
				marginBottom: o
			},
			children: /* @__PURE__ */ y(Y, {
				width: "100%",
				height: n,
				radius: r.borderRadius["2xl"]
			})
		}, t))
	});
}
//#endregion
//#region src/native/components/BottomTabBar.tsx
function yi() {
	let [e, t] = _(!1);
	return p(() => {
		let e = k.addListener("keyboardDidShow", () => t(!0)), n = k.addListener("keyboardDidHide", () => t(!1));
		return () => {
			e.remove(), n.remove();
		};
	}, []), e;
}
function bi({ keyboardBehavior: e = "stay", keyboardLiftOffset: t = 160, ...n }) {
	let r = yi();
	return e === "hide" && r ? null : /* @__PURE__ */ y(z, {
		style: e === "lift" && r ? { transform: [{ translateY: -t }] } : void 0,
		children: /* @__PURE__ */ y(ir, { ...n })
	});
}
function xi({ state: e, descriptors: t, navigation: n, insets: r, keyboardBehavior: i = "hide", keyboardLiftOffset: a = 160, hiddenRouteNames: o = [], floating: s = !0, glass: c = !0, glassIntensity: l = "regular", glassTint: u = "system", showLabels: d = !0, iconSize: f = 24, style: p, contentStyle: m, itemStyle: h, labelStyle: g }) {
	let { theme: _, scales: v } = H(), x = yi(), S = e.routes[e.index], C = S ? t[S.key]?.options : void 0, w = r?.bottom ?? 0;
	if (i === "hide" && x || wi(C?.tabBarStyle)) return null;
	let T = e.routes.filter((e) => {
		let n = t[e.key]?.options;
		return !o.includes(e.name) && n?.href !== null && n?.tabBarButton !== null;
	});
	if (T.length === 0) return null;
	let E = i === "lift" && x ? -a : 0, D = s ? {
		position: "absolute",
		left: v.spacing.scale[4],
		right: v.spacing.scale[4],
		bottom: w + v.spacing.scale[3],
		transform: [{ translateY: E }]
	} : {
		paddingBottom: w,
		transform: [{ translateY: E }]
	}, O = /* @__PURE__ */ y(z, {
		style: [{
			minHeight: d ? 64 : v.touchTargets.navItem.min,
			paddingHorizontal: v.spacing.scale[2],
			paddingVertical: v.spacing.scale[2],
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-around",
			borderRadius: s ? v.borderRadius.full : v.borderRadius.none
		}, m],
		children: T.map((r) => {
			let i = e.routes.findIndex((e) => e.key === r.key), a = e.index === i, o = t[r.key]?.options ?? {}, c = a ? o.tabBarActiveTintColor ?? _.text["accent-primary"] : o.tabBarInactiveTintColor ?? _.text["medium-emphasis"];
			return /* @__PURE__ */ b(P, {
				accessibilityRole: "button",
				accessibilityState: { selected: a },
				accessibilityLabel: o.tabBarAccessibilityLabel ?? Ci(r, o),
				testID: o.tabBarButtonTestID,
				onPress: () => {
					let e = n.emit?.({
						type: "tabPress",
						target: r.key,
						canPreventDefault: !0
					});
					!a && !e?.defaultPrevented && n.navigate?.(r.name, r.params);
				},
				style: ({ pressed: e }) => [
					{
						minHeight: v.touchTargets.navItem.min,
						minWidth: v.touchTargets.navItem.min,
						flex: 1,
						alignItems: "center",
						justifyContent: "center",
						gap: d ? v.spacing.scale[1] : 0,
						borderRadius: v.borderRadius.full,
						opacity: e ? .68 : a ? 1 : .72
					},
					a && { backgroundColor: s ? "rgba(255, 255, 255, 0.22)" : _.surface["accent-primary-light"] },
					h
				],
				children: [/* @__PURE__ */ b(z, {
					style: {
						minHeight: f,
						alignItems: "center",
						justifyContent: "center"
					},
					children: [o.tabBarIcon?.({
						focused: a,
						color: c,
						size: f
					}), o.tabBarBadge != null && /* @__PURE__ */ y(z, {
						style: {
							position: "absolute",
							top: -4,
							right: -10,
							minWidth: 16,
							height: 16,
							paddingHorizontal: 4,
							borderRadius: v.borderRadius.full,
							backgroundColor: _.caution.base,
							alignItems: "center",
							justifyContent: "center"
						},
						children: /* @__PURE__ */ y(L, {
							style: [U("label.xs"), { color: _.text["on-inverse"] }],
							children: o.tabBarBadge
						})
					})]
				}), d && /* @__PURE__ */ y(L, {
					numberOfLines: 1,
					style: [
						U(a ? "label.xs" : "body.xs"),
						{
							color: c,
							maxWidth: 72
						},
						g
					],
					children: Ci(r, o)
				})]
			}, r.key);
		})
	});
	return /* @__PURE__ */ y(z, {
		pointerEvents: "box-none",
		style: [D, p],
		children: c ? /* @__PURE__ */ y(ce, {
			intensity: l,
			tint: u,
			borderRadius: s ? v.borderRadius.full : v.borderRadius.none,
			backgroundFill: s ? void 0 : _.surface.primary,
			children: O
		}) : /* @__PURE__ */ y(z, {
			style: [{
				backgroundColor: _.surface.primary,
				borderColor: _.border["low-emphasis"],
				borderWidth: 1,
				borderRadius: s ? v.borderRadius.full : v.borderRadius.none
			}],
			children: O
		})
	});
}
function Si(e = {}) {
	return function(t) {
		return /* @__PURE__ */ y(xi, {
			...t,
			...e
		});
	};
}
function Ci(e, t) {
	return typeof t.tabBarLabel == "string" ? t.tabBarLabel : typeof t.title == "string" ? t.title : e.name;
}
function wi(e) {
	return e ? Array.isArray(e) ? e.some(wi) : typeof e == "object" && "display" in e ? e.display === "none" : !1 : !1;
}
//#endregion
//#region src/native/components/FilterBar.tsx
function Ti({ filters: e, sortLabel: t = "並び替え", onPressSort: n }) {
	let { theme: r, scales: i } = H();
	return /* @__PURE__ */ b(z, {
		style: {
			flexDirection: "row",
			alignItems: "center",
			gap: i.spacing.scale[2],
			paddingHorizontal: i.spacing.scale[3],
			paddingVertical: i.spacing.scale[2],
			backgroundColor: r.surface.primary,
			borderBottomWidth: 1,
			borderBottomColor: r.border["low-emphasis"]
		},
		children: [/* @__PURE__ */ y(F, {
			horizontal: !0,
			showsHorizontalScrollIndicator: !1,
			contentContainerStyle: { gap: i.spacing.scale[2] },
			style: { flex: 1 },
			children: e.map((e) => {
				let t = e.active || !!e.value;
				return /* @__PURE__ */ b(P, {
					onPress: e.onPress,
					style: ({ pressed: e }) => ({
						flexDirection: "row",
						alignItems: "center",
						gap: 4,
						paddingHorizontal: i.spacing.scale[3],
						height: 32,
						borderRadius: i.borderRadius.full,
						borderWidth: 1,
						borderColor: t ? r.border["accent-primary"] : r.border["medium-emphasis"],
						backgroundColor: t ? r.surface["accent-primary-light"] : e ? r.surface.secondary : r.surface.primary
					}),
					children: [/* @__PURE__ */ b(L, {
						style: [U("label.sm"), { color: t ? r.text["accent-primary"] : r.text["high-emphasis"] }],
						children: [e.label, e.value ? `: ${e.value}` : ""]
					}), /* @__PURE__ */ y(L, {
						style: [U("label.xs"), { color: t ? r.text["accent-primary"] : r.text["low-emphasis"] }],
						children: "▾"
					})]
				}, e.key);
			})
		}), /* @__PURE__ */ y(P, {
			onPress: n,
			style: ({ pressed: e }) => ({
				paddingHorizontal: i.spacing.scale[2],
				height: 32,
				justifyContent: "center",
				borderRadius: i.borderRadius.full,
				backgroundColor: e ? r.active["tertiary-button"] : "transparent"
			}),
			children: /* @__PURE__ */ y(L, {
				style: [U("label.sm"), { color: r.text["accent-primary"] }],
				children: t
			})
		})]
	});
}
//#endregion
//#region src/native/components/ImageCarousel.tsx
function Ei({ images: e, height: t = 280, showCounter: n = !0, showDots: r = !0 }) {
	let { theme: i, scales: a } = H(), [o, s] = _(0), c = w.get("window").width;
	return /* @__PURE__ */ b(z, { children: [
		/* @__PURE__ */ y(E, {
			data: e,
			horizontal: !0,
			pagingEnabled: !0,
			showsHorizontalScrollIndicator: !1,
			onScroll: (e) => {
				let t = Math.round(e.nativeEvent.contentOffset.x / c);
				t !== o && s(t);
			},
			scrollEventThrottle: 16,
			keyExtractor: (e, t) => String(t),
			renderItem: ({ item: e }) => /* @__PURE__ */ y(z, {
				style: {
					width: c,
					height: t,
					backgroundColor: i.surface.tertiary
				},
				children: /* @__PURE__ */ y(D, {
					source: e,
					resizeMode: "cover",
					style: {
						width: "100%",
						height: "100%"
					}
				})
			})
		}),
		n && e.length > 1 && /* @__PURE__ */ y(z, {
			style: {
				position: "absolute",
				top: a.spacing.scale[3],
				right: a.spacing.scale[3],
				paddingHorizontal: 10,
				paddingVertical: 4,
				borderRadius: a.borderRadius.full,
				backgroundColor: i.overlay.dark
			},
			children: /* @__PURE__ */ b(L, {
				style: [U("label.xs"), { color: i.text["on-inverse"] }],
				children: [
					o + 1,
					" / ",
					e.length
				]
			})
		}),
		r && e.length > 1 && /* @__PURE__ */ y(z, {
			style: {
				position: "absolute",
				bottom: a.spacing.scale[3],
				left: 0,
				right: 0,
				flexDirection: "row",
				justifyContent: "center",
				gap: 6
			},
			children: e.map((e, t) => /* @__PURE__ */ y(z, { style: {
				width: t === o ? 16 : 6,
				height: 6,
				borderRadius: 3,
				backgroundColor: t === o ? i.text["on-inverse"] : i.text["on-inverse-secondary"]
			} }, t))
		})
	] });
}
//#endregion
//#region src/native/components/PriceDisplay.tsx
function Di(e, t = "¥") {
	return `${t}${e.toLocaleString("ja-JP")}`;
}
function Oi({ price: e, originalPrice: t, currency: n = "¥", size: r = "md", showTax: i = !0 }) {
	let { theme: a, scales: o } = H(), s = typeof t == "number" && t > e, c = s ? Math.round((1 - e / t) * 100) : 0, l = U(r === "lg" ? "heading.2xl" : r === "sm" ? "label.md" : "heading.lg");
	return /* @__PURE__ */ b(z, {
		style: { gap: 2 },
		children: [/* @__PURE__ */ b(z, {
			style: {
				flexDirection: "row",
				alignItems: "baseline",
				gap: o.spacing.scale[2],
				flexWrap: "wrap"
			},
			children: [
				s && /* @__PURE__ */ b(L, {
					style: [U("label.md"), {
						color: a.caution.base,
						fontWeight: "700"
					}],
					children: [c, "% OFF"]
				}),
				/* @__PURE__ */ y(L, {
					style: [l, { color: a.text["high-emphasis"] }],
					children: Di(e, n)
				}),
				i && /* @__PURE__ */ y(L, {
					style: [U("body.sm"), { color: a.text["low-emphasis"] }],
					children: "税込"
				})
			]
		}), s && /* @__PURE__ */ y(L, {
			style: [U("body.sm"), {
				color: a.text["low-emphasis"],
				textDecorationLine: "line-through"
			}],
			children: Di(t, n)
		})]
	});
}
//#endregion
//#region src/native/components/QuantitySelector.tsx
function ki({ min: e = 1, ...t }) {
	return /* @__PURE__ */ y(Vt, {
		min: e,
		...t
	});
}
//#endregion
//#region src/native/components/RatingDisplay.tsx
function Ai({ rating: e, count: t, size: n = 16, layout: r = "row" }) {
	let { theme: i, scales: a } = H();
	return /* @__PURE__ */ b(z, {
		style: {
			flexDirection: r === "row" ? "row" : "column",
			alignItems: r === "row" ? "center" : "flex-start",
			gap: a.spacing.scale[1]
		},
		children: [/* @__PURE__ */ y(Je, {
			value: e,
			size: n,
			readOnly: !0
		}), /* @__PURE__ */ b(z, {
			style: {
				flexDirection: "row",
				alignItems: "center",
				gap: 4
			},
			children: [/* @__PURE__ */ y(L, {
				style: [U("label.sm"), { color: i.text["high-emphasis"] }],
				children: e.toFixed(1)
			}), t !== void 0 && /* @__PURE__ */ b(L, {
				style: [U("body.sm"), { color: i.text["low-emphasis"] }],
				children: [
					"(",
					t.toLocaleString("ja-JP"),
					")"
				]
			})]
		})]
	});
}
//#endregion
//#region src/native/components/ProductCard.tsx
function ji({ image: e, title: t, price: n, originalPrice: r, rating: i, reviewCount: a, badge: o, soldOut: s, onPress: c, layout: l = "vertical" }) {
	let { theme: u, scales: d } = H(), f = l === "horizontal", p = f ? 96 : "100%", m = f ? 96 : 160, h = (c = !1) => /* @__PURE__ */ b(z, {
		style: {
			flexDirection: f ? "row" : "column",
			gap: d.spacing.scale[3],
			backgroundColor: u.surface.primary,
			borderRadius: d.borderRadius.lg,
			overflow: "hidden",
			padding: f ? d.spacing.scale[3] : 0,
			opacity: c ? .85 : 1
		},
		children: [/* @__PURE__ */ b(z, {
			style: {
				position: "relative",
				width: p,
				height: m
			},
			children: [
				/* @__PURE__ */ y(D, {
					source: e,
					style: {
						width: "100%",
						height: "100%",
						borderRadius: d.borderRadius.md,
						backgroundColor: u.surface.tertiary
					},
					resizeMode: "cover"
				}),
				s && /* @__PURE__ */ y(z, {
					style: {
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: u.overlay.medium,
						alignItems: "center",
						justifyContent: "center",
						borderRadius: d.borderRadius.md
					},
					children: /* @__PURE__ */ y(L, {
						style: [U("label.md"), { color: u.text["on-inverse"] }],
						children: "売り切れ"
					})
				}),
				o && /* @__PURE__ */ y(z, {
					style: {
						position: "absolute",
						top: 8,
						left: 8
					},
					children: /* @__PURE__ */ y(Re, {
						tone: "caution",
						children: o
					})
				})
			]
		}), /* @__PURE__ */ b(z, {
			style: {
				flex: 1,
				gap: 4,
				padding: f ? 0 : d.spacing.scale[3]
			},
			children: [
				/* @__PURE__ */ y(L, {
					numberOfLines: 2,
					style: [U("body.md"), { color: u.text["high-emphasis"] }],
					children: t
				}),
				i !== void 0 && /* @__PURE__ */ y(Ai, {
					rating: i,
					count: a,
					size: 14
				}),
				/* @__PURE__ */ y(Oi, {
					price: n,
					originalPrice: r,
					size: "sm"
				})
			]
		})]
	});
	return c ? /* @__PURE__ */ y(P, {
		onPress: c,
		disabled: s,
		children: ({ pressed: e }) => h(e)
	}) : h(!1);
}
//#endregion
//#region src/native/components/ProductCarousel.tsx
function Mi({ title: e, action: t, products: n, cardWidth: r = 160 }) {
	let { scales: i } = H();
	return /* @__PURE__ */ b(z, { children: [e && /* @__PURE__ */ y(wr, {
		title: e,
		action: t
	}), /* @__PURE__ */ y(E, {
		data: n,
		horizontal: !0,
		showsHorizontalScrollIndicator: !1,
		keyExtractor: (e, t) => String(t),
		contentContainerStyle: {
			gap: i.spacing.scale[3],
			paddingHorizontal: i.spacing.scale[4],
			paddingBottom: i.spacing.scale[2]
		},
		renderItem: ({ item: e }) => /* @__PURE__ */ y(z, {
			style: { width: r },
			children: /* @__PURE__ */ y(ji, { ...e })
		})
	})] });
}
//#endregion
//#region src/native/components/OrderSummary.tsx
function Ni(e, t) {
	return `${t}${e.toLocaleString("ja-JP")}`;
}
function Pi({ lines: e, currency: t = "¥" }) {
	let { theme: n, scales: r } = H();
	return /* @__PURE__ */ y(z, {
		style: {
			backgroundColor: n.surface.primary,
			borderColor: n.border["low-emphasis"],
			borderWidth: 1,
			borderRadius: r.borderRadius.lg,
			padding: r.spacing.scale[4],
			gap: r.spacing.scale[2]
		},
		children: e.map((e, r) => {
			let i = e.emphasis === "total", a = e.emphasis === "discount", o = a ? n.text.caution : i ? n.text["accent-primary"] : n.text["high-emphasis"], s = U(i ? "label.lg" : "body.md"), c = U(i ? "heading.lg" : "body.md");
			return /* @__PURE__ */ b(l.Fragment, { children: [i && /* @__PURE__ */ y(J, {}), /* @__PURE__ */ b(z, {
				style: {
					flexDirection: "row",
					justifyContent: "space-between"
				},
				children: [/* @__PURE__ */ y(L, {
					style: [s, { color: n.text["medium-emphasis"] }],
					children: e.label
				}), /* @__PURE__ */ b(L, {
					style: [c, { color: o }],
					children: [a && e.value > 0 ? "-" : "", Ni(e.value, t)]
				})]
			})] }, r);
		})
	});
}
//#endregion
//#region src/native/components/ReviewCard.tsx
function Fi({ authorName: e, authorAvatar: t, rating: n, date: r, title: i, comment: a, helpfulCount: o }) {
	let { theme: s, scales: c } = H();
	return /* @__PURE__ */ b(z, {
		style: {
			backgroundColor: s.surface.primary,
			borderRadius: c.borderRadius.lg,
			borderWidth: 1,
			borderColor: s.border["low-emphasis"],
			padding: c.spacing.scale[4],
			gap: c.spacing.scale[2]
		},
		children: [
			/* @__PURE__ */ b(z, {
				style: {
					flexDirection: "row",
					alignItems: "center",
					gap: c.spacing.scale[2]
				},
				children: [
					/* @__PURE__ */ y(Pe, {
						source: t,
						fallback: e[0],
						size: "sm"
					}),
					/* @__PURE__ */ b(z, {
						style: { flex: 1 },
						children: [/* @__PURE__ */ y(L, {
							style: [U("label.md"), { color: s.text["high-emphasis"] }],
							children: e
						}), r && /* @__PURE__ */ y(L, {
							style: [U("body.sm"), { color: s.text["low-emphasis"] }],
							children: r
						})]
					}),
					/* @__PURE__ */ y(Je, {
						value: n,
						size: 14,
						readOnly: !0
					})
				]
			}),
			i && /* @__PURE__ */ y(L, {
				style: [U("label.md"), { color: s.text["high-emphasis"] }],
				children: i
			}),
			/* @__PURE__ */ y(L, {
				style: [U("body.md"), { color: s.text["high-emphasis"] }],
				children: a
			}),
			o !== void 0 && /* @__PURE__ */ b(L, {
				style: [U("label.sm"), { color: s.text["low-emphasis"] }],
				children: ["参考になった ", o]
			})
		]
	});
}
//#endregion
//#region src/native/components/ReviewSummary.tsx
function Ii({ average: e, total: t, distribution: n }) {
	let { theme: r, scales: i } = H();
	return /* @__PURE__ */ b(z, {
		style: {
			flexDirection: "row",
			gap: i.spacing.scale[4],
			padding: i.spacing.scale[4],
			backgroundColor: r.surface.primary,
			borderRadius: i.borderRadius.lg,
			borderWidth: 1,
			borderColor: r.border["low-emphasis"]
		},
		children: [/* @__PURE__ */ b(z, {
			style: {
				alignItems: "center",
				gap: i.spacing.scale[1],
				minWidth: 100
			},
			children: [
				/* @__PURE__ */ y(L, {
					style: [U("heading.3xl"), { color: r.text["high-emphasis"] }],
					children: e.toFixed(1)
				}),
				/* @__PURE__ */ y(Je, {
					value: e,
					size: 16,
					readOnly: !0
				}),
				/* @__PURE__ */ b(L, {
					style: [U("body.sm"), { color: r.text["low-emphasis"] }],
					children: [t.toLocaleString("ja-JP"), " 件"]
				})
			]
		}), /* @__PURE__ */ y(z, {
			style: {
				flex: 1,
				gap: 4
			},
			children: [
				5,
				4,
				3,
				2,
				1
			].map((e) => {
				let a = n[e] ?? 0, o = t > 0 ? a / t * 100 : 0;
				return /* @__PURE__ */ b(z, {
					style: {
						flexDirection: "row",
						alignItems: "center",
						gap: i.spacing.scale[2]
					},
					children: [
						/* @__PURE__ */ y(L, {
							style: [U("label.sm"), {
								color: r.text["medium-emphasis"],
								width: 16
							}],
							children: e
						}),
						/* @__PURE__ */ y(z, {
							style: {
								flex: 1,
								height: 6,
								borderRadius: 3,
								backgroundColor: r.surface.tertiary,
								overflow: "hidden"
							},
							children: /* @__PURE__ */ y(z, { style: {
								width: `${o}%`,
								height: "100%",
								backgroundColor: r.object.rating
							} })
						}),
						/* @__PURE__ */ y(L, {
							style: [U("body.sm"), {
								color: r.text["low-emphasis"],
								width: 40,
								textAlign: "right"
							}],
							children: a
						})
					]
				}, e);
			})
		})]
	});
}
//#endregion
//#region src/native/components/AppShell.tsx
function Li({ header: e, footer: t, bottomNav: n, scrollable: r = !0, children: i }) {
	let { theme: a } = H(), o = y(r ? F : z, {
		style: {
			flex: 1,
			backgroundColor: a.surface.secondary
		},
		children: i
	});
	return /* @__PURE__ */ b(z, {
		style: {
			flex: 1,
			backgroundColor: a.surface.primary
		},
		children: [
			e,
			o,
			t,
			n
		]
	});
}
//#endregion
//#region src/native/components/MarketingShell.tsx
function Ri({ header: e, footer: t, cta: n, children: r }) {
	let { theme: i } = H();
	return /* @__PURE__ */ b(z, {
		style: {
			flex: 1,
			backgroundColor: i.surface.primary
		},
		children: [
			e,
			/* @__PURE__ */ b(F, {
				style: { flex: 1 },
				contentContainerStyle: { paddingBottom: n ? 80 : 0 },
				children: [r, t]
			}),
			n && /* @__PURE__ */ y(z, {
				style: {
					position: "absolute",
					left: 0,
					right: 0,
					bottom: 0
				},
				children: n
			})
		]
	});
}
//#endregion
export { Qn as Accordion, Yr as ActionTile, Kt as Alert, Jt as AlertDialog, sr as AppHeader, Li as AppShell, Dt as AutoGrowTextarea, Pe as Avatar, we as Badge, pr as Banner, mr as BannerCarousel, bn as BottomSheetForm, xn as BottomSheetFrame, bi as BottomTabBar, or as Breadcrumb, q as Button, Hn as Calendar, Ce as Card, ri as CategoryNav, ii as CategoryScroll, dt as Celebration, gt as CelebrationDialog, Ft as Checkbox, Lt as CheckboxCard, It as CheckboxField, Rt as CheckboxGroup, Le as Chip, ni as ChipFilterBar, Zr as ChipSelector, Cn as CoachMark, wn as CoachMarkOverlay, $n as Collapsible, ei as CollapsibleChipField, En as Combobox, Nt as CommitAutoGrowTextarea, jt as CommitInput, Mt as CommitTextarea, Kr as CompactFilePicker, yn as ConfirmDialog, bt as CountdownHero, $e as CountdownTimer, qn as DateField, Wn as DatePicker, Zn as DateTimePicker, tn as DetailSheetBody, en as DetailSheetHeader, $t as DetailSheetScaffold, qt as Dialog, Mr as DocumentScreen, On as DropdownFilter, on as DropdownMenu, yr as EmptyState, gn as ErrorBoundary, br as ErrorState, Or as FileUpload, Ti as FilterBar, ci as FilterChip, Me as FloatingTabBar, Dr as Footer, Gt as FormActions, Ht as FormField, Ut as FormRoot, Wt as FormSection, ce as GlassView, ke as GradientSurface, vi as GridSkeleton, Cr as IconBadge, qr as ImageAttachmentPicker, Ei as ImageCarousel, di as ImageGallery, Ct as Input, nn as KeyboardAwareSheetFooter, xt as Label, xi as LiquidBottomTabBar, gr as ListItem, _i as ListSkeleton, gi as ListSkeletons, Ri as MarketingShell, Wr as MediaActionCluster, vn as MenuDrawer, cr as MobileAppHeader, lr as MobileAppShell, ur as MobileFloatingActionButton, Dn as MultiSelect, ir as NavigationBar, Ye as NotificationBadge, Vt as NumberInput, Pi as OrderSummary, nr as Pagination, Br as PhotoHero, kn as PillToggle, an as Popover, ui as PresenceIndicator, Oi as PriceDisplay, ji as ProductCard, Mi as ProductCarousel, Ke as Progress, qe as ProgressRing, ai as ProgressSteps, jr as Prose, ki as QuantitySelector, Xr as QuickActionGrid, zt as RadioGroup, Ai as RatingDisplay, rn as ResponsiveDialog, Fi as ReviewCard, Sn as ReviewOverlay, Ii as ReviewSummary, Ar as Screen, er as ScrollArea, hr as SearchBar, wr as SectionHeader, Tn as Select, J as Separator, vr as SettingsListRow, _r as SettingsSection, si as ShareButtons, Z as Sheet, rr as SimplePagination, Y as Skeleton, Be as SkeletonText, Bt as Slider, hi as SocialIcon, pi as SocialLoginButton, ze as Spinner, Te as Stack, Je as StarRating, Xe as StatCard, dr as StatusActionBadge, Tr as StickyActionBar, ar as SubNav, Er as SwipeRow, Pt as Switch, Ze as SyncStatusBadge, fr as SyncStatusButton, Mn as Tabs, Fn as TabsContent, Nn as TabsList, Pn as TabsTrigger, Re as Tag, oi as TagInput, W as Text, Tt as Textarea, V as ThemeProvider, Yn as TimePicker, pn as ToastProvider, Si as createExpoRouterTabBar, s as getTheme, ve as isNativeLiquidGlassAvailable, o as primitives, U as resolveTypo, i as scales, a as themeNames, r as themes, $ as toast, H as useTheme, cn as useToast };
