export declare const scales: {
    readonly spacing: {
        readonly unit: 4;
        readonly scale: readonly [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60];
    };
    readonly borderRadius: {
        readonly none: 0;
        readonly sm: 4;
        readonly md: 6;
        readonly lg: 8;
        readonly xl: 12;
        readonly "2xl": 16;
        readonly full: 9999;
    };
    readonly typography: {
        readonly heading: {
            readonly "3xl": {
                readonly fontSize: 28;
                readonly fontWeight: "700";
                readonly lineHeight: 42;
                readonly letterSpacing: 1.12;
            };
            readonly "2xl": {
                readonly fontSize: 24;
                readonly fontWeight: "700";
                readonly lineHeight: 36;
                readonly letterSpacing: 0.96;
            };
            readonly xl: {
                readonly fontSize: 21;
                readonly fontWeight: "700";
                readonly lineHeight: 32;
                readonly letterSpacing: 0.84;
            };
            readonly lg: {
                readonly fontSize: 18;
                readonly fontWeight: "700";
                readonly lineHeight: 27;
                readonly letterSpacing: 0.72;
            };
            readonly md: {
                readonly fontSize: 16;
                readonly fontWeight: "700";
                readonly lineHeight: 24;
                readonly letterSpacing: 0.64;
            };
            readonly sm: {
                readonly fontSize: 14;
                readonly fontWeight: "700";
                readonly lineHeight: 21;
                readonly letterSpacing: 0.56;
            };
        };
        readonly body: {
            readonly lg: {
                readonly fontSize: 16;
                readonly fontWeight: "400";
                readonly lineHeight: 28;
            };
            readonly md: {
                readonly fontSize: 14;
                readonly fontWeight: "400";
                readonly lineHeight: 25;
            };
            readonly sm: {
                readonly fontSize: 12;
                readonly fontWeight: "400";
                readonly lineHeight: 18;
            };
            readonly xs: {
                readonly fontSize: 10;
                readonly fontWeight: "400";
                readonly lineHeight: 15;
            };
        };
        readonly label: {
            readonly lg: {
                readonly fontSize: 16;
                readonly fontWeight: "700";
                readonly lineHeight: 24;
                readonly letterSpacing: 0.64;
            };
            readonly md: {
                readonly fontSize: 14;
                readonly fontWeight: "700";
                readonly lineHeight: 21;
                readonly letterSpacing: 0.56;
            };
            readonly sm: {
                readonly fontSize: 12;
                readonly fontWeight: "500";
                readonly lineHeight: 18;
            };
            readonly xs: {
                readonly fontSize: 10;
                readonly fontWeight: "500";
                readonly lineHeight: 15;
            };
        };
        readonly display: {
            readonly xl: {
                readonly fontSize: 48;
                readonly fontWeight: "700";
                readonly lineHeight: 60;
                readonly letterSpacing: -0.96;
            };
            readonly lg: {
                readonly fontSize: 36;
                readonly fontWeight: "700";
                readonly lineHeight: 47;
                readonly letterSpacing: -0.36;
            };
        };
        readonly caption: {
            readonly fontSize: 11;
            readonly fontWeight: "400";
            readonly lineHeight: 17;
        };
    };
    readonly shadows: {
        readonly sm: {
            readonly boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
            readonly elevation: 1;
        };
        readonly md: {
            readonly boxShadow: "0 0 8px rgba(20, 20, 20, 0.08)";
            readonly elevation: 3;
        };
        readonly lg: {
            readonly boxShadow: "0px 12px 32px -4px rgba(17, 24, 39, 0.12), 0px 8px 16px -6px rgba(17, 24, 39, 0.12)";
            readonly elevation: 8;
        };
        readonly dialog: {
            readonly boxShadow: "0px 12px 32px -4px rgba(17, 24, 39, 0.12), 0px 8px 16px -6px rgba(17, 24, 39, 0.12), 0px 1px 4px 1px rgba(0, 0, 0, 0.2)";
            readonly elevation: 12;
        };
        readonly tooltip: {
            readonly boxShadow: "0px 8px 8px -4px rgba(17, 24, 39, 0.08), 0px 4px 6px -4px rgba(17, 24, 39, 0.12)";
            readonly elevation: 6;
        };
    };
    readonly touchTargets: {
        readonly buttonCTA: {
            readonly min: 44;
            readonly recommended: 48;
        };
        readonly iconButton: {
            readonly min: 44;
            readonly recommended: 48;
        };
        readonly textInput: {
            readonly min: 44;
            readonly recommended: 48;
        };
        readonly chip: {
            readonly min: 32;
            readonly recommended: 36;
            readonly hitSlop: "視覚 32〜36px ＋ 透明拡張で実効 44px を確保する";
        };
        readonly navItem: {
            readonly min: 44;
            readonly recommended: 48;
        };
    };
    readonly categorical: {
        readonly "1": {
            readonly hue: "red";
            readonly base: "#EF4444";
            readonly subtle: "#FEE2E2";
            readonly bold: "#B91C1C";
        };
        readonly "2": {
            readonly hue: "sky";
            readonly base: "#0EA5E9";
            readonly subtle: "#E0F2FE";
            readonly bold: "#0369A1";
        };
        readonly "3": {
            readonly hue: "teal";
            readonly base: "#14B8A6";
            readonly subtle: "#CCFBF1";
            readonly bold: "#0F766E";
        };
        readonly "4": {
            readonly hue: "slate";
            readonly base: "#64748B";
            readonly subtle: "#F1F5F9";
            readonly bold: "#334155";
        };
        readonly "5": {
            readonly hue: "yellow";
            readonly base: "#EAB308";
            readonly subtle: "#FEF9C3";
            readonly bold: "#A16207";
        };
        readonly "6": {
            readonly hue: "indigo";
            readonly base: "#6366F1";
            readonly subtle: "#E0E7FF";
            readonly bold: "#4338CA";
        };
        readonly "7": {
            readonly hue: "orange";
            readonly base: "#F97316";
            readonly subtle: "#FFEDD5";
            readonly bold: "#C2410C";
        };
        readonly "8": {
            readonly hue: "cyan";
            readonly base: "#06B6D4";
            readonly subtle: "#CFFAFE";
            readonly bold: "#0E7490";
        };
        readonly "9": {
            readonly hue: "pink";
            readonly base: "#EC4899";
            readonly subtle: "#FCE7F3";
            readonly bold: "#BE185D";
        };
        readonly "10": {
            readonly hue: "rose";
            readonly base: "#F43F5E";
            readonly subtle: "#FFE4E6";
            readonly bold: "#BE123C";
        };
        readonly "11": {
            readonly hue: "blue";
            readonly base: "#3B82F6";
            readonly subtle: "#DBEAFE";
            readonly bold: "#1D4ED8";
        };
        readonly "12": {
            readonly hue: "lime";
            readonly base: "#84CC16";
            readonly subtle: "#ECFCCB";
            readonly bold: "#4D7C0F";
        };
        readonly "13": {
            readonly hue: "amber";
            readonly base: "#F59E0B";
            readonly subtle: "#FEF3C7";
            readonly bold: "#B45309";
        };
        readonly "14": {
            readonly hue: "fuchsia";
            readonly base: "#D946EF";
            readonly subtle: "#FAE8FF";
            readonly bold: "#A21CAF";
        };
        readonly "15": {
            readonly hue: "purple";
            readonly base: "#A855F7";
            readonly subtle: "#F3E8FF";
            readonly bold: "#7E22CE";
        };
        readonly "16": {
            readonly hue: "violet";
            readonly base: "#8B5CF6";
            readonly subtle: "#EDE9FE";
            readonly bold: "#6D28D9";
        };
    };
    readonly brandExternal: {
        readonly line: "#06C755";
        readonly googleBorder: "#DADCE0";
        readonly apple: "#000000";
        readonly amazon: "#232F3E";
        readonly amazonAccent: "#FF9900";
    };
};
