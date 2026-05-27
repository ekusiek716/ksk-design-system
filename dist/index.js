"use client";
import { jsx as n, jsxs as f, Fragment as de } from "react/jsx-runtime";
import { Accordion as qe, AlertDialog as ge, Avatar as jt, Checkbox as Ie, Label as Sn, Collapsible as Ht, Dialog as $, DropdownMenu as U, HoverCard as ft, Popover as Ge, Progress as lr, RadioGroup as Bt, ScrollArea as Ve, Select as ae, Separator as Cn, Slider as ot, Switch as cr, Tabs as mt, Tooltip as Ue } from "radix-ui";
import { clsx as Tn } from "clsx";
import { twMerge as En } from "tailwind-merge";
import * as w from "react";
import T, { createContext as Dn, useContext as Pn, useCallback as ne, useRef as lt, useLayoutEffect as Bn, useState as Ot, useEffect as On, useMemo as ct } from "react";
import { cva as se } from "class-variance-authority";
import { Warning2 as Ln, CloseCircle as Wn, InfoCircle as In, TickCircle as jn, TickSquare as Gr } from "iconsax-reactjs";
import { b as pt } from "./server-variants-CVS6LB4L.js";
import { Slot as Hn } from "@radix-ui/react-slot";
import * as Pe from "@radix-ui/react-tooltip";
import { createPortal as Fn } from "react-dom";
function u(...e) {
  return En(Tn(e));
}
function Cd({ ...e }) {
  return /* @__PURE__ */ n(qe.Root, { "data-slot": "accordion", ...e });
}
function Td({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    qe.Item,
    {
      "data-slot": "accordion-item",
      className: u("border-b border-[var(--Border-Low-Emphasis)]", e),
      ...t
    }
  );
}
function Ed({ className: e, children: t, ...r }) {
  return /* @__PURE__ */ n(qe.Header, { className: "flex", children: /* @__PURE__ */ f(
    qe.Trigger,
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
function Dd({ className: e, children: t, ...r }) {
  return /* @__PURE__ */ n(
    qe.Content,
    {
      "data-slot": "accordion-content",
      className: "overflow-hidden typo-body-md data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up",
      ...r,
      children: /* @__PURE__ */ n("div", { className: u("pb-4 pt-0", e), children: t })
    }
  );
}
const dr = se("relative w-full", {
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
}), ur = se(
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
), ht = w.createContext("info"), An = (e) => e === "success" || e === "info" || e === "error" || e === "warning", _n = {
  success: { Icon: jn, color: "text-[var(--Text-Success)]" },
  info: { Icon: In, color: "text-[var(--Text-Medium-Emphasis)]" },
  error: { Icon: Wn, color: "text-[var(--Text-Caution)]" },
  warning: { Icon: Ln, color: "text-[var(--Text-Warning)]" }
};
function Pd({
  className: e,
  variant: t = "info",
  children: r,
  title: a,
  description: o,
  icon: s,
  action: l,
  ...i
}) {
  const c = An(t);
  if (c && !r && (a || o)) {
    const { Icon: h, color: m } = _n[t], p = Ur[t] ?? "", v = s ?? /* @__PURE__ */ n(h, { size: 24, className: u("shrink-0", m) });
    return /* @__PURE__ */ n(ht.Provider, { value: t, children: /* @__PURE__ */ n(
      "div",
      {
        "data-slot": "alert",
        "data-variant": t,
        role: "alert",
        className: u(dr({ variant: t }), e),
        ...i,
        children: /* @__PURE__ */ f("div", { className: ur({ variant: t }), children: [
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
  return /* @__PURE__ */ n(ht.Provider, { value: t, children: /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "alert",
      "data-variant": t,
      role: "alert",
      className: u(dr({ variant: t }), e),
      ...i,
      children: c ? /* @__PURE__ */ n("div", { className: ur({ variant: t }), children: r }) : r
    }
  ) });
}
const Ur = {
  success: "text-[var(--Primitive-Forest-800)]",
  info: "text-[var(--Text-High-Emphasis)]",
  error: "text-[var(--Text-Caution)]",
  warning: "text-[var(--Text-Warning)]",
  "inline-info": "text-[var(--Text-High-Emphasis)]",
  "inline-caution": "text-[var(--Text-Caution)]",
  "inline-warning": "text-[var(--Text-Warning)]"
};
function Bd({ className: e, ...t }) {
  const r = w.useContext(ht), a = Ur[r ?? "info"] ?? "";
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "alert-title",
      className: u("typo-label-md", a, e),
      ...t
    }
  );
}
const zn = {
  error: "text-[var(--Text-Caution)]",
  "inline-caution": "text-[var(--Text-Caution)]",
  "inline-warning": "text-[var(--Text-Warning)]"
};
function Od({
  className: e,
  ...t
}) {
  const r = w.useContext(ht), a = zn[r ?? ""] ?? "";
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
const Yn = {
  light: 10,
  medium: 25,
  heavy: 50,
  warning: [30, 50, 30]
};
function ke({ className: e, variant: t, size: r, layout: a, haptic: o, onClick: s, ...l }) {
  const i = w.useCallback(
    (c) => {
      o && typeof navigator < "u" && "vibrate" in navigator && navigator.vibrate(Yn[o]), s?.(c);
    },
    [o, s]
  );
  return /* @__PURE__ */ n(
    "button",
    {
      "data-slot": "button",
      "data-variant": t ?? "default",
      "data-size": r ?? "default",
      className: u(pt({ variant: t, size: r, layout: a, className: e })),
      onClick: i,
      ...l
    }
  );
}
function Ld({
  ...e
}) {
  return /* @__PURE__ */ n(ge.Root, { "data-slot": "alert-dialog", ...e });
}
function Wd({
  ...e
}) {
  return /* @__PURE__ */ n(ge.Trigger, { "data-slot": "alert-dialog-trigger", ...e });
}
function $n({
  ...e
}) {
  return /* @__PURE__ */ n(ge.Portal, { "data-slot": "alert-dialog-portal", ...e });
}
function Rn({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ n(
    ge.Overlay,
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
function Id({
  className: e,
  size: t = "default",
  ...r
}) {
  return /* @__PURE__ */ f($n, { children: [
    /* @__PURE__ */ n(Rn, {}),
    /* @__PURE__ */ n(
      ge.Content,
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
function jd({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "alert-dialog-header",
      className: u("flex flex-col gap-2 text-center sm:text-left", e),
      ...t
    }
  );
}
function Hd({ className: e, ...t }) {
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
function Fd({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ n(
    ge.Title,
    {
      "data-slot": "alert-dialog-title",
      className: u("typo-heading-lg text-[var(--Text-High-Emphasis)]", e),
      ...t
    }
  );
}
function Ad({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ n(
    ge.Description,
    {
      "data-slot": "alert-dialog-description",
      className: u("typo-body-sm text-[var(--Text-Medium-Emphasis)]", e),
      ...t
    }
  );
}
function _d({
  className: e,
  variant: t = "default",
  size: r = "default",
  ...a
}) {
  return /* @__PURE__ */ n(
    ge.Action,
    {
      "data-slot": "alert-dialog-action",
      className: u(pt({ variant: t, size: r }), e),
      ...a
    }
  );
}
function zd({
  className: e,
  variant: t = "tertiary",
  size: r = "default",
  ...a
}) {
  return /* @__PURE__ */ n(
    ge.Cancel,
    {
      "data-slot": "alert-dialog-cancel",
      className: u(pt({ variant: t, size: r }), e),
      ...a
    }
  );
}
function Vn({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    jt.Root,
    {
      "data-slot": "avatar",
      className: u("relative flex size-10 shrink-0 overflow-hidden rounded-full", e),
      ...t
    }
  );
}
function qn({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    jt.Image,
    {
      "data-slot": "avatar-image",
      className: u("aspect-square size-full", e),
      ...t
    }
  );
}
function Gn({ className: e, ...t }) {
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
const Un = se(
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
function Yd({
  className: e,
  variant: t,
  ...r
}) {
  return /* @__PURE__ */ n(
    "span",
    {
      "data-slot": "badge",
      "data-variant": t ?? "default",
      className: u(Un({ variant: t }), e),
      ...r
    }
  );
}
function $d({ label: e = "パンくずリスト", ...t }) {
  return /* @__PURE__ */ n("nav", { "aria-label": e, "data-slot": "breadcrumb", ...t });
}
function Rd({ className: e, ...t }) {
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
function Vd({ className: e, ...t }) {
  return /* @__PURE__ */ n("li", { "data-slot": "breadcrumb-item", className: u("inline-flex items-center gap-1.5", e), ...t });
}
function qd({ className: e, ...t }) {
  return /* @__PURE__ */ n("a", { "data-slot": "breadcrumb-link", className: u("hover:text-[var(--Text-High-Emphasis)] transition-colors", e), ...t });
}
function Gd({ className: e, ...t }) {
  return /* @__PURE__ */ n("span", { "data-slot": "breadcrumb-page", role: "link", "aria-disabled": "true", "aria-current": "page", className: u("text-[var(--Text-High-Emphasis)] typo-label-sm", e), ...t });
}
function Ud({ children: e, className: t, ...r }) {
  return /* @__PURE__ */ n("li", { role: "presentation", "aria-hidden": "true", "data-slot": "breadcrumb-separator", className: u("[&>svg]:size-3.5", t), ...r, children: e ?? /* @__PURE__ */ n("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ n("path", { d: "M6 4L10 8L6 12", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }) });
}
function Xd({ className: e, ...t }) {
  return /* @__PURE__ */ f("span", { role: "presentation", "aria-hidden": "true", "data-slot": "breadcrumb-ellipsis", className: u("flex size-9 items-center justify-center", e), ...t, children: [
    /* @__PURE__ */ f("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", children: [
      /* @__PURE__ */ n("circle", { cx: "3", cy: "8", r: "1", fill: "currentColor" }),
      /* @__PURE__ */ n("circle", { cx: "8", cy: "8", r: "1", fill: "currentColor" }),
      /* @__PURE__ */ n("circle", { cx: "13", cy: "8", r: "1", fill: "currentColor" })
    ] }),
    /* @__PURE__ */ n("span", { className: "sr-only", children: "その他" })
  ] });
}
const Xn = se(
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
function Qd({ className: e, variant: t, ...r }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "card",
      "data-variant": t ?? "default",
      className: u(Xn({ variant: t }), e),
      ...r
    }
  );
}
function Zd({ className: e, ...t }) {
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
function Kd({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "card-title",
      className: u("typo-heading-lg", e),
      ...t
    }
  );
}
function Jd({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "card-description",
      className: u("typo-body-sm text-[var(--Text-Medium-Emphasis)]", e),
      ...t
    }
  );
}
function eu({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "card-action",
      className: u("@sm:ml-auto", e),
      ...t
    }
  );
}
function tu({ className: e, ...t }) {
  return /* @__PURE__ */ n("div", { "data-slot": "card-content", className: u("", e), ...t });
}
function ru({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "card-footer",
      className: u("flex items-center gap-2", e),
      ...t
    }
  );
}
function fr({ className: e, ...t }) {
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
function Qn({
  label: e,
  description: t,
  count: r,
  containerClassName: a,
  className: o,
  id: s,
  ...l
}) {
  const i = w.useId(), c = s ?? i;
  return e === void 0 ? /* @__PURE__ */ n(fr, { id: c, className: o, ...l }) : /* @__PURE__ */ f(
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
        /* @__PURE__ */ n(fr, { id: c, className: o, ...l }),
        /* @__PURE__ */ f("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ n("span", { className: "typo-body-md text-[var(--Text-High-Emphasis)]", children: e }),
          t && /* @__PURE__ */ n("span", { className: "block typo-body-sm text-[var(--Text-Medium-Emphasis)] mt-0.5", children: t })
        ] }),
        r !== void 0 && /* @__PURE__ */ n("span", { className: "shrink-0 typo-label-sm text-[var(--Text-Medium-Emphasis)] tabular-nums", children: r.toLocaleString() })
      ]
    }
  );
}
function au({
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
function nu({
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
                Gr,
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
function Xr({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ n(
    Sn.Root,
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
function ou({
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
function su({
  className: e,
  children: t,
  description: r,
  ...a
}) {
  const o = w.useId();
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
              Gr,
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
            Xr,
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
function iu({
  ...e
}) {
  return /* @__PURE__ */ n(Ht.Root, { "data-slot": "collapsible", ...e });
}
function lu({
  ...e
}) {
  return /* @__PURE__ */ n(
    Ht.CollapsibleTrigger,
    {
      "data-slot": "collapsible-trigger",
      ...e
    }
  );
}
function cu({
  ...e
}) {
  return /* @__PURE__ */ n(
    Ht.CollapsibleContent,
    {
      "data-slot": "collapsible-content",
      ...e
    }
  );
}
function Zn({ ...e }) {
  return /* @__PURE__ */ n($.Root, { "data-slot": "dialog", ...e });
}
function Kn({ ...e }) {
  return /* @__PURE__ */ n($.Trigger, { "data-slot": "dialog-trigger", ...e });
}
function Jn({ ...e }) {
  return /* @__PURE__ */ n($.Portal, { "data-slot": "dialog-portal", ...e });
}
function eo({ ...e }) {
  return /* @__PURE__ */ n($.Close, { "data-slot": "dialog-close", ...e });
}
function to({ className: e, ...t }) {
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
function ro({
  className: e,
  children: t,
  padding: r = !0,
  description: a,
  ...o
}) {
  const s = w.useId(), l = a != null && a !== !1, i = l ? s : o["aria-describedby"];
  return /* @__PURE__ */ f(Jn, { children: [
    /* @__PURE__ */ n(to, {}),
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
function ao({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "dialog-header",
      className: u("flex flex-col gap-2", e),
      ...t
    }
  );
}
function no({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "dialog-footer",
      className: u("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", e),
      ...t
    }
  );
}
function oo({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    $.Title,
    {
      "data-slot": "dialog-title",
      className: u("typo-heading-lg text-[var(--Text-High-Emphasis)]", e),
      ...t
    }
  );
}
function so({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    $.Description,
    {
      "data-slot": "dialog-description",
      className: u("typo-body-md text-[var(--Text-Medium-Emphasis)]", e),
      ...t
    }
  );
}
var io = (e) => e.type === "checkbox", Ye = (e) => e instanceof Date, Ft = (e) => e == null;
const Qr = (e) => typeof e == "object";
var Te = (e) => !Ft(e) && !Array.isArray(e) && Qr(e) && !Ye(e), lo = (e) => Te(e) && e.target ? io(e.target) ? e.target.checked : e.target.value : e, co = (e, t) => t.split(".").some((r, a, o) => !isNaN(Number(r)) && e.has(o.slice(0, a).join("."))), uo = (e) => {
  const t = e.constructor && e.constructor.prototype;
  return Te(t) && t.hasOwnProperty("isPrototypeOf");
}, fo = typeof window < "u" && typeof window.HTMLElement < "u" && typeof document < "u";
function Zr(e) {
  if (e instanceof Date)
    return new Date(e);
  const t = typeof FileList < "u" && e instanceof FileList;
  if (fo && (e instanceof Blob || t))
    return e;
  const r = Array.isArray(e);
  if (!r && !(Te(e) && uo(e)))
    return e;
  const a = r ? [] : Object.create(Object.getPrototypeOf(e));
  for (const o in e)
    Object.prototype.hasOwnProperty.call(e, o) && (a[o] = Zr(e[o]));
  return a;
}
var Kr = (e) => /^\w*$/.test(e), Lt = (e) => e === void 0, ho = (e) => Array.isArray(e) ? e.filter(Boolean) : [], Jr = (e) => ho(e.replace(/["|']|\]/g, "").split(/\.|\[/)), ee = (e, t, r) => {
  if (!t || !Te(e))
    return r;
  const o = (Kr(t) ? [t] : Jr(t)).reduce((s, l) => Ft(s) ? void 0 : s[l], e);
  return Lt(o) || o === e ? Lt(e[t]) ? r : e[t] : o;
}, St = (e) => typeof e == "boolean", st = (e) => typeof e == "function", hr = (e, t, r) => {
  let a = -1;
  const o = Kr(t) ? [t] : Jr(t), s = o.length, l = s - 1;
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
const mr = {
  BLUR: "blur",
  CHANGE: "change"
}, pr = {
  all: "all"
}, At = T.createContext(null);
At.displayName = "HookFormControlContext";
const _t = () => T.useContext(At);
var mo = (e, t, r, a = !0) => {
  const o = {};
  for (const s in e)
    Object.defineProperty(o, s, {
      get: () => {
        const l = s;
        return t._proxyFormState[l] !== pr.all && (t._proxyFormState[l] = !a || pr.all), r && (r[l] = !0), e[l];
      }
    });
  return o;
};
const ea = typeof window < "u" ? T.useLayoutEffect : T.useEffect;
function ta(e) {
  const t = _t(), { control: r = t, disabled: a, name: o, exact: s } = e || {}, [l, i] = T.useState(() => ({
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
  return ea(() => r._subscribe({
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
  }, [r]), T.useMemo(() => mo(l, r, c.current, !1), [l, r]);
}
var po = (e) => typeof e == "string", vr = (e, t, r, a, o) => po(e) ? ee(r, e, o) : Array.isArray(e) ? e.map((s) => ee(r, s)) : r, br = (e) => Ft(e) || !Qr(e);
function dt(e, t, r = /* @__PURE__ */ new WeakSet()) {
  if (e === t)
    return !0;
  if (br(e) || br(t))
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
      if (Ye(l) && Ye(i) || (Te(l) || Array.isArray(l)) && (Te(i) || Array.isArray(i)) ? !dt(l, i, r) : !Object.is(l, i))
        return !1;
    }
  }
  return !0;
}
function vo(e) {
  const t = _t(), { control: r = t, name: a, defaultValue: o, disabled: s, exact: l, compute: i } = e || {}, c = T.useRef(o), d = T.useRef(i), h = T.useRef(void 0), m = T.useRef(r), p = T.useRef(a);
  d.current = i;
  const [v, b] = T.useState(() => {
    const S = r._getWatch(a, c.current);
    return d.current ? d.current(S) : S;
  }), x = T.useCallback((S) => {
    const C = vr(a, r._names, S || r._formValues, !1, c.current);
    return d.current ? d.current(C) : C;
  }, [r._formValues, r._names, a]), y = T.useCallback((S) => {
    if (!s) {
      const C = vr(a, r._names, S || r._formValues, !1, c.current);
      if (d.current) {
        const N = d.current(C);
        dt(N, h.current) || (b(N), h.current = N);
      } else
        b(C);
    }
  }, [r._formValues, r._names, s, a]);
  ea(() => ((m.current !== r || !dt(p.current, a)) && (m.current = r, p.current = a, y()), r._subscribe({
    name: a,
    formState: {
      values: !0
    },
    exact: l,
    callback: (S) => {
      y(S.values);
    }
  })), [r, l, a, y]), T.useEffect(() => r._removeUnmounted());
  const g = m.current !== r, M = p.current, k = T.useMemo(() => {
    if (s)
      return null;
    const S = !g && !dt(M, a);
    return g || S ? x() : null;
  }, [s, g, a, M, x]);
  return k !== null ? k : v;
}
function bo(e) {
  const t = _t(), { name: r, disabled: a, control: o = t, shouldUnregister: s, defaultValue: l, exact: i = !0 } = e, c = co(o._names.array, r), d = T.useMemo(() => ee(o._formValues, r, ee(o._defaultValues, r, l)), [o, r, l]), h = vo({
    control: o,
    name: r,
    defaultValue: d,
    exact: i
  }), m = ta({
    control: o,
    name: r,
    exact: i
  }), p = T.useRef(e), v = T.useRef(o.register(r, {
    ...e.rules,
    value: h,
    ...St(e.disabled) ? { disabled: e.disabled } : {}
  }));
  p.current = e;
  const b = T.useMemo(() => Object.defineProperties({}, {
    invalid: {
      enumerable: !0,
      get: () => !!ee(m.errors, r)
    },
    isDirty: {
      enumerable: !0,
      get: () => !!ee(m.dirtyFields, r)
    },
    isTouched: {
      enumerable: !0,
      get: () => !!ee(m.touchedFields, r)
    },
    isValidating: {
      enumerable: !0,
      get: () => !!ee(m.validatingFields, r)
    },
    error: {
      enumerable: !0,
      get: () => ee(m.errors, r)
    }
  }), [m, r]), x = T.useCallback((k) => v.current.onChange({
    target: {
      value: lo(k),
      name: r
    },
    type: mr.CHANGE
  }), [r]), y = T.useCallback(() => v.current.onBlur({
    target: {
      value: ee(o._formValues, r),
      name: r
    },
    type: mr.BLUR
  }), [r, o._formValues]), g = T.useCallback((k) => {
    const S = ee(o._fields, r);
    S && S._f && k && (S._f.ref = {
      focus: () => st(k.focus) && k.focus(),
      select: () => st(k.select) && k.select(),
      setCustomValidity: (C) => st(k.setCustomValidity) && k.setCustomValidity(C),
      reportValidity: () => st(k.reportValidity) && k.reportValidity()
    });
  }, [o._fields, r]), M = T.useMemo(() => ({
    name: r,
    value: h,
    ...St(a) || m.disabled ? { disabled: m.disabled || a } : {},
    onChange: x,
    onBlur: y,
    ref: g
  }), [r, a, m.disabled, x, y, g, h]);
  return T.useEffect(() => {
    const k = o._options.shouldUnregister || s;
    o.register(r, {
      ...p.current.rules,
      ...St(p.current.disabled) ? { disabled: p.current.disabled } : {}
    });
    const S = (C, N) => {
      const E = ee(o._fields, C);
      E && E._f && (E._f.mount = N);
    };
    if (S(r, !0), k) {
      const C = Zr(ee(o._options.defaultValues, r, p.current.defaultValue));
      hr(o._defaultValues, r, C), Lt(ee(o._formValues, r)) && hr(o._formValues, r, C);
    }
    return !c && o.register(r), () => {
      (c ? k && !o._state.action : k) ? o.unregister(r) : S(r, !1);
    };
  }, [r, o, c, s]), T.useEffect(() => {
    o._setDisabledField({
      disabled: a,
      name: r
    });
  }, [a, r, o]), T.useMemo(() => ({
    field: M,
    formState: m,
    fieldState: b
  }), [M, m, b]);
}
const go = (e) => e.render(bo(e)), zt = T.createContext(null);
zt.displayName = "HookFormContext";
const xo = () => T.useContext(zt), yo = (e) => {
  const { children: t, watch: r, getValues: a, getFieldState: o, setError: s, clearErrors: l, setValue: i, setValues: c, trigger: d, formState: h, resetField: m, reset: p, handleSubmit: v, unregister: b, control: x, register: y, setFocus: g, subscribe: M } = e, k = T.useMemo(() => ({
    watch: r,
    getValues: a,
    getFieldState: o,
    setError: s,
    clearErrors: l,
    setValue: i,
    setValues: c,
    trigger: d,
    formState: h,
    resetField: m,
    reset: p,
    handleSubmit: v,
    unregister: b,
    control: x,
    register: y,
    setFocus: g,
    subscribe: M
  }), [
    l,
    x,
    h,
    o,
    a,
    v,
    y,
    p,
    m,
    s,
    g,
    i,
    c,
    M,
    d,
    b,
    r
  ]);
  return T.createElement(
    zt.Provider,
    { value: k },
    T.createElement(At.Provider, { value: k.control }, t)
  );
}, du = yo, ra = w.createContext(
  {}
);
function uu({ ...e }) {
  return /* @__PURE__ */ n(ra.Provider, { value: { name: e.name }, children: /* @__PURE__ */ n(go, { ...e }) });
}
const vt = () => {
  const e = w.useContext(ra), t = w.useContext(aa), { getFieldState: r } = xo(), a = ta({ name: e.name }), o = r(e.name, a);
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
}, aa = w.createContext(
  {}
);
function fu({ className: e, ...t }) {
  const r = w.useId();
  return /* @__PURE__ */ n(aa.Provider, { value: { id: r }, children: /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "form-item",
      className: u("grid gap-2", e),
      ...t
    }
  ) });
}
function hu({
  className: e,
  required: t,
  children: r,
  ...a
}) {
  const { error: o, formItemId: s } = vt();
  return /* @__PURE__ */ f(
    Xr,
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
function mu({ ...e }) {
  const { error: t, formItemId: r, formDescriptionId: a, formMessageId: o } = vt();
  return /* @__PURE__ */ n(
    Hn,
    {
      "data-slot": "form-control",
      id: r,
      "aria-describedby": t ? `${a} ${o}` : `${a}`,
      "aria-invalid": !!t,
      ...e
    }
  );
}
function pu({ className: e, ...t }) {
  const { formDescriptionId: r } = vt();
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
function vu({ className: e, ...t }) {
  const { error: r, formMessageId: a } = vt(), o = r ? String(r?.message ?? "") : t.children;
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
function wo({ className: e }) {
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
function ko({ className: e }) {
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
function No({ className: e }) {
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
function bu({
  ...e
}) {
  return /* @__PURE__ */ n(U.Root, { "data-slot": "dropdown-menu", ...e });
}
function gu({
  ...e
}) {
  return /* @__PURE__ */ n(U.Portal, { "data-slot": "dropdown-menu-portal", ...e });
}
function xu({
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
function yu({
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
function wu({
  ...e
}) {
  return /* @__PURE__ */ n(U.Group, { "data-slot": "dropdown-menu-group", ...e });
}
function ku({
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
function Nu({
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
        /* @__PURE__ */ n("span", { className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ n(U.ItemIndicator, { children: /* @__PURE__ */ n(wo, {}) }) }),
        t
      ]
    }
  );
}
function Mu({
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
function Su({
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
        /* @__PURE__ */ n("span", { className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ n(U.ItemIndicator, { children: /* @__PURE__ */ n(No, {}) }) }),
        t
      ]
    }
  );
}
function Cu({
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
function Tu({
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
function Eu({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    "span",
    {
      "data-slot": "dropdown-menu-shortcut",
      className: u("ml-auto typo-body-xs text-[var(--Text-Low-Emphasis)]", e),
      ...t
    }
  );
}
function Du({
  ...e
}) {
  return /* @__PURE__ */ n(U.Sub, { "data-slot": "dropdown-menu-sub", ...e });
}
function Pu({
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
        /* @__PURE__ */ n(ko, { className: "ml-auto" })
      ]
    }
  );
}
function Bu({
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
function Ou({
  openDelay: e = 200,
  closeDelay: t = 100,
  ...r
}) {
  return /* @__PURE__ */ n(
    ft.Root,
    {
      "data-slot": "hover-card",
      openDelay: e,
      closeDelay: t,
      ...r
    }
  );
}
function Lu({
  ...e
}) {
  return /* @__PURE__ */ n(ft.Trigger, { "data-slot": "hover-card-trigger", ...e });
}
function Wu({
  className: e,
  align: t = "center",
  sideOffset: r = 4,
  ...a
}) {
  return /* @__PURE__ */ n(ft.Portal, { "data-slot": "hover-card-portal", children: /* @__PURE__ */ n(
    ft.Content,
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
const gr = [
  "flex h-12 w-full rounded-lg border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] px-3 typo-body-md text-[var(--Text-High-Emphasis)] transition-colors",
  "file:border-0 file:bg-transparent file:typo-body-md",
  "placeholder:text-[var(--Text-Low-Emphasis)]",
  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50 focus-visible:border-[var(--Border-Accent-Primary)]",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "aria-invalid:border-[var(--Border-Caution)] aria-invalid:ring-[var(--Caution-Base)]/20"
].join(" ");
function Iu({ className: e, type: t, startAdornment: r, endAdornment: a, ...o }) {
  return !r && !a ? /* @__PURE__ */ n(
    "input",
    {
      type: t,
      "data-slot": "input",
      className: u(gr, e),
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
          gr,
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
function Mo(e, t, r = "long") {
  return new Intl.DateTimeFormat("en-US", {
    // Enforces engine to render the time. Without the option JavaScriptCore omits it.
    hour: "numeric",
    timeZone: e,
    timeZoneName: r
  }).format(t).split(/\s/g).slice(2).join(" ");
}
const So = {}, $e = {};
function Ce(e, t) {
  try {
    const a = (So[e] ||= new Intl.DateTimeFormat("en-US", {
      timeZone: e,
      timeZoneName: "longOffset"
    }).format)(t).split("GMT")[1];
    return a in $e ? $e[a] : xr(a, a.split(":"));
  } catch {
    if (e in $e) return $e[e];
    const r = e?.match(Co);
    return r ? xr(e, r.slice(1)) : NaN;
  }
}
const Co = /([+-]\d\d):?(\d\d)?/;
function xr(e, t) {
  const r = +(t[0] || 0), a = +(t[1] || 0), o = +(t[2] || 0) / 60;
  return $e[e] = r * 60 + a > 0 ? r * 60 + a + o : r * 60 - a - o;
}
class me extends Date {
  //#region static
  constructor(...t) {
    super(), t.length > 1 && typeof t[t.length - 1] == "string" && (this.timeZone = t.pop()), this.internal = /* @__PURE__ */ new Date(), isNaN(Ce(this.timeZone, this)) ? this.setTime(NaN) : t.length ? typeof t[0] == "number" && (t.length === 1 || t.length === 2 && typeof t[1] != "number") ? this.setTime(t[0]) : typeof t[0] == "string" ? this.setTime(+new Date(t[0])) : t[0] instanceof Date ? this.setTime(+t[0]) : (this.setTime(+new Date(...t)), na(this), Wt(this)) : this.setTime(Date.now());
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
    return Date.prototype.setTime.apply(this, arguments), Wt(this), +this;
  }
  //#endregion
  //#region date-fns integration
  [/* @__PURE__ */ Symbol.for("constructDateFrom")](t) {
    return new me(+new Date(t), this.timeZone);
  }
  //#endregion
}
const yr = /^(get|set)(?!UTC)/;
Object.getOwnPropertyNames(Date.prototype).forEach((e) => {
  if (!yr.test(e)) return;
  const t = e.replace(yr, "$1UTC");
  me.prototype[t] && (e.startsWith("get") ? me.prototype[e] = function() {
    return this.internal[t]();
  } : (me.prototype[e] = function() {
    return Date.prototype[t].apply(this.internal, arguments), To(this), +this;
  }, me.prototype[t] = function() {
    return Date.prototype[t].apply(this, arguments), Wt(this), +this;
  }));
});
function Wt(e) {
  e.internal.setTime(+e), e.internal.setUTCSeconds(e.internal.getUTCSeconds() - Math.round(-Ce(e.timeZone, e) * 60));
}
function To(e) {
  Date.prototype.setFullYear.call(e, e.internal.getUTCFullYear(), e.internal.getUTCMonth(), e.internal.getUTCDate()), Date.prototype.setHours.call(e, e.internal.getUTCHours(), e.internal.getUTCMinutes(), e.internal.getUTCSeconds(), e.internal.getUTCMilliseconds()), na(e);
}
function na(e) {
  const t = Ce(e.timeZone, e), r = t > 0 ? Math.floor(t) : Math.ceil(t), a = /* @__PURE__ */ new Date(+e);
  a.setUTCHours(a.getUTCHours() - 1);
  const o = -(/* @__PURE__ */ new Date(+e)).getTimezoneOffset(), s = -(/* @__PURE__ */ new Date(+a)).getTimezoneOffset(), l = o - s, i = Date.prototype.getHours.apply(e) !== e.internal.getUTCHours();
  l && i && e.internal.setUTCMinutes(e.internal.getUTCMinutes() + l);
  const c = o - r;
  c && Date.prototype.setUTCMinutes.call(e, Date.prototype.getUTCMinutes.call(e) + c);
  const d = /* @__PURE__ */ new Date(+e);
  d.setUTCSeconds(0);
  const h = o > 0 ? d.getSeconds() : (d.getSeconds() - 60) % 60, m = Math.round(-(Ce(e.timeZone, e) * 60)) % 60;
  (m || h) && (e.internal.setUTCSeconds(e.internal.getUTCSeconds() + m), Date.prototype.setUTCSeconds.call(e, Date.prototype.getUTCSeconds.call(e) + m + h));
  const p = Ce(e.timeZone, e), v = p > 0 ? Math.floor(p) : Math.ceil(p), x = -(/* @__PURE__ */ new Date(+e)).getTimezoneOffset() - v, y = v !== r, g = x - c;
  if (y && g) {
    Date.prototype.setUTCMinutes.call(e, Date.prototype.getUTCMinutes.call(e) + g);
    const M = Ce(e.timeZone, e), k = M > 0 ? Math.floor(M) : Math.ceil(M), S = v - k;
    S && (e.internal.setUTCMinutes(e.internal.getUTCMinutes() + S), Date.prototype.setUTCMinutes.call(e, Date.prototype.getUTCMinutes.call(e) + S));
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
    return `${t} GMT${r}${a}${o} (${Mo(this.timeZone, this)})`;
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
const oa = 6048e5, Eo = 864e5, wr = /* @__PURE__ */ Symbol.for("constructDateFrom");
function R(e, t) {
  return typeof e == "function" ? e(t) : e && typeof e == "object" && wr in e ? e[wr](t) : e instanceof Date ? new e.constructor(t) : new Date(t);
}
function A(e, t) {
  return R(t || e, e);
}
function sa(e, t, r) {
  const a = A(e, r?.in);
  return isNaN(t) ? R(e, NaN) : (t && a.setDate(a.getDate() + t), a);
}
function ia(e, t, r) {
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
let Do = {};
function Ze() {
  return Do;
}
function je(e, t) {
  const r = Ze(), a = t?.weekStartsOn ?? t?.locale?.options?.weekStartsOn ?? r.weekStartsOn ?? r.locale?.options?.weekStartsOn ?? 0, o = A(e, t?.in), s = o.getDay(), l = (s < a ? 7 : 0) + s - a;
  return o.setDate(o.getDate() - l), o.setHours(0, 0, 0, 0), o;
}
function Xe(e, t) {
  return je(e, { ...t, weekStartsOn: 1 });
}
function la(e, t) {
  const r = A(e, t?.in), a = r.getFullYear(), o = R(r, 0);
  o.setFullYear(a + 1, 0, 4), o.setHours(0, 0, 0, 0);
  const s = Xe(o), l = R(r, 0);
  l.setFullYear(a, 0, 4), l.setHours(0, 0, 0, 0);
  const i = Xe(l);
  return r.getTime() >= s.getTime() ? a + 1 : r.getTime() >= i.getTime() ? a : a - 1;
}
function kr(e) {
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
function He(e, ...t) {
  const r = R.bind(
    null,
    t.find((a) => typeof a == "object")
  );
  return t.map(r);
}
function Qe(e, t) {
  const r = A(e, t?.in);
  return r.setHours(0, 0, 0, 0), r;
}
function Yt(e, t, r) {
  const [a, o] = He(
    r?.in,
    e,
    t
  ), s = Qe(a), l = Qe(o), i = +s - kr(s), c = +l - kr(l);
  return Math.round((i - c) / Eo);
}
function Po(e, t) {
  const r = la(e, t), a = R(e, 0);
  return a.setFullYear(r, 0, 4), a.setHours(0, 0, 0, 0), Xe(a);
}
function Bo(e, t, r) {
  return sa(e, t * 7, r);
}
function Oo(e, t, r) {
  return ia(e, t * 12, r);
}
function Lo(e, t) {
  let r, a = t?.in;
  return e.forEach((o) => {
    !a && typeof o == "object" && (a = R.bind(null, o));
    const s = A(o, a);
    (!r || r < s || isNaN(+s)) && (r = s);
  }), R(a, r || NaN);
}
function Wo(e, t) {
  let r, a = t?.in;
  return e.forEach((o) => {
    !a && typeof o == "object" && (a = R.bind(null, o));
    const s = A(o, a);
    (!r || r > s || isNaN(+s)) && (r = s);
  }), R(a, r || NaN);
}
function Io(e, t, r) {
  const [a, o] = He(
    r?.in,
    e,
    t
  );
  return +Qe(a) == +Qe(o);
}
function ca(e) {
  return e instanceof Date || typeof e == "object" && Object.prototype.toString.call(e) === "[object Date]";
}
function jo(e) {
  return !(!ca(e) && typeof e != "number" || isNaN(+A(e)));
}
function da(e, t, r) {
  const [a, o] = He(
    r?.in,
    e,
    t
  ), s = a.getFullYear() - o.getFullYear(), l = a.getMonth() - o.getMonth();
  return s * 12 + l;
}
function Ho(e, t) {
  const r = A(e, t?.in), a = r.getMonth();
  return r.setFullYear(r.getFullYear(), a + 1, 0), r.setHours(23, 59, 59, 999), r;
}
function ua(e, t) {
  const [r, a] = He(e, t.start, t.end);
  return { start: r, end: a };
}
function Fo(e, t) {
  const { start: r, end: a } = ua(t?.in, e);
  let o = +r > +a;
  const s = o ? +r : +a, l = o ? a : r;
  l.setHours(0, 0, 0, 0), l.setDate(1);
  let i = 1;
  const c = [];
  for (; +l <= s; )
    c.push(R(r, l)), l.setMonth(l.getMonth() + i);
  return o ? c.reverse() : c;
}
function Ao(e, t) {
  const r = A(e, t?.in);
  return r.setDate(1), r.setHours(0, 0, 0, 0), r;
}
function _o(e, t) {
  const r = A(e, t?.in), a = r.getFullYear();
  return r.setFullYear(a + 1, 0, 0), r.setHours(23, 59, 59, 999), r;
}
function fa(e, t) {
  const r = A(e, t?.in);
  return r.setFullYear(r.getFullYear(), 0, 1), r.setHours(0, 0, 0, 0), r;
}
function zo(e, t) {
  const { start: r, end: a } = ua(t?.in, e);
  let o = +r > +a;
  const s = o ? +r : +a, l = o ? a : r;
  l.setHours(0, 0, 0, 0), l.setMonth(0, 1);
  let i = 1;
  const c = [];
  for (; +l <= s; )
    c.push(R(r, l)), l.setFullYear(l.getFullYear() + i);
  return o ? c.reverse() : c;
}
function ha(e, t) {
  const r = Ze(), a = t?.weekStartsOn ?? t?.locale?.options?.weekStartsOn ?? r.weekStartsOn ?? r.locale?.options?.weekStartsOn ?? 0, o = A(e, t?.in), s = o.getDay(), l = (s < a ? -7 : 0) + 6 - (s - a);
  return o.setDate(o.getDate() + l), o.setHours(23, 59, 59, 999), o;
}
function Yo(e, t) {
  return ha(e, { ...t, weekStartsOn: 1 });
}
const $o = {
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
}, Ro = (e, t, r) => {
  let a;
  const o = $o[e];
  return typeof o == "string" ? a = o : t === 1 ? a = o.one : a = o.other.replace("{{count}}", t.toString()), r?.addSuffix ? r.comparison && r.comparison > 0 ? "in " + a : a + " ago" : a;
};
function We(e) {
  return (t = {}) => {
    const r = t.width ? String(t.width) : e.defaultWidth;
    return e.formats[r] || e.formats[e.defaultWidth];
  };
}
const Vo = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
}, qo = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
}, Go = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
}, Uo = {
  date: We({
    formats: Vo,
    defaultWidth: "full"
  }),
  time: We({
    formats: qo,
    defaultWidth: "full"
  }),
  dateTime: We({
    formats: Go,
    defaultWidth: "full"
  })
}, Xo = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
}, Qo = (e, t, r, a) => Xo[e];
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
const Zo = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
}, Ko = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
}, Jo = {
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
}, es = {
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
}, ts = {
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
}, rs = {
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
}, as = (e, t) => {
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
}, ns = {
  ordinalNumber: as,
  era: fe({
    values: Zo,
    defaultWidth: "wide"
  }),
  quarter: fe({
    values: Ko,
    defaultWidth: "wide",
    argumentCallback: (e) => e - 1
  }),
  month: fe({
    values: Jo,
    defaultWidth: "wide"
  }),
  day: fe({
    values: es,
    defaultWidth: "wide"
  }),
  dayPeriod: fe({
    values: ts,
    defaultWidth: "wide",
    formattingValues: rs,
    defaultFormattingWidth: "wide"
  })
};
function he(e) {
  return (t, r = {}) => {
    const a = r.width, o = a && e.matchPatterns[a] || e.matchPatterns[e.defaultMatchWidth], s = t.match(o);
    if (!s)
      return null;
    const l = s[0], i = a && e.parsePatterns[a] || e.parsePatterns[e.defaultParseWidth], c = Array.isArray(i) ? ss(i, (m) => m.test(l)) : (
      // [TODO] -- I challenge you to fix the type
      os(i, (m) => m.test(l))
    );
    let d;
    d = e.valueCallback ? e.valueCallback(c) : c, d = r.valueCallback ? (
      // [TODO] -- I challenge you to fix the type
      r.valueCallback(d)
    ) : d;
    const h = t.slice(l.length);
    return { value: d, rest: h };
  };
}
function os(e, t) {
  for (const r in e)
    if (Object.prototype.hasOwnProperty.call(e, r) && t(e[r]))
      return r;
}
function ss(e, t) {
  for (let r = 0; r < e.length; r++)
    if (t(e[r]))
      return r;
}
function ma(e) {
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
const is = /^(\d+)(th|st|nd|rd)?/i, ls = /\d+/i, cs = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
}, ds = {
  any: [/^b/i, /^(a|c)/i]
}, us = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
}, fs = {
  any: [/1/i, /2/i, /3/i, /4/i]
}, hs = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
}, ms = {
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
}, ps = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
}, vs = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
}, bs = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
}, gs = {
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
}, xs = {
  ordinalNumber: ma({
    matchPattern: is,
    parsePattern: ls,
    valueCallback: (e) => parseInt(e, 10)
  }),
  era: he({
    matchPatterns: cs,
    defaultMatchWidth: "wide",
    parsePatterns: ds,
    defaultParseWidth: "any"
  }),
  quarter: he({
    matchPatterns: us,
    defaultMatchWidth: "wide",
    parsePatterns: fs,
    defaultParseWidth: "any",
    valueCallback: (e) => e + 1
  }),
  month: he({
    matchPatterns: hs,
    defaultMatchWidth: "wide",
    parsePatterns: ms,
    defaultParseWidth: "any"
  }),
  day: he({
    matchPatterns: ps,
    defaultMatchWidth: "wide",
    parsePatterns: vs,
    defaultParseWidth: "any"
  }),
  dayPeriod: he({
    matchPatterns: bs,
    defaultMatchWidth: "any",
    parsePatterns: gs,
    defaultParseWidth: "any"
  })
}, Le = {
  code: "en-US",
  formatDistance: Ro,
  formatLong: Uo,
  formatRelative: Qo,
  localize: ns,
  match: xs,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
function ys(e, t) {
  const r = A(e, t?.in);
  return Yt(r, fa(r)) + 1;
}
function $t(e, t) {
  const r = A(e, t?.in), a = +Xe(r) - +Po(r);
  return Math.round(a / oa) + 1;
}
function pa(e, t) {
  const r = A(e, t?.in), a = r.getFullYear(), o = Ze(), s = t?.firstWeekContainsDate ?? t?.locale?.options?.firstWeekContainsDate ?? o.firstWeekContainsDate ?? o.locale?.options?.firstWeekContainsDate ?? 1, l = R(t?.in || e, 0);
  l.setFullYear(a + 1, 0, s), l.setHours(0, 0, 0, 0);
  const i = je(l, t), c = R(t?.in || e, 0);
  c.setFullYear(a, 0, s), c.setHours(0, 0, 0, 0);
  const d = je(c, t);
  return +r >= +i ? a + 1 : +r >= +d ? a : a - 1;
}
function ws(e, t) {
  const r = Ze(), a = t?.firstWeekContainsDate ?? t?.locale?.options?.firstWeekContainsDate ?? r.firstWeekContainsDate ?? r.locale?.options?.firstWeekContainsDate ?? 1, o = pa(e, t), s = R(t?.in || e, 0);
  return s.setFullYear(o, 0, a), s.setHours(0, 0, 0, 0), je(s, t);
}
function Rt(e, t) {
  const r = A(e, t?.in), a = +je(r, t) - +ws(r, t);
  return Math.round(a / oa) + 1;
}
function F(e, t) {
  const r = e < 0 ? "-" : "", a = Math.abs(e).toString().padStart(t, "0");
  return r + a;
}
const we = {
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
}, Nr = {
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
    return we.y(e, t);
  },
  // Local week-numbering year
  Y: function(e, t, r, a) {
    const o = pa(e, a), s = o > 0 ? o : 1 - o;
    if (t === "YY") {
      const l = s % 100;
      return F(l, 2);
    }
    return t === "Yo" ? r.ordinalNumber(s, { unit: "year" }) : F(s, t.length);
  },
  // ISO week-numbering year
  R: function(e, t) {
    const r = la(e);
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
        return we.M(e, t);
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
    const o = Rt(e, a);
    return t === "wo" ? r.ordinalNumber(o, { unit: "week" }) : F(o, t.length);
  },
  // ISO week of year
  I: function(e, t, r) {
    const a = $t(e);
    return t === "Io" ? r.ordinalNumber(a, { unit: "week" }) : F(a, t.length);
  },
  // Day of the month
  d: function(e, t, r) {
    return t === "do" ? r.ordinalNumber(e.getDate(), { unit: "date" }) : we.d(e, t);
  },
  // Day of year
  D: function(e, t, r) {
    const a = ys(e);
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
    return we.h(e, t);
  },
  // Hour [0-23]
  H: function(e, t, r) {
    return t === "Ho" ? r.ordinalNumber(e.getHours(), { unit: "hour" }) : we.H(e, t);
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
    return t === "mo" ? r.ordinalNumber(e.getMinutes(), { unit: "minute" }) : we.m(e, t);
  },
  // Second
  s: function(e, t, r) {
    return t === "so" ? r.ordinalNumber(e.getSeconds(), { unit: "second" }) : we.s(e, t);
  },
  // Fraction of second
  S: function(e, t) {
    return we.S(e, t);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function(e, t, r) {
    const a = e.getTimezoneOffset();
    if (a === 0)
      return "Z";
    switch (t) {
      // Hours and optional minutes
      case "X":
        return Sr(a);
      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XX`
      case "XXXX":
      case "XX":
        return Me(a);
      // Hours and minutes with `:` delimiter
      default:
        return Me(a, ":");
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function(e, t, r) {
    const a = e.getTimezoneOffset();
    switch (t) {
      // Hours and optional minutes
      case "x":
        return Sr(a);
      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xx`
      case "xxxx":
      case "xx":
        return Me(a);
      // Hours and minutes with `:` delimiter
      default:
        return Me(a, ":");
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
        return "GMT" + Mr(a, ":");
      default:
        return "GMT" + Me(a, ":");
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
        return "GMT" + Mr(a, ":");
      default:
        return "GMT" + Me(a, ":");
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
function Mr(e, t = "") {
  const r = e > 0 ? "-" : "+", a = Math.abs(e), o = Math.trunc(a / 60), s = a % 60;
  return s === 0 ? r + String(o) : r + String(o) + t + F(s, 2);
}
function Sr(e, t) {
  return e % 60 === 0 ? (e > 0 ? "-" : "+") + F(Math.abs(e) / 60, 2) : Me(e, t);
}
function Me(e, t = "") {
  const r = e > 0 ? "-" : "+", a = Math.abs(e), o = F(Math.trunc(a / 60), 2), s = F(a % 60, 2);
  return r + o + t + s;
}
const Cr = (e, t) => {
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
}, va = (e, t) => {
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
}, ks = (e, t) => {
  const r = e.match(/(P+)(p+)?/) || [], a = r[1], o = r[2];
  if (!o)
    return Cr(e, t);
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
  return s.replace("{{date}}", Cr(a, t)).replace("{{time}}", va(o, t));
}, Ns = {
  p: va,
  P: ks
}, Ms = /^D+$/, Ss = /^Y+$/, Cs = ["D", "DD", "YY", "YYYY"];
function Ts(e) {
  return Ms.test(e);
}
function Es(e) {
  return Ss.test(e);
}
function Ds(e, t, r) {
  const a = Ps(e, t, r);
  if (console.warn(a), Cs.includes(e)) throw new RangeError(a);
}
function Ps(e, t, r) {
  const a = e[0] === "Y" ? "years" : "days of the month";
  return `Use \`${e.toLowerCase()}\` instead of \`${e}\` (in \`${t}\`) for formatting ${a} to the input \`${r}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const Bs = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, Os = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, Ls = /^'([^]*?)'?$/, Ws = /''/g, Is = /[a-zA-Z]/;
function Re(e, t, r) {
  const a = Ze(), o = r?.locale ?? a.locale ?? Le, s = r?.firstWeekContainsDate ?? r?.locale?.options?.firstWeekContainsDate ?? a.firstWeekContainsDate ?? a.locale?.options?.firstWeekContainsDate ?? 1, l = r?.weekStartsOn ?? r?.locale?.options?.weekStartsOn ?? a.weekStartsOn ?? a.locale?.options?.weekStartsOn ?? 0, i = A(e, r?.in);
  if (!jo(i))
    throw new RangeError("Invalid time value");
  let c = t.match(Os).map((h) => {
    const m = h[0];
    if (m === "p" || m === "P") {
      const p = Ns[m];
      return p(h, o.formatLong);
    }
    return h;
  }).join("").match(Bs).map((h) => {
    if (h === "''")
      return { isToken: !1, value: "'" };
    const m = h[0];
    if (m === "'")
      return { isToken: !1, value: js(h) };
    if (Nr[m])
      return { isToken: !0, value: h };
    if (m.match(Is))
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + m + "`"
      );
    return { isToken: !1, value: h };
  });
  o.localize.preprocessor && (c = o.localize.preprocessor(i, c));
  const d = {
    firstWeekContainsDate: s,
    weekStartsOn: l,
    locale: o
  };
  return c.map((h) => {
    if (!h.isToken) return h.value;
    const m = h.value;
    (!r?.useAdditionalWeekYearTokens && Es(m) || !r?.useAdditionalDayOfYearTokens && Ts(m)) && Ds(m, t, String(e));
    const p = Nr[m[0]];
    return p(i, m, o.localize, d);
  }).join("");
}
function js(e) {
  const t = e.match(Ls);
  return t ? t[1].replace(Ws, "'") : e;
}
function Hs(e, t) {
  const r = A(e, t?.in), a = r.getFullYear(), o = r.getMonth(), s = R(r, 0);
  return s.setFullYear(a, o + 1, 0), s.setHours(0, 0, 0, 0), s.getDate();
}
function Fs(e, t) {
  return A(e, t?.in).getMonth();
}
function As(e, t) {
  return A(e, t?.in).getFullYear();
}
function _s(e, t) {
  return +A(e) > +A(t);
}
function zs(e, t) {
  return +A(e) < +A(t);
}
function Ys(e, t, r) {
  const [a, o] = He(
    r?.in,
    e,
    t
  );
  return a.getFullYear() === o.getFullYear() && a.getMonth() === o.getMonth();
}
function $s(e, t, r) {
  const [a, o] = He(
    r?.in,
    e,
    t
  );
  return a.getFullYear() === o.getFullYear();
}
function Rs(e, t, r) {
  const a = A(e, r?.in), o = a.getFullYear(), s = a.getDate(), l = R(e, 0);
  l.setFullYear(o, t, 15), l.setHours(0, 0, 0, 0);
  const i = Hs(l);
  return a.setMonth(t, Math.min(s, i)), a;
}
function Vs(e, t, r) {
  const a = A(e, r?.in);
  return isNaN(+a) ? R(e, NaN) : (a.setFullYear(t), a);
}
const Tr = 5, qs = 4;
function Gs(e, t) {
  const r = t.startOfMonth(e), a = r.getDay() > 0 ? r.getDay() : 7, o = t.addDays(e, -a + 1), s = t.addDays(o, Tr * 7 - 1);
  return t.getMonth(e) === t.getMonth(s) ? Tr : qs;
}
function ba(e, t) {
  const r = t.startOfMonth(e), a = r.getDay();
  return a === 1 ? r : a === 0 ? t.addDays(r, -6) : t.addDays(r, -1 * (a - 1));
}
function Us(e, t) {
  const r = ba(e, t), a = Gs(e, t);
  return t.addDays(r, a * 7 - 1);
}
const Xs = {
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
}, Qs = (e, t, r) => {
  r = r || {};
  let a;
  const o = Xs[e];
  return typeof o == "string" ? a = o : t === 1 ? r.addSuffix && o.oneWithSuffix ? a = o.oneWithSuffix : a = o.one : r.addSuffix && o.otherWithSuffix ? a = o.otherWithSuffix.replace("{{count}}", String(t)) : a = o.other.replace("{{count}}", String(t)), r.addSuffix ? r.comparison && r.comparison > 0 ? a + "後" : a + "前" : a;
}, Zs = {
  full: "y年M月d日EEEE",
  long: "y年M月d日",
  medium: "y/MM/dd",
  short: "y/MM/dd"
}, Ks = {
  full: "H時mm分ss秒 zzzz",
  long: "H:mm:ss z",
  medium: "H:mm:ss",
  short: "H:mm"
}, Js = {
  full: "{{date}} {{time}}",
  long: "{{date}} {{time}}",
  medium: "{{date}} {{time}}",
  short: "{{date}} {{time}}"
}, ei = {
  date: We({
    formats: Zs,
    defaultWidth: "full"
  }),
  time: We({
    formats: Ks,
    defaultWidth: "full"
  }),
  dateTime: We({
    formats: Js,
    defaultWidth: "full"
  })
}, ti = {
  lastWeek: "先週のeeeeのp",
  yesterday: "昨日のp",
  today: "今日のp",
  tomorrow: "明日のp",
  nextWeek: "翌週のeeeeのp",
  other: "P"
}, ri = (e, t, r, a) => ti[e], ai = {
  narrow: ["BC", "AC"],
  abbreviated: ["紀元前", "西暦"],
  wide: ["紀元前", "西暦"]
}, ni = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["第1四半期", "第2四半期", "第3四半期", "第4四半期"]
}, oi = {
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
}, si = {
  narrow: ["日", "月", "火", "水", "木", "金", "土"],
  short: ["日", "月", "火", "水", "木", "金", "土"],
  abbreviated: ["日", "月", "火", "水", "木", "金", "土"],
  wide: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"]
}, ii = {
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
}, li = {
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
}, ci = (e, t) => {
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
}, di = {
  ordinalNumber: ci,
  era: fe({
    values: ai,
    defaultWidth: "wide"
  }),
  quarter: fe({
    values: ni,
    defaultWidth: "wide",
    argumentCallback: (e) => Number(e) - 1
  }),
  month: fe({
    values: oi,
    defaultWidth: "wide"
  }),
  day: fe({
    values: si,
    defaultWidth: "wide"
  }),
  dayPeriod: fe({
    values: ii,
    defaultWidth: "wide",
    formattingValues: li,
    defaultFormattingWidth: "wide"
  })
}, ui = /^第?\d+(年|四半期|月|週|日|時|分|秒)?/i, fi = /\d+/i, hi = {
  narrow: /^(B\.?C\.?|A\.?D\.?)/i,
  abbreviated: /^(紀元[前後]|西暦)/i,
  wide: /^(紀元[前後]|西暦)/i
}, mi = {
  narrow: [/^B/i, /^A/i],
  any: [/^(紀元前)/i, /^(西暦|紀元後)/i]
}, pi = {
  narrow: /^[1234]/i,
  abbreviated: /^Q[1234]/i,
  wide: /^第[1234一二三四１２３４]四半期/i
}, vi = {
  any: [/(1|一|１)/i, /(2|二|２)/i, /(3|三|３)/i, /(4|四|４)/i]
}, bi = {
  narrow: /^([123456789]|1[012])/,
  abbreviated: /^([123456789]|1[012])月/i,
  wide: /^([123456789]|1[012])月/i
}, gi = {
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
}, xi = {
  narrow: /^[日月火水木金土]/,
  short: /^[日月火水木金土]/,
  abbreviated: /^[日月火水木金土]/,
  wide: /^[日月火水木金土]曜日/
}, yi = {
  any: [/^日/, /^月/, /^火/, /^水/, /^木/, /^金/, /^土/]
}, wi = {
  any: /^(AM|PM|午前|午後|正午|深夜|真夜中|夜|朝)/i
}, ki = {
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
}, Ni = {
  ordinalNumber: ma({
    matchPattern: ui,
    parsePattern: fi,
    valueCallback: function(e) {
      return parseInt(e, 10);
    }
  }),
  era: he({
    matchPatterns: hi,
    defaultMatchWidth: "wide",
    parsePatterns: mi,
    defaultParseWidth: "any"
  }),
  quarter: he({
    matchPatterns: pi,
    defaultMatchWidth: "wide",
    parsePatterns: vi,
    defaultParseWidth: "any",
    valueCallback: (e) => e + 1
  }),
  month: he({
    matchPatterns: bi,
    defaultMatchWidth: "wide",
    parsePatterns: gi,
    defaultParseWidth: "any"
  }),
  day: he({
    matchPatterns: xi,
    defaultMatchWidth: "wide",
    parsePatterns: yi,
    defaultParseWidth: "any"
  }),
  dayPeriod: he({
    matchPatterns: wi,
    defaultMatchWidth: "any",
    parsePatterns: ki,
    defaultParseWidth: "any"
  })
}, Mi = {
  code: "ja",
  formatDistance: Qs,
  formatLong: ei,
  formatRelative: ri,
  localize: di,
  match: Ni,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
}, ga = {
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
    this.Date = Date, this.today = () => this.overrides?.today ? this.overrides.today() : this.options.timeZone ? Q.tz(this.options.timeZone) : new this.Date(), this.newDate = (a, o, s) => this.overrides?.newDate ? this.overrides.newDate(a, o, s) : this.options.timeZone ? new Q(a, o, s, this.options.timeZone) : new Date(a, o, s), this.addDays = (a, o) => this.overrides?.addDays ? this.overrides.addDays(a, o) : sa(a, o), this.addMonths = (a, o) => this.overrides?.addMonths ? this.overrides.addMonths(a, o) : ia(a, o), this.addWeeks = (a, o) => this.overrides?.addWeeks ? this.overrides.addWeeks(a, o) : Bo(a, o), this.addYears = (a, o) => this.overrides?.addYears ? this.overrides.addYears(a, o) : Oo(a, o), this.differenceInCalendarDays = (a, o) => this.overrides?.differenceInCalendarDays ? this.overrides.differenceInCalendarDays(a, o) : Yt(a, o), this.differenceInCalendarMonths = (a, o) => this.overrides?.differenceInCalendarMonths ? this.overrides.differenceInCalendarMonths(a, o) : da(a, o), this.eachMonthOfInterval = (a) => this.overrides?.eachMonthOfInterval ? this.overrides.eachMonthOfInterval(a) : Fo(a), this.eachYearOfInterval = (a) => {
      const o = this.overrides?.eachYearOfInterval ? this.overrides.eachYearOfInterval(a) : zo(a), s = new Set(o.map((i) => this.getYear(i)));
      if (s.size === o.length)
        return o;
      const l = [];
      return s.forEach((i) => {
        l.push(new Date(i, 0, 1));
      }), l;
    }, this.endOfBroadcastWeek = (a) => this.overrides?.endOfBroadcastWeek ? this.overrides.endOfBroadcastWeek(a) : Us(a, this), this.endOfISOWeek = (a) => this.overrides?.endOfISOWeek ? this.overrides.endOfISOWeek(a) : Yo(a), this.endOfMonth = (a) => this.overrides?.endOfMonth ? this.overrides.endOfMonth(a) : Ho(a), this.endOfWeek = (a, o) => this.overrides?.endOfWeek ? this.overrides.endOfWeek(a, o) : ha(a, this.options), this.endOfYear = (a) => this.overrides?.endOfYear ? this.overrides.endOfYear(a) : _o(a), this.format = (a, o, s) => {
      const l = this.overrides?.format ? this.overrides.format(a, o, this.options) : Re(a, o, this.options);
      return this.options.numerals && this.options.numerals !== "latn" ? this.replaceDigits(l) : l;
    }, this.getISOWeek = (a) => this.overrides?.getISOWeek ? this.overrides.getISOWeek(a) : $t(a), this.getMonth = (a, o) => this.overrides?.getMonth ? this.overrides.getMonth(a, this.options) : Fs(a, this.options), this.getYear = (a, o) => this.overrides?.getYear ? this.overrides.getYear(a, this.options) : As(a, this.options), this.getWeek = (a, o) => this.overrides?.getWeek ? this.overrides.getWeek(a, this.options) : Rt(a, this.options), this.isAfter = (a, o) => this.overrides?.isAfter ? this.overrides.isAfter(a, o) : _s(a, o), this.isBefore = (a, o) => this.overrides?.isBefore ? this.overrides.isBefore(a, o) : zs(a, o), this.isDate = (a) => this.overrides?.isDate ? this.overrides.isDate(a) : ca(a), this.isSameDay = (a, o) => this.overrides?.isSameDay ? this.overrides.isSameDay(a, o) : Io(a, o), this.isSameMonth = (a, o) => this.overrides?.isSameMonth ? this.overrides.isSameMonth(a, o) : Ys(a, o), this.isSameYear = (a, o) => this.overrides?.isSameYear ? this.overrides.isSameYear(a, o) : $s(a, o), this.max = (a) => this.overrides?.max ? this.overrides.max(a) : Lo(a), this.min = (a) => this.overrides?.min ? this.overrides.min(a) : Wo(a), this.setMonth = (a, o) => this.overrides?.setMonth ? this.overrides.setMonth(a, o) : Rs(a, o), this.setYear = (a, o) => this.overrides?.setYear ? this.overrides.setYear(a, o) : Vs(a, o), this.startOfBroadcastWeek = (a, o) => this.overrides?.startOfBroadcastWeek ? this.overrides.startOfBroadcastWeek(a, this) : ba(a, this), this.startOfDay = (a) => this.overrides?.startOfDay ? this.overrides.startOfDay(a) : Qe(a), this.startOfISOWeek = (a) => this.overrides?.startOfISOWeek ? this.overrides.startOfISOWeek(a) : Xe(a), this.startOfMonth = (a) => this.overrides?.startOfMonth ? this.overrides.startOfMonth(a) : Ao(a), this.startOfWeek = (a, o) => this.overrides?.startOfWeek ? this.overrides.startOfWeek(a, this.options) : je(a, this.options), this.startOfYear = (a) => this.overrides?.startOfYear ? this.overrides.startOfYear(a) : fa(a), this.options = { locale: ga, ...t }, this.overrides = r;
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
const pe = new G();
class xa {
  constructor(t, r, a = pe) {
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
class Si {
  constructor(t, r) {
    this.date = t, this.weeks = r;
  }
}
class Ci {
  constructor(t, r) {
    this.days = r, this.weekNumber = t;
  }
}
function Ti(e) {
  return T.createElement("button", { ...e });
}
function Ei(e) {
  return T.createElement("span", { ...e });
}
function Di(e) {
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
function Pi(e) {
  const { day: t, modifiers: r, ...a } = e;
  return T.createElement("td", { ...a });
}
function Bi(e) {
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
function Oi(e) {
  const { options: t, className: r, components: a, classNames: o, ...s } = e, l = [o[D.Dropdown], r].join(" "), i = t?.find(({ value: c }) => c === s.value);
  return T.createElement(
    "span",
    { "data-disabled": s.disabled, className: o[D.DropdownRoot] },
    T.createElement(a.Select, { className: l, ...s }, t?.map(({ value: c, label: d, disabled: h }) => T.createElement(a.Option, { key: c, value: c, disabled: h }, d))),
    T.createElement(
      "span",
      { className: o[D.CaptionLabel], "aria-hidden": !0 },
      i?.label,
      T.createElement(a.Chevron, { orientation: "down", size: 18, className: o[D.Chevron] })
    )
  );
}
function Li(e) {
  return T.createElement("div", { ...e });
}
function Wi(e) {
  return T.createElement("div", { ...e });
}
function Ii(e) {
  const { calendarMonth: t, displayIndex: r, ...a } = e;
  return T.createElement("div", { ...a }, e.children);
}
function ji(e) {
  const { calendarMonth: t, displayIndex: r, ...a } = e;
  return T.createElement("div", { ...a });
}
function Hi(e) {
  return T.createElement("table", { ...e });
}
function Fi(e) {
  return T.createElement("div", { ...e });
}
const ya = Dn(void 0);
function Ke() {
  const e = Pn(ya);
  if (e === void 0)
    throw new Error("useDayPicker() must be used within a custom component.");
  return e;
}
function Ai(e) {
  const { components: t } = Ke();
  return T.createElement(t.Dropdown, { ...e });
}
function _i(e) {
  const { onPreviousClick: t, onNextClick: r, previousMonth: a, nextMonth: o, ...s } = e, { components: l, classNames: i, labels: { labelPrevious: c, labelNext: d } } = Ke(), h = ne((p) => {
    o && r?.(p);
  }, [o, r]), m = ne((p) => {
    a && t?.(p);
  }, [a, t]);
  return T.createElement(
    "nav",
    { ...s },
    T.createElement(
      l.PreviousMonthButton,
      { type: "button", className: i[D.PreviousMonthButton], tabIndex: a ? void 0 : -1, "aria-disabled": a ? void 0 : !0, "aria-label": c(a), onClick: m },
      T.createElement(l.Chevron, { disabled: a ? void 0 : !0, className: i[D.Chevron], orientation: "left" })
    ),
    T.createElement(
      l.NextMonthButton,
      { type: "button", className: i[D.NextMonthButton], tabIndex: o ? void 0 : -1, "aria-disabled": o ? void 0 : !0, "aria-label": d(o), onClick: h },
      T.createElement(l.Chevron, { disabled: o ? void 0 : !0, orientation: "right", className: i[D.Chevron] })
    )
  );
}
function zi(e) {
  const { components: t } = Ke();
  return T.createElement(t.Button, { ...e });
}
function Yi(e) {
  return T.createElement("option", { ...e });
}
function $i(e) {
  const { components: t } = Ke();
  return T.createElement(t.Button, { ...e });
}
function Ri(e) {
  const { rootRef: t, ...r } = e;
  return T.createElement("div", { ...r, ref: t });
}
function Vi(e) {
  return T.createElement("select", { ...e });
}
function qi(e) {
  const { week: t, ...r } = e;
  return T.createElement("tr", { ...r });
}
function Gi(e) {
  return T.createElement("th", { ...e });
}
function Ui(e) {
  return T.createElement(
    "thead",
    { "aria-hidden": !0 },
    T.createElement("tr", { ...e })
  );
}
function Xi(e) {
  const { week: t, ...r } = e;
  return T.createElement("th", { ...r });
}
function Qi(e) {
  return T.createElement("th", { ...e });
}
function Zi(e) {
  return T.createElement("tbody", { ...e });
}
function Ki(e) {
  const { components: t } = Ke();
  return T.createElement(t.Dropdown, { ...e });
}
const Ji = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Button: Ti,
  CaptionLabel: Ei,
  Chevron: Di,
  Day: Pi,
  DayButton: Bi,
  Dropdown: Oi,
  DropdownNav: Li,
  Footer: Wi,
  Month: Ii,
  MonthCaption: ji,
  MonthGrid: Hi,
  Months: Fi,
  MonthsDropdown: Ai,
  Nav: _i,
  NextMonthButton: zi,
  Option: Yi,
  PreviousMonthButton: $i,
  Root: Ri,
  Select: Vi,
  Week: qi,
  WeekNumber: Xi,
  WeekNumberHeader: Qi,
  Weekday: Gi,
  Weekdays: Ui,
  Weeks: Zi,
  YearsDropdown: Ki
}, Symbol.toStringTag, { value: "Module" }));
function ve(e, t, r = !1, a = pe) {
  let { from: o, to: s } = e;
  const { differenceInCalendarDays: l, isSameDay: i } = a;
  return o && s ? (l(s, o) < 0 && ([o, s] = [s, o]), l(t, o) >= (r ? 1 : 0) && l(s, t) >= (r ? 1 : 0)) : !r && s ? i(s, t) : !r && o ? i(o, t) : !1;
}
function Vt(e) {
  return !!(e && typeof e == "object" && "before" in e && "after" in e);
}
function bt(e) {
  return !!(e && typeof e == "object" && "from" in e);
}
function qt(e) {
  return !!(e && typeof e == "object" && "after" in e);
}
function Gt(e) {
  return !!(e && typeof e == "object" && "before" in e);
}
function wa(e) {
  return !!(e && typeof e == "object" && "dayOfWeek" in e);
}
function ka(e, t) {
  return Array.isArray(e) && e.every(t.isDate);
}
function be(e, t, r = pe) {
  const a = Array.isArray(t) ? t : [t], { isSameDay: o, differenceInCalendarDays: s, isAfter: l } = r;
  return a.some((i) => {
    if (typeof i == "boolean")
      return i;
    if (r.isDate(i))
      return o(e, i);
    if (ka(i, r))
      return i.some((c) => o(e, c));
    if (bt(i))
      return ve(i, e, !1, r);
    if (wa(i))
      return Array.isArray(i.dayOfWeek) ? i.dayOfWeek.includes(e.getDay()) : i.dayOfWeek === e.getDay();
    if (Vt(i)) {
      const c = s(i.before, e), d = s(i.after, e), h = c > 0, m = d < 0;
      return l(i.before, i.after) ? m && h : h || m;
    }
    return qt(i) ? s(e, i.after) > 0 : Gt(i) ? s(i.before, e) > 0 : typeof i == "function" ? i(e) : !1;
  });
}
function el(e, t, r, a, o) {
  const { disabled: s, hidden: l, modifiers: i, showOutsideDays: c, broadcastCalendar: d, today: h = o.today() } = t, { isSameDay: m, isSameMonth: p, startOfMonth: v, isBefore: b, endOfMonth: x, isAfter: y } = o, g = r && v(r), M = a && x(a), k = {
    [_.focused]: [],
    [_.outside]: [],
    [_.disabled]: [],
    [_.hidden]: [],
    [_.today]: []
  }, S = {};
  for (const C of e) {
    const { date: N, displayMonth: E } = C, I = !!(E && !p(N, E)), P = !!(g && b(N, g)), L = !!(M && y(N, M)), K = !!(s && be(N, s, o)), J = !!(l && be(N, l, o)) || P || L || // Broadcast calendar will show outside days as default
    !d && !c && I || d && c === !1 && I, ie = m(N, h);
    I && k.outside.push(C), K && k.disabled.push(C), J && k.hidden.push(C), ie && k.today.push(C), i && Object.keys(i).forEach((Z) => {
      const xe = i?.[Z];
      xe && be(N, xe, o) && (S[Z] ? S[Z].push(C) : S[Z] = [C]);
    });
  }
  return (C) => {
    const N = {
      [_.focused]: !1,
      [_.disabled]: !1,
      [_.hidden]: !1,
      [_.outside]: !1,
      [_.today]: !1
    }, E = {};
    for (const I in k) {
      const P = k[I];
      N[I] = P.some((L) => L === C);
    }
    for (const I in S)
      E[I] = S[I].some((P) => P === C);
    return {
      ...N,
      // custom modifiers should override all the previous ones
      ...E
    };
  };
}
function tl(e, t, r = {}) {
  return Object.entries(e).filter(([, o]) => o === !0).reduce((o, [s]) => (r[s] ? o.push(r[s]) : t[_[s]] ? o.push(t[_[s]]) : t[ce[s]] && o.push(t[ce[s]]), o), [t[D.Day]]);
}
function rl(e) {
  return {
    ...Ji,
    ...e
  };
}
function al(e) {
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
function nl() {
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
function Na(e, t, r) {
  return (r ?? new G(t)).formatMonthYear(e);
}
const ol = Na;
function sl(e, t, r) {
  return (r ?? new G(t)).format(e, "d");
}
function il(e, t = pe) {
  return t.format(e, "LLLL");
}
function ll(e, t, r) {
  return (r ?? new G(t)).format(e, "cccccc");
}
function cl(e, t = pe) {
  return e < 10 ? t.formatNumber(`0${e.toLocaleString()}`) : t.formatNumber(`${e.toLocaleString()}`);
}
function dl() {
  return "";
}
function Ma(e, t = pe) {
  return t.format(e, "yyyy");
}
const ul = Ma, fl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  formatCaption: Na,
  formatDay: sl,
  formatMonthCaption: ol,
  formatMonthDropdown: il,
  formatWeekNumber: cl,
  formatWeekNumberHeader: dl,
  formatWeekdayName: ll,
  formatYearCaption: ul,
  formatYearDropdown: Ma
}, Symbol.toStringTag, { value: "Module" }));
function hl(e) {
  return e?.formatMonthCaption && !e.formatCaption && (e.formatCaption = e.formatMonthCaption), e?.formatYearCaption && !e.formatYearDropdown && (e.formatYearDropdown = e.formatYearCaption), {
    ...fl,
    ...e
  };
}
function Ut(e, t, r, a) {
  let o = (a ?? new G(r)).format(e, "PPPP");
  return t.today && (o = `Today, ${o}`), t.selected && (o = `${o}, selected`), o;
}
const ml = Ut;
function Xt(e, t, r) {
  return (r ?? new G(t)).formatMonthYear(e);
}
const pl = Xt;
function Sa(e, t, r, a) {
  let o = (a ?? new G(r)).format(e, "PPPP");
  return t?.today && (o = `Today, ${o}`), o;
}
function Ca(e) {
  return "Choose the Month";
}
function Ta() {
  return "";
}
const vl = "Go to the Next Month";
function Ea(e, t) {
  return vl;
}
function Da(e) {
  return "Go to the Previous Month";
}
function Pa(e, t, r) {
  return (r ?? new G(t)).format(e, "cccc");
}
function Ba(e, t) {
  return `Week ${e}`;
}
function Oa(e) {
  return "Week Number";
}
function La(e) {
  return "Choose the Year";
}
const bl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  labelCaption: pl,
  labelDay: ml,
  labelDayButton: Ut,
  labelGrid: Xt,
  labelGridcell: Sa,
  labelMonthDropdown: Ca,
  labelNav: Ta,
  labelNext: Ea,
  labelPrevious: Da,
  labelWeekNumber: Ba,
  labelWeekNumberHeader: Oa,
  labelWeekday: Pa,
  labelYearDropdown: La
}, Symbol.toStringTag, { value: "Module" })), le = (e, t, r) => t || (r ? typeof r == "function" ? r : (...a) => r : e);
function gl(e, t) {
  const r = t.locale?.labels ?? {};
  return {
    ...bl,
    ...e ?? {},
    labelDayButton: le(Ut, e?.labelDayButton, r.labelDayButton),
    labelMonthDropdown: le(Ca, e?.labelMonthDropdown, r.labelMonthDropdown),
    labelNext: le(Ea, e?.labelNext, r.labelNext),
    labelPrevious: le(Da, e?.labelPrevious, r.labelPrevious),
    labelWeekNumber: le(Ba, e?.labelWeekNumber, r.labelWeekNumber),
    labelYearDropdown: le(La, e?.labelYearDropdown, r.labelYearDropdown),
    labelGrid: le(Xt, e?.labelGrid, r.labelGrid),
    labelGridcell: le(Sa, e?.labelGridcell, r.labelGridcell),
    labelNav: le(Ta, e?.labelNav, r.labelNav),
    labelWeekNumberHeader: le(Oa, e?.labelWeekNumberHeader, r.labelWeekNumberHeader),
    labelWeekday: le(Pa, e?.labelWeekday, r.labelWeekday)
  };
}
function xl(e, t, r, a, o) {
  const { startOfMonth: s, startOfYear: l, endOfYear: i, eachMonthOfInterval: c, getMonth: d } = o;
  return c({
    start: l(e),
    end: i(e)
  }).map((p) => {
    const v = a.formatMonthDropdown(p, o), b = d(p), x = t && p < s(t) || r && p > s(r) || !1;
    return { value: b, label: v, disabled: x };
  });
}
function yl(e, t = {}, r = {}) {
  let a = { ...t?.[D.Day] };
  return Object.entries(e).filter(([, o]) => o === !0).forEach(([o]) => {
    a = {
      ...a,
      ...r?.[o]
    };
  }), a;
}
function wl(e, t, r, a) {
  const o = a ?? e.today(), s = r ? e.startOfBroadcastWeek(o, e) : t ? e.startOfISOWeek(o) : e.startOfWeek(o), l = [];
  for (let i = 0; i < 7; i++) {
    const c = e.addDays(s, i);
    l.push(c);
  }
  return l;
}
function kl(e, t, r, a, o = !1) {
  if (!e || !t)
    return;
  const { startOfYear: s, endOfYear: l, eachYearOfInterval: i, getYear: c } = a, d = s(e), h = l(t), m = i({ start: d, end: h });
  return o && m.reverse(), m.map((p) => {
    const v = r.formatYearDropdown(p, a);
    return {
      value: c(p),
      label: v,
      disabled: !1
    };
  });
}
function Nl(e, t = {}) {
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
      const d = s(i), h = c?.weekStartsOn ?? o, m = (d.getDay() - h + 7) % 7;
      return d.setDate(d.getDate() - m), d;
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
      const c = s(i.start), d = s(i.end), h = [], m = new Q(c.getFullYear(), c.getMonth(), 1, 12, 0, 0, e), p = d.getFullYear() * 12 + d.getMonth();
      for (; m.getFullYear() * 12 + m.getMonth() <= p; )
        h.push(new Q(m, e)), m.setMonth(m.getMonth() + 1, 1);
      return h;
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
      const c = s(i.start), d = s(i.end), h = [], m = new Q(c.getFullYear(), 0, 1, 12, 0, 0, e);
      for (; m.getFullYear() <= d.getFullYear(); )
        h.push(new Q(m, e)), m.setFullYear(m.getFullYear() + 1, 0, 1);
      return h;
    },
    getWeek: (i, c) => {
      const d = l(i);
      return Rt(d, {
        weekStartsOn: c?.weekStartsOn ?? o,
        firstWeekContainsDate: c?.firstWeekContainsDate ?? a?.options?.firstWeekContainsDate ?? 1
      });
    },
    getISOWeek: (i) => {
      const c = l(i);
      return $t(c);
    },
    differenceInCalendarDays: (i, c) => {
      const d = l(i), h = l(c);
      return Yt(d, h);
    },
    differenceInCalendarMonths: (i, c) => {
      const d = l(i), h = l(c);
      return da(d, h);
    }
  };
}
const Je = (e) => e instanceof HTMLElement ? e : null, Ct = (e) => [
  ...e.querySelectorAll("[data-animated-month]") ?? []
], Ml = (e) => Je(e.querySelector("[data-animated-month]")), Tt = (e) => Je(e.querySelector("[data-animated-caption]")), Et = (e) => Je(e.querySelector("[data-animated-weeks]")), Sl = (e) => Je(e.querySelector("[data-animated-nav]")), Cl = (e) => Je(e.querySelector("[data-animated-weekdays]"));
function Tl(e, t, { classNames: r, months: a, focused: o, dateLib: s }) {
  const l = lt(null), i = lt(a), c = lt(!1);
  Bn(() => {
    const d = i.current;
    if (i.current = a, !t || !e.current || // safety check because the ref can be set to anything by consumers
    !(e.current instanceof HTMLElement) || // validation required for the animation to work as expected
    a.length === 0 || d.length === 0 || a.length !== d.length)
      return;
    const h = s.isSameMonth(a[0].date, d[0].date), m = s.isAfter(a[0].date, d[0].date), p = m ? r[re.caption_after_enter] : r[re.caption_before_enter], v = m ? r[re.weeks_after_enter] : r[re.weeks_before_enter], b = l.current, x = e.current.cloneNode(!0);
    if (x instanceof HTMLElement ? (Ct(x).forEach((k) => {
      if (!(k instanceof HTMLElement))
        return;
      const S = Ml(k);
      S && k.contains(S) && k.removeChild(S);
      const C = Tt(k);
      C && C.classList.remove(p);
      const N = Et(k);
      N && N.classList.remove(v);
    }), l.current = x) : l.current = null, c.current || h || // skip animation if a day is focused because it can cause issues to the animation and is better for a11y
    o)
      return;
    const y = b instanceof HTMLElement ? Ct(b) : [], g = Ct(e.current);
    if (g?.every((M) => M instanceof HTMLElement) && y && y.every((M) => M instanceof HTMLElement)) {
      c.current = !0, e.current.style.isolation = "isolate";
      const M = Sl(e.current);
      M && (M.style.zIndex = "1"), g.forEach((k, S) => {
        const C = y[S];
        if (!C)
          return;
        k.style.position = "relative", k.style.overflow = "hidden";
        const N = Tt(k);
        N && N.classList.add(p);
        const E = Et(k);
        E && E.classList.add(v);
        const I = () => {
          c.current = !1, e.current && (e.current.style.isolation = ""), M && (M.style.zIndex = ""), N && N.classList.remove(p), E && E.classList.remove(v), k.style.position = "", k.style.overflow = "", k.contains(C) && k.removeChild(C);
        };
        C.style.pointerEvents = "none", C.style.position = "absolute", C.style.overflow = "hidden", C.setAttribute("aria-hidden", "true");
        const P = Cl(C);
        P && (P.style.opacity = "0");
        const L = Tt(C);
        L && (L.classList.add(m ? r[re.caption_before_exit] : r[re.caption_after_exit]), L.addEventListener("animationend", I));
        const K = Et(C);
        K && K.classList.add(m ? r[re.weeks_before_exit] : r[re.weeks_after_exit]), k.insertBefore(C, k.firstChild);
      });
    }
  });
}
function El(e, t, r, a) {
  const o = e[0], s = e[e.length - 1], { ISOWeek: l, fixedWeeks: i, broadcastCalendar: c } = r ?? {}, { addDays: d, differenceInCalendarDays: h, differenceInCalendarMonths: m, endOfBroadcastWeek: p, endOfISOWeek: v, endOfMonth: b, endOfWeek: x, isAfter: y, startOfBroadcastWeek: g, startOfISOWeek: M, startOfWeek: k } = a, S = c ? g(o, a) : l ? M(o) : k(o), C = c ? p(s) : l ? v(b(s)) : x(b(s)), N = t && (c ? p(t) : l ? v(t) : x(t)), E = N && y(C, N) ? N : C, I = h(E, S), P = m(s, o) + 1, L = [];
  for (let ie = 0; ie <= I; ie++) {
    const Z = d(S, ie);
    L.push(Z);
  }
  const J = (c ? 35 : 42) * P;
  if (i && L.length < J) {
    const ie = J - L.length;
    for (let Z = 0; Z < ie; Z++) {
      const xe = d(L[L.length - 1], 1);
      L.push(xe);
    }
  }
  return L;
}
function Dl(e) {
  const t = [];
  return e.reduce((r, a) => {
    const o = a.weeks.reduce((s, l) => s.concat(l.days.slice()), t.slice());
    return r.concat(o.slice());
  }, t.slice());
}
function Pl(e, t, r, a) {
  const { numberOfMonths: o = 1 } = r, s = [];
  for (let l = 0; l < o; l++) {
    const i = a.addMonths(e, l);
    if (t && i > t)
      break;
    s.push(i);
  }
  return s;
}
function Er(e, t, r, a) {
  const { month: o, defaultMonth: s, today: l = a.today(), numberOfMonths: i = 1 } = e;
  let c = o || s || l;
  const { differenceInCalendarMonths: d, addMonths: h, startOfMonth: m } = a;
  if (r && d(r, c) < i - 1) {
    const p = -1 * (i - 1);
    c = h(r, p);
  }
  return t && d(c, t) < 0 && (c = t), m(c);
}
function Bl(e, t, r, a) {
  const { addDays: o, endOfBroadcastWeek: s, endOfISOWeek: l, endOfMonth: i, endOfWeek: c, getISOWeek: d, getWeek: h, startOfBroadcastWeek: m, startOfISOWeek: p, startOfWeek: v } = a, b = e.reduce((x, y) => {
    const g = r.broadcastCalendar ? m(y, a) : r.ISOWeek ? p(y) : v(y), M = r.broadcastCalendar ? s(y) : r.ISOWeek ? l(i(y)) : c(i(y)), k = t.filter((E) => E >= g && E <= M), S = r.broadcastCalendar ? 35 : 42;
    if (r.fixedWeeks && k.length < S) {
      const E = t.filter((I) => {
        const P = S - k.length;
        return I > M && I <= o(M, P);
      });
      k.push(...E);
    }
    const C = k.reduce((E, I) => {
      const P = r.ISOWeek ? d(I) : h(I), L = E.find((J) => J.weekNumber === P), K = new xa(I, y, a);
      return L ? L.days.push(K) : E.push(new Ci(P, [K])), E;
    }, []), N = new Si(y, C);
    return x.push(N), x;
  }, []);
  return r.reverseMonths ? b.reverse() : b;
}
function Ol(e, t) {
  let { startMonth: r, endMonth: a } = e;
  const { startOfYear: o, startOfDay: s, startOfMonth: l, endOfMonth: i, addYears: c, endOfYear: d, newDate: h, today: m } = t, { fromYear: p, toYear: v, fromMonth: b, toMonth: x } = e;
  !r && b && (r = b), !r && p && (r = t.newDate(p, 0, 1)), !a && x && (a = x), !a && v && (a = h(v, 11, 31));
  const y = e.captionLayout === "dropdown" || e.captionLayout === "dropdown-years";
  return r ? r = l(r) : p ? r = h(p, 0, 1) : !r && y && (r = o(c(e.today ?? m(), -100))), a ? a = i(a) : v ? a = h(v, 11, 31) : !a && y && (a = d(e.today ?? m())), [
    r && s(r),
    a && s(a)
  ];
}
function Ll(e, t, r, a) {
  if (r.disableNavigation)
    return;
  const { pagedNavigation: o, numberOfMonths: s = 1 } = r, { startOfMonth: l, addMonths: i, differenceInCalendarMonths: c } = a, d = o ? s : 1, h = l(e);
  if (!t)
    return i(h, d);
  if (!(c(t, e) < s))
    return i(h, d);
}
function Wl(e, t, r, a) {
  if (r.disableNavigation)
    return;
  const { pagedNavigation: o, numberOfMonths: s } = r, { startOfMonth: l, addMonths: i, differenceInCalendarMonths: c } = a, d = o ? s ?? 1 : 1, h = l(e);
  if (!t)
    return i(h, -d);
  if (!(c(h, t) <= 0))
    return i(h, -d);
}
function Il(e) {
  const t = [];
  return e.reduce((r, a) => r.concat(a.weeks.slice()), t.slice());
}
function gt(e, t) {
  const [r, a] = Ot(e);
  return [t === void 0 ? r : t, a];
}
function jl(e, t) {
  const [r, a] = Ol(e, t), { startOfMonth: o, endOfMonth: s } = t, l = Er(e, r, a, t), [i, c] = gt(
    l,
    // initialMonth is always computed from props.month if provided
    e.month ? l : void 0
  );
  On(() => {
    const S = Er(e, r, a, t);
    c(S);
  }, [e.timeZone]);
  const { months: d, weeks: h, days: m, previousMonth: p, nextMonth: v } = ct(() => {
    const S = Pl(i, a, { numberOfMonths: e.numberOfMonths }, t), C = El(S, e.endMonth ? s(e.endMonth) : void 0, {
      ISOWeek: e.ISOWeek,
      fixedWeeks: e.fixedWeeks,
      broadcastCalendar: e.broadcastCalendar
    }, t), N = Bl(S, C, {
      broadcastCalendar: e.broadcastCalendar,
      fixedWeeks: e.fixedWeeks,
      ISOWeek: e.ISOWeek,
      reverseMonths: e.reverseMonths
    }, t), E = Il(N), I = Dl(N), P = Wl(i, r, e, t), L = Ll(i, a, e, t);
    return {
      months: N,
      weeks: E,
      days: I,
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
  ]), { disableNavigation: b, onMonthChange: x } = e, y = (S) => h.some((C) => C.days.some((N) => N.isEqualTo(S))), g = (S) => {
    if (b)
      return;
    let C = o(S);
    r && C < o(r) && (C = o(r)), a && C > o(a) && (C = o(a)), c(C), x?.(C);
  };
  return {
    months: d,
    weeks: h,
    days: m,
    navStart: r,
    navEnd: a,
    previousMonth: p,
    nextMonth: v,
    goToMonth: g,
    goToDay: (S) => {
      y(S) || g(S.date);
    }
  };
}
var ue;
(function(e) {
  e[e.Today = 0] = "Today", e[e.Selected = 1] = "Selected", e[e.LastFocused = 2] = "LastFocused", e[e.FocusedModifier = 3] = "FocusedModifier";
})(ue || (ue = {}));
function Dr(e) {
  return !e[_.disabled] && !e[_.hidden] && !e[_.outside];
}
function Hl(e, t, r, a) {
  let o, s = -1;
  for (const l of e) {
    const i = t(l);
    Dr(i) && (i[_.focused] && s < ue.FocusedModifier ? (o = l, s = ue.FocusedModifier) : a?.isEqualTo(l) && s < ue.LastFocused ? (o = l, s = ue.LastFocused) : r(l.date) && s < ue.Selected ? (o = l, s = ue.Selected) : i[_.today] && s < ue.Today && (o = l, s = ue.Today));
  }
  return o || (o = e.find((l) => Dr(t(l)))), o;
}
function Fl(e, t, r, a, o, s, l) {
  const { ISOWeek: i, broadcastCalendar: c } = s, { addDays: d, addMonths: h, addWeeks: m, addYears: p, endOfBroadcastWeek: v, endOfISOWeek: b, endOfWeek: x, max: y, min: g, startOfBroadcastWeek: M, startOfISOWeek: k, startOfWeek: S } = l;
  let N = {
    day: d,
    week: m,
    month: h,
    year: p,
    startOfWeek: (E) => c ? M(E, l) : i ? k(E) : S(E),
    endOfWeek: (E) => c ? v(E) : i ? b(E) : x(E)
  }[e](r, t === "after" ? 1 : -1);
  return t === "before" && a ? N = y([a, N]) : t === "after" && o && (N = g([o, N])), N;
}
function Wa(e, t, r, a, o, s, l, i = 0) {
  if (i > 365)
    return;
  const c = Fl(e, t, r.date, a, o, s, l), d = !!(s.disabled && be(c, s.disabled, l)), h = !!(s.hidden && be(c, s.hidden, l)), m = c, p = new xa(c, m, l);
  return !d && !h ? p : Wa(e, t, p, a, o, s, l, i + 1);
}
function Al(e, t, r, a, o) {
  const { autoFocus: s } = e, [l, i] = Ot(), c = Hl(t.days, r, a || (() => !1), l), [d, h] = Ot(s ? c : void 0);
  return {
    isFocusTarget: (x) => !!c?.isEqualTo(x),
    setFocused: h,
    focused: d,
    blur: () => {
      i(d), h(void 0);
    },
    moveFocus: (x, y) => {
      if (!d)
        return;
      const g = Wa(x, y, d, t.navStart, t.navEnd, e, o);
      g && (e.disableNavigation && !t.days.some((k) => k.isEqualTo(g)) || (t.goToDay(g), h(g)));
    }
  };
}
function _l(e, t) {
  const { selected: r, required: a, onSelect: o } = e, [s, l] = gt(r, o ? r : void 0), i = o ? r : s, { isSameDay: c } = t, d = (v) => i?.some((b) => c(b, v)) ?? !1, { min: h, max: m } = e;
  return {
    selected: i,
    select: (v, b, x) => {
      let y = [...i ?? []];
      if (d(v)) {
        if (i?.length === h || a && i?.length === 1)
          return;
        y = i?.filter((g) => !c(g, v));
      } else
        i?.length === m ? y = [v] : y = [...y, v];
      return o || l(y), o?.(y, v, b, x), y;
    },
    isSelected: d
  };
}
function zl(e, t, r = 0, a = 0, o = !1, s = pe) {
  const { from: l, to: i } = t || {}, { isSameDay: c, isAfter: d, isBefore: h } = s;
  let m;
  if (!l && !i)
    m = { from: e, to: r > 0 ? void 0 : e };
  else if (l && !i)
    c(l, e) ? r === 0 ? m = { from: l, to: e } : o ? m = { from: l, to: void 0 } : m = void 0 : h(e, l) ? m = { from: e, to: l } : m = { from: l, to: e };
  else if (l && i)
    if (c(l, e) && c(i, e))
      o ? m = { from: l, to: i } : m = void 0;
    else if (c(l, e))
      m = { from: l, to: r > 0 ? void 0 : e };
    else if (c(i, e))
      m = { from: e, to: r > 0 ? void 0 : e };
    else if (h(e, l))
      m = { from: e, to: i };
    else if (d(e, l))
      m = { from: l, to: e };
    else if (d(e, i))
      m = { from: l, to: e };
    else
      throw new Error("Invalid range");
  if (m?.from && m?.to) {
    const p = s.differenceInCalendarDays(m.to, m.from);
    a > 0 && p > a ? m = { from: e, to: void 0 } : r > 1 && p < r && (m = { from: e, to: void 0 });
  }
  return m;
}
function Yl(e, t, r = pe) {
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
function Pr(e, t, r = pe) {
  return ve(e, t.from, !1, r) || ve(e, t.to, !1, r) || ve(t, e.from, !1, r) || ve(t, e.to, !1, r);
}
function $l(e, t, r = pe) {
  const a = Array.isArray(t) ? t : [t];
  if (a.filter((i) => typeof i != "function").some((i) => typeof i == "boolean" ? i : r.isDate(i) ? ve(e, i, !1, r) : ka(i, r) ? i.some((c) => ve(e, c, !1, r)) : bt(i) ? i.from && i.to ? Pr(e, { from: i.from, to: i.to }, r) : !1 : wa(i) ? Yl(e, i.dayOfWeek, r) : Vt(i) ? r.isAfter(i.before, i.after) ? Pr(e, {
    from: r.addDays(i.after, 1),
    to: r.addDays(i.before, -1)
  }, r) : be(e.from, i, r) || be(e.to, i, r) : qt(i) || Gt(i) ? be(e.from, i, r) || be(e.to, i, r) : !1))
    return !0;
  const l = a.filter((i) => typeof i == "function");
  if (l.length) {
    let i = e.from;
    const c = r.differenceInCalendarDays(e.to, e.from);
    for (let d = 0; d <= c; d++) {
      if (l.some((h) => h(i)))
        return !0;
      i = r.addDays(i, 1);
    }
  }
  return !1;
}
function Rl(e, t) {
  const { disabled: r, excludeDisabled: a, resetOnSelect: o, selected: s, required: l, onSelect: i } = e, [c, d] = gt(s, i ? s : void 0), h = i ? s : c;
  return {
    selected: h,
    select: (v, b, x) => {
      const { min: y, max: g } = e;
      let M;
      if (v) {
        const k = h?.from, S = h?.to, C = !!k && !!S, N = !!k && !!S && t.isSameDay(k, S) && t.isSameDay(v, k);
        o && (C || !h?.from) ? !l && N ? M = void 0 : M = { from: v, to: void 0 } : M = zl(v, h, y, g, l, t);
      }
      return a && r && M?.from && M.to && $l({ from: M.from, to: M.to }, r, t) && (M.from = v, M.to = void 0), i || d(M), i?.(M, v, b, x), M;
    },
    isSelected: (v) => h && ve(h, v, !1, t)
  };
}
function Vl(e, t) {
  const { selected: r, required: a, onSelect: o } = e, [s, l] = gt(r, o ? r : void 0), i = o ? r : s, { isSameDay: c } = t;
  return {
    selected: i,
    select: (m, p, v) => {
      let b = m;
      return !a && i && i && c(m, i) && (b = void 0), o || l(b), o?.(b, m, p, v), b;
    },
    isSelected: (m) => i ? c(i, m) : !1
  };
}
function ql(e, t) {
  const r = Vl(e, t), a = _l(e, t), o = Rl(e, t);
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
function Br(e, t, r) {
  return typeof e == "boolean" || typeof e == "function" ? e : e instanceof Date ? Oe(e, t) : Array.isArray(e) ? e.map((a) => a instanceof Date ? Oe(a, t) : a) : bt(e) ? {
    ...e,
    from: e.from ? oe(e.from, t) : e.from,
    to: e.to ? oe(e.to, t) : e.to
  } : Vt(e) ? {
    before: Oe(e.before, t),
    after: Oe(e.after, t)
  } : qt(e) ? {
    after: Oe(e.after, t)
  } : Gt(e) ? {
    before: Oe(e.before, t)
  } : e;
}
function Dt(e, t, r) {
  return e && (Array.isArray(e) ? e.map((a) => Br(a, t)) : Br(e, t));
}
function Gl(e) {
  let t = e;
  const r = t.timeZone;
  if (r && (t = {
    ...e,
    timeZone: r
  }, t.today && (t.today = oe(t.today, r)), t.month && (t.month = oe(t.month, r)), t.defaultMonth && (t.defaultMonth = oe(t.defaultMonth, r)), t.startMonth && (t.startMonth = oe(t.startMonth, r)), t.endMonth && (t.endMonth = oe(t.endMonth, r)), t.mode === "single" && t.selected ? t.selected = oe(t.selected, r) : t.mode === "multiple" && t.selected ? t.selected = t.selected?.map((O) => oe(O, r)) : t.mode === "range" && t.selected && (t.selected = {
    from: t.selected.from ? oe(t.selected.from, r) : t.selected.from,
    to: t.selected.to ? oe(t.selected.to, r) : t.selected.to
  }), t.disabled !== void 0 && (t.disabled = Dt(t.disabled, r)), t.hidden !== void 0 && (t.hidden = Dt(t.hidden, r)), t.modifiers)) {
    const O = {};
    Object.keys(t.modifiers).forEach((H) => {
      O[H] = Dt(t.modifiers?.[H], r);
    }), t.modifiers = O;
  }
  const { components: a, formatters: o, labels: s, dateLib: l, locale: i, classNames: c } = ct(() => {
    const O = { ...ga, ...t.locale }, H = t.broadcastCalendar ? 1 : t.weekStartsOn, B = t.noonSafe && t.timeZone ? Nl(t.timeZone, {
      weekStartsOn: H,
      locale: O
    }) : void 0, j = t.dateLib && B ? { ...B, ...t.dateLib } : t.dateLib ?? B, te = new G({
      locale: O,
      weekStartsOn: H,
      firstWeekContainsDate: t.firstWeekContainsDate,
      useAdditionalWeekYearTokens: t.useAdditionalWeekYearTokens,
      useAdditionalDayOfYearTokens: t.useAdditionalDayOfYearTokens,
      timeZone: t.timeZone,
      numerals: t.numerals
    }, j);
    return {
      dateLib: te,
      components: rl(t.components),
      formatters: hl(t.formatters),
      labels: gl(t.labels, te.options),
      locale: O,
      classNames: { ...nl(), ...t.classNames }
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
  const { captionLayout: d, mode: h, navLayout: m, numberOfMonths: p = 1, onDayBlur: v, onDayClick: b, onDayFocus: x, onDayKeyDown: y, onDayMouseEnter: g, onDayMouseLeave: M, onNextClick: k, onPrevClick: S, showWeekNumber: C, styles: N } = t, { formatCaption: E, formatDay: I, formatMonthDropdown: P, formatWeekNumber: L, formatWeekNumberHeader: K, formatWeekdayName: J, formatYearDropdown: ie } = o, Z = jl(t, l), { days: xe, months: Ee, navStart: _e, navEnd: z, previousMonth: Y, nextMonth: V, goToMonth: X } = Z, ye = el(xe, t, _e, z, l), { isSelected: De, select: yt, selected: at } = ql(t, l) ?? {}, { blur: rr, focused: ar, isFocusTarget: Za, moveFocus: nr, setFocused: nt } = Al(t, Z, ye, De ?? (() => !1), l), { labelDayButton: Ka, labelGridcell: Ja, labelGrid: en, labelMonthDropdown: tn, labelNav: or, labelPrevious: rn, labelNext: an, labelWeekday: nn, labelWeekNumber: on, labelWeekNumberHeader: sn, labelYearDropdown: ln } = s, cn = ct(() => wl(l, t.ISOWeek, t.broadcastCalendar, t.today), [l, t.ISOWeek, t.broadcastCalendar, t.today]), sr = h !== void 0 || b !== void 0, wt = ne(() => {
    Y && (X(Y), S?.(Y));
  }, [Y, X, S]), kt = ne(() => {
    V && (X(V), k?.(V));
  }, [X, V, k]), dn = ne((O, H) => (B) => {
    B.preventDefault(), B.stopPropagation(), nt(O), !H.disabled && (yt?.(O.date, H, B), b?.(O.date, H, B));
  }, [yt, b, nt]), un = ne((O, H) => (B) => {
    nt(O), x?.(O.date, H, B);
  }, [x, nt]), fn = ne((O, H) => (B) => {
    rr(), v?.(O.date, H, B);
  }, [rr, v]), hn = ne((O, H) => (B) => {
    const j = {
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
    if (j[B.key]) {
      B.preventDefault(), B.stopPropagation();
      const [te, W] = j[B.key];
      nr(te, W);
    }
    y?.(O.date, H, B);
  }, [nr, y, t.dir]), mn = ne((O, H) => (B) => {
    g?.(O.date, H, B);
  }, [g]), pn = ne((O, H) => (B) => {
    M?.(O.date, H, B);
  }, [M]), vn = ne((O) => (H) => {
    const B = Number(H.target.value), j = l.setMonth(l.startOfMonth(O), B);
    X(j);
  }, [l, X]), bn = ne((O) => (H) => {
    const B = Number(H.target.value), j = l.setYear(l.startOfMonth(O), B);
    X(j);
  }, [l, X]), { className: gn, style: xn } = ct(() => ({
    className: [c[D.Root], t.className].filter(Boolean).join(" "),
    style: { ...N?.[D.Root], ...t.style }
  }), [c, t.className, t.style, N]), yn = al(t), ir = lt(null);
  Tl(ir, !!t.animate, {
    classNames: c,
    months: Ee,
    focused: ar,
    dateLib: l
  });
  const wn = {
    dayPickerProps: t,
    selected: at,
    select: yt,
    isSelected: De,
    months: Ee,
    nextMonth: V,
    previousMonth: Y,
    goToMonth: X,
    getModifiers: ye,
    components: a,
    classNames: c,
    styles: N,
    labels: s,
    formatters: o
  };
  return T.createElement(
    ya.Provider,
    { value: wn },
    T.createElement(
      a.Root,
      { rootRef: t.animate ? ir : void 0, className: gn, style: xn, dir: t.dir, id: t.id, lang: t.lang ?? i.code, nonce: t.nonce, title: t.title, role: t.role, "aria-label": t["aria-label"], "aria-labelledby": t["aria-labelledby"], ...yn },
      T.createElement(
        a.Months,
        { className: c[D.Months], style: N?.[D.Months] },
        !t.hideNavigation && !m && T.createElement(a.Nav, { "data-animated-nav": t.animate ? "true" : void 0, className: c[D.Nav], style: N?.[D.Nav], "aria-label": or(), onPreviousClick: wt, onNextClick: kt, previousMonth: Y, nextMonth: V }),
        Ee.map((O, H) => T.createElement(
          a.Month,
          {
            "data-animated-month": t.animate ? "true" : void 0,
            className: c[D.Month],
            style: N?.[D.Month],
            // biome-ignore lint/suspicious/noArrayIndexKey: breaks animation
            key: H,
            displayIndex: H,
            calendarMonth: O
          },
          m === "around" && !t.hideNavigation && H === 0 && T.createElement(
            a.PreviousMonthButton,
            { type: "button", className: c[D.PreviousMonthButton], tabIndex: Y ? void 0 : -1, "aria-disabled": Y ? void 0 : !0, "aria-label": rn(Y), onClick: wt, "data-animated-button": t.animate ? "true" : void 0 },
            T.createElement(a.Chevron, { disabled: Y ? void 0 : !0, className: c[D.Chevron], orientation: t.dir === "rtl" ? "right" : "left" })
          ),
          T.createElement(a.MonthCaption, { "data-animated-caption": t.animate ? "true" : void 0, className: c[D.MonthCaption], style: N?.[D.MonthCaption], calendarMonth: O, displayIndex: H }, d?.startsWith("dropdown") ? T.createElement(
            a.DropdownNav,
            { className: c[D.Dropdowns], style: N?.[D.Dropdowns] },
            (() => {
              const B = d === "dropdown" || d === "dropdown-months" ? T.createElement(a.MonthsDropdown, { key: "month", className: c[D.MonthsDropdown], "aria-label": tn(), classNames: c, components: a, disabled: !!t.disableNavigation, onChange: vn(O.date), options: xl(O.date, _e, z, o, l), style: N?.[D.Dropdown], value: l.getMonth(O.date) }) : T.createElement("span", { key: "month" }, P(O.date, l)), j = d === "dropdown" || d === "dropdown-years" ? T.createElement(a.YearsDropdown, { key: "year", className: c[D.YearsDropdown], "aria-label": ln(l.options), classNames: c, components: a, disabled: !!t.disableNavigation, onChange: bn(O.date), options: kl(_e, z, o, l, !!t.reverseYears), style: N?.[D.Dropdown], value: l.getYear(O.date) }) : T.createElement("span", { key: "year" }, ie(O.date, l));
              return l.getMonthYearOrder() === "year-first" ? [j, B] : [B, j];
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
          m === "around" && !t.hideNavigation && H === p - 1 && T.createElement(
            a.NextMonthButton,
            { type: "button", className: c[D.NextMonthButton], tabIndex: V ? void 0 : -1, "aria-disabled": V ? void 0 : !0, "aria-label": an(V), onClick: kt, "data-animated-button": t.animate ? "true" : void 0 },
            T.createElement(a.Chevron, { disabled: V ? void 0 : !0, className: c[D.Chevron], orientation: t.dir === "rtl" ? "left" : "right" })
          ),
          H === p - 1 && m === "after" && !t.hideNavigation && T.createElement(a.Nav, { "data-animated-nav": t.animate ? "true" : void 0, className: c[D.Nav], style: N?.[D.Nav], "aria-label": or(), onPreviousClick: wt, onNextClick: kt, previousMonth: Y, nextMonth: V }),
          T.createElement(
            a.MonthGrid,
            { role: "grid", "aria-multiselectable": h === "multiple" || h === "range", "aria-label": en(O.date, l.options, l) || void 0, className: c[D.MonthGrid], style: N?.[D.MonthGrid] },
            !t.hideWeekdays && T.createElement(
              a.Weekdays,
              { "data-animated-weekdays": t.animate ? "true" : void 0, className: c[D.Weekdays], style: N?.[D.Weekdays] },
              C && T.createElement(a.WeekNumberHeader, { "aria-label": sn(l.options), className: c[D.WeekNumberHeader], style: N?.[D.WeekNumberHeader], scope: "col" }, K()),
              cn.map((B) => T.createElement(a.Weekday, { "aria-label": nn(B, l.options, l), className: c[D.Weekday], key: String(B), style: N?.[D.Weekday], scope: "col" }, J(B, l.options, l)))
            ),
            T.createElement(a.Weeks, { "data-animated-weeks": t.animate ? "true" : void 0, className: c[D.Weeks], style: N?.[D.Weeks] }, O.weeks.map((B) => T.createElement(
              a.Week,
              { className: c[D.Week], key: B.weekNumber, style: N?.[D.Week], week: B },
              C && T.createElement(a.WeekNumber, { week: B, style: N?.[D.WeekNumber], "aria-label": on(B.weekNumber, {
                locale: i
              }), className: c[D.WeekNumber], scope: "row", role: "rowheader" }, L(B.weekNumber, l)),
              B.days.map((j) => {
                const { date: te } = j, W = ye(j);
                if (W[_.focused] = !W.hidden && !!ar?.isEqualTo(j), W[ce.selected] = De?.(te) || W.selected, bt(at)) {
                  const { from: Nt, to: Mt } = at;
                  W[ce.range_start] = !!(Nt && Mt && l.isSameDay(te, Nt)), W[ce.range_end] = !!(Nt && Mt && l.isSameDay(te, Mt)), W[ce.range_middle] = ve(at, te, !0, l);
                }
                const kn = yl(W, N, t.modifiersStyles), Nn = tl(W, c, t.modifiersClassNames), Mn = !sr && !W.hidden ? Ja(te, W, l.options, l) : void 0;
                return T.createElement(a.Day, { key: `${j.isoDate}_${j.displayMonthId}`, day: j, modifiers: W, className: Nn.join(" "), style: kn, role: "gridcell", "aria-selected": W.selected || void 0, "aria-label": Mn, "data-day": j.isoDate, "data-month": j.outside ? j.dateMonthId : void 0, "data-selected": W.selected || void 0, "data-disabled": W.disabled || void 0, "data-hidden": W.hidden || void 0, "data-outside": j.outside || void 0, "data-focused": W.focused || void 0, "data-today": W.today || void 0 }, !W.hidden && sr ? T.createElement(a.DayButton, { className: c[D.DayButton], style: N?.[D.DayButton], type: "button", day: j, modifiers: W, disabled: !W.focused && W.disabled || void 0, "aria-disabled": W.focused && W.disabled || void 0, tabIndex: Za(j) ? 0 : -1, "aria-label": Ka(te, W, l.options, l), onClick: dn(j, W), onBlur: fn(j, W), onFocus: un(j, W), onKeyDown: hn(j, W), onMouseEnter: mn(j, W), onMouseLeave: pn(j, W) }, I(te, l.options, l)) : !W.hidden && I(j.date, l.options, l));
              })
            )))
          )
        ))
      ),
      t.footer && T.createElement(a.Footer, { className: c[D.Footer], style: N?.[D.Footer], role: "status", "aria-live": "polite" }, t.footer)
    )
  );
}
const Ul = {
  ...Mi,
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
function Ia({ className: e, classNames: t, showOutsideDays: r = !0, ...a }) {
  return /* @__PURE__ */ n(
    Gl,
    {
      "data-slot": "calendar",
      showOutsideDays: r,
      locale: Ul,
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
function et({ ...e }) {
  return /* @__PURE__ */ n(Ge.Root, { "data-slot": "popover", ...e });
}
function tt({ ...e }) {
  return /* @__PURE__ */ n(Ge.Trigger, { "data-slot": "popover-trigger", ...e });
}
function rt({ className: e, align: t = "center", sideOffset: r = 4, ...a }) {
  return /* @__PURE__ */ n(Ge.Portal, { children: /* @__PURE__ */ n(
    Ge.Content,
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
function ju({ ...e }) {
  return /* @__PURE__ */ n(Ge.Anchor, { "data-slot": "popover-anchor", ...e });
}
function ut(e, t) {
  const r = e.getFullYear(), a = String(e.getMonth() + 1).padStart(2, "0"), o = String(e.getDate()).padStart(2, "0");
  return t.replace("yyyy", String(r)).replace("MM", a).replace("dd", o);
}
const ja = /* @__PURE__ */ f(
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
function Ha(e, t, r) {
  return u(
    "flex h-12 w-full items-center justify-between rounded-lg border bg-[var(--Surface-Primary)] px-3 typo-body-md transition-colors outline-none",
    e ? "border-[var(--Border-Accent-Primary)] ring-[3px] ring-[var(--Focus-High-Emphasis)]/50" : "border-[var(--Border-Medium-Emphasis)] hover:border-[var(--Border-High-Emphasis)]",
    "disabled:cursor-not-allowed disabled:opacity-50",
    t ? "text-[var(--Text-High-Emphasis)]" : "text-[var(--Text-Low-Emphasis)]",
    r
  );
}
function Hu({
  value: e,
  onChange: t,
  placeholder: r = "日付を選択",
  disabled: a = !1,
  className: o,
  dateFormat: s = "yyyy/MM/dd",
  triggerLabel: l
}) {
  const [i, c] = w.useState(!1), d = e ? ut(e, s) : null;
  return /* @__PURE__ */ f(et, { open: i, onOpenChange: c, children: [
    /* @__PURE__ */ n(tt, { asChild: !0, children: /* @__PURE__ */ f(
      "button",
      {
        "data-slot": "date-picker-trigger",
        disabled: a,
        "aria-expanded": i,
        "aria-label": l ?? r,
        className: Ha(i, !!d, o),
        children: [
          /* @__PURE__ */ n("span", { children: d ?? r }),
          ja
        ]
      }
    ) }),
    /* @__PURE__ */ n(rt, { className: "w-auto p-0", align: "start", children: /* @__PURE__ */ n(
      Ia,
      {
        mode: "single",
        selected: e,
        onSelect: (h) => {
          t?.(h), c(!1);
        },
        autoFocus: !0
      }
    ) })
  ] });
}
function Fu({
  value: e,
  onChange: t,
  placeholder: r = "期間を選択",
  disabled: a = !1,
  className: o,
  dateFormat: s = "yyyy/MM/dd",
  triggerLabel: l
}) {
  const [i, c] = w.useState(!1), d = e?.from ? e.to ? `${ut(e.from, s)} 〜 ${ut(e.to, s)}` : ut(e.from, s) : null;
  return /* @__PURE__ */ f(et, { open: i, onOpenChange: c, children: [
    /* @__PURE__ */ n(tt, { asChild: !0, children: /* @__PURE__ */ f(
      "button",
      {
        "data-slot": "date-range-picker-trigger",
        disabled: a,
        "aria-expanded": i,
        "aria-label": l ?? r,
        className: Ha(i, !!d, o),
        children: [
          /* @__PURE__ */ n("span", { children: d ?? r }),
          ja
        ]
      }
    ) }),
    /* @__PURE__ */ n(rt, { className: "w-auto p-0", align: "start", children: /* @__PURE__ */ n(
      Ia,
      {
        mode: "range",
        selected: e?.from ? { from: e.from, to: e.to } : void 0,
        onSelect: (h) => t?.(h ? { from: h.from, to: h.to } : void 0),
        numberOfMonths: 2,
        autoFocus: !0
      }
    ) })
  ] });
}
function Se(e) {
  return String(e).padStart(2, "0");
}
function Xl(e) {
  if (!e) return null;
  const [t, r] = e.split(":"), a = parseInt(t, 10), o = parseInt(r, 10);
  return isNaN(a) || isNaN(o) ? null : { h: Math.min(23, Math.max(0, a)), m: Math.min(59, Math.max(0, o)) };
}
const Ql = /* @__PURE__ */ f("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", className: "text-[var(--Object-Medium-Emphasis)] shrink-0", "aria-hidden": !0, children: [
  /* @__PURE__ */ n("circle", { cx: "8", cy: "8", r: "6", stroke: "currentColor", strokeWidth: "1.5" }),
  /* @__PURE__ */ n("path", { d: "M8 5v3.5l2 1.5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })
] });
function Or({
  items: e,
  selected: t,
  onSelect: r
}) {
  const a = w.useRef(null);
  return w.useEffect(() => {
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
      children: Se(o)
    },
    o
  )) });
}
function Au({
  value: e,
  onChange: t,
  placeholder: r = "時刻を選択",
  disabled: a = !1,
  minuteStep: o = 1,
  className: s,
  triggerLabel: l
}) {
  const [i, c] = w.useState(!1), d = Xl(e), h = Array.from({ length: 24 }, (g, M) => M), m = Array.from(
    { length: Math.ceil(60 / o) },
    (g, M) => M * o
  ), p = d?.h ?? 0, v = d?.m ?? 0, b = (g) => t?.(`${Se(g)}:${Se(v)}`), x = (g) => t?.(`${Se(p)}:${Se(g)}`), y = d ? `${Se(d.h)}:${Se(d.m)}` : null;
  return /* @__PURE__ */ f(et, { open: i, onOpenChange: c, children: [
    /* @__PURE__ */ n(tt, { asChild: !0, children: /* @__PURE__ */ f(
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
          y ? "text-[var(--Text-High-Emphasis)]" : "text-[var(--Text-Low-Emphasis)]",
          s
        ),
        children: [
          /* @__PURE__ */ n("span", { children: y ?? r }),
          Ql
        ]
      }
    ) }),
    /* @__PURE__ */ n(rt, { className: "w-44 p-3", align: "start", children: /* @__PURE__ */ f("div", { className: "flex gap-2 items-start", children: [
      /* @__PURE__ */ f("div", { className: "flex-1", children: [
        /* @__PURE__ */ n("div", { className: "typo-label-xs text-[var(--Text-Low-Emphasis)] text-center mb-1", children: "時" }),
        /* @__PURE__ */ n(Or, { items: h, selected: p, onSelect: b })
      ] }),
      /* @__PURE__ */ n("div", { className: "flex items-center justify-center h-48 typo-heading-md text-[var(--Text-Low-Emphasis)] select-none pt-6", children: ":" }),
      /* @__PURE__ */ f("div", { className: "flex-1", children: [
        /* @__PURE__ */ n("div", { className: "typo-label-xs text-[var(--Text-Low-Emphasis)] text-center mb-1", children: "分" }),
        /* @__PURE__ */ n(Or, { items: m, selected: v, onSelect: x })
      ] })
    ] }) })
  ] });
}
function _u({
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
  const [d, h] = w.useState(!1), [m, p] = w.useState(""), v = w.useRef(null), b = e.find((g) => g.value === t), x = m.trim() ? e.filter((g) => g.label.toLowerCase().includes(m.toLowerCase())) : e, y = (g) => {
    g.disabled || (r?.(g.value), h(!1), p(""));
  };
  return /* @__PURE__ */ f(et, { open: d, onOpenChange: (g) => {
    h(g), g || p("");
  }, children: [
    /* @__PURE__ */ n(tt, { asChild: !0, children: /* @__PURE__ */ f(
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
      rt,
      {
        className: "w-[var(--radix-popover-trigger-width)] p-0",
        align: "start",
        onOpenAutoFocus: (g) => {
          g.preventDefault(), v.current?.focus();
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
                value: m,
                onChange: (g) => p(g.target.value),
                placeholder: o,
                className: "flex h-10 flex-1 bg-transparent outline-none typo-body-md text-[var(--Text-High-Emphasis)] placeholder:text-[var(--Text-Low-Emphasis)]"
              }
            )
          ] }),
          /* @__PURE__ */ n("div", { role: "listbox", className: "max-h-60 overflow-y-auto p-1", children: x.length === 0 ? /* @__PURE__ */ n("div", { className: "py-6 text-center typo-body-sm text-[var(--Text-Low-Emphasis)]", children: s }) : x.map((g) => /* @__PURE__ */ f(
            "button",
            {
              role: "option",
              "aria-selected": g.value === t,
              disabled: g.disabled,
              onClick: () => y(g),
              className: u(
                "relative flex w-full cursor-default items-center rounded-sm py-2 pl-8 pr-2 typo-body-md outline-none transition-colors text-left",
                "hover:bg-[var(--Surface-Secondary)] focus:bg-[var(--Surface-Secondary)]",
                "disabled:pointer-events-none disabled:opacity-50",
                g.value === t && "text-[var(--Text-Accent-Primary)]"
              ),
              children: [
                g.value === t && /* @__PURE__ */ n("span", { className: "absolute left-2 flex size-4 items-center justify-center", children: /* @__PURE__ */ n("svg", { width: "12", height: "12", viewBox: "0 0 12 12", fill: "none", children: /* @__PURE__ */ n("path", { d: "M10 3L4.5 8.5L2 6", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }) }),
                g.label
              ]
            },
            g.value
          )) })
        ]
      }
    )
  ] });
}
function zu({
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
  const [h, m] = w.useState(!1), [p, v] = w.useState(""), b = w.useRef(null), x = p.trim() ? e.filter((S) => S.label.toLowerCase().includes(p.toLowerCase())) : e, y = (S) => {
    t.includes(S) ? r?.(t.filter((C) => C !== S)) : r?.([...t, S]);
  }, g = t.map((S) => e.find((C) => C.value === S)?.label).filter(Boolean), M = g.slice(0, c), k = g.length - M.length;
  return /* @__PURE__ */ f(et, { open: h, onOpenChange: (S) => {
    m(S), S || v("");
  }, children: [
    /* @__PURE__ */ n(tt, { asChild: !0, children: /* @__PURE__ */ f(
      "button",
      {
        "data-slot": "multi-select-trigger",
        disabled: l,
        "aria-expanded": h,
        className: u(
          "flex min-h-12 w-full flex-wrap items-center gap-1.5 rounded-lg border bg-[var(--Surface-Primary)] px-3 py-2 typo-body-md transition-colors outline-none text-left",
          h ? "border-[var(--Border-Accent-Primary)] ring-[3px] ring-[var(--Focus-High-Emphasis)]/50" : "border-[var(--Border-Medium-Emphasis)] hover:border-[var(--Border-High-Emphasis)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          i
        ),
        children: [
          t.length === 0 ? /* @__PURE__ */ n("span", { className: "text-[var(--Text-Low-Emphasis)] flex-1", children: a }) : /* @__PURE__ */ f(de, { children: [
            M.map((S) => /* @__PURE__ */ n(
              "span",
              {
                className: "inline-flex items-center gap-1 h-6 px-2 rounded-full bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)] typo-label-xs",
                children: S
              },
              S
            )),
            k > 0 && /* @__PURE__ */ f("span", { className: "inline-flex items-center h-6 px-2 rounded-full bg-[var(--Surface-Tertiary)] text-[var(--Text-Medium-Emphasis)] typo-label-xs", children: [
              "+",
              k
            ] }),
            /* @__PURE__ */ n("span", { className: "flex-1" })
          ] }),
          /* @__PURE__ */ f("span", { className: "flex items-center gap-1 ml-auto shrink-0", children: [
            d && t.length > 0 && /* @__PURE__ */ n(
              "span",
              {
                role: "button",
                "aria-label": "クリア",
                onClick: (S) => {
                  S.stopPropagation(), r?.([]);
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
                className: u("text-[var(--Object-Medium-Emphasis)] transition-transform", h && "rotate-180"),
                "aria-hidden": !0,
                children: /* @__PURE__ */ n("path", { d: "M4 6L8 10L12 6", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })
              }
            )
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ f(
      rt,
      {
        className: "w-[var(--radix-popover-trigger-width)] p-0",
        align: "start",
        onOpenAutoFocus: (S) => {
          S.preventDefault(), b.current?.focus();
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
                onChange: (S) => v(S.target.value),
                placeholder: o,
                className: "flex h-10 flex-1 bg-transparent outline-none typo-body-md text-[var(--Text-High-Emphasis)] placeholder:text-[var(--Text-Low-Emphasis)]"
              }
            )
          ] }),
          /* @__PURE__ */ n("div", { role: "listbox", "aria-multiselectable": "true", className: "max-h-60 overflow-y-auto p-1", children: x.length === 0 ? /* @__PURE__ */ n("div", { className: "py-6 text-center typo-body-sm text-[var(--Text-Low-Emphasis)]", children: s }) : x.map((S) => {
            const C = t.includes(S.value);
            return /* @__PURE__ */ f(
              "button",
              {
                role: "option",
                "aria-selected": C,
                disabled: S.disabled,
                onClick: () => y(S.value),
                className: u(
                  "relative flex w-full cursor-default items-center gap-3 rounded-sm py-2 px-3 typo-body-md outline-none transition-colors text-left",
                  "hover:bg-[var(--Surface-Secondary)] focus:bg-[var(--Surface-Secondary)]",
                  "disabled:pointer-events-none disabled:opacity-50"
                ),
                children: [
                  /* @__PURE__ */ n("span", { className: u(
                    "flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
                    C ? "bg-[var(--Brand-Primary)] border-[var(--Brand-Primary)] text-white" : "border-[var(--Border-Medium-Emphasis)]"
                  ), children: C && /* @__PURE__ */ n("svg", { width: "10", height: "10", viewBox: "0 0 10 10", fill: "none", children: /* @__PURE__ */ n("path", { d: "M8.5 2L4 7L1.5 4.5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) }) }),
                  S.label
                ]
              },
              S.value
            );
          }) })
        ]
      }
    )
  ] });
}
function Yu({ className: e, ...t }) {
  return /* @__PURE__ */ n("nav", { role: "navigation", "aria-label": "ページネーション", "data-slot": "pagination", className: u("mx-auto flex w-full justify-center", e), ...t });
}
function $u({ className: e, ...t }) {
  return /* @__PURE__ */ n("ul", { "data-slot": "pagination-content", className: u("flex flex-row items-center gap-1", e), ...t });
}
function Ru({ ...e }) {
  return /* @__PURE__ */ n("li", { "data-slot": "pagination-item", ...e });
}
function Fa({ className: e, isActive: t, size: r = "icon", ...a }) {
  return /* @__PURE__ */ n(
    "a",
    {
      "aria-current": t ? "page" : void 0,
      "data-slot": "pagination-link",
      className: u(
        pt({
          variant: t ? "default" : "ghost",
          size: r
        }),
        e
      ),
      ...a
    }
  );
}
function Vu({ className: e, label: t = "前へ", ...r }) {
  return /* @__PURE__ */ f(
    Fa,
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
function qu({ className: e, label: t = "次へ", ...r }) {
  return /* @__PURE__ */ f(
    Fa,
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
function Gu({ className: e, label: t = "その他のページ", ...r }) {
  return /* @__PURE__ */ f("span", { "aria-hidden": !0, "data-slot": "pagination-ellipsis", className: u("flex size-10 items-center justify-center", e), ...r, children: [
    /* @__PURE__ */ f("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", children: [
      /* @__PURE__ */ n("circle", { cx: "3", cy: "8", r: "1", fill: "currentColor" }),
      /* @__PURE__ */ n("circle", { cx: "8", cy: "8", r: "1", fill: "currentColor" }),
      /* @__PURE__ */ n("circle", { cx: "13", cy: "8", r: "1", fill: "currentColor" })
    ] }),
    /* @__PURE__ */ n("span", { className: "sr-only", children: t })
  ] });
}
function Uu({ className: e, value: t, ...r }) {
  return /* @__PURE__ */ n(
    lr.Root,
    {
      "data-slot": "progress",
      className: u("relative h-2 w-full overflow-hidden rounded-full bg-[var(--Surface-Tertiary)]", e),
      ...r,
      children: /* @__PURE__ */ n(
        lr.Indicator,
        {
          "data-slot": "progress-indicator",
          className: "h-full w-full flex-1 bg-[var(--Brand-Primary)] transition-all",
          style: { transform: `translateX(-${100 - (t || 0)}%)` }
        }
      )
    }
  );
}
function Xu({ className: e, ...t }) {
  return /* @__PURE__ */ n(Bt.Root, { "data-slot": "radio-group", className: u("grid gap-3", e), ...t });
}
function Qu({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    Bt.Item,
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
      children: /* @__PURE__ */ n(Bt.Indicator, { className: "flex items-center justify-center", children: /* @__PURE__ */ n("svg", { width: "10", height: "10", viewBox: "0 0 10 10", children: /* @__PURE__ */ n("circle", { cx: "5", cy: "5", r: "5", fill: "currentColor" }) }) })
    }
  );
}
function Zl({ className: e, children: t, ...r }) {
  return /* @__PURE__ */ f(Ve.Root, { "data-slot": "scroll-area", className: u("relative overflow-hidden", e), ...r, children: [
    /* @__PURE__ */ n(Ve.Viewport, { className: "size-full rounded-[inherit]", children: t }),
    /* @__PURE__ */ n(Kl, {}),
    /* @__PURE__ */ n(Ve.Corner, {})
  ] });
}
function Kl({
  className: e,
  orientation: t = "vertical",
  ...r
}) {
  return /* @__PURE__ */ n(
    Ve.ScrollAreaScrollbar,
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
      children: /* @__PURE__ */ n(Ve.ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-[var(--Border-Medium-Emphasis)]" })
    }
  );
}
const Jl = se(
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
function ec({ ...e }) {
  return /* @__PURE__ */ n(ae.Root, { "data-slot": "select", ...e });
}
function Zu({ ...e }) {
  return /* @__PURE__ */ n(ae.Group, { "data-slot": "select-group", ...e });
}
function tc({ ...e }) {
  return /* @__PURE__ */ n(ae.Value, { "data-slot": "select-value", ...e });
}
function rc({ className: e, children: t, size: r, ...a }) {
  return /* @__PURE__ */ f(
    ae.Trigger,
    {
      "data-slot": "select-trigger",
      className: u(Jl({ size: r }), e),
      ...a,
      children: [
        t,
        /* @__PURE__ */ n(ae.Icon, { asChild: !0, children: /* @__PURE__ */ n("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", className: "opacity-50", children: /* @__PURE__ */ n("path", { d: "M4 6L8 10L12 6", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }) })
      ]
    }
  );
}
function ac({ className: e, children: t, position: r = "popper", ...a }) {
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
function nc({ className: e, children: t, ...r }) {
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
function Ku({ className: e, ...t }) {
  return /* @__PURE__ */ n(ae.Separator, { "data-slot": "select-separator", className: u("-mx-1 my-1 h-px bg-[var(--Border-Low-Emphasis)]", e), ...t });
}
function Ju({ className: e, ...t }) {
  return /* @__PURE__ */ n(ae.Label, { "data-slot": "select-label", className: u("py-1.5 pl-8 pr-2 typo-label-sm", e), ...t });
}
function ef({
  className: e,
  orientation: t = "horizontal",
  decorative: r = !0,
  ...a
}) {
  return /* @__PURE__ */ n(
    Cn.Root,
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
const Aa = w.createContext(null), _a = w.createContext(null);
function za(e) {
  if (typeof e == "number") return Math.min(1, Math.max(0, e));
  const t = parseFloat(e);
  return Number.isNaN(t) || typeof window > "u" ? 0.9 : Math.min(1, Math.max(0, t / window.innerHeight));
}
function Qt({
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
  const d = w.useMemo(
    () => (e ?? []).map(za),
    [e]
  ), h = t !== void 0, m = e?.[0] ?? null, [p, v] = w.useState(m), b = h ? t : p, x = w.useCallback(
    (k) => {
      h || v(k), r?.(k);
    },
    [h, r]
  );
  w.useEffect(() => {
    i && !h && e && e.length > 0 && v(e[0]);
  }, [i]);
  const y = w.useCallback(
    (k) => {
      !k && !h && e && e.length > 0 && v(e[0]), l?.(k);
    },
    [l, e, h]
  ), g = w.useMemo(() => !e || e.length === 0 ? null : {
    snapPoints: e,
    snapRatios: d,
    activeSnapPoint: b,
    setActiveSnapPoint: x,
    dismissible: o,
    fadeFromIndex: a ?? 0,
    overlay: s,
    close: () => y(!1)
  }, [
    e,
    d,
    b,
    x,
    o,
    a,
    s,
    y
  ]), M = w.useMemo(
    () => ({ close: () => y(!1) }),
    [y]
  );
  return /* @__PURE__ */ n(_a.Provider, { value: M, children: /* @__PURE__ */ n(Aa.Provider, { value: g, children: /* @__PURE__ */ n(
    $.Root,
    {
      "data-slot": "sheet",
      open: i,
      onOpenChange: y,
      ...c
    }
  ) }) });
}
function oc({ ...e }) {
  return /* @__PURE__ */ n($.Trigger, { "data-slot": "sheet-trigger", ...e });
}
function sc({ ...e }) {
  return /* @__PURE__ */ n($.Close, { "data-slot": "sheet-close", ...e });
}
function Zt({ ...e }) {
  return /* @__PURE__ */ n($.Portal, { "data-slot": "sheet-portal", ...e });
}
function Kt({
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
function Ya() {
  return /* @__PURE__ */ n("div", { className: "flex justify-center pt-2.5 pb-1 flex-shrink-0", children: /* @__PURE__ */ n("div", { className: "w-9 h-[5px] rounded-full bg-[var(--Object-Disable)] opacity-50" }) });
}
const $a = se(
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
), ic = /* @__PURE__ */ new Set(["float-glass", "bottom-glass"]), lc = /* @__PURE__ */ new Set(["bottom", "bottom-glass"]);
function Jt({
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
  const d = w.useId(), h = i != null && i !== !1, m = h ? d : c["aria-describedby"], p = w.useContext(Aa), v = a ?? ic.has(r);
  return p && r === "bottom" ? /* @__PURE__ */ n(
    dc,
    {
      snapCtx: p,
      className: e,
      glassOverlay: v,
      container: o,
      description: i,
      ...c,
      children: t
    }
  ) : l && lc.has(r) ? /* @__PURE__ */ n(
    cc,
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
  ) : /* @__PURE__ */ f(Zt, { container: o, children: [
    /* @__PURE__ */ n(Kt, { glass: v }),
    /* @__PURE__ */ f(
      $.Content,
      {
        "data-slot": "sheet-content",
        "data-side": r,
        className: u($a({ side: r }), s && "p-6", e),
        ...c,
        "aria-describedby": m,
        children: [
          h && /* @__PURE__ */ n($.Description, { id: d, className: "sr-only", children: i }),
          t
        ]
      }
    )
  ] });
}
function cc({
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
  const d = w.useId(), h = s != null && s !== !1, m = h ? d : c["aria-describedby"], p = w.useContext(_a), [v, b] = w.useState(0), [x, y] = w.useState(!1), g = w.useRef(0), M = w.useRef(null), k = (N) => {
    if (!(N.button != null && N.button !== 0)) {
      y(!0), g.current = N.clientY;
      try {
        N.currentTarget.setPointerCapture(N.pointerId);
      } catch {
      }
    }
  }, S = (N) => {
    if (!x) return;
    const E = N.clientY - g.current;
    b(Math.max(0, E));
  }, C = () => {
    if (!x) return;
    y(!1);
    const N = M.current?.offsetHeight ?? 0, E = N > 0 ? N * 0.3 : 200;
    v > E && p?.close(), b(0);
  };
  return /* @__PURE__ */ f(Zt, { container: a, children: [
    /* @__PURE__ */ n(Kt, { glass: r }),
    /* @__PURE__ */ f(
      $.Content,
      {
        ref: M,
        "data-slot": "sheet-content",
        "data-side": e,
        className: u($a({ side: e }), o && "p-6", t),
        style: {
          ...i,
          transform: `translate3d(0, ${v}px, 0)`,
          transition: x ? "none" : "transform 280ms cubic-bezier(0.32, 0.72, 0, 1)",
          willChange: "transform"
        },
        ...c,
        "aria-describedby": m,
        children: [
          h && /* @__PURE__ */ n($.Description, { id: d, className: "sr-only", children: s }),
          /* @__PURE__ */ n(
            "div",
            {
              onPointerDown: k,
              onPointerMove: S,
              onPointerUp: C,
              onPointerCancel: C,
              className: u(
                "cursor-grab active:cursor-grabbing select-none",
                // Pull the indicator row out of the sheet's own padding so it
                // sits flush against the top edge, matching the snap-mode layout.
                o && "-mx-6 -mt-6"
              ),
              style: { touchAction: "none" },
              children: /* @__PURE__ */ n(Ya, {})
            }
          ),
          l
        ]
      }
    )
  ] });
}
function dc({
  snapCtx: e,
  className: t,
  glassOverlay: r,
  container: a,
  description: o,
  children: s,
  style: l,
  ...i
}) {
  const c = w.useId(), d = o != null && o !== !1, h = d ? c : i["aria-describedby"], {
    snapRatios: m,
    activeSnapPoint: p,
    setActiveSnapPoint: v,
    dismissible: b,
    close: x,
    snapPoints: y,
    fadeFromIndex: g,
    overlay: M
  } = e, k = w.useMemo(
    () => m.length > 0 ? Math.max(...m) : 0.9,
    [m]
  ), S = w.useMemo(
    () => m.length > 0 ? Math.min(...m) : 0.4,
    [m]
  ), C = w.useMemo(() => p == null ? k : za(p), [p, k]), [N, E] = w.useState(!1), I = w.useRef(0), P = w.useRef(C), L = w.useRef(null), K = (k - C) / k * 100, J = (z) => {
    if (!(z.button != null && z.button !== 0)) {
      E(!0), I.current = z.clientY, P.current = C;
      try {
        z.currentTarget.setPointerCapture(z.pointerId);
      } catch {
      }
    }
  }, ie = (z) => {
    if (!N) return;
    const Y = z.clientY - I.current, V = typeof window > "u" ? 1 : window.innerHeight, X = Math.max(
      0,
      Math.min(k, P.current - Y / V)
    );
    v(X);
  }, Z = (z) => {
    if (!N) return;
    E(!1);
    const Y = C;
    if (b && Y < S * 0.5) {
      x();
      return;
    }
    let V = 0, X = Math.abs(Y - m[0]);
    for (let ye = 1; ye < m.length; ye++) {
      const De = Math.abs(Y - m[ye]);
      De < X && (X = De, V = ye);
    }
    v(y[V]);
  }, xe = w.useMemo(() => {
    if (m.length === 0) return 1;
    const z = m[Math.min(g, m.length - 1)];
    return C <= z ? 0 : k <= z ? 1 : Math.min(1, (C - z) / (k - z));
  }, [m, g, C, k]), Ee = `translate3d(0, ${K}%, 0)`, _e = (z) => {
    if (z.key !== "ArrowUp" && z.key !== "ArrowDown") return;
    const Y = m.findIndex((X) => X === C);
    if (Y === -1) return;
    const V = z.key === "ArrowUp" ? Math.min(m.length - 1, Y + 1) : Math.max(0, Y - 1);
    V !== Y && (z.preventDefault(), v(y[V]));
  };
  return /* @__PURE__ */ f(Zt, { container: a, children: [
    M && /* @__PURE__ */ n(Kt, { glass: r, opacity: xe }),
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
          height: `${k * 100}svh`,
          transform: Ee,
          transition: N ? "none" : "transform 320ms cubic-bezier(0.32, 0.72, 0, 1)",
          willChange: "transform",
          touchAction: "none"
        },
        ...i,
        "aria-describedby": h,
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
              children: /* @__PURE__ */ n(Ya, {})
            }
          ),
          /* @__PURE__ */ n(
            "div",
            {
              className: "flex-1 min-h-0 overflow-y-auto",
              style: {
                maxHeight: `calc(${C * 100}svh - 22px)`,
                transition: N ? "none" : "max-height 320ms cubic-bezier(0.32, 0.72, 0, 1)"
              },
              children: s
            }
          )
        ]
      }
    )
  ] });
}
function er({ className: e, ...t }) {
  return /* @__PURE__ */ n("div", { "data-slot": "sheet-header", className: u("flex flex-col gap-2", e), ...t });
}
function tf({ className: e, ...t }) {
  return /* @__PURE__ */ n("div", { "data-slot": "sheet-footer", className: u("flex flex-col gap-2 mt-auto", e), ...t });
}
function tr({ className: e, ...t }) {
  return /* @__PURE__ */ n($.Title, { "data-slot": "sheet-title", className: u("typo-heading-lg text-[var(--Text-High-Emphasis)]", e), ...t });
}
function Ra({ className: e, ...t }) {
  return /* @__PURE__ */ n($.Description, { "data-slot": "sheet-description", className: u("typo-body-md text-[var(--Text-Medium-Emphasis)]", e), ...t });
}
function rf({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "skeleton",
      className: u("animate-pulse rounded-lg bg-[var(--Surface-Tertiary)]", e),
      ...t
    }
  );
}
function af({
  className: e,
  defaultValue: t,
  value: r,
  min: a = 0,
  max: o = 100,
  ...s
}) {
  const l = w.useMemo(
    () => Array.isArray(r) ? r : Array.isArray(t) ? t : [a, o],
    [r, t, a, o]
  );
  return /* @__PURE__ */ f(
    ot.Root,
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
          ot.Track,
          {
            "data-slot": "slider-track",
            className: "relative grow overflow-hidden rounded-full bg-[var(--Surface-Tertiary)] data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
            children: /* @__PURE__ */ n(
              ot.Range,
              {
                "data-slot": "slider-range",
                className: "absolute bg-[var(--Brand-Primary)] data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
              }
            )
          }
        ),
        Array.from({ length: l.length }, (i, c) => /* @__PURE__ */ n(
          ot.Thumb,
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
function nf({ className: e, size: t = "md", label: r = "読み込み中", ...a }) {
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
function of({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    cr.Root,
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
        cr.Thumb,
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
function sf({ className: e, ...t }) {
  return /* @__PURE__ */ n(mt.Root, { "data-slot": "tabs", className: u("flex flex-col gap-2", e), ...t });
}
function lf({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    mt.List,
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
function cf({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    mt.Trigger,
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
function df({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    mt.Content,
    {
      "data-slot": "tabs-content",
      className: u("mt-2 focus-visible:outline-none", e),
      ...t
    }
  );
}
function uf({ className: e, autoGrow: t, onChange: r, ...a }) {
  const o = w.useRef(null), s = w.useCallback(() => {
    const i = o.current;
    i && (i.style.height = "auto", i.style.height = `${i.scrollHeight}px`);
  }, []);
  w.useEffect(() => {
    t && s();
  }, [t, s, a.value, a.defaultValue]);
  const l = w.useCallback(
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
function uc({ delayDuration: e = 0, ...t }) {
  return /* @__PURE__ */ n(Ue.Provider, { "data-slot": "tooltip-provider", delayDuration: e, ...t });
}
function ff({ ...e }) {
  return /* @__PURE__ */ n(uc, { children: /* @__PURE__ */ n(Ue.Root, { "data-slot": "tooltip", ...e }) });
}
function hf({ ...e }) {
  return /* @__PURE__ */ n(Ue.Trigger, { "data-slot": "tooltip-trigger", ...e });
}
function mf({ className: e, sideOffset: t = 4, children: r, ...a }) {
  return /* @__PURE__ */ n(Ue.Portal, { children: /* @__PURE__ */ n(
    Ue.Content,
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
const fc = {
  sm: { size: 32, stroke: 3 },
  md: { size: 48, stroke: 4 },
  lg: { size: 64, stroke: 5 },
  xl: { size: 96, stroke: 6 }
};
function pf({
  value: e,
  size: t = "md",
  label: r,
  showLabel: a = !0,
  className: o
}) {
  const { size: s, stroke: l } = fc[t], i = (s - l) / 2, c = 2 * Math.PI * i, d = Math.min(100, Math.max(0, e)), h = c * (1 - d / 100);
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
              strokeDashoffset: h,
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
const hc = {
  sm: { wrap: "h-9 gap-2", btn: "w-8 h-8", icon: 14, text: "typo-label-sm w-8" },
  md: { wrap: "h-12 gap-3", btn: "w-10 h-10", icon: 16, text: "typo-body-md w-10" }
};
function vf({
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
  decrementLabel: h = "減らす",
  incrementLabel: m = "増やす"
}) {
  const [p, v] = w.useState(String(e)), [b, x] = w.useState(!1);
  w.useEffect(() => {
    b || v(String(e));
  }, [e, b]);
  const y = (N) => {
    const E = parseFloat(N.replace(/[^0-9.-]/g, ""));
    if (isNaN(E)) {
      v(String(e));
      return;
    }
    const I = Math.min(a, Math.max(r, E));
    v(String(I)), t?.(I);
  }, g = () => {
    const N = Math.min(a, e + o);
    v(String(N)), t?.(N);
  }, M = () => {
    const N = Math.max(r, e - o);
    v(String(N)), t?.(N);
  }, k = b ? p : s ? s(e) : p, S = hc[c], C = u(
    "flex items-center justify-center rounded-full border shrink-0 transition-colors select-none",
    S.btn,
    "border-[var(--Border-Medium-Emphasis)] text-[var(--Object-Medium-Emphasis)]",
    "hover:border-[var(--Brand-Primary)] hover:text-[var(--Brand-Primary)] hover:bg-[var(--Brand-Ultra-Light)]",
    "active:scale-95",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[var(--Border-Medium-Emphasis)] disabled:hover:text-[var(--Object-Medium-Emphasis)] disabled:hover:bg-transparent"
  );
  return /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "number-input",
      className: u("inline-flex items-center", S.wrap, i && "opacity-50 pointer-events-none", d),
      children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            tabIndex: -1,
            disabled: i || e <= r,
            onClick: M,
            "aria-label": h,
            className: C,
            children: /* @__PURE__ */ n("svg", { width: S.icon, height: S.icon, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ n("path", { d: "M3 8h10", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }) })
          }
        ),
        /* @__PURE__ */ n(
          "input",
          {
            type: "text",
            inputMode: "decimal",
            value: k,
            placeholder: l,
            disabled: i,
            onChange: (N) => v(N.target.value),
            onFocus: () => {
              x(!0), v(String(e));
            },
            onBlur: (N) => {
              x(!1), y(N.target.value);
            },
            onKeyDown: (N) => {
              N.key === "Enter" && N.target.blur(), N.key === "ArrowUp" && (N.preventDefault(), g()), N.key === "ArrowDown" && (N.preventDefault(), M());
            },
            className: u(
              "text-center bg-transparent outline-none text-[var(--Text-High-Emphasis)] placeholder:text-[var(--Text-Low-Emphasis)] tabular-nums",
              S.text
            )
          }
        ),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            tabIndex: -1,
            disabled: i || e >= a,
            onClick: g,
            "aria-label": m,
            className: C,
            children: /* @__PURE__ */ n("svg", { width: S.icon, height: S.icon, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ n("path", { d: "M8 3v10M3 8h10", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }) })
          }
        )
      ]
    }
  );
}
const mc = {
  sm: "h-8 px-3 typo-label-xs gap-1",
  md: "h-9 px-4 typo-label-sm gap-1.5"
};
function bf({
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
              mc[a],
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
const pc = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8"
}, vc = {
  sm: "typo-label-xs",
  md: "typo-label-sm",
  lg: "typo-label-md",
  xl: "typo-label-lg"
};
function bc({ filled: e, half: t, className: r }) {
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
function gf({
  value: e,
  onChange: t,
  max: r = 5,
  size: a = "md",
  showLabel: o = !1,
  className: s
}) {
  const [l, i] = w.useState(null), c = !!t, d = l ?? e;
  return /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "star-rating",
      role: c ? "radiogroup" : void 0,
      "aria-label": c ? "評価" : `${e}/${r}点`,
      className: u("inline-flex items-center gap-0.5", s),
      children: [
        Array.from({ length: r }, (h, m) => {
          const p = m + 1, v = d >= p, b = !v && d >= p - 0.5;
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
                pc[a],
                c ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default pointer-events-none",
                !v && !b && "text-[var(--Border-Medium-Emphasis)]"
              ),
              children: /* @__PURE__ */ n(
                bc,
                {
                  filled: v,
                  half: b,
                  className: "w-full h-full"
                }
              )
            },
            m
          );
        }),
        o && /* @__PURE__ */ f("span", { className: u("ml-1 text-[var(--Text-Medium-Emphasis)]", vc[a]), children: [
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
function Lr(e) {
  const t = Math.max(0, e.getTime() - Date.now()), r = Math.floor(t / 1e3), a = Math.floor(r / 3600), o = Math.floor(r % 3600 / 60), s = r % 60;
  return { h: a, m: o, s, totalSec: r };
}
function xf({
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
  secondUnit: h = "秒"
}) {
  const [m, p] = w.useState(() => Lr(e)), [v, b] = w.useState(() => {
    const C = Date.now();
    return e.getTime() - 0, C >= e.getTime() ? "ended" : "active";
  }), x = w.useRef(!1);
  if (w.useEffect(() => {
    x.current = !1;
    const C = () => {
      const E = Lr(e);
      p(E), E.totalSec === 0 && !x.current && (x.current = !0, b("ended"), i?.());
    };
    C();
    const N = setInterval(C, 1e3);
    return () => clearInterval(N);
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
  const { h: y, m: g, s: M } = m, k = s ? [{ num: ze(g), unit: d }, { num: ze(M), unit: h }] : [
    ...y > 0 ? [{ num: ze(y), unit: c }] : [],
    { num: ze(g), unit: d },
    { num: ze(M), unit: h }
  ], S = o === "filled";
  return /* @__PURE__ */ f(
    "span",
    {
      "data-slot": "countdown-timer",
      "data-state": "active",
      "data-variant": o,
      "aria-live": "off",
      "aria-label": `${r} ${y}${c}${g}${d}${M}${h}`,
      className: u(
        "inline-flex items-center gap-1 px-3 py-2 rounded-lg font-variant-nums",
        S ? "bg-[var(--Brand-Primary)] text-white" : "border-2 border-[var(--Brand-Primary)] text-[var(--Brand-Primary)]",
        l
      ),
      children: [
        r && /* @__PURE__ */ n("span", { className: "text-[11px] font-semibold opacity-80 mr-1", children: r }),
        k.map((C, N) => /* @__PURE__ */ f(w.Fragment, { children: [
          N > 0 && /* @__PURE__ */ n("span", { className: "text-[18px] font-bold opacity-70 mb-1.5", children: ":" }),
          /* @__PURE__ */ f("span", { className: "flex flex-col items-center gap-0", children: [
            /* @__PURE__ */ n("span", { className: "text-[22px] font-black leading-none tabular-nums", children: C.num }),
            /* @__PURE__ */ n("span", { className: "text-[9px] font-semibold opacity-70 leading-none mt-0.5", children: C.unit })
          ] })
        ] }, C.unit))
      ]
    }
  );
}
function yf({
  items: e,
  value: t,
  onChange: r,
  variant: a = "underline",
  sticky: o = !1,
  className: s
}) {
  const l = w.useRef(null), i = w.useRef(null);
  return w.useEffect(() => {
    const c = l.current, d = i.current;
    if (!c || !d) return;
    const h = c.offsetLeft + c.offsetWidth / 2, m = d.clientWidth / 2;
    d.scrollTo({ left: h - m, behavior: "smooth" });
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
const gc = {
  top: "top",
  bottom: "bottom",
  left: "left",
  right: "right"
};
function wf({
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
  onClose: h,
  delayDuration: m = 0,
  className: p
}) {
  const v = l !== void 0;
  return /* @__PURE__ */ n(Pe.Provider, { delayDuration: m, children: /* @__PURE__ */ f(Pe.Root, { open: o, onOpenChange: s, children: [
    /* @__PURE__ */ n(Pe.Trigger, { asChild: !0, children: t }),
    /* @__PURE__ */ n(Pe.Portal, { children: /* @__PURE__ */ f(
      Pe.Content,
      {
        "data-slot": "coach-mark",
        "data-variant": a,
        side: gc[r],
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
                  onClick: h,
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
const xc = {
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
function kf({
  provider: e,
  loading: t = !1,
  fullWidth: r = !1,
  className: a,
  disabled: o,
  children: s,
  ...l
}) {
  const i = xc[e];
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
const yc = {
  square: "aspect-square",
  "4/3": "aspect-[4/3]",
  "16/9": "aspect-video",
  "3/4": "aspect-[3/4]"
};
function Nf({
  images: e,
  indicatorType: t = "thumbnail",
  aspectRatio: r = "4/3",
  onImageClick: a,
  className: o,
  prevLabel: s = "前の画像",
  nextLabel: l = "次の画像",
  imageLabel: i = (c) => `画像 ${c + 1}`
}) {
  const [c, d] = w.useState(0), h = () => d((y) => Math.max(0, y - 1)), m = () => d((y) => Math.min(e.length - 1, y + 1)), p = w.useRef(null), v = (y) => {
    p.current = y.touches[0].clientX;
  }, b = (y) => {
    if (p.current === null) return;
    const g = y.changedTouches[0].clientX - p.current;
    Math.abs(g) > 40 && (g < 0 ? m() : h()), p.current = null;
  }, x = e[c];
  return /* @__PURE__ */ f("div", { "data-slot": "image-gallery", className: u("flex flex-col gap-2", o), children: [
    /* @__PURE__ */ f(
      "div",
      {
        className: u(
          "relative w-full overflow-hidden rounded-xl bg-[var(--Surface-Tertiary)] cursor-pointer",
          yc[r] ?? "aspect-[4/3]"
        ),
        onTouchStart: v,
        onTouchEnd: b,
        onClick: () => a?.(c),
        children: [
          x && /* @__PURE__ */ n(
            "img",
            {
              src: x.src,
              alt: x.alt ?? i(c),
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
                onClick: (y) => {
                  y.stopPropagation(), h();
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
                onClick: (y) => {
                  y.stopPropagation(), m();
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
    t === "thumbnail" && e.length > 1 && /* @__PURE__ */ n("div", { className: "flex gap-1.5 overflow-x-auto scrollbar-none", children: e.map((y, g) => /* @__PURE__ */ n(
      "button",
      {
        onClick: () => d(g),
        "aria-label": i(g),
        "aria-pressed": g === c,
        className: u(
          "flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors bg-[var(--Surface-Tertiary)]",
          g === c ? "border-[var(--Brand-Primary)]" : "border-transparent hover:border-[var(--Border-Medium-Emphasis)]"
        ),
        children: /* @__PURE__ */ n("img", { src: y.src, alt: y.alt ?? i(g), className: "w-full h-full object-cover" })
      },
      g
    )) }),
    t === "dot" && e.length > 1 && /* @__PURE__ */ n("div", { className: "flex items-center justify-center gap-1.5", children: e.map((y, g) => /* @__PURE__ */ n(
      "button",
      {
        onClick: () => d(g),
        "aria-label": i(g),
        className: u(
          "rounded-full transition-all",
          g === c ? "w-4 h-1.5 bg-[var(--Brand-Primary)]" : "w-1.5 h-1.5 bg-[var(--Border-Medium-Emphasis)] hover:bg-[var(--Text-Low-Emphasis)]"
        )
      },
      g
    )) })
  ] });
}
function wc({ size: e = 20 }) {
  return /* @__PURE__ */ n("svg", { width: e, height: e, viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ n("path", { d: "M18 6L6 18M6 6l12 12", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round" }) });
}
function kc({ size: e = 20 }) {
  return /* @__PURE__ */ n("svg", { width: e, height: e, viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ n("path", { d: "M15 18l-6-6 6-6", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round" }) });
}
function Nc({ size: e = 20 }) {
  return /* @__PURE__ */ f("svg", { width: e, height: e, viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ n("path", { d: "M12 3v12M8 7l4-4 4 4", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round" }),
    /* @__PURE__ */ n("path", { d: "M7 11H5a2 2 0 00-2 2v6a2 2 0 002 2h14a2 2 0 002-2v-6a2 2 0 00-2-2h-2", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round" })
  ] });
}
function Mf({
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
  const h = () => t === "back" ? /* @__PURE__ */ n(kc, {}) : t === "close" ? /* @__PURE__ */ n(wc, {}) : t, m = t === "close" ? "閉じる" : "戻る", p = i ? "glass" : "secondary";
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
          ke,
          {
            variant: p,
            size: "icon-xl",
            "aria-label": a ?? m,
            onClick: r,
            children: h()
          }
        ),
        e && /* @__PURE__ */ n("div", { className: "absolute inset-x-0 flex justify-center items-center pointer-events-none", children: /* @__PURE__ */ n("span", { className: "typo-heading-sm text-[var(--Text-High-Emphasis)] px-16 truncate", children: e }) }),
        /* @__PURE__ */ n("div", { className: "ml-auto", children: o ?? (s ? /* @__PURE__ */ n(
          ke,
          {
            variant: p,
            size: "icon-xl",
            "aria-label": l,
            onClick: s,
            children: /* @__PURE__ */ n(Nc, {})
          }
        ) : null) })
      ]
    }
  );
}
function Sf({
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
  sticky: h = !1,
  bordered: m = !0,
  variant: p = "default",
  className: v
}) {
  const b = p === "glass", x = p === "transparent", y = l ?? i, g = () => e === "back-search" && s ? /* @__PURE__ */ n("div", { className: "flex-1 min-w-0", children: s }) : e === "logo-center" ? /* @__PURE__ */ n("div", { className: "flex-1 flex justify-center min-w-0", children: r }) : e === "logo" ? /* @__PURE__ */ f(de, { children: [
    /* @__PURE__ */ n("div", { className: "shrink-0", children: r }),
    c && c.length > 0 && /* @__PURE__ */ n("nav", { className: "hidden @[768px]:flex items-center gap-4 ml-6", children: c.map((M) => /* @__PURE__ */ n(
      "a",
      {
        href: M.href,
        onClick: M.onClick,
        "data-active": M.isActive || void 0,
        className: u(
          "typo-label-md text-[var(--Text-Medium-Emphasis)] hover:text-[var(--Text-High-Emphasis)] transition-colors",
          M.isActive && "text-[var(--Brand-Primary)] font-bold"
        ),
        children: M.label
      },
      M.label
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
        h && "sticky top-0 z-40",
        v
      ),
      children: [
        /* @__PURE__ */ f(
          "div",
          {
            className: u(
              "flex items-center gap-2 h-14 px-4",
              b && "glass",
              !b && !x && "bg-[var(--Surface-Primary)]",
              m && !b && !x && "border-b border-[var(--Border-Low-Emphasis)]",
              m && b && "border-b border-[rgba(255,255,255,0.25)]"
            ),
            children: [
              t && /* @__PURE__ */ n("div", { className: "flex items-center shrink-0", children: t }),
              g(),
              y && /* @__PURE__ */ n("div", { className: "flex items-center gap-1 shrink-0", children: y })
            ]
          }
        ),
        d && /* @__PURE__ */ n(
          "div",
          {
            className: u(
              !b && !x && "bg-[var(--Surface-Primary)]",
              m && "border-b border-[var(--Border-Low-Emphasis)]"
            ),
            children: d
          }
        )
      ]
    }
  );
}
function Cf({
  value: e = [],
  onChange: t,
  placeholder: r = "タグを入力して Enter",
  disabled: a = !1,
  max: o,
  allowDuplicates: s = !1,
  className: l,
  inputLabel: i = "タグ入力"
}) {
  const [c, d] = w.useState(""), h = w.useRef(null), m = w.useRef(!1), p = w.useCallback(
    (x) => {
      const y = x.trim();
      y && (!s && e.includes(y) || o !== void 0 && e.length >= o || (t?.([...e, y]), d("")));
    },
    [e, t, s, o]
  ), v = w.useCallback(
    (x) => {
      t?.(e.filter((y, g) => g !== x));
    },
    [e, t]
  ), b = (x) => {
    x.key === "Enter" && (x.preventDefault(), m.current = !0, p(c)), x.key === "Backspace" && c === "" && e.length > 0 && v(e.length - 1), x.key === "," && (x.preventDefault(), p(c));
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
      onClick: () => h.current?.focus(),
      children: [
        e.map((x, y) => /* @__PURE__ */ f(
          "span",
          {
            className: "inline-flex items-center gap-1 h-7 px-2.5 rounded-full bg-[var(--Brand-Ultra-Light)] text-[var(--Text-Accent-Primary)] typo-label-sm",
            children: [
              x,
              !a && /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  onClick: (g) => {
                    g.stopPropagation(), v(y);
                  },
                  className: "flex items-center justify-center w-3.5 h-3.5 rounded-full hover:bg-[var(--Brand-Light)] transition-colors",
                  "aria-label": `${x} を削除`,
                  children: /* @__PURE__ */ n("svg", { width: "8", height: "8", viewBox: "0 0 8 8", fill: "none", children: /* @__PURE__ */ n("path", { d: "M1 1l6 6M7 1L1 7", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }) })
                }
              )
            ]
          },
          y
        )),
        /* @__PURE__ */ n(
          "input",
          {
            ref: h,
            value: c,
            onChange: (x) => d(x.target.value),
            onKeyDown: b,
            onBlur: () => {
              if (m.current) {
                m.current = !1;
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
const Mc = 72;
function Tf({ children: e, actions: t = [], side: r = "right", className: a }) {
  const [o, s] = w.useState(0), [l, i] = w.useState(!1), c = w.useRef(0), d = w.useRef(0), h = w.useRef(null), m = t.length * Mc, p = Math.abs(o) > m / 2, v = w.useCallback((M) => {
    s(M);
  }, []), b = (M) => {
    c.current = M.clientX, d.current = o, i(!0), h.current?.setPointerCapture(M.pointerId);
  }, x = (M) => {
    if (!l) return;
    const k = M.clientX - c.current, S = d.current + k, N = Math.min(0, Math.max((r === "right" ? -1 : 1) * m, S));
    s(N);
  }, y = () => {
    if (!l) return;
    i(!1), v(p ? (r === "right" ? -1 : 1) * m : 0);
  }, g = () => v(0);
  return t.length === 0 ? /* @__PURE__ */ n("div", { className: a, children: e }) : /* @__PURE__ */ f("div", { className: u("relative overflow-hidden", a), children: [
    /* @__PURE__ */ n(
      "div",
      {
        className: u(
          "absolute inset-y-0 flex",
          r === "right" ? "right-0" : "left-0"
        ),
        style: { width: m },
        children: t.map((M, k) => /* @__PURE__ */ f(
          "button",
          {
            type: "button",
            onClick: () => {
              M.onClick(), g();
            },
            className: u(
              "flex flex-col items-center justify-center gap-1 w-[72px] typo-label-xs font-medium transition-colors",
              M.variant === "destructive" ? "bg-[var(--Caution-Base)] text-[var(--Text-on-Inverse)] hover:bg-[var(--Hover-Destructive-Button)]" : "bg-[var(--Surface-Secondary)] text-[var(--Text-High-Emphasis)] hover:bg-[var(--Border-Medium-Emphasis)]"
            ),
            children: [
              M.icon && /* @__PURE__ */ n("span", { className: "text-current", children: M.icon }),
              M.label
            ]
          },
          k
        ))
      }
    ),
    /* @__PURE__ */ n(
      "div",
      {
        ref: h,
        className: u(
          "relative bg-[var(--Surface-Primary)] touch-pan-y select-none",
          !l && "transition-transform duration-200 ease-out"
        ),
        style: { transform: `translateX(${o}px)` },
        onPointerDown: b,
        onPointerMove: x,
        onPointerUp: y,
        onPointerCancel: y,
        children: e
      }
    )
  ] });
}
function Ne(e) {
  const [t, r] = w.useState(!1);
  return w.useEffect(() => {
    const a = window.matchMedia(e);
    r(a.matches);
    const o = (s) => r(s.matches);
    return a.addEventListener("change", o), () => a.removeEventListener("change", o);
  }, [e]), t;
}
function Sc({ children: e, ...t }) {
  return Ne("(min-width: 768px)") ? /* @__PURE__ */ n(Zn, { ...t, children: e }) : /* @__PURE__ */ n(Qt, { ...t, children: e });
}
function Ef({ children: e, ...t }) {
  return Ne("(min-width: 768px)") ? /* @__PURE__ */ n(Kn, { ...t, children: e }) : /* @__PURE__ */ n(oc, { ...t, children: e });
}
function Cc({ children: e, className: t, ...r }) {
  return Ne("(min-width: 768px)") ? /* @__PURE__ */ n(ro, { className: t, ...r, children: e }) : /* @__PURE__ */ n(Jt, { side: "bottom", className: t, children: e });
}
function Tc({ children: e, ...t }) {
  return Ne("(min-width: 768px)") ? /* @__PURE__ */ n(ao, { ...t, children: e }) : /* @__PURE__ */ n(er, { ...t, children: e });
}
function Ec({ children: e, ...t }) {
  return Ne("(min-width: 768px)") ? /* @__PURE__ */ n(oo, { ...t, children: e }) : /* @__PURE__ */ n(tr, { ...t, children: e });
}
function Dc({ children: e, ...t }) {
  return Ne("(min-width: 768px)") ? /* @__PURE__ */ n(so, { ...t, children: e }) : /* @__PURE__ */ n(Ra, { ...t, children: e });
}
function Pc({ children: e, ...t }) {
  return Ne("(min-width: 768px)") ? /* @__PURE__ */ n(no, { ...t, children: e }) : /* @__PURE__ */ n("div", { "data-slot": "sheet-footer", className: "flex flex-col gap-2 mt-auto", ...t, children: e });
}
function Df({ children: e, ...t }) {
  return Ne("(min-width: 768px)") ? /* @__PURE__ */ n(eo, { ...t, children: e }) : /* @__PURE__ */ n(sc, { ...t, children: e });
}
function Pf({
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
  const [h, m] = w.useState(!1), p = d || h, v = w.useCallback(async () => {
    m(!0);
    try {
      await c(), t(!1);
    } finally {
      m(!1);
    }
  }, [c, t]);
  return /* @__PURE__ */ n(Sc, { open: e, onOpenChange: t, children: /* @__PURE__ */ f(Cc, { children: [
    /* @__PURE__ */ f(Tc, { children: [
      /* @__PURE__ */ n(Ec, { children: r }),
      a && /* @__PURE__ */ n(Dc, { children: a })
    ] }),
    /* @__PURE__ */ f(Pc, { className: "mt-4", children: [
      /* @__PURE__ */ n(
        ke,
        {
          variant: "secondary",
          onClick: () => t(!1),
          disabled: p,
          children: s
        }
      ),
      /* @__PURE__ */ n(
        ke,
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
function Bf({
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
  const [h, m] = w.useState(!1), p = i || h, v = w.useCallback(async (b) => {
    b.preventDefault(), m(!0);
    try {
      await l(), t(!1);
    } finally {
      m(!1);
    }
  }, [l, t]);
  return /* @__PURE__ */ n(Qt, { open: e, onOpenChange: t, children: /* @__PURE__ */ f(
    Jt,
    {
      side: "bottom",
      className: u("p-0 rounded-t-[32px] max-h-[90dvh] flex flex-col", d),
      children: [
        /* @__PURE__ */ f(er, { className: "px-5 pt-6 shrink-0", children: [
          /* @__PURE__ */ n(tr, { className: "!text-[28px] !font-bold", children: r }),
          a && /* @__PURE__ */ n(Ra, { children: a })
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
                  ke,
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
                  ke,
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
const Wr = se(
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
function Bc({
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
  children: h,
  ...m
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
  ), y = /* @__PURE__ */ f(de, { children: [
    h,
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
        onClick: (k) => {
          k.stopPropagation(), c?.();
        },
        onKeyDown: (k) => {
          (k.key === "Enter" || k.key === " ") && (k.preventDefault(), k.stopPropagation(), c?.());
        },
        className: "-mr-1 ml-0.5 inline-flex size-5 items-center justify-center rounded-full hover:bg-[var(--Surface-Tertiary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--Focus-High-Emphasis)]",
        children: /* @__PURE__ */ n("svg", { width: "12", height: "12", viewBox: "0 0 14 14", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ n("path", { d: "M4 4L10 10M10 4L4 10", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }) })
      }
    )
  ] }), g = s && "!bg-[var(--Brand-Primary)] !text-[var(--Text-on-Inverse)] hover:!bg-[var(--Active-Primary-Button)] active:!bg-[var(--Active-Primary-Button)] !border-[var(--Brand-Primary)] font-bold shadow-sm hover:shadow", M = p && "border border-[var(--Text-Disable)] !bg-[var(--Surface-Secondary)] !text-[var(--Text-Disable)] cursor-not-allowed";
  return o && !p ? /* @__PURE__ */ n(
    "a",
    {
      href: o,
      "data-slot": "chip",
      "data-variant": t,
      "data-selected": s || void 0,
      className: u(
        "relative",
        Wr({ variant: t, size: r, shape: a }),
        g,
        e
      ),
      children: y
    }
  ) : /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      "data-slot": "chip",
      "data-variant": t,
      "data-selected": s || void 0,
      "data-sold-out": p || void 0,
      disabled: p || m.disabled,
      className: u(
        "relative",
        Wr({ variant: t, size: r, shape: a }),
        g,
        M,
        e
      ),
      ...m,
      children: y
    }
  );
}
function Of({
  options: e,
  value: t,
  onChange: r,
  multiple: a = !0,
  max: o,
  size: s = "md",
  className: l
}) {
  const i = w.useCallback((c) => {
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
        const d = t.includes(c.value), h = !d && !!o && t.length >= o;
        return /* @__PURE__ */ f(
          Bc,
          {
            size: s,
            variant: d ? "accent" : "outline",
            selected: d,
            disabled: h,
            removable: d && a,
            onRemove: () => r(t.filter((m) => m !== c.value)),
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
const Oc = se(
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
function Lf({
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
      className: u(Oc({ variant: t }), e),
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
function Wf({
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
function If({
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
function jf({
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
  const h = i != null;
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
              h && "flex items-center justify-between gap-2"
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
function Hf({
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
  const h = i === "destructive";
  return /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "list-item",
      "data-variant": i,
      className: u(
        "flex items-start gap-3 py-3 px-4 border-b border-[var(--Border-Low-Emphasis)]",
        l && (h ? "cursor-pointer hover:bg-[var(--Surface-Caution-Subtle)] transition-colors" : "cursor-pointer hover:bg-[var(--Surface-Secondary)] transition-colors"),
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
                h ? "text-[var(--Caution-Base)]" : "text-[var(--Text-High-Emphasis)]"
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
const Lc = {
  xs: "size-1.5 min-w-0 px-0",
  sm: "min-w-4 h-4 px-1 typo-label-xs",
  default: "min-w-5 h-5 px-1.5 typo-label-xs"
};
function Ff({
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
        Lc[a],
        e
      ),
      ...o,
      children: a !== "xs" && s
    }
  );
}
function Af({
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
        return /* @__PURE__ */ f(w.Fragment, { children: [
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
function _f({
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
function Wc({
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
const Ic = {
  default: { card: "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]", icon: "text-[var(--Object-Medium-Emphasis)]" },
  success: { card: "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Success)]", icon: "text-[var(--Object-Success)]" },
  caution: { card: "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Caution)]", icon: "text-[var(--Object-Caution)]" },
  info: { card: "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Info)]", icon: "text-[var(--Text-Info)]" },
  accent: { card: "border-[var(--Brand-Primary)]/20 bg-[var(--Surface-Accent-Primary-Light)]", icon: "text-[var(--Object-Accent-Primary)]" }
};
function zf({
  className: e,
  label: t,
  value: r,
  unit: a,
  trend: o,
  icon: s,
  variant: l = "default",
  ...i
}) {
  const c = Ic[l];
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
const jc = se(
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
function Yf({
  className: e,
  variant: t,
  ...r
}) {
  return /* @__PURE__ */ n(
    "span",
    {
      "data-slot": "tag",
      className: u(jc({ variant: t }), e),
      ...r
    }
  );
}
const Hc = se(
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
let Ir = 0;
function Fc() {
  return Ir += 1, `t${Date.now().toString(36)}-${Ir.toString(36)}`;
}
const q = {
  toasts: [],
  listeners: /* @__PURE__ */ new Set(),
  add(e) {
    const t = Fc(), r = { id: t, ...e };
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
let Va = 0;
const It = /* @__PURE__ */ new Set();
function jr(e) {
  Va += e, It.forEach((t) => t());
}
function Ac(e) {
  return It.add(e), () => {
    It.delete(e);
  };
}
function _c() {
  const e = w.useCallback((a) => q.subscribe(a), []), t = w.useCallback(() => q.toasts, []), r = w.useCallback(() => [], []);
  return w.useSyncExternalStore(e, t, r);
}
function zc() {
  const e = w.useCallback((a) => Ac(a), []), t = w.useCallback(() => Va > 0, []), r = w.useCallback(() => !1, []);
  return w.useSyncExternalStore(e, t, r);
}
const qa = w.createContext(null);
function $f() {
  return w.useContext(qa) ?? { toast: (t) => q.add(t) };
}
function Ga() {
  const e = _c();
  return typeof document > "u" ? null : Fn(
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
            className: u(Hc({ variant: t.variant })),
            children: [
              /* @__PURE__ */ f("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ n("p", { className: "typo-label-md", children: t.title }),
                t.description && /* @__PURE__ */ n("p", { className: "typo-body-sm mt-0.5 opacity-80", children: t.description })
              ] }),
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
function Rf({ children: e }) {
  w.useEffect(() => (jr(1), () => jr(-1)), []);
  const t = w.useCallback((r) => {
    q.add(r);
  }, []);
  return /* @__PURE__ */ f(qa.Provider, { value: { toast: t }, children: [
    e,
    /* @__PURE__ */ n(Ga, {})
  ] });
}
function Yc() {
  return zc() ? null : /* @__PURE__ */ n(Ga, {});
}
let it = null;
function Ua() {
  if (typeof window > "u" || typeof document > "u" || it) return;
  if (!document.body) {
    it = new Promise((t) => {
      const r = () => {
        document.body ? (it = null, Ua(), t()) : window.setTimeout(r, 0);
      };
      r();
    });
    return;
  }
  if (document.querySelector("[data-ksk-toast-auto-root]")) return;
  const e = document.createElement("div");
  e.setAttribute("data-ksk-toast-auto-root", ""), document.body.appendChild(e), it = import("react-dom/client").then(({ createRoot: t }) => {
    t(e).render(/* @__PURE__ */ n(Yc, {}));
  });
}
function Fe(e, t = {}, r) {
  return typeof window > "u" ? "" : (Ua(), q.add({
    title: e,
    description: t.description,
    variant: r ?? t.variant,
    duration: t.duration
  }));
}
const Ae = ((e, t) => Fe(e, t));
Ae.success = (e, t) => Fe(e, t, "success");
Ae.error = (e, t) => Fe(e, t, "caution");
Ae.info = (e, t) => Fe(e, t, "info");
Ae.warning = (e, t) => Fe(e, t, "warning");
Ae.caution = (e, t) => Fe(e, t, "caution");
Ae.dismiss = (e) => q.dismiss(e);
function Vf({
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
            children: /* @__PURE__ */ n(Zl, { className: "flex-1", children: t })
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
function qf({
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
function Gf({
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
function Uf({ className: e, preventDefault: t = !0, onSubmit: r, ...a }) {
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
function Xf({ className: e, title: t, description: r, children: a, ...o }) {
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
function Qf({ className: e, ...t }) {
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
const $c = se("inline-flex items-baseline gap-0.5 text-[var(--Text-High-Emphasis)]", {
  variants: {
    size: {
      sm: "typo-label-md",
      md: "typo-label-lg",
      lg: "typo-heading-lg",
      xl: "typo-heading-3xl"
    }
  },
  defaultVariants: { size: "md" }
}), Rc = { sm: "typo-body-xs", md: "typo-body-sm", lg: "typo-body-md", xl: "typo-body-lg" }, Vc = { sm: "typo-body-xs", md: "typo-body-xs", lg: "typo-body-sm", xl: "typo-body-lg" };
function Hr({ className: e, price: t, maxPrice: r, originalPrice: a, showTaxLabel: o = !0, currency: s = "¥", size: l = "md", ...i }) {
  const c = (p) => p.toLocaleString("ja-JP"), d = a != null && a > t, h = r != null && r > t, m = l ?? "md";
  return /* @__PURE__ */ f("div", { "data-slot": "price-display", className: u("flex flex-col", e), role: "group", "aria-label": `${s}${c(t)} 税込`, ...i, children: [
    d && /* @__PURE__ */ f("span", { "aria-hidden": !0, className: u("text-[var(--Text-Low-Emphasis)] line-through", Rc[m]), children: [
      s,
      c(a)
    ] }),
    /* @__PURE__ */ f("span", { "aria-hidden": !0, className: u($c({ size: l }), d && "text-[var(--Text-Caution)]"), children: [
      h ? /* @__PURE__ */ f(de, { children: [
        s,
        c(t),
        "〜",
        s,
        c(r)
      ] }) : /* @__PURE__ */ f(de, { children: [
        s,
        c(t)
      ] }),
      o && /* @__PURE__ */ n("span", { className: u("ml-0.5 text-[var(--Text-Low-Emphasis)]", Vc[m]), children: "税込" })
    ] })
  ] });
}
function qc({ size: e = 14, className: t }) {
  return /* @__PURE__ */ n("svg", { width: e, height: e, viewBox: "0 0 16 16", fill: "currentColor", className: t, "aria-hidden": !0, children: /* @__PURE__ */ n("path", { d: "M8 1.3l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9L4.4 12.3l.7-4L2.2 5.5l4-.6L8 1.3z" }) });
}
const Gc = {
  sm: { icon: 12, val: "typo-label-sm", cnt: "typo-body-xs" },
  md: { icon: 14, val: "typo-label-md", cnt: "typo-body-sm" },
  lg: { icon: 18, val: "typo-label-lg", cnt: "typo-body-md" }
};
function Fr({ className: e, rating: t, reviewCount: r, size: a = "sm", showCount: o = !0, showValue: s = !0, ...l }) {
  const i = Math.max(0, Math.min(5, t)), { icon: c, val: d, cnt: h } = Gc[a];
  return /* @__PURE__ */ f("div", { "data-slot": "rating-display", className: u("inline-flex items-center gap-0.5", e), role: "img", "aria-label": `評価 ${i.toFixed(1)} / 5${r != null ? ` (${r}件)` : ""}`, ...l, children: [
    /* @__PURE__ */ n(qc, { size: c, className: "text-[var(--Brand-Primary)]" }),
    s && /* @__PURE__ */ n("span", { className: u("text-[var(--Brand-Primary)]", d), children: i.toFixed(2) }),
    o && r != null && /* @__PURE__ */ f("span", { className: u("text-[var(--Text-Low-Emphasis)]", h), children: [
      "(",
      r.toLocaleString("ja-JP"),
      ")"
    ] })
  ] });
}
function Ar({ size: e = 14 }) {
  return /* @__PURE__ */ n("svg", { width: e, height: e, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ n("path", { d: "M4 8h8", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) });
}
function _r({ size: e = 14 }) {
  return /* @__PURE__ */ n("svg", { width: e, height: e, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ n("path", { d: "M8 4v8M4 8h8", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) });
}
function zr({ size: e = 14 }) {
  return /* @__PURE__ */ n("svg", { width: e, height: e, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ n("path", { d: "M3 4h10M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1M5 4v8a1 1 0 001 1h4a1 1 0 001-1V4", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) });
}
function Zf({ className: e, value: t, min: r = 1, max: a = 99, onChange: o, disabled: s = !1, size: l = "md", showTrash: i = !1, onDelete: c, ...d }) {
  const h = i && t <= r, m = t > r && !s, p = t < a && !s, v = () => {
    if (h) {
      c?.();
      return;
    }
    m && o?.(t - 1);
  }, b = () => {
    p && o?.(t + 1);
  };
  return l === "sm" ? /* @__PURE__ */ f("div", { "data-slot": "quantity-selector", className: u("inline-flex h-9 w-[108px] items-center justify-between rounded-full bg-[var(--Surface-Tertiary)] px-2.5", s && "opacity-50", e), role: "group", "aria-label": "数量選択", ...d, children: [
    /* @__PURE__ */ n("button", { type: "button", className: u("flex size-7 items-center justify-center rounded-full", m || h ? "text-[var(--Object-High-Emphasis)]" : "text-[var(--Object-Disable)]"), onClick: v, disabled: !(m || h && !s), "aria-label": h ? "削除" : "数量を減らす", children: h ? /* @__PURE__ */ n(zr, { size: 14 }) : /* @__PURE__ */ n(Ar, { size: 14 }) }),
    /* @__PURE__ */ n("span", { className: u("w-7 text-center typo-label-md select-none", s ? "text-[var(--Text-Disable)]" : "text-[var(--Text-High-Emphasis)]"), "aria-live": "polite", children: t }),
    /* @__PURE__ */ n("button", { type: "button", className: u("flex size-7 items-center justify-center rounded-full", p ? "text-[var(--Object-High-Emphasis)]" : "text-[var(--Object-Disable)]"), onClick: b, disabled: !p, "aria-label": "数量を増やす", children: /* @__PURE__ */ n(_r, { size: 14 }) })
  ] }) : /* @__PURE__ */ f("div", { "data-slot": "quantity-selector", className: u("inline-flex items-center gap-3", e), role: "group", "aria-label": "数量選択", ...d, children: [
    /* @__PURE__ */ n("button", { type: "button", className: u("flex size-10 items-center justify-center rounded-full border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] transition-colors", m || h ? "text-[var(--Object-High-Emphasis)] hover:bg-[var(--Surface-Tertiary)]" : "text-[var(--Object-Disable)]"), onClick: v, disabled: !(m || h && !s), "aria-label": h ? "削除" : "数量を減らす", children: h ? /* @__PURE__ */ n(zr, { size: 18 }) : /* @__PURE__ */ n(Ar, { size: 18 }) }),
    /* @__PURE__ */ n("span", { className: u("flex h-10 w-12 items-center justify-center rounded-lg border border-[var(--Border-Medium-Emphasis)] typo-label-lg select-none", s ? "bg-[var(--Surface-Tertiary)] text-[var(--Text-Disable)]" : "bg-[var(--Surface-Secondary)] text-[var(--Text-High-Emphasis)]"), "aria-live": "polite", children: t }),
    /* @__PURE__ */ n("button", { type: "button", className: u("flex size-10 items-center justify-center rounded-full border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] transition-colors", p ? "text-[var(--Object-High-Emphasis)] hover:bg-[var(--Surface-Tertiary)]" : "text-[var(--Object-Disable)]"), onClick: b, disabled: !p, "aria-label": "数量を増やす", children: /* @__PURE__ */ n(_r, { size: 18 }) })
  ] });
}
function Kf({ className: e, lineItems: t, totalLabel: r = "合計（税込）", totalValue: a, ctaLabel: o, onCTAClick: s, ctaDisabled: l = !1, fixed: i = !1, ...c }) {
  const d = /* @__PURE__ */ f("div", { className: "space-y-3 px-4 py-3", children: [
    t?.map((h) => /* @__PURE__ */ f("div", { className: "flex items-center justify-between typo-body-md", children: [
      /* @__PURE__ */ n("span", { className: "text-[var(--Text-Medium-Emphasis)]", children: h.label }),
      /* @__PURE__ */ n("span", { className: "text-[var(--Text-High-Emphasis)]", children: h.value })
    ] }, h.label)),
    t && t.length > 0 && /* @__PURE__ */ n("hr", { className: "border-[var(--Border-Low-Emphasis)]" }),
    /* @__PURE__ */ f("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ n("span", { className: "typo-heading-md text-[var(--Text-High-Emphasis)]", children: r }),
      /* @__PURE__ */ n("span", { className: "typo-heading-lg text-[var(--Text-High-Emphasis)]", children: a })
    ] }),
    /* @__PURE__ */ n("button", { "data-slot": "button", type: "button", className: u("flex h-14 w-full items-center justify-center rounded-full bg-[var(--Brand-Primary)] typo-label-lg text-[var(--Text-on-Inverse)] transition-colors hover:bg-[var(--Hover-Primary-Button)] cursor-pointer", l && "opacity-50 cursor-not-allowed"), onClick: s, disabled: l, children: o })
  ] });
  return /* @__PURE__ */ n("div", { "data-slot": "order-summary", className: u("border-t border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]", i && "fixed inset-x-0 bottom-0 z-30 mx-auto max-w-lg", e), ...c, children: d });
}
function Yr({ filled: e = !1, size: t = 20 }) {
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
function $r({ label: e, variant: t = "default" }) {
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
function Uc({
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
  isFavorite: h = !1,
  onFavoriteToggle: m,
  href: p,
  onCardClick: v,
  ranking: b,
  deliveryLabel: x,
  orientation: y = "vertical",
  showCartButton: g = !1,
  onCartAdd: M,
  cartButtonLabel: k = "カートに追加",
  ...S
}) {
  const C = s && s > o ? Math.round((s - o) / s * 100) : null, N = p ? /* @__PURE__ */ n(
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
  return y === "horizontal" ? /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "product-card",
      "data-orientation": "horizontal",
      className: u(
        "group relative flex rounded-lg bg-[var(--Surface-Primary)]",
        e
      ),
      ...S,
      children: [
        N,
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
          m && /* @__PURE__ */ n("div", { className: "absolute bottom-1 right-1 z-10", children: /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "flex size-8 items-center justify-center rounded-full border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)]/80 backdrop-blur-sm",
              onClick: (E) => {
                E.preventDefault(), E.stopPropagation(), m();
              },
              "aria-label": h ? "お気に入りから削除" : "お気に入りに追加",
              children: /* @__PURE__ */ n(Yr, { filled: h, size: 16 })
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
                Fr,
                {
                  rating: l,
                  reviewCount: i,
                  size: "sm"
                }
              ),
              x && /* @__PURE__ */ n("p", { className: "typo-body-xs text-[var(--Text-Medium-Emphasis)]", children: x })
            ] }),
            /* @__PURE__ */ n(
              Hr,
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
      ...S,
      children: [
        N,
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
              C && /* @__PURE__ */ n($r, { label: `${C}%OFF`, variant: "caution" }),
              d.map((E) => /* @__PURE__ */ n($r, { ...E }, E.label))
            ] })
          ] }),
          m && /* @__PURE__ */ n("div", { className: "absolute bottom-1.5 right-1.5 z-[4]", children: /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "flex size-9 items-center justify-center rounded-full border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)]/80 backdrop-blur-sm transition-colors hover:bg-[var(--Surface-Tertiary)]",
              onClick: (E) => {
                E.preventDefault(), E.stopPropagation(), m();
              },
              "aria-label": h ? "お気に入りから削除" : "お気に入りに追加",
              children: /* @__PURE__ */ n(Yr, { filled: h, size: 20 })
            }
          ) })
        ] }),
        /* @__PURE__ */ f("div", { className: "flex flex-1 flex-col gap-0.5", children: [
          c && /* @__PURE__ */ n("p", { className: "truncate typo-body-sm text-[var(--Text-Low-Emphasis)]", children: c }),
          /* @__PURE__ */ n("h3", { className: "line-clamp-2 typo-body-md text-[var(--Text-High-Emphasis)]", children: t }),
          (l != null || x) && /* @__PURE__ */ f("div", { className: "flex flex-wrap items-center gap-2", children: [
            l != null && /* @__PURE__ */ n(
              Fr,
              {
                rating: l,
                reviewCount: i,
                size: "sm"
              }
            ),
            x && /* @__PURE__ */ n("p", { className: "typo-body-xs text-[var(--Text-Medium-Emphasis)]", children: x })
          ] }),
          /* @__PURE__ */ n(
            Hr,
            {
              price: o,
              originalPrice: s,
              size: "md",
              showTaxLabel: !1
            }
          )
        ] }),
        g && /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            "data-slot": "button",
            className: "relative z-10 flex h-9 w-full items-center justify-center gap-1 rounded-full bg-[var(--Brand-Primary)] typo-label-md text-[var(--Text-on-Inverse)] transition-colors hover:bg-[var(--Hover-Primary-Button)] cursor-pointer",
            onClick: (E) => {
              E.preventDefault(), E.stopPropagation(), M?.();
            },
            children: k
          }
        )
      ]
    }
  );
}
const Xc = {
  sm: "w-40",
  md: "w-[200px]",
  lg: "w-[240px]"
};
function Jf({
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
  ...h
}) {
  return /* @__PURE__ */ f(
    "section",
    {
      "data-slot": "product-carousel",
      className: u("py-4", e),
      ...h,
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
              l.map((m, p) => /* @__PURE__ */ n(
                "div",
                {
                  className: u("shrink-0", Xc[i]),
                  children: /* @__PURE__ */ n(
                    Uc,
                    {
                      ...m,
                      ranking: c ? p + 1 : m.ranking,
                      showCartButton: d,
                      className: u(
                        m.className,
                        d && "h-full"
                      )
                    }
                  )
                },
                m.name + p
              )),
              /* @__PURE__ */ n("div", { className: "shrink-0 w-4", "aria-hidden": !0 })
            ]
          }
        )
      ]
    }
  );
}
function eh({
  images: e,
  aspectRatio: t = "banner",
  showDots: r = !0,
  showArrows: a = !0,
  autoPlay: o = 0,
  className: s,
  ...l
}) {
  const i = w.useRef(null), [c, d] = w.useState(0), h = e.length, m = t === "square" ? "aspect-square" : t === "video" ? "aspect-video" : "aspect-[2/1]";
  w.useEffect(() => {
    const v = i.current;
    if (!v) return;
    const b = new IntersectionObserver(
      (x) => {
        for (const y of x)
          if (y.isIntersecting) {
            const g = Number(y.target.dataset.index);
            isNaN(g) || d(g);
          }
      },
      { root: v, threshold: 0.6 }
    );
    return v.querySelectorAll("[data-slide]").forEach((x) => b.observe(x)), () => b.disconnect();
  }, [h]), w.useEffect(() => {
    if (o <= 0 || h <= 1) return;
    const v = setInterval(() => p((c + 1) % h), o);
    return () => clearInterval(v);
  }, [o, c, h]);
  function p(v) {
    const b = i.current?.children[v];
    b && i.current.scrollTo({
      left: b.offsetLeft,
      behavior: "smooth"
    });
  }
  return h ? /* @__PURE__ */ f(
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
                      m
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
                      m
                    )
                  }
                )
              },
              b
            ))
          }
        ),
        a && h > 1 && /* @__PURE__ */ f(de, { children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: () => p(c <= 0 ? h - 1 : c - 1),
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
              onClick: () => p(c >= h - 1 ? 0 : c + 1),
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
        r && h > 1 && /* @__PURE__ */ n("div", { className: "mt-2 flex items-center justify-center gap-1.5 lg:hidden", children: e.map((v, b) => /* @__PURE__ */ n(
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
function th({ className: e, items: t, variant: r = "default", pillPosition: a = "fixed", ...o }) {
  return r === "pill" ? /* @__PURE__ */ n(Zc, { className: e, items: t, pillPosition: a, ...o }) : /* @__PURE__ */ n(Qc, { className: e, items: t, ...o });
}
function Qc({ className: e, items: t, ...r }) {
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
      children: /* @__PURE__ */ n("div", { className: "flex h-14 items-center justify-around px-1", children: t.map((a) => /* @__PURE__ */ n(Xa, { item: a, compact: !1 }, a.label)) })
    }
  );
}
function Zc({ className: e, items: t, pillPosition: r = "fixed", ...a }) {
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
      children: t.map((o) => /* @__PURE__ */ n(Xa, { item: o, compact: !0 }, o.label))
    }
  );
}
function Xa({ item: e, compact: t }) {
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
function Kc({ filter: e }) {
  const [t, r] = w.useState(!1), a = w.useRef(null), o = e.options && e.options.length > 0, s = e.isActive || !!e.selectedValue;
  w.useEffect(() => {
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
function rh({
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
  ...h
}) {
  const [m, p] = w.useState(!1), v = w.useRef(null);
  return w.useEffect(() => {
    if (!m) return;
    const b = (x) => {
      v.current && !v.current.contains(x.target) && p(!1);
    };
    return document.addEventListener("mousedown", b), () => document.removeEventListener("mousedown", b);
  }, [m]), /* @__PURE__ */ f(
    "nav",
    {
      "aria-label": "フィルター",
      "data-slot": "filter-bar",
      className: u("space-y-2", d),
      ...h,
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
          e.map((b) => /* @__PURE__ */ n(Kc, { filter: b }, b.label))
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
                onClick: () => p(!m),
                className: "flex h-9 shrink-0 items-center gap-0.5 rounded-full bg-[var(--Surface-Tertiary)] px-3 typo-body-md text-[var(--Text-High-Emphasis)] hover:opacity-80",
                children: [
                  /* @__PURE__ */ n("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ n("path", { d: "M3 4h7M3 8h5M3 12h3M13 5v8M11 11l2 2 2-2", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) }),
                  a.find((b) => b.value === o)?.label ?? r ?? "並べ替え"
                ]
              }
            ),
            m && /* @__PURE__ */ n("div", { className: "absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] py-1 shadow-[var(--shadow-lg)] animate-fade-in", children: a.map((b) => /* @__PURE__ */ f(
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
function Qa({ rating: e, size: t = 14 }) {
  return /* @__PURE__ */ n("div", { className: "flex gap-0.5", "aria-label": `${e}点 / 5点`, children: [1, 2, 3, 4, 5].map((r) => /* @__PURE__ */ n("svg", { width: t, height: t, viewBox: "0 0 14 14", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ n(
    "path",
    {
      d: "M7 1l1.6 3.3 3.6.5-2.6 2.5.6 3.6L7 9.2 3.8 11l.6-3.6L2 4.9l3.6-.5L7 1z",
      fill: r <= e ? "#F59E0B" : "var(--Border-Medium-Emphasis)"
    }
  ) }, r)) });
}
function ah({
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
  className: h
}) {
  const m = t ?? e.slice(0, 1);
  return /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "review-card",
      className: u(
        "bg-[var(--Surface-Primary)] rounded-xl border border-[var(--Border-Low-Emphasis)] p-4",
        h
      ),
      children: [
        /* @__PURE__ */ f("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ n("div", { className: "w-9 h-9 rounded-full shrink-0 overflow-hidden bg-gradient-to-br from-[var(--Brand-Primary)] to-[var(--Brand-Light)] flex items-center justify-center", children: r ? /* @__PURE__ */ n("img", { src: r, alt: e, className: "w-full h-full object-cover" }) : /* @__PURE__ */ n("span", { className: "text-white text-sm font-bold", children: m }) }),
          /* @__PURE__ */ f("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ n("p", { className: "typo-label-sm text-[var(--Text-High-Emphasis)] font-semibold truncate", children: e }),
            /* @__PURE__ */ n("p", { className: "typo-body-xs text-[var(--Text-Low-Emphasis)]", children: l })
          ] }),
          /* @__PURE__ */ n(Qa, { rating: a })
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
function nh({
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
            /* @__PURE__ */ n(Qa, { rating: Math.round(e), size: 16 }),
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
function oh({ items: e, className: t, ...r }) {
  const [a, o] = w.useState(!1), s = w.useRef(null);
  return w.useEffect(() => {
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
function sh({ selectedCount: e, onClear: t, children: r, className: a, ...o }) {
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
function ih({ items: e, activeIndex: t = 0, onSelect: r, className: a, ...o }) {
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
const Jc = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4"
};
function lh({ children: e, onSearch: t, onReset: r, columns: a = 4, layout: o = "grid", className: s, ...l }) {
  const i = o === "flex" ? "flex flex-wrap items-end gap-3 [&>*]:flex [&>*]:flex-col [&>*]:min-w-[140px] [&>*]:flex-1" : u("grid grid-cols-1 gap-3 items-end [&>*]:flex [&>*]:flex-col", Jc[a]);
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
function ch({ images: e = [], onAdd: t, onRemove: r, maxImages: a = 10, columns: o = 4, className: s, ...l }) {
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
function Rr(e) {
  return e < 1024 ? `${e} B` : e < 1024 * 1024 ? `${(e / 1024).toFixed(1)} KB` : `${(e / (1024 * 1024)).toFixed(1)} MB`;
}
function dh({
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
  maxSizeLabel: h = (v) => `最大 ${Rr(v)} まで`,
  maxFilesLabel: m = (v) => `最大 ${v} ファイルまで`,
  removeLabel: p = "削除"
}) {
  const [v, b] = w.useState(!1), [x, y] = w.useState([]), [g, M] = w.useState(null), k = w.useRef(null), S = (P) => {
    if (M(null), t && P.find((J) => J.size > t))
      return M(h(t)), null;
    const L = r ? [...x, ...P] : P.slice(0, 1);
    return r && L.length > a ? (M(m(a)), null) : L;
  }, C = (P) => {
    const L = S(P);
    L && (y(L), o?.(L));
  }, N = (P) => {
    const L = x.filter((K, J) => J !== P);
    y(L), o?.(L);
  }, E = (P) => {
    P.preventDefault(), b(!1), !s && C(Array.from(P.dataTransfer.files));
  }, I = (P) => {
    P.target.files && C(Array.from(P.target.files)), P.target.value = "";
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
        onClick: () => !s && k.current?.click(),
        onKeyDown: (P) => {
          (P.key === "Enter" || P.key === " ") && k.current?.click();
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
            t && h(t),
            r && m(a)
          ].filter(Boolean).join(" / ") })
        ]
      }
    ),
    /* @__PURE__ */ n(
      "input",
      {
        ref: k,
        type: "file",
        accept: e,
        multiple: r,
        className: "hidden",
        onChange: I,
        disabled: s
      }
    ),
    g && /* @__PURE__ */ n("p", { className: "typo-body-sm text-[var(--Text-Caution)]", role: "alert", children: g }),
    x.length > 0 && /* @__PURE__ */ n("ul", { className: "flex flex-col gap-2", children: x.map((P, L) => /* @__PURE__ */ f(
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
            /* @__PURE__ */ n("p", { className: "typo-body-xs text-[var(--Text-Low-Emphasis)]", children: Rr(P.size) })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": `${P.name} を${p}`,
              onClick: () => N(L),
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
function uh({ notifications: e, variant: t = "vertical", emptyMessage: r = "新着のお知らせはありません", className: a, ...o }) {
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
const ed = [
  { label: "時間", value: "hour" },
  { label: "日", value: "day" },
  { label: "週", value: "week" },
  { label: "月", value: "month" }
], td = [
  { label: "7日", value: "7d" },
  { label: "30日", value: "30d" },
  { label: "90日", value: "90d" },
  { label: "1年", value: "1y" },
  { label: "カスタム", value: "custom" }
];
function Vr({
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
function fh({
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
            Vr,
            {
              options: ed,
              value: e,
              onChange: t
            }
          )
        ] }),
        a && /* @__PURE__ */ f("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ n("span", { className: "typo-label-xs text-[var(--Text-Low-Emphasis)] font-bold w-10 shrink-0", children: "期間" }),
          /* @__PURE__ */ n(
            Vr,
            {
              options: td,
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
function xt(e, t = 0, r = !1) {
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
function rd({ direction: e }) {
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
function ad() {
  return /* @__PURE__ */ f("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", children: [
    /* @__PURE__ */ n("circle", { cx: "8", cy: "3", r: "1.5" }),
    /* @__PURE__ */ n("circle", { cx: "8", cy: "8", r: "1.5" }),
    /* @__PURE__ */ n("circle", { cx: "8", cy: "13", r: "1.5" })
  ] });
}
function nd() {
  return /* @__PURE__ */ n("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: /* @__PURE__ */ n("path", { d: "M8 3V13M3 8H13" }) });
}
function od() {
  return /* @__PURE__ */ f("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", className: "shrink-0", children: [
    /* @__PURE__ */ n("path", { d: "M10.5 7.5V11.5C10.5 12.05 10.05 12.5 9.5 12.5H2.5C1.95 12.5 1.5 12.05 1.5 11.5V4.5C1.5 3.95 1.95 3.5 2.5 3.5H6.5" }),
    /* @__PURE__ */ n("path", { d: "M8.5 1.5H12.5V5.5" }),
    /* @__PURE__ */ n("path", { d: "M5.5 8.5L12.5 1.5" })
  ] });
}
function sd() {
  return /* @__PURE__ */ f("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "currentColor", className: "shrink-0", children: [
    /* @__PURE__ */ n("circle", { cx: "5", cy: "3", r: "1.2" }),
    /* @__PURE__ */ n("circle", { cx: "9", cy: "3", r: "1.2" }),
    /* @__PURE__ */ n("circle", { cx: "5", cy: "7", r: "1.2" }),
    /* @__PURE__ */ n("circle", { cx: "9", cy: "7", r: "1.2" }),
    /* @__PURE__ */ n("circle", { cx: "5", cy: "11", r: "1.2" }),
    /* @__PURE__ */ n("circle", { cx: "9", cy: "11", r: "1.2" })
  ] });
}
function id({ open: e }) {
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
function hh({ className: e, children: t, ...r }) {
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
function mh({ className: e, children: t, ...r }) {
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
function ph({ className: e, children: t, ...r }) {
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
function vh({ className: e, children: t, ...r }) {
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
function bh({ className: e, selected: t, children: r, ...a }) {
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
function gh({
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
  const d = s ? xt(s, l, !0) : null;
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
        /* @__PURE__ */ n(rd, { direction: a ?? null })
      ] }) : t
    }
  );
}
const ld = se("px-3 py-2.5 typo-body-md text-[var(--Text-High-Emphasis)]", {
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
function xh({
  className: e,
  align: t,
  width: r,
  children: a,
  sticky: o,
  stickyOffset: s,
  style: l,
  ...i
}) {
  const c = o ? xt(o, s) : null;
  return /* @__PURE__ */ n(
    "td",
    {
      "data-slot": "data-table-cell",
      className: u(ld({ align: t, width: r }), c?.className, e),
      style: c ? { ...c.style, ...l } : l,
      ...i,
      children: a
    }
  );
}
function yh({
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
  const d = s ? xt(s, l) : null;
  return /* @__PURE__ */ n(
    "td",
    {
      "data-slot": "data-table-avatar-cell",
      className: u("px-3 py-2.5", d?.className, e),
      style: d ? { ...d.style, ...i } : i,
      ...c,
      children: /* @__PURE__ */ f("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ f(Vn, { className: "size-8", children: [
          t && /* @__PURE__ */ n(qn, { src: t, alt: a }),
          /* @__PURE__ */ n(Gn, { children: r ?? a.charAt(0) })
        ] }),
        /* @__PURE__ */ f("div", { className: "flex flex-col min-w-0", children: [
          /* @__PURE__ */ n("span", { className: "typo-label-md text-[var(--Text-High-Emphasis)] truncate", children: a }),
          o && /* @__PURE__ */ n("span", { className: "typo-body-sm text-[var(--Text-Low-Emphasis)] truncate", children: o })
        ] })
      ] })
    }
  );
}
function wh({
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
function kh({
  className: e,
  checked: t,
  onCheckedChange: r,
  indeterminate: a,
  sticky: o,
  stickyOffset: s,
  style: l,
  ...i
}) {
  const c = o ? xt(o, s) : null;
  return /* @__PURE__ */ n(
    "td",
    {
      "data-slot": "data-table-checkbox-cell",
      className: u("w-[40px] px-3 py-2.5", c?.className, e),
      style: c ? { ...c.style, ...l } : l,
      ...i,
      children: /* @__PURE__ */ n(
        Qn,
        {
          checked: a ? "indeterminate" : t,
          onCheckedChange: (d) => r?.(d === !0)
        }
      )
    }
  );
}
function Nh({ className: e, items: t, ...r }) {
  const [a, o] = w.useState(!1), s = w.useRef(null);
  return w.useEffect(() => {
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
            children: /* @__PURE__ */ n(ad, {})
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
function Mh({
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
function Sh({
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
      children: /* @__PURE__ */ f(ec, { value: t, onValueChange: r, children: [
        /* @__PURE__ */ n(rc, { className: "h-8 min-w-[120px] typo-body-md border-transparent hover:border-[var(--Border-Low-Emphasis)]", children: /* @__PURE__ */ n(tc, { placeholder: a }) }),
        /* @__PURE__ */ n(ac, { children: o.map((l) => /* @__PURE__ */ n(nc, { value: l.value, children: l.label }, l.value)) })
      ] })
    }
  );
}
function Ch({
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
function Th({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    "td",
    {
      "data-slot": "data-table-drag-handle-cell",
      className: u("w-[36px] px-2 py-2.5 cursor-grab text-[var(--Text-Low-Emphasis)]", e),
      ...t,
      children: /* @__PURE__ */ n(sd, {})
    }
  );
}
function Eh({
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
            r && /* @__PURE__ */ n(od, {})
          ]
        }
      )
    }
  );
}
function Dh({
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
function Ph({
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
            /* @__PURE__ */ n(id, { open: a }),
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
function Bh({
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
            /* @__PURE__ */ n(nd, {}),
            t
          ]
        }
      ) })
    }
  );
}
function Oh({
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
function cd() {
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
function dd() {
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
function Lh({
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
  totalPages: h,
  ...m
}) {
  const p = r ?? (h !== void 0 ? "pages" : "items"), v = h !== void 0 ? h : d && d > 0 ? Math.max(1, Math.ceil((c ?? 0) / d)) : 1, b = Math.min(Math.max(1, e), Math.max(1, v)), x = b > 1, y = b < v, g = d && c !== void 0 && c > 0 ? (b - 1) * d + 1 : void 0, M = d && c !== void 0 ? Math.min(b * d, c) : void 0, k = () => {
    x && t?.(b - 1);
  }, S = () => {
    y && t?.(b + 1);
  }, C = w.useMemo(() => l ? l({
    page: b,
    totalPages: v,
    pageSize: d,
    total: c,
    from: g,
    to: M
  }) : a ? /* @__PURE__ */ f("span", { className: "tabular-nums", children: [
    b,
    " / ",
    v
  ] }) : p === "items" && c !== void 0 && d ? c === 0 ? /* @__PURE__ */ n("span", { className: "tabular-nums", children: "0 件" }) : /* @__PURE__ */ f(de, { children: [
    /* @__PURE__ */ f("span", { className: "tabular-nums", children: [
      g?.toLocaleString(),
      " - ",
      M?.toLocaleString()
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
    g,
    M
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
      ...m,
      children: [
        /* @__PURE__ */ f(
          ke,
          {
            type: "button",
            variant: "tertiary",
            size: "sm",
            onClick: k,
            disabled: !x,
            "aria-label": o,
            children: [
              /* @__PURE__ */ n(cd, {}),
              /* @__PURE__ */ n("span", { className: a ? "sr-only sm:not-sr-only" : void 0, children: o })
            ]
          }
        ),
        /* @__PURE__ */ n(
          "div",
          {
            className: "typo-body-sm text-[var(--Text-High-Emphasis)] text-center",
            "aria-live": "polite",
            children: C
          }
        ),
        /* @__PURE__ */ f(
          ke,
          {
            type: "button",
            variant: "tertiary",
            size: "sm",
            onClick: S,
            disabled: !y,
            "aria-label": s,
            children: [
              /* @__PURE__ */ n("span", { className: a ? "sr-only sm:not-sr-only" : void 0, children: s }),
              /* @__PURE__ */ n(dd, {})
            ]
          }
        )
      ]
    }
  );
}
function Wh({
  open: e,
  onClose: t,
  banner: r,
  sections: a,
  footerLinks: o,
  width: s = 280,
  className: l
}) {
  return /* @__PURE__ */ n(Qt, { open: e, onOpenChange: (i) => !i && t(), children: /* @__PURE__ */ f(
    Jt,
    {
      side: "left",
      className: u("p-0 flex flex-col", l),
      style: { width: s },
      children: [
        /* @__PURE__ */ n(er, { className: "sr-only", children: /* @__PURE__ */ n(tr, { children: "メニュー" }) }),
        /* @__PURE__ */ f("div", { className: "flex-1 overflow-y-auto", children: [
          r && /* @__PURE__ */ n("div", { className: "mx-3 mt-4 mb-2", children: r }),
          a.map((i, c) => /* @__PURE__ */ f("div", { className: c > 0 ? "border-t border-[var(--Border-Low-Emphasis)] mt-2 pt-2" : "mt-2", children: [
            i.title && /* @__PURE__ */ n("p", { className: "px-4 py-1.5 typo-label-xs text-[var(--Text-Low-Emphasis)] font-bold uppercase tracking-wider", children: i.title }),
            i.items.map((d, h) => {
              const m = d.href ? "a" : "button";
              return /* @__PURE__ */ f(
                m,
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
                h
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
const ud = ["VISA", "Master", "JCB", "AmEx", "PayPay", "LINE Pay"];
function Ih({
  logo: e,
  linkGroups: t = [],
  paymentIcons: r = ud,
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
                const h = c.href ? "a" : "button";
                return /* @__PURE__ */ n("li", { children: /* @__PURE__ */ n(
                  h,
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
const Pt = {
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
function jh({
  url: e,
  title: t,
  providers: r = ["line", "x", "facebook", "copy"],
  layout: a = "circle",
  className: o,
  onCopy: s
}) {
  const [l, i] = w.useState(!1), c = (d) => {
    if (d === "copy") {
      navigator.clipboard.writeText(e).then(() => {
        i(!0), s?.(), setTimeout(() => i(!1), 2e3);
      });
      return;
    }
    const h = Pt[d];
    h.buildUrl && window.open(h.buildUrl(e, t), "_blank", "noopener,noreferrer,width=600,height=500");
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
        const h = Pt[d], m = d === "copy";
        return /* @__PURE__ */ f(
          "button",
          {
            onClick: () => c(d),
            "aria-label": h.label,
            className: "flex flex-col items-center gap-1.5 cursor-pointer",
            children: [
              /* @__PURE__ */ n("span", { className: u(
                "w-12 h-12 rounded-full flex items-center justify-center transition-opacity hover:opacity-80 active:scale-95",
                h.circleClass
              ), children: m && l ? /* @__PURE__ */ n("svg", { width: "18", height: "18", viewBox: "0 0 18 18", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ n("path", { d: "M3 9l4 4 8-8", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }) : h.icon }),
              /* @__PURE__ */ n("span", { className: "typo-label-xs text-[var(--Text-Medium-Emphasis)]", children: m && l ? "コピー済" : h.label })
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
        const h = Pt[d], m = d === "copy";
        return /* @__PURE__ */ f(
          "button",
          {
            onClick: () => c(d),
            className: u(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border typo-label-xs font-semibold transition-colors",
              h.inlineClass
            ),
            children: [
              /* @__PURE__ */ n("span", { className: "w-3.5 h-3.5 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full", children: m && l ? /* @__PURE__ */ n("svg", { viewBox: "0 0 12 12", fill: "none", children: /* @__PURE__ */ n("path", { d: "M1 6l3 3 7-7", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }) }) : h.icon }),
              m && l ? "コピー済み" : h.label
            ]
          },
          d
        );
      })
    }
  );
}
const qr = [
  "linear-gradient(135deg, #E8426B, #F9AABF)",
  "linear-gradient(135deg, #6366F1, #A5B4FC)",
  "linear-gradient(135deg, #F59E0B, #FDE68A)",
  "linear-gradient(135deg, #10B981, #6EE7B7)",
  "linear-gradient(135deg, #3B82F6, #93C5FD)"
], fd = {
  "2/1": "aspect-[2/1]",
  "3/2": "aspect-[3/2]",
  "4/3": "aspect-[4/3]"
};
function Hh({
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
      const d = i.gradient ?? qr[c % qr.length], h = d.includes("FDE68A"), m = i.href ? "a" : "div";
      return /* @__PURE__ */ f(
        m,
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
            fd[o] ?? "aspect-[2/1]",
            i.href && "block",
            !i.imageSrc && (h ? "text-[#111]" : "text-white")
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
function Fh({
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
function Ah({ items: e, className: t }) {
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
const hd = {
  sm: "size-[60px]",
  md: "size-[100px]",
  lg: "size-[120px]"
}, md = {
  sm: "max-w-[60px]",
  md: "max-w-[100px]",
  lg: "max-w-[120px]"
}, pd = {
  sm: "calc((100vw - 32px) / 4.05)",
  md: "calc((100vw - 32px) / 3.5)",
  lg: "calc((100vw - 32px) / 3.0)"
};
function _h({
  title: e,
  moreHref: t,
  items: r,
  thumbnailSize: a = "md",
  thumbnailShape: o = "square",
  layout: s = "scroll",
  gridRows: l = 3,
  className: i
}) {
  const c = o === "circle" ? "rounded-full" : "rounded-lg", d = (h, m) => /* @__PURE__ */ f(
    "a",
    {
      href: h.href,
      className: "group flex shrink-0 flex-col items-center gap-1.5",
      children: [
        /* @__PURE__ */ n(
          "div",
          {
            className: u(
              "shrink-0 overflow-hidden",
              m ? "aspect-square w-full" : hd[a],
              c
            ),
            children: /* @__PURE__ */ n(
              "img",
              {
                src: h.imageUrl,
                alt: h.name,
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
              m ? "w-full" : md[a]
            ),
            children: h.name
          }
        )
      ]
    },
    h.href
  );
  return /* @__PURE__ */ f("section", { "data-slot": "category-scroll", className: u("py-4", i), children: [
    /* @__PURE__ */ n(
      Wc,
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
            gridAutoColumns: pd[a]
          },
          children: r.map((h) => d(h, !0))
        }
      ),
      /* @__PURE__ */ n("div", { className: "w-4 shrink-0", "aria-hidden": "true" })
    ] }) : /* @__PURE__ */ f("div", { className: "mt-3 flex gap-3 overflow-x-auto pl-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", children: [
      r.map((h) => d(h)),
      /* @__PURE__ */ n("div", { className: "w-4 shrink-0", "aria-hidden": "true" })
    ] })
  ] });
}
function zh({
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
function Yh({
  label: e,
  value: t,
  options: r,
  onSelect: a,
  hideAll: o = !1,
  allLabel: s = "すべて",
  className: l
}) {
  const [i, c] = w.useState(!1), d = w.useRef(null), [h, m] = w.useState({ top: 0, left: 0 }), p = t !== "all", v = r.find((g) => g.key === t), b = p && v ? `${e}: ${v.label}` : e, x = () => {
    if (d.current) {
      const g = d.current.getBoundingClientRect();
      m({ top: g.bottom + 4, left: g.left });
    }
    c((g) => !g);
  }, y = (g) => {
    a(g), c(!1);
  };
  return /* @__PURE__ */ f("div", { "data-slot": "dropdown-filter", "data-active": p || void 0, className: u("flex-shrink-0", l), children: [
    /* @__PURE__ */ f(
      "button",
      {
        ref: d,
        type: "button",
        onClick: x,
        "aria-expanded": i,
        "aria-haspopup": "listbox",
        className: u(
          "h-9 rounded-full px-4 typo-label-sm flex items-center gap-1.5 transition-all duration-200",
          p ? "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)]" : "bg-[var(--Surface-Primary)] border border-[var(--Border-Low-Emphasis)] text-[var(--Text-Medium-Emphasis)]"
        ),
        children: [
          b,
          /* @__PURE__ */ n(
            "svg",
            {
              "aria-hidden": !0,
              className: u("w-3 h-3 transition-transform duration-200", i && "rotate-180"),
              viewBox: "0 0 12 12",
              fill: "none",
              children: /* @__PURE__ */ n("path", { d: "M3 4.5L6 7.5L9 4.5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })
            }
          )
        ]
      }
    ),
    i && /* @__PURE__ */ f(de, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          "aria-label": "閉じる",
          className: "fixed inset-0 z-40",
          onClick: () => c(!1)
        }
      ),
      /* @__PURE__ */ f(
        "ul",
        {
          role: "listbox",
          className: "fixed z-50 bg-[var(--Surface-Primary)] border border-[var(--Border-Low-Emphasis)] rounded-2xl shadow-[var(--shadow-lg)] py-1 max-h-[60vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-150",
          style: { top: h.top, left: Math.min(h.left, (typeof window < "u" ? window.innerWidth : 375) - 200), width: 200 },
          children: [
            !o && /* @__PURE__ */ n("li", { children: /* @__PURE__ */ f(
              "button",
              {
                type: "button",
                role: "option",
                "aria-selected": t === "all",
                onClick: () => y("all"),
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
            r.map((g) => /* @__PURE__ */ n("li", { children: /* @__PURE__ */ f(
              "button",
              {
                type: "button",
                role: "option",
                "aria-selected": t === g.key,
                onClick: () => y(g.key),
                className: u(
                  "w-full flex items-center justify-between px-4 py-2.5 typo-body-sm transition-colors hover:bg-[var(--Surface-Secondary)]",
                  t === g.key ? "text-[var(--Brand-Primary)] font-semibold" : "text-[var(--Text-High-Emphasis)]"
                ),
                children: [
                  /* @__PURE__ */ n("span", { className: "truncate", children: g.label }),
                  t === g.key && /* @__PURE__ */ n("span", { "aria-hidden": !0, className: "text-[var(--Brand-Primary)] ml-2 flex-shrink-0", children: "✓" })
                ]
              }
            ) }, g.key))
          ]
        }
      )
    ] })
  ] });
}
function $h({
  active: e,
  onPinCreate: t,
  pins: r = [],
  onPinClick: a,
  holdDuration: o = 600,
  onHaptic: s,
  className: l,
  children: i
}) {
  const c = w.useRef(null), d = w.useRef(null), [h, m] = w.useState(null), p = (x, y) => {
    const g = c.current;
    if (!g) return { x: 0.5, y: 0.5 };
    const M = g.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (x - M.left) / M.width)),
      y: Math.min(1, Math.max(0, (y - M.top) / M.height))
    };
  }, v = (x, y) => {
    if (!e) return;
    const g = p(x, y);
    m(g), d.current = setTimeout(() => {
      s?.(), t?.(g), m(null);
    }, o);
  }, b = () => {
    d.current && clearTimeout(d.current), m(null);
  };
  return /* @__PURE__ */ f(
    "div",
    {
      ref: c,
      className: u("relative select-none", l),
      onMouseDown: (x) => v(x.clientX, x.clientY),
      onMouseUp: b,
      onMouseLeave: b,
      onTouchStart: (x) => {
        const y = x.touches[0];
        v(y.clientX, y.clientY);
      },
      onTouchEnd: b,
      onTouchCancel: b,
      children: [
        i,
        e && h && /* @__PURE__ */ n(
          "div",
          {
            "aria-hidden": !0,
            className: "absolute inset-0 pointer-events-none",
            style: {
              background: `radial-gradient(circle 60px at ${h.x * 100}% ${h.y * 100}%, transparent 40px, rgba(0,0,0,0.45) 70px)`
            }
          }
        ),
        e && r.map((x) => /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            "aria-label": x.comment ?? "レビューピン",
            onClick: () => a?.(x),
            className: "absolute -translate-x-1/2 -translate-y-1/2 z-10 group",
            style: { left: `${x.x * 100}%`, top: `${x.y * 100}%` },
            children: /* @__PURE__ */ n("span", { className: "flex size-5 items-center justify-center rounded-full bg-[var(--Object-Caution)] shadow-md ring-4 ring-[var(--Object-Caution)]/30 group-hover:ring-[var(--Object-Caution)]/50 transition-all" })
          },
          x.id
        ))
      ]
    }
  );
}
export {
  Cd as Accordion,
  Dd as AccordionContent,
  Td as AccordionItem,
  Ed as AccordionTrigger,
  Vf as AdminShell,
  Pd as Alert,
  Od as AlertDescription,
  Ld as AlertDialog,
  _d as AlertDialogAction,
  zd as AlertDialogCancel,
  Id as AlertDialogContent,
  Ad as AlertDialogDescription,
  Hd as AlertDialogFooter,
  jd as AlertDialogHeader,
  Rn as AlertDialogOverlay,
  $n as AlertDialogPortal,
  Fd as AlertDialogTitle,
  Wd as AlertDialogTrigger,
  Bd as AlertTitle,
  Sf as AppHeader,
  qf as AppShell,
  Vn as Avatar,
  Gn as AvatarFallback,
  qn as AvatarImage,
  Yd as Badge,
  Lf as Banner,
  Hh as BannerCarousel,
  Bf as BottomSheetForm,
  th as BottomTabBar,
  $d as Breadcrumb,
  Xd as BreadcrumbEllipsis,
  Vd as BreadcrumbItem,
  qd as BreadcrumbLink,
  Rd as BreadcrumbList,
  Gd as BreadcrumbPage,
  Ud as BreadcrumbSeparator,
  sh as BulkActions,
  ke as Button,
  Ia as Calendar,
  Qd as Card,
  eu as CardAction,
  tu as CardContent,
  Jd as CardDescription,
  ru as CardFooter,
  Zd as CardHeader,
  Kd as CardTitle,
  Ah as CategoryNav,
  _h as CategoryScroll,
  fh as ChartControls,
  Qn as Checkbox,
  au as CheckboxCardGroup,
  nu as CheckboxCardItem,
  ou as CheckboxGroup,
  su as CheckboxGroupItem,
  Bc as Chip,
  Of as ChipSelector,
  wf as CoachMark,
  iu as Collapsible,
  cu as CollapsibleContent,
  lu as CollapsibleTrigger,
  _u as Combobox,
  Pf as ConfirmDialog,
  xf as CountdownTimer,
  hh as DataTable,
  Nh as DataTableActionCell,
  Bh as DataTableAddRow,
  yh as DataTableAvatarCell,
  vh as DataTableBody,
  Dh as DataTableBulkActions,
  xh as DataTableCell,
  kh as DataTableCheckboxCell,
  Th as DataTableDragHandleCell,
  Oh as DataTableEmptyState,
  gh as DataTableHead,
  ph as DataTableHeader,
  wh as DataTableImageCell,
  Mh as DataTableInputCell,
  Eh as DataTableLinkCell,
  Ch as DataTableNumberCell,
  bh as DataTableRow,
  Ph as DataTableSectionRow,
  Sh as DataTableSelectCell,
  mh as DataTableTable,
  Hu as DatePicker,
  Fu as DateRangePicker,
  Zn as Dialog,
  eo as DialogClose,
  ro as DialogContent,
  so as DialogDescription,
  no as DialogFooter,
  ao as DialogHeader,
  to as DialogOverlay,
  Jn as DialogPortal,
  oo as DialogTitle,
  Kn as DialogTrigger,
  Yh as DropdownFilter,
  bu as DropdownMenu,
  Nu as DropdownMenuCheckboxItem,
  yu as DropdownMenuContent,
  wu as DropdownMenuGroup,
  ku as DropdownMenuItem,
  Cu as DropdownMenuLabel,
  gu as DropdownMenuPortal,
  Mu as DropdownMenuRadioGroup,
  Su as DropdownMenuRadioItem,
  Tu as DropdownMenuSeparator,
  Eu as DropdownMenuShortcut,
  Du as DropdownMenuSub,
  Bu as DropdownMenuSubContent,
  Pu as DropdownMenuSubTrigger,
  xu as DropdownMenuTrigger,
  Wf as EmptyState,
  If as ErrorState,
  dh as FileUpload,
  rh as FilterBar,
  Ih as Footer,
  du as Form,
  Qf as FormActions,
  mu as FormControl,
  pu as FormDescription,
  jf as FormField,
  fu as FormItem,
  hu as FormLabel,
  vu as FormMessage,
  Uf as FormRoot,
  Xf as FormSection,
  Ou as HoverCard,
  Wu as HoverCardContent,
  Lu as HoverCardTrigger,
  eh as ImageCarousel,
  Nf as ImageGallery,
  ch as ImageUploader,
  Iu as Input,
  oh as KebabMenu,
  Xr as Label,
  Hf as ListItem,
  Gf as MarketingShell,
  Wh as MenuDrawer,
  zu as MultiSelect,
  Mf as NavigationBar,
  Ff as NotificationBadge,
  uh as NotificationList,
  vf as NumberInput,
  Kf as OrderSummary,
  Yu as Pagination,
  $u as PaginationContent,
  Gu as PaginationEllipsis,
  Ru as PaginationItem,
  Fa as PaginationLink,
  qu as PaginationNext,
  Vu as PaginationPrevious,
  bf as PillToggle,
  et as Popover,
  ju as PopoverAnchor,
  rt as PopoverContent,
  tt as PopoverTrigger,
  Hr as PriceDisplay,
  Uc as ProductCard,
  Jf as ProductCarousel,
  Uu as Progress,
  pf as ProgressRing,
  Af as ProgressSteps,
  Zf as QuantitySelector,
  Xu as RadioGroup,
  Qu as RadioGroupItem,
  Fr as RatingDisplay,
  Sc as ResponsiveDialog,
  Df as ResponsiveDialogClose,
  Cc as ResponsiveDialogContent,
  Dc as ResponsiveDialogDescription,
  Pc as ResponsiveDialogFooter,
  Tc as ResponsiveDialogHeader,
  Ec as ResponsiveDialogTitle,
  Ef as ResponsiveDialogTrigger,
  ah as ReviewCard,
  $h as ReviewOverlay,
  nh as ReviewSummary,
  uu as RhfFormField,
  Zl as ScrollArea,
  Kl as ScrollBar,
  _f as SearchBar,
  lh as SearchPanel,
  Wc as SectionHeader,
  ec as Select,
  ac as SelectContent,
  Zu as SelectGroup,
  nc as SelectItem,
  Ju as SelectLabel,
  Ku as SelectSeparator,
  rc as SelectTrigger,
  tc as SelectValue,
  ef as Separator,
  jh as ShareButtons,
  Qt as Sheet,
  sc as SheetClose,
  Jt as SheetContent,
  Ra as SheetDescription,
  Ya as SheetDragIndicator,
  tf as SheetFooter,
  er as SheetHeader,
  tr as SheetTitle,
  oc as SheetTrigger,
  Lh as SimplePagination,
  rf as Skeleton,
  af as Slider,
  kf as SocialLoginButton,
  nf as Spinner,
  gf as StarRating,
  zf as StatCard,
  ih as StatusTabs,
  Fh as StickyActionBar,
  yf as SubNav,
  Tf as SwipeRow,
  of as Switch,
  zh as SyncStatusBadge,
  sf as Tabs,
  df as TabsContent,
  lf as TabsList,
  cf as TabsTrigger,
  Yf as Tag,
  Cf as TagInput,
  uf as Textarea,
  Au as TimePicker,
  Rf as Toaster,
  ff as Tooltip,
  mf as TooltipContent,
  uc as TooltipProvider,
  hf as TooltipTrigger,
  Un as badgeVariants,
  Oc as bannerVariants,
  pt as buttonVariants,
  Wr as chipVariants,
  u as cn,
  xt as getStickyCellProps,
  $c as priceVariants,
  jc as tagVariants,
  Ae as toast,
  vt as useFormField,
  Ne as useMediaQuery,
  $f as useToast
};
