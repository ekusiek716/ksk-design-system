"use client";
import { jsx as n, jsxs as f, Fragment as Se } from "react/jsx-runtime";
import { Accordion as ze, AlertDialog as ge, Avatar as Dt, Checkbox as Oe, Label as on, Collapsible as Pt, Dialog as q, DropdownMenu as V, HoverCard as st, Popover as Ye, Progress as er, RadioGroup as St, ScrollArea as _e, Select as ee, Separator as sn, Slider as et, Switch as tr, Tabs as it, Tooltip as $e } from "radix-ui";
import { clsx as ln } from "clsx";
import { twMerge as cn } from "tailwind-merge";
import * as w from "react";
import N, { createContext as dn, useContext as un, useCallback as re, useRef as rt, useLayoutEffect as fn, useState as Ct, useEffect as hn, useMemo as at } from "react";
import { cva as le } from "class-variance-authority";
import { TickSquare as Lr } from "iconsax-reactjs";
import { Slot as mn } from "@radix-ui/react-slot";
import * as Te from "@radix-ui/react-tooltip";
import { createPortal as pn } from "react-dom";
function u(...e) {
  return cn(ln(e));
}
function Qc({ ...e }) {
  return /* @__PURE__ */ n(ze.Root, { "data-slot": "accordion", ...e });
}
function Zc({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    ze.Item,
    {
      "data-slot": "accordion-item",
      className: u("border-b border-[var(--Border-Low-Emphasis)]", e),
      ...t
    }
  );
}
function Kc({ className: e, children: t, ...r }) {
  return /* @__PURE__ */ n(ze.Header, { className: "flex", children: /* @__PURE__ */ f(
    ze.Trigger,
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
function Jc({ className: e, children: t, ...r }) {
  return /* @__PURE__ */ n(
    ze.Content,
    {
      "data-slot": "accordion-content",
      className: "overflow-hidden typo-body-md data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up",
      ...r,
      children: /* @__PURE__ */ n("div", { className: u("pb-4 pt-0", e), children: t })
    }
  );
}
const vn = le("relative w-full", {
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
}), bn = le(
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
), Bt = w.createContext("info"), gn = (e) => e === "success" || e === "info" || e === "error" || e === "warning";
function ed({
  className: e,
  variant: t = "info",
  children: r,
  ...a
}) {
  const o = gn(t);
  return /* @__PURE__ */ n(Bt.Provider, { value: t, children: /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "alert",
      "data-variant": t,
      role: "alert",
      className: u(vn({ variant: t }), e),
      ...a,
      children: o ? /* @__PURE__ */ n("div", { className: bn({ variant: t }), children: r }) : r
    }
  ) });
}
const xn = {
  success: "text-[var(--Primitive-Forest-800)]",
  info: "text-[var(--Text-High-Emphasis)]",
  error: "text-[var(--Text-Caution)]",
  warning: "text-[var(--Text-Warning)]",
  "inline-info": "text-[var(--Text-High-Emphasis)]",
  "inline-caution": "text-[var(--Text-Caution)]",
  "inline-warning": "text-[var(--Text-Warning)]"
};
function td({ className: e, ...t }) {
  const r = w.useContext(Bt), a = xn[r ?? "info"] ?? "";
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "alert-title",
      className: u("typo-label-md", a, e),
      ...t
    }
  );
}
const yn = {
  error: "text-[var(--Text-Caution)]",
  "inline-caution": "text-[var(--Text-Caution)]",
  "inline-warning": "text-[var(--Text-Warning)]"
};
function rd({
  className: e,
  ...t
}) {
  const r = w.useContext(Bt), a = yn[r ?? ""] ?? "";
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
const lt = le(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap typo-label-md transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer",
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
        /**
         * Liquid Glass ボタン — iOS 26 スタイル。
         * 背景が透けるガラス素材。グラデーション・写真上に重ねて使う。
         * glass / glass-specular クラスは preset.css (styles/glass.css) で定義。
         */
        glass: "glass glass-specular text-[var(--Text-High-Emphasis)] active:opacity-55 rounded-full"
      },
      size: {
        xs: "h-6 px-2 typo-label-xs",
        sm: "h-8 px-3 typo-label-sm",
        default: "h-10 px-4 typo-label-md",
        lg: "h-12 px-6 typo-label-md",
        xl: "h-14 px-8 typo-label-lg",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
        /** iOS 26 ナビゲーションバー用の大判丸ボタン (44×44px, Apple HIG minimum tap target) */
        "icon-xl": "size-11"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
), wn = {
  light: 10,
  medium: 25,
  heavy: 50,
  warning: [30, 50, 30]
};
function Le({ className: e, variant: t, size: r, haptic: a, onClick: o, ...s }) {
  const l = w.useCallback(
    (i) => {
      a && typeof navigator < "u" && "vibrate" in navigator && navigator.vibrate(wn[a]), o?.(i);
    },
    [a, o]
  );
  return /* @__PURE__ */ n(
    "button",
    {
      "data-slot": "button",
      className: u(lt({ variant: t, size: r, className: e })),
      onClick: l,
      ...s
    }
  );
}
function ad({
  ...e
}) {
  return /* @__PURE__ */ n(ge.Root, { "data-slot": "alert-dialog", ...e });
}
function nd({
  ...e
}) {
  return /* @__PURE__ */ n(ge.Trigger, { "data-slot": "alert-dialog-trigger", ...e });
}
function kn({
  ...e
}) {
  return /* @__PURE__ */ n(ge.Portal, { "data-slot": "alert-dialog-portal", ...e });
}
function Nn({
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
function od({
  className: e,
  size: t = "default",
  ...r
}) {
  return /* @__PURE__ */ f(kn, { children: [
    /* @__PURE__ */ n(Nn, {}),
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
function sd({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "alert-dialog-header",
      className: u("flex flex-col gap-2 text-center sm:text-left", e),
      ...t
    }
  );
}
function id({ className: e, ...t }) {
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
function ld({
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
function cd({
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
function dd({
  className: e,
  variant: t = "default",
  size: r = "default",
  ...a
}) {
  return /* @__PURE__ */ n(
    ge.Action,
    {
      "data-slot": "alert-dialog-action",
      className: u(lt({ variant: t, size: r }), e),
      ...a
    }
  );
}
function ud({
  className: e,
  variant: t = "tertiary",
  size: r = "default",
  ...a
}) {
  return /* @__PURE__ */ n(
    ge.Cancel,
    {
      "data-slot": "alert-dialog-cancel",
      className: u(lt({ variant: t, size: r }), e),
      ...a
    }
  );
}
function Mn({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    Dt.Root,
    {
      "data-slot": "avatar",
      className: u("relative flex size-10 shrink-0 overflow-hidden rounded-full", e),
      ...t
    }
  );
}
function Sn({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    Dt.Image,
    {
      "data-slot": "avatar-image",
      className: u("aspect-square size-full", e),
      ...t
    }
  );
}
function Cn({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    Dt.Fallback,
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
const Tn = le(
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
function fd({
  className: e,
  variant: t,
  ...r
}) {
  return /* @__PURE__ */ n(
    "span",
    {
      "data-slot": "badge",
      className: u(Tn({ variant: t }), e),
      ...r
    }
  );
}
function hd({ label: e = "パンくずリスト", ...t }) {
  return /* @__PURE__ */ n("nav", { "aria-label": e, "data-slot": "breadcrumb", ...t });
}
function md({ className: e, ...t }) {
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
function pd({ className: e, ...t }) {
  return /* @__PURE__ */ n("li", { "data-slot": "breadcrumb-item", className: u("inline-flex items-center gap-1.5", e), ...t });
}
function vd({ className: e, ...t }) {
  return /* @__PURE__ */ n("a", { "data-slot": "breadcrumb-link", className: u("hover:text-[var(--Text-High-Emphasis)] transition-colors", e), ...t });
}
function bd({ className: e, ...t }) {
  return /* @__PURE__ */ n("span", { "data-slot": "breadcrumb-page", role: "link", "aria-disabled": "true", "aria-current": "page", className: u("text-[var(--Text-High-Emphasis)] typo-label-sm", e), ...t });
}
function gd({ children: e, className: t, ...r }) {
  return /* @__PURE__ */ n("li", { role: "presentation", "aria-hidden": "true", "data-slot": "breadcrumb-separator", className: u("[&>svg]:size-3.5", t), ...r, children: e ?? /* @__PURE__ */ n("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ n("path", { d: "M6 4L10 8L6 12", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }) });
}
function xd({ className: e, ...t }) {
  return /* @__PURE__ */ f("span", { role: "presentation", "aria-hidden": "true", "data-slot": "breadcrumb-ellipsis", className: u("flex size-9 items-center justify-center", e), ...t, children: [
    /* @__PURE__ */ f("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", children: [
      /* @__PURE__ */ n("circle", { cx: "3", cy: "8", r: "1", fill: "currentColor" }),
      /* @__PURE__ */ n("circle", { cx: "8", cy: "8", r: "1", fill: "currentColor" }),
      /* @__PURE__ */ n("circle", { cx: "13", cy: "8", r: "1", fill: "currentColor" })
    ] }),
    /* @__PURE__ */ n("span", { className: "sr-only", children: "その他" })
  ] });
}
function yd({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "card",
      className: u(
        "bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)] flex flex-col gap-6 rounded-lg border border-[var(--Border-Low-Emphasis)] p-6 shadow-[var(--shadow-md)]",
        "@container",
        e
      ),
      ...t
    }
  );
}
function wd({ className: e, ...t }) {
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
function kd({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "card-title",
      className: u("typo-heading-lg", e),
      ...t
    }
  );
}
function Nd({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "card-description",
      className: u("typo-body-sm text-[var(--Text-Medium-Emphasis)]", e),
      ...t
    }
  );
}
function Md({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "card-action",
      className: u("@sm:ml-auto", e),
      ...t
    }
  );
}
function Sd({ className: e, ...t }) {
  return /* @__PURE__ */ n("div", { "data-slot": "card-content", className: u("", e), ...t });
}
function Cd({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "card-footer",
      className: u("flex items-center gap-2", e),
      ...t
    }
  );
}
function En({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    Oe.Root,
    {
      "data-slot": "checkbox",
      className: u(
        "peer size-5 shrink-0 rounded-[5px] border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)]",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-[var(--Brand-Primary)] data-[state=checked]:text-[var(--Text-on-Inverse)] data-[state=checked]:border-[var(--Brand-Primary)]",
        e
      ),
      ...t,
      children: /* @__PURE__ */ n(
        Oe.Indicator,
        {
          "data-slot": "checkbox-indicator",
          className: "flex items-center justify-center text-current",
          children: /* @__PURE__ */ n("svg", { width: "12", height: "12", viewBox: "0 0 12 12", fill: "none", children: /* @__PURE__ */ n("path", { d: "M10 3L4.5 8.5L2 6", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) })
        }
      )
    }
  );
}
function Td({
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
function Ed({
  className: e,
  children: t,
  description: r,
  expandedContent: a,
  badge: o,
  ...s
}) {
  return /* @__PURE__ */ f(
    Oe.Root,
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
              children: /* @__PURE__ */ n(Oe.Indicator, { className: "flex items-center justify-center", children: /* @__PURE__ */ n(
                Lr,
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
function Wr({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ n(
    on.Root,
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
function Dd({
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
function Pd({
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
          Oe.Root,
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
            children: /* @__PURE__ */ n(Oe.Indicator, { className: "flex items-center justify-center", children: /* @__PURE__ */ n(
              Lr,
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
            Wr,
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
function Bd({
  ...e
}) {
  return /* @__PURE__ */ n(Pt.Root, { "data-slot": "collapsible", ...e });
}
function Od({
  ...e
}) {
  return /* @__PURE__ */ n(
    Pt.CollapsibleTrigger,
    {
      "data-slot": "collapsible-trigger",
      ...e
    }
  );
}
function Ld({
  ...e
}) {
  return /* @__PURE__ */ n(
    Pt.CollapsibleContent,
    {
      "data-slot": "collapsible-content",
      ...e
    }
  );
}
function Dn({ ...e }) {
  return /* @__PURE__ */ n(q.Root, { "data-slot": "dialog", ...e });
}
function Pn({ ...e }) {
  return /* @__PURE__ */ n(q.Trigger, { "data-slot": "dialog-trigger", ...e });
}
function Bn({ ...e }) {
  return /* @__PURE__ */ n(q.Portal, { "data-slot": "dialog-portal", ...e });
}
function On({ ...e }) {
  return /* @__PURE__ */ n(q.Close, { "data-slot": "dialog-close", ...e });
}
function Ln({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    q.Overlay,
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
function Wn({ className: e, children: t, ...r }) {
  return /* @__PURE__ */ f(Bn, { children: [
    /* @__PURE__ */ n(Ln, {}),
    /* @__PURE__ */ n(
      q.Content,
      {
        "data-slot": "dialog-content",
        className: u(
          "fixed left-[50%] top-[50%] z-50 w-full max-w-[480px] translate-x-[-50%] translate-y-[-50%]",
          "rounded-lg bg-[var(--Surface-Primary)] p-6 shadow-[var(--shadow-dialog)]",
          "inset-x-6 mx-auto",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          e
        ),
        ...r,
        children: t
      }
    )
  ] });
}
function In({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "dialog-header",
      className: u("flex flex-col gap-2", e),
      ...t
    }
  );
}
function Hn({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "dialog-footer",
      className: u("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", e),
      ...t
    }
  );
}
function jn({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    q.Title,
    {
      "data-slot": "dialog-title",
      className: u("typo-heading-lg text-[var(--Text-High-Emphasis)]", e),
      ...t
    }
  );
}
function Fn({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    q.Description,
    {
      "data-slot": "dialog-description",
      className: u("typo-body-md text-[var(--Text-Medium-Emphasis)]", e),
      ...t
    }
  );
}
var An = (e) => e.type === "checkbox", je = (e) => e instanceof Date, Ot = (e) => e == null;
const Ir = (e) => typeof e == "object";
var Ce = (e) => !Ot(e) && !Array.isArray(e) && Ir(e) && !je(e), _n = (e) => Ce(e) && e.target ? An(e.target) ? e.target.checked : e.target.value : e, zn = (e, t) => t.split(".").some((r, a, o) => !isNaN(Number(r)) && e.has(o.slice(0, a).join("."))), Yn = (e) => {
  const t = e.constructor && e.constructor.prototype;
  return Ce(t) && t.hasOwnProperty("isPrototypeOf");
}, $n = typeof window < "u" && typeof window.HTMLElement < "u" && typeof document < "u";
function Hr(e) {
  if (e instanceof Date)
    return new Date(e);
  const t = typeof FileList < "u" && e instanceof FileList;
  if ($n && (e instanceof Blob || t))
    return e;
  const r = Array.isArray(e);
  if (!r && !(Ce(e) && Yn(e)))
    return e;
  const a = r ? [] : Object.create(Object.getPrototypeOf(e));
  for (const o in e)
    Object.prototype.hasOwnProperty.call(e, o) && (a[o] = Hr(e[o]));
  return a;
}
var jr = (e) => /^\w*$/.test(e), Tt = (e) => e === void 0, Rn = (e) => Array.isArray(e) ? e.filter(Boolean) : [], Fr = (e) => Rn(e.replace(/["|']|\]/g, "").split(/\.|\[/)), Z = (e, t, r) => {
  if (!t || !Ce(e))
    return r;
  const o = (jr(t) ? [t] : Fr(t)).reduce((s, l) => Ot(s) ? void 0 : s[l], e);
  return Tt(o) || o === e ? Tt(e[t]) ? r : e[t] : o;
}, xt = (e) => typeof e == "boolean", tt = (e) => typeof e == "function", rr = (e, t, r) => {
  let a = -1;
  const o = jr(t) ? [t] : Fr(t), s = o.length, l = s - 1;
  for (; ++a < s; ) {
    const i = o[a];
    let c = r;
    if (a !== l) {
      const d = e[i];
      c = Ce(d) || Array.isArray(d) ? d : isNaN(+o[a + 1]) ? {} : [];
    }
    if (i === "__proto__" || i === "constructor" || i === "prototype")
      return;
    e[i] = c, e = e[i];
  }
};
const ar = {
  BLUR: "blur",
  CHANGE: "change"
}, nr = {
  all: "all"
}, Lt = N.createContext(null);
Lt.displayName = "HookFormControlContext";
const Wt = () => N.useContext(Lt);
var Vn = (e, t, r, a = !0) => {
  const o = {};
  for (const s in e)
    Object.defineProperty(o, s, {
      get: () => {
        const l = s;
        return t._proxyFormState[l] !== nr.all && (t._proxyFormState[l] = !a || nr.all), r && (r[l] = !0), e[l];
      }
    });
  return o;
};
const Ar = typeof window < "u" ? N.useLayoutEffect : N.useEffect;
function _r(e) {
  const t = Wt(), { control: r = t, disabled: a, name: o, exact: s } = e || {}, [l, i] = N.useState(() => ({
    ...r._formState,
    defaultValues: r._defaultValues
  })), c = N.useRef({
    isDirty: !1,
    isLoading: !1,
    dirtyFields: !1,
    touchedFields: !1,
    validatingFields: !1,
    isValidating: !1,
    isValid: !1,
    errors: !1
  });
  return Ar(() => r._subscribe({
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
  }), [o, a, s]), N.useEffect(() => {
    c.current.isValid && r._setValid(!0);
  }, [r]), N.useMemo(() => Vn(l, r, c.current, !1), [l, r]);
}
var qn = (e) => typeof e == "string", or = (e, t, r, a, o) => qn(e) ? Z(r, e, o) : Array.isArray(e) ? e.map((s) => Z(r, s)) : r, sr = (e) => Ot(e) || !Ir(e);
function nt(e, t, r = /* @__PURE__ */ new WeakSet()) {
  if (e === t)
    return !0;
  if (sr(e) || sr(t))
    return Object.is(e, t);
  if (je(e) && je(t))
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
      if (je(l) && je(i) || (Ce(l) || Array.isArray(l)) && (Ce(i) || Array.isArray(i)) ? !nt(l, i, r) : !Object.is(l, i))
        return !1;
    }
  }
  return !0;
}
function Gn(e) {
  const t = Wt(), { control: r = t, name: a, defaultValue: o, disabled: s, exact: l, compute: i } = e || {}, c = N.useRef(o), d = N.useRef(i), h = N.useRef(void 0), m = N.useRef(r), p = N.useRef(a);
  d.current = i;
  const [v, x] = N.useState(() => {
    const k = r._getWatch(a, c.current);
    return d.current ? d.current(k) : k;
  }), g = N.useCallback((k) => {
    const C = or(a, r._names, k || r._formValues, !1, c.current);
    return d.current ? d.current(C) : C;
  }, [r._formValues, r._names, a]), y = N.useCallback((k) => {
    if (!s) {
      const C = or(a, r._names, k || r._formValues, !1, c.current);
      if (d.current) {
        const S = d.current(C);
        nt(S, h.current) || (x(S), h.current = S);
      } else
        x(C);
    }
  }, [r._formValues, r._names, s, a]);
  Ar(() => ((m.current !== r || !nt(p.current, a)) && (m.current = r, p.current = a, y()), r._subscribe({
    name: a,
    formState: {
      values: !0
    },
    exact: l,
    callback: (k) => {
      y(k.values);
    }
  })), [r, l, a, y]), N.useEffect(() => r._removeUnmounted());
  const b = m.current !== r, M = p.current, T = N.useMemo(() => {
    if (s)
      return null;
    const k = !b && !nt(M, a);
    return b || k ? g() : null;
  }, [s, b, a, M, g]);
  return T !== null ? T : v;
}
function Un(e) {
  const t = Wt(), { name: r, disabled: a, control: o = t, shouldUnregister: s, defaultValue: l, exact: i = !0 } = e, c = zn(o._names.array, r), d = N.useMemo(() => Z(o._formValues, r, Z(o._defaultValues, r, l)), [o, r, l]), h = Gn({
    control: o,
    name: r,
    defaultValue: d,
    exact: i
  }), m = _r({
    control: o,
    name: r,
    exact: i
  }), p = N.useRef(e), v = N.useRef(o.register(r, {
    ...e.rules,
    value: h,
    ...xt(e.disabled) ? { disabled: e.disabled } : {}
  }));
  p.current = e;
  const x = N.useMemo(() => Object.defineProperties({}, {
    invalid: {
      enumerable: !0,
      get: () => !!Z(m.errors, r)
    },
    isDirty: {
      enumerable: !0,
      get: () => !!Z(m.dirtyFields, r)
    },
    isTouched: {
      enumerable: !0,
      get: () => !!Z(m.touchedFields, r)
    },
    isValidating: {
      enumerable: !0,
      get: () => !!Z(m.validatingFields, r)
    },
    error: {
      enumerable: !0,
      get: () => Z(m.errors, r)
    }
  }), [m, r]), g = N.useCallback((T) => v.current.onChange({
    target: {
      value: _n(T),
      name: r
    },
    type: ar.CHANGE
  }), [r]), y = N.useCallback(() => v.current.onBlur({
    target: {
      value: Z(o._formValues, r),
      name: r
    },
    type: ar.BLUR
  }), [r, o._formValues]), b = N.useCallback((T) => {
    const k = Z(o._fields, r);
    k && k._f && T && (k._f.ref = {
      focus: () => tt(T.focus) && T.focus(),
      select: () => tt(T.select) && T.select(),
      setCustomValidity: (C) => tt(T.setCustomValidity) && T.setCustomValidity(C),
      reportValidity: () => tt(T.reportValidity) && T.reportValidity()
    });
  }, [o._fields, r]), M = N.useMemo(() => ({
    name: r,
    value: h,
    ...xt(a) || m.disabled ? { disabled: m.disabled || a } : {},
    onChange: g,
    onBlur: y,
    ref: b
  }), [r, a, m.disabled, g, y, b, h]);
  return N.useEffect(() => {
    const T = o._options.shouldUnregister || s;
    o.register(r, {
      ...p.current.rules,
      ...xt(p.current.disabled) ? { disabled: p.current.disabled } : {}
    });
    const k = (C, S) => {
      const E = Z(o._fields, C);
      E && E._f && (E._f.mount = S);
    };
    if (k(r, !0), T) {
      const C = Hr(Z(o._options.defaultValues, r, p.current.defaultValue));
      rr(o._defaultValues, r, C), Tt(Z(o._formValues, r)) && rr(o._formValues, r, C);
    }
    return !c && o.register(r), () => {
      (c ? T && !o._state.action : T) ? o.unregister(r) : k(r, !1);
    };
  }, [r, o, c, s]), N.useEffect(() => {
    o._setDisabledField({
      disabled: a,
      name: r
    });
  }, [a, r, o]), N.useMemo(() => ({
    field: M,
    formState: m,
    fieldState: x
  }), [M, m, x]);
}
const Xn = (e) => e.render(Un(e)), It = N.createContext(null);
It.displayName = "HookFormContext";
const Qn = () => N.useContext(It), Zn = (e) => {
  const { children: t, watch: r, getValues: a, getFieldState: o, setError: s, clearErrors: l, setValue: i, setValues: c, trigger: d, formState: h, resetField: m, reset: p, handleSubmit: v, unregister: x, control: g, register: y, setFocus: b, subscribe: M } = e, T = N.useMemo(() => ({
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
    unregister: x,
    control: g,
    register: y,
    setFocus: b,
    subscribe: M
  }), [
    l,
    g,
    h,
    o,
    a,
    v,
    y,
    p,
    m,
    s,
    b,
    i,
    c,
    M,
    d,
    x,
    r
  ]);
  return N.createElement(
    It.Provider,
    { value: T },
    N.createElement(Lt.Provider, { value: T.control }, t)
  );
}, Wd = Zn, zr = w.createContext(
  {}
);
function Id({ ...e }) {
  return /* @__PURE__ */ n(zr.Provider, { value: { name: e.name }, children: /* @__PURE__ */ n(Xn, { ...e }) });
}
const ct = () => {
  const e = w.useContext(zr), t = w.useContext(Yr), { getFieldState: r } = Qn(), a = _r({ name: e.name }), o = r(e.name, a);
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
}, Yr = w.createContext(
  {}
);
function Hd({ className: e, ...t }) {
  const r = w.useId();
  return /* @__PURE__ */ n(Yr.Provider, { value: { id: r }, children: /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "form-item",
      className: u("grid gap-2", e),
      ...t
    }
  ) });
}
function jd({
  className: e,
  required: t,
  children: r,
  ...a
}) {
  const { error: o, formItemId: s } = ct();
  return /* @__PURE__ */ f(
    Wr,
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
function Fd({ ...e }) {
  const { error: t, formItemId: r, formDescriptionId: a, formMessageId: o } = ct();
  return /* @__PURE__ */ n(
    mn,
    {
      "data-slot": "form-control",
      id: r,
      "aria-describedby": t ? `${a} ${o}` : `${a}`,
      "aria-invalid": !!t,
      ...e
    }
  );
}
function Ad({ className: e, ...t }) {
  const { formDescriptionId: r } = ct();
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
function _d({ className: e, ...t }) {
  const { error: r, formMessageId: a } = ct(), o = r ? String(r?.message ?? "") : t.children;
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
function Kn({ className: e }) {
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
function Jn({ className: e }) {
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
function eo({ className: e }) {
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
function zd({
  ...e
}) {
  return /* @__PURE__ */ n(V.Root, { "data-slot": "dropdown-menu", ...e });
}
function Yd({
  ...e
}) {
  return /* @__PURE__ */ n(V.Portal, { "data-slot": "dropdown-menu-portal", ...e });
}
function $d({
  ...e
}) {
  return /* @__PURE__ */ n(
    V.Trigger,
    {
      "data-slot": "dropdown-menu-trigger",
      ...e
    }
  );
}
function Rd({
  className: e,
  sideOffset: t = 4,
  ...r
}) {
  return /* @__PURE__ */ n(V.Portal, { children: /* @__PURE__ */ n(
    V.Content,
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
function Vd({
  ...e
}) {
  return /* @__PURE__ */ n(V.Group, { "data-slot": "dropdown-menu-group", ...e });
}
function qd({
  className: e,
  inset: t,
  variant: r = "default",
  ...a
}) {
  return /* @__PURE__ */ n(
    V.Item,
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
function Gd({
  className: e,
  children: t,
  checked: r,
  ...a
}) {
  return /* @__PURE__ */ f(
    V.CheckboxItem,
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
        /* @__PURE__ */ n("span", { className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ n(V.ItemIndicator, { children: /* @__PURE__ */ n(Kn, {}) }) }),
        t
      ]
    }
  );
}
function Ud({
  ...e
}) {
  return /* @__PURE__ */ n(
    V.RadioGroup,
    {
      "data-slot": "dropdown-menu-radio-group",
      ...e
    }
  );
}
function Xd({
  className: e,
  children: t,
  ...r
}) {
  return /* @__PURE__ */ f(
    V.RadioItem,
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
        /* @__PURE__ */ n("span", { className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ n(V.ItemIndicator, { children: /* @__PURE__ */ n(eo, {}) }) }),
        t
      ]
    }
  );
}
function Qd({
  className: e,
  inset: t,
  ...r
}) {
  return /* @__PURE__ */ n(
    V.Label,
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
function Zd({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ n(
    V.Separator,
    {
      "data-slot": "dropdown-menu-separator",
      className: u("-mx-1 my-1 h-px bg-[var(--Border-Low-Emphasis)]", e),
      ...t
    }
  );
}
function Kd({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    "span",
    {
      "data-slot": "dropdown-menu-shortcut",
      className: u("ml-auto typo-body-xs text-[var(--Text-Low-Emphasis)]", e),
      ...t
    }
  );
}
function Jd({
  ...e
}) {
  return /* @__PURE__ */ n(V.Sub, { "data-slot": "dropdown-menu-sub", ...e });
}
function eu({
  className: e,
  inset: t,
  children: r,
  ...a
}) {
  return /* @__PURE__ */ f(
    V.SubTrigger,
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
        /* @__PURE__ */ n(Jn, { className: "ml-auto" })
      ]
    }
  );
}
function tu({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ n(
    V.SubContent,
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
function ru({
  openDelay: e = 200,
  closeDelay: t = 100,
  ...r
}) {
  return /* @__PURE__ */ n(
    st.Root,
    {
      "data-slot": "hover-card",
      openDelay: e,
      closeDelay: t,
      ...r
    }
  );
}
function au({
  ...e
}) {
  return /* @__PURE__ */ n(st.Trigger, { "data-slot": "hover-card-trigger", ...e });
}
function nu({
  className: e,
  align: t = "center",
  sideOffset: r = 4,
  ...a
}) {
  return /* @__PURE__ */ n(st.Portal, { "data-slot": "hover-card-portal", children: /* @__PURE__ */ n(
    st.Content,
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
const ir = [
  "flex h-12 w-full rounded-lg border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] px-3 typo-body-md text-[var(--Text-High-Emphasis)] transition-colors",
  "file:border-0 file:bg-transparent file:typo-body-md",
  "placeholder:text-[var(--Text-Low-Emphasis)]",
  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50 focus-visible:border-[var(--Border-Accent-Primary)]",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "aria-invalid:border-[var(--Border-Caution)] aria-invalid:ring-[var(--Caution-Base)]/20"
].join(" ");
function ou({ className: e, type: t, startAdornment: r, endAdornment: a, ...o }) {
  return !r && !a ? /* @__PURE__ */ n(
    "input",
    {
      type: t,
      "data-slot": "input",
      className: u(ir, e),
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
          ir,
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
function to(e, t, r = "long") {
  return new Intl.DateTimeFormat("en-US", {
    // Enforces engine to render the time. Without the option JavaScriptCore omits it.
    hour: "numeric",
    timeZone: e,
    timeZoneName: r
  }).format(t).split(/\s/g).slice(2).join(" ");
}
const ro = {}, Fe = {};
function Me(e, t) {
  try {
    const a = (ro[e] ||= new Intl.DateTimeFormat("en-US", {
      timeZone: e,
      timeZoneName: "longOffset"
    }).format)(t).split("GMT")[1];
    return a in Fe ? Fe[a] : lr(a, a.split(":"));
  } catch {
    if (e in Fe) return Fe[e];
    const r = e?.match(ao);
    return r ? lr(e, r.slice(1)) : NaN;
  }
}
const ao = /([+-]\d\d):?(\d\d)?/;
function lr(e, t) {
  const r = +(t[0] || 0), a = +(t[1] || 0), o = +(t[2] || 0) / 60;
  return Fe[e] = r * 60 + a > 0 ? r * 60 + a + o : r * 60 - a - o;
}
class he extends Date {
  //#region static
  constructor(...t) {
    super(), t.length > 1 && typeof t[t.length - 1] == "string" && (this.timeZone = t.pop()), this.internal = /* @__PURE__ */ new Date(), isNaN(Me(this.timeZone, this)) ? this.setTime(NaN) : t.length ? typeof t[0] == "number" && (t.length === 1 || t.length === 2 && typeof t[1] != "number") ? this.setTime(t[0]) : typeof t[0] == "string" ? this.setTime(+new Date(t[0])) : t[0] instanceof Date ? this.setTime(+t[0]) : (this.setTime(+new Date(...t)), $r(this), Et(this)) : this.setTime(Date.now());
  }
  static tz(t, ...r) {
    return r.length ? new he(...r, t) : new he(Date.now(), t);
  }
  //#endregion
  //#region time zone
  withTimeZone(t) {
    return new he(+this, t);
  }
  getTimezoneOffset() {
    const t = -Me(this.timeZone, this);
    return t > 0 ? Math.floor(t) : Math.ceil(t);
  }
  //#endregion
  //#region time
  setTime(t) {
    return Date.prototype.setTime.apply(this, arguments), Et(this), +this;
  }
  //#endregion
  //#region date-fns integration
  [/* @__PURE__ */ Symbol.for("constructDateFrom")](t) {
    return new he(+new Date(t), this.timeZone);
  }
  //#endregion
}
const cr = /^(get|set)(?!UTC)/;
Object.getOwnPropertyNames(Date.prototype).forEach((e) => {
  if (!cr.test(e)) return;
  const t = e.replace(cr, "$1UTC");
  he.prototype[t] && (e.startsWith("get") ? he.prototype[e] = function() {
    return this.internal[t]();
  } : (he.prototype[e] = function() {
    return Date.prototype[t].apply(this.internal, arguments), no(this), +this;
  }, he.prototype[t] = function() {
    return Date.prototype[t].apply(this, arguments), Et(this), +this;
  }));
});
function Et(e) {
  e.internal.setTime(+e), e.internal.setUTCSeconds(e.internal.getUTCSeconds() - Math.round(-Me(e.timeZone, e) * 60));
}
function no(e) {
  Date.prototype.setFullYear.call(e, e.internal.getUTCFullYear(), e.internal.getUTCMonth(), e.internal.getUTCDate()), Date.prototype.setHours.call(e, e.internal.getUTCHours(), e.internal.getUTCMinutes(), e.internal.getUTCSeconds(), e.internal.getUTCMilliseconds()), $r(e);
}
function $r(e) {
  const t = Me(e.timeZone, e), r = t > 0 ? Math.floor(t) : Math.ceil(t), a = /* @__PURE__ */ new Date(+e);
  a.setUTCHours(a.getUTCHours() - 1);
  const o = -(/* @__PURE__ */ new Date(+e)).getTimezoneOffset(), s = -(/* @__PURE__ */ new Date(+a)).getTimezoneOffset(), l = o - s, i = Date.prototype.getHours.apply(e) !== e.internal.getUTCHours();
  l && i && e.internal.setUTCMinutes(e.internal.getUTCMinutes() + l);
  const c = o - r;
  c && Date.prototype.setUTCMinutes.call(e, Date.prototype.getUTCMinutes.call(e) + c);
  const d = /* @__PURE__ */ new Date(+e);
  d.setUTCSeconds(0);
  const h = o > 0 ? d.getSeconds() : (d.getSeconds() - 60) % 60, m = Math.round(-(Me(e.timeZone, e) * 60)) % 60;
  (m || h) && (e.internal.setUTCSeconds(e.internal.getUTCSeconds() + m), Date.prototype.setUTCSeconds.call(e, Date.prototype.getUTCSeconds.call(e) + m + h));
  const p = Me(e.timeZone, e), v = p > 0 ? Math.floor(p) : Math.ceil(p), g = -(/* @__PURE__ */ new Date(+e)).getTimezoneOffset() - v, y = v !== r, b = g - c;
  if (y && b) {
    Date.prototype.setUTCMinutes.call(e, Date.prototype.getUTCMinutes.call(e) + b);
    const M = Me(e.timeZone, e), T = M > 0 ? Math.floor(M) : Math.ceil(M), k = v - T;
    k && (e.internal.setUTCMinutes(e.internal.getUTCMinutes() + k), Date.prototype.setUTCMinutes.call(e, Date.prototype.getUTCMinutes.call(e) + k));
  }
}
class G extends he {
  //#region static
  static tz(t, ...r) {
    return r.length ? new G(...r, t) : new G(Date.now(), t);
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
    return `${t} GMT${r}${a}${o} (${to(this.timeZone, this)})`;
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
    return new G(+this, t);
  }
  //#region date-fns integration
  [/* @__PURE__ */ Symbol.for("constructDateFrom")](t) {
    return new G(+new Date(t), this.timeZone);
  }
  //#endregion
}
const Rr = 6048e5, oo = 864e5, dr = /* @__PURE__ */ Symbol.for("constructDateFrom");
function Y(e, t) {
  return typeof e == "function" ? e(t) : e && typeof e == "object" && dr in e ? e[dr](t) : e instanceof Date ? new e.constructor(t) : new Date(t);
}
function _(e, t) {
  return Y(t || e, e);
}
function Vr(e, t, r) {
  const a = _(e, r?.in);
  return isNaN(t) ? Y(e, NaN) : (t && a.setDate(a.getDate() + t), a);
}
function qr(e, t, r) {
  const a = _(e, r?.in);
  if (isNaN(t)) return Y(e, NaN);
  if (!t)
    return a;
  const o = a.getDate(), s = Y(e, a.getTime());
  s.setMonth(a.getMonth() + t + 1, 0);
  const l = s.getDate();
  return o >= l ? s : (a.setFullYear(
    s.getFullYear(),
    s.getMonth(),
    o
  ), a);
}
let so = {};
function qe() {
  return so;
}
function We(e, t) {
  const r = qe(), a = t?.weekStartsOn ?? t?.locale?.options?.weekStartsOn ?? r.weekStartsOn ?? r.locale?.options?.weekStartsOn ?? 0, o = _(e, t?.in), s = o.getDay(), l = (s < a ? 7 : 0) + s - a;
  return o.setDate(o.getDate() - l), o.setHours(0, 0, 0, 0), o;
}
function Re(e, t) {
  return We(e, { ...t, weekStartsOn: 1 });
}
function Gr(e, t) {
  const r = _(e, t?.in), a = r.getFullYear(), o = Y(r, 0);
  o.setFullYear(a + 1, 0, 4), o.setHours(0, 0, 0, 0);
  const s = Re(o), l = Y(r, 0);
  l.setFullYear(a, 0, 4), l.setHours(0, 0, 0, 0);
  const i = Re(l);
  return r.getTime() >= s.getTime() ? a + 1 : r.getTime() >= i.getTime() ? a : a - 1;
}
function ur(e) {
  const t = _(e), r = new Date(
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
function Ie(e, ...t) {
  const r = Y.bind(
    null,
    t.find((a) => typeof a == "object")
  );
  return t.map(r);
}
function Ve(e, t) {
  const r = _(e, t?.in);
  return r.setHours(0, 0, 0, 0), r;
}
function Ht(e, t, r) {
  const [a, o] = Ie(
    r?.in,
    e,
    t
  ), s = Ve(a), l = Ve(o), i = +s - ur(s), c = +l - ur(l);
  return Math.round((i - c) / oo);
}
function io(e, t) {
  const r = Gr(e, t), a = Y(e, 0);
  return a.setFullYear(r, 0, 4), a.setHours(0, 0, 0, 0), Re(a);
}
function lo(e, t, r) {
  return Vr(e, t * 7, r);
}
function co(e, t, r) {
  return qr(e, t * 12, r);
}
function uo(e, t) {
  let r, a = t?.in;
  return e.forEach((o) => {
    !a && typeof o == "object" && (a = Y.bind(null, o));
    const s = _(o, a);
    (!r || r < s || isNaN(+s)) && (r = s);
  }), Y(a, r || NaN);
}
function fo(e, t) {
  let r, a = t?.in;
  return e.forEach((o) => {
    !a && typeof o == "object" && (a = Y.bind(null, o));
    const s = _(o, a);
    (!r || r > s || isNaN(+s)) && (r = s);
  }), Y(a, r || NaN);
}
function ho(e, t, r) {
  const [a, o] = Ie(
    r?.in,
    e,
    t
  );
  return +Ve(a) == +Ve(o);
}
function Ur(e) {
  return e instanceof Date || typeof e == "object" && Object.prototype.toString.call(e) === "[object Date]";
}
function mo(e) {
  return !(!Ur(e) && typeof e != "number" || isNaN(+_(e)));
}
function Xr(e, t, r) {
  const [a, o] = Ie(
    r?.in,
    e,
    t
  ), s = a.getFullYear() - o.getFullYear(), l = a.getMonth() - o.getMonth();
  return s * 12 + l;
}
function po(e, t) {
  const r = _(e, t?.in), a = r.getMonth();
  return r.setFullYear(r.getFullYear(), a + 1, 0), r.setHours(23, 59, 59, 999), r;
}
function Qr(e, t) {
  const [r, a] = Ie(e, t.start, t.end);
  return { start: r, end: a };
}
function vo(e, t) {
  const { start: r, end: a } = Qr(t?.in, e);
  let o = +r > +a;
  const s = o ? +r : +a, l = o ? a : r;
  l.setHours(0, 0, 0, 0), l.setDate(1);
  let i = 1;
  const c = [];
  for (; +l <= s; )
    c.push(Y(r, l)), l.setMonth(l.getMonth() + i);
  return o ? c.reverse() : c;
}
function bo(e, t) {
  const r = _(e, t?.in);
  return r.setDate(1), r.setHours(0, 0, 0, 0), r;
}
function go(e, t) {
  const r = _(e, t?.in), a = r.getFullYear();
  return r.setFullYear(a + 1, 0, 0), r.setHours(23, 59, 59, 999), r;
}
function Zr(e, t) {
  const r = _(e, t?.in);
  return r.setFullYear(r.getFullYear(), 0, 1), r.setHours(0, 0, 0, 0), r;
}
function xo(e, t) {
  const { start: r, end: a } = Qr(t?.in, e);
  let o = +r > +a;
  const s = o ? +r : +a, l = o ? a : r;
  l.setHours(0, 0, 0, 0), l.setMonth(0, 1);
  let i = 1;
  const c = [];
  for (; +l <= s; )
    c.push(Y(r, l)), l.setFullYear(l.getFullYear() + i);
  return o ? c.reverse() : c;
}
function Kr(e, t) {
  const r = qe(), a = t?.weekStartsOn ?? t?.locale?.options?.weekStartsOn ?? r.weekStartsOn ?? r.locale?.options?.weekStartsOn ?? 0, o = _(e, t?.in), s = o.getDay(), l = (s < a ? -7 : 0) + 6 - (s - a);
  return o.setDate(o.getDate() + l), o.setHours(23, 59, 59, 999), o;
}
function yo(e, t) {
  return Kr(e, { ...t, weekStartsOn: 1 });
}
const wo = {
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
}, ko = (e, t, r) => {
  let a;
  const o = wo[e];
  return typeof o == "string" ? a = o : t === 1 ? a = o.one : a = o.other.replace("{{count}}", t.toString()), r?.addSuffix ? r.comparison && r.comparison > 0 ? "in " + a : a + " ago" : a;
};
function Be(e) {
  return (t = {}) => {
    const r = t.width ? String(t.width) : e.defaultWidth;
    return e.formats[r] || e.formats[e.defaultWidth];
  };
}
const No = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
}, Mo = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
}, So = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
}, Co = {
  date: Be({
    formats: No,
    defaultWidth: "full"
  }),
  time: Be({
    formats: Mo,
    defaultWidth: "full"
  }),
  dateTime: Be({
    formats: So,
    defaultWidth: "full"
  })
}, To = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
}, Eo = (e, t, r, a) => To[e];
function ue(e) {
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
const Do = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
}, Po = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
}, Bo = {
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
}, Oo = {
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
}, Lo = {
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
}, Wo = {
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
}, Io = (e, t) => {
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
}, Ho = {
  ordinalNumber: Io,
  era: ue({
    values: Do,
    defaultWidth: "wide"
  }),
  quarter: ue({
    values: Po,
    defaultWidth: "wide",
    argumentCallback: (e) => e - 1
  }),
  month: ue({
    values: Bo,
    defaultWidth: "wide"
  }),
  day: ue({
    values: Oo,
    defaultWidth: "wide"
  }),
  dayPeriod: ue({
    values: Lo,
    defaultWidth: "wide",
    formattingValues: Wo,
    defaultFormattingWidth: "wide"
  })
};
function fe(e) {
  return (t, r = {}) => {
    const a = r.width, o = a && e.matchPatterns[a] || e.matchPatterns[e.defaultMatchWidth], s = t.match(o);
    if (!s)
      return null;
    const l = s[0], i = a && e.parsePatterns[a] || e.parsePatterns[e.defaultParseWidth], c = Array.isArray(i) ? Fo(i, (m) => m.test(l)) : (
      // [TODO] -- I challenge you to fix the type
      jo(i, (m) => m.test(l))
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
function jo(e, t) {
  for (const r in e)
    if (Object.prototype.hasOwnProperty.call(e, r) && t(e[r]))
      return r;
}
function Fo(e, t) {
  for (let r = 0; r < e.length; r++)
    if (t(e[r]))
      return r;
}
function Jr(e) {
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
const Ao = /^(\d+)(th|st|nd|rd)?/i, _o = /\d+/i, zo = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
}, Yo = {
  any: [/^b/i, /^(a|c)/i]
}, $o = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
}, Ro = {
  any: [/1/i, /2/i, /3/i, /4/i]
}, Vo = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
}, qo = {
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
}, Go = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
}, Uo = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
}, Xo = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
}, Qo = {
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
}, Zo = {
  ordinalNumber: Jr({
    matchPattern: Ao,
    parsePattern: _o,
    valueCallback: (e) => parseInt(e, 10)
  }),
  era: fe({
    matchPatterns: zo,
    defaultMatchWidth: "wide",
    parsePatterns: Yo,
    defaultParseWidth: "any"
  }),
  quarter: fe({
    matchPatterns: $o,
    defaultMatchWidth: "wide",
    parsePatterns: Ro,
    defaultParseWidth: "any",
    valueCallback: (e) => e + 1
  }),
  month: fe({
    matchPatterns: Vo,
    defaultMatchWidth: "wide",
    parsePatterns: qo,
    defaultParseWidth: "any"
  }),
  day: fe({
    matchPatterns: Go,
    defaultMatchWidth: "wide",
    parsePatterns: Uo,
    defaultParseWidth: "any"
  }),
  dayPeriod: fe({
    matchPatterns: Xo,
    defaultMatchWidth: "any",
    parsePatterns: Qo,
    defaultParseWidth: "any"
  })
}, Pe = {
  code: "en-US",
  formatDistance: ko,
  formatLong: Co,
  formatRelative: Eo,
  localize: Ho,
  match: Zo,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
function Ko(e, t) {
  const r = _(e, t?.in);
  return Ht(r, Zr(r)) + 1;
}
function jt(e, t) {
  const r = _(e, t?.in), a = +Re(r) - +io(r);
  return Math.round(a / Rr) + 1;
}
function ea(e, t) {
  const r = _(e, t?.in), a = r.getFullYear(), o = qe(), s = t?.firstWeekContainsDate ?? t?.locale?.options?.firstWeekContainsDate ?? o.firstWeekContainsDate ?? o.locale?.options?.firstWeekContainsDate ?? 1, l = Y(t?.in || e, 0);
  l.setFullYear(a + 1, 0, s), l.setHours(0, 0, 0, 0);
  const i = We(l, t), c = Y(t?.in || e, 0);
  c.setFullYear(a, 0, s), c.setHours(0, 0, 0, 0);
  const d = We(c, t);
  return +r >= +i ? a + 1 : +r >= +d ? a : a - 1;
}
function Jo(e, t) {
  const r = qe(), a = t?.firstWeekContainsDate ?? t?.locale?.options?.firstWeekContainsDate ?? r.firstWeekContainsDate ?? r.locale?.options?.firstWeekContainsDate ?? 1, o = ea(e, t), s = Y(t?.in || e, 0);
  return s.setFullYear(o, 0, a), s.setHours(0, 0, 0, 0), We(s, t);
}
function Ft(e, t) {
  const r = _(e, t?.in), a = +We(r, t) - +Jo(r, t);
  return Math.round(a / Rr) + 1;
}
function A(e, t) {
  const r = e < 0 ? "-" : "", a = Math.abs(e).toString().padStart(t, "0");
  return r + a;
}
const ye = {
  // Year
  y(e, t) {
    const r = e.getFullYear(), a = r > 0 ? r : 1 - r;
    return A(t === "yy" ? a % 100 : a, t.length);
  },
  // Month
  M(e, t) {
    const r = e.getMonth();
    return t === "M" ? String(r + 1) : A(r + 1, 2);
  },
  // Day of the month
  d(e, t) {
    return A(e.getDate(), t.length);
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
    return A(e.getHours() % 12 || 12, t.length);
  },
  // Hour [0-23]
  H(e, t) {
    return A(e.getHours(), t.length);
  },
  // Minute
  m(e, t) {
    return A(e.getMinutes(), t.length);
  },
  // Second
  s(e, t) {
    return A(e.getSeconds(), t.length);
  },
  // Fraction of second
  S(e, t) {
    const r = t.length, a = e.getMilliseconds(), o = Math.trunc(
      a * Math.pow(10, r - 3)
    );
    return A(o, t.length);
  }
}, Ee = {
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
}, fr = {
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
    return ye.y(e, t);
  },
  // Local week-numbering year
  Y: function(e, t, r, a) {
    const o = ea(e, a), s = o > 0 ? o : 1 - o;
    if (t === "YY") {
      const l = s % 100;
      return A(l, 2);
    }
    return t === "Yo" ? r.ordinalNumber(s, { unit: "year" }) : A(s, t.length);
  },
  // ISO week-numbering year
  R: function(e, t) {
    const r = Gr(e);
    return A(r, t.length);
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
    return A(r, t.length);
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
        return A(a, 2);
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
        return A(a, 2);
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
        return ye.M(e, t);
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
        return A(a + 1, 2);
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
    const o = Ft(e, a);
    return t === "wo" ? r.ordinalNumber(o, { unit: "week" }) : A(o, t.length);
  },
  // ISO week of year
  I: function(e, t, r) {
    const a = jt(e);
    return t === "Io" ? r.ordinalNumber(a, { unit: "week" }) : A(a, t.length);
  },
  // Day of the month
  d: function(e, t, r) {
    return t === "do" ? r.ordinalNumber(e.getDate(), { unit: "date" }) : ye.d(e, t);
  },
  // Day of year
  D: function(e, t, r) {
    const a = Ko(e);
    return t === "Do" ? r.ordinalNumber(a, { unit: "dayOfYear" }) : A(a, t.length);
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
        return A(s, 2);
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
        return A(s, t.length);
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
        return A(o, t.length);
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
    switch (a === 12 ? o = Ee.noon : a === 0 ? o = Ee.midnight : o = a / 12 >= 1 ? "pm" : "am", t) {
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
    switch (a >= 17 ? o = Ee.evening : a >= 12 ? o = Ee.afternoon : a >= 4 ? o = Ee.morning : o = Ee.night, t) {
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
    return ye.h(e, t);
  },
  // Hour [0-23]
  H: function(e, t, r) {
    return t === "Ho" ? r.ordinalNumber(e.getHours(), { unit: "hour" }) : ye.H(e, t);
  },
  // Hour [0-11]
  K: function(e, t, r) {
    const a = e.getHours() % 12;
    return t === "Ko" ? r.ordinalNumber(a, { unit: "hour" }) : A(a, t.length);
  },
  // Hour [1-24]
  k: function(e, t, r) {
    let a = e.getHours();
    return a === 0 && (a = 24), t === "ko" ? r.ordinalNumber(a, { unit: "hour" }) : A(a, t.length);
  },
  // Minute
  m: function(e, t, r) {
    return t === "mo" ? r.ordinalNumber(e.getMinutes(), { unit: "minute" }) : ye.m(e, t);
  },
  // Second
  s: function(e, t, r) {
    return t === "so" ? r.ordinalNumber(e.getSeconds(), { unit: "second" }) : ye.s(e, t);
  },
  // Fraction of second
  S: function(e, t) {
    return ye.S(e, t);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function(e, t, r) {
    const a = e.getTimezoneOffset();
    if (a === 0)
      return "Z";
    switch (t) {
      // Hours and optional minutes
      case "X":
        return mr(a);
      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XX`
      case "XXXX":
      case "XX":
        return ke(a);
      // Hours and minutes with `:` delimiter
      default:
        return ke(a, ":");
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function(e, t, r) {
    const a = e.getTimezoneOffset();
    switch (t) {
      // Hours and optional minutes
      case "x":
        return mr(a);
      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xx`
      case "xxxx":
      case "xx":
        return ke(a);
      // Hours and minutes with `:` delimiter
      default:
        return ke(a, ":");
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
        return "GMT" + hr(a, ":");
      default:
        return "GMT" + ke(a, ":");
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
        return "GMT" + hr(a, ":");
      default:
        return "GMT" + ke(a, ":");
    }
  },
  // Seconds timestamp
  t: function(e, t, r) {
    const a = Math.trunc(+e / 1e3);
    return A(a, t.length);
  },
  // Milliseconds timestamp
  T: function(e, t, r) {
    return A(+e, t.length);
  }
};
function hr(e, t = "") {
  const r = e > 0 ? "-" : "+", a = Math.abs(e), o = Math.trunc(a / 60), s = a % 60;
  return s === 0 ? r + String(o) : r + String(o) + t + A(s, 2);
}
function mr(e, t) {
  return e % 60 === 0 ? (e > 0 ? "-" : "+") + A(Math.abs(e) / 60, 2) : ke(e, t);
}
function ke(e, t = "") {
  const r = e > 0 ? "-" : "+", a = Math.abs(e), o = A(Math.trunc(a / 60), 2), s = A(a % 60, 2);
  return r + o + t + s;
}
const pr = (e, t) => {
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
}, ta = (e, t) => {
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
}, es = (e, t) => {
  const r = e.match(/(P+)(p+)?/) || [], a = r[1], o = r[2];
  if (!o)
    return pr(e, t);
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
  return s.replace("{{date}}", pr(a, t)).replace("{{time}}", ta(o, t));
}, ts = {
  p: ta,
  P: es
}, rs = /^D+$/, as = /^Y+$/, ns = ["D", "DD", "YY", "YYYY"];
function os(e) {
  return rs.test(e);
}
function ss(e) {
  return as.test(e);
}
function is(e, t, r) {
  const a = ls(e, t, r);
  if (console.warn(a), ns.includes(e)) throw new RangeError(a);
}
function ls(e, t, r) {
  const a = e[0] === "Y" ? "years" : "days of the month";
  return `Use \`${e.toLowerCase()}\` instead of \`${e}\` (in \`${t}\`) for formatting ${a} to the input \`${r}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const cs = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, ds = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, us = /^'([^]*?)'?$/, fs = /''/g, hs = /[a-zA-Z]/;
function Ae(e, t, r) {
  const a = qe(), o = r?.locale ?? a.locale ?? Pe, s = r?.firstWeekContainsDate ?? r?.locale?.options?.firstWeekContainsDate ?? a.firstWeekContainsDate ?? a.locale?.options?.firstWeekContainsDate ?? 1, l = r?.weekStartsOn ?? r?.locale?.options?.weekStartsOn ?? a.weekStartsOn ?? a.locale?.options?.weekStartsOn ?? 0, i = _(e, r?.in);
  if (!mo(i))
    throw new RangeError("Invalid time value");
  let c = t.match(ds).map((h) => {
    const m = h[0];
    if (m === "p" || m === "P") {
      const p = ts[m];
      return p(h, o.formatLong);
    }
    return h;
  }).join("").match(cs).map((h) => {
    if (h === "''")
      return { isToken: !1, value: "'" };
    const m = h[0];
    if (m === "'")
      return { isToken: !1, value: ms(h) };
    if (fr[m])
      return { isToken: !0, value: h };
    if (m.match(hs))
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
    (!r?.useAdditionalWeekYearTokens && ss(m) || !r?.useAdditionalDayOfYearTokens && os(m)) && is(m, t, String(e));
    const p = fr[m[0]];
    return p(i, m, o.localize, d);
  }).join("");
}
function ms(e) {
  const t = e.match(us);
  return t ? t[1].replace(fs, "'") : e;
}
function ps(e, t) {
  const r = _(e, t?.in), a = r.getFullYear(), o = r.getMonth(), s = Y(r, 0);
  return s.setFullYear(a, o + 1, 0), s.setHours(0, 0, 0, 0), s.getDate();
}
function vs(e, t) {
  return _(e, t?.in).getMonth();
}
function bs(e, t) {
  return _(e, t?.in).getFullYear();
}
function gs(e, t) {
  return +_(e) > +_(t);
}
function xs(e, t) {
  return +_(e) < +_(t);
}
function ys(e, t, r) {
  const [a, o] = Ie(
    r?.in,
    e,
    t
  );
  return a.getFullYear() === o.getFullYear() && a.getMonth() === o.getMonth();
}
function ws(e, t, r) {
  const [a, o] = Ie(
    r?.in,
    e,
    t
  );
  return a.getFullYear() === o.getFullYear();
}
function ks(e, t, r) {
  const a = _(e, r?.in), o = a.getFullYear(), s = a.getDate(), l = Y(e, 0);
  l.setFullYear(o, t, 15), l.setHours(0, 0, 0, 0);
  const i = ps(l);
  return a.setMonth(t, Math.min(s, i)), a;
}
function Ns(e, t, r) {
  const a = _(e, r?.in);
  return isNaN(+a) ? Y(e, NaN) : (a.setFullYear(t), a);
}
const vr = 5, Ms = 4;
function Ss(e, t) {
  const r = t.startOfMonth(e), a = r.getDay() > 0 ? r.getDay() : 7, o = t.addDays(e, -a + 1), s = t.addDays(o, vr * 7 - 1);
  return t.getMonth(e) === t.getMonth(s) ? vr : Ms;
}
function ra(e, t) {
  const r = t.startOfMonth(e), a = r.getDay();
  return a === 1 ? r : a === 0 ? t.addDays(r, -6) : t.addDays(r, -1 * (a - 1));
}
function Cs(e, t) {
  const r = ra(e, t), a = Ss(e, t);
  return t.addDays(r, a * 7 - 1);
}
const Ts = {
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
}, Es = (e, t, r) => {
  r = r || {};
  let a;
  const o = Ts[e];
  return typeof o == "string" ? a = o : t === 1 ? r.addSuffix && o.oneWithSuffix ? a = o.oneWithSuffix : a = o.one : r.addSuffix && o.otherWithSuffix ? a = o.otherWithSuffix.replace("{{count}}", String(t)) : a = o.other.replace("{{count}}", String(t)), r.addSuffix ? r.comparison && r.comparison > 0 ? a + "後" : a + "前" : a;
}, Ds = {
  full: "y年M月d日EEEE",
  long: "y年M月d日",
  medium: "y/MM/dd",
  short: "y/MM/dd"
}, Ps = {
  full: "H時mm分ss秒 zzzz",
  long: "H:mm:ss z",
  medium: "H:mm:ss",
  short: "H:mm"
}, Bs = {
  full: "{{date}} {{time}}",
  long: "{{date}} {{time}}",
  medium: "{{date}} {{time}}",
  short: "{{date}} {{time}}"
}, Os = {
  date: Be({
    formats: Ds,
    defaultWidth: "full"
  }),
  time: Be({
    formats: Ps,
    defaultWidth: "full"
  }),
  dateTime: Be({
    formats: Bs,
    defaultWidth: "full"
  })
}, Ls = {
  lastWeek: "先週のeeeeのp",
  yesterday: "昨日のp",
  today: "今日のp",
  tomorrow: "明日のp",
  nextWeek: "翌週のeeeeのp",
  other: "P"
}, Ws = (e, t, r, a) => Ls[e], Is = {
  narrow: ["BC", "AC"],
  abbreviated: ["紀元前", "西暦"],
  wide: ["紀元前", "西暦"]
}, Hs = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["第1四半期", "第2四半期", "第3四半期", "第4四半期"]
}, js = {
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
}, Fs = {
  narrow: ["日", "月", "火", "水", "木", "金", "土"],
  short: ["日", "月", "火", "水", "木", "金", "土"],
  abbreviated: ["日", "月", "火", "水", "木", "金", "土"],
  wide: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"]
}, As = {
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
}, _s = {
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
}, zs = (e, t) => {
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
}, Ys = {
  ordinalNumber: zs,
  era: ue({
    values: Is,
    defaultWidth: "wide"
  }),
  quarter: ue({
    values: Hs,
    defaultWidth: "wide",
    argumentCallback: (e) => Number(e) - 1
  }),
  month: ue({
    values: js,
    defaultWidth: "wide"
  }),
  day: ue({
    values: Fs,
    defaultWidth: "wide"
  }),
  dayPeriod: ue({
    values: As,
    defaultWidth: "wide",
    formattingValues: _s,
    defaultFormattingWidth: "wide"
  })
}, $s = /^第?\d+(年|四半期|月|週|日|時|分|秒)?/i, Rs = /\d+/i, Vs = {
  narrow: /^(B\.?C\.?|A\.?D\.?)/i,
  abbreviated: /^(紀元[前後]|西暦)/i,
  wide: /^(紀元[前後]|西暦)/i
}, qs = {
  narrow: [/^B/i, /^A/i],
  any: [/^(紀元前)/i, /^(西暦|紀元後)/i]
}, Gs = {
  narrow: /^[1234]/i,
  abbreviated: /^Q[1234]/i,
  wide: /^第[1234一二三四１２３４]四半期/i
}, Us = {
  any: [/(1|一|１)/i, /(2|二|２)/i, /(3|三|３)/i, /(4|四|４)/i]
}, Xs = {
  narrow: /^([123456789]|1[012])/,
  abbreviated: /^([123456789]|1[012])月/i,
  wide: /^([123456789]|1[012])月/i
}, Qs = {
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
}, Zs = {
  narrow: /^[日月火水木金土]/,
  short: /^[日月火水木金土]/,
  abbreviated: /^[日月火水木金土]/,
  wide: /^[日月火水木金土]曜日/
}, Ks = {
  any: [/^日/, /^月/, /^火/, /^水/, /^木/, /^金/, /^土/]
}, Js = {
  any: /^(AM|PM|午前|午後|正午|深夜|真夜中|夜|朝)/i
}, ei = {
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
}, ti = {
  ordinalNumber: Jr({
    matchPattern: $s,
    parsePattern: Rs,
    valueCallback: function(e) {
      return parseInt(e, 10);
    }
  }),
  era: fe({
    matchPatterns: Vs,
    defaultMatchWidth: "wide",
    parsePatterns: qs,
    defaultParseWidth: "any"
  }),
  quarter: fe({
    matchPatterns: Gs,
    defaultMatchWidth: "wide",
    parsePatterns: Us,
    defaultParseWidth: "any",
    valueCallback: (e) => e + 1
  }),
  month: fe({
    matchPatterns: Xs,
    defaultMatchWidth: "wide",
    parsePatterns: Qs,
    defaultParseWidth: "any"
  }),
  day: fe({
    matchPatterns: Zs,
    defaultMatchWidth: "wide",
    parsePatterns: Ks,
    defaultParseWidth: "any"
  }),
  dayPeriod: fe({
    matchPatterns: Js,
    defaultMatchWidth: "any",
    parsePatterns: ei,
    defaultParseWidth: "any"
  })
}, ri = {
  code: "ja",
  formatDistance: Es,
  formatLong: Os,
  formatRelative: Ws,
  localize: Ys,
  match: ti,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
}, aa = {
  ...Pe,
  labels: {
    labelDayButton: (e, t, r, a) => {
      let o;
      a && typeof a.format == "function" ? o = a.format.bind(a) : o = (l, i) => Ae(l, i, { locale: Pe, ...r });
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
      return r && typeof r.format == "function" ? a = r.format.bind(r) : a = (o, s) => Ae(o, s, { locale: Pe, ...t }), a(e, "LLLL yyyy");
    },
    labelGridcell: (e, t, r, a) => {
      let o;
      a && typeof a.format == "function" ? o = a.format.bind(a) : o = (l, i) => Ae(l, i, { locale: Pe, ...r });
      let s = o(e, "PPPP");
      return t?.today && (s = `Today, ${s}`), s;
    },
    labelNav: "Navigation bar",
    labelWeekNumberHeader: "Week Number",
    labelWeekday: (e, t, r) => {
      let a;
      return r && typeof r.format == "function" ? a = r.format.bind(r) : a = (o, s) => Ae(o, s, { locale: Pe, ...t }), a(e, "cccc");
    }
  }
};
class R {
  /**
   * Creates an instance of `DateLib`.
   *
   * @param options Configuration options for the date library.
   * @param overrides Custom overrides for the date library functions.
   */
  constructor(t, r) {
    this.Date = Date, this.today = () => this.overrides?.today ? this.overrides.today() : this.options.timeZone ? G.tz(this.options.timeZone) : new this.Date(), this.newDate = (a, o, s) => this.overrides?.newDate ? this.overrides.newDate(a, o, s) : this.options.timeZone ? new G(a, o, s, this.options.timeZone) : new Date(a, o, s), this.addDays = (a, o) => this.overrides?.addDays ? this.overrides.addDays(a, o) : Vr(a, o), this.addMonths = (a, o) => this.overrides?.addMonths ? this.overrides.addMonths(a, o) : qr(a, o), this.addWeeks = (a, o) => this.overrides?.addWeeks ? this.overrides.addWeeks(a, o) : lo(a, o), this.addYears = (a, o) => this.overrides?.addYears ? this.overrides.addYears(a, o) : co(a, o), this.differenceInCalendarDays = (a, o) => this.overrides?.differenceInCalendarDays ? this.overrides.differenceInCalendarDays(a, o) : Ht(a, o), this.differenceInCalendarMonths = (a, o) => this.overrides?.differenceInCalendarMonths ? this.overrides.differenceInCalendarMonths(a, o) : Xr(a, o), this.eachMonthOfInterval = (a) => this.overrides?.eachMonthOfInterval ? this.overrides.eachMonthOfInterval(a) : vo(a), this.eachYearOfInterval = (a) => {
      const o = this.overrides?.eachYearOfInterval ? this.overrides.eachYearOfInterval(a) : xo(a), s = new Set(o.map((i) => this.getYear(i)));
      if (s.size === o.length)
        return o;
      const l = [];
      return s.forEach((i) => {
        l.push(new Date(i, 0, 1));
      }), l;
    }, this.endOfBroadcastWeek = (a) => this.overrides?.endOfBroadcastWeek ? this.overrides.endOfBroadcastWeek(a) : Cs(a, this), this.endOfISOWeek = (a) => this.overrides?.endOfISOWeek ? this.overrides.endOfISOWeek(a) : yo(a), this.endOfMonth = (a) => this.overrides?.endOfMonth ? this.overrides.endOfMonth(a) : po(a), this.endOfWeek = (a, o) => this.overrides?.endOfWeek ? this.overrides.endOfWeek(a, o) : Kr(a, this.options), this.endOfYear = (a) => this.overrides?.endOfYear ? this.overrides.endOfYear(a) : go(a), this.format = (a, o, s) => {
      const l = this.overrides?.format ? this.overrides.format(a, o, this.options) : Ae(a, o, this.options);
      return this.options.numerals && this.options.numerals !== "latn" ? this.replaceDigits(l) : l;
    }, this.getISOWeek = (a) => this.overrides?.getISOWeek ? this.overrides.getISOWeek(a) : jt(a), this.getMonth = (a, o) => this.overrides?.getMonth ? this.overrides.getMonth(a, this.options) : vs(a, this.options), this.getYear = (a, o) => this.overrides?.getYear ? this.overrides.getYear(a, this.options) : bs(a, this.options), this.getWeek = (a, o) => this.overrides?.getWeek ? this.overrides.getWeek(a, this.options) : Ft(a, this.options), this.isAfter = (a, o) => this.overrides?.isAfter ? this.overrides.isAfter(a, o) : gs(a, o), this.isBefore = (a, o) => this.overrides?.isBefore ? this.overrides.isBefore(a, o) : xs(a, o), this.isDate = (a) => this.overrides?.isDate ? this.overrides.isDate(a) : Ur(a), this.isSameDay = (a, o) => this.overrides?.isSameDay ? this.overrides.isSameDay(a, o) : ho(a, o), this.isSameMonth = (a, o) => this.overrides?.isSameMonth ? this.overrides.isSameMonth(a, o) : ys(a, o), this.isSameYear = (a, o) => this.overrides?.isSameYear ? this.overrides.isSameYear(a, o) : ws(a, o), this.max = (a) => this.overrides?.max ? this.overrides.max(a) : uo(a), this.min = (a) => this.overrides?.min ? this.overrides.min(a) : fo(a), this.setMonth = (a, o) => this.overrides?.setMonth ? this.overrides.setMonth(a, o) : ks(a, o), this.setYear = (a, o) => this.overrides?.setYear ? this.overrides.setYear(a, o) : Ns(a, o), this.startOfBroadcastWeek = (a, o) => this.overrides?.startOfBroadcastWeek ? this.overrides.startOfBroadcastWeek(a, this) : ra(a, this), this.startOfDay = (a) => this.overrides?.startOfDay ? this.overrides.startOfDay(a) : Ve(a), this.startOfISOWeek = (a) => this.overrides?.startOfISOWeek ? this.overrides.startOfISOWeek(a) : Re(a), this.startOfMonth = (a) => this.overrides?.startOfMonth ? this.overrides.startOfMonth(a) : bo(a), this.startOfWeek = (a, o) => this.overrides?.startOfWeek ? this.overrides.startOfWeek(a, this.options) : We(a, this.options), this.startOfYear = (a) => this.overrides?.startOfYear ? this.overrides.startOfYear(a) : Zr(a), this.options = { locale: aa, ...t }, this.overrides = r;
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
    return t && R.yearFirstLocales.has(t) ? "year-first" : "month-first";
  }
  /**
   * Formats the month/year pair respecting locale conventions.
   *
   * @since 9.11.0
   */
  formatMonthYear(t) {
    const { locale: r, timeZone: a, numerals: o } = this.options, s = r?.code;
    if (s && R.yearFirstLocales.has(s))
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
R.yearFirstLocales = /* @__PURE__ */ new Set([
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
const me = new R();
class na {
  constructor(t, r, a = me) {
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
class ai {
  constructor(t, r) {
    this.date = t, this.weeks = r;
  }
}
class ni {
  constructor(t, r) {
    this.days = r, this.weekNumber = t;
  }
}
function oi(e) {
  return N.createElement("button", { ...e });
}
function si(e) {
  return N.createElement("span", { ...e });
}
function ii(e) {
  const { size: t = 24, orientation: r = "left", className: a } = e;
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: handled by the parent component
    N.createElement(
      "svg",
      { className: a, width: t, height: t, viewBox: "0 0 24 24" },
      r === "up" && N.createElement("polygon", { points: "6.77 17 12.5 11.43 18.24 17 20 15.28 12.5 8 5 15.28" }),
      r === "down" && N.createElement("polygon", { points: "6.77 8 12.5 13.57 18.24 8 20 9.72 12.5 17 5 9.72" }),
      r === "left" && N.createElement("polygon", { points: "16 18.112 9.81111111 12 16 5.87733333 14.0888889 4 6 12 14.0888889 20" }),
      r === "right" && N.createElement("polygon", { points: "8 18.112 14.18888889 12 8 5.87733333 9.91111111 4 18 12 9.91111111 20" })
    )
  );
}
function li(e) {
  const { day: t, modifiers: r, ...a } = e;
  return N.createElement("td", { ...a });
}
function ci(e) {
  const { day: t, modifiers: r, ...a } = e, o = N.useRef(null);
  return N.useEffect(() => {
    r.focused && o.current?.focus();
  }, [r.focused]), N.createElement("button", { ref: o, ...a });
}
var D;
(function(e) {
  e.Root = "root", e.Chevron = "chevron", e.Day = "day", e.DayButton = "day_button", e.CaptionLabel = "caption_label", e.Dropdowns = "dropdowns", e.Dropdown = "dropdown", e.DropdownRoot = "dropdown_root", e.Footer = "footer", e.MonthGrid = "month_grid", e.MonthCaption = "month_caption", e.MonthsDropdown = "months_dropdown", e.Month = "month", e.Months = "months", e.Nav = "nav", e.NextMonthButton = "button_next", e.PreviousMonthButton = "button_previous", e.Week = "week", e.Weeks = "weeks", e.Weekday = "weekday", e.Weekdays = "weekdays", e.WeekNumber = "week_number", e.WeekNumberHeader = "week_number_header", e.YearsDropdown = "years_dropdown";
})(D || (D = {}));
var z;
(function(e) {
  e.disabled = "disabled", e.hidden = "hidden", e.outside = "outside", e.focused = "focused", e.today = "today";
})(z || (z = {}));
var ie;
(function(e) {
  e.range_end = "range_end", e.range_middle = "range_middle", e.range_start = "range_start", e.selected = "selected";
})(ie || (ie = {}));
var J;
(function(e) {
  e.weeks_before_enter = "weeks_before_enter", e.weeks_before_exit = "weeks_before_exit", e.weeks_after_enter = "weeks_after_enter", e.weeks_after_exit = "weeks_after_exit", e.caption_after_enter = "caption_after_enter", e.caption_after_exit = "caption_after_exit", e.caption_before_enter = "caption_before_enter", e.caption_before_exit = "caption_before_exit";
})(J || (J = {}));
function di(e) {
  const { options: t, className: r, components: a, classNames: o, ...s } = e, l = [o[D.Dropdown], r].join(" "), i = t?.find(({ value: c }) => c === s.value);
  return N.createElement(
    "span",
    { "data-disabled": s.disabled, className: o[D.DropdownRoot] },
    N.createElement(a.Select, { className: l, ...s }, t?.map(({ value: c, label: d, disabled: h }) => N.createElement(a.Option, { key: c, value: c, disabled: h }, d))),
    N.createElement(
      "span",
      { className: o[D.CaptionLabel], "aria-hidden": !0 },
      i?.label,
      N.createElement(a.Chevron, { orientation: "down", size: 18, className: o[D.Chevron] })
    )
  );
}
function ui(e) {
  return N.createElement("div", { ...e });
}
function fi(e) {
  return N.createElement("div", { ...e });
}
function hi(e) {
  const { calendarMonth: t, displayIndex: r, ...a } = e;
  return N.createElement("div", { ...a }, e.children);
}
function mi(e) {
  const { calendarMonth: t, displayIndex: r, ...a } = e;
  return N.createElement("div", { ...a });
}
function pi(e) {
  return N.createElement("table", { ...e });
}
function vi(e) {
  return N.createElement("div", { ...e });
}
const oa = dn(void 0);
function Ge() {
  const e = un(oa);
  if (e === void 0)
    throw new Error("useDayPicker() must be used within a custom component.");
  return e;
}
function bi(e) {
  const { components: t } = Ge();
  return N.createElement(t.Dropdown, { ...e });
}
function gi(e) {
  const { onPreviousClick: t, onNextClick: r, previousMonth: a, nextMonth: o, ...s } = e, { components: l, classNames: i, labels: { labelPrevious: c, labelNext: d } } = Ge(), h = re((p) => {
    o && r?.(p);
  }, [o, r]), m = re((p) => {
    a && t?.(p);
  }, [a, t]);
  return N.createElement(
    "nav",
    { ...s },
    N.createElement(
      l.PreviousMonthButton,
      { type: "button", className: i[D.PreviousMonthButton], tabIndex: a ? void 0 : -1, "aria-disabled": a ? void 0 : !0, "aria-label": c(a), onClick: m },
      N.createElement(l.Chevron, { disabled: a ? void 0 : !0, className: i[D.Chevron], orientation: "left" })
    ),
    N.createElement(
      l.NextMonthButton,
      { type: "button", className: i[D.NextMonthButton], tabIndex: o ? void 0 : -1, "aria-disabled": o ? void 0 : !0, "aria-label": d(o), onClick: h },
      N.createElement(l.Chevron, { disabled: o ? void 0 : !0, orientation: "right", className: i[D.Chevron] })
    )
  );
}
function xi(e) {
  const { components: t } = Ge();
  return N.createElement(t.Button, { ...e });
}
function yi(e) {
  return N.createElement("option", { ...e });
}
function wi(e) {
  const { components: t } = Ge();
  return N.createElement(t.Button, { ...e });
}
function ki(e) {
  const { rootRef: t, ...r } = e;
  return N.createElement("div", { ...r, ref: t });
}
function Ni(e) {
  return N.createElement("select", { ...e });
}
function Mi(e) {
  const { week: t, ...r } = e;
  return N.createElement("tr", { ...r });
}
function Si(e) {
  return N.createElement("th", { ...e });
}
function Ci(e) {
  return N.createElement(
    "thead",
    { "aria-hidden": !0 },
    N.createElement("tr", { ...e })
  );
}
function Ti(e) {
  const { week: t, ...r } = e;
  return N.createElement("th", { ...r });
}
function Ei(e) {
  return N.createElement("th", { ...e });
}
function Di(e) {
  return N.createElement("tbody", { ...e });
}
function Pi(e) {
  const { components: t } = Ge();
  return N.createElement(t.Dropdown, { ...e });
}
const Bi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Button: oi,
  CaptionLabel: si,
  Chevron: ii,
  Day: li,
  DayButton: ci,
  Dropdown: di,
  DropdownNav: ui,
  Footer: fi,
  Month: hi,
  MonthCaption: mi,
  MonthGrid: pi,
  Months: vi,
  MonthsDropdown: bi,
  Nav: gi,
  NextMonthButton: xi,
  Option: yi,
  PreviousMonthButton: wi,
  Root: ki,
  Select: Ni,
  Week: Mi,
  WeekNumber: Ti,
  WeekNumberHeader: Ei,
  Weekday: Si,
  Weekdays: Ci,
  Weeks: Di,
  YearsDropdown: Pi
}, Symbol.toStringTag, { value: "Module" }));
function ve(e, t, r = !1, a = me) {
  let { from: o, to: s } = e;
  const { differenceInCalendarDays: l, isSameDay: i } = a;
  return o && s ? (l(s, o) < 0 && ([o, s] = [s, o]), l(t, o) >= (r ? 1 : 0) && l(s, t) >= (r ? 1 : 0)) : !r && s ? i(s, t) : !r && o ? i(o, t) : !1;
}
function At(e) {
  return !!(e && typeof e == "object" && "before" in e && "after" in e);
}
function dt(e) {
  return !!(e && typeof e == "object" && "from" in e);
}
function _t(e) {
  return !!(e && typeof e == "object" && "after" in e);
}
function zt(e) {
  return !!(e && typeof e == "object" && "before" in e);
}
function sa(e) {
  return !!(e && typeof e == "object" && "dayOfWeek" in e);
}
function ia(e, t) {
  return Array.isArray(e) && e.every(t.isDate);
}
function be(e, t, r = me) {
  const a = Array.isArray(t) ? t : [t], { isSameDay: o, differenceInCalendarDays: s, isAfter: l } = r;
  return a.some((i) => {
    if (typeof i == "boolean")
      return i;
    if (r.isDate(i))
      return o(e, i);
    if (ia(i, r))
      return i.some((c) => o(e, c));
    if (dt(i))
      return ve(i, e, !1, r);
    if (sa(i))
      return Array.isArray(i.dayOfWeek) ? i.dayOfWeek.includes(e.getDay()) : i.dayOfWeek === e.getDay();
    if (At(i)) {
      const c = s(i.before, e), d = s(i.after, e), h = c > 0, m = d < 0;
      return l(i.before, i.after) ? m && h : h || m;
    }
    return _t(i) ? s(e, i.after) > 0 : zt(i) ? s(i.before, e) > 0 : typeof i == "function" ? i(e) : !1;
  });
}
function Oi(e, t, r, a, o) {
  const { disabled: s, hidden: l, modifiers: i, showOutsideDays: c, broadcastCalendar: d, today: h = o.today() } = t, { isSameDay: m, isSameMonth: p, startOfMonth: v, isBefore: x, endOfMonth: g, isAfter: y } = o, b = r && v(r), M = a && g(a), T = {
    [z.focused]: [],
    [z.outside]: [],
    [z.disabled]: [],
    [z.hidden]: [],
    [z.today]: []
  }, k = {};
  for (const C of e) {
    const { date: S, displayMonth: E } = C, I = !!(E && !p(S, E)), P = !!(b && x(S, b)), L = !!(M && y(S, M)), U = !!(s && be(S, s, o)), X = !!(l && be(S, l, o)) || P || L || // Broadcast calendar will show outside days as default
    !d && !c && I || d && c === !1 && I, ne = m(S, h);
    I && T.outside.push(C), U && T.disabled.push(C), X && T.hidden.push(C), ne && T.today.push(C), i && Object.keys(i).forEach((H) => {
      const $ = i?.[H];
      $ && be(S, $, o) && (k[H] ? k[H].push(C) : k[H] = [C]);
    });
  }
  return (C) => {
    const S = {
      [z.focused]: !1,
      [z.disabled]: !1,
      [z.hidden]: !1,
      [z.outside]: !1,
      [z.today]: !1
    }, E = {};
    for (const I in T) {
      const P = T[I];
      S[I] = P.some((L) => L === C);
    }
    for (const I in k)
      E[I] = k[I].some((P) => P === C);
    return {
      ...S,
      // custom modifiers should override all the previous ones
      ...E
    };
  };
}
function Li(e, t, r = {}) {
  return Object.entries(e).filter(([, o]) => o === !0).reduce((o, [s]) => (r[s] ? o.push(r[s]) : t[z[s]] ? o.push(t[z[s]]) : t[ie[s]] && o.push(t[ie[s]]), o), [t[D.Day]]);
}
function Wi(e) {
  return {
    ...Bi,
    ...e
  };
}
function Ii(e) {
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
function Hi() {
  const e = {};
  for (const t in D)
    e[D[t]] = `rdp-${D[t]}`;
  for (const t in z)
    e[z[t]] = `rdp-${z[t]}`;
  for (const t in ie)
    e[ie[t]] = `rdp-${ie[t]}`;
  for (const t in J)
    e[J[t]] = `rdp-${J[t]}`;
  return e;
}
function la(e, t, r) {
  return (r ?? new R(t)).formatMonthYear(e);
}
const ji = la;
function Fi(e, t, r) {
  return (r ?? new R(t)).format(e, "d");
}
function Ai(e, t = me) {
  return t.format(e, "LLLL");
}
function _i(e, t, r) {
  return (r ?? new R(t)).format(e, "cccccc");
}
function zi(e, t = me) {
  return e < 10 ? t.formatNumber(`0${e.toLocaleString()}`) : t.formatNumber(`${e.toLocaleString()}`);
}
function Yi() {
  return "";
}
function ca(e, t = me) {
  return t.format(e, "yyyy");
}
const $i = ca, Ri = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  formatCaption: la,
  formatDay: Fi,
  formatMonthCaption: ji,
  formatMonthDropdown: Ai,
  formatWeekNumber: zi,
  formatWeekNumberHeader: Yi,
  formatWeekdayName: _i,
  formatYearCaption: $i,
  formatYearDropdown: ca
}, Symbol.toStringTag, { value: "Module" }));
function Vi(e) {
  return e?.formatMonthCaption && !e.formatCaption && (e.formatCaption = e.formatMonthCaption), e?.formatYearCaption && !e.formatYearDropdown && (e.formatYearDropdown = e.formatYearCaption), {
    ...Ri,
    ...e
  };
}
function Yt(e, t, r, a) {
  let o = (a ?? new R(r)).format(e, "PPPP");
  return t.today && (o = `Today, ${o}`), t.selected && (o = `${o}, selected`), o;
}
const qi = Yt;
function $t(e, t, r) {
  return (r ?? new R(t)).formatMonthYear(e);
}
const Gi = $t;
function da(e, t, r, a) {
  let o = (a ?? new R(r)).format(e, "PPPP");
  return t?.today && (o = `Today, ${o}`), o;
}
function ua(e) {
  return "Choose the Month";
}
function fa() {
  return "";
}
const Ui = "Go to the Next Month";
function ha(e, t) {
  return Ui;
}
function ma(e) {
  return "Go to the Previous Month";
}
function pa(e, t, r) {
  return (r ?? new R(t)).format(e, "cccc");
}
function va(e, t) {
  return `Week ${e}`;
}
function ba(e) {
  return "Week Number";
}
function ga(e) {
  return "Choose the Year";
}
const Xi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  labelCaption: Gi,
  labelDay: qi,
  labelDayButton: Yt,
  labelGrid: $t,
  labelGridcell: da,
  labelMonthDropdown: ua,
  labelNav: fa,
  labelNext: ha,
  labelPrevious: ma,
  labelWeekNumber: va,
  labelWeekNumberHeader: ba,
  labelWeekday: pa,
  labelYearDropdown: ga
}, Symbol.toStringTag, { value: "Module" })), se = (e, t, r) => t || (r ? typeof r == "function" ? r : (...a) => r : e);
function Qi(e, t) {
  const r = t.locale?.labels ?? {};
  return {
    ...Xi,
    ...e ?? {},
    labelDayButton: se(Yt, e?.labelDayButton, r.labelDayButton),
    labelMonthDropdown: se(ua, e?.labelMonthDropdown, r.labelMonthDropdown),
    labelNext: se(ha, e?.labelNext, r.labelNext),
    labelPrevious: se(ma, e?.labelPrevious, r.labelPrevious),
    labelWeekNumber: se(va, e?.labelWeekNumber, r.labelWeekNumber),
    labelYearDropdown: se(ga, e?.labelYearDropdown, r.labelYearDropdown),
    labelGrid: se($t, e?.labelGrid, r.labelGrid),
    labelGridcell: se(da, e?.labelGridcell, r.labelGridcell),
    labelNav: se(fa, e?.labelNav, r.labelNav),
    labelWeekNumberHeader: se(ba, e?.labelWeekNumberHeader, r.labelWeekNumberHeader),
    labelWeekday: se(pa, e?.labelWeekday, r.labelWeekday)
  };
}
function Zi(e, t, r, a, o) {
  const { startOfMonth: s, startOfYear: l, endOfYear: i, eachMonthOfInterval: c, getMonth: d } = o;
  return c({
    start: l(e),
    end: i(e)
  }).map((p) => {
    const v = a.formatMonthDropdown(p, o), x = d(p), g = t && p < s(t) || r && p > s(r) || !1;
    return { value: x, label: v, disabled: g };
  });
}
function Ki(e, t = {}, r = {}) {
  let a = { ...t?.[D.Day] };
  return Object.entries(e).filter(([, o]) => o === !0).forEach(([o]) => {
    a = {
      ...a,
      ...r?.[o]
    };
  }), a;
}
function Ji(e, t, r, a) {
  const o = a ?? e.today(), s = r ? e.startOfBroadcastWeek(o, e) : t ? e.startOfISOWeek(o) : e.startOfWeek(o), l = [];
  for (let i = 0; i < 7; i++) {
    const c = e.addDays(s, i);
    l.push(c);
  }
  return l;
}
function el(e, t, r, a, o = !1) {
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
function tl(e, t = {}) {
  const { weekStartsOn: r, locale: a } = t, o = r ?? a?.options?.weekStartsOn ?? 0, s = (i) => {
    const c = typeof i == "number" || typeof i == "string" ? new Date(i) : i;
    return new G(c.getFullYear(), c.getMonth(), c.getDate(), 12, 0, 0, e);
  }, l = (i) => {
    const c = s(i);
    return new Date(c.getFullYear(), c.getMonth(), c.getDate(), 0, 0, 0, 0);
  };
  return {
    today: () => s(G.tz(e)),
    newDate: (i, c, d) => new G(i, c, d, 12, 0, 0, e),
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
      const c = s(i.start), d = s(i.end), h = [], m = new G(c.getFullYear(), c.getMonth(), 1, 12, 0, 0, e), p = d.getFullYear() * 12 + d.getMonth();
      for (; m.getFullYear() * 12 + m.getMonth() <= p; )
        h.push(new G(m, e)), m.setMonth(m.getMonth() + 1, 1);
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
      const c = s(i.start), d = s(i.end), h = [], m = new G(c.getFullYear(), 0, 1, 12, 0, 0, e);
      for (; m.getFullYear() <= d.getFullYear(); )
        h.push(new G(m, e)), m.setFullYear(m.getFullYear() + 1, 0, 1);
      return h;
    },
    getWeek: (i, c) => {
      const d = l(i);
      return Ft(d, {
        weekStartsOn: c?.weekStartsOn ?? o,
        firstWeekContainsDate: c?.firstWeekContainsDate ?? a?.options?.firstWeekContainsDate ?? 1
      });
    },
    getISOWeek: (i) => {
      const c = l(i);
      return jt(c);
    },
    differenceInCalendarDays: (i, c) => {
      const d = l(i), h = l(c);
      return Ht(d, h);
    },
    differenceInCalendarMonths: (i, c) => {
      const d = l(i), h = l(c);
      return Xr(d, h);
    }
  };
}
const Ue = (e) => e instanceof HTMLElement ? e : null, yt = (e) => [
  ...e.querySelectorAll("[data-animated-month]") ?? []
], rl = (e) => Ue(e.querySelector("[data-animated-month]")), wt = (e) => Ue(e.querySelector("[data-animated-caption]")), kt = (e) => Ue(e.querySelector("[data-animated-weeks]")), al = (e) => Ue(e.querySelector("[data-animated-nav]")), nl = (e) => Ue(e.querySelector("[data-animated-weekdays]"));
function ol(e, t, { classNames: r, months: a, focused: o, dateLib: s }) {
  const l = rt(null), i = rt(a), c = rt(!1);
  fn(() => {
    const d = i.current;
    if (i.current = a, !t || !e.current || // safety check because the ref can be set to anything by consumers
    !(e.current instanceof HTMLElement) || // validation required for the animation to work as expected
    a.length === 0 || d.length === 0 || a.length !== d.length)
      return;
    const h = s.isSameMonth(a[0].date, d[0].date), m = s.isAfter(a[0].date, d[0].date), p = m ? r[J.caption_after_enter] : r[J.caption_before_enter], v = m ? r[J.weeks_after_enter] : r[J.weeks_before_enter], x = l.current, g = e.current.cloneNode(!0);
    if (g instanceof HTMLElement ? (yt(g).forEach((T) => {
      if (!(T instanceof HTMLElement))
        return;
      const k = rl(T);
      k && T.contains(k) && T.removeChild(k);
      const C = wt(T);
      C && C.classList.remove(p);
      const S = kt(T);
      S && S.classList.remove(v);
    }), l.current = g) : l.current = null, c.current || h || // skip animation if a day is focused because it can cause issues to the animation and is better for a11y
    o)
      return;
    const y = x instanceof HTMLElement ? yt(x) : [], b = yt(e.current);
    if (b?.every((M) => M instanceof HTMLElement) && y && y.every((M) => M instanceof HTMLElement)) {
      c.current = !0, e.current.style.isolation = "isolate";
      const M = al(e.current);
      M && (M.style.zIndex = "1"), b.forEach((T, k) => {
        const C = y[k];
        if (!C)
          return;
        T.style.position = "relative", T.style.overflow = "hidden";
        const S = wt(T);
        S && S.classList.add(p);
        const E = kt(T);
        E && E.classList.add(v);
        const I = () => {
          c.current = !1, e.current && (e.current.style.isolation = ""), M && (M.style.zIndex = ""), S && S.classList.remove(p), E && E.classList.remove(v), T.style.position = "", T.style.overflow = "", T.contains(C) && T.removeChild(C);
        };
        C.style.pointerEvents = "none", C.style.position = "absolute", C.style.overflow = "hidden", C.setAttribute("aria-hidden", "true");
        const P = nl(C);
        P && (P.style.opacity = "0");
        const L = wt(C);
        L && (L.classList.add(m ? r[J.caption_before_exit] : r[J.caption_after_exit]), L.addEventListener("animationend", I));
        const U = kt(C);
        U && U.classList.add(m ? r[J.weeks_before_exit] : r[J.weeks_after_exit]), T.insertBefore(C, T.firstChild);
      });
    }
  });
}
function sl(e, t, r, a) {
  const o = e[0], s = e[e.length - 1], { ISOWeek: l, fixedWeeks: i, broadcastCalendar: c } = r ?? {}, { addDays: d, differenceInCalendarDays: h, differenceInCalendarMonths: m, endOfBroadcastWeek: p, endOfISOWeek: v, endOfMonth: x, endOfWeek: g, isAfter: y, startOfBroadcastWeek: b, startOfISOWeek: M, startOfWeek: T } = a, k = c ? b(o, a) : l ? M(o) : T(o), C = c ? p(s) : l ? v(x(s)) : g(x(s)), S = t && (c ? p(t) : l ? v(t) : g(t)), E = S && y(C, S) ? S : C, I = h(E, k), P = m(s, o) + 1, L = [];
  for (let ne = 0; ne <= I; ne++) {
    const H = d(k, ne);
    L.push(H);
  }
  const X = (c ? 35 : 42) * P;
  if (i && L.length < X) {
    const ne = X - L.length;
    for (let H = 0; H < ne; H++) {
      const $ = d(L[L.length - 1], 1);
      L.push($);
    }
  }
  return L;
}
function il(e) {
  const t = [];
  return e.reduce((r, a) => {
    const o = a.weeks.reduce((s, l) => s.concat(l.days.slice()), t.slice());
    return r.concat(o.slice());
  }, t.slice());
}
function ll(e, t, r, a) {
  const { numberOfMonths: o = 1 } = r, s = [];
  for (let l = 0; l < o; l++) {
    const i = a.addMonths(e, l);
    if (t && i > t)
      break;
    s.push(i);
  }
  return s;
}
function br(e, t, r, a) {
  const { month: o, defaultMonth: s, today: l = a.today(), numberOfMonths: i = 1 } = e;
  let c = o || s || l;
  const { differenceInCalendarMonths: d, addMonths: h, startOfMonth: m } = a;
  if (r && d(r, c) < i - 1) {
    const p = -1 * (i - 1);
    c = h(r, p);
  }
  return t && d(c, t) < 0 && (c = t), m(c);
}
function cl(e, t, r, a) {
  const { addDays: o, endOfBroadcastWeek: s, endOfISOWeek: l, endOfMonth: i, endOfWeek: c, getISOWeek: d, getWeek: h, startOfBroadcastWeek: m, startOfISOWeek: p, startOfWeek: v } = a, x = e.reduce((g, y) => {
    const b = r.broadcastCalendar ? m(y, a) : r.ISOWeek ? p(y) : v(y), M = r.broadcastCalendar ? s(y) : r.ISOWeek ? l(i(y)) : c(i(y)), T = t.filter((E) => E >= b && E <= M), k = r.broadcastCalendar ? 35 : 42;
    if (r.fixedWeeks && T.length < k) {
      const E = t.filter((I) => {
        const P = k - T.length;
        return I > M && I <= o(M, P);
      });
      T.push(...E);
    }
    const C = T.reduce((E, I) => {
      const P = r.ISOWeek ? d(I) : h(I), L = E.find((X) => X.weekNumber === P), U = new na(I, y, a);
      return L ? L.days.push(U) : E.push(new ni(P, [U])), E;
    }, []), S = new ai(y, C);
    return g.push(S), g;
  }, []);
  return r.reverseMonths ? x.reverse() : x;
}
function dl(e, t) {
  let { startMonth: r, endMonth: a } = e;
  const { startOfYear: o, startOfDay: s, startOfMonth: l, endOfMonth: i, addYears: c, endOfYear: d, newDate: h, today: m } = t, { fromYear: p, toYear: v, fromMonth: x, toMonth: g } = e;
  !r && x && (r = x), !r && p && (r = t.newDate(p, 0, 1)), !a && g && (a = g), !a && v && (a = h(v, 11, 31));
  const y = e.captionLayout === "dropdown" || e.captionLayout === "dropdown-years";
  return r ? r = l(r) : p ? r = h(p, 0, 1) : !r && y && (r = o(c(e.today ?? m(), -100))), a ? a = i(a) : v ? a = h(v, 11, 31) : !a && y && (a = d(e.today ?? m())), [
    r && s(r),
    a && s(a)
  ];
}
function ul(e, t, r, a) {
  if (r.disableNavigation)
    return;
  const { pagedNavigation: o, numberOfMonths: s = 1 } = r, { startOfMonth: l, addMonths: i, differenceInCalendarMonths: c } = a, d = o ? s : 1, h = l(e);
  if (!t)
    return i(h, d);
  if (!(c(t, e) < s))
    return i(h, d);
}
function fl(e, t, r, a) {
  if (r.disableNavigation)
    return;
  const { pagedNavigation: o, numberOfMonths: s } = r, { startOfMonth: l, addMonths: i, differenceInCalendarMonths: c } = a, d = o ? s ?? 1 : 1, h = l(e);
  if (!t)
    return i(h, -d);
  if (!(c(h, t) <= 0))
    return i(h, -d);
}
function hl(e) {
  const t = [];
  return e.reduce((r, a) => r.concat(a.weeks.slice()), t.slice());
}
function ut(e, t) {
  const [r, a] = Ct(e);
  return [t === void 0 ? r : t, a];
}
function ml(e, t) {
  const [r, a] = dl(e, t), { startOfMonth: o, endOfMonth: s } = t, l = br(e, r, a, t), [i, c] = ut(
    l,
    // initialMonth is always computed from props.month if provided
    e.month ? l : void 0
  );
  hn(() => {
    const k = br(e, r, a, t);
    c(k);
  }, [e.timeZone]);
  const { months: d, weeks: h, days: m, previousMonth: p, nextMonth: v } = at(() => {
    const k = ll(i, a, { numberOfMonths: e.numberOfMonths }, t), C = sl(k, e.endMonth ? s(e.endMonth) : void 0, {
      ISOWeek: e.ISOWeek,
      fixedWeeks: e.fixedWeeks,
      broadcastCalendar: e.broadcastCalendar
    }, t), S = cl(k, C, {
      broadcastCalendar: e.broadcastCalendar,
      fixedWeeks: e.fixedWeeks,
      ISOWeek: e.ISOWeek,
      reverseMonths: e.reverseMonths
    }, t), E = hl(S), I = il(S), P = fl(i, r, e, t), L = ul(i, a, e, t);
    return {
      months: S,
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
  ]), { disableNavigation: x, onMonthChange: g } = e, y = (k) => h.some((C) => C.days.some((S) => S.isEqualTo(k))), b = (k) => {
    if (x)
      return;
    let C = o(k);
    r && C < o(r) && (C = o(r)), a && C > o(a) && (C = o(a)), c(C), g?.(C);
  };
  return {
    months: d,
    weeks: h,
    days: m,
    navStart: r,
    navEnd: a,
    previousMonth: p,
    nextMonth: v,
    goToMonth: b,
    goToDay: (k) => {
      y(k) || b(k.date);
    }
  };
}
var de;
(function(e) {
  e[e.Today = 0] = "Today", e[e.Selected = 1] = "Selected", e[e.LastFocused = 2] = "LastFocused", e[e.FocusedModifier = 3] = "FocusedModifier";
})(de || (de = {}));
function gr(e) {
  return !e[z.disabled] && !e[z.hidden] && !e[z.outside];
}
function pl(e, t, r, a) {
  let o, s = -1;
  for (const l of e) {
    const i = t(l);
    gr(i) && (i[z.focused] && s < de.FocusedModifier ? (o = l, s = de.FocusedModifier) : a?.isEqualTo(l) && s < de.LastFocused ? (o = l, s = de.LastFocused) : r(l.date) && s < de.Selected ? (o = l, s = de.Selected) : i[z.today] && s < de.Today && (o = l, s = de.Today));
  }
  return o || (o = e.find((l) => gr(t(l)))), o;
}
function vl(e, t, r, a, o, s, l) {
  const { ISOWeek: i, broadcastCalendar: c } = s, { addDays: d, addMonths: h, addWeeks: m, addYears: p, endOfBroadcastWeek: v, endOfISOWeek: x, endOfWeek: g, max: y, min: b, startOfBroadcastWeek: M, startOfISOWeek: T, startOfWeek: k } = l;
  let S = {
    day: d,
    week: m,
    month: h,
    year: p,
    startOfWeek: (E) => c ? M(E, l) : i ? T(E) : k(E),
    endOfWeek: (E) => c ? v(E) : i ? x(E) : g(E)
  }[e](r, t === "after" ? 1 : -1);
  return t === "before" && a ? S = y([a, S]) : t === "after" && o && (S = b([o, S])), S;
}
function xa(e, t, r, a, o, s, l, i = 0) {
  if (i > 365)
    return;
  const c = vl(e, t, r.date, a, o, s, l), d = !!(s.disabled && be(c, s.disabled, l)), h = !!(s.hidden && be(c, s.hidden, l)), m = c, p = new na(c, m, l);
  return !d && !h ? p : xa(e, t, p, a, o, s, l, i + 1);
}
function bl(e, t, r, a, o) {
  const { autoFocus: s } = e, [l, i] = Ct(), c = pl(t.days, r, a || (() => !1), l), [d, h] = Ct(s ? c : void 0);
  return {
    isFocusTarget: (g) => !!c?.isEqualTo(g),
    setFocused: h,
    focused: d,
    blur: () => {
      i(d), h(void 0);
    },
    moveFocus: (g, y) => {
      if (!d)
        return;
      const b = xa(g, y, d, t.navStart, t.navEnd, e, o);
      b && (e.disableNavigation && !t.days.some((T) => T.isEqualTo(b)) || (t.goToDay(b), h(b)));
    }
  };
}
function gl(e, t) {
  const { selected: r, required: a, onSelect: o } = e, [s, l] = ut(r, o ? r : void 0), i = o ? r : s, { isSameDay: c } = t, d = (v) => i?.some((x) => c(x, v)) ?? !1, { min: h, max: m } = e;
  return {
    selected: i,
    select: (v, x, g) => {
      let y = [...i ?? []];
      if (d(v)) {
        if (i?.length === h || a && i?.length === 1)
          return;
        y = i?.filter((b) => !c(b, v));
      } else
        i?.length === m ? y = [v] : y = [...y, v];
      return o || l(y), o?.(y, v, x, g), y;
    },
    isSelected: d
  };
}
function xl(e, t, r = 0, a = 0, o = !1, s = me) {
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
function yl(e, t, r = me) {
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
function xr(e, t, r = me) {
  return ve(e, t.from, !1, r) || ve(e, t.to, !1, r) || ve(t, e.from, !1, r) || ve(t, e.to, !1, r);
}
function wl(e, t, r = me) {
  const a = Array.isArray(t) ? t : [t];
  if (a.filter((i) => typeof i != "function").some((i) => typeof i == "boolean" ? i : r.isDate(i) ? ve(e, i, !1, r) : ia(i, r) ? i.some((c) => ve(e, c, !1, r)) : dt(i) ? i.from && i.to ? xr(e, { from: i.from, to: i.to }, r) : !1 : sa(i) ? yl(e, i.dayOfWeek, r) : At(i) ? r.isAfter(i.before, i.after) ? xr(e, {
    from: r.addDays(i.after, 1),
    to: r.addDays(i.before, -1)
  }, r) : be(e.from, i, r) || be(e.to, i, r) : _t(i) || zt(i) ? be(e.from, i, r) || be(e.to, i, r) : !1))
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
function kl(e, t) {
  const { disabled: r, excludeDisabled: a, resetOnSelect: o, selected: s, required: l, onSelect: i } = e, [c, d] = ut(s, i ? s : void 0), h = i ? s : c;
  return {
    selected: h,
    select: (v, x, g) => {
      const { min: y, max: b } = e;
      let M;
      if (v) {
        const T = h?.from, k = h?.to, C = !!T && !!k, S = !!T && !!k && t.isSameDay(T, k) && t.isSameDay(v, T);
        o && (C || !h?.from) ? !l && S ? M = void 0 : M = { from: v, to: void 0 } : M = xl(v, h, y, b, l, t);
      }
      return a && r && M?.from && M.to && wl({ from: M.from, to: M.to }, r, t) && (M.from = v, M.to = void 0), i || d(M), i?.(M, v, x, g), M;
    },
    isSelected: (v) => h && ve(h, v, !1, t)
  };
}
function Nl(e, t) {
  const { selected: r, required: a, onSelect: o } = e, [s, l] = ut(r, o ? r : void 0), i = o ? r : s, { isSameDay: c } = t;
  return {
    selected: i,
    select: (m, p, v) => {
      let x = m;
      return !a && i && i && c(m, i) && (x = void 0), o || l(x), o?.(x, m, p, v), x;
    },
    isSelected: (m) => i ? c(i, m) : !1
  };
}
function Ml(e, t) {
  const r = Nl(e, t), a = gl(e, t), o = kl(e, t);
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
function ae(e, t) {
  return e instanceof G && e.timeZone === t ? e : new G(e, t);
}
function De(e, t, r) {
  return ae(e, t);
}
function yr(e, t, r) {
  return typeof e == "boolean" || typeof e == "function" ? e : e instanceof Date ? De(e, t) : Array.isArray(e) ? e.map((a) => a instanceof Date ? De(a, t) : a) : dt(e) ? {
    ...e,
    from: e.from ? ae(e.from, t) : e.from,
    to: e.to ? ae(e.to, t) : e.to
  } : At(e) ? {
    before: De(e.before, t),
    after: De(e.after, t)
  } : _t(e) ? {
    after: De(e.after, t)
  } : zt(e) ? {
    before: De(e.before, t)
  } : e;
}
function Nt(e, t, r) {
  return e && (Array.isArray(e) ? e.map((a) => yr(a, t)) : yr(e, t));
}
function Sl(e) {
  let t = e;
  const r = t.timeZone;
  if (r && (t = {
    ...e,
    timeZone: r
  }, t.today && (t.today = ae(t.today, r)), t.month && (t.month = ae(t.month, r)), t.defaultMonth && (t.defaultMonth = ae(t.defaultMonth, r)), t.startMonth && (t.startMonth = ae(t.startMonth, r)), t.endMonth && (t.endMonth = ae(t.endMonth, r)), t.mode === "single" && t.selected ? t.selected = ae(t.selected, r) : t.mode === "multiple" && t.selected ? t.selected = t.selected?.map((O) => ae(O, r)) : t.mode === "range" && t.selected && (t.selected = {
    from: t.selected.from ? ae(t.selected.from, r) : t.selected.from,
    to: t.selected.to ? ae(t.selected.to, r) : t.selected.to
  }), t.disabled !== void 0 && (t.disabled = Nt(t.disabled, r)), t.hidden !== void 0 && (t.hidden = Nt(t.hidden, r)), t.modifiers)) {
    const O = {};
    Object.keys(t.modifiers).forEach((F) => {
      O[F] = Nt(t.modifiers?.[F], r);
    }), t.modifiers = O;
  }
  const { components: a, formatters: o, labels: s, dateLib: l, locale: i, classNames: c } = at(() => {
    const O = { ...aa, ...t.locale }, F = t.broadcastCalendar ? 1 : t.weekStartsOn, B = t.noonSafe && t.timeZone ? tl(t.timeZone, {
      weekStartsOn: F,
      locale: O
    }) : void 0, j = t.dateLib && B ? { ...B, ...t.dateLib } : t.dateLib ?? B, K = new R({
      locale: O,
      weekStartsOn: F,
      firstWeekContainsDate: t.firstWeekContainsDate,
      useAdditionalWeekYearTokens: t.useAdditionalWeekYearTokens,
      useAdditionalDayOfYearTokens: t.useAdditionalDayOfYearTokens,
      timeZone: t.timeZone,
      numerals: t.numerals
    }, j);
    return {
      dateLib: K,
      components: Wi(t.components),
      formatters: Vi(t.formatters),
      labels: Qi(t.labels, K.options),
      locale: O,
      classNames: { ...Hi(), ...t.classNames }
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
  const { captionLayout: d, mode: h, navLayout: m, numberOfMonths: p = 1, onDayBlur: v, onDayClick: x, onDayFocus: g, onDayKeyDown: y, onDayMouseEnter: b, onDayMouseLeave: M, onNextClick: T, onPrevClick: k, showWeekNumber: C, styles: S } = t, { formatCaption: E, formatDay: I, formatMonthDropdown: P, formatWeekNumber: L, formatWeekNumberHeader: U, formatWeekdayName: X, formatYearDropdown: ne } = o, H = ml(t, l), { days: $, months: te, navStart: ce, navEnd: xe, previousMonth: Q, nextMonth: oe, goToMonth: pe } = H, ft = Oi($, t, ce, xe, l), { isSelected: ht, select: mt, selected: Ke } = Ml(t, l) ?? {}, { blur: Ut, focused: Xt, isFocusTarget: Oa, moveFocus: Qt, setFocused: Je } = bl(t, H, ft, ht ?? (() => !1), l), { labelDayButton: La, labelGridcell: Wa, labelGrid: Ia, labelMonthDropdown: Ha, labelNav: Zt, labelPrevious: ja, labelNext: Fa, labelWeekday: Aa, labelWeekNumber: _a, labelWeekNumberHeader: za, labelYearDropdown: Ya } = s, $a = at(() => Ji(l, t.ISOWeek, t.broadcastCalendar, t.today), [l, t.ISOWeek, t.broadcastCalendar, t.today]), Kt = h !== void 0 || x !== void 0, pt = re(() => {
    Q && (pe(Q), k?.(Q));
  }, [Q, pe, k]), vt = re(() => {
    oe && (pe(oe), T?.(oe));
  }, [pe, oe, T]), Ra = re((O, F) => (B) => {
    B.preventDefault(), B.stopPropagation(), Je(O), !F.disabled && (mt?.(O.date, F, B), x?.(O.date, F, B));
  }, [mt, x, Je]), Va = re((O, F) => (B) => {
    Je(O), g?.(O.date, F, B);
  }, [g, Je]), qa = re((O, F) => (B) => {
    Ut(), v?.(O.date, F, B);
  }, [Ut, v]), Ga = re((O, F) => (B) => {
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
      const [K, W] = j[B.key];
      Qt(K, W);
    }
    y?.(O.date, F, B);
  }, [Qt, y, t.dir]), Ua = re((O, F) => (B) => {
    b?.(O.date, F, B);
  }, [b]), Xa = re((O, F) => (B) => {
    M?.(O.date, F, B);
  }, [M]), Qa = re((O) => (F) => {
    const B = Number(F.target.value), j = l.setMonth(l.startOfMonth(O), B);
    pe(j);
  }, [l, pe]), Za = re((O) => (F) => {
    const B = Number(F.target.value), j = l.setYear(l.startOfMonth(O), B);
    pe(j);
  }, [l, pe]), { className: Ka, style: Ja } = at(() => ({
    className: [c[D.Root], t.className].filter(Boolean).join(" "),
    style: { ...S?.[D.Root], ...t.style }
  }), [c, t.className, t.style, S]), en = Ii(t), Jt = rt(null);
  ol(Jt, !!t.animate, {
    classNames: c,
    months: te,
    focused: Xt,
    dateLib: l
  });
  const tn = {
    dayPickerProps: t,
    selected: Ke,
    select: mt,
    isSelected: ht,
    months: te,
    nextMonth: oe,
    previousMonth: Q,
    goToMonth: pe,
    getModifiers: ft,
    components: a,
    classNames: c,
    styles: S,
    labels: s,
    formatters: o
  };
  return N.createElement(
    oa.Provider,
    { value: tn },
    N.createElement(
      a.Root,
      { rootRef: t.animate ? Jt : void 0, className: Ka, style: Ja, dir: t.dir, id: t.id, lang: t.lang ?? i.code, nonce: t.nonce, title: t.title, role: t.role, "aria-label": t["aria-label"], "aria-labelledby": t["aria-labelledby"], ...en },
      N.createElement(
        a.Months,
        { className: c[D.Months], style: S?.[D.Months] },
        !t.hideNavigation && !m && N.createElement(a.Nav, { "data-animated-nav": t.animate ? "true" : void 0, className: c[D.Nav], style: S?.[D.Nav], "aria-label": Zt(), onPreviousClick: pt, onNextClick: vt, previousMonth: Q, nextMonth: oe }),
        te.map((O, F) => N.createElement(
          a.Month,
          {
            "data-animated-month": t.animate ? "true" : void 0,
            className: c[D.Month],
            style: S?.[D.Month],
            // biome-ignore lint/suspicious/noArrayIndexKey: breaks animation
            key: F,
            displayIndex: F,
            calendarMonth: O
          },
          m === "around" && !t.hideNavigation && F === 0 && N.createElement(
            a.PreviousMonthButton,
            { type: "button", className: c[D.PreviousMonthButton], tabIndex: Q ? void 0 : -1, "aria-disabled": Q ? void 0 : !0, "aria-label": ja(Q), onClick: pt, "data-animated-button": t.animate ? "true" : void 0 },
            N.createElement(a.Chevron, { disabled: Q ? void 0 : !0, className: c[D.Chevron], orientation: t.dir === "rtl" ? "right" : "left" })
          ),
          N.createElement(a.MonthCaption, { "data-animated-caption": t.animate ? "true" : void 0, className: c[D.MonthCaption], style: S?.[D.MonthCaption], calendarMonth: O, displayIndex: F }, d?.startsWith("dropdown") ? N.createElement(
            a.DropdownNav,
            { className: c[D.Dropdowns], style: S?.[D.Dropdowns] },
            (() => {
              const B = d === "dropdown" || d === "dropdown-months" ? N.createElement(a.MonthsDropdown, { key: "month", className: c[D.MonthsDropdown], "aria-label": Ha(), classNames: c, components: a, disabled: !!t.disableNavigation, onChange: Qa(O.date), options: Zi(O.date, ce, xe, o, l), style: S?.[D.Dropdown], value: l.getMonth(O.date) }) : N.createElement("span", { key: "month" }, P(O.date, l)), j = d === "dropdown" || d === "dropdown-years" ? N.createElement(a.YearsDropdown, { key: "year", className: c[D.YearsDropdown], "aria-label": Ya(l.options), classNames: c, components: a, disabled: !!t.disableNavigation, onChange: Za(O.date), options: el(ce, xe, o, l, !!t.reverseYears), style: S?.[D.Dropdown], value: l.getYear(O.date) }) : N.createElement("span", { key: "year" }, ne(O.date, l));
              return l.getMonthYearOrder() === "year-first" ? [j, B] : [B, j];
            })(),
            N.createElement("span", { role: "status", "aria-live": "polite", style: {
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
          ) : N.createElement(a.CaptionLabel, { className: c[D.CaptionLabel], role: "status", "aria-live": "polite" }, E(O.date, l.options, l))),
          m === "around" && !t.hideNavigation && F === p - 1 && N.createElement(
            a.NextMonthButton,
            { type: "button", className: c[D.NextMonthButton], tabIndex: oe ? void 0 : -1, "aria-disabled": oe ? void 0 : !0, "aria-label": Fa(oe), onClick: vt, "data-animated-button": t.animate ? "true" : void 0 },
            N.createElement(a.Chevron, { disabled: oe ? void 0 : !0, className: c[D.Chevron], orientation: t.dir === "rtl" ? "left" : "right" })
          ),
          F === p - 1 && m === "after" && !t.hideNavigation && N.createElement(a.Nav, { "data-animated-nav": t.animate ? "true" : void 0, className: c[D.Nav], style: S?.[D.Nav], "aria-label": Zt(), onPreviousClick: pt, onNextClick: vt, previousMonth: Q, nextMonth: oe }),
          N.createElement(
            a.MonthGrid,
            { role: "grid", "aria-multiselectable": h === "multiple" || h === "range", "aria-label": Ia(O.date, l.options, l) || void 0, className: c[D.MonthGrid], style: S?.[D.MonthGrid] },
            !t.hideWeekdays && N.createElement(
              a.Weekdays,
              { "data-animated-weekdays": t.animate ? "true" : void 0, className: c[D.Weekdays], style: S?.[D.Weekdays] },
              C && N.createElement(a.WeekNumberHeader, { "aria-label": za(l.options), className: c[D.WeekNumberHeader], style: S?.[D.WeekNumberHeader], scope: "col" }, U()),
              $a.map((B) => N.createElement(a.Weekday, { "aria-label": Aa(B, l.options, l), className: c[D.Weekday], key: String(B), style: S?.[D.Weekday], scope: "col" }, X(B, l.options, l)))
            ),
            N.createElement(a.Weeks, { "data-animated-weeks": t.animate ? "true" : void 0, className: c[D.Weeks], style: S?.[D.Weeks] }, O.weeks.map((B) => N.createElement(
              a.Week,
              { className: c[D.Week], key: B.weekNumber, style: S?.[D.Week], week: B },
              C && N.createElement(a.WeekNumber, { week: B, style: S?.[D.WeekNumber], "aria-label": _a(B.weekNumber, {
                locale: i
              }), className: c[D.WeekNumber], scope: "row", role: "rowheader" }, L(B.weekNumber, l)),
              B.days.map((j) => {
                const { date: K } = j, W = ft(j);
                if (W[z.focused] = !W.hidden && !!Xt?.isEqualTo(j), W[ie.selected] = ht?.(K) || W.selected, dt(Ke)) {
                  const { from: bt, to: gt } = Ke;
                  W[ie.range_start] = !!(bt && gt && l.isSameDay(K, bt)), W[ie.range_end] = !!(bt && gt && l.isSameDay(K, gt)), W[ie.range_middle] = ve(Ke, K, !0, l);
                }
                const rn = Ki(W, S, t.modifiersStyles), an = Li(W, c, t.modifiersClassNames), nn = !Kt && !W.hidden ? Wa(K, W, l.options, l) : void 0;
                return N.createElement(a.Day, { key: `${j.isoDate}_${j.displayMonthId}`, day: j, modifiers: W, className: an.join(" "), style: rn, role: "gridcell", "aria-selected": W.selected || void 0, "aria-label": nn, "data-day": j.isoDate, "data-month": j.outside ? j.dateMonthId : void 0, "data-selected": W.selected || void 0, "data-disabled": W.disabled || void 0, "data-hidden": W.hidden || void 0, "data-outside": j.outside || void 0, "data-focused": W.focused || void 0, "data-today": W.today || void 0 }, !W.hidden && Kt ? N.createElement(a.DayButton, { className: c[D.DayButton], style: S?.[D.DayButton], type: "button", day: j, modifiers: W, disabled: !W.focused && W.disabled || void 0, "aria-disabled": W.focused && W.disabled || void 0, tabIndex: Oa(j) ? 0 : -1, "aria-label": La(K, W, l.options, l), onClick: Ra(j, W), onBlur: qa(j, W), onFocus: Va(j, W), onKeyDown: Ga(j, W), onMouseEnter: Ua(j, W), onMouseLeave: Xa(j, W) }, I(K, l.options, l)) : !W.hidden && I(j.date, l.options, l));
              })
            )))
          )
        ))
      ),
      t.footer && N.createElement(a.Footer, { className: c[D.Footer], style: S?.[D.Footer], role: "status", "aria-live": "polite" }, t.footer)
    )
  );
}
const Cl = {
  ...ri,
  labels: {
    labelDayButton: (e, t, r, a) => {
      let s = (a ?? new R(r)).format(e, "PPPP");
      return t.today && (s = `今日、${s}`), t.selected && (s = `${s}、選択済み`), s;
    },
    labelMonthDropdown: "月を選択",
    labelNext: "次の月へ",
    labelPrevious: "前の月へ",
    labelWeekNumber: (e) => `第${e}週`,
    labelYearDropdown: "年を選択",
    labelGrid: (e, t, r) => (r ?? new R(t)).formatMonthYear(e),
    labelGridcell: (e, t, r, a) => {
      let s = (a ?? new R(r)).format(e, "PPPP");
      return t?.today && (s = `今日、${s}`), s;
    },
    labelNav: "ナビゲーションバー",
    labelWeekNumberHeader: "週番号",
    labelWeekday: (e, t, r) => (r ?? new R(t)).format(e, "cccc")
  }
};
function ya({ className: e, classNames: t, showOutsideDays: r = !0, ...a }) {
  return /* @__PURE__ */ n(
    Sl,
    {
      showOutsideDays: r,
      locale: Cl,
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
function Xe({ ...e }) {
  return /* @__PURE__ */ n(Ye.Root, { "data-slot": "popover", ...e });
}
function Qe({ ...e }) {
  return /* @__PURE__ */ n(Ye.Trigger, { "data-slot": "popover-trigger", ...e });
}
function Ze({ className: e, align: t = "center", sideOffset: r = 4, ...a }) {
  return /* @__PURE__ */ n(Ye.Portal, { children: /* @__PURE__ */ n(
    Ye.Content,
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
function su({ ...e }) {
  return /* @__PURE__ */ n(Ye.Anchor, { "data-slot": "popover-anchor", ...e });
}
function ot(e, t) {
  const r = e.getFullYear(), a = String(e.getMonth() + 1).padStart(2, "0"), o = String(e.getDate()).padStart(2, "0");
  return t.replace("yyyy", String(r)).replace("MM", a).replace("dd", o);
}
const wa = /* @__PURE__ */ f(
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
function ka(e, t, r) {
  return u(
    "flex h-12 w-full items-center justify-between rounded-lg border bg-[var(--Surface-Primary)] px-3 typo-body-md transition-colors outline-none",
    e ? "border-[var(--Border-Accent-Primary)] ring-[3px] ring-[var(--Focus-High-Emphasis)]/50" : "border-[var(--Border-Medium-Emphasis)] hover:border-[var(--Border-High-Emphasis)]",
    "disabled:cursor-not-allowed disabled:opacity-50",
    t ? "text-[var(--Text-High-Emphasis)]" : "text-[var(--Text-Low-Emphasis)]",
    r
  );
}
function iu({
  value: e,
  onChange: t,
  placeholder: r = "日付を選択",
  disabled: a = !1,
  className: o,
  dateFormat: s = "yyyy/MM/dd",
  triggerLabel: l
}) {
  const [i, c] = w.useState(!1), d = e ? ot(e, s) : null;
  return /* @__PURE__ */ f(Xe, { open: i, onOpenChange: c, children: [
    /* @__PURE__ */ n(Qe, { asChild: !0, children: /* @__PURE__ */ f(
      "button",
      {
        "data-slot": "date-picker-trigger",
        disabled: a,
        "aria-expanded": i,
        "aria-label": l ?? r,
        className: ka(i, !!d, o),
        children: [
          /* @__PURE__ */ n("span", { children: d ?? r }),
          wa
        ]
      }
    ) }),
    /* @__PURE__ */ n(Ze, { className: "w-auto p-0", align: "start", children: /* @__PURE__ */ n(
      ya,
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
function lu({
  value: e,
  onChange: t,
  placeholder: r = "期間を選択",
  disabled: a = !1,
  className: o,
  dateFormat: s = "yyyy/MM/dd",
  triggerLabel: l
}) {
  const [i, c] = w.useState(!1), d = e?.from ? e.to ? `${ot(e.from, s)} 〜 ${ot(e.to, s)}` : ot(e.from, s) : null;
  return /* @__PURE__ */ f(Xe, { open: i, onOpenChange: c, children: [
    /* @__PURE__ */ n(Qe, { asChild: !0, children: /* @__PURE__ */ f(
      "button",
      {
        "data-slot": "date-range-picker-trigger",
        disabled: a,
        "aria-expanded": i,
        "aria-label": l ?? r,
        className: ka(i, !!d, o),
        children: [
          /* @__PURE__ */ n("span", { children: d ?? r }),
          wa
        ]
      }
    ) }),
    /* @__PURE__ */ n(Ze, { className: "w-auto p-0", align: "start", children: /* @__PURE__ */ n(
      ya,
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
function Ne(e) {
  return String(e).padStart(2, "0");
}
function Tl(e) {
  if (!e) return null;
  const [t, r] = e.split(":"), a = parseInt(t, 10), o = parseInt(r, 10);
  return isNaN(a) || isNaN(o) ? null : { h: Math.min(23, Math.max(0, a)), m: Math.min(59, Math.max(0, o)) };
}
const El = /* @__PURE__ */ f("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", className: "text-[var(--Object-Medium-Emphasis)] shrink-0", "aria-hidden": !0, children: [
  /* @__PURE__ */ n("circle", { cx: "8", cy: "8", r: "6", stroke: "currentColor", strokeWidth: "1.5" }),
  /* @__PURE__ */ n("path", { d: "M8 5v3.5l2 1.5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })
] });
function wr({
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
      children: Ne(o)
    },
    o
  )) });
}
function cu({
  value: e,
  onChange: t,
  placeholder: r = "時刻を選択",
  disabled: a = !1,
  minuteStep: o = 1,
  className: s,
  triggerLabel: l
}) {
  const [i, c] = w.useState(!1), d = Tl(e), h = Array.from({ length: 24 }, (b, M) => M), m = Array.from(
    { length: Math.ceil(60 / o) },
    (b, M) => M * o
  ), p = d?.h ?? 0, v = d?.m ?? 0, x = (b) => t?.(`${Ne(b)}:${Ne(v)}`), g = (b) => t?.(`${Ne(p)}:${Ne(b)}`), y = d ? `${Ne(d.h)}:${Ne(d.m)}` : null;
  return /* @__PURE__ */ f(Xe, { open: i, onOpenChange: c, children: [
    /* @__PURE__ */ n(Qe, { asChild: !0, children: /* @__PURE__ */ f(
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
          El
        ]
      }
    ) }),
    /* @__PURE__ */ n(Ze, { className: "w-44 p-3", align: "start", children: /* @__PURE__ */ f("div", { className: "flex gap-2 items-start", children: [
      /* @__PURE__ */ f("div", { className: "flex-1", children: [
        /* @__PURE__ */ n("div", { className: "typo-label-xs text-[var(--Text-Low-Emphasis)] text-center mb-1", children: "時" }),
        /* @__PURE__ */ n(wr, { items: h, selected: p, onSelect: x })
      ] }),
      /* @__PURE__ */ n("div", { className: "flex items-center justify-center h-48 typo-heading-md text-[var(--Text-Low-Emphasis)] select-none pt-6", children: ":" }),
      /* @__PURE__ */ f("div", { className: "flex-1", children: [
        /* @__PURE__ */ n("div", { className: "typo-label-xs text-[var(--Text-Low-Emphasis)] text-center mb-1", children: "分" }),
        /* @__PURE__ */ n(wr, { items: m, selected: v, onSelect: g })
      ] })
    ] }) })
  ] });
}
function du({
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
  const [d, h] = w.useState(!1), [m, p] = w.useState(""), v = w.useRef(null), x = e.find((b) => b.value === t), g = m.trim() ? e.filter((b) => b.label.toLowerCase().includes(m.toLowerCase())) : e, y = (b) => {
    b.disabled || (r?.(b.value), h(!1), p(""));
  };
  return /* @__PURE__ */ f(Xe, { open: d, onOpenChange: (b) => {
    h(b), b || p("");
  }, children: [
    /* @__PURE__ */ n(Qe, { asChild: !0, children: /* @__PURE__ */ f(
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
          x ? "text-[var(--Text-High-Emphasis)]" : "text-[var(--Text-Low-Emphasis)]",
          i
        ),
        children: [
          /* @__PURE__ */ n("span", { children: x ? x.label : a }),
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
      Ze,
      {
        className: "w-[var(--radix-popover-trigger-width)] p-0",
        align: "start",
        onOpenAutoFocus: (b) => {
          b.preventDefault(), v.current?.focus();
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
                onChange: (b) => p(b.target.value),
                placeholder: o,
                className: "flex h-10 flex-1 bg-transparent outline-none typo-body-md text-[var(--Text-High-Emphasis)] placeholder:text-[var(--Text-Low-Emphasis)]"
              }
            )
          ] }),
          /* @__PURE__ */ n("div", { role: "listbox", className: "max-h-60 overflow-y-auto p-1", children: g.length === 0 ? /* @__PURE__ */ n("div", { className: "py-6 text-center typo-body-sm text-[var(--Text-Low-Emphasis)]", children: s }) : g.map((b) => /* @__PURE__ */ f(
            "button",
            {
              role: "option",
              "aria-selected": b.value === t,
              disabled: b.disabled,
              onClick: () => y(b),
              className: u(
                "relative flex w-full cursor-default items-center rounded-sm py-2 pl-8 pr-2 typo-body-md outline-none transition-colors text-left",
                "hover:bg-[var(--Surface-Secondary)] focus:bg-[var(--Surface-Secondary)]",
                "disabled:pointer-events-none disabled:opacity-50",
                b.value === t && "text-[var(--Text-Accent-Primary)]"
              ),
              children: [
                b.value === t && /* @__PURE__ */ n("span", { className: "absolute left-2 flex size-4 items-center justify-center", children: /* @__PURE__ */ n("svg", { width: "12", height: "12", viewBox: "0 0 12 12", fill: "none", children: /* @__PURE__ */ n("path", { d: "M10 3L4.5 8.5L2 6", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }) }),
                b.label
              ]
            },
            b.value
          )) })
        ]
      }
    )
  ] });
}
function uu({
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
  const [h, m] = w.useState(!1), [p, v] = w.useState(""), x = w.useRef(null), g = p.trim() ? e.filter((k) => k.label.toLowerCase().includes(p.toLowerCase())) : e, y = (k) => {
    t.includes(k) ? r?.(t.filter((C) => C !== k)) : r?.([...t, k]);
  }, b = t.map((k) => e.find((C) => C.value === k)?.label).filter(Boolean), M = b.slice(0, c), T = b.length - M.length;
  return /* @__PURE__ */ f(Xe, { open: h, onOpenChange: (k) => {
    m(k), k || v("");
  }, children: [
    /* @__PURE__ */ n(Qe, { asChild: !0, children: /* @__PURE__ */ f(
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
          t.length === 0 ? /* @__PURE__ */ n("span", { className: "text-[var(--Text-Low-Emphasis)] flex-1", children: a }) : /* @__PURE__ */ f(Se, { children: [
            M.map((k) => /* @__PURE__ */ n(
              "span",
              {
                className: "inline-flex items-center gap-1 h-6 px-2 rounded-full bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)] typo-label-xs",
                children: k
              },
              k
            )),
            T > 0 && /* @__PURE__ */ f("span", { className: "inline-flex items-center h-6 px-2 rounded-full bg-[var(--Surface-Tertiary)] text-[var(--Text-Medium-Emphasis)] typo-label-xs", children: [
              "+",
              T
            ] }),
            /* @__PURE__ */ n("span", { className: "flex-1" })
          ] }),
          /* @__PURE__ */ f("span", { className: "flex items-center gap-1 ml-auto shrink-0", children: [
            d && t.length > 0 && /* @__PURE__ */ n(
              "span",
              {
                role: "button",
                "aria-label": "クリア",
                onClick: (k) => {
                  k.stopPropagation(), r?.([]);
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
      Ze,
      {
        className: "w-[var(--radix-popover-trigger-width)] p-0",
        align: "start",
        onOpenAutoFocus: (k) => {
          k.preventDefault(), x.current?.focus();
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
                ref: x,
                value: p,
                onChange: (k) => v(k.target.value),
                placeholder: o,
                className: "flex h-10 flex-1 bg-transparent outline-none typo-body-md text-[var(--Text-High-Emphasis)] placeholder:text-[var(--Text-Low-Emphasis)]"
              }
            )
          ] }),
          /* @__PURE__ */ n("div", { role: "listbox", "aria-multiselectable": "true", className: "max-h-60 overflow-y-auto p-1", children: g.length === 0 ? /* @__PURE__ */ n("div", { className: "py-6 text-center typo-body-sm text-[var(--Text-Low-Emphasis)]", children: s }) : g.map((k) => {
            const C = t.includes(k.value);
            return /* @__PURE__ */ f(
              "button",
              {
                role: "option",
                "aria-selected": C,
                disabled: k.disabled,
                onClick: () => y(k.value),
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
                  k.label
                ]
              },
              k.value
            );
          }) })
        ]
      }
    )
  ] });
}
function fu({ className: e, ...t }) {
  return /* @__PURE__ */ n("nav", { role: "navigation", "aria-label": "ページネーション", "data-slot": "pagination", className: u("mx-auto flex w-full justify-center", e), ...t });
}
function hu({ className: e, ...t }) {
  return /* @__PURE__ */ n("ul", { "data-slot": "pagination-content", className: u("flex flex-row items-center gap-1", e), ...t });
}
function mu({ ...e }) {
  return /* @__PURE__ */ n("li", { "data-slot": "pagination-item", ...e });
}
function Na({ className: e, isActive: t, size: r = "icon", ...a }) {
  return /* @__PURE__ */ n(
    "a",
    {
      "aria-current": t ? "page" : void 0,
      "data-slot": "pagination-link",
      className: u(
        lt({
          variant: t ? "default" : "ghost",
          size: r
        }),
        e
      ),
      ...a
    }
  );
}
function pu({ className: e, label: t = "前へ", ...r }) {
  return /* @__PURE__ */ f(
    Na,
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
function vu({ className: e, label: t = "次へ", ...r }) {
  return /* @__PURE__ */ f(
    Na,
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
function bu({ className: e, label: t = "その他のページ", ...r }) {
  return /* @__PURE__ */ f("span", { "aria-hidden": !0, "data-slot": "pagination-ellipsis", className: u("flex size-10 items-center justify-center", e), ...r, children: [
    /* @__PURE__ */ f("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", children: [
      /* @__PURE__ */ n("circle", { cx: "3", cy: "8", r: "1", fill: "currentColor" }),
      /* @__PURE__ */ n("circle", { cx: "8", cy: "8", r: "1", fill: "currentColor" }),
      /* @__PURE__ */ n("circle", { cx: "13", cy: "8", r: "1", fill: "currentColor" })
    ] }),
    /* @__PURE__ */ n("span", { className: "sr-only", children: t })
  ] });
}
function gu({ className: e, value: t, ...r }) {
  return /* @__PURE__ */ n(
    er.Root,
    {
      "data-slot": "progress",
      className: u("relative h-2 w-full overflow-hidden rounded-full bg-[var(--Surface-Tertiary)]", e),
      ...r,
      children: /* @__PURE__ */ n(
        er.Indicator,
        {
          "data-slot": "progress-indicator",
          className: "h-full w-full flex-1 bg-[var(--Brand-Primary)] transition-all",
          style: { transform: `translateX(-${100 - (t || 0)}%)` }
        }
      )
    }
  );
}
function xu({ className: e, ...t }) {
  return /* @__PURE__ */ n(St.Root, { "data-slot": "radio-group", className: u("grid gap-3", e), ...t });
}
function yu({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    St.Item,
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
      children: /* @__PURE__ */ n(St.Indicator, { className: "flex items-center justify-center", children: /* @__PURE__ */ n("svg", { width: "10", height: "10", viewBox: "0 0 10 10", children: /* @__PURE__ */ n("circle", { cx: "5", cy: "5", r: "5", fill: "currentColor" }) }) })
    }
  );
}
function Dl({ className: e, children: t, ...r }) {
  return /* @__PURE__ */ f(_e.Root, { "data-slot": "scroll-area", className: u("relative overflow-hidden", e), ...r, children: [
    /* @__PURE__ */ n(_e.Viewport, { className: "size-full rounded-[inherit]", children: t }),
    /* @__PURE__ */ n(Pl, {}),
    /* @__PURE__ */ n(_e.Corner, {})
  ] });
}
function Pl({
  className: e,
  orientation: t = "vertical",
  ...r
}) {
  return /* @__PURE__ */ n(
    _e.ScrollAreaScrollbar,
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
      children: /* @__PURE__ */ n(_e.ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-[var(--Border-Medium-Emphasis)]" })
    }
  );
}
function Bl({ ...e }) {
  return /* @__PURE__ */ n(ee.Root, { "data-slot": "select", ...e });
}
function wu({ ...e }) {
  return /* @__PURE__ */ n(ee.Group, { "data-slot": "select-group", ...e });
}
function Ol({ ...e }) {
  return /* @__PURE__ */ n(ee.Value, { "data-slot": "select-value", ...e });
}
function Ll({ className: e, children: t, ...r }) {
  return /* @__PURE__ */ f(
    ee.Trigger,
    {
      "data-slot": "select-trigger",
      className: u(
        "flex h-12 w-full items-center justify-between rounded-lg border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] px-3 typo-body-md text-[var(--Text-High-Emphasis)]",
        "placeholder:text-[var(--Text-Low-Emphasis)]",
        "focus:outline-none focus:ring-[3px] focus:ring-[var(--Focus-High-Emphasis)]/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "[&>span]:line-clamp-1",
        e
      ),
      ...r,
      children: [
        t,
        /* @__PURE__ */ n(ee.Icon, { asChild: !0, children: /* @__PURE__ */ n("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", className: "opacity-50", children: /* @__PURE__ */ n("path", { d: "M4 6L8 10L12 6", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }) })
      ]
    }
  );
}
function Wl({ className: e, children: t, position: r = "popper", ...a }) {
  return /* @__PURE__ */ n(ee.Portal, { children: /* @__PURE__ */ n(
    ee.Content,
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
        ee.Viewport,
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
function Il({ className: e, children: t, ...r }) {
  return /* @__PURE__ */ f(
    ee.Item,
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
        /* @__PURE__ */ n("span", { className: "absolute left-2 flex size-4 items-center justify-center", children: /* @__PURE__ */ n(ee.ItemIndicator, { children: /* @__PURE__ */ n("svg", { width: "12", height: "12", viewBox: "0 0 12 12", fill: "none", children: /* @__PURE__ */ n("path", { d: "M10 3L4.5 8.5L2 6", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }) }) }),
        /* @__PURE__ */ n(ee.ItemText, { children: t })
      ]
    }
  );
}
function ku({ className: e, ...t }) {
  return /* @__PURE__ */ n(ee.Separator, { "data-slot": "select-separator", className: u("-mx-1 my-1 h-px bg-[var(--Border-Low-Emphasis)]", e), ...t });
}
function Nu({ className: e, ...t }) {
  return /* @__PURE__ */ n(ee.Label, { "data-slot": "select-label", className: u("py-1.5 pl-8 pr-2 typo-label-sm", e), ...t });
}
function Mu({
  className: e,
  orientation: t = "horizontal",
  decorative: r = !0,
  ...a
}) {
  return /* @__PURE__ */ n(
    sn.Root,
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
const Ma = w.createContext(null);
function Sa(e) {
  if (typeof e == "number") return Math.min(1, Math.max(0, e));
  const t = parseFloat(e);
  return Number.isNaN(t) || typeof window > "u" ? 0.9 : Math.min(1, Math.max(0, t / window.innerHeight));
}
function Rt({
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
    () => (e ?? []).map(Sa),
    [e]
  ), h = t !== void 0, m = e?.[0] ?? null, [p, v] = w.useState(m), x = h ? t : p, g = w.useCallback(
    (M) => {
      h || v(M), r?.(M);
    },
    [h, r]
  );
  w.useEffect(() => {
    i && !h && e && e.length > 0 && v(e[0]);
  }, [i]);
  const y = w.useCallback(
    (M) => {
      !M && !h && e && e.length > 0 && v(e[0]), l?.(M);
    },
    [l, e, h]
  ), b = w.useMemo(() => !e || e.length === 0 ? null : {
    snapPoints: e,
    snapRatios: d,
    activeSnapPoint: x,
    setActiveSnapPoint: g,
    dismissible: o,
    fadeFromIndex: a ?? 0,
    overlay: s,
    close: () => y(!1)
  }, [
    e,
    d,
    x,
    g,
    o,
    a,
    s,
    y
  ]);
  return /* @__PURE__ */ n(Ma.Provider, { value: b, children: /* @__PURE__ */ n(
    q.Root,
    {
      "data-slot": "sheet",
      open: i,
      onOpenChange: y,
      ...c
    }
  ) });
}
function Hl({ ...e }) {
  return /* @__PURE__ */ n(q.Trigger, { "data-slot": "sheet-trigger", ...e });
}
function jl({ ...e }) {
  return /* @__PURE__ */ n(q.Close, { "data-slot": "sheet-close", ...e });
}
function Ca({ ...e }) {
  return /* @__PURE__ */ n(q.Portal, { "data-slot": "sheet-portal", ...e });
}
function Ta({
  className: e,
  glass: t = !1,
  opacity: r,
  style: a,
  ...o
}) {
  const s = r != null;
  return /* @__PURE__ */ n(
    q.Overlay,
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
function Fl() {
  return /* @__PURE__ */ n("div", { className: "flex justify-center pt-2.5 pb-1 flex-shrink-0", children: /* @__PURE__ */ n("div", { className: "w-9 h-[5px] rounded-full bg-[var(--Object-Disable)] opacity-50" }) });
}
const Al = le(
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
), _l = /* @__PURE__ */ new Set(["float-glass", "bottom-glass"]);
function Vt({
  className: e,
  children: t,
  side: r = "right",
  glassOverlay: a,
  container: o,
  ...s
}) {
  const l = w.useContext(Ma), i = a ?? _l.has(r);
  return l && r === "bottom" ? /* @__PURE__ */ n(
    zl,
    {
      snapCtx: l,
      className: e,
      glassOverlay: i,
      container: o,
      ...s,
      children: t
    }
  ) : /* @__PURE__ */ f(Ca, { container: o, children: [
    /* @__PURE__ */ n(Ta, { glass: i }),
    /* @__PURE__ */ n(
      q.Content,
      {
        "data-slot": "sheet-content",
        className: u(Al({ side: r }), "p-6", e),
        ...s,
        children: t
      }
    )
  ] });
}
function zl({
  snapCtx: e,
  className: t,
  glassOverlay: r,
  container: a,
  children: o,
  style: s,
  ...l
}) {
  const {
    snapRatios: i,
    activeSnapPoint: c,
    setActiveSnapPoint: d,
    dismissible: h,
    close: m,
    snapPoints: p,
    fadeFromIndex: v,
    overlay: x
  } = e, g = w.useMemo(
    () => i.length > 0 ? Math.max(...i) : 0.9,
    [i]
  ), y = w.useMemo(
    () => i.length > 0 ? Math.min(...i) : 0.4,
    [i]
  ), b = w.useMemo(() => c == null ? g : Sa(c), [c, g]), [M, T] = w.useState(!1), k = w.useRef(0), C = w.useRef(b), S = w.useRef(null), E = (g - b) / g * 100, I = (H) => {
    if (!(H.button != null && H.button !== 0)) {
      T(!0), k.current = H.clientY, C.current = b;
      try {
        H.currentTarget.setPointerCapture(H.pointerId);
      } catch {
      }
    }
  }, P = (H) => {
    if (!M) return;
    const $ = H.clientY - k.current, te = typeof window > "u" ? 1 : window.innerHeight, ce = Math.max(
      0,
      Math.min(g, C.current - $ / te)
    );
    d(ce);
  }, L = (H) => {
    if (!M) return;
    T(!1);
    const $ = b;
    if (h && $ < y * 0.5) {
      m();
      return;
    }
    let te = 0, ce = Math.abs($ - i[0]);
    for (let xe = 1; xe < i.length; xe++) {
      const Q = Math.abs($ - i[xe]);
      Q < ce && (ce = Q, te = xe);
    }
    d(p[te]);
  }, U = w.useMemo(() => {
    if (i.length === 0) return 1;
    const H = i[Math.min(v, i.length - 1)];
    return b <= H ? 0 : g <= H ? 1 : Math.min(1, (b - H) / (g - H));
  }, [i, v, b, g]), X = `translate3d(0, ${E}%, 0)`, ne = (H) => {
    if (H.key !== "ArrowUp" && H.key !== "ArrowDown") return;
    const $ = i.findIndex((ce) => ce === b);
    if ($ === -1) return;
    const te = H.key === "ArrowUp" ? Math.min(i.length - 1, $ + 1) : Math.max(0, $ - 1);
    te !== $ && (H.preventDefault(), d(p[te]));
  };
  return /* @__PURE__ */ f(Ca, { container: a, children: [
    x && /* @__PURE__ */ n(Ta, { glass: r, opacity: U }),
    /* @__PURE__ */ f(
      q.Content,
      {
        ref: S,
        "data-slot": "sheet-content",
        "data-snap-active": c ?? void 0,
        onKeyDown: ne,
        className: u(
          "fixed inset-x-0 bottom-0 z-50 flex flex-col",
          "bg-[var(--Surface-Primary)] rounded-t-[32px] shadow-[var(--shadow-dialog)]",
          // Suppress Radix open/close fade — we manage transform ourselves
          "data-[state=open]:animate-none data-[state=closed]:animate-none",
          "outline-none",
          t
        ),
        style: {
          ...s,
          height: `${g * 100}svh`,
          transform: X,
          transition: M ? "none" : "transform 320ms cubic-bezier(0.32, 0.72, 0, 1)",
          willChange: "transform",
          touchAction: "none"
        },
        ...l,
        children: [
          /* @__PURE__ */ n(
            "div",
            {
              onPointerDown: I,
              onPointerMove: P,
              onPointerUp: L,
              onPointerCancel: L,
              className: "cursor-grab active:cursor-grabbing select-none",
              children: /* @__PURE__ */ n(Fl, {})
            }
          ),
          /* @__PURE__ */ n(
            "div",
            {
              className: "flex-1 min-h-0 overflow-y-auto",
              style: {
                maxHeight: `calc(${b * 100}svh - 22px)`,
                transition: M ? "none" : "max-height 320ms cubic-bezier(0.32, 0.72, 0, 1)"
              },
              children: o
            }
          )
        ]
      }
    )
  ] });
}
function qt({ className: e, ...t }) {
  return /* @__PURE__ */ n("div", { "data-slot": "sheet-header", className: u("flex flex-col gap-2", e), ...t });
}
function Su({ className: e, ...t }) {
  return /* @__PURE__ */ n("div", { "data-slot": "sheet-footer", className: u("flex flex-col gap-2 mt-auto", e), ...t });
}
function Gt({ className: e, ...t }) {
  return /* @__PURE__ */ n(q.Title, { "data-slot": "sheet-title", className: u("typo-heading-lg text-[var(--Text-High-Emphasis)]", e), ...t });
}
function Ea({ className: e, ...t }) {
  return /* @__PURE__ */ n(q.Description, { "data-slot": "sheet-description", className: u("typo-body-md text-[var(--Text-Medium-Emphasis)]", e), ...t });
}
function Cu({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    "div",
    {
      "data-slot": "skeleton",
      className: u("animate-pulse rounded-lg bg-[var(--Surface-Tertiary)]", e),
      ...t
    }
  );
}
function Tu({
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
    et.Root,
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
          et.Track,
          {
            "data-slot": "slider-track",
            className: "relative grow overflow-hidden rounded-full bg-[var(--Surface-Tertiary)] data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
            children: /* @__PURE__ */ n(
              et.Range,
              {
                "data-slot": "slider-range",
                className: "absolute bg-[var(--Brand-Primary)] data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
              }
            )
          }
        ),
        Array.from({ length: l.length }, (i, c) => /* @__PURE__ */ n(
          et.Thumb,
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
function Eu({ className: e, size: t = "md", label: r = "読み込み中", ...a }) {
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
function Du({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    tr.Root,
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
        tr.Thumb,
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
function Pu({ className: e, ...t }) {
  return /* @__PURE__ */ n(it.Root, { "data-slot": "tabs", className: u("flex flex-col gap-2", e), ...t });
}
function Bu({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    it.List,
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
function Ou({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    it.Trigger,
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
function Lu({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    it.Content,
    {
      "data-slot": "tabs-content",
      className: u("mt-2 focus-visible:outline-none", e),
      ...t
    }
  );
}
function Wu({ className: e, autoGrow: t, onChange: r, ...a }) {
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
function Yl({ delayDuration: e = 0, ...t }) {
  return /* @__PURE__ */ n($e.Provider, { "data-slot": "tooltip-provider", delayDuration: e, ...t });
}
function Iu({ ...e }) {
  return /* @__PURE__ */ n(Yl, { children: /* @__PURE__ */ n($e.Root, { "data-slot": "tooltip", ...e }) });
}
function Hu({ ...e }) {
  return /* @__PURE__ */ n($e.Trigger, { "data-slot": "tooltip-trigger", ...e });
}
function ju({ className: e, sideOffset: t = 4, children: r, ...a }) {
  return /* @__PURE__ */ n($e.Portal, { children: /* @__PURE__ */ n(
    $e.Content,
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
const $l = {
  sm: { size: 32, stroke: 3 },
  md: { size: 48, stroke: 4 },
  lg: { size: 64, stroke: 5 },
  xl: { size: 96, stroke: 6 }
};
function Fu({
  value: e,
  size: t = "md",
  label: r,
  showLabel: a = !0,
  className: o
}) {
  const { size: s, stroke: l } = $l[t], i = (s - l) / 2, c = 2 * Math.PI * i, d = Math.min(100, Math.max(0, e)), h = c * (1 - d / 100);
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
const Rl = {
  sm: { wrap: "h-9 gap-2", btn: "w-8 h-8", icon: 14, text: "typo-label-sm w-8" },
  md: { wrap: "h-12 gap-3", btn: "w-10 h-10", icon: 16, text: "typo-body-md w-10" }
};
function Au({
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
  const [p, v] = w.useState(String(e)), [x, g] = w.useState(!1);
  w.useEffect(() => {
    x || v(String(e));
  }, [e, x]);
  const y = (S) => {
    const E = parseFloat(S.replace(/[^0-9.-]/g, ""));
    if (isNaN(E)) {
      v(String(e));
      return;
    }
    const I = Math.min(a, Math.max(r, E));
    v(String(I)), t?.(I);
  }, b = () => {
    const S = Math.min(a, e + o);
    v(String(S)), t?.(S);
  }, M = () => {
    const S = Math.max(r, e - o);
    v(String(S)), t?.(S);
  }, T = x ? p : s ? s(e) : p, k = Rl[c], C = u(
    "flex items-center justify-center rounded-full border shrink-0 transition-colors select-none",
    k.btn,
    "border-[var(--Border-Medium-Emphasis)] text-[var(--Object-Medium-Emphasis)]",
    "hover:border-[var(--Brand-Primary)] hover:text-[var(--Brand-Primary)] hover:bg-[var(--Brand-Ultra-Light)]",
    "active:scale-95",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[var(--Border-Medium-Emphasis)] disabled:hover:text-[var(--Object-Medium-Emphasis)] disabled:hover:bg-transparent"
  );
  return /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "number-input",
      className: u("inline-flex items-center", k.wrap, i && "opacity-50 pointer-events-none", d),
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
            children: /* @__PURE__ */ n("svg", { width: k.icon, height: k.icon, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ n("path", { d: "M3 8h10", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }) })
          }
        ),
        /* @__PURE__ */ n(
          "input",
          {
            type: "text",
            inputMode: "decimal",
            value: T,
            placeholder: l,
            disabled: i,
            onChange: (S) => v(S.target.value),
            onFocus: () => {
              g(!0), v(String(e));
            },
            onBlur: (S) => {
              g(!1), y(S.target.value);
            },
            onKeyDown: (S) => {
              S.key === "Enter" && S.target.blur(), S.key === "ArrowUp" && (S.preventDefault(), b()), S.key === "ArrowDown" && (S.preventDefault(), M());
            },
            className: u(
              "text-center bg-transparent outline-none text-[var(--Text-High-Emphasis)] placeholder:text-[var(--Text-Low-Emphasis)] tabular-nums",
              k.text
            )
          }
        ),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            tabIndex: -1,
            disabled: i || e >= a,
            onClick: b,
            "aria-label": m,
            className: C,
            children: /* @__PURE__ */ n("svg", { width: k.icon, height: k.icon, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ n("path", { d: "M8 3v10M3 8h10", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }) })
          }
        )
      ]
    }
  );
}
const Vl = {
  sm: "h-8 px-3 typo-label-xs gap-1",
  md: "h-9 px-4 typo-label-sm gap-1.5"
};
function _u({
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
              Vl[a],
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
const ql = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8"
}, Gl = {
  sm: "typo-label-xs",
  md: "typo-label-sm",
  lg: "typo-label-md",
  xl: "typo-label-lg"
};
function Ul({ filled: e, half: t, className: r }) {
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
function zu({
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
          const p = m + 1, v = d >= p, x = !v && d >= p - 0.5;
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
                ql[a],
                c ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default pointer-events-none",
                !v && !x && "text-[var(--Border-Medium-Emphasis)]"
              ),
              children: /* @__PURE__ */ n(
                Ul,
                {
                  filled: v,
                  half: x,
                  className: "w-full h-full"
                }
              )
            },
            m
          );
        }),
        o && /* @__PURE__ */ f("span", { className: u("ml-1 text-[var(--Text-Medium-Emphasis)]", Gl[a]), children: [
          e,
          "/",
          r
        ] })
      ]
    }
  );
}
function He(e) {
  return String(e).padStart(2, "0");
}
function kr(e) {
  const t = Math.max(0, e.getTime() - Date.now()), r = Math.floor(t / 1e3), a = Math.floor(r / 3600), o = Math.floor(r % 3600 / 60), s = r % 60;
  return { h: a, m: o, s, totalSec: r };
}
function Yu({
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
  const [m, p] = w.useState(() => kr(e)), [v, x] = w.useState(() => {
    const C = Date.now();
    return e.getTime() - 0, C >= e.getTime() ? "ended" : "active";
  }), g = w.useRef(!1);
  if (w.useEffect(() => {
    g.current = !1;
    const C = () => {
      const E = kr(e);
      p(E), E.totalSec === 0 && !g.current && (g.current = !0, x("ended"), i?.());
    };
    C();
    const S = setInterval(C, 1e3);
    return () => clearInterval(S);
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
  const { h: y, m: b, s: M } = m, T = s ? [{ num: He(b), unit: d }, { num: He(M), unit: h }] : [
    ...y > 0 ? [{ num: He(y), unit: c }] : [],
    { num: He(b), unit: d },
    { num: He(M), unit: h }
  ], k = o === "filled";
  return /* @__PURE__ */ f(
    "span",
    {
      "data-slot": "countdown-timer",
      "data-state": "active",
      "data-variant": o,
      "aria-live": "off",
      "aria-label": `${r} ${y}${c}${b}${d}${M}${h}`,
      className: u(
        "inline-flex items-center gap-1 px-3 py-2 rounded-lg font-variant-nums",
        k ? "bg-[var(--Brand-Primary)] text-white" : "border-2 border-[var(--Brand-Primary)] text-[var(--Brand-Primary)]",
        l
      ),
      children: [
        r && /* @__PURE__ */ n("span", { className: "text-[11px] font-semibold opacity-80 mr-1", children: r }),
        T.map((C, S) => /* @__PURE__ */ f(w.Fragment, { children: [
          S > 0 && /* @__PURE__ */ n("span", { className: "text-[18px] font-bold opacity-70 mb-1.5", children: ":" }),
          /* @__PURE__ */ f("span", { className: "flex flex-col items-center gap-0", children: [
            /* @__PURE__ */ n("span", { className: "text-[22px] font-black leading-none tabular-nums", children: C.num }),
            /* @__PURE__ */ n("span", { className: "text-[9px] font-semibold opacity-70 leading-none mt-0.5", children: C.unit })
          ] })
        ] }, C.unit))
      ]
    }
  );
}
function $u({
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
const Xl = {
  top: "top",
  bottom: "bottom",
  left: "left",
  right: "right"
};
function Ru({
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
  return /* @__PURE__ */ n(Te.Provider, { delayDuration: m, children: /* @__PURE__ */ f(Te.Root, { open: o, onOpenChange: s, children: [
    /* @__PURE__ */ n(Te.Trigger, { asChild: !0, children: t }),
    /* @__PURE__ */ n(Te.Portal, { children: /* @__PURE__ */ f(
      Te.Content,
      {
        side: Xl[r],
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
            /* @__PURE__ */ n("p", { className: "font-medium", children: e }),
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
            Te.Arrow,
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
const Ql = {
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
function Vu({
  provider: e,
  loading: t = !1,
  fullWidth: r = !1,
  className: a,
  disabled: o,
  children: s,
  ...l
}) {
  const i = Ql[e];
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
const Zl = {
  square: "aspect-square",
  "4/3": "aspect-[4/3]",
  "16/9": "aspect-video",
  "3/4": "aspect-[3/4]"
};
function qu({
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
  }, x = (y) => {
    if (p.current === null) return;
    const b = y.changedTouches[0].clientX - p.current;
    Math.abs(b) > 40 && (b < 0 ? m() : h()), p.current = null;
  }, g = e[c];
  return /* @__PURE__ */ f("div", { "data-slot": "image-gallery", className: u("flex flex-col gap-2", o), children: [
    /* @__PURE__ */ f(
      "div",
      {
        className: u(
          "relative w-full overflow-hidden rounded-xl bg-[var(--Surface-Tertiary)] cursor-pointer",
          Zl[r] ?? "aspect-[4/3]"
        ),
        onTouchStart: v,
        onTouchEnd: x,
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
          e.length > 1 && /* @__PURE__ */ f(Se, { children: [
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
    t === "thumbnail" && e.length > 1 && /* @__PURE__ */ n("div", { className: "flex gap-1.5 overflow-x-auto scrollbar-none", children: e.map((y, b) => /* @__PURE__ */ n(
      "button",
      {
        onClick: () => d(b),
        "aria-label": i(b),
        "aria-pressed": b === c,
        className: u(
          "flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors bg-[var(--Surface-Tertiary)]",
          b === c ? "border-[var(--Brand-Primary)]" : "border-transparent hover:border-[var(--Border-Medium-Emphasis)]"
        ),
        children: /* @__PURE__ */ n("img", { src: y.src, alt: y.alt ?? i(b), className: "w-full h-full object-cover" })
      },
      b
    )) }),
    t === "dot" && e.length > 1 && /* @__PURE__ */ n("div", { className: "flex items-center justify-center gap-1.5", children: e.map((y, b) => /* @__PURE__ */ n(
      "button",
      {
        onClick: () => d(b),
        "aria-label": i(b),
        className: u(
          "rounded-full transition-all",
          b === c ? "w-4 h-1.5 bg-[var(--Brand-Primary)]" : "w-1.5 h-1.5 bg-[var(--Border-Medium-Emphasis)] hover:bg-[var(--Text-Low-Emphasis)]"
        )
      },
      b
    )) })
  ] });
}
function Kl({ size: e = 20 }) {
  return /* @__PURE__ */ n("svg", { width: e, height: e, viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ n("path", { d: "M18 6L6 18M6 6l12 12", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round" }) });
}
function Jl({ size: e = 20 }) {
  return /* @__PURE__ */ n("svg", { width: e, height: e, viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ n("path", { d: "M15 18l-6-6 6-6", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round" }) });
}
function ec({ size: e = 20 }) {
  return /* @__PURE__ */ f("svg", { width: e, height: e, viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ n("path", { d: "M12 3v12M8 7l4-4 4 4", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round" }),
    /* @__PURE__ */ n("path", { d: "M7 11H5a2 2 0 00-2 2v6a2 2 0 002 2h14a2 2 0 002-2v-6a2 2 0 00-2-2h-2", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round" })
  ] });
}
function Gu({
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
  const h = () => t === "back" ? /* @__PURE__ */ n(Jl, {}) : t === "close" ? /* @__PURE__ */ n(Kl, {}) : t, m = t === "close" ? "閉じる" : "戻る", p = i ? "glass" : "secondary";
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
          Le,
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
          Le,
          {
            variant: p,
            size: "icon-xl",
            "aria-label": l,
            onClick: s,
            children: /* @__PURE__ */ n(ec, {})
          }
        ) : null) })
      ]
    }
  );
}
function Uu({
  leading: e,
  title: t,
  subtitle: r,
  trailing: a,
  sticky: o = !1,
  bordered: s = !0,
  variant: l = "default",
  className: i
}) {
  const c = l === "glass", d = l === "transparent";
  return /* @__PURE__ */ f(
    "header",
    {
      "data-slot": "app-header",
      "data-variant": l,
      className: u(
        "flex items-center gap-2 h-14 px-4",
        // 背景
        c && "glass",
        !c && !d && "bg-[var(--Surface-Primary)]",
        // ボーダー
        s && !c && !d && "border-b border-[var(--Border-Low-Emphasis)]",
        s && c && "border-b border-[rgba(255,255,255,0.25)]",
        // Sticky
        o && "sticky top-0 z-40",
        i
      ),
      children: [
        e && /* @__PURE__ */ n("div", { className: "flex items-center shrink-0", children: e }),
        /* @__PURE__ */ f("div", { className: "flex-1 flex flex-col justify-center min-w-0", children: [
          t && (typeof t == "string" ? /* @__PURE__ */ n("span", { className: "typo-heading-sm text-[var(--Text-High-Emphasis)] truncate", children: t }) : t),
          r && (typeof r == "string" ? /* @__PURE__ */ n("span", { className: "typo-body-xs text-[var(--Text-Medium-Emphasis)] truncate", children: r }) : r)
        ] }),
        a && /* @__PURE__ */ n("div", { className: "flex items-center gap-1 shrink-0", children: a })
      ]
    }
  );
}
function Xu({
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
    (g) => {
      const y = g.trim();
      y && (!s && e.includes(y) || o !== void 0 && e.length >= o || (t?.([...e, y]), d("")));
    },
    [e, t, s, o]
  ), v = w.useCallback(
    (g) => {
      t?.(e.filter((y, b) => b !== g));
    },
    [e, t]
  ), x = (g) => {
    g.key === "Enter" && (g.preventDefault(), m.current = !0, p(c)), g.key === "Backspace" && c === "" && e.length > 0 && v(e.length - 1), g.key === "," && (g.preventDefault(), p(c));
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
        e.map((g, y) => /* @__PURE__ */ f(
          "span",
          {
            className: "inline-flex items-center gap-1 h-7 px-2.5 rounded-full bg-[var(--Brand-Ultra-Light)] text-[var(--Text-Accent-Primary)] typo-label-sm",
            children: [
              g,
              !a && /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  onClick: (b) => {
                    b.stopPropagation(), v(y);
                  },
                  className: "flex items-center justify-center w-3.5 h-3.5 rounded-full hover:bg-[var(--Brand-Light)] transition-colors",
                  "aria-label": `${g} を削除`,
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
            onChange: (g) => d(g.target.value),
            onKeyDown: x,
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
const tc = 72;
function Qu({ children: e, actions: t = [], side: r = "right", className: a }) {
  const [o, s] = w.useState(0), [l, i] = w.useState(!1), c = w.useRef(0), d = w.useRef(0), h = w.useRef(null), m = t.length * tc, p = Math.abs(o) > m / 2, v = w.useCallback((M) => {
    s(M);
  }, []), x = (M) => {
    c.current = M.clientX, d.current = o, i(!0), h.current?.setPointerCapture(M.pointerId);
  }, g = (M) => {
    if (!l) return;
    const T = M.clientX - c.current, k = d.current + T, S = Math.min(0, Math.max((r === "right" ? -1 : 1) * m, k));
    s(S);
  }, y = () => {
    if (!l) return;
    i(!1), v(p ? (r === "right" ? -1 : 1) * m : 0);
  }, b = () => v(0);
  return t.length === 0 ? /* @__PURE__ */ n("div", { className: a, children: e }) : /* @__PURE__ */ f("div", { className: u("relative overflow-hidden", a), children: [
    /* @__PURE__ */ n(
      "div",
      {
        className: u(
          "absolute inset-y-0 flex",
          r === "right" ? "right-0" : "left-0"
        ),
        style: { width: m },
        children: t.map((M, T) => /* @__PURE__ */ f(
          "button",
          {
            type: "button",
            onClick: () => {
              M.onClick(), b();
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
          T
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
        onPointerDown: x,
        onPointerMove: g,
        onPointerUp: y,
        onPointerCancel: y,
        children: e
      }
    )
  ] });
}
function we(e) {
  const [t, r] = w.useState(!1);
  return w.useEffect(() => {
    const a = window.matchMedia(e);
    r(a.matches);
    const o = (s) => r(s.matches);
    return a.addEventListener("change", o), () => a.removeEventListener("change", o);
  }, [e]), t;
}
function rc({ children: e, ...t }) {
  return we("(min-width: 768px)") ? /* @__PURE__ */ n(Dn, { ...t, children: e }) : /* @__PURE__ */ n(Rt, { ...t, children: e });
}
function Zu({ children: e, ...t }) {
  return we("(min-width: 768px)") ? /* @__PURE__ */ n(Pn, { ...t, children: e }) : /* @__PURE__ */ n(Hl, { ...t, children: e });
}
function ac({ children: e, className: t, ...r }) {
  return we("(min-width: 768px)") ? /* @__PURE__ */ n(Wn, { className: t, ...r, children: e }) : /* @__PURE__ */ n(Vt, { side: "bottom", className: t, children: e });
}
function nc({ children: e, ...t }) {
  return we("(min-width: 768px)") ? /* @__PURE__ */ n(In, { ...t, children: e }) : /* @__PURE__ */ n(qt, { ...t, children: e });
}
function oc({ children: e, ...t }) {
  return we("(min-width: 768px)") ? /* @__PURE__ */ n(jn, { ...t, children: e }) : /* @__PURE__ */ n(Gt, { ...t, children: e });
}
function sc({ children: e, ...t }) {
  return we("(min-width: 768px)") ? /* @__PURE__ */ n(Fn, { ...t, children: e }) : /* @__PURE__ */ n(Ea, { ...t, children: e });
}
function ic({ children: e, ...t }) {
  return we("(min-width: 768px)") ? /* @__PURE__ */ n(Hn, { ...t, children: e }) : /* @__PURE__ */ n("div", { "data-slot": "sheet-footer", className: "flex flex-col gap-2 mt-auto", ...t, children: e });
}
function Ku({ children: e, ...t }) {
  return we("(min-width: 768px)") ? /* @__PURE__ */ n(On, { ...t, children: e }) : /* @__PURE__ */ n(jl, { ...t, children: e });
}
function Ju({
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
  return /* @__PURE__ */ n(rc, { open: e, onOpenChange: t, children: /* @__PURE__ */ f(ac, { children: [
    /* @__PURE__ */ f(nc, { children: [
      /* @__PURE__ */ n(oc, { children: r }),
      a && /* @__PURE__ */ n(sc, { children: a })
    ] }),
    /* @__PURE__ */ f(ic, { className: "mt-4", children: [
      /* @__PURE__ */ n(
        Le,
        {
          variant: "secondary",
          onClick: () => t(!1),
          disabled: p,
          children: s
        }
      ),
      /* @__PURE__ */ n(
        Le,
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
function ef({
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
  const [h, m] = w.useState(!1), p = i || h, v = w.useCallback(async (x) => {
    x.preventDefault(), m(!0);
    try {
      await l(), t(!1);
    } finally {
      m(!1);
    }
  }, [l, t]);
  return /* @__PURE__ */ n(Rt, { open: e, onOpenChange: t, children: /* @__PURE__ */ f(
    Vt,
    {
      side: "bottom",
      className: u("p-0 rounded-t-[32px] max-h-[90dvh] flex flex-col", d),
      children: [
        /* @__PURE__ */ f(qt, { className: "px-5 pt-6 shrink-0", children: [
          /* @__PURE__ */ n(Gt, { className: "!text-[28px] !font-bold", children: r }),
          a && /* @__PURE__ */ n(Ea, { children: a })
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
                  Le,
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
                  Le,
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
const lc = le(
  "inline-flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer typo-label-sm",
  {
    variants: {
      variant: {
        filled: "bg-[var(--Surface-Secondary)] text-[var(--Text-High-Emphasis)] hover:bg-[var(--Surface-Tertiary)]",
        accent: "bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)] hover:bg-[var(--Hover-Secondary-Button)]",
        outline: "border border-[var(--Border-Medium-Emphasis)] text-[var(--Text-High-Emphasis)] hover:bg-[var(--Surface-Secondary)]"
      },
      size: {
        sm: "h-7 px-2.5 typo-label-xs",
        md: "h-8 px-3 typo-label-sm",
        lg: "h-9 px-4 typo-label-sm"
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
function cc({
  className: e,
  variant: t,
  size: r,
  shape: a,
  selected: o,
  removable: s,
  onRemove: l,
  children: i,
  ...c
}) {
  return /* @__PURE__ */ f(
    "button",
    {
      "data-slot": "chip",
      "data-selected": o || void 0,
      className: u(
        lc({ variant: t, size: r, shape: a }),
        // 選択状態は Brand-Primary 背景 + 白文字 + bold で強調。
        // 他 CTA / PillRow と一貫した「選択 = ピンク + 白文字」表現に揃える。
        o && "!bg-[var(--Brand-Primary)] !text-[var(--Text-on-Inverse)] hover:!bg-[var(--Hover-Primary-Button)] !border-[var(--Brand-Primary)] font-bold",
        e
      ),
      ...c,
      children: [
        i,
        s && /* @__PURE__ */ n(
          "span",
          {
            role: "button",
            "aria-label": "削除",
            onClick: (d) => {
              d.stopPropagation(), l?.();
            },
            className: "ml-0.5 hover:text-[var(--Text-Caution)]",
            children: /* @__PURE__ */ n("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", children: /* @__PURE__ */ n("path", { d: "M4 4L10 10M10 4L4 10", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }) })
          }
        )
      ]
    }
  );
}
function tf({
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
          cc,
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
const dc = le(
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
function rf({
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
      className: u(dc({ variant: t }), e),
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
function af({
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
function nf({
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
function of({
  className: e,
  label: t,
  htmlFor: r,
  required: a,
  error: o,
  description: s,
  children: l,
  ...i
}) {
  return /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "form-field",
      className: u("flex flex-col gap-1.5", e),
      ...i,
      children: [
        /* @__PURE__ */ f(
          "label",
          {
            htmlFor: r,
            className: "typo-label-md text-[var(--Text-High-Emphasis)]",
            children: [
              t,
              a && /* @__PURE__ */ n("span", { className: "text-[var(--Text-Caution)] ml-1", "aria-hidden": "true", children: "*" })
            ]
          }
        ),
        l,
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
function sf({
  className: e,
  leftSlot: t,
  rightSlot: r,
  bottomSlot: a,
  title: o,
  description: s,
  interactive: l = !1,
  children: i,
  ...c
}) {
  return /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "list-item",
      className: u(
        "flex items-start gap-3 py-3 px-4 border-b border-[var(--Border-Low-Emphasis)]",
        l && "cursor-pointer hover:bg-[var(--Surface-Secondary)] transition-colors",
        e
      ),
      ...c,
      children: [
        t && /* @__PURE__ */ n("div", { className: "shrink-0", children: t }),
        /* @__PURE__ */ f("div", { className: "flex-1 min-w-0", children: [
          o && /* @__PURE__ */ n("p", { className: "typo-label-md text-[var(--Text-High-Emphasis)] truncate", children: o }),
          s && /* @__PURE__ */ n("p", { className: "typo-body-sm text-[var(--Text-Medium-Emphasis)] mt-0.5", children: s }),
          i,
          a && /* @__PURE__ */ n("div", { className: "mt-2", children: a })
        ] }),
        r && /* @__PURE__ */ n("div", { className: "shrink-0", children: r })
      ]
    }
  );
}
const uc = {
  xs: "size-1.5 min-w-0 px-0",
  sm: "min-w-4 h-4 px-1 typo-label-xs",
  default: "min-w-5 h-5 px-1.5 typo-label-xs"
};
function lf({
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
        uc[a],
        e
      ),
      ...o,
      children: a !== "xs" && s
    }
  );
}
function cf({
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
function df({
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
function fc({
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
const hc = {
  default: { card: "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]", icon: "text-[var(--Object-Medium-Emphasis)]" },
  success: { card: "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Success)]", icon: "text-[var(--Object-Success)]" },
  caution: { card: "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Caution)]", icon: "text-[var(--Object-Caution)]" },
  info: { card: "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Info)]", icon: "text-[var(--Text-Info)]" },
  accent: { card: "border-[var(--Brand-Primary)]/20 bg-[var(--Surface-Accent-Primary-Light)]", icon: "text-[var(--Object-Accent-Primary)]" }
};
function uf({
  className: e,
  label: t,
  value: r,
  unit: a,
  trend: o,
  icon: s,
  variant: l = "default",
  ...i
}) {
  const c = hc[l];
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
const mc = le(
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
function ff({
  className: e,
  variant: t,
  ...r
}) {
  return /* @__PURE__ */ n(
    "span",
    {
      "data-slot": "tag",
      className: u(mc({ variant: t }), e),
      ...r
    }
  );
}
const pc = le(
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
), Da = w.createContext(null);
function hf() {
  const e = w.useContext(Da);
  if (!e) throw new Error("useToast must be used within <Toaster>");
  return e;
}
function mf({ children: e }) {
  const [t, r] = w.useState([]), a = w.useCallback((s) => {
    const l = Math.random().toString(36).slice(2);
    r((i) => [...i, { id: l, ...s }]), setTimeout(() => {
      r((i) => i.filter((c) => c.id !== l));
    }, s.duration || 5e3);
  }, []), o = w.useCallback((s) => {
    r((l) => l.filter((i) => i.id !== s));
  }, []);
  return /* @__PURE__ */ f(Da.Provider, { value: { toast: a }, children: [
    e,
    typeof document < "u" && pn(
      /* @__PURE__ */ n(
        "div",
        {
          "data-slot": "toast-viewport",
          className: "fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none",
          children: t.map((s) => /* @__PURE__ */ f("div", { className: u(pc({ variant: s.variant })), children: [
            /* @__PURE__ */ f("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ n("p", { className: "typo-label-md", children: s.title }),
              s.description && /* @__PURE__ */ n("p", { className: "typo-body-sm mt-0.5 opacity-80", children: s.description })
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                "data-slot": "button",
                onClick: () => o(s.id),
                className: "shrink-0 text-[var(--Object-Medium-Emphasis)] hover:text-[var(--Object-High-Emphasis)] cursor-pointer",
                "aria-label": "閉じる",
                children: /* @__PURE__ */ n("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ n("path", { d: "M4 4L12 12M12 4L4 12", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) })
              }
            )
          ] }, s.id))
        }
      ),
      document.body
    )
  ] });
}
function pf({
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
            children: /* @__PURE__ */ n(Dl, { className: "flex-1", children: t })
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
function vf({
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
function bf({
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
function gf({ className: e, preventDefault: t = !0, onSubmit: r, ...a }) {
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
function xf({ className: e, title: t, description: r, children: a, ...o }) {
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
function yf({ className: e, ...t }) {
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
const vc = le("inline-flex items-baseline gap-0.5 text-[var(--Text-High-Emphasis)]", {
  variants: {
    size: {
      sm: "typo-label-md",
      md: "typo-label-lg",
      lg: "typo-heading-lg",
      xl: "typo-heading-3xl"
    }
  },
  defaultVariants: { size: "md" }
}), bc = { sm: "typo-body-xs", md: "typo-body-sm", lg: "typo-body-md", xl: "typo-body-lg" }, gc = { sm: "typo-body-xs", md: "typo-body-xs", lg: "typo-body-sm", xl: "typo-body-lg" };
function Nr({ className: e, price: t, maxPrice: r, originalPrice: a, showTaxLabel: o = !0, currency: s = "¥", size: l = "md", ...i }) {
  const c = (p) => p.toLocaleString("ja-JP"), d = a != null && a > t, h = r != null && r > t, m = l ?? "md";
  return /* @__PURE__ */ f("div", { "data-slot": "price-display", className: u("flex flex-col", e), role: "group", "aria-label": `${s}${c(t)} 税込`, ...i, children: [
    d && /* @__PURE__ */ f("span", { "aria-hidden": !0, className: u("text-[var(--Text-Low-Emphasis)] line-through", bc[m]), children: [
      s,
      c(a)
    ] }),
    /* @__PURE__ */ f("span", { "aria-hidden": !0, className: u(vc({ size: l }), d && "text-[var(--Text-Caution)]"), children: [
      h ? /* @__PURE__ */ f(Se, { children: [
        s,
        c(t),
        "〜",
        s,
        c(r)
      ] }) : /* @__PURE__ */ f(Se, { children: [
        s,
        c(t)
      ] }),
      o && /* @__PURE__ */ n("span", { className: u("ml-0.5 text-[var(--Text-Low-Emphasis)]", gc[m]), children: "税込" })
    ] })
  ] });
}
function xc({ size: e = 14, className: t }) {
  return /* @__PURE__ */ n("svg", { width: e, height: e, viewBox: "0 0 16 16", fill: "currentColor", className: t, "aria-hidden": !0, children: /* @__PURE__ */ n("path", { d: "M8 1.3l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9L4.4 12.3l.7-4L2.2 5.5l4-.6L8 1.3z" }) });
}
const yc = {
  sm: { icon: 12, val: "typo-label-sm", cnt: "typo-body-xs" },
  md: { icon: 14, val: "typo-label-md", cnt: "typo-body-sm" },
  lg: { icon: 18, val: "typo-label-lg", cnt: "typo-body-md" }
};
function Mr({ className: e, rating: t, reviewCount: r, size: a = "sm", showCount: o = !0, showValue: s = !0, ...l }) {
  const i = Math.max(0, Math.min(5, t)), { icon: c, val: d, cnt: h } = yc[a];
  return /* @__PURE__ */ f("div", { "data-slot": "rating-display", className: u("inline-flex items-center gap-0.5", e), role: "img", "aria-label": `評価 ${i.toFixed(1)} / 5${r != null ? ` (${r}件)` : ""}`, ...l, children: [
    /* @__PURE__ */ n(xc, { size: c, className: "text-[var(--Brand-Primary)]" }),
    s && /* @__PURE__ */ n("span", { className: u("text-[var(--Brand-Primary)]", d), children: i.toFixed(2) }),
    o && r != null && /* @__PURE__ */ f("span", { className: u("text-[var(--Text-Low-Emphasis)]", h), children: [
      "(",
      r.toLocaleString("ja-JP"),
      ")"
    ] })
  ] });
}
function Sr({ size: e = 14 }) {
  return /* @__PURE__ */ n("svg", { width: e, height: e, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ n("path", { d: "M4 8h8", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) });
}
function Cr({ size: e = 14 }) {
  return /* @__PURE__ */ n("svg", { width: e, height: e, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ n("path", { d: "M8 4v8M4 8h8", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) });
}
function Tr({ size: e = 14 }) {
  return /* @__PURE__ */ n("svg", { width: e, height: e, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ n("path", { d: "M3 4h10M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1M5 4v8a1 1 0 001 1h4a1 1 0 001-1V4", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) });
}
function wf({ className: e, value: t, min: r = 1, max: a = 99, onChange: o, disabled: s = !1, size: l = "md", showTrash: i = !1, onDelete: c, ...d }) {
  const h = i && t <= r, m = t > r && !s, p = t < a && !s, v = () => {
    if (h) {
      c?.();
      return;
    }
    m && o?.(t - 1);
  }, x = () => {
    p && o?.(t + 1);
  };
  return l === "sm" ? /* @__PURE__ */ f("div", { "data-slot": "quantity-selector", className: u("inline-flex h-9 w-[108px] items-center justify-between rounded-full bg-[var(--Surface-Tertiary)] px-2.5", s && "opacity-50", e), role: "group", "aria-label": "数量選択", ...d, children: [
    /* @__PURE__ */ n("button", { type: "button", className: u("flex size-7 items-center justify-center rounded-full", m || h ? "text-[var(--Object-High-Emphasis)]" : "text-[var(--Object-Disable)]"), onClick: v, disabled: !(m || h && !s), "aria-label": h ? "削除" : "数量を減らす", children: h ? /* @__PURE__ */ n(Tr, { size: 14 }) : /* @__PURE__ */ n(Sr, { size: 14 }) }),
    /* @__PURE__ */ n("span", { className: u("w-7 text-center typo-label-md select-none", s ? "text-[var(--Text-Disable)]" : "text-[var(--Text-High-Emphasis)]"), "aria-live": "polite", children: t }),
    /* @__PURE__ */ n("button", { type: "button", className: u("flex size-7 items-center justify-center rounded-full", p ? "text-[var(--Object-High-Emphasis)]" : "text-[var(--Object-Disable)]"), onClick: x, disabled: !p, "aria-label": "数量を増やす", children: /* @__PURE__ */ n(Cr, { size: 14 }) })
  ] }) : /* @__PURE__ */ f("div", { "data-slot": "quantity-selector", className: u("inline-flex items-center gap-3", e), role: "group", "aria-label": "数量選択", ...d, children: [
    /* @__PURE__ */ n("button", { type: "button", className: u("flex size-10 items-center justify-center rounded-full border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] transition-colors", m || h ? "text-[var(--Object-High-Emphasis)] hover:bg-[var(--Surface-Tertiary)]" : "text-[var(--Object-Disable)]"), onClick: v, disabled: !(m || h && !s), "aria-label": h ? "削除" : "数量を減らす", children: h ? /* @__PURE__ */ n(Tr, { size: 18 }) : /* @__PURE__ */ n(Sr, { size: 18 }) }),
    /* @__PURE__ */ n("span", { className: u("flex h-10 w-12 items-center justify-center rounded-lg border border-[var(--Border-Medium-Emphasis)] typo-label-lg select-none", s ? "bg-[var(--Surface-Tertiary)] text-[var(--Text-Disable)]" : "bg-[var(--Surface-Secondary)] text-[var(--Text-High-Emphasis)]"), "aria-live": "polite", children: t }),
    /* @__PURE__ */ n("button", { type: "button", className: u("flex size-10 items-center justify-center rounded-full border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] transition-colors", p ? "text-[var(--Object-High-Emphasis)] hover:bg-[var(--Surface-Tertiary)]" : "text-[var(--Object-Disable)]"), onClick: x, disabled: !p, "aria-label": "数量を増やす", children: /* @__PURE__ */ n(Cr, { size: 18 }) })
  ] });
}
function kf({ className: e, lineItems: t, totalLabel: r = "合計（税込）", totalValue: a, ctaLabel: o, onCTAClick: s, ctaDisabled: l = !1, fixed: i = !1, ...c }) {
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
function Er({ filled: e = !1, size: t = 20 }) {
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
function Dr({ label: e, variant: t = "default" }) {
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
function wc({
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
  ranking: x,
  deliveryLabel: g,
  orientation: y = "vertical",
  showCartButton: b = !1,
  onCartAdd: M,
  cartButtonLabel: T = "カートに追加",
  ...k
}) {
  const C = s && s > o ? Math.round((s - o) / s * 100) : null, S = p ? /* @__PURE__ */ n("a", { href: p, className: "absolute inset-0 z-[1]", "aria-label": t, children: /* @__PURE__ */ n("span", { className: "sr-only", children: t }) }) : v ? /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      className: "absolute inset-0 z-[1] cursor-pointer",
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
      ...k,
      children: [
        S,
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
              children: /* @__PURE__ */ n(Er, { filled: h, size: 16 })
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
                Mr,
                {
                  rating: l,
                  reviewCount: i,
                  size: "sm"
                }
              ),
              g && /* @__PURE__ */ n("p", { className: "typo-body-xs text-[var(--Text-Medium-Emphasis)]", children: g })
            ] }),
            /* @__PURE__ */ n(
              Nr,
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
      ...k,
      children: [
        S,
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
            x != null && /* @__PURE__ */ n("span", { className: "absolute left-1.5 top-1.5 z-[5] flex size-7 items-center justify-center rounded-full bg-[var(--Brand-Primary)] typo-label-xs text-[var(--Text-on-Inverse)] shadow-[var(--shadow-md)]", children: x }),
            /* @__PURE__ */ f("div", { className: "absolute inset-x-1 bottom-1 z-[3] flex flex-wrap gap-1", children: [
              C && /* @__PURE__ */ n(Dr, { label: `${C}%OFF`, variant: "caution" }),
              d.map((E) => /* @__PURE__ */ n(Dr, { ...E }, E.label))
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
              children: /* @__PURE__ */ n(Er, { filled: h, size: 20 })
            }
          ) })
        ] }),
        /* @__PURE__ */ f("div", { className: "flex flex-1 flex-col gap-0.5", children: [
          c && /* @__PURE__ */ n("p", { className: "truncate typo-body-sm text-[var(--Text-Low-Emphasis)]", children: c }),
          /* @__PURE__ */ n("h3", { className: "line-clamp-2 typo-body-md text-[var(--Text-High-Emphasis)]", children: t }),
          (l != null || g) && /* @__PURE__ */ f("div", { className: "flex flex-wrap items-center gap-2", children: [
            l != null && /* @__PURE__ */ n(
              Mr,
              {
                rating: l,
                reviewCount: i,
                size: "sm"
              }
            ),
            g && /* @__PURE__ */ n("p", { className: "typo-body-xs text-[var(--Text-Medium-Emphasis)]", children: g })
          ] }),
          /* @__PURE__ */ n(
            Nr,
            {
              price: o,
              originalPrice: s,
              size: "md",
              showTaxLabel: !1
            }
          )
        ] }),
        b && /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            "data-slot": "button",
            className: "relative z-10 flex h-9 w-full items-center justify-center gap-1 rounded-full bg-[var(--Brand-Primary)] typo-label-md text-[var(--Text-on-Inverse)] transition-colors hover:bg-[var(--Hover-Primary-Button)] cursor-pointer",
            onClick: (E) => {
              E.preventDefault(), E.stopPropagation(), M?.();
            },
            children: T
          }
        )
      ]
    }
  );
}
const kc = {
  sm: "w-40",
  md: "w-[200px]",
  lg: "w-[240px]"
};
function Nf({
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
                  className: u("shrink-0", kc[i]),
                  children: /* @__PURE__ */ n(
                    wc,
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
function Mf({
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
    const x = new IntersectionObserver(
      (g) => {
        for (const y of g)
          if (y.isIntersecting) {
            const b = Number(y.target.dataset.index);
            isNaN(b) || d(b);
          }
      },
      { root: v, threshold: 0.6 }
    );
    return v.querySelectorAll("[data-slide]").forEach((g) => x.observe(g)), () => x.disconnect();
  }, [h]), w.useEffect(() => {
    if (o <= 0 || h <= 1) return;
    const v = setInterval(() => p((c + 1) % h), o);
    return () => clearInterval(v);
  }, [o, c, h]);
  function p(v) {
    const x = i.current?.children[v];
    x && i.current.scrollTo({
      left: x.offsetLeft,
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
            children: e.map((v, x) => /* @__PURE__ */ n(
              "div",
              {
                "data-slide": !0,
                "data-index": x,
                className: "w-full shrink-0 snap-start px-4 lg:px-0",
                children: v.href ? /* @__PURE__ */ n("a", { href: v.href, className: "block", children: /* @__PURE__ */ n(
                  "img",
                  {
                    src: v.src,
                    alt: v.alt,
                    loading: x === 0 ? "eager" : "lazy",
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
                    loading: x === 0 ? "eager" : "lazy",
                    className: u(
                      "w-full rounded-lg object-cover",
                      m
                    )
                  }
                )
              },
              x
            ))
          }
        ),
        a && h > 1 && /* @__PURE__ */ f(Se, { children: [
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
        r && h > 1 && /* @__PURE__ */ n("div", { className: "mt-2 flex items-center justify-center gap-1.5 lg:hidden", children: e.map((v, x) => /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            onClick: () => p(x),
            "aria-label": `スライド ${x + 1}`,
            className: u(
              "size-2 rounded-full transition-colors",
              x === c ? "bg-[var(--Text-High-Emphasis)]" : "bg-[var(--Surface-Tertiary)]"
            )
          },
          x
        )) })
      ]
    }
  ) : null;
}
function Sf({ className: e, items: t, variant: r = "default", pillPosition: a = "fixed", ...o }) {
  return r === "pill" ? /* @__PURE__ */ n(Mc, { className: e, items: t, pillPosition: a, ...o }) : /* @__PURE__ */ n(Nc, { className: e, items: t, ...o });
}
function Nc({ className: e, items: t, ...r }) {
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
      children: /* @__PURE__ */ n("div", { className: "flex h-14 items-center justify-around px-1", children: t.map((a) => /* @__PURE__ */ n(Pa, { item: a, compact: !1 }, a.label)) })
    }
  );
}
function Mc({ className: e, items: t, pillPosition: r = "fixed", ...a }) {
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
      children: t.map((o) => /* @__PURE__ */ n(Pa, { item: o, compact: !0 }, o.label))
    }
  );
}
function Pa({ item: e, compact: t }) {
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
function Sc({ filter: e }) {
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
function Cf({
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
    const x = (g) => {
      v.current && !v.current.contains(g.target) && p(!1);
    };
    return document.addEventListener("mousedown", x), () => document.removeEventListener("mousedown", x);
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
          e.map((x) => /* @__PURE__ */ n(Sc, { filter: x }, x.label))
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
                  a.find((x) => x.value === o)?.label ?? r ?? "並べ替え"
                ]
              }
            ),
            m && /* @__PURE__ */ n("div", { className: "absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] py-1 shadow-[var(--shadow-lg)] animate-fade-in", children: a.map((x) => /* @__PURE__ */ f(
              "button",
              {
                type: "button",
                className: u(
                  "flex w-full items-center gap-2 px-3 py-2 typo-body-md text-left transition-colors hover:bg-[var(--Surface-Secondary)]",
                  o === x.value ? "text-[var(--Text-Accent-Primary)]" : "text-[var(--Text-High-Emphasis)]"
                ),
                onClick: () => {
                  s?.(x.value), p(!1);
                },
                children: [
                  o === x.value && /* @__PURE__ */ n("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", className: "shrink-0", children: /* @__PURE__ */ n("path", { d: "M11 4L5.5 9.5L3 7", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }),
                  x.label
                ]
              },
              x.value
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
function Ba({ rating: e, size: t = 14 }) {
  return /* @__PURE__ */ n("div", { className: "flex gap-0.5", "aria-label": `${e}点 / 5点`, children: [1, 2, 3, 4, 5].map((r) => /* @__PURE__ */ n("svg", { width: t, height: t, viewBox: "0 0 14 14", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ n(
    "path",
    {
      d: "M7 1l1.6 3.3 3.6.5-2.6 2.5.6 3.6L7 9.2 3.8 11l.6-3.6L2 4.9l3.6-.5L7 1z",
      fill: r <= e ? "#F59E0B" : "var(--Border-Medium-Emphasis)"
    }
  ) }, r)) });
}
function Tf({
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
          /* @__PURE__ */ n(Ba, { rating: a })
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
function Ef({
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
            /* @__PURE__ */ n(Ba, { rating: Math.round(e), size: 16 }),
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
function Df({ items: e, className: t, ...r }) {
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
function Pf({ selectedCount: e, onClear: t, children: r, className: a, ...o }) {
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
        t && /* @__PURE__ */ f(Se, { children: [
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
function Bf({ items: e, activeIndex: t = 0, onSelect: r, className: a, ...o }) {
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
const Cc = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4"
};
function Of({ children: e, onSearch: t, onReset: r, columns: a = 4, layout: o = "grid", className: s, ...l }) {
  const i = o === "flex" ? "flex flex-wrap items-end gap-3 [&>*]:flex [&>*]:flex-col [&>*]:min-w-[140px] [&>*]:flex-1" : u("grid grid-cols-1 gap-3 items-end [&>*]:flex [&>*]:flex-col", Cc[a]);
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
function Lf({ images: e = [], onAdd: t, onRemove: r, maxImages: a = 10, columns: o = 4, className: s, ...l }) {
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
function Pr(e) {
  return e < 1024 ? `${e} B` : e < 1024 * 1024 ? `${(e / 1024).toFixed(1)} KB` : `${(e / (1024 * 1024)).toFixed(1)} MB`;
}
function Wf({
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
  maxSizeLabel: h = (v) => `最大 ${Pr(v)} まで`,
  maxFilesLabel: m = (v) => `最大 ${v} ファイルまで`,
  removeLabel: p = "削除"
}) {
  const [v, x] = w.useState(!1), [g, y] = w.useState([]), [b, M] = w.useState(null), T = w.useRef(null), k = (P) => {
    if (M(null), t && P.find((X) => X.size > t))
      return M(h(t)), null;
    const L = r ? [...g, ...P] : P.slice(0, 1);
    return r && L.length > a ? (M(m(a)), null) : L;
  }, C = (P) => {
    const L = k(P);
    L && (y(L), o?.(L));
  }, S = (P) => {
    const L = g.filter((U, X) => X !== P);
    y(L), o?.(L);
  }, E = (P) => {
    P.preventDefault(), x(!1), !s && C(Array.from(P.dataTransfer.files));
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
          P.preventDefault(), !s && x(!0);
        },
        onDragLeave: () => x(!1),
        onDrop: E,
        onClick: () => !s && T.current?.click(),
        onKeyDown: (P) => {
          (P.key === "Enter" || P.key === " ") && T.current?.click();
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
        ref: T,
        type: "file",
        accept: e,
        multiple: r,
        className: "hidden",
        onChange: I,
        disabled: s
      }
    ),
    b && /* @__PURE__ */ n("p", { className: "typo-body-sm text-[var(--Text-Caution)]", role: "alert", children: b }),
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
            /* @__PURE__ */ n("p", { className: "typo-body-xs text-[var(--Text-Low-Emphasis)]", children: Pr(P.size) })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": `${P.name} を${p}`,
              onClick: () => S(L),
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
function If({ notifications: e, variant: t = "vertical", emptyMessage: r = "新着のお知らせはありません", className: a, ...o }) {
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
const Tc = [
  { label: "時間", value: "hour" },
  { label: "日", value: "day" },
  { label: "週", value: "week" },
  { label: "月", value: "month" }
], Ec = [
  { label: "7日", value: "7d" },
  { label: "30日", value: "30d" },
  { label: "90日", value: "90d" },
  { label: "1年", value: "1y" },
  { label: "カスタム", value: "custom" }
];
function Br({
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
function Hf({
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
            Br,
            {
              options: Tc,
              value: e,
              onChange: t
            }
          )
        ] }),
        a && /* @__PURE__ */ f("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ n("span", { className: "typo-label-xs text-[var(--Text-Low-Emphasis)] font-bold w-10 shrink-0", children: "期間" }),
          /* @__PURE__ */ n(
            Br,
            {
              options: Ec,
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
function Dc({ direction: e }) {
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
function Pc() {
  return /* @__PURE__ */ f("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", children: [
    /* @__PURE__ */ n("circle", { cx: "8", cy: "3", r: "1.5" }),
    /* @__PURE__ */ n("circle", { cx: "8", cy: "8", r: "1.5" }),
    /* @__PURE__ */ n("circle", { cx: "8", cy: "13", r: "1.5" })
  ] });
}
function Bc() {
  return /* @__PURE__ */ n("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: /* @__PURE__ */ n("path", { d: "M8 3V13M3 8H13" }) });
}
function Oc() {
  return /* @__PURE__ */ f("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", className: "shrink-0", children: [
    /* @__PURE__ */ n("path", { d: "M10.5 7.5V11.5C10.5 12.05 10.05 12.5 9.5 12.5H2.5C1.95 12.5 1.5 12.05 1.5 11.5V4.5C1.5 3.95 1.95 3.5 2.5 3.5H6.5" }),
    /* @__PURE__ */ n("path", { d: "M8.5 1.5H12.5V5.5" }),
    /* @__PURE__ */ n("path", { d: "M5.5 8.5L12.5 1.5" })
  ] });
}
function Lc() {
  return /* @__PURE__ */ f("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "currentColor", className: "shrink-0", children: [
    /* @__PURE__ */ n("circle", { cx: "5", cy: "3", r: "1.2" }),
    /* @__PURE__ */ n("circle", { cx: "9", cy: "3", r: "1.2" }),
    /* @__PURE__ */ n("circle", { cx: "5", cy: "7", r: "1.2" }),
    /* @__PURE__ */ n("circle", { cx: "9", cy: "7", r: "1.2" }),
    /* @__PURE__ */ n("circle", { cx: "5", cy: "11", r: "1.2" }),
    /* @__PURE__ */ n("circle", { cx: "9", cy: "11", r: "1.2" })
  ] });
}
function Wc({ open: e }) {
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
function jf({ className: e, children: t, ...r }) {
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
function Ff({ className: e, children: t, ...r }) {
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
function Af({ className: e, children: t, ...r }) {
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
function _f({ className: e, children: t, ...r }) {
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
function zf({ className: e, selected: t, children: r, ...a }) {
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
function Yf({
  className: e,
  children: t,
  sortable: r,
  sortDirection: a,
  onSort: o,
  ...s
}) {
  return /* @__PURE__ */ n(
    "th",
    {
      "data-slot": "data-table-head",
      className: u(
        "px-3 py-2.5 text-left typo-label-sm text-[var(--Text-Medium-Emphasis)]",
        r && "cursor-pointer select-none",
        e
      ),
      onClick: r ? o : void 0,
      "aria-sort": a === "asc" ? "ascending" : a === "desc" ? "descending" : void 0,
      ...s,
      children: r ? /* @__PURE__ */ f("span", { className: "inline-flex items-center gap-1", children: [
        t,
        /* @__PURE__ */ n(Dc, { direction: a ?? null })
      ] }) : t
    }
  );
}
const Ic = le("px-3 py-2.5 typo-body-md text-[var(--Text-High-Emphasis)]", {
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
function $f({ className: e, align: t, width: r, children: a, ...o }) {
  return /* @__PURE__ */ n(
    "td",
    {
      "data-slot": "data-table-cell",
      className: u(Ic({ align: t, width: r }), e),
      ...o,
      children: a
    }
  );
}
function Rf({
  className: e,
  src: t,
  fallback: r,
  title: a,
  caption: o,
  ...s
}) {
  return /* @__PURE__ */ n(
    "td",
    {
      "data-slot": "data-table-avatar-cell",
      className: u("px-3 py-2.5", e),
      ...s,
      children: /* @__PURE__ */ f("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ f(Mn, { className: "size-8", children: [
          t && /* @__PURE__ */ n(Sn, { src: t, alt: a }),
          /* @__PURE__ */ n(Cn, { children: r ?? a.charAt(0) })
        ] }),
        /* @__PURE__ */ f("div", { className: "flex flex-col min-w-0", children: [
          /* @__PURE__ */ n("span", { className: "typo-label-md text-[var(--Text-High-Emphasis)] truncate", children: a }),
          o && /* @__PURE__ */ n("span", { className: "typo-body-sm text-[var(--Text-Low-Emphasis)] truncate", children: o })
        ] })
      ] })
    }
  );
}
function Vf({
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
function qf({
  className: e,
  checked: t,
  onCheckedChange: r,
  indeterminate: a,
  ...o
}) {
  return /* @__PURE__ */ n(
    "td",
    {
      "data-slot": "data-table-checkbox-cell",
      className: u("w-[40px] px-3 py-2.5", e),
      ...o,
      children: /* @__PURE__ */ n(
        En,
        {
          checked: a ? "indeterminate" : t,
          onCheckedChange: (s) => r?.(s === !0)
        }
      )
    }
  );
}
function Gf({ className: e, items: t, ...r }) {
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
            children: /* @__PURE__ */ n(Pc, {})
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
function Uf({
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
function Xf({
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
      children: /* @__PURE__ */ f(Bl, { value: t, onValueChange: r, children: [
        /* @__PURE__ */ n(Ll, { className: "h-8 min-w-[120px] typo-body-md border-transparent hover:border-[var(--Border-Low-Emphasis)]", children: /* @__PURE__ */ n(Ol, { placeholder: a }) }),
        /* @__PURE__ */ n(Wl, { children: o.map((l) => /* @__PURE__ */ n(Il, { value: l.value, children: l.label }, l.value)) })
      ] })
    }
  );
}
function Qf({
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
function Zf({ className: e, ...t }) {
  return /* @__PURE__ */ n(
    "td",
    {
      "data-slot": "data-table-drag-handle-cell",
      className: u("w-[36px] px-2 py-2.5 cursor-grab text-[var(--Text-Low-Emphasis)]", e),
      ...t,
      children: /* @__PURE__ */ n(Lc, {})
    }
  );
}
function Kf({
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
            r && /* @__PURE__ */ n(Oc, {})
          ]
        }
      )
    }
  );
}
function Jf({
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
function eh({
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
            /* @__PURE__ */ n(Wc, { open: a }),
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
function th({
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
            /* @__PURE__ */ n(Bc, {}),
            t
          ]
        }
      ) })
    }
  );
}
function rh({
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
function ah({
  open: e,
  onClose: t,
  banner: r,
  sections: a,
  footerLinks: o,
  width: s = 280,
  className: l
}) {
  return /* @__PURE__ */ n(Rt, { open: e, onOpenChange: (i) => !i && t(), children: /* @__PURE__ */ f(
    Vt,
    {
      side: "left",
      className: u("p-0 flex flex-col", l),
      style: { width: s },
      children: [
        /* @__PURE__ */ n(qt, { className: "sr-only", children: /* @__PURE__ */ n(Gt, { children: "メニュー" }) }),
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
const Hc = ["VISA", "Master", "JCB", "AmEx", "PayPay", "LINE Pay"];
function nh({
  logo: e,
  linkGroups: t = [],
  paymentIcons: r = Hc,
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
const Mt = {
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
function oh({
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
    const h = Mt[d];
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
        const h = Mt[d], m = d === "copy";
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
        const h = Mt[d], m = d === "copy";
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
const Or = [
  "linear-gradient(135deg, #E8426B, #F9AABF)",
  "linear-gradient(135deg, #6366F1, #A5B4FC)",
  "linear-gradient(135deg, #F59E0B, #FDE68A)",
  "linear-gradient(135deg, #10B981, #6EE7B7)",
  "linear-gradient(135deg, #3B82F6, #93C5FD)"
], jc = {
  "2/1": "aspect-[2/1]",
  "3/2": "aspect-[3/2]",
  "4/3": "aspect-[4/3]"
};
function sh({
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
      const d = i.gradient ?? Or[c % Or.length], h = d.includes("FDE68A"), m = i.href ? "a" : "div";
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
            jc[o] ?? "aspect-[2/1]",
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
function ih({
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
function lh({ items: e, className: t }) {
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
const Fc = {
  sm: "size-[60px]",
  md: "size-[100px]",
  lg: "size-[120px]"
}, Ac = {
  sm: "max-w-[60px]",
  md: "max-w-[100px]",
  lg: "max-w-[120px]"
}, _c = {
  sm: "calc((100vw - 32px) / 4.05)",
  md: "calc((100vw - 32px) / 3.5)",
  lg: "calc((100vw - 32px) / 3.0)"
};
function ch({
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
              m ? "aspect-square w-full" : Fc[a],
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
              m ? "w-full" : Ac[a]
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
      fc,
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
            gridAutoColumns: _c[a]
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
function dh({
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
  return e === "syncing" ? /* @__PURE__ */ f("span", { className: u(d, "bg-[var(--Surface-Info)] text-[var(--Text-Info)]", c), children: [
    /* @__PURE__ */ n(
      "span",
      {
        "aria-hidden": !0,
        className: "size-3 rounded-full border-[1.5px] border-current border-t-transparent animate-spin"
      }
    ),
    a
  ] }) : e === "success" ? /* @__PURE__ */ f("span", { className: u(d, "bg-[var(--Surface-Success)] text-[var(--Text-Success)]", c), children: [
    /* @__PURE__ */ n("span", { "aria-hidden": !0, className: "size-1.5 rounded-full bg-current" }),
    o
  ] }) : e === "error" ? /* @__PURE__ */ f("span", { className: u(d, "bg-[var(--Surface-Caution)] text-[var(--Text-Caution)]", c), children: [
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
  ] }) : e === "offline" ? /* @__PURE__ */ f("span", { className: u(d, "bg-[var(--Surface-Secondary)] text-[var(--Text-Low-Emphasis)]", c), children: [
    /* @__PURE__ */ n("span", { "aria-hidden": !0, className: "size-1.5 rounded-full bg-current" }),
    l
  ] }) : null;
}
function uh({
  label: e,
  value: t,
  options: r,
  onSelect: a,
  hideAll: o = !1,
  allLabel: s = "すべて",
  className: l
}) {
  const [i, c] = w.useState(!1), d = w.useRef(null), [h, m] = w.useState({ top: 0, left: 0 }), p = t !== "all", v = r.find((b) => b.key === t), x = p && v ? `${e}: ${v.label}` : e, g = () => {
    if (d.current) {
      const b = d.current.getBoundingClientRect();
      m({ top: b.bottom + 4, left: b.left });
    }
    c((b) => !b);
  }, y = (b) => {
    a(b), c(!1);
  };
  return /* @__PURE__ */ f("div", { className: u("flex-shrink-0", l), children: [
    /* @__PURE__ */ f(
      "button",
      {
        ref: d,
        type: "button",
        onClick: g,
        "aria-expanded": i,
        "aria-haspopup": "listbox",
        className: u(
          "h-9 rounded-full px-4 typo-label-sm flex items-center gap-1.5 transition-all duration-200",
          p ? "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)]" : "bg-[var(--Surface-Primary)] border border-[var(--Border-Low-Emphasis)] text-[var(--Text-Medium-Emphasis)]"
        ),
        children: [
          x,
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
    i && /* @__PURE__ */ f(Se, { children: [
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
            r.map((b) => /* @__PURE__ */ n("li", { children: /* @__PURE__ */ f(
              "button",
              {
                type: "button",
                role: "option",
                "aria-selected": t === b.key,
                onClick: () => y(b.key),
                className: u(
                  "w-full flex items-center justify-between px-4 py-2.5 typo-body-sm transition-colors hover:bg-[var(--Surface-Secondary)]",
                  t === b.key ? "text-[var(--Brand-Primary)] font-semibold" : "text-[var(--Text-High-Emphasis)]"
                ),
                children: [
                  /* @__PURE__ */ n("span", { className: "truncate", children: b.label }),
                  t === b.key && /* @__PURE__ */ n("span", { "aria-hidden": !0, className: "text-[var(--Brand-Primary)] ml-2 flex-shrink-0", children: "✓" })
                ]
              }
            ) }, b.key))
          ]
        }
      )
    ] })
  ] });
}
function fh({
  active: e,
  onPinCreate: t,
  pins: r = [],
  onPinClick: a,
  holdDuration: o = 600,
  onHaptic: s,
  className: l,
  children: i
}) {
  const c = w.useRef(null), d = w.useRef(null), [h, m] = w.useState(null), p = (g, y) => {
    const b = c.current;
    if (!b) return { x: 0.5, y: 0.5 };
    const M = b.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (g - M.left) / M.width)),
      y: Math.min(1, Math.max(0, (y - M.top) / M.height))
    };
  }, v = (g, y) => {
    if (!e) return;
    const b = p(g, y);
    m(b), d.current = setTimeout(() => {
      s?.(), t?.(b), m(null);
    }, o);
  }, x = () => {
    d.current && clearTimeout(d.current), m(null);
  };
  return /* @__PURE__ */ f(
    "div",
    {
      ref: c,
      className: u("relative select-none", l),
      onMouseDown: (g) => v(g.clientX, g.clientY),
      onMouseUp: x,
      onMouseLeave: x,
      onTouchStart: (g) => {
        const y = g.touches[0];
        v(y.clientX, y.clientY);
      },
      onTouchEnd: x,
      onTouchCancel: x,
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
  Qc as Accordion,
  Jc as AccordionContent,
  Zc as AccordionItem,
  Kc as AccordionTrigger,
  pf as AdminShell,
  ed as Alert,
  rd as AlertDescription,
  ad as AlertDialog,
  dd as AlertDialogAction,
  ud as AlertDialogCancel,
  od as AlertDialogContent,
  cd as AlertDialogDescription,
  id as AlertDialogFooter,
  sd as AlertDialogHeader,
  Nn as AlertDialogOverlay,
  kn as AlertDialogPortal,
  ld as AlertDialogTitle,
  nd as AlertDialogTrigger,
  td as AlertTitle,
  Uu as AppHeader,
  vf as AppShell,
  Mn as Avatar,
  Cn as AvatarFallback,
  Sn as AvatarImage,
  fd as Badge,
  rf as Banner,
  sh as BannerCarousel,
  ef as BottomSheetForm,
  Sf as BottomTabBar,
  hd as Breadcrumb,
  xd as BreadcrumbEllipsis,
  pd as BreadcrumbItem,
  vd as BreadcrumbLink,
  md as BreadcrumbList,
  bd as BreadcrumbPage,
  gd as BreadcrumbSeparator,
  Pf as BulkActions,
  Le as Button,
  ya as Calendar,
  yd as Card,
  Md as CardAction,
  Sd as CardContent,
  Nd as CardDescription,
  Cd as CardFooter,
  wd as CardHeader,
  kd as CardTitle,
  lh as CategoryNav,
  ch as CategoryScroll,
  Hf as ChartControls,
  En as Checkbox,
  Td as CheckboxCardGroup,
  Ed as CheckboxCardItem,
  Dd as CheckboxGroup,
  Pd as CheckboxGroupItem,
  cc as Chip,
  tf as ChipSelector,
  Ru as CoachMark,
  Bd as Collapsible,
  Ld as CollapsibleContent,
  Od as CollapsibleTrigger,
  du as Combobox,
  Ju as ConfirmDialog,
  Yu as CountdownTimer,
  jf as DataTable,
  Gf as DataTableActionCell,
  th as DataTableAddRow,
  Rf as DataTableAvatarCell,
  _f as DataTableBody,
  Jf as DataTableBulkActions,
  $f as DataTableCell,
  qf as DataTableCheckboxCell,
  Zf as DataTableDragHandleCell,
  rh as DataTableEmptyState,
  Yf as DataTableHead,
  Af as DataTableHeader,
  Vf as DataTableImageCell,
  Uf as DataTableInputCell,
  Kf as DataTableLinkCell,
  Qf as DataTableNumberCell,
  zf as DataTableRow,
  eh as DataTableSectionRow,
  Xf as DataTableSelectCell,
  Ff as DataTableTable,
  iu as DatePicker,
  lu as DateRangePicker,
  Dn as Dialog,
  On as DialogClose,
  Wn as DialogContent,
  Fn as DialogDescription,
  Hn as DialogFooter,
  In as DialogHeader,
  Ln as DialogOverlay,
  Bn as DialogPortal,
  jn as DialogTitle,
  Pn as DialogTrigger,
  uh as DropdownFilter,
  zd as DropdownMenu,
  Gd as DropdownMenuCheckboxItem,
  Rd as DropdownMenuContent,
  Vd as DropdownMenuGroup,
  qd as DropdownMenuItem,
  Qd as DropdownMenuLabel,
  Yd as DropdownMenuPortal,
  Ud as DropdownMenuRadioGroup,
  Xd as DropdownMenuRadioItem,
  Zd as DropdownMenuSeparator,
  Kd as DropdownMenuShortcut,
  Jd as DropdownMenuSub,
  tu as DropdownMenuSubContent,
  eu as DropdownMenuSubTrigger,
  $d as DropdownMenuTrigger,
  af as EmptyState,
  nf as ErrorState,
  Wf as FileUpload,
  Cf as FilterBar,
  nh as Footer,
  Wd as Form,
  yf as FormActions,
  Fd as FormControl,
  Ad as FormDescription,
  of as FormField,
  Hd as FormItem,
  jd as FormLabel,
  _d as FormMessage,
  gf as FormRoot,
  xf as FormSection,
  ru as HoverCard,
  nu as HoverCardContent,
  au as HoverCardTrigger,
  Mf as ImageCarousel,
  qu as ImageGallery,
  Lf as ImageUploader,
  ou as Input,
  Df as KebabMenu,
  Wr as Label,
  sf as ListItem,
  bf as MarketingShell,
  ah as MenuDrawer,
  uu as MultiSelect,
  Gu as NavigationBar,
  lf as NotificationBadge,
  If as NotificationList,
  Au as NumberInput,
  kf as OrderSummary,
  fu as Pagination,
  hu as PaginationContent,
  bu as PaginationEllipsis,
  mu as PaginationItem,
  Na as PaginationLink,
  vu as PaginationNext,
  pu as PaginationPrevious,
  _u as PillToggle,
  Xe as Popover,
  su as PopoverAnchor,
  Ze as PopoverContent,
  Qe as PopoverTrigger,
  Nr as PriceDisplay,
  wc as ProductCard,
  Nf as ProductCarousel,
  gu as Progress,
  Fu as ProgressRing,
  cf as ProgressSteps,
  wf as QuantitySelector,
  xu as RadioGroup,
  yu as RadioGroupItem,
  Mr as RatingDisplay,
  rc as ResponsiveDialog,
  Ku as ResponsiveDialogClose,
  ac as ResponsiveDialogContent,
  sc as ResponsiveDialogDescription,
  ic as ResponsiveDialogFooter,
  nc as ResponsiveDialogHeader,
  oc as ResponsiveDialogTitle,
  Zu as ResponsiveDialogTrigger,
  Tf as ReviewCard,
  fh as ReviewOverlay,
  Ef as ReviewSummary,
  Id as RhfFormField,
  Dl as ScrollArea,
  Pl as ScrollBar,
  df as SearchBar,
  Of as SearchPanel,
  fc as SectionHeader,
  Bl as Select,
  Wl as SelectContent,
  wu as SelectGroup,
  Il as SelectItem,
  Nu as SelectLabel,
  ku as SelectSeparator,
  Ll as SelectTrigger,
  Ol as SelectValue,
  Mu as Separator,
  oh as ShareButtons,
  Rt as Sheet,
  jl as SheetClose,
  Vt as SheetContent,
  Ea as SheetDescription,
  Fl as SheetDragIndicator,
  Su as SheetFooter,
  qt as SheetHeader,
  Gt as SheetTitle,
  Hl as SheetTrigger,
  Cu as Skeleton,
  Tu as Slider,
  Vu as SocialLoginButton,
  Eu as Spinner,
  zu as StarRating,
  uf as StatCard,
  Bf as StatusTabs,
  ih as StickyActionBar,
  $u as SubNav,
  Qu as SwipeRow,
  Du as Switch,
  dh as SyncStatusBadge,
  Pu as Tabs,
  Lu as TabsContent,
  Bu as TabsList,
  Ou as TabsTrigger,
  ff as Tag,
  Xu as TagInput,
  Wu as Textarea,
  cu as TimePicker,
  mf as Toaster,
  Iu as Tooltip,
  ju as TooltipContent,
  Yl as TooltipProvider,
  Hu as TooltipTrigger,
  Tn as badgeVariants,
  dc as bannerVariants,
  lt as buttonVariants,
  lc as chipVariants,
  u as cn,
  vc as priceVariants,
  mc as tagVariants,
  ct as useFormField,
  we as useMediaQuery,
  hf as useToast
};
