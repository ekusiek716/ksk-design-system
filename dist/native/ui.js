import { a as e, c as t, i as n, l as r, n as i, o as a, r as o, s, t as c, u as l } from "../prompt-coordinator-sBFZKQIX.js";
import { a as u, i as d, n as f, r as p, t as m } from "../native-BYLnbCN-.js";
import * as h from "react";
import g, { createContext as _, useCallback as v, useContext as y, useEffect as b, useId as x, useMemo as S, useRef as C, useState as w } from "react";
import { Fragment as T, jsx as E, jsxs as D } from "react/jsx-runtime";
import { AccessibilityInfo as O, ActivityIndicator as k, Animated as A, Dimensions as j, Easing as M, FlatList as N, Image as P, ImageBackground as ee, Keyboard as F, Linking as I, Modal as te, PanResponder as ne, Platform as L, Pressable as R, ScrollView as z, Share as B, Text as V, TextInput as H, View as U } from "react-native";
//#region src/native/theme/ThemeProvider.tsx
var W = _(null);
function G({ children: e, initialName: t = "default", initialMode: n = "light" }) {
	let [r, i] = w(t), [a, o] = w(n), s = S(() => ({
		name: r,
		mode: a,
		theme: u[r][a],
		scales: d,
		setName: i,
		setMode: o,
		toggleMode: () => o((e) => e === "light" ? "dark" : "light")
	}), [r, a]);
	return /* @__PURE__ */ E(W.Provider, {
		value: s,
		children: e
	});
}
function K() {
	let e = y(W);
	if (!e) throw Error("useTheme は ThemeProvider の内側で使ってください");
	return e;
}
//#endregion
//#region src/native/typography.ts
function q(e) {
	if (e === "caption") return { ...d.typography.caption };
	if (e === "caption-strong") return { ...d.typography["caption-strong"] };
	if (e === "prose-meta") return { ...d.typography["prose-meta"] };
	let [t, n] = e.split(".");
	return { ...d.typography[t][n] };
}
//#endregion
//#region src/native/components/Text.tsx
var re = /* @__PURE__ */ new Set(["caption", "caption-strong"]);
function J({ variant: e = "body.md", color: t, style: n, children: r, ...i }) {
	let { theme: a } = K(), o = re.has(e) ? a.text["low-emphasis"] : a.text["high-emphasis"];
	return /* @__PURE__ */ E(V, {
		style: [
			q(e),
			{ color: t ?? o },
			n
		],
		...i,
		children: r
	});
}
//#endregion
//#region __vite-optional-peer-dep:expo-blur:ksk-design-system
var Y = /* @__PURE__ */ r({ default: () => ie }), ie, ae = t((() => {
	throw ie = {}, Error("Could not resolve \"expo-blur\" imported by \"ksk-design-system\". Is it installed?");
})), oe = /* @__PURE__ */ r({ default: () => se }), se, ce = t((() => {
	throw se = {}, Error("Could not resolve \"expo-glass-effect\" imported by \"ksk-design-system\". Is it installed?");
})), le = {
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
}, ue = {
	subtle: "clear",
	regular: "regular",
	thick: "regular"
};
function de({ intensity: e = "regular", tint: t = "system", nativeGlass: n = !0, fallback: r = "blur", glassEffectStyle: i, interactive: a = !1, tintColor: o, backgroundFill: s, rimColor: c, highlightColor: l, showRim: u = !0, showHighlight: d = !0, borderRadius: f, absoluteFill: p = !1, style: m, children: h, ...g }) {
	let { scales: _, mode: v } = K(), y = f ?? _.borderRadius.lg, b = le[e], x = t === "system" ? v === "dark" ? "dark" : "light" : t, S = s ?? (x === "light" ? `rgba(255, 255, 255, ${b.opacity})` : `rgba(20, 20, 30, ${b.opacity})`), C = c ?? (x === "light" ? "rgba(255, 255, 255, 0.42)" : "rgba(255, 255, 255, 0.15)"), w = l ?? (x === "light" ? "rgba(255, 255, 255, 0.72)" : "rgba(255, 255, 255, 0.22)"), T = {
		...p ? fe : {},
		borderRadius: y,
		overflow: "hidden",
		backgroundColor: S,
		borderWidth: +!!u,
		borderColor: C
	};
	return n && be && Se() ? /* @__PURE__ */ D(be, {
		colorScheme: x,
		glassEffectStyle: i ?? ue[e],
		isInteractive: a,
		tintColor: o,
		style: [
			T,
			{ backgroundColor: "transparent" },
			m
		],
		...g,
		children: [
			u && /* @__PURE__ */ E(pe, {
				borderRadius: y,
				borderColor: C
			}),
			d && /* @__PURE__ */ E(me, {
				borderRadius: y,
				color: w
			}),
			h
		]
	}) : r === "blur" && xe && L.OS !== "web" ? /* @__PURE__ */ D(xe, {
		intensity: b.blur * 2.5,
		tint: x === "dark" ? "dark" : "light",
		experimentalBlurMethod: L.OS === "android" ? "dimezisBlurView" : void 0,
		style: [
			T,
			{ backgroundColor: "transparent" },
			m
		],
		...g,
		children: [
			u && /* @__PURE__ */ E(pe, {
				borderRadius: y,
				borderColor: C
			}),
			d && /* @__PURE__ */ E(me, {
				borderRadius: y,
				color: w
			}),
			h
		]
	}) : L.OS === "web" ? /* @__PURE__ */ D(U, {
		style: [{
			...T,
			WebkitBackdropFilter: `blur(${b.blur}px) saturate(1.9) brightness(1.06)`,
			backdropFilter: `blur(${b.blur}px) saturate(1.9) brightness(1.06)`
		}, m],
		...g,
		children: [d && /* @__PURE__ */ E(me, {
			borderRadius: y,
			color: w
		}), h]
	}) : /* @__PURE__ */ D(U, {
		style: [T, m],
		...g,
		children: [d && /* @__PURE__ */ E(me, {
			borderRadius: y,
			color: w
		}), h]
	});
}
var fe = {
	position: "absolute",
	top: 0,
	left: 0,
	right: 0,
	bottom: 0
};
function pe({ borderRadius: e, borderColor: t }) {
	return /* @__PURE__ */ E(U, {
		pointerEvents: "none",
		style: {
			...fe,
			borderRadius: e,
			borderWidth: 1,
			borderColor: t
		}
	});
}
function me({ borderRadius: e, color: t }) {
	return /* @__PURE__ */ E(U, {
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
var he = void 0;
function ge() {
	if (he !== void 0) return he;
	try {
		he = (ae(), l(Y)).BlurView ?? null;
	} catch {
		he = null;
	}
	return he;
}
var _e = void 0;
function ve() {
	if (_e !== void 0) return _e;
	try {
		_e = (ce(), l(oe));
	} catch {
		_e = null;
	}
	return _e;
}
function ye() {
	return ve()?.GlassView ?? null;
}
var be = ye(), xe = ge();
function Se() {
	if (L.OS !== "ios") return !1;
	let e = ve();
	if (!e?.GlassView) return !1;
	let t = e.isLiquidGlassAvailable?.() ?? !0, n = e.isGlassEffectAPIAvailable?.() ?? !0;
	return t && n;
}
//#endregion
//#region src/native/components/Button.tsx
function X({ variant: e = "primary", elevation: t = "flat", containerStyle: n, pressedContainerStyle: r, textStyle: i, leadingIcon: a, trailingIcon: o, loading: s = !1, loadingLabel: c, children: l, disabled: u, accessibilityState: d, ...f }) {
	let { theme: p, scales: m, mode: h } = K(), g = u || s, _ = {
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
		return /* @__PURE__ */ E(R, {
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
			children: ({ pressed: t }) => /* @__PURE__ */ E(de, {
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
				children: /* @__PURE__ */ E(Ce, {
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
	let v = _[e], y = m.elevation[t];
	return /* @__PURE__ */ E(R, {
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
				borderBottomWidth: e && !g ? 0 : y.bottomBorderWidth,
				borderBottomColor: v.bottomBorder,
				transform: [{ translateY: e && !g ? y.offset : 0 }],
				marginBottom: e && !g ? y.bottomBorderWidth : 0
			},
			n,
			e && !g && r
		],
		...f,
		children: /* @__PURE__ */ E(Ce, {
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
function Ce({ color: e, textStyle: t, loading: n, loadingLabel: r, leadingIcon: i, trailingIcon: a, gap: o, children: s }) {
	let c = [
		q("label.md"),
		{ color: e },
		t
	];
	return n ? /* @__PURE__ */ D(U, {
		style: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			gap: o
		},
		children: [/* @__PURE__ */ E(k, {
			size: "small",
			color: e
		}), r ? /* @__PURE__ */ E(V, {
			style: c,
			children: r
		}) : null]
	}) : /* @__PURE__ */ D(U, {
		style: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			gap: o
		},
		children: [
			i,
			we(s, c),
			a
		]
	});
}
function we(e, t) {
	return g.Children.map(e, (e) => typeof e == "string" || typeof e == "number" ? /* @__PURE__ */ E(V, {
		style: t,
		children: e
	}) : e);
}
//#endregion
//#region src/native/components/Card.tsx
var Te = {
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
function Ee(e, t) {
	return {
		shadowColor: t,
		...Te[e]
	};
}
function De({ padding: e = 4, elevation: t, style: n, children: r, ...i }) {
	let { theme: a, scales: o } = K(), s = t ? L.select({
		web: { boxShadow: o.shadows[t].boxShadow },
		ios: Ee(t, a.overlay.dark),
		default: { elevation: o.shadows[t].elevation }
	}) : void 0;
	return /* @__PURE__ */ E(U, {
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
function Oe({ tone: e = "neutral", children: t }) {
	let { theme: n, scales: r } = K(), i = {
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
	return /* @__PURE__ */ E(U, {
		style: {
			backgroundColor: i.bg,
			borderRadius: r.borderRadius.full,
			paddingVertical: r.spacing.scale[1],
			paddingHorizontal: r.spacing.scale[3],
			alignSelf: "flex-start"
		},
		children: /* @__PURE__ */ E(V, {
			style: [q("label.sm"), { color: i.fg }],
			children: t
		})
	});
}
//#endregion
//#region src/native/components/Stack.tsx
function ke({ gap: e = 3, direction: t = "column", align: n, justify: r, wrap: i = !1, style: a, children: o, ...s }) {
	let { scales: c } = K();
	return /* @__PURE__ */ E(U, {
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
var Ae = /* @__PURE__ */ r({ default: () => je }), je, Me = t((() => {
	throw je = {}, Error("Could not resolve \"react-native-svg\" imported by \"ksk-design-system\". Is it installed?");
}));
//#endregion
//#region src/native/components/GradientSurface.tsx
function Ne({ direction: e = "vertical", stops: t, style: n, children: r }) {
	let { name: i } = K(), a = x().replace(/[^a-zA-Z0-9_-]/g, ""), o = u[i], s = t && t.length >= 2 ? t : [
		{
			offset: 0,
			color: o.dark.brand.primary
		},
		{
			offset: .55,
			color: o.dark.surface["accent-primary"]
		},
		{
			offset: 1,
			color: o.light.brand.primary
		}
	], c = s[Math.floor(s.length / 2)], l = Fe();
	return /* @__PURE__ */ D(U, {
		style: [{
			flex: 1,
			backgroundColor: c.color,
			overflow: "hidden"
		}, n],
		children: [l ? /* @__PURE__ */ D(l.Svg, {
			style: {
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0
			},
			preserveAspectRatio: "xMidYMid slice",
			children: [/* @__PURE__ */ E(l.Defs, { children: /* @__PURE__ */ E(l.LinearGradient, {
				id: a,
				x1: "0",
				y1: "0",
				x2: e === "horizontal" ? "1" : "0",
				y2: e === "horizontal" ? "0" : "1",
				children: s.map((e) => /* @__PURE__ */ E(l.Stop, {
					offset: String(e.offset),
					stopColor: e.color
				}, e.offset))
			}) }), /* @__PURE__ */ E(l.Rect, {
				x: "0",
				y: "0",
				width: "100%",
				height: "100%",
				fill: `url(#${a})`
			})]
		}) : null, r]
	});
}
var Pe = void 0;
function Fe() {
	if (Pe !== void 0) return Pe;
	try {
		let e = (Me(), l(Ae));
		Pe = e.Defs && e.LinearGradient && e.Stop && e.Rect && (e.Svg ?? e.default) ? {
			Svg: e.Svg ?? e.default,
			Defs: e.Defs,
			LinearGradient: e.LinearGradient,
			Stop: e.Stop,
			Rect: e.Rect
		} : null;
	} catch {
		Pe = null;
	}
	return Pe;
}
//#endregion
//#region src/native/components/FloatingTabBar.tsx
function Ie({ items: e, activeKey: t, onSelect: n, tone: r = "surface", style: i, labelStyle: a }) {
	let { name: o, theme: s, scales: c } = K(), l = u[o], d = r === "hero" ? {
		pillBg: l.light.brand["ultra-light"],
		itemActiveBg: l.light.brand.light,
		label: l.dark.brand.light,
		labelActive: l.dark.brand.light,
		pressedBg: l.dark.brand.action
	} : {
		pillBg: s.surface.secondary,
		itemActiveBg: s.surface["accent-primary-light"],
		label: s.text["medium-emphasis"],
		labelActive: s.text["accent-primary"],
		pressedBg: s.active["tertiary-button"]
	};
	return /* @__PURE__ */ E(U, {
		accessibilityRole: "tablist",
		style: [{
			flexDirection: "row",
			backgroundColor: d.pillBg,
			borderRadius: c.borderRadius.full,
			padding: c.spacing.scale[1]
		}, i],
		children: e.map((e) => {
			let r = e.key === t;
			return /* @__PURE__ */ D(R, {
				accessibilityRole: "tab",
				accessibilityState: { selected: r },
				accessibilityLabel: e.label,
				onPress: () => n(e.key),
				style: ({ pressed: e }) => ({
					flex: 1,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					gap: c.spacing.scale[1],
					minHeight: c.touchTargets.buttonCTA.min,
					borderRadius: c.borderRadius.full,
					backgroundColor: e ? d.pressedBg : r ? d.itemActiveBg : "transparent"
				}),
				children: [e.icon, /* @__PURE__ */ E(V, {
					style: [
						q("label.md"),
						{ color: r ? d.labelActive : d.label },
						a
					],
					children: e.label
				})]
			}, e.key);
		})
	});
}
//#endregion
//#region src/native/components/Avatar.tsx
var Le = {
	sm: 32,
	md: 40,
	lg: 56,
	xl: 80
};
function Re({ source: e, fallback: t, size: n = "md" }) {
	let { theme: r } = K(), i = Le[n];
	return e ? /* @__PURE__ */ E(P, {
		source: e,
		style: {
			width: i,
			height: i,
			borderRadius: i / 2,
			backgroundColor: r.surface.tertiary
		}
	}) : /* @__PURE__ */ E(U, {
		style: {
			width: i,
			height: i,
			borderRadius: i / 2,
			backgroundColor: r.surface.tertiary,
			alignItems: "center",
			justifyContent: "center"
		},
		children: /* @__PURE__ */ E(V, {
			style: [q("label.sm"), { color: r.text["medium-emphasis"] }],
			children: t ?? "?"
		})
	});
}
//#endregion
//#region src/native/components/Chip.tsx
var ze = {
	sm: 28,
	md: 32,
	lg: 36
}, Be = {
	sm: 10,
	md: 12,
	lg: 16
};
function Ve({ variant: e = "filled", size: t = "md", shape: n = "pill", selected: r = !1, disabled: i = !1, count: a, removable: o = !1, onRemove: s, children: c, ...l }) {
	let { theme: u, scales: d } = K(), f = {
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
	return /* @__PURE__ */ D(U, {
		style: {
			flexDirection: "row",
			alignSelf: "flex-start"
		},
		children: [/* @__PURE__ */ D(R, {
			disabled: i,
			style: ({ pressed: a }) => [{
				height: ze[t],
				paddingHorizontal: Be[t],
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
			children: [/* @__PURE__ */ E(V, {
				style: [q("label.sm"), { color: m }],
				children: c
			}), a !== void 0 && /* @__PURE__ */ E(U, {
				style: {
					minWidth: 20,
					paddingHorizontal: 6,
					borderRadius: d.borderRadius.full,
					backgroundColor: r ? u.surface.primary : u.surface.tertiary,
					alignItems: "center",
					justifyContent: "center"
				},
				children: /* @__PURE__ */ E(V, {
					style: [q("label.xs"), { color: r ? u.text["accent-primary"] : u.text["medium-emphasis"] }],
					children: a
				})
			})]
		}), o && /* @__PURE__ */ E(R, {
			onPress: s,
			disabled: i,
			style: ({ pressed: a }) => ({
				height: ze[t],
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
			children: /* @__PURE__ */ E(V, {
				style: [q("label.md"), {
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
function He({ tone: e = "neutral", variant: t = "filled", children: n }) {
	let { theme: r, scales: i } = K(), a = {
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
	return /* @__PURE__ */ E(U, {
		style: {
			backgroundColor: s?.bg ?? "transparent",
			borderColor: c?.border,
			borderWidth: +(t === "outline"),
			borderRadius: i.borderRadius.sm,
			paddingVertical: i.spacing.scale[1],
			paddingHorizontal: i.spacing.scale[2],
			alignSelf: "flex-start"
		},
		children: /* @__PURE__ */ E(V, {
			style: [q("label.xs"), { color: s?.fg ?? c?.fg ?? r.text["medium-emphasis"] }],
			children: n
		})
	});
}
//#endregion
//#region src/native/components/Spinner.tsx
function Ue({ size: e = "md", color: t }) {
	let { theme: n } = K();
	return /* @__PURE__ */ E(k, {
		size: e === "sm" ? "small" : "large",
		color: t ?? n.brand.primary
	});
}
//#endregion
//#region src/native/components/Separator.tsx
function We({ orientation: e = "horizontal", emphasis: t = "low" }) {
	let { theme: n } = K(), r = t === "low" ? n.border["low-emphasis"] : n.border["medium-emphasis"];
	return e === "vertical" ? /* @__PURE__ */ E(U, { style: {
		width: 1,
		alignSelf: "stretch",
		backgroundColor: r
	} }) : /* @__PURE__ */ E(U, { style: {
		height: 1,
		alignSelf: "stretch",
		backgroundColor: r
	} });
}
//#endregion
//#region src/native/components/Skeleton.tsx
function Z({ width: e = "100%", height: t = 16, radius: n, style: r }) {
	let { theme: i, scales: a } = K(), [o] = w(() => new A.Value(.4));
	return b(() => {
		let e = A.loop(A.sequence([A.timing(o, {
			toValue: 1,
			duration: 800,
			useNativeDriver: !0
		}), A.timing(o, {
			toValue: .4,
			duration: 800,
			useNativeDriver: !0
		})]));
		return e.start(), () => e.stop();
	}, [o]), /* @__PURE__ */ E(A.View, { style: [{
		width: e,
		height: t,
		backgroundColor: i.surface.tertiary,
		borderRadius: n ?? a.borderRadius.md,
		opacity: o
	}, r] });
}
function Ge({ lines: e = 3 }) {
	return /* @__PURE__ */ E(U, {
		style: { gap: 8 },
		children: Array.from({ length: e }).map((t, n) => /* @__PURE__ */ E(Z, {
			height: 12,
			width: n === e - 1 ? "60%" : "100%"
		}, n))
	});
}
var Ke = {
	warningFrom: 80,
	cautionFrom: 100
};
function qe(e, t, n) {
	return n ? 45 : t === 0 ? 0 : Math.min(100, Math.max(0, e / t * 100));
}
function Je(e) {
	return e === "accent" ? "default" : e;
}
function Ye(e, t, n) {
	if (!n) return t;
	let r = n === !0 ? Ke : {
		...Ke,
		...n
	};
	return r.successBelow != null && e < r.successBelow ? "success" : r.cautionFrom != null && e >= r.cautionFrom ? "caution" : r.warningFrom != null && e >= r.warningFrom || r.warningBelow != null && e < r.warningBelow ? "warning" : t;
}
function Xe(e, t, n, r, i) {
	let a = n ?? Je(t);
	return i ? a : Ye(e, a, r);
}
//#endregion
//#region src/native/components/Progress.tsx
function Ze({ value: e, max: t = 100, height: n = 8, tone: r = "accent", variant: i, autoColor: a, masked: o }) {
	let { theme: s, scales: c } = K(), l = qe(e, t, o), u = Xe(l, r, i, a, o), d = {
		default: s.brand.primary,
		success: s.success.base,
		warning: s.warning.base,
		caution: s.caution.base
	}[u];
	return /* @__PURE__ */ E(U, {
		style: {
			width: "100%",
			height: n,
			borderRadius: c.borderRadius.full,
			backgroundColor: s.surface.tertiary,
			overflow: "hidden"
		},
		children: /* @__PURE__ */ E(U, { style: {
			width: `${l}%`,
			height: "100%",
			backgroundColor: d,
			borderRadius: c.borderRadius.full
		} })
	});
}
//#endregion
//#region src/native/components/ProgressRing.tsx
function Qe({ value: e, max: t = 100, size: n = 64, thickness: r = 6, showLabel: i = !0 }) {
	let { theme: a } = K(), o = Math.min(100, Math.max(0, e / t * 100)), s = o / 100 * 360, c = a.surface.tertiary, l = a.brand.primary, u = n / 2, d = (e) => /* @__PURE__ */ E(U, {
		style: {
			position: "absolute",
			width: n,
			height: n,
			transform: [{ rotate: `${e}deg` }]
		},
		children: /* @__PURE__ */ E(U, { style: {
			position: "absolute",
			width: u,
			height: n,
			backgroundColor: l,
			borderTopLeftRadius: u,
			borderBottomLeftRadius: u
		} })
	});
	return /* @__PURE__ */ D(U, {
		style: {
			width: n,
			height: n,
			alignItems: "center",
			justifyContent: "center"
		},
		children: [
			/* @__PURE__ */ E(U, { style: {
				position: "absolute",
				width: n,
				height: n,
				borderRadius: n / 2,
				backgroundColor: c
			} }),
			s > 0 && d(0),
			s > 180 && d(180),
			s > 0 && s < 180 && /* @__PURE__ */ E(U, {
				style: {
					position: "absolute",
					width: n,
					height: n,
					transform: [{ rotate: `${s - 180}deg` }]
				},
				children: /* @__PURE__ */ E(U, { style: {
					position: "absolute",
					right: 0,
					width: u,
					height: n,
					backgroundColor: c,
					borderTopRightRadius: u,
					borderBottomRightRadius: u
				} })
			}),
			s >= 180 && s < 360 && /* @__PURE__ */ E(U, {
				style: {
					position: "absolute",
					width: n,
					height: n,
					transform: [{ rotate: `${s}deg` }]
				},
				children: /* @__PURE__ */ E(U, { style: {
					position: "absolute",
					right: 0,
					width: u,
					height: n,
					backgroundColor: c,
					borderTopRightRadius: u,
					borderBottomRightRadius: u
				} })
			}),
			/* @__PURE__ */ E(U, {
				style: {
					width: n - r * 2,
					height: n - r * 2,
					borderRadius: (n - r * 2) / 2,
					backgroundColor: a.surface.primary,
					alignItems: "center",
					justifyContent: "center"
				},
				children: i && /* @__PURE__ */ D(V, {
					style: [q("label.sm"), { color: a.text["high-emphasis"] }],
					children: [Math.round(o), "%"]
				})
			})
		]
	});
}
//#endregion
//#region src/native/components/StarRating.tsx
function $e({ value: e, max: t = 5, size: n = 20, onChange: r, readOnly: i = !1 }) {
	let { theme: a } = K(), o = a.object.rating, s = a.object["low-emphasis"], c = Math.max(0, Math.min(t, e));
	return /* @__PURE__ */ E(U, {
		style: {
			flexDirection: "row",
			gap: 2
		},
		children: Array.from({ length: t }).map((e, t) => {
			let a = t + 1 <= c, l = !a && t + .5 <= c, u = /* @__PURE__ */ E(V, {
				style: {
					fontSize: n,
					color: a || l ? o : s,
					opacity: l ? .5 : 1
				},
				children: l || a ? "★" : "☆"
			});
			return i || !r ? /* @__PURE__ */ E(U, { children: u }, t) : /* @__PURE__ */ E(R, {
				onPress: () => r(t + 1),
				hitSlop: 8,
				children: u
			}, t);
		})
	});
}
//#endregion
//#region src/native/components/NotificationBadge.tsx
function et({ count: e = 0, max: t = 99, dot: n = !1, children: r }) {
	let { theme: i, scales: a } = K();
	return r ? /* @__PURE__ */ D(U, {
		style: { position: "relative" },
		children: [r, (n || e > 0) && /* @__PURE__ */ E(U, {
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
			children: !n && /* @__PURE__ */ E(V, {
				style: [q("label.xs"), { color: i.text["on-inverse"] }],
				children: e > t ? `${t}+` : e
			})
		})]
	}) : n ? /* @__PURE__ */ E(U, { style: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: i.caution.base
	} }) : /* @__PURE__ */ E(U, {
		style: {
			minWidth: 18,
			paddingHorizontal: 6,
			height: 18,
			borderRadius: a.borderRadius.full,
			backgroundColor: i.caution.base,
			alignItems: "center",
			justifyContent: "center"
		},
		children: /* @__PURE__ */ E(V, {
			style: [q("label.xs"), { color: i.text["on-inverse"] }],
			children: e > t ? `${t}+` : e
		})
	});
}
//#endregion
//#region src/native/components/StatCard.tsx
function tt({ label: e, value: t, delta: n, trend: r = "neutral" }) {
	let { theme: i, scales: a } = K(), o = r === "up" ? i.text.success : r === "down" ? i.text.caution : i.text["low-emphasis"];
	return /* @__PURE__ */ D(U, {
		style: {
			backgroundColor: i.surface.primary,
			borderColor: i.border["low-emphasis"],
			borderWidth: 1,
			borderRadius: a.borderRadius.lg,
			padding: a.spacing.scale[4],
			gap: a.spacing.scale[1]
		},
		children: [
			/* @__PURE__ */ E(V, {
				style: [q("label.sm"), { color: i.text["low-emphasis"] }],
				children: e
			}),
			/* @__PURE__ */ E(V, {
				style: [q("heading.2xl"), { color: i.text["high-emphasis"] }],
				children: t
			}),
			n && /* @__PURE__ */ D(V, {
				style: [q("label.sm"), { color: o }],
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
function nt({ status: e, label: t }) {
	let { theme: n, scales: r } = K(), i = {
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
	return /* @__PURE__ */ D(U, {
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
		children: [e === "syncing" ? /* @__PURE__ */ E(k, {
			size: "small",
			color: i.fg
		}) : /* @__PURE__ */ E(U, { style: {
			width: 6,
			height: 6,
			borderRadius: 3,
			backgroundColor: i.dot
		} }), /* @__PURE__ */ E(V, {
			style: [q("label.xs"), { color: i.fg }],
			children: t ?? i.def
		})]
	});
}
//#endregion
//#region src/native/components/CountdownTimer.tsx
function rt(e) {
	return e.toString().padStart(2, "0");
}
function it({ target: e, onComplete: t, tone: n = "neutral" }) {
	let { theme: r, scales: i } = K(), a = e instanceof Date ? e.getTime() : e, [o, s] = w(() => Date.now());
	b(() => {
		let e = setInterval(() => {
			let n = Date.now();
			s(n), n >= a && (clearInterval(e), t?.());
		}, 1e3);
		return () => clearInterval(e);
	}, [a, t]);
	let c = Math.max(0, a - o), l = Math.floor(c / 1e3), u = Math.floor(l / 86400), d = Math.floor(l % 86400 / 3600), f = Math.floor(l % 3600 / 60), p = l % 60, m = n === "accent" ? r.text["accent-primary"] : n === "caution" ? r.text.caution : r.text["high-emphasis"], h = (e, t) => /* @__PURE__ */ D(U, {
		style: {
			alignItems: "center",
			minWidth: 48
		},
		children: [/* @__PURE__ */ E(U, {
			style: {
				backgroundColor: r.surface.secondary,
				paddingVertical: i.spacing.scale[1],
				paddingHorizontal: i.spacing.scale[2],
				borderRadius: i.borderRadius.md
			},
			children: /* @__PURE__ */ E(V, {
				style: [q("heading.md"), { color: m }],
				children: rt(e)
			})
		}), /* @__PURE__ */ E(V, {
			style: [q("label.xs"), {
				color: r.text["low-emphasis"],
				marginTop: 2
			}],
			children: t
		})]
	});
	return /* @__PURE__ */ D(U, {
		style: {
			flexDirection: "row",
			gap: i.spacing.scale[2]
		},
		children: [
			u > 0 && h(u, "日"),
			h(d, "時間"),
			h(f, "分"),
			h(p, "秒")
		]
	});
}
//#endregion
//#region src/native/components/use-reduce-motion.ts
function at() {
	let [e, t] = w(!1);
	return b(() => {
		let e = !0;
		O.isReduceMotionEnabled().then((n) => {
			e && t(n);
		});
		let n = O.addEventListener("reduceMotionChanged", t);
		return () => {
			e = !1, n.remove();
		};
	}, []), e;
}
//#endregion
//#region src/native/modal-reveal-lifecycle.ts
function ot({ animationFallbackDelay: e, showFallbackDelay: t }) {
	let n = 0, r = null, i = !1, a = () => {
		r &&= (clearTimeout(r), null);
	}, o = () => {
		n += 1, i = !1, a();
	}, s = (e, t) => {
		let i = n;
		r = setTimeout(() => {
			n === i && (r = null, t());
		}, e);
	};
	return {
		cancel: o,
		onOpen: (e) => {
			o(), s(t, () => {
				i = !0, e();
			});
		},
		onModalShow: (t, r) => {
			if (i) {
				a();
				return;
			}
			o();
			let c = n;
			s(e, r), t((e) => {
				n === c && (a(), e || r());
			});
		}
	};
}
function st(e, t, n) {
	let r = !1, i = setTimeout(() => {
		i = null, r || n();
	}, e), a = () => {
		i &&= (clearTimeout(i), null);
	};
	return t((e) => {
		a(), !r && !e && n();
	}), () => {
		r = !0, a();
	};
}
//#endregion
//#region src/native/components/Celebration.tsx
var ct = [
	"brand",
	"success",
	"warning",
	"caution",
	"info"
], lt = ct;
function Q(e) {
	let t = Math.sin(e * 999) * 1e4;
	return t - Math.floor(t);
}
function ut(e) {
	let [t] = w(() => new A.Value(e));
	return t;
}
var dt = 1150, ft = 600, pt = 800, mt = 1e3, ht = 0, gt = 360, _t = 120, vt = 280, yt = 12, bt = 28;
function xt({ active: e = !0, trigger: t = "confetti", placement: n = "overlay", effect: r = "fall", emoji: i = "🎉", title: a, description: o, actions: s, interactive: c = !1, cardless: l = !1, particleCount: u = 36, durationMs: d = 2600, duration: f, colors: p, driftRange: m = 160, emojiAnimation: h = "pop", autoDismissMs: g, onTapDismiss: _, onDone: y, style: x, cardStyle: T, testID: O }) {
	let { theme: k, scales: j } = K(), N = at(), P = g ?? d, ee = r === "burst", F = f ?? (ee ? dt : P), I = p && p.length > 0 ? p : ct, ne = t === "confetti" || t === "both", L = !l && (t === "confetti" || t === "emoji" || t === "both"), z = !!(_ || c), B = n === "overlay", H = ut(.94), W = ut(0), G = ut(0), re = S(() => Array.from({ length: u }, (e, t) => {
		let n = {
			id: t,
			delay: Math.round(ee ? Q(t + 11) * 80 : Q(t + 11) * 420),
			duration: Math.round(F * (.78 + Q(t + 21) * .44)),
			rotate: Math.round(Q(t + 41) * 720),
			size: 6 + Math.round(Q(t + 51) * 6),
			color: I[t % I.length]
		};
		if (ee) {
			let e = (ht + Q(t + 61) * (gt - ht)) * Math.PI / 180, r = (Q(t + 31) - .5) * m, i = Math.max(40, _t + Q(t + 71) * (vt - _t) + r), a = yt + Q(t + 81) * (bt - yt), o = Math.round(Math.cos(e) * i), s = Math.round(Math.sin(e) * i + a);
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
			left: Math.round(Q(t + 1) * 100),
			drift: Math.round((Q(t + 31) - .5) * m),
			finalX: 0,
			finalY: 0
		};
	}), [
		u,
		F,
		m,
		I,
		ee
	]), J = C(e), [Y] = w(() => ot({
		animationFallbackDelay: ft,
		showFallbackDelay: pt
	})), ie = v(() => {
		J.current && (W.stopAnimation(), H.stopAnimation(), W.setValue(1), H.setValue(1));
	}, [W, H]), ae = v((e) => {
		H.setValue(.94), W.setValue(0), A.parallel([A.timing(W, {
			toValue: 1,
			duration: 160,
			easing: M.out(M.quad),
			useNativeDriver: !0
		}), A.spring(H, {
			toValue: 1,
			friction: 7,
			tension: 110,
			useNativeDriver: !0
		})]).start(({ finished: t }) => e(t));
	}, [W, H]);
	b(() => {
		if (J.current = e, Y.cancel(), e) {
			if (!B) {
				ae(() => {});
				return;
			}
			H.setValue(.94), W.setValue(0), Y.onOpen(ie);
		}
	}, [
		e,
		B,
		W,
		H,
		ie,
		Y,
		ae
	]), b(() => () => Y.cancel(), [Y]);
	let oe = () => {
		Y.onModalShow(ae, ie);
	};
	if (b(() => {
		if (!e || h !== "bounce") return;
		if (N) {
			G.setValue(1);
			return;
		}
		G.setValue(0);
		let t = A.sequence([
			A.delay(200),
			A.timing(G, {
				toValue: 1.4,
				duration: 300,
				easing: M.out(M.quad),
				useNativeDriver: !0
			}),
			A.timing(G, {
				toValue: .9,
				duration: 120,
				easing: M.out(M.quad),
				useNativeDriver: !0
			}),
			A.timing(G, {
				toValue: 1,
				duration: 180,
				easing: M.out(M.quad),
				useNativeDriver: !0
			})
		]), n = st(mt, (e) => t.start(({ finished: t }) => e(t)), () => G.setValue(1));
		return () => {
			n(), t.stop();
		};
	}, [
		e,
		h,
		G,
		N
	]), b(() => {
		if (!e || !y) return;
		let t = setTimeout(y, P);
		return () => clearTimeout(t);
	}, [
		e,
		y,
		P
	]), !e || t === "none") return null;
	let se = () => {
		if (_) {
			_();
			return;
		}
		c && y?.();
	}, ce = /* @__PURE__ */ D(U, {
		pointerEvents: "box-none",
		testID: O,
		accessibilityRole: "alert",
		accessibilityLiveRegion: "polite",
		style: [B ? {
			flex: 1,
			alignItems: "center",
			justifyContent: "center"
		} : {
			position: "relative",
			minHeight: L ? 180 : 80,
			alignItems: "center",
			justifyContent: "center",
			overflow: "hidden"
		}, x],
		children: [
			ne && /* @__PURE__ */ E(U, {
				pointerEvents: "none",
				style: {
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					overflow: "hidden"
				},
				children: re.map((e) => ee ? /* @__PURE__ */ E(wt, {
					color: St(k, e.color),
					delay: e.delay,
					duration: e.duration,
					finalX: e.finalX,
					finalY: e.finalY,
					rotate: e.rotate,
					size: e.size
				}, e.id) : /* @__PURE__ */ E(Ct, {
					color: St(k, e.color),
					delay: e.delay,
					duration: e.duration,
					drift: e.drift,
					left: `${e.left}%`,
					rotate: e.rotate,
					size: e.size
				}, e.id))
			}),
			z && /* @__PURE__ */ E(R, {
				accessibilityLabel: "閉じる",
				onPress: se,
				style: {
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0
				}
			}),
			L && /* @__PURE__ */ E(A.View, {
				style: {
					opacity: W,
					transform: [{ scale: H }]
				},
				children: /* @__PURE__ */ D(R, {
					onPress: z ? se : void 0,
					style: [{
						width: "100%",
						maxWidth: 360,
						marginHorizontal: j.spacing.scale[4],
						alignItems: "center",
						borderRadius: j.borderRadius["2xl"],
						borderWidth: 1,
						borderColor: k.border["low-emphasis"],
						backgroundColor: k.surface.primary,
						paddingHorizontal: j.spacing.scale[6],
						paddingVertical: j.spacing.scale[5],
						shadowColor: k.overlay.dark,
						shadowOffset: {
							width: 0,
							height: 12
						},
						shadowOpacity: .14,
						shadowRadius: 24,
						elevation: 10
					}, T],
					children: [
						i && /* @__PURE__ */ E(A.Text, {
							style: [
								q("display.lg"),
								{ marginBottom: j.spacing.scale[3] },
								h === "bounce" ? { transform: [{ scale: G }] } : null
							],
							children: i
						}),
						a && /* @__PURE__ */ E(V, {
							style: [q("heading.md"), {
								color: k.text["high-emphasis"],
								textAlign: "center"
							}],
							children: a
						}),
						o && /* @__PURE__ */ E(V, {
							style: [q("body.sm"), {
								color: k.text["medium-emphasis"],
								marginTop: j.spacing.scale[1],
								textAlign: "center"
							}],
							children: o
						}),
						s && /* @__PURE__ */ E(R, {
							onPress: () => {},
							style: {
								marginTop: j.spacing.scale[4],
								width: "100%"
							},
							children: s
						})
					]
				})
			})
		]
	});
	return B ? /* @__PURE__ */ E(te, {
		visible: !0,
		transparent: !0,
		animationType: "none",
		onShow: oe,
		onRequestClose: se,
		children: /* @__PURE__ */ E(U, {
			style: {
				flex: 1,
				backgroundColor: "transparent"
			},
			children: ce
		})
	}) : ce;
}
function St(e, t) {
	return t === "brand" ? e.brand.primary : t === "success" ? e.success.base : t === "warning" ? e.warning.base : t === "caution" ? e.caution.base : t === "info" || lt.includes(t) ? e.info.base : t;
}
function Ct({ color: e, delay: t, duration: n, drift: r, left: i, rotate: a, size: o }) {
	let s = ut(0);
	return b(() => {
		s.setValue(0);
		let e = A.timing(s, {
			toValue: 1,
			duration: n,
			delay: t,
			easing: M.in(M.quad),
			useNativeDriver: !0
		});
		return e.start(), () => e.stop();
	}, [
		t,
		n,
		s
	]), /* @__PURE__ */ E(A.View, { style: {
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
function wt({ color: e, delay: t, duration: n, finalX: r, finalY: i, rotate: a, size: o }) {
	let s = ut(0), c = Math.round(r * .85), l = Math.round(i * .85 - i * .02);
	return b(() => {
		s.setValue(0);
		let e = A.timing(s, {
			toValue: 1,
			duration: n,
			delay: t,
			easing: M.out(M.cubic),
			useNativeDriver: !0
		});
		return e.start(), () => e.stop();
	}, [
		t,
		n,
		s
	]), /* @__PURE__ */ E(A.View, { style: {
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
var Tt = 1e3;
function Et(e) {
	let [t] = w(() => new A.Value(e));
	return t;
}
function Dt({ open: e, onOpenChange: t, icon: n, emoji: r, title: i, description: a, actions: o, autoDismissMs: s, emojiAnimation: c = "pop", effect: l = "burst", particleCount: u, duration: d, colors: f, driftRange: p, testID: m }) {
	let { theme: h, scales: g } = K(), _ = at(), v = Et(0);
	return b(() => {
		if (!e || !s) return;
		let n = setTimeout(() => t(!1), s);
		return () => clearTimeout(n);
	}, [
		e,
		s,
		t
	]), b(() => {
		if (!e || c !== "bounce") return;
		if (_) {
			v.setValue(1);
			return;
		}
		v.setValue(0);
		let t = A.sequence([
			A.delay(200),
			A.timing(v, {
				toValue: 1.4,
				duration: 300,
				easing: M.out(M.quad),
				useNativeDriver: !0
			}),
			A.timing(v, {
				toValue: .9,
				duration: 120,
				easing: M.out(M.quad),
				useNativeDriver: !0
			}),
			A.timing(v, {
				toValue: 1,
				duration: 180,
				easing: M.out(M.quad),
				useNativeDriver: !0
			})
		]), n = st(Tt, (e) => t.start(({ finished: t }) => e(t)), () => v.setValue(1));
		return () => {
			n(), t.stop();
		};
	}, [
		e,
		c,
		v,
		_
	]), e ? /* @__PURE__ */ E(te, {
		visible: e,
		transparent: !0,
		animationType: "fade",
		onRequestClose: () => t(!1),
		children: /* @__PURE__ */ D(R, {
			testID: m,
			onPress: () => t(!1),
			style: {
				flex: 1,
				backgroundColor: h.overlay.dark,
				alignItems: "center",
				justifyContent: "center",
				padding: g.spacing.scale[4]
			},
			children: [/* @__PURE__ */ E(U, {
				pointerEvents: "none",
				style: {
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0
				},
				children: /* @__PURE__ */ E(xt, {
					active: !0,
					trigger: "confetti",
					placement: "overlay",
					cardless: !0,
					effect: l,
					particleCount: u ?? (l === "burst" ? 40 : 36),
					duration: d,
					colors: f,
					driftRange: p
				})
			}), /* @__PURE__ */ D(R, {
				onPress: () => {},
				style: {
					width: "100%",
					maxWidth: 360,
					alignItems: "center",
					backgroundColor: h.surface.primary,
					borderRadius: g.borderRadius["2xl"],
					paddingHorizontal: g.spacing.scale[6],
					paddingVertical: g.spacing.scale[5]
				},
				children: [
					(n || r) && /* @__PURE__ */ D(U, {
						style: {
							width: 80,
							height: 80,
							marginBottom: g.spacing.scale[4],
							alignItems: "center",
							justifyContent: "center"
						},
						children: [
							/* @__PURE__ */ E(U, { style: {
								position: "absolute",
								top: -12,
								left: -12,
								right: -12,
								bottom: -12,
								borderRadius: 999,
								backgroundColor: h.surface["accent-primary-subtle"],
								opacity: .5
							} }),
							/* @__PURE__ */ E(U, { style: {
								position: "absolute",
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								borderRadius: 999,
								backgroundColor: h.surface["accent-primary-light"],
								borderWidth: 1,
								borderColor: h.surface["accent-primary-subtle"]
							} }),
							n ? /* @__PURE__ */ E(A.View, {
								style: c === "bounce" ? { transform: [{ scale: v }] } : void 0,
								children: n
							}) : /* @__PURE__ */ E(A.Text, {
								style: [q("display.lg"), c === "bounce" ? { transform: [{ scale: v }] } : null],
								children: r
							})
						]
					}),
					/* @__PURE__ */ E(V, {
						style: [q("heading.xl"), {
							color: h.text["high-emphasis"],
							textAlign: "center"
						}],
						children: i
					}),
					a && /* @__PURE__ */ E(V, {
						style: [q("body.sm"), {
							color: h.text["medium-emphasis"],
							marginTop: g.spacing.scale[1],
							textAlign: "center"
						}],
						children: a
					}),
					o && /* @__PURE__ */ E(U, {
						style: {
							marginTop: g.spacing.scale[4],
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
function Ot(e) {
	if (e instanceof Date) return e;
	let t = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e);
	return t ? new Date(Number(t[1]), Number(t[2]) - 1, Number(t[3])) : new Date(e);
}
function kt(e) {
	let t = new Date(e);
	return t.setHours(0, 0, 0, 0), t;
}
function At(e) {
	let t = kt(/* @__PURE__ */ new Date()), n = kt(e);
	return Math.round((n.getTime() - t.getTime()) / (1440 * 60 * 1e3));
}
function jt({ targetDate: e, label: t = "残り", todayLabel: n = "本日", pastLabel: r = "経過", unit: i = "days", illustration: a, style: o, testID: s }) {
	let { theme: c, scales: l } = K(), u = At(S(() => Ot(e), [e])), d = u === 0, f = u < 0, p = Math.abs(u), m = d ? n : f ? r : t, h = d ? "0" : String(p);
	return /* @__PURE__ */ D(U, {
		testID: s,
		style: [{ position: "relative" }, o],
		children: [a && /* @__PURE__ */ E(U, {
			pointerEvents: "none",
			style: {
				position: "absolute",
				top: 0,
				right: 0
			},
			children: a
		}), /* @__PURE__ */ D(U, { children: [/* @__PURE__ */ E(V, {
			style: {
				fontSize: 12,
				lineHeight: 14,
				color: c.text["low-emphasis"]
			},
			children: m
		}), /* @__PURE__ */ D(U, {
			style: {
				flexDirection: "row",
				alignItems: "baseline",
				gap: l.spacing.scale[1]
			},
			children: [/* @__PURE__ */ E(V, {
				style: {
					fontFamily: "serif",
					fontWeight: "400",
					fontSize: p >= 100 ? 64 : 88,
					lineHeight: p >= 100 ? 68 : 92,
					color: c.text["accent-primary"]
				},
				children: h
			}), !d && /* @__PURE__ */ E(V, {
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
function Mt({ required: e, children: t, style: n, ...r }) {
	let { theme: i, scales: a } = K();
	return /* @__PURE__ */ D(U, {
		style: [{
			flexDirection: "row",
			alignItems: "center",
			gap: a.spacing.scale[1]
		}, n],
		...r,
		children: [/* @__PURE__ */ E(V, {
			style: [q("label.md"), { color: i.text["high-emphasis"] }],
			children: t
		}), e && /* @__PURE__ */ E(V, {
			style: [q("label.sm"), { color: i.caution.base }],
			children: "*"
		})]
	});
}
//#endregion
//#region src/native/components/Input.tsx
var Nt = L.OS === "web" ? { outlineStyle: "none" } : null, Pt = g.forwardRef(function({ invalid: e, disabled: t, leading: n, trailing: r, ...i }, a) {
	let { theme: o, scales: s } = K(), [c, l] = w(!1), u = e ? o.border.caution : c ? o.border["accent-primary"] : o.border["medium-emphasis"];
	return /* @__PURE__ */ D(U, {
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
			/* @__PURE__ */ E(H, {
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
					q("body.md"),
					{
						flex: 1,
						color: o.text["high-emphasis"],
						paddingVertical: 0
					},
					Nt
				],
				...i
			}),
			r
		]
	});
}), Ft = L.OS === "web" ? { outlineStyle: "none" } : null, It = g.forwardRef(function({ invalid: e, disabled: t, minHeight: n = 96, ...r }, i) {
	let { theme: a, scales: o } = K(), [s, c] = w(!1), l = e ? a.border.caution : s ? a.border["accent-primary"] : a.border["medium-emphasis"];
	return /* @__PURE__ */ E(H, {
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
			q("body.md"),
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
			Ft
		],
		...r
	});
}), Lt = L.OS === "web" ? { outlineStyle: "none" } : null, Rt = g.forwardRef(function({ invalid: e, disabled: t, minHeight: n = 44, maxHeight: r = 200, density: i = "default", ...a }, o) {
	let { theme: s, scales: c } = K(), [l, u] = w(!1), [d, f] = w(n), p = e ? s.border.caution : l ? s.border["accent-primary"] : s.border["medium-emphasis"];
	return /* @__PURE__ */ E(H, {
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
			q("body.md"),
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
			Lt
		],
		...a
	});
});
//#endregion
//#region src/native/use-commit-draft.ts
function zt(e, t) {
	return !e && !t;
}
function Bt(e, t) {
	let [n, r] = h.useState(e), i = h.useRef(!1), a = h.useRef(null);
	return h.useEffect(() => {
		i.current || r(e);
	}, [e]), {
		draft: n,
		handleChange: h.useCallback((e, n) => {
			if (r(e), zt(i.current, n)) {
				if (a.current === e) {
					a.current = null;
					return;
				}
				a.current = null, t(e);
			}
		}, [t]),
		handleCompositionStart: h.useCallback(() => {
			i.current = !0;
		}, []),
		handleCompositionEnd: h.useCallback((e) => {
			i.current = !1, r(e), a.current = e, t(e);
		}, [t])
	};
}
//#endregion
//#region src/native/use-web-composition-guard.ts
function Vt(e, t, n) {
	h.useEffect(() => {
		if (L.OS !== "web") return;
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
function Ht({ value: e, onCommit: t, ...n }) {
	let { draft: r, handleChange: i, handleCompositionStart: a, handleCompositionEnd: o } = Bt(e, t), s = h.useRef(null);
	return Vt(s, a, o), /* @__PURE__ */ E(Pt, {
		...n,
		ref: s,
		value: r,
		onChangeText: (e) => i(e)
	});
}
//#endregion
//#region src/native/components/CommitTextarea.tsx
function Ut({ value: e, onCommit: t, ...n }) {
	let { draft: r, handleChange: i, handleCompositionStart: a, handleCompositionEnd: o } = Bt(e, t), s = h.useRef(null);
	return Vt(s, a, o), /* @__PURE__ */ E(It, {
		...n,
		ref: s,
		value: r,
		onChangeText: (e) => i(e)
	});
}
//#endregion
//#region src/native/components/CommitAutoGrowTextarea.tsx
function Wt({ value: e, onCommit: t, ...n }) {
	let { draft: r, handleChange: i, handleCompositionStart: a, handleCompositionEnd: o } = Bt(e, t), s = h.useRef(null);
	return Vt(s, a, o), /* @__PURE__ */ E(Rt, {
		...n,
		ref: s,
		value: r,
		onChangeText: (e) => i(e)
	});
}
//#endregion
//#region src/native/components/Switch.tsx
function Gt({ value: e = !1, onValueChange: t, disabled: n = !1, accessibilityLabel: r, accessibilityHint: i }) {
	let { theme: a } = K();
	return /* @__PURE__ */ E(R, {
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
		children: /* @__PURE__ */ E(U, { style: {
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
function Kt({ checked: e = !1, onChange: t, disabled: n = !1, size: r = 20 }) {
	let { theme: i, scales: a } = K();
	return /* @__PURE__ */ E(R, {
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
		children: e && /* @__PURE__ */ E(U, { style: {
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
function qt({ checked: e = !1, onChange: t, disabled: n = !1, label: r, description: i, accessibilityLabel: a, accessibilityHint: o }) {
	let { theme: s, scales: c } = K();
	return /* @__PURE__ */ D(R, {
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
		children: [/* @__PURE__ */ E(U, {
			pointerEvents: "none",
			accessibilityElementsHidden: !0,
			importantForAccessibility: "no-hide-descendants",
			style: { paddingTop: 2 },
			children: /* @__PURE__ */ E(Kt, {
				checked: e,
				disabled: n
			})
		}), /* @__PURE__ */ D(U, {
			style: {
				flex: 1,
				gap: 2
			},
			children: [/* @__PURE__ */ E(V, {
				style: [q("body.md"), { color: s.text["high-emphasis"] }],
				children: r
			}), i && /* @__PURE__ */ E(V, {
				style: [q("body.sm"), { color: s.text["medium-emphasis"] }],
				children: i
			})]
		})]
	});
}
//#endregion
//#region src/native/components/CheckboxCard.tsx
function Jt({ checked: e = !1, onChange: t, disabled: n = !1, title: r, description: i }) {
	let { theme: a, scales: o } = K();
	return /* @__PURE__ */ D(R, {
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
		children: [/* @__PURE__ */ E(U, {
			style: { paddingTop: 2 },
			children: /* @__PURE__ */ E(Kt, {
				checked: e,
				disabled: n,
				onChange: t
			})
		}), /* @__PURE__ */ D(U, {
			style: {
				flex: 1,
				gap: 2
			},
			children: [/* @__PURE__ */ E(V, {
				style: [q("label.md"), { color: a.text["high-emphasis"] }],
				children: r
			}), i && /* @__PURE__ */ E(V, {
				style: [q("body.sm"), { color: a.text["medium-emphasis"] }],
				children: i
			})]
		})]
	});
}
//#endregion
//#region src/native/components/CheckboxGroup.tsx
function Yt({ options: e, values: t = [], onChange: n, disabled: r = !1 }) {
	let { scales: i } = K(), a = (e) => {
		t.includes(e) ? n?.(t.filter((t) => t !== e)) : n?.([...t, e]);
	};
	return /* @__PURE__ */ E(U, {
		style: { gap: i.spacing.scale[3] },
		children: e.map((e) => /* @__PURE__ */ E(qt, {
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
function Xt({ options: e, value: t, onChange: n, disabled: r = !1 }) {
	let { theme: i, scales: a } = K();
	return /* @__PURE__ */ E(U, {
		style: { gap: a.spacing.scale[3] },
		children: e.map((e) => {
			let o = t === e.value, s = r || e.disabled;
			return /* @__PURE__ */ D(R, {
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
				children: [/* @__PURE__ */ E(U, {
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
					children: o && /* @__PURE__ */ E(U, { style: {
						width: 10,
						height: 10,
						borderRadius: 5,
						backgroundColor: i.brand.primary
					} })
				}), /* @__PURE__ */ D(U, {
					style: {
						flex: 1,
						gap: 2
					},
					children: [/* @__PURE__ */ E(V, {
						style: [q("body.md"), { color: i.text["high-emphasis"] }],
						children: e.label
					}), e.description && /* @__PURE__ */ E(V, {
						style: [q("body.sm"), { color: i.text["medium-emphasis"] }],
						children: e.description
					})]
				})]
			}, e.value);
		})
	});
}
//#endregion
//#region src/native/components/Slider.tsx
function Zt({ value: e, onChange: t, min: n = 0, max: r = 100, step: i = 1, disabled: a = !1 }) {
	let { theme: o, scales: s } = K(), [c, l] = w(0), u = (e) => Math.max(n, Math.min(r, e)), d = (e) => i ? Math.round(e / i) * i : e, f = (e) => {
		if (!c) return;
		let i = Math.max(0, Math.min(1, e / c)), a = u(d(n + (r - n) * i));
		t?.(a);
	}, p = (u(e) - n) / (r - n);
	return /* @__PURE__ */ D(U, {
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
			/* @__PURE__ */ E(U, { style: {
				height: 6,
				borderRadius: s.borderRadius.full,
				backgroundColor: o.surface.tertiary
			} }),
			/* @__PURE__ */ E(U, { style: {
				position: "absolute",
				left: 0,
				height: 6,
				width: c * p,
				borderRadius: s.borderRadius.full,
				backgroundColor: o.brand.primary
			} }),
			/* @__PURE__ */ E(U, { style: {
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
function Qt({ value: e, onChange: t, min: n = 0, max: r = 99, step: i = 1, disabled: a = !1 }) {
	let { theme: o, scales: s } = K(), c = (e) => Math.max(n, Math.min(r, e));
	return /* @__PURE__ */ D(U, {
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
			/* @__PURE__ */ E(R, {
				onPress: () => !a && t?.(c(e - i)),
				disabled: a || e <= n,
				style: ({ pressed: e }) => ({
					width: 40,
					height: 44,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: e ? o.active["tertiary-button"] : "transparent"
				}),
				children: /* @__PURE__ */ E(V, {
					style: [q("heading.md"), { color: o.text["high-emphasis"] }],
					children: "−"
				})
			}),
			/* @__PURE__ */ E(H, {
				value: String(e),
				onChangeText: (e) => {
					let n = Number(e.replace(/[^0-9-]/g, ""));
					Number.isNaN(n) || t?.(c(n));
				},
				keyboardType: "number-pad",
				editable: !a,
				style: [q("body.md"), {
					width: 56,
					textAlign: "center",
					color: o.text["high-emphasis"],
					paddingVertical: 0,
					borderLeftWidth: 1,
					borderRightWidth: 1,
					borderColor: o.border["low-emphasis"]
				}]
			}),
			/* @__PURE__ */ E(R, {
				onPress: () => !a && t?.(c(e + i)),
				disabled: a || e >= r,
				style: ({ pressed: e }) => ({
					width: 40,
					height: 44,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: e ? o.active["tertiary-button"] : "transparent"
				}),
				children: /* @__PURE__ */ E(V, {
					style: [q("heading.md"), { color: o.text["high-emphasis"] }],
					children: "＋"
				})
			})
		]
	});
}
//#endregion
//#region src/native/components/FormField.tsx
function $t({ label: e, required: t, description: n, error: r, children: i }) {
	let { theme: a, scales: o } = K();
	return /* @__PURE__ */ D(U, {
		style: { gap: o.spacing.scale[2] },
		children: [
			e && /* @__PURE__ */ E(Mt, {
				required: t,
				children: e
			}),
			n && !r && /* @__PURE__ */ E(V, {
				style: [q("body.sm"), { color: a.text["medium-emphasis"] }],
				children: n
			}),
			i,
			r && /* @__PURE__ */ E(V, {
				style: [q("body.sm"), { color: a.text.caution }],
				children: r
			})
		]
	});
}
//#endregion
//#region src/native/components/Form.tsx
function en({ style: e, children: t, ...n }) {
	let { scales: r } = K();
	return /* @__PURE__ */ E(U, {
		style: [{ gap: r.spacing.scale[6] }, e],
		...n,
		children: t
	});
}
function tn({ title: e, description: t, style: n, children: r, ...i }) {
	let { theme: a, scales: o } = K();
	return /* @__PURE__ */ D(U, {
		style: [{ gap: o.spacing.scale[4] }, n],
		...i,
		children: [(e || t) && /* @__PURE__ */ D(U, {
			style: { gap: o.spacing.scale[1] },
			children: [e && /* @__PURE__ */ E(J, {
				variant: "heading.md",
				children: e
			}), t && /* @__PURE__ */ E(J, {
				variant: "body.sm",
				color: a.text["medium-emphasis"],
				children: t
			})]
		}), r]
	});
}
function nn({ style: e, children: t, ...n }) {
	let { scales: r } = K();
	return /* @__PURE__ */ E(ke, {
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
function rn({ tone: e = "info", title: t, description: n, children: r }) {
	let { theme: i, scales: a } = K(), o = {
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
	return /* @__PURE__ */ D(U, {
		style: {
			backgroundColor: o.bg,
			borderColor: o.border,
			borderLeftWidth: 4,
			borderRadius: a.borderRadius.md,
			padding: a.spacing.scale[3],
			gap: a.spacing.scale[1]
		},
		children: [
			t && /* @__PURE__ */ E(V, {
				style: [q("label.md"), { color: o.fg }],
				children: t
			}),
			n && /* @__PURE__ */ E(V, {
				style: [q("body.sm"), { color: i.text["high-emphasis"] }],
				children: n
			}),
			r
		]
	});
}
//#endregion
//#region src/native/components/Dialog.tsx
function an({ open: e, onClose: t, title: n, description: r, footer: i, children: a, dismissOnBackdrop: o = !0 }) {
	let { theme: s, scales: c } = K();
	return /* @__PURE__ */ E(te, {
		visible: e,
		transparent: !0,
		animationType: "fade",
		onRequestClose: t,
		children: /* @__PURE__ */ E(R, {
			onPress: () => o && t(),
			style: {
				flex: 1,
				backgroundColor: s.overlay.dark,
				alignItems: "center",
				justifyContent: "center",
				padding: c.spacing.scale[4]
			},
			children: /* @__PURE__ */ D(R, {
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
					n && /* @__PURE__ */ E(V, {
						style: [q("heading.lg"), { color: s.text["high-emphasis"] }],
						children: n
					}),
					r && /* @__PURE__ */ E(V, {
						style: [q("body.md"), { color: s.text["medium-emphasis"] }],
						children: r
					}),
					a,
					i && /* @__PURE__ */ E(U, {
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
function on({ open: e, onClose: t, title: n, description: r, confirmLabel: i = "OK", cancelLabel: a = "キャンセル", onConfirm: o, destructive: s = !1 }) {
	return /* @__PURE__ */ E(an, {
		open: e,
		onClose: t,
		title: n,
		description: r,
		dismissOnBackdrop: !1,
		footer: /* @__PURE__ */ D(T, { children: [/* @__PURE__ */ E(U, {
			style: { minWidth: 100 },
			children: /* @__PURE__ */ E(X, {
				variant: "tertiary",
				onPress: t,
				children: a
			})
		}), /* @__PURE__ */ E(U, {
			style: { minWidth: 100 },
			children: /* @__PURE__ */ E(X, {
				variant: s ? "destructive" : "primary",
				onPress: () => {
					o?.(), t();
				},
				children: i
			})
		})] })
	});
}
function sn(e, t) {
	return t.animating || Math.abs(e) < 6 ? !1 : t.active === t.maxSnap ? e > 0 && t.scrollTop <= 0 : !0;
}
function cn(e, t, n) {
	let r = e + t;
	if (r < 0) return Math.max(-4, r / 4);
	let i = n.dismissible ? n.panelH : (n.maxSnap - n.minSnap) * n.H;
	if (r > i) {
		let e = r - i;
		r = i + Math.min(4, e / 4);
	}
	return r;
}
function ln(e, t, n, r) {
	let { points: i, minSnap: a, maxSnap: o, panelH: s, H: c, dismissible: l } = r;
	if (n === o && t < 0) return {
		kind: "snap",
		snap: o
	};
	if (t < -20) {
		let e = i.indexOf(n);
		return {
			kind: "snap",
			snap: e >= 0 && e < i.length - 1 ? i[e + 1] : o
		};
	}
	if (t > 0) {
		if (l && n === a && t > s * .18) return { kind: "close" };
		if (n === o) {
			let e = (o - a) * c;
			if (l && t > e + s * .18) return { kind: "close" };
			if (t > 40) return {
				kind: "snap",
				snap: a
			};
		}
	}
	let u = o - Math.max(0, Math.min(s, e + t)) / c, d = i[0], f = Math.abs(i[0] - u);
	for (let e = 1; e < i.length; e++) {
		let t = Math.abs(i[e] - u);
		t < f && (f = t, d = i[e]);
	}
	return {
		kind: "snap",
		snap: d
	};
}
//#endregion
//#region src/native/components/Sheet.tsx
var un = 800;
function $(e) {
	let { side: t = "bottom", snapPoints: n } = e;
	return n && n.length > 0 && t === "bottom" ? /* @__PURE__ */ E(_n, { ...e }) : /* @__PURE__ */ E(pn, { ...e });
}
var dn = 220, fn = 340;
function pn({ open: e, onClose: t, side: n = "bottom", title: r, children: i }) {
	let { theme: a, scales: o } = K(), [s] = w(() => new A.Value(0)), c = C(e), [l] = w(() => ot({
		animationFallbackDelay: fn,
		showFallbackDelay: un
	})), u = v(() => {
		c.current && (s.stopAnimation(), s.setValue(1));
	}, [s]);
	b(() => {
		c.current = e, l.cancel(), s.stopAnimation(), s.setValue(0), e && l.onOpen(u);
	}, [
		e,
		s,
		l,
		u
	]), b(() => () => l.cancel(), [l]);
	let d = () => {
		l.onModalShow((e) => {
			s.stopAnimation(), s.setValue(0), A.timing(s, {
				toValue: 1,
				duration: dn,
				useNativeDriver: !0
			}).start(({ finished: t }) => e(t));
		}, u);
	}, { width: f, height: p } = j.get("window"), m = {
		bottom: { translateY: s.interpolate({
			inputRange: [0, 1],
			outputRange: [p, 0]
		}) },
		top: { translateY: s.interpolate({
			inputRange: [0, 1],
			outputRange: [-p, 0]
		}) },
		left: { translateX: s.interpolate({
			inputRange: [0, 1],
			outputRange: [-f, 0]
		}) },
		right: { translateX: s.interpolate({
			inputRange: [0, 1],
			outputRange: [f, 0]
		}) }
	};
	return /* @__PURE__ */ E(te, {
		visible: e,
		transparent: !0,
		animationType: "none",
		onShow: d,
		onRequestClose: t,
		children: /* @__PURE__ */ E(R, {
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
			children: /* @__PURE__ */ E(A.View, {
				style: {
					transform: [m[n].translateX ? { translateX: m[n].translateX } : { translateX: 0 }, m[n].translateY ? { translateY: m[n].translateY } : { translateY: 0 }],
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
				children: /* @__PURE__ */ D(R, {
					onPress: () => {},
					children: [
						n === "bottom" && /* @__PURE__ */ E(U, { style: {
							width: 40,
							height: 4,
							borderRadius: 2,
							backgroundColor: a.border["medium-emphasis"],
							alignSelf: "center",
							marginBottom: o.spacing.scale[2]
						} }),
						r && /* @__PURE__ */ E(V, {
							style: [q("heading.md"), { color: a.text["high-emphasis"] }],
							children: r
						}),
						/* @__PURE__ */ E(U, {
							style: { marginTop: o.spacing.scale[2] },
							children: i
						})
					]
				})
			})
		})
	});
}
var mn = 180, hn = 300;
function gn(e, t, n) {
	return Math.max(t, Math.min(n, e));
}
function _n({ open: e, onClose: t, title: n, children: r, snapPoints: i, initialSnap: a, footer: o, dismissible: s = !0 }) {
	let { theme: c, scales: l } = K(), u = S(() => {
		let e = [...i ?? [.55, .92]].map((e) => gn(e, .1, .99)).sort((e, t) => e - t);
		return e.length > 0 ? e : [.55, .92];
	}, [i]), d = u[0], f = u[u.length - 1], p = j.get("window").height, m = typeof globalThis < "u" && globalThis.window?.innerHeight, h = p > 0 ? p : m && m > 0 ? m : 700, g = Math.round(h * f), [_, y] = w(0), x = gn(a ?? d, d, f), T = (f - x) * h, O = C(x), [k] = w(() => new A.Value(g)), N = C(g), P = C(!1), ee = C(e), F = C(0), I = C({
		points: u,
		minSnap: d,
		maxSnap: f,
		panelH: g,
		H: h,
		dismissible: s,
		onClose: t
	}), [L] = w(() => ot({
		animationFallbackDelay: hn,
		showFallbackDelay: un
	}));
	b(() => {
		I.current = {
			points: u,
			minSnap: d,
			maxSnap: f,
			panelH: g,
			H: h,
			dismissible: s,
			onClose: t
		};
	}, [
		u,
		d,
		f,
		g,
		h,
		s,
		t
	]);
	let B = v((e) => {
		N.current = e, k.setValue(e);
	}, [k]), H = v((e, t, n) => {
		P.current = !0, A.timing(k, {
			toValue: e,
			duration: t,
			easing: M.out(M.cubic),
			useNativeDriver: !0
		}).start(({ finished: t }) => {
			P.current = !1, t && (N.current = e), n?.(t);
		});
	}, [k]), W = v((e, t = mn, n) => {
		let { maxSnap: r, H: i } = I.current;
		O.current = e, H((r - e) * i, t, n);
	}, [H]), G = C(() => {});
	b(() => {
		G.current = () => {
			ee.current && (k.stopAnimation(), P.current = !1, O.current = x, B(T));
		};
	}, [
		x,
		T,
		k,
		B
	]), b(() => {
		ee.current = e, L.cancel(), k.stopAnimation(), P.current = !1, B(I.current.panelH), e && (F.current = 0, L.onOpen(() => G.current()));
	}, [
		e,
		L,
		k,
		B
	]), b(() => () => L.cancel(), [L]);
	let re = () => {
		L.onModalShow((e) => {
			k.stopAnimation(), B(I.current.panelH), W(x, mn, e);
		}, () => G.current());
	}, J = C(0), Y = C(x), [ie] = w(() => ne.create({
		onStartShouldSetPanResponder: () => !1,
		onMoveShouldSetPanResponder: (e, t) => sn(t.dy, {
			active: O.current,
			maxSnap: I.current.maxSnap,
			scrollTop: F.current,
			animating: P.current
		}),
		onPanResponderGrant: () => {
			J.current = N.current, Y.current = O.current;
		},
		onPanResponderMove: (e, t) => {
			B(cn(J.current, t.dy, I.current));
		},
		onPanResponderRelease: (e, t) => {
			let n = I.current, r = ln(J.current, t.dy, Y.current, n);
			if (r.kind === "close") {
				H(n.panelH, mn, () => n.onClose());
				return;
			}
			W(r.snap);
		}
	})), ae = k.interpolate({
		inputRange: [0, g],
		outputRange: [.4, 0],
		extrapolate: "clamp"
	});
	return /* @__PURE__ */ D(te, {
		visible: e,
		transparent: !0,
		animationType: "none",
		onShow: re,
		onRequestClose: t,
		children: [
			/* @__PURE__ */ E(A.View, {
				pointerEvents: e ? "auto" : "none",
				style: {
					position: "absolute",
					left: 0,
					right: 0,
					top: 0,
					bottom: 0,
					backgroundColor: c.overlay.dark,
					opacity: ae
				},
				children: /* @__PURE__ */ E(R, {
					onPress: s ? t : () => {},
					style: { flex: 1 }
				})
			}),
			/* @__PURE__ */ D(A.View, {
				...ie.panHandlers,
				style: {
					position: "absolute",
					left: 0,
					right: 0,
					bottom: 0,
					height: g,
					backgroundColor: c.surface.primary,
					borderTopLeftRadius: l.borderRadius["2xl"],
					borderTopRightRadius: l.borderRadius["2xl"],
					transform: [{ translateY: k }]
				},
				children: [/* @__PURE__ */ D(U, {
					style: {
						paddingHorizontal: l.spacing.scale[4],
						paddingTop: l.spacing.scale[3]
					},
					children: [/* @__PURE__ */ E(U, { style: {
						width: 40,
						height: 4,
						borderRadius: 2,
						backgroundColor: c.border["medium-emphasis"],
						alignSelf: "center",
						marginBottom: l.spacing.scale[2]
					} }), n && /* @__PURE__ */ E(V, {
						style: [q("heading.md"), {
							color: c.text["high-emphasis"],
							marginBottom: l.spacing.scale[2]
						}],
						children: n
					})]
				}), /* @__PURE__ */ E(z, {
					style: { flex: 1 },
					contentContainerStyle: {
						paddingHorizontal: l.spacing.scale[4],
						paddingBottom: o ? _ + 60 : l.spacing.scale[4]
					},
					onScroll: (e) => {
						F.current = e.nativeEvent.contentOffset.y;
					},
					scrollEventThrottle: 16,
					keyboardShouldPersistTaps: "handled",
					children: r
				})]
			}),
			o && /* @__PURE__ */ E(U, {
				pointerEvents: "box-none",
				onLayout: (e) => y(e.nativeEvent.layout.height),
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
function vn({ header: e, footer: t, children: n, style: r }) {
	let { theme: i } = K();
	return /* @__PURE__ */ D(U, {
		style: [{
			backgroundColor: i.surface.primary,
			flex: 1
		}, r],
		children: [
			e,
			/* @__PURE__ */ E(bn, { children: n }),
			t
		]
	});
}
function yn({ title: e, titleEditor: t, description: n, leading: r, trailing: i, children: a, style: o }) {
	let { theme: s, scales: c } = K(), l = t ?? e;
	return /* @__PURE__ */ D(U, {
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
			/* @__PURE__ */ E(U, {
				style: {
					minHeight: 40,
					justifyContent: "center"
				},
				children: r
			}),
			/* @__PURE__ */ D(U, {
				style: {
					flex: 1,
					minWidth: 0
				},
				children: [
					typeof l == "string" ? /* @__PURE__ */ E(V, {
						style: [q("heading.lg"), { color: s.text["high-emphasis"] }],
						children: l
					}) : l,
					typeof n == "string" ? /* @__PURE__ */ E(V, {
						style: [q("body.sm"), {
							color: s.text["medium-emphasis"],
							marginTop: c.spacing.scale[1]
						}],
						children: n
					}) : n,
					a
				]
			}),
			/* @__PURE__ */ E(U, {
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
function bn({ children: e, style: t }) {
	let { scales: n } = K();
	return /* @__PURE__ */ E(U, {
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
function xn({ behavior: e = "fixed", hideWhenInputFocused: t = e === "hide", children: n, style: r }) {
	let { theme: i, scales: a } = K(), [o, s] = w(!1);
	return b(() => {
		let e = F.addListener("keyboardDidShow", () => s(!0)), t = F.addListener("keyboardDidHide", () => s(!1));
		return () => {
			e.remove(), t.remove();
		};
	}, []), t && o ? null : /* @__PURE__ */ E(U, {
		style: [{
			flexDirection: "row",
			gap: a.spacing.scale[3],
			paddingHorizontal: a.spacing.scale[5],
			paddingTop: a.spacing.scale[3],
			paddingBottom: L.OS === "ios" ? 28 : a.spacing.scale[4],
			backgroundColor: i.surface.primary,
			borderTopWidth: e === "scroll" ? 0 : 1,
			borderTopColor: i.border["low-emphasis"]
		}, r],
		children: n
	});
}
//#endregion
//#region src/native/components/ResponsiveDialog.tsx
function Sn({ breakpoint: e = 600, ...t }) {
	let { width: n } = j.get("window");
	return n <= e ? /* @__PURE__ */ D($, {
		open: t.open,
		onClose: t.onClose,
		side: "bottom",
		title: t.title,
		children: [t.children, t.footer]
	}) : /* @__PURE__ */ E(an, { ...t });
}
//#endregion
//#region src/native/components/Popover.tsx
function Cn({ open: e, onClose: t, anchor: n, children: r }) {
	let { theme: i, scales: a } = K(), o = n ? n.y + (n.height ?? 0) + 4 : 100, s = n ? n.x : 0;
	return /* @__PURE__ */ E(te, {
		visible: e,
		transparent: !0,
		animationType: "fade",
		onRequestClose: t,
		children: /* @__PURE__ */ E(R, {
			onPress: t,
			style: { flex: 1 },
			children: /* @__PURE__ */ E(U, {
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
				children: /* @__PURE__ */ E(R, {
					onPress: () => {},
					children: r
				})
			})
		})
	});
}
//#endregion
//#region src/native/components/DropdownMenu.tsx
function wn({ open: e, onClose: t, anchor: n, items: r }) {
	let { theme: i, scales: a } = K();
	return /* @__PURE__ */ E(Cn, {
		open: e,
		onClose: t,
		anchor: n,
		children: /* @__PURE__ */ E(U, {
			style: { minWidth: 180 },
			children: r.map((e, n) => /* @__PURE__ */ D(g.Fragment, { children: [/* @__PURE__ */ E(R, {
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
				children: /* @__PURE__ */ E(V, {
					style: [q("body.md"), { color: e.destructive ? i.text.caution : i.text["high-emphasis"] }],
					children: e.label
				})
			}), n < r.length - 1 && /* @__PURE__ */ E(We, {})] }, e.key))
		})
	});
}
//#endregion
//#region src/native/components/Toast.tsx
var Tn = _(null);
function En() {
	let e = y(Tn);
	if (!e) throw Error("useToast は ToastProvider の内側で使ってください");
	return e;
}
var Dn = 0;
function On() {
	return Dn += 1, `toast-${Dn}`;
}
var kn = null;
function An(e) {
	kn = e;
}
function jn(e, t = {}, n) {
	return kn ? kn.show({
		title: e,
		description: t.description,
		tone: n ?? t.tone,
		duration: t.duration,
		action: t.action
	}) : (console.warn("[ksk-ds native toast()] ToastProvider がマウントされていないため通知は表示されません。アプリのルートに <ToastProvider> を配置してください。"), "");
}
var Mn = ((e, t) => jn(e, t));
Mn.success = (e, t) => jn(e, t, "success"), Mn.error = (e, t) => jn(e, t, "caution"), Mn.info = (e, t) => jn(e, t, "info"), Mn.warning = (e, t) => jn(e, t, "warning"), Mn.caution = (e, t) => jn(e, t, "caution"), Mn.dismiss = (e) => kn?.dismiss(e);
function Nn({ children: e }) {
	let { scales: t } = K(), [n, r] = w([]), i = v((e) => {
		r((t) => t.filter((t) => t.id !== e));
	}, []), a = v((e) => {
		let t = On();
		r((n) => [...n, {
			...e,
			id: t
		}]);
		let n = e.duration ?? 3e3;
		return n > 0 && setTimeout(() => i(t), n), t;
	}, [i]);
	return b(() => (An({
		show: a,
		dismiss: i
	}), () => An(null)), [a, i]), /* @__PURE__ */ D(Tn.Provider, {
		value: {
			show: a,
			dismiss: i
		},
		children: [e, /* @__PURE__ */ E(U, {
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
			children: n.map((e) => /* @__PURE__ */ E(Pn, {
				toast: e,
				onDismiss: () => i(e.id)
			}, e.id))
		})]
	});
}
function Pn({ toast: e, onDismiss: t }) {
	let { theme: n, scales: r } = K(), [i] = w(() => new A.Value(0)), [a] = w(() => new A.Value(-20));
	b(() => {
		A.parallel([A.timing(i, {
			toValue: 1,
			duration: 180,
			useNativeDriver: !0
		}), A.timing(a, {
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
	return /* @__PURE__ */ D(A.View, {
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
			/* @__PURE__ */ D(U, {
				style: { flex: 1 },
				children: [e.title && /* @__PURE__ */ E(V, {
					style: [q("label.md"), { color: o.fg }],
					children: e.title
				}), e.description && /* @__PURE__ */ E(V, {
					style: [q("body.sm"), { color: o.fg }],
					children: e.description
				})]
			}),
			e.action && /* @__PURE__ */ E(R, {
				onPress: e.action.onPress,
				hitSlop: 8,
				accessibilityRole: "button",
				children: /* @__PURE__ */ E(V, {
					style: [q("label.sm"), {
						color: o.fg,
						textDecorationLine: "underline"
					}],
					children: e.action.label
				})
			}),
			/* @__PURE__ */ E(R, {
				onPress: t,
				hitSlop: 8,
				accessibilityLabel: "閉じる",
				accessibilityRole: "button",
				children: /* @__PURE__ */ E(V, {
					style: [q("label.sm"), { color: o.fg }],
					children: "×"
				})
			})
		]
	});
}
//#endregion
//#region src/native/components/ErrorBoundary.tsx
var Fn = {
	emoji: "😢",
	title: "問題が発生しました",
	description: "データは保持されています。下のボタンで復旧してください。",
	retryLabel: "再試行"
}, In = class extends g.Component {
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
			...Fn,
			...t
		};
		return e ? typeof e == "function" ? e(this.state.error, this.handleRetry) : e : /* @__PURE__ */ E(Ln, {
			merged: n,
			handleRetry: this.handleRetry
		});
	}
};
function Ln({ merged: e, handleRetry: t }) {
	let { theme: n, scales: r } = K();
	return /* @__PURE__ */ D(U, {
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
			/* @__PURE__ */ E(J, {
				style: {
					fontSize: 48,
					textAlign: "center"
				},
				accessibilityElementsHidden: !0,
				importantForAccessibility: "no",
				children: e.emoji
			}),
			/* @__PURE__ */ E(J, {
				variant: "heading.lg",
				style: { textAlign: "center" },
				children: e.title
			}),
			/* @__PURE__ */ E(J, {
				variant: "body.sm",
				color: n.text["medium-emphasis"],
				style: {
					textAlign: "center",
					marginBottom: r.spacing.scale[4]
				},
				children: e.description
			}),
			/* @__PURE__ */ E(X, {
				variant: "secondary",
				onPress: t,
				children: e.retryLabel
			})
		]
	});
}
//#endregion
//#region src/native/components/MenuDrawer.tsx
function Rn({ open: e, onClose: t, side: n = "left", header: r, sections: i, footer: a }) {
	let { theme: o, scales: s } = K();
	return /* @__PURE__ */ D($, {
		open: e,
		onClose: t,
		side: n,
		children: [
			r && /* @__PURE__ */ E(U, {
				style: { marginBottom: s.spacing.scale[3] },
				children: r
			}),
			/* @__PURE__ */ E(z, {
				style: { maxHeight: 480 },
				children: i.map((e, n) => /* @__PURE__ */ D(U, {
					style: { marginBottom: s.spacing.scale[3] },
					children: [e.title && /* @__PURE__ */ E(V, {
						style: [q("label.xs"), {
							color: o.text["low-emphasis"],
							paddingHorizontal: s.spacing.scale[2],
							marginBottom: s.spacing.scale[1]
						}],
						children: e.title
					}), e.items.map((n, r) => /* @__PURE__ */ D(g.Fragment, { children: [/* @__PURE__ */ D(R, {
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
						children: [n.icon, /* @__PURE__ */ E(V, {
							style: [q("body.md"), { color: n.active ? o.text["accent-primary"] : o.text["high-emphasis"] }],
							children: n.label
						})]
					}), r < e.items.length - 1 && /* @__PURE__ */ E(We, {})] }, n.key))]
				}, n))
			}),
			a && /* @__PURE__ */ E(U, {
				style: { marginTop: s.spacing.scale[3] },
				children: a
			})
		]
	});
}
//#endregion
//#region src/native/components/ConfirmDialog.tsx
function zn(e) {
	return /* @__PURE__ */ E(on, { ...e });
}
//#endregion
//#region src/native/components/BottomSheetForm.tsx
function Bn({ open: e, onClose: t, title: n, description: r, footer: i, children: a }) {
	let { theme: o, scales: s } = K();
	return /* @__PURE__ */ D($, {
		open: e,
		onClose: t,
		side: "bottom",
		title: n,
		children: [
			r && /* @__PURE__ */ E(V, {
				style: [q("body.sm"), { color: o.text["medium-emphasis"] }],
				children: r
			}),
			/* @__PURE__ */ E(z, {
				style: { maxHeight: 420 },
				children: /* @__PURE__ */ E(U, {
					style: {
						gap: s.spacing.scale[3],
						paddingVertical: s.spacing.scale[2]
					},
					children: a
				})
			}),
			i && /* @__PURE__ */ E(U, {
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
function Vn({ preset: e = "mobile-full", header: t, footer: n, scrollable: r = !0, children: i, style: a, bodyStyle: o }) {
	let { theme: s, scales: c } = K(), l = e === "mobile-form" ? 520 : e === "desktop-floating" ? 620 : 720, u = E(r ? z : U, {
		style: [{ flex: 1 }, o],
		children: i
	});
	return /* @__PURE__ */ D(U, {
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
function Hn({ open: e, onClose: t, title: n = "レビューを投稿", onSubmit: r }) {
	let { scales: i } = K(), [a, o] = w(0), [s, c] = w("");
	return /* @__PURE__ */ D($, {
		open: e,
		onClose: t,
		side: "bottom",
		title: n,
		children: [
			/* @__PURE__ */ E(U, {
				style: {
					alignItems: "center",
					marginVertical: i.spacing.scale[3]
				},
				children: /* @__PURE__ */ E($e, {
					value: a,
					onChange: o,
					size: 32
				})
			}),
			/* @__PURE__ */ E(It, {
				value: s,
				onChangeText: c,
				placeholder: "コメントを入力",
				minHeight: 120
			}),
			/* @__PURE__ */ D(U, {
				style: {
					flexDirection: "row",
					gap: i.spacing.scale[2],
					marginTop: i.spacing.scale[3]
				},
				children: [/* @__PURE__ */ E(U, {
					style: { flex: 1 },
					children: /* @__PURE__ */ E(X, {
						variant: "tertiary",
						onPress: t,
						children: "キャンセル"
					})
				}), /* @__PURE__ */ E(U, {
					style: { flex: 1 },
					children: /* @__PURE__ */ E(X, {
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
function Un({ title: e, description: t, step: n, total: r, onNext: i, onSkip: a, nextLabel: o = "次へ", skipLabel: s = "スキップ" }) {
	let { theme: c, scales: l } = K();
	return /* @__PURE__ */ D(U, {
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
			e && /* @__PURE__ */ E(V, {
				style: [q("label.lg"), {
					color: c.text["on-inverse"],
					marginBottom: l.spacing.scale[1]
				}],
				children: e
			}),
			/* @__PURE__ */ E(V, {
				style: [q("body.md"), {
					color: c.text["on-inverse-secondary"],
					marginBottom: l.spacing.scale[4]
				}],
				children: t
			}),
			/* @__PURE__ */ D(U, {
				style: {
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					gap: l.spacing.scale[3]
				},
				children: [n !== void 0 && r !== void 0 ? /* @__PURE__ */ E(U, {
					style: {
						flexDirection: "row",
						gap: l.spacing.scale[1],
						alignItems: "center"
					},
					children: Array.from({ length: r }).map((e, t) => {
						let r = t + 1 === n;
						return /* @__PURE__ */ E(U, { style: {
							width: r ? 18 : 6,
							height: 6,
							borderRadius: 3,
							backgroundColor: r ? c.brand.primary : c.text["on-inverse-secondary"],
							opacity: r ? 1 : .4
						} }, t);
					})
				}) : /* @__PURE__ */ E(U, {}), /* @__PURE__ */ D(U, {
					style: {
						flexDirection: "row",
						gap: l.spacing.scale[1],
						alignItems: "center"
					},
					children: [a && /* @__PURE__ */ E(R, {
						onPress: a,
						hitSlop: 6,
						style: ({ pressed: e }) => ({
							paddingVertical: l.spacing.scale[2],
							paddingHorizontal: l.spacing.scale[3],
							opacity: e ? .5 : 1
						}),
						children: /* @__PURE__ */ E(V, {
							style: [q("label.md"), { color: c.text["on-inverse-secondary"] }],
							children: s
						})
					}), i && /* @__PURE__ */ E(R, {
						onPress: i,
						style: ({ pressed: e }) => ({
							paddingVertical: l.spacing.scale[2],
							paddingHorizontal: l.spacing.scale[4],
							borderRadius: l.borderRadius.full,
							backgroundColor: e ? c.active["primary-button"] : c.brand.primary
						}),
						children: /* @__PURE__ */ E(V, {
							style: [q("label.md"), { color: c.text["on-inverse"] }],
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
function Wn({ open: e, onClose: t, highlight: n, children: r }) {
	let { theme: i } = K(), a = i.overlay.dark;
	return /* @__PURE__ */ E(te, {
		visible: e,
		transparent: !0,
		animationType: "fade",
		onRequestClose: t,
		children: /* @__PURE__ */ D(R, {
			onPress: t,
			style: { flex: 1 },
			children: [n ? /* @__PURE__ */ D(T, { children: [
				/* @__PURE__ */ E(U, { style: {
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: n.y,
					backgroundColor: a
				} }),
				/* @__PURE__ */ E(U, { style: {
					position: "absolute",
					top: n.y,
					left: 0,
					width: n.x,
					height: n.height,
					backgroundColor: a
				} }),
				/* @__PURE__ */ E(U, { style: {
					position: "absolute",
					top: n.y,
					left: n.x + n.width,
					right: 0,
					height: n.height,
					backgroundColor: a
				} }),
				/* @__PURE__ */ E(U, { style: {
					position: "absolute",
					top: n.y + n.height,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: a
				} }),
				/* @__PURE__ */ E(U, { style: {
					position: "absolute",
					top: n.y,
					left: n.x,
					width: n.width,
					height: n.height,
					borderRadius: n.radius ?? 12,
					borderWidth: 2,
					borderColor: i.brand.primary
				} })
			] }) : /* @__PURE__ */ E(U, { style: {
				flex: 1,
				backgroundColor: a
			} }), /* @__PURE__ */ E(U, {
				style: {
					position: "absolute",
					left: 0,
					right: 0,
					bottom: 80,
					alignItems: "center"
				},
				children: /* @__PURE__ */ E(R, {
					onPress: () => {},
					children: r
				})
			})]
		})
	});
}
//#endregion
//#region src/native/components/Select.tsx
function Gn({ options: e, value: t, onChange: n, placeholder: r = "選択", disabled: i = !1, title: a = "選択" }) {
	let { theme: o, scales: s } = K(), [c, l] = w(!1), u = e.find((e) => e.value === t);
	return /* @__PURE__ */ D(T, { children: [/* @__PURE__ */ D(R, {
		onPress: () => !i && l(!0),
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
		children: [/* @__PURE__ */ E(V, {
			style: [q("body.md"), { color: u ? o.text["high-emphasis"] : o.text["low-emphasis"] }],
			children: u ? u.label : r
		}), /* @__PURE__ */ E(V, {
			style: [q("label.sm"), { color: o.text["low-emphasis"] }],
			children: "▾"
		})]
	}), /* @__PURE__ */ E($, {
		open: c,
		onClose: () => l(!1),
		side: "bottom",
		title: a,
		children: /* @__PURE__ */ E(U, { children: e.map((r, i) => /* @__PURE__ */ D(g.Fragment, { children: [/* @__PURE__ */ D(R, {
			onPress: () => {
				r.disabled || (n?.(r.value), l(!1));
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
			children: [/* @__PURE__ */ E(V, {
				style: [q("body.md"), { color: o.text["high-emphasis"] }],
				children: r.label
			}), t === r.value && /* @__PURE__ */ E(V, {
				style: [q("label.md"), { color: o.text["accent-primary"] }],
				children: "✓"
			})]
		}), i < e.length - 1 && /* @__PURE__ */ E(We, {})] }, r.value)) })
	})] });
}
//#endregion
//#region src/native/components/Combobox.tsx
function Kn({ options: e, value: t, onChange: n, placeholder: r = "選択", searchPlaceholder: i = "検索", emptyMessage: a = "該当なし", disabled: o = !1 }) {
	let { theme: s, scales: c } = K(), [l, u] = w(!1), [d, f] = w(""), p = e.find((e) => e.value === t), m = S(() => {
		if (!d) return e;
		let t = d.toLowerCase();
		return e.filter((e) => e.label.toLowerCase().includes(t));
	}, [e, d]);
	return /* @__PURE__ */ D(T, { children: [/* @__PURE__ */ D(R, {
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
		children: [/* @__PURE__ */ E(V, {
			style: [q("body.md"), { color: p ? s.text["high-emphasis"] : s.text["low-emphasis"] }],
			children: p ? p.label : r
		}), /* @__PURE__ */ E(V, {
			style: [q("label.sm"), { color: s.text["low-emphasis"] }],
			children: "▾"
		})]
	}), /* @__PURE__ */ D($, {
		open: l,
		onClose: () => u(!1),
		side: "bottom",
		title: "選択",
		children: [/* @__PURE__ */ E(Pt, {
			value: d,
			onChangeText: f,
			placeholder: i
		}), /* @__PURE__ */ E(U, {
			style: {
				height: 360,
				marginTop: c.spacing.scale[2]
			},
			children: m.length === 0 ? /* @__PURE__ */ E(V, {
				style: [q("body.md"), {
					color: s.text["low-emphasis"],
					textAlign: "center",
					paddingVertical: c.spacing.scale[6]
				}],
				children: a
			}) : /* @__PURE__ */ E(N, {
				data: m,
				keyExtractor: (e) => e.value,
				renderItem: ({ item: e }) => /* @__PURE__ */ D(R, {
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
					children: [/* @__PURE__ */ E(V, {
						style: [q("body.md"), { color: s.text["high-emphasis"] }],
						children: e.label
					}), t === e.value && /* @__PURE__ */ E(V, {
						style: [q("label.md"), { color: s.text["accent-primary"] }],
						children: "✓"
					})]
				})
			})
		})]
	})] });
}
//#endregion
//#region src/native/components/MultiSelect.tsx
function qn({ options: e, values: t = [], onChange: n, placeholder: r = "選択", searchPlaceholder: i = "検索", disabled: a = !1 }) {
	let { theme: o, scales: s } = K(), [c, l] = w(!1), [u, d] = w(""), [f, p] = w(t), m = S(() => {
		if (!u) return e;
		let t = u.toLowerCase();
		return e.filter((e) => e.label.toLowerCase().includes(t));
	}, [e, u]), h = t.length === 0 ? r : t.length === 1 ? e.find((e) => e.value === t[0])?.label ?? r : `${t.length}件選択中`;
	return /* @__PURE__ */ D(T, { children: [/* @__PURE__ */ D(R, {
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
		children: [/* @__PURE__ */ E(V, {
			style: [q("body.md"), { color: t.length > 0 ? o.text["high-emphasis"] : o.text["low-emphasis"] }],
			children: h
		}), /* @__PURE__ */ E(V, {
			style: [q("label.sm"), { color: o.text["low-emphasis"] }],
			children: "▾"
		})]
	}), /* @__PURE__ */ D($, {
		open: c,
		onClose: () => l(!1),
		side: "bottom",
		title: "複数選択",
		children: [
			/* @__PURE__ */ E(Pt, {
				value: u,
				onChangeText: d,
				placeholder: i
			}),
			/* @__PURE__ */ E(U, {
				style: {
					height: 320,
					marginTop: s.spacing.scale[2]
				},
				children: /* @__PURE__ */ E(N, {
					data: m,
					keyExtractor: (e) => e.value,
					renderItem: ({ item: e }) => {
						let t = f.includes(e.value);
						return /* @__PURE__ */ D(R, {
							onPress: () => {
								p((t) => t.includes(e.value) ? t.filter((t) => t !== e.value) : [...t, e.value]);
							},
							style: {
								flexDirection: "row",
								alignItems: "center",
								gap: s.spacing.scale[2],
								paddingVertical: s.spacing.scale[3]
							},
							children: [/* @__PURE__ */ E(Kt, { checked: t }), /* @__PURE__ */ E(V, {
								style: [q("body.md"), {
									color: o.text["high-emphasis"],
									flex: 1
								}],
								children: e.label
							})]
						});
					}
				})
			}),
			/* @__PURE__ */ D(U, {
				style: {
					flexDirection: "row",
					gap: s.spacing.scale[2],
					marginTop: s.spacing.scale[3]
				},
				children: [/* @__PURE__ */ E(U, {
					style: { flex: 1 },
					children: /* @__PURE__ */ E(X, {
						variant: "tertiary",
						onPress: () => l(!1),
						children: "キャンセル"
					})
				}), /* @__PURE__ */ E(U, {
					style: { flex: 1 },
					children: /* @__PURE__ */ E(X, {
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
function Jn({ label: e, options: t, value: n, onChange: r }) {
	let { theme: i, scales: a } = K(), [o, s] = w(!1), c = t.find((e) => e.value === n), l = !!c;
	return /* @__PURE__ */ D(T, { children: [/* @__PURE__ */ D(R, {
		onPress: () => s(!0),
		style: ({ pressed: e }) => ({
			flexDirection: "row",
			alignItems: "center",
			gap: a.spacing.scale[1],
			paddingVertical: a.spacing.scale[2],
			paddingHorizontal: a.spacing.scale[3],
			borderRadius: a.borderRadius.full,
			borderWidth: 1,
			borderColor: l ? i.border["accent-primary"] : i.border["medium-emphasis"],
			backgroundColor: l ? i.surface["accent-primary-light"] : e ? i.surface.secondary : i.surface.primary
		}),
		children: [/* @__PURE__ */ D(V, {
			style: [q("label.sm"), { color: l ? i.text["accent-primary"] : i.text["high-emphasis"] }],
			children: [e, c ? `: ${c.label}` : ""]
		}), /* @__PURE__ */ E(V, {
			style: [q("label.xs"), { color: l ? i.text["accent-primary"] : i.text["low-emphasis"] }],
			children: "▾"
		})]
	}), /* @__PURE__ */ E($, {
		open: o,
		onClose: () => s(!1),
		side: "bottom",
		title: e,
		children: /* @__PURE__ */ D(U, { children: [
			/* @__PURE__ */ E(R, {
				onPress: () => {
					r?.(void 0), s(!1);
				},
				style: ({ pressed: e }) => ({
					paddingVertical: a.spacing.scale[3],
					backgroundColor: e ? i.surface.secondary : "transparent"
				}),
				children: /* @__PURE__ */ E(V, {
					style: [q("body.md"), { color: i.text["medium-emphasis"] }],
					children: "すべて"
				})
			}),
			/* @__PURE__ */ E(We, {}),
			t.map((e, o) => /* @__PURE__ */ D(g.Fragment, { children: [/* @__PURE__ */ D(R, {
				onPress: () => {
					r?.(e.value), s(!1);
				},
				style: ({ pressed: e }) => ({
					paddingVertical: a.spacing.scale[3],
					flexDirection: "row",
					justifyContent: "space-between",
					backgroundColor: e ? i.surface.secondary : "transparent"
				}),
				children: [/* @__PURE__ */ E(V, {
					style: [q("body.md"), { color: i.text["high-emphasis"] }],
					children: e.label
				}), /* @__PURE__ */ D(U, {
					style: {
						flexDirection: "row",
						alignItems: "center",
						gap: 8
					},
					children: [e.count !== void 0 && /* @__PURE__ */ E(V, {
						style: [q("label.sm"), { color: i.text["low-emphasis"] }],
						children: e.count
					}), n === e.value && /* @__PURE__ */ E(V, {
						style: [q("label.md"), { color: i.text["accent-primary"] }],
						children: "✓"
					})]
				})]
			}), o < t.length - 1 && /* @__PURE__ */ E(We, {})] }, e.value))
		] })
	})] });
}
//#endregion
//#region src/native/components/PillToggle.tsx
function Yn({ options: e, value: t, onChange: n, disabled: r = !1 }) {
	let { theme: i, scales: a } = K();
	return /* @__PURE__ */ E(U, {
		style: {
			flexDirection: "row",
			flexWrap: "wrap",
			gap: a.spacing.scale[2]
		},
		children: e.map((e) => {
			let o = t === e.value;
			return /* @__PURE__ */ D(R, {
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
				children: [/* @__PURE__ */ E(V, {
					style: [q("label.sm"), {
						color: o ? i.text["on-inverse"] : i.text["high-emphasis"],
						fontWeight: o ? "700" : "500"
					}],
					children: e.label
				}), e.count !== void 0 && /* @__PURE__ */ E(U, {
					style: {
						paddingHorizontal: 6,
						borderRadius: 999,
						backgroundColor: o ? i.surface.primary : i.surface.tertiary,
						minWidth: 20,
						alignItems: "center"
					},
					children: /* @__PURE__ */ E(V, {
						style: [q("label.xs"), { color: o ? i.text["accent-primary"] : i.text["medium-emphasis"] }],
						children: e.count
					})
				})]
			}, e.value);
		})
	});
}
//#endregion
//#region src/native/components/Tabs.tsx
var Xn = _(null);
function Zn() {
	let e = y(Xn);
	if (!e) throw Error("Tabs の内側で使ってください");
	return e;
}
function Qn({ value: e, onChange: t, children: n }) {
	return /* @__PURE__ */ E(Xn.Provider, {
		value: {
			value: e,
			onChange: t
		},
		children: n
	});
}
function $n({ scrollable: e = !1, children: t }) {
	let { theme: n, scales: r } = K(), i = /* @__PURE__ */ E(U, {
		style: {
			flexDirection: "row",
			borderBottomWidth: 1,
			borderBottomColor: n.border["low-emphasis"],
			gap: r.spacing.scale[1]
		},
		children: t
	});
	return e ? /* @__PURE__ */ E(z, {
		horizontal: !0,
		showsHorizontalScrollIndicator: !1,
		children: i
	}) : i;
}
function er({ value: e, children: t, disabled: n }) {
	let { theme: r, scales: i } = K(), a = Zn(), o = a.value === e;
	return /* @__PURE__ */ E(R, {
		onPress: () => !n && a.onChange(e),
		disabled: n,
		style: {
			paddingVertical: i.spacing.scale[2],
			paddingHorizontal: i.spacing.scale[3],
			borderBottomWidth: 2,
			borderBottomColor: o ? r.brand.primary : "transparent",
			opacity: n ? .4 : 1
		},
		children: /* @__PURE__ */ E(V, {
			style: [q("label.md"), {
				color: o ? r.text["accent-primary"] : r.text["medium-emphasis"],
				fontWeight: o ? "700" : "500"
			}],
			children: t
		})
	});
}
function tr({ value: e, children: t }) {
	return Zn().value === e ? /* @__PURE__ */ E(U, { children: t }) : null;
}
//#endregion
//#region src/native/components/Calendar.tsx
var nr = [
	"日",
	"月",
	"火",
	"水",
	"木",
	"金",
	"土"
], rr = [
	"S",
	"M",
	"T",
	"W",
	"T",
	"F",
	"S"
], ir = [
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
function ar(e) {
	return new Date(e.getFullYear(), e.getMonth(), 1);
}
function or(e) {
	return new Date(e.getFullYear(), e.getMonth() + 1, 0).getDate();
}
function sr(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
function cr({ value: e, onChange: t, minDate: n, maxDate: r, locale: i = "ja" }) {
	let { theme: a, scales: o } = K(), [s, c] = w(e ?? /* @__PURE__ */ new Date()), l = i === "ja" ? nr : rr, u = S(() => {
		let e = ar(s).getDay(), t = or(s), n = [];
		for (let t = 0; t < e; t++) n.push(null);
		for (let e = 1; e <= t; e++) n.push(new Date(s.getFullYear(), s.getMonth(), e));
		for (; n.length % 7 != 0;) n.push(null);
		return n;
	}, [s]), d = i === "ja" ? `${s.getFullYear()}年 ${ir[s.getMonth()]}` : `${s.getFullYear()}-${String(s.getMonth() + 1).padStart(2, "0")}`;
	return /* @__PURE__ */ D(U, {
		style: {
			backgroundColor: a.surface.primary,
			borderRadius: o.borderRadius.lg,
			borderWidth: 1,
			borderColor: a.border["low-emphasis"],
			padding: o.spacing.scale[3],
			gap: o.spacing.scale[2]
		},
		children: [
			/* @__PURE__ */ D(U, {
				style: {
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center"
				},
				children: [
					/* @__PURE__ */ E(R, {
						onPress: () => c((e) => new Date(e.getFullYear(), e.getMonth() - 1, 1)),
						hitSlop: 8,
						children: /* @__PURE__ */ E(V, {
							style: [q("label.lg"), { color: a.text["medium-emphasis"] }],
							children: "‹"
						})
					}),
					/* @__PURE__ */ E(V, {
						style: [q("label.md"), { color: a.text["high-emphasis"] }],
						children: d
					}),
					/* @__PURE__ */ E(R, {
						onPress: () => c((e) => new Date(e.getFullYear(), e.getMonth() + 1, 1)),
						hitSlop: 8,
						children: /* @__PURE__ */ E(V, {
							style: [q("label.lg"), { color: a.text["medium-emphasis"] }],
							children: "›"
						})
					})
				]
			}),
			/* @__PURE__ */ E(U, {
				style: { flexDirection: "row" },
				children: l.map((e, t) => /* @__PURE__ */ E(U, {
					style: {
						flex: 1,
						alignItems: "center"
					},
					children: /* @__PURE__ */ E(V, {
						style: [q("label.xs"), { color: a.text["low-emphasis"] }],
						children: e
					})
				}, t))
			}),
			/* @__PURE__ */ E(U, {
				style: {
					flexDirection: "row",
					flexWrap: "wrap"
				},
				children: u.map((i, s) => {
					if (!i) return /* @__PURE__ */ E(U, { style: {
						width: `${100 / 7}%`,
						aspectRatio: 1
					} }, s);
					let c = n && i < new Date(n.getFullYear(), n.getMonth(), n.getDate()) || r && i > new Date(r.getFullYear(), r.getMonth(), r.getDate()), l = e && sr(i, e), u = sr(i, /* @__PURE__ */ new Date());
					return /* @__PURE__ */ E(U, {
						style: {
							width: `${100 / 7}%`,
							aspectRatio: 1,
							padding: 2
						},
						children: /* @__PURE__ */ E(R, {
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
							children: /* @__PURE__ */ E(V, {
								style: [q("body.sm"), {
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
function lr(e) {
	return `${e.getFullYear()}/${String(e.getMonth() + 1).padStart(2, "0")}/${String(e.getDate()).padStart(2, "0")}`;
}
function ur({ value: e, onChange: t, placeholder: n = "日付を選択", minDate: r, maxDate: i, disabled: a = !1, formatter: o = lr }) {
	let { theme: s, scales: c } = K(), [l, u] = w(!1), [d, f] = w(e);
	return /* @__PURE__ */ D(T, { children: [/* @__PURE__ */ D(R, {
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
		children: [/* @__PURE__ */ E(V, {
			style: [q("body.md"), { color: e ? s.text["high-emphasis"] : s.text["low-emphasis"] }],
			children: e ? o(e) : n
		}), /* @__PURE__ */ E(V, {
			style: [q("label.sm"), { color: s.text["low-emphasis"] }],
			children: "📅"
		})]
	}), /* @__PURE__ */ D($, {
		open: l,
		onClose: () => u(!1),
		side: "bottom",
		title: "日付を選択",
		children: [/* @__PURE__ */ E(cr, {
			value: d,
			onChange: f,
			minDate: r,
			maxDate: i
		}), /* @__PURE__ */ D(U, {
			style: {
				flexDirection: "row",
				gap: c.spacing.scale[2],
				marginTop: c.spacing.scale[3]
			},
			children: [/* @__PURE__ */ E(U, {
				style: { flex: 1 },
				children: /* @__PURE__ */ E(X, {
					variant: "tertiary",
					onPress: () => u(!1),
					children: "キャンセル"
				})
			}), /* @__PURE__ */ E(U, {
				style: { flex: 1 },
				children: /* @__PURE__ */ E(X, {
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
function dr(e) {
	if (!e) return;
	let t = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e);
	if (!t) return;
	let n = Number(t[1]), r = Number(t[2]), i = Number(t[3]), a = new Date(n, r - 1, i);
	if (!(a.getFullYear() !== n || a.getMonth() !== r - 1 || a.getDate() !== i)) return a;
}
function fr(e) {
	return !e || isNaN(e.getTime()) ? "" : `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
}
function pr({ value: e, onChange: t, placeholder: n, disabled: r, formatter: i }) {
	return /* @__PURE__ */ E(ur, {
		value: dr(e),
		onChange: (e) => t(fr(e)),
		placeholder: n,
		disabled: r,
		formatter: i
	});
}
//#endregion
//#region src/native/components/TimePicker.tsx
function mr(e) {
	return e.toString().padStart(2, "0");
}
function hr({ value: e, onChange: t, placeholder: n = "時刻を選択", minuteStep: r = 5, disabled: i = !1 }) {
	let { theme: a, scales: o } = K(), [s, c] = w(!1), [l, u] = w(e?.hour ?? 9), [d, f] = w(e?.minute ?? 0), p = Array.from({ length: 24 }, (e, t) => t), m = Array.from({ length: 60 / r }, (e, t) => t * r);
	return /* @__PURE__ */ D(T, { children: [/* @__PURE__ */ D(R, {
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
		children: [/* @__PURE__ */ E(V, {
			style: [q("body.md"), { color: e ? a.text["high-emphasis"] : a.text["low-emphasis"] }],
			children: e ? `${mr(e.hour)}:${mr(e.minute)}` : n
		}), /* @__PURE__ */ E(V, {
			style: [q("label.sm"), { color: a.text["low-emphasis"] }],
			children: "🕐"
		})]
	}), /* @__PURE__ */ D($, {
		open: s,
		onClose: () => c(!1),
		side: "bottom",
		title: "時刻を選択",
		children: [/* @__PURE__ */ D(U, {
			style: {
				flexDirection: "row",
				height: 220,
				gap: o.spacing.scale[3]
			},
			children: [/* @__PURE__ */ E(z, {
				style: { flex: 1 },
				showsVerticalScrollIndicator: !1,
				children: p.map((e) => /* @__PURE__ */ E(R, {
					onPress: () => u(e),
					style: {
						paddingVertical: o.spacing.scale[2],
						alignItems: "center",
						backgroundColor: l === e ? a.surface["accent-primary-light"] : "transparent",
						borderRadius: o.borderRadius.sm
					},
					children: /* @__PURE__ */ E(V, {
						style: [q("body.lg"), {
							color: l === e ? a.text["accent-primary"] : a.text["high-emphasis"],
							fontWeight: l === e ? "700" : "400"
						}],
						children: mr(e)
					})
				}, e))
			}), /* @__PURE__ */ E(z, {
				style: { flex: 1 },
				showsVerticalScrollIndicator: !1,
				children: m.map((e) => /* @__PURE__ */ E(R, {
					onPress: () => f(e),
					style: {
						paddingVertical: o.spacing.scale[2],
						alignItems: "center",
						backgroundColor: d === e ? a.surface["accent-primary-light"] : "transparent",
						borderRadius: o.borderRadius.sm
					},
					children: /* @__PURE__ */ E(V, {
						style: [q("body.lg"), {
							color: d === e ? a.text["accent-primary"] : a.text["high-emphasis"],
							fontWeight: d === e ? "700" : "400"
						}],
						children: mr(e)
					})
				}, e))
			})]
		}), /* @__PURE__ */ D(U, {
			style: {
				flexDirection: "row",
				gap: o.spacing.scale[2],
				marginTop: o.spacing.scale[3]
			},
			children: [/* @__PURE__ */ E(U, {
				style: { flex: 1 },
				children: /* @__PURE__ */ E(X, {
					variant: "tertiary",
					onPress: () => c(!1),
					children: "キャンセル"
				})
			}), /* @__PURE__ */ E(U, {
				style: { flex: 1 },
				children: /* @__PURE__ */ E(X, {
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
function gr(e, t, n) {
	return t && e < t ? new Date(t) : n && e > n ? new Date(n) : e;
}
function _r({ value: e, onChange: t, minuteStep: n = 5, minDate: r, maxDate: i, disabled: a = !1, style: o }) {
	let { scales: s } = K(), c = e ? {
		hour: e.getHours(),
		minute: e.getMinutes()
	} : void 0;
	return /* @__PURE__ */ D(U, {
		style: [{ gap: s.spacing.scale[2] }, o],
		children: [/* @__PURE__ */ E(ur, {
			value: e,
			onChange: (n) => {
				let a = new Date(n);
				a.setHours(e?.getHours() ?? 0, e?.getMinutes() ?? 0, e?.getSeconds() ?? 0, e?.getMilliseconds() ?? 0), t?.(gr(a, r, i));
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
		}), /* @__PURE__ */ E(hr, {
			value: c,
			onChange: (n) => {
				if (!e) return;
				let a = new Date(e);
				a.setHours(n.hour, n.minute, e.getSeconds(), e.getMilliseconds()), t?.(gr(a, r, i));
			},
			minuteStep: n,
			disabled: a || !e
		})]
	});
}
//#endregion
//#region src/native/components/Accordion.tsx
function vr({ items: e, type: t = "single", defaultOpenKeys: n = [] }) {
	let { theme: r, scales: i } = K(), [a, o] = w(new Set(n)), s = (e) => {
		o((n) => {
			let r = new Set(t === "multiple" ? n : []);
			return n.has(e) ? r.delete(e) : r.add(e), r;
		});
	};
	return /* @__PURE__ */ E(U, {
		style: {
			borderRadius: i.borderRadius.lg,
			borderWidth: 1,
			borderColor: r.border["low-emphasis"],
			backgroundColor: r.surface.primary,
			overflow: "hidden"
		},
		children: e.map((e, t) => {
			let n = a.has(e.key);
			return /* @__PURE__ */ D(U, {
				style: {
					borderTopWidth: t === 0 ? 0 : 1,
					borderTopColor: r.border["low-emphasis"]
				},
				children: [/* @__PURE__ */ D(R, {
					onPress: () => s(e.key),
					style: ({ pressed: e }) => ({
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						padding: i.spacing.scale[4],
						backgroundColor: e ? r.surface.secondary : "transparent"
					}),
					children: [/* @__PURE__ */ E(V, {
						style: [q("label.md"), {
							color: r.text["high-emphasis"],
							flex: 1
						}],
						children: e.title
					}), /* @__PURE__ */ E(V, {
						style: [q("label.sm"), { color: r.text["low-emphasis"] }],
						children: n ? "▾" : "▸"
					})]
				}), n && /* @__PURE__ */ E(U, {
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
function yr({ title: e, defaultOpen: t = !1, children: n }) {
	let { theme: r, scales: i } = K(), [a, o] = w(t);
	return /* @__PURE__ */ D(U, { children: [/* @__PURE__ */ D(R, {
		onPress: () => o((e) => !e),
		style: {
			flexDirection: "row",
			alignItems: "center",
			gap: i.spacing.scale[1]
		},
		children: [/* @__PURE__ */ E(V, {
			style: [q("label.sm"), { color: r.text["accent-primary"] }],
			children: a ? "▾" : "▸"
		}), /* @__PURE__ */ E(V, {
			style: [q("label.md"), { color: r.text["accent-primary"] }],
			children: e
		})]
	}), a && /* @__PURE__ */ E(U, {
		style: { marginTop: i.spacing.scale[2] },
		children: n
	})] });
}
//#endregion
//#region src/native/components/ScrollArea.tsx
function br({ maxHeight: e, bordered: t, children: n, ...r }) {
	let { theme: i, scales: a } = K();
	return /* @__PURE__ */ E(U, {
		style: {
			maxHeight: e,
			borderWidth: +!!t,
			borderColor: i.border["low-emphasis"],
			borderRadius: t ? a.borderRadius.lg : 0,
			overflow: "hidden"
		},
		children: /* @__PURE__ */ E(z, {
			...r,
			children: n
		})
	});
}
//#endregion
//#region src/native/components/Pagination.tsx
function xr(e, t) {
	let n = [];
	for (let r = e; r <= t; r++) n.push(r);
	return n;
}
function Sr({ page: e, total: t, onChange: n, windowSize: r = 5 }) {
	let { theme: i, scales: a } = K(), o = Math.floor(r / 2), s = Math.max(1, e - o), c = Math.min(t, s + r - 1);
	c - s + 1 < r && (s = Math.max(1, c - r + 1));
	let l = xr(s, c), u = (e, t, r = !1, o = !1) => /* @__PURE__ */ E(R, {
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
		children: /* @__PURE__ */ E(V, {
			style: [q("label.sm"), { color: o ? i.text["on-inverse"] : i.text["high-emphasis"] }],
			children: e
		})
	}, e);
	return /* @__PURE__ */ D(U, {
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
function Cr({ page: e, total: t, onChange: n }) {
	let { theme: r, scales: i } = K(), a = (e, t, a) => /* @__PURE__ */ E(R, {
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
		children: /* @__PURE__ */ E(V, {
			style: [q("label.md"), { color: r.text["high-emphasis"] }],
			children: e
		})
	});
	return /* @__PURE__ */ D(U, {
		style: {
			flexDirection: "row",
			alignItems: "center",
			gap: i.spacing.scale[3],
			alignSelf: "center"
		},
		children: [
			a("‹", e - 1, e <= 1),
			/* @__PURE__ */ D(V, {
				style: [q("label.md"), { color: r.text["medium-emphasis"] }],
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
function wr({ items: e, value: t, onChange: n }) {
	let { theme: r, scales: i } = K();
	return /* @__PURE__ */ E(U, {
		style: {
			flexDirection: "row",
			backgroundColor: r.surface.primary,
			borderTopWidth: 1,
			borderTopColor: r.border["low-emphasis"],
			paddingBottom: L.OS === "ios" ? 24 : 0
		},
		children: e.map((e) => {
			let a = t === e.key;
			return /* @__PURE__ */ D(R, {
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
				children: [/* @__PURE__ */ D(U, {
					style: { position: "relative" },
					children: [e.icon, e.badge !== void 0 && e.badge > 0 && /* @__PURE__ */ E(U, {
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
						children: /* @__PURE__ */ E(V, {
							style: [q("label.xs"), { color: r.text["on-inverse"] }],
							children: e.badge > 99 ? "99+" : e.badge
						})
					})]
				}), /* @__PURE__ */ E(V, {
					style: [q("label.xs"), { color: a ? r.text["accent-primary"] : r.text["medium-emphasis"] }],
					children: e.label
				})]
			}, e.key);
		})
	});
}
//#endregion
//#region src/native/components/SubNav.tsx
function Tr({ items: e, value: t, onChange: n }) {
	let { theme: r, scales: i } = K();
	return /* @__PURE__ */ E(z, {
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
			return /* @__PURE__ */ D(R, {
				onPress: () => n?.(e.key),
				style: {
					flexDirection: "row",
					alignItems: "center",
					gap: i.spacing.scale[1],
					paddingVertical: i.spacing.scale[3],
					borderBottomWidth: 2,
					borderBottomColor: a ? r.brand.primary : "transparent"
				},
				children: [/* @__PURE__ */ E(V, {
					style: [q("label.md"), {
						color: a ? r.text["accent-primary"] : r.text["medium-emphasis"],
						fontWeight: a ? "700" : "500"
					}],
					children: e.label
				}), e.count !== void 0 && /* @__PURE__ */ E(U, {
					style: {
						paddingHorizontal: 6,
						borderRadius: 999,
						backgroundColor: a ? r.surface["accent-primary-light"] : r.surface.tertiary,
						minWidth: 20,
						alignItems: "center"
					},
					children: /* @__PURE__ */ E(V, {
						style: [q("label.xs"), { color: a ? r.text["accent-primary"] : r.text["medium-emphasis"] }],
						children: e.count
					})
				})]
			}, e.key);
		})
	});
}
//#endregion
//#region src/native/components/Breadcrumb.tsx
function Er({ title: e, onBack: t, backLabel: n = "戻る", rightSlot: r }) {
	let { theme: i, scales: a } = K();
	return /* @__PURE__ */ D(U, {
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
		children: [/* @__PURE__ */ D(U, {
			style: {
				flexDirection: "row",
				alignItems: "center",
				gap: a.spacing.scale[2],
				flex: 1
			},
			children: [t && /* @__PURE__ */ D(R, {
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
				children: [/* @__PURE__ */ E(V, {
					style: [q("label.md"), { color: i.text["accent-primary"] }],
					children: "‹"
				}), /* @__PURE__ */ E(V, {
					style: [q("label.sm"), { color: i.text["accent-primary"] }],
					children: n
				})]
			}), /* @__PURE__ */ E(V, {
				numberOfLines: 1,
				style: [q("heading.md"), {
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
function Dr({ title: e, subtitle: t, leading: n, trailing: r, onBack: i, centered: a = !0 }) {
	let { theme: o, scales: s } = K(), c = n ?? (i ? /* @__PURE__ */ E(R, {
		onPress: i,
		hitSlop: 8,
		style: ({ pressed: e }) => ({
			padding: s.spacing.scale[1],
			borderRadius: s.borderRadius.md,
			backgroundColor: e ? o.surface.secondary : "transparent"
		}),
		children: /* @__PURE__ */ E(V, {
			style: [q("heading.lg"), { color: o.text["high-emphasis"] }],
			children: "‹"
		})
	}) : null);
	return /* @__PURE__ */ D(U, {
		style: {
			flexDirection: "row",
			alignItems: "center",
			gap: s.spacing.scale[2],
			paddingHorizontal: s.spacing.scale[3],
			paddingTop: L.OS === "ios" ? 48 : s.spacing.scale[3],
			paddingBottom: s.spacing.scale[3],
			backgroundColor: o.surface.primary,
			borderBottomWidth: 1,
			borderBottomColor: o.border["low-emphasis"]
		},
		children: [
			/* @__PURE__ */ E(U, {
				style: {
					width: 44,
					alignItems: "flex-start"
				},
				children: c
			}),
			/* @__PURE__ */ D(U, {
				style: {
					flex: 1,
					alignItems: a ? "center" : "flex-start"
				},
				children: [e && /* @__PURE__ */ E(V, {
					numberOfLines: 1,
					style: [q("heading.md"), { color: o.text["high-emphasis"] }],
					children: e
				}), t && /* @__PURE__ */ E(V, {
					numberOfLines: 1,
					style: [q("body.sm"), { color: o.text["medium-emphasis"] }],
					children: t
				})]
			}),
			/* @__PURE__ */ E(U, {
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
function Or({ brand: e, leading: t, status: n, compactStatus: r, actions: i, children: a, bordered: o = !0, style: s }) {
	let { theme: c, scales: l } = K();
	return /* @__PURE__ */ D(U, {
		style: [{
			backgroundColor: c.surface.primary,
			borderBottomWidth: +!!o,
			borderBottomColor: c.border["low-emphasis"],
			paddingTop: L.OS === "ios" ? 48 : l.spacing.scale[3]
		}, s],
		children: [/* @__PURE__ */ D(U, {
			style: {
				minHeight: 56,
				paddingHorizontal: l.spacing.scale[4],
				flexDirection: "row",
				alignItems: "center",
				gap: l.spacing.scale[2]
			},
			children: [
				t,
				/* @__PURE__ */ E(U, {
					style: {
						flexShrink: 0,
						maxWidth: "58%"
					},
					children: e
				}),
				/* @__PURE__ */ D(U, {
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
function kr({ header: e, bottomNav: t, fab: n, desktopSidebar: r, scrollable: i = !0, bottomPadding: a = n ? "bottom-nav-fab" : t ? "bottom-nav" : "none", children: o, style: s, contentStyle: c }) {
	let { theme: l, scales: u } = K(), d = a === "bottom-nav-fab" ? u.spacing.scale[15] : a === "bottom-nav" ? u.spacing.scale[12] : 0, f = [{
		flex: 1,
		backgroundColor: l.surface.secondary,
		paddingBottom: d
	}, c], p = E(i ? z : U, {
		style: f,
		children: o
	});
	return /* @__PURE__ */ D(U, {
		style: [{
			flex: 1,
			flexDirection: "row",
			backgroundColor: l.surface.primary
		}, s],
		children: [r, /* @__PURE__ */ D(U, {
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
function Ar({ label: e, icon: t, showLabel: n = !1, placement: r = "end", bottomOffset: i = "bottom-nav", keyboardBehavior: a = "hide", style: o, ...s }) {
	let { theme: c, scales: l } = K(), [u, d] = w(!1);
	if (b(() => {
		let e = F.addListener("keyboardDidShow", () => d(!0)), t = F.addListener("keyboardDidHide", () => d(!1));
		return () => {
			e.remove(), t.remove();
		};
	}, []), a === "hide" && u) return null;
	let f = {
		none: l.spacing.scale[4],
		"bottom-nav-pill-inline": l.spacing.scale[4],
		"bottom-nav": 80,
		"bottom-nav-pill": 96
	}, p = r === "center" ? { alignSelf: "center" } : r === "start" ? { left: l.spacing.scale[4] } : { right: l.spacing.scale[4] };
	return /* @__PURE__ */ D(R, {
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
			...p
		}, o],
		...s,
		children: [/* @__PURE__ */ E(U, { children: t ?? /* @__PURE__ */ E(V, {
			style: [q("heading.lg"), { color: c.text["on-inverse"] }],
			children: "+"
		}) }), n && /* @__PURE__ */ E(V, {
			style: [q("label.md"), { color: c.text["on-inverse"] }],
			children: e
		})]
	});
}
//#endregion
//#region src/native/components/StatusActionBadge.tsx
function jr({ state: e = "idle", label: t, count: n, compact: r = !1, loading: i = !1, icon: a, asStatus: o = !1, style: s, onPress: c, ...l }) {
	let { theme: u, scales: d } = K(), f = {
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
	}[e], p = /* @__PURE__ */ D(T, { children: [
		a ?? (i || e === "syncing" ? /* @__PURE__ */ E(k, {
			size: "small",
			color: f.fg
		}) : /* @__PURE__ */ E(U, { style: {
			width: 6,
			height: 6,
			borderRadius: 3,
			backgroundColor: f.fg
		} })),
		!r && /* @__PURE__ */ E(V, {
			numberOfLines: 1,
			style: [q("label.xs"), { color: f.fg }],
			children: t
		}),
		n != null && n > 0 && /* @__PURE__ */ E(V, {
			style: [q("label.xs"), { color: u.text["high-emphasis"] }],
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
	return o || !c ? /* @__PURE__ */ E(U, {
		accessibilityRole: "text",
		accessibilityLabel: t,
		style: m,
		children: p
	}) : /* @__PURE__ */ E(R, {
		accessibilityRole: "button",
		accessibilityLabel: t,
		accessibilityState: { busy: i || e === "syncing" },
		onPress: c,
		style: ({ pressed: e }) => [m, e && { opacity: .82 }],
		...l,
		children: p
	});
}
var Mr = jr;
//#endregion
//#region src/native/components/Banner.tsx
function Nr({ title: e, description: t, image: n, onPress: r, tone: i = "neutral", height: a = 140 }) {
	let { theme: o, scales: s } = K(), c = {
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
	}[i], l = /* @__PURE__ */ D(U, {
		style: {
			height: a,
			borderRadius: s.borderRadius.lg,
			backgroundColor: c.bg,
			overflow: "hidden"
		},
		children: [n && /* @__PURE__ */ E(P, {
			source: n,
			resizeMode: "cover",
			style: {
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0
			}
		}), /* @__PURE__ */ D(U, {
			style: {
				flex: 1,
				padding: s.spacing.scale[4],
				justifyContent: "flex-end",
				backgroundColor: n ? o.surface["videoOverlay-light"] : "transparent"
			},
			children: [e && /* @__PURE__ */ E(V, {
				style: [q("heading.lg"), { color: n ? o.text["on-inverse"] : c.fg }],
				children: e
			}), t && /* @__PURE__ */ E(V, {
				style: [q("body.sm"), { color: n ? o.text["on-inverse-secondary"] : o.text["medium-emphasis"] }],
				children: t
			})]
		})]
	});
	return r ? /* @__PURE__ */ E(R, {
		onPress: r,
		children: l
	}) : l;
}
//#endregion
//#region src/native/components/BannerCarousel.tsx
function Pr({ banners: e, itemWidth: t, height: n = 160, showIndicator: r = !0 }) {
	let { theme: i, scales: a } = K(), [o, s] = w(0), c = t ?? j.get("window").width - 32, l = C(null);
	return /* @__PURE__ */ D(U, {
		style: { gap: a.spacing.scale[2] },
		children: [/* @__PURE__ */ E(N, {
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
			renderItem: ({ item: e }) => /* @__PURE__ */ E(U, {
				style: {
					width: c,
					height: n
				},
				children: /* @__PURE__ */ E(Nr, {
					...e,
					height: n
				})
			})
		}), r && e.length > 1 && /* @__PURE__ */ E(U, {
			style: {
				flexDirection: "row",
				gap: 6,
				alignSelf: "center"
			},
			children: e.map((e, t) => /* @__PURE__ */ E(U, { style: {
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
function Fr({ value: e, onChange: t, placeholder: n = "検索", onSubmit: r, onClear: i, autoFocus: a }) {
	let { theme: o, scales: s } = K();
	return /* @__PURE__ */ D(U, {
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
			/* @__PURE__ */ E(V, {
				style: [q("label.md"), { color: o.text["low-emphasis"] }],
				children: "🔍"
			}),
			/* @__PURE__ */ E(H, {
				value: e,
				onChangeText: t,
				onSubmitEditing: r,
				placeholder: n,
				placeholderTextColor: o.text["low-emphasis"],
				returnKeyType: "search",
				autoFocus: a,
				style: [q("body.md"), {
					flex: 1,
					color: o.text["high-emphasis"],
					paddingVertical: 0
				}]
			}),
			e.length > 0 && /* @__PURE__ */ E(R, {
				onPress: () => {
					t(""), i?.();
				},
				hitSlop: 8,
				children: /* @__PURE__ */ E(U, {
					style: {
						width: 20,
						height: 20,
						borderRadius: 10,
						backgroundColor: o.surface.tertiary,
						alignItems: "center",
						justifyContent: "center"
					},
					children: /* @__PURE__ */ E(V, {
						style: [q("label.xs"), { color: o.text["medium-emphasis"] }],
						children: "×"
					})
				})
			})
		]
	});
}
//#endregion
//#region src/native/components/ListItem.tsx
function Ir({ leading: e, title: t, description: n, trailing: r, showChevron: i, onPress: a, disabled: o }) {
	let { theme: s, scales: c } = K(), l = (a = !1) => /* @__PURE__ */ D(U, {
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
			/* @__PURE__ */ D(U, {
				style: {
					flex: 1,
					gap: 2
				},
				children: [typeof t == "string" ? /* @__PURE__ */ E(V, {
					style: [q("body.md"), { color: s.text["high-emphasis"] }],
					children: t
				}) : t, n && typeof n == "string" ? /* @__PURE__ */ E(V, {
					style: [q("body.sm"), { color: s.text["medium-emphasis"] }],
					children: n
				}) : n]
			}),
			r,
			i && /* @__PURE__ */ E(V, {
				style: [q("label.md"), { color: s.text["low-emphasis"] }],
				children: "›"
			})
		]
	});
	return a ? /* @__PURE__ */ E(R, {
		disabled: o,
		onPress: a,
		children: ({ pressed: e }) => l(e)
	}) : l(!1);
}
//#endregion
//#region src/native/components/SettingsSection.tsx
function Lr({ title: e, description: t, action: n, variant: r = "group", children: i, style: a, contentStyle: o }) {
	let { theme: s, scales: c } = K(), l = r === "card" || r === "danger";
	return /* @__PURE__ */ D(U, {
		style: [{ gap: c.spacing.scale[3] }, a],
		children: [(e || t || n) && /* @__PURE__ */ D(U, {
			style: {
				flexDirection: "row",
				alignItems: "flex-start",
				justifyContent: "space-between",
				gap: c.spacing.scale[3],
				paddingHorizontal: c.spacing.scale[1]
			},
			children: [/* @__PURE__ */ D(U, {
				style: {
					flex: 1,
					minWidth: 0
				},
				children: [typeof e == "string" ? /* @__PURE__ */ E(V, {
					style: [q("heading.sm"), { color: r === "danger" ? s.text.caution : s.text["high-emphasis"] }],
					children: e
				}) : e, t && (typeof t == "string" ? /* @__PURE__ */ E(V, {
					style: [q("body.sm"), {
						color: s.text["medium-emphasis"],
						marginTop: c.spacing.scale[1]
					}],
					children: t
				}) : t)]
			}), n]
		}), /* @__PURE__ */ E(U, {
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
function Rr({ title: e, description: t, leading: n, rightSlot: r, children: i, onPress: a, disabled: o = !1, destructive: s = !1, style: c }) {
	let { theme: l, scales: u } = K(), d = (a = !1) => /* @__PURE__ */ D(U, {
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
			n && /* @__PURE__ */ E(U, {
				style: {
					width: 40,
					minHeight: 40,
					alignItems: "center",
					justifyContent: "center"
				},
				children: n
			}),
			/* @__PURE__ */ D(U, {
				style: {
					flex: 1,
					minWidth: 0
				},
				children: [
					typeof e == "string" ? /* @__PURE__ */ E(V, {
						numberOfLines: 1,
						style: [q("label.md"), { color: s ? l.text.caution : l.text["high-emphasis"] }],
						children: e
					}) : e,
					t && (typeof t == "string" ? /* @__PURE__ */ E(V, {
						style: [q("body.sm"), {
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
	return a ? /* @__PURE__ */ E(R, {
		disabled: o,
		onPress: a,
		accessibilityRole: "button",
		accessibilityState: { disabled: o },
		children: ({ pressed: e }) => d(e)
	}) : d(!1);
}
//#endregion
//#region src/native/components/EmptyState.tsx
function zr({ title: e, description: t, icon: n, action: r }) {
	let { theme: i, scales: a } = K();
	return /* @__PURE__ */ D(U, {
		style: {
			alignItems: "center",
			justifyContent: "center",
			padding: a.spacing.scale[8],
			gap: a.spacing.scale[3]
		},
		children: [
			n ?? /* @__PURE__ */ E(U, {
				style: {
					width: 64,
					height: 64,
					borderRadius: 32,
					backgroundColor: i.surface.secondary,
					alignItems: "center",
					justifyContent: "center"
				},
				children: /* @__PURE__ */ E(V, {
					style: {
						fontSize: 28,
						color: i.text["low-emphasis"]
					},
					children: "📭"
				})
			}),
			/* @__PURE__ */ E(V, {
				style: [q("heading.md"), {
					color: i.text["high-emphasis"],
					textAlign: "center"
				}],
				children: e
			}),
			t && /* @__PURE__ */ E(V, {
				style: [q("body.md"), {
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
function Br({ title: e = "エラーが発生しました", description: t = "時間をおいて再度お試しください。", icon: n, action: r }) {
	let { theme: i, scales: a } = K();
	return /* @__PURE__ */ D(U, {
		style: {
			alignItems: "center",
			justifyContent: "center",
			padding: a.spacing.scale[8],
			gap: a.spacing.scale[3]
		},
		children: [
			n ?? /* @__PURE__ */ E(U, {
				style: {
					width: 64,
					height: 64,
					borderRadius: 32,
					backgroundColor: i.surface.caution,
					alignItems: "center",
					justifyContent: "center"
				},
				children: /* @__PURE__ */ E(V, {
					style: {
						fontSize: 28,
						color: i.text.caution
					},
					children: "!"
				})
			}),
			/* @__PURE__ */ E(V, {
				style: [q("heading.md"), {
					color: i.text["high-emphasis"],
					textAlign: "center"
				}],
				children: e
			}),
			/* @__PURE__ */ E(V, {
				style: [q("body.md"), {
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
var Vr = {
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
}, Hr = {
	md: 44,
	ml: 48,
	lg: 72
};
function Ur({ size: e = "md", children: t, style: n, accessibilityLabel: r, ...i }) {
	let { theme: a } = K(), o = Hr[e], s = {
		...Vr[e],
		color: a.object["accent-primary"]
	};
	return /* @__PURE__ */ E(U, {
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
function Wr({ title: e, description: t, action: n, variant: r = "default" }) {
	let { theme: i, scales: a } = K();
	return /* @__PURE__ */ D(U, {
		style: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			paddingHorizontal: a.spacing.scale[4],
			paddingVertical: a.spacing.scale[2],
			gap: a.spacing.scale[2]
		},
		children: [/* @__PURE__ */ D(U, {
			style: { flex: 1 },
			children: [/* @__PURE__ */ E(V, {
				style: [q(r === "subtle" ? "label.md" : "heading.md"), { color: i.text["high-emphasis"] }],
				children: e
			}), t && /* @__PURE__ */ E(V, {
				style: [q("body.sm"), {
					color: i.text["medium-emphasis"],
					marginTop: 2
				}],
				children: t
			})]
		}), n && /* @__PURE__ */ E(R, {
			onPress: n.onPress,
			hitSlop: 8,
			style: ({ pressed: e }) => ({
				paddingVertical: a.spacing.scale[1],
				paddingHorizontal: a.spacing.scale[2],
				borderRadius: a.borderRadius.md,
				opacity: e ? .6 : 1
			}),
			children: /* @__PURE__ */ D(V, {
				style: [q("label.md"), { color: i.text["accent-primary"] }],
				children: [n.label, " ›"]
			})
		})]
	});
}
//#endregion
//#region src/native/components/StickyActionBar.tsx
function Gr({ children: e }) {
	let { theme: t, scales: n } = K();
	return /* @__PURE__ */ E(U, {
		style: {
			flexDirection: "row",
			gap: n.spacing.scale[2],
			padding: n.spacing.scale[4],
			paddingBottom: L.OS === "ios" ? 32 : n.spacing.scale[4],
			backgroundColor: t.surface.primary,
			borderTopWidth: 1,
			borderTopColor: t.border["low-emphasis"]
		},
		children: e
	});
}
//#endregion
//#region src/native/components/SwipeRow.tsx
function Kr({ rightActions: e = [], actionWidth: t = 80, children: n }) {
	let { theme: r } = K(), [i] = w(() => new A.Value(0)), a = e.length * t, [o] = w(() => ne.create({
		onMoveShouldSetPanResponder: (e, t) => Math.abs(t.dx) > 8,
		onPanResponderMove: (e, t) => {
			let n = Math.min(0, Math.max(-a, t.dx));
			i.setValue(n);
		},
		onPanResponderRelease: (e, t) => {
			let n = t.dx < -a / 2;
			A.spring(i, {
				toValue: n ? -a : 0,
				useNativeDriver: !0
			}).start();
		}
	}));
	return /* @__PURE__ */ D(U, {
		style: {
			position: "relative",
			overflow: "hidden"
		},
		children: [/* @__PURE__ */ E(U, {
			style: {
				position: "absolute",
				top: 0,
				right: 0,
				bottom: 0,
				flexDirection: "row"
			},
			children: e.map((e, n) => /* @__PURE__ */ E(R, {
				onPress: () => {
					A.spring(i, {
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
				children: /* @__PURE__ */ E(V, {
					style: [q("label.md"), { color: e.textColor ?? r.text["on-inverse"] }],
					children: e.label
				})
			}, n))
		}), /* @__PURE__ */ E(A.View, {
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
function qr({ copyright: e, links: t = [] }) {
	let { theme: n, scales: r } = K();
	return /* @__PURE__ */ D(U, {
		style: {
			backgroundColor: n.surface.secondary,
			padding: r.spacing.scale[4],
			gap: r.spacing.scale[2]
		},
		children: [/* @__PURE__ */ E(U, {
			style: {
				flexDirection: "row",
				flexWrap: "wrap",
				gap: r.spacing.scale[3]
			},
			children: t.map((e, t) => /* @__PURE__ */ E(R, {
				onPress: e.onPress,
				children: /* @__PURE__ */ E(V, {
					style: [q("label.sm"), { color: n.text["medium-emphasis"] }],
					children: e.label
				})
			}, t))
		}), e && /* @__PURE__ */ E(V, {
			style: [q("body.sm"), { color: n.text["low-emphasis"] }],
			children: e
		})]
	});
}
//#endregion
//#region src/native/components/FileUpload.tsx
function Jr({ title: e = "ファイルを選択", description: t = "タップしてアップロード", onPress: n, disabled: r = !1 }) {
	let { theme: i, scales: a } = K();
	return /* @__PURE__ */ D(R, {
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
			/* @__PURE__ */ E(V, {
				style: {
					fontSize: 28,
					color: i.text["low-emphasis"]
				},
				children: "📤"
			}),
			/* @__PURE__ */ E(V, {
				style: [q("label.md"), { color: i.text["high-emphasis"] }],
				children: e
			}),
			/* @__PURE__ */ E(V, {
				style: [q("body.sm"), { color: i.text["medium-emphasis"] }],
				children: t
			})
		]
	});
}
//#endregion
//#region src/native/components/Screen.tsx
function Yr(e, t) {
	if (e !== "none") return {
		paddingHorizontal: t.scale[6],
		paddingVertical: t.scale[6]
	};
}
function Xr({ children: e, footer: t, header: n, scroll: r = !0, padding: i = "page", style: a, bodyStyle: o, headerStyle: s, footerStyle: c, contentContainerStyle: l }) {
	let { theme: u, scales: d } = K(), f = [{
		flex: 1,
		minHeight: 0,
		backgroundColor: u.surface.primary
	}, o], p = [Yr(i, d.spacing), l];
	return /* @__PURE__ */ D(U, {
		style: [{
			flex: 1,
			minHeight: 0,
			overflow: "hidden",
			backgroundColor: u.surface.primary
		}, a],
		children: [
			n && /* @__PURE__ */ E(U, {
				style: [{ flexShrink: 0 }, s],
				children: n
			}),
			r ? /* @__PURE__ */ E(z, {
				style: f,
				contentContainerStyle: p,
				keyboardShouldPersistTaps: "handled",
				children: e
			}) : /* @__PURE__ */ E(U, {
				style: [
					f,
					Yr(i, d.spacing),
					l
				],
				children: e
			}),
			t && /* @__PURE__ */ E(U, {
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
function Zr({ sections: e }) {
	let { theme: t, scales: n } = K();
	return /* @__PURE__ */ E(U, {
		style: { gap: n.spacing.scale[6] },
		children: e.map((e, r) => /* @__PURE__ */ D(U, {
			style: { gap: n.spacing.scale[2] },
			children: [/* @__PURE__ */ E(V, {
				style: [q("heading.md"), { color: t.text["high-emphasis"] }],
				children: e.title
			}), e.body.map((e, n) => /* @__PURE__ */ E(V, {
				style: [q("body.md"), { color: t.text["medium-emphasis"] }],
				children: e
			}, n))]
		}, r))
	});
}
//#endregion
//#region src/native/components/DocumentScreen.tsx
function Qr({ title: e, lastUpdated: t, onBack: n, children: r }) {
	let { theme: i, scales: a } = K();
	return /* @__PURE__ */ D(Xr, {
		header: n ? /* @__PURE__ */ E(Dr, {
			onBack: n,
			centered: !1
		}) : void 0,
		children: [/* @__PURE__ */ D(U, {
			style: { gap: a.spacing.scale[1] },
			children: [/* @__PURE__ */ E(V, {
				style: [q("heading.2xl"), { color: i.text["high-emphasis"] }],
				children: e
			}), t && /* @__PURE__ */ D(V, {
				style: [q("prose-meta"), { color: i.text["low-emphasis"] }],
				children: ["最終更新日：", t]
			})]
		}), /* @__PURE__ */ E(U, {
			style: { marginTop: a.spacing.scale[6] },
			children: r
		})]
	});
}
//#endregion
//#region src/native/components/PhotoHero.tsx
function $r(e) {
	return typeof e == "string" ? { uri: e } : e;
}
function ei(e, t) {
	return e === "none" ? "transparent" : e === "dark" ? t.surface["videoOverlay-strong"] : t.surface["videoOverlay-medium"];
}
function ti({ src: e, alt: t = "", overlay: n = "medium", align: r = "bottom", children: i, style: a, imageStyle: o, contentStyle: s }) {
	let { theme: c, scales: l } = K(), u = r === "center" ? "center" : "flex-end";
	return /* @__PURE__ */ D(ee, {
		source: $r(e),
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
		children: [/* @__PURE__ */ E(U, {
			pointerEvents: "none",
			style: {
				position: "absolute",
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
				backgroundColor: ei(n, c)
			}
		}), /* @__PURE__ */ E(U, {
			style: [{
				flex: 1,
				justifyContent: u,
				paddingHorizontal: l.spacing.scale[6],
				paddingTop: l.spacing.scale[15],
				paddingBottom: l.spacing.scale[15]
			}, s],
			children: /* @__PURE__ */ E(U, {
				style: { gap: l.spacing.scale[4] },
				children: i
			})
		})]
	});
}
function ni({ children: e, style: t, numberOfLines: n }) {
	let { theme: r } = K();
	return /* @__PURE__ */ E(V, {
		numberOfLines: n,
		style: [
			q("label.sm"),
			{ color: r.text["on-media-secondary"] },
			t
		],
		children: e
	});
}
function ri({ children: e, style: t, numberOfLines: n }) {
	let { theme: r } = K();
	return /* @__PURE__ */ E(V, {
		numberOfLines: n,
		style: [
			q("heading.2xl"),
			{ color: r.text["on-media"] },
			t
		],
		children: e
	});
}
function ii({ children: e, style: t, numberOfLines: n }) {
	let { theme: r } = K();
	return /* @__PURE__ */ E(V, {
		numberOfLines: n,
		style: [
			q("body.md"),
			{ color: r.text["on-media-secondary"] },
			t
		],
		children: e
	});
}
function ai({ children: e, style: t }) {
	let { scales: n } = K();
	return /* @__PURE__ */ E(U, {
		style: [{
			gap: n.spacing.scale[3],
			marginTop: n.spacing.scale[2]
		}, t],
		children: e
	});
}
var oi = Object.assign(ti, {
	Eyebrow: ni,
	Title: ri,
	Body: ii,
	Actions: ai
}), si = {
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
function ci(e) {
	return typeof e == "number" && e > 99 ? "99+" : e;
}
function li(e, t) {
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
function ui({ items: e, orientation: t = "vertical", anchor: n = "bottom-right", position: r = "absolute", labelPosition: i = "auto", autoHideMs: a = 5e3, defaultVisible: o = !0, onVisibleChange: s, accessibilityLabel: c = "メディアアクション", style: l }) {
	let { scales: u } = K(), d = a != null && a > 0, [f, p] = g.useState({
		autoHideEnabled: d,
		value: o
	});
	f.autoHideEnabled !== d && p({
		autoHideEnabled: d,
		value: !0
	});
	let m = d ? f.value : !0, h = g.useRef(null), { clusterDirection: _, itemDirection: v } = li(t, i), y = g.useCallback(() => {
		h.current && clearTimeout(h.current), h.current = null;
	}, []), b = g.useCallback((e) => {
		p((t) => ((t.autoHideEnabled ? t.value : !0) !== e && s?.(e), {
			autoHideEnabled: d,
			value: e
		}));
	}, [d, s]), x = g.useCallback(() => {
		y(), d && (h.current = setTimeout(() => b(!1), a));
	}, [
		d,
		a,
		y,
		b
	]), S = g.useCallback(() => {
		b(!0), x();
	}, [x, b]);
	return g.useEffect(() => {
		if (!d) {
			y();
			return;
		}
		return x(), y;
	}, [
		d,
		y,
		x
	]), /* @__PURE__ */ E(U, {
		accessibilityRole: "toolbar",
		accessibilityLabel: c,
		style: [
			r === "relative" ? void 0 : {
				position: "absolute",
				zIndex: 40,
				...si[n]
			},
			{
				flexDirection: _,
				alignItems: "center",
				gap: u.spacing.scale[3],
				opacity: m ? 1 : .4
			},
			l
		],
		children: e.map((e, t) => /* @__PURE__ */ E(di, {
			item: e,
			itemDirection: v,
			onReveal: S
		}, e.id ?? `${e.label}-${t}`))
	});
}
function di({ item: e, itemDirection: t, onReveal: n }) {
	let { theme: r, scales: i } = K();
	return /* @__PURE__ */ D(R, {
		disabled: e.disabled,
		onPress: () => {
			n(), !e.disabled && (e.onPress?.(), e.onClick?.(), e.href && I.openURL(e.href));
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
		children: [/* @__PURE__ */ D(de, {
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
			children: [e.icon, e.badge != null && /* @__PURE__ */ E(U, {
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
				children: /* @__PURE__ */ E(V, {
					style: [q("label.xs"), { color: r.text["on-media"] }],
					children: ci(e.badge)
				})
			})]
		}), /* @__PURE__ */ E(V, {
			numberOfLines: 1,
			style: [q("label.xs"), {
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
function fi({ label: e = "ファイル", description: t, triggerLabel: n = "選択する", icon: r, loading: i = !1, disabled: a = !1, onPress: o, style: s }) {
	let { theme: c, scales: l } = K(), u = a || i;
	return /* @__PURE__ */ D(R, {
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
			/* @__PURE__ */ E(U, {
				style: {
					width: 40,
					height: 40,
					alignItems: "center",
					justifyContent: "center",
					borderRadius: l.borderRadius.lg,
					backgroundColor: c.surface.secondary
				},
				children: r ?? /* @__PURE__ */ E(V, {
					style: [q("heading.md"), { color: c.text["medium-emphasis"] }],
					children: "＋"
				})
			}),
			/* @__PURE__ */ D(U, {
				style: {
					flex: 1,
					minWidth: 0
				},
				children: [typeof e == "string" ? /* @__PURE__ */ E(V, {
					numberOfLines: 1,
					style: [q("label.md"), { color: c.text["high-emphasis"] }],
					children: e
				}) : e, t && (typeof t == "string" ? /* @__PURE__ */ E(V, {
					style: [q("body.sm"), {
						color: c.text["medium-emphasis"],
						marginTop: 2
					}],
					children: t
				}) : t)]
			}),
			/* @__PURE__ */ E(X, {
				variant: "secondary",
				disabled: u,
				loading: i,
				onPress: o,
				children: n
			})
		]
	});
}
function pi({ images: e = [], onRemove: t, removeLabel: n = (e) => `${e.name ?? "画像"}を削除`, previewVariant: r = "grid", label: i = "画像", description: a = "JPG / PNG / WebP", triggerLabel: o = "画像を追加", ...s }) {
	let { theme: c, scales: l } = K();
	return /* @__PURE__ */ D(U, {
		style: { gap: l.spacing.scale[3] },
		children: [/* @__PURE__ */ E(fi, {
			...s,
			label: i,
			description: a,
			triggerLabel: o
		}), e.length > 0 && /* @__PURE__ */ E(U, {
			style: {
				flexDirection: r === "grid" ? "row" : "column",
				flexWrap: r === "grid" ? "wrap" : "nowrap",
				gap: l.spacing.scale[2]
			},
			children: e.map((e) => /* @__PURE__ */ D(U, {
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
					/* @__PURE__ */ E(P, {
						source: e.source ?? { uri: e.uri ?? "" },
						accessibilityLabel: e.alt ?? e.name,
						style: {
							width: r === "list" ? 56 : "100%",
							aspectRatio: 1,
							borderRadius: r === "list" ? l.borderRadius.lg : 0
						}
					}),
					r === "list" && /* @__PURE__ */ E(V, {
						numberOfLines: 1,
						style: [q("label.sm"), {
							color: c.text["high-emphasis"],
							flex: 1
						}],
						children: e.name ?? e.alt ?? "画像"
					}),
					t && /* @__PURE__ */ E(X, {
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
function mi(e, t) {
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
function hi({ icon: e, emoji: t, label: n, description: r, meta: i, selected: a = !1, loading: o = !1, disabled: s = !1, variant: c = a ? "selected" : "neutral", onPress: l, style: u }) {
	let { theme: d, scales: f } = K(), p = s || o, m = mi(c, d);
	return /* @__PURE__ */ D(R, {
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
		children: [/* @__PURE__ */ D(U, {
			style: {
				flexDirection: "row",
				alignItems: "flex-start",
				justifyContent: "space-between",
				gap: f.spacing.scale[2]
			},
			children: [/* @__PURE__ */ D(U, {
				style: {
					flex: 1,
					minWidth: 0,
					flexDirection: "row",
					alignItems: "center",
					gap: f.spacing.scale[2]
				},
				children: [
					t && /* @__PURE__ */ E(V, {
						style: q("heading.md"),
						children: t
					}),
					e,
					typeof n == "string" ? /* @__PURE__ */ E(V, {
						numberOfLines: 1,
						style: [q("label.md"), {
							color: d.text["high-emphasis"],
							flex: 1
						}],
						children: n
					}) : n
				]
			}), o && /* @__PURE__ */ E(Ue, { size: "sm" })]
		}), (r || i) && /* @__PURE__ */ D(U, {
			style: {
				flexDirection: "row",
				alignItems: "flex-end",
				justifyContent: "space-between",
				gap: f.spacing.scale[2]
			},
			children: [typeof r == "string" ? /* @__PURE__ */ E(V, {
				style: [q("body.sm"), {
					color: d.text["medium-emphasis"],
					flex: 1
				}],
				children: r
			}) : r, typeof i == "string" ? /* @__PURE__ */ E(V, {
				style: [q("label.sm"), { color: d.text["low-emphasis"] }],
				children: i
			}) : i]
		})]
	});
}
function gi({ columns: e = 3, gap: t = 12, children: n, style: r }) {
	return /* @__PURE__ */ E(U, {
		style: [{
			flexDirection: "row",
			flexWrap: "wrap",
			gap: t
		}, r],
		children: g.Children.map(n, (n) => /* @__PURE__ */ E(U, {
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
function _i({ options: e, values: t = [], onChange: n, multiple: r = !0 }) {
	let { scales: i } = K(), a = (e) => {
		r ? n?.(t.includes(e) ? t.filter((t) => t !== e) : [...t, e]) : n?.(t.includes(e) ? [] : [e]);
	};
	return /* @__PURE__ */ E(U, {
		style: {
			flexDirection: "row",
			flexWrap: "wrap",
			gap: i.spacing.scale[2]
		},
		children: e.map((e) => /* @__PURE__ */ E(Ve, {
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
var vi = 80, yi = 36;
function bi({ icon: e, label: t, options: n, selected: r, onSelect: i, onClear: a, getLabel: o, getIcon: s, alwaysExpanded: c = !1 }) {
	let { theme: l, scales: u } = K(), d = r != null && r !== "", [f, p] = g.useState({
		selected: r,
		forced: !1
	});
	f.selected !== r && p({
		selected: r,
		forced: !1
	});
	let m = f.selected === r && f.forced, h = d && n.includes(r), _ = c || !h || m ? n : n.filter((e) => e === r), v = t ? /* @__PURE__ */ E(V, {
		style: [q("label.sm"), {
			color: l.text["medium-emphasis"],
			width: vi,
			lineHeight: yi
		}],
		numberOfLines: 1,
		children: t
	}) : /* @__PURE__ */ E(U, {
		style: {
			width: 24,
			height: yi,
			alignItems: "center",
			justifyContent: "center"
		},
		children: e
	});
	return /* @__PURE__ */ D(U, {
		style: {
			flexDirection: "row",
			alignItems: "flex-start",
			gap: u.spacing.scale[4],
			paddingVertical: u.spacing.scale[3]
		},
		children: [v, /* @__PURE__ */ E(U, {
			style: {
				flex: 1,
				flexDirection: "row",
				flexWrap: "wrap",
				gap: u.spacing.scale[2],
				minHeight: yi,
				alignItems: "center"
			},
			children: _.map((e) => /* @__PURE__ */ D(Ve, {
				size: "md",
				selected: !m && r === e,
				onPress: () => {
					m ? (i(e), p({
						selected: e,
						forced: !1
					})) : r === e ? a ? a() : c || p({
						selected: r,
						forced: !0
					}) : i(e);
				},
				children: [s ? `${s(e)} ` : "", o(e)]
			}, e))
		})]
	});
}
//#endregion
//#region src/native/components/ChipFilterBar.tsx
var xi = (e) => `${e.toLocaleString()}件`;
function Si({ children: e, resultCount: t, resultCountLabel: n = xi }) {
	let { theme: r, scales: i } = K();
	return /* @__PURE__ */ D(U, { children: [/* @__PURE__ */ E(z, {
		horizontal: !0,
		showsHorizontalScrollIndicator: !1,
		contentContainerStyle: { gap: i.spacing.scale[2] },
		children: e
	}), t !== void 0 && /* @__PURE__ */ E(V, {
		style: [q("label.xs"), {
			color: r.text["low-emphasis"],
			marginTop: i.spacing.scale[2]
		}],
		children: n(t)
	})] });
}
//#endregion
//#region src/native/components/CategoryNav.tsx
function Ci({ items: e, value: t, onChange: n }) {
	let { theme: r, scales: i } = K();
	return /* @__PURE__ */ E(z, {
		horizontal: !0,
		showsHorizontalScrollIndicator: !1,
		contentContainerStyle: {
			gap: i.spacing.scale[3],
			paddingHorizontal: i.spacing.scale[4],
			paddingVertical: i.spacing.scale[2]
		},
		children: e.map((e) => {
			let a = t === e.key;
			return /* @__PURE__ */ D(R, {
				onPress: () => n?.(e.key),
				style: {
					alignItems: "center",
					gap: i.spacing.scale[1],
					width: 64
				},
				children: [/* @__PURE__ */ E(U, {
					style: {
						width: 56,
						height: 56,
						borderRadius: 28,
						backgroundColor: a ? r.brand.primary : r.surface.secondary,
						alignItems: "center",
						justifyContent: "center"
					},
					children: e.icon
				}), /* @__PURE__ */ E(V, {
					numberOfLines: 1,
					style: [q("label.xs"), { color: a ? r.text["accent-primary"] : r.text["medium-emphasis"] }],
					children: e.label
				})]
			}, e.key);
		})
	});
}
//#endregion
//#region src/native/components/CategoryScroll.tsx
function wi({ items: e, value: t, onChange: n }) {
	let { theme: r, scales: i } = K();
	return /* @__PURE__ */ E(z, {
		horizontal: !0,
		showsHorizontalScrollIndicator: !1,
		contentContainerStyle: {
			gap: i.spacing.scale[2],
			paddingHorizontal: i.spacing.scale[4],
			paddingVertical: i.spacing.scale[2]
		},
		children: e.map((e) => {
			let a = t === e.key;
			return /* @__PURE__ */ D(R, {
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
				children: [/* @__PURE__ */ E(V, {
					style: [q("label.sm"), {
						color: a ? r.text["on-inverse"] : r.text["high-emphasis"],
						fontWeight: a ? "700" : "500"
					}],
					children: e.label
				}), e.count !== void 0 && /* @__PURE__ */ E(U, {
					style: {
						paddingHorizontal: 6,
						borderRadius: 999,
						backgroundColor: a ? r.surface.primary : r.surface.tertiary,
						minWidth: 20,
						alignItems: "center"
					},
					children: /* @__PURE__ */ E(V, {
						style: [q("label.xs"), { color: a ? r.text["accent-primary"] : r.text["medium-emphasis"] }],
						children: e.count
					})
				})]
			}, e.key);
		})
	});
}
//#endregion
//#region src/native/components/ProgressSteps.tsx
function Ti({ steps: e, current: t }) {
	let { theme: n } = K();
	return /* @__PURE__ */ E(U, {
		style: {
			flexDirection: "row",
			alignItems: "flex-start",
			gap: 0
		},
		children: e.map((r, i) => {
			let a = i < t, o = i === t, s = a || o;
			return /* @__PURE__ */ D(g.Fragment, { children: [/* @__PURE__ */ D(U, {
				style: {
					alignItems: "center",
					flex: 1
				},
				children: [/* @__PURE__ */ E(U, {
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
					children: /* @__PURE__ */ E(V, {
						style: [q("label.xs"), {
							color: s ? n.text["on-inverse"] : n.text["medium-emphasis"],
							fontWeight: "700"
						}],
						children: a ? "✓" : i + 1
					})
				}), /* @__PURE__ */ E(V, {
					style: [q("label.xs"), {
						color: s ? n.text["accent-primary"] : n.text["medium-emphasis"],
						marginTop: 4,
						textAlign: "center"
					}],
					children: r.label
				})]
			}), i < e.length - 1 && /* @__PURE__ */ E(U, { style: {
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
function Ei({ value: e = [], onChange: t, placeholder: n = "タグを入力", maxTags: r = 10 }) {
	let { theme: i, scales: a } = K(), [o, s] = w(""), c = () => {
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
	return /* @__PURE__ */ D(U, {
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
		children: [e.map((e) => /* @__PURE__ */ D(U, {
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
			children: [/* @__PURE__ */ E(V, {
				style: [q("label.sm"), { color: i.text["accent-primary"] }],
				children: e
			}), /* @__PURE__ */ E(R, {
				onPress: () => l(e),
				hitSlop: 6,
				children: /* @__PURE__ */ E(V, {
					style: [q("label.sm"), { color: i.text["accent-primary"] }],
					children: "×"
				})
			})]
		}, e)), /* @__PURE__ */ E(H, {
			value: o,
			onChangeText: s,
			onSubmitEditing: c,
			onBlur: c,
			placeholder: e.length === 0 ? n : "",
			placeholderTextColor: i.text["low-emphasis"],
			returnKeyType: "done",
			style: [q("body.md"), {
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
function Di({ message: e, url: t, title: n, extra: r = [] }) {
	let { theme: i, scales: a } = K(), o = [{
		label: "共有",
		onPress: async () => {
			try {
				await B.share({
					message: [e, t].filter(Boolean).join(" "),
					title: n,
					url: t
				});
			} catch {}
		}
	}, ...r];
	return /* @__PURE__ */ E(U, {
		style: {
			flexDirection: "row",
			flexWrap: "wrap",
			gap: a.spacing.scale[2]
		},
		children: o.map((e, t) => /* @__PURE__ */ E(R, {
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
			children: /* @__PURE__ */ E(V, {
				style: [q("label.sm"), { color: i.text["accent-primary"] }],
				children: e.label
			})
		}, t))
	});
}
//#endregion
//#region src/native/components/FilterChip.tsx
function Oi(e) {
	return /* @__PURE__ */ E(Ve, {
		...e,
		shape: "pill",
		variant: "filled"
	});
}
//#endregion
//#region src/native/components/PresenceIndicator.tsx
function ki(e) {
	let t = e.trim();
	return t ? t.slice(0, 1).toUpperCase() : "?";
}
function Ai({ name: e, statusText: t, badgeLabel: n, online: r = !0 }) {
	let { theme: i, scales: a } = K();
	return /* @__PURE__ */ D(U, {
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
			/* @__PURE__ */ D(U, { children: [/* @__PURE__ */ E(Re, {
				fallback: ki(e),
				size: "sm"
			}), /* @__PURE__ */ E(U, { style: {
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
			t ? /* @__PURE__ */ E(V, {
				style: [q("caption"), { color: i.text["medium-emphasis"] }],
				numberOfLines: 1,
				children: t
			}) : null,
			n ? /* @__PURE__ */ E(Oe, {
				tone: "success",
				children: n
			}) : null
		]
	});
}
//#endregion
//#region src/native/components/ImageGallery.tsx
function ji({ images: e, initialIndex: t = 0, thumbnailSize: n = 80 }) {
	let { theme: r, scales: i } = K(), [a, o] = w({
		open: !1,
		index: t
	}), s = j.get("window").width;
	return /* @__PURE__ */ D(T, { children: [/* @__PURE__ */ E(N, {
		data: e,
		horizontal: !0,
		showsHorizontalScrollIndicator: !1,
		contentContainerStyle: { gap: i.spacing.scale[2] },
		keyExtractor: (e, t) => String(t),
		renderItem: ({ item: e, index: t }) => /* @__PURE__ */ E(R, {
			onPress: () => o({
				open: !0,
				index: t
			}),
			children: /* @__PURE__ */ E(P, {
				source: e,
				style: {
					width: n,
					height: n,
					borderRadius: i.borderRadius.md,
					backgroundColor: r.surface.tertiary
				}
			})
		})
	}), /* @__PURE__ */ E(te, {
		visible: a.open,
		transparent: !0,
		animationType: "fade",
		onRequestClose: () => o({
			...a,
			open: !1
		}),
		children: /* @__PURE__ */ D(U, {
			style: {
				flex: 1,
				backgroundColor: r.surface.inverse
			},
			children: [
				/* @__PURE__ */ E(R, {
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
					children: /* @__PURE__ */ E(V, {
						style: [q("heading.lg"), { color: r.text["on-inverse"] }],
						children: "×"
					})
				}),
				/* @__PURE__ */ E(N, {
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
					renderItem: ({ item: e }) => /* @__PURE__ */ E(U, {
						style: {
							width: s,
							alignItems: "center",
							justifyContent: "center"
						},
						children: /* @__PURE__ */ E(P, {
							source: e,
							resizeMode: "contain",
							style: {
								width: s,
								height: "100%"
							}
						})
					})
				}),
				/* @__PURE__ */ E(U, {
					style: {
						position: "absolute",
						bottom: 32,
						left: 0,
						right: 0,
						alignItems: "center"
					},
					children: /* @__PURE__ */ D(V, {
						style: [q("label.md"), { color: r.text["on-inverse"] }],
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
var Mi = {
	google: "Google でログイン",
	apple: "Apple でログイン",
	line: "LINE でログイン",
	amazon: "Amazon でログイン",
	github: "GitHub でログイン",
	x: "X でログイン"
};
function Ni({ provider: e, label: t, onPress: n, disabled: r = !1 }) {
	let { theme: i, scales: a } = K(), o = a.brandExternal, s = {
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
	return /* @__PURE__ */ E(R, {
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
		children: /* @__PURE__ */ E(U, {
			style: {
				flexDirection: "row",
				alignItems: "center",
				gap: a.spacing.scale[2]
			},
			children: /* @__PURE__ */ E(V, {
				style: [q("label.md"), { color: s.fg }],
				children: t ?? Mi[e]
			})
		})
	});
}
//#endregion
//#region src/native/components/social-icon-data.ts
var Pi = {
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
function Fi({ brand: e, size: t = 24 }) {
	let { theme: n } = K(), r = Pi[e];
	return /* @__PURE__ */ E(U, {
		style: {
			width: t,
			height: t,
			borderRadius: t / 2,
			backgroundColor: r.color,
			alignItems: "center",
			justifyContent: "center"
		},
		children: /* @__PURE__ */ E(V, {
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
function Ii({ count: e = 3, variant: t = "row" }) {
	let { scales: n } = K();
	return /* @__PURE__ */ E(U, {
		style: { gap: n.spacing.scale[3] },
		children: Array.from({ length: e }).map((e, r) => t === "card" ? /* @__PURE__ */ D(U, {
			style: { gap: n.spacing.scale[2] },
			children: [
				/* @__PURE__ */ E(Z, {
					height: 140,
					radius: n.borderRadius.lg
				}),
				/* @__PURE__ */ E(Z, {
					height: 14,
					width: "60%"
				}),
				/* @__PURE__ */ E(Z, {
					height: 12,
					width: "40%"
				})
			]
		}, r) : t === "list" ? /* @__PURE__ */ D(U, {
			style: { gap: 8 },
			children: [/* @__PURE__ */ E(Z, {
				height: 14,
				width: "80%"
			}), /* @__PURE__ */ E(Z, {
				height: 12,
				width: "50%"
			})]
		}, r) : /* @__PURE__ */ D(U, {
			style: {
				flexDirection: "row",
				gap: n.spacing.scale[3],
				alignItems: "center"
			},
			children: [/* @__PURE__ */ E(Z, {
				width: 48,
				height: 48,
				radius: 24
			}), /* @__PURE__ */ D(U, {
				style: {
					flex: 1,
					gap: 6
				},
				children: [/* @__PURE__ */ E(Z, {
					height: 14,
					width: "70%"
				}), /* @__PURE__ */ E(Z, {
					height: 12,
					width: "50%"
				})]
			})]
		}, r))
	});
}
function Li({ rows: e = 5, hasFilter: t = !0, rowHeight: n = 56 }) {
	let { scales: r } = K();
	return /* @__PURE__ */ D(U, {
		style: { gap: r.spacing.scale[2] },
		children: [t && /* @__PURE__ */ D(U, {
			style: {
				flexDirection: "row",
				gap: r.spacing.scale[2],
				marginBottom: r.spacing.scale[1]
			},
			children: [
				/* @__PURE__ */ E(Z, {
					width: 80,
					height: 36,
					radius: r.borderRadius.full
				}),
				/* @__PURE__ */ E(Z, {
					width: 80,
					height: 36,
					radius: r.borderRadius.full
				}),
				/* @__PURE__ */ E(Z, {
					width: 80,
					height: 36,
					radius: r.borderRadius.full
				})
			]
		}), Array.from({ length: e }).map((e, t) => /* @__PURE__ */ E(Z, {
			width: "100%",
			height: n,
			radius: r.borderRadius["2xl"]
		}, t))]
	});
}
function Ri({ rows: e = 3, columns: t = 2, cardHeight: n = 140 }) {
	let { scales: r } = K(), i = Math.max(1, Math.min(t, 4)), a = Math.max(0, e) * i, o = r.spacing.scale[3];
	return /* @__PURE__ */ E(U, {
		style: {
			flexDirection: "row",
			flexWrap: "wrap",
			marginHorizontal: -o / 2
		},
		children: Array.from({ length: a }).map((e, t) => /* @__PURE__ */ E(U, {
			style: {
				width: `${100 / i}%`,
				paddingHorizontal: o / 2,
				marginBottom: o
			},
			children: /* @__PURE__ */ E(Z, {
				width: "100%",
				height: n,
				radius: r.borderRadius["2xl"]
			})
		}, t))
	});
}
//#endregion
//#region src/native/components/BottomTabBar.tsx
function zi() {
	let [e, t] = w(!1);
	return b(() => {
		let e = F.addListener("keyboardDidShow", () => t(!0)), n = F.addListener("keyboardDidHide", () => t(!1));
		return () => {
			e.remove(), n.remove();
		};
	}, []), e;
}
function Bi({ keyboardBehavior: e = "stay", keyboardLiftOffset: t = 160, ...n }) {
	let r = zi();
	return e === "hide" && r ? null : /* @__PURE__ */ E(U, {
		style: e === "lift" && r ? { transform: [{ translateY: -t }] } : void 0,
		children: /* @__PURE__ */ E(wr, { ...n })
	});
}
function Vi({ state: e, descriptors: t, navigation: n, insets: r, keyboardBehavior: i = "hide", keyboardLiftOffset: a = 160, hiddenRouteNames: o = [], floating: s = !0, glass: c = !0, glassIntensity: l = "regular", glassTint: u = "system", showLabels: d = !0, iconSize: f = 24, style: p, contentStyle: m, itemStyle: h, labelStyle: g }) {
	let { theme: _, scales: v } = K(), y = zi(), b = e.routes[e.index], x = b ? t[b.key]?.options : void 0, S = r?.bottom ?? 0;
	if (i === "hide" && y || Wi(x?.tabBarStyle)) return null;
	let C = e.routes.filter((e) => {
		let n = t[e.key]?.options;
		return !o.includes(e.name) && n?.href !== null && n?.tabBarButton !== null;
	});
	if (C.length === 0) return null;
	let w = i === "lift" && y ? -a : 0, T = s ? {
		position: "absolute",
		left: v.spacing.scale[4],
		right: v.spacing.scale[4],
		bottom: S + v.spacing.scale[3],
		transform: [{ translateY: w }]
	} : {
		paddingBottom: S,
		transform: [{ translateY: w }]
	}, O = /* @__PURE__ */ E(U, {
		style: [{
			minHeight: d ? 64 : v.touchTargets.navItem.min,
			paddingHorizontal: v.spacing.scale[2],
			paddingVertical: v.spacing.scale[2],
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-around",
			borderRadius: s ? v.borderRadius.full : v.borderRadius.none
		}, m],
		children: C.map((r) => {
			let i = e.routes.findIndex((e) => e.key === r.key), a = e.index === i, o = t[r.key]?.options ?? {}, c = a ? o.tabBarActiveTintColor ?? _.text["accent-primary"] : o.tabBarInactiveTintColor ?? _.text["medium-emphasis"];
			return /* @__PURE__ */ D(R, {
				accessibilityRole: "button",
				accessibilityState: { selected: a },
				accessibilityLabel: o.tabBarAccessibilityLabel ?? Ui(r, o),
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
				children: [/* @__PURE__ */ D(U, {
					style: {
						minHeight: f,
						alignItems: "center",
						justifyContent: "center"
					},
					children: [o.tabBarIcon?.({
						focused: a,
						color: c,
						size: f
					}), o.tabBarBadge != null && /* @__PURE__ */ E(U, {
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
						children: /* @__PURE__ */ E(V, {
							style: [q("label.xs"), { color: _.text["on-inverse"] }],
							children: o.tabBarBadge
						})
					})]
				}), d && /* @__PURE__ */ E(V, {
					numberOfLines: 1,
					style: [
						q(a ? "label.xs" : "body.xs"),
						{
							color: c,
							maxWidth: 72
						},
						g
					],
					children: Ui(r, o)
				})]
			}, r.key);
		})
	});
	return /* @__PURE__ */ E(U, {
		pointerEvents: "box-none",
		style: [T, p],
		children: c ? /* @__PURE__ */ E(de, {
			intensity: l,
			tint: u,
			borderRadius: s ? v.borderRadius.full : v.borderRadius.none,
			backgroundFill: s ? void 0 : _.surface.primary,
			children: O
		}) : /* @__PURE__ */ E(U, {
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
function Hi(e = {}) {
	return function(t) {
		return /* @__PURE__ */ E(Vi, {
			...t,
			...e
		});
	};
}
function Ui(e, t) {
	return typeof t.tabBarLabel == "string" ? t.tabBarLabel : typeof t.title == "string" ? t.title : e.name;
}
function Wi(e) {
	return e ? Array.isArray(e) ? e.some(Wi) : typeof e == "object" && "display" in e ? e.display === "none" : !1 : !1;
}
//#endregion
//#region src/native/components/FilterBar.tsx
function Gi({ filters: e, sortLabel: t = "並び替え", onPressSort: n }) {
	let { theme: r, scales: i } = K();
	return /* @__PURE__ */ D(U, {
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
		children: [/* @__PURE__ */ E(z, {
			horizontal: !0,
			showsHorizontalScrollIndicator: !1,
			contentContainerStyle: { gap: i.spacing.scale[2] },
			style: { flex: 1 },
			children: e.map((e) => {
				let t = e.active || !!e.value;
				return /* @__PURE__ */ D(R, {
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
					children: [/* @__PURE__ */ D(V, {
						style: [q("label.sm"), { color: t ? r.text["accent-primary"] : r.text["high-emphasis"] }],
						children: [e.label, e.value ? `: ${e.value}` : ""]
					}), /* @__PURE__ */ E(V, {
						style: [q("label.xs"), { color: t ? r.text["accent-primary"] : r.text["low-emphasis"] }],
						children: "▾"
					})]
				}, e.key);
			})
		}), /* @__PURE__ */ E(R, {
			onPress: n,
			style: ({ pressed: e }) => ({
				paddingHorizontal: i.spacing.scale[2],
				height: 32,
				justifyContent: "center",
				borderRadius: i.borderRadius.full,
				backgroundColor: e ? r.active["tertiary-button"] : "transparent"
			}),
			children: /* @__PURE__ */ E(V, {
				style: [q("label.sm"), { color: r.text["accent-primary"] }],
				children: t
			})
		})]
	});
}
//#endregion
//#region src/native/components/ImageCarousel.tsx
function Ki({ images: e, height: t = 280, showCounter: n = !0, showDots: r = !0 }) {
	let { theme: i, scales: a } = K(), [o, s] = w(0), c = j.get("window").width;
	return /* @__PURE__ */ D(U, { children: [
		/* @__PURE__ */ E(N, {
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
			renderItem: ({ item: e }) => /* @__PURE__ */ E(U, {
				style: {
					width: c,
					height: t,
					backgroundColor: i.surface.tertiary
				},
				children: /* @__PURE__ */ E(P, {
					source: e,
					resizeMode: "cover",
					style: {
						width: "100%",
						height: "100%"
					}
				})
			})
		}),
		n && e.length > 1 && /* @__PURE__ */ E(U, {
			style: {
				position: "absolute",
				top: a.spacing.scale[3],
				right: a.spacing.scale[3],
				paddingHorizontal: 10,
				paddingVertical: 4,
				borderRadius: a.borderRadius.full,
				backgroundColor: i.overlay.dark
			},
			children: /* @__PURE__ */ D(V, {
				style: [q("label.xs"), { color: i.text["on-inverse"] }],
				children: [
					o + 1,
					" / ",
					e.length
				]
			})
		}),
		r && e.length > 1 && /* @__PURE__ */ E(U, {
			style: {
				position: "absolute",
				bottom: a.spacing.scale[3],
				left: 0,
				right: 0,
				flexDirection: "row",
				justifyContent: "center",
				gap: 6
			},
			children: e.map((e, t) => /* @__PURE__ */ E(U, { style: {
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
function qi(e, t = "¥") {
	return `${t}${e.toLocaleString("ja-JP")}`;
}
function Ji({ price: e, originalPrice: t, currency: n = "¥", size: r = "md", showTax: i = !0 }) {
	let { theme: a, scales: o } = K(), s = typeof t == "number" && t > e, c = s ? Math.round((1 - e / t) * 100) : 0, l = q(r === "lg" ? "heading.2xl" : r === "sm" ? "label.md" : "heading.lg");
	return /* @__PURE__ */ D(U, {
		style: { gap: 2 },
		children: [/* @__PURE__ */ D(U, {
			style: {
				flexDirection: "row",
				alignItems: "baseline",
				gap: o.spacing.scale[2],
				flexWrap: "wrap"
			},
			children: [
				s && /* @__PURE__ */ D(V, {
					style: [q("label.md"), {
						color: a.caution.base,
						fontWeight: "700"
					}],
					children: [c, "% OFF"]
				}),
				/* @__PURE__ */ E(V, {
					style: [l, { color: a.text["high-emphasis"] }],
					children: qi(e, n)
				}),
				i && /* @__PURE__ */ E(V, {
					style: [q("body.sm"), { color: a.text["low-emphasis"] }],
					children: "税込"
				})
			]
		}), s && /* @__PURE__ */ E(V, {
			style: [q("body.sm"), {
				color: a.text["low-emphasis"],
				textDecorationLine: "line-through"
			}],
			children: qi(t, n)
		})]
	});
}
//#endregion
//#region src/native/components/QuantitySelector.tsx
function Yi({ min: e = 1, ...t }) {
	return /* @__PURE__ */ E(Qt, {
		min: e,
		...t
	});
}
//#endregion
//#region src/native/components/RatingDisplay.tsx
function Xi({ rating: e, count: t, size: n = 16, layout: r = "row" }) {
	let { theme: i, scales: a } = K();
	return /* @__PURE__ */ D(U, {
		style: {
			flexDirection: r === "row" ? "row" : "column",
			alignItems: r === "row" ? "center" : "flex-start",
			gap: a.spacing.scale[1]
		},
		children: [/* @__PURE__ */ E($e, {
			value: e,
			size: n,
			readOnly: !0
		}), /* @__PURE__ */ D(U, {
			style: {
				flexDirection: "row",
				alignItems: "center",
				gap: 4
			},
			children: [/* @__PURE__ */ E(V, {
				style: [q("label.sm"), { color: i.text["high-emphasis"] }],
				children: e.toFixed(1)
			}), t !== void 0 && /* @__PURE__ */ D(V, {
				style: [q("body.sm"), { color: i.text["low-emphasis"] }],
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
function Zi({ image: e, title: t, price: n, originalPrice: r, rating: i, reviewCount: a, badge: o, soldOut: s, onPress: c, layout: l = "vertical" }) {
	let { theme: u, scales: d } = K(), f = l === "horizontal", p = f ? 96 : "100%", m = f ? 96 : 160, h = (c = !1) => /* @__PURE__ */ D(U, {
		style: {
			flexDirection: f ? "row" : "column",
			gap: d.spacing.scale[3],
			backgroundColor: u.surface.primary,
			borderRadius: d.borderRadius.lg,
			overflow: "hidden",
			padding: f ? d.spacing.scale[3] : 0,
			opacity: c ? .85 : 1
		},
		children: [/* @__PURE__ */ D(U, {
			style: {
				position: "relative",
				width: p,
				height: m
			},
			children: [
				/* @__PURE__ */ E(P, {
					source: e,
					style: {
						width: "100%",
						height: "100%",
						borderRadius: d.borderRadius.md,
						backgroundColor: u.surface.tertiary
					},
					resizeMode: "cover"
				}),
				s && /* @__PURE__ */ E(U, {
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
					children: /* @__PURE__ */ E(V, {
						style: [q("label.md"), { color: u.text["on-inverse"] }],
						children: "売り切れ"
					})
				}),
				o && /* @__PURE__ */ E(U, {
					style: {
						position: "absolute",
						top: 8,
						left: 8
					},
					children: /* @__PURE__ */ E(He, {
						tone: "caution",
						children: o
					})
				})
			]
		}), /* @__PURE__ */ D(U, {
			style: {
				flex: 1,
				gap: 4,
				padding: f ? 0 : d.spacing.scale[3]
			},
			children: [
				/* @__PURE__ */ E(V, {
					numberOfLines: 2,
					style: [q("body.md"), { color: u.text["high-emphasis"] }],
					children: t
				}),
				i !== void 0 && /* @__PURE__ */ E(Xi, {
					rating: i,
					count: a,
					size: 14
				}),
				/* @__PURE__ */ E(Ji, {
					price: n,
					originalPrice: r,
					size: "sm"
				})
			]
		})]
	});
	return c ? /* @__PURE__ */ E(R, {
		onPress: c,
		disabled: s,
		children: ({ pressed: e }) => h(e)
	}) : h(!1);
}
//#endregion
//#region src/native/components/ProductCarousel.tsx
function Qi({ title: e, action: t, products: n, cardWidth: r = 160 }) {
	let { scales: i } = K();
	return /* @__PURE__ */ D(U, { children: [e && /* @__PURE__ */ E(Wr, {
		title: e,
		action: t
	}), /* @__PURE__ */ E(N, {
		data: n,
		horizontal: !0,
		showsHorizontalScrollIndicator: !1,
		keyExtractor: (e, t) => String(t),
		contentContainerStyle: {
			gap: i.spacing.scale[3],
			paddingHorizontal: i.spacing.scale[4],
			paddingBottom: i.spacing.scale[2]
		},
		renderItem: ({ item: e }) => /* @__PURE__ */ E(U, {
			style: { width: r },
			children: /* @__PURE__ */ E(Zi, { ...e })
		})
	})] });
}
//#endregion
//#region src/native/components/OrderSummary.tsx
function $i(e, t) {
	return `${t}${e.toLocaleString("ja-JP")}`;
}
function ea({ lines: e, currency: t = "¥" }) {
	let { theme: n, scales: r } = K();
	return /* @__PURE__ */ E(U, {
		style: {
			backgroundColor: n.surface.primary,
			borderColor: n.border["low-emphasis"],
			borderWidth: 1,
			borderRadius: r.borderRadius.lg,
			padding: r.spacing.scale[4],
			gap: r.spacing.scale[2]
		},
		children: e.map((e, r) => {
			let i = e.emphasis === "total", a = e.emphasis === "discount", o = a ? n.text.caution : i ? n.text["accent-primary"] : n.text["high-emphasis"], s = q(i ? "label.lg" : "body.md"), c = q(i ? "heading.lg" : "body.md");
			return /* @__PURE__ */ D(g.Fragment, { children: [i && /* @__PURE__ */ E(We, {}), /* @__PURE__ */ D(U, {
				style: {
					flexDirection: "row",
					justifyContent: "space-between"
				},
				children: [/* @__PURE__ */ E(V, {
					style: [s, { color: n.text["medium-emphasis"] }],
					children: e.label
				}), /* @__PURE__ */ D(V, {
					style: [c, { color: o }],
					children: [a && e.value > 0 ? "-" : "", $i(e.value, t)]
				})]
			})] }, r);
		})
	});
}
//#endregion
//#region src/native/components/ReviewCard.tsx
function ta({ authorName: e, authorAvatar: t, rating: n, date: r, title: i, comment: a, helpfulCount: o }) {
	let { theme: s, scales: c } = K();
	return /* @__PURE__ */ D(U, {
		style: {
			backgroundColor: s.surface.primary,
			borderRadius: c.borderRadius.lg,
			borderWidth: 1,
			borderColor: s.border["low-emphasis"],
			padding: c.spacing.scale[4],
			gap: c.spacing.scale[2]
		},
		children: [
			/* @__PURE__ */ D(U, {
				style: {
					flexDirection: "row",
					alignItems: "center",
					gap: c.spacing.scale[2]
				},
				children: [
					/* @__PURE__ */ E(Re, {
						source: t,
						fallback: e[0],
						size: "sm"
					}),
					/* @__PURE__ */ D(U, {
						style: { flex: 1 },
						children: [/* @__PURE__ */ E(V, {
							style: [q("label.md"), { color: s.text["high-emphasis"] }],
							children: e
						}), r && /* @__PURE__ */ E(V, {
							style: [q("body.sm"), { color: s.text["low-emphasis"] }],
							children: r
						})]
					}),
					/* @__PURE__ */ E($e, {
						value: n,
						size: 14,
						readOnly: !0
					})
				]
			}),
			i && /* @__PURE__ */ E(V, {
				style: [q("label.md"), { color: s.text["high-emphasis"] }],
				children: i
			}),
			/* @__PURE__ */ E(V, {
				style: [q("body.md"), { color: s.text["high-emphasis"] }],
				children: a
			}),
			o !== void 0 && /* @__PURE__ */ D(V, {
				style: [q("label.sm"), { color: s.text["low-emphasis"] }],
				children: ["参考になった ", o]
			})
		]
	});
}
//#endregion
//#region src/native/components/ReviewSummary.tsx
function na({ average: e, total: t, distribution: n }) {
	let { theme: r, scales: i } = K();
	return /* @__PURE__ */ D(U, {
		style: {
			flexDirection: "row",
			gap: i.spacing.scale[4],
			padding: i.spacing.scale[4],
			backgroundColor: r.surface.primary,
			borderRadius: i.borderRadius.lg,
			borderWidth: 1,
			borderColor: r.border["low-emphasis"]
		},
		children: [/* @__PURE__ */ D(U, {
			style: {
				alignItems: "center",
				gap: i.spacing.scale[1],
				minWidth: 100
			},
			children: [
				/* @__PURE__ */ E(V, {
					style: [q("heading.3xl"), { color: r.text["high-emphasis"] }],
					children: e.toFixed(1)
				}),
				/* @__PURE__ */ E($e, {
					value: e,
					size: 16,
					readOnly: !0
				}),
				/* @__PURE__ */ D(V, {
					style: [q("body.sm"), { color: r.text["low-emphasis"] }],
					children: [t.toLocaleString("ja-JP"), " 件"]
				})
			]
		}), /* @__PURE__ */ E(U, {
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
				return /* @__PURE__ */ D(U, {
					style: {
						flexDirection: "row",
						alignItems: "center",
						gap: i.spacing.scale[2]
					},
					children: [
						/* @__PURE__ */ E(V, {
							style: [q("label.sm"), {
								color: r.text["medium-emphasis"],
								width: 16
							}],
							children: e
						}),
						/* @__PURE__ */ E(U, {
							style: {
								flex: 1,
								height: 6,
								borderRadius: 3,
								backgroundColor: r.surface.tertiary,
								overflow: "hidden"
							},
							children: /* @__PURE__ */ E(U, { style: {
								width: `${o}%`,
								height: "100%",
								backgroundColor: r.object.rating
							} })
						}),
						/* @__PURE__ */ E(V, {
							style: [q("body.sm"), {
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
function ra({ header: e, footer: t, bottomNav: n, scrollable: r = !0, children: i }) {
	let { theme: a } = K(), o = E(r ? z : U, {
		style: {
			flex: 1,
			backgroundColor: a.surface.secondary
		},
		children: i
	});
	return /* @__PURE__ */ D(U, {
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
function ia({ header: e, footer: t, cta: n, children: r }) {
	let { theme: i } = K();
	return /* @__PURE__ */ D(U, {
		style: {
			flex: 1,
			backgroundColor: i.surface.primary
		},
		children: [
			e,
			/* @__PURE__ */ D(z, {
				style: { flex: 1 },
				contentContainerStyle: { paddingBottom: n ? 80 : 0 },
				children: [r, t]
			}),
			n && /* @__PURE__ */ E(U, {
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
export { c as AUTO_PROMPT_SUPPRESSION_EVENT, vr as Accordion, hi as ActionTile, rn as Alert, on as AlertDialog, Dr as AppHeader, ra as AppShell, Rt as AutoGrowTextarea, i as AutoPrompt, Re as Avatar, Oe as Badge, Nr as Banner, Pr as BannerCarousel, Bn as BottomSheetForm, Vn as BottomSheetFrame, Bi as BottomTabBar, Er as Breadcrumb, X as Button, cr as Calendar, De as Card, Ci as CategoryNav, wi as CategoryScroll, xt as Celebration, Dt as CelebrationDialog, Kt as Checkbox, Jt as CheckboxCard, qt as CheckboxField, Yt as CheckboxGroup, Ve as Chip, Si as ChipFilterBar, _i as ChipSelector, Un as CoachMark, Wn as CoachMarkOverlay, yr as Collapsible, bi as CollapsibleChipField, Kn as Combobox, Wt as CommitAutoGrowTextarea, Ht as CommitInput, Ut as CommitTextarea, fi as CompactFilePicker, zn as ConfirmDialog, jt as CountdownHero, it as CountdownTimer, pr as DateField, ur as DatePicker, _r as DateTimePicker, bn as DetailSheetBody, yn as DetailSheetHeader, vn as DetailSheetScaffold, an as Dialog, Qr as DocumentScreen, Jn as DropdownFilter, wn as DropdownMenu, zr as EmptyState, In as ErrorBoundary, Br as ErrorState, Jr as FileUpload, Gi as FilterBar, Oi as FilterChip, Ie as FloatingTabBar, qr as Footer, nn as FormActions, $t as FormField, en as FormRoot, tn as FormSection, de as GlassView, Ne as GradientSurface, Ri as GridSkeleton, Ur as IconBadge, pi as ImageAttachmentPicker, Ki as ImageCarousel, ji as ImageGallery, Pt as Input, xn as KeyboardAwareSheetFooter, Mt as Label, Vi as LiquidBottomTabBar, Ir as ListItem, Li as ListSkeleton, Ii as ListSkeletons, ia as MarketingShell, ui as MediaActionCluster, Rn as MenuDrawer, Or as MobileAppHeader, kr as MobileAppShell, Ar as MobileFloatingActionButton, qn as MultiSelect, wr as NavigationBar, et as NotificationBadge, Qt as NumberInput, ea as OrderSummary, Sr as Pagination, oi as PhotoHero, Yn as PillToggle, Cn as Popover, Ai as PresenceIndicator, Ji as PriceDisplay, Zi as ProductCard, Qi as ProductCarousel, Ze as Progress, Qe as ProgressRing, Ti as ProgressSteps, o as PromptCoordinatorProvider, Zr as Prose, Yi as QuantitySelector, gi as QuickActionGrid, Xt as RadioGroup, Xi as RatingDisplay, Sn as ResponsiveDialog, ta as ReviewCard, Hn as ReviewOverlay, na as ReviewSummary, Xr as Screen, br as ScrollArea, Fr as SearchBar, Wr as SectionHeader, Gn as Select, We as Separator, Rr as SettingsListRow, Lr as SettingsSection, Di as ShareButtons, $ as Sheet, Cr as SimplePagination, Z as Skeleton, Ge as SkeletonText, Zt as Slider, Fi as SocialIcon, Ni as SocialLoginButton, Ue as Spinner, ke as Stack, $e as StarRating, tt as StatCard, jr as StatusActionBadge, Gr as StickyActionBar, Tr as SubNav, Kr as SwipeRow, Gt as Switch, nt as SyncStatusBadge, Mr as SyncStatusButton, Qn as Tabs, tr as TabsContent, $n as TabsList, er as TabsTrigger, He as Tag, Ei as TagInput, J as Text, It as Textarea, G as ThemeProvider, hr as TimePicker, Nn as ToastProvider, Hi as createExpoRouterTabBar, m as getTheme, n as isAutoPromptSuppressed, Se as isNativeLiquidGlassAvailable, p as primitives, q as resolveTypo, d as scales, e as suppressAutoPrompts, f as themeNames, u as themes, Mn as toast, a as usePromptCoordinator, s as usePromptSlot, K as useTheme, En as useToast };
