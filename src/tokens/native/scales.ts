// =============================================================
// このファイルは scripts/generate-platform-tokens.mjs により自動生成されています。
// 直接編集しないでください。tokens.json / src/themes/*.css を変更し、
// `npm run generate:tokens` を実行してください。
// source: tokens.json v2.0.0 (2026-05-31)
// =============================================================

export const scales = {
  "spacing": {
    "unit": 4,
    "scale": [
      0,
      4,
      8,
      12,
      16,
      20,
      24,
      28,
      32,
      36,
      40,
      44,
      48,
      52,
      56,
      60
    ]
  },
  "borderRadius": {
    "none": 0,
    "sm": 4,
    "md": 6,
    "lg": 8,
    "xl": 12,
    "2xl": 16,
    "full": 9999
  },
  "typography": {
    "heading": {
      "3xl": {
        "fontSize": 28,
        "fontWeight": "700",
        "lineHeight": 42,
        "letterSpacing": 1.12
      },
      "2xl": {
        "fontSize": 24,
        "fontWeight": "700",
        "lineHeight": 36,
        "letterSpacing": 0.96
      },
      "xl": {
        "fontSize": 21,
        "fontWeight": "700",
        "lineHeight": 32,
        "letterSpacing": 0.84
      },
      "lg": {
        "fontSize": 18,
        "fontWeight": "700",
        "lineHeight": 27,
        "letterSpacing": 0.72
      },
      "md": {
        "fontSize": 16,
        "fontWeight": "700",
        "lineHeight": 24,
        "letterSpacing": 0.64
      },
      "sm": {
        "fontSize": 14,
        "fontWeight": "700",
        "lineHeight": 21,
        "letterSpacing": 0.56
      }
    },
    "body": {
      "lg": {
        "fontSize": 16,
        "fontWeight": "400",
        "lineHeight": 28
      },
      "md": {
        "fontSize": 14,
        "fontWeight": "400",
        "lineHeight": 25
      },
      "sm": {
        "fontSize": 12,
        "fontWeight": "400",
        "lineHeight": 18
      },
      "xs": {
        "fontSize": 10,
        "fontWeight": "400",
        "lineHeight": 15
      }
    },
    "label": {
      "lg": {
        "fontSize": 16,
        "fontWeight": "700",
        "lineHeight": 24,
        "letterSpacing": 0.64
      },
      "md": {
        "fontSize": 14,
        "fontWeight": "700",
        "lineHeight": 21,
        "letterSpacing": 0.56
      },
      "sm": {
        "fontSize": 12,
        "fontWeight": "500",
        "lineHeight": 18
      },
      "xs": {
        "fontSize": 10,
        "fontWeight": "500",
        "lineHeight": 15
      }
    },
    "display": {
      "xl": {
        "fontSize": 48,
        "fontWeight": "700",
        "lineHeight": 60,
        "letterSpacing": -0.96
      },
      "lg": {
        "fontSize": 36,
        "fontWeight": "700",
        "lineHeight": 47,
        "letterSpacing": -0.36
      }
    },
    "caption": {
      "fontSize": 11,
      "fontWeight": "400",
      "lineHeight": 17
    },
    "caption-strong": {
      "fontSize": 11,
      "fontWeight": "600",
      "lineHeight": 16
    },
    "prose-meta": {
      "fontSize": 13,
      "fontWeight": "600",
      "lineHeight": 18
    }
  },
  "shadows": {
    "sm": {
      "boxShadow": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      "elevation": 1
    },
    "md": {
      "boxShadow": "0 0 8px rgba(20, 20, 20, 0.08)",
      "elevation": 3
    },
    "lg": {
      "boxShadow": "0px 12px 32px -4px rgba(17, 24, 39, 0.12), 0px 8px 16px -6px rgba(17, 24, 39, 0.12)",
      "elevation": 8
    },
    "dialog": {
      "boxShadow": "0px 12px 32px -4px rgba(17, 24, 39, 0.12), 0px 8px 16px -6px rgba(17, 24, 39, 0.12), 0px 1px 4px 1px rgba(0, 0, 0, 0.2)",
      "elevation": 12
    },
    "tooltip": {
      "boxShadow": "0px 8px 8px -4px rgba(17, 24, 39, 0.08), 0px 4px 6px -4px rgba(17, 24, 39, 0.12)",
      "elevation": 6
    }
  },
  "touchTargets": {
    "buttonCTA": {
      "min": 44,
      "recommended": 48
    },
    "iconButton": {
      "min": 44,
      "recommended": 48
    },
    "textInput": {
      "min": 44,
      "recommended": 48
    },
    "chip": {
      "min": 32,
      "recommended": 36,
      "hitSlop": "視覚 32〜36px ＋ 透明拡張で実効 44px を確保する"
    },
    "navItem": {
      "min": 44,
      "recommended": 48
    }
  },
  "elevation": {
    "flat": {
      "offset": 0,
      "bottomBorderWidth": 0
    },
    "raised": {
      "offset": 4,
      "bottomBorderWidth": 4
    }
  },
  "categorical": {
    "1": {
      "hue": "red",
      "base": "#EF4444",
      "subtle": "#FEE2E2",
      "bold": "#B91C1C"
    },
    "2": {
      "hue": "sky",
      "base": "#0EA5E9",
      "subtle": "#E0F2FE",
      "bold": "#0369A1"
    },
    "3": {
      "hue": "teal",
      "base": "#14B8A6",
      "subtle": "#CCFBF1",
      "bold": "#0F766E"
    },
    "4": {
      "hue": "slate",
      "base": "#64748B",
      "subtle": "#F1F5F9",
      "bold": "#334155"
    },
    "5": {
      "hue": "yellow",
      "base": "#EAB308",
      "subtle": "#FEF9C3",
      "bold": "#A16207"
    },
    "6": {
      "hue": "indigo",
      "base": "#6366F1",
      "subtle": "#E0E7FF",
      "bold": "#4338CA"
    },
    "7": {
      "hue": "orange",
      "base": "#F97316",
      "subtle": "#FFEDD5",
      "bold": "#C2410C"
    },
    "8": {
      "hue": "cyan",
      "base": "#06B6D4",
      "subtle": "#CFFAFE",
      "bold": "#0E7490"
    },
    "9": {
      "hue": "pink",
      "base": "#EC4899",
      "subtle": "#FCE7F3",
      "bold": "#BE185D"
    },
    "10": {
      "hue": "rose",
      "base": "#F43F5E",
      "subtle": "#FFE4E6",
      "bold": "#BE123C"
    },
    "11": {
      "hue": "blue",
      "base": "#3B82F6",
      "subtle": "#DBEAFE",
      "bold": "#1D4ED8"
    },
    "12": {
      "hue": "lime",
      "base": "#84CC16",
      "subtle": "#ECFCCB",
      "bold": "#4D7C0F"
    },
    "13": {
      "hue": "amber",
      "base": "#F59E0B",
      "subtle": "#FEF3C7",
      "bold": "#B45309"
    },
    "14": {
      "hue": "fuchsia",
      "base": "#D946EF",
      "subtle": "#FAE8FF",
      "bold": "#A21CAF"
    },
    "15": {
      "hue": "purple",
      "base": "#A855F7",
      "subtle": "#F3E8FF",
      "bold": "#7E22CE"
    },
    "16": {
      "hue": "violet",
      "base": "#8B5CF6",
      "subtle": "#EDE9FE",
      "bold": "#6D28D9"
    }
  },
  "brandExternal": {
    "line": "#06C755",
    "googleBorder": "#DADCE0",
    "apple": "#000000",
    "amazon": "#232F3E",
    "amazonAccent": "#FF9900"
  }
} as const;
