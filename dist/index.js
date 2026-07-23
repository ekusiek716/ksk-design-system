"use client";
import { n as e } from "./rolldown-runtime-Df-vAQej.js";
import { t } from "./server-variants-BtHHqzwI.js";
import * as n from "react";
import r, { createContext as i, useCallback as a, useContext as o, useEffect as s, useLayoutEffect as c, useMemo as l, useRef as u, useState as d } from "react";
import { Accordion as f, AlertDialog as p, Avatar as m, Checkbox as h, Collapsible as g, Dialog as _, DropdownMenu as v, HoverCard as y, Label as b, Popover as x, Progress as S, RadioGroup as C, ScrollArea as w, Select as T, Separator as E, Slider as D, Switch as ee, Tabs as O, Tooltip as k } from "radix-ui";
import { clsx as A } from "clsx";
import { twMerge as j } from "tailwind-merge";
import { Fragment as M, jsx as N, jsxs as P } from "react/jsx-runtime";
import { cva as F } from "class-variance-authority";
import { Add as I, ArrowDown2 as L, ArrowLeft2 as R, ArrowRight2 as z, ArrowSwapVertical as B, ArrowUp2 as te, CloseCircle as V, DocumentUpload as ne, ExportSquare as H, Gallery as re, HamburgerMenu as ie, InfoCircle as ae, More as oe, TickCircle as se, TickSquare as ce, Warning2 as le } from "iconsax-reactjs";
import { Slot as ue } from "@radix-ui/react-slot";
import { createPortal as de } from "react-dom";
//#region src/lib/utils.ts
function U(...e) {
	return j(A(e));
}
//#endregion
//#region src/components/ui/accordion.tsx
function fe({ ...e }) {
	return /* @__PURE__ */ N(f.Root, {
		"data-slot": "accordion",
		...e
	});
}
function pe({ className: e, ...t }) {
	return /* @__PURE__ */ N(f.Item, {
		"data-slot": "accordion-item",
		className: U("border-b border-[var(--Border-Low-Emphasis)]", e),
		...t
	});
}
function me({ className: e, children: t, ...n }) {
	return /* @__PURE__ */ N(f.Header, {
		className: "flex",
		children: /* @__PURE__ */ P(f.Trigger, {
			"data-slot": "accordion-trigger",
			className: U("flex flex-1 items-center justify-between py-4 typo-label-md text-[var(--Text-High-Emphasis)] transition-all cursor-pointer", "hover:underline [&[data-state=open]>svg]:rotate-180", e),
			...n,
			children: [t, /* @__PURE__ */ N("svg", {
				width: "16",
				height: "16",
				viewBox: "0 0 16 16",
				fill: "none",
				className: "shrink-0 transition-transform duration-200",
				children: /* @__PURE__ */ N("path", {
					d: "M4 6L8 10L12 6",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				})
			})]
		})
	});
}
function he({ className: e, children: t, ...n }) {
	return /* @__PURE__ */ N(f.Content, {
		"data-slot": "accordion-content",
		className: "overflow-hidden typo-body-md text-[var(--Text-High-Emphasis)] data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up",
		...n,
		children: /* @__PURE__ */ N("div", {
			className: U("pb-4 pt-0", e),
			children: t
		})
	});
}
//#endregion
//#region src/components/ui/alert.tsx
var ge = F("relative w-full", {
	variants: { variant: {
		success: [
			"flex flex-col items-start overflow-clip rounded-lg",
			"bg-[var(--Surface-Primary)]",
			"shadow-[0_0_0_5px_rgba(31,204,132,0.2)]"
		].join(" "),
		info: [
			"flex flex-col items-start overflow-clip rounded-lg",
			"bg-[var(--Surface-Primary)]",
			"shadow-[0_0_0_5px_rgba(216,216,219,0.3)]"
		].join(" "),
		error: [
			"flex flex-col items-start overflow-clip rounded-lg",
			"bg-[var(--Surface-Primary)]",
			"shadow-[0_0_0_5px_rgba(236,0,0,0.15)]"
		].join(" "),
		warning: [
			"flex flex-col items-start overflow-clip rounded-lg",
			"bg-[var(--Surface-Primary)]",
			"shadow-[0_0_0_5px_rgba(193,104,0,0.2)]"
		].join(" "),
		"inline-info": [
			"flex gap-1 items-start rounded-sm",
			"bg-[var(--Surface-Tertiary)]",
			"px-3 py-2"
		].join(" "),
		"inline-caution": [
			"flex gap-1 items-start rounded-sm",
			"bg-[var(--Surface-Caution)]",
			"px-3 py-2"
		].join(" "),
		"inline-warning": [
			"flex gap-1 items-start rounded-sm",
			"bg-[var(--Surface-Warning)]",
			"px-3 py-2"
		].join(" ")
	} },
	defaultVariants: { variant: "info" }
}), _e = F("flex w-full gap-2 items-start p-4 rounded-lg border border-[var(--Border-Medium-Emphasis)]", {
	variants: { variant: {
		success: "border-[var(--Focus-High-Emphasis)]",
		info: "border-[var(--Border-Medium-Emphasis)]",
		error: "border-[var(--Border-Caution)]",
		warning: "border-[var(--Border-Warning)]",
		"inline-info": "border-0",
		"inline-caution": "border-0",
		"inline-warning": "border-0"
	} },
	defaultVariants: { variant: "info" }
}), ve = n.createContext("info"), ye = (e) => e === "success" || e === "info" || e === "error" || e === "warning", be = {
	success: {
		Icon: se,
		color: "text-[var(--Text-Success)]"
	},
	info: {
		Icon: ae,
		color: "text-[var(--Text-Medium-Emphasis)]"
	},
	error: {
		Icon: V,
		color: "text-[var(--Text-Caution)]"
	},
	warning: {
		Icon: le,
		color: "text-[var(--Text-Warning)]"
	}
};
function xe({ className: e, variant: t = "info", children: n, title: r, description: i, icon: a, action: o, ...s }) {
	let c = ye(t);
	if (c && !n && (r || i)) {
		let { Icon: n, color: c } = be[t], l = Se[t] ?? "", u = a ?? /* @__PURE__ */ N(n, {
			size: 24,
			className: U("shrink-0", c)
		});
		return /* @__PURE__ */ N(ve.Provider, {
			value: t,
			children: /* @__PURE__ */ N("div", {
				"data-slot": "alert",
				"data-variant": t,
				role: "alert",
				className: U(ge({ variant: t }), e),
				...s,
				children: /* @__PURE__ */ P("div", {
					className: _e({ variant: t }),
					children: [
						u,
						/* @__PURE__ */ P("div", {
							className: "flex-1 min-w-0",
							children: [r && /* @__PURE__ */ N("div", {
								className: U("typo-label-md", l),
								children: r
							}), i && /* @__PURE__ */ N("div", {
								className: "typo-body-sm text-[var(--Text-Medium-Emphasis)] mt-1",
								children: i
							})]
						}),
						o && /* @__PURE__ */ N("div", {
							className: "shrink-0",
							children: o
						})
					]
				})
			})
		});
	}
	return /* @__PURE__ */ N(ve.Provider, {
		value: t,
		children: /* @__PURE__ */ N("div", {
			"data-slot": "alert",
			"data-variant": t,
			role: "alert",
			className: U(ge({ variant: t }), e),
			...s,
			children: c ? /* @__PURE__ */ N("div", {
				className: _e({ variant: t }),
				children: n
			}) : n
		})
	});
}
var Se = {
	success: "text-[var(--Text-Success)]",
	info: "text-[var(--Text-High-Emphasis)]",
	error: "text-[var(--Text-Caution)]",
	warning: "text-[var(--Text-Warning)]",
	"inline-info": "text-[var(--Text-High-Emphasis)]",
	"inline-caution": "text-[var(--Text-Caution)]",
	"inline-warning": "text-[var(--Text-Warning)]"
};
function Ce({ className: e, ...t }) {
	return /* @__PURE__ */ N("div", {
		"data-slot": "alert-title",
		className: U("typo-label-md", Se[n.useContext(ve) ?? "info"] ?? "", e),
		...t
	});
}
var we = {
	error: "text-[var(--Text-Caution)]",
	"inline-caution": "text-[var(--Text-Caution)]",
	"inline-warning": "text-[var(--Text-Warning)]"
};
function Te({ className: e, ...t }) {
	return /* @__PURE__ */ N("div", {
		"data-slot": "alert-description",
		className: U("typo-body-sm", (we[n.useContext(ve) ?? ""] ?? "") || "text-[var(--Text-Medium-Emphasis)]", e),
		...t
	});
}
//#endregion
//#region src/components/ui/button.tsx
var Ee = {
	light: 10,
	medium: 25,
	heavy: 50,
	warning: [
		30,
		50,
		30
	]
};
function W({ className: e, variant: r, size: i, layout: a, haptic: o, onClick: s, type: c, ...l }) {
	let u = n.useCallback((e) => {
		o && typeof navigator < "u" && "vibrate" in navigator && navigator.vibrate(Ee[o]), s?.(e);
	}, [o, s]);
	return /* @__PURE__ */ N("button", {
		"data-slot": "button",
		"data-variant": r ?? "default",
		"data-size": i ?? "default",
		type: c ?? "button",
		className: U(t({
			variant: r,
			size: i,
			layout: a,
			className: e
		})),
		onClick: u,
		...l
	});
}
//#endregion
//#region src/components/ui/alert-dialog.tsx
function De({ ...e }) {
	return /* @__PURE__ */ N(p.Root, {
		"data-slot": "alert-dialog",
		...e
	});
}
function Oe({ ...e }) {
	return /* @__PURE__ */ N(p.Trigger, {
		"data-slot": "alert-dialog-trigger",
		...e
	});
}
function ke({ ...e }) {
	return /* @__PURE__ */ N(p.Portal, {
		"data-slot": "alert-dialog-portal",
		...e
	});
}
function Ae({ className: e, ...t }) {
	return /* @__PURE__ */ N(p.Overlay, {
		"data-slot": "alert-dialog-overlay",
		className: U("fixed inset-0 z-50 bg-[var(--Overlay-Medium)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0", e),
		...t
	});
}
function je({ className: e, size: t = "default", ...n }) {
	return /* @__PURE__ */ P(ke, { children: [/* @__PURE__ */ N(Ae, {}), /* @__PURE__ */ N(p.Content, {
		"data-slot": "alert-dialog-content",
		"data-size": t,
		onOpenAutoFocus: (e) => e.preventDefault(),
		className: U("group/alert-dialog-content fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%_-_2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-[var(--Radius-Modal)] border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-6 shadow-[var(--shadow-dialog)] duration-200 data-[size=sm]:max-w-xs data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[size=default]:sm:max-w-lg", e),
		...n
	})] });
}
function Me({ className: e, ...t }) {
	return /* @__PURE__ */ N("div", {
		"data-slot": "alert-dialog-header",
		className: U("flex flex-col gap-2 text-center sm:text-left", e),
		...t
	});
}
function Ne({ className: e, orientation: t = "split", ...n }) {
	return /* @__PURE__ */ N("div", {
		"data-slot": "alert-dialog-footer",
		"data-orientation": t,
		className: U("pt-4", t === "stacked" ? "flex flex-col-reverse gap-2 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end" : "flex flex-row gap-3 [&>*]:flex-1 [&>*]:basis-0", e),
		...n
	});
}
function Pe({ className: e, ...t }) {
	return /* @__PURE__ */ N(p.Title, {
		"data-slot": "alert-dialog-title",
		className: U("typo-heading-lg text-[var(--Text-High-Emphasis)]", e),
		...t
	});
}
function Fe({ className: e, ...t }) {
	return /* @__PURE__ */ N(p.Description, {
		"data-slot": "alert-dialog-description",
		className: U("typo-body-sm text-[var(--Text-Medium-Emphasis)]", e),
		...t
	});
}
function Ie({ className: e, variant: n = "default", size: r = "default", ...i }) {
	return /* @__PURE__ */ N(p.Action, {
		"data-slot": "alert-dialog-action",
		className: U(t({
			variant: n,
			size: r
		}), e),
		...i
	});
}
function Le({ className: e, variant: n = "tertiary", size: r = "default", ...i }) {
	return /* @__PURE__ */ N(p.Cancel, {
		"data-slot": "alert-dialog-cancel",
		className: U(t({
			variant: n,
			size: r
		}), e),
		...i
	});
}
//#endregion
//#region src/components/ui/avatar.tsx
function Re({ className: e, ...t }) {
	return /* @__PURE__ */ N(m.Root, {
		"data-slot": "avatar",
		className: U("relative flex size-10 shrink-0 overflow-hidden rounded-full", e),
		...t
	});
}
function ze({ className: e, ...t }) {
	return /* @__PURE__ */ N(m.Image, {
		"data-slot": "avatar-image",
		className: U("aspect-square size-full", e),
		...t
	});
}
function Be({ className: e, ...t }) {
	return /* @__PURE__ */ N(m.Fallback, {
		"data-slot": "avatar-fallback",
		className: U("flex size-full items-center justify-center rounded-full bg-[var(--Surface-Tertiary)] typo-label-sm text-[var(--Text-Medium-Emphasis)]", e),
		...t
	});
}
//#endregion
//#region src/components/ui/badge.tsx
var Ve = F("inline-flex items-center justify-center rounded-full border border-transparent px-2.5 py-0.5 typo-label-sm w-fit whitespace-nowrap shrink-0 transition-colors", {
	variants: { variant: {
		default: "border-transparent bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)]",
		secondary: "border-transparent bg-[var(--Surface-Secondary)] text-[var(--Text-High-Emphasis)]",
		outline: "border-[var(--Border-Medium-Emphasis)] text-[var(--Text-High-Emphasis)]",
		destructive: "border-transparent bg-[var(--Caution-Base)] text-[var(--Text-on-Inverse)]",
		success: "border-transparent bg-[var(--Success-Base)] text-[var(--Text-on-Inverse)]",
		warning: "border-transparent bg-[var(--Warning-Base)] text-[var(--Text-on-Inverse)]",
		info: "border-transparent bg-[var(--Info-Base)] text-[var(--Text-on-Inverse)]",
		subtle: "border-transparent bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)]",
		ghost: "border-transparent text-[var(--Text-High-Emphasis)]"
	} },
	defaultVariants: { variant: "default" }
});
function He({ className: e, variant: t, ...n }) {
	return /* @__PURE__ */ N("span", {
		"data-slot": "badge",
		"data-variant": t ?? "default",
		className: U(Ve({ variant: t }), e),
		...n
	});
}
//#endregion
//#region src/components/ui/breadcrumb.tsx
function Ue({ label: e = "パンくずリスト", ...t }) {
	return /* @__PURE__ */ N("nav", {
		"aria-label": e,
		"data-slot": "breadcrumb",
		...t
	});
}
function We({ className: e, ...t }) {
	return /* @__PURE__ */ N("ol", {
		"data-slot": "breadcrumb-list",
		className: U("flex flex-wrap items-center gap-1.5 break-words typo-body-sm text-[var(--Text-Medium-Emphasis)]", e),
		...t
	});
}
function Ge({ className: e, ...t }) {
	return /* @__PURE__ */ N("li", {
		"data-slot": "breadcrumb-item",
		className: U("inline-flex items-center gap-1.5", e),
		...t
	});
}
function Ke({ className: e, ...t }) {
	return /* @__PURE__ */ N("a", {
		"data-slot": "breadcrumb-link",
		className: U("hover:text-[var(--Text-High-Emphasis)] transition-colors", e),
		...t
	});
}
function qe({ className: e, ...t }) {
	return /* @__PURE__ */ N("span", {
		"data-slot": "breadcrumb-page",
		role: "link",
		"aria-disabled": "true",
		"aria-current": "page",
		className: U("text-[var(--Text-High-Emphasis)] typo-label-sm", e),
		...t
	});
}
function Je({ children: e, className: t, ...n }) {
	return /* @__PURE__ */ N("li", {
		role: "presentation",
		"aria-hidden": "true",
		"data-slot": "breadcrumb-separator",
		className: U("[&>svg]:size-3.5", t),
		...n,
		children: e ?? /* @__PURE__ */ N("svg", {
			width: "16",
			height: "16",
			viewBox: "0 0 16 16",
			fill: "none",
			children: /* @__PURE__ */ N("path", {
				d: "M6 4L10 8L6 12",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			})
		})
	});
}
function Ye({ className: e, ...t }) {
	return /* @__PURE__ */ P("span", {
		role: "presentation",
		"aria-hidden": "true",
		"data-slot": "breadcrumb-ellipsis",
		className: U("flex size-9 items-center justify-center", e),
		...t,
		children: [/* @__PURE__ */ P("svg", {
			width: "16",
			height: "16",
			viewBox: "0 0 16 16",
			fill: "none",
			children: [
				/* @__PURE__ */ N("circle", {
					cx: "3",
					cy: "8",
					r: "1",
					fill: "currentColor"
				}),
				/* @__PURE__ */ N("circle", {
					cx: "8",
					cy: "8",
					r: "1",
					fill: "currentColor"
				}),
				/* @__PURE__ */ N("circle", {
					cx: "13",
					cy: "8",
					r: "1",
					fill: "currentColor"
				})
			]
		}), /* @__PURE__ */ N("span", {
			className: "sr-only",
			children: "その他"
		})]
	});
}
//#endregion
//#region src/components/ui/card.tsx
var Xe = F("bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)] flex flex-col rounded-[var(--Radius-Surface)] ksk-squircle border border-[var(--Border-Low-Emphasis)] shadow-[var(--shadow-md)] @container", {
	variants: { variant: {
		default: "gap-6 p-6",
		media: "gap-0 p-0 overflow-hidden"
	} },
	defaultVariants: { variant: "default" }
});
function Ze({ className: e, variant: t, ...n }) {
	return /* @__PURE__ */ N("div", {
		"data-slot": "card",
		"data-variant": t ?? "default",
		className: U(Xe({ variant: t }), e),
		...n
	});
}
function Qe({ className: e, ...t }) {
	return /* @__PURE__ */ N("div", {
		"data-slot": "card-header",
		className: U("flex flex-col gap-1.5 @sm:flex-row @sm:items-center", e),
		...t
	});
}
function $e({ className: e, ...t }) {
	return /* @__PURE__ */ N("div", {
		"data-slot": "card-title",
		className: U("typo-heading-lg", e),
		...t
	});
}
function et({ className: e, ...t }) {
	return /* @__PURE__ */ N("div", {
		"data-slot": "card-description",
		className: U("typo-body-sm text-[var(--Text-Medium-Emphasis)]", e),
		...t
	});
}
function tt({ className: e, ...t }) {
	return /* @__PURE__ */ N("div", {
		"data-slot": "card-action",
		className: U("@sm:ml-auto", e),
		...t
	});
}
function nt({ className: e, ...t }) {
	return /* @__PURE__ */ N("div", {
		"data-slot": "card-content",
		className: U("", e),
		...t
	});
}
function rt({ className: e, ...t }) {
	return /* @__PURE__ */ N("div", {
		"data-slot": "card-footer",
		className: U("flex items-center gap-2", e),
		...t
	});
}
//#endregion
//#region src/components/ui/checkbox.tsx
function it({ className: e, ...t }) {
	return /* @__PURE__ */ N(h.Root, {
		"data-slot": "checkbox",
		className: U("peer size-5 shrink-0 rounded-[5px] border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)]", "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50", "disabled:cursor-not-allowed disabled:opacity-50", "data-[state=checked]:bg-[var(--Brand-Primary)] data-[state=checked]:text-[var(--Text-on-Inverse)] data-[state=checked]:border-[var(--Brand-Primary)]", "data-[state=indeterminate]:bg-[var(--Brand-Primary)] data-[state=indeterminate]:text-[var(--Text-on-Inverse)] data-[state=indeterminate]:border-[var(--Brand-Primary)]", e),
		...t,
		children: /* @__PURE__ */ N(h.Indicator, {
			"data-slot": "checkbox-indicator",
			className: "flex items-center justify-center text-current",
			children: t.checked === "indeterminate" ? /* @__PURE__ */ N("svg", {
				width: "12",
				height: "12",
				viewBox: "0 0 12 12",
				fill: "none",
				"aria-hidden": "true",
				children: /* @__PURE__ */ N("path", {
					d: "M2 6H10",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round"
				})
			}) : /* @__PURE__ */ N("svg", {
				width: "12",
				height: "12",
				viewBox: "0 0 12 12",
				fill: "none",
				"aria-hidden": "true",
				children: /* @__PURE__ */ N("path", {
					d: "M10 3L4.5 8.5L2 6",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				})
			})
		})
	});
}
function at({ label: e, description: t, count: r, containerClassName: i, className: a, id: o, ...s }) {
	let c = n.useId(), l = o ?? c;
	return e === void 0 ? /* @__PURE__ */ N(it, {
		id: l,
		className: a,
		...s
	}) : /* @__PURE__ */ P("label", {
		htmlFor: l,
		"data-slot": "checkbox-row",
		"data-disabled": s.disabled || void 0,
		className: U("flex items-center gap-3 rounded-md px-3 py-2 transition-colors cursor-pointer", "hover:bg-[var(--Surface-Tertiary)]", "has-[:focus-visible]:bg-[var(--Surface-Tertiary)]", s.disabled && "cursor-not-allowed opacity-60 hover:bg-transparent has-[:focus-visible]:bg-transparent", i),
		children: [
			/* @__PURE__ */ N(it, {
				id: l,
				className: a,
				...s
			}),
			/* @__PURE__ */ P("div", {
				className: "flex-1 min-w-0",
				children: [/* @__PURE__ */ N("span", {
					className: "typo-body-md text-[var(--Text-High-Emphasis)]",
					children: e
				}), t && /* @__PURE__ */ N("span", {
					className: "block typo-body-sm text-[var(--Text-Medium-Emphasis)] mt-0.5",
					children: t
				})]
			}),
			r !== void 0 && /* @__PURE__ */ N("span", {
				className: "shrink-0 typo-label-sm text-[var(--Text-Medium-Emphasis)] tabular-nums",
				children: r.toLocaleString()
			})
		]
	});
}
//#endregion
//#region src/components/ui/checkbox-card.tsx
function ot({ className: e, ...t }) {
	return /* @__PURE__ */ N("div", {
		"data-slot": "checkbox-card-group",
		className: U("grid gap-3", e),
		...t
	});
}
function st({ className: e, children: t, description: n, expandedContent: r, badge: i, ...a }) {
	return /* @__PURE__ */ P(h.Root, {
		"data-slot": "checkbox-card-item",
		className: U("group flex cursor-pointer gap-2 rounded-lg border-2 border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] p-4 text-left focus-visible:outline-none transition-colors", r ? "flex-col items-stretch" : "items-center", "hover:border-[var(--Text-High-Emphasis)] hover:bg-[var(--Surface-Secondary)]", "data-[state=checked]:border-[var(--Object-Accent-Primary)] data-[state=checked]:bg-[var(--Surface-Primary)]", "focus-visible:border-[var(--Object-Accent-Primary)] focus-visible:ring-2 focus-visible:ring-[var(--Object-Accent-Primary)]/20", "aria-invalid:border-[var(--Border-Caution)]", "disabled:cursor-not-allowed disabled:border-[var(--Border-Medium-Emphasis)] disabled:bg-[var(--Surface-Secondary)]", "disabled:hover:border-[var(--Border-Medium-Emphasis)] disabled:hover:bg-[var(--Surface-Secondary)]", e),
		...a,
		children: [/* @__PURE__ */ P("span", {
			className: U("flex items-center gap-2", r && "w-full"),
			children: [/* @__PURE__ */ N("span", {
				"data-slot": "checkbox-card-icon",
				className: U("flex size-5 shrink-0 items-center justify-center rounded-[5px] border-2 border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] transition-colors", "group-data-[state=checked]:border-transparent group-data-[state=checked]:bg-transparent", "group-data-[disabled]:border-[var(--Border-Medium-Emphasis)] group-data-[disabled]:bg-[var(--Surface-Secondary)]"),
				children: /* @__PURE__ */ N(h.Indicator, {
					className: "flex items-center justify-center",
					children: /* @__PURE__ */ N(ce, {
						size: 24,
						variant: "Bold",
						className: "text-[var(--Object-Accent-Primary)]"
					})
				})
			}), (t || n || i) && /* @__PURE__ */ P("span", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [(t || i) && /* @__PURE__ */ P("span", {
					className: "flex items-center gap-1.5",
					children: [t && /* @__PURE__ */ N("span", {
						"data-slot": "checkbox-card-label",
						className: U("typo-body-lg text-[var(--Text-High-Emphasis)]", "group-data-[disabled]:text-[var(--Text-Low-Emphasis)]"),
						children: t
					}), i && /* @__PURE__ */ N("span", {
						"data-slot": "checkbox-card-badge",
						children: i
					})]
				}), n && /* @__PURE__ */ N("span", {
					"data-slot": "checkbox-card-description",
					className: U("typo-body-sm text-[var(--Text-Medium-Emphasis)]", "group-data-[disabled]:text-[var(--Text-Low-Emphasis)]"),
					children: n
				})]
			})]
		}), r && /* @__PURE__ */ N("span", {
			"data-slot": "checkbox-card-expanded",
			className: "hidden border-t border-[var(--Border-Medium-Emphasis)] pt-3 group-data-[state=checked]:block",
			children: r
		})]
	});
}
//#endregion
//#region src/components/ui/label.tsx
function ct({ className: e, ...t }) {
	return /* @__PURE__ */ N(b.Root, {
		"data-slot": "label",
		className: U("typo-label-md text-[var(--Text-High-Emphasis)] peer-disabled:cursor-not-allowed peer-disabled:opacity-50", e),
		...t
	});
}
//#endregion
//#region src/components/ui/checkbox-group.tsx
function lt({ label: e, required: t, helpText: n, error: r, columns: i = 2, children: a, className: o }) {
	let s = i === 1 ? "grid-cols-1" : i === 3 ? "grid-cols-3" : "grid-cols-2";
	return /* @__PURE__ */ P("fieldset", {
		"data-slot": "checkbox-group",
		className: U("flex flex-col gap-3", o),
		"aria-invalid": !!r || void 0,
		children: [
			/* @__PURE__ */ P("legend", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ N("span", {
					className: "typo-label-md text-[var(--Text-High-Emphasis)]",
					children: e
				}), t && /* @__PURE__ */ N("span", {
					className: "inline-flex items-center px-1.5 py-0.5 rounded bg-[var(--Surface-Accent-Primary-Light)] typo-label-xs text-[var(--Brand-Primary)]",
					children: "必須"
				})]
			}),
			/* @__PURE__ */ N("div", {
				className: U("grid gap-2", s),
				children: a
			}),
			n && !r && /* @__PURE__ */ N("p", {
				className: "typo-body-xs text-[var(--Text-Low-Emphasis)]",
				children: n
			}),
			r && /* @__PURE__ */ N("p", {
				className: "typo-body-xs text-[var(--Text-Caution)]",
				role: "alert",
				children: r
			})
		]
	});
}
function ut({ className: e, children: t, description: r, ...i }) {
	let a = n.useId();
	return /* @__PURE__ */ P("div", {
		"data-slot": "checkbox-group-item",
		className: U("flex items-start gap-2", e),
		children: [/* @__PURE__ */ N(at, {
			id: a,
			className: "mt-0.5",
			...i
		}), /* @__PURE__ */ P("div", {
			className: "flex flex-col gap-0.5",
			children: [/* @__PURE__ */ N(ct, {
				htmlFor: a,
				className: U("typo-body-md cursor-pointer", "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"),
				children: t
			}), r && /* @__PURE__ */ N("span", {
				className: "typo-body-xs text-[var(--Text-Medium-Emphasis)]",
				children: r
			})]
		})]
	});
}
//#endregion
//#region src/components/ui/checkbox-field.tsx
function dt({ label: e, description: t, error: r, className: i, id: a, ...o }) {
	let s = n.useId(), c = a ?? s, l = r ? `${c}-error` : void 0;
	return /* @__PURE__ */ P("div", {
		"data-slot": "checkbox-field",
		className: U("flex flex-col gap-1.5", i),
		children: [/* @__PURE__ */ P("div", {
			className: "flex items-start gap-2",
			children: [/* @__PURE__ */ N(at, {
				id: c,
				className: "mt-0.5",
				"aria-invalid": !!r || void 0,
				"aria-describedby": l,
				...o
			}), /* @__PURE__ */ P("div", {
				className: U("flex flex-col gap-0.5", o.disabled && "opacity-60"),
				children: [/* @__PURE__ */ N(ct, {
					htmlFor: c,
					className: "typo-body-md text-[var(--Text-High-Emphasis)] cursor-pointer",
					children: e
				}), t && /* @__PURE__ */ N("span", {
					className: "typo-body-xs text-[var(--Text-Medium-Emphasis)]",
					children: t
				})]
			})]
		}), r && /* @__PURE__ */ N("p", {
			id: l,
			className: "typo-body-xs text-[var(--Text-Caution)]",
			children: r
		})]
	});
}
//#endregion
//#region src/components/ui/collapsible.tsx
function ft({ ...e }) {
	return /* @__PURE__ */ N(g.Root, {
		"data-slot": "collapsible",
		...e
	});
}
function pt({ ...e }) {
	return /* @__PURE__ */ N(g.CollapsibleTrigger, {
		"data-slot": "collapsible-trigger",
		...e
	});
}
function mt({ ...e }) {
	return /* @__PURE__ */ N(g.CollapsibleContent, {
		"data-slot": "collapsible-content",
		...e
	});
}
//#endregion
//#region src/components/ui/dialog.tsx
function ht(e, t, n) {
	return t === !1 ? null : t === "title" ? e.querySelector(`[data-slot="${n}"]`) : t === "first-input" ? e.querySelector([
		"input:not([disabled])",
		"textarea:not([disabled])",
		"select:not([disabled])",
		"button:not([disabled])",
		"[href]",
		"[tabindex]:not([tabindex='-1'])"
	].join(", ")) : t.current;
}
function gt(e, t, n) {
	if (!e || t == null) return;
	let r = ht(e, t, n);
	r && (r.tabIndex < 0 && t === "title" && (r.tabIndex = -1), r.focus());
}
function _t(e) {
	e.current != null || typeof document > "u" || (e.current = document.activeElement);
}
function vt({ ...e }) {
	return /* @__PURE__ */ N(_.Root, {
		"data-slot": "dialog",
		...e
	});
}
function yt({ ...e }) {
	return /* @__PURE__ */ N(_.Trigger, {
		"data-slot": "dialog-trigger",
		...e
	});
}
function bt({ ...e }) {
	return /* @__PURE__ */ N(_.Portal, {
		"data-slot": "dialog-portal",
		...e
	});
}
function xt({ ...e }) {
	return /* @__PURE__ */ N(_.Close, {
		"data-slot": "dialog-close",
		...e
	});
}
function St({ className: e, ...t }) {
	return /* @__PURE__ */ N(_.Overlay, {
		"data-slot": "dialog-overlay",
		className: U("fixed inset-0 z-50 bg-[var(--Overlay-Dark)]", "data-[state=open]:animate-in data-[state=open]:fade-in-0", "data-[state=closed]:animate-out data-[state=closed]:fade-out-0", e),
		...t
	});
}
function Ct({ className: e, children: t, padding: r = !0, description: i, position: a = "center", autoFocus: o, restoreFocusOnClose: s = !0, closeOnEsc: c = !0, bodyScrollLock: l = !0, ...u }) {
	let d = n.useId(), f = n.useRef(null), p = n.useRef(null), m = i != null && i !== !1, h = m ? d : u["aria-describedby"], g = (e) => {
		_t(p), u.onOpenAutoFocus?.(e), !(e.defaultPrevented || o == null) && (e.preventDefault(), o !== !1 && window.requestAnimationFrame(() => {
			gt(f.current, o, "dialog-title");
		}));
	}, v = (e) => {
		if (u.onCloseAutoFocus?.(e), !e.defaultPrevented) {
			if (!s) {
				e.preventDefault();
				return;
			}
			p.current && (e.preventDefault(), p.current.focus());
		}
	}, y = (e) => {
		u.onEscapeKeyDown?.(e), c || e.preventDefault();
	};
	return /* @__PURE__ */ P(bt, { children: [/* @__PURE__ */ N(St, {}), /* @__PURE__ */ P(_.Content, {
		ref: f,
		"data-slot": "dialog-content",
		"data-position": a,
		className: U("fixed left-[50%] z-50 w-full max-w-[calc(100%_-_3rem)] sm:max-w-[480px] translate-x-[-50%]", a === "top" ? "top-[max(env(safe-area-inset-top),2rem)] max-h-[calc(100dvh_-_max(env(safe-area-inset-top),2rem)_-_2rem)] overflow-y-auto" : "top-[50%] translate-y-[-50%]", "rounded-[var(--Radius-Modal)] ksk-squircle bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)] shadow-[var(--shadow-dialog)]", r && "flex flex-col gap-4 p-6", "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95", "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95", e),
		...u,
		"aria-describedby": h,
		onOpenAutoFocus: g,
		onCloseAutoFocus: v,
		onEscapeKeyDown: y,
		children: [m && /* @__PURE__ */ N(_.Description, {
			id: d,
			className: "sr-only",
			children: i
		}), t]
	})] });
}
function wt({ className: e, ...t }) {
	return /* @__PURE__ */ N("div", {
		"data-slot": "dialog-header",
		className: U("flex flex-col gap-2", e),
		...t
	});
}
function Tt({ className: e, orientation: t = "split", ...n }) {
	return /* @__PURE__ */ N("div", {
		"data-slot": "dialog-footer",
		"data-orientation": t,
		className: U("pt-4", t === "stacked" ? "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end" : "flex flex-row gap-3 [&>*]:flex-1 [&>*]:basis-0", e),
		...n
	});
}
function Et({ className: e, ...t }) {
	return /* @__PURE__ */ N(_.Title, {
		"data-slot": "dialog-title",
		className: U("typo-heading-lg text-[var(--Text-High-Emphasis)]", e),
		...t
	});
}
function Dt({ className: e, ...t }) {
	return /* @__PURE__ */ N(_.Description, {
		"data-slot": "dialog-description",
		className: U("typo-body-md text-[var(--Text-Medium-Emphasis)]", e),
		...t
	});
}
//#endregion
//#region node_modules/react-hook-form/dist/index.esm.mjs
var Ot = (e) => e.type === "checkbox", kt = (e) => e instanceof Date, At = (e) => e == null, jt = (e) => typeof e == "object", Mt = (e) => !At(e) && !Array.isArray(e) && jt(e) && !kt(e), Nt = (e) => Mt(e) && e.target ? Ot(e.target) ? e.target.checked : e.target.value : e, Pt = (e, t) => t.split(".").some((t, n, r) => !isNaN(Number(t)) && e.has(r.slice(0, n).join("."))), Ft = (e) => {
	let t = e.constructor && e.constructor.prototype;
	return Mt(t) && t.hasOwnProperty("isPrototypeOf");
}, It = typeof window < "u" && window.HTMLElement !== void 0 && typeof document < "u";
function Lt(e) {
	if (e instanceof Date) return new Date(e);
	let t = typeof FileList < "u" && e instanceof FileList;
	if (It && (e instanceof Blob || t)) return e;
	let n = Array.isArray(e);
	if (!n && !(Mt(e) && Ft(e))) return e;
	let r = n ? [] : Object.create(Object.getPrototypeOf(e));
	for (let t in e) Object.prototype.hasOwnProperty.call(e, t) && (r[t] = Lt(e[t]));
	return r;
}
var Rt = {
	BLUR: "blur",
	FOCUS_OUT: "focusout",
	CHANGE: "change",
	SUBMIT: "submit",
	TRIGGER: "trigger",
	VALID: "valid"
}, zt = {
	onBlur: "onBlur",
	onChange: "onChange",
	onSubmit: "onSubmit",
	onTouched: "onTouched",
	all: "all"
}, Bt = [
	"__proto__",
	"constructor",
	"prototype"
], Vt = /^\w*$/, Ht = (e) => Vt.test(e), Ut = (e) => e === void 0, Wt = /[.[\]'"]/, Gt = (e) => e.split(Wt).filter(Boolean), G = (e, t, n) => {
	if (!t || !Mt(e)) return n;
	let r = Ht(t) ? [t] : Gt(t);
	if (r.some((e) => Bt.includes(e))) return n;
	let i = r.reduce((e, t) => At(e) ? void 0 : e[t], e);
	return Ut(i) || i === e ? Ut(e[t]) ? n : e[t] : i;
}, Kt = (e) => typeof e == "boolean", qt = (e) => typeof e == "function", Jt = (e, t, n) => {
	let r = -1, i = Ht(t) ? [t] : Gt(t), a = i.length, o = a - 1;
	for (; ++r < a;) {
		let t = i[r], a = n;
		if (r !== o) {
			let n = e[t];
			a = Mt(n) || Array.isArray(n) ? n : isNaN(+i[r + 1]) ? {} : [];
		}
		if (Bt.includes(t)) return;
		e[t] = a, e = e[t];
	}
}, Yt = r.createContext(null);
Yt.displayName = "HookFormControlContext";
var Xt = () => r.useContext(Yt), Zt = (e, t, n, r = !0) => {
	let i = {};
	for (let a in e) Object.defineProperty(i, a, { get: () => {
		let i = a;
		return t._proxyFormState[i] !== zt.all && (t._proxyFormState[i] = !r || zt.all), n && (n[i] = !0), e[i];
	} });
	return i;
}, Qt = It ? r.useLayoutEffect : r.useEffect;
function $t(e) {
	let t = Xt(), { control: n = t, disabled: i, name: a, exact: o } = e || {}, [s, c] = r.useState(() => ({
		...n._formState,
		defaultValues: n._defaultValues
	})), l = r.useRef({
		isDirty: !1,
		isLoading: !1,
		dirtyFields: !1,
		touchedFields: !1,
		validatingFields: !1,
		isValidating: !1,
		isValid: !1,
		errors: !1
	});
	return Qt(() => n._subscribe({
		name: a,
		formState: l.current,
		exact: o,
		callback: (e) => {
			!i && c({
				...n._formState,
				...e,
				defaultValues: n._defaultValues
			});
		}
	}), [
		a,
		i,
		o
	]), r.useEffect(() => {
		l.current.isValid && n._setValid(!0);
	}, [n]), r.useMemo(() => Zt(s, n, l.current, !1), [s, n]);
}
var en = (e) => typeof e == "string", tn = (e, t, n, r, i) => en(e) ? (r && t.watch.add(e), G(n, e, i)) : Array.isArray(e) ? e.map((e) => (r && t.watch.add(e), G(n, e))) : (r && (t.watchAll = !0), n), nn = (e) => At(e) || !jt(e), rn = (e, t) => t.length === 0 && !Array.isArray(e) && !Ft(e);
function an(e, t, n = /* @__PURE__ */ new WeakMap()) {
	if (e === t) return !0;
	if (nn(e) || nn(t)) return Object.is(e, t);
	if (kt(e) && kt(t)) return Object.is(e.getTime(), t.getTime());
	let r = Object.keys(e), i = Object.keys(t);
	if (r.length !== i.length) return !1;
	if (rn(e, r) || rn(t, i)) return Object.is(e, t);
	if (!r.length && Array.isArray(e) !== Array.isArray(t)) return !1;
	let a = n.get(e);
	if (a && a.has(t)) return !0;
	if (a) a.add(t);
	else {
		let r = /* @__PURE__ */ new WeakSet();
		r.add(t), n.set(e, r);
	}
	for (let i of r) {
		let r = e[i];
		if (!(i in t)) return !1;
		if (i !== "ref") {
			let e = t[i];
			if (kt(r) && kt(e) || (Mt(r) || Array.isArray(r)) && (Mt(e) || Array.isArray(e)) ? !an(r, e, n) : !Object.is(r, e)) return !1;
		}
	}
	return !0;
}
function on(e) {
	let t = Xt(), { control: n = t, name: i, defaultValue: a, disabled: o, exact: s, compute: c } = e || {}, l = r.useRef(a), u = r.useRef(c), d = r.useRef(void 0), f = r.useRef(n), p = r.useRef(i);
	u.current = c;
	let [m, h] = r.useState(() => {
		let e = n._getWatch(i, l.current);
		return u.current ? u.current(e) : e;
	}), g = r.useCallback((e) => {
		let t = tn(i, n._names, e || n._formValues, !1, l.current);
		return u.current ? u.current(t) : t;
	}, [
		n._formValues,
		n._names,
		i
	]), _ = r.useCallback((e) => {
		if (!o) {
			let t = tn(i, n._names, e || n._formValues, !1, l.current);
			if (u.current) {
				let e = u.current(t);
				an(e, d.current) || (h(e), d.current = e);
			} else h(t);
		}
	}, [
		n._formValues,
		n._names,
		o,
		i
	]);
	Qt(() => ((f.current !== n || !an(p.current, i)) && (f.current = n, p.current = i, _()), n._subscribe({
		name: i,
		formState: { values: !0 },
		exact: s,
		callback: (e) => {
			_(e.values);
		}
	})), [
		n,
		s,
		i,
		_
	]), r.useEffect(() => n._removeUnmounted());
	let v = f.current !== n, y = p.current, b = r.useMemo(() => {
		if (o) return null;
		let e = !v && !an(y, i);
		return v || e ? g() : null;
	}, [
		o,
		v,
		i,
		y,
		g
	]);
	return b === null ? m : b;
}
function sn(e) {
	let t = Xt(), { name: n, disabled: i, control: a = t, shouldUnregister: o, defaultValue: s, exact: c = !0 } = e, l = Pt(a._names.array, n), u = on({
		control: a,
		name: n,
		defaultValue: r.useMemo(() => G(a._formValues, n, G(a._defaultValues, n, s)), [
			a,
			n,
			s
		]),
		exact: c
	}), d = $t({
		control: a,
		name: n,
		exact: c
	}), f = r.useRef(e), p = r.useRef(null), m = r.useRef(a.register(n, {
		...e.rules,
		value: u,
		...Kt(e.disabled) ? { disabled: e.disabled } : {}
	}));
	f.current = e;
	let h = r.useMemo(() => Object.defineProperties({}, {
		invalid: {
			enumerable: !0,
			get: () => !!G(d.errors, n)
		},
		isDirty: {
			enumerable: !0,
			get: () => !!G(d.dirtyFields, n)
		},
		isTouched: {
			enumerable: !0,
			get: () => !!G(d.touchedFields, n)
		},
		isValidating: {
			enumerable: !0,
			get: () => !!G(d.validatingFields, n)
		},
		error: {
			enumerable: !0,
			get: () => G(d.errors, n)
		}
	}), [d, n]), g = r.useCallback((e) => {
		let t = Nt(e);
		return G(a._fields, n) || (m.current = a.register(n, {
			...f.current.rules,
			value: t
		})), m.current.onChange({
			target: {
				value: Nt(e),
				name: n
			},
			type: Rt.CHANGE
		});
	}, [n, a]), _ = r.useCallback(() => m.current.onBlur({
		target: {
			value: G(a._formValues, n),
			name: n
		},
		type: Rt.BLUR
	}), [n, a._formValues]), v = r.useCallback((e) => {
		e && (p.current = {
			focus: () => qt(e.focus) && e.focus(),
			select: () => qt(e.select) && e.select(),
			setCustomValidity: (t) => qt(e.setCustomValidity) && e.setCustomValidity(t),
			reportValidity: () => qt(e.reportValidity) && e.reportValidity()
		});
		let t = G(a._fields, n);
		t && t._f && e && (t._f.ref = p.current);
	}, [a._fields, n]), y = r.useMemo(() => ({
		name: n,
		value: u,
		...Kt(i) || d.disabled ? { disabled: d.disabled || i } : {},
		onChange: g,
		onBlur: _,
		ref: v
	}), [
		n,
		i,
		d.disabled,
		g,
		_,
		v,
		u
	]);
	return r.useEffect(() => {
		let e = a._options.shouldUnregister || o;
		a.register(n, {
			...f.current.rules,
			...Kt(f.current.disabled) ? { disabled: f.current.disabled } : {}
		});
		let t = (e, t) => {
			let n = G(a._fields, e);
			n && n._f && (n._f.mount = t);
		};
		if (t(n, !0), e) {
			let e = Lt(G(o ? a._defaultValues : a._options.values || a._defaultValues, n, G(a._options.defaultValues, n, f.current.defaultValue)));
			Jt(a._defaultValues, n, e), Ut(G(a._formValues, n)) && Jt(a._formValues, n, e);
		}
		if (!l && a.register(n), p.current) {
			let e = G(a._fields, n);
			e && e._f && (e._f.ref = p.current);
		}
		return () => {
			(l ? e && !a._state.action : e) ? a.unregister(n) : t(n, !1);
		};
	}, [
		n,
		a,
		l,
		o
	]), r.useEffect(() => {
		a._setDisabledField({
			disabled: i,
			name: n
		});
	}, [
		i,
		n,
		a
	]), r.useMemo(() => ({
		field: y,
		formState: d,
		fieldState: h
	}), [
		y,
		d,
		h
	]);
}
var cn = (e) => e.render(sn(e)), ln = r.createContext(null);
ln.displayName = "HookFormContext";
var un = () => r.useContext(ln), dn = ({ children: e, watch: t, getValues: n, getFieldState: i, setError: a, clearErrors: o, setValue: s, setValues: c, trigger: l, formState: u, resetField: d, reset: f, handleSubmit: p, unregister: m, control: h, register: g, setFocus: _, subscribe: v }) => {
	let y = r.useMemo(() => ({
		watch: t,
		getValues: n,
		getFieldState: i,
		setError: a,
		clearErrors: o,
		setValue: s,
		setValues: c,
		trigger: l,
		formState: u,
		resetField: d,
		reset: f,
		handleSubmit: p,
		unregister: m,
		control: h,
		register: g,
		setFocus: _,
		subscribe: v
	}), [
		o,
		h,
		u,
		i,
		n,
		p,
		g,
		f,
		d,
		a,
		_,
		s,
		c,
		v,
		l,
		m,
		t
	]);
	return r.createElement(ln.Provider, { value: y }, r.createElement(Yt.Provider, { value: y.control }, e));
};
zt.onSubmit, zt.onChange;
//#endregion
//#region src/components/ui/form.tsx
var fn = dn, pn = n.createContext({});
function mn({ ...e }) {
	return /* @__PURE__ */ N(pn.Provider, {
		value: { name: e.name },
		children: /* @__PURE__ */ N(cn, { ...e })
	});
}
var hn = () => {
	let e = n.useContext(pn), t = n.useContext(gn), { getFieldState: r } = un(), i = $t({ name: e.name }), a = r(e.name, i);
	if (!e) throw Error("useFormField should be used within <FormField>");
	let { id: o } = t;
	return {
		id: o,
		name: e.name,
		formItemId: `${o}-form-item`,
		formDescriptionId: `${o}-form-item-description`,
		formMessageId: `${o}-form-item-message`,
		...a
	};
}, gn = n.createContext({});
function _n({ className: e, ...t }) {
	let r = n.useId();
	return /* @__PURE__ */ N(gn.Provider, {
		value: { id: r },
		children: /* @__PURE__ */ N("div", {
			"data-slot": "form-item",
			className: U("grid gap-2", e),
			...t
		})
	});
}
function vn({ className: e, required: t, children: n, ...r }) {
	let { error: i, formItemId: a } = hn();
	return /* @__PURE__ */ P(ct, {
		"data-slot": "form-label",
		"data-error": !!i,
		className: U("data-[error=true]:text-[var(--Text-Caution)]", e),
		htmlFor: a,
		...r,
		children: [n, t && /* @__PURE__ */ N("span", {
			"aria-hidden": !0,
			className: "ml-0.5 text-[var(--Text-Caution)]",
			children: "*"
		})]
	});
}
function yn({ ...e }) {
	let { error: t, formItemId: n, formDescriptionId: r, formMessageId: i } = hn();
	return /* @__PURE__ */ N(ue, {
		"data-slot": "form-control",
		id: n,
		"aria-describedby": t ? `${r} ${i}` : `${r}`,
		"aria-invalid": !!t,
		...e
	});
}
function bn({ className: e, ...t }) {
	let { formDescriptionId: n } = hn();
	return /* @__PURE__ */ N("p", {
		"data-slot": "form-description",
		id: n,
		className: U("typo-body-sm text-[var(--Text-Low-Emphasis)]", e),
		...t
	});
}
function xn({ className: e, ...t }) {
	let { error: n, formMessageId: r } = hn(), i = n ? String(n?.message ?? "") : t.children;
	return i ? /* @__PURE__ */ N("p", {
		"data-slot": "form-message",
		id: r,
		className: U("typo-body-sm text-[var(--Text-Caution)]", e),
		...t,
		children: i
	}) : null;
}
//#endregion
//#region src/components/ui/dropdown-menu.tsx
function Sn({ className: e }) {
	return /* @__PURE__ */ N("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: 2.5,
		strokeLinecap: "round",
		strokeLinejoin: "round",
		"aria-hidden": "true",
		className: U("size-4", e),
		children: /* @__PURE__ */ N("path", { d: "M20 6L9 17l-5-5" })
	});
}
function Cn({ className: e }) {
	return /* @__PURE__ */ N("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: 2.2,
		strokeLinecap: "round",
		strokeLinejoin: "round",
		"aria-hidden": "true",
		className: U("size-4", e),
		children: /* @__PURE__ */ N("path", { d: "M9 18l6-6-6-6" })
	});
}
function wn({ className: e }) {
	return /* @__PURE__ */ N("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		viewBox: "0 0 24 24",
		fill: "currentColor",
		"aria-hidden": "true",
		className: U("size-2", e),
		children: /* @__PURE__ */ N("circle", {
			cx: "12",
			cy: "12",
			r: "6"
		})
	});
}
function Tn({ ...e }) {
	return /* @__PURE__ */ N(v.Root, {
		"data-slot": "dropdown-menu",
		...e
	});
}
function En({ ...e }) {
	return /* @__PURE__ */ N(v.Portal, {
		"data-slot": "dropdown-menu-portal",
		...e
	});
}
function Dn({ ...e }) {
	return /* @__PURE__ */ N(v.Trigger, {
		"data-slot": "dropdown-menu-trigger",
		...e
	});
}
function On({ className: e, sideOffset: t = 4, ...n }) {
	return /* @__PURE__ */ N(v.Portal, { children: /* @__PURE__ */ N(v.Content, {
		"data-slot": "dropdown-menu-content",
		sideOffset: t,
		className: U("z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-1 typo-body-md text-[var(--Text-High-Emphasis)] shadow-[var(--shadow-md)]", "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95", "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95", e),
		...n
	}) });
}
function kn({ ...e }) {
	return /* @__PURE__ */ N(v.Group, {
		"data-slot": "dropdown-menu-group",
		...e
	});
}
function An({ className: e, inset: t, variant: n = "default", ...r }) {
	return /* @__PURE__ */ N(v.Item, {
		"data-slot": "dropdown-menu-item",
		"data-inset": t,
		"data-variant": n,
		className: U("relative flex cursor-default items-center gap-2 rounded-md px-3 py-2.5 typo-body-md outline-hidden select-none", "focus:bg-[var(--Surface-Secondary)] focus:text-[var(--Text-High-Emphasis)]", "data-[disabled]:pointer-events-none data-[disabled]:opacity-50", "data-[inset]:pl-8", "data-[variant=destructive]:text-[var(--Text-Caution)]", "data-[variant=destructive]:focus:bg-[var(--Surface-Caution)]", "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", e),
		...r
	});
}
function jn({ className: e, children: t, checked: n, ...r }) {
	return /* @__PURE__ */ P(v.CheckboxItem, {
		"data-slot": "dropdown-menu-checkbox-item",
		className: U("relative flex cursor-default items-center gap-2 rounded-md py-2.5 pr-3 pl-8 typo-body-md outline-hidden select-none", "focus:bg-[var(--Surface-Secondary)]", "data-[disabled]:pointer-events-none data-[disabled]:opacity-50", "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", e),
		checked: n,
		...r,
		children: [/* @__PURE__ */ N("span", {
			className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center",
			children: /* @__PURE__ */ N(v.ItemIndicator, { children: /* @__PURE__ */ N(Sn, {}) })
		}), t]
	});
}
function Mn({ ...e }) {
	return /* @__PURE__ */ N(v.RadioGroup, {
		"data-slot": "dropdown-menu-radio-group",
		...e
	});
}
function Nn({ className: e, children: t, ...n }) {
	return /* @__PURE__ */ P(v.RadioItem, {
		"data-slot": "dropdown-menu-radio-item",
		className: U("relative flex cursor-default items-center gap-2 rounded-md py-2.5 pr-3 pl-8 typo-body-md outline-hidden select-none", "focus:bg-[var(--Surface-Secondary)]", "data-[disabled]:pointer-events-none data-[disabled]:opacity-50", "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", e),
		...n,
		children: [/* @__PURE__ */ N("span", {
			className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center",
			children: /* @__PURE__ */ N(v.ItemIndicator, { children: /* @__PURE__ */ N(wn, {}) })
		}), t]
	});
}
function Pn({ className: e, inset: t, ...n }) {
	return /* @__PURE__ */ N(v.Label, {
		"data-slot": "dropdown-menu-label",
		"data-inset": t,
		className: U("px-3 py-1.5 typo-label-sm text-[var(--Text-Low-Emphasis)] data-[inset]:pl-8", e),
		...n
	});
}
function Fn({ className: e, ...t }) {
	return /* @__PURE__ */ N(v.Separator, {
		"data-slot": "dropdown-menu-separator",
		className: U("-mx-1 my-1 h-px bg-[var(--Border-Low-Emphasis)]", e),
		...t
	});
}
function In({ className: e, ...t }) {
	return /* @__PURE__ */ N("span", {
		"data-slot": "dropdown-menu-shortcut",
		className: U("ml-auto typo-body-xs text-[var(--Text-Low-Emphasis)]", e),
		...t
	});
}
function Ln({ ...e }) {
	return /* @__PURE__ */ N(v.Sub, {
		"data-slot": "dropdown-menu-sub",
		...e
	});
}
function Rn({ className: e, inset: t, children: n, ...r }) {
	return /* @__PURE__ */ P(v.SubTrigger, {
		"data-slot": "dropdown-menu-sub-trigger",
		"data-inset": t,
		className: U("flex cursor-default items-center gap-2 rounded-md px-3 py-2.5 typo-body-md outline-hidden select-none", "focus:bg-[var(--Surface-Secondary)] data-[state=open]:bg-[var(--Surface-Secondary)]", "data-[inset]:pl-8", "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", e),
		...r,
		children: [n, /* @__PURE__ */ N(Cn, { className: "ml-auto" })]
	});
}
function zn({ className: e, ...t }) {
	return /* @__PURE__ */ N(v.SubContent, {
		"data-slot": "dropdown-menu-sub-content",
		className: U("z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-1 text-[var(--Text-High-Emphasis)] shadow-[var(--shadow-lg)]", "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95", "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95", e),
		...t
	});
}
//#endregion
//#region src/components/ui/hover-card.tsx
function Bn({ openDelay: e = 200, closeDelay: t = 100, ...n }) {
	return /* @__PURE__ */ N(y.Root, {
		"data-slot": "hover-card",
		openDelay: e,
		closeDelay: t,
		...n
	});
}
function Vn({ ...e }) {
	return /* @__PURE__ */ N(y.Trigger, {
		"data-slot": "hover-card-trigger",
		...e
	});
}
function Hn({ className: e, align: t = "center", sideOffset: n = 4, ...r }) {
	return /* @__PURE__ */ N(y.Portal, {
		"data-slot": "hover-card-portal",
		children: /* @__PURE__ */ N(y.Content, {
			"data-slot": "hover-card-content",
			align: t,
			sideOffset: n,
			className: U("z-50 w-64 origin-(--radix-hover-card-content-transform-origin) rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-4 text-[var(--Text-High-Emphasis)] shadow-[var(--shadow-md)] outline-hidden", "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95", "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95", e),
			...r
		})
	});
}
//#endregion
//#region src/lib/use-value-length.ts
function Un(e, t) {
	typeof e == "function" ? e(t) : e && typeof e == "object" && (e.current = t);
}
function Wn({ enabled: e, value: t, defaultValue: r, forwardedRef: i }) {
	let a = t !== void 0, o = r == null ? 0 : String(r).length, s = n.useRef(null), c = n.useRef(!1), [l, u] = n.useState(o), [d, f] = n.useState(!1), [p, m] = n.useState(o), h = n.useCallback((e) => {
		s.current = e, Un(i, e);
	}, [i]), g = n.useCallback(() => {
		if (c.current) return;
		let e = s.current;
		e && u(e.value.length);
	}, []), _ = n.useCallback(() => {
		m(s.current?.value.length ?? (a ? String(t ?? "").length : l)), c.current = !0, f(!0);
	}, [
		l,
		a,
		t
	]), v = n.useCallback(() => {
		c.current = !1, f(!1);
		let e = s.current;
		e && u(e.value.length);
	}, []), y = n.useCallback(() => s.current, []);
	n.useLayoutEffect(() => {
		!e || a || c.current || g();
	});
	let b = a ? String(t ?? "").length : l;
	return {
		ref: h,
		getElement: y,
		length: d ? p : b,
		syncFromDom: g,
		beginComposition: _,
		endComposition: v
	};
}
//#endregion
//#region src/components/ui/input.tsx
var Gn = [
	"flex h-12 w-full rounded-lg border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] px-3 typo-body-md text-[var(--Text-High-Emphasis)] transition-colors",
	"file:border-0 file:bg-transparent file:typo-body-md",
	"placeholder:text-[var(--Text-Low-Emphasis)]",
	"focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50 focus-visible:border-[var(--Border-Accent-Primary)]",
	"disabled:cursor-not-allowed disabled:opacity-50",
	"aria-invalid:border-[var(--Border-Caution)] aria-invalid:ring-[var(--Caution-Base)]/20"
].join(" ");
function Kn({ className: e, type: t, startAdornment: n, endAdornment: r, showCount: i, maxLength: a, value: o, defaultValue: s, onChange: c, onCompositionStart: l, onCompositionEnd: u, ref: d, ...f }) {
	let { ref: p, length: m, syncFromDom: h, beginComposition: g, endComposition: _ } = Wn({
		enabled: i === !0,
		value: o,
		defaultValue: s,
		forwardedRef: d
	}), v = /* @__PURE__ */ N("input", {
		type: t,
		"data-slot": "input",
		ref: p,
		value: o,
		defaultValue: s,
		maxLength: a,
		onChange: i ? (e) => {
			h(), c?.(e);
		} : c,
		onCompositionStart: (e) => {
			g(), l?.(e);
		},
		onCompositionEnd: (e) => {
			_(), u?.(e);
		},
		className: U(Gn, n && "pl-9", r && "pr-9", e),
		...f
	}), y = n || r ? /* @__PURE__ */ P("div", {
		"data-slot": "input-group",
		className: "relative flex w-full items-center",
		children: [
			n && /* @__PURE__ */ N("div", {
				className: "pointer-events-none absolute left-3 inset-y-0 flex items-center text-[var(--Text-Low-Emphasis)] typo-body-md select-none",
				children: n
			}),
			v,
			r && /* @__PURE__ */ N("div", {
				className: "absolute right-3 inset-y-0 flex items-center text-[var(--Text-Low-Emphasis)] typo-body-md",
				children: r
			})
		]
	}) : v;
	return i ? /* @__PURE__ */ P("div", {
		"data-slot": "input-with-count",
		className: "w-full",
		children: [y, /* @__PURE__ */ N("div", {
			className: "mt-1 flex justify-end",
			children: /* @__PURE__ */ P("span", {
				"data-slot": "input-count",
				className: U("typo-caption tabular-nums", a != null && m >= a ? "text-[var(--Text-Caution)]" : "text-[var(--Text-Low-Emphasis)]"),
				children: [m, a == null ? "" : `/${a}`]
			})
		})]
	}) : y;
}
//#endregion
//#region src/components/ui/use-commit-draft.ts
function qn(e, t) {
	return !e && !t;
}
function Jn(e, t) {
	let [r, i] = n.useState(e), a = n.useRef(!1), o = n.useRef(null);
	return n.useEffect(() => {
		a.current || i(e);
	}, [e]), {
		draft: r,
		handleChange: n.useCallback((e, n) => {
			if (i(e), qn(a.current, n)) {
				if (o.current === e) {
					o.current = null;
					return;
				}
				o.current = null, t(e);
			}
		}, [t]),
		handleCompositionStart: n.useCallback(() => {
			a.current = !0;
		}, []),
		handleCompositionEnd: n.useCallback((e) => {
			a.current = !1, i(e), o.current = e, t(e);
		}, [t])
	};
}
//#endregion
//#region src/components/ui/commit-input.tsx
function Yn({ value: e, onCommit: t, ...n }) {
	let { draft: r, handleChange: i, handleCompositionStart: a, handleCompositionEnd: o } = Jn(e, t);
	return /* @__PURE__ */ N(Kn, {
		...n,
		value: r,
		onChange: (e) => i(e.target.value, e.nativeEvent.isComposing),
		onCompositionStart: a,
		onCompositionEnd: (e) => o(e.currentTarget.value)
	});
}
//#endregion
//#region node_modules/@date-fns/tz/tzName/index.js
function Xn(e, t, n = "long") {
	return new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		timeZone: e,
		timeZoneName: n
	}).format(t).split(/\s/g).slice(2).join(" ");
}
//#endregion
//#region node_modules/@date-fns/tz/tzOffset/index.js
var Zn = {}, Qn = {};
function $n(e, t) {
	try {
		let n = (Zn[e] ||= new Intl.DateTimeFormat("en-US", {
			timeZone: e,
			timeZoneName: "longOffset"
		}).format)(t).split("GMT")[1];
		return n in Qn ? Qn[n] : tr(n, n.split(":"));
	} catch {
		if (e in Qn) return Qn[e];
		let t = e?.match(er);
		return t ? tr(e, t.slice(1)) : NaN;
	}
}
var er = /([+-]\d\d):?(\d\d)?/;
function tr(e, t) {
	let n = +(t[0] || 0), r = +(t[1] || 0), i = (t[2] || 0) / 60;
	return Qn[e] = n * 60 + r > 0 ? n * 60 + r + i : n * 60 - r - i;
}
//#endregion
//#region node_modules/@date-fns/tz/date/mini.js
var nr = class e extends Date {
	constructor(...e) {
		super(), e.length > 1 && typeof e[e.length - 1] == "string" && (this.timeZone = e.pop()), this.internal = /* @__PURE__ */ new Date(), isNaN($n(this.timeZone, this)) ? this.setTime(NaN) : e.length ? typeof e[0] == "number" && (e.length === 1 || e.length === 2 && typeof e[1] != "number") ? this.setTime(e[0]) : typeof e[0] == "string" ? this.setTime(+new Date(e[0])) : e[0] instanceof Date ? this.setTime(+e[0]) : (this.setTime(+new Date(...e)), or(this, e)) : this.setTime(Date.now());
	}
	static tz(t, ...n) {
		return n.length ? new e(...n, t) : new e(Date.now(), t);
	}
	withTimeZone(t) {
		return new e(+this, t);
	}
	getTimezoneOffset() {
		let e = -$n(this.timeZone, this);
		return e > 0 ? Math.floor(e) : Math.ceil(e);
	}
	setTime(e) {
		return Date.prototype.setTime.apply(this, arguments), ir(this), +this;
	}
	[Symbol.for("constructDateFrom")](t) {
		return new e(+new Date(t), this.timeZone);
	}
}, rr = /^(get|set)(?!UTC)/;
Object.getOwnPropertyNames(Date.prototype).forEach((e) => {
	if (!rr.test(e)) return;
	let t = e.replace(rr, "$1UTC");
	nr.prototype[t] && (e.startsWith("get") ? nr.prototype[e] = function() {
		return this.internal[t]();
	} : (nr.prototype[e] = function() {
		return Date.prototype[t].apply(this.internal, arguments), ar(this), +this;
	}, nr.prototype[t] = function() {
		return Date.prototype[t].apply(this, arguments), ir(this), +this;
	}));
});
function ir(e) {
	e.internal.setTime(+e), e.internal.setUTCSeconds(e.internal.getUTCSeconds() - Math.round(-$n(e.timeZone, e) * 60));
}
function ar(e) {
	Date.prototype.setFullYear.call(e, e.internal.getUTCFullYear(), e.internal.getUTCMonth(), e.internal.getUTCDate()), Date.prototype.setHours.call(e, e.internal.getUTCHours(), e.internal.getUTCMinutes(), e.internal.getUTCSeconds(), e.internal.getUTCMilliseconds()), or(e);
}
function or(e, t) {
	let n = Array.isArray(t) ? sr(t) : +e.internal, r = $n(e.timeZone, e), i = r > 0 ? Math.floor(r) : Math.ceil(r), a = /* @__PURE__ */ new Date(+e);
	a.setUTCHours(a.getUTCHours() - 1);
	let o = -(/* @__PURE__ */ new Date(+e)).getTimezoneOffset(), s = -(/* @__PURE__ */ new Date(+a)).getTimezoneOffset(), c = o - s, l = o;
	if (c && o !== i && Date.prototype.getHours.apply(e) !== (Array.isArray(t) ? t[3] || 0 : e.internal.getUTCHours())) {
		let t = /* @__PURE__ */ new Date(+e), n = o - i;
		n && t.setUTCMinutes(t.getUTCMinutes() + n);
		let r = $n(e.timeZone, t);
		(r > 0 ? Math.floor(r) : Math.ceil(r)) === i && (l = s);
	}
	let u = l - i;
	u && Date.prototype.setUTCMinutes.call(e, Date.prototype.getUTCMinutes.call(e) + u);
	let d = /* @__PURE__ */ new Date(+e);
	d.setUTCSeconds(0);
	let f = o > 0 ? d.getSeconds() : (d.getSeconds() - 60) % 60, p = Math.round(-($n(e.timeZone, e) * 60)) % 60;
	(p || f) && Date.prototype.setUTCSeconds.call(e, Date.prototype.getUTCSeconds.call(e) + p + f);
	let m = $n(e.timeZone, e), h = m > 0 ? Math.floor(m) : Math.ceil(m), g = -(/* @__PURE__ */ new Date(+e)).getTimezoneOffset() - h, _ = h !== i, v = g - u, y = h - i, b = n - h * 60 * 1e3, x = y > 0 && cr(e) - n === y * 60 * 1e3 && cr(e, b) !== n;
	if (_ && v && !x) {
		Date.prototype.setUTCMinutes.call(e, Date.prototype.getUTCMinutes.call(e) + v);
		let t = $n(e.timeZone, e), n = h - (t > 0 ? Math.floor(t) : Math.ceil(t));
		n && v < 0 && Date.prototype.setUTCMinutes.call(e, Date.prototype.getUTCMinutes.call(e) + n);
	}
	ir(e);
	let S = (t ? n : n + p * 1e3) - +e.internal;
	S && Math.abs(S) < 1800 * 1e3 && (Date.prototype.setTime.call(e, +e + S), ir(e));
}
function sr(e) {
	return Date.UTC(e[0], e.length > 1 ? e[1] : 0, e.length > 2 ? e[2] : 1, ...e.slice(3));
}
function cr(e, t) {
	let n = new Date(t ?? +e);
	return n.setUTCSeconds(n.getUTCSeconds() - Math.round(-$n(e.timeZone, n) * 60)), +n;
}
//#endregion
//#region node_modules/@date-fns/tz/date/index.js
var lr = class e extends nr {
	static tz(t, ...n) {
		return n.length ? new e(...n, t) : new e(Date.now(), t);
	}
	toISOString() {
		let [e, t, n] = this.tzComponents(), r = `${e}${t}:${n}`;
		return this.internal.toISOString().slice(0, -1) + r;
	}
	toString() {
		return `${this.toDateString()} ${this.toTimeString()}`;
	}
	toDateString() {
		let [e, t, n, r] = this.internal.toUTCString().split(" ");
		return `${e?.slice(0, -1)} ${n} ${t} ${r}`;
	}
	toTimeString() {
		let e = this.internal.toUTCString().split(" ")[4], [t, n, r] = this.tzComponents();
		return `${e} GMT${t}${n}${r} (${Xn(this.timeZone, this)})`;
	}
	toLocaleString(e, t) {
		return Date.prototype.toLocaleString.call(this, e, {
			...t,
			timeZone: t?.timeZone || this.timeZone
		});
	}
	toLocaleDateString(e, t) {
		return Date.prototype.toLocaleDateString.call(this, e, {
			...t,
			timeZone: t?.timeZone || this.timeZone
		});
	}
	toLocaleTimeString(e, t) {
		return Date.prototype.toLocaleTimeString.call(this, e, {
			...t,
			timeZone: t?.timeZone || this.timeZone
		});
	}
	tzComponents() {
		let e = this.getTimezoneOffset();
		return [
			e > 0 ? "-" : "+",
			String(Math.floor(Math.abs(e) / 60)).padStart(2, "0"),
			String(Math.abs(e) % 60).padStart(2, "0")
		];
	}
	withTimeZone(t) {
		return new e(+this, t);
	}
	[Symbol.for("constructDateFrom")](t) {
		return new e(+new Date(t), this.timeZone);
	}
}, ur = 365.2425, dr = 6048e5, fr = 864e5, pr = 3600 * 24;
pr * 7, pr * ur / 12 * 3;
var mr = Symbol.for("constructDateFrom");
//#endregion
//#region node_modules/date-fns/constructFrom.js
function K(e, t) {
	return typeof e == "function" ? e(t) : e && typeof e == "object" && mr in e ? e[mr](t) : e instanceof Date ? new e.constructor(t) : new Date(t);
}
//#endregion
//#region node_modules/date-fns/toDate.js
function q(e, t) {
	return K(t || e, e);
}
//#endregion
//#region node_modules/date-fns/addDays.js
function hr(e, t, n) {
	let r = q(e, n?.in);
	return isNaN(t) ? K(n?.in || e, NaN) : (t && r.setDate(r.getDate() + t), r);
}
//#endregion
//#region node_modules/date-fns/addMonths.js
function gr(e, t, n) {
	let r = q(e, n?.in);
	if (isNaN(t)) return K(n?.in || e, NaN);
	if (!t) return r;
	let i = r.getDate(), a = K(n?.in || e, r.getTime());
	return a.setMonth(r.getMonth() + t + 1, 0), i >= a.getDate() ? a : (r.setFullYear(a.getFullYear(), a.getMonth(), i), r);
}
//#endregion
//#region node_modules/date-fns/_lib/defaultOptions.js
var _r = {};
function vr() {
	return _r;
}
//#endregion
//#region node_modules/date-fns/startOfWeek.js
function yr(e, t) {
	let n = vr(), r = t?.weekStartsOn ?? t?.locale?.options?.weekStartsOn ?? n.weekStartsOn ?? n.locale?.options?.weekStartsOn ?? 0, i = q(e, t?.in), a = i.getDay(), o = (a < r ? 7 : 0) + a - r;
	return i.setDate(i.getDate() - o), i.setHours(0, 0, 0, 0), i;
}
//#endregion
//#region node_modules/date-fns/startOfISOWeek.js
function br(e, t) {
	return yr(e, {
		...t,
		weekStartsOn: 1
	});
}
//#endregion
//#region node_modules/date-fns/getISOWeekYear.js
function xr(e, t) {
	let n = q(e, t?.in), r = n.getFullYear(), i = K(n, 0);
	i.setFullYear(r + 1, 0, 4), i.setHours(0, 0, 0, 0);
	let a = br(i), o = K(n, 0);
	o.setFullYear(r, 0, 4), o.setHours(0, 0, 0, 0);
	let s = br(o);
	return n.getTime() >= a.getTime() ? r + 1 : n.getTime() >= s.getTime() ? r : r - 1;
}
//#endregion
//#region node_modules/date-fns/_lib/getTimezoneOffsetInMilliseconds.js
function Sr(e) {
	let t = q(e), n = new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours(), t.getMinutes(), t.getSeconds(), t.getMilliseconds()));
	return n.setUTCFullYear(t.getFullYear()), e - +n;
}
//#endregion
//#region node_modules/date-fns/_lib/normalizeDates.js
function Cr(e, ...t) {
	let n = K.bind(null, e || t.find((e) => typeof e == "object"));
	return t.map(n);
}
//#endregion
//#region node_modules/date-fns/startOfDay.js
function wr(e, t) {
	let n = q(e, t?.in);
	return n.setHours(0, 0, 0, 0), n;
}
//#endregion
//#region node_modules/date-fns/differenceInCalendarDays.js
function Tr(e, t, n) {
	let [r, i] = Cr(n?.in, e, t), a = wr(r), o = wr(i), s = +a - Sr(a), c = +o - Sr(o);
	return Math.round((s - c) / fr);
}
//#endregion
//#region node_modules/date-fns/startOfISOWeekYear.js
function Er(e, t) {
	let n = xr(e, t), r = K(t?.in || e, 0);
	return r.setFullYear(n, 0, 4), r.setHours(0, 0, 0, 0), br(r);
}
//#endregion
//#region node_modules/date-fns/addWeeks.js
function Dr(e, t, n) {
	return hr(e, t * 7, n);
}
//#endregion
//#region node_modules/date-fns/addYears.js
function Or(e, t, n) {
	return gr(e, t * 12, n);
}
//#endregion
//#region node_modules/date-fns/max.js
function kr(e, t) {
	let n, r = t?.in;
	return e.forEach((e) => {
		!r && typeof e == "object" && (r = K.bind(null, e));
		let t = q(e, r);
		(!n || n < t || isNaN(+t)) && (n = t);
	}), K(r, n || NaN);
}
//#endregion
//#region node_modules/date-fns/min.js
function Ar(e, t) {
	let n, r = t?.in;
	return e.forEach((e) => {
		!r && typeof e == "object" && (r = K.bind(null, e));
		let t = q(e, r);
		(!n || n > t || isNaN(+t)) && (n = t);
	}), K(r, n || NaN);
}
//#endregion
//#region node_modules/date-fns/isSameDay.js
function jr(e, t, n) {
	let [r, i] = Cr(n?.in, e, t);
	return +wr(r) == +wr(i);
}
//#endregion
//#region node_modules/date-fns/isDate.js
function Mr(e) {
	return e instanceof Date || typeof e == "object" && Object.prototype.toString.call(e) === "[object Date]";
}
//#endregion
//#region node_modules/date-fns/isValid.js
function Nr(e) {
	return !(!Mr(e) && typeof e != "number" || isNaN(+q(e)));
}
//#endregion
//#region node_modules/date-fns/differenceInCalendarMonths.js
function Pr(e, t, n) {
	let [r, i] = Cr(n?.in, e, t), a = r.getFullYear() - i.getFullYear(), o = r.getMonth() - i.getMonth();
	return a * 12 + o;
}
//#endregion
//#region node_modules/date-fns/endOfMonth.js
function Fr(e, t) {
	let n = q(e, t?.in), r = n.getMonth();
	return n.setFullYear(n.getFullYear(), r + 1, 0), n.setHours(23, 59, 59, 999), n;
}
//#endregion
//#region node_modules/date-fns/_lib/normalizeInterval.js
function Ir(e, t) {
	let [n, r] = Cr(e, t.start, t.end);
	return {
		start: n,
		end: r
	};
}
//#endregion
//#region node_modules/date-fns/eachMonthOfInterval.js
function Lr(e, t) {
	let { start: n, end: r } = Ir(t?.in, e), i = +n > +r, a = i ? +n : +r, o = i ? r : n;
	o.setHours(0, 0, 0, 0), o.setDate(1);
	let s = t?.step ?? 1;
	if (!s) return [];
	s < 0 && (s = -s, i = !i);
	let c = [];
	for (; +o <= a;) c.push(K(n, o)), o.setMonth(o.getMonth() + s);
	return i ? c.reverse() : c;
}
//#endregion
//#region node_modules/date-fns/startOfMonth.js
function Rr(e, t) {
	let n = q(e, t?.in);
	return n.setDate(1), n.setHours(0, 0, 0, 0), n;
}
//#endregion
//#region node_modules/date-fns/endOfYear.js
function zr(e, t) {
	let n = q(e, t?.in), r = n.getFullYear();
	return n.setFullYear(r + 1, 0, 0), n.setHours(23, 59, 59, 999), n;
}
//#endregion
//#region node_modules/date-fns/startOfYear.js
function Br(e, t) {
	let n = q(e, t?.in);
	return n.setFullYear(n.getFullYear(), 0, 1), n.setHours(0, 0, 0, 0), n;
}
//#endregion
//#region node_modules/date-fns/eachYearOfInterval.js
function Vr(e, t) {
	let { start: n, end: r } = Ir(t?.in, e), i = +n > +r, a = i ? +n : +r, o = i ? r : n;
	o.setHours(0, 0, 0, 0), o.setMonth(0, 1);
	let s = t?.step ?? 1;
	if (!s) return [];
	s < 0 && (s = -s, i = !i);
	let c = [];
	for (; +o <= a;) c.push(K(n, o)), o.setFullYear(o.getFullYear() + s);
	return i ? c.reverse() : c;
}
//#endregion
//#region node_modules/date-fns/endOfWeek.js
function Hr(e, t) {
	let n = vr(), r = t?.weekStartsOn ?? t?.locale?.options?.weekStartsOn ?? n.weekStartsOn ?? n.locale?.options?.weekStartsOn ?? 0, i = q(e, t?.in), a = i.getDay(), o = (a < r ? -7 : 0) + 6 - (a - r);
	return i.setDate(i.getDate() + o), i.setHours(23, 59, 59, 999), i;
}
//#endregion
//#region node_modules/date-fns/endOfISOWeek.js
function Ur(e, t) {
	return Hr(e, {
		...t,
		weekStartsOn: 1
	});
}
//#endregion
//#region node_modules/date-fns/locale/en-US/_lib/formatDistance.js
var Wr = {
	lessThanXSeconds: {
		one: "less than a second",
		other: "less than {{count}} seconds"
	},
	xSeconds: {
		one: "1 second",
		other: "{{count}} seconds"
	},
	halfAMinute: "half a minute",
	lessThanXMinutes: {
		one: "less than a minute",
		other: "less than {{count}} minutes"
	},
	xMinutes: {
		one: "1 minute",
		other: "{{count}} minutes"
	},
	aboutXHours: {
		one: "about 1 hour",
		other: "about {{count}} hours"
	},
	xHours: {
		one: "1 hour",
		other: "{{count}} hours"
	},
	xDays: {
		one: "1 day",
		other: "{{count}} days"
	},
	aboutXWeeks: {
		one: "about 1 week",
		other: "about {{count}} weeks"
	},
	xWeeks: {
		one: "1 week",
		other: "{{count}} weeks"
	},
	aboutXMonths: {
		one: "about 1 month",
		other: "about {{count}} months"
	},
	xMonths: {
		one: "1 month",
		other: "{{count}} months"
	},
	aboutXYears: {
		one: "about 1 year",
		other: "about {{count}} years"
	},
	xYears: {
		one: "1 year",
		other: "{{count}} years"
	},
	overXYears: {
		one: "over 1 year",
		other: "over {{count}} years"
	},
	almostXYears: {
		one: "almost 1 year",
		other: "almost {{count}} years"
	}
}, Gr = (e, t, n) => {
	let r, i = Wr[e];
	return r = typeof i == "string" ? i : t === 1 ? i.one : i.other.replace("{{count}}", t.toString()), n?.addSuffix ? n.comparison && n.comparison > 0 ? "in " + r : r + " ago" : r;
};
//#endregion
//#region node_modules/date-fns/locale/_lib/buildFormatLongFn.js
function Kr(e) {
	return (t = {}) => {
		let n = t.width ? String(t.width) : e.defaultWidth;
		return e.formats[n] || e.formats[e.defaultWidth];
	};
}
var qr = {
	date: Kr({
		formats: {
			full: "EEEE, MMMM do, y",
			long: "MMMM do, y",
			medium: "MMM d, y",
			short: "MM/dd/yyyy"
		},
		defaultWidth: "full"
	}),
	time: Kr({
		formats: {
			full: "h:mm:ss a zzzz",
			long: "h:mm:ss a z",
			medium: "h:mm:ss a",
			short: "h:mm a"
		},
		defaultWidth: "full"
	}),
	dateTime: Kr({
		formats: {
			full: "{{date}} 'at' {{time}}",
			long: "{{date}} 'at' {{time}}",
			medium: "{{date}}, {{time}}",
			short: "{{date}}, {{time}}"
		},
		defaultWidth: "full"
	})
}, Jr = {
	lastWeek: "'last' eeee 'at' p",
	yesterday: "'yesterday at' p",
	today: "'today at' p",
	tomorrow: "'tomorrow at' p",
	nextWeek: "eeee 'at' p",
	other: "P"
}, Yr = (e, t, n, r) => Jr[e];
//#endregion
//#region node_modules/date-fns/locale/_lib/buildLocalizeFn.js
function Xr(e) {
	return (t, n) => {
		let r = n?.context ? String(n.context) : "standalone", i;
		if (r === "formatting" && e.formattingValues) {
			let t = e.defaultFormattingWidth || e.defaultWidth, r = n?.width ? String(n.width) : t;
			i = e.formattingValues[r] || e.formattingValues[t];
		} else {
			let t = e.defaultWidth, r = n?.width ? String(n.width) : e.defaultWidth;
			i = e.values[r] || e.values[t];
		}
		let a = e.argumentCallback ? e.argumentCallback(t) : t;
		return i[a];
	};
}
var Zr = {
	ordinalNumber: (e, t) => {
		let n = Number(e), r = n % 100;
		if (r > 20 || r < 10) switch (r % 10) {
			case 1: return n + "st";
			case 2: return n + "nd";
			case 3: return n + "rd";
		}
		return n + "th";
	},
	era: Xr({
		values: {
			narrow: ["B", "A"],
			abbreviated: ["BC", "AD"],
			wide: ["Before Christ", "Anno Domini"]
		},
		defaultWidth: "wide"
	}),
	quarter: Xr({
		values: {
			narrow: [
				"1",
				"2",
				"3",
				"4"
			],
			abbreviated: [
				"Q1",
				"Q2",
				"Q3",
				"Q4"
			],
			wide: [
				"1st quarter",
				"2nd quarter",
				"3rd quarter",
				"4th quarter"
			]
		},
		defaultWidth: "wide",
		argumentCallback: (e) => e - 1
	}),
	month: Xr({
		values: {
			narrow: [
				"J",
				"F",
				"M",
				"A",
				"M",
				"J",
				"J",
				"A",
				"S",
				"O",
				"N",
				"D"
			],
			abbreviated: [
				"Jan",
				"Feb",
				"Mar",
				"Apr",
				"May",
				"Jun",
				"Jul",
				"Aug",
				"Sep",
				"Oct",
				"Nov",
				"Dec"
			],
			wide: [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December"
			]
		},
		defaultWidth: "wide"
	}),
	day: Xr({
		values: {
			narrow: [
				"S",
				"M",
				"T",
				"W",
				"T",
				"F",
				"S"
			],
			short: [
				"Su",
				"Mo",
				"Tu",
				"We",
				"Th",
				"Fr",
				"Sa"
			],
			abbreviated: [
				"Sun",
				"Mon",
				"Tue",
				"Wed",
				"Thu",
				"Fri",
				"Sat"
			],
			wide: [
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday"
			]
		},
		defaultWidth: "wide"
	}),
	dayPeriod: Xr({
		values: {
			narrow: {
				am: "a",
				pm: "p",
				midnight: "mi",
				noon: "n",
				morning: "morning",
				afternoon: "afternoon",
				evening: "evening",
				night: "night"
			},
			abbreviated: {
				am: "AM",
				pm: "PM",
				midnight: "midnight",
				noon: "noon",
				morning: "morning",
				afternoon: "afternoon",
				evening: "evening",
				night: "night"
			},
			wide: {
				am: "a.m.",
				pm: "p.m.",
				midnight: "midnight",
				noon: "noon",
				morning: "morning",
				afternoon: "afternoon",
				evening: "evening",
				night: "night"
			}
		},
		defaultWidth: "wide",
		formattingValues: {
			narrow: {
				am: "a",
				pm: "p",
				midnight: "mi",
				noon: "n",
				morning: "in the morning",
				afternoon: "in the afternoon",
				evening: "in the evening",
				night: "at night"
			},
			abbreviated: {
				am: "AM",
				pm: "PM",
				midnight: "midnight",
				noon: "noon",
				morning: "in the morning",
				afternoon: "in the afternoon",
				evening: "in the evening",
				night: "at night"
			},
			wide: {
				am: "a.m.",
				pm: "p.m.",
				midnight: "midnight",
				noon: "noon",
				morning: "in the morning",
				afternoon: "in the afternoon",
				evening: "in the evening",
				night: "at night"
			}
		},
		defaultFormattingWidth: "wide"
	})
};
//#endregion
//#region node_modules/date-fns/locale/_lib/buildMatchFn.js
function Qr(e) {
	return (t, n = {}) => {
		let r = n.width, i = r && e.matchPatterns[r] || e.matchPatterns[e.defaultMatchWidth], a = t.match(i);
		if (!a) return null;
		let o = a[0], s = r && e.parsePatterns[r] || e.parsePatterns[e.defaultParseWidth], c = Array.isArray(s) ? ei(s, (e) => e.test(o)) : $r(s, (e) => e.test(o)), l;
		l = e.valueCallback ? e.valueCallback(c) : c, l = n.valueCallback ? n.valueCallback(l) : l;
		let u = t.slice(o.length);
		return {
			value: l,
			rest: u
		};
	};
}
function $r(e, t) {
	for (let n in e) if (Object.prototype.hasOwnProperty.call(e, n) && t(e[n])) return n;
}
function ei(e, t) {
	for (let n = 0; n < e.length; n++) if (t(e[n])) return n;
}
//#endregion
//#region node_modules/date-fns/locale/_lib/buildMatchPatternFn.js
function ti(e) {
	return (t, n = {}) => {
		let r = t.match(e.matchPattern);
		if (!r) return null;
		let i = r[0], a = t.match(e.parsePattern);
		if (!a) return null;
		let o = e.valueCallback ? e.valueCallback(a[0]) : a[0];
		o = n.valueCallback ? n.valueCallback(o) : o;
		let s = t.slice(i.length);
		return {
			value: o,
			rest: s
		};
	};
}
//#endregion
//#region node_modules/date-fns/locale/en-US.js
var ni = {
	code: "en-US",
	formatDistance: Gr,
	formatLong: qr,
	formatRelative: Yr,
	localize: Zr,
	match: {
		ordinalNumber: ti({
			matchPattern: /^(\d+)(th|st|nd|rd)?/i,
			parsePattern: /\d+/i,
			valueCallback: (e) => parseInt(e, 10)
		}),
		era: Qr({
			matchPatterns: {
				narrow: /^(b|a)/i,
				abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
				wide: /^(before christ|before common era|anno domini|common era)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: { any: [/^b/i, /^(a|c)/i] },
			defaultParseWidth: "any"
		}),
		quarter: Qr({
			matchPatterns: {
				narrow: /^[1234]/i,
				abbreviated: /^q[1234]/i,
				wide: /^[1234](th|st|nd|rd)? quarter/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: { any: [
				/1/i,
				/2/i,
				/3/i,
				/4/i
			] },
			defaultParseWidth: "any",
			valueCallback: (e) => e + 1
		}),
		month: Qr({
			matchPatterns: {
				narrow: /^[jfmasond]/i,
				abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
				wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [
					/^j/i,
					/^f/i,
					/^m/i,
					/^a/i,
					/^m/i,
					/^j/i,
					/^j/i,
					/^a/i,
					/^s/i,
					/^o/i,
					/^n/i,
					/^d/i
				],
				any: [
					/^ja/i,
					/^f/i,
					/^mar/i,
					/^ap/i,
					/^may/i,
					/^jun/i,
					/^jul/i,
					/^au/i,
					/^s/i,
					/^o/i,
					/^n/i,
					/^d/i
				]
			},
			defaultParseWidth: "any"
		}),
		day: Qr({
			matchPatterns: {
				narrow: /^[smtwf]/i,
				short: /^(su|mo|tu|we|th|fr|sa)/i,
				abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
				wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [
					/^s/i,
					/^m/i,
					/^t/i,
					/^w/i,
					/^t/i,
					/^f/i,
					/^s/i
				],
				any: [
					/^su/i,
					/^m/i,
					/^tu/i,
					/^w/i,
					/^th/i,
					/^f/i,
					/^sa/i
				]
			},
			defaultParseWidth: "any"
		}),
		dayPeriod: Qr({
			matchPatterns: {
				narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
				any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
			},
			defaultMatchWidth: "any",
			parsePatterns: { any: {
				am: /^a/i,
				pm: /^p/i,
				midnight: /^mi/i,
				noon: /^no/i,
				morning: /morning/i,
				afternoon: /afternoon/i,
				evening: /evening/i,
				night: /night/i
			} },
			defaultParseWidth: "any"
		})
	},
	options: {
		weekStartsOn: 0,
		firstWeekContainsDate: 1
	}
};
//#endregion
//#region node_modules/date-fns/getDayOfYear.js
function ri(e, t) {
	let n = q(e, t?.in);
	return Tr(n, Br(n)) + 1;
}
//#endregion
//#region node_modules/date-fns/getISOWeek.js
function ii(e, t) {
	let n = q(e, t?.in), r = br(n) - +Er(n);
	return Math.round(r / dr) + 1;
}
//#endregion
//#region node_modules/date-fns/getWeekYear.js
function ai(e, t) {
	let n = q(e, t?.in), r = n.getFullYear(), i = vr(), a = t?.firstWeekContainsDate ?? t?.locale?.options?.firstWeekContainsDate ?? i.firstWeekContainsDate ?? i.locale?.options?.firstWeekContainsDate ?? 1, o = K(t?.in || e, 0);
	o.setFullYear(r + 1, 0, a), o.setHours(0, 0, 0, 0);
	let s = yr(o, t), c = K(t?.in || e, 0);
	c.setFullYear(r, 0, a), c.setHours(0, 0, 0, 0);
	let l = yr(c, t);
	return +n >= +s ? r + 1 : +n >= +l ? r : r - 1;
}
//#endregion
//#region node_modules/date-fns/startOfWeekYear.js
function oi(e, t) {
	let n = vr(), r = t?.firstWeekContainsDate ?? t?.locale?.options?.firstWeekContainsDate ?? n.firstWeekContainsDate ?? n.locale?.options?.firstWeekContainsDate ?? 1, i = ai(e, t), a = K(t?.in || e, 0);
	return a.setFullYear(i, 0, r), a.setHours(0, 0, 0, 0), yr(a, t);
}
//#endregion
//#region node_modules/date-fns/getWeek.js
function si(e, t) {
	let n = q(e, t?.in), r = yr(n, t) - +oi(n, t);
	return Math.round(r / dr) + 1;
}
//#endregion
//#region node_modules/date-fns/_lib/addLeadingZeros.js
function J(e, t) {
	return (e < 0 ? "-" : "") + Math.abs(e).toString().padStart(t, "0");
}
//#endregion
//#region node_modules/date-fns/_lib/format/lightFormatters.js
var ci = {
	y(e, t) {
		let n = e.getFullYear(), r = n > 0 ? n : 1 - n;
		return J(t === "yy" ? r % 100 : r, t.length);
	},
	M(e, t) {
		let n = e.getMonth();
		return t === "M" ? String(n + 1) : J(n + 1, 2);
	},
	d(e, t) {
		return J(e.getDate(), t.length);
	},
	a(e, t) {
		let n = e.getHours() / 12 >= 1 ? "pm" : "am";
		switch (t) {
			case "a":
			case "aa": return n.toUpperCase();
			case "aaa": return n;
			case "aaaaa": return n[0];
			default: return n === "am" ? "a.m." : "p.m.";
		}
	},
	h(e, t) {
		return J(e.getHours() % 12 || 12, t.length);
	},
	H(e, t) {
		return J(e.getHours(), t.length);
	},
	m(e, t) {
		return J(e.getMinutes(), t.length);
	},
	s(e, t) {
		return J(e.getSeconds(), t.length);
	},
	S(e, t) {
		let n = t.length, r = e.getMilliseconds();
		return J(Math.trunc(r * 10 ** (n - 3)), t.length);
	}
}, li = {
	am: "am",
	pm: "pm",
	midnight: "midnight",
	noon: "noon",
	morning: "morning",
	afternoon: "afternoon",
	evening: "evening",
	night: "night"
}, ui = {
	G: function(e, t, n) {
		let r = +(e.getFullYear() > 0);
		switch (t) {
			case "G":
			case "GG":
			case "GGG": return n.era(r, { width: "abbreviated" });
			case "GGGGG": return n.era(r, { width: "narrow" });
			default: return n.era(r, { width: "wide" });
		}
	},
	y: function(e, t, n) {
		if (t === "yo") {
			let t = e.getFullYear(), r = t > 0 ? t : 1 - t;
			return n.ordinalNumber(r, { unit: "year" });
		}
		return ci.y(e, t);
	},
	Y: function(e, t, n, r) {
		let i = ai(e, r), a = i > 0 ? i : 1 - i;
		return t === "YY" ? J(a % 100, 2) : t === "Yo" ? n.ordinalNumber(a, { unit: "year" }) : J(a, t.length);
	},
	R: function(e, t) {
		return J(xr(e), t.length);
	},
	u: function(e, t) {
		return J(e.getFullYear(), t.length);
	},
	Q: function(e, t, n) {
		let r = Math.ceil((e.getMonth() + 1) / 3);
		switch (t) {
			case "Q": return String(r);
			case "QQ": return J(r, 2);
			case "Qo": return n.ordinalNumber(r, { unit: "quarter" });
			case "QQQ": return n.quarter(r, {
				width: "abbreviated",
				context: "formatting"
			});
			case "QQQQQ": return n.quarter(r, {
				width: "narrow",
				context: "formatting"
			});
			default: return n.quarter(r, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	q: function(e, t, n) {
		let r = Math.ceil((e.getMonth() + 1) / 3);
		switch (t) {
			case "q": return String(r);
			case "qq": return J(r, 2);
			case "qo": return n.ordinalNumber(r, { unit: "quarter" });
			case "qqq": return n.quarter(r, {
				width: "abbreviated",
				context: "standalone"
			});
			case "qqqqq": return n.quarter(r, {
				width: "narrow",
				context: "standalone"
			});
			default: return n.quarter(r, {
				width: "wide",
				context: "standalone"
			});
		}
	},
	M: function(e, t, n) {
		let r = e.getMonth();
		switch (t) {
			case "M":
			case "MM": return ci.M(e, t);
			case "Mo": return n.ordinalNumber(r + 1, { unit: "month" });
			case "MMM": return n.month(r, {
				width: "abbreviated",
				context: "formatting"
			});
			case "MMMMM": return n.month(r, {
				width: "narrow",
				context: "formatting"
			});
			default: return n.month(r, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	L: function(e, t, n) {
		let r = e.getMonth();
		switch (t) {
			case "L": return String(r + 1);
			case "LL": return J(r + 1, 2);
			case "Lo": return n.ordinalNumber(r + 1, { unit: "month" });
			case "LLL": return n.month(r, {
				width: "abbreviated",
				context: "standalone"
			});
			case "LLLLL": return n.month(r, {
				width: "narrow",
				context: "standalone"
			});
			default: return n.month(r, {
				width: "wide",
				context: "standalone"
			});
		}
	},
	w: function(e, t, n, r) {
		let i = si(e, r);
		return t === "wo" ? n.ordinalNumber(i, { unit: "week" }) : J(i, t.length);
	},
	I: function(e, t, n) {
		let r = ii(e);
		return t === "Io" ? n.ordinalNumber(r, { unit: "week" }) : J(r, t.length);
	},
	d: function(e, t, n) {
		return t === "do" ? n.ordinalNumber(e.getDate(), { unit: "date" }) : ci.d(e, t);
	},
	D: function(e, t, n) {
		let r = ri(e);
		return t === "Do" ? n.ordinalNumber(r, { unit: "dayOfYear" }) : J(r, t.length);
	},
	E: function(e, t, n) {
		let r = e.getDay();
		switch (t) {
			case "E":
			case "EE":
			case "EEE": return n.day(r, {
				width: "abbreviated",
				context: "formatting"
			});
			case "EEEEE": return n.day(r, {
				width: "narrow",
				context: "formatting"
			});
			case "EEEEEE": return n.day(r, {
				width: "short",
				context: "formatting"
			});
			default: return n.day(r, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	e: function(e, t, n, r) {
		let i = e.getDay(), a = (i - r.weekStartsOn + 8) % 7 || 7;
		switch (t) {
			case "e": return String(a);
			case "ee": return J(a, 2);
			case "eo": return n.ordinalNumber(a, { unit: "day" });
			case "eee": return n.day(i, {
				width: "abbreviated",
				context: "formatting"
			});
			case "eeeee": return n.day(i, {
				width: "narrow",
				context: "formatting"
			});
			case "eeeeee": return n.day(i, {
				width: "short",
				context: "formatting"
			});
			default: return n.day(i, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	c: function(e, t, n, r) {
		let i = e.getDay(), a = (i - r.weekStartsOn + 8) % 7 || 7;
		switch (t) {
			case "c": return String(a);
			case "cc": return J(a, t.length);
			case "co": return n.ordinalNumber(a, { unit: "day" });
			case "ccc": return n.day(i, {
				width: "abbreviated",
				context: "standalone"
			});
			case "ccccc": return n.day(i, {
				width: "narrow",
				context: "standalone"
			});
			case "cccccc": return n.day(i, {
				width: "short",
				context: "standalone"
			});
			default: return n.day(i, {
				width: "wide",
				context: "standalone"
			});
		}
	},
	i: function(e, t, n) {
		let r = e.getDay(), i = r === 0 ? 7 : r;
		switch (t) {
			case "i": return String(i);
			case "ii": return J(i, t.length);
			case "io": return n.ordinalNumber(i, { unit: "day" });
			case "iii": return n.day(r, {
				width: "abbreviated",
				context: "formatting"
			});
			case "iiiii": return n.day(r, {
				width: "narrow",
				context: "formatting"
			});
			case "iiiiii": return n.day(r, {
				width: "short",
				context: "formatting"
			});
			default: return n.day(r, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	a: function(e, t, n) {
		let r = e.getHours() / 12 >= 1 ? "pm" : "am";
		switch (t) {
			case "a":
			case "aa": return n.dayPeriod(r, {
				width: "abbreviated",
				context: "formatting"
			});
			case "aaa": return n.dayPeriod(r, {
				width: "abbreviated",
				context: "formatting"
			}).toLowerCase();
			case "aaaaa": return n.dayPeriod(r, {
				width: "narrow",
				context: "formatting"
			});
			default: return n.dayPeriod(r, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	b: function(e, t, n) {
		let r = e.getHours(), i;
		switch (i = r === 12 ? li.noon : r === 0 ? li.midnight : r / 12 >= 1 ? "pm" : "am", t) {
			case "b":
			case "bb": return n.dayPeriod(i, {
				width: "abbreviated",
				context: "formatting"
			});
			case "bbb": return n.dayPeriod(i, {
				width: "abbreviated",
				context: "formatting"
			}).toLowerCase();
			case "bbbbb": return n.dayPeriod(i, {
				width: "narrow",
				context: "formatting"
			});
			default: return n.dayPeriod(i, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	B: function(e, t, n) {
		let r = e.getHours(), i;
		switch (i = r >= 17 ? li.evening : r >= 12 ? li.afternoon : r >= 4 ? li.morning : li.night, t) {
			case "B":
			case "BB":
			case "BBB": return n.dayPeriod(i, {
				width: "abbreviated",
				context: "formatting"
			});
			case "BBBBB": return n.dayPeriod(i, {
				width: "narrow",
				context: "formatting"
			});
			default: return n.dayPeriod(i, {
				width: "wide",
				context: "formatting"
			});
		}
	},
	h: function(e, t, n) {
		if (t === "ho") {
			let t = e.getHours() % 12;
			return t === 0 && (t = 12), n.ordinalNumber(t, { unit: "hour" });
		}
		return ci.h(e, t);
	},
	H: function(e, t, n) {
		return t === "Ho" ? n.ordinalNumber(e.getHours(), { unit: "hour" }) : ci.H(e, t);
	},
	K: function(e, t, n) {
		let r = e.getHours() % 12;
		return t === "Ko" ? n.ordinalNumber(r, { unit: "hour" }) : J(r, t.length);
	},
	k: function(e, t, n) {
		let r = e.getHours();
		return r === 0 && (r = 24), t === "ko" ? n.ordinalNumber(r, { unit: "hour" }) : J(r, t.length);
	},
	m: function(e, t, n) {
		return t === "mo" ? n.ordinalNumber(e.getMinutes(), { unit: "minute" }) : ci.m(e, t);
	},
	s: function(e, t, n) {
		return t === "so" ? n.ordinalNumber(e.getSeconds(), { unit: "second" }) : ci.s(e, t);
	},
	S: function(e, t) {
		return ci.S(e, t);
	},
	X: function(e, t, n) {
		let r = e.getTimezoneOffset();
		if (r === 0) return "Z";
		switch (t) {
			case "X": return fi(r);
			case "XXXX":
			case "XX": return pi(r);
			default: return pi(r, ":");
		}
	},
	x: function(e, t, n) {
		let r = e.getTimezoneOffset();
		switch (t) {
			case "x": return fi(r);
			case "xxxx":
			case "xx": return pi(r);
			default: return pi(r, ":");
		}
	},
	O: function(e, t, n) {
		let r = e.getTimezoneOffset();
		switch (t) {
			case "O":
			case "OO":
			case "OOO": return "GMT" + di(r, ":");
			default: return "GMT" + pi(r, ":");
		}
	},
	z: function(e, t, n) {
		let r = e.getTimezoneOffset();
		switch (t) {
			case "z":
			case "zz":
			case "zzz": return "GMT" + di(r, ":");
			default: return "GMT" + pi(r, ":");
		}
	},
	t: function(e, t, n) {
		return J(Math.trunc(e / 1e3), t.length);
	},
	T: function(e, t, n) {
		return J(+e, t.length);
	}
};
function di(e, t = "") {
	let n = e > 0 ? "-" : "+", r = Math.abs(e), i = Math.trunc(r / 60), a = r % 60;
	return a === 0 ? n + String(i) : n + String(i) + t + J(a, 2);
}
function fi(e, t) {
	return e % 60 == 0 ? (e > 0 ? "-" : "+") + J(Math.abs(e) / 60, 2) : pi(e, t);
}
function pi(e, t = "") {
	let n = e > 0 ? "-" : "+", r = Math.abs(e), i = J(Math.trunc(r / 60), 2), a = J(r % 60, 2);
	return n + i + t + a;
}
//#endregion
//#region node_modules/date-fns/_lib/format/longFormatters.js
var mi = (e, t) => {
	switch (e) {
		case "P": return t.date({ width: "short" });
		case "PP": return t.date({ width: "medium" });
		case "PPP": return t.date({ width: "long" });
		default: return t.date({ width: "full" });
	}
}, hi = (e, t) => {
	switch (e) {
		case "p": return t.time({ width: "short" });
		case "pp": return t.time({ width: "medium" });
		case "ppp": return t.time({ width: "long" });
		default: return t.time({ width: "full" });
	}
}, gi = {
	p: hi,
	P: (e, t) => {
		let n = e.match(/(P+)(p+)?/) || [], r = n[1], i = n[2];
		if (!i) return mi(e, t);
		let a;
		switch (r) {
			case "P":
				a = t.dateTime({ width: "short" });
				break;
			case "PP":
				a = t.dateTime({ width: "medium" });
				break;
			case "PPP":
				a = t.dateTime({ width: "long" });
				break;
			default:
				a = t.dateTime({ width: "full" });
				break;
		}
		return a.replace("{{date}}", mi(r, t)).replace("{{time}}", hi(i, t));
	}
}, _i = /^D+$/, vi = /^Y+$/, yi = [
	"D",
	"DD",
	"YY",
	"YYYY"
];
function bi(e) {
	return _i.test(e);
}
function xi(e) {
	return vi.test(e);
}
function Si(e, t, n) {
	let r = Ci(e, t, n);
	if (console.warn(r), yi.includes(e)) throw RangeError(r);
}
function Ci(e, t, n) {
	let r = e[0] === "Y" ? "years" : "days of the month";
	return `Use \`${e.toLowerCase()}\` instead of \`${e}\` (in \`${t}\`) for formatting ${r} to the input \`${n}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
//#endregion
//#region node_modules/date-fns/format.js
var wi = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, Ti = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, Ei = /^'([^]*?)'?$/, Di = /''/g, Oi = /[a-zA-Z]/;
function ki(e, t, n) {
	let r = vr(), i = n?.locale ?? r.locale ?? ni, a = n?.firstWeekContainsDate ?? n?.locale?.options?.firstWeekContainsDate ?? r.firstWeekContainsDate ?? r.locale?.options?.firstWeekContainsDate ?? 1, o = n?.weekStartsOn ?? n?.locale?.options?.weekStartsOn ?? r.weekStartsOn ?? r.locale?.options?.weekStartsOn ?? 0, s = q(e, n?.in);
	if (!Nr(s)) throw RangeError("Invalid time value");
	let c = t.match(Ti).map((e) => {
		let t = e[0];
		if (t === "p" || t === "P") {
			let n = gi[t];
			return n(e, i.formatLong);
		}
		return e;
	}).join("").match(wi).map((e) => {
		if (e === "''") return {
			isToken: !1,
			value: "'"
		};
		let t = e[0];
		if (t === "'") return {
			isToken: !1,
			value: Ai(e)
		};
		if (ui[t]) return {
			isToken: !0,
			value: e
		};
		if (t.match(Oi)) throw RangeError("Format string contains an unescaped latin alphabet character `" + t + "`");
		return {
			isToken: !1,
			value: e
		};
	});
	i.localize.preprocessor && (c = i.localize.preprocessor(s, c));
	let l = {
		firstWeekContainsDate: a,
		weekStartsOn: o,
		locale: i
	};
	return c.map((r) => {
		if (!r.isToken) return r.value;
		let a = r.value;
		(!n?.useAdditionalWeekYearTokens && xi(a) || !n?.useAdditionalDayOfYearTokens && bi(a)) && Si(a, t, String(e));
		let o = ui[a[0]];
		return o(s, a, i.localize, l);
	}).join("");
}
function Ai(e) {
	let t = e.match(Ei);
	return t ? t[1].replace(Di, "'") : e;
}
//#endregion
//#region node_modules/date-fns/getDaysInMonth.js
function ji(e, t) {
	let n = q(e, t?.in), r = n.getFullYear(), i = n.getMonth(), a = K(n, 0);
	return a.setFullYear(r, i + 1, 0), a.setHours(0, 0, 0, 0), a.getDate();
}
//#endregion
//#region node_modules/date-fns/getMonth.js
function Mi(e, t) {
	return q(e, t?.in).getMonth();
}
//#endregion
//#region node_modules/date-fns/getYear.js
function Ni(e, t) {
	return q(e, t?.in).getFullYear();
}
//#endregion
//#region node_modules/date-fns/isAfter.js
function Pi(e, t) {
	return +q(e) > +q(t);
}
//#endregion
//#region node_modules/date-fns/isBefore.js
function Fi(e, t) {
	return +q(e) < +q(t);
}
//#endregion
//#region node_modules/date-fns/isSameMonth.js
function Ii(e, t, n) {
	let [r, i] = Cr(n?.in, e, t);
	return r.getFullYear() === i.getFullYear() && r.getMonth() === i.getMonth();
}
//#endregion
//#region node_modules/date-fns/isSameYear.js
function Li(e, t, n) {
	let [r, i] = Cr(n?.in, e, t);
	return r.getFullYear() === i.getFullYear();
}
//#endregion
//#region node_modules/date-fns/setMonth.js
function Ri(e, t, n) {
	let r = q(e, n?.in), i = r.getFullYear(), a = r.getDate(), o = K(n?.in || e, 0);
	o.setFullYear(i, t, 15), o.setHours(0, 0, 0, 0);
	let s = ji(o);
	return r.setMonth(t, Math.min(a, s)), r;
}
//#endregion
//#region node_modules/date-fns/setYear.js
function zi(e, t, n) {
	let r = q(e, n?.in);
	return isNaN(+r) ? K(n?.in || e, NaN) : (r.setFullYear(t), r);
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/helpers/getBroadcastWeeksInMonth.js
var Bi = 5, Vi = 4;
function Hi(e, t) {
	let n = t.startOfMonth(e), r = n.getDay() > 0 ? n.getDay() : 7, i = t.addDays(e, -r + 1), a = t.addDays(i, Bi * 7 - 1);
	return t.getMonth(e) === t.getMonth(a) ? Bi : Vi;
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/helpers/startOfBroadcastWeek.js
function Ui(e, t) {
	let n = t.startOfMonth(e), r = n.getDay();
	return r === 1 ? n : r === 0 ? t.addDays(n, -6) : t.addDays(n, -1 * (r - 1));
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/helpers/endOfBroadcastWeek.js
function Wi(e, t) {
	let n = Ui(e, t), r = Hi(e, t);
	return t.addDays(n, r * 7 - 1);
}
//#endregion
//#region node_modules/date-fns/locale/ja/_lib/formatDistance.js
var Gi = {
	lessThanXSeconds: {
		one: "1秒未満",
		other: "{{count}}秒未満",
		oneWithSuffix: "約1秒",
		otherWithSuffix: "約{{count}}秒"
	},
	xSeconds: {
		one: "1秒",
		other: "{{count}}秒"
	},
	halfAMinute: "30秒",
	lessThanXMinutes: {
		one: "1分未満",
		other: "{{count}}分未満",
		oneWithSuffix: "約1分",
		otherWithSuffix: "約{{count}}分"
	},
	xMinutes: {
		one: "1分",
		other: "{{count}}分"
	},
	aboutXHours: {
		one: "約1時間",
		other: "約{{count}}時間"
	},
	xHours: {
		one: "1時間",
		other: "{{count}}時間"
	},
	xDays: {
		one: "1日",
		other: "{{count}}日"
	},
	aboutXWeeks: {
		one: "約1週間",
		other: "約{{count}}週間"
	},
	xWeeks: {
		one: "1週間",
		other: "{{count}}週間"
	},
	aboutXMonths: {
		one: "約1か月",
		other: "約{{count}}か月"
	},
	xMonths: {
		one: "1か月",
		other: "{{count}}か月"
	},
	aboutXYears: {
		one: "約1年",
		other: "約{{count}}年"
	},
	xYears: {
		one: "1年",
		other: "{{count}}年"
	},
	overXYears: {
		one: "1年以上",
		other: "{{count}}年以上"
	},
	almostXYears: {
		one: "1年近く",
		other: "{{count}}年近く"
	}
}, Ki = (e, t, n) => {
	n ||= {};
	let r, i = Gi[e];
	return r = typeof i == "string" ? i : t === 1 ? n.addSuffix && i.oneWithSuffix ? i.oneWithSuffix : i.one : n.addSuffix && i.otherWithSuffix ? i.otherWithSuffix.replace("{{count}}", String(t)) : i.other.replace("{{count}}", String(t)), n.addSuffix ? n.comparison && n.comparison > 0 ? r + "後" : r + "前" : r;
}, qi = {
	date: Kr({
		formats: {
			full: "y年M月d日EEEE",
			long: "y年M月d日",
			medium: "y/MM/dd",
			short: "y/MM/dd"
		},
		defaultWidth: "full"
	}),
	time: Kr({
		formats: {
			full: "H時mm分ss秒 zzzz",
			long: "H:mm:ss z",
			medium: "H:mm:ss",
			short: "H:mm"
		},
		defaultWidth: "full"
	}),
	dateTime: Kr({
		formats: {
			full: "{{date}} {{time}}",
			long: "{{date}} {{time}}",
			medium: "{{date}} {{time}}",
			short: "{{date}} {{time}}"
		},
		defaultWidth: "full"
	})
}, Ji = {
	lastWeek: "先週のeeeeのp",
	yesterday: "昨日のp",
	today: "今日のp",
	tomorrow: "明日のp",
	nextWeek: "翌週のeeeeのp",
	other: "P"
}, Yi = {
	code: "ja",
	formatDistance: Ki,
	formatLong: qi,
	formatRelative: (e, t, n, r) => Ji[e],
	localize: {
		ordinalNumber: (e, t) => {
			let n = Number(e);
			switch (String(t?.unit)) {
				case "year": return `${n}年`;
				case "quarter": return `第${n}四半期`;
				case "month": return `${n}月`;
				case "week": return `第${n}週`;
				case "date": return `${n}日`;
				case "hour": return `${n}時`;
				case "minute": return `${n}分`;
				case "second": return `${n}秒`;
				default: return `${n}`;
			}
		},
		era: Xr({
			values: {
				narrow: ["BC", "AC"],
				abbreviated: ["紀元前", "西暦"],
				wide: ["紀元前", "西暦"]
			},
			defaultWidth: "wide"
		}),
		quarter: Xr({
			values: {
				narrow: [
					"1",
					"2",
					"3",
					"4"
				],
				abbreviated: [
					"Q1",
					"Q2",
					"Q3",
					"Q4"
				],
				wide: [
					"第1四半期",
					"第2四半期",
					"第3四半期",
					"第4四半期"
				]
			},
			defaultWidth: "wide",
			argumentCallback: (e) => Number(e) - 1
		}),
		month: Xr({
			values: {
				narrow: [
					"1",
					"2",
					"3",
					"4",
					"5",
					"6",
					"7",
					"8",
					"9",
					"10",
					"11",
					"12"
				],
				abbreviated: [
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
				],
				wide: [
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
				]
			},
			defaultWidth: "wide"
		}),
		day: Xr({
			values: {
				narrow: [
					"日",
					"月",
					"火",
					"水",
					"木",
					"金",
					"土"
				],
				short: [
					"日",
					"月",
					"火",
					"水",
					"木",
					"金",
					"土"
				],
				abbreviated: [
					"日",
					"月",
					"火",
					"水",
					"木",
					"金",
					"土"
				],
				wide: [
					"日曜日",
					"月曜日",
					"火曜日",
					"水曜日",
					"木曜日",
					"金曜日",
					"土曜日"
				]
			},
			defaultWidth: "wide"
		}),
		dayPeriod: Xr({
			values: {
				narrow: {
					am: "午前",
					pm: "午後",
					midnight: "深夜",
					noon: "正午",
					morning: "朝",
					afternoon: "午後",
					evening: "夜",
					night: "深夜"
				},
				abbreviated: {
					am: "午前",
					pm: "午後",
					midnight: "深夜",
					noon: "正午",
					morning: "朝",
					afternoon: "午後",
					evening: "夜",
					night: "深夜"
				},
				wide: {
					am: "午前",
					pm: "午後",
					midnight: "深夜",
					noon: "正午",
					morning: "朝",
					afternoon: "午後",
					evening: "夜",
					night: "深夜"
				}
			},
			defaultWidth: "wide",
			formattingValues: {
				narrow: {
					am: "午前",
					pm: "午後",
					midnight: "深夜",
					noon: "正午",
					morning: "朝",
					afternoon: "午後",
					evening: "夜",
					night: "深夜"
				},
				abbreviated: {
					am: "午前",
					pm: "午後",
					midnight: "深夜",
					noon: "正午",
					morning: "朝",
					afternoon: "午後",
					evening: "夜",
					night: "深夜"
				},
				wide: {
					am: "午前",
					pm: "午後",
					midnight: "深夜",
					noon: "正午",
					morning: "朝",
					afternoon: "午後",
					evening: "夜",
					night: "深夜"
				}
			},
			defaultFormattingWidth: "wide"
		})
	},
	match: {
		ordinalNumber: ti({
			matchPattern: /^第?\d+(年|四半期|月|週|日|時|分|秒)?/i,
			parsePattern: /\d+/i,
			valueCallback: function(e) {
				return parseInt(e, 10);
			}
		}),
		era: Qr({
			matchPatterns: {
				narrow: /^(B\.?C\.?|A\.?D\.?)/i,
				abbreviated: /^(紀元[前後]|西暦)/i,
				wide: /^(紀元[前後]|西暦)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^B/i, /^A/i],
				any: [/^(紀元前)/i, /^(西暦|紀元後)/i]
			},
			defaultParseWidth: "any"
		}),
		quarter: Qr({
			matchPatterns: {
				narrow: /^[1234]/i,
				abbreviated: /^Q[1234]/i,
				wide: /^第[1234一二三四１２３４]四半期/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: { any: [
				/(1|一|１)/i,
				/(2|二|２)/i,
				/(3|三|３)/i,
				/(4|四|４)/i
			] },
			defaultParseWidth: "any",
			valueCallback: (e) => e + 1
		}),
		month: Qr({
			matchPatterns: {
				narrow: /^([123456789]|1[012])/,
				abbreviated: /^([123456789]|1[012])月/i,
				wide: /^([123456789]|1[012])月/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: { any: [
				/^1\D/,
				/^2/,
				/^3/,
				/^4/,
				/^5/,
				/^6/,
				/^7/,
				/^8/,
				/^9/,
				/^10/,
				/^11/,
				/^12/
			] },
			defaultParseWidth: "any"
		}),
		day: Qr({
			matchPatterns: {
				narrow: /^[日月火水木金土]/,
				short: /^[日月火水木金土]/,
				abbreviated: /^[日月火水木金土]/,
				wide: /^[日月火水木金土]曜日/
			},
			defaultMatchWidth: "wide",
			parsePatterns: { any: [
				/^日/,
				/^月/,
				/^火/,
				/^水/,
				/^木/,
				/^金/,
				/^土/
			] },
			defaultParseWidth: "any"
		}),
		dayPeriod: Qr({
			matchPatterns: { any: /^(AM|PM|午前|午後|正午|深夜|真夜中|夜|朝)/i },
			defaultMatchWidth: "any",
			parsePatterns: { any: {
				am: /^(A|午前)/i,
				pm: /^(P|午後)/i,
				midnight: /^深夜|真夜中/i,
				noon: /^正午/i,
				morning: /^朝/i,
				afternoon: /^午後/i,
				evening: /^夜/i,
				night: /^深夜/i
			} },
			defaultParseWidth: "any"
		})
	},
	options: {
		weekStartsOn: 0,
		firstWeekContainsDate: 1
	}
}, Xi = {
	...ni,
	labels: {
		labelDayButton: (e, t, n, r) => {
			let i;
			i = r && typeof r.format == "function" ? r.format.bind(r) : (e, t) => ki(e, t, {
				locale: ni,
				...n
			});
			let a = i(e, "PPPP");
			return t.today && (a = `Today, ${a}`), t.selected && (a = `${a}, selected`), a;
		},
		labelMonthDropdown: "Choose the Month",
		labelNext: "Go to the Next Month",
		labelPrevious: "Go to the Previous Month",
		labelWeekNumber: (e) => `Week ${e}`,
		labelYearDropdown: "Choose the Year",
		labelGrid: (e, t, n) => {
			let r;
			return r = n && typeof n.format == "function" ? n.format.bind(n) : (e, n) => ki(e, n, {
				locale: ni,
				...t
			}), r(e, "LLLL yyyy");
		},
		labelGridcell: (e, t, n, r) => {
			let i;
			i = r && typeof r.format == "function" ? r.format.bind(r) : (e, t) => ki(e, t, {
				locale: ni,
				...n
			});
			let a = i(e, "PPPP");
			return t?.today && (a = `Today, ${a}`), a;
		},
		labelNav: "Navigation bar",
		labelWeekNumberHeader: "Week Number",
		labelWeekday: (e, t, n) => {
			let r;
			return r = n && typeof n.format == "function" ? n.format.bind(n) : (e, n) => ki(e, n, {
				locale: ni,
				...t
			}), r(e, "cccc");
		}
	}
}, Y = class e {
	constructor(e, t) {
		this.today = () => this.overrides?.today ? this.overrides.today() : this.options.timeZone ? lr.tz(this.options.timeZone) : new (this.options.Date ?? Date)(), this.newDate = (e, t, n) => this.overrides?.newDate ? this.overrides.newDate(e, t, n) : this.options.timeZone ? new lr(e, t, n, this.options.timeZone) : new Date(e, t, n), this.addDays = (e, t) => this.overrides?.addDays ? this.overrides.addDays(e, t) : hr(e, t), this.addMonths = (e, t) => this.overrides?.addMonths ? this.overrides.addMonths(e, t) : gr(e, t), this.addWeeks = (e, t) => this.overrides?.addWeeks ? this.overrides.addWeeks(e, t) : Dr(e, t), this.addYears = (e, t) => this.overrides?.addYears ? this.overrides.addYears(e, t) : Or(e, t), this.differenceInCalendarDays = (e, t) => this.overrides?.differenceInCalendarDays ? this.overrides.differenceInCalendarDays(e, t) : Tr(e, t), this.differenceInCalendarMonths = (e, t) => this.overrides?.differenceInCalendarMonths ? this.overrides.differenceInCalendarMonths(e, t) : Pr(e, t), this.eachMonthOfInterval = (e) => this.overrides?.eachMonthOfInterval ? this.overrides.eachMonthOfInterval(e) : Lr(e), this.eachYearOfInterval = (e) => {
			let t = this.overrides?.eachYearOfInterval ? this.overrides.eachYearOfInterval(e) : Vr(e), n = new Set(t.map((e) => this.getYear(e)));
			if (n.size === t.length) return t;
			let r = [];
			return n.forEach((e) => {
				r.push(new Date(e, 0, 1));
			}), r;
		}, this.endOfBroadcastWeek = (e) => this.overrides?.endOfBroadcastWeek ? this.overrides.endOfBroadcastWeek(e) : Wi(e, this), this.endOfISOWeek = (e) => this.overrides?.endOfISOWeek ? this.overrides.endOfISOWeek(e) : Ur(e), this.endOfMonth = (e) => this.overrides?.endOfMonth ? this.overrides.endOfMonth(e) : Fr(e), this.endOfWeek = (e, t) => this.overrides?.endOfWeek ? this.overrides.endOfWeek(e, t) : Hr(e, this.options), this.endOfYear = (e) => this.overrides?.endOfYear ? this.overrides.endOfYear(e) : zr(e), this.format = (e, t, n) => {
			let r = this.overrides?.format ? this.overrides.format(e, t, this.options) : ki(e, t, this.options);
			return this.options.numerals && this.options.numerals !== "latn" ? this.replaceDigits(r) : r;
		}, this.getISOWeek = (e) => this.overrides?.getISOWeek ? this.overrides.getISOWeek(e) : ii(e), this.getMonth = (e, t) => this.overrides?.getMonth ? this.overrides.getMonth(e, this.options) : Mi(e, this.options), this.getYear = (e, t) => this.overrides?.getYear ? this.overrides.getYear(e, this.options) : Ni(e, this.options), this.getWeek = (e, t) => this.overrides?.getWeek ? this.overrides.getWeek(e, this.options) : si(e, this.options), this.isAfter = (e, t) => this.overrides?.isAfter ? this.overrides.isAfter(e, t) : Pi(e, t), this.isBefore = (e, t) => this.overrides?.isBefore ? this.overrides.isBefore(e, t) : Fi(e, t), this.isDate = (e) => this.overrides?.isDate ? this.overrides.isDate(e) : Mr(e), this.isSameDay = (e, t) => this.overrides?.isSameDay ? this.overrides.isSameDay(e, t) : jr(e, t), this.isSameMonth = (e, t) => this.overrides?.isSameMonth ? this.overrides.isSameMonth(e, t) : Ii(e, t), this.isSameYear = (e, t) => this.overrides?.isSameYear ? this.overrides.isSameYear(e, t) : Li(e, t), this.max = (e) => this.overrides?.max ? this.overrides.max(e) : kr(e), this.min = (e) => this.overrides?.min ? this.overrides.min(e) : Ar(e), this.setMonth = (e, t) => this.overrides?.setMonth ? this.overrides.setMonth(e, t) : Ri(e, t), this.setYear = (e, t) => this.overrides?.setYear ? this.overrides.setYear(e, t) : zi(e, t), this.startOfBroadcastWeek = (e, t) => this.overrides?.startOfBroadcastWeek ? this.overrides.startOfBroadcastWeek(e, this) : Ui(e, this), this.startOfDay = (e) => this.overrides?.startOfDay ? this.overrides.startOfDay(e) : wr(e), this.startOfISOWeek = (e) => this.overrides?.startOfISOWeek ? this.overrides.startOfISOWeek(e) : br(e), this.startOfMonth = (e) => this.overrides?.startOfMonth ? this.overrides.startOfMonth(e) : Rr(e), this.startOfWeek = (e, t) => this.overrides?.startOfWeek ? this.overrides.startOfWeek(e, this.options) : yr(e, this.options), this.startOfYear = (e) => this.overrides?.startOfYear ? this.overrides.startOfYear(e) : Br(e), this.options = {
			locale: Xi,
			...e
		}, this.overrides = t;
	}
	getDigitMap() {
		let { numerals: e = "latn" } = this.options, t = new Intl.NumberFormat("en-US", { numberingSystem: e }), n = {};
		for (let e = 0; e < 10; e++) n[e.toString()] = t.format(e);
		return n;
	}
	replaceDigits(e) {
		let t = this.getDigitMap();
		return e.replace(/\d/g, (e) => t[e] || e);
	}
	formatNumber(e) {
		return this.replaceDigits(e.toString());
	}
	getMonthYearOrder() {
		let t = this.options.locale?.code;
		return t && e.yearFirstLocales.has(t) ? "year-first" : "month-first";
	}
	formatMonthYear(t) {
		let { locale: n, timeZone: r, numerals: i } = this.options, a = n?.code;
		if (a && e.yearFirstLocales.has(a)) try {
			return new Intl.DateTimeFormat(a, {
				month: "long",
				year: "numeric",
				timeZone: r,
				numberingSystem: i
			}).format(t);
		} catch {}
		let o = this.getMonthYearOrder() === "year-first" ? "y LLLL" : "LLLL y";
		return this.format(t, o);
	}
};
Y.yearFirstLocales = /* @__PURE__ */ new Set([
	"eu",
	"hu",
	"ja",
	"ja-Hira",
	"ja-JP",
	"ko",
	"ko-KR",
	"lt",
	"lt-LT",
	"lv",
	"lv-LV",
	"mn",
	"mn-MN",
	"zh",
	"zh-CN",
	"zh-HK",
	"zh-TW"
]);
var Zi = new Y(), Qi = class {
	constructor(e, t, n = Zi) {
		this.date = e, this.displayMonth = t, this.outside = !!(t && !n.isSameMonth(e, t)), this.dateLib = n, this.isoDate = n.format(e, "yyyy-MM-dd"), this.displayMonthId = n.format(t, "yyyy-MM"), this.dateMonthId = n.format(e, "yyyy-MM");
	}
	isEqualTo(e) {
		return this.dateLib.isSameDay(e.date, this.date) && this.dateLib.isSameMonth(e.displayMonth, this.displayMonth);
	}
}, $i = class {
	constructor(e, t) {
		this.date = e, this.weeks = t;
	}
}, ea = class {
	constructor(e, t) {
		this.days = t, this.weekNumber = e;
	}
};
//#endregion
//#region node_modules/react-day-picker/dist/esm/components/CaptionLabel.js
function ta(e) {
	return r.createElement("span", { ...e });
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/components/Chevron.js
function na(e) {
	let { size: t = 24, orientation: n = "left", className: i, style: a } = e;
	return r.createElement("svg", {
		className: i,
		style: a,
		width: t,
		height: t,
		viewBox: "0 0 24 24"
	}, n === "up" && r.createElement("polygon", { points: "6.77 17 12.5 11.43 18.24 17 20 15.28 12.5 8 5 15.28" }), n === "down" && r.createElement("polygon", { points: "6.77 8 12.5 13.57 18.24 8 20 9.72 12.5 17 5 9.72" }), n === "left" && r.createElement("polygon", { points: "16 18.112 9.81111111 12 16 5.87733333 14.0888889 4 6 12 14.0888889 20" }), n === "right" && r.createElement("polygon", { points: "8 18.112 14.18888889 12 8 5.87733333 9.91111111 4 18 12 9.91111111 20" }));
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/components/Day.js
function ra(e) {
	let { day: t, modifiers: n, ...i } = e;
	return r.createElement("td", { ...i });
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/components/DayButton.js
function ia(e) {
	let { day: t, modifiers: n, ...i } = e, a = r.useRef(null);
	return r.useEffect(() => {
		n.focused && a.current?.focus();
	}, [n.focused]), r.createElement("button", {
		ref: a,
		...i
	});
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/UI.js
var X;
(function(e) {
	e.Root = "root", e.Chevron = "chevron", e.Day = "day", e.DayButton = "day_button", e.CaptionLabel = "caption_label", e.Dropdowns = "dropdowns", e.Dropdown = "dropdown", e.DropdownRoot = "dropdown_root", e.Footer = "footer", e.MonthGrid = "month_grid", e.MonthCaption = "month_caption", e.MonthsDropdown = "months_dropdown", e.Month = "month", e.Months = "months", e.Nav = "nav", e.NextMonthButton = "button_next", e.PreviousMonthButton = "button_previous", e.Week = "week", e.Weeks = "weeks", e.Weekday = "weekday", e.Weekdays = "weekdays", e.WeekNumber = "week_number", e.WeekNumberHeader = "week_number_header", e.YearsDropdown = "years_dropdown";
})(X ||= {});
var Z;
(function(e) {
	e.disabled = "disabled", e.hidden = "hidden", e.outside = "outside", e.focused = "focused", e.today = "today";
})(Z ||= {});
var aa;
(function(e) {
	e.range_end = "range_end", e.range_middle = "range_middle", e.range_start = "range_start", e.selected = "selected";
})(aa ||= {});
var oa;
(function(e) {
	e.weeks_before_enter = "weeks_before_enter", e.weeks_before_exit = "weeks_before_exit", e.weeks_after_enter = "weeks_after_enter", e.weeks_after_exit = "weeks_after_exit", e.caption_after_enter = "caption_after_enter", e.caption_after_exit = "caption_after_exit", e.caption_before_enter = "caption_before_enter", e.caption_before_exit = "caption_before_exit";
})(oa ||= {});
//#endregion
//#region node_modules/react-day-picker/dist/esm/useDayPicker.js
var sa = i(void 0);
function ca() {
	let e = o(sa);
	if (e === void 0) throw Error("useDayPicker() must be used within a custom component.");
	return e;
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/components/Dropdown.js
function la(e) {
	let { options: t, className: n, ...i } = e, { classNames: a, components: o, styles: s } = ca(), c = [a[X.Dropdown], n].join(" "), l = t?.find(({ value: e }) => e === i.value);
	return r.createElement("span", {
		"data-disabled": i.disabled,
		className: a[X.DropdownRoot],
		style: s?.[X.DropdownRoot]
	}, r.createElement(o.Select, {
		className: c,
		...i
	}, t?.map(({ value: e, label: t, disabled: n }) => r.createElement(o.Option, {
		key: e,
		value: e,
		disabled: n
	}, t))), r.createElement("span", {
		className: a[X.CaptionLabel],
		style: s?.[X.CaptionLabel],
		"aria-hidden": !0
	}, l?.label, r.createElement(o.Chevron, {
		orientation: "down",
		size: 18,
		className: a[X.Chevron],
		style: s?.[X.Chevron]
	})));
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/components/DropdownNav.js
function ua(e) {
	return r.createElement("div", { ...e });
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/components/Footer.js
function da(e) {
	return r.createElement("div", { ...e });
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/components/Month.js
function fa(e) {
	let { calendarMonth: t, displayIndex: n, ...i } = e;
	return r.createElement("div", { ...i }, e.children);
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/components/MonthCaption.js
function pa(e) {
	let { calendarMonth: t, displayIndex: n, ...i } = e;
	return r.createElement("div", { ...i });
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/components/MonthGrid.js
function ma(e) {
	return r.createElement("table", { ...e });
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/components/Months.js
function ha(e) {
	return r.createElement("div", { ...e });
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/components/MonthsDropdown.js
function ga(e) {
	let { components: t } = ca();
	return r.createElement(t.Dropdown, { ...e });
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/components/Nav.js
function _a(e) {
	let { onPreviousClick: t, onNextClick: n, previousMonth: i, nextMonth: o, ...s } = e, { components: c, classNames: l, styles: u, labels: { labelPrevious: d, labelNext: f } } = ca(), p = a((e) => {
		o && n?.(e);
	}, [o, n]), m = a((e) => {
		i && t?.(e);
	}, [i, t]);
	return r.createElement("nav", { ...s }, r.createElement(c.PreviousMonthButton, {
		type: "button",
		className: l[X.PreviousMonthButton],
		style: u?.[X.PreviousMonthButton],
		tabIndex: i ? void 0 : -1,
		"aria-disabled": i ? void 0 : !0,
		"aria-label": d(i),
		onClick: m
	}, r.createElement(c.Chevron, {
		disabled: i ? void 0 : !0,
		className: l[X.Chevron],
		style: u?.[X.Chevron],
		orientation: "left"
	})), r.createElement(c.NextMonthButton, {
		type: "button",
		className: l[X.NextMonthButton],
		style: u?.[X.NextMonthButton],
		tabIndex: o ? void 0 : -1,
		"aria-disabled": o ? void 0 : !0,
		"aria-label": f(o),
		onClick: p
	}, r.createElement(c.Chevron, {
		disabled: o ? void 0 : !0,
		orientation: "right",
		className: l[X.Chevron],
		style: u?.[X.Chevron]
	})));
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/components/NextMonthButton.js
function va(e) {
	return r.createElement("button", { ...e });
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/components/Option.js
function ya(e) {
	return r.createElement("option", { ...e });
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/components/PreviousMonthButton.js
function ba(e) {
	return r.createElement("button", { ...e });
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/components/Root.js
function xa(e) {
	let { rootRef: t, ...n } = e;
	return r.createElement("div", {
		...n,
		ref: t
	});
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/components/Select.js
function Sa(e) {
	return r.createElement("select", { ...e });
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/components/Week.js
function Ca(e) {
	let { week: t, ...n } = e;
	return r.createElement("tr", { ...n });
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/components/Weekday.js
function wa(e) {
	return r.createElement("th", { ...e });
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/components/Weekdays.js
function Ta(e) {
	return r.createElement("thead", { "aria-hidden": !0 }, r.createElement("tr", { ...e }));
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/components/WeekNumber.js
function Ea(e) {
	let { week: t, ...n } = e;
	return r.createElement("th", { ...n });
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/components/WeekNumberHeader.js
function Da(e) {
	return r.createElement("th", { ...e });
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/components/Weeks.js
function Oa(e) {
	return r.createElement("tbody", { ...e });
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/components/YearsDropdown.js
function ka(e) {
	let { components: t } = ca();
	return r.createElement(t.Dropdown, { ...e });
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/components/custom-components.js
var Aa = /* @__PURE__ */ e({
	CaptionLabel: () => ta,
	Chevron: () => na,
	Day: () => ra,
	DayButton: () => ia,
	Dropdown: () => la,
	DropdownNav: () => ua,
	Footer: () => da,
	Month: () => fa,
	MonthCaption: () => pa,
	MonthGrid: () => ma,
	Months: () => ha,
	MonthsDropdown: () => ga,
	Nav: () => _a,
	NextMonthButton: () => va,
	Option: () => ya,
	PreviousMonthButton: () => ba,
	Root: () => xa,
	Select: () => Sa,
	Week: () => Ca,
	WeekNumber: () => Ea,
	WeekNumberHeader: () => Da,
	Weekday: () => wa,
	Weekdays: () => Ta,
	Weeks: () => Oa,
	YearsDropdown: () => ka
});
//#endregion
//#region node_modules/react-day-picker/dist/esm/utils/rangeIncludesDate.js
function ja(e, t, n = !1, r = Zi) {
	let { from: i, to: a } = e, { differenceInCalendarDays: o, isSameDay: s } = r;
	return i && a ? (o(a, i) < 0 && ([i, a] = [a, i]), o(t, i) >= +!!n && o(a, t) >= +!!n) : !n && a ? s(a, t) : !n && i ? s(i, t) : !1;
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/utils/typeguards.js
function Ma(e) {
	return !!(e && typeof e == "object" && "before" in e && "after" in e);
}
function Na(e) {
	return !!(e && typeof e == "object" && "from" in e);
}
function Pa(e) {
	return !!(e && typeof e == "object" && "after" in e);
}
function Fa(e) {
	return !!(e && typeof e == "object" && "before" in e);
}
function Ia(e) {
	return !!(e && typeof e == "object" && "dayOfWeek" in e);
}
function La(e, t) {
	return Array.isArray(e) && e.every(t.isDate);
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/utils/dateMatchModifiers.js
function Ra(e, t, n = Zi) {
	let r = Array.isArray(t) ? t : [t], { isSameDay: i, differenceInCalendarDays: a, isAfter: o } = n;
	return r.some((t) => {
		if (typeof t == "boolean") return t;
		if (n.isDate(t)) return i(e, t);
		if (La(t, n)) return t.some((t) => i(e, t));
		if (Na(t)) return ja(t, e, !1, n);
		if (Ia(t)) return Array.isArray(t.dayOfWeek) ? t.dayOfWeek.includes(e.getDay()) : t.dayOfWeek === e.getDay();
		if (Ma(t)) {
			let n = a(t.before, e), r = a(t.after, e), i = n > 0, s = r < 0;
			return o(t.before, t.after) ? s && i : i || s;
		}
		return Pa(t) ? a(e, t.after) > 0 : Fa(t) ? a(t.before, e) > 0 : typeof t == "function" ? t(e) : !1;
	});
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/helpers/createGetModifiers.js
function za(e, t, n, r, i) {
	let { disabled: a, hidden: o, modifiers: s, showOutsideDays: c, broadcastCalendar: l, today: u = i.today() } = t, { isSameDay: d, isSameMonth: f, startOfMonth: p, isBefore: m, endOfMonth: h, isAfter: g } = i, _ = n && p(n), v = r && h(r), y = {
		[Z.focused]: [],
		[Z.outside]: [],
		[Z.disabled]: [],
		[Z.hidden]: [],
		[Z.today]: []
	}, b = {};
	for (let t of e) {
		let { date: e, displayMonth: n } = t, r = !!(n && !f(e, n)), p = !!(_ && m(e, _)), h = !!(v && g(e, v)), x = !!(a && Ra(e, a, i)), S = !!(o && Ra(e, o, i)) || p || h || !l && !c && r || l && c === !1 && r, C = d(e, u);
		r && y.outside.push(t), x && y.disabled.push(t), S && y.hidden.push(t), C && y.today.push(t), s && Object.keys(s).forEach((n) => {
			let r = s?.[n];
			r && Ra(e, r, i) && (b[n] ? b[n].push(t) : b[n] = [t]);
		});
	}
	return (e) => {
		let t = {
			[Z.focused]: !1,
			[Z.disabled]: !1,
			[Z.hidden]: !1,
			[Z.outside]: !1,
			[Z.today]: !1
		}, n = {};
		for (let n in y) t[n] = y[n].some((t) => t === e);
		for (let t in b) n[t] = b[t].some((t) => t === e);
		return {
			...t,
			...n
		};
	};
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/helpers/getClassNamesForModifiers.js
function Ba(e, t, n = {}) {
	return Object.entries(e).filter(([, e]) => e === !0).reduce((e, [r]) => (n[r] ? e.push(n[r]) : t[Z[r]] ? e.push(t[Z[r]]) : t[aa[r]] && e.push(t[aa[r]]), e), [t[X.Day]]);
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/helpers/getComponents.js
function Va(e) {
	return {
		...Aa,
		...e
	};
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/helpers/getDataAttributes.js
function Ha(e) {
	let t = {
		"data-mode": e.mode ?? void 0,
		"data-required": "required" in e ? e.required : void 0,
		"data-multiple-months": e.numberOfMonths && e.numberOfMonths > 1 || void 0,
		"data-week-numbers": e.showWeekNumber || void 0,
		"data-broadcast-calendar": e.broadcastCalendar || void 0,
		"data-nav-layout": e.navLayout || void 0
	};
	return Object.entries(e).forEach(([e, n]) => {
		e.startsWith("data-") && (t[e] = n);
	}), t;
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/helpers/getDefaultClassNames.js
function Ua() {
	let e = {};
	for (let t in X) e[X[t]] = `rdp-${X[t]}`;
	for (let t in Z) e[Z[t]] = `rdp-${Z[t]}`;
	for (let t in aa) e[aa[t]] = `rdp-${aa[t]}`;
	for (let t in oa) e[oa[t]] = `rdp-${oa[t]}`;
	return e;
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/formatters/formatCaption.js
function Wa(e, t, n) {
	return (n ?? new Y(t)).formatMonthYear(e);
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/formatters/formatDay.js
function Ga(e, t, n) {
	return (n ?? new Y(t)).format(e, "d");
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/formatters/formatMonthDropdown.js
function Ka(e, t = Zi) {
	return t.format(e, "LLLL");
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/formatters/formatWeekdayName.js
function qa(e, t, n) {
	return (n ?? new Y(t)).format(e, "cccccc");
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/formatters/formatWeekNumber.js
function Ja(e, t = Zi) {
	return e < 10 ? t.formatNumber(`0${e.toLocaleString()}`) : t.formatNumber(`${e.toLocaleString()}`);
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/formatters/formatWeekNumberHeader.js
function Ya() {
	return "";
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/formatters/formatYearDropdown.js
function Xa(e, t = Zi) {
	return t.format(e, "yyyy");
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/formatters/index.js
var Za = /* @__PURE__ */ e({
	formatCaption: () => Wa,
	formatDay: () => Ga,
	formatMonthDropdown: () => Ka,
	formatWeekNumber: () => Ja,
	formatWeekNumberHeader: () => Ya,
	formatWeekdayName: () => qa,
	formatYearDropdown: () => Xa
});
//#endregion
//#region node_modules/react-day-picker/dist/esm/helpers/getFormatters.js
function Qa(e) {
	return {
		...Za,
		...e
	};
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/labels/labelDayButton.js
function $a(e, t, n, r) {
	let i = (r ?? new Y(n)).format(e, "PPPP");
	return t.today && (i = `Today, ${i}`), t.selected && (i = `${i}, selected`), i;
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/labels/labelGrid.js
function eo(e, t, n) {
	return (n ?? new Y(t)).formatMonthYear(e);
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/labels/labelGridcell.js
function to(e, t, n, r) {
	let i = (r ?? new Y(n)).format(e, "PPPP");
	return t?.today && (i = `Today, ${i}`), i;
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/labels/labelMonthDropdown.js
function no(e) {
	return "Choose the Month";
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/labels/labelNav.js
function ro() {
	return "";
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/labels/labelNext.js
var io = "Go to the Next Month";
function ao(e, t) {
	return io;
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/labels/labelPrevious.js
function oo(e) {
	return "Go to the Previous Month";
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/labels/labelWeekday.js
function so(e, t, n) {
	return (n ?? new Y(t)).format(e, "cccc");
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/labels/labelWeekNumber.js
function co(e, t) {
	return `Week ${e}`;
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/labels/labelWeekNumberHeader.js
function lo(e) {
	return "Week Number";
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/labels/labelYearDropdown.js
function uo(e) {
	return "Choose the Year";
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/labels/index.js
var fo = /* @__PURE__ */ e({
	labelDayButton: () => $a,
	labelGrid: () => eo,
	labelGridcell: () => to,
	labelMonthDropdown: () => no,
	labelNav: () => ro,
	labelNext: () => ao,
	labelPrevious: () => oo,
	labelWeekNumber: () => co,
	labelWeekNumberHeader: () => lo,
	labelWeekday: () => so,
	labelYearDropdown: () => uo
}), po = (e, t, n) => t || (n ? typeof n == "function" ? n : (...e) => n : e);
function mo(e, t) {
	let n = t.locale?.labels ?? {};
	return {
		...fo,
		...e ?? {},
		labelDayButton: po($a, e?.labelDayButton, n.labelDayButton),
		labelMonthDropdown: po(no, e?.labelMonthDropdown, n.labelMonthDropdown),
		labelNext: po(ao, e?.labelNext, n.labelNext),
		labelPrevious: po(oo, e?.labelPrevious, n.labelPrevious),
		labelWeekNumber: po(co, e?.labelWeekNumber, n.labelWeekNumber),
		labelYearDropdown: po(uo, e?.labelYearDropdown, n.labelYearDropdown),
		labelGrid: po(eo, e?.labelGrid, n.labelGrid),
		labelGridcell: po(to, e?.labelGridcell, n.labelGridcell),
		labelNav: po(ro, e?.labelNav, n.labelNav),
		labelWeekNumberHeader: po(lo, e?.labelWeekNumberHeader, n.labelWeekNumberHeader),
		labelWeekday: po(so, e?.labelWeekday, n.labelWeekday)
	};
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/helpers/getMonthOptions.js
function ho(e, t, n, r, i) {
	let { startOfMonth: a, startOfYear: o, endOfYear: s, eachMonthOfInterval: c, getMonth: l } = i;
	return c({
		start: o(e),
		end: s(e)
	}).map((e) => {
		let o = r.formatMonthDropdown(e, i);
		return {
			value: l(e),
			label: o,
			disabled: t && e < a(t) || n && e > a(n) || !1
		};
	});
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/helpers/getStyleForModifiers.js
function go(e, t = {}, n = {}) {
	let r = { ...t?.[X.Day] };
	return Object.entries(e).filter(([, e]) => e === !0).forEach(([e]) => {
		r = {
			...r,
			...n?.[e]
		};
	}), r;
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/helpers/getWeekdays.js
function _o(e, t, n, r) {
	let i = r ?? e.today(), a = n ? e.startOfBroadcastWeek(i, e) : t ? e.startOfISOWeek(i) : e.startOfWeek(i), o = [];
	for (let t = 0; t < 7; t++) {
		let n = e.addDays(a, t);
		o.push(n);
	}
	return o;
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/helpers/getYearOptions.js
function vo(e, t, n, r, i = !1) {
	if (!e || !t) return;
	let { startOfYear: a, endOfYear: o, eachYearOfInterval: s, getYear: c } = r, l = s({
		start: a(e),
		end: o(t)
	});
	return i && l.reverse(), l.map((e) => {
		let t = n.formatYearDropdown(e, r);
		return {
			value: c(e),
			label: t,
			disabled: !1
		};
	});
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/noonDateLib.js
function yo(e, t = {}) {
	let { weekStartsOn: n, locale: r } = t, i = n ?? r?.options?.weekStartsOn ?? 0, a = (t) => {
		let n = typeof t == "number" || typeof t == "string" ? new Date(t) : t;
		return new lr(n.getFullYear(), n.getMonth(), n.getDate(), 12, 0, 0, e);
	}, o = (e) => {
		let t = a(e);
		return new Date(t.getFullYear(), t.getMonth(), t.getDate(), 0, 0, 0, 0);
	};
	return {
		today: () => a(lr.tz(e)),
		newDate: (t, n, r) => new lr(t, n, r, 12, 0, 0, e),
		startOfDay: (e) => a(e),
		startOfWeek: (e, t) => {
			let n = a(e), r = t?.weekStartsOn ?? i, o = (n.getDay() - r + 7) % 7;
			return n.setDate(n.getDate() - o), n;
		},
		startOfISOWeek: (e) => {
			let t = a(e), n = (t.getDay() - 1 + 7) % 7;
			return t.setDate(t.getDate() - n), t;
		},
		startOfMonth: (e) => {
			let t = a(e);
			return t.setDate(1), t;
		},
		startOfYear: (e) => {
			let t = a(e);
			return t.setMonth(0, 1), t;
		},
		endOfWeek: (e, t) => {
			let n = a(e), r = (((t?.weekStartsOn ?? i) + 6) % 7 - n.getDay() + 7) % 7;
			return n.setDate(n.getDate() + r), n;
		},
		endOfISOWeek: (e) => {
			let t = a(e), n = (7 - t.getDay()) % 7;
			return t.setDate(t.getDate() + n), t;
		},
		endOfMonth: (e) => {
			let t = a(e);
			return t.setMonth(t.getMonth() + 1, 0), t;
		},
		endOfYear: (e) => {
			let t = a(e);
			return t.setMonth(11, 31), t;
		},
		eachMonthOfInterval: (t) => {
			let n = a(t.start), r = a(t.end), i = [], o = new lr(n.getFullYear(), n.getMonth(), 1, 12, 0, 0, e), s = r.getFullYear() * 12 + r.getMonth();
			for (; o.getFullYear() * 12 + o.getMonth() <= s;) i.push(new lr(o, e)), o.setMonth(o.getMonth() + 1, 1);
			return i;
		},
		addDays: (e, t) => {
			let n = a(e);
			return n.setDate(n.getDate() + t), n;
		},
		addWeeks: (e, t) => {
			let n = a(e);
			return n.setDate(n.getDate() + t * 7), n;
		},
		addMonths: (e, t) => {
			let n = a(e);
			return n.setMonth(n.getMonth() + t), n;
		},
		addYears: (e, t) => {
			let n = a(e);
			return n.setFullYear(n.getFullYear() + t), n;
		},
		eachYearOfInterval: (t) => {
			let n = a(t.start), r = a(t.end), i = [], o = new lr(n.getFullYear(), 0, 1, 12, 0, 0, e);
			for (; o.getFullYear() <= r.getFullYear();) i.push(new lr(o, e)), o.setFullYear(o.getFullYear() + 1, 0, 1);
			return i;
		},
		getWeek: (e, t) => si(o(e), {
			weekStartsOn: t?.weekStartsOn ?? i,
			firstWeekContainsDate: t?.firstWeekContainsDate ?? r?.options?.firstWeekContainsDate ?? 1
		}),
		getISOWeek: (e) => ii(o(e)),
		differenceInCalendarDays: (e, t) => Tr(o(e), o(t)),
		differenceInCalendarMonths: (e, t) => Pr(o(e), o(t))
	};
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/useAnimation.js
var bo = (e) => e instanceof HTMLElement ? e : null, xo = (e) => [...e.querySelectorAll("[data-animated-month]") ?? []], So = (e) => bo(e.querySelector("[data-animated-month]")), Co = (e) => bo(e.querySelector("[data-animated-caption]")), wo = (e) => bo(e.querySelector("[data-animated-weeks]")), To = (e) => bo(e.querySelector("[data-animated-nav]")), Eo = (e) => bo(e.querySelector("[data-animated-weekdays]"));
function Do(e, t, { classNames: n, months: r, focused: i, dateLib: a }) {
	let o = u(null), s = u(r), l = u(!1);
	c(() => {
		let c = s.current;
		if (s.current = r, !t || !e.current || !(e.current instanceof HTMLElement) || r.length === 0 || c.length === 0 || r.length !== c.length) return;
		let u = a.isSameMonth(r[0].date, c[0].date), d = a.isAfter(r[0].date, c[0].date), f = d ? n[oa.caption_after_enter] : n[oa.caption_before_enter], p = d ? n[oa.weeks_after_enter] : n[oa.weeks_before_enter], m = o.current, h = e.current.cloneNode(!0);
		if (h instanceof HTMLElement ? (xo(h).forEach((e) => {
			if (!(e instanceof HTMLElement)) return;
			let t = So(e);
			t && e.contains(t) && e.removeChild(t);
			let n = Co(e);
			n && n.classList.remove(f);
			let r = wo(e);
			r && r.classList.remove(p);
		}), o.current = h) : o.current = null, l.current || u || i) return;
		let g = m instanceof HTMLElement ? xo(m) : [], _ = xo(e.current);
		if (_?.every((e) => e instanceof HTMLElement) && g?.every((e) => e instanceof HTMLElement)) {
			l.current = !0;
			let t = [];
			e.current.style.isolation = "isolate";
			let r = To(e.current);
			r && (r.style.zIndex = "1"), _.forEach((i, a) => {
				let o = g[a];
				if (!o) return;
				i.style.position = "relative", i.style.overflow = "hidden";
				let s = Co(i);
				s && s.classList.add(f);
				let c = wo(i);
				c && c.classList.add(p);
				let u = () => {
					l.current = !1, e.current && (e.current.style.isolation = ""), r && (r.style.zIndex = ""), s && s.classList.remove(f), c && c.classList.remove(p), i.style.position = "", i.style.overflow = "", i.contains(o) && i.removeChild(o);
				};
				t.push(u), o.style.pointerEvents = "none", o.style.position = "absolute", o.style.overflow = "hidden", o.setAttribute("aria-hidden", "true");
				let m = Eo(o);
				m && (m.style.opacity = "0");
				let h = Co(o);
				h && (h.classList.add(d ? n[oa.caption_before_exit] : n[oa.caption_after_exit]), h.addEventListener("animationend", u));
				let _ = wo(o);
				_ && _.classList.add(d ? n[oa.weeks_before_exit] : n[oa.weeks_after_exit]), i.insertBefore(o, i.firstChild);
			});
		}
	});
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/helpers/getDates.js
function Oo(e, t, n, r) {
	let i = e[0], a = e[e.length - 1], { ISOWeek: o, fixedWeeks: s, broadcastCalendar: c } = n ?? {}, { addDays: l, differenceInCalendarDays: u, differenceInCalendarMonths: d, endOfBroadcastWeek: f, endOfISOWeek: p, endOfMonth: m, endOfWeek: h, isAfter: g, startOfBroadcastWeek: _, startOfISOWeek: v, startOfWeek: y } = r, b = c ? _(i, r) : o ? v(i) : y(i), x = c ? f(a) : o ? p(m(a)) : h(m(a)), S = t && (c ? f(t) : o ? p(t) : h(t)), C = u(S && g(x, S) ? S : x, b), w = d(a, i) + 1, T = [];
	for (let e = 0; e <= C; e++) {
		let t = l(b, e);
		T.push(t);
	}
	let E = (c ? 35 : 42) * w;
	if (s && T.length < E) {
		let e = E - T.length;
		for (let t = 0; t < e; t++) {
			let e = l(T[T.length - 1], 1);
			T.push(e);
		}
	}
	return T;
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/helpers/getDays.js
function ko(e) {
	let t = [];
	return e.reduce((e, n) => {
		let r = n.weeks.reduce((e, t) => e.concat(t.days.slice()), t.slice());
		return e.concat(r.slice());
	}, t.slice());
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/helpers/getDisplayMonths.js
function Ao(e, t, n, r) {
	let { numberOfMonths: i = 1 } = n, a = [];
	for (let n = 0; n < i; n++) {
		let i = r.addMonths(e, n);
		if (t && i > t) break;
		a.push(i);
	}
	return a;
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/helpers/getInitialMonth.js
function jo(e, t, n, r) {
	let { month: i, defaultMonth: a, today: o = r.today(), numberOfMonths: s = 1 } = e, c = i || a || o, { differenceInCalendarMonths: l, addMonths: u, startOfMonth: d } = r;
	return n && l(n, c) < s - 1 && (c = u(n, -1 * (s - 1))), t && l(c, t) < 0 && (c = t), d(c);
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/helpers/getMonths.js
function Mo(e, t, n, r) {
	let { addDays: i, endOfBroadcastWeek: a, endOfISOWeek: o, endOfMonth: s, endOfWeek: c, getISOWeek: l, getWeek: u, startOfBroadcastWeek: d, startOfISOWeek: f, startOfWeek: p } = r, m = e.reduce((e, m) => {
		let h = n.broadcastCalendar ? d(m, r) : n.ISOWeek ? f(m) : p(m), g = n.broadcastCalendar ? a(m) : n.ISOWeek ? o(s(m)) : c(s(m)), _ = t.filter((e) => e >= h && e <= g), v = n.broadcastCalendar ? 35 : 42;
		if (n.fixedWeeks && _.length < v) {
			let e = t.filter((e) => {
				let t = v - _.length;
				return e > g && e <= i(g, t);
			});
			_.push(...e);
		}
		let y = new $i(m, _.reduce((e, t) => {
			let i = n.ISOWeek ? l(t) : u(t), a = e.find((e) => e.weekNumber === i), o = new Qi(t, m, r);
			return a ? a.days.push(o) : e.push(new ea(i, [o])), e;
		}, []));
		return e.push(y), e;
	}, []);
	return n.reverseMonths ? m.reverse() : m;
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/helpers/getNavMonth.js
function No(e, t) {
	let { startMonth: n, endMonth: r } = e, { startOfYear: i, startOfDay: a, startOfMonth: o, endOfMonth: s, addYears: c, endOfYear: l, today: u } = t, d = e.captionLayout === "dropdown" || e.captionLayout === "dropdown-years";
	return n ? n = o(n) : !n && d && (n = i(c(e.today ?? u(), -100))), r ? r = s(r) : !r && d && (r = l(e.today ?? u())), [n && a(n), r && a(r)];
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/helpers/getNextMonth.js
function Po(e, t, n, r) {
	if (n.disableNavigation) return;
	let { pagedNavigation: i, numberOfMonths: a = 1 } = n, { startOfMonth: o, addMonths: s, differenceInCalendarMonths: c } = r, l = i ? a : 1, u = o(e);
	if (!t || !(c(t, e) < a)) return s(u, l);
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/helpers/getPreviousMonth.js
function Fo(e, t, n, r) {
	if (n.disableNavigation) return;
	let { pagedNavigation: i, numberOfMonths: a } = n, { startOfMonth: o, addMonths: s, differenceInCalendarMonths: c } = r, l = i ? a ?? 1 : 1, u = o(e);
	if (!t || !(c(u, t) <= 0)) return s(u, -l);
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/helpers/getWeeks.js
function Io(e) {
	return e.reduce((e, t) => e.concat(t.weeks.slice()), [].slice());
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/helpers/useControlledValue.js
function Lo(e, t) {
	let [n, r] = d(e);
	return [t === void 0 ? n : t, r];
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/useCalendar.js
function Ro(e, t) {
	let [n, r] = No(e, t), { startOfMonth: i, endOfMonth: a } = t, o = jo(e, n, r, t), [c, u] = Lo(o, e.month ? o : void 0);
	s(() => {
		let i = jo(e, n, r, t);
		u(i);
	}, [e.timeZone]);
	let { months: d, weeks: f, days: p, previousMonth: m, nextMonth: h } = l(() => {
		let i = Ao(c, r, { numberOfMonths: e.numberOfMonths }, t), o = Mo(i, Oo(i, e.endMonth ? a(e.endMonth) : void 0, {
			ISOWeek: e.ISOWeek,
			fixedWeeks: e.fixedWeeks,
			broadcastCalendar: e.broadcastCalendar
		}, t), {
			broadcastCalendar: e.broadcastCalendar,
			fixedWeeks: e.fixedWeeks,
			ISOWeek: e.ISOWeek,
			reverseMonths: e.reverseMonths
		}, t);
		return {
			months: o,
			weeks: Io(o),
			days: ko(o),
			previousMonth: Fo(c, n, e, t),
			nextMonth: Po(c, r, e, t)
		};
	}, [
		t,
		c.getTime(),
		r?.getTime(),
		n?.getTime(),
		e.disableNavigation,
		e.broadcastCalendar,
		e.endMonth?.getTime(),
		e.fixedWeeks,
		e.ISOWeek,
		e.numberOfMonths,
		e.pagedNavigation,
		e.reverseMonths
	]), { disableNavigation: g, onMonthChange: _ } = e, v = (e) => f.some((t) => t.days.some((t) => t.isEqualTo(e))), y = (e) => {
		if (g) return;
		let t = i(e);
		n && t < i(n) && (t = i(n)), r && t > i(r) && (t = i(r)), u(t), _?.(t);
	};
	return {
		months: d,
		weeks: f,
		days: p,
		navStart: n,
		navEnd: r,
		previousMonth: m,
		nextMonth: h,
		goToMonth: y,
		goToDay: (e) => {
			v(e) || y(e.date);
		}
	};
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/helpers/calculateFocusTarget.js
var zo;
(function(e) {
	e[e.Today = 0] = "Today", e[e.Selected = 1] = "Selected", e[e.LastFocused = 2] = "LastFocused", e[e.FocusedModifier = 3] = "FocusedModifier";
})(zo ||= {});
function Bo(e) {
	return !e[Z.disabled] && !e[Z.hidden] && !e[Z.outside];
}
function Vo(e, t, n, r) {
	let i, a = -1;
	for (let o of e) {
		let e = t(o);
		Bo(e) && (e[Z.focused] && a < zo.FocusedModifier ? (i = o, a = zo.FocusedModifier) : r?.isEqualTo(o) && a < zo.LastFocused ? (i = o, a = zo.LastFocused) : n(o.date) && a < zo.Selected ? (i = o, a = zo.Selected) : e[Z.today] && a < zo.Today && (i = o, a = zo.Today));
	}
	return i ||= e.find((e) => Bo(t(e))), i;
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/helpers/getFocusableDate.js
function Ho(e, t, n, r, i, a, o) {
	let { ISOWeek: s, broadcastCalendar: c } = a, { addDays: l, addMonths: u, addWeeks: d, addYears: f, endOfBroadcastWeek: p, endOfISOWeek: m, endOfWeek: h, max: g, min: _, startOfBroadcastWeek: v, startOfISOWeek: y, startOfWeek: b } = o, x = {
		day: l,
		week: d,
		month: u,
		year: f,
		startOfWeek: (e) => c ? v(e, o) : s ? y(e) : b(e),
		endOfWeek: (e) => c ? p(e) : s ? m(e) : h(e)
	}[e](n, t === "after" ? 1 : -1);
	return t === "before" && r ? x = g([r, x]) : t === "after" && i && (x = _([i, x])), x;
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/helpers/getNextFocus.js
function Uo(e, t, n, r, i, a, o, s = 0) {
	if (s > 365) return;
	let c = Ho(e, t, n.date, r, i, a, o), l = !!(a.disabled && Ra(c, a.disabled, o)), u = !!(a.hidden && Ra(c, a.hidden, o)), d = new Qi(c, c, o);
	return !l && !u ? d : Uo(e, t, d, r, i, a, o, s + 1);
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/useFocus.js
function Wo(e, t, n, r, i) {
	let { autoFocus: a } = e, [o, s] = d(), c = Vo(t.days, n, r || (() => !1), o), [l, u] = d(a ? c : void 0);
	return {
		isFocusTarget: (e) => !!c?.isEqualTo(e),
		setFocused: u,
		focused: l,
		blur: () => {
			s(l), u(void 0);
		},
		moveFocus: (n, r) => {
			if (!l) return;
			let a = Uo(n, r, l, t.navStart, t.navEnd, e, i);
			a && (e.disableNavigation && !t.days.some((e) => e.isEqualTo(a)) || (t.goToDay(a), u(a)));
		}
	};
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/selection/useMulti.js
function Go(e, t) {
	let { selected: n, required: r, onSelect: i } = e, [a, o] = Lo(n, i ? n : void 0), s = i ? n : a, { isSameDay: c } = t, l = (e) => s?.some((t) => c(t, e)) ?? !1, { min: u, max: d } = e;
	return {
		selected: s,
		select: (e, t, n) => {
			let a = [...s ?? []];
			if (l(e)) {
				if (s?.length === u || r && s?.length === 1) return;
				a = s?.filter((t) => !c(t, e));
			} else a = s?.length === d ? [e] : [...a, e];
			return i || o(a), i?.(a, e, t, n), a;
		},
		isSelected: l
	};
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/utils/addToRange.js
function Ko(e, t, n = 0, r = 0, i = !1, a = Zi) {
	let { from: o, to: s } = t || {}, { isSameDay: c, isAfter: l, isBefore: u } = a, d;
	if (!o && !s) d = {
		from: e,
		to: n > 0 ? void 0 : e
	};
	else if (o && !s) d = c(o, e) ? n === 0 ? {
		from: o,
		to: e
	} : i ? {
		from: o,
		to: void 0
	} : void 0 : u(e, o) ? {
		from: e,
		to: o
	} : {
		from: o,
		to: e
	};
	else if (o && s) if (c(o, e) && c(s, e)) d = i ? {
		from: o,
		to: s
	} : void 0;
	else if (c(o, e)) d = {
		from: o,
		to: n > 0 ? void 0 : e
	};
	else if (c(s, e)) d = {
		from: e,
		to: n > 0 ? void 0 : e
	};
	else if (u(e, o)) d = {
		from: e,
		to: s
	};
	else if (l(e, o)) d = {
		from: o,
		to: e
	};
	else if (l(e, s)) d = {
		from: o,
		to: e
	};
	else throw Error("Invalid range");
	if (d?.from && d?.to) {
		let t = a.differenceInCalendarDays(d.to, d.from);
		(r > 0 && t > r || n > 1 && t < n) && (d = {
			from: e,
			to: void 0
		});
	}
	return d;
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/utils/rangeContainsDayOfWeek.js
function qo(e, t, n = Zi) {
	let r = Array.isArray(t) ? t : [t], i = e.from, a = n.differenceInCalendarDays(e.to, e.from), o = Math.min(a, 6);
	for (let e = 0; e <= o; e++) {
		if (r.includes(i.getDay())) return !0;
		i = n.addDays(i, 1);
	}
	return !1;
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/utils/rangeOverlaps.js
function Jo(e, t, n = Zi) {
	return ja(e, t.from, !1, n) || ja(e, t.to, !1, n) || ja(t, e.from, !1, n) || ja(t, e.to, !1, n);
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/utils/rangeContainsModifiers.js
function Yo(e, t, n = Zi) {
	let r = Array.isArray(t) ? t : [t];
	if (r.filter((e) => typeof e != "function").some((t) => typeof t == "boolean" ? t : n.isDate(t) ? ja(e, t, !1, n) : La(t, n) ? t.some((t) => ja(e, t, !1, n)) : Na(t) ? t.from && t.to ? Jo(e, {
		from: t.from,
		to: t.to
	}, n) : !1 : Ia(t) ? qo(e, t.dayOfWeek, n) : Ma(t) ? n.isAfter(t.before, t.after) ? Jo(e, {
		from: n.addDays(t.after, 1),
		to: n.addDays(t.before, -1)
	}, n) : Ra(e.from, t, n) || Ra(e.to, t, n) : Pa(t) || Fa(t) ? Ra(e.from, t, n) || Ra(e.to, t, n) : !1)) return !0;
	let i = r.filter((e) => typeof e == "function");
	if (i.length) {
		let t = e.from, r = n.differenceInCalendarDays(e.to, e.from);
		for (let e = 0; e <= r; e++) {
			if (i.some((e) => e(t))) return !0;
			t = n.addDays(t, 1);
		}
	}
	return !1;
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/selection/useRange.js
function Xo(e, t) {
	let { disabled: n, excludeDisabled: r, resetOnSelect: i, selected: a, required: o, onSelect: s } = e, [c, l] = Lo(a, s ? a : void 0), u = s ? a : c;
	return {
		selected: u,
		select: (a, c, d) => {
			let { min: f, max: p } = e, m;
			if (a) {
				let e = u?.from, n = u?.to, r = !!e && !!n, s = !!e && !!n && t.isSameDay(e, n) && t.isSameDay(a, e);
				m = i && (r || !u?.from) ? !o && s ? void 0 : {
					from: a,
					to: void 0
				} : Ko(a, u, f, p, o, t);
			}
			return r && n && m?.from && m.to && Yo({
				from: m.from,
				to: m.to
			}, n, t) && (m.from = a, m.to = void 0), s || l(m), s?.(m, a, c, d), m;
		},
		isSelected: (e) => u && ja(u, e, !1, t)
	};
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/selection/useSingle.js
function Zo(e, t) {
	let { selected: n, required: r, onSelect: i } = e, [a, o] = Lo(n, i ? n : void 0), s = i ? n : a, { isSameDay: c } = t;
	return {
		selected: s,
		select: (e, t, n) => {
			let a = e;
			return !r && s && s && c(e, s) && (a = void 0), i || o(a), i?.(a, e, t, n), a;
		},
		isSelected: (e) => s ? c(s, e) : !1
	};
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/useSelection.js
function Qo(e, t) {
	let n = Zo(e, t), r = Go(e, t), i = Xo(e, t);
	switch (e.mode) {
		case "single": return n;
		case "multiple": return r;
		case "range": return i;
		default: return;
	}
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/utils/toTimeZone.js
function Q(e, t) {
	return e instanceof lr && e.timeZone === t ? e : new lr(e, t);
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/utils/convertMatchersToTimeZone.js
function $o(e, t, n) {
	if (!n) return Q(e, t);
	let r = Q(e, t), i = new lr(r.getFullYear(), r.getMonth(), r.getDate(), 12, 0, 0, t);
	return new Date(i.getTime());
}
function es(e, t, n) {
	return typeof e == "boolean" || typeof e == "function" ? e : e instanceof Date ? $o(e, t, n) : Array.isArray(e) ? e.map((e) => e instanceof Date ? $o(e, t, n) : e) : Na(e) ? {
		...e,
		from: e.from ? Q(e.from, t) : e.from,
		to: e.to ? Q(e.to, t) : e.to
	} : Ma(e) ? {
		before: $o(e.before, t, n),
		after: $o(e.after, t, n)
	} : Pa(e) ? { after: $o(e.after, t, n) } : Fa(e) ? { before: $o(e.before, t, n) } : e;
}
function ts(e, t, n) {
	return e && (Array.isArray(e) ? e.map((e) => es(e, t, n)) : es(e, t, n));
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/DayPicker.js
function ns(e) {
	let t = e, n = t.timeZone;
	if (n && (t = {
		...e,
		timeZone: n
	}, t.today &&= Q(t.today, n), t.month &&= Q(t.month, n), t.defaultMonth &&= Q(t.defaultMonth, n), t.startMonth &&= Q(t.startMonth, n), t.endMonth &&= Q(t.endMonth, n), t.mode === "single" && t.selected ? t.selected = Q(t.selected, n) : t.mode === "multiple" && t.selected ? t.selected = t.selected?.map((e) => Q(e, n)) : t.mode === "range" && t.selected && (t.selected = {
		from: t.selected.from ? Q(t.selected.from, n) : t.selected.from,
		to: t.selected.to ? Q(t.selected.to, n) : t.selected.to
	}), t.disabled !== void 0 && (t.disabled = ts(t.disabled, n)), t.hidden !== void 0 && (t.hidden = ts(t.hidden, n)), t.modifiers)) {
		let e = {};
		Object.keys(t.modifiers).forEach((r) => {
			e[r] = ts(t.modifiers?.[r], n);
		}), t.modifiers = e;
	}
	let { components: i, formatters: o, labels: s, dateLib: c, locale: d, classNames: f } = l(() => {
		let e = {
			...Xi,
			...t.locale
		}, n = t.broadcastCalendar ? 1 : t.weekStartsOn, r = t.noonSafe && t.timeZone ? yo(t.timeZone, {
			weekStartsOn: n,
			locale: e
		}) : void 0, i = t.dateLib && r ? {
			...r,
			...t.dateLib
		} : t.dateLib ?? r, a = new Y({
			locale: e,
			weekStartsOn: n,
			firstWeekContainsDate: t.firstWeekContainsDate,
			useAdditionalWeekYearTokens: t.useAdditionalWeekYearTokens,
			useAdditionalDayOfYearTokens: t.useAdditionalDayOfYearTokens,
			timeZone: t.timeZone,
			numerals: t.numerals
		}, i);
		return {
			dateLib: a,
			components: Va(t.components),
			formatters: Qa(t.formatters),
			labels: mo(t.labels, a.options),
			locale: e,
			classNames: {
				...Ua(),
				...t.classNames
			}
		};
	}, [
		t.locale,
		t.broadcastCalendar,
		t.weekStartsOn,
		t.firstWeekContainsDate,
		t.useAdditionalWeekYearTokens,
		t.useAdditionalDayOfYearTokens,
		t.timeZone,
		t.numerals,
		t.dateLib,
		t.noonSafe,
		t.components,
		t.formatters,
		t.labels,
		t.classNames
	]);
	t.today || (t = {
		...t,
		today: c.today()
	});
	let { captionLayout: p, mode: m, navLayout: h, numberOfMonths: g = 1, onDayBlur: _, onDayClick: v, onDayFocus: y, onDayKeyDown: b, onDayMouseEnter: x, onDayMouseLeave: S, onNextClick: C, onPrevClick: w, showWeekNumber: T, styles: E } = t, { formatCaption: D, formatDay: ee, formatMonthDropdown: O, formatWeekNumber: k, formatWeekNumberHeader: A, formatWeekdayName: j, formatYearDropdown: M } = o, N = Ro(t, c), { days: P, months: F, navStart: I, navEnd: L, previousMonth: R, nextMonth: z, goToMonth: B } = N, te = za(P, t, I, L, c), { isSelected: V, select: ne, selected: H } = Qo(t, c) ?? {}, { blur: re, focused: ie, isFocusTarget: ae, moveFocus: oe, setFocused: se } = Wo(t, N, te, V ?? (() => !1), c), { labelDayButton: ce, labelGridcell: le, labelGrid: ue, labelMonthDropdown: de, labelNav: U, labelPrevious: fe, labelNext: pe, labelWeekday: me, labelWeekNumber: he, labelWeekNumberHeader: ge, labelYearDropdown: _e } = s, ve = l(() => _o(c, t.ISOWeek, t.broadcastCalendar, t.today), [
		c,
		t.ISOWeek,
		t.broadcastCalendar,
		t.today
	]), ye = m !== void 0 || v !== void 0, be = a(() => {
		R && (B(R), w?.(R));
	}, [
		R,
		B,
		w
	]), xe = a(() => {
		z && (B(z), C?.(z));
	}, [
		B,
		z,
		C
	]), Se = a((e, t) => (n) => {
		n.preventDefault(), n.stopPropagation(), se(e), !t.disabled && (ne?.(e.date, t, n), v?.(e.date, t, n));
	}, [
		ne,
		v,
		se
	]), Ce = a((e, t) => (n) => {
		se(e), y?.(e.date, t, n);
	}, [y, se]), we = a((e, t) => (n) => {
		re(), _?.(e.date, t, n);
	}, [re, _]), Te = a((e, n) => (r) => {
		let i = {
			ArrowLeft: [r.shiftKey ? "month" : "day", t.dir === "rtl" ? "after" : "before"],
			ArrowRight: [r.shiftKey ? "month" : "day", t.dir === "rtl" ? "before" : "after"],
			ArrowDown: [r.shiftKey ? "year" : "week", "after"],
			ArrowUp: [r.shiftKey ? "year" : "week", "before"],
			PageUp: [r.shiftKey ? "year" : "month", "before"],
			PageDown: [r.shiftKey ? "year" : "month", "after"],
			Home: ["startOfWeek", "before"],
			End: ["endOfWeek", "after"]
		};
		if (i[r.key]) {
			r.preventDefault(), r.stopPropagation();
			let [e, t] = i[r.key];
			oe(e, t);
		}
		b?.(e.date, n, r);
	}, [
		oe,
		b,
		t.dir
	]), Ee = a((e, t) => (n) => {
		x?.(e.date, t, n);
	}, [x]), W = a((e, t) => (n) => {
		S?.(e.date, t, n);
	}, [S]), De = a((e, t) => (n) => {
		let r = Number(n.target.value), i = c.setMonth(c.startOfMonth(e), r);
		B(c.addMonths(i, -t));
	}, [c, B]), Oe = a((e, t) => (n) => {
		let r = Number(n.target.value), i = c.setYear(c.startOfMonth(e), r);
		B(c.addMonths(i, -t));
	}, [c, B]), { className: ke, style: Ae } = l(() => ({
		className: [f[X.Root], t.className].filter(Boolean).join(" "),
		style: {
			...E?.[X.Root],
			...t.style
		}
	}), [
		f,
		t.className,
		t.style,
		E
	]), je = Ha(t), Me = (e) => {
		let t = E?.[X.Dropdown], n = E?.[e];
		if (!(!t && !n)) return {
			...t,
			...n
		};
	}, Ne = u(null);
	Do(Ne, !!t.animate, {
		classNames: f,
		months: F,
		focused: ie,
		dateLib: c
	});
	let Pe = {
		dayPickerProps: t,
		selected: H,
		select: ne,
		isSelected: V,
		months: F,
		nextMonth: z,
		previousMonth: R,
		goToMonth: B,
		getModifiers: te,
		components: i,
		classNames: f,
		styles: E,
		labels: s,
		formatters: o
	};
	return r.createElement(sa.Provider, { value: Pe }, r.createElement(i.Root, {
		rootRef: t.animate ? Ne : void 0,
		className: ke,
		style: Ae,
		dir: t.dir,
		id: t.id,
		lang: t.lang ?? d.code,
		nonce: t.nonce,
		title: t.title,
		role: t.role,
		"aria-label": t["aria-label"],
		"aria-labelledby": t["aria-labelledby"],
		...je
	}, r.createElement(i.Months, {
		className: f[X.Months],
		style: E?.[X.Months]
	}, !t.hideNavigation && !h && r.createElement(i.Nav, {
		"data-animated-nav": t.animate ? "true" : void 0,
		className: f[X.Nav],
		style: E?.[X.Nav],
		"aria-label": U(),
		onPreviousClick: be,
		onNextClick: xe,
		previousMonth: R,
		nextMonth: z
	}), F.map((e, n) => {
		let a = t.reverseMonths ? F.length - 1 - n : n;
		return r.createElement(i.Month, {
			"data-animated-month": t.animate ? "true" : void 0,
			className: f[X.Month],
			style: E?.[X.Month],
			key: n,
			displayIndex: n,
			calendarMonth: e
		}, h === "around" && !t.hideNavigation && n === 0 && r.createElement(i.PreviousMonthButton, {
			type: "button",
			className: f[X.PreviousMonthButton],
			style: E?.[X.PreviousMonthButton],
			tabIndex: R ? void 0 : -1,
			"aria-disabled": R ? void 0 : !0,
			"aria-label": fe(R),
			onClick: be,
			"data-animated-button": t.animate ? "true" : void 0
		}, r.createElement(i.Chevron, {
			disabled: R ? void 0 : !0,
			className: f[X.Chevron],
			style: E?.[X.Chevron],
			orientation: t.dir === "rtl" ? "right" : "left"
		})), r.createElement(i.MonthCaption, {
			"data-animated-caption": t.animate ? "true" : void 0,
			className: f[X.MonthCaption],
			style: E?.[X.MonthCaption],
			calendarMonth: e,
			displayIndex: n
		}, p?.startsWith("dropdown") ? r.createElement(i.DropdownNav, {
			className: f[X.Dropdowns],
			style: E?.[X.Dropdowns]
		}, (() => {
			let n = p === "dropdown" || p === "dropdown-months" ? r.createElement(i.MonthsDropdown, {
				key: "month",
				className: f[X.MonthsDropdown],
				"aria-label": de(),
				disabled: !!t.disableNavigation,
				onChange: De(e.date, a),
				options: ho(e.date, I, L, o, c),
				style: Me(X.MonthsDropdown),
				value: c.getMonth(e.date)
			}) : r.createElement("span", { key: "month" }, O(e.date, c)), s = p === "dropdown" || p === "dropdown-years" ? r.createElement(i.YearsDropdown, {
				key: "year",
				className: f[X.YearsDropdown],
				"aria-label": _e(c.options),
				disabled: !!t.disableNavigation,
				onChange: Oe(e.date, a),
				options: vo(I, L, o, c, !!t.reverseYears),
				style: Me(X.YearsDropdown),
				value: c.getYear(e.date)
			}) : r.createElement("span", { key: "year" }, M(e.date, c));
			return c.getMonthYearOrder() === "year-first" ? [s, n] : [n, s];
		})(), r.createElement("span", {
			role: "status",
			"aria-live": "polite",
			style: {
				border: 0,
				clip: "rect(0 0 0 0)",
				height: "1px",
				margin: "-1px",
				overflow: "hidden",
				padding: 0,
				position: "absolute",
				width: "1px",
				whiteSpace: "nowrap",
				wordWrap: "normal"
			}
		}, D(e.date, c.options, c))) : r.createElement(i.CaptionLabel, {
			className: f[X.CaptionLabel],
			style: E?.[X.CaptionLabel],
			role: "status",
			"aria-live": "polite"
		}, D(e.date, c.options, c))), h === "around" && !t.hideNavigation && n === g - 1 && r.createElement(i.NextMonthButton, {
			type: "button",
			className: f[X.NextMonthButton],
			style: E?.[X.NextMonthButton],
			tabIndex: z ? void 0 : -1,
			"aria-disabled": z ? void 0 : !0,
			"aria-label": pe(z),
			onClick: xe,
			"data-animated-button": t.animate ? "true" : void 0
		}, r.createElement(i.Chevron, {
			disabled: z ? void 0 : !0,
			className: f[X.Chevron],
			style: E?.[X.Chevron],
			orientation: t.dir === "rtl" ? "left" : "right"
		})), n === g - 1 && h === "after" && !t.hideNavigation && r.createElement(i.Nav, {
			"data-animated-nav": t.animate ? "true" : void 0,
			className: f[X.Nav],
			style: E?.[X.Nav],
			"aria-label": U(),
			onPreviousClick: be,
			onNextClick: xe,
			previousMonth: R,
			nextMonth: z
		}), r.createElement(i.MonthGrid, {
			role: "grid",
			"aria-multiselectable": m === "multiple" || m === "range",
			"aria-label": ue(e.date, c.options, c) || void 0,
			className: f[X.MonthGrid],
			style: E?.[X.MonthGrid]
		}, !t.hideWeekdays && r.createElement(i.Weekdays, {
			"data-animated-weekdays": t.animate ? "true" : void 0,
			className: f[X.Weekdays],
			style: E?.[X.Weekdays]
		}, T && r.createElement(i.WeekNumberHeader, {
			"aria-label": ge(c.options),
			className: f[X.WeekNumberHeader],
			style: E?.[X.WeekNumberHeader],
			scope: "col"
		}, A()), ve.map((e) => r.createElement(i.Weekday, {
			"aria-label": me(e, c.options, c),
			className: f[X.Weekday],
			key: String(e),
			style: E?.[X.Weekday],
			scope: "col"
		}, j(e, c.options, c)))), r.createElement(i.Weeks, {
			"data-animated-weeks": t.animate ? "true" : void 0,
			className: f[X.Weeks],
			style: E?.[X.Weeks]
		}, e.weeks.map((e) => r.createElement(i.Week, {
			className: f[X.Week],
			key: e.weekNumber,
			style: E?.[X.Week],
			week: e
		}, T && r.createElement(i.WeekNumber, {
			week: e,
			style: E?.[X.WeekNumber],
			"aria-label": he(e.weekNumber, { locale: d }),
			className: f[X.WeekNumber],
			scope: "row",
			role: "rowheader"
		}, k(e.weekNumber, c)), e.days.map((e) => {
			let { date: n } = e, a = te(e);
			if (a[Z.focused] = !a.hidden && !!ie?.isEqualTo(e), a[aa.selected] = V?.(n) || a.selected, Na(H)) {
				let { from: e, to: t } = H;
				a[aa.range_start] = !!(e && t && c.isSameDay(n, e)), a[aa.range_end] = !!(e && t && c.isSameDay(n, t)), a[aa.range_middle] = ja(H, n, !0, c);
			}
			let o = go(a, E, t.modifiersStyles), s = Ba(a, f, t.modifiersClassNames), l = !ye && !a.hidden ? le(n, a, c.options, c) : void 0;
			return r.createElement(i.Day, {
				key: `${e.isoDate}_${e.displayMonthId}`,
				day: e,
				modifiers: a,
				className: s.join(" "),
				style: o,
				role: "gridcell",
				"aria-selected": a.selected || void 0,
				"aria-label": l,
				"data-day": e.isoDate,
				"data-month": e.outside ? e.dateMonthId : void 0,
				"data-selected": a.selected || void 0,
				"data-disabled": a.disabled || void 0,
				"data-hidden": a.hidden || void 0,
				"data-outside": e.outside || void 0,
				"data-focused": a.focused || void 0,
				"data-today": a.today || void 0
			}, !a.hidden && ye ? r.createElement(i.DayButton, {
				className: f[X.DayButton],
				style: E?.[X.DayButton],
				type: "button",
				day: e,
				modifiers: a,
				disabled: !a.focused && a.disabled || void 0,
				"aria-disabled": a.focused && a.disabled || void 0,
				tabIndex: ae(e) ? 0 : -1,
				"aria-label": ce(n, a, c.options, c),
				onClick: Se(e, a),
				onBlur: we(e, a),
				onFocus: Ce(e, a),
				onKeyDown: Te(e, a),
				onMouseEnter: Ee(e, a),
				onMouseLeave: W(e, a)
			}, ee(n, c.options, c)) : !a.hidden && ee(e.date, c.options, c));
		}))))));
	})), t.footer && r.createElement(i.Footer, {
		className: f[X.Footer],
		style: E?.[X.Footer],
		role: "status",
		"aria-live": "polite"
	}, t.footer)));
}
//#endregion
//#region node_modules/react-day-picker/dist/esm/locale/ja.js
var rs = {
	...Yi,
	labels: {
		labelDayButton: (e, t, n, r) => {
			let i = (r ?? new Y(n)).format(e, "PPPP");
			return t.today && (i = `今日、${i}`), t.selected && (i = `${i}、選択済み`), i;
		},
		labelMonthDropdown: "月を選択",
		labelNext: "次の月へ",
		labelPrevious: "前の月へ",
		labelWeekNumber: (e) => `第${e}週`,
		labelYearDropdown: "年を選択",
		labelGrid: (e, t, n) => (n ?? new Y(t)).formatMonthYear(e),
		labelGridcell: (e, t, n, r) => {
			let i = (r ?? new Y(n)).format(e, "PPPP");
			return t?.today && (i = `今日、${i}`), i;
		},
		labelNav: "ナビゲーションバー",
		labelWeekNumberHeader: "週番号",
		labelWeekday: (e, t, n) => (n ?? new Y(t)).format(e, "cccc")
	}
};
//#endregion
//#region src/components/ui/calendar.tsx
function is({ className: e, classNames: t, showOutsideDays: n = !0, ...r }) {
	return /* @__PURE__ */ N(ns, {
		"data-slot": "calendar",
		showOutsideDays: n,
		locale: rs,
		className: U("p-4", e),
		classNames: {
			root: "relative w-fit",
			months: "flex flex-col sm:flex-row gap-4",
			month: "flex flex-col gap-4",
			month_caption: "flex justify-center pt-1 items-center h-9",
			caption_label: "typo-label-md text-[var(--Text-High-Emphasis)]",
			nav: "absolute top-4 inset-x-0 z-10",
			button_previous: U("absolute left-1 top-0 h-7 w-7 flex items-center justify-center rounded-lg", "text-[var(--Object-Medium-Emphasis)] hover:text-[var(--Object-High-Emphasis)]", "hover:bg-[var(--Surface-Secondary)] transition-colors"),
			button_next: U("absolute right-1 top-0 h-7 w-7 flex items-center justify-center rounded-lg", "text-[var(--Object-Medium-Emphasis)] hover:text-[var(--Object-High-Emphasis)]", "hover:bg-[var(--Surface-Secondary)] transition-colors"),
			month_grid: "w-full border-collapse",
			weekdays: "flex",
			weekday: "text-[var(--Text-Low-Emphasis)] typo-label-xs w-9 font-normal text-center",
			week: "flex w-full mt-2",
			day: "h-9 w-9 text-center relative p-0 focus-within:relative focus-within:z-20 text-[var(--Text-High-Emphasis)]",
			day_button: U("h-9 w-9 typo-body-sm rounded-full transition-colors text-[var(--Text-High-Emphasis)]", "hover:bg-[var(--Surface-Secondary)] hover:text-[var(--Text-High-Emphasis)]", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--Focus-High-Emphasis)]"),
			selected: "[&>button]:bg-[var(--Brand-Primary)] [&>button]:text-[var(--Text-on-Inverse)] [&>button]:hover:bg-[var(--Brand-Primary)] [&>button]:hover:text-[var(--Text-on-Inverse)]",
			range_start: "bg-[var(--Brand-Ultra-Light)]",
			range_end: "bg-[var(--Brand-Ultra-Light)]",
			range_middle: "bg-[var(--Brand-Ultra-Light)] [&>button]:bg-transparent! [&>button]:text-[var(--Text-High-Emphasis)]! [&>button]:rounded-none [&>button]:hover:bg-[var(--Brand-Ultra-Light)]!",
			today: "[&>button]:text-[var(--Brand-Primary)]",
			outside: "opacity-30",
			disabled: "text-[var(--Text-Low-Emphasis)] opacity-50",
			hidden: "invisible",
			...t
		},
		components: { Chevron: ({ orientation: e }) => /* @__PURE__ */ N("svg", {
			width: "16",
			height: "16",
			viewBox: "0 0 16 16",
			fill: "none",
			className: U(e === "left" ? "rotate-90" : "-rotate-90"),
			children: /* @__PURE__ */ N("path", {
				d: "M4 6l4 4 4-4",
				stroke: "currentColor",
				strokeWidth: "1.5",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			})
		}) },
		...r
	});
}
//#endregion
//#region src/components/ui/popover.tsx
function as({ ...e }) {
	return /* @__PURE__ */ N(x.Root, {
		"data-slot": "popover",
		...e
	});
}
function os({ ...e }) {
	return /* @__PURE__ */ N(x.Trigger, {
		"data-slot": "popover-trigger",
		...e
	});
}
function ss({ className: e, align: t = "center", sideOffset: n = 4, ...r }) {
	return /* @__PURE__ */ N(x.Portal, { children: /* @__PURE__ */ N(x.Content, {
		"data-slot": "popover-content",
		align: t,
		sideOffset: n,
		className: U("z-50 w-72 rounded-[var(--Radius-Surface)] border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)] p-4 shadow-[var(--shadow-lg)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50", "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95", "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95", e),
		...r
	}) });
}
function cs({ ...e }) {
	return /* @__PURE__ */ N(x.Anchor, {
		"data-slot": "popover-anchor",
		...e
	});
}
//#endregion
//#region src/components/ui/date-picker.tsx
function ls(e, t) {
	let n = e.getFullYear(), r = e.getMonth() + 1, i = e.getDate(), a = e.getDay(), o = {
		yyyy: String(n),
		MM: String(r).padStart(2, "0"),
		M: String(r),
		dd: String(i).padStart(2, "0"),
		d: String(i),
		EEEE: `${[
			"日",
			"月",
			"火",
			"水",
			"木",
			"金",
			"土"
		][a]}曜日`,
		EEE: [
			"日",
			"月",
			"火",
			"水",
			"木",
			"金",
			"土"
		][a]
	};
	return t.replace(/yyyy|EEEE|EEE|MM|M|dd|d/g, (e) => o[e]);
}
var us = /* @__PURE__ */ P("svg", {
	width: "16",
	height: "16",
	viewBox: "0 0 16 16",
	fill: "none",
	className: "text-[var(--Object-Medium-Emphasis)] shrink-0",
	"aria-hidden": !0,
	children: [
		/* @__PURE__ */ N("rect", {
			x: "2",
			y: "3",
			width: "12",
			height: "11",
			rx: "1.5",
			stroke: "currentColor",
			strokeWidth: "1.5"
		}),
		/* @__PURE__ */ N("path", {
			d: "M2 7h12",
			stroke: "currentColor",
			strokeWidth: "1.5"
		}),
		/* @__PURE__ */ N("path", {
			d: "M5 1v2M11 1v2",
			stroke: "currentColor",
			strokeWidth: "1.5",
			strokeLinecap: "round"
		})
	]
});
function ds(e, t, n) {
	return U("flex h-12 w-full items-center justify-between rounded-lg border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] px-3 typo-body-md transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50", e ? "border-[var(--Border-Accent-Primary)] ring-[3px] ring-[var(--Focus-High-Emphasis)]/50" : "border-[var(--Border-Medium-Emphasis)] hover:border-[var(--Border-High-Emphasis)]", "disabled:cursor-not-allowed disabled:opacity-50", t ? "text-[var(--Text-High-Emphasis)]" : "text-[var(--Text-Low-Emphasis)]", n);
}
function fs({ id: e, value: t, onChange: r, placeholder: i = "日付を選択", disabled: a = !1, className: o, dateFormat: s = "yyyy/MM/dd", triggerLabel: c, defaultMonth: l, min: u, max: d, "aria-describedby": f, "aria-invalid": p }) {
	let [m, h] = n.useState(!1), g = t ? ls(t, s) : null, _ = n.useRef(!1);
	return /* @__PURE__ */ P(as, {
		open: m,
		onOpenChange: h,
		children: [/* @__PURE__ */ N(os, {
			asChild: !0,
			children: /* @__PURE__ */ P("button", {
				id: e,
				type: "button",
				"data-slot": "date-picker-trigger",
				disabled: a,
				"aria-expanded": m,
				"aria-label": c ?? (g ? void 0 : i),
				"aria-describedby": f,
				"aria-invalid": p,
				className: ds(m, !!g, o),
				children: [/* @__PURE__ */ N("span", { children: g ?? i }), us]
			})
		}), /* @__PURE__ */ N(ss, {
			className: "w-auto p-0",
			align: "start",
			onPointerDownCapture: () => {
				_.current = !0;
			},
			onCloseAutoFocus: (e) => {
				_.current && (_.current = !1, e.preventDefault(), document.activeElement instanceof HTMLElement && document.activeElement.blur());
			},
			children: /* @__PURE__ */ N(is, {
				mode: "single",
				selected: t,
				defaultMonth: l ?? t ?? void 0,
				startMonth: u,
				endMonth: d,
				disabled: [...u ? [{ before: u }] : [], ...d ? [{ after: d }] : []],
				onSelect: (e) => {
					r?.(e), h(!1);
				},
				autoFocus: !0
			})
		})]
	});
}
function ps({ value: e, onChange: t, placeholder: r = "期間を選択", disabled: i = !1, className: a, dateFormat: o = "yyyy/MM/dd", triggerLabel: s, defaultMonth: c }) {
	let [l, u] = n.useState(!1), d = e?.from ? e.to ? `${ls(e.from, o)} 〜 ${ls(e.to, o)}` : ls(e.from, o) : null;
	return /* @__PURE__ */ P(as, {
		open: l,
		onOpenChange: u,
		children: [/* @__PURE__ */ N(os, {
			asChild: !0,
			children: /* @__PURE__ */ P("button", {
				type: "button",
				"data-slot": "date-range-picker-trigger",
				disabled: i,
				"aria-expanded": l,
				"aria-label": s ?? r,
				className: ds(l, !!d, a),
				children: [/* @__PURE__ */ N("span", { children: d ?? r }), us]
			})
		}), /* @__PURE__ */ N(ss, {
			className: "w-auto p-0",
			align: "start",
			children: /* @__PURE__ */ N(is, {
				mode: "range",
				selected: e?.from ? {
					from: e.from,
					to: e.to
				} : void 0,
				defaultMonth: c ?? e?.from ?? void 0,
				onSelect: (e) => t?.(e ? {
					from: e.from,
					to: e.to
				} : void 0),
				numberOfMonths: 2,
				autoFocus: !0
			})
		})]
	});
}
//#endregion
//#region src/components/ui/date-field.tsx
function ms(e) {
	if (!e) return;
	let t = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e);
	if (!t) return;
	let n = Number(t[1]), r = Number(t[2]), i = Number(t[3]), a = new Date(n, r - 1, i);
	if (!(a.getFullYear() !== n || a.getMonth() !== r - 1 || a.getDate() !== i)) return a;
}
function hs(e) {
	return !e || isNaN(e.getTime()) ? "" : `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
}
function gs({ value: e, onChange: t, placeholder: r, disabled: i, className: a, dateFormat: o }) {
	let s = n.useMemo(() => ms(e), [e]);
	return /* @__PURE__ */ N("div", {
		"data-slot": "date-field",
		className: U("w-full [&>button]:w-full [&>button]:h-12 [&>button]:rounded-lg [&>button]:px-3", a),
		children: /* @__PURE__ */ N(fs, {
			value: s,
			onChange: (e) => t(hs(e)),
			placeholder: r,
			disabled: i,
			dateFormat: o
		})
	});
}
//#endregion
//#region src/components/ui/time-picker.tsx
function _s(e) {
	return String(e).padStart(2, "0");
}
function vs(e) {
	if (!e) return null;
	let [t, n] = e.split(":"), r = parseInt(t, 10), i = parseInt(n, 10);
	return isNaN(r) || isNaN(i) ? null : {
		h: Math.min(23, Math.max(0, r)),
		m: Math.min(59, Math.max(0, i))
	};
}
var ys = /* @__PURE__ */ P("svg", {
	width: "16",
	height: "16",
	viewBox: "0 0 16 16",
	fill: "none",
	className: "text-[var(--Object-Medium-Emphasis)] shrink-0",
	"aria-hidden": !0,
	children: [/* @__PURE__ */ N("circle", {
		cx: "8",
		cy: "8",
		r: "6",
		stroke: "currentColor",
		strokeWidth: "1.5"
	}), /* @__PURE__ */ N("path", {
		d: "M8 5v3.5l2 1.5",
		stroke: "currentColor",
		strokeWidth: "1.5",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	})]
});
function bs({ items: e, selected: t, onSelect: r }) {
	let i = n.useRef(null);
	return n.useEffect(() => {
		(i.current?.querySelector("[data-selected=\"true\"]"))?.scrollIntoView({
			block: "center",
			behavior: "smooth"
		});
	}, [t]), /* @__PURE__ */ N("div", {
		ref: i,
		className: "flex flex-col overflow-y-auto h-48 scrollbar-hide snap-y snap-mandatory",
		children: e.map((e) => /* @__PURE__ */ N("button", {
			type: "button",
			"data-selected": e === t,
			onClick: () => r(e),
			className: U("shrink-0 h-10 flex items-center justify-center rounded-lg typo-body-md transition-colors snap-center", e === t ? "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)]" : "text-[var(--Text-High-Emphasis)] hover:bg-[var(--Surface-Secondary)]"),
			children: _s(e)
		}, e))
	});
}
function xs({ id: e, value: t, onChange: r, placeholder: i = "時刻を選択", disabled: a = !1, minuteStep: o = 1, className: s, triggerLabel: c, "aria-describedby": l, "aria-invalid": u }) {
	let [d, f] = n.useState(!1), p = vs(t), m = Array.from({ length: 24 }, (e, t) => t), h = Array.from({ length: Math.ceil(60 / o) }, (e, t) => t * o), g = p?.h ?? 0, _ = p?.m ?? 0, v = (e) => r?.(`${_s(e)}:${_s(_)}`), y = (e) => r?.(`${_s(g)}:${_s(e)}`), b = p ? `${_s(p.h)}:${_s(p.m)}` : null;
	return /* @__PURE__ */ P(as, {
		open: d,
		onOpenChange: f,
		children: [/* @__PURE__ */ N(os, {
			asChild: !0,
			children: /* @__PURE__ */ P("button", {
				id: e,
				type: "button",
				"data-slot": "time-picker-trigger",
				disabled: a,
				"aria-expanded": d,
				"aria-label": c ?? (b ? void 0 : i),
				"aria-describedby": l,
				"aria-invalid": u,
				className: U("flex h-12 w-full items-center justify-between rounded-lg border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] px-3 typo-body-md transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50", d ? "border-[var(--Border-Accent-Primary)] ring-[3px] ring-[var(--Focus-High-Emphasis)]/50" : "border-[var(--Border-Medium-Emphasis)] hover:border-[var(--Border-High-Emphasis)]", "disabled:cursor-not-allowed disabled:opacity-50", b ? "text-[var(--Text-High-Emphasis)]" : "text-[var(--Text-Low-Emphasis)]", s),
				children: [/* @__PURE__ */ N("span", { children: b ?? i }), ys]
			})
		}), /* @__PURE__ */ N(ss, {
			className: "w-44 p-3",
			align: "start",
			children: /* @__PURE__ */ P("div", {
				className: "flex gap-2 items-start",
				children: [
					/* @__PURE__ */ P("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ N("div", {
							className: "typo-label-xs text-[var(--Text-Low-Emphasis)] text-center mb-1",
							children: "時"
						}), /* @__PURE__ */ N(bs, {
							items: m,
							selected: g,
							onSelect: v
						})]
					}),
					/* @__PURE__ */ N("div", {
						className: "flex items-center justify-center h-48 typo-heading-md text-[var(--Text-Low-Emphasis)] select-none pt-6",
						children: ":"
					}),
					/* @__PURE__ */ P("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ N("div", {
							className: "typo-label-xs text-[var(--Text-Low-Emphasis)] text-center mb-1",
							children: "分"
						}), /* @__PURE__ */ N(bs, {
							items: h,
							selected: _,
							onSelect: y
						})]
					})
				]
			})
		})]
	});
}
//#endregion
//#region src/components/ui/date-time-picker.tsx
function Ss(e, t, n) {
	return t && e < t ? new Date(t) : n && e > n ? new Date(n) : e;
}
function Cs(e, t, n, r) {
	let i = new Date(t);
	return e && !Number.isNaN(e.getTime()) ? i.setHours(e.getHours(), e.getMinutes(), e.getSeconds(), e.getMilliseconds()) : i.setHours(0, 0, 0, 0), Ss(i, n, r);
}
function ws(e, t, n, r) {
	let [i, a] = t.split(":").map(Number), o = new Date(e);
	return o.setHours(i, a, e.getSeconds(), e.getMilliseconds()), Ss(o, n, r);
}
function Ts({ id: e, value: t, onChange: n, minuteStep: r = 5, min: i, max: a, disabled: o = !1, datePlaceholder: s = "日付を選択", timePlaceholder: c = "時刻を選択", dateTriggerLabel: l, timeTriggerLabel: u, className: d, "aria-describedby": f, "aria-invalid": p, ...m }) {
	let h = t ? `${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}` : void 0;
	return /* @__PURE__ */ P("div", {
		"data-slot": "date-time-picker",
		className: U("grid grid-cols-[minmax(0,1fr)_8rem] gap-2", d),
		...m,
		children: [/* @__PURE__ */ N(fs, {
			id: e,
			value: t,
			onChange: (e) => {
				n?.(e ? Cs(t, e, i, a) : void 0);
			},
			placeholder: s,
			triggerLabel: l,
			dateFormat: "M月d日（EEE）",
			min: i,
			max: a,
			disabled: o,
			"aria-describedby": f,
			"aria-invalid": p
		}), /* @__PURE__ */ N(xs, {
			id: e ? `${e}-time` : void 0,
			value: h,
			onChange: (e) => {
				t && n?.(ws(t, e, i, a));
			},
			placeholder: c,
			triggerLabel: u,
			minuteStep: r,
			disabled: o || !t,
			"aria-describedby": f,
			"aria-invalid": p
		})]
	});
}
//#endregion
//#region src/components/ui/combobox.tsx
function Es({ options: e, value: t, onChange: r, placeholder: i = "選択してください", searchPlaceholder: a = "検索...", emptyLabel: o = "該当なし", disabled: s = !1, className: c, triggerLabel: l }) {
	let [u, d] = n.useState(!1), [f, p] = n.useState(""), m = n.useRef(null), h = e.find((e) => e.value === t), g = f.trim() ? e.filter((e) => e.label.toLowerCase().includes(f.toLowerCase())) : e, _ = (e) => {
		e.disabled || (r?.(e.value), d(!1), p(""));
	};
	return /* @__PURE__ */ P(as, {
		open: u,
		onOpenChange: (e) => {
			d(e), e || p("");
		},
		children: [/* @__PURE__ */ N(os, {
			asChild: !0,
			children: /* @__PURE__ */ P("button", {
				"data-slot": "combobox-trigger",
				disabled: s,
				"aria-expanded": u,
				"aria-label": l ?? i,
				className: U("flex h-12 w-full items-center justify-between rounded-lg border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] px-3 typo-body-md transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50", u ? "border-[var(--Border-Accent-Primary)] ring-[3px] ring-[var(--Focus-High-Emphasis)]/50" : "border-[var(--Border-Medium-Emphasis)] hover:border-[var(--Border-High-Emphasis)]", "disabled:cursor-not-allowed disabled:opacity-50", h ? "text-[var(--Text-High-Emphasis)]" : "text-[var(--Text-Low-Emphasis)]", c),
				children: [/* @__PURE__ */ N("span", { children: h ? h.label : i }), /* @__PURE__ */ N("svg", {
					width: "16",
					height: "16",
					viewBox: "0 0 16 16",
					fill: "none",
					className: U("shrink-0 text-[var(--Object-Medium-Emphasis)] transition-transform", u && "rotate-180"),
					"aria-hidden": !0,
					children: /* @__PURE__ */ N("path", {
						d: "M4 6L8 10L12 6",
						stroke: "currentColor",
						strokeWidth: "2",
						strokeLinecap: "round",
						strokeLinejoin: "round"
					})
				})]
			})
		}), /* @__PURE__ */ P(ss, {
			className: "w-[var(--radix-popover-trigger-width)] p-0",
			align: "start",
			onOpenAutoFocus: (e) => {
				e.preventDefault(), m.current?.focus();
			},
			children: [/* @__PURE__ */ P("div", {
				className: "flex items-center border-b border-[var(--Border-Low-Emphasis)] px-3 gap-2",
				children: [/* @__PURE__ */ P("svg", {
					width: "14",
					height: "14",
					viewBox: "0 0 16 16",
					fill: "none",
					className: "text-[var(--Object-Low-Emphasis)] shrink-0",
					"aria-hidden": !0,
					children: [/* @__PURE__ */ N("circle", {
						cx: "7",
						cy: "7",
						r: "5",
						stroke: "currentColor",
						strokeWidth: "1.5"
					}), /* @__PURE__ */ N("path", {
						d: "M11 11L14 14",
						stroke: "currentColor",
						strokeWidth: "1.5",
						strokeLinecap: "round"
					})]
				}), /* @__PURE__ */ N("input", {
					ref: m,
					value: f,
					onChange: (e) => p(e.target.value),
					placeholder: a,
					className: "flex h-10 flex-1 bg-transparent focus-visible:outline-none typo-body-md text-[var(--Text-High-Emphasis)] placeholder:text-[var(--Text-Low-Emphasis)]"
				})]
			}), /* @__PURE__ */ N("div", {
				role: "listbox",
				className: "max-h-60 overflow-y-auto p-1",
				children: g.length === 0 ? /* @__PURE__ */ N("div", {
					className: "py-6 text-center typo-body-sm text-[var(--Text-Low-Emphasis)]",
					children: o
				}) : g.map((e) => /* @__PURE__ */ P("button", {
					role: "option",
					"aria-selected": e.value === t,
					disabled: e.disabled,
					onClick: () => _(e),
					className: U("relative flex w-full cursor-default items-center rounded-sm py-2 pl-8 pr-2 typo-body-md focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50 transition-colors text-left", "hover:bg-[var(--Surface-Secondary)] focus:bg-[var(--Surface-Secondary)]", "disabled:pointer-events-none disabled:opacity-50", e.value === t && "text-[var(--Text-Accent-Primary)]"),
					children: [e.value === t && /* @__PURE__ */ N("span", {
						className: "absolute left-2 flex size-4 items-center justify-center",
						children: /* @__PURE__ */ N("svg", {
							width: "12",
							height: "12",
							viewBox: "0 0 12 12",
							fill: "none",
							children: /* @__PURE__ */ N("path", {
								d: "M10 3L4.5 8.5L2 6",
								stroke: "currentColor",
								strokeWidth: "2",
								strokeLinecap: "round",
								strokeLinejoin: "round"
							})
						})
					}), e.label]
				}, e.value))
			})]
		})]
	});
}
//#endregion
//#region src/components/ui/scroll-area.tsx
function Ds({ className: e, children: t, ...n }) {
	return /* @__PURE__ */ P(w.Root, {
		"data-slot": "scroll-area",
		className: U("relative overflow-hidden", e),
		...n,
		children: [
			/* @__PURE__ */ N(w.Viewport, {
				className: "size-full rounded-[inherit]",
				children: t
			}),
			/* @__PURE__ */ N(Os, {}),
			/* @__PURE__ */ N(w.Corner, {})
		]
	});
}
function Os({ className: e, orientation: t = "vertical", ...n }) {
	return /* @__PURE__ */ N(w.ScrollAreaScrollbar, {
		"data-slot": "scroll-bar",
		orientation: t,
		className: U("flex touch-none select-none transition-colors", t === "vertical" && "h-full w-2.5 border-l border-l-transparent p-px", t === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-px", e),
		...n,
		children: /* @__PURE__ */ N(w.ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-[var(--Border-Medium-Emphasis)]" })
	});
}
//#endregion
//#region src/components/ui/multi-select.tsx
function ks({ options: e, value: t = [], onChange: r, placeholder: i = "選択してください", searchPlaceholder: a = "検索...", emptyLabel: o = "該当なし", disabled: s = !1, className: c, maxDisplay: l = 3, clearable: u = !0 }) {
	let [d, f] = n.useState(!1), [p, m] = n.useState(""), h = n.useRef(null), g = p.trim() ? e.filter((e) => e.label.toLowerCase().includes(p.toLowerCase())) : e, _ = (e) => {
		t.includes(e) ? r?.(t.filter((t) => t !== e)) : r?.([...t, e]);
	}, v = t.map((t) => e.find((e) => e.value === t)?.label).filter(Boolean), y = v.slice(0, l), b = v.length - y.length, x = u && t.length > 0 && !s;
	return /* @__PURE__ */ P(as, {
		open: d,
		onOpenChange: (e) => {
			f(e), e || m("");
		},
		children: [/* @__PURE__ */ P("div", {
			className: "relative w-full",
			children: [/* @__PURE__ */ N(os, {
				asChild: !0,
				children: /* @__PURE__ */ P("button", {
					type: "button",
					"data-slot": "multi-select-trigger",
					disabled: s,
					"aria-expanded": d,
					"aria-haspopup": "listbox",
					className: U("relative flex min-h-12 w-full flex-wrap items-center gap-1.5 rounded-lg border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] px-3 py-2 pr-10 typo-body-md transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50 text-left", x && "pr-16", d ? "border-[var(--Border-Accent-Primary)] ring-[3px] ring-[var(--Focus-High-Emphasis)]/50" : "border-[var(--Border-Medium-Emphasis)] hover:border-[var(--Border-High-Emphasis)]", "disabled:cursor-not-allowed disabled:opacity-50", c),
					children: [t.length === 0 ? /* @__PURE__ */ N("span", {
						className: "text-[var(--Text-Low-Emphasis)] flex-1",
						children: i
					}) : /* @__PURE__ */ P(M, { children: [
						y.map((e) => /* @__PURE__ */ N("span", {
							className: "inline-flex items-center gap-1 h-6 px-2 rounded-full bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)] typo-label-xs",
							children: e
						}, e)),
						b > 0 && /* @__PURE__ */ P("span", {
							className: "inline-flex items-center h-6 px-2 rounded-full bg-[var(--Surface-Tertiary)] text-[var(--Text-Medium-Emphasis)] typo-label-xs",
							children: ["+", b]
						}),
						/* @__PURE__ */ N("span", { className: "flex-1" })
					] }), /* @__PURE__ */ N("span", {
						className: "pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center",
						children: /* @__PURE__ */ N("svg", {
							width: "16",
							height: "16",
							viewBox: "0 0 16 16",
							fill: "none",
							className: U("text-[var(--Object-Medium-Emphasis)] transition-transform", d && "rotate-180"),
							"aria-hidden": !0,
							children: /* @__PURE__ */ N("path", {
								d: "M4 6L8 10L12 6",
								stroke: "currentColor",
								strokeWidth: "2",
								strokeLinecap: "round",
								strokeLinejoin: "round"
							})
						})
					})]
				})
			}), x && /* @__PURE__ */ N("button", {
				type: "button",
				"data-slot": "multi-select-clear",
				"aria-label": "選択をクリア",
				onClick: () => r?.([]),
				className: "absolute right-9 top-1/2 z-[1] flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-[var(--Object-Low-Emphasis)] transition-colors hover:bg-[var(--Surface-Secondary)] hover:text-[var(--Object-High-Emphasis)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--Focus-High-Emphasis)]",
				children: /* @__PURE__ */ N("svg", {
					width: "10",
					height: "10",
					viewBox: "0 0 10 10",
					fill: "none",
					"aria-hidden": !0,
					children: /* @__PURE__ */ N("path", {
						d: "M1 1L9 9M9 1L1 9",
						stroke: "currentColor",
						strokeWidth: "2.5",
						strokeLinecap: "round"
					})
				})
			})]
		}), /* @__PURE__ */ P(ss, {
			className: "w-[var(--radix-popover-trigger-width)] p-0",
			align: "start",
			onOpenAutoFocus: (e) => {
				e.preventDefault(), h.current?.focus();
			},
			children: [/* @__PURE__ */ P("div", {
				className: "flex items-center border-b border-[var(--Border-Low-Emphasis)] px-3 gap-2",
				children: [/* @__PURE__ */ P("svg", {
					width: "14",
					height: "14",
					viewBox: "0 0 16 16",
					fill: "none",
					className: "text-[var(--Object-Low-Emphasis)] shrink-0",
					"aria-hidden": !0,
					children: [/* @__PURE__ */ N("circle", {
						cx: "7",
						cy: "7",
						r: "5",
						stroke: "currentColor",
						strokeWidth: "1.5"
					}), /* @__PURE__ */ N("path", {
						d: "M11 11L14 14",
						stroke: "currentColor",
						strokeWidth: "1.5",
						strokeLinecap: "round"
					})]
				}), /* @__PURE__ */ N("input", {
					ref: h,
					value: p,
					onChange: (e) => m(e.target.value),
					placeholder: a,
					className: "flex h-10 flex-1 bg-transparent focus-visible:outline-none typo-body-md text-[var(--Text-High-Emphasis)] placeholder:text-[var(--Text-Low-Emphasis)]"
				})]
			}), /* @__PURE__ */ N(Ds, {
				type: "always",
				className: "max-h-60",
				children: /* @__PURE__ */ N("div", {
					role: "listbox",
					"aria-multiselectable": "true",
					className: "p-1",
					children: g.length === 0 ? /* @__PURE__ */ N("div", {
						className: "py-6 text-center typo-body-sm text-[var(--Text-Low-Emphasis)]",
						children: o
					}) : g.map((e) => {
						let n = t.includes(e.value);
						return /* @__PURE__ */ P("button", {
							role: "option",
							"aria-selected": n,
							disabled: e.disabled,
							onClick: () => _(e.value),
							className: U("relative flex w-full cursor-default items-center gap-3 rounded-sm py-2 px-3 typo-body-md focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50 transition-colors text-left", "hover:bg-[var(--Surface-Secondary)] focus:bg-[var(--Surface-Secondary)]", "disabled:pointer-events-none disabled:opacity-50"),
							children: [/* @__PURE__ */ N("span", {
								className: U("flex size-4 shrink-0 items-center justify-center rounded border border-[var(--Border-Medium-Emphasis)] transition-colors", n ? "bg-[var(--Brand-Primary)] border-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)]" : "border-[var(--Border-Medium-Emphasis)]"),
								children: n && /* @__PURE__ */ N("svg", {
									width: "10",
									height: "10",
									viewBox: "0 0 10 10",
									fill: "none",
									children: /* @__PURE__ */ N("path", {
										d: "M8.5 2L4 7L1.5 4.5",
										stroke: "currentColor",
										strokeWidth: "1.5",
										strokeLinecap: "round",
										strokeLinejoin: "round"
									})
								})
							}), e.label]
						}, e.value);
					})
				})
			})]
		})]
	});
}
//#endregion
//#region src/components/ui/pagination.tsx
function As({ className: e, ...t }) {
	return /* @__PURE__ */ N("nav", {
		role: "navigation",
		"aria-label": "ページネーション",
		"data-slot": "pagination",
		className: U("mx-auto flex w-full justify-center", e),
		...t
	});
}
function js({ className: e, ...t }) {
	return /* @__PURE__ */ N("ul", {
		"data-slot": "pagination-content",
		className: U("flex flex-row flex-wrap items-center justify-center gap-1", e),
		...t
	});
}
function Ms({ ...e }) {
	return /* @__PURE__ */ N("li", {
		"data-slot": "pagination-item",
		...e
	});
}
function Ns({ className: e, isActive: n, size: r = "icon", ...i }) {
	return /* @__PURE__ */ N("a", {
		"aria-current": n ? "page" : void 0,
		"data-slot": "pagination-link",
		className: U(t({
			variant: n ? "default" : "ghost",
			size: r
		}), e),
		...i
	});
}
function Ps({ className: e, label: t = "前へ", ...n }) {
	return /* @__PURE__ */ P(Ns, {
		"aria-label": t,
		size: "default",
		className: U("gap-1 pl-2.5", e),
		...n,
		children: [/* @__PURE__ */ N("svg", {
			width: "16",
			height: "16",
			viewBox: "0 0 16 16",
			fill: "none",
			children: /* @__PURE__ */ N("path", {
				d: "M10 12L6 8L10 4",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			})
		}), /* @__PURE__ */ N("span", { children: t })]
	});
}
function Fs({ className: e, label: t = "次へ", ...n }) {
	return /* @__PURE__ */ P(Ns, {
		"aria-label": t,
		size: "default",
		className: U("gap-1 pr-2.5", e),
		...n,
		children: [/* @__PURE__ */ N("span", { children: t }), /* @__PURE__ */ N("svg", {
			width: "16",
			height: "16",
			viewBox: "0 0 16 16",
			fill: "none",
			children: /* @__PURE__ */ N("path", {
				d: "M6 4L10 8L6 12",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			})
		})]
	});
}
function Is({ className: e, label: t = "その他のページ", ...n }) {
	return /* @__PURE__ */ P("span", {
		"aria-hidden": !0,
		"data-slot": "pagination-ellipsis",
		className: U("flex size-10 items-center justify-center text-[var(--Text-Medium-Emphasis)]", e),
		...n,
		children: [/* @__PURE__ */ P("svg", {
			width: "16",
			height: "16",
			viewBox: "0 0 16 16",
			fill: "none",
			children: [
				/* @__PURE__ */ N("circle", {
					cx: "3",
					cy: "8",
					r: "1",
					fill: "currentColor"
				}),
				/* @__PURE__ */ N("circle", {
					cx: "8",
					cy: "8",
					r: "1",
					fill: "currentColor"
				}),
				/* @__PURE__ */ N("circle", {
					cx: "13",
					cy: "8",
					r: "1",
					fill: "currentColor"
				})
			]
		}), /* @__PURE__ */ N("span", {
			className: "sr-only",
			children: t
		})]
	});
}
//#endregion
//#region src/components/ui/progress.tsx
var Ls = {
	default: "bg-[var(--Brand-Primary)]",
	success: "bg-[var(--Object-Success)]",
	warning: "bg-[var(--Object-Warning)]",
	caution: "bg-[var(--Object-Caution)]"
}, Rs = {
	none: 0,
	sm: 150,
	md: 300,
	lg: 500
}, zs = {
	warningFrom: 80,
	cautionFrom: 100
}, Bs = 45;
function Vs(e) {
	return e == null ? 0 : Math.min(100, Math.max(0, e));
}
function Hs(e, t) {
	return t ? Bs : Vs(e);
}
function Us(e, t, n) {
	if (!n || e == null) return t;
	let r = n === !0 ? zs : {
		...zs,
		...n
	};
	return r.successBelow != null && e < r.successBelow ? "success" : r.cautionFrom != null && e >= r.cautionFrom ? "caution" : r.warningFrom != null && e >= r.warningFrom || r.warningBelow != null && e < r.warningBelow ? "warning" : t;
}
function Ws({ className: e, value: t, variant: n = "default", autoColor: r, transitionDuration: i = "sm", masked: a, ...o }) {
	let s = Rs[i], c = a ? n : Us(t, n, r), l = Hs(t, a);
	return /* @__PURE__ */ N(S.Root, {
		"data-slot": "progress",
		"data-variant": c,
		"data-auto-color": r ? "" : void 0,
		"data-masked": a ? "" : void 0,
		className: U("relative h-2 w-full overflow-hidden rounded-full bg-[var(--Surface-Tertiary)]", e),
		...o,
		children: /* @__PURE__ */ N(S.Indicator, {
			"data-slot": "progress-indicator",
			className: U("h-full w-full flex-1", Ls[c]),
			style: {
				transform: `translateX(-${100 - l}%)`,
				transition: s === 0 ? "none" : `transform ${s}ms ease-out`
			}
		})
	});
}
//#endregion
//#region src/components/ui/radio-group.tsx
function Gs({ className: e, ...t }) {
	return /* @__PURE__ */ N(C.Root, {
		"data-slot": "radio-group",
		className: U("grid gap-3", e),
		...t
	});
}
function Ks({ className: e, children: t, description: r, id: i, ...a }) {
	let o = n.useId(), s = i ?? o, c = /* @__PURE__ */ N(C.Item, {
		id: s,
		"data-slot": "radio-group-item",
		className: U("aspect-square size-5 shrink-0 rounded-full border border-[var(--Border-Medium-Emphasis)]", "text-[var(--Brand-Primary)] cursor-pointer transition-colors", "hover:border-[var(--Brand-Primary)]", "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50", "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[var(--Border-Medium-Emphasis)]", "data-[state=checked]:border-[var(--Brand-Primary)]", (t != null || r != null) && "mt-0.5", e),
		...a,
		children: /* @__PURE__ */ N(C.Indicator, {
			className: "flex items-center justify-center",
			children: /* @__PURE__ */ N("svg", {
				width: "10",
				height: "10",
				viewBox: "0 0 10 10",
				children: /* @__PURE__ */ N("circle", {
					cx: "5",
					cy: "5",
					r: "5",
					fill: "currentColor"
				})
			})
		})
	});
	return t == null && r == null ? c : /* @__PURE__ */ P("div", {
		"data-slot": "radio-group-item-row",
		"data-disabled": a.disabled || void 0,
		className: "group flex items-start gap-2",
		children: [c, /* @__PURE__ */ P("div", {
			className: "flex flex-col gap-0.5 group-data-[disabled]:opacity-50",
			children: [t != null && /* @__PURE__ */ N(ct, {
				htmlFor: s,
				className: "typo-body-md cursor-pointer group-data-[disabled]:cursor-not-allowed",
				children: t
			}), r != null && /* @__PURE__ */ N("span", {
				className: "typo-body-sm text-[var(--Text-Medium-Emphasis)]",
				children: r
			})]
		})]
	});
}
//#endregion
//#region src/components/ui/select.tsx
var qs = F("flex w-full items-center justify-between rounded-lg border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)] placeholder:text-[var(--Text-Low-Emphasis)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", {
	variants: { size: {
		sm: "h-9 px-2.5 typo-body-sm",
		default: "h-12 px-3 typo-body-md",
		lg: "h-14 px-4 typo-body-md"
	} },
	defaultVariants: { size: "default" }
});
function Js({ ...e }) {
	return /* @__PURE__ */ N(T.Root, {
		"data-slot": "select",
		...e
	});
}
function Ys({ ...e }) {
	return /* @__PURE__ */ N(T.Group, {
		"data-slot": "select-group",
		...e
	});
}
function Xs({ ...e }) {
	return /* @__PURE__ */ N(T.Value, {
		"data-slot": "select-value",
		...e
	});
}
function Zs({ className: e, children: t, size: n, ...r }) {
	return /* @__PURE__ */ P(T.Trigger, {
		"data-slot": "select-trigger",
		className: U(qs({ size: n }), e),
		...r,
		children: [t, /* @__PURE__ */ N(T.Icon, {
			asChild: !0,
			children: /* @__PURE__ */ N("svg", {
				width: "16",
				height: "16",
				viewBox: "0 0 16 16",
				fill: "none",
				className: "opacity-50",
				children: /* @__PURE__ */ N("path", {
					d: "M4 6L8 10L12 6",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				})
			})
		})]
	});
}
function Qs({ className: e, children: t, position: n = "popper", ...r }) {
	return /* @__PURE__ */ N(T.Portal, { children: /* @__PURE__ */ N(T.Content, {
		"data-slot": "select-content",
		className: U("relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)] shadow-[var(--shadow-lg)]", "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95", "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95", n === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", e),
		position: n,
		...r,
		children: /* @__PURE__ */ N(T.Viewport, {
			className: U("p-1", n === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children: t
		})
	}) });
}
function $s({ className: e, children: t, ...n }) {
	return /* @__PURE__ */ P(T.Item, {
		"data-slot": "select-item",
		className: U("relative flex w-full cursor-default select-none items-center rounded-sm py-2 pl-8 pr-2 typo-body-md focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50", "focus:bg-[var(--Surface-Secondary)] focus:text-[var(--Text-High-Emphasis)]", "data-[disabled]:pointer-events-none data-[disabled]:opacity-50", e),
		...n,
		children: [/* @__PURE__ */ N("span", {
			className: "absolute left-2 flex size-4 items-center justify-center",
			children: /* @__PURE__ */ N(T.ItemIndicator, { children: /* @__PURE__ */ N("svg", {
				width: "12",
				height: "12",
				viewBox: "0 0 12 12",
				fill: "none",
				children: /* @__PURE__ */ N("path", {
					d: "M10 3L4.5 8.5L2 6",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				})
			}) })
		}), /* @__PURE__ */ N(T.ItemText, { children: t })]
	});
}
function ec({ className: e, ...t }) {
	return /* @__PURE__ */ N(T.Separator, {
		"data-slot": "select-separator",
		className: U("-mx-1 my-1 h-px bg-[var(--Border-Low-Emphasis)]", e),
		...t
	});
}
function tc({ className: e, ...t }) {
	return /* @__PURE__ */ N(T.Label, {
		"data-slot": "select-label",
		className: U("py-1.5 pl-8 pr-2 typo-label-sm text-[var(--Text-Medium-Emphasis)]", e),
		...t
	});
}
//#endregion
//#region src/components/ui/separator.tsx
function nc({ className: e, orientation: t = "horizontal", decorative: n = !0, ...r }) {
	return /* @__PURE__ */ N(E.Root, {
		"data-slot": "separator",
		decorative: n,
		orientation: t,
		className: U("bg-[var(--Border-Low-Emphasis)] shrink-0", t === "horizontal" ? "h-px w-full" : "h-full w-px", e),
		...r
	});
}
//#endregion
//#region src/components/ui/sheet.tsx
function rc(e, t, n) {
	return t === !1 ? null : t === "title" ? e.querySelector(`[data-slot="${n}"]`) : t === "first-input" ? e.querySelector([
		"input:not([disabled])",
		"textarea:not([disabled])",
		"select:not([disabled])",
		"button:not([disabled])",
		"[href]",
		"[tabindex]:not([tabindex='-1'])"
	].join(", ")) : t.current;
}
function ic(e, t, n) {
	if (!e || t == null) return;
	let r = rc(e, t, n);
	r && (r.tabIndex < 0 && t === "title" && (r.tabIndex = -1), r.focus());
}
function ac(e) {
	!e || e.current != null || typeof document > "u" || (e.current = document.activeElement);
}
var oc = n.createContext(null), sc = n.createContext(null);
function cc(e, t, n) {
	let r = Math.max(0, e - t - n);
	return r < 1 ? {
		keyboardInset: 0,
		visibleHeight: null
	} : {
		keyboardInset: r,
		visibleHeight: t
	};
}
function lc(e, t, n) {
	if (!(e <= 0)) return n ? { bottom: e } : {
		bottom: e,
		maxHeight: t ?? void 0
	};
}
function uc() {
	let [e, t] = n.useState({
		keyboardInset: 0,
		visibleHeight: null
	});
	return n.useEffect(() => {
		if (typeof window > "u") return;
		let e = window.visualViewport;
		if (!e) return;
		let n = () => t(cc(window.innerHeight, e.height, e.offsetTop));
		return n(), e.addEventListener("resize", n), e.addEventListener("scroll", n), () => {
			e.removeEventListener("resize", n), e.removeEventListener("scroll", n);
		};
	}, []), e;
}
function dc(e, t, n) {
	return Math.abs(e) < 6 && Math.abs(t) < 6 ? null : e > 0 && e > Math.abs(t) && n ? "drag" : "scroll";
}
var fc = 100, pc = .5;
function mc(e, t, n = fc) {
	let r = e.filter((e) => t - e.t <= n);
	if (r.length < 2) return 0;
	let i = r[0], a = r[r.length - 1], o = a.t - i.t;
	return o <= 0 ? 0 : (a.y - i.y) / o;
}
function hc(e, t, n) {
	return e > (t > 0 ? t * .3 : 200) || e > 0 && n > pc;
}
function gc(e, t, n) {
	return {
		primary: n === "right" ? e : -e,
		cross: t
	};
}
function _c(e, t) {
	return t === "right" ? e : -e;
}
function vc(e) {
	if (typeof e == "number") return Math.min(1, Math.max(0, e));
	let t = parseFloat(e);
	return Number.isNaN(t) || typeof window > "u" ? .9 : Math.min(1, Math.max(0, t / window.innerHeight));
}
function yc({ snapPoints: e, activeSnapPoint: t, setActiveSnapPoint: r, fadeFromIndex: i, dismissible: a = !0, overlay: o = !0, onOpenChange: s, open: c, defaultOpen: l, ...u }) {
	let d = n.useMemo(() => (e ?? []).map(vc), [e]), f = c !== void 0, [p, m] = n.useState(l ?? !1), h = f ? c : p, g = t !== void 0, v = e?.[0] ?? null, [y, b] = n.useState(v), x = g ? t : y, S = n.useCallback((e) => {
		g || b(e), r?.(e);
	}, [g, r]);
	n.useEffect(() => {
		h && !g && e && e.length > 0 && b(e[0]);
	}, [h]);
	let C = n.useCallback((t) => {
		!t && !g && e && e.length > 0 && b(e[0]), f || m(t), s?.(t);
	}, [
		s,
		e,
		g,
		f
	]), w = n.useMemo(() => !e || e.length === 0 ? null : {
		snapPoints: e,
		snapRatios: d,
		activeSnapPoint: x,
		setActiveSnapPoint: S,
		dismissible: a,
		fadeFromIndex: i ?? 0,
		overlay: o,
		close: () => C(!1)
	}, [
		e,
		d,
		x,
		S,
		a,
		i,
		o,
		C
	]), T = n.useMemo(() => ({ close: () => C(!1) }), [C]);
	return /* @__PURE__ */ N(sc.Provider, {
		value: T,
		children: /* @__PURE__ */ N(oc.Provider, {
			value: w,
			children: /* @__PURE__ */ N(_.Root, {
				"data-slot": "sheet",
				open: h,
				onOpenChange: C,
				...u
			})
		})
	});
}
function bc({ ...e }) {
	return /* @__PURE__ */ N(_.Trigger, {
		"data-slot": "sheet-trigger",
		...e
	});
}
function xc({ ...e }) {
	return /* @__PURE__ */ N(_.Close, {
		"data-slot": "sheet-close",
		...e
	});
}
function Sc({ ...e }) {
	return /* @__PURE__ */ N(_.Portal, {
		"data-slot": "sheet-portal",
		...e
	});
}
var Cc = 40, wc = 50, Tc = 20, Ec = 0, Dc = [], Oc = /* @__PURE__ */ new Set();
function kc() {
	Oc.forEach((e) => e());
}
function Ac() {
	let e = Ec++;
	return Dc.push(e), kc(), e;
}
function jc(e) {
	let t = Dc.indexOf(e);
	t !== -1 && Dc.splice(t, 1), kc();
}
function Mc(e) {
	return Math.max(0, Dc.indexOf(e));
}
function Nc() {
	let e = n.useRef(null), [t, r] = n.useState(null);
	n.useEffect(() => {
		let t = Ac();
		return e.current = t, r(t), () => {
			jc(t), e.current = null;
		};
	}, []);
	let i = n.useCallback((e) => (Oc.add(e), () => {
		Oc.delete(e);
	}), []), a = n.useCallback(() => t === null ? 0 : Mc(t), [t]);
	return n.useSyncExternalStore(i, a, a);
}
function Pc({ onLevelChange: e }) {
	let t = Nc();
	return n.useEffect(() => {
		e(t);
	}, [t, e]), null;
}
function Fc({ className: e, glass: t = !1, opacity: n, style: r, stackLevel: i, zIndex: a, ...o }) {
	let s = n != null, c = a ?? (i == null ? void 0 : Cc + i * Tc);
	return /* @__PURE__ */ N(_.Overlay, {
		"data-slot": "sheet-overlay",
		className: U("fixed inset-0 z-40", t ? "bg-black/30" : "bg-black/40", !s && "transition-opacity duration-200", e),
		style: {
			...r,
			...s ? { opacity: n } : null,
			...c == null ? null : { zIndex: c }
		},
		...o
	});
}
function Ic() {
	return /* @__PURE__ */ N("div", {
		className: "flex justify-center pt-4 pb-1 flex-shrink-0",
		children: /* @__PURE__ */ N("div", { className: "w-9 h-[5px] rounded-full bg-[var(--Object-Disable)] opacity-50" })
	});
}
var Lc = F("fixed z-50 ksk-squircle text-[var(--Text-High-Emphasis)] shadow-[var(--shadow-dialog)] transition ease-in-out", {
	variants: { side: {
		top: [
			"inset-x-0 top-0 border-b border-[var(--Border-Low-Emphasis)]",
			"bg-[var(--Surface-Primary)]",
			"data-[state=open]:animate-in data-[state=open]:slide-in-from-top data-[state=open]:duration-200",
			"data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top data-[state=closed]:duration-150"
		].join(" "),
		bottom: [
			"inset-x-0 bottom-0 rounded-t-[var(--Radius-Sheet)]",
			"bg-[var(--Surface-Primary)]",
			"max-h-[90dvh] overflow-y-auto"
		].join(" "),
		left: [
			"inset-y-0 left-0 h-full w-3/4 max-w-sm border-r border-[var(--Border-Low-Emphasis)]",
			"bg-[var(--Surface-Primary)]",
			"data-[state=open]:animate-slide-in-left",
			"data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left"
		].join(" "),
		right: [
			"inset-y-0 right-0 h-full w-3/4 max-w-sm border-l border-[var(--Border-Low-Emphasis)]",
			"bg-[var(--Surface-Primary)]",
			"data-[state=open]:animate-slide-in-right",
			"data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right"
		].join(" "),
		float: ["inset-x-3 bottom-3 rounded-[var(--Radius-Sheet)] max-w-lg mx-auto", "bg-[var(--Surface-Primary)]"].join(" "),
		"float-glass": ["inset-x-3 bottom-3 rounded-[var(--Radius-Sheet)] max-w-lg mx-auto", "glass glass-specular"].join(" "),
		"bottom-glass": ["inset-x-0 bottom-0 rounded-t-[var(--Radius-Sheet)]", "glass-strong"].join(" ")
	} },
	defaultVariants: { side: "right" }
}), Rc = /* @__PURE__ */ new Set(["float-glass", "bottom-glass"]), zc = /* @__PURE__ */ new Set(["bottom", "bottom-glass"]), Bc = /* @__PURE__ */ new Set(["left", "right"]);
function Vc({ className: e, children: t, side: r = "right", glassOverlay: i, container: a, padding: o = !0, swipeToClose: s, description: c, autoFocus: l, restoreFocusOnClose: u = !0, closeOnEsc: d = !0, bodyScrollLock: f = !0, zIndex: p, overlayClassName: m, ...h }) {
	let g = n.useId(), v = n.useRef(null), y = n.useRef(null), [b, x] = n.useState(0), S = p ?? wc + b * Tc, C = c != null && c !== !1, w = C ? g : h["aria-describedby"], T = n.useContext(oc), E = i ?? Rc.has(r), { keyboardInset: D, visibleHeight: ee } = uc(), O = (e) => {
		ac(y), h.onOpenAutoFocus?.(e), !(e.defaultPrevented || l == null) && (e.preventDefault(), l !== !1 && window.requestAnimationFrame(() => {
			ic(v.current, l, "sheet-title");
		}));
	}, k = (e) => {
		if (h.onCloseAutoFocus?.(e), !e.defaultPrevented) {
			if (!u) {
				e.preventDefault();
				return;
			}
			y.current && (e.preventDefault(), y.current.focus());
		}
	}, A = (e) => {
		h.onEscapeKeyDown?.(e), d || e.preventDefault();
	};
	if (T && r === "bottom") return /* @__PURE__ */ N(Gc, {
		snapCtx: T,
		className: e,
		glassOverlay: E,
		overlayClassName: m,
		stackLevel: b,
		onStackLevelChange: x,
		contentZIndex: S,
		container: a,
		description: c,
		autoFocus: l,
		restoreFocusOnClose: u,
		closeOnEsc: d,
		restoreFocusRef: y,
		...h,
		children: t
	});
	if (s && zc.has(r)) return /* @__PURE__ */ N(Uc, {
		side: r,
		className: e,
		glassOverlay: E,
		overlayClassName: m,
		stackLevel: b,
		onStackLevelChange: x,
		contentZIndex: S,
		container: a,
		padding: o,
		description: c,
		autoFocus: l,
		restoreFocusOnClose: u,
		closeOnEsc: d,
		restoreFocusRef: y,
		...h,
		children: t
	});
	if (s && Bc.has(r)) return /* @__PURE__ */ N(Wc, {
		side: r,
		className: e,
		glassOverlay: E,
		overlayClassName: m,
		stackLevel: b,
		onStackLevelChange: x,
		contentZIndex: S,
		container: a,
		padding: o,
		description: c,
		autoFocus: l,
		restoreFocusOnClose: u,
		closeOnEsc: d,
		restoreFocusRef: y,
		...h,
		children: t
	});
	let j = r === "bottom" || r === "bottom-glass" ? lc(D, ee, !1) : void 0;
	return /* @__PURE__ */ P(Sc, {
		container: a,
		children: [/* @__PURE__ */ N(Fc, {
			glass: E,
			className: m,
			stackLevel: b
		}), /* @__PURE__ */ P(_.Content, {
			ref: v,
			"data-slot": "sheet-content",
			"data-side": r,
			className: U(Lc({ side: r }), o && "p-6", e),
			...h,
			style: {
				...h.style,
				...j,
				zIndex: S
			},
			"aria-describedby": w,
			onOpenAutoFocus: O,
			onCloseAutoFocus: k,
			onEscapeKeyDown: A,
			children: [
				/* @__PURE__ */ N(Pc, { onLevelChange: x }),
				C && /* @__PURE__ */ N(_.Description, {
					id: g,
					className: "sr-only",
					children: c
				}),
				t
			]
		})]
	});
}
function Hc(e, t) {
	let n = e instanceof HTMLElement ? e : null;
	for (; n;) {
		let e = getComputedStyle(n).overflowY;
		if ((e === "auto" || e === "scroll") && n.scrollHeight > n.clientHeight + 1) return n;
		if (n === t) break;
		n = n.parentElement;
	}
	return null;
}
function Uc({ side: e, className: t, glassOverlay: r, overlayClassName: i, stackLevel: a, onStackLevelChange: o, contentZIndex: s, container: c, padding: l = !0, description: u, autoFocus: d, restoreFocusOnClose: f = !0, closeOnEsc: p = !0, restoreFocusRef: m, children: h, style: g, ...v }) {
	let y = n.useId(), b = u != null && u !== !1, x = b ? y : v["aria-describedby"], S = n.useContext(sc), [C, w] = n.useState(0), [T, E] = n.useState(!1), [D, ee] = n.useState(!1), O = n.useRef(0), k = n.useRef(0), A = n.useRef(null), j = n.useRef(!1), M = n.useRef(0), F = n.useRef([]), I = n.useRef(null), L = n.useRef(!1), R = n.useRef(null), z = n.useRef(S);
	n.useEffect(() => {
		z.current = S;
	}, [S]);
	let { keyboardInset: B, visibleHeight: te } = uc(), V = (e) => {
		ac(m), v.onOpenAutoFocus?.(e), !(e.defaultPrevented || d == null) && (e.preventDefault(), d !== !1 && window.requestAnimationFrame(() => {
			ic(R.current, d, "sheet-title");
		}));
	}, ne = (e) => {
		if (v.onCloseAutoFocus?.(e), !e.defaultPrevented) {
			if (!f) {
				e.preventDefault();
				return;
			}
			m?.current && (e.preventDefault(), m.current.focus());
		}
	}, H = (e) => {
		v.onEscapeKeyDown?.(e), p || e.preventDefault();
	}, re = n.useCallback((e) => {
		M.current = e, w(e);
	}, []), ie = n.useCallback((e, t, n, r) => {
		O.current = t, k.current = e, A.current = null, j.current = !1, F.current = [{
			y: t,
			t: r
		}], L.current = n instanceof HTMLElement && n.closest("[data-sheet-drag-handle]") != null, I.current = Hc(n, R.current);
	}, []), ae = n.useCallback((e, t, n) => {
		if (A.current === "scroll") return !1;
		let r = t - O.current, i = e - k.current;
		if (A.current === null) {
			let e = dc(r, i, L.current || !I.current || I.current.scrollTop <= 0);
			if (e === null) return !1;
			if (A.current = e, e === "drag") j.current = !0, ee(!0), E(!0);
			else return !1;
		}
		if (j.current) {
			let e = F.current;
			return e.push({
				y: t,
				t: n
			}), e.length > 12 && e.shift(), re(Math.max(0, r)), !0;
		}
		return !1;
	}, [re]), oe = n.useCallback((e) => {
		let t = j.current;
		if (j.current = !1, A.current = null, !t) return;
		E(!1);
		let n = R.current?.offsetHeight ?? 0, r = mc(F.current, e);
		F.current = [], hc(M.current, n, r) && z.current?.close(), re(0);
	}, [re]), se = n.useRef(null), ce = n.useCallback((e) => {
		if (R.current = e, se.current?.(), se.current = null, !e) return;
		let t = (e) => {
			if (e.touches.length !== 1) return;
			let t = e.touches[0];
			ie(t.clientX, t.clientY, e.target, e.timeStamp);
		}, n = (e) => {
			if (e.touches.length !== 1) return;
			let t = e.touches[0];
			ae(t.clientX, t.clientY, e.timeStamp) && e.preventDefault();
		}, r = (e) => oe(e.timeStamp);
		e.addEventListener("touchstart", t, { passive: !0 }), e.addEventListener("touchmove", n, { passive: !1 }), e.addEventListener("touchend", r, { passive: !0 }), e.addEventListener("touchcancel", r, { passive: !0 }), se.current = () => {
			e.removeEventListener("touchstart", t), e.removeEventListener("touchmove", n), e.removeEventListener("touchend", r), e.removeEventListener("touchcancel", r);
		};
	}, [
		ie,
		ae,
		oe
	]), le = (e) => {
		e.pointerType !== "touch" && (e.button != null && e.button !== 0 || ie(e.clientX, e.clientY, e.target, e.timeStamp));
	}, ue = (e) => {
		if (e.pointerType !== "touch" && e.buttons !== 0 && ae(e.clientX, e.clientY, e.timeStamp)) try {
			e.currentTarget.setPointerCapture(e.pointerId);
		} catch {}
	}, de = (e) => {
		e.pointerType !== "touch" && oe(e.timeStamp);
	};
	return /* @__PURE__ */ P(Sc, {
		container: c,
		children: [/* @__PURE__ */ N(Fc, {
			glass: r,
			className: i,
			stackLevel: a
		}), /* @__PURE__ */ P(_.Content, {
			ref: ce,
			"data-slot": "sheet-content",
			"data-side": e,
			className: U(Lc({ side: e }), "flex flex-col max-h-[90dvh] overflow-y-auto overscroll-y-none", l && "p-6", t),
			style: {
				...g,
				...lc(B, te, !1),
				transform: `translate3d(0, ${C}px, 0)`,
				transition: T || !D ? "none" : "transform 280ms cubic-bezier(0.32, 0.72, 0, 1)",
				willChange: "transform",
				zIndex: s
			},
			...v,
			onPointerDown: le,
			onPointerMove: ue,
			onPointerUp: de,
			onPointerCancel: de,
			"aria-describedby": x,
			onOpenAutoFocus: V,
			onCloseAutoFocus: ne,
			onEscapeKeyDown: H,
			children: [
				o && /* @__PURE__ */ N(Pc, { onLevelChange: o }),
				b && /* @__PURE__ */ N(_.Description, {
					id: y,
					className: "sr-only",
					children: u
				}),
				/* @__PURE__ */ N("div", {
					"data-sheet-drag-handle": !0,
					className: U("shrink-0 cursor-grab active:cursor-grabbing select-none", l && "-mx-6 -mt-6"),
					style: { touchAction: "none" },
					children: /* @__PURE__ */ N(Ic, {})
				}),
				h
			]
		})]
	});
}
function Wc({ side: e, className: t, glassOverlay: r, overlayClassName: i, stackLevel: a, onStackLevelChange: o, contentZIndex: s, container: c, padding: l = !0, description: u, autoFocus: d, restoreFocusOnClose: f = !0, closeOnEsc: p = !0, restoreFocusRef: m, children: h, style: g, ...v }) {
	let y = n.useId(), b = u != null && u !== !1, x = b ? y : v["aria-describedby"], S = n.useContext(sc), [C, w] = n.useState(0), [T, E] = n.useState(!1), [D, ee] = n.useState(!1), O = n.useRef(0), k = n.useRef(0), A = n.useRef(null), j = n.useRef(!1), M = n.useRef(0), F = n.useRef([]), I = n.useRef(null), L = n.useRef(S);
	n.useEffect(() => {
		L.current = S;
	}, [S]);
	let R = (e) => {
		ac(m), v.onOpenAutoFocus?.(e), !(e.defaultPrevented || d == null) && (e.preventDefault(), d !== !1 && window.requestAnimationFrame(() => {
			ic(I.current, d, "sheet-title");
		}));
	}, z = (e) => {
		if (v.onCloseAutoFocus?.(e), !e.defaultPrevented) {
			if (!f) {
				e.preventDefault();
				return;
			}
			m?.current && (e.preventDefault(), m.current.focus());
		}
	}, B = (e) => {
		v.onEscapeKeyDown?.(e), p || e.preventDefault();
	}, te = n.useCallback((e) => {
		M.current = e, w(e);
	}, []), V = n.useCallback((e, t, n, r) => {
		O.current = e, k.current = t, A.current = null, j.current = !1, F.current = [{
			y: 0,
			t: r
		}];
	}, []), ne = n.useCallback((t, n, r) => {
		if (A.current === "scroll") return !1;
		let { primary: i, cross: a } = gc(t - O.current, n - k.current, e);
		if (A.current === null) {
			let e = dc(i, a, !0);
			if (e === null) return !1;
			if (A.current = e, e === "drag") j.current = !0, ee(!0), E(!0);
			else return !1;
		}
		if (j.current) {
			let e = F.current;
			return e.push({
				y: i,
				t: r
			}), e.length > 12 && e.shift(), te(Math.max(0, i)), !0;
		}
		return !1;
	}, [e, te]), H = n.useCallback((e) => {
		let t = j.current;
		if (j.current = !1, A.current = null, !t) return;
		E(!1);
		let n = I.current?.offsetWidth ?? 0, r = mc(F.current, e);
		F.current = [], hc(M.current, n, r) && L.current?.close(), te(0);
	}, [te]), re = n.useRef(null), ie = n.useCallback((e) => {
		if (I.current = e, re.current?.(), re.current = null, !e) return;
		let t = (e) => {
			if (e.touches.length !== 1) return;
			let t = e.touches[0];
			V(t.clientX, t.clientY, e.target, e.timeStamp);
		}, n = (e) => {
			if (e.touches.length !== 1) return;
			let t = e.touches[0];
			ne(t.clientX, t.clientY, e.timeStamp) && e.preventDefault();
		}, r = (e) => H(e.timeStamp);
		e.addEventListener("touchstart", t, { passive: !0 }), e.addEventListener("touchmove", n, { passive: !1 }), e.addEventListener("touchend", r, { passive: !0 }), e.addEventListener("touchcancel", r, { passive: !0 }), re.current = () => {
			e.removeEventListener("touchstart", t), e.removeEventListener("touchmove", n), e.removeEventListener("touchend", r), e.removeEventListener("touchcancel", r);
		};
	}, [
		V,
		ne,
		H
	]), ae = (e) => {
		e.pointerType !== "touch" && (e.button != null && e.button !== 0 || V(e.clientX, e.clientY, e.target, e.timeStamp));
	}, oe = (e) => {
		if (e.pointerType !== "touch" && e.buttons !== 0 && ne(e.clientX, e.clientY, e.timeStamp)) try {
			e.currentTarget.setPointerCapture(e.pointerId);
		} catch {}
	}, se = (e) => {
		e.pointerType !== "touch" && H(e.timeStamp);
	};
	return /* @__PURE__ */ P(Sc, {
		container: c,
		children: [/* @__PURE__ */ N(Fc, {
			glass: r,
			className: i,
			stackLevel: a
		}), /* @__PURE__ */ P(_.Content, {
			ref: ie,
			"data-slot": "sheet-content",
			"data-side": e,
			className: U(Lc({ side: e }), "overscroll-x-none", l && "p-6", t),
			style: {
				...g,
				transform: `translate3d(${_c(C, e)}px, 0, 0)`,
				transition: T || !D ? "none" : "transform 280ms cubic-bezier(0.32, 0.72, 0, 1)",
				willChange: "transform",
				zIndex: s
			},
			...v,
			onPointerDown: ae,
			onPointerMove: oe,
			onPointerUp: se,
			onPointerCancel: se,
			"aria-describedby": x,
			onOpenAutoFocus: R,
			onCloseAutoFocus: z,
			onEscapeKeyDown: B,
			children: [
				o && /* @__PURE__ */ N(Pc, { onLevelChange: o }),
				b && /* @__PURE__ */ N(_.Description, {
					id: y,
					className: "sr-only",
					children: u
				}),
				h
			]
		})]
	});
}
function Gc({ snapCtx: e, className: t, glassOverlay: r, overlayClassName: i, stackLevel: a, onStackLevelChange: o, contentZIndex: s, container: c, description: l, autoFocus: u, restoreFocusOnClose: d = !0, closeOnEsc: f = !0, restoreFocusRef: p, children: m, style: h, ...g }) {
	let v = n.useId(), y = l != null && l !== !1, b = y ? v : g["aria-describedby"], { snapRatios: x, activeSnapPoint: S, setActiveSnapPoint: C, dismissible: w, close: T, snapPoints: E, fadeFromIndex: D, overlay: ee } = e, O = n.useMemo(() => x.length > 0 ? Math.max(...x) : .9, [x]), k = n.useMemo(() => x.length > 0 ? Math.min(...x) : .4, [x]), A = n.useMemo(() => S == null ? O : vc(S), [S, O]), [j, M] = n.useState(!1), F = n.useRef(0), I = n.useRef(A), L = n.useRef(null), R = (e) => {
		ac(p), g.onOpenAutoFocus?.(e), !(e.defaultPrevented || u == null) && (e.preventDefault(), u !== !1 && window.requestAnimationFrame(() => {
			ic(L.current, u, "sheet-title");
		}));
	}, z = (e) => {
		if (g.onCloseAutoFocus?.(e), !e.defaultPrevented) {
			if (!d) {
				e.preventDefault();
				return;
			}
			p?.current && (e.preventDefault(), p.current.focus());
		}
	}, B = (e) => {
		g.onEscapeKeyDown?.(e), f || e.preventDefault();
	}, te = (O - A) / O * 100, V = (e) => {
		if (!(e.button != null && e.button !== 0)) {
			M(!0), F.current = e.clientY, I.current = A;
			try {
				e.currentTarget.setPointerCapture(e.pointerId);
			} catch {}
		}
	}, ne = (e) => {
		if (!j) return;
		let t = e.clientY - F.current, n = typeof window > "u" ? 1 : window.innerHeight, r = Math.max(0, Math.min(O, I.current - t / n));
		C(r);
	}, H = (e) => {
		if (!j) return;
		M(!1);
		let t = A;
		if (w && t < k * .5) {
			T();
			return;
		}
		let n = 0, r = Math.abs(t - x[0]);
		for (let e = 1; e < x.length; e++) {
			let i = Math.abs(t - x[e]);
			i < r && (r = i, n = e);
		}
		C(E[n]);
	}, re = n.useMemo(() => {
		if (x.length === 0) return 1;
		let e = x[Math.min(D, x.length - 1)];
		return A <= e ? 0 : O <= e ? 1 : Math.min(1, (A - e) / (O - e));
	}, [
		x,
		D,
		A,
		O
	]), ie = `translate3d(0, ${te}%, 0)`;
	return /* @__PURE__ */ P(Sc, {
		container: c,
		children: [ee && /* @__PURE__ */ N(Fc, {
			glass: r,
			opacity: re,
			className: i,
			stackLevel: a
		}), /* @__PURE__ */ P(_.Content, {
			ref: L,
			"data-slot": "sheet-content",
			"data-side": "bottom",
			"data-snap-active": S ?? void 0,
			onKeyDown: (e) => {
				if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
				let t = x.findIndex((e) => e === A);
				if (t === -1) return;
				let n = e.key === "ArrowUp" ? Math.min(x.length - 1, t + 1) : Math.max(0, t - 1);
				n !== t && (e.preventDefault(), C(E[n]));
			},
			className: U("fixed inset-x-0 bottom-0 z-50 flex flex-col", "bg-[var(--Surface-Primary)] rounded-t-[var(--Radius-Sheet)] shadow-[var(--shadow-dialog)]", "data-[state=open]:animate-none data-[state=closed]:animate-none", "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50", t),
			style: {
				...h,
				height: `${O * 100}svh`,
				transform: ie,
				transition: j ? "none" : "transform 320ms cubic-bezier(0.32, 0.72, 0, 1)",
				willChange: "transform",
				touchAction: "none",
				zIndex: s
			},
			...g,
			"aria-describedby": b,
			onOpenAutoFocus: R,
			onCloseAutoFocus: z,
			onEscapeKeyDown: B,
			children: [
				o && /* @__PURE__ */ N(Pc, { onLevelChange: o }),
				y && /* @__PURE__ */ N(_.Description, {
					id: v,
					className: "sr-only",
					children: l
				}),
				/* @__PURE__ */ N("div", {
					onPointerDown: V,
					onPointerMove: ne,
					onPointerUp: H,
					onPointerCancel: H,
					className: "cursor-grab active:cursor-grabbing select-none",
					children: /* @__PURE__ */ N(Ic, {})
				}),
				/* @__PURE__ */ N("div", {
					className: "flex-1 min-h-0 overflow-y-auto",
					style: {
						maxHeight: `calc(${A * 100}svh - 22px)`,
						transition: j ? "none" : "max-height 320ms cubic-bezier(0.32, 0.72, 0, 1)"
					},
					children: m
				})
			]
		})]
	});
}
function Kc({ className: e, ...t }) {
	return /* @__PURE__ */ N("div", {
		"data-slot": "sheet-header",
		className: U("flex flex-col gap-2", e),
		...t
	});
}
function qc({ className: e, orientation: t = "split", ...n }) {
	return /* @__PURE__ */ N("div", {
		"data-slot": "sheet-footer",
		"data-orientation": t,
		className: U(t === "stacked" ? "flex flex-col gap-2 mt-auto" : "flex flex-row gap-3 [&>*]:flex-1 [&>*]:basis-0 mt-auto", e),
		...n
	});
}
function Jc({ className: e, ...t }) {
	return /* @__PURE__ */ N(_.Title, {
		"data-slot": "sheet-title",
		className: U("typo-heading-lg text-[var(--Text-High-Emphasis)]", e),
		...t
	});
}
function Yc({ className: e, ...t }) {
	return /* @__PURE__ */ N(_.Description, {
		"data-slot": "sheet-description",
		className: U("typo-body-md text-[var(--Text-Medium-Emphasis)]", e),
		...t
	});
}
//#endregion
//#region src/components/ui/skeleton.tsx
var Xc = {
	none: "rounded-none",
	sm: "rounded-sm",
	md: "rounded-md",
	lg: "rounded-lg",
	xl: "rounded-xl",
	"2xl": "rounded-2xl",
	full: "rounded-full"
};
function Zc({ className: e, width: t, height: n, rounded: r = "lg", style: i, ...a }) {
	let o = { ...i };
	return t !== void 0 && (o.width = typeof t == "number" ? `${t}px` : t), n !== void 0 && (o.height = typeof n == "number" ? `${n}px` : n), /* @__PURE__ */ N("div", {
		"data-slot": "skeleton",
		"aria-hidden": "true",
		style: o,
		className: U("animate-pulse bg-[var(--Surface-Tertiary)]", Xc[r], e),
		...a
	});
}
function Qc({ lines: e = 3, lineHeight: t = 12, lastLineWidth: n = "60%", className: r }) {
	return /* @__PURE__ */ N("div", {
		"data-slot": "skeleton-text",
		"aria-hidden": "true",
		className: U("flex flex-col gap-2", r),
		children: Array.from({ length: e }).map((r, i) => /* @__PURE__ */ N(Zc, {
			height: t,
			width: i === e - 1 && n ? n : "100%"
		}, i))
	});
}
//#endregion
//#region src/components/patterns/list-skeletons.tsx
function $c({ rows: e = 5, hasFilter: t = !0, loadingLabel: n = "Loading...", className: r, rowHeight: i = 56 }) {
	return /* @__PURE__ */ P("div", {
		"data-slot": "list-skeleton",
		className: U("animate-fade-in px-4 pt-3", r),
		"aria-busy": "true",
		"aria-label": n,
		children: [t && /* @__PURE__ */ P("div", {
			className: "flex gap-2 mb-3",
			children: [
				/* @__PURE__ */ N(Zc, {
					width: 80,
					height: 36,
					rounded: "full"
				}),
				/* @__PURE__ */ N(Zc, {
					width: 80,
					height: 36,
					rounded: "full"
				}),
				/* @__PURE__ */ N(Zc, {
					width: 80,
					height: 36,
					rounded: "full"
				})
			]
		}), /* @__PURE__ */ N("div", {
			className: "space-y-2",
			children: Array.from({ length: e }).map((e, t) => /* @__PURE__ */ N(Zc, {
				width: "100%",
				height: i,
				rounded: "2xl"
			}, t))
		})]
	});
}
function el({ rows: e = 3, columns: t = 2, cardHeight: n = 140, loadingLabel: r = "Loading...", className: i }) {
	let a = t === 1 ? "grid-cols-1" : t === 2 ? "grid-cols-2" : t === 3 ? "grid-cols-3" : t === 4 ? "grid-cols-4" : "grid-cols-2";
	return /* @__PURE__ */ N("div", {
		"data-slot": "grid-skeleton",
		className: U("animate-fade-in px-4 pt-3", i),
		"aria-busy": "true",
		"aria-label": r,
		children: /* @__PURE__ */ N("div", {
			className: U("grid gap-3", a),
			children: Array.from({ length: e * t }).map((e, t) => /* @__PURE__ */ N(Zc, {
				width: "100%",
				height: n,
				rounded: "2xl"
			}, t))
		})
	});
}
//#endregion
//#region src/components/ui/slider.tsx
function tl({ className: e, defaultValue: t, value: r, min: i = 0, max: a = 100, ...o }) {
	let s = n.useMemo(() => Array.isArray(r) ? r : Array.isArray(t) ? t : [i, a], [
		r,
		t,
		i,
		a
	]);
	return /* @__PURE__ */ P(D.Root, {
		"data-slot": "slider",
		defaultValue: t,
		value: r,
		min: i,
		max: a,
		className: U("relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col", e),
		...o,
		children: [/* @__PURE__ */ N(D.Track, {
			"data-slot": "slider-track",
			className: "relative grow overflow-hidden rounded-full bg-[var(--Surface-Tertiary)] data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
			children: /* @__PURE__ */ N(D.Range, {
				"data-slot": "slider-range",
				className: "absolute bg-[var(--Brand-Primary)] data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
			})
		}), Array.from({ length: s.length }, (e, t) => /* @__PURE__ */ N(D.Thumb, {
			"data-slot": "slider-thumb",
			className: "block size-5 shrink-0 rounded-full border-2 border-[var(--Brand-Primary)] bg-[var(--Surface-Primary)] shadow-[var(--shadow-sm)] ring-[var(--Brand-Primary)]/20 transition-[color,box-shadow,transform] hover:ring-4 hover:scale-125 focus-visible:ring-4 focus-visible:outline-hidden active:scale-110 active:ring-6 active:shadow-[var(--shadow-md)] disabled:pointer-events-none disabled:opacity-50"
		}, t))]
	});
}
//#endregion
//#region src/components/ui/spinner.tsx
function nl({ className: e, size: t = "md", label: n = "読み込み中", ...r }) {
	return /* @__PURE__ */ N("div", {
		"data-slot": "spinner",
		role: "status",
		"aria-label": n,
		className: U("animate-spin rounded-full border-[var(--Border-Medium-Emphasis)] border-t-[var(--Brand-Primary)]", {
			sm: "size-4 border-2",
			md: "size-8 border-[3px]",
			lg: "size-12 border-4"
		}[t], e),
		...r,
		children: /* @__PURE__ */ N("span", {
			className: "sr-only",
			children: n
		})
	});
}
//#endregion
//#region src/components/ui/error-boundary.tsx
var rl = {
	emoji: "😢",
	title: "Something went wrong",
	description: "Your data is safe. Use the buttons below to recover.",
	reloadLabel: "Reload",
	resetLabel: "Try again"
}, il = class extends n.Component {
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
		n && n.env?.NODE_ENV !== "production" && console.error("[ksk-ds ErrorBoundary]", e, t), this.props.onError?.(e, t);
	}
	handleReset = () => {
		this.setState({
			hasError: !1,
			error: null
		}), this.props.onReset?.();
	};
	handleReload = () => {
		typeof window < "u" && window.location.reload();
	};
	render() {
		if (!this.state.hasError) return this.props.children;
		let { fallback: e, labels: t, onReset: n, className: r } = this.props, i = {
			...rl,
			...t
		};
		return e ? typeof e == "function" ? e(this.state.error, this.handleReset) : e : /* @__PURE__ */ N("div", {
			"data-slot": "error-boundary-fallback",
			role: "alert",
			className: U("flex flex-col items-center justify-center min-h-screen p-8 text-center bg-[var(--Surface-Primary)]", r),
			children: /* @__PURE__ */ P("div", {
				className: "max-w-md w-full",
				children: [
					/* @__PURE__ */ N("p", {
						className: "text-5xl mb-4",
						"aria-hidden": "true",
						children: i.emoji
					}),
					/* @__PURE__ */ N("h2", {
						className: "typo-heading-lg text-[var(--Text-High-Emphasis)] mb-2",
						children: i.title
					}),
					/* @__PURE__ */ N("p", {
						className: "typo-body-sm text-[var(--Text-Medium-Emphasis)] mb-6 whitespace-pre-line",
						children: i.description
					}),
					/* @__PURE__ */ P("div", {
						className: "flex flex-col gap-2 items-stretch sm:flex-row sm:justify-center",
						children: [n && /* @__PURE__ */ N(W, {
							variant: "secondary",
							size: "lg",
							onClick: this.handleReset,
							children: i.resetLabel
						}), /* @__PURE__ */ N(W, {
							size: "lg",
							onClick: this.handleReload,
							children: i.reloadLabel
						})]
					})
				]
			})
		});
	}
};
//#endregion
//#region src/components/ui/switch.tsx
function al({ className: e, ...t }) {
	return /* @__PURE__ */ N(ee.Root, {
		"data-slot": "switch",
		className: U("peer inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent shadow-[var(--shadow-sm)] transition-colors cursor-pointer", "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50", "disabled:cursor-not-allowed disabled:opacity-50", "data-[state=checked]:bg-[var(--Brand-Primary)] data-[state=unchecked]:bg-[var(--Surface-Quaternary)]", "hover:data-[state=unchecked]:bg-[var(--Object-Disable)]", "hover:data-[state=checked]:bg-[var(--Hover-Primary-Button)]", "disabled:hover:data-[state=unchecked]:bg-[var(--Surface-Quaternary)] disabled:hover:data-[state=checked]:bg-[var(--Brand-Primary)]", e),
		...t,
		children: /* @__PURE__ */ N(ee.Thumb, {
			"data-slot": "switch-thumb",
			className: U("pointer-events-none block size-5 rounded-full bg-[var(--Surface-Primary)] shadow-[var(--shadow-lg)] ring-0 transition-transform", "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0")
		})
	});
}
//#endregion
//#region src/components/ui/tabs.tsx
var ol = n.createContext("default");
function sl({ className: e, ...t }) {
	return /* @__PURE__ */ N(O.Root, {
		"data-slot": "tabs",
		className: U("flex flex-col gap-2", e),
		...t
	});
}
function cl({ className: e, variant: t = "default", ...n }) {
	return /* @__PURE__ */ N(ol.Provider, {
		value: t,
		children: /* @__PURE__ */ N(O.List, {
			"data-slot": "tabs-list",
			"data-variant": t,
			className: U("inline-flex w-fit max-w-full overflow-x-auto items-center gap-1 bg-[var(--Surface-Tertiary)] p-1 text-[var(--Text-Medium-Emphasis)]", t === "pill" ? "h-11 rounded-full" : "h-10 rounded-lg", e),
			...n
		})
	});
}
function ll({ className: e, ...t }) {
	let r = n.useContext(ol);
	return /* @__PURE__ */ N(O.Trigger, {
		"data-slot": "tabs-trigger",
		"data-variant": r,
		className: U("inline-flex items-center justify-center whitespace-nowrap typo-label-sm transition-all", r === "pill" ? "relative rounded-full px-4 py-1.5 gap-1.5" : "rounded-lg px-3 py-1.5", r === "pill" && "before:absolute before:inset-x-0 before:top-1/2 before:-translate-y-1/2 before:min-h-11 before:content-['']", "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50", "disabled:pointer-events-none disabled:opacity-50", "data-[state=active]:bg-[var(--Surface-Primary)] data-[state=active]:text-[var(--Text-High-Emphasis)] data-[state=active]:shadow-sm", r === "default" && "hover:text-[var(--Text-High-Emphasis)]", r === "pill" && "data-[state=inactive]:hover:text-[var(--Text-High-Emphasis)]", e),
		...t
	});
}
function ul({ className: e, ...t }) {
	return /* @__PURE__ */ N(O.Content, {
		"data-slot": "tabs-content",
		className: U("mt-2 focus-visible:outline-none", e),
		...t
	});
}
//#endregion
//#region src/components/ui/textarea.tsx
function dl({ className: e, autoGrow: t, showCount: r, maxLength: i, value: a, defaultValue: o, onChange: s, onCompositionStart: c, onCompositionEnd: l, ref: u, ...d }) {
	let { ref: f, getElement: p, length: m, syncFromDom: h, beginComposition: g, endComposition: _ } = Wn({
		enabled: r === !0,
		value: a,
		defaultValue: o,
		forwardedRef: u
	}), v = n.useCallback(() => {
		let e = p();
		e && (e.style.height = "auto", e.style.height = `${e.scrollHeight}px`);
	}, [p]);
	n.useEffect(() => {
		t && v();
	}, [
		t,
		v,
		a,
		o
	]);
	let y = n.useCallback((e) => {
		t && v(), r && h(), s?.(e);
	}, [
		t,
		v,
		s,
		r,
		h
	]), b = /* @__PURE__ */ N("textarea", {
		ref: f,
		"data-slot": "textarea",
		value: a,
		defaultValue: o,
		maxLength: i,
		className: U("flex min-h-[80px] w-full rounded-lg border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] px-3 py-2 typo-body-md text-[var(--Text-High-Emphasis)] transition-colors", "placeholder:text-[var(--Text-Low-Emphasis)]", "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50 focus-visible:border-[var(--Border-Accent-Primary)]", "disabled:cursor-not-allowed disabled:opacity-50", "aria-invalid:border-[var(--Border-Caution)]", t && "resize-none overflow-hidden", e),
		onChange: y,
		onCompositionStart: (e) => {
			g(), c?.(e);
		},
		onCompositionEnd: (e) => {
			_(), l?.(e);
		},
		...d
	});
	return r ? /* @__PURE__ */ P("div", {
		"data-slot": "textarea-with-count",
		className: "w-full",
		children: [b, /* @__PURE__ */ N("div", {
			className: "mt-1 flex justify-end",
			children: /* @__PURE__ */ P("span", {
				"data-slot": "textarea-count",
				className: U("typo-caption tabular-nums", i != null && m >= i ? "text-[var(--Text-Caution)]" : "text-[var(--Text-Low-Emphasis)]"),
				children: [m, i == null ? "" : `/${i}`]
			})
		})]
	}) : b;
}
//#endregion
//#region src/components/ui/auto-grow-textarea.tsx
function fl({ value: e, onChange: t, placeholder: r, minRows: i = 3, density: a = "default", maxLength: o, showCount: s, className: c, ...l }) {
	let u = n.useRef(null), d = n.useCallback(() => {
		let e = u.current;
		if (!e) return;
		e.style.height = "auto";
		let t = window.getComputedStyle(e), n = parseFloat(t.lineHeight) || 20, r = n * i + (parseFloat(t.paddingTop) || 0) + (parseFloat(t.paddingBottom) || 0), o = a === "compact" ? 0 : n, s = Math.max(e.scrollHeight + o, r);
		e.style.height = s + "px";
	}, [a, i]);
	n.useEffect(() => {
		d();
	}, [e, d]), n.useEffect(() => {
		let e = () => d();
		return window.addEventListener("resize", e), () => window.removeEventListener("resize", e);
	}, [d]);
	let f = o != null && o > 0 ? e.length / o : 0, p = o == null ? "" : e.length >= o ? "text-[var(--Text-Caution)]" : f >= .7 ? "text-[var(--Text-Warning)]" : "text-[var(--Text-Low-Emphasis)]", m = s === void 0 ? o != null : s;
	return /* @__PURE__ */ P("div", {
		"data-slot": "auto-grow-textarea",
		"data-density": a,
		"data-has-counter": m || void 0,
		className: "relative",
		children: [/* @__PURE__ */ N(dl, {
			ref: u,
			value: e,
			onChange: (e) => t(e.target.value),
			placeholder: r,
			rows: i,
			maxLength: o,
			className: U("w-full resize-none overflow-hidden", a === "compact" && "min-h-0!", m && "pr-16", c),
			...l
		}), m && /* @__PURE__ */ P("span", {
			"aria-hidden": "true",
			"data-slot": "auto-grow-textarea-counter",
			className: U("absolute right-2 bottom-2 typo-body-xs tabular-nums pointer-events-none select-none", p),
			children: [e.length, o == null ? "" : ` / ${o}`]
		})]
	});
}
//#endregion
//#region src/components/ui/commit-textarea.tsx
function pl({ value: e, onCommit: t, ...n }) {
	let { draft: r, handleChange: i, handleCompositionStart: a, handleCompositionEnd: o } = Jn(e, t);
	return /* @__PURE__ */ N(dl, {
		...n,
		value: r,
		onChange: (e) => i(e.target.value, e.nativeEvent.isComposing),
		onCompositionStart: a,
		onCompositionEnd: (e) => o(e.currentTarget.value)
	});
}
//#endregion
//#region src/components/ui/commit-auto-grow-textarea.tsx
function ml({ value: e, onCommit: t, ...n }) {
	let { draft: r, handleChange: i, handleCompositionStart: a, handleCompositionEnd: o } = Jn(e, t);
	return /* @__PURE__ */ N(fl, {
		...n,
		value: r,
		onChange: (e) => i(e),
		onCompositionStart: a,
		onCompositionEnd: (e) => o(e.currentTarget.value)
	});
}
//#endregion
//#region src/components/ui/tooltip.tsx
function hl({ delayDuration: e = 0, ...t }) {
	return /* @__PURE__ */ N(k.Provider, {
		"data-slot": "tooltip-provider",
		delayDuration: e,
		...t
	});
}
function gl({ ...e }) {
	return /* @__PURE__ */ N(hl, { children: /* @__PURE__ */ N(k.Root, {
		"data-slot": "tooltip",
		...e
	}) });
}
function _l({ ...e }) {
	return /* @__PURE__ */ N(k.Trigger, {
		"data-slot": "tooltip-trigger",
		...e
	});
}
function vl({ className: e, sideOffset: t = 4, children: n, ...r }) {
	return /* @__PURE__ */ N(k.Portal, { children: /* @__PURE__ */ N(k.Content, {
		"data-slot": "tooltip-content",
		sideOffset: t,
		className: U("z-50 overflow-hidden rounded-lg bg-[var(--Surface-Inverse)] px-3 py-1.5 typo-body-sm text-[var(--Text-on-Inverse)] shadow-[var(--shadow-tooltip)]", "animate-in fade-in-0 zoom-in-95", e),
		...r,
		children: n
	}) });
}
//#endregion
//#region src/components/ui/progress-ring.tsx
var yl = {
	sm: {
		size: 32,
		stroke: 3
	},
	md: {
		size: 48,
		stroke: 4
	},
	lg: {
		size: 64,
		stroke: 5
	},
	xl: {
		size: 96,
		stroke: 6
	}
};
function bl({ value: e, size: t = "md", label: n, showLabel: r = !0, className: i }) {
	let { size: a, stroke: o } = yl[t], s = (a - o) / 2, c = 2 * Math.PI * s, l = Math.min(100, Math.max(0, e)), u = c * (1 - l / 100);
	return /* @__PURE__ */ P("div", {
		"data-slot": "progress-ring",
		className: U("relative inline-flex items-center justify-center", i),
		style: {
			width: a,
			height: a
		},
		role: "progressbar",
		"aria-valuenow": l,
		"aria-valuemin": 0,
		"aria-valuemax": 100,
		children: [/* @__PURE__ */ P("svg", {
			width: a,
			height: a,
			className: "-rotate-90",
			children: [/* @__PURE__ */ N("circle", {
				cx: a / 2,
				cy: a / 2,
				r: s,
				fill: "none",
				stroke: "var(--Border-Low-Emphasis)",
				strokeWidth: o
			}), /* @__PURE__ */ N("circle", {
				cx: a / 2,
				cy: a / 2,
				r: s,
				fill: "none",
				stroke: "var(--Brand-Primary)",
				strokeWidth: o,
				strokeLinecap: "round",
				strokeDasharray: c,
				strokeDashoffset: u,
				style: { transition: "stroke-dashoffset 0.4s ease" }
			})]
		}), r && /* @__PURE__ */ N("span", {
			className: U("absolute inset-0 flex items-center justify-center", t === "sm" ? "typo-label-xs" : t === "md" ? "typo-label-sm" : "typo-label-md", "text-[var(--Text-High-Emphasis)]"),
			children: n ?? `${Math.round(l)}%`
		})]
	});
}
//#endregion
//#region src/components/ui/number-input.tsx
var xl = {
	sm: {
		wrap: "h-9 gap-2",
		btn: "w-8 h-8",
		icon: 14,
		text: "typo-label-sm w-8"
	},
	md: {
		wrap: "h-12 gap-3",
		btn: "w-10 h-10",
		icon: 16,
		text: "typo-body-md w-10"
	}
};
function Sl({ value: e = 0, onChange: t, min: r = -Infinity, max: i = Infinity, step: a = 1, format: o, placeholder: s = "0", disabled: c = !1, size: l = "md", className: u, decrementLabel: d = "減らす", incrementLabel: f = "増やす" }) {
	let [p, m] = n.useState(String(e)), [h, g] = n.useState(!1);
	n.useEffect(() => {
		h || m(String(e));
	}, [e, h]);
	let _ = (n) => {
		let a = parseFloat(n.replace(/[^0-9.-]/g, ""));
		if (isNaN(a)) {
			m(String(e));
			return;
		}
		let o = Math.min(i, Math.max(r, a));
		m(String(o)), t?.(o);
	}, v = () => {
		let n = Math.min(i, e + a);
		m(String(n)), t?.(n);
	}, y = () => {
		let n = Math.max(r, e - a);
		m(String(n)), t?.(n);
	}, b = h ? p : o ? o(e) : p, x = xl[l], S = U("flex items-center justify-center rounded-full border border-[var(--Border-Medium-Emphasis)] shrink-0 transition-colors select-none", x.btn, "border-[var(--Border-Medium-Emphasis)] text-[var(--Object-Medium-Emphasis)]", "hover:border-[var(--Brand-Primary)] hover:text-[var(--Brand-Primary)] hover:bg-[var(--Brand-Ultra-Light)]", "active:scale-95", "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[var(--Border-Medium-Emphasis)] disabled:hover:text-[var(--Object-Medium-Emphasis)] disabled:hover:bg-transparent");
	return /* @__PURE__ */ P("div", {
		"data-slot": "number-input",
		className: U("inline-flex items-center", x.wrap, c && "opacity-50 pointer-events-none", u),
		children: [
			/* @__PURE__ */ N("button", {
				type: "button",
				tabIndex: -1,
				disabled: c || e <= r,
				onClick: y,
				"aria-label": d,
				className: S,
				children: /* @__PURE__ */ N("svg", {
					width: x.icon,
					height: x.icon,
					viewBox: "0 0 16 16",
					fill: "none",
					children: /* @__PURE__ */ N("path", {
						d: "M3 8h10",
						stroke: "currentColor",
						strokeWidth: "1.5",
						strokeLinecap: "round"
					})
				})
			}),
			/* @__PURE__ */ N("input", {
				type: "text",
				inputMode: "decimal",
				value: b,
				placeholder: s,
				disabled: c,
				onChange: (e) => m(e.target.value),
				onFocus: () => {
					g(!0), m(String(e));
				},
				onBlur: (e) => {
					g(!1), _(e.target.value);
				},
				onKeyDown: (e) => {
					e.key === "Enter" && e.target.blur(), e.key === "ArrowUp" && (e.preventDefault(), v()), e.key === "ArrowDown" && (e.preventDefault(), y());
				},
				className: U("text-center bg-transparent focus-visible:outline-none text-[var(--Text-High-Emphasis)] placeholder:text-[var(--Text-Low-Emphasis)] tabular-nums", x.text)
			}),
			/* @__PURE__ */ N("button", {
				type: "button",
				tabIndex: -1,
				disabled: c || e >= i,
				onClick: v,
				"aria-label": f,
				className: S,
				children: /* @__PURE__ */ N("svg", {
					width: x.icon,
					height: x.icon,
					viewBox: "0 0 16 16",
					fill: "none",
					children: /* @__PURE__ */ N("path", {
						d: "M8 3v10M3 8h10",
						stroke: "currentColor",
						strokeWidth: "1.5",
						strokeLinecap: "round"
					})
				})
			})
		]
	});
}
//#endregion
//#region src/components/ui/pill-toggle.tsx
var Cl = {
	sm: "h-8 px-3 typo-label-xs",
	md: "h-9 px-4 typo-label-sm"
};
function wl({ options: e, value: t, onChange: n, size: r = "md", className: i }) {
	return /* @__PURE__ */ N(sl, {
		"data-slot": "pill-toggle",
		value: t,
		onValueChange: (e) => n(e),
		children: /* @__PURE__ */ N(cl, {
			variant: "pill",
			className: i,
			children: e.map((e) => /* @__PURE__ */ P(ll, {
				value: e.value,
				className: Cl[r],
				children: [e.icon && /* @__PURE__ */ N("span", {
					className: "shrink-0",
					children: e.icon
				}), e.label]
			}, e.value))
		})
	});
}
//#endregion
//#region src/components/ui/star-rating.tsx
var Tl = {
	sm: "w-4 h-4",
	md: "w-5 h-5",
	lg: "w-6 h-6",
	xl: "w-8 h-8"
}, El = {
	sm: "typo-label-xs",
	md: "typo-label-sm",
	lg: "typo-label-md",
	xl: "typo-label-lg"
};
function Dl({ filled: e, half: t, className: n }) {
	return t ? /* @__PURE__ */ P("svg", {
		viewBox: "0 0 24 24",
		className: n,
		"aria-hidden": !0,
		children: [/* @__PURE__ */ N("defs", { children: /* @__PURE__ */ P("linearGradient", {
			id: "half-fill",
			children: [/* @__PURE__ */ N("stop", {
				offset: "50%",
				stopColor: "currentColor"
			}), /* @__PURE__ */ N("stop", {
				offset: "50%",
				stopColor: "transparent"
			})]
		}) }), /* @__PURE__ */ N("path", {
			d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
			fill: "url(#half-fill)",
			stroke: "currentColor",
			strokeWidth: "1.5",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})]
	}) : /* @__PURE__ */ N("svg", {
		viewBox: "0 0 24 24",
		className: n,
		"aria-hidden": !0,
		children: /* @__PURE__ */ N("path", {
			d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
			fill: e ? "currentColor" : "none",
			stroke: "currentColor",
			strokeWidth: "1.5",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})
	});
}
function Ol({ value: e, onChange: t, max: r = 5, size: i = "md", showLabel: a = !1, className: o }) {
	let [s, c] = n.useState(null), l = !!t, u = s ?? e;
	return /* @__PURE__ */ P("div", {
		"data-slot": "star-rating",
		role: l ? "radiogroup" : void 0,
		"aria-label": l ? "評価" : `${e}/${r}点`,
		className: U("inline-flex items-center gap-0.5", o),
		children: [Array.from({ length: r }, (n, r) => {
			let a = r + 1, o = u >= a, s = !o && u >= a - .5;
			return /* @__PURE__ */ N("button", {
				type: "button",
				role: l ? "radio" : void 0,
				"aria-checked": l ? e === a : void 0,
				"aria-label": l ? `${a}点` : void 0,
				disabled: !l,
				onClick: () => t?.(a),
				onMouseEnter: () => l && c(a),
				onMouseLeave: () => l && c(null),
				className: U("transition-colors text-[var(--Brand-Primary)]", Tl[i], l ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default pointer-events-none", !o && !s && "text-[var(--Border-Medium-Emphasis)]"),
				children: /* @__PURE__ */ N(Dl, {
					filled: o,
					half: s,
					className: "w-full h-full"
				})
			}, r);
		}), a && /* @__PURE__ */ P("span", {
			className: U("ml-1 text-[var(--Text-Medium-Emphasis)]", El[i]),
			children: [
				e,
				"/",
				r
			]
		})]
	});
}
//#endregion
//#region src/components/ui/countdown-timer.tsx
function kl(e) {
	return String(e).padStart(2, "0");
}
function Al(e) {
	let t = Math.max(0, e.getTime() - Date.now()), n = Math.floor(t / 1e3);
	return {
		h: Math.floor(n / 3600),
		m: Math.floor(n % 3600 / 60),
		s: n % 60,
		totalSec: n
	};
}
function jl(e) {
	let t = /* @__PURE__ */ new Date();
	t.setHours(0, 0, 0, 0);
	let n = new Date(e);
	return n.setHours(0, 0, 0, 0), Math.round((n.getTime() - t.getTime()) / (1440 * 60 * 1e3));
}
function Ml({ targetDate: e, label: t = "残り", endedLabel: r = "受付終了", todayLabel: i = "本日", variant: a = "filled", className: o, onEnd: s, dayUnit: c = "日" }) {
	let [l, u] = n.useState(() => jl(e));
	return n.useEffect(() => {
		u(jl(e));
		let t = setInterval(() => u(jl(e)), 3600 * 1e3);
		return () => clearInterval(t);
	}, [e]), n.useEffect(() => {
		l < 0 && s?.();
	}, [l, s]), l < 0 ? /* @__PURE__ */ N("span", {
		"data-slot": "countdown-timer",
		"data-granularity": "day",
		"data-state": "ended",
		className: U("inline-flex items-center gap-1.5 px-3 py-2 rounded-lg", "bg-[var(--Surface-Tertiary)] text-[var(--Text-Low-Emphasis)]", "typo-label-sm", o),
		children: r
	}) : l === 0 ? /* @__PURE__ */ N("span", {
		"data-slot": "countdown-timer",
		"data-granularity": "day",
		"data-state": "today",
		className: U("inline-flex items-center gap-1 px-3 py-2 rounded-lg font-variant-nums", a === "filled" ? "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)]" : "border-2 border-[var(--Brand-Primary)] text-[var(--Brand-Primary)]", o),
		children: /* @__PURE__ */ N("span", {
			className: "typo-heading-xl leading-none",
			children: i
		})
	}) : /* @__PURE__ */ P("span", {
		"data-slot": "countdown-timer",
		"data-granularity": "day",
		"data-state": "active",
		"data-variant": a,
		"aria-label": `${t} ${l}${c}`,
		className: U("inline-flex items-baseline gap-1 px-3 py-2 rounded-lg font-variant-nums", a === "filled" ? "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)]" : "border-2 border-[var(--Brand-Primary)] text-[var(--Brand-Primary)]", o),
		children: [
			t && /* @__PURE__ */ N("span", {
				className: "typo-caption opacity-80 mr-1",
				children: t
			}),
			/* @__PURE__ */ N("span", {
				className: "typo-heading-3xl leading-none tabular-nums",
				children: l
			}),
			/* @__PURE__ */ N("span", {
				className: "typo-label-sm opacity-80",
				children: c
			})
		]
	});
}
function Nl({ targetDate: e, granularity: t = "second", label: r = "残り", endedLabel: i = "受付終了", variant: a = "filled", compact: o = !1, className: s, onEnd: c, hourUnit: l = "時間", minuteUnit: u = "分", secondUnit: d = "秒" }) {
	let [f, p] = n.useState(() => Al(e)), [m, h] = n.useState(() => Date.now() >= e.getTime() ? "ended" : "active"), g = n.useRef(!1), _ = t === "hour" ? 60 * 1e3 : 1e3;
	if (n.useEffect(() => {
		g.current = !1;
		let t = () => {
			let t = Al(e);
			p(t), t.totalSec === 0 && !g.current && (g.current = !0, h("ended"), c?.());
		};
		t();
		let n = setInterval(t, _);
		return () => clearInterval(n);
	}, [
		e,
		c,
		_
	]), m === "ended") return /* @__PURE__ */ P("span", {
		"data-slot": "countdown-timer",
		"data-granularity": t,
		"data-state": "ended",
		className: U("inline-flex items-center gap-1.5 px-3 py-2 rounded-lg", "bg-[var(--Surface-Tertiary)] text-[var(--Text-Low-Emphasis)]", "typo-label-sm", s),
		children: [/* @__PURE__ */ P("svg", {
			width: "14",
			height: "14",
			viewBox: "0 0 14 14",
			fill: "none",
			"aria-hidden": "true",
			children: [/* @__PURE__ */ N("circle", {
				cx: "7",
				cy: "7",
				r: "6",
				stroke: "currentColor",
				strokeWidth: "1.5"
			}), /* @__PURE__ */ N("path", {
				d: "M7 4v3.5l2 2",
				stroke: "currentColor",
				strokeWidth: "1.5",
				strokeLinecap: "round"
			})]
		}), i]
	});
	let { h: v, m: y, s: b } = f, x = t === "hour" ? [{
		num: kl(v),
		unit: l
	}, {
		num: kl(y),
		unit: u
	}] : t === "minute" ? [...v > 0 ? [{
		num: kl(v),
		unit: l
	}] : [], {
		num: kl(y),
		unit: u
	}] : o ? [{
		num: kl(y),
		unit: u
	}, {
		num: kl(b),
		unit: d
	}] : [
		...v > 0 ? [{
			num: kl(v),
			unit: l
		}] : [],
		{
			num: kl(y),
			unit: u
		},
		{
			num: kl(b),
			unit: d
		}
	], S = a === "filled";
	return /* @__PURE__ */ P("span", {
		"data-slot": "countdown-timer",
		"data-granularity": t,
		"data-state": "active",
		"data-variant": a,
		"aria-live": "off",
		"aria-label": `${r} ${v}${l}${y}${u}${b}${d}`,
		className: U("inline-flex items-center gap-1 px-3 py-2 rounded-lg font-variant-nums", S ? "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)]" : "border-2 border-[var(--Brand-Primary)] text-[var(--Brand-Primary)]", s),
		children: [r && /* @__PURE__ */ N("span", {
			className: "typo-caption opacity-80 mr-1",
			children: r
		}), x.map((e, t) => /* @__PURE__ */ P(n.Fragment, { children: [t > 0 && /* @__PURE__ */ N("span", {
			className: "typo-heading-lg opacity-70 mb-1.5",
			children: ":"
		}), /* @__PURE__ */ P("span", {
			className: "flex flex-col items-center gap-0",
			children: [/* @__PURE__ */ N("span", {
				className: "typo-heading-xl leading-none tabular-nums",
				children: e.num
			}), /* @__PURE__ */ N("span", {
				className: "typo-body-xs opacity-70 leading-none mt-0.5",
				children: e.unit
			})]
		})] }, e.unit))]
	});
}
function Pl(e) {
	return e.granularity === "day" ? /* @__PURE__ */ N(Ml, { ...e }) : /* @__PURE__ */ N(Nl, { ...e });
}
//#endregion
//#region src/components/ui/sub-nav.tsx
function Fl({ items: e, value: t, onChange: r, variant: i = "underline", sticky: a = !1, className: o }) {
	let s = n.useRef(null), c = n.useRef(null), l = n.useId();
	return n.useEffect(() => {
		let e = s.current, t = c.current;
		if (!e || !t) return;
		let n = e.offsetLeft + e.offsetWidth / 2, r = t.clientWidth / 2;
		t.scrollTo({
			left: n - r,
			behavior: "smooth"
		});
	}, [t]), i === "chip" ? /* @__PURE__ */ N("div", {
		"data-slot": "sub-nav",
		"data-variant": "chip",
		ref: c,
		className: U("flex gap-2 overflow-x-auto scrollbar-none px-1 py-3", a && "sticky top-0 z-30 bg-[var(--Surface-Primary)]", o),
		role: "tablist",
		children: e.map((e) => {
			let n = e.value === t, i = e.description ?? e.title, a = i ? `${l}-${e.value}-description` : void 0;
			return /* @__PURE__ */ P("button", {
				ref: n ? s : void 0,
				role: "tab",
				"aria-selected": n,
				"aria-describedby": a,
				title: i,
				onClick: () => r(e.value),
				className: U("flex items-center gap-1.5 shrink-0 px-3.5 py-1.5 rounded-full border border-transparent typo-label-md transition-colors", n ? "bg-[var(--Brand-Primary)] border-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)]" : "border-transparent bg-[var(--Surface-Tertiary)] text-[var(--Text-Medium-Emphasis)] hover:bg-[var(--Surface-Quaternary)] hover:text-[var(--Text-High-Emphasis)]"),
				children: [
					e.label,
					e.badge !== void 0 && /* @__PURE__ */ N("span", {
						className: U("inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full typo-label-xs", n ? "bg-[color-mix(in_srgb,var(--Text-on-Inverse)_30%,transparent)] text-[var(--Text-on-Inverse)]" : "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)]"),
						children: e.badge
					}),
					i && /* @__PURE__ */ N("span", {
						id: a,
						className: "sr-only",
						children: i
					})
				]
			}, e.value);
		})
	}) : /* @__PURE__ */ N("div", {
		"data-slot": "sub-nav",
		"data-variant": "underline",
		className: U("border-b border-[var(--Border-Low-Emphasis)]", a && "sticky top-0 z-30 bg-[var(--Surface-Primary)]", o),
		children: /* @__PURE__ */ N("div", {
			ref: c,
			className: "flex overflow-x-auto scrollbar-none px-1",
			role: "tablist",
			children: e.map((e) => {
				let n = e.value === t, i = e.description ?? e.title, a = i ? `${l}-${e.value}-description` : void 0;
				return /* @__PURE__ */ P("button", {
					ref: n ? s : void 0,
					role: "tab",
					"aria-selected": n,
					"aria-describedby": a,
					title: i,
					onClick: () => r(e.value),
					className: U("flex items-center gap-1.5 shrink-0 px-4 py-3 typo-label-md transition-colors border-b-[3px] -mb-px", n ? "border-[var(--Brand-Primary)] text-[var(--Brand-Primary)]" : "border-transparent text-[var(--Text-Medium-Emphasis)] hover:text-[var(--Text-High-Emphasis)]"),
					children: [
						e.label,
						e.badge !== void 0 && /* @__PURE__ */ N("span", {
							className: "inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full typo-label-xs bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)]",
							children: e.badge
						}),
						i && /* @__PURE__ */ N("span", {
							id: a,
							className: "sr-only",
							children: i
						})
					]
				}, e.value);
			})
		})
	});
}
//#endregion
//#region src/components/ui/section-nav.tsx
function Il({ items: e, activeKey: t, orientation: n = "vertical", onItemClick: r, className: i, "aria-label": a = "ページ内セクション", ...o }) {
	let s = n === "horizontal";
	return /* @__PURE__ */ N("nav", {
		...o,
		"data-slot": "section-nav",
		"data-orientation": n,
		"aria-label": a,
		className: U("w-full", s && "overflow-x-auto overscroll-x-contain scrollbar-hide", i),
		children: /* @__PURE__ */ N("ul", {
			className: U(s ? "flex min-w-max items-stretch border-b border-[var(--Border-Low-Emphasis)]" : "flex flex-col gap-1 py-1"),
			children: e.map((e) => {
				let n = e.key === t;
				return /* @__PURE__ */ N("li", {
					className: U(s && "shrink-0"),
					children: /* @__PURE__ */ N("a", {
						href: e.href,
						"aria-current": n ? "location" : void 0,
						onClick: (t) => r?.(e.key, t),
						className: U("flex min-h-11 items-center transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-[var(--Focus-High-Emphasis)]/50", s ? "border-b-2 border-transparent px-4 py-3 typo-label-md whitespace-nowrap" : "border-l-2 border-transparent px-3 py-2 typo-body-md", n ? s ? "border-[var(--Brand-Primary)] text-[var(--Text-High-Emphasis)]" : "border-[var(--Brand-Primary)] bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)]" : s ? "text-[var(--Text-Low-Emphasis)] hover:text-[var(--Text-High-Emphasis)]" : "text-[var(--Text-Medium-Emphasis)] hover:bg-[var(--Surface-Secondary)] hover:text-[var(--Text-High-Emphasis)]"),
						children: e.label
					})
				}, e.key);
			})
		})
	});
}
//#endregion
//#region src/components/ui/icon-badge.tsx
var Ll = F("inline-flex shrink-0 items-center justify-center text-[var(--Object-Accent-Primary)]", {
	variants: {
		size: {
			md: "size-11",
			ml: "size-12",
			lg: "size-18"
		},
		appearance: {
			accent: "rounded-full bg-[var(--Surface-Accent-Primary-Light)]",
			plain: ""
		}
	},
	compoundVariants: [
		{
			appearance: "accent",
			size: "md",
			className: "[&_svg]:size-5"
		},
		{
			appearance: "accent",
			size: "ml",
			className: "[&_svg]:size-6"
		},
		{
			appearance: "accent",
			size: "lg",
			className: "[&_svg]:size-[2.375rem]"
		},
		{
			appearance: "plain",
			size: [
				"md",
				"ml",
				"lg"
			],
			className: "size-auto"
		}
	],
	defaultVariants: {
		size: "md",
		appearance: "accent"
	}
});
function Rl({ className: e, size: t, appearance: n, "aria-label": r, ...i }) {
	return /* @__PURE__ */ N("span", {
		"data-slot": "icon-badge",
		"data-size": t ?? "md",
		"data-appearance": n ?? "accent",
		role: r ? "img" : void 0,
		"aria-hidden": r ? void 0 : !0,
		"aria-label": r,
		className: U(Ll({
			size: t,
			appearance: n
		}), e),
		...i
	});
}
//#endregion
//#region src/components/ui/coach-mark.tsx
var zl = {
	top: "top",
	bottom: "bottom",
	left: "left",
	right: "right"
};
function Bl({ content: e, children: t, placement: n = "top", variant: r = "default", open: i, onOpenChange: a, step: o, totalSteps: s, onNext: c, showClose: l, onClose: u, delayDuration: d = 0, className: f }) {
	let p = o !== void 0, m = typeof e == "string" ? e : "コーチマーク";
	return /* @__PURE__ */ N(k.Provider, {
		delayDuration: d,
		children: /* @__PURE__ */ P(k.Root, {
			open: i,
			onOpenChange: a,
			children: [/* @__PURE__ */ N(k.Trigger, {
				asChild: !0,
				children: t
			}), /* @__PURE__ */ N(k.Portal, { children: /* @__PURE__ */ P(k.Content, {
				"data-slot": "coach-mark",
				"data-variant": r,
				"aria-label": m,
				side: zl[n],
				sideOffset: 8,
				className: U("z-50 max-w-[240px] rounded-lg px-3 py-2 typo-body-sm leading-relaxed shadow-[var(--shadow-tooltip)]", "data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0", "data-[state=closed]:animate-out data-[state=closed]:fade-out-0", r === "brand" ? "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)]" : "bg-[var(--Surface-Inverse)] text-[var(--Text-on-Inverse)]", f),
				children: [p ? /* @__PURE__ */ P("div", {
					className: "flex flex-col gap-2",
					children: [
						s && /* @__PURE__ */ P("span", {
							className: "typo-label-xs opacity-70",
							children: [
								o,
								" / ",
								s
							]
						}),
						/* @__PURE__ */ N("div", { children: e }),
						(c || l) && /* @__PURE__ */ P("div", {
							className: "flex items-center justify-between mt-1",
							children: [l && /* @__PURE__ */ N("button", {
								onClick: u,
								className: "typo-label-xs opacity-60 hover:opacity-100 transition-opacity",
								children: "スキップ"
							}), c && /* @__PURE__ */ N("button", {
								onClick: c,
								className: "typo-label-xs bg-[var(--Object-on-Inverse)]/20 hover:bg-[var(--Object-on-Inverse)]/30 px-2.5 py-0.5 rounded-md transition-colors ml-auto",
								children: "次へ →"
							})]
						})
					]
				}) : e, /* @__PURE__ */ N(k.Arrow, {
					className: U(r === "brand" ? "fill-[var(--Brand-Primary)]" : "fill-[var(--Surface-Inverse)]"),
					width: 10,
					height: 5
				})]
			}) })]
		})
	});
}
//#endregion
//#region src/components/patterns/coach-mark-overlay.tsx
var Vl = "ksk-coach-done", Hl = "v1";
function Ul({ steps: e, open: t, onComplete: r, onSkip: i, variant: a = "default", ringColor: o = "var(--Brand-Primary)", maxWidth: s = 280 }) {
	let [c, l] = n.useState(0), [u, d] = n.useState(null), [f, p] = n.useState(!1);
	if (n.useEffect(() => {
		p(!0);
	}, []), n.useEffect(() => {
		if (!t) return;
		let n = e[c];
		if (!n) return;
		let r = () => {
			let e = document.querySelector(n.selector);
			d(e ? e.getBoundingClientRect() : null);
		}, i = document.querySelector(n.selector);
		i && i.scrollIntoView({
			block: "center",
			behavior: "instant"
		}), r();
		let a = setTimeout(r, 100);
		return window.addEventListener("resize", r), window.addEventListener("scroll", r, !0), () => {
			clearTimeout(a), window.removeEventListener("resize", r), window.removeEventListener("scroll", r, !0);
		};
	}, [
		c,
		t,
		e
	]), !t || !e[c] || !f || typeof document > "u") return null;
	let m = e[c], h = c === e.length - 1, g = m.padding ?? 8, _ = m.placement && m.placement !== "auto" ? m.placement : u && typeof window < "u" ? window.innerHeight - u.bottom > 200 ? "bottom" : "top" : "bottom", v = () => {
		h ? r() : l(c + 1);
	}, y = !!u, b = y && u ? {
		position: "fixed",
		top: Math.max(0, u.top - g),
		left: Math.max(0, u.left - g),
		width: u.width + g * 2,
		height: u.height + g * 2,
		pointerEvents: "none",
		outline: `2px solid ${o}`,
		outlineOffset: 0,
		borderRadius: 16,
		boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
		zIndex: 50
	} : {
		position: "fixed",
		top: "50%",
		left: "50%",
		width: 1,
		height: 1,
		pointerEvents: "none",
		zIndex: 50
	};
	return de(/* @__PURE__ */ P("div", {
		"data-slot": "coach-mark-overlay",
		"data-step": c + 1,
		"data-total": e.length,
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "Onboarding coach mark",
		children: [
			!y && /* @__PURE__ */ N("div", {
				className: "fixed inset-0 bg-black/55 z-50 pointer-events-none",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ N("div", { style: b }),
			/* @__PURE__ */ N(Bl, {
				content: /* @__PURE__ */ P("div", {
					className: U("max-w-xs"),
					style: { maxWidth: s },
					children: [/* @__PURE__ */ N("p", {
						className: "typo-label-md text-[var(--Text-on-Inverse)] mb-1",
						children: m.title
					}), /* @__PURE__ */ N("p", {
						className: "typo-body-sm text-[var(--Text-on-Inverse)] opacity-90 whitespace-pre-line",
						children: m.desc
					})]
				}),
				placement: _,
				variant: a,
				open: !0,
				step: c + 1,
				totalSteps: e.length,
				onNext: v,
				showClose: !!i,
				onClose: i,
				className: "py-4! px-4!",
				children: /* @__PURE__ */ N("span", {
					className: "fixed pointer-events-none",
					style: y && u ? {
						top: u.top,
						left: u.left + u.width / 2,
						width: 1,
						height: 1
					} : {
						top: "50%",
						left: "50%"
					},
					"aria-hidden": "true"
				})
			})
		]
	}), document.body);
}
function Wl(e = Vl, t = Hl) {
	if (typeof window > "u") return !0;
	try {
		return localStorage.getItem(e) === t;
	} catch {
		return !0;
	}
}
function Gl(e = Vl, t = Hl) {
	if (!(typeof window > "u")) try {
		localStorage.setItem(e, t);
	} catch {}
}
function Kl(e = Vl) {
	if (!(typeof window > "u")) try {
		localStorage.removeItem(e);
	} catch {}
}
//#endregion
//#region src/components/patterns/cookie-consent.tsx
var ql = "ksk-cookie-consent", Jl = "ksk:cookie-decided", Yl = {
	title: "Cookies",
	description: "This site uses cookies for analytics and feature improvement. You can choose essential-only or accept all.",
	essentialOnly: "Essential only",
	accept: "Accept",
	ariaLabel: "Cookie consent"
};
function Xl(e = ql) {
	if (typeof window > "u") return !0;
	try {
		return !!localStorage.getItem(e);
	} catch {
		return !0;
	}
}
function Zl(e) {
	try {
		return typeof localStorage < "u" ? localStorage.getItem(e) : null;
	} catch {
		return null;
	}
}
function Ql(e, t) {
	try {
		typeof localStorage < "u" && localStorage.setItem(e, t);
	} catch {}
}
function $l({ labels: e, showDelay: t = 1500, storageKey: r = ql, eventName: i = Jl, icon: a = /* @__PURE__ */ N("span", {
	"aria-hidden": "true",
	className: "text-xl flex-shrink-0",
	children: "🍪"
}), onDecide: o, className: s }) {
	let [c, l] = n.useState(!1), u = {
		...Yl,
		...e
	};
	n.useEffect(() => {
		if (!Zl(r)) {
			let e = setTimeout(() => l(!0), t);
			return () => clearTimeout(e);
		}
	}, [r, t]);
	let d = (e) => {
		Ql(r, e), Ql(`${r}-at`, (/* @__PURE__ */ new Date()).toISOString()), l(!1), o?.(e), typeof window < "u" && window.dispatchEvent(new CustomEvent(i, { detail: { choice: e } }));
	};
	return c ? /* @__PURE__ */ N("div", {
		"data-slot": "cookie-consent",
		role: "dialog",
		"aria-modal": "false",
		"aria-label": u.ariaLabel,
		className: U("fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]", s),
		children: /* @__PURE__ */ P("div", {
			className: "max-w-2xl mx-auto bg-[var(--Surface-Primary)] border border-[var(--Border-Low-Emphasis)] rounded-2xl p-4 shadow-[var(--shadow-dialog)]",
			children: [/* @__PURE__ */ P("div", {
				className: "flex items-start gap-3 mb-3",
				children: [a, /* @__PURE__ */ P("div", {
					className: "flex-1",
					children: [/* @__PURE__ */ N("p", {
						className: "typo-heading-sm text-[var(--Text-High-Emphasis)] mb-1",
						children: u.title
					}), /* @__PURE__ */ N("p", {
						className: "typo-body-xs text-[var(--Text-Medium-Emphasis)] leading-relaxed",
						children: u.description
					})]
				})]
			}), /* @__PURE__ */ P("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ N(W, {
					onClick: () => d("essential"),
					variant: "secondary",
					size: "lg",
					className: "flex-1",
					children: u.essentialOnly
				}), /* @__PURE__ */ N(W, {
					onClick: () => d("accept"),
					variant: "default",
					size: "lg",
					className: "flex-1",
					children: u.accept
				})]
			})]
		})
	}) : null;
}
//#endregion
//#region src/components/ui/social-icon-data.tsx
var eu = {
	amazon: "Amazon",
	android: "Android",
	apple: "Apple",
	"apple-music": "Apple Music",
	"apple-podcasts": "Apple Podcasts",
	artstation: "ArtStation",
	baidu: "Baidu",
	behance: "Behance",
	boosty: "Boosty",
	devianart: "DevianArt",
	discord: "Discord",
	dprofile: "Dprofile",
	dribbble: "Dribbble",
	dzen: "Dzen",
	facebook: "Facebook",
	figma: "Figma",
	github: "Github",
	gmail: "Gmail",
	google: "Google",
	"google-meet": "Google Meet",
	"google-play": "Google Play",
	"google-podcast": "Google Podcast",
	imo: "Imo",
	instagram: "Instagram",
	kickstarter: "Kickstarter",
	line: "Line",
	linkedin: "LinkedIn",
	medium: "Medium",
	messenger: "Messenger",
	"microsoft-teams": "Microsoft Teams",
	notion: "Notion",
	ok: "OK",
	"ok-only-sign": "OK (Only sign)",
	onlyfans: "OnlyFans",
	patreon: "Patreon",
	paypal: "PayPal",
	pinterest: "Pinterest",
	"product-hunt": "Product Hunt",
	qiita: "Qiita",
	quora: "Quora",
	reddit: "Reddit",
	signal: "Signal",
	"sina-weibo": "Sina Weibo",
	skype: "Skype",
	slack: "Slack",
	snapchat: "Snapchat",
	soundcloud: "SoundCloud",
	spotify: "Spotify",
	"stack-overflow": "Stack Overflow",
	telegram: "Telegram",
	"telegram-only-sign": "Telegram (Only sign)",
	threads: "Threads",
	tiktok: "TikTok",
	tinder: "Tinder",
	tumblr: "Tumblr",
	twitch: "Twitch",
	viber: "Viber",
	vimeo: "Vimeo",
	vk: "VK",
	"vk-music": "VK Music",
	"vk-only-sign": "VK (Only sign)",
	wantedly: "Wantedly",
	wechat: "WeChat",
	whatsapp: "WhatsApp",
	"x-ex-twitter": "X ex Twitter",
	xing: "Xing",
	"yandex-music": "Yandex Music",
	yelp: "Yelp",
	youtube: "YouTube",
	"youtube-music": "Youtube Music",
	"youtube-shorts": "YouTube Shorts",
	zoom: "Zoom"
}, tu = {
	amazon: {
		mono: {
			viewBox: "0 0 250 250",
			body: /* @__PURE__ */ P(M, { children: [
				/* @__PURE__ */ N("path", {
					d: "M8.15422 184.565C11.8493 184.532 19.8894 190.019 23.3705 192.118C35.9491 199.701 48.2118 206.479 62.0016 211.725C67.4422 213.795 72.6607 215.222 78.1148 217.072C105.075 226.217 135.394 225.974 162.982 219.833C166.277 219.101 169.495 217.706 172.709 216.903C185.821 213.629 198.472 208.674 210.888 203.388C213.693 202.194 220.869 198.638 220.835 204.446C220.66 207.718 213.863 213.151 211.342 215.162C209.043 216.958 206.734 219.413 204.353 221C166.237 246.382 115.75 253.645 73.0919 235.648C63.578 231.633 54.4442 227.614 45.5797 222.237C41.9869 220.179 38.7342 216.973 35.2984 214.782C25.1715 208.324 17.2604 200.219 9.06052 191.581C6.95386 189.361 3.9895 186.62 8.15422 184.565Z",
					fill: "currentColor"
				}),
				/* @__PURE__ */ N("path", {
					d: "M222.771 182.46C226.75 181.957 244.179 182.264 244.726 187.976C245.593 197.035 242.062 207.804 237.425 215.559C235.733 218.388 228.641 230.449 224.366 227.928C223.443 225.901 226.353 220.73 226.94 217.921C228.555 212.276 233.456 201.027 231.694 195.068C230.382 190.634 215.332 192.125 211.318 192.26C208.325 192.361 201.454 193.896 198.079 192.933C197.527 192.776 197.479 192.492 197.318 192.063C197.403 191.679 197.58 191.197 197.867 190.914C204.571 184.317 214.099 183.484 222.771 182.46Z",
					fill: "currentColor"
				}),
				/* @__PURE__ */ N("path", {
					d: "M117.465 0H140.064C141.444 0.854363 146.438 1.22734 148.328 1.6638C155.337 3.2821 163.643 5.38437 169.653 9.44556C176.329 13.9566 182.775 18.851 186.55 26.1238C194.264 40.9856 192.84 61.8935 192.836 78.3655L192.82 110.716C192.817 120.875 191.969 129.546 196.059 139.177C197.683 143.674 210.827 155.8 205.762 160.514C197.994 167.688 189.155 174.096 181.688 181.65C175.037 188.378 169.224 181.86 164.666 176.647C160.644 172.048 157.094 166.958 153.181 162.268C142.048 174.391 127.392 184.316 110.613 185.248C94.6292 186.135 81.0027 185.866 67.9949 174.975C56.8133 165.613 52.8985 152.987 51.3826 138.936C50.4685 123.929 55.2071 108.004 65.1221 96.5774C69.3955 91.6523 70.2708 90.937 75.564 87.3518C89.0479 78.2187 104.417 76.0557 120.03 73.5818C129.356 72.104 137.446 71.0591 146.852 70.259C147.271 57.9651 148.636 40.304 133.599 36.1846C121.15 32.8618 105.092 36.1509 100.461 49.7187C98.9029 54.2844 99.1021 57.6587 94.4134 60.1223C90.8045 60.2249 63.918 57.4329 61.0083 56.4319C59.6367 55.96 58.2376 55.3457 57.5955 53.9604C55.815 50.1194 58.4304 42.8684 59.8206 39.1768C61.4143 34.9446 63.3987 30.5337 65.9532 26.7947C70.7657 19.7506 80.7014 11.6803 88.4097 7.9407C92.9256 5.7498 98.0501 4.20654 102.906 2.95303C104.805 2.46277 106.73 1.95354 108.666 1.6355C111.332 1.19745 114.848 1.22583 117.285 0.0856145L117.465 0ZM106.42 148.282C117 156.288 131.688 151.264 138.974 141.2C148.098 128.598 147.041 111.968 146.922 97.1641C145.928 97.21 144.735 97.2986 143.757 97.2988C121.257 97.7964 98.6773 102.681 99.1892 130.009C99.3103 136.461 101.033 143.213 105.848 147.757C106.036 147.935 106.227 148.11 106.42 148.282Z",
					fill: "currentColor"
				})
			] })
		},
		brand: {
			viewBox: "0 0 250 250",
			body: /* @__PURE__ */ P(M, { children: [
				/* @__PURE__ */ N("path", {
					d: "M8.15422 184.565C11.8493 184.532 19.8894 190.019 23.3705 192.118C35.9491 199.701 48.2118 206.479 62.0016 211.725C67.4422 213.795 72.6607 215.222 78.1148 217.072C105.075 226.217 135.394 225.974 162.982 219.833C166.277 219.101 169.495 217.706 172.709 216.903C185.821 213.629 198.472 208.674 210.888 203.388C213.693 202.194 220.869 198.638 220.835 204.446C220.66 207.718 213.863 213.151 211.342 215.162C209.043 216.958 206.734 219.413 204.353 221C166.237 246.382 115.75 253.645 73.0919 235.648C63.578 231.633 54.4442 227.614 45.5797 222.237C41.9869 220.179 38.7342 216.973 35.2984 214.782C25.1715 208.324 17.2604 200.219 9.06052 191.581C6.95386 189.361 3.9895 186.62 8.15422 184.565Z",
					fill: "#FC9600"
				}),
				/* @__PURE__ */ N("path", {
					d: "M222.771 182.46C226.75 181.957 244.179 182.264 244.726 187.976C245.593 197.035 242.062 207.804 237.425 215.559C235.733 218.388 228.641 230.449 224.366 227.928C223.443 225.901 226.353 220.73 226.94 217.921C228.555 212.276 233.456 201.027 231.694 195.068C230.382 190.634 215.332 192.125 211.318 192.26C208.325 192.361 201.454 193.896 198.079 192.933C197.527 192.776 197.479 192.492 197.318 192.063C197.403 191.679 197.58 191.197 197.867 190.914C204.571 184.317 214.099 183.484 222.771 182.46Z",
					fill: "#FC9600"
				}),
				/* @__PURE__ */ N("path", {
					d: "M117.465 0H140.064C141.444 0.854363 146.438 1.22734 148.328 1.6638C155.337 3.2821 163.643 5.38437 169.653 9.44556C176.329 13.9566 182.775 18.851 186.55 26.1238C194.264 40.9856 192.84 61.8935 192.836 78.3655L192.82 110.716C192.817 120.875 191.969 129.546 196.059 139.177C197.683 143.674 210.827 155.8 205.762 160.514C197.994 167.688 189.155 174.096 181.688 181.65C175.037 188.378 169.224 181.86 164.666 176.647C160.644 172.048 157.094 166.958 153.181 162.268C142.048 174.391 127.392 184.316 110.613 185.248C94.6292 186.135 81.0027 185.866 67.9949 174.975C56.8133 165.613 52.8985 152.987 51.3826 138.936C50.4685 123.929 55.2071 108.004 65.1221 96.5774C69.3955 91.6523 70.2708 90.937 75.564 87.3518C89.0479 78.2187 104.417 76.0557 120.03 73.5818C129.356 72.104 137.446 71.0591 146.852 70.259C147.271 57.9651 148.636 40.304 133.599 36.1846C121.15 32.8618 105.092 36.1509 100.461 49.7187C98.9029 54.2844 99.1021 57.6587 94.4134 60.1223C90.8045 60.2249 63.918 57.4329 61.0083 56.4319C59.6367 55.96 58.2376 55.3457 57.5955 53.9604C55.815 50.1194 58.4304 42.8684 59.8206 39.1768C61.4143 34.9446 63.3987 30.5337 65.9532 26.7947C70.7657 19.7506 80.7014 11.6803 88.4097 7.9407C92.9256 5.7498 98.0501 4.20654 102.906 2.95303C104.805 2.46277 106.73 1.95354 108.666 1.6355C111.332 1.19745 114.848 1.22583 117.285 0.0856145L117.465 0ZM106.42 148.282C117 156.288 131.688 151.264 138.974 141.2C148.098 128.598 147.041 111.968 146.922 97.1641C145.928 97.21 144.735 97.2986 143.757 97.2988C121.257 97.7964 98.6773 102.681 99.1892 130.009C99.3103 136.461 101.033 143.213 105.848 147.757C106.036 147.935 106.227 148.11 106.42 148.282Z",
					fill: "#0A0A0A"
				})
			] })
		}
	},
	android: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ N(M, { children: /* @__PURE__ */ N("path", {
				d: "M24 18.458H0C0.384063 14.39 2.70934 10.9152 6.14239 9.05496L4.15153 5.60624C4.03919 5.4129 4.10451 5.16731 4.29784 5.05496C4.49118 4.94262 4.73677 5.00794 4.84912 5.20127L6.8661 8.69442C8.40496 7.99161 10.1372 7.59971 12 7.59971C13.8628 7.59971 15.595 7.99161 17.1339 8.69442L19.1509 5.20127C19.2606 5.00794 19.5088 4.94262 19.6995 5.05496C19.8903 5.16731 19.9582 5.4129 19.8459 5.60624L17.855 9.05496C21.2907 10.9152 23.6159 14.39 24 18.458ZM17.5075 15.0876C18.064 15.0876 18.516 14.6356 18.5134 14.0817C18.5134 13.5279 18.064 13.0759 17.5075 13.0759C16.9536 13.0759 16.5016 13.5252 16.5016 14.0817C16.5016 14.6356 16.951 15.0876 17.5075 15.0876ZM6.48988 15.0876C7.04637 15.0876 7.49837 14.6356 7.49575 14.0817C7.49575 13.5279 7.04637 13.0759 6.48988 13.0759C5.93599 13.0759 5.484 13.5252 5.484 14.0817C5.484 14.6356 5.93338 15.0876 6.48988 15.0876Z",
				fill: "currentColor"
			}) })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ N(M, { children: /* @__PURE__ */ N("path", {
				d: "M24 18.458H0C0.384063 14.39 2.70934 10.9152 6.14239 9.05496L4.15153 5.60624C4.03919 5.4129 4.10451 5.16731 4.29784 5.05496C4.49118 4.94262 4.73677 5.00794 4.84912 5.20127L6.8661 8.69442C8.40496 7.99161 10.1372 7.59971 12 7.59971C13.8628 7.59971 15.595 7.99161 17.1339 8.69442L19.1509 5.20127C19.2606 5.00794 19.5088 4.94262 19.6995 5.05496C19.8903 5.16731 19.9582 5.4129 19.8459 5.60624L17.855 9.05496C21.2907 10.9152 23.6159 14.39 24 18.458ZM17.5075 15.0876C18.064 15.0876 18.516 14.6356 18.5134 14.0817C18.5134 13.5279 18.064 13.0759 17.5075 13.0759C16.9536 13.0759 16.5016 13.5252 16.5016 14.0817C16.5016 14.6356 16.951 15.0876 17.5075 15.0876ZM6.48988 15.0876C7.04637 15.0876 7.49837 14.6356 7.49575 14.0817C7.49575 13.5279 7.04637 13.0759 6.48988 13.0759C5.93599 13.0759 5.484 13.5252 5.484 14.0817C5.484 14.6356 5.93338 15.0876 6.48988 15.0876Z",
				fill: "#3DDC84"
			}) })
		}
	},
	apple: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("g", {
				clipPath: "url(#clip0_18168_41887)",
				children: /* @__PURE__ */ N("path", {
					d: "M21.792 18.7035C21.429 19.542 20.9994 20.3139 20.5016 21.0235C19.8231 21.9908 19.2676 22.6605 18.8395 23.0323C18.1758 23.6426 17.4647 23.9552 16.7032 23.973C16.1566 23.973 15.4973 23.8175 14.73 23.5019C13.9601 23.1878 13.2525 23.0323 12.6056 23.0323C11.9271 23.0323 11.1994 23.1878 10.4211 23.5019C9.64153 23.8175 9.01355 23.9819 8.53342 23.9982C7.80322 24.0293 7.07539 23.7078 6.3489 23.0323C5.88521 22.6279 5.30523 21.9345 4.61043 20.9524C3.86498 19.9035 3.25211 18.6872 2.77198 17.3006C2.25777 15.8029 2 14.3526 2 12.9484C2 11.3401 2.34754 9.95284 3.04367 8.79035C3.59076 7.8566 4.31859 7.12003 5.22953 6.57931C6.14046 6.03858 7.12473 5.76304 8.18469 5.74541C8.76467 5.74541 9.52524 5.92481 10.4704 6.27739C11.4129 6.63116 12.0181 6.81056 12.2834 6.81056C12.4817 6.81056 13.154 6.60079 14.2937 6.18258C15.3714 5.79474 16.281 5.63415 17.0262 5.69741C19.0454 5.86037 20.5624 6.65634 21.5712 8.09037C19.7654 9.18456 18.8721 10.7171 18.8898 12.6831C18.9061 14.2145 19.4617 15.4888 20.5535 16.5006C21.0483 16.9703 21.6009 17.3332 22.2156 17.591C22.0823 17.9776 21.9416 18.348 21.792 18.7035ZM17.161 0.480381C17.161 1.68066 16.7225 2.80135 15.8484 3.83865C14.7937 5.0718 13.5179 5.78437 12.1343 5.67193C12.1167 5.52793 12.1065 5.37638 12.1065 5.21713C12.1065 4.06487 12.6081 2.83172 13.4989 1.82345C13.9436 1.31295 14.5092 0.888472 15.1951 0.54986C15.8796 0.216299 16.5269 0.0318332 17.1358 0.000244141C17.1536 0.160702 17.161 0.32117 17.161 0.480365V0.480381Z",
					fill: "currentColor"
				})
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41887",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("g", {
				clipPath: "url(#clip0_18168_41698)",
				children: /* @__PURE__ */ N("path", {
					d: "M21.792 18.7035C21.429 19.542 20.9994 20.3139 20.5016 21.0235C19.8231 21.9908 19.2676 22.6605 18.8395 23.0323C18.1758 23.6426 17.4647 23.9552 16.7032 23.973C16.1566 23.973 15.4973 23.8175 14.73 23.5019C13.9601 23.1878 13.2525 23.0323 12.6056 23.0323C11.9271 23.0323 11.1994 23.1878 10.4211 23.5019C9.64153 23.8175 9.01355 23.9819 8.53342 23.9982C7.80322 24.0293 7.07539 23.7078 6.3489 23.0323C5.88521 22.6279 5.30523 21.9345 4.61043 20.9524C3.86498 19.9035 3.25211 18.6872 2.77198 17.3006C2.25777 15.8029 2 14.3526 2 12.9484C2 11.3401 2.34754 9.95284 3.04367 8.79035C3.59076 7.8566 4.31859 7.12003 5.22953 6.57931C6.14046 6.03858 7.12473 5.76304 8.18469 5.74541C8.76467 5.74541 9.52524 5.92481 10.4704 6.27739C11.4129 6.63116 12.0181 6.81056 12.2834 6.81056C12.4817 6.81056 13.154 6.60079 14.2937 6.18258C15.3714 5.79474 16.281 5.63415 17.0262 5.69741C19.0454 5.86037 20.5624 6.65634 21.5712 8.09037C19.7654 9.18456 18.8721 10.7171 18.8898 12.6831C18.9061 14.2145 19.4617 15.4888 20.5535 16.5006C21.0483 16.9703 21.6009 17.3332 22.2156 17.591C22.0823 17.9776 21.9416 18.348 21.792 18.7035ZM17.161 0.480381C17.161 1.68066 16.7225 2.80135 15.8484 3.83865C14.7937 5.0718 13.5179 5.78437 12.1343 5.67193C12.1167 5.52793 12.1065 5.37638 12.1065 5.21713C12.1065 4.06487 12.6081 2.83172 13.4989 1.82345C13.9436 1.31295 14.5092 0.888472 15.1951 0.54986C15.8796 0.216299 16.5269 0.0318332 17.1358 0.000244141C17.1536 0.160702 17.161 0.32117 17.161 0.480365V0.480381Z",
					fill: "black"
				})
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41698",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		}
	},
	"apple-music": {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("g", {
				clipPath: "url(#clip0_18168_41857)",
				children: /* @__PURE__ */ N("path", {
					fillRule: "evenodd",
					clipRule: "evenodd",
					d: "M24.0006 7.50628V7.50751H23.9999V16.4924C23.9999 16.5498 23.9999 16.6072 23.9999 16.6646C24.0001 16.8939 24.0002 17.1231 23.9986 17.3524C23.9972 17.5937 23.9946 17.8351 23.9879 18.0764C23.9739 18.6018 23.9426 19.1324 23.8492 19.6525C23.7546 20.1805 23.5992 20.6718 23.3552 21.1518C23.1152 21.6232 22.8019 22.0538 22.4279 22.4279C22.0538 22.8019 21.6225 23.1152 21.1512 23.3552C20.6718 23.5992 20.1811 23.7546 19.6531 23.8492C19.1331 23.9426 18.6024 23.9739 18.0764 23.9879C17.8351 23.9946 17.5937 23.9972 17.3524 23.9986C17.0661 23.9999 16.7799 23.9999 16.4936 23.9999H7.50751C7.45011 23.9999 7.39271 23.9999 7.33531 23.9999C7.10603 24.0001 6.87676 24.0002 6.64749 23.9986C6.40615 23.9972 6.16481 23.9946 5.92347 23.9879C5.39746 23.9739 4.86678 23.9426 4.34677 23.8492C3.81942 23.7539 3.32808 23.5992 2.84873 23.3552C2.37739 23.1152 1.94605 22.8019 1.57204 22.4279C1.19803 22.0538 0.884687 21.6232 0.644682 21.1518C0.400676 20.6718 0.245339 20.1805 0.15067 19.6525C0.0573347 19.1324 0.0260006 18.6024 0.0120003 18.0764C0.00533346 17.8351 0.00266673 17.5937 0.00133336 17.3524C0 17.0657 0 16.7791 0 16.4924V7.50751C0 7.22083 0 6.93416 0.00133336 6.64815C0.00266673 6.40682 0.00533346 6.16548 0.0120003 5.92414C0.0260006 5.39879 0.0573347 4.86811 0.15067 4.3481C0.245339 3.82009 0.400676 3.32874 0.644682 2.84873C0.884687 2.37739 1.19803 1.94671 1.57204 1.5727C1.94605 1.19869 2.37739 0.885354 2.84873 0.645348C3.32808 0.401343 3.81876 0.246006 4.34677 0.151337C4.86678 0.0573347 5.39746 0.0266673 5.92347 0.0120003C6.16481 0.00533346 6.40615 0.00266673 6.64749 0.00133336C6.93416 0 7.22083 0 7.50751 0H16.4931C16.7797 0 17.0664 0 17.3531 0.00133336C17.5944 0.00266673 17.8357 0.00533346 18.0771 0.0120003C18.6031 0.0260006 19.1338 0.0573347 19.6538 0.15067C20.1811 0.246006 20.6725 0.400676 21.1518 0.644682C21.6232 0.884687 22.0545 1.19803 22.4285 1.57204C22.8025 1.94605 23.1159 2.37672 23.3559 2.84807C23.5999 3.32808 23.7552 3.81942 23.8499 4.34743C23.9432 4.86745 23.9746 5.39746 23.9886 5.92347C23.9952 6.16481 23.9979 6.40615 23.9992 6.64749C24.0006 6.93375 24.0006 7.22002 24.0006 7.50628ZM16.2861 3.76554C16.3479 3.75291 16.8618 3.66183 16.9196 3.65651C17.3046 3.62327 17.5206 3.8759 17.5193 4.28543V15.5747C17.5193 15.8779 17.5167 16.1525 17.4528 16.4563C17.391 16.7508 17.2787 17.028 17.1045 17.2773C16.931 17.526 16.7089 17.7301 16.4496 17.883C16.1877 18.0379 15.9124 18.1263 15.6186 18.1855C15.0668 18.2965 14.6892 18.3218 14.3348 18.2506C13.9931 18.1815 13.7033 18.0246 13.4712 17.8119C13.1275 17.4974 12.9134 17.0719 12.8669 16.6271C12.8124 16.1059 12.9852 15.5495 13.3768 15.1393C13.5743 14.9319 13.8223 14.7683 14.1533 14.64C14.4997 14.5057 14.882 14.4253 15.4697 14.3069L15.9344 14.2132C16.1385 14.172 16.3127 14.1201 16.4536 13.9479C16.5959 13.7751 16.5979 13.5637 16.5979 13.3549V8.08355C16.5979 7.68 16.4164 7.57031 16.0315 7.6441C15.7555 7.69795 9.84264 8.89064 9.84264 8.89064C9.5089 8.97175 9.39189 9.08078 9.39189 9.4943V17.2162C9.39189 17.5193 9.3766 17.7939 9.31278 18.0977C9.25095 18.3922 9.1386 18.6695 8.96441 18.9188C8.7909 19.1674 8.56885 19.3715 8.30957 19.5244C8.04763 19.6793 7.77239 19.7717 7.47854 19.8309C6.92674 19.9426 6.54912 19.9672 6.19477 19.8961C5.85306 19.8276 5.56319 19.666 5.33117 19.4533C4.98746 19.1388 4.78735 18.7134 4.74081 18.2686C4.6863 17.7474 4.84519 17.1909 5.23677 16.7807C5.43422 16.5733 5.6822 16.4098 6.01328 16.2814C6.35965 16.1471 6.74192 16.0667 7.32962 15.9484L7.79433 15.8546C7.99843 15.8134 8.17261 15.7616 8.31355 15.5894C8.4545 15.4172 8.47112 15.2151 8.47112 15.007V6.10371C8.47112 5.98405 8.48109 5.90294 8.48707 5.86305C8.51566 5.67557 8.59078 5.51468 8.72641 5.401C8.83876 5.30659 8.98436 5.24078 9.16984 5.20155L9.1725 5.20089L16.2861 3.76554Z",
					fill: "currentColor"
				})
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41857",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ P("g", {
				clipPath: "url(#clip0_18168_41642)",
				children: [/* @__PURE__ */ N("path", {
					fillRule: "evenodd",
					clipRule: "evenodd",
					d: "M24.0006 7.50751C24.0006 7.22083 24.0006 6.93416 23.9992 6.64749C23.9979 6.40615 23.9952 6.16481 23.9886 5.92347C23.9746 5.39746 23.9432 4.86745 23.8499 4.34743C23.7552 3.81942 23.5999 3.32808 23.3559 2.84807C23.1159 2.37672 22.8025 1.94605 22.4285 1.57204C22.0545 1.19803 21.6232 0.884687 21.1518 0.644682C20.6725 0.400676 20.1811 0.246006 19.6538 0.15067C19.1338 0.0573347 18.6031 0.0260006 18.0771 0.0120003C17.8357 0.00533346 17.5944 0.00266673 17.3531 0.00133336C17.0664 0 16.7797 0 16.4931 0H7.50751C7.22083 0 6.93416 0 6.64749 0.00133336C6.40615 0.00266673 6.16481 0.00533346 5.92347 0.0120003C5.39746 0.0266673 4.86678 0.0573347 4.34677 0.151337C3.81876 0.246006 3.32808 0.401343 2.84873 0.645348C2.37739 0.885354 1.94605 1.19869 1.57204 1.5727C1.19803 1.94671 0.884687 2.37739 0.644682 2.84873C0.400676 3.32874 0.245339 3.82009 0.15067 4.3481C0.0573347 4.86811 0.0260006 5.39879 0.0120003 5.92414C0.00533346 6.16548 0.00266673 6.40682 0.00133336 6.64815C0 6.93416 0 7.22083 0 7.50751V16.4924C0 16.7791 0 17.0657 0.00133336 17.3524C0.00266673 17.5937 0.00533346 17.8351 0.0120003 18.0764C0.0260006 18.6024 0.0573347 19.1324 0.15067 19.6525C0.245339 20.1805 0.400676 20.6718 0.644682 21.1518C0.884687 21.6232 1.19803 22.0538 1.57204 22.4279C1.94605 22.8019 2.37739 23.1152 2.84873 23.3552C3.32808 23.5992 3.81942 23.7539 4.34677 23.8492C4.86678 23.9426 5.39746 23.9739 5.92347 23.9879C6.16481 23.9946 6.40615 23.9972 6.64749 23.9986C6.93416 24.0006 7.22083 23.9999 7.50751 23.9999H16.4924C16.7791 23.9999 17.0657 23.9999 17.3524 23.9986C17.5937 23.9972 17.8351 23.9946 18.0764 23.9879C18.6024 23.9739 19.1331 23.9426 19.6531 23.8492C20.1811 23.7546 20.6718 23.5992 21.1512 23.3552C21.6225 23.1152 22.0538 22.8019 22.4279 22.4279C22.8019 22.0538 23.1152 21.6232 23.3552 21.1518C23.5992 20.6718 23.7546 20.1805 23.8492 19.6525C23.9426 19.1324 23.9739 18.6018 23.9879 18.0764C23.9946 17.8351 23.9972 17.5937 23.9986 17.3524C24.0006 17.0657 23.9999 16.7791 23.9999 16.4924V7.50751H24.0006Z",
					fill: "url(#paint0_linear_18168_41642)"
				}), /* @__PURE__ */ N("path", {
					fillRule: "evenodd",
					clipRule: "evenodd",
					d: "M16.9197 3.65649C16.8619 3.66181 16.348 3.75289 16.2861 3.76552L9.17256 5.20087L9.1699 5.20153C8.98442 5.24075 8.83882 5.30657 8.72647 5.40098C8.59085 5.51466 8.51572 5.67555 8.48713 5.86303C8.48115 5.90292 8.47118 5.98402 8.47118 6.10369C8.47118 6.10369 8.47118 13.3715 8.47118 15.007C8.47118 15.215 8.45456 15.4172 8.31362 15.5893C8.17267 15.7615 7.99849 15.8134 7.79439 15.8546C7.63949 15.8859 7.48459 15.9171 7.32968 15.9483C6.74198 16.0667 6.35971 16.1471 6.01334 16.2814C5.68226 16.4097 5.43428 16.5733 5.23683 16.7807C4.84525 17.1909 4.68636 17.7473 4.74087 18.2686C4.78741 18.7133 4.98752 19.1388 5.33123 19.4533C5.56326 19.666 5.85312 19.8276 6.19483 19.896C6.54918 19.9672 6.9268 19.9426 7.4786 19.8309C7.77245 19.7717 8.04769 19.6793 8.30963 19.5244C8.56891 19.3715 8.79096 19.1674 8.96447 18.9188C9.13866 18.6695 9.25101 18.3922 9.31284 18.0977C9.37666 17.7939 9.39195 17.5193 9.39195 17.2162V9.49427C9.39195 9.08075 9.50896 8.97172 9.8427 8.89062C9.8427 8.89062 15.7556 7.69793 16.0315 7.64408C16.4164 7.57028 16.5979 7.67998 16.5979 8.08352V13.3549C16.5979 13.5636 16.5959 13.775 16.4537 13.9479C16.3127 14.1201 16.1385 14.1719 15.9344 14.2132C15.7795 14.2444 15.6246 14.2757 15.4697 14.3069C14.882 14.4252 14.4998 14.5057 14.1534 14.64C13.8223 14.7683 13.5743 14.9318 13.3769 15.1393C12.9853 15.5495 12.8125 16.1059 12.867 16.6271C12.9135 17.0719 13.1276 17.4974 13.4713 17.8118C13.7033 18.0246 13.9932 18.1815 14.3349 18.2506C14.6892 18.3218 15.0669 18.2965 15.6187 18.1855C15.9125 18.1263 16.1877 18.0379 16.4497 17.883C16.709 17.7301 16.931 17.526 17.1045 17.2773C17.2787 17.028 17.3911 16.7508 17.4529 16.4563C17.5167 16.1524 17.5194 15.8779 17.5194 15.5747V4.28541C17.5207 3.87588 17.3046 3.62325 16.9197 3.65649Z",
					fill: "white"
				})]
			}), /* @__PURE__ */ P("defs", { children: [/* @__PURE__ */ P("linearGradient", {
				id: "paint0_linear_18168_41642",
				x1: "12.0003",
				y1: "23.9075",
				x2: "12.0003",
				y2: "0.517251",
				gradientUnits: "userSpaceOnUse",
				children: [/* @__PURE__ */ N("stop", { stopColor: "#FA233B" }), /* @__PURE__ */ N("stop", {
					offset: "1",
					stopColor: "#FB5C74"
				})]
			}), /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41642",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			})] })] })
		}
	},
	"apple-podcasts": {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("g", {
				clipPath: "url(#clip0_18168_41859)",
				children: /* @__PURE__ */ N("path", {
					fillRule: "evenodd",
					clipRule: "evenodd",
					d: "M21.992 22.816C22.76 22.224 23.296 21.392 23.528 20.8C23.992 19.608 24 18.256 24 17.4V6.6C24 5.752 24 4.392 23.528 3.2C23.296 2.608 22.752 1.768 21.992 1.184C21.552 0.84 21.024 0.52 20.304 0.304C19.528 0.08 18.584 0 17.4 0H6.6C5.416 0 4.472 0.08 3.696 0.304C2.976 0.52 2.448 0.848 2.008 1.184C1.24 1.776 0.704 2.608 0.472 3.2C0.00799999 4.392 0 5.744 0 6.6V17.4C0 18.256 0.00799999 19.608 0.472 20.8C0.704 21.392 1.248 22.232 2.008 22.816C2.448 23.16 2.976 23.48 3.696 23.696C4.472 23.92 5.416 24 6.6 24H17.4C18.584 24 19.536 23.928 20.304 23.696C21.024 23.48 21.552 23.152 21.992 22.816ZM3.55998 10.992C3.62398 6.4 7.38398 2.672 11.976 2.656C16.64 2.648 20.44 6.44 20.456 11.096C20.456 14.776 18.096 17.912 14.808 19.064C14.728 19.096 14.64 19.032 14.656 18.944L14.776 18.08C14.784 17.976 14.848 17.888 14.944 17.848C17.544 16.704 19.368 14.112 19.368 11.096C19.368 7.016 16.032 3.704 11.944 3.736C7.95198 3.768 4.68798 7.024 4.64798 11.024C4.61598 14.072 6.44798 16.704 9.07198 17.848C9.15998 17.896 9.22398 17.976 9.23998 18.08C9.26131 18.272 9.28977 18.4641 9.31821 18.656C9.33242 18.752 9.34665 18.848 9.35998 18.944C9.36798 19.024 9.28798 19.096 9.20798 19.064C5.88798 17.896 3.51198 14.712 3.55998 10.992ZM13.968 10.408C13.968 11.496 13.088 12.376 12 12.376C10.912 12.376 10.032 11.496 10.032 10.408C10.032 9.32 10.912 8.44 12 8.44C13.088 8.44 13.968 9.328 13.968 10.408ZM13.736 13.8C13.928 13.992 14.024 14.2 14.056 14.488C14.12 15.048 14.088 15.528 14.016 16.304C13.952 17.04 13.832 18.016 13.68 19.016C13.568 19.728 13.48 20.112 13.4 20.384C13.272 20.824 12.776 21.216 12 21.216C11.224 21.216 10.736 20.832 10.6 20.384C10.52 20.112 10.432 19.728 10.32 19.016C10.168 18.024 10.048 17.04 9.98398 16.304L9.98327 16.2954C9.91968 15.5244 9.88022 15.0459 9.94398 14.488C9.97598 14.2 10.08 14 10.264 13.8C10.624 13.416 11.256 13.176 12 13.176C12.744 13.176 13.376 13.424 13.736 13.8ZM11.784 5.456C8.79199 5.568 6.39199 8.04 6.35199 11.032C6.32799 13 7.31199 14.744 8.82399 15.776C8.89599 15.824 8.99999 15.768 8.99999 15.68C8.97599 15.336 8.97599 15.032 8.99199 14.712C8.99999 14.608 8.95999 14.512 8.87999 14.44C7.95999 13.576 7.39999 12.344 7.43199 10.984C7.49599 8.584 9.42399 6.632 11.824 6.536C14.432 6.432 16.576 8.528 16.576 11.104C16.576 12.416 16.016 13.6 15.128 14.44C15.056 14.512 15.016 14.608 15.016 14.712C15.032 15.024 15.024 15.328 15.008 15.672C15 15.76 15.104 15.824 15.184 15.768C16.672 14.752 17.656 13.032 17.656 11.096C17.664 7.912 15 5.328 11.784 5.456Z",
					fill: "currentColor"
				})
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41859",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ P("g", {
				clipPath: "url(#clip0_18168_41645)",
				children: [
					/* @__PURE__ */ N("path", {
						fillRule: "evenodd",
						clipRule: "evenodd",
						d: "M23.528 20.8C23.296 21.392 22.76 22.224 21.992 22.816C21.552 23.152 21.024 23.48 20.304 23.696C19.536 23.928 18.584 24 17.4 24H6.6C5.416 24 4.472 23.92 3.696 23.696C2.976 23.48 2.448 23.16 2.008 22.816C1.248 22.232 0.704 21.392 0.472 20.8C0.00799999 19.608 0 18.256 0 17.4V6.6C0 5.744 0.00799999 4.392 0.472 3.2C0.704 2.608 1.24 1.776 2.008 1.184C2.448 0.848 2.976 0.52 3.696 0.304C4.472 0.08 5.416 0 6.6 0H17.4C18.584 0 19.528 0.08 20.304 0.304C21.024 0.52 21.552 0.84 21.992 1.184C22.752 1.768 23.296 2.608 23.528 3.2C24 4.392 24 5.752 24 6.6V17.4C24 18.256 23.992 19.608 23.528 20.8Z",
						fill: "url(#paint0_linear_18168_41645)"
					}),
					/* @__PURE__ */ N("path", {
						d: "M14.056 14.488C14.024 14.2 13.928 13.992 13.736 13.8C13.376 13.424 12.744 13.176 12 13.176C11.256 13.176 10.624 13.416 10.264 13.8C10.08 14 9.97604 14.2 9.94404 14.488C9.88004 15.048 9.92004 15.528 9.98404 16.304C10.048 17.04 10.168 18.024 10.32 19.016C10.432 19.728 10.52 20.112 10.6 20.384C10.736 20.832 11.224 21.216 12 21.216C12.776 21.216 13.272 20.824 13.4 20.384C13.48 20.112 13.568 19.728 13.68 19.016C13.832 18.016 13.952 17.04 14.016 16.304C14.088 15.528 14.12 15.048 14.056 14.488Z",
						fill: "white"
					}),
					/* @__PURE__ */ N("path", {
						d: "M13.9682 10.4079C13.9682 11.4959 13.0882 12.3759 12.0002 12.3759C10.9122 12.3759 10.0322 11.4959 10.0322 10.4079C10.0322 9.31994 10.9122 8.43994 12.0002 8.43994C13.0882 8.43994 13.9682 9.32794 13.9682 10.4079Z",
						fill: "white"
					}),
					/* @__PURE__ */ N("path", {
						d: "M11.9758 2.65602C7.3838 2.67202 3.6238 6.40002 3.5598 10.992C3.5118 14.712 5.8878 17.896 9.2078 19.064C9.2878 19.096 9.3678 19.024 9.3598 18.944C9.3198 18.656 9.2718 18.368 9.2398 18.08C9.2238 17.976 9.1598 17.896 9.0718 17.848C6.4478 16.704 4.6158 14.072 4.6478 11.024C4.6878 7.02402 7.9518 3.76802 11.9438 3.73602C16.0318 3.70402 19.3678 7.01602 19.3678 11.096C19.3678 14.112 17.5438 16.704 14.9438 17.848C14.8478 17.888 14.7838 17.976 14.7758 18.08C14.7358 18.368 14.6958 18.656 14.6558 18.944C14.6398 19.032 14.7278 19.096 14.8078 19.064C18.0958 17.912 20.4558 14.776 20.4558 11.096C20.4398 6.44002 16.6398 2.64802 11.9758 2.65602Z",
						fill: "white"
					}),
					/* @__PURE__ */ N("path", {
						d: "M11.784 5.45598C8.79199 5.56798 6.39199 8.03997 6.35199 11.032C6.32799 13 7.31199 14.744 8.82399 15.776C8.89599 15.824 8.99999 15.768 8.99999 15.68C8.97599 15.336 8.97599 15.032 8.99199 14.712C8.99999 14.608 8.95999 14.512 8.87999 14.44C7.95999 13.576 7.39999 12.344 7.43199 10.984C7.49599 8.58398 9.42399 6.63198 11.824 6.53598C14.432 6.43198 16.576 8.52798 16.576 11.104C16.576 12.416 16.016 13.6 15.128 14.44C15.056 14.512 15.016 14.608 15.016 14.712C15.032 15.024 15.024 15.328 15.008 15.672C15 15.76 15.104 15.824 15.184 15.768C16.672 14.752 17.656 13.032 17.656 11.096C17.664 7.91198 15 5.32798 11.784 5.45598Z",
						fill: "white"
					})
				]
			}), /* @__PURE__ */ P("defs", { children: [/* @__PURE__ */ P("linearGradient", {
				id: "paint0_linear_18168_41645",
				x1: "12",
				y1: "0",
				x2: "12",
				y2: "24",
				gradientUnits: "userSpaceOnUse",
				children: [/* @__PURE__ */ N("stop", { stopColor: "#F452FF" }), /* @__PURE__ */ N("stop", {
					offset: "1",
					stopColor: "#832BC1"
				})]
			}), /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41645",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			})] })] })
		}
	},
	artstation: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [
				/* @__PURE__ */ N("path", {
					d: "M22.7969 17.1735C22.7969 16.7449 22.6744 16.3367 22.4499 15.9898L15.3479 3.66327C14.9806 2.96939 14.2663 2.5 13.4295 2.5H9.67444L20.6336 21.4796L22.3683 18.4796C22.6948 17.9082 22.7969 17.6633 22.7969 17.1735Z",
					fill: "currentColor"
				}),
				/* @__PURE__ */ N("path", {
					d: "M1.20508 17.1531L3.0214 20.2959C3.38875 21.0102 4.12345 21.5 4.96018 21.5H17.0622L14.552 17.1531H1.20508Z",
					fill: "currentColor"
				}),
				/* @__PURE__ */ N("path", {
					d: "M7.89893 5.58167L12.7765 14.0511H3.00098L7.89893 5.58167Z",
					fill: "currentColor"
				})
			] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [
				/* @__PURE__ */ N("path", {
					d: "M22.7969 17.1735C22.7969 16.7449 22.6744 16.3367 22.4499 15.9898L15.3479 3.66327C14.9806 2.96939 14.2663 2.5 13.4295 2.5H9.67444L20.6336 21.4796L22.3683 18.4796C22.6948 17.9082 22.7969 17.6633 22.7969 17.1735Z",
					fill: "#13AFF0"
				}),
				/* @__PURE__ */ N("path", {
					d: "M1.20508 17.1531L3.0214 20.2959C3.38875 21.0102 4.12345 21.5 4.96018 21.5H17.0622L14.552 17.1531H1.20508Z",
					fill: "#13AFF0"
				}),
				/* @__PURE__ */ N("path", {
					d: "M7.89893 5.58167L12.7765 14.0511H3.00098L7.89893 5.58167Z",
					fill: "#13AFF0"
				})
			] })
		}
	},
	baidu: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ P("g", {
				clipPath: "url(#clip0_18168_41941)",
				children: [
					/* @__PURE__ */ N("path", {
						d: "M6.50612 8.28896C6.58351 8.98029 6.93146 12.0883 4.33143 12.6474C1.73023 13.2095 0.762516 10.1941 1.04833 8.78144C1.04833 8.78144 1.35633 5.73099 3.46593 5.54251C5.14212 5.39576 6.37715 7.23249 6.5056 8.28431L6.50612 8.28896Z",
						fill: "currentColor"
					}),
					/* @__PURE__ */ N("path", {
						d: "M11.7719 3.70678C11.7719 5.75657 10.6091 7.41592 9.17068 7.41592C7.73122 7.41592 6.56579 5.75657 6.56579 3.70678C6.56579 1.65666 7.73155 0 9.17068 0C10.6091 0 11.7719 1.657 11.7719 3.70678Z",
						fill: "currentColor"
					}),
					/* @__PURE__ */ N("path", {
						d: "M18.7786 4.29816C18.5318 5.8562 17.2981 7.91238 15.3724 7.65995C13.4487 7.41323 13.014 5.67142 13.2013 3.92455C13.3549 2.49643 15.0604 0.3073 16.4265 0.621668C17.7867 0.932334 19.0308 2.74214 18.7786 4.29816Z",
						fill: "currentColor"
					}),
					/* @__PURE__ */ N("path", {
						d: "M20.0862 7.286C22.3818 7.286 22.9981 9.53236 22.9981 10.2776C22.9981 10.3341 22.9999 10.4043 23.002 10.486C23.0273 11.4883 23.0959 14.2065 20.4578 14.265C17.6017 14.327 17.4827 12.3331 17.4827 10.9036C17.4827 9.4058 17.7863 7.286 20.0862 7.286Z",
						fill: "currentColor"
					}),
					/* @__PURE__ */ N("path", {
						d: "M8.2421 20.4821H9.60658L9.60625 17.1429H8.14526C7.48756 17.3394 7.16846 17.8497 7.09953 18.0705C7.02421 18.2909 6.85273 18.8517 7.00202 19.337C7.29153 20.4326 8.2421 20.4821 8.2421 20.4821Z",
						fill: "currentColor"
					}),
					/* @__PURE__ */ N("path", {
						fillRule: "evenodd",
						clipRule: "evenodd",
						d: "M15.3721 12.0224C17.1098 14.5145 20.0862 16.8194 20.0862 16.8194C20.0862 16.8194 22.3166 18.5659 20.8909 21.929C19.4669 25.2949 14.2557 23.5456 14.2557 23.5456C14.2557 23.5456 12.3338 22.9257 10.0997 23.4235C7.87042 23.9229 5.9481 23.7345 5.9481 23.7345C5.9481 23.7345 3.33984 23.7971 2.59606 20.4962C1.96552 17.6892 4.28541 15.9612 5.15078 15.3166C5.30388 15.2025 5.41146 15.1224 5.44911 15.0762C5.51103 14.9979 5.66546 14.8657 5.87971 14.6821C6.5242 14.1301 7.70998 13.1144 8.54728 11.7104C9.66597 9.8447 13.0133 8.34792 15.3721 12.0224ZM9.63382 15.8231V13.6057L11.1671 13.6299V21.8278H7.7801C6.31574 21.5343 5.73303 20.5346 5.66006 20.3629C5.65536 20.3517 5.6492 20.3379 5.64186 20.3213C5.53647 20.0838 5.18752 19.2972 5.39342 18.0197C6.02489 15.9729 7.82885 15.8231 7.82885 15.8231H9.63382ZM11.9973 20.3384V16.022L13.5817 15.9965V19.8749C13.6782 20.2876 14.1913 20.3623 14.1913 20.3623H15.7965V16.0214H17.4788V21.8039H13.581C12.0679 21.4124 11.9973 20.3384 11.9973 20.3384Z",
						fill: "currentColor"
					})
				]
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41941",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("path", {
				d: "M4.33143 12.6474C6.93734 12.087 6.58193 8.96622 6.5056 8.28431C6.37715 7.23249 5.14212 5.39576 3.46593 5.54251C1.35633 5.73099 1.04833 8.78144 1.04833 8.78144C0.762516 10.1941 1.73023 13.2095 4.33143 12.6474ZM9.17068 7.41592C10.6091 7.41592 11.7719 5.75657 11.7719 3.70678C11.7719 1.657 10.6091 0 9.17068 0C7.73155 0 6.56579 1.65666 6.56579 3.70678C6.56579 5.75657 7.73122 7.41592 9.17068 7.41592ZM15.3724 7.65995C17.2981 7.91238 18.5318 5.8562 18.7786 4.29816C19.0308 2.74214 17.7867 0.932334 16.4265 0.621668C15.0604 0.3073 13.3549 2.49643 13.2013 3.92455C13.014 5.67142 13.4487 7.41323 15.3724 7.65995ZM22.9981 10.2776C22.9981 9.53236 22.3818 7.286 20.0862 7.286C17.7863 7.286 17.4827 9.4058 17.4827 10.9036C17.4827 12.3331 17.6017 14.327 20.4578 14.265C23.3108 14.2018 22.9981 11.0278 22.9981 10.2776ZM20.0862 16.8194C20.0862 16.8194 17.1098 14.5145 15.3721 12.0224C13.0133 8.34792 9.66597 9.8447 8.54728 11.7104C7.43162 13.5811 5.69726 14.7625 5.44911 15.0762C5.19861 15.3835 1.85397 17.1926 2.59606 20.4962C3.33984 23.7971 5.9481 23.7345 5.9481 23.7345C5.9481 23.7345 7.87042 23.9229 10.0997 23.4235C12.3338 22.9257 14.2557 23.5456 14.2557 23.5456C14.2557 23.5456 19.4669 25.2949 20.8909 21.929C22.3166 18.5659 20.0866 16.8197 20.0866 16.8197",
				fill: "#2319DC"
			}), /* @__PURE__ */ N("path", {
				d: "M9.63382 13.6057V15.8231H7.82885C7.82885 15.8231 6.02489 15.9729 5.39342 18.0197C5.17318 19.3862 5.58777 20.191 5.66006 20.3629C5.73303 20.5346 6.31574 21.5343 7.7801 21.8278H11.1671V13.6299L9.63382 13.6057ZM9.60658 20.4821H8.2421C8.2421 20.4821 7.29153 20.4326 7.00202 19.337C6.85273 18.8517 7.02421 18.2909 7.09953 18.0705C7.16846 17.8497 7.48756 17.3394 8.14526 17.1429H9.60625L9.60658 20.4821ZM11.9973 16.022V20.3384C11.9973 20.3384 12.0679 21.4124 13.581 21.8039H17.4788V16.0214H15.7965V20.3623H14.1913C14.1913 20.3623 13.6782 20.2876 13.5817 19.8749V15.9965L11.9973 16.022Z",
				fill: "white"
			})] })
		}
	},
	behance: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [
				/* @__PURE__ */ N("path", {
					fillRule: "evenodd",
					clipRule: "evenodd",
					d: "M6.94695 4.08415C7.59544 4.07211 8.243 4.13859 8.87551 4.28215C9.40806 4.39842 9.91367 4.61478 10.3655 4.91973C10.7828 5.22296 11.1129 5.63063 11.3228 6.10181C11.5641 6.6812 11.6805 7.30495 11.6644 7.93235C11.6918 8.62125 11.5158 9.30299 11.1585 9.89259C10.7825 10.4495 10.2629 10.8942 9.65465 11.1796C10.4801 11.4021 11.199 11.9119 11.6822 12.6171C12.1461 13.3644 12.3792 14.2319 12.3525 15.111C12.3677 15.8119 12.2228 16.5071 11.9287 17.1435C11.6569 17.6987 11.2588 18.1825 10.7664 18.5562C10.2595 18.9259 9.68905 19.1994 9.08341 19.3631C8.45535 19.5369 7.80651 19.6241 7.15486 19.6225H0V4.08415H6.94695ZM6.53412 10.3688C7.04364 10.3898 7.54521 10.2373 7.95677 9.93615C8.15388 9.76068 8.30721 9.54154 8.4045 9.29623C8.5018 9.05093 8.54037 8.78626 8.51712 8.52339C8.53031 8.21637 8.46918 7.91071 8.33892 7.63238C8.22842 7.41077 8.05661 7.22556 7.84391 7.09876C7.62848 6.95918 7.38643 6.8658 7.13308 6.82452C6.85818 6.77127 6.57845 6.74705 6.29849 6.75225H3.24132V10.3826H6.53412V10.3688ZM6.71232 16.9841C7.02046 16.9883 7.32796 16.955 7.62809 16.8851C7.90236 16.8245 8.16247 16.7119 8.39436 16.5534C8.62153 16.395 8.80506 16.1819 8.92798 15.9337C9.0705 15.6172 9.13598 15.2715 9.11905 14.9249C9.14995 14.609 9.10811 14.2902 8.99674 13.993C8.88537 13.6957 8.70742 13.4279 8.47653 13.2101C7.98717 12.8497 7.38745 12.6712 6.78063 12.7052H3.24132V16.9841H6.71232Z",
					fill: "currentColor"
				}),
				/* @__PURE__ */ N("path", {
					fillRule: "evenodd",
					clipRule: "evenodd",
					d: "M16.9689 16.9266C17.2233 17.1624 17.523 17.344 17.8497 17.4604C18.1765 17.5768 18.5235 17.6256 18.8697 17.6038C19.4185 17.6176 19.9567 17.4507 20.4013 17.1286C20.7629 16.8934 21.0368 16.5454 21.1804 16.1385H23.7653C23.4899 17.2967 22.8173 18.3217 21.8645 19.0353C20.9504 19.642 19.8702 19.9493 18.7737 19.9145C17.9911 19.9247 17.2144 19.7776 16.4897 19.4818C15.8342 19.2085 15.2463 18.7952 14.7671 18.271C14.2897 17.7218 13.9229 17.0854 13.687 16.3969C13.4221 15.6274 13.2925 14.8178 13.3038 14.0041C13.299 13.2039 13.433 12.4091 13.6998 11.6547C14.0583 10.5936 14.7438 9.67321 15.6578 9.02579C16.5719 8.37836 17.6675 8.03714 18.7875 8.05108C19.6144 8.03379 20.4321 8.22731 21.1636 8.61341C21.8247 8.97595 22.3951 9.48369 22.8318 10.0984C23.2784 10.7435 23.5986 11.4675 23.7752 12.2319C23.969 13.0528 24.0381 13.8982 23.9802 14.7396H16.2808C16.2184 15.5302 16.4651 16.3142 16.9689 16.9266ZM20.3468 11.0172C20.1314 10.8017 19.8722 10.6348 19.5868 10.5279C19.3015 10.421 18.9965 10.3765 18.6925 10.3974C18.2892 10.382 17.8887 10.4714 17.5302 10.6568C17.246 10.8133 16.9951 11.0238 16.7917 11.2766C16.6114 11.5135 16.4771 11.7822 16.3957 12.0686C16.3223 12.3074 16.2765 12.5539 16.259 12.8032H21.0279C20.9864 12.1534 20.7497 11.5312 20.3488 11.0182L20.3468 11.0172Z",
					fill: "currentColor"
				}),
				/* @__PURE__ */ N("path", {
					d: "M15.6443 5.12163H21.62V6.64923H15.6443V5.12163Z",
					fill: "currentColor"
				})
			] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ P("g", {
				clipPath: "url(#clip0_18168_41691)",
				children: [
					/* @__PURE__ */ N("path", {
						fillRule: "evenodd",
						clipRule: "evenodd",
						d: "M6.94695 4.08415C7.59544 4.07211 8.243 4.13859 8.87551 4.28215C9.40806 4.39842 9.91367 4.61478 10.3655 4.91973C10.7828 5.22296 11.1129 5.63063 11.3228 6.10181C11.5641 6.6812 11.6805 7.30495 11.6644 7.93235C11.6918 8.62125 11.5158 9.30299 11.1585 9.89259C10.7825 10.4495 10.2629 10.8942 9.65465 11.1796C10.4801 11.4021 11.199 11.9119 11.6822 12.6171C12.1461 13.3644 12.3792 14.2319 12.3525 15.111C12.3677 15.8119 12.2228 16.5071 11.9287 17.1435C11.6569 17.6987 11.2588 18.1825 10.7664 18.5562C10.2595 18.9259 9.68905 19.1994 9.08341 19.3631C8.45535 19.5369 7.80651 19.6241 7.15486 19.6225H0V4.08415H6.94695ZM6.53412 10.3688C7.04364 10.3898 7.54521 10.2373 7.95677 9.93615C8.15388 9.76068 8.30721 9.54154 8.4045 9.29623C8.5018 9.05093 8.54037 8.78626 8.51712 8.52339C8.53031 8.21637 8.46918 7.91071 8.33892 7.63238C8.22842 7.41077 8.05661 7.22556 7.84391 7.09876C7.62848 6.95918 7.38643 6.8658 7.13308 6.82452C6.85818 6.77127 6.57845 6.74705 6.29849 6.75225H3.24132V10.3826H6.53412V10.3688ZM6.71232 16.9841C7.02046 16.9883 7.32796 16.955 7.62809 16.8851C7.90236 16.8245 8.16247 16.7119 8.39436 16.5534C8.62153 16.395 8.80506 16.1819 8.92798 15.9337C9.0705 15.6172 9.13598 15.2715 9.11905 14.9249C9.14995 14.609 9.10811 14.2902 8.99674 13.993C8.88537 13.6957 8.70742 13.4279 8.47653 13.2101C7.98717 12.8497 7.38745 12.6712 6.78063 12.7052H3.24132V16.9841H6.71232Z",
						fill: "#0057FF"
					}),
					/* @__PURE__ */ N("path", {
						fillRule: "evenodd",
						clipRule: "evenodd",
						d: "M16.9689 16.9266C17.2233 17.1624 17.523 17.344 17.8497 17.4604C18.1765 17.5768 18.5235 17.6256 18.8697 17.6038C19.4185 17.6176 19.9567 17.4507 20.4013 17.1286C20.7629 16.8934 21.0368 16.5454 21.1804 16.1385H23.7653C23.4899 17.2967 22.8173 18.3217 21.8645 19.0353C20.9504 19.642 19.8702 19.9493 18.7737 19.9145C17.9911 19.9247 17.2144 19.7776 16.4897 19.4818C15.8342 19.2085 15.2463 18.7952 14.7671 18.271C14.2897 17.7218 13.9229 17.0854 13.687 16.3969C13.4221 15.6274 13.2925 14.8178 13.3038 14.0041C13.299 13.2039 13.433 12.4091 13.6998 11.6547C14.0583 10.5936 14.7438 9.67321 15.6578 9.02579C16.5719 8.37836 17.6675 8.03714 18.7875 8.05108C19.6144 8.03379 20.4321 8.22731 21.1636 8.61341C21.8247 8.97595 22.3951 9.48369 22.8318 10.0984C23.2784 10.7435 23.5986 11.4675 23.7752 12.2319C23.969 13.0528 24.0381 13.8982 23.9802 14.7396H16.2808C16.2184 15.5302 16.4651 16.3142 16.9689 16.9266ZM20.3468 11.0172C20.1314 10.8017 19.8722 10.6348 19.5868 10.5279C19.3015 10.421 18.9965 10.3765 18.6925 10.3974C18.2892 10.382 17.8887 10.4714 17.5302 10.6568C17.246 10.8133 16.9951 11.0238 16.7917 11.2766C16.6114 11.5135 16.4771 11.7822 16.3957 12.0686C16.3223 12.3074 16.2765 12.5539 16.259 12.8032H21.0279C20.9864 12.1534 20.7497 11.5312 20.3488 11.0182L20.3468 11.0172Z",
						fill: "#0057FF"
					}),
					/* @__PURE__ */ N("path", {
						d: "M15.6443 5.12163H21.62V6.64923H15.6443V5.12163Z",
						fill: "#0057FF"
					})
				]
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41691",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		}
	},
	boosty: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("g", {
				clipPath: "url(#clip0_18168_41897)",
				children: /* @__PURE__ */ N("path", {
					d: "M2.66142 14.3365L6.8011 0H13.163L11.8805 4.44444C11.8678 4.46984 11.8551 4.49524 11.8424 4.52064L8.46459 16.254H11.6138C10.2932 19.5429 9.26459 22.1206 8.52809 23.9873C2.71221 23.9238 1.08682 19.7587 2.50904 14.8317M8.55348 24L16.2233 12.9651H12.9725L15.8043 5.89206C20.6551 6.4 22.9408 10.2222 21.5947 14.8444C20.1598 19.8095 14.344 24 8.68047 24C8.62967 24 8.59158 24 8.55348 24Z",
					fill: "currentColor"
				})
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41897",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("path", {
				d: "M2.66142 14.3365L6.8011 0H13.163L11.8805 4.44444C11.8678 4.46984 11.8551 4.49524 11.8424 4.52064L8.46459 16.254H11.6138C10.2932 19.5429 9.26459 22.1206 8.52809 23.9873C2.71221 23.9238 1.08682 19.7587 2.50904 14.8317M8.55348 24L16.2233 12.9651H12.9725L15.8043 5.89206C20.6551 6.4 22.9408 10.2222 21.5947 14.8444C20.1598 19.8095 14.344 24 8.68047 24C8.62967 24 8.59158 24 8.55348 24Z",
				fill: "url(#paint0_linear_18168_41714)"
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ P("linearGradient", {
				id: "paint0_linear_18168_41714",
				x1: "15.4586",
				y1: "3.11721",
				x2: "7.26926",
				y2: "31.0449",
				gradientUnits: "userSpaceOnUse",
				children: [
					/* @__PURE__ */ N("stop", { stopColor: "#EF7829" }),
					/* @__PURE__ */ N("stop", {
						offset: "0.0518954",
						stopColor: "#F07529"
					}),
					/* @__PURE__ */ N("stop", {
						offset: "0.3551",
						stopColor: "#F0672B"
					}),
					/* @__PURE__ */ N("stop", {
						offset: "0.6673",
						stopColor: "#F15E2C"
					}),
					/* @__PURE__ */ N("stop", {
						offset: "1",
						stopColor: "#F15A2C"
					})
				]
			}) })] })
		}
	},
	devianart: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("g", {
				clipPath: "url(#clip0_18168_41953)",
				children: /* @__PURE__ */ N("path", {
					d: "M19.4464 4.13794V0H14.8946L14.6464 0.455156L12.5774 3.72412L11.9153 4.5517H4.5498V10.7586H8.68774L9.10155 11.2138L4.5498 19.6138V24H9.10155L9.3498 23.5448L11.5843 19.6138L11.9981 19.0345H19.4464V13.2414H15.3085L14.8946 12.8276L19.4464 4.13794Z",
					fill: "currentColor"
				})
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41953",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ N(M, { children: /* @__PURE__ */ N("path", {
				d: "M19.4464 4.13794V0H14.8946L14.6464 0.455156L12.5774 3.72412L11.9153 4.5517H4.5498V10.7586H8.68774L9.10155 11.2138L4.5498 19.6138V24H9.10155L9.3498 23.5448L11.5843 19.6138L11.9981 19.0345H19.4464V13.2414H15.3085L14.8946 12.8276L19.4464 4.13794Z",
				fill: "#00D159"
			}) })
		}
	},
	discord: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ N(M, { children: /* @__PURE__ */ N("path", {
				d: "M20.317 4.15557C18.7873 3.45369 17.147 2.93658 15.4319 2.6404C15.4007 2.63469 15.3695 2.64897 15.3534 2.67754C15.1424 3.05276 14.9087 3.54226 14.7451 3.927C12.9004 3.65083 11.0652 3.65083 9.25832 3.927C9.09465 3.5337 8.85248 3.05276 8.64057 2.67754C8.62448 2.64992 8.59328 2.63564 8.56205 2.6404C6.84791 2.93563 5.20756 3.45275 3.67693 4.15557C3.66368 4.16129 3.65233 4.17082 3.64479 4.18319C0.533392 8.83155 -0.31895 13.3657 0.0991801 17.8436C0.101072 17.8655 0.11337 17.8864 0.130398 17.8997C2.18321 19.4073 4.17171 20.3225 6.12328 20.9291C6.15451 20.9386 6.18761 20.9272 6.20748 20.9015C6.66913 20.2711 7.08064 19.6063 7.43348 18.9073C7.4543 18.8664 7.43442 18.8178 7.39186 18.8016C6.73913 18.554 6.1176 18.2521 5.51973 17.9093C5.47244 17.8816 5.46865 17.814 5.51216 17.7816C5.63797 17.6873 5.76382 17.5893 5.88396 17.4902C5.90569 17.4721 5.93598 17.4683 5.96153 17.4797C9.88928 19.273 14.1415 19.273 18.023 17.4797C18.0485 17.4674 18.0788 17.4712 18.1015 17.4893C18.2216 17.5883 18.3475 17.6873 18.4742 17.7816C18.5177 17.814 18.5149 17.8816 18.4676 17.9093C17.8697 18.2588 17.2482 18.554 16.5945 18.8006C16.552 18.8168 16.533 18.8664 16.5538 18.9073C16.9143 19.6054 17.3258 20.2701 17.7789 20.9005C17.7978 20.9272 17.8319 20.9386 17.8631 20.9291C19.8241 20.3225 21.8126 19.4073 23.8654 17.8997C23.8834 17.8864 23.8948 17.8664 23.8967 17.8445C24.3971 12.6676 23.0585 8.17064 20.3482 4.18414C20.3416 4.17082 20.3303 4.16129 20.317 4.15557ZM8.02002 15.117C6.8375 15.117 5.86313 14.0313 5.86313 12.6981C5.86313 11.3648 6.8186 10.2791 8.02002 10.2791C9.23087 10.2791 10.1958 11.3743 10.1769 12.6981C10.1769 14.0313 9.22141 15.117 8.02002 15.117ZM15.9947 15.117C14.8123 15.117 13.8379 14.0313 13.8379 12.6981C13.8379 11.3648 14.7933 10.2791 15.9947 10.2791C17.2056 10.2791 18.1705 11.3743 18.1516 12.6981C18.1516 14.0313 17.2056 15.117 15.9947 15.117Z",
				fill: "currentColor"
			}) })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ N(M, { children: /* @__PURE__ */ N("path", {
				d: "M20.317 4.15557C18.7873 3.45369 17.147 2.93658 15.4319 2.6404C15.4007 2.63469 15.3695 2.64897 15.3534 2.67754C15.1424 3.05276 14.9087 3.54226 14.7451 3.927C12.9004 3.65083 11.0652 3.65083 9.25832 3.927C9.09465 3.5337 8.85248 3.05276 8.64057 2.67754C8.62448 2.64992 8.59328 2.63564 8.56205 2.6404C6.84791 2.93563 5.20756 3.45275 3.67693 4.15557C3.66368 4.16129 3.65233 4.17082 3.64479 4.18319C0.533392 8.83155 -0.31895 13.3657 0.0991801 17.8436C0.101072 17.8655 0.11337 17.8864 0.130398 17.8997C2.18321 19.4073 4.17171 20.3225 6.12328 20.9291C6.15451 20.9386 6.18761 20.9272 6.20748 20.9015C6.66913 20.2711 7.08064 19.6063 7.43348 18.9073C7.4543 18.8664 7.43442 18.8178 7.39186 18.8016C6.73913 18.554 6.1176 18.2521 5.51973 17.9093C5.47244 17.8816 5.46865 17.814 5.51216 17.7816C5.63797 17.6873 5.76382 17.5893 5.88396 17.4902C5.90569 17.4721 5.93598 17.4683 5.96153 17.4797C9.88928 19.273 14.1415 19.273 18.023 17.4797C18.0485 17.4674 18.0788 17.4712 18.1015 17.4893C18.2216 17.5883 18.3475 17.6873 18.4742 17.7816C18.5177 17.814 18.5149 17.8816 18.4676 17.9093C17.8697 18.2588 17.2482 18.554 16.5945 18.8006C16.552 18.8168 16.533 18.8664 16.5538 18.9073C16.9143 19.6054 17.3258 20.2701 17.7789 20.9005C17.7978 20.9272 17.8319 20.9386 17.8631 20.9291C19.8241 20.3225 21.8126 19.4073 23.8654 17.8997C23.8834 17.8864 23.8948 17.8664 23.8967 17.8445C24.3971 12.6676 23.0585 8.17064 20.3482 4.18414C20.3416 4.17082 20.3303 4.16129 20.317 4.15557ZM8.02002 15.117C6.8375 15.117 5.86313 14.0313 5.86313 12.6981C5.86313 11.3648 6.8186 10.2791 8.02002 10.2791C9.23087 10.2791 10.1958 11.3743 10.1769 12.6981C10.1769 14.0313 9.22141 15.117 8.02002 15.117ZM15.9947 15.117C14.8123 15.117 13.8379 14.0313 13.8379 12.6981C13.8379 11.3648 14.7933 10.2791 15.9947 10.2791C17.2056 10.2791 18.1705 11.3743 18.1516 12.6981C18.1516 14.0313 17.2056 15.117 15.9947 15.117Z",
				fill: "#5865F2"
			}) })
		}
	},
	dprofile: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("g", {
				clipPath: "url(#clip0_18168_41849)",
				children: /* @__PURE__ */ N("path", {
					fillRule: "evenodd",
					clipRule: "evenodd",
					d: "M21.9516 0H2.052C1.50778 0 0.985842 0.216192 0.601017 0.601017C0.216192 0.985842 0 1.50778 0 2.052L0 21.948C0 22.4922 0.216192 23.0142 0.601017 23.399C0.985842 23.7838 1.50778 24 2.052 24H21.9516C22.4952 23.999 23.0162 23.7824 23.4003 23.3977C23.7843 23.013 24 22.4916 24 21.948V2.052C24 1.5084 23.7843 0.98701 23.4003 0.602288C23.0162 0.217567 22.4952 0.000953686 21.9516 0ZM22.4076 15.4356C22.4063 17.2831 21.6714 19.0545 20.3645 20.3603C19.0575 21.6661 17.2855 22.3995 15.438 22.3992H8.5776C6.73041 22.3992 4.95886 21.6655 3.65253 20.3595C2.3462 19.0536 1.61208 17.2822 1.6116 15.435V8.5608C1.61152 7.64605 1.79166 6.74024 2.14172 5.89512C2.49178 5.04999 3.00491 4.28212 3.65179 3.63534C4.29868 2.98857 5.06664 2.47557 5.91182 2.12566C6.75701 1.77574 7.66285 1.59576 8.5776 1.596H15.453C17.3005 1.59632 19.0722 2.33008 20.379 3.63604C21.6857 4.942 22.4206 6.71333 22.422 8.5608L22.4064 15.435L22.4076 15.4356Z",
					fill: "currentColor"
				})
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41849",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("g", {
				clipPath: "url(#clip0_18168_41629)",
				children: /* @__PURE__ */ N("path", {
					fillRule: "evenodd",
					clipRule: "evenodd",
					d: "M21.9516 0H2.052C1.50778 0 0.985842 0.216192 0.601017 0.601017C0.216192 0.985842 0 1.50778 0 2.052L0 21.948C0 22.4922 0.216192 23.0142 0.601017 23.399C0.985842 23.7838 1.50778 24 2.052 24H21.9516C22.4952 23.999 23.0162 23.7824 23.4003 23.3977C23.7843 23.013 24 22.4916 24 21.948V2.052C24 1.5084 23.7843 0.98701 23.4003 0.602288C23.0162 0.217567 22.4952 0.000953686 21.9516 0ZM22.4076 15.4356C22.4063 17.2831 21.6714 19.0545 20.3645 20.3603C19.0575 21.6661 17.2855 22.3995 15.438 22.3992H8.5776C6.73041 22.3992 4.95886 21.6655 3.65253 20.3595C2.3462 19.0536 1.61208 17.2822 1.6116 15.435V8.5608C1.61152 7.64605 1.79166 6.74024 2.14172 5.89512C2.49178 5.04999 3.00491 4.28212 3.65179 3.63534C4.29868 2.98857 5.06664 2.47557 5.91182 2.12566C6.75701 1.77574 7.66285 1.59576 8.5776 1.596H15.453C17.3005 1.59632 19.0722 2.33008 20.379 3.63604C21.6857 4.942 22.4206 6.71333 22.422 8.5608L22.4064 15.435L22.4076 15.4356Z",
					fill: "black"
				})
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41629",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		}
	},
	dribbble: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ N(M, { children: /* @__PURE__ */ N("path", {
				fillRule: "evenodd",
				clipRule: "evenodd",
				d: "M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM14.6026 21.7874C13.7722 22.0076 12.8998 22.125 12 22.125C10.6383 22.125 9.3394 21.8562 8.15345 21.3688C9.27883 17.2148 12.3908 14.2396 15.9559 12.9146C16.5742 15.9112 16.1137 19.1247 14.6026 21.7874ZM17.2675 20.6486C18.2345 18.0151 18.4249 15.1142 17.8323 12.3789C19.263 12.09 20.7224 12.0635 22.1198 12.3271C22.0079 15.8529 20.0934 18.9238 17.2675 20.6486ZM21.9883 10.3319C20.4412 10.105 18.8481 10.1714 17.2925 10.5036C16.9911 9.65803 16.6106 8.84342 16.1573 8.06991C17.4359 7.33144 18.6018 6.39877 19.6 5.30979C20.8234 6.69853 21.6722 8.42527 21.9883 10.3319ZM18.1794 3.97872C17.2791 4.9644 16.2199 5.80263 15.0582 6.45596C14.274 5.45928 13.3668 4.56193 12.3553 3.79144L12.3309 3.77284L12.3055 3.75593C12.3054 3.75585 12.3032 3.75439 12.2986 3.75113C12.2932 3.74731 12.286 3.74216 12.2768 3.73546C12.2581 3.72189 12.235 3.70477 12.2072 3.68398C12.1757 3.66041 12.1441 3.63656 12.1102 3.61093L12.1032 3.60572C12.0758 3.58496 12.0467 3.56299 12.0148 3.53905C11.9459 3.48722 11.8703 3.43084 11.8008 3.38108C11.7523 3.3463 11.6825 3.29711 11.6113 3.25373L11.5661 3.22247C11.4734 3.15829 11.3341 3.0618 11.2077 2.98415C11.0895 2.90132 10.9298 2.80695 10.8252 2.74569C10.724 2.68641 10.615 2.62421 10.5473 2.58555L10.4953 2.55583C10.4828 2.54856 10.472 2.54252 10.4675 2.54002L10.4666 2.53953C10.4587 2.53512 10.45 2.53029 10.4421 2.52595L10.4315 2.52009C10.4163 2.51178 10.4012 2.50346 10.3855 2.4947C10.3675 2.48469 10.353 2.47644 10.3424 2.47026L10.335 2.46514L10.3092 2.44936C10.2157 2.39222 10.1183 2.34005 10.0654 2.31173L10.0459 2.30127L10.0233 2.28909L10.0001 2.27813C9.94988 2.25445 9.87379 2.21818 9.78807 2.17731L9.78605 2.17635C9.75914 2.16353 9.73113 2.15018 9.70285 2.13671C10.4409 1.9655 11.2099 1.875 12 1.875C14.3265 1.875 16.4697 2.65964 18.1794 3.97872ZM7.03624 3.17316C5.53447 4.0195 4.27039 5.238 3.36912 6.70354C4.44122 7.24727 5.59274 7.63145 6.77899 7.84264L6.78154 7.84309L6.78409 7.84358C8.25 8.1126 9.76122 8.1054 11.2407 7.83866C11.9194 7.71612 12.5861 7.53394 13.2328 7.29729C12.6249 6.57828 11.9421 5.92595 11.1951 5.35466C11.144 5.31919 11.0873 5.27708 11.0409 5.24239C11.0058 5.21614 10.9646 5.18501 10.9239 5.1543L10.9228 5.15349C10.8958 5.13314 10.8692 5.11303 10.8447 5.09468C10.7779 5.04443 10.7172 4.99924 10.6669 4.96324C10.6342 4.93983 10.6155 4.9272 10.6078 4.92199C10.6049 4.92006 10.6035 4.91915 10.6036 4.9191L10.5749 4.9029L10.5411 4.87999C10.4913 4.84624 10.4471 4.8156 10.4065 4.78751L10.4061 4.78725C10.3172 4.72573 10.2459 4.67641 10.1736 4.6335L10.1262 4.60534L10.0835 4.573C10.0848 4.57396 10.084 4.57348 10.0809 4.5714L10.0805 4.57112C10.073 4.5661 10.053 4.55286 10.0162 4.53C9.96675 4.49936 9.90615 4.46318 9.84139 4.42523C9.74952 4.37145 9.66585 4.32371 9.59967 4.28595L9.59183 4.28148C9.56421 4.2657 9.53982 4.25178 9.51942 4.24001L9.51739 4.23885L9.50138 4.23L9.4938 4.22584C9.47877 4.21759 9.4587 4.20653 9.43827 4.19516C9.41434 4.18185 9.38532 4.1655 9.35708 4.14896C9.34163 4.13993 9.31283 4.12298 9.28058 4.10205C9.24094 4.07843 9.19842 4.05559 9.14779 4.0284L9.14554 4.02716C9.08498 3.99851 9.0096 3.96259 8.92962 3.92441C8.77909 3.85264 8.61207 3.77303 8.49615 3.71912L8.48367 3.71331L8.43128 3.68712C8.2477 3.60202 8.02795 3.51869 7.78184 3.42538L7.78099 3.42506C7.7274 3.40475 7.67258 3.38396 7.61659 3.36258C7.4648 3.3081 7.30717 3.25849 7.14205 3.20652L7.14165 3.2064C7.10685 3.19545 7.07172 3.18439 7.03624 3.17316ZM2.51396 8.45228C3.74945 9.07575 5.07312 9.51569 6.43504 9.75844C8.13986 10.071 9.88658 10.0606 11.5865 9.75412C12.554 9.57944 13.4986 9.3012 14.4044 8.93044C14.8075 9.60063 15.1466 10.3068 15.4163 11.04C11.3493 12.5049 7.8001 15.8147 6.39642 20.4343C3.67094 18.6199 1.875 15.5197 1.875 12C1.875 10.7518 2.10087 9.55634 2.51396 8.45228Z",
				fill: "currentColor"
			}) })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("circle", {
				cx: "12.001",
				cy: "12",
				r: "12",
				fill: "#FFABE7"
			}), /* @__PURE__ */ N("path", {
				fillRule: "evenodd",
				clipRule: "evenodd",
				d: "M12.001 22C17.5238 22 22.001 17.5228 22.001 12C22.001 6.47715 17.5238 2 12.001 2C6.47813 2 2.00098 6.47715 2.00098 12C2.00098 17.5228 6.47813 22 12.001 22ZM14.1698 20.1561C13.4778 20.3397 12.7508 20.4375 12.001 20.4375C10.8662 20.4375 9.78381 20.2135 8.79552 19.8073C9.73334 16.3457 12.3267 13.8664 15.2976 12.7622C15.8128 15.2593 15.429 17.9372 14.1698 20.1561ZM16.3906 19.2072C17.1964 17.0126 17.3551 14.5951 16.8612 12.3157C18.0535 12.075 19.2696 12.0529 20.4342 12.2726C20.3409 15.2107 18.7455 17.7698 16.3906 19.2072ZM20.3245 10.61C19.0353 10.4208 17.7077 10.4761 16.4114 10.753C16.1602 10.0484 15.8432 9.36952 15.4654 8.72492C16.5309 8.10953 17.5024 7.3323 18.3343 6.42483C19.3538 7.58211 20.0611 9.02106 20.3245 10.61ZM17.1505 5.3156C16.4002 6.137 15.5176 6.83552 14.5494 7.37997C13.896 6.5494 13.14 5.80161 12.2971 5.15953L12.2767 5.14403L12.2556 5.12994C12.2555 5.12988 12.2537 5.12866 12.2498 5.12594C12.2453 5.12276 12.2393 5.11847 12.2316 5.11288C12.2161 5.10158 12.1968 5.0873 12.1737 5.06999C12.1474 5.05034 12.1211 5.03046 12.0928 5.00911L12.087 5.00477C12.0641 4.98746 12.0399 4.96916 12.0133 4.9492C11.9559 4.90601 11.8929 4.85904 11.835 4.81757C11.7945 4.78858 11.7364 4.74759 11.677 4.71144L11.6394 4.68539C11.5622 4.63191 11.4461 4.5515 11.3407 4.48679C11.2422 4.41776 11.1092 4.33913 11.022 4.28807C10.9376 4.23868 10.8468 4.18684 10.7904 4.15463L10.747 4.12986C10.7367 4.1238 10.7276 4.11877 10.7239 4.11668L10.7232 4.11628C10.7166 4.1126 10.7093 4.10858 10.7027 4.10496L10.6939 4.10008C10.6813 4.09315 10.6687 4.08621 10.6556 4.07892C10.6406 4.07058 10.6284 4.0637 10.6196 4.05855L10.6135 4.05428L10.592 4.04113C10.5141 3.99352 10.4329 3.95004 10.3888 3.92644L10.3725 3.91772L10.3537 3.90758L10.3344 3.89844C10.2925 3.8787 10.2291 3.84849 10.1577 3.81443L10.156 3.81363C10.1336 3.80294 10.1103 3.79182 10.0867 3.78059C10.7017 3.63792 11.3425 3.5625 12.001 3.5625C13.9397 3.5625 15.7257 4.21637 17.1505 5.3156ZM7.86451 4.6443C6.61304 5.34958 5.55963 6.365 4.80858 7.58628C5.70199 8.03939 6.66159 8.35954 7.65013 8.53553L7.65226 8.53591L7.65439 8.53631C8.87598 8.7605 10.1353 8.7545 11.3683 8.53222C11.9338 8.4301 12.4894 8.27828 13.0283 8.08108C12.5217 7.4819 11.9527 6.93829 11.3303 6.46222C11.2876 6.43266 11.2404 6.39756 11.2017 6.36866C11.1725 6.34678 11.1381 6.32084 11.1042 6.29525L11.1033 6.29457C11.0808 6.27762 11.0586 6.26086 11.0383 6.24556C10.9826 6.20369 10.932 6.16603 10.8901 6.13603C10.8628 6.11653 10.8472 6.106 10.8408 6.10166C10.8384 6.10005 10.8373 6.09929 10.8373 6.09925L10.8134 6.08575L10.7852 6.06666C10.7438 6.03853 10.7069 6.013 10.673 5.98959L10.6727 5.98937C10.5986 5.93811 10.5392 5.89701 10.479 5.86125L10.4395 5.83778L10.4039 5.81083C10.405 5.81163 10.4043 5.81123 10.4018 5.8095L10.4014 5.80927C10.3951 5.80508 10.3785 5.79405 10.3478 5.775C10.3066 5.74947 10.2561 5.71931 10.2021 5.68769C10.1256 5.64288 10.0559 5.60309 10.0007 5.57163L9.99417 5.5679C9.97115 5.55475 9.95083 5.54315 9.93382 5.53334L9.93214 5.53238L9.91879 5.525L9.91248 5.52153C9.89995 5.51466 9.88323 5.50544 9.8662 5.49597C9.84626 5.48488 9.82207 5.47125 9.79854 5.45747C9.78567 5.44994 9.76167 5.43581 9.73479 5.41838C9.70176 5.39869 9.66632 5.37966 9.62414 5.357L9.62226 5.35597C9.57179 5.33209 9.50898 5.30216 9.44232 5.27034C9.31689 5.21053 9.1777 5.14419 9.08111 5.09926L9.0707 5.09443L9.02704 5.0726C8.87406 5.00168 8.69093 4.93224 8.48584 4.85448L8.48514 4.85422C8.44048 4.83729 8.39479 4.81997 8.34814 4.80215C8.22164 4.75675 8.09028 4.71541 7.95268 4.6721L7.95235 4.672C7.92335 4.66287 7.89408 4.65366 7.86451 4.6443ZM4.09595 9.04357C5.12552 9.56312 6.22858 9.92974 7.36351 10.132C8.7842 10.3925 10.2398 10.3838 11.6564 10.1284C12.4627 9.98286 13.2498 9.751 14.0046 9.44203C14.3406 10.0005 14.6231 10.589 14.8479 11.2C11.4587 12.4207 8.50106 15.1789 7.33133 19.0286C5.06009 17.5166 3.56348 14.9331 3.56348 12C3.56348 10.9598 3.7517 9.96361 4.09595 9.04357Z",
				fill: "#B8509A"
			})] })
		}
	},
	dzen: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ P("g", {
				clipPath: "url(#clip0_18168_41847)",
				children: [
					/* @__PURE__ */ N("path", {
						d: "M23.9991 12.1286C18.6853 12.2915 16.2597 12.4287 14.3141 14.3143C12.4285 16.26 12.2998 18.6856 12.1284 23.9994C18.6538 23.9309 23.9306 18.654 23.9991 12.1286Z",
						fill: "currentColor"
					}),
					/* @__PURE__ */ N("path", {
						d: "M11.8712 23.9994C11.7084 18.6856 11.5712 16.26 9.68553 14.3143C7.7399 12.4287 5.3143 12.3001 0.000488303 12.1287C0.0689996 18.654 5.34585 23.9309 11.8712 23.9994Z",
						fill: "currentColor"
					}),
					/* @__PURE__ */ N("path", {
						d: "M23.9991 11.8715C23.9306 5.34609 18.6538 0.0692431 12.1284 0.000732422C12.2913 5.31455 12.4285 7.74014 14.3141 9.68577C16.2597 11.5714 18.6853 11.7 23.9991 11.8715Z",
						fill: "currentColor"
					}),
					/* @__PURE__ */ N("path", {
						d: "M11.8712 0.000732423C5.34585 0.0692432 0.0689985 5.34609 0.000488281 11.8715C5.3143 11.7086 7.7399 11.5714 9.68553 9.68577C11.5712 7.74014 11.6998 5.31455 11.8712 0.000732423Z",
						fill: "currentColor"
					})
				]
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41847",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ P("g", {
				clipPath: "url(#clip0_18168_41626)",
				children: [/* @__PURE__ */ N("circle", {
					cx: "12",
					cy: "12",
					r: "12",
					fill: "black"
				}), /* @__PURE__ */ N("path", {
					d: "M24 12.1286V11.8714C18.6857 11.7 16.26 11.5714 14.3143 9.68571C12.4286 7.74 12.2914 5.31429 12.1286 0H11.8714C11.7 5.31429 11.5714 7.74 9.68571 9.68571C7.74 11.5714 5.31429 11.7086 0 11.8714V12.1286C5.31429 12.3 7.74 12.4286 9.68571 14.3143C11.5714 16.26 11.7086 18.6857 11.8714 24H12.1286C12.3 18.6857 12.4286 16.26 14.3143 14.3143C16.26 12.4286 18.6857 12.2914 24 12.1286Z",
					fill: "white"
				})]
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41626",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		}
	},
	facebook: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("g", {
				clipPath: "url(#clip0_18168_41819)",
				children: /* @__PURE__ */ N("path", {
					d: "M12 0C18.6274 0 24 5.37259 24 12C24 18.1352 19.3955 23.1944 13.4538 23.9121V15.667L16.7001 15.667L17.3734 12H13.4538V10.7031C13.4538 9.73417 13.6439 9.06339 14.0799 8.63483C14.5159 8.20627 15.1979 8.01993 16.1817 8.01993C16.4307 8.01993 16.6599 8.02241 16.8633 8.02736C17.1591 8.03456 17.4002 8.047 17.568 8.06467V4.74048C17.501 4.72184 17.4218 4.70321 17.3331 4.68486C17.1321 4.6433 16.8822 4.60324 16.6136 4.56806C16.0523 4.49453 15.4093 4.4423 14.9594 4.4423C13.1424 4.4423 11.7692 4.83102 10.8107 5.63619C9.65388 6.60791 9.10108 8.18622 9.10108 10.4199V12H6.62659V15.667H9.10108V23.6466C3.87432 22.3498 0 17.6277 0 12C0 5.37259 5.37259 0 12 0Z",
					fill: "currentColor"
				})
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41819",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ P("g", {
				clipPath: "url(#clip0_18168_41590)",
				children: [/* @__PURE__ */ N("path", {
					d: "M24 12C24 5.3726 18.6274 1.52588e-05 12 1.52588e-05C5.37259 1.52588e-05 0 5.3726 0 12C0 17.6278 3.87432 22.3499 9.10108 23.6466V15.667H6.62659V12H9.10108V10.4199C9.10108 6.33548 10.9495 4.44236 14.9594 4.44236C15.7196 4.44236 17.0314 4.5914 17.568 4.74049V8.06468C17.2848 8.03487 16.7929 8.01995 16.1817 8.01995C14.214 8.01995 13.4538 8.76529 13.4538 10.7031V12H17.3734L16.7001 15.667H13.4538V23.9121C19.3955 23.1945 24 18.1353 24 12Z",
					fill: "#0866FF"
				}), /* @__PURE__ */ N("path", {
					d: "M16.6999 15.667L17.3733 12H13.4537V10.7031C13.4537 8.76524 14.2139 8.01995 16.1816 8.01995C16.7928 8.01995 17.2847 8.03483 17.5679 8.06464V4.7405C17.0313 4.59141 15.7195 4.44232 14.9593 4.44232C10.9494 4.44232 9.10096 6.33549 9.10096 10.4199V12H6.62646V15.667H9.10096V23.6466C10.0294 23.8769 11.0002 24 11.9999 24C12.4921 24 12.9771 23.9697 13.4537 23.9121V15.667H16.6999Z",
					fill: "white"
				})]
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41590",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		}
	},
	figma: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("g", {
				clipPath: "url(#clip0_18168_41873)",
				children: /* @__PURE__ */ N("path", {
					fillRule: "evenodd",
					clipRule: "evenodd",
					d: "M3.65723 4.49027C3.65723 2.01036 5.66759 0 8.1475 0H15.8523C18.3322 0 20.3425 2.01036 20.3425 4.49027C20.3425 6.06056 19.5365 7.44258 18.3156 8.24516C19.5365 9.04773 20.3425 10.4297 20.3425 12C20.3425 14.48 18.3322 16.4903 15.8523 16.4903H15.7547C14.5921 16.4903 13.5328 16.0485 12.7353 15.3236V19.4609C12.7353 21.9739 10.6724 24 8.17173 24C5.69798 24 3.65723 21.9957 3.65723 19.5097C3.65723 17.9394 4.46323 16.5575 5.68409 15.7549C4.46323 14.9523 3.65723 13.5703 3.65723 12C3.65723 10.4297 4.46327 9.04773 5.68418 8.24516C4.46327 7.44258 3.65723 6.06056 3.65723 4.49027ZM11.2645 11.9902C11.2645 11.9935 11.2645 11.9968 11.2645 12C11.2645 12.0033 11.2645 12.0066 11.2645 12.0098V15.0194H8.1475L8.13115 15.0194C6.47108 15.0106 5.12806 13.6622 5.12806 12C5.12806 10.3324 6.4799 8.9806 8.1475 8.9806H11.2645V11.9902ZM12.7353 12.0077C12.7394 13.6718 14.0897 15.0195 15.7547 15.0195H15.8523C17.5199 15.0195 18.8717 13.6676 18.8717 12C18.8717 10.3324 17.5199 8.9806 15.8523 8.9806H15.7547C14.0897 8.9806 12.7394 10.3283 12.7353 11.9924V12.0077ZM8.1475 16.4903L8.13115 16.4903C6.47108 16.4991 5.12806 17.8475 5.12806 19.5097C5.12806 21.1711 6.49797 22.5291 8.17173 22.5291C9.87242 22.5291 11.2645 21.1493 11.2645 19.4609V16.4903H8.1475ZM8.1475 1.47083H11.2645V7.50972H8.1475C6.47991 7.50972 5.12806 6.15787 5.12806 4.49027C5.12806 2.82268 6.47991 1.47083 8.1475 1.47083ZM12.7353 1.47083V7.50972H15.8523C17.5199 7.50972 18.8717 6.15787 18.8717 4.49027C18.8717 2.82268 17.5199 1.47083 15.8523 1.47083H12.7353Z",
					fill: "currentColor"
				})
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41873",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ P("g", {
				clipPath: "url(#clip0_18168_41670)",
				children: [
					/* @__PURE__ */ N("path", {
						d: "M8.00006 24.0001C10.2081 24.0001 12.0001 22.208 12.0001 20V16H8.00006C5.79205 16 4 17.792 4 20C4 22.208 5.79205 24.0001 8.00006 24.0001Z",
						fill: "#0ACF83"
					}),
					/* @__PURE__ */ N("path", {
						d: "M4 12C4 9.79203 5.79205 8 8.00006 8H12.0001V16H8.00006C5.79205 16.0001 4 14.208 4 12Z",
						fill: "#A259FF"
					}),
					/* @__PURE__ */ N("path", {
						d: "M4 4.00003C4 1.79203 5.79205 0 8.00006 0H12.0001V7.99997H8.00006C5.79205 7.99997 4 6.20803 4 4.00003Z",
						fill: "#F24E1E"
					}),
					/* @__PURE__ */ N("path", {
						d: "M12 0H16.0001C18.2081 0 20.0001 1.79203 20.0001 4.00003C20.0001 6.20803 18.2081 7.99997 16.0001 7.99997H12V0Z",
						fill: "#FF7262"
					}),
					/* @__PURE__ */ N("path", {
						d: "M20.0001 12C20.0001 14.208 18.2081 16.0001 16.0001 16.0001C13.792 16.0001 12 14.208 12 12C12 9.79203 13.792 8 16.0001 8C18.2081 8 20.0001 9.79203 20.0001 12Z",
						fill: "#1ABCFE"
					})
				]
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41670",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		}
	},
	github: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("g", {
				clipPath: "url(#clip0_18168_41899)",
				children: /* @__PURE__ */ N("path", {
					fillRule: "evenodd",
					clipRule: "evenodd",
					d: "M12.0099 0C5.36875 0 0 5.40833 0 12.0992C0 17.4475 3.43994 21.9748 8.21205 23.5771C8.80869 23.6976 9.02724 23.3168 9.02724 22.9965C9.02724 22.716 9.00757 21.7545 9.00757 20.7527C5.6667 21.474 4.97099 19.3104 4.97099 19.3104C4.43409 17.9082 3.63858 17.5478 3.63858 17.5478C2.54511 16.8066 3.71823 16.8066 3.71823 16.8066C4.93117 16.8868 5.56763 18.0486 5.56763 18.0486C6.64118 19.8913 8.37111 19.3707 9.06706 19.0501C9.16638 18.2688 9.48473 17.728 9.82275 17.4276C7.15817 17.1471 4.35469 16.1055 4.35469 11.458C4.35469 10.1359 4.8316 9.05428 5.58729 8.21304C5.46807 7.91263 5.0504 6.67043 5.70677 5.00787C5.70677 5.00787 6.72083 4.6873 9.00732 6.24981C9.98625 5.98497 10.9958 5.85024 12.0099 5.84911C13.024 5.84911 14.0577 5.98948 15.0123 6.24981C17.299 4.6873 18.3131 5.00787 18.3131 5.00787C18.9695 6.67043 18.5515 7.91263 18.4323 8.21304C19.2079 9.05428 19.6652 10.1359 19.6652 11.458C19.6652 16.1055 16.8617 17.1269 14.1772 17.4276C14.6148 17.8081 14.9924 18.5292 14.9924 19.6711C14.9924 21.2936 14.9727 22.5957 14.9727 22.9962C14.9727 23.3168 15.1915 23.6976 15.7879 23.5774C20.56 21.9745 23.9999 17.4475 23.9999 12.0992C24.0196 5.40833 18.6312 0 12.0099 0Z",
					fill: "currentColor"
				})
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41899",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("g", {
				clipPath: "url(#clip0_18168_41716)",
				children: /* @__PURE__ */ N("path", {
					fillRule: "evenodd",
					clipRule: "evenodd",
					d: "M12.0099 0C5.36875 0 0 5.40833 0 12.0992C0 17.4475 3.43994 21.9748 8.21205 23.5771C8.80869 23.6976 9.02724 23.3168 9.02724 22.9965C9.02724 22.716 9.00757 21.7545 9.00757 20.7527C5.6667 21.474 4.97099 19.3104 4.97099 19.3104C4.43409 17.9082 3.63858 17.5478 3.63858 17.5478C2.54511 16.8066 3.71823 16.8066 3.71823 16.8066C4.93117 16.8868 5.56763 18.0486 5.56763 18.0486C6.64118 19.8913 8.37111 19.3707 9.06706 19.0501C9.16638 18.2688 9.48473 17.728 9.82275 17.4276C7.15817 17.1471 4.35469 16.1055 4.35469 11.458C4.35469 10.1359 4.8316 9.05428 5.58729 8.21304C5.46807 7.91263 5.0504 6.67043 5.70677 5.00787C5.70677 5.00787 6.72083 4.6873 9.00732 6.24981C9.98625 5.98497 10.9958 5.85024 12.0099 5.84911C13.024 5.84911 14.0577 5.98948 15.0123 6.24981C17.299 4.6873 18.3131 5.00787 18.3131 5.00787C18.9695 6.67043 18.5515 7.91263 18.4323 8.21304C19.2079 9.05428 19.6652 10.1359 19.6652 11.458C19.6652 16.1055 16.8617 17.1269 14.1772 17.4276C14.6148 17.8081 14.9924 18.5292 14.9924 19.6711C14.9924 21.2936 14.9727 22.5957 14.9727 22.9962C14.9727 23.3168 15.1915 23.6976 15.7879 23.5774C20.56 21.9745 23.9999 17.4475 23.9999 12.0992C24.0196 5.40833 18.6312 0 12.0099 0Z",
					fill: "#24292F"
				})
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41716",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		}
	},
	gmail: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ N(M, { children: /* @__PURE__ */ N("path", {
				d: "M5.45455 21.0045H1.63636C0.733636 21.0045 0 20.2736 0 19.3681V5.45919C0 3.43555 2.30727 2.28191 3.92727 3.49555L12 9.54996L20.0727 3.49555C21.69 2.28191 24 3.43555 24 5.45919V19.3681C24 20.2709 23.2691 21.0045 22.3636 21.0045H18.5454V11.7318L12 16.6409L5.45456 11.7318L5.45455 21.0045Z",
				fill: "currentColor"
			}) })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [
				/* @__PURE__ */ N("path", {
					d: "M1.63636 21.0045H5.45455V11.7318L0 7.64087V19.3681C0 20.2736 0.733636 21.0045 1.63636 21.0045Z",
					fill: "#4285F4"
				}),
				/* @__PURE__ */ N("path", {
					d: "M18.5454 21.0045H22.3636C23.269 21.0045 24 20.2709 24 19.3681V7.64087L18.5454 11.7318",
					fill: "#34A853"
				}),
				/* @__PURE__ */ N("path", {
					d: "M18.5454 4.64101V11.7319L24 7.64101V5.45919C24 3.43555 21.69 2.28191 20.0727 3.49555",
					fill: "#FBBC04"
				}),
				/* @__PURE__ */ N("path", {
					d: "M5.45459 11.7318V4.64087L12 9.54996L18.5455 4.64087V11.7318L12 16.6409",
					fill: "#EA4335"
				}),
				/* @__PURE__ */ N("path", {
					d: "M0 5.45919V7.64101L5.45455 11.7319V4.64101L3.92727 3.49555C2.30727 2.28191 0 3.43555 0 5.45919Z",
					fill: "#C5221F"
				})
			] })
		}
	},
	google: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("g", {
				clipPath: "url(#clip0_18168_41889)",
				children: /* @__PURE__ */ N("path", {
					d: "M23.4059 10.1507L23.2848 9.63696H12.1184V14.363H18.7902C18.0975 17.6523 14.8832 19.3837 12.2577 19.3837C10.3473 19.3837 8.33357 18.5802 7.00071 17.2886C6.2975 16.5962 5.73774 15.772 5.3535 14.863C4.96925 13.9541 4.76805 12.9782 4.76143 11.9914C4.76143 10.0007 5.65607 8.00946 6.95786 6.69964C8.25964 5.38982 10.2257 4.65696 12.1805 4.65696C14.4193 4.65696 16.0238 5.84571 16.6238 6.38786L19.9821 3.04714C18.997 2.18143 16.2905 0 12.0723 0C8.81786 0 5.69732 1.24661 3.41625 3.52018C1.16518 5.75893 0 8.99625 0 12C0 15.0037 1.1025 18.0793 3.28393 20.3357C5.61482 22.7421 8.91589 24 12.315 24C15.4077 24 18.3391 22.7882 20.4284 20.5896C22.4823 18.4254 23.5446 15.4307 23.5446 12.2914C23.5446 10.9698 23.4118 10.185 23.4059 10.1507Z",
					fill: "currentColor"
				})
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41889",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ P("g", {
				clipPath: "url(#clip0_18168_41700)",
				children: [
					/* @__PURE__ */ N("path", {
						d: "M12 9.81812V14.4654H18.4582C18.1746 15.9599 17.3236 17.2254 16.0472 18.0763L19.9417 21.0982C22.2108 19.0037 23.5199 15.9273 23.5199 12.2728C23.5199 11.4219 23.4436 10.6036 23.3017 9.81825L12 9.81812Z",
						fill: "#4285F4"
					}),
					/* @__PURE__ */ N("path", {
						d: "M5.27461 14.2839L4.39625 14.9563L1.28711 17.3781C3.26165 21.2944 7.30862 23.9999 11.9995 23.9999C15.2394 23.9999 17.9557 22.9308 19.9412 21.0981L16.0467 18.0763C14.9776 18.7963 13.614 19.2327 11.9995 19.2327C8.87951 19.2327 6.22868 17.1273 5.27952 14.2909L5.27461 14.2839Z",
						fill: "#34A853"
					}),
					/* @__PURE__ */ N("path", {
						d: "M1.28718 6.62183C0.469042 8.23631 0 10.0581 0 11.9999C0 13.9417 0.469042 15.7636 1.28718 17.378C1.28718 17.3889 5.27997 14.2799 5.27997 14.2799C5.03998 13.5599 4.89812 12.7963 4.89812 11.9998C4.89812 11.2033 5.03998 10.4398 5.27997 9.71976L1.28718 6.62183Z",
						fill: "#FBBC05"
					}),
					/* @__PURE__ */ N("path", {
						d: "M11.9997 4.77818C13.767 4.77818 15.3379 5.38907 16.5925 6.56727L20.0288 3.13095C17.9452 1.18917 15.2398 0 11.9997 0C7.30887 0 3.26165 2.69454 1.28711 6.62183L5.27978 9.72001C6.22882 6.88362 8.87976 4.77818 11.9997 4.77818Z",
						fill: "#EA4335"
					})
				]
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41700",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		}
	},
	"google-meet": {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("g", {
				clipPath: "url(#clip0_18168_41931)",
				children: /* @__PURE__ */ N("path", {
					fillRule: "evenodd",
					clipRule: "evenodd",
					d: "M5.62221 2.58813L0 7.94765V19.8431C0 20.7097 0.736372 21.4117 1.64552 21.4117L17.4152 21.4119C18.3243 21.4119 19.0607 20.71 19.0607 19.8433V16.4655L22.6699 19.2864C23.2102 19.689 24 19.3217 24 18.6668V5.46411C24 4.80136 23.1923 4.43796 22.6534 4.85757L19.0607 7.66543L19.0607 4.15677C19.0607 3.2901 18.3243 2.58813 17.4152 2.58813H5.62221ZM5.62225 7.94751L5.62221 16.0522L13.5756 16.0524V12.0001L13.5756 7.94765L5.62225 7.94751Z",
					fill: "currentColor"
				})
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41931",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [
				/* @__PURE__ */ N("path", {
					d: "M13.5762 12L15.9156 14.549L19.0613 16.4653L19.6098 12.0156L19.0613 7.66528L15.8552 9.34895L13.5762 12Z",
					fill: "#00832D"
				}),
				/* @__PURE__ */ N("path", {
					d: "M0 16.0521V19.843C0 20.7097 0.736372 21.4117 1.64552 21.4117H5.62221L6.44497 18.5463L5.62221 16.0521L2.89338 15.2678L0 16.0521Z",
					fill: "#0066DA"
				}),
				/* @__PURE__ */ N("path", {
					d: "M5.62221 2.58813L0 7.94765L2.89338 8.73197L5.62221 7.94765L6.43126 5.4875L5.62221 2.58813Z",
					fill: "#E94235"
				}),
				/* @__PURE__ */ N("path", {
					d: "M5.62221 7.948H0V16.0526H5.62221V7.948Z",
					fill: "#2684FC"
				}),
				/* @__PURE__ */ N("path", {
					d: "M22.6532 4.85757L19.0605 7.66543V16.4655L22.6697 19.2864C23.21 19.689 23.9998 19.3217 23.9998 18.6668V5.46411C23.9998 4.80136 23.1922 4.43796 22.6532 4.85757ZM13.5754 12.0001V16.0524H5.62207V21.4119H17.415C18.3241 21.4119 19.0605 20.71 19.0605 19.8433V16.4655L13.5754 12.0001Z",
					fill: "#00AC47"
				}),
				/* @__PURE__ */ N("path", {
					d: "M17.415 2.58813H5.62207V7.94765H13.5754V12L19.0605 7.66791V4.15677C19.0605 3.2901 18.3241 2.58813 17.415 2.58813Z",
					fill: "#FFBA00"
				})
			] })
		}
	},
	"google-play": {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ P("g", {
				clipPath: "url(#clip0_18168_41891)",
				children: [
					/* @__PURE__ */ N("path", {
						d: "M5.12606 0.382606L15.942 6.57952L11.1584 11.2927L1.25806 1.54471C1.44569 1.15558 1.72403 0.814383 2.0724 0.55137C2.5478 0.192452 3.12752 -0.00117508 3.72319 5.36551e-06C4.21641 0.00133073 4.70046 0.133346 5.12606 0.382606Z",
						fill: "currentColor"
					}),
					/* @__PURE__ */ N("path", {
						d: "M1 2.694V21.3018L10.446 11.9947L1 2.694Z",
						fill: "currentColor"
					}),
					/* @__PURE__ */ N("path", {
						d: "M11.1586 12.6964L1.25701 22.4524C1.36818 22.6836 1.51172 22.8988 1.68395 23.0911C1.96169 23.4012 2.30667 23.6437 2.6925 23.8001C3.07833 23.9564 3.49481 24.0225 3.91009 23.9932C4.32537 23.964 4.72846 23.8401 5.08855 23.6312L15.9701 17.4338L11.1586 12.6964Z",
						fill: "currentColor"
					}),
					/* @__PURE__ */ N("path", {
						d: "M16.8795 16.9259L21.3229 14.3888C21.7536 14.1633 22.1143 13.8242 22.366 13.4083C22.6177 12.9924 22.7508 12.5156 22.7508 12.0294C22.7508 11.5433 22.6177 11.0664 22.366 10.6505C22.1143 10.2346 21.7536 9.89554 21.3229 9.67005H21.3379L16.843 7.09564L11.8711 11.9944L16.8795 16.9259Z",
						fill: "currentColor"
					})
				]
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41891",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [
				/* @__PURE__ */ N("path", {
					d: "M11.1575 11.4629L1.08984 22.0107C1.20289 22.4113 1.40605 22.7808 1.68379 23.091C1.96154 23.4011 2.30651 23.6436 2.69235 23.8C3.07818 23.9563 3.49465 24.0224 3.90994 23.9931C4.32522 23.9639 4.72831 23.84 5.0884 23.6311L16.4164 17.1794L11.1575 11.4629Z",
					fill: "#EA4335"
				}),
				/* @__PURE__ */ N("path", {
					d: "M21.338 9.67L16.4392 6.86426L10.9253 11.703L16.4618 17.1645L21.323 14.3887C21.7537 14.1632 22.1145 13.8242 22.3662 13.4083C22.6179 12.9924 22.7509 12.5155 22.7509 12.0294C22.7509 11.5432 22.6179 11.0664 22.3662 10.6505C22.1145 10.2346 21.7537 9.89549 21.323 9.67H21.338Z",
					fill: "#FBBC04"
				}),
				/* @__PURE__ */ N("path", {
					d: "M1.09005 1.99561C1.0292 2.22058 0.998916 2.45273 1.00003 2.68579V21.3207C1.00064 21.5536 1.03089 21.7856 1.09005 22.0109L11.5028 11.7332L1.09005 1.99561Z",
					fill: "#4285F4"
				}),
				/* @__PURE__ */ N("path", {
					d: "M11.2325 12.0032L16.4389 6.86431L5.12591 0.382606C4.70031 0.133346 4.21625 0.00133073 3.72304 5.36551e-06C3.12737 -0.00117508 2.54765 0.192452 2.07225 0.55137C1.59685 0.910289 1.25185 1.41481 1.08984 1.98803L11.2325 12.0032Z",
					fill: "#34A853"
				})
			] })
		}
	},
	"google-podcast": {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [
				/* @__PURE__ */ N("path", {
					d: "M12.0001 4.63467C11.1734 4.63467 10.5014 3.96267 10.5014 3.136V1.49867C10.5014 0.672 11.1734 0 12.0001 0C12.8267 0 13.4987 0.672 13.4987 1.49867V3.136C13.4987 3.96267 12.8267 4.63467 12.0001 4.63467Z",
					fill: "currentColor"
				}),
				/* @__PURE__ */ N("path", {
					d: "M12.0001 19.3653C11.1734 19.3653 10.5014 20.0373 10.5014 20.864V22.5013C10.5014 23.328 11.1734 24 12.0001 24C12.8267 24 13.4987 23.328 13.4987 22.5013V20.864C13.4987 20.0373 12.8267 19.3653 12.0001 19.3653Z",
					fill: "currentColor"
				}),
				/* @__PURE__ */ N("path", {
					d: "M8.18032 17.7281V16.0908C8.18032 15.2641 7.50832 14.5921 6.68165 14.5921C5.85498 14.5921 5.18298 15.2641 5.18298 16.0908V17.7281C5.18298 18.5548 5.85498 19.2268 6.68165 19.2268C7.50832 19.2268 8.18032 18.5548 8.18032 17.7281Z",
					fill: "currentColor"
				}),
				/* @__PURE__ */ N("path", {
					d: "M8.18032 11.6268V6.2721C8.18032 5.44544 7.50832 4.77344 6.68165 4.77344C5.85498 4.77344 5.18298 5.44544 5.18298 6.2721V11.6268C5.19898 12.4428 5.86565 13.0934 6.68165 13.0934C7.49765 13.0934 8.16432 12.4374 8.18032 11.6268Z",
					fill: "currentColor"
				}),
				/* @__PURE__ */ N("path", {
					d: "M2.99733 11.1841V12.8214C2.99733 13.6481 2.32533 14.3201 1.49867 14.3201C0.672 14.3201 0 13.6481 0 12.8161V11.1788C0 10.3521 0.672 9.6801 1.49867 9.6801C2.32533 9.6801 2.99733 10.3521 2.99733 11.1841Z",
					fill: "currentColor"
				}),
				/* @__PURE__ */ N("path", {
					d: "M21.0014 11.1843C21.0014 10.3576 21.6734 9.68564 22.5001 9.68564C23.3267 9.68564 23.9987 10.3576 23.9987 11.1843V12.8643C23.9774 13.675 23.3161 14.3203 22.5001 14.3203C21.6841 14.3203 21.0227 13.6696 21.0014 12.8643V11.1843Z",
					fill: "currentColor"
				}),
				/* @__PURE__ */ N("path", {
					d: "M15.8199 7.90944C15.8199 8.7361 16.4919 9.4081 17.3186 9.4081C18.1452 9.4081 18.8172 8.7361 18.8172 7.90944V6.2721C18.8172 5.44544 18.1452 4.77344 17.3186 4.77344C16.4919 4.77344 15.8199 5.44544 15.8199 6.2721V7.90944Z",
					fill: "currentColor"
				}),
				/* @__PURE__ */ N("path", {
					d: "M15.8199 12.4109C15.8199 11.5842 16.4919 10.9122 17.3186 10.9122C18.1452 10.9122 18.8172 11.5842 18.8172 12.4109V17.7282C18.8172 18.5549 18.1452 19.2269 17.3186 19.2269C16.4919 19.2269 15.8199 18.5549 15.8199 17.7282V12.4109Z",
					fill: "currentColor"
				}),
				/* @__PURE__ */ N("path", {
					d: "M13.4987 16.3631V7.6378C13.4987 6.8058 12.8267 6.13913 12.0001 6.13913C11.1734 6.13913 10.5014 6.81113 10.5014 7.6378V16.3631C10.5014 17.1898 11.1734 17.8618 12.0001 17.8618C12.8267 17.8618 13.4987 17.1898 13.4987 16.3631Z",
					fill: "currentColor"
				})
			] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [
				/* @__PURE__ */ N("path", {
					d: "M2.99733 11.1842V12.8215C2.99733 13.6482 2.32533 14.3202 1.49867 14.3202C0.672 14.3202 0 13.6482 0 12.8162V11.1788C0 10.3522 0.672 9.68018 1.49867 9.68018C2.32533 9.68018 2.99733 10.3522 2.99733 11.1842Z",
					fill: "#0066D9"
				}),
				/* @__PURE__ */ N("path", {
					d: "M21.0015 11.2269C21.0015 11.2109 21.0015 11.2002 21.0015 11.1842C21.0015 10.3575 21.6735 9.68555 22.5001 9.68555C23.3268 9.68555 23.9988 10.3575 23.9988 11.1842C23.9988 11.2002 23.9988 11.2109 23.9988 11.2269V12.8642C23.9775 13.6749 23.3161 14.3202 22.5001 14.3202C21.6841 14.3202 21.0228 13.6695 21.0015 12.8642V11.2269Z",
					fill: "#4285F4"
				}),
				/* @__PURE__ */ N("path", {
					d: "M8.18044 16.0908V17.7281C8.18044 18.5548 7.50844 19.2268 6.68177 19.2268C5.85511 19.2268 5.18311 18.5548 5.18311 17.7281V16.0908C5.18311 15.2641 5.85511 14.5921 6.68177 14.5921C7.50844 14.5921 8.18044 15.2641 8.18044 16.0908ZM8.18044 6.2721V11.6268C8.16444 12.4374 7.49777 13.0934 6.68177 13.0934C5.86577 13.0934 5.19911 12.4428 5.18311 11.6268V6.2721C5.18311 5.44544 5.85511 4.77344 6.68177 4.77344C7.50844 4.77344 8.18044 5.44544 8.18044 6.2721Z",
					fill: "#EA4335"
				}),
				/* @__PURE__ */ N("path", {
					d: "M15.8198 7.90944C15.8198 8.7361 16.4918 9.4081 17.3185 9.4081C18.1452 9.4081 18.8172 8.7361 18.8172 7.90944V6.2721C18.8172 5.44544 18.1452 4.77344 17.3185 4.77344C16.4918 4.77344 15.8198 5.44544 15.8198 6.2721V7.90944Z",
					fill: "#34A853"
				}),
				/* @__PURE__ */ N("path", {
					d: "M10.5015 3.136C10.5015 3.96267 11.1735 4.63467 12.0001 4.63467C12.8268 4.63467 13.4988 3.96267 13.4988 3.136V1.49867C13.4988 0.672 12.8268 0 12.0001 0C11.1735 0 10.5015 0.672 10.5015 1.49867V3.136ZM10.5015 20.864C10.5015 20.0373 11.1735 19.3653 12.0001 19.3653C12.8268 19.3653 13.4988 20.0373 13.4988 20.864V22.5013C13.4988 23.328 12.8268 24 12.0001 24C11.1735 24 10.5015 23.328 10.5015 22.5013V20.864Z",
					fill: "#FAB908"
				}),
				/* @__PURE__ */ N("path", {
					d: "M15.8198 12.4108C15.8198 11.5841 16.4918 10.9121 17.3185 10.9121C18.1452 10.9121 18.8172 11.5841 18.8172 12.4108V17.7281C18.8172 18.5548 18.1452 19.2268 17.3185 19.2268C16.4918 19.2268 15.8198 18.5548 15.8198 17.7281V12.4108Z",
					fill: "#34A853"
				}),
				/* @__PURE__ */ N("path", {
					d: "M13.4988 7.63783V16.3632C13.4988 17.1898 12.8268 17.8618 12.0001 17.8618C11.1735 17.8618 10.5015 17.1898 10.5015 16.3632V7.63783C10.5015 6.81116 11.1735 6.13916 12.0001 6.13916C12.8268 6.13916 13.4988 6.80583 13.4988 7.63783Z",
					fill: "#FAB908"
				})
			] })
		}
	},
	imo: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("g", {
				clipPath: "url(#clip0_18168_41949)",
				children: /* @__PURE__ */ N("path", {
					d: "M2.53762 21.8397C1.61115 21.8397 0.843094 21.5373 0.223848 20.9327C-0.0785739 20.6209 -0.0737735 20.1438 0.233449 19.8556C0.737486 19.3785 1.07831 19.0336 1.26072 18.821C1.44314 18.6085 1.69276 18.155 2.00478 17.4558C1.04471 15.7788 0.492668 13.842 0.492668 11.7776C0.492668 5.39072 5.75386 0.208496 12.2487 0.208496C18.7388 0.21322 24 5.39545 24 11.7823C24 18.1691 18.7388 23.3514 12.2439 23.3514C9.73335 23.3514 7.40518 22.5766 5.49464 21.2539C4.57297 21.646 3.5889 21.8397 2.53762 21.8397ZM2.88804 20.1343C3.7041 20.1343 4.45296 19.9832 5.15381 19.6855L5.64825 19.473C5.81146 19.4021 5.99867 19.421 6.14749 19.5249L6.58912 19.832C8.23564 20.9705 10.1894 21.5893 12.2487 21.5893C17.6923 21.5893 22.0991 17.248 22.0991 11.8957C22.0991 6.54338 17.6875 2.1973 12.2487 2.1973C6.80993 2.1973 2.39361 6.53865 2.39361 11.8909C2.39361 13.5821 2.83524 15.2072 3.6609 16.648L3.89612 17.0637C3.97292 17.2007 3.98253 17.3708 3.92012 17.5125L3.72331 17.9471C3.36808 18.7455 3.08006 19.2746 2.78244 19.6241C2.67683 19.747 2.53762 19.8934 2.36001 20.0729C2.51842 20.1107 2.69123 20.1343 2.88804 20.1343ZM6.47871 13.9742C6.47871 14.4702 6.24829 14.7206 5.78746 14.7206C5.33623 14.7206 5.10581 14.4702 5.10581 13.9648V10.4879C5.10581 10.2659 5.17301 10.0958 5.29782 9.96828C5.42743 9.84073 5.59064 9.77459 5.79226 9.77459C6.24349 9.77459 6.47391 10.0155 6.47391 10.4974V13.9742H6.47871ZM14.3321 14.0404C14.3321 14.4939 14.1017 14.7206 13.6408 14.7206C13.18 14.7206 12.9496 14.4939 12.9496 14.0404V11.4327C12.9496 11.0548 12.7384 10.8706 12.3207 10.8706C12.1767 10.8706 12.0423 10.9272 11.9127 11.0406C11.7879 11.154 11.7303 11.2863 11.7303 11.4327V14.0356C11.7303 14.4891 11.5047 14.7159 11.0486 14.7159C10.583 14.7159 10.3478 14.4891 10.3478 14.0356V11.3808C10.3478 11.0359 10.1846 10.8658 9.86296 10.8658C9.69975 10.8658 9.54133 10.932 9.37812 11.0548C9.21491 11.1776 9.1333 11.3099 9.1333 11.4563V14.0309C9.1333 14.4844 8.90769 14.7112 8.46126 14.7112C7.99082 14.7112 7.7508 14.4844 7.7508 14.0309V10.4123C7.7508 9.98717 7.97642 9.76987 8.42285 9.76987C8.77808 9.76987 9.00369 9.91159 9.1045 10.1998C9.40212 9.91159 9.77175 9.76987 10.2134 9.76987C10.727 9.76987 11.1303 9.96355 11.4375 10.3509C11.7399 9.96355 12.1959 9.76987 12.796 9.76987C13.3192 9.76987 13.7128 9.93048 13.9817 10.247C14.2169 10.521 14.3321 10.8942 14.3321 11.3666V14.0404ZM17.3707 14.8009C16.0986 14.8009 15.0713 13.6766 15.0713 12.2878C15.0713 10.8989 16.0986 9.77459 17.3707 9.77459C18.6428 9.77459 19.6701 10.8989 19.6701 12.2878C19.6701 13.6766 18.6428 14.8009 17.3707 14.8009ZM17.3707 13.5443C17.9372 13.5443 18.3932 12.9255 18.3932 12.1602C18.3932 11.3949 17.9372 10.7761 17.3707 10.7761C16.8043 10.7761 16.3482 11.3949 16.3482 12.1602C16.3482 12.9255 16.8091 13.5443 17.3707 13.5443ZM5.87386 9.5195C5.45143 9.5195 5.10581 9.18409 5.10581 8.76366C5.10581 8.34794 5.44663 8.00782 5.87386 8.00782C6.2963 8.00782 6.64192 8.34794 6.64192 8.76366C6.64192 9.17937 6.2963 9.5195 5.87386 9.5195Z",
					fill: "currentColor"
				})
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41949",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("g", {
				clipPath: "url(#clip0_18168_41810)",
				children: /* @__PURE__ */ N("path", {
					d: "M2.53762 21.8397C1.61115 21.8397 0.843094 21.5373 0.223848 20.9327C-0.0785739 20.6209 -0.0737735 20.1438 0.233449 19.8556C0.737486 19.3785 1.07831 19.0336 1.26072 18.821C1.44314 18.6085 1.69276 18.155 2.00478 17.4558C1.04471 15.7788 0.492668 13.842 0.492668 11.7776C0.492668 5.39072 5.75386 0.208496 12.2487 0.208496C18.7388 0.21322 24 5.39545 24 11.7823C24 18.1691 18.7388 23.3514 12.2439 23.3514C9.73335 23.3514 7.40518 22.5766 5.49464 21.2539C4.57297 21.646 3.5889 21.8397 2.53762 21.8397ZM2.88804 20.1343C3.7041 20.1343 4.45296 19.9832 5.15381 19.6855L5.64825 19.473C5.81146 19.4021 5.99867 19.421 6.14749 19.5249L6.58912 19.832C8.23564 20.9705 10.1894 21.5893 12.2487 21.5893C17.6923 21.5893 22.0991 17.248 22.0991 11.8957C22.0991 6.54338 17.6875 2.1973 12.2487 2.1973C6.80993 2.1973 2.39361 6.53865 2.39361 11.8909C2.39361 13.5821 2.83524 15.2072 3.6609 16.648L3.89612 17.0637C3.97292 17.2007 3.98253 17.3708 3.92012 17.5125L3.72331 17.9471C3.36808 18.7455 3.08006 19.2746 2.78244 19.6241C2.67683 19.747 2.53762 19.8934 2.36001 20.0729C2.51842 20.1107 2.69123 20.1343 2.88804 20.1343ZM6.47871 13.9742C6.47871 14.4702 6.24829 14.7206 5.78746 14.7206C5.33623 14.7206 5.10581 14.4702 5.10581 13.9648V10.4879C5.10581 10.2659 5.17301 10.0958 5.29782 9.96828C5.42743 9.84073 5.59064 9.77459 5.79226 9.77459C6.24349 9.77459 6.47391 10.0155 6.47391 10.4974V13.9742H6.47871ZM14.3321 14.0404C14.3321 14.4939 14.1017 14.7206 13.6408 14.7206C13.18 14.7206 12.9496 14.4939 12.9496 14.0404V11.4327C12.9496 11.0548 12.7384 10.8706 12.3207 10.8706C12.1767 10.8706 12.0423 10.9272 11.9127 11.0406C11.7879 11.154 11.7303 11.2863 11.7303 11.4327V14.0356C11.7303 14.4891 11.5047 14.7159 11.0486 14.7159C10.583 14.7159 10.3478 14.4891 10.3478 14.0356V11.3808C10.3478 11.0359 10.1846 10.8658 9.86296 10.8658C9.69975 10.8658 9.54133 10.932 9.37812 11.0548C9.21491 11.1776 9.1333 11.3099 9.1333 11.4563V14.0309C9.1333 14.4844 8.90769 14.7112 8.46126 14.7112C7.99082 14.7112 7.7508 14.4844 7.7508 14.0309V10.4123C7.7508 9.98717 7.97642 9.76987 8.42285 9.76987C8.77808 9.76987 9.00369 9.91159 9.1045 10.1998C9.40212 9.91159 9.77175 9.76987 10.2134 9.76987C10.727 9.76987 11.1303 9.96355 11.4375 10.3509C11.7399 9.96355 12.1959 9.76987 12.796 9.76987C13.3192 9.76987 13.7128 9.93048 13.9817 10.247C14.2169 10.521 14.3321 10.8942 14.3321 11.3666V14.0404ZM17.3707 14.8009C16.0986 14.8009 15.0713 13.6766 15.0713 12.2878C15.0713 10.8989 16.0986 9.77459 17.3707 9.77459C18.6428 9.77459 19.6701 10.8989 19.6701 12.2878C19.6701 13.6766 18.6428 14.8009 17.3707 14.8009ZM17.3707 13.5443C17.9372 13.5443 18.3932 12.9255 18.3932 12.1602C18.3932 11.3949 17.9372 10.7761 17.3707 10.7761C16.8043 10.7761 16.3482 11.3949 16.3482 12.1602C16.3482 12.9255 16.8091 13.5443 17.3707 13.5443ZM5.87386 9.5195C5.45143 9.5195 5.10581 9.18409 5.10581 8.76366C5.10581 8.34794 5.44663 8.00782 5.87386 8.00782C6.2963 8.00782 6.64192 8.34794 6.64192 8.76366C6.64192 9.17937 6.2963 9.5195 5.87386 9.5195Z",
					fill: "#009DFF"
				})
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41810",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		}
	},
	instagram: { mono: {
		viewBox: "0 0 24 24",
		body: /* @__PURE__ */ P(M, { children: [
			/* @__PURE__ */ N("path", {
				d: "M18.3952 7.02212C17.6005 7.02368 16.9543 6.3802 16.9528 5.58548C16.9512 4.79076 17.5947 4.14457 18.3898 4.14302C19.1848 4.14146 19.831 4.78531 19.8326 5.58004C19.8338 6.37476 19.1903 7.02057 18.3952 7.02212Z",
				fill: "currentColor"
			}),
			/* @__PURE__ */ N("path", {
				fillRule: "evenodd",
				clipRule: "evenodd",
				d: "M12.0115 18.161C8.60909 18.1676 5.8451 15.4149 5.8385 12.0117C5.83188 8.60923 8.58536 5.84481 11.9878 5.8382C15.3909 5.83159 18.1553 8.5859 18.1619 11.9879C18.1685 15.3912 15.4143 18.1544 12.0115 18.161ZM11.992 8.00035C9.78365 8.00424 7.99594 9.79858 7.99983 12.0074C8.0041 14.2166 9.79882 16.0039 12.0072 15.9996C14.2164 15.9954 16.0041 14.2014 15.9998 11.9922C15.9955 9.78302 14.2008 7.99608 11.992 8.00035Z",
				fill: "currentColor"
			}),
			/* @__PURE__ */ N("path", {
				fillRule: "evenodd",
				clipRule: "evenodd",
				d: "M4.1192 0.646479C4.88126 0.347876 5.75333 0.143362 7.03015 0.0830982C8.31011 0.0216726 8.71872 0.00767102 11.9769 0.00145262C15.2358 -0.00476578 15.6444 0.00766862 16.9244 0.0644334C18.2016 0.119643 19.0741 0.321049 19.8377 0.616544C20.6277 0.920974 21.298 1.33078 21.966 1.99603C22.6339 2.66205 23.0453 3.33002 23.3536 4.1189C23.6518 4.88174 23.8563 5.75306 23.917 7.03068C23.9776 8.31023 23.9924 8.71847 23.9986 11.9771C24.0048 15.2353 23.9916 15.6443 23.9356 16.925C23.88 18.2014 23.679 19.0743 23.3835 19.8375C23.0783 20.6276 22.6693 21.2979 22.004 21.9659C21.3388 22.6342 20.6701 23.0452 19.8812 23.3539C19.1184 23.6517 18.2471 23.8562 16.9702 23.9173C15.6903 23.9779 15.2817 23.9923 12.0224 23.9985C8.76459 24.0048 8.35598 23.9923 7.07605 23.9359C5.79882 23.88 4.92597 23.6789 4.16275 23.3838C3.37271 23.0782 2.70242 22.6696 2.03446 22.004C1.36611 21.3383 0.954386 20.67 0.646458 19.8811C0.347858 19.1186 0.144107 18.2469 0.0830727 16.9705C0.0220359 15.6901 0.00765506 15.2811 0.00143906 12.0229C-0.00480094 8.76435 0.00803667 8.35611 0.0640167 7.07616C0.1204 5.79855 0.320637 4.92606 0.61613 4.16206C0.921328 3.37239 1.33035 2.70248 1.99637 2.03413C2.6616 1.36616 3.33033 0.954017 4.1192 0.646479ZM4.94154 21.3679C5.36494 21.5308 6.00023 21.7252 7.17014 21.7761C8.43607 21.8309 8.81514 21.843 12.0185 21.8368C15.223 21.8309 15.6021 21.8173 16.8676 21.7579C18.0363 21.7022 18.6716 21.5055 19.0939 21.3407C19.6541 21.1218 20.0531 20.8601 20.4722 20.4406C20.8913 20.0195 21.1506 19.6194 21.3676 19.0591C21.5309 18.6354 21.7249 17.9996 21.7758 16.8297C21.8314 15.5646 21.8431 15.1851 21.8368 11.9809C21.831 8.77757 21.8174 8.3981 21.7572 7.13254C21.7019 5.96339 21.5056 5.32808 21.3404 4.90623C21.1215 4.34519 20.8606 3.94705 20.4399 3.52753C20.0192 3.10801 19.6191 2.84945 19.0581 2.6325C18.6355 2.46881 17.9994 2.27518 16.8303 2.22426C15.5643 2.16865 15.1849 2.15737 11.9808 2.1636C8.77743 2.16982 8.39836 2.18264 7.13281 2.24253C5.9633 2.29812 5.32877 2.49447 4.90575 2.65972C4.34587 2.87861 3.94696 3.13872 3.52746 3.5598C3.10871 3.98087 2.84938 4.38018 2.63244 4.94161C2.46993 5.36464 2.27434 6.00072 2.2242 7.16987C2.16898 8.43581 2.15733 8.81529 2.16355 12.0187C2.16939 15.2228 2.18298 15.6023 2.24248 16.8671C2.29729 18.037 2.49518 18.6715 2.65966 19.0949C2.87855 19.6544 3.13944 20.0533 3.55973 20.4729C3.98081 20.8908 4.38088 21.1509 4.94154 21.3679Z",
				fill: "currentColor"
			})
		] })
	} },
	kickstarter: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("g", {
				clipPath: "url(#clip0_18168_41945)",
				children: /* @__PURE__ */ N("path", {
					fillRule: "evenodd",
					clipRule: "evenodd",
					d: "M18.6859 12.1401L20.8471 9.99324C23.086 7.76937 23.086 4.1473 20.8471 1.92341C18.6083 -0.300467 14.9619 -0.300467 12.7231 1.92341L11.9362 2.70508C10.8944 1.21882 9.1765 0.25 7.21477 0.25C4.04495 0.25 1.47363 2.80416 1.47363 5.95282V18.3163C1.47363 21.4649 4.04495 24.0191 7.21477 24.0191C9.1765 24.0191 10.8944 23.0503 11.9362 21.564L12.7231 22.3457C14.9619 24.5696 18.6083 24.5696 20.8471 22.3457C23.086 20.1218 23.086 16.4997 20.8471 14.2759L18.6859 12.1401Z",
					fill: "currentColor"
				})
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41945",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("g", {
				clipPath: "url(#clip0_18168_41806)",
				children: /* @__PURE__ */ N("path", {
					fillRule: "evenodd",
					clipRule: "evenodd",
					d: "M18.6859 12.1401L20.8471 9.99324C23.086 7.76937 23.086 4.1473 20.8471 1.92341C18.6083 -0.300467 14.9619 -0.300467 12.7231 1.92341L11.9362 2.70508C10.8944 1.21882 9.1765 0.25 7.21477 0.25C4.04495 0.25 1.47363 2.80416 1.47363 5.95282V18.3163C1.47363 21.4649 4.04495 24.0191 7.21477 24.0191C9.1765 24.0191 10.8944 23.0503 11.9362 21.564L12.7231 22.3457C14.9619 24.5696 18.6083 24.5696 20.8471 22.3457C23.086 20.1218 23.086 16.4997 20.8471 14.2759L18.6859 12.1401Z",
					fill: "#05CE78"
				})
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41806",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		}
	},
	line: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ N(M, { children: /* @__PURE__ */ N("path", {
				fillRule: "evenodd",
				clipRule: "evenodd",
				d: "M24 10.6091C24 5.30214 18.6274 1 12 1C5.3725 1 -0.000173161 5.30214 4.18584e-09 10.6091C4.18584e-09 15.3395 4.26872 19.2714 9.88989 20.0699L9.8924 20.0703C10.0244 20.089 10.1576 20.1054 10.2911 20.1208C11.4859 20.3696 11.2883 21.3967 11.1236 22.2525C11.0245 22.7675 10.9374 23.2205 11.1728 23.4045C11.8937 23.9679 17.3558 20.3161 20.6743 17.2488C21.1546 16.8467 21.5914 16.411 21.9793 15.9469L21.9863 15.9392C22.0789 15.8372 22.1523 15.7449 22.2085 15.6614C23.344 14.1935 24 12.4628 24 10.6091ZM7.4581 13.6736H5.03788C4.69362 13.6736 4.41205 13.3919 4.41205 13.0476V8.40585C4.41205 8.06159 4.69362 7.78001 5.03788 7.78001H5.09009C5.43435 7.78001 5.71593 8.06159 5.71593 8.40585V12.3696H7.4581C7.80236 12.3696 8.08394 12.6512 8.08394 12.9954V13.0477C8.08394 13.3919 7.80236 13.6736 7.4581 13.6736ZM20.0348 10.7119V10.7641C20.0348 11.1082 19.7531 11.3899 19.4089 11.3897H17.6668V12.3807H19.4089C19.7531 12.3807 20.0348 12.6623 20.0348 13.0065V13.0587C20.0348 13.403 19.7531 13.6847 19.4089 13.6847H16.9887C16.6444 13.6847 16.3628 13.403 16.3628 13.0587V8.41702C16.3628 8.07276 16.6444 7.79118 16.9887 7.79118H19.4089C19.7531 7.79118 20.0348 8.07276 20.0348 8.41702V8.46923C20.0348 8.81349 19.7531 9.09506 19.4089 9.09506H17.6668V10.086H19.4089C19.7531 10.086 20.0348 10.3676 20.0348 10.7119ZM15.3804 13.487C15.3433 13.5323 15.2906 13.5707 15.228 13.6005C15.138 13.6485 15.0376 13.6736 14.9356 13.6736H14.8833C14.7994 13.6736 14.7193 13.6568 14.6459 13.6265C14.5505 13.5907 14.4649 13.5322 14.4023 13.4468C14.3857 13.4269 14.3703 13.4058 14.3563 13.384L12.0779 10.272V13.0477C12.0779 13.392 11.7963 13.6737 11.4521 13.6737H11.3999C11.0555 13.6737 10.774 13.392 10.774 13.0477V8.40602C10.774 8.06176 11.0556 7.78019 11.3999 7.78019H11.4521C11.684 7.78019 11.8874 7.90799 11.9955 8.09666L14.2576 11.1308V8.40602C14.2576 8.06176 14.5392 7.78019 14.8834 7.78019H14.9356C15.28 7.78019 15.5616 8.06176 15.5616 8.40602V13.0477C15.5615 13.2122 15.4962 13.3702 15.3804 13.487ZM9.26712 13.6736H9.2149C8.87064 13.6736 8.58898 13.3919 8.58898 13.0477V8.40594C8.58898 8.06167 8.87064 7.7801 9.2149 7.7801H9.26712C9.61138 7.7801 9.89295 8.06167 9.89295 8.40594V13.0477C9.89295 13.3919 9.61138 13.6736 9.26712 13.6736Z",
				fill: "currentColor"
			}) })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("path", {
				fillRule: "evenodd",
				clipRule: "evenodd",
				d: "M12 1C18.6274 1 24 5.30214 24 10.6091C24 12.4628 23.344 14.1935 22.2085 15.6614C22.1523 15.7449 22.0789 15.8372 21.9863 15.9392L21.9793 15.9469C21.5914 16.411 21.1546 16.8467 20.6743 17.2488C17.3558 20.3161 11.8937 23.9679 11.1728 23.4045C10.5461 22.9148 12.205 20.5194 10.2911 20.1208C10.1576 20.1054 10.0244 20.089 9.8924 20.0703L9.88989 20.0701V20.0699C4.26872 19.2714 4.18602e-09 15.3395 4.18602e-09 10.6091C-0.000173165 5.30214 5.3725 1 12 1Z",
				fill: "#3ACE01"
			}), /* @__PURE__ */ N("path", {
				fillRule: "evenodd",
				clipRule: "evenodd",
				d: "M5.03794 13.6736H7.45816C7.80242 13.6736 8.084 13.3919 8.084 13.0477V12.9955C8.084 12.6512 7.80242 12.3696 7.45816 12.3696H5.71599V8.40586C5.71599 8.0616 5.43442 7.78003 5.09015 7.78003H5.03794C4.69368 7.78003 4.41211 8.0616 4.41211 8.40586V13.0476C4.41211 13.3919 4.69368 13.6736 5.03794 13.6736ZM20.0349 10.7641V10.7119C20.0349 10.3676 19.7532 10.086 19.4089 10.086H17.6669V9.09508H19.4089C19.7532 9.09508 20.0349 8.81351 20.0349 8.46924V8.41703C20.0349 8.07277 19.7532 7.7912 19.4089 7.7912H16.9887C16.6445 7.7912 16.3629 8.07277 16.3629 8.41703V13.0588C16.3629 13.403 16.6445 13.6847 16.9887 13.6847H19.4089C19.7532 13.6847 20.0349 13.403 20.0349 13.0588V13.0065C20.0349 12.6623 19.7532 12.3807 19.4089 12.3807H17.6669V11.3897H19.4089C19.7532 11.3899 20.0349 11.1083 20.0349 10.7641ZM15.3805 13.487L15.3807 13.4867C15.4965 13.37 15.5615 13.2122 15.5616 13.0478V8.40604C15.5616 8.06178 15.2801 7.7802 14.9357 7.7802H14.8835C14.5392 7.7802 14.2577 8.06178 14.2577 8.40604V11.1308L11.9955 8.09667C11.8875 7.908 11.684 7.7802 11.4521 7.7802H11.3999C11.0557 7.7802 10.774 8.06178 10.774 8.40604V13.0478C10.774 13.392 11.0556 13.6737 11.3999 13.6737H11.4521C11.7964 13.6737 12.078 13.392 12.078 13.0478V10.272L14.3564 13.384C14.3704 13.4058 14.3857 13.4267 14.4023 13.4467L14.4023 13.4468C14.4649 13.5322 14.5506 13.5907 14.646 13.6265C14.7193 13.6568 14.7995 13.6736 14.8834 13.6736H14.9356C15.0376 13.6737 15.138 13.6486 15.228 13.6005C15.2906 13.5707 15.3433 13.5323 15.3805 13.487ZM9.21497 13.6736H9.26718C9.61144 13.6736 9.89301 13.3919 9.89301 13.0477V8.40595C9.89301 8.06169 9.61144 7.78012 9.26718 7.78012H9.21497C8.87071 7.78012 8.58904 8.06169 8.58904 8.40595V13.0477C8.58904 13.3919 8.87071 13.6736 9.21497 13.6736Z",
				fill: "white"
			})] })
		}
	},
	linkedin: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("g", {
				clipPath: "url(#clip0_18168_41923)",
				children: /* @__PURE__ */ N("path", {
					d: "M22.2234 0H1.77187C0.792187 0 0 0.773438 0 1.72969V22.2656C0 23.2219 0.792187 24 1.77187 24H22.2234C23.2031 24 24 23.2219 24 22.2703V1.72969C24 0.773438 23.2031 0 22.2234 0ZM7.12031 20.4516H3.55781V8.99531H7.12031V20.4516ZM5.33906 7.43438C4.19531 7.43438 3.27188 6.51094 3.27188 5.37187C3.27188 4.23281 4.19531 3.30937 5.33906 3.30937C6.47813 3.30937 7.40156 4.23281 7.40156 5.37187C7.40156 6.50625 6.47813 7.43438 5.33906 7.43438ZM20.4516 20.4516H16.8937V14.8828C16.8937 13.5562 16.8703 11.8453 15.0422 11.8453C13.1906 11.8453 12.9094 13.2937 12.9094 14.7891V20.4516H9.35625V8.99531H12.7687V10.5609H12.8156C13.2891 9.66094 14.4516 8.70938 16.1813 8.70938C19.7859 8.70938 20.4516 11.0813 20.4516 14.1656V20.4516Z",
					fill: "currentColor"
				})
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41923",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("g", {
				clipPath: "url(#clip0_18168_41754)",
				children: /* @__PURE__ */ N("path", {
					d: "M22.2283 0H1.77167C1.30179 0 0.851161 0.186657 0.518909 0.518909C0.186657 0.851161 0 1.30179 0 1.77167V22.2283C0 22.6982 0.186657 23.1488 0.518909 23.4811C0.851161 23.8133 1.30179 24 1.77167 24H22.2283C22.6982 24 23.1488 23.8133 23.4811 23.4811C23.8133 23.1488 24 22.6982 24 22.2283V1.77167C24 1.30179 23.8133 0.851161 23.4811 0.518909C23.1488 0.186657 22.6982 0 22.2283 0ZM7.15333 20.445H3.545V8.98333H7.15333V20.445ZM5.34667 7.395C4.93736 7.3927 4.53792 7.2692 4.19873 7.04009C3.85955 6.81098 3.59584 6.48653 3.44088 6.10769C3.28591 5.72885 3.24665 5.31259 3.32803 4.91145C3.40941 4.51032 3.6078 4.14228 3.89816 3.85378C4.18851 3.56529 4.55782 3.36927 4.95947 3.29046C5.36112 3.21165 5.77711 3.25359 6.15495 3.41099C6.53279 3.56838 6.85554 3.83417 7.08247 4.17481C7.30939 4.51546 7.43032 4.91569 7.43 5.325C7.43386 5.59903 7.38251 5.87104 7.27901 6.1248C7.17551 6.37857 7.02198 6.6089 6.82757 6.80207C6.63316 6.99523 6.40185 7.14728 6.14742 7.24915C5.893 7.35102 5.62067 7.40062 5.34667 7.395ZM20.4533 20.455H16.8467V14.1933C16.8467 12.3467 16.0617 11.7767 15.0483 11.7767C13.9783 11.7767 12.9283 12.5833 12.9283 14.24V20.455H9.32V8.99167H12.79V10.58H12.8367C13.185 9.875 14.405 8.67 16.2667 8.67C18.28 8.67 20.455 9.865 20.455 13.365L20.4533 20.455Z",
					fill: "#0A66C2"
				})
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41754",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		}
	},
	medium: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [
				/* @__PURE__ */ N("path", {
					d: "M6.76884 18.6552C10.5069 18.6552 13.5374 15.5984 13.5374 11.8277C13.5374 8.05698 10.5072 5 6.76884 5C3.0305 5 0 8.05767 0 11.8277C0 15.5977 3.03073 18.6552 6.76884 18.6552Z",
					fill: "currentColor"
				}),
				/* @__PURE__ */ N("path", {
					d: "M20.9628 11.8277C20.9628 15.377 19.4476 18.2555 17.5784 18.2555C15.7092 18.2555 14.194 15.377 14.194 11.8277C14.194 8.2784 15.709 5.39996 17.5782 5.39996C19.4473 5.39996 20.9628 8.27748 20.9628 11.8277Z",
					fill: "currentColor"
				}),
				/* @__PURE__ */ N("path", {
					d: "M24 11.8277C24 15.007 23.4671 17.586 22.8097 17.586C22.1522 17.586 21.6196 15.0077 21.6196 11.8277C21.6196 8.6477 22.1524 6.06946 22.8097 6.06946C23.4669 6.06946 24 8.64747 24 11.8277Z",
					fill: "currentColor"
				})
			] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ P("g", {
				clipPath: "url(#clip0_18168_41684)",
				children: [
					/* @__PURE__ */ N("path", {
						d: "M6.76884 18.6552C10.5069 18.6552 13.5374 15.5984 13.5374 11.8277C13.5374 8.05698 10.5072 5 6.76884 5C3.0305 5 0 8.05767 0 11.8277C0 15.5977 3.03073 18.6552 6.76884 18.6552Z",
						fill: "black"
					}),
					/* @__PURE__ */ N("path", {
						d: "M20.9628 11.8277C20.9628 15.377 19.4476 18.2555 17.5784 18.2555C15.7092 18.2555 14.194 15.377 14.194 11.8277C14.194 8.2784 15.709 5.39996 17.5782 5.39996C19.4473 5.39996 20.9628 8.27748 20.9628 11.8277Z",
						fill: "black"
					}),
					/* @__PURE__ */ N("path", {
						d: "M24 11.8277C24 15.007 23.4671 17.586 22.8097 17.586C22.1522 17.586 21.6196 15.0077 21.6196 11.8277C21.6196 8.6477 22.1524 6.06946 22.8097 6.06946C23.4669 6.06946 24 8.64747 24 11.8277Z",
						fill: "black"
					})
				]
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41684",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		}
	},
	messenger: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ N(M, { children: /* @__PURE__ */ N("path", {
				fillRule: "evenodd",
				clipRule: "evenodd",
				d: "M0 11.64C0 4.953 5.241 0 12 0C18.759 0 24 4.956 24 11.643C24 18.33 18.759 23.283 12 23.283C10.785 23.283 9.621 23.121 8.526 22.821C8.313 22.764 8.085 22.779 7.884 22.869L5.502 23.919C5.35814 23.9825 5.20089 24.0096 5.04408 23.9981C4.88726 23.9865 4.73569 23.9367 4.60267 23.8528C4.46965 23.769 4.35926 23.6537 4.2812 23.5172C4.20314 23.3808 4.15981 23.2272 4.155 23.07L4.089 20.934C4.083 20.67 3.963 20.424 3.768 20.25C1.434 18.162 0 15.138 0 11.64ZM8.31901 9.45301L4.79401 15.045C4.45501 15.582 5.11501 16.185 5.61901 15.801L9.40501 12.927C9.52958 12.8324 9.68158 12.7809 9.83801 12.7804C9.99444 12.7798 10.1468 12.8303 10.272 12.924L13.077 15.027C13.276 15.1764 13.5037 15.283 13.746 15.3399C13.9882 15.3969 14.2395 15.403 14.4842 15.3579C14.7289 15.3128 14.9616 15.2174 15.1676 15.0779C15.3736 14.9383 15.5484 14.7575 15.681 14.547L19.209 8.95801C19.545 8.42101 18.885 7.81501 18.381 8.19901L14.595 11.073C14.4704 11.1676 14.3184 11.2191 14.162 11.2196C14.0056 11.2202 13.8532 11.1698 13.728 11.076L10.923 8.97301C10.7241 8.82359 10.4963 8.71704 10.2541 8.66009C10.0119 8.60314 9.76047 8.59702 9.51578 8.64213C9.27109 8.68723 9.0384 8.78258 8.83242 8.92215C8.62643 9.06171 8.45162 9.24247 8.31901 9.45301Z",
				fill: "currentColor"
			}) })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [
				/* @__PURE__ */ N("path", {
					d: "M11.9997 0C5.24085 0 0 4.95286 0 11.6397C0 15.1376 1.43396 18.1615 3.76789 20.2494C3.96289 20.4234 4.08289 20.6694 4.08889 20.9334L4.15488 23.0694C4.15969 23.2265 4.20302 23.3801 4.28108 23.5166C4.35914 23.6531 4.46952 23.7683 4.60254 23.8521C4.73555 23.936 4.88713 23.9859 5.04394 23.9974C5.20074 24.009 5.35799 23.9818 5.50185 23.9183L7.88378 22.8684C8.08477 22.7784 8.31277 22.7634 8.52576 22.8204C9.62073 23.1204 10.7847 23.2824 11.9997 23.2824C18.7585 23.2824 23.9993 18.3295 23.9993 11.6427C23.9993 4.95586 18.7585 0 11.9997 0Z",
					fill: "url(#paint0_radial_18168_41603)"
				}),
				/* @__PURE__ */ N("path", {
					d: "M4.79364 15.0447L8.31854 9.45281C8.45114 9.24228 8.62595 9.06153 8.83193 8.92197C9.03792 8.7824 9.27059 8.68706 9.51528 8.64196C9.75997 8.59685 10.0113 8.60297 10.2536 8.65992C10.4958 8.71687 10.7235 8.82341 10.9225 8.97283L13.7274 11.0758C13.8526 11.1695 14.005 11.2199 14.1614 11.2194C14.3178 11.2189 14.4698 11.1674 14.5944 11.0728L18.3803 8.19885C18.8842 7.81486 19.5442 8.42084 19.2082 8.95783L15.6803 14.5467C15.5477 14.7572 15.3729 14.938 15.1669 15.0775C14.961 15.2171 14.7283 15.3124 14.4836 15.3575C14.2389 15.4026 13.9875 15.3965 13.7453 15.3396C13.5031 15.2826 13.2754 15.1761 13.0764 15.0267L10.2715 12.9237C10.1463 12.83 9.99392 12.7795 9.8375 12.7801C9.68107 12.7806 9.52908 12.8321 9.40451 12.9267L5.61862 15.8006C5.11463 16.1846 4.45465 15.5816 4.79364 15.0447Z",
					fill: "white"
				}),
				/* @__PURE__ */ N("defs", { children: /* @__PURE__ */ P("radialGradient", {
					id: "paint0_radial_18168_41603",
					cx: "0",
					cy: "0",
					r: "1",
					gradientUnits: "userSpaceOnUse",
					gradientTransform: "translate(4.01989 23.9993) scale(26.3993 26.3993)",
					children: [
						/* @__PURE__ */ N("stop", { stopColor: "#0099FF" }),
						/* @__PURE__ */ N("stop", {
							offset: "0.6",
							stopColor: "#A033FF"
						}),
						/* @__PURE__ */ N("stop", {
							offset: "0.9",
							stopColor: "#FF5280"
						}),
						/* @__PURE__ */ N("stop", {
							offset: "1",
							stopColor: "#FF7061"
						})
					]
				}) })
			] })
		}
	},
	"microsoft-teams": {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [
				/* @__PURE__ */ N("path", {
					d: "M9.24945 4.50001C9.24945 4.75751 9.27726 5.00851 9.33003 5.25018H12.5003C12.7652 5.25097 13.019 5.35656 13.2063 5.54388C13.3936 5.7312 13.4992 5.98503 13.5 6.24993V7.91943C13.3916 7.94315 13.2826 7.96161 13.1734 7.97488C14.9067 7.76575 16.2499 6.28974 16.2499 4.50001C16.2499 2.56687 14.6828 0.999756 12.7497 0.999756C10.8166 0.999756 9.24945 2.56687 9.24945 4.50001Z",
					fill: "currentColor"
				}),
				/* @__PURE__ */ N("path", {
					d: "M23.2504 5.62512C23.2504 7.07487 22.0752 8.25012 20.6254 8.25012C19.1757 8.25012 18.0004 7.07487 18.0004 5.62512C18.0004 4.17537 19.1757 3.00012 20.6254 3.00012C22.0752 3.00012 23.2504 4.17537 23.2504 5.62512Z",
					fill: "currentColor"
				}),
				/* @__PURE__ */ N("path", {
					d: "M22.8749 9.00031C23.1733 9.00031 23.4595 9.11883 23.6704 9.32981C23.8814 9.54079 23.9999 9.82694 23.9999 10.1253V15.7038C23.9996 16.2621 23.8747 16.8132 23.6344 17.3171C23.3942 17.8211 23.0446 18.2651 22.6111 18.6168C22.1776 18.9686 21.6711 19.2192 21.1285 19.3505C20.5859 19.4818 20.0208 19.4904 19.4744 19.3758C19.1281 19.2958 18.7971 19.1686 18.4898 18.9998C18.2818 19.683 17.9522 20.328 17.5119 20.9023C16.7084 21.9501 15.5815 22.7034 14.3062 23.0454C13.0308 23.3873 11.6782 23.2987 10.4584 22.7933C9.23851 22.2879 8.21957 21.394 7.55969 20.2503C7.41537 20.0104 7.28999 19.7597 7.18469 19.5003H12.5022C12.5758 19.5014 12.6491 19.4913 12.7197 19.4703C12.9406 19.4223 13.1385 19.3002 13.2804 19.1242C13.4223 18.9482 13.4997 18.7289 13.4997 18.5028V9.00031L22.8749 9.00031Z",
					fill: "currentColor"
				}),
				/* @__PURE__ */ N("path", {
					fillRule: "evenodd",
					clipRule: "evenodd",
					d: "M0.999749 6.00018H11.0002C11.2654 6.00018 11.5197 6.10551 11.7072 6.293C11.8947 6.48049 12 6.73478 12 6.99993V17.0004C12 17.2656 11.8947 17.5199 11.7072 17.7074C11.5197 17.8949 11.2654 18.0002 11.0002 18.0002H0.999749C0.734599 18.0002 0.480309 17.8949 0.29282 17.7074C0.10533 17.5199 0 17.2656 0 17.0004V6.99993C0 6.73478 0.10533 6.48049 0.29282 6.293C0.480309 6.10551 0.734599 6.00018 0.999749 6.00018ZM8.98507 9.73153H6.74257V15.7465H5.27107V9.73153H3.01508V8.25403H8.98507V9.73153Z",
					fill: "currentColor"
				})
			] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [
				/* @__PURE__ */ N("path", {
					d: "M12.7498 8.00026C14.6829 8.00026 16.25 6.43314 16.25 4.50001C16.25 2.56687 14.6829 0.999756 12.7498 0.999756C10.8166 0.999756 9.24951 2.56687 9.24951 4.50001C9.24951 6.43314 10.8166 8.00026 12.7498 8.00026Z",
					fill: "#7B83EB"
				}),
				/* @__PURE__ */ N("path", {
					opacity: "0.1",
					d: "M12.5003 5.25024H9.33008L9.34583 5.31999L9.34733 5.32599L9.36383 5.39049C9.59418 6.26402 10.1531 7.0148 10.9238 7.48605C11.6946 7.9573 12.6176 8.11259 13.5001 7.91949V6.24999C13.4993 5.98509 13.3937 5.73126 13.2064 5.54394C13.0191 5.35662 12.7652 5.25104 12.5003 5.25024Z",
					fill: "black"
				}),
				/* @__PURE__ */ N("path", {
					opacity: "0.2",
					d: "M11.7509 6.00024H9.58789C9.87177 6.59876 10.3197 7.10444 10.8795 7.45852C11.4394 7.81259 12.0882 8.00053 12.7506 8.00049V6.99999C12.7498 6.73509 12.6443 6.48126 12.4569 6.29394C12.2696 6.10662 12.0158 6.00104 11.7509 6.00024Z",
					fill: "black"
				}),
				/* @__PURE__ */ N("path", {
					d: "M20.6255 8.25C22.0752 8.25 23.2505 7.07475 23.2505 5.625C23.2505 4.17525 22.0752 3 20.6255 3C19.1757 3 18.0005 4.17525 18.0005 5.625C18.0005 7.07475 19.1757 8.25 20.6255 8.25Z",
					fill: "#5059C9"
				}),
				/* @__PURE__ */ N("path", {
					d: "M22.8749 9.00024H16.9792C16.8519 9.00024 16.7298 9.05082 16.6398 9.14083C16.5498 9.23085 16.4992 9.35294 16.4992 9.48024V15.5627C16.4829 16.4431 16.7696 17.3022 17.3113 17.9964C17.8529 18.6905 18.6166 19.1775 19.4744 19.3757C20.0208 19.4904 20.5859 19.4817 21.1285 19.3504C21.6711 19.2191 22.1776 18.9685 22.6111 18.6167C23.0446 18.265 23.3942 17.821 23.6344 17.3171C23.8747 16.8132 23.9996 16.262 23.9999 15.7037V10.1252C23.9999 9.82688 23.8814 9.54073 23.6704 9.32975C23.4595 9.11877 23.1733 9.00024 22.8749 9.00024Z",
					fill: "#5059C9"
				}),
				/* @__PURE__ */ N("path", {
					d: "M18.7495 10.1252V17.2502C18.7502 18.5707 18.3151 19.8544 17.5117 20.9022C16.7082 21.9501 15.5814 22.7034 14.306 23.0453C13.0306 23.3872 11.6781 23.2986 10.4582 22.7932C9.23833 22.2878 8.21939 21.3939 7.55951 20.2502C7.41519 20.0104 7.28981 19.7596 7.18451 19.5002C7.08635 19.2557 7.00368 19.0052 6.93701 18.7502C6.81337 18.2598 6.75039 17.756 6.74951 17.2502V10.1252C6.74932 9.97745 6.77828 9.83107 6.83475 9.69449C6.89121 9.55791 6.97407 9.43382 7.07858 9.32931C7.18308 9.2248 7.30718 9.14195 7.44376 9.08548C7.58034 9.02901 7.72672 9.00005 7.87451 9.00025H17.6245C17.7723 9.00005 17.9187 9.02901 18.0553 9.08548C18.1918 9.14195 18.3159 9.2248 18.4204 9.32931C18.5249 9.43382 18.6078 9.55791 18.6643 9.69449C18.7207 9.83107 18.7497 9.97745 18.7495 10.1252Z",
					fill: "#7B83EB"
				}),
				/* @__PURE__ */ N("path", {
					opacity: "0.2",
					d: "M11.7509 6.00024H9.58789C9.87177 6.59876 10.3197 7.10444 10.8795 7.45852C11.4394 7.81259 12.0882 8.00053 12.7506 8.00049V6.99999C12.7498 6.73509 12.6443 6.48126 12.4569 6.29394C12.2696 6.10662 12.0158 6.00104 11.7509 6.00024Z",
					fill: "black"
				}),
				/* @__PURE__ */ N("path", {
					opacity: "0.1",
					d: "M13.4995 9.00025V18.5027C13.4995 18.7288 13.4221 18.9481 13.2802 19.1241C13.1383 19.3001 12.9405 19.4223 12.7195 19.4702C12.649 19.4912 12.5756 19.5014 12.502 19.5002H7.18451C7.08635 19.2557 7.00368 19.0052 6.93701 18.7502C6.81337 18.2598 6.75039 17.756 6.74951 17.2502V10.1252C6.74932 9.97745 6.77828 9.83107 6.83475 9.69449C6.89121 9.55791 6.97407 9.43382 7.07858 9.32931C7.18308 9.2248 7.30718 9.14195 7.44376 9.08548C7.58034 9.02901 7.72672 9.00005 7.87451 9.00025H13.4995Z",
					fill: "black"
				}),
				/* @__PURE__ */ N("path", {
					opacity: "0.2",
					d: "M12.7495 9.00025V19.2527C12.7506 19.3263 12.7405 19.3997 12.7195 19.4702C12.6716 19.6912 12.5494 19.8891 12.3734 20.031C12.1974 20.1729 11.9781 20.2503 11.752 20.2502H7.55951C7.41519 20.0104 7.28981 19.7596 7.18451 19.5002C7.08635 19.2557 7.00368 19.0052 6.93701 18.7502C6.81337 18.2598 6.75039 17.756 6.74951 17.2502V10.1252C6.74932 9.97745 6.77828 9.83107 6.83475 9.69449C6.89121 9.55791 6.97407 9.43382 7.07858 9.32931C7.18308 9.2248 7.30718 9.14195 7.44376 9.08548C7.58034 9.02901 7.72672 9.00005 7.87451 9.00025H12.7495Z",
					fill: "black"
				}),
				/* @__PURE__ */ N("path", {
					opacity: "0.2",
					d: "M12.7495 9.00025V17.7527C12.7483 18.0169 12.6429 18.27 12.456 18.4568C12.2692 18.6436 12.0162 18.7491 11.752 18.7502H6.93701C6.81337 18.2598 6.75039 17.756 6.74951 17.2502V10.1252C6.74932 9.97745 6.77828 9.83107 6.83475 9.69449C6.89121 9.55791 6.97407 9.43382 7.07858 9.32931C7.18308 9.2248 7.30718 9.14195 7.44376 9.08548C7.58034 9.02901 7.72672 9.00005 7.87451 9.00025H12.7495Z",
					fill: "black"
				}),
				/* @__PURE__ */ N("path", {
					opacity: "0.2",
					d: "M7.87451 9.00025C7.72672 9.00005 7.58034 9.02901 7.44376 9.08548C7.30718 9.14195 7.18308 9.2248 7.07858 9.32931C6.97407 9.43382 6.89121 9.55791 6.83475 9.69449C6.77828 9.83107 6.74932 9.97745 6.74951 10.1252V17.2502C6.75039 17.756 6.81337 18.2598 6.93701 18.7502H11.002C11.2662 18.7491 11.5192 18.6436 11.706 18.4568C11.8929 18.27 11.9983 18.0169 11.9995 17.7527V9.00025H7.87451Z",
					fill: "black"
				}),
				/* @__PURE__ */ N("path", {
					d: "M0.999749 6.00024H11.0002C11.2654 6.00024 11.5197 6.10557 11.7072 6.29306C11.8947 6.48055 12 6.73484 12 6.99999V17.0005C12 17.2656 11.8947 17.5199 11.7072 17.7074C11.5197 17.8949 11.2654 18.0002 11.0002 18.0002H0.999749C0.734599 18.0002 0.480309 17.8949 0.29282 17.7074C0.10533 17.5199 0 17.2656 0 17.0005L0 6.99999C0 6.73484 0.10533 6.48055 0.29282 6.29306C0.480309 6.10557 0.734599 6.00024 0.999749 6.00024Z",
					fill: "#4B53BC"
				}),
				/* @__PURE__ */ N("path", {
					d: "M8.98513 9.73141H6.74263V15.7464H5.27114V9.73141H3.01514V8.25391H8.98513V9.73141Z",
					fill: "white"
				})
			] })
		}
	},
	notion: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("g", {
				clipPath: "url(#clip0_18168_41925)",
				children: /* @__PURE__ */ N("path", {
					d: "M4.45926 4.208C5.20526 4.814 5.48526 4.768 6.88726 4.674L20.1023 3.881C20.3823 3.881 20.1493 3.601 20.0563 3.555L17.8603 1.968C17.4403 1.642 16.8793 1.268 15.8053 1.361L3.01026 2.295C2.54426 2.341 2.45026 2.575 2.63626 2.761L4.45926 4.208ZM5.25226 7.288V21.192C5.25226 21.939 5.62526 22.219 6.46626 22.172L20.9893 21.332C21.8303 21.286 21.9243 20.772 21.9243 20.165V6.354C21.9243 5.748 21.6913 5.421 21.1763 5.467L5.99926 6.354C5.43926 6.401 5.25226 6.681 5.25226 7.287V7.288ZM19.5893 8.033C19.6823 8.453 19.5893 8.873 19.1693 8.921L18.4693 9.061V19.325C17.8613 19.652 17.3013 19.839 16.8343 19.839C16.0863 19.839 15.8993 19.605 15.3393 18.906L10.7623 11.72V18.672L12.2103 19C12.2103 19 12.2103 19.84 11.0423 19.84L7.82026 20.026C7.72726 19.84 7.82026 19.373 8.14726 19.28L8.98726 19.047V9.854L7.82226 9.76C7.72826 9.34 7.96226 8.734 8.61526 8.687L12.0713 8.454L16.8353 15.733V9.293L15.6203 9.154C15.5273 8.64 15.9003 8.267 16.3673 8.221L19.5893 8.033ZM1.93626 1.035L15.2463 0.0549961C16.8803 -0.0850039 17.3013 0.0079961 18.3283 0.754996L22.5773 3.741C23.2773 4.254 23.5113 4.394 23.5113 4.954V21.332C23.5113 22.358 23.1383 22.966 21.8313 23.058L6.37326 23.992C5.39326 24.039 4.92526 23.899 4.41126 23.245L1.28226 19.185C0.722258 18.438 0.489258 17.879 0.489258 17.225V2.667C0.489258 1.828 0.863258 1.127 1.93626 1.035Z",
					fill: "currentColor"
				})
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41925",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("g", {
				clipPath: "url(#clip0_18168_41756)",
				children: /* @__PURE__ */ P("g", {
					clipPath: "url(#clip1_18168_41756)",
					children: [
						/* @__PURE__ */ N("path", {
							d: "M4.45926 4.208C5.20526 4.814 5.48526 4.768 6.88726 4.674L20.1023 3.881C20.3823 3.881 20.1493 3.601 20.0563 3.555L17.8603 1.968C17.4403 1.642 16.8793 1.268 15.8053 1.361L3.01026 2.295C2.54426 2.341 2.45026 2.575 2.63626 2.761L4.45926 4.208ZM5.25226 7.288V21.192C5.25226 21.939 5.62526 22.219 6.46626 22.172L20.9893 21.332C21.8303 21.286 21.9243 20.772 21.9243 20.165V6.354C21.9243 5.748 21.6913 5.421 21.1763 5.467L5.99926 6.354C5.43926 6.401 5.25226 6.681 5.25226 7.287V7.288ZM19.5893 8.033C19.6823 8.453 19.5893 8.873 19.1693 8.921L18.4693 9.061V19.325C17.8613 19.652 17.3013 19.839 16.8343 19.839C16.0863 19.839 15.8993 19.605 15.3393 18.906L10.7623 11.72V18.672L12.2103 19C12.2103 19 12.2103 19.84 11.0423 19.84L7.82026 20.026C7.72726 19.84 7.82026 19.373 8.14726 19.28L8.98726 19.047V9.854L7.82226 9.76C7.72826 9.34 7.96226 8.734 8.61526 8.687L12.0713 8.454L16.8353 15.733V9.293L15.6203 9.154C15.5273 8.64 15.9003 8.267 16.3673 8.221L19.5893 8.033ZM1.93626 1.035L15.2463 0.0549961C16.8803 -0.0850039 17.3013 0.0079961 18.3283 0.754996L22.5773 3.741C23.2773 4.254 23.5113 4.394 23.5113 4.954V21.332C23.5113 22.358 23.1383 22.966 21.8313 23.058L6.37326 23.992C5.39326 24.039 4.92526 23.899 4.41126 23.245L1.28226 19.185C0.722258 18.438 0.489258 17.879 0.489258 17.225V2.667C0.489258 1.828 0.863258 1.127 1.93626 1.035Z",
							fill: "#2F3437"
						}),
						/* @__PURE__ */ N("path", {
							d: "M4.45926 4.208C5.20526 4.814 5.48526 4.768 6.88726 4.674L20.1023 3.881C20.3823 3.881 20.1493 3.601 20.0563 3.555L17.8603 1.968C17.4403 1.642 16.8793 1.268 15.8053 1.361L3.01026 2.295C2.54426 2.341 2.45026 2.575 2.63626 2.761L4.45926 4.208Z",
							fill: "white"
						}),
						/* @__PURE__ */ N("path", {
							fillRule: "evenodd",
							clipRule: "evenodd",
							d: "M5.25226 7.288V21.192C5.25226 21.939 5.62526 22.219 6.46626 22.172L20.9893 21.332C21.8303 21.286 21.9243 20.772 21.9243 20.165V6.354C21.9243 5.748 21.6913 5.421 21.1763 5.467L5.99926 6.354C5.43926 6.401 5.25226 6.681 5.25226 7.287V7.288ZM19.1693 8.921C19.5893 8.873 19.6823 8.453 19.5893 8.033L16.3673 8.221C15.9003 8.267 15.5273 8.64 15.6203 9.154L16.8353 9.293V15.733L12.0713 8.454L8.61526 8.687C7.96226 8.734 7.72826 9.34 7.82226 9.76L8.98726 9.854V19.047L8.14726 19.28C7.82026 19.373 7.72726 19.84 7.82026 20.026L11.0423 19.84C12.2103 19.84 12.2103 19 12.2103 19L10.7623 18.672V11.72L15.3393 18.906L15.3403 18.9073C15.8995 19.6053 16.0867 19.839 16.8343 19.839C17.3013 19.839 17.8613 19.652 18.4693 19.325V9.061L19.1693 8.921Z",
							fill: "white"
						})
					]
				})
			}), /* @__PURE__ */ P("defs", { children: [/* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41756",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}), /* @__PURE__ */ N("clipPath", {
				id: "clip1_18168_41756",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			})] })] })
		}
	},
	ok: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ P("g", {
				clipPath: "url(#clip0_18168_41843)",
				children: [/* @__PURE__ */ N("path", {
					d: "M10.6431 6.33215C10.9964 5.97879 11.477 5.76678 12 5.76678C12.5371 5.76678 13.0177 5.97879 13.3569 6.33215C13.7102 6.68551 13.9223 7.16607 13.9223 7.68904C13.9223 8.22614 13.7102 8.70671 13.3569 9.04593C13.0035 9.39929 12.5229 9.6113 12 9.6113C11.4629 9.6113 10.9823 9.39929 10.6431 9.04593C10.2897 8.69257 10.0777 8.21201 10.0777 7.68904C10.0777 7.16607 10.3039 6.68551 10.6431 6.33215Z",
					fill: "currentColor"
				}), /* @__PURE__ */ N("path", {
					fillRule: "evenodd",
					clipRule: "evenodd",
					d: "M1.68197 1.68198C0 3.36396 0 6.09187 0 11.5194V12.4806C0 17.9223 0 20.6361 1.68197 22.318C3.36395 24 6.09187 24 11.5194 24H12.4806C17.9081 24 20.636 24 22.318 22.318C24 20.6361 24 17.9081 24 12.4806V11.5194C24 6.09187 24 3.36396 22.318 1.68198C20.636 0 17.9081 0 12.4806 0H11.5194C6.09187 0 3.37809 0 1.68197 1.68198ZM12 11.9435C13.1731 11.9435 14.2332 11.4629 14.9965 10.6996C15.7597 9.93639 16.2403 8.87632 16.2403 7.70318C16.2403 6.53003 15.7597 5.46996 14.9965 4.70671C14.2332 3.94346 13.1731 3.46289 12 3.46289C10.8268 3.46289 9.76677 3.94346 9.00352 4.70671C8.24027 5.46996 7.7597 6.53003 7.7597 7.70318C7.7597 8.87632 8.24027 9.93639 9.00352 10.6996C9.76677 11.4629 10.841 11.9435 12 11.9435ZM17.4554 13.7801L16.2116 12.084C16.1409 11.985 15.9996 11.9709 15.9147 12.0557C14.7416 13.0592 13.2999 13.7094 11.7451 13.7094C10.1904 13.7094 8.74867 13.0592 7.57552 12.0557C7.49072 11.985 7.34937 11.9991 7.2787 12.084L6.03489 13.7801C5.97835 13.8649 5.99248 13.9779 6.06315 14.0486C7.10909 14.8967 8.32464 15.4762 9.59672 15.773L6.96775 20.409C6.89708 20.5363 6.99602 20.7059 7.13736 20.7059H9.7098C9.79461 20.7059 9.86528 20.6635 9.89354 20.5787L11.731 16.4797L13.5685 20.5787C13.5967 20.6493 13.6674 20.7059 13.7522 20.7059H16.3246C16.4801 20.7059 16.5649 20.5504 16.4943 20.409L13.8653 15.773C15.1374 15.4762 16.3529 14.9108 17.3988 14.0486C17.5119 13.9779 17.5261 13.8649 17.4554 13.7801Z",
					fill: "currentColor"
				})]
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41843",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ P("g", {
				clipPath: "url(#clip0_18168_41621)",
				children: [
					/* @__PURE__ */ N("path", {
						d: "M0 11.5194C0 6.09187 0 3.36396 1.68197 1.68198C3.37809 1.34795e-07 6.09187 0 11.5194 0H12.4806C17.9081 0 20.636 1.34795e-07 22.318 1.68198C24 3.36396 24 6.09187 24 11.5194V12.4806C24 17.9081 24 20.6361 22.318 22.318C20.636 24 17.9081 24 12.4806 24H11.5194C6.09187 24 3.36395 24 1.68197 22.318C0 20.6361 0 17.9223 0 12.4806V11.5194Z",
						fill: "#FF7700"
					}),
					/* @__PURE__ */ N("path", {
						fillRule: "evenodd",
						clipRule: "evenodd",
						d: "M14.9965 10.6996C14.2332 11.4629 13.1731 11.9435 12 11.9435C10.841 11.9435 9.76677 11.4629 9.00352 10.6996C8.24027 9.93639 7.7597 8.87632 7.7597 7.70318C7.7597 6.53003 8.24027 5.46996 9.00352 4.70671C9.76677 3.94346 10.8268 3.46289 12 3.46289C13.1731 3.46289 14.2332 3.94346 14.9965 4.70671C15.7597 5.46996 16.2403 6.53003 16.2403 7.70318C16.2403 8.87632 15.7597 9.93639 14.9965 10.6996ZM12 5.76678C11.477 5.76678 10.9964 5.97879 10.6431 6.33215C10.3039 6.68551 10.0777 7.16607 10.0777 7.68904C10.0777 8.21201 10.2897 8.69257 10.6431 9.04593C10.9823 9.39929 11.4629 9.6113 12 9.6113C12.5229 9.6113 13.0035 9.39929 13.3569 9.04593C13.7102 8.70671 13.9223 8.22614 13.9223 7.68904C13.9223 7.16607 13.7102 6.68551 13.3569 6.33215C13.0177 5.97879 12.5371 5.76678 12 5.76678Z",
						fill: "white"
					}),
					/* @__PURE__ */ N("path", {
						d: "M16.2116 12.084L17.4554 13.7801C17.5261 13.8649 17.5119 13.9779 17.3988 14.0486C16.3529 14.9108 15.1374 15.4762 13.8653 15.773L16.4943 20.409C16.5649 20.5504 16.4801 20.7059 16.3246 20.7059H13.7522C13.6674 20.7059 13.5967 20.6493 13.5685 20.5787L11.731 16.4797L9.89354 20.5787C9.86528 20.6635 9.7946 20.7059 9.7098 20.7059H7.13736C6.99602 20.7059 6.89708 20.5363 6.96775 20.409L9.59672 15.773C8.32464 15.4762 7.10909 14.8967 6.06315 14.0486C5.99248 13.9779 5.97835 13.8649 6.03489 13.7801L7.2787 12.084C7.34937 11.9991 7.49072 11.985 7.57552 12.0557C8.74867 13.0592 10.1904 13.7094 11.7451 13.7094C13.2999 13.7094 14.7416 13.0592 15.9147 12.0557C15.9996 11.9709 16.1409 11.985 16.2116 12.084Z",
						fill: "white"
					})
				]
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41621",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		}
	},
	"ok-only-sign": {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("path", {
				fillRule: "evenodd",
				clipRule: "evenodd",
				d: "M15.8503 10.3226C14.8693 11.3036 13.5068 11.9213 11.9989 11.9213C10.5093 11.9213 9.12859 11.3036 8.14758 10.3226C7.16657 9.34163 6.5489 7.97912 6.5489 6.47128C6.5489 4.96343 7.16657 3.60092 8.14758 2.61992C9.12859 1.63891 10.4911 1.02124 11.9989 1.02124C13.5068 1.02124 14.8693 1.63891 15.8503 2.61992C16.8313 3.60092 17.449 4.96343 17.449 6.47128C17.449 7.97912 16.8313 9.34163 15.8503 10.3226ZM11.9989 3.98243C11.3268 3.98243 10.7091 4.25493 10.2549 4.7091C9.81892 5.16327 9.52825 5.78094 9.52825 6.45311C9.52825 7.12528 9.80075 7.74295 10.2549 8.19712C10.6909 8.65129 11.3086 8.92379 11.9989 8.92379C12.6711 8.92379 13.2888 8.65129 13.743 8.19712C14.1971 7.76112 14.4697 7.14345 14.4697 6.45311C14.4697 5.78094 14.1971 5.16327 13.743 4.7091C13.307 4.25493 12.6893 3.98243 11.9989 3.98243Z",
				fill: "currentColor"
			}), /* @__PURE__ */ N("path", {
				d: "M17.7397 11.9395L19.3384 14.1195C19.4292 14.2285 19.4111 14.3738 19.2657 14.4647C17.9214 15.5729 16.359 16.2995 14.724 16.681L18.1031 22.6397C18.1939 22.8214 18.0849 23.0212 17.8851 23.0212H14.5787C14.4697 23.0212 14.3789 22.9486 14.3425 22.8577L11.9808 17.5894L9.61914 22.8577C9.5828 22.9667 9.49197 23.0212 9.38297 23.0212H6.0766C5.89493 23.0212 5.76776 22.8032 5.8586 22.6397L9.23763 16.681C7.60262 16.2995 6.04027 15.5547 4.69592 14.4647C4.60508 14.3738 4.58692 14.2285 4.65959 14.1195L6.25827 11.9395C6.3491 11.8305 6.53077 11.8123 6.63977 11.9032C8.14762 13.193 10.0006 14.0287 11.999 14.0287C13.9973 14.0287 15.8504 13.193 17.3582 11.9032C17.4672 11.7942 17.6489 11.8123 17.7397 11.9395Z",
				fill: "currentColor"
			})] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("path", {
				fillRule: "evenodd",
				clipRule: "evenodd",
				d: "M15.8503 10.3226C14.8693 11.3036 13.5068 11.9213 11.9989 11.9213C10.5093 11.9213 9.12859 11.3036 8.14758 10.3226C7.16657 9.34163 6.5489 7.97912 6.5489 6.47128C6.5489 4.96343 7.16657 3.60092 8.14758 2.61992C9.12859 1.63891 10.4911 1.02124 11.9989 1.02124C13.5068 1.02124 14.8693 1.63891 15.8503 2.61992C16.8313 3.60092 17.449 4.96343 17.449 6.47128C17.449 7.97912 16.8313 9.34163 15.8503 10.3226ZM11.9989 3.98243C11.3268 3.98243 10.7091 4.25493 10.2549 4.7091C9.81892 5.16327 9.52825 5.78094 9.52825 6.45311C9.52825 7.12528 9.80075 7.74295 10.2549 8.19712C10.6909 8.65129 11.3086 8.92379 11.9989 8.92379C12.6711 8.92379 13.2888 8.65129 13.743 8.19712C14.1971 7.76112 14.4697 7.14345 14.4697 6.45311C14.4697 5.78094 14.1971 5.16327 13.743 4.7091C13.307 4.25493 12.6893 3.98243 11.9989 3.98243Z",
				fill: "#FF7700"
			}), /* @__PURE__ */ N("path", {
				d: "M17.7397 11.9395L19.3384 14.1195C19.4292 14.2285 19.4111 14.3738 19.2657 14.4647C17.9214 15.5729 16.359 16.2995 14.724 16.681L18.1031 22.6397C18.1939 22.8214 18.0849 23.0212 17.8851 23.0212H14.5787C14.4697 23.0212 14.3789 22.9486 14.3425 22.8577L11.9808 17.5894L9.61914 22.8577C9.5828 22.9667 9.49197 23.0212 9.38297 23.0212H6.0766C5.89493 23.0212 5.76776 22.8032 5.8586 22.6397L9.23763 16.681C7.60262 16.2995 6.04027 15.5547 4.69592 14.4647C4.60508 14.3738 4.58692 14.2285 4.65959 14.1195L6.25827 11.9395C6.3491 11.8305 6.53077 11.8123 6.63977 11.9032C8.14762 13.193 10.0006 14.0287 11.999 14.0287C13.9973 14.0287 15.8504 13.193 17.3582 11.9032C17.4672 11.7942 17.6489 11.8123 17.7397 11.9395Z",
				fill: "#FF7700"
			})] })
		}
	},
	onlyfans: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("g", {
				clipPath: "url(#clip0_18168_41917)",
				children: /* @__PURE__ */ N("path", {
					fillRule: "evenodd",
					clipRule: "evenodd",
					d: "M21.4236 9.99481C21.4236 9.99481 19.0244 10.5822 16.9918 9.99481V9.99331C21.0119 9.21212 23.3285 6.94364 24 3.9751H19.9829C16.5312 3.9751 14.6757 4.16024 13.2278 5.92755C12.583 5.36865 11.8519 4.91566 11.0622 4.58803C10.0917 4.18391 9.0506 3.97659 8.0005 3.97659L7.99899 3.9781C4.76454 3.9781 1.84708 5.93259 0.60918 8.93118C-0.628715 11.9283 0.0548317 15.3806 2.34283 17.6746C4.59756 19.9367 7.97127 20.6363 10.9299 19.4672C11.0185 19.4323 11.1065 19.3957 11.1937 19.3576C13.0893 18.5305 14.5519 17.0196 15.3427 15.1848C18.5226 14.9513 20.7285 13.0424 21.4236 9.99481ZM10.3027 12.6854L10.2767 12.7686C10.2594 12.8205 10.2403 12.8719 10.2194 12.9228C10.0988 13.2146 9.9222 13.48 9.6996 13.704C9.47675 13.9274 9.21189 14.1046 8.92028 14.2253C8.62868 14.3459 8.31608 14.4077 8.0005 14.4071L8.002 14.4086C7.5268 14.4083 7.06238 14.267 6.66761 14.0025C6.27284 13.738 5.96552 13.3622 5.7846 12.9228C5.41203 12.0229 5.61785 10.9878 6.3044 10.2998C6.99095 9.61172 8.02303 9.40591 8.9199 9.77848C9.81678 10.151 10.4012 11.0284 10.4012 12.0019C10.4012 12.2335 10.368 12.4635 10.3027 12.6854Z",
					fill: "currentColor"
				})
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41917",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("path", {
				d: "M8.0005 3.97656C9.0506 3.97656 10.0917 4.18388 11.0622 4.588C12.0327 4.99062 12.9145 5.58252 13.6567 6.32766C14.3988 7.0728 14.9892 7.95766 15.3903 8.93115C15.7926 9.90489 15.9993 10.9483 15.9987 12.0019C15.9987 15.2468 14.0503 18.1733 11.0607 19.4142C8.07111 20.6566 4.63084 19.9701 2.34283 17.6745C0.0548316 15.3805 -0.628715 11.9282 0.60918 8.93115C1.84708 5.93256 4.76454 3.97806 7.99899 3.97806L8.0005 3.97656ZM8.0005 14.407C8.31608 14.4077 8.62868 14.3459 8.92028 14.2252C9.21189 14.1046 9.47675 13.9274 9.6996 13.704C9.9222 13.48 10.0988 13.2146 10.2194 12.9228C10.3396 12.6298 10.4012 12.3173 10.4012 12.0019C10.4012 11.0284 9.81678 10.151 8.9199 9.77845C8.02303 9.40588 6.99095 9.61169 6.3044 10.2997C5.61785 10.9878 5.41203 12.0229 5.7846 12.9228C5.96552 13.3622 6.27284 13.738 6.66761 14.0025C7.06238 14.267 7.5268 14.4083 8.002 14.4085L8.0005 14.407Z",
				fill: "#00AEEF"
			}), /* @__PURE__ */ N("path", {
				d: "M16.9917 9.99481C19.0243 10.5822 21.4235 9.99481 21.4235 9.99481C20.7279 13.0445 18.5196 14.9539 15.3362 15.1853C15.0297 15.9004 14.6196 16.5659 14.1208 17.1623C13.6221 17.7587 13.0392 18.2785 12.3917 18.7067C11.7427 19.1348 11.0366 19.4653 10.293 19.6877C9.54932 19.91 8.77714 20.0242 8.00195 20.0227L10.4011 12.3715C12.8679 4.50691 14.1328 3.9751 19.9828 3.9751H23.9999C23.3284 6.94364 21.0119 9.21212 16.9917 9.99331V9.99481Z",
				fill: "#008CCF"
			})] })
		}
	},
	patreon: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("g", {
				clipPath: "url(#clip0_18168_41895)",
				children: /* @__PURE__ */ N("path", {
					d: "M22.9569 7.21006C22.9527 4.14562 20.566 1.63406 17.7658 0.727837C14.2884 -0.397497 9.70222 -0.234385 6.38178 1.33228C2.35734 3.23139 1.09311 7.39139 1.046 11.5403C1.00733 14.9514 1.34778 23.9356 6.41533 23.9996C10.1807 24.0474 10.7413 19.1956 12.4836 16.8589C13.7231 15.1965 15.3191 14.7269 17.2838 14.2407C20.6604 13.4049 22.9618 10.7401 22.9569 7.21006Z",
					fill: "currentColor"
				})
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41895",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ N(M, { children: /* @__PURE__ */ N("path", {
				d: "M22.9569 7.21006C22.9527 4.14562 20.566 1.63406 17.7658 0.727837C14.2884 -0.397497 9.70222 -0.234385 6.38178 1.33228C2.35734 3.23139 1.09311 7.39139 1.046 11.5403C1.00733 14.9514 1.34778 23.9356 6.41533 23.9996C10.1807 24.0474 10.7413 19.1956 12.4836 16.8589C13.7231 15.1965 15.3191 14.7269 17.2838 14.2407C20.6604 13.4049 22.9618 10.7401 22.9569 7.21006Z",
				fill: "black"
			}) })
		}
	},
	paypal: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("g", {
				clipPath: "url(#clip0_18168_41955)",
				children: /* @__PURE__ */ N("path", {
					d: "M7.07579 21.337H2.46979C2.37727 21.337 2.28585 21.3169 2.20182 21.2782C2.11779 21.2394 2.04314 21.183 1.983 21.1127C1.92286 21.0424 1.87865 20.9599 1.85341 20.8708C1.82817 20.7818 1.8225 20.6884 1.83679 20.597L4.94379 0.901C5.02579 0.382 5.47379 0 5.99779 0H13.4578C16.0278 0 18.0358 0.543 19.1478 1.81C20.1578 2.96 20.4518 4.23 20.1598 6.097C20.1368 6.24 20.1128 6.385 20.0828 6.534C19.0998 11.584 15.7338 13.331 11.4358 13.331H9.24579C8.72179 13.331 8.27779 13.713 8.19579 14.231L7.07579 21.337ZM21.2218 6.917C21.0422 6.71269 20.8383 6.53102 20.6148 6.376C20.6018 6.452 20.5888 6.551 20.5738 6.63C19.6438 11.408 16.5688 13.831 11.4358 13.831H9.24579C9.11115 13.8312 8.98103 13.8796 8.87902 13.9675C8.77702 14.0553 8.70988 14.1769 8.68979 14.31L7.50279 21.837H6.99679L6.75679 23.353C6.74421 23.433 6.74913 23.5147 6.7712 23.5926C6.79327 23.6705 6.83196 23.7427 6.88462 23.8042C6.93728 23.8657 7.00265 23.9151 7.07623 23.9489C7.1498 23.9827 7.22983 24.0001 7.31079 24H11.1928C11.6528 24 12.0428 23.666 12.1148 23.212C12.1748 22.952 12.8748 18.36 12.9308 18.122C12.9652 17.9021 13.0772 17.7017 13.2465 17.5572C13.4158 17.4126 13.6312 17.3335 13.8538 17.334H14.4338C18.1938 17.334 21.1388 15.806 21.9988 11.388C22.3588 9.541 22.1728 8 21.2218 6.917Z",
					fill: "black"
				})
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41955",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("path", {
				fillRule: "evenodd",
				clipRule: "evenodd",
				d: "M10.5382 5.6792H17.2756C20.893 5.6792 22.2547 7.5105 22.0443 10.2009C21.6964 14.6427 19.0112 17.1001 15.4495 17.1001H13.6512C13.1625 17.1001 12.8338 17.4235 12.7017 18.3001L11.9382 23.3957C11.8877 23.7262 11.7138 23.9175 11.453 23.9436H7.21992C6.82166 23.9436 6.68079 23.6392 6.78514 22.9801L9.36601 6.64442C9.46688 5.99051 9.82514 5.6792 10.5382 5.6792Z",
				fill: "#009EE3"
			}), /* @__PURE__ */ N("path", {
				fillRule: "evenodd",
				clipRule: "evenodd",
				d: "M6.32433 0.0566406H13.0687C14.9678 0.0566406 17.2217 0.11751 18.7278 1.44794C19.7348 2.33664 20.2635 3.75055 20.1417 5.27403C19.7278 10.4236 16.6478 13.3088 12.5156 13.3088H9.19042C8.62346 13.3088 8.24955 13.6845 8.08955 14.7001L7.16085 20.6132C7.09998 20.9958 6.93477 21.2219 6.63911 21.2497H2.47738C2.01651 21.2497 1.85303 20.9019 1.97303 20.1332L4.96433 1.18012C5.08433 0.418378 5.50346 0.0566406 6.32433 0.0566406Z",
				fill: "#113984"
			})] })
		}
	},
	pinterest: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("g", {
				clipPath: "url(#clip0_18168_41885)",
				children: /* @__PURE__ */ N("path", {
					d: "M12 0C5.37284 0 0 5.37284 0 12C0 17.0864 3.16049 21.4321 7.62469 23.1802C7.51605 22.2321 7.42716 20.7704 7.6642 19.7333C7.88148 18.7951 9.06667 13.7679 9.06667 13.7679C9.06667 13.7679 8.71111 13.0469 8.71111 11.9901C8.71111 10.321 9.67901 9.07654 10.884 9.07654C11.9111 9.07654 12.4049 9.84691 12.4049 10.7654C12.4049 11.7926 11.7531 13.3333 11.4074 14.7654C11.121 15.9605 12.0099 16.9383 13.1852 16.9383C15.3185 16.9383 16.958 14.6864 16.958 11.4469C16.958 8.57284 14.8938 6.5679 11.9407 6.5679C8.52346 6.5679 6.51852 9.12593 6.51852 11.7728C6.51852 12.8 6.91358 13.9062 7.40741 14.5086C7.50617 14.6272 7.51605 14.7358 7.48642 14.8543C7.39753 15.2296 7.19012 16.0494 7.15062 16.2173C7.10123 16.4346 6.97284 16.484 6.74568 16.3753C5.24444 15.6741 4.30617 13.4914 4.30617 11.7235C4.30617 7.94074 7.05185 4.4642 12.237 4.4642C16.3951 4.4642 19.6346 7.42716 19.6346 11.3975C19.6346 15.5358 17.0272 18.8642 13.4123 18.8642C12.1975 18.8642 11.0519 18.2321 10.6667 17.4815C10.6667 17.4815 10.0642 19.7728 9.91605 20.3358C9.64938 21.3827 8.91852 22.6864 8.42469 23.4864C9.55062 23.8321 10.7358 24.0198 11.9802 24.0198C18.6074 24.0198 23.9802 18.6469 23.9802 12.0198C24 5.37284 18.6272 0 12 0Z",
					fill: "currentColor"
				})
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41885",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ P("g", {
				clipPath: "url(#clip0_18168_41695)",
				children: [/* @__PURE__ */ N("path", {
					d: "M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z",
					fill: "white"
				}), /* @__PURE__ */ N("path", {
					d: "M12 0C5.37284 0 0 5.37284 0 12C0 17.0864 3.16049 21.4321 7.62469 23.1802C7.51605 22.2321 7.42716 20.7704 7.6642 19.7333C7.88148 18.7951 9.06667 13.7679 9.06667 13.7679C9.06667 13.7679 8.71111 13.0469 8.71111 11.9901C8.71111 10.321 9.67901 9.07654 10.884 9.07654C11.9111 9.07654 12.4049 9.84691 12.4049 10.7654C12.4049 11.7926 11.7531 13.3333 11.4074 14.7654C11.121 15.9605 12.0099 16.9383 13.1852 16.9383C15.3185 16.9383 16.958 14.6864 16.958 11.4469C16.958 8.57284 14.8938 6.5679 11.9407 6.5679C8.52346 6.5679 6.51852 9.12593 6.51852 11.7728C6.51852 12.8 6.91358 13.9062 7.40741 14.5086C7.50617 14.6272 7.51605 14.7358 7.48642 14.8543C7.39753 15.2296 7.19012 16.0494 7.15062 16.2173C7.10123 16.4346 6.97284 16.484 6.74568 16.3753C5.24444 15.6741 4.30617 13.4914 4.30617 11.7235C4.30617 7.94074 7.05185 4.4642 12.237 4.4642C16.3951 4.4642 19.6346 7.42716 19.6346 11.3975C19.6346 15.5358 17.0272 18.8642 13.4123 18.8642C12.1975 18.8642 11.0519 18.2321 10.6667 17.4815C10.6667 17.4815 10.0642 19.7728 9.91605 20.3358C9.64938 21.3827 8.91852 22.6864 8.42469 23.4864C9.55062 23.8321 10.7358 24.0198 11.9802 24.0198C18.6074 24.0198 23.9802 18.6469 23.9802 12.0198C24 5.37284 18.6272 0 12 0Z",
					fill: "#E60019"
				})]
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41695",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		}
	},
	"product-hunt": {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("path", {
				d: "M10.2 12H13.5997C13.8361 12 14.0702 11.9534 14.2886 11.863C14.5069 11.7725 14.7054 11.6399 14.8725 11.4728C15.0397 11.3056 15.1723 11.1072 15.2627 10.8888C15.3532 10.6704 15.3997 10.4364 15.3997 10.2C15.3997 9.96362 15.3532 9.72956 15.2627 9.51117C15.1723 9.29278 15.0397 9.09435 14.8725 8.92721C14.7054 8.76006 14.5069 8.62748 14.2886 8.53702C14.0702 8.44656 13.8361 8.4 13.5997 8.4H10.2V12Z",
				fill: "currentColor"
			}), /* @__PURE__ */ N("path", {
				fillRule: "evenodd",
				clipRule: "evenodd",
				d: "M12 24C18.6271 24 24 18.6271 24 12C24 5.3725 18.6271 0 12 0C5.3725 0 0 5.37209 0 12C0 18.6271 5.37209 24 12 24ZM7.8 6H13.5997C15.9193 6 17.7997 7.88044 17.7997 10.2C17.7997 12.5196 15.9193 14.4 13.5997 14.4H10.2V18H7.8V6Z",
				fill: "currentColor"
			})] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("path", {
				d: "M24 12C24 18.6271 18.6271 24 12 24C5.37209 24 0 18.6271 0 12C0 5.37209 5.3725 0 12 0C18.6271 0 24 5.3725 24 12Z",
				fill: "#DA552F"
			}), /* @__PURE__ */ N("path", {
				d: "M13.5995 12H10.1998V8.4H13.5995C13.8359 8.4 14.07 8.44656 14.2884 8.53702C14.5067 8.62748 14.7052 8.76006 14.8723 8.92721C15.0395 9.09435 15.1721 9.29278 15.2625 9.51117C15.353 9.72956 15.3995 9.96362 15.3995 10.2C15.3995 10.4364 15.353 10.6704 15.2625 10.8888C15.1721 11.1072 15.0395 11.3056 14.8723 11.4728C14.7052 11.6399 14.5067 11.7725 14.2884 11.863C14.07 11.9534 13.8359 12 13.5995 12ZM13.5995 6H7.7998V18H10.1998V14.4H13.5995C15.9191 14.4 17.7995 12.5196 17.7995 10.2C17.7995 7.88044 15.9191 6 13.5995 6Z",
				fill: "white"
			})] })
		}
	},
	qiita: { brand: {
		viewBox: "0 0 40 40",
		body: /* @__PURE__ */ P(M, { children: [
			/* @__PURE__ */ N("path", {
				d: "M19.9999 40C-6.66889 39.5287 -6.66465 0.467469 20.0008 0C46.6687 0.471303 46.6644 39.5325 19.9999 40Z",
				fill: "#A1B1B3"
			}),
			/* @__PURE__ */ N("path", {
				d: "M17.1832 18.0598C17.5972 18.0598 17.9328 17.7242 17.9328 17.3102C17.9328 16.8962 17.5972 16.5605 17.1832 16.5605C16.7692 16.5605 16.4336 16.8962 16.4336 17.3102C16.4336 17.7242 16.7692 18.0598 17.1832 18.0598Z",
				fill: "white"
			}),
			/* @__PURE__ */ N("path", {
				d: "M24.3458 16.2083H23.1147V17.8172H22.2859V18.969H23.1147V21.2849C23.1147 21.742 23.1696 22.1138 23.2854 22.4002C23.384 22.6625 23.5451 22.8968 23.7547 23.0828C23.9582 23.2501 24.1983 23.367 24.4555 23.4241C24.7001 23.4892 24.9521 23.522 25.2051 23.5216H26.1315V22.4246H25.3331C25.2031 22.4252 25.0738 22.4067 24.9492 22.3698C24.8312 22.3332 24.723 22.2707 24.6323 22.1869C24.5352 22.0892 24.4622 21.9703 24.419 21.8395C24.3601 21.6566 24.3333 21.4648 24.3397 21.2728V18.969H26.1437V17.8172H24.3458V16.2083Z",
				fill: "white"
			}),
			/* @__PURE__ */ N("path", {
				d: "M14.8011 19.7665C14.8037 19.259 14.6999 18.7565 14.4964 18.2916C14.2948 17.8434 14.0093 17.438 13.6553 17.0971C13.2991 16.7527 12.8788 16.4814 12.4181 16.2987C11.7037 16.0066 10.9202 15.9266 10.1615 16.0682C9.40272 16.2097 8.70084 16.567 8.13983 17.0971C7.78965 17.4385 7.50827 17.8441 7.31098 18.2916C7.10592 18.7552 7 19.2565 7 19.7634C7 20.2703 7.10592 20.7716 7.31098 21.2352C7.50665 21.6837 7.78823 22.0895 8.13983 22.4297C8.49927 22.7732 8.91858 23.0479 9.37701 23.2403C9.86068 23.4371 10.3784 23.5366 10.9006 23.5328C11.2628 23.5333 11.6234 23.4861 11.9732 23.3927C12.3085 23.2984 12.6301 23.1611 12.9301 22.9843L13.6858 23.7462C13.8038 23.8641 13.9638 23.9304 14.1307 23.9304C14.2976 23.9304 14.4576 23.8641 14.5756 23.7462C14.6936 23.6282 14.7599 23.4681 14.7599 23.3013C14.7599 23.1344 14.6936 22.9744 14.5756 22.8564L13.8991 22.1799C14.179 21.8507 14.4034 21.4781 14.5634 21.0768C14.723 20.6585 14.8036 20.2142 14.8011 19.7665ZM13.2836 20.8086C13.0233 21.4303 12.5316 21.9264 11.9123 22.1921C11.5922 22.3271 11.248 22.3955 10.9006 22.3932C10.5618 22.3954 10.226 22.3296 9.91298 22.1998C9.6 22.07 9.3162 21.8788 9.07838 21.6375C8.84181 21.3995 8.65348 21.1181 8.52378 20.8086C8.25538 20.144 8.25538 19.4011 8.52378 18.7365C8.65196 18.4244 8.84042 18.1407 9.07838 17.9016C9.3162 17.6602 9.6 17.469 9.91298 17.3392C10.226 17.2094 10.5618 17.1436 10.9006 17.1458C11.248 17.1435 11.5922 17.212 11.9123 17.347C12.2185 17.4761 12.496 17.6646 12.729 17.9016C12.9689 18.1391 13.1576 18.4233 13.2836 18.7365C13.552 19.4011 13.552 20.144 13.2836 20.8086Z",
				fill: "white"
			}),
			/* @__PURE__ */ N("path", {
				d: "M31.9396 18.1397L31.8726 18.7187C31.7649 18.6138 31.6487 18.5179 31.5252 18.4322C31.3877 18.343 31.243 18.2655 31.0925 18.2006C30.9315 18.1315 30.7641 18.0784 30.5927 18.0422C30.4085 18.0025 30.2206 17.9821 30.0321 17.9812C29.6392 17.9757 29.2493 18.0504 28.8863 18.2006C28.5535 18.3396 28.2511 18.5425 27.9965 18.7979C27.7499 19.0512 27.5571 19.3518 27.4297 19.6816C27.1614 20.3757 27.1614 21.1449 27.4297 21.839C27.563 22.1672 27.7574 22.4671 28.0026 22.7227C28.2541 22.9776 28.5547 23.1787 28.8863 23.3139C29.2476 23.4621 29.6355 23.5347 30.026 23.5272C30.2142 23.528 30.4021 23.5096 30.5866 23.4724C30.758 23.4361 30.9254 23.3831 31.0864 23.3139C31.3768 23.1886 31.6429 23.0133 31.8726 22.7959L31.9396 23.3748H33.0001V18.1397H31.9396ZM31.6897 21.449C31.5227 21.8518 31.2027 22.1718 30.8 22.3388C30.5929 22.4225 30.3712 22.4639 30.1478 22.4607C29.9226 22.4639 29.6988 22.4225 29.4896 22.3388C29.0849 22.1694 28.7631 21.8476 28.5938 21.4429C28.4589 21.1243 28.4206 20.7732 28.4834 20.433C28.5462 20.0929 28.7075 19.7786 28.9472 19.5292C29.1024 19.3805 29.2844 19.2626 29.4836 19.1819C29.6901 19.0956 29.9119 19.0521 30.1357 19.0539C30.3614 19.0521 30.5852 19.0956 30.7939 19.1819C30.9919 19.2641 31.172 19.3842 31.3241 19.5353C31.4798 19.6886 31.604 19.8708 31.6897 20.0716C31.7771 20.2885 31.8206 20.5205 31.8177 20.7542C31.8211 20.992 31.7776 21.2281 31.6897 21.449Z",
				fill: "white"
			}),
			/* @__PURE__ */ N("path", {
				d: "M17.7868 18.895H16.5801V23.3769H17.7868V18.895Z",
				fill: "white"
			}),
			/* @__PURE__ */ N("path", {
				d: "M20.7919 18.895H19.5852V23.3769H20.7919V18.895Z",
				fill: "white"
			}),
			/* @__PURE__ */ N("path", {
				d: "M20.3569 18.0361C20.7598 17.9408 21.0092 17.537 20.9139 17.1341C20.8187 16.7312 20.4149 16.4818 20.012 16.5771C19.6091 16.6723 19.3597 17.0761 19.4549 17.479C19.5502 17.8819 19.954 18.1313 20.3569 18.0361Z",
				fill: "white"
			})
		] })
	} },
	quora: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ N(M, { children: /* @__PURE__ */ N("path", {
				d: "M13.1135 18.7647C12.3649 17.2985 11.4868 15.8175 9.77387 15.8175C9.44643 15.8175 9.11938 15.8715 8.81926 16.0079L8.23736 14.8489C8.94649 14.2434 10.0923 13.7633 11.5652 13.7633C13.8565 13.7633 15.0324 14.8617 15.966 16.2638C16.5202 15.0668 16.7836 13.4503 16.7836 11.4465C16.7836 6.44285 15.2112 3.87362 11.5383 3.87362C7.9189 3.87362 6.35507 6.44285 6.35507 11.4465C6.35507 16.4238 7.9189 18.9667 11.5383 18.9667C12.1136 18.9667 12.6346 18.9037 13.1135 18.7647ZM14.0107 20.5109C13.2044 20.7267 12.3733 20.8372 11.5383 20.8395C6.71881 20.8395 2 17.0122 2 11.4465C2 5.82802 6.71881 2 11.5383 2C16.4386 2 21.1121 5.80045 21.1121 11.4465C21.1121 14.5871 19.6396 17.1393 17.4994 18.7888C18.1909 19.82 18.9028 20.5047 19.8941 20.5047C20.9759 20.5047 21.4122 19.6728 21.4852 19.0203H22.8941C22.9765 19.8891 22.5397 23.5 18.6023 23.5C16.2173 23.5 14.9563 22.1243 14.0107 20.5109Z",
				fill: "currentColor"
			}) })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ N(M, { children: /* @__PURE__ */ N("path", {
				d: "M13.1135 18.7647C12.3649 17.2985 11.4868 15.8175 9.77387 15.8175C9.44643 15.8175 9.11938 15.8715 8.81926 16.0079L8.23736 14.8489C8.94649 14.2434 10.0923 13.7633 11.5652 13.7633C13.8565 13.7633 15.0324 14.8617 15.966 16.2638C16.5202 15.0668 16.7836 13.4503 16.7836 11.4465C16.7836 6.44285 15.2112 3.87362 11.5383 3.87362C7.9189 3.87362 6.35507 6.44285 6.35507 11.4465C6.35507 16.4238 7.9189 18.9667 11.5383 18.9667C12.1136 18.9667 12.6346 18.9037 13.1135 18.7647ZM14.0107 20.5109C13.2044 20.7267 12.3733 20.8372 11.5383 20.8395C6.71881 20.8395 2 17.0122 2 11.4465C2 5.82802 6.71881 2 11.5383 2C16.4386 2 21.1121 5.80045 21.1121 11.4465C21.1121 14.5871 19.6396 17.1393 17.4994 18.7888C18.1909 19.82 18.9028 20.5047 19.8941 20.5047C20.9759 20.5047 21.4122 19.6728 21.4852 19.0203H22.8941C22.9765 19.8891 22.5397 23.5 18.6023 23.5C16.2173 23.5 14.9563 22.1243 14.0107 20.5109Z",
				fill: "#B92B27"
			}) })
		}
	},
	reddit: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ P("g", {
				clipPath: "url(#clip0_18168_41905)",
				children: [
					/* @__PURE__ */ N("path", {
						d: "M8.30347 11.5753C7.51878 11.5753 6.84378 12.3553 6.79691 13.3715C6.75003 14.3878 7.43722 14.8012 8.22285 14.8012C9.00847 14.8012 9.59441 14.4319 9.64128 13.4156C9.68816 12.3994 9.08816 11.5753 8.30347 11.5753Z",
						fill: "currentColor"
					}),
					/* @__PURE__ */ N("path", {
						d: "M17.2153 13.3715C17.1694 12.3553 16.4944 11.5753 15.7088 11.5753C14.9232 11.5753 14.3241 12.3994 14.371 13.4156C14.4178 14.4328 15.0047 14.8012 15.7894 14.8012C16.5741 14.8012 17.2622 14.3878 17.2153 13.3715Z",
						fill: "currentColor"
					}),
					/* @__PURE__ */ N("path", {
						d: "M14.9588 16.0275C15.016 15.8906 14.9222 15.7378 14.775 15.7228C13.9116 15.6356 12.9797 15.5878 12.0057 15.5878C11.0316 15.5878 10.0988 15.6356 9.23628 15.7228C9.0891 15.7378 8.99535 15.8906 9.05253 16.0275C9.53628 17.1815 10.6753 17.9925 12.0057 17.9925C13.336 17.9925 14.476 17.1815 14.9588 16.0275Z",
						fill: "currentColor"
					}),
					/* @__PURE__ */ N("path", {
						fillRule: "evenodd",
						clipRule: "evenodd",
						d: "M0 12C0 5.37281 5.37281 0 12 0C18.6272 0 24 5.37281 24 12C24 18.6272 18.6272 24 12 24H1.73813C1.09688 24 0.775312 23.2247 1.22906 22.7709L3.51469 20.4853C1.34344 18.3141 0 15.3141 0 12ZM16.3875 7.19811C15.4416 7.19811 14.6494 6.54092 14.4413 5.65873V5.66061C13.2938 5.82279 12.4088 6.81092 12.4088 8.00154V8.00904C14.1853 8.07561 15.8091 8.57623 17.0953 9.37217C17.5678 9.00842 18.1594 8.79186 18.8016 8.79186C20.3494 8.79186 21.6038 10.0462 21.6038 11.594C21.6038 12.7106 20.9494 13.6753 20.0035 14.1253C19.9153 17.3812 16.366 20.0006 12.0057 20.0006C7.64535 20.0006 4.10066 17.384 4.00785 14.1309C3.05441 13.6837 2.39441 12.7162 2.39441 11.5931C2.39441 10.0453 3.64878 8.79092 5.1966 8.79092C5.8416 8.79092 6.43597 9.00936 6.90941 9.37592C8.18441 8.58561 9.79035 8.08498 11.5491 8.01092V8.00061C11.5491 6.33842 12.8119 4.96686 14.4291 4.79342C14.6166 3.88311 15.4219 3.19873 16.3875 3.19873C17.4919 3.19873 18.3872 4.09404 18.3872 5.19842C18.3872 6.30279 17.4919 7.19811 16.3875 7.19811Z",
						fill: "currentColor"
					})
				]
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41905",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ P("g", {
				clipPath: "url(#clip0_18168_41723)",
				children: [/* @__PURE__ */ N("path", {
					d: "M12 0C5.37281 0 0 5.37281 0 12C0 15.3141 1.34344 18.3141 3.51469 20.4853L1.22906 22.7709C0.775312 23.2247 1.09688 24 1.73813 24H12C18.6272 24 24 18.6272 24 12C24 5.37281 18.6272 0 12 0Z",
					fill: "#FF4500"
				}), /* @__PURE__ */ N("path", {
					d: "M14.4414 5.65873C14.6495 6.54092 15.4417 7.19811 16.3877 7.19811C17.492 7.19811 18.3873 6.30279 18.3873 5.19842C18.3873 4.09404 17.492 3.19873 16.3877 3.19873C15.422 3.19873 14.6167 3.88311 14.4292 4.79342C12.812 4.96686 11.5492 6.33842 11.5492 8.00061C11.5492 8.00436 11.5492 8.00717 11.5492 8.01092C9.79047 8.08498 8.18453 8.58561 6.90953 9.37592C6.43609 9.00936 5.84172 8.79092 5.19672 8.79092C3.64891 8.79092 2.39453 10.0453 2.39453 11.5931C2.39453 12.7162 3.05453 13.6837 4.00797 14.1309C4.10078 17.384 7.64547 20.0006 12.0058 20.0006C16.3661 20.0006 19.9155 17.3812 20.0036 14.1253C20.9495 13.6753 21.6039 12.7106 21.6039 11.594C21.6039 10.0462 20.3495 8.79186 18.8017 8.79186C18.1595 8.79186 17.568 9.00842 17.0955 9.37217C15.8092 8.57623 14.1855 8.07561 12.4089 8.00904C12.4089 8.00623 12.4089 8.00436 12.4089 8.00154C12.4089 6.81092 13.2939 5.82279 14.4414 5.66061V5.65873ZM6.79703 13.3715C6.84391 12.3553 7.51891 11.5753 8.30359 11.5753C9.08828 11.5753 9.68828 12.3994 9.64141 13.4156C9.59453 14.4319 9.00859 14.8012 8.22297 14.8012C7.43734 14.8012 6.75016 14.3878 6.79703 13.3715ZM15.7089 11.5753C16.4945 11.5753 17.1695 12.3553 17.2155 13.3715C17.2623 14.3878 16.5742 14.8012 15.7895 14.8012C15.0048 14.8012 14.418 14.4328 14.3711 13.4156C14.3242 12.3994 14.9233 11.5753 15.7089 11.5753ZM14.7752 15.7228C14.9223 15.7378 15.0161 15.8906 14.9589 16.0275C14.4761 17.1815 13.3361 17.9925 12.0058 17.9925C10.6755 17.9925 9.53641 17.1815 9.05266 16.0275C8.99547 15.8906 9.08922 15.7378 9.23641 15.7228C10.0989 15.6356 11.0317 15.5878 12.0058 15.5878C12.9798 15.5878 13.9117 15.6356 14.7752 15.7228Z",
					fill: "white"
				})]
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41723",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		}
	},
	signal: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ N(M, { children: /* @__PURE__ */ N("path", {
				d: "M9.11911 0.350322L9.38845 1.44131C8.32691 1.70367 7.31091 2.12432 6.3746 2.68912L5.79842 1.72428C6.82904 1.10015 7.94881 0.63684 9.11911 0.350322ZM14.8809 0.350322L14.6115 1.44131C15.6731 1.70367 16.6891 2.12432 17.6254 2.68912L18.2084 1.72428C17.1751 1.1007 16.0531 0.637446 14.8809 0.350322ZM1.72427 5.79503C1.10072 6.82716 0.637457 7.94795 0.350307 9.11913L1.44129 9.38846C1.70365 8.32693 2.1243 7.31093 2.68911 6.37461L1.72427 5.79503ZM1.12423 12C1.12414 11.4545 1.16517 10.9097 1.24696 10.3704L0.135519 10.1999C-0.0451731 11.392 -0.0451731 12.6046 0.135519 13.7967L1.24696 13.6297C1.1653 13.0903 1.12427 12.5455 1.12423 12ZM18.2016 22.2723L17.6254 21.3109C16.6906 21.8762 15.6756 22.2969 14.615 22.5587L14.8843 23.6497C16.0532 23.3604 17.1716 22.8961 18.2016 22.2723ZM22.8758 12C22.8757 12.5455 22.8347 13.0903 22.753 13.6297L23.8645 13.7967C24.0452 12.6046 24.0452 11.392 23.8645 10.1999L22.753 10.3704C22.8348 10.9097 22.8759 11.4545 22.8758 12ZM23.6497 14.8775L22.5587 14.6082C22.297 15.671 21.8763 16.6882 21.3109 17.6254L22.2757 18.205C22.8999 17.172 23.3632 16.0499 23.6497 14.8775ZM13.6297 22.7531C12.5494 22.9167 11.4506 22.9167 10.3703 22.7531L10.2033 23.8645C11.3943 24.0452 12.6057 24.0452 13.7967 23.8645L13.6297 22.7531ZM20.7552 18.4505C20.1072 19.3292 19.3302 20.1051 18.4505 20.7518L19.1187 21.6587C20.0876 20.9454 20.9449 20.0916 21.6621 19.1255L20.7552 18.4505ZM18.4505 3.24485C19.3302 3.89279 20.1072 4.66977 20.7552 5.54955L21.6621 4.87451C20.9474 3.90756 20.0925 3.05263 19.1255 2.33796L18.4505 3.24485ZM3.24483 5.54955C3.89278 4.66977 4.66976 3.89279 5.54954 3.24485L4.87449 2.33796C3.90754 3.05263 3.05262 3.90756 2.33795 4.87451L3.24483 5.54955ZM22.2757 5.79503L21.3109 6.37461C21.8762 7.30945 22.2969 8.3244 22.5587 9.38506L23.6497 9.11572C23.3625 7.94563 22.8992 6.82595 22.2757 5.79503ZM10.3703 1.24698C11.4506 1.08331 12.5494 1.08331 13.6297 1.24698L13.7967 0.135534C12.6057 -0.0451779 11.3943 -0.0451779 10.2033 0.135534L10.3703 1.24698ZM3.82101 21.9587L1.49925 22.4974L2.04134 20.1756L0.946941 19.9199L0.404856 22.2417C0.370939 22.3856 0.365734 22.5348 0.389539 22.6808C0.413344 22.8267 0.465692 22.9666 0.543588 23.0923C0.621485 23.218 0.723402 23.3271 0.843508 23.4134C0.963615 23.4997 1.09956 23.5615 1.24355 23.5952C1.41196 23.6327 1.58655 23.6327 1.75495 23.5952L4.07671 23.0599L3.82101 21.9587ZM1.17878 18.9176L2.27658 19.1698L2.65161 17.5606C2.10394 16.642 1.69604 15.6469 1.44129 14.6082L0.350307 14.8775C0.595705 15.8718 0.966907 16.8307 1.45493 17.7311L1.17878 18.9176ZM6.42915 21.3518L4.81994 21.7268L5.07564 22.8246L6.25868 22.5485C7.15838 23.038 8.11751 23.4093 9.11229 23.6531L9.38163 22.5621C8.34612 22.3041 7.35459 21.8939 6.43938 21.345L6.42915 21.3518ZM12 2.24932C6.61325 2.25273 2.25272 6.62009 2.25272 12.0034C2.25568 13.837 2.77433 15.6328 3.74941 17.1856L2.81185 21.1882L6.81099 20.2506C11.3693 23.1178 17.3902 21.7507 20.2574 17.1958C23.1247 12.641 21.7609 6.62009 17.2061 3.74943C15.6467 2.76884 13.842 2.24882 12 2.24932Z",
				fill: "currentColor"
			}) })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ N(M, { children: /* @__PURE__ */ N("path", {
				d: "M9.11911 0.350322L9.38845 1.44131C8.32691 1.70367 7.31091 2.12432 6.3746 2.68912L5.79842 1.72428C6.82904 1.10015 7.94881 0.63684 9.11911 0.350322ZM14.8809 0.350322L14.6115 1.44131C15.6731 1.70367 16.6891 2.12432 17.6254 2.68912L18.2084 1.72428C17.1751 1.1007 16.0531 0.637446 14.8809 0.350322ZM1.72427 5.79503C1.10072 6.82716 0.637457 7.94795 0.350307 9.11913L1.44129 9.38846C1.70365 8.32693 2.1243 7.31093 2.68911 6.37461L1.72427 5.79503ZM1.12423 12C1.12414 11.4545 1.16517 10.9097 1.24696 10.3704L0.135519 10.1999C-0.0451731 11.392 -0.0451731 12.6046 0.135519 13.7967L1.24696 13.6297C1.1653 13.0903 1.12427 12.5455 1.12423 12ZM18.2016 22.2723L17.6254 21.3109C16.6906 21.8762 15.6756 22.2969 14.615 22.5587L14.8843 23.6497C16.0532 23.3604 17.1716 22.8961 18.2016 22.2723ZM22.8758 12C22.8757 12.5455 22.8347 13.0903 22.753 13.6297L23.8645 13.7967C24.0452 12.6046 24.0452 11.392 23.8645 10.1999L22.753 10.3704C22.8348 10.9097 22.8759 11.4545 22.8758 12ZM23.6497 14.8775L22.5587 14.6082C22.297 15.671 21.8763 16.6882 21.3109 17.6254L22.2757 18.205C22.8999 17.172 23.3632 16.0499 23.6497 14.8775ZM13.6297 22.7531C12.5494 22.9167 11.4506 22.9167 10.3703 22.7531L10.2033 23.8645C11.3943 24.0452 12.6057 24.0452 13.7967 23.8645L13.6297 22.7531ZM20.7552 18.4505C20.1072 19.3292 19.3302 20.1051 18.4505 20.7518L19.1187 21.6587C20.0876 20.9454 20.9449 20.0916 21.6621 19.1255L20.7552 18.4505ZM18.4505 3.24485C19.3302 3.89279 20.1072 4.66977 20.7552 5.54955L21.6621 4.87451C20.9474 3.90756 20.0925 3.05263 19.1255 2.33796L18.4505 3.24485ZM3.24483 5.54955C3.89278 4.66977 4.66976 3.89279 5.54954 3.24485L4.87449 2.33796C3.90754 3.05263 3.05262 3.90756 2.33795 4.87451L3.24483 5.54955ZM22.2757 5.79503L21.3109 6.37461C21.8762 7.30945 22.2969 8.3244 22.5587 9.38506L23.6497 9.11572C23.3625 7.94563 22.8992 6.82595 22.2757 5.79503ZM10.3703 1.24698C11.4506 1.08331 12.5494 1.08331 13.6297 1.24698L13.7967 0.135534C12.6057 -0.0451779 11.3943 -0.0451779 10.2033 0.135534L10.3703 1.24698ZM3.82101 21.9587L1.49925 22.4974L2.04134 20.1756L0.946941 19.9199L0.404856 22.2417C0.370939 22.3856 0.365734 22.5348 0.389539 22.6808C0.413344 22.8267 0.465692 22.9666 0.543588 23.0923C0.621485 23.218 0.723402 23.3271 0.843508 23.4134C0.963615 23.4997 1.09956 23.5615 1.24355 23.5952C1.41196 23.6327 1.58655 23.6327 1.75495 23.5952L4.07671 23.0599L3.82101 21.9587ZM1.17878 18.9176L2.27658 19.1698L2.65161 17.5606C2.10394 16.642 1.69604 15.6469 1.44129 14.6082L0.350307 14.8775C0.595705 15.8718 0.966907 16.8307 1.45493 17.7311L1.17878 18.9176ZM6.42915 21.3518L4.81994 21.7268L5.07564 22.8246L6.25868 22.5485C7.15838 23.038 8.11751 23.4093 9.11229 23.6531L9.38163 22.5621C8.34612 22.3041 7.35459 21.8939 6.43938 21.345L6.42915 21.3518ZM12 2.24932C6.61325 2.25273 2.25272 6.62009 2.25272 12.0034C2.25568 13.837 2.77433 15.6328 3.74941 17.1856L2.81185 21.1882L6.81099 20.2506C11.3693 23.1178 17.3902 21.7507 20.2574 17.1958C23.1247 12.641 21.7609 6.62009 17.2061 3.74943C15.6467 2.76884 13.842 2.24882 12 2.24932Z",
				fill: "#3A76F0"
			}) })
		}
	},
	"sina-weibo": {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [
				/* @__PURE__ */ N("path", {
					d: "M16.3159 2.13935C18.462 1.68333 20.7871 2.34933 22.3632 4.09682C23.94 5.84241 24.3651 8.2224 23.6924 10.3101L23.692 10.3139C23.6168 10.5455 23.4527 10.7377 23.2358 10.8484C23.0189 10.9591 22.7669 10.9792 22.5352 10.9043C22.4203 10.8673 22.3138 10.808 22.2218 10.7298C22.1298 10.6516 22.0541 10.556 21.9991 10.4486C21.9441 10.3411 21.9109 10.2238 21.9013 10.1034C21.8917 9.98306 21.906 9.86199 21.9433 9.74715C22.1878 8.99259 22.2289 8.18664 22.0633 7.41095C21.8976 6.63526 21.5307 5.91686 20.9993 5.32799C19.8779 4.08725 18.2258 3.6124 16.6992 3.93663C16.5812 3.96183 16.4593 3.96355 16.3407 3.94168C16.222 3.9198 16.1088 3.87477 16.0075 3.80915C15.9063 3.74353 15.8189 3.6586 15.7505 3.55922C15.682 3.45984 15.6338 3.34795 15.6086 3.22994C15.5834 3.11193 15.5817 2.99011 15.6035 2.87143C15.6254 2.75276 15.6704 2.63955 15.7361 2.53828C15.8017 2.43701 15.8866 2.34966 15.986 2.28121C16.0854 2.21276 16.1979 2.16455 16.3159 2.13935Z",
					fill: "currentColor"
				}),
				/* @__PURE__ */ N("path", {
					fillRule: "evenodd",
					clipRule: "evenodd",
					d: "M5.63021 14.6967C6.4513 13.0305 8.58844 12.0882 10.4792 12.5803C12.4357 13.0861 13.4343 14.9319 12.6342 16.7247C11.8234 18.559 9.49123 19.5364 7.51237 18.8985C5.60276 18.2817 4.79379 16.3957 5.63021 14.6967ZM9.61441 15.5474C9.85503 15.6467 10.162 15.5324 10.3012 15.2944C10.4339 15.0554 10.3477 14.7863 10.1078 14.6986C9.87194 14.6051 9.57643 14.7184 9.43794 14.9507C9.30327 15.1843 9.37762 15.4498 9.61441 15.5474ZM7.20793 17.5183C7.82798 17.8014 8.65099 17.5327 9.03521 16.9197C9.41304 16.3002 9.21391 15.5928 8.59163 15.3272C7.97637 15.0694 7.18112 15.3349 6.80169 15.9301C6.41683 16.5278 6.59714 17.2404 7.20793 17.5183Z",
					fill: "currentColor"
				}),
				/* @__PURE__ */ N("path", {
					fillRule: "evenodd",
					clipRule: "evenodd",
					d: "M17.6361 10.7457C17.4593 11.1896 17.691 11.2588 18.029 11.3596C19.4056 11.7866 20.9377 12.819 20.9377 14.6383C20.9377 17.6488 16.5958 21.4413 10.0688 21.4413C5.08963 21.4413 0 19.0284 0 15.0595C0 12.9846 1.31445 10.5851 3.57828 8.321C6.60162 5.29894 10.1269 3.92226 11.4522 5.24883C12.0372 5.83314 12.094 6.84507 11.7181 8.05357C11.5323 8.63048 12.2121 8.35736 12.2833 8.32874C12.2872 8.32717 12.2893 8.32634 12.2893 8.32642C14.7328 7.30301 16.8645 7.24333 17.6435 8.3561C18.059 8.94966 18.0194 9.78128 17.6361 10.7457ZM2.42084 16.0067C2.67932 18.6155 6.1089 20.4108 10.0819 20.0189C14.0553 19.6258 17.0668 17.1928 16.8093 14.5837C16.5514 11.9762 13.1215 10.1802 9.14819 10.5733C5.17579 10.9662 2.16299 13.3985 2.42084 16.0067Z",
					fill: "currentColor"
				}),
				/* @__PURE__ */ N("path", {
					d: "M19.9424 6.28119C19.1752 5.4301 18.0427 5.10683 16.9969 5.32926C16.8929 5.34829 16.7937 5.38801 16.7053 5.44607C16.6168 5.50412 16.5409 5.57933 16.4821 5.66724C16.4232 5.75514 16.3826 5.85396 16.3627 5.95784C16.3427 6.06173 16.3438 6.16856 16.3658 6.27202C16.3879 6.37548 16.4305 6.47346 16.4911 6.56016C16.5517 6.64687 16.6291 6.72053 16.7187 6.77679C16.8082 6.83305 16.9082 6.87076 17.0126 6.8877C17.117 6.90464 17.2238 6.90045 17.3266 6.87539C17.5864 6.81983 17.8562 6.83414 18.1091 6.91569C18.362 6.99723 18.589 7.14378 18.7674 7.34066C18.9455 7.53803 19.0684 7.77888 19.1237 8.0389C19.179 8.29893 19.1647 8.56894 19.0824 8.8217C19.0178 9.02131 19.0358 9.23838 19.1313 9.4252C19.2267 9.61202 19.3924 9.75329 19.592 9.81799C19.7917 9.88238 20.0088 9.86483 20.1956 9.76921C20.3823 9.67358 20.5235 9.5077 20.588 9.30803C20.9167 8.291 20.7111 7.13196 19.9424 6.28119Z",
					fill: "currentColor"
				})
			] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ P("g", {
				clipPath: "url(#clip0_18168_41794)",
				children: [
					/* @__PURE__ */ N("path", {
						d: "M1.76465 15.37C1.76465 18.1648 5.40325 20.4312 9.89261 20.4312C14.382 20.4312 18.0206 18.1645 18.0206 15.37C18.0206 12.5755 14.3817 10.3091 9.89261 10.3091C5.40356 10.3091 1.76465 12.5751 1.76465 15.37Z",
						fill: "white"
					}),
					/* @__PURE__ */ N("path", {
						d: "M10.0819 20.0189C6.1089 20.4108 2.67932 18.6154 2.42084 16.0066C2.16299 13.3984 5.17579 10.9661 9.14819 10.5733C13.1215 10.1801 16.5514 11.9761 16.8093 14.5836C17.0668 17.1928 14.0553 19.6257 10.0819 20.0189ZM18.029 11.3596C17.691 11.2587 17.4593 11.1895 17.6361 10.7456C18.0194 9.78122 18.059 8.9496 17.6435 8.35604C16.8645 7.24327 14.7328 7.30294 12.2893 8.32636C12.2893 8.32476 11.5221 8.66207 11.7181 8.05351C12.094 6.84501 12.0372 5.83308 11.4522 5.24877C10.1269 3.9222 6.60162 5.29888 3.57828 8.32093C1.31445 10.5851 0 12.9845 0 15.0595C0 19.0283 5.08963 21.4412 10.0688 21.4412C16.5958 21.4412 20.9377 17.6488 20.9377 14.6382C20.9377 12.8189 19.4056 11.7866 18.029 11.3596Z",
						fill: "#E6162D"
					}),
					/* @__PURE__ */ N("path", {
						d: "M22.3633 4.09682C20.7872 2.34933 18.4621 1.68333 16.316 2.13935H16.3153C16.1973 2.16455 16.0854 2.21276 15.9861 2.28121C15.8867 2.34966 15.8017 2.43701 15.7361 2.53828C15.6705 2.63955 15.6255 2.75276 15.6036 2.87143C15.5817 2.99011 15.5834 3.11193 15.6087 3.22994C15.6339 3.34795 15.6821 3.45984 15.7505 3.55922C15.819 3.6586 15.9063 3.74353 16.0076 3.80915C16.1089 3.87477 16.2221 3.9198 16.3407 3.94168C16.4594 3.96355 16.5812 3.96183 16.6992 3.93663C18.2259 3.6124 19.878 4.08725 20.9994 5.32799C21.5307 5.91686 21.8977 6.63526 22.0634 7.41095C22.229 8.18664 22.1875 8.99227 21.943 9.74683L21.9433 9.74715C21.906 9.86199 21.8918 9.98306 21.9014 10.1034C21.911 10.2238 21.9442 10.3411 21.9992 10.4486C22.0542 10.556 22.1298 10.6516 22.2218 10.7298C22.3138 10.808 22.4203 10.8673 22.5353 10.9043C22.767 10.9792 23.0189 10.9591 23.2358 10.8484C23.4527 10.7377 23.6168 10.5455 23.6921 10.3139L23.6924 10.3101C24.3651 8.2224 23.9401 5.84241 22.3633 4.09682Z",
						fill: "#FF9933"
					}),
					/* @__PURE__ */ N("path", {
						d: "M19.9426 6.28131C19.1754 5.43022 18.0429 5.10695 16.9971 5.32938C16.893 5.34842 16.7939 5.38814 16.7054 5.44619C16.617 5.50424 16.5411 5.57945 16.4823 5.66736C16.4234 5.75526 16.3828 5.85408 16.3629 5.95797C16.3429 6.06185 16.344 6.16868 16.366 6.27214C16.3881 6.3756 16.4307 6.47358 16.4913 6.56028C16.5519 6.64699 16.6293 6.72065 16.7188 6.77691C16.8084 6.83317 16.9084 6.87089 17.0128 6.88782C17.1172 6.90476 17.224 6.90057 17.3268 6.87551V6.87615C17.5866 6.82059 17.8564 6.83427 18.1093 6.91581C18.3622 6.99736 18.5892 7.14391 18.7676 7.34079C18.9457 7.53816 19.0686 7.779 19.1239 8.03902C19.1792 8.29905 19.1649 8.56906 19.0825 8.82182H19.0832C19.0187 9.02143 19.036 9.2385 19.1315 9.42532C19.2269 9.61214 19.3926 9.75342 19.5922 9.81811C19.7919 9.8825 20.009 9.86495 20.1957 9.76933C20.3825 9.6737 20.5237 9.50782 20.5882 9.30816C20.9168 8.29112 20.7113 7.13208 19.9426 6.28131Z",
						fill: "#FF9933"
					}),
					/* @__PURE__ */ N("path", {
						d: "M10.3012 15.2945C10.162 15.5326 9.85502 15.6468 9.61441 15.5476C9.37762 15.4499 9.30327 15.1844 9.43794 14.9508C9.57643 14.7185 9.87194 14.6052 10.1078 14.6987C10.3477 14.7865 10.4339 15.0555 10.3012 15.2945ZM9.03521 16.9198C8.65099 17.5328 7.82798 17.8015 7.20793 17.5184C6.59714 17.2405 6.41683 16.5279 6.80169 15.9302C7.18112 15.335 7.97637 15.0695 8.59163 15.3274C9.21391 15.5929 9.41304 16.3004 9.03521 16.9198ZM10.4792 12.5804C8.58844 12.0883 6.4513 13.0307 5.63021 14.6968C4.79379 16.3958 5.60276 18.2818 7.51237 18.8986C9.49123 19.5366 11.8234 18.5591 12.6342 16.7248C13.4343 14.932 12.4357 13.0862 10.4792 12.5804Z",
						fill: "black"
					})
				]
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41794",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		}
	},
	skype: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("g", {
				clipPath: "url(#clip0_18168_41927)",
				children: /* @__PURE__ */ N("path", {
					d: "M11.9292 19.141C7.95932 19.141 6.14555 17.1187 6.14555 15.6354C6.14502 15.2816 6.29024 14.9431 6.54706 14.6997C6.80388 14.4563 7.14962 14.3294 7.50293 14.3489C9.2026 14.3489 8.75801 16.8984 11.9292 16.8984C13.5501 16.8984 14.5023 15.9226 14.5023 15.0059C14.5023 14.4551 14.1875 13.8256 13.1174 13.5738L9.57637 12.6807C6.73178 11.9567 6.23605 10.3751 6.23605 8.90756C6.23605 5.86231 9.02162 4.76067 11.6734 4.76067C14.1167 4.76067 17.0203 6.11018 17.0203 7.93575C17.0203 8.72264 16.3633 9.14362 15.6 9.14362C14.1482 9.14362 14.3921 7.10559 11.4728 7.10559C10.021 7.10559 9.25768 7.78625 9.25768 8.73838C9.25768 9.69051 10.3869 10.0131 11.3783 10.2295L13.9908 10.8197C16.8551 11.4649 17.6183 13.1449 17.6183 14.7541C17.6183 17.2289 15.7023 19.141 11.9252 19.141M22.8905 13.9043C23.0039 13.2547 23.0605 12.5965 23.0597 11.9371C23.0735 8.62472 21.6181 5.47669 19.0857 3.34155C16.5533 1.20641 13.2046 0.303934 9.94228 0.877393C8.93954 0.300068 7.80228 -0.00256949 6.64523 1.64338e-05C4.27025 0.0145246 2.08109 1.28739 0.893605 3.34423C-0.293878 5.40108 -0.301559 7.93338 0.873422 9.99739C0.217791 13.5999 1.36626 17.2952 3.94838 19.8915C6.5305 22.4877 10.2195 23.6563 13.8256 23.0203C14.8271 23.5972 15.9629 23.8998 17.1187 23.8977C19.4924 23.8824 21.6803 22.6101 22.8675 20.5545C24.0547 18.4989 24.0635 15.968 22.8905 13.9043Z",
					fill: "currentColor"
				})
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41927",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("g", {
				clipPath: "url(#clip0_18168_41760)",
				children: /* @__PURE__ */ N("path", {
					d: "M11.9292 19.141C7.95932 19.141 6.14555 17.1187 6.14555 15.6354C6.14502 15.2816 6.29024 14.9431 6.54706 14.6997C6.80388 14.4563 7.14962 14.3294 7.50293 14.3489C9.2026 14.3489 8.75801 16.8984 11.9292 16.8984C13.5501 16.8984 14.5023 15.9226 14.5023 15.0059C14.5023 14.4551 14.1875 13.8256 13.1174 13.5738L9.57637 12.6807C6.73178 11.9567 6.23605 10.3751 6.23605 8.90756C6.23605 5.86231 9.02162 4.76067 11.6734 4.76067C14.1167 4.76067 17.0203 6.11018 17.0203 7.93575C17.0203 8.72264 16.3633 9.14362 15.6 9.14362C14.1482 9.14362 14.3921 7.10559 11.4728 7.10559C10.021 7.10559 9.25768 7.78625 9.25768 8.73838C9.25768 9.69051 10.3869 10.0131 11.3783 10.2295L13.9908 10.8197C16.8551 11.4649 17.6183 13.1449 17.6183 14.7541C17.6183 17.2289 15.7023 19.141 11.9252 19.141M22.8905 13.9043C23.0039 13.2547 23.0605 12.5965 23.0597 11.9371C23.0735 8.62472 21.6181 5.47669 19.0857 3.34155C16.5533 1.20641 13.2046 0.303934 9.94228 0.877393C8.93954 0.300068 7.80228 -0.00256949 6.64523 1.64338e-05C4.27025 0.0145246 2.08109 1.28739 0.893605 3.34423C-0.293878 5.40108 -0.301559 7.93338 0.873422 9.99739C0.217791 13.5999 1.36626 17.2952 3.94838 19.8915C6.5305 22.4877 10.2195 23.6563 13.8256 23.0203C14.8271 23.5972 15.9629 23.8998 17.1187 23.8977C19.4924 23.8824 21.6803 22.6101 22.8675 20.5545C24.0547 18.4989 24.0635 15.968 22.8905 13.9043Z",
					fill: "#0078D7"
				})
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41760",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		}
	},
	slack: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ P("g", {
				clipPath: "url(#clip0_18168_41921)",
				children: [
					/* @__PURE__ */ N("path", {
						d: "M6.38744 2.60777C6.38744 3.9873 7.5024 5.10226 8.88193 5.10226H11.3764V2.60777C11.3764 1.22824 10.2615 0.113281 8.88193 0.113281C7.5024 0.113281 6.38744 1.22824 6.38744 2.60777Z",
						fill: "currentColor"
					}),
					/* @__PURE__ */ N("path", {
						d: "M11.3764 8.86289C11.3764 7.48336 10.2615 6.3684 8.88193 6.3684H2.62681C1.24728 6.3684 0.132324 7.48336 0.132324 8.86289C0.132324 10.2424 1.24728 11.3574 2.62681 11.3574H8.88193C10.2615 11.3574 11.3764 10.2424 11.3764 8.86289Z",
						fill: "currentColor"
					}),
					/* @__PURE__ */ N("path", {
						d: "M2.64573 17.6125C4.02526 17.6125 5.14022 16.4975 5.14022 15.118V12.6235H2.64573C1.26621 12.6235 0.151245 13.7385 0.151245 15.118C0.151245 16.4975 1.26621 17.6125 2.64573 17.6125Z",
						fill: "currentColor"
					}),
					/* @__PURE__ */ N("path", {
						d: "M8.88195 12.6235C7.50243 12.6235 6.38747 13.7385 6.38747 15.118V21.3542C6.38747 22.7338 7.50243 23.8487 8.88195 23.8487C10.2615 23.8487 11.3764 22.7338 11.3764 21.3542V15.118C11.3764 13.7385 10.2615 12.6235 8.88195 12.6235Z",
						fill: "currentColor"
					}),
					/* @__PURE__ */ N("path", {
						d: "M18.8788 8.86289C18.8788 7.48336 19.9938 6.3684 21.3733 6.3684C22.7528 6.3684 23.8678 7.48336 23.8678 8.86289C23.8678 10.2424 22.7528 11.3574 21.3733 11.3574H18.8788V8.86289Z",
						fill: "currentColor"
					}),
					/* @__PURE__ */ N("path", {
						d: "M17.6316 8.86289C17.6316 10.2424 16.5166 11.3574 15.1371 11.3574C13.7575 11.3574 12.6426 10.2424 12.6426 8.86289V2.60777C12.6426 1.22824 13.7575 0.113281 15.1371 0.113281C16.5166 0.113281 17.6316 1.22824 17.6316 2.60777V8.86289Z",
						fill: "currentColor"
					}),
					/* @__PURE__ */ N("path", {
						d: "M17.6316 21.3542C17.6316 19.9747 16.5166 18.8597 15.1371 18.8597H12.6426V21.3542C12.6426 22.7338 13.7575 23.8487 15.1371 23.8487C16.5166 23.8487 17.6316 22.7338 17.6316 21.3542Z",
						fill: "currentColor"
					}),
					/* @__PURE__ */ N("path", {
						d: "M12.6426 15.118C12.6426 16.4975 13.7575 17.6125 15.1371 17.6125H21.3922C22.7717 17.6125 23.8867 16.4975 23.8867 15.118C23.8867 13.7385 22.7717 12.6235 21.3922 12.6235H15.1371C13.7575 12.6235 12.6426 13.7385 12.6426 15.118Z",
						fill: "currentColor"
					})
				]
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41921",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ P("g", {
				clipPath: "url(#clip0_18168_41749)",
				children: [
					/* @__PURE__ */ N("path", {
						d: "M5.14034 15.118C5.14034 16.4976 4.02538 17.6125 2.64586 17.6125C1.26633 17.6125 0.151367 16.4976 0.151367 15.118C0.151367 13.7385 1.26633 12.6235 2.64586 12.6235H5.14034V15.118ZM6.38759 15.118C6.38759 13.7385 7.50255 12.6235 8.88208 12.6235C10.2616 12.6235 11.3766 13.7385 11.3766 15.118V21.3542C11.3766 22.7338 10.2616 23.8487 8.88208 23.8487C7.50255 23.8487 6.38759 22.7338 6.38759 21.3542V15.118Z",
						fill: "#E01E5A"
					}),
					/* @__PURE__ */ N("path", {
						d: "M8.88193 5.10226C7.5024 5.10226 6.38744 3.9873 6.38744 2.60777C6.38744 1.22824 7.5024 0.113281 8.88193 0.113281C10.2615 0.113281 11.3764 1.22824 11.3764 2.60777V5.10226H8.88193ZM8.88193 6.3684C10.2615 6.3684 11.3764 7.48336 11.3764 8.86289C11.3764 10.2424 10.2615 11.3574 8.88193 11.3574H2.62681C1.24728 11.3574 0.132324 10.2424 0.132324 8.86289C0.132324 7.48336 1.24728 6.3684 2.62681 6.3684H8.88193Z",
						fill: "#36C5F0"
					}),
					/* @__PURE__ */ N("path", {
						d: "M18.8788 8.86289C18.8788 7.48336 19.9938 6.3684 21.3733 6.3684C22.7528 6.3684 23.8678 7.48336 23.8678 8.86289C23.8678 10.2424 22.7528 11.3574 21.3733 11.3574H18.8788V8.86289ZM17.6316 8.86289C17.6316 10.2424 16.5166 11.3574 15.1371 11.3574C13.7575 11.3574 12.6426 10.2424 12.6426 8.86289V2.60777C12.6426 1.22824 13.7575 0.113281 15.1371 0.113281C16.5166 0.113281 17.6316 1.22824 17.6316 2.60777V8.86289Z",
						fill: "#2EB67D"
					}),
					/* @__PURE__ */ N("path", {
						d: "M15.1371 18.8598C16.5166 18.8598 17.6316 19.9747 17.6316 21.3542C17.6316 22.7338 16.5166 23.8487 15.1371 23.8487C13.7575 23.8487 12.6426 22.7338 12.6426 21.3542V18.8598H15.1371ZM15.1371 17.6125C13.7575 17.6125 12.6426 16.4976 12.6426 15.118C12.6426 13.7385 13.7575 12.6235 15.1371 12.6235H21.3922C22.7717 12.6235 23.8867 13.7385 23.8867 15.118C23.8867 16.4976 22.7717 17.6125 21.3922 17.6125H15.1371Z",
						fill: "#ECB22E"
					})
				]
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41749",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		}
	},
	snapchat: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ N(M, { children: /* @__PURE__ */ N("path", {
				d: "M23.9142 17.4685C23.7474 17.0147 23.4298 16.7718 23.068 16.5706C22.9999 16.5307 22.9374 16.4988 22.884 16.4743C22.7761 16.4185 22.6657 16.3645 22.556 16.3074C21.4283 15.7094 20.5478 14.9549 19.937 14.0606C19.7636 13.8089 19.6132 13.542 19.4876 13.2633C19.4354 13.1142 19.4379 13.0296 19.4753 12.9523C19.5124 12.8927 19.5615 12.8415 19.6194 12.802C19.8132 12.6738 20.0131 12.5438 20.1486 12.456C20.3902 12.2996 20.5815 12.1757 20.7048 12.088C21.1677 11.7642 21.4915 11.4201 21.6938 11.0355C21.835 10.7698 21.9173 10.4768 21.9352 10.1764C21.9531 9.87601 21.9061 9.5753 21.7975 9.29471C21.4909 8.48751 20.7287 7.98638 19.8052 7.98638C19.6104 7.9862 19.4162 8.00676 19.2257 8.04772C19.1748 8.05876 19.1239 8.07041 19.0743 8.0833C19.0829 7.53126 19.0706 6.94855 19.0215 6.37505C18.8474 4.35888 18.1416 3.30204 17.4058 2.45926C16.9346 1.93114 16.3796 1.48433 15.763 1.13682C14.6464 0.498911 13.3802 0.175049 11.9999 0.175049C10.6196 0.175049 9.35948 0.498911 8.24163 1.13682C7.6236 1.48444 7.06746 1.93214 6.59582 2.46171C5.85999 3.30449 5.15421 4.36318 4.98006 6.3775C4.931 6.95101 4.91874 7.53678 4.92671 8.08575C4.87704 8.07287 4.82676 8.06121 4.77587 8.05017C4.58543 8.00921 4.39118 7.98865 4.1964 7.98884C3.27232 7.98884 2.50889 8.48996 2.20353 9.29717C2.09437 9.57788 2.04691 9.8788 2.06437 10.1795C2.08183 10.4802 2.1638 10.7736 2.3047 11.0398C2.50767 11.4244 2.83143 11.7685 3.29439 12.0923C3.41703 12.1782 3.60896 12.3021 3.85056 12.4603C3.98117 12.545 4.17187 12.6689 4.3589 12.7928C4.42433 12.8351 4.47995 12.891 4.522 12.9566C4.56125 13.0369 4.56248 13.1234 4.50422 13.2829C4.38032 13.5558 4.23236 13.8171 4.06211 14.0637C3.46486 14.9378 2.61007 15.6787 1.51859 16.2719C0.94035 16.5785 0.339422 16.7834 0.0855607 17.4735C-0.105755 17.9942 0.0193358 18.5867 0.505597 19.086C0.684059 19.2724 0.891048 19.4291 1.11879 19.5503C1.59266 19.8108 2.09654 20.0125 2.61927 20.1508C2.72714 20.1787 2.82955 20.2245 2.92219 20.2864C3.0994 20.4416 3.07426 20.6753 3.31034 21.0175C3.42884 21.1944 3.57942 21.3476 3.75429 21.469C4.24975 21.8112 4.80653 21.8327 5.39642 21.8554C5.92928 21.8757 6.53327 21.899 7.22311 22.1265C7.50886 22.221 7.80565 22.4038 8.14965 22.6172C8.97562 23.1251 10.1063 23.82 11.9987 23.82C13.891 23.82 15.0297 23.1214 15.8618 22.6117C16.2033 22.4019 16.4983 22.221 16.776 22.129C17.4659 21.9008 18.0699 21.8781 18.6027 21.8579C19.1926 21.8352 19.7494 21.8137 20.2449 21.4714C20.452 21.327 20.6245 21.1385 20.7501 20.9194C20.92 20.6305 20.9157 20.4287 21.0751 20.2876C21.162 20.2287 21.2582 20.1847 21.3596 20.1576C21.8895 20.0188 22.4003 19.8153 22.8804 19.5516C23.1223 19.4217 23.3401 19.2512 23.5242 19.0474L23.5303 19.04C23.9866 18.5518 24.1012 17.9764 23.9142 17.4685ZM22.2322 18.3727C21.2063 18.9394 20.5245 18.8787 19.9941 19.2203C19.5434 19.5105 19.8101 20.1361 19.4827 20.3618C19.0804 20.6397 17.8914 20.3422 16.3554 20.8495C15.0885 21.2684 14.2803 22.4731 12.0017 22.4731C9.7231 22.4731 8.93392 21.2709 7.64622 20.8464C6.11324 20.3391 4.92181 20.6366 4.51894 20.3588C4.19211 20.1331 4.45762 19.5074 4.00754 19.2173C3.47651 18.8756 2.79464 18.9364 1.76939 18.3727C1.11634 18.012 1.4867 17.7887 1.70439 17.6832C5.42033 15.8836 6.01329 13.105 6.03965 12.8989C6.07154 12.6493 6.10711 12.453 5.8324 12.199C5.56688 11.9537 4.38894 11.2244 4.06211 10.9962C3.52128 10.6184 3.28336 10.2411 3.45873 9.77744C3.58137 9.45664 3.88061 9.33581 4.19456 9.33581C4.29379 9.33611 4.39268 9.34722 4.4895 9.36893C5.08307 9.49774 5.65948 9.79523 5.99244 9.87558C6.03253 9.88587 6.07369 9.89143 6.11508 9.89214C6.2929 9.89214 6.35545 9.80259 6.34318 9.59895C6.30517 8.94938 6.21319 7.68338 6.31559 6.50017C6.45601 4.87228 6.98029 4.06569 7.60329 3.35233C7.90253 3.00946 9.30858 1.52325 11.9974 1.52325C14.6863 1.52325 16.096 3.00332 16.3952 3.34497C17.0189 4.05833 17.5437 4.86492 17.6829 6.49281C17.7853 7.67601 17.697 8.94263 17.6553 9.59158C17.6412 9.80565 17.7056 9.88478 17.8835 9.88478C17.9248 9.88411 17.966 9.87856 18.0061 9.86822C18.3397 9.78787 18.9161 9.49038 19.5096 9.36157C19.6065 9.33986 19.7054 9.32875 19.8046 9.32845C20.1204 9.32845 20.4178 9.45112 20.5404 9.77008C20.7158 10.2338 20.4791 10.611 19.9377 10.9889C19.6108 11.217 18.4329 11.9457 18.1674 12.1917C17.892 12.4456 17.9282 12.6419 17.9601 12.8915C17.9865 13.1007 18.5788 15.8793 22.2954 17.6759C22.5149 17.7857 22.8853 18.0089 22.2322 18.3727Z",
				fill: "currentColor"
			}) })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("path", {
				d: "M22.297 17.6797C18.5804 15.88 17.9881 13.1014 17.9617 12.8953C17.9298 12.6457 17.8936 12.4494 18.1689 12.1955C18.4345 11.9501 19.6124 11.2208 19.9392 10.9926C20.4795 10.6148 20.7174 10.2376 20.542 9.77386C20.4194 9.45306 20.1207 9.33223 19.8062 9.33223C19.7069 9.33253 19.608 9.34364 19.5112 9.36535C18.9177 9.49416 18.3413 9.79165 18.0077 9.872C17.9676 9.88234 17.9264 9.8879 17.885 9.88856C17.7072 9.88856 17.6398 9.80943 17.6569 9.59537C17.6986 8.94642 17.7869 7.6798 17.6845 6.49659C17.5441 4.8687 17.0192 4.06211 16.3968 3.34875C16.0957 3.00281 14.6977 1.5166 11.9996 1.5166C9.30158 1.5166 7.90534 3.00281 7.6061 3.34446C6.98187 4.05782 6.45759 4.8644 6.3184 6.4923C6.216 7.6755 6.30798 8.94151 6.34599 9.59107C6.35826 9.79471 6.29571 9.88426 6.11789 9.88426C6.0765 9.88356 6.03534 9.878 5.99525 9.8677C5.66228 9.78735 5.08588 9.48987 4.49231 9.36106C4.39549 9.33934 4.29659 9.32824 4.19737 9.32793C3.88157 9.32793 3.58418 9.45061 3.46154 9.76956C3.28617 10.2333 3.52286 10.6105 4.06492 10.9883C4.39175 11.2165 5.56969 11.9452 5.8352 12.1912C6.10991 12.4451 6.07435 12.6414 6.04246 12.891C6.0161 13.1002 5.42314 15.8788 1.7072 17.6754C1.48951 17.7809 1.11914 18.0041 1.77219 18.3648C2.79745 18.9315 3.47993 18.8708 4.01034 19.2125C4.46043 19.5026 4.1943 20.1282 4.52175 20.354C4.924 20.6318 6.11298 20.3343 7.64903 20.8416C8.93673 21.2661 9.71916 22.4652 12.0027 22.4652C14.2862 22.4652 15.0913 21.2605 16.3564 20.8416C17.8893 20.3343 19.0808 20.6318 19.4836 20.354C19.8105 20.1282 19.545 19.5026 19.995 19.2125C20.5254 18.8708 21.2073 18.9315 22.2332 18.3648C22.885 18.0084 22.5146 17.7852 22.297 17.6797Z",
				fill: "white"
			}), /* @__PURE__ */ N("path", {
				d: "M23.9142 17.4685C23.7474 17.0147 23.4298 16.7718 23.068 16.5706C22.9999 16.5307 22.9374 16.4988 22.884 16.4743C22.7761 16.4185 22.6657 16.3645 22.556 16.3074C21.4283 15.7094 20.5478 14.9549 19.937 14.0606C19.7636 13.8089 19.6132 13.542 19.4876 13.2633C19.4354 13.1142 19.4379 13.0296 19.4753 12.9523C19.5124 12.8927 19.5615 12.8415 19.6194 12.802C19.8132 12.6738 20.0131 12.5438 20.1486 12.456C20.3902 12.2996 20.5815 12.1757 20.7048 12.088C21.1677 11.7642 21.4915 11.4201 21.6938 11.0355C21.835 10.7698 21.9173 10.4768 21.9352 10.1764C21.9531 9.87601 21.9061 9.5753 21.7975 9.29471C21.4909 8.48751 20.7287 7.98638 19.8052 7.98638C19.6104 7.9862 19.4162 8.00676 19.2257 8.04772C19.1748 8.05876 19.1239 8.07041 19.0743 8.0833C19.0829 7.53126 19.0706 6.94855 19.0215 6.37505C18.8474 4.35888 18.1416 3.30204 17.4058 2.45926C16.9346 1.93114 16.3796 1.48433 15.763 1.13682C14.6464 0.498911 13.3802 0.175049 11.9999 0.175049C10.6196 0.175049 9.35948 0.498911 8.24163 1.13682C7.6236 1.48444 7.06746 1.93214 6.59582 2.46171C5.85999 3.30449 5.15421 4.36318 4.98006 6.3775C4.931 6.95101 4.91874 7.53678 4.92671 8.08575C4.87704 8.07287 4.82676 8.06121 4.77587 8.05017C4.58543 8.00921 4.39118 7.98865 4.1964 7.98884C3.27232 7.98884 2.50889 8.48996 2.20353 9.29717C2.09437 9.57788 2.04691 9.8788 2.06437 10.1795C2.08183 10.4802 2.1638 10.7736 2.3047 11.0398C2.50767 11.4244 2.83143 11.7685 3.29439 12.0923C3.41703 12.1782 3.60896 12.3021 3.85056 12.4603C3.98117 12.545 4.17187 12.6689 4.3589 12.7928C4.42433 12.8351 4.47995 12.891 4.522 12.9566C4.56125 13.0369 4.56248 13.1234 4.50422 13.2829C4.38032 13.5558 4.23236 13.8171 4.06211 14.0637C3.46486 14.9378 2.61007 15.6787 1.51859 16.2719C0.94035 16.5785 0.339422 16.7834 0.0855607 17.4735C-0.105755 17.9942 0.0193358 18.5867 0.505597 19.086C0.684059 19.2724 0.891048 19.4291 1.11879 19.5503C1.59266 19.8108 2.09654 20.0125 2.61927 20.1508C2.72714 20.1787 2.82955 20.2245 2.92219 20.2864C3.0994 20.4416 3.07426 20.6753 3.31034 21.0175C3.42884 21.1944 3.57942 21.3476 3.75429 21.469C4.24975 21.8112 4.80653 21.8327 5.39642 21.8554C5.92928 21.8757 6.53327 21.899 7.22311 22.1265C7.50886 22.221 7.80565 22.4038 8.14965 22.6172C8.97562 23.1251 10.1063 23.82 11.9987 23.82C13.891 23.82 15.0297 23.1214 15.8618 22.6117C16.2033 22.4019 16.4983 22.221 16.776 22.129C17.4659 21.9008 18.0699 21.8781 18.6027 21.8579C19.1926 21.8352 19.7494 21.8137 20.2449 21.4714C20.452 21.327 20.6245 21.1385 20.7501 20.9194C20.92 20.6305 20.9157 20.4287 21.0751 20.2876C21.162 20.2287 21.2582 20.1847 21.3596 20.1576C21.8895 20.0188 22.4003 19.8153 22.8804 19.5516C23.1223 19.4217 23.3401 19.2512 23.5242 19.0474L23.5303 19.04C23.9866 18.5518 24.1012 17.9764 23.9142 17.4685ZM22.2322 18.3727C21.2063 18.9394 20.5245 18.8787 19.9941 19.2203C19.5434 19.5105 19.8101 20.1361 19.4827 20.3618C19.0804 20.6397 17.8914 20.3422 16.3554 20.8495C15.0885 21.2684 14.2803 22.4731 12.0017 22.4731C9.7231 22.4731 8.93392 21.2709 7.64622 20.8464C6.11324 20.3391 4.92181 20.6366 4.51894 20.3588C4.19211 20.1331 4.45762 19.5074 4.00754 19.2173C3.47651 18.8756 2.79464 18.9364 1.76939 18.3727C1.11634 18.012 1.4867 17.7887 1.70439 17.6832C5.42033 15.8836 6.01329 13.105 6.03965 12.8989C6.07154 12.6493 6.10711 12.453 5.8324 12.199C5.56688 11.9537 4.38894 11.2244 4.06211 10.9962C3.52128 10.6184 3.28336 10.2411 3.45873 9.77744C3.58137 9.45664 3.88061 9.33581 4.19456 9.33581C4.29379 9.33611 4.39268 9.34722 4.4895 9.36893C5.08307 9.49774 5.65948 9.79523 5.99244 9.87558C6.03253 9.88587 6.07369 9.89143 6.11508 9.89214C6.2929 9.89214 6.35545 9.80259 6.34318 9.59895C6.30517 8.94938 6.21319 7.68338 6.31559 6.50017C6.45601 4.87228 6.98029 4.06569 7.60329 3.35233C7.90253 3.00946 9.30858 1.52325 11.9974 1.52325C14.6863 1.52325 16.096 3.00332 16.3952 3.34497C17.0189 4.05833 17.5437 4.86492 17.6829 6.49281C17.7853 7.67601 17.697 8.94263 17.6553 9.59158C17.6412 9.80565 17.7056 9.88478 17.8835 9.88478C17.9248 9.88411 17.966 9.87856 18.0061 9.86822C18.3397 9.78787 18.9161 9.49038 19.5096 9.36157C19.6065 9.33986 19.7054 9.32875 19.8046 9.32845C20.1204 9.32845 20.4178 9.45112 20.5404 9.77008C20.7158 10.2338 20.4791 10.611 19.9377 10.9889C19.6108 11.217 18.4329 11.9457 18.1674 12.1917C17.892 12.4456 17.9282 12.6419 17.9601 12.8915C17.9865 13.1007 18.5788 15.8793 22.2954 17.6759C22.5149 17.7857 22.8853 18.0089 22.2322 18.3727Z",
				fill: "black"
			})] })
		}
	},
	soundcloud: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ N(M, { children: /* @__PURE__ */ N("path", {
				d: "M0.271557 13.235C0.221667 13.235 0.18188 13.2735 0.175565 13.3291L0 14.6623L0.175565 15.9721C0.176197 16.027 0.221667 16.0655 0.271557 16.0655C0.320185 16.0655 0.35934 16.0276 0.36755 15.9721L0.575323 14.6616L0.36755 13.3285C0.359971 13.2735 0.320185 13.235 0.271557 13.235ZM1.25864 12.5069C1.25043 12.4494 1.20938 12.4102 1.15886 12.4102C1.10833 12.4102 1.06602 12.4513 1.05907 12.5069C1.05907 12.5069 0.822882 14.6623 0.822882 14.6623L1.05907 16.7697C1.06602 16.8265 1.1077 16.8669 1.15886 16.8669C1.20938 16.8669 1.25043 16.8272 1.25864 16.7703L1.52704 14.6623L1.25864 12.5069ZM4.97582 10.5188C4.87919 10.5188 4.79899 10.5978 4.79457 10.6988L4.60637 14.6642L4.79457 17.2269C4.79962 17.3273 4.87919 17.4063 4.97582 17.4063C5.07181 17.4063 5.15201 17.3273 5.1577 17.2269V17.227L5.36989 14.6642L5.1577 10.6989C5.15201 10.5985 5.07244 10.5189 4.97582 10.5189V10.5188ZM3.05155 11.8969C2.97703 11.8969 2.9164 11.9562 2.91072 12.0352L2.69916 14.6623L2.91072 17.2011C2.9164 17.28 2.97703 17.3394 3.05155 17.3394C3.12481 17.3394 3.18606 17.28 3.19238 17.2011L3.43299 14.6623L3.19238 12.0345C3.19175 11.9556 3.12544 11.8962 3.05155 11.8962V11.8969ZM6.93103 17.4044C7.05102 17.4044 7.14891 17.3078 7.15333 17.184L7.33774 14.6649L7.15396 9.38592C7.14891 9.26214 7.05165 9.16551 6.93166 9.16551C6.81041 9.16551 6.71252 9.26277 6.70873 9.38655L6.54517 14.6649L6.70873 17.1853C6.71252 17.3084 6.81041 17.4051 6.93103 17.4051V17.4044ZM10.9337 17.4164C11.0991 17.4164 11.2349 17.2807 11.2381 17.1133V17.1152V17.1133L11.3669 14.6661L11.2381 8.56935C11.2349 8.40263 11.0985 8.26622 10.9337 8.26622C10.7682 8.26622 10.6318 8.40199 10.6293 8.56998L10.5143 14.6649C10.5143 14.6687 10.6293 17.1158 10.6293 17.1158C10.6318 17.2813 10.7688 17.4177 10.9337 17.4177V17.4164ZM8.91719 17.4082C9.06118 17.4082 9.17675 17.2927 9.18054 17.1455V17.1474L9.33716 14.6661L9.18054 9.34866C9.17675 9.20151 9.06055 9.08657 8.91719 9.08657C8.77257 9.08657 8.65637 9.20151 8.65321 9.34866L8.51428 14.6661L8.65384 17.1468C8.657 17.292 8.77257 17.4076 8.91782 17.4076L8.91719 17.4082ZM4.01084 17.3842C4.0961 17.3842 4.16557 17.316 4.17188 17.2257L4.3986 14.663L4.17188 12.2246C4.17125 12.1343 4.09673 12.0668 4.01084 12.0668C3.92432 12.0668 3.85485 12.135 3.8498 12.2259L3.65024 14.663L3.8498 17.2257C3.85548 17.316 3.92432 17.3842 4.01084 17.3842ZM2.10362 17.244C2.16615 17.244 2.21667 17.1948 2.22361 17.1266L2.47812 14.6623L2.22361 12.1053C2.21604 12.0371 2.16551 11.9878 2.10299 11.9878C2.03984 11.9878 1.98932 12.0371 1.983 12.1053L1.75881 14.6623L1.983 17.1259C1.98363 17.1941 2.03984 17.244 2.10299 17.244H2.10362ZM9.92322 9.25961C9.76723 9.25961 9.64219 9.38402 9.63903 9.54254L9.51209 14.6655L9.63903 17.131C9.64219 17.2876 9.76723 17.412 9.92322 17.412C10.0792 17.412 10.2036 17.2882 10.2074 17.1291V17.131L10.3501 14.6655L10.2074 9.54127C10.2036 9.38276 10.0792 9.25898 9.92322 9.25898V9.25961ZM5.95153 17.4095C6.05952 17.4095 6.14857 17.3217 6.15362 17.2093L6.35192 14.6642L6.15362 9.79199C6.14794 9.67958 6.05952 9.5918 5.95153 9.5918C5.84291 9.5918 5.75386 9.67958 5.74944 9.79199L5.57388 14.6642L5.74944 17.2093C5.75386 17.3204 5.84291 17.4082 5.95153 17.4082V17.4095ZM8.16504 17.1682V17.167L8.33555 14.6636L8.16504 9.20656C8.16125 9.07078 8.05389 8.96469 7.9219 8.96469C7.78928 8.96469 7.68255 9.07078 7.67876 9.20656L7.52783 14.663L7.67939 17.1676C7.68318 17.3021 7.78991 17.4076 7.92253 17.4076C8.05452 17.4076 8.16125 17.3015 8.16567 17.1664L8.16504 17.1682ZM21.0482 11.518C20.6441 11.518 20.2582 11.6001 19.9064 11.7472C19.6715 9.08657 17.4409 7 14.7197 7C14.054 7 13.4048 7.13136 12.8314 7.35302C12.6085 7.43891 12.5491 7.52796 12.5472 7.70037V17.0691C12.5497 17.2497 12.6899 17.4 12.8661 17.4183C12.8737 17.4184 20.9958 17.4234 21.0482 17.4234C22.6782 17.4234 24 16.1016 24 14.4716C24 12.841 22.6788 11.5192 21.0482 11.5192V11.518ZM11.9435 7.69216C11.766 7.69216 11.6208 7.83741 11.6182 8.01676L11.485 14.6661L11.6182 17.0792C11.6208 17.2554 11.766 17.4007 11.9435 17.4007C12.1203 17.4007 12.2656 17.2554 12.2687 17.0767V17.0798L12.4133 14.6661L12.2687 8.01613C12.2662 7.83804 12.1203 7.69216 11.9435 7.69216Z",
				fill: "currentColor"
			}) })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("path", {
				d: "M0.271557 13.235C0.221667 13.235 0.18188 13.2735 0.175565 13.3291L0 14.6623L0.175565 15.9721C0.176197 16.027 0.221667 16.0655 0.271557 16.0655C0.320185 16.0655 0.35934 16.0276 0.36755 15.9721L0.575323 14.6616L0.36755 13.3285C0.359971 13.2735 0.320185 13.235 0.271557 13.235ZM1.25864 12.5069C1.25043 12.4494 1.20938 12.4102 1.15886 12.4102C1.10833 12.4102 1.06602 12.4513 1.05907 12.5069C1.05907 12.5069 0.822882 14.6623 0.822882 14.6623L1.05907 16.7697C1.06602 16.8265 1.1077 16.8669 1.15886 16.8669C1.20938 16.8669 1.25043 16.8272 1.25864 16.7703L1.52704 14.6623L1.25864 12.5069ZM4.97582 10.5188C4.87919 10.5188 4.79899 10.5978 4.79457 10.6988L4.60637 14.6642L4.79457 17.2269C4.79962 17.3273 4.87919 17.4063 4.97582 17.4063C5.07181 17.4063 5.15201 17.3273 5.1577 17.2269V17.227L5.36989 14.6642L5.1577 10.6989C5.15201 10.5985 5.07244 10.5189 4.97582 10.5189V10.5188ZM3.05155 11.8969C2.97703 11.8969 2.9164 11.9562 2.91072 12.0352L2.69916 14.6623L2.91072 17.2011C2.9164 17.28 2.97703 17.3394 3.05155 17.3394C3.12481 17.3394 3.18606 17.28 3.19238 17.2011L3.43299 14.6623L3.19238 12.0345C3.19175 11.9556 3.12544 11.8962 3.05155 11.8962V11.8969ZM6.93103 17.4044C7.05102 17.4044 7.14891 17.3078 7.15333 17.184L7.33774 14.6649L7.15396 9.38592C7.14891 9.26214 7.05165 9.16551 6.93166 9.16551C6.81041 9.16551 6.71252 9.26277 6.70873 9.38655L6.54517 14.6649L6.70873 17.1853C6.71252 17.3084 6.81041 17.4051 6.93103 17.4051V17.4044ZM10.9337 17.4164C11.0991 17.4164 11.2349 17.2807 11.2381 17.1133V17.1152V17.1133L11.3669 14.6661L11.2381 8.56935C11.2349 8.40263 11.0985 8.26622 10.9337 8.26622C10.7682 8.26622 10.6318 8.40199 10.6293 8.56998L10.5143 14.6649C10.5143 14.6687 10.6293 17.1158 10.6293 17.1158C10.6318 17.2813 10.7688 17.4177 10.9337 17.4177V17.4164ZM8.91719 17.4082C9.06118 17.4082 9.17675 17.2927 9.18054 17.1455V17.1474L9.33716 14.6661L9.18054 9.34866C9.17675 9.20151 9.06055 9.08657 8.91719 9.08657C8.77257 9.08657 8.65637 9.20151 8.65321 9.34866L8.51428 14.6661L8.65384 17.1468C8.657 17.292 8.77257 17.4076 8.91782 17.4076L8.91719 17.4082ZM4.01084 17.3842C4.0961 17.3842 4.16557 17.316 4.17188 17.2257L4.3986 14.663L4.17188 12.2246C4.17125 12.1343 4.09673 12.0668 4.01084 12.0668C3.92432 12.0668 3.85485 12.135 3.8498 12.2259L3.65024 14.663L3.8498 17.2257C3.85548 17.316 3.92432 17.3842 4.01084 17.3842ZM2.10362 17.244C2.16615 17.244 2.21667 17.1948 2.22361 17.1266L2.47812 14.6623L2.22361 12.1053C2.21604 12.0371 2.16551 11.9878 2.10299 11.9878C2.03984 11.9878 1.98932 12.0371 1.983 12.1053L1.75881 14.6623L1.983 17.1259C1.98363 17.1941 2.03984 17.244 2.10299 17.244H2.10362ZM9.92322 9.25961C9.76723 9.25961 9.64219 9.38402 9.63903 9.54254L9.51209 14.6655L9.63903 17.131C9.64219 17.2876 9.76723 17.412 9.92322 17.412C10.0792 17.412 10.2036 17.2882 10.2074 17.1291V17.131L10.3501 14.6655L10.2074 9.54127C10.2036 9.38276 10.0792 9.25898 9.92322 9.25898V9.25961ZM5.95153 17.4095C6.05952 17.4095 6.14857 17.3217 6.15362 17.2093L6.35192 14.6642L6.15362 9.79199C6.14794 9.67958 6.05952 9.5918 5.95153 9.5918C5.84291 9.5918 5.75386 9.67958 5.74944 9.79199L5.57388 14.6642L5.74944 17.2093C5.75386 17.3204 5.84291 17.4082 5.95153 17.4082V17.4095ZM8.16504 17.1682V17.167L8.33555 14.6636L8.16504 9.20656C8.16125 9.07078 8.05389 8.96469 7.9219 8.96469C7.78928 8.96469 7.68255 9.07078 7.67876 9.20656L7.52783 14.663L7.67939 17.1676C7.68318 17.3021 7.78991 17.4076 7.92253 17.4076C8.05452 17.4076 8.16125 17.3015 8.16567 17.1664L8.16504 17.1682ZM21.0482 11.518C20.6441 11.518 20.2582 11.6001 19.9064 11.7472C19.6715 9.08657 17.4409 7 14.7197 7C14.054 7 13.4048 7.13136 12.8314 7.35302C12.6085 7.43891 12.5491 7.52796 12.5472 7.70037V17.0691C12.5497 17.2497 12.6899 17.4 12.8661 17.4183C12.8737 17.4184 20.9958 17.4234 21.0482 17.4234C22.6782 17.4234 24 16.1016 24 14.4716C24 12.841 22.6788 11.5192 21.0482 11.5192V11.518ZM11.9435 7.69216C11.766 7.69216 11.6208 7.83741 11.6182 8.01676L11.485 14.6661L11.6182 17.0792C11.6208 17.2554 11.766 17.4007 11.9435 17.4007C12.1203 17.4007 12.2656 17.2554 12.2687 17.0767V17.0798L12.4133 14.6661L12.2687 8.01613C12.2662 7.83804 12.1203 7.69216 11.9435 7.69216Z",
				fill: "url(#paint0_linear_18168_41668)"
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ P("linearGradient", {
				id: "paint0_linear_18168_41668",
				x1: "12.305",
				y1: "17.335",
				x2: "12.2091",
				y2: "6.95211",
				gradientUnits: "userSpaceOnUse",
				children: [/* @__PURE__ */ N("stop", { stopColor: "#FF433A" }), /* @__PURE__ */ N("stop", {
					offset: "1",
					stopColor: "#FF9436"
				})]
			}) })] })
		}
	},
	spotify: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ N(M, { children: /* @__PURE__ */ N("path", {
				d: "M11.9633 0C5.35629 0 0 5.35614 0 11.9631C0 18.5704 5.35629 23.9261 11.9633 23.9261C18.571 23.9261 23.9267 18.5704 23.9267 11.9631C23.9267 5.35657 18.571 0.000571425 11.9631 0.000571425L11.9633 0ZM17.4496 17.2543C17.2353 17.6057 16.7753 17.7171 16.4239 17.5014C13.615 15.7857 10.079 15.3971 5.91471 16.3486C5.51343 16.44 5.11343 16.1886 5.022 15.7871C4.93014 15.3857 5.18057 14.9857 5.58286 14.8943C10.14 13.8527 14.049 14.3014 17.2024 16.2286C17.5539 16.4443 17.6653 16.9029 17.4496 17.2543ZM18.9139 13.9964C18.6439 14.4357 18.0696 14.5743 17.631 14.3043C14.4153 12.3273 9.51343 11.7549 5.70986 12.9094C5.21657 13.0584 4.69557 12.7804 4.54586 12.288C4.39729 11.7947 4.67543 11.2747 5.16786 11.1247C9.51257 9.80643 14.9139 10.445 18.6067 12.7143C19.0453 12.9843 19.1839 13.5584 18.9139 13.9964ZM19.0396 10.6044C15.1839 8.31429 8.82243 8.10371 5.14114 9.221C4.55 9.40029 3.92486 9.06657 3.74571 8.47543C3.56657 7.884 3.9 7.25929 4.49157 7.07957C8.71743 5.79671 15.7424 6.04457 20.1816 8.67986C20.7144 8.99543 20.8887 9.68214 20.573 10.2131C20.2587 10.7449 19.5701 10.9201 19.0401 10.6044H19.0396Z",
				fill: "currentColor"
			}) })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ N(M, { children: /* @__PURE__ */ N("path", {
				d: "M11.9633 0C5.35629 0 0 5.35614 0 11.9631C0 18.5704 5.35629 23.9261 11.9633 23.9261C18.571 23.9261 23.9267 18.5704 23.9267 11.9631C23.9267 5.35657 18.571 0.000571425 11.9631 0.000571425L11.9633 0ZM17.4496 17.2543C17.2353 17.6057 16.7753 17.7171 16.4239 17.5014C13.615 15.7857 10.079 15.3971 5.91471 16.3486C5.51343 16.44 5.11343 16.1886 5.022 15.7871C4.93014 15.3857 5.18057 14.9857 5.58286 14.8943C10.14 13.8527 14.049 14.3014 17.2024 16.2286C17.5539 16.4443 17.6653 16.9029 17.4496 17.2543ZM18.9139 13.9964C18.6439 14.4357 18.0696 14.5743 17.631 14.3043C14.4153 12.3273 9.51343 11.7549 5.70986 12.9094C5.21657 13.0584 4.69557 12.7804 4.54586 12.288C4.39729 11.7947 4.67543 11.2747 5.16786 11.1247C9.51257 9.80643 14.9139 10.445 18.6067 12.7143C19.0453 12.9843 19.1839 13.5584 18.9139 13.9964ZM19.0396 10.6044C15.1839 8.31429 8.82243 8.10371 5.14114 9.221C4.55 9.40029 3.92486 9.06657 3.74571 8.47543C3.56657 7.884 3.9 7.25929 4.49157 7.07957C8.71743 5.79671 15.7424 6.04457 20.1816 8.67986C20.7144 8.99543 20.8887 9.68214 20.573 10.2131C20.2587 10.7449 19.5701 10.9201 19.0401 10.6044H19.0396Z",
				fill: "#1ED760"
			}) })
		}
	},
	"stack-overflow": {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ P("g", {
				clipPath: "url(#clip0_18168_41903)",
				children: [
					/* @__PURE__ */ N("path", {
						d: "M16.966 17.0163L6.49015 14.8269L6.93357 12.7207L17.4094 14.9101L16.966 17.0163Z",
						fill: "currentColor"
					}),
					/* @__PURE__ */ N("path", {
						d: "M17.5757 14.3558L7.87584 9.83843L8.76269 7.87074L18.4625 12.4158L17.5757 14.3558Z",
						fill: "currentColor"
					}),
					/* @__PURE__ */ N("path", {
						d: "M18.7951 11.917L10.5641 5.07164L11.9221 3.43652L20.1531 10.2818L18.7951 11.917Z",
						fill: "currentColor"
					}),
					/* @__PURE__ */ N("path", {
						d: "M14.1669 1.27484L15.8852 0L22.2593 8.5913L20.5411 9.86614L14.1669 1.27484Z",
						fill: "currentColor"
					}),
					/* @__PURE__ */ N("path", {
						d: "M16.966 19.7046H6.26844V17.5706H16.966V19.7046Z",
						fill: "currentColor"
					}),
					/* @__PURE__ */ N("path", {
						d: "M19.1272 15.4364V21.866H4.13397V15.4364H2V24H21.2611V15.4364H19.1272Z",
						fill: "currentColor"
					})
				]
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41903",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ P("g", {
				clipPath: "url(#clip0_18168_41720)",
				children: [/* @__PURE__ */ N("path", {
					d: "M19.1272 21.8661V15.4365H21.2611V24.0001H2V15.4365H4.13397V21.8661H19.1272Z",
					fill: "#BCBBBB"
				}), /* @__PURE__ */ N("path", {
					d: "M6.49027 14.8269L16.9661 17.0163L17.4095 14.9101L6.93369 12.7207L6.49027 14.8269ZM7.87596 9.83843L17.5758 14.3558L18.4627 12.4158L8.7628 7.87074L7.87596 9.83843ZM10.5642 5.07164L18.7952 11.917L20.1532 10.2818L11.9222 3.43652L10.5642 5.07164ZM15.8853 0L14.167 1.27484L20.5412 9.86614L22.2595 8.5913L15.8853 0ZM6.26855 19.7046H16.9661V17.5706H6.26855V19.7046Z",
					fill: "#F48023"
				})]
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41720",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		}
	},
	telegram: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("g", {
				clipPath: "url(#clip0_18168_41835)",
				children: /* @__PURE__ */ N("path", {
					fillRule: "evenodd",
					clipRule: "evenodd",
					d: "M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM12.43 8.85893C11.2628 9.3444 8.93014 10.3492 5.43189 11.8733C4.86383 12.0992 4.56626 12.3202 4.53917 12.5363C4.49339 12.9015 4.95071 13.0453 5.57348 13.2411C5.65819 13.2678 5.74596 13.2954 5.83594 13.3246C6.44864 13.5238 7.27283 13.7568 7.70129 13.766C8.08994 13.7744 8.52373 13.6142 9.00264 13.2853C12.2712 11.079 13.9584 9.96381 14.0643 9.93977C14.139 9.92281 14.2426 9.90148 14.3128 9.96385C14.3829 10.0262 14.376 10.1443 14.3686 10.176C14.3233 10.3691 12.5281 12.0381 11.5991 12.9018C11.3095 13.171 11.1041 13.362 11.0621 13.4056C10.968 13.5034 10.8721 13.5958 10.78 13.6846C10.2108 14.2333 9.78391 14.6448 10.8036 15.3168C11.2936 15.6397 11.6858 15.9067 12.0769 16.1731C12.5042 16.4641 12.9303 16.7543 13.4816 17.1157C13.6221 17.2078 13.7562 17.3034 13.8869 17.3965C14.3841 17.751 14.8307 18.0694 15.3826 18.0186C15.7032 17.9891 16.0345 17.6876 16.2027 16.7884C16.6002 14.6632 17.3816 10.0585 17.5622 8.16098C17.578 7.99473 17.5581 7.78197 17.5422 7.68857C17.5262 7.59518 17.4928 7.46211 17.3714 7.3636C17.2276 7.24694 17.0056 7.22234 16.9064 7.22408C16.455 7.23203 15.7626 7.47282 12.43 8.85893Z",
					fill: "currentColor"
				})
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41835",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ P("g", {
				clipPath: "url(#clip0_18168_41611)",
				children: [/* @__PURE__ */ N("path", {
					d: "M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z",
					fill: "url(#paint0_linear_18168_41611)"
				}), /* @__PURE__ */ N("path", {
					fillRule: "evenodd",
					clipRule: "evenodd",
					d: "M5.43201 11.8735C8.93026 10.3493 11.263 9.34452 12.4301 8.85905C15.7627 7.47294 16.4551 7.23216 16.9065 7.22421C17.0058 7.22246 17.2277 7.24706 17.3715 7.36372C17.4929 7.46223 17.5263 7.5953 17.5423 7.6887C17.5583 7.78209 17.5782 7.99485 17.5623 8.1611C17.3817 10.0586 16.6003 14.6633 16.2028 16.7885C16.0346 17.6877 15.7034 17.9893 15.3827 18.0188C14.6858 18.0829 14.1567 17.5582 13.4817 17.1158C12.4256 16.4235 11.8289 15.9925 10.8037 15.3169C9.61896 14.5362 10.387 14.1071 11.0622 13.4058C11.2389 13.2222 14.3093 10.4295 14.3687 10.1761C14.3762 10.1444 14.3831 10.0263 14.3129 9.96397C14.2427 9.90161 14.1392 9.92293 14.0644 9.93989C13.9585 9.96394 12.2713 11.0791 9.00276 13.2855C8.52385 13.6143 8.09007 13.7746 7.70141 13.7662C7.27295 13.7569 6.44876 13.5239 5.83606 13.3247C5.08456 13.0805 4.48728 12.9513 4.53929 12.5364C4.56638 12.3203 4.86395 12.0993 5.43201 11.8735Z",
					fill: "white"
				})]
			}), /* @__PURE__ */ P("defs", { children: [/* @__PURE__ */ P("linearGradient", {
				id: "paint0_linear_18168_41611",
				x1: "1200",
				y1: "0",
				x2: "1200",
				y2: "2382.2",
				gradientUnits: "userSpaceOnUse",
				children: [/* @__PURE__ */ N("stop", { stopColor: "#2AABEE" }), /* @__PURE__ */ N("stop", {
					offset: "1",
					stopColor: "#229ED9"
				})]
			}), /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41611",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			})] })] })
		}
	},
	"telegram-only-sign": {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ N(M, { children: /* @__PURE__ */ N("path", {
				fillRule: "evenodd",
				clipRule: "evenodd",
				d: "M2.51239 10.8488C8.41795 8.27585 12.3559 6.57959 14.3263 5.76003C19.9521 3.42005 21.1211 3.01357 21.883 3.00014C22.0506 2.99719 22.4253 3.03872 22.668 3.23567C22.873 3.40197 22.9294 3.62661 22.9563 3.78428C22.9833 3.94195 23.0169 4.30112 22.9902 4.58177C22.6854 7.78504 21.3662 15.5585 20.6951 19.1462C20.4111 20.6643 19.852 21.1733 19.3107 21.2231C18.1343 21.3314 17.2409 20.4457 16.1015 19.6988C14.3186 18.53 13.3113 17.8025 11.5807 16.662C9.58058 15.3439 10.8772 14.6195 12.017 13.4356C12.3153 13.1258 17.4986 8.41117 17.5989 7.98348C17.6115 7.92999 17.6231 7.7306 17.5046 7.62532C17.3862 7.52004 17.2114 7.55604 17.0852 7.58467C16.9064 7.62526 14.0581 9.50789 8.54035 13.2326C7.73187 13.7877 6.99958 14.0582 6.34347 14.044C5.62016 14.0284 4.2288 13.6351 3.19447 13.2988C1.92583 12.8865 0.91753 12.6684 1.00533 11.9681C1.05106 11.6033 1.55341 11.2302 2.51239 10.8488Z",
				fill: "currentColor"
			}) })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("path", {
				fillRule: "evenodd",
				clipRule: "evenodd",
				d: "M2.51239 10.8488C8.41795 8.27585 12.3559 6.57959 14.3263 5.76003C19.9521 3.42005 21.1211 3.01357 21.883 3.00014C22.0506 2.99719 22.4253 3.03872 22.668 3.23567C22.873 3.40197 22.9294 3.62661 22.9563 3.78428C22.9833 3.94195 23.0169 4.30112 22.9902 4.58177C22.6854 7.78504 21.3662 15.5585 20.6951 19.1462C20.4111 20.6643 19.852 21.1733 19.3107 21.2231C18.1343 21.3314 17.2409 20.4457 16.1015 19.6988C14.3186 18.53 13.3113 17.8025 11.5807 16.662C9.58058 15.3439 10.8772 14.6195 12.017 13.4356C12.3153 13.1258 17.4986 8.41117 17.5989 7.98348C17.6115 7.92999 17.6231 7.7306 17.5046 7.62532C17.3862 7.52004 17.2114 7.55604 17.0852 7.58467C16.9064 7.62526 14.0581 9.50789 8.54035 13.2326C7.73187 13.7877 6.99958 14.0582 6.34347 14.044C5.62016 14.0284 4.2288 13.6351 3.19447 13.2988C1.92583 12.8865 0.91753 12.6684 1.00533 11.9681C1.05106 11.6033 1.55341 11.2302 2.51239 10.8488Z",
				fill: "url(#paint0_linear_18168_41614)"
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ P("linearGradient", {
				id: "paint0_linear_18168_41614",
				x1: "1101",
				y1: "3",
				x2: "1101",
				y2: "1812.7",
				gradientUnits: "userSpaceOnUse",
				children: [/* @__PURE__ */ N("stop", { stopColor: "#2AABEE" }), /* @__PURE__ */ N("stop", {
					offset: "1",
					stopColor: "#229ED9"
				})]
			}) })] })
		}
	},
	threads: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ N(M, { children: /* @__PURE__ */ N("path", {
				d: "M17.6921 11.1235C17.5887 11.074 17.4837 11.0263 17.3774 10.9806C17.1921 7.56728 15.327 5.61312 12.1952 5.59312C12.181 5.59304 12.1669 5.59304 12.1528 5.59304C10.2795 5.59304 8.72164 6.39261 7.76275 7.84759L9.48512 9.0291C10.2014 7.94229 11.3257 7.7106 12.1536 7.7106C12.1631 7.7106 12.1727 7.7106 12.1822 7.71069C13.2134 7.71726 13.9915 8.01708 14.4951 8.60175C14.8616 9.02741 15.1067 9.61563 15.2281 10.358C14.3139 10.2026 13.3251 10.1548 12.2681 10.2154C9.29059 10.3869 7.37639 12.1235 7.50495 14.5365C7.57019 15.7605 8.17996 16.8135 9.22188 17.5014C10.1028 18.0829 11.2374 18.3673 12.4165 18.3029C13.9738 18.2175 15.1954 17.6234 16.0476 16.537C16.6949 15.712 17.1042 14.6429 17.285 13.2957C18.0271 13.7436 18.5771 14.333 18.8809 15.0415C19.3974 16.2459 19.4275 18.225 17.8126 19.8385C16.3978 21.252 14.697 21.8635 12.1267 21.8824C9.27552 21.8612 7.11922 20.9469 5.71726 19.1646C4.40444 17.4958 3.72596 15.0852 3.70065 12C3.72596 8.91473 4.40444 6.5042 5.71726 4.83534C7.11922 3.05311 9.27549 2.13875 12.1266 2.11756C14.9985 2.13891 17.1924 3.05767 18.648 4.8485C19.3618 5.7267 19.8999 6.8311 20.2546 8.11879L22.273 7.58028C21.843 5.99528 21.1664 4.62946 20.2456 3.49675C18.3795 1.20084 15.6503 0.0243935 12.1337 0H12.1196C8.6102 0.0243088 5.91151 1.20522 4.09854 3.50991C2.48524 5.5608 1.65305 8.41446 1.62509 11.9916L1.625 12L1.62509 12.0084C1.65305 15.5855 2.48524 18.4393 4.09854 20.4901C5.91151 22.7948 8.6102 23.9757 12.1196 24H12.1337C15.2538 23.9784 17.453 23.1615 19.2647 21.3514C21.6351 18.9832 21.5637 16.0149 20.7825 14.1926C20.222 12.8859 19.1534 11.8245 17.6921 11.1235ZM12.3051 16.1884C11.0001 16.2619 9.6443 15.6761 9.57745 14.4215C9.5279 13.4913 10.2395 12.4532 12.3851 12.3296C12.6309 12.3154 12.872 12.3085 13.1089 12.3085C13.8883 12.3085 14.6174 12.3842 15.2802 12.5291C15.033 15.6169 13.5828 16.1182 12.3051 16.1884Z",
				fill: "currentColor"
			}) })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ N(M, { children: /* @__PURE__ */ N("path", {
				d: "M17.6921 11.1235C17.5887 11.074 17.4837 11.0263 17.3774 10.9806C17.1921 7.56728 15.327 5.61312 12.1952 5.59312C12.181 5.59304 12.1669 5.59304 12.1528 5.59304C10.2795 5.59304 8.72164 6.39261 7.76275 7.84759L9.48512 9.0291C10.2014 7.94229 11.3257 7.7106 12.1536 7.7106C12.1631 7.7106 12.1727 7.7106 12.1822 7.71069C13.2134 7.71726 13.9915 8.01708 14.4951 8.60175C14.8616 9.02741 15.1067 9.61563 15.2281 10.358C14.3139 10.2026 13.3251 10.1548 12.2681 10.2154C9.29059 10.3869 7.37639 12.1235 7.50495 14.5365C7.57019 15.7605 8.17996 16.8135 9.22188 17.5014C10.1028 18.0829 11.2374 18.3673 12.4165 18.3029C13.9738 18.2175 15.1954 17.6234 16.0476 16.537C16.6949 15.712 17.1042 14.6429 17.285 13.2957C18.0271 13.7436 18.5771 14.333 18.8809 15.0415C19.3974 16.2459 19.4275 18.225 17.8126 19.8385C16.3978 21.252 14.697 21.8635 12.1267 21.8824C9.27552 21.8612 7.11922 20.9469 5.71726 19.1646C4.40444 17.4958 3.72596 15.0852 3.70065 12C3.72596 8.91473 4.40444 6.5042 5.71726 4.83534C7.11922 3.05311 9.27549 2.13875 12.1266 2.11756C14.9985 2.13891 17.1924 3.05767 18.648 4.8485C19.3618 5.7267 19.8999 6.8311 20.2546 8.11879L22.273 7.58028C21.843 5.99528 21.1664 4.62946 20.2456 3.49675C18.3795 1.20084 15.6503 0.0243935 12.1337 0H12.1196C8.6102 0.0243088 5.91151 1.20522 4.09854 3.50991C2.48524 5.5608 1.65305 8.41446 1.62509 11.9916L1.625 12L1.62509 12.0084C1.65305 15.5855 2.48524 18.4393 4.09854 20.4901C5.91151 22.7948 8.6102 23.9757 12.1196 24H12.1337C15.2538 23.9784 17.453 23.1615 19.2647 21.3514C21.6351 18.9832 21.5637 16.0149 20.7825 14.1926C20.222 12.8859 19.1534 11.8245 17.6921 11.1235ZM12.3051 16.1884C11.0001 16.2619 9.6443 15.6761 9.57745 14.4215C9.5279 13.4913 10.2395 12.4532 12.3851 12.3296C12.6309 12.3154 12.872 12.3085 13.1089 12.3085C13.8883 12.3085 14.6174 12.3842 15.2802 12.5291C15.033 15.6169 13.5828 16.1182 12.3051 16.1884Z",
				fill: "black"
			}) })
		}
	},
	tiktok: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ N(M, { children: /* @__PURE__ */ N("path", {
				d: "M17.0725 0H13.0278V16.3478C13.0278 18.2957 11.4722 19.8957 9.53626 19.8957C7.60034 19.8957 6.04469 18.2957 6.04469 16.3478C6.04469 14.4348 7.56577 12.8695 9.43257 12.8V8.69567C5.31872 8.7652 2 12.1391 2 16.3478C2 20.5913 5.38786 24 9.57085 24C13.7538 24 17.1416 20.5565 17.1416 16.3478V7.9652C18.6627 9.07827 20.5295 9.73913 22.5 9.77393V5.66957C19.4579 5.56522 17.0725 3.06087 17.0725 0Z",
				fill: "currentColor"
			}) })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [
				/* @__PURE__ */ N("path", {
					d: "M17.1767 8.66347C18.7201 9.77064 20.6107 10.4221 22.6528 10.4221V6.47861C22.2663 6.47869 21.8808 6.43825 21.5027 6.35786V9.46193C19.4609 9.46193 17.5705 8.81049 16.0267 7.7034V15.7509C16.0267 19.7766 12.7748 23.0399 8.76358 23.0399C7.2669 23.0399 5.8758 22.5858 4.72021 21.807C6.03913 23.1604 7.87845 24 9.91334 24C13.9248 24 17.1769 20.7367 17.1769 16.7108V8.66347H17.1767ZM18.5954 4.68499C17.8066 3.82023 17.2888 2.70267 17.1767 1.46717V0.959961H16.0869C16.3612 2.53028 17.2969 3.87187 18.5954 4.68499ZM7.2573 18.7178C6.81663 18.1379 6.57849 17.4286 6.57955 16.6992C6.57955 14.858 8.06696 13.3651 9.90202 13.3651C10.244 13.365 10.584 13.4176 10.9099 13.5214V9.48977C10.529 9.43739 10.1446 9.41515 9.76035 9.4233V12.5613C9.43419 12.4575 9.09408 12.4048 8.75201 12.4051C6.91695 12.4051 5.42963 13.8979 5.42963 15.7393C5.42963 17.0414 6.17309 18.1687 7.2573 18.7178Z",
					fill: "#FF004F"
				}),
				/* @__PURE__ */ N("path", {
					d: "M16.0265 7.70332C17.5702 8.81041 19.4607 9.46185 21.5025 9.46185V6.35778C20.3628 6.11414 19.3538 5.5164 18.5951 4.68499C17.2966 3.87179 16.361 2.5302 16.0867 0.959961H13.2241V16.7106C13.2176 18.5468 11.7327 20.0336 9.90162 20.0336C8.82257 20.0336 7.86394 19.5174 7.25682 18.7178C6.17269 18.1687 5.42923 17.0413 5.42923 15.7394C5.42923 13.8981 6.91655 12.4052 8.75161 12.4052C9.1032 12.4052 9.44208 12.4602 9.75995 12.5614V9.42338C5.81921 9.50509 2.6499 12.7365 2.6499 16.7107C2.6499 18.6946 3.43913 20.4931 4.72006 21.8071C5.87565 22.5858 7.26675 23.04 8.76342 23.04C12.7747 23.04 16.0265 19.7765 16.0265 15.7509V7.70332H16.0265Z",
					fill: "black"
				}),
				/* @__PURE__ */ N("path", {
					d: "M21.5025 6.3578V5.51848C20.4748 5.52005 19.4672 5.23119 18.5952 4.68493C19.3671 5.53306 20.3835 6.11787 21.5025 6.3578ZM16.0867 0.959983C16.0605 0.809911 16.0404 0.658851 16.0265 0.507214V0H12.074V15.7508C12.0677 17.5868 10.5829 19.0736 8.75164 19.0736C8.214 19.0736 7.70638 18.9455 7.25685 18.7179C7.86397 19.5174 8.82259 20.0336 9.90164 20.0336C11.7326 20.0336 13.2177 18.5469 13.2241 16.7107V0.959983H16.0867ZM9.76014 9.42341V8.52989C9.42988 8.48459 9.09691 8.46186 8.76353 8.46202C4.75192 8.46194 1.5 11.7254 1.5 15.7508C1.5 18.2745 2.77806 20.4987 4.72017 21.807C3.43924 20.493 2.65001 18.6944 2.65001 16.7106C2.65001 12.7365 5.81924 9.50511 9.76014 9.42341Z",
					fill: "#00F2EA"
				})
			] })
		}
	},
	tinder: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ N(M, { children: /* @__PURE__ */ N("path", {
				fillRule: "evenodd",
				clipRule: "evenodd",
				d: "M8.57402 10.066C12.3871 8.74992 13.0361 5.3217 12.5493 2.1697C12.5493 2.05596 12.6467 1.97473 12.7441 2.00722C16.3949 3.79444 20.5 7.69384 20.5 13.5429C20.5 18.0272 17.0277 21.9916 11.9814 21.9916C10.1808 22.0736 8.40417 21.5528 6.93195 20.5114C5.45974 19.47 4.3758 17.9674 3.8512 16.2406C3.3266 14.5138 3.39123 12.6613 4.03488 10.9754C4.67854 9.28945 5.86456 7.86618 7.40576 6.9302C7.50312 6.86521 7.63292 6.9302 7.63292 7.04394C7.6816 7.64509 7.84386 9.15611 8.50912 10.066H8.57402Z",
				fill: "currentColor"
			}) })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("path", {
				fillRule: "evenodd",
				clipRule: "evenodd",
				d: "M8.57402 10.066C12.3871 8.74992 13.0361 5.3217 12.5493 2.1697C12.5493 2.05596 12.6467 1.97473 12.7441 2.00722C16.3949 3.79444 20.5 7.69384 20.5 13.5429C20.5 18.0272 17.0277 21.9916 11.9814 21.9916C10.1808 22.0736 8.40417 21.5528 6.93195 20.5114C5.45974 19.47 4.3758 17.9674 3.8512 16.2406C3.3266 14.5138 3.39123 12.6613 4.03488 10.9754C4.67854 9.28945 5.86456 7.86618 7.40576 6.9302C7.50312 6.86521 7.63292 6.9302 7.63292 7.04394C7.6816 7.64509 7.84386 9.15611 8.50912 10.066H8.57402Z",
				fill: "url(#paint0_radial_18168_41747)"
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ P("radialGradient", {
				id: "paint0_radial_18168_41747",
				cx: "0",
				cy: "0",
				r: "1",
				gradientUnits: "userSpaceOnUse",
				gradientTransform: "translate(12 22) scale(17 20)",
				children: [/* @__PURE__ */ N("stop", { stopColor: "#FF7854" }), /* @__PURE__ */ N("stop", {
					offset: "1",
					stopColor: "#FD267D"
				})]
			}) })] })
		}
	},
	tumblr: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ N(M, { children: /* @__PURE__ */ N("path", {
				d: "M14.6 24C11 24 8.3 22.15 8.3 17.7V10.6H5V6.75C8.6 5.8 10.1 2.7 10.3 0H14.05V6.1H18.4V10.6H14.05V16.8C14.05 18.65 15 19.3 16.5 19.3H18.6V24H14.6Z",
				fill: "currentColor"
			}) })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ N(M, { children: /* @__PURE__ */ N("path", {
				d: "M14.6 24C11 24 8.3 22.15 8.3 17.7V10.6H5V6.75C8.6 5.8 10.1 2.7 10.3 0H14.05V6.1H18.4V10.6H14.05V16.8C14.05 18.65 15 19.3 16.5 19.3H18.6V24H14.6Z",
				fill: "#001935"
			}) })
		}
	},
	twitch: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ P("g", {
				clipPath: "url(#clip0_18168_41851)",
				children: [
					/* @__PURE__ */ N("path", {
						d: "M18.0006 4.71429H16.2863V9.85715H18.0006V4.71429Z",
						fill: "currentColor"
					}),
					/* @__PURE__ */ N("path", {
						d: "M11.5719 4.71429H13.2862V9.85715H11.5719V4.71429Z",
						fill: "currentColor"
					}),
					/* @__PURE__ */ N("path", {
						fillRule: "evenodd",
						clipRule: "evenodd",
						d: "M6.00056 0L1.71484 4.28571V19.7143H6.8577V24L11.1434 19.7143H14.572L22.2863 12V0H6.00056ZM20.572 11.1429L17.1434 14.5714H13.7148L10.7148 17.5714V14.5714H6.8577V1.71429H20.572V11.1429Z",
						fill: "currentColor"
					})
				]
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41851",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [
				/* @__PURE__ */ N("path", {
					d: "M20.5722 11.1429L17.1436 14.5715H13.7151L10.7151 17.5715V14.5715H6.85791V1.71436H20.5722V11.1429Z",
					fill: "white"
				}),
				/* @__PURE__ */ N("path", {
					d: "M6.00056 0L1.71484 4.28571V19.7143H6.8577V24L11.1434 19.7143H14.572L22.2863 12V0H6.00056ZM20.572 11.1429L17.1434 14.5714H13.7148L10.7148 17.5714V14.5714H6.8577V1.71429H20.572V11.1429Z",
					fill: "#9146FF"
				}),
				/* @__PURE__ */ N("path", {
					d: "M18.0009 4.71436H16.2866V9.85721H18.0009V4.71436Z",
					fill: "#9146FF"
				}),
				/* @__PURE__ */ N("path", {
					d: "M13.2866 4.71436H11.5723V9.85721H13.2866V4.71436Z",
					fill: "#9146FF"
				})
			] })
		}
	},
	viber: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ P("g", {
				clipPath: "url(#clip0_18168_41915)",
				children: [
					/* @__PURE__ */ N("path", {
						d: "M14.5578 10.2464C14.4826 10.2464 14.4103 10.2175 14.3558 10.1657C14.3013 10.1139 14.2688 10.0431 14.265 9.96794C14.2153 8.97201 13.746 8.48431 12.7884 8.43279C12.7121 8.42672 12.6412 8.39108 12.5908 8.33347C12.5404 8.27586 12.5145 8.20084 12.5186 8.12441C12.5227 8.04798 12.5566 7.97619 12.6129 7.92435C12.6692 7.87251 12.7435 7.84473 12.8201 7.84692C14.0837 7.91654 14.7862 8.63817 14.8509 9.9387C14.8528 9.97719 14.8472 10.0157 14.8342 10.052C14.8212 10.0883 14.8013 10.1217 14.7754 10.1502C14.7495 10.1788 14.7183 10.202 14.6835 10.2185C14.6487 10.235 14.6109 10.2445 14.5724 10.2464H14.5578Z",
						fill: "currentColor"
					}),
					/* @__PURE__ */ N("path", {
						d: "M16.0567 10.7512H16.0637C16.1405 10.751 16.2141 10.7208 16.2689 10.667C16.3237 10.6132 16.3552 10.5401 16.3568 10.4633C16.3825 9.31768 16.032 8.34228 15.3271 7.57123C14.6222 6.80017 13.6307 6.3626 12.38 6.27105C12.3023 6.26537 12.2254 6.2908 12.1665 6.34176C12.1075 6.39271 12.0712 6.46501 12.0655 6.54274C12.0598 6.62048 12.0852 6.69729 12.1362 6.75627C12.1871 6.81525 12.2594 6.85158 12.3372 6.85726C13.4487 6.93871 14.2824 7.30075 14.8944 7.96842C15.5063 8.63609 15.7928 9.44822 15.7702 10.4511C15.7684 10.5289 15.7976 10.6042 15.8513 10.6605C15.9051 10.7167 15.9789 10.7494 16.0567 10.7512Z",
						fill: "currentColor"
					}),
					/* @__PURE__ */ N("path", {
						d: "M17.6047 11.3534C17.5273 11.3533 17.453 11.3227 17.3981 11.2681C17.3431 11.2135 17.3119 11.1395 17.3113 11.062C17.2977 9.26824 16.7811 7.89809 15.7319 6.87396C14.6953 5.86445 13.3857 5.34646 11.839 5.33532C11.8005 5.33519 11.7624 5.32746 11.7268 5.31259C11.6913 5.29771 11.659 5.27598 11.6318 5.24863C11.577 5.19341 11.5464 5.11865 11.5466 5.04083C11.5469 4.963 11.5781 4.88846 11.6333 4.83363C11.6886 4.77879 11.7633 4.74814 11.8411 4.74841H11.8436C13.5465 4.76095 14.9925 5.33463 16.1417 6.45414C17.2908 7.57365 17.8832 9.12552 17.8986 11.0586C17.8991 11.1363 17.8688 11.2111 17.8142 11.2666C17.7596 11.322 17.6853 11.3535 17.6075 11.3541L17.6047 11.3534Z",
						fill: "currentColor"
					}),
					/* @__PURE__ */ N("path", {
						d: "M13.4968 13.6447C13.2747 13.9183 12.8622 13.8835 12.8622 13.8835C9.8472 13.1138 9.04029 10.0598 9.04029 10.0598C9.04029 10.0598 9.00409 9.64733 9.27909 9.42524L9.82388 8.9922C10.094 8.78403 10.2663 8.27892 9.99132 7.78566C9.78039 7.4154 9.55104 7.05593 9.30416 6.70861C9.06431 6.38104 8.5056 5.71024 8.50351 5.70815C8.23407 5.39033 7.83793 5.31653 7.4202 5.5341C7.41893 5.5341 7.4172 5.53466 7.41553 5.5352C7.41399 5.5357 7.4125 5.53619 7.41149 5.53619C6.99602 5.77557 6.6214 6.07969 6.30173 6.43709C6.30064 6.43927 6.29955 6.44031 6.29846 6.44135C6.29746 6.44231 6.29646 6.44326 6.29546 6.44509C6.0374 6.75653 5.88968 7.06182 5.85232 7.36096C5.84456 7.40507 5.84188 7.44992 5.84432 7.49464C5.84293 7.62673 5.86303 7.75818 5.90384 7.88382L5.91811 7.89357C6.04831 8.35586 6.37413 9.12587 7.08218 10.4097C7.48718 11.1523 7.95426 11.8592 8.47844 12.5231C8.74107 12.8558 9.02257 13.1732 9.32156 13.4737C9.32516 13.4773 9.32872 13.4809 9.33227 13.4845C9.33936 13.4917 9.3464 13.4988 9.35359 13.5058L9.44966 13.6018C9.75017 13.9008 10.0676 14.1823 10.4003 14.445C11.0642 14.9692 11.7713 15.4363 12.5141 15.8412C13.7975 16.5493 14.5682 16.8751 15.0298 17.0053L15.0396 17.0196C15.1652 17.0605 15.2966 17.0807 15.4288 17.0794C15.4735 17.0816 15.5183 17.0788 15.5624 17.0711C15.862 17.0356 16.1671 16.8881 16.4776 16.6286C16.4794 16.6276 16.4804 16.6266 16.4813 16.6256C16.4824 16.6245 16.4834 16.6235 16.4856 16.6224C16.843 16.3026 17.1472 15.928 17.3869 15.5126C17.3869 15.5116 17.3873 15.5101 17.3877 15.5086C17.3881 15.5069 17.3886 15.5052 17.3886 15.5039C17.6062 15.0862 17.5324 14.69 17.2128 14.4202C17.2124 14.4202 17.1863 14.3988 17.1422 14.3624C16.9611 14.2132 16.4758 13.8133 16.2123 13.6196C15.8654 13.3727 15.5063 13.1434 15.1363 12.9324C14.6427 12.6574 14.1387 12.8297 13.9298 13.0999L13.4968 13.6447Z",
						fill: "currentColor"
					}),
					/* @__PURE__ */ N("path", {
						fillRule: "evenodd",
						clipRule: "evenodd",
						d: "M20.5167 2.85956C19.9402 2.32766 17.6107 0.63655 12.4218 0.613574C12.4218 0.613574 6.30276 0.244581 3.31983 2.98071C1.65936 4.64153 1.07523 7.07166 1.01362 10.0845C0.952003 13.0974 0.872286 18.7437 6.31495 20.2747H6.32017L6.31669 22.6108C6.31669 22.6108 6.28188 23.5566 6.90464 23.7495C7.53332 23.9447 7.94524 23.4763 8.48237 22.8656C8.58885 22.7445 8.70025 22.6179 8.81923 22.4897C9.21399 22.0643 9.75912 21.4394 10.1699 20.9618C13.8922 21.2751 16.755 20.5591 17.0802 20.4533C17.1473 20.4315 17.2423 20.4073 17.3602 20.3774C18.5628 20.0716 22.1463 19.1604 22.7763 14.0188C23.4902 8.19953 22.4309 4.51864 20.5167 2.85956ZM21.1475 13.6015C20.6218 17.8461 17.7729 18.509 16.7464 18.7478C16.6329 18.7742 16.5416 18.7955 16.4783 18.8158C16.2078 18.9028 13.6934 19.5283 10.5316 19.3219C10.5316 19.3219 8.17558 22.1642 7.43968 22.9032C7.32481 23.0188 7.18974 23.0655 7.09958 23.0425C6.97287 23.0115 6.93806 22.8615 6.93945 22.6422C6.94154 22.3289 6.95964 18.7601 6.95964 18.7601C2.50771 17.5241 2.61155 12.9899 2.67048 10.4165C2.67249 10.3285 2.67445 10.2429 2.67618 10.1597C2.7284 7.64326 3.20113 5.58176 4.60539 4.19525C7.12847 1.90993 12.3261 2.25142 12.3261 2.25142C16.7154 2.27057 18.8186 3.59233 19.3063 4.03512C20.9257 5.42163 21.7507 8.73945 21.1475 13.6001V13.6015Z",
						fill: "currentColor"
					})
				]
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41915",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [
				/* @__PURE__ */ N("path", {
					d: "M19.3716 4.03518C18.8843 3.59239 16.7806 2.27062 12.3914 2.25148C12.3914 2.25148 7.19411 1.90998 4.67103 4.19531C3.26641 5.58182 2.79334 7.64366 2.74077 10.1601C2.68821 12.6766 2.42016 17.4826 7.02249 18.7612C7.02249 18.7612 7.00474 22.3296 7.0023 22.6433C7.0023 22.8626 7.03711 23.0126 7.16243 23.0436C7.25294 23.0655 7.38766 23.0189 7.50288 22.9043C8.23843 22.1653 10.5944 19.323 10.5944 19.323C13.7559 19.5294 16.2707 18.9053 16.5411 18.8169C17.1775 18.6129 20.6251 18.3152 21.2103 13.6012C21.8171 8.7395 20.991 5.42169 19.3716 4.03518Z",
					fill: "white"
				}),
				/* @__PURE__ */ N("path", {
					d: "M20.5167 2.85981C19.9402 2.3279 17.6107 0.636794 12.4218 0.613819C12.4218 0.613819 6.30276 0.244825 3.31983 2.98095C1.65936 4.64177 1.07523 7.07191 1.01362 10.0848C0.952003 13.0976 0.872286 18.7439 6.31495 20.2749H6.32017L6.31669 22.6111C6.31669 22.6111 6.28188 23.5569 6.90464 23.7497C7.65795 23.9837 8.10004 23.2648 8.81923 22.4899C9.21399 22.0645 9.75912 21.4397 10.1699 20.9621C13.8922 21.2754 16.755 20.5593 17.0802 20.4535C17.8317 20.2098 22.0846 19.6647 22.7763 14.0191C23.4902 8.19978 22.4309 4.51889 20.5167 2.85981ZM21.1475 13.6017C20.5637 18.3158 17.1143 18.612 16.4783 18.816C16.2078 18.903 13.6934 19.5286 10.5316 19.3222C10.5316 19.3222 8.17558 22.1645 7.43968 22.9035C7.32481 23.0191 7.18974 23.0657 7.09958 23.0427C6.97287 23.0117 6.93806 22.8617 6.93945 22.6424C6.94154 22.3291 6.95964 18.7603 6.95964 18.7603C2.35557 17.4821 2.62396 12.6764 2.67618 10.16C2.7284 7.6435 3.20113 5.58201 4.60539 4.1955C7.12847 1.91017 12.3261 2.25166 12.3261 2.25166C16.7154 2.27081 18.8186 3.59257 19.3063 4.03537C20.9257 5.42188 21.7507 8.73969 21.1475 13.6003V13.6017Z",
					fill: "#7360F2"
				}),
				/* @__PURE__ */ N("path", {
					d: "M14.5577 10.2465C14.4825 10.2466 14.4101 10.2176 14.3557 10.1658C14.3012 10.114 14.2687 10.0432 14.2649 9.96806C14.2151 8.97213 13.7459 8.48443 12.7883 8.43291C12.712 8.42684 12.641 8.3912 12.5907 8.33359C12.5403 8.27598 12.5144 8.20096 12.5185 8.12453C12.5226 8.04811 12.5565 7.97631 12.6128 7.92448C12.6691 7.87264 12.7434 7.84485 12.8199 7.84704C14.0836 7.91667 14.786 8.63829 14.8508 9.93882C14.8527 9.97731 14.847 10.0158 14.8341 10.0521C14.8211 10.0884 14.8011 10.1218 14.7753 10.1504C14.7494 10.1789 14.7182 10.2021 14.6834 10.2186C14.6485 10.2352 14.6108 10.2446 14.5723 10.2465H14.5577Z",
					fill: "#7360F2"
				}),
				/* @__PURE__ */ N("path", {
					d: "M16.0639 10.7514H16.0569C15.9792 10.7496 15.9053 10.717 15.8516 10.6607C15.7979 10.6044 15.7687 10.5291 15.7705 10.4514C15.7931 9.44847 15.5066 8.63633 14.8946 7.96866C14.2826 7.30099 13.4489 6.93896 12.3374 6.8575C12.2597 6.85182 12.1874 6.8155 12.1364 6.75651C12.0855 6.69753 12.06 6.62072 12.0657 6.54299C12.0714 6.46525 12.1077 6.39295 12.1667 6.342C12.2257 6.29105 12.3025 6.26561 12.3802 6.27129C13.631 6.36284 14.6224 6.80041 15.3273 7.57147C16.0322 8.34253 16.3828 9.31793 16.357 10.4635C16.3555 10.5403 16.3239 10.6134 16.2691 10.6672C16.2144 10.721 16.1407 10.7513 16.0639 10.7514Z",
					fill: "#7360F2"
				}),
				/* @__PURE__ */ N("path", {
					d: "M17.605 11.3535C17.5276 11.3534 17.4533 11.3228 17.3983 11.2682C17.3434 11.2137 17.3122 11.1396 17.3115 11.0622C17.298 9.26836 16.7814 7.89821 15.7322 6.87408C14.6955 5.86457 13.3859 5.34659 11.8393 5.33545C11.8007 5.33531 11.7626 5.32758 11.7271 5.31271C11.6915 5.29783 11.6592 5.2761 11.6321 5.24876C11.5773 5.19353 11.5466 5.11878 11.5469 5.04095C11.5472 4.96312 11.5783 4.88859 11.6336 4.83375C11.6888 4.77891 11.7635 4.74826 11.8414 4.74854H11.8438C13.5468 4.76107 14.9928 5.33475 16.1419 6.45426C17.291 7.57378 17.8835 9.12564 17.8988 11.0587C17.8994 11.1365 17.869 11.2113 17.8144 11.2667C17.7599 11.3221 17.6855 11.3536 17.6078 11.3542L17.605 11.3535Z",
					fill: "#7360F2"
				}),
				/* @__PURE__ */ N("path", {
					d: "M12.862 13.8837C12.862 13.8837 13.2745 13.9185 13.4966 13.6449L13.9296 13.1001C14.1385 12.83 14.6425 12.6577 15.1362 12.9327C15.5061 13.1436 15.8652 13.373 16.2122 13.6198C16.5397 13.8607 17.2105 14.4205 17.2126 14.4205C17.5322 14.6903 17.606 15.0864 17.3884 15.5041C17.3884 15.5066 17.3867 15.5108 17.3867 15.5128C17.1471 15.9282 16.8428 16.3029 16.4854 16.6226C16.4813 16.6247 16.4813 16.6268 16.4774 16.6289C16.1669 16.8883 15.8619 17.0358 15.5622 17.0713C15.5181 17.079 15.4733 17.0818 15.4286 17.0797C15.2965 17.0809 15.165 17.0607 15.0394 17.0198L15.0296 17.0055C14.5681 16.8753 13.7973 16.5495 12.5139 15.8415C11.7711 15.4365 11.0641 14.9695 10.4002 14.4452C10.0674 14.1826 9.74999 13.9011 9.44948 13.6021L9.41745 13.5701L9.38543 13.538L9.3534 13.506C9.34261 13.4956 9.33217 13.4848 9.32138 13.474C9.02238 13.1735 8.74088 12.8561 8.47826 12.5233C7.95408 11.8595 7.48699 11.1525 7.082 10.4099C6.37395 9.12611 6.04812 8.3561 5.91793 7.89381L5.90366 7.88407C5.86285 7.75842 5.84274 7.62698 5.84413 7.49488C5.84169 7.45016 5.84438 7.40532 5.85214 7.36121C5.8895 7.06207 6.03722 6.75678 6.29528 6.44534C6.29737 6.44151 6.29946 6.44151 6.30154 6.43733C6.62121 6.07993 6.99584 5.77581 7.41131 5.53643C7.4134 5.53643 7.41758 5.53434 7.42001 5.53434C7.83774 5.31677 8.23389 5.39057 8.50332 5.70839C8.50541 5.71048 9.06413 6.38129 9.30397 6.70886C9.55086 7.05617 9.7802 7.41564 9.99114 7.7859C10.2661 8.27917 10.0938 8.78427 9.8237 8.99244L9.27891 9.42549C9.0039 9.64758 9.04011 10.0601 9.04011 10.0601C9.04011 10.0601 9.84702 13.114 12.862 13.8837Z",
					fill: "#7360F2"
				})
			] })
		}
	},
	vimeo: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ N(M, { children: /* @__PURE__ */ N("path", {
				d: "M21.9903 7.78306C21.9013 9.62326 20.5415 12.1431 17.9115 15.3412C15.1923 18.682 12.8917 20.3522 11.0097 20.3522C9.84425 20.3522 8.85724 19.3352 8.05164 17.3005C7.51324 15.4354 6.97543 13.5705 6.43723 11.7053C5.83862 9.67175 5.19682 8.65363 4.51062 8.65363C4.36102 8.65363 3.83741 8.95118 2.94101 9.54402L2 8.39816C2.98701 7.57834 3.96081 6.75871 4.91882 5.93796C6.23523 4.86267 7.22343 4.29719 7.88204 4.24002C9.43865 4.0987 10.3967 5.10436 10.7563 7.25721C11.1449 9.57986 11.4137 11.0246 11.5649 11.5901C12.0135 13.5171 12.5071 14.4793 13.0465 14.4793C13.4651 14.4793 14.0939 13.8544 14.9323 12.6046C15.7699 11.3544 16.2185 10.4033 16.2791 9.74987C16.3983 8.67099 15.9495 8.13023 14.9323 8.13023C14.4535 8.13023 13.9599 8.23438 13.4521 8.44023C14.4349 5.39701 16.3129 3.91907 19.0849 4.00341C21.1399 4.0604 22.1087 5.32022 21.9903 7.78306Z",
				fill: "currentColor"
			}) })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ N(M, { children: /* @__PURE__ */ N("path", {
				d: "M21.9903 7.78306C21.9013 9.62326 20.5415 12.1431 17.9115 15.3412C15.1923 18.682 12.8917 20.3522 11.0097 20.3522C9.84425 20.3522 8.85724 19.3352 8.05164 17.3005C7.51324 15.4354 6.97543 13.5705 6.43723 11.7053C5.83862 9.67175 5.19682 8.65363 4.51062 8.65363C4.36102 8.65363 3.83741 8.95118 2.94101 9.54402L2 8.39816C2.98701 7.57834 3.96081 6.75871 4.91882 5.93796C6.23523 4.86267 7.22343 4.29719 7.88204 4.24002C9.43865 4.0987 10.3967 5.10436 10.7563 7.25721C11.1449 9.57986 11.4137 11.0246 11.5649 11.5901C12.0135 13.5171 12.5071 14.4793 13.0465 14.4793C13.4651 14.4793 14.0939 13.8544 14.9323 12.6046C15.7699 11.3544 16.2185 10.4033 16.2791 9.74987C16.3983 8.67099 15.9495 8.13023 14.9323 8.13023C14.4535 8.13023 13.9599 8.23438 13.4521 8.44023C14.4349 5.39701 16.3129 3.91907 19.0849 4.00341C21.1399 4.0604 22.1087 5.32022 21.9903 7.78306Z",
				fill: "#17D5FF"
			}) })
		}
	},
	vk: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("g", {
				clipPath: "url(#clip0_18168_41839)",
				children: /* @__PURE__ */ N("path", {
					fillRule: "evenodd",
					clipRule: "evenodd",
					d: "M1.68707 1.68707C0 3.37414 0 6.08942 0 11.52V12.48C0 17.9106 0 20.6259 1.68707 22.3129C3.37414 24 6.08942 24 11.52 24H12.48C17.9106 24 20.6259 24 22.3129 22.3129C24 20.6259 24 17.9106 24 12.48V11.52C24 6.08942 24 3.37414 22.3129 1.68707C20.6259 0 17.9106 0 12.48 0H11.52C6.08942 0 3.37414 0 1.68707 1.68707ZM4.05005 7.30005C4.18006 13.54 7.30003 17.29 12.77 17.29H13.0801V13.72C15.0901 13.92 16.61 15.39 17.22 17.29H20.0601C19.2801 14.45 17.23 12.88 15.95 12.28C17.23 11.54 19.03 9.74006 19.46 7.30005H16.8799C16.3199 9.28005 14.6601 11.08 13.0801 11.25V7.30005H10.5V14.22C8.90002 13.82 6.88006 11.88 6.79006 7.30005H4.05005Z",
					fill: "currentColor"
				})
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41839",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ P("g", {
				clipPath: "url(#clip0_18168_41616)",
				children: [/* @__PURE__ */ N("path", {
					d: "M0 11.52C0 6.08942 0 3.37414 1.68707 1.68707C3.37414 0 6.08942 0 11.52 0H12.48C17.9106 0 20.6259 0 22.3129 1.68707C24 3.37414 24 6.08942 24 11.52V12.48C24 17.9106 24 20.6259 22.3129 22.3129C20.6259 24 17.9106 24 12.48 24H11.52C6.08942 24 3.37414 24 1.68707 22.3129C0 20.6259 0 17.9106 0 12.48V11.52Z",
					fill: "#0077FF"
				}), /* @__PURE__ */ N("path", {
					d: "M12.7703 17.29C7.30028 17.29 4.1803 13.54 4.05029 7.30005H6.7903C6.8803 11.88 8.90026 13.82 10.5002 14.22V7.30005H13.0803V11.25C14.6603 11.08 16.3201 9.28005 16.8801 7.30005H19.4602C19.0302 9.74006 17.2302 11.54 15.9502 12.28C17.2302 12.88 19.2803 14.45 20.0603 17.29H17.2202C16.6102 15.39 15.0903 13.92 13.0803 13.72V17.29H12.7703Z",
					fill: "white"
				})]
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41616",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		}
	},
	"vk-music": {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("path", {
				d: "M9.38363 6.52389C6.88564 8.24158 4.24909 10.0394 0.00147604 10.0398C0.0153382 5.5812 0.160799 3.21335 1.68708 1.68706C3.37414 2.02656e-06 6.08942 1.3563e-06 11.52 0H12.48C17.9106 0 20.6259 0 22.3129 1.68706C23.5131 2.88718 23.8596 4.60762 23.9595 7.45569C23.2094 6.84877 22.1044 5.96699 20.7788 5.22804C19.3918 4.45483 17.6981 3.79985 15.8399 3.79985C13.343 3.79985 11.3689 5.15804 9.49871 6.44473L9.38363 6.52389Z",
				fill: "currentColor"
			}), /* @__PURE__ */ N("path", {
				fillRule: "evenodd",
				clipRule: "evenodd",
				d: "M24 11.5115C24 10.8929 24 10.3095 23.9975 9.75897C23.7831 9.76091 23.5665 9.69424 23.3828 9.5542C23.2148 9.42612 23.0201 9.26846 22.8156 9.10284L22.8051 9.09438C22.0501 8.48298 21.0248 7.65496 19.805 6.97494C18.5838 6.29416 17.2327 5.79985 15.8399 5.79985C14.0199 5.79985 12.5324 6.78593 10.5168 8.17188L10.4834 8.19489C7.97001 9.92322 4.89202 12.0398 5.24521e-06 12.0399L0 12.48C0 17.9106 0 20.6259 1.68706 22.3129C3.29944 23.9253 5.85103 23.9967 10.8146 23.9998C11.0446 24 11.2795 24 11.52 24H12.48C12.7205 24 12.9554 24 13.1854 23.9998C18.149 23.9967 20.7005 23.9253 22.3129 22.3129C24 20.6259 24 17.9106 24 12.48V11.5115ZM14.7602 9.47402C14.7602 8.88086 15.2471 8.40002 15.8402 8.40002C16.4334 8.40002 16.9202 8.88086 16.9202 9.47402V19.326C16.9202 19.9192 16.4334 20.4 15.8402 20.4C15.2471 20.4 14.7602 19.9192 14.7602 19.326V9.47402ZM18.6001 12.234C18.6001 11.6409 19.087 11.16 19.6801 11.16C20.2733 11.16 20.7601 11.6409 20.7601 12.234V16.566C20.7601 17.1592 20.2733 17.64 19.6801 17.64C19.087 17.64 18.6001 17.1592 18.6001 16.566V12.234ZM10.9202 12.234C10.9202 11.6409 11.4071 11.16 12.0002 11.16C12.5934 11.16 13.0802 11.6409 13.0802 12.234V16.566C13.0802 17.1592 12.5934 17.64 12.0002 17.64C11.4071 17.64 10.9202 17.1592 10.9202 16.566V12.234ZM7.07977 13.794C7.07977 13.2008 7.56663 12.72 8.15977 12.72C8.75292 12.72 9.23977 13.2008 9.23977 13.794V15.006C9.23977 15.5991 8.75292 16.08 8.15977 16.08C7.56663 16.08 7.07977 15.5991 7.07977 15.006V13.794ZM3.23977 13.794C3.23977 13.2008 3.72663 12.72 4.31977 12.72C4.91293 12.72 5.39977 13.2008 5.39977 13.794V15.006C5.39977 15.5991 4.91293 16.08 4.31977 16.08C3.72663 16.08 3.23977 15.5991 3.23977 15.006V13.794Z",
				fill: "currentColor"
			})] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [
				/* @__PURE__ */ N("path", {
					fillRule: "evenodd",
					clipRule: "evenodd",
					d: "M1.68702 1.68706C0.0504242 3.32367 0.00146352 5.92788 0 11.0399C4.58111 11.0398 7.44133 9.07308 9.95022 7.34789C11.9102 6.00017 13.6558 4.79986 15.84 4.79986C19.0909 4.79986 21.9294 7.09843 23.4345 8.31725C23.6467 8.48911 23.8324 8.63952 23.9891 8.75897C23.9416 5.11426 23.6859 3.06012 22.3129 1.68706C20.6258 8.01086e-07 17.9105 5.58682e-07 12.4799 8.39257e-08L11.5199 0C6.08937 1.3563e-06 3.37408 1.14441e-06 1.68702 1.68706ZM10.8144 23.9999C11.0443 24 11.2795 24 11.52 24H12.4799C12.7204 24 12.9555 24 13.1855 23.9999H10.8144Z",
					fill: "#0077FF"
				}),
				/* @__PURE__ */ N("path", {
					fillRule: "evenodd",
					clipRule: "evenodd",
					d: "M4.58413e-05 11.0398C4.58116 11.0398 7.44139 9.07303 9.95027 7.34784C11.9103 6.00012 13.6558 4.7998 15.84 4.7998C19.0909 4.7998 21.9294 7.09838 23.4345 8.3172C23.6468 8.48906 23.8325 8.63947 23.9892 8.75892C24 9.59244 24 10.5092 24 11.5199V12.4799C24 17.9105 24 20.6258 22.3129 22.3129C20.7005 23.9253 18.149 23.9966 13.1854 23.9998H10.8146C5.85103 23.9966 3.29944 23.9253 1.68706 22.3129C-6.86646e-07 20.6258 -4.79488e-07 17.9105 5.11869e-10 12.4799L2.43699e-07 11.5199C2.43699e-07 11.3575 2.41252e-07 11.1975 4.58413e-05 11.0398Z",
					fill: "#F45FFF"
				}),
				/* @__PURE__ */ N("path", {
					d: "M18.6001 12.2339C18.6001 11.6408 19.0869 11.1599 19.6801 11.1599C20.2733 11.1599 20.7601 11.6408 20.7601 12.2339V16.5659C20.7601 17.159 20.2733 17.6399 19.6801 17.6399C19.0869 17.6399 18.6001 17.159 18.6001 16.5659V12.2339Z",
					fill: "white"
				}),
				/* @__PURE__ */ N("path", {
					d: "M14.7603 9.47415C14.7603 8.88099 15.2471 8.40015 15.8403 8.40015C16.4334 8.40015 16.9203 8.88099 16.9203 9.47415V19.3261C16.9203 19.9193 16.4334 20.4001 15.8403 20.4001C15.2471 20.4001 14.7603 19.9193 14.7603 19.3261V9.47415Z",
					fill: "white"
				}),
				/* @__PURE__ */ N("path", {
					d: "M10.9204 12.2339C10.9204 11.6408 11.4073 11.1599 12.0004 11.1599C12.5936 11.1599 13.0804 11.6408 13.0804 12.2339V16.5659C13.0804 17.159 12.5936 17.6399 12.0004 17.6399C11.4073 17.6399 10.9204 17.159 10.9204 16.5659V12.2339Z",
					fill: "white"
				}),
				/* @__PURE__ */ N("path", {
					d: "M7.07959 13.794C7.07959 13.2008 7.56645 12.72 8.15959 12.72C8.75275 12.72 9.23959 13.2008 9.23959 13.794V15.006C9.23959 15.5991 8.75275 16.08 8.15959 16.08C7.56645 16.08 7.07959 15.5991 7.07959 15.006V13.794Z",
					fill: "white"
				}),
				/* @__PURE__ */ N("path", {
					d: "M3.23975 13.794C3.23975 13.2008 3.72661 12.72 4.31975 12.72C4.91291 12.72 5.39975 13.2008 5.39975 13.794V15.006C5.39975 15.5991 4.91291 16.08 4.31975 16.08C3.72661 16.08 3.23975 15.5991 3.23975 15.006V13.794Z",
					fill: "white"
				})
			] })
		}
	},
	"vk-only-sign": {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ N(M, { children: /* @__PURE__ */ N("path", {
				d: "M13.0718 19.4856C4.87192 19.4856 0.19489 13.8641 0 4.51001H4.10744C4.24236 11.3757 7.2704 14.2839 9.66887 14.8835V4.51001H13.5366V10.4313C15.9051 10.1764 18.3932 7.47815 19.2327 4.51001H23.1004C22.4558 8.16773 19.7575 10.866 17.8387 11.9753C19.7575 12.8747 22.8307 15.2283 24 19.4856H19.7425C18.8281 16.6374 16.5497 14.4338 13.5366 14.1339V19.4856H13.0718Z",
				fill: "currentColor"
			}) })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("g", {
				clipPath: "url(#clip0_18168_41619)",
				children: /* @__PURE__ */ N("path", {
					d: "M13.0718 19.4856C4.87192 19.4856 0.19489 13.8641 0 4.51001H4.10744C4.24236 11.3757 7.2704 14.2839 9.66887 14.8835V4.51001H13.5366V10.4313C15.9051 10.1764 18.3932 7.47815 19.2327 4.51001H23.1004C22.4558 8.16773 19.7575 10.866 17.8387 11.9753C19.7575 12.8747 22.8307 15.2283 24 19.4856H19.7425C18.8281 16.6374 16.5497 14.4338 13.5366 14.1339V19.4856H13.0718Z",
					fill: "#0077FF"
				})
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41619",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		}
	},
	wantedly: { brand: {
		viewBox: "0 0 40 40",
		body: /* @__PURE__ */ P(M, { children: [
			/* @__PURE__ */ N("path", {
				d: "M19.9999 40C-6.66889 39.5287 -6.66465 0.467469 20.0008 0C46.6687 0.471303 46.6644 39.5325 19.9999 40Z",
				fill: "#A1B1B3"
			}),
			/* @__PURE__ */ N("path", {
				d: "M29.2699 18.4602C30.7777 18.4602 32 17.2379 32 15.7301C32 14.2223 30.7777 13 29.2699 13C27.7621 13 26.5398 14.2223 26.5398 15.7301C26.5398 17.2379 27.7621 18.4602 29.2699 18.4602Z",
				fill: "white"
			}),
			/* @__PURE__ */ N("path", {
				fillRule: "evenodd",
				clipRule: "evenodd",
				d: "M18.2047 23.5607C18.0428 23.4528 17.568 22.827 16.2839 19.7408C16.1975 19.5465 16.1328 19.3847 16.0573 19.2336L15.7983 18.5969L13.5322 13.1367H9L11.2661 18.5969L13.5322 24.0571L15.6256 29.1073C15.6688 29.2044 15.7767 29.2476 15.8738 29.2044C15.917 29.1828 15.9601 29.1504 15.9709 29.1073L18.2478 23.6579C18.2478 23.6363 18.237 23.5823 18.2047 23.5607Z",
				fill: "white"
			}),
			/* @__PURE__ */ N("path", {
				fillRule: "evenodd",
				clipRule: "evenodd",
				d: "M26.6858 23.5607C26.5239 23.4528 26.0491 22.827 24.765 19.7408C24.6787 19.5465 24.6139 19.3847 24.5384 19.2336L24.2794 18.5969L22.0133 13.1367H17.4919L19.758 18.5969L22.0241 24.0571L24.1068 29.1073C24.1499 29.2044 24.2578 29.2476 24.355 29.2044C24.3981 29.1828 24.4413 29.1504 24.4521 29.1073L26.729 23.6579C26.729 23.6363 26.7182 23.5823 26.6858 23.5607Z",
				fill: "white"
			})
		] })
	} },
	wechat: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("path", {
				d: "M16.4999 7.51604C16.9545 7.51604 17.3984 7.55382 17.8364 7.60782C17.0446 4.13036 13.3921 1.5 9.00014 1.5C4.02899 1.5 0 4.86737 0 9.02007C0 11.4143 1.34708 13.5384 3.4365 14.9129L2.24996 17.2923L5.4823 15.904C6.17544 16.1509 6.8957 16.3541 7.66501 16.4487C7.55988 15.9898 7.50014 15.5193 7.50014 15.0365C7.50014 10.8897 11.5364 7.51604 16.4999 7.51604ZM12.0002 4.88381C12.6213 4.88381 13.125 5.38911 13.125 6.01197C13.125 6.63503 12.6213 7.13997 12.0002 7.13997C11.3787 7.13997 10.8751 6.63503 10.8751 6.01197C10.8751 5.38906 11.3787 4.88381 12.0002 4.88381ZM6.00003 7.13997C5.37879 7.13997 4.87505 6.63503 4.87505 6.01197C4.87505 5.38911 5.37884 4.88381 6.00003 4.88381C6.62121 4.88381 7.12506 5.38911 7.12506 6.01197C7.125 6.63503 6.62116 7.13997 6.00003 7.13997Z",
				fill: "currentColor"
			}), /* @__PURE__ */ N("path", {
				d: "M24 15.0364C24 11.7137 20.6412 9.02007 16.4999 9.02007C12.3584 9.02007 9.00014 11.7137 9.00014 15.0364C9.00014 18.3588 12.3584 21.0525 16.4999 21.0525C17.181 21.0525 17.8288 20.9562 18.4574 20.8195L22.5 22.5564L21.1019 19.7546C22.854 18.6534 24 16.9601 24 15.0364ZM14.25 14.6603C13.6288 14.6603 13.125 14.1552 13.125 13.532C13.125 12.9092 13.6288 12.4042 14.25 12.4042C14.8714 12.4042 15.3749 12.9094 15.3749 13.532C15.3749 14.1553 14.8713 14.6603 14.25 14.6603ZM18.7499 14.6603C18.1284 14.6603 17.625 14.1552 17.625 13.532C17.625 12.9092 18.1284 12.4042 18.7499 12.4042C19.3714 12.4042 19.875 12.9094 19.875 13.532C19.875 14.1553 19.3714 14.6603 18.7499 14.6603Z",
				fill: "currentColor"
			})] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("path", {
				d: "M16.4999 7.51604C16.9545 7.51604 17.3984 7.55382 17.8364 7.60782C17.0446 4.13036 13.3921 1.5 9.00014 1.5C4.02899 1.5 0 4.86737 0 9.02007C0 11.4143 1.34708 13.5384 3.4365 14.9129L2.24996 17.2923L5.4823 15.904C6.17544 16.1509 6.8957 16.3541 7.66501 16.4487C7.55988 15.9898 7.50014 15.5193 7.50014 15.0365C7.50014 10.8897 11.5364 7.51604 16.4999 7.51604ZM12.0002 4.88381C12.6213 4.88381 13.125 5.38911 13.125 6.01197C13.125 6.63503 12.6213 7.13997 12.0002 7.13997C11.3787 7.13997 10.8751 6.63503 10.8751 6.01197C10.8751 5.38906 11.3787 4.88381 12.0002 4.88381ZM6.00003 7.13997C5.37879 7.13997 4.87505 6.63503 4.87505 6.01197C4.87505 5.38911 5.37884 4.88381 6.00003 4.88381C6.62121 4.88381 7.12506 5.38911 7.12506 6.01197C7.125 6.63503 6.62116 7.13997 6.00003 7.13997Z",
				fill: "#51C332"
			}), /* @__PURE__ */ N("path", {
				d: "M24 15.0364C24 11.7137 20.6412 9.02007 16.4999 9.02007C12.3584 9.02007 9.00014 11.7137 9.00014 15.0364C9.00014 18.3588 12.3584 21.0525 16.4999 21.0525C17.181 21.0525 17.8288 20.9562 18.4574 20.8195L22.5 22.5564L21.1019 19.7546C22.854 18.6534 24 16.9601 24 15.0364ZM14.25 14.6603C13.6288 14.6603 13.125 14.1552 13.125 13.532C13.125 12.9092 13.6288 12.4042 14.25 12.4042C14.8714 12.4042 15.3749 12.9094 15.3749 13.532C15.3749 14.1553 14.8713 14.6603 14.25 14.6603ZM18.7499 14.6603C18.1284 14.6603 17.625 14.1552 17.625 13.532C17.625 12.9092 18.1284 12.4042 18.7499 12.4042C19.3714 12.4042 19.875 12.9094 19.875 13.532C19.875 14.1553 19.3714 14.6603 18.7499 14.6603Z",
				fill: "#51C332"
			})] })
		}
	},
	whatsapp: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ N(M, { children: /* @__PURE__ */ N("path", {
				d: "M0 24L1.687 17.837C0.646 16.033 0.099 13.988 0.1 11.891C0.103 5.335 5.438 0 11.993 0C15.174 0.001 18.16 1.24 20.406 3.488C22.651 5.736 23.887 8.724 23.886 11.902C23.883 18.459 18.548 23.794 11.993 23.794C10.003 23.793 8.042 23.294 6.305 22.346L0 24ZM6.597 20.193C8.273 21.188 9.873 21.784 11.989 21.785C17.437 21.785 21.875 17.351 21.878 11.9C21.88 6.438 17.463 2.01 11.997 2.008C6.545 2.008 2.11 6.442 2.108 11.892C2.107 14.117 2.759 15.783 3.854 17.526L2.855 21.174L6.597 20.193ZM17.984 14.729C17.91 14.605 17.712 14.531 17.414 14.382C17.117 14.233 15.656 13.514 15.383 13.415C15.111 13.316 14.913 13.266 14.714 13.564C14.516 13.861 13.946 14.531 13.773 14.729C13.6 14.927 13.426 14.952 13.129 14.803C12.832 14.654 11.874 14.341 10.739 13.328C9.856 12.54 9.259 11.567 9.086 11.269C8.913 10.972 9.068 10.811 9.216 10.663C9.35 10.53 9.513 10.316 9.662 10.142C9.813 9.97 9.862 9.846 9.962 9.647C10.061 9.449 10.012 9.275 9.937 9.126C9.862 8.978 9.268 7.515 9.021 6.92C8.779 6.341 8.534 6.419 8.352 6.41L7.782 6.4C7.584 6.4 7.262 6.474 6.99 6.772C6.718 7.07 5.95 7.788 5.95 9.251C5.95 10.714 7.015 12.127 7.163 12.325C7.312 12.523 9.258 15.525 12.239 16.812C12.948 17.118 13.502 17.301 13.933 17.438C14.645 17.664 15.293 17.632 15.805 17.556C16.376 17.471 17.563 16.837 17.811 16.143C18.059 15.448 18.059 14.853 17.984 14.729Z",
				fill: "currentColor"
			}) })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ N(M, { children: /* @__PURE__ */ N("path", {
				d: "M0 24L1.687 17.837C0.646 16.033 0.099 13.988 0.1 11.891C0.103 5.335 5.438 0 11.993 0C15.174 0.001 18.16 1.24 20.406 3.488C22.651 5.736 23.887 8.724 23.886 11.902C23.883 18.459 18.548 23.794 11.993 23.794C10.003 23.793 8.042 23.294 6.305 22.346L0 24ZM6.597 20.193C8.273 21.188 9.873 21.784 11.989 21.785C17.437 21.785 21.875 17.351 21.878 11.9C21.88 6.438 17.463 2.01 11.997 2.008C6.545 2.008 2.11 6.442 2.108 11.892C2.107 14.117 2.759 15.783 3.854 17.526L2.855 21.174L6.597 20.193ZM17.984 14.729C17.91 14.605 17.712 14.531 17.414 14.382C17.117 14.233 15.656 13.514 15.383 13.415C15.111 13.316 14.913 13.266 14.714 13.564C14.516 13.861 13.946 14.531 13.773 14.729C13.6 14.927 13.426 14.952 13.129 14.803C12.832 14.654 11.874 14.341 10.739 13.328C9.856 12.54 9.259 11.567 9.086 11.269C8.913 10.972 9.068 10.811 9.216 10.663C9.35 10.53 9.513 10.316 9.662 10.142C9.813 9.97 9.862 9.846 9.962 9.647C10.061 9.449 10.012 9.275 9.937 9.126C9.862 8.978 9.268 7.515 9.021 6.92C8.779 6.341 8.534 6.419 8.352 6.41L7.782 6.4C7.584 6.4 7.262 6.474 6.99 6.772C6.718 7.07 5.95 7.788 5.95 9.251C5.95 10.714 7.015 12.127 7.163 12.325C7.312 12.523 9.258 15.525 12.239 16.812C12.948 17.118 13.502 17.301 13.933 17.438C14.645 17.664 15.293 17.632 15.805 17.556C16.376 17.471 17.563 16.837 17.811 16.143C18.059 15.448 18.059 14.853 17.984 14.729Z",
				fill: "#25D366"
			}) })
		}
	},
	"x-ex-twitter": {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ N(M, { children: /* @__PURE__ */ N("path", {
				d: "M18.3263 1.90381H21.6998L14.3297 10.3273L23 21.7898H16.2112L10.894 14.8378L4.80995 21.7898H1.43443L9.31743 12.7799L1 1.90381H7.96111L12.7674 8.25814L18.3263 1.90381ZM17.1423 19.7706H19.0116L6.94539 3.81694H4.93946L17.1423 19.7706Z",
				fill: "currentColor"
			}) })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ N(M, { children: /* @__PURE__ */ N("path", {
				d: "M18.3263 1.90381H21.6998L14.3297 10.3273L23 21.7898H16.2112L10.894 14.8378L4.80995 21.7898H1.43443L9.31743 12.7799L1 1.90381H7.96111L12.7674 8.25814L18.3263 1.90381ZM17.1423 19.7706H19.0116L6.94539 3.81694H4.93946L17.1423 19.7706Z",
				fill: "black"
			}) })
		}
	},
	xing: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ P("g", {
				clipPath: "url(#clip0_18168_41943)",
				children: [/* @__PURE__ */ N("path", {
					d: "M17.5393 0.659247C17.725 0.325695 17.9492 0 18.466 0H21.9628C22.1713 0 22.3349 0.0786725 22.423 0.221061C22.5143 0.368957 22.5119 0.564056 22.416 0.755219L14.7521 14.3058C14.7474 14.3128 14.7474 14.3215 14.7521 14.3286L19.6319 23.244C19.7287 23.4359 19.731 23.631 19.639 23.7789C19.5509 23.9213 19.388 24 19.1796 24H15.7221C15.1919 24 14.9268 23.6476 14.7553 23.3408C14.7553 23.3408 9.84956 14.3412 9.83698 14.3176C10.0824 13.8833 17.5393 0.659247 17.5393 0.659247Z",
					fill: "currentColor"
				}), /* @__PURE__ */ N("path", {
					d: "M3.45187 4.95596C3.53998 4.81279 3.71541 4.73962 3.92388 4.73962H7.38526C7.91627 4.73962 8.17666 5.08183 8.34895 5.38863C8.34895 5.38863 10.7145 9.51555 10.7286 9.53836C10.5886 9.78538 6.99193 16.1465 6.99193 16.1465C6.81493 16.4659 6.56555 16.8151 6.04791 16.8151H2.58653C2.37806 16.8151 2.2223 16.7215 2.13419 16.5791C2.04293 16.4312 2.03821 16.2393 2.13419 16.0481L5.81191 9.55803C5.81584 9.55095 5.81584 9.54623 5.81191 9.53836L3.47154 5.48697C3.37478 5.29423 3.36062 5.10386 3.45187 4.95596Z",
					fill: "currentColor"
				})]
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41943",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("path", {
				d: "M3.92388 4.7395C3.71541 4.7395 3.53998 4.81266 3.45187 4.95584C3.36062 5.10373 3.37478 5.29411 3.47154 5.48685L5.81191 9.53824C5.81584 9.54611 5.81584 9.55083 5.81191 9.55791L2.13419 16.048C2.03821 16.2392 2.04293 16.4311 2.13419 16.579C2.2223 16.7214 2.37806 16.815 2.58653 16.815H6.04791C6.56555 16.815 6.81493 16.4657 6.99193 16.1463C6.99193 16.1463 10.5886 9.78526 10.7286 9.53824C10.7145 9.51543 8.34895 5.38851 8.34895 5.38851C8.17666 5.08171 7.91627 4.7395 7.38526 4.7395H3.92388Z",
				fill: "#005A5F"
			}), /* @__PURE__ */ N("path", {
				d: "M18.466 0C17.9491 0 17.7249 0.325695 17.5393 0.659247C17.5393 0.659247 10.0824 13.8833 9.83691 14.3176C9.8495 14.3412 14.7552 23.3408 14.7552 23.3408C14.9267 23.6476 15.1918 24 15.722 24H19.1795C19.388 24 19.5508 23.9213 19.6389 23.7789C19.731 23.631 19.7286 23.4359 19.6318 23.244L14.7521 14.3286C14.7474 14.3215 14.7474 14.3128 14.7521 14.3058L22.4159 0.755219C22.5119 0.564056 22.5142 0.368957 22.423 0.221061C22.3349 0.0786725 22.1712 0 21.9628 0H18.466Z",
				fill: "#D4D600"
			})] })
		}
	},
	"yandex-music": {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ P("g", {
				clipPath: "url(#clip0_18168_41861)",
				children: [/* @__PURE__ */ N("path", {
					d: "M10.9705 0.157471C8.79549 0.353996 6.70864 1.1449 4.94298 2.45323C2.88846 3.9756 1.3776 6.11795 0.633238 8.56429C-0.111126 11.0106 -0.0495843 13.6314 0.808786 16.0401C1.66715 18.4488 3.27691 20.5179 5.40061 21.942C7.52432 23.3663 10.0495 24.0703 12.6038 23.9503C15.158 23.8303 17.606 22.8926 19.5868 21.2756C21.5676 19.6584 22.9762 17.4475 23.605 14.969C24.194 12.6471 24.0693 10.2056 23.2535 7.96145L23.2555 7.98104L20.2332 10.4107C20.4737 11.6223 20.4437 12.8789 20.1367 14.0891C19.6965 15.8241 18.7105 17.3717 17.324 18.5038C15.9374 19.6357 14.2238 20.2922 12.4358 20.3762C10.6478 20.4602 8.8802 19.9674 7.39361 18.9704C5.90701 17.9735 4.78018 16.525 4.17933 14.8389C3.57847 13.1529 3.53539 11.3183 4.05645 9.60589C4.57749 7.89345 5.63511 6.39382 7.07326 5.32816C8.22181 4.47709 9.56453 3.9388 10.9705 3.75654V0.157471Z",
					fill: "currentColor"
				}), /* @__PURE__ */ N("path", {
					d: "M20.9893 4.16475L20.9767 4.13304C19.2677 2.20304 16.9429 0.830921 14.3101 0.324515V8.67326C13.6631 8.23649 12.8833 7.98147 12.0439 7.98147C9.80424 7.98147 7.98865 9.79707 7.98865 12.0367C7.98865 14.2764 9.80424 16.092 12.0439 16.092C14.2836 16.092 16.0991 14.2764 16.0991 12.0367V4.73693C17.251 5.37816 18.2351 6.2841 18.9697 7.37249L20.9893 4.16475Z",
					fill: "currentColor"
				})]
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41861",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ P("g", {
				clipPath: "url(#clip0_18168_41651)",
				children: [/* @__PURE__ */ N("path", {
					d: "M4.94298 2.45323C6.70864 1.1449 8.79549 0.353996 10.9705 0.157471V3.75654C9.56453 3.9388 8.22181 4.47709 7.07326 5.32816C5.63511 6.39382 4.57749 7.89345 4.05645 9.60589C3.53539 11.3183 3.57847 13.1529 4.17933 14.8389C4.78018 16.525 5.90701 17.9735 7.39361 18.9704C8.8802 19.9674 10.6478 20.4602 12.4358 20.3762C14.2238 20.2922 15.9374 19.6357 17.324 18.5038C18.7105 17.3717 19.6965 15.8241 20.1367 14.0891C20.4437 12.8789 20.4737 11.6223 20.2332 10.4107L23.2555 7.98104L23.2535 7.96145C24.0693 10.2056 24.194 12.6471 23.605 14.969C22.9762 17.4475 21.5676 19.6584 19.5868 21.2756C17.606 22.8926 15.158 23.8303 12.6038 23.9503C10.0495 24.0703 7.52432 23.3663 5.40061 21.942C3.27691 20.5179 1.66715 18.4488 0.808786 16.0401C-0.0495843 13.6314 -0.111126 11.0106 0.633238 8.56429C1.3776 6.11795 2.88846 3.9756 4.94298 2.45323Z",
					fill: "#FCCA00"
				}), /* @__PURE__ */ N("path", {
					d: "M20.9768 4.13299L20.9894 4.1647L18.9698 7.37244C18.2353 6.28405 17.2511 5.37811 16.0993 4.73687V12.0367C16.0993 14.2763 14.2837 16.092 12.044 16.092C9.80436 16.092 7.98877 14.2763 7.98877 12.0367C7.98877 9.79702 9.80436 7.98141 12.044 7.98141C12.8834 7.98141 13.6632 8.23644 14.3102 8.67321V0.324463C16.943 0.830869 19.2678 2.20298 20.9768 4.13299Z",
					fill: "#FC3F1D"
				})]
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41651",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		}
	},
	yelp: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("g", {
				clipPath: "url(#clip0_18168_41947)",
				children: /* @__PURE__ */ N("path", {
					d: "M8.4 15.1429L9.52603 14.8872C9.54954 14.8819 9.58934 14.873 9.63637 14.8579C9.94739 14.7761 10.2139 14.5789 10.3797 14.308C10.5456 14.0371 10.5978 13.7136 10.5254 13.4057L10.5209 13.3861C10.4837 13.2386 10.4187 13.0992 10.3292 12.9751C10.2031 12.8181 10.047 12.6866 9.86971 12.5881C9.66096 12.4714 9.44251 12.3722 9.21671 12.2916L7.98215 11.8487C7.28935 11.5957 6.59655 11.3498 5.89651 11.1092C5.44339 10.9512 5.059 10.8118 4.72526 10.7098C4.66174 10.6925 4.59871 10.6736 4.53624 10.6529C4.13286 10.5322 3.84886 10.4816 3.60918 10.4798C3.44899 10.474 3.28943 10.5025 3.14159 10.5633C2.98713 10.6289 2.84846 10.7257 2.73459 10.8473C2.6781 10.9103 2.62496 10.9761 2.57541 11.0444C2.47905 11.1897 2.39957 11.3451 2.33845 11.5078C2.10908 12.1727 1.99474 12.8706 2.00019 13.5726C2.00471 14.2064 2.02189 15.0204 2.37734 15.5725C2.46326 15.7146 2.57812 15.8371 2.71469 15.932C2.96794 16.1034 3.22299 16.1264 3.4898 16.1451C3.88775 16.1726 4.27214 16.0776 4.65653 15.9897L8.39729 15.142L8.4 15.1429ZM20.9627 9.27613C20.6553 8.64289 20.242 8.06469 19.7399 7.56555C19.675 7.50206 19.6055 7.44332 19.5318 7.38978C19.4638 7.33972 19.3932 7.2932 19.3202 7.25042C19.2451 7.21001 19.1678 7.17356 19.0887 7.14123C18.9325 7.08097 18.7652 7.05375 18.5976 7.06134C18.4375 7.07021 18.281 7.1146 18.139 7.18828C17.9247 7.29302 17.6922 7.46169 17.3829 7.74308C17.3404 7.78481 17.287 7.83185 17.2382 7.87624C16.984 8.11148 16.7 8.40175 16.3627 8.73908C15.8408 9.2566 15.328 9.77679 14.817 10.3014L13.9035 11.2317C13.7367 11.4014 13.5848 11.5846 13.4495 11.7794C13.3336 11.9443 13.2516 12.1297 13.208 12.3254C13.1835 12.4757 13.1872 12.6291 13.2189 12.7781L13.2234 12.7976C13.2956 13.1052 13.4866 13.3734 13.7561 13.5456C14.0257 13.7178 14.3528 13.7806 14.6687 13.7208C14.7067 13.7155 14.7444 13.7084 14.7817 13.6995L19.6494 12.5952C20.0338 12.5082 20.4227 12.4283 20.7673 12.2313C20.9988 12.1008 21.2186 11.9703 21.3697 11.7075C21.4501 11.5628 21.4988 11.4031 21.5126 11.2388C21.5876 10.5873 21.2412 9.8478 20.9627 9.27613ZM12.2484 11.285C12.6011 10.85 12.6011 10.202 12.6319 9.67115C12.7386 7.90021 12.8498 6.12926 12.9394 4.35742C12.9729 3.68633 13.0461 3.02411 13.0054 2.34769C12.9719 1.79022 12.9683 1.1493 12.6093 0.691255C11.9762 -0.116545 10.6249 -0.0499676 9.7033 0.0760848C9.41899 0.114629 9.13678 0.166769 8.85765 0.232318C8.57727 0.298008 8.29871 0.369911 8.02737 0.456017C7.14283 0.740079 5.89922 1.26204 5.68939 2.26247C5.57001 2.82793 5.8522 3.40582 6.06926 3.92246C6.33426 4.54739 6.69513 5.11108 7.02435 5.69962C7.89532 7.25397 8.78167 8.79944 9.66531 10.3458C9.93031 10.8074 10.217 11.3915 10.728 11.6312C10.7624 11.6454 10.7968 11.6578 10.832 11.6693C11.0609 11.7546 11.3114 11.7705 11.5493 11.7164L11.5918 11.7075C11.8125 11.648 12.0114 11.53 12.1679 11.3675C12.1968 11.3409 12.2222 11.3143 12.2484 11.285ZM11.826 16.0261C11.6884 15.8361 11.493 15.6936 11.2678 15.6192C11.0426 15.5447 10.7993 15.542 10.5725 15.6116C10.5191 15.6288 10.4671 15.6499 10.4169 15.6746C10.3392 15.7135 10.265 15.759 10.1953 15.8104C9.99621 15.9644 9.81835 16.1432 9.66622 16.3422C9.62732 16.391 9.59115 16.4558 9.54411 16.4984L8.76087 17.5547C8.3177 18.1477 7.87904 18.7416 7.44582 19.3443C7.16182 19.734 6.91762 20.0634 6.72317 20.3536C6.68699 20.4087 6.64901 20.469 6.61464 20.5188C6.3822 20.8703 6.25105 21.1277 6.18322 21.3567C6.13255 21.5089 6.11649 21.6701 6.13619 21.829C6.15789 21.9941 6.21487 22.153 6.30261 22.2959C6.34964 22.3669 6.40028 22.4362 6.45455 22.5027C6.57176 22.6352 6.70373 22.7543 6.84798 22.8578C7.38884 23.2271 7.98034 23.4925 8.6026 23.6976C9.12084 23.8662 9.65898 23.9674 10.2035 23.9976C10.2966 24.0021 10.3898 24.0003 10.482 23.9923C10.5676 23.9844 10.6527 23.9726 10.7371 23.9568C10.8215 23.9375 10.9048 23.9138 10.9867 23.8858C11.1458 23.8272 11.2907 23.7365 11.4118 23.6195C11.5266 23.5067 11.6153 23.3709 11.6705 23.2209C11.7609 22.999 11.8206 22.7185 11.8604 22.3012C11.8631 22.2418 11.8721 22.1707 11.8785 22.1059C11.9092 21.7597 11.9237 21.3514 11.9454 20.8738C11.9843 20.1379 12.0141 19.4056 12.0377 18.6715L12.0883 17.3648C12.1001 17.0647 12.0901 16.731 12.0051 16.4318C11.9677 16.2881 11.9073 16.1512 11.826 16.0261ZM20.6651 18.0705C20.5023 17.8938 20.2708 17.719 19.9054 17.5024C19.8529 17.4731 19.7905 17.4349 19.7335 17.4012C19.4296 17.221 19.0633 17.0328 18.6355 16.8046C17.978 16.4496 17.3205 16.1051 16.6557 15.7625L15.4827 15.1518C15.4221 15.134 15.3606 15.0914 15.3027 15.0639C15.0771 14.9508 14.8376 14.867 14.59 14.8144C14.5047 14.7983 14.4182 14.7894 14.3313 14.7878C14.2751 14.7875 14.2189 14.7908 14.1631 14.7976C13.9283 14.8332 13.7109 14.9406 13.542 15.1047C13.373 15.2687 13.2612 15.4809 13.2225 15.711C13.2053 15.8575 13.2107 16.0057 13.2397 16.1495C13.2966 16.4567 13.4359 16.7594 13.5806 17.0248L14.2065 18.1779C14.5556 18.8277 14.9083 19.4739 15.2701 20.1184C15.5035 20.5383 15.6979 20.8978 15.8797 21.1961C15.9141 21.252 15.953 21.3123 15.9828 21.3647C16.2044 21.7225 16.3817 21.9479 16.5617 22.1104C16.6815 22.2236 16.8255 22.3093 16.9831 22.3615C17.1407 22.4137 17.3081 22.431 17.4733 22.4122C17.5594 22.4019 17.6448 22.3871 17.7293 22.3678C17.9023 22.3224 18.0695 22.2577 18.2276 22.1752C18.7037 21.9133 19.1425 21.5909 19.5328 21.2165C20.0013 20.7638 20.4155 20.2702 20.7375 19.7056C20.7827 19.6257 20.8207 19.5432 20.8532 19.4571C20.8835 19.3782 20.9098 19.2979 20.9319 19.2165C20.9509 19.1331 20.9654 19.0496 20.9753 18.9653C20.9916 18.7995 20.9721 18.6323 20.9184 18.4744C20.8653 18.3229 20.7788 18.1855 20.6651 18.0705Z",
					fill: "currentColor"
				})
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41947",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ N(M, { children: /* @__PURE__ */ N("path", {
				d: "M8.4 15.1429L9.52603 14.8872C9.54954 14.8819 9.58934 14.873 9.63637 14.8579C9.94739 14.7761 10.2139 14.5789 10.3797 14.308C10.5456 14.0371 10.5978 13.7136 10.5254 13.4057L10.5209 13.3861C10.4837 13.2386 10.4187 13.0992 10.3292 12.9751C10.2031 12.8181 10.047 12.6866 9.86971 12.5881C9.66096 12.4714 9.44251 12.3722 9.21671 12.2916L7.98215 11.8487C7.28935 11.5957 6.59655 11.3498 5.89651 11.1092C5.44339 10.9512 5.059 10.8118 4.72526 10.7098C4.66174 10.6925 4.59871 10.6736 4.53624 10.6529C4.13286 10.5322 3.84886 10.4816 3.60918 10.4798C3.44899 10.474 3.28943 10.5025 3.14159 10.5633C2.98713 10.6289 2.84846 10.7257 2.73459 10.8473C2.6781 10.9103 2.62496 10.9761 2.57541 11.0444C2.47905 11.1897 2.39957 11.3451 2.33845 11.5078C2.10908 12.1727 1.99474 12.8706 2.00019 13.5726C2.00471 14.2064 2.02189 15.0204 2.37734 15.5725C2.46326 15.7146 2.57812 15.8371 2.71469 15.932C2.96794 16.1034 3.22299 16.1264 3.4898 16.1451C3.88775 16.1726 4.27214 16.0776 4.65653 15.9897L8.39729 15.142L8.4 15.1429ZM20.9627 9.27613C20.6553 8.64289 20.242 8.06469 19.7399 7.56555C19.675 7.50206 19.6055 7.44332 19.5318 7.38978C19.4638 7.33972 19.3932 7.2932 19.3202 7.25042C19.2451 7.21001 19.1678 7.17356 19.0887 7.14123C18.9325 7.08097 18.7652 7.05375 18.5976 7.06134C18.4375 7.07021 18.281 7.1146 18.139 7.18828C17.9247 7.29302 17.6922 7.46169 17.3829 7.74308C17.3404 7.78481 17.287 7.83185 17.2382 7.87624C16.984 8.11148 16.7 8.40175 16.3627 8.73908C15.8408 9.2566 15.328 9.77679 14.817 10.3014L13.9035 11.2317C13.7367 11.4014 13.5848 11.5846 13.4495 11.7794C13.3336 11.9443 13.2516 12.1297 13.208 12.3254C13.1835 12.4757 13.1872 12.6291 13.2189 12.7781L13.2234 12.7976C13.2956 13.1052 13.4866 13.3734 13.7561 13.5456C14.0257 13.7178 14.3528 13.7806 14.6687 13.7208C14.7067 13.7155 14.7444 13.7084 14.7817 13.6995L19.6494 12.5952C20.0338 12.5082 20.4227 12.4283 20.7673 12.2313C20.9988 12.1008 21.2186 11.9703 21.3697 11.7075C21.4501 11.5628 21.4988 11.4031 21.5126 11.2388C21.5876 10.5873 21.2412 9.8478 20.9627 9.27613ZM12.2484 11.285C12.6011 10.85 12.6011 10.202 12.6319 9.67115C12.7386 7.90021 12.8498 6.12926 12.9394 4.35742C12.9729 3.68633 13.0461 3.02411 13.0054 2.34769C12.9719 1.79022 12.9683 1.1493 12.6093 0.691255C11.9762 -0.116545 10.6249 -0.0499676 9.7033 0.0760848C9.41899 0.114629 9.13678 0.166769 8.85765 0.232318C8.57727 0.298008 8.29871 0.369911 8.02737 0.456017C7.14283 0.740079 5.89922 1.26204 5.68939 2.26247C5.57001 2.82793 5.8522 3.40582 6.06926 3.92246C6.33426 4.54739 6.69513 5.11108 7.02435 5.69962C7.89532 7.25397 8.78167 8.79944 9.66531 10.3458C9.93031 10.8074 10.217 11.3915 10.728 11.6312C10.7624 11.6454 10.7968 11.6578 10.832 11.6693C11.0609 11.7546 11.3114 11.7705 11.5493 11.7164L11.5918 11.7075C11.8125 11.648 12.0114 11.53 12.1679 11.3675C12.1968 11.3409 12.2222 11.3143 12.2484 11.285ZM11.826 16.0261C11.6884 15.8361 11.493 15.6936 11.2678 15.6192C11.0426 15.5447 10.7993 15.542 10.5725 15.6116C10.5191 15.6288 10.4671 15.6499 10.4169 15.6746C10.3392 15.7135 10.265 15.759 10.1953 15.8104C9.99621 15.9644 9.81835 16.1432 9.66622 16.3422C9.62732 16.391 9.59115 16.4558 9.54411 16.4984L8.76087 17.5547C8.3177 18.1477 7.87904 18.7416 7.44582 19.3443C7.16182 19.734 6.91762 20.0634 6.72317 20.3536C6.68699 20.4087 6.64901 20.469 6.61464 20.5188C6.3822 20.8703 6.25105 21.1277 6.18322 21.3567C6.13255 21.5089 6.11649 21.6701 6.13619 21.829C6.15789 21.9941 6.21487 22.153 6.30261 22.2959C6.34964 22.3669 6.40028 22.4362 6.45455 22.5027C6.57176 22.6352 6.70373 22.7543 6.84798 22.8578C7.38884 23.2271 7.98034 23.4925 8.6026 23.6976C9.12084 23.8662 9.65898 23.9674 10.2035 23.9976C10.2966 24.0021 10.3898 24.0003 10.482 23.9923C10.5676 23.9844 10.6527 23.9726 10.7371 23.9568C10.8215 23.9375 10.9048 23.9138 10.9867 23.8858C11.1458 23.8272 11.2907 23.7365 11.4118 23.6195C11.5266 23.5067 11.6153 23.3709 11.6705 23.2209C11.7609 22.999 11.8206 22.7185 11.8604 22.3012C11.8631 22.2418 11.8721 22.1707 11.8785 22.1059C11.9092 21.7597 11.9237 21.3514 11.9454 20.8738C11.9843 20.1379 12.0141 19.4056 12.0377 18.6715L12.0883 17.3648C12.1001 17.0647 12.0901 16.731 12.0051 16.4318C11.9677 16.2881 11.9073 16.1512 11.826 16.0261ZM20.6651 18.0705C20.5023 17.8938 20.2708 17.719 19.9054 17.5024C19.8529 17.4731 19.7905 17.4349 19.7335 17.4012C19.4296 17.221 19.0633 17.0328 18.6355 16.8046C17.978 16.4496 17.3205 16.1051 16.6557 15.7625L15.4827 15.1518C15.4221 15.134 15.3606 15.0914 15.3027 15.0639C15.0771 14.9508 14.8376 14.867 14.59 14.8144C14.5047 14.7983 14.4182 14.7894 14.3313 14.7878C14.2751 14.7875 14.2189 14.7908 14.1631 14.7976C13.9283 14.8332 13.7109 14.9406 13.542 15.1047C13.373 15.2687 13.2612 15.4809 13.2225 15.711C13.2053 15.8575 13.2107 16.0057 13.2397 16.1495C13.2966 16.4567 13.4359 16.7594 13.5806 17.0248L14.2065 18.1779C14.5556 18.8277 14.9083 19.4739 15.2701 20.1184C15.5035 20.5383 15.6979 20.8978 15.8797 21.1961C15.9141 21.252 15.953 21.3123 15.9828 21.3647C16.2044 21.7225 16.3817 21.9479 16.5617 22.1104C16.6815 22.2236 16.8255 22.3093 16.9831 22.3615C17.1407 22.4137 17.3081 22.431 17.4733 22.4122C17.5594 22.4019 17.6448 22.3871 17.7293 22.3678C17.9023 22.3224 18.0695 22.2577 18.2276 22.1752C18.7037 21.9133 19.1425 21.5909 19.5328 21.2165C20.0013 20.7638 20.4155 20.2702 20.7375 19.7056C20.7827 19.6257 20.8207 19.5432 20.8532 19.4571C20.8835 19.3782 20.9098 19.2979 20.9319 19.2165C20.9509 19.1331 20.9654 19.0496 20.9753 18.9653C20.9916 18.7995 20.9721 18.6323 20.9184 18.4744C20.8653 18.3229 20.7788 18.1855 20.6651 18.0705Z",
				fill: "#FF1A1A"
			}) })
		}
	},
	youtube: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("g", {
				clipPath: "url(#clip0_18168_41853)",
				children: /* @__PURE__ */ N("path", {
					fillRule: "evenodd",
					clipRule: "evenodd",
					d: "M22.7466 4.83407C23.119 5.20883 23.3864 5.67482 23.5221 6.18541C24.0239 8.06995 24.0239 12 24.0239 12C24.0239 12 24.0239 15.93 23.5221 17.8145C23.3864 18.3251 23.119 18.7911 22.7466 19.1658C22.3743 19.5406 21.91 19.811 21.4003 19.95C19.5239 20.4545 12.0239 20.4545 12.0239 20.4545C12.0239 20.4545 4.52393 20.4545 2.64756 19.95C2.13786 19.811 1.67358 19.5406 1.30121 19.1658C0.928842 18.7911 0.661431 18.3251 0.525744 17.8145C0.0239258 15.93 0.0239258 12 0.0239258 12C0.0239258 12 0.0239258 8.06995 0.525744 6.18541C0.661431 5.67482 0.928842 5.20883 1.30121 4.83407C1.67358 4.4593 2.13786 4.18891 2.64756 4.04996C4.52393 3.54541 12.0239 3.54541 12.0239 3.54541C12.0239 3.54541 19.5239 3.54541 21.4003 4.04996C21.91 4.18891 22.3743 4.4593 22.7466 4.83407ZM15.8421 12L9.5694 8.43135V15.5686L15.8421 12Z",
					fill: "currentColor"
				})
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41853",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ P("g", {
				clipPath: "url(#clip0_18168_41636)",
				children: [/* @__PURE__ */ N("path", {
					d: "M23.5221 6.18541C23.3864 5.67482 23.119 5.20883 22.7466 4.83407C22.3743 4.4593 21.91 4.18891 21.4003 4.04996C19.5239 3.54541 12.0239 3.54541 12.0239 3.54541C12.0239 3.54541 4.52393 3.54541 2.64756 4.04996C2.13786 4.18891 1.67358 4.4593 1.30121 4.83407C0.928842 5.20883 0.661431 5.67482 0.525744 6.18541C0.0239258 8.06996 0.0239258 12 0.0239258 12C0.0239258 12 0.0239258 15.93 0.525744 17.8145C0.661431 18.3251 0.928842 18.7911 1.30121 19.1658C1.67358 19.5406 2.13786 19.811 2.64756 19.95C4.52393 20.4545 12.0239 20.4545 12.0239 20.4545C12.0239 20.4545 19.5239 20.4545 21.4003 19.95C21.91 19.811 22.3743 19.5406 22.7466 19.1658C23.119 18.7911 23.3864 18.3251 23.5221 17.8145C24.0239 15.93 24.0239 12 24.0239 12C24.0239 12 24.0239 8.06996 23.5221 6.18541Z",
					fill: "#FF0302"
				}), /* @__PURE__ */ N("path", {
					d: "M9.56934 15.5687V8.4314L15.8421 12L9.56934 15.5687Z",
					fill: "#FEFEFE"
				})]
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41636",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		}
	},
	"youtube-music": {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ P("g", {
				clipPath: "url(#clip0_18168_41867)",
				children: [/* @__PURE__ */ N("path", {
					fillRule: "evenodd",
					clipRule: "evenodd",
					d: "M12 6.27273C15.15 6.27273 17.7273 8.83636 17.7273 12C17.7273 15.1636 15.1637 17.7273 12 17.7273C8.83639 17.7273 6.27275 15.1636 6.27275 12C6.27275 8.83636 8.85002 6.27273 12 6.27273ZM9.81818 15.1364L15.1364 11.8636L9.81818 8.86364V15.1364Z",
					fill: "currentColor"
				}), /* @__PURE__ */ N("path", {
					fillRule: "evenodd",
					clipRule: "evenodd",
					d: "M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM12 5.72727C8.53639 5.72727 5.72729 8.53636 5.72729 12C5.72729 15.4636 8.53639 18.2727 12 18.2727C15.4637 18.2727 18.2728 15.4636 18.2728 12C18.2728 8.53636 15.4637 5.72727 12 5.72727Z",
					fill: "currentColor"
				})]
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41867",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ P("g", {
				clipPath: "url(#clip0_18168_41664)",
				children: [
					/* @__PURE__ */ N("path", {
						d: "M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z",
						fill: "#FF0000"
					}),
					/* @__PURE__ */ N("path", {
						d: "M11.9998 6.27275C15.1498 6.27275 17.7271 8.83639 17.7271 12C17.7271 15.1637 15.1634 17.7273 11.9998 17.7273C8.83614 17.7273 6.27251 15.1637 6.27251 12C6.27251 8.83639 8.84978 6.27275 11.9998 6.27275ZM11.9998 5.72729C8.53614 5.72729 5.72705 8.53639 5.72705 12C5.72705 15.4637 8.53614 18.2727 11.9998 18.2727C15.4634 18.2727 18.2725 15.4637 18.2725 12C18.2725 8.53639 15.4634 5.72729 11.9998 5.72729Z",
						fill: "white"
					}),
					/* @__PURE__ */ N("path", {
						d: "M9.81836 15.1363L15.1365 11.8635L9.81836 8.86353V15.1363Z",
						fill: "white"
					})
				]
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41664",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		}
	},
	"youtube-shorts": {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ N(M, { children: /* @__PURE__ */ N("path", {
				fillRule: "evenodd",
				clipRule: "evenodd",
				d: "M14.7405 0.529285C17.0042 -0.650402 19.8069 0.208973 20.9983 2.44921C22.1897 4.68944 21.3206 7.46093 19.0569 8.64061L17.1956 9.61913C18.7991 9.67772 20.3284 10.5586 21.1292 12.0644C22.3206 14.3047 21.4534 17.0762 19.1878 18.2558L9.26201 23.4707C6.99834 24.6504 4.19561 23.791 3.00421 21.5508C1.8128 19.3105 2.68194 16.5391 4.94561 15.3594L6.80694 14.3808C5.20342 14.3223 3.67413 13.4414 2.87335 11.9355C1.68194 9.6953 2.55108 6.92382 4.81475 5.74413L14.7405 0.529285ZM9.38311 8.30663L15.3909 12.0156L9.38311 15.707V8.30663Z",
				fill: "currentColor"
			}) })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("path", {
				fillRule: "evenodd",
				clipRule: "evenodd",
				d: "M14.7405 0.529285C17.0042 -0.650402 19.8069 0.208973 20.9983 2.44921C22.1897 4.68944 21.3206 7.46093 19.0569 8.64061L17.1956 9.61913C18.7991 9.67772 20.3284 10.5586 21.1292 12.0644C22.3206 14.3047 21.4534 17.0762 19.1878 18.2558L9.26201 23.4707C6.99834 24.6504 4.19561 23.791 3.00421 21.5508C1.8128 19.3105 2.68194 16.5391 4.94561 15.3594L6.80694 14.3808C5.20342 14.3223 3.67413 13.4414 2.87335 11.9355C1.68194 9.6953 2.55108 6.92382 4.81475 5.74413L14.7405 0.529285ZM9.38311 8.30663L15.3909 12.0156L9.38311 15.707V8.30663Z",
				fill: "#F40407"
			}), /* @__PURE__ */ N("path", {
				fillRule: "evenodd",
				clipRule: "evenodd",
				d: "M9.38281 8.30664L15.3906 12.0156L9.38281 15.707V8.30664Z",
				fill: "white"
			})] })
		}
	},
	zoom: {
		mono: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("g", {
				clipPath: "url(#clip0_18168_41935)",
				children: /* @__PURE__ */ N("path", {
					fillRule: "evenodd",
					clipRule: "evenodd",
					d: "M23.6998 15.7684C23.8968 14.5415 24 13.2833 24 12C24 10.7168 23.8969 9.45848 23.6998 8.23157C23.0474 4.16989 19.8301 0.952561 15.7684 0.300215C14.5415 0.103157 13.2832 0 12 0C10.7168 0 9.45855 0.103157 8.23161 0.300215C4.16993 0.952561 0.952586 4.16989 0.300214 8.23158C0.103157 9.45848 0 10.7168 0 12C0 13.2833 0.103157 14.5415 0.300214 15.7684C0.952577 19.8301 4.16992 23.0475 8.23161 23.6998C9.45855 23.8969 10.7168 24 12 24C13.2832 24 14.5415 23.8969 15.7684 23.6998C19.8301 23.0475 23.0474 19.8301 23.6998 15.7684ZM13.2857 16.2857C13.9958 16.2857 14.5714 15.71 14.5714 15V10.2857C14.5714 8.86556 13.4202 7.71429 12 7.71429H6.42857C5.71848 7.71429 5.14285 8.28998 5.14285 9.00001V13.7143C5.14285 15.1345 6.29412 16.2857 7.71428 16.2857H13.2857ZM15.9428 9.89993L17.8286 8.48565C18.2524 8.1678 18.8571 8.4702 18.8571 8.99994V14.9999C18.8571 15.5297 18.2524 15.8321 17.8286 15.5142L15.9429 14.0999C15.6191 13.8571 15.4286 13.4761 15.4286 13.0714L15.4286 10.9285C15.4286 10.5238 15.6191 10.1428 15.9428 9.89993Z",
					fill: "currentColor"
				})
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41935",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		},
		brand: {
			viewBox: "0 0 24 24",
			body: /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ P("g", {
				clipPath: "url(#clip0_18168_41789)",
				children: [/* @__PURE__ */ N("path", {
					d: "M24 12C24 13.2833 23.8968 14.5415 23.6998 15.7684C23.0474 19.8301 19.8301 23.0475 15.7684 23.6998C14.5415 23.8969 13.2832 24 12 24C10.7168 24 9.45855 23.8969 8.23161 23.6998C4.16992 23.0475 0.952577 19.8301 0.300214 15.7684C0.103157 14.5415 0 13.2833 0 12C0 10.7168 0.103157 9.45848 0.300214 8.23158C0.952586 4.16989 4.16993 0.952561 8.23161 0.300215C9.45855 0.103157 10.7168 0 12 0C13.2832 0 14.5415 0.103157 15.7684 0.300215C19.8301 0.952561 23.0474 4.16989 23.6998 8.23157C23.8969 9.45848 24 10.7168 24 12Z",
					fill: "#0B5CFF"
				}), /* @__PURE__ */ N("path", {
					d: "M14.5716 15.0001C14.5716 15.7101 13.996 16.2858 13.2859 16.2858H7.71449C6.29433 16.2858 5.14307 15.1345 5.14307 13.7144V9.00007C5.14307 8.29004 5.7187 7.71436 6.42878 7.71436H12.0002C13.4204 7.71436 14.5716 8.86562 14.5716 10.2858V15.0001ZM17.8288 8.48571L15.9431 9.89999C15.6193 10.1428 15.4288 10.5239 15.4288 10.9286L15.4288 13.0715C15.4288 13.4761 15.6194 13.8572 15.9431 14.1L17.8288 15.5143C18.2526 15.8321 18.8574 15.5297 18.8574 15V9C18.8574 8.47026 18.2526 8.16786 17.8288 8.48571Z",
					fill: "white"
				})]
			}), /* @__PURE__ */ N("defs", { children: /* @__PURE__ */ N("clipPath", {
				id: "clip0_18168_41789",
				children: /* @__PURE__ */ N("rect", {
					width: "24",
					height: "24",
					fill: "white"
				})
			}) })] })
		}
	}
}, nu = /* @__PURE__ */ "amazon.android.apple.apple-music.apple-podcasts.artstation.baidu.behance.boosty.devianart.discord.dprofile.dribbble.dzen.facebook.figma.github.gmail.google.google-meet.google-play.google-podcast.imo.instagram.kickstarter.line.linkedin.medium.messenger.microsoft-teams.notion.ok.ok-only-sign.onlyfans.patreon.paypal.pinterest.product-hunt.qiita.quora.reddit.signal.sina-weibo.skype.slack.snapchat.soundcloud.spotify.stack-overflow.telegram.telegram-only-sign.threads.tiktok.tinder.tumblr.twitch.viber.vimeo.vk.vk-music.vk-only-sign.wantedly.wechat.whatsapp.x-ex-twitter.xing.yandex-music.yelp.youtube.youtube-music.youtube-shorts.zoom".split("."), ru = ["brand", "mono"];
function iu(e, t) {
	let n = tu[e];
	if (!n) return null;
	for (let e of [t, ...ru.filter((e) => e !== t)]) if (n[e]) return n[e];
	return null;
}
function au({ platform: e, tone: t = "brand", size: n = 24, className: r, ...i }) {
	let a = iu(e, t);
	return a ? /* @__PURE__ */ N("svg", {
		"data-slot": "social-icon",
		"data-platform": e,
		width: n,
		height: n,
		viewBox: a.viewBox,
		fill: "none",
		role: "img",
		className: U("inline-block shrink-0", r),
		...i,
		children: a.body
	}) : null;
}
//#endregion
//#region src/components/ui/social-login-button.tsx
var ou = {
	line: {
		label: "LINEでログイン",
		platform: "line",
		iconTone: "brand",
		className: "border-[var(--Brand-Line)] text-[var(--Text-High-Emphasis)] bg-[var(--Surface-Primary)] hover:bg-[var(--Surface-Success)]"
	},
	google: {
		label: "Googleでログイン",
		platform: "google",
		iconTone: "brand",
		className: "border-[var(--Brand-Google-Border)] text-[var(--Text-High-Emphasis)] bg-[var(--Surface-Primary)] hover:bg-[var(--Surface-Secondary)]"
	},
	apple: {
		label: "Appleでログイン",
		platform: "apple",
		iconTone: "mono",
		className: "border-[var(--Brand-Apple)] text-[var(--Text-on-Inverse)] bg-[var(--Brand-Apple)] hover:opacity-90"
	},
	amazon: {
		label: "Amazonでログイン",
		platform: "amazon",
		iconTone: "brand",
		className: "border-[var(--Brand-Amazon)] text-[var(--Text-High-Emphasis)] bg-[var(--Surface-Primary)] hover:bg-[var(--Surface-Secondary)]"
	}
};
function su({ provider: e, loading: t = !1, fullWidth: n = !1, className: r, disabled: i, children: a, ...o }) {
	let s = ou[e];
	return /* @__PURE__ */ P("button", {
		"data-slot": "social-login-button",
		"data-provider": e,
		disabled: i || t,
		className: U("inline-flex items-center gap-3 border-[1.5px] rounded-xl px-4 py-3", "typo-label-md font-semibold transition-colors", "disabled:opacity-50 disabled:cursor-not-allowed", n && "w-full", s.className, r),
		...o,
		children: [/* @__PURE__ */ N("span", {
			className: "flex-shrink-0 w-6 flex items-center justify-center",
			children: t ? /* @__PURE__ */ N("svg", {
				className: "animate-spin",
				width: "16",
				height: "16",
				viewBox: "0 0 16 16",
				fill: "none",
				children: /* @__PURE__ */ N("circle", {
					cx: "8",
					cy: "8",
					r: "6",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeDasharray: "30",
					strokeDashoffset: "10"
				})
			}) : /* @__PURE__ */ N(au, {
				platform: s.platform,
				tone: s.iconTone,
				size: 22
			})
		}), /* @__PURE__ */ N("span", {
			className: "flex-1 text-center",
			children: a ?? s.label
		})]
	});
}
//#endregion
//#region src/components/ui/image-gallery.tsx
var cu = {
	square: "aspect-square",
	"4/3": "aspect-[4/3]",
	"16/9": "aspect-video",
	"3/4": "aspect-[3/4]"
};
function lu({ images: e, indicatorType: t = "thumbnail", aspectRatio: r = "4/3", onImageClick: i, className: a, prevLabel: o = "前の画像", nextLabel: s = "次の画像", imageLabel: c = (e) => `画像 ${e + 1}` }) {
	let [l, u] = n.useState(0), d = () => u((e) => Math.max(0, e - 1)), f = () => u((t) => Math.min(e.length - 1, t + 1)), p = n.useRef(null), m = (e) => {
		p.current = e.touches[0].clientX;
	}, h = (e) => {
		if (p.current === null) return;
		let t = e.changedTouches[0].clientX - p.current;
		Math.abs(t) > 40 && (t < 0 ? f() : d()), p.current = null;
	}, g = e[l];
	return /* @__PURE__ */ P("div", {
		"data-slot": "image-gallery",
		className: U("flex flex-col gap-2", a),
		children: [
			/* @__PURE__ */ P("div", {
				className: U("relative w-full overflow-hidden rounded-xl bg-[var(--Surface-Tertiary)] cursor-pointer", cu[r] ?? "aspect-[4/3]"),
				onTouchStart: m,
				onTouchEnd: h,
				onClick: () => i?.(l),
				children: [
					g && /* @__PURE__ */ N("img", {
						src: g.src,
						alt: g.alt ?? c(l),
						className: "w-full h-full object-cover transition-opacity duration-200"
					}, l),
					e.length > 1 && /* @__PURE__ */ P("span", {
						className: "absolute bottom-2 right-2 bg-[var(--Overlay-Medium)] text-[var(--Text-on-Media)] typo-label-xs px-2 py-0.5 rounded-full",
						children: [
							l + 1,
							" / ",
							e.length
						]
					}),
					e.length > 1 && /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("button", {
						onClick: (e) => {
							e.stopPropagation(), d();
						},
						disabled: l === 0,
						"aria-label": o,
						className: "absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[var(--Overlay-Light)] text-[var(--Text-on-Media)] flex items-center justify-center disabled:opacity-0 transition-opacity hover:bg-[var(--Overlay-Medium)]",
						children: /* @__PURE__ */ N("svg", {
							width: "16",
							height: "16",
							viewBox: "0 0 16 16",
							fill: "none",
							"aria-hidden": "true",
							children: /* @__PURE__ */ N("path", {
								d: "M10 12L6 8l4-4",
								stroke: "currentColor",
								strokeWidth: "1.5",
								strokeLinecap: "round",
								strokeLinejoin: "round"
							})
						})
					}), /* @__PURE__ */ N("button", {
						onClick: (e) => {
							e.stopPropagation(), f();
						},
						disabled: l === e.length - 1,
						"aria-label": s,
						className: "absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[var(--Overlay-Light)] text-[var(--Text-on-Media)] flex items-center justify-center disabled:opacity-0 transition-opacity hover:bg-[var(--Overlay-Medium)]",
						children: /* @__PURE__ */ N("svg", {
							width: "16",
							height: "16",
							viewBox: "0 0 16 16",
							fill: "none",
							"aria-hidden": "true",
							children: /* @__PURE__ */ N("path", {
								d: "M6 4l4 4-4 4",
								stroke: "currentColor",
								strokeWidth: "1.5",
								strokeLinecap: "round",
								strokeLinejoin: "round"
							})
						})
					})] })
				]
			}),
			t === "thumbnail" && e.length > 1 && /* @__PURE__ */ N("div", {
				className: "flex gap-1.5 overflow-x-auto scrollbar-none",
				children: e.map((e, t) => /* @__PURE__ */ N("button", {
					onClick: () => u(t),
					"aria-label": c(t),
					"aria-pressed": t === l,
					className: U("flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 border-transparent transition-colors bg-[var(--Surface-Tertiary)]", t === l ? "border-[var(--Brand-Primary)]" : "border-transparent hover:border-[var(--Border-Medium-Emphasis)]"),
					children: /* @__PURE__ */ N("img", {
						src: e.src,
						alt: e.alt ?? c(t),
						className: "w-full h-full object-cover"
					})
				}, t))
			}),
			t === "dot" && e.length > 1 && /* @__PURE__ */ N("div", {
				className: "flex items-center justify-center gap-1.5",
				children: e.map((e, t) => /* @__PURE__ */ N("button", {
					onClick: () => u(t),
					"aria-label": c(t),
					className: U("rounded-full transition-all", t === l ? "w-4 h-1.5 bg-[var(--Brand-Primary)]" : "w-1.5 h-1.5 bg-[var(--Border-Medium-Emphasis)] hover:bg-[var(--Text-Low-Emphasis)]")
				}, t))
			})
		]
	});
}
//#endregion
//#region src/components/ui/navigation-bar.tsx
function uu({ size: e = 20 }) {
	return /* @__PURE__ */ N("svg", {
		width: e,
		height: e,
		viewBox: "0 0 24 24",
		fill: "none",
		"aria-hidden": "true",
		children: /* @__PURE__ */ N("path", {
			d: "M18 6L6 18M6 6l12 12",
			stroke: "currentColor",
			strokeWidth: "2.2",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})
	});
}
function du({ size: e = 20 }) {
	return /* @__PURE__ */ N("svg", {
		width: e,
		height: e,
		viewBox: "0 0 24 24",
		fill: "none",
		"aria-hidden": "true",
		children: /* @__PURE__ */ N("path", {
			d: "M15 18l-6-6 6-6",
			stroke: "currentColor",
			strokeWidth: "2.2",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})
	});
}
function fu({ size: e = 20 }) {
	return /* @__PURE__ */ P("svg", {
		width: e,
		height: e,
		viewBox: "0 0 24 24",
		fill: "none",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ N("path", {
			d: "M12 3v12M8 7l4-4 4 4",
			stroke: "currentColor",
			strokeWidth: "2.2",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		}), /* @__PURE__ */ N("path", {
			d: "M7 11H5a2 2 0 00-2 2v6a2 2 0 002 2h14a2 2 0 002-2v-6a2 2 0 00-2-2h-2",
			stroke: "currentColor",
			strokeWidth: "2.2",
			strokeLinecap: "round"
		})]
	});
}
function pu({ title: e, leftIcon: t = "back", onLeft: n, leftLabel: r, rightSlot: i, onShare: a, shareLabel: o = "シェア", glass: s = !1, transparent: c = !1, className: l }) {
	let u = () => t === "back" ? /* @__PURE__ */ N(du, {}) : t === "close" ? /* @__PURE__ */ N(uu, {}) : t, d = t === "close" ? "閉じる" : "戻る", f = s ? "glass" : "secondary";
	return /* @__PURE__ */ P("header", {
		"data-slot": "navigation-bar",
		className: U("relative flex items-center h-[60px] px-3", !c && "bg-[var(--Surface-Primary)]", l),
		children: [
			n && /* @__PURE__ */ N(W, {
				variant: f,
				size: "icon-xl",
				"aria-label": r ?? d,
				onClick: n,
				children: u()
			}),
			e && /* @__PURE__ */ N("div", {
				className: "absolute inset-0 flex justify-center items-center px-16 pointer-events-none",
				children: /* @__PURE__ */ N("span", {
					className: "typo-heading-sm text-[var(--Text-High-Emphasis)] min-w-0 truncate",
					children: e
				})
			}),
			/* @__PURE__ */ N("div", {
				className: "ml-auto",
				children: i ?? (a ? /* @__PURE__ */ N(W, {
					variant: f,
					size: "icon-xl",
					"aria-label": o,
					onClick: a,
					children: /* @__PURE__ */ N(fu, {})
				}) : null)
			})
		]
	});
}
//#endregion
//#region src/components/patterns/app-header.tsx
function mu({ layout: e = "default", leading: t, logo: n, title: r, subtitle: i, centerSlot: a, trailing: o, rightSlot: s, nav: c, bottomSlot: l, sticky: u = !1, bordered: d = !0, variant: f = "default", className: p }) {
	let m = f === "glass", h = f === "transparent", g = o ?? s;
	return /* @__PURE__ */ P("header", {
		"data-slot": "app-header",
		"data-variant": f,
		"data-layout": e,
		className: U("@container", u && "sticky top-0 z-40", p),
		children: [/* @__PURE__ */ P("div", {
			className: U("flex items-center gap-2 h-14 px-4", m && "glass", !m && !h && "bg-[var(--Surface-Primary)]", d && !m && !h && "border-b border-[var(--Border-Low-Emphasis)]", d && m && "border-b border-[rgba(255,255,255,0.25)]"),
			children: [
				t && /* @__PURE__ */ N("div", {
					className: "flex items-center shrink-0",
					children: t
				}),
				e === "back-search" && a ? /* @__PURE__ */ N("div", {
					className: "flex-1 min-w-0",
					children: a
				}) : e === "logo-center" ? /* @__PURE__ */ N("div", {
					className: "flex-1 flex justify-center min-w-0",
					children: n
				}) : e === "logo" ? /* @__PURE__ */ P(M, { children: [
					/* @__PURE__ */ N("div", {
						className: "shrink-0",
						children: n
					}),
					c && c.length > 0 && /* @__PURE__ */ N("nav", {
						className: "hidden @[768px]:flex items-center gap-4 ml-6",
						children: c.map((e) => /* @__PURE__ */ N("a", {
							href: e.href,
							onClick: e.onClick,
							"data-active": e.isActive || void 0,
							className: U("typo-label-md text-[var(--Text-Medium-Emphasis)] hover:text-[var(--Text-High-Emphasis)] transition-colors", e.isActive && "text-[var(--Brand-Primary)]"),
							children: e.label
						}, e.label))
					}),
					/* @__PURE__ */ N("div", { className: "flex-1" })
				] }) : /* @__PURE__ */ P("div", {
					className: "flex-1 flex flex-col justify-center min-w-0",
					children: [r && (typeof r == "string" ? /* @__PURE__ */ N("span", {
						className: "typo-heading-sm text-[var(--Text-High-Emphasis)] truncate",
						children: r
					}) : r), i && (typeof i == "string" ? /* @__PURE__ */ N("span", {
						className: "typo-body-xs text-[var(--Text-Medium-Emphasis)] truncate",
						children: i
					}) : i)]
				}),
				g && /* @__PURE__ */ N("div", {
					className: "flex items-center gap-1 shrink-0",
					children: g
				})
			]
		}), l && /* @__PURE__ */ N("div", {
			className: U(!m && !h && "bg-[var(--Surface-Primary)]", d && "border-b border-[var(--Border-Low-Emphasis)]"),
			children: l
		})]
	});
}
//#endregion
//#region src/components/patterns/tag-input.tsx
function hu({ value: e = [], onChange: t, placeholder: r = "タグを入力して Enter", disabled: i = !1, max: a, allowDuplicates: o = !1, className: s, inputLabel: c = "タグ入力" }) {
	let [l, u] = n.useState(""), d = n.useRef(null), f = n.useRef(!1), p = n.useCallback((n) => {
		let r = n.trim();
		r && (!o && e.includes(r) || a !== void 0 && e.length >= a || (t?.([...e, r]), u("")));
	}, [
		e,
		t,
		o,
		a
	]), m = n.useCallback((n) => {
		t?.(e.filter((e, t) => t !== n));
	}, [e, t]);
	return /* @__PURE__ */ P("div", {
		"data-slot": "tag-input",
		className: U("flex flex-wrap gap-1.5 min-h-12 w-full rounded-lg border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] px-3 py-2 transition-colors", "focus-within:ring-[3px] focus-within:ring-[var(--Focus-High-Emphasis)]/50 focus-within:border-[var(--Border-Accent-Primary)]", i && "cursor-not-allowed opacity-50", s),
		onClick: () => d.current?.focus(),
		children: [e.map((e, t) => /* @__PURE__ */ P("span", {
			className: "inline-flex items-center gap-1 h-7 px-2.5 rounded-full bg-[var(--Brand-Ultra-Light)] text-[var(--Text-Accent-Primary)] typo-label-sm",
			children: [e, !i && /* @__PURE__ */ N("button", {
				type: "button",
				onClick: (e) => {
					e.stopPropagation(), m(t);
				},
				className: "flex items-center justify-center w-3.5 h-3.5 rounded-full hover:bg-[var(--Brand-Light)] transition-colors",
				"aria-label": `${e} を削除`,
				children: /* @__PURE__ */ N("svg", {
					width: "8",
					height: "8",
					viewBox: "0 0 8 8",
					fill: "none",
					children: /* @__PURE__ */ N("path", {
						d: "M1 1l6 6M7 1L1 7",
						stroke: "currentColor",
						strokeWidth: "1.5",
						strokeLinecap: "round"
					})
				})
			})]
		}, t)), /* @__PURE__ */ N("input", {
			ref: d,
			value: l,
			onChange: (e) => u(e.target.value),
			onKeyDown: (t) => {
				t.key === "Enter" && (t.preventDefault(), f.current = !0, p(l)), t.key === "Backspace" && l === "" && e.length > 0 && m(e.length - 1), t.key === "," && (t.preventDefault(), p(l));
			},
			onBlur: () => {
				if (f.current) {
					f.current = !1;
					return;
				}
				l.trim() && p(l);
			},
			disabled: i || a !== void 0 && e.length >= a,
			placeholder: e.length === 0 ? r : "",
			className: "flex-1 min-w-24 bg-transparent focus-visible:outline-none typo-body-md text-[var(--Text-High-Emphasis)] placeholder:text-[var(--Text-Low-Emphasis)] disabled:cursor-not-allowed",
			"aria-label": c
		})]
	});
}
//#endregion
//#region src/components/patterns/swipe-row.tsx
var gu = 72;
function _u({ children: e, actions: t = [], side: r = "right", className: i }) {
	let [a, o] = n.useState(0), [s, c] = n.useState(!1), l = n.useRef(0), u = n.useRef(0), d = n.useRef(null), f = t.length * gu, p = Math.abs(a) > f / 2, m = n.useCallback((e) => {
		o(e);
	}, []), h = (e) => {
		l.current = e.clientX, u.current = a, c(!0), d.current?.setPointerCapture(e.pointerId);
	}, g = (e) => {
		if (!s) return;
		let t = e.clientX - l.current, n = u.current + t, i = r === "right" ? Math.max(-f, Math.min(0, n)) : Math.min(f, Math.max(0, n));
		o(i);
	}, _ = () => {
		s && (c(!1), m(p ? (r === "right" ? -1 : 1) * f : 0));
	}, v = () => m(0);
	return t.length === 0 ? /* @__PURE__ */ N("div", {
		className: i,
		children: e
	}) : /* @__PURE__ */ P("div", {
		className: U("relative overflow-hidden", i),
		children: [/* @__PURE__ */ N("div", {
			className: U("absolute inset-y-0 flex", r === "right" ? "right-0" : "left-0"),
			style: { width: f },
			inert: p ? void 0 : !0,
			children: t.map((e, t) => /* @__PURE__ */ P("button", {
				type: "button",
				onClick: () => {
					e.onClick(), v();
				},
				className: U("flex flex-col items-center justify-center gap-1 w-[72px] typo-label-xs font-medium transition-colors", e.variant === "destructive" ? "bg-[var(--Caution-Base)] text-[var(--Text-on-Inverse)] hover:bg-[var(--Hover-Destructive-Button)]" : "bg-[var(--Surface-Secondary)] text-[var(--Text-High-Emphasis)] hover:bg-[var(--Border-Medium-Emphasis)]"),
				children: [e.icon && /* @__PURE__ */ N("span", {
					className: "text-current",
					children: e.icon
				}), e.label]
			}, t))
		}), /* @__PURE__ */ N("div", {
			ref: d,
			className: U("relative bg-[var(--Surface-Primary)] touch-pan-y select-none", !s && "transition-transform duration-200 ease-out"),
			style: { transform: `translateX(${a}px)` },
			onPointerDown: h,
			onPointerMove: g,
			onPointerUp: _,
			onPointerCancel: _,
			children: e
		})]
	});
}
//#endregion
//#region src/components/patterns/confirm-dialog.tsx
function vu({ open: e, onOpenChange: t, title: r, description: i, confirmLabel: a = "確認", cancelLabel: o = "キャンセル", loadingLabel: s = "処理中…", variant: c = "default", onConfirm: l, loading: u = !1 }) {
	let [d, f] = n.useState(!1), p = u || d, m = n.useCallback(async () => {
		f(!0);
		try {
			await l(), t(!1);
		} finally {
			f(!1);
		}
	}, [l, t]);
	return /* @__PURE__ */ N(De, {
		open: e,
		onOpenChange: t,
		children: /* @__PURE__ */ P(je, { children: [/* @__PURE__ */ P(Me, { children: [/* @__PURE__ */ N(Pe, { children: r }), i && /* @__PURE__ */ N(Fe, { children: i })] }), /* @__PURE__ */ P(Ne, { children: [/* @__PURE__ */ N(Le, {
			variant: "secondary",
			disabled: p,
			children: o
		}), /* @__PURE__ */ N(W, {
			variant: c === "destructive" ? "destructive" : "default",
			onClick: m,
			disabled: p,
			children: p ? s : a
		})] })] })
	});
}
//#endregion
//#region src/components/patterns/celebration.tsx
var yu = [
	"var(--Brand-Primary)",
	"var(--Object-Success)",
	"var(--Object-Warning)",
	"var(--Object-Caution)",
	"var(--Object-Info)"
];
function bu(e) {
	let t = Math.sin(e * 999) * 1e4;
	return t - Math.floor(t);
}
function xu() {
	let [e, t] = n.useState(!1);
	return n.useEffect(() => {
		if (typeof window > "u" || !window.matchMedia) return;
		let e = window.matchMedia("(prefers-reduced-motion: reduce)");
		t(e.matches);
		let n = () => t(e.matches);
		return e.addEventListener("change", n), () => e.removeEventListener("change", n);
	}, []), e;
}
var Su = 1150, Cu = 0, wu = 360, Tu = 120, Eu = 280, Du = 12, Ou = 28;
function ku({ active: e = !0, trigger: t = "confetti", placement: r = "overlay", effect: i = "fall", emoji: a = "🎉", title: o, description: s, actions: c, interactive: l = !1, cardless: u = !1, particleCount: d = 36, durationMs: f = 2600, duration: p, colors: m, driftRange: h = 160, emojiAnimation: g = "pop", autoDismissMs: _, onTapDismiss: v, onDone: y, className: b, style: x, ...S }) {
	let C = xu(), w = _ ?? f, T = i === "burst", E = p ?? (T ? Su : w), D = m && m.length > 0 ? m : yu, ee = n.useMemo(() => Array.from({ length: d }, (e, t) => {
		let n = {
			id: t,
			delay: Math.round(T ? bu(t + 11) * 80 : bu(t + 11) * 420),
			duration: Math.round(E * (.78 + bu(t + 21) * .44)),
			rotate: Math.round(bu(t + 41) * 720),
			size: 6 + Math.round(bu(t + 51) * 6),
			color: D[t % D.length]
		};
		if (T) {
			let e = (Cu + bu(t + 61) * (wu - Cu)) * Math.PI / 180, r = (bu(t + 31) - .5) * h, i = Math.max(40, Tu + bu(t + 71) * (Eu - Tu) + r), a = Du + bu(t + 81) * (Ou - Du), o = Math.round(Math.cos(e) * i), s = Math.round(Math.sin(e) * i + a);
			return {
				...n,
				left: 0,
				drift: 0,
				finalX: o,
				finalY: s,
				midX: Math.round(o * .85),
				midY: Math.round(Math.sin(e) * i * .85)
			};
		}
		return {
			...n,
			left: Math.round(bu(t + 1) * 100),
			drift: Math.round((bu(t + 31) - .5) * h),
			finalX: 0,
			finalY: 0,
			midX: 0,
			midY: 0
		};
	}), [
		d,
		E,
		h,
		D,
		T
	]);
	if (n.useEffect(() => {
		if (!e || !y) return;
		let t = window.setTimeout(y, w);
		return () => window.clearTimeout(t);
	}, [
		e,
		y,
		w
	]), !e || t === "none") return null;
	let O = !C && (t === "confetti" || t === "both"), k = !u && (t === "confetti" || t === "emoji" || t === "both"), A = !!(v || l), j = [o ?? "達成しました", s].filter(Boolean).join(" "), M = () => {
		if (v) {
			v();
			return;
		}
		l && y?.();
	};
	return /* @__PURE__ */ P("div", {
		"data-slot": "celebration",
		"data-trigger": t,
		"data-placement": r,
		"data-reduced-motion": C || void 0,
		"data-cardless": u || void 0,
		role: "status",
		"aria-live": "polite",
		"aria-label": j,
		className: U(r === "overlay" ? "fixed inset-0 z-50 flex items-center justify-center" : "relative flex items-center justify-center", b),
		style: r === "overlay" ? {
			pointerEvents: "none",
			...x
		} : x,
		...S,
		children: [
			A && /* @__PURE__ */ N("button", {
				type: "button",
				"aria-label": "閉じる",
				className: "absolute inset-0 cursor-pointer",
				style: { pointerEvents: "auto" },
				onClick: M
			}),
			O && /* @__PURE__ */ N("div", {
				className: "absolute inset-0 overflow-hidden",
				style: { pointerEvents: "none" },
				"aria-hidden": "true",
				children: ee.map((e) => T ? /* @__PURE__ */ N("span", {
					className: "absolute left-1/2 top-1/2 rounded-sm opacity-0",
					style: {
						width: e.size,
						height: Math.max(4, e.size - 2),
						backgroundColor: e.color,
						animation: `celebration-confetti-burst ${e.duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${e.delay}ms forwards`,
						"--celebration-burst-x": `${e.finalX}px`,
						"--celebration-burst-y": `${e.finalY}px`,
						"--celebration-burst-mid-x": `${e.midX}px`,
						"--celebration-burst-mid-y": `${e.midY}px`,
						"--celebration-rotate": `${e.rotate}deg`
					}
				}, e.id) : /* @__PURE__ */ N("span", {
					className: "absolute top-0 rounded-sm opacity-0",
					style: {
						left: `${e.left}%`,
						width: e.size,
						height: Math.max(4, e.size - 2),
						backgroundColor: e.color,
						animation: `celebration-confetti-fall ${e.duration}ms ease-in ${e.delay}ms forwards`,
						"--celebration-drift": `${e.drift}px`,
						"--celebration-rotate": `${e.rotate}deg`
					}
				}, e.id))
			}),
			k && /* @__PURE__ */ P("div", {
				onClick: A ? M : void 0,
				style: { pointerEvents: "auto" },
				className: U("relative z-[1] mx-4 flex max-w-sm flex-col items-center rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] px-6 py-5 text-center shadow-[var(--shadow-dialog)]", !C && "animate-[celebration-pop_360ms_cubic-bezier(0.34,1.56,0.64,1)_both]", A && "cursor-pointer"),
				children: [
					a && /* @__PURE__ */ N("span", {
						className: U("typo-display-lg mb-3 leading-none", !C && g === "bounce" && "animate-[celebration-emoji-pop_600ms_ease-out_200ms_both]"),
						"aria-hidden": "true",
						children: a
					}),
					o && /* @__PURE__ */ N("p", {
						className: "typo-heading-md text-[var(--Text-High-Emphasis)]",
						children: o
					}),
					s && /* @__PURE__ */ N("p", {
						className: "typo-body-sm mt-1 text-[var(--Text-Medium-Emphasis)]",
						children: s
					}),
					c && /* @__PURE__ */ N("div", {
						className: "mt-4 flex flex-wrap justify-center gap-2",
						onClick: (e) => e.stopPropagation(),
						children: c
					})
				]
			}),
			u && /* @__PURE__ */ N("span", {
				className: "sr-only",
				children: j
			})
		]
	});
}
//#endregion
//#region src/components/patterns/celebration-dialog.tsx
function Au({ open: e, onOpenChange: t, icon: r, emoji: i, title: a, description: o, actions: s, autoDismissMs: c, emojiAnimation: l = "pop", effect: u = "burst", particleCount: d, duration: f, colors: p, driftRange: m, className: h }) {
	let g = xu();
	return n.useEffect(() => {
		if (!e || !c) return;
		let n = window.setTimeout(() => t(!1), c);
		return () => window.clearTimeout(n);
	}, [
		e,
		c,
		t
	]), /* @__PURE__ */ P(vt, {
		open: e,
		onOpenChange: t,
		children: [e && /* @__PURE__ */ N(ku, {
			active: !0,
			trigger: "confetti",
			placement: "overlay",
			cardless: !0,
			effect: u,
			particleCount: d ?? (u === "burst" ? 40 : 36),
			duration: f,
			colors: p,
			driftRange: m
		}), /* @__PURE__ */ N(Ct, {
			className: h,
			children: /* @__PURE__ */ P("div", {
				className: "flex flex-col items-center text-center",
				children: [
					(r || i) && /* @__PURE__ */ P("span", {
						className: "relative mb-4 flex h-20 w-20 items-center justify-center",
						"aria-hidden": "true",
						children: [
							/* @__PURE__ */ N("span", { className: "absolute -inset-3 rounded-full bg-[var(--Surface-Accent-Primary-Subtle)] opacity-50" }),
							/* @__PURE__ */ N("span", { className: "absolute inset-0 rounded-full bg-[var(--Surface-Accent-Primary-Light)] border border-[var(--Surface-Accent-Primary-Subtle)]" }),
							/* @__PURE__ */ N("span", {
								className: !g && l === "bounce" ? "relative flex items-center justify-center typo-display-lg leading-none animate-[celebration-emoji-pop_600ms_ease-out_200ms_both]" : "relative flex items-center justify-center typo-display-lg leading-none",
								children: r ?? i
							})
						]
					}),
					/* @__PURE__ */ N(Et, {
						className: "typo-heading-xl text-[var(--Text-High-Emphasis)]",
						children: a
					}),
					o && /* @__PURE__ */ N("p", {
						className: "typo-body-sm mt-2 text-[var(--Text-Medium-Emphasis)]",
						children: o
					}),
					s && /* @__PURE__ */ N("div", {
						className: "mt-4 flex flex-wrap justify-center gap-2",
						children: s
					})
				]
			})
		})]
	});
}
//#endregion
//#region src/components/patterns/countdown-hero.tsx
function ju(e) {
	if (e instanceof Date) return e;
	let t = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e);
	return t ? new Date(Number(t[1]), Number(t[2]) - 1, Number(t[3])) : new Date(e);
}
function Mu(e) {
	let t = new Date(e);
	return t.setHours(0, 0, 0, 0), t;
}
function Nu(e) {
	let t = Mu(/* @__PURE__ */ new Date()), n = Mu(e);
	return Math.round((n.getTime() - t.getTime()) / (1440 * 60 * 1e3));
}
function Pu({ targetDate: e, label: t = "残り", todayLabel: r = "本日", pastLabel: i = "経過", unit: a = "days", dateLabel: o, todayValue: s, illustration: c, className: l }) {
	let u = Nu(n.useMemo(() => ju(e), [e])), d = u === 0, f = u < 0, p = Math.abs(u), m = d ? r : f ? i : t, h = d ? s ?? "0" : String(p), g = "var(--font-display-serif, Georgia, 'Noto Serif JP', serif)";
	return /* @__PURE__ */ P("div", {
		"data-slot": "countdown-hero",
		"data-state": d ? "today" : f ? "past" : "active",
		className: U("relative", l),
		children: [c && /* @__PURE__ */ N("div", {
			className: "pointer-events-none absolute right-0 top-0 select-none",
			style: {
				maskImage: "linear-gradient(to right, transparent 0%, black 25%)",
				WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 25%)"
			},
			"aria-hidden": "true",
			children: c
		}), /* @__PURE__ */ P("div", {
			className: "relative",
			children: [
				/* @__PURE__ */ N("p", {
					className: "typo-caption leading-none text-[var(--Text-Low-Emphasis)]",
					children: m
				}),
				/* @__PURE__ */ P("div", {
					className: "mt-0.5 flex items-baseline gap-1.5",
					children: [/* @__PURE__ */ N("span", {
						className: U("tabular-nums leading-none text-[var(--Text-Accent-Primary)]", p >= 100 ? "text-7xl" : "text-8xl"),
						style: {
							fontFamily: g,
							fontWeight: 400
						},
						children: h
					}), !d && /* @__PURE__ */ N("span", {
						className: "text-2xl leading-none text-[var(--Text-Accent-Primary)]",
						style: {
							fontFamily: g,
							fontWeight: 400
						},
						children: a
					})]
				}),
				o && /* @__PURE__ */ N("p", {
					className: "mt-0.5 typo-caption tabular-nums text-[var(--Text-Low-Emphasis)]",
					children: o
				})
			]
		})]
	});
}
//#endregion
//#region src/components/patterns/bottom-sheet-form.tsx
function Fu({ open: e, onOpenChange: t, title: r, description: i, submitLabel: a = "保存", cancelLabel: o = "キャンセル", onSubmit: s, loading: c = !1, children: l, className: u }) {
	let [d, f] = n.useState(!1), p = c || d, m = n.useCallback(async (e) => {
		e.preventDefault(), f(!0);
		try {
			await s(), t(!1);
		} finally {
			f(!1);
		}
	}, [s, t]);
	return /* @__PURE__ */ N(yc, {
		open: e,
		onOpenChange: t,
		children: /* @__PURE__ */ P(Vc, {
			side: "bottom",
			className: U("p-0 rounded-t-[32px] max-h-[90dvh] flex flex-col", u),
			children: [/* @__PURE__ */ P(Kc, {
				className: "px-5 pt-6 shrink-0",
				children: [/* @__PURE__ */ N(Jc, {
					className: "typo-heading-3xl!",
					children: r
				}), i && /* @__PURE__ */ N(Yc, { children: i })]
			}), /* @__PURE__ */ P("form", {
				onSubmit: m,
				className: "flex flex-col flex-1 overflow-hidden",
				children: [/* @__PURE__ */ N("div", {
					className: "flex-1 overflow-y-auto px-5 py-4 space-y-4",
					children: l
				}), /* @__PURE__ */ P("div", {
					className: "shrink-0 flex gap-3 px-5 pt-4 pb-[calc(1.5rem_+_env(safe-area-inset-bottom))] border-t border-[var(--Border-Low-Emphasis)]",
					children: [/* @__PURE__ */ N(W, {
						type: "button",
						variant: "secondary",
						className: "flex-1",
						onClick: () => t(!1),
						disabled: p,
						children: o
					}), /* @__PURE__ */ N(W, {
						type: "submit",
						className: "flex-1",
						disabled: p,
						children: p ? "保存中…" : a
					})]
				})]
			})]
		})
	});
}
//#endregion
//#region src/components/patterns/bottom-sheet-frame.tsx
var Iu = {
	"mobile-full": [
		"p-0",
		"max-h-[calc(100dvh_-_env(safe-area-inset-top))]",
		"overflow-hidden rounded-t-[var(--Radius-Sheet)]",
		"sm:inset-x-4 sm:bottom-4 sm:mx-auto sm:max-h-[90dvh] sm:max-w-xl sm:rounded-[var(--Radius-Sheet)]"
	].join(" "),
	"mobile-form": [
		"p-0",
		"max-h-[88dvh] overflow-hidden rounded-t-[var(--Radius-Sheet)]",
		"sm:inset-x-4 sm:bottom-4 sm:mx-auto sm:max-w-lg sm:rounded-[var(--Radius-Sheet)]"
	].join(" "),
	"mobile-page": [
		"p-0",
		"max-h-[calc(100dvh_-_2rem_-_env(safe-area-inset-top,0px))]",
		"overflow-hidden rounded-t-[var(--Radius-Sheet)]",
		"sm:inset-x-4 sm:bottom-4 sm:mx-auto sm:max-h-[90dvh] sm:max-w-xl sm:rounded-[var(--Radius-Sheet)]"
	].join(" "),
	"desktop-floating": ["p-0", "inset-x-4 bottom-4 mx-auto max-h-[86dvh] max-w-xl overflow-hidden rounded-[var(--Radius-Sheet)]"].join(" ")
};
function Lu({ className: e, preset: t = "mobile-full", children: n, ...r }) {
	return /* @__PURE__ */ N(Vc, {
		"data-frame": "bottom-sheet-frame",
		"data-preset": t,
		side: "bottom",
		padding: !1,
		className: U(Iu[t], e),
		...r,
		children: n
	});
}
//#endregion
//#region src/components/patterns/side-drawer-frame.tsx
var Ru = "h-full w-full max-w-md flex flex-col overflow-hidden";
function zu({ className: e, side: t = "right", children: n, ...r }) {
	return /* @__PURE__ */ N(Vc, {
		"data-frame": "side-drawer-frame",
		"data-side": t,
		side: t,
		padding: !1,
		className: U(Ru, e),
		...r,
		children: n
	});
}
//#endregion
//#region src/components/patterns/detail-sheet-scaffold.tsx
function Bu({ className: e, header: t, footer: n, children: r, ...i }) {
	return /* @__PURE__ */ P("div", {
		"data-slot": "detail-sheet-scaffold",
		className: U("flex max-h-[inherit] min-h-0 flex-col bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)]", e),
		...i,
		children: [
			t,
			/* @__PURE__ */ N("div", {
				"data-slot": "detail-sheet-body",
				className: "min-h-0 flex-1 overflow-y-auto px-5 py-4",
				children: r
			}),
			n
		]
	});
}
function Vu({ className: e, title: t, titleEditor: n, description: r, leading: i, trailing: a, children: o, ...s }) {
	let c = n ?? t;
	return /* @__PURE__ */ P("div", {
		"data-slot": "detail-sheet-header",
		className: U("grid shrink-0 grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 px-5 pt-5", "border-b border-[var(--Border-Low-Emphasis)] pb-4", e),
		...s,
		children: [
			/* @__PURE__ */ N("div", {
				"data-slot": "detail-sheet-header-leading",
				className: "flex min-h-10 items-center",
				children: i
			}),
			/* @__PURE__ */ P("div", {
				"data-slot": "detail-sheet-header-title",
				className: "min-w-0",
				children: [
					typeof c == "string" ? /* @__PURE__ */ N("h2", {
						className: "typo-heading-lg text-[var(--Text-High-Emphasis)] break-words",
						children: c
					}) : c,
					r && (typeof r == "string" ? /* @__PURE__ */ N("p", {
						className: "typo-body-sm mt-1 text-[var(--Text-Medium-Emphasis)]",
						children: r
					}) : /* @__PURE__ */ N("div", {
						className: "mt-1",
						children: r
					})),
					o
				]
			}),
			/* @__PURE__ */ N("div", {
				"data-slot": "detail-sheet-header-trailing",
				className: "flex min-h-10 shrink-0 items-center justify-end gap-1",
				children: a
			})
		]
	});
}
function Hu({ className: e, ...t }) {
	return /* @__PURE__ */ N("div", {
		"data-slot": "detail-sheet-body",
		className: U("min-h-0 flex-1 overflow-y-auto px-5 py-4", e),
		...t
	});
}
//#endregion
//#region src/lib/use-visual-viewport-keyboard-inset.ts
function Uu(e, t, n) {
	let r = Math.max(0, e - t - n);
	return r < 1 ? {
		keyboardInset: 0,
		visibleHeight: null,
		isKeyboardOpen: !1
	} : {
		keyboardInset: r,
		visibleHeight: t,
		isKeyboardOpen: !0
	};
}
function Wu() {
	let [e, t] = n.useState({
		keyboardInset: 0,
		visibleHeight: null,
		isKeyboardOpen: !1
	});
	return n.useEffect(() => {
		if (typeof window > "u") return;
		let e = window.visualViewport, n = () => {
			let n = document.documentElement.hasAttribute("data-kb-open") || document.body?.hasAttribute("data-kb-open") === !0;
			if (!e) {
				t({
					keyboardInset: 0,
					visibleHeight: null,
					isKeyboardOpen: n
				});
				return;
			}
			let r = Uu(window.innerHeight, e.height, e.offsetTop);
			t(n && !r.isKeyboardOpen ? {
				...r,
				isKeyboardOpen: !0
			} : r);
		};
		n(), e?.addEventListener("resize", n), e?.addEventListener("scroll", n);
		let r = typeof MutationObserver < "u" ? new MutationObserver(n) : null;
		return r?.observe(document.documentElement, {
			attributes: !0,
			attributeFilter: ["data-kb-open"]
		}), document.body && r?.observe(document.body, {
			attributes: !0,
			attributeFilter: ["data-kb-open"]
		}), () => {
			e?.removeEventListener("resize", n), e?.removeEventListener("scroll", n), r?.disconnect();
		};
	}, []), e;
}
//#endregion
//#region src/components/patterns/keyboard-aware-sheet-footer.tsx
function Gu({ enabled: e = !0, block: t = "center", behavior: r = "smooth" } = {}) {
	let i = n.useRef(null);
	return n.useEffect(() => {
		if (!e) return;
		let n = i.current;
		if (!n) return;
		let a = (e) => {
			let n = e.target;
			n instanceof HTMLElement && n.matches("input, textarea, select, [contenteditable='true']") && window.setTimeout(() => {
				n.scrollIntoView({
					block: t,
					behavior: r,
					inline: "nearest"
				});
			}, 0);
		};
		return n.addEventListener("focusin", a), () => n.removeEventListener("focusin", a);
	}, [
		t,
		r,
		e
	]), i;
}
function Ku({ className: e, behavior: t = "fixed", hideWhenInputFocused: n = t === "hide", style: r, children: i, ...a }) {
	let { keyboardInset: o, isKeyboardOpen: s } = Wu();
	return /* @__PURE__ */ N("div", {
		"data-slot": "keyboard-aware-sheet-footer",
		"data-behavior": t,
		"data-keyboard-open": s || void 0,
		className: U("shrink-0 bg-[var(--Surface-Primary)] px-5 pt-3", "border-t border-[var(--Border-Low-Emphasis)]", "pb-[max(1rem,env(safe-area-inset-bottom))]", t === "fixed" && "sticky bottom-[var(--ksk-keyboard-inset)] z-10", t === "hide" && "sticky bottom-[var(--ksk-keyboard-inset)] z-10 transition-all duration-200", t === "scroll" && "relative", n && s && "translate-y-2 opacity-0 pointer-events-none", e),
		style: {
			"--ksk-keyboard-inset": `${o}px`,
			...r
		},
		...a,
		children: i
	});
}
//#endregion
//#region src/components/patterns/mobile-floating-action-button.tsx
function qu({ className: e, label: t, icon: n, showLabel: r = !1, placement: i = "end", bottomOffset: a = "bottom-nav", keyboardBehavior: o = "hide", mobileOnly: s = !0, style: c, ...l }) {
	let u = l["aria-label"] ?? t, { keyboardInset: d, isKeyboardOpen: f } = Wu(), p = o === "hide" && f, m = o === "lift" ? d : 0;
	return /* @__PURE__ */ P(W, {
		...l,
		"data-slot": "mobile-floating-action-button",
		"data-placement": i,
		"data-bottom-offset": a,
		"aria-label": u,
		variant: "default",
		size: r ? "lg" : "icon-lg",
		className: U("fixed z-50 shadow-[var(--shadow-lg)] transition-all duration-200", "bottom-[calc(env(safe-area-inset-bottom)_+_var(--ksk-fab-bottom-offset)_+_var(--ksk-fab-keyboard-inset))]", i === "end" && "right-4", i === "start" && "left-4", i === "center" && "left-1/2 -translate-x-1/2", a === "none" && "[--ksk-fab-bottom-offset:1rem]", a === "bottom-nav-pill-inline" && "[--ksk-fab-bottom-offset:1rem]", a === "bottom-nav" && "[--ksk-fab-bottom-offset:5rem]", a === "bottom-nav-pill" && "[--ksk-fab-bottom-offset:6rem]", s && "lg:hidden", p && "translate-y-2 opacity-0 pointer-events-none", e),
		style: {
			"--ksk-fab-keyboard-inset": `${m}px`,
			...c
		},
		children: [/* @__PURE__ */ N("span", {
			"aria-hidden": !0,
			className: "flex size-5 items-center justify-center",
			children: n ?? /* @__PURE__ */ N(I, { size: 22 })
		}), r && /* @__PURE__ */ N("span", { children: t })]
	});
}
//#endregion
//#region src/components/patterns/mobile-app-header.tsx
function Ju({ className: e, brand: t, leading: n, status: r, compactStatus: i, actions: a, sticky: o = !0, bordered: s = !0, children: c, ...l }) {
	return /* @__PURE__ */ P("header", {
		"data-slot": "mobile-app-header",
		className: U("bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)]", o && "sticky top-0 z-40", s && "border-b border-[var(--Border-Low-Emphasis)]", e),
		...l,
		children: [/* @__PURE__ */ P("div", {
			className: "flex min-h-14 items-center gap-2 px-4",
			children: [
				n && /* @__PURE__ */ N("div", {
					"data-slot": "mobile-app-header-leading",
					className: "flex shrink-0 items-center",
					children: n
				}),
				/* @__PURE__ */ N("div", {
					"data-slot": "mobile-app-header-brand",
					className: "flex min-w-fit max-w-[58%] shrink-0 items-center overflow-hidden",
					children: t
				}),
				/* @__PURE__ */ P("div", {
					"data-slot": "mobile-app-header-status-actions",
					className: "ml-auto flex min-w-0 flex-1 items-center justify-end gap-2",
					children: [
						r && /* @__PURE__ */ N("div", {
							className: "hidden min-w-0 max-w-full items-center overflow-hidden sm:flex",
							children: r
						}),
						(i ?? r) && /* @__PURE__ */ N("div", {
							className: "flex shrink-0 items-center sm:hidden",
							children: i ?? r
						}),
						a && /* @__PURE__ */ N("div", {
							className: "flex shrink-0 items-center gap-1",
							children: a
						})
					]
				})
			]
		}), c]
	});
}
//#endregion
//#region src/components/patterns/mobile-app-shell.tsx
function Yu({ className: e, style: t, header: n, bottomNav: r, fab: i, desktopSidebar: a, mainClassName: o, contentClassName: s, bottomNavMode: c = "fixed", bottomPadding: l = i ? "bottom-nav-fab" : r ? "bottom-nav" : "none", maxWidth: u = 430, centeredPreview: d = !0, children: f, ...p }) {
	return /* @__PURE__ */ N("div", {
		"data-slot": "mobile-app-shell",
		className: U("min-h-dvh bg-[var(--Surface-Secondary)] text-[var(--Text-High-Emphasis)]", e),
		style: t,
		...p,
		children: /* @__PURE__ */ P("div", {
			className: "mx-auto flex min-h-dvh w-full",
			style: d ? { maxWidth: u } : void 0,
			children: [a && /* @__PURE__ */ N("aside", {
				"data-slot": "mobile-app-shell-desktop-sidebar",
				className: "hidden w-64 shrink-0 border-r border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] lg:block",
				children: a
			}), /* @__PURE__ */ P("div", {
				"data-slot": "mobile-app-shell-frame",
				className: "relative flex min-h-dvh min-w-0 flex-1 flex-col bg-[var(--Surface-Primary)]",
				children: [
					n && /* @__PURE__ */ N("header", {
						"data-slot": "mobile-app-shell-header",
						className: "sticky top-0 z-40 shrink-0 bg-[var(--Surface-Primary)]",
						children: n
					}),
					/* @__PURE__ */ N("main", {
						"data-slot": "mobile-app-shell-main",
						className: U("min-h-0 flex-1", l === "bottom-nav" && "pb-20", l === "bottom-nav-fab" && "pb-28", o),
						children: /* @__PURE__ */ N("div", {
							"data-slot": "mobile-app-shell-content",
							className: s,
							children: f
						})
					}),
					r && c === "inline" && /* @__PURE__ */ N("footer", {
						"data-slot": "mobile-app-shell-bottom-nav-inline",
						className: "shrink-0",
						children: r
					}),
					r && c === "fixed" && /* @__PURE__ */ N("footer", {
						"data-slot": "mobile-app-shell-bottom-nav-fixed",
						className: "fixed inset-x-0 bottom-0 z-40 mx-auto w-full pb-[env(safe-area-inset-bottom)] lg:hidden",
						style: d ? { maxWidth: u } : void 0,
						children: r
					}),
					r && c === "external" ? r : null,
					i && /* @__PURE__ */ N("div", {
						"data-slot": "mobile-app-shell-fab",
						children: i
					})
				]
			})]
		})
	});
}
//#endregion
//#region src/components/patterns/commerce/bottom-tab-bar.tsx
function Xu(e) {
	return e === "inverse" ? "bg-[rgba(255,255,255,0.20)] shadow-[inset_0_1px_0_rgba(255,255,255,0.30)]" : "[background:color-mix(in_srgb,var(--Surface-Primary)_70%,transparent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.60),0_1px_3px_rgba(0,0,0,0.08)]";
}
var Zu = typeof window < "u" ? n.useLayoutEffect : n.useEffect;
function Qu(e) {
	let { keyboardInset: t, isKeyboardOpen: n } = Wu();
	return {
		keyboardBehavior: e,
		isKeyboardOpen: n,
		shouldHide: e === "hide" && n,
		liftInset: e === "lift" ? t : 0
	};
}
function $u({ className: e, items: t, centerAction: n, showLabels: r, tone: i = "default", maxWidth: a, variant: o = "default", pillPosition: s = "fixed", floatingPosition: c = "center", keyboardBehavior: l = "stay", scrollEdge: u = !1, ...d }) {
	let f = Qu(l);
	return o === "pill" ? /* @__PURE__ */ N(td, {
		className: e,
		items: t,
		centerAction: n,
		showLabels: r,
		tone: i,
		maxWidth: a,
		pillPosition: s,
		floatingPosition: c,
		scrollEdge: u,
		keyboardState: f,
		...d
	}) : /* @__PURE__ */ N(ed, {
		className: e,
		items: t,
		keyboardState: f,
		...d
	});
}
function ed({ className: e, items: t, keyboardState: n, style: r, ...i }) {
	return /* @__PURE__ */ N("nav", {
		"data-slot": "bottom-tab-bar",
		"data-keyboard-behavior": n.keyboardBehavior,
		"data-keyboard-open": n.isKeyboardOpen || void 0,
		"aria-label": "メインナビゲーション",
		className: U("fixed inset-x-0 z-50 transition-all duration-200", n.keyboardBehavior === "lift" ? "bottom-[var(--ksk-bottom-tab-bar-keyboard-inset)]" : "bottom-0", "border-t border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]", "pb-[env(safe-area-inset-bottom)] lg:hidden", n.shouldHide && "translate-y-2 opacity-0 pointer-events-none invisible", e),
		style: {
			"--ksk-bottom-tab-bar-keyboard-inset": `${n.liftInset}px`,
			...r
		},
		...i,
		children: /* @__PURE__ */ N("div", {
			className: "flex h-14 items-center justify-around px-1",
			children: t.map((e) => /* @__PURE__ */ N(nd, {
				item: e,
				compact: !1
			}, e.label))
		})
	});
}
function td({ className: e, items: t, centerAction: r, showLabels: i, tone: a = "default", maxWidth: o = 430, pillPosition: s = "fixed", floatingPosition: c = "center", scrollEdge: l = !1, keyboardState: u, style: d, ...f }) {
	let p = !!r || i === !0, m = i ?? !!r, h = r ? Math.ceil(t.length / 2) : t.length, g = t.slice(0, h), _ = t.slice(h), v = n.useRef(null), [y, b] = n.useState(null), [x, S] = n.useState(!1), C = n.useCallback(() => {
		let e = v.current;
		if (!e) return;
		let t = e.querySelector("[data-platter-anchor]");
		if (!t) {
			b(null);
			return;
		}
		let n = e.getBoundingClientRect(), r = t.getBoundingClientRect();
		b((e) => {
			let t = {
				x: r.left - n.left,
				y: r.top - n.top,
				w: r.width,
				h: r.height
			};
			return e && Math.abs(e.x - t.x) < .5 && Math.abs(e.y - t.y) < .5 && Math.abs(e.w - t.w) < .5 && Math.abs(e.h - t.h) < .5 ? e : t;
		});
	}, []);
	Zu(C), n.useEffect(() => {
		if (y && !x) {
			let e = requestAnimationFrame(() => S(!0));
			return () => cancelAnimationFrame(e);
		}
	}, [y, x]), n.useEffect(() => {
		let e = v.current;
		if (!e || typeof ResizeObserver > "u") return;
		let t = new ResizeObserver(C);
		return t.observe(e), () => t.disconnect();
	}, [C]);
	let w = c === "left" || c === "right", T = {
		"--ksk-bottom-tab-bar-keyboard-inset": `${u.liftInset}px`,
		...p && !w ? {
			width: "calc(100vw - 24px)",
			maxWidth: o
		} : {},
		...w ? { maxWidth: "calc(100vw - 92px)" } : {},
		...d
	};
	return /* @__PURE__ */ P(M, { children: [l && /* @__PURE__ */ N("div", {
		"aria-hidden": "true",
		className: U("inset-x-0 bottom-0 z-40 h-28 lg:hidden", "glass-scroll-edge-bottom", "transition-opacity duration-200", s === "fixed" ? "fixed" : "absolute", u.shouldHide && "opacity-0")
	}), /* @__PURE__ */ P("nav", {
		"data-slot": "bottom-nav-pill",
		"data-keyboard-behavior": u.keyboardBehavior,
		"data-keyboard-open": u.isKeyboardOpen || void 0,
		"aria-label": "メインナビゲーション",
		className: U("z-50 lg:hidden transition-all duration-200", s === "fixed" ? "fixed" : "absolute", u.keyboardBehavior === "lift" ? "bottom-[calc(env(safe-area-inset-bottom)_+_12px_+_var(--ksk-bottom-tab-bar-keyboard-inset))]" : "bottom-[calc(env(safe-area-inset-bottom)_+_12px)]", c === "left" && "left-3 right-20", c === "right" && "right-3 left-20", c === "center" && "left-1/2 -translate-x-1/2", "flex items-center rounded-full glass-specular", a === "inverse" ? "glass-dark" : "glass", p ? "min-h-[66px] gap-1 px-2 py-2" : "h-[58px] gap-0 px-3", u.shouldHide && "translate-y-2 opacity-0 pointer-events-none invisible", e),
		style: T,
		...f,
		ref: v,
		children: [
			y && /* @__PURE__ */ N("span", {
				"aria-hidden": "true",
				className: U("absolute left-0 top-0 rounded-full pointer-events-none", x && "transition-[transform,width,height] duration-200 ease-out motion-reduce:transition-none", Xu(a)),
				style: {
					width: y.w,
					height: y.h,
					transform: `translate3d(${y.x}px, ${y.y}px, 0)`
				}
			}),
			g.map((e, t) => /* @__PURE__ */ N(nd, {
				item: e,
				compact: !0,
				showLabel: m,
				tone: a,
				suppressPlatter: y !== null
			}, `${e.href ?? e.label}-${t}`)),
			r ? /* @__PURE__ */ N(rd, { item: r }) : null,
			_.map((e, t) => /* @__PURE__ */ N(nd, {
				item: e,
				compact: !0,
				showLabel: m,
				tone: a,
				suppressPlatter: y !== null
			}, `${e.href ?? e.label}-${t + h}`))
		]
	})] });
}
function nd({ item: e, compact: t, showLabel: n, tone: r = "default", suppressPlatter: i = !1 }) {
	let a = e.href ? "a" : "button", o = e.href ? { href: e.href } : {
		type: "button",
		onClick: e.onClick
	}, s = n ?? !t, c = t && s && e.isActive && !i, l = e.isActive && (!t || !s && !i), u = t && s && e.isActive, d = t && !s && e.isActive, f = Xu(r);
	return /* @__PURE__ */ P(a, {
		"data-tab-key": e.tabKey,
		"data-platter-anchor": u || void 0,
		className: U("relative flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-full", "transition-[transform,opacity] duration-150 active:scale-95 active:opacity-80", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--Focus-High-Emphasis)]", t ? s ? "h-full min-w-0 flex-1 px-2 py-1" : "h-full w-14" : "min-w-0 flex-1 pb-1 pt-1", c && f, e.isActive ? r === "inverse" ? "text-[var(--Text-on-Inverse)]" : "text-[var(--Text-Accent-Primary)]" : r === "inverse" ? "text-[var(--Text-on-Inverse)] opacity-75" : "text-[var(--Text-High-Emphasis)] opacity-60"),
		"aria-label": s ? e.ariaLabel : e.ariaLabel ?? e.label,
		"aria-current": e.isActive ? "page" : void 0,
		...o,
		children: [/* @__PURE__ */ P("span", {
			"data-platter-anchor": d || void 0,
			className: U("relative flex items-center justify-center rounded-full transition-colors", t ? s ? "h-7 min-w-7" : "h-8 w-12" : "h-7 w-14", l && (t ? f : "bg-[var(--Surface-Accent-Primary-Light)]")),
			children: [e.isActive && e.activeIcon ? e.activeIcon : e.icon, e.badgeCount != null && e.badgeCount > 0 && /* @__PURE__ */ N("span", {
				className: "absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-[var(--Caution-Base)] typo-label-xs text-[var(--Text-on-Inverse)]",
				children: e.badgeCount > 99 ? "99+" : e.badgeCount
			})]
		}), s && /* @__PURE__ */ N("span", {
			className: "max-w-full truncate px-0.5 text-center typo-label-xs",
			children: e.label
		})]
	});
}
function rd({ item: e }) {
	let t = e.href ? "a" : "button", n = e.href ? { href: e.href } : {
		type: "button",
		onClick: e.onClick
	}, r = !!e.label;
	return /* @__PURE__ */ P(t, {
		className: U("relative flex shrink-0 items-center justify-center rounded-full", r ? "h-12 min-w-[78px] gap-1 px-3" : "size-12", "glass-accent glass-specular text-[var(--Text-on-Inverse)]", "typo-label-sm transition-transform duration-150 active:scale-[0.96]", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--Focus-High-Emphasis)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"),
		"aria-label": e.ariaLabel ?? e.label,
		...n,
		children: [/* @__PURE__ */ N("span", {
			className: U("flex items-center justify-center", r && "size-5"),
			"aria-hidden": "true",
			children: e.icon
		}), r && /* @__PURE__ */ N("span", {
			className: "max-w-[5rem] truncate",
			children: e.label
		})]
	});
}
//#endregion
//#region src/components/patterns/commerce/mobile-tab-bar.tsx
function id() {
	return /* @__PURE__ */ N("span", {
		"data-global-nav-add-icon": !0,
		"aria-hidden": "true",
		className: "flex items-center justify-center",
		children: /* @__PURE__ */ N(I, {
			size: 24,
			variant: "Linear",
			color: "currentColor"
		})
	});
}
function ad({ tabs: e, activeTab: t, onSelect: r, addAction: i, floatingPosition: a = "center", className: o }) {
	let s = n.useCallback((e) => {
		let t = e.target;
		t instanceof Element && t.closest("button, a")?.blur();
	}, []), c = e.map((e) => {
		let n = e.key === t, i = e.Icon;
		return {
			label: e.label,
			icon: /* @__PURE__ */ N(i, {
				size: 20,
				variant: "Linear"
			}),
			activeIcon: /* @__PURE__ */ N(i, {
				size: 20,
				variant: "Bulk"
			}),
			isActive: n,
			onClick: () => r(e.key),
			tabKey: e.key
		};
	}), l = i ? {
		label: "",
		ariaLabel: i.ariaLabel ?? i.label,
		icon: /* @__PURE__ */ N(id, {}),
		activeIcon: /* @__PURE__ */ N(id, {}),
		onClick: i.onClick
	} : void 0;
	return /* @__PURE__ */ N($u, {
		className: o ? `lg:hidden ${o}` : "lg:hidden",
		variant: "pill",
		pillPosition: "fixed",
		floatingPosition: a,
		showLabels: !0,
		keyboardBehavior: "hide",
		onPointerUpCapture: s,
		items: c,
		centerAction: l
	});
}
//#endregion
//#region src/components/patterns/chip.tsx
var od = F("inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer touch-manipulation [-webkit-tap-highlight-color:transparent] [@media(hover:hover)]:transition-colors typo-label-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--Focus-High-Emphasis)]", {
	variants: {
		variant: {
			filled: "bg-[var(--Surface-Secondary)] text-[var(--Text-High-Emphasis)] hover:bg-[var(--Surface-Tertiary)] disabled:text-[var(--Text-Disable)] disabled:hover:bg-[var(--Surface-Secondary)]",
			accent: "bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)] hover:bg-[var(--Hover-Secondary-Button)] disabled:bg-[var(--Surface-Secondary)] disabled:text-[var(--Text-Disable)] disabled:hover:bg-[var(--Surface-Secondary)]",
			outline: "border border-[var(--Border-Medium-Emphasis)] text-[var(--Text-High-Emphasis)] hover:bg-[var(--Surface-Secondary)] disabled:text-[var(--Text-Disable)]"
		},
		size: {
			sm: "h-7 px-2.5 typo-label-xs",
			md: "h-8 px-3 typo-label-sm",
			lg: "h-9 px-4 typo-label-sm",
			tile: "size-12 typo-body-md"
		},
		shape: {
			pill: "rounded-full",
			square: "rounded-sm"
		}
	},
	defaultVariants: {
		variant: "filled",
		size: "md",
		shape: "pill"
	}
});
function sd({ className: e, id: t, style: n, title: r, variant: i = "filled", size: a, shape: o, href: s, selected: c, soldOut: l = !1, removable: u, onRemove: d, count: f, children: p, disabled: m, ...h }) {
	let g = l && !c, _ = g || m, v = a ?? "md", y = o ?? "pill", b = typeof p == "string" || typeof p == "number" ? `削除: ${p}` : "削除", x = f !== void 0 && /* @__PURE__ */ N("span", {
		className: U("inline-flex items-center justify-center rounded-full px-1.5 min-w-[1.25rem] typo-label-xs [@media(hover:hover)]:transition-colors", c ? "bg-[var(--Surface-Primary)] text-[var(--Text-Accent-Primary)]" : "bg-[var(--Surface-Tertiary)] text-[var(--Text-Medium-Emphasis)]"),
		children: f
	}), S = /* @__PURE__ */ N("span", {
		"aria-hidden": "true",
		className: "inline-flex size-5 items-center justify-center rounded-full",
		children: /* @__PURE__ */ N("svg", {
			width: "12",
			height: "12",
			viewBox: "0 0 14 14",
			fill: "none",
			"aria-hidden": "true",
			children: /* @__PURE__ */ N("path", {
				d: "M4 4L10 10M10 4L4 10",
				stroke: "currentColor",
				strokeWidth: "1.5",
				strokeLinecap: "round"
			})
		})
	}), C = /* @__PURE__ */ P(M, { children: [
		p,
		x,
		g && /* @__PURE__ */ N("span", {
			"aria-hidden": "true",
			className: "pointer-events-none absolute inset-0 flex items-center justify-center",
			children: /* @__PURE__ */ N("span", { className: "block h-[140%] w-px origin-center rotate-45 bg-[var(--Text-Disable)]" })
		})
	] }), w = c && "bg-[var(--Brand-Primary)]! text-[var(--Text-on-Inverse)]! hover:bg-[var(--Active-Primary-Button)]! active:bg-[var(--Active-Primary-Button)]! border-[var(--Brand-Primary)]! shadow-sm hover:shadow", T = g && "border border-[var(--Text-Disable)] bg-[var(--Surface-Secondary)]! text-[var(--Text-Disable)]! cursor-not-allowed", E = {
		sm: "h-7 pl-0.5 pr-2",
		md: "h-8 pl-0.5 pr-2.5",
		lg: "h-9 pl-1 pr-3",
		tile: "h-12 w-8"
	}[v], D = y === "square" || v === "tile" ? "rounded-r-sm" : "rounded-r-full";
	if (u) {
		let l = U("relative", od({
			variant: i,
			size: a,
			shape: o
		}), "rounded-r-none", v !== "tile" && "pr-1.5", i === "outline" && "border-r-0", w, T);
		return /* @__PURE__ */ P("span", {
			id: t,
			style: n,
			title: r,
			"data-slot": "chip",
			"data-variant": i,
			"data-selected": c || void 0,
			"data-sold-out": g || void 0,
			className: U("inline-flex items-center [-webkit-tap-highlight-color:transparent]", e),
			children: [s && !g ? /* @__PURE__ */ N("a", {
				href: s,
				className: l,
				children: C
			}) : /* @__PURE__ */ N("button", {
				type: "button",
				disabled: _,
				className: l,
				...h,
				children: C
			}), /* @__PURE__ */ N("button", {
				type: "button",
				"data-slot": "chip-remove",
				"aria-label": b,
				disabled: _,
				onClick: (e) => {
					e.stopPropagation(), d?.();
				},
				className: U("inline-flex shrink-0 items-center justify-center touch-manipulation [-webkit-tap-highlight-color:transparent] [@media(hover:hover)]:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--Focus-High-Emphasis)] disabled:pointer-events-none disabled:opacity-50", !c && i === "filled" && "bg-[var(--Surface-Secondary)] text-[var(--Text-Medium-Emphasis)] hover:bg-[var(--Surface-Tertiary)] hover:text-[var(--Text-High-Emphasis)]", !c && i === "accent" && "bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)] hover:bg-[var(--Hover-Secondary-Button)]", !c && i === "outline" && "border border-l-0 border-[var(--Border-Medium-Emphasis)] bg-transparent text-[var(--Text-Medium-Emphasis)] hover:bg-[var(--Surface-Secondary)] hover:text-[var(--Text-High-Emphasis)]", c && "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)] hover:bg-[var(--Active-Primary-Button)] hover:text-[var(--Text-on-Inverse)]", E, D),
				children: S
			})]
		});
	}
	return s && !g ? /* @__PURE__ */ N("a", {
		href: s,
		id: t,
		style: n,
		title: r,
		"data-slot": "chip",
		"data-variant": i,
		"data-selected": c || void 0,
		className: U("relative", od({
			variant: i,
			size: a,
			shape: o
		}), w, e),
		children: C
	}) : /* @__PURE__ */ N("button", {
		type: "button",
		id: t,
		style: n,
		title: r,
		"data-slot": "chip",
		"data-variant": i,
		"data-selected": c || void 0,
		"data-sold-out": g || void 0,
		"aria-pressed": c === void 0 ? void 0 : c,
		disabled: _,
		className: U("relative", od({
			variant: i,
			size: a,
			shape: o
		}), w, T, e),
		...h,
		children: C
	});
}
//#endregion
//#region src/components/patterns/chip-selector.tsx
function cd({ options: e, value: t, onChange: r, multiple: i = !0, max: a, size: o = "md", className: s }) {
	let c = n.useCallback((e) => {
		if (i) if (t.includes(e)) r(t.filter((t) => t !== e));
		else {
			if (a && t.length >= a) return;
			r([...t, e]);
		}
		else r(t.includes(e) ? [] : [e]);
	}, [
		t,
		r,
		i,
		a
	]);
	return /* @__PURE__ */ N("div", {
		"data-slot": "chip-selector",
		role: "group",
		className: U("flex flex-wrap gap-2", s),
		children: e.map((e) => {
			let n = t.includes(e.value), s = !n && !!a && t.length >= a;
			return /* @__PURE__ */ P(sd, {
				size: o,
				variant: n ? "accent" : "outline",
				selected: n,
				disabled: s,
				removable: n && i,
				onRemove: () => r(t.filter((t) => t !== e.value)),
				onClick: () => c(e.value),
				"aria-pressed": n,
				children: [e.icon && /* @__PURE__ */ N("span", {
					className: "shrink-0",
					children: e.icon
				}), e.label]
			}, e.value);
		})
	});
}
//#endregion
//#region src/components/patterns/collapsible-chip-field.tsx
function ld({ icon: e, label: t, options: r, selected: i, onSelect: a, onClear: o, getLabel: s, getIcon: c, alwaysExpanded: l = !1 }) {
	let u = i != null && i !== "", [d, f] = n.useState(!1);
	n.useEffect(() => {
		f(!1);
	}, [i]);
	let p = u && r.includes(i), m = l || !p || d, h = m ? r : r.filter((e) => e === i), g = n.useRef(null), _ = n.useRef(null);
	return n.useLayoutEffect(() => {
		let e = g.current;
		if (!e) return;
		let t = _.current, n = e.offsetHeight;
		if (_.current = n, t === null || t === n || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		e.style.height = `${t}px`, e.style.overflow = "hidden", e.offsetHeight, e.style.transition = "height 200ms ease-out", e.style.height = `${n}px`;
		let r = () => {
			e.style.height = "", e.style.overflow = "", e.style.transition = "", e.removeEventListener("transitionend", r);
		};
		return e.addEventListener("transitionend", r), () => {
			e.removeEventListener("transitionend", r), r();
		};
	}, [m, h.length]), /* @__PURE__ */ P("div", {
		"data-slot": "collapsible-chip-field",
		className: "flex items-start gap-4 py-3",
		children: [t ? /* @__PURE__ */ N("span", {
			className: "typo-label-sm text-[var(--Text-Medium-Emphasis)] flex-shrink-0 w-20 whitespace-nowrap leading-[36px]",
			children: t
		}) : /* @__PURE__ */ N("div", {
			className: "flex-shrink-0 w-6 h-6 flex items-center justify-center",
			style: { height: 36 },
			children: e
		}), /* @__PURE__ */ N("div", {
			ref: g,
			className: "flex gap-2 flex-1 flex-wrap min-h-[36px] items-center",
			children: h.map((e) => /* @__PURE__ */ P(sd, {
				size: "md",
				selected: !d && i === e,
				onClick: () => {
					d ? (a(e), f(!1)) : i === e ? o ? o() : l || f(!0) : a(e);
				},
				children: [c ? `${c(e)} ` : "", s(e)]
			}, e))
		})]
	});
}
//#endregion
//#region src/components/patterns/chip-filter-bar.tsx
var ud = (e) => `${e.toLocaleString("ja-JP")}件`;
function dd({ children: e, resultCount: t, resultCountLabel: n = ud, sticky: r = !1, stickyOffset: i = 0, bare: a = !1, className: o }) {
	return a ? /* @__PURE__ */ N(M, { children: e }) : /* @__PURE__ */ P("div", {
		"data-slot": "chip-filter-bar",
		className: o,
		children: [/* @__PURE__ */ N("div", {
			className: U("flex gap-2 overflow-x-auto scrollbar-hide", r && "sticky z-30 bg-[var(--Surface-Primary)] py-2"),
			style: r ? { top: i } : void 0,
			children: e
		}), t !== void 0 && /* @__PURE__ */ N("p", {
			className: "mt-2 typo-label-xs text-[var(--Text-Low-Emphasis)]",
			children: n(t)
		})]
	});
}
//#endregion
//#region src/components/patterns/banner.tsx
var fd = F("flex items-start gap-3 rounded-lg border border-[var(--Border-Info)] p-4", {
	variants: { variant: {
		info: "border-[var(--Border-Info)] bg-[var(--Surface-Info)] text-[var(--Text-Info)]",
		success: "border-[var(--Border-Success)] bg-[var(--Surface-Success)] text-[var(--Text-Success)]",
		warning: "border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Warning)] text-[var(--Text-Warning)]",
		caution: "border-[var(--Border-Caution)] bg-[var(--Surface-Caution)] text-[var(--Text-Caution)]"
	} },
	defaultVariants: { variant: "info" }
});
function pd({ className: e, variant: t, icon: n, title: r, description: i, action: a, children: o, ...s }) {
	return /* @__PURE__ */ P("div", {
		"data-slot": "banner",
		role: "alert",
		className: U(fd({ variant: t }), e),
		...s,
		children: [
			n && /* @__PURE__ */ N("div", {
				className: "shrink-0 mt-0.5",
				children: n
			}),
			/* @__PURE__ */ P("div", {
				className: "flex-1 min-w-0",
				children: [
					r && /* @__PURE__ */ N("p", {
						className: "typo-label-md text-[var(--Text-High-Emphasis)]",
						children: r
					}),
					i && /* @__PURE__ */ N("p", {
						className: "typo-body-sm mt-1",
						children: i
					}),
					o
				]
			}),
			a && /* @__PURE__ */ N("div", {
				className: "shrink-0",
				children: a
			})
		]
	});
}
//#endregion
//#region src/components/patterns/empty-state.tsx
function md({ className: e, icon: t, title: n, description: r, action: i, actionLabel: a, actionIcon: o, actionLayout: s = "content", actionButtonProps: c, onAction: l, size: u = "default", iconClassName: d, ...f }) {
	let p = u === "inline", m = i ?? (a ? /* @__PURE__ */ P(W, {
		...c,
		onClick: c?.onClick ?? (l ? () => l() : void 0),
		className: U(s === "compact" && "w-auto", s === "content" && "min-w-40 max-w-full", s === "full" && "w-full max-w-sm", c?.className),
		children: [o, a]
	}) : null);
	return /* @__PURE__ */ P("div", {
		"data-slot": "empty-state",
		"data-size": u,
		"data-action-layout": m ? s : void 0,
		className: U("flex justify-center", u === "default" && "flex-col items-center py-16 px-4 text-center", u === "compact" && "flex-col items-center py-8 px-4 text-center", u === "inline" && "flex-row items-center gap-3 py-3 px-4 text-left", e),
		...f,
		children: [t && /* @__PURE__ */ N(Rl, {
			appearance: "plain",
			className: U("text-[var(--Object-Low-Emphasis)]", p ? "shrink-0" : "mb-4", d),
			children: t
		}), /* @__PURE__ */ P("div", {
			className: U(p && "min-w-0 flex-1"),
			children: [
				/* @__PURE__ */ N("h3", {
					className: U("text-[var(--Text-High-Emphasis)]", p ? "typo-label-md" : "typo-heading-md"),
					children: n
				}),
				r && /* @__PURE__ */ N("p", {
					className: U("text-[var(--Text-Medium-Emphasis)]", p ? "typo-body-sm mt-0.5" : "typo-body-md mt-2 max-w-sm"),
					children: r
				}),
				m && /* @__PURE__ */ N("div", {
					"data-slot": "empty-state-action",
					className: U(p ? "mt-3" : "mt-6", s === "full" && "w-full"),
					children: m
				})
			]
		})]
	});
}
//#endregion
//#region src/components/patterns/error-state.tsx
function hd({ className: e, "aria-hidden": t = !0, ...n }) {
	return /* @__PURE__ */ P("svg", {
		...n,
		"data-slot": "not-found-illustration",
		viewBox: "0 0 240 160",
		fill: "none",
		"aria-hidden": t,
		className: U("h-auto w-56 max-w-full text-[var(--Text-Accent-Primary)]", e),
		children: [
			/* @__PURE__ */ N("path", {
				d: "M32 118C32 87.1 57.1 62 88 62H152C182.9 62 208 87.1 208 118V128H32V118Z",
				fill: "var(--Surface-Accent-Primary-Light)"
			}),
			/* @__PURE__ */ N("circle", {
				cx: "58",
				cy: "42",
				r: "12",
				fill: "var(--Surface-Secondary)",
				stroke: "currentColor",
				strokeWidth: "3"
			}),
			/* @__PURE__ */ N("circle", {
				cx: "188",
				cy: "54",
				r: "7",
				fill: "var(--Surface-Primary)",
				stroke: "currentColor",
				strokeWidth: "3"
			}),
			/* @__PURE__ */ N("path", {
				d: "M82 119V58C82 50.3 88.3 44 96 44H146C153.7 44 160 50.3 160 58V119",
				fill: "var(--Surface-Primary)",
				stroke: "currentColor",
				strokeWidth: "4",
				strokeLinejoin: "round"
			}),
			/* @__PURE__ */ N("path", {
				d: "M105 119V86C105 78.3 111.3 72 119 72H123C130.7 72 137 78.3 137 86V119",
				fill: "var(--Surface-Secondary)",
				stroke: "currentColor",
				strokeWidth: "4"
			}),
			/* @__PURE__ */ N("path", {
				d: "M98 59H144M51 128H190",
				stroke: "currentColor",
				strokeWidth: "4",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ N("path", {
				d: "M174 78L190 94M190 78L174 94",
				stroke: "var(--Object-Caution)",
				strokeWidth: "4",
				strokeLinecap: "round"
			})
		]
	});
}
function gd({ className: e, kind: t = "error", icon: n, title: r, description: i, action: a, onRetry: o, retryLabel: s = "再試行", ...c }) {
	let l = t === "notFound", u = n === void 0 && l ? /* @__PURE__ */ N(hd, {}) : n, d = r ?? (l ? "ページが見つかりません" : "エラーが発生しました"), f = i ?? (l ? "お探しのページは移動または削除された可能性があります。" : "しばらくしてからもう一度お試しください");
	return /* @__PURE__ */ P("div", {
		"data-slot": "error-state",
		"data-kind": t,
		className: U("flex flex-col items-center justify-center py-16 px-4 text-center", e),
		...c,
		children: [
			u && /* @__PURE__ */ N("div", {
				className: U("mb-4", l ? "text-[var(--Text-Accent-Primary)]" : "text-[var(--Object-Caution)]"),
				children: u
			}),
			/* @__PURE__ */ N("h3", {
				className: "typo-heading-md text-[var(--Text-High-Emphasis)]",
				children: d
			}),
			f && /* @__PURE__ */ N("p", {
				className: "typo-body-md text-[var(--Text-Medium-Emphasis)] mt-2 max-w-sm",
				children: f
			}),
			a ? /* @__PURE__ */ N("div", {
				className: "mt-6",
				children: a
			}) : o && /* @__PURE__ */ N("button", {
				"data-slot": "button",
				onClick: o,
				className: "mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--Brand-Primary)] px-4 h-10 typo-label-md text-[var(--Text-on-Inverse)] hover:bg-[var(--Hover-Primary-Button)] transition-colors cursor-pointer",
				children: s
			})
		]
	});
}
//#endregion
//#region src/components/patterns/prose.tsx
function _d({ sections: e, className: t, ...n }) {
	return /* @__PURE__ */ N("div", {
		"data-slot": "prose",
		className: U("flex flex-col gap-6", t),
		...n,
		children: e.map((e, t) => /* @__PURE__ */ P("div", {
			className: "flex flex-col gap-2",
			children: [/* @__PURE__ */ N("h2", {
				className: "typo-heading-md text-[var(--Text-High-Emphasis)]",
				children: e.title
			}), e.body.map((e, t) => /* @__PURE__ */ N("p", {
				className: "typo-body-md text-[var(--Text-Medium-Emphasis)]",
				children: e
			}, t))]
		}, t))
	});
}
//#endregion
//#region src/components/patterns/document-page.tsx
function vd({ title: e, lastUpdated: t, children: n, className: r, ...i }) {
	return /* @__PURE__ */ P("main", {
		"data-slot": "document-page",
		className: U("mx-auto flex w-full max-w-2xl flex-col px-4 py-10", r),
		...i,
		children: [/* @__PURE__ */ P("div", {
			className: "flex flex-col gap-1",
			children: [/* @__PURE__ */ N("h1", {
				className: "typo-heading-2xl text-[var(--Text-High-Emphasis)]",
				children: e
			}), t && /* @__PURE__ */ P("p", {
				className: "typo-label-sm text-[var(--Text-Low-Emphasis)]",
				children: ["最終更新日：", t]
			})]
		}), /* @__PURE__ */ N("div", {
			className: "mt-6",
			children: n
		})]
	});
}
//#endregion
//#region src/components/patterns/form-field.tsx
function yd({ className: e, label: t, htmlFor: r, required: i, error: a, description: o, requiredStyle: s = "asterisk", endLabel: c, children: l, ...u }) {
	let d = c != null, f = n.useId(), p = `${f}-desc`, m = `${f}-err`, h = [a ? m : null, o != null && !a ? p : null].filter(Boolean).join(" ") || void 0, g = n.isValidElement(l) ? n.cloneElement(l, {
		"aria-invalid": a ? !0 : l.props["aria-invalid"],
		"aria-describedby": [l.props["aria-describedby"], h].filter(Boolean).join(" ") || void 0
	}) : l;
	return /* @__PURE__ */ P("div", {
		"data-slot": "form-field",
		className: U("flex flex-col gap-1.5", e),
		...u,
		children: [
			/* @__PURE__ */ P("div", {
				className: U(d && "flex items-center justify-between gap-2"),
				children: [/* @__PURE__ */ P("label", {
					htmlFor: r,
					className: "typo-label-md text-[var(--Text-High-Emphasis)] inline-flex items-center gap-1.5",
					children: [
						t,
						s === "asterisk" && i && /* @__PURE__ */ N("span", {
							className: "text-[var(--Brand-Primary)]",
							"aria-hidden": "true",
							children: "*"
						}),
						s === "pill" && /* @__PURE__ */ N("span", {
							className: U("typo-label-xs px-1.5 py-0.5 rounded", i ? "bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Brand-Primary)]" : "bg-[var(--Surface-Tertiary)] text-[var(--Text-Medium-Emphasis)]"),
							"aria-hidden": "true",
							children: i ? "必須" : "任意"
						})
					]
				}), c && /* @__PURE__ */ N("div", {
					"data-slot": "form-field-end-label",
					className: "typo-body-sm text-[var(--Text-Medium-Emphasis)] flex items-center",
					children: c
				})]
			}),
			g,
			o && !a && /* @__PURE__ */ N("p", {
				id: p,
				className: "typo-body-sm text-[var(--Text-Low-Emphasis)]",
				children: o
			}),
			a && /* @__PURE__ */ P("p", {
				id: m,
				className: "typo-body-sm text-[var(--Text-Caution)] flex items-center gap-1",
				role: "alert",
				children: [/* @__PURE__ */ P("svg", {
					width: "14",
					height: "14",
					viewBox: "0 0 14 14",
					fill: "none",
					className: "shrink-0",
					children: [/* @__PURE__ */ N("circle", {
						cx: "7",
						cy: "7",
						r: "6",
						stroke: "currentColor",
						strokeWidth: "1.5"
					}), /* @__PURE__ */ N("path", {
						d: "M7 4V7.5M7 9.5V10",
						stroke: "currentColor",
						strokeWidth: "1.5",
						strokeLinecap: "round"
					})]
				}), a]
			})
		]
	});
}
//#endregion
//#region src/components/patterns/field.tsx
function bd({ className: e, ...t }) {
	return /* @__PURE__ */ N("fieldset", {
		"data-slot": "field-set",
		className: U("m-0 flex min-w-0 flex-col gap-6 border-0 p-0", e),
		...t
	});
}
function xd({ className: e, ...t }) {
	return /* @__PURE__ */ N("legend", {
		"data-slot": "field-legend",
		className: U("typo-heading-md text-[var(--Text-High-Emphasis)]", e),
		...t
	});
}
function Sd({ className: e, ...t }) {
	return /* @__PURE__ */ N("div", {
		...t,
		"data-slot": "field-group",
		role: "group",
		className: U("flex min-w-0 flex-col gap-4", e)
	});
}
function Cd({ className: e, ...t }) {
	return /* @__PURE__ */ N("p", {
		"data-slot": "field-description",
		className: U("typo-body-sm text-[var(--Text-Low-Emphasis)]", e),
		...t
	});
}
function wd({ className: e, children: t, ...r }) {
	return n.Children.toArray(t).length === 0 ? null : /* @__PURE__ */ N("p", {
		...r,
		"data-slot": "field-error",
		role: "alert",
		className: U("typo-body-sm text-[var(--Text-Caution)]", e),
		children: t
	});
}
function Td({ className: e, children: t, ...r }) {
	let i = n.Children.toArray(t).length > 0;
	return /* @__PURE__ */ P("div", {
		"data-slot": "field-separator",
		className: U("flex items-center py-2", e),
		...r,
		children: [/* @__PURE__ */ N(nc, { className: "flex-1" }), i && /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("span", {
			className: "mx-3 shrink-0 typo-caption text-[var(--Text-Low-Emphasis)]",
			children: t
		}), /* @__PURE__ */ N(nc, { className: "flex-1" })] })]
	});
}
//#endregion
//#region src/components/patterns/list-item.tsx
function Ed({ className: e, leftSlot: t, rightSlot: n, bottomSlot: r, title: i, description: a, interactive: o = !1, disabled: s = !1, variant: c = "default", children: l, href: u, onClick: d, ...f }) {
	let p = c === "destructive", m = !!(u || d), h = U("flex w-full items-start gap-3 border-b border-[var(--Border-Low-Emphasis)] px-4 py-3 text-left", (m || o) && (p ? "cursor-pointer transition-colors hover:bg-[var(--Surface-Caution-Subtle)]" : "cursor-pointer transition-colors hover:bg-[var(--Surface-Secondary)]"), m && "min-h-11 focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50", s && "cursor-not-allowed opacity-50", e), g = /* @__PURE__ */ P(M, { children: [
		t && /* @__PURE__ */ N("div", {
			className: "shrink-0",
			children: t
		}),
		/* @__PURE__ */ P("div", {
			className: "flex-1 min-w-0",
			children: [
				i && /* @__PURE__ */ N("p", {
					className: U("typo-label-md truncate", p ? "text-[var(--Caution-Base)]" : "text-[var(--Text-High-Emphasis)]"),
					children: i
				}),
				a && /* @__PURE__ */ N("p", {
					className: "typo-body-sm text-[var(--Text-Medium-Emphasis)] mt-0.5",
					children: a
				}),
				l,
				r && /* @__PURE__ */ N("div", {
					className: "mt-2",
					children: r
				})
			]
		}),
		n && /* @__PURE__ */ N("div", {
			className: "shrink-0",
			children: n
		})
	] });
	return u ? /* @__PURE__ */ N("a", {
		...f,
		href: u,
		"data-slot": "list-item",
		"data-variant": c,
		"aria-disabled": s || void 0,
		className: h,
		onClick: (e) => {
			if (s) {
				e.preventDefault();
				return;
			}
			d?.(e);
		},
		children: g
	}) : d ? /* @__PURE__ */ N("button", {
		...f,
		type: "button",
		"data-slot": "list-item",
		"data-variant": c,
		disabled: s,
		className: h,
		onClick: d,
		children: g
	}) : /* @__PURE__ */ N("div", {
		...f,
		"data-slot": "list-item",
		"data-variant": c,
		className: h,
		children: g
	});
}
//#endregion
//#region src/components/patterns/settings-section.tsx
function Dd({ className: e, title: t, description: n, action: r, variant: i = "group", children: a, ...o }) {
	let s = i === "card" || i === "danger";
	return /* @__PURE__ */ P("section", {
		"data-slot": "settings-section",
		"data-variant": i,
		className: U("flex flex-col gap-3", e),
		...o,
		children: [(t || n || r) && /* @__PURE__ */ P("div", {
			"data-slot": "settings-section-header",
			className: "flex items-start justify-between gap-3 px-1",
			children: [/* @__PURE__ */ P("div", {
				className: "min-w-0 flex-1",
				children: [t && /* @__PURE__ */ N("h2", {
					className: U("typo-heading-sm text-[var(--Text-High-Emphasis)]", i === "danger" && "text-[var(--Text-Caution)]"),
					children: t
				}), n && /* @__PURE__ */ N("p", {
					className: "typo-body-sm mt-1 text-[var(--Text-Medium-Emphasis)]",
					children: n
				})]
			}), r && /* @__PURE__ */ N("div", {
				"data-slot": "settings-section-action",
				className: "shrink-0",
				children: r
			})]
		}), /* @__PURE__ */ N("div", {
			"data-slot": "settings-section-content",
			className: U("flex flex-col", s && ["overflow-hidden rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]", i === "danger" ? "border-[var(--Border-Caution)]" : "border-[var(--Border-Low-Emphasis)]"], !s && "gap-2"),
			children: a
		})]
	});
}
function Od({ className: e, title: t, description: n, leading: r, rightSlot: i, interactive: a = !1, disabled: o = !1, destructive: s = !1, onClick: c, children: l, ...u }) {
	let d = /* @__PURE__ */ P(M, { children: [
		r && /* @__PURE__ */ N("div", {
			"data-slot": "settings-list-row-leading",
			className: "flex size-10 shrink-0 items-center justify-center",
			children: r
		}),
		/* @__PURE__ */ P("div", {
			"data-slot": "settings-list-row-body",
			className: "min-w-0 flex-1",
			children: [
				typeof t == "string" ? /* @__PURE__ */ N("p", {
					className: U("typo-label-md truncate", s ? "text-[var(--Text-Caution)]" : "text-[var(--Text-High-Emphasis)]"),
					children: t
				}) : t,
				n && (typeof n == "string" ? /* @__PURE__ */ N("p", {
					className: "typo-body-sm mt-1 text-[var(--Text-Medium-Emphasis)]",
					children: n
				}) : /* @__PURE__ */ N("div", {
					className: "mt-1",
					children: n
				})),
				l
			]
		}),
		i && /* @__PURE__ */ N("div", {
			"data-slot": "settings-list-row-right",
			className: "shrink-0",
			children: i
		})
	] }), f = U("flex min-h-14 w-full items-center gap-3 border-b border-[var(--Border-Low-Emphasis)] px-4 py-3 text-left last:border-b-0", a && !o && "cursor-pointer transition-colors hover:bg-[var(--Surface-Secondary)]", s && a && !o && "hover:bg-[var(--Surface-Caution-Subtle)]", o && "cursor-not-allowed opacity-50", e);
	return a || c ? /* @__PURE__ */ N("button", {
		"data-slot": "settings-list-row",
		"data-destructive": s || void 0,
		type: "button",
		className: f,
		onClick: c,
		disabled: o,
		children: d
	}) : /* @__PURE__ */ N("div", {
		"data-slot": "settings-list-row",
		"data-destructive": s || void 0,
		className: f,
		...u,
		children: d
	});
}
//#endregion
//#region src/components/patterns/notification-badge.tsx
var kd = {
	xs: "size-1.5 min-w-0 px-0",
	sm: "min-w-4 h-4 px-1 typo-label-xs",
	default: "min-w-5 h-5 px-1.5 typo-label-xs"
};
function Ad({ className: e, count: t, max: n = 99, size: r = "default", ...i }) {
	if (t <= 0) return null;
	let a = t > n ? `${n}+` : t;
	return /* @__PURE__ */ N("span", {
		"data-slot": "notification-badge",
		"data-size": r,
		className: U("inline-flex items-center justify-center rounded-full", "bg-[var(--Caution-Base)] text-[var(--Text-on-Inverse)]", kd[r], e),
		...i,
		children: r !== "xs" && a
	});
}
//#endregion
//#region src/components/patterns/progress-steps.tsx
function jd({ className: e, steps: t, currentStep: r, ...i }) {
	return /* @__PURE__ */ N("div", {
		"data-slot": "progress-steps",
		className: U("flex items-start overflow-x-auto", e),
		role: "progressbar",
		"aria-valuenow": r + 1,
		"aria-valuemin": 1,
		"aria-valuemax": t.length,
		...i,
		children: t.map((e, i) => {
			let a = i < r, o = i === r, s = i === t.length - 1;
			return /* @__PURE__ */ P(n.Fragment, { children: [/* @__PURE__ */ P("div", {
				className: "flex flex-col items-center gap-1.5 shrink-0",
				children: [/* @__PURE__ */ N("div", {
					className: U("flex items-center justify-center size-8 rounded-full typo-label-sm transition-colors", a ? "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)]" : o ? "border-2 border-[var(--Brand-Primary)] text-[var(--Text-Accent-Primary)]" : "border border-[var(--Border-Medium-Emphasis)] text-[var(--Text-Low-Emphasis)]"),
					children: a ? /* @__PURE__ */ N("svg", {
						width: "14",
						height: "14",
						viewBox: "0 0 14 14",
						fill: "none",
						children: /* @__PURE__ */ N("path", {
							d: "M11 4L5.5 9.5L3 7",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							strokeLinejoin: "round"
						})
					}) : i + 1
				}), /* @__PURE__ */ N("span", {
					className: U("typo-label-xs text-center whitespace-nowrap", o ? "text-[var(--Text-High-Emphasis)]" : "text-[var(--Text-Low-Emphasis)]"),
					children: e
				})]
			}), !s && /* @__PURE__ */ N("div", { className: U("flex-1 min-w-6 h-0.5 mt-4 mx-1", a ? "bg-[var(--Brand-Primary)]" : "bg-[var(--Border-Low-Emphasis)]") })] }, i);
		})
	});
}
//#endregion
//#region src/components/patterns/search-bar.tsx
function Md({ className: e, onSearch: t, ...n }) {
	return /* @__PURE__ */ P("div", {
		"data-slot": "search-bar",
		className: U("relative w-full", e),
		children: [/* @__PURE__ */ P("svg", {
			width: "20",
			height: "20",
			viewBox: "0 0 20 20",
			fill: "none",
			className: "absolute left-3 top-1/2 -translate-y-1/2 text-[var(--Object-Medium-Emphasis)]",
			"aria-hidden": "true",
			children: [/* @__PURE__ */ N("circle", {
				cx: "9",
				cy: "9",
				r: "6",
				stroke: "currentColor",
				strokeWidth: "2"
			}), /* @__PURE__ */ N("path", {
				d: "M13.5 13.5L17 17",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round"
			})]
		}), /* @__PURE__ */ N("input", {
			type: "search",
			"data-slot": "input",
			className: U("flex h-12 w-full rounded-full border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] pl-10 pr-4 typo-body-md text-[var(--Text-High-Emphasis)]", "placeholder:text-[var(--Text-Low-Emphasis)]", "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50 focus-visible:border-[var(--Border-Accent-Primary)]", "disabled:cursor-not-allowed disabled:opacity-50"),
			onKeyDown: (e) => {
				e.key === "Enter" && t && t(e.currentTarget.value);
			},
			...n
		})]
	});
}
//#endregion
//#region src/components/patterns/section-header.tsx
function Nd({ className: e, title: t, description: n, action: r, ...i }) {
	return /* @__PURE__ */ P("div", {
		"data-slot": "section-header",
		className: U("flex items-center justify-between gap-4", e),
		...i,
		children: [/* @__PURE__ */ P("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ N("h2", {
				className: "typo-heading-lg text-[var(--Text-High-Emphasis)]",
				children: t
			}), n && /* @__PURE__ */ N("p", {
				className: "typo-body-sm text-[var(--Text-Medium-Emphasis)] mt-1",
				children: n
			})]
		}), r && /* @__PURE__ */ N("div", {
			className: "shrink-0",
			children: r
		})]
	});
}
//#endregion
//#region src/components/patterns/stat-card.tsx
var Pd = {
	default: {
		card: "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]",
		icon: "text-[var(--Object-Medium-Emphasis)]",
		hoverBg: "hover:bg-[var(--Surface-Secondary)]"
	},
	success: {
		card: "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Success)]",
		icon: "text-[var(--Object-Success)]",
		hoverBg: "hover:brightness-[0.98]"
	},
	caution: {
		card: "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Caution)]",
		icon: "text-[var(--Object-Caution)]",
		hoverBg: "hover:brightness-[0.98]"
	},
	info: {
		card: "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Info)]",
		icon: "text-[var(--Text-Info)]",
		hoverBg: "hover:brightness-[0.98]"
	},
	accent: {
		card: "border-[var(--Brand-Primary)]/20 bg-[var(--Surface-Accent-Primary-Light)]",
		icon: "text-[var(--Object-Accent-Primary)]",
		hoverBg: "hover:brightness-[0.98]"
	}
};
function Fd({ className: e, label: t, value: n, unit: r, trend: i, icon: a, variant: o = "default", interactive: s, onClick: c, ...l }) {
	let u = Pd[o], d = s ?? !!c;
	return /* @__PURE__ */ P("div", {
		"data-slot": "stat-card",
		"data-variant": o,
		"data-interactive": d || void 0,
		role: d ? "button" : void 0,
		tabIndex: d ? 0 : void 0,
		onClick: d ? c : void 0,
		onKeyDown: d ? (e) => {
			!d || !c || (e.key === "Enter" || e.key === " ") && (e.preventDefault(), c(e));
		} : void 0,
		className: U("flex flex-col gap-2 rounded-lg border border-[var(--Border-Low-Emphasis)] p-4 shadow-[var(--shadow-md)]", u.card, d && [
			"cursor-pointer transition-all",
			u.hoverBg,
			"active:scale-[0.98]",
			"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--Focus-High-Emphasis)] focus-visible:ring-offset-2"
		], e),
		...l,
		children: [
			/* @__PURE__ */ P("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ N("span", {
					className: "typo-body-sm text-[var(--Text-Medium-Emphasis)]",
					children: t
				}), a && /* @__PURE__ */ N("span", {
					className: u.icon,
					children: a
				})]
			}),
			/* @__PURE__ */ P("div", {
				className: "flex items-baseline gap-1",
				children: [/* @__PURE__ */ N("span", {
					className: "typo-heading-2xl text-[var(--Text-High-Emphasis)]",
					children: n
				}), r && /* @__PURE__ */ N("span", {
					className: "typo-body-sm text-[var(--Text-Medium-Emphasis)]",
					children: r
				})]
			}),
			i && /* @__PURE__ */ P("div", {
				className: U("typo-body-sm flex items-center gap-1", i.value >= 0 ? "text-[var(--Text-Success)]" : "text-[var(--Text-Caution)]"),
				children: [/* @__PURE__ */ P("span", { children: [
					i.value >= 0 ? "+" : "",
					i.value,
					"%"
				] }), i.label && /* @__PURE__ */ N("span", {
					className: "text-[var(--Text-Low-Emphasis)]",
					children: i.label
				})]
			})
		]
	});
}
//#endregion
//#region src/components/patterns/tag.tsx
var Id = F("inline-flex items-center rounded-sm px-2 py-0.5 typo-label-xs whitespace-nowrap", {
	variants: { variant: {
		default: "bg-[var(--Surface-Secondary)] text-[var(--Text-High-Emphasis)]",
		brand: "bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)]",
		caution: "bg-[var(--Surface-Caution)] text-[var(--Text-Caution)]",
		success: "bg-[var(--Surface-Success)] text-[var(--Text-Success)]",
		warning: "bg-[var(--Surface-Warning)] text-[var(--Text-Warning)]",
		info: "bg-[var(--Surface-Info)] text-[var(--Text-Info)]"
	} },
	defaultVariants: { variant: "default" }
});
function Ld({ className: e, variant: t, ...n }) {
	return /* @__PURE__ */ N("span", {
		"data-slot": "tag",
		className: U(Id({ variant: t }), e),
		...n
	});
}
//#endregion
//#region src/components/ui/responsive-dialog.tsx
function Rd(e) {
	let [t, r] = n.useState(!1);
	return n.useEffect(() => {
		let t = window.matchMedia(e);
		r(t.matches);
		let n = (e) => r(e.matches);
		return t.addEventListener("change", n), () => t.removeEventListener("change", n);
	}, [e]), t;
}
function zd({ children: e, ...t }) {
	return Rd("(min-width: 768px)") ? /* @__PURE__ */ N(vt, {
		...t,
		children: e
	}) : /* @__PURE__ */ N(yc, {
		...t,
		children: e
	});
}
function Bd({ children: e, ...t }) {
	return Rd("(min-width: 768px)") ? /* @__PURE__ */ N(yt, {
		...t,
		children: e
	}) : /* @__PURE__ */ N(bc, {
		...t,
		children: e
	});
}
function Vd({ children: e, className: t, swipeToClose: n, ...r }) {
	return Rd("(min-width: 768px)") ? /* @__PURE__ */ N(Ct, {
		className: t,
		...r,
		children: e
	}) : /* @__PURE__ */ N(Vc, {
		side: "bottom",
		swipeToClose: n,
		className: t,
		children: e
	});
}
function Hd({ children: e, ...t }) {
	return Rd("(min-width: 768px)") ? /* @__PURE__ */ N(wt, {
		...t,
		children: e
	}) : /* @__PURE__ */ N(Kc, {
		...t,
		children: e
	});
}
function Ud({ children: e, ...t }) {
	return Rd("(min-width: 768px)") ? /* @__PURE__ */ N(Et, {
		...t,
		children: e
	}) : /* @__PURE__ */ N(Jc, {
		...t,
		children: e
	});
}
function Wd({ children: e, ...t }) {
	return Rd("(min-width: 768px)") ? /* @__PURE__ */ N(Dt, {
		...t,
		children: e
	}) : /* @__PURE__ */ N(Yc, {
		...t,
		children: e
	});
}
function Gd({ children: e, className: t, orientation: n = "split", ...r }) {
	return Rd("(min-width: 768px)") ? /* @__PURE__ */ N(Tt, {
		className: t,
		orientation: n,
		...r,
		children: e
	}) : /* @__PURE__ */ N("div", {
		"data-slot": "sheet-footer",
		"data-orientation": n,
		className: U(n === "stacked" ? "flex flex-col gap-2 mt-auto" : "flex flex-row gap-3 [&>*]:flex-1 [&>*]:basis-0 mt-auto", t),
		...r,
		children: e
	});
}
function Kd({ children: e, ...t }) {
	return Rd("(min-width: 768px)") ? /* @__PURE__ */ N(xt, {
		...t,
		children: e
	}) : /* @__PURE__ */ N(xc, {
		...t,
		children: e
	});
}
//#endregion
//#region src/components/ui/toast.tsx
var qd = F("relative flex w-full items-center gap-3 overflow-hidden rounded-lg border border-[var(--Border-Low-Emphasis)] p-4 shadow-[var(--shadow-lg)] transition-all animate-fade-in-up", {
	variants: { variant: {
		default: "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)]",
		success: "border-[var(--Border-Success)] bg-[var(--Surface-Success)] text-[var(--Text-Success)]",
		caution: "border-[var(--Border-Caution)] bg-[var(--Surface-Caution)] text-[var(--Text-Caution)]",
		warning: "border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Warning)] text-[var(--Text-Warning)]",
		info: "border-[var(--Border-Info)] bg-[var(--Surface-Info)] text-[var(--Text-Info)]"
	} },
	defaultVariants: { variant: "default" }
}), Jd = 0;
function Yd() {
	return Jd += 1, `t${Date.now().toString(36)}-${Jd.toString(36)}`;
}
var $ = {
	toasts: [],
	listeners: /* @__PURE__ */ new Set(),
	add(e) {
		let t = Yd(), n = {
			id: t,
			...e
		};
		$.toasts = [...$.toasts, n], $.listeners.forEach((e) => e());
		let r = e.duration ?? 5e3;
		return r > 0 && typeof window < "u" && window.setTimeout(() => $.dismiss(t), r), t;
	},
	dismiss(e) {
		let t = $.toasts.length;
		$.toasts = $.toasts.filter((t) => t.id !== e), $.toasts.length !== t && $.listeners.forEach((e) => e());
	},
	subscribe(e) {
		return $.listeners.add(e), () => {
			$.listeners.delete(e);
		};
	}
}, Xd = 0, Zd = /* @__PURE__ */ new Set();
function Qd(e) {
	Xd += e, Zd.forEach((e) => e());
}
function $d(e) {
	return Zd.add(e), () => {
		Zd.delete(e);
	};
}
function ef() {
	let e = n.useCallback((e) => $.subscribe(e), []), t = n.useCallback(() => $.toasts, []), r = n.useCallback(() => [], []);
	return n.useSyncExternalStore(e, t, r);
}
function tf() {
	let e = n.useCallback((e) => $d(e), []), t = n.useCallback(() => Xd > 0, []), r = n.useCallback(() => !1, []);
	return n.useSyncExternalStore(e, t, r);
}
var nf = n.createContext(null);
function rf() {
	return n.useContext(nf) ?? { toast: (e) => $.add(e) };
}
function af() {
	let e = ef();
	return typeof document > "u" ? null : de(/* @__PURE__ */ N("div", {
		"data-slot": "toast-viewport",
		role: "region",
		"aria-label": "通知",
		"aria-live": "polite",
		className: "fixed bottom-4 right-4 left-4 sm:left-auto z-50 flex flex-col items-stretch gap-2 sm:w-full sm:max-w-sm",
		children: e.map((e) => /* @__PURE__ */ P("div", {
			"data-slot": "toast",
			"data-variant": e.variant ?? "default",
			role: e.variant === "caution" ? "alert" : void 0,
			className: U(qd({ variant: e.variant })),
			children: [
				/* @__PURE__ */ P("div", {
					className: "flex-1 min-w-0",
					children: [/* @__PURE__ */ N("p", {
						className: "typo-label-md",
						children: e.title
					}), e.description && /* @__PURE__ */ N("p", {
						className: "typo-body-sm mt-0.5 opacity-80",
						children: e.description
					})]
				}),
				e.action && /* @__PURE__ */ N("button", {
					"data-slot": "toast-action",
					onClick: () => e.action.onClick(),
					className: "shrink-0 typo-label-sm underline underline-offset-2 hover:no-underline cursor-pointer",
					children: e.action.label
				}),
				/* @__PURE__ */ N("button", {
					"data-slot": "button",
					onClick: () => $.dismiss(e.id),
					className: "shrink-0 text-[var(--Object-Medium-Emphasis)] hover:text-[var(--Object-High-Emphasis)] cursor-pointer",
					"aria-label": "閉じる",
					children: /* @__PURE__ */ N("svg", {
						width: "16",
						height: "16",
						viewBox: "0 0 16 16",
						fill: "none",
						children: /* @__PURE__ */ N("path", {
							d: "M4 4L12 12M12 4L4 12",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round"
						})
					})
				})
			]
		}, e.id))
	}), document.body);
}
function of({ children: e }) {
	n.useEffect(() => (Qd(1), () => Qd(-1)), []);
	let t = n.useCallback((e) => {
		$.add(e);
	}, []);
	return /* @__PURE__ */ P(nf.Provider, {
		value: { toast: t },
		children: [e, /* @__PURE__ */ N(af, {})]
	});
}
function sf() {
	return tf() ? null : /* @__PURE__ */ N(af, {});
}
var cf = null;
function lf() {
	if (typeof window > "u" || typeof document > "u" || cf) return;
	if (!document.body) {
		cf = new Promise((e) => {
			let t = () => {
				document.body ? (cf = null, lf(), e()) : window.setTimeout(t, 0);
			};
			t();
		});
		return;
	}
	if (document.querySelector("[data-ksk-toast-auto-root]")) return;
	let e = document.createElement("div");
	e.setAttribute("data-ksk-toast-auto-root", ""), document.body.appendChild(e), cf = import("react-dom/client").then(({ createRoot: t }) => {
		t(e).render(/* @__PURE__ */ N(sf, {}));
	});
}
function uf(e, t = {}, n) {
	return typeof window > "u" ? "" : (lf(), $.add({
		title: e,
		description: t.description,
		variant: n ?? t.variant,
		duration: t.duration,
		action: t.action
	}));
}
var df = ((e, t) => uf(e, t));
df.success = (e, t) => uf(e, t, "success"), df.error = (e, t) => uf(e, t, "caution"), df.info = (e, t) => uf(e, t, "info"), df.warning = (e, t) => uf(e, t, "warning"), df.caution = (e, t) => uf(e, t, "caution"), df.connectionRestored = (e) => uf("接続が復旧しました", e, "success"), df.saveComplete = (e) => uf("保存しました", e, "success"), df.retryStarted = (e) => uf("再試行を開始しました", e, "info"), df.retryFailed = (e) => uf("再試行できませんでした", e, "caution"), df.dismiss = (e) => $.dismiss(e);
//#endregion
//#region src/components/ui/skip-link.tsx
function ff({ targetId: e, label: t = "コンテンツへ移動", className: n, onClick: r, ...i }) {
	let a = (t) => {
		if (r?.(t), t.defaultPrevented) return;
		let n = document.getElementById(e);
		n && (t.preventDefault(), n.focus({ preventScroll: !0 }), n.scrollIntoView({ block: "start" }), window.history.replaceState(null, "", `#${encodeURIComponent(e)}`));
	};
	return /* @__PURE__ */ N("a", {
		...i,
		href: `#${e}`,
		"data-slot": "skip-link",
		onClick: a,
		className: U("fixed left-4 top-4 z-50 flex min-h-11 -translate-y-24 items-center rounded-lg border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] px-4 py-2 typo-label-md text-[var(--Text-High-Emphasis)] shadow-[var(--shadow-lg)] transition-transform", "focus:translate-y-0 focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50", n),
		children: t
	});
}
//#endregion
//#region src/components/ui/container.tsx
var pf = F("mx-auto w-full", {
	variants: {
		size: {
			narrow: "max-w-3xl",
			page: "max-w-6xl",
			wide: "max-w-7xl",
			fluid: "max-w-none"
		},
		gutter: {
			none: "",
			tight: "px-4",
			default: "px-6",
			spacious: "px-6 lg:px-16"
		}
	},
	defaultVariants: {
		size: "page",
		gutter: "default"
	}
});
function mf({ className: e, size: t, gutter: n, ...r }) {
	return /* @__PURE__ */ N("div", {
		"data-slot": "container",
		"data-size": t ?? "page",
		"data-gutter": n ?? "default",
		className: U(pf({
			size: t,
			gutter: n
		}), e),
		...r
	});
}
//#endregion
//#region src/components/ui/section.tsx
var hf = F("w-full", {
	variants: {
		spacing: {
			sm: "py-[var(--Space-Section-xs)]",
			md: "py-[var(--Space-Section-md)]",
			lg: "py-[var(--Space-Section-xl)]",
			xl: "py-[var(--Space-Section-2xl)]"
		},
		background: {
			none: "bg-transparent",
			subtle: "bg-[var(--Surface-Secondary)]",
			"accent-subtle": "bg-[var(--Surface-Accent-Primary-Light)]"
		}
	},
	defaultVariants: {
		spacing: "md",
		background: "none"
	}
});
function gf({ as: e = "section", className: t, spacing: n, background: r, ...i }) {
	return /* @__PURE__ */ N(e, {
		"data-slot": "section",
		"data-spacing": n ?? "md",
		"data-background": r ?? "none",
		className: U(hf({
			spacing: n,
			background: r
		}), t),
		...i
	});
}
//#endregion
//#region src/components/patterns/shells/admin-shell.tsx
function _f({ className: e, sidebar: t, header: n, children: r, sidebarWidth: i = "w-64", mainId: a = "main-content", skipLink: o = !0, skipLinkLabel: s = "コンテンツへ移動", ...c }) {
	return /* @__PURE__ */ P("div", {
		"data-slot": "admin-shell",
		className: U("flex h-screen bg-[var(--Surface-Secondary)]", e),
		...c,
		children: [
			o && s && /* @__PURE__ */ N(ff, {
				targetId: a,
				label: s
			}),
			/* @__PURE__ */ N("aside", {
				"data-slot": "admin-sidebar",
				className: U("hidden lg:flex flex-col border-r border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]", i),
				children: /* @__PURE__ */ N(Ds, {
					className: "flex-1",
					children: t
				})
			}),
			/* @__PURE__ */ P("div", {
				className: "flex flex-1 flex-col min-w-0",
				children: [n && /* @__PURE__ */ N("header", {
					"data-slot": "admin-header",
					className: "h-16 shrink-0 border-b border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]",
					children: /* @__PURE__ */ N(mf, {
						size: "fluid",
						className: "flex h-full items-center gap-4",
						children: n
					})
				}), /* @__PURE__ */ N("main", {
					id: a,
					tabIndex: -1,
					"data-slot": "admin-main",
					className: "flex-1 overflow-auto",
					children: /* @__PURE__ */ N(mf, {
						size: "fluid",
						className: "py-6",
						children: r
					})
				})]
			})
		]
	});
}
//#endregion
//#region src/components/patterns/shells/app-shell.tsx
function vf({ className: e, topBar: t, bottomNav: n, mainId: r = "main-content", skipLink: i = !0, skipLinkLabel: a = "コンテンツへ移動", children: o, ...s }) {
	return /* @__PURE__ */ P("div", {
		"data-slot": "app-shell",
		className: U("flex flex-col min-h-screen bg-[var(--Surface-Primary)]", e),
		...s,
		children: [
			i && a && /* @__PURE__ */ N(ff, {
				targetId: r,
				label: a
			}),
			t && /* @__PURE__ */ N("header", {
				"data-slot": "app-topbar",
				className: "sticky top-0 z-40 h-14 shrink-0 border-b border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]",
				children: /* @__PURE__ */ N(mf, {
					size: "fluid",
					gutter: "tight",
					className: "flex h-full items-center",
					children: t
				})
			}),
			/* @__PURE__ */ N("main", {
				id: r,
				tabIndex: -1,
				"data-slot": "app-main",
				className: U("flex-1", n ? "pb-16" : ""),
				children: o
			}),
			n && /* @__PURE__ */ N("nav", {
				"data-slot": "app-bottomnav",
				className: "fixed bottom-0 inset-x-0 z-40 flex items-center justify-around border-t border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] h-14",
				children: n
			})
		]
	});
}
//#endregion
//#region src/components/patterns/shells/marketing-shell.tsx
function yf({ className: e, header: t, footer: n, mainId: r = "main-content", skipLink: i = !0, skipLinkLabel: a = "コンテンツへ移動", children: o, ...s }) {
	return /* @__PURE__ */ P("div", {
		"data-slot": "marketing-shell",
		className: U("flex flex-col min-h-screen bg-[var(--Surface-Primary)]", e),
		...s,
		children: [
			i && a && /* @__PURE__ */ N(ff, {
				targetId: r,
				label: a
			}),
			t && /* @__PURE__ */ N("header", {
				"data-slot": "marketing-header",
				className: "sticky top-0 z-40 h-16 shrink-0 border-b border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]/95 backdrop-blur",
				children: /* @__PURE__ */ N(mf, {
					size: "fluid",
					gutter: "spacious",
					className: "flex h-full items-center justify-between",
					children: t
				})
			}),
			/* @__PURE__ */ N("main", {
				id: r,
				tabIndex: -1,
				"data-slot": "marketing-main",
				className: "flex-1",
				children: o
			}),
			n && /* @__PURE__ */ N(gf, {
				as: "footer",
				spacing: "md",
				background: "subtle",
				"data-slot": "marketing-footer",
				className: "border-t border-[var(--Border-Low-Emphasis)]",
				children: /* @__PURE__ */ N(mf, {
					size: "fluid",
					gutter: "spacious",
					children: n
				})
			})
		]
	});
}
//#endregion
//#region src/components/patterns/form.tsx
function bf({ className: e, preventDefault: t = !0, onSubmit: n, ...r }) {
	return /* @__PURE__ */ N("form", {
		"data-slot": "form",
		className: U("flex flex-col gap-6", e),
		onSubmit: (e) => {
			t && e.preventDefault(), n?.(e);
		},
		...r
	});
}
function xf({ className: e, title: t, description: n, children: r, ...i }) {
	return /* @__PURE__ */ P("fieldset", {
		"data-slot": "form-section",
		className: U("flex flex-col gap-4", e),
		...i,
		children: [(t || n) && /* @__PURE__ */ P("div", {
			className: "flex flex-col gap-1",
			children: [t && /* @__PURE__ */ N("legend", {
				className: "typo-heading-md text-[var(--Text-High-Emphasis)]",
				children: t
			}), n && /* @__PURE__ */ N("p", {
				className: "typo-body-sm text-[var(--Text-Medium-Emphasis)]",
				children: n
			})]
		}), r]
	});
}
function Sf({ className: e, ...t }) {
	return /* @__PURE__ */ N("div", {
		"data-slot": "form-actions",
		className: U("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3 pt-4", e),
		...t
	});
}
//#endregion
//#region src/components/patterns/commerce/price-display.tsx
var Cf = F("inline-flex items-baseline gap-0.5 text-[var(--Text-High-Emphasis)]", {
	variants: { size: {
		sm: "typo-label-md",
		md: "typo-label-lg",
		lg: "typo-heading-lg",
		xl: "typo-heading-3xl"
	} },
	defaultVariants: { size: "md" }
}), wf = {
	sm: "typo-body-xs",
	md: "typo-body-sm",
	lg: "typo-body-md",
	xl: "typo-body-lg"
}, Tf = {
	sm: "typo-body-xs",
	md: "typo-body-xs",
	lg: "typo-body-sm",
	xl: "typo-body-lg"
};
function Ef({ className: e, price: t, maxPrice: n, originalPrice: r, showTaxLabel: i = !0, currency: a = "¥", size: o = "md", ...s }) {
	let c = (e) => e.toLocaleString("ja-JP"), l = r != null && r > t, u = n != null && n > t, d = o ?? "md";
	return /* @__PURE__ */ P("div", {
		"data-slot": "price-display",
		className: U("flex flex-col", e),
		role: "group",
		"aria-label": `${a}${c(t)} 税込`,
		...s,
		children: [l && /* @__PURE__ */ P("span", {
			"aria-hidden": !0,
			className: U("text-[var(--Text-Low-Emphasis)] line-through", wf[d]),
			children: [a, c(r)]
		}), /* @__PURE__ */ P("span", {
			"aria-hidden": !0,
			className: U(Cf({ size: o }), l && "text-[var(--Text-Caution)]"),
			children: [u ? /* @__PURE__ */ P(M, { children: [
				a,
				c(t),
				"〜",
				a,
				c(n)
			] }) : /* @__PURE__ */ P(M, { children: [a, c(t)] }), i && /* @__PURE__ */ N("span", {
				className: U("ml-0.5 text-[var(--Text-Low-Emphasis)]", Tf[d]),
				children: "税込"
			})]
		})]
	});
}
//#endregion
//#region src/components/patterns/commerce/rating-display.tsx
function Df({ size: e = 14, className: t }) {
	return /* @__PURE__ */ N("svg", {
		width: e,
		height: e,
		viewBox: "0 0 16 16",
		fill: "currentColor",
		className: t,
		"aria-hidden": !0,
		children: /* @__PURE__ */ N("path", { d: "M8 1.3l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9L4.4 12.3l.7-4L2.2 5.5l4-.6L8 1.3z" })
	});
}
var Of = {
	sm: {
		icon: 12,
		val: "typo-label-sm",
		cnt: "typo-body-xs"
	},
	md: {
		icon: 14,
		val: "typo-label-md",
		cnt: "typo-body-sm"
	},
	lg: {
		icon: 18,
		val: "typo-label-lg",
		cnt: "typo-body-md"
	}
};
function kf({ className: e, rating: t, reviewCount: n, size: r = "sm", showCount: i = !0, showValue: a = !0, ...o }) {
	let s = Math.max(0, Math.min(5, t)), { icon: c, val: l, cnt: u } = Of[r];
	return /* @__PURE__ */ P("div", {
		"data-slot": "rating-display",
		className: U("inline-flex items-center gap-0.5", e),
		role: "img",
		"aria-label": `評価 ${s.toFixed(1)} / 5${n == null ? "" : ` (${n}件)`}`,
		...o,
		children: [
			/* @__PURE__ */ N(Df, {
				size: c,
				className: "text-[var(--Object-High-Emphasis)]"
			}),
			a && /* @__PURE__ */ N("span", {
				className: U("text-[var(--Text-High-Emphasis)]", l),
				children: s.toFixed(2)
			}),
			i && n != null && /* @__PURE__ */ P("span", {
				className: U("text-[var(--Text-Low-Emphasis)]", u),
				children: [
					"(",
					n.toLocaleString("ja-JP"),
					")"
				]
			})
		]
	});
}
//#endregion
//#region src/components/patterns/commerce/quantity-selector.tsx
function Af({ size: e = 14 }) {
	return /* @__PURE__ */ N("svg", {
		width: e,
		height: e,
		viewBox: "0 0 16 16",
		fill: "none",
		children: /* @__PURE__ */ N("path", {
			d: "M4 8h8",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round"
		})
	});
}
function jf({ size: e = 14 }) {
	return /* @__PURE__ */ N("svg", {
		width: e,
		height: e,
		viewBox: "0 0 16 16",
		fill: "none",
		children: /* @__PURE__ */ N("path", {
			d: "M8 4v8M4 8h8",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round"
		})
	});
}
function Mf({ size: e = 14 }) {
	return /* @__PURE__ */ N("svg", {
		width: e,
		height: e,
		viewBox: "0 0 16 16",
		fill: "none",
		children: /* @__PURE__ */ N("path", {
			d: "M3 4h10M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1M5 4v8a1 1 0 001 1h4a1 1 0 001-1V4",
			stroke: "currentColor",
			strokeWidth: "1.5",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})
	});
}
function Nf({ className: e, value: t, min: n = 1, max: r = 99, onChange: i, disabled: a = !1, size: o = "md", showTrash: s = !1, onDelete: c, ...l }) {
	let u = s && t <= n, d = t > n && !a, f = t < r && !a, p = () => {
		if (u) {
			c?.();
			return;
		}
		d && i?.(t - 1);
	}, m = () => {
		f && i?.(t + 1);
	};
	return o === "sm" ? /* @__PURE__ */ P("div", {
		"data-slot": "quantity-selector",
		className: U("inline-flex h-9 w-[108px] items-center justify-between rounded-full bg-[var(--Surface-Tertiary)] px-2.5", a && "opacity-50", e),
		role: "group",
		"aria-label": "数量選択",
		...l,
		children: [
			/* @__PURE__ */ N("button", {
				type: "button",
				className: U("flex size-7 items-center justify-center rounded-full", d || u ? "text-[var(--Object-High-Emphasis)]" : "text-[var(--Object-Disable)]"),
				onClick: p,
				disabled: !(d || u && !a),
				"aria-label": u ? "削除" : "数量を減らす",
				children: N(u ? Mf : Af, { size: 14 })
			}),
			/* @__PURE__ */ N("span", {
				className: U("w-7 text-center typo-label-md select-none", a ? "text-[var(--Text-Disable)]" : "text-[var(--Text-High-Emphasis)]"),
				"aria-live": "polite",
				children: t
			}),
			/* @__PURE__ */ N("button", {
				type: "button",
				className: U("flex size-7 items-center justify-center rounded-full", f ? "text-[var(--Object-High-Emphasis)]" : "text-[var(--Object-Disable)]"),
				onClick: m,
				disabled: !f,
				"aria-label": "数量を増やす",
				children: /* @__PURE__ */ N(jf, { size: 14 })
			})
		]
	}) : /* @__PURE__ */ P("div", {
		"data-slot": "quantity-selector",
		className: U("inline-flex items-center gap-3", e),
		role: "group",
		"aria-label": "数量選択",
		...l,
		children: [
			/* @__PURE__ */ N("button", {
				type: "button",
				className: U("flex size-10 items-center justify-center rounded-full border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] transition-colors", d || u ? "text-[var(--Object-High-Emphasis)] hover:bg-[var(--Surface-Tertiary)]" : "text-[var(--Object-Disable)]"),
				onClick: p,
				disabled: !(d || u && !a),
				"aria-label": u ? "削除" : "数量を減らす",
				children: N(u ? Mf : Af, { size: 18 })
			}),
			/* @__PURE__ */ N("span", {
				className: U("flex h-10 w-12 items-center justify-center rounded-lg border border-[var(--Border-Medium-Emphasis)] typo-label-lg select-none", a ? "bg-[var(--Surface-Tertiary)] text-[var(--Text-Disable)]" : "bg-[var(--Surface-Secondary)] text-[var(--Text-High-Emphasis)]"),
				"aria-live": "polite",
				children: t
			}),
			/* @__PURE__ */ N("button", {
				type: "button",
				className: U("flex size-10 items-center justify-center rounded-full border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] transition-colors", f ? "text-[var(--Object-High-Emphasis)] hover:bg-[var(--Surface-Tertiary)]" : "text-[var(--Object-Disable)]"),
				onClick: m,
				disabled: !f,
				"aria-label": "数量を増やす",
				children: /* @__PURE__ */ N(jf, { size: 18 })
			})
		]
	});
}
//#endregion
//#region src/components/patterns/commerce/order-summary.tsx
function Pf({ className: e, lineItems: t, totalLabel: n = "合計（税込）", totalValue: r, ctaLabel: i, onCTAClick: a, ctaDisabled: o = !1, fixed: s = !1, ...c }) {
	let l = /* @__PURE__ */ P("div", {
		className: "space-y-3 px-4 py-3",
		children: [
			t?.map((e) => /* @__PURE__ */ P("div", {
				className: "flex items-center justify-between typo-body-md",
				children: [/* @__PURE__ */ N("span", {
					className: "text-[var(--Text-Medium-Emphasis)]",
					children: e.label
				}), /* @__PURE__ */ N("span", {
					className: "text-[var(--Text-High-Emphasis)]",
					children: e.value
				})]
			}, e.label)),
			t && t.length > 0 && /* @__PURE__ */ N("hr", { className: "border-[var(--Border-Low-Emphasis)]" }),
			/* @__PURE__ */ P("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ N("span", {
					className: "typo-heading-md text-[var(--Text-High-Emphasis)]",
					children: n
				}), /* @__PURE__ */ N("span", {
					className: "typo-heading-lg text-[var(--Text-High-Emphasis)]",
					children: r
				})]
			}),
			/* @__PURE__ */ N(W, {
				size: "xl",
				className: "w-full",
				onClick: a,
				disabled: o,
				children: i
			})
		]
	});
	return /* @__PURE__ */ N("div", {
		"data-slot": "order-summary",
		className: U("border-t border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]", s && "fixed inset-x-0 bottom-0 z-30 mx-auto max-w-lg", e),
		...c,
		children: l
	});
}
//#endregion
//#region src/components/patterns/commerce/product-card.tsx
function Ff({ filled: e = !1, size: t = 20 }) {
	return /* @__PURE__ */ N("svg", {
		width: t,
		height: t,
		viewBox: "0 0 24 24",
		fill: e ? "var(--Caution-Base)" : "none",
		stroke: e ? "var(--Caution-Base)" : "var(--Object-High-Emphasis)",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: /* @__PURE__ */ N("path", { d: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" })
	});
}
function If({ label: e, variant: t = "default" }) {
	return /* @__PURE__ */ N("span", {
		className: U("inline-flex items-center rounded-sm px-1.5 py-0.5 typo-label-xs", {
			default: "bg-[var(--Surface-Secondary)] text-[var(--Text-High-Emphasis)]",
			brand: "bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)]",
			caution: "bg-[var(--Surface-Caution)] text-[var(--Text-Caution)]",
			success: "bg-[var(--Surface-Success)] text-[var(--Text-Success)]"
		}[t]),
		children: e
	});
}
function Lf({ className: e, name: t, imageUrl: n, imageAlt: r, price: i, originalPrice: a, rating: o, reviewCount: s, shopName: c, tags: l = [], isFavorite: u = !1, onFavoriteToggle: d, href: f, onCardClick: p, ranking: m, deliveryLabel: h, orientation: g = "vertical", showCartButton: _ = !1, onCartAdd: v, cartButtonLabel: y = "カートに追加", ...b }) {
	let x = a && a > i ? Math.round((a - i) / a * 100) : null, S = f ? /* @__PURE__ */ N("a", {
		href: f,
		"data-slot": "card-link",
		className: "absolute inset-0 z-[1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--Focus-High-Emphasis)] rounded-lg",
		"aria-label": t,
		children: /* @__PURE__ */ N("span", {
			className: "sr-only",
			children: t
		})
	}) : p ? /* @__PURE__ */ N("button", {
		type: "button",
		"data-slot": "card-link",
		className: "absolute inset-0 z-[1] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--Focus-High-Emphasis)] rounded-lg",
		"aria-label": t,
		onClick: p,
		children: /* @__PURE__ */ N("span", {
			className: "sr-only",
			children: t
		})
	}) : null;
	return g === "horizontal" ? /* @__PURE__ */ P("div", {
		"data-slot": "product-card",
		"data-orientation": "horizontal",
		className: U("group relative flex rounded-lg bg-[var(--Surface-Primary)]", e),
		...b,
		children: [
			S,
			/* @__PURE__ */ P("div", {
				className: "relative h-auto w-28 shrink-0 overflow-hidden rounded-lg",
				children: [/* @__PURE__ */ N("img", {
					src: n,
					alt: r ?? t,
					className: "h-full w-full object-cover",
					loading: "lazy"
				}), d && /* @__PURE__ */ N("div", {
					className: "absolute top-1 right-1 z-10",
					children: /* @__PURE__ */ N("button", {
						type: "button",
						className: "flex size-8 items-center justify-center rounded-full border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)]/80 backdrop-blur-sm",
						onClick: (e) => {
							e.preventDefault(), e.stopPropagation(), d();
						},
						"aria-label": u ? "お気に入りから削除" : "お気に入りに追加",
						children: /* @__PURE__ */ N(Ff, {
							filled: u,
							size: 16
						})
					})
				})]
			}),
			/* @__PURE__ */ P("div", {
				className: "flex min-w-0 flex-1 flex-col justify-between py-1 pl-3 pr-1",
				children: [/* @__PURE__ */ P("div", {
					className: "space-y-0.5",
					children: [c && /* @__PURE__ */ N("p", {
						className: "truncate typo-body-sm text-[var(--Text-Low-Emphasis)]",
						children: c
					}), /* @__PURE__ */ N("h3", {
						className: "line-clamp-2 typo-body-md text-[var(--Text-High-Emphasis)]",
						children: t
					})]
				}), /* @__PURE__ */ P("div", {
					className: "mt-1 space-y-0.5",
					children: [/* @__PURE__ */ N("div", {
						className: "flex flex-wrap items-center gap-2",
						children: o != null && /* @__PURE__ */ N(kf, {
							rating: o,
							reviewCount: s,
							size: "sm"
						})
					}), /* @__PURE__ */ N(Ef, {
						price: i,
						originalPrice: a,
						size: "sm",
						showTaxLabel: !1
					})]
				})]
			})
		]
	}) : /* @__PURE__ */ P("div", {
		"data-slot": "product-card",
		"data-orientation": "vertical",
		className: U("group relative flex min-w-[140px] flex-col gap-1 bg-[var(--Surface-Primary)]", e),
		...b,
		children: [
			S,
			/* @__PURE__ */ P("div", {
				className: "relative",
				children: [/* @__PURE__ */ P("div", {
					className: "aspect-square overflow-hidden rounded-lg",
					children: [
						/* @__PURE__ */ N("img", {
							src: n,
							alt: r ?? t,
							className: "h-full w-full object-cover transition-transform duration-200 group-hover:scale-105",
							loading: "lazy"
						}),
						m != null && /* @__PURE__ */ N("span", {
							className: "absolute left-1.5 top-1.5 z-[5] flex size-7 items-center justify-center rounded-full bg-[var(--Brand-Primary)] typo-label-xs text-[var(--Text-on-Inverse)] shadow-[var(--shadow-md)]",
							children: m
						}),
						/* @__PURE__ */ P("div", {
							className: "absolute inset-x-1 bottom-1 z-[3] flex flex-wrap gap-1",
							children: [x && /* @__PURE__ */ N(If, {
								label: `${x}%OFF`,
								variant: "caution"
							}), l.map((e) => /* @__PURE__ */ N(If, { ...e }, e.label))]
						})
					]
				}), d && /* @__PURE__ */ N("div", {
					className: "absolute top-1.5 right-1.5 z-[4]",
					children: /* @__PURE__ */ N("button", {
						type: "button",
						className: "flex size-9 items-center justify-center rounded-full border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)]/80 backdrop-blur-sm transition-colors hover:bg-[var(--Surface-Tertiary)]",
						onClick: (e) => {
							e.preventDefault(), e.stopPropagation(), d();
						},
						"aria-label": u ? "お気に入りから削除" : "お気に入りに追加",
						children: /* @__PURE__ */ N(Ff, {
							filled: u,
							size: 20
						})
					})
				})]
			}),
			/* @__PURE__ */ P("div", {
				className: "flex flex-1 flex-col gap-0.5",
				children: [
					c && /* @__PURE__ */ N("p", {
						className: "truncate typo-body-sm text-[var(--Text-Low-Emphasis)]",
						children: c
					}),
					/* @__PURE__ */ N("h3", {
						className: "line-clamp-2 typo-body-md text-[var(--Text-High-Emphasis)]",
						children: t
					}),
					o != null && /* @__PURE__ */ N(kf, {
						rating: o,
						reviewCount: s,
						size: "sm"
					}),
					/* @__PURE__ */ N(Ef, {
						price: i,
						originalPrice: a,
						size: "md",
						showTaxLabel: !1
					})
				]
			}),
			_ && /* @__PURE__ */ N("button", {
				type: "button",
				"data-slot": "button",
				className: "relative z-10 flex h-9 w-full items-center justify-center gap-1 rounded-full bg-[var(--Brand-Primary)] typo-label-md text-[var(--Text-on-Inverse)] transition-colors hover:bg-[var(--Hover-Primary-Button)] cursor-pointer",
				onClick: (e) => {
					e.preventDefault(), e.stopPropagation(), v?.();
				},
				children: y
			})
		]
	});
}
//#endregion
//#region src/components/patterns/commerce/product-carousel.tsx
var Rf = {
	sm: "w-40",
	md: "w-[200px]",
	lg: "w-[240px]"
};
function zf({ className: e, title: t, subtitle: n, moreHref: r, moreLabel: i = "もっと見る", onMoreClick: a, products: o, cardSize: s = "sm", showRanking: c = !1, showCartButton: l = !1, ...u }) {
	return /* @__PURE__ */ P("section", {
		"data-slot": "product-carousel",
		className: U("py-4", e),
		...u,
		children: [/* @__PURE__ */ P("div", {
			className: "flex items-center justify-between px-4 mb-3",
			children: [/* @__PURE__ */ P("div", { children: [/* @__PURE__ */ N("h2", {
				className: "typo-heading-lg text-[var(--Text-High-Emphasis)]",
				children: t
			}), n && /* @__PURE__ */ N("p", {
				className: "typo-body-sm text-[var(--Text-Medium-Emphasis)] mt-0.5",
				children: n
			})] }), (r || a) && /* @__PURE__ */ P("a", {
				href: r,
				onClick: a,
				className: "typo-label-sm text-[var(--Text-Accent-Primary)] shrink-0 cursor-pointer hover:underline",
				children: [i, " →"]
			})]
		}), /* @__PURE__ */ P("div", {
			className: U("flex overflow-x-auto pl-4 pb-2 gap-3 scrollbar-hide", l && "items-stretch"),
			children: [o.map((e, t) => /* @__PURE__ */ N("div", {
				className: U("shrink-0", Rf[s]),
				children: /* @__PURE__ */ N(Lf, {
					...e,
					ranking: c ? t + 1 : e.ranking,
					showCartButton: l,
					className: U(e.className, l && "h-full")
				})
			}, e.name + t)), /* @__PURE__ */ N("div", {
				className: "shrink-0 w-4",
				"aria-hidden": !0
			})]
		})]
	});
}
//#endregion
//#region src/components/patterns/_internal/carousel-primitives.tsx
function Bf({ total: e, autoPlay: t, paused: r = !1 }) {
	let i = n.useRef(null), [a, o] = n.useState(0);
	n.useEffect(() => {
		let e = i.current;
		if (!e) return;
		let t = new IntersectionObserver((e) => {
			for (let t of e) if (t.isIntersecting) {
				let e = Number(t.target.dataset.index);
				Number.isNaN(e) || o(e);
			}
		}, {
			root: e,
			threshold: .6
		});
		return e.querySelectorAll("[data-slide]").forEach((e) => t.observe(e)), () => t.disconnect();
	}, [e]);
	let s = n.useCallback((e) => {
		let t = i.current?.children[e];
		t && i.current?.scrollTo({
			left: t.offsetLeft,
			behavior: "smooth"
		});
	}, []);
	n.useEffect(() => {
		if (t <= 0 || e <= 1 || r) return;
		let n = window.setInterval(() => s((a + 1) % e), t);
		return () => window.clearInterval(n);
	}, [
		a,
		t,
		s,
		r,
		e
	]);
	let c = n.useCallback(() => s(a <= 0 ? e - 1 : a - 1), [
		a,
		s,
		e
	]);
	return {
		active: a,
		goTo: s,
		next: n.useCallback(() => s(a >= e - 1 ? 0 : a + 1), [
			a,
			s,
			e
		]),
		previous: c,
		scrollRef: i
	};
}
function Vf({ active: e, total: t, showArrows: n, showDots: r, onPrevious: i, onNext: a, onGoTo: o }) {
	return /* @__PURE__ */ P(M, { children: [n && t > 1 && /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("button", {
		type: "button",
		onClick: i,
		"aria-label": "前へ",
		className: "absolute left-2 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)] shadow-[var(--shadow-md)] transition-opacity lg:flex lg:opacity-0 lg:group-hover/carousel:opacity-100 lg:focus-visible:opacity-100",
		children: /* @__PURE__ */ N(R, {
			size: 20,
			"aria-hidden": "true"
		})
	}), /* @__PURE__ */ N("button", {
		type: "button",
		onClick: a,
		"aria-label": "次へ",
		className: "absolute right-2 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)] shadow-[var(--shadow-md)] transition-opacity lg:flex lg:opacity-0 lg:group-hover/carousel:opacity-100 lg:focus-visible:opacity-100",
		children: /* @__PURE__ */ N(z, {
			size: 20,
			"aria-hidden": "true"
		})
	})] }), r && t > 1 && /* @__PURE__ */ N("div", {
		className: "mt-2 flex items-center justify-center lg:hidden",
		children: Array.from({ length: t }, (t, n) => /* @__PURE__ */ N("button", {
			type: "button",
			onClick: () => o(n),
			"aria-label": `スライド ${n + 1}`,
			"aria-current": n === e ? "true" : void 0,
			className: "flex size-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
			children: /* @__PURE__ */ N("span", {
				"aria-hidden": "true",
				className: U("size-2 rounded-full transition-colors", n === e ? "bg-[var(--Text-High-Emphasis)]" : "bg-[var(--Surface-Tertiary)]")
			})
		}, n))
	})] });
}
//#endregion
//#region src/components/patterns/commerce/image-carousel.tsx
function Hf({ images: e, aspectRatio: t = "banner", showDots: n = !0, showArrows: r = !0, autoPlay: i = 0, className: a, ...o }) {
	let s = e.length, { active: c, goTo: l, next: u, previous: d, scrollRef: f } = Bf({
		total: s,
		autoPlay: i
	}), p = t === "square" ? "aspect-square" : t === "video" ? "aspect-video" : "aspect-[2/1]";
	return s ? /* @__PURE__ */ P("div", {
		"data-slot": "image-carousel",
		className: U("group/carousel relative", a),
		...o,
		children: [/* @__PURE__ */ N("div", {
			ref: f,
			className: "flex snap-x snap-mandatory overflow-x-auto scroll-smooth",
			style: { scrollbarWidth: "none" },
			children: e.map((e, t) => /* @__PURE__ */ N("div", {
				"data-slide": !0,
				"data-index": t,
				className: "w-full shrink-0 snap-start px-4 lg:px-0",
				children: e.href ? /* @__PURE__ */ N("a", {
					href: e.href,
					className: "block",
					children: /* @__PURE__ */ N("img", {
						src: e.src,
						alt: e.alt,
						loading: t === 0 ? "eager" : "lazy",
						className: U("w-full rounded-lg object-cover", p)
					})
				}) : /* @__PURE__ */ N("img", {
					src: e.src,
					alt: e.alt,
					loading: t === 0 ? "eager" : "lazy",
					className: U("w-full rounded-lg object-cover", p)
				})
			}, t))
		}), /* @__PURE__ */ N(Vf, {
			active: c,
			total: s,
			showArrows: r,
			showDots: n,
			onPrevious: d,
			onNext: u,
			onGoTo: l
		})]
	}) : null;
}
//#endregion
//#region src/components/patterns/commerce/filter-bar.tsx
function Uf({ filter: e }) {
	let [t, r] = n.useState(!1), i = e.options && e.options.length > 0, a = e.isActive || !!e.selectedValue, o = a && e.value ? e.value : a && e.selectedValue ? e.options?.find((t) => t.value === e.selectedValue)?.label ?? e.label : e.label, s = U("flex h-9 shrink-0 items-center gap-0.5 rounded-full px-2.5 typo-body-md transition-colors max-w-[200px]", a ? "bg-[var(--Surface-Accent-Primary-Light)] typo-label-md text-[var(--Text-Accent-Primary)]" : "bg-[var(--Surface-Tertiary)] text-[var(--Text-High-Emphasis)] hover:opacity-80"), c = /* @__PURE__ */ N("svg", {
		width: "16",
		height: "16",
		viewBox: "0 0 16 16",
		fill: "none",
		className: U("shrink-0 transition-transform", t && "rotate-180"),
		children: /* @__PURE__ */ N("path", {
			d: "M4 6L8 10L12 6",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})
	});
	return i ? /* @__PURE__ */ P(Tn, {
		open: t,
		onOpenChange: r,
		children: [/* @__PURE__ */ N(Dn, {
			asChild: !0,
			children: /* @__PURE__ */ P("button", {
				type: "button",
				className: s,
				children: [/* @__PURE__ */ N("span", {
					className: "truncate",
					children: o
				}), c]
			})
		}), /* @__PURE__ */ P(On, {
			align: "start",
			className: "min-w-[180px]",
			children: [e.selectedValue && /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N(An, {
				className: "text-[var(--Text-Low-Emphasis)]",
				onSelect: () => e.onSelect?.(null),
				children: "選択を解除"
			}), /* @__PURE__ */ N(Fn, {})] }), /* @__PURE__ */ N(Mn, {
				value: e.selectedValue ?? "",
				onValueChange: (t) => e.onSelect?.(t),
				children: e.options.map((e) => /* @__PURE__ */ N(Nn, {
					value: e.value,
					children: e.label
				}, e.value))
			})]
		})]
	}) : /* @__PURE__ */ P("button", {
		type: "button",
		onClick: () => e.onClick?.(),
		className: s,
		children: [/* @__PURE__ */ N("span", {
			className: "truncate",
			children: o
		}), c]
	});
}
function Wf({ filters: e, resultCount: t, sortLabel: n, sortOptions: r, selectedSort: i, onSortSelect: a, onSortClick: o, onMoreFilters: s, activeFilterCount: c, className: l, ...u }) {
	return /* @__PURE__ */ P("nav", {
		"aria-label": "フィルター",
		"data-slot": "filter-bar",
		className: U("space-y-2", l),
		...u,
		children: [/* @__PURE__ */ P("div", {
			className: "flex items-center gap-1 overflow-x-auto scrollbar-hide",
			children: [/* @__PURE__ */ P("button", {
				type: "button",
				className: "relative flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--Surface-Tertiary)] text-[var(--Text-High-Emphasis)] transition-colors hover:opacity-80",
				onClick: s,
				"aria-label": "絞り込み",
				children: [/* @__PURE__ */ N("svg", {
					width: "20",
					height: "20",
					viewBox: "0 0 20 20",
					fill: "none",
					children: /* @__PURE__ */ N("path", {
						d: "M3 5h14M5 10h10M7 15h6",
						stroke: "currentColor",
						strokeWidth: "2",
						strokeLinecap: "round"
					})
				}), c != null && c > 0 && /* @__PURE__ */ N("span", {
					className: "absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-[var(--Brand-Primary)] typo-label-xs text-[var(--Text-on-Inverse)]",
					children: c
				})]
			}), e.map((e) => /* @__PURE__ */ N(Uf, { filter: e }, e.label))]
		}), (t !== void 0 || n || r) && /* @__PURE__ */ P("div", {
			className: "flex items-center justify-between",
			children: [t !== void 0 && /* @__PURE__ */ P("span", {
				className: "typo-body-md text-[var(--Text-High-Emphasis)]",
				children: [
					"対象商品: ",
					/* @__PURE__ */ N("strong", {
						className: "typo-heading-md",
						children: t.toLocaleString()
					}),
					" 件"
				]
			}), r ? /* @__PURE__ */ P(Tn, { children: [/* @__PURE__ */ N(Dn, {
				asChild: !0,
				children: /* @__PURE__ */ P("button", {
					type: "button",
					className: "flex h-9 shrink-0 items-center gap-0.5 rounded-full bg-[var(--Surface-Tertiary)] px-3 typo-body-md text-[var(--Text-High-Emphasis)] hover:opacity-80",
					children: [/* @__PURE__ */ N("svg", {
						width: "16",
						height: "16",
						viewBox: "0 0 16 16",
						fill: "none",
						children: /* @__PURE__ */ N("path", {
							d: "M3 4h7M3 8h5M3 12h3M13 5v8M11 11l2 2 2-2",
							stroke: "currentColor",
							strokeWidth: "1.5",
							strokeLinecap: "round",
							strokeLinejoin: "round"
						})
					}), r.find((e) => e.value === i)?.label ?? n ?? "並べ替え"]
				})
			}), /* @__PURE__ */ N(On, {
				align: "end",
				className: "min-w-[160px]",
				children: /* @__PURE__ */ N(Mn, {
					value: i,
					onValueChange: (e) => a?.(e),
					children: r.map((e) => /* @__PURE__ */ N(Nn, {
						value: e.value,
						children: e.label
					}, e.value))
				})
			})] }) : o && /* @__PURE__ */ P("button", {
				type: "button",
				onClick: o,
				className: "flex h-9 shrink-0 items-center gap-0.5 rounded-full bg-[var(--Surface-Tertiary)] px-3 typo-body-md text-[var(--Text-High-Emphasis)] hover:opacity-80",
				children: [/* @__PURE__ */ N("svg", {
					width: "16",
					height: "16",
					viewBox: "0 0 16 16",
					fill: "none",
					children: /* @__PURE__ */ N("path", {
						d: "M3 4h7M3 8h5M3 12h3M13 5v8M11 11l2 2 2-2",
						stroke: "currentColor",
						strokeWidth: "1.5",
						strokeLinecap: "round",
						strokeLinejoin: "round"
					})
				}), n ?? "並べ替え"]
			})]
		})]
	});
}
//#endregion
//#region src/components/patterns/commerce/review-card.tsx
function Gf({ rating: e, size: t = 14 }) {
	return /* @__PURE__ */ N("div", {
		className: "flex gap-0.5",
		"aria-label": `${e}点 / 5点`,
		children: [
			1,
			2,
			3,
			4,
			5
		].map((n) => /* @__PURE__ */ N("svg", {
			width: t,
			height: t,
			viewBox: "0 0 14 14",
			fill: "none",
			"aria-hidden": "true",
			children: /* @__PURE__ */ N("path", {
				d: "M7 1l1.6 3.3 3.6.5-2.6 2.5.6 3.6L7 9.2 3.8 11l.6-3.6L2 4.9l3.6-.5L7 1z",
				fill: n <= e ? "var(--Object-Rating)" : "var(--Border-Medium-Emphasis)"
			})
		}, n))
	});
}
function Kf({ reviewer: e, avatarChar: t, avatarSrc: n, rating: r, title: i, body: a, date: o, helpfulCount: s = 0, onHelpful: c, helpful: l = !1, className: u }) {
	let d = t ?? e.slice(0, 1);
	return /* @__PURE__ */ P("div", {
		"data-slot": "review-card",
		className: U("bg-[var(--Surface-Primary)] rounded-xl border border-[var(--Border-Low-Emphasis)] p-4", u),
		children: [
			/* @__PURE__ */ P("div", {
				className: "flex items-center gap-2 mb-3",
				children: [
					/* @__PURE__ */ N("div", {
						className: "w-9 h-9 rounded-full shrink-0 overflow-hidden bg-[var(--Brand-Primary)] flex items-center justify-center",
						children: n ? /* @__PURE__ */ N("img", {
							src: n,
							alt: e,
							className: "w-full h-full object-cover"
						}) : /* @__PURE__ */ N("span", {
							className: "text-[var(--Text-on-Inverse)] typo-label-md",
							children: d
						})
					}),
					/* @__PURE__ */ P("div", {
						className: "flex-1 min-w-0",
						children: [/* @__PURE__ */ N("p", {
							className: "typo-label-sm text-[var(--Text-High-Emphasis)] truncate",
							children: e
						}), /* @__PURE__ */ N("p", {
							className: "typo-body-xs text-[var(--Text-Low-Emphasis)]",
							children: o
						})]
					}),
					/* @__PURE__ */ N(Gf, { rating: r })
				]
			}),
			i && /* @__PURE__ */ N("p", {
				className: "typo-label-sm text-[var(--Text-High-Emphasis)] mb-1",
				children: i
			}),
			/* @__PURE__ */ N("p", {
				className: "typo-body-sm text-[var(--Text-Medium-Emphasis)] leading-relaxed",
				children: a
			}),
			c && /* @__PURE__ */ P("button", {
				onClick: c,
				"aria-pressed": l,
				className: U("inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full border border-[var(--Border-Medium-Emphasis)] typo-label-xs transition-colors", l ? "border-[var(--Brand-Primary)] text-[var(--Brand-Primary)] bg-[var(--Brand-Ultra-Light)]" : "border-[var(--Border-Medium-Emphasis)] text-[var(--Text-Low-Emphasis)] hover:border-[var(--Brand-Primary)] hover:text-[var(--Brand-Primary)]"),
				children: [
					/* @__PURE__ */ N("svg", {
						width: "12",
						height: "12",
						viewBox: "0 0 12 12",
						fill: "none",
						"aria-hidden": "true",
						children: /* @__PURE__ */ N("path", {
							d: "M2 8V5.5L5 2l.5 2H10l-.5 5H3.5L2 8z",
							stroke: "currentColor",
							strokeWidth: "1.2",
							strokeLinejoin: "round"
						})
					}),
					"参考になった ",
					s > 0 && `(${s})`
				]
			})
		]
	});
}
//#endregion
//#region src/components/patterns/commerce/review-summary.tsx
function qf({ averageRating: e, totalCount: t, distribution: n, className: r }) {
	let i = Math.max(...n, 1);
	return /* @__PURE__ */ P("div", {
		"data-slot": "review-summary",
		className: U("bg-[var(--Surface-Primary)] rounded-xl border border-[var(--Border-Low-Emphasis)] p-4", r),
		children: [/* @__PURE__ */ P("div", {
			className: "flex items-end gap-3 mb-3",
			children: [/* @__PURE__ */ N("span", {
				className: "text-4xl font-black text-[var(--Text-High-Emphasis)] leading-none tabular-nums",
				children: e.toFixed(1)
			}), /* @__PURE__ */ P("div", {
				className: "pb-0.5",
				children: [/* @__PURE__ */ N(Gf, {
					rating: Math.round(e),
					size: 16
				}), /* @__PURE__ */ P("p", {
					className: "typo-body-xs text-[var(--Text-Low-Emphasis)] mt-0.5",
					children: [t.toLocaleString(), "件の口コミ"]
				})]
			})]
		}), /* @__PURE__ */ N("div", {
			className: "flex flex-col gap-1.5",
			children: n.map((e, t) => {
				let n = 5 - t, r = Math.round(e / i * 100);
				return /* @__PURE__ */ P("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ N("span", {
							className: "typo-body-xs text-[var(--Text-Medium-Emphasis)] w-3 text-right",
							children: n
						}),
						/* @__PURE__ */ N("div", {
							className: "flex-1 h-1.5 bg-[var(--Surface-Tertiary)] rounded-full overflow-hidden",
							children: /* @__PURE__ */ N("div", {
								className: "h-full bg-[var(--Object-Rating)] rounded-full transition-all",
								style: { width: `${r}%` }
							})
						}),
						/* @__PURE__ */ N("span", {
							className: "typo-body-xs text-[var(--Text-Low-Emphasis)] w-6 text-right",
							children: e
						})
					]
				}, n);
			})
		})]
	});
}
//#endregion
//#region src/components/patterns/admin/kebab-menu.tsx
function Jf(e) {
	return e.type === "separator";
}
function Yf({ items: e, className: t, ...n }) {
	return /* @__PURE__ */ P(Tn, { children: [/* @__PURE__ */ N(Dn, {
		asChild: !0,
		children: /* @__PURE__ */ N("button", {
			type: "button",
			"data-slot": "kebab-menu",
			className: U("flex size-8 items-center justify-center rounded-lg hover:bg-[var(--Surface-Secondary)] transition-colors", t),
			"aria-label": "メニュー",
			...n,
			children: /* @__PURE__ */ P("svg", {
				width: "16",
				height: "16",
				viewBox: "0 0 16 16",
				fill: "currentColor",
				className: "text-[var(--Text-Low-Emphasis)]",
				children: [
					/* @__PURE__ */ N("circle", {
						cx: "8",
						cy: "3",
						r: "1.5"
					}),
					/* @__PURE__ */ N("circle", {
						cx: "8",
						cy: "8",
						r: "1.5"
					}),
					/* @__PURE__ */ N("circle", {
						cx: "8",
						cy: "13",
						r: "1.5"
					})
				]
			})
		})
	}), /* @__PURE__ */ N(On, {
		align: "end",
		className: "min-w-[200px]",
		children: e.map((e, t) => Jf(e) ? /* @__PURE__ */ N(Fn, {}, `separator-${t}`) : /* @__PURE__ */ P(An, {
			variant: e.destructive ? "destructive" : "default",
			disabled: e.disabled,
			onSelect: () => e.onClick?.(),
			className: U("justify-between gap-4", e.description ? "items-start" : "items-center"),
			children: [/* @__PURE__ */ P("span", {
				className: U("flex min-w-0 gap-2", e.description ? "items-start" : "items-center"),
				children: [e.icon && /* @__PURE__ */ N("span", {
					className: U("shrink-0", e.description && "mt-0.5"),
					children: e.icon
				}), /* @__PURE__ */ P("span", {
					className: "min-w-0",
					children: [/* @__PURE__ */ N("span", {
						className: "block typo-body-md",
						children: e.label
					}), e.description && /* @__PURE__ */ N("span", {
						className: "block typo-body-sm text-[var(--Text-Low-Emphasis)]",
						children: e.description
					})]
				})]
			}), e.shortcut && /* @__PURE__ */ N(In, { children: e.shortcut })]
		}, `${e.label}-${t}`))
	})] });
}
//#endregion
//#region src/components/patterns/admin/bulk-actions.tsx
function Xf({ selectedCount: e, onClear: t, children: n, className: r, ...i }) {
	return e === 0 ? null : /* @__PURE__ */ P("div", {
		"data-slot": "bulk-actions",
		className: U("fixed inset-x-0 bottom-6 z-50 mx-auto w-fit max-w-[calc(100%_-_32px)]", "flex items-center gap-3 rounded-full bg-[var(--Surface-Inverse)] px-5 py-3 shadow-[var(--shadow-dialog)]", "animate-fade-in-up", r),
		role: "toolbar",
		"aria-label": `${e}件を選択中`,
		...i,
		children: [
			/* @__PURE__ */ P("span", {
				className: "typo-label-md text-[var(--Text-on-Inverse)] shrink-0",
				children: [e, "件を選択中"]
			}),
			/* @__PURE__ */ N("div", { className: "h-5 w-px bg-[var(--Text-on-Inverse)]/20 shrink-0" }),
			/* @__PURE__ */ N("div", {
				className: "flex items-center gap-2 min-w-0 overflow-x-auto",
				children: n
			}),
			t && /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("div", { className: "h-5 w-px bg-[var(--Text-on-Inverse)]/20 shrink-0" }), /* @__PURE__ */ N("button", {
				type: "button",
				className: "flex size-7 items-center justify-center rounded-full text-[var(--Text-on-Inverse)]/60 hover:text-[var(--Text-on-Inverse)] hover:bg-[var(--Text-on-Inverse)]/10 transition-colors cursor-pointer",
				onClick: t,
				"aria-label": "選択を解除",
				children: /* @__PURE__ */ N("svg", {
					width: "16",
					height: "16",
					viewBox: "0 0 16 16",
					fill: "none",
					children: /* @__PURE__ */ N("path", {
						d: "M4 4L12 12M12 4L4 12",
						stroke: "currentColor",
						strokeWidth: "2",
						strokeLinecap: "round"
					})
				})
			})] })
		]
	});
}
//#endregion
//#region src/components/patterns/admin/status-tabs.tsx
function Zf({ items: e, activeIndex: t = 0, onSelect: n, className: r, ...i }) {
	return /* @__PURE__ */ N("div", {
		"data-slot": "status-tabs",
		className: U("flex gap-2 overflow-x-auto scrollbar-hide", r),
		role: "tablist",
		...i,
		children: e.map((e, r) => /* @__PURE__ */ P("button", {
			type: "button",
			role: "tab",
			"aria-selected": t === r,
			onClick: () => n?.(r),
			className: U("flex shrink-0 items-center gap-1.5 rounded-full px-3 h-8 typo-label-sm transition-colors whitespace-nowrap", t === r ? "bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)]" : "bg-[var(--Surface-Tertiary)] text-[var(--Text-High-Emphasis)] hover:opacity-80"),
			children: [e.label, /* @__PURE__ */ N("span", {
				className: U("inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full typo-label-xs", t === r ? "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)]" : "bg-[var(--Surface-Quaternary)] text-[var(--Text-Medium-Emphasis)]"),
				children: e.count
			})]
		}, e.label))
	});
}
//#endregion
//#region src/components/patterns/admin/search-panel.tsx
var Qf = {
	2: "sm:grid-cols-2",
	3: "sm:grid-cols-2 lg:grid-cols-3",
	4: "sm:grid-cols-2 lg:grid-cols-4"
};
function $f({ children: e, onSearch: t, onReset: n, columns: r = 4, layout: i = "grid", className: a, ...o }) {
	let s = i === "flex" ? "flex flex-wrap items-end gap-3 [&>*]:flex [&>*]:flex-col [&>*]:min-w-[140px] [&>*]:flex-1" : U("grid grid-cols-1 gap-3 items-end [&>*]:flex [&>*]:flex-col", Qf[r]);
	return /* @__PURE__ */ P("div", {
		"data-slot": "search-panel",
		className: U("rounded-2xl bg-[var(--Surface-Primary)] border border-[var(--Border-Low-Emphasis)] p-4", a),
		...o,
		children: [/* @__PURE__ */ N("div", {
			className: s,
			children: e
		}), /* @__PURE__ */ P("div", {
			className: "flex items-center justify-end gap-2 mt-3",
			children: [n && /* @__PURE__ */ N(W, {
				variant: "tertiary",
				size: "sm",
				onClick: n,
				children: "リセット"
			}), /* @__PURE__ */ P(W, {
				size: "sm",
				onClick: t,
				children: [/* @__PURE__ */ P("svg", {
					width: "16",
					height: "16",
					viewBox: "0 0 16 16",
					fill: "none",
					children: [/* @__PURE__ */ N("circle", {
						cx: "7",
						cy: "7",
						r: "4.5",
						stroke: "currentColor",
						strokeWidth: "1.5"
					}), /* @__PURE__ */ N("path", {
						d: "M10.5 10.5L13.5 13.5",
						stroke: "currentColor",
						strokeWidth: "1.5",
						strokeLinecap: "round"
					})]
				}), "検索"]
			})]
		})]
	});
}
//#endregion
//#region src/components/patterns/admin/image-uploader.tsx
function ep({ images: e = [], onAdd: t, onRemove: n, maxImages: r = 10, columns: i = 4, className: a, ...o }) {
	return /* @__PURE__ */ P("div", {
		"data-slot": "image-uploader",
		className: U("grid gap-3", a),
		style: { gridTemplateColumns: `repeat(${Math.min(i, 6)}, minmax(0, 1fr))` },
		...o,
		children: [e.map((e, t) => /* @__PURE__ */ P("div", {
			className: "relative aspect-square rounded-lg bg-[var(--Surface-Tertiary)] border border-[var(--Border-Low-Emphasis)] overflow-hidden group",
			children: [
				/* @__PURE__ */ N("img", {
					src: e.src,
					alt: e.alt,
					className: "absolute inset-0 size-full object-cover"
				}),
				/* @__PURE__ */ N("div", {
					className: "absolute inset-0 bg-[var(--Overlay-Medium)] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex items-center justify-center",
					children: /* @__PURE__ */ N("button", {
						type: "button",
						className: "size-8 rounded-full bg-[var(--Surface-Primary)]/80 flex items-center justify-center",
						"aria-label": `${e.alt}を削除`,
						onClick: () => n?.(t),
						children: /* @__PURE__ */ N("svg", {
							width: "16",
							height: "16",
							viewBox: "0 0 16 16",
							fill: "none",
							children: /* @__PURE__ */ N("path", {
								d: "M3 4h10M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1M5 4v8a1 1 0 001 1h4a1 1 0 001-1V4",
								stroke: "var(--Caution-Base)",
								strokeWidth: "1.5",
								strokeLinecap: "round",
								strokeLinejoin: "round"
							})
						})
					})
				}),
				/* @__PURE__ */ N("div", {
					className: "absolute top-1 left-1 size-5 rounded bg-[var(--Overlay-Dark)] text-[var(--Text-on-Inverse)] flex items-center justify-center typo-label-xs",
					children: t + 1
				})
			]
		}, t)), e.length < r && /* @__PURE__ */ P("button", {
			type: "button",
			className: "aspect-square rounded-lg border-2 border-dashed border-[var(--Border-Medium-Emphasis)] flex flex-col items-center justify-center gap-1 hover:border-[var(--Border-Accent-Primary)] hover:bg-[var(--Surface-Accent-Primary-Light)] transition-colors cursor-pointer",
			onClick: t,
			"aria-label": "画像を追加",
			children: [/* @__PURE__ */ N("svg", {
				width: "24",
				height: "24",
				viewBox: "0 0 24 24",
				fill: "none",
				children: /* @__PURE__ */ N("path", {
					d: "M12 5v14M5 12h14",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round"
				})
			}), /* @__PURE__ */ N("span", {
				className: "typo-label-xs text-[var(--Text-Low-Emphasis)]",
				children: "追加"
			})]
		})]
	});
}
//#endregion
//#region src/components/patterns/file-upload.tsx
function tp(e) {
	return e < 1024 ? `${e} B` : e < 1024 * 1024 ? `${(e / 1024).toFixed(1)} KB` : `${(e / (1024 * 1024)).toFixed(1)} MB`;
}
function np({ accept: e, maxSize: t, multiple: r = !1, maxFiles: i = 10, onUpload: a, disabled: o = !1, className: s, dragLabel: c = "ここにファイルをドロップ", orLabel: l = "または", browseLabel: u = "ファイルを選択", maxSizeLabel: d = (e) => `最大 ${tp(e)} まで`, maxFilesLabel: f = (e) => `最大 ${e} ファイルまで`, removeLabel: p = "削除" }) {
	let [m, h] = n.useState(!1), [g, _] = n.useState([]), [v, y] = n.useState(null), b = n.useRef(null), x = (e) => {
		if (y(null), t && e.find((e) => e.size > t)) return y(d(t)), null;
		let n = r ? [...g, ...e] : e.slice(0, 1);
		return r && n.length > i ? (y(f(i)), null) : n;
	}, S = (e) => {
		let t = x(e);
		t && (_(t), a?.(t));
	}, C = (e) => {
		let t = g.filter((t, n) => n !== e);
		_(t), a?.(t);
	};
	return /* @__PURE__ */ P("div", {
		"data-slot": "file-upload",
		className: U("flex flex-col gap-3", s),
		children: [
			/* @__PURE__ */ P("div", {
				role: "button",
				tabIndex: o ? -1 : 0,
				"aria-label": c,
				onDragOver: (e) => {
					e.preventDefault(), o || h(!0);
				},
				onDragLeave: () => h(!1),
				onDrop: (e) => {
					e.preventDefault(), h(!1), !o && S(Array.from(e.dataTransfer.files));
				},
				onClick: () => !o && b.current?.click(),
				onKeyDown: (e) => {
					(e.key === "Enter" || e.key === " ") && b.current?.click();
				},
				className: U("flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-[var(--Border-Medium-Emphasis)] border-dashed p-8 cursor-pointer transition-colors", m ? "border-[var(--Brand-Primary)] bg-[var(--Surface-Accent-Primary-Light)]" : "border-[var(--Border-Medium-Emphasis)] hover:border-[var(--Brand-Primary)] hover:bg-[var(--Surface-Secondary)]", o && "opacity-50 cursor-not-allowed pointer-events-none"),
				children: [
					/* @__PURE__ */ P("svg", {
						width: "32",
						height: "32",
						viewBox: "0 0 32 32",
						fill: "none",
						className: "text-[var(--Object-Low-Emphasis)]",
						"aria-hidden": !0,
						children: [/* @__PURE__ */ N("path", {
							d: "M16 22V10M10 16L16 10L22 16",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							strokeLinejoin: "round"
						}), /* @__PURE__ */ N("path", {
							d: "M6 26h20",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round"
						})]
					}),
					/* @__PURE__ */ N("span", {
						className: "typo-body-md text-[var(--Text-Medium-Emphasis)] text-center",
						children: c
					}),
					/* @__PURE__ */ N("span", {
						className: "typo-body-sm text-[var(--Text-Low-Emphasis)]",
						children: l
					}),
					/* @__PURE__ */ N("span", {
						className: "typo-label-sm text-[var(--Text-Accent-Primary)] underline",
						children: u
					}),
					(t || r && i) && /* @__PURE__ */ N("span", {
						className: "typo-body-xs text-[var(--Text-Low-Emphasis)]",
						children: [t && d(t), r && f(i)].filter(Boolean).join(" / ")
					})
				]
			}),
			/* @__PURE__ */ N("input", {
				ref: b,
				type: "file",
				accept: e,
				multiple: r,
				className: "hidden",
				onChange: (e) => {
					e.target.files && S(Array.from(e.target.files)), e.target.value = "";
				},
				disabled: o
			}),
			v && /* @__PURE__ */ N("p", {
				className: "typo-body-sm text-[var(--Text-Caution)]",
				role: "alert",
				children: v
			}),
			g.length > 0 && /* @__PURE__ */ N("ul", {
				className: "flex flex-col gap-2",
				children: g.map((e, t) => /* @__PURE__ */ P("li", {
					className: "flex items-center gap-3 rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Secondary)] px-3 py-2",
					children: [
						/* @__PURE__ */ P("svg", {
							width: "18",
							height: "18",
							viewBox: "0 0 20 20",
							fill: "none",
							className: "text-[var(--Object-Medium-Emphasis)] shrink-0",
							"aria-hidden": !0,
							children: [/* @__PURE__ */ N("path", {
								d: "M4 2h8l5 5v11a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z",
								stroke: "currentColor",
								strokeWidth: "1.5"
							}), /* @__PURE__ */ N("path", {
								d: "M12 2v5h5",
								stroke: "currentColor",
								strokeWidth: "1.5"
							})]
						}),
						/* @__PURE__ */ P("div", {
							className: "flex-1 min-w-0",
							children: [/* @__PURE__ */ N("p", {
								className: "typo-label-sm text-[var(--Text-High-Emphasis)] truncate",
								children: e.name
							}), /* @__PURE__ */ N("p", {
								className: "typo-body-xs text-[var(--Text-Low-Emphasis)]",
								children: tp(e.size)
							})]
						}),
						/* @__PURE__ */ N("button", {
							type: "button",
							"aria-label": `${e.name} を${p}`,
							onClick: () => C(t),
							className: "flex size-7 shrink-0 items-center justify-center rounded-full text-[var(--Object-Low-Emphasis)] hover:text-[var(--Object-High-Emphasis)] hover:bg-[var(--Surface-Tertiary)] transition-colors",
							children: /* @__PURE__ */ N("svg", {
								width: "14",
								height: "14",
								viewBox: "0 0 14 14",
								fill: "none",
								children: /* @__PURE__ */ N("path", {
									d: "M2 2L12 12M12 2L2 12",
									stroke: "currentColor",
									strokeWidth: "1.5",
									strokeLinecap: "round"
								})
							})
						})
					]
				}, `${e.name}-${t}`))
			})
		]
	});
}
//#endregion
//#region src/components/patterns/compact-file-picker.tsx
function rp({ className: e, inputClassName: t, label: r = "ファイル", description: i, triggerLabel: a = "選択する", icon: o, loading: s = !1, disabled: c, id: l, multiple: u, onFilesChange: d, ...f }) {
	let p = n.useId(), m = l ?? p, h = n.useRef(null), g = c || s;
	return /* @__PURE__ */ P("div", {
		"data-slot": "compact-file-picker",
		className: U("flex items-center gap-3", e),
		children: [
			/* @__PURE__ */ N("input", {
				...f,
				ref: h,
				id: m,
				type: "file",
				multiple: u,
				disabled: g,
				className: U("sr-only", t),
				onChange: (e) => {
					let t = Array.from(e.currentTarget.files ?? []);
					d?.(t), e.currentTarget.value = "";
				}
			}),
			/* @__PURE__ */ P("div", {
				className: "flex min-w-0 flex-1 items-center gap-3",
				children: [/* @__PURE__ */ N("span", {
					className: "flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--Surface-Secondary)] text-[var(--Object-Medium-Emphasis)]",
					children: o ?? /* @__PURE__ */ N(ne, {
						size: 20,
						"aria-hidden": !0
					})
				}), /* @__PURE__ */ P("label", {
					htmlFor: m,
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ N("span", {
						className: "typo-label-md block truncate text-[var(--Text-High-Emphasis)]",
						children: r
					}), i && /* @__PURE__ */ N("span", {
						className: "typo-body-sm mt-1 block text-[var(--Text-Medium-Emphasis)]",
						children: i
					})]
				})]
			}),
			/* @__PURE__ */ N(W, {
				type: "button",
				variant: "secondary",
				size: "sm",
				disabled: g,
				onClick: () => h.current?.click(),
				children: s ? "処理中" : a
			})
		]
	});
}
function ip({ className: e, images: t = [], accept: n = "image/*", previewVariant: r = "grid", triggerLabel: i = "画像を追加", label: a = "画像", description: o = "JPG / PNG / WebP", onRemove: s, removeLabel: c = (e) => `${e.name ?? "画像"}を削除`, ...l }) {
	return /* @__PURE__ */ P("div", {
		"data-slot": "image-attachment-picker",
		className: U("flex flex-col gap-3", e),
		children: [/* @__PURE__ */ N(rp, {
			...l,
			accept: n,
			label: a,
			description: o,
			triggerLabel: i,
			icon: /* @__PURE__ */ N(re, {
				size: 20,
				"aria-hidden": !0
			})
		}), t.length > 0 && /* @__PURE__ */ N("ul", {
			"data-slot": "image-attachment-preview-list",
			className: U(r === "grid" ? "grid grid-cols-3 gap-2" : "flex flex-col gap-2"),
			children: t.map((e) => /* @__PURE__ */ P("li", {
				className: U("relative overflow-hidden rounded-xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]", r === "list" && "flex items-center gap-3 p-2"),
				children: [
					/* @__PURE__ */ N("img", {
						src: e.src,
						alt: e.alt ?? e.name ?? "",
						className: U("block object-cover", r === "grid" ? "aspect-square w-full" : "size-14 rounded-lg")
					}),
					r === "list" && /* @__PURE__ */ N("span", {
						className: "typo-label-sm min-w-0 flex-1 truncate text-[var(--Text-High-Emphasis)]",
						children: e.name ?? e.alt ?? "画像"
					}),
					s && /* @__PURE__ */ N(W, {
						type: "button",
						variant: "ghost",
						size: "icon-sm",
						"aria-label": c(e),
						className: U(r === "grid" && "absolute right-1 top-1 bg-[var(--Surface-Primary)]"),
						onClick: () => s(e.id),
						children: /* @__PURE__ */ N(V, {
							size: 16,
							"aria-hidden": !0
						})
					})
				]
			}, e.id))
		})]
	});
}
//#endregion
//#region src/components/patterns/quick-action-grid.tsx
var ap = {
	neutral: "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)]",
	selected: "border-[var(--Brand-Primary)] bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-High-Emphasis)]",
	success: "border-[var(--Success-Base)] bg-[var(--Surface-Success-Subtle)] text-[var(--Text-High-Emphasis)]",
	info: "border-[var(--Info-Base)] bg-[var(--Surface-Info-Subtle)] text-[var(--Text-High-Emphasis)]",
	caution: "border-[var(--Caution-Base)] bg-[var(--Surface-Caution-Subtle)] text-[var(--Text-High-Emphasis)]"
}, op = {
	2: "grid-cols-2",
	3: "grid-cols-2 sm:grid-cols-3",
	4: "grid-cols-2 sm:grid-cols-4",
	auto: "grid-cols-[repeat(auto-fit,minmax(8rem,1fr))]"
};
function sp({ className: e, icon: t, emoji: n, label: r, description: i, meta: a, selected: o = !1, loading: s = !1, variant: c = o ? "selected" : "neutral", disabled: l, type: u, ...d }) {
	let f = l || s;
	return /* @__PURE__ */ P("button", {
		"data-slot": "action-tile",
		"data-variant": c,
		"aria-pressed": o || void 0,
		type: u ?? "button",
		disabled: f,
		className: U("relative flex min-h-24 flex-col items-start justify-between gap-3 rounded-xl border border-[var(--Border-Low-Emphasis)] p-3 text-left transition-colors", "focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50 focus-visible:outline-none", "hover:bg-[var(--Surface-Secondary)]", ap[c], f && "cursor-not-allowed opacity-50", e),
		...d,
		children: [/* @__PURE__ */ P("span", {
			className: "flex w-full items-start justify-between gap-3",
			children: [/* @__PURE__ */ P("span", {
				className: "flex min-w-0 flex-1 items-center gap-2",
				children: [
					n && /* @__PURE__ */ N("span", {
						className: "typo-heading-md shrink-0",
						"aria-hidden": !0,
						children: n
					}),
					t && /* @__PURE__ */ N(Rl, {
						appearance: "plain",
						className: "size-6 text-[var(--Object-Medium-Emphasis)]",
						children: t
					}),
					/* @__PURE__ */ N("span", {
						className: "typo-label-md min-w-0 truncate",
						children: r
					})
				]
			}), s && /* @__PURE__ */ N(nl, {
				size: "sm",
				label: "処理中"
			})]
		}), (i || a) && /* @__PURE__ */ P("span", {
			className: "flex w-full items-end justify-between gap-2",
			children: [i && /* @__PURE__ */ N("span", {
				className: "typo-body-sm min-w-0 text-[var(--Text-Medium-Emphasis)]",
				children: i
			}), a && /* @__PURE__ */ N("span", {
				className: "typo-label-sm shrink-0 text-[var(--Text-Low-Emphasis)]",
				children: a
			})]
		})]
	});
}
function cp({ className: e, columns: t = 3, gap: n = "md", ...r }) {
	return /* @__PURE__ */ N("div", {
		"data-slot": "quick-action-grid",
		className: U("grid", op[t], n === "sm" ? "gap-2" : "gap-3", e),
		...r
	});
}
//#endregion
//#region src/components/patterns/admin/notification-list.tsx
function lp({ notifications: e, variant: t = "vertical", emptyMessage: n = "新着のお知らせはありません", className: r, ...i }) {
	return e.length === 0 ? /* @__PURE__ */ P("div", {
		"data-slot": "notification-list",
		className: U("flex flex-col items-center justify-center gap-3 py-12", r),
		...i,
		children: [/* @__PURE__ */ N("svg", {
			width: "48",
			height: "48",
			viewBox: "0 0 48 48",
			fill: "none",
			className: "text-[var(--Text-Low-Emphasis)]",
			children: /* @__PURE__ */ N("path", {
				d: "M24 4C17.4 4 12 9.4 12 16v8l-4 4v2h32v-2l-4-4v-8c0-6.6-5.4-12-12-12zM20 34c0 2.2 1.8 4 4 4s4-1.8 4-4",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			})
		}), /* @__PURE__ */ N("p", {
			className: "typo-body-sm text-[var(--Text-Low-Emphasis)]",
			children: n
		})]
	}) : /* @__PURE__ */ N("div", {
		"data-slot": "notification-list",
		className: U("w-full divide-y divide-[var(--Border-Low-Emphasis)]", r),
		...i,
		children: e.map((e) => {
			let n = e.href ? "a" : "div", r = e.href ? { href: e.href } : {};
			return t === "horizontal" ? /* @__PURE__ */ P(n, {
				...r,
				className: "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--Surface-Secondary)]",
				children: [
					/* @__PURE__ */ N("span", {
						className: "typo-body-sm text-[var(--Text-Low-Emphasis)] shrink-0 w-[88px]",
						children: e.date
					}),
					/* @__PURE__ */ P("div", {
						className: "flex min-w-0 flex-1 flex-col gap-1",
						children: [e.isUnread && /* @__PURE__ */ N("span", {
							className: "inline-flex w-fit items-center rounded-full bg-[var(--Caution-Base)] px-1.5 py-0.5 typo-label-xs text-[var(--Text-on-Inverse)]",
							children: "NEW"
						}), /* @__PURE__ */ N("span", {
							className: "typo-body-md text-[var(--Text-High-Emphasis)] truncate",
							children: e.message
						})]
					}),
					/* @__PURE__ */ N("svg", {
						width: "16",
						height: "16",
						viewBox: "0 0 16 16",
						fill: "none",
						className: "text-[var(--Text-Low-Emphasis)] shrink-0",
						children: /* @__PURE__ */ N("path", {
							d: "M6 4l4 4-4 4",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							strokeLinejoin: "round"
						})
					})
				]
			}, e.id) : /* @__PURE__ */ P(n, {
				...r,
				className: "flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-[var(--Surface-Secondary)]",
				children: [/* @__PURE__ */ N("div", {
					className: "flex shrink-0 items-center pt-1.5",
					children: e.isUnread ? /* @__PURE__ */ N("span", { className: "size-2 rounded-full bg-[var(--Brand-Primary)]" }) : /* @__PURE__ */ N("span", { className: "size-2" })
				}), /* @__PURE__ */ P("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ N("p", {
						className: "typo-body-md text-[var(--Text-High-Emphasis)]",
						children: e.message
					}), /* @__PURE__ */ N("p", {
						className: "mt-0.5 typo-body-sm text-[var(--Text-Low-Emphasis)]",
						children: e.date
					})]
				})]
			}, e.id);
		})
	});
}
//#endregion
//#region src/components/patterns/admin/chart-controls.tsx
var up = [
	{
		label: "時間",
		value: "hour"
	},
	{
		label: "日",
		value: "day"
	},
	{
		label: "週",
		value: "week"
	},
	{
		label: "月",
		value: "month"
	}
], dp = [
	{
		label: "7日",
		value: "7d"
	},
	{
		label: "30日",
		value: "30d"
	},
	{
		label: "90日",
		value: "90d"
	},
	{
		label: "1年",
		value: "1y"
	},
	{
		label: "カスタム",
		value: "custom"
	}
];
function fp({ options: e, value: t, onChange: n }) {
	return /* @__PURE__ */ N("div", {
		className: "flex flex-wrap gap-1",
		role: "group",
		children: e.map((e) => /* @__PURE__ */ N("button", {
			onClick: () => n(e.value),
			"aria-pressed": e.value === t,
			className: U("px-3 py-1 rounded-full typo-label-xs border border-[var(--Border-Medium-Emphasis)] transition-colors whitespace-nowrap shrink-0", e.value === t ? "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)] border-[var(--Brand-Primary)]" : "border-[var(--Border-Medium-Emphasis)] text-[var(--Text-Medium-Emphasis)] bg-[var(--Surface-Primary)] hover:border-[var(--Brand-Primary)] hover:text-[var(--Brand-Primary)]"),
			children: e.label
		}, e.value))
	});
}
function pp({ granularity: e = "day", onGranularityChange: t, period: n = "7d", onPeriodChange: r, showComparison: i = !1, onComparisonChange: a, onCustomPeriod: o, className: s }) {
	return /* @__PURE__ */ P("div", {
		"data-slot": "chart-controls",
		className: U("flex flex-col gap-2.5", s),
		children: [
			t && /* @__PURE__ */ P("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ N("span", {
					className: "typo-label-xs text-[var(--Text-Low-Emphasis)] w-10 shrink-0 pt-1.5",
					children: "粒度"
				}), /* @__PURE__ */ N(fp, {
					options: up,
					value: e,
					onChange: t
				})]
			}),
			r && /* @__PURE__ */ P("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ N("span", {
					className: "typo-label-xs text-[var(--Text-Low-Emphasis)] w-10 shrink-0 pt-1.5",
					children: "期間"
				}), /* @__PURE__ */ N(fp, {
					options: dp,
					value: n,
					onChange: (e) => {
						if (e === "custom") {
							o?.();
							return;
						}
						r?.(e);
					}
				})]
			}),
			a && /* @__PURE__ */ P("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ N("span", {
					className: "typo-label-xs text-[var(--Text-Low-Emphasis)] w-10 shrink-0 pt-1.5",
					children: "比較"
				}), /* @__PURE__ */ P("button", {
					onClick: () => a(!i),
					"aria-pressed": i,
					className: U("inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--Border-Medium-Emphasis)] typo-label-xs transition-colors", i ? "bg-[var(--Brand-Ultra-Light)] border-[var(--Brand-Primary)] text-[var(--Brand-Primary)]" : "border-[var(--Border-Medium-Emphasis)] text-[var(--Text-Medium-Emphasis)] hover:border-[var(--Brand-Primary)] hover:text-[var(--Brand-Primary)]"),
					children: [/* @__PURE__ */ N("span", { className: U("w-2 h-2 rounded-full", i ? "bg-[var(--Brand-Primary)]" : "bg-[var(--Border-Medium-Emphasis)]") }), "前期比を表示"]
				})]
			})
		]
	});
}
//#endregion
//#region src/components/patterns/admin/data-table.tsx
var mp = [], hp = [];
function gp(e, t, n) {
	if (n) return n(e, t);
	if (e && typeof e == "object" && "id" in e) {
		let t = e.id;
		if (typeof t == "string" || typeof t == "number") return t;
	}
	return t;
}
function _p(e, t) {
	return !e || typeof e != "object" || !(t in e) ? null : e[t];
}
function vp(e, t, n) {
	return n.value ? n.value(e, t) : _p(e, n.key);
}
function yp(e, t, n, r, i, a, o, s, c) {
	let l = (e) => e?.close !== !1;
	return {
		row: e,
		index: t,
		rowIndex: t,
		rowId: n,
		column: r,
		value: i,
		isEditing: a,
		startEdit: o,
		commitEdit: (n, i) => {
			r.onRowCommit?.(n, e, t), c?.(n, e, t), l(i) && s();
		},
		commitValue: (n, i) => {
			r.onCellCommit?.(e, n, t), typeof n == "string" && r.onEditChange?.(e, n, t), l(i) && s();
		},
		cancelEdit: () => {
			r.onEditCancel?.(e, t), s();
		}
	};
}
function bp(e, t, n, r) {
	return n.cell ? n.cell(r) : n.render ? n.render(e, t) : vp(e, t, n);
}
function xp(e, t) {
	let n = e.edit?.trigger ?? "doubleClick";
	if (n === "manual") return {};
	let r = { onKeyDown: (e) => {
		e.key === "Escape" && t.isEditing && (e.stopPropagation(), t.cancelEdit()), e.key === "Enter" && !t.isEditing && (e.preventDefault(), t.startEdit());
	} };
	return n === "click" ? {
		...r,
		onClick: () => t.startEdit()
	} : n === "focus" ? {
		...r,
		tabIndex: 0,
		onFocus: () => t.startEdit()
	} : {
		...r,
		onDoubleClick: () => t.startEdit()
	};
}
var Sp = [
	"a[href]",
	"button",
	"input",
	"select",
	"textarea",
	"[role='button']",
	"[role='menuitem']",
	"[role='checkbox']",
	"[role='radio']",
	"[data-table-ignore-row-click]"
].join(",");
function Cp(e) {
	let t = e.target;
	return !(t instanceof Element) || t === e.currentTarget ? !1 : !!t.closest(Sp);
}
function wp(e, t, n) {
	if (n.sortValue) return n.sortValue(e, t);
	let r = vp(e, t, n);
	if (r === null) return null;
	if (r !== void 0) return typeof r == "string" || typeof r == "number" || r instanceof Date ? r : String(r);
}
function Tp(e, t) {
	if (e == null && t == null) return 0;
	if (e == null) return 1;
	if (t == null) return -1;
	let n = e instanceof Date ? e.getTime() : e, r = t instanceof Date ? t.getTime() : t;
	return typeof n == "number" && typeof r == "number" ? n - r : String(n).localeCompare(String(r), "ja", {
		numeric: !0,
		sensitivity: "base"
	});
}
function Ep(e, t = 0, n = !1) {
	let r = e === "right" ? "right" : "left", i = n ? "var(--Surface-Secondary)" : "var(--Surface-Primary)";
	return {
		className: U("sticky z-[1]", r === "left" ? "shadow-[8px_0_12px_-3px_rgba(0,0,0,0.3)]" : "shadow-[-8px_0_12px_-3px_rgba(0,0,0,0.3)]"),
		style: {
			[r]: t,
			backgroundColor: i
		}
	};
}
function Dp({ direction: e }) {
	return e === "asc" ? /* @__PURE__ */ N(te, {
		size: 16,
		className: "shrink-0"
	}) : e === "desc" ? /* @__PURE__ */ N(L, {
		size: 16,
		className: "shrink-0"
	}) : /* @__PURE__ */ N(B, {
		size: 16,
		className: "shrink-0 opacity-40"
	});
}
function Op() {
	return /* @__PURE__ */ N(oe, {
		size: 16,
		className: "shrink-0"
	});
}
function kp() {
	return /* @__PURE__ */ N(I, {
		size: 16,
		className: "shrink-0"
	});
}
function Ap() {
	return /* @__PURE__ */ N(H, {
		size: 14,
		className: "shrink-0"
	});
}
function jp() {
	return /* @__PURE__ */ N(ie, {
		size: 16,
		className: "shrink-0"
	});
}
function Mp({ open: e }) {
	return /* @__PURE__ */ N(z, {
		size: 16,
		className: U("shrink-0 transition-transform duration-200", e && "rotate-90")
	});
}
function Np({ className: e, children: t, rows: r, columns: i, getRowId: a, onRowCommit: o, sort: s, defaultSort: c = null, onSortChange: l, selection: u, emptyMessage: d, emptyDescription: f, emptyAction: p, sectionRow: m, onRowClick: h, rowClickable: g, tableClassName: _, rowClassName: v, ...y }) {
	let [b, x] = n.useState(c), [S, C] = n.useState(u?.defaultSelectedRowIds ?? []), [w, T] = n.useState(null), E = r != null && i != null, D = s === void 0 ? b : s, ee = r ?? mp, O = i ?? hp, k = u?.mode ?? (u ? "multi" : "none"), A = u?.selectedRowIds ?? S, j = n.useMemo(() => new Set(A), [A]), M = n.useMemo(() => ee.map((e, t) => ({
		row: e,
		index: t
	})), [ee]), F = n.useMemo(() => {
		if (!D) return M;
		let e = O.find((e) => e.key === D.key);
		if (!e || !e.sortable) return M;
		let t = D.direction === "asc" ? 1 : -1;
		return [...M].sort((n, r) => Tp(wp(n.row, n.index, e), wp(r.row, r.index, e)) * t);
	}, [
		O,
		D,
		M
	]), I = n.useMemo(() => F.map(({ row: e, index: t }) => gp(e, t, a)), [a, F]), L = n.useMemo(() => I.filter((e) => j.has(e)).length, [j, I]), R = n.useMemo(() => F.reduce((e, t) => {
		let n = m?.(t.row, t.index);
		return {
			previousSectionKey: n?.key ?? e.previousSectionKey,
			rows: [...e.rows, {
				...t,
				section: n,
				renderSection: !!(n && n.key !== e.previousSectionKey),
				sectionOpen: n?.open !== !1
			}]
		};
	}, {
		previousSectionKey: null,
		rows: []
	}).rows, [m, F]), z = n.useCallback((e) => {
		u?.selectedRowIds === void 0 && C(e), u?.onSelectionChange?.(e);
	}, [u]), B = n.useCallback(() => {
		if (k !== "multi") return;
		let e = new Set(I), t = A.filter((t) => !e.has(t));
		if (L === I.length) {
			z(t);
			return;
		}
		z([...t, ...I]);
	}, [
		A,
		L,
		k,
		I,
		z
	]), te = n.useCallback((e) => {
		if (k === "none") return;
		if (k === "single") {
			z(j.has(e) ? [] : [e]);
			return;
		}
		let t = j.has(e) ? A.filter((t) => t !== e) : [...A, e];
		z(t);
	}, [
		j,
		A,
		k,
		z
	]), V = n.useCallback((e) => {
		if (!e.sortable) return;
		let t = D?.key === e.key ? D.direction === "asc" ? {
			key: e.key,
			direction: "desc"
		} : null : {
			key: e.key,
			direction: "asc"
		};
		s === void 0 && x(t), l?.(t);
	}, [
		D,
		l,
		s
	]), ne = k === "none" ? 0 : 1, H = O.length + ne;
	return E ? /* @__PURE__ */ N("div", {
		"data-slot": "data-table",
		className: U("overflow-x-auto rounded-lg border border-[var(--Border-Low-Emphasis)]", e),
		...y,
		children: /* @__PURE__ */ P(Pp, {
			className: _,
			children: [/* @__PURE__ */ N(Fp, { children: /* @__PURE__ */ P("tr", { children: [k !== "none" && /* @__PURE__ */ N(Rp, {
				className: "w-[40px]",
				"aria-label": "行選択",
				children: k === "multi" && /* @__PURE__ */ N(at, {
					checked: I.length > 0 && L === I.length ? !0 : L > 0 ? "indeterminate" : !1,
					onCheckedChange: B,
					"aria-label": "すべて選択"
				})
			}), O.map((e) => /* @__PURE__ */ N(Rp, {
				sortable: e.sortable,
				sortDirection: D?.key === e.key ? D.direction : null,
				onSort: () => V(e),
				width: e.width,
				sticky: e.sticky,
				stickyOffset: e.stickyOffset,
				className: U(e.align === "center" && "text-center", e.align === "right" && "text-right", e.headerClassName),
				children: e.header
			}, e.key))] }) }), /* @__PURE__ */ P(Ip, { children: [F.length === 0 && /* @__PURE__ */ N(nm, {
				colSpan: H,
				message: d,
				description: f,
				action: p
			}), R.map(({ row: e, index: t, section: r, renderSection: i, sectionOpen: s }) => {
				let c = gp(e, t, a), l = j.has(c);
				return /* @__PURE__ */ P(n.Fragment, { children: [i && r && /* @__PURE__ */ N(em, {
					label: r.label,
					count: r.count,
					open: r.open,
					onToggle: r.onToggle,
					colSpan: H,
					stickyLeft: r.stickyLeft,
					stickyOffset: r.stickyOffset,
					headingSize: r.headingSize
				}), s && /* @__PURE__ */ P(Lp, {
					selected: l,
					clickable: g ?? !!h,
					onRowClick: h ? (n) => h(e, t, c, n) : void 0,
					className: typeof v == "function" ? v(e, t) : v,
					children: [k !== "none" && /* @__PURE__ */ N(Wp, {
						checked: l,
						onCheckedChange: () => te(c),
						"aria-label": `${String(c)} を選択`
					}), O.map((n) => {
						let r = vp(e, t, n), i = w?.rowId === c && w.columnKey === n.key, a = yp(e, t, c, n, r, i, () => T({
							rowId: c,
							columnKey: n.key
						}), () => T((e) => e?.rowId === c && e.columnKey === n.key ? null : e), o);
						if (n.cell || n.editCell) return /* @__PURE__ */ N(Vp, {
							...xp(n, a),
							align: n.align,
							width: n.width,
							sticky: n.sticky,
							stickyOffset: n.stickyOffset,
							className: n.className,
							children: i && n.editCell ? n.editCell(a) : bp(e, t, n, a)
						}, n.key);
						if (n.editable) {
							let r = n.editValue?.(e, t) ?? String(wp(e, t, n) ?? "");
							return n.editOptions ? /* @__PURE__ */ N(qp, {
								value: r,
								options: n.editOptions,
								onValueChange: (r) => n.onEditChange?.(e, r, t),
								className: n.className,
								width: n.width,
								sticky: n.sticky,
								stickyOffset: n.stickyOffset
							}, n.key) : /* @__PURE__ */ N(Kp, {
								value: r,
								onChange: (r) => n.onEditChange?.(e, r, t),
								className: n.className,
								width: n.width,
								sticky: n.sticky,
								stickyOffset: n.stickyOffset
							}, n.key);
						}
						return /* @__PURE__ */ N(Vp, {
							align: n.align,
							width: n.width,
							sticky: n.sticky,
							stickyOffset: n.stickyOffset,
							className: n.className,
							children: bp(e, t, n, a)
						}, n.key);
					})]
				})] }, c);
			})] })]
		})
	}) : /* @__PURE__ */ N("div", {
		"data-slot": "data-table",
		className: U("overflow-x-auto rounded-lg border border-[var(--Border-Low-Emphasis)]", e),
		...y,
		children: t
	});
}
function Pp({ className: e, children: t, ...n }) {
	return /* @__PURE__ */ N("table", {
		"data-slot": "data-table-table",
		className: U("w-full border-collapse", e),
		...n,
		children: t
	});
}
function Fp({ className: e, children: t, ...n }) {
	return /* @__PURE__ */ N("thead", {
		"data-slot": "data-table-header",
		className: U("bg-[var(--Surface-Secondary)] [&>tr]:border-b [&>tr]:border-[var(--Border-Low-Emphasis)]", e),
		...n,
		children: t
	});
}
function Ip({ className: e, children: t, ...n }) {
	return /* @__PURE__ */ N("tbody", {
		"data-slot": "data-table-body",
		className: U("[&>tr:not(:last-child)]:border-b [&>tr:not(:last-child)]:border-b-[var(--Border-Low-Emphasis)]", e),
		...n,
		children: t
	});
}
function Lp({ className: e, selected: t, clickable: n, onRowClick: r, onClick: i, onKeyDown: a, role: o, tabIndex: s, children: c, ...l }) {
	let u = n || !!r;
	return /* @__PURE__ */ N("tr", {
		"data-slot": "data-table-row",
		"data-selected": t || void 0,
		"data-clickable": u || void 0,
		role: o,
		tabIndex: u && s == null ? 0 : s,
		onClick: (e) => {
			i?.(e), !(e.defaultPrevented || !r || Cp(e)) && r(e);
		},
		onKeyDown: (e) => {
			a?.(e), !(e.defaultPrevented || !r || Cp(e)) && (e.key !== "Enter" && e.key !== " " || (e.preventDefault(), r(e)));
		},
		className: U("border-l-2 border-l-transparent transition-colors hover:bg-[var(--Surface-Secondary)]/50", t && "bg-[var(--Surface-Accent-Primary-Light)] border-l-[var(--Brand-Primary)]", u && "cursor-pointer focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-[var(--Focus-High-Emphasis)]/50", e),
		...l,
		children: c
	});
}
function Rp({ className: e, children: t, sortable: n, sortDirection: r, onSort: i, width: a, sticky: o, stickyOffset: s, style: c, ...l }) {
	let u = o ? Ep(o, s, !0) : null;
	return /* @__PURE__ */ N("th", {
		"data-slot": "data-table-head",
		className: U(zp({ width: a }), u?.className, e),
		style: u ? {
			...u.style,
			...c
		} : c,
		"aria-sort": r === "asc" ? "ascending" : r === "desc" ? "descending" : void 0,
		...l,
		children: n ? /* @__PURE__ */ P("button", {
			type: "button",
			onClick: i,
			className: "inline-flex items-center gap-1 cursor-pointer select-none rounded-sm focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50 hover:text-[var(--Text-High-Emphasis)] transition-colors",
			children: [t, /* @__PURE__ */ N(Dp, { direction: r ?? null })]
		}) : t
	});
}
var zp = F("px-3 py-2.5 text-left whitespace-nowrap typo-label-sm text-[var(--Text-Medium-Emphasis)]", {
	variants: { width: {
		auto: "",
		narrow: "w-[48px]",
		checkbox: "w-[40px]",
		action: "w-[48px]",
		sm: "w-[120px]",
		md: "w-[200px]",
		lg: "w-[300px]",
		xl: "w-[400px]",
		flex: "w-full min-w-[240px]"
	} },
	defaultVariants: { width: "auto" }
}), Bp = F("px-3 py-2.5 typo-body-md text-[var(--Text-High-Emphasis)]", {
	variants: {
		align: {
			left: "text-left",
			center: "text-center",
			right: "text-right"
		},
		width: {
			auto: "",
			narrow: "w-[48px]",
			checkbox: "w-[40px]",
			action: "w-[48px]",
			sm: "w-[120px]",
			md: "w-[200px]",
			lg: "w-[300px]",
			xl: "w-[400px]",
			flex: "w-full min-w-[240px]"
		}
	},
	defaultVariants: {
		align: "left",
		width: "auto"
	}
});
function Vp({ className: e, align: t, width: n, children: r, clickable: i, sticky: a, stickyOffset: o, style: s, ...c }) {
	let l = a ? Ep(a, o) : null;
	return /* @__PURE__ */ N("td", {
		"data-slot": "data-table-cell",
		"data-clickable": i || void 0,
		className: U(Bp({
			align: t,
			width: n
		}), i && "cursor-pointer select-none", l?.className, e),
		style: l ? {
			...l.style,
			...s
		} : s,
		...c,
		children: r
	});
}
function Hp({ className: e, src: t, fallback: n, title: r, caption: i, sticky: a, stickyOffset: o, style: s, ...c }) {
	let l = a ? Ep(a, o) : null;
	return /* @__PURE__ */ N("td", {
		"data-slot": "data-table-avatar-cell",
		className: U("px-3 py-2.5", l?.className, e),
		style: l ? {
			...l.style,
			...s
		} : s,
		...c,
		children: /* @__PURE__ */ P("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ P(Re, {
				className: "size-8",
				children: [t && /* @__PURE__ */ N(ze, {
					src: t,
					alt: r
				}), /* @__PURE__ */ N(Be, { children: n ?? r.charAt(0) })]
			}), /* @__PURE__ */ P("div", {
				className: "flex flex-col min-w-0",
				children: [/* @__PURE__ */ N("span", {
					className: "typo-label-md text-[var(--Text-High-Emphasis)] truncate",
					children: r
				}), i && /* @__PURE__ */ N("span", {
					className: "typo-body-sm text-[var(--Text-Low-Emphasis)] truncate",
					children: i
				})]
			})]
		})
	});
}
function Up({ className: e, src: t, alt: n, title: r, caption: i, imageSize: a = 40, ...o }) {
	return /* @__PURE__ */ N("td", {
		"data-slot": "data-table-image-cell",
		className: U("px-3 py-2.5", e),
		...o,
		children: /* @__PURE__ */ P("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ N("img", {
				src: t,
				alt: n ?? r ?? "",
				className: "shrink-0 rounded-lg object-cover",
				style: {
					width: a,
					height: a
				}
			}), (r || i) && /* @__PURE__ */ P("div", {
				className: "flex flex-col min-w-0",
				children: [r && /* @__PURE__ */ N("span", {
					className: "typo-label-md text-[var(--Text-High-Emphasis)] truncate",
					children: r
				}), i && /* @__PURE__ */ N("span", {
					className: "typo-body-sm text-[var(--Text-Low-Emphasis)] truncate",
					children: i
				})]
			})]
		})
	});
}
function Wp({ className: e, checked: t, onCheckedChange: n, indeterminate: r, as: i = "td", sticky: a, stickyOffset: o, style: s, ...c }) {
	let l = a ? Ep(a, o, i === "th") : null;
	return /* @__PURE__ */ N(i, {
		"data-slot": "data-table-checkbox-cell",
		className: U("w-[40px] px-3 py-2.5", l?.className, e),
		style: l ? {
			...l.style,
			...s
		} : s,
		...c,
		children: /* @__PURE__ */ N(at, {
			checked: r ? "indeterminate" : t,
			onCheckedChange: (e) => n?.(e === !0)
		})
	});
}
function Gp({ className: e, items: t, ...n }) {
	return /* @__PURE__ */ N("td", {
		"data-slot": "data-table-action-cell",
		className: U("w-[48px] px-3 py-2.5", e),
		...n,
		children: /* @__PURE__ */ P(Tn, { children: [/* @__PURE__ */ N(Dn, {
			asChild: !0,
			children: /* @__PURE__ */ N("button", {
				type: "button",
				className: "flex size-8 items-center justify-center rounded-full text-[var(--Text-Medium-Emphasis)] hover:bg-[var(--Surface-Secondary)] transition-colors",
				"aria-label": "行メニュー",
				children: /* @__PURE__ */ N(Op, {})
			})
		}), /* @__PURE__ */ N(On, {
			align: "end",
			className: "min-w-[160px]",
			children: t.map((e) => /* @__PURE__ */ P(An, {
				variant: e.destructive ? "destructive" : "default",
				onSelect: () => e.onClick?.(),
				children: [e.icon, e.label]
			}, e.label))
		})] })
	});
}
function Kp({ className: e, value: t, onChange: n, placeholder: r, width: i, sticky: a, stickyOffset: o, style: s, ...c }) {
	let l = a ? Ep(a, o) : null;
	return /* @__PURE__ */ N("td", {
		"data-slot": "data-table-input-cell",
		className: U(Bp({ width: i }), "py-1.5", l?.className, e),
		style: l ? {
			...l.style,
			...s
		} : s,
		...c,
		children: /* @__PURE__ */ N("input", {
			type: "text",
			value: t,
			onChange: (e) => n?.(e.target.value),
			placeholder: r,
			className: U("w-full rounded-lg border border-transparent bg-transparent px-2 py-1.5 typo-body-md text-[var(--Text-High-Emphasis)]", "hover:border-[var(--Border-Low-Emphasis)]", "focus-visible:border-[var(--Border-Accent-Primary)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50", "placeholder:text-[var(--Text-Low-Emphasis)]")
		})
	});
}
function qp({ className: e, value: t, onValueChange: n, placeholder: r, options: i, width: a, sticky: o, stickyOffset: s, style: c, contentPosition: l = "popper", triggerClassName: u, contentClassName: d, ...f }) {
	let p = o ? Ep(o, s) : null;
	return /* @__PURE__ */ N("td", {
		"data-slot": "data-table-select-cell",
		className: U(Bp({ width: a }), "py-1.5", p?.className, e),
		style: p ? {
			...p.style,
			...c
		} : c,
		...f,
		children: /* @__PURE__ */ P(Js, {
			value: t,
			onValueChange: n,
			children: [/* @__PURE__ */ N(Zs, {
				className: U("h-8 min-w-[120px] typo-body-md border-transparent hover:border-[var(--Border-Low-Emphasis)]", a === "flex" && "w-full", u),
				children: /* @__PURE__ */ N(Xs, { placeholder: r })
			}), /* @__PURE__ */ N(Qs, {
				position: l,
				className: d,
				children: i.map((e) => /* @__PURE__ */ N($s, {
					value: e.value,
					children: e.label
				}, e.value))
			})]
		})
	});
}
function Jp({ className: e, value: t, onValueChange: n, placeholder: r = "日付を選択", disabled: i, dateFormat: a, triggerLabel: o, pickerClassName: s, width: c, sticky: l, stickyOffset: u, style: d, ...f }) {
	let p = l ? Ep(l, u) : null;
	return /* @__PURE__ */ N("td", {
		"data-slot": "data-table-date-cell",
		className: U(Bp({ width: c }), "py-1.5", p?.className, e),
		style: p ? {
			...p.style,
			...d
		} : d,
		...f,
		children: /* @__PURE__ */ N(fs, {
			value: t,
			onChange: n,
			placeholder: r,
			disabled: i,
			dateFormat: a,
			triggerLabel: o,
			className: U("h-8 min-w-[150px] px-2 typo-body-md", c === "flex" && "w-full", s)
		})
	});
}
function Yp({ className: e, value: t, prefix: n, suffix: r, children: i, ...a }) {
	return /* @__PURE__ */ P("td", {
		"data-slot": "data-table-number-cell",
		className: U("px-3 py-2.5 text-right typo-body-md tabular-nums text-[var(--Text-High-Emphasis)]", e),
		...a,
		children: [
			n,
			typeof t == "number" ? t.toLocaleString() : t,
			r
		]
	});
}
function Xp({ className: e, ...t }) {
	return /* @__PURE__ */ N("td", {
		"data-slot": "data-table-drag-handle-cell",
		className: U("w-[36px] px-2 py-2.5 cursor-grab text-[var(--Text-Low-Emphasis)]", e),
		...t,
		children: /* @__PURE__ */ N(jp, {})
	});
}
function Zp({ className: e, href: t, external: n, children: r, ...i }) {
	return /* @__PURE__ */ N("td", {
		"data-slot": "data-table-link-cell",
		className: U("px-3 py-2.5", e),
		...i,
		children: /* @__PURE__ */ P("a", {
			href: t,
			target: n ? "_blank" : void 0,
			rel: n ? "noopener noreferrer" : void 0,
			className: "inline-flex items-center gap-1 whitespace-nowrap typo-body-md text-[var(--Text-Accent-Primary)] hover:underline",
			children: [r, n && /* @__PURE__ */ N(Ap, {})]
		})
	});
}
function Qp({ className: e, selectedCount: t, children: n, ...r }) {
	return t === 0 ? null : /* @__PURE__ */ P("div", {
		"data-slot": "data-table-bulk-actions",
		className: U("flex flex-wrap items-center gap-3 rounded-lg bg-[var(--Surface-Accent-Primary-Light)] px-4 py-3", e),
		role: "toolbar",
		"aria-label": `${t}件を選択中`,
		...r,
		children: [/* @__PURE__ */ P("span", {
			className: "typo-label-md text-[var(--Text-High-Emphasis)] shrink-0",
			children: [t, "件を選択中"]
		}), n]
	});
}
var $p = {
	sm: "typo-label-md",
	md: "typo-label-lg",
	lg: "typo-heading-sm"
};
function em({ className: e, label: t, count: n, open: r = !0, onToggle: i, colSpan: a, stickyLeft: o, stickyOffset: s = 0, headingSize: c = "md", contentClassName: l, buttonClassName: u, ...d }) {
	return /* @__PURE__ */ N("tr", {
		"data-slot": "data-table-section-row",
		className: U("bg-[var(--Surface-Tertiary)] border-y border-[var(--Border-Low-Emphasis)]", e),
		...d,
		children: /* @__PURE__ */ N("td", {
			colSpan: a,
			className: U(o ? "p-0" : "px-3 py-2"),
			children: /* @__PURE__ */ N("div", {
				className: U(o && "sticky z-[1] inline-flex bg-[var(--Surface-Tertiary)] px-3 py-2", l),
				style: o ? { left: s } : void 0,
				children: /* @__PURE__ */ P("button", {
					type: "button",
					className: U("inline-flex items-center gap-2 text-[var(--Text-High-Emphasis)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50", $p[c], u),
					onClick: i,
					"aria-expanded": r,
					children: [
						/* @__PURE__ */ N(Mp, { open: r }),
						t,
						n !== void 0 && /* @__PURE__ */ P("span", {
							className: "typo-body-md text-[var(--Text-Low-Emphasis)]",
							children: [
								"(",
								n,
								")"
							]
						})
					]
				})
			})
		})
	});
}
function tm({ className: e, label: t = "追加する", onClick: n, colSpan: r, ...i }) {
	return /* @__PURE__ */ N("tr", {
		"data-slot": "data-table-add-row",
		className: U("border-t border-dashed border-[var(--Border-Low-Emphasis)]", e),
		...i,
		children: /* @__PURE__ */ N("td", {
			colSpan: r,
			className: "px-3 py-2",
			children: /* @__PURE__ */ P("button", {
				type: "button",
				className: "inline-flex items-center gap-2 typo-label-md text-[var(--Text-Accent-Primary)] hover:underline",
				onClick: n,
				children: [/* @__PURE__ */ N(kp, {}), t]
			})
		})
	});
}
function nm({ className: e, icon: t, message: n = "データがありません", description: r, action: i, colSpan: a, ...o }) {
	return /* @__PURE__ */ N("tr", {
		"data-slot": "data-table-empty-state",
		className: U("", e),
		...o,
		children: /* @__PURE__ */ N("td", {
			colSpan: a,
			className: "px-3 py-12",
			children: /* @__PURE__ */ P("div", {
				className: "flex flex-col items-center gap-3 text-center",
				children: [
					t && /* @__PURE__ */ N("div", {
						className: "text-[var(--Text-Low-Emphasis)]",
						children: t
					}),
					/* @__PURE__ */ N("p", {
						className: "typo-heading-md text-[var(--Text-Medium-Emphasis)]",
						children: n
					}),
					r && /* @__PURE__ */ N("p", {
						className: "typo-body-md text-[var(--Text-Low-Emphasis)] max-w-sm",
						children: r
					}),
					i && /* @__PURE__ */ N("div", {
						className: "mt-2",
						children: i
					})
				]
			})
		})
	});
}
function rm(e) {
	return e.toLocaleDateString("ja-JP", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	});
}
function im(e, t) {
	let n = new Set(Array.isArray(t) ? t : t ? [t] : []);
	return e.filter((e) => n.has(e.value));
}
function am({ value: e, onCommit: t, placeholder: n = "日付を選択", emptyLabel: r = "未設定", format: i, ...a }) {
	return {
		...a,
		edit: {
			trigger: "click",
			...a.edit
		},
		value: e,
		onCellCommit: t,
		sortValue: (t, n) => e(t, n),
		cell: ({ row: e, rowIndex: t, value: n }) => n ? i ? i(n, e, t) : rm(n) : /* @__PURE__ */ N("span", {
			className: "text-[var(--Text-Low-Emphasis)]",
			children: r
		}),
		editCell: ({ value: e, commitValue: t }) => /* @__PURE__ */ N(fs, {
			value: e,
			onChange: t,
			placeholder: n,
			className: "h-9 min-w-[150px]"
		})
	};
}
function om({ value: e, options: t, onCommit: n, multiple: r = !1, emptyLabel: i = "未設定", ...a }) {
	return {
		...a,
		edit: {
			trigger: "click",
			...a.edit
		},
		value: e,
		onCellCommit: n,
		sortValue: (t, n) => {
			let r = e(t, n);
			return Array.isArray(r) ? r.join(",") : typeof r == "string" ? r : void 0;
		},
		cell: ({ value: e }) => {
			let n = im(t, e);
			return n.length === 0 ? /* @__PURE__ */ N("span", {
				className: "text-[var(--Text-Low-Emphasis)]",
				children: i
			}) : /* @__PURE__ */ N("div", {
				className: "flex flex-wrap gap-1.5",
				children: n.map((e) => /* @__PURE__ */ P("span", {
					className: "inline-flex h-7 items-center gap-1.5 rounded-full bg-[var(--Surface-Accent-Primary-Light)] px-2.5 typo-label-xs text-[var(--Text-Accent-Primary)]",
					children: [e.icon, e.label]
				}, e.value))
			});
		},
		editCell: ({ value: e, commitValue: n }) => {
			let i = new Set(Array.isArray(e) ? e : e ? [e] : []);
			return /* @__PURE__ */ N("div", {
				className: "flex flex-wrap gap-1.5",
				children: t.map((e) => {
					let t = i.has(e.value), a = r ? t ? Array.from(i).filter((t) => t !== e.value) : [...Array.from(i), e.value] : e.value;
					return /* @__PURE__ */ P(sd, {
						size: "sm",
						variant: "accent",
						selected: t,
						onClick: () => n(a, { close: !r }),
						children: [e.icon, e.label]
					}, e.value);
				})
			});
		}
	};
}
function sm({ value: e, options: t, onCommit: n, placeholder: r = "選択", emptyLabel: i = "未設定", contentPosition: a = "popper", ...o }) {
	return {
		...o,
		edit: {
			trigger: "click",
			...o.edit
		},
		value: e,
		onCellCommit: n,
		sortValue: (t, n) => e(t, n),
		cell: ({ value: e }) => {
			let n = t.find((t) => t.value === e);
			return n ? /* @__PURE__ */ P("span", {
				className: "inline-flex items-center gap-1.5",
				children: [n.icon, n.label]
			}) : /* @__PURE__ */ N("span", {
				className: "text-[var(--Text-Low-Emphasis)]",
				children: i
			});
		},
		editCell: ({ value: e, commitValue: n }) => /* @__PURE__ */ P(Js, {
			value: e,
			onValueChange: (e) => n(e),
			children: [/* @__PURE__ */ N(Zs, {
				className: "h-8 min-w-[120px] typo-body-md border-transparent hover:border-[var(--Border-Low-Emphasis)]",
				children: /* @__PURE__ */ N(Xs, { placeholder: r })
			}), /* @__PURE__ */ N(Qs, {
				position: a,
				children: t.map((e) => /* @__PURE__ */ P($s, {
					value: e.value,
					children: [e.icon, e.label]
				}, e.value))
			})]
		})
	};
}
//#endregion
//#region src/components/patterns/simple-pagination.tsx
function cm() {
	return /* @__PURE__ */ N("svg", {
		width: "16",
		height: "16",
		viewBox: "0 0 16 16",
		fill: "none",
		"aria-hidden": "true",
		children: /* @__PURE__ */ N("path", {
			d: "M10 12L6 8L10 4",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})
	});
}
function lm() {
	return /* @__PURE__ */ N("svg", {
		width: "16",
		height: "16",
		viewBox: "0 0 16 16",
		fill: "none",
		"aria-hidden": "true",
		children: /* @__PURE__ */ N("path", {
			d: "M6 4L10 8L6 12",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})
	});
}
function um({ page: e, onPageChange: t, format: r, compact: i = !1, previousLabel: a = "前へ", nextLabel: o = "次へ", renderLabel: s, className: c, total: l, pageSize: u, totalPages: d, ...f }) {
	let p = r ?? (d === void 0 ? "items" : "pages"), m = d === void 0 ? u && u > 0 ? Math.max(1, Math.ceil((l ?? 0) / u)) : 1 : d, h = Math.min(Math.max(1, e), Math.max(1, m)), g = h > 1, _ = h < m, v = u && l !== void 0 && l > 0 ? (h - 1) * u + 1 : void 0, y = u && l !== void 0 ? Math.min(h * u, l) : void 0, b = () => {
		g && t?.(h - 1);
	}, x = () => {
		_ && t?.(h + 1);
	}, S = n.useMemo(() => s ? s({
		page: h,
		totalPages: m,
		pageSize: u,
		total: l,
		from: v,
		to: y
	}) : i ? /* @__PURE__ */ P("span", {
		className: "tabular-nums",
		children: [
			h,
			" / ",
			m
		]
	}) : p === "items" && l !== void 0 && u ? l === 0 ? /* @__PURE__ */ N("span", {
		className: "tabular-nums",
		children: "0 件"
	}) : /* @__PURE__ */ P(M, { children: [
		/* @__PURE__ */ P("span", {
			className: "tabular-nums",
			children: [
				v?.toLocaleString(),
				" - ",
				y?.toLocaleString()
			]
		}),
		/* @__PURE__ */ N("span", {
			className: "text-[var(--Text-Low-Emphasis)]",
			children: " / 全 "
		}),
		/* @__PURE__ */ N("span", {
			className: "tabular-nums",
			children: l.toLocaleString()
		}),
		/* @__PURE__ */ N("span", {
			className: "text-[var(--Text-Low-Emphasis)]",
			children: " 件"
		})
	] }) : /* @__PURE__ */ P(M, { children: [
		/* @__PURE__ */ N("span", {
			className: "tabular-nums",
			children: h
		}),
		/* @__PURE__ */ N("span", {
			className: "text-[var(--Text-Low-Emphasis)]",
			children: " / "
		}),
		/* @__PURE__ */ N("span", {
			className: "tabular-nums",
			children: m
		}),
		/* @__PURE__ */ N("span", {
			className: "text-[var(--Text-Low-Emphasis)]",
			children: " ページ"
		})
	] }), [
		s,
		i,
		p,
		h,
		m,
		l,
		u,
		v,
		y
	]);
	return /* @__PURE__ */ P("nav", {
		role: "navigation",
		"aria-label": "ページネーション",
		"data-slot": "simple-pagination",
		className: U("flex items-center justify-between gap-2 sm:justify-center sm:gap-4", c),
		...f,
		children: [
			/* @__PURE__ */ P(W, {
				type: "button",
				variant: "tertiary",
				size: "sm",
				onClick: b,
				disabled: !g,
				"aria-label": a,
				children: [/* @__PURE__ */ N(cm, {}), /* @__PURE__ */ N("span", {
					className: i ? "sr-only sm:not-sr-only" : void 0,
					children: a
				})]
			}),
			/* @__PURE__ */ N("div", {
				className: "typo-body-sm text-[var(--Text-High-Emphasis)] text-center",
				"aria-live": "polite",
				children: S
			}),
			/* @__PURE__ */ P(W, {
				type: "button",
				variant: "tertiary",
				size: "sm",
				onClick: x,
				disabled: !_,
				"aria-label": o,
				children: [/* @__PURE__ */ N("span", {
					className: i ? "sr-only sm:not-sr-only" : void 0,
					children: o
				}), /* @__PURE__ */ N(lm, {})]
			})
		]
	});
}
//#endregion
//#region src/components/patterns/menu-drawer.tsx
function dm({ open: e, onClose: t, banner: n, sections: r, footerLinks: i, width: a = 280, className: o }) {
	return /* @__PURE__ */ N(yc, {
		open: e,
		onOpenChange: (e) => !e && t(),
		children: /* @__PURE__ */ P(Vc, {
			side: "left",
			className: U("p-0 flex flex-col", o),
			style: { width: a },
			children: [
				/* @__PURE__ */ N(Kc, {
					className: "sr-only",
					children: /* @__PURE__ */ N(Jc, { children: "メニュー" })
				}),
				/* @__PURE__ */ P("div", {
					className: "flex-1 overflow-y-auto",
					children: [n && /* @__PURE__ */ N("div", {
						className: "mx-3 mt-4 mb-2",
						children: n
					}), r.map((e, n) => /* @__PURE__ */ P("div", {
						className: n > 0 ? "border-t border-[var(--Border-Low-Emphasis)] mt-2 pt-2" : "mt-2",
						children: [e.title && /* @__PURE__ */ N("p", {
							className: "px-4 py-1.5 typo-label-xs text-[var(--Text-Low-Emphasis)] uppercase",
							children: e.title
						}), e.items.map((e, n) => /* @__PURE__ */ P(e.href ? "a" : "button", {
							href: e.href,
							onClick: () => {
								e.onClick?.(), t();
							},
							className: "flex items-center gap-3 w-full px-4 py-2.5 typo-label-sm text-[var(--Text-High-Emphasis)] hover:bg-[var(--Surface-Secondary)] transition-colors text-left",
							children: [
								e.icon && /* @__PURE__ */ N("span", {
									className: "w-5 h-5 flex items-center justify-center text-[var(--Text-Low-Emphasis)] shrink-0",
									children: e.icon
								}),
								/* @__PURE__ */ N("span", {
									className: "flex-1",
									children: e.label
								}),
								e.badge !== void 0 && /* @__PURE__ */ N("span", {
									className: "min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)] typo-label-xs flex items-center justify-center",
									children: e.badge
								}),
								/* @__PURE__ */ N("svg", {
									width: "14",
									height: "14",
									viewBox: "0 0 14 14",
									fill: "none",
									"aria-hidden": "true",
									className: "text-[var(--Text-Low-Emphasis)]",
									children: /* @__PURE__ */ N("path", {
										d: "M5 3l4 4-4 4",
										stroke: "currentColor",
										strokeWidth: "1.5",
										strokeLinecap: "round",
										strokeLinejoin: "round"
									})
								})
							]
						}, n))]
					}, n))]
				}),
				i && i.length > 0 && /* @__PURE__ */ N("div", {
					className: "border-t border-[var(--Border-Low-Emphasis)] py-3 px-4 flex flex-wrap gap-x-4 gap-y-1",
					children: i.map((e, n) => /* @__PURE__ */ N(e.href ? "a" : "button", {
						href: e.href,
						onClick: () => {
							e.onClick?.(), t();
						},
						className: "typo-body-xs text-[var(--Text-Low-Emphasis)] hover:text-[var(--Text-High-Emphasis)] transition-colors",
						children: e.label
					}, n))
				})
			]
		})
	});
}
//#endregion
//#region src/components/patterns/media-action-cluster.tsx
var fm = {
	"top-left": "top-[max(1rem,env(safe-area-inset-top))] left-[max(1rem,env(safe-area-inset-left))]",
	"top-right": "top-[max(1rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))]",
	"bottom-left": "bottom-[max(1rem,env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))]",
	"bottom-right": "bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))]",
	"center-left": "top-1/2 left-[max(1rem,env(safe-area-inset-left))] -translate-y-1/2",
	"center-right": "top-1/2 right-[max(1rem,env(safe-area-inset-right))] -translate-y-1/2"
}, pm = {
	vertical: "flex-col",
	horizontal: "flex-row",
	auto: "flex-col landscape:flex-row"
};
function mm(e, t) {
	return e === "below" ? "flex-col" : e === "side" || t === "horizontal" ? "flex-row" : t === "vertical" ? "flex-col" : "flex-col landscape:flex-row";
}
function hm(e) {
	return typeof e == "number" && e > 99 ? "99+" : e;
}
function gm({ items: e, orientation: t = "vertical", anchor: r = "bottom-right", position: i = "absolute", labelPosition: a = "auto", autoHideMs: o = 5e3, defaultVisible: s = !0, onVisibleChange: c, className: l, "aria-label": u = "メディアアクション", ...d }) {
	let [f, p] = n.useState(s), m = n.useRef(null), h = o != null && o > 0, g = n.useCallback(() => {
		m.current &&= (clearTimeout(m.current), null);
	}, []), _ = n.useCallback((e) => {
		p((t) => (t !== e && c?.(e), e));
	}, [c]), v = n.useCallback(() => {
		g(), h && (m.current = setTimeout(() => _(!1), o));
	}, [
		h,
		o,
		g,
		_
	]), y = n.useCallback(() => {
		_(!0), v();
	}, [v, _]);
	n.useEffect(() => {
		if (!h) {
			g(), _(!0);
			return;
		}
		return v(), g;
	}, [
		h,
		g,
		v,
		_
	]), n.useEffect(() => {
		if (!h || typeof window > "u") return;
		let e = () => y();
		return window.addEventListener("pointerdown", e, { passive: !0 }), window.addEventListener("touchstart", e, { passive: !0 }), window.addEventListener("keydown", e), window.addEventListener("wheel", e, { passive: !0 }), () => {
			window.removeEventListener("pointerdown", e), window.removeEventListener("touchstart", e), window.removeEventListener("keydown", e), window.removeEventListener("wheel", e);
		};
	}, [h, y]);
	let b = mm(a, t);
	return /* @__PURE__ */ N("div", {
		"data-slot": "media-action-cluster",
		"data-orientation": t,
		"data-anchor": r,
		"data-visible": f,
		role: "group",
		"aria-label": u,
		onPointerEnter: y,
		onFocusCapture: y,
		className: U("z-40 flex items-center gap-3 transition-opacity duration-300", i === "fixed" ? "fixed" : "absolute", fm[r], pm[t], f ? "opacity-100" : "opacity-40", l),
		...d,
		children: e.map((e, t) => /* @__PURE__ */ N(_m, {
			item: e,
			itemDirection: b,
			onReveal: y
		}, e.id ?? `${e.label}-${t}`))
	});
}
function _m({ item: e, itemDirection: t, onReveal: n }) {
	let r = (t) => {
		if (n(), e.disabled) {
			t.preventDefault();
			return;
		}
		e.onClick?.();
	}, i = /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ P("span", {
		className: U("relative flex size-12 shrink-0 items-center justify-center rounded-full glass glass-specular glass-inverse", "transition-transform active:scale-[0.94]", e.active && "ring-2 ring-[var(--Border-Accent-Primary)]", e.disabled && "opacity-50"),
		"aria-hidden": "true",
		children: [e.icon, e.badge != null && /* @__PURE__ */ N("span", {
			className: "absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--Surface-Caution-Strong)] px-1 typo-label-xs text-[var(--Text-on-Media)] shadow-[var(--shadow-sm)]",
			children: hm(e.badge)
		})]
	}), /* @__PURE__ */ N("span", {
		className: "max-w-24 truncate text-center typo-label-xs text-on-media",
		children: e.label
	})] }), a = U("group inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full", "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50", "disabled:pointer-events-none disabled:opacity-50", t);
	return e.href ? /* @__PURE__ */ N("a", {
		href: e.disabled ? void 0 : e.href,
		"aria-label": e.ariaLabel ?? e.label,
		"aria-disabled": e.disabled || void 0,
		"data-active": e.active || void 0,
		onClick: r,
		className: a,
		children: i
	}) : /* @__PURE__ */ N("button", {
		type: "button",
		"aria-label": e.ariaLabel ?? e.label,
		"aria-pressed": e.active ?? void 0,
		disabled: e.disabled,
		onClick: r,
		className: a,
		children: i
	});
}
//#endregion
//#region src/components/patterns/photo-hero.tsx
var vm = {
	none: "bg-transparent",
	medium: "bg-[var(--Surface-VideoOverlay-Medium)]",
	dark: "bg-[var(--Surface-VideoOverlay-Strong)]"
}, ym = {
	bottom: "justify-end pt-24 pb-[calc(env(safe-area-inset-bottom,0px)_+_3rem)]",
	center: "justify-center py-16"
};
function bm({ src: e, alt: t = "", overlay: n = "medium", align: r = "bottom", children: i, className: a, imageClassName: o, contentClassName: s, loading: c = "lazy", ...l }) {
	return /* @__PURE__ */ P("section", {
		"data-slot": "photo-hero",
		"data-overlay": n,
		"data-align": r,
		className: U("relative isolate flex h-full min-h-[100dvh] overflow-hidden bg-[var(--Surface-Inverse)] text-[var(--Text-on-Media)]", a),
		...l,
		children: [
			/* @__PURE__ */ N("img", {
				src: e,
				alt: t,
				"aria-hidden": t ? void 0 : !0,
				loading: c,
				className: U("absolute inset-0 size-full object-cover", o)
			}),
			/* @__PURE__ */ N("div", { className: U("absolute inset-0 z-0", vm[n]) }),
			/* @__PURE__ */ N("div", {
				"data-slot": "photo-hero-content",
				className: U("relative z-10 flex min-h-[inherit] w-full flex-col px-6", ym[r], s),
				children: /* @__PURE__ */ N("div", {
					className: "flex w-full flex-col gap-4",
					children: i
				})
			})
		]
	});
}
function xm({ className: e, children: t, ...n }) {
	return /* @__PURE__ */ N("p", {
		"data-slot": "photo-hero-eyebrow",
		className: U("typo-label-sm text-[var(--Text-on-Media-Secondary)] typo-on-image", e),
		...n,
		children: t
	});
}
function Sm({ className: e, children: t, ...n }) {
	return /* @__PURE__ */ N("h1", {
		"data-slot": "photo-hero-title",
		className: U("max-w-xl typo-heading-3xl text-[var(--Text-on-Media)] typo-on-image", e),
		...n,
		children: t
	});
}
function Cm({ className: e, children: t, ...n }) {
	return /* @__PURE__ */ N("p", {
		"data-slot": "photo-hero-body",
		className: U("max-w-xl typo-body-md text-[var(--Text-on-Media-Secondary)] typo-on-image", e),
		...n,
		children: t
	});
}
function wm({ className: e, children: t, ...n }) {
	return /* @__PURE__ */ N("div", {
		"data-slot": "photo-hero-actions",
		className: U("mt-2 flex flex-col gap-3", e),
		...n,
		children: t
	});
}
var Tm = Object.assign(bm, {
	Eyebrow: xm,
	Title: Sm,
	Body: Cm,
	Actions: wm
}), Em = {
	none: "",
	page: "px-6 py-6"
};
function Dm({ children: e, footer: t, header: n, scroll: r = !0, padding: i = "page", className: a, bodyClassName: o, headerClassName: s, footerClassName: c, mainId: l = "main-content", skipLink: u = !0, skipLinkLabel: d = "コンテンツへ移動", ...f }) {
	return /* @__PURE__ */ P("div", {
		"data-slot": "screen",
		"data-scroll": r,
		"data-padding": i,
		className: U("flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)]", a),
		...f,
		children: [
			u && d && /* @__PURE__ */ N(ff, {
				targetId: l,
				label: d
			}),
			n && /* @__PURE__ */ N("div", {
				"data-slot": "screen-header",
				className: U("shrink-0", s),
				children: n
			}),
			/* @__PURE__ */ N("main", {
				id: l,
				tabIndex: -1,
				"data-slot": "screen-body",
				className: U("flex-1 min-h-0", r ? "overflow-y-auto overscroll-contain" : "overflow-hidden", Em[i], o),
				children: e
			}),
			t && /* @__PURE__ */ N("footer", {
				"data-slot": "screen-footer",
				className: U("shrink-0 bg-[var(--Surface-Primary)] px-6 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)_+_1rem)]", c),
				children: t
			})
		]
	});
}
//#endregion
//#region src/components/patterns/footer.tsx
var Om = [
	"VISA",
	"Master",
	"JCB",
	"AmEx",
	"PayPay",
	"LINE Pay"
];
function km({ logo: e, linkGroups: t = [], paymentIcons: n = Om, socialLinks: r = [], copyright: i, className: a }) {
	return /* @__PURE__ */ N("footer", {
		"data-slot": "footer",
		className: U("bg-[var(--Surface-Inverse)] text-[var(--Text-on-Inverse)] w-full", a),
		children: /* @__PURE__ */ P("div", {
			className: "max-w-5xl mx-auto px-6 py-10",
			children: [
				e && /* @__PURE__ */ N("div", {
					className: "mb-8",
					children: e
				}),
				t.length > 0 && /* @__PURE__ */ N("div", {
					className: "grid gap-8 mb-8",
					style: { gridTemplateColumns: `repeat(${Math.min(t.length, 4)}, minmax(0, 1fr))` },
					children: t.map((e, t) => /* @__PURE__ */ P("div", { children: [/* @__PURE__ */ N("h4", {
						className: "typo-label-xs font-bold uppercase tracking-wider text-[var(--Text-on-Inverse)]/50 mb-3",
						children: e.title
					}), /* @__PURE__ */ N("ul", {
						className: "flex flex-col gap-2",
						children: e.links.map((e, t) => /* @__PURE__ */ N("li", { children: /* @__PURE__ */ N(e.href ? "a" : "button", {
							href: e.href,
							onClick: e.onClick,
							className: "typo-body-sm text-[var(--Text-on-Inverse)]/70 hover:text-[var(--Text-on-Inverse)] transition-colors",
							children: e.label
						}) }, t))
					})] }, t))
				}),
				r.length > 0 && /* @__PURE__ */ N("div", {
					className: "flex gap-3 mb-6",
					children: r.map((e, t) => /* @__PURE__ */ N(e.href ? "a" : "button", {
						href: e.href,
						"aria-label": e.label,
						className: "w-9 h-9 rounded-full bg-[var(--Object-on-Inverse)]/10 hover:bg-[var(--Object-on-Inverse)]/20 flex items-center justify-center transition-colors",
						children: e.icon
					}, t))
				}),
				n.length > 0 && /* @__PURE__ */ N("div", {
					className: "flex flex-wrap gap-2 mb-6",
					children: n.map((e, t) => /* @__PURE__ */ N("span", {
						className: "px-2 py-1 rounded bg-[var(--Object-on-Inverse)]/10 text-[var(--Text-on-Inverse)]/60 typo-label-xs",
						children: e
					}, t))
				}),
				i && /* @__PURE__ */ N("p", {
					className: "typo-body-xs text-[var(--Text-on-Inverse)]/30 border-t border-[var(--Object-on-Inverse)]/10 pt-4",
					children: i
				})
			]
		})
	});
}
//#endregion
//#region src/components/patterns/share-buttons.tsx
var Am = {
	global: [
		"line",
		"x",
		"facebook",
		"copy"
	],
	jp: [
		"line",
		"x",
		"copy"
	],
	us: [
		"whatsapp",
		"x",
		"copy"
	]
};
function jm(e, t) {
	return t ? `${t} ${e}` : e;
}
var Mm = {
	line: {
		label: "LINE",
		buildUrl: (e, t) => `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(e)}${t ? `&text=${encodeURIComponent(t)}` : ""}`,
		icon: /* @__PURE__ */ N("svg", {
			width: "22",
			height: "22",
			viewBox: "0 0 22 22",
			fill: "none",
			"aria-hidden": "true",
			children: /* @__PURE__ */ N("path", {
				d: "M11 2C6.6 2 3 5 3 8.8c0 3.3 2.7 6.1 6.5 6.7l.9 1.9 3.1-1.9c3.8-.4 6.5-3.1 6.5-6.7C20 5 16.4 2 11 2z",
				fill: "currentColor"
			})
		}),
		circleClass: "bg-[var(--Brand-Line)] text-[var(--Text-on-Media)]",
		inlineClass: "border-[var(--Brand-Line)] text-[var(--Brand-Line)] hover:bg-[var(--Surface-Success-Subtle)]"
	},
	x: {
		label: "X",
		buildUrl: (e, t) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(e)}${t ? `&text=${encodeURIComponent(t)}` : ""}`,
		icon: /* @__PURE__ */ N("svg", {
			width: "18",
			height: "18",
			viewBox: "0 0 18 18",
			fill: "currentColor",
			"aria-hidden": "true",
			children: /* @__PURE__ */ N("path", { d: "M14.2 1h2.5L10.8 7.8 17.5 17h-5.3l-3.9-5.1L4 17H1.5l6.3-7.2L1 1h5.4l3.5 4.6L14.2 1zm-.9 14.3h1.4L5.7 2.4H4.2l9.1 12.9z" })
		}),
		circleClass: "bg-[var(--Surface-Inverse)] text-[var(--Text-on-Inverse)]",
		inlineClass: "border-[var(--Border-High-Emphasis)] text-[var(--Text-High-Emphasis)] hover:bg-[var(--Surface-Secondary)]"
	},
	facebook: {
		label: "Facebook",
		buildUrl: (e) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(e)}`,
		icon: /* @__PURE__ */ N("svg", {
			width: "20",
			height: "20",
			viewBox: "0 0 20 20",
			fill: "currentColor",
			"aria-hidden": "true",
			children: /* @__PURE__ */ N("path", { d: "M20 10C20 4.5 15.5 0 10 0S0 4.5 0 10c0 5 3.7 9.1 8.4 9.9v-7H5.9V10h2.5V7.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.5V10h2.8l-.4 2.9h-2.3v7C16.3 19.1 20 15 20 10z" })
		}),
		circleClass: "bg-[var(--Info-Base)] text-[var(--Text-on-Media)]",
		inlineClass: "border-[var(--Info-Base)] text-[var(--Text-Info)] hover:bg-[var(--Surface-Info-Subtle)]"
	},
	instagram: {
		label: "Instagram",
		webShare: !0,
		icon: /* @__PURE__ */ P("svg", {
			width: "20",
			height: "20",
			viewBox: "0 0 20 20",
			fill: "none",
			"aria-hidden": "true",
			children: [
				/* @__PURE__ */ N("rect", {
					x: "3",
					y: "3",
					width: "14",
					height: "14",
					rx: "4",
					stroke: "currentColor",
					strokeWidth: "1.8"
				}),
				/* @__PURE__ */ N("circle", {
					cx: "10",
					cy: "10",
					r: "3.2",
					stroke: "currentColor",
					strokeWidth: "1.8"
				}),
				/* @__PURE__ */ N("circle", {
					cx: "14.3",
					cy: "5.8",
					r: "1",
					fill: "currentColor"
				})
			]
		}),
		circleClass: "bg-[var(--Categorical-9)] text-[var(--Text-on-Media)]",
		inlineClass: "border-[var(--Categorical-9)] text-[var(--Categorical-9-Bold)] hover:bg-[var(--Categorical-9-Subtle)]"
	},
	email: {
		label: "メール",
		buildUrl: (e, t) => `mailto:?subject=${encodeURIComponent(t ?? "")}&body=${encodeURIComponent(jm(e, t))}`,
		icon: /* @__PURE__ */ P("svg", {
			width: "20",
			height: "20",
			viewBox: "0 0 20 20",
			fill: "none",
			"aria-hidden": "true",
			children: [/* @__PURE__ */ N("rect", {
				x: "2.5",
				y: "4",
				width: "15",
				height: "12",
				rx: "2",
				stroke: "currentColor",
				strokeWidth: "1.5"
			}), /* @__PURE__ */ N("path", {
				d: "M3.5 6l6.5 5 6.5-5",
				stroke: "currentColor",
				strokeWidth: "1.5",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			})]
		}),
		circleClass: "bg-[var(--Surface-Tertiary)] text-[var(--Object-Medium-Emphasis)]",
		inlineClass: "border-[var(--Border-Medium-Emphasis)] text-[var(--Text-Medium-Emphasis)] hover:border-[var(--Brand-Primary)] hover:text-[var(--Brand-Primary)]"
	},
	whatsapp: {
		label: "WhatsApp",
		buildUrl: (e, t) => `https://wa.me/?text=${encodeURIComponent(jm(e, t))}`,
		icon: /* @__PURE__ */ P("svg", {
			width: "20",
			height: "20",
			viewBox: "0 0 20 20",
			fill: "none",
			"aria-hidden": "true",
			children: [/* @__PURE__ */ N("path", {
				d: "M4.1 15.9l.8-2.9a7 7 0 111.9 2l-2.7.9z",
				stroke: "currentColor",
				strokeWidth: "1.6",
				strokeLinejoin: "round"
			}), /* @__PURE__ */ N("path", {
				d: "M7.8 6.9c.2-.4.3-.4.6-.4h.4c.1 0 .3 0 .4.3l.6 1.4c.1.2.1.3 0 .5l-.4.5c-.1.1-.2.2-.1.4.4.8 1 1.5 1.8 1.9.2.1.3.1.5-.1l.5-.6c.1-.2.3-.2.5-.1l1.4.7c.2.1.3.2.3.4 0 .5-.3 1.3-.9 1.5-.6.2-1.8.1-3.1-.7-1.5-.8-2.7-2-3.4-3.4-.7-1.3-.7-2.1-.5-2.6z",
				fill: "currentColor"
			})]
		}),
		circleClass: "bg-[var(--Success-Base)] text-[var(--Text-on-Media)]",
		inlineClass: "border-[var(--Success-Base)] text-[var(--Text-Success)] hover:bg-[var(--Surface-Success-Subtle)]"
	},
	telegram: {
		label: "Telegram",
		buildUrl: (e, t) => `https://t.me/share/url?url=${encodeURIComponent(e)}${t ? `&text=${encodeURIComponent(t)}` : ""}`,
		icon: /* @__PURE__ */ N("svg", {
			width: "20",
			height: "20",
			viewBox: "0 0 20 20",
			fill: "currentColor",
			"aria-hidden": "true",
			children: /* @__PURE__ */ N("path", { d: "M17.3 3.2L2.7 8.8c-1 .4-1 1-.2 1.3l3.7 1.2 1.4 4.2c.2.6.4.8.8.8s.6-.2.9-.5l2-2 4.1 3c.8.4 1.3.2 1.5-.7l2.6-12.2c.2-1-.4-1.4-1.2-1zM7 10.9l8.1-5.1c.4-.2.7-.1.4.2l-6.9 6.2-.3 2.7L7 10.9z" })
		}),
		circleClass: "bg-[var(--Categorical-2)] text-[var(--Text-on-Media)]",
		inlineClass: "border-[var(--Categorical-2)] text-[var(--Categorical-2-Bold)] hover:bg-[var(--Categorical-2-Subtle)]"
	},
	copy: {
		label: "リンク",
		icon: /* @__PURE__ */ P("svg", {
			width: "20",
			height: "20",
			viewBox: "0 0 20 20",
			fill: "none",
			"aria-hidden": "true",
			children: [/* @__PURE__ */ N("path", {
				d: "M8.5 11.5a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1.7 1.7",
				stroke: "currentColor",
				strokeWidth: "1.5",
				strokeLinecap: "round"
			}), /* @__PURE__ */ N("path", {
				d: "M11.5 8.5a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1.7-1.7",
				stroke: "currentColor",
				strokeWidth: "1.5",
				strokeLinecap: "round"
			})]
		}),
		circleClass: "bg-[var(--Surface-Tertiary)] text-[var(--Object-Medium-Emphasis)]",
		inlineClass: "border-[var(--Border-Medium-Emphasis)] text-[var(--Text-Medium-Emphasis)] hover:border-[var(--Brand-Primary)] hover:text-[var(--Brand-Primary)]"
	}
};
function Nm({ url: e, title: t, providers: r, region: i = "global", layout: a = "circle", className: o, onShare: s, onCopy: c, copiedLabel: l = "コピーしました", copyErrorLabel: u = "コピーできませんでした", feedbackDuration: d = 2e3 }) {
	let [f, p] = n.useState(null), m = n.useRef(null), h = r ?? Am[i];
	n.useEffect(() => () => {
		m.current && clearTimeout(m.current);
	}, []);
	let g = (e, t) => {
		m.current && clearTimeout(m.current), p({
			provider: e,
			result: t
		}), c?.(t), m.current = setTimeout(() => {
			p(null), m.current = null;
		}, d);
	}, _ = async (t) => {
		try {
			if (typeof navigator > "u" || !navigator.clipboard?.writeText) throw Error("Clipboard API is unavailable");
			await navigator.clipboard.writeText(e), g(t, "success");
		} catch {
			g(t, "error");
		}
	}, v = async (n) => {
		if (s?.(n), n === "copy") {
			await _(n);
			return;
		}
		let r = Mm[n];
		if (r.webShare && typeof navigator < "u" && "share" in navigator) {
			try {
				await navigator.share({
					title: t,
					url: e
				});
			} catch {}
			return;
		}
		if (r.webShare) {
			await _(n);
			return;
		}
		r.buildUrl && window.open(r.buildUrl(e, t), "_blank", "noopener,noreferrer,width=600,height=500");
	};
	return a === "circle" ? /* @__PURE__ */ N("div", {
		"data-slot": "share-buttons",
		"data-layout": "circle",
		className: U("flex items-center gap-4", o),
		role: "group",
		"aria-label": "シェア",
		"data-region": i,
		children: h.map((e) => {
			let t = Mm[e], n = f?.provider === e ? f.result : null, r = n === "success" ? l : n === "error" ? u : t.label;
			return /* @__PURE__ */ P("button", {
				type: "button",
				onClick: () => void v(e),
				"aria-label": t.label,
				className: "flex min-h-11 flex-col items-center gap-2 rounded-lg cursor-pointer focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
				children: [/* @__PURE__ */ P("span", {
					className: U("size-12 rounded-full flex items-center justify-center transition-opacity hover:opacity-80 active:scale-95", t.circleClass),
					children: [
						n === "success" && /* @__PURE__ */ N(se, {
							size: 18,
							"aria-hidden": "true"
						}),
						n === "error" && /* @__PURE__ */ N(V, {
							size: 18,
							"aria-hidden": "true"
						}),
						!n && t.icon
					]
				}), /* @__PURE__ */ N("span", {
					"aria-live": "polite",
					"aria-atomic": "true",
					className: "typo-label-xs text-[var(--Text-Medium-Emphasis)]",
					children: r
				})]
			}, e);
		})
	}) : /* @__PURE__ */ N("div", {
		"data-slot": "share-buttons",
		"data-layout": "inline",
		className: U("flex items-center gap-2 flex-wrap", o),
		role: "group",
		"aria-label": "シェア",
		"data-region": i,
		children: h.map((e) => {
			let t = Mm[e], n = f?.provider === e ? f.result : null, r = n === "success" ? l : n === "error" ? u : t.label;
			return /* @__PURE__ */ P("button", {
				type: "button",
				onClick: () => void v(e),
				"aria-label": t.label,
				className: U("inline-flex min-h-11 items-center gap-2 px-3 py-2 rounded-full border border-[var(--Border-Medium-Emphasis)] typo-label-xs transition-colors focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50", t.inlineClass),
				children: [/* @__PURE__ */ P("span", {
					className: "size-4 flex items-center justify-center [&>svg]:size-full",
					children: [
						n === "success" && /* @__PURE__ */ N(se, {
							size: 16,
							"aria-hidden": "true"
						}),
						n === "error" && /* @__PURE__ */ N(V, {
							size: 16,
							"aria-hidden": "true"
						}),
						!n && t.icon
					]
				}), /* @__PURE__ */ N("span", {
					"aria-live": "polite",
					"aria-atomic": "true",
					children: r
				})]
			}, e);
		})
	});
}
//#endregion
//#region src/components/patterns/banner-carousel.tsx
var Pm = [
	"var(--Categorical-10)",
	"var(--Categorical-6)",
	"var(--Categorical-13)",
	"var(--Categorical-3)",
	"var(--Categorical-11)"
], Fm = {
	"2/1": "aspect-[2/1]",
	"3/2": "aspect-[3/2]",
	"4/3": "aspect-[4/3]"
};
function Im({ title: e, items: t, moreLabel: n = "もっと見る", onMore: r, itemAspectRatio: i = "2/1", itemWidth: a = 200, className: o }) {
	return /* @__PURE__ */ P("div", {
		"data-slot": "banner-carousel",
		className: U("w-full", o),
		children: [(e || r) && /* @__PURE__ */ P("div", {
			className: "flex items-center justify-between mb-2.5 px-0.5",
			children: [e && /* @__PURE__ */ N("h3", {
				className: "typo-label-md text-[var(--Text-High-Emphasis)] font-bold",
				children: e
			}), r && /* @__PURE__ */ P("button", {
				onClick: r,
				className: "typo-label-xs text-[var(--Brand-Primary)] font-semibold hover:opacity-70 transition-opacity",
				children: [n, " →"]
			})]
		}), /* @__PURE__ */ N("div", {
			className: "flex gap-2.5 overflow-x-auto scrollbar-none pb-1",
			children: t.map((e, t) => {
				let n = e.gradient ?? Pm[t % Pm.length], r = e.href ? "a" : e.onClick ? "button" : "div";
				return /* @__PURE__ */ P(r, {
					href: e.href,
					type: r === "button" ? "button" : void 0,
					onClick: e.onClick,
					style: {
						width: a,
						flexShrink: 0,
						background: e.imageSrc ? void 0 : n
					},
					className: U("rounded-xl overflow-hidden flex flex-col justify-end p-3 text-left", (e.href || e.onClick) && "cursor-pointer", "hover:opacity-95 active:scale-[.98] transition-transform", Fm[i] ?? "aspect-[2/1]", e.href && "block", !e.imageSrc && "text-[var(--Text-on-Media)]"),
					children: [e.imageSrc && /* @__PURE__ */ N("img", {
						src: e.imageSrc,
						alt: e.caption ?? "",
						className: "absolute inset-0 w-full h-full object-cover",
						style: { position: "absolute" }
					}), (e.caption || e.subCaption) && /* @__PURE__ */ P("div", {
						className: "relative z-10",
						children: [e.caption && /* @__PURE__ */ N("p", {
							className: "typo-label-xs leading-snug text-[var(--Text-on-Media)]",
							children: e.caption
						}), e.subCaption && /* @__PURE__ */ N("p", {
							className: "typo-label-xs opacity-75 mt-0.5 text-[var(--Text-on-Media)]",
							children: e.subCaption
						})]
					})]
				}, t);
			})
		})]
	});
}
//#endregion
//#region src/components/patterns/content-carousel.tsx
function Lm() {
	let [e, t] = n.useState(!1);
	return n.useEffect(() => {
		if (typeof window.matchMedia != "function") return;
		let e = window.matchMedia("(prefers-reduced-motion: reduce)"), n = () => t(e.matches);
		return n(), e.addEventListener?.("change", n), () => e.removeEventListener?.("change", n);
	}, []), e;
}
function Rm({ slides: e, showDots: t = !0, showArrows: r = !0, autoPlay: i = 0, className: a, "aria-label": o = "コンテンツカルーセル", onKeyDown: s, onMouseEnter: c, onMouseLeave: l, onFocusCapture: u, onBlurCapture: d, tabIndex: f = 0, ...p }) {
	let m = n.Children.toArray(e), h = m.length, [g, _] = n.useState(!1), v = Lm(), { active: y, goTo: b, next: x, previous: S, scrollRef: C } = Bf({
		total: h,
		autoPlay: i,
		paused: g || v
	});
	if (!h) return null;
	let w = (e) => {
		s?.(e);
		let t = e.target, n = t === e.currentTarget || t.hasAttribute("data-slide");
		e.defaultPrevented || !n || (e.key === "ArrowLeft" ? (e.preventDefault(), S()) : e.key === "ArrowRight" && (e.preventDefault(), x()));
	}, T = (e) => {
		_(!0), c?.(e);
	}, E = (e) => {
		_(!1), l?.(e);
	}, D = (e) => {
		_(!0), u?.(e);
	}, ee = (e) => {
		e.currentTarget.contains(e.relatedTarget) || _(!1), d?.(e);
	};
	return /* @__PURE__ */ P("div", {
		...p,
		"data-slot": "content-carousel",
		role: "region",
		"aria-roledescription": "carousel",
		"aria-label": o,
		tabIndex: f,
		onKeyDown: w,
		onMouseEnter: T,
		onMouseLeave: E,
		onFocusCapture: D,
		onBlurCapture: ee,
		className: U("group/carousel relative", a),
		children: [/* @__PURE__ */ N("div", {
			ref: C,
			className: "flex snap-x snap-mandatory overflow-x-auto scroll-smooth",
			style: { scrollbarWidth: "none" },
			children: m.map((e, t) => /* @__PURE__ */ N("div", {
				"data-slide": !0,
				"data-index": t,
				role: "group",
				"aria-roledescription": "slide",
				"aria-label": `${t + 1} / ${h}`,
				tabIndex: 0,
				className: "w-full shrink-0 snap-start",
				children: e
			}, t))
		}), /* @__PURE__ */ N(Vf, {
			active: y,
			total: h,
			showArrows: r,
			showDots: t,
			onPrevious: S,
			onNext: x,
			onGoTo: b
		})]
	});
}
//#endregion
//#region src/components/patterns/sticky-action-bar.tsx
function zm({ className: e, bordered: t = !0, children: n, ...r }) {
	return /* @__PURE__ */ N("div", {
		"data-slot": "sticky-action-bar",
		className: U("sticky bottom-0 z-40 bg-[var(--Surface-Primary)] px-4 py-3", "pb-[max(0.75rem,env(safe-area-inset-bottom))]", t && "border-t border-[var(--Border-Low-Emphasis)]", e),
		...r,
		children: n
	});
}
//#endregion
//#region src/components/patterns/category-nav.tsx
function Bm({ items: e, className: t }) {
	return /* @__PURE__ */ P("div", {
		"data-slot": "category-nav",
		className: U("flex gap-3 overflow-x-auto px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", t),
		children: [e.map((e, t) => {
			let n = !!e.href || !!e.onClick;
			return e.href ? /* @__PURE__ */ P("a", {
				href: e.href,
				className: U("flex shrink-0 flex-col items-center gap-1 rounded-lg p-1 transition-colors", n && "hover:bg-[var(--Surface-Secondary)]", e.isSelected && "bg-[var(--Surface-Accent-Primary-Light)]"),
				children: [/* @__PURE__ */ N("div", {
					className: U("size-10 overflow-hidden rounded-full border border-[var(--Border-Low-Emphasis)]", e.isSelected ? "border-[var(--Brand-Primary)]" : "border-[var(--Border-Low-Emphasis)]"),
					children: /* @__PURE__ */ N("img", {
						src: e.imageUrl,
						alt: e.imageAlt ?? e.name,
						className: "size-full object-cover",
						loading: "lazy"
					})
				}), /* @__PURE__ */ N("span", {
					className: U("w-14 text-center typo-body-xs leading-tight line-clamp-2", e.isSelected ? "text-[var(--Text-Accent-Primary)]" : "text-[var(--Text-High-Emphasis)]"),
					children: e.name
				})]
			}, t) : /* @__PURE__ */ P("button", {
				type: "button",
				onClick: e.onClick,
				className: U("flex shrink-0 flex-col items-center gap-1 rounded-lg p-1 transition-colors", n && "hover:bg-[var(--Surface-Secondary)]", e.isSelected && "bg-[var(--Surface-Accent-Primary-Light)]"),
				children: [/* @__PURE__ */ N("div", {
					className: U("size-10 overflow-hidden rounded-full border border-[var(--Border-Low-Emphasis)]", e.isSelected ? "border-[var(--Brand-Primary)]" : "border-[var(--Border-Low-Emphasis)]"),
					children: /* @__PURE__ */ N("img", {
						src: e.imageUrl,
						alt: e.imageAlt ?? e.name,
						className: "size-full object-cover",
						loading: "lazy"
					})
				}), /* @__PURE__ */ N("span", {
					className: U("w-14 text-center typo-body-xs leading-tight line-clamp-2", e.isSelected ? "text-[var(--Text-Accent-Primary)]" : "text-[var(--Text-High-Emphasis)]"),
					children: e.name
				})]
			}, t);
		}), /* @__PURE__ */ N("div", {
			className: "w-2 shrink-0",
			"aria-hidden": "true"
		})]
	});
}
//#endregion
//#region src/components/patterns/category-scroll.tsx
var Vm = {
	sm: "size-[60px]",
	md: "size-[100px]",
	lg: "size-[120px]"
}, Hm = {
	sm: "max-w-[60px]",
	md: "max-w-[100px]",
	lg: "max-w-[120px]"
}, Um = {
	sm: "calc((100vw - 32px) / 4.05)",
	md: "calc((100vw - 32px) / 3.5)",
	lg: "calc((100vw - 32px) / 3.0)"
};
function Wm({ title: e, moreHref: t, items: n, thumbnailSize: r = "md", thumbnailShape: i = "square", layout: a = "scroll", gridRows: o = 3, className: s }) {
	let c = i === "circle" ? "rounded-full" : "rounded-lg", l = (e, t) => /* @__PURE__ */ P("a", {
		href: e.href,
		className: "group flex shrink-0 flex-col items-center gap-1.5",
		children: [/* @__PURE__ */ N("div", {
			className: U("shrink-0 overflow-hidden", t ? "aspect-square w-full" : Vm[r], c),
			children: /* @__PURE__ */ N("img", {
				src: e.imageUrl,
				alt: e.name,
				className: "size-full object-cover transition-opacity group-hover:opacity-80",
				loading: "lazy"
			})
		}), /* @__PURE__ */ N("span", {
			className: U("text-center typo-label-sm text-[var(--Text-High-Emphasis)]", t ? "w-full" : Hm[r]),
			children: e.name
		})]
	}, e.href);
	return /* @__PURE__ */ P("section", {
		"data-slot": "category-scroll",
		className: U("py-4", s),
		children: [/* @__PURE__ */ N(Nd, {
			className: "px-4",
			title: e,
			action: t ? /* @__PURE__ */ N("a", {
				href: t,
				className: "typo-body-sm text-[var(--Text-Accent-Primary)] hover:underline shrink-0",
				children: "もっと見る"
			}) : void 0
		}), a === "grid" ? /* @__PURE__ */ P("div", {
			className: "mt-3 overflow-x-auto pl-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
			children: [/* @__PURE__ */ N("div", {
				className: "grid gap-2",
				style: {
					gridTemplateRows: `repeat(${o}, auto)`,
					gridAutoFlow: "column",
					gridAutoColumns: Um[r]
				},
				children: n.map((e) => l(e, !0))
			}), /* @__PURE__ */ N("div", {
				className: "w-4 shrink-0",
				"aria-hidden": "true"
			})]
		}) : /* @__PURE__ */ P("div", {
			className: "mt-3 flex gap-3 overflow-x-auto pl-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
			children: [n.map((e) => l(e)), /* @__PURE__ */ N("div", {
				className: "w-4 shrink-0",
				"aria-hidden": "true"
			})]
		})]
	});
}
//#endregion
//#region src/components/ui/sync-status-badge.tsx
function Gm({ state: e, errorCount: t = 0, onRetry: n, syncingLabel: r = "同期中", successLabel: i = "保存済み", errorLabel: a = (e) => `${e}件のエラー`, offlineLabel: o = "オフライン", retryLabel: s = "再試行", className: c }) {
	if (e === "idle" && t === 0) return null;
	let l = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full typo-label-xs font-medium select-none", u = e === "error" ? {
		role: "alert",
		"aria-live": "assertive",
		"aria-atomic": !0
	} : {
		role: "status",
		"aria-live": "polite",
		"aria-atomic": !0
	};
	return e === "syncing" ? /* @__PURE__ */ P("span", {
		"data-slot": "sync-status-badge",
		"data-state": e,
		...u,
		className: U(l, "bg-[var(--Surface-Info)] text-[var(--Text-Info)]", c),
		children: [/* @__PURE__ */ N("span", {
			"aria-hidden": !0,
			className: "size-3 rounded-full border-[1.5px] border-current border-t-transparent animate-spin"
		}), r]
	}) : e === "success" ? /* @__PURE__ */ P("span", {
		"data-slot": "sync-status-badge",
		"data-state": e,
		...u,
		className: U(l, "bg-[var(--Surface-Success)] text-[var(--Text-Success)]", c),
		children: [/* @__PURE__ */ N("span", {
			"aria-hidden": !0,
			className: "size-1.5 rounded-full bg-current"
		}), i]
	}) : e === "error" ? /* @__PURE__ */ P("span", {
		"data-slot": "sync-status-badge",
		"data-state": e,
		...u,
		className: U(l, "bg-[var(--Surface-Caution)] text-[var(--Text-Caution)]", c),
		children: [
			/* @__PURE__ */ N("span", {
				"aria-hidden": !0,
				className: "size-1.5 rounded-full bg-current"
			}),
			a(t),
			n && /* @__PURE__ */ N("button", {
				type: "button",
				onClick: n,
				className: "ml-1 underline underline-offset-2 hover:no-underline",
				children: s
			})
		]
	}) : e === "offline" ? /* @__PURE__ */ P("span", {
		"data-slot": "sync-status-badge",
		"data-state": e,
		...u,
		className: U(l, "bg-[var(--Surface-Secondary)] text-[var(--Text-Low-Emphasis)]", c),
		children: [/* @__PURE__ */ N("span", {
			"aria-hidden": !0,
			className: "size-1.5 rounded-full bg-current"
		}), o]
	}) : null;
}
//#endregion
//#region src/components/ui/status-action-badge.tsx
var Km = {
	idle: "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Secondary)] text-[var(--Text-Medium-Emphasis)]",
	pending: "border-[var(--Border-Warning)] bg-[var(--Surface-Warning)] text-[var(--Text-Warning)]",
	syncing: "border-[var(--Border-Info)] bg-[var(--Surface-Info)] text-[var(--Text-Info)]",
	success: "border-[var(--Border-Success)] bg-[var(--Surface-Success)] text-[var(--Text-Success)]",
	warning: "border-[var(--Border-Warning)] bg-[var(--Surface-Warning)] text-[var(--Text-Warning)]",
	error: "border-[var(--Border-Caution)] bg-[var(--Surface-Caution)] text-[var(--Text-Caution)]",
	offline: "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Secondary)] text-[var(--Text-Low-Emphasis)]"
}, qm = [
	"form",
	"formAction",
	"formEncType",
	"formMethod",
	"formNoValidate",
	"formTarget",
	"name",
	"value"
];
function Jm(e) {
	let t = { ...e };
	for (let e of qm) delete t[e];
	return t;
}
function Ym({ state: e, loading: t, icon: n }) {
	return n ? /* @__PURE__ */ N("span", {
		"aria-hidden": !0,
		className: "flex size-4 items-center justify-center",
		children: n
	}) : t || e === "syncing" ? /* @__PURE__ */ N("span", {
		"aria-hidden": !0,
		className: "size-3 rounded-full border-[1.5px] border-current border-t-transparent animate-spin"
	}) : /* @__PURE__ */ N("span", {
		"aria-hidden": !0,
		className: "size-1.5 rounded-full bg-current"
	});
}
function Xm({ className: e, state: t = "idle", label: n, count: r, compact: i = !1, loading: a = !1, icon: o, asStatus: s = !1, onClick: c, type: l, disabled: u, ...d }) {
	let f = !!c && !s, p = /* @__PURE__ */ P(M, { children: [
		/* @__PURE__ */ N(Ym, {
			state: t,
			loading: a,
			icon: o
		}),
		i ? /* @__PURE__ */ N("span", {
			className: "sr-only",
			children: n
		}) : /* @__PURE__ */ N("span", {
			className: "max-w-[9rem] truncate",
			children: n
		}),
		r != null && r > 0 && /* @__PURE__ */ N("span", {
			"data-slot": "status-action-badge-count",
			className: U("ml-0.5 rounded-full bg-[var(--Surface-Primary)] px-1.5 py-0.5 typo-label-xs", "text-[var(--Text-High-Emphasis)]"),
			children: r > 99 ? "99+" : r
		})
	] }), m = U("inline-flex min-h-9 max-w-full items-center justify-center gap-1.5 rounded-full border border-[var(--Border-Low-Emphasis)] px-2.5 py-1", "typo-label-xs select-none", Km[t], f && "cursor-pointer transition-colors hover:bg-[var(--Surface-Tertiary)]", f && "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50", u && "opacity-50", i && "min-w-9 px-2", e);
	if (!f) {
		let e = Jm(d);
		return /* @__PURE__ */ N("span", {
			"data-slot": "status-action-badge",
			"data-state": t,
			"data-compact": i || void 0,
			role: t === "error" ? "alert" : "status",
			"aria-live": t === "error" ? "assertive" : "polite",
			"aria-atomic": "true",
			className: m,
			...e,
			children: p
		});
	}
	return /* @__PURE__ */ N("button", {
		"data-slot": "status-action-badge",
		"data-state": t,
		"data-compact": i || void 0,
		type: l ?? "button",
		"aria-label": d["aria-label"] ?? n,
		"aria-busy": a || t === "syncing" || void 0,
		disabled: u || a,
		onClick: c,
		className: m,
		...d,
		children: p
	});
}
var Zm = Xm;
//#endregion
//#region src/components/ui/dropdown-filter.tsx
function Qm({ label: e, value: t, options: r, onSelect: i, hideAll: a = !1, allLabel: o = "すべて", getDisplayLabel: s, valueOnly: c = !1, pristineValue: l, className: u }) {
	let [d, f] = n.useState(!1), p = n.useRef(null), [m, h] = n.useState({
		top: 0,
		left: 0
	}), g = t !== "all" && t !== l, _ = r.find((e) => e.key === t), v = (e) => s ? s(e) : _?.label ?? String(e), y = g ? c ? v(t) : `${e}: ${v(t)}` : e, b = () => {
		if (p.current) {
			let e = p.current.getBoundingClientRect();
			h({
				top: e.bottom + 4,
				left: e.left
			});
		}
		f((e) => !e);
	}, x = (e) => {
		i(e), f(!1);
	};
	return /* @__PURE__ */ P("div", {
		"data-slot": "dropdown-filter",
		"data-active": g || void 0,
		className: U("flex-shrink-0", u),
		children: [/* @__PURE__ */ P("button", {
			ref: p,
			type: "button",
			onClick: b,
			"aria-expanded": d,
			"aria-haspopup": "listbox",
			className: U("h-9 rounded-full px-4 typo-label-sm flex items-center gap-1.5 transition-all duration-200", g ? "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)]" : "bg-[var(--Surface-Primary)] border border-[var(--Border-Low-Emphasis)] text-[var(--Text-Medium-Emphasis)]"),
			children: [
				g && _?.icon && /* @__PURE__ */ N("span", {
					className: "shrink-0 flex items-center",
					children: _.icon
				}),
				y,
				/* @__PURE__ */ N("svg", {
					"aria-hidden": !0,
					className: U("w-3 h-3 transition-transform duration-200", d && "rotate-180"),
					viewBox: "0 0 12 12",
					fill: "none",
					children: /* @__PURE__ */ N("path", {
						d: "M3 4.5L6 7.5L9 4.5",
						stroke: "currentColor",
						strokeWidth: "1.5",
						strokeLinecap: "round",
						strokeLinejoin: "round"
					})
				})
			]
		}), d && /* @__PURE__ */ P(M, { children: [/* @__PURE__ */ N("button", {
			type: "button",
			"aria-label": "閉じる",
			className: "fixed inset-0 z-40",
			onClick: () => f(!1)
		}), /* @__PURE__ */ P("ul", {
			role: "listbox",
			className: "fixed z-50 bg-[var(--Surface-Primary)] border border-[var(--Border-Low-Emphasis)] rounded-2xl shadow-[var(--shadow-lg)] py-1 max-h-[60vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-150",
			style: {
				top: m.top,
				left: Math.min(m.left, (typeof window < "u" ? window.innerWidth : 375) - 200),
				width: 200
			},
			children: [!a && /* @__PURE__ */ N("li", { children: /* @__PURE__ */ P("button", {
				type: "button",
				role: "option",
				"aria-selected": t === "all",
				onClick: () => x("all"),
				className: U("w-full flex items-center justify-between px-4 py-2.5 typo-body-sm transition-colors hover:bg-[var(--Surface-Secondary)]", t === "all" ? "text-[var(--Brand-Primary)]" : "text-[var(--Text-High-Emphasis)]"),
				children: [/* @__PURE__ */ N("span", { children: o }), t === "all" && /* @__PURE__ */ N("span", {
					"aria-hidden": !0,
					className: "text-[var(--Brand-Primary)]",
					children: "✓"
				})]
			}) }), r.map((e) => /* @__PURE__ */ N("li", { children: /* @__PURE__ */ P("button", {
				type: "button",
				role: "option",
				"aria-selected": t === e.key,
				onClick: () => x(e.key),
				className: U("w-full flex items-center justify-between gap-2 px-4 py-2.5 typo-body-sm transition-colors hover:bg-[var(--Surface-Secondary)]", t === e.key ? "text-[var(--Brand-Primary)]" : "text-[var(--Text-High-Emphasis)]"),
				children: [/* @__PURE__ */ P("span", {
					className: "flex items-center gap-2 min-w-0",
					children: [e.icon && /* @__PURE__ */ N("span", {
						className: "shrink-0 flex items-center",
						children: e.icon
					}), /* @__PURE__ */ N("span", {
						className: "truncate",
						children: e.label
					})]
				}), t === e.key && /* @__PURE__ */ N("span", {
					"aria-hidden": !0,
					className: "text-[var(--Brand-Primary)] flex-shrink-0",
					children: "✓"
				})]
			}) }, e.key))]
		})] })]
	});
}
//#endregion
//#region src/components/patterns/filter-chip.tsx
function $m({ label: e, value: t, isActive: n, onClick: r, className: i }) {
	return /* @__PURE__ */ N(sd, {
		size: "lg",
		selected: !!n,
		variant: n ? "filled" : "outline",
		onClick: r,
		className: U("flex-shrink-0", i),
		children: n && t ? `${e}: ${t}` : e
	}, n ? "on" : "off");
}
//#endregion
//#region src/components/patterns/presence-indicator.tsx
function eh(e) {
	let t = e.trim();
	return t ? t.slice(0, 1).toUpperCase() : "?";
}
function th({ name: e, statusText: t, badgeLabel: n, online: r = !0, className: i }) {
	return /* @__PURE__ */ P("div", {
		"data-slot": "presence-indicator",
		role: "status",
		"aria-label": t ? `${e}: ${t}` : e,
		className: U("flex items-center gap-1.5 rounded-full border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] px-2 py-1 shadow-[var(--shadow-sm)]", i),
		children: [
			/* @__PURE__ */ P("div", {
				className: "relative",
				children: [/* @__PURE__ */ N(Re, {
					className: "h-6 w-6",
					children: /* @__PURE__ */ N(Be, {
						className: "typo-label-sm bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)]",
						children: eh(e)
					})
				}), /* @__PURE__ */ N("span", {
					className: U("absolute -right-0.5 -bottom-0.5 h-2 w-2 rounded-full border border-[var(--Surface-Primary)]", r ? "bg-[var(--Object-Success)]" : "bg-[var(--Object-Low-Emphasis)]"),
					"aria-hidden": !0
				})]
			}),
			t && /* @__PURE__ */ N("span", {
				className: "max-w-24 truncate typo-caption text-[var(--Text-Medium-Emphasis)]",
				children: t
			}),
			n && /* @__PURE__ */ N(He, {
				variant: "success",
				children: n
			})
		]
	});
}
//#endregion
//#region src/components/patterns/review-overlay.tsx
function nh({ active: e, onPinCreate: t, pins: r = [], onPinClick: i, holdDuration: a = 600, onHaptic: o, className: s, children: c }) {
	let l = n.useRef(null), u = n.useRef(null), [d, f] = n.useState(null), p = (e, t) => {
		let n = l.current;
		if (!n) return {
			x: .5,
			y: .5
		};
		let r = n.getBoundingClientRect();
		return {
			x: Math.min(1, Math.max(0, (e - r.left) / r.width)),
			y: Math.min(1, Math.max(0, (t - r.top) / r.height))
		};
	}, m = (n, r) => {
		if (!e) return;
		let i = p(n, r);
		f(i), u.current = setTimeout(() => {
			o?.(), t?.(i), f(null);
		}, a);
	}, h = () => {
		u.current && clearTimeout(u.current), f(null);
	};
	return /* @__PURE__ */ P("div", {
		ref: l,
		className: U("relative select-none", s),
		onMouseDown: (e) => m(e.clientX, e.clientY),
		onMouseUp: h,
		onMouseLeave: h,
		onTouchStart: (e) => {
			let t = e.touches[0];
			m(t.clientX, t.clientY);
		},
		onTouchEnd: h,
		onTouchCancel: h,
		children: [
			c,
			e && d && /* @__PURE__ */ N("div", {
				"aria-hidden": !0,
				className: "absolute inset-0 pointer-events-none",
				style: { background: `radial-gradient(circle 60px at ${d.x * 100}% ${d.y * 100}%, transparent 40px, rgba(0,0,0,0.45) 70px)` }
			}),
			e && r.map((e) => /* @__PURE__ */ N("button", {
				type: "button",
				"aria-label": e.comment ?? "レビューピン",
				onClick: () => i?.(e),
				className: "absolute -translate-x-1/2 -translate-y-1/2 z-10 group",
				style: {
					left: `${e.x * 100}%`,
					top: `${e.y * 100}%`
				},
				children: /* @__PURE__ */ N("span", { className: "flex size-5 items-center justify-center rounded-full bg-[var(--Object-Caution)] shadow-[var(--shadow-md)] ring-4 ring-[var(--Object-Caution)]/30 group-hover:ring-[var(--Object-Caution)]/50 transition-all" })
			}, e.id))
		]
	});
}
//#endregion
//#region src/lib/category-presets.ts
function rh(e) {
	return `var(--Categorical-${e})`;
}
function ih(e) {
	return `var(--Categorical-${e}-Subtle)`;
}
function ah(e) {
	return `var(--Categorical-${e}-Bold)`;
}
var oh = [
	{
		key: "family",
		label: "両家顔合わせを済ませる",
		icon: "👨‍👩‍👧",
		categoricalIndex: 8
	},
	{
		key: "venue",
		label: "式場を決める",
		icon: "🏰",
		categoricalIndex: 7
	},
	{
		key: "budget",
		label: "予算を決める",
		icon: "💰",
		categoricalIndex: 5
	},
	{
		key: "ring",
		label: "結婚指輪を決める",
		icon: "💍",
		categoricalIndex: 16
	},
	{
		key: "guest",
		label: "ゲストを確定する",
		icon: "👥",
		categoricalIndex: 2
	},
	{
		key: "dress",
		label: "衣装を決める",
		icon: "👗",
		categoricalIndex: 9
	},
	{
		key: "beauty",
		label: "ブライダル美容を整える",
		icon: "💆‍♀️",
		categoricalIndex: 14
	},
	{
		key: "invitation",
		label: "招待状を送る",
		icon: "📨",
		categoricalIndex: 10
	},
	{
		key: "entertainment",
		label: "結婚式の演出を決める",
		icon: "🎭",
		categoricalIndex: 13
	},
	{
		key: "bgm",
		label: "BGMを決める",
		icon: "🎵",
		categoricalIndex: 15
	},
	{
		key: "photo",
		label: "写真・映像を準備する",
		icon: "📸",
		categoricalIndex: 6
	},
	{
		key: "paper",
		label: "ペーパーアイテムを作る",
		icon: "📄",
		categoricalIndex: 12
	},
	{
		key: "gift",
		label: "贈り物・引出物を選ぶ",
		icon: "🎁",
		categoricalIndex: 1
	},
	{
		key: "official",
		label: "公的手続きを済ませる",
		icon: "📋",
		categoricalIndex: 4
	},
	{
		key: "meeting",
		label: "打ち合わせをまとめる",
		icon: "✍️",
		categoricalIndex: 3
	},
	{
		key: "schedule",
		label: "スケジュールを把握する",
		icon: "🗓️",
		categoricalIndex: 11
	},
	{
		key: "items",
		label: "持ち物を揃える",
		icon: "👜",
		categoricalIndex: 3
	},
	{
		key: "newlife",
		label: "新生活を始める",
		icon: "✈️",
		categoricalIndex: 12
	},
	{
		key: "other",
		label: "その他",
		icon: "📌",
		categoricalIndex: 4
	}
], sh = [
	{
		key: "planning",
		label: "企画",
		icon: "🧭",
		categoricalIndex: 11
	},
	{
		key: "design",
		label: "設計",
		icon: "📐",
		categoricalIndex: 15
	},
	{
		key: "development",
		label: "開発",
		icon: "💻",
		categoricalIndex: 6
	},
	{
		key: "testing",
		label: "テスト",
		icon: "🧪",
		categoricalIndex: 5
	},
	{
		key: "release",
		label: "リリース",
		icon: "🚀",
		categoricalIndex: 7
	},
	{
		key: "operation",
		label: "運用",
		icon: "⚙️",
		categoricalIndex: 3
	},
	{
		key: "documentation",
		label: "ドキュメント",
		icon: "📚",
		categoricalIndex: 2
	},
	{
		key: "other",
		label: "その他",
		icon: "📌",
		categoricalIndex: 4
	}
];
//#endregion
export { fe as Accordion, he as AccordionContent, pe as AccordionItem, me as AccordionTrigger, sp as ActionTile, _f as AdminShell, xe as Alert, Te as AlertDescription, De as AlertDialog, Ie as AlertDialogAction, Le as AlertDialogCancel, je as AlertDialogContent, Fe as AlertDialogDescription, Ne as AlertDialogFooter, Me as AlertDialogHeader, Ae as AlertDialogOverlay, ke as AlertDialogPortal, Pe as AlertDialogTitle, Oe as AlertDialogTrigger, Ce as AlertTitle, mu as AppHeader, vf as AppShell, fl as AutoGrowTextarea, Re as Avatar, Be as AvatarFallback, ze as AvatarImage, He as Badge, pd as Banner, Im as BannerCarousel, Fu as BottomSheetForm, Lu as BottomSheetFrame, $u as BottomTabBar, Ue as Breadcrumb, Ye as BreadcrumbEllipsis, Ge as BreadcrumbItem, Ke as BreadcrumbLink, We as BreadcrumbList, qe as BreadcrumbPage, Je as BreadcrumbSeparator, Xf as BulkActions, W as Button, is as Calendar, Ze as Card, tt as CardAction, nt as CardContent, et as CardDescription, rt as CardFooter, Qe as CardHeader, $e as CardTitle, Bm as CategoryNav, Wm as CategoryScroll, ku as Celebration, Au as CelebrationDialog, pp as ChartControls, at as Checkbox, ot as CheckboxCardGroup, st as CheckboxCardItem, dt as CheckboxField, lt as CheckboxGroup, ut as CheckboxGroupItem, sd as Chip, dd as ChipFilterBar, cd as ChipSelector, Bl as CoachMark, Ul as CoachMarkOverlay, ft as Collapsible, ld as CollapsibleChipField, mt as CollapsibleContent, pt as CollapsibleTrigger, Es as Combobox, ml as CommitAutoGrowTextarea, Yn as CommitInput, pl as CommitTextarea, rp as CompactFilePicker, vu as ConfirmDialog, mf as Container, Rm as ContentCarousel, $l as CookieConsent, Pu as CountdownHero, Pl as CountdownTimer, Np as DataTable, Gp as DataTableActionCell, tm as DataTableAddRow, Hp as DataTableAvatarCell, Ip as DataTableBody, Qp as DataTableBulkActions, Vp as DataTableCell, Wp as DataTableCheckboxCell, Jp as DataTableDateCell, Xp as DataTableDragHandleCell, nm as DataTableEmptyState, Rp as DataTableHead, Fp as DataTableHeader, Up as DataTableImageCell, Kp as DataTableInputCell, Zp as DataTableLinkCell, Yp as DataTableNumberCell, Lp as DataTableRow, em as DataTableSectionRow, qp as DataTableSelectCell, Pp as DataTableTable, gs as DateField, fs as DatePicker, ps as DateRangePicker, Ts as DateTimePicker, Hu as DetailSheetBody, Vu as DetailSheetHeader, Bu as DetailSheetScaffold, vt as Dialog, xt as DialogClose, Ct as DialogContent, Dt as DialogDescription, Tt as DialogFooter, wt as DialogHeader, St as DialogOverlay, bt as DialogPortal, Et as DialogTitle, yt as DialogTrigger, vd as DocumentPage, Qm as DropdownFilter, Tn as DropdownMenu, jn as DropdownMenuCheckboxItem, On as DropdownMenuContent, kn as DropdownMenuGroup, An as DropdownMenuItem, Pn as DropdownMenuLabel, En as DropdownMenuPortal, Mn as DropdownMenuRadioGroup, Nn as DropdownMenuRadioItem, Fn as DropdownMenuSeparator, In as DropdownMenuShortcut, Ln as DropdownMenuSub, zn as DropdownMenuSubContent, Rn as DropdownMenuSubTrigger, Dn as DropdownMenuTrigger, md as EmptyState, il as ErrorBoundary, gd as ErrorState, Cd as FieldDescription, wd as FieldError, Sd as FieldGroup, xd as FieldLegend, Td as FieldSeparator, bd as FieldSet, np as FileUpload, Wf as FilterBar, $m as FilterChip, km as Footer, fn as Form, Sf as FormActions, yn as FormControl, bn as FormDescription, yd as FormField, _n as FormItem, vn as FormLabel, xn as FormMessage, bf as FormRoot, xf as FormSection, el as GridSkeleton, Bn as HoverCard, Hn as HoverCardContent, Vn as HoverCardTrigger, Rl as IconBadge, ip as ImageAttachmentPicker, Hf as ImageCarousel, lu as ImageGallery, ep as ImageUploader, Kn as Input, Yf as KebabMenu, Ku as KeyboardAwareSheetFooter, ct as Label, Ed as ListItem, $c as ListSkeleton, yf as MarketingShell, gm as MediaActionCluster, dm as MenuDrawer, Ju as MobileAppHeader, Yu as MobileAppShell, qu as MobileFloatingActionButton, ad as MobileTabBar, ks as MultiSelect, pu as NavigationBar, hd as NotFoundIllustration, Ad as NotificationBadge, lp as NotificationList, Sl as NumberInput, Pf as OrderSummary, As as Pagination, js as PaginationContent, Is as PaginationEllipsis, Ms as PaginationItem, Ns as PaginationLink, Fs as PaginationNext, Ps as PaginationPrevious, Tm as PhotoHero, wl as PillToggle, as as Popover, cs as PopoverAnchor, ss as PopoverContent, os as PopoverTrigger, th as PresenceIndicator, Ef as PriceDisplay, Lf as ProductCard, zf as ProductCarousel, Ws as Progress, bl as ProgressRing, jd as ProgressSteps, _d as Prose, Nf as QuantitySelector, cp as QuickActionGrid, Gs as RadioGroup, Ks as RadioGroupItem, kf as RatingDisplay, zd as ResponsiveDialog, Kd as ResponsiveDialogClose, Vd as ResponsiveDialogContent, Wd as ResponsiveDialogDescription, Gd as ResponsiveDialogFooter, Hd as ResponsiveDialogHeader, Ud as ResponsiveDialogTitle, Bd as ResponsiveDialogTrigger, Kf as ReviewCard, nh as ReviewOverlay, qf as ReviewSummary, mn as RhfFormField, eu as SOCIAL_ICON_LABELS, nu as SOCIAL_ICON_PLATFORMS, Dm as Screen, Ds as ScrollArea, Os as ScrollBar, Md as SearchBar, $f as SearchPanel, gf as Section, Nd as SectionHeader, Il as SectionNav, Js as Select, Qs as SelectContent, Ys as SelectGroup, $s as SelectItem, tc as SelectLabel, ec as SelectSeparator, Zs as SelectTrigger, Xs as SelectValue, nc as Separator, Od as SettingsListRow, Dd as SettingsSection, Nm as ShareButtons, yc as Sheet, xc as SheetClose, Vc as SheetContent, Yc as SheetDescription, Ic as SheetDragIndicator, qc as SheetFooter, Kc as SheetHeader, Jc as SheetTitle, bc as SheetTrigger, zu as SideDrawerFrame, um as SimplePagination, Zc as Skeleton, Qc as SkeletonText, ff as SkipLink, tl as Slider, au as SocialIcon, su as SocialLoginButton, nl as Spinner, Ol as StarRating, Fd as StatCard, Xm as StatusActionBadge, Zf as StatusTabs, zm as StickyActionBar, Fl as SubNav, _u as SwipeRow, al as Switch, Gm as SyncStatusBadge, Zm as SyncStatusButton, sl as Tabs, ul as TabsContent, cl as TabsList, ll as TabsTrigger, Ld as Tag, hu as TagInput, dl as Textarea, xs as TimePicker, of as Toaster, gl as Tooltip, vl as TooltipContent, hl as TooltipProvider, _l as TooltipTrigger, Ve as badgeVariants, fd as bannerVariants, t as buttonVariants, od as chipVariants, U as cn, pf as containerVariants, om as createDataTableChipColumn, am as createDataTableDateColumn, sm as createDataTableSelectColumn, ah as getCategoricalBold, rh as getCategoricalColor, ih as getCategoricalSubtle, Ep as getStickyCellProps, Ll as iconBadgeVariants, Wl as isCoachCompleted, Xl as isCookieDecided, Gl as markCoachCompleted, Cf as priceVariants, sh as projectCategories, Kl as resetCoach, hf as sectionVariants, Id as tagVariants, df as toast, Jn as useCommitDraft, Gu as useFocusedInputComfortScroll, hn as useFormField, Rd as useMediaQuery, rf as useToast, oh as weddingCategories };
