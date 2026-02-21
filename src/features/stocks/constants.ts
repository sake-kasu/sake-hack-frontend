// 酒大分類のENUM定義
export const CATEGORY_ENUM = {
  JAPANESE_SAKE: "JAPANESE_SAKE",
  WHISKY: "WHISKY",
  WINE: "WINE",
  BEER: "BEER",
  SHOCHU: "SHOCHU",
  AWAMORI: "AWAMORI",
  RIQUEUR: "RIQUEUR",
  SPIRITS: "SPIRITS",
  FRUIT_WINE: "FRUIT_WINE",
  NON_ALCOHOL: "NON_ALCOHOL",
  OTHER: "OTHER",
} as const;

export type CategoryEnum = (typeof CATEGORY_ENUM)[keyof typeof CATEGORY_ENUM];

export const CATEGORY_LABEL = {
  [CATEGORY_ENUM.JAPANESE_SAKE]: "日本酒",
  [CATEGORY_ENUM.WHISKY]: "ウイスキー",
  [CATEGORY_ENUM.WINE]: "ワイン",
  [CATEGORY_ENUM.BEER]: "ビール",
  [CATEGORY_ENUM.SHOCHU]: "焼酎",
  [CATEGORY_ENUM.AWAMORI]: "泡盛",
  [CATEGORY_ENUM.RIQUEUR]: "リキュール",
  [CATEGORY_ENUM.SPIRITS]: "スピリッツ",
  [CATEGORY_ENUM.FRUIT_WINE]: "果実酒",
  [CATEGORY_ENUM.NON_ALCOHOL]: "ノンアルコール",
  [CATEGORY_ENUM.OTHER]: "その他",
} as const;

const CATEGORY_LABEL_MAP = new Map<string, string>(
  Object.entries(CATEGORY_LABEL),
);

export const getCategoryLabel = (category: string): string => {
  return CATEGORY_LABEL_MAP.get(category) ?? category;
};

// カテゴリカラー
const CATEGORY_COLOR: Record<string, string> = {
  [CATEGORY_ENUM.JAPANESE_SAKE]: "#2B4C7E",
  [CATEGORY_ENUM.WHISKY]: "#8B6914",
  [CATEGORY_ENUM.WINE]: "#722F37",
  [CATEGORY_ENUM.BEER]: "#DAA520",
  [CATEGORY_ENUM.SHOCHU]: "#5B7065",
  [CATEGORY_ENUM.AWAMORI]: "#5B7065",
  [CATEGORY_ENUM.RIQUEUR]: "#8B5E83",
  [CATEGORY_ENUM.SPIRITS]: "#6B6B6B",
  [CATEGORY_ENUM.FRUIT_WINE]: "#A0522D",
  [CATEGORY_ENUM.NON_ALCOHOL]: "#8FA9B8",
  [CATEGORY_ENUM.OTHER]: "#6B6B6B",
};

export const getCategoryColor = (category: string): string => {
  return CATEGORY_COLOR[category] ?? "#6B6B6B";
};

// 酒残量の選択肢
export const remainingVolumeOptions = ["0", "25", "50", "75", "100"];
