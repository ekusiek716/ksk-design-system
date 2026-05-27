"use client";
import { jsx as n, jsxs as f, Fragment as de } from "react/jsx-runtime";
import { Accordion as Ge, AlertDialog as xe, Avatar as jt, Checkbox as Ie, Label as On, Collapsible as Ft, Dialog as $, DropdownMenu as U, HoverCard as ht, Popover as Ue, Progress as dr, RadioGroup as Ot, ScrollArea as qe, Select as ae, Separator as Ln, Slider as st, Switch as ur, Tabs as pt, Tooltip as Xe } from "radix-ui";
import { clsx as Wn } from "clsx";
import { twMerge as In } from "tailwind-merge";
import * as x from "react";
import T, { createContext as Hn, useContext as jn, useCallback as ne, useRef as ct, useLayoutEffect as Fn, useState as Lt, useEffect as An, useMemo as dt } from "react";
import { cva as se } from "class-variance-authority";
import { Warning2 as _n, CloseCircle as zn, InfoCircle as Yn, TickCircle as $n, TickSquare as Qr } from "iconsax-reactjs";
import { b as vt } from "./server-variants-CVS6LB4L.js";
import { Slot as Rn } from "@radix-ui/react-slot";
import * as Pe from "@radix-ui/react-tooltip";
import { createPortal as Zr } from "react-dom";
function u(...e) {
  return In(Wn(e));
}
function jd({ ...e }) {
  return /* @__PURE__ */ n(Ge.Root, { "data-slot": "accordion", ...e });
}
function Fd({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    Ge.Item,
    {
      "data-slot": "accordion-item",
      className: u("border-b border-[var(--Border-Low-Emphasis)]", e),
      ...t
    }
  );
}
function Ad({ className: e, children: t, ...r }) {
  return /* @__PURE__ */ n(Ge.Header, { className: "flex", children: /* @__PURE__ */ f(
    Ge.Trigger,
    {
      "data-slot": "accordion-trigger",
      className: u(
        "flex flex-1 items-center justify-between py-4 typo-label-md transition-all cursor-pointer",
        "hover:underline [&[data-state=open]>svg]:rotate-180",
        e
      ),
      ...r,
      children: [
        t,
        /* @__PURE__ */ n("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", className: "shrink-0 transition-transform duration-200", children: /* @__PURE__ */ n("path", { d: "M4 6L8 10L12 6", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) })
      ]
    }
  ) });
}
function _d({ className: e, children: t, ...r }) {
  return /* @__PURE__ */ n(
    Ge.Content,
    {
      "data-slot": "accordion-content",
      className: "overflow-hidden typo-body-md data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up",
      ...r,
      children: /* @__PURE__ */ n("div", { className: u("pb-4 pt-0", e), children: t })
    }
  );
}
const fr = se("relative w-full", {
  variants: {
    variant: {
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
        "bg-[var(--Surface-Caution-Light)]",
        "px-3 py-2"
      ].join(" "),
      "inline-warning": [
        "flex gap-1 items-start rounded-sm",
        "bg-[var(--Surface-Warning)]",
        "px-3 py-2"
      ].join(" ")
    }
  },
  defaultVariants: { variant: "info" }
}), hr = se(
  "flex w-full gap-2 items-start p-4 rounded-lg border",
  {
    variants: {
      variant: {
        success: "border-[var(--Focus-High-Emphasis)]",
        info: "border-[var(--Border-Medium-Emphasis)]",
        error: "border-[var(--Border-Caution)]",
        warning: "border-[var(--Primitive-Wood-800)]",
        "inline-info": "",
        "inline-caution": "",
        "inline-warning": ""
      }
    },
    defaultVariants: { variant: "info" }
  }
), mt = x.createContext("info"), Vn = (e) => e === "success" || e === "info" || e === "error" || e === "warning", qn = {
  success: { Icon: $n, color: "text-[var(--Text-Success)]" },
  info: { Icon: Yn, color: "text-[var(--Text-Medium-Emphasis)]" },
  error: { Icon: zn, color: "text-[var(--Text-Caution)]" },
  warning: { Icon: _n, color: "text-[var(--Text-Warning)]" }
};
function zd({
  className: e,
  variant: t = "info",
  children: r,
  title: a,
  description: o,
  icon: s,
  action: l,
  ...i
}) {
  const c = Vn(t);
  if (c && !r && (a || o)) {
    const { Icon: m, color: h } = qn[t], p = Kr[t] ?? "", v = s ?? /* @__PURE__ */ n(m, { size: 24, className: u("shrink-0", h) });
    return /* @__PURE__ */ n(mt.Provider, { value: t, children: /* @__PURE__ */ n(
      "div",
      {
        "data-slot": "alert",
        "data-variant": t,
        role: "alert",
        className: u(fr({ variant: t }), e),
        ...i,
        children: /* @__PURE__ */ f("div", { className: hr({ variant: t }), children: [
          v,
          /* @__PURE__ */ f("div", { className: "flex-1 min-w-0", children: [
            a && /* @__PURE__ */ n("div", { className: u("typo-label-md", p), children: a }),
            o && /* @__PURE__ */ n("div", { className: "typo-body-sm text-[var(--Text-Medium-Emphasis)] mt-1", children: o })
          ] }),
          l && /* @__PURE__ */ n("div", { className: "shrink-0", children: l })
        ] })
      }
    ) });
  }
  return /* @__PURE__ */ n(mt.Provider, { value: t, children: /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "alert",
      "data-variant": t,
      role: "alert",
      className: u(fr({ variant: t }), e),
      ...i,
      children: c ? /* @__PURE__ */ n("div", { className: hr({ variant: t }), children: r }) : r
    }
  ) });
}
const Kr = {
  success: "text-[var(--Primitive-Forest-800)]",
  info: "text-[var(--Text-High-Emphasis)]",
  error: "text-[var(--Text-Caution)]",
  warning: "text-[var(--Text-Warning)]",
  "inline-info": "text-[var(--Text-High-Emphasis)]",
  "inline-caution": "text-[var(--Text-Caution)]",
  "inline-warning": "text-[var(--Text-Warning)]"
};
function Yd({ className: e, ...t }) {
  const r = x.useContext(mt), a = Kr[r ?? "info"] ?? "";
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "alert-title",
      className: u("typo-label-md", a, e),
      ...t
    }
  );
}
const Gn = {
  error: "text-[var(--Text-Caution)]",
  "inline-caution": "text-[var(--Text-Caution)]",
  "inline-warning": "text-[var(--Text-Warning)]"
};
function $d({
  className: e,
  ...t
}) {
  const r = x.useContext(mt), a = Gn[r ?? ""] ?? "";
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "alert-description",
      className: u(
        "typo-body-sm",
        a || "text-[var(--Text-Medium-Emphasis)]",
        e
      ),
      ...t
    }
  );
}
const Un = {
  light: 10,
  medium: 25,
  heavy: 50,
  warning: [30, 50, 30]
};
function pe({ className: e, variant: t, size: r, layout: a, haptic: o, onClick: s, ...l }) {
  const i = x.useCallback(
    (c) => {
      o && typeof navigator < "u" && "vibrate" in navigator && navigator.vibrate(Un[o]), s?.(c);
    },
    [o, s]
  );
  return /* @__PURE__ */ n(
    "button",
    {
      "data-slot": "button",
      "data-variant": t ?? "default",
      "data-size": r ?? "default",
      className: u(vt({ variant: t, size: r, layout: a, className: e })),
      onClick: i,
      ...l
    }
  );
}
function Rd({
  ...e
}) {
  return /* @__PURE__ */ n(xe.Root, { "data-slot": "alert-dialog", ...e });
}
function Vd({
  ...e
}) {
  return /* @__PURE__ */ n(xe.Trigger, { "data-slot": "alert-dialog-trigger", ...e });
}
function Xn({
  ...e
}) {
  return /* @__PURE__ */ n(xe.Portal, { "data-slot": "alert-dialog-portal", ...e });
}
function Qn({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ n(
    xe.Overlay,
    {
      "data-slot": "alert-dialog-overlay",
      className: u(
        "fixed inset-0 z-50 bg-[var(--Overlay-Medium)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
        e
      ),
      ...t
    }
  );
}
function qd({
  className: e,
  size: t = "default",
  ...r
}) {
  return /* @__PURE__ */ f(Xn, { children: [
    /* @__PURE__ */ n(Qn, {}),
    /* @__PURE__ */ n(
      xe.Content,
      {
        "data-slot": "alert-dialog-content",
        "data-size": t,
        onOpenAutoFocus: (a) => a.preventDefault(),
        className: u(
          "group/alert-dialog-content fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-[var(--Surface-Primary)] p-6 shadow-lg duration-200 data-[size=sm]:max-w-xs data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[size=default]:sm:max-w-lg",
          e
        ),
        ...r
      }
    )
  ] });
}
function Gd({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "alert-dialog-header",
      className: u("flex flex-col gap-2 text-center sm:text-left", e),
      ...t
    }
  );
}
function Ud({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "alert-dialog-footer",
      className: u(
        "flex flex-col-reverse gap-2 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end",
        e
      ),
      ...t
    }
  );
}
function Xd({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ n(
    xe.Title,
    {
      "data-slot": "alert-dialog-title",
      className: u("typo-heading-lg text-[var(--Text-High-Emphasis)]", e),
      ...t
    }
  );
}
function Qd({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ n(
    xe.Description,
    {
      "data-slot": "alert-dialog-description",
      className: u("typo-body-sm text-[var(--Text-Medium-Emphasis)]", e),
      ...t
    }
  );
}
function Zd({
  className: e,
  variant: t = "default",
  size: r = "default",
  ...a
}) {
  return /* @__PURE__ */ n(
    xe.Action,
    {
      "data-slot": "alert-dialog-action",
      className: u(vt({ variant: t, size: r }), e),
      ...a
    }
  );
}
function Kd({
  className: e,
  variant: t = "tertiary",
  size: r = "default",
  ...a
}) {
  return /* @__PURE__ */ n(
    xe.Cancel,
    {
      "data-slot": "alert-dialog-cancel",
      className: u(vt({ variant: t, size: r }), e),
      ...a
    }
  );
}
function Zn({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    jt.Root,
    {
      "data-slot": "avatar",
      className: u("relative flex size-10 shrink-0 overflow-hidden rounded-full", e),
      ...t
    }
  );
}
function Kn({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    jt.Image,
    {
      "data-slot": "avatar-image",
      className: u("aspect-square size-full", e),
      ...t
    }
  );
}
function Jn({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    jt.Fallback,
    {
      "data-slot": "avatar-fallback",
      className: u(
        "flex size-full items-center justify-center rounded-full bg-[var(--Surface-Tertiary)] typo-label-sm text-[var(--Text-Medium-Emphasis)]",
        e
      ),
      ...t
    }
  );
}
const eo = se(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 typo-label-xs w-fit whitespace-nowrap shrink-0 transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)]",
        secondary: "border-transparent bg-[var(--Surface-Secondary)] text-[var(--Text-High-Emphasis)]",
        outline: "border-[var(--Border-Medium-Emphasis)] text-[var(--Text-High-Emphasis)]",
        destructive: "border-transparent bg-[var(--Caution-Base)] text-[var(--Text-on-Inverse)]",
        success: "border-transparent bg-[var(--Success-Base)] text-[var(--Text-on-Inverse)]",
        warning: "border-transparent bg-[var(--Warning-Base)] text-[var(--Text-on-Inverse)]",
        info: "border-transparent bg-[var(--Info-Base)] text-[var(--Text-on-Inverse)]",
        subtle: "border-transparent bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)]",
        ghost: "border-transparent text-[var(--Text-High-Emphasis)]"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Jd({
  className: e,
  variant: t,
  ...r
}) {
  return /* @__PURE__ */ n(
    "span",
    {
      "data-slot": "badge",
      "data-variant": t ?? "default",
      className: u(eo({ variant: t }), e),
      ...r
    }
  );
}
function eu({ label: e = "パンくずリスト", ...t }) {
  return /* @__PURE__ */ n("nav", { "aria-label": e, "data-slot": "breadcrumb", ...t });
}
function tu({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    "ol",
    {
      "data-slot": "breadcrumb-list",
      className: u(
        "flex flex-wrap items-center gap-1.5 break-words typo-body-sm text-[var(--Text-Medium-Emphasis)]",
        e
      ),
      ...t
    }
  );
}
function ru({ className: e, ...t }) {
  return /* @__PURE__ */ n("li", { "data-slot": "breadcrumb-item", className: u("inline-flex items-center gap-1.5", e), ...t });
}
function au({ className: e, ...t }) {
  return /* @__PURE__ */ n("a", { "data-slot": "breadcrumb-link", className: u("hover:text-[var(--Text-High-Emphasis)] transition-colors", e), ...t });
}
function nu({ className: e, ...t }) {
  return /* @__PURE__ */ n("span", { "data-slot": "breadcrumb-page", role: "link", "aria-disabled": "true", "aria-current": "page", className: u("text-[var(--Text-High-Emphasis)] typo-label-sm", e), ...t });
}
function ou({ children: e, className: t, ...r }) {
  return /* @__PURE__ */ n("li", { role: "presentation", "aria-hidden": "true", "data-slot": "breadcrumb-separator", className: u("[&>svg]:size-3.5", t), ...r, children: e ?? /* @__PURE__ */ n("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ n("path", { d: "M6 4L10 8L6 12", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }) });
}
function su({ className: e, ...t }) {
  return /* @__PURE__ */ f("span", { role: "presentation", "aria-hidden": "true", "data-slot": "breadcrumb-ellipsis", className: u("flex size-9 items-center justify-center", e), ...t, children: [
    /* @__PURE__ */ f("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", children: [
      /* @__PURE__ */ n("circle", { cx: "3", cy: "8", r: "1", fill: "currentColor" }),
      /* @__PURE__ */ n("circle", { cx: "8", cy: "8", r: "1", fill: "currentColor" }),
      /* @__PURE__ */ n("circle", { cx: "13", cy: "8", r: "1", fill: "currentColor" })
    ] }),
    /* @__PURE__ */ n("span", { className: "sr-only", children: "その他" })
  ] });
}
const to = se(
  "bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)] flex flex-col rounded-lg border border-[var(--Border-Low-Emphasis)] shadow-[var(--shadow-md)] @container",
  {
    variants: {
      variant: {
        /** 既定: 内側に p-6 と gap-6（情報を持つカード向け）。 */
        default: "gap-6 p-6",
        /** メディアカード: padding/gap なし。サムネ等を端まで広げる用途。
         *  オーバーレイで title/badge を絶対配置するときに p-6 が邪魔だったケースに。 */
        media: "gap-0 p-0 overflow-hidden"
      }
    },
    defaultVariants: { variant: "default" }
  }
);
function iu({ className: e, variant: t, ...r }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "card",
      "data-variant": t ?? "default",
      className: u(to({ variant: t }), e),
      ...r
    }
  );
}
function lu({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "card-header",
      className: u(
        "flex flex-col gap-1.5 @sm:flex-row @sm:items-center",
        e
      ),
      ...t
    }
  );
}
function cu({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "card-title",
      className: u("typo-heading-lg", e),
      ...t
    }
  );
}
function du({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "card-description",
      className: u("typo-body-sm text-[var(--Text-Medium-Emphasis)]", e),
      ...t
    }
  );
}
function uu({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "card-action",
      className: u("@sm:ml-auto", e),
      ...t
    }
  );
}
function fu({ className: e, ...t }) {
  return /* @__PURE__ */ n("div", { "data-slot": "card-content", className: u("", e), ...t });
}
function hu({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "card-footer",
      className: u("flex items-center gap-2", e),
      ...t
    }
  );
}
function mr({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    Ie.Root,
    {
      "data-slot": "checkbox",
      className: u(
        "peer size-5 shrink-0 rounded-[5px] border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)]",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-[var(--Brand-Primary)] data-[state=checked]:text-[var(--Text-on-Inverse)] data-[state=checked]:border-[var(--Brand-Primary)]",
        "data-[state=indeterminate]:bg-[var(--Brand-Primary)] data-[state=indeterminate]:text-[var(--Text-on-Inverse)] data-[state=indeterminate]:border-[var(--Brand-Primary)]",
        e
      ),
      ...t,
      children: /* @__PURE__ */ n(
        Ie.Indicator,
        {
          "data-slot": "checkbox-indicator",
          className: "flex items-center justify-center text-current",
          children: t.checked === "indeterminate" ? /* @__PURE__ */ n("svg", { width: "12", height: "12", viewBox: "0 0 12 12", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ n("path", { d: "M2 6H10", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) }) : /* @__PURE__ */ n("svg", { width: "12", height: "12", viewBox: "0 0 12 12", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ n("path", { d: "M10 3L4.5 8.5L2 6", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) })
        }
      )
    }
  );
}
function ro({
  label: e,
  description: t,
  count: r,
  containerClassName: a,
  className: o,
  id: s,
  ...l
}) {
  const i = x.useId(), c = s ?? i;
  return e === void 0 ? /* @__PURE__ */ n(mr, { id: c, className: o, ...l }) : /* @__PURE__ */ f(
    "label",
    {
      htmlFor: c,
      "data-slot": "checkbox-row",
      "data-disabled": l.disabled || void 0,
      className: u(
        "flex items-center gap-3 rounded-md px-3 py-2 transition-colors cursor-pointer",
        "hover:bg-[var(--Surface-Tertiary)]",
        "has-[:focus-visible]:bg-[var(--Surface-Tertiary)]",
        l.disabled && "cursor-not-allowed opacity-60 hover:bg-transparent has-[:focus-visible]:bg-transparent",
        a
      ),
      children: [
        /* @__PURE__ */ n(mr, { id: c, className: o, ...l }),
        /* @__PURE__ */ f("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ n("span", { className: "typo-body-md text-[var(--Text-High-Emphasis)]", children: e }),
          t && /* @__PURE__ */ n("span", { className: "block typo-body-sm text-[var(--Text-Medium-Emphasis)] mt-0.5", children: t })
        ] }),
        r !== void 0 && /* @__PURE__ */ n("span", { className: "shrink-0 typo-label-sm text-[var(--Text-Medium-Emphasis)] tabular-nums", children: r.toLocaleString() })
      ]
    }
  );
}
function mu({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "checkbox-card-group",
      className: u("grid gap-3", e),
      ...t
    }
  );
}
function pu({
  className: e,
  children: t,
  description: r,
  expandedContent: a,
  badge: o,
  ...s
}) {
  return /* @__PURE__ */ f(
    Ie.Root,
    {
      "data-slot": "checkbox-card-item",
      className: u(
        "group flex cursor-pointer gap-2 rounded-lg border-2 border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] p-[15px] text-left outline-none transition-colors",
        a ? "flex-col items-stretch" : "items-center",
        "hover:border-[var(--Text-High-Emphasis)] hover:bg-[var(--Surface-Secondary)]",
        "data-[state=checked]:border-[var(--Object-Accent-Primary)] data-[state=checked]:bg-[var(--Surface-Primary)]",
        "focus-visible:border-[var(--Object-Accent-Primary)] focus-visible:ring-2 focus-visible:ring-[var(--Object-Accent-Primary)]/20",
        "aria-invalid:border-[var(--Border-Caution)]",
        "disabled:cursor-not-allowed disabled:border-[var(--Border-Medium-Emphasis)] disabled:bg-[var(--Surface-Secondary)]",
        "disabled:hover:border-[var(--Border-Medium-Emphasis)] disabled:hover:bg-[var(--Surface-Secondary)]",
        e
      ),
      ...s,
      children: [
        /* @__PURE__ */ f("span", { className: u("flex items-center gap-2", a && "w-full"), children: [
          /* @__PURE__ */ n(
            "span",
            {
              "data-slot": "checkbox-card-icon",
              className: u(
                "flex size-5 shrink-0 items-center justify-center rounded-[5px] border-2 border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] transition-colors",
                "group-data-[state=checked]:border-transparent group-data-[state=checked]:bg-transparent",
                "group-data-[disabled]:border-[var(--Border-Medium-Emphasis)] group-data-[disabled]:bg-[var(--Surface-Secondary)]"
              ),
              children: /* @__PURE__ */ n(Ie.Indicator, { className: "flex items-center justify-center", children: /* @__PURE__ */ n(
                Qr,
                {
                  size: 24,
                  variant: "Bold",
                  className: "text-[var(--Object-Accent-Primary)]"
                }
              ) })
            }
          ),
          (t || r || o) && /* @__PURE__ */ f("span", { className: "flex min-w-0 flex-1 flex-col", children: [
            (t || o) && /* @__PURE__ */ f("span", { className: "flex items-center gap-1.5", children: [
              t && /* @__PURE__ */ n(
                "span",
                {
                  "data-slot": "checkbox-card-label",
                  className: u(
                    "typo-body-lg text-[var(--Text-High-Emphasis)]",
                    "group-data-[disabled]:text-[var(--Text-Low-Emphasis)]"
                  ),
                  children: t
                }
              ),
              o && /* @__PURE__ */ n("span", { "data-slot": "checkbox-card-badge", children: o })
            ] }),
            r && /* @__PURE__ */ n(
              "span",
              {
                "data-slot": "checkbox-card-description",
                className: u(
                  "typo-body-sm text-[var(--Text-Medium-Emphasis)]",
                  "group-data-[disabled]:text-[var(--Text-Low-Emphasis)]"
                ),
                children: r
              }
            )
          ] })
        ] }),
        a && /* @__PURE__ */ n(
          "span",
          {
            "data-slot": "checkbox-card-expanded",
            className: "hidden border-t border-[var(--Border-Medium-Emphasis)] pt-3 group-data-[state=checked]:block",
            children: a
          }
        )
      ]
    }
  );
}
function Jr({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ n(
    On.Root,
    {
      "data-slot": "label",
      className: u(
        "typo-label-md text-[var(--Text-High-Emphasis)] peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        e
      ),
      ...t
    }
  );
}
function vu({
  label: e,
  required: t,
  helpText: r,
  error: a,
  columns: o = 2,
  children: s,
  className: l
}) {
  const i = o === 1 ? "grid-cols-1" : o === 3 ? "grid-cols-3" : "grid-cols-2";
  return /* @__PURE__ */ f(
    "fieldset",
    {
      "data-slot": "checkbox-group",
      className: u("flex flex-col gap-3", l),
      "aria-invalid": !!a || void 0,
      children: [
        /* @__PURE__ */ f("legend", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ n("span", { className: "typo-label-md text-[var(--Text-High-Emphasis)]", children: e }),
          t && /* @__PURE__ */ n("span", { className: "inline-flex items-center px-1.5 py-0.5 rounded bg-[var(--Surface-Caution)] typo-label-xs text-[var(--Text-on-Inverse)]", children: "必須" })
        ] }),
        /* @__PURE__ */ n("div", { className: u("grid gap-2", i), children: s }),
        r && !a && /* @__PURE__ */ n("p", { className: "typo-body-xs text-[var(--Text-Low-Emphasis)]", children: r }),
        a && /* @__PURE__ */ n("p", { className: "typo-body-xs text-[var(--Text-Caution)]", role: "alert", children: a })
      ]
    }
  );
}
function bu({
  className: e,
  children: t,
  description: r,
  ...a
}) {
  const o = x.useId();
  return /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "checkbox-group-item",
      className: u("flex items-start gap-2", e),
      children: [
        /* @__PURE__ */ n(
          Ie.Root,
          {
            id: o,
            className: u(
              "peer flex size-5 shrink-0 items-center justify-center rounded-[5px] border-2 border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] transition-colors outline-none mt-0.5",
              "data-[state=checked]:border-transparent data-[state=checked]:bg-transparent",
              "focus-visible:border-[var(--Object-Accent-Primary)] focus-visible:ring-2 focus-visible:ring-[var(--Object-Accent-Primary)]/20",
              "aria-invalid:border-[var(--Border-Caution)]",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            ),
            ...a,
            children: /* @__PURE__ */ n(Ie.Indicator, { className: "flex items-center justify-center", children: /* @__PURE__ */ n(
              Qr,
              {
                size: 24,
                variant: "Bold",
                className: "text-[var(--Object-Accent-Primary)]"
              }
            ) })
          }
        ),
        /* @__PURE__ */ f("div", { className: "flex flex-col gap-0.5", children: [
          /* @__PURE__ */ n(
            Jr,
            {
              htmlFor: o,
              className: u(
                "typo-body-md cursor-pointer",
                "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"
              ),
              children: t
            }
          ),
          r && /* @__PURE__ */ n("span", { className: "typo-body-xs text-[var(--Text-Medium-Emphasis)]", children: r })
        ] })
      ]
    }
  );
}
function gu({
  ...e
}) {
  return /* @__PURE__ */ n(Ft.Root, { "data-slot": "collapsible", ...e });
}
function xu({
  ...e
}) {
  return /* @__PURE__ */ n(
    Ft.CollapsibleTrigger,
    {
      "data-slot": "collapsible-trigger",
      ...e
    }
  );
}
function yu({
  ...e
}) {
  return /* @__PURE__ */ n(
    Ft.CollapsibleContent,
    {
      "data-slot": "collapsible-content",
      ...e
    }
  );
}
function ao({ ...e }) {
  return /* @__PURE__ */ n($.Root, { "data-slot": "dialog", ...e });
}
function no({ ...e }) {
  return /* @__PURE__ */ n($.Trigger, { "data-slot": "dialog-trigger", ...e });
}
function oo({ ...e }) {
  return /* @__PURE__ */ n($.Portal, { "data-slot": "dialog-portal", ...e });
}
function so({ ...e }) {
  return /* @__PURE__ */ n($.Close, { "data-slot": "dialog-close", ...e });
}
function io({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    $.Overlay,
    {
      "data-slot": "dialog-overlay",
      className: u(
        "fixed inset-0 z-50 bg-[var(--Overlay-Dark)]",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        e
      ),
      ...t
    }
  );
}
function lo({
  className: e,
  children: t,
  padding: r = !0,
  description: a,
  ...o
}) {
  const s = x.useId(), l = a != null && a !== !1, i = l ? s : o["aria-describedby"];
  return /* @__PURE__ */ f(oo, { children: [
    /* @__PURE__ */ n(io, {}),
    /* @__PURE__ */ f(
      $.Content,
      {
        "data-slot": "dialog-content",
        className: u(
          // 中央配置: left-[50%] + translate-x-[-50%] のみで揃える。
          // inset-x-* と組み合わせると left/right と transform が競合して
          // SP サイズで左に大きくズレるため使わない。
          // 幅は w-full + max-w-[calc(100%-3rem)] (= 左右 24px ずつのマージン) +
          // 480px キャップ で SP/PC 両対応にする。
          "fixed left-[50%] top-[50%] z-50 w-full max-w-[calc(100%-3rem)] sm:max-w-[480px] translate-x-[-50%] translate-y-[-50%]",
          "rounded-lg bg-[var(--Surface-Primary)] shadow-[var(--shadow-dialog)]",
          r && "p-6",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          e
        ),
        ...o,
        "aria-describedby": i,
        children: [
          l && /* @__PURE__ */ n($.Description, { id: s, className: "sr-only", children: a }),
          t
        ]
      }
    )
  ] });
}
function co({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "dialog-header",
      className: u("flex flex-col gap-2", e),
      ...t
    }
  );
}
function uo({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "dialog-footer",
      className: u("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", e),
      ...t
    }
  );
}
function fo({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    $.Title,
    {
      "data-slot": "dialog-title",
      className: u("typo-heading-lg text-[var(--Text-High-Emphasis)]", e),
      ...t
    }
  );
}
function ho({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    $.Description,
    {
      "data-slot": "dialog-description",
      className: u("typo-body-md text-[var(--Text-Medium-Emphasis)]", e),
      ...t
    }
  );
}
var mo = (e) => e.type === "checkbox", Ye = (e) => e instanceof Date, At = (e) => e == null;
const ea = (e) => typeof e == "object";
var Te = (e) => !At(e) && !Array.isArray(e) && ea(e) && !Ye(e), po = (e) => Te(e) && e.target ? mo(e.target) ? e.target.checked : e.target.value : e, vo = (e, t) => t.split(".").some((r, a, o) => !isNaN(Number(r)) && e.has(o.slice(0, a).join("."))), bo = (e) => {
  const t = e.constructor && e.constructor.prototype;
  return Te(t) && t.hasOwnProperty("isPrototypeOf");
}, go = typeof window < "u" && typeof window.HTMLElement < "u" && typeof document < "u";
function ta(e) {
  if (e instanceof Date)
    return new Date(e);
  const t = typeof FileList < "u" && e instanceof FileList;
  if (go && (e instanceof Blob || t))
    return e;
  const r = Array.isArray(e);
  if (!r && !(Te(e) && bo(e)))
    return e;
  const a = r ? [] : Object.create(Object.getPrototypeOf(e));
  for (const o in e)
    Object.prototype.hasOwnProperty.call(e, o) && (a[o] = ta(e[o]));
  return a;
}
var ra = (e) => /^\w*$/.test(e), Wt = (e) => e === void 0, xo = (e) => Array.isArray(e) ? e.filter(Boolean) : [], aa = (e) => xo(e.replace(/["|']|\]/g, "").split(/\.|\[/)), ee = (e, t, r) => {
  if (!t || !Te(e))
    return r;
  const o = (ra(t) ? [t] : aa(t)).reduce((s, l) => At(s) ? void 0 : s[l], e);
  return Wt(o) || o === e ? Wt(e[t]) ? r : e[t] : o;
}, Ct = (e) => typeof e == "boolean", it = (e) => typeof e == "function", pr = (e, t, r) => {
  let a = -1;
  const o = ra(t) ? [t] : aa(t), s = o.length, l = s - 1;
  for (; ++a < s; ) {
    const i = o[a];
    let c = r;
    if (a !== l) {
      const d = e[i];
      c = Te(d) || Array.isArray(d) ? d : isNaN(+o[a + 1]) ? {} : [];
    }
    if (i === "__proto__" || i === "constructor" || i === "prototype")
      return;
    e[i] = c, e = e[i];
  }
};
const vr = {
  BLUR: "blur",
  CHANGE: "change"
}, br = {
  all: "all"
}, _t = T.createContext(null);
_t.displayName = "HookFormControlContext";
const zt = () => T.useContext(_t);
var yo = (e, t, r, a = !0) => {
  const o = {};
  for (const s in e)
    Object.defineProperty(o, s, {
      get: () => {
        const l = s;
        return t._proxyFormState[l] !== br.all && (t._proxyFormState[l] = !a || br.all), r && (r[l] = !0), e[l];
      }
    });
  return o;
};
const na = typeof window < "u" ? T.useLayoutEffect : T.useEffect;
function oa(e) {
  const t = zt(), { control: r = t, disabled: a, name: o, exact: s } = e || {}, [l, i] = T.useState(() => ({
    ...r._formState,
    defaultValues: r._defaultValues
  })), c = T.useRef({
    isDirty: !1,
    isLoading: !1,
    dirtyFields: !1,
    touchedFields: !1,
    validatingFields: !1,
    isValidating: !1,
    isValid: !1,
    errors: !1
  });
  return na(() => r._subscribe({
    name: o,
    formState: c.current,
    exact: s,
    callback: (d) => {
      !a && i({
        ...r._formState,
        ...d,
        defaultValues: r._defaultValues
      });
    }
  }), [o, a, s]), T.useEffect(() => {
    c.current.isValid && r._setValid(!0);
  }, [r]), T.useMemo(() => yo(l, r, c.current, !1), [l, r]);
}
var wo = (e) => typeof e == "string", gr = (e, t, r, a, o) => wo(e) ? ee(r, e, o) : Array.isArray(e) ? e.map((s) => ee(r, s)) : r, xr = (e) => At(e) || !ea(e);
function ut(e, t, r = /* @__PURE__ */ new WeakSet()) {
  if (e === t)
    return !0;
  if (xr(e) || xr(t))
    return Object.is(e, t);
  if (Ye(e) && Ye(t))
    return Object.is(e.getTime(), t.getTime());
  const a = Object.keys(e), o = Object.keys(t);
  if (a.length !== o.length)
    return !1;
  if (r.has(e) || r.has(t))
    return !0;
  r.add(e), r.add(t);
  for (const s of a) {
    const l = e[s];
    if (!(s in t))
      return !1;
    if (s !== "ref") {
      const i = t[s];
      if (Ye(l) && Ye(i) || (Te(l) || Array.isArray(l)) && (Te(i) || Array.isArray(i)) ? !ut(l, i, r) : !Object.is(l, i))
        return !1;
    }
  }
  return !0;
}
function ko(e) {
  const t = zt(), { control: r = t, name: a, defaultValue: o, disabled: s, exact: l, compute: i } = e || {}, c = T.useRef(o), d = T.useRef(i), m = T.useRef(void 0), h = T.useRef(r), p = T.useRef(a);
  d.current = i;
  const [v, b] = T.useState(() => {
    const N = r._getWatch(a, c.current);
    return d.current ? d.current(N) : N;
  }), g = T.useCallback((N) => {
    const k = gr(a, r._names, N || r._formValues, !1, c.current);
    return d.current ? d.current(k) : k;
  }, [r._formValues, r._names, a]), w = T.useCallback((N) => {
    if (!s) {
      const k = gr(a, r._names, N || r._formValues, !1, c.current);
      if (d.current) {
        const C = d.current(k);
        ut(C, m.current) || (b(C), m.current = C);
      } else
        b(k);
    }
  }, [r._formValues, r._names, s, a]);
  na(() => ((h.current !== r || !ut(p.current, a)) && (h.current = r, p.current = a, w()), r._subscribe({
    name: a,
    formState: {
      values: !0
    },
    exact: l,
    callback: (N) => {
      w(N.values);
    }
  })), [r, l, a, w]), T.useEffect(() => r._removeUnmounted());
  const y = h.current !== r, S = p.current, M = T.useMemo(() => {
    if (s)
      return null;
    const N = !y && !ut(S, a);
    return y || N ? g() : null;
  }, [s, y, a, S, g]);
  return M !== null ? M : v;
}
function No(e) {
  const t = zt(), { name: r, disabled: a, control: o = t, shouldUnregister: s, defaultValue: l, exact: i = !0 } = e, c = vo(o._names.array, r), d = T.useMemo(() => ee(o._formValues, r, ee(o._defaultValues, r, l)), [o, r, l]), m = ko({
    control: o,
    name: r,
    defaultValue: d,
    exact: i
  }), h = oa({
    control: o,
    name: r,
    exact: i
  }), p = T.useRef(e), v = T.useRef(o.register(r, {
    ...e.rules,
    value: m,
    ...Ct(e.disabled) ? { disabled: e.disabled } : {}
  }));
  p.current = e;
  const b = T.useMemo(() => Object.defineProperties({}, {
    invalid: {
      enumerable: !0,
      get: () => !!ee(h.errors, r)
    },
    isDirty: {
      enumerable: !0,
      get: () => !!ee(h.dirtyFields, r)
    },
    isTouched: {
      enumerable: !0,
      get: () => !!ee(h.touchedFields, r)
    },
    isValidating: {
      enumerable: !0,
      get: () => !!ee(h.validatingFields, r)
    },
    error: {
      enumerable: !0,
      get: () => ee(h.errors, r)
    }
  }), [h, r]), g = T.useCallback((M) => v.current.onChange({
    target: {
      value: po(M),
      name: r
    },
    type: vr.CHANGE
  }), [r]), w = T.useCallback(() => v.current.onBlur({
    target: {
      value: ee(o._formValues, r),
      name: r
    },
    type: vr.BLUR
  }), [r, o._formValues]), y = T.useCallback((M) => {
    const N = ee(o._fields, r);
    N && N._f && M && (N._f.ref = {
      focus: () => it(M.focus) && M.focus(),
      select: () => it(M.select) && M.select(),
      setCustomValidity: (k) => it(M.setCustomValidity) && M.setCustomValidity(k),
      reportValidity: () => it(M.reportValidity) && M.reportValidity()
    });
  }, [o._fields, r]), S = T.useMemo(() => ({
    name: r,
    value: m,
    ...Ct(a) || h.disabled ? { disabled: h.disabled || a } : {},
    onChange: g,
    onBlur: w,
    ref: y
  }), [r, a, h.disabled, g, w, y, m]);
  return T.useEffect(() => {
    const M = o._options.shouldUnregister || s;
    o.register(r, {
      ...p.current.rules,
      ...Ct(p.current.disabled) ? { disabled: p.current.disabled } : {}
    });
    const N = (k, C) => {
      const E = ee(o._fields, k);
      E && E._f && (E._f.mount = C);
    };
    if (N(r, !0), M) {
      const k = ta(ee(o._options.defaultValues, r, p.current.defaultValue));
      pr(o._defaultValues, r, k), Wt(ee(o._formValues, r)) && pr(o._formValues, r, k);
    }
    return !c && o.register(r), () => {
      (c ? M && !o._state.action : M) ? o.unregister(r) : N(r, !1);
    };
  }, [r, o, c, s]), T.useEffect(() => {
    o._setDisabledField({
      disabled: a,
      name: r
    });
  }, [a, r, o]), T.useMemo(() => ({
    field: S,
    formState: h,
    fieldState: b
  }), [S, h, b]);
}
const So = (e) => e.render(No(e)), Yt = T.createContext(null);
Yt.displayName = "HookFormContext";
const Mo = () => T.useContext(Yt), Co = (e) => {
  const { children: t, watch: r, getValues: a, getFieldState: o, setError: s, clearErrors: l, setValue: i, setValues: c, trigger: d, formState: m, resetField: h, reset: p, handleSubmit: v, unregister: b, control: g, register: w, setFocus: y, subscribe: S } = e, M = T.useMemo(() => ({
    watch: r,
    getValues: a,
    getFieldState: o,
    setError: s,
    clearErrors: l,
    setValue: i,
    setValues: c,
    trigger: d,
    formState: m,
    resetField: h,
    reset: p,
    handleSubmit: v,
    unregister: b,
    control: g,
    register: w,
    setFocus: y,
    subscribe: S
  }), [
    l,
    g,
    m,
    o,
    a,
    v,
    w,
    p,
    h,
    s,
    y,
    i,
    c,
    S,
    d,
    b,
    r
  ]);
  return T.createElement(
    Yt.Provider,
    { value: M },
    T.createElement(_t.Provider, { value: M.control }, t)
  );
}, wu = Co, sa = x.createContext(
  {}
);
function ku({ ...e }) {
  return /* @__PURE__ */ n(sa.Provider, { value: { name: e.name }, children: /* @__PURE__ */ n(So, { ...e }) });
}
const bt = () => {
  const e = x.useContext(sa), t = x.useContext(ia), { getFieldState: r } = Mo(), a = oa({ name: e.name }), o = r(e.name, a);
  if (!e)
    throw new Error("useFormField should be used within <FormField>");
  const { id: s } = t;
  return {
    id: s,
    name: e.name,
    formItemId: `${s}-form-item`,
    formDescriptionId: `${s}-form-item-description`,
    formMessageId: `${s}-form-item-message`,
    ...o
  };
}, ia = x.createContext(
  {}
);
function Nu({ className: e, ...t }) {
  const r = x.useId();
  return /* @__PURE__ */ n(ia.Provider, { value: { id: r }, children: /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "form-item",
      className: u("grid gap-2", e),
      ...t
    }
  ) });
}
function Su({
  className: e,
  required: t,
  children: r,
  ...a
}) {
  const { error: o, formItemId: s } = bt();
  return /* @__PURE__ */ f(
    Jr,
    {
      "data-slot": "form-label",
      "data-error": !!o,
      className: u(
        "data-[error=true]:text-[var(--Text-Caution)]",
        e
      ),
      htmlFor: s,
      ...a,
      children: [
        r,
        t && /* @__PURE__ */ n("span", { "aria-hidden": !0, className: "ml-0.5 text-[var(--Text-Caution)]", children: "*" })
      ]
    }
  );
}
function Mu({ ...e }) {
  const { error: t, formItemId: r, formDescriptionId: a, formMessageId: o } = bt();
  return /* @__PURE__ */ n(
    Rn,
    {
      "data-slot": "form-control",
      id: r,
      "aria-describedby": t ? `${a} ${o}` : `${a}`,
      "aria-invalid": !!t,
      ...e
    }
  );
}
function Cu({ className: e, ...t }) {
  const { formDescriptionId: r } = bt();
  return /* @__PURE__ */ n(
    "p",
    {
      "data-slot": "form-description",
      id: r,
      className: u("typo-body-sm text-[var(--Text-Low-Emphasis)]", e),
      ...t
    }
  );
}
function Tu({ className: e, ...t }) {
  const { error: r, formMessageId: a } = bt(), o = r ? String(r?.message ?? "") : t.children;
  return o ? /* @__PURE__ */ n(
    "p",
    {
      "data-slot": "form-message",
      id: a,
      className: u("typo-body-sm text-[var(--Text-Caution)]", e),
      ...t,
      children: o
    }
  ) : null;
}
function To({ className: e }) {
  return /* @__PURE__ */ n(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2.5,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      className: u("size-4", e),
      children: /* @__PURE__ */ n("path", { d: "M20 6L9 17l-5-5" })
    }
  );
}
function Eo({ className: e }) {
  return /* @__PURE__ */ n(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2.2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      className: u("size-4", e),
      children: /* @__PURE__ */ n("path", { d: "M9 18l6-6-6-6" })
    }
  );
}
function Do({ className: e }) {
  return /* @__PURE__ */ n(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "currentColor",
      "aria-hidden": "true",
      className: u("size-2", e),
      children: /* @__PURE__ */ n("circle", { cx: "12", cy: "12", r: "6" })
    }
  );
}
function Eu({
  ...e
}) {
  return /* @__PURE__ */ n(U.Root, { "data-slot": "dropdown-menu", ...e });
}
function Du({
  ...e
}) {
  return /* @__PURE__ */ n(U.Portal, { "data-slot": "dropdown-menu-portal", ...e });
}
function Pu({
  ...e
}) {
  return /* @__PURE__ */ n(
    U.Trigger,
    {
      "data-slot": "dropdown-menu-trigger",
      ...e
    }
  );
}
function Bu({
  className: e,
  sideOffset: t = 4,
  ...r
}) {
  return /* @__PURE__ */ n(U.Portal, { children: /* @__PURE__ */ n(
    U.Content,
    {
      "data-slot": "dropdown-menu-content",
      sideOffset: t,
      className: u(
        "z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-1 typo-body-md text-[var(--Text-High-Emphasis)] shadow-md",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        e
      ),
      ...r
    }
  ) });
}
function Ou({
  ...e
}) {
  return /* @__PURE__ */ n(U.Group, { "data-slot": "dropdown-menu-group", ...e });
}
function Lu({
  className: e,
  inset: t,
  variant: r = "default",
  ...a
}) {
  return /* @__PURE__ */ n(
    U.Item,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": t,
      "data-variant": r,
      className: u(
        "relative flex cursor-default items-center gap-2 rounded-md px-3 py-2.5 typo-body-md outline-hidden select-none",
        "focus:bg-[var(--Surface-Secondary)] focus:text-[var(--Text-High-Emphasis)]",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "data-[inset]:pl-8",
        "data-[variant=destructive]:text-[var(--Text-Caution)]",
        "data-[variant=destructive]:focus:bg-[var(--Surface-Caution-Light)]",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        e
      ),
      ...a
    }
  );
}
function Wu({
  className: e,
  children: t,
  checked: r,
  ...a
}) {
  return /* @__PURE__ */ f(
    U.CheckboxItem,
    {
      "data-slot": "dropdown-menu-checkbox-item",
      className: u(
        "relative flex cursor-default items-center gap-2 rounded-md py-2.5 pr-3 pl-8 typo-body-md outline-hidden select-none",
        "focus:bg-[var(--Surface-Secondary)]",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        e
      ),
      checked: r,
      ...a,
      children: [
        /* @__PURE__ */ n("span", { className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ n(U.ItemIndicator, { children: /* @__PURE__ */ n(To, {}) }) }),
        t
      ]
    }
  );
}
function Iu({
  ...e
}) {
  return /* @__PURE__ */ n(
    U.RadioGroup,
    {
      "data-slot": "dropdown-menu-radio-group",
      ...e
    }
  );
}
function Hu({
  className: e,
  children: t,
  ...r
}) {
  return /* @__PURE__ */ f(
    U.RadioItem,
    {
      "data-slot": "dropdown-menu-radio-item",
      className: u(
        "relative flex cursor-default items-center gap-2 rounded-md py-2.5 pr-3 pl-8 typo-body-md outline-hidden select-none",
        "focus:bg-[var(--Surface-Secondary)]",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        e
      ),
      ...r,
      children: [
        /* @__PURE__ */ n("span", { className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ n(U.ItemIndicator, { children: /* @__PURE__ */ n(Do, {}) }) }),
        t
      ]
    }
  );
}
function ju({
  className: e,
  inset: t,
  ...r
}) {
  return /* @__PURE__ */ n(
    U.Label,
    {
      "data-slot": "dropdown-menu-label",
      "data-inset": t,
      className: u(
        "px-3 py-1.5 typo-label-sm text-[var(--Text-Low-Emphasis)] data-[inset]:pl-8",
        e
      ),
      ...r
    }
  );
}
function Fu({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ n(
    U.Separator,
    {
      "data-slot": "dropdown-menu-separator",
      className: u("-mx-1 my-1 h-px bg-[var(--Border-Low-Emphasis)]", e),
      ...t
    }
  );
}
function Au({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    "span",
    {
      "data-slot": "dropdown-menu-shortcut",
      className: u("ml-auto typo-body-xs text-[var(--Text-Low-Emphasis)]", e),
      ...t
    }
  );
}
function _u({
  ...e
}) {
  return /* @__PURE__ */ n(U.Sub, { "data-slot": "dropdown-menu-sub", ...e });
}
function zu({
  className: e,
  inset: t,
  children: r,
  ...a
}) {
  return /* @__PURE__ */ f(
    U.SubTrigger,
    {
      "data-slot": "dropdown-menu-sub-trigger",
      "data-inset": t,
      className: u(
        "flex cursor-default items-center gap-2 rounded-md px-3 py-2.5 typo-body-md outline-hidden select-none",
        "focus:bg-[var(--Surface-Secondary)] data-[state=open]:bg-[var(--Surface-Secondary)]",
        "data-[inset]:pl-8",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        e
      ),
      ...a,
      children: [
        r,
        /* @__PURE__ */ n(Eo, { className: "ml-auto" })
      ]
    }
  );
}
function Yu({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ n(
    U.SubContent,
    {
      "data-slot": "dropdown-menu-sub-content",
      className: u(
        "z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-1 text-[var(--Text-High-Emphasis)] shadow-lg",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        e
      ),
      ...t
    }
  );
}
function $u({
  openDelay: e = 200,
  closeDelay: t = 100,
  ...r
}) {
  return /* @__PURE__ */ n(
    ht.Root,
    {
      "data-slot": "hover-card",
      openDelay: e,
      closeDelay: t,
      ...r
    }
  );
}
function Ru({
  ...e
}) {
  return /* @__PURE__ */ n(ht.Trigger, { "data-slot": "hover-card-trigger", ...e });
}
function Vu({
  className: e,
  align: t = "center",
  sideOffset: r = 4,
  ...a
}) {
  return /* @__PURE__ */ n(ht.Portal, { "data-slot": "hover-card-portal", children: /* @__PURE__ */ n(
    ht.Content,
    {
      "data-slot": "hover-card-content",
      align: t,
      sideOffset: r,
      className: u(
        "z-50 w-64 origin-(--radix-hover-card-content-transform-origin) rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-4 text-[var(--Text-High-Emphasis)] shadow-md outline-hidden",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        e
      ),
      ...a
    }
  ) });
}
const yr = [
  "flex h-12 w-full rounded-lg border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] px-3 typo-body-md text-[var(--Text-High-Emphasis)] transition-colors",
  "file:border-0 file:bg-transparent file:typo-body-md",
  "placeholder:text-[var(--Text-Low-Emphasis)]",
  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50 focus-visible:border-[var(--Border-Accent-Primary)]",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "aria-invalid:border-[var(--Border-Caution)] aria-invalid:ring-[var(--Caution-Base)]/20"
].join(" ");
function qu({ className: e, type: t, startAdornment: r, endAdornment: a, ...o }) {
  return !r && !a ? /* @__PURE__ */ n(
    "input",
    {
      type: t,
      "data-slot": "input",
      className: u(yr, e),
      ...o
    }
  ) : /* @__PURE__ */ f("div", { "data-slot": "input-group", className: "relative flex w-full items-center", children: [
    r && /* @__PURE__ */ n("div", { className: "pointer-events-none absolute left-3 inset-y-0 flex items-center text-[var(--Text-Low-Emphasis)] typo-body-md select-none", children: r }),
    /* @__PURE__ */ n(
      "input",
      {
        type: t,
        "data-slot": "input",
        className: u(
          yr,
          r && "pl-9",
          a && "pr-9",
          e
        ),
        ...o
      }
    ),
    a && /* @__PURE__ */ n("div", { className: "absolute right-3 inset-y-0 flex items-center text-[var(--Text-Low-Emphasis)] typo-body-md", children: a })
  ] });
}
function Po(e, t, r = "long") {
  return new Intl.DateTimeFormat("en-US", {
    // Enforces engine to render the time. Without the option JavaScriptCore omits it.
    hour: "numeric",
    timeZone: e,
    timeZoneName: r
  }).format(t).split(/\s/g).slice(2).join(" ");
}
const Bo = {}, $e = {};
function Ce(e, t) {
  try {
    const a = (Bo[e] ||= new Intl.DateTimeFormat("en-US", {
      timeZone: e,
      timeZoneName: "longOffset"
    }).format)(t).split("GMT")[1];
    return a in $e ? $e[a] : wr(a, a.split(":"));
  } catch {
    if (e in $e) return $e[e];
    const r = e?.match(Oo);
    return r ? wr(e, r.slice(1)) : NaN;
  }
}
const Oo = /([+-]\d\d):?(\d\d)?/;
function wr(e, t) {
  const r = +(t[0] || 0), a = +(t[1] || 0), o = +(t[2] || 0) / 60;
  return $e[e] = r * 60 + a > 0 ? r * 60 + a + o : r * 60 - a - o;
}
class me extends Date {
  //#region static
  constructor(...t) {
    super(), t.length > 1 && typeof t[t.length - 1] == "string" && (this.timeZone = t.pop()), this.internal = /* @__PURE__ */ new Date(), isNaN(Ce(this.timeZone, this)) ? this.setTime(NaN) : t.length ? typeof t[0] == "number" && (t.length === 1 || t.length === 2 && typeof t[1] != "number") ? this.setTime(t[0]) : typeof t[0] == "string" ? this.setTime(+new Date(t[0])) : t[0] instanceof Date ? this.setTime(+t[0]) : (this.setTime(+new Date(...t)), la(this), It(this)) : this.setTime(Date.now());
  }
  static tz(t, ...r) {
    return r.length ? new me(...r, t) : new me(Date.now(), t);
  }
  //#endregion
  //#region time zone
  withTimeZone(t) {
    return new me(+this, t);
  }
  getTimezoneOffset() {
    const t = -Ce(this.timeZone, this);
    return t > 0 ? Math.floor(t) : Math.ceil(t);
  }
  //#endregion
  //#region time
  setTime(t) {
    return Date.prototype.setTime.apply(this, arguments), It(this), +this;
  }
  //#endregion
  //#region date-fns integration
  [/* @__PURE__ */ Symbol.for("constructDateFrom")](t) {
    return new me(+new Date(t), this.timeZone);
  }
  //#endregion
}
const kr = /^(get|set)(?!UTC)/;
Object.getOwnPropertyNames(Date.prototype).forEach((e) => {
  if (!kr.test(e)) return;
  const t = e.replace(kr, "$1UTC");
  me.prototype[t] && (e.startsWith("get") ? me.prototype[e] = function() {
    return this.internal[t]();
  } : (me.prototype[e] = function() {
    return Date.prototype[t].apply(this.internal, arguments), Lo(this), +this;
  }, me.prototype[t] = function() {
    return Date.prototype[t].apply(this, arguments), It(this), +this;
  }));
});
function It(e) {
  e.internal.setTime(+e), e.internal.setUTCSeconds(e.internal.getUTCSeconds() - Math.round(-Ce(e.timeZone, e) * 60));
}
function Lo(e) {
  Date.prototype.setFullYear.call(e, e.internal.getUTCFullYear(), e.internal.getUTCMonth(), e.internal.getUTCDate()), Date.prototype.setHours.call(e, e.internal.getUTCHours(), e.internal.getUTCMinutes(), e.internal.getUTCSeconds(), e.internal.getUTCMilliseconds()), la(e);
}
function la(e) {
  const t = Ce(e.timeZone, e), r = t > 0 ? Math.floor(t) : Math.ceil(t), a = /* @__PURE__ */ new Date(+e);
  a.setUTCHours(a.getUTCHours() - 1);
  const o = -(/* @__PURE__ */ new Date(+e)).getTimezoneOffset(), s = -(/* @__PURE__ */ new Date(+a)).getTimezoneOffset(), l = o - s, i = Date.prototype.getHours.apply(e) !== e.internal.getUTCHours();
  l && i && e.internal.setUTCMinutes(e.internal.getUTCMinutes() + l);
  const c = o - r;
  c && Date.prototype.setUTCMinutes.call(e, Date.prototype.getUTCMinutes.call(e) + c);
  const d = /* @__PURE__ */ new Date(+e);
  d.setUTCSeconds(0);
  const m = o > 0 ? d.getSeconds() : (d.getSeconds() - 60) % 60, h = Math.round(-(Ce(e.timeZone, e) * 60)) % 60;
  (h || m) && (e.internal.setUTCSeconds(e.internal.getUTCSeconds() + h), Date.prototype.setUTCSeconds.call(e, Date.prototype.getUTCSeconds.call(e) + h + m));
  const p = Ce(e.timeZone, e), v = p > 0 ? Math.floor(p) : Math.ceil(p), g = -(/* @__PURE__ */ new Date(+e)).getTimezoneOffset() - v, w = v !== r, y = g - c;
  if (w && y) {
    Date.prototype.setUTCMinutes.call(e, Date.prototype.getUTCMinutes.call(e) + y);
    const S = Ce(e.timeZone, e), M = S > 0 ? Math.floor(S) : Math.ceil(S), N = v - M;
    N && (e.internal.setUTCMinutes(e.internal.getUTCMinutes() + N), Date.prototype.setUTCMinutes.call(e, Date.prototype.getUTCMinutes.call(e) + N));
  }
}
class Q extends me {
  //#region static
  static tz(t, ...r) {
    return r.length ? new Q(...r, t) : new Q(Date.now(), t);
  }
  //#endregion
  //#region representation
  toISOString() {
    const [t, r, a] = this.tzComponents(), o = `${t}${r}:${a}`;
    return this.internal.toISOString().slice(0, -1) + o;
  }
  toString() {
    return `${this.toDateString()} ${this.toTimeString()}`;
  }
  toDateString() {
    const [t, r, a, o] = this.internal.toUTCString().split(" ");
    return `${t?.slice(0, -1)} ${a} ${r} ${o}`;
  }
  toTimeString() {
    const t = this.internal.toUTCString().split(" ")[4], [r, a, o] = this.tzComponents();
    return `${t} GMT${r}${a}${o} (${Po(this.timeZone, this)})`;
  }
  toLocaleString(t, r) {
    return Date.prototype.toLocaleString.call(this, t, {
      ...r,
      timeZone: r?.timeZone || this.timeZone
    });
  }
  toLocaleDateString(t, r) {
    return Date.prototype.toLocaleDateString.call(this, t, {
      ...r,
      timeZone: r?.timeZone || this.timeZone
    });
  }
  toLocaleTimeString(t, r) {
    return Date.prototype.toLocaleTimeString.call(this, t, {
      ...r,
      timeZone: r?.timeZone || this.timeZone
    });
  }
  //#endregion
  //#region private
  tzComponents() {
    const t = this.getTimezoneOffset(), r = t > 0 ? "-" : "+", a = String(Math.floor(Math.abs(t) / 60)).padStart(2, "0"), o = String(Math.abs(t) % 60).padStart(2, "0");
    return [r, a, o];
  }
  //#endregion
  withTimeZone(t) {
    return new Q(+this, t);
  }
  //#region date-fns integration
  [/* @__PURE__ */ Symbol.for("constructDateFrom")](t) {
    return new Q(+new Date(t), this.timeZone);
  }
  //#endregion
}
const ca = 6048e5, Wo = 864e5, Nr = /* @__PURE__ */ Symbol.for("constructDateFrom");
function R(e, t) {
  return typeof e == "function" ? e(t) : e && typeof e == "object" && Nr in e ? e[Nr](t) : e instanceof Date ? new e.constructor(t) : new Date(t);
}
function A(e, t) {
  return R(t || e, e);
}
function da(e, t, r) {
  const a = A(e, r?.in);
  return isNaN(t) ? R(e, NaN) : (t && a.setDate(a.getDate() + t), a);
}
function ua(e, t, r) {
  const a = A(e, r?.in);
  if (isNaN(t)) return R(e, NaN);
  if (!t)
    return a;
  const o = a.getDate(), s = R(e, a.getTime());
  s.setMonth(a.getMonth() + t + 1, 0);
  const l = s.getDate();
  return o >= l ? s : (a.setFullYear(
    s.getFullYear(),
    s.getMonth(),
    o
  ), a);
}
let Io = {};
function Ke() {
  return Io;
}
function He(e, t) {
  const r = Ke(), a = t?.weekStartsOn ?? t?.locale?.options?.weekStartsOn ?? r.weekStartsOn ?? r.locale?.options?.weekStartsOn ?? 0, o = A(e, t?.in), s = o.getDay(), l = (s < a ? 7 : 0) + s - a;
  return o.setDate(o.getDate() - l), o.setHours(0, 0, 0, 0), o;
}
function Qe(e, t) {
  return He(e, { ...t, weekStartsOn: 1 });
}
function fa(e, t) {
  const r = A(e, t?.in), a = r.getFullYear(), o = R(r, 0);
  o.setFullYear(a + 1, 0, 4), o.setHours(0, 0, 0, 0);
  const s = Qe(o), l = R(r, 0);
  l.setFullYear(a, 0, 4), l.setHours(0, 0, 0, 0);
  const i = Qe(l);
  return r.getTime() >= s.getTime() ? a + 1 : r.getTime() >= i.getTime() ? a : a - 1;
}
function Sr(e) {
  const t = A(e), r = new Date(
    Date.UTC(
      t.getFullYear(),
      t.getMonth(),
      t.getDate(),
      t.getHours(),
      t.getMinutes(),
      t.getSeconds(),
      t.getMilliseconds()
    )
  );
  return r.setUTCFullYear(t.getFullYear()), +e - +r;
}
function je(e, ...t) {
  const r = R.bind(
    null,
    t.find((a) => typeof a == "object")
  );
  return t.map(r);
}
function Ze(e, t) {
  const r = A(e, t?.in);
  return r.setHours(0, 0, 0, 0), r;
}
function $t(e, t, r) {
  const [a, o] = je(
    r?.in,
    e,
    t
  ), s = Ze(a), l = Ze(o), i = +s - Sr(s), c = +l - Sr(l);
  return Math.round((i - c) / Wo);
}
function Ho(e, t) {
  const r = fa(e, t), a = R(e, 0);
  return a.setFullYear(r, 0, 4), a.setHours(0, 0, 0, 0), Qe(a);
}
function jo(e, t, r) {
  return da(e, t * 7, r);
}
function Fo(e, t, r) {
  return ua(e, t * 12, r);
}
function Ao(e, t) {
  let r, a = t?.in;
  return e.forEach((o) => {
    !a && typeof o == "object" && (a = R.bind(null, o));
    const s = A(o, a);
    (!r || r < s || isNaN(+s)) && (r = s);
  }), R(a, r || NaN);
}
function _o(e, t) {
  let r, a = t?.in;
  return e.forEach((o) => {
    !a && typeof o == "object" && (a = R.bind(null, o));
    const s = A(o, a);
    (!r || r > s || isNaN(+s)) && (r = s);
  }), R(a, r || NaN);
}
function zo(e, t, r) {
  const [a, o] = je(
    r?.in,
    e,
    t
  );
  return +Ze(a) == +Ze(o);
}
function ha(e) {
  return e instanceof Date || typeof e == "object" && Object.prototype.toString.call(e) === "[object Date]";
}
function Yo(e) {
  return !(!ha(e) && typeof e != "number" || isNaN(+A(e)));
}
function ma(e, t, r) {
  const [a, o] = je(
    r?.in,
    e,
    t
  ), s = a.getFullYear() - o.getFullYear(), l = a.getMonth() - o.getMonth();
  return s * 12 + l;
}
function $o(e, t) {
  const r = A(e, t?.in), a = r.getMonth();
  return r.setFullYear(r.getFullYear(), a + 1, 0), r.setHours(23, 59, 59, 999), r;
}
function pa(e, t) {
  const [r, a] = je(e, t.start, t.end);
  return { start: r, end: a };
}
function Ro(e, t) {
  const { start: r, end: a } = pa(t?.in, e);
  let o = +r > +a;
  const s = o ? +r : +a, l = o ? a : r;
  l.setHours(0, 0, 0, 0), l.setDate(1);
  let i = 1;
  const c = [];
  for (; +l <= s; )
    c.push(R(r, l)), l.setMonth(l.getMonth() + i);
  return o ? c.reverse() : c;
}
function Vo(e, t) {
  const r = A(e, t?.in);
  return r.setDate(1), r.setHours(0, 0, 0, 0), r;
}
function qo(e, t) {
  const r = A(e, t?.in), a = r.getFullYear();
  return r.setFullYear(a + 1, 0, 0), r.setHours(23, 59, 59, 999), r;
}
function va(e, t) {
  const r = A(e, t?.in);
  return r.setFullYear(r.getFullYear(), 0, 1), r.setHours(0, 0, 0, 0), r;
}
function Go(e, t) {
  const { start: r, end: a } = pa(t?.in, e);
  let o = +r > +a;
  const s = o ? +r : +a, l = o ? a : r;
  l.setHours(0, 0, 0, 0), l.setMonth(0, 1);
  let i = 1;
  const c = [];
  for (; +l <= s; )
    c.push(R(r, l)), l.setFullYear(l.getFullYear() + i);
  return o ? c.reverse() : c;
}
function ba(e, t) {
  const r = Ke(), a = t?.weekStartsOn ?? t?.locale?.options?.weekStartsOn ?? r.weekStartsOn ?? r.locale?.options?.weekStartsOn ?? 0, o = A(e, t?.in), s = o.getDay(), l = (s < a ? -7 : 0) + 6 - (s - a);
  return o.setDate(o.getDate() + l), o.setHours(23, 59, 59, 999), o;
}
function Uo(e, t) {
  return ba(e, { ...t, weekStartsOn: 1 });
}
const Xo = {
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
}, Qo = (e, t, r) => {
  let a;
  const o = Xo[e];
  return typeof o == "string" ? a = o : t === 1 ? a = o.one : a = o.other.replace("{{count}}", t.toString()), r?.addSuffix ? r.comparison && r.comparison > 0 ? "in " + a : a + " ago" : a;
};
function We(e) {
  return (t = {}) => {
    const r = t.width ? String(t.width) : e.defaultWidth;
    return e.formats[r] || e.formats[e.defaultWidth];
  };
}
const Zo = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
}, Ko = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
}, Jo = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
}, es = {
  date: We({
    formats: Zo,
    defaultWidth: "full"
  }),
  time: We({
    formats: Ko,
    defaultWidth: "full"
  }),
  dateTime: We({
    formats: Jo,
    defaultWidth: "full"
  })
}, ts = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
}, rs = (e, t, r, a) => ts[e];
function fe(e) {
  return (t, r) => {
    const a = r?.context ? String(r.context) : "standalone";
    let o;
    if (a === "formatting" && e.formattingValues) {
      const l = e.defaultFormattingWidth || e.defaultWidth, i = r?.width ? String(r.width) : l;
      o = e.formattingValues[i] || e.formattingValues[l];
    } else {
      const l = e.defaultWidth, i = r?.width ? String(r.width) : e.defaultWidth;
      o = e.values[i] || e.values[l];
    }
    const s = e.argumentCallback ? e.argumentCallback(t) : t;
    return o[s];
  };
}
const as = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
}, ns = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
}, os = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
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
}, ss = {
  narrow: ["S", "M", "T", "W", "T", "F", "S"],
  short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  wide: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]
}, is = {
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
}, ls = {
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
}, cs = (e, t) => {
  const r = Number(e), a = r % 100;
  if (a > 20 || a < 10)
    switch (a % 10) {
      case 1:
        return r + "st";
      case 2:
        return r + "nd";
      case 3:
        return r + "rd";
    }
  return r + "th";
}, ds = {
  ordinalNumber: cs,
  era: fe({
    values: as,
    defaultWidth: "wide"
  }),
  quarter: fe({
    values: ns,
    defaultWidth: "wide",
    argumentCallback: (e) => e - 1
  }),
  month: fe({
    values: os,
    defaultWidth: "wide"
  }),
  day: fe({
    values: ss,
    defaultWidth: "wide"
  }),
  dayPeriod: fe({
    values: is,
    defaultWidth: "wide",
    formattingValues: ls,
    defaultFormattingWidth: "wide"
  })
};
function he(e) {
  return (t, r = {}) => {
    const a = r.width, o = a && e.matchPatterns[a] || e.matchPatterns[e.defaultMatchWidth], s = t.match(o);
    if (!s)
      return null;
    const l = s[0], i = a && e.parsePatterns[a] || e.parsePatterns[e.defaultParseWidth], c = Array.isArray(i) ? fs(i, (h) => h.test(l)) : (
      // [TODO] -- I challenge you to fix the type
      us(i, (h) => h.test(l))
    );
    let d;
    d = e.valueCallback ? e.valueCallback(c) : c, d = r.valueCallback ? (
      // [TODO] -- I challenge you to fix the type
      r.valueCallback(d)
    ) : d;
    const m = t.slice(l.length);
    return { value: d, rest: m };
  };
}
function us(e, t) {
  for (const r in e)
    if (Object.prototype.hasOwnProperty.call(e, r) && t(e[r]))
      return r;
}
function fs(e, t) {
  for (let r = 0; r < e.length; r++)
    if (t(e[r]))
      return r;
}
function ga(e) {
  return (t, r = {}) => {
    const a = t.match(e.matchPattern);
    if (!a) return null;
    const o = a[0], s = t.match(e.parsePattern);
    if (!s) return null;
    let l = e.valueCallback ? e.valueCallback(s[0]) : s[0];
    l = r.valueCallback ? r.valueCallback(l) : l;
    const i = t.slice(o.length);
    return { value: l, rest: i };
  };
}
const hs = /^(\d+)(th|st|nd|rd)?/i, ms = /\d+/i, ps = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
}, vs = {
  any: [/^b/i, /^(a|c)/i]
}, bs = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
}, gs = {
  any: [/1/i, /2/i, /3/i, /4/i]
}, xs = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
}, ys = {
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
}, ws = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
}, ks = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
}, Ns = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
}, Ss = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i
  }
}, Ms = {
  ordinalNumber: ga({
    matchPattern: hs,
    parsePattern: ms,
    valueCallback: (e) => parseInt(e, 10)
  }),
  era: he({
    matchPatterns: ps,
    defaultMatchWidth: "wide",
    parsePatterns: vs,
    defaultParseWidth: "any"
  }),
  quarter: he({
    matchPatterns: bs,
    defaultMatchWidth: "wide",
    parsePatterns: gs,
    defaultParseWidth: "any",
    valueCallback: (e) => e + 1
  }),
  month: he({
    matchPatterns: xs,
    defaultMatchWidth: "wide",
    parsePatterns: ys,
    defaultParseWidth: "any"
  }),
  day: he({
    matchPatterns: ws,
    defaultMatchWidth: "wide",
    parsePatterns: ks,
    defaultParseWidth: "any"
  }),
  dayPeriod: he({
    matchPatterns: Ns,
    defaultMatchWidth: "any",
    parsePatterns: Ss,
    defaultParseWidth: "any"
  })
}, Le = {
  code: "en-US",
  formatDistance: Qo,
  formatLong: es,
  formatRelative: rs,
  localize: ds,
  match: Ms,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
function Cs(e, t) {
  const r = A(e, t?.in);
  return $t(r, va(r)) + 1;
}
function Rt(e, t) {
  const r = A(e, t?.in), a = +Qe(r) - +Ho(r);
  return Math.round(a / ca) + 1;
}
function xa(e, t) {
  const r = A(e, t?.in), a = r.getFullYear(), o = Ke(), s = t?.firstWeekContainsDate ?? t?.locale?.options?.firstWeekContainsDate ?? o.firstWeekContainsDate ?? o.locale?.options?.firstWeekContainsDate ?? 1, l = R(t?.in || e, 0);
  l.setFullYear(a + 1, 0, s), l.setHours(0, 0, 0, 0);
  const i = He(l, t), c = R(t?.in || e, 0);
  c.setFullYear(a, 0, s), c.setHours(0, 0, 0, 0);
  const d = He(c, t);
  return +r >= +i ? a + 1 : +r >= +d ? a : a - 1;
}
function Ts(e, t) {
  const r = Ke(), a = t?.firstWeekContainsDate ?? t?.locale?.options?.firstWeekContainsDate ?? r.firstWeekContainsDate ?? r.locale?.options?.firstWeekContainsDate ?? 1, o = xa(e, t), s = R(t?.in || e, 0);
  return s.setFullYear(o, 0, a), s.setHours(0, 0, 0, 0), He(s, t);
}
function Vt(e, t) {
  const r = A(e, t?.in), a = +He(r, t) - +Ts(r, t);
  return Math.round(a / ca) + 1;
}
function F(e, t) {
  const r = e < 0 ? "-" : "", a = Math.abs(e).toString().padStart(t, "0");
  return r + a;
}
const ke = {
  // Year
  y(e, t) {
    const r = e.getFullYear(), a = r > 0 ? r : 1 - r;
    return F(t === "yy" ? a % 100 : a, t.length);
  },
  // Month
  M(e, t) {
    const r = e.getMonth();
    return t === "M" ? String(r + 1) : F(r + 1, 2);
  },
  // Day of the month
  d(e, t) {
    return F(e.getDate(), t.length);
  },
  // AM or PM
  a(e, t) {
    const r = e.getHours() / 12 >= 1 ? "pm" : "am";
    switch (t) {
      case "a":
      case "aa":
        return r.toUpperCase();
      case "aaa":
        return r;
      case "aaaaa":
        return r[0];
      default:
        return r === "am" ? "a.m." : "p.m.";
    }
  },
  // Hour [1-12]
  h(e, t) {
    return F(e.getHours() % 12 || 12, t.length);
  },
  // Hour [0-23]
  H(e, t) {
    return F(e.getHours(), t.length);
  },
  // Minute
  m(e, t) {
    return F(e.getMinutes(), t.length);
  },
  // Second
  s(e, t) {
    return F(e.getSeconds(), t.length);
  },
  // Fraction of second
  S(e, t) {
    const r = t.length, a = e.getMilliseconds(), o = Math.trunc(
      a * Math.pow(10, r - 3)
    );
    return F(o, t.length);
  }
}, Be = {
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
}, Mr = {
  // Era
  G: function(e, t, r) {
    const a = e.getFullYear() > 0 ? 1 : 0;
    switch (t) {
      // AD, BC
      case "G":
      case "GG":
      case "GGG":
        return r.era(a, { width: "abbreviated" });
      // A, B
      case "GGGGG":
        return r.era(a, { width: "narrow" });
      default:
        return r.era(a, { width: "wide" });
    }
  },
  // Year
  y: function(e, t, r) {
    if (t === "yo") {
      const a = e.getFullYear(), o = a > 0 ? a : 1 - a;
      return r.ordinalNumber(o, { unit: "year" });
    }
    return ke.y(e, t);
  },
  // Local week-numbering year
  Y: function(e, t, r, a) {
    const o = xa(e, a), s = o > 0 ? o : 1 - o;
    if (t === "YY") {
      const l = s % 100;
      return F(l, 2);
    }
    return t === "Yo" ? r.ordinalNumber(s, { unit: "year" }) : F(s, t.length);
  },
  // ISO week-numbering year
  R: function(e, t) {
    const r = fa(e);
    return F(r, t.length);
  },
  // Extended year. This is a single number designating the year of this calendar system.
  // The main difference between `y` and `u` localizers are B.C. years:
  // | Year | `y` | `u` |
  // |------|-----|-----|
  // | AC 1 |   1 |   1 |
  // | BC 1 |   1 |   0 |
  // | BC 2 |   2 |  -1 |
  // Also `yy` always returns the last two digits of a year,
  // while `uu` pads single digit years to 2 characters and returns other years unchanged.
  u: function(e, t) {
    const r = e.getFullYear();
    return F(r, t.length);
  },
  // Quarter
  Q: function(e, t, r) {
    const a = Math.ceil((e.getMonth() + 1) / 3);
    switch (t) {
      // 1, 2, 3, 4
      case "Q":
        return String(a);
      // 01, 02, 03, 04
      case "QQ":
        return F(a, 2);
      // 1st, 2nd, 3rd, 4th
      case "Qo":
        return r.ordinalNumber(a, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "QQQ":
        return r.quarter(a, {
          width: "abbreviated",
          context: "formatting"
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "QQQQQ":
        return r.quarter(a, {
          width: "narrow",
          context: "formatting"
        });
      default:
        return r.quarter(a, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone quarter
  q: function(e, t, r) {
    const a = Math.ceil((e.getMonth() + 1) / 3);
    switch (t) {
      // 1, 2, 3, 4
      case "q":
        return String(a);
      // 01, 02, 03, 04
      case "qq":
        return F(a, 2);
      // 1st, 2nd, 3rd, 4th
      case "qo":
        return r.ordinalNumber(a, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "qqq":
        return r.quarter(a, {
          width: "abbreviated",
          context: "standalone"
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "qqqqq":
        return r.quarter(a, {
          width: "narrow",
          context: "standalone"
        });
      default:
        return r.quarter(a, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // Month
  M: function(e, t, r) {
    const a = e.getMonth();
    switch (t) {
      case "M":
      case "MM":
        return ke.M(e, t);
      // 1st, 2nd, ..., 12th
      case "Mo":
        return r.ordinalNumber(a + 1, { unit: "month" });
      // Jan, Feb, ..., Dec
      case "MMM":
        return r.month(a, {
          width: "abbreviated",
          context: "formatting"
        });
      // J, F, ..., D
      case "MMMMM":
        return r.month(a, {
          width: "narrow",
          context: "formatting"
        });
      default:
        return r.month(a, { width: "wide", context: "formatting" });
    }
  },
  // Stand-alone month
  L: function(e, t, r) {
    const a = e.getMonth();
    switch (t) {
      // 1, 2, ..., 12
      case "L":
        return String(a + 1);
      // 01, 02, ..., 12
      case "LL":
        return F(a + 1, 2);
      // 1st, 2nd, ..., 12th
      case "Lo":
        return r.ordinalNumber(a + 1, { unit: "month" });
      // Jan, Feb, ..., Dec
      case "LLL":
        return r.month(a, {
          width: "abbreviated",
          context: "standalone"
        });
      // J, F, ..., D
      case "LLLLL":
        return r.month(a, {
          width: "narrow",
          context: "standalone"
        });
      default:
        return r.month(a, { width: "wide", context: "standalone" });
    }
  },
  // Local week of year
  w: function(e, t, r, a) {
    const o = Vt(e, a);
    return t === "wo" ? r.ordinalNumber(o, { unit: "week" }) : F(o, t.length);
  },
  // ISO week of year
  I: function(e, t, r) {
    const a = Rt(e);
    return t === "Io" ? r.ordinalNumber(a, { unit: "week" }) : F(a, t.length);
  },
  // Day of the month
  d: function(e, t, r) {
    return t === "do" ? r.ordinalNumber(e.getDate(), { unit: "date" }) : ke.d(e, t);
  },
  // Day of year
  D: function(e, t, r) {
    const a = Cs(e);
    return t === "Do" ? r.ordinalNumber(a, { unit: "dayOfYear" }) : F(a, t.length);
  },
  // Day of week
  E: function(e, t, r) {
    const a = e.getDay();
    switch (t) {
      // Tue
      case "E":
      case "EE":
      case "EEE":
        return r.day(a, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "EEEEE":
        return r.day(a, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "EEEEEE":
        return r.day(a, {
          width: "short",
          context: "formatting"
        });
      default:
        return r.day(a, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Local day of week
  e: function(e, t, r, a) {
    const o = e.getDay(), s = (o - a.weekStartsOn + 8) % 7 || 7;
    switch (t) {
      // Numerical value (Nth day of week with current locale or weekStartsOn)
      case "e":
        return String(s);
      // Padded numerical value
      case "ee":
        return F(s, 2);
      // 1st, 2nd, ..., 7th
      case "eo":
        return r.ordinalNumber(s, { unit: "day" });
      case "eee":
        return r.day(o, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "eeeee":
        return r.day(o, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "eeeeee":
        return r.day(o, {
          width: "short",
          context: "formatting"
        });
      default:
        return r.day(o, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone local day of week
  c: function(e, t, r, a) {
    const o = e.getDay(), s = (o - a.weekStartsOn + 8) % 7 || 7;
    switch (t) {
      // Numerical value (same as in `e`)
      case "c":
        return String(s);
      // Padded numerical value
      case "cc":
        return F(s, t.length);
      // 1st, 2nd, ..., 7th
      case "co":
        return r.ordinalNumber(s, { unit: "day" });
      case "ccc":
        return r.day(o, {
          width: "abbreviated",
          context: "standalone"
        });
      // T
      case "ccccc":
        return r.day(o, {
          width: "narrow",
          context: "standalone"
        });
      // Tu
      case "cccccc":
        return r.day(o, {
          width: "short",
          context: "standalone"
        });
      default:
        return r.day(o, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // ISO day of week
  i: function(e, t, r) {
    const a = e.getDay(), o = a === 0 ? 7 : a;
    switch (t) {
      // 2
      case "i":
        return String(o);
      // 02
      case "ii":
        return F(o, t.length);
      // 2nd
      case "io":
        return r.ordinalNumber(o, { unit: "day" });
      // Tue
      case "iii":
        return r.day(a, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "iiiii":
        return r.day(a, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "iiiiii":
        return r.day(a, {
          width: "short",
          context: "formatting"
        });
      default:
        return r.day(a, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM or PM
  a: function(e, t, r) {
    const o = e.getHours() / 12 >= 1 ? "pm" : "am";
    switch (t) {
      case "a":
      case "aa":
        return r.dayPeriod(o, {
          width: "abbreviated",
          context: "formatting"
        });
      case "aaa":
        return r.dayPeriod(o, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "aaaaa":
        return r.dayPeriod(o, {
          width: "narrow",
          context: "formatting"
        });
      default:
        return r.dayPeriod(o, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM, PM, midnight, noon
  b: function(e, t, r) {
    const a = e.getHours();
    let o;
    switch (a === 12 ? o = Be.noon : a === 0 ? o = Be.midnight : o = a / 12 >= 1 ? "pm" : "am", t) {
      case "b":
      case "bb":
        return r.dayPeriod(o, {
          width: "abbreviated",
          context: "formatting"
        });
      case "bbb":
        return r.dayPeriod(o, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "bbbbb":
        return r.dayPeriod(o, {
          width: "narrow",
          context: "formatting"
        });
      default:
        return r.dayPeriod(o, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // in the morning, in the afternoon, in the evening, at night
  B: function(e, t, r) {
    const a = e.getHours();
    let o;
    switch (a >= 17 ? o = Be.evening : a >= 12 ? o = Be.afternoon : a >= 4 ? o = Be.morning : o = Be.night, t) {
      case "B":
      case "BB":
      case "BBB":
        return r.dayPeriod(o, {
          width: "abbreviated",
          context: "formatting"
        });
      case "BBBBB":
        return r.dayPeriod(o, {
          width: "narrow",
          context: "formatting"
        });
      default:
        return r.dayPeriod(o, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Hour [1-12]
  h: function(e, t, r) {
    if (t === "ho") {
      let a = e.getHours() % 12;
      return a === 0 && (a = 12), r.ordinalNumber(a, { unit: "hour" });
    }
    return ke.h(e, t);
  },
  // Hour [0-23]
  H: function(e, t, r) {
    return t === "Ho" ? r.ordinalNumber(e.getHours(), { unit: "hour" }) : ke.H(e, t);
  },
  // Hour [0-11]
  K: function(e, t, r) {
    const a = e.getHours() % 12;
    return t === "Ko" ? r.ordinalNumber(a, { unit: "hour" }) : F(a, t.length);
  },
  // Hour [1-24]
  k: function(e, t, r) {
    let a = e.getHours();
    return a === 0 && (a = 24), t === "ko" ? r.ordinalNumber(a, { unit: "hour" }) : F(a, t.length);
  },
  // Minute
  m: function(e, t, r) {
    return t === "mo" ? r.ordinalNumber(e.getMinutes(), { unit: "minute" }) : ke.m(e, t);
  },
  // Second
  s: function(e, t, r) {
    return t === "so" ? r.ordinalNumber(e.getSeconds(), { unit: "second" }) : ke.s(e, t);
  },
  // Fraction of second
  S: function(e, t) {
    return ke.S(e, t);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function(e, t, r) {
    const a = e.getTimezoneOffset();
    if (a === 0)
      return "Z";
    switch (t) {
      // Hours and optional minutes
      case "X":
        return Tr(a);
      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XX`
      case "XXXX":
      case "XX":
        return Se(a);
      // Hours and minutes with `:` delimiter
      default:
        return Se(a, ":");
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function(e, t, r) {
    const a = e.getTimezoneOffset();
    switch (t) {
      // Hours and optional minutes
      case "x":
        return Tr(a);
      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xx`
      case "xxxx":
      case "xx":
        return Se(a);
      // Hours and minutes with `:` delimiter
      default:
        return Se(a, ":");
    }
  },
  // Timezone (GMT)
  O: function(e, t, r) {
    const a = e.getTimezoneOffset();
    switch (t) {
      // Short
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + Cr(a, ":");
      default:
        return "GMT" + Se(a, ":");
    }
  },
  // Timezone (specific non-location)
  z: function(e, t, r) {
    const a = e.getTimezoneOffset();
    switch (t) {
      // Short
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + Cr(a, ":");
      default:
        return "GMT" + Se(a, ":");
    }
  },
  // Seconds timestamp
  t: function(e, t, r) {
    const a = Math.trunc(+e / 1e3);
    return F(a, t.length);
  },
  // Milliseconds timestamp
  T: function(e, t, r) {
    return F(+e, t.length);
  }
};
function Cr(e, t = "") {
  const r = e > 0 ? "-" : "+", a = Math.abs(e), o = Math.trunc(a / 60), s = a % 60;
  return s === 0 ? r + String(o) : r + String(o) + t + F(s, 2);
}
function Tr(e, t) {
  return e % 60 === 0 ? (e > 0 ? "-" : "+") + F(Math.abs(e) / 60, 2) : Se(e, t);
}
function Se(e, t = "") {
  const r = e > 0 ? "-" : "+", a = Math.abs(e), o = F(Math.trunc(a / 60), 2), s = F(a % 60, 2);
  return r + o + t + s;
}
const Er = (e, t) => {
  switch (e) {
    case "P":
      return t.date({ width: "short" });
    case "PP":
      return t.date({ width: "medium" });
    case "PPP":
      return t.date({ width: "long" });
    default:
      return t.date({ width: "full" });
  }
}, ya = (e, t) => {
  switch (e) {
    case "p":
      return t.time({ width: "short" });
    case "pp":
      return t.time({ width: "medium" });
    case "ppp":
      return t.time({ width: "long" });
    default:
      return t.time({ width: "full" });
  }
}, Es = (e, t) => {
  const r = e.match(/(P+)(p+)?/) || [], a = r[1], o = r[2];
  if (!o)
    return Er(e, t);
  let s;
  switch (a) {
    case "P":
      s = t.dateTime({ width: "short" });
      break;
    case "PP":
      s = t.dateTime({ width: "medium" });
      break;
    case "PPP":
      s = t.dateTime({ width: "long" });
      break;
    default:
      s = t.dateTime({ width: "full" });
      break;
  }
  return s.replace("{{date}}", Er(a, t)).replace("{{time}}", ya(o, t));
}, Ds = {
  p: ya,
  P: Es
}, Ps = /^D+$/, Bs = /^Y+$/, Os = ["D", "DD", "YY", "YYYY"];
function Ls(e) {
  return Ps.test(e);
}
function Ws(e) {
  return Bs.test(e);
}
function Is(e, t, r) {
  const a = Hs(e, t, r);
  if (console.warn(a), Os.includes(e)) throw new RangeError(a);
}
function Hs(e, t, r) {
  const a = e[0] === "Y" ? "years" : "days of the month";
  return `Use \`${e.toLowerCase()}\` instead of \`${e}\` (in \`${t}\`) for formatting ${a} to the input \`${r}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const js = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, Fs = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, As = /^'([^]*?)'?$/, _s = /''/g, zs = /[a-zA-Z]/;
function Re(e, t, r) {
  const a = Ke(), o = r?.locale ?? a.locale ?? Le, s = r?.firstWeekContainsDate ?? r?.locale?.options?.firstWeekContainsDate ?? a.firstWeekContainsDate ?? a.locale?.options?.firstWeekContainsDate ?? 1, l = r?.weekStartsOn ?? r?.locale?.options?.weekStartsOn ?? a.weekStartsOn ?? a.locale?.options?.weekStartsOn ?? 0, i = A(e, r?.in);
  if (!Yo(i))
    throw new RangeError("Invalid time value");
  let c = t.match(Fs).map((m) => {
    const h = m[0];
    if (h === "p" || h === "P") {
      const p = Ds[h];
      return p(m, o.formatLong);
    }
    return m;
  }).join("").match(js).map((m) => {
    if (m === "''")
      return { isToken: !1, value: "'" };
    const h = m[0];
    if (h === "'")
      return { isToken: !1, value: Ys(m) };
    if (Mr[h])
      return { isToken: !0, value: m };
    if (h.match(zs))
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + h + "`"
      );
    return { isToken: !1, value: m };
  });
  o.localize.preprocessor && (c = o.localize.preprocessor(i, c));
  const d = {
    firstWeekContainsDate: s,
    weekStartsOn: l,
    locale: o
  };
  return c.map((m) => {
    if (!m.isToken) return m.value;
    const h = m.value;
    (!r?.useAdditionalWeekYearTokens && Ws(h) || !r?.useAdditionalDayOfYearTokens && Ls(h)) && Is(h, t, String(e));
    const p = Mr[h[0]];
    return p(i, h, o.localize, d);
  }).join("");
}
function Ys(e) {
  const t = e.match(As);
  return t ? t[1].replace(_s, "'") : e;
}
function $s(e, t) {
  const r = A(e, t?.in), a = r.getFullYear(), o = r.getMonth(), s = R(r, 0);
  return s.setFullYear(a, o + 1, 0), s.setHours(0, 0, 0, 0), s.getDate();
}
function Rs(e, t) {
  return A(e, t?.in).getMonth();
}
function Vs(e, t) {
  return A(e, t?.in).getFullYear();
}
function qs(e, t) {
  return +A(e) > +A(t);
}
function Gs(e, t) {
  return +A(e) < +A(t);
}
function Us(e, t, r) {
  const [a, o] = je(
    r?.in,
    e,
    t
  );
  return a.getFullYear() === o.getFullYear() && a.getMonth() === o.getMonth();
}
function Xs(e, t, r) {
  const [a, o] = je(
    r?.in,
    e,
    t
  );
  return a.getFullYear() === o.getFullYear();
}
function Qs(e, t, r) {
  const a = A(e, r?.in), o = a.getFullYear(), s = a.getDate(), l = R(e, 0);
  l.setFullYear(o, t, 15), l.setHours(0, 0, 0, 0);
  const i = $s(l);
  return a.setMonth(t, Math.min(s, i)), a;
}
function Zs(e, t, r) {
  const a = A(e, r?.in);
  return isNaN(+a) ? R(e, NaN) : (a.setFullYear(t), a);
}
const Dr = 5, Ks = 4;
function Js(e, t) {
  const r = t.startOfMonth(e), a = r.getDay() > 0 ? r.getDay() : 7, o = t.addDays(e, -a + 1), s = t.addDays(o, Dr * 7 - 1);
  return t.getMonth(e) === t.getMonth(s) ? Dr : Ks;
}
function wa(e, t) {
  const r = t.startOfMonth(e), a = r.getDay();
  return a === 1 ? r : a === 0 ? t.addDays(r, -6) : t.addDays(r, -1 * (a - 1));
}
function ei(e, t) {
  const r = wa(e, t), a = Js(e, t);
  return t.addDays(r, a * 7 - 1);
}
const ti = {
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
}, ri = (e, t, r) => {
  r = r || {};
  let a;
  const o = ti[e];
  return typeof o == "string" ? a = o : t === 1 ? r.addSuffix && o.oneWithSuffix ? a = o.oneWithSuffix : a = o.one : r.addSuffix && o.otherWithSuffix ? a = o.otherWithSuffix.replace("{{count}}", String(t)) : a = o.other.replace("{{count}}", String(t)), r.addSuffix ? r.comparison && r.comparison > 0 ? a + "後" : a + "前" : a;
}, ai = {
  full: "y年M月d日EEEE",
  long: "y年M月d日",
  medium: "y/MM/dd",
  short: "y/MM/dd"
}, ni = {
  full: "H時mm分ss秒 zzzz",
  long: "H:mm:ss z",
  medium: "H:mm:ss",
  short: "H:mm"
}, oi = {
  full: "{{date}} {{time}}",
  long: "{{date}} {{time}}",
  medium: "{{date}} {{time}}",
  short: "{{date}} {{time}}"
}, si = {
  date: We({
    formats: ai,
    defaultWidth: "full"
  }),
  time: We({
    formats: ni,
    defaultWidth: "full"
  }),
  dateTime: We({
    formats: oi,
    defaultWidth: "full"
  })
}, ii = {
  lastWeek: "先週のeeeeのp",
  yesterday: "昨日のp",
  today: "今日のp",
  tomorrow: "明日のp",
  nextWeek: "翌週のeeeeのp",
  other: "P"
}, li = (e, t, r, a) => ii[e], ci = {
  narrow: ["BC", "AC"],
  abbreviated: ["紀元前", "西暦"],
  wide: ["紀元前", "西暦"]
}, di = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["第1四半期", "第2四半期", "第3四半期", "第4四半期"]
}, ui = {
  narrow: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
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
}, fi = {
  narrow: ["日", "月", "火", "水", "木", "金", "土"],
  short: ["日", "月", "火", "水", "木", "金", "土"],
  abbreviated: ["日", "月", "火", "水", "木", "金", "土"],
  wide: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"]
}, hi = {
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
}, mi = {
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
}, pi = (e, t) => {
  const r = Number(e);
  switch (String(t?.unit)) {
    case "year":
      return `${r}年`;
    case "quarter":
      return `第${r}四半期`;
    case "month":
      return `${r}月`;
    case "week":
      return `第${r}週`;
    case "date":
      return `${r}日`;
    case "hour":
      return `${r}時`;
    case "minute":
      return `${r}分`;
    case "second":
      return `${r}秒`;
    default:
      return `${r}`;
  }
}, vi = {
  ordinalNumber: pi,
  era: fe({
    values: ci,
    defaultWidth: "wide"
  }),
  quarter: fe({
    values: di,
    defaultWidth: "wide",
    argumentCallback: (e) => Number(e) - 1
  }),
  month: fe({
    values: ui,
    defaultWidth: "wide"
  }),
  day: fe({
    values: fi,
    defaultWidth: "wide"
  }),
  dayPeriod: fe({
    values: hi,
    defaultWidth: "wide",
    formattingValues: mi,
    defaultFormattingWidth: "wide"
  })
}, bi = /^第?\d+(年|四半期|月|週|日|時|分|秒)?/i, gi = /\d+/i, xi = {
  narrow: /^(B\.?C\.?|A\.?D\.?)/i,
  abbreviated: /^(紀元[前後]|西暦)/i,
  wide: /^(紀元[前後]|西暦)/i
}, yi = {
  narrow: [/^B/i, /^A/i],
  any: [/^(紀元前)/i, /^(西暦|紀元後)/i]
}, wi = {
  narrow: /^[1234]/i,
  abbreviated: /^Q[1234]/i,
  wide: /^第[1234一二三四１２３４]四半期/i
}, ki = {
  any: [/(1|一|１)/i, /(2|二|２)/i, /(3|三|３)/i, /(4|四|４)/i]
}, Ni = {
  narrow: /^([123456789]|1[012])/,
  abbreviated: /^([123456789]|1[012])月/i,
  wide: /^([123456789]|1[012])月/i
}, Si = {
  any: [
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
  ]
}, Mi = {
  narrow: /^[日月火水木金土]/,
  short: /^[日月火水木金土]/,
  abbreviated: /^[日月火水木金土]/,
  wide: /^[日月火水木金土]曜日/
}, Ci = {
  any: [/^日/, /^月/, /^火/, /^水/, /^木/, /^金/, /^土/]
}, Ti = {
  any: /^(AM|PM|午前|午後|正午|深夜|真夜中|夜|朝)/i
}, Ei = {
  any: {
    am: /^(A|午前)/i,
    pm: /^(P|午後)/i,
    midnight: /^深夜|真夜中/i,
    noon: /^正午/i,
    morning: /^朝/i,
    afternoon: /^午後/i,
    evening: /^夜/i,
    night: /^深夜/i
  }
}, Di = {
  ordinalNumber: ga({
    matchPattern: bi,
    parsePattern: gi,
    valueCallback: function(e) {
      return parseInt(e, 10);
    }
  }),
  era: he({
    matchPatterns: xi,
    defaultMatchWidth: "wide",
    parsePatterns: yi,
    defaultParseWidth: "any"
  }),
  quarter: he({
    matchPatterns: wi,
    defaultMatchWidth: "wide",
    parsePatterns: ki,
    defaultParseWidth: "any",
    valueCallback: (e) => e + 1
  }),
  month: he({
    matchPatterns: Ni,
    defaultMatchWidth: "wide",
    parsePatterns: Si,
    defaultParseWidth: "any"
  }),
  day: he({
    matchPatterns: Mi,
    defaultMatchWidth: "wide",
    parsePatterns: Ci,
    defaultParseWidth: "any"
  }),
  dayPeriod: he({
    matchPatterns: Ti,
    defaultMatchWidth: "any",
    parsePatterns: Ei,
    defaultParseWidth: "any"
  })
}, Pi = {
  code: "ja",
  formatDistance: ri,
  formatLong: si,
  formatRelative: li,
  localize: vi,
  match: Di,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
}, ka = {
  ...Le,
  labels: {
    labelDayButton: (e, t, r, a) => {
      let o;
      a && typeof a.format == "function" ? o = a.format.bind(a) : o = (l, i) => Re(l, i, { locale: Le, ...r });
      let s = o(e, "PPPP");
      return t.today && (s = `Today, ${s}`), t.selected && (s = `${s}, selected`), s;
    },
    labelMonthDropdown: "Choose the Month",
    labelNext: "Go to the Next Month",
    labelPrevious: "Go to the Previous Month",
    labelWeekNumber: (e) => `Week ${e}`,
    labelYearDropdown: "Choose the Year",
    labelGrid: (e, t, r) => {
      let a;
      return r && typeof r.format == "function" ? a = r.format.bind(r) : a = (o, s) => Re(o, s, { locale: Le, ...t }), a(e, "LLLL yyyy");
    },
    labelGridcell: (e, t, r, a) => {
      let o;
      a && typeof a.format == "function" ? o = a.format.bind(a) : o = (l, i) => Re(l, i, { locale: Le, ...r });
      let s = o(e, "PPPP");
      return t?.today && (s = `Today, ${s}`), s;
    },
    labelNav: "Navigation bar",
    labelWeekNumberHeader: "Week Number",
    labelWeekday: (e, t, r) => {
      let a;
      return r && typeof r.format == "function" ? a = r.format.bind(r) : a = (o, s) => Re(o, s, { locale: Le, ...t }), a(e, "cccc");
    }
  }
};
class G {
  /**
   * Creates an instance of `DateLib`.
   *
   * @param options Configuration options for the date library.
   * @param overrides Custom overrides for the date library functions.
   */
  constructor(t, r) {
    this.Date = Date, this.today = () => this.overrides?.today ? this.overrides.today() : this.options.timeZone ? Q.tz(this.options.timeZone) : new this.Date(), this.newDate = (a, o, s) => this.overrides?.newDate ? this.overrides.newDate(a, o, s) : this.options.timeZone ? new Q(a, o, s, this.options.timeZone) : new Date(a, o, s), this.addDays = (a, o) => this.overrides?.addDays ? this.overrides.addDays(a, o) : da(a, o), this.addMonths = (a, o) => this.overrides?.addMonths ? this.overrides.addMonths(a, o) : ua(a, o), this.addWeeks = (a, o) => this.overrides?.addWeeks ? this.overrides.addWeeks(a, o) : jo(a, o), this.addYears = (a, o) => this.overrides?.addYears ? this.overrides.addYears(a, o) : Fo(a, o), this.differenceInCalendarDays = (a, o) => this.overrides?.differenceInCalendarDays ? this.overrides.differenceInCalendarDays(a, o) : $t(a, o), this.differenceInCalendarMonths = (a, o) => this.overrides?.differenceInCalendarMonths ? this.overrides.differenceInCalendarMonths(a, o) : ma(a, o), this.eachMonthOfInterval = (a) => this.overrides?.eachMonthOfInterval ? this.overrides.eachMonthOfInterval(a) : Ro(a), this.eachYearOfInterval = (a) => {
      const o = this.overrides?.eachYearOfInterval ? this.overrides.eachYearOfInterval(a) : Go(a), s = new Set(o.map((i) => this.getYear(i)));
      if (s.size === o.length)
        return o;
      const l = [];
      return s.forEach((i) => {
        l.push(new Date(i, 0, 1));
      }), l;
    }, this.endOfBroadcastWeek = (a) => this.overrides?.endOfBroadcastWeek ? this.overrides.endOfBroadcastWeek(a) : ei(a, this), this.endOfISOWeek = (a) => this.overrides?.endOfISOWeek ? this.overrides.endOfISOWeek(a) : Uo(a), this.endOfMonth = (a) => this.overrides?.endOfMonth ? this.overrides.endOfMonth(a) : $o(a), this.endOfWeek = (a, o) => this.overrides?.endOfWeek ? this.overrides.endOfWeek(a, o) : ba(a, this.options), this.endOfYear = (a) => this.overrides?.endOfYear ? this.overrides.endOfYear(a) : qo(a), this.format = (a, o, s) => {
      const l = this.overrides?.format ? this.overrides.format(a, o, this.options) : Re(a, o, this.options);
      return this.options.numerals && this.options.numerals !== "latn" ? this.replaceDigits(l) : l;
    }, this.getISOWeek = (a) => this.overrides?.getISOWeek ? this.overrides.getISOWeek(a) : Rt(a), this.getMonth = (a, o) => this.overrides?.getMonth ? this.overrides.getMonth(a, this.options) : Rs(a, this.options), this.getYear = (a, o) => this.overrides?.getYear ? this.overrides.getYear(a, this.options) : Vs(a, this.options), this.getWeek = (a, o) => this.overrides?.getWeek ? this.overrides.getWeek(a, this.options) : Vt(a, this.options), this.isAfter = (a, o) => this.overrides?.isAfter ? this.overrides.isAfter(a, o) : qs(a, o), this.isBefore = (a, o) => this.overrides?.isBefore ? this.overrides.isBefore(a, o) : Gs(a, o), this.isDate = (a) => this.overrides?.isDate ? this.overrides.isDate(a) : ha(a), this.isSameDay = (a, o) => this.overrides?.isSameDay ? this.overrides.isSameDay(a, o) : zo(a, o), this.isSameMonth = (a, o) => this.overrides?.isSameMonth ? this.overrides.isSameMonth(a, o) : Us(a, o), this.isSameYear = (a, o) => this.overrides?.isSameYear ? this.overrides.isSameYear(a, o) : Xs(a, o), this.max = (a) => this.overrides?.max ? this.overrides.max(a) : Ao(a), this.min = (a) => this.overrides?.min ? this.overrides.min(a) : _o(a), this.setMonth = (a, o) => this.overrides?.setMonth ? this.overrides.setMonth(a, o) : Qs(a, o), this.setYear = (a, o) => this.overrides?.setYear ? this.overrides.setYear(a, o) : Zs(a, o), this.startOfBroadcastWeek = (a, o) => this.overrides?.startOfBroadcastWeek ? this.overrides.startOfBroadcastWeek(a, this) : wa(a, this), this.startOfDay = (a) => this.overrides?.startOfDay ? this.overrides.startOfDay(a) : Ze(a), this.startOfISOWeek = (a) => this.overrides?.startOfISOWeek ? this.overrides.startOfISOWeek(a) : Qe(a), this.startOfMonth = (a) => this.overrides?.startOfMonth ? this.overrides.startOfMonth(a) : Vo(a), this.startOfWeek = (a, o) => this.overrides?.startOfWeek ? this.overrides.startOfWeek(a, this.options) : He(a, this.options), this.startOfYear = (a) => this.overrides?.startOfYear ? this.overrides.startOfYear(a) : va(a), this.options = { locale: ka, ...t }, this.overrides = r;
  }
  /**
   * Generates a mapping of Arabic digits (0-9) to the target numbering system
   * digits.
   *
   * @since 9.5.0
   * @returns A record mapping Arabic digits to the target numerals.
   */
  getDigitMap() {
    const { numerals: t = "latn" } = this.options, r = new Intl.NumberFormat("en-US", {
      numberingSystem: t
    }), a = {};
    for (let o = 0; o < 10; o++)
      a[o.toString()] = r.format(o);
    return a;
  }
  /**
   * Replaces Arabic digits in a string with the target numbering system digits.
   *
   * @since 9.5.0
   * @param input The string containing Arabic digits.
   * @returns The string with digits replaced.
   */
  replaceDigits(t) {
    const r = this.getDigitMap();
    return t.replace(/\d/g, (a) => r[a] || a);
  }
  /**
   * Formats a number using the configured numbering system.
   *
   * @since 9.5.0
   * @param value The number to format.
   * @returns The formatted number as a string.
   */
  formatNumber(t) {
    return this.replaceDigits(t.toString());
  }
  /**
   * Returns the preferred ordering for month and year labels for the current
   * locale.
   */
  getMonthYearOrder() {
    const t = this.options.locale?.code;
    return t && G.yearFirstLocales.has(t) ? "year-first" : "month-first";
  }
  /**
   * Formats the month/year pair respecting locale conventions.
   *
   * @since 9.11.0
   */
  formatMonthYear(t) {
    const { locale: r, timeZone: a, numerals: o } = this.options, s = r?.code;
    if (s && G.yearFirstLocales.has(s))
      try {
        return new Intl.DateTimeFormat(s, {
          month: "long",
          year: "numeric",
          timeZone: a,
          numberingSystem: o
        }).format(t);
      } catch {
      }
    const l = this.getMonthYearOrder() === "year-first" ? "y LLLL" : "LLLL y";
    return this.format(t, l);
  }
}
G.yearFirstLocales = /* @__PURE__ */ new Set([
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
const ve = new G();
class Na {
  constructor(t, r, a = ve) {
    this.date = t, this.displayMonth = r, this.outside = !!(r && !a.isSameMonth(t, r)), this.dateLib = a, this.isoDate = a.format(t, "yyyy-MM-dd"), this.displayMonthId = a.format(r, "yyyy-MM"), this.dateMonthId = a.format(t, "yyyy-MM");
  }
  /**
   * Checks if this day is equal to another `CalendarDay`, considering both the
   * date and the displayed month.
   *
   * @param day The `CalendarDay` to compare with.
   * @returns `true` if the days are equal, otherwise `false`.
   */
  isEqualTo(t) {
    return this.dateLib.isSameDay(t.date, this.date) && this.dateLib.isSameMonth(t.displayMonth, this.displayMonth);
  }
}
class Bi {
  constructor(t, r) {
    this.date = t, this.weeks = r;
  }
}
class Oi {
  constructor(t, r) {
    this.days = r, this.weekNumber = t;
  }
}
function Li(e) {
  return T.createElement("button", { ...e });
}
function Wi(e) {
  return T.createElement("span", { ...e });
}
function Ii(e) {
  const { size: t = 24, orientation: r = "left", className: a } = e;
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: handled by the parent component
    T.createElement(
      "svg",
      { className: a, width: t, height: t, viewBox: "0 0 24 24" },
      r === "up" && T.createElement("polygon", { points: "6.77 17 12.5 11.43 18.24 17 20 15.28 12.5 8 5 15.28" }),
      r === "down" && T.createElement("polygon", { points: "6.77 8 12.5 13.57 18.24 8 20 9.72 12.5 17 5 9.72" }),
      r === "left" && T.createElement("polygon", { points: "16 18.112 9.81111111 12 16 5.87733333 14.0888889 4 6 12 14.0888889 20" }),
      r === "right" && T.createElement("polygon", { points: "8 18.112 14.18888889 12 8 5.87733333 9.91111111 4 18 12 9.91111111 20" })
    )
  );
}
function Hi(e) {
  const { day: t, modifiers: r, ...a } = e;
  return T.createElement("td", { ...a });
}
function ji(e) {
  const { day: t, modifiers: r, ...a } = e, o = T.useRef(null);
  return T.useEffect(() => {
    r.focused && o.current?.focus();
  }, [r.focused]), T.createElement("button", { ref: o, ...a });
}
var D;
(function(e) {
  e.Root = "root", e.Chevron = "chevron", e.Day = "day", e.DayButton = "day_button", e.CaptionLabel = "caption_label", e.Dropdowns = "dropdowns", e.Dropdown = "dropdown", e.DropdownRoot = "dropdown_root", e.Footer = "footer", e.MonthGrid = "month_grid", e.MonthCaption = "month_caption", e.MonthsDropdown = "months_dropdown", e.Month = "month", e.Months = "months", e.Nav = "nav", e.NextMonthButton = "button_next", e.PreviousMonthButton = "button_previous", e.Week = "week", e.Weeks = "weeks", e.Weekday = "weekday", e.Weekdays = "weekdays", e.WeekNumber = "week_number", e.WeekNumberHeader = "week_number_header", e.YearsDropdown = "years_dropdown";
})(D || (D = {}));
var _;
(function(e) {
  e.disabled = "disabled", e.hidden = "hidden", e.outside = "outside", e.focused = "focused", e.today = "today";
})(_ || (_ = {}));
var ce;
(function(e) {
  e.range_end = "range_end", e.range_middle = "range_middle", e.range_start = "range_start", e.selected = "selected";
})(ce || (ce = {}));
var re;
(function(e) {
  e.weeks_before_enter = "weeks_before_enter", e.weeks_before_exit = "weeks_before_exit", e.weeks_after_enter = "weeks_after_enter", e.weeks_after_exit = "weeks_after_exit", e.caption_after_enter = "caption_after_enter", e.caption_after_exit = "caption_after_exit", e.caption_before_enter = "caption_before_enter", e.caption_before_exit = "caption_before_exit";
})(re || (re = {}));
function Fi(e) {
  const { options: t, className: r, components: a, classNames: o, ...s } = e, l = [o[D.Dropdown], r].join(" "), i = t?.find(({ value: c }) => c === s.value);
  return T.createElement(
    "span",
    { "data-disabled": s.disabled, className: o[D.DropdownRoot] },
    T.createElement(a.Select, { className: l, ...s }, t?.map(({ value: c, label: d, disabled: m }) => T.createElement(a.Option, { key: c, value: c, disabled: m }, d))),
    T.createElement(
      "span",
      { className: o[D.CaptionLabel], "aria-hidden": !0 },
      i?.label,
      T.createElement(a.Chevron, { orientation: "down", size: 18, className: o[D.Chevron] })
    )
  );
}
function Ai(e) {
  return T.createElement("div", { ...e });
}
function _i(e) {
  return T.createElement("div", { ...e });
}
function zi(e) {
  const { calendarMonth: t, displayIndex: r, ...a } = e;
  return T.createElement("div", { ...a }, e.children);
}
function Yi(e) {
  const { calendarMonth: t, displayIndex: r, ...a } = e;
  return T.createElement("div", { ...a });
}
function $i(e) {
  return T.createElement("table", { ...e });
}
function Ri(e) {
  return T.createElement("div", { ...e });
}
const Sa = Hn(void 0);
function Je() {
  const e = jn(Sa);
  if (e === void 0)
    throw new Error("useDayPicker() must be used within a custom component.");
  return e;
}
function Vi(e) {
  const { components: t } = Je();
  return T.createElement(t.Dropdown, { ...e });
}
function qi(e) {
  const { onPreviousClick: t, onNextClick: r, previousMonth: a, nextMonth: o, ...s } = e, { components: l, classNames: i, labels: { labelPrevious: c, labelNext: d } } = Je(), m = ne((p) => {
    o && r?.(p);
  }, [o, r]), h = ne((p) => {
    a && t?.(p);
  }, [a, t]);
  return T.createElement(
    "nav",
    { ...s },
    T.createElement(
      l.PreviousMonthButton,
      { type: "button", className: i[D.PreviousMonthButton], tabIndex: a ? void 0 : -1, "aria-disabled": a ? void 0 : !0, "aria-label": c(a), onClick: h },
      T.createElement(l.Chevron, { disabled: a ? void 0 : !0, className: i[D.Chevron], orientation: "left" })
    ),
    T.createElement(
      l.NextMonthButton,
      { type: "button", className: i[D.NextMonthButton], tabIndex: o ? void 0 : -1, "aria-disabled": o ? void 0 : !0, "aria-label": d(o), onClick: m },
      T.createElement(l.Chevron, { disabled: o ? void 0 : !0, orientation: "right", className: i[D.Chevron] })
    )
  );
}
function Gi(e) {
  const { components: t } = Je();
  return T.createElement(t.Button, { ...e });
}
function Ui(e) {
  return T.createElement("option", { ...e });
}
function Xi(e) {
  const { components: t } = Je();
  return T.createElement(t.Button, { ...e });
}
function Qi(e) {
  const { rootRef: t, ...r } = e;
  return T.createElement("div", { ...r, ref: t });
}
function Zi(e) {
  return T.createElement("select", { ...e });
}
function Ki(e) {
  const { week: t, ...r } = e;
  return T.createElement("tr", { ...r });
}
function Ji(e) {
  return T.createElement("th", { ...e });
}
function el(e) {
  return T.createElement(
    "thead",
    { "aria-hidden": !0 },
    T.createElement("tr", { ...e })
  );
}
function tl(e) {
  const { week: t, ...r } = e;
  return T.createElement("th", { ...r });
}
function rl(e) {
  return T.createElement("th", { ...e });
}
function al(e) {
  return T.createElement("tbody", { ...e });
}
function nl(e) {
  const { components: t } = Je();
  return T.createElement(t.Dropdown, { ...e });
}
const ol = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Button: Li,
  CaptionLabel: Wi,
  Chevron: Ii,
  Day: Hi,
  DayButton: ji,
  Dropdown: Fi,
  DropdownNav: Ai,
  Footer: _i,
  Month: zi,
  MonthCaption: Yi,
  MonthGrid: $i,
  Months: Ri,
  MonthsDropdown: Vi,
  Nav: qi,
  NextMonthButton: Gi,
  Option: Ui,
  PreviousMonthButton: Xi,
  Root: Qi,
  Select: Zi,
  Week: Ki,
  WeekNumber: tl,
  WeekNumberHeader: rl,
  Weekday: Ji,
  Weekdays: el,
  Weeks: al,
  YearsDropdown: nl
}, Symbol.toStringTag, { value: "Module" }));
function be(e, t, r = !1, a = ve) {
  let { from: o, to: s } = e;
  const { differenceInCalendarDays: l, isSameDay: i } = a;
  return o && s ? (l(s, o) < 0 && ([o, s] = [s, o]), l(t, o) >= (r ? 1 : 0) && l(s, t) >= (r ? 1 : 0)) : !r && s ? i(s, t) : !r && o ? i(o, t) : !1;
}
function qt(e) {
  return !!(e && typeof e == "object" && "before" in e && "after" in e);
}
function gt(e) {
  return !!(e && typeof e == "object" && "from" in e);
}
function Gt(e) {
  return !!(e && typeof e == "object" && "after" in e);
}
function Ut(e) {
  return !!(e && typeof e == "object" && "before" in e);
}
function Ma(e) {
  return !!(e && typeof e == "object" && "dayOfWeek" in e);
}
function Ca(e, t) {
  return Array.isArray(e) && e.every(t.isDate);
}
function ge(e, t, r = ve) {
  const a = Array.isArray(t) ? t : [t], { isSameDay: o, differenceInCalendarDays: s, isAfter: l } = r;
  return a.some((i) => {
    if (typeof i == "boolean")
      return i;
    if (r.isDate(i))
      return o(e, i);
    if (Ca(i, r))
      return i.some((c) => o(e, c));
    if (gt(i))
      return be(i, e, !1, r);
    if (Ma(i))
      return Array.isArray(i.dayOfWeek) ? i.dayOfWeek.includes(e.getDay()) : i.dayOfWeek === e.getDay();
    if (qt(i)) {
      const c = s(i.before, e), d = s(i.after, e), m = c > 0, h = d < 0;
      return l(i.before, i.after) ? h && m : m || h;
    }
    return Gt(i) ? s(e, i.after) > 0 : Ut(i) ? s(i.before, e) > 0 : typeof i == "function" ? i(e) : !1;
  });
}
function sl(e, t, r, a, o) {
  const { disabled: s, hidden: l, modifiers: i, showOutsideDays: c, broadcastCalendar: d, today: m = o.today() } = t, { isSameDay: h, isSameMonth: p, startOfMonth: v, isBefore: b, endOfMonth: g, isAfter: w } = o, y = r && v(r), S = a && g(a), M = {
    [_.focused]: [],
    [_.outside]: [],
    [_.disabled]: [],
    [_.hidden]: [],
    [_.today]: []
  }, N = {};
  for (const k of e) {
    const { date: C, displayMonth: E } = k, W = !!(E && !p(C, E)), P = !!(y && b(C, y)), L = !!(S && w(C, S)), K = !!(s && ge(C, s, o)), J = !!(l && ge(C, l, o)) || P || L || // Broadcast calendar will show outside days as default
    !d && !c && W || d && c === !1 && W, ie = h(C, m);
    W && M.outside.push(k), K && M.disabled.push(k), J && M.hidden.push(k), ie && M.today.push(k), i && Object.keys(i).forEach((Z) => {
      const ye = i?.[Z];
      ye && ge(C, ye, o) && (N[Z] ? N[Z].push(k) : N[Z] = [k]);
    });
  }
  return (k) => {
    const C = {
      [_.focused]: !1,
      [_.disabled]: !1,
      [_.hidden]: !1,
      [_.outside]: !1,
      [_.today]: !1
    }, E = {};
    for (const W in M) {
      const P = M[W];
      C[W] = P.some((L) => L === k);
    }
    for (const W in N)
      E[W] = N[W].some((P) => P === k);
    return {
      ...C,
      // custom modifiers should override all the previous ones
      ...E
    };
  };
}
function il(e, t, r = {}) {
  return Object.entries(e).filter(([, o]) => o === !0).reduce((o, [s]) => (r[s] ? o.push(r[s]) : t[_[s]] ? o.push(t[_[s]]) : t[ce[s]] && o.push(t[ce[s]]), o), [t[D.Day]]);
}
function ll(e) {
  return {
    ...ol,
    ...e
  };
}
function cl(e) {
  const t = {
    "data-mode": e.mode ?? void 0,
    "data-required": "required" in e ? e.required : void 0,
    "data-multiple-months": e.numberOfMonths && e.numberOfMonths > 1 || void 0,
    "data-week-numbers": e.showWeekNumber || void 0,
    "data-broadcast-calendar": e.broadcastCalendar || void 0,
    "data-nav-layout": e.navLayout || void 0
  };
  return Object.entries(e).forEach(([r, a]) => {
    r.startsWith("data-") && (t[r] = a);
  }), t;
}
function dl() {
  const e = {};
  for (const t in D)
    e[D[t]] = `rdp-${D[t]}`;
  for (const t in _)
    e[_[t]] = `rdp-${_[t]}`;
  for (const t in ce)
    e[ce[t]] = `rdp-${ce[t]}`;
  for (const t in re)
    e[re[t]] = `rdp-${re[t]}`;
  return e;
}
function Ta(e, t, r) {
  return (r ?? new G(t)).formatMonthYear(e);
}
const ul = Ta;
function fl(e, t, r) {
  return (r ?? new G(t)).format(e, "d");
}
function hl(e, t = ve) {
  return t.format(e, "LLLL");
}
function ml(e, t, r) {
  return (r ?? new G(t)).format(e, "cccccc");
}
function pl(e, t = ve) {
  return e < 10 ? t.formatNumber(`0${e.toLocaleString()}`) : t.formatNumber(`${e.toLocaleString()}`);
}
function vl() {
  return "";
}
function Ea(e, t = ve) {
  return t.format(e, "yyyy");
}
const bl = Ea, gl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  formatCaption: Ta,
  formatDay: fl,
  formatMonthCaption: ul,
  formatMonthDropdown: hl,
  formatWeekNumber: pl,
  formatWeekNumberHeader: vl,
  formatWeekdayName: ml,
  formatYearCaption: bl,
  formatYearDropdown: Ea
}, Symbol.toStringTag, { value: "Module" }));
function xl(e) {
  return e?.formatMonthCaption && !e.formatCaption && (e.formatCaption = e.formatMonthCaption), e?.formatYearCaption && !e.formatYearDropdown && (e.formatYearDropdown = e.formatYearCaption), {
    ...gl,
    ...e
  };
}
function Xt(e, t, r, a) {
  let o = (a ?? new G(r)).format(e, "PPPP");
  return t.today && (o = `Today, ${o}`), t.selected && (o = `${o}, selected`), o;
}
const yl = Xt;
function Qt(e, t, r) {
  return (r ?? new G(t)).formatMonthYear(e);
}
const wl = Qt;
function Da(e, t, r, a) {
  let o = (a ?? new G(r)).format(e, "PPPP");
  return t?.today && (o = `Today, ${o}`), o;
}
function Pa(e) {
  return "Choose the Month";
}
function Ba() {
  return "";
}
const kl = "Go to the Next Month";
function Oa(e, t) {
  return kl;
}
function La(e) {
  return "Go to the Previous Month";
}
function Wa(e, t, r) {
  return (r ?? new G(t)).format(e, "cccc");
}
function Ia(e, t) {
  return `Week ${e}`;
}
function Ha(e) {
  return "Week Number";
}
function ja(e) {
  return "Choose the Year";
}
const Nl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  labelCaption: wl,
  labelDay: yl,
  labelDayButton: Xt,
  labelGrid: Qt,
  labelGridcell: Da,
  labelMonthDropdown: Pa,
  labelNav: Ba,
  labelNext: Oa,
  labelPrevious: La,
  labelWeekNumber: Ia,
  labelWeekNumberHeader: Ha,
  labelWeekday: Wa,
  labelYearDropdown: ja
}, Symbol.toStringTag, { value: "Module" })), le = (e, t, r) => t || (r ? typeof r == "function" ? r : (...a) => r : e);
function Sl(e, t) {
  const r = t.locale?.labels ?? {};
  return {
    ...Nl,
    ...e ?? {},
    labelDayButton: le(Xt, e?.labelDayButton, r.labelDayButton),
    labelMonthDropdown: le(Pa, e?.labelMonthDropdown, r.labelMonthDropdown),
    labelNext: le(Oa, e?.labelNext, r.labelNext),
    labelPrevious: le(La, e?.labelPrevious, r.labelPrevious),
    labelWeekNumber: le(Ia, e?.labelWeekNumber, r.labelWeekNumber),
    labelYearDropdown: le(ja, e?.labelYearDropdown, r.labelYearDropdown),
    labelGrid: le(Qt, e?.labelGrid, r.labelGrid),
    labelGridcell: le(Da, e?.labelGridcell, r.labelGridcell),
    labelNav: le(Ba, e?.labelNav, r.labelNav),
    labelWeekNumberHeader: le(Ha, e?.labelWeekNumberHeader, r.labelWeekNumberHeader),
    labelWeekday: le(Wa, e?.labelWeekday, r.labelWeekday)
  };
}
function Ml(e, t, r, a, o) {
  const { startOfMonth: s, startOfYear: l, endOfYear: i, eachMonthOfInterval: c, getMonth: d } = o;
  return c({
    start: l(e),
    end: i(e)
  }).map((p) => {
    const v = a.formatMonthDropdown(p, o), b = d(p), g = t && p < s(t) || r && p > s(r) || !1;
    return { value: b, label: v, disabled: g };
  });
}
function Cl(e, t = {}, r = {}) {
  let a = { ...t?.[D.Day] };
  return Object.entries(e).filter(([, o]) => o === !0).forEach(([o]) => {
    a = {
      ...a,
      ...r?.[o]
    };
  }), a;
}
function Tl(e, t, r, a) {
  const o = a ?? e.today(), s = r ? e.startOfBroadcastWeek(o, e) : t ? e.startOfISOWeek(o) : e.startOfWeek(o), l = [];
  for (let i = 0; i < 7; i++) {
    const c = e.addDays(s, i);
    l.push(c);
  }
  return l;
}
function El(e, t, r, a, o = !1) {
  if (!e || !t)
    return;
  const { startOfYear: s, endOfYear: l, eachYearOfInterval: i, getYear: c } = a, d = s(e), m = l(t), h = i({ start: d, end: m });
  return o && h.reverse(), h.map((p) => {
    const v = r.formatYearDropdown(p, a);
    return {
      value: c(p),
      label: v,
      disabled: !1
    };
  });
}
function Dl(e, t = {}) {
  const { weekStartsOn: r, locale: a } = t, o = r ?? a?.options?.weekStartsOn ?? 0, s = (i) => {
    const c = typeof i == "number" || typeof i == "string" ? new Date(i) : i;
    return new Q(c.getFullYear(), c.getMonth(), c.getDate(), 12, 0, 0, e);
  }, l = (i) => {
    const c = s(i);
    return new Date(c.getFullYear(), c.getMonth(), c.getDate(), 0, 0, 0, 0);
  };
  return {
    today: () => s(Q.tz(e)),
    newDate: (i, c, d) => new Q(i, c, d, 12, 0, 0, e),
    startOfDay: (i) => s(i),
    startOfWeek: (i, c) => {
      const d = s(i), m = c?.weekStartsOn ?? o, h = (d.getDay() - m + 7) % 7;
      return d.setDate(d.getDate() - h), d;
    },
    startOfISOWeek: (i) => {
      const c = s(i), d = (c.getDay() - 1 + 7) % 7;
      return c.setDate(c.getDate() - d), c;
    },
    startOfMonth: (i) => {
      const c = s(i);
      return c.setDate(1), c;
    },
    startOfYear: (i) => {
      const c = s(i);
      return c.setMonth(0, 1), c;
    },
    endOfWeek: (i, c) => {
      const d = s(i), p = (((c?.weekStartsOn ?? o) + 6) % 7 - d.getDay() + 7) % 7;
      return d.setDate(d.getDate() + p), d;
    },
    endOfISOWeek: (i) => {
      const c = s(i), d = (7 - c.getDay()) % 7;
      return c.setDate(c.getDate() + d), c;
    },
    endOfMonth: (i) => {
      const c = s(i);
      return c.setMonth(c.getMonth() + 1, 0), c;
    },
    endOfYear: (i) => {
      const c = s(i);
      return c.setMonth(11, 31), c;
    },
    eachMonthOfInterval: (i) => {
      const c = s(i.start), d = s(i.end), m = [], h = new Q(c.getFullYear(), c.getMonth(), 1, 12, 0, 0, e), p = d.getFullYear() * 12 + d.getMonth();
      for (; h.getFullYear() * 12 + h.getMonth() <= p; )
        m.push(new Q(h, e)), h.setMonth(h.getMonth() + 1, 1);
      return m;
    },
    // Normalize to noon once before arithmetic (avoid DST/midnight edge cases),
    // mutate the same TZDate, and return it.
    addDays: (i, c) => {
      const d = s(i);
      return d.setDate(d.getDate() + c), d;
    },
    addWeeks: (i, c) => {
      const d = s(i);
      return d.setDate(d.getDate() + c * 7), d;
    },
    addMonths: (i, c) => {
      const d = s(i);
      return d.setMonth(d.getMonth() + c), d;
    },
    addYears: (i, c) => {
      const d = s(i);
      return d.setFullYear(d.getFullYear() + c), d;
    },
    eachYearOfInterval: (i) => {
      const c = s(i.start), d = s(i.end), m = [], h = new Q(c.getFullYear(), 0, 1, 12, 0, 0, e);
      for (; h.getFullYear() <= d.getFullYear(); )
        m.push(new Q(h, e)), h.setFullYear(h.getFullYear() + 1, 0, 1);
      return m;
    },
    getWeek: (i, c) => {
      const d = l(i);
      return Vt(d, {
        weekStartsOn: c?.weekStartsOn ?? o,
        firstWeekContainsDate: c?.firstWeekContainsDate ?? a?.options?.firstWeekContainsDate ?? 1
      });
    },
    getISOWeek: (i) => {
      const c = l(i);
      return Rt(c);
    },
    differenceInCalendarDays: (i, c) => {
      const d = l(i), m = l(c);
      return $t(d, m);
    },
    differenceInCalendarMonths: (i, c) => {
      const d = l(i), m = l(c);
      return ma(d, m);
    }
  };
}
const et = (e) => e instanceof HTMLElement ? e : null, Tt = (e) => [
  ...e.querySelectorAll("[data-animated-month]") ?? []
], Pl = (e) => et(e.querySelector("[data-animated-month]")), Et = (e) => et(e.querySelector("[data-animated-caption]")), Dt = (e) => et(e.querySelector("[data-animated-weeks]")), Bl = (e) => et(e.querySelector("[data-animated-nav]")), Ol = (e) => et(e.querySelector("[data-animated-weekdays]"));
function Ll(e, t, { classNames: r, months: a, focused: o, dateLib: s }) {
  const l = ct(null), i = ct(a), c = ct(!1);
  Fn(() => {
    const d = i.current;
    if (i.current = a, !t || !e.current || // safety check because the ref can be set to anything by consumers
    !(e.current instanceof HTMLElement) || // validation required for the animation to work as expected
    a.length === 0 || d.length === 0 || a.length !== d.length)
      return;
    const m = s.isSameMonth(a[0].date, d[0].date), h = s.isAfter(a[0].date, d[0].date), p = h ? r[re.caption_after_enter] : r[re.caption_before_enter], v = h ? r[re.weeks_after_enter] : r[re.weeks_before_enter], b = l.current, g = e.current.cloneNode(!0);
    if (g instanceof HTMLElement ? (Tt(g).forEach((M) => {
      if (!(M instanceof HTMLElement))
        return;
      const N = Pl(M);
      N && M.contains(N) && M.removeChild(N);
      const k = Et(M);
      k && k.classList.remove(p);
      const C = Dt(M);
      C && C.classList.remove(v);
    }), l.current = g) : l.current = null, c.current || m || // skip animation if a day is focused because it can cause issues to the animation and is better for a11y
    o)
      return;
    const w = b instanceof HTMLElement ? Tt(b) : [], y = Tt(e.current);
    if (y?.every((S) => S instanceof HTMLElement) && w && w.every((S) => S instanceof HTMLElement)) {
      c.current = !0, e.current.style.isolation = "isolate";
      const S = Bl(e.current);
      S && (S.style.zIndex = "1"), y.forEach((M, N) => {
        const k = w[N];
        if (!k)
          return;
        M.style.position = "relative", M.style.overflow = "hidden";
        const C = Et(M);
        C && C.classList.add(p);
        const E = Dt(M);
        E && E.classList.add(v);
        const W = () => {
          c.current = !1, e.current && (e.current.style.isolation = ""), S && (S.style.zIndex = ""), C && C.classList.remove(p), E && E.classList.remove(v), M.style.position = "", M.style.overflow = "", M.contains(k) && M.removeChild(k);
        };
        k.style.pointerEvents = "none", k.style.position = "absolute", k.style.overflow = "hidden", k.setAttribute("aria-hidden", "true");
        const P = Ol(k);
        P && (P.style.opacity = "0");
        const L = Et(k);
        L && (L.classList.add(h ? r[re.caption_before_exit] : r[re.caption_after_exit]), L.addEventListener("animationend", W));
        const K = Dt(k);
        K && K.classList.add(h ? r[re.weeks_before_exit] : r[re.weeks_after_exit]), M.insertBefore(k, M.firstChild);
      });
    }
  });
}
function Wl(e, t, r, a) {
  const o = e[0], s = e[e.length - 1], { ISOWeek: l, fixedWeeks: i, broadcastCalendar: c } = r ?? {}, { addDays: d, differenceInCalendarDays: m, differenceInCalendarMonths: h, endOfBroadcastWeek: p, endOfISOWeek: v, endOfMonth: b, endOfWeek: g, isAfter: w, startOfBroadcastWeek: y, startOfISOWeek: S, startOfWeek: M } = a, N = c ? y(o, a) : l ? S(o) : M(o), k = c ? p(s) : l ? v(b(s)) : g(b(s)), C = t && (c ? p(t) : l ? v(t) : g(t)), E = C && w(k, C) ? C : k, W = m(E, N), P = h(s, o) + 1, L = [];
  for (let ie = 0; ie <= W; ie++) {
    const Z = d(N, ie);
    L.push(Z);
  }
  const J = (c ? 35 : 42) * P;
  if (i && L.length < J) {
    const ie = J - L.length;
    for (let Z = 0; Z < ie; Z++) {
      const ye = d(L[L.length - 1], 1);
      L.push(ye);
    }
  }
  return L;
}
function Il(e) {
  const t = [];
  return e.reduce((r, a) => {
    const o = a.weeks.reduce((s, l) => s.concat(l.days.slice()), t.slice());
    return r.concat(o.slice());
  }, t.slice());
}
function Hl(e, t, r, a) {
  const { numberOfMonths: o = 1 } = r, s = [];
  for (let l = 0; l < o; l++) {
    const i = a.addMonths(e, l);
    if (t && i > t)
      break;
    s.push(i);
  }
  return s;
}
function Pr(e, t, r, a) {
  const { month: o, defaultMonth: s, today: l = a.today(), numberOfMonths: i = 1 } = e;
  let c = o || s || l;
  const { differenceInCalendarMonths: d, addMonths: m, startOfMonth: h } = a;
  if (r && d(r, c) < i - 1) {
    const p = -1 * (i - 1);
    c = m(r, p);
  }
  return t && d(c, t) < 0 && (c = t), h(c);
}
function jl(e, t, r, a) {
  const { addDays: o, endOfBroadcastWeek: s, endOfISOWeek: l, endOfMonth: i, endOfWeek: c, getISOWeek: d, getWeek: m, startOfBroadcastWeek: h, startOfISOWeek: p, startOfWeek: v } = a, b = e.reduce((g, w) => {
    const y = r.broadcastCalendar ? h(w, a) : r.ISOWeek ? p(w) : v(w), S = r.broadcastCalendar ? s(w) : r.ISOWeek ? l(i(w)) : c(i(w)), M = t.filter((E) => E >= y && E <= S), N = r.broadcastCalendar ? 35 : 42;
    if (r.fixedWeeks && M.length < N) {
      const E = t.filter((W) => {
        const P = N - M.length;
        return W > S && W <= o(S, P);
      });
      M.push(...E);
    }
    const k = M.reduce((E, W) => {
      const P = r.ISOWeek ? d(W) : m(W), L = E.find((J) => J.weekNumber === P), K = new Na(W, w, a);
      return L ? L.days.push(K) : E.push(new Oi(P, [K])), E;
    }, []), C = new Bi(w, k);
    return g.push(C), g;
  }, []);
  return r.reverseMonths ? b.reverse() : b;
}
function Fl(e, t) {
  let { startMonth: r, endMonth: a } = e;
  const { startOfYear: o, startOfDay: s, startOfMonth: l, endOfMonth: i, addYears: c, endOfYear: d, newDate: m, today: h } = t, { fromYear: p, toYear: v, fromMonth: b, toMonth: g } = e;
  !r && b && (r = b), !r && p && (r = t.newDate(p, 0, 1)), !a && g && (a = g), !a && v && (a = m(v, 11, 31));
  const w = e.captionLayout === "dropdown" || e.captionLayout === "dropdown-years";
  return r ? r = l(r) : p ? r = m(p, 0, 1) : !r && w && (r = o(c(e.today ?? h(), -100))), a ? a = i(a) : v ? a = m(v, 11, 31) : !a && w && (a = d(e.today ?? h())), [
    r && s(r),
    a && s(a)
  ];
}
function Al(e, t, r, a) {
  if (r.disableNavigation)
    return;
  const { pagedNavigation: o, numberOfMonths: s = 1 } = r, { startOfMonth: l, addMonths: i, differenceInCalendarMonths: c } = a, d = o ? s : 1, m = l(e);
  if (!t)
    return i(m, d);
  if (!(c(t, e) < s))
    return i(m, d);
}
function _l(e, t, r, a) {
  if (r.disableNavigation)
    return;
  const { pagedNavigation: o, numberOfMonths: s } = r, { startOfMonth: l, addMonths: i, differenceInCalendarMonths: c } = a, d = o ? s ?? 1 : 1, m = l(e);
  if (!t)
    return i(m, -d);
  if (!(c(m, t) <= 0))
    return i(m, -d);
}
function zl(e) {
  const t = [];
  return e.reduce((r, a) => r.concat(a.weeks.slice()), t.slice());
}
function xt(e, t) {
  const [r, a] = Lt(e);
  return [t === void 0 ? r : t, a];
}
function Yl(e, t) {
  const [r, a] = Fl(e, t), { startOfMonth: o, endOfMonth: s } = t, l = Pr(e, r, a, t), [i, c] = xt(
    l,
    // initialMonth is always computed from props.month if provided
    e.month ? l : void 0
  );
  An(() => {
    const N = Pr(e, r, a, t);
    c(N);
  }, [e.timeZone]);
  const { months: d, weeks: m, days: h, previousMonth: p, nextMonth: v } = dt(() => {
    const N = Hl(i, a, { numberOfMonths: e.numberOfMonths }, t), k = Wl(N, e.endMonth ? s(e.endMonth) : void 0, {
      ISOWeek: e.ISOWeek,
      fixedWeeks: e.fixedWeeks,
      broadcastCalendar: e.broadcastCalendar
    }, t), C = jl(N, k, {
      broadcastCalendar: e.broadcastCalendar,
      fixedWeeks: e.fixedWeeks,
      ISOWeek: e.ISOWeek,
      reverseMonths: e.reverseMonths
    }, t), E = zl(C), W = Il(C), P = _l(i, r, e, t), L = Al(i, a, e, t);
    return {
      months: C,
      weeks: E,
      days: W,
      previousMonth: P,
      nextMonth: L
    };
  }, [
    t,
    i.getTime(),
    a?.getTime(),
    r?.getTime(),
    e.disableNavigation,
    e.broadcastCalendar,
    e.endMonth?.getTime(),
    e.fixedWeeks,
    e.ISOWeek,
    e.numberOfMonths,
    e.pagedNavigation,
    e.reverseMonths
  ]), { disableNavigation: b, onMonthChange: g } = e, w = (N) => m.some((k) => k.days.some((C) => C.isEqualTo(N))), y = (N) => {
    if (b)
      return;
    let k = o(N);
    r && k < o(r) && (k = o(r)), a && k > o(a) && (k = o(a)), c(k), g?.(k);
  };
  return {
    months: d,
    weeks: m,
    days: h,
    navStart: r,
    navEnd: a,
    previousMonth: p,
    nextMonth: v,
    goToMonth: y,
    goToDay: (N) => {
      w(N) || y(N.date);
    }
  };
}
var ue;
(function(e) {
  e[e.Today = 0] = "Today", e[e.Selected = 1] = "Selected", e[e.LastFocused = 2] = "LastFocused", e[e.FocusedModifier = 3] = "FocusedModifier";
})(ue || (ue = {}));
function Br(e) {
  return !e[_.disabled] && !e[_.hidden] && !e[_.outside];
}
function $l(e, t, r, a) {
  let o, s = -1;
  for (const l of e) {
    const i = t(l);
    Br(i) && (i[_.focused] && s < ue.FocusedModifier ? (o = l, s = ue.FocusedModifier) : a?.isEqualTo(l) && s < ue.LastFocused ? (o = l, s = ue.LastFocused) : r(l.date) && s < ue.Selected ? (o = l, s = ue.Selected) : i[_.today] && s < ue.Today && (o = l, s = ue.Today));
  }
  return o || (o = e.find((l) => Br(t(l)))), o;
}
function Rl(e, t, r, a, o, s, l) {
  const { ISOWeek: i, broadcastCalendar: c } = s, { addDays: d, addMonths: m, addWeeks: h, addYears: p, endOfBroadcastWeek: v, endOfISOWeek: b, endOfWeek: g, max: w, min: y, startOfBroadcastWeek: S, startOfISOWeek: M, startOfWeek: N } = l;
  let C = {
    day: d,
    week: h,
    month: m,
    year: p,
    startOfWeek: (E) => c ? S(E, l) : i ? M(E) : N(E),
    endOfWeek: (E) => c ? v(E) : i ? b(E) : g(E)
  }[e](r, t === "after" ? 1 : -1);
  return t === "before" && a ? C = w([a, C]) : t === "after" && o && (C = y([o, C])), C;
}
function Fa(e, t, r, a, o, s, l, i = 0) {
  if (i > 365)
    return;
  const c = Rl(e, t, r.date, a, o, s, l), d = !!(s.disabled && ge(c, s.disabled, l)), m = !!(s.hidden && ge(c, s.hidden, l)), h = c, p = new Na(c, h, l);
  return !d && !m ? p : Fa(e, t, p, a, o, s, l, i + 1);
}
function Vl(e, t, r, a, o) {
  const { autoFocus: s } = e, [l, i] = Lt(), c = $l(t.days, r, a || (() => !1), l), [d, m] = Lt(s ? c : void 0);
  return {
    isFocusTarget: (g) => !!c?.isEqualTo(g),
    setFocused: m,
    focused: d,
    blur: () => {
      i(d), m(void 0);
    },
    moveFocus: (g, w) => {
      if (!d)
        return;
      const y = Fa(g, w, d, t.navStart, t.navEnd, e, o);
      y && (e.disableNavigation && !t.days.some((M) => M.isEqualTo(y)) || (t.goToDay(y), m(y)));
    }
  };
}
function ql(e, t) {
  const { selected: r, required: a, onSelect: o } = e, [s, l] = xt(r, o ? r : void 0), i = o ? r : s, { isSameDay: c } = t, d = (v) => i?.some((b) => c(b, v)) ?? !1, { min: m, max: h } = e;
  return {
    selected: i,
    select: (v, b, g) => {
      let w = [...i ?? []];
      if (d(v)) {
        if (i?.length === m || a && i?.length === 1)
          return;
        w = i?.filter((y) => !c(y, v));
      } else
        i?.length === h ? w = [v] : w = [...w, v];
      return o || l(w), o?.(w, v, b, g), w;
    },
    isSelected: d
  };
}
function Gl(e, t, r = 0, a = 0, o = !1, s = ve) {
  const { from: l, to: i } = t || {}, { isSameDay: c, isAfter: d, isBefore: m } = s;
  let h;
  if (!l && !i)
    h = { from: e, to: r > 0 ? void 0 : e };
  else if (l && !i)
    c(l, e) ? r === 0 ? h = { from: l, to: e } : o ? h = { from: l, to: void 0 } : h = void 0 : m(e, l) ? h = { from: e, to: l } : h = { from: l, to: e };
  else if (l && i)
    if (c(l, e) && c(i, e))
      o ? h = { from: l, to: i } : h = void 0;
    else if (c(l, e))
      h = { from: l, to: r > 0 ? void 0 : e };
    else if (c(i, e))
      h = { from: e, to: r > 0 ? void 0 : e };
    else if (m(e, l))
      h = { from: e, to: i };
    else if (d(e, l))
      h = { from: l, to: e };
    else if (d(e, i))
      h = { from: l, to: e };
    else
      throw new Error("Invalid range");
  if (h?.from && h?.to) {
    const p = s.differenceInCalendarDays(h.to, h.from);
    a > 0 && p > a ? h = { from: e, to: void 0 } : r > 1 && p < r && (h = { from: e, to: void 0 });
  }
  return h;
}
function Ul(e, t, r = ve) {
  const a = Array.isArray(t) ? t : [t];
  let o = e.from;
  const s = r.differenceInCalendarDays(e.to, e.from), l = Math.min(s, 6);
  for (let i = 0; i <= l; i++) {
    if (a.includes(o.getDay()))
      return !0;
    o = r.addDays(o, 1);
  }
  return !1;
}
function Or(e, t, r = ve) {
  return be(e, t.from, !1, r) || be(e, t.to, !1, r) || be(t, e.from, !1, r) || be(t, e.to, !1, r);
}
function Xl(e, t, r = ve) {
  const a = Array.isArray(t) ? t : [t];
  if (a.filter((i) => typeof i != "function").some((i) => typeof i == "boolean" ? i : r.isDate(i) ? be(e, i, !1, r) : Ca(i, r) ? i.some((c) => be(e, c, !1, r)) : gt(i) ? i.from && i.to ? Or(e, { from: i.from, to: i.to }, r) : !1 : Ma(i) ? Ul(e, i.dayOfWeek, r) : qt(i) ? r.isAfter(i.before, i.after) ? Or(e, {
    from: r.addDays(i.after, 1),
    to: r.addDays(i.before, -1)
  }, r) : ge(e.from, i, r) || ge(e.to, i, r) : Gt(i) || Ut(i) ? ge(e.from, i, r) || ge(e.to, i, r) : !1))
    return !0;
  const l = a.filter((i) => typeof i == "function");
  if (l.length) {
    let i = e.from;
    const c = r.differenceInCalendarDays(e.to, e.from);
    for (let d = 0; d <= c; d++) {
      if (l.some((m) => m(i)))
        return !0;
      i = r.addDays(i, 1);
    }
  }
  return !1;
}
function Ql(e, t) {
  const { disabled: r, excludeDisabled: a, resetOnSelect: o, selected: s, required: l, onSelect: i } = e, [c, d] = xt(s, i ? s : void 0), m = i ? s : c;
  return {
    selected: m,
    select: (v, b, g) => {
      const { min: w, max: y } = e;
      let S;
      if (v) {
        const M = m?.from, N = m?.to, k = !!M && !!N, C = !!M && !!N && t.isSameDay(M, N) && t.isSameDay(v, M);
        o && (k || !m?.from) ? !l && C ? S = void 0 : S = { from: v, to: void 0 } : S = Gl(v, m, w, y, l, t);
      }
      return a && r && S?.from && S.to && Xl({ from: S.from, to: S.to }, r, t) && (S.from = v, S.to = void 0), i || d(S), i?.(S, v, b, g), S;
    },
    isSelected: (v) => m && be(m, v, !1, t)
  };
}
function Zl(e, t) {
  const { selected: r, required: a, onSelect: o } = e, [s, l] = xt(r, o ? r : void 0), i = o ? r : s, { isSameDay: c } = t;
  return {
    selected: i,
    select: (h, p, v) => {
      let b = h;
      return !a && i && i && c(h, i) && (b = void 0), o || l(b), o?.(b, h, p, v), b;
    },
    isSelected: (h) => i ? c(i, h) : !1
  };
}
function Kl(e, t) {
  const r = Zl(e, t), a = ql(e, t), o = Ql(e, t);
  switch (e.mode) {
    case "single":
      return r;
    case "multiple":
      return a;
    case "range":
      return o;
    default:
      return;
  }
}
function oe(e, t) {
  return e instanceof Q && e.timeZone === t ? e : new Q(e, t);
}
function Oe(e, t, r) {
  return oe(e, t);
}
function Lr(e, t, r) {
  return typeof e == "boolean" || typeof e == "function" ? e : e instanceof Date ? Oe(e, t) : Array.isArray(e) ? e.map((a) => a instanceof Date ? Oe(a, t) : a) : gt(e) ? {
    ...e,
    from: e.from ? oe(e.from, t) : e.from,
    to: e.to ? oe(e.to, t) : e.to
  } : qt(e) ? {
    before: Oe(e.before, t),
    after: Oe(e.after, t)
  } : Gt(e) ? {
    after: Oe(e.after, t)
  } : Ut(e) ? {
    before: Oe(e.before, t)
  } : e;
}
function Pt(e, t, r) {
  return e && (Array.isArray(e) ? e.map((a) => Lr(a, t)) : Lr(e, t));
}
function Jl(e) {
  let t = e;
  const r = t.timeZone;
  if (r && (t = {
    ...e,
    timeZone: r
  }, t.today && (t.today = oe(t.today, r)), t.month && (t.month = oe(t.month, r)), t.defaultMonth && (t.defaultMonth = oe(t.defaultMonth, r)), t.startMonth && (t.startMonth = oe(t.startMonth, r)), t.endMonth && (t.endMonth = oe(t.endMonth, r)), t.mode === "single" && t.selected ? t.selected = oe(t.selected, r) : t.mode === "multiple" && t.selected ? t.selected = t.selected?.map((O) => oe(O, r)) : t.mode === "range" && t.selected && (t.selected = {
    from: t.selected.from ? oe(t.selected.from, r) : t.selected.from,
    to: t.selected.to ? oe(t.selected.to, r) : t.selected.to
  }), t.disabled !== void 0 && (t.disabled = Pt(t.disabled, r)), t.hidden !== void 0 && (t.hidden = Pt(t.hidden, r)), t.modifiers)) {
    const O = {};
    Object.keys(t.modifiers).forEach((j) => {
      O[j] = Pt(t.modifiers?.[j], r);
    }), t.modifiers = O;
  }
  const { components: a, formatters: o, labels: s, dateLib: l, locale: i, classNames: c } = dt(() => {
    const O = { ...ka, ...t.locale }, j = t.broadcastCalendar ? 1 : t.weekStartsOn, B = t.noonSafe && t.timeZone ? Dl(t.timeZone, {
      weekStartsOn: j,
      locale: O
    }) : void 0, H = t.dateLib && B ? { ...B, ...t.dateLib } : t.dateLib ?? B, te = new G({
      locale: O,
      weekStartsOn: j,
      firstWeekContainsDate: t.firstWeekContainsDate,
      useAdditionalWeekYearTokens: t.useAdditionalWeekYearTokens,
      useAdditionalDayOfYearTokens: t.useAdditionalDayOfYearTokens,
      timeZone: t.timeZone,
      numerals: t.numerals
    }, H);
    return {
      dateLib: te,
      components: ll(t.components),
      formatters: xl(t.formatters),
      labels: Sl(t.labels, te.options),
      locale: O,
      classNames: { ...dl(), ...t.classNames }
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
  t.today || (t = { ...t, today: l.today() });
  const { captionLayout: d, mode: m, navLayout: h, numberOfMonths: p = 1, onDayBlur: v, onDayClick: b, onDayFocus: g, onDayKeyDown: w, onDayMouseEnter: y, onDayMouseLeave: S, onNextClick: M, onPrevClick: N, showWeekNumber: k, styles: C } = t, { formatCaption: E, formatDay: W, formatMonthDropdown: P, formatWeekNumber: L, formatWeekNumberHeader: K, formatWeekdayName: J, formatYearDropdown: ie } = o, Z = Yl(t, l), { days: ye, months: Ee, navStart: _e, navEnd: z, previousMonth: Y, nextMonth: V, goToMonth: X } = Z, we = sl(ye, t, _e, z, l), { isSelected: De, select: wt, selected: nt } = Kl(t, l) ?? {}, { blur: nr, focused: or, isFocusTarget: nn, moveFocus: sr, setFocused: ot } = Vl(t, Z, we, De ?? (() => !1), l), { labelDayButton: on, labelGridcell: sn, labelGrid: ln, labelMonthDropdown: cn, labelNav: ir, labelPrevious: dn, labelNext: un, labelWeekday: fn, labelWeekNumber: hn, labelWeekNumberHeader: mn, labelYearDropdown: pn } = s, vn = dt(() => Tl(l, t.ISOWeek, t.broadcastCalendar, t.today), [l, t.ISOWeek, t.broadcastCalendar, t.today]), lr = m !== void 0 || b !== void 0, kt = ne(() => {
    Y && (X(Y), N?.(Y));
  }, [Y, X, N]), Nt = ne(() => {
    V && (X(V), M?.(V));
  }, [X, V, M]), bn = ne((O, j) => (B) => {
    B.preventDefault(), B.stopPropagation(), ot(O), !j.disabled && (wt?.(O.date, j, B), b?.(O.date, j, B));
  }, [wt, b, ot]), gn = ne((O, j) => (B) => {
    ot(O), g?.(O.date, j, B);
  }, [g, ot]), xn = ne((O, j) => (B) => {
    nr(), v?.(O.date, j, B);
  }, [nr, v]), yn = ne((O, j) => (B) => {
    const H = {
      ArrowLeft: [
        B.shiftKey ? "month" : "day",
        t.dir === "rtl" ? "after" : "before"
      ],
      ArrowRight: [
        B.shiftKey ? "month" : "day",
        t.dir === "rtl" ? "before" : "after"
      ],
      ArrowDown: [B.shiftKey ? "year" : "week", "after"],
      ArrowUp: [B.shiftKey ? "year" : "week", "before"],
      PageUp: [B.shiftKey ? "year" : "month", "before"],
      PageDown: [B.shiftKey ? "year" : "month", "after"],
      Home: ["startOfWeek", "before"],
      End: ["endOfWeek", "after"]
    };
    if (H[B.key]) {
      B.preventDefault(), B.stopPropagation();
      const [te, I] = H[B.key];
      sr(te, I);
    }
    w?.(O.date, j, B);
  }, [sr, w, t.dir]), wn = ne((O, j) => (B) => {
    y?.(O.date, j, B);
  }, [y]), kn = ne((O, j) => (B) => {
    S?.(O.date, j, B);
  }, [S]), Nn = ne((O) => (j) => {
    const B = Number(j.target.value), H = l.setMonth(l.startOfMonth(O), B);
    X(H);
  }, [l, X]), Sn = ne((O) => (j) => {
    const B = Number(j.target.value), H = l.setYear(l.startOfMonth(O), B);
    X(H);
  }, [l, X]), { className: Mn, style: Cn } = dt(() => ({
    className: [c[D.Root], t.className].filter(Boolean).join(" "),
    style: { ...C?.[D.Root], ...t.style }
  }), [c, t.className, t.style, C]), Tn = cl(t), cr = ct(null);
  Ll(cr, !!t.animate, {
    classNames: c,
    months: Ee,
    focused: or,
    dateLib: l
  });
  const En = {
    dayPickerProps: t,
    selected: nt,
    select: wt,
    isSelected: De,
    months: Ee,
    nextMonth: V,
    previousMonth: Y,
    goToMonth: X,
    getModifiers: we,
    components: a,
    classNames: c,
    styles: C,
    labels: s,
    formatters: o
  };
  return T.createElement(
    Sa.Provider,
    { value: En },
    T.createElement(
      a.Root,
      { rootRef: t.animate ? cr : void 0, className: Mn, style: Cn, dir: t.dir, id: t.id, lang: t.lang ?? i.code, nonce: t.nonce, title: t.title, role: t.role, "aria-label": t["aria-label"], "aria-labelledby": t["aria-labelledby"], ...Tn },
      T.createElement(
        a.Months,
        { className: c[D.Months], style: C?.[D.Months] },
        !t.hideNavigation && !h && T.createElement(a.Nav, { "data-animated-nav": t.animate ? "true" : void 0, className: c[D.Nav], style: C?.[D.Nav], "aria-label": ir(), onPreviousClick: kt, onNextClick: Nt, previousMonth: Y, nextMonth: V }),
        Ee.map((O, j) => T.createElement(
          a.Month,
          {
            "data-animated-month": t.animate ? "true" : void 0,
            className: c[D.Month],
            style: C?.[D.Month],
            // biome-ignore lint/suspicious/noArrayIndexKey: breaks animation
            key: j,
            displayIndex: j,
            calendarMonth: O
          },
          h === "around" && !t.hideNavigation && j === 0 && T.createElement(
            a.PreviousMonthButton,
            { type: "button", className: c[D.PreviousMonthButton], tabIndex: Y ? void 0 : -1, "aria-disabled": Y ? void 0 : !0, "aria-label": dn(Y), onClick: kt, "data-animated-button": t.animate ? "true" : void 0 },
            T.createElement(a.Chevron, { disabled: Y ? void 0 : !0, className: c[D.Chevron], orientation: t.dir === "rtl" ? "right" : "left" })
          ),
          T.createElement(a.MonthCaption, { "data-animated-caption": t.animate ? "true" : void 0, className: c[D.MonthCaption], style: C?.[D.MonthCaption], calendarMonth: O, displayIndex: j }, d?.startsWith("dropdown") ? T.createElement(
            a.DropdownNav,
            { className: c[D.Dropdowns], style: C?.[D.Dropdowns] },
            (() => {
              const B = d === "dropdown" || d === "dropdown-months" ? T.createElement(a.MonthsDropdown, { key: "month", className: c[D.MonthsDropdown], "aria-label": cn(), classNames: c, components: a, disabled: !!t.disableNavigation, onChange: Nn(O.date), options: Ml(O.date, _e, z, o, l), style: C?.[D.Dropdown], value: l.getMonth(O.date) }) : T.createElement("span", { key: "month" }, P(O.date, l)), H = d === "dropdown" || d === "dropdown-years" ? T.createElement(a.YearsDropdown, { key: "year", className: c[D.YearsDropdown], "aria-label": pn(l.options), classNames: c, components: a, disabled: !!t.disableNavigation, onChange: Sn(O.date), options: El(_e, z, o, l, !!t.reverseYears), style: C?.[D.Dropdown], value: l.getYear(O.date) }) : T.createElement("span", { key: "year" }, ie(O.date, l));
              return l.getMonthYearOrder() === "year-first" ? [H, B] : [B, H];
            })(),
            T.createElement("span", { role: "status", "aria-live": "polite", style: {
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
            } }, E(O.date, l.options, l))
          ) : T.createElement(a.CaptionLabel, { className: c[D.CaptionLabel], role: "status", "aria-live": "polite" }, E(O.date, l.options, l))),
          h === "around" && !t.hideNavigation && j === p - 1 && T.createElement(
            a.NextMonthButton,
            { type: "button", className: c[D.NextMonthButton], tabIndex: V ? void 0 : -1, "aria-disabled": V ? void 0 : !0, "aria-label": un(V), onClick: Nt, "data-animated-button": t.animate ? "true" : void 0 },
            T.createElement(a.Chevron, { disabled: V ? void 0 : !0, className: c[D.Chevron], orientation: t.dir === "rtl" ? "left" : "right" })
          ),
          j === p - 1 && h === "after" && !t.hideNavigation && T.createElement(a.Nav, { "data-animated-nav": t.animate ? "true" : void 0, className: c[D.Nav], style: C?.[D.Nav], "aria-label": ir(), onPreviousClick: kt, onNextClick: Nt, previousMonth: Y, nextMonth: V }),
          T.createElement(
            a.MonthGrid,
            { role: "grid", "aria-multiselectable": m === "multiple" || m === "range", "aria-label": ln(O.date, l.options, l) || void 0, className: c[D.MonthGrid], style: C?.[D.MonthGrid] },
            !t.hideWeekdays && T.createElement(
              a.Weekdays,
              { "data-animated-weekdays": t.animate ? "true" : void 0, className: c[D.Weekdays], style: C?.[D.Weekdays] },
              k && T.createElement(a.WeekNumberHeader, { "aria-label": mn(l.options), className: c[D.WeekNumberHeader], style: C?.[D.WeekNumberHeader], scope: "col" }, K()),
              vn.map((B) => T.createElement(a.Weekday, { "aria-label": fn(B, l.options, l), className: c[D.Weekday], key: String(B), style: C?.[D.Weekday], scope: "col" }, J(B, l.options, l)))
            ),
            T.createElement(a.Weeks, { "data-animated-weeks": t.animate ? "true" : void 0, className: c[D.Weeks], style: C?.[D.Weeks] }, O.weeks.map((B) => T.createElement(
              a.Week,
              { className: c[D.Week], key: B.weekNumber, style: C?.[D.Week], week: B },
              k && T.createElement(a.WeekNumber, { week: B, style: C?.[D.WeekNumber], "aria-label": hn(B.weekNumber, {
                locale: i
              }), className: c[D.WeekNumber], scope: "row", role: "rowheader" }, L(B.weekNumber, l)),
              B.days.map((H) => {
                const { date: te } = H, I = we(H);
                if (I[_.focused] = !I.hidden && !!or?.isEqualTo(H), I[ce.selected] = De?.(te) || I.selected, gt(nt)) {
                  const { from: St, to: Mt } = nt;
                  I[ce.range_start] = !!(St && Mt && l.isSameDay(te, St)), I[ce.range_end] = !!(St && Mt && l.isSameDay(te, Mt)), I[ce.range_middle] = be(nt, te, !0, l);
                }
                const Dn = Cl(I, C, t.modifiersStyles), Pn = il(I, c, t.modifiersClassNames), Bn = !lr && !I.hidden ? sn(te, I, l.options, l) : void 0;
                return T.createElement(a.Day, { key: `${H.isoDate}_${H.displayMonthId}`, day: H, modifiers: I, className: Pn.join(" "), style: Dn, role: "gridcell", "aria-selected": I.selected || void 0, "aria-label": Bn, "data-day": H.isoDate, "data-month": H.outside ? H.dateMonthId : void 0, "data-selected": I.selected || void 0, "data-disabled": I.disabled || void 0, "data-hidden": I.hidden || void 0, "data-outside": H.outside || void 0, "data-focused": I.focused || void 0, "data-today": I.today || void 0 }, !I.hidden && lr ? T.createElement(a.DayButton, { className: c[D.DayButton], style: C?.[D.DayButton], type: "button", day: H, modifiers: I, disabled: !I.focused && I.disabled || void 0, "aria-disabled": I.focused && I.disabled || void 0, tabIndex: nn(H) ? 0 : -1, "aria-label": on(te, I, l.options, l), onClick: bn(H, I), onBlur: xn(H, I), onFocus: gn(H, I), onKeyDown: yn(H, I), onMouseEnter: wn(H, I), onMouseLeave: kn(H, I) }, W(te, l.options, l)) : !I.hidden && W(H.date, l.options, l));
              })
            )))
          )
        ))
      ),
      t.footer && T.createElement(a.Footer, { className: c[D.Footer], style: C?.[D.Footer], role: "status", "aria-live": "polite" }, t.footer)
    )
  );
}
const ec = {
  ...Pi,
  labels: {
    labelDayButton: (e, t, r, a) => {
      let s = (a ?? new G(r)).format(e, "PPPP");
      return t.today && (s = `今日、${s}`), t.selected && (s = `${s}、選択済み`), s;
    },
    labelMonthDropdown: "月を選択",
    labelNext: "次の月へ",
    labelPrevious: "前の月へ",
    labelWeekNumber: (e) => `第${e}週`,
    labelYearDropdown: "年を選択",
    labelGrid: (e, t, r) => (r ?? new G(t)).formatMonthYear(e),
    labelGridcell: (e, t, r, a) => {
      let s = (a ?? new G(r)).format(e, "PPPP");
      return t?.today && (s = `今日、${s}`), s;
    },
    labelNav: "ナビゲーションバー",
    labelWeekNumberHeader: "週番号",
    labelWeekday: (e, t, r) => (r ?? new G(t)).format(e, "cccc")
  }
};
function Aa({ className: e, classNames: t, showOutsideDays: r = !0, ...a }) {
  return /* @__PURE__ */ n(
    Jl,
    {
      "data-slot": "calendar",
      showOutsideDays: r,
      locale: ec,
      className: u("p-3", e),
      classNames: {
        root: "relative w-fit",
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 items-center h-9",
        caption_label: "typo-label-md text-[var(--Text-High-Emphasis)]",
        nav: "absolute top-[16px] inset-x-0 flex justify-between px-1 z-10 pointer-events-none",
        button_previous: u(
          "h-7 w-7 flex items-center justify-center rounded-lg pointer-events-auto",
          "text-[var(--Object-Medium-Emphasis)] hover:text-[var(--Object-High-Emphasis)]",
          "hover:bg-[var(--Surface-Secondary)] transition-colors"
        ),
        button_next: u(
          "h-7 w-7 flex items-center justify-center rounded-lg pointer-events-auto",
          "text-[var(--Object-Medium-Emphasis)] hover:text-[var(--Object-High-Emphasis)]",
          "hover:bg-[var(--Surface-Secondary)] transition-colors"
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "text-[var(--Text-Low-Emphasis)] typo-label-xs w-9 font-normal text-center",
        week: "flex w-full mt-2",
        day: "h-9 w-9 text-center relative p-0 focus-within:relative focus-within:z-20",
        day_button: u(
          "h-9 w-9 typo-body-sm rounded-full transition-colors",
          "hover:bg-[var(--Surface-Secondary)] hover:text-[var(--Text-High-Emphasis)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--Focus-High-Emphasis)]"
        ),
        // 通常選択（単一 or range の start/end）
        selected: "[&>button]:bg-[var(--Brand-Primary)] [&>button]:text-[var(--Text-on-Inverse)] [&>button]:hover:bg-[var(--Brand-Primary)] [&>button]:hover:text-[var(--Text-on-Inverse)]",
        // range の start: 右半分を帯で塗る
        range_start: "bg-gradient-to-r from-transparent from-50% to-[var(--Brand-Ultra-Light)] to-50%",
        // range の end: 左半分を帯で塗る
        range_end: "bg-gradient-to-l from-transparent from-50% to-[var(--Brand-Ultra-Light)] to-50%",
        // range の中間: 全幅を帯で塗り、ボタンの円を消す
        range_middle: "bg-[var(--Brand-Ultra-Light)] [&>button]:!bg-transparent [&>button]:!text-[var(--Text-High-Emphasis)] [&>button]:rounded-none [&>button]:hover:!bg-[var(--Brand-Ultra-Light)]",
        today: "[&>button]:font-semibold [&>button]:text-[var(--Brand-Primary)]",
        outside: "opacity-30",
        disabled: "text-[var(--Text-Low-Emphasis)] opacity-50",
        hidden: "invisible",
        ...t
      },
      components: {
        Chevron: ({ orientation: o }) => /* @__PURE__ */ n(
          "svg",
          {
            width: "16",
            height: "16",
            viewBox: "0 0 16 16",
            fill: "none",
            className: u(o === "left" ? "rotate-90" : "-rotate-90"),
            children: /* @__PURE__ */ n(
              "path",
              {
                d: "M4 6l4 4 4-4",
                stroke: "currentColor",
                strokeWidth: "1.5",
                strokeLinecap: "round",
                strokeLinejoin: "round"
              }
            )
          }
        )
      },
      ...a
    }
  );
}
function tt({ ...e }) {
  return /* @__PURE__ */ n(Ue.Root, { "data-slot": "popover", ...e });
}
function rt({ ...e }) {
  return /* @__PURE__ */ n(Ue.Trigger, { "data-slot": "popover-trigger", ...e });
}
function at({ className: e, align: t = "center", sideOffset: r = 4, ...a }) {
  return /* @__PURE__ */ n(Ue.Portal, { children: /* @__PURE__ */ n(
    Ue.Content,
    {
      "data-slot": "popover-content",
      align: t,
      sideOffset: r,
      className: u(
        "z-50 w-72 rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-4 shadow-[var(--shadow-lg)] outline-none",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        e
      ),
      ...a
    }
  ) });
}
function Gu({ ...e }) {
  return /* @__PURE__ */ n(Ue.Anchor, { "data-slot": "popover-anchor", ...e });
}
function ft(e, t) {
  const r = e.getFullYear(), a = String(e.getMonth() + 1).padStart(2, "0"), o = String(e.getDate()).padStart(2, "0");
  return t.replace("yyyy", String(r)).replace("MM", a).replace("dd", o);
}
const _a = /* @__PURE__ */ f(
  "svg",
  {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none",
    className: "text-[var(--Object-Medium-Emphasis)] shrink-0",
    "aria-hidden": !0,
    children: [
      /* @__PURE__ */ n("rect", { x: "2", y: "3", width: "12", height: "11", rx: "1.5", stroke: "currentColor", strokeWidth: "1.5" }),
      /* @__PURE__ */ n("path", { d: "M2 7h12", stroke: "currentColor", strokeWidth: "1.5" }),
      /* @__PURE__ */ n("path", { d: "M5 1v2M11 1v2", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" })
    ]
  }
);
function za(e, t, r) {
  return u(
    "flex h-12 w-full items-center justify-between rounded-lg border bg-[var(--Surface-Primary)] px-3 typo-body-md transition-colors outline-none",
    e ? "border-[var(--Border-Accent-Primary)] ring-[3px] ring-[var(--Focus-High-Emphasis)]/50" : "border-[var(--Border-Medium-Emphasis)] hover:border-[var(--Border-High-Emphasis)]",
    "disabled:cursor-not-allowed disabled:opacity-50",
    t ? "text-[var(--Text-High-Emphasis)]" : "text-[var(--Text-Low-Emphasis)]",
    r
  );
}
function Uu({
  value: e,
  onChange: t,
  placeholder: r = "日付を選択",
  disabled: a = !1,
  className: o,
  dateFormat: s = "yyyy/MM/dd",
  triggerLabel: l
}) {
  const [i, c] = x.useState(!1), d = e ? ft(e, s) : null;
  return /* @__PURE__ */ f(tt, { open: i, onOpenChange: c, children: [
    /* @__PURE__ */ n(rt, { asChild: !0, children: /* @__PURE__ */ f(
      "button",
      {
        "data-slot": "date-picker-trigger",
        disabled: a,
        "aria-expanded": i,
        "aria-label": l ?? r,
        className: za(i, !!d, o),
        children: [
          /* @__PURE__ */ n("span", { children: d ?? r }),
          _a
        ]
      }
    ) }),
    /* @__PURE__ */ n(at, { className: "w-auto p-0", align: "start", children: /* @__PURE__ */ n(
      Aa,
      {
        mode: "single",
        selected: e,
        onSelect: (m) => {
          t?.(m), c(!1);
        },
        autoFocus: !0
      }
    ) })
  ] });
}
function Xu({
  value: e,
  onChange: t,
  placeholder: r = "期間を選択",
  disabled: a = !1,
  className: o,
  dateFormat: s = "yyyy/MM/dd",
  triggerLabel: l
}) {
  const [i, c] = x.useState(!1), d = e?.from ? e.to ? `${ft(e.from, s)} 〜 ${ft(e.to, s)}` : ft(e.from, s) : null;
  return /* @__PURE__ */ f(tt, { open: i, onOpenChange: c, children: [
    /* @__PURE__ */ n(rt, { asChild: !0, children: /* @__PURE__ */ f(
      "button",
      {
        "data-slot": "date-range-picker-trigger",
        disabled: a,
        "aria-expanded": i,
        "aria-label": l ?? r,
        className: za(i, !!d, o),
        children: [
          /* @__PURE__ */ n("span", { children: d ?? r }),
          _a
        ]
      }
    ) }),
    /* @__PURE__ */ n(at, { className: "w-auto p-0", align: "start", children: /* @__PURE__ */ n(
      Aa,
      {
        mode: "range",
        selected: e?.from ? { from: e.from, to: e.to } : void 0,
        onSelect: (m) => t?.(m ? { from: m.from, to: m.to } : void 0),
        numberOfMonths: 2,
        autoFocus: !0
      }
    ) })
  ] });
}
function Me(e) {
  return String(e).padStart(2, "0");
}
function tc(e) {
  if (!e) return null;
  const [t, r] = e.split(":"), a = parseInt(t, 10), o = parseInt(r, 10);
  return isNaN(a) || isNaN(o) ? null : { h: Math.min(23, Math.max(0, a)), m: Math.min(59, Math.max(0, o)) };
}
const rc = /* @__PURE__ */ f("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", className: "text-[var(--Object-Medium-Emphasis)] shrink-0", "aria-hidden": !0, children: [
  /* @__PURE__ */ n("circle", { cx: "8", cy: "8", r: "6", stroke: "currentColor", strokeWidth: "1.5" }),
  /* @__PURE__ */ n("path", { d: "M8 5v3.5l2 1.5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })
] });
function Wr({
  items: e,
  selected: t,
  onSelect: r
}) {
  const a = x.useRef(null);
  return x.useEffect(() => {
    a.current?.querySelector('[data-selected="true"]')?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [t]), /* @__PURE__ */ n("div", { ref: a, className: "flex flex-col overflow-y-auto h-48 scrollbar-hide snap-y snap-mandatory", children: e.map((o) => /* @__PURE__ */ n(
    "button",
    {
      "data-selected": o === t,
      onClick: () => r(o),
      className: u(
        "shrink-0 h-10 flex items-center justify-center rounded-lg typo-body-md transition-colors snap-center",
        o === t ? "bg-[var(--Brand-Primary)] text-white font-bold" : "text-[var(--Text-High-Emphasis)] hover:bg-[var(--Surface-Secondary)]"
      ),
      children: Me(o)
    },
    o
  )) });
}
function Qu({
  value: e,
  onChange: t,
  placeholder: r = "時刻を選択",
  disabled: a = !1,
  minuteStep: o = 1,
  className: s,
  triggerLabel: l
}) {
  const [i, c] = x.useState(!1), d = tc(e), m = Array.from({ length: 24 }, (y, S) => S), h = Array.from(
    { length: Math.ceil(60 / o) },
    (y, S) => S * o
  ), p = d?.h ?? 0, v = d?.m ?? 0, b = (y) => t?.(`${Me(y)}:${Me(v)}`), g = (y) => t?.(`${Me(p)}:${Me(y)}`), w = d ? `${Me(d.h)}:${Me(d.m)}` : null;
  return /* @__PURE__ */ f(tt, { open: i, onOpenChange: c, children: [
    /* @__PURE__ */ n(rt, { asChild: !0, children: /* @__PURE__ */ f(
      "button",
      {
        "data-slot": "time-picker-trigger",
        disabled: a,
        "aria-expanded": i,
        "aria-label": l ?? r,
        className: u(
          "flex h-12 w-full items-center justify-between rounded-lg border bg-[var(--Surface-Primary)] px-3 typo-body-md transition-colors outline-none",
          i ? "border-[var(--Border-Accent-Primary)] ring-[3px] ring-[var(--Focus-High-Emphasis)]/50" : "border-[var(--Border-Medium-Emphasis)] hover:border-[var(--Border-High-Emphasis)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          w ? "text-[var(--Text-High-Emphasis)]" : "text-[var(--Text-Low-Emphasis)]",
          s
        ),
        children: [
          /* @__PURE__ */ n("span", { children: w ?? r }),
          rc
        ]
      }
    ) }),
    /* @__PURE__ */ n(at, { className: "w-44 p-3", align: "start", children: /* @__PURE__ */ f("div", { className: "flex gap-2 items-start", children: [
      /* @__PURE__ */ f("div", { className: "flex-1", children: [
        /* @__PURE__ */ n("div", { className: "typo-label-xs text-[var(--Text-Low-Emphasis)] text-center mb-1", children: "時" }),
        /* @__PURE__ */ n(Wr, { items: m, selected: p, onSelect: b })
      ] }),
      /* @__PURE__ */ n("div", { className: "flex items-center justify-center h-48 typo-heading-md text-[var(--Text-Low-Emphasis)] select-none pt-6", children: ":" }),
      /* @__PURE__ */ f("div", { className: "flex-1", children: [
        /* @__PURE__ */ n("div", { className: "typo-label-xs text-[var(--Text-Low-Emphasis)] text-center mb-1", children: "分" }),
        /* @__PURE__ */ n(Wr, { items: h, selected: v, onSelect: g })
      ] })
    ] }) })
  ] });
}
function Zu({
  options: e,
  value: t,
  onChange: r,
  placeholder: a = "選択してください",
  searchPlaceholder: o = "検索...",
  emptyLabel: s = "該当なし",
  disabled: l = !1,
  className: i,
  triggerLabel: c
}) {
  const [d, m] = x.useState(!1), [h, p] = x.useState(""), v = x.useRef(null), b = e.find((y) => y.value === t), g = h.trim() ? e.filter((y) => y.label.toLowerCase().includes(h.toLowerCase())) : e, w = (y) => {
    y.disabled || (r?.(y.value), m(!1), p(""));
  };
  return /* @__PURE__ */ f(tt, { open: d, onOpenChange: (y) => {
    m(y), y || p("");
  }, children: [
    /* @__PURE__ */ n(rt, { asChild: !0, children: /* @__PURE__ */ f(
      "button",
      {
        "data-slot": "combobox-trigger",
        disabled: l,
        "aria-expanded": d,
        "aria-label": c ?? a,
        className: u(
          "flex h-12 w-full items-center justify-between rounded-lg border bg-[var(--Surface-Primary)] px-3 typo-body-md transition-colors outline-none",
          d ? "border-[var(--Border-Accent-Primary)] ring-[3px] ring-[var(--Focus-High-Emphasis)]/50" : "border-[var(--Border-Medium-Emphasis)] hover:border-[var(--Border-High-Emphasis)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          b ? "text-[var(--Text-High-Emphasis)]" : "text-[var(--Text-Low-Emphasis)]",
          i
        ),
        children: [
          /* @__PURE__ */ n("span", { children: b ? b.label : a }),
          /* @__PURE__ */ n(
            "svg",
            {
              width: "16",
              height: "16",
              viewBox: "0 0 16 16",
              fill: "none",
              className: u("shrink-0 text-[var(--Object-Medium-Emphasis)] transition-transform", d && "rotate-180"),
              "aria-hidden": !0,
              children: /* @__PURE__ */ n("path", { d: "M4 6L8 10L12 6", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ f(
      at,
      {
        className: "w-[var(--radix-popover-trigger-width)] p-0",
        align: "start",
        onOpenAutoFocus: (y) => {
          y.preventDefault(), v.current?.focus();
        },
        children: [
          /* @__PURE__ */ f("div", { className: "flex items-center border-b border-[var(--Border-Low-Emphasis)] px-3 gap-2", children: [
            /* @__PURE__ */ f("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", className: "text-[var(--Object-Low-Emphasis)] shrink-0", "aria-hidden": !0, children: [
              /* @__PURE__ */ n("circle", { cx: "7", cy: "7", r: "5", stroke: "currentColor", strokeWidth: "1.5" }),
              /* @__PURE__ */ n("path", { d: "M11 11L14 14", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" })
            ] }),
            /* @__PURE__ */ n(
              "input",
              {
                ref: v,
                value: h,
                onChange: (y) => p(y.target.value),
                placeholder: o,
                className: "flex h-10 flex-1 bg-transparent outline-none typo-body-md text-[var(--Text-High-Emphasis)] placeholder:text-[var(--Text-Low-Emphasis)]"
              }
            )
          ] }),
          /* @__PURE__ */ n("div", { role: "listbox", className: "max-h-60 overflow-y-auto p-1", children: g.length === 0 ? /* @__PURE__ */ n("div", { className: "py-6 text-center typo-body-sm text-[var(--Text-Low-Emphasis)]", children: s }) : g.map((y) => /* @__PURE__ */ f(
            "button",
            {
              role: "option",
              "aria-selected": y.value === t,
              disabled: y.disabled,
              onClick: () => w(y),
              className: u(
                "relative flex w-full cursor-default items-center rounded-sm py-2 pl-8 pr-2 typo-body-md outline-none transition-colors text-left",
                "hover:bg-[var(--Surface-Secondary)] focus:bg-[var(--Surface-Secondary)]",
                "disabled:pointer-events-none disabled:opacity-50",
                y.value === t && "text-[var(--Text-Accent-Primary)]"
              ),
              children: [
                y.value === t && /* @__PURE__ */ n("span", { className: "absolute left-2 flex size-4 items-center justify-center", children: /* @__PURE__ */ n("svg", { width: "12", height: "12", viewBox: "0 0 12 12", fill: "none", children: /* @__PURE__ */ n("path", { d: "M10 3L4.5 8.5L2 6", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }) }),
                y.label
              ]
            },
            y.value
          )) })
        ]
      }
    )
  ] });
}
function Ku({
  options: e,
  value: t = [],
  onChange: r,
  placeholder: a = "選択してください",
  searchPlaceholder: o = "検索...",
  emptyLabel: s = "該当なし",
  disabled: l = !1,
  className: i,
  maxDisplay: c = 3,
  clearable: d = !0
}) {
  const [m, h] = x.useState(!1), [p, v] = x.useState(""), b = x.useRef(null), g = p.trim() ? e.filter((N) => N.label.toLowerCase().includes(p.toLowerCase())) : e, w = (N) => {
    t.includes(N) ? r?.(t.filter((k) => k !== N)) : r?.([...t, N]);
  }, y = t.map((N) => e.find((k) => k.value === N)?.label).filter(Boolean), S = y.slice(0, c), M = y.length - S.length;
  return /* @__PURE__ */ f(tt, { open: m, onOpenChange: (N) => {
    h(N), N || v("");
  }, children: [
    /* @__PURE__ */ n(rt, { asChild: !0, children: /* @__PURE__ */ f(
      "button",
      {
        "data-slot": "multi-select-trigger",
        disabled: l,
        "aria-expanded": m,
        className: u(
          "flex min-h-12 w-full flex-wrap items-center gap-1.5 rounded-lg border bg-[var(--Surface-Primary)] px-3 py-2 typo-body-md transition-colors outline-none text-left",
          m ? "border-[var(--Border-Accent-Primary)] ring-[3px] ring-[var(--Focus-High-Emphasis)]/50" : "border-[var(--Border-Medium-Emphasis)] hover:border-[var(--Border-High-Emphasis)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          i
        ),
        children: [
          t.length === 0 ? /* @__PURE__ */ n("span", { className: "text-[var(--Text-Low-Emphasis)] flex-1", children: a }) : /* @__PURE__ */ f(de, { children: [
            S.map((N) => /* @__PURE__ */ n(
              "span",
              {
                className: "inline-flex items-center gap-1 h-6 px-2 rounded-full bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)] typo-label-xs",
                children: N
              },
              N
            )),
            M > 0 && /* @__PURE__ */ f("span", { className: "inline-flex items-center h-6 px-2 rounded-full bg-[var(--Surface-Tertiary)] text-[var(--Text-Medium-Emphasis)] typo-label-xs", children: [
              "+",
              M
            ] }),
            /* @__PURE__ */ n("span", { className: "flex-1" })
          ] }),
          /* @__PURE__ */ f("span", { className: "flex items-center gap-1 ml-auto shrink-0", children: [
            d && t.length > 0 && /* @__PURE__ */ n(
              "span",
              {
                role: "button",
                "aria-label": "クリア",
                onClick: (N) => {
                  N.stopPropagation(), r?.([]);
                },
                className: "flex size-5 items-center justify-center rounded-full text-[var(--Object-Low-Emphasis)] hover:text-[var(--Object-High-Emphasis)] hover:bg-[var(--Surface-Secondary)] transition-colors",
                children: /* @__PURE__ */ n("svg", { width: "10", height: "10", viewBox: "0 0 10 10", fill: "none", children: /* @__PURE__ */ n("path", { d: "M1 1L9 9M9 1L1 9", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }) })
              }
            ),
            /* @__PURE__ */ n(
              "svg",
              {
                width: "16",
                height: "16",
                viewBox: "0 0 16 16",
                fill: "none",
                className: u("text-[var(--Object-Medium-Emphasis)] transition-transform", m && "rotate-180"),
                "aria-hidden": !0,
                children: /* @__PURE__ */ n("path", { d: "M4 6L8 10L12 6", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })
              }
            )
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ f(
      at,
      {
        className: "w-[var(--radix-popover-trigger-width)] p-0",
        align: "start",
        onOpenAutoFocus: (N) => {
          N.preventDefault(), b.current?.focus();
        },
        children: [
          /* @__PURE__ */ f("div", { className: "flex items-center border-b border-[var(--Border-Low-Emphasis)] px-3 gap-2", children: [
            /* @__PURE__ */ f("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", className: "text-[var(--Object-Low-Emphasis)] shrink-0", "aria-hidden": !0, children: [
              /* @__PURE__ */ n("circle", { cx: "7", cy: "7", r: "5", stroke: "currentColor", strokeWidth: "1.5" }),
              /* @__PURE__ */ n("path", { d: "M11 11L14 14", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" })
            ] }),
            /* @__PURE__ */ n(
              "input",
              {
                ref: b,
                value: p,
                onChange: (N) => v(N.target.value),
                placeholder: o,
                className: "flex h-10 flex-1 bg-transparent outline-none typo-body-md text-[var(--Text-High-Emphasis)] placeholder:text-[var(--Text-Low-Emphasis)]"
              }
            )
          ] }),
          /* @__PURE__ */ n("div", { role: "listbox", "aria-multiselectable": "true", className: "max-h-60 overflow-y-auto p-1", children: g.length === 0 ? /* @__PURE__ */ n("div", { className: "py-6 text-center typo-body-sm text-[var(--Text-Low-Emphasis)]", children: s }) : g.map((N) => {
            const k = t.includes(N.value);
            return /* @__PURE__ */ f(
              "button",
              {
                role: "option",
                "aria-selected": k,
                disabled: N.disabled,
                onClick: () => w(N.value),
                className: u(
                  "relative flex w-full cursor-default items-center gap-3 rounded-sm py-2 px-3 typo-body-md outline-none transition-colors text-left",
                  "hover:bg-[var(--Surface-Secondary)] focus:bg-[var(--Surface-Secondary)]",
                  "disabled:pointer-events-none disabled:opacity-50"
                ),
                children: [
                  /* @__PURE__ */ n("span", { className: u(
                    "flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
                    k ? "bg-[var(--Brand-Primary)] border-[var(--Brand-Primary)] text-white" : "border-[var(--Border-Medium-Emphasis)]"
                  ), children: k && /* @__PURE__ */ n("svg", { width: "10", height: "10", viewBox: "0 0 10 10", fill: "none", children: /* @__PURE__ */ n("path", { d: "M8.5 2L4 7L1.5 4.5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) }) }),
                  N.label
                ]
              },
              N.value
            );
          }) })
        ]
      }
    )
  ] });
}
function Ju({ className: e, ...t }) {
  return /* @__PURE__ */ n("nav", { role: "navigation", "aria-label": "ページネーション", "data-slot": "pagination", className: u("mx-auto flex w-full justify-center", e), ...t });
}
function ef({ className: e, ...t }) {
  return /* @__PURE__ */ n("ul", { "data-slot": "pagination-content", className: u("flex flex-row items-center gap-1", e), ...t });
}
function tf({ ...e }) {
  return /* @__PURE__ */ n("li", { "data-slot": "pagination-item", ...e });
}
function Ya({ className: e, isActive: t, size: r = "icon", ...a }) {
  return /* @__PURE__ */ n(
    "a",
    {
      "aria-current": t ? "page" : void 0,
      "data-slot": "pagination-link",
      className: u(
        vt({
          variant: t ? "default" : "ghost",
          size: r
        }),
        e
      ),
      ...a
    }
  );
}
function rf({ className: e, label: t = "前へ", ...r }) {
  return /* @__PURE__ */ f(
    Ya,
    {
      "aria-label": t,
      size: "default",
      className: u("gap-1 pl-2.5", e),
      ...r,
      children: [
        /* @__PURE__ */ n("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ n("path", { d: "M10 12L6 8L10 4", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }),
        /* @__PURE__ */ n("span", { children: t })
      ]
    }
  );
}
function af({ className: e, label: t = "次へ", ...r }) {
  return /* @__PURE__ */ f(
    Ya,
    {
      "aria-label": t,
      size: "default",
      className: u("gap-1 pr-2.5", e),
      ...r,
      children: [
        /* @__PURE__ */ n("span", { children: t }),
        /* @__PURE__ */ n("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ n("path", { d: "M6 4L10 8L6 12", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) })
      ]
    }
  );
}
function nf({ className: e, label: t = "その他のページ", ...r }) {
  return /* @__PURE__ */ f("span", { "aria-hidden": !0, "data-slot": "pagination-ellipsis", className: u("flex size-10 items-center justify-center", e), ...r, children: [
    /* @__PURE__ */ f("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", children: [
      /* @__PURE__ */ n("circle", { cx: "3", cy: "8", r: "1", fill: "currentColor" }),
      /* @__PURE__ */ n("circle", { cx: "8", cy: "8", r: "1", fill: "currentColor" }),
      /* @__PURE__ */ n("circle", { cx: "13", cy: "8", r: "1", fill: "currentColor" })
    ] }),
    /* @__PURE__ */ n("span", { className: "sr-only", children: t })
  ] });
}
function of({ className: e, value: t, ...r }) {
  return /* @__PURE__ */ n(
    dr.Root,
    {
      "data-slot": "progress",
      className: u("relative h-2 w-full overflow-hidden rounded-full bg-[var(--Surface-Tertiary)]", e),
      ...r,
      children: /* @__PURE__ */ n(
        dr.Indicator,
        {
          "data-slot": "progress-indicator",
          className: "h-full w-full flex-1 bg-[var(--Brand-Primary)] transition-all",
          style: { transform: `translateX(-${100 - (t || 0)}%)` }
        }
      )
    }
  );
}
function sf({ className: e, ...t }) {
  return /* @__PURE__ */ n(Ot.Root, { "data-slot": "radio-group", className: u("grid gap-3", e), ...t });
}
function lf({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    Ot.Item,
    {
      "data-slot": "radio-group-item",
      className: u(
        "aspect-square size-5 rounded-full border border-[var(--Border-Medium-Emphasis)]",
        "text-[var(--Brand-Primary)]",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:border-[var(--Brand-Primary)]",
        e
      ),
      ...t,
      children: /* @__PURE__ */ n(Ot.Indicator, { className: "flex items-center justify-center", children: /* @__PURE__ */ n("svg", { width: "10", height: "10", viewBox: "0 0 10 10", children: /* @__PURE__ */ n("circle", { cx: "5", cy: "5", r: "5", fill: "currentColor" }) }) })
    }
  );
}
function ac({ className: e, children: t, ...r }) {
  return /* @__PURE__ */ f(qe.Root, { "data-slot": "scroll-area", className: u("relative overflow-hidden", e), ...r, children: [
    /* @__PURE__ */ n(qe.Viewport, { className: "size-full rounded-[inherit]", children: t }),
    /* @__PURE__ */ n(nc, {}),
    /* @__PURE__ */ n(qe.Corner, {})
  ] });
}
function nc({
  className: e,
  orientation: t = "vertical",
  ...r
}) {
  return /* @__PURE__ */ n(
    qe.ScrollAreaScrollbar,
    {
      "data-slot": "scroll-bar",
      orientation: t,
      className: u(
        "flex touch-none select-none transition-colors",
        t === "vertical" && "h-full w-2.5 border-l border-l-transparent p-px",
        t === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-px",
        e
      ),
      ...r,
      children: /* @__PURE__ */ n(qe.ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-[var(--Border-Medium-Emphasis)]" })
    }
  );
}
const oc = se(
  "flex w-full items-center justify-between rounded-lg border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)] placeholder:text-[var(--Text-Low-Emphasis)] focus:outline-none focus:ring-[3px] focus:ring-[var(--Focus-High-Emphasis)]/50 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
  {
    variants: {
      size: {
        sm: "h-9 px-2.5 typo-body-sm",
        default: "h-12 px-3 typo-body-md",
        lg: "h-14 px-4 typo-body-md"
      }
    },
    defaultVariants: { size: "default" }
  }
);
function sc({ ...e }) {
  return /* @__PURE__ */ n(ae.Root, { "data-slot": "select", ...e });
}
function cf({ ...e }) {
  return /* @__PURE__ */ n(ae.Group, { "data-slot": "select-group", ...e });
}
function ic({ ...e }) {
  return /* @__PURE__ */ n(ae.Value, { "data-slot": "select-value", ...e });
}
function lc({ className: e, children: t, size: r, ...a }) {
  return /* @__PURE__ */ f(
    ae.Trigger,
    {
      "data-slot": "select-trigger",
      className: u(oc({ size: r }), e),
      ...a,
      children: [
        t,
        /* @__PURE__ */ n(ae.Icon, { asChild: !0, children: /* @__PURE__ */ n("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", className: "opacity-50", children: /* @__PURE__ */ n("path", { d: "M4 6L8 10L12 6", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }) })
      ]
    }
  );
}
function cc({ className: e, children: t, position: r = "popper", ...a }) {
  return /* @__PURE__ */ n(ae.Portal, { children: /* @__PURE__ */ n(
    ae.Content,
    {
      "data-slot": "select-content",
      className: u(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] shadow-[var(--shadow-lg)]",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        r === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        e
      ),
      position: r,
      ...a,
      children: /* @__PURE__ */ n(
        ae.Viewport,
        {
          className: u(
            "p-1",
            r === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children: t
        }
      )
    }
  ) });
}
function dc({ className: e, children: t, ...r }) {
  return /* @__PURE__ */ f(
    ae.Item,
    {
      "data-slot": "select-item",
      className: u(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-2 pl-8 pr-2 typo-body-md outline-none",
        "focus:bg-[var(--Surface-Secondary)] focus:text-[var(--Text-High-Emphasis)]",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        e
      ),
      ...r,
      children: [
        /* @__PURE__ */ n("span", { className: "absolute left-2 flex size-4 items-center justify-center", children: /* @__PURE__ */ n(ae.ItemIndicator, { children: /* @__PURE__ */ n("svg", { width: "12", height: "12", viewBox: "0 0 12 12", fill: "none", children: /* @__PURE__ */ n("path", { d: "M10 3L4.5 8.5L2 6", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }) }) }),
        /* @__PURE__ */ n(ae.ItemText, { children: t })
      ]
    }
  );
}
function df({ className: e, ...t }) {
  return /* @__PURE__ */ n(ae.Separator, { "data-slot": "select-separator", className: u("-mx-1 my-1 h-px bg-[var(--Border-Low-Emphasis)]", e), ...t });
}
function uf({ className: e, ...t }) {
  return /* @__PURE__ */ n(ae.Label, { "data-slot": "select-label", className: u("py-1.5 pl-8 pr-2 typo-label-sm", e), ...t });
}
function ff({
  className: e,
  orientation: t = "horizontal",
  decorative: r = !0,
  ...a
}) {
  return /* @__PURE__ */ n(
    Ln.Root,
    {
      "data-slot": "separator",
      decorative: r,
      orientation: t,
      className: u(
        "bg-[var(--Border-Low-Emphasis)] shrink-0",
        t === "horizontal" ? "h-px w-full" : "h-full w-px",
        e
      ),
      ...a
    }
  );
}
const $a = x.createContext(null), Ra = x.createContext(null);
function Va(e) {
  if (typeof e == "number") return Math.min(1, Math.max(0, e));
  const t = parseFloat(e);
  return Number.isNaN(t) || typeof window > "u" ? 0.9 : Math.min(1, Math.max(0, t / window.innerHeight));
}
function Zt({
  snapPoints: e,
  activeSnapPoint: t,
  setActiveSnapPoint: r,
  fadeFromIndex: a,
  dismissible: o = !0,
  overlay: s = !0,
  onOpenChange: l,
  open: i,
  ...c
}) {
  const d = x.useMemo(
    () => (e ?? []).map(Va),
    [e]
  ), m = t !== void 0, h = e?.[0] ?? null, [p, v] = x.useState(h), b = m ? t : p, g = x.useCallback(
    (M) => {
      m || v(M), r?.(M);
    },
    [m, r]
  );
  x.useEffect(() => {
    i && !m && e && e.length > 0 && v(e[0]);
  }, [i]);
  const w = x.useCallback(
    (M) => {
      !M && !m && e && e.length > 0 && v(e[0]), l?.(M);
    },
    [l, e, m]
  ), y = x.useMemo(() => !e || e.length === 0 ? null : {
    snapPoints: e,
    snapRatios: d,
    activeSnapPoint: b,
    setActiveSnapPoint: g,
    dismissible: o,
    fadeFromIndex: a ?? 0,
    overlay: s,
    close: () => w(!1)
  }, [
    e,
    d,
    b,
    g,
    o,
    a,
    s,
    w
  ]), S = x.useMemo(
    () => ({ close: () => w(!1) }),
    [w]
  );
  return /* @__PURE__ */ n(Ra.Provider, { value: S, children: /* @__PURE__ */ n($a.Provider, { value: y, children: /* @__PURE__ */ n(
    $.Root,
    {
      "data-slot": "sheet",
      open: i,
      onOpenChange: w,
      ...c
    }
  ) }) });
}
function uc({ ...e }) {
  return /* @__PURE__ */ n($.Trigger, { "data-slot": "sheet-trigger", ...e });
}
function fc({ ...e }) {
  return /* @__PURE__ */ n($.Close, { "data-slot": "sheet-close", ...e });
}
function Kt({ ...e }) {
  return /* @__PURE__ */ n($.Portal, { "data-slot": "sheet-portal", ...e });
}
function Jt({
  className: e,
  glass: t = !1,
  opacity: r,
  style: a,
  ...o
}) {
  const s = r != null;
  return /* @__PURE__ */ n(
    $.Overlay,
    {
      "data-slot": "sheet-overlay",
      className: u(
        // Overlay sits *under* SheetContent (z-50). Using z-40 prevents
        // the glass scrim from covering the sheet content.
        "fixed inset-0 z-40",
        // For "glass" sheets, the sheet itself provides the frosted-glass
        // visual via its own backdrop-filter. Doubling that with a blurred
        // overlay washes out the sheet completely. Use a subtle dark scrim
        // (no backdrop blur) instead — the glass sheet on top reads clearly.
        t ? "bg-black/30" : "bg-black/40",
        // When opacity is not controlled, fall back to a simple opacity
        // transition (no fade-in-0 keyframes which can leave the layer
        // permanently at opacity 0 in some Tailwind / animate plugin combos).
        !s && "transition-opacity duration-200",
        e
      ),
      style: s ? { ...a, opacity: r } : a,
      ...o
    }
  );
}
function qa() {
  return /* @__PURE__ */ n("div", { className: "flex justify-center pt-2.5 pb-1 flex-shrink-0", children: /* @__PURE__ */ n("div", { className: "w-9 h-[5px] rounded-full bg-[var(--Object-Disable)] opacity-50" }) });
}
const Ga = se(
  "fixed z-50 shadow-[var(--shadow-dialog)] transition ease-in-out",
  {
    variants: {
      side: {
        top: [
          "inset-x-0 top-0 border-b border-[var(--Border-Low-Emphasis)]",
          "bg-[var(--Surface-Primary)]",
          "data-[state=open]:animate-in data-[state=open]:slide-in-from-top data-[state=open]:duration-200",
          "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top data-[state=closed]:duration-150"
        ].join(" "),
        bottom: [
          "inset-x-0 bottom-0 rounded-t-[32px]",
          "bg-[var(--Surface-Primary)]"
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
        /**
         * フローティングボトムシート
         * 左右・下に余白を持つカード型。モバイルの入力シートに最適。
         */
        float: [
          "inset-x-3 bottom-3 rounded-[32px] max-w-lg mx-auto",
          "bg-[var(--Surface-Primary)]"
        ].join(" "),
        /**
         * Liquid Glass フローティングシート
         * 背景が透けるガラス素材。写真・グラデーション上での
         * アクション確認シートに最適。
         */
        "float-glass": [
          "inset-x-3 bottom-3 rounded-[32px] max-w-lg mx-auto",
          "glass glass-specular"
        ].join(" "),
        /**
         * Liquid Glass ボトムシート
         * 下から全幅で出るガラス素材シート。
         */
        "bottom-glass": [
          "inset-x-0 bottom-0 rounded-t-[32px]",
          "glass-strong"
        ].join(" ")
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
), hc = /* @__PURE__ */ new Set(["float-glass", "bottom-glass"]), mc = /* @__PURE__ */ new Set(["bottom", "bottom-glass"]);
function er({
  className: e,
  children: t,
  side: r = "right",
  glassOverlay: a,
  container: o,
  padding: s = !0,
  swipeToClose: l,
  description: i,
  ...c
}) {
  const d = x.useId(), m = i != null && i !== !1, h = m ? d : c["aria-describedby"], p = x.useContext($a), v = a ?? hc.has(r);
  return p && r === "bottom" ? /* @__PURE__ */ n(
    vc,
    {
      snapCtx: p,
      className: e,
      glassOverlay: v,
      container: o,
      description: i,
      ...c,
      children: t
    }
  ) : l && mc.has(r) ? /* @__PURE__ */ n(
    pc,
    {
      side: r,
      className: e,
      glassOverlay: v,
      container: o,
      padding: s,
      description: i,
      ...c,
      children: t
    }
  ) : /* @__PURE__ */ f(Kt, { container: o, children: [
    /* @__PURE__ */ n(Jt, { glass: v }),
    /* @__PURE__ */ f(
      $.Content,
      {
        "data-slot": "sheet-content",
        "data-side": r,
        className: u(Ga({ side: r }), s && "p-6", e),
        ...c,
        "aria-describedby": h,
        children: [
          m && /* @__PURE__ */ n($.Description, { id: d, className: "sr-only", children: i }),
          t
        ]
      }
    )
  ] });
}
function pc({
  side: e,
  className: t,
  glassOverlay: r,
  container: a,
  padding: o = !0,
  description: s,
  children: l,
  style: i,
  ...c
}) {
  const d = x.useId(), m = s != null && s !== !1, h = m ? d : c["aria-describedby"], p = x.useContext(Ra), [v, b] = x.useState(0), [g, w] = x.useState(!1), y = x.useRef(0), S = x.useRef(null), M = (C) => {
    if (!(C.button != null && C.button !== 0)) {
      w(!0), y.current = C.clientY;
      try {
        C.currentTarget.setPointerCapture(C.pointerId);
      } catch {
      }
    }
  }, N = (C) => {
    if (!g) return;
    const E = C.clientY - y.current;
    b(Math.max(0, E));
  }, k = () => {
    if (!g) return;
    w(!1);
    const C = S.current?.offsetHeight ?? 0, E = C > 0 ? C * 0.3 : 200;
    v > E && p?.close(), b(0);
  };
  return /* @__PURE__ */ f(Kt, { container: a, children: [
    /* @__PURE__ */ n(Jt, { glass: r }),
    /* @__PURE__ */ f(
      $.Content,
      {
        ref: S,
        "data-slot": "sheet-content",
        "data-side": e,
        className: u(Ga({ side: e }), o && "p-6", t),
        style: {
          ...i,
          transform: `translate3d(0, ${v}px, 0)`,
          transition: g ? "none" : "transform 280ms cubic-bezier(0.32, 0.72, 0, 1)",
          willChange: "transform"
        },
        ...c,
        "aria-describedby": h,
        children: [
          m && /* @__PURE__ */ n($.Description, { id: d, className: "sr-only", children: s }),
          /* @__PURE__ */ n(
            "div",
            {
              onPointerDown: M,
              onPointerMove: N,
              onPointerUp: k,
              onPointerCancel: k,
              className: u(
                "cursor-grab active:cursor-grabbing select-none",
                // Pull the indicator row out of the sheet's own padding so it
                // sits flush against the top edge, matching the snap-mode layout.
                o && "-mx-6 -mt-6"
              ),
              style: { touchAction: "none" },
              children: /* @__PURE__ */ n(qa, {})
            }
          ),
          l
        ]
      }
    )
  ] });
}
function vc({
  snapCtx: e,
  className: t,
  glassOverlay: r,
  container: a,
  description: o,
  children: s,
  style: l,
  ...i
}) {
  const c = x.useId(), d = o != null && o !== !1, m = d ? c : i["aria-describedby"], {
    snapRatios: h,
    activeSnapPoint: p,
    setActiveSnapPoint: v,
    dismissible: b,
    close: g,
    snapPoints: w,
    fadeFromIndex: y,
    overlay: S
  } = e, M = x.useMemo(
    () => h.length > 0 ? Math.max(...h) : 0.9,
    [h]
  ), N = x.useMemo(
    () => h.length > 0 ? Math.min(...h) : 0.4,
    [h]
  ), k = x.useMemo(() => p == null ? M : Va(p), [p, M]), [C, E] = x.useState(!1), W = x.useRef(0), P = x.useRef(k), L = x.useRef(null), K = (M - k) / M * 100, J = (z) => {
    if (!(z.button != null && z.button !== 0)) {
      E(!0), W.current = z.clientY, P.current = k;
      try {
        z.currentTarget.setPointerCapture(z.pointerId);
      } catch {
      }
    }
  }, ie = (z) => {
    if (!C) return;
    const Y = z.clientY - W.current, V = typeof window > "u" ? 1 : window.innerHeight, X = Math.max(
      0,
      Math.min(M, P.current - Y / V)
    );
    v(X);
  }, Z = (z) => {
    if (!C) return;
    E(!1);
    const Y = k;
    if (b && Y < N * 0.5) {
      g();
      return;
    }
    let V = 0, X = Math.abs(Y - h[0]);
    for (let we = 1; we < h.length; we++) {
      const De = Math.abs(Y - h[we]);
      De < X && (X = De, V = we);
    }
    v(w[V]);
  }, ye = x.useMemo(() => {
    if (h.length === 0) return 1;
    const z = h[Math.min(y, h.length - 1)];
    return k <= z ? 0 : M <= z ? 1 : Math.min(1, (k - z) / (M - z));
  }, [h, y, k, M]), Ee = `translate3d(0, ${K}%, 0)`, _e = (z) => {
    if (z.key !== "ArrowUp" && z.key !== "ArrowDown") return;
    const Y = h.findIndex((X) => X === k);
    if (Y === -1) return;
    const V = z.key === "ArrowUp" ? Math.min(h.length - 1, Y + 1) : Math.max(0, Y - 1);
    V !== Y && (z.preventDefault(), v(w[V]));
  };
  return /* @__PURE__ */ f(Kt, { container: a, children: [
    S && /* @__PURE__ */ n(Jt, { glass: r, opacity: ye }),
    /* @__PURE__ */ f(
      $.Content,
      {
        ref: L,
        "data-slot": "sheet-content",
        "data-side": "bottom",
        "data-snap-active": p ?? void 0,
        onKeyDown: _e,
        className: u(
          "fixed inset-x-0 bottom-0 z-50 flex flex-col",
          "bg-[var(--Surface-Primary)] rounded-t-[32px] shadow-[var(--shadow-dialog)]",
          // Suppress Radix open/close fade — we manage transform ourselves
          "data-[state=open]:animate-none data-[state=closed]:animate-none",
          "outline-none",
          t
        ),
        style: {
          ...l,
          height: `${M * 100}svh`,
          transform: Ee,
          transition: C ? "none" : "transform 320ms cubic-bezier(0.32, 0.72, 0, 1)",
          willChange: "transform",
          touchAction: "none"
        },
        ...i,
        "aria-describedby": m,
        children: [
          d && /* @__PURE__ */ n($.Description, { id: c, className: "sr-only", children: o }),
          /* @__PURE__ */ n(
            "div",
            {
              onPointerDown: J,
              onPointerMove: ie,
              onPointerUp: Z,
              onPointerCancel: Z,
              className: "cursor-grab active:cursor-grabbing select-none",
              children: /* @__PURE__ */ n(qa, {})
            }
          ),
          /* @__PURE__ */ n(
            "div",
            {
              className: "flex-1 min-h-0 overflow-y-auto",
              style: {
                maxHeight: `calc(${k * 100}svh - 22px)`,
                transition: C ? "none" : "max-height 320ms cubic-bezier(0.32, 0.72, 0, 1)"
              },
              children: s
            }
          )
        ]
      }
    )
  ] });
}
function tr({ className: e, ...t }) {
  return /* @__PURE__ */ n("div", { "data-slot": "sheet-header", className: u("flex flex-col gap-2", e), ...t });
}
function hf({ className: e, ...t }) {
  return /* @__PURE__ */ n("div", { "data-slot": "sheet-footer", className: u("flex flex-col gap-2 mt-auto", e), ...t });
}
function rr({ className: e, ...t }) {
  return /* @__PURE__ */ n($.Title, { "data-slot": "sheet-title", className: u("typo-heading-lg text-[var(--Text-High-Emphasis)]", e), ...t });
}
function Ua({ className: e, ...t }) {
  return /* @__PURE__ */ n($.Description, { "data-slot": "sheet-description", className: u("typo-body-md text-[var(--Text-Medium-Emphasis)]", e), ...t });
}
const bc = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full"
};
function Ve({ className: e, width: t, height: r, rounded: a = "lg", style: o, ...s }) {
  const l = { ...o };
  return t !== void 0 && (l.width = typeof t == "number" ? `${t}px` : t), r !== void 0 && (l.height = typeof r == "number" ? `${r}px` : r), /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "skeleton",
      "aria-hidden": "true",
      style: l,
      className: u("animate-pulse bg-[var(--Surface-Tertiary)]", bc[a], e),
      ...s
    }
  );
}
function mf({
  rows: e = 5,
  hasFilter: t = !0,
  loadingLabel: r = "Loading...",
  className: a,
  rowHeight: o = 56
}) {
  return /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "list-skeleton",
      className: u("animate-fade-in px-4 pt-3", a),
      "aria-busy": "true",
      "aria-label": r,
      children: [
        t && /* @__PURE__ */ f("div", { className: "flex gap-2 mb-3", children: [
          /* @__PURE__ */ n(Ve, { width: 80, height: 36, rounded: "full" }),
          /* @__PURE__ */ n(Ve, { width: 80, height: 36, rounded: "full" }),
          /* @__PURE__ */ n(Ve, { width: 80, height: 36, rounded: "full" })
        ] }),
        /* @__PURE__ */ n("div", { className: "space-y-2", children: Array.from({ length: e }).map((s, l) => /* @__PURE__ */ n(Ve, { width: "100%", height: o, rounded: "2xl" }, l)) })
      ]
    }
  );
}
function pf({
  rows: e = 3,
  columns: t = 2,
  cardHeight: r = 140,
  loadingLabel: a = "Loading...",
  className: o
}) {
  const s = t === 1 ? "grid-cols-1" : t === 2 ? "grid-cols-2" : t === 3 ? "grid-cols-3" : t === 4 ? "grid-cols-4" : "grid-cols-2";
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "grid-skeleton",
      className: u("animate-fade-in px-4 pt-3", o),
      "aria-busy": "true",
      "aria-label": a,
      children: /* @__PURE__ */ n("div", { className: u("grid gap-3", s), children: Array.from({ length: e * t }).map((l, i) => /* @__PURE__ */ n(Ve, { width: "100%", height: r, rounded: "2xl" }, i)) })
    }
  );
}
function vf({
  className: e,
  defaultValue: t,
  value: r,
  min: a = 0,
  max: o = 100,
  ...s
}) {
  const l = x.useMemo(
    () => Array.isArray(r) ? r : Array.isArray(t) ? t : [a, o],
    [r, t, a, o]
  );
  return /* @__PURE__ */ f(
    st.Root,
    {
      "data-slot": "slider",
      defaultValue: t,
      value: r,
      min: a,
      max: o,
      className: u(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        e
      ),
      ...s,
      children: [
        /* @__PURE__ */ n(
          st.Track,
          {
            "data-slot": "slider-track",
            className: "relative grow overflow-hidden rounded-full bg-[var(--Surface-Tertiary)] data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
            children: /* @__PURE__ */ n(
              st.Range,
              {
                "data-slot": "slider-range",
                className: "absolute bg-[var(--Brand-Primary)] data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
              }
            )
          }
        ),
        Array.from({ length: l.length }, (i, c) => /* @__PURE__ */ n(
          st.Thumb,
          {
            "data-slot": "slider-thumb",
            className: "block size-5 shrink-0 rounded-full border-2 border-[var(--Brand-Primary)] bg-[var(--Surface-Primary)] shadow-sm ring-[var(--Brand-Primary)]/20 transition-[color,box-shadow,transform] hover:ring-4 hover:scale-125 focus-visible:ring-4 focus-visible:outline-hidden active:scale-110 active:ring-6 active:shadow-md disabled:pointer-events-none disabled:opacity-50"
          },
          c
        ))
      ]
    }
  );
}
function bf({ className: e, size: t = "md", label: r = "読み込み中", ...a }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "spinner",
      role: "status",
      "aria-label": r,
      className: u(
        "animate-spin rounded-full border-[var(--Border-Medium-Emphasis)] border-t-[var(--Brand-Primary)]",
        {
          sm: "size-4 border-2",
          md: "size-8 border-[3px]",
          lg: "size-12 border-4"
        }[t],
        e
      ),
      ...a,
      children: /* @__PURE__ */ n("span", { className: "sr-only", children: r })
    }
  );
}
function gf({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    ur.Root,
    {
      "data-slot": "switch",
      className: u(
        "peer inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent shadow-sm transition-colors",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-[var(--Brand-Primary)] data-[state=unchecked]:bg-[var(--Surface-Quaternary)]",
        e
      ),
      ...t,
      children: /* @__PURE__ */ n(
        ur.Thumb,
        {
          "data-slot": "switch-thumb",
          className: u(
            "pointer-events-none block size-5 rounded-full bg-[var(--Surface-Primary)] shadow-lg ring-0 transition-transform",
            "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
          )
        }
      )
    }
  );
}
function xf({ className: e, ...t }) {
  return /* @__PURE__ */ n(pt.Root, { "data-slot": "tabs", className: u("flex flex-col gap-2", e), ...t });
}
function yf({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    pt.List,
    {
      "data-slot": "tabs-list",
      className: u(
        "inline-flex w-fit h-10 items-center gap-1 rounded-lg bg-[var(--Surface-Tertiary)] p-1 text-[var(--Text-Medium-Emphasis)]",
        e
      ),
      ...t
    }
  );
}
function wf({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    pt.Trigger,
    {
      "data-slot": "tabs-trigger",
      className: u(
        "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 typo-label-sm transition-all",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-[state=active]:bg-[var(--Surface-Primary)] data-[state=active]:text-[var(--Text-High-Emphasis)] data-[state=active]:shadow-sm",
        e
      ),
      ...t
    }
  );
}
function kf({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    pt.Content,
    {
      "data-slot": "tabs-content",
      className: u("mt-2 focus-visible:outline-none", e),
      ...t
    }
  );
}
function gc({ className: e, autoGrow: t, onChange: r, ...a }) {
  const o = x.useRef(null), s = x.useCallback(() => {
    const i = o.current;
    i && (i.style.height = "auto", i.style.height = `${i.scrollHeight}px`);
  }, []);
  x.useEffect(() => {
    t && s();
  }, [t, s, a.value, a.defaultValue]);
  const l = x.useCallback(
    (i) => {
      t && s(), r?.(i);
    },
    [t, s, r]
  );
  return /* @__PURE__ */ n(
    "textarea",
    {
      ref: o,
      "data-slot": "textarea",
      className: u(
        "flex min-h-[80px] w-full rounded-lg border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] px-3 py-2 typo-body-md text-[var(--Text-High-Emphasis)] transition-colors",
        "placeholder:text-[var(--Text-Low-Emphasis)]",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50 focus-visible:border-[var(--Border-Accent-Primary)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-[var(--Border-Caution)]",
        t && "resize-none overflow-hidden",
        e
      ),
      onChange: l,
      ...a
    }
  );
}
function Nf({
  value: e,
  onChange: t,
  placeholder: r,
  minRows: a = 3,
  maxLength: o,
  className: s,
  ...l
}) {
  const i = x.useRef(null), c = x.useCallback(() => {
    const h = i.current;
    if (!h) return;
    h.style.height = "auto";
    const p = window.getComputedStyle(h), v = parseFloat(p.lineHeight) || 20, b = v * a + (parseFloat(p.paddingTop) || 0) + (parseFloat(p.paddingBottom) || 0), g = Math.max(h.scrollHeight + v, b);
    h.style.height = g + "px";
  }, [a]);
  x.useEffect(() => {
    c();
  }, [e, c]), x.useEffect(() => {
    const h = () => c();
    return window.addEventListener("resize", h), () => window.removeEventListener("resize", h);
  }, [c]);
  const d = o != null && o > 0 ? e.length / o : 0, m = o != null ? e.length >= o ? "text-[var(--Text-Caution)]" : d >= 0.7 ? "text-[var(--Text-Warning)]" : "text-[var(--Text-Low-Emphasis)]" : "";
  return /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "auto-grow-textarea",
      "data-has-counter": o != null || void 0,
      className: "relative",
      children: [
        /* @__PURE__ */ n(
          gc,
          {
            ref: i,
            value: e,
            onChange: (h) => t(h.target.value),
            placeholder: r,
            rows: a,
            maxLength: o,
            className: u(
              "w-full resize-none overflow-hidden",
              o != null && "pr-16",
              s
            ),
            ...l
          }
        ),
        o != null && /* @__PURE__ */ f(
          "span",
          {
            "aria-hidden": "true",
            "data-slot": "auto-grow-textarea-counter",
            className: u(
              "absolute right-2 bottom-2 typo-body-xs tabular-nums pointer-events-none select-none",
              m
            ),
            children: [
              e.length,
              " / ",
              o
            ]
          }
        )
      ]
    }
  );
}
function xc({ delayDuration: e = 0, ...t }) {
  return /* @__PURE__ */ n(Xe.Provider, { "data-slot": "tooltip-provider", delayDuration: e, ...t });
}
function Sf({ ...e }) {
  return /* @__PURE__ */ n(xc, { children: /* @__PURE__ */ n(Xe.Root, { "data-slot": "tooltip", ...e }) });
}
function Mf({ ...e }) {
  return /* @__PURE__ */ n(Xe.Trigger, { "data-slot": "tooltip-trigger", ...e });
}
function Cf({ className: e, sideOffset: t = 4, children: r, ...a }) {
  return /* @__PURE__ */ n(Xe.Portal, { children: /* @__PURE__ */ n(
    Xe.Content,
    {
      "data-slot": "tooltip-content",
      sideOffset: t,
      className: u(
        "z-50 overflow-hidden rounded-lg bg-[var(--Surface-Inverse)] px-3 py-1.5 typo-body-sm text-[var(--Text-on-Inverse)] shadow-[var(--shadow-tooltip)]",
        "animate-in fade-in-0 zoom-in-95",
        e
      ),
      ...a,
      children: r
    }
  ) });
}
const yc = {
  sm: { size: 32, stroke: 3 },
  md: { size: 48, stroke: 4 },
  lg: { size: 64, stroke: 5 },
  xl: { size: 96, stroke: 6 }
};
function Tf({
  value: e,
  size: t = "md",
  label: r,
  showLabel: a = !0,
  className: o
}) {
  const { size: s, stroke: l } = yc[t], i = (s - l) / 2, c = 2 * Math.PI * i, d = Math.min(100, Math.max(0, e)), m = c * (1 - d / 100);
  return /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "progress-ring",
      className: u("relative inline-flex items-center justify-center", o),
      style: { width: s, height: s },
      role: "progressbar",
      "aria-valuenow": d,
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      children: [
        /* @__PURE__ */ f("svg", { width: s, height: s, className: "-rotate-90", children: [
          /* @__PURE__ */ n(
            "circle",
            {
              cx: s / 2,
              cy: s / 2,
              r: i,
              fill: "none",
              stroke: "var(--Border-Low-Emphasis)",
              strokeWidth: l
            }
          ),
          /* @__PURE__ */ n(
            "circle",
            {
              cx: s / 2,
              cy: s / 2,
              r: i,
              fill: "none",
              stroke: "var(--Brand-Primary)",
              strokeWidth: l,
              strokeLinecap: "round",
              strokeDasharray: c,
              strokeDashoffset: m,
              style: { transition: "stroke-dashoffset 0.4s ease" }
            }
          )
        ] }),
        a && /* @__PURE__ */ n(
          "span",
          {
            className: u(
              "absolute inset-0 flex items-center justify-center",
              t === "sm" ? "typo-label-xs" : t === "md" ? "typo-label-sm" : "typo-label-md",
              "text-[var(--Text-High-Emphasis)] font-semibold"
            ),
            children: r ?? `${Math.round(d)}%`
          }
        )
      ]
    }
  );
}
const wc = {
  sm: { wrap: "h-9 gap-2", btn: "w-8 h-8", icon: 14, text: "typo-label-sm w-8" },
  md: { wrap: "h-12 gap-3", btn: "w-10 h-10", icon: 16, text: "typo-body-md w-10" }
};
function Ef({
  value: e = 0,
  onChange: t,
  min: r = -1 / 0,
  max: a = 1 / 0,
  step: o = 1,
  format: s,
  placeholder: l = "0",
  disabled: i = !1,
  size: c = "md",
  className: d,
  decrementLabel: m = "減らす",
  incrementLabel: h = "増やす"
}) {
  const [p, v] = x.useState(String(e)), [b, g] = x.useState(!1);
  x.useEffect(() => {
    b || v(String(e));
  }, [e, b]);
  const w = (C) => {
    const E = parseFloat(C.replace(/[^0-9.-]/g, ""));
    if (isNaN(E)) {
      v(String(e));
      return;
    }
    const W = Math.min(a, Math.max(r, E));
    v(String(W)), t?.(W);
  }, y = () => {
    const C = Math.min(a, e + o);
    v(String(C)), t?.(C);
  }, S = () => {
    const C = Math.max(r, e - o);
    v(String(C)), t?.(C);
  }, M = b ? p : s ? s(e) : p, N = wc[c], k = u(
    "flex items-center justify-center rounded-full border shrink-0 transition-colors select-none",
    N.btn,
    "border-[var(--Border-Medium-Emphasis)] text-[var(--Object-Medium-Emphasis)]",
    "hover:border-[var(--Brand-Primary)] hover:text-[var(--Brand-Primary)] hover:bg-[var(--Brand-Ultra-Light)]",
    "active:scale-95",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[var(--Border-Medium-Emphasis)] disabled:hover:text-[var(--Object-Medium-Emphasis)] disabled:hover:bg-transparent"
  );
  return /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "number-input",
      className: u("inline-flex items-center", N.wrap, i && "opacity-50 pointer-events-none", d),
      children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            tabIndex: -1,
            disabled: i || e <= r,
            onClick: S,
            "aria-label": m,
            className: k,
            children: /* @__PURE__ */ n("svg", { width: N.icon, height: N.icon, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ n("path", { d: "M3 8h10", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }) })
          }
        ),
        /* @__PURE__ */ n(
          "input",
          {
            type: "text",
            inputMode: "decimal",
            value: M,
            placeholder: l,
            disabled: i,
            onChange: (C) => v(C.target.value),
            onFocus: () => {
              g(!0), v(String(e));
            },
            onBlur: (C) => {
              g(!1), w(C.target.value);
            },
            onKeyDown: (C) => {
              C.key === "Enter" && C.target.blur(), C.key === "ArrowUp" && (C.preventDefault(), y()), C.key === "ArrowDown" && (C.preventDefault(), S());
            },
            className: u(
              "text-center bg-transparent outline-none text-[var(--Text-High-Emphasis)] placeholder:text-[var(--Text-Low-Emphasis)] tabular-nums",
              N.text
            )
          }
        ),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            tabIndex: -1,
            disabled: i || e >= a,
            onClick: y,
            "aria-label": h,
            className: k,
            children: /* @__PURE__ */ n("svg", { width: N.icon, height: N.icon, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ n("path", { d: "M8 3v10M3 8h10", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }) })
          }
        )
      ]
    }
  );
}
const kc = {
  sm: "h-8 px-3 typo-label-xs gap-1",
  md: "h-9 px-4 typo-label-sm gap-1.5"
};
function Df({
  options: e,
  value: t,
  onChange: r,
  size: a = "md",
  className: o
}) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "pill-toggle",
      role: "group",
      className: u(
        "inline-flex items-center rounded-full p-0.5",
        "bg-[var(--Surface-Tertiary)]",
        o
      ),
      children: e.map((s) => {
        const l = s.value === t;
        return /* @__PURE__ */ f(
          "button",
          {
            type: "button",
            role: "radio",
            "aria-checked": l,
            onClick: () => r(s.value),
            className: u(
              "inline-flex items-center justify-center rounded-full transition-all",
              kc[a],
              l ? "bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)] shadow-sm font-medium" : "text-[var(--Text-Medium-Emphasis)] hover:text-[var(--Text-High-Emphasis)]"
            ),
            children: [
              s.icon && /* @__PURE__ */ n("span", { className: "shrink-0", children: s.icon }),
              s.label
            ]
          },
          s.value
        );
      })
    }
  );
}
const Nc = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8"
}, Sc = {
  sm: "typo-label-xs",
  md: "typo-label-sm",
  lg: "typo-label-md",
  xl: "typo-label-lg"
};
function Mc({ filled: e, half: t, className: r }) {
  return t ? /* @__PURE__ */ f("svg", { viewBox: "0 0 24 24", className: r, "aria-hidden": !0, children: [
    /* @__PURE__ */ n("defs", { children: /* @__PURE__ */ f("linearGradient", { id: "half-fill", children: [
      /* @__PURE__ */ n("stop", { offset: "50%", stopColor: "currentColor" }),
      /* @__PURE__ */ n("stop", { offset: "50%", stopColor: "transparent" })
    ] }) }),
    /* @__PURE__ */ n(
      "path",
      {
        d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
        fill: "url(#half-fill)",
        stroke: "currentColor",
        strokeWidth: "1.5",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    )
  ] }) : /* @__PURE__ */ n("svg", { viewBox: "0 0 24 24", className: r, "aria-hidden": !0, children: /* @__PURE__ */ n(
    "path",
    {
      d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
      fill: e ? "currentColor" : "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }
  ) });
}
function Pf({
  value: e,
  onChange: t,
  max: r = 5,
  size: a = "md",
  showLabel: o = !1,
  className: s
}) {
  const [l, i] = x.useState(null), c = !!t, d = l ?? e;
  return /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "star-rating",
      role: c ? "radiogroup" : void 0,
      "aria-label": c ? "評価" : `${e}/${r}点`,
      className: u("inline-flex items-center gap-0.5", s),
      children: [
        Array.from({ length: r }, (m, h) => {
          const p = h + 1, v = d >= p, b = !v && d >= p - 0.5;
          return /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              role: c ? "radio" : void 0,
              "aria-checked": c ? e === p : void 0,
              "aria-label": c ? `${p}点` : void 0,
              disabled: !c,
              onClick: () => t?.(p),
              onMouseEnter: () => c && i(p),
              onMouseLeave: () => c && i(null),
              className: u(
                "transition-colors text-[var(--Brand-Primary)]",
                Nc[a],
                c ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default pointer-events-none",
                !v && !b && "text-[var(--Border-Medium-Emphasis)]"
              ),
              children: /* @__PURE__ */ n(
                Mc,
                {
                  filled: v,
                  half: b,
                  className: "w-full h-full"
                }
              )
            },
            h
          );
        }),
        o && /* @__PURE__ */ f("span", { className: u("ml-1 text-[var(--Text-Medium-Emphasis)]", Sc[a]), children: [
          e,
          "/",
          r
        ] })
      ]
    }
  );
}
function ze(e) {
  return String(e).padStart(2, "0");
}
function Ir(e) {
  const t = Math.max(0, e.getTime() - Date.now()), r = Math.floor(t / 1e3), a = Math.floor(r / 3600), o = Math.floor(r % 3600 / 60), s = r % 60;
  return { h: a, m: o, s, totalSec: r };
}
function Bf({
  targetDate: e,
  beforeLabel: t,
  label: r = "残り",
  endedLabel: a = "受付終了",
  variant: o = "filled",
  compact: s = !1,
  className: l,
  onEnd: i,
  hourUnit: c = "時間",
  minuteUnit: d = "分",
  secondUnit: m = "秒"
}) {
  const [h, p] = x.useState(() => Ir(e)), [v, b] = x.useState(() => {
    const k = Date.now();
    return e.getTime() - 0, k >= e.getTime() ? "ended" : "active";
  }), g = x.useRef(!1);
  if (x.useEffect(() => {
    g.current = !1;
    const k = () => {
      const E = Ir(e);
      p(E), E.totalSec === 0 && !g.current && (g.current = !0, b("ended"), i?.());
    };
    k();
    const C = setInterval(k, 1e3);
    return () => clearInterval(C);
  }, [e, i]), v === "ended")
    return /* @__PURE__ */ f(
      "span",
      {
        "data-slot": "countdown-timer",
        "data-state": "ended",
        className: u(
          "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg",
          "bg-[var(--Surface-Tertiary)] text-[var(--Text-Low-Emphasis)]",
          "typo-label-sm",
          l
        ),
        children: [
          /* @__PURE__ */ f("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", "aria-hidden": "true", children: [
            /* @__PURE__ */ n("circle", { cx: "7", cy: "7", r: "6", stroke: "currentColor", strokeWidth: "1.5" }),
            /* @__PURE__ */ n("path", { d: "M7 4v3.5l2 2", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" })
          ] }),
          a
        ]
      }
    );
  const { h: w, m: y, s: S } = h, M = s ? [{ num: ze(y), unit: d }, { num: ze(S), unit: m }] : [
    ...w > 0 ? [{ num: ze(w), unit: c }] : [],
    { num: ze(y), unit: d },
    { num: ze(S), unit: m }
  ], N = o === "filled";
  return /* @__PURE__ */ f(
    "span",
    {
      "data-slot": "countdown-timer",
      "data-state": "active",
      "data-variant": o,
      "aria-live": "off",
      "aria-label": `${r} ${w}${c}${y}${d}${S}${m}`,
      className: u(
        "inline-flex items-center gap-1 px-3 py-2 rounded-lg font-variant-nums",
        N ? "bg-[var(--Brand-Primary)] text-white" : "border-2 border-[var(--Brand-Primary)] text-[var(--Brand-Primary)]",
        l
      ),
      children: [
        r && /* @__PURE__ */ n("span", { className: "text-[11px] font-semibold opacity-80 mr-1", children: r }),
        M.map((k, C) => /* @__PURE__ */ f(x.Fragment, { children: [
          C > 0 && /* @__PURE__ */ n("span", { className: "text-[18px] font-bold opacity-70 mb-1.5", children: ":" }),
          /* @__PURE__ */ f("span", { className: "flex flex-col items-center gap-0", children: [
            /* @__PURE__ */ n("span", { className: "text-[22px] font-black leading-none tabular-nums", children: k.num }),
            /* @__PURE__ */ n("span", { className: "text-[9px] font-semibold opacity-70 leading-none mt-0.5", children: k.unit })
          ] })
        ] }, k.unit))
      ]
    }
  );
}
function Of({
  items: e,
  value: t,
  onChange: r,
  variant: a = "underline",
  sticky: o = !1,
  className: s
}) {
  const l = x.useRef(null), i = x.useRef(null);
  return x.useEffect(() => {
    const c = l.current, d = i.current;
    if (!c || !d) return;
    const m = c.offsetLeft + c.offsetWidth / 2, h = d.clientWidth / 2;
    d.scrollTo({ left: m - h, behavior: "smooth" });
  }, [t]), a === "chip" ? /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "sub-nav",
      "data-variant": "chip",
      ref: i,
      className: u(
        "flex gap-2 overflow-x-auto scrollbar-none px-1 py-3",
        o && "sticky top-0 z-30 bg-[var(--Surface-Primary)]",
        s
      ),
      role: "tablist",
      children: e.map((c) => {
        const d = c.value === t;
        return /* @__PURE__ */ f(
          "button",
          {
            ref: d ? l : void 0,
            role: "tab",
            "aria-selected": d,
            onClick: () => r(c.value),
            className: u(
              "flex items-center gap-1.5 shrink-0 px-3.5 py-1.5 rounded-full border typo-label-sm transition-colors",
              d ? "bg-[var(--Brand-Primary)] border-[var(--Brand-Primary)] text-white font-bold" : "border-transparent bg-[var(--Surface-Tertiary)] text-[var(--Text-Medium-Emphasis)] hover:bg-[var(--Surface-Quaternary)] hover:text-[var(--Text-High-Emphasis)]"
            ),
            children: [
              c.label,
              c.badge !== void 0 && /* @__PURE__ */ n("span", { className: u(
                "inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-[10px] font-bold",
                d ? "bg-white/30 text-white" : "bg-[var(--Brand-Primary)] text-white"
              ), children: c.badge })
            ]
          },
          c.value
        );
      })
    }
  ) : /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "sub-nav",
      "data-variant": "underline",
      className: u(
        "border-b border-[var(--Border-Low-Emphasis)]",
        o && "sticky top-0 z-30 bg-[var(--Surface-Primary)]",
        s
      ),
      children: /* @__PURE__ */ n(
        "div",
        {
          ref: i,
          className: "flex overflow-x-auto scrollbar-none px-1",
          role: "tablist",
          children: e.map((c) => {
            const d = c.value === t;
            return /* @__PURE__ */ f(
              "button",
              {
                ref: d ? l : void 0,
                role: "tab",
                "aria-selected": d,
                onClick: () => r(c.value),
                className: u(
                  "flex items-center gap-1.5 shrink-0 px-4 py-3 typo-label-sm transition-colors border-b-[3px] -mb-px",
                  d ? "border-[var(--Brand-Primary)] text-[var(--Brand-Primary)] font-bold" : "border-transparent text-[var(--Text-Medium-Emphasis)] hover:text-[var(--Text-High-Emphasis)]"
                ),
                children: [
                  c.label,
                  c.badge !== void 0 && /* @__PURE__ */ n("span", { className: "inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-[10px] font-bold bg-[var(--Brand-Primary)] text-white", children: c.badge })
                ]
              },
              c.value
            );
          })
        }
      )
    }
  );
}
const Cc = {
  top: "top",
  bottom: "bottom",
  left: "left",
  right: "right"
};
function Tc({
  content: e,
  children: t,
  placement: r = "top",
  variant: a = "default",
  open: o,
  onOpenChange: s,
  step: l,
  totalSteps: i,
  onNext: c,
  showClose: d,
  onClose: m,
  delayDuration: h = 0,
  className: p
}) {
  const v = l !== void 0;
  return /* @__PURE__ */ n(Pe.Provider, { delayDuration: h, children: /* @__PURE__ */ f(Pe.Root, { open: o, onOpenChange: s, children: [
    /* @__PURE__ */ n(Pe.Trigger, { asChild: !0, children: t }),
    /* @__PURE__ */ n(Pe.Portal, { children: /* @__PURE__ */ f(
      Pe.Content,
      {
        "data-slot": "coach-mark",
        "data-variant": a,
        side: Cc[r],
        sideOffset: 8,
        className: u(
          "z-50 max-w-[240px] rounded-lg px-3 py-2 text-[12px] leading-relaxed shadow-lg",
          "data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
          a === "brand" ? "bg-[var(--Brand-Primary)] text-white" : "bg-[var(--Surface-Inverse)] text-white",
          p
        ),
        children: [
          v ? /* @__PURE__ */ f("div", { className: "flex flex-col gap-2", children: [
            i && /* @__PURE__ */ f("span", { className: "text-[10px] font-semibold opacity-70", children: [
              l,
              " / ",
              i
            ] }),
            /* @__PURE__ */ n("div", { className: "font-medium", children: e }),
            (c || d) && /* @__PURE__ */ f("div", { className: "flex items-center justify-between mt-1", children: [
              d && /* @__PURE__ */ n(
                "button",
                {
                  onClick: m,
                  className: "text-[10px] opacity-60 hover:opacity-100 transition-opacity",
                  children: "スキップ"
                }
              ),
              c && /* @__PURE__ */ n(
                "button",
                {
                  onClick: c,
                  className: "text-[11px] font-bold bg-white/20 hover:bg-white/30 px-2.5 py-0.5 rounded-md transition-colors ml-auto",
                  children: "次へ →"
                }
              )
            ] })
          ] }) : e,
          /* @__PURE__ */ n(
            Pe.Arrow,
            {
              className: u(
                a === "brand" ? "fill-[var(--Brand-Primary)]" : "fill-[var(--Surface-Inverse)]"
              ),
              width: 10,
              height: 5
            }
          )
        ]
      }
    ) })
  ] }) });
}
const ar = "ksk-coach-done", Xa = "v1";
function Lf({
  steps: e,
  open: t,
  onComplete: r,
  onSkip: a,
  variant: o = "default",
  ringColor: s = "var(--Brand-Primary)",
  maxWidth: l = 280
}) {
  const [i, c] = x.useState(0), [d, m] = x.useState(null), [h, p] = x.useState(!1);
  if (x.useEffect(() => {
    p(!0);
  }, []), x.useEffect(() => {
    if (!t) return;
    const N = e[i];
    if (!N) return;
    const k = () => {
      const W = document.querySelector(N.selector);
      m(W ? W.getBoundingClientRect() : null);
    }, C = document.querySelector(N.selector);
    C && C.scrollIntoView({ block: "center", behavior: "instant" }), k();
    const E = setTimeout(k, 100);
    return window.addEventListener("resize", k), window.addEventListener("scroll", k, !0), () => {
      clearTimeout(E), window.removeEventListener("resize", k), window.removeEventListener("scroll", k, !0);
    };
  }, [i, t, e]), !t || !e[i] || !h || typeof document > "u") return null;
  const v = e[i], b = i === e.length - 1, g = v.padding ?? 8, w = v.placement && v.placement !== "auto" ? v.placement : d && typeof window < "u" ? window.innerHeight - d.bottom > 200 ? "bottom" : "top" : "bottom", y = () => {
    b ? r() : c(i + 1);
  }, S = !!d, M = S && d ? {
    position: "fixed",
    top: Math.max(0, d.top - g),
    left: Math.max(0, d.left - g),
    width: d.width + g * 2,
    height: d.height + g * 2,
    pointerEvents: "none",
    outline: `2px solid ${s}`,
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
  return Zr(
    /* @__PURE__ */ f(
      "div",
      {
        "data-slot": "coach-mark-overlay",
        "data-step": i + 1,
        "data-total": e.length,
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Onboarding coach mark",
        children: [
          !S && /* @__PURE__ */ n(
            "div",
            {
              className: "fixed inset-0 bg-black/55 z-50 pointer-events-none",
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ n("div", { style: M }),
          /* @__PURE__ */ n(
            Tc,
            {
              content: /* @__PURE__ */ f("div", { className: u("max-w-xs"), style: { maxWidth: l }, children: [
                /* @__PURE__ */ n("p", { className: "typo-label-md text-[var(--Text-on-Inverse)] mb-1", children: v.title }),
                /* @__PURE__ */ n("p", { className: "typo-body-sm text-[var(--Text-on-Inverse)] opacity-90 whitespace-pre-line", children: v.desc })
              ] }),
              placement: w,
              variant: o,
              open: !0,
              step: i + 1,
              totalSteps: e.length,
              onNext: y,
              showClose: !!a,
              onClose: a,
              className: "!py-4 !px-4",
              children: /* @__PURE__ */ n(
                "span",
                {
                  className: "fixed pointer-events-none",
                  style: S && d ? { top: d.top, left: d.left + d.width / 2, width: 1, height: 1 } : { top: "50%", left: "50%" },
                  "aria-hidden": "true"
                }
              )
            }
          )
        ]
      }
    ),
    document.body
  );
}
function Wf(e = ar, t = Xa) {
  if (typeof window > "u") return !0;
  try {
    return localStorage.getItem(e) === t;
  } catch {
    return !0;
  }
}
function If(e = ar, t = Xa) {
  if (!(typeof window > "u"))
    try {
      localStorage.setItem(e, t);
    } catch {
    }
}
function Hf(e = ar) {
  if (!(typeof window > "u"))
    try {
      localStorage.removeItem(e);
    } catch {
    }
}
const Qa = "ksk-cookie-consent", Ec = "ksk:cookie-decided", Dc = {
  title: "Cookies",
  description: "This site uses cookies for analytics and feature improvement. You can choose essential-only or accept all.",
  essentialOnly: "Essential only",
  accept: "Accept",
  ariaLabel: "Cookie consent"
};
function jf(e = Qa) {
  if (typeof window > "u") return !0;
  try {
    return !!localStorage.getItem(e);
  } catch {
    return !0;
  }
}
function Pc(e) {
  try {
    return typeof localStorage < "u" ? localStorage.getItem(e) : null;
  } catch {
    return null;
  }
}
function Hr(e, t) {
  try {
    typeof localStorage < "u" && localStorage.setItem(e, t);
  } catch {
  }
}
function Ff({
  labels: e,
  showDelay: t = 1500,
  storageKey: r = Qa,
  eventName: a = Ec,
  icon: o = /* @__PURE__ */ n("span", { "aria-hidden": "true", className: "text-xl flex-shrink-0", children: "🍪" }),
  onDecide: s,
  className: l
}) {
  const [i, c] = x.useState(!1), d = { ...Dc, ...e };
  x.useEffect(() => {
    if (!Pc(r)) {
      const p = setTimeout(() => c(!0), t);
      return () => clearTimeout(p);
    }
  }, [r, t]);
  const m = (h) => {
    Hr(r, h), Hr(`${r}-at`, (/* @__PURE__ */ new Date()).toISOString()), c(!1), s?.(h), typeof window < "u" && window.dispatchEvent(new CustomEvent(a, { detail: { choice: h } }));
  };
  return i ? /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "cookie-consent",
      role: "dialog",
      "aria-modal": "false",
      "aria-label": d.ariaLabel,
      className: u(
        "fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        l
      ),
      children: /* @__PURE__ */ f("div", { className: "max-w-2xl mx-auto bg-[var(--Surface-Primary)] border border-[var(--Border-Low-Emphasis)] rounded-2xl p-4 shadow-[var(--shadow-dialog)]", children: [
        /* @__PURE__ */ f("div", { className: "flex items-start gap-3 mb-3", children: [
          o,
          /* @__PURE__ */ f("div", { className: "flex-1", children: [
            /* @__PURE__ */ n("p", { className: "typo-heading-sm text-[var(--Text-High-Emphasis)] mb-1", children: d.title }),
            /* @__PURE__ */ n("p", { className: "typo-body-xs text-[var(--Text-Medium-Emphasis)] leading-relaxed", children: d.description })
          ] })
        ] }),
        /* @__PURE__ */ f("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ n(
            pe,
            {
              onClick: () => m("essential"),
              variant: "secondary",
              size: "lg",
              className: "flex-1",
              children: d.essentialOnly
            }
          ),
          /* @__PURE__ */ n(
            pe,
            {
              onClick: () => m("accept"),
              variant: "default",
              size: "lg",
              className: "flex-1",
              children: d.accept
            }
          )
        ] })
      ] })
    }
  ) : null;
}
const Bc = {
  line: {
    label: "LINEでログイン",
    icon: (
      /* LINE: green rounded square + white speech bubble */
      /* @__PURE__ */ f("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: [
        /* @__PURE__ */ n("rect", { width: "24", height: "24", rx: "6", fill: "#06C755" }),
        /* @__PURE__ */ n("path", { d: "M12 4.5C7.86 4.5 4.5 7.3 4.5 10.75c0 3.07 2.62 5.65 6.16 6.15l.84 1.75 2.87-1.75c3.54-.4 6.13-2.88 6.13-6.15C20.5 7.3 16.14 4.5 12 4.5z", fill: "white" })
      ] })
    ),
    className: "border-[#06C755] text-[var(--Text-High-Emphasis)] bg-[var(--Surface-Primary)] hover:bg-[var(--Surface-Success)]"
  },
  google: {
    label: "Googleでログイン",
    icon: /* @__PURE__ */ f("svg", { width: "18", height: "18", viewBox: "0 0 18 18", fill: "none", "aria-hidden": "true", children: [
      /* @__PURE__ */ n("path", { d: "M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z", fill: "#4285F4" }),
      /* @__PURE__ */ n("path", { d: "M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z", fill: "#34A853" }),
      /* @__PURE__ */ n("path", { d: "M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z", fill: "#FBBC05" }),
      /* @__PURE__ */ n("path", { d: "M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z", fill: "#EA4335" })
    ] }),
    className: "border-[#DADCE0] text-[var(--Text-High-Emphasis)] bg-[var(--Surface-Primary)] hover:bg-[var(--Surface-Secondary)]"
  },
  apple: {
    label: "Appleでログイン",
    icon: (
      /* Apple logo — standard path in 24x24 */
      /* @__PURE__ */ n("svg", { width: "18", height: "20", viewBox: "0 0 24 24", fill: "white", "aria-hidden": "true", children: /* @__PURE__ */ n("path", { d: "M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" }) })
    ),
    className: "border-black text-white bg-black hover:bg-gray-900"
  },
  amazon: {
    label: "Amazonでログイン",
    icon: (
      /* Amazon: dark rounded square + "a" path + orange smile arc */
      /* @__PURE__ */ f("svg", { width: "22", height: "22", viewBox: "0 0 40 40", fill: "none", "aria-hidden": "true", children: [
        /* @__PURE__ */ n("rect", { width: "40", height: "40", rx: "8", fill: "#232F3E" }),
        /* @__PURE__ */ n("path", { d: "M22 13.5c0-2-1.2-3-3.5-3-1.2 0-2.2.3-3 .8-.8.5-1.2 1.2-1.2 2h2.4c0-.3.1-.5.4-.7.2-.2.5-.2.9-.2.8 0 1.2.4 1.2 1v.6c-1.6 0-2.9.3-3.8.9-.9.6-1.4 1.4-1.4 2.4 0 .9.3 1.6 1 2.1.6.5 1.4.8 2.3.8 1 0 1.9-.4 2.6-1.2.1.3.2.7.5.9h2.5c-.4-.5-.6-1.1-.6-1.8V13.5zm-2.8 4.2c-.3.7-.9 1-1.6 1-.4 0-.8-.1-1-.3-.3-.2-.4-.5-.4-.9 0-.5.2-.9.7-1.2.5-.3 1.2-.4 2.2-.4v1.8z", fill: "white" }),
        /* @__PURE__ */ n("path", { d: "M11 27.5 Q20 32 29 27.5", stroke: "#FF9900", strokeWidth: "2", strokeLinecap: "round", fill: "none" }),
        /* @__PURE__ */ n("path", { d: "M26.5 26.5 L29 27.5 L28 30", stroke: "#FF9900", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", fill: "none" })
      ] })
    ),
    className: "border-[#232F3E] text-[var(--Text-High-Emphasis)] bg-[var(--Surface-Primary)] hover:bg-[var(--Surface-Secondary)]"
  }
};
function Af({
  provider: e,
  loading: t = !1,
  fullWidth: r = !1,
  className: a,
  disabled: o,
  children: s,
  ...l
}) {
  const i = Bc[e];
  return /* @__PURE__ */ f(
    "button",
    {
      "data-slot": "social-login-button",
      "data-provider": e,
      disabled: o || t,
      className: u(
        "inline-flex items-center gap-3 border-[1.5px] rounded-xl px-4 py-3",
        "typo-label-md font-semibold transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        r && "w-full",
        i.className,
        a
      ),
      ...l,
      children: [
        /* @__PURE__ */ n("span", { className: "flex-shrink-0 w-6 flex items-center justify-center", children: t ? /* @__PURE__ */ n("svg", { className: "animate-spin", width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ n("circle", { cx: "8", cy: "8", r: "6", stroke: "currentColor", strokeWidth: "2", strokeDasharray: "30", strokeDashoffset: "10" }) }) : i.icon }),
        /* @__PURE__ */ n("span", { className: "flex-1 text-center", children: s ?? i.label })
      ]
    }
  );
}
const Oc = {
  square: "aspect-square",
  "4/3": "aspect-[4/3]",
  "16/9": "aspect-video",
  "3/4": "aspect-[3/4]"
};
function _f({
  images: e,
  indicatorType: t = "thumbnail",
  aspectRatio: r = "4/3",
  onImageClick: a,
  className: o,
  prevLabel: s = "前の画像",
  nextLabel: l = "次の画像",
  imageLabel: i = (c) => `画像 ${c + 1}`
}) {
  const [c, d] = x.useState(0), m = () => d((w) => Math.max(0, w - 1)), h = () => d((w) => Math.min(e.length - 1, w + 1)), p = x.useRef(null), v = (w) => {
    p.current = w.touches[0].clientX;
  }, b = (w) => {
    if (p.current === null) return;
    const y = w.changedTouches[0].clientX - p.current;
    Math.abs(y) > 40 && (y < 0 ? h() : m()), p.current = null;
  }, g = e[c];
  return /* @__PURE__ */ f("div", { "data-slot": "image-gallery", className: u("flex flex-col gap-2", o), children: [
    /* @__PURE__ */ f(
      "div",
      {
        className: u(
          "relative w-full overflow-hidden rounded-xl bg-[var(--Surface-Tertiary)] cursor-pointer",
          Oc[r] ?? "aspect-[4/3]"
        ),
        onTouchStart: v,
        onTouchEnd: b,
        onClick: () => a?.(c),
        children: [
          g && /* @__PURE__ */ n(
            "img",
            {
              src: g.src,
              alt: g.alt ?? i(c),
              className: "w-full h-full object-cover transition-opacity duration-200"
            },
            c
          ),
          e.length > 1 && /* @__PURE__ */ f("span", { className: "absolute bottom-2 right-2 bg-black/50 text-white typo-label-xs px-2 py-0.5 rounded-full", children: [
            c + 1,
            " / ",
            e.length
          ] }),
          e.length > 1 && /* @__PURE__ */ f(de, { children: [
            /* @__PURE__ */ n(
              "button",
              {
                onClick: (w) => {
                  w.stopPropagation(), m();
                },
                disabled: c === 0,
                "aria-label": s,
                className: "absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center disabled:opacity-0 transition-opacity hover:bg-black/60",
                children: /* @__PURE__ */ n("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ n("path", { d: "M10 12L6 8l4-4", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) })
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                onClick: (w) => {
                  w.stopPropagation(), h();
                },
                disabled: c === e.length - 1,
                "aria-label": l,
                className: "absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center disabled:opacity-0 transition-opacity hover:bg-black/60",
                children: /* @__PURE__ */ n("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ n("path", { d: "M6 4l4 4-4 4", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) })
              }
            )
          ] })
        ]
      }
    ),
    t === "thumbnail" && e.length > 1 && /* @__PURE__ */ n("div", { className: "flex gap-1.5 overflow-x-auto scrollbar-none", children: e.map((w, y) => /* @__PURE__ */ n(
      "button",
      {
        onClick: () => d(y),
        "aria-label": i(y),
        "aria-pressed": y === c,
        className: u(
          "flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors bg-[var(--Surface-Tertiary)]",
          y === c ? "border-[var(--Brand-Primary)]" : "border-transparent hover:border-[var(--Border-Medium-Emphasis)]"
        ),
        children: /* @__PURE__ */ n("img", { src: w.src, alt: w.alt ?? i(y), className: "w-full h-full object-cover" })
      },
      y
    )) }),
    t === "dot" && e.length > 1 && /* @__PURE__ */ n("div", { className: "flex items-center justify-center gap-1.5", children: e.map((w, y) => /* @__PURE__ */ n(
      "button",
      {
        onClick: () => d(y),
        "aria-label": i(y),
        className: u(
          "rounded-full transition-all",
          y === c ? "w-4 h-1.5 bg-[var(--Brand-Primary)]" : "w-1.5 h-1.5 bg-[var(--Border-Medium-Emphasis)] hover:bg-[var(--Text-Low-Emphasis)]"
        )
      },
      y
    )) })
  ] });
}
function Lc({ size: e = 20 }) {
  return /* @__PURE__ */ n("svg", { width: e, height: e, viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ n("path", { d: "M18 6L6 18M6 6l12 12", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round" }) });
}
function Wc({ size: e = 20 }) {
  return /* @__PURE__ */ n("svg", { width: e, height: e, viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ n("path", { d: "M15 18l-6-6 6-6", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round" }) });
}
function Ic({ size: e = 20 }) {
  return /* @__PURE__ */ f("svg", { width: e, height: e, viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ n("path", { d: "M12 3v12M8 7l4-4 4 4", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round" }),
    /* @__PURE__ */ n("path", { d: "M7 11H5a2 2 0 00-2 2v6a2 2 0 002 2h14a2 2 0 002-2v-6a2 2 0 00-2-2h-2", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round" })
  ] });
}
function zf({
  title: e,
  leftIcon: t = "back",
  onLeft: r,
  leftLabel: a,
  rightSlot: o,
  onShare: s,
  shareLabel: l = "シェア",
  glass: i = !1,
  transparent: c = !1,
  className: d
}) {
  const m = () => t === "back" ? /* @__PURE__ */ n(Wc, {}) : t === "close" ? /* @__PURE__ */ n(Lc, {}) : t, h = t === "close" ? "閉じる" : "戻る", p = i ? "glass" : "secondary";
  return /* @__PURE__ */ f(
    "header",
    {
      "data-slot": "navigation-bar",
      className: u(
        "relative flex items-center h-[60px] px-3",
        !c && "bg-[var(--Surface-Primary)]",
        d
      ),
      children: [
        r && /* @__PURE__ */ n(
          pe,
          {
            variant: p,
            size: "icon-xl",
            "aria-label": a ?? h,
            onClick: r,
            children: m()
          }
        ),
        e && /* @__PURE__ */ n("div", { className: "absolute inset-x-0 flex justify-center items-center pointer-events-none", children: /* @__PURE__ */ n("span", { className: "typo-heading-sm text-[var(--Text-High-Emphasis)] px-16 truncate", children: e }) }),
        /* @__PURE__ */ n("div", { className: "ml-auto", children: o ?? (s ? /* @__PURE__ */ n(
          pe,
          {
            variant: p,
            size: "icon-xl",
            "aria-label": l,
            onClick: s,
            children: /* @__PURE__ */ n(Ic, {})
          }
        ) : null) })
      ]
    }
  );
}
function Yf({
  layout: e = "default",
  leading: t,
  logo: r,
  title: a,
  subtitle: o,
  centerSlot: s,
  trailing: l,
  rightSlot: i,
  nav: c,
  bottomSlot: d,
  sticky: m = !1,
  bordered: h = !0,
  variant: p = "default",
  className: v
}) {
  const b = p === "glass", g = p === "transparent", w = l ?? i, y = () => e === "back-search" && s ? /* @__PURE__ */ n("div", { className: "flex-1 min-w-0", children: s }) : e === "logo-center" ? /* @__PURE__ */ n("div", { className: "flex-1 flex justify-center min-w-0", children: r }) : e === "logo" ? /* @__PURE__ */ f(de, { children: [
    /* @__PURE__ */ n("div", { className: "shrink-0", children: r }),
    c && c.length > 0 && /* @__PURE__ */ n("nav", { className: "hidden @[768px]:flex items-center gap-4 ml-6", children: c.map((S) => /* @__PURE__ */ n(
      "a",
      {
        href: S.href,
        onClick: S.onClick,
        "data-active": S.isActive || void 0,
        className: u(
          "typo-label-md text-[var(--Text-Medium-Emphasis)] hover:text-[var(--Text-High-Emphasis)] transition-colors",
          S.isActive && "text-[var(--Brand-Primary)] font-bold"
        ),
        children: S.label
      },
      S.label
    )) }),
    /* @__PURE__ */ n("div", { className: "flex-1" })
  ] }) : /* @__PURE__ */ f("div", { className: "flex-1 flex flex-col justify-center min-w-0", children: [
    a && (typeof a == "string" ? /* @__PURE__ */ n("span", { className: "typo-heading-sm text-[var(--Text-High-Emphasis)] truncate", children: a }) : a),
    o && (typeof o == "string" ? /* @__PURE__ */ n("span", { className: "typo-body-xs text-[var(--Text-Medium-Emphasis)] truncate", children: o }) : o)
  ] });
  return /* @__PURE__ */ f(
    "header",
    {
      "data-slot": "app-header",
      "data-variant": p,
      "data-layout": e,
      className: u(
        "@container",
        // Sticky
        m && "sticky top-0 z-40",
        v
      ),
      children: [
        /* @__PURE__ */ f(
          "div",
          {
            className: u(
              "flex items-center gap-2 h-14 px-4",
              b && "glass",
              !b && !g && "bg-[var(--Surface-Primary)]",
              h && !b && !g && "border-b border-[var(--Border-Low-Emphasis)]",
              h && b && "border-b border-[rgba(255,255,255,0.25)]"
            ),
            children: [
              t && /* @__PURE__ */ n("div", { className: "flex items-center shrink-0", children: t }),
              y(),
              w && /* @__PURE__ */ n("div", { className: "flex items-center gap-1 shrink-0", children: w })
            ]
          }
        ),
        d && /* @__PURE__ */ n(
          "div",
          {
            className: u(
              !b && !g && "bg-[var(--Surface-Primary)]",
              h && "border-b border-[var(--Border-Low-Emphasis)]"
            ),
            children: d
          }
        )
      ]
    }
  );
}
function $f({
  value: e = [],
  onChange: t,
  placeholder: r = "タグを入力して Enter",
  disabled: a = !1,
  max: o,
  allowDuplicates: s = !1,
  className: l,
  inputLabel: i = "タグ入力"
}) {
  const [c, d] = x.useState(""), m = x.useRef(null), h = x.useRef(!1), p = x.useCallback(
    (g) => {
      const w = g.trim();
      w && (!s && e.includes(w) || o !== void 0 && e.length >= o || (t?.([...e, w]), d("")));
    },
    [e, t, s, o]
  ), v = x.useCallback(
    (g) => {
      t?.(e.filter((w, y) => y !== g));
    },
    [e, t]
  ), b = (g) => {
    g.key === "Enter" && (g.preventDefault(), h.current = !0, p(c)), g.key === "Backspace" && c === "" && e.length > 0 && v(e.length - 1), g.key === "," && (g.preventDefault(), p(c));
  };
  return /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "tag-input",
      className: u(
        "flex flex-wrap gap-1.5 min-h-12 w-full rounded-lg border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] px-3 py-2 transition-colors",
        "focus-within:ring-[3px] focus-within:ring-[var(--Focus-High-Emphasis)]/50 focus-within:border-[var(--Border-Accent-Primary)]",
        a && "cursor-not-allowed opacity-50",
        l
      ),
      onClick: () => m.current?.focus(),
      children: [
        e.map((g, w) => /* @__PURE__ */ f(
          "span",
          {
            className: "inline-flex items-center gap-1 h-7 px-2.5 rounded-full bg-[var(--Brand-Ultra-Light)] text-[var(--Text-Accent-Primary)] typo-label-sm",
            children: [
              g,
              !a && /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  onClick: (y) => {
                    y.stopPropagation(), v(w);
                  },
                  className: "flex items-center justify-center w-3.5 h-3.5 rounded-full hover:bg-[var(--Brand-Light)] transition-colors",
                  "aria-label": `${g} を削除`,
                  children: /* @__PURE__ */ n("svg", { width: "8", height: "8", viewBox: "0 0 8 8", fill: "none", children: /* @__PURE__ */ n("path", { d: "M1 1l6 6M7 1L1 7", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }) })
                }
              )
            ]
          },
          w
        )),
        /* @__PURE__ */ n(
          "input",
          {
            ref: m,
            value: c,
            onChange: (g) => d(g.target.value),
            onKeyDown: b,
            onBlur: () => {
              if (h.current) {
                h.current = !1;
                return;
              }
              c.trim() && p(c);
            },
            disabled: a || o !== void 0 && e.length >= o,
            placeholder: e.length === 0 ? r : "",
            className: "flex-1 min-w-24 bg-transparent outline-none typo-body-md text-[var(--Text-High-Emphasis)] placeholder:text-[var(--Text-Low-Emphasis)] disabled:cursor-not-allowed",
            "aria-label": i
          }
        )
      ]
    }
  );
}
const Hc = 72;
function Rf({ children: e, actions: t = [], side: r = "right", className: a }) {
  const [o, s] = x.useState(0), [l, i] = x.useState(!1), c = x.useRef(0), d = x.useRef(0), m = x.useRef(null), h = t.length * Hc, p = Math.abs(o) > h / 2, v = x.useCallback((S) => {
    s(S);
  }, []), b = (S) => {
    c.current = S.clientX, d.current = o, i(!0), m.current?.setPointerCapture(S.pointerId);
  }, g = (S) => {
    if (!l) return;
    const M = S.clientX - c.current, N = d.current + M, C = Math.min(0, Math.max((r === "right" ? -1 : 1) * h, N));
    s(C);
  }, w = () => {
    if (!l) return;
    i(!1), v(p ? (r === "right" ? -1 : 1) * h : 0);
  }, y = () => v(0);
  return t.length === 0 ? /* @__PURE__ */ n("div", { className: a, children: e }) : /* @__PURE__ */ f("div", { className: u("relative overflow-hidden", a), children: [
    /* @__PURE__ */ n(
      "div",
      {
        className: u(
          "absolute inset-y-0 flex",
          r === "right" ? "right-0" : "left-0"
        ),
        style: { width: h },
        children: t.map((S, M) => /* @__PURE__ */ f(
          "button",
          {
            type: "button",
            onClick: () => {
              S.onClick(), y();
            },
            className: u(
              "flex flex-col items-center justify-center gap-1 w-[72px] typo-label-xs font-medium transition-colors",
              S.variant === "destructive" ? "bg-[var(--Caution-Base)] text-[var(--Text-on-Inverse)] hover:bg-[var(--Hover-Destructive-Button)]" : "bg-[var(--Surface-Secondary)] text-[var(--Text-High-Emphasis)] hover:bg-[var(--Border-Medium-Emphasis)]"
            ),
            children: [
              S.icon && /* @__PURE__ */ n("span", { className: "text-current", children: S.icon }),
              S.label
            ]
          },
          M
        ))
      }
    ),
    /* @__PURE__ */ n(
      "div",
      {
        ref: m,
        className: u(
          "relative bg-[var(--Surface-Primary)] touch-pan-y select-none",
          !l && "transition-transform duration-200 ease-out"
        ),
        style: { transform: `translateX(${o}px)` },
        onPointerDown: b,
        onPointerMove: g,
        onPointerUp: w,
        onPointerCancel: w,
        children: e
      }
    )
  ] });
}
function Ne(e) {
  const [t, r] = x.useState(!1);
  return x.useEffect(() => {
    const a = window.matchMedia(e);
    r(a.matches);
    const o = (s) => r(s.matches);
    return a.addEventListener("change", o), () => a.removeEventListener("change", o);
  }, [e]), t;
}
function jc({ children: e, ...t }) {
  return Ne("(min-width: 768px)") ? /* @__PURE__ */ n(ao, { ...t, children: e }) : /* @__PURE__ */ n(Zt, { ...t, children: e });
}
function Vf({ children: e, ...t }) {
  return Ne("(min-width: 768px)") ? /* @__PURE__ */ n(no, { ...t, children: e }) : /* @__PURE__ */ n(uc, { ...t, children: e });
}
function Fc({ children: e, className: t, ...r }) {
  return Ne("(min-width: 768px)") ? /* @__PURE__ */ n(lo, { className: t, ...r, children: e }) : /* @__PURE__ */ n(er, { side: "bottom", className: t, children: e });
}
function Ac({ children: e, ...t }) {
  return Ne("(min-width: 768px)") ? /* @__PURE__ */ n(co, { ...t, children: e }) : /* @__PURE__ */ n(tr, { ...t, children: e });
}
function _c({ children: e, ...t }) {
  return Ne("(min-width: 768px)") ? /* @__PURE__ */ n(fo, { ...t, children: e }) : /* @__PURE__ */ n(rr, { ...t, children: e });
}
function zc({ children: e, ...t }) {
  return Ne("(min-width: 768px)") ? /* @__PURE__ */ n(ho, { ...t, children: e }) : /* @__PURE__ */ n(Ua, { ...t, children: e });
}
function Yc({ children: e, ...t }) {
  return Ne("(min-width: 768px)") ? /* @__PURE__ */ n(uo, { ...t, children: e }) : /* @__PURE__ */ n("div", { "data-slot": "sheet-footer", className: "flex flex-col gap-2 mt-auto", ...t, children: e });
}
function qf({ children: e, ...t }) {
  return Ne("(min-width: 768px)") ? /* @__PURE__ */ n(so, { ...t, children: e }) : /* @__PURE__ */ n(fc, { ...t, children: e });
}
function Gf({
  open: e,
  onOpenChange: t,
  title: r,
  description: a,
  confirmLabel: o = "確認",
  cancelLabel: s = "キャンセル",
  loadingLabel: l = "処理中…",
  variant: i = "default",
  onConfirm: c,
  loading: d = !1
}) {
  const [m, h] = x.useState(!1), p = d || m, v = x.useCallback(async () => {
    h(!0);
    try {
      await c(), t(!1);
    } finally {
      h(!1);
    }
  }, [c, t]);
  return /* @__PURE__ */ n(jc, { open: e, onOpenChange: t, children: /* @__PURE__ */ f(Fc, { children: [
    /* @__PURE__ */ f(Ac, { children: [
      /* @__PURE__ */ n(_c, { children: r }),
      a && /* @__PURE__ */ n(zc, { children: a })
    ] }),
    /* @__PURE__ */ f(Yc, { className: "mt-4", children: [
      /* @__PURE__ */ n(
        pe,
        {
          variant: "secondary",
          onClick: () => t(!1),
          disabled: p,
          children: s
        }
      ),
      /* @__PURE__ */ n(
        pe,
        {
          variant: i === "destructive" ? "destructive" : "default",
          onClick: v,
          disabled: p,
          children: p ? l : o
        }
      )
    ] })
  ] }) });
}
function Uf({
  open: e,
  onOpenChange: t,
  title: r,
  description: a,
  submitLabel: o = "保存",
  cancelLabel: s = "キャンセル",
  onSubmit: l,
  loading: i = !1,
  children: c,
  className: d
}) {
  const [m, h] = x.useState(!1), p = i || m, v = x.useCallback(async (b) => {
    b.preventDefault(), h(!0);
    try {
      await l(), t(!1);
    } finally {
      h(!1);
    }
  }, [l, t]);
  return /* @__PURE__ */ n(Zt, { open: e, onOpenChange: t, children: /* @__PURE__ */ f(
    er,
    {
      side: "bottom",
      className: u("p-0 rounded-t-[32px] max-h-[90dvh] flex flex-col", d),
      children: [
        /* @__PURE__ */ f(tr, { className: "px-5 pt-6 shrink-0", children: [
          /* @__PURE__ */ n(rr, { className: "!text-[28px] !font-bold", children: r }),
          a && /* @__PURE__ */ n(Ua, { children: a })
        ] }),
        /* @__PURE__ */ f(
          "form",
          {
            onSubmit: v,
            className: "flex flex-col flex-1 overflow-hidden",
            children: [
              /* @__PURE__ */ n("div", { className: "flex-1 overflow-y-auto px-5 py-4 space-y-4", children: c }),
              /* @__PURE__ */ f("div", { className: "shrink-0 flex gap-3 px-5 py-4 border-t border-[var(--Border-Low-Emphasis)]", children: [
                /* @__PURE__ */ n(
                  pe,
                  {
                    type: "button",
                    variant: "secondary",
                    className: "flex-1",
                    onClick: () => t(!1),
                    disabled: p,
                    children: s
                  }
                ),
                /* @__PURE__ */ n(
                  pe,
                  {
                    type: "submit",
                    className: "flex-1",
                    disabled: p,
                    children: p ? "保存中…" : o
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  ) });
}
const jr = se(
  // justify-center をベースに含める：tile サイズ等の固定幅で text が左寄せになる問題を防ぐ。
  // padding 付きサイズ (sm/md/lg) でも flex の justify-center は副作用なし。
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer typo-label-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--Focus-High-Emphasis)]",
  {
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
  }
);
function Za({
  className: e,
  variant: t = "filled",
  size: r,
  shape: a,
  href: o,
  selected: s,
  soldOut: l = !1,
  removable: i,
  onRemove: c,
  count: d,
  children: m,
  ...h
}) {
  const p = l && !s, v = d !== void 0 && /* @__PURE__ */ n(
    "span",
    {
      className: u(
        "inline-flex items-center justify-center rounded-full px-1.5 min-w-[1.25rem] typo-label-xs transition-colors",
        s ? "bg-[var(--Surface-Primary)] text-[var(--Text-Accent-Primary)]" : "bg-[var(--Surface-Tertiary)] text-[var(--Text-Medium-Emphasis)]"
      ),
      children: d
    }
  ), w = /* @__PURE__ */ f(de, { children: [
    m,
    v,
    p && /* @__PURE__ */ n(
      "span",
      {
        "aria-hidden": "true",
        className: "pointer-events-none absolute inset-0 flex items-center justify-center",
        children: /* @__PURE__ */ n("span", { className: "block h-[140%] w-px origin-center rotate-45 bg-[var(--Text-Disable)]" })
      }
    ),
    i && /* @__PURE__ */ n(
      "span",
      {
        role: "button",
        "aria-label": "削除",
        tabIndex: 0,
        onClick: (M) => {
          M.stopPropagation(), c?.();
        },
        onKeyDown: (M) => {
          (M.key === "Enter" || M.key === " ") && (M.preventDefault(), M.stopPropagation(), c?.());
        },
        className: "-mr-1 ml-0.5 inline-flex size-5 items-center justify-center rounded-full hover:bg-[var(--Surface-Tertiary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--Focus-High-Emphasis)]",
        children: /* @__PURE__ */ n("svg", { width: "12", height: "12", viewBox: "0 0 14 14", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ n("path", { d: "M4 4L10 10M10 4L4 10", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }) })
      }
    )
  ] }), y = s && "!bg-[var(--Brand-Primary)] !text-[var(--Text-on-Inverse)] hover:!bg-[var(--Active-Primary-Button)] active:!bg-[var(--Active-Primary-Button)] !border-[var(--Brand-Primary)] font-bold shadow-sm hover:shadow", S = p && "border border-[var(--Text-Disable)] !bg-[var(--Surface-Secondary)] !text-[var(--Text-Disable)] cursor-not-allowed";
  return o && !p ? /* @__PURE__ */ n(
    "a",
    {
      href: o,
      "data-slot": "chip",
      "data-variant": t,
      "data-selected": s || void 0,
      className: u(
        "relative",
        jr({ variant: t, size: r, shape: a }),
        y,
        e
      ),
      children: w
    }
  ) : /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      "data-slot": "chip",
      "data-variant": t,
      "data-selected": s || void 0,
      "data-sold-out": p || void 0,
      disabled: p || h.disabled,
      className: u(
        "relative",
        jr({ variant: t, size: r, shape: a }),
        y,
        S,
        e
      ),
      ...h,
      children: w
    }
  );
}
function Xf({
  options: e,
  value: t,
  onChange: r,
  multiple: a = !0,
  max: o,
  size: s = "md",
  className: l
}) {
  const i = x.useCallback((c) => {
    if (a)
      if (t.includes(c))
        r(t.filter((d) => d !== c));
      else {
        if (o && t.length >= o) return;
        r([...t, c]);
      }
    else
      r(t.includes(c) ? [] : [c]);
  }, [t, r, a, o]);
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "chip-selector",
      role: "group",
      className: u("flex flex-wrap gap-2", l),
      children: e.map((c) => {
        const d = t.includes(c.value), m = !d && !!o && t.length >= o;
        return /* @__PURE__ */ f(
          Za,
          {
            size: s,
            variant: d ? "accent" : "outline",
            selected: d,
            disabled: m,
            removable: d && a,
            onRemove: () => r(t.filter((h) => h !== c.value)),
            onClick: () => i(c.value),
            "aria-pressed": d,
            children: [
              c.icon && /* @__PURE__ */ n("span", { className: "shrink-0", children: c.icon }),
              c.label
            ]
          },
          c.value
        );
      })
    }
  );
}
const $c = se(
  "flex items-start gap-3 rounded-lg border p-4",
  {
    variants: {
      variant: {
        info: "border-[var(--Border-Info)] bg-[var(--Surface-Info)] text-[var(--Text-Info)]",
        success: "border-[var(--Border-Success)] bg-[var(--Surface-Success)] text-[var(--Text-Success)]",
        warning: "border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Warning)] text-[var(--Text-Warning)]",
        caution: "border-[var(--Border-Caution)] bg-[var(--Surface-Caution)] text-[var(--Text-Caution)]"
      }
    },
    defaultVariants: {
      variant: "info"
    }
  }
);
function Qf({
  className: e,
  variant: t,
  icon: r,
  title: a,
  description: o,
  action: s,
  children: l,
  ...i
}) {
  return /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "banner",
      role: "alert",
      className: u($c({ variant: t }), e),
      ...i,
      children: [
        r && /* @__PURE__ */ n("div", { className: "shrink-0 mt-0.5", children: r }),
        /* @__PURE__ */ f("div", { className: "flex-1 min-w-0", children: [
          a && /* @__PURE__ */ n("p", { className: "typo-label-md text-[var(--Text-High-Emphasis)]", children: a }),
          o && /* @__PURE__ */ n("p", { className: "typo-body-sm mt-1", children: o }),
          l
        ] }),
        s && /* @__PURE__ */ n("div", { className: "shrink-0", children: s })
      ]
    }
  );
}
function Zf({
  className: e,
  icon: t,
  title: r,
  description: a,
  action: o,
  iconClassName: s,
  ...l
}) {
  return /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "empty-state",
      className: u(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        e
      ),
      ...l,
      children: [
        t && /* @__PURE__ */ n("div", { className: u("mb-4 text-[var(--Object-Low-Emphasis)]", s), children: t }),
        /* @__PURE__ */ n("h3", { className: "typo-heading-md text-[var(--Text-High-Emphasis)]", children: r }),
        a && /* @__PURE__ */ n("p", { className: "typo-body-md text-[var(--Text-Medium-Emphasis)] mt-2 max-w-sm", children: a }),
        o && /* @__PURE__ */ n("div", { className: "mt-6", children: o })
      ]
    }
  );
}
function Kf({
  className: e,
  icon: t,
  title: r = "エラーが発生しました",
  description: a = "しばらくしてからもう一度お試しください",
  onRetry: o,
  retryLabel: s = "再試行",
  ...l
}) {
  return /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "error-state",
      className: u(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        e
      ),
      ...l,
      children: [
        t && /* @__PURE__ */ n("div", { className: "mb-4 text-[var(--Object-Caution)]", children: t }),
        /* @__PURE__ */ n("h3", { className: "typo-heading-md text-[var(--Text-High-Emphasis)]", children: r }),
        a && /* @__PURE__ */ n("p", { className: "typo-body-md text-[var(--Text-Medium-Emphasis)] mt-2 max-w-sm", children: a }),
        o && /* @__PURE__ */ n(
          "button",
          {
            "data-slot": "button",
            onClick: o,
            className: "mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--Brand-Primary)] px-4 h-10 typo-label-md text-[var(--Text-on-Inverse)] hover:bg-[var(--Hover-Primary-Button)] transition-colors cursor-pointer",
            children: s
          }
        )
      ]
    }
  );
}
function Jf({
  className: e,
  label: t,
  htmlFor: r,
  required: a,
  error: o,
  description: s,
  requiredStyle: l = "asterisk",
  endLabel: i,
  children: c,
  ...d
}) {
  const m = i != null;
  return /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "form-field",
      className: u("flex flex-col gap-1.5", e),
      ...d,
      children: [
        /* @__PURE__ */ f(
          "div",
          {
            className: u(
              // endLabel が無いときは <label> 単体（既存の見た目を維持）。
              // 在るときだけ row 化して right に寄せる。
              m && "flex items-center justify-between gap-2"
            ),
            children: [
              /* @__PURE__ */ f(
                "label",
                {
                  htmlFor: r,
                  className: "typo-label-md text-[var(--Text-High-Emphasis)] inline-flex items-center gap-1.5",
                  children: [
                    t,
                    l === "asterisk" && a && /* @__PURE__ */ n("span", { className: "text-[var(--Text-Caution)]", "aria-hidden": "true", children: "*" }),
                    l === "pill" && /* @__PURE__ */ n(
                      "span",
                      {
                        className: u(
                          "typo-label-xs px-1.5 py-0.5 rounded",
                          a ? "bg-[var(--Surface-Caution-Subtle)] text-[var(--Text-Caution)]" : "bg-[var(--Surface-Tertiary)] text-[var(--Text-Medium-Emphasis)]"
                        ),
                        "aria-hidden": "true",
                        children: a ? "必須" : "任意"
                      }
                    )
                  ]
                }
              ),
              i && /* @__PURE__ */ n(
                "div",
                {
                  "data-slot": "form-field-end-label",
                  className: "typo-body-sm text-[var(--Text-Medium-Emphasis)] flex items-center",
                  children: i
                }
              )
            ]
          }
        ),
        c,
        s && !o && /* @__PURE__ */ n("p", { className: "typo-body-sm text-[var(--Text-Low-Emphasis)]", children: s }),
        o && /* @__PURE__ */ f(
          "p",
          {
            className: "typo-body-sm text-[var(--Text-Caution)] flex items-center gap-1",
            role: "alert",
            children: [
              /* @__PURE__ */ f("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", className: "shrink-0", children: [
                /* @__PURE__ */ n("circle", { cx: "7", cy: "7", r: "6", stroke: "currentColor", strokeWidth: "1.5" }),
                /* @__PURE__ */ n("path", { d: "M7 4V7.5M7 9.5V10", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" })
              ] }),
              o
            ]
          }
        )
      ]
    }
  );
}
function eh({
  className: e,
  leftSlot: t,
  rightSlot: r,
  bottomSlot: a,
  title: o,
  description: s,
  interactive: l = !1,
  variant: i = "default",
  children: c,
  ...d
}) {
  const m = i === "destructive";
  return /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "list-item",
      "data-variant": i,
      className: u(
        "flex items-start gap-3 py-3 px-4 border-b border-[var(--Border-Low-Emphasis)]",
        l && (m ? "cursor-pointer hover:bg-[var(--Surface-Caution-Subtle)] transition-colors" : "cursor-pointer hover:bg-[var(--Surface-Secondary)] transition-colors"),
        e
      ),
      ...d,
      children: [
        t && /* @__PURE__ */ n("div", { className: "shrink-0", children: t }),
        /* @__PURE__ */ f("div", { className: "flex-1 min-w-0", children: [
          o && /* @__PURE__ */ n(
            "p",
            {
              className: u(
                "typo-label-md truncate",
                m ? "text-[var(--Caution-Base)]" : "text-[var(--Text-High-Emphasis)]"
              ),
              children: o
            }
          ),
          s && /* @__PURE__ */ n("p", { className: "typo-body-sm text-[var(--Text-Medium-Emphasis)] mt-0.5", children: s }),
          c,
          a && /* @__PURE__ */ n("div", { className: "mt-2", children: a })
        ] }),
        r && /* @__PURE__ */ n("div", { className: "shrink-0", children: r })
      ]
    }
  );
}
const Rc = {
  xs: "size-1.5 min-w-0 px-0",
  sm: "min-w-4 h-4 px-1 typo-label-xs",
  default: "min-w-5 h-5 px-1.5 typo-label-xs"
};
function th({
  className: e,
  count: t,
  max: r = 99,
  size: a = "default",
  ...o
}) {
  if (t <= 0) return null;
  const s = t > r ? `${r}+` : t;
  return /* @__PURE__ */ n(
    "span",
    {
      "data-slot": "notification-badge",
      "data-size": a,
      className: u(
        "inline-flex items-center justify-center rounded-full",
        "bg-[var(--Caution-Base)] text-[var(--Text-on-Inverse)]",
        Rc[a],
        e
      ),
      ...o,
      children: a !== "xs" && s
    }
  );
}
function rh({
  className: e,
  steps: t,
  currentStep: r,
  ...a
}) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "progress-steps",
      className: u("flex items-start", e),
      role: "progressbar",
      "aria-valuenow": r + 1,
      "aria-valuemin": 1,
      "aria-valuemax": t.length,
      ...a,
      children: t.map((o, s) => {
        const l = s < r, i = s === r, c = s === t.length - 1;
        return /* @__PURE__ */ f(x.Fragment, { children: [
          /* @__PURE__ */ f("div", { className: "flex flex-col items-center gap-1.5 shrink-0", children: [
            /* @__PURE__ */ n(
              "div",
              {
                className: u(
                  "flex items-center justify-center size-8 rounded-full typo-label-sm transition-colors",
                  l ? "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)]" : i ? "border-2 border-[var(--Brand-Primary)] text-[var(--Text-Accent-Primary)]" : "border border-[var(--Border-Medium-Emphasis)] text-[var(--Text-Low-Emphasis)]"
                ),
                children: l ? /* @__PURE__ */ n("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", children: /* @__PURE__ */ n("path", { d: "M11 4L5.5 9.5L3 7", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }) : s + 1
              }
            ),
            /* @__PURE__ */ n(
              "span",
              {
                className: u(
                  "typo-label-xs text-center whitespace-nowrap",
                  i ? "text-[var(--Text-High-Emphasis)] font-medium" : "text-[var(--Text-Low-Emphasis)]"
                ),
                children: o
              }
            )
          ] }),
          !c && /* @__PURE__ */ n(
            "div",
            {
              className: u(
                "flex-1 h-0.5 mt-4 mx-1",
                l ? "bg-[var(--Brand-Primary)]" : "bg-[var(--Border-Low-Emphasis)]"
              )
            }
          )
        ] }, s);
      })
    }
  );
}
function ah({
  className: e,
  onSearch: t,
  ...r
}) {
  const a = (o) => {
    o.key === "Enter" && t && t(o.currentTarget.value);
  };
  return /* @__PURE__ */ f("div", { "data-slot": "search-bar", className: u("relative w-full", e), children: [
    /* @__PURE__ */ f(
      "svg",
      {
        width: "20",
        height: "20",
        viewBox: "0 0 20 20",
        fill: "none",
        className: "absolute left-3 top-1/2 -translate-y-1/2 text-[var(--Object-Medium-Emphasis)]",
        "aria-hidden": "true",
        children: [
          /* @__PURE__ */ n("circle", { cx: "9", cy: "9", r: "6", stroke: "currentColor", strokeWidth: "2" }),
          /* @__PURE__ */ n("path", { d: "M13.5 13.5L17 17", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" })
        ]
      }
    ),
    /* @__PURE__ */ n(
      "input",
      {
        type: "search",
        "data-slot": "input",
        className: u(
          "flex h-12 w-full rounded-full border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] pl-10 pr-4 typo-body-md text-[var(--Text-High-Emphasis)]",
          "placeholder:text-[var(--Text-Low-Emphasis)]",
          "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50 focus-visible:border-[var(--Border-Accent-Primary)]",
          "disabled:cursor-not-allowed disabled:opacity-50"
        ),
        onKeyDown: a,
        ...r
      }
    )
  ] });
}
function Vc({
  className: e,
  title: t,
  description: r,
  action: a,
  ...o
}) {
  return /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "section-header",
      className: u("flex items-center justify-between gap-4", e),
      ...o,
      children: [
        /* @__PURE__ */ f("div", { className: "min-w-0", children: [
          /* @__PURE__ */ n("h2", { className: "typo-heading-lg text-[var(--Text-High-Emphasis)]", children: t }),
          r && /* @__PURE__ */ n("p", { className: "typo-body-sm text-[var(--Text-Medium-Emphasis)] mt-1", children: r })
        ] }),
        a && /* @__PURE__ */ n("div", { className: "shrink-0", children: a })
      ]
    }
  );
}
const qc = {
  default: { card: "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]", icon: "text-[var(--Object-Medium-Emphasis)]" },
  success: { card: "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Success)]", icon: "text-[var(--Object-Success)]" },
  caution: { card: "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Caution)]", icon: "text-[var(--Object-Caution)]" },
  info: { card: "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Info)]", icon: "text-[var(--Text-Info)]" },
  accent: { card: "border-[var(--Brand-Primary)]/20 bg-[var(--Surface-Accent-Primary-Light)]", icon: "text-[var(--Object-Accent-Primary)]" }
};
function nh({
  className: e,
  label: t,
  value: r,
  unit: a,
  trend: o,
  icon: s,
  variant: l = "default",
  ...i
}) {
  const c = qc[l];
  return /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "stat-card",
      "data-variant": l,
      className: u(
        "flex flex-col gap-2 rounded-lg border p-4 shadow-[var(--shadow-md)]",
        c.card,
        e
      ),
      ...i,
      children: [
        /* @__PURE__ */ f("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ n("span", { className: "typo-body-sm text-[var(--Text-Medium-Emphasis)]", children: t }),
          s && /* @__PURE__ */ n("span", { className: c.icon, children: s })
        ] }),
        /* @__PURE__ */ f("div", { className: "flex items-baseline gap-1", children: [
          /* @__PURE__ */ n("span", { className: "typo-heading-2xl text-[var(--Text-High-Emphasis)]", children: r }),
          a && /* @__PURE__ */ n("span", { className: "typo-body-sm text-[var(--Text-Medium-Emphasis)]", children: a })
        ] }),
        o && /* @__PURE__ */ f(
          "div",
          {
            className: u(
              "typo-body-sm flex items-center gap-1",
              o.value >= 0 ? "text-[var(--Text-Success)]" : "text-[var(--Text-Caution)]"
            ),
            children: [
              /* @__PURE__ */ f("span", { children: [
                o.value >= 0 ? "+" : "",
                o.value,
                "%"
              ] }),
              o.label && /* @__PURE__ */ n("span", { className: "text-[var(--Text-Low-Emphasis)]", children: o.label })
            ]
          }
        )
      ]
    }
  );
}
const Gc = se(
  "inline-flex items-center rounded-sm px-2 py-0.5 typo-label-xs whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-[var(--Surface-Secondary)] text-[var(--Text-High-Emphasis)]",
        brand: "bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)]",
        caution: "bg-[var(--Surface-Caution)] text-[var(--Text-Caution)]",
        success: "bg-[var(--Surface-Success)] text-[var(--Text-Success)]",
        warning: "bg-[var(--Surface-Warning)] text-[var(--Text-Warning)]",
        info: "bg-[var(--Surface-Info)] text-[var(--Text-Info)]"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function oh({
  className: e,
  variant: t,
  ...r
}) {
  return /* @__PURE__ */ n(
    "span",
    {
      "data-slot": "tag",
      className: u(Gc({ variant: t }), e),
      ...r
    }
  );
}
const Uc = se(
  "pointer-events-auto relative flex w-full items-center gap-3 overflow-hidden rounded-lg border p-4 shadow-[var(--shadow-lg)] transition-all animate-fade-in-up",
  {
    variants: {
      variant: {
        default: "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)]",
        success: "border-[var(--Border-Success)] bg-[var(--Surface-Success)] text-[var(--Text-Success)]",
        caution: "border-[var(--Border-Caution)] bg-[var(--Surface-Caution)] text-[var(--Text-Caution)]",
        warning: "border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Warning)] text-[var(--Text-Warning)]",
        info: "border-[var(--Border-Info)] bg-[var(--Surface-Info)] text-[var(--Text-Info)]"
      }
    },
    defaultVariants: { variant: "default" }
  }
);
let Fr = 0;
function Xc() {
  return Fr += 1, `t${Date.now().toString(36)}-${Fr.toString(36)}`;
}
const q = {
  toasts: [],
  listeners: /* @__PURE__ */ new Set(),
  add(e) {
    const t = Xc(), r = { id: t, ...e };
    q.toasts = [...q.toasts, r], q.listeners.forEach((o) => o());
    const a = e.duration ?? 5e3;
    return a > 0 && typeof window < "u" && window.setTimeout(() => q.dismiss(t), a), t;
  },
  dismiss(e) {
    const t = q.toasts.length;
    q.toasts = q.toasts.filter((r) => r.id !== e), q.toasts.length !== t && q.listeners.forEach((r) => r());
  },
  subscribe(e) {
    return q.listeners.add(e), () => {
      q.listeners.delete(e);
    };
  }
};
let Ka = 0;
const Ht = /* @__PURE__ */ new Set();
function Ar(e) {
  Ka += e, Ht.forEach((t) => t());
}
function Qc(e) {
  return Ht.add(e), () => {
    Ht.delete(e);
  };
}
function Zc() {
  const e = x.useCallback((a) => q.subscribe(a), []), t = x.useCallback(() => q.toasts, []), r = x.useCallback(() => [], []);
  return x.useSyncExternalStore(e, t, r);
}
function Kc() {
  const e = x.useCallback((a) => Qc(a), []), t = x.useCallback(() => Ka > 0, []), r = x.useCallback(() => !1, []);
  return x.useSyncExternalStore(e, t, r);
}
const Ja = x.createContext(null);
function sh() {
  return x.useContext(Ja) ?? { toast: (t) => q.add(t) };
}
function en() {
  const e = Zc();
  return typeof document > "u" ? null : Zr(
    /* @__PURE__ */ n(
      "div",
      {
        "data-slot": "toast-viewport",
        className: "fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none",
        children: e.map((t) => /* @__PURE__ */ f(
          "div",
          {
            "data-slot": "toast",
            "data-variant": t.variant ?? "default",
            className: u(Uc({ variant: t.variant })),
            children: [
              /* @__PURE__ */ f("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ n("p", { className: "typo-label-md", children: t.title }),
                t.description && /* @__PURE__ */ n("p", { className: "typo-body-sm mt-0.5 opacity-80", children: t.description })
              ] }),
              t.action && /* @__PURE__ */ n(
                "button",
                {
                  "data-slot": "toast-action",
                  onClick: () => t.action.onClick(),
                  className: "shrink-0 typo-label-sm underline underline-offset-2 hover:no-underline cursor-pointer",
                  children: t.action.label
                }
              ),
              /* @__PURE__ */ n(
                "button",
                {
                  "data-slot": "button",
                  onClick: () => q.dismiss(t.id),
                  className: "shrink-0 text-[var(--Object-Medium-Emphasis)] hover:text-[var(--Object-High-Emphasis)] cursor-pointer",
                  "aria-label": "閉じる",
                  children: /* @__PURE__ */ n("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ n("path", { d: "M4 4L12 12M12 4L4 12", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) })
                }
              )
            ]
          },
          t.id
        ))
      }
    ),
    document.body
  );
}
function ih({ children: e }) {
  x.useEffect(() => (Ar(1), () => Ar(-1)), []);
  const t = x.useCallback((r) => {
    q.add(r);
  }, []);
  return /* @__PURE__ */ f(Ja.Provider, { value: { toast: t }, children: [
    e,
    /* @__PURE__ */ n(en, {})
  ] });
}
function Jc() {
  return Kc() ? null : /* @__PURE__ */ n(en, {});
}
let lt = null;
function tn() {
  if (typeof window > "u" || typeof document > "u" || lt) return;
  if (!document.body) {
    lt = new Promise((t) => {
      const r = () => {
        document.body ? (lt = null, tn(), t()) : window.setTimeout(r, 0);
      };
      r();
    });
    return;
  }
  if (document.querySelector("[data-ksk-toast-auto-root]")) return;
  const e = document.createElement("div");
  e.setAttribute("data-ksk-toast-auto-root", ""), document.body.appendChild(e), lt = import("react-dom/client").then(({ createRoot: t }) => {
    t(e).render(/* @__PURE__ */ n(Jc, {}));
  });
}
function Fe(e, t = {}, r) {
  return typeof window > "u" ? "" : (tn(), q.add({
    title: e,
    description: t.description,
    variant: r ?? t.variant,
    duration: t.duration,
    action: t.action
  }));
}
const Ae = ((e, t) => Fe(e, t));
Ae.success = (e, t) => Fe(e, t, "success");
Ae.error = (e, t) => Fe(e, t, "caution");
Ae.info = (e, t) => Fe(e, t, "info");
Ae.warning = (e, t) => Fe(e, t, "warning");
Ae.caution = (e, t) => Fe(e, t, "caution");
Ae.dismiss = (e) => q.dismiss(e);
function lh({
  className: e,
  sidebar: t,
  header: r,
  children: a,
  sidebarWidth: o = "w-64",
  ...s
}) {
  return /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "admin-shell",
      className: u("flex h-screen bg-[var(--Surface-Secondary)]", e),
      ...s,
      children: [
        /* @__PURE__ */ n(
          "aside",
          {
            "data-slot": "admin-sidebar",
            className: u(
              "hidden lg:flex flex-col border-r border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]",
              o
            ),
            children: /* @__PURE__ */ n(ac, { className: "flex-1", children: t })
          }
        ),
        /* @__PURE__ */ f("div", { className: "flex flex-1 flex-col min-w-0", children: [
          r && /* @__PURE__ */ n(
            "header",
            {
              "data-slot": "admin-header",
              className: "flex items-center gap-4 border-b border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] px-6 h-16 shrink-0",
              children: r
            }
          ),
          /* @__PURE__ */ n("main", { "data-slot": "admin-main", className: "flex-1 overflow-auto p-6", children: a })
        ] })
      ]
    }
  );
}
function ch({
  className: e,
  topBar: t,
  bottomNav: r,
  children: a,
  ...o
}) {
  return /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "app-shell",
      className: u("flex flex-col min-h-screen bg-[var(--Surface-Primary)]", e),
      ...o,
      children: [
        t && /* @__PURE__ */ n(
          "header",
          {
            "data-slot": "app-topbar",
            className: "sticky top-0 z-40 flex items-center border-b border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] px-4 h-14 shrink-0",
            children: t
          }
        ),
        /* @__PURE__ */ n(
          "main",
          {
            "data-slot": "app-main",
            className: u("flex-1", r ? "pb-16" : ""),
            children: a
          }
        ),
        r && /* @__PURE__ */ n(
          "nav",
          {
            "data-slot": "app-bottomnav",
            className: "fixed bottom-0 inset-x-0 z-40 flex items-center justify-around border-t border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] h-14",
            children: r
          }
        )
      ]
    }
  );
}
function dh({
  className: e,
  header: t,
  footer: r,
  children: a,
  ...o
}) {
  return /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "marketing-shell",
      className: u("flex flex-col min-h-screen bg-[var(--Surface-Primary)]", e),
      ...o,
      children: [
        t && /* @__PURE__ */ n(
          "header",
          {
            "data-slot": "marketing-header",
            className: "sticky top-0 z-40 flex items-center justify-between border-b border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]/95 backdrop-blur px-6 lg:px-16 h-16 shrink-0",
            children: t
          }
        ),
        /* @__PURE__ */ n("main", { "data-slot": "marketing-main", className: "flex-1", children: a }),
        r && /* @__PURE__ */ n(
          "footer",
          {
            "data-slot": "marketing-footer",
            className: "border-t border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Secondary)] px-6 lg:px-16 py-12",
            children: r
          }
        )
      ]
    }
  );
}
function uh({ className: e, preventDefault: t = !0, onSubmit: r, ...a }) {
  const o = (s) => {
    t && s.preventDefault(), r?.(s);
  };
  return /* @__PURE__ */ n(
    "form",
    {
      "data-slot": "form",
      className: u("flex flex-col gap-6", e),
      onSubmit: o,
      ...a
    }
  );
}
function fh({ className: e, title: t, description: r, children: a, ...o }) {
  return /* @__PURE__ */ f(
    "fieldset",
    {
      "data-slot": "form-section",
      className: u("flex flex-col gap-4", e),
      ...o,
      children: [
        (t || r) && /* @__PURE__ */ f("div", { className: "flex flex-col gap-1", children: [
          t && /* @__PURE__ */ n("legend", { className: "typo-heading-md text-[var(--Text-High-Emphasis)]", children: t }),
          r && /* @__PURE__ */ n("p", { className: "typo-body-sm text-[var(--Text-Medium-Emphasis)]", children: r })
        ] }),
        a
      ]
    }
  );
}
function hh({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "form-actions",
      className: u(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3 pt-4",
        e
      ),
      ...t
    }
  );
}
const ed = se("inline-flex items-baseline gap-0.5 text-[var(--Text-High-Emphasis)]", {
  variants: {
    size: {
      sm: "typo-label-md",
      md: "typo-label-lg",
      lg: "typo-heading-lg",
      xl: "typo-heading-3xl"
    }
  },
  defaultVariants: { size: "md" }
}), td = { sm: "typo-body-xs", md: "typo-body-sm", lg: "typo-body-md", xl: "typo-body-lg" }, rd = { sm: "typo-body-xs", md: "typo-body-xs", lg: "typo-body-sm", xl: "typo-body-lg" };
function _r({ className: e, price: t, maxPrice: r, originalPrice: a, showTaxLabel: o = !0, currency: s = "¥", size: l = "md", ...i }) {
  const c = (p) => p.toLocaleString("ja-JP"), d = a != null && a > t, m = r != null && r > t, h = l ?? "md";
  return /* @__PURE__ */ f("div", { "data-slot": "price-display", className: u("flex flex-col", e), role: "group", "aria-label": `${s}${c(t)} 税込`, ...i, children: [
    d && /* @__PURE__ */ f("span", { "aria-hidden": !0, className: u("text-[var(--Text-Low-Emphasis)] line-through", td[h]), children: [
      s,
      c(a)
    ] }),
    /* @__PURE__ */ f("span", { "aria-hidden": !0, className: u(ed({ size: l }), d && "text-[var(--Text-Caution)]"), children: [
      m ? /* @__PURE__ */ f(de, { children: [
        s,
        c(t),
        "〜",
        s,
        c(r)
      ] }) : /* @__PURE__ */ f(de, { children: [
        s,
        c(t)
      ] }),
      o && /* @__PURE__ */ n("span", { className: u("ml-0.5 text-[var(--Text-Low-Emphasis)]", rd[h]), children: "税込" })
    ] })
  ] });
}
function ad({ size: e = 14, className: t }) {
  return /* @__PURE__ */ n("svg", { width: e, height: e, viewBox: "0 0 16 16", fill: "currentColor", className: t, "aria-hidden": !0, children: /* @__PURE__ */ n("path", { d: "M8 1.3l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9L4.4 12.3l.7-4L2.2 5.5l4-.6L8 1.3z" }) });
}
const nd = {
  sm: { icon: 12, val: "typo-label-sm", cnt: "typo-body-xs" },
  md: { icon: 14, val: "typo-label-md", cnt: "typo-body-sm" },
  lg: { icon: 18, val: "typo-label-lg", cnt: "typo-body-md" }
};
function zr({ className: e, rating: t, reviewCount: r, size: a = "sm", showCount: o = !0, showValue: s = !0, ...l }) {
  const i = Math.max(0, Math.min(5, t)), { icon: c, val: d, cnt: m } = nd[a];
  return /* @__PURE__ */ f("div", { "data-slot": "rating-display", className: u("inline-flex items-center gap-0.5", e), role: "img", "aria-label": `評価 ${i.toFixed(1)} / 5${r != null ? ` (${r}件)` : ""}`, ...l, children: [
    /* @__PURE__ */ n(ad, { size: c, className: "text-[var(--Brand-Primary)]" }),
    s && /* @__PURE__ */ n("span", { className: u("text-[var(--Brand-Primary)]", d), children: i.toFixed(2) }),
    o && r != null && /* @__PURE__ */ f("span", { className: u("text-[var(--Text-Low-Emphasis)]", m), children: [
      "(",
      r.toLocaleString("ja-JP"),
      ")"
    ] })
  ] });
}
function Yr({ size: e = 14 }) {
  return /* @__PURE__ */ n("svg", { width: e, height: e, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ n("path", { d: "M4 8h8", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) });
}
function $r({ size: e = 14 }) {
  return /* @__PURE__ */ n("svg", { width: e, height: e, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ n("path", { d: "M8 4v8M4 8h8", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) });
}
function Rr({ size: e = 14 }) {
  return /* @__PURE__ */ n("svg", { width: e, height: e, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ n("path", { d: "M3 4h10M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1M5 4v8a1 1 0 001 1h4a1 1 0 001-1V4", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) });
}
function mh({ className: e, value: t, min: r = 1, max: a = 99, onChange: o, disabled: s = !1, size: l = "md", showTrash: i = !1, onDelete: c, ...d }) {
  const m = i && t <= r, h = t > r && !s, p = t < a && !s, v = () => {
    if (m) {
      c?.();
      return;
    }
    h && o?.(t - 1);
  }, b = () => {
    p && o?.(t + 1);
  };
  return l === "sm" ? /* @__PURE__ */ f("div", { "data-slot": "quantity-selector", className: u("inline-flex h-9 w-[108px] items-center justify-between rounded-full bg-[var(--Surface-Tertiary)] px-2.5", s && "opacity-50", e), role: "group", "aria-label": "数量選択", ...d, children: [
    /* @__PURE__ */ n("button", { type: "button", className: u("flex size-7 items-center justify-center rounded-full", h || m ? "text-[var(--Object-High-Emphasis)]" : "text-[var(--Object-Disable)]"), onClick: v, disabled: !(h || m && !s), "aria-label": m ? "削除" : "数量を減らす", children: m ? /* @__PURE__ */ n(Rr, { size: 14 }) : /* @__PURE__ */ n(Yr, { size: 14 }) }),
    /* @__PURE__ */ n("span", { className: u("w-7 text-center typo-label-md select-none", s ? "text-[var(--Text-Disable)]" : "text-[var(--Text-High-Emphasis)]"), "aria-live": "polite", children: t }),
    /* @__PURE__ */ n("button", { type: "button", className: u("flex size-7 items-center justify-center rounded-full", p ? "text-[var(--Object-High-Emphasis)]" : "text-[var(--Object-Disable)]"), onClick: b, disabled: !p, "aria-label": "数量を増やす", children: /* @__PURE__ */ n($r, { size: 14 }) })
  ] }) : /* @__PURE__ */ f("div", { "data-slot": "quantity-selector", className: u("inline-flex items-center gap-3", e), role: "group", "aria-label": "数量選択", ...d, children: [
    /* @__PURE__ */ n("button", { type: "button", className: u("flex size-10 items-center justify-center rounded-full border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] transition-colors", h || m ? "text-[var(--Object-High-Emphasis)] hover:bg-[var(--Surface-Tertiary)]" : "text-[var(--Object-Disable)]"), onClick: v, disabled: !(h || m && !s), "aria-label": m ? "削除" : "数量を減らす", children: m ? /* @__PURE__ */ n(Rr, { size: 18 }) : /* @__PURE__ */ n(Yr, { size: 18 }) }),
    /* @__PURE__ */ n("span", { className: u("flex h-10 w-12 items-center justify-center rounded-lg border border-[var(--Border-Medium-Emphasis)] typo-label-lg select-none", s ? "bg-[var(--Surface-Tertiary)] text-[var(--Text-Disable)]" : "bg-[var(--Surface-Secondary)] text-[var(--Text-High-Emphasis)]"), "aria-live": "polite", children: t }),
    /* @__PURE__ */ n("button", { type: "button", className: u("flex size-10 items-center justify-center rounded-full border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] transition-colors", p ? "text-[var(--Object-High-Emphasis)] hover:bg-[var(--Surface-Tertiary)]" : "text-[var(--Object-Disable)]"), onClick: b, disabled: !p, "aria-label": "数量を増やす", children: /* @__PURE__ */ n($r, { size: 18 }) })
  ] });
}
function ph({ className: e, lineItems: t, totalLabel: r = "合計（税込）", totalValue: a, ctaLabel: o, onCTAClick: s, ctaDisabled: l = !1, fixed: i = !1, ...c }) {
  const d = /* @__PURE__ */ f("div", { className: "space-y-3 px-4 py-3", children: [
    t?.map((m) => /* @__PURE__ */ f("div", { className: "flex items-center justify-between typo-body-md", children: [
      /* @__PURE__ */ n("span", { className: "text-[var(--Text-Medium-Emphasis)]", children: m.label }),
      /* @__PURE__ */ n("span", { className: "text-[var(--Text-High-Emphasis)]", children: m.value })
    ] }, m.label)),
    t && t.length > 0 && /* @__PURE__ */ n("hr", { className: "border-[var(--Border-Low-Emphasis)]" }),
    /* @__PURE__ */ f("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ n("span", { className: "typo-heading-md text-[var(--Text-High-Emphasis)]", children: r }),
      /* @__PURE__ */ n("span", { className: "typo-heading-lg text-[var(--Text-High-Emphasis)]", children: a })
    ] }),
    /* @__PURE__ */ n("button", { "data-slot": "button", type: "button", className: u("flex h-14 w-full items-center justify-center rounded-full bg-[var(--Brand-Primary)] typo-label-lg text-[var(--Text-on-Inverse)] transition-colors hover:bg-[var(--Hover-Primary-Button)] cursor-pointer", l && "opacity-50 cursor-not-allowed"), onClick: s, disabled: l, children: o })
  ] });
  return /* @__PURE__ */ n("div", { "data-slot": "order-summary", className: u("border-t border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]", i && "fixed inset-x-0 bottom-0 z-30 mx-auto max-w-lg", e), ...c, children: d });
}
function Vr({ filled: e = !1, size: t = 20 }) {
  return /* @__PURE__ */ n(
    "svg",
    {
      width: t,
      height: t,
      viewBox: "0 0 24 24",
      fill: e ? "var(--Caution-Base)" : "none",
      stroke: e ? "var(--Caution-Base)" : "var(--Object-High-Emphasis)",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: /* @__PURE__ */ n("path", { d: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" })
    }
  );
}
function qr({ label: e, variant: t = "default" }) {
  return /* @__PURE__ */ n(
    "span",
    {
      className: u(
        "inline-flex items-center rounded-sm px-1.5 py-0.5 typo-label-xs",
        {
          default: "bg-[var(--Surface-Secondary)] text-[var(--Text-High-Emphasis)]",
          brand: "bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)]",
          caution: "bg-[var(--Surface-Caution)] text-[var(--Text-Caution)]",
          success: "bg-[var(--Surface-Success)] text-[var(--Text-Success)]"
        }[t]
      ),
      children: e
    }
  );
}
function od({
  className: e,
  name: t,
  imageUrl: r,
  imageAlt: a,
  price: o,
  originalPrice: s,
  rating: l,
  reviewCount: i,
  shopName: c,
  tags: d = [],
  isFavorite: m = !1,
  onFavoriteToggle: h,
  href: p,
  onCardClick: v,
  ranking: b,
  deliveryLabel: g,
  orientation: w = "vertical",
  showCartButton: y = !1,
  onCartAdd: S,
  cartButtonLabel: M = "カートに追加",
  ...N
}) {
  const k = s && s > o ? Math.round((s - o) / s * 100) : null, C = p ? /* @__PURE__ */ n(
    "a",
    {
      href: p,
      "data-slot": "card-link",
      className: "absolute inset-0 z-[1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--Focus-High-Emphasis)] rounded-lg",
      "aria-label": t,
      children: /* @__PURE__ */ n("span", { className: "sr-only", children: t })
    }
  ) : v ? /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      "data-slot": "card-link",
      className: "absolute inset-0 z-[1] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--Focus-High-Emphasis)] rounded-lg",
      "aria-label": t,
      onClick: v,
      children: /* @__PURE__ */ n("span", { className: "sr-only", children: t })
    }
  ) : null;
  return w === "horizontal" ? /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "product-card",
      "data-orientation": "horizontal",
      className: u(
        "group relative flex rounded-lg bg-[var(--Surface-Primary)]",
        e
      ),
      ...N,
      children: [
        C,
        /* @__PURE__ */ f("div", { className: "relative h-auto w-28 shrink-0 overflow-hidden rounded-lg", children: [
          /* @__PURE__ */ n(
            "img",
            {
              src: r,
              alt: a ?? t,
              className: "h-full w-full object-cover",
              loading: "lazy"
            }
          ),
          h && /* @__PURE__ */ n("div", { className: "absolute bottom-1 right-1 z-10", children: /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "flex size-8 items-center justify-center rounded-full border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)]/80 backdrop-blur-sm",
              onClick: (E) => {
                E.preventDefault(), E.stopPropagation(), h();
              },
              "aria-label": m ? "お気に入りから削除" : "お気に入りに追加",
              children: /* @__PURE__ */ n(Vr, { filled: m, size: 16 })
            }
          ) })
        ] }),
        /* @__PURE__ */ f("div", { className: "flex min-w-0 flex-1 flex-col justify-between py-1 pl-3 pr-1", children: [
          /* @__PURE__ */ f("div", { className: "space-y-0.5", children: [
            c && /* @__PURE__ */ n("p", { className: "truncate typo-body-sm text-[var(--Text-Low-Emphasis)]", children: c }),
            /* @__PURE__ */ n("h3", { className: "line-clamp-2 typo-body-md text-[var(--Text-High-Emphasis)]", children: t })
          ] }),
          /* @__PURE__ */ f("div", { className: "mt-1 space-y-0.5", children: [
            /* @__PURE__ */ f("div", { className: "flex flex-wrap items-center gap-2", children: [
              l != null && /* @__PURE__ */ n(
                zr,
                {
                  rating: l,
                  reviewCount: i,
                  size: "sm"
                }
              ),
              g && /* @__PURE__ */ n("p", { className: "typo-body-xs text-[var(--Text-Medium-Emphasis)]", children: g })
            ] }),
            /* @__PURE__ */ n(
              _r,
              {
                price: o,
                originalPrice: s,
                size: "sm",
                showTaxLabel: !1
              }
            )
          ] })
        ] })
      ]
    }
  ) : /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "product-card",
      "data-orientation": "vertical",
      className: u(
        "group relative flex min-w-[140px] flex-col gap-1 bg-[var(--Surface-Primary)]",
        e
      ),
      ...N,
      children: [
        C,
        /* @__PURE__ */ f("div", { className: "relative", children: [
          /* @__PURE__ */ f("div", { className: "aspect-square overflow-hidden rounded-lg", children: [
            /* @__PURE__ */ n(
              "img",
              {
                src: r,
                alt: a ?? t,
                className: "h-full w-full object-cover transition-transform duration-200 group-hover:scale-105",
                loading: "lazy"
              }
            ),
            b != null && /* @__PURE__ */ n("span", { className: "absolute left-1.5 top-1.5 z-[5] flex size-7 items-center justify-center rounded-full bg-[var(--Brand-Primary)] typo-label-xs text-[var(--Text-on-Inverse)] shadow-[var(--shadow-md)]", children: b }),
            /* @__PURE__ */ f("div", { className: "absolute inset-x-1 bottom-1 z-[3] flex flex-wrap gap-1", children: [
              k && /* @__PURE__ */ n(qr, { label: `${k}%OFF`, variant: "caution" }),
              d.map((E) => /* @__PURE__ */ n(qr, { ...E }, E.label))
            ] })
          ] }),
          h && /* @__PURE__ */ n("div", { className: "absolute bottom-1.5 right-1.5 z-[4]", children: /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "flex size-9 items-center justify-center rounded-full border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)]/80 backdrop-blur-sm transition-colors hover:bg-[var(--Surface-Tertiary)]",
              onClick: (E) => {
                E.preventDefault(), E.stopPropagation(), h();
              },
              "aria-label": m ? "お気に入りから削除" : "お気に入りに追加",
              children: /* @__PURE__ */ n(Vr, { filled: m, size: 20 })
            }
          ) })
        ] }),
        /* @__PURE__ */ f("div", { className: "flex flex-1 flex-col gap-0.5", children: [
          c && /* @__PURE__ */ n("p", { className: "truncate typo-body-sm text-[var(--Text-Low-Emphasis)]", children: c }),
          /* @__PURE__ */ n("h3", { className: "line-clamp-2 typo-body-md text-[var(--Text-High-Emphasis)]", children: t }),
          (l != null || g) && /* @__PURE__ */ f("div", { className: "flex flex-wrap items-center gap-2", children: [
            l != null && /* @__PURE__ */ n(
              zr,
              {
                rating: l,
                reviewCount: i,
                size: "sm"
              }
            ),
            g && /* @__PURE__ */ n("p", { className: "typo-body-xs text-[var(--Text-Medium-Emphasis)]", children: g })
          ] }),
          /* @__PURE__ */ n(
            _r,
            {
              price: o,
              originalPrice: s,
              size: "md",
              showTaxLabel: !1
            }
          )
        ] }),
        y && /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            "data-slot": "button",
            className: "relative z-10 flex h-9 w-full items-center justify-center gap-1 rounded-full bg-[var(--Brand-Primary)] typo-label-md text-[var(--Text-on-Inverse)] transition-colors hover:bg-[var(--Hover-Primary-Button)] cursor-pointer",
            onClick: (E) => {
              E.preventDefault(), E.stopPropagation(), S?.();
            },
            children: M
          }
        )
      ]
    }
  );
}
const sd = {
  sm: "w-40",
  md: "w-[200px]",
  lg: "w-[240px]"
};
function vh({
  className: e,
  title: t,
  subtitle: r,
  moreHref: a,
  moreLabel: o = "もっと見る",
  onMoreClick: s,
  products: l,
  cardSize: i = "sm",
  showRanking: c = !1,
  showCartButton: d = !1,
  ...m
}) {
  return /* @__PURE__ */ f(
    "section",
    {
      "data-slot": "product-carousel",
      className: u("py-4", e),
      ...m,
      children: [
        /* @__PURE__ */ f("div", { className: "flex items-center justify-between px-4 mb-3", children: [
          /* @__PURE__ */ f("div", { children: [
            /* @__PURE__ */ n("h2", { className: "typo-heading-lg text-[var(--Text-High-Emphasis)]", children: t }),
            r && /* @__PURE__ */ n("p", { className: "typo-body-sm text-[var(--Text-Medium-Emphasis)] mt-0.5", children: r })
          ] }),
          (a || s) && /* @__PURE__ */ f(
            "a",
            {
              href: a,
              onClick: s,
              className: "typo-label-sm text-[var(--Text-Accent-Primary)] shrink-0 cursor-pointer hover:underline",
              children: [
                o,
                " →"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ f(
          "div",
          {
            className: u(
              "flex overflow-x-auto pl-4 pb-2 gap-3 scrollbar-hide",
              d && "items-stretch"
            ),
            children: [
              l.map((h, p) => /* @__PURE__ */ n(
                "div",
                {
                  className: u("shrink-0", sd[i]),
                  children: /* @__PURE__ */ n(
                    od,
                    {
                      ...h,
                      ranking: c ? p + 1 : h.ranking,
                      showCartButton: d,
                      className: u(
                        h.className,
                        d && "h-full"
                      )
                    }
                  )
                },
                h.name + p
              )),
              /* @__PURE__ */ n("div", { className: "shrink-0 w-4", "aria-hidden": !0 })
            ]
          }
        )
      ]
    }
  );
}
function bh({
  images: e,
  aspectRatio: t = "banner",
  showDots: r = !0,
  showArrows: a = !0,
  autoPlay: o = 0,
  className: s,
  ...l
}) {
  const i = x.useRef(null), [c, d] = x.useState(0), m = e.length, h = t === "square" ? "aspect-square" : t === "video" ? "aspect-video" : "aspect-[2/1]";
  x.useEffect(() => {
    const v = i.current;
    if (!v) return;
    const b = new IntersectionObserver(
      (g) => {
        for (const w of g)
          if (w.isIntersecting) {
            const y = Number(w.target.dataset.index);
            isNaN(y) || d(y);
          }
      },
      { root: v, threshold: 0.6 }
    );
    return v.querySelectorAll("[data-slide]").forEach((g) => b.observe(g)), () => b.disconnect();
  }, [m]), x.useEffect(() => {
    if (o <= 0 || m <= 1) return;
    const v = setInterval(() => p((c + 1) % m), o);
    return () => clearInterval(v);
  }, [o, c, m]);
  function p(v) {
    const b = i.current?.children[v];
    b && i.current.scrollTo({
      left: b.offsetLeft,
      behavior: "smooth"
    });
  }
  return m ? /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "image-carousel",
      className: u("group/carousel relative", s),
      ...l,
      children: [
        /* @__PURE__ */ n(
          "div",
          {
            ref: i,
            className: "flex snap-x snap-mandatory overflow-x-auto scroll-smooth",
            style: { scrollbarWidth: "none" },
            children: e.map((v, b) => /* @__PURE__ */ n(
              "div",
              {
                "data-slide": !0,
                "data-index": b,
                className: "w-full shrink-0 snap-start px-4 lg:px-0",
                children: v.href ? /* @__PURE__ */ n("a", { href: v.href, className: "block", children: /* @__PURE__ */ n(
                  "img",
                  {
                    src: v.src,
                    alt: v.alt,
                    loading: b === 0 ? "eager" : "lazy",
                    className: u(
                      "w-full rounded-lg object-cover",
                      h
                    )
                  }
                ) }) : /* @__PURE__ */ n(
                  "img",
                  {
                    src: v.src,
                    alt: v.alt,
                    loading: b === 0 ? "eager" : "lazy",
                    className: u(
                      "w-full rounded-lg object-cover",
                      h
                    )
                  }
                )
              },
              b
            ))
          }
        ),
        a && m > 1 && /* @__PURE__ */ f(de, { children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: () => p(c <= 0 ? m - 1 : c - 1),
              "aria-label": "前へ",
              className: "absolute left-2 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] shadow-[var(--shadow-md)] transition-opacity lg:flex lg:opacity-0 lg:group-hover/carousel:opacity-100",
              children: /* @__PURE__ */ n(
                "svg",
                {
                  width: "20",
                  height: "20",
                  viewBox: "0 0 20 20",
                  fill: "none",
                  children: /* @__PURE__ */ n(
                    "path",
                    {
                      d: "M12 15L7 10L12 5",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    }
                  )
                }
              )
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: () => p(c >= m - 1 ? 0 : c + 1),
              "aria-label": "次へ",
              className: "absolute right-2 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] shadow-[var(--shadow-md)] transition-opacity lg:flex lg:opacity-0 lg:group-hover/carousel:opacity-100",
              children: /* @__PURE__ */ n(
                "svg",
                {
                  width: "20",
                  height: "20",
                  viewBox: "0 0 20 20",
                  fill: "none",
                  children: /* @__PURE__ */ n(
                    "path",
                    {
                      d: "M8 5L13 10L8 15",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    }
                  )
                }
              )
            }
          )
        ] }),
        r && m > 1 && /* @__PURE__ */ n("div", { className: "mt-2 flex items-center justify-center gap-1.5 lg:hidden", children: e.map((v, b) => /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            onClick: () => p(b),
            "aria-label": `スライド ${b + 1}`,
            className: u(
              "size-2 rounded-full transition-colors",
              b === c ? "bg-[var(--Text-High-Emphasis)]" : "bg-[var(--Surface-Tertiary)]"
            )
          },
          b
        )) })
      ]
    }
  ) : null;
}
function gh({ className: e, items: t, variant: r = "default", pillPosition: a = "fixed", ...o }) {
  return r === "pill" ? /* @__PURE__ */ n(ld, { className: e, items: t, pillPosition: a, ...o }) : /* @__PURE__ */ n(id, { className: e, items: t, ...o });
}
function id({ className: e, items: t, ...r }) {
  return /* @__PURE__ */ n(
    "nav",
    {
      "data-slot": "bottom-tab-bar",
      "aria-label": "メインナビゲーション",
      className: u(
        "fixed inset-x-0 bottom-0 z-50",
        "border-t border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]",
        "pb-[env(safe-area-inset-bottom)] lg:hidden",
        e
      ),
      ...r,
      children: /* @__PURE__ */ n("div", { className: "flex h-14 items-center justify-around px-1", children: t.map((a) => /* @__PURE__ */ n(rn, { item: a, compact: !1 }, a.label)) })
    }
  );
}
function ld({ className: e, items: t, pillPosition: r = "fixed", ...a }) {
  return /* @__PURE__ */ n(
    "nav",
    {
      "data-slot": "bottom-nav-pill",
      "aria-label": "メインナビゲーション",
      className: u(
        "z-50 lg:hidden",
        r === "fixed" ? "fixed" : "absolute",
        // 位置: 画面下部に余白を持ってフロート
        "bottom-[calc(env(safe-area-inset-bottom)+12px)] left-1/2 -translate-x-1/2",
        // ピル形状 + Liquid Glass
        "flex items-center rounded-full glass glass-specular",
        "px-3 h-[58px] gap-0",
        e
      ),
      ...a,
      children: t.map((o) => /* @__PURE__ */ n(rn, { item: o, compact: !0 }, o.label))
    }
  );
}
function rn({ item: e, compact: t }) {
  const r = e.href ? "a" : "button", a = e.href ? { href: e.href } : { type: "button", onClick: e.onClick };
  return /* @__PURE__ */ f(
    r,
    {
      className: u(
        "relative flex flex-col items-center justify-center gap-0.5 transition-opacity active:opacity-60",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--Focus-High-Emphasis)] rounded-full",
        t ? "w-14 h-full" : "flex-1 pt-1 pb-1 min-w-0",
        e.isActive ? "text-[var(--Text-Accent-Primary)]" : "text-[var(--Text-High-Emphasis)] opacity-60"
      ),
      "aria-current": e.isActive ? "page" : void 0,
      ...a,
      children: [
        /* @__PURE__ */ f(
          "span",
          {
            className: u(
              "relative flex items-center justify-center rounded-full transition-colors",
              t ? "w-12 h-8" : "h-7 w-14",
              e.isActive && (t ? "bg-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_1px_4px_rgba(0,0,0,0.08)]" : "bg-[var(--Surface-Accent-Primary-Light)]")
            ),
            children: [
              e.isActive && e.activeIcon ? e.activeIcon : e.icon,
              e.badgeCount != null && e.badgeCount > 0 && /* @__PURE__ */ n("span", { className: "absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-[var(--Caution-Base)] typo-label-xs text-[var(--Text-on-Inverse)]", children: e.badgeCount > 99 ? "99+" : e.badgeCount })
            ]
          }
        ),
        !t && /* @__PURE__ */ n("span", { className: u("truncate max-w-full px-0.5 text-center", e.isActive ? "typo-label-xs" : "typo-body-xs"), children: e.label })
      ]
    }
  );
}
function cd({ filter: e }) {
  const [t, r] = x.useState(!1), a = x.useRef(null), o = e.options && e.options.length > 0, s = e.isActive || !!e.selectedValue;
  x.useEffect(() => {
    if (!t) return;
    const i = (c) => {
      a.current && !a.current.contains(c.target) && r(!1);
    };
    return document.addEventListener("mousedown", i), () => document.removeEventListener("mousedown", i);
  }, [t]);
  const l = s && e.value ? e.value : s && e.selectedValue ? e.options?.find((i) => i.value === e.selectedValue)?.label ?? e.label : e.label;
  return /* @__PURE__ */ f("div", { ref: a, className: "relative shrink-0", children: [
    /* @__PURE__ */ f(
      "button",
      {
        type: "button",
        onClick: () => {
          o ? r(!t) : e.onClick?.();
        },
        className: u(
          "flex h-9 items-center gap-0.5 rounded-full px-2.5 typo-body-md transition-colors max-w-[200px]",
          s ? "bg-[var(--Surface-Accent-Primary-Light)] typo-label-md text-[var(--Text-Accent-Primary)]" : "bg-[var(--Surface-Tertiary)] text-[var(--Text-High-Emphasis)] hover:opacity-80"
        ),
        "aria-expanded": o ? t : void 0,
        children: [
          /* @__PURE__ */ n("span", { className: "truncate", children: l }),
          /* @__PURE__ */ n("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", className: u("shrink-0 transition-transform", t && "rotate-180"), children: /* @__PURE__ */ n("path", { d: "M4 6L8 10L12 6", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) })
        ]
      }
    ),
    o && t && /* @__PURE__ */ f("div", { className: "absolute left-0 top-full z-50 mt-1 min-w-[180px] rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] py-1 shadow-[var(--shadow-lg)] animate-fade-in", children: [
      e.selectedValue && /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "flex w-full items-center px-3 py-2 typo-body-sm text-[var(--Text-Low-Emphasis)] hover:bg-[var(--Surface-Secondary)] transition-colors text-left",
          onClick: () => {
            e.onSelect?.(null), r(!1);
          },
          children: "選択を解除"
        }
      ),
      e.options.map((i) => /* @__PURE__ */ f(
        "button",
        {
          type: "button",
          className: u(
            "flex w-full items-center gap-2 px-3 py-2 typo-body-md text-left transition-colors hover:bg-[var(--Surface-Secondary)]",
            e.selectedValue === i.value ? "text-[var(--Text-Accent-Primary)] bg-[var(--Surface-Accent-Primary-Light)]" : "text-[var(--Text-High-Emphasis)]"
          ),
          onClick: () => {
            e.onSelect?.(i.value), r(!1);
          },
          children: [
            e.selectedValue === i.value && /* @__PURE__ */ n("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", className: "shrink-0", children: /* @__PURE__ */ n("path", { d: "M11 4L5.5 9.5L3 7", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }),
            i.label
          ]
        },
        i.value
      ))
    ] })
  ] });
}
function xh({
  filters: e,
  resultCount: t,
  sortLabel: r,
  sortOptions: a,
  selectedSort: o,
  onSortSelect: s,
  onSortClick: l,
  onMoreFilters: i,
  activeFilterCount: c,
  className: d,
  ...m
}) {
  const [h, p] = x.useState(!1), v = x.useRef(null);
  return x.useEffect(() => {
    if (!h) return;
    const b = (g) => {
      v.current && !v.current.contains(g.target) && p(!1);
    };
    return document.addEventListener("mousedown", b), () => document.removeEventListener("mousedown", b);
  }, [h]), /* @__PURE__ */ f(
    "nav",
    {
      "aria-label": "フィルター",
      "data-slot": "filter-bar",
      className: u("space-y-2", d),
      ...m,
      children: [
        /* @__PURE__ */ f("div", { className: "flex items-center gap-1 overflow-x-auto scrollbar-hide", children: [
          /* @__PURE__ */ f(
            "button",
            {
              type: "button",
              className: "relative flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--Surface-Tertiary)] text-[var(--Text-High-Emphasis)] transition-colors hover:opacity-80",
              onClick: i,
              "aria-label": "絞り込み",
              children: [
                /* @__PURE__ */ n("svg", { width: "20", height: "20", viewBox: "0 0 20 20", fill: "none", children: /* @__PURE__ */ n("path", { d: "M3 5h14M5 10h10M7 15h6", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) }),
                c != null && c > 0 && /* @__PURE__ */ n("span", { className: "absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-[var(--Brand-Primary)] typo-label-xs text-[var(--Text-on-Inverse)]", children: c })
              ]
            }
          ),
          e.map((b) => /* @__PURE__ */ n(cd, { filter: b }, b.label))
        ] }),
        (t !== void 0 || r || a) && /* @__PURE__ */ f("div", { className: "flex items-center justify-between", children: [
          t !== void 0 && /* @__PURE__ */ f("span", { className: "typo-body-md text-[var(--Text-High-Emphasis)]", children: [
            "対象商品: ",
            /* @__PURE__ */ n("strong", { className: "typo-heading-md", children: t.toLocaleString() }),
            " 件"
          ] }),
          a ? /* @__PURE__ */ f("div", { ref: v, className: "relative", children: [
            /* @__PURE__ */ f(
              "button",
              {
                type: "button",
                onClick: () => p(!h),
                className: "flex h-9 shrink-0 items-center gap-0.5 rounded-full bg-[var(--Surface-Tertiary)] px-3 typo-body-md text-[var(--Text-High-Emphasis)] hover:opacity-80",
                children: [
                  /* @__PURE__ */ n("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ n("path", { d: "M3 4h7M3 8h5M3 12h3M13 5v8M11 11l2 2 2-2", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) }),
                  a.find((b) => b.value === o)?.label ?? r ?? "並べ替え"
                ]
              }
            ),
            h && /* @__PURE__ */ n("div", { className: "absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] py-1 shadow-[var(--shadow-lg)] animate-fade-in", children: a.map((b) => /* @__PURE__ */ f(
              "button",
              {
                type: "button",
                className: u(
                  "flex w-full items-center gap-2 px-3 py-2 typo-body-md text-left transition-colors hover:bg-[var(--Surface-Secondary)]",
                  o === b.value ? "text-[var(--Text-Accent-Primary)]" : "text-[var(--Text-High-Emphasis)]"
                ),
                onClick: () => {
                  s?.(b.value), p(!1);
                },
                children: [
                  o === b.value && /* @__PURE__ */ n("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", className: "shrink-0", children: /* @__PURE__ */ n("path", { d: "M11 4L5.5 9.5L3 7", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }),
                  b.label
                ]
              },
              b.value
            )) })
          ] }) : l && /* @__PURE__ */ f(
            "button",
            {
              type: "button",
              onClick: l,
              className: "flex h-9 shrink-0 items-center gap-0.5 rounded-full bg-[var(--Surface-Tertiary)] px-3 typo-body-md text-[var(--Text-High-Emphasis)] hover:opacity-80",
              children: [
                /* @__PURE__ */ n("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ n("path", { d: "M3 4h7M3 8h5M3 12h3M13 5v8M11 11l2 2 2-2", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) }),
                r ?? "並べ替え"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function an({ rating: e, size: t = 14 }) {
  return /* @__PURE__ */ n("div", { className: "flex gap-0.5", "aria-label": `${e}点 / 5点`, children: [1, 2, 3, 4, 5].map((r) => /* @__PURE__ */ n("svg", { width: t, height: t, viewBox: "0 0 14 14", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ n(
    "path",
    {
      d: "M7 1l1.6 3.3 3.6.5-2.6 2.5.6 3.6L7 9.2 3.8 11l.6-3.6L2 4.9l3.6-.5L7 1z",
      fill: r <= e ? "#F59E0B" : "var(--Border-Medium-Emphasis)"
    }
  ) }, r)) });
}
function yh({
  reviewer: e,
  avatarChar: t,
  avatarSrc: r,
  rating: a,
  title: o,
  body: s,
  date: l,
  helpfulCount: i = 0,
  onHelpful: c,
  helpful: d = !1,
  className: m
}) {
  const h = t ?? e.slice(0, 1);
  return /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "review-card",
      className: u(
        "bg-[var(--Surface-Primary)] rounded-xl border border-[var(--Border-Low-Emphasis)] p-4",
        m
      ),
      children: [
        /* @__PURE__ */ f("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ n("div", { className: "w-9 h-9 rounded-full shrink-0 overflow-hidden bg-gradient-to-br from-[var(--Brand-Primary)] to-[var(--Brand-Light)] flex items-center justify-center", children: r ? /* @__PURE__ */ n("img", { src: r, alt: e, className: "w-full h-full object-cover" }) : /* @__PURE__ */ n("span", { className: "text-white text-sm font-bold", children: h }) }),
          /* @__PURE__ */ f("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ n("p", { className: "typo-label-sm text-[var(--Text-High-Emphasis)] font-semibold truncate", children: e }),
            /* @__PURE__ */ n("p", { className: "typo-body-xs text-[var(--Text-Low-Emphasis)]", children: l })
          ] }),
          /* @__PURE__ */ n(an, { rating: a })
        ] }),
        o && /* @__PURE__ */ n("p", { className: "typo-label-sm text-[var(--Text-High-Emphasis)] font-semibold mb-1", children: o }),
        /* @__PURE__ */ n("p", { className: "typo-body-sm text-[var(--Text-Medium-Emphasis)] leading-relaxed", children: s }),
        c && /* @__PURE__ */ f(
          "button",
          {
            onClick: c,
            "aria-pressed": d,
            className: u(
              "inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full border typo-label-xs transition-colors",
              d ? "border-[var(--Brand-Primary)] text-[var(--Brand-Primary)] bg-[var(--Brand-Ultra-Light)]" : "border-[var(--Border-Medium-Emphasis)] text-[var(--Text-Low-Emphasis)] hover:border-[var(--Brand-Primary)] hover:text-[var(--Brand-Primary)]"
            ),
            children: [
              /* @__PURE__ */ n("svg", { width: "12", height: "12", viewBox: "0 0 12 12", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ n("path", { d: "M2 8V5.5L5 2l.5 2H10l-.5 5H3.5L2 8z", stroke: "currentColor", strokeWidth: "1.2", strokeLinejoin: "round" }) }),
              "参考になった ",
              i > 0 && `(${i})`
            ]
          }
        )
      ]
    }
  );
}
function wh({
  averageRating: e,
  totalCount: t,
  distribution: r,
  className: a
}) {
  const o = Math.max(...r, 1);
  return /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "review-summary",
      className: u(
        "bg-[var(--Surface-Primary)] rounded-xl border border-[var(--Border-Low-Emphasis)] p-4",
        a
      ),
      children: [
        /* @__PURE__ */ f("div", { className: "flex items-end gap-3 mb-3", children: [
          /* @__PURE__ */ n("span", { className: "text-4xl font-black text-[var(--Text-High-Emphasis)] leading-none tabular-nums", children: e.toFixed(1) }),
          /* @__PURE__ */ f("div", { className: "pb-0.5", children: [
            /* @__PURE__ */ n(an, { rating: Math.round(e), size: 16 }),
            /* @__PURE__ */ f("p", { className: "typo-body-xs text-[var(--Text-Low-Emphasis)] mt-0.5", children: [
              t.toLocaleString(),
              "件の口コミ"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ n("div", { className: "flex flex-col gap-1.5", children: r.map((s, l) => {
          const i = 5 - l, c = Math.round(s / o * 100);
          return /* @__PURE__ */ f("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ n("span", { className: "typo-body-xs text-[var(--Text-Medium-Emphasis)] w-3 text-right", children: i }),
            /* @__PURE__ */ n("div", { className: "flex-1 h-1.5 bg-[var(--Surface-Tertiary)] rounded-full overflow-hidden", children: /* @__PURE__ */ n(
              "div",
              {
                className: "h-full bg-[#F59E0B] rounded-full transition-all",
                style: { width: `${c}%` }
              }
            ) }),
            /* @__PURE__ */ n("span", { className: "typo-body-xs text-[var(--Text-Low-Emphasis)] w-6 text-right", children: s })
          ] }, i);
        }) })
      ]
    }
  );
}
function kh({ items: e, className: t, ...r }) {
  const [a, o] = x.useState(!1), s = x.useRef(null);
  return x.useEffect(() => {
    if (!a) return;
    const l = (i) => {
      s.current && !s.current.contains(i.target) && o(!1);
    };
    return document.addEventListener("mousedown", l), () => document.removeEventListener("mousedown", l);
  }, [a]), /* @__PURE__ */ f("div", { "data-slot": "kebab-menu", ref: s, className: u("relative", t), ...r, children: [
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        className: "flex size-8 items-center justify-center rounded-lg hover:bg-[var(--Surface-Secondary)] transition-colors",
        onClick: () => o(!a),
        "aria-label": "メニュー",
        "aria-expanded": a,
        children: /* @__PURE__ */ f("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", className: "text-[var(--Text-Low-Emphasis)]", children: [
          /* @__PURE__ */ n("circle", { cx: "8", cy: "3", r: "1.5" }),
          /* @__PURE__ */ n("circle", { cx: "8", cy: "8", r: "1.5" }),
          /* @__PURE__ */ n("circle", { cx: "8", cy: "13", r: "1.5" })
        ] })
      }
    ),
    a && /* @__PURE__ */ n("div", { className: "absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] py-1 shadow-[var(--shadow-lg)] animate-fade-in", children: e.map((l) => /* @__PURE__ */ f(
      "button",
      {
        type: "button",
        className: u(
          "flex w-full items-center gap-2 px-3 py-2 typo-body-md text-left transition-colors hover:bg-[var(--Surface-Secondary)]",
          l.destructive ? "text-[var(--Text-Caution)]" : "text-[var(--Text-High-Emphasis)]"
        ),
        onClick: () => {
          l.onClick?.(), o(!1);
        },
        children: [
          l.icon,
          l.label
        ]
      },
      l.label
    )) })
  ] });
}
function Nh({ selectedCount: e, onClear: t, children: r, className: a, ...o }) {
  return e === 0 ? null : /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "bulk-actions",
      className: u(
        "fixed inset-x-0 bottom-6 z-50 mx-auto w-fit max-w-[calc(100%-32px)]",
        "flex items-center gap-3 rounded-full bg-[var(--Surface-Inverse)] px-5 py-3 shadow-[var(--shadow-dialog)]",
        "animate-fade-in-up",
        a
      ),
      role: "toolbar",
      "aria-label": `${e}件を選択中`,
      ...o,
      children: [
        /* @__PURE__ */ f("span", { className: "typo-label-md text-[var(--Text-on-Inverse)] shrink-0", children: [
          e,
          "件を選択中"
        ] }),
        /* @__PURE__ */ n("div", { className: "h-5 w-px bg-[var(--Text-on-Inverse)]/20 shrink-0" }),
        /* @__PURE__ */ n("div", { className: "flex items-center gap-2", children: r }),
        t && /* @__PURE__ */ f(de, { children: [
          /* @__PURE__ */ n("div", { className: "h-5 w-px bg-[var(--Text-on-Inverse)]/20 shrink-0" }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "flex size-7 items-center justify-center rounded-full text-[var(--Text-on-Inverse)]/60 hover:text-[var(--Text-on-Inverse)] hover:bg-[var(--Text-on-Inverse)]/10 transition-colors cursor-pointer",
              onClick: t,
              "aria-label": "選択を解除",
              children: /* @__PURE__ */ n("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ n("path", { d: "M4 4L12 12M12 4L4 12", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) })
            }
          )
        ] })
      ]
    }
  );
}
function Sh({ items: e, activeIndex: t = 0, onSelect: r, className: a, ...o }) {
  return /* @__PURE__ */ n("div", { "data-slot": "status-tabs", className: u("flex gap-2 overflow-x-auto scrollbar-hide", a), role: "tablist", ...o, children: e.map((s, l) => /* @__PURE__ */ f(
    "button",
    {
      type: "button",
      role: "tab",
      "aria-selected": t === l,
      onClick: () => r?.(l),
      className: u(
        "flex shrink-0 items-center gap-1.5 rounded-full px-3 h-8 typo-label-sm transition-colors whitespace-nowrap",
        t === l ? "bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)]" : "bg-[var(--Surface-Tertiary)] text-[var(--Text-High-Emphasis)] hover:opacity-80"
      ),
      children: [
        s.label,
        /* @__PURE__ */ n("span", { className: u(
          "inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full typo-label-xs",
          t === l ? "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)]" : "bg-[var(--Surface-Quaternary)] text-[var(--Text-Medium-Emphasis)]"
        ), children: s.count })
      ]
    },
    s.label
  )) });
}
const dd = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4"
};
function Mh({ children: e, onSearch: t, onReset: r, columns: a = 4, layout: o = "grid", className: s, ...l }) {
  const i = o === "flex" ? "flex flex-wrap items-end gap-3 [&>*]:flex [&>*]:flex-col [&>*]:min-w-[140px] [&>*]:flex-1" : u("grid grid-cols-1 gap-3 items-end [&>*]:flex [&>*]:flex-col", dd[a]);
  return /* @__PURE__ */ f("div", { "data-slot": "search-panel", className: u("rounded-2xl bg-[var(--Surface-Primary)] border border-[var(--Border-Low-Emphasis)] p-4", s), ...l, children: [
    /* @__PURE__ */ n("div", { className: i, children: e }),
    /* @__PURE__ */ f("div", { className: "flex items-center justify-end gap-2 mt-3", children: [
      r && /* @__PURE__ */ n("button", { type: "button", "data-slot": "button", className: "inline-flex items-center justify-center h-8 px-3 rounded-full border border-[var(--Border-Medium-Emphasis)] typo-label-sm text-[var(--Text-High-Emphasis)] hover:bg-[var(--Hover-Tertiary-Button)] transition-colors cursor-pointer", onClick: r, children: "リセット" }),
      /* @__PURE__ */ f("button", { type: "button", "data-slot": "button", className: "inline-flex items-center justify-center gap-1 h-8 px-3 rounded-full bg-[var(--Brand-Primary)] typo-label-sm text-[var(--Text-on-Inverse)] hover:bg-[var(--Hover-Primary-Button)] transition-colors cursor-pointer", onClick: t, children: [
        /* @__PURE__ */ f("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", children: [
          /* @__PURE__ */ n("circle", { cx: "7", cy: "7", r: "4.5", stroke: "currentColor", strokeWidth: "1.5" }),
          /* @__PURE__ */ n("path", { d: "M10.5 10.5L13.5 13.5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" })
        ] }),
        "検索"
      ] })
    ] })
  ] });
}
function Ch({ images: e = [], onAdd: t, onRemove: r, maxImages: a = 10, columns: o = 4, className: s, ...l }) {
  return /* @__PURE__ */ f("div", { "data-slot": "image-uploader", className: u("grid gap-3", s), style: { gridTemplateColumns: `repeat(${Math.min(o, 6)}, minmax(0, 1fr))` }, ...l, children: [
    e.map((i, c) => /* @__PURE__ */ f("div", { className: "relative aspect-square rounded-lg bg-[var(--Surface-Tertiary)] border border-[var(--Border-Low-Emphasis)] overflow-hidden group", children: [
      /* @__PURE__ */ n("img", { src: i.src, alt: i.alt, className: "absolute inset-0 size-full object-cover" }),
      /* @__PURE__ */ n("div", { className: "absolute inset-0 bg-[var(--Overlay-Medium)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center", children: /* @__PURE__ */ n("button", { type: "button", className: "size-8 rounded-full bg-[var(--Surface-Primary)]/80 flex items-center justify-center", "aria-label": `${i.alt}を削除`, onClick: () => r?.(c), children: /* @__PURE__ */ n("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ n("path", { d: "M3 4h10M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1M5 4v8a1 1 0 001 1h4a1 1 0 001-1V4", stroke: "var(--Caution-Base)", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) }) }) }),
      /* @__PURE__ */ n("div", { className: "absolute top-1 left-1 size-5 rounded bg-[var(--Overlay-Dark)] text-[var(--Text-on-Inverse)] flex items-center justify-center typo-label-xs", children: c + 1 })
    ] }, c)),
    e.length < a && /* @__PURE__ */ f("button", { type: "button", className: "aspect-square rounded-lg border-2 border-dashed border-[var(--Border-Medium-Emphasis)] flex flex-col items-center justify-center gap-1 hover:border-[var(--Border-Accent-Primary)] hover:bg-[var(--Surface-Accent-Primary-Light)] transition-colors cursor-pointer", onClick: t, "aria-label": "画像を追加", children: [
      /* @__PURE__ */ n("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", children: /* @__PURE__ */ n("path", { d: "M12 5v14M5 12h14", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) }),
      /* @__PURE__ */ n("span", { className: "typo-label-xs text-[var(--Text-Low-Emphasis)]", children: "追加" })
    ] })
  ] });
}
function Gr(e) {
  return e < 1024 ? `${e} B` : e < 1024 * 1024 ? `${(e / 1024).toFixed(1)} KB` : `${(e / (1024 * 1024)).toFixed(1)} MB`;
}
function Th({
  accept: e,
  maxSize: t,
  multiple: r = !1,
  maxFiles: a = 10,
  onUpload: o,
  disabled: s = !1,
  className: l,
  dragLabel: i = "ここにファイルをドロップ",
  orLabel: c = "または",
  browseLabel: d = "ファイルを選択",
  maxSizeLabel: m = (v) => `最大 ${Gr(v)} まで`,
  maxFilesLabel: h = (v) => `最大 ${v} ファイルまで`,
  removeLabel: p = "削除"
}) {
  const [v, b] = x.useState(!1), [g, w] = x.useState([]), [y, S] = x.useState(null), M = x.useRef(null), N = (P) => {
    if (S(null), t && P.find((J) => J.size > t))
      return S(m(t)), null;
    const L = r ? [...g, ...P] : P.slice(0, 1);
    return r && L.length > a ? (S(h(a)), null) : L;
  }, k = (P) => {
    const L = N(P);
    L && (w(L), o?.(L));
  }, C = (P) => {
    const L = g.filter((K, J) => J !== P);
    w(L), o?.(L);
  }, E = (P) => {
    P.preventDefault(), b(!1), !s && k(Array.from(P.dataTransfer.files));
  }, W = (P) => {
    P.target.files && k(Array.from(P.target.files)), P.target.value = "";
  };
  return /* @__PURE__ */ f("div", { "data-slot": "file-upload", className: u("flex flex-col gap-3", l), children: [
    /* @__PURE__ */ f(
      "div",
      {
        role: "button",
        tabIndex: s ? -1 : 0,
        "aria-label": i,
        onDragOver: (P) => {
          P.preventDefault(), !s && b(!0);
        },
        onDragLeave: () => b(!1),
        onDrop: E,
        onClick: () => !s && M.current?.click(),
        onKeyDown: (P) => {
          (P.key === "Enter" || P.key === " ") && M.current?.click();
        },
        className: u(
          "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-colors",
          v ? "border-[var(--Brand-Primary)] bg-[var(--Surface-Accent-Primary-Light)]" : "border-[var(--Border-Medium-Emphasis)] hover:border-[var(--Brand-Primary)] hover:bg-[var(--Surface-Secondary)]",
          s && "opacity-50 cursor-not-allowed pointer-events-none"
        ),
        children: [
          /* @__PURE__ */ f("svg", { width: "32", height: "32", viewBox: "0 0 32 32", fill: "none", className: "text-[var(--Object-Low-Emphasis)]", "aria-hidden": !0, children: [
            /* @__PURE__ */ n("path", { d: "M16 22V10M10 16L16 10L22 16", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }),
            /* @__PURE__ */ n("path", { d: "M6 26h20", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" })
          ] }),
          /* @__PURE__ */ n("span", { className: "typo-body-md text-[var(--Text-Medium-Emphasis)] text-center", children: i }),
          /* @__PURE__ */ n("span", { className: "typo-body-sm text-[var(--Text-Low-Emphasis)]", children: c }),
          /* @__PURE__ */ n("span", { className: "typo-label-sm text-[var(--Text-Accent-Primary)] underline", children: d }),
          (t || r && a) && /* @__PURE__ */ n("span", { className: "typo-body-xs text-[var(--Text-Low-Emphasis)]", children: [
            t && m(t),
            r && h(a)
          ].filter(Boolean).join(" / ") })
        ]
      }
    ),
    /* @__PURE__ */ n(
      "input",
      {
        ref: M,
        type: "file",
        accept: e,
        multiple: r,
        className: "hidden",
        onChange: W,
        disabled: s
      }
    ),
    y && /* @__PURE__ */ n("p", { className: "typo-body-sm text-[var(--Text-Caution)]", role: "alert", children: y }),
    g.length > 0 && /* @__PURE__ */ n("ul", { className: "flex flex-col gap-2", children: g.map((P, L) => /* @__PURE__ */ f(
      "li",
      {
        className: "flex items-center gap-3 rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Secondary)] px-3 py-2",
        children: [
          /* @__PURE__ */ f("svg", { width: "18", height: "18", viewBox: "0 0 20 20", fill: "none", className: "text-[var(--Object-Medium-Emphasis)] shrink-0", "aria-hidden": !0, children: [
            /* @__PURE__ */ n("path", { d: "M4 2h8l5 5v11a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z", stroke: "currentColor", strokeWidth: "1.5" }),
            /* @__PURE__ */ n("path", { d: "M12 2v5h5", stroke: "currentColor", strokeWidth: "1.5" })
          ] }),
          /* @__PURE__ */ f("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ n("p", { className: "typo-label-sm text-[var(--Text-High-Emphasis)] truncate", children: P.name }),
            /* @__PURE__ */ n("p", { className: "typo-body-xs text-[var(--Text-Low-Emphasis)]", children: Gr(P.size) })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": `${P.name} を${p}`,
              onClick: () => C(L),
              className: "flex size-7 shrink-0 items-center justify-center rounded-full text-[var(--Object-Low-Emphasis)] hover:text-[var(--Object-High-Emphasis)] hover:bg-[var(--Surface-Tertiary)] transition-colors",
              children: /* @__PURE__ */ n("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", children: /* @__PURE__ */ n("path", { d: "M2 2L12 12M12 2L2 12", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }) })
            }
          )
        ]
      },
      `${P.name}-${L}`
    )) })
  ] });
}
function Eh({ notifications: e, variant: t = "vertical", emptyMessage: r = "新着のお知らせはありません", className: a, ...o }) {
  return e.length === 0 ? /* @__PURE__ */ f("div", { "data-slot": "notification-list", className: u("flex flex-col items-center justify-center gap-3 py-12", a), ...o, children: [
    /* @__PURE__ */ n("svg", { width: "48", height: "48", viewBox: "0 0 48 48", fill: "none", className: "text-[var(--Text-Low-Emphasis)]", children: /* @__PURE__ */ n("path", { d: "M24 4C17.4 4 12 9.4 12 16v8l-4 4v2h32v-2l-4-4v-8c0-6.6-5.4-12-12-12zM20 34c0 2.2 1.8 4 4 4s4-1.8 4-4", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }),
    /* @__PURE__ */ n("p", { className: "typo-body-sm text-[var(--Text-Low-Emphasis)]", children: r })
  ] }) : /* @__PURE__ */ n("div", { "data-slot": "notification-list", className: u("w-full divide-y divide-[var(--Border-Low-Emphasis)]", a), ...o, children: e.map((s) => {
    const l = s.href ? "a" : "div", i = s.href ? { href: s.href } : {};
    return t === "horizontal" ? (
      /* 横並びレイアウト（管理画面向け） */
      /* @__PURE__ */ f(l, { ...i, className: "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--Surface-Secondary)]", children: [
        /* @__PURE__ */ n("span", { className: "typo-body-sm text-[var(--Text-Low-Emphasis)] shrink-0 w-[88px]", children: s.date }),
        /* @__PURE__ */ f("div", { className: "flex min-w-0 flex-1 flex-col gap-1", children: [
          s.isUnread && /* @__PURE__ */ n("span", { className: "inline-flex w-fit items-center rounded-full bg-[var(--Caution-Base)] px-1.5 py-0.5 typo-label-xs text-[var(--Text-on-Inverse)]", children: "NEW" }),
          /* @__PURE__ */ n("span", { className: "typo-body-md text-[var(--Text-High-Emphasis)] truncate", children: s.message })
        ] }),
        /* @__PURE__ */ n("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", className: "text-[var(--Text-Low-Emphasis)] shrink-0", children: /* @__PURE__ */ n("path", { d: "M6 4l4 4-4 4", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) })
      ] }, s.id)
    ) : (
      /* 縦並びレイアウト（フロント向け） */
      /* @__PURE__ */ f(l, { ...i, className: "flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-[var(--Surface-Secondary)]", children: [
        /* @__PURE__ */ n("div", { className: "flex shrink-0 items-center pt-1.5", children: s.isUnread ? /* @__PURE__ */ n("span", { className: "size-2 rounded-full bg-[var(--Brand-Primary)]" }) : /* @__PURE__ */ n("span", { className: "size-2" }) }),
        /* @__PURE__ */ f("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ n("p", { className: "typo-body-md text-[var(--Text-High-Emphasis)]", children: s.message }),
          /* @__PURE__ */ n("p", { className: "mt-0.5 typo-body-sm text-[var(--Text-Low-Emphasis)]", children: s.date })
        ] })
      ] }, s.id)
    );
  }) });
}
const ud = [
  { label: "時間", value: "hour" },
  { label: "日", value: "day" },
  { label: "週", value: "week" },
  { label: "月", value: "month" }
], fd = [
  { label: "7日", value: "7d" },
  { label: "30日", value: "30d" },
  { label: "90日", value: "90d" },
  { label: "1年", value: "1y" },
  { label: "カスタム", value: "custom" }
];
function Ur({
  options: e,
  value: t,
  onChange: r
}) {
  return /* @__PURE__ */ n("div", { className: "flex gap-1", role: "group", children: e.map((a) => /* @__PURE__ */ n(
    "button",
    {
      onClick: () => r(a.value),
      "aria-pressed": a.value === t,
      className: u(
        "px-3 py-1 rounded-full typo-label-xs border transition-colors",
        a.value === t ? "bg-[var(--Brand-Primary)] text-white border-[var(--Brand-Primary)] font-bold" : "border-[var(--Border-Medium-Emphasis)] text-[var(--Text-Medium-Emphasis)] bg-[var(--Surface-Primary)] hover:border-[var(--Brand-Primary)] hover:text-[var(--Brand-Primary)]"
      ),
      children: a.label
    },
    a.value
  )) });
}
function Dh({
  granularity: e = "day",
  onGranularityChange: t,
  period: r = "7d",
  onPeriodChange: a,
  showComparison: o = !1,
  onComparisonChange: s,
  onCustomPeriod: l,
  className: i
}) {
  const c = (d) => {
    if (d === "custom") {
      l?.();
      return;
    }
    a?.(d);
  };
  return /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "chart-controls",
      className: u("flex flex-col gap-2.5", i),
      children: [
        t && /* @__PURE__ */ f("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ n("span", { className: "typo-label-xs text-[var(--Text-Low-Emphasis)] font-bold w-10 shrink-0", children: "粒度" }),
          /* @__PURE__ */ n(
            Ur,
            {
              options: ud,
              value: e,
              onChange: t
            }
          )
        ] }),
        a && /* @__PURE__ */ f("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ n("span", { className: "typo-label-xs text-[var(--Text-Low-Emphasis)] font-bold w-10 shrink-0", children: "期間" }),
          /* @__PURE__ */ n(
            Ur,
            {
              options: fd,
              value: r,
              onChange: c
            }
          )
        ] }),
        s && /* @__PURE__ */ f("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ n("span", { className: "typo-label-xs text-[var(--Text-Low-Emphasis)] font-bold w-10 shrink-0", children: "比較" }),
          /* @__PURE__ */ f(
            "button",
            {
              onClick: () => s(!o),
              "aria-pressed": o,
              className: u(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border typo-label-xs font-medium transition-colors",
                o ? "bg-[var(--Brand-Ultra-Light)] border-[var(--Brand-Primary)] text-[var(--Brand-Primary)] font-bold" : "border-[var(--Border-Medium-Emphasis)] text-[var(--Text-Medium-Emphasis)] hover:border-[var(--Brand-Primary)] hover:text-[var(--Brand-Primary)]"
              ),
              children: [
                /* @__PURE__ */ n("span", { className: u(
                  "w-2 h-2 rounded-full",
                  o ? "bg-[var(--Brand-Primary)]" : "bg-[var(--Border-Medium-Emphasis)]"
                ) }),
                "前期比を表示"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function yt(e, t = 0, r = !1) {
  const a = e === "right" ? "right" : "left", o = r ? "var(--Surface-Secondary)" : "var(--Surface-Primary)";
  return {
    className: u(
      "sticky z-[1]",
      // 影で「貼り付き」の境界を視覚化（軽め）
      a === "left" ? "shadow-[1px_0_0_var(--Border-Low-Emphasis)]" : "shadow-[-1px_0_0_var(--Border-Low-Emphasis)]"
    ),
    style: {
      [a]: t,
      backgroundColor: o
    }
  };
}
function hd({ direction: e }) {
  return e === "asc" ? /* @__PURE__ */ f("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", className: "shrink-0", children: [
    /* @__PURE__ */ n("path", { d: "M7 3L10.5 7.5H3.5L7 3Z", fill: "currentColor" }),
    /* @__PURE__ */ n("path", { d: "M7 11L3.5 6.5H10.5L7 11Z", fill: "currentColor", opacity: "0.25" })
  ] }) : e === "desc" ? /* @__PURE__ */ f("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", className: "shrink-0", children: [
    /* @__PURE__ */ n("path", { d: "M7 3L10.5 7.5H3.5L7 3Z", fill: "currentColor", opacity: "0.25" }),
    /* @__PURE__ */ n("path", { d: "M7 11L3.5 6.5H10.5L7 11Z", fill: "currentColor" })
  ] }) : /* @__PURE__ */ f("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", className: "shrink-0 opacity-40", children: [
    /* @__PURE__ */ n("path", { d: "M7 3L10.5 7.5H3.5L7 3Z", fill: "currentColor" }),
    /* @__PURE__ */ n("path", { d: "M7 11L3.5 6.5H10.5L7 11Z", fill: "currentColor" })
  ] });
}
function md() {
  return /* @__PURE__ */ f("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", children: [
    /* @__PURE__ */ n("circle", { cx: "8", cy: "3", r: "1.5" }),
    /* @__PURE__ */ n("circle", { cx: "8", cy: "8", r: "1.5" }),
    /* @__PURE__ */ n("circle", { cx: "8", cy: "13", r: "1.5" })
  ] });
}
function pd() {
  return /* @__PURE__ */ n("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: /* @__PURE__ */ n("path", { d: "M8 3V13M3 8H13" }) });
}
function vd() {
  return /* @__PURE__ */ f("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", className: "shrink-0", children: [
    /* @__PURE__ */ n("path", { d: "M10.5 7.5V11.5C10.5 12.05 10.05 12.5 9.5 12.5H2.5C1.95 12.5 1.5 12.05 1.5 11.5V4.5C1.5 3.95 1.95 3.5 2.5 3.5H6.5" }),
    /* @__PURE__ */ n("path", { d: "M8.5 1.5H12.5V5.5" }),
    /* @__PURE__ */ n("path", { d: "M5.5 8.5L12.5 1.5" })
  ] });
}
function bd() {
  return /* @__PURE__ */ f("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "currentColor", className: "shrink-0", children: [
    /* @__PURE__ */ n("circle", { cx: "5", cy: "3", r: "1.2" }),
    /* @__PURE__ */ n("circle", { cx: "9", cy: "3", r: "1.2" }),
    /* @__PURE__ */ n("circle", { cx: "5", cy: "7", r: "1.2" }),
    /* @__PURE__ */ n("circle", { cx: "9", cy: "7", r: "1.2" }),
    /* @__PURE__ */ n("circle", { cx: "5", cy: "11", r: "1.2" }),
    /* @__PURE__ */ n("circle", { cx: "9", cy: "11", r: "1.2" })
  ] });
}
function gd({ open: e }) {
  return /* @__PURE__ */ n(
    "svg",
    {
      width: "16",
      height: "16",
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: u("shrink-0 transition-transform duration-200", e && "rotate-90"),
      children: /* @__PURE__ */ n("path", { d: "M6 4L10 8L6 12" })
    }
  );
}
function Ph({ className: e, children: t, ...r }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "data-table",
      className: u(
        "overflow-x-auto rounded-lg border border-[var(--Border-Low-Emphasis)]",
        e
      ),
      ...r,
      children: t
    }
  );
}
function Bh({ className: e, children: t, ...r }) {
  return /* @__PURE__ */ n(
    "table",
    {
      "data-slot": "data-table-table",
      className: u("w-full border-collapse", e),
      ...r,
      children: t
    }
  );
}
function Oh({ className: e, children: t, ...r }) {
  return /* @__PURE__ */ n(
    "thead",
    {
      "data-slot": "data-table-header",
      className: u("bg-[var(--Surface-Secondary)]", e),
      ...r,
      children: t
    }
  );
}
function Lh({ className: e, children: t, ...r }) {
  return /* @__PURE__ */ n(
    "tbody",
    {
      "data-slot": "data-table-body",
      className: u("[&>tr:not(:last-child)]:border-b [&>tr:not(:last-child)]:border-[var(--Border-Low-Emphasis)]", e),
      ...r,
      children: t
    }
  );
}
function Wh({ className: e, selected: t, children: r, ...a }) {
  return /* @__PURE__ */ n(
    "tr",
    {
      "data-slot": "data-table-row",
      "data-selected": t || void 0,
      className: u(
        "transition-colors hover:bg-[var(--Surface-Secondary)]/50",
        t && "bg-[var(--Surface-Accent-Primary-Light)] border-l-2 border-l-[var(--Brand-Primary)]",
        e
      ),
      ...a,
      children: r
    }
  );
}
function Ih({
  className: e,
  children: t,
  sortable: r,
  sortDirection: a,
  onSort: o,
  sticky: s,
  stickyOffset: l,
  style: i,
  ...c
}) {
  const d = s ? yt(s, l, !0) : null;
  return /* @__PURE__ */ n(
    "th",
    {
      "data-slot": "data-table-head",
      className: u(
        "px-3 py-2.5 text-left typo-label-sm text-[var(--Text-Medium-Emphasis)]",
        r && "cursor-pointer select-none",
        d?.className,
        e
      ),
      style: d ? { ...d.style, ...i } : i,
      onClick: r ? o : void 0,
      "aria-sort": a === "asc" ? "ascending" : a === "desc" ? "descending" : void 0,
      ...c,
      children: r ? /* @__PURE__ */ f("span", { className: "inline-flex items-center gap-1", children: [
        t,
        /* @__PURE__ */ n(hd, { direction: a ?? null })
      ] }) : t
    }
  );
}
const xd = se("px-3 py-2.5 typo-body-md text-[var(--Text-High-Emphasis)]", {
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
      xl: "w-[400px]"
    }
  },
  defaultVariants: {
    align: "left",
    width: "auto"
  }
});
function Hh({
  className: e,
  align: t,
  width: r,
  children: a,
  sticky: o,
  stickyOffset: s,
  style: l,
  ...i
}) {
  const c = o ? yt(o, s) : null;
  return /* @__PURE__ */ n(
    "td",
    {
      "data-slot": "data-table-cell",
      className: u(xd({ align: t, width: r }), c?.className, e),
      style: c ? { ...c.style, ...l } : l,
      ...i,
      children: a
    }
  );
}
function jh({
  className: e,
  src: t,
  fallback: r,
  title: a,
  caption: o,
  sticky: s,
  stickyOffset: l,
  style: i,
  ...c
}) {
  const d = s ? yt(s, l) : null;
  return /* @__PURE__ */ n(
    "td",
    {
      "data-slot": "data-table-avatar-cell",
      className: u("px-3 py-2.5", d?.className, e),
      style: d ? { ...d.style, ...i } : i,
      ...c,
      children: /* @__PURE__ */ f("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ f(Zn, { className: "size-8", children: [
          t && /* @__PURE__ */ n(Kn, { src: t, alt: a }),
          /* @__PURE__ */ n(Jn, { children: r ?? a.charAt(0) })
        ] }),
        /* @__PURE__ */ f("div", { className: "flex flex-col min-w-0", children: [
          /* @__PURE__ */ n("span", { className: "typo-label-md text-[var(--Text-High-Emphasis)] truncate", children: a }),
          o && /* @__PURE__ */ n("span", { className: "typo-body-sm text-[var(--Text-Low-Emphasis)] truncate", children: o })
        ] })
      ] })
    }
  );
}
function Fh({
  className: e,
  src: t,
  alt: r,
  title: a,
  caption: o,
  imageSize: s = 40,
  ...l
}) {
  return /* @__PURE__ */ n(
    "td",
    {
      "data-slot": "data-table-image-cell",
      className: u("px-3 py-2.5", e),
      ...l,
      children: /* @__PURE__ */ f("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ n(
          "img",
          {
            src: t,
            alt: r ?? a ?? "",
            className: "shrink-0 rounded-lg object-cover",
            style: { width: s, height: s }
          }
        ),
        (a || o) && /* @__PURE__ */ f("div", { className: "flex flex-col min-w-0", children: [
          a && /* @__PURE__ */ n("span", { className: "typo-label-md text-[var(--Text-High-Emphasis)] truncate", children: a }),
          o && /* @__PURE__ */ n("span", { className: "typo-body-sm text-[var(--Text-Low-Emphasis)] truncate", children: o })
        ] })
      ] })
    }
  );
}
function Ah({
  className: e,
  checked: t,
  onCheckedChange: r,
  indeterminate: a,
  sticky: o,
  stickyOffset: s,
  style: l,
  ...i
}) {
  const c = o ? yt(o, s) : null;
  return /* @__PURE__ */ n(
    "td",
    {
      "data-slot": "data-table-checkbox-cell",
      className: u("w-[40px] px-3 py-2.5", c?.className, e),
      style: c ? { ...c.style, ...l } : l,
      ...i,
      children: /* @__PURE__ */ n(
        ro,
        {
          checked: a ? "indeterminate" : t,
          onCheckedChange: (d) => r?.(d === !0)
        }
      )
    }
  );
}
function _h({ className: e, items: t, ...r }) {
  const [a, o] = x.useState(!1), s = x.useRef(null);
  return x.useEffect(() => {
    if (!a) return;
    const l = (i) => {
      s.current && !s.current.contains(i.target) && o(!1);
    };
    return document.addEventListener("mousedown", l), () => document.removeEventListener("mousedown", l);
  }, [a]), /* @__PURE__ */ n(
    "td",
    {
      "data-slot": "data-table-action-cell",
      className: u("w-[48px] px-3 py-2.5", e),
      ...r,
      children: /* @__PURE__ */ f("div", { ref: s, className: "relative", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "flex size-8 items-center justify-center rounded-lg hover:bg-[var(--Surface-Secondary)] transition-colors",
            onClick: () => o(!a),
            "aria-label": "行メニュー",
            "aria-expanded": a,
            children: /* @__PURE__ */ n(md, {})
          }
        ),
        a && /* @__PURE__ */ n("div", { className: "absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] py-1 shadow-[var(--shadow-lg)] animate-fade-in", children: t.map((l) => /* @__PURE__ */ f(
          "button",
          {
            type: "button",
            className: u(
              "flex w-full items-center gap-2 px-3 py-2 typo-body-md text-left transition-colors hover:bg-[var(--Surface-Secondary)]",
              l.destructive ? "text-[var(--Text-Caution)]" : "text-[var(--Text-High-Emphasis)]"
            ),
            onClick: () => {
              l.onClick?.(), o(!1);
            },
            children: [
              l.icon,
              l.label
            ]
          },
          l.label
        )) })
      ] })
    }
  );
}
function zh({
  className: e,
  value: t,
  onChange: r,
  placeholder: a,
  ...o
}) {
  return /* @__PURE__ */ n(
    "td",
    {
      "data-slot": "data-table-input-cell",
      className: u("px-3 py-1.5", e),
      ...o,
      children: /* @__PURE__ */ n(
        "input",
        {
          type: "text",
          value: t,
          onChange: (s) => r?.(s.target.value),
          placeholder: a,
          className: u(
            "w-full rounded-lg border border-transparent bg-transparent px-2 py-1.5 typo-body-md text-[var(--Text-High-Emphasis)]",
            "hover:border-[var(--Border-Low-Emphasis)]",
            "focus:border-[var(--Border-Accent-Primary)] focus:outline-none focus:shadow-[inset_0_1px_3px_rgba(0,0,0,0.08)]",
            "placeholder:text-[var(--Text-Low-Emphasis)]"
          )
        }
      )
    }
  );
}
function Yh({
  className: e,
  value: t,
  onValueChange: r,
  placeholder: a,
  options: o,
  ...s
}) {
  return /* @__PURE__ */ n(
    "td",
    {
      "data-slot": "data-table-select-cell",
      className: u("px-3 py-1.5", e),
      ...s,
      children: /* @__PURE__ */ f(sc, { value: t, onValueChange: r, children: [
        /* @__PURE__ */ n(lc, { className: "h-8 min-w-[120px] typo-body-md border-transparent hover:border-[var(--Border-Low-Emphasis)]", children: /* @__PURE__ */ n(ic, { placeholder: a }) }),
        /* @__PURE__ */ n(cc, { children: o.map((l) => /* @__PURE__ */ n(dc, { value: l.value, children: l.label }, l.value)) })
      ] })
    }
  );
}
function $h({
  className: e,
  value: t,
  prefix: r,
  suffix: a,
  children: o,
  ...s
}) {
  return /* @__PURE__ */ f(
    "td",
    {
      "data-slot": "data-table-number-cell",
      className: u(
        "px-3 py-2.5 text-right typo-body-md tabular-nums text-[var(--Text-High-Emphasis)]",
        e
      ),
      ...s,
      children: [
        r,
        typeof t == "number" ? t.toLocaleString() : t,
        a
      ]
    }
  );
}
function Rh({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    "td",
    {
      "data-slot": "data-table-drag-handle-cell",
      className: u("w-[36px] px-2 py-2.5 cursor-grab text-[var(--Text-Low-Emphasis)]", e),
      ...t,
      children: /* @__PURE__ */ n(bd, {})
    }
  );
}
function Vh({
  className: e,
  href: t,
  external: r,
  children: a,
  ...o
}) {
  return /* @__PURE__ */ n(
    "td",
    {
      "data-slot": "data-table-link-cell",
      className: u("px-3 py-2.5", e),
      ...o,
      children: /* @__PURE__ */ f(
        "a",
        {
          href: t,
          target: r ? "_blank" : void 0,
          rel: r ? "noopener noreferrer" : void 0,
          className: "inline-flex items-center gap-1 typo-body-md text-[var(--Text-Accent-Primary)] hover:underline",
          children: [
            a,
            r && /* @__PURE__ */ n(vd, {})
          ]
        }
      )
    }
  );
}
function qh({
  className: e,
  selectedCount: t,
  children: r,
  ...a
}) {
  return t === 0 ? null : /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "data-table-bulk-actions",
      className: u(
        "flex items-center gap-3 rounded-lg bg-[var(--Surface-Accent-Primary-Light)] px-4 py-3",
        e
      ),
      role: "toolbar",
      "aria-label": `${t}件を選択中`,
      ...a,
      children: [
        /* @__PURE__ */ f("span", { className: "typo-label-md text-[var(--Text-High-Emphasis)] shrink-0", children: [
          t,
          "件を選択中"
        ] }),
        r
      ]
    }
  );
}
function Gh({
  className: e,
  label: t,
  count: r,
  open: a = !0,
  onToggle: o,
  colSpan: s,
  ...l
}) {
  return /* @__PURE__ */ n(
    "tr",
    {
      "data-slot": "data-table-section-row",
      className: u("bg-[var(--Surface-Secondary)] border-b border-[var(--Border-Low-Emphasis)]", e),
      ...l,
      children: /* @__PURE__ */ n("td", { colSpan: s, className: "px-3 py-2", children: /* @__PURE__ */ f(
        "button",
        {
          type: "button",
          className: "inline-flex items-center gap-2 typo-label-md text-[var(--Text-High-Emphasis)]",
          onClick: o,
          "aria-expanded": a,
          children: [
            /* @__PURE__ */ n(gd, { open: a }),
            t,
            r !== void 0 && /* @__PURE__ */ f("span", { className: "typo-body-sm text-[var(--Text-Low-Emphasis)]", children: [
              "(",
              r,
              ")"
            ] })
          ]
        }
      ) })
    }
  );
}
function Uh({
  className: e,
  label: t = "追加する",
  onClick: r,
  colSpan: a,
  ...o
}) {
  return /* @__PURE__ */ n(
    "tr",
    {
      "data-slot": "data-table-add-row",
      className: u("border-t border-dashed border-[var(--Border-Low-Emphasis)]", e),
      ...o,
      children: /* @__PURE__ */ n("td", { colSpan: a, className: "px-3 py-2", children: /* @__PURE__ */ f(
        "button",
        {
          type: "button",
          className: "inline-flex items-center gap-2 typo-label-md text-[var(--Text-Accent-Primary)] hover:underline",
          onClick: r,
          children: [
            /* @__PURE__ */ n(pd, {}),
            t
          ]
        }
      ) })
    }
  );
}
function Xh({
  className: e,
  icon: t,
  message: r = "データがありません",
  description: a,
  action: o,
  colSpan: s,
  ...l
}) {
  return /* @__PURE__ */ n(
    "tr",
    {
      "data-slot": "data-table-empty-state",
      className: u("", e),
      ...l,
      children: /* @__PURE__ */ n("td", { colSpan: s, className: "px-3 py-12", children: /* @__PURE__ */ f("div", { className: "flex flex-col items-center gap-3 text-center", children: [
        t && /* @__PURE__ */ n("div", { className: "text-[var(--Text-Low-Emphasis)]", children: t }),
        /* @__PURE__ */ n("p", { className: "typo-heading-md text-[var(--Text-Medium-Emphasis)]", children: r }),
        a && /* @__PURE__ */ n("p", { className: "typo-body-md text-[var(--Text-Low-Emphasis)] max-w-sm", children: a }),
        o && /* @__PURE__ */ n("div", { className: "mt-2", children: o })
      ] }) })
    }
  );
}
function yd() {
  return /* @__PURE__ */ n(
    "svg",
    {
      width: "16",
      height: "16",
      viewBox: "0 0 16 16",
      fill: "none",
      "aria-hidden": "true",
      children: /* @__PURE__ */ n(
        "path",
        {
          d: "M10 12L6 8L10 4",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }
      )
    }
  );
}
function wd() {
  return /* @__PURE__ */ n(
    "svg",
    {
      width: "16",
      height: "16",
      viewBox: "0 0 16 16",
      fill: "none",
      "aria-hidden": "true",
      children: /* @__PURE__ */ n(
        "path",
        {
          d: "M6 4L10 8L6 12",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }
      )
    }
  );
}
function Qh({
  page: e,
  onPageChange: t,
  format: r,
  compact: a = !1,
  previousLabel: o = "前へ",
  nextLabel: s = "次へ",
  renderLabel: l,
  className: i,
  total: c,
  pageSize: d,
  totalPages: m,
  ...h
}) {
  const p = r ?? (m !== void 0 ? "pages" : "items"), v = m !== void 0 ? m : d && d > 0 ? Math.max(1, Math.ceil((c ?? 0) / d)) : 1, b = Math.min(Math.max(1, e), Math.max(1, v)), g = b > 1, w = b < v, y = d && c !== void 0 && c > 0 ? (b - 1) * d + 1 : void 0, S = d && c !== void 0 ? Math.min(b * d, c) : void 0, M = () => {
    g && t?.(b - 1);
  }, N = () => {
    w && t?.(b + 1);
  }, k = x.useMemo(() => l ? l({
    page: b,
    totalPages: v,
    pageSize: d,
    total: c,
    from: y,
    to: S
  }) : a ? /* @__PURE__ */ f("span", { className: "tabular-nums", children: [
    b,
    " / ",
    v
  ] }) : p === "items" && c !== void 0 && d ? c === 0 ? /* @__PURE__ */ n("span", { className: "tabular-nums", children: "0 件" }) : /* @__PURE__ */ f(de, { children: [
    /* @__PURE__ */ f("span", { className: "tabular-nums", children: [
      y?.toLocaleString(),
      " - ",
      S?.toLocaleString()
    ] }),
    /* @__PURE__ */ n("span", { className: "text-[var(--Text-Low-Emphasis)]", children: " / 全 " }),
    /* @__PURE__ */ n("span", { className: "tabular-nums", children: c.toLocaleString() }),
    /* @__PURE__ */ n("span", { className: "text-[var(--Text-Low-Emphasis)]", children: " 件" })
  ] }) : /* @__PURE__ */ f(de, { children: [
    /* @__PURE__ */ n("span", { className: "tabular-nums", children: b }),
    /* @__PURE__ */ n("span", { className: "text-[var(--Text-Low-Emphasis)]", children: " / " }),
    /* @__PURE__ */ n("span", { className: "tabular-nums", children: v }),
    /* @__PURE__ */ n("span", { className: "text-[var(--Text-Low-Emphasis)]", children: " ページ" })
  ] }), [
    l,
    a,
    p,
    b,
    v,
    c,
    d,
    y,
    S
  ]);
  return /* @__PURE__ */ f(
    "nav",
    {
      role: "navigation",
      "aria-label": "ページネーション",
      "data-slot": "simple-pagination",
      className: u(
        "flex items-center justify-between gap-2 sm:justify-center sm:gap-4",
        i
      ),
      ...h,
      children: [
        /* @__PURE__ */ f(
          pe,
          {
            type: "button",
            variant: "tertiary",
            size: "sm",
            onClick: M,
            disabled: !g,
            "aria-label": o,
            children: [
              /* @__PURE__ */ n(yd, {}),
              /* @__PURE__ */ n("span", { className: a ? "sr-only sm:not-sr-only" : void 0, children: o })
            ]
          }
        ),
        /* @__PURE__ */ n(
          "div",
          {
            className: "typo-body-sm text-[var(--Text-High-Emphasis)] text-center",
            "aria-live": "polite",
            children: k
          }
        ),
        /* @__PURE__ */ f(
          pe,
          {
            type: "button",
            variant: "tertiary",
            size: "sm",
            onClick: N,
            disabled: !w,
            "aria-label": s,
            children: [
              /* @__PURE__ */ n("span", { className: a ? "sr-only sm:not-sr-only" : void 0, children: s }),
              /* @__PURE__ */ n(wd, {})
            ]
          }
        )
      ]
    }
  );
}
function Zh({
  open: e,
  onClose: t,
  banner: r,
  sections: a,
  footerLinks: o,
  width: s = 280,
  className: l
}) {
  return /* @__PURE__ */ n(Zt, { open: e, onOpenChange: (i) => !i && t(), children: /* @__PURE__ */ f(
    er,
    {
      side: "left",
      className: u("p-0 flex flex-col", l),
      style: { width: s },
      children: [
        /* @__PURE__ */ n(tr, { className: "sr-only", children: /* @__PURE__ */ n(rr, { children: "メニュー" }) }),
        /* @__PURE__ */ f("div", { className: "flex-1 overflow-y-auto", children: [
          r && /* @__PURE__ */ n("div", { className: "mx-3 mt-4 mb-2", children: r }),
          a.map((i, c) => /* @__PURE__ */ f("div", { className: c > 0 ? "border-t border-[var(--Border-Low-Emphasis)] mt-2 pt-2" : "mt-2", children: [
            i.title && /* @__PURE__ */ n("p", { className: "px-4 py-1.5 typo-label-xs text-[var(--Text-Low-Emphasis)] font-bold uppercase tracking-wider", children: i.title }),
            i.items.map((d, m) => {
              const h = d.href ? "a" : "button";
              return /* @__PURE__ */ f(
                h,
                {
                  href: d.href,
                  onClick: () => {
                    d.onClick?.(), t();
                  },
                  className: "flex items-center gap-3 w-full px-4 py-2.5 typo-label-sm text-[var(--Text-High-Emphasis)] hover:bg-[var(--Surface-Secondary)] transition-colors text-left",
                  children: [
                    d.icon && /* @__PURE__ */ n("span", { className: "w-5 h-5 flex items-center justify-center text-[var(--Text-Low-Emphasis)] shrink-0", children: d.icon }),
                    /* @__PURE__ */ n("span", { className: "flex-1", children: d.label }),
                    d.badge !== void 0 && /* @__PURE__ */ n("span", { className: "min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--Brand-Primary)] text-white text-[10px] font-bold flex items-center justify-center", children: d.badge }),
                    /* @__PURE__ */ n("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", "aria-hidden": "true", className: "text-[var(--Text-Low-Emphasis)]", children: /* @__PURE__ */ n("path", { d: "M5 3l4 4-4 4", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) })
                  ]
                },
                m
              );
            })
          ] }, c))
        ] }),
        o && o.length > 0 && /* @__PURE__ */ n("div", { className: "border-t border-[var(--Border-Low-Emphasis)] py-3 px-4 flex flex-wrap gap-x-4 gap-y-1", children: o.map((i, c) => {
          const d = i.href ? "a" : "button";
          return /* @__PURE__ */ n(
            d,
            {
              href: i.href,
              onClick: () => {
                i.onClick?.(), t();
              },
              className: "typo-body-xs text-[var(--Text-Low-Emphasis)] hover:text-[var(--Text-High-Emphasis)] transition-colors",
              children: i.label
            },
            c
          );
        }) })
      ]
    }
  ) });
}
const kd = ["VISA", "Master", "JCB", "AmEx", "PayPay", "LINE Pay"];
function Kh({
  logo: e,
  linkGroups: t = [],
  paymentIcons: r = kd,
  socialLinks: a = [],
  copyright: o,
  className: s
}) {
  return /* @__PURE__ */ n(
    "footer",
    {
      "data-slot": "footer",
      className: u(
        "bg-[var(--Surface-Inverse)] text-white w-full",
        s
      ),
      children: /* @__PURE__ */ f("div", { className: "max-w-5xl mx-auto px-6 py-10", children: [
        e && /* @__PURE__ */ n("div", { className: "mb-8", children: e }),
        t.length > 0 && /* @__PURE__ */ n(
          "div",
          {
            className: "grid gap-8 mb-8",
            style: { gridTemplateColumns: `repeat(${Math.min(t.length, 4)}, minmax(0, 1fr))` },
            children: t.map((l, i) => /* @__PURE__ */ f("div", { children: [
              /* @__PURE__ */ n("h4", { className: "typo-label-xs font-bold uppercase tracking-wider text-white/50 mb-3", children: l.title }),
              /* @__PURE__ */ n("ul", { className: "flex flex-col gap-2", children: l.links.map((c, d) => {
                const m = c.href ? "a" : "button";
                return /* @__PURE__ */ n("li", { children: /* @__PURE__ */ n(
                  m,
                  {
                    href: c.href,
                    onClick: c.onClick,
                    className: "typo-body-sm text-white/70 hover:text-white transition-colors",
                    children: c.label
                  }
                ) }, d);
              }) })
            ] }, i))
          }
        ),
        a.length > 0 && /* @__PURE__ */ n("div", { className: "flex gap-3 mb-6", children: a.map((l, i) => {
          const c = l.href ? "a" : "button";
          return /* @__PURE__ */ n(
            c,
            {
              href: l.href,
              "aria-label": l.label,
              className: "w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors",
              children: l.icon
            },
            i
          );
        }) }),
        r.length > 0 && /* @__PURE__ */ n("div", { className: "flex flex-wrap gap-2 mb-6", children: r.map((l, i) => /* @__PURE__ */ n(
          "span",
          {
            className: "px-2 py-1 rounded bg-white/10 text-white/60 text-[10px] font-bold",
            children: l
          },
          i
        )) }),
        o && /* @__PURE__ */ n("p", { className: "typo-body-xs text-white/30 border-t border-white/10 pt-4", children: o })
      ] })
    }
  );
}
const Bt = {
  line: {
    label: "LINE",
    buildUrl: (e, t) => `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(e)}${t ? `&text=${encodeURIComponent(t)}` : ""}`,
    icon: /* @__PURE__ */ n("svg", { width: "22", height: "22", viewBox: "0 0 22 22", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ n("path", { d: "M11 2C6.6 2 3 5 3 8.8c0 3.3 2.7 6.1 6.5 6.7l.9 1.9 3.1-1.9c3.8-.4 6.5-3.1 6.5-6.7C20 5 16.4 2 11 2z", fill: "currentColor" }) }),
    circleClass: "bg-[#06C755] text-white",
    inlineClass: "border-[#06C755] text-[#06C755] hover:bg-[#F0FFF4]"
  },
  x: {
    label: "X",
    buildUrl: (e, t) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(e)}${t ? `&text=${encodeURIComponent(t)}` : ""}`,
    icon: /* @__PURE__ */ n("svg", { width: "18", height: "18", viewBox: "0 0 18 18", fill: "currentColor", "aria-hidden": "true", children: /* @__PURE__ */ n("path", { d: "M14.2 1h2.5L10.8 7.8 17.5 17h-5.3l-3.9-5.1L4 17H1.5l6.3-7.2L1 1h5.4l3.5 4.6L14.2 1zm-.9 14.3h1.4L5.7 2.4H4.2l9.1 12.9z" }) }),
    circleClass: "bg-[#000] text-white",
    inlineClass: "border-[#000] text-[#000] hover:bg-gray-50"
  },
  facebook: {
    label: "Facebook",
    buildUrl: (e) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(e)}`,
    icon: /* @__PURE__ */ n("svg", { width: "20", height: "20", viewBox: "0 0 20 20", fill: "currentColor", "aria-hidden": "true", children: /* @__PURE__ */ n("path", { d: "M20 10C20 4.5 15.5 0 10 0S0 4.5 0 10c0 5 3.7 9.1 8.4 9.9v-7H5.9V10h2.5V7.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.5V10h2.8l-.4 2.9h-2.3v7C16.3 19.1 20 15 20 10z" }) }),
    circleClass: "bg-[#1877F2] text-white",
    inlineClass: "border-[#1877F2] text-[#1877F2] hover:bg-blue-50"
  },
  copy: {
    label: "リンク",
    icon: /* @__PURE__ */ f("svg", { width: "20", height: "20", viewBox: "0 0 20 20", fill: "none", "aria-hidden": "true", children: [
      /* @__PURE__ */ n("path", { d: "M8.5 11.5a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1.7 1.7", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }),
      /* @__PURE__ */ n("path", { d: "M11.5 8.5a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1.7-1.7", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" })
    ] }),
    circleClass: "bg-[var(--Surface-Tertiary)] text-[var(--Object-Medium-Emphasis)]",
    inlineClass: "border-[var(--Border-Medium-Emphasis)] text-[var(--Text-Medium-Emphasis)] hover:border-[var(--Brand-Primary)] hover:text-[var(--Brand-Primary)]"
  }
};
function Jh({
  url: e,
  title: t,
  providers: r = ["line", "x", "facebook", "copy"],
  layout: a = "circle",
  className: o,
  onCopy: s
}) {
  const [l, i] = x.useState(!1), c = (d) => {
    if (d === "copy") {
      navigator.clipboard.writeText(e).then(() => {
        i(!0), s?.(), setTimeout(() => i(!1), 2e3);
      });
      return;
    }
    const m = Bt[d];
    m.buildUrl && window.open(m.buildUrl(e, t), "_blank", "noopener,noreferrer,width=600,height=500");
  };
  return a === "circle" ? /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "share-buttons",
      "data-layout": "circle",
      className: u("flex items-center gap-4", o),
      role: "group",
      "aria-label": "シェア",
      children: r.map((d) => {
        const m = Bt[d], h = d === "copy";
        return /* @__PURE__ */ f(
          "button",
          {
            onClick: () => c(d),
            "aria-label": m.label,
            className: "flex flex-col items-center gap-1.5 cursor-pointer",
            children: [
              /* @__PURE__ */ n("span", { className: u(
                "w-12 h-12 rounded-full flex items-center justify-center transition-opacity hover:opacity-80 active:scale-95",
                m.circleClass
              ), children: h && l ? /* @__PURE__ */ n("svg", { width: "18", height: "18", viewBox: "0 0 18 18", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ n("path", { d: "M3 9l4 4 8-8", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }) : m.icon }),
              /* @__PURE__ */ n("span", { className: "typo-label-xs text-[var(--Text-Medium-Emphasis)]", children: h && l ? "コピー済" : m.label })
            ]
          },
          d
        );
      })
    }
  ) : /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "share-buttons",
      "data-layout": "inline",
      className: u("flex items-center gap-2 flex-wrap", o),
      role: "group",
      "aria-label": "シェア",
      children: r.map((d) => {
        const m = Bt[d], h = d === "copy";
        return /* @__PURE__ */ f(
          "button",
          {
            onClick: () => c(d),
            className: u(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border typo-label-xs font-semibold transition-colors",
              m.inlineClass
            ),
            children: [
              /* @__PURE__ */ n("span", { className: "w-3.5 h-3.5 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full", children: h && l ? /* @__PURE__ */ n("svg", { viewBox: "0 0 12 12", fill: "none", children: /* @__PURE__ */ n("path", { d: "M1 6l3 3 7-7", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }) }) : m.icon }),
              h && l ? "コピー済み" : m.label
            ]
          },
          d
        );
      })
    }
  );
}
const Xr = [
  "linear-gradient(135deg, #E8426B, #F9AABF)",
  "linear-gradient(135deg, #6366F1, #A5B4FC)",
  "linear-gradient(135deg, #F59E0B, #FDE68A)",
  "linear-gradient(135deg, #10B981, #6EE7B7)",
  "linear-gradient(135deg, #3B82F6, #93C5FD)"
], Nd = {
  "2/1": "aspect-[2/1]",
  "3/2": "aspect-[3/2]",
  "4/3": "aspect-[4/3]"
};
function em({
  title: e,
  items: t,
  moreLabel: r = "もっと見る",
  onMore: a,
  itemAspectRatio: o = "2/1",
  itemWidth: s = 200,
  className: l
}) {
  return /* @__PURE__ */ f("div", { "data-slot": "banner-carousel", className: u("w-full", l), children: [
    (e || a) && /* @__PURE__ */ f("div", { className: "flex items-center justify-between mb-2.5 px-0.5", children: [
      e && /* @__PURE__ */ n("h3", { className: "typo-label-md text-[var(--Text-High-Emphasis)] font-bold", children: e }),
      a && /* @__PURE__ */ f(
        "button",
        {
          onClick: a,
          className: "typo-label-xs text-[var(--Brand-Primary)] font-semibold hover:opacity-70 transition-opacity",
          children: [
            r,
            " →"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ n("div", { className: "flex gap-2.5 overflow-x-auto scrollbar-none pb-1", children: t.map((i, c) => {
      const d = i.gradient ?? Xr[c % Xr.length], m = d.includes("FDE68A"), h = i.href ? "a" : "div";
      return /* @__PURE__ */ f(
        h,
        {
          href: i.href,
          onClick: i.onClick,
          style: {
            width: s,
            flexShrink: 0,
            background: i.imageSrc ? void 0 : d
          },
          className: u(
            "rounded-xl overflow-hidden flex flex-col justify-end p-3 cursor-pointer",
            "hover:opacity-95 active:scale-[.98] transition-transform",
            Nd[o] ?? "aspect-[2/1]",
            i.href && "block",
            !i.imageSrc && (m ? "text-[#111]" : "text-white")
          ),
          children: [
            i.imageSrc && /* @__PURE__ */ n(
              "img",
              {
                src: i.imageSrc,
                alt: i.caption ?? "",
                className: "absolute inset-0 w-full h-full object-cover",
                style: { position: "absolute" }
              }
            ),
            (i.caption || i.subCaption) && /* @__PURE__ */ f("div", { className: "relative z-10", children: [
              i.caption && /* @__PURE__ */ n("p", { className: "typo-label-xs font-bold leading-snug", children: i.caption }),
              i.subCaption && /* @__PURE__ */ n("p", { className: "text-[10px] opacity-75 mt-0.5", children: i.subCaption })
            ] })
          ]
        },
        c
      );
    }) })
  ] });
}
function tm({
  className: e,
  bordered: t = !0,
  children: r,
  ...a
}) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "sticky-action-bar",
      className: u(
        "sticky bottom-0 z-40 bg-[var(--Surface-Primary)] px-4 py-3",
        "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        t && "border-t border-[var(--Border-Low-Emphasis)]",
        e
      ),
      ...a,
      children: r
    }
  );
}
function rm({ items: e, className: t }) {
  return /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "category-nav",
      className: u(
        "flex gap-3 overflow-x-auto px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        t
      ),
      children: [
        e.map((r, a) => {
          const o = !!r.href || !!r.onClick;
          return r.href ? /* @__PURE__ */ f(
            "a",
            {
              href: r.href,
              className: u(
                "flex shrink-0 flex-col items-center gap-1 rounded-lg p-1 transition-colors",
                o && "hover:bg-[var(--Surface-Secondary)]",
                r.isSelected && "bg-[var(--Surface-Accent-Primary-Light)]"
              ),
              children: [
                /* @__PURE__ */ n(
                  "div",
                  {
                    className: u(
                      "size-10 overflow-hidden rounded-full border",
                      r.isSelected ? "border-[var(--Brand-Primary)]" : "border-[var(--Border-Low-Emphasis)]"
                    ),
                    children: /* @__PURE__ */ n(
                      "img",
                      {
                        src: r.imageUrl,
                        alt: r.imageAlt ?? r.name,
                        className: "size-full object-cover",
                        loading: "lazy"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ n(
                  "span",
                  {
                    className: u(
                      "w-14 text-center typo-body-xs leading-tight line-clamp-2",
                      r.isSelected ? "text-[var(--Text-Accent-Primary)]" : "text-[var(--Text-High-Emphasis)]"
                    ),
                    children: r.name
                  }
                )
              ]
            },
            a
          ) : /* @__PURE__ */ f(
            "button",
            {
              type: "button",
              onClick: r.onClick,
              className: u(
                "flex shrink-0 flex-col items-center gap-1 rounded-lg p-1 transition-colors",
                o && "hover:bg-[var(--Surface-Secondary)]",
                r.isSelected && "bg-[var(--Surface-Accent-Primary-Light)]"
              ),
              children: [
                /* @__PURE__ */ n(
                  "div",
                  {
                    className: u(
                      "size-10 overflow-hidden rounded-full border",
                      r.isSelected ? "border-[var(--Brand-Primary)]" : "border-[var(--Border-Low-Emphasis)]"
                    ),
                    children: /* @__PURE__ */ n(
                      "img",
                      {
                        src: r.imageUrl,
                        alt: r.imageAlt ?? r.name,
                        className: "size-full object-cover",
                        loading: "lazy"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ n(
                  "span",
                  {
                    className: u(
                      "w-14 text-center typo-body-xs leading-tight line-clamp-2",
                      r.isSelected ? "text-[var(--Text-Accent-Primary)]" : "text-[var(--Text-High-Emphasis)]"
                    ),
                    children: r.name
                  }
                )
              ]
            },
            a
          );
        }),
        /* @__PURE__ */ n("div", { className: "w-2 shrink-0", "aria-hidden": "true" })
      ]
    }
  );
}
const Sd = {
  sm: "size-[60px]",
  md: "size-[100px]",
  lg: "size-[120px]"
}, Md = {
  sm: "max-w-[60px]",
  md: "max-w-[100px]",
  lg: "max-w-[120px]"
}, Cd = {
  sm: "calc((100vw - 32px) / 4.05)",
  md: "calc((100vw - 32px) / 3.5)",
  lg: "calc((100vw - 32px) / 3.0)"
};
function am({
  title: e,
  moreHref: t,
  items: r,
  thumbnailSize: a = "md",
  thumbnailShape: o = "square",
  layout: s = "scroll",
  gridRows: l = 3,
  className: i
}) {
  const c = o === "circle" ? "rounded-full" : "rounded-lg", d = (m, h) => /* @__PURE__ */ f(
    "a",
    {
      href: m.href,
      className: "group flex shrink-0 flex-col items-center gap-1.5",
      children: [
        /* @__PURE__ */ n(
          "div",
          {
            className: u(
              "shrink-0 overflow-hidden",
              h ? "aspect-square w-full" : Sd[a],
              c
            ),
            children: /* @__PURE__ */ n(
              "img",
              {
                src: m.imageUrl,
                alt: m.name,
                className: "size-full object-cover transition-opacity group-hover:opacity-80",
                loading: "lazy"
              }
            )
          }
        ),
        /* @__PURE__ */ n(
          "span",
          {
            className: u(
              "text-center typo-label-sm text-[var(--Text-High-Emphasis)]",
              h ? "w-full" : Md[a]
            ),
            children: m.name
          }
        )
      ]
    },
    m.href
  );
  return /* @__PURE__ */ f("section", { "data-slot": "category-scroll", className: u("py-4", i), children: [
    /* @__PURE__ */ n(
      Vc,
      {
        title: e,
        action: t ? /* @__PURE__ */ n(
          "a",
          {
            href: t,
            className: "typo-body-sm text-[var(--Text-Accent-Primary)] hover:underline shrink-0",
            children: "もっと見る"
          }
        ) : void 0
      }
    ),
    s === "grid" ? /* @__PURE__ */ f("div", { className: "mt-3 overflow-x-auto pl-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", children: [
      /* @__PURE__ */ n(
        "div",
        {
          className: "grid gap-2",
          style: {
            gridTemplateRows: `repeat(${l}, auto)`,
            gridAutoFlow: "column",
            gridAutoColumns: Cd[a]
          },
          children: r.map((m) => d(m, !0))
        }
      ),
      /* @__PURE__ */ n("div", { className: "w-4 shrink-0", "aria-hidden": "true" })
    ] }) : /* @__PURE__ */ f("div", { className: "mt-3 flex gap-3 overflow-x-auto pl-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", children: [
      r.map((m) => d(m)),
      /* @__PURE__ */ n("div", { className: "w-4 shrink-0", "aria-hidden": "true" })
    ] })
  ] });
}
function nm({
  state: e,
  errorCount: t = 0,
  onRetry: r,
  syncingLabel: a = "同期中",
  successLabel: o = "保存済み",
  errorLabel: s = (d) => `${d}件のエラー`,
  offlineLabel: l = "オフライン",
  retryLabel: i = "再試行",
  className: c
}) {
  if (e === "idle" && t === 0) return null;
  const d = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full typo-label-xs font-medium select-none";
  return e === "syncing" ? /* @__PURE__ */ f("span", { "data-slot": "sync-status-badge", "data-state": e, className: u(d, "bg-[var(--Surface-Info)] text-[var(--Text-Info)]", c), children: [
    /* @__PURE__ */ n(
      "span",
      {
        "aria-hidden": !0,
        className: "size-3 rounded-full border-[1.5px] border-current border-t-transparent animate-spin"
      }
    ),
    a
  ] }) : e === "success" ? /* @__PURE__ */ f("span", { "data-slot": "sync-status-badge", "data-state": e, className: u(d, "bg-[var(--Surface-Success)] text-[var(--Text-Success)]", c), children: [
    /* @__PURE__ */ n("span", { "aria-hidden": !0, className: "size-1.5 rounded-full bg-current" }),
    o
  ] }) : e === "error" ? /* @__PURE__ */ f("span", { "data-slot": "sync-status-badge", "data-state": e, className: u(d, "bg-[var(--Surface-Caution)] text-[var(--Text-Caution)]", c), children: [
    /* @__PURE__ */ n("span", { "aria-hidden": !0, className: "size-1.5 rounded-full bg-current" }),
    s(t),
    r && /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        onClick: r,
        className: "ml-1 underline underline-offset-2 hover:no-underline",
        children: i
      }
    )
  ] }) : e === "offline" ? /* @__PURE__ */ f("span", { "data-slot": "sync-status-badge", "data-state": e, className: u(d, "bg-[var(--Surface-Secondary)] text-[var(--Text-Low-Emphasis)]", c), children: [
    /* @__PURE__ */ n("span", { "aria-hidden": !0, className: "size-1.5 rounded-full bg-current" }),
    l
  ] }) : null;
}
function om({
  label: e,
  value: t,
  options: r,
  onSelect: a,
  hideAll: o = !1,
  allLabel: s = "すべて",
  getDisplayLabel: l,
  valueOnly: i = !1,
  pristineValue: c,
  className: d
}) {
  const [m, h] = x.useState(!1), p = x.useRef(null), [v, b] = x.useState({ top: 0, left: 0 }), g = t !== "all" && t !== c, w = r.find((k) => k.key === t), y = (k) => l ? l(k) : w?.label ?? String(k), S = g ? i ? y(t) : `${e}: ${y(t)}` : e, M = () => {
    if (p.current) {
      const k = p.current.getBoundingClientRect();
      b({ top: k.bottom + 4, left: k.left });
    }
    h((k) => !k);
  }, N = (k) => {
    a(k), h(!1);
  };
  return /* @__PURE__ */ f("div", { "data-slot": "dropdown-filter", "data-active": g || void 0, className: u("flex-shrink-0", d), children: [
    /* @__PURE__ */ f(
      "button",
      {
        ref: p,
        type: "button",
        onClick: M,
        "aria-expanded": m,
        "aria-haspopup": "listbox",
        className: u(
          "h-9 rounded-full px-4 typo-label-sm flex items-center gap-1.5 transition-all duration-200",
          g ? "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)]" : "bg-[var(--Surface-Primary)] border border-[var(--Border-Low-Emphasis)] text-[var(--Text-Medium-Emphasis)]"
        ),
        children: [
          S,
          /* @__PURE__ */ n(
            "svg",
            {
              "aria-hidden": !0,
              className: u("w-3 h-3 transition-transform duration-200", m && "rotate-180"),
              viewBox: "0 0 12 12",
              fill: "none",
              children: /* @__PURE__ */ n("path", { d: "M3 4.5L6 7.5L9 4.5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })
            }
          )
        ]
      }
    ),
    m && /* @__PURE__ */ f(de, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          "aria-label": "閉じる",
          className: "fixed inset-0 z-40",
          onClick: () => h(!1)
        }
      ),
      /* @__PURE__ */ f(
        "ul",
        {
          role: "listbox",
          className: "fixed z-50 bg-[var(--Surface-Primary)] border border-[var(--Border-Low-Emphasis)] rounded-2xl shadow-[var(--shadow-lg)] py-1 max-h-[60vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-150",
          style: { top: v.top, left: Math.min(v.left, (typeof window < "u" ? window.innerWidth : 375) - 200), width: 200 },
          children: [
            !o && /* @__PURE__ */ n("li", { children: /* @__PURE__ */ f(
              "button",
              {
                type: "button",
                role: "option",
                "aria-selected": t === "all",
                onClick: () => N("all"),
                className: u(
                  "w-full flex items-center justify-between px-4 py-2.5 typo-body-sm transition-colors hover:bg-[var(--Surface-Secondary)]",
                  t === "all" ? "text-[var(--Brand-Primary)] font-semibold" : "text-[var(--Text-High-Emphasis)]"
                ),
                children: [
                  /* @__PURE__ */ n("span", { children: s }),
                  t === "all" && /* @__PURE__ */ n("span", { "aria-hidden": !0, className: "text-[var(--Brand-Primary)]", children: "✓" })
                ]
              }
            ) }),
            r.map((k) => /* @__PURE__ */ n("li", { children: /* @__PURE__ */ f(
              "button",
              {
                type: "button",
                role: "option",
                "aria-selected": t === k.key,
                onClick: () => N(k.key),
                className: u(
                  "w-full flex items-center justify-between px-4 py-2.5 typo-body-sm transition-colors hover:bg-[var(--Surface-Secondary)]",
                  t === k.key ? "text-[var(--Brand-Primary)] font-semibold" : "text-[var(--Text-High-Emphasis)]"
                ),
                children: [
                  /* @__PURE__ */ n("span", { className: "truncate", children: k.label }),
                  t === k.key && /* @__PURE__ */ n("span", { "aria-hidden": !0, className: "text-[var(--Brand-Primary)] ml-2 flex-shrink-0", children: "✓" })
                ]
              }
            ) }, k.key))
          ]
        }
      )
    ] })
  ] });
}
function sm({ label: e, value: t, isActive: r, onClick: a, className: o }) {
  return /* @__PURE__ */ n(
    Za,
    {
      size: "lg",
      selected: !!r,
      variant: r ? "filled" : "outline",
      onClick: a,
      className: u("flex-shrink-0", o),
      children: r && t ? `${e}: ${t}` : e
    },
    r ? "on" : "off"
  );
}
function im({
  active: e,
  onPinCreate: t,
  pins: r = [],
  onPinClick: a,
  holdDuration: o = 600,
  onHaptic: s,
  className: l,
  children: i
}) {
  const c = x.useRef(null), d = x.useRef(null), [m, h] = x.useState(null), p = (g, w) => {
    const y = c.current;
    if (!y) return { x: 0.5, y: 0.5 };
    const S = y.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (g - S.left) / S.width)),
      y: Math.min(1, Math.max(0, (w - S.top) / S.height))
    };
  }, v = (g, w) => {
    if (!e) return;
    const y = p(g, w);
    h(y), d.current = setTimeout(() => {
      s?.(), t?.(y), h(null);
    }, o);
  }, b = () => {
    d.current && clearTimeout(d.current), h(null);
  };
  return /* @__PURE__ */ f(
    "div",
    {
      ref: c,
      className: u("relative select-none", l),
      onMouseDown: (g) => v(g.clientX, g.clientY),
      onMouseUp: b,
      onMouseLeave: b,
      onTouchStart: (g) => {
        const w = g.touches[0];
        v(w.clientX, w.clientY);
      },
      onTouchEnd: b,
      onTouchCancel: b,
      children: [
        i,
        e && m && /* @__PURE__ */ n(
          "div",
          {
            "aria-hidden": !0,
            className: "absolute inset-0 pointer-events-none",
            style: {
              background: `radial-gradient(circle 60px at ${m.x * 100}% ${m.y * 100}%, transparent 40px, rgba(0,0,0,0.45) 70px)`
            }
          }
        ),
        e && r.map((g) => /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            "aria-label": g.comment ?? "レビューピン",
            onClick: () => a?.(g),
            className: "absolute -translate-x-1/2 -translate-y-1/2 z-10 group",
            style: { left: `${g.x * 100}%`, top: `${g.y * 100}%` },
            children: /* @__PURE__ */ n("span", { className: "flex size-5 items-center justify-center rounded-full bg-[var(--Object-Caution)] shadow-md ring-4 ring-[var(--Object-Caution)]/30 group-hover:ring-[var(--Object-Caution)]/50 transition-all" })
          },
          g.id
        ))
      ]
    }
  );
}
export {
  jd as Accordion,
  _d as AccordionContent,
  Fd as AccordionItem,
  Ad as AccordionTrigger,
  lh as AdminShell,
  zd as Alert,
  $d as AlertDescription,
  Rd as AlertDialog,
  Zd as AlertDialogAction,
  Kd as AlertDialogCancel,
  qd as AlertDialogContent,
  Qd as AlertDialogDescription,
  Ud as AlertDialogFooter,
  Gd as AlertDialogHeader,
  Qn as AlertDialogOverlay,
  Xn as AlertDialogPortal,
  Xd as AlertDialogTitle,
  Vd as AlertDialogTrigger,
  Yd as AlertTitle,
  Yf as AppHeader,
  ch as AppShell,
  Nf as AutoGrowTextarea,
  Zn as Avatar,
  Jn as AvatarFallback,
  Kn as AvatarImage,
  Jd as Badge,
  Qf as Banner,
  em as BannerCarousel,
  Uf as BottomSheetForm,
  gh as BottomTabBar,
  eu as Breadcrumb,
  su as BreadcrumbEllipsis,
  ru as BreadcrumbItem,
  au as BreadcrumbLink,
  tu as BreadcrumbList,
  nu as BreadcrumbPage,
  ou as BreadcrumbSeparator,
  Nh as BulkActions,
  pe as Button,
  Aa as Calendar,
  iu as Card,
  uu as CardAction,
  fu as CardContent,
  du as CardDescription,
  hu as CardFooter,
  lu as CardHeader,
  cu as CardTitle,
  rm as CategoryNav,
  am as CategoryScroll,
  Dh as ChartControls,
  ro as Checkbox,
  mu as CheckboxCardGroup,
  pu as CheckboxCardItem,
  vu as CheckboxGroup,
  bu as CheckboxGroupItem,
  Za as Chip,
  Xf as ChipSelector,
  Tc as CoachMark,
  Lf as CoachMarkOverlay,
  gu as Collapsible,
  yu as CollapsibleContent,
  xu as CollapsibleTrigger,
  Zu as Combobox,
  Gf as ConfirmDialog,
  Ff as CookieConsent,
  Bf as CountdownTimer,
  Ph as DataTable,
  _h as DataTableActionCell,
  Uh as DataTableAddRow,
  jh as DataTableAvatarCell,
  Lh as DataTableBody,
  qh as DataTableBulkActions,
  Hh as DataTableCell,
  Ah as DataTableCheckboxCell,
  Rh as DataTableDragHandleCell,
  Xh as DataTableEmptyState,
  Ih as DataTableHead,
  Oh as DataTableHeader,
  Fh as DataTableImageCell,
  zh as DataTableInputCell,
  Vh as DataTableLinkCell,
  $h as DataTableNumberCell,
  Wh as DataTableRow,
  Gh as DataTableSectionRow,
  Yh as DataTableSelectCell,
  Bh as DataTableTable,
  Uu as DatePicker,
  Xu as DateRangePicker,
  ao as Dialog,
  so as DialogClose,
  lo as DialogContent,
  ho as DialogDescription,
  uo as DialogFooter,
  co as DialogHeader,
  io as DialogOverlay,
  oo as DialogPortal,
  fo as DialogTitle,
  no as DialogTrigger,
  om as DropdownFilter,
  Eu as DropdownMenu,
  Wu as DropdownMenuCheckboxItem,
  Bu as DropdownMenuContent,
  Ou as DropdownMenuGroup,
  Lu as DropdownMenuItem,
  ju as DropdownMenuLabel,
  Du as DropdownMenuPortal,
  Iu as DropdownMenuRadioGroup,
  Hu as DropdownMenuRadioItem,
  Fu as DropdownMenuSeparator,
  Au as DropdownMenuShortcut,
  _u as DropdownMenuSub,
  Yu as DropdownMenuSubContent,
  zu as DropdownMenuSubTrigger,
  Pu as DropdownMenuTrigger,
  Zf as EmptyState,
  Kf as ErrorState,
  Th as FileUpload,
  xh as FilterBar,
  sm as FilterChip,
  Kh as Footer,
  wu as Form,
  hh as FormActions,
  Mu as FormControl,
  Cu as FormDescription,
  Jf as FormField,
  Nu as FormItem,
  Su as FormLabel,
  Tu as FormMessage,
  uh as FormRoot,
  fh as FormSection,
  pf as GridSkeleton,
  $u as HoverCard,
  Vu as HoverCardContent,
  Ru as HoverCardTrigger,
  bh as ImageCarousel,
  _f as ImageGallery,
  Ch as ImageUploader,
  qu as Input,
  kh as KebabMenu,
  Jr as Label,
  eh as ListItem,
  mf as ListSkeleton,
  dh as MarketingShell,
  Zh as MenuDrawer,
  Ku as MultiSelect,
  zf as NavigationBar,
  th as NotificationBadge,
  Eh as NotificationList,
  Ef as NumberInput,
  ph as OrderSummary,
  Ju as Pagination,
  ef as PaginationContent,
  nf as PaginationEllipsis,
  tf as PaginationItem,
  Ya as PaginationLink,
  af as PaginationNext,
  rf as PaginationPrevious,
  Df as PillToggle,
  tt as Popover,
  Gu as PopoverAnchor,
  at as PopoverContent,
  rt as PopoverTrigger,
  _r as PriceDisplay,
  od as ProductCard,
  vh as ProductCarousel,
  of as Progress,
  Tf as ProgressRing,
  rh as ProgressSteps,
  mh as QuantitySelector,
  sf as RadioGroup,
  lf as RadioGroupItem,
  zr as RatingDisplay,
  jc as ResponsiveDialog,
  qf as ResponsiveDialogClose,
  Fc as ResponsiveDialogContent,
  zc as ResponsiveDialogDescription,
  Yc as ResponsiveDialogFooter,
  Ac as ResponsiveDialogHeader,
  _c as ResponsiveDialogTitle,
  Vf as ResponsiveDialogTrigger,
  yh as ReviewCard,
  im as ReviewOverlay,
  wh as ReviewSummary,
  ku as RhfFormField,
  ac as ScrollArea,
  nc as ScrollBar,
  ah as SearchBar,
  Mh as SearchPanel,
  Vc as SectionHeader,
  sc as Select,
  cc as SelectContent,
  cf as SelectGroup,
  dc as SelectItem,
  uf as SelectLabel,
  df as SelectSeparator,
  lc as SelectTrigger,
  ic as SelectValue,
  ff as Separator,
  Jh as ShareButtons,
  Zt as Sheet,
  fc as SheetClose,
  er as SheetContent,
  Ua as SheetDescription,
  qa as SheetDragIndicator,
  hf as SheetFooter,
  tr as SheetHeader,
  rr as SheetTitle,
  uc as SheetTrigger,
  Qh as SimplePagination,
  Ve as Skeleton,
  vf as Slider,
  Af as SocialLoginButton,
  bf as Spinner,
  Pf as StarRating,
  nh as StatCard,
  Sh as StatusTabs,
  tm as StickyActionBar,
  Of as SubNav,
  Rf as SwipeRow,
  gf as Switch,
  nm as SyncStatusBadge,
  xf as Tabs,
  kf as TabsContent,
  yf as TabsList,
  wf as TabsTrigger,
  oh as Tag,
  $f as TagInput,
  gc as Textarea,
  Qu as TimePicker,
  ih as Toaster,
  Sf as Tooltip,
  Cf as TooltipContent,
  xc as TooltipProvider,
  Mf as TooltipTrigger,
  eo as badgeVariants,
  $c as bannerVariants,
  vt as buttonVariants,
  jr as chipVariants,
  u as cn,
  yt as getStickyCellProps,
  Wf as isCoachCompleted,
  jf as isCookieDecided,
  If as markCoachCompleted,
  ed as priceVariants,
  Hf as resetCoach,
  Gc as tagVariants,
  Ae as toast,
  bt as useFormField,
  Ne as useMediaQuery,
  sh as useToast
};
