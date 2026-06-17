import { scales as ce, themes as je } from "../native.js";
import { getTheme as tn, primitives as rn, themeNames as nn } from "../native.js";
import { jsx as e, jsxs as p, Fragment as O } from "react/jsx-runtime";
import X, { useState as S, useMemo as ee, useContext as de, createContext as he, useRef as D, useEffect as te, useCallback as xe } from "react";
import { Text as g, Platform as $, View as c, Pressable as x, Image as N, ActivityIndicator as ke, Animated as I, TextInput as q, Switch as Fe, PanResponder as ue, Modal as G, Dimensions as K, Easing as L, ScrollView as H, FlatList as _, Share as Ee } from "react-native";
const Se = he(null);
function Tt({
  children: s,
  initialName: i = "default",
  initialMode: o = "light"
}) {
  const [r, t] = S(i), [n, a] = S(o), l = ee(
    () => ({
      name: r,
      mode: n,
      theme: je[r][n],
      scales: ce,
      setName: t,
      setMode: a,
      toggleMode: () => a((d) => d === "light" ? "dark" : "light")
    }),
    [r, n]
  );
  return /* @__PURE__ */ e(Se.Provider, { value: l, children: s });
}
function y() {
  const s = de(Se);
  if (!s) throw new Error("useTheme は ThemeProvider の内側で使ってください");
  return s;
}
function u(s) {
  if (s === "caption") return { ...ce.typography.caption };
  const [i, o] = s.split(".");
  return { ...ce.typography[i][o] };
}
function Dt({ variant: s = "body.md", color: i, style: o, children: r, ...t }) {
  const { theme: n } = y();
  return /* @__PURE__ */ e(g, { style: [u(s), { color: i ?? n.text["high-emphasis"] }, o], ...t, children: r });
}
const Oe = {
  subtle: { blur: 14, opacity: 0.1 },
  regular: { blur: 28, opacity: 0.18 },
  thick: { blur: 56, opacity: 0.28 }
};
function Ae({
  intensity: s = "regular",
  tint: i = "system",
  showRim: o = !0,
  borderRadius: r,
  style: t,
  children: n,
  ...a
}) {
  const { theme: l, scales: d, mode: m } = y(), h = r ?? d.borderRadius.lg, b = Oe[s], f = i === "system" ? m === "dark" ? "dark" : "light" : i, v = {
    borderRadius: h,
    overflow: "hidden",
    backgroundColor: f === "light" ? `rgba(255, 255, 255, ${b.opacity})` : `rgba(20, 20, 30, ${b.opacity})`,
    borderWidth: o ? 1 : 0,
    borderColor: f === "light" ? "rgba(255, 255, 255, 0.42)" : "rgba(255, 255, 255, 0.15)"
  }, R = _e();
  if (R && $.OS === "ios")
    return /* @__PURE__ */ p(
      R,
      {
        intensity: b.blur * 2.5,
        tint: f === "dark" ? "dark" : "light",
        style: [v, { backgroundColor: "transparent" }, t],
        ...a,
        children: [
          o && /* @__PURE__ */ e(
            c,
            {
              pointerEvents: "none",
              style: {
                ...Le,
                borderRadius: h,
                borderWidth: 1,
                borderColor: v.borderColor
              }
            }
          ),
          n
        ]
      }
    );
  if ($.OS === "web") {
    const w = {
      ...v,
      // RN Web は未知のスタイルキーを CSS としてそのまま出力する
      WebkitBackdropFilter: `blur(${b.blur}px) saturate(1.9) brightness(1.06)`,
      backdropFilter: `blur(${b.blur}px) saturate(1.9) brightness(1.06)`
    };
    return /* @__PURE__ */ e(c, { style: [w, t], ...a, children: n });
  }
  return /* @__PURE__ */ e(c, { style: [v, t], ...a, children: n });
}
const Le = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
};
let Q;
function _e() {
  if (Q !== void 0) return Q;
  try {
    Q = require("expo-blur").BlurView ?? null;
  } catch {
    Q = null;
  }
  return Q;
}
function B({ variant: s = "primary", children: i, ...o }) {
  const { theme: r, scales: t, mode: n } = y(), a = {
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
      x,
      {
        style: {
          minHeight: t.touchTargets.buttonCTA.min,
          borderRadius: t.borderRadius.full,
          overflow: "hidden"
        },
        ...o,
        children: ({ pressed: m }) => /* @__PURE__ */ e(
          Ae,
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
            children: /* @__PURE__ */ e(g, { style: [u("label.md"), { color: d }], children: i })
          }
        )
      }
    );
  }
  const l = a[s];
  return /* @__PURE__ */ e(
    x,
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
      children: /* @__PURE__ */ e(g, { style: [u("label.md"), { color: l.fg }], children: i })
    }
  );
}
const $e = {
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
function Ne(s, i) {
  return {
    shadowColor: i,
    ...$e[s]
  };
}
function Pt({ padding: s = 4, elevation: i, style: o, children: r, ...t }) {
  const { theme: n, scales: a } = y(), l = i ? $.select({
    web: { boxShadow: a.shadows[i].boxShadow },
    ios: Ne(i, n.overlay.dark),
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
function Wt({ tone: s = "neutral", children: i }) {
  const { theme: o, scales: r } = y(), n = {
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
      children: /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: n.fg }], children: i })
    }
  );
}
function Ht({
  gap: s = 3,
  direction: i = "column",
  align: o,
  justify: r,
  wrap: t = !1,
  style: n,
  children: a,
  ...l
}) {
  const { scales: d } = y();
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
const Ye = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80
};
function Xe({ source: s, fallback: i, size: o = "md" }) {
  const { theme: r } = y(), t = Ye[o];
  return s ? /* @__PURE__ */ e(
    N,
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
      children: /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: r.text["medium-emphasis"] }], children: i ?? "?" })
    }
  );
}
const we = { sm: 28, md: 32, lg: 36 }, qe = { sm: 10, md: 12, lg: 16 };
function Ie({
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
  const { theme: h, scales: b } = y(), f = {
    filled: { bg: h.surface.secondary, fg: h.text["high-emphasis"], border: "transparent" },
    accent: {
      bg: h.surface["accent-primary-light"],
      fg: h.text["accent-primary"],
      border: "transparent"
    },
    outline: { bg: "transparent", fg: h.text["high-emphasis"], border: h.border["medium-emphasis"] }
  }[s], v = r ? h.brand.primary : f.bg, R = r ? h.text["on-inverse"] : t ? h.text.disable : f.fg, w = r ? h.brand.primary : f.border;
  return /* @__PURE__ */ p(c, { style: { flexDirection: "row", alignSelf: "flex-start" }, children: [
    /* @__PURE__ */ p(
      x,
      {
        disabled: t,
        style: ({ pressed: C }) => [
          {
            height: we[i],
            paddingHorizontal: qe[i],
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: b.spacing.scale[1],
            borderRadius: o === "pill" ? b.borderRadius.full : b.borderRadius.sm,
            borderWidth: s === "outline" || r ? 1 : 0,
            borderColor: w,
            backgroundColor: C && !t ? h.active["secondary-button"] : v,
            opacity: t ? 0.6 : 1
          },
          a && { borderTopRightRadius: 0, borderBottomRightRadius: 0 }
        ],
        ...m,
        children: [
          /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: R }], children: d }),
          n !== void 0 && /* @__PURE__ */ e(
            c,
            {
              style: {
                minWidth: 20,
                paddingHorizontal: 6,
                borderRadius: b.borderRadius.full,
                backgroundColor: r ? h.surface.primary : h.surface.tertiary,
                alignItems: "center",
                justifyContent: "center"
              },
              children: /* @__PURE__ */ e(
                g,
                {
                  style: [
                    u("label.xs"),
                    { color: r ? h.text["accent-primary"] : h.text["medium-emphasis"] }
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
      x,
      {
        onPress: l,
        disabled: t,
        style: ({ pressed: C }) => ({
          height: we[i],
          paddingHorizontal: 10,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: C ? h.active["tertiary-button"] : v,
          borderTopRightRadius: o === "pill" ? b.borderRadius.full : b.borderRadius.sm,
          borderBottomRightRadius: o === "pill" ? b.borderRadius.full : b.borderRadius.sm,
          borderWidth: s === "outline" || r ? 1 : 0,
          borderLeftWidth: 0,
          borderColor: w,
          opacity: t ? 0.6 : 1
        }),
        children: /* @__PURE__ */ e(g, { style: [u("label.md"), { color: R, lineHeight: 14 }], children: "×" })
      }
    )
  ] });
}
function Ge({ tone: s = "neutral", variant: i = "filled", children: o }) {
  const { theme: r, scales: t } = y(), n = {
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
      children: /* @__PURE__ */ e(g, { style: [u("label.xs"), { color: l?.fg ?? d?.fg ?? r.text["medium-emphasis"] }], children: o })
    }
  );
}
function Mt({ size: s = "md", color: i }) {
  const { theme: o } = y();
  return /* @__PURE__ */ e(
    ke,
    {
      size: s === "sm" ? "small" : "large",
      color: i ?? o.brand.primary
    }
  );
}
function Y({ orientation: s = "horizontal", emphasis: i = "low" }) {
  const { theme: o } = y(), r = i === "low" ? o.border["low-emphasis"] : o.border["medium-emphasis"];
  return s === "vertical" ? /* @__PURE__ */ e(c, { style: { width: 1, alignSelf: "stretch", backgroundColor: r } }) : /* @__PURE__ */ e(c, { style: { height: 1, alignSelf: "stretch", backgroundColor: r } });
}
function E({ width: s = "100%", height: i = 16, radius: o, style: r }) {
  const { theme: t, scales: n } = y(), a = D(new I.Value(0.4)).current;
  return te(() => {
    const l = I.loop(
      I.sequence([
        I.timing(a, { toValue: 1, duration: 800, useNativeDriver: !0 }),
        I.timing(a, { toValue: 0.4, duration: 800, useNativeDriver: !0 })
      ])
    );
    return l.start(), () => l.stop();
  }, [a]), /* @__PURE__ */ e(
    I.View,
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
function zt({ lines: s = 3 }) {
  return /* @__PURE__ */ e(c, { style: { gap: 8 }, children: Array.from({ length: s }).map((i, o) => /* @__PURE__ */ e(E, { height: 12, width: o === s - 1 ? "60%" : "100%" }, o)) });
}
function Bt({ value: s, max: i = 100, height: o = 8, tone: r = "accent" }) {
  const { theme: t, scales: n } = y(), a = Math.min(100, Math.max(0, s / i * 100)), l = {
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
function Vt({
  value: s,
  max: i = 100,
  size: o = 64,
  thickness: r = 6,
  showLabel: t = !0
}) {
  const { theme: n } = y(), a = Math.min(100, Math.max(0, s / i * 100)), l = a / 100 * 360, d = n.surface.tertiary, m = n.brand.primary, h = o / 2, b = (f) => /* @__PURE__ */ e(
    c,
    {
      style: {
        position: "absolute",
        width: o,
        height: o,
        transform: [{ rotate: `${f}deg` }]
      },
      children: /* @__PURE__ */ e(
        c,
        {
          style: {
            position: "absolute",
            width: h,
            height: o,
            backgroundColor: m,
            borderTopLeftRadius: h,
            borderBottomLeftRadius: h
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
        l > 0 && b(0),
        l > 180 && b(180),
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
                  width: h,
                  height: o,
                  backgroundColor: d,
                  borderTopRightRadius: h,
                  borderBottomRightRadius: h
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
                  width: h,
                  height: o,
                  backgroundColor: d,
                  borderTopRightRadius: h,
                  borderBottomRightRadius: h
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
            children: t && /* @__PURE__ */ p(g, { style: [u("label.sm"), { color: n.text["high-emphasis"] }], children: [
              Math.round(a),
              "%"
            ] })
          }
        )
      ]
    }
  );
}
function oe({ value: s, max: i = 5, size: o = 20, onChange: r, readOnly: t = !1 }) {
  const { theme: n } = y(), a = n.object.rating, l = n.object["low-emphasis"], d = Math.max(0, Math.min(i, s));
  return /* @__PURE__ */ e(c, { style: { flexDirection: "row", gap: 2 }, children: Array.from({ length: i }).map((m, h) => {
    const b = h + 1 <= d, f = !b && h + 0.5 <= d, w = /* @__PURE__ */ e(
      g,
      {
        style: {
          fontSize: o,
          color: b || f ? a : l,
          opacity: f ? 0.5 : 1
        },
        children: f || b ? "★" : "☆"
      }
    );
    return t || !r ? /* @__PURE__ */ e(c, { children: w }, h) : /* @__PURE__ */ e(x, { onPress: () => r(h + 1), hitSlop: 8, children: w }, h);
  }) });
}
function jt({ count: s = 0, max: i = 99, dot: o = !1, children: r }) {
  const { theme: t, scales: n } = y();
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
        children: !o && /* @__PURE__ */ e(g, { style: [u("label.xs"), { color: t.text["on-inverse"] }], children: s > i ? `${i}+` : s })
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
      children: /* @__PURE__ */ e(g, { style: [u("label.xs"), { color: t.text["on-inverse"] }], children: s > i ? `${i}+` : s })
    }
  );
}
function Ft({ label: s, value: i, delta: o, trend: r = "neutral" }) {
  const { theme: t, scales: n } = y(), a = r === "up" ? t.text.success : r === "down" ? t.text.caution : t.text["low-emphasis"];
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
        /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: t.text["low-emphasis"] }], children: s }),
        /* @__PURE__ */ e(g, { style: [u("heading.2xl"), { color: t.text["high-emphasis"] }], children: i }),
        o && /* @__PURE__ */ p(g, { style: [u("label.sm"), { color: a }], children: [
          r === "up" ? "▲" : r === "down" ? "▼" : "■",
          " ",
          o
        ] })
      ]
    }
  );
}
function Et({ status: s, label: i }) {
  const { theme: o, scales: r } = y(), t = {
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
        s === "syncing" ? /* @__PURE__ */ e(ke, { size: "small", color: t.fg }) : /* @__PURE__ */ e(
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
        /* @__PURE__ */ e(g, { style: [u("label.xs"), { color: t.fg }], children: i ?? t.def })
      ]
    }
  );
}
function Ke(s) {
  return s.toString().padStart(2, "0");
}
function Ot({ target: s, onComplete: i, tone: o = "neutral" }) {
  const { theme: r, scales: t } = y(), n = s instanceof Date ? s.getTime() : s, [a, l] = S(() => Date.now());
  te(() => {
    const C = setInterval(() => {
      const k = Date.now();
      l(k), k >= n && (clearInterval(C), i?.());
    }, 1e3);
    return () => clearInterval(C);
  }, [n, i]);
  const d = Math.max(0, n - a), m = Math.floor(d / 1e3), h = Math.floor(m / 86400), b = Math.floor(m % 86400 / 3600), f = Math.floor(m % 3600 / 60), v = m % 60, R = o === "accent" ? r.text["accent-primary"] : o === "caution" ? r.text.caution : r.text["high-emphasis"], w = (C, k) => /* @__PURE__ */ p(c, { style: { alignItems: "center", minWidth: 48 }, children: [
    /* @__PURE__ */ e(
      c,
      {
        style: {
          backgroundColor: r.surface.secondary,
          paddingVertical: t.spacing.scale[1],
          paddingHorizontal: t.spacing.scale[2],
          borderRadius: t.borderRadius.md
        },
        children: /* @__PURE__ */ e(g, { style: [u("heading.md"), { color: R }], children: Ke(C) })
      }
    ),
    /* @__PURE__ */ e(g, { style: [u("label.xs"), { color: r.text["low-emphasis"], marginTop: 2 }], children: k })
  ] });
  return /* @__PURE__ */ p(c, { style: { flexDirection: "row", gap: t.spacing.scale[2] }, children: [
    h > 0 && w(h, "日"),
    w(b, "時間"),
    w(f, "分"),
    w(v, "秒")
  ] });
}
function Je({ required: s, children: i, style: o, ...r }) {
  const { theme: t, scales: n } = y();
  return /* @__PURE__ */ p(
    c,
    {
      style: [{ flexDirection: "row", alignItems: "center", gap: n.spacing.scale[1] }, o],
      ...r,
      children: [
        /* @__PURE__ */ e(g, { style: [u("label.md"), { color: t.text["high-emphasis"] }], children: i }),
        s && /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: t.caution.base }], children: "*" })
      ]
    }
  );
}
function Te({ invalid: s, disabled: i, leading: o, trailing: r, ...t }) {
  const { theme: n, scales: a } = y(), [l, d] = S(!1), m = s ? n.border.caution : l ? n.border["accent-primary"] : n.border["medium-emphasis"];
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
          q,
          {
            editable: !i,
            onFocus: (h) => {
              d(!0), t.onFocus?.(h);
            },
            onBlur: (h) => {
              d(!1), t.onBlur?.(h);
            },
            placeholderTextColor: n.text["low-emphasis"],
            style: [
              u("body.md"),
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
function Ue({ invalid: s, disabled: i, minHeight: o = 96, ...r }) {
  const { theme: t, scales: n } = y(), [a, l] = S(!1), d = s ? t.border.caution : a ? t.border["accent-primary"] : t.border["medium-emphasis"];
  return /* @__PURE__ */ e(
    q,
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
        u("body.md"),
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
function At({
  invalid: s,
  disabled: i,
  minHeight: o = 44,
  maxHeight: r = 200,
  ...t
}) {
  const { theme: n, scales: a } = y(), [l, d] = S(!1), [m, h] = S(o), b = s ? n.border.caution : l ? n.border["accent-primary"] : n.border["medium-emphasis"];
  return /* @__PURE__ */ e(
    q,
    {
      editable: !i,
      multiline: !0,
      textAlignVertical: "top",
      onContentSizeChange: (v) => {
        const R = Math.min(r, Math.max(o, v.nativeEvent.contentSize.height + 16));
        h(R);
      },
      onFocus: (v) => {
        d(!0), t.onFocus?.(v);
      },
      onBlur: (v) => {
        d(!1), t.onBlur?.(v);
      },
      placeholderTextColor: n.text["low-emphasis"],
      style: [
        u("body.md"),
        {
          height: m,
          padding: a.spacing.scale[3],
          borderRadius: a.borderRadius.md,
          borderWidth: 1,
          borderColor: b,
          backgroundColor: i ? n.surface.disable : n.surface.primary,
          color: n.text["high-emphasis"],
          opacity: i ? 0.6 : 1
        }
      ],
      ...t
    }
  );
}
function Lt(s) {
  const { theme: i } = y();
  return /* @__PURE__ */ e(
    Fe,
    {
      trackColor: { false: i.surface.tertiary, true: i.brand.primary },
      thumbColor: i.surface.primary,
      ios_backgroundColor: i.surface.tertiary,
      ...s
    }
  );
}
function ge({ checked: s = !1, onChange: i, disabled: o = !1, size: r = 20 }) {
  const { theme: t, scales: n } = y();
  return /* @__PURE__ */ e(
    x,
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
function Qe({
  checked: s = !1,
  onChange: i,
  disabled: o = !1,
  label: r,
  description: t
}) {
  const { theme: n, scales: a } = y();
  return /* @__PURE__ */ p(
    x,
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
        /* @__PURE__ */ e(c, { style: { paddingTop: 2 }, children: /* @__PURE__ */ e(ge, { checked: s, disabled: o, onChange: i }) }),
        /* @__PURE__ */ p(c, { style: { flex: 1, gap: 2 }, children: [
          /* @__PURE__ */ e(g, { style: [u("body.md"), { color: n.text["high-emphasis"] }], children: r }),
          t && /* @__PURE__ */ e(g, { style: [u("body.sm"), { color: n.text["medium-emphasis"] }], children: t })
        ] })
      ]
    }
  );
}
function _t({
  checked: s = !1,
  onChange: i,
  disabled: o = !1,
  title: r,
  description: t
}) {
  const { theme: n, scales: a } = y();
  return /* @__PURE__ */ p(
    x,
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
        /* @__PURE__ */ e(c, { style: { paddingTop: 2 }, children: /* @__PURE__ */ e(ge, { checked: s, disabled: o, onChange: i }) }),
        /* @__PURE__ */ p(c, { style: { flex: 1, gap: 2 }, children: [
          /* @__PURE__ */ e(g, { style: [u("label.md"), { color: n.text["high-emphasis"] }], children: r }),
          t && /* @__PURE__ */ e(g, { style: [u("body.sm"), { color: n.text["medium-emphasis"] }], children: t })
        ] })
      ]
    }
  );
}
function $t({ options: s, values: i = [], onChange: o, disabled: r = !1 }) {
  const { scales: t } = y(), n = (a) => {
    i.includes(a) ? o?.(i.filter((l) => l !== a)) : o?.([...i, a]);
  };
  return /* @__PURE__ */ e(c, { style: { gap: t.spacing.scale[3] }, children: s.map((a) => /* @__PURE__ */ e(
    Qe,
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
function Nt({ options: s, value: i, onChange: o, disabled: r = !1 }) {
  const { theme: t, scales: n } = y();
  return /* @__PURE__ */ e(c, { style: { gap: n.spacing.scale[3] }, children: s.map((a) => {
    const l = i === a.value, d = r || a.disabled;
    return /* @__PURE__ */ p(
      x,
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
            /* @__PURE__ */ e(g, { style: [u("body.md"), { color: t.text["high-emphasis"] }], children: a.label }),
            a.description && /* @__PURE__ */ e(g, { style: [u("body.sm"), { color: t.text["medium-emphasis"] }], children: a.description })
          ] })
        ]
      },
      a.value
    );
  }) });
}
function Yt({
  value: s,
  onChange: i,
  min: o = 0,
  max: r = 100,
  step: t = 1,
  disabled: n = !1
}) {
  const { theme: a, scales: l } = y(), [d, m] = S(0), h = D(0), b = (k) => Math.max(o, Math.min(r, k)), f = (k) => t ? Math.round(k / t) * t : k, v = (k) => {
    if (!h.current) return;
    const T = Math.max(0, Math.min(1, k / h.current)), J = b(f(o + (r - o) * T));
    i?.(J);
  }, R = D(
    ue.create({
      onStartShouldSetPanResponder: () => !n,
      onMoveShouldSetPanResponder: () => !n,
      onPanResponderGrant: (k) => v(k.nativeEvent.locationX),
      onPanResponderMove: (k) => v(k.nativeEvent.locationX)
    })
  ).current, w = (b(s) - o) / (r - o);
  return /* @__PURE__ */ p(
    c,
    {
      onLayout: (k) => {
        const T = k.nativeEvent.layout.width;
        m(T), h.current = T;
      },
      ...R.panHandlers,
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
function Ze({
  value: s,
  onChange: i,
  min: o = 0,
  max: r = 99,
  step: t = 1,
  disabled: n = !1
}) {
  const { theme: a, scales: l } = y(), d = (b) => Math.max(o, Math.min(r, b)), m = () => !n && i?.(d(s + t)), h = () => !n && i?.(d(s - t));
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
          x,
          {
            onPress: h,
            disabled: n || s <= o,
            style: ({ pressed: b }) => ({
              width: 40,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: b ? a.active["tertiary-button"] : "transparent"
            }),
            children: /* @__PURE__ */ e(g, { style: [u("heading.md"), { color: a.text["high-emphasis"] }], children: "−" })
          }
        ),
        /* @__PURE__ */ e(
          q,
          {
            value: String(s),
            onChangeText: (b) => {
              const f = Number(b.replace(/[^0-9-]/g, ""));
              Number.isNaN(f) || i?.(d(f));
            },
            keyboardType: "number-pad",
            editable: !n,
            style: [
              u("body.md"),
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
          x,
          {
            onPress: m,
            disabled: n || s >= r,
            style: ({ pressed: b }) => ({
              width: 40,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: b ? a.active["tertiary-button"] : "transparent"
            }),
            children: /* @__PURE__ */ e(g, { style: [u("heading.md"), { color: a.text["high-emphasis"] }], children: "＋" })
          }
        )
      ]
    }
  );
}
function Xt({ label: s, required: i, description: o, error: r, children: t }) {
  const { theme: n, scales: a } = y();
  return /* @__PURE__ */ p(c, { style: { gap: a.spacing.scale[2] }, children: [
    s && /* @__PURE__ */ e(Je, { required: i, children: s }),
    o && !r && /* @__PURE__ */ e(g, { style: [u("body.sm"), { color: n.text["medium-emphasis"] }], children: o }),
    t,
    r && /* @__PURE__ */ e(g, { style: [u("body.sm"), { color: n.text.caution }], children: r })
  ] });
}
function qt({ tone: s = "info", title: i, description: o, children: r }) {
  const { theme: t, scales: n } = y(), a = {
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
        i && /* @__PURE__ */ e(g, { style: [u("label.md"), { color: a.fg }], children: i }),
        o && /* @__PURE__ */ e(g, { style: [u("body.sm"), { color: t.text["high-emphasis"] }], children: o }),
        r
      ]
    }
  );
}
function De({
  open: s,
  onClose: i,
  title: o,
  description: r,
  footer: t,
  children: n,
  dismissOnBackdrop: a = !0
}) {
  const { theme: l, scales: d } = y();
  return /* @__PURE__ */ e(G, { visible: s, transparent: !0, animationType: "fade", onRequestClose: i, children: /* @__PURE__ */ e(
    x,
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
        x,
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
            o && /* @__PURE__ */ e(g, { style: [u("heading.lg"), { color: l.text["high-emphasis"] }], children: o }),
            r && /* @__PURE__ */ e(g, { style: [u("body.md"), { color: l.text["medium-emphasis"] }], children: r }),
            n,
            t && /* @__PURE__ */ e(c, { style: { flexDirection: "row", justifyContent: "flex-end", gap: d.spacing.scale[2] }, children: t })
          ]
        }
      )
    }
  ) });
}
function et({
  open: s,
  onClose: i,
  title: o,
  description: r,
  confirmLabel: t = "OK",
  cancelLabel: n = "キャンセル",
  onConfirm: a,
  destructive: l = !1
}) {
  const { scales: d } = y();
  return /* @__PURE__ */ e(
    De,
    {
      open: s,
      onClose: i,
      title: o,
      description: r,
      dismissOnBackdrop: !1,
      footer: /* @__PURE__ */ p(O, { children: [
        /* @__PURE__ */ e(c, { style: { minWidth: 100 }, children: /* @__PURE__ */ e(B, { variant: "tertiary", onPress: i, children: n }) }),
        /* @__PURE__ */ e(c, { style: { minWidth: 100 }, children: /* @__PURE__ */ e(
          B,
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
function j(s) {
  const { side: i = "bottom", snapPoints: o } = s;
  return o && o.length > 0 && i === "bottom" ? /* @__PURE__ */ e(rt, { ...s }) : /* @__PURE__ */ e(tt, { ...s });
}
function tt({ open: s, onClose: i, side: o = "bottom", title: r, children: t }) {
  const { theme: n, scales: a } = y(), l = D(new I.Value(0)).current;
  te(() => {
    I.timing(l, {
      toValue: s ? 1 : 0,
      duration: 220,
      useNativeDriver: !0
    }).start();
  }, [s, l]);
  const { width: d, height: m } = K.get("window"), h = {
    bottom: { translateY: l.interpolate({ inputRange: [0, 1], outputRange: [m, 0] }) },
    top: { translateY: l.interpolate({ inputRange: [0, 1], outputRange: [-m, 0] }) },
    left: { translateX: l.interpolate({ inputRange: [0, 1], outputRange: [-d, 0] }) },
    right: { translateX: l.interpolate({ inputRange: [0, 1], outputRange: [d, 0] }) }
  }, b = {
    bottom: { justifyContent: "flex-end" },
    top: { justifyContent: "flex-start" },
    left: { alignItems: "flex-start" },
    right: { alignItems: "flex-end" }
  };
  return /* @__PURE__ */ e(G, { visible: s, transparent: !0, animationType: "none", onRequestClose: i, children: /* @__PURE__ */ e(
    x,
    {
      onPress: i,
      style: { flex: 1, backgroundColor: n.overlay.dark, ...b[o] },
      children: /* @__PURE__ */ e(
        I.View,
        {
          style: {
            transform: [
              h[o].translateX ? { translateX: h[o].translateX } : { translateX: 0 },
              h[o].translateY ? { translateY: h[o].translateY } : { translateY: 0 }
            ],
            backgroundColor: n.surface.primary,
            ...o === "bottom" || o === "top" ? { width: "100%", borderTopLeftRadius: a.borderRadius["2xl"], borderTopRightRadius: a.borderRadius["2xl"] } : { height: "100%", width: "85%" },
            padding: a.spacing.scale[4],
            gap: a.spacing.scale[3]
          },
          children: /* @__PURE__ */ p(x, { onPress: () => {
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
            r && /* @__PURE__ */ e(g, { style: [u("heading.md"), { color: n.text["high-emphasis"] }], children: r }),
            /* @__PURE__ */ e(c, { style: { marginTop: a.spacing.scale[2] }, children: t })
          ] })
        }
      )
    }
  ) });
}
const Z = 180;
function le(s, i, o) {
  return Math.max(i, Math.min(o, s));
}
function rt({
  open: s,
  onClose: i,
  title: o,
  children: r,
  snapPoints: t,
  initialSnap: n,
  footer: a,
  dismissible: l = !0
}) {
  const { theme: d, scales: m } = y(), h = ee(() => {
    const M = [...t ?? [0.55, 0.92]].map((P) => le(P, 0.1, 0.99)).sort((P, W) => P - W);
    return M.length > 0 ? M : [0.55, 0.92];
  }, [t]), b = h[0], f = h[h.length - 1], v = K.get("window").height, R = typeof globalThis < "u" && globalThis.window?.innerHeight, w = v > 0 ? v : R && R > 0 ? R : 700, C = Math.round(w * f), k = 4, T = 0.18, [J, Me] = S(0), ze = 60, se = le(n ?? b, b, f), ae = D(se), F = D(new I.Value(C)).current, U = (M, P = Z) => {
    ae.current = M, I.timing(F, {
      toValue: (f - M) * w,
      duration: P,
      easing: L.out(L.cubic),
      useNativeDriver: !0
    }).start();
  };
  te(() => {
    s ? (F.setValue(C), U(se, Z)) : I.timing(F, {
      toValue: C,
      duration: Z,
      easing: L.out(L.cubic),
      useNativeDriver: !0
    }).start();
  }, [s]);
  const ie = D(0), pe = D(se), me = D(0), Be = D(
    ue.create({
      onStartShouldSetPanResponder: () => !1,
      onMoveShouldSetPanResponder: (M, P) => {
        if (Math.abs(P.dy) < 6) return !1;
        const W = P.dy, z = ae.current === f, A = me.current <= 0;
        return z ? !!(W > 0 && A) : !0;
      },
      onPanResponderGrant: () => {
        ie.current = F._value, pe.current = ae.current;
      },
      onPanResponderMove: (M, P) => {
        let W = ie.current + P.dy;
        W < 0 && (W = Math.max(-k, W / 4));
        const z = l ? C : (f - b) * w;
        if (W > z) {
          const A = W - z;
          W = z + Math.min(k, A / 4);
        }
        F.setValue(W);
      },
      onPanResponderRelease: (M, P) => {
        const W = le(ie.current + P.dy, 0, C), z = P.dy, A = pe.current;
        if (A === f && z < 0) {
          U(f);
          return;
        }
        if (z < -20) {
          const V = h.indexOf(A), re = V >= 0 && V < h.length - 1 ? h[V + 1] : f;
          U(re);
          return;
        }
        if (z > 0) {
          if (l && A === b && z > C * T) {
            I.timing(F, {
              toValue: C,
              duration: Z,
              easing: L.out(L.cubic),
              useNativeDriver: !0
            }).start(() => i());
            return;
          }
          if (A === f) {
            const V = (f - b) * w;
            if (l && z > V + C * T) {
              I.timing(F, {
                toValue: C,
                duration: Z,
                easing: L.out(L.cubic),
                useNativeDriver: !0
              }).start(() => i());
              return;
            }
            if (z > 40) {
              U(b);
              return;
            }
          }
        }
        const be = f - W / w;
        let ye = h[0], fe = Math.abs(h[0] - be);
        for (let V = 1; V < h.length; V++) {
          const re = Math.abs(h[V] - be);
          re < fe && (fe = re, ye = h[V]);
        }
        U(ye);
      }
    })
  ).current, Ve = F.interpolate({
    inputRange: [0, C],
    outputRange: [0.4, 0],
    extrapolate: "clamp"
  });
  return /* @__PURE__ */ p(G, { visible: s, transparent: !0, animationType: "none", onRequestClose: i, children: [
    /* @__PURE__ */ e(
      I.View,
      {
        pointerEvents: s ? "auto" : "none",
        style: {
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: d.overlay.dark,
          opacity: Ve
        },
        children: /* @__PURE__ */ e(x, { onPress: l ? i : () => {
        }, style: { flex: 1 } })
      }
    ),
    /* @__PURE__ */ p(
      I.View,
      {
        ...Be.panHandlers,
        style: {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: C,
          backgroundColor: d.surface.primary,
          borderTopLeftRadius: m.borderRadius["2xl"],
          borderTopRightRadius: m.borderRadius["2xl"],
          transform: [{ translateY: F }]
        },
        children: [
          /* @__PURE__ */ p(c, { style: { paddingHorizontal: m.spacing.scale[4], paddingTop: m.spacing.scale[3] }, children: [
            /* @__PURE__ */ e(
              c,
              {
                style: {
                  width: 40,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: d.border["medium-emphasis"],
                  alignSelf: "center",
                  marginBottom: m.spacing.scale[2]
                }
              }
            ),
            o && /* @__PURE__ */ e(
              g,
              {
                style: [
                  u("heading.md"),
                  { color: d.text["high-emphasis"], marginBottom: m.spacing.scale[2] }
                ],
                children: o
              }
            )
          ] }),
          /* @__PURE__ */ e(
            H,
            {
              style: { flex: 1 },
              contentContainerStyle: {
                paddingHorizontal: m.spacing.scale[4],
                // footer 実測高 + 60px の余白を空け、コンテンツ末尾が footer に
                // 重ならない・ぶつからないようにする。
                paddingBottom: a ? J + ze : m.spacing.scale[4]
              },
              onScroll: (M) => {
                me.current = M.nativeEvent.contentOffset.y;
              },
              scrollEventThrottle: 16,
              keyboardShouldPersistTaps: "handled",
              children: r
            }
          )
        ]
      }
    ),
    a && /* @__PURE__ */ e(
      c,
      {
        pointerEvents: "box-none",
        onLayout: (M) => Me(M.nativeEvent.layout.height),
        style: {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          paddingHorizontal: m.spacing.scale[4],
          paddingTop: m.spacing.scale[3],
          paddingBottom: m.spacing.scale[4],
          borderTopWidth: 1,
          borderTopColor: d.border["low-emphasis"],
          backgroundColor: d.surface.primary
        },
        children: a
      }
    )
  ] });
}
function Gt({ breakpoint: s = 600, ...i }) {
  const { width: o } = K.get("window");
  return o <= s ? /* @__PURE__ */ p(j, { open: i.open, onClose: i.onClose, side: "bottom", title: i.title, children: [
    i.children,
    i.footer
  ] }) : /* @__PURE__ */ e(De, { ...i });
}
function nt({ open: s, onClose: i, anchor: o, children: r }) {
  const { theme: t, scales: n } = y(), [a, l] = S({ width: 200, height: 100 }), d = (b) => {
    l({ width: b.nativeEvent.layout.width, height: b.nativeEvent.layout.height });
  }, m = o ? o.y + (o.height ?? 0) + 4 : 100, h = o ? o.x : 0;
  return /* @__PURE__ */ e(G, { visible: s, transparent: !0, animationType: "fade", onRequestClose: i, children: /* @__PURE__ */ e(x, { onPress: i, style: { flex: 1 }, children: /* @__PURE__ */ e(
    c,
    {
      onLayout: d,
      style: {
        position: "absolute",
        top: m,
        left: Math.max(8, h),
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
      children: /* @__PURE__ */ e(x, { onPress: () => {
      }, children: r })
    }
  ) }) });
}
function Kt({ open: s, onClose: i, anchor: o, items: r }) {
  const { theme: t, scales: n } = y();
  return /* @__PURE__ */ e(nt, { open: s, onClose: i, anchor: o, children: /* @__PURE__ */ e(c, { style: { minWidth: 180 }, children: r.map((a, l) => /* @__PURE__ */ p(X.Fragment, { children: [
    /* @__PURE__ */ e(
      x,
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
          g,
          {
            style: [
              u("body.md"),
              { color: a.destructive ? t.text.caution : t.text["high-emphasis"] }
            ],
            children: a.label
          }
        )
      }
    ),
    l < r.length - 1 && /* @__PURE__ */ e(Y, {})
  ] }, a.key)) }) });
}
const Pe = he(null);
function Jt() {
  const s = de(Pe);
  if (!s) throw new Error("useToast は ToastProvider の内側で使ってください");
  return s;
}
let Ce = 0;
function ot() {
  return Ce += 1, `toast-${Ce}`;
}
function Ut({ children: s }) {
  const { theme: i, scales: o } = y(), [r, t] = S([]), n = xe((l) => {
    t((d) => d.filter((m) => m.id !== l));
  }, []), a = xe(
    (l) => {
      const d = ot();
      t((h) => [...h, { ...l, id: d }]);
      const m = l.duration ?? 3e3;
      return setTimeout(() => n(d), m), d;
    },
    [n]
  );
  return /* @__PURE__ */ p(Pe.Provider, { value: { show: a, dismiss: n }, children: [
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
        children: r.map((l) => /* @__PURE__ */ e(st, { toast: l, onDismiss: () => n(l.id) }, l.id))
      }
    )
  ] });
}
function st({ toast: s, onDismiss: i }) {
  const { theme: o, scales: r } = y(), t = D(new I.Value(0)).current, n = D(new I.Value(-20)).current;
  te(() => {
    I.parallel([
      I.timing(t, { toValue: 1, duration: 180, useNativeDriver: !0 }),
      I.timing(n, { toValue: 0, duration: 180, useNativeDriver: !0 })
    ]).start();
  }, [t, n]);
  const a = {
    info: { bg: o.surface.info, fg: o.text.info },
    success: { bg: o.surface.success, fg: o.text.success },
    warning: { bg: o.surface.warning, fg: o.text.warning },
    caution: { bg: o.surface.caution, fg: o.text.caution }
  }[s.tone ?? "info"];
  return /* @__PURE__ */ p(
    I.View,
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
          s.title && /* @__PURE__ */ e(g, { style: [u("label.md"), { color: a.fg }], children: s.title }),
          s.description && /* @__PURE__ */ e(g, { style: [u("body.sm"), { color: o.text["high-emphasis"] }], children: s.description })
        ] }),
        /* @__PURE__ */ e(x, { onPress: i, hitSlop: 8, children: /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: a.fg }], children: "×" }) })
      ]
    }
  );
}
function Qt({
  open: s,
  onClose: i,
  side: o = "left",
  header: r,
  sections: t,
  footer: n
}) {
  const { theme: a, scales: l } = y();
  return /* @__PURE__ */ p(j, { open: s, onClose: i, side: o, children: [
    r && /* @__PURE__ */ e(c, { style: { marginBottom: l.spacing.scale[3] }, children: r }),
    /* @__PURE__ */ e(H, { style: { maxHeight: 480 }, children: t.map((d, m) => /* @__PURE__ */ p(c, { style: { marginBottom: l.spacing.scale[3] }, children: [
      d.title && /* @__PURE__ */ e(
        g,
        {
          style: [
            u("label.xs"),
            {
              color: a.text["low-emphasis"],
              paddingHorizontal: l.spacing.scale[2],
              marginBottom: l.spacing.scale[1]
            }
          ],
          children: d.title
        }
      ),
      d.items.map((h, b) => /* @__PURE__ */ p(X.Fragment, { children: [
        /* @__PURE__ */ p(
          x,
          {
            onPress: () => {
              h.onPress?.(), i();
            },
            style: ({ pressed: f }) => ({
              flexDirection: "row",
              alignItems: "center",
              gap: l.spacing.scale[3],
              paddingHorizontal: l.spacing.scale[3],
              paddingVertical: l.spacing.scale[3],
              borderRadius: l.borderRadius.md,
              backgroundColor: h.active ? a.surface["accent-primary-light"] : f ? a.surface.secondary : "transparent"
            }),
            children: [
              h.icon,
              /* @__PURE__ */ e(
                g,
                {
                  style: [
                    u("body.md"),
                    {
                      color: h.active ? a.text["accent-primary"] : a.text["high-emphasis"]
                    }
                  ],
                  children: h.label
                }
              )
            ]
          }
        ),
        b < d.items.length - 1 && /* @__PURE__ */ e(Y, {})
      ] }, h.key))
    ] }, m)) }),
    n && /* @__PURE__ */ e(c, { style: { marginTop: l.spacing.scale[3] }, children: n })
  ] });
}
function Zt(s) {
  return /* @__PURE__ */ e(et, { ...s });
}
function er({
  open: s,
  onClose: i,
  title: o,
  description: r,
  footer: t,
  children: n
}) {
  const { theme: a, scales: l } = y();
  return /* @__PURE__ */ p(j, { open: s, onClose: i, side: "bottom", title: o, children: [
    r && /* @__PURE__ */ e(g, { style: [u("body.sm"), { color: a.text["medium-emphasis"] }], children: r }),
    /* @__PURE__ */ e(H, { style: { maxHeight: 420 }, children: /* @__PURE__ */ e(c, { style: { gap: l.spacing.scale[3], paddingVertical: l.spacing.scale[2] }, children: n }) }),
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
function tr({
  open: s,
  onClose: i,
  title: o = "レビューを投稿",
  onSubmit: r
}) {
  const { theme: t, scales: n } = y(), [a, l] = S(0), [d, m] = S("");
  return /* @__PURE__ */ p(j, { open: s, onClose: i, side: "bottom", title: o, children: [
    /* @__PURE__ */ e(c, { style: { alignItems: "center", marginVertical: n.spacing.scale[3] }, children: /* @__PURE__ */ e(oe, { value: a, onChange: l, size: 32 }) }),
    /* @__PURE__ */ e(
      Ue,
      {
        value: d,
        onChangeText: m,
        placeholder: "コメントを入力",
        minHeight: 120
      }
    ),
    /* @__PURE__ */ p(c, { style: { flexDirection: "row", gap: n.spacing.scale[2], marginTop: n.spacing.scale[3] }, children: [
      /* @__PURE__ */ e(c, { style: { flex: 1 }, children: /* @__PURE__ */ e(B, { variant: "tertiary", onPress: i, children: "キャンセル" }) }),
      /* @__PURE__ */ e(c, { style: { flex: 1 }, children: /* @__PURE__ */ e(
        B,
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
function rr({
  title: s,
  description: i,
  step: o,
  total: r,
  onNext: t,
  onSkip: n,
  nextLabel: a = "次へ",
  skipLabel: l = "スキップ"
}) {
  const { theme: d, scales: m } = y();
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
        s && /* @__PURE__ */ e(g, { style: [u("label.lg"), { color: d.text["on-inverse"] }], children: s }),
        /* @__PURE__ */ e(g, { style: [u("body.sm"), { color: d.text["on-inverse-secondary"] }], children: i }),
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
              o !== void 0 && r !== void 0 ? /* @__PURE__ */ p(g, { style: [u("label.xs"), { color: d.text["on-inverse-secondary"] }], children: [
                o,
                "/",
                r
              ] }) : /* @__PURE__ */ e(c, {}),
              /* @__PURE__ */ p(c, { style: { flexDirection: "row", gap: m.spacing.scale[2] }, children: [
                n && /* @__PURE__ */ e(c, { style: { minWidth: 80 }, children: /* @__PURE__ */ e(B, { variant: "tertiary", onPress: n, children: l }) }),
                t && /* @__PURE__ */ e(c, { style: { minWidth: 80 }, children: /* @__PURE__ */ e(B, { variant: "primary", onPress: t, children: a }) })
              ] })
            ]
          }
        )
      ]
    }
  );
}
function nr({ open: s, onClose: i, highlight: o, children: r }) {
  const { theme: t } = y(), n = t.overlay.dark;
  return /* @__PURE__ */ e(G, { visible: s, transparent: !0, animationType: "fade", onRequestClose: i, children: /* @__PURE__ */ p(x, { onPress: i, style: { flex: 1 }, children: [
    o ? /* @__PURE__ */ p(O, { children: [
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
    /* @__PURE__ */ e(c, { style: { position: "absolute", left: 0, right: 0, bottom: 80, alignItems: "center" }, children: /* @__PURE__ */ e(x, { onPress: () => {
    }, children: r }) })
  ] }) });
}
function or({
  options: s,
  value: i,
  onChange: o,
  placeholder: r = "選択",
  disabled: t = !1,
  title: n = "選択"
}) {
  const { theme: a, scales: l } = y(), [d, m] = S(!1), h = s.find((b) => b.value === i);
  return /* @__PURE__ */ p(O, { children: [
    /* @__PURE__ */ p(
      x,
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
            g,
            {
              style: [
                u("body.md"),
                { color: h ? a.text["high-emphasis"] : a.text["low-emphasis"] }
              ],
              children: h ? h.label : r
            }
          ),
          /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: a.text["low-emphasis"] }], children: "▾" })
        ]
      }
    ),
    /* @__PURE__ */ e(j, { open: d, onClose: () => m(!1), side: "bottom", title: n, children: /* @__PURE__ */ e(c, { children: s.map((b, f) => /* @__PURE__ */ p(X.Fragment, { children: [
      /* @__PURE__ */ p(
        x,
        {
          onPress: () => {
            b.disabled || (o?.(b.value), m(!1));
          },
          disabled: b.disabled,
          style: ({ pressed: v }) => ({
            paddingVertical: l.spacing.scale[3],
            paddingHorizontal: l.spacing.scale[2],
            backgroundColor: v ? a.surface.secondary : "transparent",
            opacity: b.disabled ? 0.4 : 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }),
          children: [
            /* @__PURE__ */ e(g, { style: [u("body.md"), { color: a.text["high-emphasis"] }], children: b.label }),
            i === b.value && /* @__PURE__ */ e(g, { style: [u("label.md"), { color: a.text["accent-primary"] }], children: "✓" })
          ]
        }
      ),
      f < s.length - 1 && /* @__PURE__ */ e(Y, {})
    ] }, b.value)) }) })
  ] });
}
function sr({
  options: s,
  value: i,
  onChange: o,
  placeholder: r = "選択",
  searchPlaceholder: t = "検索",
  emptyMessage: n = "該当なし",
  disabled: a = !1
}) {
  const { theme: l, scales: d } = y(), [m, h] = S(!1), [b, f] = S(""), v = s.find((w) => w.value === i), R = ee(() => {
    if (!b) return s;
    const w = b.toLowerCase();
    return s.filter((C) => C.label.toLowerCase().includes(w));
  }, [s, b]);
  return /* @__PURE__ */ p(O, { children: [
    /* @__PURE__ */ p(
      x,
      {
        onPress: () => !a && h(!0),
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
            g,
            {
              style: [
                u("body.md"),
                { color: v ? l.text["high-emphasis"] : l.text["low-emphasis"] }
              ],
              children: v ? v.label : r
            }
          ),
          /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: l.text["low-emphasis"] }], children: "▾" })
        ]
      }
    ),
    /* @__PURE__ */ p(j, { open: m, onClose: () => h(!1), side: "bottom", title: "選択", children: [
      /* @__PURE__ */ e(Te, { value: b, onChangeText: f, placeholder: t }),
      /* @__PURE__ */ e(c, { style: { height: 360, marginTop: d.spacing.scale[2] }, children: R.length === 0 ? /* @__PURE__ */ e(
        g,
        {
          style: [
            u("body.md"),
            {
              color: l.text["low-emphasis"],
              textAlign: "center",
              paddingVertical: d.spacing.scale[6]
            }
          ],
          children: n
        }
      ) : /* @__PURE__ */ e(
        _,
        {
          data: R,
          keyExtractor: (w) => w.value,
          renderItem: ({ item: w }) => /* @__PURE__ */ p(
            x,
            {
              onPress: () => {
                o?.(w.value), f(""), h(!1);
              },
              style: ({ pressed: C }) => ({
                paddingVertical: d.spacing.scale[3],
                paddingHorizontal: d.spacing.scale[2],
                backgroundColor: C ? l.surface.secondary : "transparent",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
              }),
              children: [
                /* @__PURE__ */ e(g, { style: [u("body.md"), { color: l.text["high-emphasis"] }], children: w.label }),
                i === w.value && /* @__PURE__ */ e(g, { style: [u("label.md"), { color: l.text["accent-primary"] }], children: "✓" })
              ]
            }
          )
        }
      ) })
    ] })
  ] });
}
function ar({
  options: s,
  values: i = [],
  onChange: o,
  placeholder: r = "選択",
  searchPlaceholder: t = "検索",
  disabled: n = !1
}) {
  const { theme: a, scales: l } = y(), [d, m] = S(!1), [h, b] = S(""), [f, v] = S(i), R = ee(() => {
    if (!h) return s;
    const C = h.toLowerCase();
    return s.filter((k) => k.label.toLowerCase().includes(C));
  }, [s, h]), w = i.length === 0 ? r : i.length === 1 ? s.find((C) => C.value === i[0])?.label ?? r : `${i.length}件選択中`;
  return /* @__PURE__ */ p(O, { children: [
    /* @__PURE__ */ p(
      x,
      {
        onPress: () => {
          n || (v(i), m(!0));
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
            g,
            {
              style: [
                u("body.md"),
                { color: i.length > 0 ? a.text["high-emphasis"] : a.text["low-emphasis"] }
              ],
              children: w
            }
          ),
          /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: a.text["low-emphasis"] }], children: "▾" })
        ]
      }
    ),
    /* @__PURE__ */ p(j, { open: d, onClose: () => m(!1), side: "bottom", title: "複数選択", children: [
      /* @__PURE__ */ e(Te, { value: h, onChangeText: b, placeholder: t }),
      /* @__PURE__ */ e(c, { style: { height: 320, marginTop: l.spacing.scale[2] }, children: /* @__PURE__ */ e(
        _,
        {
          data: R,
          keyExtractor: (C) => C.value,
          renderItem: ({ item: C }) => {
            const k = f.includes(C.value);
            return /* @__PURE__ */ p(
              x,
              {
                onPress: () => {
                  v(
                    (T) => T.includes(C.value) ? T.filter((J) => J !== C.value) : [...T, C.value]
                  );
                },
                style: {
                  flexDirection: "row",
                  alignItems: "center",
                  gap: l.spacing.scale[2],
                  paddingVertical: l.spacing.scale[3]
                },
                children: [
                  /* @__PURE__ */ e(ge, { checked: k }),
                  /* @__PURE__ */ e(g, { style: [u("body.md"), { color: a.text["high-emphasis"], flex: 1 }], children: C.label })
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
            /* @__PURE__ */ e(c, { style: { flex: 1 }, children: /* @__PURE__ */ e(B, { variant: "tertiary", onPress: () => m(!1), children: "キャンセル" }) }),
            /* @__PURE__ */ e(c, { style: { flex: 1 }, children: /* @__PURE__ */ e(
              B,
              {
                variant: "primary",
                onPress: () => {
                  o?.(f), m(!1);
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
function ir({ label: s, options: i, value: o, onChange: r }) {
  const { theme: t, scales: n } = y(), [a, l] = S(!1), d = i.find((h) => h.value === o), m = !!d;
  return /* @__PURE__ */ p(O, { children: [
    /* @__PURE__ */ p(
      x,
      {
        onPress: () => l(!0),
        style: ({ pressed: h }) => ({
          flexDirection: "row",
          alignItems: "center",
          gap: n.spacing.scale[1],
          paddingVertical: n.spacing.scale[2],
          paddingHorizontal: n.spacing.scale[3],
          borderRadius: n.borderRadius.full,
          borderWidth: 1,
          borderColor: m ? t.border["accent-primary"] : t.border["medium-emphasis"],
          backgroundColor: m ? t.surface["accent-primary-light"] : h ? t.surface.secondary : t.surface.primary
        }),
        children: [
          /* @__PURE__ */ p(
            g,
            {
              style: [
                u("label.sm"),
                { color: m ? t.text["accent-primary"] : t.text["high-emphasis"] }
              ],
              children: [
                s,
                d ? `: ${d.label}` : ""
              ]
            }
          ),
          /* @__PURE__ */ e(
            g,
            {
              style: [
                u("label.xs"),
                { color: m ? t.text["accent-primary"] : t.text["low-emphasis"] }
              ],
              children: "▾"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ e(j, { open: a, onClose: () => l(!1), side: "bottom", title: s, children: /* @__PURE__ */ p(c, { children: [
      /* @__PURE__ */ e(
        x,
        {
          onPress: () => {
            r?.(void 0), l(!1);
          },
          style: ({ pressed: h }) => ({
            paddingVertical: n.spacing.scale[3],
            backgroundColor: h ? t.surface.secondary : "transparent"
          }),
          children: /* @__PURE__ */ e(g, { style: [u("body.md"), { color: t.text["medium-emphasis"] }], children: "すべて" })
        }
      ),
      /* @__PURE__ */ e(Y, {}),
      i.map((h, b) => /* @__PURE__ */ p(X.Fragment, { children: [
        /* @__PURE__ */ p(
          x,
          {
            onPress: () => {
              r?.(h.value), l(!1);
            },
            style: ({ pressed: f }) => ({
              paddingVertical: n.spacing.scale[3],
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: f ? t.surface.secondary : "transparent"
            }),
            children: [
              /* @__PURE__ */ e(g, { style: [u("body.md"), { color: t.text["high-emphasis"] }], children: h.label }),
              /* @__PURE__ */ p(c, { style: { flexDirection: "row", alignItems: "center", gap: 8 }, children: [
                h.count !== void 0 && /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: t.text["low-emphasis"] }], children: h.count }),
                o === h.value && /* @__PURE__ */ e(g, { style: [u("label.md"), { color: t.text["accent-primary"] }], children: "✓" })
              ] })
            ]
          }
        ),
        b < i.length - 1 && /* @__PURE__ */ e(Y, {})
      ] }, h.value))
    ] }) })
  ] });
}
function lr({ options: s, value: i, onChange: o, disabled: r = !1 }) {
  const { theme: t, scales: n } = y();
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
          x,
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
                g,
                {
                  style: [
                    u("label.sm"),
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
                    g,
                    {
                      style: [
                        u("label.xs"),
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
const We = he(null);
function He() {
  const s = de(We);
  if (!s) throw new Error("Tabs の内側で使ってください");
  return s;
}
function cr({ value: s, onChange: i, children: o }) {
  return /* @__PURE__ */ e(We.Provider, { value: { value: s, onChange: i }, children: o });
}
function dr({ scrollable: s = !1, children: i }) {
  const { theme: o, scales: r } = y(), t = /* @__PURE__ */ e(
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
  return s ? /* @__PURE__ */ e(H, { horizontal: !0, showsHorizontalScrollIndicator: !1, children: t }) : t;
}
function hr({ value: s, children: i, disabled: o }) {
  const { theme: r, scales: t } = y(), n = He(), a = n.value === s;
  return /* @__PURE__ */ e(
    x,
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
        g,
        {
          style: [
            u("label.md"),
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
function ur({ value: s, children: i }) {
  return He().value !== s ? null : /* @__PURE__ */ e(c, { children: i });
}
const at = ["日", "月", "火", "水", "木", "金", "土"], it = ["S", "M", "T", "W", "T", "F", "S"], lt = [
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
function ct(s) {
  return new Date(s.getFullYear(), s.getMonth(), 1);
}
function dt(s) {
  return new Date(s.getFullYear(), s.getMonth() + 1, 0).getDate();
}
function Re(s, i) {
  return s.getFullYear() === i.getFullYear() && s.getMonth() === i.getMonth() && s.getDate() === i.getDate();
}
function ht({ value: s, onChange: i, minDate: o, maxDate: r, locale: t = "ja" }) {
  const { theme: n, scales: a } = y(), [l, d] = S(s ?? /* @__PURE__ */ new Date()), m = t === "ja" ? at : it, h = ee(() => {
    const w = ct(l).getDay(), C = dt(l), k = [];
    for (let T = 0; T < w; T++) k.push(null);
    for (let T = 1; T <= C; T++) k.push(new Date(l.getFullYear(), l.getMonth(), T));
    for (; k.length % 7 !== 0; ) k.push(null);
    return k;
  }, [l]), b = t === "ja" ? `${l.getFullYear()}年 ${lt[l.getMonth()]}` : `${l.getFullYear()}-${String(l.getMonth() + 1).padStart(2, "0")}`, f = () => d((R) => new Date(R.getFullYear(), R.getMonth() - 1, 1)), v = () => d((R) => new Date(R.getFullYear(), R.getMonth() + 1, 1));
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
          /* @__PURE__ */ e(x, { onPress: f, hitSlop: 8, children: /* @__PURE__ */ e(g, { style: [u("label.lg"), { color: n.text["medium-emphasis"] }], children: "‹" }) }),
          /* @__PURE__ */ e(g, { style: [u("label.md"), { color: n.text["high-emphasis"] }], children: b }),
          /* @__PURE__ */ e(x, { onPress: v, hitSlop: 8, children: /* @__PURE__ */ e(g, { style: [u("label.lg"), { color: n.text["medium-emphasis"] }], children: "›" }) })
        ] }),
        /* @__PURE__ */ e(c, { style: { flexDirection: "row" }, children: m.map((R, w) => /* @__PURE__ */ e(c, { style: { flex: 1, alignItems: "center" }, children: /* @__PURE__ */ e(g, { style: [u("label.xs"), { color: n.text["low-emphasis"] }], children: R }) }, w)) }),
        /* @__PURE__ */ e(c, { style: { flexDirection: "row", flexWrap: "wrap" }, children: h.map((R, w) => {
          if (!R) return /* @__PURE__ */ e(c, { style: { width: `${100 / 7}%`, aspectRatio: 1 } }, w);
          const C = o && R < new Date(o.getFullYear(), o.getMonth(), o.getDate()) || r && R > new Date(r.getFullYear(), r.getMonth(), r.getDate()), k = s && Re(R, s), T = Re(R, /* @__PURE__ */ new Date());
          return /* @__PURE__ */ e(c, { style: { width: `${100 / 7}%`, aspectRatio: 1, padding: 2 }, children: /* @__PURE__ */ e(
            x,
            {
              onPress: () => !C && i?.(R),
              disabled: !!C,
              style: {
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: a.borderRadius.full,
                backgroundColor: k ? n.brand.primary : "transparent",
                borderWidth: T && !k ? 1 : 0,
                borderColor: n.border["accent-primary"],
                opacity: C ? 0.3 : 1
              },
              children: /* @__PURE__ */ e(
                g,
                {
                  style: [
                    u("body.sm"),
                    {
                      color: k ? n.text["on-inverse"] : n.text["high-emphasis"],
                      fontWeight: k || T ? "700" : "400"
                    }
                  ],
                  children: R.getDate()
                }
              )
            }
          ) }, w);
        }) })
      ]
    }
  );
}
function ut(s) {
  return `${s.getFullYear()}/${String(s.getMonth() + 1).padStart(2, "0")}/${String(s.getDate()).padStart(2, "0")}`;
}
function gr({
  value: s,
  onChange: i,
  placeholder: o = "日付を選択",
  minDate: r,
  maxDate: t,
  disabled: n = !1,
  formatter: a = ut
}) {
  const { theme: l, scales: d } = y(), [m, h] = S(!1), [b, f] = S(s);
  return /* @__PURE__ */ p(O, { children: [
    /* @__PURE__ */ p(
      x,
      {
        onPress: () => {
          n || (f(s), h(!0));
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
            g,
            {
              style: [
                u("body.md"),
                { color: s ? l.text["high-emphasis"] : l.text["low-emphasis"] }
              ],
              children: s ? a(s) : o
            }
          ),
          /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: l.text["low-emphasis"] }], children: "📅" })
        ]
      }
    ),
    /* @__PURE__ */ p(j, { open: m, onClose: () => h(!1), side: "bottom", title: "日付を選択", children: [
      /* @__PURE__ */ e(ht, { value: b, onChange: f, minDate: r, maxDate: t }),
      /* @__PURE__ */ p(
        c,
        {
          style: {
            flexDirection: "row",
            gap: d.spacing.scale[2],
            marginTop: d.spacing.scale[3]
          },
          children: [
            /* @__PURE__ */ e(c, { style: { flex: 1 }, children: /* @__PURE__ */ e(B, { variant: "tertiary", onPress: () => h(!1), children: "キャンセル" }) }),
            /* @__PURE__ */ e(c, { style: { flex: 1 }, children: /* @__PURE__ */ e(
              B,
              {
                variant: "primary",
                disabled: !b,
                onPress: () => {
                  b && i?.(b), h(!1);
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
function ne(s) {
  return s.toString().padStart(2, "0");
}
function pr({
  value: s,
  onChange: i,
  placeholder: o = "時刻を選択",
  minuteStep: r = 5,
  disabled: t = !1
}) {
  const { theme: n, scales: a } = y(), [l, d] = S(!1), [m, h] = S(s?.hour ?? 9), [b, f] = S(s?.minute ?? 0), v = Array.from({ length: 24 }, (w, C) => C), R = Array.from({ length: 60 / r }, (w, C) => C * r);
  return /* @__PURE__ */ p(O, { children: [
    /* @__PURE__ */ p(
      x,
      {
        onPress: () => {
          t || (h(s?.hour ?? 9), f(s?.minute ?? 0), d(!0));
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
            g,
            {
              style: [
                u("body.md"),
                { color: s ? n.text["high-emphasis"] : n.text["low-emphasis"] }
              ],
              children: s ? `${ne(s.hour)}:${ne(s.minute)}` : o
            }
          ),
          /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: n.text["low-emphasis"] }], children: "🕐" })
        ]
      }
    ),
    /* @__PURE__ */ p(j, { open: l, onClose: () => d(!1), side: "bottom", title: "時刻を選択", children: [
      /* @__PURE__ */ p(c, { style: { flexDirection: "row", height: 220, gap: a.spacing.scale[3] }, children: [
        /* @__PURE__ */ e(H, { style: { flex: 1 }, showsVerticalScrollIndicator: !1, children: v.map((w) => /* @__PURE__ */ e(
          x,
          {
            onPress: () => h(w),
            style: {
              paddingVertical: a.spacing.scale[2],
              alignItems: "center",
              backgroundColor: m === w ? n.surface["accent-primary-light"] : "transparent",
              borderRadius: a.borderRadius.sm
            },
            children: /* @__PURE__ */ e(
              g,
              {
                style: [
                  u("body.lg"),
                  {
                    color: m === w ? n.text["accent-primary"] : n.text["high-emphasis"],
                    fontWeight: m === w ? "700" : "400"
                  }
                ],
                children: ne(w)
              }
            )
          },
          w
        )) }),
        /* @__PURE__ */ e(H, { style: { flex: 1 }, showsVerticalScrollIndicator: !1, children: R.map((w) => /* @__PURE__ */ e(
          x,
          {
            onPress: () => f(w),
            style: {
              paddingVertical: a.spacing.scale[2],
              alignItems: "center",
              backgroundColor: b === w ? n.surface["accent-primary-light"] : "transparent",
              borderRadius: a.borderRadius.sm
            },
            children: /* @__PURE__ */ e(
              g,
              {
                style: [
                  u("body.lg"),
                  {
                    color: b === w ? n.text["accent-primary"] : n.text["high-emphasis"],
                    fontWeight: b === w ? "700" : "400"
                  }
                ],
                children: ne(w)
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
            /* @__PURE__ */ e(c, { style: { flex: 1 }, children: /* @__PURE__ */ e(B, { variant: "tertiary", onPress: () => d(!1), children: "キャンセル" }) }),
            /* @__PURE__ */ e(c, { style: { flex: 1 }, children: /* @__PURE__ */ e(
              B,
              {
                variant: "primary",
                onPress: () => {
                  i?.({ hour: m, minute: b }), d(!1);
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
function mr({ items: s, type: i = "single", defaultOpenKeys: o = [] }) {
  const { theme: r, scales: t } = y(), [n, a] = S(new Set(o)), l = (d) => {
    a((m) => {
      const h = new Set(i === "multiple" ? m : []);
      return m.has(d) ? h.delete(d) : h.add(d), h;
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
        const h = n.has(d.key);
        return /* @__PURE__ */ p(
          c,
          {
            style: {
              borderTopWidth: m === 0 ? 0 : 1,
              borderTopColor: r.border["low-emphasis"]
            },
            children: [
              /* @__PURE__ */ p(
                x,
                {
                  onPress: () => l(d.key),
                  style: ({ pressed: b }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: t.spacing.scale[4],
                    backgroundColor: b ? r.surface.secondary : "transparent"
                  }),
                  children: [
                    /* @__PURE__ */ e(g, { style: [u("label.md"), { color: r.text["high-emphasis"], flex: 1 }], children: d.title }),
                    /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: r.text["low-emphasis"] }], children: h ? "▾" : "▸" })
                  ]
                }
              ),
              h && /* @__PURE__ */ e(
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
function br({ title: s, defaultOpen: i = !1, children: o }) {
  const { theme: r, scales: t } = y(), [n, a] = S(i);
  return /* @__PURE__ */ p(c, { children: [
    /* @__PURE__ */ p(
      x,
      {
        onPress: () => a((l) => !l),
        style: {
          flexDirection: "row",
          alignItems: "center",
          gap: t.spacing.scale[1]
        },
        children: [
          /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: r.text["accent-primary"] }], children: n ? "▾" : "▸" }),
          /* @__PURE__ */ e(g, { style: [u("label.md"), { color: r.text["accent-primary"] }], children: s })
        ]
      }
    ),
    n && /* @__PURE__ */ e(c, { style: { marginTop: t.spacing.scale[2] }, children: o })
  ] });
}
function yr({ maxHeight: s, bordered: i, children: o, ...r }) {
  const { theme: t, scales: n } = y();
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
      children: /* @__PURE__ */ e(H, { ...r, children: o })
    }
  );
}
function gt(s, i) {
  const o = [];
  for (let r = s; r <= i; r++) o.push(r);
  return o;
}
function fr({ page: s, total: i, onChange: o, windowSize: r = 5 }) {
  const { theme: t, scales: n } = y(), a = Math.floor(r / 2);
  let l = Math.max(1, s - a), d = Math.min(i, l + r - 1);
  d - l + 1 < r && (l = Math.max(1, d - r + 1));
  const m = gt(l, d), h = (b, f, v = !1, R = !1) => /* @__PURE__ */ e(
    x,
    {
      onPress: () => f && !v && o?.(f),
      disabled: v || !f,
      style: ({ pressed: w }) => ({
        minWidth: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: n.borderRadius.md,
        backgroundColor: R ? t.brand.primary : w ? t.active["tertiary-button"] : t.surface.primary,
        borderWidth: R ? 0 : 1,
        borderColor: t.border["low-emphasis"],
        opacity: v ? 0.4 : 1,
        paddingHorizontal: n.spacing.scale[2]
      }),
      children: /* @__PURE__ */ e(
        g,
        {
          style: [
            u("label.sm"),
            { color: R ? t.text["on-inverse"] : t.text["high-emphasis"] }
          ],
          children: b
        }
      )
    },
    b
  );
  return /* @__PURE__ */ p(c, { style: { flexDirection: "row", gap: n.spacing.scale[1], alignSelf: "center" }, children: [
    h("‹", s > 1 ? s - 1 : null, s <= 1),
    l > 1 && h("1", 1),
    l > 2 && h("…", null, !0),
    m.map((b) => h(String(b), b, !1, b === s)),
    d < i - 1 && h("…", null, !0),
    d < i && h(String(i), i),
    h("›", s < i ? s + 1 : null, s >= i)
  ] });
}
function xr({ page: s, total: i, onChange: o }) {
  const { theme: r, scales: t } = y(), n = (a, l, d) => /* @__PURE__ */ e(
    x,
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
      children: /* @__PURE__ */ e(g, { style: [u("label.md"), { color: r.text["high-emphasis"] }], children: a })
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
        /* @__PURE__ */ p(g, { style: [u("label.md"), { color: r.text["medium-emphasis"] }], children: [
          s,
          " / ",
          i
        ] }),
        n("›", s + 1, s >= i)
      ]
    }
  );
}
function pt({ items: s, value: i, onChange: o }) {
  const { theme: r, scales: t } = y();
  return /* @__PURE__ */ e(
    c,
    {
      style: {
        flexDirection: "row",
        backgroundColor: r.surface.primary,
        borderTopWidth: 1,
        borderTopColor: r.border["low-emphasis"],
        paddingBottom: $.OS === "ios" ? 24 : 0
      },
      children: s.map((n) => {
        const a = i === n.key;
        return /* @__PURE__ */ p(
          x,
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
                    children: /* @__PURE__ */ e(g, { style: [u("label.xs"), { color: r.text["on-inverse"] }], children: n.badge > 99 ? "99+" : n.badge })
                  }
                )
              ] }),
              /* @__PURE__ */ e(
                g,
                {
                  style: [
                    u("label.xs"),
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
function wr({ items: s, value: i, onChange: o }) {
  const { theme: r, scales: t } = y();
  return /* @__PURE__ */ e(
    H,
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
          x,
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
                g,
                {
                  style: [
                    u("label.md"),
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
                    g,
                    {
                      style: [
                        u("label.xs"),
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
function Cr({ title: s, onBack: i, backLabel: o = "戻る", rightSlot: r }) {
  const { theme: t, scales: n } = y();
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
            x,
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
                /* @__PURE__ */ e(g, { style: [u("label.md"), { color: t.text["accent-primary"] }], children: "‹" }),
                /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: t.text["accent-primary"] }], children: o })
              ]
            }
          ),
          /* @__PURE__ */ e(
            g,
            {
              numberOfLines: 1,
              style: [u("heading.md"), { color: t.text["high-emphasis"], flex: 1 }],
              children: s
            }
          )
        ] }),
        r
      ]
    }
  );
}
function Rr({ title: s, subtitle: i, leading: o, trailing: r, onBack: t, centered: n = !0 }) {
  const { theme: a, scales: l } = y(), d = o ?? (t ? /* @__PURE__ */ e(
    x,
    {
      onPress: t,
      hitSlop: 8,
      style: ({ pressed: m }) => ({
        padding: l.spacing.scale[1],
        borderRadius: l.borderRadius.md,
        backgroundColor: m ? a.surface.secondary : "transparent"
      }),
      children: /* @__PURE__ */ e(g, { style: [u("heading.lg"), { color: a.text["high-emphasis"] }], children: "‹" })
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
        paddingTop: $.OS === "ios" ? 48 : l.spacing.scale[3],
        paddingBottom: l.spacing.scale[3],
        backgroundColor: a.surface.primary,
        borderBottomWidth: 1,
        borderBottomColor: a.border["low-emphasis"]
      },
      children: [
        /* @__PURE__ */ e(c, { style: { width: 44, alignItems: "flex-start" }, children: d }),
        /* @__PURE__ */ p(c, { style: { flex: 1, alignItems: n ? "center" : "flex-start" }, children: [
          s && /* @__PURE__ */ e(
            g,
            {
              numberOfLines: 1,
              style: [u("heading.md"), { color: a.text["high-emphasis"] }],
              children: s
            }
          ),
          i && /* @__PURE__ */ e(
            g,
            {
              numberOfLines: 1,
              style: [u("body.sm"), { color: a.text["medium-emphasis"] }],
              children: i
            }
          )
        ] }),
        /* @__PURE__ */ e(c, { style: { minWidth: 44, alignItems: "flex-end" }, children: r })
      ]
    }
  );
}
function mt({ title: s, description: i, image: o, onPress: r, tone: t = "neutral", height: n = 140 }) {
  const { theme: a, scales: l } = y(), d = {
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
          N,
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
                g,
                {
                  style: [
                    u("heading.lg"),
                    { color: o ? a.text["on-inverse"] : d.fg }
                  ],
                  children: s
                }
              ),
              i && /* @__PURE__ */ e(
                g,
                {
                  style: [
                    u("body.sm"),
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
  return r ? /* @__PURE__ */ e(x, { onPress: r, children: m }) : m;
}
function vr({
  banners: s,
  itemWidth: i,
  height: o = 160,
  showIndicator: r = !0
}) {
  const { theme: t, scales: n } = y(), [a, l] = S(0), d = i ?? K.get("window").width - 32, m = D(null), h = (b) => {
    const f = b.nativeEvent.contentOffset.x, v = Math.round(f / (d + n.spacing.scale[2]));
    v !== a && l(v);
  };
  return /* @__PURE__ */ p(c, { style: { gap: n.spacing.scale[2] }, children: [
    /* @__PURE__ */ e(
      _,
      {
        ref: m,
        data: s,
        horizontal: !0,
        showsHorizontalScrollIndicator: !1,
        snapToInterval: d + n.spacing.scale[2],
        decelerationRate: "fast",
        onScroll: h,
        scrollEventThrottle: 16,
        keyExtractor: (b, f) => String(f),
        contentContainerStyle: { paddingHorizontal: n.spacing.scale[4], gap: n.spacing.scale[2] },
        renderItem: ({ item: b }) => /* @__PURE__ */ e(c, { style: { width: d, height: o }, children: /* @__PURE__ */ e(mt, { ...b, height: o }) })
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
        children: s.map((b, f) => /* @__PURE__ */ e(
          c,
          {
            style: {
              width: f === a ? 16 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: f === a ? t.brand.primary : t.surface.tertiary
            }
          },
          f
        ))
      }
    )
  ] });
}
function kr({
  value: s,
  onChange: i,
  placeholder: o = "検索",
  onSubmit: r,
  onClear: t,
  autoFocus: n
}) {
  const { theme: a, scales: l } = y();
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
        /* @__PURE__ */ e(g, { style: [u("label.md"), { color: a.text["low-emphasis"] }], children: "🔍" }),
        /* @__PURE__ */ e(
          q,
          {
            value: s,
            onChangeText: i,
            onSubmitEditing: r,
            placeholder: o,
            placeholderTextColor: a.text["low-emphasis"],
            returnKeyType: "search",
            autoFocus: n,
            style: [
              u("body.md"),
              { flex: 1, color: a.text["high-emphasis"], paddingVertical: 0 }
            ]
          }
        ),
        s.length > 0 && /* @__PURE__ */ e(
          x,
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
                children: /* @__PURE__ */ e(g, { style: [u("label.xs"), { color: a.text["medium-emphasis"] }], children: "×" })
              }
            )
          }
        )
      ]
    }
  );
}
function Sr({
  leading: s,
  title: i,
  description: o,
  trailing: r,
  showChevron: t,
  onPress: n,
  disabled: a
}) {
  const { theme: l, scales: d } = y(), m = (h = !1) => /* @__PURE__ */ p(
    c,
    {
      style: {
        flexDirection: "row",
        alignItems: "center",
        gap: d.spacing.scale[3],
        paddingHorizontal: d.spacing.scale[4],
        paddingVertical: d.spacing.scale[3],
        backgroundColor: h ? l.surface.secondary : l.surface.primary,
        opacity: a ? 0.5 : 1
      },
      children: [
        s,
        /* @__PURE__ */ p(c, { style: { flex: 1, gap: 2 }, children: [
          typeof i == "string" ? /* @__PURE__ */ e(g, { style: [u("body.md"), { color: l.text["high-emphasis"] }], children: i }) : i,
          o && typeof o == "string" ? /* @__PURE__ */ e(g, { style: [u("body.sm"), { color: l.text["medium-emphasis"] }], children: o }) : o
        ] }),
        r,
        t && /* @__PURE__ */ e(g, { style: [u("label.md"), { color: l.text["low-emphasis"] }], children: "›" })
      ]
    }
  );
  return n ? /* @__PURE__ */ e(x, { disabled: a, onPress: n, children: ({ pressed: h }) => m(h) }) : m(!1);
}
function Ir({ title: s, description: i, icon: o, action: r }) {
  const { theme: t, scales: n } = y();
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
            children: /* @__PURE__ */ e(g, { style: { fontSize: 28, color: t.text["low-emphasis"] }, children: "📭" })
          }
        ),
        /* @__PURE__ */ e(
          g,
          {
            style: [u("heading.md"), { color: t.text["high-emphasis"], textAlign: "center" }],
            children: s
          }
        ),
        i && /* @__PURE__ */ e(
          g,
          {
            style: [u("body.md"), { color: t.text["medium-emphasis"], textAlign: "center" }],
            children: i
          }
        ),
        r
      ]
    }
  );
}
function Tr({
  title: s = "エラーが発生しました",
  description: i = "時間をおいて再度お試しください。",
  icon: o,
  action: r
}) {
  const { theme: t, scales: n } = y();
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
            children: /* @__PURE__ */ e(g, { style: { fontSize: 28, color: t.text.caution }, children: "!" })
          }
        ),
        /* @__PURE__ */ e(
          g,
          {
            style: [u("heading.md"), { color: t.text["high-emphasis"], textAlign: "center" }],
            children: s
          }
        ),
        /* @__PURE__ */ e(
          g,
          {
            style: [u("body.md"), { color: t.text["medium-emphasis"], textAlign: "center" }],
            children: i
          }
        ),
        r
      ]
    }
  );
}
function bt({ title: s, description: i, action: o, variant: r = "default" }) {
  const { theme: t, scales: n } = y();
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
            g,
            {
              style: [
                u(r === "subtle" ? "label.md" : "heading.md"),
                { color: t.text["high-emphasis"] }
              ],
              children: s
            }
          ),
          i && /* @__PURE__ */ e(
            g,
            {
              style: [u("body.sm"), { color: t.text["medium-emphasis"], marginTop: 2 }],
              children: i
            }
          )
        ] }),
        o && /* @__PURE__ */ e(x, { onPress: o.onPress, hitSlop: 8, children: /* @__PURE__ */ p(g, { style: [u("label.sm"), { color: t.text["accent-primary"] }], children: [
          o.label,
          " ›"
        ] }) })
      ]
    }
  );
}
function Dr({ children: s }) {
  const { theme: i, scales: o } = y();
  return /* @__PURE__ */ e(
    c,
    {
      style: {
        flexDirection: "row",
        gap: o.spacing.scale[2],
        padding: o.spacing.scale[4],
        paddingBottom: $.OS === "ios" ? 32 : o.spacing.scale[4],
        backgroundColor: i.surface.primary,
        borderTopWidth: 1,
        borderTopColor: i.border["low-emphasis"]
      },
      children: s
    }
  );
}
function Pr({ rightActions: s = [], actionWidth: i = 80, children: o }) {
  const { theme: r } = y(), t = D(new I.Value(0)).current, n = s.length * i, a = D(
    ue.create({
      onMoveShouldSetPanResponder: (l, d) => Math.abs(d.dx) > 8,
      onPanResponderMove: (l, d) => {
        const m = Math.min(0, Math.max(-n, d.dx));
        t.setValue(m);
      },
      onPanResponderRelease: (l, d) => {
        const m = d.dx < -n / 2;
        I.spring(t, {
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
          x,
          {
            onPress: () => {
              I.spring(t, { toValue: 0, useNativeDriver: !0 }).start(), l.onPress();
            },
            style: {
              width: i,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: l.color ?? r.caution.base
            },
            children: /* @__PURE__ */ e(g, { style: [u("label.md"), { color: l.textColor ?? r.text["on-inverse"] }], children: l.label })
          },
          d
        ))
      }
    ),
    /* @__PURE__ */ e(
      I.View,
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
function Wr({ copyright: s, links: i = [] }) {
  const { theme: o, scales: r } = y();
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
            children: i.map((t, n) => /* @__PURE__ */ e(x, { onPress: t.onPress, children: /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: o.text["medium-emphasis"] }], children: t.label }) }, n))
          }
        ),
        s && /* @__PURE__ */ e(g, { style: [u("body.sm"), { color: o.text["low-emphasis"] }], children: s })
      ]
    }
  );
}
function Hr({
  title: s = "ファイルを選択",
  description: i = "タップしてアップロード",
  onPress: o,
  disabled: r = !1
}) {
  const { theme: t, scales: n } = y();
  return /* @__PURE__ */ p(
    x,
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
        /* @__PURE__ */ e(g, { style: { fontSize: 28, color: t.text["low-emphasis"] }, children: "📤" }),
        /* @__PURE__ */ e(g, { style: [u("label.md"), { color: t.text["high-emphasis"] }], children: s }),
        /* @__PURE__ */ e(g, { style: [u("body.sm"), { color: t.text["medium-emphasis"] }], children: i })
      ]
    }
  );
}
function Mr({
  options: s,
  values: i = [],
  onChange: o,
  multiple: r = !0
}) {
  const { scales: t } = y(), n = (a) => {
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
        Ie,
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
function zr({ items: s, value: i, onChange: o }) {
  const { theme: r, scales: t } = y();
  return /* @__PURE__ */ e(
    H,
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
          x,
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
                g,
                {
                  numberOfLines: 1,
                  style: [
                    u("label.xs"),
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
function Br({ items: s, value: i, onChange: o }) {
  const { theme: r, scales: t } = y();
  return /* @__PURE__ */ e(
    H,
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
          x,
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
                g,
                {
                  style: [
                    u("label.sm"),
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
                    g,
                    {
                      style: [
                        u("label.xs"),
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
function Vr({ steps: s, current: i }) {
  const { theme: o, scales: r } = y();
  return /* @__PURE__ */ e(c, { style: { flexDirection: "row", alignItems: "flex-start", gap: 0 }, children: s.map((t, n) => {
    const a = n < i, l = n === i, d = a || l;
    return /* @__PURE__ */ p(X.Fragment, { children: [
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
              g,
              {
                style: [
                  u("label.xs"),
                  { color: d ? o.text["on-inverse"] : o.text["medium-emphasis"], fontWeight: "700" }
                ],
                children: a ? "✓" : n + 1
              }
            )
          }
        ),
        /* @__PURE__ */ e(
          g,
          {
            style: [
              u("label.xs"),
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
function jr({ value: s = [], onChange: i, placeholder: o = "タグを入力", maxTags: r = 10 }) {
  const { theme: t, scales: n } = y(), [a, l] = S(""), d = () => {
    const h = a.trim();
    if (h) {
      if (s.includes(h)) {
        l("");
        return;
      }
      s.length >= r || (i?.([...s, h]), l(""));
    }
  }, m = (h) => {
    i?.(s.filter((b) => b !== h));
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
        s.map((h) => /* @__PURE__ */ p(
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
              /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: t.text["accent-primary"] }], children: h }),
              /* @__PURE__ */ e(x, { onPress: () => m(h), hitSlop: 6, children: /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: t.text["accent-primary"] }], children: "×" }) })
            ]
          },
          h
        )),
        /* @__PURE__ */ e(
          q,
          {
            value: a,
            onChangeText: l,
            onSubmitEditing: d,
            onBlur: d,
            placeholder: s.length === 0 ? o : "",
            placeholderTextColor: t.text["low-emphasis"],
            returnKeyType: "done",
            style: [
              u("body.md"),
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
function Fr({ message: s, url: i, title: o, extra: r = [] }) {
  const { theme: t, scales: n } = y(), l = [
    { label: "共有", onPress: async () => {
      try {
        await Ee.share({ message: [s, i].filter(Boolean).join(" "), title: o, url: i });
      } catch {
      }
    } },
    ...r
  ];
  return /* @__PURE__ */ e(c, { style: { flexDirection: "row", flexWrap: "wrap", gap: n.spacing.scale[2] }, children: l.map((d, m) => /* @__PURE__ */ e(
    x,
    {
      onPress: d.onPress,
      style: ({ pressed: h }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: n.spacing.scale[1],
        paddingHorizontal: n.spacing.scale[3],
        height: 40,
        borderRadius: n.borderRadius.full,
        backgroundColor: h ? t.active["secondary-button"] : t.surface["accent-primary-light"]
      }),
      children: /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: t.text["accent-primary"] }], children: d.label })
    },
    m
  )) });
}
function Er(s) {
  return /* @__PURE__ */ e(Ie, { ...s, shape: "pill", variant: "filled" });
}
function Or({ images: s, initialIndex: i = 0, thumbnailSize: o = 80 }) {
  const { theme: r, scales: t } = y(), [n, a] = S({ open: !1, index: i }), l = K.get("window").width;
  return /* @__PURE__ */ p(O, { children: [
    /* @__PURE__ */ e(
      _,
      {
        data: s,
        horizontal: !0,
        showsHorizontalScrollIndicator: !1,
        contentContainerStyle: { gap: t.spacing.scale[2] },
        keyExtractor: (d, m) => String(m),
        renderItem: ({ item: d, index: m }) => /* @__PURE__ */ e(x, { onPress: () => a({ open: !0, index: m }), children: /* @__PURE__ */ e(
          N,
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
      G,
      {
        visible: n.open,
        transparent: !0,
        animationType: "fade",
        onRequestClose: () => a({ ...n, open: !1 }),
        children: /* @__PURE__ */ p(c, { style: { flex: 1, backgroundColor: r.surface.inverse }, children: [
          /* @__PURE__ */ e(
            x,
            {
              onPress: () => a({ ...n, open: !1 }),
              style: { position: "absolute", top: 48, right: 16, zIndex: 1, padding: 8 },
              children: /* @__PURE__ */ e(g, { style: [u("heading.lg"), { color: r.text["on-inverse"] }], children: "×" })
            }
          ),
          /* @__PURE__ */ e(
            _,
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
                m !== n.index && a((h) => ({ ...h, index: m }));
              },
              scrollEventThrottle: 32,
              renderItem: ({ item: d }) => /* @__PURE__ */ e(c, { style: { width: l, alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ e(
                N,
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
              children: /* @__PURE__ */ p(g, { style: [u("label.md"), { color: r.text["on-inverse"] }], children: [
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
const yt = {
  google: "Google でログイン",
  apple: "Apple でログイン",
  line: "LINE でログイン",
  amazon: "Amazon でログイン",
  github: "GitHub でログイン",
  x: "X でログイン"
};
function Ar({
  provider: s,
  label: i,
  onPress: o,
  disabled: r = !1
}) {
  const { theme: t, scales: n } = y(), a = n.brandExternal, l = {
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
    x,
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
      children: /* @__PURE__ */ e(c, { style: { flexDirection: "row", alignItems: "center", gap: n.spacing.scale[2] }, children: /* @__PURE__ */ e(g, { style: [u("label.md"), { color: l.fg }], children: i ?? yt[s] }) })
    }
  );
}
const ft = {
  x: { color: "#000000", letter: "X" },
  instagram: { color: "#E4405F", letter: "IG" },
  youtube: { color: "#FF0000", letter: "YT" },
  tiktok: { color: "#000000", letter: "TT" },
  facebook: { color: "#1877F2", letter: "f" },
  line: { color: "#06C755", letter: "L" }
};
function Lr({ brand: s, size: i = 24 }) {
  const { theme: o } = y(), r = ft[s];
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
        g,
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
function _r({ count: s = 3, variant: i = "row" }) {
  const { scales: o } = y();
  return /* @__PURE__ */ e(c, { style: { gap: o.spacing.scale[3] }, children: Array.from({ length: s }).map((r, t) => i === "card" ? /* @__PURE__ */ p(c, { style: { gap: o.spacing.scale[2] }, children: [
    /* @__PURE__ */ e(E, { height: 140, radius: o.borderRadius.lg }),
    /* @__PURE__ */ e(E, { height: 14, width: "60%" }),
    /* @__PURE__ */ e(E, { height: 12, width: "40%" })
  ] }, t) : i === "list" ? /* @__PURE__ */ p(c, { style: { gap: 8 }, children: [
    /* @__PURE__ */ e(E, { height: 14, width: "80%" }),
    /* @__PURE__ */ e(E, { height: 12, width: "50%" })
  ] }, t) : /* @__PURE__ */ p(c, { style: { flexDirection: "row", gap: o.spacing.scale[3], alignItems: "center" }, children: [
    /* @__PURE__ */ e(E, { width: 48, height: 48, radius: 24 }),
    /* @__PURE__ */ p(c, { style: { flex: 1, gap: 6 }, children: [
      /* @__PURE__ */ e(E, { height: 14, width: "70%" }),
      /* @__PURE__ */ e(E, { height: 12, width: "50%" })
    ] })
  ] }, t)) });
}
function $r(s) {
  return /* @__PURE__ */ e(pt, { ...s });
}
function Nr({ filters: s, sortLabel: i = "並び替え", onPressSort: o }) {
  const { theme: r, scales: t } = y();
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
          H,
          {
            horizontal: !0,
            showsHorizontalScrollIndicator: !1,
            contentContainerStyle: { gap: t.spacing.scale[2] },
            style: { flex: 1 },
            children: s.map((n) => {
              const a = n.active || !!n.value;
              return /* @__PURE__ */ p(
                x,
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
                      g,
                      {
                        style: [
                          u("label.sm"),
                          { color: a ? r.text["accent-primary"] : r.text["high-emphasis"] }
                        ],
                        children: [
                          n.label,
                          n.value ? `: ${n.value}` : ""
                        ]
                      }
                    ),
                    /* @__PURE__ */ e(
                      g,
                      {
                        style: [
                          u("label.xs"),
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
          x,
          {
            onPress: o,
            style: ({ pressed: n }) => ({
              paddingHorizontal: t.spacing.scale[2],
              height: 32,
              justifyContent: "center",
              borderRadius: t.borderRadius.full,
              backgroundColor: n ? r.active["tertiary-button"] : "transparent"
            }),
            children: /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: r.text["accent-primary"] }], children: i })
          }
        )
      ]
    }
  );
}
function Yr({
  images: s,
  height: i = 280,
  showCounter: o = !0,
  showDots: r = !0
}) {
  const { theme: t, scales: n } = y(), [a, l] = S(0), d = K.get("window").width;
  return /* @__PURE__ */ p(c, { children: [
    /* @__PURE__ */ e(
      _,
      {
        data: s,
        horizontal: !0,
        pagingEnabled: !0,
        showsHorizontalScrollIndicator: !1,
        onScroll: (h) => {
          const b = Math.round(h.nativeEvent.contentOffset.x / d);
          b !== a && l(b);
        },
        scrollEventThrottle: 16,
        keyExtractor: (h, b) => String(b),
        renderItem: ({ item: h }) => /* @__PURE__ */ e(c, { style: { width: d, height: i, backgroundColor: t.surface.tertiary }, children: /* @__PURE__ */ e(N, { source: h, resizeMode: "cover", style: { width: "100%", height: "100%" } }) })
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
        children: /* @__PURE__ */ p(g, { style: [u("label.xs"), { color: t.text["on-inverse"] }], children: [
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
        children: s.map((h, b) => /* @__PURE__ */ e(
          c,
          {
            style: {
              width: b === a ? 16 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: b === a ? t.text["on-inverse"] : t.text["on-inverse-secondary"]
            }
          },
          b
        ))
      }
    )
  ] });
}
function ve(s, i = "¥") {
  return `${i}${s.toLocaleString("ja-JP")}`;
}
function xt({
  price: s,
  originalPrice: i,
  currency: o = "¥",
  size: r = "md",
  showTax: t = !0
}) {
  const { theme: n, scales: a } = y(), l = typeof i == "number" && i > s, d = l ? Math.round((1 - s / i) * 100) : 0, m = u(r === "lg" ? "heading.2xl" : r === "sm" ? "label.md" : "heading.lg");
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
            g,
            {
              style: [
                u("label.md"),
                { color: n.caution.base, fontWeight: "700" }
              ],
              children: [
                d,
                "% OFF"
              ]
            }
          ),
          /* @__PURE__ */ e(g, { style: [m, { color: n.text["high-emphasis"] }], children: ve(s, o) }),
          t && /* @__PURE__ */ e(g, { style: [u("body.sm"), { color: n.text["low-emphasis"] }], children: "税込" })
        ]
      }
    ),
    l && /* @__PURE__ */ e(
      g,
      {
        style: [
          u("body.sm"),
          { color: n.text["low-emphasis"], textDecorationLine: "line-through" }
        ],
        children: ve(i, o)
      }
    )
  ] });
}
function Xr({ min: s = 1, ...i }) {
  return /* @__PURE__ */ e(Ze, { min: s, ...i });
}
function wt({ rating: s, count: i, size: o = 16, layout: r = "row" }) {
  const { theme: t, scales: n } = y();
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        flexDirection: r === "row" ? "row" : "column",
        alignItems: r === "row" ? "center" : "flex-start",
        gap: n.spacing.scale[1]
      },
      children: [
        /* @__PURE__ */ e(oe, { value: s, size: o, readOnly: !0 }),
        /* @__PURE__ */ p(c, { style: { flexDirection: "row", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: t.text["high-emphasis"] }], children: s.toFixed(1) }),
          i !== void 0 && /* @__PURE__ */ p(g, { style: [u("body.sm"), { color: t.text["low-emphasis"] }], children: [
            "(",
            i.toLocaleString("ja-JP"),
            ")"
          ] })
        ] })
      ]
    }
  );
}
function Ct({
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
  const { theme: h, scales: b } = y(), f = m === "horizontal", v = f ? 96 : "100%", R = f ? 96 : 160, w = (C = !1) => /* @__PURE__ */ p(
    c,
    {
      style: {
        flexDirection: f ? "row" : "column",
        gap: b.spacing.scale[3],
        backgroundColor: h.surface.primary,
        borderRadius: b.borderRadius.lg,
        overflow: "hidden",
        padding: f ? b.spacing.scale[3] : 0,
        opacity: C ? 0.85 : 1
      },
      children: [
        /* @__PURE__ */ p(c, { style: { position: "relative", width: v, height: R }, children: [
          /* @__PURE__ */ e(
            N,
            {
              source: s,
              style: {
                width: "100%",
                height: "100%",
                borderRadius: b.borderRadius.md,
                backgroundColor: h.surface.tertiary
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
                backgroundColor: h.overlay.medium,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: b.borderRadius.md
              },
              children: /* @__PURE__ */ e(g, { style: [u("label.md"), { color: h.text["on-inverse"] }], children: "売り切れ" })
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
              children: /* @__PURE__ */ e(Ge, { tone: "caution", children: a })
            }
          )
        ] }),
        /* @__PURE__ */ p(c, { style: { flex: 1, gap: 4, padding: f ? 0 : b.spacing.scale[3] }, children: [
          /* @__PURE__ */ e(
            g,
            {
              numberOfLines: 2,
              style: [u("body.md"), { color: h.text["high-emphasis"] }],
              children: i
            }
          ),
          t !== void 0 && /* @__PURE__ */ e(wt, { rating: t, count: n, size: 14 }),
          /* @__PURE__ */ e(xt, { price: o, originalPrice: r, size: "sm" })
        ] })
      ]
    }
  );
  return d ? /* @__PURE__ */ e(x, { onPress: d, disabled: l, children: ({ pressed: C }) => w(C) }) : w(!1);
}
function qr({
  title: s,
  action: i,
  products: o,
  cardWidth: r = 160
}) {
  const { scales: t } = y();
  return /* @__PURE__ */ p(c, { children: [
    s && /* @__PURE__ */ e(bt, { title: s, action: i }),
    /* @__PURE__ */ e(
      _,
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
        renderItem: ({ item: n }) => /* @__PURE__ */ e(c, { style: { width: r }, children: /* @__PURE__ */ e(Ct, { ...n }) })
      }
    )
  ] });
}
function Rt(s, i) {
  return `${i}${s.toLocaleString("ja-JP")}`;
}
function Gr({ lines: s, currency: i = "¥" }) {
  const { theme: o, scales: r } = y();
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
        const a = t.emphasis === "total", l = t.emphasis === "discount", d = l ? o.text.caution : a ? o.text["accent-primary"] : o.text["high-emphasis"], m = u(a ? "label.lg" : "body.md"), h = u(a ? "heading.lg" : "body.md");
        return /* @__PURE__ */ p(X.Fragment, { children: [
          a && /* @__PURE__ */ e(Y, {}),
          /* @__PURE__ */ p(c, { style: { flexDirection: "row", justifyContent: "space-between" }, children: [
            /* @__PURE__ */ e(g, { style: [m, { color: o.text["medium-emphasis"] }], children: t.label }),
            /* @__PURE__ */ p(g, { style: [h, { color: d }], children: [
              l && t.value > 0 ? "-" : "",
              Rt(t.value, i)
            ] })
          ] })
        ] }, n);
      })
    }
  );
}
function Kr({
  authorName: s,
  authorAvatar: i,
  rating: o,
  date: r,
  title: t,
  comment: n,
  helpfulCount: a
}) {
  const { theme: l, scales: d } = y();
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
          /* @__PURE__ */ e(Xe, { source: i, fallback: s[0], size: "sm" }),
          /* @__PURE__ */ p(c, { style: { flex: 1 }, children: [
            /* @__PURE__ */ e(g, { style: [u("label.md"), { color: l.text["high-emphasis"] }], children: s }),
            r && /* @__PURE__ */ e(g, { style: [u("body.sm"), { color: l.text["low-emphasis"] }], children: r })
          ] }),
          /* @__PURE__ */ e(oe, { value: o, size: 14, readOnly: !0 })
        ] }),
        t && /* @__PURE__ */ e(g, { style: [u("label.md"), { color: l.text["high-emphasis"] }], children: t }),
        /* @__PURE__ */ e(g, { style: [u("body.md"), { color: l.text["high-emphasis"] }], children: n }),
        a !== void 0 && /* @__PURE__ */ p(g, { style: [u("label.sm"), { color: l.text["low-emphasis"] }], children: [
          "参考になった ",
          a
        ] })
      ]
    }
  );
}
function Jr({ average: s, total: i, distribution: o }) {
  const { theme: r, scales: t } = y();
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
          /* @__PURE__ */ e(g, { style: [u("heading.3xl"), { color: r.text["high-emphasis"] }], children: s.toFixed(1) }),
          /* @__PURE__ */ e(oe, { value: s, size: 16, readOnly: !0 }),
          /* @__PURE__ */ p(g, { style: [u("body.sm"), { color: r.text["low-emphasis"] }], children: [
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
                /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: r.text["medium-emphasis"], width: 16 }], children: n }),
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
                  g,
                  {
                    style: [
                      u("body.sm"),
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
function Ur({
  header: s,
  footer: i,
  bottomNav: o,
  scrollable: r = !0,
  children: t
}) {
  const { theme: n } = y(), a = r ? /* @__PURE__ */ e(H, { style: { flex: 1, backgroundColor: n.surface.secondary }, children: t }) : /* @__PURE__ */ e(c, { style: { flex: 1, backgroundColor: n.surface.secondary }, children: t });
  return /* @__PURE__ */ p(c, { style: { flex: 1, backgroundColor: n.surface.primary }, children: [
    s,
    a,
    i,
    o
  ] });
}
function Qr({ header: s, footer: i, cta: o, children: r }) {
  const { theme: t } = y();
  return /* @__PURE__ */ p(c, { style: { flex: 1, backgroundColor: t.surface.primary }, children: [
    s,
    /* @__PURE__ */ p(H, { style: { flex: 1 }, contentContainerStyle: { paddingBottom: o ? 80 : 0 }, children: [
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
  mr as Accordion,
  qt as Alert,
  et as AlertDialog,
  Rr as AppHeader,
  Ur as AppShell,
  At as AutoGrowTextarea,
  Xe as Avatar,
  Wt as Badge,
  mt as Banner,
  vr as BannerCarousel,
  er as BottomSheetForm,
  $r as BottomTabBar,
  Cr as Breadcrumb,
  B as Button,
  ht as Calendar,
  Pt as Card,
  zr as CategoryNav,
  Br as CategoryScroll,
  ge as Checkbox,
  _t as CheckboxCard,
  Qe as CheckboxField,
  $t as CheckboxGroup,
  Ie as Chip,
  Mr as ChipSelector,
  rr as CoachMark,
  nr as CoachMarkOverlay,
  br as Collapsible,
  sr as Combobox,
  Zt as ConfirmDialog,
  Ot as CountdownTimer,
  gr as DatePicker,
  De as Dialog,
  ir as DropdownFilter,
  Kt as DropdownMenu,
  Ir as EmptyState,
  Tr as ErrorState,
  Hr as FileUpload,
  Nr as FilterBar,
  Er as FilterChip,
  Wr as Footer,
  Xt as FormField,
  Ae as GlassView,
  Yr as ImageCarousel,
  Or as ImageGallery,
  Te as Input,
  Je as Label,
  Sr as ListItem,
  _r as ListSkeletons,
  Qr as MarketingShell,
  Qt as MenuDrawer,
  ar as MultiSelect,
  pt as NavigationBar,
  jt as NotificationBadge,
  Ze as NumberInput,
  Gr as OrderSummary,
  fr as Pagination,
  lr as PillToggle,
  nt as Popover,
  xt as PriceDisplay,
  Ct as ProductCard,
  qr as ProductCarousel,
  Bt as Progress,
  Vt as ProgressRing,
  Vr as ProgressSteps,
  Xr as QuantitySelector,
  Nt as RadioGroup,
  wt as RatingDisplay,
  Gt as ResponsiveDialog,
  Kr as ReviewCard,
  tr as ReviewOverlay,
  Jr as ReviewSummary,
  yr as ScrollArea,
  kr as SearchBar,
  bt as SectionHeader,
  or as Select,
  Y as Separator,
  Fr as ShareButtons,
  j as Sheet,
  xr as SimplePagination,
  E as Skeleton,
  zt as SkeletonText,
  Yt as Slider,
  Lr as SocialIcon,
  Ar as SocialLoginButton,
  Mt as Spinner,
  Ht as Stack,
  oe as StarRating,
  Ft as StatCard,
  Dr as StickyActionBar,
  wr as SubNav,
  Pr as SwipeRow,
  Lt as Switch,
  Et as SyncStatusBadge,
  cr as Tabs,
  ur as TabsContent,
  dr as TabsList,
  hr as TabsTrigger,
  Ge as Tag,
  jr as TagInput,
  Dt as Text,
  Ue as Textarea,
  Tt as ThemeProvider,
  pr as TimePicker,
  Ut as ToastProvider,
  tn as getTheme,
  rn as primitives,
  u as resolveTypo,
  ce as scales,
  nn as themeNames,
  je as themes,
  y as useTheme,
  Jt as useToast
};
