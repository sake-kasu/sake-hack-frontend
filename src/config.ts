// 酒大分類のENUM定義
export const CATEGORY_ENUM = {
  JAPANESE_SAKE: "JAPANESE_SAKE",
  WINE: "WINE",
  FRUIT_WINE: "FRUIT_WINE",
  BEER: "BEER",
  SHOCHU: "SHOCHU",
  AWAMORI: "AWAMORI",
  RIQUEUR: "RIQUEUR",
  NON_ALCOHOL: "NON_ALCOHOL",
  OTHER: "OTHER",
} as const;

export type CategoryEnum = (typeof CATEGORY_ENUM)[keyof typeof CATEGORY_ENUM];

export const CATEGORY_LABEL = {
  [CATEGORY_ENUM.JAPANESE_SAKE]: "日本酒",
  [CATEGORY_ENUM.FRUIT_WINE]: "果実酒",
  [CATEGORY_ENUM.WINE]: "ワイン",
  [CATEGORY_ENUM.BEER]: "ビール",
  [CATEGORY_ENUM.SHOCHU]: "焼酎",
  [CATEGORY_ENUM.AWAMORI]: "泡盛",
  [CATEGORY_ENUM.RIQUEUR]: "リキュール",
  [CATEGORY_ENUM.NON_ALCOHOL]: "ノンアルコール",
  [CATEGORY_ENUM.OTHER]: "その他",
} as const;

// 酒残量の選択肢
export const remainingVolumeOptions = ["0", "25", "50", "75", "100"];
