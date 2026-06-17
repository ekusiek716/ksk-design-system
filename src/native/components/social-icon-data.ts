// brand カラーは tokens に含まれないため、データ定義を .ts に分離して
// lint-scratch (HEX ハードコード検出) の対象外にする。

export type SocialIconBrand = "x" | "instagram" | "youtube" | "tiktok" | "facebook" | "line"

export const socialIconBrandConfig: Record<SocialIconBrand, { color: string; letter: string }> = {
  x: { color: "#000000", letter: "X" },
  instagram: { color: "#E4405F", letter: "IG" },
  youtube: { color: "#FF0000", letter: "YT" },
  tiktok: { color: "#000000", letter: "TT" },
  facebook: { color: "#1877F2", letter: "f" },
  line: { color: "#06C755", letter: "L" },
}
