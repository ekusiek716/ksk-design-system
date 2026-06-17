import { scales as G, themes as ue } from "../native.js";
import { getTheme as Pr, primitives as Wr, themeNames as Hr } from "../native.js";
import { jsx as e, jsxs as p, Fragment as M } from "react/jsx-runtime";
import O, { useState as I, useMemo as N, useContext as K, createContext as J, useRef as z, useEffect as Y, useCallback as U } from "react";
import { Text as u, Platform as B, View as c, Pressable as f, Image as V, ActivityIndicator as ne, Animated as S, TextInput as L, Switch as ge, PanResponder as oe, Modal as E, Dimensions as $, ScrollView as T, FlatList as j, Share as pe } from "react-native";
const se = J(null);
function tt({
  children: s,
  initialName: i = "default",
  initialMode: o = "light"
}) {
  const [r, t] = I(i), [n, a] = I(o), l = N(
    () => ({
      name: r,
      mode: n,
      theme: ue[r][n],
      scales: G,
      setName: t,
      setMode: a,
      toggleMode: () => a((d) => d === "light" ? "dark" : "light")
    }),
    [r, n]
  );
  return /* @__PURE__ */ e(se.Provider, { value: l, children: s });
}
function b() {
  const s = K(se);
  if (!s) throw new Error("useTheme は ThemeProvider の内側で使ってください");
  return s;
}
function h(s) {
  if (s === "caption") return { ...G.typography.caption };
  const [i, o] = s.split(".");
  return { ...G.typography[i][o] };
}
function rt({ variant: s = "body.md", color: i, style: o, children: r, ...t }) {
  const { theme: n } = b();
  return /* @__PURE__ */ e(u, { style: [h(s), { color: i ?? n.text["high-emphasis"] }, o], ...t, children: r });
}
const me = {
  subtle: { blur: 14, opacity: 0.1 },
  regular: { blur: 28, opacity: 0.18 },
  thick: { blur: 56, opacity: 0.28 }
};
function ye({
  intensity: s = "regular",
  tint: i = "system",
  showRim: o = !0,
  borderRadius: r,
  style: t,
  children: n,
  ...a
}) {
  const { theme: l, scales: d, mode: m } = b(), g = r ?? d.borderRadius.lg, y = me[s], x = i === "system" ? m === "dark" ? "dark" : "light" : i, R = {
    borderRadius: g,
    overflow: "hidden",
    backgroundColor: x === "light" ? `rgba(255, 255, 255, ${y.opacity})` : `rgba(20, 20, 30, ${y.opacity})`,
    borderWidth: o ? 1 : 0,
    borderColor: x === "light" ? "rgba(255, 255, 255, 0.42)" : "rgba(255, 255, 255, 0.15)"
  }, C = fe();
  if (C && B.OS === "ios")
    return /* @__PURE__ */ p(
      C,
      {
        intensity: y.blur * 2.5,
        tint: x === "dark" ? "dark" : "light",
        style: [R, { backgroundColor: "transparent" }, t],
        ...a,
        children: [
          o && /* @__PURE__ */ e(
            c,
            {
              pointerEvents: "none",
              style: {
                ...be,
                borderRadius: g,
                borderWidth: 1,
                borderColor: R.borderColor
              }
            }
          ),
          n
        ]
      }
    );
  if (B.OS === "web") {
    const w = {
      ...R,
      // RN Web は未知のスタイルキーを CSS としてそのまま出力する
      WebkitBackdropFilter: `blur(${y.blur}px) saturate(1.9) brightness(1.06)`,
      backdropFilter: `blur(${y.blur}px) saturate(1.9) brightness(1.06)`
    };
    return /* @__PURE__ */ e(c, { style: [w, t], ...a, children: n });
  }
  return /* @__PURE__ */ e(c, { style: [R, t], ...a, children: n });
}
const be = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
};
let A;
function fe() {
  if (A !== void 0) return A;
  try {
    A = require("expo-blur").BlurView ?? null;
  } catch {
    A = null;
  }
  return A;
}
function P({ variant: s = "primary", children: i, ...o }) {
  const { theme: r, scales: t, mode: n } = b(), a = {
    primary: {
      bg: r.brand.primary,
      bgActive: r.active["primary-button"],
      fg: r.text["on-inverse"],
      border: r.brand.primary
    },
    secondary: {
      bg: r.surface["accent-primary-light"],
      bgActive: r.active["secondary-button"],
      fg: r.text["accent-primary"],
      border: r.border["accent-primary"]
    },
    tertiary: {
      bg: r.surface.secondary,
      bgActive: r.active["tertiary-button"],
      fg: r.text["high-emphasis"],
      border: r.border["low-emphasis"]
    },
    destructive: {
      bg: r.caution.base,
      bgActive: r.caution.action,
      fg: r.text["on-inverse"],
      border: r.caution.base
    }
  };
  if (s === "glass") {
    const d = r.text["high-emphasis"];
    return /* @__PURE__ */ e(
      f,
      {
        style: {
          minHeight: t.touchTargets.buttonCTA.min,
          borderRadius: t.borderRadius.full,
          overflow: "hidden"
        },
        ...o,
        children: ({ pressed: m }) => /* @__PURE__ */ e(
          ye,
          {
            intensity: "regular",
            borderRadius: t.borderRadius.full,
            style: {
              minHeight: t.touchTargets.buttonCTA.min,
              paddingHorizontal: t.spacing.scale[5],
              justifyContent: "center",
              alignItems: "center",
              transform: [{ scale: m ? 0.96 : 1 }]
            },
            children: /* @__PURE__ */ e(u, { style: [h("label.md"), { color: d }], children: i })
          }
        )
      }
    );
  }
  const l = a[s];
  return /* @__PURE__ */ e(
    f,
    {
      style: ({ pressed: d }) => [
        {
          minHeight: t.touchTargets.buttonCTA.min,
          paddingHorizontal: t.spacing.scale[5],
          justifyContent: "center",
          alignItems: "center",
          borderRadius: t.borderRadius.lg,
          borderWidth: 1
        },
        { backgroundColor: d ? l.bgActive : l.bg, borderColor: l.border }
      ],
      ...o,
      children: /* @__PURE__ */ e(u, { style: [h("label.md"), { color: l.fg }], children: i })
    }
  );
}
const xe = {
  sm: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2
  },
  md: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8
  },
  lg: {
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24
  }
};
function we(s, i) {
  return {
    shadowColor: i,
    ...xe[s]
  };
}
function nt({ padding: s = 4, elevation: i, style: o, children: r, ...t }) {
  const { theme: n, scales: a } = b(), l = i ? B.select({
    web: { boxShadow: a.shadows[i].boxShadow },
    ios: we(i, n.overlay.dark),
    default: { elevation: a.shadows[i].elevation }
  }) : void 0;
  return /* @__PURE__ */ e(
    c,
    {
      style: [
        {
          backgroundColor: n.surface.primary,
          borderColor: n.border["low-emphasis"],
          borderWidth: 1,
          borderRadius: a.borderRadius.lg,
          padding: a.spacing.scale[s],
          gap: a.spacing.scale[3]
        },
        l,
        o
      ],
      ...t,
      children: r
    }
  );
}
function ot({ tone: s = "neutral", children: i }) {
  const { theme: o, scales: r } = b(), n = {
    neutral: { bg: o.surface.tertiary, fg: o.text["medium-emphasis"] },
    accent: { bg: o.surface["accent-primary-light"], fg: o.text["accent-primary"] },
    success: { bg: o.surface.success, fg: o.text.success },
    caution: { bg: o.surface.caution, fg: o.text.caution },
    warning: { bg: o.surface.warning, fg: o.text.warning },
    info: { bg: o.surface.info, fg: o.text.info }
  }[s];
  return /* @__PURE__ */ e(
    c,
    {
      style: {
        backgroundColor: n.bg,
        borderRadius: r.borderRadius.full,
        paddingVertical: r.spacing.scale[1],
        paddingHorizontal: r.spacing.scale[3],
        alignSelf: "flex-start"
      },
      children: /* @__PURE__ */ e(u, { style: [h("label.sm"), { color: n.fg }], children: i })
    }
  );
}
function st({
  gap: s = 3,
  direction: i = "column",
  align: o,
  justify: r,
  wrap: t = !1,
  style: n,
  children: a,
  ...l
}) {
  const { scales: d } = b();
  return /* @__PURE__ */ e(
    c,
    {
      style: [
        {
          flexDirection: i,
          gap: d.spacing.scale[s],
          alignItems: o,
          justifyContent: r,
          flexWrap: t ? "wrap" : "nowrap"
        },
        n
      ],
      ...l,
      children: a
    }
  );
}
const Ce = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80
};
function Re({ source: s, fallback: i, size: o = "md" }) {
  const { theme: r } = b(), t = Ce[o];
  return s ? /* @__PURE__ */ e(
    V,
    {
      source: s,
      style: {
        width: t,
        height: t,
        borderRadius: t / 2,
        backgroundColor: r.surface.tertiary
      }
    }
  ) : /* @__PURE__ */ e(
    c,
    {
      style: {
        width: t,
        height: t,
        borderRadius: t / 2,
        backgroundColor: r.surface.tertiary,
        alignItems: "center",
        justifyContent: "center"
      },
      children: /* @__PURE__ */ e(u, { style: [h("label.sm"), { color: r.text["medium-emphasis"] }], children: i ?? "?" })
    }
  );
}
const Z = { sm: 28, md: 32, lg: 36 }, ve = { sm: 10, md: 12, lg: 16 };
function ae({
  variant: s = "filled",
  size: i = "md",
  shape: o = "pill",
  selected: r = !1,
  disabled: t = !1,
  count: n,
  removable: a = !1,
  onRemove: l,
  children: d,
  ...m
}) {
  const { theme: g, scales: y } = b(), x = {
    filled: { bg: g.surface.secondary, fg: g.text["high-emphasis"], border: "transparent" },
    accent: {
      bg: g.surface["accent-primary-light"],
      fg: g.text["accent-primary"],
      border: "transparent"
    },
    outline: { bg: "transparent", fg: g.text["high-emphasis"], border: g.border["medium-emphasis"] }
  }[s], R = r ? g.brand.primary : x.bg, C = r ? g.text["on-inverse"] : t ? g.text.disable : x.fg, w = r ? g.brand.primary : x.border;
  return /* @__PURE__ */ p(c, { style: { flexDirection: "row", alignSelf: "flex-start" }, children: [
    /* @__PURE__ */ p(
      f,
      {
        disabled: t,
        style: ({ pressed: v }) => [
          {
            height: Z[i],
            paddingHorizontal: ve[i],
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: y.spacing.scale[1],
            borderRadius: o === "pill" ? y.borderRadius.full : y.borderRadius.sm,
            borderWidth: s === "outline" || r ? 1 : 0,
            borderColor: w,
            backgroundColor: v && !t ? g.active["secondary-button"] : R,
            opacity: t ? 0.6 : 1
          },
          a && { borderTopRightRadius: 0, borderBottomRightRadius: 0 }
        ],
        ...m,
        children: [
          /* @__PURE__ */ e(u, { style: [h("label.sm"), { color: C }], children: d }),
          n !== void 0 && /* @__PURE__ */ e(
            c,
            {
              style: {
                minWidth: 20,
                paddingHorizontal: 6,
                borderRadius: y.borderRadius.full,
                backgroundColor: r ? g.surface.primary : g.surface.tertiary,
                alignItems: "center",
                justifyContent: "center"
              },
              children: /* @__PURE__ */ e(
                u,
                {
                  style: [
                    h("label.xs"),
                    { color: r ? g.text["accent-primary"] : g.text["medium-emphasis"] }
                  ],
                  children: n
                }
              )
            }
          )
        ]
      }
    ),
    a && /* @__PURE__ */ e(
      f,
      {
        onPress: l,
        disabled: t,
        style: ({ pressed: v }) => ({
          height: Z[i],
          paddingHorizontal: 10,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: v ? g.active["tertiary-button"] : R,
          borderTopRightRadius: o === "pill" ? y.borderRadius.full : y.borderRadius.sm,
          borderBottomRightRadius: o === "pill" ? y.borderRadius.full : y.borderRadius.sm,
          borderWidth: s === "outline" || r ? 1 : 0,
          borderLeftWidth: 0,
          borderColor: w,
          opacity: t ? 0.6 : 1
        }),
        children: /* @__PURE__ */ e(u, { style: [h("label.md"), { color: C, lineHeight: 14 }], children: "×" })
      }
    )
  ] });
}
function ke({ tone: s = "neutral", variant: i = "filled", children: o }) {
  const { theme: r, scales: t } = b(), n = {
    neutral: { bg: r.surface.tertiary, fg: r.text["medium-emphasis"] },
    accent: { bg: r.surface["accent-primary-light"], fg: r.text["accent-primary"] },
    success: { bg: r.surface.success, fg: r.text.success },
    caution: { bg: r.surface.caution, fg: r.text.caution },
    warning: { bg: r.surface.warning, fg: r.text.warning },
    info: { bg: r.surface.info, fg: r.text.info }
  }, a = {
    neutral: { fg: r.text["medium-emphasis"], border: r.border["medium-emphasis"] },
    accent: { fg: r.text["accent-primary"], border: r.border["accent-primary"] },
    success: { fg: r.text.success, border: r.border.success },
    caution: { fg: r.text.caution, border: r.border.caution },
    warning: { fg: r.text.warning, border: r.border.warning },
    info: { fg: r.text.info, border: r.border.info }
  }, l = i === "filled" ? n[s] : null, d = i === "outline" ? a[s] : null;
  return /* @__PURE__ */ e(
    c,
    {
      style: {
        backgroundColor: l?.bg ?? "transparent",
        borderColor: d?.border,
        borderWidth: i === "outline" ? 1 : 0,
        borderRadius: t.borderRadius.sm,
        paddingVertical: t.spacing.scale[1],
        paddingHorizontal: t.spacing.scale[2],
        alignSelf: "flex-start"
      },
      children: /* @__PURE__ */ e(u, { style: [h("label.xs"), { color: l?.fg ?? d?.fg ?? r.text["medium-emphasis"] }], children: o })
    }
  );
}
function at({ size: s = "md", color: i }) {
  const { theme: o } = b();
  return /* @__PURE__ */ e(
    ne,
    {
      size: s === "sm" ? "small" : "large",
      color: i ?? o.brand.primary
    }
  );
}
function F({ orientation: s = "horizontal", emphasis: i = "low" }) {
  const { theme: o } = b(), r = i === "low" ? o.border["low-emphasis"] : o.border["medium-emphasis"];
  return s === "vertical" ? /* @__PURE__ */ e(c, { style: { width: 1, alignSelf: "stretch", backgroundColor: r } }) : /* @__PURE__ */ e(c, { style: { height: 1, alignSelf: "stretch", backgroundColor: r } });
}
function H({ width: s = "100%", height: i = 16, radius: o, style: r }) {
  const { theme: t, scales: n } = b(), a = z(new S.Value(0.4)).current;
  return Y(() => {
    const l = S.loop(
      S.sequence([
        S.timing(a, { toValue: 1, duration: 800, useNativeDriver: !0 }),
        S.timing(a, { toValue: 0.4, duration: 800, useNativeDriver: !0 })
      ])
    );
    return l.start(), () => l.stop();
  }, [a]), /* @__PURE__ */ e(
    S.View,
    {
      style: [
        {
          width: s,
          height: i,
          backgroundColor: t.surface.tertiary,
          borderRadius: o ?? n.borderRadius.md,
          opacity: a
        },
        r
      ]
    }
  );
}
function it({ lines: s = 3 }) {
  return /* @__PURE__ */ e(c, { style: { gap: 8 }, children: Array.from({ length: s }).map((i, o) => /* @__PURE__ */ e(H, { height: 12, width: o === s - 1 ? "60%" : "100%" }, o)) });
}
function lt({ value: s, max: i = 100, height: o = 8, tone: r = "accent" }) {
  const { theme: t, scales: n } = b(), a = Math.min(100, Math.max(0, s / i * 100)), l = {
    accent: t.brand.primary,
    success: t.success.base,
    caution: t.caution.base,
    warning: t.warning.base
  }[r];
  return /* @__PURE__ */ e(
    c,
    {
      style: {
        width: "100%",
        height: o,
        borderRadius: n.borderRadius.full,
        backgroundColor: t.surface.tertiary,
        overflow: "hidden"
      },
      children: /* @__PURE__ */ e(
        c,
        {
          style: {
            width: `${a}%`,
            height: "100%",
            backgroundColor: l,
            borderRadius: n.borderRadius.full
          }
        }
      )
    }
  );
}
function ct({
  value: s,
  max: i = 100,
  size: o = 64,
  thickness: r = 6,
  showLabel: t = !0
}) {
  const { theme: n } = b(), a = Math.min(100, Math.max(0, s / i * 100)), l = a / 100 * 360, d = n.surface.tertiary, m = n.brand.primary, g = o / 2, y = (x) => /* @__PURE__ */ e(
    c,
    {
      style: {
        position: "absolute",
        width: o,
        height: o,
        transform: [{ rotate: `${x}deg` }]
      },
      children: /* @__PURE__ */ e(
        c,
        {
          style: {
            position: "absolute",
            width: g,
            height: o,
            backgroundColor: m,
            borderTopLeftRadius: g,
            borderBottomLeftRadius: g
          }
        }
      )
    }
  );
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        width: o,
        height: o,
        alignItems: "center",
        justifyContent: "center"
      },
      children: [
        /* @__PURE__ */ e(
          c,
          {
            style: {
              position: "absolute",
              width: o,
              height: o,
              borderRadius: o / 2,
              backgroundColor: d
            }
          }
        ),
        l > 0 && y(0),
        l > 180 && y(180),
        l > 0 && l < 180 && /* @__PURE__ */ e(
          c,
          {
            style: {
              position: "absolute",
              width: o,
              height: o,
              transform: [{ rotate: `${l - 180}deg` }]
            },
            children: /* @__PURE__ */ e(
              c,
              {
                style: {
                  position: "absolute",
                  right: 0,
                  width: g,
                  height: o,
                  backgroundColor: d,
                  borderTopRightRadius: g,
                  borderBottomRightRadius: g
                }
              }
            )
          }
        ),
        l >= 180 && l < 360 && /* @__PURE__ */ e(
          c,
          {
            style: {
              position: "absolute",
              width: o,
              height: o,
              transform: [{ rotate: `${l}deg` }]
            },
            children: /* @__PURE__ */ e(
              c,
              {
                style: {
                  position: "absolute",
                  right: 0,
                  width: g,
                  height: o,
                  backgroundColor: d,
                  borderTopRightRadius: g,
                  borderBottomRightRadius: g
                }
              }
            )
          }
        ),
        /* @__PURE__ */ e(
          c,
          {
            style: {
              width: o - r * 2,
              height: o - r * 2,
              borderRadius: (o - r * 2) / 2,
              backgroundColor: n.surface.primary,
              alignItems: "center",
              justifyContent: "center"
            },
            children: t && /* @__PURE__ */ p(u, { style: [h("label.sm"), { color: n.text["high-emphasis"] }], children: [
              Math.round(a),
              "%"
            ] })
          }
        )
      ]
    }
  );
}
function X({ value: s, max: i = 5, size: o = 20, onChange: r, readOnly: t = !1 }) {
  const { theme: n } = b(), a = n.object.rating, l = n.object["low-emphasis"], d = Math.max(0, Math.min(i, s));
  return /* @__PURE__ */ e(c, { style: { flexDirection: "row", gap: 2 }, children: Array.from({ length: i }).map((m, g) => {
    const y = g + 1 <= d, x = !y && g + 0.5 <= d, w = /* @__PURE__ */ e(
      u,
      {
        style: {
          fontSize: o,
          color: y || x ? a : l,
          opacity: x ? 0.5 : 1
        },
        children: x || y ? "★" : "☆"
      }
    );
    return t || !r ? /* @__PURE__ */ e(c, { children: w }, g) : /* @__PURE__ */ e(f, { onPress: () => r(g + 1), hitSlop: 8, children: w }, g);
  }) });
}
function dt({ count: s = 0, max: i = 99, dot: o = !1, children: r }) {
  const { theme: t, scales: n } = b();
  return r ? /* @__PURE__ */ p(c, { style: { position: "relative" }, children: [
    r,
    (o || s > 0) && /* @__PURE__ */ e(
      c,
      {
        style: {
          position: "absolute",
          top: -4,
          right: -4,
          ...o ? { width: 8, height: 8, borderRadius: 4 } : {
            minWidth: 18,
            paddingHorizontal: 6,
            height: 18,
            borderRadius: n.borderRadius.full,
            alignItems: "center",
            justifyContent: "center"
          },
          backgroundColor: t.caution.base,
          borderWidth: 2,
          borderColor: t.surface.primary
        },
        children: !o && /* @__PURE__ */ e(u, { style: [h("label.xs"), { color: t.text["on-inverse"] }], children: s > i ? `${i}+` : s })
      }
    )
  ] }) : o ? /* @__PURE__ */ e(
    c,
    {
      style: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: t.caution.base
      }
    }
  ) : /* @__PURE__ */ e(
    c,
    {
      style: {
        minWidth: 18,
        paddingHorizontal: 6,
        height: 18,
        borderRadius: n.borderRadius.full,
        backgroundColor: t.caution.base,
        alignItems: "center",
        justifyContent: "center"
      },
      children: /* @__PURE__ */ e(u, { style: [h("label.xs"), { color: t.text["on-inverse"] }], children: s > i ? `${i}+` : s })
    }
  );
}
function ht({ label: s, value: i, delta: o, trend: r = "neutral" }) {
  const { theme: t, scales: n } = b(), a = r === "up" ? t.text.success : r === "down" ? t.text.caution : t.text["low-emphasis"];
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        backgroundColor: t.surface.primary,
        borderColor: t.border["low-emphasis"],
        borderWidth: 1,
        borderRadius: n.borderRadius.lg,
        padding: n.spacing.scale[4],
        gap: n.spacing.scale[1]
      },
      children: [
        /* @__PURE__ */ e(u, { style: [h("label.sm"), { color: t.text["low-emphasis"] }], children: s }),
        /* @__PURE__ */ e(u, { style: [h("heading.2xl"), { color: t.text["high-emphasis"] }], children: i }),
        o && /* @__PURE__ */ p(u, { style: [h("label.sm"), { color: a }], children: [
          r === "up" ? "▲" : r === "down" ? "▼" : "■",
          " ",
          o
        ] })
      ]
    }
  );
}
function ut({ status: s, label: i }) {
  const { theme: o, scales: r } = b(), t = {
    synced: { bg: o.surface.success, fg: o.text.success, dot: o.success.base, def: "同期済み" },
    syncing: { bg: o.surface.info, fg: o.text.info, dot: o.info.base, def: "同期中" },
    offline: {
      bg: o.surface.tertiary,
      fg: o.text["medium-emphasis"],
      dot: o.text["low-emphasis"],
      def: "オフライン"
    },
    error: { bg: o.surface.caution, fg: o.text.caution, dot: o.caution.base, def: "エラー" }
  }[s];
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        flexDirection: "row",
        alignItems: "center",
        gap: r.spacing.scale[1],
        backgroundColor: t.bg,
        borderRadius: r.borderRadius.full,
        paddingHorizontal: r.spacing.scale[2],
        paddingVertical: r.spacing.scale[1],
        alignSelf: "flex-start"
      },
      children: [
        s === "syncing" ? /* @__PURE__ */ e(ne, { size: "small", color: t.fg }) : /* @__PURE__ */ e(
          c,
          {
            style: {
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: t.dot
            }
          }
        ),
        /* @__PURE__ */ e(u, { style: [h("label.xs"), { color: t.fg }], children: i ?? t.def })
      ]
    }
  );
}
function Ie(s) {
  return s.toString().padStart(2, "0");
}
function gt({ target: s, onComplete: i, tone: o = "neutral" }) {
  const { theme: r, scales: t } = b(), n = s instanceof Date ? s.getTime() : s, [a, l] = I(() => Date.now());
  Y(() => {
    const v = setInterval(() => {
      const k = Date.now();
      l(k), k >= n && (clearInterval(v), i?.());
    }, 1e3);
    return () => clearInterval(v);
  }, [n, i]);
  const d = Math.max(0, n - a), m = Math.floor(d / 1e3), g = Math.floor(m / 86400), y = Math.floor(m % 86400 / 3600), x = Math.floor(m % 3600 / 60), R = m % 60, C = o === "accent" ? r.text["accent-primary"] : o === "caution" ? r.text.caution : r.text["high-emphasis"], w = (v, k) => /* @__PURE__ */ p(c, { style: { alignItems: "center", minWidth: 48 }, children: [
    /* @__PURE__ */ e(
      c,
      {
        style: {
          backgroundColor: r.surface.secondary,
          paddingVertical: t.spacing.scale[1],
          paddingHorizontal: t.spacing.scale[2],
          borderRadius: t.borderRadius.md
        },
        children: /* @__PURE__ */ e(u, { style: [h("heading.md"), { color: C }], children: Ie(v) })
      }
    ),
    /* @__PURE__ */ e(u, { style: [h("label.xs"), { color: r.text["low-emphasis"], marginTop: 2 }], children: k })
  ] });
  return /* @__PURE__ */ p(c, { style: { flexDirection: "row", gap: t.spacing.scale[2] }, children: [
    g > 0 && w(g, "日"),
    w(y, "時間"),
    w(x, "分"),
    w(R, "秒")
  ] });
}
function Se({ required: s, children: i, style: o, ...r }) {
  const { theme: t, scales: n } = b();
  return /* @__PURE__ */ p(
    c,
    {
      style: [{ flexDirection: "row", alignItems: "center", gap: n.spacing.scale[1] }, o],
      ...r,
      children: [
        /* @__PURE__ */ e(u, { style: [h("label.md"), { color: t.text["high-emphasis"] }], children: i }),
        s && /* @__PURE__ */ e(u, { style: [h("label.sm"), { color: t.caution.base }], children: "*" })
      ]
    }
  );
}
function ie({ invalid: s, disabled: i, leading: o, trailing: r, ...t }) {
  const { theme: n, scales: a } = b(), [l, d] = I(!1), m = s ? n.border.caution : l ? n.border["accent-primary"] : n.border["medium-emphasis"];
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        flexDirection: "row",
        alignItems: "center",
        gap: a.spacing.scale[2],
        minHeight: a.touchTargets.textInput.min,
        paddingHorizontal: a.spacing.scale[3],
        borderRadius: a.borderRadius.md,
        borderWidth: 1,
        borderColor: m,
        backgroundColor: i ? n.surface.disable : n.surface.primary,
        opacity: i ? 0.6 : 1
      },
      children: [
        o,
        /* @__PURE__ */ e(
          L,
          {
            editable: !i,
            onFocus: (g) => {
              d(!0), t.onFocus?.(g);
            },
            onBlur: (g) => {
              d(!1), t.onBlur?.(g);
            },
            placeholderTextColor: n.text["low-emphasis"],
            style: [
              h("body.md"),
              { flex: 1, color: n.text["high-emphasis"], paddingVertical: 0 }
            ],
            ...t
          }
        ),
        r
      ]
    }
  );
}
function De({ invalid: s, disabled: i, minHeight: o = 96, ...r }) {
  const { theme: t, scales: n } = b(), [a, l] = I(!1), d = s ? t.border.caution : a ? t.border["accent-primary"] : t.border["medium-emphasis"];
  return /* @__PURE__ */ e(
    L,
    {
      editable: !i,
      multiline: !0,
      textAlignVertical: "top",
      onFocus: (m) => {
        l(!0), r.onFocus?.(m);
      },
      onBlur: (m) => {
        l(!1), r.onBlur?.(m);
      },
      placeholderTextColor: t.text["low-emphasis"],
      style: [
        h("body.md"),
        {
          minHeight: o,
          padding: n.spacing.scale[3],
          borderRadius: n.borderRadius.md,
          borderWidth: 1,
          borderColor: d,
          backgroundColor: i ? t.surface.disable : t.surface.primary,
          color: t.text["high-emphasis"],
          opacity: i ? 0.6 : 1
        }
      ],
      ...r
    }
  );
}
function pt({
  invalid: s,
  disabled: i,
  minHeight: o = 44,
  maxHeight: r = 200,
  ...t
}) {
  const { theme: n, scales: a } = b(), [l, d] = I(!1), [m, g] = I(o), y = s ? n.border.caution : l ? n.border["accent-primary"] : n.border["medium-emphasis"];
  return /* @__PURE__ */ e(
    L,
    {
      editable: !i,
      multiline: !0,
      textAlignVertical: "top",
      onContentSizeChange: (R) => {
        const C = Math.min(r, Math.max(o, R.nativeEvent.contentSize.height + 16));
        g(C);
      },
      onFocus: (R) => {
        d(!0), t.onFocus?.(R);
      },
      onBlur: (R) => {
        d(!1), t.onBlur?.(R);
      },
      placeholderTextColor: n.text["low-emphasis"],
      style: [
        h("body.md"),
        {
          height: m,
          padding: a.spacing.scale[3],
          borderRadius: a.borderRadius.md,
          borderWidth: 1,
          borderColor: y,
          backgroundColor: i ? n.surface.disable : n.surface.primary,
          color: n.text["high-emphasis"],
          opacity: i ? 0.6 : 1
        }
      ],
      ...t
    }
  );
}
function mt(s) {
  const { theme: i } = b();
  return /* @__PURE__ */ e(
    ge,
    {
      trackColor: { false: i.surface.tertiary, true: i.brand.primary },
      thumbColor: i.surface.primary,
      ios_backgroundColor: i.surface.tertiary,
      ...s
    }
  );
}
function Q({ checked: s = !1, onChange: i, disabled: o = !1, size: r = 20 }) {
  const { theme: t, scales: n } = b();
  return /* @__PURE__ */ e(
    f,
    {
      onPress: () => !o && i?.(!s),
      disabled: o,
      hitSlop: 8,
      accessibilityRole: "checkbox",
      accessibilityState: { checked: s, disabled: o },
      style: {
        width: r,
        height: r,
        borderRadius: n.borderRadius.sm,
        borderWidth: 2,
        borderColor: s ? t.brand.primary : t.border["medium-emphasis"],
        backgroundColor: s ? t.brand.primary : "transparent",
        alignItems: "center",
        justifyContent: "center",
        opacity: o ? 0.4 : 1
      },
      children: s && /* @__PURE__ */ e(
        c,
        {
          style: {
            width: r * 0.5,
            height: r * 0.25,
            borderLeftWidth: 2,
            borderBottomWidth: 2,
            borderColor: t.text["on-inverse"],
            transform: [{ rotate: "-45deg" }, { translateY: -1 }]
          }
        }
      )
    }
  );
}
function Te({
  checked: s = !1,
  onChange: i,
  disabled: o = !1,
  label: r,
  description: t
}) {
  const { theme: n, scales: a } = b();
  return /* @__PURE__ */ p(
    f,
    {
      onPress: () => !o && i?.(!s),
      disabled: o,
      style: {
        flexDirection: "row",
        gap: a.spacing.scale[2],
        alignItems: "flex-start",
        opacity: o ? 0.6 : 1
      },
      children: [
        /* @__PURE__ */ e(c, { style: { paddingTop: 2 }, children: /* @__PURE__ */ e(Q, { checked: s, disabled: o, onChange: i }) }),
        /* @__PURE__ */ p(c, { style: { flex: 1, gap: 2 }, children: [
          /* @__PURE__ */ e(u, { style: [h("body.md"), { color: n.text["high-emphasis"] }], children: r }),
          t && /* @__PURE__ */ e(u, { style: [h("body.sm"), { color: n.text["medium-emphasis"] }], children: t })
        ] })
      ]
    }
  );
}
function yt({
  checked: s = !1,
  onChange: i,
  disabled: o = !1,
  title: r,
  description: t
}) {
  const { theme: n, scales: a } = b();
  return /* @__PURE__ */ p(
    f,
    {
      onPress: () => !o && i?.(!s),
      disabled: o,
      style: {
        flexDirection: "row",
        gap: a.spacing.scale[3],
        alignItems: "flex-start",
        padding: a.spacing.scale[4],
        borderRadius: a.borderRadius.lg,
        borderWidth: 1,
        borderColor: s ? n.border["accent-primary"] : n.border["low-emphasis"],
        backgroundColor: s ? n.surface["accent-primary-light"] : n.surface.primary,
        opacity: o ? 0.6 : 1
      },
      children: [
        /* @__PURE__ */ e(c, { style: { paddingTop: 2 }, children: /* @__PURE__ */ e(Q, { checked: s, disabled: o, onChange: i }) }),
        /* @__PURE__ */ p(c, { style: { flex: 1, gap: 2 }, children: [
          /* @__PURE__ */ e(u, { style: [h("label.md"), { color: n.text["high-emphasis"] }], children: r }),
          t && /* @__PURE__ */ e(u, { style: [h("body.sm"), { color: n.text["medium-emphasis"] }], children: t })
        ] })
      ]
    }
  );
}
function bt({ options: s, values: i = [], onChange: o, disabled: r = !1 }) {
  const { scales: t } = b(), n = (a) => {
    i.includes(a) ? o?.(i.filter((l) => l !== a)) : o?.([...i, a]);
  };
  return /* @__PURE__ */ e(c, { style: { gap: t.spacing.scale[3] }, children: s.map((a) => /* @__PURE__ */ e(
    Te,
    {
      label: a.label,
      description: a.description,
      checked: i.includes(a.value),
      disabled: r,
      onChange: () => n(a.value)
    },
    a.value
  )) });
}
function ft({ options: s, value: i, onChange: o, disabled: r = !1 }) {
  const { theme: t, scales: n } = b();
  return /* @__PURE__ */ e(c, { style: { gap: n.spacing.scale[3] }, children: s.map((a) => {
    const l = i === a.value, d = r || a.disabled;
    return /* @__PURE__ */ p(
      f,
      {
        onPress: () => !d && o?.(a.value),
        disabled: d,
        style: {
          flexDirection: "row",
          gap: n.spacing.scale[2],
          alignItems: "flex-start",
          opacity: d ? 0.5 : 1
        },
        accessibilityRole: "radio",
        accessibilityState: { selected: l },
        children: [
          /* @__PURE__ */ e(
            c,
            {
              style: {
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: l ? t.brand.primary : t.border["medium-emphasis"],
                alignItems: "center",
                justifyContent: "center",
                marginTop: 2
              },
              children: l && /* @__PURE__ */ e(
                c,
                {
                  style: {
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: t.brand.primary
                  }
                }
              )
            }
          ),
          /* @__PURE__ */ p(c, { style: { flex: 1, gap: 2 }, children: [
            /* @__PURE__ */ e(u, { style: [h("body.md"), { color: t.text["high-emphasis"] }], children: a.label }),
            a.description && /* @__PURE__ */ e(u, { style: [h("body.sm"), { color: t.text["medium-emphasis"] }], children: a.description })
          ] })
        ]
      },
      a.value
    );
  }) });
}
function xt({
  value: s,
  onChange: i,
  min: o = 0,
  max: r = 100,
  step: t = 1,
  disabled: n = !1
}) {
  const { theme: a, scales: l } = b(), [d, m] = I(0), g = z(0), y = (k) => Math.max(o, Math.min(r, k)), x = (k) => t ? Math.round(k / t) * t : k, R = (k) => {
    if (!g.current) return;
    const D = Math.max(0, Math.min(1, k / g.current)), q = y(x(o + (r - o) * D));
    i?.(q);
  }, C = z(
    oe.create({
      onStartShouldSetPanResponder: () => !n,
      onMoveShouldSetPanResponder: () => !n,
      onPanResponderGrant: (k) => R(k.nativeEvent.locationX),
      onPanResponderMove: (k) => R(k.nativeEvent.locationX)
    })
  ).current, w = (y(s) - o) / (r - o);
  return /* @__PURE__ */ p(
    c,
    {
      onLayout: (k) => {
        const D = k.nativeEvent.layout.width;
        m(D), g.current = D;
      },
      ...C.panHandlers,
      style: {
        height: 32,
        justifyContent: "center",
        opacity: n ? 0.5 : 1
      },
      children: [
        /* @__PURE__ */ e(
          c,
          {
            style: {
              height: 6,
              borderRadius: l.borderRadius.full,
              backgroundColor: a.surface.tertiary
            }
          }
        ),
        /* @__PURE__ */ e(
          c,
          {
            style: {
              position: "absolute",
              left: 0,
              height: 6,
              width: d * w,
              borderRadius: l.borderRadius.full,
              backgroundColor: a.brand.primary
            }
          }
        ),
        /* @__PURE__ */ e(
          c,
          {
            style: {
              position: "absolute",
              left: d * w - 10,
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: a.brand.primary,
              borderWidth: 2,
              borderColor: a.surface.primary
            }
          }
        )
      ]
    }
  );
}
function Pe({
  value: s,
  onChange: i,
  min: o = 0,
  max: r = 99,
  step: t = 1,
  disabled: n = !1
}) {
  const { theme: a, scales: l } = b(), d = (y) => Math.max(o, Math.min(r, y)), m = () => !n && i?.(d(s + t)), g = () => !n && i?.(d(s - t));
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: a.border["medium-emphasis"],
        borderRadius: l.borderRadius.md,
        backgroundColor: a.surface.primary,
        overflow: "hidden",
        alignSelf: "flex-start",
        opacity: n ? 0.5 : 1
      },
      children: [
        /* @__PURE__ */ e(
          f,
          {
            onPress: g,
            disabled: n || s <= o,
            style: ({ pressed: y }) => ({
              width: 40,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: y ? a.active["tertiary-button"] : "transparent"
            }),
            children: /* @__PURE__ */ e(u, { style: [h("heading.md"), { color: a.text["high-emphasis"] }], children: "−" })
          }
        ),
        /* @__PURE__ */ e(
          L,
          {
            value: String(s),
            onChangeText: (y) => {
              const x = Number(y.replace(/[^0-9-]/g, ""));
              Number.isNaN(x) || i?.(d(x));
            },
            keyboardType: "number-pad",
            editable: !n,
            style: [
              h("body.md"),
              {
                width: 56,
                textAlign: "center",
                color: a.text["high-emphasis"],
                paddingVertical: 0,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderColor: a.border["low-emphasis"]
              }
            ]
          }
        ),
        /* @__PURE__ */ e(
          f,
          {
            onPress: m,
            disabled: n || s >= r,
            style: ({ pressed: y }) => ({
              width: 40,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: y ? a.active["tertiary-button"] : "transparent"
            }),
            children: /* @__PURE__ */ e(u, { style: [h("heading.md"), { color: a.text["high-emphasis"] }], children: "＋" })
          }
        )
      ]
    }
  );
}
function wt({ label: s, required: i, description: o, error: r, children: t }) {
  const { theme: n, scales: a } = b();
  return /* @__PURE__ */ p(c, { style: { gap: a.spacing.scale[2] }, children: [
    s && /* @__PURE__ */ e(Se, { required: i, children: s }),
    o && !r && /* @__PURE__ */ e(u, { style: [h("body.sm"), { color: n.text["medium-emphasis"] }], children: o }),
    t,
    r && /* @__PURE__ */ e(u, { style: [h("body.sm"), { color: n.text.caution }], children: r })
  ] });
}
function Ct({ tone: s = "info", title: i, description: o, children: r }) {
  const { theme: t, scales: n } = b(), a = {
    info: { bg: t.surface.info, fg: t.text.info, border: t.border.info },
    success: { bg: t.surface.success, fg: t.text.success, border: t.border.success },
    warning: { bg: t.surface.warning, fg: t.text.warning, border: t.border.warning },
    caution: { bg: t.surface.caution, fg: t.text.caution, border: t.border.caution }
  }[s];
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        backgroundColor: a.bg,
        borderColor: a.border,
        borderLeftWidth: 4,
        borderRadius: n.borderRadius.md,
        padding: n.spacing.scale[3],
        gap: n.spacing.scale[1]
      },
      children: [
        i && /* @__PURE__ */ e(u, { style: [h("label.md"), { color: a.fg }], children: i }),
        o && /* @__PURE__ */ e(u, { style: [h("body.sm"), { color: t.text["high-emphasis"] }], children: o }),
        r
      ]
    }
  );
}
function le({
  open: s,
  onClose: i,
  title: o,
  description: r,
  footer: t,
  children: n,
  dismissOnBackdrop: a = !0
}) {
  const { theme: l, scales: d } = b();
  return /* @__PURE__ */ e(E, { visible: s, transparent: !0, animationType: "fade", onRequestClose: i, children: /* @__PURE__ */ e(
    f,
    {
      onPress: () => a && i(),
      style: {
        flex: 1,
        backgroundColor: l.overlay.dark,
        alignItems: "center",
        justifyContent: "center",
        padding: d.spacing.scale[4]
      },
      children: /* @__PURE__ */ p(
        f,
        {
          onPress: () => {
          },
          style: {
            width: "100%",
            maxWidth: 480,
            backgroundColor: l.surface.primary,
            borderRadius: d.borderRadius["2xl"],
            padding: d.spacing.scale[5],
            gap: d.spacing.scale[3]
          },
          children: [
            o && /* @__PURE__ */ e(u, { style: [h("heading.lg"), { color: l.text["high-emphasis"] }], children: o }),
            r && /* @__PURE__ */ e(u, { style: [h("body.md"), { color: l.text["medium-emphasis"] }], children: r }),
            n,
            t && /* @__PURE__ */ e(c, { style: { flexDirection: "row", justifyContent: "flex-end", gap: d.spacing.scale[2] }, children: t })
          ]
        }
      )
    }
  ) });
}
function We({
  open: s,
  onClose: i,
  title: o,
  description: r,
  confirmLabel: t = "OK",
  cancelLabel: n = "キャンセル",
  onConfirm: a,
  destructive: l = !1
}) {
  const { scales: d } = b();
  return /* @__PURE__ */ e(
    le,
    {
      open: s,
      onClose: i,
      title: o,
      description: r,
      dismissOnBackdrop: !1,
      footer: /* @__PURE__ */ p(M, { children: [
        /* @__PURE__ */ e(c, { style: { minWidth: 100 }, children: /* @__PURE__ */ e(P, { variant: "tertiary", onPress: i, children: n }) }),
        /* @__PURE__ */ e(c, { style: { minWidth: 100 }, children: /* @__PURE__ */ e(
          P,
          {
            variant: l ? "destructive" : "primary",
            onPress: () => {
              a?.(), i();
            },
            children: t
          }
        ) })
      ] })
    }
  );
}
function W({ open: s, onClose: i, side: o = "bottom", title: r, children: t }) {
  const { theme: n, scales: a } = b(), l = z(new S.Value(0)).current;
  Y(() => {
    S.timing(l, {
      toValue: s ? 1 : 0,
      duration: 220,
      useNativeDriver: !0
    }).start();
  }, [s, l]);
  const { width: d, height: m } = $.get("window"), g = {
    bottom: { translateY: l.interpolate({ inputRange: [0, 1], outputRange: [m, 0] }) },
    top: { translateY: l.interpolate({ inputRange: [0, 1], outputRange: [-m, 0] }) },
    left: { translateX: l.interpolate({ inputRange: [0, 1], outputRange: [-d, 0] }) },
    right: { translateX: l.interpolate({ inputRange: [0, 1], outputRange: [d, 0] }) }
  }, y = {
    bottom: { justifyContent: "flex-end" },
    top: { justifyContent: "flex-start" },
    left: { alignItems: "flex-start" },
    right: { alignItems: "flex-end" }
  };
  return /* @__PURE__ */ e(E, { visible: s, transparent: !0, animationType: "none", onRequestClose: i, children: /* @__PURE__ */ e(
    f,
    {
      onPress: i,
      style: { flex: 1, backgroundColor: n.overlay.dark, ...y[o] },
      children: /* @__PURE__ */ e(
        S.View,
        {
          style: {
            transform: [
              g[o].translateX ? { translateX: g[o].translateX } : { translateX: 0 },
              g[o].translateY ? { translateY: g[o].translateY } : { translateY: 0 }
            ],
            backgroundColor: n.surface.primary,
            ...o === "bottom" || o === "top" ? { width: "100%", borderTopLeftRadius: a.borderRadius["2xl"], borderTopRightRadius: a.borderRadius["2xl"] } : { height: "100%", width: "85%" },
            padding: a.spacing.scale[4],
            gap: a.spacing.scale[3]
          },
          children: /* @__PURE__ */ p(f, { onPress: () => {
          }, children: [
            o === "bottom" && /* @__PURE__ */ e(
              c,
              {
                style: {
                  width: 40,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: n.border["medium-emphasis"],
                  alignSelf: "center",
                  marginBottom: a.spacing.scale[2]
                }
              }
            ),
            r && /* @__PURE__ */ e(u, { style: [h("heading.md"), { color: n.text["high-emphasis"] }], children: r }),
            /* @__PURE__ */ e(c, { style: { marginTop: a.spacing.scale[2] }, children: t })
          ] })
        }
      )
    }
  ) });
}
function Rt({ breakpoint: s = 600, ...i }) {
  const { width: o } = $.get("window");
  return o <= s ? /* @__PURE__ */ p(W, { open: i.open, onClose: i.onClose, side: "bottom", title: i.title, children: [
    i.children,
    i.footer
  ] }) : /* @__PURE__ */ e(le, { ...i });
}
function He({ open: s, onClose: i, anchor: o, children: r }) {
  const { theme: t, scales: n } = b(), [a, l] = I({ width: 200, height: 100 }), d = (y) => {
    l({ width: y.nativeEvent.layout.width, height: y.nativeEvent.layout.height });
  }, m = o ? o.y + (o.height ?? 0) + 4 : 100, g = o ? o.x : 0;
  return /* @__PURE__ */ e(E, { visible: s, transparent: !0, animationType: "fade", onRequestClose: i, children: /* @__PURE__ */ e(f, { onPress: i, style: { flex: 1 }, children: /* @__PURE__ */ e(
    c,
    {
      onLayout: d,
      style: {
        position: "absolute",
        top: m,
        left: Math.max(8, g),
        minWidth: 160,
        backgroundColor: t.surface.primary,
        borderRadius: n.borderRadius.lg,
        borderWidth: 1,
        borderColor: t.border["low-emphasis"],
        padding: n.spacing.scale[2],
        shadowColor: t.overlay.dark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6
      },
      children: /* @__PURE__ */ e(f, { onPress: () => {
      }, children: r })
    }
  ) }) });
}
function vt({ open: s, onClose: i, anchor: o, items: r }) {
  const { theme: t, scales: n } = b();
  return /* @__PURE__ */ e(He, { open: s, onClose: i, anchor: o, children: /* @__PURE__ */ e(c, { style: { minWidth: 180 }, children: r.map((a, l) => /* @__PURE__ */ p(O.Fragment, { children: [
    /* @__PURE__ */ e(
      f,
      {
        onPress: () => {
          a.disabled || (a.onSelect?.(), i());
        },
        disabled: a.disabled,
        style: ({ pressed: d }) => ({
          paddingVertical: n.spacing.scale[2],
          paddingHorizontal: n.spacing.scale[3],
          borderRadius: n.borderRadius.sm,
          backgroundColor: d ? t.surface.secondary : "transparent",
          opacity: a.disabled ? 0.4 : 1
        }),
        children: /* @__PURE__ */ e(
          u,
          {
            style: [
              h("body.md"),
              { color: a.destructive ? t.text.caution : t.text["high-emphasis"] }
            ],
            children: a.label
          }
        )
      }
    ),
    l < r.length - 1 && /* @__PURE__ */ e(F, {})
  ] }, a.key)) }) });
}
const ce = J(null);
function kt() {
  const s = K(ce);
  if (!s) throw new Error("useToast は ToastProvider の内側で使ってください");
  return s;
}
let ee = 0;
function ze() {
  return ee += 1, `toast-${ee}`;
}
function It({ children: s }) {
  const { theme: i, scales: o } = b(), [r, t] = I([]), n = U((l) => {
    t((d) => d.filter((m) => m.id !== l));
  }, []), a = U(
    (l) => {
      const d = ze();
      t((g) => [...g, { ...l, id: d }]);
      const m = l.duration ?? 3e3;
      return setTimeout(() => n(d), m), d;
    },
    [n]
  );
  return /* @__PURE__ */ p(ce.Provider, { value: { show: a, dismiss: n }, children: [
    s,
    /* @__PURE__ */ e(
      c,
      {
        pointerEvents: "box-none",
        style: {
          position: "absolute",
          top: o.spacing.scale[10],
          left: 0,
          right: 0,
          alignItems: "center",
          gap: o.spacing.scale[2],
          zIndex: 9999
        },
        children: r.map((l) => /* @__PURE__ */ e(Me, { toast: l, onDismiss: () => n(l.id) }, l.id))
      }
    )
  ] });
}
function Me({ toast: s, onDismiss: i }) {
  const { theme: o, scales: r } = b(), t = z(new S.Value(0)).current, n = z(new S.Value(-20)).current;
  Y(() => {
    S.parallel([
      S.timing(t, { toValue: 1, duration: 180, useNativeDriver: !0 }),
      S.timing(n, { toValue: 0, duration: 180, useNativeDriver: !0 })
    ]).start();
  }, [t, n]);
  const a = {
    info: { bg: o.surface.info, fg: o.text.info },
    success: { bg: o.surface.success, fg: o.text.success },
    warning: { bg: o.surface.warning, fg: o.text.warning },
    caution: { bg: o.surface.caution, fg: o.text.caution }
  }[s.tone ?? "info"];
  return /* @__PURE__ */ p(
    S.View,
    {
      style: {
        opacity: t,
        transform: [{ translateY: n }],
        backgroundColor: a.bg,
        borderRadius: r.borderRadius.lg,
        paddingHorizontal: r.spacing.scale[4],
        paddingVertical: r.spacing.scale[3],
        marginHorizontal: r.spacing.scale[4],
        shadowColor: o.overlay.dark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 6,
        flexDirection: "row",
        alignItems: "center",
        gap: r.spacing.scale[3],
        maxWidth: 480
      },
      children: [
        /* @__PURE__ */ p(c, { style: { flex: 1 }, children: [
          s.title && /* @__PURE__ */ e(u, { style: [h("label.md"), { color: a.fg }], children: s.title }),
          s.description && /* @__PURE__ */ e(u, { style: [h("body.sm"), { color: o.text["high-emphasis"] }], children: s.description })
        ] }),
        /* @__PURE__ */ e(f, { onPress: i, hitSlop: 8, children: /* @__PURE__ */ e(u, { style: [h("label.sm"), { color: a.fg }], children: "×" }) })
      ]
    }
  );
}
function St({
  open: s,
  onClose: i,
  side: o = "left",
  header: r,
  sections: t,
  footer: n
}) {
  const { theme: a, scales: l } = b();
  return /* @__PURE__ */ p(W, { open: s, onClose: i, side: o, children: [
    r && /* @__PURE__ */ e(c, { style: { marginBottom: l.spacing.scale[3] }, children: r }),
    /* @__PURE__ */ e(T, { style: { maxHeight: 480 }, children: t.map((d, m) => /* @__PURE__ */ p(c, { style: { marginBottom: l.spacing.scale[3] }, children: [
      d.title && /* @__PURE__ */ e(
        u,
        {
          style: [
            h("label.xs"),
            {
              color: a.text["low-emphasis"],
              paddingHorizontal: l.spacing.scale[2],
              marginBottom: l.spacing.scale[1]
            }
          ],
          children: d.title
        }
      ),
      d.items.map((g, y) => /* @__PURE__ */ p(O.Fragment, { children: [
        /* @__PURE__ */ p(
          f,
          {
            onPress: () => {
              g.onPress?.(), i();
            },
            style: ({ pressed: x }) => ({
              flexDirection: "row",
              alignItems: "center",
              gap: l.spacing.scale[3],
              paddingHorizontal: l.spacing.scale[3],
              paddingVertical: l.spacing.scale[3],
              borderRadius: l.borderRadius.md,
              backgroundColor: g.active ? a.surface["accent-primary-light"] : x ? a.surface.secondary : "transparent"
            }),
            children: [
              g.icon,
              /* @__PURE__ */ e(
                u,
                {
                  style: [
                    h("body.md"),
                    {
                      color: g.active ? a.text["accent-primary"] : a.text["high-emphasis"]
                    }
                  ],
                  children: g.label
                }
              )
            ]
          }
        ),
        y < d.items.length - 1 && /* @__PURE__ */ e(F, {})
      ] }, g.key))
    ] }, m)) }),
    n && /* @__PURE__ */ e(c, { style: { marginTop: l.spacing.scale[3] }, children: n })
  ] });
}
function Dt(s) {
  return /* @__PURE__ */ e(We, { ...s });
}
function Tt({
  open: s,
  onClose: i,
  title: o,
  description: r,
  footer: t,
  children: n
}) {
  const { theme: a, scales: l } = b();
  return /* @__PURE__ */ p(W, { open: s, onClose: i, side: "bottom", title: o, children: [
    r && /* @__PURE__ */ e(u, { style: [h("body.sm"), { color: a.text["medium-emphasis"] }], children: r }),
    /* @__PURE__ */ e(T, { style: { maxHeight: 420 }, children: /* @__PURE__ */ e(c, { style: { gap: l.spacing.scale[3], paddingVertical: l.spacing.scale[2] }, children: n }) }),
    t && /* @__PURE__ */ e(
      c,
      {
        style: {
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: l.spacing.scale[2],
          marginTop: l.spacing.scale[3]
        },
        children: t
      }
    )
  ] });
}
function Pt({
  open: s,
  onClose: i,
  title: o = "レビューを投稿",
  onSubmit: r
}) {
  const { theme: t, scales: n } = b(), [a, l] = I(0), [d, m] = I("");
  return /* @__PURE__ */ p(W, { open: s, onClose: i, side: "bottom", title: o, children: [
    /* @__PURE__ */ e(c, { style: { alignItems: "center", marginVertical: n.spacing.scale[3] }, children: /* @__PURE__ */ e(X, { value: a, onChange: l, size: 32 }) }),
    /* @__PURE__ */ e(
      De,
      {
        value: d,
        onChangeText: m,
        placeholder: "コメントを入力",
        minHeight: 120
      }
    ),
    /* @__PURE__ */ p(c, { style: { flexDirection: "row", gap: n.spacing.scale[2], marginTop: n.spacing.scale[3] }, children: [
      /* @__PURE__ */ e(c, { style: { flex: 1 }, children: /* @__PURE__ */ e(P, { variant: "tertiary", onPress: i, children: "キャンセル" }) }),
      /* @__PURE__ */ e(c, { style: { flex: 1 }, children: /* @__PURE__ */ e(
        P,
        {
          variant: "primary",
          disabled: a === 0,
          onPress: () => {
            r?.(a, d), i();
          },
          children: "送信"
        }
      ) })
    ] })
  ] });
}
function Wt({
  title: s,
  description: i,
  step: o,
  total: r,
  onNext: t,
  onSkip: n,
  nextLabel: a = "次へ",
  skipLabel: l = "スキップ"
}) {
  const { theme: d, scales: m } = b();
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        backgroundColor: d.surface.inverse,
        borderRadius: m.borderRadius.lg,
        padding: m.spacing.scale[4],
        gap: m.spacing.scale[2],
        maxWidth: 320,
        shadowColor: d.overlay.dark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 6
      },
      children: [
        s && /* @__PURE__ */ e(u, { style: [h("label.lg"), { color: d.text["on-inverse"] }], children: s }),
        /* @__PURE__ */ e(u, { style: [h("body.sm"), { color: d.text["on-inverse-secondary"] }], children: i }),
        /* @__PURE__ */ p(
          c,
          {
            style: {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: m.spacing.scale[2]
            },
            children: [
              o !== void 0 && r !== void 0 ? /* @__PURE__ */ p(u, { style: [h("label.xs"), { color: d.text["on-inverse-secondary"] }], children: [
                o,
                "/",
                r
              ] }) : /* @__PURE__ */ e(c, {}),
              /* @__PURE__ */ p(c, { style: { flexDirection: "row", gap: m.spacing.scale[2] }, children: [
                n && /* @__PURE__ */ e(c, { style: { minWidth: 80 }, children: /* @__PURE__ */ e(P, { variant: "tertiary", onPress: n, children: l }) }),
                t && /* @__PURE__ */ e(c, { style: { minWidth: 80 }, children: /* @__PURE__ */ e(P, { variant: "primary", onPress: t, children: a }) })
              ] })
            ]
          }
        )
      ]
    }
  );
}
function Ht({ open: s, onClose: i, highlight: o, children: r }) {
  const { theme: t } = b(), n = t.overlay.dark;
  return /* @__PURE__ */ e(E, { visible: s, transparent: !0, animationType: "fade", onRequestClose: i, children: /* @__PURE__ */ p(f, { onPress: i, style: { flex: 1 }, children: [
    o ? /* @__PURE__ */ p(M, { children: [
      /* @__PURE__ */ e(
        c,
        {
          style: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: o.y,
            backgroundColor: n
          }
        }
      ),
      /* @__PURE__ */ e(
        c,
        {
          style: {
            position: "absolute",
            top: o.y,
            left: 0,
            width: o.x,
            height: o.height,
            backgroundColor: n
          }
        }
      ),
      /* @__PURE__ */ e(
        c,
        {
          style: {
            position: "absolute",
            top: o.y,
            left: o.x + o.width,
            right: 0,
            height: o.height,
            backgroundColor: n
          }
        }
      ),
      /* @__PURE__ */ e(
        c,
        {
          style: {
            position: "absolute",
            top: o.y + o.height,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: n
          }
        }
      ),
      /* @__PURE__ */ e(
        c,
        {
          style: {
            position: "absolute",
            top: o.y,
            left: o.x,
            width: o.width,
            height: o.height,
            borderRadius: o.radius ?? 12,
            borderWidth: 2,
            borderColor: t.brand.primary
          }
        }
      )
    ] }) : /* @__PURE__ */ e(c, { style: { flex: 1, backgroundColor: n } }),
    /* @__PURE__ */ e(c, { style: { position: "absolute", left: 0, right: 0, bottom: 80, alignItems: "center" }, children: /* @__PURE__ */ e(f, { onPress: () => {
    }, children: r }) })
  ] }) });
}
function zt({
  options: s,
  value: i,
  onChange: o,
  placeholder: r = "選択",
  disabled: t = !1,
  title: n = "選択"
}) {
  const { theme: a, scales: l } = b(), [d, m] = I(!1), g = s.find((y) => y.value === i);
  return /* @__PURE__ */ p(M, { children: [
    /* @__PURE__ */ p(
      f,
      {
        onPress: () => !t && m(!0),
        disabled: t,
        style: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: l.touchTargets.textInput.min,
          paddingHorizontal: l.spacing.scale[3],
          borderRadius: l.borderRadius.md,
          borderWidth: 1,
          borderColor: a.border["medium-emphasis"],
          backgroundColor: t ? a.surface.disable : a.surface.primary,
          opacity: t ? 0.6 : 1
        },
        children: [
          /* @__PURE__ */ e(
            u,
            {
              style: [
                h("body.md"),
                { color: g ? a.text["high-emphasis"] : a.text["low-emphasis"] }
              ],
              children: g ? g.label : r
            }
          ),
          /* @__PURE__ */ e(u, { style: [h("label.sm"), { color: a.text["low-emphasis"] }], children: "▾" })
        ]
      }
    ),
    /* @__PURE__ */ e(W, { open: d, onClose: () => m(!1), side: "bottom", title: n, children: /* @__PURE__ */ e(c, { children: s.map((y, x) => /* @__PURE__ */ p(O.Fragment, { children: [
      /* @__PURE__ */ p(
        f,
        {
          onPress: () => {
            y.disabled || (o?.(y.value), m(!1));
          },
          disabled: y.disabled,
          style: ({ pressed: R }) => ({
            paddingVertical: l.spacing.scale[3],
            paddingHorizontal: l.spacing.scale[2],
            backgroundColor: R ? a.surface.secondary : "transparent",
            opacity: y.disabled ? 0.4 : 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }),
          children: [
            /* @__PURE__ */ e(u, { style: [h("body.md"), { color: a.text["high-emphasis"] }], children: y.label }),
            i === y.value && /* @__PURE__ */ e(u, { style: [h("label.md"), { color: a.text["accent-primary"] }], children: "✓" })
          ]
        }
      ),
      x < s.length - 1 && /* @__PURE__ */ e(F, {})
    ] }, y.value)) }) })
  ] });
}
function Mt({
  options: s,
  value: i,
  onChange: o,
  placeholder: r = "選択",
  searchPlaceholder: t = "検索",
  emptyMessage: n = "該当なし",
  disabled: a = !1
}) {
  const { theme: l, scales: d } = b(), [m, g] = I(!1), [y, x] = I(""), R = s.find((w) => w.value === i), C = N(() => {
    if (!y) return s;
    const w = y.toLowerCase();
    return s.filter((v) => v.label.toLowerCase().includes(w));
  }, [s, y]);
  return /* @__PURE__ */ p(M, { children: [
    /* @__PURE__ */ p(
      f,
      {
        onPress: () => !a && g(!0),
        disabled: a,
        style: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: d.touchTargets.textInput.min,
          paddingHorizontal: d.spacing.scale[3],
          borderRadius: d.borderRadius.md,
          borderWidth: 1,
          borderColor: l.border["medium-emphasis"],
          backgroundColor: a ? l.surface.disable : l.surface.primary,
          opacity: a ? 0.6 : 1
        },
        children: [
          /* @__PURE__ */ e(
            u,
            {
              style: [
                h("body.md"),
                { color: R ? l.text["high-emphasis"] : l.text["low-emphasis"] }
              ],
              children: R ? R.label : r
            }
          ),
          /* @__PURE__ */ e(u, { style: [h("label.sm"), { color: l.text["low-emphasis"] }], children: "▾" })
        ]
      }
    ),
    /* @__PURE__ */ p(W, { open: m, onClose: () => g(!1), side: "bottom", title: "選択", children: [
      /* @__PURE__ */ e(ie, { value: y, onChangeText: x, placeholder: t }),
      /* @__PURE__ */ e(c, { style: { height: 360, marginTop: d.spacing.scale[2] }, children: C.length === 0 ? /* @__PURE__ */ e(
        u,
        {
          style: [
            h("body.md"),
            {
              color: l.text["low-emphasis"],
              textAlign: "center",
              paddingVertical: d.spacing.scale[6]
            }
          ],
          children: n
        }
      ) : /* @__PURE__ */ e(
        j,
        {
          data: C,
          keyExtractor: (w) => w.value,
          renderItem: ({ item: w }) => /* @__PURE__ */ p(
            f,
            {
              onPress: () => {
                o?.(w.value), x(""), g(!1);
              },
              style: ({ pressed: v }) => ({
                paddingVertical: d.spacing.scale[3],
                paddingHorizontal: d.spacing.scale[2],
                backgroundColor: v ? l.surface.secondary : "transparent",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
              }),
              children: [
                /* @__PURE__ */ e(u, { style: [h("body.md"), { color: l.text["high-emphasis"] }], children: w.label }),
                i === w.value && /* @__PURE__ */ e(u, { style: [h("label.md"), { color: l.text["accent-primary"] }], children: "✓" })
              ]
            }
          )
        }
      ) })
    ] })
  ] });
}
function jt({
  options: s,
  values: i = [],
  onChange: o,
  placeholder: r = "選択",
  searchPlaceholder: t = "検索",
  disabled: n = !1
}) {
  const { theme: a, scales: l } = b(), [d, m] = I(!1), [g, y] = I(""), [x, R] = I(i), C = N(() => {
    if (!g) return s;
    const v = g.toLowerCase();
    return s.filter((k) => k.label.toLowerCase().includes(v));
  }, [s, g]), w = i.length === 0 ? r : i.length === 1 ? s.find((v) => v.value === i[0])?.label ?? r : `${i.length}件選択中`;
  return /* @__PURE__ */ p(M, { children: [
    /* @__PURE__ */ p(
      f,
      {
        onPress: () => {
          n || (R(i), m(!0));
        },
        disabled: n,
        style: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: l.touchTargets.textInput.min,
          paddingHorizontal: l.spacing.scale[3],
          borderRadius: l.borderRadius.md,
          borderWidth: 1,
          borderColor: a.border["medium-emphasis"],
          backgroundColor: n ? a.surface.disable : a.surface.primary,
          opacity: n ? 0.6 : 1
        },
        children: [
          /* @__PURE__ */ e(
            u,
            {
              style: [
                h("body.md"),
                { color: i.length > 0 ? a.text["high-emphasis"] : a.text["low-emphasis"] }
              ],
              children: w
            }
          ),
          /* @__PURE__ */ e(u, { style: [h("label.sm"), { color: a.text["low-emphasis"] }], children: "▾" })
        ]
      }
    ),
    /* @__PURE__ */ p(W, { open: d, onClose: () => m(!1), side: "bottom", title: "複数選択", children: [
      /* @__PURE__ */ e(ie, { value: g, onChangeText: y, placeholder: t }),
      /* @__PURE__ */ e(c, { style: { height: 320, marginTop: l.spacing.scale[2] }, children: /* @__PURE__ */ e(
        j,
        {
          data: C,
          keyExtractor: (v) => v.value,
          renderItem: ({ item: v }) => {
            const k = x.includes(v.value);
            return /* @__PURE__ */ p(
              f,
              {
                onPress: () => {
                  R(
                    (D) => D.includes(v.value) ? D.filter((q) => q !== v.value) : [...D, v.value]
                  );
                },
                style: {
                  flexDirection: "row",
                  alignItems: "center",
                  gap: l.spacing.scale[2],
                  paddingVertical: l.spacing.scale[3]
                },
                children: [
                  /* @__PURE__ */ e(Q, { checked: k }),
                  /* @__PURE__ */ e(u, { style: [h("body.md"), { color: a.text["high-emphasis"], flex: 1 }], children: v.label })
                ]
              }
            );
          }
        }
      ) }),
      /* @__PURE__ */ p(
        c,
        {
          style: {
            flexDirection: "row",
            gap: l.spacing.scale[2],
            marginTop: l.spacing.scale[3]
          },
          children: [
            /* @__PURE__ */ e(c, { style: { flex: 1 }, children: /* @__PURE__ */ e(P, { variant: "tertiary", onPress: () => m(!1), children: "キャンセル" }) }),
            /* @__PURE__ */ e(c, { style: { flex: 1 }, children: /* @__PURE__ */ e(
              P,
              {
                variant: "primary",
                onPress: () => {
                  o?.(x), m(!1);
                },
                children: "適用"
              }
            ) })
          ]
        }
      )
    ] })
  ] });
}
function Bt({ label: s, options: i, value: o, onChange: r }) {
  const { theme: t, scales: n } = b(), [a, l] = I(!1), d = i.find((g) => g.value === o), m = !!d;
  return /* @__PURE__ */ p(M, { children: [
    /* @__PURE__ */ p(
      f,
      {
        onPress: () => l(!0),
        style: ({ pressed: g }) => ({
          flexDirection: "row",
          alignItems: "center",
          gap: n.spacing.scale[1],
          paddingVertical: n.spacing.scale[2],
          paddingHorizontal: n.spacing.scale[3],
          borderRadius: n.borderRadius.full,
          borderWidth: 1,
          borderColor: m ? t.border["accent-primary"] : t.border["medium-emphasis"],
          backgroundColor: m ? t.surface["accent-primary-light"] : g ? t.surface.secondary : t.surface.primary
        }),
        children: [
          /* @__PURE__ */ p(
            u,
            {
              style: [
                h("label.sm"),
                { color: m ? t.text["accent-primary"] : t.text["high-emphasis"] }
              ],
              children: [
                s,
                d ? `: ${d.label}` : ""
              ]
            }
          ),
          /* @__PURE__ */ e(
            u,
            {
              style: [
                h("label.xs"),
                { color: m ? t.text["accent-primary"] : t.text["low-emphasis"] }
              ],
              children: "▾"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ e(W, { open: a, onClose: () => l(!1), side: "bottom", title: s, children: /* @__PURE__ */ p(c, { children: [
      /* @__PURE__ */ e(
        f,
        {
          onPress: () => {
            r?.(void 0), l(!1);
          },
          style: ({ pressed: g }) => ({
            paddingVertical: n.spacing.scale[3],
            backgroundColor: g ? t.surface.secondary : "transparent"
          }),
          children: /* @__PURE__ */ e(u, { style: [h("body.md"), { color: t.text["medium-emphasis"] }], children: "すべて" })
        }
      ),
      /* @__PURE__ */ e(F, {}),
      i.map((g, y) => /* @__PURE__ */ p(O.Fragment, { children: [
        /* @__PURE__ */ p(
          f,
          {
            onPress: () => {
              r?.(g.value), l(!1);
            },
            style: ({ pressed: x }) => ({
              paddingVertical: n.spacing.scale[3],
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: x ? t.surface.secondary : "transparent"
            }),
            children: [
              /* @__PURE__ */ e(u, { style: [h("body.md"), { color: t.text["high-emphasis"] }], children: g.label }),
              /* @__PURE__ */ p(c, { style: { flexDirection: "row", alignItems: "center", gap: 8 }, children: [
                g.count !== void 0 && /* @__PURE__ */ e(u, { style: [h("label.sm"), { color: t.text["low-emphasis"] }], children: g.count }),
                o === g.value && /* @__PURE__ */ e(u, { style: [h("label.md"), { color: t.text["accent-primary"] }], children: "✓" })
              ] })
            ]
          }
        ),
        y < i.length - 1 && /* @__PURE__ */ e(F, {})
      ] }, g.value))
    ] }) })
  ] });
}
function Vt({ options: s, value: i, onChange: o, disabled: r = !1 }) {
  const { theme: t, scales: n } = b();
  return /* @__PURE__ */ e(
    c,
    {
      style: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: n.spacing.scale[2]
      },
      children: s.map((a) => {
        const l = i === a.value;
        return /* @__PURE__ */ p(
          f,
          {
            onPress: () => !r && o?.(a.value),
            disabled: r,
            style: ({ pressed: d }) => ({
              flexDirection: "row",
              alignItems: "center",
              gap: n.spacing.scale[1],
              paddingHorizontal: n.spacing.scale[3],
              height: 36,
              borderRadius: n.borderRadius.full,
              backgroundColor: l ? t.brand.primary : d ? t.active["secondary-button"] : t.surface.secondary,
              opacity: r ? 0.5 : 1
            }),
            children: [
              /* @__PURE__ */ e(
                u,
                {
                  style: [
                    h("label.sm"),
                    {
                      color: l ? t.text["on-inverse"] : t.text["high-emphasis"],
                      fontWeight: l ? "700" : "500"
                    }
                  ],
                  children: a.label
                }
              ),
              a.count !== void 0 && /* @__PURE__ */ e(
                c,
                {
                  style: {
                    paddingHorizontal: 6,
                    borderRadius: 999,
                    backgroundColor: l ? t.surface.primary : t.surface.tertiary,
                    minWidth: 20,
                    alignItems: "center"
                  },
                  children: /* @__PURE__ */ e(
                    u,
                    {
                      style: [
                        h("label.xs"),
                        { color: l ? t.text["accent-primary"] : t.text["medium-emphasis"] }
                      ],
                      children: a.count
                    }
                  )
                }
              )
            ]
          },
          a.value
        );
      })
    }
  );
}
const de = J(null);
function he() {
  const s = K(de);
  if (!s) throw new Error("Tabs の内側で使ってください");
  return s;
}
function Ft({ value: s, onChange: i, children: o }) {
  return /* @__PURE__ */ e(de.Provider, { value: { value: s, onChange: i }, children: o });
}
function Ot({ scrollable: s = !1, children: i }) {
  const { theme: o, scales: r } = b(), t = /* @__PURE__ */ e(
    c,
    {
      style: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: o.border["low-emphasis"],
        gap: r.spacing.scale[1]
      },
      children: i
    }
  );
  return s ? /* @__PURE__ */ e(T, { horizontal: !0, showsHorizontalScrollIndicator: !1, children: t }) : t;
}
function Lt({ value: s, children: i, disabled: o }) {
  const { theme: r, scales: t } = b(), n = he(), a = n.value === s;
  return /* @__PURE__ */ e(
    f,
    {
      onPress: () => !o && n.onChange(s),
      disabled: o,
      style: {
        paddingVertical: t.spacing.scale[2],
        paddingHorizontal: t.spacing.scale[3],
        borderBottomWidth: 2,
        borderBottomColor: a ? r.brand.primary : "transparent",
        opacity: o ? 0.4 : 1
      },
      children: /* @__PURE__ */ e(
        u,
        {
          style: [
            h("label.md"),
            {
              color: a ? r.text["accent-primary"] : r.text["medium-emphasis"],
              fontWeight: a ? "700" : "500"
            }
          ],
          children: i
        }
      )
    }
  );
}
function At({ value: s, children: i }) {
  return he().value !== s ? null : /* @__PURE__ */ e(c, { children: i });
}
const je = ["日", "月", "火", "水", "木", "金", "土"], Be = ["S", "M", "T", "W", "T", "F", "S"], Ve = [
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
function Fe(s) {
  return new Date(s.getFullYear(), s.getMonth(), 1);
}
function Oe(s) {
  return new Date(s.getFullYear(), s.getMonth() + 1, 0).getDate();
}
function te(s, i) {
  return s.getFullYear() === i.getFullYear() && s.getMonth() === i.getMonth() && s.getDate() === i.getDate();
}
function Le({ value: s, onChange: i, minDate: o, maxDate: r, locale: t = "ja" }) {
  const { theme: n, scales: a } = b(), [l, d] = I(s ?? /* @__PURE__ */ new Date()), m = t === "ja" ? je : Be, g = N(() => {
    const w = Fe(l).getDay(), v = Oe(l), k = [];
    for (let D = 0; D < w; D++) k.push(null);
    for (let D = 1; D <= v; D++) k.push(new Date(l.getFullYear(), l.getMonth(), D));
    for (; k.length % 7 !== 0; ) k.push(null);
    return k;
  }, [l]), y = t === "ja" ? `${l.getFullYear()}年 ${Ve[l.getMonth()]}` : `${l.getFullYear()}-${String(l.getMonth() + 1).padStart(2, "0")}`, x = () => d((C) => new Date(C.getFullYear(), C.getMonth() - 1, 1)), R = () => d((C) => new Date(C.getFullYear(), C.getMonth() + 1, 1));
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        backgroundColor: n.surface.primary,
        borderRadius: a.borderRadius.lg,
        borderWidth: 1,
        borderColor: n.border["low-emphasis"],
        padding: a.spacing.scale[3],
        gap: a.spacing.scale[2]
      },
      children: [
        /* @__PURE__ */ p(c, { style: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, children: [
          /* @__PURE__ */ e(f, { onPress: x, hitSlop: 8, children: /* @__PURE__ */ e(u, { style: [h("label.lg"), { color: n.text["medium-emphasis"] }], children: "‹" }) }),
          /* @__PURE__ */ e(u, { style: [h("label.md"), { color: n.text["high-emphasis"] }], children: y }),
          /* @__PURE__ */ e(f, { onPress: R, hitSlop: 8, children: /* @__PURE__ */ e(u, { style: [h("label.lg"), { color: n.text["medium-emphasis"] }], children: "›" }) })
        ] }),
        /* @__PURE__ */ e(c, { style: { flexDirection: "row" }, children: m.map((C, w) => /* @__PURE__ */ e(c, { style: { flex: 1, alignItems: "center" }, children: /* @__PURE__ */ e(u, { style: [h("label.xs"), { color: n.text["low-emphasis"] }], children: C }) }, w)) }),
        /* @__PURE__ */ e(c, { style: { flexDirection: "row", flexWrap: "wrap" }, children: g.map((C, w) => {
          if (!C) return /* @__PURE__ */ e(c, { style: { width: `${100 / 7}%`, aspectRatio: 1 } }, w);
          const v = o && C < new Date(o.getFullYear(), o.getMonth(), o.getDate()) || r && C > new Date(r.getFullYear(), r.getMonth(), r.getDate()), k = s && te(C, s), D = te(C, /* @__PURE__ */ new Date());
          return /* @__PURE__ */ e(c, { style: { width: `${100 / 7}%`, aspectRatio: 1, padding: 2 }, children: /* @__PURE__ */ e(
            f,
            {
              onPress: () => !v && i?.(C),
              disabled: !!v,
              style: {
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: a.borderRadius.full,
                backgroundColor: k ? n.brand.primary : "transparent",
                borderWidth: D && !k ? 1 : 0,
                borderColor: n.border["accent-primary"],
                opacity: v ? 0.3 : 1
              },
              children: /* @__PURE__ */ e(
                u,
                {
                  style: [
                    h("body.sm"),
                    {
                      color: k ? n.text["on-inverse"] : n.text["high-emphasis"],
                      fontWeight: k || D ? "700" : "400"
                    }
                  ],
                  children: C.getDate()
                }
              )
            }
          ) }, w);
        }) })
      ]
    }
  );
}
function Ae(s) {
  return `${s.getFullYear()}/${String(s.getMonth() + 1).padStart(2, "0")}/${String(s.getDate()).padStart(2, "0")}`;
}
function Et({
  value: s,
  onChange: i,
  placeholder: o = "日付を選択",
  minDate: r,
  maxDate: t,
  disabled: n = !1,
  formatter: a = Ae
}) {
  const { theme: l, scales: d } = b(), [m, g] = I(!1), [y, x] = I(s);
  return /* @__PURE__ */ p(M, { children: [
    /* @__PURE__ */ p(
      f,
      {
        onPress: () => {
          n || (x(s), g(!0));
        },
        disabled: n,
        style: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: d.touchTargets.textInput.min,
          paddingHorizontal: d.spacing.scale[3],
          borderRadius: d.borderRadius.md,
          borderWidth: 1,
          borderColor: l.border["medium-emphasis"],
          backgroundColor: n ? l.surface.disable : l.surface.primary,
          opacity: n ? 0.6 : 1
        },
        children: [
          /* @__PURE__ */ e(
            u,
            {
              style: [
                h("body.md"),
                { color: s ? l.text["high-emphasis"] : l.text["low-emphasis"] }
              ],
              children: s ? a(s) : o
            }
          ),
          /* @__PURE__ */ e(u, { style: [h("label.sm"), { color: l.text["low-emphasis"] }], children: "📅" })
        ]
      }
    ),
    /* @__PURE__ */ p(W, { open: m, onClose: () => g(!1), side: "bottom", title: "日付を選択", children: [
      /* @__PURE__ */ e(Le, { value: y, onChange: x, minDate: r, maxDate: t }),
      /* @__PURE__ */ p(
        c,
        {
          style: {
            flexDirection: "row",
            gap: d.spacing.scale[2],
            marginTop: d.spacing.scale[3]
          },
          children: [
            /* @__PURE__ */ e(c, { style: { flex: 1 }, children: /* @__PURE__ */ e(P, { variant: "tertiary", onPress: () => g(!1), children: "キャンセル" }) }),
            /* @__PURE__ */ e(c, { style: { flex: 1 }, children: /* @__PURE__ */ e(
              P,
              {
                variant: "primary",
                disabled: !y,
                onPress: () => {
                  y && i?.(y), g(!1);
                },
                children: "決定"
              }
            ) })
          ]
        }
      )
    ] })
  ] });
}
function _(s) {
  return s.toString().padStart(2, "0");
}
function $t({
  value: s,
  onChange: i,
  placeholder: o = "時刻を選択",
  minuteStep: r = 5,
  disabled: t = !1
}) {
  const { theme: n, scales: a } = b(), [l, d] = I(!1), [m, g] = I(s?.hour ?? 9), [y, x] = I(s?.minute ?? 0), R = Array.from({ length: 24 }, (w, v) => v), C = Array.from({ length: 60 / r }, (w, v) => v * r);
  return /* @__PURE__ */ p(M, { children: [
    /* @__PURE__ */ p(
      f,
      {
        onPress: () => {
          t || (g(s?.hour ?? 9), x(s?.minute ?? 0), d(!0));
        },
        disabled: t,
        style: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: a.touchTargets.textInput.min,
          paddingHorizontal: a.spacing.scale[3],
          borderRadius: a.borderRadius.md,
          borderWidth: 1,
          borderColor: n.border["medium-emphasis"],
          backgroundColor: t ? n.surface.disable : n.surface.primary,
          opacity: t ? 0.6 : 1
        },
        children: [
          /* @__PURE__ */ e(
            u,
            {
              style: [
                h("body.md"),
                { color: s ? n.text["high-emphasis"] : n.text["low-emphasis"] }
              ],
              children: s ? `${_(s.hour)}:${_(s.minute)}` : o
            }
          ),
          /* @__PURE__ */ e(u, { style: [h("label.sm"), { color: n.text["low-emphasis"] }], children: "🕐" })
        ]
      }
    ),
    /* @__PURE__ */ p(W, { open: l, onClose: () => d(!1), side: "bottom", title: "時刻を選択", children: [
      /* @__PURE__ */ p(c, { style: { flexDirection: "row", height: 220, gap: a.spacing.scale[3] }, children: [
        /* @__PURE__ */ e(T, { style: { flex: 1 }, showsVerticalScrollIndicator: !1, children: R.map((w) => /* @__PURE__ */ e(
          f,
          {
            onPress: () => g(w),
            style: {
              paddingVertical: a.spacing.scale[2],
              alignItems: "center",
              backgroundColor: m === w ? n.surface["accent-primary-light"] : "transparent",
              borderRadius: a.borderRadius.sm
            },
            children: /* @__PURE__ */ e(
              u,
              {
                style: [
                  h("body.lg"),
                  {
                    color: m === w ? n.text["accent-primary"] : n.text["high-emphasis"],
                    fontWeight: m === w ? "700" : "400"
                  }
                ],
                children: _(w)
              }
            )
          },
          w
        )) }),
        /* @__PURE__ */ e(T, { style: { flex: 1 }, showsVerticalScrollIndicator: !1, children: C.map((w) => /* @__PURE__ */ e(
          f,
          {
            onPress: () => x(w),
            style: {
              paddingVertical: a.spacing.scale[2],
              alignItems: "center",
              backgroundColor: y === w ? n.surface["accent-primary-light"] : "transparent",
              borderRadius: a.borderRadius.sm
            },
            children: /* @__PURE__ */ e(
              u,
              {
                style: [
                  h("body.lg"),
                  {
                    color: y === w ? n.text["accent-primary"] : n.text["high-emphasis"],
                    fontWeight: y === w ? "700" : "400"
                  }
                ],
                children: _(w)
              }
            )
          },
          w
        )) })
      ] }),
      /* @__PURE__ */ p(
        c,
        {
          style: {
            flexDirection: "row",
            gap: a.spacing.scale[2],
            marginTop: a.spacing.scale[3]
          },
          children: [
            /* @__PURE__ */ e(c, { style: { flex: 1 }, children: /* @__PURE__ */ e(P, { variant: "tertiary", onPress: () => d(!1), children: "キャンセル" }) }),
            /* @__PURE__ */ e(c, { style: { flex: 1 }, children: /* @__PURE__ */ e(
              P,
              {
                variant: "primary",
                onPress: () => {
                  i?.({ hour: m, minute: y }), d(!1);
                },
                children: "決定"
              }
            ) })
          ]
        }
      )
    ] })
  ] });
}
function _t({ items: s, type: i = "single", defaultOpenKeys: o = [] }) {
  const { theme: r, scales: t } = b(), [n, a] = I(new Set(o)), l = (d) => {
    a((m) => {
      const g = new Set(i === "multiple" ? m : []);
      return m.has(d) ? g.delete(d) : g.add(d), g;
    });
  };
  return /* @__PURE__ */ e(
    c,
    {
      style: {
        borderRadius: t.borderRadius.lg,
        borderWidth: 1,
        borderColor: r.border["low-emphasis"],
        backgroundColor: r.surface.primary,
        overflow: "hidden"
      },
      children: s.map((d, m) => {
        const g = n.has(d.key);
        return /* @__PURE__ */ p(
          c,
          {
            style: {
              borderTopWidth: m === 0 ? 0 : 1,
              borderTopColor: r.border["low-emphasis"]
            },
            children: [
              /* @__PURE__ */ p(
                f,
                {
                  onPress: () => l(d.key),
                  style: ({ pressed: y }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: t.spacing.scale[4],
                    backgroundColor: y ? r.surface.secondary : "transparent"
                  }),
                  children: [
                    /* @__PURE__ */ e(u, { style: [h("label.md"), { color: r.text["high-emphasis"], flex: 1 }], children: d.title }),
                    /* @__PURE__ */ e(u, { style: [h("label.sm"), { color: r.text["low-emphasis"] }], children: g ? "▾" : "▸" })
                  ]
                }
              ),
              g && /* @__PURE__ */ e(
                c,
                {
                  style: {
                    paddingHorizontal: t.spacing.scale[4],
                    paddingBottom: t.spacing.scale[4]
                  },
                  children: d.content
                }
              )
            ]
          },
          d.key
        );
      })
    }
  );
}
function Nt({ title: s, defaultOpen: i = !1, children: o }) {
  const { theme: r, scales: t } = b(), [n, a] = I(i);
  return /* @__PURE__ */ p(c, { children: [
    /* @__PURE__ */ p(
      f,
      {
        onPress: () => a((l) => !l),
        style: {
          flexDirection: "row",
          alignItems: "center",
          gap: t.spacing.scale[1]
        },
        children: [
          /* @__PURE__ */ e(u, { style: [h("label.sm"), { color: r.text["accent-primary"] }], children: n ? "▾" : "▸" }),
          /* @__PURE__ */ e(u, { style: [h("label.md"), { color: r.text["accent-primary"] }], children: s })
        ]
      }
    ),
    n && /* @__PURE__ */ e(c, { style: { marginTop: t.spacing.scale[2] }, children: o })
  ] });
}
function Yt({ maxHeight: s, bordered: i, children: o, ...r }) {
  const { theme: t, scales: n } = b();
  return /* @__PURE__ */ e(
    c,
    {
      style: {
        maxHeight: s,
        borderWidth: i ? 1 : 0,
        borderColor: t.border["low-emphasis"],
        borderRadius: i ? n.borderRadius.lg : 0,
        overflow: "hidden"
      },
      children: /* @__PURE__ */ e(T, { ...r, children: o })
    }
  );
}
function Ee(s, i) {
  const o = [];
  for (let r = s; r <= i; r++) o.push(r);
  return o;
}
function Xt({ page: s, total: i, onChange: o, windowSize: r = 5 }) {
  const { theme: t, scales: n } = b(), a = Math.floor(r / 2);
  let l = Math.max(1, s - a), d = Math.min(i, l + r - 1);
  d - l + 1 < r && (l = Math.max(1, d - r + 1));
  const m = Ee(l, d), g = (y, x, R = !1, C = !1) => /* @__PURE__ */ e(
    f,
    {
      onPress: () => x && !R && o?.(x),
      disabled: R || !x,
      style: ({ pressed: w }) => ({
        minWidth: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: n.borderRadius.md,
        backgroundColor: C ? t.brand.primary : w ? t.active["tertiary-button"] : t.surface.primary,
        borderWidth: C ? 0 : 1,
        borderColor: t.border["low-emphasis"],
        opacity: R ? 0.4 : 1,
        paddingHorizontal: n.spacing.scale[2]
      }),
      children: /* @__PURE__ */ e(
        u,
        {
          style: [
            h("label.sm"),
            { color: C ? t.text["on-inverse"] : t.text["high-emphasis"] }
          ],
          children: y
        }
      )
    },
    y
  );
  return /* @__PURE__ */ p(c, { style: { flexDirection: "row", gap: n.spacing.scale[1], alignSelf: "center" }, children: [
    g("‹", s > 1 ? s - 1 : null, s <= 1),
    l > 1 && g("1", 1),
    l > 2 && g("…", null, !0),
    m.map((y) => g(String(y), y, !1, y === s)),
    d < i - 1 && g("…", null, !0),
    d < i && g(String(i), i),
    g("›", s < i ? s + 1 : null, s >= i)
  ] });
}
function qt({ page: s, total: i, onChange: o }) {
  const { theme: r, scales: t } = b(), n = (a, l, d) => /* @__PURE__ */ e(
    f,
    {
      onPress: () => !d && o?.(l),
      disabled: d,
      style: ({ pressed: m }) => ({
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: t.borderRadius.full,
        backgroundColor: m ? r.active["tertiary-button"] : r.surface.secondary,
        opacity: d ? 0.4 : 1
      }),
      children: /* @__PURE__ */ e(u, { style: [h("label.md"), { color: r.text["high-emphasis"] }], children: a })
    }
  );
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        flexDirection: "row",
        alignItems: "center",
        gap: t.spacing.scale[3],
        alignSelf: "center"
      },
      children: [
        n("‹", s - 1, s <= 1),
        /* @__PURE__ */ p(u, { style: [h("label.md"), { color: r.text["medium-emphasis"] }], children: [
          s,
          " / ",
          i
        ] }),
        n("›", s + 1, s >= i)
      ]
    }
  );
}
function $e({ items: s, value: i, onChange: o }) {
  const { theme: r, scales: t } = b();
  return /* @__PURE__ */ e(
    c,
    {
      style: {
        flexDirection: "row",
        backgroundColor: r.surface.primary,
        borderTopWidth: 1,
        borderTopColor: r.border["low-emphasis"],
        paddingBottom: B.OS === "ios" ? 24 : 0
      },
      children: s.map((n) => {
        const a = i === n.key;
        return /* @__PURE__ */ p(
          f,
          {
            onPress: () => {
              n.onPress?.(), o?.(n.key);
            },
            style: ({ pressed: l }) => ({
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: t.spacing.scale[2],
              backgroundColor: l ? r.surface.secondary : "transparent",
              gap: 2,
              minHeight: t.touchTargets.navItem.min
            }),
            children: [
              /* @__PURE__ */ p(c, { style: { position: "relative" }, children: [
                n.icon,
                n.badge !== void 0 && n.badge > 0 && /* @__PURE__ */ e(
                  c,
                  {
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
                    children: /* @__PURE__ */ e(u, { style: [h("label.xs"), { color: r.text["on-inverse"] }], children: n.badge > 99 ? "99+" : n.badge })
                  }
                )
              ] }),
              /* @__PURE__ */ e(
                u,
                {
                  style: [
                    h("label.xs"),
                    { color: a ? r.text["accent-primary"] : r.text["medium-emphasis"] }
                  ],
                  children: n.label
                }
              )
            ]
          },
          n.key
        );
      })
    }
  );
}
function Gt({ items: s, value: i, onChange: o }) {
  const { theme: r, scales: t } = b();
  return /* @__PURE__ */ e(
    T,
    {
      horizontal: !0,
      showsHorizontalScrollIndicator: !1,
      contentContainerStyle: { paddingHorizontal: t.spacing.scale[3], gap: t.spacing.scale[2] },
      style: {
        backgroundColor: r.surface.primary,
        borderBottomWidth: 1,
        borderBottomColor: r.border["low-emphasis"]
      },
      children: s.map((n) => {
        const a = i === n.key;
        return /* @__PURE__ */ p(
          f,
          {
            onPress: () => o?.(n.key),
            style: {
              flexDirection: "row",
              alignItems: "center",
              gap: t.spacing.scale[1],
              paddingVertical: t.spacing.scale[3],
              borderBottomWidth: 2,
              borderBottomColor: a ? r.brand.primary : "transparent"
            },
            children: [
              /* @__PURE__ */ e(
                u,
                {
                  style: [
                    h("label.md"),
                    {
                      color: a ? r.text["accent-primary"] : r.text["medium-emphasis"],
                      fontWeight: a ? "700" : "500"
                    }
                  ],
                  children: n.label
                }
              ),
              n.count !== void 0 && /* @__PURE__ */ e(
                c,
                {
                  style: {
                    paddingHorizontal: 6,
                    borderRadius: 999,
                    backgroundColor: a ? r.surface["accent-primary-light"] : r.surface.tertiary,
                    minWidth: 20,
                    alignItems: "center"
                  },
                  children: /* @__PURE__ */ e(
                    u,
                    {
                      style: [
                        h("label.xs"),
                        { color: a ? r.text["accent-primary"] : r.text["medium-emphasis"] }
                      ],
                      children: n.count
                    }
                  )
                }
              )
            ]
          },
          n.key
        );
      })
    }
  );
}
function Kt({ title: s, onBack: i, backLabel: o = "戻る", rightSlot: r }) {
  const { theme: t, scales: n } = b();
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: n.spacing.scale[2],
        paddingHorizontal: n.spacing.scale[3],
        paddingVertical: n.spacing.scale[2],
        backgroundColor: t.surface.primary,
        borderBottomWidth: 1,
        borderBottomColor: t.border["low-emphasis"]
      },
      children: [
        /* @__PURE__ */ p(c, { style: { flexDirection: "row", alignItems: "center", gap: n.spacing.scale[2], flex: 1 }, children: [
          i && /* @__PURE__ */ p(
            f,
            {
              onPress: i,
              hitSlop: 8,
              style: ({ pressed: a }) => ({
                padding: n.spacing.scale[1],
                borderRadius: n.borderRadius.md,
                backgroundColor: a ? t.surface.secondary : "transparent",
                flexDirection: "row",
                alignItems: "center",
                gap: 4
              }),
              children: [
                /* @__PURE__ */ e(u, { style: [h("label.md"), { color: t.text["accent-primary"] }], children: "‹" }),
                /* @__PURE__ */ e(u, { style: [h("label.sm"), { color: t.text["accent-primary"] }], children: o })
              ]
            }
          ),
          /* @__PURE__ */ e(
            u,
            {
              numberOfLines: 1,
              style: [h("heading.md"), { color: t.text["high-emphasis"], flex: 1 }],
              children: s
            }
          )
        ] }),
        r
      ]
    }
  );
}
function Jt({ title: s, subtitle: i, leading: o, trailing: r, onBack: t, centered: n = !0 }) {
  const { theme: a, scales: l } = b(), d = o ?? (t ? /* @__PURE__ */ e(
    f,
    {
      onPress: t,
      hitSlop: 8,
      style: ({ pressed: m }) => ({
        padding: l.spacing.scale[1],
        borderRadius: l.borderRadius.md,
        backgroundColor: m ? a.surface.secondary : "transparent"
      }),
      children: /* @__PURE__ */ e(u, { style: [h("heading.lg"), { color: a.text["high-emphasis"] }], children: "‹" })
    }
  ) : null);
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        flexDirection: "row",
        alignItems: "center",
        gap: l.spacing.scale[2],
        paddingHorizontal: l.spacing.scale[3],
        paddingTop: B.OS === "ios" ? 48 : l.spacing.scale[3],
        paddingBottom: l.spacing.scale[3],
        backgroundColor: a.surface.primary,
        borderBottomWidth: 1,
        borderBottomColor: a.border["low-emphasis"]
      },
      children: [
        /* @__PURE__ */ e(c, { style: { width: 44, alignItems: "flex-start" }, children: d }),
        /* @__PURE__ */ p(c, { style: { flex: 1, alignItems: n ? "center" : "flex-start" }, children: [
          s && /* @__PURE__ */ e(
            u,
            {
              numberOfLines: 1,
              style: [h("heading.md"), { color: a.text["high-emphasis"] }],
              children: s
            }
          ),
          i && /* @__PURE__ */ e(
            u,
            {
              numberOfLines: 1,
              style: [h("body.sm"), { color: a.text["medium-emphasis"] }],
              children: i
            }
          )
        ] }),
        /* @__PURE__ */ e(c, { style: { minWidth: 44, alignItems: "flex-end" }, children: r })
      ]
    }
  );
}
function _e({ title: s, description: i, image: o, onPress: r, tone: t = "neutral", height: n = 140 }) {
  const { theme: a, scales: l } = b(), d = {
    neutral: { bg: a.surface.secondary, fg: a.text["high-emphasis"] },
    accent: { bg: a.surface["accent-primary-light"], fg: a.text["accent-primary"] },
    success: { bg: a.surface.success, fg: a.text.success },
    warning: { bg: a.surface.warning, fg: a.text.warning },
    caution: { bg: a.surface.caution, fg: a.text.caution }
  }[t], m = /* @__PURE__ */ p(
    c,
    {
      style: {
        height: n,
        borderRadius: l.borderRadius.lg,
        backgroundColor: d.bg,
        overflow: "hidden"
      },
      children: [
        o && /* @__PURE__ */ e(
          V,
          {
            source: o,
            resizeMode: "cover",
            style: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }
          }
        ),
        /* @__PURE__ */ p(
          c,
          {
            style: {
              flex: 1,
              padding: l.spacing.scale[4],
              justifyContent: "flex-end",
              backgroundColor: o ? a.surface["videoOverlay-light"] : "transparent"
            },
            children: [
              s && /* @__PURE__ */ e(
                u,
                {
                  style: [
                    h("heading.lg"),
                    { color: o ? a.text["on-inverse"] : d.fg }
                  ],
                  children: s
                }
              ),
              i && /* @__PURE__ */ e(
                u,
                {
                  style: [
                    h("body.sm"),
                    { color: o ? a.text["on-inverse-secondary"] : a.text["medium-emphasis"] }
                  ],
                  children: i
                }
              )
            ]
          }
        )
      ]
    }
  );
  return r ? /* @__PURE__ */ e(f, { onPress: r, children: m }) : m;
}
function Qt({
  banners: s,
  itemWidth: i,
  height: o = 160,
  showIndicator: r = !0
}) {
  const { theme: t, scales: n } = b(), [a, l] = I(0), d = i ?? $.get("window").width - 32, m = z(null), g = (y) => {
    const x = y.nativeEvent.contentOffset.x, R = Math.round(x / (d + n.spacing.scale[2]));
    R !== a && l(R);
  };
  return /* @__PURE__ */ p(c, { style: { gap: n.spacing.scale[2] }, children: [
    /* @__PURE__ */ e(
      j,
      {
        ref: m,
        data: s,
        horizontal: !0,
        showsHorizontalScrollIndicator: !1,
        snapToInterval: d + n.spacing.scale[2],
        decelerationRate: "fast",
        onScroll: g,
        scrollEventThrottle: 16,
        keyExtractor: (y, x) => String(x),
        contentContainerStyle: { paddingHorizontal: n.spacing.scale[4], gap: n.spacing.scale[2] },
        renderItem: ({ item: y }) => /* @__PURE__ */ e(c, { style: { width: d, height: o }, children: /* @__PURE__ */ e(_e, { ...y, height: o }) })
      }
    ),
    r && s.length > 1 && /* @__PURE__ */ e(
      c,
      {
        style: {
          flexDirection: "row",
          gap: 6,
          alignSelf: "center"
        },
        children: s.map((y, x) => /* @__PURE__ */ e(
          c,
          {
            style: {
              width: x === a ? 16 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: x === a ? t.brand.primary : t.surface.tertiary
            }
          },
          x
        ))
      }
    )
  ] });
}
function Ut({
  value: s,
  onChange: i,
  placeholder: o = "検索",
  onSubmit: r,
  onClear: t,
  autoFocus: n
}) {
  const { theme: a, scales: l } = b();
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        flexDirection: "row",
        alignItems: "center",
        gap: l.spacing.scale[2],
        paddingHorizontal: l.spacing.scale[3],
        height: 44,
        backgroundColor: a.surface.secondary,
        borderRadius: l.borderRadius.full
      },
      children: [
        /* @__PURE__ */ e(u, { style: [h("label.md"), { color: a.text["low-emphasis"] }], children: "🔍" }),
        /* @__PURE__ */ e(
          L,
          {
            value: s,
            onChangeText: i,
            onSubmitEditing: r,
            placeholder: o,
            placeholderTextColor: a.text["low-emphasis"],
            returnKeyType: "search",
            autoFocus: n,
            style: [
              h("body.md"),
              { flex: 1, color: a.text["high-emphasis"], paddingVertical: 0 }
            ]
          }
        ),
        s.length > 0 && /* @__PURE__ */ e(
          f,
          {
            onPress: () => {
              i(""), t?.();
            },
            hitSlop: 8,
            children: /* @__PURE__ */ e(
              c,
              {
                style: {
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: a.surface.tertiary,
                  alignItems: "center",
                  justifyContent: "center"
                },
                children: /* @__PURE__ */ e(u, { style: [h("label.xs"), { color: a.text["medium-emphasis"] }], children: "×" })
              }
            )
          }
        )
      ]
    }
  );
}
function Zt({
  leading: s,
  title: i,
  description: o,
  trailing: r,
  showChevron: t,
  onPress: n,
  disabled: a
}) {
  const { theme: l, scales: d } = b(), m = (g = !1) => /* @__PURE__ */ p(
    c,
    {
      style: {
        flexDirection: "row",
        alignItems: "center",
        gap: d.spacing.scale[3],
        paddingHorizontal: d.spacing.scale[4],
        paddingVertical: d.spacing.scale[3],
        backgroundColor: g ? l.surface.secondary : l.surface.primary,
        opacity: a ? 0.5 : 1
      },
      children: [
        s,
        /* @__PURE__ */ p(c, { style: { flex: 1, gap: 2 }, children: [
          typeof i == "string" ? /* @__PURE__ */ e(u, { style: [h("body.md"), { color: l.text["high-emphasis"] }], children: i }) : i,
          o && typeof o == "string" ? /* @__PURE__ */ e(u, { style: [h("body.sm"), { color: l.text["medium-emphasis"] }], children: o }) : o
        ] }),
        r,
        t && /* @__PURE__ */ e(u, { style: [h("label.md"), { color: l.text["low-emphasis"] }], children: "›" })
      ]
    }
  );
  return n ? /* @__PURE__ */ e(f, { disabled: a, onPress: n, children: ({ pressed: g }) => m(g) }) : m(!1);
}
function er({ title: s, description: i, icon: o, action: r }) {
  const { theme: t, scales: n } = b();
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        alignItems: "center",
        justifyContent: "center",
        padding: n.spacing.scale[8],
        gap: n.spacing.scale[3]
      },
      children: [
        o ?? /* @__PURE__ */ e(
          c,
          {
            style: {
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: t.surface.secondary,
              alignItems: "center",
              justifyContent: "center"
            },
            children: /* @__PURE__ */ e(u, { style: { fontSize: 28, color: t.text["low-emphasis"] }, children: "📭" })
          }
        ),
        /* @__PURE__ */ e(
          u,
          {
            style: [h("heading.md"), { color: t.text["high-emphasis"], textAlign: "center" }],
            children: s
          }
        ),
        i && /* @__PURE__ */ e(
          u,
          {
            style: [h("body.md"), { color: t.text["medium-emphasis"], textAlign: "center" }],
            children: i
          }
        ),
        r
      ]
    }
  );
}
function tr({
  title: s = "エラーが発生しました",
  description: i = "時間をおいて再度お試しください。",
  icon: o,
  action: r
}) {
  const { theme: t, scales: n } = b();
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        alignItems: "center",
        justifyContent: "center",
        padding: n.spacing.scale[8],
        gap: n.spacing.scale[3]
      },
      children: [
        o ?? /* @__PURE__ */ e(
          c,
          {
            style: {
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: t.surface.caution,
              alignItems: "center",
              justifyContent: "center"
            },
            children: /* @__PURE__ */ e(u, { style: { fontSize: 28, color: t.text.caution }, children: "!" })
          }
        ),
        /* @__PURE__ */ e(
          u,
          {
            style: [h("heading.md"), { color: t.text["high-emphasis"], textAlign: "center" }],
            children: s
          }
        ),
        /* @__PURE__ */ e(
          u,
          {
            style: [h("body.md"), { color: t.text["medium-emphasis"], textAlign: "center" }],
            children: i
          }
        ),
        r
      ]
    }
  );
}
function Ne({ title: s, description: i, action: o, variant: r = "default" }) {
  const { theme: t, scales: n } = b();
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: n.spacing.scale[4],
        paddingVertical: n.spacing.scale[2],
        gap: n.spacing.scale[2]
      },
      children: [
        /* @__PURE__ */ p(c, { style: { flex: 1 }, children: [
          /* @__PURE__ */ e(
            u,
            {
              style: [
                h(r === "subtle" ? "label.md" : "heading.md"),
                { color: t.text["high-emphasis"] }
              ],
              children: s
            }
          ),
          i && /* @__PURE__ */ e(
            u,
            {
              style: [h("body.sm"), { color: t.text["medium-emphasis"], marginTop: 2 }],
              children: i
            }
          )
        ] }),
        o && /* @__PURE__ */ e(f, { onPress: o.onPress, hitSlop: 8, children: /* @__PURE__ */ p(u, { style: [h("label.sm"), { color: t.text["accent-primary"] }], children: [
          o.label,
          " ›"
        ] }) })
      ]
    }
  );
}
function rr({ children: s }) {
  const { theme: i, scales: o } = b();
  return /* @__PURE__ */ e(
    c,
    {
      style: {
        flexDirection: "row",
        gap: o.spacing.scale[2],
        padding: o.spacing.scale[4],
        paddingBottom: B.OS === "ios" ? 32 : o.spacing.scale[4],
        backgroundColor: i.surface.primary,
        borderTopWidth: 1,
        borderTopColor: i.border["low-emphasis"]
      },
      children: s
    }
  );
}
function nr({ rightActions: s = [], actionWidth: i = 80, children: o }) {
  const { theme: r } = b(), t = z(new S.Value(0)).current, n = s.length * i, a = z(
    oe.create({
      onMoveShouldSetPanResponder: (l, d) => Math.abs(d.dx) > 8,
      onPanResponderMove: (l, d) => {
        const m = Math.min(0, Math.max(-n, d.dx));
        t.setValue(m);
      },
      onPanResponderRelease: (l, d) => {
        const m = d.dx < -n / 2;
        S.spring(t, {
          toValue: m ? -n : 0,
          useNativeDriver: !0
        }).start();
      }
    })
  ).current;
  return /* @__PURE__ */ p(c, { style: { position: "relative", overflow: "hidden" }, children: [
    /* @__PURE__ */ e(
      c,
      {
        style: {
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          flexDirection: "row"
        },
        children: s.map((l, d) => /* @__PURE__ */ e(
          f,
          {
            onPress: () => {
              S.spring(t, { toValue: 0, useNativeDriver: !0 }).start(), l.onPress();
            },
            style: {
              width: i,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: l.color ?? r.caution.base
            },
            children: /* @__PURE__ */ e(u, { style: [h("label.md"), { color: l.textColor ?? r.text["on-inverse"] }], children: l.label })
          },
          d
        ))
      }
    ),
    /* @__PURE__ */ e(
      S.View,
      {
        style: {
          transform: [{ translateX: t }],
          backgroundColor: r.surface.primary
        },
        ...a.panHandlers,
        children: o
      }
    )
  ] });
}
function or({ copyright: s, links: i = [] }) {
  const { theme: o, scales: r } = b();
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        backgroundColor: o.surface.secondary,
        padding: r.spacing.scale[4],
        gap: r.spacing.scale[2]
      },
      children: [
        /* @__PURE__ */ e(
          c,
          {
            style: {
              flexDirection: "row",
              flexWrap: "wrap",
              gap: r.spacing.scale[3]
            },
            children: i.map((t, n) => /* @__PURE__ */ e(f, { onPress: t.onPress, children: /* @__PURE__ */ e(u, { style: [h("label.sm"), { color: o.text["medium-emphasis"] }], children: t.label }) }, n))
          }
        ),
        s && /* @__PURE__ */ e(u, { style: [h("body.sm"), { color: o.text["low-emphasis"] }], children: s })
      ]
    }
  );
}
function sr({
  title: s = "ファイルを選択",
  description: i = "タップしてアップロード",
  onPress: o,
  disabled: r = !1
}) {
  const { theme: t, scales: n } = b();
  return /* @__PURE__ */ p(
    f,
    {
      onPress: o,
      disabled: r,
      style: ({ pressed: a }) => ({
        borderWidth: 2,
        borderStyle: "dashed",
        borderColor: a ? t.brand.primary : t.border["medium-emphasis"],
        borderRadius: n.borderRadius.lg,
        padding: n.spacing.scale[6],
        alignItems: "center",
        justifyContent: "center",
        gap: n.spacing.scale[1],
        backgroundColor: a ? t.surface.secondary : t.surface.primary,
        opacity: r ? 0.5 : 1
      }),
      children: [
        /* @__PURE__ */ e(u, { style: { fontSize: 28, color: t.text["low-emphasis"] }, children: "📤" }),
        /* @__PURE__ */ e(u, { style: [h("label.md"), { color: t.text["high-emphasis"] }], children: s }),
        /* @__PURE__ */ e(u, { style: [h("body.sm"), { color: t.text["medium-emphasis"] }], children: i })
      ]
    }
  );
}
function ar({
  options: s,
  values: i = [],
  onChange: o,
  multiple: r = !0
}) {
  const { scales: t } = b(), n = (a) => {
    o?.(r ? i.includes(a) ? i.filter((l) => l !== a) : [...i, a] : i.includes(a) ? [] : [a]);
  };
  return /* @__PURE__ */ e(
    c,
    {
      style: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: t.spacing.scale[2]
      },
      children: s.map((a) => /* @__PURE__ */ e(
        ae,
        {
          selected: i.includes(a.value),
          disabled: a.disabled,
          count: a.count,
          onPress: () => n(a.value),
          children: a.label
        },
        a.value
      ))
    }
  );
}
function ir({ items: s, value: i, onChange: o }) {
  const { theme: r, scales: t } = b();
  return /* @__PURE__ */ e(
    T,
    {
      horizontal: !0,
      showsHorizontalScrollIndicator: !1,
      contentContainerStyle: {
        gap: t.spacing.scale[3],
        paddingHorizontal: t.spacing.scale[4],
        paddingVertical: t.spacing.scale[2]
      },
      children: s.map((n) => {
        const a = i === n.key;
        return /* @__PURE__ */ p(
          f,
          {
            onPress: () => o?.(n.key),
            style: { alignItems: "center", gap: t.spacing.scale[1], width: 64 },
            children: [
              /* @__PURE__ */ e(
                c,
                {
                  style: {
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: a ? r.brand.primary : r.surface.secondary,
                    alignItems: "center",
                    justifyContent: "center"
                  },
                  children: n.icon
                }
              ),
              /* @__PURE__ */ e(
                u,
                {
                  numberOfLines: 1,
                  style: [
                    h("label.xs"),
                    { color: a ? r.text["accent-primary"] : r.text["medium-emphasis"] }
                  ],
                  children: n.label
                }
              )
            ]
          },
          n.key
        );
      })
    }
  );
}
function lr({ items: s, value: i, onChange: o }) {
  const { theme: r, scales: t } = b();
  return /* @__PURE__ */ e(
    T,
    {
      horizontal: !0,
      showsHorizontalScrollIndicator: !1,
      contentContainerStyle: {
        gap: t.spacing.scale[2],
        paddingHorizontal: t.spacing.scale[4],
        paddingVertical: t.spacing.scale[2]
      },
      children: s.map((n) => {
        const a = i === n.key;
        return /* @__PURE__ */ p(
          f,
          {
            onPress: () => o?.(n.key),
            style: ({ pressed: l }) => ({
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              paddingHorizontal: t.spacing.scale[3],
              height: 36,
              borderRadius: t.borderRadius.full,
              backgroundColor: a ? r.brand.primary : l ? r.surface.tertiary : r.surface.secondary
            }),
            children: [
              /* @__PURE__ */ e(
                u,
                {
                  style: [
                    h("label.sm"),
                    {
                      color: a ? r.text["on-inverse"] : r.text["high-emphasis"],
                      fontWeight: a ? "700" : "500"
                    }
                  ],
                  children: n.label
                }
              ),
              n.count !== void 0 && /* @__PURE__ */ e(
                c,
                {
                  style: {
                    paddingHorizontal: 6,
                    borderRadius: 999,
                    backgroundColor: a ? r.surface.primary : r.surface.tertiary,
                    minWidth: 20,
                    alignItems: "center"
                  },
                  children: /* @__PURE__ */ e(
                    u,
                    {
                      style: [
                        h("label.xs"),
                        { color: a ? r.text["accent-primary"] : r.text["medium-emphasis"] }
                      ],
                      children: n.count
                    }
                  )
                }
              )
            ]
          },
          n.key
        );
      })
    }
  );
}
function cr({ steps: s, current: i }) {
  const { theme: o, scales: r } = b();
  return /* @__PURE__ */ e(c, { style: { flexDirection: "row", alignItems: "flex-start", gap: 0 }, children: s.map((t, n) => {
    const a = n < i, l = n === i, d = a || l;
    return /* @__PURE__ */ p(O.Fragment, { children: [
      /* @__PURE__ */ p(c, { style: { alignItems: "center", flex: 1 }, children: [
        /* @__PURE__ */ e(
          c,
          {
            style: {
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: d ? o.brand.primary : o.surface.tertiary,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: l ? o.border["accent-primary"] : "transparent"
            },
            children: /* @__PURE__ */ e(
              u,
              {
                style: [
                  h("label.xs"),
                  { color: d ? o.text["on-inverse"] : o.text["medium-emphasis"], fontWeight: "700" }
                ],
                children: a ? "✓" : n + 1
              }
            )
          }
        ),
        /* @__PURE__ */ e(
          u,
          {
            style: [
              h("label.xs"),
              {
                color: d ? o.text["accent-primary"] : o.text["medium-emphasis"],
                marginTop: 4,
                textAlign: "center"
              }
            ],
            children: t.label
          }
        )
      ] }),
      n < s.length - 1 && /* @__PURE__ */ e(
        c,
        {
          style: {
            flex: 0.5,
            height: 2,
            backgroundColor: a ? o.brand.primary : o.border["low-emphasis"],
            marginTop: 13
          }
        }
      )
    ] }, t.key);
  }) });
}
function dr({ value: s = [], onChange: i, placeholder: o = "タグを入力", maxTags: r = 10 }) {
  const { theme: t, scales: n } = b(), [a, l] = I(""), d = () => {
    const g = a.trim();
    if (g) {
      if (s.includes(g)) {
        l("");
        return;
      }
      s.length >= r || (i?.([...s, g]), l(""));
    }
  }, m = (g) => {
    i?.(s.filter((y) => y !== g));
  };
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: n.spacing.scale[1],
        padding: n.spacing.scale[2],
        borderRadius: n.borderRadius.md,
        borderWidth: 1,
        borderColor: t.border["medium-emphasis"],
        backgroundColor: t.surface.primary
      },
      children: [
        s.map((g) => /* @__PURE__ */ p(
          c,
          {
            style: {
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              paddingLeft: n.spacing.scale[2],
              paddingRight: 4,
              height: 28,
              borderRadius: n.borderRadius.full,
              backgroundColor: t.surface["accent-primary-light"]
            },
            children: [
              /* @__PURE__ */ e(u, { style: [h("label.sm"), { color: t.text["accent-primary"] }], children: g }),
              /* @__PURE__ */ e(f, { onPress: () => m(g), hitSlop: 6, children: /* @__PURE__ */ e(u, { style: [h("label.sm"), { color: t.text["accent-primary"] }], children: "×" }) })
            ]
          },
          g
        )),
        /* @__PURE__ */ e(
          L,
          {
            value: a,
            onChangeText: l,
            onSubmitEditing: d,
            onBlur: d,
            placeholder: s.length === 0 ? o : "",
            placeholderTextColor: t.text["low-emphasis"],
            returnKeyType: "done",
            style: [
              h("body.md"),
              {
                minWidth: 100,
                flex: 1,
                color: t.text["high-emphasis"],
                paddingVertical: 4,
                paddingHorizontal: 4
              }
            ]
          }
        )
      ]
    }
  );
}
function hr({ message: s, url: i, title: o, extra: r = [] }) {
  const { theme: t, scales: n } = b(), l = [
    { label: "共有", onPress: async () => {
      try {
        await pe.share({ message: [s, i].filter(Boolean).join(" "), title: o, url: i });
      } catch {
      }
    } },
    ...r
  ];
  return /* @__PURE__ */ e(c, { style: { flexDirection: "row", flexWrap: "wrap", gap: n.spacing.scale[2] }, children: l.map((d, m) => /* @__PURE__ */ e(
    f,
    {
      onPress: d.onPress,
      style: ({ pressed: g }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: n.spacing.scale[1],
        paddingHorizontal: n.spacing.scale[3],
        height: 40,
        borderRadius: n.borderRadius.full,
        backgroundColor: g ? t.active["secondary-button"] : t.surface["accent-primary-light"]
      }),
      children: /* @__PURE__ */ e(u, { style: [h("label.sm"), { color: t.text["accent-primary"] }], children: d.label })
    },
    m
  )) });
}
function ur(s) {
  return /* @__PURE__ */ e(ae, { ...s, shape: "pill", variant: "filled" });
}
function gr({ images: s, initialIndex: i = 0, thumbnailSize: o = 80 }) {
  const { theme: r, scales: t } = b(), [n, a] = I({ open: !1, index: i }), l = $.get("window").width;
  return /* @__PURE__ */ p(M, { children: [
    /* @__PURE__ */ e(
      j,
      {
        data: s,
        horizontal: !0,
        showsHorizontalScrollIndicator: !1,
        contentContainerStyle: { gap: t.spacing.scale[2] },
        keyExtractor: (d, m) => String(m),
        renderItem: ({ item: d, index: m }) => /* @__PURE__ */ e(f, { onPress: () => a({ open: !0, index: m }), children: /* @__PURE__ */ e(
          V,
          {
            source: d,
            style: {
              width: o,
              height: o,
              borderRadius: t.borderRadius.md,
              backgroundColor: r.surface.tertiary
            }
          }
        ) })
      }
    ),
    /* @__PURE__ */ e(
      E,
      {
        visible: n.open,
        transparent: !0,
        animationType: "fade",
        onRequestClose: () => a({ ...n, open: !1 }),
        children: /* @__PURE__ */ p(c, { style: { flex: 1, backgroundColor: r.surface.inverse }, children: [
          /* @__PURE__ */ e(
            f,
            {
              onPress: () => a({ ...n, open: !1 }),
              style: { position: "absolute", top: 48, right: 16, zIndex: 1, padding: 8 },
              children: /* @__PURE__ */ e(u, { style: [h("heading.lg"), { color: r.text["on-inverse"] }], children: "×" })
            }
          ),
          /* @__PURE__ */ e(
            j,
            {
              data: s,
              horizontal: !0,
              pagingEnabled: !0,
              initialScrollIndex: n.index,
              getItemLayout: (d, m) => ({
                length: l,
                offset: l * m,
                index: m
              }),
              keyExtractor: (d, m) => String(m),
              onScroll: (d) => {
                const m = Math.round(d.nativeEvent.contentOffset.x / l);
                m !== n.index && a((g) => ({ ...g, index: m }));
              },
              scrollEventThrottle: 32,
              renderItem: ({ item: d }) => /* @__PURE__ */ e(c, { style: { width: l, alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ e(
                V,
                {
                  source: d,
                  resizeMode: "contain",
                  style: { width: l, height: "100%" }
                }
              ) })
            }
          ),
          /* @__PURE__ */ e(
            c,
            {
              style: {
                position: "absolute",
                bottom: 32,
                left: 0,
                right: 0,
                alignItems: "center"
              },
              children: /* @__PURE__ */ p(u, { style: [h("label.md"), { color: r.text["on-inverse"] }], children: [
                n.index + 1,
                " / ",
                s.length
              ] })
            }
          )
        ] })
      }
    )
  ] });
}
const Ye = {
  google: "Google でログイン",
  apple: "Apple でログイン",
  line: "LINE でログイン",
  amazon: "Amazon でログイン",
  github: "GitHub でログイン",
  x: "X でログイン"
};
function pr({
  provider: s,
  label: i,
  onPress: o,
  disabled: r = !1
}) {
  const { theme: t, scales: n } = b(), a = n.brandExternal, l = {
    google: {
      bg: t.surface.primary,
      fg: t.text["high-emphasis"],
      border: a.googleBorder
    },
    apple: {
      bg: a.apple,
      fg: t.text["on-inverse"],
      border: a.apple
    },
    line: {
      bg: a.line,
      fg: t.text["on-inverse"],
      border: a.line
    },
    amazon: {
      bg: a.amazon,
      fg: t.text["on-inverse"],
      border: a.amazon
    },
    github: {
      bg: t.surface.inverse,
      fg: t.text["on-inverse"],
      border: t.surface.inverse
    },
    x: {
      bg: t.surface.inverse,
      fg: t.text["on-inverse"],
      border: t.surface.inverse
    }
  }[s];
  return /* @__PURE__ */ e(
    f,
    {
      onPress: o,
      disabled: r,
      style: ({ pressed: d }) => ({
        minHeight: n.touchTargets.buttonCTA.min,
        paddingHorizontal: n.spacing.scale[5],
        alignItems: "center",
        justifyContent: "center",
        borderRadius: n.borderRadius.lg,
        borderWidth: 1,
        backgroundColor: l.bg,
        borderColor: l.border,
        opacity: r ? 0.5 : d ? 0.85 : 1
      }),
      children: /* @__PURE__ */ e(c, { style: { flexDirection: "row", alignItems: "center", gap: n.spacing.scale[2] }, children: /* @__PURE__ */ e(u, { style: [h("label.md"), { color: l.fg }], children: i ?? Ye[s] }) })
    }
  );
}
const Xe = {
  x: { color: "#000000", letter: "X" },
  instagram: { color: "#E4405F", letter: "IG" },
  youtube: { color: "#FF0000", letter: "YT" },
  tiktok: { color: "#000000", letter: "TT" },
  facebook: { color: "#1877F2", letter: "f" },
  line: { color: "#06C755", letter: "L" }
};
function mr({ brand: s, size: i = 24 }) {
  const { theme: o } = b(), r = Xe[s];
  return /* @__PURE__ */ e(
    c,
    {
      style: {
        width: i,
        height: i,
        borderRadius: i / 2,
        backgroundColor: r.color,
        alignItems: "center",
        justifyContent: "center"
      },
      children: /* @__PURE__ */ e(
        u,
        {
          style: {
            color: o.text["on-inverse"],
            fontSize: i * 0.5,
            fontWeight: "700"
          },
          children: r.letter
        }
      )
    }
  );
}
function yr({ count: s = 3, variant: i = "row" }) {
  const { scales: o } = b();
  return /* @__PURE__ */ e(c, { style: { gap: o.spacing.scale[3] }, children: Array.from({ length: s }).map((r, t) => i === "card" ? /* @__PURE__ */ p(c, { style: { gap: o.spacing.scale[2] }, children: [
    /* @__PURE__ */ e(H, { height: 140, radius: o.borderRadius.lg }),
    /* @__PURE__ */ e(H, { height: 14, width: "60%" }),
    /* @__PURE__ */ e(H, { height: 12, width: "40%" })
  ] }, t) : i === "list" ? /* @__PURE__ */ p(c, { style: { gap: 8 }, children: [
    /* @__PURE__ */ e(H, { height: 14, width: "80%" }),
    /* @__PURE__ */ e(H, { height: 12, width: "50%" })
  ] }, t) : /* @__PURE__ */ p(c, { style: { flexDirection: "row", gap: o.spacing.scale[3], alignItems: "center" }, children: [
    /* @__PURE__ */ e(H, { width: 48, height: 48, radius: 24 }),
    /* @__PURE__ */ p(c, { style: { flex: 1, gap: 6 }, children: [
      /* @__PURE__ */ e(H, { height: 14, width: "70%" }),
      /* @__PURE__ */ e(H, { height: 12, width: "50%" })
    ] })
  ] }, t)) });
}
function br(s) {
  return /* @__PURE__ */ e($e, { ...s });
}
function fr({ filters: s, sortLabel: i = "並び替え", onPressSort: o }) {
  const { theme: r, scales: t } = b();
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        flexDirection: "row",
        alignItems: "center",
        gap: t.spacing.scale[2],
        paddingHorizontal: t.spacing.scale[3],
        paddingVertical: t.spacing.scale[2],
        backgroundColor: r.surface.primary,
        borderBottomWidth: 1,
        borderBottomColor: r.border["low-emphasis"]
      },
      children: [
        /* @__PURE__ */ e(
          T,
          {
            horizontal: !0,
            showsHorizontalScrollIndicator: !1,
            contentContainerStyle: { gap: t.spacing.scale[2] },
            style: { flex: 1 },
            children: s.map((n) => {
              const a = n.active || !!n.value;
              return /* @__PURE__ */ p(
                f,
                {
                  onPress: n.onPress,
                  style: ({ pressed: l }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    paddingHorizontal: t.spacing.scale[3],
                    height: 32,
                    borderRadius: t.borderRadius.full,
                    borderWidth: 1,
                    borderColor: a ? r.border["accent-primary"] : r.border["medium-emphasis"],
                    backgroundColor: a ? r.surface["accent-primary-light"] : l ? r.surface.secondary : r.surface.primary
                  }),
                  children: [
                    /* @__PURE__ */ p(
                      u,
                      {
                        style: [
                          h("label.sm"),
                          { color: a ? r.text["accent-primary"] : r.text["high-emphasis"] }
                        ],
                        children: [
                          n.label,
                          n.value ? `: ${n.value}` : ""
                        ]
                      }
                    ),
                    /* @__PURE__ */ e(
                      u,
                      {
                        style: [
                          h("label.xs"),
                          { color: a ? r.text["accent-primary"] : r.text["low-emphasis"] }
                        ],
                        children: "▾"
                      }
                    )
                  ]
                },
                n.key
              );
            })
          }
        ),
        /* @__PURE__ */ e(
          f,
          {
            onPress: o,
            style: ({ pressed: n }) => ({
              paddingHorizontal: t.spacing.scale[2],
              height: 32,
              justifyContent: "center",
              borderRadius: t.borderRadius.full,
              backgroundColor: n ? r.active["tertiary-button"] : "transparent"
            }),
            children: /* @__PURE__ */ e(u, { style: [h("label.sm"), { color: r.text["accent-primary"] }], children: i })
          }
        )
      ]
    }
  );
}
function xr({
  images: s,
  height: i = 280,
  showCounter: o = !0,
  showDots: r = !0
}) {
  const { theme: t, scales: n } = b(), [a, l] = I(0), d = $.get("window").width;
  return /* @__PURE__ */ p(c, { children: [
    /* @__PURE__ */ e(
      j,
      {
        data: s,
        horizontal: !0,
        pagingEnabled: !0,
        showsHorizontalScrollIndicator: !1,
        onScroll: (g) => {
          const y = Math.round(g.nativeEvent.contentOffset.x / d);
          y !== a && l(y);
        },
        scrollEventThrottle: 16,
        keyExtractor: (g, y) => String(y),
        renderItem: ({ item: g }) => /* @__PURE__ */ e(c, { style: { width: d, height: i, backgroundColor: t.surface.tertiary }, children: /* @__PURE__ */ e(V, { source: g, resizeMode: "cover", style: { width: "100%", height: "100%" } }) })
      }
    ),
    o && s.length > 1 && /* @__PURE__ */ e(
      c,
      {
        style: {
          position: "absolute",
          top: n.spacing.scale[3],
          right: n.spacing.scale[3],
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: n.borderRadius.full,
          backgroundColor: t.overlay.dark
        },
        children: /* @__PURE__ */ p(u, { style: [h("label.xs"), { color: t.text["on-inverse"] }], children: [
          a + 1,
          " / ",
          s.length
        ] })
      }
    ),
    r && s.length > 1 && /* @__PURE__ */ e(
      c,
      {
        style: {
          position: "absolute",
          bottom: n.spacing.scale[3],
          left: 0,
          right: 0,
          flexDirection: "row",
          justifyContent: "center",
          gap: 6
        },
        children: s.map((g, y) => /* @__PURE__ */ e(
          c,
          {
            style: {
              width: y === a ? 16 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: y === a ? t.text["on-inverse"] : t.text["on-inverse-secondary"]
            }
          },
          y
        ))
      }
    )
  ] });
}
function re(s, i = "¥") {
  return `${i}${s.toLocaleString("ja-JP")}`;
}
function qe({
  price: s,
  originalPrice: i,
  currency: o = "¥",
  size: r = "md",
  showTax: t = !0
}) {
  const { theme: n, scales: a } = b(), l = typeof i == "number" && i > s, d = l ? Math.round((1 - s / i) * 100) : 0, m = h(r === "lg" ? "heading.2xl" : r === "sm" ? "label.md" : "heading.lg");
  return /* @__PURE__ */ p(c, { style: { gap: 2 }, children: [
    /* @__PURE__ */ p(
      c,
      {
        style: {
          flexDirection: "row",
          alignItems: "baseline",
          gap: a.spacing.scale[2],
          flexWrap: "wrap"
        },
        children: [
          l && /* @__PURE__ */ p(
            u,
            {
              style: [
                h("label.md"),
                { color: n.caution.base, fontWeight: "700" }
              ],
              children: [
                d,
                "% OFF"
              ]
            }
          ),
          /* @__PURE__ */ e(u, { style: [m, { color: n.text["high-emphasis"] }], children: re(s, o) }),
          t && /* @__PURE__ */ e(u, { style: [h("body.sm"), { color: n.text["low-emphasis"] }], children: "税込" })
        ]
      }
    ),
    l && /* @__PURE__ */ e(
      u,
      {
        style: [
          h("body.sm"),
          { color: n.text["low-emphasis"], textDecorationLine: "line-through" }
        ],
        children: re(i, o)
      }
    )
  ] });
}
function wr({ min: s = 1, ...i }) {
  return /* @__PURE__ */ e(Pe, { min: s, ...i });
}
function Ge({ rating: s, count: i, size: o = 16, layout: r = "row" }) {
  const { theme: t, scales: n } = b();
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        flexDirection: r === "row" ? "row" : "column",
        alignItems: r === "row" ? "center" : "flex-start",
        gap: n.spacing.scale[1]
      },
      children: [
        /* @__PURE__ */ e(X, { value: s, size: o, readOnly: !0 }),
        /* @__PURE__ */ p(c, { style: { flexDirection: "row", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ e(u, { style: [h("label.sm"), { color: t.text["high-emphasis"] }], children: s.toFixed(1) }),
          i !== void 0 && /* @__PURE__ */ p(u, { style: [h("body.sm"), { color: t.text["low-emphasis"] }], children: [
            "(",
            i.toLocaleString("ja-JP"),
            ")"
          ] })
        ] })
      ]
    }
  );
}
function Ke({
  image: s,
  title: i,
  price: o,
  originalPrice: r,
  rating: t,
  reviewCount: n,
  badge: a,
  soldOut: l,
  onPress: d,
  layout: m = "vertical"
}) {
  const { theme: g, scales: y } = b(), x = m === "horizontal", R = x ? 96 : "100%", C = x ? 96 : 160, w = (v = !1) => /* @__PURE__ */ p(
    c,
    {
      style: {
        flexDirection: x ? "row" : "column",
        gap: y.spacing.scale[3],
        backgroundColor: g.surface.primary,
        borderRadius: y.borderRadius.lg,
        overflow: "hidden",
        padding: x ? y.spacing.scale[3] : 0,
        opacity: v ? 0.85 : 1
      },
      children: [
        /* @__PURE__ */ p(c, { style: { position: "relative", width: R, height: C }, children: [
          /* @__PURE__ */ e(
            V,
            {
              source: s,
              style: {
                width: "100%",
                height: "100%",
                borderRadius: y.borderRadius.md,
                backgroundColor: g.surface.tertiary
              },
              resizeMode: "cover"
            }
          ),
          l && /* @__PURE__ */ e(
            c,
            {
              style: {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: g.overlay.medium,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: y.borderRadius.md
              },
              children: /* @__PURE__ */ e(u, { style: [h("label.md"), { color: g.text["on-inverse"] }], children: "売り切れ" })
            }
          ),
          a && /* @__PURE__ */ e(
            c,
            {
              style: {
                position: "absolute",
                top: 8,
                left: 8
              },
              children: /* @__PURE__ */ e(ke, { tone: "caution", children: a })
            }
          )
        ] }),
        /* @__PURE__ */ p(c, { style: { flex: 1, gap: 4, padding: x ? 0 : y.spacing.scale[3] }, children: [
          /* @__PURE__ */ e(
            u,
            {
              numberOfLines: 2,
              style: [h("body.md"), { color: g.text["high-emphasis"] }],
              children: i
            }
          ),
          t !== void 0 && /* @__PURE__ */ e(Ge, { rating: t, count: n, size: 14 }),
          /* @__PURE__ */ e(qe, { price: o, originalPrice: r, size: "sm" })
        ] })
      ]
    }
  );
  return d ? /* @__PURE__ */ e(f, { onPress: d, disabled: l, children: ({ pressed: v }) => w(v) }) : w(!1);
}
function Cr({
  title: s,
  action: i,
  products: o,
  cardWidth: r = 160
}) {
  const { scales: t } = b();
  return /* @__PURE__ */ p(c, { children: [
    s && /* @__PURE__ */ e(Ne, { title: s, action: i }),
    /* @__PURE__ */ e(
      j,
      {
        data: o,
        horizontal: !0,
        showsHorizontalScrollIndicator: !1,
        keyExtractor: (n, a) => String(a),
        contentContainerStyle: {
          gap: t.spacing.scale[3],
          paddingHorizontal: t.spacing.scale[4],
          paddingBottom: t.spacing.scale[2]
        },
        renderItem: ({ item: n }) => /* @__PURE__ */ e(c, { style: { width: r }, children: /* @__PURE__ */ e(Ke, { ...n }) })
      }
    )
  ] });
}
function Je(s, i) {
  return `${i}${s.toLocaleString("ja-JP")}`;
}
function Rr({ lines: s, currency: i = "¥" }) {
  const { theme: o, scales: r } = b();
  return /* @__PURE__ */ e(
    c,
    {
      style: {
        backgroundColor: o.surface.primary,
        borderColor: o.border["low-emphasis"],
        borderWidth: 1,
        borderRadius: r.borderRadius.lg,
        padding: r.spacing.scale[4],
        gap: r.spacing.scale[2]
      },
      children: s.map((t, n) => {
        const a = t.emphasis === "total", l = t.emphasis === "discount", d = l ? o.text.caution : a ? o.text["accent-primary"] : o.text["high-emphasis"], m = h(a ? "label.lg" : "body.md"), g = h(a ? "heading.lg" : "body.md");
        return /* @__PURE__ */ p(O.Fragment, { children: [
          a && /* @__PURE__ */ e(F, {}),
          /* @__PURE__ */ p(c, { style: { flexDirection: "row", justifyContent: "space-between" }, children: [
            /* @__PURE__ */ e(u, { style: [m, { color: o.text["medium-emphasis"] }], children: t.label }),
            /* @__PURE__ */ p(u, { style: [g, { color: d }], children: [
              l && t.value > 0 ? "-" : "",
              Je(t.value, i)
            ] })
          ] })
        ] }, n);
      })
    }
  );
}
function vr({
  authorName: s,
  authorAvatar: i,
  rating: o,
  date: r,
  title: t,
  comment: n,
  helpfulCount: a
}) {
  const { theme: l, scales: d } = b();
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        backgroundColor: l.surface.primary,
        borderRadius: d.borderRadius.lg,
        borderWidth: 1,
        borderColor: l.border["low-emphasis"],
        padding: d.spacing.scale[4],
        gap: d.spacing.scale[2]
      },
      children: [
        /* @__PURE__ */ p(c, { style: { flexDirection: "row", alignItems: "center", gap: d.spacing.scale[2] }, children: [
          /* @__PURE__ */ e(Re, { source: i, fallback: s[0], size: "sm" }),
          /* @__PURE__ */ p(c, { style: { flex: 1 }, children: [
            /* @__PURE__ */ e(u, { style: [h("label.md"), { color: l.text["high-emphasis"] }], children: s }),
            r && /* @__PURE__ */ e(u, { style: [h("body.sm"), { color: l.text["low-emphasis"] }], children: r })
          ] }),
          /* @__PURE__ */ e(X, { value: o, size: 14, readOnly: !0 })
        ] }),
        t && /* @__PURE__ */ e(u, { style: [h("label.md"), { color: l.text["high-emphasis"] }], children: t }),
        /* @__PURE__ */ e(u, { style: [h("body.md"), { color: l.text["high-emphasis"] }], children: n }),
        a !== void 0 && /* @__PURE__ */ p(u, { style: [h("label.sm"), { color: l.text["low-emphasis"] }], children: [
          "参考になった ",
          a
        ] })
      ]
    }
  );
}
function kr({ average: s, total: i, distribution: o }) {
  const { theme: r, scales: t } = b();
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        flexDirection: "row",
        gap: t.spacing.scale[4],
        padding: t.spacing.scale[4],
        backgroundColor: r.surface.primary,
        borderRadius: t.borderRadius.lg,
        borderWidth: 1,
        borderColor: r.border["low-emphasis"]
      },
      children: [
        /* @__PURE__ */ p(c, { style: { alignItems: "center", gap: t.spacing.scale[1], minWidth: 100 }, children: [
          /* @__PURE__ */ e(u, { style: [h("heading.3xl"), { color: r.text["high-emphasis"] }], children: s.toFixed(1) }),
          /* @__PURE__ */ e(X, { value: s, size: 16, readOnly: !0 }),
          /* @__PURE__ */ p(u, { style: [h("body.sm"), { color: r.text["low-emphasis"] }], children: [
            i.toLocaleString("ja-JP"),
            " 件"
          ] })
        ] }),
        /* @__PURE__ */ e(c, { style: { flex: 1, gap: 4 }, children: [5, 4, 3, 2, 1].map((n) => {
          const a = o[n] ?? 0, l = i > 0 ? a / i * 100 : 0;
          return /* @__PURE__ */ p(
            c,
            {
              style: { flexDirection: "row", alignItems: "center", gap: t.spacing.scale[2] },
              children: [
                /* @__PURE__ */ e(u, { style: [h("label.sm"), { color: r.text["medium-emphasis"], width: 16 }], children: n }),
                /* @__PURE__ */ e(
                  c,
                  {
                    style: {
                      flex: 1,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: r.surface.tertiary,
                      overflow: "hidden"
                    },
                    children: /* @__PURE__ */ e(
                      c,
                      {
                        style: {
                          width: `${l}%`,
                          height: "100%",
                          backgroundColor: r.object.rating
                        }
                      }
                    )
                  }
                ),
                /* @__PURE__ */ e(
                  u,
                  {
                    style: [
                      h("body.sm"),
                      { color: r.text["low-emphasis"], width: 40, textAlign: "right" }
                    ],
                    children: a
                  }
                )
              ]
            },
            n
          );
        }) })
      ]
    }
  );
}
function Ir({
  header: s,
  footer: i,
  bottomNav: o,
  scrollable: r = !0,
  children: t
}) {
  const { theme: n } = b(), a = r ? /* @__PURE__ */ e(T, { style: { flex: 1, backgroundColor: n.surface.secondary }, children: t }) : /* @__PURE__ */ e(c, { style: { flex: 1, backgroundColor: n.surface.secondary }, children: t });
  return /* @__PURE__ */ p(c, { style: { flex: 1, backgroundColor: n.surface.primary }, children: [
    s,
    a,
    i,
    o
  ] });
}
function Sr({ header: s, footer: i, cta: o, children: r }) {
  const { theme: t } = b();
  return /* @__PURE__ */ p(c, { style: { flex: 1, backgroundColor: t.surface.primary }, children: [
    s,
    /* @__PURE__ */ p(T, { style: { flex: 1 }, contentContainerStyle: { paddingBottom: o ? 80 : 0 }, children: [
      r,
      i
    ] }),
    o && /* @__PURE__ */ e(
      c,
      {
        style: {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0
        },
        children: o
      }
    )
  ] });
}
export {
  _t as Accordion,
  Ct as Alert,
  We as AlertDialog,
  Jt as AppHeader,
  Ir as AppShell,
  pt as AutoGrowTextarea,
  Re as Avatar,
  ot as Badge,
  _e as Banner,
  Qt as BannerCarousel,
  Tt as BottomSheetForm,
  br as BottomTabBar,
  Kt as Breadcrumb,
  P as Button,
  Le as Calendar,
  nt as Card,
  ir as CategoryNav,
  lr as CategoryScroll,
  Q as Checkbox,
  yt as CheckboxCard,
  Te as CheckboxField,
  bt as CheckboxGroup,
  ae as Chip,
  ar as ChipSelector,
  Wt as CoachMark,
  Ht as CoachMarkOverlay,
  Nt as Collapsible,
  Mt as Combobox,
  Dt as ConfirmDialog,
  gt as CountdownTimer,
  Et as DatePicker,
  le as Dialog,
  Bt as DropdownFilter,
  vt as DropdownMenu,
  er as EmptyState,
  tr as ErrorState,
  sr as FileUpload,
  fr as FilterBar,
  ur as FilterChip,
  or as Footer,
  wt as FormField,
  ye as GlassView,
  xr as ImageCarousel,
  gr as ImageGallery,
  ie as Input,
  Se as Label,
  Zt as ListItem,
  yr as ListSkeletons,
  Sr as MarketingShell,
  St as MenuDrawer,
  jt as MultiSelect,
  $e as NavigationBar,
  dt as NotificationBadge,
  Pe as NumberInput,
  Rr as OrderSummary,
  Xt as Pagination,
  Vt as PillToggle,
  He as Popover,
  qe as PriceDisplay,
  Ke as ProductCard,
  Cr as ProductCarousel,
  lt as Progress,
  ct as ProgressRing,
  cr as ProgressSteps,
  wr as QuantitySelector,
  ft as RadioGroup,
  Ge as RatingDisplay,
  Rt as ResponsiveDialog,
  vr as ReviewCard,
  Pt as ReviewOverlay,
  kr as ReviewSummary,
  Yt as ScrollArea,
  Ut as SearchBar,
  Ne as SectionHeader,
  zt as Select,
  F as Separator,
  hr as ShareButtons,
  W as Sheet,
  qt as SimplePagination,
  H as Skeleton,
  it as SkeletonText,
  xt as Slider,
  mr as SocialIcon,
  pr as SocialLoginButton,
  at as Spinner,
  st as Stack,
  X as StarRating,
  ht as StatCard,
  rr as StickyActionBar,
  Gt as SubNav,
  nr as SwipeRow,
  mt as Switch,
  ut as SyncStatusBadge,
  Ft as Tabs,
  At as TabsContent,
  Ot as TabsList,
  Lt as TabsTrigger,
  ke as Tag,
  dr as TagInput,
  rt as Text,
  De as Textarea,
  tt as ThemeProvider,
  $t as TimePicker,
  It as ToastProvider,
  Pr as getTheme,
  Wr as primitives,
  h as resolveTypo,
  G as scales,
  Hr as themeNames,
  ue as themes,
  b as useTheme,
  kt as useToast
};
