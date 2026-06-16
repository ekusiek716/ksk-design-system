import { scales as u, themes as h } from "../native.js";
import { getTheme as I, primitives as N, themeNames as V } from "../native.js";
import { jsx as c } from "react/jsx-runtime";
import { useState as b, useMemo as y, useContext as x, createContext as v } from "react";
import { Text as d, Pressable as w, Platform as C, View as m } from "react-native";
const f = v(null);
function k({
  children: r,
  initialName: o = "default",
  initialMode: t = "light"
}) {
  const [e, n] = b(o), [s, a] = b(t), i = y(
    () => ({
      name: e,
      mode: s,
      theme: h[e][s],
      scales: u,
      setName: n,
      setMode: a,
      toggleMode: () => a((g) => g === "light" ? "dark" : "light")
    }),
    [e, s]
  );
  return /* @__PURE__ */ c(f.Provider, { value: i, children: r });
}
function l() {
  const r = x(f);
  if (!r) throw new Error("useTheme は ThemeProvider の内側で使ってください");
  return r;
}
function p(r) {
  if (r === "caption") return { ...u.typography.caption };
  const [o, t] = r.split(".");
  return { ...u.typography[o][t] };
}
function P({ variant: r = "body.md", color: o, style: t, children: e, ...n }) {
  const { theme: s } = l();
  return /* @__PURE__ */ c(d, { style: [p(r), { color: o ?? s.text["high-emphasis"] }, t], ...n, children: e });
}
function j({ variant: r = "primary", children: o, ...t }) {
  const { theme: e, scales: n } = l(), a = {
    primary: {
      bg: e.brand.primary,
      bgActive: e.active["primary-button"],
      fg: e.text["on-inverse"],
      border: e.brand.primary
    },
    secondary: {
      bg: e.surface["accent-primary-light"],
      bgActive: e.active["secondary-button"],
      fg: e.text["accent-primary"],
      border: e.border["accent-primary"]
    },
    tertiary: {
      bg: e.surface.secondary,
      bgActive: e.active["tertiary-button"],
      fg: e.text["high-emphasis"],
      border: e.border["low-emphasis"]
    },
    destructive: {
      bg: e.caution.base,
      bgActive: e.caution.action,
      fg: e.text["on-inverse"],
      border: e.caution.base
    }
  }[r];
  return /* @__PURE__ */ c(
    w,
    {
      style: ({ pressed: i }) => [
        {
          minHeight: n.touchTargets.buttonCTA.min,
          paddingHorizontal: n.spacing.scale[5],
          justifyContent: "center",
          alignItems: "center",
          borderRadius: n.borderRadius.lg,
          borderWidth: 1
        },
        { backgroundColor: i ? a.bgActive : a.bg, borderColor: a.border }
      ],
      ...t,
      children: /* @__PURE__ */ c(d, { style: [p("label.md"), { color: a.fg }], children: o })
    }
  );
}
function z({ padding: r = 4, elevation: o, style: t, children: e, ...n }) {
  const { theme: s, scales: a } = l(), i = o ? C.select({
    web: { boxShadow: a.shadows[o].boxShadow },
    default: { elevation: a.shadows[o].elevation }
  }) : void 0;
  return /* @__PURE__ */ c(
    m,
    {
      style: [
        {
          backgroundColor: s.surface.primary,
          borderColor: s.border["low-emphasis"],
          borderWidth: 1,
          borderRadius: a.borderRadius.lg,
          padding: a.spacing.scale[r],
          gap: a.spacing.scale[3]
        },
        i,
        t
      ],
      ...n,
      children: e
    }
  );
}
function H({ tone: r = "neutral", children: o }) {
  const { theme: t, scales: e } = l(), s = {
    neutral: { bg: t.surface.tertiary, fg: t.text["medium-emphasis"] },
    accent: { bg: t.surface["accent-primary-light"], fg: t.text["accent-primary"] },
    success: { bg: t.surface.success, fg: t.text.success },
    caution: { bg: t.surface.caution, fg: t.text.caution },
    warning: { bg: t.surface.warning, fg: t.text.warning },
    info: { bg: t.surface.info, fg: t.text.info }
  }[r];
  return /* @__PURE__ */ c(
    m,
    {
      style: {
        backgroundColor: s.bg,
        borderRadius: e.borderRadius.full,
        paddingVertical: e.spacing.scale[1],
        paddingHorizontal: e.spacing.scale[3],
        alignSelf: "flex-start"
      },
      children: /* @__PURE__ */ c(d, { style: [p("label.sm"), { color: s.fg }], children: o })
    }
  );
}
function M({
  gap: r = 3,
  direction: o = "column",
  align: t,
  justify: e,
  wrap: n = !1,
  style: s,
  children: a,
  ...i
}) {
  const { scales: g } = l();
  return /* @__PURE__ */ c(
    m,
    {
      style: [
        {
          flexDirection: o,
          gap: g.spacing.scale[r],
          alignItems: t,
          justifyContent: e,
          flexWrap: n ? "wrap" : "nowrap"
        },
        s
      ],
      ...i,
      children: a
    }
  );
}
export {
  H as Badge,
  j as Button,
  z as Card,
  M as Stack,
  P as Text,
  k as ThemeProvider,
  I as getTheme,
  N as primitives,
  p as resolveTypo,
  u as scales,
  V as themeNames,
  h as themes,
  l as useTheme
};
