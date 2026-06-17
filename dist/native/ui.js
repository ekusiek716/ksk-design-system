import { scales as ce, themes as je } from "../native.js";
import { getTheme as nn, primitives as on, themeNames as an } from "../native.js";
import { jsx as e, jsxs as p, Fragment as A } from "react/jsx-runtime";
import G, { useState as S, useMemo as ee, useContext as de, createContext as he, useRef as D, useEffect as te, useCallback as xe } from "react";
import { Text as g, Platform as O, View as c, Pressable as x, Image as N, ActivityIndicator as ke, Animated as I, TextInput as X, PanResponder as ue, Modal as q, Dimensions as U, Easing as _, ScrollView as H, FlatList as $, Share as Ee } from "react-native";
const Se = he(null);
function Pt({
  children: o,
  initialName: i = "default",
  initialMode: n = "light"
}) {
  const [a, t] = S(i), [r, s] = S(n), l = ee(
    () => ({
      name: a,
      mode: r,
      theme: je[a][r],
      scales: ce,
      setName: t,
      setMode: s,
      toggleMode: () => s((d) => d === "light" ? "dark" : "light")
    }),
    [a, r]
  );
  return /* @__PURE__ */ e(Se.Provider, { value: l, children: o });
}
function y() {
  const o = de(Se);
  if (!o) throw new Error("useTheme は ThemeProvider の内側で使ってください");
  return o;
}
function u(o) {
  if (o === "caption") return { ...ce.typography.caption };
  const [i, n] = o.split(".");
  return { ...ce.typography[i][n] };
}
function Wt({ variant: o = "body.md", color: i, style: n, children: a, ...t }) {
  const { theme: r } = y();
  return /* @__PURE__ */ e(g, { style: [u(o), { color: i ?? r.text["high-emphasis"] }, n], ...t, children: a });
}
const Fe = {
  subtle: { blur: 14, opacity: 0.1 },
  regular: { blur: 28, opacity: 0.18 },
  thick: { blur: 56, opacity: 0.28 }
};
function Oe({
  intensity: o = "regular",
  tint: i = "system",
  showRim: n = !0,
  borderRadius: a,
  style: t,
  children: r,
  ...s
}) {
  const { theme: l, scales: d, mode: m } = y(), h = a ?? d.borderRadius.lg, b = Fe[o], f = i === "system" ? m === "dark" ? "dark" : "light" : i, C = {
    borderRadius: h,
    overflow: "hidden",
    backgroundColor: f === "light" ? `rgba(255, 255, 255, ${b.opacity})` : `rgba(20, 20, 30, ${b.opacity})`,
    borderWidth: n ? 1 : 0,
    borderColor: f === "light" ? "rgba(255, 255, 255, 0.42)" : "rgba(255, 255, 255, 0.15)"
  }, v = Le();
  if (v && O.OS === "ios")
    return /* @__PURE__ */ p(
      v,
      {
        intensity: b.blur * 2.5,
        tint: f === "dark" ? "dark" : "light",
        style: [C, { backgroundColor: "transparent" }, t],
        ...s,
        children: [
          n && /* @__PURE__ */ e(
            c,
            {
              pointerEvents: "none",
              style: {
                ...Ae,
                borderRadius: h,
                borderWidth: 1,
                borderColor: C.borderColor
              }
            }
          ),
          r
        ]
      }
    );
  if (O.OS === "web") {
    const w = {
      ...C,
      // RN Web は未知のスタイルキーを CSS としてそのまま出力する
      WebkitBackdropFilter: `blur(${b.blur}px) saturate(1.9) brightness(1.06)`,
      backdropFilter: `blur(${b.blur}px) saturate(1.9) brightness(1.06)`
    };
    return /* @__PURE__ */ e(c, { style: [w, t], ...s, children: r });
  }
  return /* @__PURE__ */ e(c, { style: [C, t], ...s, children: r });
}
const Ae = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
};
let Q;
function Le() {
  if (Q !== void 0) return Q;
  try {
    Q = require("expo-blur").BlurView ?? null;
  } catch {
    Q = null;
  }
  return Q;
}
function V({
  variant: o = "primary",
  elevation: i = "flat",
  containerStyle: n,
  pressedContainerStyle: a,
  textStyle: t,
  children: r,
  ...s
}) {
  const { theme: l, scales: d, mode: m } = y(), h = {
    primary: {
      bg: l.brand.primary,
      bgActive: l.active["primary-button"],
      fg: l.text["on-inverse"],
      border: l.brand.primary,
      bottomBorder: l.active["primary-button"]
    },
    secondary: {
      bg: l.surface["accent-primary-light"],
      bgActive: l.active["secondary-button"],
      fg: l.text["accent-primary"],
      border: l.border["accent-primary"],
      bottomBorder: l.active["secondary-button"]
    },
    tertiary: {
      bg: l.surface.secondary,
      bgActive: l.active["tertiary-button"],
      fg: l.text["high-emphasis"],
      border: l.border["low-emphasis"],
      bottomBorder: l.active["tertiary-button"]
    },
    destructive: {
      bg: l.caution.base,
      bgActive: l.caution.action,
      fg: l.text["on-inverse"],
      border: l.caution.base,
      bottomBorder: l.caution.action
    }
  };
  if (o === "glass") {
    const C = l.text["high-emphasis"];
    return /* @__PURE__ */ e(
      x,
      {
        style: {
          minHeight: d.touchTargets.buttonCTA.min,
          borderRadius: d.borderRadius.full,
          overflow: "hidden"
        },
        ...s,
        children: ({ pressed: v }) => /* @__PURE__ */ e(
          Oe,
          {
            intensity: "regular",
            borderRadius: d.borderRadius.full,
            style: {
              minHeight: d.touchTargets.buttonCTA.min,
              paddingHorizontal: d.spacing.scale[5],
              justifyContent: "center",
              alignItems: "center",
              transform: [{ scale: v ? 0.96 : 1 }]
            },
            children: /* @__PURE__ */ e(g, { style: [u("label.md"), { color: C }, t], children: r })
          }
        )
      }
    );
  }
  const b = h[o], f = d.elevation[i];
  return /* @__PURE__ */ e(
    x,
    {
      style: ({ pressed: C }) => [
        {
          minHeight: d.touchTargets.buttonCTA.min,
          paddingHorizontal: d.spacing.scale[5],
          justifyContent: "center",
          alignItems: "center",
          borderRadius: d.borderRadius.lg,
          borderWidth: 1,
          backgroundColor: C ? b.bgActive : b.bg,
          borderColor: b.border
        },
        // raised: 下辺に厚みのある border を載せ、押下時に消して translateY で沈める
        i === "raised" && {
          borderBottomWidth: C ? 0 : f.bottomBorderWidth,
          borderBottomColor: b.bottomBorder,
          transform: [{ translateY: C ? f.offset : 0 }],
          // raised 状態は下辺分の余白を本体に補填（押下で寸法が変わらないよう margin で吸収）
          marginBottom: C ? f.bottomBorderWidth : 0
        },
        n,
        C && a
      ],
      ...s,
      children: /* @__PURE__ */ e(g, { style: [u("label.md"), { color: b.fg }, t], children: r })
    }
  );
}
const _e = {
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
function $e(o, i) {
  return {
    shadowColor: i,
    ..._e[o]
  };
}
function Ht({ padding: o = 4, elevation: i, style: n, children: a, ...t }) {
  const { theme: r, scales: s } = y(), l = i ? O.select({
    web: { boxShadow: s.shadows[i].boxShadow },
    ios: $e(i, r.overlay.dark),
    default: { elevation: s.shadows[i].elevation }
  }) : void 0;
  return /* @__PURE__ */ e(
    c,
    {
      style: [
        {
          backgroundColor: r.surface.primary,
          borderColor: r.border["low-emphasis"],
          borderWidth: 1,
          borderRadius: s.borderRadius.lg,
          padding: s.spacing.scale[o],
          gap: s.spacing.scale[3]
        },
        l,
        n
      ],
      ...t,
      children: a
    }
  );
}
function Bt({ tone: o = "neutral", children: i }) {
  const { theme: n, scales: a } = y(), r = {
    neutral: { bg: n.surface.tertiary, fg: n.text["medium-emphasis"] },
    accent: { bg: n.surface["accent-primary-light"], fg: n.text["accent-primary"] },
    success: { bg: n.surface.success, fg: n.text.success },
    caution: { bg: n.surface.caution, fg: n.text.caution },
    warning: { bg: n.surface.warning, fg: n.text.warning },
    info: { bg: n.surface.info, fg: n.text.info }
  }[o];
  return /* @__PURE__ */ e(
    c,
    {
      style: {
        backgroundColor: r.bg,
        borderRadius: a.borderRadius.full,
        paddingVertical: a.spacing.scale[1],
        paddingHorizontal: a.spacing.scale[3],
        alignSelf: "flex-start"
      },
      children: /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: r.fg }], children: i })
    }
  );
}
function Mt({
  gap: o = 3,
  direction: i = "column",
  align: n,
  justify: a,
  wrap: t = !1,
  style: r,
  children: s,
  ...l
}) {
  const { scales: d } = y();
  return /* @__PURE__ */ e(
    c,
    {
      style: [
        {
          flexDirection: i,
          gap: d.spacing.scale[o],
          alignItems: n,
          justifyContent: a,
          flexWrap: t ? "wrap" : "nowrap"
        },
        r
      ],
      ...l,
      children: s
    }
  );
}
const Ne = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80
};
function Ye({ source: o, fallback: i, size: n = "md" }) {
  const { theme: a } = y(), t = Ne[n];
  return o ? /* @__PURE__ */ e(
    N,
    {
      source: o,
      style: {
        width: t,
        height: t,
        borderRadius: t / 2,
        backgroundColor: a.surface.tertiary
      }
    }
  ) : /* @__PURE__ */ e(
    c,
    {
      style: {
        width: t,
        height: t,
        borderRadius: t / 2,
        backgroundColor: a.surface.tertiary,
        alignItems: "center",
        justifyContent: "center"
      },
      children: /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: a.text["medium-emphasis"] }], children: i ?? "?" })
    }
  );
}
const we = { sm: 28, md: 32, lg: 36 }, Ge = { sm: 10, md: 12, lg: 16 };
function Ie({
  variant: o = "filled",
  size: i = "md",
  shape: n = "pill",
  selected: a = !1,
  disabled: t = !1,
  count: r,
  removable: s = !1,
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
  }[o], C = a ? h.brand.primary : f.bg, v = a ? h.text["on-inverse"] : t ? h.text.disable : f.fg, w = a ? h.brand.primary : f.border;
  return /* @__PURE__ */ p(c, { style: { flexDirection: "row", alignSelf: "flex-start" }, children: [
    /* @__PURE__ */ p(
      x,
      {
        disabled: t,
        style: ({ pressed: R }) => [
          {
            height: we[i],
            paddingHorizontal: Ge[i],
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: b.spacing.scale[1],
            borderRadius: n === "pill" ? b.borderRadius.full : b.borderRadius.sm,
            borderWidth: o === "outline" || a ? 1 : 0,
            borderColor: w,
            backgroundColor: R && !t ? h.active["secondary-button"] : C,
            opacity: t ? 0.6 : 1
          },
          s && { borderTopRightRadius: 0, borderBottomRightRadius: 0 }
        ],
        ...m,
        children: [
          /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: v }], children: d }),
          r !== void 0 && /* @__PURE__ */ e(
            c,
            {
              style: {
                minWidth: 20,
                paddingHorizontal: 6,
                borderRadius: b.borderRadius.full,
                backgroundColor: a ? h.surface.primary : h.surface.tertiary,
                alignItems: "center",
                justifyContent: "center"
              },
              children: /* @__PURE__ */ e(
                g,
                {
                  style: [
                    u("label.xs"),
                    { color: a ? h.text["accent-primary"] : h.text["medium-emphasis"] }
                  ],
                  children: r
                }
              )
            }
          )
        ]
      }
    ),
    s && /* @__PURE__ */ e(
      x,
      {
        onPress: l,
        disabled: t,
        style: ({ pressed: R }) => ({
          height: we[i],
          paddingHorizontal: 10,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: R ? h.active["tertiary-button"] : C,
          borderTopRightRadius: n === "pill" ? b.borderRadius.full : b.borderRadius.sm,
          borderBottomRightRadius: n === "pill" ? b.borderRadius.full : b.borderRadius.sm,
          borderWidth: o === "outline" || a ? 1 : 0,
          borderLeftWidth: 0,
          borderColor: w,
          opacity: t ? 0.6 : 1
        }),
        children: /* @__PURE__ */ e(g, { style: [u("label.md"), { color: v, lineHeight: 14 }], children: "×" })
      }
    )
  ] });
}
function Xe({ tone: o = "neutral", variant: i = "filled", children: n }) {
  const { theme: a, scales: t } = y(), r = {
    neutral: { bg: a.surface.tertiary, fg: a.text["medium-emphasis"] },
    accent: { bg: a.surface["accent-primary-light"], fg: a.text["accent-primary"] },
    success: { bg: a.surface.success, fg: a.text.success },
    caution: { bg: a.surface.caution, fg: a.text.caution },
    warning: { bg: a.surface.warning, fg: a.text.warning },
    info: { bg: a.surface.info, fg: a.text.info }
  }, s = {
    neutral: { fg: a.text["medium-emphasis"], border: a.border["medium-emphasis"] },
    accent: { fg: a.text["accent-primary"], border: a.border["accent-primary"] },
    success: { fg: a.text.success, border: a.border.success },
    caution: { fg: a.text.caution, border: a.border.caution },
    warning: { fg: a.text.warning, border: a.border.warning },
    info: { fg: a.text.info, border: a.border.info }
  }, l = i === "filled" ? r[o] : null, d = i === "outline" ? s[o] : null;
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
      children: /* @__PURE__ */ e(g, { style: [u("label.xs"), { color: l?.fg ?? d?.fg ?? a.text["medium-emphasis"] }], children: n })
    }
  );
}
function zt({ size: o = "md", color: i }) {
  const { theme: n } = y();
  return /* @__PURE__ */ e(
    ke,
    {
      size: o === "sm" ? "small" : "large",
      color: i ?? n.brand.primary
    }
  );
}
function Y({ orientation: o = "horizontal", emphasis: i = "low" }) {
  const { theme: n } = y(), a = i === "low" ? n.border["low-emphasis"] : n.border["medium-emphasis"];
  return o === "vertical" ? /* @__PURE__ */ e(c, { style: { width: 1, alignSelf: "stretch", backgroundColor: a } }) : /* @__PURE__ */ e(c, { style: { height: 1, alignSelf: "stretch", backgroundColor: a } });
}
function F({ width: o = "100%", height: i = 16, radius: n, style: a }) {
  const { theme: t, scales: r } = y(), s = D(new I.Value(0.4)).current;
  return te(() => {
    const l = I.loop(
      I.sequence([
        I.timing(s, { toValue: 1, duration: 800, useNativeDriver: !0 }),
        I.timing(s, { toValue: 0.4, duration: 800, useNativeDriver: !0 })
      ])
    );
    return l.start(), () => l.stop();
  }, [s]), /* @__PURE__ */ e(
    I.View,
    {
      style: [
        {
          width: o,
          height: i,
          backgroundColor: t.surface.tertiary,
          borderRadius: n ?? r.borderRadius.md,
          opacity: s
        },
        a
      ]
    }
  );
}
function Vt({ lines: o = 3 }) {
  return /* @__PURE__ */ e(c, { style: { gap: 8 }, children: Array.from({ length: o }).map((i, n) => /* @__PURE__ */ e(F, { height: 12, width: n === o - 1 ? "60%" : "100%" }, n)) });
}
function jt({ value: o, max: i = 100, height: n = 8, tone: a = "accent" }) {
  const { theme: t, scales: r } = y(), s = Math.min(100, Math.max(0, o / i * 100)), l = {
    accent: t.brand.primary,
    success: t.success.base,
    caution: t.caution.base,
    warning: t.warning.base
  }[a];
  return /* @__PURE__ */ e(
    c,
    {
      style: {
        width: "100%",
        height: n,
        borderRadius: r.borderRadius.full,
        backgroundColor: t.surface.tertiary,
        overflow: "hidden"
      },
      children: /* @__PURE__ */ e(
        c,
        {
          style: {
            width: `${s}%`,
            height: "100%",
            backgroundColor: l,
            borderRadius: r.borderRadius.full
          }
        }
      )
    }
  );
}
function Et({
  value: o,
  max: i = 100,
  size: n = 64,
  thickness: a = 6,
  showLabel: t = !0
}) {
  const { theme: r } = y(), s = Math.min(100, Math.max(0, o / i * 100)), l = s / 100 * 360, d = r.surface.tertiary, m = r.brand.primary, h = n / 2, b = (f) => /* @__PURE__ */ e(
    c,
    {
      style: {
        position: "absolute",
        width: n,
        height: n,
        transform: [{ rotate: `${f}deg` }]
      },
      children: /* @__PURE__ */ e(
        c,
        {
          style: {
            position: "absolute",
            width: h,
            height: n,
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
        width: n,
        height: n,
        alignItems: "center",
        justifyContent: "center"
      },
      children: [
        /* @__PURE__ */ e(
          c,
          {
            style: {
              position: "absolute",
              width: n,
              height: n,
              borderRadius: n / 2,
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
              width: n,
              height: n,
              transform: [{ rotate: `${l - 180}deg` }]
            },
            children: /* @__PURE__ */ e(
              c,
              {
                style: {
                  position: "absolute",
                  right: 0,
                  width: h,
                  height: n,
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
              width: n,
              height: n,
              transform: [{ rotate: `${l}deg` }]
            },
            children: /* @__PURE__ */ e(
              c,
              {
                style: {
                  position: "absolute",
                  right: 0,
                  width: h,
                  height: n,
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
              width: n - a * 2,
              height: n - a * 2,
              borderRadius: (n - a * 2) / 2,
              backgroundColor: r.surface.primary,
              alignItems: "center",
              justifyContent: "center"
            },
            children: t && /* @__PURE__ */ p(g, { style: [u("label.sm"), { color: r.text["high-emphasis"] }], children: [
              Math.round(s),
              "%"
            ] })
          }
        )
      ]
    }
  );
}
function oe({ value: o, max: i = 5, size: n = 20, onChange: a, readOnly: t = !1 }) {
  const { theme: r } = y(), s = r.object.rating, l = r.object["low-emphasis"], d = Math.max(0, Math.min(i, o));
  return /* @__PURE__ */ e(c, { style: { flexDirection: "row", gap: 2 }, children: Array.from({ length: i }).map((m, h) => {
    const b = h + 1 <= d, f = !b && h + 0.5 <= d, w = /* @__PURE__ */ e(
      g,
      {
        style: {
          fontSize: n,
          color: b || f ? s : l,
          opacity: f ? 0.5 : 1
        },
        children: f || b ? "★" : "☆"
      }
    );
    return t || !a ? /* @__PURE__ */ e(c, { children: w }, h) : /* @__PURE__ */ e(x, { onPress: () => a(h + 1), hitSlop: 8, children: w }, h);
  }) });
}
function Ft({ count: o = 0, max: i = 99, dot: n = !1, children: a }) {
  const { theme: t, scales: r } = y();
  return a ? /* @__PURE__ */ p(c, { style: { position: "relative" }, children: [
    a,
    (n || o > 0) && /* @__PURE__ */ e(
      c,
      {
        style: {
          position: "absolute",
          top: -4,
          right: -4,
          ...n ? { width: 8, height: 8, borderRadius: 4 } : {
            minWidth: 18,
            paddingHorizontal: 6,
            height: 18,
            borderRadius: r.borderRadius.full,
            alignItems: "center",
            justifyContent: "center"
          },
          backgroundColor: t.caution.base,
          borderWidth: 2,
          borderColor: t.surface.primary
        },
        children: !n && /* @__PURE__ */ e(g, { style: [u("label.xs"), { color: t.text["on-inverse"] }], children: o > i ? `${i}+` : o })
      }
    )
  ] }) : n ? /* @__PURE__ */ e(
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
        borderRadius: r.borderRadius.full,
        backgroundColor: t.caution.base,
        alignItems: "center",
        justifyContent: "center"
      },
      children: /* @__PURE__ */ e(g, { style: [u("label.xs"), { color: t.text["on-inverse"] }], children: o > i ? `${i}+` : o })
    }
  );
}
function Ot({ label: o, value: i, delta: n, trend: a = "neutral" }) {
  const { theme: t, scales: r } = y(), s = a === "up" ? t.text.success : a === "down" ? t.text.caution : t.text["low-emphasis"];
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        backgroundColor: t.surface.primary,
        borderColor: t.border["low-emphasis"],
        borderWidth: 1,
        borderRadius: r.borderRadius.lg,
        padding: r.spacing.scale[4],
        gap: r.spacing.scale[1]
      },
      children: [
        /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: t.text["low-emphasis"] }], children: o }),
        /* @__PURE__ */ e(g, { style: [u("heading.2xl"), { color: t.text["high-emphasis"] }], children: i }),
        n && /* @__PURE__ */ p(g, { style: [u("label.sm"), { color: s }], children: [
          a === "up" ? "▲" : a === "down" ? "▼" : "■",
          " ",
          n
        ] })
      ]
    }
  );
}
function At({ status: o, label: i }) {
  const { theme: n, scales: a } = y(), t = {
    synced: { bg: n.surface.success, fg: n.text.success, dot: n.success.base, def: "同期済み" },
    syncing: { bg: n.surface.info, fg: n.text.info, dot: n.info.base, def: "同期中" },
    offline: {
      bg: n.surface.tertiary,
      fg: n.text["medium-emphasis"],
      dot: n.text["low-emphasis"],
      def: "オフライン"
    },
    error: { bg: n.surface.caution, fg: n.text.caution, dot: n.caution.base, def: "エラー" }
  }[o];
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        flexDirection: "row",
        alignItems: "center",
        gap: a.spacing.scale[1],
        backgroundColor: t.bg,
        borderRadius: a.borderRadius.full,
        paddingHorizontal: a.spacing.scale[2],
        paddingVertical: a.spacing.scale[1],
        alignSelf: "flex-start"
      },
      children: [
        o === "syncing" ? /* @__PURE__ */ e(ke, { size: "small", color: t.fg }) : /* @__PURE__ */ e(
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
function qe(o) {
  return o.toString().padStart(2, "0");
}
function Lt({ target: o, onComplete: i, tone: n = "neutral" }) {
  const { theme: a, scales: t } = y(), r = o instanceof Date ? o.getTime() : o, [s, l] = S(() => Date.now());
  te(() => {
    const R = setInterval(() => {
      const k = Date.now();
      l(k), k >= r && (clearInterval(R), i?.());
    }, 1e3);
    return () => clearInterval(R);
  }, [r, i]);
  const d = Math.max(0, r - s), m = Math.floor(d / 1e3), h = Math.floor(m / 86400), b = Math.floor(m % 86400 / 3600), f = Math.floor(m % 3600 / 60), C = m % 60, v = n === "accent" ? a.text["accent-primary"] : n === "caution" ? a.text.caution : a.text["high-emphasis"], w = (R, k) => /* @__PURE__ */ p(c, { style: { alignItems: "center", minWidth: 48 }, children: [
    /* @__PURE__ */ e(
      c,
      {
        style: {
          backgroundColor: a.surface.secondary,
          paddingVertical: t.spacing.scale[1],
          paddingHorizontal: t.spacing.scale[2],
          borderRadius: t.borderRadius.md
        },
        children: /* @__PURE__ */ e(g, { style: [u("heading.md"), { color: v }], children: qe(R) })
      }
    ),
    /* @__PURE__ */ e(g, { style: [u("label.xs"), { color: a.text["low-emphasis"], marginTop: 2 }], children: k })
  ] });
  return /* @__PURE__ */ p(c, { style: { flexDirection: "row", gap: t.spacing.scale[2] }, children: [
    h > 0 && w(h, "日"),
    w(b, "時間"),
    w(f, "分"),
    w(C, "秒")
  ] });
}
function Ue({ required: o, children: i, style: n, ...a }) {
  const { theme: t, scales: r } = y();
  return /* @__PURE__ */ p(
    c,
    {
      style: [{ flexDirection: "row", alignItems: "center", gap: r.spacing.scale[1] }, n],
      ...a,
      children: [
        /* @__PURE__ */ e(g, { style: [u("label.md"), { color: t.text["high-emphasis"] }], children: i }),
        o && /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: t.caution.base }], children: "*" })
      ]
    }
  );
}
const Ke = O.OS === "web" ? { outlineStyle: "none" } : null;
function Te({ invalid: o, disabled: i, leading: n, trailing: a, ...t }) {
  const { theme: r, scales: s } = y(), [l, d] = S(!1), m = o ? r.border.caution : l ? r.border["accent-primary"] : r.border["medium-emphasis"];
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        flexDirection: "row",
        alignItems: "center",
        gap: s.spacing.scale[2],
        minHeight: s.touchTargets.textInput.min,
        paddingHorizontal: s.spacing.scale[3],
        borderRadius: s.borderRadius.md,
        borderWidth: 1,
        borderColor: m,
        backgroundColor: i ? r.surface.disable : r.surface.primary,
        opacity: i ? 0.6 : 1
      },
      children: [
        n,
        /* @__PURE__ */ e(
          X,
          {
            editable: !i,
            onFocus: (h) => {
              d(!0), t.onFocus?.(h);
            },
            onBlur: (h) => {
              d(!1), t.onBlur?.(h);
            },
            placeholderTextColor: r.text["low-emphasis"],
            style: [
              u("body.md"),
              { flex: 1, color: r.text["high-emphasis"], paddingVertical: 0 },
              Ke
            ],
            ...t
          }
        ),
        a
      ]
    }
  );
}
const Je = O.OS === "web" ? { outlineStyle: "none" } : null;
function Qe({ invalid: o, disabled: i, minHeight: n = 96, ...a }) {
  const { theme: t, scales: r } = y(), [s, l] = S(!1), d = o ? t.border.caution : s ? t.border["accent-primary"] : t.border["medium-emphasis"];
  return /* @__PURE__ */ e(
    X,
    {
      editable: !i,
      multiline: !0,
      textAlignVertical: "top",
      onFocus: (m) => {
        l(!0), a.onFocus?.(m);
      },
      onBlur: (m) => {
        l(!1), a.onBlur?.(m);
      },
      placeholderTextColor: t.text["low-emphasis"],
      style: [
        u("body.md"),
        {
          minHeight: n,
          padding: r.spacing.scale[3],
          borderRadius: r.borderRadius.md,
          borderWidth: 1,
          borderColor: d,
          backgroundColor: i ? t.surface.disable : t.surface.primary,
          color: t.text["high-emphasis"],
          opacity: i ? 0.6 : 1
        },
        Je
      ],
      ...a
    }
  );
}
const Ze = O.OS === "web" ? { outlineStyle: "none" } : null;
function _t({
  invalid: o,
  disabled: i,
  minHeight: n = 44,
  maxHeight: a = 200,
  ...t
}) {
  const { theme: r, scales: s } = y(), [l, d] = S(!1), [m, h] = S(n), b = o ? r.border.caution : l ? r.border["accent-primary"] : r.border["medium-emphasis"];
  return /* @__PURE__ */ e(
    X,
    {
      editable: !i,
      multiline: !0,
      textAlignVertical: "top",
      onContentSizeChange: (C) => {
        const v = Math.min(a, Math.max(n, C.nativeEvent.contentSize.height + 16));
        h(v);
      },
      onFocus: (C) => {
        d(!0), t.onFocus?.(C);
      },
      onBlur: (C) => {
        d(!1), t.onBlur?.(C);
      },
      placeholderTextColor: r.text["low-emphasis"],
      style: [
        u("body.md"),
        {
          height: m,
          padding: s.spacing.scale[3],
          borderRadius: s.borderRadius.md,
          borderWidth: 1,
          borderColor: b,
          backgroundColor: i ? r.surface.disable : r.surface.primary,
          color: r.text["high-emphasis"],
          opacity: i ? 0.6 : 1
        },
        Ze
      ],
      ...t
    }
  );
}
function $t({ value: o = !1, onValueChange: i, disabled: n = !1 }) {
  const { theme: a } = y(), t = 50, r = 30, s = 2, l = r - s * 2;
  return /* @__PURE__ */ e(
    x,
    {
      onPress: () => !n && i?.(!o),
      disabled: n,
      accessibilityRole: "switch",
      accessibilityState: { checked: o, disabled: n },
      style: {
        width: t,
        height: r,
        borderRadius: r / 2,
        padding: s,
        backgroundColor: o ? a.brand.primary : a.surface.tertiary,
        opacity: n ? 0.5 : 1,
        justifyContent: "center"
      },
      children: /* @__PURE__ */ e(
        c,
        {
          style: {
            width: l,
            height: l,
            borderRadius: l / 2,
            backgroundColor: a.surface.primary,
            alignSelf: o ? "flex-end" : "flex-start",
            shadowColor: a.overlay.dark,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 1.5,
            elevation: 2
          }
        }
      )
    }
  );
}
function ge({ checked: o = !1, onChange: i, disabled: n = !1, size: a = 20 }) {
  const { theme: t, scales: r } = y();
  return /* @__PURE__ */ e(
    x,
    {
      onPress: () => !n && i?.(!o),
      disabled: n,
      hitSlop: 8,
      accessibilityRole: "checkbox",
      accessibilityState: { checked: o, disabled: n },
      style: {
        width: a,
        height: a,
        borderRadius: r.borderRadius.sm,
        borderWidth: 2,
        borderColor: o ? t.brand.primary : t.border["medium-emphasis"],
        backgroundColor: o ? t.brand.primary : "transparent",
        alignItems: "center",
        justifyContent: "center",
        opacity: n ? 0.4 : 1
      },
      children: o && /* @__PURE__ */ e(
        c,
        {
          style: {
            width: a * 0.5,
            height: a * 0.25,
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
function et({
  checked: o = !1,
  onChange: i,
  disabled: n = !1,
  label: a,
  description: t
}) {
  const { theme: r, scales: s } = y();
  return /* @__PURE__ */ p(
    x,
    {
      onPress: () => !n && i?.(!o),
      disabled: n,
      style: {
        flexDirection: "row",
        gap: s.spacing.scale[2],
        alignItems: "flex-start",
        opacity: n ? 0.6 : 1
      },
      children: [
        /* @__PURE__ */ e(c, { style: { paddingTop: 2 }, children: /* @__PURE__ */ e(ge, { checked: o, disabled: n, onChange: i }) }),
        /* @__PURE__ */ p(c, { style: { flex: 1, gap: 2 }, children: [
          /* @__PURE__ */ e(g, { style: [u("body.md"), { color: r.text["high-emphasis"] }], children: a }),
          t && /* @__PURE__ */ e(g, { style: [u("body.sm"), { color: r.text["medium-emphasis"] }], children: t })
        ] })
      ]
    }
  );
}
function Nt({
  checked: o = !1,
  onChange: i,
  disabled: n = !1,
  title: a,
  description: t
}) {
  const { theme: r, scales: s } = y();
  return /* @__PURE__ */ p(
    x,
    {
      onPress: () => !n && i?.(!o),
      disabled: n,
      style: {
        flexDirection: "row",
        gap: s.spacing.scale[3],
        alignItems: "flex-start",
        padding: s.spacing.scale[4],
        borderRadius: s.borderRadius.lg,
        borderWidth: 1,
        borderColor: o ? r.border["accent-primary"] : r.border["low-emphasis"],
        backgroundColor: o ? r.surface["accent-primary-light"] : r.surface.primary,
        opacity: n ? 0.6 : 1
      },
      children: [
        /* @__PURE__ */ e(c, { style: { paddingTop: 2 }, children: /* @__PURE__ */ e(ge, { checked: o, disabled: n, onChange: i }) }),
        /* @__PURE__ */ p(c, { style: { flex: 1, gap: 2 }, children: [
          /* @__PURE__ */ e(g, { style: [u("label.md"), { color: r.text["high-emphasis"] }], children: a }),
          t && /* @__PURE__ */ e(g, { style: [u("body.sm"), { color: r.text["medium-emphasis"] }], children: t })
        ] })
      ]
    }
  );
}
function Yt({ options: o, values: i = [], onChange: n, disabled: a = !1 }) {
  const { scales: t } = y(), r = (s) => {
    i.includes(s) ? n?.(i.filter((l) => l !== s)) : n?.([...i, s]);
  };
  return /* @__PURE__ */ e(c, { style: { gap: t.spacing.scale[3] }, children: o.map((s) => /* @__PURE__ */ e(
    et,
    {
      label: s.label,
      description: s.description,
      checked: i.includes(s.value),
      disabled: a,
      onChange: () => r(s.value)
    },
    s.value
  )) });
}
function Gt({ options: o, value: i, onChange: n, disabled: a = !1 }) {
  const { theme: t, scales: r } = y();
  return /* @__PURE__ */ e(c, { style: { gap: r.spacing.scale[3] }, children: o.map((s) => {
    const l = i === s.value, d = a || s.disabled;
    return /* @__PURE__ */ p(
      x,
      {
        onPress: () => !d && n?.(s.value),
        disabled: d,
        style: {
          flexDirection: "row",
          gap: r.spacing.scale[2],
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
            /* @__PURE__ */ e(g, { style: [u("body.md"), { color: t.text["high-emphasis"] }], children: s.label }),
            s.description && /* @__PURE__ */ e(g, { style: [u("body.sm"), { color: t.text["medium-emphasis"] }], children: s.description })
          ] })
        ]
      },
      s.value
    );
  }) });
}
function Xt({
  value: o,
  onChange: i,
  min: n = 0,
  max: a = 100,
  step: t = 1,
  disabled: r = !1
}) {
  const { theme: s, scales: l } = y(), [d, m] = S(0), h = D(0), b = (k) => Math.max(n, Math.min(a, k)), f = (k) => t ? Math.round(k / t) * t : k, C = (k) => {
    if (!h.current) return;
    const T = Math.max(0, Math.min(1, k / h.current)), K = b(f(n + (a - n) * T));
    i?.(K);
  }, v = D(
    ue.create({
      onStartShouldSetPanResponder: () => !r,
      onMoveShouldSetPanResponder: () => !r,
      onPanResponderGrant: (k) => C(k.nativeEvent.locationX),
      onPanResponderMove: (k) => C(k.nativeEvent.locationX)
    })
  ).current, w = (b(o) - n) / (a - n);
  return /* @__PURE__ */ p(
    c,
    {
      onLayout: (k) => {
        const T = k.nativeEvent.layout.width;
        m(T), h.current = T;
      },
      ...v.panHandlers,
      style: {
        height: 32,
        justifyContent: "center",
        opacity: r ? 0.5 : 1
      },
      children: [
        /* @__PURE__ */ e(
          c,
          {
            style: {
              height: 6,
              borderRadius: l.borderRadius.full,
              backgroundColor: s.surface.tertiary
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
              backgroundColor: s.brand.primary
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
              backgroundColor: s.brand.primary,
              borderWidth: 2,
              borderColor: s.surface.primary
            }
          }
        )
      ]
    }
  );
}
function tt({
  value: o,
  onChange: i,
  min: n = 0,
  max: a = 99,
  step: t = 1,
  disabled: r = !1
}) {
  const { theme: s, scales: l } = y(), d = (b) => Math.max(n, Math.min(a, b)), m = () => !r && i?.(d(o + t)), h = () => !r && i?.(d(o - t));
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: s.border["medium-emphasis"],
        borderRadius: l.borderRadius.md,
        backgroundColor: s.surface.primary,
        overflow: "hidden",
        alignSelf: "flex-start",
        opacity: r ? 0.5 : 1
      },
      children: [
        /* @__PURE__ */ e(
          x,
          {
            onPress: h,
            disabled: r || o <= n,
            style: ({ pressed: b }) => ({
              width: 40,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: b ? s.active["tertiary-button"] : "transparent"
            }),
            children: /* @__PURE__ */ e(g, { style: [u("heading.md"), { color: s.text["high-emphasis"] }], children: "−" })
          }
        ),
        /* @__PURE__ */ e(
          X,
          {
            value: String(o),
            onChangeText: (b) => {
              const f = Number(b.replace(/[^0-9-]/g, ""));
              Number.isNaN(f) || i?.(d(f));
            },
            keyboardType: "number-pad",
            editable: !r,
            style: [
              u("body.md"),
              {
                width: 56,
                textAlign: "center",
                color: s.text["high-emphasis"],
                paddingVertical: 0,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderColor: s.border["low-emphasis"]
              }
            ]
          }
        ),
        /* @__PURE__ */ e(
          x,
          {
            onPress: m,
            disabled: r || o >= a,
            style: ({ pressed: b }) => ({
              width: 40,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: b ? s.active["tertiary-button"] : "transparent"
            }),
            children: /* @__PURE__ */ e(g, { style: [u("heading.md"), { color: s.text["high-emphasis"] }], children: "＋" })
          }
        )
      ]
    }
  );
}
function qt({ label: o, required: i, description: n, error: a, children: t }) {
  const { theme: r, scales: s } = y();
  return /* @__PURE__ */ p(c, { style: { gap: s.spacing.scale[2] }, children: [
    o && /* @__PURE__ */ e(Ue, { required: i, children: o }),
    n && !a && /* @__PURE__ */ e(g, { style: [u("body.sm"), { color: r.text["medium-emphasis"] }], children: n }),
    t,
    a && /* @__PURE__ */ e(g, { style: [u("body.sm"), { color: r.text.caution }], children: a })
  ] });
}
function Ut({ tone: o = "info", title: i, description: n, children: a }) {
  const { theme: t, scales: r } = y(), s = {
    info: { bg: t.surface.info, fg: t.text.info, border: t.border.info },
    success: { bg: t.surface.success, fg: t.text.success, border: t.border.success },
    warning: { bg: t.surface.warning, fg: t.text.warning, border: t.border.warning },
    caution: { bg: t.surface.caution, fg: t.text.caution, border: t.border.caution }
  }[o];
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        backgroundColor: s.bg,
        borderColor: s.border,
        borderLeftWidth: 4,
        borderRadius: r.borderRadius.md,
        padding: r.spacing.scale[3],
        gap: r.spacing.scale[1]
      },
      children: [
        i && /* @__PURE__ */ e(g, { style: [u("label.md"), { color: s.fg }], children: i }),
        n && /* @__PURE__ */ e(g, { style: [u("body.sm"), { color: t.text["high-emphasis"] }], children: n }),
        a
      ]
    }
  );
}
function De({
  open: o,
  onClose: i,
  title: n,
  description: a,
  footer: t,
  children: r,
  dismissOnBackdrop: s = !0
}) {
  const { theme: l, scales: d } = y();
  return /* @__PURE__ */ e(q, { visible: o, transparent: !0, animationType: "fade", onRequestClose: i, children: /* @__PURE__ */ e(
    x,
    {
      onPress: () => s && i(),
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
            n && /* @__PURE__ */ e(g, { style: [u("heading.lg"), { color: l.text["high-emphasis"] }], children: n }),
            a && /* @__PURE__ */ e(g, { style: [u("body.md"), { color: l.text["medium-emphasis"] }], children: a }),
            r,
            t && /* @__PURE__ */ e(c, { style: { flexDirection: "row", justifyContent: "flex-end", gap: d.spacing.scale[2] }, children: t })
          ]
        }
      )
    }
  ) });
}
function rt({
  open: o,
  onClose: i,
  title: n,
  description: a,
  confirmLabel: t = "OK",
  cancelLabel: r = "キャンセル",
  onConfirm: s,
  destructive: l = !1
}) {
  const { scales: d } = y();
  return /* @__PURE__ */ e(
    De,
    {
      open: o,
      onClose: i,
      title: n,
      description: a,
      dismissOnBackdrop: !1,
      footer: /* @__PURE__ */ p(A, { children: [
        /* @__PURE__ */ e(c, { style: { minWidth: 100 }, children: /* @__PURE__ */ e(V, { variant: "tertiary", onPress: i, children: r }) }),
        /* @__PURE__ */ e(c, { style: { minWidth: 100 }, children: /* @__PURE__ */ e(
          V,
          {
            variant: l ? "destructive" : "primary",
            onPress: () => {
              s?.(), i();
            },
            children: t
          }
        ) })
      ] })
    }
  );
}
function j(o) {
  const { side: i = "bottom", snapPoints: n } = o;
  return n && n.length > 0 && i === "bottom" ? /* @__PURE__ */ e(ot, { ...o }) : /* @__PURE__ */ e(nt, { ...o });
}
function nt({ open: o, onClose: i, side: n = "bottom", title: a, children: t }) {
  const { theme: r, scales: s } = y(), l = D(new I.Value(0)).current;
  te(() => {
    I.timing(l, {
      toValue: o ? 1 : 0,
      duration: 220,
      useNativeDriver: !0
    }).start();
  }, [o, l]);
  const { width: d, height: m } = U.get("window"), h = {
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
  return /* @__PURE__ */ e(q, { visible: o, transparent: !0, animationType: "none", onRequestClose: i, children: /* @__PURE__ */ e(
    x,
    {
      onPress: i,
      style: { flex: 1, backgroundColor: r.overlay.dark, ...b[n] },
      children: /* @__PURE__ */ e(
        I.View,
        {
          style: {
            transform: [
              h[n].translateX ? { translateX: h[n].translateX } : { translateX: 0 },
              h[n].translateY ? { translateY: h[n].translateY } : { translateY: 0 }
            ],
            backgroundColor: r.surface.primary,
            ...n === "bottom" || n === "top" ? { width: "100%", borderTopLeftRadius: s.borderRadius["2xl"], borderTopRightRadius: s.borderRadius["2xl"] } : { height: "100%", width: "85%" },
            padding: s.spacing.scale[4],
            gap: s.spacing.scale[3]
          },
          children: /* @__PURE__ */ p(x, { onPress: () => {
          }, children: [
            n === "bottom" && /* @__PURE__ */ e(
              c,
              {
                style: {
                  width: 40,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: r.border["medium-emphasis"],
                  alignSelf: "center",
                  marginBottom: s.spacing.scale[2]
                }
              }
            ),
            a && /* @__PURE__ */ e(g, { style: [u("heading.md"), { color: r.text["high-emphasis"] }], children: a }),
            /* @__PURE__ */ e(c, { style: { marginTop: s.spacing.scale[2] }, children: t })
          ] })
        }
      )
    }
  ) });
}
const Z = 180;
function le(o, i, n) {
  return Math.max(i, Math.min(n, o));
}
function ot({
  open: o,
  onClose: i,
  title: n,
  children: a,
  snapPoints: t,
  initialSnap: r,
  footer: s,
  dismissible: l = !0
}) {
  const { theme: d, scales: m } = y(), h = ee(() => {
    const B = [...t ?? [0.55, 0.92]].map((P) => le(P, 0.1, 0.99)).sort((P, W) => P - W);
    return B.length > 0 ? B : [0.55, 0.92];
  }, [t]), b = h[0], f = h[h.length - 1], C = U.get("window").height, v = typeof globalThis < "u" && globalThis.window?.innerHeight, w = C > 0 ? C : v && v > 0 ? v : 700, R = Math.round(w * f), k = 4, T = 0.18, [K, Be] = S(0), Me = 60, ae = le(r ?? b, b, f), se = D(ae), E = D(new I.Value(R)).current, J = (B, P = Z) => {
    se.current = B, I.timing(E, {
      toValue: (f - B) * w,
      duration: P,
      easing: _.out(_.cubic),
      useNativeDriver: !0
    }).start();
  };
  te(() => {
    o ? (E.setValue(R), J(ae, Z)) : I.timing(E, {
      toValue: R,
      duration: Z,
      easing: _.out(_.cubic),
      useNativeDriver: !0
    }).start();
  }, [o]);
  const ie = D(0), pe = D(ae), me = D(0), ze = D(
    ue.create({
      onStartShouldSetPanResponder: () => !1,
      onMoveShouldSetPanResponder: (B, P) => {
        if (Math.abs(P.dy) < 6) return !1;
        const W = P.dy, M = se.current === f, L = me.current <= 0;
        return M ? !!(W > 0 && L) : !0;
      },
      onPanResponderGrant: () => {
        ie.current = E._value, pe.current = se.current;
      },
      onPanResponderMove: (B, P) => {
        let W = ie.current + P.dy;
        W < 0 && (W = Math.max(-k, W / 4));
        const M = l ? R : (f - b) * w;
        if (W > M) {
          const L = W - M;
          W = M + Math.min(k, L / 4);
        }
        E.setValue(W);
      },
      onPanResponderRelease: (B, P) => {
        const W = le(ie.current + P.dy, 0, R), M = P.dy, L = pe.current;
        if (L === f && M < 0) {
          J(f);
          return;
        }
        if (M < -20) {
          const z = h.indexOf(L), re = z >= 0 && z < h.length - 1 ? h[z + 1] : f;
          J(re);
          return;
        }
        if (M > 0) {
          if (l && L === b && M > R * T) {
            I.timing(E, {
              toValue: R,
              duration: Z,
              easing: _.out(_.cubic),
              useNativeDriver: !0
            }).start(() => i());
            return;
          }
          if (L === f) {
            const z = (f - b) * w;
            if (l && M > z + R * T) {
              I.timing(E, {
                toValue: R,
                duration: Z,
                easing: _.out(_.cubic),
                useNativeDriver: !0
              }).start(() => i());
              return;
            }
            if (M > 40) {
              J(b);
              return;
            }
          }
        }
        const be = f - W / w;
        let ye = h[0], fe = Math.abs(h[0] - be);
        for (let z = 1; z < h.length; z++) {
          const re = Math.abs(h[z] - be);
          re < fe && (fe = re, ye = h[z]);
        }
        J(ye);
      }
    })
  ).current, Ve = E.interpolate({
    inputRange: [0, R],
    outputRange: [0.4, 0],
    extrapolate: "clamp"
  });
  return /* @__PURE__ */ p(q, { visible: o, transparent: !0, animationType: "none", onRequestClose: i, children: [
    /* @__PURE__ */ e(
      I.View,
      {
        pointerEvents: o ? "auto" : "none",
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
        ...ze.panHandlers,
        style: {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: R,
          backgroundColor: d.surface.primary,
          borderTopLeftRadius: m.borderRadius["2xl"],
          borderTopRightRadius: m.borderRadius["2xl"],
          transform: [{ translateY: E }]
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
            n && /* @__PURE__ */ e(
              g,
              {
                style: [
                  u("heading.md"),
                  { color: d.text["high-emphasis"], marginBottom: m.spacing.scale[2] }
                ],
                children: n
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
                paddingBottom: s ? K + Me : m.spacing.scale[4]
              },
              onScroll: (B) => {
                me.current = B.nativeEvent.contentOffset.y;
              },
              scrollEventThrottle: 16,
              keyboardShouldPersistTaps: "handled",
              children: a
            }
          )
        ]
      }
    ),
    s && /* @__PURE__ */ e(
      c,
      {
        pointerEvents: "box-none",
        onLayout: (B) => Be(B.nativeEvent.layout.height),
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
        children: s
      }
    )
  ] });
}
function Kt({ breakpoint: o = 600, ...i }) {
  const { width: n } = U.get("window");
  return n <= o ? /* @__PURE__ */ p(j, { open: i.open, onClose: i.onClose, side: "bottom", title: i.title, children: [
    i.children,
    i.footer
  ] }) : /* @__PURE__ */ e(De, { ...i });
}
function at({ open: o, onClose: i, anchor: n, children: a }) {
  const { theme: t, scales: r } = y(), [s, l] = S({ width: 200, height: 100 }), d = (b) => {
    l({ width: b.nativeEvent.layout.width, height: b.nativeEvent.layout.height });
  }, m = n ? n.y + (n.height ?? 0) + 4 : 100, h = n ? n.x : 0;
  return /* @__PURE__ */ e(q, { visible: o, transparent: !0, animationType: "fade", onRequestClose: i, children: /* @__PURE__ */ e(x, { onPress: i, style: { flex: 1 }, children: /* @__PURE__ */ e(
    c,
    {
      onLayout: d,
      style: {
        position: "absolute",
        top: m,
        left: Math.max(8, h),
        minWidth: 160,
        backgroundColor: t.surface.primary,
        borderRadius: r.borderRadius.lg,
        borderWidth: 1,
        borderColor: t.border["low-emphasis"],
        padding: r.spacing.scale[2],
        shadowColor: t.overlay.dark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6
      },
      children: /* @__PURE__ */ e(x, { onPress: () => {
      }, children: a })
    }
  ) }) });
}
function Jt({ open: o, onClose: i, anchor: n, items: a }) {
  const { theme: t, scales: r } = y();
  return /* @__PURE__ */ e(at, { open: o, onClose: i, anchor: n, children: /* @__PURE__ */ e(c, { style: { minWidth: 180 }, children: a.map((s, l) => /* @__PURE__ */ p(G.Fragment, { children: [
    /* @__PURE__ */ e(
      x,
      {
        onPress: () => {
          s.disabled || (s.onSelect?.(), i());
        },
        disabled: s.disabled,
        style: ({ pressed: d }) => ({
          paddingVertical: r.spacing.scale[2],
          paddingHorizontal: r.spacing.scale[3],
          borderRadius: r.borderRadius.sm,
          backgroundColor: d ? t.surface.secondary : "transparent",
          opacity: s.disabled ? 0.4 : 1
        }),
        children: /* @__PURE__ */ e(
          g,
          {
            style: [
              u("body.md"),
              { color: s.destructive ? t.text.caution : t.text["high-emphasis"] }
            ],
            children: s.label
          }
        )
      }
    ),
    l < a.length - 1 && /* @__PURE__ */ e(Y, {})
  ] }, s.key)) }) });
}
const Pe = he(null);
function Qt() {
  const o = de(Pe);
  if (!o) throw new Error("useToast は ToastProvider の内側で使ってください");
  return o;
}
let Ce = 0;
function st() {
  return Ce += 1, `toast-${Ce}`;
}
function Zt({ children: o }) {
  const { theme: i, scales: n } = y(), [a, t] = S([]), r = xe((l) => {
    t((d) => d.filter((m) => m.id !== l));
  }, []), s = xe(
    (l) => {
      const d = st();
      t((h) => [...h, { ...l, id: d }]);
      const m = l.duration ?? 3e3;
      return setTimeout(() => r(d), m), d;
    },
    [r]
  );
  return /* @__PURE__ */ p(Pe.Provider, { value: { show: s, dismiss: r }, children: [
    o,
    /* @__PURE__ */ e(
      c,
      {
        pointerEvents: "box-none",
        style: {
          position: "absolute",
          top: n.spacing.scale[10],
          left: 0,
          right: 0,
          alignItems: "center",
          gap: n.spacing.scale[2],
          zIndex: 9999
        },
        children: a.map((l) => /* @__PURE__ */ e(it, { toast: l, onDismiss: () => r(l.id) }, l.id))
      }
    )
  ] });
}
function it({ toast: o, onDismiss: i }) {
  const { theme: n, scales: a } = y(), t = D(new I.Value(0)).current, r = D(new I.Value(-20)).current;
  te(() => {
    I.parallel([
      I.timing(t, { toValue: 1, duration: 180, useNativeDriver: !0 }),
      I.timing(r, { toValue: 0, duration: 180, useNativeDriver: !0 })
    ]).start();
  }, [t, r]);
  const s = {
    info: { bg: n.surface.info, fg: n.text.info },
    success: { bg: n.surface.success, fg: n.text.success },
    warning: { bg: n.surface.warning, fg: n.text.warning },
    caution: { bg: n.surface.caution, fg: n.text.caution }
  }[o.tone ?? "info"];
  return /* @__PURE__ */ p(
    I.View,
    {
      style: {
        opacity: t,
        transform: [{ translateY: r }],
        backgroundColor: s.bg,
        borderRadius: a.borderRadius.lg,
        paddingHorizontal: a.spacing.scale[4],
        paddingVertical: a.spacing.scale[3],
        marginHorizontal: a.spacing.scale[4],
        shadowColor: n.overlay.dark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 6,
        flexDirection: "row",
        alignItems: "center",
        gap: a.spacing.scale[3],
        maxWidth: 480
      },
      children: [
        /* @__PURE__ */ p(c, { style: { flex: 1 }, children: [
          o.title && /* @__PURE__ */ e(g, { style: [u("label.md"), { color: s.fg }], children: o.title }),
          o.description && /* @__PURE__ */ e(g, { style: [u("body.sm"), { color: n.text["high-emphasis"] }], children: o.description })
        ] }),
        /* @__PURE__ */ e(x, { onPress: i, hitSlop: 8, children: /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: s.fg }], children: "×" }) })
      ]
    }
  );
}
function er({
  open: o,
  onClose: i,
  side: n = "left",
  header: a,
  sections: t,
  footer: r
}) {
  const { theme: s, scales: l } = y();
  return /* @__PURE__ */ p(j, { open: o, onClose: i, side: n, children: [
    a && /* @__PURE__ */ e(c, { style: { marginBottom: l.spacing.scale[3] }, children: a }),
    /* @__PURE__ */ e(H, { style: { maxHeight: 480 }, children: t.map((d, m) => /* @__PURE__ */ p(c, { style: { marginBottom: l.spacing.scale[3] }, children: [
      d.title && /* @__PURE__ */ e(
        g,
        {
          style: [
            u("label.xs"),
            {
              color: s.text["low-emphasis"],
              paddingHorizontal: l.spacing.scale[2],
              marginBottom: l.spacing.scale[1]
            }
          ],
          children: d.title
        }
      ),
      d.items.map((h, b) => /* @__PURE__ */ p(G.Fragment, { children: [
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
              backgroundColor: h.active ? s.surface["accent-primary-light"] : f ? s.surface.secondary : "transparent"
            }),
            children: [
              h.icon,
              /* @__PURE__ */ e(
                g,
                {
                  style: [
                    u("body.md"),
                    {
                      color: h.active ? s.text["accent-primary"] : s.text["high-emphasis"]
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
    r && /* @__PURE__ */ e(c, { style: { marginTop: l.spacing.scale[3] }, children: r })
  ] });
}
function tr(o) {
  return /* @__PURE__ */ e(rt, { ...o });
}
function rr({
  open: o,
  onClose: i,
  title: n,
  description: a,
  footer: t,
  children: r
}) {
  const { theme: s, scales: l } = y();
  return /* @__PURE__ */ p(j, { open: o, onClose: i, side: "bottom", title: n, children: [
    a && /* @__PURE__ */ e(g, { style: [u("body.sm"), { color: s.text["medium-emphasis"] }], children: a }),
    /* @__PURE__ */ e(H, { style: { maxHeight: 420 }, children: /* @__PURE__ */ e(c, { style: { gap: l.spacing.scale[3], paddingVertical: l.spacing.scale[2] }, children: r }) }),
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
function nr({
  open: o,
  onClose: i,
  title: n = "レビューを投稿",
  onSubmit: a
}) {
  const { theme: t, scales: r } = y(), [s, l] = S(0), [d, m] = S("");
  return /* @__PURE__ */ p(j, { open: o, onClose: i, side: "bottom", title: n, children: [
    /* @__PURE__ */ e(c, { style: { alignItems: "center", marginVertical: r.spacing.scale[3] }, children: /* @__PURE__ */ e(oe, { value: s, onChange: l, size: 32 }) }),
    /* @__PURE__ */ e(
      Qe,
      {
        value: d,
        onChangeText: m,
        placeholder: "コメントを入力",
        minHeight: 120
      }
    ),
    /* @__PURE__ */ p(c, { style: { flexDirection: "row", gap: r.spacing.scale[2], marginTop: r.spacing.scale[3] }, children: [
      /* @__PURE__ */ e(c, { style: { flex: 1 }, children: /* @__PURE__ */ e(V, { variant: "tertiary", onPress: i, children: "キャンセル" }) }),
      /* @__PURE__ */ e(c, { style: { flex: 1 }, children: /* @__PURE__ */ e(
        V,
        {
          variant: "primary",
          disabled: s === 0,
          onPress: () => {
            a?.(s, d), i();
          },
          children: "送信"
        }
      ) })
    ] })
  ] });
}
function or({
  title: o,
  description: i,
  step: n,
  total: a,
  onNext: t,
  onSkip: r,
  nextLabel: s = "次へ",
  skipLabel: l = "スキップ"
}) {
  const { theme: d, scales: m } = y();
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        backgroundColor: d.surface.inverse,
        borderRadius: m.borderRadius.xl,
        paddingVertical: m.spacing.scale[4],
        paddingHorizontal: m.spacing.scale[5],
        maxWidth: 320,
        shadowColor: d.overlay.dark,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.24,
        shadowRadius: 16,
        elevation: 8
      },
      children: [
        o && /* @__PURE__ */ e(
          g,
          {
            style: [
              u("label.lg"),
              {
                color: d.text["on-inverse"],
                marginBottom: m.spacing.scale[1]
              }
            ],
            children: o
          }
        ),
        /* @__PURE__ */ e(
          g,
          {
            style: [
              u("body.md"),
              {
                color: d.text["on-inverse-secondary"],
                marginBottom: m.spacing.scale[4]
              }
            ],
            children: i
          }
        ),
        /* @__PURE__ */ p(
          c,
          {
            style: {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: m.spacing.scale[3]
            },
            children: [
              n !== void 0 && a !== void 0 ? /* @__PURE__ */ e(c, { style: { flexDirection: "row", gap: m.spacing.scale[1], alignItems: "center" }, children: Array.from({ length: a }).map((h, b) => {
                const f = b + 1 === n;
                return /* @__PURE__ */ e(
                  c,
                  {
                    style: {
                      width: f ? 18 : 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: f ? d.brand.primary : d.text["on-inverse-secondary"],
                      opacity: f ? 1 : 0.4
                    }
                  },
                  b
                );
              }) }) : /* @__PURE__ */ e(c, {}),
              /* @__PURE__ */ p(c, { style: { flexDirection: "row", gap: m.spacing.scale[1], alignItems: "center" }, children: [
                r && /* @__PURE__ */ e(
                  x,
                  {
                    onPress: r,
                    hitSlop: 6,
                    style: ({ pressed: h }) => ({
                      paddingVertical: m.spacing.scale[2],
                      paddingHorizontal: m.spacing.scale[3],
                      opacity: h ? 0.5 : 1
                    }),
                    children: /* @__PURE__ */ e(
                      g,
                      {
                        style: [
                          u("label.md"),
                          { color: d.text["on-inverse-secondary"] }
                        ],
                        children: l
                      }
                    )
                  }
                ),
                t && /* @__PURE__ */ e(
                  x,
                  {
                    onPress: t,
                    style: ({ pressed: h }) => ({
                      paddingVertical: m.spacing.scale[2],
                      paddingHorizontal: m.spacing.scale[4],
                      borderRadius: m.borderRadius.full,
                      backgroundColor: h ? d.active["primary-button"] : d.brand.primary
                    }),
                    children: /* @__PURE__ */ e(
                      g,
                      {
                        style: [
                          u("label.md"),
                          { color: d.text["on-inverse"] }
                        ],
                        children: s
                      }
                    )
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
}
function ar({ open: o, onClose: i, highlight: n, children: a }) {
  const { theme: t } = y(), r = t.overlay.dark;
  return /* @__PURE__ */ e(q, { visible: o, transparent: !0, animationType: "fade", onRequestClose: i, children: /* @__PURE__ */ p(x, { onPress: i, style: { flex: 1 }, children: [
    n ? /* @__PURE__ */ p(A, { children: [
      /* @__PURE__ */ e(
        c,
        {
          style: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: n.y,
            backgroundColor: r
          }
        }
      ),
      /* @__PURE__ */ e(
        c,
        {
          style: {
            position: "absolute",
            top: n.y,
            left: 0,
            width: n.x,
            height: n.height,
            backgroundColor: r
          }
        }
      ),
      /* @__PURE__ */ e(
        c,
        {
          style: {
            position: "absolute",
            top: n.y,
            left: n.x + n.width,
            right: 0,
            height: n.height,
            backgroundColor: r
          }
        }
      ),
      /* @__PURE__ */ e(
        c,
        {
          style: {
            position: "absolute",
            top: n.y + n.height,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: r
          }
        }
      ),
      /* @__PURE__ */ e(
        c,
        {
          style: {
            position: "absolute",
            top: n.y,
            left: n.x,
            width: n.width,
            height: n.height,
            borderRadius: n.radius ?? 12,
            borderWidth: 2,
            borderColor: t.brand.primary
          }
        }
      )
    ] }) : /* @__PURE__ */ e(c, { style: { flex: 1, backgroundColor: r } }),
    /* @__PURE__ */ e(c, { style: { position: "absolute", left: 0, right: 0, bottom: 80, alignItems: "center" }, children: /* @__PURE__ */ e(x, { onPress: () => {
    }, children: a }) })
  ] }) });
}
function sr({
  options: o,
  value: i,
  onChange: n,
  placeholder: a = "選択",
  disabled: t = !1,
  title: r = "選択"
}) {
  const { theme: s, scales: l } = y(), [d, m] = S(!1), h = o.find((b) => b.value === i);
  return /* @__PURE__ */ p(A, { children: [
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
          borderColor: s.border["medium-emphasis"],
          backgroundColor: t ? s.surface.disable : s.surface.primary,
          opacity: t ? 0.6 : 1
        },
        children: [
          /* @__PURE__ */ e(
            g,
            {
              style: [
                u("body.md"),
                { color: h ? s.text["high-emphasis"] : s.text["low-emphasis"] }
              ],
              children: h ? h.label : a
            }
          ),
          /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: s.text["low-emphasis"] }], children: "▾" })
        ]
      }
    ),
    /* @__PURE__ */ e(j, { open: d, onClose: () => m(!1), side: "bottom", title: r, children: /* @__PURE__ */ e(c, { children: o.map((b, f) => /* @__PURE__ */ p(G.Fragment, { children: [
      /* @__PURE__ */ p(
        x,
        {
          onPress: () => {
            b.disabled || (n?.(b.value), m(!1));
          },
          disabled: b.disabled,
          style: ({ pressed: C }) => ({
            paddingVertical: l.spacing.scale[3],
            paddingHorizontal: l.spacing.scale[2],
            backgroundColor: C ? s.surface.secondary : "transparent",
            opacity: b.disabled ? 0.4 : 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }),
          children: [
            /* @__PURE__ */ e(g, { style: [u("body.md"), { color: s.text["high-emphasis"] }], children: b.label }),
            i === b.value && /* @__PURE__ */ e(g, { style: [u("label.md"), { color: s.text["accent-primary"] }], children: "✓" })
          ]
        }
      ),
      f < o.length - 1 && /* @__PURE__ */ e(Y, {})
    ] }, b.value)) }) })
  ] });
}
function ir({
  options: o,
  value: i,
  onChange: n,
  placeholder: a = "選択",
  searchPlaceholder: t = "検索",
  emptyMessage: r = "該当なし",
  disabled: s = !1
}) {
  const { theme: l, scales: d } = y(), [m, h] = S(!1), [b, f] = S(""), C = o.find((w) => w.value === i), v = ee(() => {
    if (!b) return o;
    const w = b.toLowerCase();
    return o.filter((R) => R.label.toLowerCase().includes(w));
  }, [o, b]);
  return /* @__PURE__ */ p(A, { children: [
    /* @__PURE__ */ p(
      x,
      {
        onPress: () => !s && h(!0),
        disabled: s,
        style: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: d.touchTargets.textInput.min,
          paddingHorizontal: d.spacing.scale[3],
          borderRadius: d.borderRadius.md,
          borderWidth: 1,
          borderColor: l.border["medium-emphasis"],
          backgroundColor: s ? l.surface.disable : l.surface.primary,
          opacity: s ? 0.6 : 1
        },
        children: [
          /* @__PURE__ */ e(
            g,
            {
              style: [
                u("body.md"),
                { color: C ? l.text["high-emphasis"] : l.text["low-emphasis"] }
              ],
              children: C ? C.label : a
            }
          ),
          /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: l.text["low-emphasis"] }], children: "▾" })
        ]
      }
    ),
    /* @__PURE__ */ p(j, { open: m, onClose: () => h(!1), side: "bottom", title: "選択", children: [
      /* @__PURE__ */ e(Te, { value: b, onChangeText: f, placeholder: t }),
      /* @__PURE__ */ e(c, { style: { height: 360, marginTop: d.spacing.scale[2] }, children: v.length === 0 ? /* @__PURE__ */ e(
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
          children: r
        }
      ) : /* @__PURE__ */ e(
        $,
        {
          data: v,
          keyExtractor: (w) => w.value,
          renderItem: ({ item: w }) => /* @__PURE__ */ p(
            x,
            {
              onPress: () => {
                n?.(w.value), f(""), h(!1);
              },
              style: ({ pressed: R }) => ({
                paddingVertical: d.spacing.scale[3],
                paddingHorizontal: d.spacing.scale[2],
                backgroundColor: R ? l.surface.secondary : "transparent",
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
function lr({
  options: o,
  values: i = [],
  onChange: n,
  placeholder: a = "選択",
  searchPlaceholder: t = "検索",
  disabled: r = !1
}) {
  const { theme: s, scales: l } = y(), [d, m] = S(!1), [h, b] = S(""), [f, C] = S(i), v = ee(() => {
    if (!h) return o;
    const R = h.toLowerCase();
    return o.filter((k) => k.label.toLowerCase().includes(R));
  }, [o, h]), w = i.length === 0 ? a : i.length === 1 ? o.find((R) => R.value === i[0])?.label ?? a : `${i.length}件選択中`;
  return /* @__PURE__ */ p(A, { children: [
    /* @__PURE__ */ p(
      x,
      {
        onPress: () => {
          r || (C(i), m(!0));
        },
        disabled: r,
        style: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: l.touchTargets.textInput.min,
          paddingHorizontal: l.spacing.scale[3],
          borderRadius: l.borderRadius.md,
          borderWidth: 1,
          borderColor: s.border["medium-emphasis"],
          backgroundColor: r ? s.surface.disable : s.surface.primary,
          opacity: r ? 0.6 : 1
        },
        children: [
          /* @__PURE__ */ e(
            g,
            {
              style: [
                u("body.md"),
                { color: i.length > 0 ? s.text["high-emphasis"] : s.text["low-emphasis"] }
              ],
              children: w
            }
          ),
          /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: s.text["low-emphasis"] }], children: "▾" })
        ]
      }
    ),
    /* @__PURE__ */ p(j, { open: d, onClose: () => m(!1), side: "bottom", title: "複数選択", children: [
      /* @__PURE__ */ e(Te, { value: h, onChangeText: b, placeholder: t }),
      /* @__PURE__ */ e(c, { style: { height: 320, marginTop: l.spacing.scale[2] }, children: /* @__PURE__ */ e(
        $,
        {
          data: v,
          keyExtractor: (R) => R.value,
          renderItem: ({ item: R }) => {
            const k = f.includes(R.value);
            return /* @__PURE__ */ p(
              x,
              {
                onPress: () => {
                  C(
                    (T) => T.includes(R.value) ? T.filter((K) => K !== R.value) : [...T, R.value]
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
                  /* @__PURE__ */ e(g, { style: [u("body.md"), { color: s.text["high-emphasis"], flex: 1 }], children: R.label })
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
            /* @__PURE__ */ e(c, { style: { flex: 1 }, children: /* @__PURE__ */ e(V, { variant: "tertiary", onPress: () => m(!1), children: "キャンセル" }) }),
            /* @__PURE__ */ e(c, { style: { flex: 1 }, children: /* @__PURE__ */ e(
              V,
              {
                variant: "primary",
                onPress: () => {
                  n?.(f), m(!1);
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
function cr({ label: o, options: i, value: n, onChange: a }) {
  const { theme: t, scales: r } = y(), [s, l] = S(!1), d = i.find((h) => h.value === n), m = !!d;
  return /* @__PURE__ */ p(A, { children: [
    /* @__PURE__ */ p(
      x,
      {
        onPress: () => l(!0),
        style: ({ pressed: h }) => ({
          flexDirection: "row",
          alignItems: "center",
          gap: r.spacing.scale[1],
          paddingVertical: r.spacing.scale[2],
          paddingHorizontal: r.spacing.scale[3],
          borderRadius: r.borderRadius.full,
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
                o,
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
    /* @__PURE__ */ e(j, { open: s, onClose: () => l(!1), side: "bottom", title: o, children: /* @__PURE__ */ p(c, { children: [
      /* @__PURE__ */ e(
        x,
        {
          onPress: () => {
            a?.(void 0), l(!1);
          },
          style: ({ pressed: h }) => ({
            paddingVertical: r.spacing.scale[3],
            backgroundColor: h ? t.surface.secondary : "transparent"
          }),
          children: /* @__PURE__ */ e(g, { style: [u("body.md"), { color: t.text["medium-emphasis"] }], children: "すべて" })
        }
      ),
      /* @__PURE__ */ e(Y, {}),
      i.map((h, b) => /* @__PURE__ */ p(G.Fragment, { children: [
        /* @__PURE__ */ p(
          x,
          {
            onPress: () => {
              a?.(h.value), l(!1);
            },
            style: ({ pressed: f }) => ({
              paddingVertical: r.spacing.scale[3],
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: f ? t.surface.secondary : "transparent"
            }),
            children: [
              /* @__PURE__ */ e(g, { style: [u("body.md"), { color: t.text["high-emphasis"] }], children: h.label }),
              /* @__PURE__ */ p(c, { style: { flexDirection: "row", alignItems: "center", gap: 8 }, children: [
                h.count !== void 0 && /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: t.text["low-emphasis"] }], children: h.count }),
                n === h.value && /* @__PURE__ */ e(g, { style: [u("label.md"), { color: t.text["accent-primary"] }], children: "✓" })
              ] })
            ]
          }
        ),
        b < i.length - 1 && /* @__PURE__ */ e(Y, {})
      ] }, h.value))
    ] }) })
  ] });
}
function dr({ options: o, value: i, onChange: n, disabled: a = !1 }) {
  const { theme: t, scales: r } = y();
  return /* @__PURE__ */ e(
    c,
    {
      style: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: r.spacing.scale[2]
      },
      children: o.map((s) => {
        const l = i === s.value;
        return /* @__PURE__ */ p(
          x,
          {
            onPress: () => !a && n?.(s.value),
            disabled: a,
            style: ({ pressed: d }) => ({
              flexDirection: "row",
              alignItems: "center",
              gap: r.spacing.scale[1],
              paddingHorizontal: r.spacing.scale[3],
              height: 36,
              borderRadius: r.borderRadius.full,
              backgroundColor: l ? t.brand.primary : d ? t.active["secondary-button"] : t.surface.secondary,
              opacity: a ? 0.5 : 1
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
                  children: s.label
                }
              ),
              s.count !== void 0 && /* @__PURE__ */ e(
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
                      children: s.count
                    }
                  )
                }
              )
            ]
          },
          s.value
        );
      })
    }
  );
}
const We = he(null);
function He() {
  const o = de(We);
  if (!o) throw new Error("Tabs の内側で使ってください");
  return o;
}
function hr({ value: o, onChange: i, children: n }) {
  return /* @__PURE__ */ e(We.Provider, { value: { value: o, onChange: i }, children: n });
}
function ur({ scrollable: o = !1, children: i }) {
  const { theme: n, scales: a } = y(), t = /* @__PURE__ */ e(
    c,
    {
      style: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: n.border["low-emphasis"],
        gap: a.spacing.scale[1]
      },
      children: i
    }
  );
  return o ? /* @__PURE__ */ e(H, { horizontal: !0, showsHorizontalScrollIndicator: !1, children: t }) : t;
}
function gr({ value: o, children: i, disabled: n }) {
  const { theme: a, scales: t } = y(), r = He(), s = r.value === o;
  return /* @__PURE__ */ e(
    x,
    {
      onPress: () => !n && r.onChange(o),
      disabled: n,
      style: {
        paddingVertical: t.spacing.scale[2],
        paddingHorizontal: t.spacing.scale[3],
        borderBottomWidth: 2,
        borderBottomColor: s ? a.brand.primary : "transparent",
        opacity: n ? 0.4 : 1
      },
      children: /* @__PURE__ */ e(
        g,
        {
          style: [
            u("label.md"),
            {
              color: s ? a.text["accent-primary"] : a.text["medium-emphasis"],
              fontWeight: s ? "700" : "500"
            }
          ],
          children: i
        }
      )
    }
  );
}
function pr({ value: o, children: i }) {
  return He().value !== o ? null : /* @__PURE__ */ e(c, { children: i });
}
const lt = ["日", "月", "火", "水", "木", "金", "土"], ct = ["S", "M", "T", "W", "T", "F", "S"], dt = [
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
function ht(o) {
  return new Date(o.getFullYear(), o.getMonth(), 1);
}
function ut(o) {
  return new Date(o.getFullYear(), o.getMonth() + 1, 0).getDate();
}
function Re(o, i) {
  return o.getFullYear() === i.getFullYear() && o.getMonth() === i.getMonth() && o.getDate() === i.getDate();
}
function gt({ value: o, onChange: i, minDate: n, maxDate: a, locale: t = "ja" }) {
  const { theme: r, scales: s } = y(), [l, d] = S(o ?? /* @__PURE__ */ new Date()), m = t === "ja" ? lt : ct, h = ee(() => {
    const w = ht(l).getDay(), R = ut(l), k = [];
    for (let T = 0; T < w; T++) k.push(null);
    for (let T = 1; T <= R; T++) k.push(new Date(l.getFullYear(), l.getMonth(), T));
    for (; k.length % 7 !== 0; ) k.push(null);
    return k;
  }, [l]), b = t === "ja" ? `${l.getFullYear()}年 ${dt[l.getMonth()]}` : `${l.getFullYear()}-${String(l.getMonth() + 1).padStart(2, "0")}`, f = () => d((v) => new Date(v.getFullYear(), v.getMonth() - 1, 1)), C = () => d((v) => new Date(v.getFullYear(), v.getMonth() + 1, 1));
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        backgroundColor: r.surface.primary,
        borderRadius: s.borderRadius.lg,
        borderWidth: 1,
        borderColor: r.border["low-emphasis"],
        padding: s.spacing.scale[3],
        gap: s.spacing.scale[2]
      },
      children: [
        /* @__PURE__ */ p(c, { style: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, children: [
          /* @__PURE__ */ e(x, { onPress: f, hitSlop: 8, children: /* @__PURE__ */ e(g, { style: [u("label.lg"), { color: r.text["medium-emphasis"] }], children: "‹" }) }),
          /* @__PURE__ */ e(g, { style: [u("label.md"), { color: r.text["high-emphasis"] }], children: b }),
          /* @__PURE__ */ e(x, { onPress: C, hitSlop: 8, children: /* @__PURE__ */ e(g, { style: [u("label.lg"), { color: r.text["medium-emphasis"] }], children: "›" }) })
        ] }),
        /* @__PURE__ */ e(c, { style: { flexDirection: "row" }, children: m.map((v, w) => /* @__PURE__ */ e(c, { style: { flex: 1, alignItems: "center" }, children: /* @__PURE__ */ e(g, { style: [u("label.xs"), { color: r.text["low-emphasis"] }], children: v }) }, w)) }),
        /* @__PURE__ */ e(c, { style: { flexDirection: "row", flexWrap: "wrap" }, children: h.map((v, w) => {
          if (!v) return /* @__PURE__ */ e(c, { style: { width: `${100 / 7}%`, aspectRatio: 1 } }, w);
          const R = n && v < new Date(n.getFullYear(), n.getMonth(), n.getDate()) || a && v > new Date(a.getFullYear(), a.getMonth(), a.getDate()), k = o && Re(v, o), T = Re(v, /* @__PURE__ */ new Date());
          return /* @__PURE__ */ e(c, { style: { width: `${100 / 7}%`, aspectRatio: 1, padding: 2 }, children: /* @__PURE__ */ e(
            x,
            {
              onPress: () => !R && i?.(v),
              disabled: !!R,
              style: {
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: s.borderRadius.full,
                backgroundColor: k ? r.brand.primary : "transparent",
                borderWidth: T && !k ? 1 : 0,
                borderColor: r.border["accent-primary"],
                opacity: R ? 0.3 : 1
              },
              children: /* @__PURE__ */ e(
                g,
                {
                  style: [
                    u("body.sm"),
                    {
                      color: k ? r.text["on-inverse"] : r.text["high-emphasis"],
                      fontWeight: k || T ? "700" : "400"
                    }
                  ],
                  children: v.getDate()
                }
              )
            }
          ) }, w);
        }) })
      ]
    }
  );
}
function pt(o) {
  return `${o.getFullYear()}/${String(o.getMonth() + 1).padStart(2, "0")}/${String(o.getDate()).padStart(2, "0")}`;
}
function mr({
  value: o,
  onChange: i,
  placeholder: n = "日付を選択",
  minDate: a,
  maxDate: t,
  disabled: r = !1,
  formatter: s = pt
}) {
  const { theme: l, scales: d } = y(), [m, h] = S(!1), [b, f] = S(o);
  return /* @__PURE__ */ p(A, { children: [
    /* @__PURE__ */ p(
      x,
      {
        onPress: () => {
          r || (f(o), h(!0));
        },
        disabled: r,
        style: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: d.touchTargets.textInput.min,
          paddingHorizontal: d.spacing.scale[3],
          borderRadius: d.borderRadius.md,
          borderWidth: 1,
          borderColor: l.border["medium-emphasis"],
          backgroundColor: r ? l.surface.disable : l.surface.primary,
          opacity: r ? 0.6 : 1
        },
        children: [
          /* @__PURE__ */ e(
            g,
            {
              style: [
                u("body.md"),
                { color: o ? l.text["high-emphasis"] : l.text["low-emphasis"] }
              ],
              children: o ? s(o) : n
            }
          ),
          /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: l.text["low-emphasis"] }], children: "📅" })
        ]
      }
    ),
    /* @__PURE__ */ p(j, { open: m, onClose: () => h(!1), side: "bottom", title: "日付を選択", children: [
      /* @__PURE__ */ e(gt, { value: b, onChange: f, minDate: a, maxDate: t }),
      /* @__PURE__ */ p(
        c,
        {
          style: {
            flexDirection: "row",
            gap: d.spacing.scale[2],
            marginTop: d.spacing.scale[3]
          },
          children: [
            /* @__PURE__ */ e(c, { style: { flex: 1 }, children: /* @__PURE__ */ e(V, { variant: "tertiary", onPress: () => h(!1), children: "キャンセル" }) }),
            /* @__PURE__ */ e(c, { style: { flex: 1 }, children: /* @__PURE__ */ e(
              V,
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
function ne(o) {
  return o.toString().padStart(2, "0");
}
function br({
  value: o,
  onChange: i,
  placeholder: n = "時刻を選択",
  minuteStep: a = 5,
  disabled: t = !1
}) {
  const { theme: r, scales: s } = y(), [l, d] = S(!1), [m, h] = S(o?.hour ?? 9), [b, f] = S(o?.minute ?? 0), C = Array.from({ length: 24 }, (w, R) => R), v = Array.from({ length: 60 / a }, (w, R) => R * a);
  return /* @__PURE__ */ p(A, { children: [
    /* @__PURE__ */ p(
      x,
      {
        onPress: () => {
          t || (h(o?.hour ?? 9), f(o?.minute ?? 0), d(!0));
        },
        disabled: t,
        style: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: s.touchTargets.textInput.min,
          paddingHorizontal: s.spacing.scale[3],
          borderRadius: s.borderRadius.md,
          borderWidth: 1,
          borderColor: r.border["medium-emphasis"],
          backgroundColor: t ? r.surface.disable : r.surface.primary,
          opacity: t ? 0.6 : 1
        },
        children: [
          /* @__PURE__ */ e(
            g,
            {
              style: [
                u("body.md"),
                { color: o ? r.text["high-emphasis"] : r.text["low-emphasis"] }
              ],
              children: o ? `${ne(o.hour)}:${ne(o.minute)}` : n
            }
          ),
          /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: r.text["low-emphasis"] }], children: "🕐" })
        ]
      }
    ),
    /* @__PURE__ */ p(j, { open: l, onClose: () => d(!1), side: "bottom", title: "時刻を選択", children: [
      /* @__PURE__ */ p(c, { style: { flexDirection: "row", height: 220, gap: s.spacing.scale[3] }, children: [
        /* @__PURE__ */ e(H, { style: { flex: 1 }, showsVerticalScrollIndicator: !1, children: C.map((w) => /* @__PURE__ */ e(
          x,
          {
            onPress: () => h(w),
            style: {
              paddingVertical: s.spacing.scale[2],
              alignItems: "center",
              backgroundColor: m === w ? r.surface["accent-primary-light"] : "transparent",
              borderRadius: s.borderRadius.sm
            },
            children: /* @__PURE__ */ e(
              g,
              {
                style: [
                  u("body.lg"),
                  {
                    color: m === w ? r.text["accent-primary"] : r.text["high-emphasis"],
                    fontWeight: m === w ? "700" : "400"
                  }
                ],
                children: ne(w)
              }
            )
          },
          w
        )) }),
        /* @__PURE__ */ e(H, { style: { flex: 1 }, showsVerticalScrollIndicator: !1, children: v.map((w) => /* @__PURE__ */ e(
          x,
          {
            onPress: () => f(w),
            style: {
              paddingVertical: s.spacing.scale[2],
              alignItems: "center",
              backgroundColor: b === w ? r.surface["accent-primary-light"] : "transparent",
              borderRadius: s.borderRadius.sm
            },
            children: /* @__PURE__ */ e(
              g,
              {
                style: [
                  u("body.lg"),
                  {
                    color: b === w ? r.text["accent-primary"] : r.text["high-emphasis"],
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
            gap: s.spacing.scale[2],
            marginTop: s.spacing.scale[3]
          },
          children: [
            /* @__PURE__ */ e(c, { style: { flex: 1 }, children: /* @__PURE__ */ e(V, { variant: "tertiary", onPress: () => d(!1), children: "キャンセル" }) }),
            /* @__PURE__ */ e(c, { style: { flex: 1 }, children: /* @__PURE__ */ e(
              V,
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
function yr({ items: o, type: i = "single", defaultOpenKeys: n = [] }) {
  const { theme: a, scales: t } = y(), [r, s] = S(new Set(n)), l = (d) => {
    s((m) => {
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
        borderColor: a.border["low-emphasis"],
        backgroundColor: a.surface.primary,
        overflow: "hidden"
      },
      children: o.map((d, m) => {
        const h = r.has(d.key);
        return /* @__PURE__ */ p(
          c,
          {
            style: {
              borderTopWidth: m === 0 ? 0 : 1,
              borderTopColor: a.border["low-emphasis"]
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
                    backgroundColor: b ? a.surface.secondary : "transparent"
                  }),
                  children: [
                    /* @__PURE__ */ e(g, { style: [u("label.md"), { color: a.text["high-emphasis"], flex: 1 }], children: d.title }),
                    /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: a.text["low-emphasis"] }], children: h ? "▾" : "▸" })
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
function fr({ title: o, defaultOpen: i = !1, children: n }) {
  const { theme: a, scales: t } = y(), [r, s] = S(i);
  return /* @__PURE__ */ p(c, { children: [
    /* @__PURE__ */ p(
      x,
      {
        onPress: () => s((l) => !l),
        style: {
          flexDirection: "row",
          alignItems: "center",
          gap: t.spacing.scale[1]
        },
        children: [
          /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: a.text["accent-primary"] }], children: r ? "▾" : "▸" }),
          /* @__PURE__ */ e(g, { style: [u("label.md"), { color: a.text["accent-primary"] }], children: o })
        ]
      }
    ),
    r && /* @__PURE__ */ e(c, { style: { marginTop: t.spacing.scale[2] }, children: n })
  ] });
}
function xr({ maxHeight: o, bordered: i, children: n, ...a }) {
  const { theme: t, scales: r } = y();
  return /* @__PURE__ */ e(
    c,
    {
      style: {
        maxHeight: o,
        borderWidth: i ? 1 : 0,
        borderColor: t.border["low-emphasis"],
        borderRadius: i ? r.borderRadius.lg : 0,
        overflow: "hidden"
      },
      children: /* @__PURE__ */ e(H, { ...a, children: n })
    }
  );
}
function mt(o, i) {
  const n = [];
  for (let a = o; a <= i; a++) n.push(a);
  return n;
}
function wr({ page: o, total: i, onChange: n, windowSize: a = 5 }) {
  const { theme: t, scales: r } = y(), s = Math.floor(a / 2);
  let l = Math.max(1, o - s), d = Math.min(i, l + a - 1);
  d - l + 1 < a && (l = Math.max(1, d - a + 1));
  const m = mt(l, d), h = (b, f, C = !1, v = !1) => /* @__PURE__ */ e(
    x,
    {
      onPress: () => f && !C && n?.(f),
      disabled: C || !f,
      style: ({ pressed: w }) => ({
        minWidth: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: r.borderRadius.md,
        backgroundColor: v ? t.brand.primary : w ? t.active["tertiary-button"] : t.surface.primary,
        borderWidth: v ? 0 : 1,
        borderColor: t.border["low-emphasis"],
        opacity: C ? 0.4 : 1,
        paddingHorizontal: r.spacing.scale[2]
      }),
      children: /* @__PURE__ */ e(
        g,
        {
          style: [
            u("label.sm"),
            { color: v ? t.text["on-inverse"] : t.text["high-emphasis"] }
          ],
          children: b
        }
      )
    },
    b
  );
  return /* @__PURE__ */ p(c, { style: { flexDirection: "row", gap: r.spacing.scale[1], alignSelf: "center" }, children: [
    h("‹", o > 1 ? o - 1 : null, o <= 1),
    l > 1 && h("1", 1),
    l > 2 && h("…", null, !0),
    m.map((b) => h(String(b), b, !1, b === o)),
    d < i - 1 && h("…", null, !0),
    d < i && h(String(i), i),
    h("›", o < i ? o + 1 : null, o >= i)
  ] });
}
function Cr({ page: o, total: i, onChange: n }) {
  const { theme: a, scales: t } = y(), r = (s, l, d) => /* @__PURE__ */ e(
    x,
    {
      onPress: () => !d && n?.(l),
      disabled: d,
      style: ({ pressed: m }) => ({
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: t.borderRadius.full,
        backgroundColor: m ? a.active["tertiary-button"] : a.surface.secondary,
        opacity: d ? 0.4 : 1
      }),
      children: /* @__PURE__ */ e(g, { style: [u("label.md"), { color: a.text["high-emphasis"] }], children: s })
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
        r("‹", o - 1, o <= 1),
        /* @__PURE__ */ p(g, { style: [u("label.md"), { color: a.text["medium-emphasis"] }], children: [
          o,
          " / ",
          i
        ] }),
        r("›", o + 1, o >= i)
      ]
    }
  );
}
function bt({ items: o, value: i, onChange: n }) {
  const { theme: a, scales: t } = y();
  return /* @__PURE__ */ e(
    c,
    {
      style: {
        flexDirection: "row",
        backgroundColor: a.surface.primary,
        borderTopWidth: 1,
        borderTopColor: a.border["low-emphasis"],
        paddingBottom: O.OS === "ios" ? 24 : 0
      },
      children: o.map((r) => {
        const s = i === r.key;
        return /* @__PURE__ */ p(
          x,
          {
            onPress: () => {
              r.onPress?.(), n?.(r.key);
            },
            style: ({ pressed: l }) => ({
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: t.spacing.scale[2],
              backgroundColor: l ? a.surface.secondary : "transparent",
              gap: 2,
              minHeight: t.touchTargets.navItem.min
            }),
            children: [
              /* @__PURE__ */ p(c, { style: { position: "relative" }, children: [
                r.icon,
                r.badge !== void 0 && r.badge > 0 && /* @__PURE__ */ e(
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
                      backgroundColor: a.caution.base,
                      alignItems: "center",
                      justifyContent: "center"
                    },
                    children: /* @__PURE__ */ e(g, { style: [u("label.xs"), { color: a.text["on-inverse"] }], children: r.badge > 99 ? "99+" : r.badge })
                  }
                )
              ] }),
              /* @__PURE__ */ e(
                g,
                {
                  style: [
                    u("label.xs"),
                    { color: s ? a.text["accent-primary"] : a.text["medium-emphasis"] }
                  ],
                  children: r.label
                }
              )
            ]
          },
          r.key
        );
      })
    }
  );
}
function Rr({ items: o, value: i, onChange: n }) {
  const { theme: a, scales: t } = y();
  return /* @__PURE__ */ e(
    H,
    {
      horizontal: !0,
      showsHorizontalScrollIndicator: !1,
      contentContainerStyle: { paddingHorizontal: t.spacing.scale[3], gap: t.spacing.scale[2] },
      style: {
        backgroundColor: a.surface.primary,
        borderBottomWidth: 1,
        borderBottomColor: a.border["low-emphasis"]
      },
      children: o.map((r) => {
        const s = i === r.key;
        return /* @__PURE__ */ p(
          x,
          {
            onPress: () => n?.(r.key),
            style: {
              flexDirection: "row",
              alignItems: "center",
              gap: t.spacing.scale[1],
              paddingVertical: t.spacing.scale[3],
              borderBottomWidth: 2,
              borderBottomColor: s ? a.brand.primary : "transparent"
            },
            children: [
              /* @__PURE__ */ e(
                g,
                {
                  style: [
                    u("label.md"),
                    {
                      color: s ? a.text["accent-primary"] : a.text["medium-emphasis"],
                      fontWeight: s ? "700" : "500"
                    }
                  ],
                  children: r.label
                }
              ),
              r.count !== void 0 && /* @__PURE__ */ e(
                c,
                {
                  style: {
                    paddingHorizontal: 6,
                    borderRadius: 999,
                    backgroundColor: s ? a.surface["accent-primary-light"] : a.surface.tertiary,
                    minWidth: 20,
                    alignItems: "center"
                  },
                  children: /* @__PURE__ */ e(
                    g,
                    {
                      style: [
                        u("label.xs"),
                        { color: s ? a.text["accent-primary"] : a.text["medium-emphasis"] }
                      ],
                      children: r.count
                    }
                  )
                }
              )
            ]
          },
          r.key
        );
      })
    }
  );
}
function vr({ title: o, onBack: i, backLabel: n = "戻る", rightSlot: a }) {
  const { theme: t, scales: r } = y();
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: r.spacing.scale[2],
        paddingHorizontal: r.spacing.scale[3],
        paddingVertical: r.spacing.scale[2],
        backgroundColor: t.surface.primary,
        borderBottomWidth: 1,
        borderBottomColor: t.border["low-emphasis"]
      },
      children: [
        /* @__PURE__ */ p(c, { style: { flexDirection: "row", alignItems: "center", gap: r.spacing.scale[2], flex: 1 }, children: [
          i && /* @__PURE__ */ p(
            x,
            {
              onPress: i,
              hitSlop: 8,
              style: ({ pressed: s }) => ({
                padding: r.spacing.scale[1],
                borderRadius: r.borderRadius.md,
                backgroundColor: s ? t.surface.secondary : "transparent",
                flexDirection: "row",
                alignItems: "center",
                gap: 4
              }),
              children: [
                /* @__PURE__ */ e(g, { style: [u("label.md"), { color: t.text["accent-primary"] }], children: "‹" }),
                /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: t.text["accent-primary"] }], children: n })
              ]
            }
          ),
          /* @__PURE__ */ e(
            g,
            {
              numberOfLines: 1,
              style: [u("heading.md"), { color: t.text["high-emphasis"], flex: 1 }],
              children: o
            }
          )
        ] }),
        a
      ]
    }
  );
}
function kr({ title: o, subtitle: i, leading: n, trailing: a, onBack: t, centered: r = !0 }) {
  const { theme: s, scales: l } = y(), d = n ?? (t ? /* @__PURE__ */ e(
    x,
    {
      onPress: t,
      hitSlop: 8,
      style: ({ pressed: m }) => ({
        padding: l.spacing.scale[1],
        borderRadius: l.borderRadius.md,
        backgroundColor: m ? s.surface.secondary : "transparent"
      }),
      children: /* @__PURE__ */ e(g, { style: [u("heading.lg"), { color: s.text["high-emphasis"] }], children: "‹" })
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
        paddingTop: O.OS === "ios" ? 48 : l.spacing.scale[3],
        paddingBottom: l.spacing.scale[3],
        backgroundColor: s.surface.primary,
        borderBottomWidth: 1,
        borderBottomColor: s.border["low-emphasis"]
      },
      children: [
        /* @__PURE__ */ e(c, { style: { width: 44, alignItems: "flex-start" }, children: d }),
        /* @__PURE__ */ p(c, { style: { flex: 1, alignItems: r ? "center" : "flex-start" }, children: [
          o && /* @__PURE__ */ e(
            g,
            {
              numberOfLines: 1,
              style: [u("heading.md"), { color: s.text["high-emphasis"] }],
              children: o
            }
          ),
          i && /* @__PURE__ */ e(
            g,
            {
              numberOfLines: 1,
              style: [u("body.sm"), { color: s.text["medium-emphasis"] }],
              children: i
            }
          )
        ] }),
        /* @__PURE__ */ e(c, { style: { minWidth: 44, alignItems: "flex-end" }, children: a })
      ]
    }
  );
}
function yt({ title: o, description: i, image: n, onPress: a, tone: t = "neutral", height: r = 140 }) {
  const { theme: s, scales: l } = y(), d = {
    neutral: { bg: s.surface.secondary, fg: s.text["high-emphasis"] },
    accent: { bg: s.surface["accent-primary-light"], fg: s.text["accent-primary"] },
    success: { bg: s.surface.success, fg: s.text.success },
    warning: { bg: s.surface.warning, fg: s.text.warning },
    caution: { bg: s.surface.caution, fg: s.text.caution }
  }[t], m = /* @__PURE__ */ p(
    c,
    {
      style: {
        height: r,
        borderRadius: l.borderRadius.lg,
        backgroundColor: d.bg,
        overflow: "hidden"
      },
      children: [
        n && /* @__PURE__ */ e(
          N,
          {
            source: n,
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
              backgroundColor: n ? s.surface["videoOverlay-light"] : "transparent"
            },
            children: [
              o && /* @__PURE__ */ e(
                g,
                {
                  style: [
                    u("heading.lg"),
                    { color: n ? s.text["on-inverse"] : d.fg }
                  ],
                  children: o
                }
              ),
              i && /* @__PURE__ */ e(
                g,
                {
                  style: [
                    u("body.sm"),
                    { color: n ? s.text["on-inverse-secondary"] : s.text["medium-emphasis"] }
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
  return a ? /* @__PURE__ */ e(x, { onPress: a, children: m }) : m;
}
function Sr({
  banners: o,
  itemWidth: i,
  height: n = 160,
  showIndicator: a = !0
}) {
  const { theme: t, scales: r } = y(), [s, l] = S(0), d = i ?? U.get("window").width - 32, m = D(null), h = (b) => {
    const f = b.nativeEvent.contentOffset.x, C = Math.round(f / (d + r.spacing.scale[2]));
    C !== s && l(C);
  };
  return /* @__PURE__ */ p(c, { style: { gap: r.spacing.scale[2] }, children: [
    /* @__PURE__ */ e(
      $,
      {
        ref: m,
        data: o,
        horizontal: !0,
        showsHorizontalScrollIndicator: !1,
        snapToInterval: d + r.spacing.scale[2],
        decelerationRate: "fast",
        onScroll: h,
        scrollEventThrottle: 16,
        keyExtractor: (b, f) => String(f),
        contentContainerStyle: { paddingHorizontal: r.spacing.scale[4], gap: r.spacing.scale[2] },
        renderItem: ({ item: b }) => /* @__PURE__ */ e(c, { style: { width: d, height: n }, children: /* @__PURE__ */ e(yt, { ...b, height: n }) })
      }
    ),
    a && o.length > 1 && /* @__PURE__ */ e(
      c,
      {
        style: {
          flexDirection: "row",
          gap: 6,
          alignSelf: "center"
        },
        children: o.map((b, f) => /* @__PURE__ */ e(
          c,
          {
            style: {
              width: f === s ? 16 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: f === s ? t.brand.primary : t.surface.tertiary
            }
          },
          f
        ))
      }
    )
  ] });
}
function Ir({
  value: o,
  onChange: i,
  placeholder: n = "検索",
  onSubmit: a,
  onClear: t,
  autoFocus: r
}) {
  const { theme: s, scales: l } = y();
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        flexDirection: "row",
        alignItems: "center",
        gap: l.spacing.scale[2],
        paddingHorizontal: l.spacing.scale[3],
        height: 44,
        backgroundColor: s.surface.secondary,
        borderRadius: l.borderRadius.full
      },
      children: [
        /* @__PURE__ */ e(g, { style: [u("label.md"), { color: s.text["low-emphasis"] }], children: "🔍" }),
        /* @__PURE__ */ e(
          X,
          {
            value: o,
            onChangeText: i,
            onSubmitEditing: a,
            placeholder: n,
            placeholderTextColor: s.text["low-emphasis"],
            returnKeyType: "search",
            autoFocus: r,
            style: [
              u("body.md"),
              { flex: 1, color: s.text["high-emphasis"], paddingVertical: 0 }
            ]
          }
        ),
        o.length > 0 && /* @__PURE__ */ e(
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
                  backgroundColor: s.surface.tertiary,
                  alignItems: "center",
                  justifyContent: "center"
                },
                children: /* @__PURE__ */ e(g, { style: [u("label.xs"), { color: s.text["medium-emphasis"] }], children: "×" })
              }
            )
          }
        )
      ]
    }
  );
}
function Tr({
  leading: o,
  title: i,
  description: n,
  trailing: a,
  showChevron: t,
  onPress: r,
  disabled: s
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
        opacity: s ? 0.5 : 1
      },
      children: [
        o,
        /* @__PURE__ */ p(c, { style: { flex: 1, gap: 2 }, children: [
          typeof i == "string" ? /* @__PURE__ */ e(g, { style: [u("body.md"), { color: l.text["high-emphasis"] }], children: i }) : i,
          n && typeof n == "string" ? /* @__PURE__ */ e(g, { style: [u("body.sm"), { color: l.text["medium-emphasis"] }], children: n }) : n
        ] }),
        a,
        t && /* @__PURE__ */ e(g, { style: [u("label.md"), { color: l.text["low-emphasis"] }], children: "›" })
      ]
    }
  );
  return r ? /* @__PURE__ */ e(x, { disabled: s, onPress: r, children: ({ pressed: h }) => m(h) }) : m(!1);
}
function Dr({ title: o, description: i, icon: n, action: a }) {
  const { theme: t, scales: r } = y();
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        alignItems: "center",
        justifyContent: "center",
        padding: r.spacing.scale[8],
        gap: r.spacing.scale[3]
      },
      children: [
        n ?? /* @__PURE__ */ e(
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
            children: o
          }
        ),
        i && /* @__PURE__ */ e(
          g,
          {
            style: [u("body.md"), { color: t.text["medium-emphasis"], textAlign: "center" }],
            children: i
          }
        ),
        a
      ]
    }
  );
}
function Pr({
  title: o = "エラーが発生しました",
  description: i = "時間をおいて再度お試しください。",
  icon: n,
  action: a
}) {
  const { theme: t, scales: r } = y();
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        alignItems: "center",
        justifyContent: "center",
        padding: r.spacing.scale[8],
        gap: r.spacing.scale[3]
      },
      children: [
        n ?? /* @__PURE__ */ e(
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
            children: o
          }
        ),
        /* @__PURE__ */ e(
          g,
          {
            style: [u("body.md"), { color: t.text["medium-emphasis"], textAlign: "center" }],
            children: i
          }
        ),
        a
      ]
    }
  );
}
function ft({ title: o, description: i, action: n, variant: a = "default" }) {
  const { theme: t, scales: r } = y();
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: r.spacing.scale[4],
        paddingVertical: r.spacing.scale[2],
        gap: r.spacing.scale[2]
      },
      children: [
        /* @__PURE__ */ p(c, { style: { flex: 1 }, children: [
          /* @__PURE__ */ e(
            g,
            {
              style: [
                u(a === "subtle" ? "label.md" : "heading.md"),
                { color: t.text["high-emphasis"] }
              ],
              children: o
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
        n && /* @__PURE__ */ e(
          x,
          {
            onPress: n.onPress,
            hitSlop: 8,
            style: ({ pressed: s }) => ({
              paddingVertical: r.spacing.scale[1],
              paddingHorizontal: r.spacing.scale[2],
              borderRadius: r.borderRadius.md,
              opacity: s ? 0.6 : 1
            }),
            children: /* @__PURE__ */ p(g, { style: [u("label.md"), { color: t.text["accent-primary"] }], children: [
              n.label,
              " ›"
            ] })
          }
        )
      ]
    }
  );
}
function Wr({ children: o }) {
  const { theme: i, scales: n } = y();
  return /* @__PURE__ */ e(
    c,
    {
      style: {
        flexDirection: "row",
        gap: n.spacing.scale[2],
        padding: n.spacing.scale[4],
        paddingBottom: O.OS === "ios" ? 32 : n.spacing.scale[4],
        backgroundColor: i.surface.primary,
        borderTopWidth: 1,
        borderTopColor: i.border["low-emphasis"]
      },
      children: o
    }
  );
}
function Hr({ rightActions: o = [], actionWidth: i = 80, children: n }) {
  const { theme: a } = y(), t = D(new I.Value(0)).current, r = o.length * i, s = D(
    ue.create({
      onMoveShouldSetPanResponder: (l, d) => Math.abs(d.dx) > 8,
      onPanResponderMove: (l, d) => {
        const m = Math.min(0, Math.max(-r, d.dx));
        t.setValue(m);
      },
      onPanResponderRelease: (l, d) => {
        const m = d.dx < -r / 2;
        I.spring(t, {
          toValue: m ? -r : 0,
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
        children: o.map((l, d) => /* @__PURE__ */ e(
          x,
          {
            onPress: () => {
              I.spring(t, { toValue: 0, useNativeDriver: !0 }).start(), l.onPress();
            },
            style: {
              width: i,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: l.color ?? a.caution.base
            },
            children: /* @__PURE__ */ e(g, { style: [u("label.md"), { color: l.textColor ?? a.text["on-inverse"] }], children: l.label })
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
          backgroundColor: a.surface.primary
        },
        ...s.panHandlers,
        children: n
      }
    )
  ] });
}
function Br({ copyright: o, links: i = [] }) {
  const { theme: n, scales: a } = y();
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        backgroundColor: n.surface.secondary,
        padding: a.spacing.scale[4],
        gap: a.spacing.scale[2]
      },
      children: [
        /* @__PURE__ */ e(
          c,
          {
            style: {
              flexDirection: "row",
              flexWrap: "wrap",
              gap: a.spacing.scale[3]
            },
            children: i.map((t, r) => /* @__PURE__ */ e(x, { onPress: t.onPress, children: /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: n.text["medium-emphasis"] }], children: t.label }) }, r))
          }
        ),
        o && /* @__PURE__ */ e(g, { style: [u("body.sm"), { color: n.text["low-emphasis"] }], children: o })
      ]
    }
  );
}
function Mr({
  title: o = "ファイルを選択",
  description: i = "タップしてアップロード",
  onPress: n,
  disabled: a = !1
}) {
  const { theme: t, scales: r } = y();
  return /* @__PURE__ */ p(
    x,
    {
      onPress: n,
      disabled: a,
      style: ({ pressed: s }) => ({
        borderWidth: 2,
        borderStyle: "dashed",
        borderColor: s ? t.brand.primary : t.border["medium-emphasis"],
        borderRadius: r.borderRadius.lg,
        padding: r.spacing.scale[6],
        alignItems: "center",
        justifyContent: "center",
        gap: r.spacing.scale[1],
        backgroundColor: s ? t.surface.secondary : t.surface.primary,
        opacity: a ? 0.5 : 1
      }),
      children: [
        /* @__PURE__ */ e(g, { style: { fontSize: 28, color: t.text["low-emphasis"] }, children: "📤" }),
        /* @__PURE__ */ e(g, { style: [u("label.md"), { color: t.text["high-emphasis"] }], children: o }),
        /* @__PURE__ */ e(g, { style: [u("body.sm"), { color: t.text["medium-emphasis"] }], children: i })
      ]
    }
  );
}
function zr({
  options: o,
  values: i = [],
  onChange: n,
  multiple: a = !0
}) {
  const { scales: t } = y(), r = (s) => {
    n?.(a ? i.includes(s) ? i.filter((l) => l !== s) : [...i, s] : i.includes(s) ? [] : [s]);
  };
  return /* @__PURE__ */ e(
    c,
    {
      style: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: t.spacing.scale[2]
      },
      children: o.map((s) => /* @__PURE__ */ e(
        Ie,
        {
          selected: i.includes(s.value),
          disabled: s.disabled,
          count: s.count,
          onPress: () => r(s.value),
          children: s.label
        },
        s.value
      ))
    }
  );
}
function Vr({ items: o, value: i, onChange: n }) {
  const { theme: a, scales: t } = y();
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
      children: o.map((r) => {
        const s = i === r.key;
        return /* @__PURE__ */ p(
          x,
          {
            onPress: () => n?.(r.key),
            style: { alignItems: "center", gap: t.spacing.scale[1], width: 64 },
            children: [
              /* @__PURE__ */ e(
                c,
                {
                  style: {
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: s ? a.brand.primary : a.surface.secondary,
                    alignItems: "center",
                    justifyContent: "center"
                  },
                  children: r.icon
                }
              ),
              /* @__PURE__ */ e(
                g,
                {
                  numberOfLines: 1,
                  style: [
                    u("label.xs"),
                    { color: s ? a.text["accent-primary"] : a.text["medium-emphasis"] }
                  ],
                  children: r.label
                }
              )
            ]
          },
          r.key
        );
      })
    }
  );
}
function jr({ items: o, value: i, onChange: n }) {
  const { theme: a, scales: t } = y();
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
      children: o.map((r) => {
        const s = i === r.key;
        return /* @__PURE__ */ p(
          x,
          {
            onPress: () => n?.(r.key),
            style: ({ pressed: l }) => ({
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              paddingHorizontal: t.spacing.scale[3],
              height: 36,
              borderRadius: t.borderRadius.full,
              backgroundColor: s ? a.brand.primary : l ? a.surface.tertiary : a.surface.secondary
            }),
            children: [
              /* @__PURE__ */ e(
                g,
                {
                  style: [
                    u("label.sm"),
                    {
                      color: s ? a.text["on-inverse"] : a.text["high-emphasis"],
                      fontWeight: s ? "700" : "500"
                    }
                  ],
                  children: r.label
                }
              ),
              r.count !== void 0 && /* @__PURE__ */ e(
                c,
                {
                  style: {
                    paddingHorizontal: 6,
                    borderRadius: 999,
                    backgroundColor: s ? a.surface.primary : a.surface.tertiary,
                    minWidth: 20,
                    alignItems: "center"
                  },
                  children: /* @__PURE__ */ e(
                    g,
                    {
                      style: [
                        u("label.xs"),
                        { color: s ? a.text["accent-primary"] : a.text["medium-emphasis"] }
                      ],
                      children: r.count
                    }
                  )
                }
              )
            ]
          },
          r.key
        );
      })
    }
  );
}
function Er({ steps: o, current: i }) {
  const { theme: n, scales: a } = y();
  return /* @__PURE__ */ e(c, { style: { flexDirection: "row", alignItems: "flex-start", gap: 0 }, children: o.map((t, r) => {
    const s = r < i, l = r === i, d = s || l;
    return /* @__PURE__ */ p(G.Fragment, { children: [
      /* @__PURE__ */ p(c, { style: { alignItems: "center", flex: 1 }, children: [
        /* @__PURE__ */ e(
          c,
          {
            style: {
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: d ? n.brand.primary : n.surface.tertiary,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: l ? n.border["accent-primary"] : "transparent"
            },
            children: /* @__PURE__ */ e(
              g,
              {
                style: [
                  u("label.xs"),
                  { color: d ? n.text["on-inverse"] : n.text["medium-emphasis"], fontWeight: "700" }
                ],
                children: s ? "✓" : r + 1
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
                color: d ? n.text["accent-primary"] : n.text["medium-emphasis"],
                marginTop: 4,
                textAlign: "center"
              }
            ],
            children: t.label
          }
        )
      ] }),
      r < o.length - 1 && /* @__PURE__ */ e(
        c,
        {
          style: {
            flex: 0.5,
            height: 2,
            backgroundColor: s ? n.brand.primary : n.border["low-emphasis"],
            marginTop: 13
          }
        }
      )
    ] }, t.key);
  }) });
}
function Fr({ value: o = [], onChange: i, placeholder: n = "タグを入力", maxTags: a = 10 }) {
  const { theme: t, scales: r } = y(), [s, l] = S(""), d = () => {
    const h = s.trim();
    if (h) {
      if (o.includes(h)) {
        l("");
        return;
      }
      o.length >= a || (i?.([...o, h]), l(""));
    }
  }, m = (h) => {
    i?.(o.filter((b) => b !== h));
  };
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: r.spacing.scale[1],
        padding: r.spacing.scale[2],
        borderRadius: r.borderRadius.md,
        borderWidth: 1,
        borderColor: t.border["medium-emphasis"],
        backgroundColor: t.surface.primary
      },
      children: [
        o.map((h) => /* @__PURE__ */ p(
          c,
          {
            style: {
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              paddingLeft: r.spacing.scale[2],
              paddingRight: 4,
              height: 28,
              borderRadius: r.borderRadius.full,
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
          X,
          {
            value: s,
            onChangeText: l,
            onSubmitEditing: d,
            onBlur: d,
            placeholder: o.length === 0 ? n : "",
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
function Or({ message: o, url: i, title: n, extra: a = [] }) {
  const { theme: t, scales: r } = y(), l = [
    { label: "共有", onPress: async () => {
      try {
        await Ee.share({ message: [o, i].filter(Boolean).join(" "), title: n, url: i });
      } catch {
      }
    } },
    ...a
  ];
  return /* @__PURE__ */ e(c, { style: { flexDirection: "row", flexWrap: "wrap", gap: r.spacing.scale[2] }, children: l.map((d, m) => /* @__PURE__ */ e(
    x,
    {
      onPress: d.onPress,
      style: ({ pressed: h }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: r.spacing.scale[1],
        paddingHorizontal: r.spacing.scale[3],
        height: 40,
        borderRadius: r.borderRadius.full,
        backgroundColor: h ? t.active["secondary-button"] : t.surface["accent-primary-light"]
      }),
      children: /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: t.text["accent-primary"] }], children: d.label })
    },
    m
  )) });
}
function Ar(o) {
  return /* @__PURE__ */ e(Ie, { ...o, shape: "pill", variant: "filled" });
}
function Lr({ images: o, initialIndex: i = 0, thumbnailSize: n = 80 }) {
  const { theme: a, scales: t } = y(), [r, s] = S({ open: !1, index: i }), l = U.get("window").width;
  return /* @__PURE__ */ p(A, { children: [
    /* @__PURE__ */ e(
      $,
      {
        data: o,
        horizontal: !0,
        showsHorizontalScrollIndicator: !1,
        contentContainerStyle: { gap: t.spacing.scale[2] },
        keyExtractor: (d, m) => String(m),
        renderItem: ({ item: d, index: m }) => /* @__PURE__ */ e(x, { onPress: () => s({ open: !0, index: m }), children: /* @__PURE__ */ e(
          N,
          {
            source: d,
            style: {
              width: n,
              height: n,
              borderRadius: t.borderRadius.md,
              backgroundColor: a.surface.tertiary
            }
          }
        ) })
      }
    ),
    /* @__PURE__ */ e(
      q,
      {
        visible: r.open,
        transparent: !0,
        animationType: "fade",
        onRequestClose: () => s({ ...r, open: !1 }),
        children: /* @__PURE__ */ p(c, { style: { flex: 1, backgroundColor: a.surface.inverse }, children: [
          /* @__PURE__ */ e(
            x,
            {
              onPress: () => s({ ...r, open: !1 }),
              style: { position: "absolute", top: 48, right: 16, zIndex: 1, padding: 8 },
              children: /* @__PURE__ */ e(g, { style: [u("heading.lg"), { color: a.text["on-inverse"] }], children: "×" })
            }
          ),
          /* @__PURE__ */ e(
            $,
            {
              data: o,
              horizontal: !0,
              pagingEnabled: !0,
              initialScrollIndex: r.index,
              getItemLayout: (d, m) => ({
                length: l,
                offset: l * m,
                index: m
              }),
              keyExtractor: (d, m) => String(m),
              onScroll: (d) => {
                const m = Math.round(d.nativeEvent.contentOffset.x / l);
                m !== r.index && s((h) => ({ ...h, index: m }));
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
              children: /* @__PURE__ */ p(g, { style: [u("label.md"), { color: a.text["on-inverse"] }], children: [
                r.index + 1,
                " / ",
                o.length
              ] })
            }
          )
        ] })
      }
    )
  ] });
}
const xt = {
  google: "Google でログイン",
  apple: "Apple でログイン",
  line: "LINE でログイン",
  amazon: "Amazon でログイン",
  github: "GitHub でログイン",
  x: "X でログイン"
};
function _r({
  provider: o,
  label: i,
  onPress: n,
  disabled: a = !1
}) {
  const { theme: t, scales: r } = y(), s = r.brandExternal, l = {
    google: {
      bg: t.surface.primary,
      fg: t.text["high-emphasis"],
      border: s.googleBorder
    },
    apple: {
      bg: s.apple,
      fg: t.text["on-inverse"],
      border: s.apple
    },
    line: {
      bg: s.line,
      fg: t.text["on-inverse"],
      border: s.line
    },
    amazon: {
      bg: s.amazon,
      fg: t.text["on-inverse"],
      border: s.amazon
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
  }[o];
  return /* @__PURE__ */ e(
    x,
    {
      onPress: n,
      disabled: a,
      style: ({ pressed: d }) => ({
        minHeight: r.touchTargets.buttonCTA.min,
        paddingHorizontal: r.spacing.scale[5],
        alignItems: "center",
        justifyContent: "center",
        borderRadius: r.borderRadius.lg,
        borderWidth: 1,
        backgroundColor: l.bg,
        borderColor: l.border,
        opacity: a ? 0.5 : d ? 0.85 : 1
      }),
      children: /* @__PURE__ */ e(c, { style: { flexDirection: "row", alignItems: "center", gap: r.spacing.scale[2] }, children: /* @__PURE__ */ e(g, { style: [u("label.md"), { color: l.fg }], children: i ?? xt[o] }) })
    }
  );
}
const wt = {
  x: { color: "#000000", letter: "X" },
  instagram: { color: "#E4405F", letter: "IG" },
  youtube: { color: "#FF0000", letter: "YT" },
  tiktok: { color: "#000000", letter: "TT" },
  facebook: { color: "#1877F2", letter: "f" },
  line: { color: "#06C755", letter: "L" }
};
function $r({ brand: o, size: i = 24 }) {
  const { theme: n } = y(), a = wt[o];
  return /* @__PURE__ */ e(
    c,
    {
      style: {
        width: i,
        height: i,
        borderRadius: i / 2,
        backgroundColor: a.color,
        alignItems: "center",
        justifyContent: "center"
      },
      children: /* @__PURE__ */ e(
        g,
        {
          style: {
            color: n.text["on-inverse"],
            fontSize: i * 0.5,
            fontWeight: "700"
          },
          children: a.letter
        }
      )
    }
  );
}
function Nr({ count: o = 3, variant: i = "row" }) {
  const { scales: n } = y();
  return /* @__PURE__ */ e(c, { style: { gap: n.spacing.scale[3] }, children: Array.from({ length: o }).map((a, t) => i === "card" ? /* @__PURE__ */ p(c, { style: { gap: n.spacing.scale[2] }, children: [
    /* @__PURE__ */ e(F, { height: 140, radius: n.borderRadius.lg }),
    /* @__PURE__ */ e(F, { height: 14, width: "60%" }),
    /* @__PURE__ */ e(F, { height: 12, width: "40%" })
  ] }, t) : i === "list" ? /* @__PURE__ */ p(c, { style: { gap: 8 }, children: [
    /* @__PURE__ */ e(F, { height: 14, width: "80%" }),
    /* @__PURE__ */ e(F, { height: 12, width: "50%" })
  ] }, t) : /* @__PURE__ */ p(c, { style: { flexDirection: "row", gap: n.spacing.scale[3], alignItems: "center" }, children: [
    /* @__PURE__ */ e(F, { width: 48, height: 48, radius: 24 }),
    /* @__PURE__ */ p(c, { style: { flex: 1, gap: 6 }, children: [
      /* @__PURE__ */ e(F, { height: 14, width: "70%" }),
      /* @__PURE__ */ e(F, { height: 12, width: "50%" })
    ] })
  ] }, t)) });
}
function Yr(o) {
  return /* @__PURE__ */ e(bt, { ...o });
}
function Gr({ filters: o, sortLabel: i = "並び替え", onPressSort: n }) {
  const { theme: a, scales: t } = y();
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        flexDirection: "row",
        alignItems: "center",
        gap: t.spacing.scale[2],
        paddingHorizontal: t.spacing.scale[3],
        paddingVertical: t.spacing.scale[2],
        backgroundColor: a.surface.primary,
        borderBottomWidth: 1,
        borderBottomColor: a.border["low-emphasis"]
      },
      children: [
        /* @__PURE__ */ e(
          H,
          {
            horizontal: !0,
            showsHorizontalScrollIndicator: !1,
            contentContainerStyle: { gap: t.spacing.scale[2] },
            style: { flex: 1 },
            children: o.map((r) => {
              const s = r.active || !!r.value;
              return /* @__PURE__ */ p(
                x,
                {
                  onPress: r.onPress,
                  style: ({ pressed: l }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    paddingHorizontal: t.spacing.scale[3],
                    height: 32,
                    borderRadius: t.borderRadius.full,
                    borderWidth: 1,
                    borderColor: s ? a.border["accent-primary"] : a.border["medium-emphasis"],
                    backgroundColor: s ? a.surface["accent-primary-light"] : l ? a.surface.secondary : a.surface.primary
                  }),
                  children: [
                    /* @__PURE__ */ p(
                      g,
                      {
                        style: [
                          u("label.sm"),
                          { color: s ? a.text["accent-primary"] : a.text["high-emphasis"] }
                        ],
                        children: [
                          r.label,
                          r.value ? `: ${r.value}` : ""
                        ]
                      }
                    ),
                    /* @__PURE__ */ e(
                      g,
                      {
                        style: [
                          u("label.xs"),
                          { color: s ? a.text["accent-primary"] : a.text["low-emphasis"] }
                        ],
                        children: "▾"
                      }
                    )
                  ]
                },
                r.key
              );
            })
          }
        ),
        /* @__PURE__ */ e(
          x,
          {
            onPress: n,
            style: ({ pressed: r }) => ({
              paddingHorizontal: t.spacing.scale[2],
              height: 32,
              justifyContent: "center",
              borderRadius: t.borderRadius.full,
              backgroundColor: r ? a.active["tertiary-button"] : "transparent"
            }),
            children: /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: a.text["accent-primary"] }], children: i })
          }
        )
      ]
    }
  );
}
function Xr({
  images: o,
  height: i = 280,
  showCounter: n = !0,
  showDots: a = !0
}) {
  const { theme: t, scales: r } = y(), [s, l] = S(0), d = U.get("window").width;
  return /* @__PURE__ */ p(c, { children: [
    /* @__PURE__ */ e(
      $,
      {
        data: o,
        horizontal: !0,
        pagingEnabled: !0,
        showsHorizontalScrollIndicator: !1,
        onScroll: (h) => {
          const b = Math.round(h.nativeEvent.contentOffset.x / d);
          b !== s && l(b);
        },
        scrollEventThrottle: 16,
        keyExtractor: (h, b) => String(b),
        renderItem: ({ item: h }) => /* @__PURE__ */ e(c, { style: { width: d, height: i, backgroundColor: t.surface.tertiary }, children: /* @__PURE__ */ e(N, { source: h, resizeMode: "cover", style: { width: "100%", height: "100%" } }) })
      }
    ),
    n && o.length > 1 && /* @__PURE__ */ e(
      c,
      {
        style: {
          position: "absolute",
          top: r.spacing.scale[3],
          right: r.spacing.scale[3],
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: r.borderRadius.full,
          backgroundColor: t.overlay.dark
        },
        children: /* @__PURE__ */ p(g, { style: [u("label.xs"), { color: t.text["on-inverse"] }], children: [
          s + 1,
          " / ",
          o.length
        ] })
      }
    ),
    a && o.length > 1 && /* @__PURE__ */ e(
      c,
      {
        style: {
          position: "absolute",
          bottom: r.spacing.scale[3],
          left: 0,
          right: 0,
          flexDirection: "row",
          justifyContent: "center",
          gap: 6
        },
        children: o.map((h, b) => /* @__PURE__ */ e(
          c,
          {
            style: {
              width: b === s ? 16 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: b === s ? t.text["on-inverse"] : t.text["on-inverse-secondary"]
            }
          },
          b
        ))
      }
    )
  ] });
}
function ve(o, i = "¥") {
  return `${i}${o.toLocaleString("ja-JP")}`;
}
function Ct({
  price: o,
  originalPrice: i,
  currency: n = "¥",
  size: a = "md",
  showTax: t = !0
}) {
  const { theme: r, scales: s } = y(), l = typeof i == "number" && i > o, d = l ? Math.round((1 - o / i) * 100) : 0, m = u(a === "lg" ? "heading.2xl" : a === "sm" ? "label.md" : "heading.lg");
  return /* @__PURE__ */ p(c, { style: { gap: 2 }, children: [
    /* @__PURE__ */ p(
      c,
      {
        style: {
          flexDirection: "row",
          alignItems: "baseline",
          gap: s.spacing.scale[2],
          flexWrap: "wrap"
        },
        children: [
          l && /* @__PURE__ */ p(
            g,
            {
              style: [
                u("label.md"),
                { color: r.caution.base, fontWeight: "700" }
              ],
              children: [
                d,
                "% OFF"
              ]
            }
          ),
          /* @__PURE__ */ e(g, { style: [m, { color: r.text["high-emphasis"] }], children: ve(o, n) }),
          t && /* @__PURE__ */ e(g, { style: [u("body.sm"), { color: r.text["low-emphasis"] }], children: "税込" })
        ]
      }
    ),
    l && /* @__PURE__ */ e(
      g,
      {
        style: [
          u("body.sm"),
          { color: r.text["low-emphasis"], textDecorationLine: "line-through" }
        ],
        children: ve(i, n)
      }
    )
  ] });
}
function qr({ min: o = 1, ...i }) {
  return /* @__PURE__ */ e(tt, { min: o, ...i });
}
function Rt({ rating: o, count: i, size: n = 16, layout: a = "row" }) {
  const { theme: t, scales: r } = y();
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        flexDirection: a === "row" ? "row" : "column",
        alignItems: a === "row" ? "center" : "flex-start",
        gap: r.spacing.scale[1]
      },
      children: [
        /* @__PURE__ */ e(oe, { value: o, size: n, readOnly: !0 }),
        /* @__PURE__ */ p(c, { style: { flexDirection: "row", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: t.text["high-emphasis"] }], children: o.toFixed(1) }),
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
function vt({
  image: o,
  title: i,
  price: n,
  originalPrice: a,
  rating: t,
  reviewCount: r,
  badge: s,
  soldOut: l,
  onPress: d,
  layout: m = "vertical"
}) {
  const { theme: h, scales: b } = y(), f = m === "horizontal", C = f ? 96 : "100%", v = f ? 96 : 160, w = (R = !1) => /* @__PURE__ */ p(
    c,
    {
      style: {
        flexDirection: f ? "row" : "column",
        gap: b.spacing.scale[3],
        backgroundColor: h.surface.primary,
        borderRadius: b.borderRadius.lg,
        overflow: "hidden",
        padding: f ? b.spacing.scale[3] : 0,
        opacity: R ? 0.85 : 1
      },
      children: [
        /* @__PURE__ */ p(c, { style: { position: "relative", width: C, height: v }, children: [
          /* @__PURE__ */ e(
            N,
            {
              source: o,
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
          s && /* @__PURE__ */ e(
            c,
            {
              style: {
                position: "absolute",
                top: 8,
                left: 8
              },
              children: /* @__PURE__ */ e(Xe, { tone: "caution", children: s })
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
          t !== void 0 && /* @__PURE__ */ e(Rt, { rating: t, count: r, size: 14 }),
          /* @__PURE__ */ e(Ct, { price: n, originalPrice: a, size: "sm" })
        ] })
      ]
    }
  );
  return d ? /* @__PURE__ */ e(x, { onPress: d, disabled: l, children: ({ pressed: R }) => w(R) }) : w(!1);
}
function Ur({
  title: o,
  action: i,
  products: n,
  cardWidth: a = 160
}) {
  const { scales: t } = y();
  return /* @__PURE__ */ p(c, { children: [
    o && /* @__PURE__ */ e(ft, { title: o, action: i }),
    /* @__PURE__ */ e(
      $,
      {
        data: n,
        horizontal: !0,
        showsHorizontalScrollIndicator: !1,
        keyExtractor: (r, s) => String(s),
        contentContainerStyle: {
          gap: t.spacing.scale[3],
          paddingHorizontal: t.spacing.scale[4],
          paddingBottom: t.spacing.scale[2]
        },
        renderItem: ({ item: r }) => /* @__PURE__ */ e(c, { style: { width: a }, children: /* @__PURE__ */ e(vt, { ...r }) })
      }
    )
  ] });
}
function kt(o, i) {
  return `${i}${o.toLocaleString("ja-JP")}`;
}
function Kr({ lines: o, currency: i = "¥" }) {
  const { theme: n, scales: a } = y();
  return /* @__PURE__ */ e(
    c,
    {
      style: {
        backgroundColor: n.surface.primary,
        borderColor: n.border["low-emphasis"],
        borderWidth: 1,
        borderRadius: a.borderRadius.lg,
        padding: a.spacing.scale[4],
        gap: a.spacing.scale[2]
      },
      children: o.map((t, r) => {
        const s = t.emphasis === "total", l = t.emphasis === "discount", d = l ? n.text.caution : s ? n.text["accent-primary"] : n.text["high-emphasis"], m = u(s ? "label.lg" : "body.md"), h = u(s ? "heading.lg" : "body.md");
        return /* @__PURE__ */ p(G.Fragment, { children: [
          s && /* @__PURE__ */ e(Y, {}),
          /* @__PURE__ */ p(c, { style: { flexDirection: "row", justifyContent: "space-between" }, children: [
            /* @__PURE__ */ e(g, { style: [m, { color: n.text["medium-emphasis"] }], children: t.label }),
            /* @__PURE__ */ p(g, { style: [h, { color: d }], children: [
              l && t.value > 0 ? "-" : "",
              kt(t.value, i)
            ] })
          ] })
        ] }, r);
      })
    }
  );
}
function Jr({
  authorName: o,
  authorAvatar: i,
  rating: n,
  date: a,
  title: t,
  comment: r,
  helpfulCount: s
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
          /* @__PURE__ */ e(Ye, { source: i, fallback: o[0], size: "sm" }),
          /* @__PURE__ */ p(c, { style: { flex: 1 }, children: [
            /* @__PURE__ */ e(g, { style: [u("label.md"), { color: l.text["high-emphasis"] }], children: o }),
            a && /* @__PURE__ */ e(g, { style: [u("body.sm"), { color: l.text["low-emphasis"] }], children: a })
          ] }),
          /* @__PURE__ */ e(oe, { value: n, size: 14, readOnly: !0 })
        ] }),
        t && /* @__PURE__ */ e(g, { style: [u("label.md"), { color: l.text["high-emphasis"] }], children: t }),
        /* @__PURE__ */ e(g, { style: [u("body.md"), { color: l.text["high-emphasis"] }], children: r }),
        s !== void 0 && /* @__PURE__ */ p(g, { style: [u("label.sm"), { color: l.text["low-emphasis"] }], children: [
          "参考になった ",
          s
        ] })
      ]
    }
  );
}
function Qr({ average: o, total: i, distribution: n }) {
  const { theme: a, scales: t } = y();
  return /* @__PURE__ */ p(
    c,
    {
      style: {
        flexDirection: "row",
        gap: t.spacing.scale[4],
        padding: t.spacing.scale[4],
        backgroundColor: a.surface.primary,
        borderRadius: t.borderRadius.lg,
        borderWidth: 1,
        borderColor: a.border["low-emphasis"]
      },
      children: [
        /* @__PURE__ */ p(c, { style: { alignItems: "center", gap: t.spacing.scale[1], minWidth: 100 }, children: [
          /* @__PURE__ */ e(g, { style: [u("heading.3xl"), { color: a.text["high-emphasis"] }], children: o.toFixed(1) }),
          /* @__PURE__ */ e(oe, { value: o, size: 16, readOnly: !0 }),
          /* @__PURE__ */ p(g, { style: [u("body.sm"), { color: a.text["low-emphasis"] }], children: [
            i.toLocaleString("ja-JP"),
            " 件"
          ] })
        ] }),
        /* @__PURE__ */ e(c, { style: { flex: 1, gap: 4 }, children: [5, 4, 3, 2, 1].map((r) => {
          const s = n[r] ?? 0, l = i > 0 ? s / i * 100 : 0;
          return /* @__PURE__ */ p(
            c,
            {
              style: { flexDirection: "row", alignItems: "center", gap: t.spacing.scale[2] },
              children: [
                /* @__PURE__ */ e(g, { style: [u("label.sm"), { color: a.text["medium-emphasis"], width: 16 }], children: r }),
                /* @__PURE__ */ e(
                  c,
                  {
                    style: {
                      flex: 1,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: a.surface.tertiary,
                      overflow: "hidden"
                    },
                    children: /* @__PURE__ */ e(
                      c,
                      {
                        style: {
                          width: `${l}%`,
                          height: "100%",
                          backgroundColor: a.object.rating
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
                      { color: a.text["low-emphasis"], width: 40, textAlign: "right" }
                    ],
                    children: s
                  }
                )
              ]
            },
            r
          );
        }) })
      ]
    }
  );
}
function Zr({
  header: o,
  footer: i,
  bottomNav: n,
  scrollable: a = !0,
  children: t
}) {
  const { theme: r } = y(), s = a ? /* @__PURE__ */ e(H, { style: { flex: 1, backgroundColor: r.surface.secondary }, children: t }) : /* @__PURE__ */ e(c, { style: { flex: 1, backgroundColor: r.surface.secondary }, children: t });
  return /* @__PURE__ */ p(c, { style: { flex: 1, backgroundColor: r.surface.primary }, children: [
    o,
    s,
    i,
    n
  ] });
}
function en({ header: o, footer: i, cta: n, children: a }) {
  const { theme: t } = y();
  return /* @__PURE__ */ p(c, { style: { flex: 1, backgroundColor: t.surface.primary }, children: [
    o,
    /* @__PURE__ */ p(H, { style: { flex: 1 }, contentContainerStyle: { paddingBottom: n ? 80 : 0 }, children: [
      a,
      i
    ] }),
    n && /* @__PURE__ */ e(
      c,
      {
        style: {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0
        },
        children: n
      }
    )
  ] });
}
export {
  yr as Accordion,
  Ut as Alert,
  rt as AlertDialog,
  kr as AppHeader,
  Zr as AppShell,
  _t as AutoGrowTextarea,
  Ye as Avatar,
  Bt as Badge,
  yt as Banner,
  Sr as BannerCarousel,
  rr as BottomSheetForm,
  Yr as BottomTabBar,
  vr as Breadcrumb,
  V as Button,
  gt as Calendar,
  Ht as Card,
  Vr as CategoryNav,
  jr as CategoryScroll,
  ge as Checkbox,
  Nt as CheckboxCard,
  et as CheckboxField,
  Yt as CheckboxGroup,
  Ie as Chip,
  zr as ChipSelector,
  or as CoachMark,
  ar as CoachMarkOverlay,
  fr as Collapsible,
  ir as Combobox,
  tr as ConfirmDialog,
  Lt as CountdownTimer,
  mr as DatePicker,
  De as Dialog,
  cr as DropdownFilter,
  Jt as DropdownMenu,
  Dr as EmptyState,
  Pr as ErrorState,
  Mr as FileUpload,
  Gr as FilterBar,
  Ar as FilterChip,
  Br as Footer,
  qt as FormField,
  Oe as GlassView,
  Xr as ImageCarousel,
  Lr as ImageGallery,
  Te as Input,
  Ue as Label,
  Tr as ListItem,
  Nr as ListSkeletons,
  en as MarketingShell,
  er as MenuDrawer,
  lr as MultiSelect,
  bt as NavigationBar,
  Ft as NotificationBadge,
  tt as NumberInput,
  Kr as OrderSummary,
  wr as Pagination,
  dr as PillToggle,
  at as Popover,
  Ct as PriceDisplay,
  vt as ProductCard,
  Ur as ProductCarousel,
  jt as Progress,
  Et as ProgressRing,
  Er as ProgressSteps,
  qr as QuantitySelector,
  Gt as RadioGroup,
  Rt as RatingDisplay,
  Kt as ResponsiveDialog,
  Jr as ReviewCard,
  nr as ReviewOverlay,
  Qr as ReviewSummary,
  xr as ScrollArea,
  Ir as SearchBar,
  ft as SectionHeader,
  sr as Select,
  Y as Separator,
  Or as ShareButtons,
  j as Sheet,
  Cr as SimplePagination,
  F as Skeleton,
  Vt as SkeletonText,
  Xt as Slider,
  $r as SocialIcon,
  _r as SocialLoginButton,
  zt as Spinner,
  Mt as Stack,
  oe as StarRating,
  Ot as StatCard,
  Wr as StickyActionBar,
  Rr as SubNav,
  Hr as SwipeRow,
  $t as Switch,
  At as SyncStatusBadge,
  hr as Tabs,
  pr as TabsContent,
  ur as TabsList,
  gr as TabsTrigger,
  Xe as Tag,
  Fr as TagInput,
  Wt as Text,
  Qe as Textarea,
  Pt as ThemeProvider,
  br as TimePicker,
  Zt as ToastProvider,
  nn as getTheme,
  on as primitives,
  u as resolveTypo,
  ce as scales,
  an as themeNames,
  je as themes,
  y as useTheme,
  Qt as useToast
};
